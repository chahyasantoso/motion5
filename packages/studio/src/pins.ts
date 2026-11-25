import type { Rect } from "./protocol";

/** Whether a pin still asks for something. */
export type PinStatus = "open" | "resolved";

/** Where on the canvas a pin was dropped: on a card, on the stage at a page point, or on the timeline at a moment. */
export type PinPlace =
  | { readonly kind: "card" }
  | { readonly kind: "stage"; readonly x: number; readonly y: number }
  | { readonly kind: "moment" };

/** One numbered note a person or an agent leaves on a piece, with the moment and view it was left in. */
export interface Pin {
  /** Its number, unique in the file, never reused. */
  readonly id: number;
  readonly piece: string;
  readonly place: PinPlace;
  /** The card id the pin is on, or the card under a stage point; absent for a bare moment or empty stage. */
  readonly card: string | undefined;
  /** The scene and shot names in focus or holding the card. */
  readonly scene: string | undefined;
  readonly shot: string | undefined;
  /** Where the card opens in code, relative to the pieces folder. */
  readonly file: string | undefined;
  /** The part index of a list or split-text member. */
  readonly part: number | undefined;
  /** The preview size preset and safe-zone profile it was left in. */
  readonly viewport: { readonly preset: string; readonly safeZone: string | undefined };
  readonly atMs: number;
  readonly scrollY: number;
  /** The recorded interaction preset playing when it was left. */
  readonly preset: string | undefined;
  readonly pose: Readonly<Record<string, unknown>> | undefined;
  readonly restBox: Rect | undefined;
  readonly note: string;
  readonly status: PinStatus;
  /** ISO time. */
  readonly createdAt: string;
}

/** A pin before the store numbers and dates it. */
export type NewPin = Omit<Pin, "id" | "status" | "createdAt">;

/** The socket event the server sends when the pins file changes. */
export const PINS_EVENT = "gerak:pins";

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

/** The file's value read into its next id and its pins; the next id is never below the largest id plus one. */
export function parsePinFile(value: unknown): {
  readonly next: number;
  readonly pins: readonly Pin[];
} {
  const pins = parsePins(value);
  const stored = num(record(value)?.["next"]) ?? 1;
  const largest = pins.reduce((most, pin) => Math.max(most, pin.id), 0);
  return { next: Math.max(stored, largest + 1), pins };
}
