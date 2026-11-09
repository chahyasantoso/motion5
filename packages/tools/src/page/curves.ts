/** A curve from share 0 to 1 of a move's time onto share 0 to 1 of its travel. */
export type Curve = (u: number) => number;

const BACK = 1.70158;
const out =
  (curve: Curve): Curve =>
  (u) =>
    1 - curve(1 - u);
const inOut =
  (curve: Curve): Curve =>
  (u) =>
    u < 0.5 ? curve(2 * u) / 2 : 1 - curve(2 - 2 * u) / 2;

const sineIn: Curve = (u) => 1 - Math.cos((u * Math.PI) / 2);
const quadIn: Curve = (u) => u * u;
const cubicIn: Curve = (u) => u * u * u;
const quartIn: Curve = (u) => u ** 4;
const expoIn: Curve = (u) => (u === 0 ? 0 : 2 ** (10 * u - 10));
const backIn: Curve = (u) => u * u * ((BACK + 1) * u - BACK);

/** The curves a measured move is named after, under the names `@motion5/moves` gives its eases. */
export const NAMED_CURVES: Readonly<Record<string, Curve>> = Object.freeze({
  linear: (u: number) => u,
  sineIn,
  sineOut: out(sineIn),
  sineInOut: inOut(sineIn),
  quadIn,
  quadOut: out(quadIn),
  quadInOut: inOut(quadIn),
  cubicIn,
  cubicOut: out(cubicIn),
  cubicInOut: inOut(cubicIn),
  quartIn,
  quartOut: out(quartIn),
  quartInOut: inOut(quartIn),
  expoIn,
  expoOut: out(expoIn),
  expoInOut: inOut(expoIn),
  backIn,
  backOut: out(backIn),
  backInOut: inOut(backIn),
});

/** CSS `cubic-bezier(x1, y1, x2, y2)` as a curve, solving for the curve's time at each share of time. */
export function bezier([x1, y1, x2, y2]: readonly [number, number, number, number]): Curve {
  const at = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (u) => {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 40; i += 1) {
      const mid = (low + high) / 2;
      if (at(x1, x2, mid) < u) low = mid;
      else high = mid;
    }
    return at(y1, y2, (low + high) / 2);
  };
}

/** Root mean square distance between measured points and a curve. */
export function distance(points: readonly { u: number; p: number }[], curve: Curve): number {
  if (points.length === 0) return 0;
  const sum = points.reduce((total, { u, p }) => total + (p - curve(u)) ** 2, 0);
  return Math.sqrt(sum / points.length);
}

export interface Fit {
  readonly name: string;
  readonly rms: number;
  /** Set when no named curve is close: the cubic-bezier nearest the points, and its distance. */
  readonly bezier?: { readonly control: readonly number[]; readonly rms: number };
}

const CLOSE = 0.02;

/** Fewer points than this name the nearest curve only: too few to fit a bezier to. */
const FIT_POINTS = 8;

/** The named curve nearest the points, and a fitted cubic-bezier when none is within 0.02. */
export function fitCurve(points: readonly { u: number; p: number }[]): Fit {
  let best = { name: "linear", rms: Infinity };
  for (const [name, curve] of Object.entries(NAMED_CURVES)) {
    const rms = distance(points, curve);
    if (rms < best.rms) best = { name, rms };
  }
  if (best.rms <= CLOSE || points.length < FIT_POINTS)
    return { name: best.name, rms: round(best.rms) };
  let control: [number, number, number, number] = [0.42, 0, 0.58, 1];
  let rms = distance(points, bezier(control));
  for (const step of [0.2, 0.1, 0.05, 0.02, 0.01, 0.005])
    for (let improved = true; improved; ) {
      improved = false;
      for (let index = 0; index < 4; index += 1)
        for (const sign of [-1, 1]) {
          const next: [number, number, number, number] = [...control];
          next[index] = (next[index] ?? 0) + sign * step;
          if (index % 2 === 0) next[index] = Math.min(1, Math.max(0, next[index] ?? 0));
          const tried = distance(points, bezier(next));
          if (tried < rms - 1e-6) {
            control = next;
            rms = tried;
            improved = true;
          }
        }
    }
  return {
    name: best.name,
    rms: round(best.rms),
    bezier: { control: control.map(round), rms: round(rms) },
  };
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
