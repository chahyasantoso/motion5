import type { TrackDefinition } from "../../contract/v5";
import type { PluginDefinition, ResolvedPlugins } from "../plugins";
import { equalValues } from "../values";

/**
 * Everything one compiled `Track` is built from, as one value.
 *
 * Two halves, because a `Track` is constructed from exactly two things: the interpolation config,
 * which is the whole track definition with its flattened `values` section spliced in, and the
 * resolved plugins, which carry the composer chain, the prepared contribution merged over that
 * config, and the declared internal keys. Neither half answers for the other, which is the entire
 * reason this is a pair rather than a record of authored keyframes.
 *
 * `resolved` is optional because a project may be loaded with no `PluginRegistry` at all. It is not
 * a third state to reason about: with no answer there is nothing to compare, and the comparison
 * below says so once rather than at each caller.
 */
export interface CompiledTrackInput {
  readonly definition: TrackDefinition;
  readonly resolved: ResolvedPlugins | undefined;
}

/**
 * The definition without its authored record, which is the half the resolve already answers for.
 *
 * Everything left is a field the interpolation config carries straight through: the duration the
 * percent map compiles against, the id, the observations, and anything else an author wrote. They
 * are compared as a group rather than named one by one, because a field named here would be a field
 * this module has to learn about again the next time the authored schema grows one.
 */
function outsideKeyframes(definition: TrackDefinition): Record<string, unknown> {
  const rest: Record<string, unknown> = { ...definition };
  delete rest.keyframes;
  return rest;
}

/**
 * Whether two resolved chains are the same chain.
 *
 * By content and in order, never by reference. The array is rebuilt on every resolve, so a reference
 * test would answer "moved" for every candidate and the predicate would never skip anything, which
 * is a mutation that leaves every case in this slice green except the ones that count.
 *
 * Names rather than identities, because a name is what the registry keys a plugin by and two
 * definitions cannot share one. Order is compared as well as membership even though the resolver's
 * sort is total over stage, priority and registration order: a comparison that answered for the set
 * alone would be relying on that sort staying total.
 */
function sameChain(
  current: readonly PluginDefinition[],
  next: readonly PluginDefinition[],
): boolean {
  if (current.length !== next.length) return false;
  return current.every((plugin, index) => plugin.name === next[index]?.name);
}

/**
 * Whether a `Track` built from `next` would be the `Track` already built from `current`.
 *
 * The V3 and V4 predicate, stated over everything a compiled `Track` reads rather than over the
 * plugin chain alone. A binding edit changes no compiled property, because the flattened record the
 * interpolator and the percent map receive carries the `values` section and nothing else, and a
 * plugin already in the chain by precondition cannot join it twice. Both of those are facts about
 * this pair, so both are measured here instead of being argued at the call site.
 *
 * The chain alone is not the predicate, and that is the correction this slice makes to its own plan.
 * `replace()` and `addObserve` reach the same transaction with a changed value, a changed duration
 * or a changed observation and an untouched chain, so a chain comparison alone would decline a
 * build all three require and leave a node composing a value nobody authored.
 *
 * Conservative in one direction only. Anything this cannot prove unchanged reads as changed, so a
 * `tweenVars` entry holding something structural equality cannot walk costs a build rather than
 * risking a skip, and no caller has to know which values those are.
 *
 * `outputSerializers` is deliberately not compared. It is derived from the chain plus its own
 * refusals, so the chain answers for it, and comparing a record of functions would be a comparison
 * that can only ever answer "changed".
 */
export function sameCompiledTrackInput(
  current: CompiledTrackInput,
  next: CompiledTrackInput,
): boolean {
  const before = current.resolved;
  const after = next.resolved;
  if (before === undefined || after === undefined) return false;
  if (!equalValues(outsideKeyframes(current.definition), outsideKeyframes(next.definition)))
    return false;
  if (!equalValues(before.authoredKeyframes, after.authoredKeyframes)) return false;
  if (!equalValues(before.preparation, after.preparation)) return false;
  if (!equalValues(before.internalKeys, after.internalKeys)) return false;
  return sameChain(before.plugins, after.plugins);
}
