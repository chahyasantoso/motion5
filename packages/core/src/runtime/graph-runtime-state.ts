import type { GraphIR } from "../graph/ir";
import type { PublisherSnapshot } from "./graph-publisher";
import { unreachable } from "../lang/exhaustive";
import { namedSeeds, type DeferredSeeds } from "./report";

/** Whether a follow-up drain is booked with the scheduler. */
export type DrainBooking = "unbooked" | "booked";

declare const PHASE_BRAND: unique symbol;
declare const MEMO_BRAND: unique symbol;

/** Mint marks that keep a union closed as well as discriminated; never exported or assigned. */
interface PhaseBrand {
  readonly [PHASE_BRAND]: true;
}

interface MemoBrand {
  readonly [MEMO_BRAND]: true;
}

/** Mints one phase, the only expression that produces a `RuntimePhase`. */
function mintPhase<Shape extends { readonly kind: string }>(shape: Shape): Shape & PhaseBrand {
  return Object.freeze(shape) as unknown as Shape & PhaseBrand;
}

/** Mints one memo, the only expression that produces a `SnapshotMemo`. */
function mintMemo<Shape extends { readonly kind: string }>(shape: Shape): Shape & MemoBrand {
  return Object.freeze(shape) as unknown as Shape & MemoBrand;
}

interface IdleShape {
  readonly kind: "idle";
  readonly drain: DrainBooking;
}

interface FlushingShape {
  readonly kind: "flushing";
  readonly drain: DrainBooking;
}

interface DisposingShape {
  readonly kind: "disposing";
  readonly drain: DrainBooking;
}

interface DisposedShape {
  readonly kind: "disposed";
}

type IdlePhase = IdleShape & PhaseBrand;
type FlushingPhase = FlushingShape & PhaseBrand;
type DisposingPhase = DisposingShape & PhaseBrand;
type DisposedPhase = DisposedShape & PhaseBrand;

/** The lifecycle of one `GraphRuntime`: a live kind with or without a booked drain, or `disposed`. */
export type RuntimePhase = IdlePhase | FlushingPhase | DisposingPhase | DisposedPhase;

// Interned and reachable only through the transitions below.
const IDLE_UNBOOKED = mintPhase<IdleShape>({ kind: "idle", drain: "unbooked" });
const IDLE_BOOKED = mintPhase<IdleShape>({ kind: "idle", drain: "booked" });
const FLUSHING_UNBOOKED = mintPhase<FlushingShape>({ kind: "flushing", drain: "unbooked" });
const FLUSHING_BOOKED = mintPhase<FlushingShape>({ kind: "flushing", drain: "booked" });
const DISPOSING_UNBOOKED = mintPhase<DisposingShape>({ kind: "disposing", drain: "unbooked" });
const DISPOSING_BOOKED = mintPhase<DisposingShape>({ kind: "disposing", drain: "booked" });

// The two axes of a live phase as one table, indexed by the axis a transition carries.
const PHASES = {
  idle: { unbooked: IDLE_UNBOOKED, booked: IDLE_BOOKED },
  flushing: { unbooked: FLUSHING_UNBOOKED, booked: FLUSHING_BOOKED },
  disposing: { unbooked: DISPOSING_UNBOOKED, booked: DISPOSING_BOOKED },
} as const;

/** The phase a runtime starts in: live and owing the scheduler nothing. */
export const IDLE: RuntimePhase = IDLE_UNBOOKED;

/** The one terminal phase, and it carries nothing. */
export const DISPOSED: RuntimePhase = mintPhase<DisposedShape>({ kind: "disposed" });

/** Answers whether this runtime is retired. */
export function isDisposed(phase: RuntimePhase): boolean {
  switch (phase.kind) {
    case "idle":
    case "flushing":
    case "disposing":
      return false;
    case "disposed":
      return true;
    default:
      return unreachable(phase);
  }
}

