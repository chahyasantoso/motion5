/** The world frame the kinematic plugins share, and the composition they may not each copy. */

/** A pivot and a direction in world space: the keys a kinematic plugin publishes. */
export interface WorldFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

/** A position in world space, with no direction of its own. */
export interface WorldPoint {
  readonly x: number;
  readonly y: number;
}

/** A member's authored pivot offset, read in its base's rotated frame. */
export interface PivotOffset {
  readonly x: number;
  readonly y: number;
}

/** A member's extension and its child's offset reduced to one rigid link and a twist in degrees. */
export interface EffectiveLink {
  readonly length: number;
  readonly twist: number;
}

const ORIGIN: WorldFrame = Object.freeze({ x: 0, y: 0, rotation: 0 });

/** The offset a member authoring no pivot carries, shared rather than allocated. */
export const ZERO_PIVOT_OFFSET: PivotOffset = Object.freeze({ x: 0, y: 0 });

/** A finite number, or `fallback`: a non-finite value is replaced, not propagated. */
export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** `value` held inside `[min, max]`, propagating `NaN`, so callers use `readNumber` first. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** `from` blended toward `to` by `weight` along the shorter arc; 0 or 1 returns that endpoint untouched, not computed. */
export function lerpAngle(from: number, to: number, weight: number): number {
  if (weight <= 0) return from;
  if (weight >= 1) return to;
  const delta = to - from;
  // Wrapped into `(-180, 180]`: `ceil` puts the half-turn tie positive, `floor` negative.
  return from + (delta - 360 * Math.ceil((delta - 180) / 360)) * weight;
}

/** A requirement slot read as a world frame, each part defaulting to zero, so an unbound root gets the origin. */
export function readFrame(input: unknown): WorldFrame {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return ORIGIN;
  const record = input as Readonly<Record<string, unknown>>;
  return {
    x: readNumber(record.x),
    y: readNumber(record.y),
    rotation: readNumber(record.rotation),
  };
}

/** Reads a value namespace as a pivot offset, both keys defaulting to zero. */
export function readPivotOffset(values: { readonly [key: string]: unknown }): PivotOffset {
  return { x: readNumber(values.x), y: readNumber(values.y) };
}

/** Degrees as radians, `(degrees * Math.PI) / 180`, whole turns reduced only where that product overflows. */
export function toRadians(degrees: number): number {
  const radians = (degrees * Math.PI) / 180;
  return Number.isFinite(radians) || !Number.isFinite(degrees)
    ? radians
    : ((degrees % 360) * Math.PI) / 180;
}

/** The package's only rotate-then-translate: `local` in `parent`'s frame, rotated then translated. */
export function composeWorld(
  parent: { x: number; y: number; rotation: number },
  local: { x: number; y: number; rotation: number },
): { x: number; y: number; rotation: number } {
  const rad = toRadians(parent.rotation);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: parent.x + (local.x * cos - local.y * sin),
    y: parent.y + (local.x * sin + local.y * cos),
    rotation: parent.rotation + local.rotation,
  };
}

/** The base's tip moved by the offset in the base's rotated frame; a zero offset returns the tip, since computing it flips a `-0`. */
export function pivotFromBaseTip(
  tip: WorldPoint,
  direction: number,
  offset: PivotOffset,
): { x: number; y: number } {
  if (offset.x === 0 && offset.y === 0) return { x: tip.x, y: tip.y };
  const composed = composeWorld(
    { x: tip.x, y: tip.y, rotation: direction },
    { x: offset.x, y: offset.y, rotation: 0 },
  );
  return { x: composed.x, y: composed.y };
}

/** The inverse: the base's tip that puts a member's pivot on `pivot`, negating the offset. */
export function baseTipFromPivot(
  pivot: WorldPoint,
  direction: number,
  offset: PivotOffset,
): { x: number; y: number } {
  return pivotFromBaseTip(pivot, direction, { x: -offset.x, y: -offset.y });
}

/** The one owner of a negative authored `length`: no extent, not an error, and a test rather than `Math.max`, so `-0` keeps its sign. */
export function segmentExtent(length: number): number {
  return length < 0 ? 0 : length;
}

/** The member's extent and its child's offset as one rigid link; a zero offset returns the extent and no twist, which `hypot` would not. */
export function effectiveLink(length: number, offset: PivotOffset): EffectiveLink {
  const extent = segmentExtent(length);
  if (offset.x === 0 && offset.y === 0) return { length: extent, twist: 0 };
  const reach = extent + offset.x;
  return {
    length: Math.hypot(reach, offset.y),
    twist: (Math.atan2(offset.y, reach) * 180) / Math.PI,
  };
}
