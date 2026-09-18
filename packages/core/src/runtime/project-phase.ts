import { unreachable } from "../domain/exhaustive";
import { refuse, type RefusalShape } from "./refusal";

/**
 * The lifecycle of one `ProjectRuntime` as one value, and the one answer to what it admits.
 *
 * Five fields encoded this: `#open` for an open structural recipe, `#valueSeeds` for an open value
 * batch, `#disposed`, `#inFlight` for the depth of a commit, and `#pendingTeardown` for a disposal
 * that arrived while one was running. Nothing stopped a reader from writing down a runtime that was
 * idle and owed a teardown, or one holding a staged document with no recipe open, and the
 * combinations that meant nothing were kept unreached by guards spread across a thousand-line class
 * rather than by the type. That is the argument that produced `RuntimePhase` for `GraphRuntime`,
 * with more fields and therefore more nonsense combinations. Issue #443, phase A step 3.
 *
 * Three departures from the shape issue #443 sketches, each because the runtime reaches a state the
 * sketch cannot hold.
 *
 * Its six flat variants make `batching` and `committing` alternatives. They co-occur: every write
 * inside `values(recipe)` enters `#boundary`, so a commit is in flight while a batch is open, and
 * that is the ordinary path rather than an edge case. So the depth of a commit is a field of the
 * live phases and not a phase beside them, which is the precedent `DrainBooking` already sets in
 * this folder.
 *
 * They also make `editing` and `batching` alternatives. A recipe opened inside a value batch is
 * admitted today, because `edit` guards on an open recipe and on liveness and on nothing else, and
 * it is refused later at commit by `value-batch-structural`. The reverse cannot happen, because
 * `values` is an immediate verb and an immediate verb is refused inside a recipe. So the open scope
 * is the closed set of the four combinations that are reachable, rather than the stack this looked
 * like at first: a stack would make a recipe inside a recipe representable, which is the one thing
 * `nested-recipe` exists to refuse.
 *
 * And disposal is the third axis rather than a pair of phases beside the rest. `dispose` is
 * reachable from caller code this runtime is in the middle of calling, so teardown can begin while
 * a scope is open and while commits are in flight, and until the outermost boundary returns, the
 * scope and the depth are still the facts the guards read: a value verb reached in that state is
 * refused today for the open recipe, not for the disposal. So whether teardown has begun is a field
 * of the live phases, `disposed` is the one terminal variant and carries nothing, and
 * `#pendingTeardown` stops being a field at all: it is `retiring` with a depth left to unwind. See
 * ADR-067, ADR-083 and ADR-092.
 */
declare const PHASE_BRAND: unique symbol;

/**
 * The mint mark that keeps the union below closed as well as discriminated.
 *
 * The device `graph-runtime-state.ts`, `refusal.ts` and `results.ts` already use, for the reason
 * issue #387 gave: a variant declaring only its discriminant is not closed, because TypeScript's
 * excess-property check reads a fresh object literal rather than a value arriving through a
 * variable, so a disposed phase carrying a staged document was assignable through one intermediate
 * const. Declared, never exported and never assigned at runtime, so no other module can name the
 * key and no property exists to carry. Issue #442 is settled as keeping this shipped style, so
 * step 3 does not wait on it. See ADR-084.
 */
