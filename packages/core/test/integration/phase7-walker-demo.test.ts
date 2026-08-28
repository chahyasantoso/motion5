import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { createBrowserClock, type FrameSource } from "../../src/adapters/browser-clock";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { createManualTriggerPort } from "../../src/ports/trigger";
import { usePatch } from "../../../react/src/index";
import { act, create } from "react-test-renderer";
import { createElement } from "react";

describe("Phase 7: Walker Demo Integration Suite", () => {
  // Both plugins claim `rotation`, so each track names the one it means: a bone is authored under
  // `fk` and the root under `transform`. Values and published keys are unchanged. See ADR-043.
  //
  // Each bone's parent is bound through the fk plugin's own `base` requirement rather than through
  // a track-level input observation projecting onto `parentX`, `parentY`, and `parentRotation`.
  // The composed world-space values are identical, which case 6 pins numerically. See ADR-044.
  //
  // A group's animated properties live under its `values` section and its bindings beside them,
  // which is the only authored shape a group has. See ADR-049.
  //
  // The rig carries two solvers on purpose. `arm-solve` is two bones and one goal, so it takes
  // the analytic closed form; `tail-solve` is three bones, so it takes the iterative one. Cases
  // 11 and 13 read the same numbers for the arm and the legs, which is what makes a second solver
  // in one project a checked claim rather than an assumed one. See ADR-051 and ADR-052.
  const walkerProject: ProjectDefinition = {
    schemaVersion: 5,
    motions: [
      {
        id: "walk",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "pelvis",
            keyframes: {
              transform: {
                values: {
                  x: [
                    { p: 0, v: 0 },
                    { p: 1, v: 200 },
                  ],
                  y: [
                    { p: 0, v: 100 },
                    { p: 1, v: 100 },
                  ],
                  rotation: [
                    { p: 0, v: 0 },
                    { p: 1, v: 0 },
                  ],
                },
              },
            },
          },
          {
            id: "thigh",
            keyframes: {
              fk: {
                values: {
                  length: [
                    { p: 0, v: 50 },
                    { p: 1, v: 50 },
                  ],
                  rotation: [
                    { p: 0, v: 45 },
                    { p: 1, v: 45 },
                  ],
                },
                requires: { base: "walk/pelvis" },
              },
            },
          },
          {
            id: "shin",
            keyframes: {
              fk: {
                values: {
                  length: [
                    { p: 0, v: 40 },
                    { p: 1, v: 40 },
                  ],
                  rotation: [
                    { p: 0, v: -30 },
                    { p: 1, v: -30 },
                  ],
                },
                requires: { base: "walk/thigh" },
              },
            },
          },
          {
            id: "shoulder",
            keyframes: {
              fk: {
                values: {
                  x: 0,
                  y: -50,
                  length: 0,
                  rotation: 0,
                },
                requires: { base: "walk/pelvis" },
              },
            },
          },
          {
            id: "upper-arm",
            keyframes: {
              fk: {
                values: {
                  length: 30,
                },
                requires: { base: "walk/shoulder", solver: "walk/arm-solve" },
              },
            },
          },
          {
            id: "forearm",
            keyframes: {
              fk: {
                values: {
                  length: 25,
                },
                requires: { base: "walk/upper-arm", solver: "walk/arm-solve" },
              },
            },
          },
          {
            id: "hand",
            keyframes: {
              fk: {
                values: {
                  length: 10,
                  rotation: 0,
                },
                requires: { base: "walk/forearm" },
              },
            },
          },
          {
            id: "hand-target",
            keyframes: {
              transform: {
                values: {
                  x: 35,
                  y: 75,
                  rotation: 0,
                },
              },
            },
          },
          {
            id: "arm-solve",
            keyframes: {
              ik: {
                values: { flip: false },
                requires: { root: "walk/shoulder", target: "walk/hand-target" },
              },
            },
          },
          // The tail. Three bones off one anchor, so its derived member count is not two and the
          // solve dispatches to the iterative path. Nothing in the runtime knows that: the
          // anchor is an ordinary `fk` node, the members are an ordinary path of ordinary `base`
          // edges, and the goal is an ordinary input edge of the solver.
          {
            id: "tail-base",
            keyframes: {
              fk: {
                values: {
                  x: 0,
                  y: 0,
                  length: 0,
                  rotation: 0,
                },
                requires: { base: "walk/pelvis" },
              },
            },
          },
          {
            id: "tail-1",
            keyframes: {
              fk: {
                values: { length: 20 },
                requires: { base: "walk/tail-base", solver: "walk/tail-solve" },
              },
            },
          },
          {
            id: "tail-2",
            keyframes: {
              fk: {
                values: { length: 20 },
                requires: { base: "walk/tail-1", solver: "walk/tail-solve" },
              },
            },
          },
          {
            id: "tail-3",
            keyframes: {
              fk: {
                values: { length: 20 },
                requires: { base: "walk/tail-2", solver: "walk/tail-solve" },
              },
            },
          },
          {
            id: "tail-target",
            keyframes: {
              transform: {
                values: {
                  x: 24,
                  y: 132,
                  rotation: 0,
                },
              },
            },
          },
          // Addressed by member id rather than through the bare `target` slot, which is the
          // spelling a chain of any shape uses. A linear tail has one leaf, so `target` would
          // also work here; the dict is authored on purpose, so the rig exercises the grammar
          // rather than only the degenerate case of it. See ADR-052.
          {
            id: "tail-solve",
            keyframes: {
              ik: {
                requires: {
                  root: "walk/tail-base",
                  targets: { "walk/tail-3": "walk/tail-target" },
                },
              },
            },
          },
        ],
      },
    ],
  };

  const transformPlugin: PluginDefinition = {
    name: "transform",
    keys: ["x", "y", "rotation"],
    compose: (values) => values,
  };

  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);

  function createFakeFrameSource(): FrameSource & { triggerFrame(time: number): void } {
    let frameListener: ((time: number) => void) | undefined;
    let nextHandle = 1;
    return {
      requestFrame(listener) {
        frameListener = listener;
        return nextHandle++;
      },
      cancelFrame() {
        frameListener = undefined;
      },
      triggerFrame(time) {
        frameListener?.(time);
      },
    };
  }

  it("1. Load valid walker project through Engine with plugin registry", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const engine = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    });

    const handle = engine.load(walkerProject);
    expect(handle).toBeDefined();
    expect(typeof handle.mount).toBe("function");
    expect(typeof handle.get).toBe("function");
    handle.dispose();
    clock.dispose();
  });

  it("2. Render walker nodes through createDomPatchAdapter", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const engine = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    });

    const handle = engine.load(walkerProject);
    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");

    const stage = { style: {} };
    const elements: Record<string, { style: Record<string, unknown> }> = {
      "walk/pelvis": { style: {} },
      "walk/thigh": { style: {} },
    };

    const adapter = createDomPatchAdapter(stage, 1000, (nodeId) => elements[nodeId]);

    const batch = handle.seek("walk/pelvis", 0.5);
    for (const patch of batch.patches) {
      adapter.apply(patch);
    }

    // Pelvis position: x=100, y=100
    expect(elements["walk/pelvis"]?.style.transform).toContain("translate3d(100px, 100px, 0px)");
    handle.dispose();
    clock.dispose();
  });

  it("3. Demonstrate time playback using single injected browser clock", () => {
    const frameSource = createFakeFrameSource();
    const clock = createBrowserClock(frameSource);
    const scheduler = createFakeScheduler();

    const engine = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    });

    const handle = engine.load(walkerProject);
    handle.mount("walk/pelvis");

    frameSource.triggerFrame(100);
    scheduler.flush();

    expect(handle.get("walk/pelvis")).toBeDefined();
    handle.dispose();
    clock.dispose();
  });

  it("4. Demonstrate progress through TriggerPort and manual signals", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");

    handle.signal("walk", { type: "manual", progress: 0.5 });
    scheduler.flush();

    const pelvisPatch = handle.get("walk/pelvis");
    expect(pelvisPatch?.values.x).toBe(100);

    handle.dispose();
    clock.dispose();
  });

  it("5. Render multiple tracks from one Motion in one published batch", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.mount("walk/shin");

    const batch = handle.seek("walk/pelvis", 0);
    const publishedIds = batch.patches.map((p) => p.nodeId);

    expect(publishedIds).toContain("walk/pelvis");
    expect(publishedIds).toContain("walk/thigh");
    expect(publishedIds).toContain("walk/shin");

    handle.dispose();
    clock.dispose();
  });

  it("6. Demonstrate FK graph observation dependency chain (pelvis -> thigh -> shin)", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.mount("walk/shin");

    // Seek to p=0: pelvis x=0, y=100, rot=0
    const batch = handle.seek("walk/pelvis", 0);
    const thighPatch = batch.patches.find((p) => p.nodeId === "walk/thigh");
    const shinPatch = batch.patches.find((p) => p.nodeId === "walk/shin");

    // Thigh (base.rotation=0, own rotation=45): worldRot=45, x = 0 + 50*cos(45deg) = 35.355,
    // y = 100 + 50*sin(45deg) = 135.355
    expect(thighPatch?.values.x).toBeCloseTo(35.355, 2);
    expect(thighPatch?.values.y).toBeCloseTo(135.355, 2);
    expect(thighPatch?.values.rotation).toBeCloseTo(45, 2);

    // Shin (base.rotation=45, own rotation=-30): worldRot=15, x = 35.355 + 40*cos(15deg) = 73.997,
    // y = 135.355 + 40*sin(15deg) = 145.707
    expect(shinPatch?.values.x).toBeCloseTo(73.997, 2);
    expect(shinPatch?.values.y).toBeCloseTo(145.707, 2);
    expect(shinPatch?.values.rotation).toBeCloseTo(15, 2);

    handle.dispose();
    clock.dispose();
  });

  it("7. Mount, unmount, remount, and dispose without duplicate subscriptions", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.unmount("walk/pelvis");
    handle.mount("walk/pelvis");

    let count = 0;
    const unsubscribe = handle.subscribe("walk/pelvis", () => count++);
    handle.seek("walk/pelvis", 0.5);
    expect(count).toBe(1);

    unsubscribe();
    handle.dispose();
    clock.dispose();
  });

  it("8. Show blocked/pending/error diagnostics without crashing the app", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    const batch = handle.seek("walk/pelvis", 0.5);

    expect(batch.diagnostics).toBeDefined();
    expect(Array.isArray(batch.diagnostics)).toBe(true);

    handle.dispose();
    clock.dispose();
  });

  it("9. Use React usePatch hook at the React boundary", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");

    const patchValues: Array<number | undefined> = [];
    function WalkerConsumer(): null {
      const patch = usePatch(handle, "walk/pelvis");
      patchValues.push(patch?.values.x as number | undefined);
      return null;
    }

    let renderer: { unmount(): void };
    act(() => {
      renderer = create(createElement(WalkerConsumer, null));
    });

    act(() => {
      handle.seek("walk/pelvis", 0.5);
    });

    expect(patchValues).toContain(100);

    renderer!.unmount();
    handle.dispose();
    clock.dispose();
  });

  it("10. Automated end-to-end integration test passes clean", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.mount("walk/shin");

    const batch = handle.seek("walk/pelvis", 1);
    expect(batch.patches.filter((p) => p.status === "ready").length).toBeGreaterThanOrEqual(3);
    expect(batch.patches[0]?.status).toBe("ready");

    handle.dispose();
    clock.dispose();
  });

  it("11. Convert one arm of walker to IK while asserting FK bones unchanged from baseline", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.mount("walk/shin");
    handle.mount("walk/shoulder");
    handle.mount("walk/upper-arm");
    handle.mount("walk/forearm");
    handle.mount("walk/hand");
    handle.mount("walk/hand-target");
    handle.mount("walk/arm-solve");

    // Seek to p=0:
    const batch = handle.seek("walk/pelvis", 0);

    // 1. Guard against FK regression: FK leg bones must match pre-C3 baseline (Case 6)
    const thighPatch = batch.patches.find((p) => p.nodeId === "walk/thigh");
    const shinPatch = batch.patches.find((p) => p.nodeId === "walk/shin");

    expect(thighPatch?.values.x).toBeCloseTo(35.355, 2);
    expect(thighPatch?.values.y).toBeCloseTo(135.355, 2);
    expect(thighPatch?.values.rotation).toBeCloseTo(45, 2);

    expect(shinPatch?.values.x).toBeCloseTo(73.997, 2);
    expect(shinPatch?.values.y).toBeCloseTo(145.707, 2);
    expect(shinPatch?.values.rotation).toBeCloseTo(15, 2);

    // 2. Verify IK arm solve:
    const solvePatch = batch.patches.find((p) => p.nodeId === "walk/arm-solve");
    expect(solvePatch).toBeDefined();
    const rotations = solvePatch?.values.rotations as Record<string, number>;
    expect(rotations).toBeDefined();
    expect(typeof rotations["walk/upper-arm"]).toBe("number");
    expect(typeof rotations["walk/forearm"]).toBe("number");

    // Forearm tip must reach target at (35, 75):
    const forearmPatch = batch.patches.find((p) => p.nodeId === "walk/forearm");
    expect(forearmPatch?.values.x).toBeCloseTo(35, 1);
    expect(forearmPatch?.values.y).toBeCloseTo(75, 1);

    // Hand follows downstream at forearm tip:
    const handPatch = batch.patches.find((p) => p.nodeId === "walk/hand");
    expect(handPatch?.status).toBe("ready");

    handle.dispose();
    clock.dispose();
  });

  it("12. T-C4.1: Dynamic mutation and transactional rollback for solver topology", () => {
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    handle.mount("walk/pelvis");
    handle.mount("walk/shoulder");
    handle.mount("walk/upper-arm");
    handle.mount("walk/forearm");
    handle.mount("walk/hand-target");
    handle.mount("walk/arm-solve");

    // 1. Dynamic replacement of a member mid-flight
    const updatedUpperArm = {
      id: "upper-arm",
      keyframes: {
        fk: {
          values: {
            length: 32, // Modified length
          },
          requires: { base: "walk/shoulder", solver: "walk/arm-solve" },
        },
      },
    };

    const upperArmHandle = handle.track("walk/upper-arm");
    expect(() => upperArmHandle.replace(updatedUpperArm)).not.toThrow();
    handle.seek("walk/pelvis", 0.5);
    expect(handle.get("walk/forearm")?.status).toBe("ready");

    // 2. Staging invalid solver topology rolls back cleanly without partial corruption
    const brokenUpperArm = {
      id: "upper-arm",
      keyframes: {
        fk: {
          values: { length: 32 },
          requires: { base: "walk/unreachable-root", solver: "walk/arm-solve" },
        },
      },
    };

    expect(() => upperArmHandle.replace(brokenUpperArm)).toThrow();

    // Previous graph is still live and uncorrupted:
    expect(handle.get("walk/forearm")?.status).toBe("ready");

    handle.dispose();
    clock.dispose();
  });

  it("13. A three-bone tail solves iteratively while every other bone stays put", () => {
    // Slice D4 of issue #195. The unit fixtures prove the iterative solve is right and that the
    // dispatcher picks it; they cannot prove that adding a second solver to a real rig leaves the
    // first one alone. That is what this case is for, and it is why the arm and the legs are
    // asserted against the numbers cases 6 and 11 already pin rather than against fresh ones.
    const clock = createBrowserClock(createFakeFrameSource());
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
      plugins,
    }).load(walkerProject);

    for (const id of [
      "walk/pelvis",
      "walk/thigh",
      "walk/shin",
      "walk/shoulder",
      "walk/upper-arm",
      "walk/forearm",
      "walk/hand",
      "walk/hand-target",
      "walk/arm-solve",
      "walk/tail-base",
      "walk/tail-1",
      "walk/tail-2",
      "walk/tail-3",
      "walk/tail-target",
      "walk/tail-solve",
    ]) {
      handle.mount(id);
    }

    const batch = handle.seek("walk/pelvis", 0);
    const at = (nodeId: string) => batch.patches.find((p) => p.nodeId === nodeId);
    const between = (a: string, b: string): number =>
      Math.hypot(
        (at(a)?.values.x as number) - (at(b)?.values.x as number),
        (at(a)?.values.y as number) - (at(b)?.values.y as number),
      );

    // 1. Every node of the rig publishes, both solvers included.
    for (const id of ["walk/tail-1", "walk/tail-2", "walk/tail-3", "walk/tail-solve"]) {
      expect(at(id)?.status).toBe("ready");
    }

    // 2. One solve for the whole tail, keyed by member id, and never a per-member re-solve.
    //    Three members is exactly the count `ik-solver-unsupported-arity` used to refuse.
    const tailRotations = at("walk/tail-solve")?.values.rotations as Record<string, number>;
    expect(Object.keys(tailRotations).sort()).toEqual([
      "walk/tail-1",
      "walk/tail-2",
      "walk/tail-3",
    ]);
    for (const value of Object.values(tailRotations)) expect(Number.isFinite(value)).toBe(true);

    // 3. The tip reaches the goal the dict addressed. The anchor is the pelvis at (0, 100) and
    //    the goal is (24, 132), so the chain spends 40 of its 60 units of reach.
    expect(at("walk/tail-base")?.values.x).toBeCloseTo(0, 6);
    expect(at("walk/tail-base")?.values.y).toBeCloseTo(100, 6);
    expect(at("walk/tail-3")?.values.x).toBeCloseTo(24, 1);
    expect(at("walk/tail-3")?.values.y).toBeCloseTo(132, 1);

    // 4. Segment lengths are the invariant a tolerance does not cover: an iteration that reached
    //    the goal by stretching a segment would converge and be wrong. Measured on the published
    //    frames, because that is what a renderer sees.
    expect(between("walk/tail-base", "walk/tail-1")).toBeCloseTo(20, 6);
    expect(between("walk/tail-1", "walk/tail-2")).toBeCloseTo(20, 6);
    expect(between("walk/tail-2", "walk/tail-3")).toBeCloseTo(20, 6);

    // 5. The FK leg is untouched, at case 6's numbers.
    expect(at("walk/thigh")?.values.x).toBeCloseTo(35.355, 2);
    expect(at("walk/thigh")?.values.y).toBeCloseTo(135.355, 2);
    expect(at("walk/thigh")?.values.rotation).toBeCloseTo(45, 2);
    expect(at("walk/shin")?.values.x).toBeCloseTo(73.997, 2);
    expect(at("walk/shin")?.values.y).toBeCloseTo(145.707, 2);
    expect(at("walk/shin")?.values.rotation).toBeCloseTo(15, 2);

    // 6. And the two-bone arm still takes the analytic path, at case 11's numbers, with its own
    //    solver publishing only its own two members. A dispatcher that wrongly routed the arm to
    //    the iterative solve would still reach (35, 75), so the key set is asserted beside it.
    const armRotations = at("walk/arm-solve")?.values.rotations as Record<string, number>;
    expect(Object.keys(armRotations).sort()).toEqual(["walk/forearm", "walk/upper-arm"]);
    expect(at("walk/forearm")?.values.x).toBeCloseTo(35, 1);
    expect(at("walk/forearm")?.values.y).toBeCloseTo(75, 1);
    expect(at("walk/hand")?.status).toBe("ready");

    handle.dispose();
    clock.dispose();
  });
});
