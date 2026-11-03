import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { letterOf } from "@/lib/wire/format";
import {
  botfatherChat,
  botfatherHello,
  interpretFather,
  makeSession,
  makeToken,
  parseCommands,
  randomApiHash,
  randomApiId,
  validUsername,
} from "@/lib/wire/developer";
import { craftReply } from "@/lib/wire/replies";
import { createSeed } from "@/lib/wire/seed";
import type {
  ApiApp,
  ApiPlatform,
  Attachment,
  AvatarKey,
  Bot,
  Chat,
  Contact,
  FatherStep,
  Message,
  Profile,
  ThemeMode,
  WireSession,
} from "@/lib/wire/types";

const AVATAR_CYCLE: AvatarKey[] = ["teal", "green", "violet", "orange", "pink", "blue", "red"];

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;
}

function patchChat(chats: Chat[], id: string, fn: (chat: Chat) => Chat): Chat[] {
  return chats.map((chat) => (chat.id === id ? fn(chat) : chat));
}

type Store = {
  chats: Chat[];
  messages: Record<string, Message[]>;
  contacts: Contact[];
  profile: Profile;
  theme: ThemeMode;
  liveReplies: boolean;
  apps: ApiApp[];
  sessions: WireSession[];
  bots: Bot[];
  father: FatherStep;
  nextBotNumber: number;
  hydrated: boolean;
  foregroundId: string | null;
  typingChatId: string | null;
  toast: string | null;
  setTheme: (theme: ThemeMode) => void;
  setLiveReplies: (on: boolean) => void;
  setForeground: (id: string | null) => void;
  setDraft: (chatId: string, draft: string) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  cycleAvatar: () => void;
  notify: (text: string) => void;
  markRead: (chatId: string) => void;
  markUnread: (chatId: string) => void;
  togglePinChat: (chatId: string) => void;
  toggleMute: (chatId: string) => void;
  toggleArchive: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  clearHistory: (chatId: string) => void;
  clearSamples: () => void;
  sendMessage: (input: {
    chatId: string;
    text: string;
    replyToId?: string;
    attachment?: Attachment;
  }) => void;
  editMessage: (chatId: string, messageId: string, text: string) => void;
  deleteMessage: (chatId: string, messageId: string) => void;
  toggleReaction: (chatId: string, messageId: string, emoji: string) => void;
  pinMessage: (chatId: string, messageId: string) => void;
  forwardMessage: (fromChatId: string, messageId: string, toChatId: string) => void;
  openDirect: (contactId: string) => string | null;
  createContact: (name: string) => string | null;
  createGroup: (title: string, memberIds: string[]) => string | null;
  createChannel: (title: string) => string | null;
  createApp: (title: string, shortName: string, platform: ApiPlatform) => string | null;
  regenerateHash: (appId: string) => void;
  deleteApp: (appId: string) => void;
  createSession: (appId: string, device: string) => string | null;
  revokeSession: (sessionId: string) => void;
  createBot: (name: string, username: string) => { error: string } | { bot: Bot };
  updateBot: (id: string, patch: Partial<Pick<Bot, "description" | "about" | "commands" | "name">>) => void;
  revokeBotToken: (id: string) => string | null;
  deleteBot: (id: string) => void;
  applyScriptEvent: (
    token: string,
    event: {
      kind: "message" | "edit" | "commands";
      seq: number;
      message_id?: number;
      text?: string;
      commands?: { command: string; description: string }[];
    },
  ) => boolean;
};

const seed = createSeed();
let toastTimer = 0;
const replyTimers = new Set<number>();

