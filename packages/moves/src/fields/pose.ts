import { unreachable } from "../unreachable";

/** The point of a box that stays put while it scales and turns. */
export type Anchor = "center" | "bottom" | "top" | "left" | "right";

/** How two answers for one field on one target become one. */
export type Combining = "add" | "multiply" | "replace";

/** What a field's number is measured in. */
export type Unit = "px" | "deg" | "scale" | "share" | "index" | "order" | "number";

/** Which pose types carry a field: the 2D pose, the 3D pose, or both. */
export type Dimension = "2d" | "3d" | "both";

/** What a field of a value is: what it changes, its unit, which poses carry it, where it rests, how it combines, and what the gate asks of it. */
export interface ValueField {
  /** One sentence: what the field changes on screen. */
  readonly meaning: string;
  /** What its number is measured in. */
  readonly unit: Unit;
  /** Which pose types carry it; the one owner of what a 2D pose and a 3D pose hold. */
  readonly dimension: Dimension;
  /** The amount that changes nothing; a field with none is never held to rest. */
  readonly rest?: number;
  readonly combines: Combining;
  /** Whether its path must be smooth; a scale may snap at a contact. */
  readonly smooth: boolean;
  /** Whether a reveal must end with it at its greatest. */
  readonly shows: boolean;
  /** The least it can be; a modifier that pushes it past that stops there. */
  readonly least?: number;
  /** The limit the review holds its step to: a distance, a turn in degrees, or a ratio. */
  readonly judged: "position" | "turn" | "ratio";
}

/** What rows of one kind share; each row adds its own meaning, unit and dimension. */
type Preset = Omit<ValueField, "meaning" | "unit" | "dimension">;

const OFFSET = {
  rest: 0,
  combines: "add",
  smooth: true,
  shows: false,
  judged: "position",
} as const satisfies Preset;
const TURN = { ...OFFSET, judged: "turn" } as const satisfies Preset;
const SIZE = {
  rest: 1,
  combines: "multiply",
  smooth: false,
  shows: false,
  judged: "ratio",
} as const satisfies Preset;
const SHOWN = {
  combines: "replace",
  smooth: true,
  shows: true,
  judged: "position",
} as const satisfies Preset;
const PLACED = {
  combines: "replace",
  smooth: true,
  shows: false,
  judged: "position",
} as const satisfies Preset;
const ORDER = {
  combines: "replace",
  smooth: false,
  shows: false,
  judged: "position",
} as const satisfies Preset;

/** A row of the table with its literal members kept, so the pose types can be derived from the table. */
function row<const R extends ValueField>(field: R): R & ValueField {
  return field;
}

/** Every field a value can carry, one row each; nothing else states a field's rest or how it combines. */
export const VALUE_FIELDS = Object.freeze({
  x: row({
    ...OFFSET,
    meaning: "Moves the target right, from where the page puts it.",
    unit: "px",
    dimension: "both",
  }),
  y: row({
    ...OFFSET,
    meaning: "Moves the target down in 2D and up in 3D, from where the page puts it.",
    unit: "px",
    dimension: "both",
  }),
  z: row({
    ...OFFSET,
    meaning: "Moves the target toward the viewer in 3D.",
    unit: "px",
    dimension: "3d",
  }),
  rotation: row({
    ...TURN,
    meaning: "Turns the target about its anchor, clockwise on screen.",
    unit: "deg",
    dimension: "both",
  }),
  rotationX: row({
    ...TURN,
    meaning: "Tilts the target about its horizontal axis in 3D.",
    unit: "deg",
    dimension: "3d",
  }),
  rotationY: row({
    ...TURN,
    meaning: "Turns the target about its vertical axis in 3D.",
    unit: "deg",
    dimension: "3d",
  }),
  skewX: row({
    ...TURN,
    meaning: "Shears the target sideways, leaning its top against its bottom.",
    unit: "deg",
    dimension: "2d",
  }),
  skewY: row({
    ...TURN,
    meaning: "Shears the target vertically, lifting one side against the other.",
    unit: "deg",
    dimension: "2d",
  }),
  scale: row({
    ...SIZE,
    meaning: "Grows or shrinks the target evenly about its anchor.",
    unit: "scale",
    dimension: "both",
  }),
  scaleX: row({
    ...SIZE,
    meaning: "Stretches the target across, about its anchor.",
    unit: "scale",
    dimension: "both",
  }),
  scaleY: row({
    ...SIZE,
    meaning: "Stretches the target up and down, about its anchor.",
    unit: "scale",
    dimension: "both",
  }),
  scaleZ: row({
    ...SIZE,
    meaning: "Stretches the target in depth in 3D.",
    unit: "scale",
    dimension: "3d",
  }),
  opacity: row({
    rest: 1,
    combines: "multiply",
    smooth: true,
    shows: false,
    judged: "ratio",
    meaning: "How solid the target is, from clear to opaque.",
    unit: "share",
    dimension: "both",
  }),
  blur: row({
    ...OFFSET,
    least: 0,
    meaning: "Softens the target by a blur of this radius.",
    unit: "px",
    dimension: "2d",
  }),
  shadowX: row({
    ...OFFSET,
    meaning: "Throws the drop shadow of the target sideways.",
    unit: "px",
    dimension: "2d",
  }),
  shadowY: row({
    ...OFFSET,
    meaning: "Throws the drop shadow of the target downward.",
    unit: "px",
    dimension: "2d",
  }),
  shadowBlur: row({
    ...OFFSET,
    least: 0,
    meaning: "Softens the drop shadow of the target by a blur of this radius.",
    unit: "px",
    dimension: "2d",
  }),
  hue: row({
    ...TURN,
    meaning: "Turns the colour of the target round the colour wheel.",
    unit: "deg",
    dimension: "2d",
  }),
  lightness: row({
    ...OFFSET,
    judged: "ratio",
    meaning: "Lightens the colour of the target when above rest and darkens it when below.",
    unit: "number",
    dimension: "2d",
  }),
  tint: row({
    ...OFFSET,
    least: 0,
    judged: "ratio",
    meaning: "Mixes the tint colour of the page into the target, from none to full.",
    unit: "share",
    dimension: "2d",
  }),
  drawn: row({
    rest: 1,
    combines: "multiply",
    smooth: true,
    shows: true,
    judged: "position",
    meaning: "Draws a stroke on from its start up to this share of its length.",
    unit: "share",
    dimension: "2d",
  }),
  drawnFrom: row({
    ...OFFSET,
    meaning: "Starts the drawn stretch of a stroke at this share of its length.",
    unit: "share",
    dimension: "2d",
  }),
  clipX: row({
    ...PLACED,
    meaning: "Centres the clip this far from the left edge of the target.",
    unit: "px",
    dimension: "2d",
  }),
  clipY: row({
    ...PLACED,
    meaning: "Centres the clip this far from the top edge of the target.",
    unit: "px",
    dimension: "2d",
  }),
  clipRadius: row({
    ...SHOWN,
    meaning:
      "Reveals the target inside a circle of this radius, or rounds the corners of a box clip.",
    unit: "px",
    dimension: "2d",
  }),
  clipWidth: row({
    ...PLACED,
    meaning: "Reveals the target inside a box this wide.",
    unit: "px",
    dimension: "2d",
  }),
  clipHeight: row({
    ...PLACED,
    meaning: "Reveals the target inside a box this tall.",
    unit: "px",
    dimension: "2d",
  }),
  shape: row({
    rest: 0,
    combines: "replace",
    smooth: true,
    shows: false,
    judged: "position",
    meaning: "Morphs the outline of a path from its first shape toward its next.",
    unit: "share",
    dimension: "2d",
  }),
  layer: row({
    ...ORDER,
    meaning: "Sets which targets paint over which; a higher layer paints on top.",
    unit: "order",
    dimension: "2d",
  }),
}) satisfies Readonly<Record<string, ValueField>>;

