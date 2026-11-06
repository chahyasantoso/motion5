import { Spec, definePlugin, isFlatRecord } from "@motion5/core/plugin-api";
import { Points2d } from "./models";

/** Shifts each point row by `dx` and `dy`; row ids and rotation pass through. */
export const transformPlugin = definePlugin({
  id: "transform",
  inputs: {
    values: Spec.record({ dx: Spec.number(), dy: Spec.number() }),
    requires: { data: Points2d },
  },
  outputs: { values: Points2d },
  transform({ values, requires: { data } }) {
    if (!isFlatRecord(values)) throw new TypeError("Transform values must be a record.");
    const { dx, dy } = values;
    if (typeof dx !== "number" || typeof dy !== "number")
      throw new TypeError("Transform values require numeric dx and dy.");
    return {
      values: data.map((row) => ({
        id: row.id,
        cells: { ...row.cells, x: row.cells.x + dx, y: row.cells.y + dy },
      })),
    };
  },
});
