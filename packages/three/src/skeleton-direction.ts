import type { Vector3 } from "three";

/** Normalize without squaring huge finite components; keep the absolute 1e-9 length rule. */
export function normalizeDirection(direction: Vector3): boolean {
  const maximum = Math.max(Math.abs(direction.x), Math.abs(direction.y), Math.abs(direction.z));
  if (!Number.isFinite(maximum) || maximum === 0) return false;
  direction.divideScalar(maximum);
  const length = direction.length();
  if (maximum <= 1e-9 && maximum * length <= 1e-9) return false;
  direction.divideScalar(length);
  return true;
}
