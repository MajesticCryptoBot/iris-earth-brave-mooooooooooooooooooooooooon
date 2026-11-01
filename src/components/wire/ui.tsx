import { Bookmark } from "lucide-react";
import { AVATAR_CLASS, type AvatarKey } from "@/lib/wire/types";
import { cn } from "@/lib/utils";

export function WireMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" className="fill-accent" />
      <path
        d="M14 46 L26 16 L32 34 L38 16 L50 46"
        fill="none"
        stroke="var(--color-selected-fg)"
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Avatar({
  avatarKey,
  letter,
  saved,
  online,
  className,
  iconClassName,
  dotClassName,
}: {
  avatarKey: AvatarKey;
  letter: string;
  saved?: boolean;
  online?: boolean;
  className?: string;
  iconClassName?: string;
  dotClassName?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center rounded-full font-medium text-selected-fg",
        AVATAR_CLASS[avatarKey],
        className,
      )}
    >
      {saved ? <Bookmark className={iconClassName ?? "size-5"} /> : letter}
      {online ? (
        <span
          className={cn(
            "presence absolute bottom-0 right-0 size-3 rounded-full bg-online",
            dotClassName,
          )}
        />
      ) : null}
    </span>
  );
}

export function Switch({
  on,
  label,
  onToggle,
}: {
  on: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors",
        on ? "bg-accent" : "bg-badge-muted",
      )}
    >
      <span
        className={cn(
          "block size-6 rounded-full bg-selected-fg transition-transform",
          on && "translate-x-5",
        )}
      />
    </button>
  );
}

const URL_RE = /(https?:\/\/[^\s]+)/g;

export function RichText({ text }: { text: string }) {
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, index) =>
        part.startsWith("http://") || part.startsWith("https://") ? (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            className="break-all text-accent underline"
          >
            {part}
          </a>
        ) : (
          <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>
        ),
      )}
    </>
  );
}
