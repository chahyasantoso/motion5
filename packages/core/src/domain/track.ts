import type { ImmutableRecord } from "./values";
import { freezeValue } from "./values";
import type { InterpolationTimeline, Interpolator } from "../ports/interpolator";
import type { ResolvedPlugins } from "./plugins";

export interface TrackSnapshot {
  readonly progress: number;
  readonly values: Readonly<ImmutableRecord>;
}

export interface TrackOptions {
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly plugins?: ResolvedPlugins;
}

export class Track {
  readonly #timeline: InterpolationTimeline;
  readonly #plugins: ResolvedPlugins;
  #progress: number;
  #dirty = true;
  #disposed = false;
  #lastSnapshot: TrackSnapshot | undefined;

  constructor(options: TrackOptions) {
    this.#timeline = options.interpolator.create(options.interpolationConfig);
    this.#plugins = options.plugins ?? Object.freeze({ plugins: Object.freeze([]), diagnostics: Object.freeze([]) });
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
    if (!this.#dirty && this.#lastSnapshot) return this.#lastSnapshot;
    let values: ImmutableRecord = { ...inputs };
    for (const plugin of this.#plugins.plugins) {
      values = plugin.compose(values, this.#progress);
      freezeValue(values);
    }
    const snapshot = Object.freeze({
      progress: this.#progress,
      values: freezeValue(values),
    });
    this.#lastSnapshot = snapshot;
    this.#dirty = false;
    return snapshot;
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#timeline.kill();
    this.#lastSnapshot = undefined;
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
