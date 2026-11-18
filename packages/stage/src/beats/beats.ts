import { span, type Span } from "@gerak/core";

const RESERVED_BEATS = new Set(["durationMs", "order"]);

/** Inclusive start and end times in ms for one beat. */
export type BeatSpan = readonly [number, number];

/** Named beat spans mapping beat names to `[fromMs, toMs]` pairs. */
export type BeatsInput<B extends string = string> = Readonly<Record<B, BeatSpan>>;

/** A visibility stretch: one beat name or a `[fromBeat, toBeat]` pair. */
export type Stretch<B extends string = string> = B | readonly [B, B];

/** A normalized visibility stretch `[fromBeat, toBeat]`. */
export type CompiledStretch<B extends string = string> = readonly [B, B];

/** Compiled beats by name, total `durationMs`, and declaration `order`. */
export type CompiledBeats<B extends string = string> = Readonly<Record<B, Span>> & {
  readonly durationMs: number;
  readonly order: readonly B[];
};

/** Validation outcome for compiling a beat table. */
export type BeatsCompileResult<B extends string = string> =
  | { readonly ok: true; readonly beats: CompiledBeats<B> }
  | { readonly ok: false; readonly field: "beats" | "durationMs"; readonly reason: string };

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function completeSpans<B extends string>(
  spans: Partial<Record<B, Span>>,
  order: readonly B[],
): spans is Record<B, Span> {
  return order.every((name) => spans[name] !== undefined);
}

/** Validates and freezes a `BeatsInput` record into `CompiledBeats`. */
export function compileBeats<B extends string>(
  input: unknown,
  durationMs?: unknown,
): BeatsCompileResult<B> {
  if (!isPlainRecord(input))
    return { ok: false, field: "beats", reason: "`beats` must be an object of `[from, to]` ms." };
  if (
    durationMs !== undefined &&
    (typeof durationMs !== "number" || !Number.isFinite(durationMs) || durationMs <= 0)
  )
    return { ok: false, field: "durationMs", reason: "`durationMs` must be above 0." };

  const order = Object.keys(input).filter((name): name is B => Object.hasOwn(input, name));
  const raw: { readonly name: B; readonly from: number; readonly to: number }[] = [];
  let maxTo = 0;

  for (const name of order) {
    if (RESERVED_BEATS.has(name))
      return {
        ok: false,
        field: "beats",
        reason: `beat name "${name}" is reserved by CompiledBeats.`,
      };
    const pair = input[name];
    if (!Array.isArray(pair) || pair.length !== 2)
      return { ok: false, field: "beats", reason: `beat "${name}" must be a [from, to] tuple.` };
    const from: unknown = pair[0];
    const to: unknown = pair[1];
    if (
      typeof from !== "number" ||
      typeof to !== "number" ||
      !Number.isFinite(from) ||
      !Number.isFinite(to) ||
      from < 0 ||
      to < from
    )
      return {
        ok: false,
        field: "beats",
        reason: `beat "${name}" has invalid bounds [${String(from)}, ${String(to)}].`,
      };
    maxTo = Math.max(maxTo, to);
    raw.push({ name, from, to });
  }

  const totalMs = typeof durationMs === "number" ? durationMs : maxTo;
  if (!(Number.isFinite(totalMs) && totalMs > 0))
    return {
      ok: false,
      field: "beats",
      reason: "beats must reach above 0 ms (or supply positive `durationMs`).",
    };
  for (const entry of raw)
    if (entry.to > totalMs)
      return {
        ok: false,
        field: "beats",
        reason: `beat "${entry.name}" ends at ${entry.to} ms, past durationMs (${totalMs} ms).`,
      };

  const spans: Partial<Record<B, Span>> = {};
  for (const entry of raw) spans[entry.name] = span(entry.from, entry.to);
  if (!completeSpans(spans, order))
    return { ok: false, field: "beats", reason: "failed to compile all beat spans." };

  const frozenOrder = Object.freeze([...order]);
  return {
    ok: true,
    beats: Object.freeze(Object.assign({}, spans, { durationMs: totalMs, order: frozenOrder })),
  };
}

/** Whether a member on `on` stretches shows at `ms`; a stretch reaching `durationMs` holds past it. */
export function presentAt(
  on: readonly (readonly [string, string])[],
  spanOf: (beat: string) => { readonly from: number; readonly to: number } | undefined,
  durationMs: number,
  ms: number,
): boolean {
  return on.some(([first, last]) => {
    const from = spanOf(first)?.from ?? 0;
    const to = spanOf(last)?.to ?? durationMs;
    return ms >= from && (ms <= to || to >= durationMs);
  });
}
