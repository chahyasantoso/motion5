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

// Slice D3 of issue #195: the capability, end to end.
//
// Nothing in the runtime changed to make these rigs work. A chain past arity two is an ordinary path
// of ordinary `base` edges, a goal is an ordinary input edge of the solver, and `solves` is still a
// pure function of nodes and edges. The only new thing is which solve `solveChain` chooses, so these
// two cases are about a rig reaching its goals rather than about new machinery.

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

function bone(id: string, base: string, length: number): TrackDefinition {
  return {
    id,
    keyframes: { fk: { values: { length }, requires: { base, solver: "tail-solve" } } },
  };
}

/** Five 40-unit segments off one hip, reaching for a goal that moves. Total reach is 200. */
const TAIL: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "hip", keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } } },
        {
          id: "tail-target",
          keyframes: {
            transform: {
              values: {
                x: [
                  { p: 0, v: 240 },
                  { p: 1, v: 280 },
                ],
                y: [
                  { p: 0, v: 380 },
                  { p: 1, v: 400 },
                ],
              },
            },
          },
        },
        {
          id: "tail-solve",
          keyframes: { ik: { requires: { root: "hip", targets: { t5: "tail-target" } } } },
        },
        bone("t1", "hip", 40),
        bone("t2", "t1", 40),
        bone("t3", "t2", 40),
        bone("t4", "t3", 40),
        bone("t5", "t4", 40),
        // Ordinary FK below the chain, unaware any of this happened.
        { id: "fin", keyframes: { fk: { values: { length: 10 }, requires: { base: "t5" } } } },
      ],
    },
  ],
};

const TAIL_NODES = [
  "rig/hip",
  "rig/tail-target",
  "rig/tail-solve",
  "rig/t1",
  "rig/t2",
  "rig/t3",
  "rig/t4",
  "rig/t5",
  "rig/fin",
];

function limb(id: string, base: string, length: number): TrackDefinition {
  return {
    id,
    keyframes: { fk: { values: { length }, requires: { base, solver: "body-solve" } } },
  };
}

/** Two arms off one spine, one solver, two goals. The geometry `FB-5` proves converges. */
const TREE: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "hip", keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } } },
        { id: "goal-l", keyframes: { transform: { values: { x: 240, y: 400, rotation: 0 } } } },
        { id: "goal-r", keyframes: { transform: { values: { x: 160, y: 400, rotation: 0 } } } },
        {
          id: "body-solve",
          keyframes: {
            ik: {
              requires: {
                root: "hip",
                targets: { "fore-l": "goal-l", "fore-r": "goal-r" },
              },
            },
          },
        },
        limb("spine", "hip", 50),
        limb("arm-l", "spine", 40),
        limb("fore-l", "arm-l", 30),
        limb("arm-r", "spine", 40),
        limb("fore-r", "arm-r", 30),
      ],
    },
  ],
};

const TREE_NODES = [
  "rig/hip",
  "rig/goal-l",
  "rig/goal-r",
  "rig/body-solve",
  "rig/spine",
  "rig/arm-l",
  "rig/fore-l",
  "rig/arm-r",
  "rig/fore-r",
];

function distance(a: Patch | undefined, b: Patch | undefined): number {
  return Math.hypot(
    (a?.values.x as number) - (b?.values.x as number),
    (a?.values.y as number) - (b?.values.y as number),
  );
}

function mountAll(project: ProjectDefinition, ids: readonly string[]) {
  const runtime = createEngine(project);
  const patches = new Map<string, Patch>();
  for (const id of ids) {
    runtime.mount(id);
    runtime.subscribe(id, (patch) => patches.set(id, patch));
  }
  return { runtime, patches };
}

