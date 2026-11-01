import {
  Check,
  CheckCheck,
  ChevronDown,
  CornerUpLeft,
  FileText,
  Mic,
  MoreVertical,
  Paperclip,
  Pause,
  Phone,
  Play,
  Search,
  Send,
  Smile,
  Video,
  X,
  ArrowLeft,
  Pin,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar, RichText } from "@/components/wire/ui";
import { bubbleTime, dayKey, dayLabel, subtitle } from "@/lib/wire/format";
import { useWire } from "@/lib/wire/store";
import {
  AVATAR_TEXT,
  type Attachment,
  type Message,
} from "@/lib/wire/types";
import { cn } from "@/lib/utils";

const EMOJI = [
  "😀", "😁", "😂", "🤣", "😊", "😍", "😘", "😎",
  "🤔", "😴", "😮", "😢", "😡", "👍", "👎", "👏",
  "🔥", "❤️", "✨", "🎉", "✅", "📌", "💬", "📰",
  "📷", "📎", "⏰", "💡", "📈", "📉", "☕", "🌙",
];

function VoiceNote({ duration }: { duration: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setPlaying((value) => !value)}
      className="flex min-w-52 items-center gap-2 py-1"
      aria-label={playing ? "Pause voice message" : "Play voice message"}
    >
      <span className="grid size-9 place-items-center rounded-full bg-accent text-selected-fg">
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </span>
      <span className={cn("flex h-6 flex-1 items-end gap-0.5", playing && "voice-on")}>
        {Array.from({ length: 18 }, (_, index) => (
          <span
            key={index}
            className="w-0.5 rounded-full bg-accent"
            style={{
              height: `${8 + ((index * 17) % 14)}px`,
              animationDelay: `${index * 40}ms`,
            }}
          />
        ))}
      </span>
      <span className="text-xs text-muted">{duration}</span>
    </button>
  );
}

