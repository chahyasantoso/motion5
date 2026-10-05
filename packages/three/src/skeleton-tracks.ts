import { validateTrackDefinition, type TrackDefinition } from "@motion5/core";
import { Euler } from "three";
import { EULER_ORDER_3D } from "./index";
import { assertSkeletonScale, type SkeletonBinding } from "./skeleton-capture";

export interface SkeletonTracksOptions {
  readonly idPrefix: string;
}

/** Zero-length FK publishes each bone pivot, never its tip. References are local track ids. */
export function skeletonTracks(
  binding: SkeletonBinding,
  { idPrefix }: SkeletonTracksOptions,
): readonly TrackDefinition[] {
  const validation = validateTrackDefinition({ id: idPrefix, keyframes: {} }, "track");
  if (validation.diagnostics.some((diagnostic) => diagnostic.path.endsWith(".id")))
    throw new TypeError("Skeleton track idPrefix must be a non-empty unqualified track id.");
  assertSkeletonScale(binding.skeleton, binding.rootParent);
  const rootId = `${idPrefix}-root`;
  const boneId = (index: number) => `${idPrefix}-bone-${index}`;
  const tracks: TrackDefinition[] = [
    { id: rootId, keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
  ];
  const bones: Record<string, string> = {};
  for (const bone of binding.bones) {
    const euler = new Euler().setFromQuaternion(bone.restQuaternion, EULER_ORDER_3D);
    const degrees = 180 / Math.PI;
    tracks.push({
      id: boneId(bone.index),
      keyframes: {
        fk3d: {
          values: {
            length: 0,
            x: bone.restPosition.x,
            y: bone.restPosition.y,
            z: bone.restPosition.z,
            rotation: euler.z * degrees,
            rotationX: euler.x * degrees,
            rotationY: euler.y * degrees,
          },
          requires: { base: bone.parent === undefined ? rootId : boneId(bone.parent) },
        },
      },
    });
    if (bone.key !== undefined)
      Object.defineProperty(bones, bone.key, {
        value: boneId(bone.index),
        enumerable: true,
        configurable: true,
        writable: true,
      });
  }
  tracks.push({ id: `${idPrefix}-rig`, keyframes: { rig: { requires: { bones } } } });
  return tracks;
}
