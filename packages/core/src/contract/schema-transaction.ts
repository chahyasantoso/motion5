import type { MotionHandle } from "./motion-handle";
import type { TrackHandle } from "./track-handle";
import type { MotionDefinition, TrackDefinition } from "./v5";

/**
 * Narrowed structural surface one recipe is handed: staged ops commit once, on return.
 * Staged reads see staged writes; a refusal leaves retained handles live, staged ones stale. */
export interface SchemaTransaction {
  /**
   * Creates a Motion inside this transaction and returns the handle to it.
   * Entry refusals match `ProjectHandle.addMotion`; the driver builds at commit. */
  addMotion(definition: MotionDefinition): MotionHandle;
  /** Resolves one Motion, refusing an id this project does not have. */
  motion(motionId: string): MotionHandle;
  /** Resolves one Motion, answering `undefined` for a miss instead of refusing. */
  tryMotion(motionId: string): MotionHandle | undefined;
  /**
   * Adds a track inside this transaction and returns the handle to it.
   * The handle is live for the rest of the recipe; a throw leaves it stale. */
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
  /**
   * Resolves one track by qualified node id, including one this recipe added.
   * Reads resolve against the staged plan, so the second step sees the first. */
  track(nodeId: string): TrackHandle;
  /** Resolves one track, answering `undefined` for a miss instead of refusing. */
  tryTrack(nodeId: string): TrackHandle | undefined;
}
