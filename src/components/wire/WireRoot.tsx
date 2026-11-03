import { useEffect, useState } from "react";
import { Conversation } from "@/components/wire/Conversation";
import { ApiPanel, BotsPanel } from "@/components/wire/Developer";
import {
  CallOverlay,
  ContactsPanel,
  ContextMenu,
  EmptyPane,
  ForwardDialog,
  InfoPanel,
  MenuPanel,
  NewChannelPanel,
  NewChatPanel,
  NewGroupPanel,
  SettingsPanel,
  Toast,
} from "@/components/wire/Panels";
import { Sidebar } from "@/components/wire/Sidebar";
import { WireMark } from "@/components/wire/ui";
import { useWire } from "@/lib/wire/store";
import { tick } from "@/lib/wire/link";
import type { FolderId, Message } from "@/lib/wire/types";

type Panel = null | "menu" | "settings" | "contacts" | "newchat" | "newgroup" | "newchannel" | "bots" | "api";
type MenuState = { x: number; y: number; items: { label: string; danger?: boolean; onClick: () => void }[] };
type Command = { mode: "reply" | "edit"; id: string; n: number; chatId: string };

function place(x: number, y: number) {
  const width = 230;
  const height = 280;
  return {
    x: Math.max(8, Math.min(x, window.innerWidth - width)),
    y: Math.max(8, Math.min(y, window.innerHeight - height)),
  };
}

function Splash() {
  return (
    <div className="grid h-dvh place-items-center bg-sidebar text-fg">
      <div className="flex flex-col items-center gap-3">
        <WireMark className="size-16" />
        <div className="text-lg font-semibold tracking-wide">WIRE</div>
        <div className="text-sm text-muted">Opening your desk</div>
      </div>
    </div>
  );
}

