import { Archive, BellOff, Menu, Pin, Search, SquarePen, X } from "lucide-react";
import { useMemo } from "react";
import { previewOf, listTime, lastTimestamp } from "@/lib/wire/format";
import { useWire } from "@/lib/wire/store";
import { FOLDERS, type FolderId } from "@/lib/wire/types";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/wire/ui";

export function Sidebar({
  folder,
  setFolder,
  query,
  setQuery,
  archiveOpen,
  setArchiveOpen,
  activeId,
  onOpen,
  onMenu,
  onNew,
  onContext,
}: {
  folder: FolderId;
  setFolder: (folder: FolderId) => void;
  query: string;
  setQuery: (query: string) => void;
  archiveOpen: boolean;
  setArchiveOpen: (open: boolean) => void;
  activeId: string | null;
  onOpen: (id: string) => void;
  onMenu: () => void;
  onNew: () => void;
  onContext: (chatId: string, x: number, y: number) => void;
}) {
  const chats = useWire((s) => s.chats);
  const messages = useWire((s) => s.messages);
  const contacts = useWire((s) => s.contacts);
  const typingChatId = useWire((s) => s.typingChatId);

  const archivedCount = chats.filter((chat) => chat.archived).length;
  const needle = query.trim().toLowerCase();

  const rows = useMemo(() => {
    const list = chats.filter((chat) => {
      if (needle) {
        if (chat.title.toLowerCase().includes(needle)) return true;
        return (messages[chat.id] ?? []).some((item) => item.text.toLowerCase().includes(needle));
      }
      if (archiveOpen) return chat.archived;
      if (chat.archived) return false;
      if (folder === "all") return true;
      if (folder === "unread") return chat.unread > 0;
      return chat.folder === folder;
    });
    return list.sort((a, b) => {
      if (!needle && !archiveOpen && a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return lastTimestamp(messages[b.id]) - lastTimestamp(messages[a.id]);
    });
  }, [archiveOpen, chats, folder, messages, needle]);

  const unreadIn = (id: FolderId) => {
    if (id === "all" || id === "unread") {
      return chats.filter((chat) => !chat.archived && chat.unread > 0).length;
    }
    return chats.filter((chat) => !chat.archived && chat.folder === id && chat.unread > 0).length;
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {archiveOpen && !needle ? (
        <div className="flex h-14 shrink-0 items-center gap-2 px-2">
          <button
            type="button"
            aria-label="Back to chats"
            onClick={() => setArchiveOpen(false)}
            className="grid size-11 place-items-center text-muted"
          >
            <Archive className="size-5" />
          </button>
          <h1 className="text-base font-semibold">Archived Chats</h1>
        </div>
      ) : (
        <div className="shrink-0 px-3 pb-1 pt-3">
          <div className="flex h-11 items-center gap-2 rounded-full bg-input px-2">
            <button
              type="button"
              aria-label="Main menu"
              onClick={onMenu}
              className="grid size-9 place-items-center text-muted"
            >
              <Menu className="size-5" />
            </button>
            <Search className="size-4 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search chats"
              className="min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="grid size-8 place-items-center text-muted"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>
      )}

      {!archiveOpen && !needle ? (
        <div className="flex shrink-0 gap-1 overflow-x-auto px-2">
          {FOLDERS.map((item) => {
            const active = folder === item.id;
            const count = unreadIn(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFolder(item.id)}
                className={cn(
                  "relative shrink-0 px-3 py-2 text-sm font-medium",
                  active ? "text-accent" : "text-muted",
                )}
              >
                <span className="inline-flex items-center gap-1.5">
                  {item.label}
                  {count > 0 && item.id !== "all" ? (
                    <span className="text-xs">{count}</span>
                  ) : null}
                </span>
                {active ? (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!needle && !archiveOpen && archivedCount > 0 ? (
          <button
            type="button"
            onClick={() => setArchiveOpen(true)}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-accent hover:bg-hover"
          >
            <span className="grid size-12 place-items-center">
              <Archive className="size-5" />
            </span>
            <span className="min-w-0 flex-1 font-medium">Archived Chats</span>
            <span className="text-sm text-muted">{archivedCount}</span>
          </button>
        ) : null}

        {rows.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-muted">No chats here yet.</p>
        ) : (
          rows.map((chat) => {
            const selected = chat.id === activeId;
            const preview = previewOf(
              chat,
              messages[chat.id],
              contacts,
              typingChatId === chat.id,
            );
            const ts = lastTimestamp(messages[chat.id]);
            return (
              <button
                key={chat.id}
                type="button"
                data-active={selected ? "true" : "false"}
                onClick={() => onOpen(chat.id)}
                onContextMenu={(event) => {
                  event.preventDefault();
                  onContext(chat.id, event.clientX, event.clientY);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left",
                  selected ? "bg-selected text-selected-fg" : "hover:bg-hover",
                )}
              >
                <Avatar
                  avatarKey={chat.avatarKey}
                  letter={chat.letter}
                  saved={chat.kind === "saved"}
                  online={chat.online}
                  className="size-12 text-base"
                  iconClassName="size-5"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-base",
                        chat.unread > 0 && !selected ? "font-semibold" : "font-medium",
                      )}
                    >
                      {chat.title}
                    </span>
                    {ts > 0 ? (
                      <span
                        className={cn(
                          "shrink-0 text-xs",
                          selected
                            ? "text-selected-fg/80"
                            : chat.unread > 0 && !chat.muted
                              ? "text-accent"
                              : "text-muted",
                        )}
                      >
                        {listTime(ts)}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "truncate text-sm",
                        selected
                          ? "text-selected-fg/80"
                          : preview.kind === "typing"
                            ? "text-accent"
                            : preview.kind === "draft"
                              ? "text-danger"
                              : "text-muted",
                      )}
                    >
                      {preview.kind === "draft" ? (
                        <span className={cn(!selected && "text-danger")}>{preview.prefix}</span>
                      ) : null}
                      {preview.kind === "text" ? preview.prefix : null}
                      {preview.text}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {chat.muted ? <BellOff className="size-3.5 opacity-70" /> : null}
                      {chat.pinned && chat.unread === 0 ? (
                        <Pin className="size-3.5 opacity-70" />
                      ) : null}
                      {chat.unread > 0 ? (
                        <span
                          className={cn(
                            "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-medium",
                            selected
                              ? "bg-selected-fg text-selected"
                              : chat.muted
                                ? "bg-badge-muted text-selected-fg"
                                : "bg-badge text-selected-fg",
                          )}
                        >
                          {chat.unread}
                        </span>
                      ) : null}
                    </span>
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        aria-label="New message"
        onClick={onNew}
        className="absolute bottom-4 right-4 z-10 grid size-14 place-items-center rounded-full bg-accent text-selected-fg elevated"
      >
        <SquarePen className="size-6" />
      </button>
    </div>
  );
}
