import {
  Archive,
  ArrowLeft,
  Bookmark,
  Bot,
  Download,
  KeyRound,
  Megaphone,
  Moon,
  PhoneOff,
  Settings,
  Trash2,
  UserRound,
  Users,
  Video,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Avatar, Switch, WireMark } from "@/components/wire/ui";
import { subtitle } from "@/lib/wire/format";
import { OWNER_CHAT_ID, SCRIPT_BASE } from "@/lib/wire/link";
import { useWire } from "@/lib/wire/store";
import type { Chat } from "@/lib/wire/types";
import { cn } from "@/lib/utils";

function PanelHead({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-2">
      <button type="button" aria-label="Back" onClick={onBack} className="grid size-11 place-items-center text-muted">
        <ArrowLeft className="size-5" />
      </button>
      <h2 className="text-base font-semibold">{title}</h2>
    </div>
  );
}

function Row({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-4 px-5 py-3 text-left text-base hover:bg-hover",
        danger && "text-danger",
      )}
    >
      <span className="text-muted">{icon}</span>
      {label}
    </button>
  );
}

export function MenuPanel({
  onClose,
  onSettings,
  onContacts,
  onGroup,
  onChannel,
  onSaved,
  onBots,
  onApi,
}: {
  onClose: () => void;
  onSettings: () => void;
  onContacts: () => void;
  onGroup: () => void;
  onChannel: () => void;
  onSaved: () => void;
  onBots: () => void;
  onApi: () => void;
}) {
  const profile = useWire((s) => s.profile);
  const theme = useWire((s) => s.theme);
  const setTheme = useWire((s) => s.setTheme);
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <div className="flex items-center gap-3 bg-accent px-4 py-5 text-selected-fg">
        <Avatar avatarKey={profile.avatarKey} letter={profile.name.slice(0, 1).toUpperCase()} className="size-16 text-xl" />
        <span className="min-w-0">
          <span className="block truncate text-lg font-semibold">{profile.name}</span>
          <span className="block truncate text-sm text-selected-fg/80">@{profile.username}</span>
        </span>
        <button type="button" aria-label="Close menu" onClick={onClose} className="ml-auto grid size-11 place-items-center">
          <X className="size-5" />
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto py-2">
        <Row icon={<Users className="size-5" />} label="New Group" onClick={onGroup} />
        <Row icon={<Megaphone className="size-5" />} label="New Channel" onClick={onChannel} />
        <Row icon={<UserRound className="size-5" />} label="Contacts" onClick={onContacts} />
        <Row icon={<Bookmark className="size-5" />} label="Saved Messages" onClick={onSaved} />
        <Row icon={<Bot className="size-5" />} label="Bots" onClick={onBots} />
        <Row icon={<KeyRound className="size-5" />} label="API development" onClick={onApi} />
        <Row icon={<Settings className="size-5" />} label="Settings" onClick={onSettings} />
        <InstallerLink />
        <div className="flex items-center gap-4 px-5 py-3">
          <Moon className="size-5 text-muted" />
          <span className="flex-1 text-base">Night Mode</span>
          <Switch
            on={theme === "night"}
            label="Night Mode"
            onToggle={() => setTheme(theme === "night" ? "day" : "night")}
          />
        </div>
      </div>
      <p className="px-5 py-4 text-xs text-muted">WIRE 1.0 · one account, yours</p>
    </div>
  );
}

