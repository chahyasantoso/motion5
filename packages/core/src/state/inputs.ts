import { clamp } from "../utility/clamp";
import { unreachable } from "../utility/unreachable";
import type { InputChannel } from "./clock-watch";
import { buildState, type State } from "./state";

/** Value input names folded by `scroll` and `pointer`: `"scroll"`, `"pointer-x"` and `"pointer-y"`. */
export const INPUT_EVENTS = Object.freeze({
  scroll: "scroll",
  pointerX: "pointer-x",
  pointerY: "pointer-y",
} as const);

/** Vertical scroll position in px, folded from `"scroll"` value entries. */
export interface ScrollState {
  /** Scroll offset in px from the top of the page; 0 before any `"scroll"` value. */
  readonly y: State<number>;
}

/** Viewport pointer position from 0 to 1, folded from `"pointer-x"` and `"pointer-y"` value entries. */
export interface PointerState {
  /** Horizontal pointer position across the viewport, 0 left to 1 right; 0.5 before any `"pointer-x"` value. */
  readonly x: State<number>;
  /** Vertical pointer position across the viewport, 0 top to 1 bottom; 0.5 before any `"pointer-y"` value. */
  readonly y: State<number>;
}

function sampleState(
  start: number,
  eventName: string,
  channel: InputChannel,
  bounds?: readonly [min: number, max: number],
): State<number> {
  const normalize = (value: number): number => {
    const bounded = bounds === undefined ? value : clamp(value, bounds[0], bounds[1]);
    return bounded === 0 ? 0 : bounded;
  };
  return buildState(
    start,
    (current, entry) => {
      switch (entry.kind) {
        case "trigger":
          return current;
        case "value":
          if (entry.name !== eventName || !Number.isFinite(entry.value)) return current;
          return normalize(entry.value);
        default:
          return unreachable(entry.kind);
      }
    },
    {},
    channel,
  );
}

/** Page scroll state, built on `state`; `scroll.y` reads `"scroll"` sample events in px. */
export const scroll: ScrollState = Object.freeze({
  y: sampleState(0, INPUT_EVENTS.scroll, "scroll"),
});

/** Viewport pointer state, built on `state`; `pointer.x` and `pointer.y` run 0 to 1, starting at 0.5. */
export const pointer: PointerState = Object.freeze({
  x: sampleState(0.5, INPUT_EVENTS.pointerX, "pointer", [0, 1]),
  y: sampleState(0.5, INPUT_EVENTS.pointerY, "pointer", [0, 1]),
});
