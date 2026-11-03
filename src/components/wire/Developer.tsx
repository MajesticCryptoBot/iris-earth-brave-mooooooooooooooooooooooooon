import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Avatar } from "@/components/wire/ui";
import { OWNER_CHAT_ID, SCRIPT_BASE, syncBots } from "@/lib/wire/link";
import { useWire } from "@/lib/wire/store";
import type { ApiPlatform, Bot, BotCommand } from "@/lib/wire/types";
import { cn } from "@/lib/utils";

const PLATFORMS: { id: ApiPlatform; label: string }[] = [
  { id: "desktop", label: "Desktop" },
  { id: "web", label: "Web" },
  { id: "android", label: "Android" },
  { id: "ios", label: "iOS" },
  { id: "other", label: "Other" },
];

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

function copy(value: string) {
  void navigator.clipboard.writeText(value);
  useWire.getState().notify("Copied");
}

function Secret({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2">
      <div className="mb-1 text-xs text-accent">{label}</div>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-xl bg-hover px-3 py-2 text-xs">{value}</code>
        <button
          type="button"
          onClick={() => copy(value)}
          className="h-9 shrink-0 rounded-full bg-hover px-3 text-xs font-medium text-accent"
        >
          Copy
        </button>
      </div>
    </div>
  );
}

