/**
 * The IK goals slot, and the whole of what a reader with no registry needs to recognise one.
 *
 * A solver reaches for one goal per chain leaf, and the author names the leaf rather than counting
 * to it: `targets` maps a member id to the node whose frame that member pulls toward. An index can
 * never be wrong, so it silently means whatever the rig currently makes it mean; insert a bone or
 * reorder two tracks and a positional pairing keeps loading and now pulls the wrong limb. A member
 * id can be wrong, so it can be checked. That is the argument that retired `reach` in favour of a
 * named `root`, and it applies here without modification. See issue #195.
 *
 * The name is no longer a parser reservation, and this module is no longer a grammar. A dict-valued
 * slot is detected by shape under any name, and each derived binding carries its authored key as
 * `memberKey` rather than inside a formatted slot identity, so `readPluginBindings` has no reason to
 * know this constant exists at all. `goalSlot`, `readGoalSlot` and the slot regex are deleted with
 * the string encoding they built and parsed. See ADR-057.
 *
 * What survives is one literal with two readers, neither of which needs the literal to be a parsing
 * rule.
 *
 * `graph/ir.ts` reads it to classify goals on the compose channel. `goalBindingsOf` answers which
 * goals a node authored with no plugin registry in reach, so it gates on the base slot as well as
 * on the field: on `memberKey` alone it would read a future spring or spline plugin's dict as IK
 * goals and run six IK rules over it. `graph/legacy.ts` gates that whole classification, so a node
 * authored without a legacy definition never reaches it.
 *
 * `runtime/authoring-edit.ts` reads it to route a slot edit to the reserved-goal verb rather than
 * the generic group edit. The schema keeps no rule keyed on the name: a dict is recognised by its
 * value under any name.
 */

/** The `requires` slot whose authored value is a solver's goal dict rather than a source id. */
// F2 deletes this legacy goal slot with the compose channel.
export const PLUGIN_GOALS_SLOT = "targets";
