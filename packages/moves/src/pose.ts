import { unreachable } from "./unreachable";

/** The point of a box that stays put while it scales and turns. */
export type Anchor = "center" | "bottom" | "top" | "left" | "right";

/** How two answers for one field on one target become one. */
export type Combining = "add" | "multiply" | "replace";

/** What a field of a value is: where it rests, how it combines, and what the gate asks of it. */
export interface ValueField {
  /** The amount that changes nothing; a field with none is never held to rest. */
  readonly rest?: number;
  readonly combines: Combining;
  /** Whether its path must be smooth; a scale may snap at a contact. */
  readonly smooth: boolean;
  /** Whether a reveal must end with it at its greatest. */
  readonly shows: boolean;
  /** The least it can be; a modifier that pushes it past that stops there. */
  readonly least?: number;
}

const OFFSET: ValueField = { rest: 0, combines: "add", smooth: true, shows: false };
const SIZE: ValueField = { rest: 1, combines: "multiply", smooth: false, shows: false };
const SHOWN: ValueField = { combines: "replace", smooth: true, shows: true };
const PLACED: ValueField = { combines: "replace", smooth: true, shows: false };

/** Every field a value can carry, one row each; nothing else states a field's rest or how it combines. */
export const VALUE_FIELDS = Object.freeze({
  x: OFFSET,
  y: OFFSET,
  z: OFFSET,
  rotation: OFFSET,
  rotationX: OFFSET,
  rotationY: OFFSET,
  scale: SIZE,
  scaleX: SIZE,
  scaleY: SIZE,
  scaleZ: SIZE,
  opacity: { rest: 1, combines: "multiply", smooth: true, shows: false },
  blur: { ...OFFSET, least: 0 },
  drawn: { rest: 1, combines: "replace", smooth: true, shows: true },
  drawnFrom: { rest: 0, combines: "replace", smooth: true, shows: false },
  clipX: PLACED,
  clipY: PLACED,
  clipRadius: SHOWN,
}) satisfies Readonly<Record<string, ValueField>>;

/** A number a piece names itself, under `custom`: it rests at 0 and adds, and each renderer says where it goes. */
export const CUSTOM_FIELD: ValueField = OFFSET;

const BY_NAME: ReadonlyMap<string, ValueField> = new Map(Object.entries(VALUE_FIELDS));

/** The row a field name has in the table, or nothing when it has none. */
export function valueField(name: string): ValueField | undefined {
  return BY_NAME.get(name);
}

/** The numbers a 2D pose carries, each a row of the table. */
export const POSE_2D_NUMBERS = Object.freeze([
  "x",
  "y",
  "rotation",
  "scale",
  "scaleX",
  "scaleY",
  "opacity",
  "blur",
  "drawn",
  "drawnFrom",
  "clipX",
  "clipY",
  "clipRadius",
] as const) satisfies readonly (keyof typeof VALUE_FIELDS)[];

/** A 2D pose, every field optional: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`,
 * `anchor` and `custom` numbers. Stage px, y down, degrees clockwise. */
export type Pose2d = { readonly [K in (typeof POSE_2D_NUMBERS)[number]]?: number } & {
  readonly anchor?: Anchor;
  readonly custom?: Readonly<Record<string, number>>;
};

/** A pose `weight` of the way into `squash` against the `anchor` side, `"bottom"` when absent; `"left"`
 * and `"right"` squash sideways. */
export function squashed(squash: number, weight: number, anchor: Anchor = "bottom"): Pose2d {
  const short = 1 - squash * weight;
  const wide = 1 + 0.9 * squash * weight;
  switch (anchor) {
    case "bottom":
    case "top":
    case "center":
      return { scaleX: wide, scaleY: short, anchor };
    case "left":
    case "right":
      return { scaleX: short, scaleY: wide, anchor };
    default:
      return unreachable(anchor);
  }
}

/** Every field a renderer must write for a pose: its numbers and its anchor. */
export const POSE_2D_FIELDS: readonly Exclude<keyof Pose2d, "custom">[] = Object.freeze([
  ...POSE_2D_NUMBERS,
  "anchor",
]);
