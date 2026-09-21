import type { Diagnostic } from "../contract/v5";
import type { StaleHandleError } from "../contract/handle";
import { StaleMotionHandleError } from "../contract/motion-handle";
import { StaleTrackHandleError } from "../contract/track-handle";
import { unreachable } from "../lang/exhaustive";

/**
 * Every refusal the project runtime throws, as data, and the one describer that renders each of them.
 *
 * `schema-refusals.ts` proved there was a union here already: eight functions, each throwing a
 * `TypeError` whose message opens with a rule id, so the kind of a refusal was a real fact encoded
 * as a prefix inside human prose. A caller that wanted to branch on one had to parse a string, and
 * the rule id, then detail, then remedy template was retyped once per function.
 *
 * So the payload becomes a closed union and the message becomes a rendering of it. Three things are
 * deliberately unchanged. Refusals still throw, because returning them would be an API break and
 * would let a caller ignore one. Every message is byte-identical to what it was, which is what makes
 * this slice provably behaviour-preserving: every message-anchored test stays green, and any message
 * change is owed its own deliberate commit. And each refusal keeps the error class it already threw,
 * which is why `refusalError` is a second switch beside `describeRefusal` rather than one
 * constructor: a stale handle is the `StaleHandleError` family the contract layer owns, a disposed
 * project is a plain `Error`, and the rest are the `TypeError` family. Neither class here assigns
 * `name`, because the classes they replace do not.
 *
 * Issue #443, phase A step 1.
 */
declare const REFUSAL_BRAND: unique symbol;

/**
 * The mint mark that keeps the union below closed as well as discriminated.
 *
 * The device `graph-runtime-state.ts` already uses, for the reason issue #387 gave: a variant
 * declaring only its discriminant is not closed, because TypeScript's excess-property check reads a
 * fresh object literal rather than a value arriving through a variable. Declared, never exported and
 * never assigned at runtime, so no other module can name the key and no property exists to carry.
 */
