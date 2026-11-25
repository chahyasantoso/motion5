import { unreachable } from "@gerak/core";
import type { Card, StudioGraph } from "../graph";
import type { NewPin, Pin } from "../pins";
import type { FocusTarget } from "../protocol";
import type { CanvasControl } from "./commands";
import { inspectCard } from "./inspect";
import { castCardNamed, focusNames, type PinRequest } from "./pin-view";
import type { Playhead } from "./playhead";

/** What a new pin records of the canvas besides where it was dropped. */
export interface PinContext {
  readonly piece: string;
  readonly graph: StudioGraph;
  readonly focus: FocusTarget;
  readonly preview: { readonly preset: string; readonly safeZone?: string | undefined };
  readonly playhead: Playhead;
}

function castCardAt(
  win: Window | undefined,
  x: number,
  y: number,
  cards: readonly Card[],
): Card | undefined {
  const element = win?.document.elementFromPoint(x, y)?.closest("[data-cast]");
  const name = element?.getAttribute("data-cast");
  return name === null || name === undefined ? undefined : castCardNamed(cards, name);
}

/** The pin a click asks for, with the moment, view and card values the canvas holds now. */
export function buildPin(request: PinRequest, now: PinContext): NewPin {
  const { graph, playhead } = now;
  const win = playhead.window();
  const state = playhead.snapshot();
  let card: Card | undefined;
  let atMs = state.ms;
  let place: NewPin["place"];
  switch (request.kind) {
    case "card":
      card = request.card;
      place = { kind: "card" };
      break;
    case "stage":
      card = castCardAt(win, request.x, request.y, graph.cards);
      place = { kind: "stage", x: request.x, y: request.y };
      break;
    case "moment":
      atMs = request.atMs;
      place = { kind: "moment" };
      break;
    default:
      return unreachable(request);
  }
  const seen = card === undefined ? undefined : inspectCard(card, graph, win, atMs);
  const names = focusNames(now.focus, graph.cards);
  return {
    piece: now.piece,
    place,
    card: card?.id,
    scene: names.scene,
    shot: names.shot,
    file: card?.site?.file,
    part: undefined,
    viewport: { preset: now.preview.preset, safeZone: now.preview.safeZone },
    atMs,
    scrollY: win?.scrollY ?? 0,
    preset: undefined,
    pose: seen?.pose,
    restBox: seen?.rest,
    note: "",
  };
}

function focusOf(pin: Pin, cards: readonly Card[]): [FocusTarget, Card | undefined] {
  const shot = pin.shot === undefined ? undefined : cards.find((c) => c.id === `shot:${pin.shot}`);
  if (pin.shot !== undefined && shot !== undefined) return [{ kind: "shot", name: pin.shot }, shot];
  const scene =
    pin.scene === undefined ? undefined : cards.find((c) => c.id === `scene:${pin.scene}`);
  if (pin.scene !== undefined && scene !== undefined)
    return [{ kind: "scene", name: pin.scene }, scene];
  return [{ kind: "all" }, undefined];
}

/** Puts the canvas back where `pin` was left: view, focus, time, scroll and the card it is on. */
export async function restorePin(pin: Pin, control: CanvasControl): Promise<void> {
  control.viewport(pin.viewport.preset, pin.viewport.safeZone);
  await control.settled();
  const cards = control.cards();
  const [target, card] = focusOf(pin, cards);
  control.focus(target, card);
  control.seek({ kind: "ms", ms: pin.atMs });
  if (pin.scrollY > 0) control.seek({ kind: "scroll", px: pin.scrollY });
  if (pin.card !== undefined && cards.some((each) => each.id === pin.card))
    control.select(pin.card);
}
