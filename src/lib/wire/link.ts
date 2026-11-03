import { useWire } from "@/lib/wire/store";
import type { BotCommand } from "@/lib/wire/types";

export const OWNER_CHAT_ID = 100000001;
export const SCRIPT_BASE = "http://127.0.0.1:8787";

function origin() {
  const configured = import.meta.env.VITE_BOT_API;
  return configured ? String(configured).replace(/\/$/, "") : "/wire-api";
}

function wireUrl(path: string) {
  return `${origin()}${path}`;
}

async function post(path: string, body: unknown) {
  const response = await fetch(wireUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(String(response.status));
  return response;
}

export async function syncBots(options?: { commands?: boolean }) {
  const state = useWire.getState();
  await post("/wire/bots", {
    prune: true,
    owner: {
      id: OWNER_CHAT_ID,
      first_name: state.profile.name || "ASP",
      username: state.profile.username || "asp",
    },
    bots: state.bots.map((bot) => ({
      token: bot.token,
      userId: bot.userId,
      name: bot.name,
      username: bot.username,
      ...(options?.commands ? { commands: bot.commands } : {}),
    })),
  });
}

export async function pushIncoming(token: string, text: string) {
  try {
    await syncBots();
    await post("/wire/incoming", { token, text });
  } catch {
    useWire.getState().notify("Bot API is not running. Open WIRE on this PC, then start the script.");
  }
}

type OutEvent = {
  seq: number;
  token: string;
  kind: "message" | "edit" | "commands";
  message_id?: number;
  text?: string;
  commands?: BotCommand[];
};

export async function pullOutbound() {
  const response = await fetch(wireUrl("/wire/outbound"));
  if (!response.ok) return;
  const data = (await response.json()) as { messages?: OutEvent[] };
  const events = data.messages ?? [];
  const acked: number[] = [];
  for (const event of events) {
    const applied = useWire.getState().applyScriptEvent(event.token, event);
    if (applied) acked.push(event.seq);
  }
  if (acked.length) await post("/wire/ack", { ids: acked });
}

export async function tick() {
  try {
    await syncBots();
    await pullOutbound();
  } catch {
    /* API down until the desktop app or the preview server starts it */
  }
}