function scheduleReply(chatId: string, incoming: string, attachment?: Attachment["kind"]) {
  const wait = window.setTimeout(() => {
    replyTimers.delete(wait);
    const cur = useWire.getState();
    if (!cur.liveReplies) return;
    const chat = cur.chats.find((item) => item.id === chatId);
    if (!chat || chat.kind === "saved" || chat.kind === "channel") return;
    useWire.setState({ typingChatId: chatId });
    const typeFor = window.setTimeout(() => {
      replyTimers.delete(typeFor);
      const now = useWire.getState();
      const live = now.chats.find((item) => item.id === chatId);
      if (!live) {
        if (now.typingChatId === chatId) useWire.setState({ typingChatId: null });
        return;
      }
      const others =
        live.kind === "group"
          ? (live.memberIds ?? []).filter((id) => id !== "me")
          : live.peerId
            ? [live.peerId]
            : [];
      const senderId = others[Math.floor(Math.random() * others.length)];
      if (!senderId) {
        useWire.setState({ typingChatId: now.typingChatId === chatId ? null : now.typingChatId });
        return;
      }
      const text = craftReply(senderId, incoming, attachment);
      const reply: Message = {
        id: uid("m"),
        senderId,
        text,
        createdAt: Date.now(),
        reactions: [],
        status: "read",
      };
      const prior = now.messages[chatId] ?? [];
      const readMine = prior.map((item) =>
        item.senderId === "me" ? { ...item, status: "read" as const } : item,
      );
      const looking = now.foregroundId === chatId;
      useWire.setState({
        typingChatId: now.typingChatId === chatId ? null : now.typingChatId,
        messages: { ...now.messages, [chatId]: [...readMine, reply] },
        chats: patchChat(now.chats, chatId, (item) => ({
          ...item,
          unread: looking ? item.unread : item.unread + 1,
        })),
      });
    }, 700 + Math.floor(Math.random() * 800));
    replyTimers.add(typeFor);
  }, 350);
  replyTimers.add(wait);
}

function scheduleLocal(chatId: string, senderId: string, text: string) {
  useWire.setState({ typingChatId: chatId });
  window.setTimeout(() => {
    const now = useWire.getState();
    if (!now.chats.some((chat) => chat.id === chatId)) {
      if (now.typingChatId === chatId) useWire.setState({ typingChatId: null });
      return;
    }
    const reply: Message = {
      id: uid("m"),
      senderId,
      text,
      createdAt: Date.now(),
      reactions: [],
      status: "read",
    };
    const looking = now.foregroundId === chatId;
    useWire.setState({
      typingChatId: now.typingChatId === chatId ? null : now.typingChatId,
      messages: { ...now.messages, [chatId]: [...(now.messages[chatId] ?? []), reply] },
      chats: patchChat(now.chats, chatId, (chat) => ({
        ...chat,
        unread: looking ? chat.unread : chat.unread + 1,
      })),
    });
  }, 450);
}

function answerFather(body: string) {
  const result = interpretFather(body, useWire.getState().father, useWire.getState().bots);
  if (result.kind === "say") {
    useWire.setState({ father: result.father });
    scheduleLocal("botfather", "botfather", result.text);
    return;
  }
  if (result.kind === "create") {
    const made = useWire.getState().createBot(result.name, result.username);
    if ("error" in made) {
      scheduleLocal("botfather", "botfather", made.error);
      return;
    }
    useWire.setState({ father: null });
    scheduleLocal(
      "botfather",
      "botfather",
      `Done. @${made.bot.username}\n\nToken:\n${made.bot.token}\n\nKeep it. Anyone with this token can control the bot.\n/setdescription and /setcommands finish the setup.`,
    );
    return;
  }
  if (result.kind === "save") {
    if (result.action === "commands") {
      const commands = parseCommands(result.text);
      if (commands.length === 0) {
        scheduleLocal("botfather", "botfather", "I need one command per line, like:\nstart - Welcome\ncut - File the cut");
        return;
      }
      useWire.getState().updateBot(result.botId, { commands });
    } else if (result.action === "description") {
      useWire.getState().updateBot(result.botId, { description: result.text.slice(0, 280) });
    } else {
      useWire.getState().updateBot(result.botId, { about: result.text.slice(0, 120) });
    }
    useWire.setState({ father: null });
    const bot = useWire.getState().bots.find((item) => item.id === result.botId);
    scheduleLocal("botfather", "botfather", `Saved${bot ? ` for @${bot.username}` : ""}.`);
    return;
  }
  const bot = useWire.getState().bots.find((item) => item.id === result.botId);
  if (!bot) {
    useWire.setState({ father: null });
    scheduleLocal("botfather", "botfather", "That bot is gone. Send /mybots.");
    return;
  }
  if (result.kind === "revoke") {
    const token = useWire.getState().revokeBotToken(bot.id);
    useWire.setState({ father: null });
    scheduleLocal("botfather", "botfather", `New token for @${bot.username}:\n${token}\nThe old token no longer works.`);
    return;
  }
  useWire.setState({ father: null });
  scheduleLocal("botfather", "botfather", `Token for @${bot.username}:\n${bot.token}`);
}

