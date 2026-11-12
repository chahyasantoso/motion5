import type { Ease } from "./ease";
import { span, type Span, type Time } from "./time";

/** One keyframe: the value reached at `at` ms, eased from the key before; with no `ease` it is linear. */
export interface Key<T> {
  readonly at: number;
  readonly to: T;
  readonly ease?: Ease;
}

/** A value moving from `start` at 0 ms to each key in turn, then holding; `blend` is `mix`, `mixPoint`, `mixPose` or alike. */
export function keyframes<T>(
  durationMs: number,
  start: T,
  keys: readonly Key<T>[],
  blend: (from: T, to: T, share: number) => T,
): (time: Time) => T {
  const segments: { readonly span: Span; readonly key: Key<T> }[] = [];
  let from = 0;
  for (const key of keys) {
    if (key.at < from)
      throw new RangeError(`keyframes: key at ${key.at} ms comes before ${from} ms.`);
    segments.push({ span: span(from, key.at), key });
    from = key.at;
  }
  return (time) => {
    let value = start;
    for (const { span: part, key } of segments)
      value = blend(value, key.to, part.of(time, key.ease).progress);
    return value;
  };
}
