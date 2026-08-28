import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeScheduler } from "../../src/testing/fakes";
import { createRealGsapSeam } from "../support/real-gsap";

// Slice D1 of issue #195: the goal dict end to end.
//
// The evidence for this slice is deliberately the rig that already exists rather than a new one. The
// worked rig of ADR-051 solves to `40.168` and `-51.318` through the bare `target` slot, and `IK-1`,
// `IK-3` and `IK-13` pin those numbers. Re-expressing the same rig with `targets` and getting the
// same two numbers is what says the dict changed the addressing and nothing else; a fresh fixture
// with fresh expectations would have proved only that the new path computes something.

function goalRig(handTarget: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "walker",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "shoulder",
            keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } },
          },
          handTarget,
          {
            id: "arm-solve",
            // One authored section, keyed by the member id the goal belongs to. No bracket is ever
            // typed: `targets[forearm]` is derived identity and lives only in the IR.
            keyframes: {
              ik: { requires: { root: "shoulder", targets: { forearm: "hand-target" } } },
            },
          },
          {
            id: "upper-arm",
            keyframes: {
              fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
            },
          },
          {
            id: "forearm",
            keyframes: {
              fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
            },
          },
          {
            id: "hand",
            keyframes: { fk: { values: { length: 20 }, requires: { base: "forearm" } } },
          },
        ],
      },
    ],
  };
}

const STATIC_GOAL = goalRig({
  id: "hand-target",
  keyframes: { transform: { values: { x: 320, y: 340, rotation: 0 } } },
});

const ANIMATED_GOAL = goalRig({
  id: "hand-target",
  keyframes: {
    transform: {
      values: {
        x: [
          { p: 0, v: 300 },
          { p: 1, v: 330 },
        ],
        y: [
          { p: 0, v: 300 },
          { p: 1, v: 340 },
        ],
      },
    },
  },
});

const NODE_IDS = [
  "walker/shoulder",
  "walker/hand-target",
  "walker/arm-solve",
  "walker/upper-arm",
  "walker/forearm",
  "walker/hand",
];

function createEngine(project: ProjectDefinition) {
  const seam = createRealGsapSeam();
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: seam.interpolator,
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("goal-addressed IK integration (Slice D1)", () => {
  it("MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers", () => {
    const runtime = createEngine(STATIC_GOAL);
    const patches = new Map<string, Patch>();
    for (const id of NODE_IDS) {
      runtime.mount(id);
      runtime.subscribe(id, (patch) => patches.set(id, patch));
    }

    runtime.seek("walker/shoulder", 0);

    const solver = patches.get("walker/arm-solve");
    expect(solver?.status).toBe("ready");
    const rotations = solver?.values.rotations as Readonly<Record<string, number>>;
    expect(rotations["walker/upper-arm"]).toBeCloseTo(40.168, 3);
    expect(rotations["walker/forearm"]).toBeCloseTo(-51.3178, 4);

    // The two rotations are local, so the tip landing on the goal is the independent check that the
    // frame the solve reached for was the goal node's and not something the plugin defaulted to.
    const forearm = patches.get("walker/forearm");
    expect(forearm?.status).toBe("ready");
    expect(forearm?.values.x).toBeCloseTo(320, 1);
    expect(forearm?.values.y).toBeCloseTo(340, 1);

    // And the chain below is unaware any of this happened.
    expect(patches.get("walker/hand")?.status).toBe("ready");
  });

  it("MG-13 seeding the goal node alone re-solves the whole chain", () => {
    // A goal is an ordinary input edge of the solver, so the goal node is upstream of it and the
    // members are downstream through `solves`. Seeding the goal has to reach both, and this fails by
    // holding still rather than by erroring: a chain that never re-solved would keep publishing tick
    // one's pose with status `ready` and no diagnostic.
    const runtime = createEngine(ANIMATED_GOAL);
    for (const id of NODE_IDS) runtime.mount(id);
    let forearm: Patch | undefined;
    runtime.subscribe("walker/forearm", (patch) => {
      forearm = patch;
    });

    runtime.seek("walker/hand-target", 0);
    const first = forearm?.values.x as number;
    runtime.seek("walker/hand-target", 1);
    const second = forearm?.values.x as number;

    expect(Number.isFinite(first)).toBe(true);
    expect(Number.isFinite(second)).toBe(true);
    expect(second).not.toEqual(first);
  });
});
