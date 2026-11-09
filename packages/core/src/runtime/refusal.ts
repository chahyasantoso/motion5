import type { Diagnostic } from "../contract/v5";
import type { StaleHandleError } from "../contract/handle";
import { StaleMotionHandleError } from "../contract/motion-handle";
import { StaleTrackHandleError } from "../contract/track-handle";
import { unreachable } from "../lang/exhaustive";

/** Every refusal the runtime throws, as a closed union; `describeRefusal` renders it, `refusalError` picks its class. */
declare const REFUSAL_BRAND: unique symbol;

/** Unnameable brand key; a bare discriminant admits any value arriving through a variable. */
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

interface InvalidDefinitionShape {
  readonly kind: "invalid-definition";
  readonly diagnostics: readonly Diagnostic[];
}

/** One refusal before it is minted: what `refuse` and `refuseAt` accept. */
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
  | InvalidDefinitionShape;

/** One refusal, minted, and the whole set of them. Distributed so each variant carries the mark itself. */
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
  | Minted<InvalidDefinitionShape>;

/** Sole expression that produces a `Refusal`; freezes the shape before branding it. */
function mintRefusal(shape: RefusalShape): Refusal {
  return Object.freeze(shape) as unknown as Refusal;
}

/** Renders a diagnostic list as one line; sole owner of the `ruleId at path: message` format. */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}

/** The error a stale handle refuses with; the contract layer owns the message, so none is spelled here. */
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

/** The message one refusal renders to; a new variant fails typecheck here instead of joining an arm. */
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
    case "invalid-definition":
      return describeDiagnostics(refusal.diagnostics);
    default:
      return unreachable(refusal);
  }
}

/** `TypeError` for every refusal but stale-handle and disposed, carrying the refusal as data. */
export class RefusalError extends TypeError {
  readonly refusal: Refusal;
  /** Which edit of a batch was refused, absent when the refusal came from a single verb. */
  readonly editIndex: number | undefined;
  constructor(refusal: Refusal, editIndex?: number) {
    super(describeRefusal(refusal));
    this.refusal = refusal;
    this.editIndex = editIndex;
  }
}

/** A disposed project's refusal, thrown as a plain `Error` rather than a `TypeError`. */
export class DisposedProjectError extends Error {
  readonly refusal: Refusal;
  constructor(refusal: Refusal) {
    super(describeRefusal(refusal));
    this.refusal = refusal;
  }
}

/** The error one refusal is thrown as. Total, so a new variant owes a decision here too. */
export function refusalError(refusal: Refusal, editIndex?: number): Error {
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
    case "invalid-definition":
      return new RefusalError(refusal, editIndex);
    default:
      return unreachable(refusal);
  }
}

/** Refuses one edit of a batch; the index rides the error rather than the message. */
export function refuseAt(shape: RefusalShape, editIndex: number): never {
  throw refusalError(mintRefusal(shape), editIndex);
}

/** Refuses without a batch index; mints the shape on the way through. */
export function refuse(shape: RefusalShape): never {
  throw refusalError(mintRefusal(shape));
}
