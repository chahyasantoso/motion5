import { validateTrackDefinition, type TrackDefinition } from "@motion5/core";
import { BODY_3D_SPEC, SOLVED_3D_SPEC } from "../../plugins/src/aggregate-topology";
import { Matrix4, Vector3 } from "three";
import { frameFromMatrix } from "./index";
import {
  assertCapturedHierarchy,
  assertSkeletonScale,
  type CapturedBone,
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
  const validation = validateTrackDefinition({ id: idPrefix, input: {} }, "track");
  if (validation.diagnostics.some((diagnostic) => diagnostic.path.endsWith(".id")))
    throw new TypeError("Skeleton track idPrefix must be a non-empty unqualified track id.");
  assertCapturedHierarchy(binding);
  assertSkeletonScale(
    binding.bones.map(({ bone }) => bone),
    binding.rootParent,
  );
  const rootId = `${idPrefix}-root`;
  const bodyId = `${idPrefix}-body`;
  const solvedId = `${idPrefix}-solved`;
  const poseId = `${idPrefix}-pose`;
  const rowId = (bone: CapturedBone): string => bone.key ?? `${idPrefix}-bone-${bone.index}`;

  const rest = new Matrix4();
  const bodyValues = binding.bones.map((bone) => {
    const local = frameFromMatrix(rest.compose(bone.restPosition, bone.restQuaternion, UNIT));
    const parentBone = bone.parent !== undefined ? binding.bones[bone.parent] : undefined;
    return {
      id: rowId(bone),
      cells: {
        ...(parentBone === undefined ? {} : { parentId: rowId(parentBone) }),
        length: 0,
        weight: 1,
        ...local,
      },
    };
  });

  const solvedValues = binding.bones.map((bone) => ({
    id: rowId(bone),
    cells: {
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    },
  }));

  return [
    {
      id: rootId,
      input: {
        values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 },
      },
    },
    {
      id: bodyId,
      input: {
        schema: BODY_3D_SPEC,
        values: bodyValues,
      },
    },
    {
      id: solvedId,
      input: {
        schema: SOLVED_3D_SPEC,
        values: solvedValues,
      },
    },
    {
      id: poseId,
      plugin: "fk3d",
      input: {
        values: {},
        requires: {
          chain: bodyId,
          solved: solvedId,
          base: rootId,
        },
      },
    },
  ];
}
