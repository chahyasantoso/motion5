import {
  callerDir,
  parseActions,
  parseSizes,
  piecesRoot,
  PRESET_NAME,
  SAFE_ZONE_NAMES,
  safeZone,
} from "@gerak/tools/page";
import { PRESETS } from "./canvas/presets";
import type { FocusTarget, SeekTarget, StudioCommand } from "./protocol";
import { BUS_PATH } from "./protocol";
import { readDiscovery } from "./server/discovery";

type Parsed =
  | {
      readonly kind: "command";
      readonly command: StudioCommand;
      readonly rootFlag: string | undefined;
      readonly piece: string | undefined;
    }
  | { readonly kind: "usage"; readonly message: string };

type Flags =
  | {
      readonly kind: "flags";
      readonly values: ReadonlyMap<string, string>;
      readonly positional: readonly string[];
    }
  | { readonly kind: "usage"; readonly message: string };

const SHARED = ["--root", "--piece"];

const USAGES: Readonly<Record<string, string>> = {
  status: "usage: gerak studio status [--root dir] [--piece name]",
  focus:
    "usage: gerak studio focus --scene <name|all> | --shot <name|index|all> [--root dir] [--piece name]",
  viewport:
    "usage: gerak studio viewport <preset|WxH|platform> [--safe-zone platform] [--root dir] [--piece name]",
  seek: "usage: gerak studio seek --ms <n> | --scroll <px|selector> [--root dir] [--piece name]",
  play: "usage: gerak studio play [--from ms] [--to ms] [--speed n] [--root dir] [--piece name]",
  select: "usage: gerak studio select <card-id> [--root dir] [--piece name]",
  inspect: "usage: gerak studio inspect [<card-id>] [--root dir] [--piece name]",
  check:
    "usage: gerak studio check [--sizes WxH,...] [--safe-zone platform] [--to ms] [--root dir] [--piece name]",
  graph: "usage: gerak studio graph [--root dir] [--piece name]",
  act: "usage: gerak studio act '<action-list>' [--save-preset name] [--root dir] [--piece name]",
};

function usage(subcommand: string, message: string): { kind: "usage"; message: string } {
  const line = USAGES[subcommand];
  return { kind: "usage", message: line === undefined ? message : `${message}\n${line}` };
}

function splitFlags(argv: readonly string[], valueFlags: readonly string[]): Flags {
  const values = new Map<string, string>();
  const positional: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined) continue;
    if (arg.startsWith("--")) {
      if (![...SHARED, ...valueFlags].includes(arg))
        return { kind: "usage", message: `Unknown flag ${arg}.` };
      const value = argv[index + 1];
      if (value === undefined) return { kind: "usage", message: `${arg} needs a value.` };
      if (values.has(arg)) return { kind: "usage", message: `${arg} is given twice.` };
      values.set(arg, value);
      index += 1;
    } else positional.push(arg);
  }
  return { kind: "flags", values, positional };
}

function count(flag: string, text: string): number | string {
  const value = text.trim() === "" ? Number.NaN : Number(text);
  if (!Number.isFinite(value)) return `${flag} must be a number, got "${text}".`;
  if (value < 0) return `${flag} must not be negative, got "${text}".`;
  return value;
}

function platformOf(text: string): (typeof SAFE_ZONE_NAMES)[number] | undefined {
  return SAFE_ZONE_NAMES.find((name) => name === text);
}

function viewportCommand(arg: string, zone: string | undefined): StudioCommand | string {
  const ids = PRESETS.map((each) => each.id).join(", ");
  const names = SAFE_ZONE_NAMES.join(", ");
  const accepted = `Accepted: a preset (${ids}), a size equal to a preset's, or a platform (${names}).`;
  let safe = platformOf(arg);
  let preset = PRESETS.find((each) => each.id === arg);
  if (preset === undefined && safe === undefined) {
    const match = /^(\d+)x(\d+)$/.exec(arg);
    preset = PRESETS.find(
      (each) =>
        match !== null &&
        each.size?.width === Number(match[1]) &&
        each.size.height === Number(match[2]),
    );
  }
  if (safe !== undefined) {
    const frame = safeZone(safe);
    preset = PRESETS.find(
      (each) => each.size?.width === frame.width && each.size.height === frame.height,
    );
  }
  if (zone !== undefined) {
    safe = platformOf(zone);
    if (safe === undefined) return `--safe-zone must be a platform (${names}), got "${zone}".`;
  }
  if (preset === undefined) return `"${arg}" is not a viewport.\n${accepted}`;
  return { kind: "viewport", preset: preset.id, safeZone: safe };
}

