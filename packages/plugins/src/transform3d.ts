import type { IdentifiedPluginDefinition, ValueSpec } from "@motion5/core/plugin-api";

const POINT3D: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        z: { kind: "number" },
      },
    },
  },
};

function isFlatRecord(value: unknown): value is Readonly<Record<string, number>> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** The identified 3D translation boundary; frame math remains owned by the 3D frame helpers. */
export const transform3dPlugin: IdentifiedPluginDefinition = {
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
    requires: { data: { outputs: { values: POINT3D } } },
  },
  outputs: { values: POINT3D },
  transform({ values, requires }) {
    if (!isFlatRecord(values)) throw new TypeError("Transform3d values must be a record.");
    const dx = values.dx;
    const dy = values.dy;
    const dz = values.dz;
    if (typeof dx !== "number" || typeof dy !== "number" || typeof dz !== "number")
      throw new TypeError("Transform3d values require numeric dx, dy and dz.");
    const data = requires.data;
    if (data === undefined || Array.isArray(data) || data === null || typeof data !== "object")
      throw new TypeError("Transform3d requires a data output.");
    const source = data.values;
    if (!Array.isArray(source)) throw new TypeError("Transform3d requires a point table.");
    return {
      values: source.map((row) => {
        const x = row.cells.x;
        const y = row.cells.y;
        const z = row.cells.z;
        if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number")
          throw new TypeError("Transform3d requires numeric source cells.");
        return { id: row.id, cells: { x: x + dx, y: y + dy, z: z + dz } };
      }),
    };
  },
};
