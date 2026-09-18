import type { GraphIR } from "../graph/ir";
import type { PublisherSnapshot } from "./graph-publisher";
import { unreachable } from "../domain/exhaustive";

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

declare const PHASE_BRAND: unique symbol;
declare const MEMO_BRAND: unique symbol;

/**
 * The mint marks that keep the two unions below closed as well as discriminated.
 *
 * A variant declaring only its discriminant is not closed. TypeScript's excess-property check reads
 * a fresh object literal and not a value arriving through a variable, so a disposed phase carrying
 * a booking was assignable to `RuntimePhase` through one intermediate const, and a cold memo
 * carrying half a key was assignable to `SnapshotMemo` the same way. Neither was reachable, since
 * both fields are private and every write goes through a transition below, but ADR-083 claims those
 * combinations are unrepresentable rather than unreached and that is a claim about the type. These
 * symbols are declared, never exported and never assigned at runtime, so no other module can name
 * the key and no property exists to carry. Issue #387, and see ADR-084.
 */
interface PhaseBrand {
  readonly [PHASE_BRAND]: true;
}

interface MemoBrand {
  readonly [MEMO_BRAND]: true;
}

/** Mints one phase, and is the only expression in the program that produces a `RuntimePhase`. */
function mintPhase<Shape extends { readonly kind: string }>(shape: Shape): Shape & PhaseBrand {
  return Object.freeze(shape) as unknown as Shape & PhaseBrand;
}

/** Mints one memo, and is the only expression in the program that produces a `SnapshotMemo`. */
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
export type RuntimePhase = IdlePhase | FlushingPhase | DisposingPhase | DisposedPhase;

// Interned, so a transition is a lookup rather than an allocation, and so identity is stable enough
// to enumerate the reachable state space in a test. The four live values are reachable only through
// the transitions below, which keeps this module the one owner of what a legal phase is.
const IDLE_UNBOOKED = mintPhase<IdleShape>({ kind: "idle", drain: "unbooked" });
const IDLE_BOOKED = mintPhase<IdleShape>({ kind: "idle", drain: "booked" });
const FLUSHING_UNBOOKED = mintPhase<FlushingShape>({ kind: "flushing", drain: "unbooked" });
const FLUSHING_BOOKED = mintPhase<FlushingShape>({ kind: "flushing", drain: "booked" });
const DISPOSING_UNBOOKED = mintPhase<DisposingShape>({ kind: "disposing", drain: "unbooked" });
const DISPOSING_BOOKED = mintPhase<DisposingShape>({ kind: "disposing", drain: "booked" });

/**
 * The two axes of a live phase as the table they always were, so a transition is a lookup.
 *
 * `kind` and `drain` are independent, and every transition below moves one while carrying the other,
 * which is why each of them used to end in a ternary on the axis it was carrying: `retiring`,
 * `beginFlush` and `endFlush` read `phase.drain === "booked" ? X_BOOKED : X_UNBOOKED`, and
 * `bookingDrain` and `unbookDrain` read `phase.kind === "flushing" ? FLUSHING_X : IDLE_X`. Read that
 * way the table was six constants and five ternaries the reader reassembled, three on one axis and
 * two on the other, and the answer for `idle` was whatever the last arm fell through to. Stated once
 * here, indexed by the axis being carried, it is the thing the switches below select a row of. Issue
 * #437, its follow-up #441, and see ADR-092.
 */
const PHASES = {
  idle: { unbooked: IDLE_UNBOOKED, booked: IDLE_BOOKED },
  flushing: { unbooked: FLUSHING_UNBOOKED, booked: FLUSHING_BOOKED },
  disposing: { unbooked: DISPOSING_UNBOOKED, booked: DISPOSING_BOOKED },
} as const;

/** The phase a runtime starts in: live, publishing nothing, and owing the scheduler nothing. */
export const IDLE: RuntimePhase = IDLE_UNBOOKED;

/** The one terminal phase, and it carries nothing. That is what retires two hand-written clears. */
export const DISPOSED: RuntimePhase = mintPhase<DisposedShape>({ kind: "disposed" });

/** Answers whether this runtime is retired, for every reader that has to ask. */
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

/**
 * Answers the phase a runtime is in while it is being retired, carrying whatever booking it had.
 *
 * The member issue #408 asked for. `dispose` guarded on completed disposal and then called host
 * code, `Cancel.cancel`, before the phase went terminal, so a cancel that re-entered `dispose` found
 * a live runtime and ran the whole teardown a second time: a second `unsubscribe`, which the `Clock`
 * contract does not promise is idempotent, and a second registry disposal. A flag beside the phase
 * would answer it, and a member of the union is how ADR-083 already answers this kind of question,
 * so the state a runtime is in while retiring is a state it can be in. See ADR-090.
 *
 * Idempotent, so a reentrant `dispose` cannot raise it twice, and terminal disposal is left alone.
 */
