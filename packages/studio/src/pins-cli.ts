import { callerDir, piecesRoot, SAFE_ZONE_NAMES } from "@gerak/tools/page";
import { unreachable } from "@gerak/core";
import { addPin, clearPins, parseNewPin, readPins, resolvePin } from "./pin-store";
import type { Pin, PinPlace } from "./pins";
import { BUS_PATH, type StudioCommand } from "./protocol";
import { readDiscovery, type Discovery } from "./server/discovery";

type Result = { readonly text: string; readonly ok: boolean };

const USAGE = [
  "usage: gerak studio pins <subcommand> [--root dir]",
  "  list [--piece name] [--all] [--json]  open pins, or every pin with --all",
  "  show <id>  one pin as JSON",
  "  add --card <id> --note <text> [--piece name] [--ms n] [--scroll px] [--viewport preset] [--safe-zone name]  leave a pin on a card",
  "  resolve <id>  mark a pin resolved",
  "  clear [--piece name] [--resolved]  delete a piece's pins, or only its resolved ones",
].join("\n");

const VALUE_FLAGS: Readonly<Record<string, readonly string[]>> = {
  list: ["--piece"],
  show: [],
  add: ["--card", "--note", "--piece", "--ms", "--scroll", "--viewport", "--safe-zone"],
  resolve: [],
  clear: ["--piece"],
};

const SWITCHES: Readonly<Record<string, readonly string[]>> = {
  list: ["--all", "--json"],
  show: [],
  add: [],
  resolve: [],
  clear: ["--resolved"],
};

interface Flags {
  readonly kind: "flags";
  readonly values: ReadonlyMap<string, string>;
  readonly switches: ReadonlySet<string>;
  readonly positional: readonly string[];
}

type Parsed = Flags | { readonly kind: "usage"; readonly message: string };

function splitArgs(subcommand: string, argv: readonly string[]): Parsed {
  const valueFlags = ["--root", ...(VALUE_FLAGS[subcommand] ?? [])];
  const switchFlags = SWITCHES[subcommand] ?? [];
  const values = new Map<string, string>();
  const switches = new Set<string>();
  const positional: string[] = [];
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === undefined) continue;
    if (!arg.startsWith("--")) positional.push(arg);
    else if (switchFlags.includes(arg)) switches.add(arg);
    else if (valueFlags.includes(arg)) {
      const value = argv[index + 1];
      if (value === undefined) return { kind: "usage", message: `${arg} needs a value.` };
      if (values.has(arg)) return { kind: "usage", message: `${arg} is given twice.` };
      values.set(arg, value);
      index += 1;
    } else return { kind: "usage", message: `Unknown flag ${arg}.` };
  }
  return { kind: "flags", values, switches, positional };
}

function placeText(pin: Pin): string {
  const place: PinPlace = pin.place;
  switch (place.kind) {
    case "card":
      return pin.card ?? "card";
    case "stage":
      return `stage ${place.x},${place.y}`;
    case "moment":
      return "moment";
    default:
      return unreachable(place);
  }
}

function lineOf(pin: Pin): string {
  const where = placeText(pin);
  return `#${pin.id} [${pin.status}] ${pin.piece} ${where} @${pin.atMs}ms ${pin.viewport.preset} — ${pin.note}`;
}

function idOf(text: string | undefined): number | undefined {
  return text !== undefined && /^\d+$/.test(text) && Number(text) > 0 ? Number(text) : undefined;
}

function numberFlag(flag: string, text: string | undefined, fallback: number): number | string {
  if (text === undefined) return fallback;
  const value = text.trim() === "" ? Number.NaN : Number(text);
  return Number.isFinite(value) && value >= 0
    ? value
    : `${flag} must be a non-negative number, got "${text}".`;
}

async function ask(studio: Discovery, piece: string, command: StudioCommand): Promise<unknown> {
  const address = `${studio.url.replace(/\/$/, "")}${BUS_PATH}?piece=${encodeURIComponent(piece)}`;
  try {
    const response = await fetch(address, { method: "POST", body: JSON.stringify(command) });
    const reply: unknown = await response.json();
    return Reflect.get(Object(reply), "kind") === "failed" ? undefined : reply;
  } catch {
    return undefined;
  }
}

function field(value: unknown, key: string): unknown {
  return Reflect.get(Object(value), key);
}

/** What `status` reported, as the pin fields it fills; empty when the studio did not answer. */
function fromStatus(status: unknown): Readonly<Record<string, unknown>> {
  const focus = field(status, "focus");
  const name = field(focus, "name");
  const kind = field(focus, "kind");
  return {
    piece: field(status, "piece"),
    viewport: { preset: field(status, "preset"), safeZone: field(status, "safeZone") },
    atMs: field(status, "atMs"),
    scrollY: field(status, "scrollY"),
    scene: kind === "scene" ? name : undefined,
    shot: kind === "shot" ? name : undefined,
  };
}

