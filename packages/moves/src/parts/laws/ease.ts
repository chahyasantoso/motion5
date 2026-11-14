import { spring, springMemory, type SpringOptions } from "./spring";
import { unreachable } from "../../unreachable";

/** A curve from progress 0 to 1 onto eased progress, 0 at 0 and 1 at 1; back and elastic overshoot. */
export type Ease = (progress: number) => number;

/** Which end of a curve is slow: `in` starts slow, `out` ends slow, `inOut` does both. */
export type EaseDirection = "in" | "out" | "inOut";

const BACK = 1.70158;
const out =
  (curve: Ease): Ease =>
  (u) =>
    1 - curve(1 - u);
const inOut =
  (curve: Ease): Ease =>
  (u) =>
    u < 0.5 ? curve(2 * u) / 2 : 1 - curve(2 - 2 * u) / 2;

const sineIn: Ease = (u) => 1 - Math.cos((u * Math.PI) / 2);
const quadIn: Ease = (u) => u * u;
const cubicIn: Ease = (u) => u * u * u;
const quartIn: Ease = (u) => u ** 4;
const expoIn: Ease = (u) => (u === 0 ? 0 : 2 ** (10 * u - 10));
const bounceOut: Ease = (u) => {
  const n = 7.5625;
  if (u < 1 / 2.75) return n * u * u;
  if (u < 2 / 2.75) return n * (u - 1.5 / 2.75) ** 2 + 0.75;
  if (u < 2.5 / 2.75) return n * (u - 2.25 / 2.75) ** 2 + 0.9375;
  return n * (u - 2.625 / 2.75) ** 2 + 0.984375;
};
/** A back curve that pulls back by `amount` before it goes (`"in"`), overshoots by it as it ends
 * (`"out"`), or both (`"inOut"`); `amount: 0` is the cubic. */
export function backEase(options: {
  readonly amount: number;
  readonly direction: EaseDirection;
}): Ease {
  const { amount, direction } = options;
  if (!(amount >= 0)) throw new RangeError("backEase: amount must be at least 0.");
  const curve: Ease = (u) => u * u * ((amount + 1) * u - amount);
  switch (direction) {
    case "in":
      return curve;
    case "out":
      return out(curve);
    case "inOut":
      return inOut(curve);
    default:
      return unreachable(direction);
  }
}

const SETTLED = 0.001;

/** A spring from 0 settling on 1, fitted to the span; lower `damping` rings more. Feed it to values,
 * not to a move's progress. */
export function springEase(options: SpringOptions): Ease {
  const settle = springMemory(options, SETTLED) / 2;
  if (!Number.isFinite(settle)) throw new RangeError("springEase: damping must be above 0.");
  const left = spring(-1, 0, settle, options).offset;
  return (u) =>
    u <= 0 ? 0 : u >= 1 ? 1 : 1 + spring(-1, 0, u * settle, options).offset - u * left;
}

const elasticOut: Ease = (u) =>
  u === 0 || u === 1 ? u : 2 ** (-10 * u) * Math.sin((u * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;

/** The common eases under their usual names: `In` starts slow, `Out` ends slow, `InOut` does both. */
export const ease = Object.freeze({
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
  backIn: backEase({ amount: BACK, direction: "in" }),
  backOut: backEase({ amount: BACK, direction: "out" }),
  backInOut: backEase({ amount: BACK, direction: "inOut" }),
  elasticOut,
  bounceOut,
  bounceIn: out(bounceOut),
} satisfies Readonly<Record<string, Ease>>);
