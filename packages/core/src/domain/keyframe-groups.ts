import {
  PLUGIN_VALUES_SECTION,
  readPluginBindings,
  readPluginValues,
} from "../contract/keyframe-shape";
import type { PluginRequiresBinding } from "../contract/v5";

export interface FlattenedKeyframe {
  /** The compiled key: the group leaf's name, with no prefix. */
  readonly key: string;
  /**
   * The plugin name the group addressed. Required, because every authored property is grouped: a
   * leaf resolves against that plugin alone, so its owner is named where it is written. ADR-121.
   */
  readonly group: string;
  /** `group.values.leaf`, relative to the keyframes record. Diagnostics cite this. */
  readonly authoredPath: string;
}
export interface FlattenedKeyframes {
  readonly keyframes: Readonly<Record<string, unknown>>;
  readonly entries: readonly FlattenedKeyframe[];
  readonly authoredPaths: ReadonlyMap<string, string>;
  /**
   * The plugin bindings authored in the groups, ordered by plugin then slot. Carried beside the
   * flattened properties rather than inside them, because a binding is metadata: flattened as a
   * leaf it would reach the percent map and the interpolator as a property with no stops, and the
   * track would compile without a diagnostic and then hold still. See ADR-044.
   */
  readonly bindings: readonly PluginRequiresBinding[];
}

/**
 * Expands plugin-named groups into the flat record everything downstream already understands.
 *
 * This is a pure syntactic transform with no registry, which is why it is here rather than inside
 * `PluginRegistry.resolveForKeyframes`. An `Engine` may be constructed with no `PluginRegistry` at
 * all; if flattening were the resolver's alone, that Engine would hand `compilePercentKeyframes`
 * and the interpolator a group object, both would read no stops from it, and the track would
 * compile without a single diagnostic and then hold still at every progress. Ownership of *which*
 * plugin owns a leaf stays with the registry, which is a different question from this one.
 *
 * Leaves keep their authored names. Prefixing them (`fk:length`) would rename the keys the owning
 * plugin's own `compose` reads and the adapters write, and ADR-042 then drops every namespaced key
 * before publication, so a grouped track would animate nothing and publish nothing. One canonical
 * spelling is instead guaranteed by reserving the colon in every authored keyframe name. See
 * ADR-041 and ADR-043.
 *
 * The `values` section is the only thing read here, which is what makes "`values` is the only
 * compiled value domain" structural rather than enforced. `requires` is not a sibling of the
 * leaves to be skipped any more; it is a section of its own, surfaced as `bindings`. See ADR-049.
 *
 * Only groups are read. An entry naming no section is refused by `validateKeyframes` as
 * `keyframes-ungrouped-key` and holds no `values` section, so `readPluginValues` reads it as empty
 * and it contributes nothing here: compiling it as a property would be a second owner of a spelling
 * the validator refuses. See ADR-121.
 *
 * Sorted, so which spelling wins is never a property of authoring order. A collision is already
 * rejected at validation by `keyframes-duplicate-key`, so nothing here reports it a second time.
 */
export function flattenAuthoredKeyframes(
  authored: Readonly<Record<string, unknown>>,
): FlattenedKeyframes {
  const keyframes: Record<string, unknown> = {};
  const entries: FlattenedKeyframe[] = [];
  const authoredPaths = new Map<string, string>();
  const claim = (entry: FlattenedKeyframe, property: unknown): void => {
    if (entry.key in keyframes) return;
    keyframes[entry.key] = property;
    entries.push(entry);
    authoredPaths.set(entry.key, entry.authoredPath);
  };
  for (const group of Object.keys(authored).sort()) {
    const values = readPluginValues(authored[group]);
    for (const leaf of Object.keys(values).sort()) {
      const authoredPath = `${group}.${PLUGIN_VALUES_SECTION}.${leaf}`;
      claim({ key: leaf, group, authoredPath }, values[leaf]);
    }
  }
  return Object.freeze({
    keyframes: Object.freeze(keyframes),
    entries: Object.freeze(entries),
    authoredPaths,
    bindings: readPluginBindings(authored),
  });
}
