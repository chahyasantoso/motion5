import { StaleHandleError, type Handle } from "./handle";
import type { TrackHandle } from "./track-handle";
import type { MotionDefinition, TrackDefinition } from "./v5";

/**
 * The one failure a stale `MotionHandle` reports; sibling of `StaleTrackHandleError`.
 * Catch `StaleHandleError` for either handle, or branch on `ruleId`. */
export class StaleMotionHandleError extends StaleHandleError {
  /** Stable identity, kebab case like every diagnostic rule id. */
  static readonly ruleId = "stale-motion-handle";
  readonly ruleId = StaleMotionHandleError.ruleId;
  /** Motion id the refused handle was captured against. */
  readonly motionId: string;
  constructor(motionId: string) {
    super("Motion", motionId);
    this.name = "StaleMotionHandleError";
    this.motionId = motionId;
  }
}

/**
 * Capability handle for one Motion, identified by captured id, live while that token is current.
 * All but `live` refuse once stale; `definition` projects live tracks, not the stored entry. */
export interface MotionHandle extends Handle<MotionDefinition> {
  /** Qualified node ids this motion currently owns, in commit order. */
  readonly trackIds: readonly string[];
  addTrack(track: TrackDefinition): TrackHandle;
  /** Resolves one of this motion's tracks by authored id; refuses an id it does not own. */
  track(trackId: string): TrackHandle;
  /** Same lookup without the refusal, for a caller whose miss is expected. */
  tryTrack(trackId: string): TrackHandle | undefined;
  /**
   * Installs the trigger, keeping tracks, playhead and position; validated before release, so a
   * refusal tears nothing down and a no-op edit asks the driver layer nothing. */
  setTrigger(trigger: MotionDefinition["trigger"]): void;
  /**
   * Moves its stagger, which no driver reads and no node carries; omitting clears it, absent from
   * `definition` rather than present and undefined. */
  setStagger(stagger?: number): void;
  /**
   * Destroys this motion, which must own no tracks; otherwise refuses with the existing count
   * message and destroys nothing. The caller removes them first; this never cascades. */
  destroy(): void;
}
