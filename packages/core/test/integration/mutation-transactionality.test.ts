import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { Patch } from "../../src/contract/v5";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";

const project: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "transactionality",
  motions: [],
};

function makeHandle() {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
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

// Both plugins are registered, so `rotation` has two claimants and each track names the one it
// means. `x` and `y` are claimed by `transform` alone and keep their flat spelling. See ADR-043.
//
// The dependent's edge is derived from `fk.requires.base`, which is now the only way a value enters
// composition. A derived edge is held to the same topology rules, so destroying its source is still
// `observation-unknown-source`. See ADR-044 and ADR-047.
const rootTrack: TrackDefinition = {
  id: "root",
  keyframes: {
    transform: {
      values: {
        x: ramp(0, 100),
        y: ramp(0, 0),
        rotation: ramp(0, 0),
      },
    },
  },
};
const dependentTrack: TrackDefinition = {
  id: "elbow",
  keyframes: {
    fk: {
      values: {
        length: ramp(40, 40),
        rotation: ramp(0, 0),
      },
      requires: { base: "~/root" },
    },
  },
};

function snapshot(handle: ReturnType<typeof makeHandle>["handle"], ids: readonly string[]) {
  return ids.map((id) => ({ id, patch: handle.get(id) }));
}

describe("runtime mutation transactionality (W2)", () => {
  it("rejects destroying a source without changing graph state or the observation wire", () => {
    const { handle } = makeHandle();
    const owner = {};
    const root = handle.adopt(rootTrack, owner);
    const elbow = handle.adopt(dependentTrack, owner);
    handle.seek(root.id, 1);

    const patches: Patch[] = [];
    const unsubscribe = handle.subscribe(root.id, (patch) => patches.push(patch));
    const before = snapshot(handle, [root.id, elbow.id]);

    expect(() => handle.destroyAdopted(root.id, owner)).toThrow(/observation-unknown-source/);

    // A failed destroy is not a destruction event. The graph and its compiled track must still
    // be live, and the adoption map must still make the same failure reachable on retry.
    expect(patches.filter(({ status }) => status === "destroyed")).toHaveLength(0);
    expect(handle.get(root.id)?.status).toBe(before[0]?.patch?.status);
    const retryBatch = handle.seek(root.id, 0.7);
    expect(retryBatch.patches.some(({ status }) => status === "error")).toBe(false);
    expect(handle.get(root.id)?.status).toBe("ready");
    expect(() => handle.destroyAdopted(root.id, owner)).toThrow(/observation-unknown-source/);
    expect(handle.get(root.id)).toBeDefined();

    // Recovery is still possible once the dependent is removed. The source then gets exactly one
    // terminal patch, which is the only point at which the wire should hear about destruction.
    handle.destroyAdopted(elbow.id, owner);
    handle.destroyAdopted(root.id, owner);
    expect(patches.filter(({ status }) => status === "destroyed")).toHaveLength(1);

    unsubscribe();
    handle.dispose();
  });

  it("leaves a rejected unknown-source adoption retryable", () => {
    const { handle } = makeHandle();
    const owner = {};
    const invalid: TrackDefinition = {
      id: "child",
      keyframes: { x: ramp(0, 10) },
      observes: [{ source: "~/missing" }],
    };

    expect(() => handle.adopt(invalid, owner)).toThrow(/observation-unknown-source/);

    const replacement = handle.adopt({ id: "child", keyframes: { x: ramp(0, 10) } }, owner);
    expect(replacement.id).toBe("~/child");
    expect(handle.seek(replacement.id, 0.5).patches.some(({ status }) => status === "error")).toBe(
      false,
    );
    expect(handle.get(replacement.id)?.status).toBe("ready");

    handle.destroyAdopted(replacement.id, owner);
    handle.dispose();
  });

  it("leaves a rejected self-reference adoption retryable", () => {
    const { handle } = makeHandle();
    const owner = {};
    const invalid: TrackDefinition = {
      id: "self",
      keyframes: { x: ramp(0, 10) },
      observes: [{ source: "~/self" }],
    };

    expect(() => handle.adopt(invalid, owner)).toThrow(/observation-self-reference/);
    const replacement = handle.adopt({ id: "self", keyframes: { x: ramp(0, 10) } }, owner);
    expect(replacement.id).toBe("~/self");

    handle.destroyAdopted(replacement.id, owner);
    handle.dispose();
  });
});
