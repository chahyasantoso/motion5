import { describe, expect, it } from "vitest";
import type {
  Diagnostic,
  PluginDefinition,
  TrackDefinition,
  TrackInput,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { qualifyMotionTrack } from "../../../src/graph/ids";
import {
  plan,
  type PlanEnvironment,
  type PlanOutcome,
  type PlanState,
  type PlannedTrack,
} from "../../../src/runtime/edit-plan";
import { clearsOverlay, tierOf, type Edit } from "../../../src/runtime/edit-types";
import { AUTHORED } from "../../../src/runtime/value-state";
import { code } from "../../helpers/source-region";
import { record, row, table, track } from "../../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
const TRANSLATE: PluginDefinition = {
  id: "translate",
  inputs: {
    values: { kind: "record", fields: { dx: { kind: "number" } } },
    requires: { data: { outputs: { values: POINT } } },
  },
  outputs: { values: POINT },
  transform() {
    return { values: [] };
  },
};
const POINTS = track({ id: "points", values: table(row("a", { x: 0, y: 0 })) });
const OTHER = track({ id: "other", values: table(row("b", { x: 1, y: 1 })) });
/** The builder's authored input, narrowed for tests that need identity rather than optionality. */
const POINTS_INPUT: TrackInput = POINTS.input ?? {};
const SHIFTED: TrackDefinition = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 1 }),
  requires: { data: "points" },
});

function environment(plugins: readonly PluginDefinition[] = [], admitted = true): PlanEnvironment {
  const catalog = new PluginCatalog();
  catalog.registerAll(plugins);
  return {
    capabilities: catalog,
    isPluginRegistered: (pluginId) => admitted && catalog.isPluginAdmitted(pluginId),
  };
}

/** One motion's tracks, in authored order, which is the order a plan's index projection reads. */
function state(...tracks: readonly TrackDefinition[]): PlanState {
  const planned = new Map<string, PlannedTrack>();
  for (const [authoredIndex, definition] of tracks.entries()) {
    const nodeId = qualifyMotionTrack("demo", definition.id).value;
    planned.set(
      nodeId,
      Object.freeze({
        nodeId,
        track: definition,
        owner: "motion",
        ownerId: "demo",
        authoredIndex,
        valueState: AUTHORED,
        contract: undefined,
      }),
    );
  }
  return { tracks: planned };
}

function accepted(outcome: PlanOutcome) {
  if (outcome.kind === "refused")
    throw new Error(
      `Expected an accepted plan: ${outcome.diagnostics
        .map((entry) => `${entry.ruleId} at ${entry.path}`)
        .join(", ")}`,
    );
  return outcome.value;
}

function rules(outcome: PlanOutcome): readonly string[] {
  if (outcome.kind === "accepted") throw new Error("Expected a refused plan.");
  return outcome.diagnostics.map((entry: Diagnostic) => `${entry.ruleId} at ${entry.path}`);
}

describe("the edit union answers its tier and its overlay verdict", () => {
  it("names every kind, and only replacement or removal clears an overlay", () => {
    const edits: readonly Edit[] = [
      { kind: "replace-track", nodeId: "demo/a", track: { id: "a" } },
      { kind: "replace-input", nodeId: "demo/a" },
      { kind: "remove-track", nodeId: "demo/a" },
      { kind: "bind", nodeId: "demo/a", slot: "data", source: "demo/b" },
      { kind: "unbind", nodeId: "demo/a", slot: "data" },
      { kind: "set-values", nodeId: "demo/a", values: record({ x: 1 }) },
      { kind: "set-field", nodeId: "demo/a", address: { field: "x" }, cell: 2 },
    ];
    expect(edits.map(tierOf)).toEqual([
      "structural",
      "structural",
      "structural",
      "structural",
      "structural",
      "cheap",
      "cheap",
    ]);
    expect(edits.map(clearsOverlay)).toEqual([true, true, true, false, false, false, false]);
  });
});

describe("an edit is plain data", () => {
  it("survives structuredClone and a JSON round-trip as itself", () => {
    const edits: readonly Edit[] = [
      { kind: "replace-track", nodeId: "demo/a", track: { id: "a", duration: 120 } },
      { kind: "replace-input", nodeId: "demo/a", input: { values: table(row("a", { x: 1 })) } },
      { kind: "replace-input", nodeId: "demo/a" },
      { kind: "remove-track", nodeId: "demo/a" },
      { kind: "bind", nodeId: "demo/a", slot: "data", source: "demo/b", memberKey: "left" },
      { kind: "unbind", nodeId: "demo/a", slot: "data", memberKey: "left" },
      { kind: "set-values", nodeId: "demo/a", values: table(row("a", { x: 1 })) },
      { kind: "set-field", nodeId: "demo/a", address: { row: "a", field: "x" }, cell: 2 },
    ];
    for (const edit of edits) {
      expect(structuredClone(edit)).toEqual(edit);
      expect(JSON.parse(JSON.stringify(edit))).toEqual(edit);
    }
  });
});

