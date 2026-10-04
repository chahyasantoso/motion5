import { Box3, Mesh, Sphere, type Object3D, type PerspectiveCamera } from "three";

/**
 * Frame only currently visible presentation geometry, never synthetic truth or hidden stale meshes.
 * Reused scratch objects keep the per-frame cost bounded by the small avatar's visible mesh count.
 */
export function createAvatarFraming() {
  const bounds = new Box3();
  const meshBounds = new Box3();
  const sphere = new Sphere();
  return (camera: PerspectiveCamera, root: Object3D, yawDeg: number, pitchDeg: number): void => {
    bounds.makeEmpty();
    root.updateWorldMatrix(true, true);
    root.traverseVisible((object) => {
      if (!(object instanceof Mesh)) return;
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
