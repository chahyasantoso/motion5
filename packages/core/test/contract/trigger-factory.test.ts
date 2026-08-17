import { describe, expect, it } from "vitest";
import type { TriggerDefinition } from "../../src/contract/v5";
import { resolveTriggerDefinition, validateMotionTrigger } from "../../src/contract/validate-v5";
import { Engine } from "../../src/engine";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import {
  createDefaultTriggerFactory,
  createTriggerFactory,
} from "../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTriggerPort,
} from "../../src/ports/fakes";
import {
  assertTriggerFactory,
  type TriggerFactory,
  type TriggerFactoryContext,
} from "../../src/ports/trigger-factory";

function engine(options: { triggerFactory?: TriggerFactory } = {}) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    ...options,
  });
}

function context(trigger: TriggerDefinition, motionId = "scene"): TriggerFactoryContext {
  return {
    motionId,
    definition: { id: motionId, trigger, tracks: [] },
    trigger,
    clock: createManualClock(),
    scheduler: createFakeScheduler(),
  };
}

function ruleIds(trigger: unknown) {
  return validateMotionTrigger(trigger, "trigger").map(({ ruleId }) => ruleId);
}

describe("trigger contract T1/T2/T3", () => {
  it("rejects a time trigger without a positive duration", () => {
    expect(() =>
      engine().load({
        schemaVersion: 5,
        motions: [{ id: "scene", trigger: { type: "time" }, tracks: [] }],
      }),
    ).toThrow(/trigger-time-duration/);
  });

  it("rejects unsupported time playback fields", () => {
    expect(ruleIds({ type: "time", duration: 1000, autoplay: false })).toEqual([
      "trigger-time-autoplay-unsupported",
    ]);
    expect(ruleIds({ type: "time", duration: 1000, repeat: 0 })).toEqual([
      "trigger-time-repeat-unsupported",
    ]);
    expect(ruleIds({ type: "time", duration: 1000, yoyo: true })).toEqual([
      "trigger-time-repeat-unsupported",
    ]);
  });

  it("validates trigger rows", () => {
    const rejected = [
      [{}, "trigger-shape"],
      [{ type: "unknown" }, "trigger-shape"],
      [{ type: "time", duration: 0 }, "trigger-time-duration"],
      [{ type: "scroll", source: "" }, "trigger-scroll-source"],
      [{ type: "scroll", source: 42 }, "trigger-scroll-source"],
    ] as const;
    for (const [trigger, ruleId] of rejected) expect(ruleIds(trigger)).toContain(ruleId);
    const accepted = [
      { type: "time", duration: 1000 },
      { type: "time", duration: 1000, autoplay: true },
      { type: "manual" },
      { type: "scroll" },
      { type: "scroll", source: "hero" },
    ];
    for (const trigger of accepted) expect(validateMotionTrigger(trigger, "trigger")).toEqual([]);
  });

  it("narrows an authored trigger exactly once, immediately behind validation", () => {
    expect(
      resolveTriggerDefinition({ type: "time", duration: 1000 }, "motions.scene.trigger"),
    ).toEqual({ type: "time", duration: 1000 });
    expect(() => resolveTriggerDefinition({ type: "time" }, "motions.scene.trigger")).toThrow(
      "trigger-time-duration at motions.scene.trigger.duration:",
    );
  });

  it("rejects malformed TriggerFactory values", () => {
    expect(() => assertTriggerFactory(null)).toThrow(/TriggerFactory/);
    expect(() => assertTriggerFactory({})).toThrow(/TriggerFactory/);
    expect(() => assertTriggerFactory({ create: 1 })).toThrow(/TriggerFactory/);
  });

  it("selects manual, time, and injected scroll drivers", () => {
    const scroll: ScrollSource = { subscribe: () => () => undefined };
    const factory = createTriggerFactory({ scroll: () => scroll });
    const cases = [
      [{ type: "manual" }, true, "motion"],
      [{ type: "time", duration: 1000 }, false, "driver"],
      [{ type: "scroll", source: "hero" }, false, "none"],
    ] as const;
    for (const [trigger, acceptsExternalSignal, kind] of cases) {
      const created = factory.create(context(trigger));
      expect(created.acceptsExternalSignal).toBe(acceptsExternalSignal);
      // One total field. "A driver *and* motion.onTick" is unrepresentable, not merely untested.
      expect(created.clockBinding.kind).toBe(kind);
      created.dispose();
    }
  });

  it("fails loudly when a declared scroll trigger has no registered source", () => {
    expect(() =>
      createDefaultTriggerFactory().create(context({ type: "scroll", source: "hero" })),
    ).toThrow(/trigger-driver-unavailable/);
  });

  it("hands the scroll resolver the narrowed trigger and nothing else", () => {
    const seen: string[] = [];
    const factory = createTriggerFactory({
      scroll: ({ motionId, trigger }) => {
        seen.push(`${motionId}:${trigger.source ?? ""}`);
        return { subscribe: () => () => undefined };
      },
    });
    factory.create(context({ type: "scroll", source: "hero" })).dispose();
    factory.create(context({ type: "scroll" }, "bare")).dispose();
    expect(seen).toEqual(["scene:hero", "bare:"]);
  });
});

describe("injected trigger factory", () => {
  it("is called for manual, time, and scroll Motions", () => {
    const calls: string[] = [];
    const factory: TriggerFactory = {
      create({ motionId, trigger }) {
        calls.push(`${motionId}:${trigger.type}`);
        const port = createFakeTriggerPort();
        return {
          port,
          acceptsExternalSignal: true,
          clockBinding: { kind: "motion" },
          dispose: () => port.dispose(),
        };
      },
    };
    const handle = engine({ triggerFactory: factory }).load({
      schemaVersion: 5,
      motions: [
        { id: "manualMotion", trigger: { type: "manual" }, tracks: [] },
        { id: "timeMotion", trigger: { type: "time", duration: 1000 }, tracks: [] },
        { id: "scrollMotion", trigger: { type: "scroll" }, tracks: [] },
      ],
    });
    expect(calls).toEqual(["manualMotion:manual", "timeMotion:time", "scrollMotion:scroll"]);
    handle.dispose();
  });
});
