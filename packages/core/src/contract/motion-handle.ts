import { StaleHandleError, type Handle } from "./handle";
import type { TrackHandle } from "./track-handle";
import type { MotionDefinition, TrackDefinition } from "./v5";

/**
 * The one failure a stale `MotionHandle` reports, from every member it has.
 *
 * A sibling of `StaleTrackHandleError` under one base rather than a second mechanism: the staleness
 * machinery `ProjectRuntime` already holds is per-entry rather than per-track-ness, so a motion
 * needed a token and a noun, not a second token policy. A caller that wants either refusal catches
 * `StaleHandleError`; one that wants this one branches on `ruleId`.
 */
export class StaleMotionHandleError extends StaleHandleError {
  /** Stable identity, in the kebab shape every diagnostic rule id in this project uses. */
  static readonly ruleId = "stale-motion-handle";
  readonly ruleId: string = StaleMotionHandleError.ruleId;
  /** The motion id the refused handle was captured against. */
  readonly motionId: string;
  constructor(motionId: string) {
    super("Motion", motionId);
    this.name = "StaleMotionHandleError";
    this.motionId = motionId;
  }
}

/**
 * A capability handle for one Motion, valid while the token it captured is current.
 *
 * The id is the handle's identity rather than a parameter, which is what lets the verbs below have
 * one addressing mode and one failure contract. Reaching them by id instead would add a second
 * refusal beside this one for the same mistake, which is the split ADR-056 collapsed.
 *
 * `definition` projects the tracks this motion currently owns rather than answering from the entry
 * as stored, because the entry a runtime add accepts carries an empty list by construction and a
 * motion reporting no tracks while owning three would be a handle that lies. It is derived through
 * the same owner the committed snapshot reads, so the two cannot disagree.
 *
 * No `setTrigger` or `setStagger` here yet. Those are a live driver edit reaching the layer that
 * owns the created trigger and the clock consumer, with a refusal set of their own, and they ship as
 * their own slice rather than inside the one that introduces the base.
 *
 * No `signal` either, and that is not an omission: signalling a Motion is the composition root's
 * question, answered by `ProjectHandle.signal`, and the runtime that owns these tokens holds no
 * Motion instance to signal.
 */
export interface MotionHandle extends Handle<MotionDefinition> {
  /** The qualified node ids this motion currently owns, in commit order. */
  readonly trackIds: readonly string[];
  addTrack(track: TrackDefinition): TrackHandle;
  /** Resolves one of this motion's tracks by its authored id, refusing an id it does not own. */
  track(trackId: string): TrackHandle;
  /** The same lookup without the refusal, for a caller whose miss is expected. */
  tryTrack(trackId: string): TrackHandle | undefined;
  /**
   * Destroys this motion, which must own no tracks.
   *
   * Refuses with the existing count message when it still does, and destroys nothing. Removing them
   * first is the caller's decision because a cascade would tear down nodes it never named.
   */
  destroy(): void;
}
