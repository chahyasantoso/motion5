export interface InterpolationTimeline {
  readonly duration: number;
  readonly state: Readonly<Record<string, unknown>>;
  progress(): number;
  progress(value: number): void;
  kill(): void;
  /**
   * Replaces the tweens of the keys in `overlay` on the still-live timeline, against a base record
   * the implementation retained when it compiled.
   *
   * The effective record is the base with the overlay written over it, so a key dropped from the
   * overlay is restored from the base by exactly the code that patches a changed one, and the
   * semantics are wholesale replacement rather than accumulation. `rebase` makes the effective
   * record the new base, which is the difference between a revertible override and a sticky
   * authored write expressed as one boolean rather than as a second member.
   *
   * Leaves arrive exactly as authored. The implementation reads stops through the keyframe
   * compiler, so no caller has to know what a leaf looks like in order to hand one over.
   *
   * `false` means escalate, always, and nothing else. It is never "your input was bad": key
   * legality is answered before the call, and an effective record that cannot compile raises its
   * error from the recompile the caller escalates to, exactly as it would have without this
   * capability. Optional because an implementation with no per-key child cannot honor it, and a
   * caller whose answer is total on success and on failure loses nothing when it is absent.
   * See ADR-060.
   */
  patchKeys?(overlay: Readonly<Record<string, unknown>>, rebase?: boolean): boolean;
}

export interface Interpolator<Config = unknown> {
  create(config: Config): InterpolationTimeline;
}

export function assertInterpolator(
  interpolator: unknown,
  context = "Interpolator",
): asserts interpolator is Interpolator {
  if (!interpolator || typeof (interpolator as { create?: unknown }).create !== "function") {
    throw new TypeError(`${context} requires create(config).`);
  }
}