export function ApiPanel({ onBack }: { onBack: () => void }) {
  const apps = useWire((s) => s.apps);
  const sessions = useWire((s) => s.sessions);
  const createApp = useWire((s) => s.createApp);
  const regenerateHash = useWire((s) => s.regenerateHash);
  const deleteApp = useWire((s) => s.deleteApp);
  const createSession = useWire((s) => s.createSession);
  const revokeSession = useWire((s) => s.revokeSession);
  const [title, setTitle] = useState("");
  const [shortName, setShortName] = useState("");
  const [platform, setPlatform] = useState<ApiPlatform>("desktop");
  const [device, setDevice] = useState("WIRE Desktop");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="API development" onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-4 text-sm leading-5 text-muted">
          Create an application to get an api_id and an api_hash. Then create a session for this account. These credentials belong to WIRE on this computer.
        </p>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">App title</span>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="WIRE Desktop"
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">Short name</span>
          <input
            value={shortName}
            onChange={(event) => setShortName(event.target.value)}
            placeholder="wiredesk"
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">Platform</span>
          <select
            value={platform}
            onChange={(event) => setPlatform(event.target.value as ApiPlatform)}
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          >
            {PLATFORMS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        {error ? <p className="mb-3 text-xs text-danger">{error}</p> : null}
        <button
          type="button"
          onClick={() => {
            const problem = createApp(title, shortName, platform);
            setError(problem);
            if (!problem) {
              setTitle("");
              setShortName("");
            }
          }}
          className="mb-6 h-11 w-full rounded-xl bg-accent text-sm font-medium text-selected-fg"
        >
          Create application
        </button>

        {apps.length === 0 ? (
          <p className="text-sm text-muted">No applications yet.</p>
        ) : (
          apps.map((app) => {
            const mine = sessions.filter((session) => session.appId === app.id);
            return (
              <section key={app.id} className="mb-4 rounded-xl bg-input px-3 py-3">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold">{app.title}</h3>
                  <span className="text-xs text-muted">{app.platform}</span>
                </div>
                <p className="text-xs text-muted">{app.shortName}</p>
                <Secret label="api_id" value={String(app.apiId)} />
                <Secret label="api_hash" value={app.apiHash} />
                <label className="mt-3 block text-sm">
                  <span className="mb-1 block text-xs text-accent">Device for the new session</span>
                  <input
                    value={device}
                    onChange={(event) => setDevice(event.target.value)}
                    className="h-11 w-full rounded-xl bg-hover px-3 outline-none"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const problem = createSession(app.id, device);
                    if (problem) setError(problem);
                  }}
                  className="mt-2 h-10 w-full rounded-xl bg-accent text-sm font-medium text-selected-fg"
                >
                  Create session
                </button>
                {mine.map((session) => (
                  <div key={session.id} className="mt-3 border-t border-line pt-3">
                    <p className="text-sm font-medium">{session.device}</p>
                    <Secret label="session" value={session.session} />
                    <button
                      type="button"
                      onClick={() => revokeSession(session.id)}
                      className="mt-2 text-xs font-medium text-danger"
                    >
                      Revoke session
                    </button>
                  </div>
                ))}
                <div className="mt-3 flex gap-3">
                  <button type="button" onClick={() => regenerateHash(app.id)} className="text-xs font-medium text-accent">
                    Regenerate hash
                  </button>
                  <button type="button" onClick={() => deleteApp(app.id)} className="text-xs font-medium text-danger">
                    Delete app
                  </button>
                </div>
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function CommandEditor({
  commands,
  onChange,
}: {
  commands: BotCommand[];
  onChange: (commands: BotCommand[]) => void;
}) {
  return (
    <div className="mb-3">
      <span className="mb-1 block text-xs text-accent">Commands</span>
      {commands.map((command, index) => (
        <div key={`${command.command}-${index}`} className="mb-2 flex gap-2">
          <input
            value={command.command}
            onChange={(event) => {
              const next = commands.slice();
              next[index] = {
                ...command,
                command: event.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 32),
              };
              onChange(next);
            }}
            placeholder="start"
            className="h-10 w-28 rounded-xl bg-hover px-2 text-sm outline-none"
          />
          <input
            value={command.description}
            onChange={(event) => {
              const next = commands.slice();
              next[index] = { ...command, description: event.target.value.slice(0, 80) };
              onChange(next);
            }}
            placeholder="What it does"
            className="h-10 min-w-0 flex-1 rounded-xl bg-hover px-2 text-sm outline-none"
          />
          <button
            type="button"
            aria-label="Remove command"
            onClick={() => onChange(commands.filter((_, item) => item !== index))}
            className="grid size-10 place-items-center text-muted"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...commands, { command: "", description: "" }])}
        className="text-xs font-medium text-accent"
      >
        Add command
      </button>
    </div>
  );
}

function BotEditor({ bot, onOpen }: { bot: Bot; onOpen: (chatId: string) => void }) {
  const updateBot = useWire((s) => s.updateBot);
  const revokeBotToken = useWire((s) => s.revokeBotToken);
  const deleteBot = useWire((s) => s.deleteBot);
  const notify = useWire((s) => s.notify);
  const [description, setDescription] = useState(bot.description);
  const [about, setAbout] = useState(bot.about);
  const [commands, setCommands] = useState(bot.commands);

  return (
    <div className="mb-4 rounded-xl bg-input px-3 py-3">
      <button type="button" onClick={() => onOpen(bot.chatId)} className="flex w-full items-center gap-3 text-left">
        <Avatar avatarKey="teal" letter={bot.name.slice(0, 1).toUpperCase()} className="size-10 text-sm" />
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">{bot.name}</span>
          <span className="block truncate text-xs text-muted">@{bot.username}</span>
        </span>
      </button>
      <Secret label="token" value={bot.token} />
      <label className="mt-3 block text-sm">
        <span className="mb-1 block text-xs text-accent">Description</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value.slice(0, 280))}
          rows={3}
          placeholder="What /start replies with"
          className="w-full resize-none rounded-xl bg-hover px-3 py-2 text-sm outline-none"
        />
      </label>
      <label className="mb-3 block text-sm">
        <span className="mb-1 block text-xs text-accent">About</span>
        <input
          value={about}
          onChange={(event) => setAbout(event.target.value.slice(0, 120))}
          placeholder="Short line under the name"
          className="h-11 w-full rounded-xl bg-hover px-3 outline-none"
        />
      </label>
      <CommandEditor commands={commands} onChange={setCommands} />
      <button
        type="button"
        onClick={() => {
          updateBot(bot.id, {
            description: description.trim(),
            about: about.trim(),
            commands: commands.filter((command) => command.command && command.description),
          });
          notify("Bot settings saved");
          void syncBots({ commands: true });
        }}
        className="h-10 w-full rounded-xl bg-accent text-sm font-medium text-selected-fg"
      >
        Save settings
      </button>
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={() => {
            const token = revokeBotToken(bot.id);
            if (token) notify("Token revoked. The new one is shown.");
          }}
          className="text-xs font-medium text-accent"
        >
          Revoke token
        </button>
        <button type="button" onClick={() => deleteBot(bot.id)} className="text-xs font-medium text-danger">
          Delete bot
        </button>
      </div>
    </div>
  );
}

export function BotsPanel({ onBack, onOpen }: { onBack: () => void; onOpen: (chatId: string) => void }) {
  const bots = useWire((s) => s.bots);
  const createBot = useWire((s) => s.createBot);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-sidebar">
      <PanelHead title="Bots" onBack={onBack} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <p className="mb-4 text-sm leading-5 text-muted">
          Create a bot, copy the token into your script, and point the script at {SCRIPT_BASE} instead of api.telegram.org. Commands you send here reach the script. What the script sends back shows in that bot's chat.
        </p>
        <div className="mb-4 rounded-xl bg-input px-3 py-3 text-xs leading-5">
          <p className="text-sm font-medium">Script connection</p>
          <p className="mt-1 text-muted">Chat id for this account</p>
          <p className="text-sm">{OWNER_CHAT_ID}</p>
          <p className="mt-2 text-muted">Replace the host only. Keep /bot and the token.</p>
          <p className="break-all text-sm">{`${SCRIPT_BASE}/bot<token>/`}</p>
        </div>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">Name</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Desk Bot"
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          />
        </label>
        <label className="mb-3 block text-sm">
          <span className="mb-1 block text-xs text-accent">Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="desk_bot"
            className="h-11 w-full rounded-xl bg-input px-3 outline-none"
          />
        </label>
        {error ? <p className="mb-3 text-xs text-danger">{error}</p> : null}
        <button
          type="button"
          onClick={() => {
            const made = createBot(name, username);
            if ("error" in made) {
              setError(made.error);
              return;
            }
            setError(null);
            setName("");
            setUsername("");
          }}
          className={cn("mb-6 h-11 w-full rounded-xl bg-accent text-sm font-medium text-selected-fg")}
        >
          Create bot
        </button>
        {bots.length === 0 ? <p className="text-sm text-muted">No bots yet.</p> : null}
        {bots.map((bot) => (
          <BotEditor key={`${bot.id}-${bot.token}`} bot={bot} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}
