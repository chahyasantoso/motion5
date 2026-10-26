import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";

const FRAME: ValueSpec = {
  kind: "table",
  schema: {
    row: {
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        z: { kind: "number" },
        rotation: { kind: "number" },
        rotationX: { kind: "number" },
        rotationY: { kind: "number" },
      },
    },
  },
};

const POINT: ValueSpec = {
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

const OUTPUTS = {
  pose: FRAME,
  controls: POINT,
} satisfies Readonly<Record<string, ValueSpec>>;

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type TableRows = readonly { readonly id: string; readonly cells: FlatRecord }[];

function tableOutput(outputs: Outputs, path: string): TableRows {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`Rig requires a table output at ${path}.`);
  return values as TableRows;
}

function rowsOf(requires: unknown, path: string): TableRows {
  if (requires === null || typeof requires !== "object" || Array.isArray(requires))
    throw new TypeError(`Rig requires a map at ${path}.`);
  return Object.values(requires as Readonly<Record<string, Outputs>>).flatMap((outputs) =>
    tableOutput(outputs, path),
  );
}

/** The identified rig boundary; source row ids, not map labels, own pose and control identity. */
export const rigPlugin: IdentifiedPluginDefinition = {
  id: "rig",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      bones: { binding: "map", outputs: { values: FRAME } },
      controls: { binding: "map", outputs: { values: POINT } },
    },
  },
  outputs: OUTPUTS,
  transform({ requires }) {
    return {
      pose: rowsOf(requires.bones, "bones"),
      controls: rowsOf(requires.controls, "controls"),
    };
  },
};
