import { Spec, definePlugin, type FieldSpec, type Value } from "@motion5/core/plugin-api";
import { drop, hop, lane, lanes, window, type Time } from "@motion5/moves";
import { Sprites2d } from "../models/index";
import { paramFields, spriteCells } from "./move-plugin";
import { FROM, TO, numberParam, stringParam } from "./param";

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

function pose(move: string, param: Value | undefined, time: Time) {
  switch (move) {
    case "hop":
      return spriteCells(hop.run(hop.read(param ?? {}), time, {}));
    case "drop":
      return spriteCells(drop.run(drop.read(param ?? {}), time, {}));
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
      ...optionalFields(paramFields(drop.options)),
      ...optionalFields(paramFields(hop.options)),
      from: Spec.number({ optional: true, min: 0, max: 1, description: FROM }),
      to: Spec.number({ optional: true, min: 0, max: 1, description: TO }),
    }),
  },
  outputs: { values: Sprites2d },
  transform({ param }, { progress, clock }) {
    const move = stringParam(param, "move", "drop");
    const count = Math.max(1, Math.floor(numberParam(param, "count", 1)));
    const rows = lanes(new Array<number>(count).fill(1), numberParam(param, "stagger", 0.25));
    const time = window(
      { progress, clock },
      numberParam(param, "from", 0),
      numberParam(param, "to", 1),
    );
    return {
      values: Array.from({ length: count }, (_, index) => ({
        id: String(index),
        cells: pose(move, param, lane(time, index, rows)),
      })),
    };
  },
});
