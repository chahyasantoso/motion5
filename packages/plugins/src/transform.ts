import {
  isFlatRecord,
  type IdentifiedPluginDefinition,
  type ValueSpec,
} from "@motion5/core/plugin-api";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};

export const transformPlugin: IdentifiedPluginDefinition = {
  id: "transform",
  inputs: {
    values: {
      kind: "record",
      fields: { dx: { kind: "number" }, dy: { kind: "number" } },
    },
    requires: { data: { outputs: { values: POINT } } },
  },
  outputs: { values: POINT },
  transform({ values, requires }) {
    if (!isFlatRecord(values)) throw new TypeError("Transform values must be a record.");
    const dx = values.dx;
    const dy = values.dy;
    if (typeof dx !== "number" || typeof dy !== "number")
      throw new TypeError("Transform values require numeric dx and dy.");
    const data = requires.data;
    if (data === undefined || Array.isArray(data) || data === null || typeof data !== "object")
      throw new TypeError("Transform requires a data output.");
    const source = data.values;
    if (!Array.isArray(source)) throw new TypeError("Transform requires a point table.");
    return {
      values: source.map((row) => {
        const x = row.cells.x;
        const y = row.cells.y;
        if (typeof x !== "number" || typeof y !== "number")
          throw new TypeError("Transform requires numeric source cells.");
        return { id: row.id, cells: { x: x + dx, y: y + dy } };
      }),
    };
  },
};
