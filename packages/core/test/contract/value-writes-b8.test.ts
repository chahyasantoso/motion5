import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { compileTrackExecutionPlan } from "../../src/domain/execution-plan";
import {
  applyValueTransaction,
  createEntryLiveHandle,
  validateValueBatch,
  splitValidatedValueBatch,
  type EntryLiveHandleHost,
} from "../../src/domain/value-transaction";
import { LiveValueKeyError, Track } from "../../src/domain/track";
import { StaleTrackHandleError, type LiveValues } from "../../src/contract/track-handle";
import {
  PATCHED,
  type InterpolationTimeline,
  type Interpolator,
} from "../../src/ports/interpolator";
import type { PatchBatch } from "../../src/contract/v5";

function createMockInterpolator(initialState: Record<string, unknown> = {}): Interpolator {
  return {
    create(): InterpolationTimeline {
      let currentProgress = 0;
      const state = { ...initialState };
      return {
        duration: 1,
        state,
        progress(value?: number): any {
          if (value !== undefined) {
            currentProgress = value;
            return;
          }
          return currentProgress;
        },
        kill: () => {},
        patchKeys(overlay: Readonly<Record<string, unknown>>) {
          for (const [key, val] of Object.entries(overlay)) {
            if (val !== null && typeof val === "object" && !Array.isArray(val)) {
              state[key] = {
                ...((state[key] as Record<string, unknown>) ?? {}),
                ...(val as Record<string, unknown>),
              };
            } else {
              state[key] = val;
            }
          }
          return PATCHED;
        },
      };
    },
  };
}

