import { HANDLES, type Handle } from "../synthetic/handles";
import type { ActorFrame } from "../synthetic/actor";
import type { Vec3 } from "../synthetic/rotation";

/** How close a press must be to a handle's drawn wrist or ankle to grab it, stage pixels. */
export const GRAB_RADIUS_PX = 14;

/**
 * The handle drawn nearest `pointer` within `radiusPx`, or `undefined`: the four constrained
 * effectors of pose mode, picked where `project` draws them. Ties go to the first listed.
 */
export function pickHandle(
  frame: ActorFrame,
  project: (point: Vec3) => readonly number[] | undefined,
  pointer: readonly [number, number],
  radiusPx: number = GRAB_RADIUS_PX,
): Handle | undefined {
  let best: { handle: Handle; distance: number } | undefined;
  for (const handle of Object.keys(HANDLES) as Handle[]) {
    const at = project(frame.segments[HANDLES[handle].effector].origin);
    if (at === undefined) continue;
    const distance = Math.hypot(at[0]! - pointer[0], at[1]! - pointer[1]);
    if (distance <= radiusPx && (best === undefined || distance < best.distance))
      best = { handle, distance };
  }
  return best?.handle;
}
