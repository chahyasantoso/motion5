import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { NewPin, Pin, PinPlace, PinStatus } from "./pins";
import type { Rect } from "./protocol";

interface PinFile {
  readonly next: number;
  readonly pins: readonly Pin[];
}

/** The one file under the pieces folder that holds every piece's pins. */
export function pinsPath(root: string): string {
  return join(root, ".gerak", "pins.json");
}

function record(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function num(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** A string, absent, or `null` read as absent; `false` for any other type. */
function optionalText(value: unknown): string | undefined | false {
  if (value === undefined || value === null) return undefined;
  return typeof value === "string" ? value : false;
}

function optionalNumber(value: unknown): number | undefined | false {
  if (value === undefined || value === null) return undefined;
  return num(value) ?? false;
}

function placeOf(value: unknown): PinPlace | undefined {
  const given = record(value);
  switch (given?.["kind"]) {
    case "card":
      return { kind: "card" };
    case "moment":
      return { kind: "moment" };
    case "stage": {
      const x = num(given["x"]);
      const y = num(given["y"]);
      return x === undefined || y === undefined ? undefined : { kind: "stage", x, y };
    }
    default:
      return undefined;
  }
}

function rectOf(value: unknown): Rect | undefined | false {
  if (value === undefined || value === null) return undefined;
  const given = record(value);
  const x = num(given?.["x"]);
  const y = num(given?.["y"]);
  const width = num(given?.["width"]);
  const height = num(given?.["height"]);
  if (x === undefined || y === undefined || width === undefined || height === undefined)
    return false;
  return { x, y, width, height };
}

/** A pin's fields without id, status and date, or undefined when any is malformed. */
export function parseNewPin(value: unknown): NewPin | undefined {
  const given = record(value);
  if (given === undefined) return undefined;
  const place = placeOf(given["place"]);
  const view = record(given["viewport"]);
  const atMs = num(given["atMs"]);
  const scrollY = num(given["scrollY"]);
  const piece = given["piece"];
  const note = given["note"];
  const preset = view?.["preset"];
  const safeZone = optionalText(view?.["safeZone"]);
  const card = optionalText(given["card"]);
  const scene = optionalText(given["scene"]);
  const shot = optionalText(given["shot"]);
  const file = optionalText(given["file"]);
  const part = optionalNumber(given["part"]);
  const recorded = optionalText(given["preset"]);
  const restBox = rectOf(given["restBox"]);
  const poseGiven = given["pose"];
  const pose = poseGiven === undefined || poseGiven === null ? undefined : record(poseGiven);
  const poseBad = poseGiven !== undefined && poseGiven !== null && pose === undefined;
  if (
    place === undefined ||
    atMs === undefined ||
    scrollY === undefined ||
    typeof piece !== "string" ||
    typeof note !== "string" ||
    typeof preset !== "string" ||
    safeZone === false ||
    card === false ||
    scene === false ||
    shot === false ||
    file === false ||
    part === false ||
    recorded === false ||
    restBox === false ||
    poseBad
  )
    return undefined;
  return {
    piece,
    place,
    card,
    scene,
    shot,
    file,
    part,
    viewport: { preset, safeZone },
    atMs,
    scrollY,
    preset: recorded,
    pose,
    restBox,
    note,
  };
}

function statusOf(value: unknown): PinStatus | undefined {
  return value === "open" || value === "resolved" ? value : undefined;
}

function pinOf(value: unknown): Pin | undefined {
  const fields = parseNewPin(value);
  const given = record(value);
  const id = num(given?.["id"]);
  const status = statusOf(given?.["status"]);
  const createdAt = given?.["createdAt"];
  if (
    fields === undefined ||
    id === undefined ||
    !Number.isInteger(id) ||
    id < 1 ||
    status === undefined ||
    typeof createdAt !== "string"
  )
    return undefined;
  return { ...fields, id, status, createdAt };
}

/** The pins in a file's value, or a bare list; malformed entries and repeated ids are dropped. */
export function parsePins(value: unknown): readonly Pin[] {
  const list = Array.isArray(value) ? value : record(value)?.["pins"];
  if (!Array.isArray(list)) return [];
  const seen = new Set<number>();
  const pins: Pin[] = [];
  for (const raw of list) {
    const pin = pinOf(raw);
    if (pin === undefined || seen.has(pin.id)) continue;
    seen.add(pin.id);
    pins.push(pin);
  }
  return pins;
}

function readFile(root: string): PinFile {
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(pinsPath(root), "utf8"));
  } catch {
    return { next: 1, pins: [] };
  }
  const pins = parsePins(parsed);
  const stored = num(record(parsed)?.["next"]) ?? 1;
  const largest = pins.reduce((most, pin) => Math.max(most, pin.id), 0);
  return { next: Math.max(stored, largest + 1), pins };
}

function writeFile(root: string, file: PinFile): void {
  const path = pinsPath(root);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(file, null, 2)}\n`);
}

/** Every pin in the file, of every piece; empty when the file is missing or unreadable. */
export function readPins(root: string): readonly Pin[] {
  return readFile(root).pins;
}

/** Numbers, dates and stores a new open pin; its id is above every id ever written. */
export function addPin(root: string, pin: NewPin, now: Date = new Date()): Pin {
  const file = readFile(root);
  const made: Pin = { ...pin, id: file.next, status: "open", createdAt: now.toISOString() };
  writeFile(root, { next: file.next + 1, pins: [...file.pins, made] });
  return made;
}

/** Marks a pin resolved and returns it, or undefined when no pin has that id. */
export function resolvePin(root: string, id: number): Pin | undefined {
  const file = readFile(root);
  const found = file.pins.find((pin) => pin.id === id);
  if (found === undefined) return undefined;
  const resolved: Pin = { ...found, status: "resolved" };
  writeFile(root, {
    next: file.next,
    pins: file.pins.map((pin) => (pin.id === id ? resolved : pin)),
  });
  return resolved;
}

/** Removes the pins matching every given field and returns how many went. */
export function clearPins(
  root: string,
  options: { readonly piece?: string | undefined; readonly status?: PinStatus | undefined },
): number {
  const file = readFile(root);
  const matches = (pin: Pin): boolean =>
    (options.piece === undefined || pin.piece === options.piece) &&
    (options.status === undefined || pin.status === options.status);
  const kept = file.pins.filter((pin) => !matches(pin));
  const removed = file.pins.length - kept.length;
  if (removed > 0) writeFile(root, { next: file.next, pins: kept });
  return removed;
}
