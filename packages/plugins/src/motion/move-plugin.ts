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
  window,
  type Anchor,
  type Anchor2d,
  type ExtraFields,
  type InputField,
  type InputFields,
  type Move,
  type OptionField,
  type OptionFields,
  type OutputKind,
  type Point2d,
  type Pose2d,
  type Reveal,
} from "@motion5/moves";
import { Clip2d, Sprite2d } from "../models/index";
import { Anchors2d } from "../models/path";
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
    case "reveal":
      return Clip2d;
    case "anchors2d":
      return Anchors2d;
    case "drawn":
      throw new TypeError(
        "A drawn share needs its path's length; its plugin reads the path itself.",
      );
    default:
      return unreachable(kind);
  }
}

function isPose(value: unknown): value is Pose2d {
  return isFlatRecord(value);
}

function isReveal(value: unknown): value is Reveal {
  return (
    isFlatRecord(value) &&
    typeof value.x === "number" &&
    typeof value.y === "number" &&
    typeof value.radius === "number"
  );
}

function isAnchor(value: unknown): value is Anchor2d {
  return (
    isFlatRecord(value) &&
    typeof value.id === "string" &&
    ["x", "y", "inX", "inY", "outX", "outY"].every((key) => typeof value[key] === "number")
  );
}

function isAnchors(value: unknown): value is readonly Anchor2d[] {
  return Array.isArray(value) && value.every(isAnchor);
}

/** A move's main output as the cells of its engine model. */
function mainCells(id: string, kind: OutputKind, output: unknown): Outputs[string] {
  const refuse = () => new TypeError(`${id}: its ${kind} output has the wrong shape.`);
  switch (kind) {
    case "pose2d":
      if (!isPose(output)) throw refuse();
      return spriteCells(output);
    case "reveal":
      if (!isReveal(output)) throw refuse();
      return { clipPath: `circle(${output.radius}px at ${output.x}px ${output.y}px)` };
    case "anchors2d":
      if (!isAnchors(output)) throw refuse();
      return output.map(({ id: rowId, x, y, inX, inY, outX, outY }) => ({
        id: rowId,
        cells: { x, y, inX, inY, outX, outY },
      }));
    case "drawn":
      throw refuse();
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

/** The one input a move plugin reads, from the track's own values; a move has at most one. */
function localInput(id: string, inputs: InputFields): [string, InputField] | undefined {
  const entries = Object.entries(inputs);
  if (entries.length > 1)
    throw new TypeError(`${id}: a move plugin reads at most one input, from the track's values.`);
  return entries[0];
}

function inputSpec(field: InputField): ValueSpec {
  switch (field.kind) {
    case "points2d":
      return Spec.table(
        { x: Spec.number(), y: Spec.number() },
        field.min === undefined ? {} : { minRows: field.min },
      );
    default:
      return unreachable(field.kind);
  }
}

function inputValue(field: InputField, values: unknown): readonly Point2d[] {
  switch (field.kind) {
    case "points2d": {
      const rows: readonly unknown[] = Array.isArray(values) ? values : [];
      return rows.map((row, index) => {
        const cells: unknown = isFlatRecord(row) ? row.cells : undefined;
        const id = isFlatRecord(row) && typeof row.id === "string" ? row.id : `p${index}`;
        const x = isFlatRecord(cells) && typeof cells.x === "number" ? cells.x : 0;
        const y = isFlatRecord(cells) && typeof cells.y === "number" ? cells.y : 0;
        return { id, x, y };
      });
    }
    default:
      return unreachable(field.kind);
  }
}

/** The engine plugin for a move: options become param with a `from` and `to` window, its input the track's values. */
export function movePlugin<
  Fs extends OptionFields,
  Is extends InputFields,
  O extends OutputKind,
  E extends ExtraFields,
>(move: Move<Fs, Is, O, E>) {
  const input = localInput(move.id, move.inputs);
  const values = mainModel(move.output);
  return definePlugin({
    id: move.id,
    inputs: {
      param: Spec.record({
        ...paramFields(move.options),
        from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
        to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
      }),
      ...(input === undefined ? {} : { values: inputSpec(input[1]) }),
    },
    outputs: { ...extraSpecs(move.extras), values },
    transform({ param, values: local }, { progress, clock }) {
      const from = numberParam(param, "from", 0);
      const to = numberParam(param, "to", 1);
      const time = window({ progress, clock }, from, to);
      const inputs = input === undefined ? {} : { [input[0]]: inputValue(input[1], local) };
      const output: unknown = move.run(move.read(param ?? {}), time, move.readInputs(inputs));
      const outputs: Record<string, Outputs[string]> = {
        values: mainCells(move.id, move.output, output),
      };
      const extras: ExtraFields = move.extras;
      for (const [name, fields] of Object.entries(extras))
        outputs[name] = extraCells(
          move.id,
          name,
          Object.keys(fields),
          Reflect.get(Object(output), name),
        );
      return outputs;
    },
  });
}
