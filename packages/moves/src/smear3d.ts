import { eulerFromMatrix3d, IDENTITY_MATRIX3, swingFrame3d, transposeMatrix3 } from "@motion5/rig";
import type { Pose3d } from "./pose3d";

/** Stretches along travel by `stretch` per unit a second up to `max`, volume kept; reversing never flips it; `turn` undoes it. */
export function smear3d(
  velocity: { readonly vx: number; readonly vy: number; readonly vz: number },
  options: { readonly stretch: number; readonly max: number },
): { readonly pose: Pose3d; readonly turn: Pose3d } {
  if (!(options.stretch >= 0)) throw new RangeError("smear3d: stretch must be 0 or more.");
  if (!(options.max >= 1)) throw new RangeError("smear3d: max must be 1 or more.");
  const speed = Math.hypot(velocity.vx, velocity.vy, velocity.vz);
  if (options.stretch === 0 || speed === 0) return { pose: {}, turn: {} };
  const s = Math.min(options.max, 1 + options.stretch * speed);
  const { vx, vy, vz } = velocity;
  const back = vx < 0 || (vx === 0 && (vy < 0 || (vy === 0 && vz < 0)));
  const frame = swingFrame3d(IDENTITY_MATRIX3, back ? [-vx, -vy, -vz] : [vx, vy, vz]);
  const side = 1 / Math.sqrt(s);
  return {
    pose: { ...eulerFromMatrix3d(frame), scaleX: s, scaleY: side, scaleZ: side },
    turn: { ...eulerFromMatrix3d(transposeMatrix3(frame)) },
  };
}
