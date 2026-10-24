import { describe, expect, it } from "vitest";
import type {
  Diagnostic,
  PluginDefinition,
  TrackDefinition,
  ValueSpec,
} from "../../../src/contract/v5";
import { deriveSourceContract } from "../../../src/contract/v5-infer";
import { parseTrackDefinition } from "../../../src/contract/v5-parse";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import type { CommittedContract } from "../../../src/graph/committed-contract";
import { qualifyMotionTrack } from "../../../src/graph/ids";
import {
  plan,
  type PlanEnvironment,
  type PlanOutcome,
  type PlanState,
  type PlannedTrack,
} from "../../../src/runtime/edit-plan";
import { AUTHORED, LIVE } from "../../../src/runtime/value-state";
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
const POINTS = track({ id: "points", values: table(row("r1", { x: 1, y: 2 })) });
const RECORD = track({ id: "record", values: record({ a: 1, b: 2 }) });
const SHIFTED = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 1 }),
  requires: { data: "points" },
});

function environment(plugins: readonly PluginDefinition[] = []): PlanEnvironment {
  const catalog = new PluginCatalog();
  catalog.registerAll(plugins);
  return {
    capabilities: catalog,
    isPluginRegistered: (pluginId) => catalog.isPluginAdmitted(pluginId),
  };
}

function contractFor(
  definition: TrackDefinition,
  plugins: readonly PluginDefinition[] = [],
): CommittedContract {
  const parsed = parseTrackDefinition(definition, definition.id, {
    isPluginRegistered: (pluginId) => plugins.some((plugin) => plugin.id === pluginId),
  });
  if (parsed.kind === "refused") throw new Error("Fixture track does not parse.");
  const plugin = plugins.find((candidate) => candidate.id === definition.plugin);
  const spec = plugin === undefined ? parsed.value.input.schema : plugin.inputs.values;
  const derived = deriveSourceContract(
    parsed.value.input.values,
    spec,
    `${definition.id}.input.values`,
  );
  if (derived.kind === "refused") throw new Error("Fixture track does not derive a contract.");
  const input =
    plugin === undefined
      ? derived.value
      : Object.freeze({ spec: plugin.inputs.values, proven: true });
  const outputs =
    plugin === undefined
      ? Object.freeze({ values: input })
      : Object.freeze(
          Object.fromEntries(
            Object.entries(plugin.outputs).map(([name, outputSpec]) => [
              name,
              Object.freeze({ spec: outputSpec, proven: true }),
            ]),
          ),
        );
  return Object.freeze({
    ...(plugin === undefined ? {} : { plugin: plugin.id }),
    input,
    outputs,
    requires: Object.freeze({ ...parsed.value.input.requires }),
    slots: Object.freeze(plugin?.inputs.requires ?? {}),
  });
}

