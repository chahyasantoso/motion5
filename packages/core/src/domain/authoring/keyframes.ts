import { isKeyframeGroup } from "../../contract/keyframe-shape";
import type { AuthoredKeyframe, AuthoredPluginGroup } from "../../contract/v5";

/**
 * The one reader of an authored grouped-keyframes record.
 *
 * The record is the compile bridge `GroupedTrackDefinition` still carries while the grouped
 * keyframe engine remains: `parseTrackDefinition` refuses an authored `keyframes` member by name,
 * so nothing reaches this module from a v5 document. What survives here is the read the bridge
 * needs and the type that names its shape; the pure editors that used to write it were retired with
 * the verbs that called them, because the identified-table edit surface writes `input.values`
 * instead. The type survives until Phase 5 deletes the compiled bridge with it.
 */
export type AuthoredKeyframes = Readonly<Record<string, AuthoredKeyframe>>;

/**
 * One plugin group that is known to exist on a record, with the name it was found under.
 *
 * The name and the group travel as one value from one reader, so no reader can be handed a group
 * belonging to a different plugin than the one it asked about.
 */
export interface BoundGroup {
  readonly plugin: string;
  readonly group: AuthoredPluginGroup;
}

/**
 * The group `plugin` authors on this record, or `undefined` when it authors none.
 *
 * `isKeyframeGroup` is the detector: a group is an object naming at least one reserved section,
 * which is exact rather than a guess about the shape of the leaves. A retained record holds nothing
 * else under a plugin name, since an ungrouped entry is refused at load as
 * `keyframes-ungrouped-key`, so `undefined` here means the node authors no group for `plugin`.
 * See ADR-121.
 */
export function readBoundGroup(
  keyframes: AuthoredKeyframes,
  plugin: string,
): BoundGroup | undefined {
  const group = keyframes[plugin];
  return isKeyframeGroup(group) ? Object.freeze({ plugin, group }) : undefined;
}