function focusTarget(scene: string | undefined, shot: string | undefined): FocusTarget | string {
  if ((scene === undefined) === (shot === undefined))
    return "Give exactly one of --scene and --shot.";
  if (scene !== undefined)
    return scene === "all" ? { kind: "all" } : { kind: "scene", name: scene };
  if (shot === undefined || shot === "all") return { kind: "all" };
  if (/^\d+$/.test(shot)) return { kind: "shot-index", index: Number(shot) };
  return { kind: "shot", name: shot };
}

function seekTarget(ms: string | undefined, scroll: string | undefined): SeekTarget | string {
  if ((ms === undefined) === (scroll === undefined))
    return "Give exactly one of --ms and --scroll.";
  if (ms !== undefined) {
    const value = count("--ms", ms);
    return typeof value === "string" ? value : { kind: "ms", ms: value };
  }
  if (scroll === undefined) return "Give exactly one of --ms and --scroll.";
  if (scroll.trim() !== "" && !Number.isNaN(Number(scroll))) {
    const value = count("--scroll", scroll);
    return typeof value === "string" ? value : { kind: "scroll", px: value };
  }
  return scroll.trim() === ""
    ? "--scroll needs px or a selector."
    : { kind: "selector", selector: scroll };
}

/** Parses `gerak studio <subcommand>` of the command bus into a command and where to send it. */
export function parseBusArgs(subcommand: string, argv: readonly string[]): Parsed {
  const fail = (message: string): Parsed => usage(subcommand, message);
  const valueFlags: Readonly<Record<string, readonly string[]>> = {
    focus: ["--scene", "--shot"],
    viewport: ["--safe-zone"],
    seek: ["--ms", "--scroll"],
    play: ["--from", "--to", "--speed"],
    check: ["--sizes", "--safe-zone", "--to"],
    act: ["--save-preset"],
  };
  if (!(subcommand in USAGES)) return fail(`Unknown studio subcommand ${subcommand}.`);
  const split = splitFlags(argv, valueFlags[subcommand] ?? []);
  if (split.kind === "usage") return fail(split.message);
  const { values, positional } = split;
  const done = (command: StudioCommand): Parsed => ({
    kind: "command",
    command,
    rootFlag: values.get("--root"),
    piece: values.get("--piece"),
  });
  const wantPositional = (min: number, max: number): string | undefined =>
    positional.length < min || positional.length > max
      ? `Expected ${min === max ? String(min) : `${min} to ${max}`} argument(s), got ${positional.length}.`
      : undefined;
  switch (subcommand) {
    case "status":
    case "graph": {
      const wrong = wantPositional(0, 0);
      if (wrong !== undefined) return fail(wrong);
      return done({ kind: subcommand });
    }
    case "focus": {
      const wrong = wantPositional(0, 0);
      if (wrong !== undefined) return fail(wrong);
      const target = focusTarget(values.get("--scene"), values.get("--shot"));
      return typeof target === "string" ? fail(target) : done({ kind: "focus", target });
    }
    case "viewport": {
      const wrong = wantPositional(1, 1);
      if (wrong !== undefined) return fail(wrong);
      const command = viewportCommand(positional[0] ?? "", values.get("--safe-zone"));
      return typeof command === "string" ? fail(command) : done(command);
    }
    case "seek": {
      const wrong = wantPositional(0, 0);
      if (wrong !== undefined) return fail(wrong);
      const target = seekTarget(values.get("--ms"), values.get("--scroll"));
      return typeof target === "string" ? fail(target) : done({ kind: "seek", target });
    }
    case "play": {
      const wrong = wantPositional(0, 0);
      if (wrong !== undefined) return fail(wrong);
      const numbers: Record<string, number | undefined> = {};
      for (const flag of ["--from", "--to", "--speed"]) {
        const text = values.get(flag);
        if (text === undefined) continue;
        const value = count(flag, text);
        if (typeof value === "string") return fail(value);
        numbers[flag] = value;
      }
      if (numbers["--speed"] === 0) return fail("--speed must be above 0.");
      return done({
        kind: "play",
        from: numbers["--from"],
        to: numbers["--to"],
        speed: numbers["--speed"],
      });
    }
    case "select": {
      const wrong = wantPositional(1, 1);
      if (wrong !== undefined) return fail(wrong);
      return done({ kind: "select", card: positional[0] ?? "" });
    }
    case "inspect": {
      const wrong = wantPositional(0, 1);
      if (wrong !== undefined) return fail(wrong);
      return done({ kind: "inspect", card: positional[0] });
    }
    case "act": {
      const wrong = wantPositional(1, 1);
      if (wrong !== undefined) return fail(wrong);
      const actions = positional[0] ?? "";
      const parsedActions = parseActions(actions);
      if ("reason" in parsedActions) return fail(parsedActions.reason);
      const name = values.get("--save-preset");
      if (name !== undefined && !PRESET_NAME.test(name))
        return fail(`--save-preset must be lowercase letters, digits and dashes, got "${name}".`);
      return done({ kind: "act", actions, savePreset: name });
    }
    case "check": {
      const wrong = wantPositional(0, 0);
      if (wrong !== undefined) return fail(wrong);
      const sizesText = values.get("--sizes");
      const sizes = sizesText === undefined ? undefined : parseSizes(sizesText);
      if (typeof sizes === "string") return fail(sizes);
      const zone = values.get("--safe-zone");
      if (zone !== undefined && platformOf(zone) === undefined)
        return fail(
          `--safe-zone must be a platform (${SAFE_ZONE_NAMES.join(", ")}), got "${zone}".`,
        );
      const toText = values.get("--to");
      const to = toText === undefined ? undefined : count("--to", toText);
      if (typeof to === "string") return fail(to);
      if (to === 0) return fail("--to must be above 0.");
      return done({
        kind: "check",
        sizes: sizes?.map((each) => ({ width: each.width, height: each.height })),
        safeZone: zone,
        to,
      });
    }
    default:
      return fail(`Unknown studio subcommand ${subcommand}.`);
  }
}

