import { createTrackLeafCodec, type TrackLeafCodec } from "../contract/leaf-codec";
import type { Interpolator, InterpolationTimeline } from "../ports/interpolator";
import type { TrackExecutionPlan } from "./execution-plan";

export interface PrepareTrackOptions {
  readonly plan: TrackExecutionPlan;
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly duration?: number;
}

export interface PreparedTrack {
  readonly plan: TrackExecutionPlan;
  readonly codec: TrackLeafCodec;
  readonly timeline: InterpolationTimeline;
  readonly staticValues: Readonly<Record<string, unknown>>;
  readonly tweenVars: Readonly<Record<string, unknown>>;
  readonly progress: number;
  setProgress(value: number): boolean;
  sample(progress?: number): ReadonlyMap<string, Readonly<Record<string, unknown>>>;
  sampleEntry(entryId: string, progress?: number): Readonly<Record<string, unknown>>;
  dispose(): void;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

class PreparedTrackImpl implements PreparedTrack {
  readonly plan: TrackExecutionPlan;
  readonly codec: TrackLeafCodec;
  readonly timeline: InterpolationTimeline;
  readonly staticValues: Readonly<Record<string, unknown>>;
  readonly tweenVars: Readonly<Record<string, unknown>>;
  #progress = 0;
  #disposed = false;

  constructor(
    plan: TrackExecutionPlan,
    codec: TrackLeafCodec,
    timeline: InterpolationTimeline,
    tweenVars: Record<string, unknown>,
  ) {
    this.plan = plan;
    this.codec = codec;
    this.timeline = timeline;
    this.staticValues = codec.getStaticValues();
    this.tweenVars = Object.freeze({ ...tweenVars });
  }

  get progress(): number {
    return this.#progress;
  }

  setProgress(value: number): boolean {
    if (this.#disposed) {
      throw new TypeError("Cannot set progress on a disposed PreparedTrack.");
    }
    if (!Number.isFinite(value)) {
      throw new TypeError("Track progress must be a finite number.");
    }
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.timeline.progress(next);
    this.#progress = next;
    return true;
  }

  sample(progress?: number): ReadonlyMap<string, Readonly<Record<string, unknown>>> {
    if (this.#disposed) {
      throw new TypeError("Cannot sample a disposed PreparedTrack.");
    }
    if (progress !== undefined) {
      this.setProgress(progress);
    }
    const decoded = this.codec.decodeEvaluatedState(this.timeline.state);
    const result = new Map<string, Readonly<Record<string, unknown>>>(decoded);

    // Schedule all entries (including dependency-only entries with no values)
    for (const entry of this.plan.entries) {
      if (!result.has(entry.entryId)) {
        result.set(entry.entryId, Object.freeze({}));
      }
    }
    return result;
  }

  sampleEntry(entryId: string, progress?: number): Readonly<Record<string, unknown>> {
    const all = this.sample(progress);
    return all.get(entryId) ?? Object.freeze({});
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.timeline.kill?.();
  }
}

export function prepareTrack(options: PrepareTrackOptions): PreparedTrack {
  const { plan, interpolator, interpolationConfig, duration } = options;

  // 1. Abandon immediately if plan has diagnostic errors (do not create timeline/allocate resources)
  const errors = plan.diagnostics.filter((d) => d.severity === "error");
  if (errors.length > 0) {
    throw new TypeError(`Track preparation failed: ${errors[0]?.ruleId}: ${errors[0]?.message}`);
  }

  // 2. Build forward/reverse leaf codec
  const codec = createTrackLeafCodec(plan);

  // 3. Combine contributed tweenVars across entries and validate no conflicts
  const tweenVars: Record<string, unknown> = {};
  for (const entry of plan.entries) {
    if (entry.contribution?.tweenVars) {
      for (const [name, val] of Object.entries(entry.contribution.tweenVars)) {
        if (name in tweenVars && !Object.is(tweenVars[name], val)) {
          throw new TypeError(`Conflicting tween var "${name}" contributed between track entries.`);
        }
        tweenVars[name] = val;
      }
    }
  }

  // 4. Create timeline via interpolator port with cleanup protection
  const animatedKeyframes = codec.getAnimatedKeyframes();
  const config = isRecord(interpolationConfig) ? interpolationConfig : {};

  let timeline: InterpolationTimeline;
  try {
    timeline = interpolator.create({
      ...config,
      ...(duration !== undefined ? { duration } : {}),
      keyframes: animatedKeyframes,
      tweenVars,
    });
  } catch (error) {
    // Creation failed: guarantee no leaked timeline
    throw error;
  }

  return new PreparedTrackImpl(plan, codec, timeline, tweenVars);
}
