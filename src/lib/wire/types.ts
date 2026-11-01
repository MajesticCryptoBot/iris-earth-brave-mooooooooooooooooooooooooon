export type ThemeMode = "day" | "night";

export type AvatarKey =
  | "red"
  | "orange"
  | "green"
  | "teal"
  | "blue"
  | "violet"
  | "pink"
  | "saved";

export type ChatKind = "saved" | "private" | "group" | "channel";

export type FolderId = "all" | "unread" | "personal" | "groups" | "channels";

export type Attachment = {
  kind: "photo" | "file" | "voice";
  name: string;
  dataUrl?: string;
  duration?: string;
};

export type Reaction = {
  emoji: string;
  mine: boolean;
  count: number;
};

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: number;
  editedAt?: number;
  replyToId?: string;
  reactions: Reaction[];
  attachment?: Attachment;
  forwardedFrom?: string;
  pinned?: boolean;
  status?: "sent" | "read";
  sample?: boolean;
};

export type Chat = {
  id: string;
  kind: ChatKind;
  title: string;
  avatarKey: AvatarKey;
  letter: string;
  folder: "personal" | "groups" | "channels";
  peerId?: string;
  memberIds?: string[];
  canPost: boolean;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
  unread: number;
  draft: string;
  online?: boolean;
  lastSeen?: string;
  bio?: string;
  username?: string;
  subscriberCount?: number;
  sample?: boolean;
  service?: "botfather";
};

export type Contact = {
  id: string;
  name: string;
  avatarKey: AvatarKey;
  letter: string;
  online?: boolean;
  lastSeen?: string;
  bio?: string;
  username?: string;
  sample?: boolean;
  bot?: boolean;
};

export type Profile = {
  name: string;
  username: string;
  bio: string;
  avatarKey: AvatarKey;
};

export type ApiPlatform = "desktop" | "android" | "ios" | "web" | "other";

export type ApiApp = {
  id: string;
  title: string;
  shortName: string;
  platform: ApiPlatform;
  apiId: number;
  apiHash: string;
  createdAt: number;
};

export type WireSession = {
  id: string;
  appId: string;
  device: string;
  session: string;
  createdAt: number;
};

export type BotCommand = {
  command: string;
  description: string;
};

export type Bot = {
  id: string;
  userId: number;
  name: string;
  username: string;
  token: string;
  description: string;
  about: string;
  commands: BotCommand[];
  chatId: string;
  createdAt: number;
};

export type FatherStep =
  | null
  | { kind: "name" }
  | { kind: "username"; name: string }
  | { kind: "pick"; action: "description" | "about" | "commands" | "token" | "revoke" }
  | { kind: "text"; action: "description" | "about" | "commands"; botId: string };

export const AVATAR_CLASS: Record<AvatarKey, string> = {
  red: "bg-ava-red",
  orange: "bg-ava-orange",
  green: "bg-ava-green",
  teal: "bg-ava-teal",
  blue: "bg-ava-blue",
  violet: "bg-ava-violet",
  pink: "bg-ava-pink",
  saved: "bg-ava-saved",
};

export const AVATAR_TEXT: Record<AvatarKey, string> = {
  red: "text-ava-red",
  orange: "text-ava-orange",
  green: "text-ava-green",
  teal: "text-ava-teal",
  blue: "text-ava-blue",
  violet: "text-ava-violet",
  pink: "text-ava-pink",
  saved: "text-ava-saved",
};

export const REACTIONS = ["👍", "❤️", "🔥", "👏", "😂", "😮", "😢"] as const;

export const FOLDERS: { id: FolderId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "personal", label: "Personal" },
  { id: "groups", label: "Groups" },
  { id: "channels", label: "Channels" },
];
