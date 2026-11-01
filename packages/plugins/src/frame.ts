/** Shared world frame; the one composition plugins may not copy. */

/** Pivot and direction in world space: keys a plugin publishes. */
export interface WorldFrame {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

/** World-space position; no direction. */
export interface WorldPoint {
  readonly x: number;
  readonly y: number;
}

/** Authored pivot offset, in base's rotated frame. */
export interface PivotOffset {
  readonly x: number;
  readonly y: number;
}

/** Extent and child offset as one rigid link: length, twist in degrees. */
export interface EffectiveLink {
  readonly length: number;
  readonly twist: number;
}

const ORIGIN: WorldFrame = Object.freeze({ x: 0, y: 0, rotation: 0 });

/** Offset when no pivot is authored; shared, not allocated. */
export const ZERO_PIVOT_OFFSET: PivotOffset = Object.freeze({ x: 0, y: 0 });

/** Finite number or `fallback`; non-finite replaced, not propagated. */
export function readNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

/** `value` in `[min, max]`; `NaN` propagates, so `readNumber` first. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/** `from` toward `to` by `weight`, shorter arc; 0 or 1 returns that endpoint untouched. */
export function lerpAngle(from: number, to: number, weight: number): number {
  if (weight <= 0) return from;
  if (weight >= 1) return to;
  const delta = to - from;
  // Wrapped to `(-180, 180]`: `ceil` makes half-turn tie positive, `floor` negative.
  return from + (delta - 360 * Math.ceil((delta - 180) / 360)) * weight;
}

/** Requirement slot as world frame; parts default zero, so unbound root gets origin. */
export function readFrame(input: unknown): WorldFrame {
  if (input === null || typeof input !== "object" || Array.isArray(input)) return ORIGIN;
  const record = input as Readonly<Record<string, unknown>>;
  return {
    x: readNumber(record.x),
    y: readNumber(record.y),
    rotation: readNumber(record.rotation),
  };
}

/** Value namespace as pivot offset; both keys default to zero. */
export function readPivotOffset(values: { readonly [key: string]: unknown }): PivotOffset {
  return { x: readNumber(values.x), y: readNumber(values.y) };
}

/** Degrees to radians, `(degrees * Math.PI) / 180`; overflow reduces whole turns. */
export function toRadians(degrees: number): number {
  const radians = (degrees * Math.PI) / 180;
  return Number.isFinite(radians) || !Number.isFinite(degrees)
    ? radians
    : ((degrees % 360) * Math.PI) / 180;
}

/** Sole rotate-then-translate: `local` in `parent`'s frame. */
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

/** Base tip moved by offset in base's rotated frame; zero offset returns tip, keeping `-0`. */
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

/** Inverse: base tip landing the pivot on `pivot`; offset negated. */
export function baseTipFromPivot(
  pivot: WorldPoint,
  direction: number,
  offset: PivotOffset,
): { x: number; y: number } {
  return pivotFromBaseTip(pivot, direction, { x: -offset.x, y: -offset.y });
}

/** Sole owner of negative `length`: zero extent, not error; a test, not `Math.max`, keeping `-0`. */
export function segmentExtent(length: number): number {
  return length < 0 ? 0 : length;
}

/** Extent plus offset as one rigid link; zero offset keeps extent, twist 0, unlike `hypot`. */
export function effectiveLink(length: number, offset: PivotOffset): EffectiveLink {
  const extent = segmentExtent(length);
  if (offset.x === 0 && offset.y === 0) return { length: extent, twist: 0 };
  const reach = extent + offset.x;
  return {
    length: Math.hypot(reach, offset.y),
    twist: (Math.atan2(offset.y, reach) * 180) / Math.PI,
  };
}
