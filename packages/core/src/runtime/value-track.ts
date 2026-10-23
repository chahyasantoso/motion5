import type { Outputs } from "../contract/v5";
import type { ParsedValues } from "../contract/v5-parse";
import type { Interpolator } from "../ports/interpolator";
import { createValueEvaluator, type ValueEvaluator } from "./evaluate-values";

/**
 * The compiled form of one identified-table track that selects no plugin.
 *
 * A value track holds the evaluator rather than a timeline of grouped keyframes, so its published
 * pose is the authored table or record reconstructed at the current progress. It answers the two
 * members a Motion drives (`progress` and `setProgress`) and the one member the publisher reads
 * (`outputs`), and nothing else: the plugin chain, live mask and interpolated-state seams the
 * legacy `Track` carries are absent here rather than stubbed, because a no-plugin track has no
 * plugin to chain and Phase 4 owns shape-matched live writes.
 *
 * `outputs` is a named-output map with the main output `values`, which is the one shape the ready
 * patch publishes for a no-plugin track. No slot id reaches it: `evaluate-values.ts` owns the
 * slot plan and reconstructs the authored rows and fields before this module sees them.
 */
export class ValueTrack {
  readonly kind = "values";
  readonly nodeId: string;
  readonly #evaluator: ValueEvaluator;
  #progress = 0;
  #disposed = false;

  constructor(options: {
    readonly nodeId: string;
    readonly values: ParsedValues | undefined;
    readonly interpolator: Interpolator;
  }) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.#evaluator = createValueEvaluator(options.values, options.interpolator);
  }

  get progress(): number {
    return this.#progress;
  }

  /** A no-plugin track declares no plugin chain, which is what `renderMetadata` answers. */
  get plugins(): undefined {
    return undefined;
  }

  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#progress = next;
    return true;
  }

  /** The authored shape evaluated at this track's progress, under the output named `values`. */
  outputs(): Outputs {
    this.assertActive();
    return Object.freeze({ values: this.#evaluator.evaluate(this.#progress) });
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#evaluator.dispose();
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
