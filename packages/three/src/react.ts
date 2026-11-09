import { useCallback, useEffect, useState, type RefCallback } from "react";
import type { Pose3d } from "@motion5/moves";
import type { Player } from "@motion5/player";
import type { Object3D } from "three";
import { applyPose3d } from "./pose3d";

type Pose3dTargets<T> = { [K in keyof T]: T[K] extends Pose3d ? K : never }[keyof T];

function isPose(value: unknown): value is Pose3d {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Writes a 3D pose target onto the object the ref lands on, every step, with no React render. */
export function useTarget3d<T extends object, K extends Pose3dTargets<T>>(
  player: Player<T> | undefined,
  target: K,
  options: { readonly invalidate?: () => void } = {},
): RefCallback<Object3D> {
  const [object, setObject] = useState<Object3D | null>(null);
  const { invalidate } = options;
  useEffect(() => {
    if (player === undefined || object === null) return undefined;
    return player.subscribe(target, (value) => {
      if (!isPose(value)) return;
      applyPose3d(object, value);
      invalidate?.();
    });
  }, [player, object, target, invalidate]);
  return useCallback((next: Object3D | null) => setObject(next), []);
}