export function SettingsPanel({ onBack }: { onBack: () => void }) {
  const profile = useWire((s) => s.profile);
  const theme = useWire((s) => s.theme);
  const live = useWire((s) => s.liveReplies);
  const updateProfile = useWire((s) => s.updateProfile);
  const cycleAvatar = useWire((s) => s.cycleAvatar);
  const setTheme = useWire((s) => s.setTheme);
  const setLive = useWire((s) => s.setLiveReplies);
  const clearSamples = useWire((s) => s.clearSamples);
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="Settings" onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-5 flex flex-col items-center gap-3">
          <Avatar
            avatarKey={profile.avatarKey}
            letter={profile.name.slice(0, 1).toUpperCase() || "?"}
            className="size-24 text-3xl"
          />
          <button type="button" onClick={cycleAvatar} className="text-sm font-medium text-accent">
            Change color
          </button>
        </div>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">Name</span>
          <input
            value={profile.name}
            onChange={(event) => updateProfile({ name: event.target.value.slice(0, 32) })}
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">Username</span>
          <input
            value={profile.username}
            onChange={(event) =>
              updateProfile({
                username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16),
              })
            }
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          />
        </label>
        <label className="mb-4 block text-sm">
          <span className="mb-1 block text-xs text-accent">Bio</span>
          <textarea
            value={profile.bio}
            onChange={(event) => updateProfile({ bio: event.target.value.slice(0, 140) })}
            rows={3}
            className="w-full resize-none rounded-xl bg-input px-3 py-2 outline-none"
          />
        </label>
        <div className="mb-3 flex items-center justify-between rounded-xl bg-input px-3 py-3">
          <span className="text-sm">Theme</span>
          <span className="flex gap-1">
            {(["day", "night"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTheme(mode)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  theme === mode ? "bg-accent text-selected-fg" : "text-muted",
                )}
              >
                {mode === "day" ? "Day" : "Night"}
              </button>
            ))}
          </span>
        </div>
        <div className="mb-3 flex items-center justify-between rounded-xl bg-input px-3 py-3">
          <span className="pr-3 text-sm">Replies on this device</span>
          <Switch on={live} label="Replies on this device" onToggle={() => setLive(!live)} />
        </div>
        <p className="mb-4 px-1 text-xs leading-5 text-muted">
          Chats stay on this computer. API id, hash, sessions, and bot tokens are issued here for this account. They do not sign in to Telegram.
        </p>
        <button
          type="button"
          onClick={clearSamples}
          className="h-11 w-full rounded-xl bg-hover text-sm font-medium text-danger"
        >
          Remove sample chats
        </button>
      </div>
    </div>
  );
}