describe("plan refuses a structural edit with the graph's own rules and paths", () => {
  it("refuses a binding to a source no node declares", () => {
    const outcome = plan(
      state(POINTS, SHIFTED),
      { kind: "bind", nodeId: "demo/shifted", slot: "data", source: "ghost" },
      environment([TRANSLATE]),
    );
    expect(rules(outcome)).toEqual(["edge-unknown-source at demo/shifted"]);
  });

  it("refuses removing a source a consumer still binds", () => {
    const outcome = plan(
      state(POINTS, SHIFTED),
      { kind: "remove-track", nodeId: "demo/points" },
      environment([TRANSLATE]),
    );
    expect(rules(outcome)).toContain("edge-unknown-source at demo/shifted");
  });

  it("refuses unbinding a required slot", () => {
    const outcome = plan(
      state(POINTS, SHIFTED),
      { kind: "unbind", nodeId: "demo/shifted", slot: "data" },
      environment([TRANSLATE]),
    );
    expect(rules(outcome)).toEqual(["slot-required-missing at demo/shifted.input.requires.data"]);
  });

  it("refuses a member key on a scalar slot and a bare source on a map slot", () => {
    const outcome = plan(
      state(POINTS, SHIFTED),
      {
        kind: "bind",
        nodeId: "demo/shifted",
        slot: "data",
        source: "points",
        memberKey: "left",
      },
      environment([TRANSLATE]),
    );
    expect(rules(outcome)).toEqual(["slot-binding-mode at demo/shifted.input.requires.data"]);
  });

  it("refuses a binding that makes a node its own source", () => {
    const outcome = plan(
      state(POINTS, SHIFTED),
      { kind: "bind", nodeId: "demo/shifted", slot: "data", source: "shifted" },
      environment([TRANSLATE]),
    );
    expect(rules(outcome)).toContain("edge-self-reference at demo/shifted");
  });

  it("refuses an edit whose definition the parser rejects", () => {
    const outcome = plan(
      state(POINTS),
      {
        kind: "replace-track",
        nodeId: "demo/points",
        track: { id: "points", claims: {} } as unknown as TrackDefinition,
      },
      environment(),
    );
    expect(rules(outcome)).toEqual(["track-field-unknown at replaceTrack(demo/points).claims"]);
  });

  it("refuses an unadmitted plugin by the parser's rule", () => {
    const outcome = plan(
      state(POINTS),
      {
        kind: "replace-track",
        nodeId: "demo/points",
        track: track({
          id: "points",
          plugin: "translate",
          values: record({ dx: 1 }),
          requires: { data: "ghost" },
        }),
      },
      environment([TRANSLATE], false),
    );
    expect(rules(outcome).map((entry) => entry.split(" at ")[0])).toContain("plugin-unknown");
  });

  it("refuses authored values whose shape the plugin's declared input cannot take", () => {
    const outcome = plan(
      state(POINTS),
      {
        kind: "replace-track",
        nodeId: "demo/points",
        track: track({
          id: "points",
          plugin: "translate",
          values: table(row("a", { x: 0, y: 0 })),
        }),
      },
      environment([TRANSLATE]),
    );
    expect(rules(outcome)).toEqual(["values-shape-invalid at demo/points.input.values"]);
  });

  it("refuses nonempty requires on a track without a plugin", () => {
    const outcome = plan(
      state(POINTS),
      {
        kind: "replace-track",
        nodeId: "demo/points",
        track: track({ id: "points", requires: { data: "shifted" } }),
      },
      environment(),
    );
    expect(rules(outcome)[0]?.split(" at ")[0]).toBe("plugin-requires-without-plugin");
  });
});

describe("plan answers the staged view rather than the committed one", () => {
  it("treats a source the first edit removed as unknown to the second", () => {
    const committed = state(POINTS, OTHER, SHIFTED);
    const first = accepted(
      plan(committed, { kind: "remove-track", nodeId: "demo/other" }, environment([TRANSLATE])),
    );
    const second = plan(
      first.state,
      { kind: "bind", nodeId: "demo/shifted", slot: "data", source: "other" },
      environment([TRANSLATE]),
    );
    expect(rules(second)).toEqual(["edge-unknown-source at demo/shifted"]);
  });

  it("answers the original state by identity when an edit changes nothing", () => {
    const committed = state(POINTS);
    const outcome = accepted(
      plan(
        committed,
        { kind: "replace-input", nodeId: "demo/points", input: POINTS_INPUT },
        environment(),
      ),
    );
    expect(outcome.state).toBe(committed);
    expect(outcome.change).toBeUndefined();
  });

  it("preserves the committed input on a binding edit and recomputes it on a replacement", () => {
    const built = accepted(
      plan(
        state(POINTS, SHIFTED),
        {
          kind: "replace-input",
          nodeId: "demo/points",
          input: { schema: POINT, values: table(row("a", { x: 1, y: 2 })) },
        },
        environment([TRANSLATE]),
      ),
    );
    const stored = built.state.tracks.get("demo/points")?.contract;
    expect(stored?.input.spec).toEqual(POINT);
    expect(stored?.outputs.values?.spec).toEqual(POINT);

    const rebound = accepted(
      plan(
        built.state,
        {
          kind: "replace-track",
          nodeId: "demo/shifted",
          track: {
            id: "shifted",
            plugin: "translate",
            input: { values: record({ dx: 2 }), requires: { data: "points" } },
          },
        },
        environment([TRANSLATE]),
      ),
    );
    const sourceBefore = built.state.tracks.get("demo/points")?.contract;
    const sourceAfter = rebound.state.tracks.get("demo/points")?.contract;
    expect(sourceAfter?.input).toBe(sourceBefore?.input);
    expect(sourceAfter?.outputs).toBe(sourceBefore?.outputs);
  });
});

describe("the plan module imports no runtime machinery", () => {
  it("stays free of the engine, clock, scheduler, timeline and commit modules", () => {
    const source = code(new URL("../../../src/runtime/edit-plan.ts", import.meta.url));
    const targets = [...source.matchAll(/from\s+"([^"]+)"/g)].map((match) => match[1] ?? "");
    const forbidden =
      /(^|\/)(engine|project-runtime|project-handles|commit-plan|run-plan|graph-runtime|timeline|ports\/clock|ports\/scheduler)(\.ts)?$/;
    expect(targets.filter((target) => forbidden.test(target))).toEqual([]);
  });
});
