const BY_CONTACT: Record<string, string[]> = {
  lena: [
    "On it. I'll read it as soon as it lands.",
    "Keep the lede to one sentence.",
    "That works. Send the cut when it's clean.",
    "I'll hold the slot for you.",
    "Good. Don't bury the number.",
  ],
  marc: [
    "Noted. I'll update the chart.",
    "That's the right weight for it.",
    "I can pull a cleaner figure.",
    "Agreed. Leave the color out of the lede.",
    "I'll check the source and ping you.",
  ],
  priya: [
    "Got it. I'll take the quote.",
    "Running, but I saw this.",
    "Yes — I'll confirm the name spelling.",
    "Send it. I'll trim on my side.",
    "Perfect timing.",
  ],
};

const GENERIC = [
  "Got it.",
  "Okay.",
  "I'll look now.",
  "Thanks — noted.",
  "Say more when you can.",
  "Understood.",
];

const QUESTIONS = [
  "I'll check and come back.",
  "Not from here — give me a minute.",
  "Yes. Go ahead.",
  "No, hold that.",
  "I think so. I'll confirm.",
];

function pick(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)] ?? "Got it.";
}

export function craftReply(senderId: string, incoming: string, attachment?: string): string {
  if (attachment === "voice") return pick(["Heard it.", "Got the voice message.", "Listening now."]);
  if (attachment === "photo") return pick(["Got the photo.", "I can see it.", "Photo's in."]);
  if (attachment === "file") return pick(["File received.", "Opening it now.", "Got the file."]);
  const t = incoming.trim().toLowerCase();
  if (!t) return pick(GENERIC);
  if (/^(hi|hey|hello|yo|morning|evening)\b/.test(t)) return pick(["Hey.", "Here.", "Morning.", "With you."]);
  if (t.includes("thank")) return pick(["Anytime.", "Of course.", "You bet."]);
  if (t.includes("?")) return pick(QUESTIONS);
  return pick(BY_CONTACT[senderId] ?? GENERIC);
}