export function ContactsPanel({
  onBack,
  onOpen,
}: {
  onBack: () => void;
  onOpen: (contactId: string) => void;
}) {
  const contacts = useWire((s) => s.contacts);
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="Contacts" onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">No contacts yet.</p>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => onOpen(contact.id)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover"
            >
              <Avatar
                avatarKey={contact.avatarKey}
                letter={contact.letter}
                online={contact.online}
                className="size-12 text-base"
              />
              <span className="min-w-0">
                <span className="block truncate font-medium">{contact.name}</span>
                <span className={cn("block truncate text-sm", contact.online ? "text-accent" : "text-muted")}>
                  {contact.online ? "online" : contact.lastSeen || contact.username}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

export function NewChatPanel({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  const contacts = useWire((s) => s.contacts);
  const createContact = useWire((s) => s.createContact);
  const openDirect = useWire((s) => s.openDirect);
  const [name, setName] = useState("");
  const [q, setQ] = useState("");
  const shown = contacts.filter((contact) => contact.name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="New message" onBack={onBack} />
      <div className="px-3 py-2">
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search contacts"
          aria-label="Search contacts"
          className="h-11 w-full rounded-full bg-input px-4 text-sm outline-none"
        />
      </div>
      <form
        className="flex gap-2 px-3 pb-2"
        onSubmit={(event) => {
          event.preventDefault();
          const id = createContact(name);
          if (id) onOpen(id);
        }}
      >
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="New contact name"
          aria-label="New contact name"
          className="h-11 min-w-0 flex-1 rounded-full bg-input px-4 text-sm outline-none"
        />
        <button type="submit" className="h-11 rounded-full bg-accent px-4 text-sm font-medium text-selected-fg">
          Add
        </button>
      </form>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {shown.map((contact) => (
          <button
            key={contact.id}
            type="button"
            onClick={() => {
              const id = openDirect(contact.id);
              if (id) onOpen(id);
            }}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover"
          >
            <Avatar avatarKey={contact.avatarKey} letter={contact.letter} online={contact.online} className="size-12" />
            <span className="truncate font-medium">{contact.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function NewGroupPanel({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  const contacts = useWire((s) => s.contacts);
  const createGroup = useWire((s) => s.createGroup);
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="New group" onBack={onBack} />
      <div className="space-y-2 px-3 py-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Group name"
          aria-label="Group name"
          className="h-11 w-full rounded-full bg-input px-4 text-sm outline-none"
        />
        <button
          type="button"
          disabled={!title.trim() || picked.length === 0}
          onClick={() => {
            const id = createGroup(title, picked);
            if (id) onOpen(id);
          }}
          className="h-11 w-full rounded-full bg-accent text-sm font-medium text-selected-fg disabled:opacity-40"
        >
          Create
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {contacts.map((contact) => {
          const on = picked.includes(contact.id);
          return (
            <button
              key={contact.id}
              type="button"
              onClick={() =>
                setPicked((list) => (on ? list.filter((id) => id !== contact.id) : [...list, contact.id]))
              }
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover"
            >
              <Avatar avatarKey={contact.avatarKey} letter={contact.letter} className="size-11" />
              <span className="min-w-0 flex-1 truncate">{contact.name}</span>
              <span className={cn("size-5 rounded-full border border-line", on && "border-accent bg-accent")} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function NewChannelPanel({ onBack, onOpen }: { onBack: () => void; onOpen: (id: string) => void }) {
  const createChannel = useWire((s) => s.createChannel);
  const [title, setTitle] = useState("");
  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="New channel" onBack={onBack} />
      <form
        className="space-y-3 px-4 py-4"
        onSubmit={(event) => {
          event.preventDefault();
          const id = createChannel(title);
          if (id) onOpen(id);
        }}
      >
        <p className="text-sm text-muted">Only you post. Subscribers on this device are just you.</p>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Channel name"
          aria-label="Channel name"
          className="h-11 w-full rounded-full bg-input px-4 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="h-11 w-full rounded-full bg-accent text-sm font-medium text-selected-fg disabled:opacity-40"
        >
          Create
        </button>
      </form>
    </div>
  );
}

export function InfoPanel({ chat, onClose }: { chat: Chat; onClose: () => void }) {
  const contacts = useWire((s) => s.contacts);
  const messages = useWire((s) => s.messages[chat.id] ?? []);
  const toggleMute = useWire((s) => s.toggleMute);
  const togglePin = useWire((s) => s.togglePinChat);
  const toggleArchive = useWire((s) => s.toggleArchive);
  const clearHistory = useWire((s) => s.clearHistory);
  const deleteChat = useWire((s) => s.deleteChat);
  const openDirect = useWire((s) => s.openDirect);
  const setForeground = useWire((s) => s.setForeground);
  const status = subtitle(chat);
  const bot = useWire((s) => s.bots.find((item) => item.chatId === chat.id));
  const notify = useWire((s) => s.notify);
  const media = messages.filter((item) => item.attachment).length;
  const [confirm, setConfirm] = useState<null | "clear" | "delete">(null);

  return (
    <aside className="absolute inset-y-0 right-0 z-20 flex w-full flex-col border-l border-line bg-header sm:w-info xl:static">
      <div className="flex h-14 shrink-0 items-center gap-2 px-2">
        <button type="button" aria-label="Close info" onClick={onClose} className="grid size-11 place-items-center text-muted">
          <X className="size-5" />
        </button>
        <h2 className="text-base font-semibold">Info</h2>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        <div className="flex flex-col items-center py-4 text-center">
          <Avatar
            avatarKey={chat.avatarKey}
            letter={chat.letter}
            saved={chat.kind === "saved"}
            online={chat.online}
            className="size-24 text-3xl"
            iconClassName="size-10"
          />
          <h3 className="mt-3 text-lg font-semibold">{chat.title}</h3>
          <p className={cn("text-sm", status.online ? "text-accent" : "text-muted")}>{status.text}</p>
          {chat.username ? <p className="text-sm text-muted">@{chat.username}</p> : null}
          {chat.bio ? <p className="mt-3 max-w-xs text-sm text-fg">{chat.bio}</p> : null}
        </div>
        {bot ? (
          <div className="mb-3 rounded-xl bg-hover px-3 py-3 text-sm">
            <p className="text-xs font-medium text-accent">Bot token</p>
            <p className="mt-1 break-all text-xs">{bot.token}</p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(bot.token);
                notify("Copied");
              }}
              className="mt-2 text-xs font-medium text-accent"
            >
              Copy token
            </button>
            <p className="mt-3 text-xs text-muted">Script base</p>
            <p className="break-all text-xs">{SCRIPT_BASE}/bot{bot.token}/</p>
            <p className="mt-2 text-xs text-muted">Chat id {OWNER_CHAT_ID}</p>
            {bot.commands.length > 0 ? (
              <ul className="mt-3 space-y-1 text-xs text-muted">
                {bot.commands.map((command) => (
                  <li key={command.command}>
                    /{command.command} — {command.description}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div className="mb-3 rounded-xl bg-hover px-3 py-3 text-sm">
          <span className="text-muted">Shared files</span>
          <span className="float-right font-medium">{media}</span>
        </div>
        <button type="button" onClick={() => toggleMute(chat.id)} className="flex h-12 w-full items-center text-left text-sm">
          {chat.muted ? "Unmute" : "Mute"}
        </button>
        <button type="button" onClick={() => togglePin(chat.id)} className="flex h-12 w-full items-center text-left text-sm">
          {chat.pinned ? "Unpin chat" : "Pin chat"}
        </button>
        <button type="button" onClick={() => toggleArchive(chat.id)} className="flex h-12 w-full items-center gap-2 text-left text-sm">
          <Archive className="size-4 text-muted" />
          {chat.archived ? "Unarchive" : "Archive"}
        </button>
        {chat.kind === "group" ? (
          <div className="mt-3">
            <p className="mb-1 text-xs font-medium text-accent">Members</p>
            {(chat.memberIds ?? [])
              .filter((id) => id !== "me")
              .map((id) => contacts.find((contact) => contact.id === id))
              .filter((contact) => contact != null)
              .map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => {
                    const next = openDirect(contact.id);
                    if (!next) return;
                    setForeground(next);
                    onClose();
                    window.dispatchEvent(new CustomEvent("wire-open", { detail: next }));
                  }}
                  className="flex w-full items-center gap-3 py-2 text-left"
                >
                  <Avatar avatarKey={contact.avatarKey} letter={contact.letter} online={contact.online} className="size-10 text-sm" />
                  <span className="truncate text-sm">{contact.name}</span>
                </button>
              ))}
          </div>
        ) : null}
        <button type="button" onClick={() => setConfirm("clear")} className="mt-4 flex h-12 w-full items-center gap-2 text-left text-sm text-danger">
          <Trash2 className="size-4" />
          Clear history
        </button>
        {chat.kind !== "saved" ? (
          <button type="button" onClick={() => setConfirm("delete")} className="flex h-12 w-full items-center text-left text-sm text-danger">
            Delete chat
          </button>
        ) : null}
      </div>
      {confirm ? (
        <div className="absolute inset-0 z-10 grid place-items-center bg-overlay p-6">
          <div className="w-full max-w-sm rounded-2xl bg-header p-5 elevated">
            <h3 className="text-base font-semibold">
              {confirm === "delete" ? `Delete ${chat.title}?` : "Clear history?"}
            </h3>
            <p className="mt-1 text-sm text-muted">This only affects this computer.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirm(null)} className="h-10 rounded-full px-4 text-sm">
                Cancel
              </button>
              <button
                type="button"
                className="h-10 rounded-full bg-danger px-4 text-sm font-medium text-selected-fg"
                onClick={() => {
                  if (confirm === "delete") {
                    deleteChat(chat.id);
                    onClose();
                  } else {
                    clearHistory(chat.id);
                    setConfirm(null);
                  }
                }}
              >
                {confirm === "delete" ? "Delete" : "Clear"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export function CallOverlay({
  chat,
  kind,
  onHang,
}: {
  chat: Chat;
  kind: "voice" | "video";
  onHang: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-overlay p-6">
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl bg-header px-6 py-8 text-center elevated">
        <Avatar avatarKey={chat.avatarKey} letter={chat.letter} className="size-24 text-3xl" />
        <h2 className="mt-4 text-lg font-semibold">{chat.title}</h2>
        <p className="mt-1 text-sm text-accent">{kind === "video" ? "Video call" : "Calling…"}</p>
        <p className="mt-2 text-xs text-muted">Calls stay on this device. No line is connected.</p>
        <button
          type="button"
          onClick={onHang}
          className="mt-6 grid size-14 place-items-center rounded-full bg-danger text-selected-fg"
          aria-label="Hang up"
        >
          {kind === "video" ? <Video className="size-6" /> : <PhoneOff className="size-6" />}
        </button>
      </div>
    </div>
  );
}

export function ForwardDialog({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (chatId: string) => void;
}) {
  const chats = useWire((s) => s.chats.filter((chat) => chat.canPost && !chat.archived));
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-overlay p-4">
      <div className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-header elevated">
        <div className="flex h-14 items-center justify-between px-4">
          <h2 className="font-semibold">Forward to</h2>
          <button type="button" aria-label="Close" onClick={onClose} className="grid size-10 place-items-center text-muted">
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <button
              key={chat.id}
              type="button"
              onClick={() => onPick(chat.id)}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover"
            >
              <Avatar avatarKey={chat.avatarKey} letter={chat.letter} saved={chat.kind === "saved"} className="size-11" iconClassName="size-4" />
              <span className="truncate">{chat.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: { label: string; danger?: boolean; onClick: () => void }[];
  onClose: () => void;
}) {
  useEffect(() => {
    const close = () => onClose();
    const id = window.setTimeout(() => window.addEventListener("pointerdown", close), 0);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("pointerdown", close);
    };
  }, [onClose]);
  return (
    <div
      role="menu"
      onPointerDown={(event) => event.stopPropagation()}
      style={{ left: x, top: y }}
      className="fixed z-50 w-56 overflow-hidden rounded-xl bg-header py-1 elevated"
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={cn(
            "flex h-11 w-full items-center px-4 text-left text-sm hover:bg-hover",
            item.danger ? "text-danger" : "text-fg",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function EmptyPane() {
  const installer = useInstaller();
  return (
    <div className="chat-wallpaper hidden h-full min-w-0 flex-1 flex-col items-center justify-center px-6 md:flex">
      <WireMark className="size-20 opacity-90" />
      <h1 className="mt-4 text-xl font-semibold">WIRE</h1>
      <p className="mt-1 text-sm text-muted">Select a chat to start messaging</p>
      {installer ? (
        <a
          href="/WIRESetup.exe"
          download="WIRESetup.exe"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-medium text-selected-fg"
        >
          <Download className="size-4" />
          Download WIRESetup.exe
        </a>
      ) : null}
    </div>
  );
}

function useInstaller() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let live = true;
    void fetch("/WIRESetup.exe", { method: "HEAD" })
      .then((response) => {
        if (live && response.ok) setReady(true);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return ready;
}

function InstallerLink() {
  const installer = useInstaller();
  if (!installer) return null;
  return (
    <a
      href="/WIRESetup.exe"
      download="WIRESetup.exe"
      className="flex w-full items-center gap-4 px-5 py-3 text-left text-base hover:bg-hover"
    >
      <span className="text-muted">
        <Download className="size-5" />
      </span>
      Download for Windows
    </a>
  );
}

export function Toast({ text }: { text: string }) {
  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-chip px-4 py-2 text-sm text-chip-fg elevated">
      {text}
    </div>
  );
}
