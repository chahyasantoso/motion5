import type { ProjectHandle } from "@motion5/core";
import { rowPatchSource, type PatchSource } from "@motion5/react/engine";
import { TENTACLE, nodeId } from "./ik-playground-project";
import { IK3D, IK3D_NODE_ID } from "./ik3d-playground-project";

/**
 * Consumer aliases over the two rigs' published pose and goal tables.
 *
 * A member and a goal are rows, not nodes. The stages keep addressing them by their marker ids, so
 * this module is the one place that says which row answers which id; every alias is the generic row
 * projection, and every id it does not name — the root, the pole, the solver and the pose node
 * itself — reaches the runtime unchanged. Nothing here creates an engine node or a subscription
 * until a consumer subscribes.
 */
function composite(handle: ProjectHandle, aliases: ReadonlyMap<string, PatchSource>): PatchSource {
  return {
    get(nodeId) {
      const alias = aliases.get(nodeId);
      return alias === undefined ? handle.get(nodeId) : alias.get(nodeId);
    },
    subscribeNode(nodeId, listener) {
      const alias = aliases.get(nodeId);
      return alias === undefined
        ? handle.subscribeNode(nodeId, listener)
        : alias.subscribeNode(nodeId, listener);
    },
  };
}

function memberAliases(
  handle: ProjectHandle,
  poseNodeId: string,
  members: readonly string[],
  aliasOf: (member: string) => string,
): Map<string, PatchSource> {
  const aliases = new Map<string, PatchSource>();
  for (const member of members) {
    const alias = aliasOf(member);
    aliases.set(
      alias,
      rowPatchSource(handle, { nodeId: poseNodeId, output: "values", rowId: member, as: alias }),
    );
  }
  return aliases;
}

/** The 2D rig's member and goal aliases over its pose and goals rows. */
export function planarRowSource(handle: ProjectHandle): PatchSource {
  const aliases = memberAliases(handle, nodeId(TENTACLE.poseTrack), TENTACLE.memberTracks, nodeId);
  const goal = nodeId(TENTACLE.goalTrack);
  aliases.set(
    goal,
    rowPatchSource(handle, {
      nodeId: nodeId(TENTACLE.goalsTrack),
      output: "values",
      rowId: TENTACLE.goalRowId,
      as: goal,
    }),
  );
  return composite(handle, aliases);
}

/** The 3D rig's member and goal aliases over its pose and goals rows. */
export function spatialRowSource(handle: ProjectHandle): PatchSource {
  const aliases = memberAliases(
    handle,
    IK3D_NODE_ID(IK3D.poseTrack),
    IK3D.memberTracks,
    IK3D_NODE_ID,
  );
  const goal = IK3D_NODE_ID(IK3D.goalTrack);
  aliases.set(
    goal,
    rowPatchSource(handle, {
      nodeId: IK3D_NODE_ID(IK3D.goalsTrack),
      output: "values",
      rowId: IK3D.goalRowId,
      as: goal,
    }),
  );
  return composite(handle, aliases);
}
