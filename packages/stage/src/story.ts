import { span, type Span } from "@gerak/moves";

const RESERVED = new Set(["durationMs", "order"]);

/** A piece's beats as named spans, its length, and the beats' names in the order they were given. */
export type Story<B extends string> = Readonly<Record<B, Span>> & {
  readonly durationMs: number;
  readonly order: readonly B[];
};

/** Beats by name, each `[fromMs, toMs]` inside a piece `durationMs` long; beats may overlap. */
export function story<const B extends string>(
  durationMs: number,
  beats: Readonly<Record<B, readonly [number, number]>>,
): Story<B> {
  if (!(Number.isFinite(durationMs) && durationMs > 0))
    throw new RangeError(`story: durationMs must be above 0, not ${durationMs}.`);
  const order = Object.keys(beats).filter((name): name is B => Object.hasOwn(beats, name));
  const spans: Partial<Record<B, Span>> = {};
  for (const name of order) {
    if (RESERVED.has(name))
      throw new RangeError(`story: "${name}" is a name the story keeps for itself.`);
    const [from, to] = beats[name];
    if (
      !(Number.isFinite(from) && Number.isFinite(to) && from >= 0 && to >= from && to <= durationMs)
    )
      throw new RangeError(
        `story: beat "${name}" from ${from} to ${to} ms does not fit a ${durationMs} ms piece.`,
      );
    spans[name] = span(from, to);
  }
  if (!complete(spans, order)) throw new Error("story: a beat was not made.");
  return Object.freeze(Object.assign({}, spans, { durationMs, order: Object.freeze([...order]) }));
}

function complete<B extends string>(
  spans: Partial<Record<B, Span>>,
  order: readonly B[],
): spans is Record<B, Span> {
  return order.every((name) => spans[name] !== undefined);
}

/** The stage's size in px; a renderer fits it to its container. */
export interface Frame {
  readonly width: number;
  readonly height: number;
}

/** A stage `width` by `height` px. */
export function frame(size: Frame): Frame {
  if (!(size.width > 0 && size.height > 0))
    throw new RangeError(
      `frame: width and height must be above 0, not ${size.width} by ${size.height}.`,
    );
  return Object.freeze({ width: size.width, height: size.height });
}

/** The frame a module gets when it names none. */
export const DEFAULT_FRAME: Frame = frame({ width: 1280, height: 720 });
