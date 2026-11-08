import {
  Spec,
  definePlugin,
  isFlatRecord,
  unreachable,
  type FieldSpec,
  type Model,
  type Outputs,
  type PrimitiveScalar,
  type ValueSpec,
} from "@motion5/core/plugin-api";
import {
  UNTIMED,
  window,
  type Anchor,
  type ExtraFields,
  type Move,
  type OptionField,
  type OptionFields,
  type OutputKind,
  type OutputTypes,
  type Pose2d,
} from "@motion5/moves";
import { Sprite2d } from "../models/index";
import { FROM, TO, numberParam } from "./param";

const POSE_NUMBERS = ["x", "y", "rotation", "scale", "scaleX", "scaleY", "opacity"] as const;

function transformOrigin(anchor: Anchor): string {
  switch (anchor) {
    case "center":
      return "50% 50%";
    case "bottom":
      return "50% 100%";
    case "top":
      return "50% 0%";
    case "left":
      return "0% 50%";
    case "right":
      return "100% 50%";
    default:
      return unreachable(anchor);
  }
}

/** A pose as `Sprite2d` cells: its numbers, and its anchor as a CSS transform origin. */
export function spriteCells(pose: Pose2d): Readonly<Record<string, PrimitiveScalar>> {
  const cells: Record<string, PrimitiveScalar> = {};
  for (const name of POSE_NUMBERS) {
    const value = pose[name];
    if (value !== undefined) cells[name] = value;
  }
  if (pose.anchor !== undefined) cells.transformOrigin = transformOrigin(pose.anchor);
  return cells;
}

function paramField(field: OptionField): FieldSpec {
  const optional = field.default === undefined ? {} : { optional: true as const };
  switch (field.kind) {
    case "number":
      return Spec.number({
        ...optional,
        ...(field.min === undefined ? {} : { min: field.min }),
        ...(field.max === undefined ? {} : { max: field.max }),
        description: field.description,
      });
    case "string":
      return Spec.string({
        ...optional,
        ...(field.enum === undefined ? {} : { enum: field.enum }),
        description: field.description,
      });
    case "boolean":
      return Spec.boolean({ ...optional, description: field.description });
    default:
      return unreachable(field);
  }
}

/** A move's options as engine param fields. */
export function paramFields(options: OptionFields): Readonly<Record<string, FieldSpec>> {
  return Object.fromEntries(
    Object.entries(options).map(([name, field]): [string, FieldSpec] => [name, paramField(field)]),
  );
}

function mainModel(kind: OutputKind): Model<unknown, unknown> {
  switch (kind) {
    case "pose2d":
      return Sprite2d;
    default:
      return unreachable(kind);
  }
}

function mainCells(kind: OutputKind, output: OutputTypes[OutputKind]) {
  switch (kind) {
    case "pose2d":
      return spriteCells(output);
    default:
      return unreachable(kind);
  }
}

function extraSpecs(extras: ExtraFields): Readonly<Record<string, ValueSpec>> {
  return Object.fromEntries(
    Object.entries(extras).map(([name, fields]): [string, ValueSpec] => [
      name,
      Spec.record(Object.fromEntries(Object.keys(fields).map((field) => [field, Spec.number()]))),
    ]),
  );
}

function extraCells(
  id: string,
  name: string,
  fields: readonly string[],
  value: unknown,
): Readonly<Record<string, number>> {
  if (!isFlatRecord(value)) throw new TypeError(`${id}: extra "${name}" is not a record.`);
  const cells: Record<string, number> = {};
  for (const field of fields) {
    const cell = value[field];
    if (typeof cell !== "number")
      throw new TypeError(`${id}: extra "${name}.${field}" is not a number.`);
    cells[field] = cell;
  }
  return cells;
}

/** The engine plugin for a move: its options become param, with `from` and `to` as a window. */
export function movePlugin<Fs extends OptionFields, O extends OutputKind, E extends ExtraFields>(
  move: Move<Fs, O, E>,
) {
  return definePlugin({
    id: move.id,
    inputs: {
      param: Spec.record({
        ...paramFields(move.options),
        from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
        to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
      }),
    },
    outputs: { ...extraSpecs(move.extras), values: mainModel(move.output) },
    transform({ param }, { progress }) {
      const from = numberParam(param, "from", 0);
      const to = numberParam(param, "to", 1);
      const output = move.run(
        move.read(param ?? {}),
        window({ progress, clock: UNTIMED }, from, to),
      );
      const outputs: Record<string, Outputs[string]> = { values: mainCells(move.output, output) };
      const published: Readonly<Record<string, unknown>> = output;
      const extras: ExtraFields = move.extras;
      for (const [name, fields] of Object.entries(extras))
        outputs[name] = extraCells(move.id, name, Object.keys(fields), published[name]);
      return outputs;
    },
  });
}
