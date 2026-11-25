import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { StudioGraph } from "./graph";

/** Where a card sits on the canvas, and whether it is folded. */
export interface CardPlace {
  readonly x: number;
  readonly y: number;
  readonly collapsed?: true | undefined;
}

/** The canvas sidecar: card places, the viewport and the preview's size; never motion. */
export interface CanvasLayout {
  readonly cards: Readonly<Record<string, CardPlace>>;
  readonly viewport?: { readonly x: number; readonly y: number; readonly zoom: number } | undefined;
  readonly preview?:
    | { readonly preset: string; readonly safeZone?: string | undefined }
    | undefined;
}

/** The layout of a canvas that has none yet. */
export const EMPTY_LAYOUT: CanvasLayout = Object.freeze({ cards: Object.freeze({}) });

/** The sidecar file of `piece` under the pieces folder `root`. */
export function layoutPath(root: string, piece: string): string {
  return join(root, ".gerak", "canvas", `${piece}.json`);
}

function isCoordinate(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function record(value: unknown): Readonly<Record<string, unknown>> | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? Object.fromEntries(Object.entries(value))
    : undefined;
}

/** A layout read from untrusted JSON: what is well formed is kept, the rest dropped. */
export function parseLayout(value: unknown): CanvasLayout {
  const given = record(value);
  if (given === undefined) return EMPTY_LAYOUT;
  const cards: Record<string, CardPlace> = {};
  for (const [id, raw] of Object.entries(record(given["cards"]) ?? {})) {
    const place = record(raw);
    const x = place?.["x"];
    const y = place?.["y"];
    if (!isCoordinate(x) || !isCoordinate(y)) continue;
    cards[id] = { x, y, ...(place?.["collapsed"] === true ? { collapsed: true } : {}) };
  }
  const view = record(given["viewport"]);
  const vx = view?.["x"];
  const vy = view?.["y"];
  const zoom = view?.["zoom"];
  const viewport =
    isCoordinate(vx) && isCoordinate(vy) && isCoordinate(zoom) && zoom > 0
      ? { x: vx, y: vy, zoom }
      : undefined;
  const shown = record(given["preview"]);
  const preset = shown?.["preset"];
  const safeZone = shown?.["safeZone"];
  const preview =
    typeof preset === "string"
      ? { preset, ...(typeof safeZone === "string" ? { safeZone } : {}) }
      : undefined;
  return {
    cards,
    ...(viewport === undefined ? {} : { viewport }),
    ...(preview === undefined ? {} : { preview }),
  };
}

/** `layout` without the places of cards that `graph` does not list. */
export function prunedLayout(layout: CanvasLayout, graph: StudioGraph): CanvasLayout {
  const ids = new Set(graph.cards.map((card) => card.id));
  return {
    ...layout,
    cards: Object.fromEntries(Object.entries(layout.cards).filter(([id]) => ids.has(id))),
  };
}

/** The sidecar at `path`, or the empty layout when it is missing or unreadable. */
export function readLayout(path: string): CanvasLayout {
  if (!existsSync(path)) return EMPTY_LAYOUT;
  try {
    return parseLayout(JSON.parse(readFileSync(path, "utf8")));
  } catch {
    return EMPTY_LAYOUT;
  }
}

/** Writes `layout` to `path`, pruned against `graph`, and returns what it wrote. */
export function writeLayout(path: string, layout: CanvasLayout, graph: StudioGraph): CanvasLayout {
  const kept = prunedLayout(layout, graph);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(kept, null, 2)}\n`);
  return kept;
}
