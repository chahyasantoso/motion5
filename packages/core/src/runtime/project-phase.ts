import { unreachable } from "../lang/exhaustive";
import { refuse, type RefusalShape } from "./refusal";

// Unassigned: only this module mints.
declare const PHASE_BRAND: unique symbol;

interface PhaseBrand {
  readonly [PHASE_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & PhaseBrand;

function mintPhase<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

/** Teardown begun: live or retiring. */
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

/** One runtime's phase: idle, editing a recipe, batching values, editing in a batch, disposed. */
export type ProjectPhase<Staged> =
  | Minted<IdleShape>
  | Minted<EditingShape<Staged>>
  | Minted<BatchingShape>
  | Minted<EditingInBatchShape<Staged>>
  | Minted<DisposedShape>;

const IDLE_LIVE = mintPhase<IdleShape>({ kind: "idle", depth: 0, retirement: "live" });
const DISPOSED = mintPhase<DisposedShape>({ kind: "disposed" });

const NO_SEEDS: readonly string[] = Object.freeze([]);

/** Starting phase: nothing open, depth zero. */
export function idle<Staged>(): ProjectPhase<Staged> {
  return IDLE_LIVE;
}

/** Sole terminal phase; idempotent. */
export function retired<Staged>(): ProjectPhase<Staged> {
  return DISPOSED;
}

/** Commit depth of `phase`. */
export function depthOf<Staged>(phase: ProjectPhase<Staged>): number {
  switch (phase.kind) {
    case "idle":
    case "editing":
    case "batching":
    case "editing-in-batch":
      return phase.depth;
    // Teardown follows last unwind: depth zero.
    case "disposed":
      return 0;
    default:
      return unreachable(phase);
  }
}

/** Teardown begun: the refusal gate. */
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

/** Teardown finished; no second release. */
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

/** Release owed: retiring at depth zero. */
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

/** Staged document, else `undefined`. */
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

/** Seeds in push order, else `undefined`. */
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

/** Boundary opens: one deeper. */
export function entering<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  return carrying(phase, depthOf(phase) + 1, retirementOf(phase));
}

/** Boundary closes: one shallower, floored at zero. */
export function leaving<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  return carrying(phase, Math.max(0, depthOf(phase) - 1), retirementOf(phase));
}

/** `dispose` target: refuses all, unwinding. */
export function retiring<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  return carrying(phase, depthOf(phase), "retiring");
}

/** Opening recipe: batch kept. */
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

/** Closing recipe: batch restored. */
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

/** Opening batch: no seeds. */
export function batchOpening<Staged>(phase: ProjectPhase<Staged>): ProjectPhase<Staged> {
  switch (phase.kind) {
    case "idle":
      return mintPhase<BatchingShape>({
        kind: "batching",
        depth: phase.depth,
        retirement: phase.retirement,
        seeds: NO_SEEDS,
      });
    // `admit` refuses `values` in every arm below.
    case "editing":
    case "batching":
    case "editing-in-batch":
    case "disposed":
      return phase;
    default:
      return unreachable(phase);
  }
}

/** Closing batch: seeds dropped. */
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

/** Batch plus one seed, else `undefined`. */
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

/** Asked at entry (`asserted`) or resolution (`resolved`). */
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

/** Rule a verb asks for. */
export type VerbClass = ReadVerb | OpenRecipeVerb | ValueVerb | ImmediateVerb | CommitVerb;

/** Only disposal refuses it. */
export const READ: VerbClass = Object.freeze<ReadVerb>({ kind: "read" });

/** `edit`: sole recipe opener. */
export const OPEN_RECIPE: VerbClass = Object.freeze<OpenRecipeVerb>({ kind: "open-recipe" });

/** An open recipe absorbs it. */
export const COMMIT: VerbClass = Object.freeze<CommitVerb>({ kind: "commit" });

/** Value verb: `seek`, `writeValues`, `releaseValues`. */
export function valueVerb(verb: string, liveness: Liveness): VerbClass {
  return Object.freeze<ValueVerb>({ kind: "value", verb, liveness });
}

/** Immediate verb: no batch holds it. */
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

/** One phase's answer to a verb: allow, join, refuse. */
export type Admission = AllowShape | JoinShape | RefuseShape;

const ALLOW: Admission = Object.freeze<AllowShape>({ kind: "allow" });
const JOIN: Admission = Object.freeze<JoinShape>({ kind: "join" });

function refusing(refusal: RefusalShape): Admission {
  return Object.freeze<RefuseShape>({ kind: "refuse", refusal });
}

const REFUSE_DISPOSED: Admission = refusing({ kind: "disposed" });

function liveGate<Staged>(phase: ProjectPhase<Staged>, liveness: Liveness): Admission | undefined {
  switch (liveness) {
    case "asserted":
      return isRetiring(phase) ? REFUSE_DISPOSED : undefined;
    // Resolution asks; this gate says nothing.
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
    // Batch holds recipe now; commit refuses it.
    case "idle":
    case "batching":
    case "disposed":
      return ALLOW;
    default:
      return unreachable(phase);
  }
}

// Recipe refuses before depth does.
function admitValue<Staged>(phase: ProjectPhase<Staged>, verb: string): Admission {
  switch (phase.kind) {
    case "editing":
    case "editing-in-batch":
      return refusing({ kind: "immediate-in-recipe", verb });
    case "idle":
    case "batching":
      return phase.depth > 0 ? refusing({ kind: "commit-in-flight" }) : ALLOW;
    case "disposed":
      return ALLOW;
    default:
      return unreachable(phase);
  }
}

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

// Commit ignores disposal.
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

/** How `phase` answers `verb`: data, never a throw. */
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

/** Admit `verb`, throwing any refusal. */
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
