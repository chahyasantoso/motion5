import { useCallback, useEffect, useState, type RefCallback } from "react";
import type { Pose3d } from "@gerak/core";
import type { Player } from "@gerak/player";
import { listPose3d } from "@gerak/stage";
import type { Object3D } from "three";
import { applyPose3d, captureRest3d } from "./pose3d";

type Pose3dListValue = readonly Pose3d[] | ((index: number, count: number) => Pose3d);
type Pose3dTargets<T> = { [K in keyof T]: T[K] extends Pose3d ? K : never }[keyof T];
type Pose3dListTargets<T> = {
  [K in keyof T]: T[K] extends Pose3dListValue ? K : never;
}[keyof T];

function isPose(value: unknown): value is Pose3d {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Writes a 3D pose target on the object the ref lands on, every step, with no render; its transform then is its rest. */
export function useTarget3d<T extends object, K extends Pose3dTargets<T>>(
  player: Player<T> | undefined,
  target: K,
  options?: { readonly invalidate?: () => void },
): RefCallback<Object3D>;
/** With `at`, binds only the `at`th pose of a list target; a missing index writes nothing, a bad one throws. */
export function useTarget3d<T extends object, K extends Pose3dListTargets<T>>(
  player: Player<T> | undefined,
  target: K,
  options: { readonly invalidate?: () => void; readonly at: number; readonly count?: number },
): RefCallback<Object3D>;
export function useTarget3d<T extends object>(
  player: Player<T> | undefined,
  target: keyof T,
  options: { readonly invalidate?: () => void; readonly at?: number; readonly count?: number } = {},
): RefCallback<Object3D> {
  const [object, setObject] = useState<Object3D | null>(null);
  const { invalidate, at, count } = options;
  if (at !== undefined && (!Number.isInteger(at) || at < 0)) {
    throw new RangeError(`useTarget3d: at must be a non-negative integer, got ${at}.`);
  }
  if (count !== undefined && (!Number.isInteger(count) || count < 1)) {
    throw new RangeError(`useTarget3d: count must be a positive integer, got ${count}.`);
  }
  useEffect(() => {
    if (player === undefined || object === null) return undefined;
    const rest = captureRest3d(object);
    return player.subscribe(target, (value: unknown) => {
      let pose: Pose3d | undefined;
      if (at === undefined) {
        pose = isPose(value) ? value : undefined;
      } else if (Array.isArray(value)) {
        const candidate: unknown = value[at];
        pose = isPose(candidate) ? candidate : undefined;
      } else {
        pose = listPose3d(value, at, count ?? at + 1);
      }
      if (pose === undefined) return;
      applyPose3d(object, pose, rest);
      invalidate?.();
    });
  }, [player, object, target, invalidate, at, count]);
  return useCallback((next: Object3D | null) => setObject(next), []);
}