interface RefusalBrand {
  readonly [REFUSAL_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & RefusalBrand;

/** What a stale handle was captured against, named by the kind of handle that refused. */
export interface HandleTarget {
  readonly kind: "track" | "motion";
  readonly id: string;
}

interface DisposedShape {
  readonly kind: "disposed";
}

interface NestedRecipeShape {
  readonly kind: "nested-recipe";
}

interface ImmediateInRecipeShape {
  readonly kind: "immediate-in-recipe";
  readonly verb: string;
}

interface ImmediateInBatchShape {
  readonly kind: "immediate-in-batch";
  readonly verb: string;
}

interface CommitInFlightShape {
  readonly kind: "commit-in-flight";
}

interface StructuralInBatchShape {
  readonly kind: "structural-in-batch";
}

interface UnknownMotionShape {
  readonly kind: "unknown-motion";
  readonly motionId: string;
}

interface UnknownNodeShape {
  readonly kind: "unknown-node";
  readonly nodeId: string;
}

interface StaleHandleShape {
  readonly kind: "stale-handle";
  readonly target: HandleTarget;
}

interface UnboundGroupShape {
  readonly kind: "unbound-group";
  readonly nodeId: string;
  readonly plugin: string;
}

interface ReservedGoalSlotShape {
  readonly kind: "reserved-goal-slot";
  readonly plugin: string;
  readonly slot: string;
}

interface PropertyEntryShape {
  readonly kind: "property-entry";
  readonly nodeId: string;
  readonly plugin: string;
}

interface InvalidDefinitionShape {
  readonly kind: "invalid-definition";
  readonly diagnostics: readonly Diagnostic[];
}

/** What a caller hands `refuse`: one refusal, before it is minted. */
export type RefusalShape =
  | DisposedShape
  | NestedRecipeShape
  | ImmediateInRecipeShape
  | ImmediateInBatchShape
  | CommitInFlightShape
  | StructuralInBatchShape
  | UnknownMotionShape
  | UnknownNodeShape
  | StaleHandleShape
  | UnboundGroupShape
  | ReservedGoalSlotShape
  | PropertyEntryShape
  | InvalidDefinitionShape;

/**
 * One refusal, minted, and the whole set of them.
 *
 * Distributed by hand rather than written as one intersection over the shape union, so every variant
 * carries the mark itself and discriminant narrowing reads a plain union at every arm below.
 */
export type Refusal =
  | Minted<DisposedShape>
  | Minted<NestedRecipeShape>
  | Minted<ImmediateInRecipeShape>
  | Minted<ImmediateInBatchShape>
  | Minted<CommitInFlightShape>
  | Minted<StructuralInBatchShape>
  | Minted<UnknownMotionShape>
  | Minted<UnknownNodeShape>
  | Minted<StaleHandleShape>
  | Minted<UnboundGroupShape>
  | Minted<ReservedGoalSlotShape>
  | Minted<PropertyEntryShape>
  | Minted<InvalidDefinitionShape>;

/** Mints one refusal, and is the only expression in the program that produces a `Refusal`. */
function mintRefusal(shape: RefusalShape): Refusal {
  return Object.freeze(shape) as unknown as Refusal;
}

/**
 * Renders a diagnostic list as one line, and is the one owner of that rendering.
 *
 * Moved here from `schema-refusals.ts` because `invalid-definition` renders through it, and
 * re-exported from there so no call site and no test moves. The output is byte-identical.
 */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}

/**
 * Answers the error a stale handle refuses with, which the contract layer owns.
 *
 * The sentence is not respelled here. `StaleHandleError` owns it, each subclass passes the noun, and
 * this switch only decides which of the two a target names. That is why `describeRefusal` reads the
 * message off this error rather than templating a second copy of it.
 */
export function staleHandleError(target: HandleTarget): StaleHandleError {
  switch (target.kind) {
    case "track":
      return new StaleTrackHandleError(target.id);
    case "motion":
      return new StaleMotionHandleError(target.id);
    default:
      return unreachable(target.kind);
  }
}

/**
 * The message one refusal renders to, and the acceptance test for this whole slice.
 *
 * Every arm reproduces what the function it replaces produced, byte for byte. A variant added later
 * fails `typecheck` here rather than falling into whichever arm was written last.
 */
export function describeRefusal(refusal: Refusal): string {
  switch (refusal.kind) {
    case "disposed":
      return "ProjectRuntime is disposed.";
    case "nested-recipe":
      return "schema-transaction-nested: A recipe is already open. Finish it before opening another.";
    case "immediate-in-recipe":
      return `schema-transaction-immediate: "${refusal.verb}" applies immediately and cannot travel with a recipe. Call it outside edit().`;
    case "immediate-in-batch":
      return `value-batch-immediate: "${refusal.verb}" publishes or mounts and cannot travel with a value batch. Call it outside values().`;
    case "commit-in-flight":
      return "schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.";
    case "structural-in-batch":
      return "value-batch-structural: A value batch is open. Ask for it once values() has returned.";
    case "unknown-motion":
      return `Unknown motion "${refusal.motionId}".`;
    case "unknown-node":
      return `Unknown graph node "${refusal.nodeId}".`;
    case "stale-handle":
      return staleHandleError(refusal.target).message;
    case "unbound-group":
      return `keyframe-group-unbound: "${refusal.nodeId}" authors no "${refusal.plugin}" group. Use setKeyframeGroup to originate one.`;
    case "reserved-goal-slot":
      return `keyframe-goal-slot-reserved: Slot "${refusal.slot}" of "${refusal.plugin}" holds a solver's goals. Use setGoal to bind one entry of it, or removeGoal to drop one.`;
    case "property-entry":
      return `keyframe-entry-shape: "${refusal.nodeId}" authors "${refusal.plugin}" as a property, not a group. Use replace() to change an entry's shape.`;
    case "invalid-definition":
      return describeDiagnostics(refusal.diagnostics);
    default:
      return unreachable(refusal);
  }
}

/**
 * The `TypeError` family every named schema refusal throws, now carrying its payload.
 *
 * `TypeError` rather than `Error` because that is what each of these threw, so existing
 * `catch (error) { if (error instanceof TypeError) }` code keeps matching. `name` is left alone for
 * the same reason: today's value is `"TypeError"`, and a rename would be an observable change in a
 * slice whose whole claim is that nothing observable moved.
 */
export class RefusalError extends TypeError {
  readonly refusal: Refusal;
  constructor(refusal: Refusal) {
    super(describeRefusal(refusal));
    this.refusal = refusal;
  }
}

/**
 * The one refusal that is not a `TypeError`, because `#assertLive` threw a plain `Error`.
 *
 * A separate class rather than a widening of the family above, so the payload becomes inspectable
 * without the disposed refusal changing what it is. See `RefusalError` on why `name` is untouched.
 */
export class DisposedProjectError extends Error {
  readonly refusal: Refusal;
  constructor(refusal: Refusal) {
    super(describeRefusal(refusal));
    this.refusal = refusal;
  }
}

/** The error one refusal is thrown as. Total, so a new variant owes a decision here too. */
export function refusalError(refusal: Refusal): Error {
  switch (refusal.kind) {
    case "stale-handle":
      return staleHandleError(refusal.target);
    case "disposed":
      return new DisposedProjectError(refusal);
    case "nested-recipe":
    case "immediate-in-recipe":
    case "immediate-in-batch":
    case "commit-in-flight":
    case "structural-in-batch":
    case "unknown-motion":
    case "unknown-node":
    case "unbound-group":
    case "reserved-goal-slot":
    case "property-entry":
    case "invalid-definition":
      return new RefusalError(refusal);
    default:
      return unreachable(refusal);
  }
}

/** Refuses, and is the only expression that throws one of these. Mints on the way through. */
export function refuse(shape: RefusalShape): never {
  throw refusalError(mintRefusal(shape));
}
