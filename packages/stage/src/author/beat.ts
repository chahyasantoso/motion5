import { span, type Span } from "@gerak/core";

/** A named stretch of the piece: a core `Span` that also says what it is called. */
export interface Beat extends Span {
  readonly name: string;
}

/** Where a beat starts: at a ms (default 0), or after another beat with an optional gap. */
export type BeatPlace = { readonly at?: number } | { readonly after: Beat; readonly gap?: number };

/** A beat `ms` long; `{ at }` starts it at a ms, `{ after, gap }` starts it `gap` ms after another ends. */
export function beat(name: string, ms: number, place: BeatPlace = {}): Beat {
  if (typeof name !== "string" || name === "") throw new TypeError("beat: a beat needs a name.");
  if (!Number.isFinite(ms) || ms <= 0)
    throw new RangeError(`beat "${name}": a length of ${ms} ms is not above 0.`);
  const from = "after" in place ? place.after.to + (place.gap ?? 0) : (place.at ?? 0);
  if (!Number.isFinite(from) || from < 0)
    throw new RangeError(`beat "${name}": it cannot start at ${from} ms.`);
  return Object.freeze({ ...span(from, from + ms), name });
}
