import { refuse } from "./refusal";

export { describeDiagnostics } from "./refusal";
/**
 * The named refusals a schema edit throws, each one a spelling of the data `refusal.ts` owns.
 *
 * Moved out of `project-runtime.ts` whole by slice 2 of issue #267, with each docblock travelling
 * with the function it constrains. Not a new decision about any of them: none of these reads `this`,
 * so none of them was ever about the class it sat above, and each one is a contract about what a
 * caller is told rather than about how a commit is ordered. They are also the least-edited region of
 * that file, so their comment bulk was sitting inside its hot edit target for no reason at all.
 *
 * Every refusal below is now one call to `refuse`, which owns the payload, the message and the
 * error class each of them throws, so the kind of a refusal is a value a caller can branch on rather
 * than a prefix inside prose it has to parse. These functions keep their names and their signatures,
 * so no call site and no test moves, and `describeDiagnostics` is re-exported from here for the same
 * reason. No export of `packages/core` moves, and every refusal is still reached through the verb
 * that owns it. Issue #443, phase A step 1.
 */
export function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
/**
 * Refuses a recipe opened inside a recipe.
 *
 * Joining the open one silently would mean the inner `edit` returns before anything it asked for has
 * committed, so a helper's cost and its guarantees would depend on whether something above it had
 * opened a transaction. That is the invisible-context shape that cut `setMotion`, cut `setTrack` and
 * kept `setKeyframe` separate from `setKeyframeGroup`. See ADR-064.
 */
export function nestedTransaction(): never {
  return refuse({ kind: "nested-recipe" });
}
/**
 * Refuses an edit that applies immediately from inside a recipe.
 *
 * Neither tier this reaches is a structural commit: tier 0 reaches the layer that owns the created
 * trigger and the clock consumer, and tier 2 ends at its own `invalidate`. Both therefore apply
 * immediately and would survive an abort. Deferring them into the settle steps was read and refused,
 * because a settle step cannot refuse: it would move `setTrigger`'s failure to after the graph
 * committed and after the retained definition moved, which is the opposite of the contract `RA-35`
 * pins. One condition has one failure contract, so the verb is refused by name inside a recipe
 * rather than given a second, weaker one outside it. See ADR-064.
 */
export function immediateInTransaction(verb: string): never {
  return refuse({ kind: "immediate-in-recipe", verb });
}
/**
 * Refuses a structural commit asked for while one is already in flight.
 *
 * Its own family rather than the immediate-verb one above, because the condition differs and so does
 * the remedy. That one names the verb, because the caller wrote both the `edit()` and the call and has
 * to know which of the two to move. This one refuses every structural verb equally, at the one member
 * all of them reach, and the caller wrote no transaction at all: it wrote a hook, which a commit
 * called. So the message names the condition, and a per-verb spelling would cost a string literal at
 * six call sites to say what the stack already does.
 *
 * A refusal rather than a nested commit, because a commit in flight holds its pair in a local and has
 * already applied effects derived from it, so it cannot honour what an open transaction means. See
 * ADR-068.
 */
export function commitInFlight(): never {
  return refuse({ kind: "commit-in-flight" });
}
/**
 * Refuses an immediate verb asked for while a value batch is open.
 *
 * The third condition on the shared immediate rung, and a third rather than a widening of the first
 * because which callback the caller wrote is what differs. `schema-transaction-immediate` names a
 * verb that cannot travel with a structural recipe at all; this one names a verb that cannot travel
 * with a value batch, which the four value verbs and `seek` can, since staging their publication is
 * the whole point of opening one. So the message names the verb, exactly as the recipe refusal does:
 * the caller wrote both the `values()` and the call, and has to know which of the two to move.
 *
 * `invalidate` is refused here rather than joined to the batch, deliberately. It carries no
 * bookkeeping of its own, so inside a batch that publishes once it is either a no-op or a second
 * publication, and it is the verb a Motion driver reaches, which is the reentrancy this condition
 * exists to refuse. A batch asked for inside a batch reaches this same refusal, so nesting needs no
 * second spelling. See ADR-078.
 */
export function valueBatchImmediate(verb: string): never {
  return refuse({ kind: "immediate-in-batch", verb });
}
/**
 * Refuses a structural commit asked for while a value batch is open.
 *
 * `commitInFlight`'s twin, at the one member every structural verb reaches and for the same reason
 * it names the condition rather than the verb: the caller wrote no verb list, and a per-verb
 * spelling would cost a string literal at six call sites to say what the stack already says.
 *
 * A refusal rather than a deferral, because the two tiers do not nest in either direction. A
 * structural commit derives effects, replaces the graph and adopts a pair; a value batch holds a
 * seed list and nothing else, so there is no pair for one to stage inside the other and no inverse
 * for a settle step to run. See ADR-078.
 */
export function valueBatchStructural(): never {
  return refuse({ kind: "structural-in-batch" });
}
/**
 * Refuses a binding edit addressed at a plugin this node authors no group for.
 *
 * The boundary between this tier's two levels, and it is a refusal rather than a creation on
 * purpose. Originating a binding is `setKeyframeGroup`'s job, because a plugin group holding only
 * half its data may be transiently invalid, and one verb whose cost and refusal set depend on
 * whether the group already existed is the shape this project has declined to build three times.
 *
 * Answered from the retained record on this node, so it stays a different question from anything
 * `PluginRegistry` answers about a candidate: whether the plugin exists at all, and whether it
 * declares the slot, belong to the registry and arrive from it at the recompile. See ADR-062.
 */
export function unboundGroup(nodeId: string, plugin: string): never {
  return refuse({ kind: "unbound-group", nodeId, plugin });
}
/**
 * Refuses a binding edit addressed at a solver's goals slot by name.
 *
 * That slot holds one source per chain leaf, and both spellings a caller could reach it with through
 * `setRequire` are wrong in a way this layer can see. Without a member key the verb can only write a
 * scalar there, which `keyframes-targets-shape` refuses at load, so the candidate would be a record
 * the loader rejects. With one it writes the right shape through the wrong verb, and then one
 * question has two mechanisms: `setGoal` is the owner, so the weaker spelling is deleted rather than
 * documented as discouraged.
 *
 * Scoped to the slot rather than to the plugin that happens to own it, because the reservation is
 * about what the slot holds. Every other slot of that same group stays reachable through
 * `setRequire`. See ADR-057 and ADR-063.
 */
export function reservedGoalSlot(plugin: string, slot: string): never {
  return refuse({ kind: "reserved-goal-slot", plugin, slot });
}
/**
 * Refuses a group edit addressed at a name this node authors as an ordinary property.
 *
 * The entry-level twin of `keyframe-require-shape`, and the primitive's own for the same reason: a
 * plugin name and a keyframe name share one namespace, both shapes are legal there, and nothing
 * below this layer can catch either direction. Writing a group over a property drops every stop the
 * author wrote; removing one deletes a property the caller never named. Crossing an entry's shape is
 * a `replace()`, where a whole definition is validated. See ADR-063.
 */
export function propertyEntry(nodeId: string, plugin: string): never {
  return refuse({ kind: "property-entry", nodeId, plugin });
}
