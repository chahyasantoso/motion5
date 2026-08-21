import type { PluginRequiresBinding } from "./v5";

/**
 * The reserved section name inside a plugin-named keyframe group.
 *
 * A plugin group holds authored properties and, optionally, the graph bindings the named plugin
 * owns. `requires` is that section. It is metadata rather than a property, so it never reaches the
 * percent map, the interpolator, or a published patch.
 *
 * It is reserved rather than conventional, for the same reason the colon is. Left authorable as a
 * property name, one spelling would mean a keyframe in one group and a binding set in another, and
 * no reader could tell which without a plugin registry the contract layer must not have. A
 * top-level `requires` names no plugin at all and is refused outright. See ADR-044.
 */
export const PLUGIN_REQUIRES_SECTION = "requires";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Whether an authored keyframe entry is a plugin-named group rather than a property.
 *
 * The test is structural because the contract layer has no plugin registry and must not gain one:
 * a group is a non-empty object with no `stops` array that either carries a `requires` section or
 * whose every value is an object. Whether the group name addresses a registered plugin, whether
 * that plugin claims each leaf, and whether it declares each bound slot are all ownership rather
 * than schema shape; `plugin-unknown-key` and `plugin-unknown-requirement` own them at resolve
 * time.
 *
 * The `requires` clause is what makes a malformed binding diagnosable at all. Without it,
 * `{ fk: { requires: "walk/pelvis" } }` has a non-object leaf, reads as a property, and is reported
 * as a missing stops array rather than as the binding mistake it is. See ADR-041 and ADR-044.
 */
export function isKeyframeGroup(value: unknown): value is Record<string, unknown> {
  if (!isObject(value) || Array.isArray(value.stops)) return false;
  const names = Object.keys(value);
  if (names.length === 0) return false;
  if (names.includes(PLUGIN_REQUIRES_SECTION)) return true;
  return names.every((name) => isObject(value[name]));
}

/**
 * Every plugin binding a keyframes record declares, ordered by plugin then slot.
 *
 * The single owner of reading the authored bindings, so `graph/ir.ts` derives its edges and
 * `PluginRegistry` resolves its slots from one reader rather than from two that can disagree about
 * what an author wrote. Deriving the edge is purely syntactic, which is what lets it run inside
 * `validateV5` without a plugin registry.
 *
 * Tolerant by design: a malformed binding is skipped here and reported by `validateKeyframes`,
 * which owns shape. Sorted, so derived edge order is never a property of authoring order.
 */
export function readPluginBindings(keyframes: unknown): readonly PluginRequiresBinding[] {
  if (!isObject(keyframes)) return Object.freeze([]);
  const bindings: PluginRequiresBinding[] = [];
  for (const plugin of Object.keys(keyframes).sort()) {
    const group = keyframes[plugin];
    if (!isKeyframeGroup(group)) continue;
    const requires = group[PLUGIN_REQUIRES_SECTION];
    if (!isObject(requires)) continue;
    for (const slot of Object.keys(requires).sort()) {
      const source = requires[slot];
      if (typeof source !== "string" || source.length === 0) continue;
      bindings.push(
        Object.freeze({
          plugin,
          slot,
          source,
          authoredPath: `${plugin}.${PLUGIN_REQUIRES_SECTION}.${slot}`,
        }),
      );
    }
  }
  return Object.freeze(bindings);
}