export function retiring(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.disposing[phase.drain];
    // Idempotent, and terminal disposal is left alone: raising this twice is what a reentrant
    // `dispose` would do, and lowering it is what nothing may do.
    case "disposing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/**
 * Answers whether teardown has begun, which is the question `dispose` asks to run exactly once.
 *
 * Distinct from `isDisposed` on purpose, and that distinction is what keeps ADR-088's decision six
 * intact: a runtime being retired still reports the port that refused to cancel, because that
 * failure is the last thing it knows and it is still the object that knows it. Only a runtime that
 * has finished retiring reports nothing new. See ADR-090.
 */
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

/**
 * Answers the sink a phase may hand a diagnostic to, which is none once retirement has finished.
 *
 * A member of this module rather than a ternary at the boundary, and it was the last read of this union
 * standing outside a switch: `isDisposed(phase) ? undefined : sink` sat beside `#report`'s delegation,
 * so a phase added later inherited delivery from whichever side of that ternary it fell on instead of
 * owing a decision here. Retention is a different question and stays one: recording what happened is
 * observation, so a retired runtime still answers whoever asks and hands a host nothing.
 *
 * Generic in the sink, because which type a host's callback has is not this module's business, and it
 * keeps the phase the only thing being read. Issue #443, phase B step 12, and see ADR-090 and ADR-091.
 */
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

/**
 * Answers the phase a publication opens, carrying whatever booking the caller already had.
 *
 * Total, and disposal is terminal: a subscriber that disposed the runtime mid-flush leaves it
 * disposed rather than pushing it back through a live phase.
 */
export function beginFlush(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    case "idle":
    case "flushing":
      return PHASES.flushing[phase.drain];
    // Retiring is terminal for this transition as well, so nothing walks a runtime being torn down
    // back into a live phase. Issue #408, and see ADR-090.
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
  switch (phase.kind) {
    // A phase already carrying a booking has nothing to book, which is the coalescing
    // `scheduler-reentrancy` measures: a second job for one drain. The ternary that asks it is that
    // guard, promoted from an `if` when this table landed, rather than a drain ternary the table
    // failed to remove. Issue #441.
    case "idle":
    case "flushing":
      return phase.drain === "booked" ? undefined : PHASES[phase.kind].booked;
    // A runtime being retired has no follow-up to run either, and for the same reason a retired one
    // has none: the teardown below it is what that drain would publish over. Issue #408.
    case "disposing":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/** Releases a booking, keeping the phase it was carried by. Total, and terminal-safe. */
export function unbookDrain(phase: RuntimePhase): RuntimePhase {
  switch (phase.kind) {
    // Lowered in place rather than resolved to a live phase, because a runtime that is retiring
    // stays retiring: this is the transition `dispose` itself runs, and it must not undo the one
    // above it. Three kinds carry a booking, so three kinds release one the same way.
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
export const COLD_MEMO: SnapshotMemo = mintMemo<ColdShape>({ kind: "cold" });

/** Answers a warm memo. Every part of the key is required, so a partial one cannot be built. */
export function warmMemo(
  snapshot: PublisherSnapshot,
  graph: GraphIR,
  membersRevision: number,
): SnapshotMemo {
  return mintMemo<WarmShape>({ kind: "warm", snapshot, graph, membersRevision });
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

/**
 * The mint mark that keeps the payload union below closed as well as discriminated.
 *
 * The same device the two unions above use, for the reason issue #387 gave: a variant declaring
 * only its discriminant is not closed, because TypeScript's excess-property check reads a fresh
 * object literal and not a value arriving through a variable. Declared, never exported and never
 * assigned at runtime, so no other module can name the key and no property exists to carry.
 */
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

/**
 * What a reentrant call deferred, as one closed value: nothing at all, or a publication that is
 * owed.
 *
 * A bare seed set held this until issue #380, which dropped the frame a deferred `flushAtTick`
 * arrived with. The two then travelled together in one interface, and issue #392 is that this was
 * still half a decision: liveness was the seed count alone, so a deferral carrying a frame and no
 * seeds stored a frame nothing would replay, while this tier's own empty-flush contract says an
 * empty seed list is a publication rather than a cheap no-op.
 *
 * So nothing pending is a variant rather than an empty instance of the other one, and two things
 * follow. There is no shared empty collection to hand out, which is issue #396: `NOTHING_PENDING`
 * cast one live `Set` through `ReadonlySet` and every runtime in the process held that object, so a
 * single caller that mutated it corrupted all of them. And a deferral is pending exactly when it
 * exists, so `isPending` reads the discriminant rather than a conjunction over two fields that
 * could disagree about the same question. See ADR-084 and ADR-088.
 */
export type PendingPublication = NothingPending | DeferredPublication;

/** Mints one payload, and is the only expression in the program that produces a pending one. */
function mintPending<Shape extends { readonly kind: string }>(shape: Shape): Shape & PendingBrand {
  return Object.freeze(shape) as unknown as Shape & PendingBrand;
}

/** Nothing deferred, carrying no collection at all rather than an empty one to share. */
export const NOTHING_PENDING: PendingPublication = mintPending<NothingPendingShape>({
  kind: "nothing",
});

/**
 * Answers the pending publication with `seeds` and `tick` added to it.
 *
 * The later of two frames wins, which is the rule issue #380 asks for when two deferred ticks
 * arrive inside one flush: a frame number only ever advances, so replaying the earlier of them
 * would be refused by the guard the deferral exists to preserve. A deferral carrying no frame
 * leaves whatever frame is already pending alone rather than erasing it, because `flush` cannot
 * name one and must not answer for one. A fresh set each time, so nothing holds the pending one.
 */
export function deferring(
  pending: PendingPublication,
  seeds: readonly string[],
  tick: number | undefined,
): PendingPublication {
  const carried = deferredTick(pending);
  const merged = new Set(deferredSeeds(pending));
  for (const seed of seeds) merged.add(seed);
  const frame = tick === undefined ? carried : Math.max(carried ?? tick, tick);
  // Nothing asked for is nothing deferred, so the empty answer is the variant that says so rather
  // than a deferral which exists and owes nothing. Issue #392.
  if (merged.size === 0 && frame === undefined) return NOTHING_PENDING;
  return mintPending<DeferredShape>({ kind: "deferred", seeds: merged, tick: frame });
}

/**
 * Answers whether anything is deferred, which is the discriminant and nothing else.
 *
 * The seed count was the whole question until issue #392, so a frame with no seeds behind it was
 * not pending work: a reentrant `flushAtTick([], tick)` stored a frame, booked a drain and answered
 * a deferred batch, and then the drain found nothing to do, the booked job was spent on nothing,
 * and the frame stayed stranded until some later publication cleared the payload. This tier states
 * that an empty seed list still derives the snapshot, moves the sequence and notifies every batch
 * subscriber, so a frame is work by itself and the drain replays it. See ADR-080 and ADR-088.
 */
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

/**
 * The seeds a deferral is carrying, or none, and always as a copy.
 *
 * The one reader of a payload's seed set, so the set itself never leaves this module. That is the
 * other half of issue #396: a collection nobody outside can reach is one nobody outside can
 * mutate, which a `ReadonlySet` type alone never promised at runtime.
 */
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

/** The frame a deferral is carrying, or `undefined` for a deferral that named none and for none. */
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

/**
 * Answers what a publication that reached frame `reached` leaves of the payload it just took.
 *
 * The seeds are taken whole, because the publication is about to state them. The frame is not, and
 * that is the half issue #392's decision creates rather than closes: a frame is pending work now,
 * and `flush` has no parameter to reach one with, so a live write that cleared the whole payload
 * would drop a frame it cannot publish. A frame this publication has already reached is nothing to
 * carry, which is the ordinary case of a drain replaying its own deferral through `flushAtTick`.
 * See ADR-082 and ADR-088.
 */
export function retaining(pending: PendingPublication, reached: number): PendingPublication {
  const tick = deferredTick(pending);
  if (tick === undefined || tick <= reached) return NOTHING_PENDING;
  return mintPending<DeferredShape>({ kind: "deferred", seeds: new Set<string>(), tick });
}

/**
 * Answers the payload a failed publication leaves behind, which is nothing once the runtime is
 * retired.
 *
 * Re-queueing the seeds a publication was carrying is what keeps a publisher failure from dropping
 * work, and it is right for as long as this runtime can still publish. Issue #401 is the case where
 * it cannot: snapshot derivation runs caller-supplied composition, caller code may dispose the
 * runtime and then throw, and the boundary then put the seeds back onto an object whose phase is
 * terminal and whose drain `bookingDrain` will decline forever. ADR-083's claim is that `disposed`
 * is terminal and carries nothing; this is the same claim about the payload beside the phase, which
 * is a field rather than a member of it. See ADR-088.
 */
export function requeuing(
  phase: RuntimePhase,
  pending: PendingPublication,
  seeds: readonly string[],
): PendingPublication {
  if (isDisposed(phase)) return NOTHING_PENDING;
  return deferring(pending, seeds, undefined);
}
