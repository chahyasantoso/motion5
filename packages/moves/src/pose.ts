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
}

const OFFSET: ValueField = { rest: 0, combines: "add", smooth: true, shows: false };
const SIZE: ValueField = { rest: 1, combines: "multiply", smooth: false, shows: false };
const SHOWN: ValueField = { combines: "replace", smooth: true, shows: true };

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
  drawn: SHOWN,
  radius: SHOWN,
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
] as const) satisfies readonly (keyof typeof VALUE_FIELDS)[];

/** A 2D pose: table fields, the anchor, and the piece's own `custom` numbers; each renderer writes it its way. */
export type Pose2d = { readonly [K in (typeof POSE_2D_NUMBERS)[number]]?: number } & {
  readonly anchor?: Anchor;
  readonly custom?: Readonly<Record<string, number>>;
};

/** A box `weight` of the way into its `squash` against the `anchor` side, which stays put; widens the other way. */
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
