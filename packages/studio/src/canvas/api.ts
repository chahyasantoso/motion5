import type { StudioGraph } from "../graph";
import type { CanvasLayout } from "../layout";
import type { NewPin, Pin, PinPlace } from "../pins";
import type { Rect } from "../protocol";

/** A platform's reserved margins, as `GET /__gerak/safe-zones` answers them. */
export interface ZoneMargins {
  readonly name: string;
  readonly width: number;
  readonly height: number;
  readonly top: number;
  readonly right: number;
  readonly bottom: number;
  readonly left: number;
}

/** Where a failure came from, when the server or the page could tell. */
export interface Problem {
  readonly message: string;
  readonly file?: string | undefined;
  readonly line?: number | undefined;
}

/** What the graph route answered: the graph and its page, or why there is none. */
export type GraphAnswer =
  | { readonly kind: "graph"; readonly graph: StudioGraph; readonly page: string | null }
  | { readonly kind: "failed"; readonly problem: Problem };

function record(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

function isGraph(value: unknown): value is StudioGraph {
  const given = record(value);
  return (
    typeof given?.["piece"] === "string" &&
    Array.isArray(given["cards"]) &&
    Array.isArray(given["wires"])
  );
}

function problemOf(body: unknown, status: number): Problem {
  const given = record(body);
  const message = given?.["error"];
  const file = given?.["file"];
  const line = given?.["line"];
  return {
    message: typeof message === "string" ? message : `The server answered ${status}.`,
    ...(typeof file === "string" ? { file } : {}),
    ...(typeof line === "number" ? { line } : {}),
  };
}

async function jsonOf(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

const query = (piece: string): string => `?piece=${encodeURIComponent(piece)}`;

/** The piece's graph and page, or the problem that stopped it. */
export async function fetchGraph(piece: string): Promise<GraphAnswer> {
  try {
    const response = await fetch(`/__gerak/graph${query(piece)}`);
    const body = await jsonOf(response);
    const given = record(body);
    if (response.ok && isGraph(given?.["graph"])) {
      const page = given["page"];
      return {
        kind: "graph",
        graph: given["graph"],
        page: typeof page === "string" ? page : null,
      };
    }
    return { kind: "failed", problem: problemOf(body, response.status) };
  } catch (error) {
    return {
      kind: "failed",
      problem: { message: error instanceof Error ? error.message : String(error) },
    };
  }
}

function layoutOf(body: unknown): CanvasLayout {
  const given = record(body);
  const cards: Record<string, { x: number; y: number }> = {};
  for (const [id, raw] of Object.entries(record(given?.["cards"]) ?? {})) {
    const place = record(raw);
    const x = place?.["x"];
    const y = place?.["y"];
    if (typeof x === "number" && typeof y === "number") cards[id] = { x, y };
  }
  const view = record(given?.["viewport"]);
  const vx = view?.["x"];
  const vy = view?.["y"];
  const zoom = view?.["zoom"];
  const shown = record(given?.["preview"]);
  const preset = shown?.["preset"];
  const safeZone = shown?.["safeZone"];
  return {
    cards,
    ...(typeof vx === "number" && typeof vy === "number" && typeof zoom === "number"
      ? { viewport: { x: vx, y: vy, zoom } }
      : {}),
    ...(typeof preset === "string"
      ? { preview: { preset, ...(typeof safeZone === "string" ? { safeZone } : {}) } }
      : {}),
  };
}

/** The saved layout of `piece`; an empty one when the server cannot answer. */
export async function fetchLayout(piece: string): Promise<CanvasLayout> {
  try {
    const response = await fetch(`/__gerak/layout${query(piece)}`);
    return layoutOf(await jsonOf(response));
  } catch {
    return { cards: {} };
  }
}

/** Saves `layout`; the server keeps only the places of cards the graph lists. */
export async function saveLayout(piece: string, layout: CanvasLayout): Promise<void> {
  try {
    await fetch(`/__gerak/layout${query(piece)}`, {
      method: "PUT",
      body: JSON.stringify(layout),
    });
  } catch {
    return;
  }
}

const text = (value: unknown): string | undefined =>
  typeof value === "string" ? value : undefined;
const count = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

function placeOf(value: unknown): PinPlace | undefined {
  const given = record(value);
  const x = count(given?.["x"]);
  const y = count(given?.["y"]);
  switch (given?.["kind"]) {
    case "card":
      return { kind: "card" };
    case "moment":
      return { kind: "moment" };
    case "stage":
      return x === undefined || y === undefined ? undefined : { kind: "stage", x, y };
    default:
      return undefined;
  }
}

function boxOf(value: unknown): Rect | undefined {
  const given = record(value);
  const x = count(given?.["x"]);
  const y = count(given?.["y"]);
  const width = count(given?.["width"]);
  const height = count(given?.["height"]);
  return x === undefined || y === undefined || width === undefined || height === undefined
    ? undefined
    : { x, y, width, height };
}

/** One pin as the server's own store wrote it, or undefined when a field the canvas reads is off. */
function pinOf(value: unknown): Pin | undefined {
  const given = record(value);
  const place = placeOf(given?.["place"]);
  const view = record(given?.["viewport"]);
  const id = count(given?.["id"]);
  const atMs = count(given?.["atMs"]);
  const scrollY = count(given?.["scrollY"]);
  const piece = text(given?.["piece"]);
  const preset = text(view?.["preset"]);
  const note = text(given?.["note"]);
  const createdAt = text(given?.["createdAt"]);
  const status = given?.["status"];
  if (
    given === undefined ||
    place === undefined ||
    id === undefined ||
    atMs === undefined ||
    scrollY === undefined ||
    piece === undefined ||
    preset === undefined ||
    note === undefined ||
    createdAt === undefined ||
    (status !== "open" && status !== "resolved")
  )
    return undefined;
  return {
    id,
    piece,
    place,
    card: text(given["card"]),
    scene: text(given["scene"]),
    shot: text(given["shot"]),
    file: text(given["file"]),
    part: count(given["part"]),
    viewport: { preset, safeZone: text(view?.["safeZone"]) },
    atMs,
    scrollY,
    preset: text(given["preset"]),
    pose: record(given["pose"]),
    restBox: boxOf(given["restBox"]),
    note,
    status,
    createdAt,
  };
}

/** The pins of `piece` the file lists; empty when the server cannot answer. */
export async function fetchPins(piece: string): Promise<readonly Pin[]> {
  try {
    const response = await fetch(`/__gerak/pins${query(piece)}`);
    const list = record(await jsonOf(response))?.["pins"];
    return Array.isArray(list) ? list.flatMap((raw) => pinOf(raw) ?? []) : [];
  } catch {
    return [];
  }
}

/** Stores a new pin through the server; `false` when it did not. */
export async function postPin(piece: string, pin: NewPin): Promise<boolean> {
  try {
    const response = await fetch(`/__gerak/pins${query(piece)}`, {
      method: "POST",
      body: JSON.stringify(pin),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/** Every safe-zone profile, from the one table the tools own. */
export async function fetchSafeZones(piece: string): Promise<readonly ZoneMargins[]> {
  try {
    const body = record(await jsonOf(await fetch(`/__gerak/safe-zones${query(piece)}`)));
    const zones = body?.["zones"];
    if (!Array.isArray(zones)) return [];
    const found: ZoneMargins[] = [];
    for (const raw of zones) {
      const zone = record(raw);
      const { name, width, height, top, right, bottom, left } = zone ?? {};
      if (
        typeof name === "string" &&
        typeof width === "number" &&
        typeof height === "number" &&
        typeof top === "number" &&
        typeof right === "number" &&
        typeof bottom === "number" &&
        typeof left === "number"
      )
        found.push({ name, width, height, top, right, bottom, left });
    }
    return found;
  } catch {
    return [];
  }
}
