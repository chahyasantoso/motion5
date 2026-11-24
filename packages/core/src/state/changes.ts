import type { Time } from "../time/time";
import type { Events } from "../events/event-list";
import type { State } from "./state";

/** A moment a picked value changed, and the value it changed to. */
export interface Change<V = number> {
  readonly at: number;
  readonly to: V;
}

/** The picked value before any event, and each moment it changed after, oldest first. */
export interface Changes<V = number> {
  readonly start: V;
  readonly list: readonly Change<V>[];
}

/** The changes of what `pick` reads from `source`; a step that leaves it `Object.is` the same is none.
 * The list is one array while the source goes on, and a new one when it starts again. */
export function changesOf<S, V = number>(
  source: State<S>,
  pick: (state: S) => V,
): (time: Time, events: Events) => Changes<V> {
  let steps: readonly unknown[] | undefined;
  let held: { start: V; list: Change<V>[] } = { start: pick(source.start), list: [] };
  let counted = 0;
  let last = held.start;
  return (time, events) => {
    const now = source.steps(time, events);
    if (now !== steps || now.length < counted) {
      steps = now;
      held = { start: pick(source.start), list: [] };
      counted = 0;
      last = held.start;
    }
    for (; counted < now.length; counted += 1) {
      const step = now[counted];
      if (step === undefined) break;
      const to = pick(step.value);
      if (Object.is(to, last)) continue;
      held.list.push({ at: step.at, to });
      last = to;
    }
    return held;
  };
}
