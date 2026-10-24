import { describe, expect, it } from "vitest";
import type {
  DependencySpec,
  PluginDefinition,
  ProjectDefinition,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import {
  buildGraphIR,
  compareEdges,
  edgeKey,
  edgeRequirement,
  type GraphEdge,
} from "../../../src/graph/ir";
import { record, row, table, track } from "../../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};

function plugin(id: string, requires?: Readonly<Record<string, DependencySpec>>): PluginDefinition {
  return {
    id,
    inputs: {
      values: { kind: "record", fields: { dx: { kind: "number" }, dy: { kind: "number" } } },
      ...(requires === undefined ? {} : { requires }),
    },
    outputs: { values: POINT },
    transform() {
      return { values: [] };
    },
  };
}

function catalog(...plugins: readonly PluginDefinition[]): PluginCatalog {
  const result = new PluginCatalog();
  result.registerAll(plugins);
  return result;
}

const SINGLE: DependencySpec = { outputs: { values: POINT } };

function point(id: string): ReturnType<typeof track> {
  return track({
    id,
    values: table(row(`${id}-a`, { x: 0, y: 0 })),
  });
}

function consumer(
  id: string,
  pluginId: string,
  requires: Readonly<Record<string, string | Readonly<Record<string, string>>>>,
): ReturnType<typeof track> {
  return track({
    id,
    plugin: pluginId,
    values: record({ dx: 1, dy: 2 }),
    requires,
  });
}

function project(...tracks: readonly ReturnType<typeof track>[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "demo", trigger: { type: "manual" }, tracks }],
  };
}

function edgesOf(graph: ReturnType<typeof buildGraphIR>, nodeId: string): readonly GraphEdge[] {
  const node = graph.graph?.nodeById[nodeId];
  if (node === undefined) throw new Error(`Missing graph node ${nodeId}.`);
  return node.edges;
}

