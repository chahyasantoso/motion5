import { useRef, type KeyboardEvent, type PointerEvent } from "react";

/** The pointer handlers a goal handle spreads onto its hit target. */
export interface GoalDragHandlers {
  readonly onPointerDown: (event: PointerEvent<Element>) => void;
  readonly onPointerMove: (event: PointerEvent<Element>) => void;
  readonly onPointerUp: (event: PointerEvent<Element>) => void;
  readonly onPointerCancel: (event: PointerEvent<Element>) => void;
  readonly onLostPointerCapture: (event: PointerEvent<Element>) => void;
}

export interface GoalDrag<S> {
  /**
   * Starts a drag from this press, or answers `undefined` to let the press through (a WebGL canvas
   * answers from a hit test; a dedicated handle always starts). The session is whatever the stage
   * needs to keep for the rest of the gesture, such as the depth the goal was grabbed at.
   */
  readonly begin: (event: PointerEvent<Element>) => S | undefined;
  /** One pointer move of an active drag. The stage converts it and writes through `GoalControl`. */
  readonly move: (session: S, event: PointerEvent<Element>) => void;
}

/**
 * The one pointer-capture drag every goal handle on the page shares: SVG, CSS 3D and WebGL.
 *
 * Capture keeps the gesture alive when the pointer outruns the handle; every way a gesture can end
 * (up, cancel, lost capture) ends it. The session lives in a ref, so a drag re-renders nothing: the
 * goal marker moves because the runtime publishes the written goal, not because React state did.
 */
export function useGoalDrag<S>(drag: GoalDrag<S>): GoalDragHandlers {
  const session = useRef<{ readonly value: S } | undefined>(undefined);
  const end = (event: PointerEvent<Element>) => {
    session.current = undefined;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  };
  return {
    onPointerDown(event) {
      const value = drag.begin(event);
      if (value === undefined) return;
      event.stopPropagation();
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      session.current = { value };
    },
    onPointerMove(event) {
      if (session.current !== undefined) drag.move(session.current.value, event);
    },
    onPointerUp: end,
    onPointerCancel: end,
    onLostPointerCapture() {
      session.current = undefined;
    },
  };
}

/** One keyboard nudge of a goal, in stage units. Shift is the coarse step. */
export interface GoalNudge {
  readonly dx: number;
  readonly dy: number;
  /** Depth, from PageUp (toward the viewer) and PageDown; a planar stage ignores it. */
  readonly dz: number;
}

const NUDGE: Readonly<Record<string, GoalNudge>> = {
  ArrowLeft: { dx: -1, dy: 0, dz: 0 },
  ArrowRight: { dx: 1, dy: 0, dz: 0 },
  ArrowUp: { dx: 0, dy: -1, dz: 0 },
  ArrowDown: { dx: 0, dy: 1, dz: 0 },
  PageUp: { dx: 0, dy: 0, dz: 1 },
  PageDown: { dx: 0, dy: 0, dz: -1 },
};

/** The nudge a key asks for, or `undefined` for a key that is not a goal key. */
export function goalNudge(event: KeyboardEvent<Element>): GoalNudge | undefined {
  const unit = Object.hasOwn(NUDGE, event.key) ? NUDGE[event.key] : undefined;
  if (unit === undefined) return undefined;
  const step = event.shiftKey ? 20 : 5;
  return { dx: unit.dx * step, dy: unit.dy * step, dz: unit.dz * step };
}