export const useWire = create<Store>()(
  persist(
    (set, get) => ({
      chats: seed.chats,
      messages: seed.messages,
      contacts: seed.contacts,
      profile: seed.profile,
      theme: "day",
      liveReplies: true,
      apps: [],
      sessions: [],
      bots: [],
      father: null,
      nextBotNumber: 840211001,
      hydrated: false,
      foregroundId: null,
      typingChatId: null,
      toast: null,
      setTheme: (theme) => set({ theme }),
      setLiveReplies: (liveReplies) => set({ liveReplies }),
      setForeground: (foregroundId) => set({ foregroundId }),
      setDraft: (chatId, draft) =>
        set({ chats: patchChat(get().chats, chatId, (chat) => ({ ...chat, draft })) }),
      updateProfile: (patch) => set({ profile: { ...get().profile, ...patch } }),
      cycleAvatar: () => {
        const cur = get().profile.avatarKey;
        const index = AVATAR_CYCLE.indexOf(cur);
        const next = AVATAR_CYCLE[(index + 1) % AVATAR_CYCLE.length] ?? "teal";
        set({ profile: { ...get().profile, avatarKey: next } });
      },
      notify: (text) => {
        window.clearTimeout(toastTimer);
        set({ toast: text });
        toastTimer = window.setTimeout(() => {
          if (get().toast === text) set({ toast: null });
        }, 1700);
      },
      markRead: (chatId) => {
        const messages = get().messages[chatId] ?? [];
        set({
          chats: patchChat(get().chats, chatId, (chat) => ({ ...chat, unread: 0 })),
          messages: {
            ...get().messages,
            [chatId]: messages.map((item) =>
              item.senderId === "me" ? { ...item, status: "read" } : item,
            ),
          },
        });
      },
      markUnread: (chatId) =>
        set({
          chats: patchChat(get().chats, chatId, (chat) => ({
            ...chat,
            unread: Math.max(1, chat.unread),
          })),
        }),
      togglePinChat: (chatId) =>
        set({
          chats: patchChat(get().chats, chatId, (chat) => ({ ...chat, pinned: !chat.pinned })),
        }),
      toggleMute: (chatId) =>
        set({
          chats: patchChat(get().chats, chatId, (chat) => ({ ...chat, muted: !chat.muted })),
        }),
      toggleArchive: (chatId) =>
        set({
          chats: patchChat(get().chats, chatId, (chat) => ({
            ...chat,
            archived: !chat.archived,
          })),
        }),
      deleteChat: (chatId) => {
        if (chatId === "saved" || chatId === "botfather") return;
        const bot = get().bots.find((item) => item.chatId === chatId);
        const messages = { ...get().messages };
        delete messages[chatId];
        set({
          chats: get().chats.filter((chat) => chat.id !== chatId),
          contacts: bot ? get().contacts.filter((contact) => contact.id !== bot.id) : get().contacts,
          bots: bot ? get().bots.filter((item) => item.id !== bot.id) : get().bots,
          messages,
          foregroundId: get().foregroundId === chatId ? null : get().foregroundId,
        });
      },
      clearHistory: (chatId) =>
        set({
          messages: { ...get().messages, [chatId]: [] },
          chats: patchChat(get().chats, chatId, (chat) => ({ ...chat, unread: 0, draft: "" })),
        }),
      clearSamples: () => {
        const sampleIds = new Set(
          get()
            .chats.filter((chat) => chat.sample)
            .map((chat) => chat.id),
        );
        if (sampleIds.size === 0) {
          get().notify("No sample chats to remove");
          return;
        }
        const messages: Record<string, Message[]> = {};
        for (const [id, list] of Object.entries(get().messages)) {
          if (sampleIds.has(id)) continue;
          messages[id] = list.filter((item) => !item.sample);
        }
        const foregroundId = get().foregroundId;
        set({
          chats: get().chats.filter((chat) => !chat.sample),
          contacts: get().contacts.filter((contact) => !contact.sample),
          messages,
          foregroundId: foregroundId && sampleIds.has(foregroundId) ? null : foregroundId,
        });
        get().notify("Sample chats removed");
      },
      sendMessage: ({ chatId, text, replyToId, attachment }) => {
        const body = text.trim();
        if (!body && !attachment) return;
        const chat = get().chats.find((item) => item.id === chatId);
        if (!chat || !chat.canPost) return;
        const message: Message = {
          id: uid("m"),
          senderId: "me",
          text: body,
          createdAt: Date.now(),
          replyToId,
          reactions: [],
          attachment,
          status: get().foregroundId === chatId ? "read" : "sent",
        };
        const prior = get().messages[chatId] ?? [];
        set({
          messages: { ...get().messages, [chatId]: [...prior, message] },
          chats: patchChat(get().chats, chatId, (item) => ({ ...item, draft: "" })),
        });
        if (chat.service === "botfather") {
          answerFather(body);
          return;
        }
        const bot = get().bots.find((item) => item.chatId === chatId);
        if (bot) {
          void import("@/lib/wire/link").then((mod) => mod.pushIncoming(bot.token, body));
          return;
        }
        if (chat.kind === "private" || chat.kind === "group") {
          scheduleReply(chatId, body, attachment?.kind);
        }
      },
      editMessage: (chatId, messageId, text) => {
        const body = text.trim();
        if (!body) return;
        const list = get().messages[chatId] ?? [];
        set({
          messages: {
            ...get().messages,
            [chatId]: list.map((item) =>
              item.id === messageId && item.senderId === "me"
                ? { ...item, text: body, editedAt: Date.now() }
                : item,
            ),
          },
        });
      },
      deleteMessage: (chatId, messageId) => {
        const list = get().messages[chatId] ?? [];
        set({
          messages: {
            ...get().messages,
            [chatId]: list.filter((item) => item.id !== messageId),
          },
        });
      },
      toggleReaction: (chatId, messageId, emoji) => {
        const list = get().messages[chatId] ?? [];
        set({
          messages: {
            ...get().messages,
            [chatId]: list.map((item) => {
              if (item.id !== messageId) return item;
              const existing = item.reactions.find((reaction) => reaction.emoji === emoji);
              let reactions: Message["reactions"];
              if (!existing) {
                reactions = [...item.reactions, { emoji, mine: true, count: 1 }];
              } else if (existing.mine) {
                const next = existing.count - 1;
                reactions =
                  next <= 0
                    ? item.reactions.filter((reaction) => reaction.emoji !== emoji)
                    : item.reactions.map((reaction) =>
                        reaction.emoji === emoji
                          ? { ...reaction, mine: false, count: next }
                          : reaction,
                      );
              } else {
                reactions = item.reactions.map((reaction) =>
                  reaction.emoji === emoji
                    ? { ...reaction, mine: true, count: reaction.count + 1 }
                    : reaction,
                );
              }
              return { ...item, reactions };
            }),
          },
        });
      },
      pinMessage: (chatId, messageId) => {
        const list = get().messages[chatId] ?? [];
        const target = list.find((item) => item.id === messageId);
        const next = !target?.pinned;
        set({
          messages: {
            ...get().messages,
            [chatId]: list.map((item) => ({
              ...item,
              pinned: next && item.id === messageId,
            })),
          },
        });
      },
      forwardMessage: (fromChatId, messageId, toChatId) => {
        const sourceChat = get().chats.find((item) => item.id === fromChatId);
        const source = (get().messages[fromChatId] ?? []).find((item) => item.id === messageId);
        const target = get().chats.find((item) => item.id === toChatId);
        if (!source || !target?.canPost) return;
        const copy: Message = {
          id: uid("m"),
          senderId: "me",
          text: source.text,
          createdAt: Date.now(),
          reactions: [],
          attachment: source.attachment,
          forwardedFrom: sourceChat?.title ?? "chat",
          status: "sent",
        };
        const prior = get().messages[toChatId] ?? [];
        set({
          messages: { ...get().messages, [toChatId]: [...prior, copy] },
        });
        get().notify(`Forwarded to ${target.title}`);
      },
      openDirect: (contactId) => {
        const contact = get().contacts.find((item) => item.id === contactId);
        if (!contact) return null;
        const existing = get().chats.find(
          (chat) => chat.kind === "private" && chat.peerId === contactId,
        );
        if (existing) {
          if (existing.archived) {
            set({
              chats: patchChat(get().chats, existing.id, (chat) => ({ ...chat, archived: false })),
            });
          }
          return existing.id;
        }
        const id = uid("c");
        const chat: Chat = {
          id,
          kind: "private",
          title: contact.name,
          avatarKey: contact.avatarKey,
          letter: contact.letter,
          folder: "personal",
          peerId: contact.id,
          canPost: true,
          pinned: false,
          muted: false,
          archived: false,
          unread: 0,
          draft: "",
          online: contact.online,
          lastSeen: contact.lastSeen,
          bio: contact.bio,
          username: contact.username,
        };
        set({ chats: [chat, ...get().chats], messages: { ...get().messages, [id]: [] } });
        return id;
      },
      createContact: (raw) => {
        const name = raw.trim();
        if (!name) return null;
        const key = name.toLowerCase();
        const existing = get().contacts.find((contact) => contact.name.toLowerCase() === key);
        if (existing) return get().openDirect(existing.id);
        const avatarKey = AVATAR_CYCLE[get().contacts.length % AVATAR_CYCLE.length] ?? "teal";
        const username = name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || "contact";
        const contact: Contact = {
          id: uid("u"),
          name,
          avatarKey,
          letter: letterOf(name),
          online: false,
          lastSeen: "last seen recently",
          username,
        };
        set({ contacts: [...get().contacts, contact] });
        return get().openDirect(contact.id);
      },
      createGroup: (raw, memberIds) => {
        const title = raw.trim();
        const members = Array.from(new Set(["me", ...memberIds]));
        if (!title || members.length < 2) return null;
        const avatarKey = AVATAR_CYCLE[get().chats.length % AVATAR_CYCLE.length] ?? "orange";
        const id = uid("c");
        const chat: Chat = {
          id,
          kind: "group",
          title,
          avatarKey,
          letter: letterOf(title),
          folder: "groups",
          memberIds: members,
          canPost: true,
          pinned: false,
          muted: false,
          archived: false,
          unread: 0,
          draft: "",
          bio: "Group",
        };
        const intro: Message = {
          id: uid("m"),
          senderId: "me",
          text: `${get().profile.name} created the group`,
          createdAt: Date.now(),
          reactions: [],
          status: "read",
        };
        set({
          chats: [chat, ...get().chats],
          messages: { ...get().messages, [id]: [intro] },
        });
        return id;
      },
      createChannel: (raw) => {
        const title = raw.trim();
        if (!title) return null;
        const id = uid("c");
        const chat: Chat = {
          id,
          kind: "channel",
          title,
          avatarKey: "teal",
          letter: letterOf(title),
          folder: "channels",
          canPost: true,
          pinned: false,
          muted: false,
          archived: false,
          unread: 0,
          draft: "",
          username: title.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16) || "channel",
          subscriberCount: 1,
          bio: "Your channel. Only you can post.",
        };
        set({ chats: [chat, ...get().chats], messages: { ...get().messages, [id]: [] } });
        return id;
      },
      createApp: (title, shortName, platform) => {
        const name = title.trim().slice(0, 40);
        const short = shortName
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "")
          .slice(0, 16);
        if (name.length < 2 || short.length < 2) return "Title and short name are required.";
        const app: ApiApp = {
          id: uid("app"),
          title: name,
          shortName: short,
          platform,
          apiId: randomApiId(),
          apiHash: randomApiHash(),
          createdAt: Date.now(),
        };
        set({ apps: [app, ...get().apps] });
        return null;
      },
      regenerateHash: (appId) => {
        set({
          apps: get().apps.map((app) => (app.id === appId ? { ...app, apiHash: randomApiHash() } : app)),
          sessions: get().sessions.filter((session) => session.appId !== appId),
        });
        get().notify("API hash replaced. Old sessions for this app were revoked.");
      },
      deleteApp: (appId) => {
        set({
          apps: get().apps.filter((app) => app.id !== appId),
          sessions: get().sessions.filter((session) => session.appId !== appId),
        });
      },
      createSession: (appId, device) => {
        const app = get().apps.find((item) => item.id === appId);
        if (!app) return "Create an application first.";
        const name = device.trim().slice(0, 32) || "WIRE Desktop";
        const session: WireSession = {
          id: uid("ses"),
          appId,
          device: name,
          session: makeSession({
            apiId: app.apiId,
            apiHash: app.apiHash,
            username: get().profile.username,
            device: name,
          }),
          createdAt: Date.now(),
        };
        set({ sessions: [session, ...get().sessions] });
        return null;
      },
      revokeSession: (sessionId) => {
        set({ sessions: get().sessions.filter((session) => session.id !== sessionId) });
        get().notify("Session revoked");
      },
      createBot: (rawName, rawUsername) => {
        const name = rawName.trim().slice(0, 32);
        const username = validUsername(rawUsername);
        if (!name) return { error: "Send a name for the bot." };
        if (!username) return { error: "Username must end in bot. Letters, numbers, and underscores only. Example: desk_bot" };
        const taken =
          get().bots.some((bot) => bot.username === username) ||
          get().contacts.some((contact) => contact.username === username) ||
          username === "botfather";
        if (taken) return { error: "That username is taken." };
        const userId = get().nextBotNumber;
        const id = uid("bot");
        const chatId = uid("c");
        const token = makeToken(userId);
        const avatarKey = AVATAR_CYCLE[get().bots.length % AVATAR_CYCLE.length] ?? "teal";
        const bot: Bot = {
          id,
          userId,
          name,
          username,
          token,
          description: "",
          about: "",
          commands: [{ command: "start", description: "Start the bot" }],
          chatId,
          createdAt: Date.now(),
        };
        const contact: Contact = {
          id,
          name,
          avatarKey,
          letter: letterOf(name),
          username,
          bio: "Bot",
          bot: true,
          online: true,
        };
        const chat: Chat = {
          id: chatId,
          kind: "private",
          title: name,
          avatarKey,
          letter: letterOf(name),
          folder: "personal",
          peerId: id,
          canPost: true,
          pinned: false,
          muted: false,
          archived: false,
          unread: 0,
          draft: "",
          online: true,
          username,
          bio: "Bot",
        };
        const hello: Message = {
          id: uid("m"),
          senderId: id,
          text: `Hi. I'm ${name}. Send /start.`,
          createdAt: Date.now(),
          reactions: [],
          status: "read",
        };
        set({
          nextBotNumber: userId + 1,
          bots: [bot, ...get().bots],
          contacts: [...get().contacts, contact],
          chats: [chat, ...get().chats],
          messages: { ...get().messages, [chatId]: [hello] },
        });
        return { bot };
      },
      updateBot: (id, patch) => {
        const current = get().bots.find((bot) => bot.id === id);
        if (!current) return;
        const bot = { ...current, ...patch };
        set({
          bots: get().bots.map((item) => (item.id === id ? bot : item)),
          chats: patchChat(get().chats, bot.chatId, (chat) => ({
            ...chat,
            title: bot.name,
            bio: bot.description || bot.about || "Bot",
          })),
          contacts: get().contacts.map((contact) =>
            contact.id === id
              ? { ...contact, name: bot.name, bio: bot.about || bot.description || "Bot" }
              : contact,
          ),
        });
      },
      revokeBotToken: (id) => {
        const bot = get().bots.find((item) => item.id === id);
        if (!bot) return null;
        const token = makeToken(bot.userId);
        set({ bots: get().bots.map((item) => (item.id === id ? { ...item, token } : item)) });
        return token;
      },
      deleteBot: (id) => {
        const bot = get().bots.find((item) => item.id === id);
        if (!bot) return;
        const messages = { ...get().messages };
        delete messages[bot.chatId];
        set({
          bots: get().bots.filter((item) => item.id !== id),
          contacts: get().contacts.filter((contact) => contact.id !== id),
          chats: get().chats.filter((chat) => chat.id !== bot.chatId),
          messages,
          foregroundId: get().foregroundId === bot.chatId ? null : get().foregroundId,
        });
      },
      applyScriptEvent: (token, event) => {
        const bot = get().bots.find((item) => item.token === token);
        if (!bot) return false;
        if (event.kind === "commands" && event.commands) {
          get().updateBot(bot.id, { commands: event.commands });
          return true;
        }
        const messageId = event.message_id || event.seq;
        const id = `api_${messageId}`;
        const list = get().messages[bot.chatId] ?? [];
        if (event.kind === "edit" && list.some((item) => item.id === id)) {
          set({
            messages: {
              ...get().messages,
              [bot.chatId]: list.map((item) =>
                item.id === id ? { ...item, text: event.text || item.text, editedAt: Date.now() } : item,
              ),
            },
          });
          return true;
        }
        if (!event.text) return false;
        if (list.some((item) => item.id === id)) return true;
        const reply: Message = {
          id,
          senderId: bot.id,
          text: event.text,
          createdAt: Date.now(),
          reactions: [],
          status: "read",
          apiId: messageId,
        };
        const looking = get().foregroundId === bot.chatId;
        set({
          messages: { ...get().messages, [bot.chatId]: [...list, reply] },
          chats: patchChat(get().chats, bot.chatId, (chat) => ({
            ...chat,
            unread: looking ? chat.unread : chat.unread + 1,
          })),
        });
        return true;
      },
    }),
    {
      name: "wire-desk-v1",
      version: 2,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      migrate: (persisted) => {
        const data = { ...(persisted as Record<string, unknown>) };
        if (!Array.isArray(data.apps)) data.apps = [];
        if (!Array.isArray(data.sessions)) data.sessions = [];
        if (!Array.isArray(data.bots)) data.bots = [];
        if (data.father == null) data.father = null;
        if (typeof data.nextBotNumber !== "number") data.nextBotNumber = 840211001;
        const chats = Array.isArray(data.chats) ? (data.chats as Chat[]) : [];
        if (!chats.some((chat) => chat.id === "botfather")) {
          data.chats = [botfatherChat(), ...chats];
          const messages = (data.messages as Record<string, Message[]>) ?? {};
          data.messages = { ...messages, botfather: messages.botfather ?? [botfatherHello(Date.now())] };
        }
        return data;
      },
      partialize: (state) => ({
        chats: state.chats,
        messages: state.messages,
        contacts: state.contacts,
        profile: state.profile,
        theme: state.theme,
        liveReplies: state.liveReplies,
        apps: state.apps,
        sessions: state.sessions,
        bots: state.bots,
        father: state.father,
        nextBotNumber: state.nextBotNumber,
      }),
    },
  ),
);