export function WireRoot() {
  const hydrated = useWire((s) => s.hydrated);
  const theme = useWire((s) => s.theme);
  const chats = useWire((s) => s.chats);
  const toast = useWire((s) => s.toast);
  const setForeground = useWire((s) => s.setForeground);
  const markRead = useWire((s) => s.markRead);
  const notify = useWire((s) => s.notify);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [folder, setFolder] = useState<FolderId>("all");
  const [query, setQuery] = useState("");
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [info, setInfo] = useState(false);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [command, setCommand] = useState<Command | null>(null);
  const [forward, setForward] = useState<{ chatId: string; messageId: string } | null>(null);
  const [call, setCall] = useState<null | "voice" | "video">(null);

  useEffect(() => {
    let live = true;
    void (async () => {
      try {
        await useWire.persist.rehydrate();
      } finally {
        if (live) useWire.setState({ hydrated: true });
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    void tick();
    const timer = window.setInterval(() => void tick(), 1000);
    return () => window.clearInterval(timer);
  }, [hydrated]);

  useEffect(() => {
    setForeground(activeId);
    if (activeId) markRead(activeId);
  }, [activeId, markRead, setForeground]);

  useEffect(() => {
    const open = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (!id) return;
      setActiveId(id);
      setPanel(null);
      setInfo(false);
      setArchiveOpen(false);
    };
    window.addEventListener("wire-open", open);
    return () => window.removeEventListener("wire-open", open);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (menu) return setMenu(null);
      if (forward) return setForward(null);
      if (call) return setCall(null);
      if (info) return setInfo(false);
      if (panel === "settings" || panel === "contacts" || panel === "newchat" || panel === "newgroup" || panel === "newchannel" || panel === "bots" || panel === "api") {
        return setPanel("menu");
      }
      if (panel) return setPanel(null);
      if (activeId && window.innerWidth < 768) setActiveId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, call, forward, info, menu, panel]);

  const active = chats.find((chat) => chat.id === activeId) ?? null;

  function openChat(id: string) {
    setActiveId(id);
    setPanel(null);
    setInfo(false);
    setCommand(null);
  }

  function chatMenu(chatId: string, x: number, y: number) {
    const chat = useWire.getState().chats.find((item) => item.id === chatId);
    if (!chat) return;
    const pos = place(x, y);
    setMenu({
      x: pos.x,
      y: pos.y,
      items: [
        { label: chat.pinned ? "Unpin" : "Pin", onClick: () => useWire.getState().togglePinChat(chatId) },
        { label: chat.muted ? "Unmute" : "Mute", onClick: () => useWire.getState().toggleMute(chatId) },
        { label: chat.archived ? "Unarchive" : "Archive", onClick: () => useWire.getState().toggleArchive(chatId) },
        { label: "Mark as unread", onClick: () => useWire.getState().markUnread(chatId) },
        ...(chat.kind === "saved"
          ? []
          : [
              {
                label: "Delete chat",
                danger: true,
                onClick: () => {
                  useWire.getState().deleteChat(chatId);
                  if (activeId === chatId) setActiveId(null);
                },
              },
            ]),
      ],
    });
  }

  function messageMenu(message: Message, x: number, y: number) {
    if (!activeId) return;
    const pos = place(x, y);
    const chatId = activeId;
    setMenu({
      x: pos.x,
      y: pos.y,
      items: [
        {
          label: "Reply",
          onClick: () => setCommand({ mode: "reply", id: message.id, n: Date.now(), chatId }),
        },
        {
          label: "Copy",
          onClick: () => {
            const text = message.text || message.attachment?.name || "";
            void navigator.clipboard?.writeText(text).then(
              () => notify("Copied"),
              () => notify("Couldn't copy"),
            );
          },
        },
        {
          label: "Forward",
          onClick: () => setForward({ chatId, messageId: message.id }),
        },
        {
          label: message.pinned ? "Unpin" : "Pin",
          onClick: () => useWire.getState().pinMessage(chatId, message.id),
        },
        ...(message.senderId === "me" && message.text
          ? [
              {
                label: "Edit",
                onClick: () => setCommand({ mode: "edit", id: message.id, n: Date.now(), chatId }),
              },
            ]
          : []),
        {
          label: "Delete",
          danger: true,
          onClick: () => useWire.getState().deleteMessage(chatId, message.id),
        },
      ],
    });
  }

  if (!hydrated) return <Splash />;

  return (
    <div data-theme={theme} className="flex h-dvh overflow-hidden bg-sidebar text-fg">
      <aside
        className={
          active
            ? "relative hidden h-full w-full min-w-0 shrink-0 flex-col md:flex md:w-sidebar md:border-r md:border-line"
            : "relative flex h-full w-full min-w-0 shrink-0 flex-col md:w-sidebar md:border-r md:border-line"
        }
      >
        <Sidebar
          folder={folder}
          setFolder={setFolder}
          query={query}
          setQuery={setQuery}
          archiveOpen={archiveOpen}
          setArchiveOpen={setArchiveOpen}
          activeId={activeId}
          onOpen={openChat}
          onMenu={() => setPanel("menu")}
          onNew={() => setPanel("newchat")}
          onContext={chatMenu}
        />
        {panel === "menu" ? (
          <MenuPanel
            onClose={() => setPanel(null)}
            onSettings={() => setPanel("settings")}
            onContacts={() => setPanel("contacts")}
            onGroup={() => setPanel("newgroup")}
            onChannel={() => setPanel("newchannel")}
            onSaved={() => openChat("saved")}
            onBots={() => setPanel("bots")}
            onApi={() => setPanel("api")}
          />
        ) : null}
        {panel === "settings" ? <SettingsPanel onBack={() => setPanel("menu")} /> : null}
        {panel === "bots" ? <BotsPanel onBack={() => setPanel("menu")} onOpen={openChat} /> : null}
        {panel === "api" ? <ApiPanel onBack={() => setPanel("menu")} /> : null}
        {panel === "contacts" ? (
          <ContactsPanel
            onBack={() => setPanel("menu")}
            onOpen={(contactId) => {
              const id = useWire.getState().openDirect(contactId);
              if (id) openChat(id);
            }}
          />
        ) : null}
        {panel === "newchat" ? <NewChatPanel onBack={() => setPanel(null)} onOpen={openChat} /> : null}
        {panel === "newgroup" ? <NewGroupPanel onBack={() => setPanel("menu")} onOpen={openChat} /> : null}
        {panel === "newchannel" ? <NewChannelPanel onBack={() => setPanel("menu")} onOpen={openChat} /> : null}
      </aside>

      {active ? (
        <div className="relative flex min-w-0 flex-1">
          <Conversation
            chatId={active.id}
            onBack={() => setActiveId(null)}
            onInfo={() => setInfo(true)}
            onCall={(kind) => setCall(kind)}
            onMessageMenu={messageMenu}
            command={command}
          />
          {info ? <InfoPanel chat={active} onClose={() => setInfo(false)} /> : null}
        </div>
      ) : (
        <EmptyPane />
      )}

      {call && active ? <CallOverlay chat={active} kind={call} onHang={() => setCall(null)} /> : null}
      {forward ? (
        <ForwardDialog
          onClose={() => setForward(null)}
          onPick={(to) => {
            useWire.getState().forwardMessage(forward.chatId, forward.messageId, to);
            setForward(null);
            openChat(to);
          }}
        />
      ) : null}
      {menu ? <ContextMenu x={menu.x} y={menu.y} items={menu.items} onClose={() => setMenu(null)} /> : null}
      {toast ? <Toast text={toast} /> : null}
    </div>
  );
}
