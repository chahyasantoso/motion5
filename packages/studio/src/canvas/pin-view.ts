import { unreachable } from "@gerak/core";
import type { Card } from "../graph";
import type { Pin } from "../pins";
import type { FocusTarget, Rect } from "../protocol";

/** What a click in pin mode asks to drop: a card, a stage point or a ruler moment. */
export type PinRequest =
  | { readonly kind: "card"; readonly card: Card }
  | { readonly kind: "stage"; readonly x: number; readonly y: number }
  | { readonly kind: "moment"; readonly atMs: number };

/** How close the playhead must be to a pin's moment for its stage marker to show. */
export const STAGE_WINDOW_MS = 100;

const CAST_KINDS: readonly Card["kind"][] = ["box", "text", "shape", "object", "list"];

/** A point on the scaled preview frame as a point in the page's own px. */
export function unscalePoint(
  client: { readonly x: number; readonly y: number },
  frame: { readonly left: number; readonly top: number },
  scale: number,
): { readonly x: number; readonly y: number } {
  const by = scale > 0 ? scale : 1;
  return { x: (client.x - frame.left) / by, y: (client.y - frame.top) / by };
}

/** Whether a pin's stage marker shows: same size preset and the playhead within the window. */
export function showsOnStage(pin: Pin, atMs: number, preset: string): boolean {
  return pin.viewport.preset === preset && Math.abs(pin.atMs - atMs) <= STAGE_WINDOW_MS;
}

/** The ms under `clientX` on a ruler spanning `box`, optionally snapped to `snap` ms, kept inside the scene. */
export function rulerMs(
  clientX: number,
  box: { readonly left: number; readonly width: number },
  length: number,
  snap: number | undefined,
): number {
  if (box.width === 0) return 0;
  const raw = ((clientX - box.left) / box.width) * length;
  const at = snap === undefined ? Math.round(raw) : Math.round(raw / snap) * snap;
  return Math.min(length, Math.max(0, at));
}

/** A ruler position in percent for `ms` of a scene `length` ms long. */
export function rulerPercent(ms: number, length: number): number {
  return length > 0 ? (ms / length) * 100 : 0;
}

/** The centre of a rest box. */
export function centreOf(box: Rect): { readonly x: number; readonly y: number } {
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

/** The scene and shot names a pin records for the canvas focus. */
export function focusNames(
  focus: FocusTarget,
  cards: readonly Card[],
): { readonly scene: string | undefined; readonly shot: string | undefined } {
  switch (focus.kind) {
    case "all":
      return { scene: undefined, shot: undefined };
    case "scene":
      return { scene: focus.name, shot: undefined };
    case "shot":
      return { scene: undefined, shot: focus.name };
    case "shot-index":
      return {
        scene: undefined,
        shot: cards.filter((card) => card.kind === "shot")[focus.index]?.name,
      };
    default:
      return unreachable(focus);
  }
}

/** The cast card that stands for the page's `data-cast` element named `name`. */
export function castCardNamed(cards: readonly Card[], name: string): Card | undefined {
  return cards.find((card) => CAST_KINDS.includes(card.kind) && card.name === name);
}

/** Whether a card is a cast card, whose rest box can stand on the stage. */
export function isCast(card: Card): boolean {
  return CAST_KINDS.includes(card.kind);
}
