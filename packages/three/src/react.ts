import { useCallback, useEffect, useState, type RefCallback } from "react";
import type { Pose3d } from "@gerak/moves";
import type { Player } from "@gerak/player";
import type { Object3D } from "three";
import { applyPose3d } from "./pose3d";

type Pose3dTargets<T> = { [K in keyof T]: T[K] extends Pose3d ? K : never }[keyof T];
type Pose3dListTargets<T> = {
  [K in keyof T]: T[K] extends readonly Pose3d[] ? K : never;
}[keyof T];

function isPose(value: unknown): value is Pose3d {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Writes a 3D pose target on the object the ref lands on, every step, with no render; its position then is its rest. */
export function useTarget3d<T extends object, K extends Pose3dTargets<T>>(
  player: Player<T> | undefined,
  target: K,
  options?: { readonly invalidate?: () => void },
): RefCallback<Object3D>;
/** With `at`, binds only the `at`th pose of a list target; a missing index writes nothing, a bad one throws. */
export function useTarget3d<T extends object, K extends Pose3dListTargets<T>>(
  player: Player<T> | undefined,
  target: K,
  options: { readonly invalidate?: () => void; readonly at: number },
): RefCallback<Object3D>;
export function useTarget3d<T extends object>(
  player: Player<T> | undefined,
  target: keyof T,
  options: { readonly invalidate?: () => void; readonly at?: number } = {},
): RefCallback<Object3D> {
  const [object, setObject] = useState<Object3D | null>(null);
  const { invalidate, at } = options;
  if (at !== undefined && (!Number.isInteger(at) || at < 0)) {
    throw new RangeError(`useTarget3d: at must be a non-negative integer, got ${at}.`);
  }
  useEffect(() => {
    if (player === undefined || object === null) return undefined;
    const rest = { x: object.position.x, y: object.position.y, z: object.position.z };
    return player.subscribe(target, (value: unknown) => {
      const pose = at === undefined ? value : Array.isArray(value) ? value[at] : undefined;
      if (!isPose(pose)) return;
      applyPose3d(object, pose, rest);
      invalidate?.();
    });
  }, [player, object, target, invalidate, at]);
  return useCallback((next: Object3D | null) => setObject(next), []);
}