describe("iterative IK over a real rig (Slice D3)", () => {
  it("FB-11 a five-bone chain tracks an animated goal with every length intact", () => {
    const { runtime, patches } = mountAll(TAIL, TAIL_NODES);

    runtime.seek("rig/tail-target", 0);
    for (const id of TAIL_NODES) expect(patches.get(id)?.status).toBe("ready");

    // One solve for the whole chain, keyed by member id, and never a per-member re-solve.
    const rotations = patches.get("rig/tail-solve")?.values.rotations as Readonly<
      Record<string, number>
    >;
    expect(Object.keys(rotations).sort()).toEqual([
      "rig/t1",
      "rig/t2",
      "rig/t3",
      "rig/t4",
      "rig/t5",
    ]);

    // The tip reaches the goal, which is the independent check that the frame the solve reached for
    // was the goal node's own and not something the plugin defaulted to.
    expect(patches.get("rig/t5")?.values.x).toBeCloseTo(240, 1);
    expect(patches.get("rig/t5")?.values.y).toBeCloseTo(380, 1);

    // Lengths are the invariant a tolerance does not cover: an iteration that reached the goal by
    // stretching a segment would converge and be wrong. Measured on the published frames, because
    // that is what a renderer sees.
    expect(distance(patches.get("rig/hip"), patches.get("rig/t1"))).toBeCloseTo(40, 6);
    expect(distance(patches.get("rig/t1"), patches.get("rig/t2"))).toBeCloseTo(40, 6);
    expect(distance(patches.get("rig/t2"), patches.get("rig/t3"))).toBeCloseTo(40, 6);
    expect(distance(patches.get("rig/t3"), patches.get("rig/t4"))).toBeCloseTo(40, 6);
    expect(distance(patches.get("rig/t4"), patches.get("rig/t5"))).toBeCloseTo(40, 6);

    // And the FK bone below the chain follows, at its own authored length, knowing nothing about IK.
    expect(distance(patches.get("rig/t5"), patches.get("rig/fin"))).toBeCloseTo(10, 6);

    // Moving the goal moves the chain. This fails by holding still rather than by erroring: a chain
    // that never re-solved would keep publishing tick one's pose with status `ready`.
    const first = patches.get("rig/t5")?.values.x as number;
    runtime.seek("rig/tail-target", 1);
    const second = patches.get("rig/t5")?.values.x as number;
    expect(Number.isFinite(first)).toBe(true);
    expect(second).not.toEqual(first);
    expect(distance(patches.get("rig/t4"), patches.get("rig/t5"))).toBeCloseTo(40, 6);
  });

  it("FB-12 two goals off one spine are both reached, and the spine is solved once", () => {
    const { runtime, patches } = mountAll(TREE, TREE_NODES);

    runtime.seek("rig/hip", 0);
    for (const id of TREE_NODES) expect(patches.get(id)?.status).toBe("ready");

    // One solver vertex, one composition, five members. The spine belongs to both branches and is
    // solved once: a redundant per-member solve of an iterative method would be N floating-point
    // runs required to agree, which is the hazard one solver removes rather than tests for.
    const rotations = patches.get("rig/body-solve")?.values.rotations as Readonly<
      Record<string, number>
    >;
    expect(Object.keys(rotations).sort()).toEqual([
      "rig/arm-l",
      "rig/arm-r",
      "rig/fore-l",
      "rig/fore-r",
      "rig/spine",
    ]);

    expect(patches.get("rig/fore-l")?.values.x).toBeCloseTo(240, 1);
    expect(patches.get("rig/fore-l")?.values.y).toBeCloseTo(400, 1);
    expect(patches.get("rig/fore-r")?.values.x).toBeCloseTo(160, 1);
    expect(patches.get("rig/fore-r")?.values.y).toBeCloseTo(400, 1);

    // Both branches hang off the one spine tip at their own authored lengths.
    expect(distance(patches.get("rig/hip"), patches.get("rig/spine"))).toBeCloseTo(50, 6);
    expect(distance(patches.get("rig/spine"), patches.get("rig/arm-l"))).toBeCloseTo(40, 6);
    expect(distance(patches.get("rig/spine"), patches.get("rig/arm-r"))).toBeCloseTo(40, 6);
    expect(distance(patches.get("rig/arm-l"), patches.get("rig/fore-l"))).toBeCloseTo(30, 6);
    expect(distance(patches.get("rig/arm-r"), patches.get("rig/fore-r"))).toBeCloseTo(30, 6);
  });
});
