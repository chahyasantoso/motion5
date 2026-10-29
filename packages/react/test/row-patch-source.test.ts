import { describe, expect, it } from "vitest";
import { liveOrAbsent, rowPatchSource } from "@motion5/react";
import type { LivePatch, Patch, PatchListener, PatchSource } from "@motion5/react";
import type { Outputs, ReadyPatch, Value } from "../../core/src/contract/v5";

const NODE = "rig/pose";
const ALIAS = "marker/upper";
const OPTIONS = { nodeId: NODE, output: "pose", rowId: "upper", as: ALIAS } as const;

interface FakeSource extends PatchSource {
  publish(patch: Patch): void;
  listenerCount(nodeId?: string): number;
  subscriptions(): number;
}

function createFakeSource(): FakeSource {
  const listeners = new Map<string, Set<PatchListener>>();
  const latest = new Map<string, LivePatch>();
  let subscribed = 0;
  return {
    get: (nodeId) => latest.get(nodeId),
    subscribeNode(nodeId, listener) {
      subscribed += 1;
      const existing = listeners.get(nodeId) ?? new Set<PatchListener>();
      existing.add(listener);
      listeners.set(nodeId, existing);
      return () => {
        existing.delete(listener);
      };
    },
    publish(next) {
      const live = liveOrAbsent(next);
      if (live === undefined) latest.delete(next.nodeId);
      else latest.set(next.nodeId, live);
      for (const listener of [...(listeners.get(next.nodeId) ?? [])]) listener(next);
    },
    listenerCount: (nodeId) =>
      nodeId === undefined
        ? [...listeners.values()].reduce((total, set) => total + set.size, 0)
        : (listeners.get(nodeId)?.size ?? 0),
    subscriptions: () => subscribed,
  };
}

function ready(nodeId: string, revision: number, outputs: Outputs): ReadyPatch {
  return {
    nodeId,
    revision,
    outputs,
    sourceProgress: 0.25,
    sourceRevisions: { upstream: 2 },
    status: "ready",
    diagnostics: [],
  };
}

function table<Cell extends Readonly<Record<string, number | string | boolean>>>(
  ...rows: readonly { readonly id: string; readonly cells: Cell }[]
) {
  return rows;
}

