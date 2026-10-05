import { validateTrackDefinition, type TrackDefinition } from "@motion5/core";
import { Matrix4, Vector3 } from "three";
import { frameFromMatrix } from "./index";
import {
  assertCapturedHierarchy,
  assertSkeletonScale,
  type SkeletonBinding,
} from "./skeleton-capture";

const UNIT = Object.freeze(new Vector3(1, 1, 1));

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
  assertCapturedHierarchy(binding);
  assertSkeletonScale(
    binding.bones.map(({ bone }) => bone),
    binding.rootParent,
  );
  const rootId = `${idPrefix}-root`;
  const boneId = (index: number) => `${idPrefix}-bone-${index}`;
  const tracks: TrackDefinition[] = [
    { id: rootId, keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
  ];
  const bones: Record<string, string> = {};
  const rest = new Matrix4();
  for (const bone of binding.bones) {
    const local = frameFromMatrix(rest.compose(bone.restPosition, bone.restQuaternion, UNIT));
    tracks.push({
      id: boneId(bone.index),
      keyframes: {
        fk3d: {
          values: { length: 0, ...local },
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
