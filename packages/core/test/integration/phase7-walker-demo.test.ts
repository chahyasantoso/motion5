import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { createBrowserClock, type FrameSource } from "../../src/adapters/browser-clock";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
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
                x: {
                  stops: [
                    { p: 0, v: 0 },
                    { p: 1, v: 200 },
                  ],
                },
                y: {
                  stops: [
                    { p: 0, v: 100 },
                    { p: 1, v: 100 },
                  ],
                },
                rotation: {
                  stops: [
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
                length: {
                  stops: [
                    { p: 0, v: 50 },
                    { p: 1, v: 50 },
                  ],
                },
                rotation: {
                  stops: [
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
                length: {
                  stops: [
                    { p: 0, v: 40 },
                    { p: 1, v: 40 },
                  ],
                },
                rotation: {
                  stops: [
                    { p: 0, v: -30 },
                    { p: 1, v: -30 },
                  ],
                },
                requires: { base: "walk/thigh" },
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
    expect(batch.patches).toHaveLength(3);
    expect(batch.patches[0]?.status).toBe("ready");

    handle.dispose();
    clock.dispose();
  });
});
