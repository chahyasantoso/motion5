import type { PluginInputs } from "../../src/domain/plugins";
import { fk3dPlugin } from "../../../plugins/src/fk3d";
import { readFrame3d, type WorldFrame3d } from "../../../plugins/src/frame3d";
import { canonicalChain } from "../../../plugins/src/ik-topology";
import type { ChainMember3d } from "../../../plugins/src/ik3d-chain";
import type { SolveResult3d } from "../../../plugins/src/ik3d-result";

/**
 * Every member's published world frame, composed by `fk3d` itself from a 3D solve's local triples:
 * the independent witness a closure test reads, so no test measures a solve by the solve's own
 * arithmetic (issue #500 phase 5, ADR-122).
 *
 * Members are composed in canonical order, so a member always reads its base's frame whatever order
 * the caller listed them in; a base that names no member is the root. Each member composes at full
 * weight with its authored length, offset and rest, which is what a delivered member carries.
 */
export function composeChain3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  result: Pick<SolveResult3d, "rotations3d">,
): Readonly<Record<string, WorldFrame3d>> {
  const { byId, ids } = canonicalChain(members);
  const frames: Record<string, WorldFrame3d> = {};
  for (const id of ids) {
    const member = byId.get(id)!;
    const inputs = { base: frames[member.base] ?? root, solver: result };
    const values = { length: member.length, ...member.offset, ...member.rest };
    frames[id] = readFrame3d(fk3dPlugin.compose(values, 1, inputs as PluginInputs, id));
  }
  return frames;
}

/** The distance from a composed frame's position to a goal's. */
export function frameDistance3d(a: WorldFrame3d, b: WorldFrame3d): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}
