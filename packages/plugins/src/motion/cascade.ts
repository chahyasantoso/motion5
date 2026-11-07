import { Spec, definePlugin, type FieldSpec, type Value } from "@motion5/core/plugin-api";
import { Sprites2d } from "../models/index";
import { DROP_FIELDS, dropPose } from "./drop";
import { HOP_FIELDS, hopPose } from "./hop";
import { FROM, TO, moveProgress, numberParam, stringParam } from "./param";

function optionalFields(
  fields: Readonly<Record<string, FieldSpec>>,
): Readonly<Record<string, FieldSpec>> {
  return Object.fromEntries(
    Object.entries(fields).map(([name, field]): [string, FieldSpec] => [
      name,
      { ...field, optional: true },
    ]),
  );
}

function pose(move: string, param: Value | undefined, local: number) {
  switch (move) {
    case "hop":
      return hopPose(param, local).values;
    case "drop":
      return dropPose(param, local);
    default:
      throw new TypeError(`cascade has no move "${move}".`);
  }
}

// One move per row, rows `0` to `count - 1`, each starting `stagger` row-lengths after the last and all
// at rest by the end, so a word's letters live on one track instead of one track each.
export const cascadePlugin = definePlugin({
  id: "cascade",
  inputs: {
    param: Spec.record({
      move: Spec.string({ enum: ["drop", "hop"], description: "The move each row runs." }),
      count: Spec.number({
        min: 1,
        max: 500,
        description: "Rows to publish, named 0, 1, 2 and so on.",
      }),
      stagger: Spec.number({
        optional: true,
        min: 0,
        description: "Delay between row starts, in row lengths; default 0.25.",
      }),
      ...optionalFields(DROP_FIELDS),
      ...optionalFields(HOP_FIELDS),
      from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
      to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
    }),
  },
  outputs: { values: Sprites2d },
  transform({ param }, { progress }) {
    const move = stringParam(param, "move", "drop");
    const count = Math.max(1, Math.floor(numberParam(param, "count", 1)));
    const stagger = numberParam(param, "stagger", 0.25);
    const span = 1 + (count - 1) * stagger;
    const local = moveProgress(param, progress);
    const rows = Array.from({ length: count }, (_, index) => ({
      id: String(index),
      cells: pose(move, param, Math.max(0, Math.min(1, local * span - index * stagger))),
    }));
    return { values: rows };
  },
});
