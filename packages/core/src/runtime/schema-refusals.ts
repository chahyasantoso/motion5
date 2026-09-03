import type { Diagnostic } from "../contract/v5";
/**
 * The named refusals a schema edit throws, and the two describers every message here is built with.
 *
 * Moved out of `project-runtime.ts` whole by slice 2 of issue #267, with each docblock travelling
 * with the function it constrains. Not a new decision about any of them: none of these reads `this`,
 * so none of them was ever about the class it sat above, and each one is a contract about what a
 * caller is told rather than about how a commit is ordered. They are also the least-edited region of
 * that file, so their comment bulk was sitting inside its hot edit target for no reason at all.
 *
 * Exported from this module and from nothing else. No export of `packages/core` moves, and every
 * refusal is still reached through the verb that owns it.
 */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
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
  const use = "Finish it before opening another.";
  throw new TypeError(`schema-transaction-nested: A recipe is already open. ${use}`);
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
  const detail = `"${verb}" applies immediately and cannot travel with a recipe.`;
  throw new TypeError(`schema-transaction-immediate: ${detail} Call it outside edit().`);
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
  const use = "Use setKeyframeGroup to originate one.";
  throw new TypeError(`keyframe-group-unbound: "${nodeId}" authors no "${plugin}" group. ${use}`);
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
  const use = "Use setGoal to bind one entry of it, or removeGoal to drop one.";
  throw new TypeError(
    `keyframe-goal-slot-reserved: Slot "${slot}" of "${plugin}" holds a solver's goals. ${use}`,
  );
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
  const use = "Use replace() to change an entry's shape.";
  throw new TypeError(
    `keyframe-entry-shape: "${nodeId}" authors "${plugin}" as a property, not a group. ${use}`,
  );
}