async function fileOf(studio: Discovery, piece: string, card: string): Promise<string | undefined> {
  const reply = await ask(studio, piece, { kind: "graph" });
  const cards: unknown = field(field(reply, "graph"), "cards");
  if (!Array.isArray(cards)) return undefined;
  const list: readonly unknown[] = cards;
  const found = list.find((each) => field(each, "id") === card);
  const file: unknown = field(field(found, "site"), "file");
  return typeof file === "string" ? file : undefined;
}

async function runAdd(root: string, parsed: Flags): Promise<Result> {
  const { values } = parsed;
  const card = values.get("--card");
  const note = values.get("--note");
  if (card === undefined || note === undefined)
    return { text: `add needs --card and --note.\n${USAGE}`, ok: false };
  const ms = numberFlag("--ms", values.get("--ms"), 0);
  const scroll = numberFlag("--scroll", values.get("--scroll"), 0);
  if (typeof ms === "string") return { text: ms, ok: false };
  if (typeof scroll === "string") return { text: scroll, ok: false };
  const zone = values.get("--safe-zone");
  if (zone !== undefined && !SAFE_ZONE_NAMES.some((name) => name === zone))
    return {
      text: `--safe-zone must be a platform (${SAFE_ZONE_NAMES.join(", ")}), got "${zone}".`,
      ok: false,
    };
  const studio = readDiscovery(root);
  let measured: Readonly<Record<string, unknown>> = {};
  let file: string | undefined;
  if (studio !== undefined) {
    const piece = values.get("--piece") ?? studio.piece;
    const status = await ask(studio, piece, { kind: "status" });
    const inspected = await ask(studio, piece, { kind: "inspect", card });
    const inspection = field(inspected, "inspection");
    if (status !== undefined)
      measured = {
        ...fromStatus(field(status, "status")),
        pose: field(inspection, "pose"),
        restBox: field(inspection, "rest"),
      };
    file = await fileOf(studio, piece, card);
  }
  const piece = values.get("--piece") ?? measured["piece"];
  if (typeof piece !== "string")
    return { text: `No studio is answering, so add needs --piece.\n${USAGE}`, ok: false };
  const viewport = field(measured["viewport"], "preset");
  const made = parseNewPin({
    piece,
    place: { kind: "card" },
    card,
    scene: measured["scene"],
    shot: measured["shot"],
    file,
    viewport: {
      preset: values.get("--viewport") ?? (typeof viewport === "string" ? viewport : "desktop"),
      safeZone: zone ?? field(measured["viewport"], "safeZone"),
    },
    atMs: values.has("--ms") ? ms : (measured["atMs"] ?? ms),
    scrollY: values.has("--scroll") ? scroll : (measured["scrollY"] ?? scroll),
    pose: measured["pose"],
    restBox: measured["restBox"],
    note,
  });
  if (made === undefined)
    return { text: "The pin could not be built from the studio's answer.", ok: false };
  return { text: JSON.stringify(addPin(root, made), null, 2), ok: true };
}

/** Runs `gerak studio pins <subcommand>` on the pins file under the pieces folder. */
export async function runPins(argv: readonly string[]): Promise<Result> {
  const [subcommand, ...rest] = argv;
  if (subcommand === undefined || !(subcommand in VALUE_FLAGS))
    return {
      text: subcommand === undefined ? USAGE : `Unknown pins subcommand ${subcommand}.\n${USAGE}`,
      ok: false,
    };
  const parsed = splitArgs(subcommand, rest);
  if (parsed.kind === "usage") return { text: `${parsed.message}\n${USAGE}`, ok: false };
  const found = piecesRoot(callerDir(), parsed.values.get("--root"));
  if (found.kind === "missing") return { text: found.message, ok: false };
  const root = found.root;
  const { values, switches, positional } = parsed;
  const id = idOf(positional[0]);
  switch (subcommand) {
    case "list": {
      const piece = values.get("--piece");
      const shown = readPins(root).filter(
        (pin) =>
          (piece === undefined || pin.piece === piece) &&
          (switches.has("--all") || pin.status === "open"),
      );
      return {
        text: switches.has("--json")
          ? JSON.stringify(shown, null, 2)
          : shown.map(lineOf).join("\n"),
        ok: true,
      };
    }
    case "show": {
      const pin = readPins(root).find((each) => each.id === id);
      return pin === undefined
        ? { text: `No pin ${positional[0] ?? ""}.`, ok: false }
        : { text: JSON.stringify(pin, null, 2), ok: true };
    }
    case "add":
      return runAdd(root, parsed);
    case "resolve": {
      const pin = id === undefined ? undefined : resolvePin(root, id);
      return pin === undefined
        ? { text: `No pin ${positional[0] ?? ""}.`, ok: false }
        : { text: JSON.stringify(pin, null, 2), ok: true };
    }
    case "clear": {
      const removed = clearPins(root, {
        piece: values.get("--piece"),
        status: switches.has("--resolved") ? "resolved" : undefined,
      });
      return { text: `cleared ${removed}`, ok: true };
    }
    default:
      return { text: `Unknown pins subcommand ${subcommand}.\n${USAGE}`, ok: false };
  }
}
