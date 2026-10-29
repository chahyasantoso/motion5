import { describe, expect, it } from "vitest";
import { Engine, PluginCatalog } from "@motion5/core";
import { fkPlugin } from "../../src/fk";
import { transformPlugin } from "../../src/transform";
import { ROOT_2D_SPEC, BODY_2D_SPEC, SOLVED_2D_SPEC } from "../../src/aggregate-topology";
import { createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import type { Patch, ProjectDefinition, TrackDefinition } from "@motion5/core";

const project: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "transactionality",
  motions: [],
};

function makeHandle() {
  const plugins = new PluginCatalog();
  plugins.registerAll([transformPlugin, fkPlugin]);
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins,
  }).load(project);
  return { handle, scheduler };
}

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}

const rootTrack: TrackDefinition = {
  id: "root",
  input: {
    schema: ROOT_2D_SPEC,
    values: {
      x: ramp(0, 100),
      y: ramp(0, 0),
      rotation: ramp(0, 0),
    },
  },
};

const bodyTrack: TrackDefinition = {
  id: "body",
  input: {
    schema: BODY_2D_SPEC,
    values: [{ id: "elbow", cells: { length: 40, rotation: 0, weight: 1 } }],
  },
};

const solvedTrack: TrackDefinition = {
  id: "solved",
  input: {
    schema: SOLVED_2D_SPEC,
    values: [{ id: "elbow", cells: { rotation: 0 } }],
  },
};

const dependentTrack: TrackDefinition = {
  id: "elbow",
  plugin: "fk",
  input: {
    values: {},
    requires: { chain: "~/body", solved: "~/solved", base: "~/root" },
  },
};

function addable(id: string): TrackDefinition {
  return {
    id,
    plugin: "transform",
    input: {
      values: { dx: ramp(0, 10), dy: 0 },
      requires: { data: "~/elbow" },
    },
  };
}

function snapshot(handle: ReturnType<typeof makeHandle>["handle"], ids: readonly string[]) {
  return ids.map((id) => ({ id, patch: handle.get(id) }));
}

describe("runtime mutation transactionality (W2)", () => {
  it("rejects destroying a source without changing graph state or the observation wire", () => {
    const { handle } = makeHandle();
    const root = handle.addTrack(rootTrack);
    handle.addTrack(bodyTrack);
    handle.addTrack(solvedTrack);
    const elbow = handle.addTrack(dependentTrack);
    handle.seek(root.id, 1);

    const patches: Patch[] = [];
    const unsubscribe = handle.subscribeNode(root.id, (patch) => patches.push(patch));
    const before = snapshot(handle, [root.id, elbow.id]);

    expect(() => root.remove()).toThrow(/edge-unknown-source/);

    expect(patches.filter(({ status }) => status === "destroyed")).toHaveLength(0);
    expect(handle.get(root.id)?.status).toBe(before[0]?.patch?.status);
    const retryBatch = handle.seek(root.id, 0.7);
    expect(retryBatch.patches.some(({ status }) => status === "error")).toBe(false);
    expect(handle.get(root.id)?.status).toBe("ready");
    expect(() => root.remove()).toThrow(/edge-unknown-source/);
    expect(handle.get(root.id)).toBeDefined();

    elbow.remove();
    root.remove();
    expect(patches.filter(({ status }) => status === "destroyed")).toHaveLength(1);

    unsubscribe();
    handle.dispose();
  });

  it("leaves a rejected unknown-source addition retryable", () => {
    const { handle } = makeHandle();
    handle.addTrack(rootTrack);
    handle.addTrack(bodyTrack);
    handle.addTrack(solvedTrack);
    handle.addTrack(dependentTrack);
    const invalid: TrackDefinition = {
      ...addable("child"),
      input: {
        values: { dx: ramp(0, 10), dy: 0 },
        requires: { data: "~/missing" },
      },
    };

    expect(() => handle.addTrack(invalid)).toThrow(/edge-unknown-source/);

    const replacement = handle.addTrack(addable("child"));
    expect(replacement.id).toBe("~/child");
    expect(handle.seek(replacement.id, 0.5).patches.some(({ status }) => status === "error")).toBe(
      false,
    );
    expect(handle.get(replacement.id)?.status).toBe("ready");

    replacement.remove();
    handle.dispose();
  });

  it("leaves a rejected self-reference addition retryable", () => {
    const { handle } = makeHandle();
    handle.addTrack(rootTrack);
    handle.addTrack(bodyTrack);
    handle.addTrack(solvedTrack);
    handle.addTrack(dependentTrack);
    const invalid: TrackDefinition = {
      ...addable("self"),
      input: {
        values: { dx: ramp(0, 10), dy: 0 },
        requires: { data: "~/self" },
      },
    };

    expect(() => handle.addTrack(invalid)).toThrow(
      /graph-cycle|edge-self-reference|edge-unknown-source/,
    );
    const replacement = handle.addTrack(addable("self"));
    expect(replacement.id).toBe("~/self");

    replacement.remove();
    handle.dispose();
  });
});
