import type { Bot, BotCommand, Chat, FatherStep, Message } from "@/lib/wire/types";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function bytes(length: number): Uint8Array {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return buffer;
}

export function randomApiId(): number {
  const value = new DataView(bytes(4).buffer).getUint32(0);
  return 10_000_000 + (value % 80_000_000);
}

export function randomApiHash(): string {
  return [...bytes(16)].map((item) => item.toString(16).padStart(2, "0")).join("");
}

export function botSecret(): string {
  const alphabet = `${ALPHA}_-`;
  let secret = "";
  for (const item of bytes(35)) secret += alphabet[item % alphabet.length];
  return secret;
}

export function makeToken(userId: number): string {
  return `${userId}:${botSecret()}`;
}

export function makeSession(input: {
  apiId: number;
  apiHash: string;
  username: string;
  device: string;
}): string {
  const payload = JSON.stringify({
    v: 1,
    apiId: input.apiId,
    apiHash: input.apiHash,
    user: input.username,
    device: input.device,
    dc: 2,
    issued: Date.now(),
  });
  const encoded = btoa(payload).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
  return `1WIRE${encoded}`;
}

export function validUsername(raw: string): string | null {
  const username = raw.trim().toLowerCase().replace(/^@/, "");
  if (!/^[a-z][a-z0-9_]{3,30}bot$/.test(username)) return null;
  return username;
}

export function parseCommands(text: string): BotCommand[] {
  const commands: BotCommand[] = [];
  for (const line of text.split("\n")) {
    const match = line.trim().match(/^\/?([a-z0-9_]{1,32})\s*[-–—:]\s*(.+)$/i);
    if (!match?.[1] || !match[2]) continue;
    commands.push({ command: match[1].toLowerCase(), description: match[2].trim().slice(0, 80) });
  }
  return commands.slice(0, 20);
}

export function botAnswer(bot: Bot, text: string): string {
  const line = text.trim();
  if (!line.startsWith("/")) {
    return bot.about || `${bot.name} answers commands only. Send /start.`;
  }
  const command = line.slice(1).split(/\s+/)[0]?.split("@")[0]?.toLowerCase() ?? "";
  if (command === "start") {
    return bot.description || bot.about || `Hello. I'm ${bot.name}.`;
  }
  const found = bot.commands.find((item) => item.command === command);
  if (!found) return "Unknown command. Send /start.";
  return found.description || `/${found.command}`;
}

export const FATHER_HELP = `I create and manage bots for this account.

/newbot — name, username, and a token
/mybots — bots you already have
/token — show a token again
/revoke — issue a new token
/setdescription — text /start replies with
/setabouttext — short about line
/setcommands — one command per line
/cancel — stop the current step`;

export function botfatherChat(): Chat {
  return {
    id: "botfather",
    kind: "private",
    title: "BotFather",
    avatarKey: "blue",
    letter: "B",
    folder: "personal",
    peerId: "botfather",
    service: "botfather",
    canPost: true,
    pinned: true,
    muted: false,
    archived: false,
    unread: 0,
    draft: "",
    online: true,
    username: "botfather",
    bio: "Creates bots, tokens, and commands.",
    sample: false,
  };
}

export function botfatherHello(now: number): Message {
  return {
    id: "bf1",
    senderId: "botfather",
    text: FATHER_HELP,
    createdAt: now - 60_000,
    reactions: [],
    status: "read",
  };
}

export type FatherResult =
  | { kind: "say"; father: FatherStep; text: string }
  | { kind: "create"; name: string; username: string }
  | { kind: "save"; botId: string; action: "description" | "about" | "commands"; text: string }
  | { kind: "token"; botId: string }
  | { kind: "revoke"; botId: string };

const PICK = {
  setdescription: "description",
  setabouttext: "about",
  setcommands: "commands",
  token: "token",
  revoke: "revoke",
} as const;

export function interpretFather(raw: string, father: FatherStep, bots: Bot[]): FatherResult {
  const text = raw.trim();
  const command = text.startsWith("/") ? (text.slice(1).split(/\s+/)[0]?.toLowerCase() ?? "") : "";

  if (command === "cancel") return { kind: "say", father: null, text: "Cancelled. Send /help when you want the list." };
  if (command === "start" || command === "help") return { kind: "say", father: null, text: FATHER_HELP };
  if (command === "newbot") {
    return {
      kind: "say",
      father: { kind: "name" },
      text: "Alright, a new bot. How are we going to call it? Send the display name.",
    };
  }
  if (command === "mybots") {
    if (bots.length === 0) return { kind: "say", father: null, text: "You have no bots yet. Send /newbot." };
    return {
      kind: "say",
      father: null,
      text: `Your bots:\n${bots.map((bot) => `@${bot.username} — ${bot.name}`).join("\n")}`,
    };
  }
  if (command && command in PICK) {
    if (bots.length === 0) return { kind: "say", father: null, text: "You have no bots yet. Send /newbot." };
    const action = PICK[command as keyof typeof PICK];
    return {
      kind: "say",
      father: { kind: "pick", action },
      text: `Which bot? Send its username.\n${bots.map((bot) => `@${bot.username}`).join("\n")}`,
    };
  }

  if (!command && father?.kind === "name") {
    if (text.length < 1 || text.length > 32) {
      return { kind: "say", father, text: "Send a name, up to 32 characters." };
    }
    return {
      kind: "say",
      father: { kind: "username", name: text },
      text: "Good. Now send a username. It must end in bot. Example: desk_bot",
    };
  }

  if (!command && father?.kind === "username") {
    return { kind: "create", name: father.name, username: text.replace(/^@/, "") };
  }

  if (!command && father?.kind === "pick") {
    const username = text.toLowerCase().replace(/^@/, "").split(/\s+/)[0] ?? "";
    const bot = bots.find((item) => item.username === username);
    if (!bot) return { kind: "say", father, text: "No bot with that username. Send it again, or /cancel." };
    if (father.action === "token") return { kind: "token", botId: bot.id };
    if (father.action === "revoke") return { kind: "revoke", botId: bot.id };
    const prompt =
      father.action === "commands"
        ? "Send the commands, one per line:\nstart - Welcome\ncut - File the cut"
        : father.action === "description"
          ? "Send the description. /start replies with this."
          : "Send the short about line.";
    return { kind: "say", father: { kind: "text", action: father.action, botId: bot.id }, text: prompt };
  }

  if (!command && father?.kind === "text") {
    return { kind: "save", botId: father.botId, action: father.action, text };
  }

  return { kind: "say", father, text: "I don't know that command. Send /help." };
}
