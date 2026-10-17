import { describe, expect, it, vi } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import { prepareTrack } from "../../src/domain/track-preparation";
import { createFakeInterpolator } from "../../src/testing/fakes";
import type { AuthoredStop } from "../../src/contract/v5";

const stops = (start: number, end: number): readonly AuthoredStop[] => [
  { p: 0, v: start },
  { p: 1, v: end },
];

describe("B4 — Isolate preparation, static data, and timing", () => {
  it("allows two repeated entries to contribute the same internal name independently without sibling leak", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "fk",
      keys: ["length", "internalAngle"],
      stage: "prepare",
      contribute: (key, authoredStops) => {
        if (key === "length") {
          const firstVal = authoredStops[0]?.v as number;
          return {
            keyframes: {
              internalAngle: stops(firstVal * 10, firstVal * 20),
            },
          };
        }
        return undefined;
      },
      collect: {
        output: "bone",
        run: () => ({}),
      },
    });

    const keyframes = [
      { bone1: { plugin: "fk", values: { length: stops(1, 2) } } },
      { bone2: { plugin: "fk", values: { length: stops(5, 6) } } },
    ];

    const plan = registry.compileExecutionPlan(keyframes, { trackId: "arm" });
    expect(plan.diagnostics).toEqual([]);

    const interpolator = createFakeInterpolator();
    const track = prepareTrack({ plan, interpolator });

    // Sampling at progress 0
    const state0 = track.sample(0);
    const b1At0 = state0.get("bone1");
    const b2At0 = state0.get("bone2");

    expect(b1At0).toEqual({ length: 1, internalAngle: 10 });
    expect(b2At0).toEqual({ length: 5, internalAngle: 50 });

    // Sampling at progress 1
    const state1 = track.sample(1);
    const b1At1 = state1.get("bone1");
    const b2At1 = state1.get("bone2");

    expect(b1At1).toEqual({ length: 2, internalAngle: 20 });
    expect(b2At1).toEqual({ length: 6, internalAngle: 100 });

    track.dispose();
  });

  it("attaches static zero and animated values strictly to their owner without dropping zero or merging", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "transform",
      keys: ["x", "y"],
      collect: {
        output: "transform",
        run: () => ({}),
      },
    });

    const keyframes = [
      {
        staticEntry: {
          plugin: "transform",
          values: { x: 0, y: 100 },
        },
      },
      {
        animatedEntry: {
          plugin: "transform",
          values: { x: stops(10, 20) },
        },
      },
    ];

    const plan = registry.compileExecutionPlan(keyframes);
    const track = prepareTrack({ plan, interpolator: createFakeInterpolator() });

    const state = track.sample(0.5);
    const staticBag = state.get("staticEntry");
    const animBag = state.get("animatedEntry");

    // Static zero preserved and not dropped or merged
    expect(staticBag).toEqual({ x: 0, y: 100 });
    expect(animBag).toEqual({ x: 15 });
    expect(animBag).not.toHaveProperty("y");

    track.dispose();
  });

  it("verifies endpoints and reverse seek match direct stop sampling", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "mover",
      keys: ["val"],
      collect: {
        output: "pos",
        run: () => ({}),
      },
    });

    const keyframes = [
      {
        pos: {
          plugin: "mover",
          values: { val: stops(100, 300) },
        },
      },
    ];

    const plan = registry.compileExecutionPlan(keyframes);
    const track = prepareTrack({ plan, interpolator: createFakeInterpolator() });

    // Direct forward endpoint 0
    expect(track.sample(0).get("pos")).toEqual({ val: 100 });

    // Direct forward endpoint 1
    expect(track.sample(1).get("pos")).toEqual({ val: 300 });

    // Intermediate sample
    expect(track.sample(0.25).get("pos")).toEqual({ val: 150 });

    // Reverse seek from 1 to 0
    track.setProgress(1);
    expect(track.sample().get("pos")).toEqual({ val: 300 });

    track.setProgress(0);
    expect(track.sample().get("pos")).toEqual({ val: 100 });

    track.dispose();
  });

  it("schedules dependency-only synthetic operations without dummy numeric leaves", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "solver",
      keys: ["weight"],
      requirements: { base: {} },
      collect: {
        output: "solved",
        run: () => ({}),
      },
    });

    const keyframes = [
      {
        depOnly: {
          plugin: "solver",
          // values omitted
          requires: { base: "otherTrack" },
        },
      },
    ];

    const plan = registry.compileExecutionPlan(keyframes);
    const track = prepareTrack({ plan, interpolator: createFakeInterpolator() });

    const state = track.sample(0.5);
    expect(state.has("depOnly")).toBe(true);
    expect(state.get("depOnly")).toEqual({});

    track.dispose();
  });

  it("refuses invalid contribution ownership, reserved tween vars, and static source keys", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "unclaimedContributor",
      keys: ["source"],
      stage: "prepare",
      contribute: () => ({
        keyframes: {
          unclaimed: stops(1, 2),
        },
      }),
      collect: {
        output: "out",
        run: () => ({}),
      },
    });

    // 1. Unclaimed key contribution
    const planUnclaimed = registry.compileExecutionPlan([
      { e1: { plugin: "unclaimedContributor", values: { source: stops(0, 1) } } },
    ]);
    expect(planUnclaimed.diagnostics.map((d) => d.ruleId)).toContain("plugin-unknown-key");

    // 2. Reserved tween var
    const registry2 = new PluginRegistry();
    registry2.register({
      name: "reservedTweenContributor",
      keys: ["source"],
      stage: "prepare",
      contribute: () => ({
        tweenVars: { duration: 99 },
      }),
      collect: {
        output: "out",
        run: () => ({}),
      },
    });
    const planReserved = registry2.compileExecutionPlan([
      { e1: { plugin: "reservedTweenContributor", values: { source: stops(0, 1) } } },
    ]);
    expect(planReserved.diagnostics.map((d) => d.ruleId)).toContain(
      "plugin-contribution-reserved-tween-var",
    );

    // 3. Static leaf as contribute source
    const registry3 = new PluginRegistry();
    registry3.register({
      name: "staticSourcePlugin",
      keys: ["staticKey"],
      stage: "prepare",
      contribute: () => ({
        keyframes: {},
      }),
      collect: {
        output: "out",
        run: () => ({}),
      },
    });
    const planStatic = registry3.compileExecutionPlan([
      { e1: { plugin: "staticSourcePlugin", values: { staticKey: 42 } } },
    ]);
    expect(planStatic.diagnostics.map((d) => d.ruleId)).toContain(
      "plugin-contribution-static-unsupported",
    );

    // 4. Overwrite authored key
    const registry4 = new PluginRegistry();
    registry4.register({
      name: "collider",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({
        keyframes: { x: stops(10, 20) },
      }),
      collect: {
        output: "out",
        run: () => ({}),
      },
    });
    const planCollide = registry4.compileExecutionPlan([
      { e1: { plugin: "collider", values: { x: stops(0, 1) } } },
    ]);
    expect(planCollide.diagnostics.map((d) => d.ruleId)).toContain(
      "plugin-contribution-output-collision",
    );

    // 5. Contributor failure (thrown error)
    const registry5 = new PluginRegistry();
    registry5.register({
      name: "failer",
      keys: ["err"],
      stage: "prepare",
      contribute: () => {
        throw new Error("hook crashed");
      },
      collect: {
        output: "out",
        run: () => ({}),
      },
    });
    const planFail = registry5.compileExecutionPlan([
      { e1: { plugin: "failer", values: { err: stops(0, 1) } } },
    ]);
    expect(planFail.diagnostics.map((d) => d.ruleId)).toContain("plugin-contribution-failure");
  });

  it("abandons preparation immediately on diagnostic errors and leaks no timeline or subscription", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "broken",
      keys: ["val"],
      stage: "prepare",
      contribute: () => ({
        keyframes: { unclaimed: stops(1, 2) },
      }),
      collect: {
        output: "out",
        run: () => ({}),
      },
    });

    const plan = registry.compileExecutionPlan([
      { e1: { plugin: "broken", values: { val: stops(0, 1) } } },
    ]);
    expect(plan.diagnostics.length).toBeGreaterThan(0);

    const interpolator = createFakeInterpolator();
    const createSpy = vi.spyOn(interpolator, "create");

    expect(() => prepareTrack({ plan, interpolator })).toThrow(/Track preparation failed/);
    expect(createSpy).not.toHaveBeenCalled();
  });

  it("cleans up timeline on dispose without leaking active resources", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "valid",
      keys: ["val"],
      collect: {
        output: "out",
        run: () => ({}),
      },
    });

    const plan = registry.compileExecutionPlan([
      { e1: { plugin: "valid", values: { val: stops(0, 10) } } },
    ]);

    const interpolator = createFakeInterpolator();
    const track = prepareTrack({ plan, interpolator });

    expect(track.sample(0.5).get("e1")).toEqual({ val: 5 });

    track.dispose();

    expect(() => track.setProgress(0.8)).toThrow(/disposed/);
    expect(() => track.sample()).toThrow(/disposed/);
  });
});
