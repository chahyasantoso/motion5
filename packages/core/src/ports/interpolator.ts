export interface InterpolationTimeline {
  readonly duration: number;
  progress(): number;
  progress(value: number): void;
  kill(): void;
}

export interface Interpolator<Config = unknown> {
  create(config: Config): InterpolationTimeline;
}

export function assertInterpolator(interpolator: unknown, context = "Interpolator"): asserts interpolator is Interpolator {
  if (!interpolator || typeof (interpolator as { create?: unknown }).create !== "function") {
    throw new TypeError(`${context} requires create(config).`);
  }
}
