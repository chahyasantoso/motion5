import type { GroupedTrackDefinition } from "../contract/v5";
import {
  readBoundGroup,
  type AuthoredKeyframes,
  type BoundGroup,
} from "../domain/authoring/keyframes";
import { unboundGroup } from "./schema-refusals";

/** One authored record and the group inside it an edit was proved to be able to address. */
export interface GroupTarget {
  readonly keyframes: AuthoredKeyframes;
  readonly bound: BoundGroup;
}

/**
 * The group `plugin` authors on this node, or the refusal that it authors none.
 *
 * The shared precondition for the two property verbs that remain on the handle. It reads through
 * `readBoundGroup` and duplicates no shape logic of its own, and it refuses `keyframe-group-unbound`
 * rather than creating anything: originating a group is a whole-definition edit, so the remedy names
 * `track.replace` and `track.input.replace` rather than a verb this layer no longer owns.
 */
export function boundGroup(
  nodeId: string,
  track: GroupedTrackDefinition,
  plugin: string,
): GroupTarget {
  const keyframes = track.keyframes;
  const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
  if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);
  return { keyframes, bound };
}
