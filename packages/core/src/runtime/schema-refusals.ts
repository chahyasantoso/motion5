import { refuse } from "./refusal";

export { describeDiagnostics } from "./refusal";
/** Named schema refusals; admission order: recipe, commit in flight, value batch. `refusal.ts` owns message and class. */
/** Renders a thrown value as its own message; aggregate causes belong to `describeWithCauses`. */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
/** Refuses a recipe opened inside a recipe: `schema-transaction-nested`. Joining the open recipe would return the inner `edit` uncommitted. */
export function nestedTransaction(): never {
  return refuse({ kind: "nested-recipe" });
}
/** Refuses an immediate verb inside a recipe: `schema-transaction-immediate`. It applies at once, so an abort could not undo it. */
export function immediateInTransaction(verb: string): never {
  return refuse({ kind: "immediate-in-recipe", verb });
}
/** Refuses a structural commit while one is in flight: `schema-commit-reentrant`, naming the condition, not the verb. */
export function commitInFlight(): never {
  return refuse({ kind: "commit-in-flight" });
}
/** Refuses an immediate verb inside a value batch: `value-batch-immediate`, named by verb; `invalidate` is refused too, not joined to the batch. */
export function valueBatchImmediate(verb: string): never {
  return refuse({ kind: "immediate-in-batch", verb });
}
/** Refuses a structural commit inside a value batch: `value-batch-structural`. Not deferred: a batch holds seeds, a commit holds a pair, so neither nests. */
export function valueBatchStructural(): never {
  return refuse({ kind: "structural-in-batch" });
}
