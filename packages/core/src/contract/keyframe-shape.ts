import { readAuthoredLeaf } from "./authored-leaf";
import { goalSlot, PLUGIN_GOALS_SLOT } from "./solver-slots";
import type { AuthoredPluginGroup, PluginRequiresBinding } from "./v5";

/**
 * The reserved bindings section of a plugin-named keyframe group.
 *
 * A plugin group holds the properties the named plugin claims, under `values`, and optionally the
 * graph bindings that plugin owns. `requires` is that second section. It is metadata rather than a
 * property, so it never reaches the percent map, the interpolator, or a published patch.
 *
 * It is reserved rather than conventional, for the same reason the colon is. Left authorable as a
 * property name, one spelling would mean a keyframe in one group and a binding set in another, and
 * no reader could tell which without a plugin registry the contract layer must not have. A
 * top-level `requires` names no plugin at all and is refused outright. See ADR-044.
 */
export const PLUGIN_REQUIRES_SECTION = "requires";

/**
 * The reserved values section of a plugin-named keyframe group: the properties the plugin claims.
 *
 * Reserved by name, in the same module, under the same rule, for the same reason as `requires`
 * above. That reservation is what makes group detection exact rather than a guess about the shape
 * of the leaves, and it is why an unknown sibling can be reported as an unknown section instead of
 * being misread as a property with no stops.
 *
 * The cost is that no author may animate a flat property called `values` and no plugin may claim
 * the key at group level. The reservation is on section position rather than on the string
 * everywhere, so a leaf named `values` inside the section is an ordinary property. See ADR-049.
 */
export const PLUGIN_VALUES_SECTION = "values";

/** Sorted, so a diagnostic listing the legal sections never depends on declaration order. */
export const PLUGIN_GROUP_SECTIONS: readonly string[] = Object.freeze([
  PLUGIN_REQUIRES_SECTION,
  PLUGIN_VALUES_SECTION,
]);

/** One frozen empty record, so a group with no readable section allocates nothing. */
const EMPTY_VALUES: Readonly<Record<string, unknown>> = Object.freeze({});

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Whether an authored keyframe entry is a plugin-named group rather than a property.
 *
 * Exact rather than heuristic. A group is an object that names at least one reserved section. Both
 * section names are reserved for the same reason the colon is, so this test needs no plugin registry
 * and makes no guess about what the author meant. Whether the group name addresses a registered
 * plugin, whether that plugin claims each leaf, and whether it declares each bound slot are all
 * ownership rather than schema shape; `plugin-unknown-key` and `plugin-unknown-requirement` own them
 * at resolve time.
 *
 * Since ADR-050 there is no leaf test here at all. Both canonical leaf forms fail `isObject` before
 * the section check runs, because arrays are excluded from its definition and a scalar is never
 * `typeof === "object"`, and the retired wrapper names no reserved section. The `Array.isArray`
 * clause this line used to carry became inert, so it is deleted rather than left as a check that
 * reads as load-bearing. `LF-11` pins the behavior it used to guard.
 *
 * `some` and not `every`, so a group carrying an unknown sibling is still read as a group and
 * reported as `keyframes-unknown-section` rather than misdiagnosed as a property. An object naming
 * no section at all is not a group: `{ fk: {} }` stays the accepted no-op property it always was,
 * and the pre-ADR-049 leaf form is refused by name through `looksLikeLegacyGroup` instead.
 * See ADR-041, ADR-044, and ADR-049.
 */
export function isKeyframeGroup(value: unknown): value is AuthoredPluginGroup {
  if (!isObject(value)) return false;
  const names = Object.keys(value);
  if (names.length === 0) return false;
  return names.some((name) => PLUGIN_GROUP_SECTIONS.includes(name));
}

/**
 * Whether an entry is the pre-ADR-049 group form: properties directly under the plugin name.
 *
 * This is the body `isKeyframeGroup` used to have, kept for a different job. It is not detection
 * any more; it exists so a document written against the old shape is refused by name rather than
 * reported as a property with no stops array, which named the group and not the mistake. Refused,
 * never normalized: two authoring shapes are two validation paths and two documentation paths.
 * See ADR-049.
 *
 * Membership is "every member reads as a leaf", not "every member is an object", and that is the
 * whole of ADR-050's effect here. A legacy group written against the new leaf forms has arrays and
 * scalars for members, both of which `isObject` excludes by definition, so the object test would
 * have stopped recognising the very shape this predicate exists to refuse.
 *
 * The retired wrapper bails first. It is an object whose one member is an array, so it reads as a
 * one-leaf legacy group otherwise, and bailing here rather than relying on the caller's branch order
 * keeps the two refusals independent of each other.
 */
export function looksLikeLegacyGroup(value: unknown): boolean {
  if (!isObject(value) || readAuthoredLeaf(value).kind === "wrapper") return false;
  const names = Object.keys(value);
  if (names.length === 0) return false;
  if (names.some((name) => PLUGIN_GROUP_SECTIONS.includes(name))) return false;
  return names.every((name) => readAuthoredLeaf(value[name]).kind !== "invalid");
}

/**
 * The properties a group authored, or an empty record.
 *
 * The single reader of the `values` section, so `flattenAuthoredKeyframes`, `validateKeyframes`, and
 * 3D detection all ask one function rather than three that can disagree about what an author wrote.
 * Tolerant by design, exactly like `readPluginBindings`: a malformed section is empty here and
 * reported by `validateKeyframes`, which owns shape. See ADR-049.
 */
export function readPluginValues(group: unknown): Readonly<Record<string, unknown>> {
  if (!isObject(group)) return EMPTY_VALUES;
  const values = group[PLUGIN_VALUES_SECTION];
  return isObject(values) ? values : EMPTY_VALUES;
}

/**
 * Every plugin binding a keyframes record declares, ordered by plugin then slot.
 *
 * The single owner of reading the authored bindings, so `graph/ir.ts` derives its edges and
 * `PluginRegistry` resolves its slots from one reader rather than from two that can disagree about
 * what an author wrote. Deriving the edge is purely syntactic, which is what lets it run inside
 * `validateV5` without a plugin registry.
 *
 * The reserved goals slot is the one binding whose authored value is a record rather than a source
 * id, and it expands here into one binding per member id it names. That expansion is the whole of
 * how multi-goal solving reaches the graph: one authored section, one derived binding per goal, and
 * therefore one edge per goal, so `J-5` holds verbatim and nothing downstream learns a new shape.
 * Members are sorted, so which goal is read first is never a property of authoring order.
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
      if (slot === PLUGIN_GOALS_SLOT) {
        if (!isObject(source)) continue;
        for (const member of Object.keys(source).sort()) {
          const goalSource = source[member];
          if (typeof goalSource !== "string" || goalSource.length === 0) continue;
          const authoredPath = `${plugin}.${PLUGIN_REQUIRES_SECTION}.${PLUGIN_GOALS_SLOT}.${member}`;
          bindings.push(
            Object.freeze({
              plugin,
              slot: goalSlot(member),
              source: goalSource,
              authoredPath,
            }),
          );
        }
        continue;
      }
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