/** A number a piece names itself, under `custom`: it rests at 0 and adds, and each renderer says where it goes. */
export const CUSTOM_FIELD: ValueField = {
  ...OFFSET,
  meaning: "A number a piece names itself, which the renderer sends where the piece says.",
  unit: "number",
  dimension: "both",
};

const BY_NAME: ReadonlyMap<string, ValueField> = new Map(Object.entries(VALUE_FIELDS));

/** The row a field name has in the table, or nothing when it has none. */
export function valueField(name: string): ValueField | undefined {
  return BY_NAME.get(name);
}

/** The name of a row of the table. */
export type FieldName = keyof typeof VALUE_FIELDS;

/** The names of the rows whose dimension is one of `D`. */
export type CarriedBy<D extends Dimension> = {
  [K in FieldName]: (typeof VALUE_FIELDS)[K]["dimension"] extends D ? K : never;
}[FieldName];

/** The names of the rows a `Dimension` filter keeps and whose `judged` is a turn. */
export type TurnsOf<D extends Dimension> = {
  [K in CarriedBy<D>]: (typeof VALUE_FIELDS)[K]["judged"] extends "turn" ? K : never;
}[CarriedBy<D>];

/** Whether a string is the name of a row of the table. */
export function isFieldName(name: string): name is FieldName {
  return Object.hasOwn(VALUE_FIELDS, name);
}

/** The table's field names, in table order. */
export const FIELD_NAMES: readonly FieldName[] = Object.freeze(
  Object.keys(VALUE_FIELDS).filter(isFieldName),
);

/** The numbers a 2D pose carries: the rows whose dimension is `2d` or `both`, in table order. */
export const POSE_2D_NUMBERS: readonly CarriedBy<"2d" | "both">[] = Object.freeze(
  FIELD_NAMES.filter((name): name is CarriedBy<"2d" | "both"> => {
    const { dimension } = VALUE_FIELDS[name];
    return dimension === "2d" || dimension === "both";
  }),
);

/** A 2D pose, every field optional: `x`, `y`, `rotation`, `scale`, `scaleX`, `scaleY`, `opacity`,
 * `anchor` and `custom` numbers. Stage px, y down, degrees clockwise. */
export type Pose2d = { readonly [K in (typeof POSE_2D_NUMBERS)[number]]?: number } & {
  readonly anchor?: Anchor;
  readonly custom?: Readonly<Record<string, number>>;
};

/** Every field a renderer must write for a pose: its numbers and its anchor. */
export const POSE_2D_FIELDS: readonly Exclude<keyof Pose2d, "custom">[] = Object.freeze([
  ...POSE_2D_NUMBERS,
  "anchor",
]);
