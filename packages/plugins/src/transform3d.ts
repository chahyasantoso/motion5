import { definePlugin, isFlatRecord } from "@motion5/core/plugin-api";
import { Points3d } from "./models";

/** Shifts each 3D point row by `dx`, `dy` and `dz`; row ids and rotations pass through. */
export const transform3dPlugin = definePlugin({
  id: "transform3d",
  inputs: {
    values: {
      kind: "record",
      fields: {
        dx: { kind: "number" },
        dy: { kind: "number" },
        dz: { kind: "number" },
      },
    },
    requires: { data: Points3d },
  },
  outputs: { values: Points3d },
  transform({ values, requires: { data } }) {
    if (!isFlatRecord(values)) throw new TypeError("Transform3d values must be a record.");
    const { dx, dy, dz } = values;
    if (typeof dx !== "number" || typeof dy !== "number" || typeof dz !== "number")
      throw new TypeError("Transform3d values require numeric dx, dy and dz.");
    return {
      values: data.map((row) => ({
        id: row.id,
        cells: {
          ...row.cells,
          x: row.cells.x + dx,
          y: row.cells.y + dy,
          z: row.cells.z + dz,
        },
      })),
    };
  },
});
