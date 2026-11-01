import type { TrackHandle } from "./track-handle";
import type { PatchBatch, Value } from "./v5";

/**
 * Value authoring for one batch: each write applies immediately, publication deferred to recipe return.
 * Projection of existing verbs; publishing and structural verbs refuse inside a batch. */
export interface ValueTransaction {
  /**
   * Scrubs one leaf to `progress`, staging publication; the same verb as `ProjectHandle.seek`.
   * A driver-backed Motion overwrites the seeked value on its next emission. */
  seek(nodeId: string, progress: number): PatchBatch;
  /** Node-addressed live write; publication deferred to batch close. */
  writeValues(nodeId: string, value: Value): PatchBatch;
  /** Node-addressed release; publication deferred to batch close. */
  releaseValues(nodeId: string): PatchBatch;
  /**
   * Resolves one track by qualified node id, refusing an id this project lacks; the ordinary
   * `TrackHandle`, so its authored `input.values` verbs join this batch too. */
  track(nodeId: string): TrackHandle;
  /** The same lookup without the refusal, for a caller whose miss is expected. */
  tryTrack(nodeId: string): TrackHandle | undefined;
}
