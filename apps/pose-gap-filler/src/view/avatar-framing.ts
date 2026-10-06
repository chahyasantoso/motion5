import {
  Box3,
  Mesh,
  SkinnedMesh,
  Sphere,
  Vector3,
  type Object3D,
  type PerspectiveCamera,
  type Skeleton,
} from "three";

/**
 * Joints sit inside the skin and the head top, hands and feet extend past the last joints, so a
 * skeleton's joint box grows by this fraction of its largest side on every face.
 */
export const SKIN_MARGIN = 0.15;

/**
 * Frame only currently visible presentation geometry, never synthetic truth or hidden stale meshes.
 * Reused scratch objects keep the per-frame cost bounded by the small avatar's visible mesh count.
 * A skinned mesh is framed from its skeleton's joint positions plus `SKIN_MARGIN`, never from a
 * per-draw vertex pass (`SkinnedMesh.computeBoundingBox` costs milliseconds at 20k vertices).
 */
export function createAvatarFraming() {
  const bounds = new Box3();
  const meshBounds = new Box3();
  const sphere = new Sphere();
  const point = new Vector3();
  const framed = new Set<Skeleton>();
  return (camera: PerspectiveCamera, root: Object3D, yawDeg: number, pitchDeg: number): void => {
    bounds.makeEmpty();
    framed.clear();
    root.updateWorldMatrix(true, true);
    root.traverseVisible((object) => {
      if (!(object instanceof Mesh)) return;
      if (object instanceof SkinnedMesh) {
        if (framed.has(object.skeleton)) return;
        framed.add(object.skeleton);
        meshBounds.makeEmpty();
        for (const bone of object.skeleton.bones)
          meshBounds.expandByPoint(point.setFromMatrixPosition(bone.matrixWorld));
        if (meshBounds.isEmpty()) return;
        meshBounds.getSize(point);
        bounds.union(meshBounds.expandByScalar(Math.max(point.x, point.y, point.z) * SKIN_MARGIN));
        return;
      }
      const geometry = object.geometry;
      if (geometry.boundingBox === null) geometry.computeBoundingBox();
      if (geometry.boundingBox === null) return;
      meshBounds.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld);
      bounds.union(meshBounds);
    });
    if (bounds.isEmpty()) {
      sphere.center.set(0, 0.35, 0);
      sphere.radius = 0.9;
    } else {
      bounds.getBoundingSphere(sphere);
    }
    // The narrower field of view determines fit, including portrait/narrow viewports.
    const verticalHalfFov = (camera.fov * Math.PI) / 360;
    const horizontalHalfFov = Math.atan(Math.tan(verticalHalfFov) * camera.aspect);
    const radius = Math.max(0.01, sphere.radius);
    const distance = (radius * 1.15) / Math.sin(Math.min(verticalHalfFov, horizontalHalfFov));
    const yaw = (yawDeg * Math.PI) / 180;
    const pitch = (pitchDeg * Math.PI) / 180;
    camera.position.set(
      sphere.center.x + distance * Math.sin(yaw) * Math.cos(pitch),
      sphere.center.y + distance * Math.sin(pitch),
      sphere.center.z + distance * Math.cos(yaw) * Math.cos(pitch),
    );
    camera.near = Math.max(0.001, distance / 1000);
    camera.far = distance + radius * 2 + 1;
    camera.lookAt(sphere.center);
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  };
}