describe("Slice B8: Uniform entry-addressed value transactions", () => {
  const transformPlugin: PluginDefinition = {
    name: "transform",
    keys: ["x", "y", "rotation", "scale"],
    fold: { outputs: ["transformOut"], run: () => ({}) },
  };

  const armPlugin: PluginDefinition = {
    name: "arm",
    keys: ["length", "angle"],
    requirements: {
      parent: {},
      constraints: { dict: true },
    },
    fold: { outputs: ["armOut"], run: () => ({}) },
  };

  const registry = new PluginRegistry();
  registry.registerAll([transformPlugin, armPlugin]);

  it("two entries sharing rotation/x update independently", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          fore: {
            plugin: "transform",
            values: { x: 10, rotation: 45 },
          },
        },
        {
          aft: {
            plugin: "transform",
            values: { x: 20, rotation: 90 },
          },
        },
      ],
      registry,
      generation: 1,
    });

    const result1 = applyValueTransaction(
      plan,
      "node-1",
      undefined,
      undefined,
      { fore: { rotation: 50 } },
      1,
    );
    expect(result1.effectiveValues.get("fore")?.rotation).toBe(50);
    expect(result1.effectiveValues.get("fore")?.x).toBe(10);
    expect(result1.effectiveValues.get("aft")?.rotation).toBe(90);
    expect(result1.effectiveValues.get("aft")?.x).toBe(20);

    const result2 = applyValueTransaction(
      plan,
      "node-1",
      result1.statics,
      result1.overlays,
      { aft: { x: 25 } },
      1,
    );
    expect(result2.effectiveValues.get("fore")?.rotation).toBe(50);
    expect(result2.effectiveValues.get("aft")?.x).toBe(25);
    expect(result2.effectiveValues.get("aft")?.rotation).toBe(90);
  });

  it("all-ID transform writes across multiple entries in a single batch", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [
        { fore: { plugin: "transform", values: { x: 1, y: 2 } } },
        { aft: { plugin: "transform", values: { x: 3, y: 4 } } },
      ],
      registry,
      generation: 1,
    });

    const result = applyValueTransaction(
      plan,
      "node-1",
      undefined,
      undefined,
      {
        fore: { x: 100, y: 200 },
        aft: { x: 300, y: 400 },
      },
      1,
    );

    expect(result.effectiveValues.get("fore")).toEqual({ x: 100, y: 200 });
    expect(result.effectiveValues.get("aft")).toEqual({ x: 300, y: 400 });
  });

  it("no old flat or encoded addresses accepted", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [{ fore: { plugin: "transform", values: { x: 10, y: 20 } } }],
      registry,
      generation: 1,
    });

    expect(() => validateValueBatch(plan, "node-1", { x: 15 }, 1)).toThrow(LiveValueKeyError);

    expect(() => validateValueBatch(plan, "node-1", { "01::x": 15 }, 1)).toThrow(LiveValueKeyError);

    expect(() => validateValueBatch(plan, "node-1", { "fore/x": 15 }, 1)).toThrow(
      LiveValueKeyError,
    );

    expect(() => validateValueBatch(plan, "node-1", { transform: { x: 15 } }, 1)).toThrow(
      LiveValueKeyError,
    );
  });

  it("stops/percent maps agree with initial authoring (kind error if mismatched)", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          fore: {
            plugin: "transform",
            values: {
              x: 10,
              y: [
                { at: 0, value: 0 },
                { at: 1, value: 100 },
              ],
            },
          },
        },
      ],
      registry,
      generation: 1,
    });

    expect(() =>
      validateValueBatch(
        plan,
        "node-1",
        {
          fore: {
            x: [
              { at: 0, value: 5 },
              { at: 1, value: 15 },
            ],
          },
        },
        1,
      ),
    ).toThrow(LiveValueKeyError);

    try {
      validateValueBatch(
        plan,
        "node-1",
        {
          fore: {
            x: [
              { at: 0, value: 5 },
              { at: 1, value: 15 },
            ],
          },
        },
        1,
      );
    } catch (e: any) {
      expect(e).toBeInstanceOf(LiveValueKeyError);
      expect(e.reason).toBe("kind");
      expect(e.key).toBe("x");
    }

    expect(() => validateValueBatch(plan, "node-1", { fore: { y: 50 } }, 1)).toThrow(
      LiveValueKeyError,
    );

    try {
      validateValueBatch(plan, "node-1", { fore: { y: 50 } }, 1);
    } catch (e: any) {
      expect(e).toBeInstanceOf(LiveValueKeyError);
      expect(e.reason).toBe("kind");
      expect(e.key).toBe("y");
    }

    const validOverlay = validateValueBatch(
      plan,
      "node-1",
      {
        fore: {
          y: [
            { at: 0, value: 10 },
            { at: 1, value: 200 },
          ],
        },
      },
      1,
    );
    const { statics, animated } = splitValidatedValueBatch(validOverlay);
    expect(statics).toEqual({});
    expect(animated.fore).toBeDefined();
  });

  it("zeros, false, and empty strings are preserved", () => {
    const stringPlugin: PluginDefinition = {
      name: "text",
      keys: ["content", "visible", "count"],
      fold: { outputs: ["textOut"], run: () => ({}) },
    };
    const reg = new PluginRegistry();
    reg.register(stringPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          label: {
            plugin: "text",
            values: { content: "hello", visible: true, count: 42 },
          },
        },
      ],
      registry: reg,
      generation: 1,
    });

    const result = applyValueTransaction(
      plan,
      "node-1",
      undefined,
      undefined,
      { label: { content: "", visible: false, count: 0 } },
      1,
    );

    const values = result.effectiveValues.get("label");
    expect(values?.content).toBe("");
    expect(values?.visible).toBe(false);
    expect(values?.count).toBe(0);
    expect(Object.is(values?.count, 0)).toBe(true);

    const negZeroResult = applyValueTransaction(
      plan,
      "node-1",
      undefined,
      undefined,
      { label: { count: -0 } },
      1,
    );
    expect(Object.is(negZeroResult.effectiveValues.get("label")?.count, -0)).toBe(true);
  });

  it("structural fields and dictionary member keys refuse", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          root: {
            plugin: "transform",
            values: { x: 0 },
          },
        },
        {
          arm1: {
            plugin: "arm",
            values: { length: 50, angle: 30 },
            requires: {
              parent: "root",
              constraints: { min: "root" },
            },
          },
        },
      ],
      registry,
      generation: 1,
    });

    const structuralKeys = ["id", "entryId", "order", "index", "plugin", "requires"];
    for (const key of structuralKeys) {
      expect(() => validateValueBatch(plan, "node-1", { root: { [key]: 10 } }, 1)).toThrow(
        LiveValueKeyError,
      );
    }

    expect(() => validateValueBatch(plan, "node-1", { arm1: { min: "root" } }, 1)).toThrow(
      LiveValueKeyError,
    );
  });

  it("unknown and prepared refusals remain meaningful", () => {
    const preparedPlugin: PluginDefinition = {
      name: "prepared-test",
      stage: "prepare",
      keys: ["a", "b"],
      fold: { outputs: ["out"], run: () => ({}) },
      contribute: () => ({
        keyframes: {
          b: [
            { p: 0, v: 99 },
            { p: 1, v: 99 },
          ],
        },
      }),
    };
    const reg = new PluginRegistry();
    reg.register(preparedPlugin);

    const plan = compileTrackExecutionPlan({
      keyframes: [
        {
          t1: {
            plugin: "prepared-test",
            values: {
              a: [
                { p: 0, v: 1 },
                { p: 1, v: 2 },
              ],
            },
          },
        },
      ],
      registry: reg,
      generation: 1,
    });

    try {
      validateValueBatch(plan, "node-1", { t1: { nonexistent: 123 } }, 1);
      expect.unreachable();
    } catch (e: any) {
      expect(e).toBeInstanceOf(LiveValueKeyError);
      expect(e.reason).toBe("unknown");
      expect(e.key).toBe("nonexistent");
    }

    try {
      validateValueBatch(plan, "node-1", { t1: { b: 100 } }, 1);
      expect.unreachable();
    } catch (e: any) {
      expect(e).toBeInstanceOf(LiveValueKeyError);
      expect(e.reason).toBe("prepared");
      expect(e.key).toBe("b");
    }
  });

  it("mixed valid-invalid batch is atomic (no partial state changes)", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [
        { fore: { plugin: "transform", values: { x: 10, y: 20 } } },
        { aft: { plugin: "transform", values: { x: 30, y: 40 } } },
      ],
      registry,
      generation: 1,
    });

    const initialStatics: LiveValues = {
      fore: { x: 10, y: 20 },
      aft: { x: 30, y: 40 },
    };

    expect(() =>
      applyValueTransaction(
        plan,
        "node-1",
        initialStatics,
        undefined,
        {
          fore: { x: 999 },
          aft: { nonexistent: 888 },
        },
        1,
      ),
    ).toThrow(LiveValueKeyError);
  });

  it("stale generation token cannot hit reused ID", () => {
    const planGen1 = compileTrackExecutionPlan({
      keyframes: [{ fore: { plugin: "transform", values: { x: 10 } } }],
      registry,
      generation: 1,
    });

    const planGen2 = compileTrackExecutionPlan({
      keyframes: [{ fore: { plugin: "transform", values: { x: 20 } } }],
      registry,
      generation: 2,
    });

    expect(() => validateValueBatch(planGen1, "node-1", { fore: { x: 100 } }, 2)).toThrow(
      StaleTrackHandleError,
    );

    expect(() => validateValueBatch(planGen2, "node-1", { fore: { x: 100 } }, 1)).toThrow(
      StaleTrackHandleError,
    );
  });

  it("EntryLiveHandle forwards to host with captured generation", () => {
    let capturedEntryId = "";
    let capturedValues: any = null;
    let capturedRebase = false;
    let capturedGen: any = null;

    const host: EntryLiveHandleHost = {
      writeEntryValues(entryId, values, rebase, generation): PatchBatch {
        capturedEntryId = entryId;
        capturedValues = values;
        capturedRebase = rebase;
        capturedGen = generation;
        return {
          tick: 1,
          seeds: ["node-1"],
          patches: [],
          diagnostics: [],
        };
      },
    };

    const handle = createEntryLiveHandle(host, "node-1", "fore", 1);
    expect(handle.entryId).toBe("fore");
    expect(handle.generation).toBe("1");

    handle.setValues({ x: 42 });
    expect(capturedEntryId).toBe("fore");
    expect(capturedValues).toEqual({ x: 42 });
    expect(capturedRebase).toBe(true);
    expect(capturedGen).toBe(1);

    handle.overrideValues({ x: 84 });
    expect(capturedRebase).toBe(false);
    expect(capturedValues).toEqual({ x: 84 });
  });

  it("Track.writeValues with plan validates and merges entry-addressed values", () => {
    const plan = compileTrackExecutionPlan({
      keyframes: [
        { fore: { plugin: "transform", values: { x: 10, rotation: 30 } } },
        { aft: { plugin: "transform", values: { x: 50, rotation: 60 } } },
      ],
      registry,
      generation: 1,
    });

    const track = new Track({
      nodeId: "node-1",
      interpolator: createMockInterpolator({
        fore: { x: 10, rotation: 30 },
        aft: { x: 50, rotation: 60 },
      }),
      plan,
    });

    const initial = track.interpolated() as Record<string, Record<string, unknown>>;
    expect(initial.fore?.x).toBe(10);
    expect(initial.fore?.rotation).toBe(30);

    track.writeValues(
      {
        fore: { x: 99 },
      },
      undefined,
      false,
    );

    const updated = track.interpolated() as Record<string, Record<string, unknown>>;
    expect(updated.fore?.x).toBe(99);
    expect(updated.fore?.rotation).toBe(30);
    expect(updated.aft?.x).toBe(50);

    expect(() => track.writeValues({ fore: { invalidKey: 123 } }, undefined, false)).toThrow(
      LiveValueKeyError,
    );
  });
});