/** Runs a bus subcommand against the studio the discovery file names and prints its reply. */
export async function runBus(
  subcommand: string,
  argv: readonly string[],
): Promise<{ readonly text: string; readonly ok: boolean }> {
  const parsed = parseBusArgs(subcommand, argv);
  if (parsed.kind === "usage") return { text: parsed.message, ok: false };
  const found = piecesRoot(callerDir(), parsed.rootFlag);
  if (found.kind === "missing") return { text: found.message, ok: false };
  const studio = readDiscovery(found.root);
  if (studio === undefined)
    return {
      text: `No studio is open in ${found.root}. Run npx gerak studio open <piece>.`,
      ok: false,
    };
  const piece = parsed.piece ?? studio.piece;
  const address = `${studio.url.replace(/\/$/, "")}${BUS_PATH}?piece=${encodeURIComponent(piece)}`;
  let response: Response;
  try {
    response = await fetch(address, { method: "POST", body: JSON.stringify(parsed.command) });
  } catch {
    return {
      text: `The studio at ${studio.url} is not answering; the discovery file may be stale. Run npx gerak studio open ${piece}.`,
      ok: false,
    };
  }
  const body = await response.text();
  let reply: unknown;
  try {
    reply = JSON.parse(body);
  } catch {
    return { text: body, ok: false };
  }
  const failed =
    Reflect.get(Object(reply), "kind") === "failed" || Reflect.has(Object(reply), "error");
  return { text: JSON.stringify(reply, null, 2), ok: response.status === 200 && !failed };
}