describe("rowPatchSource", () => {
  it("selects the explicitly named output, never the values fallback", () => {
    const source = createFakeSource();
    const cells = { x: 4, y: 5 };
    const wrapper = rowPatchSource(source, OPTIONS);
    source.publish(
      ready(NODE, 2, {
        values: { x: 100, y: 100 },
        pose: table({ id: "upper", cells }, { id: "lower", cells: { x: 9, y: 9 } }),
      }),
    );
    const projected = wrapper.get(ALIAS);
    expect(projected?.status).toBe("ready");
    if (projected?.status !== "ready") throw new Error("expected ready");
    expect(projected.outputs).toEqual({ values: cells });
    expect(projected.outputs.values).toBe(cells);
    expect(projected.nodeId).toBe(ALIAS);
    expect(projected.revision).toBe(2);
    expect(projected.sourceProgress).toBe(0.25);
    expect(projected.sourceRevisions).toEqual({ upstream: 2 });
  });

  it("treats an absent, inherited or wrong-kind named output as a local refusal", () => {
    const source = createFakeSource();
    source.publish(
      ready(NODE, 3, {
        values: { x: 1 },
        pose: table({ id: "upper", cells: { x: 1 } }),
        inspect: { residual: 0.5 },
      }),
    );
    for (const output of ["missing", "toString", "inspect"] as const) {
      const projected = rowPatchSource(source, { ...OPTIONS, output }).get(ALIAS);
      expect(projected?.status, output).toBe("blocked");
      if (projected?.status !== "blocked") throw new Error("expected blocked");
      expect(projected.nodeId).toBe(ALIAS);
      expect(projected.revision).toBe(3);
      expect(projected.diagnostics).toEqual([]);
      expect(Object.keys(projected).sort()).toEqual([
        "diagnostics",
        "nodeId",
        "revision",
        "status",
      ]);
    }
  });

  it("refuses a missing row, a duplicate row and malformed cells as a ready refusal", () => {
    const source = createFakeSource();
    const cases: readonly unknown[] = [
      table({ id: "lower", cells: { x: 1 } }),
      table({ id: "upper", cells: { x: 1 } }, { id: "upper", cells: { x: 2 } }),
      table({ id: "upper", cells: { x: Number.NaN } }),
      [],
    ];
    for (const cells of cases) {
      source.publish(ready(NODE, 4, { pose: cells as Value }));
      const projected = rowPatchSource(source, OPTIONS).get(ALIAS);
      expect(projected?.status, JSON.stringify(cells)).toBe("blocked");
    }
  });

  it("forwards blocked and error patches with only the alias identity changed", () => {
    const source = createFakeSource();
    const diagnostics = [
      {
        ruleId: "track-legacy-field" as const,
        path: "x",
        message: "m",
        severity: "error" as const,
        ids: [],
      },
    ];
    source.publish({ nodeId: NODE, revision: 5, status: "blocked", diagnostics });
    const blocked = rowPatchSource(source, OPTIONS).get(ALIAS);
    expect(blocked).toEqual({ nodeId: ALIAS, revision: 5, status: "blocked", diagnostics });
    source.publish({ nodeId: NODE, revision: 6, status: "error", diagnostics });
    const failed = rowPatchSource(source, OPTIONS).get(ALIAS);
    expect(failed).toEqual({ nodeId: ALIAS, revision: 6, status: "error", diagnostics });
  });

  it("would rather refuse than read a real node that shares the alias", () => {
    const source = createFakeSource();
    const ownCells = { x: 1 };
    const other: LivePatch = ready("other", 1, { values: { x: 7 } });
    source.publish(ready(NODE, 7, { pose: table({ id: "upper", cells: ownCells }) }));
    source.publish(ready(ALIAS, 9, { values: { x: 999 } }));
    source.publish(other);
    const wrapper = rowPatchSource(source, OPTIONS);
    const projected = wrapper.get(ALIAS);
    if (projected?.status !== "ready") throw new Error("expected ready");
    expect(projected.outputs.values).toBe(ownCells);
    expect(projected.revision).toBe(7);
    expect(wrapper.get("other")).toBe(other);
  });

  it("routes alias subscriptions to the configured node and leaves other ids alone", () => {
    const source = createFakeSource();
    const wrapper = rowPatchSource(source, OPTIONS);
    const aliased: Patch[] = [];
    const other: Patch[] = [];
    wrapper.subscribeNode(ALIAS, (patch) => aliased.push(patch));
    wrapper.subscribeNode("other", (patch) => other.push(patch));
    source.publish(ready(NODE, 1, { pose: table({ id: "upper", cells: { x: 2 } }) }));
    source.publish(ready(ALIAS, 2, { values: { x: 999 } }));
    const raw: Patch = { nodeId: "other", revision: 3, status: "destroyed" };
    source.publish(raw);
    expect(aliased).toHaveLength(1);
    expect(aliased[0]?.nodeId).toBe(ALIAS);
    expect(other).toEqual([raw]);
  });

  it("delivers destroyed with alias identity only, after get has stopped answering", () => {
    const source = createFakeSource();
    const wrapper = rowPatchSource(source, OPTIONS);
    source.publish(ready(NODE, 1, { pose: table({ id: "upper", cells: { x: 2 } }) }));
    const delivered: Patch[] = [];
    wrapper.subscribeNode(ALIAS, (patch) => delivered.push(patch));
    expect(wrapper.get(ALIAS)?.revision).toBe(1);
    source.publish({ nodeId: NODE, revision: 2, status: "destroyed" });
    expect(wrapper.get(ALIAS)).toBeUndefined();
    expect(delivered).toEqual([{ nodeId: ALIAS, revision: 2, status: "destroyed" }]);
  });

  it("recovers from a refusal, and a read equals the delivery for every live status", () => {
    const source = createFakeSource();
    const wrapper = rowPatchSource(source, OPTIONS);
    const delivered: Patch[] = [];
    wrapper.subscribeNode(ALIAS, (patch) => delivered.push(patch));

    const refused = ready(NODE, 1, { pose: table({ id: "lower", cells: { x: 0 } }) });
    source.publish(refused);
    expect(wrapper.get(ALIAS)?.status).toBe("blocked");
    expect(delivered.at(-1)).toEqual(wrapper.get(ALIAS));

    const recovered = ready(NODE, 2, { pose: table({ id: "upper", cells: { x: 3 } }) });
    source.publish(recovered);
    const projected = wrapper.get(ALIAS);
    if (projected?.status !== "ready") throw new Error("expected recovery");
    expect(projected.outputs.values).toEqual({ x: 3 });
    expect(delivered.at(-1)).toEqual(projected);

    const failed: Patch = { nodeId: NODE, revision: 3, status: "error", diagnostics: [] };
    source.publish(failed);
    expect(wrapper.get(ALIAS)?.status).toBe("error");
    expect(delivered.at(-1)).toEqual(wrapper.get(ALIAS));
  });

  it("does not subscribe when constructed or read", () => {
    const source = createFakeSource();
    const wrapper = rowPatchSource(source, OPTIONS);
    wrapper.get(ALIAS);
    wrapper.get("other");
    expect(source.subscriptions()).toBe(0);
    expect(source.listenerCount()).toBe(0);
  });

  it("releases each subscriber on its own and returns the underlying release", () => {
    const source = createFakeSource();
    const wrapper = rowPatchSource(source, OPTIONS);
    const first: Patch[] = [];
    const second: Patch[] = [];
    const releaseFirst = wrapper.subscribeNode(ALIAS, (patch) => first.push(patch));
    wrapper.subscribeNode(ALIAS, (patch) => second.push(patch));
    expect(source.listenerCount(NODE)).toBe(2);
    releaseFirst();
    expect(source.listenerCount(NODE)).toBe(1);
    source.publish(ready(NODE, 1, { pose: table({ id: "upper", cells: { x: 1 } }) }));
    expect(first).toHaveLength(0);
    expect(second).toHaveLength(1);
  });

  it("captures its mapping at construction", () => {
    const source = createFakeSource();
    const options = { ...OPTIONS };
    const wrapper = rowPatchSource(source, options);
    source.publish(ready(NODE, 1, { pose: table({ id: "upper", cells: { x: 1 } }) }));
    (options as { as: string }).as = "marker/lower";
    (options as { rowId: string }).rowId = "lower";
    expect(wrapper.get(ALIAS)?.status).toBe("ready");
    expect(wrapper.get("marker/lower")).toBeUndefined();
  });
});
