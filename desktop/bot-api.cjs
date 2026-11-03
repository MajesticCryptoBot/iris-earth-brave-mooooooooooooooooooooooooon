const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");

const PORT = 8787;
const OWNER_ID = 100000001;

function emptyState() {
  return {
    owner: { id: OWNER_ID, first_name: "ASP", username: "asp" },
    bots: {},
  };
}

function startBotApi({ dataFile, port = PORT } = {}) {
  const file = dataFile || path.join(process.cwd(), ".wire", "bot-api.json");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let state = emptyState();
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    if (parsed && typeof parsed === "object") state = { ...emptyState(), ...parsed, bots: parsed.bots || {} };
  } catch {
    /* first run */
  }

  const waiters = new Map();

  let lastSaved = "";
  function save() {
    const next = JSON.stringify(state);
    if (next === lastSaved) return;
    lastSaved = next;
    fs.writeFileSync(file, next);
  }

  function botByToken(token) {
    return state.bots[token] || null;
  }

  function ensureBot(token) {
    if (!state.bots[token]) {
      state.bots[token] = {
        id: 0,
        name: "Bot",
        username: "bot",
        commands: [],
        webhook: null,
        updates: [],
        nextUpdate: 1,
        nextMessage: 1,
        outbox: [],
        outSeq: 1,
      };
    }
    return state.bots[token];
  }

  function userMessage(text) {
    const owner = state.owner;
    return {
      message_id: 0,
      from: {
        id: owner.id,
        is_bot: false,
        first_name: owner.first_name || "ASP",
        username: owner.username || "asp",
      },
      chat: {
        id: owner.id,
        type: "private",
        first_name: owner.first_name || "ASP",
        username: owner.username || "asp",
      },
      date: Math.floor(Date.now() / 1000),
      text: String(text ?? ""),
    };
  }

  function botMessage(bot, text, chatId) {
    const id = bot.nextMessage++;
    const chat = Number(chatId) || state.owner.id;
    return {
      message_id: id,
      from: { id: bot.id || 1, is_bot: true, first_name: bot.name, username: bot.username },
      chat: {
        id: chat,
        type: "private",
        first_name: state.owner.first_name || "ASP",
        username: state.owner.username || "asp",
      },
      date: Math.floor(Date.now() / 1000),
      text: String(text ?? ""),
    };
  }

  function enqueueOut(bot, item) {
    if (!state.nextSeq) state.nextSeq = 1;
    const seq = state.nextSeq++;
    bot.outbox.push({ seq, ...item });
    if (bot.outbox.length > 400) bot.outbox.splice(0, bot.outbox.length - 400);
  }

  function confirm(bot, offset) {
    const value = Number(offset);
    if (!value) return;
    bot.updates = bot.updates.filter((update) => update.update_id >= value);
  }

  function pending(bot, offset, limit) {
    confirm(bot, offset);
    const count = Math.min(Math.max(Number(limit) || 100, 1), 100);
    return bot.updates.slice(0, count);
  }

  function wake(token) {
    const list = waiters.get(token);
    if (!list) return;
    const bot = state.bots[token];
    if (!bot) return;
    for (const waiter of [...list]) {
      const updates = pending(bot, waiter.offset, waiter.limit);
      if (!updates.length) continue;
      clearTimeout(waiter.timer);
      list.splice(list.indexOf(waiter), 1);
      if (!waiter.res.writableEnded) send(waiter.res, 200, { ok: true, result: updates });
    }
  }

  function pushUpdate(token, text) {
    const bot = botByToken(token);
    if (!bot) return false;
    const message = userMessage(text);
    message.message_id = bot.nextMessage++;
    const update = { update_id: bot.nextUpdate++, message };
    if (bot.webhook) {
      postJson(bot.webhook, update);
    } else {
      bot.updates.push(update);
      if (bot.updates.length > 200) bot.updates.splice(0, bot.updates.length - 200);
      wake(token);
    }
    save();
    return true;
  }

  function send(res, code, body) {
    const payload = JSON.stringify(body);
    res.writeHead(code, {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": Buffer.byteLength(payload),
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end(payload);
  }

  function readRaw(req) {
    return new Promise((resolve) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      req.on("error", () => resolve(""));
    });
  }

  function parseBody(req, raw) {
    const query = new URL(req.url || "/", "http://127.0.0.1").searchParams;
    const out = {};
    for (const [key, value] of query.entries()) out[key] = value;
    const type = String(req.headers["content-type"] || "");
    if (!raw) return out;
    if (type.includes("application/json") || raw.trim().startsWith("{")) {
      try {
        Object.assign(out, JSON.parse(raw));
      } catch {
        /* ignore */
      }
      return out;
    }
    if (type.includes("application/x-www-form-urlencoded")) {
      for (const part of raw.split("&")) {
        const [key, value = ""] = part.split("=");
        if (!key) continue;
        out[decodeURIComponent(key)] = decodeURIComponent(value.replace(/\+/g, " "));
      }
      return out;
    }
    const text = raw.match(/name="text"\r\n\r\n([\s\S]*?)\r\n/);
    const caption = raw.match(/name="caption"\r\n\r\n([\s\S]*?)\r\n/);
    const chat = raw.match(/name="chat_id"\r\n\r\n([\s\S]*?)\r\n/);
    if (text) out.text = text[1];
    if (caption) out.caption = caption[1];
    if (chat) out.chat_id = chat[1];
    return out;
  }

  function handleBot(res, token, method, body) {
    const bot = botByToken(token);
    if (!bot) return send(res, 401, { ok: false, error_code: 401, description: "Unauthorized" });
    if (method === "getMe") {
      return send(res, 200, {
        ok: true,
        result: {
          id: bot.id || 1,
          is_bot: true,
          first_name: bot.name,
          username: bot.username,
          can_join_groups: false,
          can_read_all_group_messages: false,
          supports_inline_queries: false,
        },
      });
    }
    if (method === "sendMessage" || method === "sendPhoto" || method === "sendDocument" || method === "sendAnimation") {
      const text = String(body.text || body.caption || (method === "sendMessage" ? "" : method.replace("send", ""))).slice(0, 4096);
      if (!text && method === "sendMessage") {
        return send(res, 400, { ok: false, error_code: 400, description: "Bad Request: text is empty" });
      }
      const message = botMessage(bot, text || "File", body.chat_id);
      enqueueOut(bot, { kind: "message", message_id: message.message_id, text: message.text });
      save();
      return send(res, 200, { ok: true, result: message });
    }
    if (method === "editMessageText") {
      const messageId = Number(body.message_id);
      const text = String(body.text || "").slice(0, 4096);
      if (!messageId || !text) {
        return send(res, 400, { ok: false, error_code: 400, description: "Bad Request: message_id and text are required" });
      }
      enqueueOut(bot, { kind: "edit", message_id: messageId, text });
      save();
      const message = botMessage(bot, text, body.chat_id);
      message.message_id = messageId;
      return send(res, 200, { ok: true, result: message });
    }
    if (method === "getUpdates") {
      if (bot.webhook) {
        return send(res, 409, {
          ok: false,
          error_code: 409,
          description: "Conflict: can't use getUpdates method while webhook is active",
        });
      }
      const offset = body.offset;
      const limit = body.limit;
      const timeout = Math.min(Math.max(Number(body.timeout) || 0, 0), 50);
      const updates = pending(bot, offset, limit);
      if (updates.length || timeout === 0) {
        save();
        return send(res, 200, { ok: true, result: updates });
      }
      const list = waiters.get(token) || [];
      const waiter = { res, offset, limit, timer: null };
      waiter.timer = setTimeout(() => {
        const current = waiters.get(token) || [];
        const index = current.indexOf(waiter);
        if (index >= 0) current.splice(index, 1);
        if (!res.writableEnded) {
          save();
          send(res, 200, { ok: true, result: pending(bot, offset, limit) });
        }
      }, timeout * 1000);
      res.on("close", () => {
        clearTimeout(waiter.timer);
        const current = waiters.get(token) || [];
        const index = current.indexOf(waiter);
        if (index >= 0) current.splice(index, 1);
      });
      list.push(waiter);
      waiters.set(token, list);
      return;
    }
    if (method === "setMyCommands") {
      let commands = body.commands;
      if (typeof commands === "string") {
        try {
          commands = JSON.parse(commands);
        } catch {
          commands = [];
        }
      }
      bot.commands = Array.isArray(commands)
        ? commands
            .map((command) => ({
              command: String(command.command || "").replace(/^\//, "").toLowerCase(),
              description: String(command.description || "").slice(0, 80),
            }))
            .filter((command) => command.command)
            .slice(0, 40)
        : [];
      enqueueOut(bot, { kind: "commands", commands: bot.commands });
      save();
      return send(res, 200, { ok: true, result: true });
    }
    if (method === "getMyCommands") {
      return send(res, 200, { ok: true, result: bot.commands || [] });
    }
    if (method === "deleteWebhook") {
      bot.webhook = null;
      save();
      return send(res, 200, { ok: true, result: true });
    }
    if (method === "setWebhook") {
      bot.webhook = body.url ? String(body.url) : null;
      save();
      return send(res, 200, { ok: true, result: true });
    }
    if (method === "getWebhookInfo") {
      return send(res, 200, {
        ok: true,
        result: { url: bot.webhook || "", has_custom_certificate: false, pending_update_count: bot.updates.length },
      });
    }
    if (method === "deleteMyCommands") {
      bot.commands = [];
      enqueueOut(bot, { kind: "commands", commands: [] });
      save();
      return send(res, 200, { ok: true, result: true });
    }
    if (
      method === "sendChatAction" ||
      method === "answerCallbackQuery" ||
      method === "deleteMessage" ||
      method === "pinChatMessage" ||
      method === "unpinChatMessage" ||
      method === "unpinAllChatMessages" ||
      method === "setChatMenuButton" ||
      method === "leaveChat" ||
      method === "setMyDescription" ||
      method === "setMyShortDescription" ||
      method === "setMyName" ||
      method === "logOut" ||
      method === "close"
    ) {
      return send(res, 200, { ok: true, result: true });
    }
    if (method === "getChat") {
      return send(res, 200, {
        ok: true,
        result: {
          id: state.owner.id,
          type: "private",
          first_name: state.owner.first_name,
          username: state.owner.username,
        },
      });
    }
    return send(res, 404, { ok: false, error_code: 404, description: `Not Found: method "${method}"` });
  }

  function handleWire(res, pathname, body) {
    if (pathname === "/wire/health") return send(res, 200, { ok: true, port });
    if (pathname === "/wire/bots" && body && Array.isArray(body.bots)) {
      if (body.owner && body.owner.id) {
        state.owner = {
          id: Number(body.owner.id) || OWNER_ID,
          first_name: String(body.owner.first_name || "ASP").slice(0, 32),
          username: String(body.owner.username || "asp").slice(0, 32),
        };
      }
      const seen = new Set();
      for (const item of body.bots) {
        if (!item || !item.token) continue;
        seen.add(item.token);
        const bot = ensureBot(String(item.token));
        bot.id = Number(item.userId) || bot.id;
        bot.name = String(item.name || bot.name);
        bot.username = String(item.username || bot.username);
        if (Array.isArray(item.commands)) {
          bot.commands = item.commands
            .map((command) => ({
              command: String(command.command || "").replace(/^\//, "").toLowerCase(),
              description: String(command.description || "").slice(0, 80),
            }))
            .filter((command) => command.command)
            .slice(0, 40);
        }
      }
      if (body.prune) {
        for (const token of Object.keys(state.bots)) {
          if (!seen.has(token)) delete state.bots[token];
        }
      }
      save();
      return send(res, 200, { ok: true });
    }
    if (pathname === "/wire/incoming") {
      const token = String(body.token || "");
      const text = String(body.text || "");
      if (!token || !text) return send(res, 400, { ok: false, description: "token and text are required" });
      if (!pushUpdate(token, text)) return send(res, 401, { ok: false, error_code: 401, description: "Unauthorized" });
      return send(res, 200, { ok: true, chat_id: state.owner.id });
    }
    if (pathname === "/wire/outbound") {
      const messages = [];
      for (const [token, bot] of Object.entries(state.bots)) {
        for (const item of bot.outbox) messages.push({ token, ...item });
      }
      messages.sort((a, b) => a.seq - b.seq);
      return send(res, 200, { ok: true, chat_id: state.owner.id, messages });
    }
    if (pathname === "/wire/ack") {
      const ids = new Set((body.ids || []).map(Number));
      for (const bot of Object.values(state.bots)) {
        bot.outbox = bot.outbox.filter((item) => !ids.has(item.seq));
      }
      save();
      return send(res, 200, { ok: true });
    }
    return send(res, 404, { ok: false, description: "not found" });
  }

  const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }
    const url = new URL(req.url || "/", "http://127.0.0.1");
    const raw = req.method === "GET" || req.method === "HEAD" ? "" : await readRaw(req);
    const body = parseBody(req, raw);
    const match = url.pathname.match(/^\/bot([^/]+)\/([A-Za-z0-9_]+)$/);
    if (match) return handleBot(res, decodeURIComponent(match[1]), match[2], body);
    if (url.pathname.startsWith("/wire/")) return handleWire(res, url.pathname, body);
    if (url.pathname === "/") {
      return send(res, 200, { ok: true, description: "WIRE Bot API", port });
    }
    return send(res, 404, { ok: false, error_code: 404, description: "Not Found" });
  });

  server.on("error", (error) => {
    if (error.code !== "EADDRINUSE") console.error(error);
  });
  server.listen(port, "127.0.0.1");
  return server;
}

function postJson(target, payload) {
  try {
    const url = new URL(target);
    const lib = url.protocol === "https:" ? https : http;
    const data = JSON.stringify(payload);
    const req = lib.request(
      url,
      { method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(data) } },
      (res) => res.resume(),
    );
    req.on("error", () => {});
    req.write(data);
    req.end();
  } catch {
    /* bad webhook url */
  }
}

module.exports = { startBotApi, PORT, OWNER_ID };

if (require.main === module) {
  startBotApi({ port: Number(process.env.WIRE_BOT_PORT || PORT) });
}
