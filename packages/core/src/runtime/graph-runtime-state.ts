import type { GraphIR } from "../graph/ir";
import type { PublisherSnapshot } from "./graph-publisher";

/**
 * Whether a follow-up drain is booked with the scheduler.
 *
 * A field of the live phases rather than a phase beside them, and that is the one genuinely new
 * distinction issue #376 asked to decide rather than inherit. A booking is made from inside the
 * reentrancy answer, so a runtime that is flushing and carries one is the ordinary case
 * `scheduler-reentrancy` drives; a `draining` phase beside `flushing` would make that pair
 * unrepresentable and force the two of them to be wrong about each other. See ADR-083.
 */
export type DrainBooking = "unbooked" | "booked";

interface IdlePhase {
  readonly kind: "idle";
  readonly drain: DrainBooking;
}

interface FlushingPhase {
  readonly kind: "flushing";
  readonly drain: DrainBooking;
}

interface DisposedPhase {
  readonly kind: "disposed";
}

/**
 * The lifecycle of one `GraphRuntime`, as one value.
 *
 * Three independent booleans encoded this until issue #376: `#disposed`, `#flushing` and
 * `#scheduledDrain`, each written in more than one place, so the lifecycle was a property a reader
 * reconstructed from the writes rather than a value the class held. Two of their eight combinations
 * meant nothing, a disposed runtime mid-flush and a disposed runtime owing the scheduler a drain,
 * and the second was kept unreached by a hand-written clear in `dispose` rather than by being
 * impossible to write down.
 *
 * Every combination this union can hold means something: an idle runtime with and without a booked
 * follow-up, and a flushing one with and without, which is the pair a reentrant deferral creates.
 * `disposed` is terminal and carries nothing, so both illegal combinations are gone rather than
 * avoided. See ADR-083.
 */
export type RuntimePhase = IdlePhase | FlushingPhase | DisposedPhase;

// Interned, so a transition is a lookup rather than an allocation, and so identity is stable enough
// to enumerate the reachable state space in a test. The four live values are reachable only through
// the transitions below, which keeps this module the one owner of what a legal phase is.
const IDLE_UNBOOKED = Object.freeze<IdlePhase>({ kind: "idle", drain: "unbooked" });
const IDLE_BOOKED = Object.freeze<IdlePhase>({ kind: "idle", drain: "booked" });
const FLUSHING_UNBOOKED = Object.freeze<FlushingPhase>({ kind: "flushing", drain: "unbooked" });
const FLUSHING_BOOKED = Object.freeze<FlushingPhase>({ kind: "flushing", drain: "booked" });

/** The phase a runtime starts in: live, publishing nothing, and owing the scheduler nothing. */
export const IDLE: RuntimePhase = IDLE_UNBOOKED;

/** The one terminal phase, and it carries nothing. That is what retires two hand-written clears. */
export const DISPOSED: RuntimePhase = Object.freeze<DisposedPhase>({ kind: "disposed" });

/** Answers whether this runtime is retired, for every reader that has to ask. */
export function isDisposed(phase: RuntimePhase): boolean {
  return phase.kind === "disposed";
}

/** Answers whether subscribers are being notified, which is the reentrancy question. */
export function isFlushing(phase: RuntimePhase): boolean {
  return phase.kind === "flushing";
}

/**
 * Answers the phase a publication opens, carrying whatever booking the caller already had.
 *
 * Total, and disposal is terminal: a subscriber that disposed the runtime mid-flush leaves it
 * disposed rather than pushing it back through a live phase.
 */
export function beginFlush(phase: RuntimePhase): RuntimePhase {
  if (phase.kind === "disposed") return phase;
  return phase.drain === "booked" ? FLUSHING_BOOKED : FLUSHING_UNBOOKED;
}

/** Answers the phase a publication closes into, keeping the booking and the terminal state. */
export function endFlush(phase: RuntimePhase): RuntimePhase {
  if (phase.kind === "disposed") return phase;
  return phase.drain === "booked" ? IDLE_BOOKED : IDLE_UNBOOKED;
}

/**
 * Answers the phase that carries a booked drain, or `undefined` when there is nothing to book.
 *
 * One question with one answer, rather than a conjunction each caller re-asks. `undefined` means a
 * disposed runtime, which has no follow-up to run, or a phase that already carries a booking, since
 * a second job for one drain is the coalescing `scheduler-reentrancy` measures. A transition rather
 * than a boolean, for the reason `GraphRuntime.#deferIfFlushing` hands back a batch: two callers
 * that had to ask and then act could act differently.
 */
export function bookingDrain(phase: RuntimePhase): RuntimePhase | undefined {
  if (phase.kind === "disposed" || phase.drain === "booked") return undefined;
  return phase.kind === "flushing" ? FLUSHING_BOOKED : IDLE_BOOKED;
}

/** Releases a booking, keeping the phase it was carried by. Total, and terminal-safe. */
export function unbookDrain(phase: RuntimePhase): RuntimePhase {
  if (phase.kind === "disposed") return phase;
  return phase.kind === "flushing" ? FLUSHING_UNBOOKED : IDLE_UNBOOKED;
}

interface ColdMemo {
  readonly kind: "cold";
}

interface WarmMemo {
  readonly kind: "warm";
  readonly snapshot: PublisherSnapshot;
  readonly graph: GraphIR;
  readonly membersRevision: number;
}

/**
 * The memoised publisher snapshot and the whole of the key it is answered by.
 *
 * Three fields spread this until issue #376, with `-1` as the sentinel for cold, and the parts came
 * apart: `replaceGraph` cleared the snapshot and the graph and left the membership revision behind.
 * That stayed harmless only because warmth also needed the value, so the stale key was never read;
 * a memo whose key can be half-cleared is the shape ADR-058 refuses one layer up, and being
 * unreached is not the same as being impossible.
 *
 * The value and its whole key now arrive together and leave together, so cold is a discriminant
 * rather than a sentinel and there is no half-warm state to write. See ADR-083.
 */
export type SnapshotMemo = ColdMemo | WarmMemo;

/** No snapshot and no key. The initial memo, and the one `replaceGraph` and `dispose` assign. */
export const COLD_MEMO: SnapshotMemo = Object.freeze<ColdMemo>({ kind: "cold" });

/** Answers a warm memo. Every part of the key is required, so a partial one cannot be built. */
export function warmMemo(
  snapshot: PublisherSnapshot,
  graph: GraphIR,
  membersRevision: number,
): SnapshotMemo {
  return Object.freeze<WarmMemo>({ kind: "warm", snapshot, graph, membersRevision });
}

/**
 * Answers the memoised snapshot for `graph` at `membersRevision`, or `undefined` on a miss.
 *
 * The graph is compared by identity because every part of a snapshot except membership is a pure
 * function of that identity, and membership moves without it, which is why the revision is the
 * second half of the key rather than a second memo. See ADR-058.
 */
export function memoHit(
  memo: SnapshotMemo,
  graph: GraphIR,
  membersRevision: number,
): PublisherSnapshot | undefined {
  if (memo.kind === "cold") return undefined;
  if (memo.graph !== graph || memo.membersRevision !== membersRevision) return undefined;
  return memo.snapshot;
}
