import type { ImmutableRecord } from "./values";
import { equalValues, freezeValue } from "./values";
import type { InterpolationTimeline, Interpolator } from "../ports/interpolator";
import type { PluginDefinition, ResolvedPlugins } from "./plugins";

export interface TrackSnapshot {
  readonly progress: number;
  readonly values: Readonly<ImmutableRecord>;
}

export interface TrackOptions {
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly plugins?: ResolvedPlugins;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function prepareConfig(
  config: unknown,
  plugins: readonly PluginDefinition[],
): unknown {
  if (!isRecord(config) || !isRecord(config.keyframes)) return config;
  let keyframes = { ...config.keyframes };
  for (const plugin of plugins) {
    if (plugin.stage !== "prepare" || plugin.contribute === undefined) continue;
    const authoredSnapshot = Object.freeze({ ...keyframes });
    const contribution = plugin.contribute(authoredSnapshot);
    if (isRecord(contribution)) keyframes = { ...keyframes, ...contribution };
  }
  return Object.freeze({ ...config, keyframes: Object.freeze(keyframes) });
}

export class Track {
  readonly #timeline: InterpolationTimeline;
  readonly #plugins: ResolvedPlugins;
  #progress: number;
  #dirty = true;
  #disposed = false;
  #lastSnapshot: TrackSnapshot | undefined;
  #lastInputs: Readonly<ImmutableRecord> | undefined;

  constructor(options: TrackOptions) {
    this.#plugins =
      options.plugins ??
      Object.freeze({ plugins: Object.freeze([]), diagnostics: Object.freeze([]) });
    const preparedConfig = prepareConfig(options.interpolationConfig, this.#plugins.plugins);
    this.#timeline = options.interpolator.create(preparedConfig);
    this.#progress = 0;
  }

  get progress(): number {
    return this.#progress;
  }

  get dirty(): boolean {
    return this.#dirty;
  }

  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#progress = next;
    this.#timeline.progress(next);
    this.#dirty = true;
    return true;
  }

  compose(inputs: Readonly<ImmutableRecord> = {}): TrackSnapshot {
    this.assertActive();
    if (
      !this.#dirty &&
      this.#lastSnapshot &&
      this.#lastInputs !== undefined &&
      (this.#lastInputs === inputs || equalValues(this.#lastInputs, inputs))
    )
      return this.#lastSnapshot;
    let values: ImmutableRecord = {
      ...(this.#timeline.state as Readonly<ImmutableRecord>),
      ...inputs,
    };
    for (const plugin of this.#plugins.plugins) {
      values = plugin.compose(values, this.#progress);
      freezeValue(values);
    }
    const snapshot = Object.freeze({
      progress: this.#progress,
      values: freezeValue(values),
    });
    this.#lastInputs = freezeValue({ ...inputs });
    this.#lastSnapshot = snapshot;
    this.#dirty = false;
    return snapshot;
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#timeline.kill();
    this.#lastSnapshot = undefined;
    this.#lastInputs = undefined;
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
