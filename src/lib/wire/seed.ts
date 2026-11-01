import { botfatherChat, botfatherHello } from "@/lib/wire/developer";
import type { Chat, Contact, Message, Profile } from "@/lib/wire/types";

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

function msg(
  id: string,
  senderId: string,
  text: string,
  ago: number,
  now: number,
  extra?: Partial<Message>,
): Message {
  return {
    id,
    senderId,
    text,
    createdAt: now - ago,
    reactions: [],
    sample: true,
    ...extra,
  };
}

export function createSeed(now = Date.now()): {
  chats: Chat[];
  messages: Record<string, Message[]>;
  contacts: Contact[];
  profile: Profile;
} {
  const contacts: Contact[] = [
    {
      id: "lena",
      name: "Lena Voss",
      avatarKey: "green",
      letter: "L",
      online: true,
      bio: "Desk editor. Cuts long, files short.",
      username: "lena",
      sample: true,
    },
    {
      id: "marc",
      name: "Marc Adler",
      avatarKey: "blue",
      letter: "M",
      online: false,
      lastSeen: "last seen yesterday",
      bio: "Charts and the numbers under them.",
      username: "marc",
      sample: true,
    },
    {
      id: "priya",
      name: "Priya Shah",
      avatarKey: "violet",
      letter: "P",
      online: true,
      bio: "Quotes, names, and the last look.",
      username: "priya",
      sample: true,
    },
  ];

  const chats: Chat[] = [
    {
      id: "saved",
      kind: "saved",
      title: "Saved Messages",
      avatarKey: "saved",
      letter: "S",
      folder: "personal",
      canPost: true,
      pinned: true,
      muted: false,
      archived: false,
      unread: 0,
      draft: "",
      bio: "Notes that stay on this computer.",
      sample: false,
    },
    botfatherChat(),
    {
      id: "lena",
      kind: "private",
      title: "Lena Voss",
      avatarKey: "green",
      letter: "L",
      folder: "personal",
      peerId: "lena",
      canPost: true,
      pinned: false,
      muted: false,
      archived: false,
      unread: 2,
      draft: "",
      online: true,
      bio: "Desk editor. Cuts long, files short.",
      username: "lena",
      sample: true,
    },
    {
      id: "marc",
      kind: "private",
      title: "Marc Adler",
      avatarKey: "blue",
      letter: "M",
      folder: "personal",
      peerId: "marc",
      canPost: true,
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      draft: "",
      online: false,
      lastSeen: "last seen yesterday",
      bio: "Charts and the numbers under them.",
      username: "marc",
      sample: true,
    },
    {
      id: "priya",
      kind: "private",
      title: "Priya Shah",
      avatarKey: "violet",
      letter: "P",
      folder: "personal",
      peerId: "priya",
      canPost: true,
      pinned: false,
      muted: true,
      archived: false,
      unread: 0,
      draft: "",
      online: true,
      bio: "Quotes, names, and the last look.",
      username: "priya",
      sample: true,
    },
    {
      id: "desk",
      kind: "group",
      title: "Desk",
      avatarKey: "orange",
      letter: "D",
      folder: "groups",
      memberIds: ["me", "lena", "marc", "priya"],
      canPost: true,
      pinned: true,
      muted: false,
      archived: false,
      unread: 1,
      draft: "",
      bio: "The daily run. One item each.",
      sample: true,
    },
    {
      id: "wiredesk",
      kind: "channel",
      title: "WIRE Desk",
      avatarKey: "teal",
      letter: "W",
      folder: "channels",
      canPost: true,
      pinned: false,
      muted: false,
      archived: false,
      unread: 0,
      draft: "",
      bio: "Your channel. Posts stay on this device.",
      username: "wiredesk",
      subscriberCount: 1284,
      sample: true,
    },
    {
      id: "markets",
      kind: "channel",
      title: "Markets Wire",
      avatarKey: "pink",
      letter: "M",
      folder: "channels",
      canPost: false,
      pinned: false,
      muted: false,
      archived: false,
      unread: 4,
      draft: "",
      bio: "Read-only tape. Rates, oil, and the close.",
      username: "markets",
      subscriberCount: 8420,
      sample: true,
    },
  ];

  const messages: Record<string, Message[]> = {
    botfather: [botfatherHello(now)],
    saved: [
      msg("s1", "me", "Evening brief structure:\n1. One fact in the lede\n2. The number\n3. What changed", 5 * HOUR, now),
      msg("s2", "me", "Short, factual, no hype.", 4 * HOUR, now),
      msg("s3", "me", "Call the printer before six.", 90 * MIN, now, { pinned: true }),
    ],
    lena: [
      msg("l1", "me", "I'll send the cut in twenty.", 3 * HOUR, now, { status: "read" }),
      msg("l2", "lena", "Keep the lede tight. One sentence, then the number.", 2 * HOUR, now),
      msg("l3", "lena", "The photo on the second item is weak. Swap it if you can.", 26 * MIN, now),
      msg("l4", "lena", "I'm at the desk until the run closes.", 18 * MIN, now, {
        reactions: [{ emoji: "👍", mine: false, count: 1 }],
      }),
    ],
    marc: [
      msg("m1", "marc", "Did you see the rates move overnight?", DAY + 2 * HOUR, now),
      msg("m2", "me", "Yes. I'll mention it. I won't lead with it.", DAY + 90 * MIN, now, { status: "read" }),
      msg("m3", "marc", "Fair. I'll have a cleaner chart before the standup.", DAY + 70 * MIN, now),
      msg("m4", "me", "Send it when it's honest, not when it's pretty.", DAY + 40 * MIN, now, { status: "read" }),
    ],
    priya: [
      msg("p1", "priya", "Voice note later — running into a meeting.", 6 * HOUR, now, {
        attachment: { kind: "voice", name: "Voice message", duration: "0:12" },
        text: "",
      }),
      msg("p2", "me", "Go. I'll hold the slot.", 6 * HOUR - 4 * MIN, now, { status: "read" }),
      msg("p3", "priya", "Spelling on the second name is Shah, not Sha. Locked.", 3 * HOUR, now),
    ],
    desk: [
      msg("d1", "lena", "Standup in ten. One item each.", 3 * HOUR, now),
      msg("d2", "marc", "I have the chart. Two panels, no grid.", 2 * HOUR, now),
      msg("d3", "priya", "I have the quote. It's clean.", 80 * MIN, now),
      msg("d4", "me", "I'll open the brief. Lede is the rate cut, not the color.", 50 * MIN, now, { status: "read" }),
      msg("d5", "lena", "Good. File by the top of the hour.", 34 * MIN, now),
    ],
    wiredesk: [
      msg(
        "w1",
        "wiredesk",
        "WIRE Desk is open.\nPosts you write here stay on this computer — they are not sent to a network.",
        8 * HOUR,
        now,
      ),
      msg("w2", "me", "Evening run is framed. One lede, one number, one change.", 3 * HOUR, now, { status: "read" }),
      msg("w3", "wiredesk", "Slot held. Waiting on the second photo.", 2 * HOUR, now),
    ],
    markets: [
      msg("k1", "markets", "Open: dollar firmer, front-end yields up a shade.", 5 * HOUR, now),
      msg("k2", "markets", "Oil quiet. No fresh supply headline in the last hour.", 3 * HOUR, now),
      msg("k3", "markets", "Gold unchanged. Desk treating it as noise.", 70 * MIN, now),
      msg("k4", "markets", "Close watch: one print left, then the recap.", 8 * MIN, now),
    ],
  };

  return {
    chats,
    messages,
    contacts,
    profile: {
      name: "ASP",
      username: "asp",
      bio: "",
      avatarKey: "teal",
    },
  };
}
