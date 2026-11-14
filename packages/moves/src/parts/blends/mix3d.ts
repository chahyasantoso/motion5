import {
  eulerFromMatrix3d,
  matrixFromQuaternion,
  quaternionFromEuler3d,
  slerpQuaternion,
} from "@gerak/rig";
import { VALUE_FIELDS } from "../../fields/pose";
import {
  NUMBERS,
  TURNS,
  eulerOf,
  writeEuler,
  type Mutable3d,
  type Pose3d,
} from "../../fields/pose3d";
import { mix, mixCustom } from "./mix";

/** A pose `share` of the way between two; turns take the short arc, past the ends too; a missing field rests. */
export function mixPose3d(from: Pose3d, to: Pose3d, share: number): Pose3d {
  const out: Mutable3d = {};
  for (const key of NUMBERS) {
    if (from[key] === undefined && to[key] === undefined) continue;
    const rest = VALUE_FIELDS[key].rest ?? 0;
    out[key] = mix(from[key] ?? rest, to[key] ?? rest, share);
  }
  const custom = mixCustom(from, to, share);
  if (custom !== undefined) out.custom = custom;
  if (TURNS.some((key) => from[key] !== undefined || to[key] !== undefined)) {
    const turn = slerpQuaternion(
      quaternionFromEuler3d(eulerOf(from)),
      quaternionFromEuler3d(eulerOf(to)),
      share,
    );
    writeEuler(out, eulerFromMatrix3d(matrixFromQuaternion(turn)));
  }
  return out;
}

/** A 3D point `share` of the way from `from` to `to`. */
export function mixPoint3d(
  from: { readonly x: number; readonly y: number; readonly z: number },
  to: { readonly x: number; readonly y: number; readonly z: number },
  share: number,
): { readonly x: number; readonly y: number; readonly z: number } {
  return { x: mix(from.x, to.x, share), y: mix(from.y, to.y, share), z: mix(from.z, to.z, share) };
}
