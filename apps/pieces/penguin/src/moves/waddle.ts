import { arch, motion, wave, type Motion, type Pose2d } from "@gerak/core";

const easeSine = (u: number): number => arch(Math.min(1, Math.max(0, u)) / 2) ** 2;
const oneCycle = wave({ count: 1 });

/** Options of `waddle`. */
export interface WaddleOptions {
  /** Widest lean to each side, in degrees. */
  readonly angle: number;
  /** Rocks left and right, each one both sides; default 2. */
  readonly count?: number;
  /** How far it drops as it passes upright between feet, in px; default 0. */
  readonly sink?: number;
  /** How long it hangs on each foot before the weight crosses over, 0 to 0.8; default 0.35. */
  readonly linger?: number;
}

/** Rocks side to side from foot to foot, lingering on each side and sinking as it passes upright, then comes to rest. */
export function waddle(options: WaddleOptions): Motion<Pose2d> {
  const { angle, count = 2, sink = 0, linger = 0.35 } = options;
  return motion(({ progress }): Pose2d => {
    const cycles = progress * count;
    const ramp = easeSine(Math.min(cycles * 2, (count - cycles) * 2));
    const side = oneCycle(cycles);
    const lean = Math.sign(side) * Math.abs(side) ** (1 - linger);
    return { rotation: -angle * lean * ramp, y: sink * ramp * (1 - side * side) ** 3 };
  });
}
