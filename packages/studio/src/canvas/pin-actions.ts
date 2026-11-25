import { unreachable } from "@gerak/core";
import type { Card } from "../graph";
import type { NewPin, Pin } from "../pins";
import type { FocusTarget } from "../protocol";
import type { CanvasControl } from "./commands";
import { pinOf } from "../agent-port-pin";
import { castCardNamed, type PinRequest } from "./pin-view";
import { contextOf, type ContextView } from "./prompt-context";

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

/** The pin a click asks for: the context of the place it lands on, saved. */
export function buildPin(request: PinRequest, view: ContextView): NewPin {
  const win = view.playhead.window();
  switch (request.kind) {
    case "card":
      return pinOf(contextOf(view, { card: request.card }), { kind: "card" });
    case "stage": {
      const card = castCardAt(win, request.x, request.y, view.graph.cards);
      return pinOf(contextOf(view, { card }), { kind: "stage", x: request.x, y: request.y });
    }
    case "moment":
      return pinOf(contextOf(view, { card: undefined, atMs: request.atMs }), { kind: "moment" });
    default:
      return unreachable(request);
  }
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
