import type { Interpolator } from "../../src/ports/interpolator";
import type { MotionTrack } from "../../src/domain/motion";

export interface TrackOptions {
  readonly interpolator: Interpolator;
  readonly interpolationConfig?: unknown;
  readonly nodeId: string;
}

/**
 * A compiled-leaf stand-in for Motion tests, which need a playhead and a release, not a composer.
 *
 * The grouped composer this replaced is deleted with the registry; a test that was really about
 * plugin chains moved to the identified track suites. What remains here is the part Motion drives:
 * progress, interpolation and disposal.
 */
export class Track implements MotionTrack {
  readonly #timeline: ReturnType<Interpolator["create"]>;
  readonly nodeId: string;
  #progress = 0;
  #disposed = false;

  constructor(options: TrackOptions) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.#timeline = options.interpolator.create(options.interpolationConfig ?? {});
  }

  get progress(): number {
    return this.#progress;
  }

  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#timeline.progress(next);
    this.#progress = next;
    return true;
  }

  interpolated(): Readonly<Record<string, unknown>> {
    this.assertActive();
    return this.#timeline.state;
  }

  /** The snapshot shape Motion tests read after a disposal check; no plugin chain runs here. */
  compose(): { readonly progress: number; readonly values: Readonly<Record<string, unknown>> } {
    return { progress: this.#progress, values: this.interpolated() };
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#timeline.kill();
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