interface PhaseBrand {
  readonly [PHASE_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & PhaseBrand;

/** Mints one phase, and is the only expression in the program that produces a `ProjectPhase`. */
function mintPhase<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

/**
 * Whether teardown has begun, as a field of the live phases rather than a phase beside them.
 *
 * `dispose` refuses everything from the moment it is called and releases separately, because it is
 * reachable from inside a call this runtime is making. Between those two moments the runtime still
 * has an open scope and an unwinding commit depth, and those are what its refusals read, so this is
 * the same shape as `DrainBooking`: one more axis of a live phase. Monotone, and the only phase it
 * leads to is the terminal one. See ADR-067.
 */
export type Retirement = "live" | "retiring";

interface IdleShape {
  readonly kind: "idle";
  readonly depth: number;
  readonly retirement: Retirement;
}

interface EditingShape<Staged> {
  readonly kind: "editing";
  readonly depth: number;
  readonly retirement: Retirement;
  readonly staged: Staged;
}

interface BatchingShape {
  readonly kind: "batching";
  readonly depth: number;
  readonly retirement: Retirement;
  readonly seeds: readonly string[];
}

interface EditingInBatchShape<Staged> {
  readonly kind: "editing-in-batch";
  readonly depth: number;
  readonly retirement: Retirement;
  readonly staged: Staged;
  readonly seeds: readonly string[];
}

interface DisposedShape {
  readonly kind: "disposed";
}

/**
 * The phase one project runtime is in, over three axes: its open scope, its commit depth, and
 * whether teardown has begun.
 *
 * The four live variants are the open scope, and every one of them is reachable: nothing open, a
 * structural recipe, a value batch, and a recipe opened inside a batch. What no variant can say is
 * a recipe inside a recipe or a batch inside a recipe, which are the two the guards refuse. The
 * staged document exists only while a recipe is open and the seed list only while a batch is, so
 * neither is nullable and no reader has to ask. `disposed` is terminal and carries nothing, which
 * is what retires the hand-written clears in `#teardown`.
 *
 * Generic in the staged document because this module owns when a recipe is open, not what one
 * holds: the retained track and motion pair belongs to the runtime, and `Validated<T>` and
 * `Resolved<E>` already set the precedent for a payload this folder carries without owning.
 */
export type ProjectPhase<Staged> =
  | Minted<IdleShape>
  | Minted<EditingShape<Staged>>
  | Minted<BatchingShape>
  | Minted<EditingInBatchShape<Staged>>
  | Minted<DisposedShape>;

// Interned, because these two carry nothing that varies. The rest cannot be, since a depth is a
// count and a staged document is whatever the recipe put in it, so every other phase is minted by
// the transitions below, which keeps this module the one owner of what a legal phase is.
const IDLE_LIVE = mintPhase<IdleShape>({ kind: "idle", depth: 0, retirement: "live" });
const DISPOSED = mintPhase<DisposedShape>({ kind: "disposed" });

// One frozen empty list rather than a fresh one per batch. Safe to share where issue #396's was
// not, because nothing can add to it: a batch accumulates by minting a new phase, never in place.
const NO_SEEDS: readonly string[] = Object.freeze([]);

/** The phase a project starts in: live, nothing open, and no commit in flight. */
export function idle<Staged>(): ProjectPhase<Staged> {
  return IDLE_LIVE;
}

/** The one terminal phase. Idempotent by having no input, which is what `#teardown` needs. */
export function retired<Staged>(): ProjectPhase<Staged> {
  return DISPOSED;
}

/** The depth of the commit this phase is inside, which is what `#inFlight` counted. */
export function depthOf<Staged>(phase: ProjectPhase<Staged>): number {
  switch (phase.kind) {
    case "idle":
    case "editing":
    case "batching":
    case "editing-in-batch":
      return phase.depth;
    // A commit cannot be in flight once teardown has finished, because teardown runs from the
    // boundary that unwound the last one.
    case "disposed":
      return 0;
    default:
      return unreachable(phase);
  }
}

/** Whether teardown has begun, which is the question every refusal of a retired project asks. */
export function isRetiring<Staged>(phase: ProjectPhase<Staged>): boolean {
  switch (phase.kind) {
    case "idle":
    case "editing":
    case "batching":
    case "editing-in-batch":
      return phase.retirement === "retiring";
    case "disposed":
      return true;
    default:
      return unreachable(phase);
  }
}

/**
 * Whether teardown has finished. Distinct from `isRetiring` for the reason `GraphRuntime`'s pair is
 * distinct: one of them is what refuses a verb, and the other is what stops a second release.
 */
export function isDisposed<Staged>(phase: ProjectPhase<Staged>): boolean {
  switch (phase.kind) {
    case "idle":
    case "editing":
    case "batching":
    case "editing-in-batch":
      return false;
    case "disposed":
      return true;
    default:
      return unreachable(phase);
  }
}

/**
 * Whether the release is owed right now, which is the one question `#pendingTeardown` answered.
 *
 * True exactly when teardown has begun and the last commit has unwound, so both of today's call
 * sites ask the same thing of the same value: `dispose` asks it once, and the boundary asks it
 * again each time it returns. Whether that release was deferred is no longer a field either: only
 * those two sites can tell, and they tell by which one of them is asking.
 */
export function teardownOwed<Staged>(phase: ProjectPhase<Staged>): boolean {
  switch (phase.kind) {
    case "idle":
    case "editing":
    case "batching":
    case "editing-in-batch":
      return phase.retirement === "retiring" && phase.depth === 0;
    case "disposed":
      return false;
    default:
      return unreachable(phase);
  }
}

/** The document an open recipe has staged, or `undefined` when no recipe is open. */
export function stagedIn<Staged>(phase: ProjectPhase<Staged>): Staged | undefined {
  switch (phase.kind) {
    case "editing":
    case "editing-in-batch":
      return phase.staged;
    case "idle":
    case "batching":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/**
 * The seeds an open value batch has collected, or `undefined` when no batch is open.
 *
 * A list rather than the set issue #443 sketches, and deliberately: `#valueSeeds` is an array whose
 * order and repeats reach `GraphRuntime.flush` exactly as they were pushed, so a set would silently
 * dedupe and that is a behaviour change this phase forbids itself.
 */
export function seedsIn<Staged>(phase: ProjectPhase<Staged>): readonly string[] | undefined {
  switch (phase.kind) {
    case "batching":
    case "editing-in-batch":
      return phase.seeds;
    case "idle":
    case "editing":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

function retirementOf<Staged>(phase: ProjectPhase<Staged>): Retirement {
  switch (phase.kind) {
    case "idle":
    case "editing":
    case "batching":
    case "editing-in-batch":
      return phase.retirement;
    case "disposed":
      return "retiring";
    default:
      return unreachable(phase);
  }
}

/**
 * Rebuilds one live phase on its two orthogonal axes, carrying whatever scope it already held.
 *
 * The depth and the retirement move independently of the scope and of each other, so stating that
 * once here is what keeps the three transitions below from being three copies of one switch. Issue
 * #437 made the same move for the graph runtime's phase table. Terminal disposal is left alone.
 */
function carrying<Staged>(
  phase: ProjectPhase<Staged>,
  depth: number,
  retirement: Retirement,
): ProjectPhase<Staged> {
  switch (phase.kind) {
    case "idle":
      return mintPhase<IdleShape>({ kind: "idle", depth, retirement });
    case "editing":
      return mintPhase<EditingShape<Staged>>({
        kind: "editing",
        depth,
        retirement,
        staged: phase.staged,
      });
    case "batching":
      return mintPhase<BatchingShape>({ kind: "batching", depth, retirement, seeds: phase.seeds });
    case "editing-in-batch":
      return mintPhase<EditingInBatchShape<Staged>>({
        kind: "editing-in-batch",
        depth,
        retirement,
        staged: phase.staged,
        seeds: phase.seeds,
      });
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** The phase a commit boundary opens: one deeper, everything else carried. */
export function entering<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  return carrying(phase, depthOf(phase) + 1, retirementOf(phase));
}

/**
 * The phase a commit boundary closes into: one shallower, everything else carried.
 *
 * Floored at zero rather than trusting the pairing, because a boundary that never opened is a bug
 * this must not turn into a negative depth that admits everything.
 */
export function leaving<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  return carrying(phase, Math.max(0, depthOf(phase) - 1), retirementOf(phase));
}

/** The phase `dispose` moves to: refusing everything, still unwinding whatever it was doing. */
export function retiring<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  return carrying(phase, depthOf(phase), "retiring");
}

/**
 * The phase an opening recipe moves to, carrying the batch it may have been opened inside.
 *
 * Total, and the three arms that answer the phase unchanged are the ones `admit` has already
 * refused: a second recipe, and a project that is retiring or retired.
 */
export function opening<Staged>(phase: ProjectPhase<Staged>, staged: Staged): ProjectPhase<Staged> {
  switch (phase.kind) {
    case "idle":
      return mintPhase<EditingShape<Staged>>({
        kind: "editing",
        depth: phase.depth,
        retirement: phase.retirement,
        staged,
      });
    case "batching":
      return mintPhase<EditingInBatchShape<Staged>>({
        kind: "editing-in-batch",
        depth: phase.depth,
        retirement: phase.retirement,
        staged,
        seeds: phase.seeds,
      });
    case "editing":
    case "editing-in-batch":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/**
 * The phase a closing recipe leaves, which is the batch it was opened inside when there was one.
 *
 * Runs from `edit`'s `finally`, so it runs for a recipe that threw and for one that disposed the
 * project mid-flight, which is why terminal disposal is answered unchanged rather than walked back
 * into a live phase.
 */
export function closing<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  switch (phase.kind) {
    case "editing":
      return mintPhase<IdleShape>({
        kind: "idle",
        depth: phase.depth,
        retirement: phase.retirement,
      });
    case "editing-in-batch":
      return mintPhase<BatchingShape>({
        kind: "batching",
        depth: phase.depth,
        retirement: phase.retirement,
        seeds: phase.seeds,
      });
    case "idle":
    case "batching":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** The phase an opening value batch moves to, collecting nothing yet. See ADR-078. */
export function batchOpening<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  switch (phase.kind) {
    case "idle":
      return mintPhase<BatchingShape>({
        kind: "batching",
        depth: phase.depth,
        retirement: phase.retirement,
        seeds: NO_SEEDS,
      });
    // `values` is an immediate verb, so `admit` refuses it inside a recipe, inside another
    // batch, and on a project that is retiring, which is every arm below.
    case "editing":
    case "batching":
    case "editing-in-batch":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** The phase a closing value batch leaves, dropping the seeds the caller is about to publish. */
export function batchClosing<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  switch (phase.kind) {
    case "batching":
      return mintPhase<IdleShape>({
        kind: "idle",
        depth: phase.depth,
        retirement: phase.retirement,
      });
    case "editing-in-batch":
      return mintPhase<EditingShape<Staged>>({
        kind: "editing",
        depth: phase.depth,
        retirement: phase.retirement,
        staged: phase.staged,
      });
    case "idle":
    case "editing":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/**
 * The phase carrying `nodeId` as one more deferred seed, or `undefined` when no batch is open.
 *
 * One question with one answer, rather than a nullable field each caller reads and then acts on:
 * `undefined` means this write publishes now, and a phase means the open batch owes the
 * publication. That is `bookingDrain`'s shape, for `#publishValue`'s reason. A new list each time,
 * so nothing outside holds the one a phase is carrying.
 */
export function seeding<Staged>(
  phase: ProjectPhase<Staged>,
  nodeId: string,
): ProjectPhase<Staged> | undefined {
  switch (phase.kind) {
    case "batching":
      return mintPhase<BatchingShape>({
        kind: "batching",
        depth: phase.depth,
        retirement: phase.retirement,
        seeds: Object.freeze([...phase.seeds, nodeId]),
      });
    // A value verb is refused inside a recipe, so a batch that has one open collects nothing while
    // it is. Answered rather than refused, because the seed belongs to the batch either way.
    case "editing-in-batch":
      return mintPhase<EditingInBatchShape<Staged>>({
        kind: "editing-in-batch",
        depth: phase.depth,
        retirement: phase.retirement,
        staged: phase.staged,
        seeds: Object.freeze([...phase.seeds, nodeId]),
      });
    case "idle":
    case "editing":
    case "disposed":
      return undefined;
    default:
      return unreachable(phase);
  }
}

/**
 * Where a verb's liveness is asked, which is the one thing the three guard helpers disagreed about.
 *
 * `seek`, `setValues`, `mount` and every other entry point call `#assertLive` before the reentrancy
 * guard, so a retired project refuses them for the disposal. A verb reached through a handle does
 * not: `#setKeyframe` and `#setTrigger` run the reentrancy guard first and reach liveness only when
 * `#writableEntry` resolves the handle, so a retired project mid-commit refuses them for the commit
 * instead. Both orders are today's, and neither is safe to normalise in a slice whose claim is
 * that no message moved, so which one a verb wants is a field rather than a comment. `resolved`
 * means the answer belongs to `expectLive`, which already owns it.
 */
export type Liveness = "asserted" | "resolved";

interface ReadVerb {
  readonly kind: "read";
}

interface OpenRecipeVerb {
  readonly kind: "open-recipe";
}

interface ValueVerb {
  readonly kind: "value";
  readonly verb: string;
  readonly liveness: Liveness;
}

interface ImmediateVerb {
  readonly kind: "immediate";
  readonly verb: string;
  readonly liveness: Liveness;
}

interface CommitVerb {
  readonly kind: "commit";
}

/**
 * Which admission rule a verb is asking for, as a value rather than as prose.
 *
 * Every public verb opened with a hand-picked sequence of guards, and which of the three helpers a
 * given verb should call was documented in comments rather than enforced, so a verb that picked the
 * wrong one was nothing the build could catch. The two-tier design is not what changes here, and
 * issue #443 is explicit that it must not: what changes is that tier membership is a type.
 *
 * `read` needs a live project and nothing else. `open-recipe` is `edit`, which refuses a second
 * recipe and nothing else, so it is its own class rather than a structural one. `value` may travel
 * with an open batch, which is the whole point of opening one. `immediate` may not. `commit` is the
 * structural publication, and it joins an open recipe rather than refusing it. See ADR-064.
 */
export type VerbClass = ReadVerb | OpenRecipeVerb | ValueVerb | ImmediateVerb | CommitVerb;

/** A verb that reads the document and publishes nothing, so only disposal can refuse it. */
export const READ: VerbClass = Object.freeze<ReadVerb>({ kind: "read" });

/** `edit` itself, which is the one verb that opens a structural recipe. */
export const OPEN_RECIPE: VerbClass = Object.freeze<OpenRecipeVerb>({ kind: "open-recipe" });

/** A structural commit, which is the one verb an open recipe absorbs instead of refusing. */
export const COMMIT: VerbClass = Object.freeze<CommitVerb>({ kind: "commit" });

/** A value-tier verb: `seek`, `setValues`, `overrideValues`, `setKeyframe`, `removeKeyframe`. */
export function valueVerb(verb: string, liveness: Liveness): VerbClass {
  return Object.freeze<ValueVerb>({ kind: "value", verb, liveness });
}

/** An immediate verb: `mount`, `unmount`, `signal`, `values`, `invalidate`, and the tier 0 pair. */
export function immediateVerb(verb: string, liveness: Liveness): VerbClass {
  return Object.freeze<ImmediateVerb>({ kind: "immediate", verb, liveness });
}

interface AllowShape {
  readonly kind: "allow";
}

interface JoinShape {
  readonly kind: "join";
}

interface RefuseShape {
  readonly kind: "refuse";
  readonly refusal: RefusalShape;
}

/**
 * What one phase answers one verb.
 *
 * `join` is a third answer rather than a flavour of `allow`, because a structural commit inside an
 * open recipe is neither admitted nor refused: `#commit` returns, the staged pair stays staged, and
 * the recipe publishes it when it closes. Collapsing it into `allow` is how a commit would escape a
 * recipe. See ADR-064.
 *
 * Carries a `RefusalShape` rather than a minted `Refusal`, so `admit` composes without minting a
 * value its caller may discard, and `refuse` stays the only expression that throws one.
 */
export type Admission = AllowShape | JoinShape | RefuseShape;

const ALLOW: Admission = Object.freeze<AllowShape>({ kind: "allow" });
const JOIN: Admission = Object.freeze<JoinShape>({ kind: "join" });

function refusing(refusal: RefusalShape): Admission {
  return Object.freeze<RefuseShape>({ kind: "refuse", refusal });
}

const REFUSE_DISPOSED: Admission = refusing({ kind: "disposed" });

/**
 * The liveness half of an admission: the refusal to answer, or `undefined` to keep asking.
 *
 * A switch rather than an equality, so a third place liveness could be asked from breaks the build
 * here instead of silently inheriting the entry-point order.
 */
function liveGate<Staged>(phase: ProjectPhase<Staged>, liveness: Liveness): Admission | undefined {
  switch (liveness) {
    case "asserted":
      return isRetiring(phase) ? REFUSE_DISPOSED : undefined;
    // The handle resolution asks, so this admission says nothing about it.
    case "resolved":
      return undefined;
    default:
      return unreachable(liveness);
  }
}

function admitRecipe<Staged>(phase: ProjectPhase<Staged>): Admission {
  switch (phase.kind) {
    case "editing":
    case "editing-in-batch":
      return refusing({ kind: "nested-recipe" });
    // A recipe inside an open batch is admitted, and refused at commit instead. That is today's
    // behaviour and issue #443 asks for it to be preserved, not merged into one refusal.
    case "idle":
    case "batching":
    case "disposed":
      return ALLOW;
    default:
      return unreachable(phase);
  }
}

/**
 * The value tier's rule: the open recipe first, then the commit depth, and the batch is fine.
 *
 * That order is `#refuseImmediateReentrant`'s, and it is load-bearing for a verb whose liveness is
 * resolved rather than asserted: a project that began retiring inside a recipe refuses for the
 * recipe, because the recipe is still open until `edit` returns.
 */
function admitValue<Staged>(phase: ProjectPhase<Staged>, verb: string): Admission {
  switch (phase.kind) {
    case "editing":
    case "editing-in-batch":
      return refusing({ kind: "immediate-in-recipe", verb });
    case "idle":
    case "batching":
      return phase.depth > 0 ? refusing({ kind: "commit-in-flight" }) : ALLOW;
    // Nothing is open once teardown has finished, so the handle resolution is what refuses.
    case "disposed":
      return ALLOW;
    default:
      return unreachable(phase);
  }
}

/**
 * The immediate tier's rule: the value tier's, and then the open batch as well.
 *
 * The depth is checked before the batch because `#refuseReentrant` calls
 * `#refuseImmediateReentrant` first and only then looks at the batch, so an immediate verb reached
 * inside a batch that is mid-commit is refused for the commit.
 */
function admitImmediate<Staged>(phase: ProjectPhase<Staged>, verb: string): Admission {
  switch (phase.kind) {
    case "editing":
    case "editing-in-batch":
      return refusing({ kind: "immediate-in-recipe", verb });
    case "batching":
      return phase.depth > 0
        ? refusing({ kind: "commit-in-flight" })
        : refusing({ kind: "immediate-in-batch", verb });
    case "idle":
      return phase.depth > 0 ? refusing({ kind: "commit-in-flight" }) : ALLOW;
    case "disposed":
      return ALLOW;
    default:
      return unreachable(phase);
  }
}

/**
 * The structural commit's rule, which asks about disposal at all.
 *
 * `#commit` never did: it joins an open recipe, refuses a commit already in flight, refuses an open
 * value batch, and leaves liveness to the assertion `#apply` makes once the plan is derived. Kept
 * exactly, so a commit on a retired project still fails where it fails today.
 */
function admitCommit<Staged>(phase: ProjectPhase<Staged>): Admission {
  switch (phase.kind) {
    case "editing":
    case "editing-in-batch":
      return JOIN;
    case "batching":
      return phase.depth > 0
        ? refusing({ kind: "commit-in-flight" })
        : refusing({ kind: "structural-in-batch" });
    case "idle":
      return phase.depth > 0 ? refusing({ kind: "commit-in-flight" }) : ALLOW;
    case "disposed":
      return ALLOW;
    default:
      return unreachable(phase);
  }
}

/**
 * What `phase` answers `verb`, as data, and the one place the three guard helpers used to be.
 *
 * Switch by switch, each total, so a phase added later and a tier added later both break the build
 * at the one place that owes a decision rather than inheriting whichever branch was written last.
 * Answers data rather than throwing, so a test can enumerate the whole state space without a `try`.
 */
export function admit<Staged>(phase: ProjectPhase<Staged>, verb: VerbClass): Admission {
  switch (verb.kind) {
    case "read":
      return isRetiring(phase) ? REFUSE_DISPOSED : ALLOW;
    case "open-recipe":
      return isRetiring(phase) ? REFUSE_DISPOSED : admitRecipe(phase);
    case "value":
      return liveGate(phase, verb.liveness) ?? admitValue(phase, verb.verb);
    case "immediate":
      return liveGate(phase, verb.liveness) ?? admitImmediate(phase, verb.verb);
    case "commit":
      return admitCommit(phase);
    default:
      return unreachable(verb);
  }
}

/**
 * Admits `verb` in `phase`, throwing the refusal it earned, and answers what the caller still owes.
 *
 * Refusals stay thrown, which issue #443 is explicit about: returning them would be an API break
 * and would let a caller ignore one. What is left for a caller to read is the two answers it can
 * act on, and only `#commit` can receive `"join"`.
 */
export function admitOrRefuse<Staged>(
  phase: ProjectPhase<Staged>,
  verb: VerbClass,
): "allow" | "join" {
  const admission = admit(phase, verb);
  switch (admission.kind) {
    case "allow":
      return "allow";
    case "join":
      return "join";
    case "refuse":
      return refuse(admission.refusal);
    default:
      return unreachable(admission);
  }
}