describe("identified-table dependencies build one node-level edge per bound source", () => {
  it("derives a single-slot edge from input.requires", () => {
    const built = buildGraphIR(
      project(point("points"), consumer("shifted", "translate", { data: "points" })),
      catalog(plugin("translate", { data: SINGLE })),
    );

    expect(built.diagnostics).toEqual([]);
    expect(edgesOf(built, "demo/shifted")).toEqual([
      {
        observerId: "demo/shifted",
        sourceId: "demo/points",
        role: "input",
        requirement: { plugin: "translate", slot: "data" },
      },
    ]);
  });

  it("expands a map slot into one edge per member key, with the key kept separate", () => {
    const built = buildGraphIR(
      project(
        point("upper"),
        point("lower"),
        consumer("rig", "bones", {
          data: { upperArm: "upper", forearm: "lower" },
        }),
      ),
      catalog(
        plugin("bones", {
          data: { outputs: { values: POINT }, binding: "map" },
        }),
      ),
    );

    expect(built.diagnostics).toEqual([]);
    const edges = edgesOf(built, "demo/rig");
    expect(edges).toHaveLength(2);
    expect(edges.map((edge) => edgeRequirement(edge))).toEqual([
      { plugin: "bones", slot: "data", memberKey: "upperArm" },
      { plugin: "bones", slot: "data", memberKey: "forearm" },
    ]);
    expect(new Set(edges.map(edgeKey)).size).toBe(2);
    expect([...edges].sort(compareEdges).map((edge) => edgeRequirement(edge)?.memberKey)).toEqual([
      "forearm",
      "upperArm",
    ]);
  });

  it("orders every source before its consumer through the new edges", () => {
    const built = buildGraphIR(
      project(
        point("points"),
        consumer("first", "translate", { data: "points" }),
        consumer("second", "translate", { data: "points" }),
        consumer("joined", "join", { left: "first", right: "second" }),
      ),
      catalog(
        plugin("translate", { data: SINGLE }),
        plugin("join", { left: SINGLE, right: SINGLE }),
      ),
    );

    expect(built.diagnostics).toEqual([]);
    const order = built.graph?.order ?? [];
    expect(order.indexOf("demo/points")).toBeLessThan(order.indexOf("demo/first"));
    expect(order.indexOf("demo/first")).toBeLessThan(order.indexOf("demo/joined"));
    expect(order.indexOf("demo/second")).toBeLessThan(order.indexOf("demo/joined"));
  });

  it("accepts a diamond and keeps each edge distinct", () => {
    const built = buildGraphIR(
      project(
        point("points"),
        consumer("left", "translate", { data: "points" }),
        consumer("right", "translate", { data: "points" }),
        consumer("joined", "join", { left: "left", right: "right" }),
      ),
      catalog(
        plugin("translate", { data: SINGLE }),
        plugin("join", { left: SINGLE, right: SINGLE }),
      ),
    );

    expect(built.diagnostics).toEqual([]);
    expect(edgesOf(built, "demo/joined")).toHaveLength(2);
  });

  it("refuses a cycle across plugin dependencies", () => {
    const built = buildGraphIR(
      project(consumer("a", "translate", { data: "b" }), consumer("b", "translate", { data: "a" })),
      catalog(plugin("translate", { data: SINGLE })),
    );

    expect(built.graph).toBeUndefined();
    expect(built.diagnostics.map(({ ruleId }) => ruleId)).toContain("graph-cycle");
  });

  it("refuses a bound source that no node carries", () => {
    const built = buildGraphIR(
      project(consumer("shifted", "translate", { data: "missing" })),
      catalog(plugin("translate", { data: SINGLE })),
    );

    expect(built.graph).toBeUndefined();
    expect(built.diagnostics.map(({ ruleId }) => ruleId)).toContain("edge-unknown-source");
  });

  it("refuses a binding to a slot the plugin does not declare", () => {
    const built = buildGraphIR(
      project(point("points"), consumer("shifted", "translate", { missing: "points" })),
      catalog(plugin("translate", { data: SINGLE })),
    );

    expect(built.graph).toBeUndefined();
    expect(built.diagnostics.map(({ ruleId }) => ruleId)).toContain("slot-unknown");
  });

  it("refuses a missing required slot", () => {
    const built = buildGraphIR(
      project(point("points"), consumer("shifted", "translate", {})),
      catalog(plugin("translate", { data: SINGLE })),
    );

    expect(built.graph).toBeUndefined();
    expect(built.diagnostics.map(({ ruleId }) => ruleId)).toContain("slot-required-missing");
  });

  it("accepts an omitted optional slot", () => {
    const built = buildGraphIR(
      project(point("points"), consumer("shifted", "translate", {})),
      catalog(plugin("translate", { data: { ...SINGLE, optional: true } })),
    );

    expect(built.diagnostics).toEqual([]);
  });

  it("refuses a map sent to a single slot and a string sent to a map slot", () => {
    const mapToSingle = buildGraphIR(
      project(point("points"), consumer("shifted", "translate", { data: { one: "points" } })),
      catalog(plugin("translate", { data: SINGLE })),
    );
    expect(mapToSingle.diagnostics.map(({ ruleId }) => ruleId)).toContain("slot-binding-mode");

    const stringToMap = buildGraphIR(
      project(point("points"), consumer("shifted", "bones", { data: "points" })),
      catalog(plugin("bones", { data: { ...SINGLE, binding: "map" } })),
    );
    expect(stringToMap.diagnostics.map(({ ruleId }) => ruleId)).toContain("slot-binding-mode");
  });

  it("refuses a missing source even when the slot is optional", () => {
    const built = buildGraphIR(
      project(
        consumer("shifted", "translate", {
          data: "missing",
        }),
      ),
      catalog(plugin("translate", { data: { ...SINGLE, optional: true } })),
    );

    expect(built.graph).toBeUndefined();
    expect(built.diagnostics.map(({ ruleId }) => ruleId)).toContain("edge-unknown-source");
  });

  it("qualifies a dependency source under the owner, including free tracks", () => {
    const built = buildGraphIR(
      {
        schemaVersion: 5,
        motions: [
          {
            id: "demo",
            trigger: { type: "manual" },
            tracks: [point("points")],
          },
        ],
        freeTracks: [consumer("shifted", "translate", { data: "demo/points" })],
      },
      catalog(plugin("translate", { data: SINGLE })),
    );

    expect(built.diagnostics).toEqual([]);
    expect(edgesOf(built, "~/shifted")[0]?.sourceId).toBe("demo/points");
  });
});