function state(
  definitions: readonly TrackDefinition[],
  plugins: readonly PluginDefinition[] = [],
): PlanState {
  const planned = new Map<string, PlannedTrack>();
  for (const [authoredIndex, definition] of definitions.entries()) {
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
        contract: contractFor(definition, plugins),
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

function refused(outcome: PlanOutcome): readonly Diagnostic[] {
  if (outcome.kind === "accepted") throw new Error("Expected a refused plan.");
  return outcome.diagnostics;
}

function rules(outcome: PlanOutcome): readonly string[] {
  return refused(outcome).map((entry) => `${entry.ruleId} at ${entry.path}`);
}

describe("write-live validates the whole evaluated value and moves nothing authored", () => {
  it("accepts a shape the contract declares and carries the definition by identity", () => {
    const committed = state([POINTS]);
    const before = committed.tracks.get("demo/points");
    const value = table(row("r1", { x: 9, y: 8 }), row("r2", { x: 7, y: 6 }));
    const outcome = accepted(
      plan(committed, { kind: "write-live", nodeId: "demo/points", value }, environment()),
    );

    const after = outcome.state.tracks.get("demo/points");
    expect(outcome.change?.kind).toBe("live-values");
    expect(outcome.change?.kind === "live-values" ? outcome.change.overlay : undefined).toEqual(
      value,
    );
    expect(after?.track).toBe(before?.track);
    expect(after?.contract).toBe(before?.contract);
    expect(after?.valueState).toBe(LIVE);
  });

  it("accepts a row-count change within the committed contract", () => {
    const outcome = accepted(
      plan(
        state([POINTS]),
        { kind: "write-live", nodeId: "demo/points", value: [] },
        environment(),
      ),
    );

    expect(outcome.state.tracks.get("demo/points")?.valueState).toBe(LIVE);
  });

  it("refuses either shape mismatch as live-values-invalid", () => {
    const recordValue = plan(
      state([POINTS]),
      { kind: "write-live", nodeId: "demo/points", value: record({ x: 1 }) },
      environment(),
    );
    expect(rules(recordValue)).toEqual(["live-values-invalid at demo/points.input.values"]);

    const tableValue = plan(
      state([RECORD]),
      { kind: "write-live", nodeId: "demo/record", value: table(row("r", { a: 1 })) },
      environment(),
    );
    expect(rules(tableValue)).toEqual(["live-values-invalid at demo/record.input.values"]);
  });

  it("refuses a missing field, an unknown field and a changed kind by path", () => {
    const missing = plan(
      state([RECORD]),
      { kind: "write-live", nodeId: "demo/record", value: record({ a: 1 }) },
      environment(),
    );
    expect(rules(missing)).toEqual(["live-values-invalid at demo/record.input.values.b"]);

    const unknown = plan(
      state([RECORD]),
      { kind: "write-live", nodeId: "demo/record", value: record({ a: 1, b: 2, c: 3 }) },
      environment(),
    );
    expect(rules(unknown)).toEqual(["live-values-invalid at demo/record.input.values.c"]);

    const kind = plan(
      state([RECORD]),
      { kind: "write-live", nodeId: "demo/record", value: record({ a: "one", b: 2 }) },
      environment(),
    );
    expect(rules(kind)).toEqual(["live-values-invalid at demo/record.input.values.a"]);
  });

  it("refuses duplicate row ids, non-finite numbers and reserved names", () => {
    const duplicate = plan(
      state([POINTS]),
      {
        kind: "write-live",
        nodeId: "demo/points",
        value: table(row("same", { x: 1, y: 2 }), row("same", { x: 3, y: 4 })),
      },
      environment(),
    );
    expect(rules(duplicate)[0]?.split(" at ")[0]).toBe("live-values-invalid");
    expect(rules(duplicate)[0]).toContain("[1].id");

    const infinite = plan(
      state([POINTS]),
      {
        kind: "write-live",
        nodeId: "demo/points",
        value: table(row("r1", { x: Number.POSITIVE_INFINITY, y: 2 })),
      },
      environment(),
    );
    expect(rules(infinite)[0]).toContain(".x");

    const reserved = plan(
      state([RECORD]),
      {
        kind: "write-live",
        nodeId: "demo/record",
        value: { a: 1, b: 2, ["__proto__"]: 3 },
      },
      environment(),
    );
    expect(rules(reserved)[0]).toBe("live-values-invalid at demo/record.input.values.__proto__");
  });

  it("validates a plugin track against the plugin's declared local spec", () => {
    const plugins = [TRANSLATE];
    const refusedValue = plan(
      state([POINTS, SHIFTED], plugins),
      { kind: "write-live", nodeId: "demo/shifted", value: record({ dx: "one" }) },
      environment(plugins),
    );
    expect(rules(refusedValue)).toEqual(["live-values-invalid at demo/shifted.input.values.dx"]);

    const acceptedValue = accepted(
      plan(
        state([POINTS, SHIFTED], plugins),
        { kind: "write-live", nodeId: "demo/shifted", value: record({ dx: 5 }) },
        environment(plugins),
      ),
    );
    expect(acceptedValue.state.tracks.get("demo/shifted")?.valueState).toBe(LIVE);
  });
});

describe("release-live drops the overlay and is a no-op when none stands", () => {
  it("answers the same state by identity when the node is authored", () => {
    const committed = state([RECORD]);
    const outcome = accepted(
      plan(committed, { kind: "release-live", nodeId: "demo/record" }, environment()),
    );

    expect(outcome.state).toBe(committed);
    expect(outcome.change).toBeUndefined();
  });

  it("returns the state to authored and carries the release as the absence of a value", () => {
    const committed = state([RECORD]);
    const entry = committed.tracks.get("demo/record");
    if (entry === undefined) throw new Error("Fixture has no record.");
    const liveState: PlanState = {
      tracks: new Map([["demo/record", { ...entry, valueState: LIVE }]]),
    };
    const outcome = accepted(
      plan(liveState, { kind: "release-live", nodeId: "demo/record" }, environment()),
    );

    expect(outcome.change).toEqual(
      expect.objectContaining({ kind: "live-values", overlay: undefined }),
    );
    expect(outcome.state.tracks.get("demo/record")?.valueState).toBe(AUTHORED);
  });

  it("keeps an overlay standing across an authored edit", () => {
    const committed = state([RECORD]);
    const entry = committed.tracks.get("demo/record");
    if (entry === undefined) throw new Error("Fixture has no record.");
    const liveState: PlanState = {
      tracks: new Map([["demo/record", { ...entry, valueState: LIVE }]]),
    };
    const outcome = accepted(
      plan(
        liveState,
        { kind: "set-field", nodeId: "demo/record", address: { field: "a" }, cell: 5 },
        environment(),
      ),
    );

    expect(outcome.state.tracks.get("demo/record")?.valueState).toBe(LIVE);
    expect(outcome.state.tracks.get("demo/record")?.track.input?.values).toEqual({
      a: 5,
      b: 2,
    });
  });
});
