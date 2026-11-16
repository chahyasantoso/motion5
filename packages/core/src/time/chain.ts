import { span, type Span } from "./span";

/** Settings of `chain`: `gap` ms of rest between spans, or `overlap` ms each starts before the last ends; not both. */
export interface ChainOptions {
  readonly gap?: number;
  readonly overlap?: number;
}

/** Spans of these lengths in ms, the first at 0, each starting where the last ends plus `gap` or minus
 * `overlap`. Throws `RangeError` on a negative length, both options, or too long an overlap. */
export function chain(lengths: readonly number[], options: ChainOptions = {}): readonly Span[] {
  const { gap, overlap } = options;
  if (gap !== undefined && overlap !== undefined)
    throw new RangeError("chain: give a gap or an overlap, not both.");
  const step = gap ?? -(overlap ?? 0);
  if (!Number.isFinite(step) || (gap ?? 0) < 0 || (overlap ?? 0) < 0)
    throw new RangeError("chain: a gap or an overlap is a finite number of ms, not below 0.");
  let start = 0;
  return lengths.map((length) => {
    if (!Number.isFinite(length) || length < 0)
      throw new RangeError(`chain: a length of ${length} ms is not a stretch of time.`);
    if (overlap !== undefined && overlap > length)
      throw new RangeError(
        `chain: an overlap of ${overlap} ms is longer than a ${length} ms length.`,
      );
    const each = span(start, start + length);
    start += length + step;
    return each;
  });
}
