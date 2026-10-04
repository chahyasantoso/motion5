import type { StageSize } from "../filler/adapter";
import { DEG, cross3, scale3, sub3, add3, type Vec3 } from "./rotation";
import { unit, dot } from "../filler/vec";

/**
 * A pinhole camera in the synthetic scene: where it is, what it looks at, and its vertical field of
 * view over the stage it renders. The world's up is +y; a camera looking straight up or down has no
 * defined roll and is refused.
 */
export interface CameraSpec {
  readonly position: Vec3;
  readonly target: Vec3;
  readonly verticalFovDeg: number;
  readonly stage: StageSize;
}

/**
 * A camera's basis and intrinsics, in MediaPipe's camera-aligned axes: `right` is +x on the image,
 * `down` is +y, `forward` is +z away from the camera, so a camera point is `[x, y, z]` with z its
 * depth. Built once per spec; every projection reads it.
 */
export interface Camera {
  readonly spec: CameraSpec;
  readonly right: Vec3;
  readonly down: Vec3;
  readonly forward: Vec3;
  /** Focal length in stage pixels. */
  readonly focal: number;
  /** A scene point in camera axes, metres, relative to the camera's centre. */
  toCamera(point: Vec3): Vec3;
  /** The stage pixel a camera point is seen at, or `undefined` behind or on the image plane. */
  pixel(camera: Vec3): readonly [number, number] | undefined;
  /** The scene point seen at stage pixel `(u, v)` at camera depth `depth`. */
  unproject(u: number, v: number, depth: number): Vec3;
}

const WORLD_UP: Vec3 = [0, 1, 0];
/** Nearer than this in front of the camera is not imaged; it is behind the camera's lens. */
export const NEAR_M = 0.05;

export function createCamera(spec: CameraSpec): Camera {
  const { width, height } = spec.stage;
  if (!(width > 0 && height > 0)) throw new Error("Camera stage must be positive.");
  if (!(spec.verticalFovDeg > 1 && spec.verticalFovDeg < 179))
    throw new Error("Camera field of view must be between 1 and 179 degrees.");
  const forward = unit(sub3(spec.target, spec.position)) as Vec3 | undefined;
  if (forward === undefined) throw new Error("Camera target must differ from its position.");
  const right = unit(cross3(forward, WORLD_UP)) as Vec3 | undefined;
  if (right === undefined) throw new Error("Camera must not look straight up or down.");
  const down = cross3(forward, right);
  const focal = height / 2 / Math.tan((spec.verticalFovDeg * DEG) / 2);
  return {
    spec,
    right,
    down,
    forward,
    focal,
    toCamera(point) {
      const offset = sub3(point, spec.position);
      return [dot(offset, right), dot(offset, down), dot(offset, forward)];
    },
    pixel([x, y, z]) {
      if (!(z > NEAR_M)) return undefined;
      return [width / 2 + (focal * x) / z, height / 2 + (focal * y) / z];
    },
    unproject(u, v, depth) {
      const x = ((u - width / 2) * depth) / focal;
      const y = ((v - height / 2) * depth) / focal;
      return add3(
        spec.position,
        add3(scale3(right, x), add3(scale3(down, y), scale3(forward, depth))),
      );
    },
  };
}

/**
 * The default observation camera: 2.6 m in front of the standing actor's hips, at hip height, with
 * a 50 degree vertical field of view, so a 1.7 m person fills about 70% of the stage height, the
 * legacy synthetic subject's framing.
 */
export function defaultCameraSpec(stage: StageSize, hips: Vec3): CameraSpec {
  return { position: [hips[0], hips[1], hips[2] + 2.6], target: hips, verticalFovDeg: 50, stage };
}

/** An orbit around `target`: `yawDeg` about +y from +z, `pitchDeg` up, `distance` metres. */
export function orbitCameraSpec(
  target: Vec3,
  yawDeg: number,
  pitchDeg: number,
  distance: number,
  stage: StageSize,
  verticalFovDeg = 50,
): CameraSpec {
  const yaw = yawDeg * DEG;
  const pitch = Math.max(-80, Math.min(80, pitchDeg)) * DEG;
  const offset: Vec3 = [
    distance * Math.cos(pitch) * Math.sin(yaw),
    distance * Math.sin(pitch),
    distance * Math.cos(pitch) * Math.cos(yaw),
  ];
  return { position: add3(target, offset), target, verticalFovDeg, stage };
}
