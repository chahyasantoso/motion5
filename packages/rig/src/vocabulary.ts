import { unreachable } from "./unreachable";

/** Lower local-angle bound, in degrees. */
export const MIN_ROTATION_KEY = "minRotation" as const;
/** Upper local-angle bound, in degrees. */
export const MAX_ROTATION_KEY = "maxRotation" as const;
/** Member's static positive weight on its leaf's goal; read when branches disagree. */
export const INFLUENCE_KEY = "influence" as const;

/** Default for omitted `minRotation`; domain floor. */
export const LIMIT_FLOOR = -180;
/** Default for omitted `maxRotation`; domain ceiling. */
export const LIMIT_CEILING = 180;

/** Sole limit-domain predicate: a degree in `[-180, 180]`, else `undefined`. */
export function readLimitDegree(value: unknown): number | undefined {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= LIMIT_FLOOR &&
    value <= LIMIT_CEILING
    ? value
    : undefined;
}

/** Four 3D joint kinds; omitted `joint` = `free`, constraining nothing. */
export type JointKind = "free" | "hinge" | "cone" | "swing-twist";

/** Whether `kind` constrains the solve: all but `free`. */
export function jointConstrains(kind: JointKind): boolean {
  switch (kind) {
    case "free":
      return false;
    case "hinge":
    case "cone":
    case "swing-twist":
      return true;
    default:
      return unreachable(kind);
  }
}

/** Sole influence predicate: finite and > 0, else `undefined`. */
export function readInfluenceValue(value: unknown): number | undefined {
  // Zero excluded: weighted compromise divides by influence sum.
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}
