import { nowOf, type Span } from "./span";
import { type Time } from "./time";

/** One phase of a sequence: the span it runs in, and what it answers given its own time there. */
export type Phase<R> = readonly [Span, (time: Time) => R];

/** Answers the last phase that started, given its own time: an ended phase holds its end, before the
 * first the first holds its start. An empty list throws. */
export function sequence<R>(time: Time, phases: readonly Phase<R>[]): R {
  const first = phases[0];
  if (first === undefined) throw new RangeError("sequence: give it at least one phase.");
  const now = nowOf(time, "sequence");
  let chosen = first;
  let started = false;
  for (const phase of phases)
    if (now >= phase[0].from && (!started || phase[0].from >= chosen[0].from)) {
      chosen = phase;
      started = true;
    }
  const [part, answer] = chosen;
  return answer(part.of(time));
}
