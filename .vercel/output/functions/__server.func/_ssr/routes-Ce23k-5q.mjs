import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ArrowLeft, C as EllipsisVertical, D as CheckCheck, E as Check, O as Bookmark, S as FileText, T as ChevronDown, _ as Paperclip, b as Menu, c as Smile, d as Search, f as Play, g as Pause, h as PhoneOff, i as UserRound, j as Archive, k as BellOff, l as Settings, m as Phone, n as Video, o as Trash2, p as Pin, r as Users, s as SquarePen, t as X, u as Send, v as Moon, w as CornerUpLeft, x as Megaphone, y as Mic } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { i as format, n as isToday, r as isThisWeek, t as isYesterday } from "../_libs/date-fns.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ce23k-5q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AVATAR_CLASS = {
	red: "bg-ava-red",
	orange: "bg-ava-orange",
	green: "bg-ava-green",
	teal: "bg-ava-teal",
	blue: "bg-ava-blue",
	violet: "bg-ava-violet",
	pink: "bg-ava-pink",
	saved: "bg-ava-saved"
};
var AVATAR_TEXT = {
	red: "text-ava-red",
	orange: "text-ava-orange",
	green: "text-ava-green",
	teal: "text-ava-teal",
	blue: "text-ava-blue",
	violet: "text-ava-violet",
	pink: "text-ava-pink",
	saved: "text-ava-saved"
};
var FOLDERS = [
	{
		id: "all",
		label: "All"
	},
	{
		id: "unread",
		label: "Unread"
	},
	{
		id: "personal",
		label: "Personal"
	},
	{
		id: "groups",
		label: "Groups"
	},
	{
		id: "channels",
		label: "Channels"
	}
];
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function WireMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 64 64",
		className,
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "64",
			height: "64",
			rx: "16",
			className: "fill-accent"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M14 46 L26 16 L32 34 L38 16 L50 46",
			fill: "none",
			stroke: "var(--color-selected-fg)",
			strokeWidth: "5",
			strokeLinejoin: "round",
			strokeLinecap: "round"
		})]
	});
}
function Avatar({ avatarKey, letter, saved, online, className, iconClassName, dotClassName }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("relative inline-grid shrink-0 place-items-center rounded-full font-medium text-selected-fg", AVATAR_CLASS[avatarKey], className),
		children: [saved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: iconClassName ?? "size-5" }) : letter, online ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("presence absolute bottom-0 right-0 size-3 rounded-full bg-online", dotClassName) }) : null]
	});
}
function Switch({ on, label, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": on,
		"aria-label": label,
		onClick: onToggle,
		className: cn("relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors", on ? "bg-accent" : "bg-badge-muted"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-6 rounded-full bg-selected-fg transition-transform", on && "translate-x-5") })
	});
}
var URL_RE = /(https?:\/\/[^\s]+)/g;
function RichText({ text }) {
	const parts = text.split(URL_RE);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: parts.map((part, index) => part.startsWith("http://") || part.startsWith("https://") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: part,
		target: "_blank",
		rel: "noreferrer",
		className: "break-all text-accent underline",
		children: part
	}, `${part}-${index}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, `${index}-${part.slice(0, 12)}`)) });
}
function listTime(ts) {
	if (isToday(ts)) return format(ts, "HH:mm");
	if (isYesterday(ts)) return "Yesterday";
	if (isThisWeek(ts, { weekStartsOn: 1 })) return format(ts, "EEE");
	return format(ts, "dd.MM.yy");
}
function bubbleTime(ts) {
	return format(ts, "HH:mm");
}
function dayLabel(ts) {
	if (isToday(ts)) return "Today";
	if (isYesterday(ts)) return "Yesterday";
	return format(ts, "MMMM d");
}
function dayKey(ts) {
	return format(ts, "yyyy-MM-dd");
}
function letterOf(name) {
	const ch = Array.from(name.trim())[0];
	return ch ? ch.toUpperCase() : "?";
}
function lastTimestamp(messages) {
	if (!messages?.length) return 0;
	return messages[messages.length - 1]?.createdAt ?? 0;
}
function previewOf(chat, messages, contacts, typing) {
	if (typing) return {
		prefix: "",
		text: "typing…",
		kind: "typing"
	};
	const draft = chat.draft.trim();
	if (draft) return {
		prefix: "Draft: ",
		text: draft,
		kind: "draft"
	};
	const last = messages?.[messages.length - 1];
	if (!last) return {
		prefix: "",
		text: "No messages yet",
		kind: "text"
	};
	let body = last.text.trim();
	if (last.attachment?.kind === "photo") body = body || "Photo";
	else if (last.attachment?.kind === "voice") body = "Voice message";
	else if (last.attachment?.kind === "file") body = last.attachment.name;
	if (!body) body = "Message";
	if (last.senderId === "me") return {
		prefix: "You: ",
		text: body,
		kind: "text"
	};
	if (chat.kind === "group") {
		const name = contacts.find((c) => c.id === last.senderId)?.name ?? "Member";
		return {
			prefix: `${name.split(" ")[0] ?? name}: `,
			text: body,
			kind: "text"
		};
	}
	return {
		prefix: "",
		text: body,
		kind: "text"
	};
}
function subtitle(chat) {
	if (chat.kind === "saved") return {
		text: "your private notes",
		online: false
	};
	if (chat.kind === "channel") {
		const n = chat.subscriberCount ?? 1;
		return {
			text: `${n.toLocaleString("en-US")} subscriber${n === 1 ? "" : "s"}`,
			online: false
		};
	}
	if (chat.kind === "group") {
		const n = chat.memberIds?.length ?? 1;
		return {
			text: `${n} member${n === 1 ? "" : "s"}`,
			online: false
		};
	}
	if (chat.online) return {
		text: "online",
		online: true
	};
	return {
		text: chat.lastSeen || "last seen recently",
		online: false
	};
}
var BY_CONTACT = {
	lena: [
		"On it. I'll read it as soon as it lands.",
		"Keep the lede to one sentence.",
		"That works. Send the cut when it's clean.",
		"I'll hold the slot for you.",
		"Good. Don't bury the number."
	],
	marc: [
		"Noted. I'll update the chart.",
		"That's the right weight for it.",
		"I can pull a cleaner figure.",
		"Agreed. Leave the color out of the lede.",
		"I'll check the source and ping you."
	],
	priya: [
		"Got it. I'll take the quote.",
		"Running, but I saw this.",
		"Yes — I'll confirm the name spelling.",
		"Send it. I'll trim on my side.",
		"Perfect timing."
	]
};
var GENERIC = [
	"Got it.",
	"Okay.",
	"I'll look now.",
	"Thanks — noted.",
	"Say more when you can.",
	"Understood."
];
var QUESTIONS = [
	"I'll check and come back.",
	"Not from here — give me a minute.",
	"Yes. Go ahead.",
	"No, hold that.",
	"I think so. I'll confirm."
];
function pick(list) {
	return list[Math.floor(Math.random() * list.length)] ?? "Got it.";
}
function craftReply(senderId, incoming, attachment) {
	if (attachment === "voice") return pick([
		"Heard it.",
		"Got the voice message.",
		"Listening now."
	]);
	if (attachment === "photo") return pick([
		"Got the photo.",
		"I can see it.",
		"Photo's in."
	]);
	if (attachment === "file") return pick([
		"File received.",
		"Opening it now.",
		"Got the file."
	]);
	const t = incoming.trim().toLowerCase();
	if (!t) return pick(GENERIC);
	if (/^(hi|hey|hello|yo|morning|evening)\b/.test(t)) return pick([
		"Hey.",
		"Here.",
		"Morning.",
		"With you."
	]);
	if (t.includes("thank")) return pick([
		"Anytime.",
		"Of course.",
		"You bet."
	]);
	if (t.includes("?")) return pick(QUESTIONS);
	return pick(BY_CONTACT[senderId] ?? GENERIC);
}
var MIN = 6e4;
var HOUR = 60 * MIN;
function msg(id, senderId, text, ago, now, extra) {
	return {
		id,
		senderId,
		text,
		createdAt: now - ago,
		reactions: [],
		sample: true,
		...extra
	};
}
function createSeed(now = Date.now()) {
	return {
		chats: [
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
				sample: false
			},
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
				sample: true
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
				sample: true
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
				sample: true
			},
			{
				id: "desk",
				kind: "group",
				title: "Desk",
				avatarKey: "orange",
				letter: "D",
				folder: "groups",
				memberIds: [
					"me",
					"lena",
					"marc",
					"priya"
				],
				canPost: true,
				pinned: true,
				muted: false,
				archived: false,
				unread: 1,
				draft: "",
				bio: "The daily run. One item each.",
				sample: true
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
				sample: true
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
				sample: true
			}
		],
		messages: {
			saved: [
				msg("s1", "me", "Evening brief structure:\n1. One fact in the lede\n2. The number\n3. What changed", 5 * HOUR, now),
				msg("s2", "me", "Short, factual, no hype.", 4 * HOUR, now),
				msg("s3", "me", "Call the printer before six.", 90 * MIN, now, { pinned: true })
			],
			lena: [
				msg("l1", "me", "I'll send the cut in twenty.", 3 * HOUR, now, { status: "read" }),
				msg("l2", "lena", "Keep the lede tight. One sentence, then the number.", 2 * HOUR, now),
				msg("l3", "lena", "The photo on the second item is weak. Swap it if you can.", 26 * MIN, now),
				msg("l4", "lena", "I'm at the desk until the run closes.", 18 * MIN, now, { reactions: [{
					emoji: "👍",
					mine: false,
					count: 1
				}] })
			],
			marc: [
				msg("m1", "marc", "Did you see the rates move overnight?", 936e5, now),
				msg("m2", "me", "Yes. I'll mention it. I won't lead with it.", 918e5, now, { status: "read" }),
				msg("m3", "marc", "Fair. I'll have a cleaner chart before the standup.", 906e5, now),
				msg("m4", "me", "Send it when it's honest, not when it's pretty.", 888e5, now, { status: "read" })
			],
			priya: [
				msg("p1", "priya", "Voice note later — running into a meeting.", 6 * HOUR, now, {
					attachment: {
						kind: "voice",
						name: "Voice message",
						duration: "0:12"
					},
					text: ""
				}),
				msg("p2", "me", "Go. I'll hold the slot.", 6 * HOUR - 4 * MIN, now, { status: "read" }),
				msg("p3", "priya", "Spelling on the second name is Shah, not Sha. Locked.", 3 * HOUR, now)
			],
			desk: [
				msg("d1", "lena", "Standup in ten. One item each.", 3 * HOUR, now),
				msg("d2", "marc", "I have the chart. Two panels, no grid.", 2 * HOUR, now),
				msg("d3", "priya", "I have the quote. It's clean.", 80 * MIN, now),
				msg("d4", "me", "I'll open the brief. Lede is the rate cut, not the color.", 50 * MIN, now, { status: "read" }),
				msg("d5", "lena", "Good. File by the top of the hour.", 34 * MIN, now)
			],
			wiredesk: [
				msg("w1", "wiredesk", "WIRE Desk is open.\nPosts you write here stay on this computer — they are not sent to a network.", 8 * HOUR, now),
				msg("w2", "me", "Evening run is framed. One lede, one number, one change.", 3 * HOUR, now, { status: "read" }),
				msg("w3", "wiredesk", "Slot held. Waiting on the second photo.", 2 * HOUR, now)
			],
			markets: [
				msg("k1", "markets", "Open: dollar firmer, front-end yields up a shade.", 5 * HOUR, now),
				msg("k2", "markets", "Oil quiet. No fresh supply headline in the last hour.", 3 * HOUR, now),
				msg("k3", "markets", "Gold unchanged. Desk treating it as noise.", 70 * MIN, now),
				msg("k4", "markets", "Close watch: one print left, then the recap.", 8 * MIN, now)
			]
		},
		contacts: [
			{
				id: "lena",
				name: "Lena Voss",
				avatarKey: "green",
				letter: "L",
				online: true,
				bio: "Desk editor. Cuts long, files short.",
				username: "lena",
				sample: true
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
				sample: true
			},
			{
				id: "priya",
				name: "Priya Shah",
				avatarKey: "violet",
				letter: "P",
				online: true,
				bio: "Quotes, names, and the last look.",
				username: "priya",
				sample: true
			}
		],
		profile: {
			name: "ASP",
			username: "asp",
			bio: "",
			avatarKey: "teal"
		}
	};
}
var AVATAR_CYCLE = [
	"teal",
	"green",
	"violet",
	"orange",
	"pink",
	"blue",
	"red"
];
function uid(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36)}`;
}
function patchChat(chats, id, fn) {
	return chats.map((chat) => chat.id === id ? fn(chat) : chat);
}
var seed = createSeed();
var toastTimer = 0;
var replyTimers = /* @__PURE__ */ new Set();
function scheduleReply(chatId, incoming, attachment) {
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
			const others = live.kind === "group" ? (live.memberIds ?? []).filter((id) => id !== "me") : live.peerId ? [live.peerId] : [];
			const senderId = others[Math.floor(Math.random() * others.length)];
			if (!senderId) {
				useWire.setState({ typingChatId: now.typingChatId === chatId ? null : now.typingChatId });
				return;
			}
			const text = craftReply(senderId, incoming, attachment);
			const reply = {
				id: uid("m"),
				senderId,
				text,
				createdAt: Date.now(),
				reactions: [],
				status: "read"
			};
			const readMine = (now.messages[chatId] ?? []).map((item) => item.senderId === "me" ? {
				...item,
				status: "read"
			} : item);
			const looking = now.foregroundId === chatId;
			useWire.setState({
				typingChatId: now.typingChatId === chatId ? null : now.typingChatId,
				messages: {
					...now.messages,
					[chatId]: [...readMine, reply]
				},
				chats: patchChat(now.chats, chatId, (item) => ({
					...item,
					unread: looking ? item.unread : item.unread + 1
				}))
			});
		}, 700 + Math.floor(Math.random() * 800));
		replyTimers.add(typeFor);
	}, 350);
	replyTimers.add(wait);
}
var useWire = create()(persist((set, get) => ({
	chats: seed.chats,
	messages: seed.messages,
	contacts: seed.contacts,
	profile: seed.profile,
	theme: "day",
	liveReplies: true,
	hydrated: false,
	foregroundId: null,
	typingChatId: null,
	toast: null,
	setTheme: (theme) => set({ theme }),
	setLiveReplies: (liveReplies) => set({ liveReplies }),
	setForeground: (foregroundId) => set({ foregroundId }),
	setDraft: (chatId, draft) => set({ chats: patchChat(get().chats, chatId, (chat) => ({
		...chat,
		draft
	})) }),
	updateProfile: (patch) => set({ profile: {
		...get().profile,
		...patch
	} }),
	cycleAvatar: () => {
		const cur = get().profile.avatarKey;
		const next = AVATAR_CYCLE[(AVATAR_CYCLE.indexOf(cur) + 1) % AVATAR_CYCLE.length] ?? "teal";
		set({ profile: {
			...get().profile,
			avatarKey: next
		} });
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
			chats: patchChat(get().chats, chatId, (chat) => ({
				...chat,
				unread: 0
			})),
			messages: {
				...get().messages,
				[chatId]: messages.map((item) => item.senderId === "me" ? {
					...item,
					status: "read"
				} : item)
			}
		});
	},
	markUnread: (chatId) => set({ chats: patchChat(get().chats, chatId, (chat) => ({
		...chat,
		unread: Math.max(1, chat.unread)
	})) }),
	togglePinChat: (chatId) => set({ chats: patchChat(get().chats, chatId, (chat) => ({
		...chat,
		pinned: !chat.pinned
	})) }),
	toggleMute: (chatId) => set({ chats: patchChat(get().chats, chatId, (chat) => ({
		...chat,
		muted: !chat.muted
	})) }),
	toggleArchive: (chatId) => set({ chats: patchChat(get().chats, chatId, (chat) => ({
		...chat,
		archived: !chat.archived
	})) }),
	deleteChat: (chatId) => {
		if (chatId === "saved") return;
		const messages = { ...get().messages };
		delete messages[chatId];
		set({
			chats: get().chats.filter((chat) => chat.id !== chatId),
			messages,
			foregroundId: get().foregroundId === chatId ? null : get().foregroundId
		});
	},
	clearHistory: (chatId) => set({
		messages: {
			...get().messages,
			[chatId]: []
		},
		chats: patchChat(get().chats, chatId, (chat) => ({
			...chat,
			unread: 0,
			draft: ""
		}))
	}),
	clearSamples: () => {
		const sampleIds = new Set(get().chats.filter((chat) => chat.sample).map((chat) => chat.id));
		if (sampleIds.size === 0) {
			get().notify("No sample chats to remove");
			return;
		}
		const messages = {};
		for (const [id, list] of Object.entries(get().messages)) {
			if (sampleIds.has(id)) continue;
			messages[id] = list.filter((item) => !item.sample);
		}
		const foregroundId = get().foregroundId;
		set({
			chats: get().chats.filter((chat) => !chat.sample),
			contacts: get().contacts.filter((contact) => !contact.sample),
			messages,
			foregroundId: foregroundId && sampleIds.has(foregroundId) ? null : foregroundId
		});
		get().notify("Sample chats removed");
	},
	sendMessage: ({ chatId, text, replyToId, attachment }) => {
		const body = text.trim();
		if (!body && !attachment) return;
		const chat = get().chats.find((item) => item.id === chatId);
		if (!chat || !chat.canPost) return;
		const message = {
			id: uid("m"),
			senderId: "me",
			text: body,
			createdAt: Date.now(),
			replyToId,
			reactions: [],
			attachment,
			status: get().foregroundId === chatId ? "read" : "sent"
		};
		const prior = get().messages[chatId] ?? [];
		set({
			messages: {
				...get().messages,
				[chatId]: [...prior, message]
			},
			chats: patchChat(get().chats, chatId, (item) => ({
				...item,
				draft: ""
			}))
		});
		if (chat.kind === "private" || chat.kind === "group") scheduleReply(chatId, body, attachment?.kind);
	},
	editMessage: (chatId, messageId, text) => {
		const body = text.trim();
		if (!body) return;
		const list = get().messages[chatId] ?? [];
		set({ messages: {
			...get().messages,
			[chatId]: list.map((item) => item.id === messageId && item.senderId === "me" ? {
				...item,
				text: body,
				editedAt: Date.now()
			} : item)
		} });
	},
	deleteMessage: (chatId, messageId) => {
		const list = get().messages[chatId] ?? [];
		set({ messages: {
			...get().messages,
			[chatId]: list.filter((item) => item.id !== messageId)
		} });
	},
	toggleReaction: (chatId, messageId, emoji) => {
		const list = get().messages[chatId] ?? [];
		set({ messages: {
			...get().messages,
			[chatId]: list.map((item) => {
				if (item.id !== messageId) return item;
				const existing = item.reactions.find((reaction) => reaction.emoji === emoji);
				let reactions;
				if (!existing) reactions = [...item.reactions, {
					emoji,
					mine: true,
					count: 1
				}];
				else if (existing.mine) {
					const next = existing.count - 1;
					reactions = next <= 0 ? item.reactions.filter((reaction) => reaction.emoji !== emoji) : item.reactions.map((reaction) => reaction.emoji === emoji ? {
						...reaction,
						mine: false,
						count: next
					} : reaction);
				} else reactions = item.reactions.map((reaction) => reaction.emoji === emoji ? {
					...reaction,
					mine: true,
					count: reaction.count + 1
				} : reaction);
				return {
					...item,
					reactions
				};
			})
		} });
	},
	pinMessage: (chatId, messageId) => {
		const list = get().messages[chatId] ?? [];
		const next = !list.find((item) => item.id === messageId)?.pinned;
		set({ messages: {
			...get().messages,
			[chatId]: list.map((item) => ({
				...item,
				pinned: next && item.id === messageId
			}))
		} });
	},
	forwardMessage: (fromChatId, messageId, toChatId) => {
		const sourceChat = get().chats.find((item) => item.id === fromChatId);
		const source = (get().messages[fromChatId] ?? []).find((item) => item.id === messageId);
		const target = get().chats.find((item) => item.id === toChatId);
		if (!source || !target?.canPost) return;
		const copy = {
			id: uid("m"),
			senderId: "me",
			text: source.text,
			createdAt: Date.now(),
			reactions: [],
			attachment: source.attachment,
			forwardedFrom: sourceChat?.title ?? "chat",
			status: "sent"
		};
		const prior = get().messages[toChatId] ?? [];
		set({ messages: {
			...get().messages,
			[toChatId]: [...prior, copy]
		} });
		get().notify(`Forwarded to ${target.title}`);
	},
	openDirect: (contactId) => {
		const contact = get().contacts.find((item) => item.id === contactId);
		if (!contact) return null;
		const existing = get().chats.find((chat) => chat.kind === "private" && chat.peerId === contactId);
		if (existing) {
			if (existing.archived) set({ chats: patchChat(get().chats, existing.id, (chat) => ({
				...chat,
				archived: false
			})) });
			return existing.id;
		}
		const id = uid("c");
		set({
			chats: [{
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
				username: contact.username
			}, ...get().chats],
			messages: {
				...get().messages,
				[id]: []
			}
		});
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
		const contact = {
			id: uid("u"),
			name,
			avatarKey,
			letter: letterOf(name),
			online: false,
			lastSeen: "last seen recently",
			username
		};
		set({ contacts: [...get().contacts, contact] });
		return get().openDirect(contact.id);
	},
	createGroup: (raw, memberIds) => {
		const title = raw.trim();
		const members = Array.from(/* @__PURE__ */ new Set(["me", ...memberIds]));
		if (!title || members.length < 2) return null;
		const avatarKey = AVATAR_CYCLE[get().chats.length % AVATAR_CYCLE.length] ?? "orange";
		const id = uid("c");
		const chat = {
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
			bio: "Group"
		};
		const intro = {
			id: uid("m"),
			senderId: "me",
			text: `${get().profile.name} created the group`,
			createdAt: Date.now(),
			reactions: [],
			status: "read"
		};
		set({
			chats: [chat, ...get().chats],
			messages: {
				...get().messages,
				[id]: [intro]
			}
		});
		return id;
	},
	createChannel: (raw) => {
		const title = raw.trim();
		if (!title) return null;
		const id = uid("c");
		set({
			chats: [{
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
				bio: "Your channel. Only you can post."
			}, ...get().chats],
			messages: {
				...get().messages,
				[id]: []
			}
		});
		return id;
	}
}), {
	name: "wire-desk-v1",
	version: 1,
	skipHydration: true,
	storage: createJSONStorage(() => localStorage),
	partialize: (state) => ({
		chats: state.chats,
		messages: state.messages,
		contacts: state.contacts,
		profile: state.profile,
		theme: state.theme,
		liveReplies: state.liveReplies
	})
}));
var EMOJI = [
	"😀",
	"😁",
	"😂",
	"🤣",
	"😊",
	"😍",
	"😘",
	"😎",
	"🤔",
	"😴",
	"😮",
	"😢",
	"😡",
	"👍",
	"👎",
	"👏",
	"🔥",
	"❤️",
	"✨",
	"🎉",
	"✅",
	"📌",
	"💬",
	"📰",
	"📷",
	"📎",
	"⏰",
	"💡",
	"📈",
	"📉",
	"☕",
	"🌙"
];
function VoiceNote({ duration }) {
	const [playing, setPlaying] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setPlaying((value) => !value),
		className: "flex min-w-52 items-center gap-2 py-1",
		"aria-label": playing ? "Pause voice message" : "Play voice message",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-9 place-items-center rounded-full bg-accent text-selected-fg",
				children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("flex h-6 flex-1 items-end gap-0.5", playing && "voice-on"),
				children: Array.from({ length: 18 }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-0.5 rounded-full bg-accent",
					style: {
						height: `${8 + index * 17 % 14}px`,
						animationDelay: `${index * 40}ms`
					}
				}, index))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: duration
			})
		]
	});
}
function Conversation({ chatId, onBack, onInfo, onCall, onMessageMenu, command }) {
	const chat = useWire((s) => s.chats.find((item) => item.id === chatId));
	const messages = useWire((s) => s.messages[chatId] ?? []);
	const contacts = useWire((s) => s.contacts);
	const typing = useWire((s) => s.typingChatId === chatId);
	const setDraft = useWire((s) => s.setDraft);
	const sendMessage = useWire((s) => s.sendMessage);
	const editMessage = useWire((s) => s.editMessage);
	const notify = useWire((s) => s.notify);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [search, setSearch] = (0, import_react.useState)("");
	const [replyId, setReplyId] = (0, import_react.useState)(null);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [emojiOpen, setEmojiOpen] = (0, import_react.useState)(false);
	const [attachOpen, setAttachOpen] = (0, import_react.useState)(false);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [atBottom, setAtBottom] = (0, import_react.useState)(true);
	const [lightbox, setLightbox] = (0, import_react.useState)(null);
	const [boundary, setBoundary] = (0, import_react.useState)(null);
	const scrollerRef = (0, import_react.useRef)(null);
	const boxRef = (0, import_react.useRef)(null);
	const photoRef = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		setSearchOpen(false);
		setSearch("");
		setReplyId(null);
		setEditId(null);
		setEmojiOpen(false);
		setAttachOpen(false);
		setRecording(false);
		const unread = useWire.getState().chats.find((item) => item.id === chatId)?.unread ?? 0;
		const list = useWire.getState().messages[chatId] ?? [];
		if (unread > 0 && list.length >= unread) setBoundary(list[list.length - unread]?.id ?? null);
		else setBoundary(null);
	}, [chatId]);
	(0, import_react.useLayoutEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
		setAtBottom(true);
	}, [chatId]);
	(0, import_react.useEffect)(() => {
		if (!atBottom) return;
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [
		atBottom,
		messages.length,
		typing
	]);
	(0, import_react.useEffect)(() => {
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
	}, [
		chatId,
		command,
		setDraft
	]);
	(0, import_react.useEffect)(() => {
		if (!recording) return;
		const id = window.setInterval(() => setSeconds((value) => value + 1), 1e3);
		return () => window.clearInterval(id);
	}, [recording]);
	if (!chat) return null;
	const status = subtitle(chat);
	const draft = chat.draft;
	const editing = editId ? messages.find((item) => item.id === editId) : void 0;
	const replying = replyId ? messages.find((item) => item.id === replyId) : void 0;
	const needle = search.trim().toLowerCase();
	const visible = needle ? messages.filter((item) => item.text.toLowerCase().includes(needle)) : messages;
	const pinned = messages.find((item) => item.pinned);
	const canCall = chat.kind === "private" || chat.kind === "group";
	function grow(el) {
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
		sendMessage({
			chatId,
			text: draft,
			replyToId: replying?.id
		});
		setReplyId(null);
		setEmojiOpen(false);
		if (boxRef.current) boxRef.current.style.height = "auto";
	}
	async function takeFile(file, kind) {
		let dataUrl;
		if (kind === "photo" && file.size <= 16e4) {
			const url = await file.arrayBuffer().then((buf) => {
				const bytes = new Uint8Array(buf);
				let binary = "";
				for (const byte of bytes) binary += String.fromCharCode(byte);
				return `data:${file.type || "image/png"};base64,${btoa(binary)}`;
			});
			dataUrl = url.length > 22e4 ? void 0 : url;
		}
		if (kind === "photo" && !dataUrl) notify("Image kept as a file — too large to store on this device.");
		const attachment = {
			kind: dataUrl ? "photo" : "file",
			name: file.name,
			dataUrl
		};
		sendMessage({
			chatId,
			text: "",
			attachment,
			replyToId: replying?.id
		});
		setReplyId(null);
		setAttachOpen(false);
	}
	function stopRecording(sendIt) {
		const spent = seconds;
		setRecording(false);
		setSeconds(0);
		if (!sendIt) return;
		const duration = `0:${String(Math.max(1, spent)).padStart(2, "0")}`;
		sendMessage({
			chatId,
			text: "",
			replyToId: replying?.id,
			attachment: {
				kind: "voice",
				name: "Voice message",
				duration
			}
		});
		setReplyId(null);
	}
	function senderName(senderId) {
		if (senderId === "me") return "You";
		return contacts.find((item) => item.id === senderId)?.name ?? chat?.title ?? "WIRE";
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-full min-h-0 min-w-0 flex-1 flex-col bg-chat",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-1 border-b border-line bg-header px-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Back",
						onClick: onBack,
						className: "grid size-11 place-items-center text-muted md:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onInfo,
						className: "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-1 text-left hover:bg-hover",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							avatarKey: chat.avatarKey,
							letter: chat.letter,
							saved: chat.kind === "saved",
							online: chat.online,
							className: "size-10 text-sm",
							iconClassName: "size-4",
							dotClassName: "size-2.5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-base font-medium",
								children: chat.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("block truncate text-xs", status.online || typing ? "text-accent" : "text-muted"),
								children: typing ? "typing…" : status.text
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Search in chat",
						onClick: () => setSearchOpen((value) => !value),
						className: "grid size-11 place-items-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
					}),
					canCall ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Voice call",
						onClick: () => onCall("voice"),
						className: "hidden size-11 place-items-center text-muted sm:grid",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Video call",
						onClick: () => onCall("video"),
						className: "hidden size-11 place-items-center text-muted sm:grid",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
					})] }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Chat info",
						onClick: onInfo,
						className: "grid size-11 place-items-center text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "size-5" })
					})
				]
			}),
			searchOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 items-center gap-2 border-b border-line bg-header px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					autoFocus: true,
					value: search,
					onChange: (event) => setSearch(event.target.value),
					placeholder: "Search this chat",
					"aria-label": "Search this chat",
					className: "h-10 min-w-0 flex-1 rounded-full bg-input px-4 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 text-xs text-muted",
					children: visible.length
				})]
			}) : null,
			pinned && !needle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => document.getElementById(`msg-${pinned.id}`)?.scrollIntoView({ block: "center" }),
				className: "flex shrink-0 items-center gap-3 border-b border-line bg-header px-4 py-2 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs font-medium text-accent",
						children: "Pinned message"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate text-sm text-muted",
						children: pinned.text || pinned.attachment?.name || "Attachment"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scrollerRef,
				onScroll: () => {
					const el = scrollerRef.current;
					if (!el) return;
					const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
					setAtBottom(gap < 80);
				},
				className: "chat-wallpaper min-h-0 flex-1 overflow-y-auto px-3 py-3",
				children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-16 text-center text-sm text-muted",
					children: needle ? "No messages found" : "No messages yet"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [visible.map((message, index) => {
						const prev = visible[index - 1];
						const next = visible[index + 1];
						const showDay = !prev || dayKey(prev.createdAt) !== dayKey(message.createdAt);
						const mine = message.senderId === "me";
						const gap = !prev || message.createdAt - prev.createdAt > 3e5;
						const first = showDay || !prev || prev.senderId !== message.senderId || gap;
						const tail = !next || next.senderId !== message.senderId || next.createdAt - message.createdAt > 3e5 || dayKey(next.createdAt) !== dayKey(message.createdAt);
						const sender = contacts.find((item) => item.id === message.senderId);
						const reply = message.replyToId ? messages.find((item) => item.id === message.replyToId) : void 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							id: `msg-${message.id}`,
							children: [
								showDay ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "my-2 flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-chip px-3 py-1 text-xs font-medium text-chip-fg",
										children: dayLabel(message.createdAt)
									})
								}) : null,
								boundary === message.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "my-2 flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-chip px-3 py-1 text-xs font-medium text-chip-fg",
										children: "Unread messages"
									})
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: cn("flex", mine ? "justify-end" : "justify-start", first ? "mt-2" : "mt-0.5"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative max-w-full",
										onDoubleClick: () => {
											setEditId(null);
											setReplyId(message.id);
											boxRef.current?.focus();
										},
										onContextMenu: (event) => {
											event.preventDefault();
											onMessageMenu(message, event.clientX, event.clientY);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											"aria-label": "Message actions",
											onClick: (event) => {
												const rect = event.currentTarget.getBoundingClientRect();
												onMessageMenu(message, rect.left, rect.bottom);
											},
											className: "absolute -right-1 top-0 z-10 grid size-8 place-items-center rounded-full bg-header text-muted opacity-100 elevated sm:opacity-0 sm:group-hover:opacity-100",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: cn("bubble px-2.5 py-1.5", mine ? "bg-bubble-out text-bubble-out-fg" : "bg-bubble-in text-bubble-in-fg", tail && (mine ? "tail-out" : "tail-in")),
											children: [
												chat.kind === "group" && !mine && first ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: cn("px-0.5 text-xs font-semibold", sender ? AVATAR_TEXT[sender.avatarKey] : "text-accent"),
													children: senderName(message.senderId)
												}) : null,
												message.forwardedFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "px-0.5 text-xs italic text-accent",
													children: ["Forwarded from ", message.forwardedFrom]
												}) : null,
												reply ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-1 rounded-md border-l-2 border-accent bg-hover px-2 py-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs font-medium text-accent",
														children: senderName(reply.senderId)
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "truncate text-xs text-muted",
														children: reply.text || reply.attachment?.name || "Message"
													})]
												}) : null,
												message.attachment?.kind === "photo" && message.attachment.dataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setLightbox(message.attachment?.dataUrl ?? null),
													className: "mb-1 block",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
														src: message.attachment.dataUrl,
														alt: message.attachment.name,
														className: "max-h-56 rounded-lg object-cover"
													})
												}) : null,
												message.attachment?.kind === "file" || message.attachment?.kind === "photo" && !message.attachment.dataUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mb-1 flex items-center gap-2 rounded-lg bg-hover px-2 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "min-w-0 truncate text-sm",
														children: message.attachment?.name
													})]
												}) : null,
												message.attachment?.kind === "voice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceNote, { duration: message.attachment.duration ?? "0:01" }) : null,
												message.text ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "whitespace-pre-wrap break-words px-0.5 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, { text: message.text })
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: cn("mt-0.5 flex items-center justify-end gap-1 text-xs", mine ? "text-muted-out" : "text-muted"),
													children: [
														message.editedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "edited" }) : null,
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bubbleTime(message.createdAt) }),
														mine ? message.status === "read" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3.5 text-check" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }) : null
													]
												}),
												message.reactions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-1 flex flex-wrap justify-end gap-1",
													children: message.reactions.map((reaction) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => useWire.getState().toggleReaction(chatId, message.id, reaction.emoji),
														className: cn("rounded-full bg-header px-1.5 py-0.5 text-xs", reaction.mine && "ring-1 ring-accent"),
														children: [
															reaction.emoji,
															" ",
															reaction.count
														]
													}, reaction.emoji))
												}) : null
											]
										})]
									})
								})
							]
						}, message.id);
					}), typing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex justify-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bubble tail-in bg-bubble-in px-3 py-2 text-sm text-muted",
							children: "typing…"
						})
					}) : null]
				})
			}),
			!atBottom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Jump to latest",
				onClick: () => {
					const el = scrollerRef.current;
					if (!el) return;
					el.scrollTop = el.scrollHeight;
				},
				className: "absolute bottom-24 right-4 grid size-11 place-items-center rounded-full bg-header text-accent elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-5" })
			}) : null,
			lightbox ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "Close photo",
				onClick: () => setLightbox(null),
				className: "absolute inset-0 z-30 grid place-items-center bg-overlay p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: lightbox,
					alt: "",
					className: "max-h-full max-w-full rounded-lg object-contain"
				})
			}) : null,
			!chat.canPost ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 shrink-0 items-center justify-center border-t border-line bg-compose text-sm text-muted",
				children: "You can't post in this channel"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "shrink-0 border-t border-line bg-compose",
				children: [
					editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-line px-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs font-medium text-accent",
								children: "Edit message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-xs text-muted",
								children: editing.text
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Cancel edit",
							onClick: () => {
								setEditId(null);
								setDraft(chatId, "");
							},
							className: "grid size-9 place-items-center text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}) : null,
					replying && !editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-line px-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerUpLeft, { className: "size-4 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs font-medium text-accent",
									children: senderName(replying.senderId)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-xs text-muted",
									children: replying.text || replying.attachment?.name || "Message"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Cancel reply",
								onClick: () => setReplyId(null),
								className: "grid size-9 place-items-center text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})
						]
					}) : null,
					emojiOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-8 gap-1 border-b border-line px-3 py-2",
						children: EMOJI.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid h-10 place-items-center rounded-lg text-xl hover:bg-hover",
							onClick: () => {
								setDraft(chatId, `${draft}${emoji}`);
								boxRef.current?.focus();
							},
							children: emoji
						}, emoji))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-1 px-2 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Attach",
										onClick: () => {
											setAttachOpen((value) => !value);
											setEmojiOpen(false);
										},
										className: "grid size-11 place-items-center text-muted",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-5" })
									}),
									attachOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute bottom-12 left-0 z-20 w-44 overflow-hidden rounded-xl bg-header py-1 elevated",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-hover",
											onClick: () => photoRef.current?.click(),
											children: "Photo"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-hover",
											onClick: () => fileRef.current?.click(),
											children: "File"
										})]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: photoRef,
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (event) => {
											const file = event.target.files?.[0];
											event.target.value = "";
											if (file) takeFile(file, "photo");
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: fileRef,
										type: "file",
										className: "hidden",
										onChange: (event) => {
											const file = event.target.files?.[0];
											event.target.value = "";
											if (file) takeFile(file, "file");
										}
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Emoji",
								onClick: () => {
									setEmojiOpen((value) => !value);
									setAttachOpen(false);
								},
								className: "grid size-11 place-items-center text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "size-5" })
							}),
							recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full bg-input px-4 text-sm text-danger",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-danger" }),
									"Recording ",
									`0:${String(seconds).padStart(2, "0")}`,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "ml-auto text-muted",
										onClick: () => stopRecording(false),
										children: "Cancel"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: boxRef,
								rows: 1,
								value: draft,
								placeholder: chat.kind === "saved" ? "Write a note" : chat.kind === "channel" ? "Broadcast" : "Message",
								"aria-label": "Message",
								onChange: (event) => {
									setDraft(chatId, event.target.value);
									grow(event.target);
								},
								onKeyDown: (event) => {
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
								},
								className: "max-h-36 min-h-11 flex-1 resize-none rounded-3xl bg-input px-4 py-2.5 text-sm text-fg outline-none placeholder:text-muted"
							}),
							draft.trim() && !recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Send",
								onClick: send,
								className: "grid size-11 place-items-center rounded-full bg-accent text-selected-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-5" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": recording ? "Send voice message" : "Record voice message",
								onClick: () => {
									if (recording) stopRecording(true);
									else {
										setSeconds(0);
										setRecording(true);
									}
								},
								className: "grid size-11 place-items-center text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: cn("size-5", recording && "text-danger") })
							})
						]
					})
				]
			})
		]
	});
}
function PanelHead({ title, onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Back",
			onClick: onBack,
			className: "grid size-11 place-items-center text-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-5" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-base font-semibold",
			children: title
		})]
	});
}
function Row({ icon, label, onClick, danger }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex w-full items-center gap-4 px-5 py-3 text-left text-base hover:bg-hover", danger && "text-danger"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: icon
		}), label]
	});
}
function MenuPanel({ onClose, onSettings, onContacts, onGroup, onChannel, onSaved }) {
	const profile = useWire((s) => s.profile);
	const theme = useWire((s) => s.theme);
	const setTheme = useWire((s) => s.setTheme);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 bg-accent px-4 py-5 text-selected-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						avatarKey: profile.avatarKey,
						letter: profile.name.slice(0, 1).toUpperCase(),
						className: "size-16 text-xl"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate text-lg font-semibold",
							children: profile.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block truncate text-sm text-selected-fg/80",
							children: ["@", profile.username]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close menu",
						onClick: onClose,
						className: "ml-auto grid size-11 place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5" }),
						label: "New Group",
						onClick: onGroup
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-5" }),
						label: "New Channel",
						onClick: onChannel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, { className: "size-5" }),
						label: "Contacts",
						onClick: onContacts
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-5" }),
						label: "Saved Messages",
						onClick: onSaved
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" }),
						label: "Settings",
						onClick: onSettings
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 px-5 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "size-5 text-muted" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex-1 text-base",
								children: "Night Mode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								on: theme === "night",
								label: "Night Mode",
								onToggle: () => setTheme(theme === "night" ? "day" : "night")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-5 py-4 text-xs text-muted",
				children: "WIRE 1.0 · one account, yours"
			})
		]
	});
}
function SettingsPanel({ onBack }) {
	const profile = useWire((s) => s.profile);
	const theme = useWire((s) => s.theme);
	const live = useWire((s) => s.liveReplies);
	const updateProfile = useWire((s) => s.updateProfile);
	const cycleAvatar = useWire((s) => s.cycleAvatar);
	const setTheme = useWire((s) => s.setTheme);
	const setLive = useWire((s) => s.setLiveReplies);
	const clearSamples = useWire((s) => s.clearSamples);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-sidebar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Settings",
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-col items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						avatarKey: profile.avatarKey,
						letter: profile.name.slice(0, 1).toUpperCase() || "?",
						className: "size-24 text-3xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: cycleAvatar,
						className: "text-sm font-medium text-accent",
						children: "Change color"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mb-3 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-xs text-accent",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: profile.name,
						onChange: (event) => updateProfile({ name: event.target.value.slice(0, 32) }),
						className: "h-11 w-full rounded-xl bg-input px-3 outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mb-3 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-xs text-accent",
						children: "Username"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: profile.username,
						onChange: (event) => updateProfile({ username: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 16) }),
						className: "h-11 w-full rounded-xl bg-input px-3 outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "mb-4 block text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-xs text-accent",
						children: "Bio"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: profile.bio,
						onChange: (event) => updateProfile({ bio: event.target.value.slice(0, 140) }),
						rows: 3,
						className: "w-full resize-none rounded-xl bg-input px-3 py-2 outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between rounded-xl bg-input px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm",
						children: "Theme"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex gap-1",
						children: ["day", "night"].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTheme(mode),
							className: cn("rounded-full px-3 py-1.5 text-sm", theme === mode ? "bg-accent text-selected-fg" : "text-muted"),
							children: mode === "day" ? "Day" : "Night"
						}, mode))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between rounded-xl bg-input px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pr-3 text-sm",
						children: "Replies on this device"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						on: live,
						label: "Replies on this device",
						onToggle: () => setLive(!live)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 px-1 text-xs leading-5 text-muted",
					children: "WIRE keeps every chat on this computer. There is one account — yours. Nothing here is sent to Telegram."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: clearSamples,
					className: "h-11 w-full rounded-xl bg-hover text-sm font-medium text-danger",
					children: "Remove sample chats"
				})
			]
		})]
	});
}
function ContactsPanel({ onBack, onOpen }) {
	const contacts = useWire((s) => s.contacts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-sidebar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "Contacts",
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "min-h-0 flex-1 overflow-y-auto",
			children: contacts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-6 py-10 text-center text-sm text-muted",
				children: "No contacts yet."
			}) : contacts.map((contact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onOpen(contact.id),
				className: "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					avatarKey: contact.avatarKey,
					letter: contact.letter,
					online: contact.online,
					className: "size-12 text-base"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block truncate font-medium",
						children: contact.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("block truncate text-sm", contact.online ? "text-accent" : "text-muted"),
						children: contact.online ? "online" : contact.lastSeen || contact.username
					})]
				})]
			}, contact.id))
		})]
	});
}
function NewChatPanel({ onBack, onOpen }) {
	const contacts = useWire((s) => s.contacts);
	const createContact = useWire((s) => s.createContact);
	const openDirect = useWire((s) => s.openDirect);
	const [name, setName] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const shown = contacts.filter((contact) => contact.name.toLowerCase().includes(q.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
				title: "New message",
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (event) => setQ(event.target.value),
					placeholder: "Search contacts",
					"aria-label": "Search contacts",
					className: "h-11 w-full rounded-full bg-input px-4 text-sm outline-none"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2 px-3 pb-2",
				onSubmit: (event) => {
					event.preventDefault();
					const id = createContact(name);
					if (id) onOpen(id);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					placeholder: "New contact name",
					"aria-label": "New contact name",
					className: "h-11 min-w-0 flex-1 rounded-full bg-input px-4 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-11 rounded-full bg-accent px-4 text-sm font-medium text-selected-fg",
					children: "Add"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: shown.map((contact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						const id = openDirect(contact.id);
						if (id) onOpen(id);
					},
					className: "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						avatarKey: contact.avatarKey,
						letter: contact.letter,
						online: contact.online,
						className: "size-12"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate font-medium",
						children: contact.name
					})]
				}, contact.id))
			})
		]
	});
}
function NewGroupPanel({ onBack, onOpen }) {
	const contacts = useWire((s) => s.contacts);
	const createGroup = useWire((s) => s.createGroup);
	const [title, setTitle] = (0, import_react.useState)("");
	const [picked, setPicked] = (0, import_react.useState)([]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-sidebar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
				title: "New group",
				onBack
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (event) => setTitle(event.target.value),
					placeholder: "Group name",
					"aria-label": "Group name",
					className: "h-11 w-full rounded-full bg-input px-4 text-sm outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !title.trim() || picked.length === 0,
					onClick: () => {
						const id = createGroup(title, picked);
						if (id) onOpen(id);
					},
					className: "h-11 w-full rounded-full bg-accent text-sm font-medium text-selected-fg disabled:opacity-40",
					children: "Create"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: contacts.map((contact) => {
					const on = picked.includes(contact.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPicked((list) => on ? list.filter((id) => id !== contact.id) : [...list, contact.id]),
						className: "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								avatarKey: contact.avatarKey,
								letter: contact.letter,
								className: "size-11"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1 truncate",
								children: contact.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-5 rounded-full border border-line", on && "border-accent bg-accent") })
						]
					}, contact.id);
				})
			})
		]
	});
}
function NewChannelPanel({ onBack, onOpen }) {
	const createChannel = useWire((s) => s.createChannel);
	const [title, setTitle] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-0 z-30 flex flex-col bg-sidebar",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelHead, {
			title: "New channel",
			onBack
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3 px-4 py-4",
			onSubmit: (event) => {
				event.preventDefault();
				const id = createChannel(title);
				if (id) onOpen(id);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Only you post. Subscribers on this device are just you."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: title,
					onChange: (event) => setTitle(event.target.value),
					placeholder: "Channel name",
					"aria-label": "Channel name",
					className: "h-11 w-full rounded-full bg-input px-4 text-sm outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: !title.trim(),
					className: "h-11 w-full rounded-full bg-accent text-sm font-medium text-selected-fg disabled:opacity-40",
					children: "Create"
				})
			]
		})]
	});
}
function InfoPanel({ chat, onClose }) {
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
	const media = messages.filter((item) => item.attachment).length;
	const [confirm, setConfirm] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "absolute inset-y-0 right-0 z-20 flex w-full flex-col border-l border-line bg-header sm:w-info xl:static",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 shrink-0 items-center gap-2 px-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close info",
					onClick: onClose,
					className: "grid size-11 place-items-center text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: "Info"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 pb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center py-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								avatarKey: chat.avatarKey,
								letter: chat.letter,
								saved: chat.kind === "saved",
								online: chat.online,
								className: "size-24 text-3xl",
								iconClassName: "size-10"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 text-lg font-semibold",
								children: chat.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm", status.online ? "text-accent" : "text-muted"),
								children: status.text
							}),
							chat.username ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["@", chat.username]
							}) : null,
							chat.bio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-xs text-sm text-fg",
								children: chat.bio
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 rounded-xl bg-hover px-3 py-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Shared files"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "float-right font-medium",
							children: media
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toggleMute(chat.id),
						className: "flex h-12 w-full items-center text-left text-sm",
						children: chat.muted ? "Unmute" : "Mute"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => togglePin(chat.id),
						className: "flex h-12 w-full items-center text-left text-sm",
						children: chat.pinned ? "Unpin chat" : "Pin chat"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => toggleArchive(chat.id),
						className: "flex h-12 w-full items-center gap-2 text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-4 text-muted" }), chat.archived ? "Unarchive" : "Archive"]
					}),
					chat.kind === "group" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs font-medium text-accent",
							children: "Members"
						}), (chat.memberIds ?? []).filter((id) => id !== "me").map((id) => contacts.find((contact) => contact.id === id)).filter((contact) => contact != null).map((contact) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								const next = openDirect(contact.id);
								if (!next) return;
								setForeground(next);
								onClose();
								window.dispatchEvent(new CustomEvent("wire-open", { detail: next }));
							},
							className: "flex w-full items-center gap-3 py-2 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								avatarKey: contact.avatarKey,
								letter: contact.letter,
								online: contact.online,
								className: "size-10 text-sm"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm",
								children: contact.name
							})]
						}, contact.id))]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setConfirm("clear"),
						className: "mt-4 flex h-12 w-full items-center gap-2 text-left text-sm text-danger",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), "Clear history"]
					}),
					chat.kind !== "saved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setConfirm("delete"),
						className: "flex h-12 w-full items-center text-left text-sm text-danger",
						children: "Delete chat"
					}) : null
				]
			}),
			confirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-10 grid place-items-center bg-overlay p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-header p-5 elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold",
							children: confirm === "delete" ? `Delete ${chat.title}?` : "Clear history?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "This only affects this computer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirm(null),
								className: "h-10 rounded-full px-4 text-sm",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 rounded-full bg-danger px-4 text-sm font-medium text-selected-fg",
								onClick: () => {
									if (confirm === "delete") {
										deleteChat(chat.id);
										onClose();
									} else {
										clearHistory(chat.id);
										setConfirm(null);
									}
								},
								children: confirm === "delete" ? "Delete" : "Clear"
							})]
						})
					]
				})
			}) : null
		]
	});
}
function CallOverlay({ chat, kind, onHang }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-center bg-overlay p-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full max-w-sm flex-col items-center rounded-3xl bg-header px-6 py-8 text-center elevated",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					avatarKey: chat.avatarKey,
					letter: chat.letter,
					className: "size-24 text-3xl"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-lg font-semibold",
					children: chat.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-accent",
					children: kind === "video" ? "Video call" : "Calling…"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted",
					children: "Calls stay on this device. No line is connected."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onHang,
					className: "mt-6 grid size-14 place-items-center rounded-full bg-danger text-selected-fg",
					"aria-label": "Hang up",
					children: kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-6" })
				})
			]
		})
	});
}
function ForwardDialog({ onClose, onPick }) {
	const chats = useWire((s) => s.chats.filter((chat) => chat.canPost && !chat.archived));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 grid place-items-center bg-overlay p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-header elevated",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 items-center justify-between px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Forward to"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Close",
					onClick: onClose,
					className: "grid size-10 place-items-center text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: chats.map((chat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(chat.id),
					className: "flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-hover",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						avatarKey: chat.avatarKey,
						letter: chat.letter,
						saved: chat.kind === "saved",
						className: "size-11",
						iconClassName: "size-4"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: chat.title
					})]
				}, chat.id))
			})]
		})
	});
}
function ContextMenu({ x, y, items, onClose }) {
	(0, import_react.useEffect)(() => {
		const close = () => onClose();
		const id = window.setTimeout(() => window.addEventListener("pointerdown", close), 0);
		return () => {
			window.clearTimeout(id);
			window.removeEventListener("pointerdown", close);
		};
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "menu",
		onPointerDown: (event) => event.stopPropagation(),
		style: {
			left: x,
			top: y
		},
		className: "fixed z-50 w-56 overflow-hidden rounded-xl bg-header py-1 elevated",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "menuitem",
			onClick: () => {
				item.onClick();
				onClose();
			},
			className: cn("flex h-11 w-full items-center px-4 text-left text-sm hover:bg-hover", item.danger ? "text-danger" : "text-fg"),
			children: item.label
		}, item.label))
	});
}
function EmptyPane() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "chat-wallpaper hidden h-full min-w-0 flex-1 flex-col items-center justify-center md:flex",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WireMark, { className: "size-20 opacity-90" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 text-xl font-semibold",
				children: "WIRE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: "Select a chat to start messaging"
			})
		]
	});
}
function Toast({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-chip px-4 py-2 text-sm text-chip-fg elevated",
		children: text
	});
}
function Sidebar({ folder, setFolder, query, setQuery, archiveOpen, setArchiveOpen, activeId, onOpen, onMenu, onNew, onContext }) {
	const chats = useWire((s) => s.chats);
	const messages = useWire((s) => s.messages);
	const contacts = useWire((s) => s.contacts);
	const typingChatId = useWire((s) => s.typingChatId);
	const archivedCount = chats.filter((chat) => chat.archived).length;
	const needle = query.trim().toLowerCase();
	const rows = (0, import_react.useMemo)(() => {
		return chats.filter((chat) => {
			if (needle) {
				if (chat.title.toLowerCase().includes(needle)) return true;
				return (messages[chat.id] ?? []).some((item) => item.text.toLowerCase().includes(needle));
			}
			if (archiveOpen) return chat.archived;
			if (chat.archived) return false;
			if (folder === "all") return true;
			if (folder === "unread") return chat.unread > 0;
			return chat.folder === folder;
		}).sort((a, b) => {
			if (!needle && !archiveOpen && a.pinned !== b.pinned) return a.pinned ? -1 : 1;
			return lastTimestamp(messages[b.id]) - lastTimestamp(messages[a.id]);
		});
	}, [
		archiveOpen,
		chats,
		folder,
		messages,
		needle
	]);
	const unreadIn = (id) => {
		if (id === "all" || id === "unread") return chats.filter((chat) => !chat.archived && chat.unread > 0).length;
		return chats.filter((chat) => !chat.archived && chat.folder === id && chat.unread > 0).length;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-0 flex-col",
		children: [
			archiveOpen && !needle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 shrink-0 items-center gap-2 px-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Back to chats",
					onClick: () => setArchiveOpen(false),
					className: "grid size-11 place-items-center text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-base font-semibold",
					children: "Archived Chats"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "shrink-0 px-3 pb-1 pt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-11 items-center gap-2 rounded-full bg-input px-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Main menu",
							onClick: onMenu,
							className: "grid size-9 place-items-center text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Search",
							"aria-label": "Search chats",
							className: "min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted"
						}),
						query ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Clear search",
							onClick: () => setQuery(""),
							className: "grid size-8 place-items-center text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}) : null
					]
				})
			}),
			!archiveOpen && !needle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 gap-1 overflow-x-auto px-2",
				children: FOLDERS.map((item) => {
					const active = folder === item.id;
					const count = unreadIn(item.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setFolder(item.id),
						className: cn("relative shrink-0 px-3 py-2 text-sm font-medium", active ? "text-accent" : "text-muted"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [item.label, count > 0 && item.id !== "all" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: count
							}) : null]
						}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-accent" }) : null]
					}, item.id);
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: [!needle && !archiveOpen && archivedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setArchiveOpen(true),
					className: "flex w-full items-center gap-3 px-4 py-3 text-left text-accent hover:bg-hover",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 font-medium",
							children: "Archived Chats"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm text-muted",
							children: archivedCount
						})
					]
				}) : null, rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-6 py-10 text-center text-sm text-muted",
					children: "No chats here yet."
				}) : rows.map((chat) => {
					const selected = chat.id === activeId;
					const preview = previewOf(chat, messages[chat.id], contacts, typingChatId === chat.id);
					const ts = lastTimestamp(messages[chat.id]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"data-active": selected ? "true" : "false",
						onClick: () => onOpen(chat.id),
						onContextMenu: (event) => {
							event.preventDefault();
							onContext(chat.id, event.clientX, event.clientY);
						},
						className: cn("flex w-full items-center gap-3 px-3 py-2 text-left", selected ? "bg-selected text-selected-fg" : "hover:bg-hover"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							avatarKey: chat.avatarKey,
							letter: chat.letter,
							saved: chat.kind === "saved",
							online: chat.online,
							className: "size-12 text-base",
							iconClassName: "size-5"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("truncate text-base", chat.unread > 0 && !selected ? "font-semibold" : "font-medium"),
									children: chat.title
								}), ts > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("shrink-0 text-xs", selected ? "text-selected-fg/80" : chat.unread > 0 && !chat.muted ? "text-accent" : "text-muted"),
									children: listTime(ts)
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-0.5 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: cn("truncate text-sm", selected ? "text-selected-fg/80" : preview.kind === "typing" ? "text-accent" : preview.kind === "draft" ? "text-danger" : "text-muted"),
									children: [
										preview.kind === "draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn(!selected && "text-danger"),
											children: preview.prefix
										}) : null,
										preview.kind === "text" ? preview.prefix : null,
										preview.text
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex shrink-0 items-center gap-1",
									children: [
										chat.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BellOff, { className: "size-3.5 opacity-70" }) : null,
										chat.pinned && chat.unread === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pin, { className: "size-3.5 opacity-70" }) : null,
										chat.unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-xs font-medium", selected ? "bg-selected-fg text-selected" : chat.muted ? "bg-badge-muted text-selected-fg" : "bg-badge text-selected-fg"),
											children: chat.unread
										}) : null
									]
								})]
							})]
						})]
					}, chat.id);
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": "New message",
				onClick: onNew,
				className: "absolute bottom-4 right-4 z-10 grid size-14 place-items-center rounded-full bg-accent text-selected-fg elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "size-6" })
			})
		]
	});
}
function place(x, y) {
	return {
		x: Math.max(8, Math.min(x, window.innerWidth - 230)),
		y: Math.max(8, Math.min(y, window.innerHeight - 280))
	};
}
function Splash() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid h-dvh place-items-center bg-sidebar text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WireMark, { className: "size-16" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-semibold tracking-wide",
					children: "WIRE"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm text-muted",
					children: "Opening your desk"
				})
			]
		})
	});
}
function WireRoot() {
	const hydrated = useWire((s) => s.hydrated);
	const theme = useWire((s) => s.theme);
	const chats = useWire((s) => s.chats);
	const toast = useWire((s) => s.toast);
	const setForeground = useWire((s) => s.setForeground);
	const markRead = useWire((s) => s.markRead);
	const notify = useWire((s) => s.notify);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const [folder, setFolder] = (0, import_react.useState)("all");
	const [query, setQuery] = (0, import_react.useState)("");
	const [archiveOpen, setArchiveOpen] = (0, import_react.useState)(false);
	const [panel, setPanel] = (0, import_react.useState)(null);
	const [info, setInfo] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(null);
	const [command, setCommand] = (0, import_react.useState)(null);
	const [forward, setForward] = (0, import_react.useState)(null);
	const [call, setCall] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let live = true;
		(async () => {
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
	(0, import_react.useEffect)(() => {
		setForeground(activeId);
		if (activeId) markRead(activeId);
	}, [
		activeId,
		markRead,
		setForeground
	]);
	(0, import_react.useEffect)(() => {
		const open = (event) => {
			const id = event.detail;
			if (!id) return;
			setActiveId(id);
			setPanel(null);
			setInfo(false);
			setArchiveOpen(false);
		};
		window.addEventListener("wire-open", open);
		return () => window.removeEventListener("wire-open", open);
	}, []);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key !== "Escape") return;
			if (menu) return setMenu(null);
			if (forward) return setForward(null);
			if (call) return setCall(null);
			if (info) return setInfo(false);
			if (panel === "settings" || panel === "contacts" || panel === "newchat" || panel === "newgroup" || panel === "newchannel") return setPanel("menu");
			if (panel) return setPanel(null);
			if (activeId && window.innerWidth < 768) setActiveId(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		activeId,
		call,
		forward,
		info,
		menu,
		panel
	]);
	const active = chats.find((chat) => chat.id === activeId) ?? null;
	function openChat(id) {
		setActiveId(id);
		setPanel(null);
		setInfo(false);
		setCommand(null);
	}
	function chatMenu(chatId, x, y) {
		const chat = useWire.getState().chats.find((item) => item.id === chatId);
		if (!chat) return;
		const pos = place(x, y);
		setMenu({
			x: pos.x,
			y: pos.y,
			items: [
				{
					label: chat.pinned ? "Unpin" : "Pin",
					onClick: () => useWire.getState().togglePinChat(chatId)
				},
				{
					label: chat.muted ? "Unmute" : "Mute",
					onClick: () => useWire.getState().toggleMute(chatId)
				},
				{
					label: chat.archived ? "Unarchive" : "Archive",
					onClick: () => useWire.getState().toggleArchive(chatId)
				},
				{
					label: "Mark as unread",
					onClick: () => useWire.getState().markUnread(chatId)
				},
				...chat.kind === "saved" ? [] : [{
					label: "Delete chat",
					danger: true,
					onClick: () => {
						useWire.getState().deleteChat(chatId);
						if (activeId === chatId) setActiveId(null);
					}
				}]
			]
		});
	}
	function messageMenu(message, x, y) {
		if (!activeId) return;
		const pos = place(x, y);
		const chatId = activeId;
		setMenu({
			x: pos.x,
			y: pos.y,
			items: [
				{
					label: "Reply",
					onClick: () => setCommand({
						mode: "reply",
						id: message.id,
						n: Date.now(),
						chatId
					})
				},
				{
					label: "Copy",
					onClick: () => {
						const text = message.text || message.attachment?.name || "";
						navigator.clipboard?.writeText(text).then(() => notify("Copied"), () => notify("Couldn't copy"));
					}
				},
				{
					label: "Forward",
					onClick: () => setForward({
						chatId,
						messageId: message.id
					})
				},
				{
					label: message.pinned ? "Unpin" : "Pin",
					onClick: () => useWire.getState().pinMessage(chatId, message.id)
				},
				...message.senderId === "me" && message.text ? [{
					label: "Edit",
					onClick: () => setCommand({
						mode: "edit",
						id: message.id,
						n: Date.now(),
						chatId
					})
				}] : [],
				{
					label: "Delete",
					danger: true,
					onClick: () => useWire.getState().deleteMessage(chatId, message.id)
				}
			]
		});
	}
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Splash, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-theme": theme,
		className: "flex h-dvh overflow-hidden bg-sidebar text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: active ? "relative hidden h-full w-full min-w-0 shrink-0 flex-col md:flex md:w-sidebar md:border-r md:border-line" : "relative flex h-full w-full min-w-0 shrink-0 flex-col md:w-sidebar md:border-r md:border-line",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {
						folder,
						setFolder,
						query,
						setQuery,
						archiveOpen,
						setArchiveOpen,
						activeId,
						onOpen: openChat,
						onMenu: () => setPanel("menu"),
						onNew: () => setPanel("newchat"),
						onContext: chatMenu
					}),
					panel === "menu" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MenuPanel, {
						onClose: () => setPanel(null),
						onSettings: () => setPanel("settings"),
						onContacts: () => setPanel("contacts"),
						onGroup: () => setPanel("newgroup"),
						onChannel: () => setPanel("newchannel"),
						onSaved: () => openChat("saved")
					}) : null,
					panel === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsPanel, { onBack: () => setPanel("menu") }) : null,
					panel === "contacts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContactsPanel, {
						onBack: () => setPanel("menu"),
						onOpen: (contactId) => {
							const id = useWire.getState().openDirect(contactId);
							if (id) openChat(id);
						}
					}) : null,
					panel === "newchat" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewChatPanel, {
						onBack: () => setPanel(null),
						onOpen: openChat
					}) : null,
					panel === "newgroup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewGroupPanel, {
						onBack: () => setPanel("menu"),
						onOpen: openChat
					}) : null,
					panel === "newchannel" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewChannelPanel, {
						onBack: () => setPanel("menu"),
						onOpen: openChat
					}) : null
				]
			}),
			active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Conversation, {
					chatId: active.id,
					onBack: () => setActiveId(null),
					onInfo: () => setInfo(true),
					onCall: (kind) => setCall(kind),
					onMessageMenu: messageMenu,
					command
				}), info ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoPanel, {
					chat: active,
					onClose: () => setInfo(false)
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyPane, {}),
			call && active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CallOverlay, {
				chat: active,
				kind: call,
				onHang: () => setCall(null)
			}) : null,
			forward ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ForwardDialog, {
				onClose: () => setForward(null),
				onPick: (to) => {
					useWire.getState().forwardMessage(forward.chatId, forward.messageId, to);
					setForward(null);
					openChat(to);
				}
			}) : null,
			menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContextMenu, {
				x: menu.x,
				y: menu.y,
				items: menu.items,
				onClose: () => setMenu(null)
			}) : null,
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, { text: toast }) : null
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WireRoot, {});
}
//#endregion
export { Home as component };
