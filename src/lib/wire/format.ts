import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import type { Chat, Contact, Message } from "@/lib/wire/types";

export function listTime(ts: number): string {
  if (isToday(ts)) return format(ts, "HH:mm");
  if (isYesterday(ts)) return "Yesterday";
  if (isThisWeek(ts, { weekStartsOn: 1 })) return format(ts, "EEE");
  return format(ts, "dd.MM.yy");
}

export function bubbleTime(ts: number): string {
  return format(ts, "HH:mm");
}

export function dayLabel(ts: number): string {
  if (isToday(ts)) return "Today";
  if (isYesterday(ts)) return "Yesterday";
  return format(ts, "MMMM d");
}

export function dayKey(ts: number): string {
  return format(ts, "yyyy-MM-dd");
}

export function letterOf(name: string): string {
  const ch = Array.from(name.trim())[0];
  return ch ? ch.toUpperCase() : "?";
}

export function lastTimestamp(messages: Message[] | undefined): number {
  if (!messages?.length) return 0;
  return messages[messages.length - 1]?.createdAt ?? 0;
}

export function previewOf(
  chat: Chat,
  messages: Message[] | undefined,
  contacts: Contact[],
  typing: boolean,
): { prefix: string; text: string; kind: "typing" | "draft" | "text" } {
  if (typing) return { prefix: "", text: "typing…", kind: "typing" };
  const draft = chat.draft.trim();
  if (draft) return { prefix: "Draft: ", text: draft, kind: "draft" };
  const last = messages?.[messages.length - 1];
  if (!last) return { prefix: "", text: "No messages yet", kind: "text" };
  let body = last.text.trim();
  if (last.attachment?.kind === "photo") body = body || "Photo";
  else if (last.attachment?.kind === "voice") body = "Voice message";
  else if (last.attachment?.kind === "file") body = last.attachment.name;
  if (!body) body = "Message";
  const mine = last.senderId === "me";
  if (mine) return { prefix: "You: ", text: body, kind: "text" };
  if (chat.kind === "group") {
    const name = contacts.find((c) => c.id === last.senderId)?.name ?? "Member";
    const short = name.split(" ")[0] ?? name;
    return { prefix: `${short}: `, text: body, kind: "text" };
  }
  return { prefix: "", text: body, kind: "text" };
}

export function subtitle(chat: Chat): { text: string; online: boolean } {
  if (chat.kind === "saved") return { text: "your private notes", online: false };
  if (chat.kind === "channel") {
    const n = chat.subscriberCount ?? 1;
    return {
      text: `${n.toLocaleString("en-US")} subscriber${n === 1 ? "" : "s"}`,
      online: false,
    };
  }
  if (chat.kind === "group") {
    const n = chat.memberIds?.length ?? 1;
    return { text: `${n} member${n === 1 ? "" : "s"}`, online: false };
  }
  if (chat.online) return { text: "online", online: true };
  return { text: chat.lastSeen || "last seen recently", online: false };
}
