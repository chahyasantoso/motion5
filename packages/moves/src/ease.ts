/** A curve from progress 0 to 1 onto eased progress, 0 at 0 and 1 at 1; back and elastic overshoot. */
export type Ease = (progress: number) => number;

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
const backIn: Ease = (u) => u * u * ((BACK + 1) * u - BACK);
const bounceOut: Ease = (u) => {
  const n = 7.5625;
  if (u < 1 / 2.75) return n * u * u;
  if (u < 2 / 2.75) return n * (u - 1.5 / 2.75) ** 2 + 0.75;
  if (u < 2.5 / 2.75) return n * (u - 2.25 / 2.75) ** 2 + 0.9375;
  return n * (u - 2.625 / 2.75) ** 2 + 0.984375;
};
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
  backIn,
  backOut: out(backIn),
  backInOut: inOut(backIn),
  elasticOut,
  bounceOut,
  bounceIn: out(bounceOut),
} satisfies Readonly<Record<string, Ease>>);
