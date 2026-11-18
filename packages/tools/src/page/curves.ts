import { ease, type Curve } from "@gerak/core";

/** The curves a measured move is named after, under the names `@gerak/core` gives its eases. */
export const NAMED_CURVES: Readonly<Record<string, Curve>> = Object.freeze({
  linear: ease.linear,
  sineIn: ease.sineIn,
  sineOut: ease.sineOut,
  sineInOut: ease.sineInOut,
  quadIn: ease.quadIn,
  quadOut: ease.quadOut,
  quadInOut: ease.quadInOut,
  cubicIn: ease.cubicIn,
  cubicOut: ease.cubicOut,
  cubicInOut: ease.cubicInOut,
  quartIn: ease.quartIn,
  quartOut: ease.quartOut,
  quartInOut: ease.quartInOut,
  expoIn: ease.expoIn,
  expoOut: ease.expoOut,
  expoInOut: ease.expoInOut,
  backIn: ease.backIn,
  backOut: ease.backOut,
  backInOut: ease.backInOut,
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

/** A measured ease named by the nearest curve, with its distance `rms`; `bezier` is the fitted
 * cubic-bezier when none is within 0.02. */
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
