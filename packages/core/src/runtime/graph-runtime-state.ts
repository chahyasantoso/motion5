import type { GraphIR } from "../graph/ir";
import type { PublisherSnapshot } from "./graph-publisher";
import { unreachable } from "../lang/exhaustive";
import { namedSeeds, type DeferredSeeds } from "./report";

/** Whether a follow-up drain is booked with the scheduler. */
export type DrainBooking = "unbooked" | "booked";

declare const PHASE_BRAND: unique symbol;
declare const MEMO_BRAND: unique symbol;

/** Brand keeping a union closed and discriminated; never exported or assigned. */
interface PhaseBrand {
  readonly [PHASE_BRAND]: true;
}

interface MemoBrand {
  readonly [MEMO_BRAND]: true;
}

/** Mints a phase; sole producer of a `RuntimePhase`. */
function mintPhase<Shape extends { readonly kind: string }>(shape: Shape): Shape & PhaseBrand {
  return Object.freeze(shape) as unknown as Shape & PhaseBrand;
}

/** Mints a memo; sole producer of a `SnapshotMemo`. */
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

/** One `GraphRuntime` lifecycle: a live kind with or without booked drain, or `disposed`. */
export type RuntimePhase = IdlePhase | FlushingPhase | DisposingPhase | DisposedPhase;

// Interned; reachable only via transitions below.
const IDLE_UNBOOKED = mintPhase<IdleShape>({ kind: "idle", drain: "unbooked" });
const IDLE_BOOKED = mintPhase<IdleShape>({ kind: "idle", drain: "booked" });
const FLUSHING_UNBOOKED = mintPhase<FlushingShape>({ kind: "flushing", drain: "unbooked" });
const FLUSHING_BOOKED = mintPhase<FlushingShape>({ kind: "flushing", drain: "booked" });
const DISPOSING_UNBOOKED = mintPhase<DisposingShape>({ kind: "disposing", drain: "unbooked" });
const DISPOSING_BOOKED = mintPhase<DisposingShape>({ kind: "disposing", drain: "booked" });

// Two live-phase axes as one table, keyed by transition axis.
const PHASES = {
  idle: { unbooked: IDLE_UNBOOKED, booked: IDLE_BOOKED },
  flushing: { unbooked: FLUSHING_UNBOOKED, booked: FLUSHING_BOOKED },
  disposing: { unbooked: DISPOSING_UNBOOKED, booked: DISPOSING_BOOKED },
} as const;

/** Start phase: live, owing the scheduler nothing. */
export const IDLE: RuntimePhase = IDLE_UNBOOKED;

/** Sole terminal phase; carries nothing. */
export const DISPOSED: RuntimePhase = mintPhase<DisposedShape>({ kind: "disposed" });

/** Whether this runtime is retired. */
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

/** Retiring phase; keeps its booking; idempotent, never lowered. */
export function retiring(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.disposing[phase.drain];
    // Nothing lowers this phase once raised.
    case "disposing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Whether teardown has begun; makes `dispose` run exactly once. */
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

/** Whether subscribers are notified; the reentrancy question. */
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

/** Sink a phase may hand a diagnostic to; none once retirement finishes. */
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

/** Phase a publication opens; keeps booking; terminal stays terminal. */
export function beginFlush(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.flushing[phase.drain];
    // Retirement is terminal: torn-down runtime never returns to a live phase.
    case "disposing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Phase a publication closes into; keeps booking and terminal state. */
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

/** Phase carrying a booked drain; `undefined` when nothing to book. */
export function bookingDrain(phase: RuntimePhase): RuntimePhase | undefined {
  switch (phase.kind) {
    // Already booked: nothing to book; one drain, one job.
    case "idle":
    case "flushing":
      return phase.drain === "booked" ? undefined : PHASES[phase.kind].booked;
    // Retiring runtime has no follow-up to run.
    case "disposing":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/** Releases a booking, keeps the phase; total, terminal-safe. */
export function unbookDrain(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    // Lowered in place: a retiring runtime stays retiring.
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

/** Memoised snapshot with whole lookup key; cold is a variant. */
export type SnapshotMemo = ColdMemo | WarmMemo;

/** No snapshot, no key: initial memo, also assigned by reset. */
export const COLD_MEMO: SnapshotMemo = mintMemo<ColdShape>({ kind: "cold" });

/** Warm memo; whole key required, so no partial memo. */
export function warmMemo(
  snapshot: PublisherSnapshot,
  graph: GraphIR,
  membersRevision: number,
): SnapshotMemo {
  return mintMemo<WarmShape>({ kind: "warm", snapshot, graph, membersRevision });
}

/** Memoised snapshot for `graph` at `membersRevision`; `undefined` on miss. */
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

/** Brand keeping `PendingPublication` closed and discriminated. */
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

/** Reentrant deferral: nothing, or a publication with seeds and optional frame. */
export type PendingPublication = NothingPending | DeferredPublication;

/** Mints a payload; sole producer of a pending one. */
function mintPending<Shape extends { readonly kind: string }>(shape: Shape): Shape & PendingBrand {
  return Object.freeze(shape) as unknown as Shape & PendingBrand;
}

/** Nothing deferred; no collection, not a shared empty one. */
export const NOTHING_PENDING: PendingPublication = mintPending<NothingPendingShape>({
  kind: "nothing",
});

/** Adds `seeds` and `tick` to pending; keeps later frame, mints fresh set. */
export function deferring(
  pending: PendingPublication,
  seeds: readonly string[],
  tick: number | undefined,
): PendingPublication {
  const carried = deferredTick(pending);
  const merged = new Set(deferredSeeds(pending));
  for (const seed of seeds) merged.add(seed);
  const frame = tick === undefined ? carried : Math.max(carried ?? tick, tick);
  // Nothing asked: nothing deferred.
  if (merged.size === 0 && frame === undefined) return NOTHING_PENDING;
  return mintPending<DeferredShape>({ kind: "deferred", seeds: merged, tick: frame });
}

/** Whether anything is deferred; the discriminant alone. */
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

/** Seeds a deferral carries, or none; always a copy, set never leaves module. */
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

/** Frame a deferral carries; `undefined` if none named or nothing deferred. */
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

/** What a deferral owes: nothing, named seeds, or frame with no seeds. */
export type DeferredWork =
  | { readonly kind: "nothing" }
  | { readonly kind: "seeds"; readonly seeds: DeferredSeeds }
  | { readonly kind: "frame"; readonly tick: number };

/** What `pending` owes; total over both variants. */
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

/** What a publication at `reached` keeps: only a frame not yet reached. */
export function retaining(pending: PendingPublication, reached: number): PendingPublication {
  const tick = deferredTick(pending);
  if (tick === undefined || tick <= reached) return NOTHING_PENDING;
  return mintPending<DeferredShape>({ kind: "deferred", seeds: new Set<string>(), tick });
}

/** Re-books a failed publication's seeds and drain leftovers; nothing once disposed. */
export function requeuing(
  phase: RuntimePhase,
  pending: PendingPublication,
  seeds: readonly string[],
): PendingPublication {
  if (isDisposed(phase)) return NOTHING_PENDING;
  return deferring(pending, seeds, undefined);
}
