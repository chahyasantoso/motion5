import { unreachable } from "../filler/unreachable";
import type { SessionSample } from "./session";

/**
 * The ingest gate's answer for one sample, a closed union read exhaustively. `continue` feeds the
 * pipeline as it is. `restart` feeds it after every stateful stage is reset, because the sample
 * begins a new subject: a new session, a source that stalled past `maxStallMs`, or a pose
 * reacquired after `maxLossMs` without one, when the person in view may not be the one whose
 * lengths and filters the pipeline holds. `reject` drops the sample before anything reads it.
 */
export type Admission =
  | { readonly kind: "continue" }
  | { readonly kind: "restart"; readonly reason: RestartReason }
  | { readonly kind: "reject"; readonly reason: RejectReason };

export type RestartReason = "new-session" | "stall" | "reacquired";
export type RejectReason = "non-finite-time" | "not-increasing" | "stale-session";

export interface IngestOptions {
  /** A gap between two samples of one session longer than this restarts the subject. */
  readonly maxStallMs: number;
  /** A pose arriving this long after the last pose (or the session's start) restarts it. */
  readonly maxLossMs: number;
}

/**
 * One second without a sample is a suspended tab or a stalled camera, longer than any coast. Two
 * seconds without a pose is longer than the filler's coast and the replay's half-second masks, so a
 * person who walked out and back in starts over rather than inheriting the earlier lengths.
 */
export const DEFAULT_INGEST: IngestOptions = Object.freeze({ maxStallMs: 1000, maxLossMs: 2000 });

export interface IngestGate {
  /** Decides one sample; `posed` says whether it carries a pose at all. */
  admit(sample: SessionSample, posed: boolean): Admission;
}

const CONTINUE: Admission = Object.freeze({ kind: "continue" });

/**
 * The one owner of "may this sample enter the pipeline, and does it start a new subject". Time must
 * be finite and strictly increasing within a session, so a duplicate or out-of-order result is
 * dropped rather than read as zero elapsed or negative time by every filter. A sample from an older
 * session than the one being fed is dropped too. Every rule reads the sample's own `tMs` and stamps,
 * never a wall clock, so a replayed stream is admitted identically.
 */
export function createIngestGate(options: IngestOptions = DEFAULT_INGEST): IngestGate {
  for (const value of [options.maxStallMs, options.maxLossMs])
    if (!(Number.isFinite(value) && value > 0))
      throw new Error("Ingest maxStallMs and maxLossMs must be finite and positive.");
  let state: { session: number; lastMs: number; lastPoseMs: number } | undefined;
  return {
    admit(sample, posed) {
      const { tMs, session } = sample;
      if (!Number.isFinite(tMs)) return reject("non-finite-time");
      if (state === undefined || session > state.session) {
        state = { session, lastMs: tMs, lastPoseMs: tMs };
        return restart("new-session");
      }
      if (session < state.session) return reject("stale-session");
      if (tMs <= state.lastMs) return reject("not-increasing");
      const stalled = tMs - state.lastMs > options.maxStallMs;
      const reacquired = posed && tMs - state.lastPoseMs > options.maxLossMs;
      state.lastMs = tMs;
      if (posed || stalled) state.lastPoseMs = tMs;
      if (stalled) return restart("stall");
      return reacquired ? restart("reacquired") : CONTINUE;
    },
  };
}

function reject(reason: RejectReason): Admission {
  return { kind: "reject", reason };
}

function restart(reason: RestartReason): Admission {
  return { kind: "restart", reason };
}

/** The page's tally of what the gate did, one counter per answer, for the readout. */
export interface IngestTally {
  readonly accepted: number;
  readonly restarts: number;
  readonly rejected: number;
}

export function tally(previous: IngestTally, admission: Admission): IngestTally {
  switch (admission.kind) {
    case "continue":
      return { ...previous, accepted: previous.accepted + 1 };
    case "restart":
      return { ...previous, accepted: previous.accepted + 1, restarts: previous.restarts + 1 };
    case "reject":
      return { ...previous, rejected: previous.rejected + 1 };
    default:
      return unreachable(admission, "admission");
  }
}

export const EMPTY_TALLY: IngestTally = Object.freeze({ accepted: 0, restarts: 0, rejected: 0 });