export function Conversation({
  chatId,
  onBack,
  onInfo,
  onCall,
  onMessageMenu,
  command,
}: {
  chatId: string;
  onBack: () => void;
  onInfo: () => void;
  onCall: (kind: "voice" | "video") => void;
  onMessageMenu: (message: Message, x: number, y: number) => void;
  command: { mode: "reply" | "edit"; id: string; n: number; chatId: string } | null;
}) {
  const chat = useWire((s) => s.chats.find((item) => item.id === chatId));
  const messages = useWire((s) => s.messages[chatId] ?? []);
  const contacts = useWire((s) => s.contacts);
  const typing = useWire((s) => s.typingChatId === chatId);
  const setDraft = useWire((s) => s.setDraft);
  const sendMessage = useWire((s) => s.sendMessage);
  const editMessage = useWire((s) => s.editMessage);
  const notify = useWire((s) => s.notify);

  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [replyId, setReplyId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [atBottom, setAtBottom] = useState(true);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [boundary, setBoundary] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchOpen(false);
    setSearch("");
    setReplyId(null);
    setEditId(null);
    setEmojiOpen(false);
    setAttachOpen(false);
    setRecording(false);
    const unread = useWire.getState().chats.find((item) => item.id === chatId)?.unread ?? 0;
    const list = useWire.getState().messages[chatId] ?? [];
    if (unread > 0 && list.length >= unread) {
      setBoundary(list[list.length - unread]?.id ?? null);
    } else {
      setBoundary(null);
    }
  }, [chatId]);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setAtBottom(true);
  }, [chatId]);

  useEffect(() => {
    if (!atBottom) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [atBottom, messages.length, typing]);

  useEffect(() => {
    if (!command || command.chatId !== chatId) return;
    if (command.mode === "reply") {
      setEditId(null);
      setReplyId(command.id);
      boxRef.current?.focus();
      return;
    }
    const message = (useWire.getState().messages[chatId] ?? []).find((item) => item.id === command.id);
    if (!message) return;
    setReplyId(null);
    setEditId(message.id);
    setDraft(chatId, message.text);
    boxRef.current?.focus();
  }, [chatId, command, setDraft]);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  if (!chat) return null;
  const status = subtitle(chat);
  const draft = chat.draft;
  const editing = editId ? messages.find((item) => item.id === editId) : undefined;
  const replying = replyId ? messages.find((item) => item.id === replyId) : undefined;
  const needle = search.trim().toLowerCase();
  const visible = needle
    ? messages.filter((item) => item.text.toLowerCase().includes(needle))
    : messages;
  const pinned = messages.find((item) => item.pinned);
  const canCall = chat.kind === "private" || chat.kind === "group";

  function grow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }

  function send() {
    if (editing) {
      editMessage(chatId, editing.id, draft);
      setEditId(null);
      setDraft(chatId, "");
      return;
    }
    if (!draft.trim()) return;
    sendMessage({ chatId, text: draft, replyToId: replying?.id });
    setReplyId(null);
    setEmojiOpen(false);
    if (boxRef.current) boxRef.current.style.height = "auto";
  }

  async function takeFile(file: File, kind: "photo" | "file") {
    let dataUrl: string | undefined;
    if (kind === "photo" && file.size <= 160_000) {
      const url = await file.arrayBuffer().then((buf) => {
        const bytes = new Uint8Array(buf);
        let binary = "";
        for (const byte of bytes) binary += String.fromCharCode(byte);
        return `data:${file.type || "image/png"};base64,${btoa(binary)}`;
      });
      dataUrl = url.length > 220_000 ? undefined : url;
    }
    if (kind === "photo" && !dataUrl) {
      notify("Image kept as a file — too large to store on this device.");
    }
    const attachment: Attachment = {
      kind: dataUrl ? "photo" : "file",
      name: file.name,
      dataUrl,
    };
    sendMessage({ chatId, text: "", attachment, replyToId: replying?.id });
    setReplyId(null);
    setAttachOpen(false);
  }

  function stopRecording(sendIt: boolean) {
    const spent = seconds;
    setRecording(false);
    setSeconds(0);
    if (!sendIt) return;
    const duration = `0:${String(Math.max(1, spent)).padStart(2, "0")}`;
    sendMessage({
      chatId,
      text: "",
      replyToId: replying?.id,
      attachment: { kind: "voice", name: "Voice message", duration },
    });
    setReplyId(null);
  }

  function senderName(senderId: string): string {
    if (senderId === "me") return "You";
    return contacts.find((item) => item.id === senderId)?.name ?? chat?.title ?? "WIRE";
  }

  return (
    <div className="relative flex h-full min-h-0 min-w-0 flex-1 flex-col bg-chat">
      <header className="flex h-14 shrink-0 items-center gap-1 border-b border-line bg-header px-1">
        <button
          type="button"
          aria-label="Back"
          onClick={onBack}
          className="grid size-11 place-items-center text-muted md:hidden"
        >
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={onInfo}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1 text-left hover:bg-hover"
        >
          <Avatar
            avatarKey={chat.avatarKey}
            letter={chat.letter}
            saved={chat.kind === "saved"}
            online={chat.online}
            className="size-10 text-sm"
            iconClassName="size-4"
            dotClassName="size-2.5"
          />
          <span className="min-w-0">
            <span className="block truncate text-base font-medium">{chat.title}</span>
            <span className={cn("block truncate text-xs", status.online || typing ? "text-accent" : "text-muted")}>
              {typing ? "typing…" : status.text}
            </span>
          </span>
        </button>
        <button
          type="button"
          aria-label="Search in chat"
          onClick={() => setSearchOpen((value) => !value)}
          className="grid size-11 place-items-center text-muted"
        >
          <Search className="size-5" />
        </button>
        {canCall ? (
          <>
            <button
              type="button"
              aria-label="Voice call"
              onClick={() => onCall("voice")}
              className="hidden size-11 place-items-center text-muted sm:grid"
            >
              <Phone className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Video call"
              onClick={() => onCall("video")}
              className="hidden size-11 place-items-center text-muted sm:grid"
            >
              <Video className="size-5" />
            </button>
          </>
        ) : null}
        <button
          type="button"
          aria-label="Chat info"
          onClick={onInfo}
          className="grid size-11 place-items-center text-muted"
        >
          <MoreVertical className="size-5" />
        </button>
      </header>

      {searchOpen ? (
        <div className="flex shrink-0 items-center gap-2 border-b border-line bg-header px-3 py-2">
          <input
            autoFocus
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search this chat"
            aria-label="Search this chat"
            className="h-10 min-w-0 flex-1 rounded-full bg-input px-4 text-sm outline-none"
          />
          <span className="shrink-0 text-xs text-muted">{visible.length}</span>
        </div>
      ) : null}

      {pinned && !needle ? (
        <button
          type="button"
          onClick={() => document.getElementById(`msg-${pinned.id}`)?.scrollIntoView({ block: "center" })}
          className="flex shrink-0 items-center gap-3 border-b border-line bg-header px-4 py-2 text-left"
        >
          <Pin className="size-4 text-accent" />
          <span className="min-w-0">
            <span className="block text-xs font-medium text-accent">Pinned message</span>
            <span className="block truncate text-sm text-muted">
              {pinned.text || pinned.attachment?.name || "Attachment"}
            </span>
          </span>
        </button>
      ) : null}

      <div
        ref={scrollerRef}
        onScroll={() => {
          const el = scrollerRef.current;
          if (!el) return;
          const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
          setAtBottom(gap < 80);
        }}
        className="chat-wallpaper min-h-0 flex-1 overflow-y-auto px-3 py-3"
      >
        {visible.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">
            {needle ? "No messages found" : "No messages yet"}
          </p>
        ) : (
          <div className="flex flex-col">
            {visible.map((message, index) => {
              const prev = visible[index - 1];
              const next = visible[index + 1];
              const showDay = !prev || dayKey(prev.createdAt) !== dayKey(message.createdAt);
              const mine = message.senderId === "me";
              const gap = !prev || message.createdAt - prev.createdAt > 5 * 60_000;
              const first = showDay || !prev || prev.senderId !== message.senderId || gap;
              const tail =
                !next ||
                next.senderId !== message.senderId ||
                next.createdAt - message.createdAt > 5 * 60_000 ||
                dayKey(next.createdAt) !== dayKey(message.createdAt);
              const sender = contacts.find((item) => item.id === message.senderId);
              const reply = message.replyToId
                ? messages.find((item) => item.id === message.replyToId)
                : undefined;
              return (
                <div key={message.id} id={`msg-${message.id}`}>
                  {showDay ? (
                    <div className="my-2 flex justify-center">
                      <span className="rounded-full bg-chip px-3 py-1 text-xs font-medium text-chip-fg">
                        {dayLabel(message.createdAt)}
                      </span>
                    </div>
                  ) : null}
                  {boundary === message.id ? (
                    <div className="my-2 flex justify-center">
                      <span className="rounded-full bg-chip px-3 py-1 text-xs font-medium text-chip-fg">
                        Unread messages
                      </span>
                    </div>
                  ) : null}
                  <div className={cn("flex", mine ? "justify-end" : "justify-start", first ? "mt-2" : "mt-0.5")}>
                    <div
                      className="group relative max-w-full"
                      onDoubleClick={() => {
                        setEditId(null);
                        setReplyId(message.id);
                        boxRef.current?.focus();
                      }}
                      onContextMenu={(event) => {
                        event.preventDefault();
                        onMessageMenu(message, event.clientX, event.clientY);
                      }}
                    >
                      <button
                        type="button"
                        aria-label="Message actions"
                        onClick={(event) => {
                          const rect = event.currentTarget.getBoundingClientRect();
                          onMessageMenu(message, rect.left, rect.bottom);
                        }}
                        className="absolute -right-1 top-0 z-10 grid size-8 place-items-center rounded-full bg-header text-muted opacity-100 elevated sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                      <div
                        className={cn(
                          "bubble px-2.5 py-1.5",
                          mine
                            ? "bg-bubble-out text-bubble-out-fg"
                            : "bg-bubble-in text-bubble-in-fg",
                          tail && (mine ? "tail-out" : "tail-in"),
                        )}
                      >
                        {chat.kind === "group" && !mine && first ? (
                          <div className={cn("px-0.5 text-xs font-semibold", sender ? AVATAR_TEXT[sender.avatarKey] : "text-accent")}>
                            {senderName(message.senderId)}
                          </div>
                        ) : null}
                        {message.forwardedFrom ? (
                          <div className="px-0.5 text-xs italic text-accent">
                            Forwarded from {message.forwardedFrom}
                          </div>
                        ) : null}
                        {reply ? (
                          <div className="mb-1 rounded-md border-l-2 border-accent bg-hover px-2 py-1">
                            <div className="text-xs font-medium text-accent">{senderName(reply.senderId)}</div>
                            <div className="truncate text-xs text-muted">
                              {reply.text || reply.attachment?.name || "Message"}
                            </div>
                          </div>
                        ) : null}
                        {message.attachment?.kind === "photo" && message.attachment.dataUrl ? (
                          <button type="button" onClick={() => setLightbox(message.attachment?.dataUrl ?? null)} className="mb-1 block">
                            <img
                              src={message.attachment.dataUrl}
                              alt={message.attachment.name}
                              className="max-h-56 rounded-lg object-cover"
                            />
                          </button>
                        ) : null}
                        {message.attachment?.kind === "file" ||
                        (message.attachment?.kind === "photo" && !message.attachment.dataUrl) ? (
                          <div className="mb-1 flex items-center gap-2 rounded-lg bg-hover px-2 py-2">
                            <FileText className="size-5 text-accent" />
                            <span className="min-w-0 truncate text-sm">{message.attachment?.name}</span>
                          </div>
                        ) : null}
                        {message.attachment?.kind === "voice" ? (
                          <VoiceNote duration={message.attachment.duration ?? "0:01"} />
                        ) : null}
                        {message.text ? (
                          <div className="whitespace-pre-wrap break-words px-0.5 text-sm">
                            <RichText text={message.text} />
                          </div>
                        ) : null}
                        <div
                          className={cn(
                            "mt-0.5 flex items-center justify-end gap-1 text-xs",
                            mine ? "text-muted-out" : "text-muted",
                          )}
                        >
                          {message.editedAt ? <span>edited</span> : null}
                          <span>{bubbleTime(message.createdAt)}</span>
                          {mine ? (
                            message.status === "read" ? (
                              <CheckCheck className="size-3.5 text-check" />
                            ) : (
                              <Check className="size-3.5" />
                            )
                          ) : null}
                        </div>
                        {message.reactions.length > 0 ? (
                          <div className="mt-1 flex flex-wrap justify-end gap-1">
                            {message.reactions.map((reaction) => (
                              <button
                                key={reaction.emoji}
                                type="button"
                                onClick={() =>
                                  useWire.getState().toggleReaction(chatId, message.id, reaction.emoji)
                                }
                                className={cn(
                                  "rounded-full bg-header px-1.5 py-0.5 text-xs",
                                  reaction.mine && "ring-1 ring-accent",
                                )}
                              >
                                {reaction.emoji} {reaction.count}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {typing ? (
              <div className="mt-2 flex justify-start">
                <div className="bubble tail-in bg-bubble-in px-3 py-2 text-sm text-muted">typing…</div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {!atBottom ? (
        <button
          type="button"
          aria-label="Jump to latest"
          onClick={() => {
            const el = scrollerRef.current;
            if (!el) return;
            el.scrollTop = el.scrollHeight;
          }}
          className="absolute bottom-24 right-4 grid size-11 place-items-center rounded-full bg-header text-accent elevated"
        >
          <ChevronDown className="size-5" />
        </button>
      ) : null}

      {lightbox ? (
        <button
          type="button"
          aria-label="Close photo"
          onClick={() => setLightbox(null)}
          className="absolute inset-0 z-30 grid place-items-center bg-overlay p-6"
        >
          <img src={lightbox} alt="" className="max-h-full max-w-full rounded-lg object-contain" />
        </button>
      ) : null}

      {!chat.canPost ? (
        <div className="flex h-14 shrink-0 items-center justify-center border-t border-line bg-compose text-sm text-muted">
          You can't post in this channel
        </div>
      ) : (
        <div className="shrink-0 border-t border-line bg-compose">
          {editing ? (
            <div className="flex items-center gap-2 border-b border-line px-4 py-2">
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-accent">Edit message</span>
                <span className="block truncate text-xs text-muted">{editing.text}</span>
              </span>
              <button type="button" aria-label="Cancel edit" onClick={() => { setEditId(null); setDraft(chatId, ""); }} className="grid size-9 place-items-center text-muted">
                <X className="size-4" />
              </button>
            </div>
          ) : null}
          {replying && !editing ? (
            <div className="flex items-center gap-2 border-b border-line px-4 py-2">
              <CornerUpLeft className="size-4 text-accent" />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-medium text-accent">{senderName(replying.senderId)}</span>
                <span className="block truncate text-xs text-muted">
                  {replying.text || replying.attachment?.name || "Message"}
                </span>
              </span>
              <button type="button" aria-label="Cancel reply" onClick={() => setReplyId(null)} className="grid size-9 place-items-center text-muted">
                <X className="size-4" />
              </button>
            </div>
          ) : null}
          {emojiOpen ? (
            <div className="grid grid-cols-8 gap-1 border-b border-line px-3 py-2">
              {EMOJI.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className="grid h-10 place-items-center rounded-lg text-xl hover:bg-hover"
                  onClick={() => {
                    setDraft(chatId, `${draft}${emoji}`);
                    boxRef.current?.focus();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex items-end gap-1 px-2 py-2">
            <div className="relative">
              <button
                type="button"
                aria-label="Attach"
                onClick={() => {
                  setAttachOpen((value) => !value);
                  setEmojiOpen(false);
                }}
                className="grid size-11 place-items-center text-muted"
              >
                <Paperclip className="size-5" />
              </button>
              {attachOpen ? (
                <div className="absolute bottom-12 left-0 z-20 w-44 overflow-hidden rounded-xl bg-header py-1 elevated">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-hover"
                    onClick={() => photoRef.current?.click()}
                  >
                    Photo
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-hover"
                    onClick={() => fileRef.current?.click()}
                  >
                    File
                  </button>
                </div>
              ) : null}
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void takeFile(file, "photo");
                }}
              />
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void takeFile(file, "file");
                }}
              />
            </div>
            <button
              type="button"
              aria-label="Emoji"
              onClick={() => {
                setEmojiOpen((value) => !value);
                setAttachOpen(false);
              }}
              className="grid size-11 place-items-center text-muted"
            >
              <Smile className="size-5" />
            </button>
            {recording ? (
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full bg-input px-4 text-sm text-danger">
                <span className="size-2 rounded-full bg-danger" />
                Recording {`0:${String(seconds).padStart(2, "0")}`}
                <button type="button" className="ml-auto text-muted" onClick={() => stopRecording(false)}>
                  Cancel
                </button>
              </div>
            ) : (
              <textarea
                ref={boxRef}
                rows={1}
                value={draft}
                placeholder={chat.kind === "saved" ? "Write a note" : chat.kind === "channel" ? "Broadcast" : "Message"}
                aria-label="Message"
                onChange={(event) => {
                  setDraft(chatId, event.target.value);
                  grow(event.target);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                  if (event.key === "ArrowUp" && !draft.trim() && !editId) {
                    const last = [...messages].reverse().find((item) => item.senderId === "me" && item.text);
                    if (!last) return;
                    setEditId(last.id);
                    setReplyId(null);
                    setDraft(chatId, last.text);
                  }
                  if (event.key === "Escape") {
                    setReplyId(null);
                    setEditId(null);
                    setEmojiOpen(false);
                  }
                }}
                className="max-h-36 min-h-11 flex-1 resize-none rounded-3xl bg-input px-4 py-2.5 text-sm text-fg outline-none placeholder:text-muted"
              />
            )}
            {draft.trim() && !recording ? (
              <button
                type="button"
                aria-label="Send"
                onClick={send}
                className="grid size-11 place-items-center rounded-full bg-accent text-selected-fg"
              >
                <Send className="size-5" />
              </button>
            ) : (
              <button
                type="button"
                aria-label={recording ? "Send voice message" : "Record voice message"}
                onClick={() => {
                  if (recording) stopRecording(true);
                  else {
                    setSeconds(0);
                    setRecording(true);
                  }
                }}
                className="grid size-11 place-items-center text-muted"
              >
                <Mic className={cn("size-5", recording && "text-danger")} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
