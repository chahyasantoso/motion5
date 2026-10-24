import { describe, expect, it } from "vitest";
import type { PluginDefinition, TrackDefinition, ValueSpec } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { qualifyMotionTrack } from "../../../src/graph/ids";
import { RefusalError } from "../../../src/runtime/refusal";
import { applyEdits } from "../../../src/runtime/edit-apply";
import type { PlanEnvironment, PlanState, PlannedTrack } from "../../../src/runtime/edit-plan";
import type { Edit } from "../../../src/runtime/edit-types";
import { AUTHORED } from "../../../src/runtime/value-state";
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
const SHIFTED: TrackDefinition = track({
  id: "shifted",
  plugin: "translate",
  values: record({ dx: 1 }),
  requires: { data: "points" },
});

function environment(): PlanEnvironment {
  const catalog = new PluginCatalog();
  catalog.registerAll([TRANSLATE]);
  return {
    capabilities: catalog,
    isPluginRegistered: (pluginId) => catalog.isPluginAdmitted(pluginId),
  };
}

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

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("apply plans one batch atomically", () => {
  it("answers an empty list with the same state and no changes", () => {
    const committed = state(POINTS);
    const applied = applyEdits(committed, [], environment());
    expect(applied.state).toBe(committed);
    expect(applied.changes).toEqual([]);
  });

  it("plans each edit against the result of the one before it", () => {
    const applied = applyEdits(
      state(POINTS, SHIFTED),
      [
        { kind: "remove-track", nodeId: "demo/shifted" },
        { kind: "remove-track", nodeId: "demo/points" },
      ],
      environment(),
    );
    expect(applied.changes).toEqual([
      { kind: "remove-track", nodeId: "demo/shifted" },
      { kind: "remove-track", nodeId: "demo/points" },
    ]);
    expect(applied.state.tracks.size).toBe(0);
  });

  it("reports the failing index and leaves the whole list unapplied", () => {
    const committed = state(POINTS, SHIFTED);
    const edits: readonly Edit[] = [
      {
        kind: "replace-input",
        nodeId: "demo/points",
        input: { values: table(row("b", { x: 1, y: 1 })) },
      },
      { kind: "bind", nodeId: "demo/shifted", slot: "data", source: "ghost" },
    ];
    const thrown = thrownBy(() => applyEdits(committed, edits, environment()));
    expect(thrown).toBeInstanceOf(RefusalError);
    expect((thrown as RefusalError).editIndex).toBe(1);
    expect((thrown as RefusalError).refusal.kind).toBe("invalid-definition");
    expect((thrown as Error).message).toMatch(/^edge-unknown-source at demo\/shifted/);

    // The committed view is immutable, so the accepted first edit never escaped the throw.
    expect(committed.tracks.size).toBe(2);
    expect(committed.tracks.get("demo/points")?.track).toBe(POINTS);
    expect(committed.tracks.get("demo/points")?.contract).toBeUndefined();
  });

  it("reports index zero when the first edit is the one refused", () => {
    const thrown = thrownBy(() =>
      applyEdits(
        state(POINTS, SHIFTED),
        [{ kind: "unbind", nodeId: "demo/shifted", slot: "data" }],
        environment(),
      ),
    );
    expect((thrown as RefusalError).editIndex).toBe(0);
    expect((thrown as Error).message).toMatch(/^slot-required-missing at /);
  });
});
