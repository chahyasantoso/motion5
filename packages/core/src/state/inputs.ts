import { clamp } from "../utility/clamp";
import { state, type State } from "./state";

/** Sample event names folded by `scroll` and `pointer`: `"scroll"`, `"pointer-x"` and `"pointer-y"`. */
export const INPUT_EVENTS = Object.freeze({
  scroll: "scroll",
  pointerX: "pointer-x",
  pointerY: "pointer-y",
} as const);

/** Vertical scroll position in px, folded from `"scroll"` sample events. */
export interface ScrollState {
  /** Scroll offset in px from the top of the page; 0 before any `"scroll"` sample. */
  readonly y: State<number>;
}

/** Viewport pointer position from 0 to 1, folded from `"pointer-x"` and `"pointer-y"` sample events. */
export interface PointerState {
  /** Horizontal pointer position across the viewport, 0 left to 1 right; 0.5 before any `"pointer-x"` sample. */
  readonly x: State<number>;
  /** Vertical pointer position across the viewport, 0 top to 1 bottom; 0.5 before any `"pointer-y"` sample. */
  readonly y: State<number>;
}

function sampleState(
  start: number,
  eventName: string,
  bounds?: readonly [min: number, max: number],
): State<number> {
  return state(start, (current, event) => {
    if (
      event.name !== eventName ||
      typeof event.value !== "number" ||
      !Number.isFinite(event.value)
    )
      return current;
    const next = bounds === undefined ? event.value : clamp(event.value, bounds[0], bounds[1]);
    return next === 0 ? 0 : next;
  });
}

/** Page scroll state, built on `state`; `scroll.y` reads `"scroll"` sample events in px. */
export const scroll: ScrollState = Object.freeze({
  y: sampleState(0, INPUT_EVENTS.scroll),
});

/** Viewport pointer state, built on `state`; `pointer.x` and `pointer.y` run 0 to 1, starting at 0.5. */
export const pointer: PointerState = Object.freeze({
  x: sampleState(0.5, INPUT_EVENTS.pointerX, [0, 1]),
  y: sampleState(0.5, INPUT_EVENTS.pointerY, [0, 1]),
});
