import { elapsedOf, type Span, type Time } from "./time";

/** One phase of a sequence: the span it runs in, and what it answers given its own time there. */
export type Phase<R> = readonly [Span, (time: Time) => R];

/** The phase that started last, given its own time; a tie goes to the later in the list; before any, the first. */
export function sequence<R>(time: Time, phases: readonly Phase<R>[]): R {
  const first = phases[0];
  if (first === undefined) throw new RangeError("sequence: give it at least one phase.");
  const now = elapsedOf(time.clock);
  let chosen = first;
  let started = false;
  if (now !== undefined)
    for (const phase of phases)
      if (now >= phase[0].from && (!started || phase[0].from >= chosen[0].from)) {
        chosen = phase;
        started = true;
      }
  const [part, answer] = chosen;
  return answer(part.of(time));
}