/** The phase of a runtime being retired, keeping its booking; idempotent, never lowered. */
export function retiring(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.disposing[phase.drain];
    // Nothing may lower this phase once it is raised.
    case "disposing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Answers whether teardown has begun, which is how `dispose` runs exactly once. */
export function isRetiring(phase: RuntimePhase): boolean {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return false;
    case "disposing":
    case "disposed":
      return true;
    default:
      return unreachable(phase);
  }
}

/** Answers whether subscribers are being notified, which is the reentrancy question. */
export function isFlushing(phase: RuntimePhase): boolean {
  switch (phase.kind) {
    case "flushing":
      return true;
    case "idle":
    case "disposing":
    case "disposed":
      return false;
    default:
      return unreachable(phase);
  }
}

/** Answers the sink a phase may hand a diagnostic to, and none once retirement has finished. */
export function reportSink<Sink>(phase: RuntimePhase, sink: Sink | undefined): Sink | undefined {
  switch (phase.kind) {
    case "idle":
    case "flushing":
    case "disposing":
      return sink;
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/** Answers the phase a publication opens, keeping its booking; a terminal phase stays terminal. */
export function beginFlush(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.flushing[phase.drain];
    // Retiring is terminal here too: nothing walks a torn-down runtime back into a live phase.
    case "disposing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Answers the phase a publication closes into, keeping the booking and the terminal state. */
export function endFlush(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.idle[phase.drain];
    case "disposing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Answers the phase carrying a booked drain, or `undefined` when there is nothing to book. */
export function bookingDrain(phase: RuntimePhase): RuntimePhase | undefined {
  switch (phase.kind) {
    // A booking already carried is nothing to book: one drain gets one job.
    case "idle":
    case "flushing":
      return phase.drain === "booked" ? undefined : PHASES[phase.kind].booked;
    // A runtime being retired has no follow-up to run either.
    case "disposing":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/** Releases a booking and keeps the phase carrying it. Total, and terminal-safe. */
export function unbookDrain(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    // Lowered in place, so a runtime that is retiring stays retiring.
    case "idle":
    case "flushing":
    case "disposing":
      return PHASES[phase.kind].unbooked;
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

interface ColdShape {
  readonly kind: "cold";
}

interface WarmShape {
  readonly kind: "warm";
  readonly snapshot: PublisherSnapshot;
  readonly graph: GraphIR;
  readonly membersRevision: number;
}

type ColdMemo = ColdShape & MemoBrand;
type WarmMemo = WarmShape & MemoBrand;

/** A memoised snapshot with the whole key it is answered by, so cold is a variant. */
export type SnapshotMemo = ColdMemo | WarmMemo;

/** No snapshot and no key: the initial memo, and the one a reset assigns. */
export const COLD_MEMO: SnapshotMemo = mintMemo<ColdShape>({ kind: "cold" });

/** Answers a warm memo, whose whole key is required, so a partial one cannot be built. */
export function warmMemo(
  snapshot: PublisherSnapshot,
  graph: GraphIR,
  membersRevision: number,
): SnapshotMemo {
  return mintMemo<WarmShape>({ kind: "warm", snapshot, graph, membersRevision });
}

/** Answers the memoised snapshot for `graph` at `membersRevision`, or `undefined` on a miss. */
export function memoHit(
  memo: SnapshotMemo,
  graph: GraphIR,
  membersRevision: number,
): PublisherSnapshot | undefined {
  switch (memo.kind) {
    case "cold":
      return undefined;
    case "warm":
      if (memo.graph !== graph || memo.membersRevision !== membersRevision) return undefined;
      return memo.snapshot;
    default:
      return unreachable(memo);
  }
}

declare const PENDING_BRAND: unique symbol;

/** The mint mark that keeps `PendingPublication` closed as well as discriminated. */
interface PendingBrand {
  readonly [PENDING_BRAND]: true;
}

interface NothingPendingShape {
  readonly kind: "nothing";
}

interface DeferredShape {
  readonly kind: "deferred";
  readonly seeds: ReadonlySet<string>;
  readonly tick: number | undefined;
}

type NothingPending = NothingPendingShape & PendingBrand;
type DeferredPublication = DeferredShape & PendingBrand;

/** What a reentrant call deferred: nothing at all, or a publication owed with its seeds and frame. */
export type PendingPublication = NothingPending | DeferredPublication;

/** Mints one payload, the only expression that produces a pending one. */
function mintPending<Shape extends { readonly kind: string }>(shape: Shape): Shape & PendingBrand {
  return Object.freeze(shape) as unknown as Shape & PendingBrand;
}

/** Nothing deferred, carrying no collection rather than an empty one to share. */
export const NOTHING_PENDING: PendingPublication = mintPending<NothingPendingShape>({
  kind: "nothing",
});

/** Adds `seeds` and `tick` to what is pending, keeping the later frame and minting a fresh set. */
export function deferring(
  pending: PendingPublication,
  seeds: readonly string[],
  tick: number | undefined,
): PendingPublication {
  const carried = deferredTick(pending);
  const merged = new Set(deferredSeeds(pending));
  for (const seed of seeds) merged.add(seed);
  const frame = tick === undefined ? carried : Math.max(carried ?? tick, tick);
  // Nothing asked for is nothing deferred.
  if (merged.size === 0 && frame === undefined) return NOTHING_PENDING;
  return mintPending<DeferredShape>({ kind: "deferred", seeds: merged, tick: frame });
}

/** Answers whether anything is deferred, which is the discriminant and nothing else. */
export function isPending(pending: PendingPublication): boolean {
  switch (pending.kind) {
    case "nothing":
      return false;
    case "deferred":
      return true;
    default:
      return unreachable(pending);
  }
}

/** The seeds a deferral carries, or none, always as a copy so the set never leaves this module. */
export function deferredSeeds(pending: PendingPublication): readonly string[] {
  switch (pending.kind) {
    case "nothing":
      return [];
    case "deferred":
      return [...pending.seeds];
    default:
      return unreachable(pending);
  }
}

/** The frame a deferral carries, or `undefined` when it named none or nothing is deferred. */
export function deferredTick(pending: PendingPublication): number | undefined {
  switch (pending.kind) {
    case "nothing":
      return undefined;
    case "deferred":
      return pending.tick;
    default:
      return unreachable(pending);
  }
}

/** What a deferral owes: nothing, the seeds it named, or the frame it carried with no seeds. */
export type DeferredWork =
  | { readonly kind: "nothing" }
  | { readonly kind: "seeds"; readonly seeds: DeferredSeeds }
  | { readonly kind: "frame"; readonly tick: number };

/** Answers what `pending` owes, total over both of its variants. */
export function deferredWork(pending: PendingPublication): DeferredWork {
  switch (pending.kind) {
    case "nothing":
      return { kind: "nothing" };
    case "deferred": {
      const seeds = namedSeeds(deferredSeeds(pending));
      if (seeds !== undefined) return { kind: "seeds", seeds };
      const tick = pending.tick;
      return tick === undefined ? { kind: "nothing" } : { kind: "frame", tick };
    }
    default:
      return unreachable(pending);
  }
}

/** What a publication reaching `reached` keeps of its payload: only a frame it has not reached. */
export function retaining(pending: PendingPublication, reached: number): PendingPublication {
  const tick = deferredTick(pending);
  if (tick === undefined || tick <= reached) return NOTHING_PENDING;
  return mintPending<DeferredShape>({ kind: "deferred", seeds: new Set<string>(), tick });
}

/** The payload a failed publication leaves: its seeds re-deferred, or nothing once retired. */
/** Re-books what a drain left pending, and re-books nothing once the runtime is disposed. */
export function requeuing(
  phase: RuntimePhase,
  pending: PendingPublication,
  seeds: readonly string[],
): PendingPublication {
  if (isDisposed(phase)) return NOTHING_PENDING;
  return deferring(pending, seeds, undefined);
}
