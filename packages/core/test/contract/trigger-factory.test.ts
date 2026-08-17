import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { validateMotionTrigger } from "../../src/contract/validate-v5";
import { createDefaultTriggerFactory, createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler, createFakeTriggerPort } from "../../src/ports/fakes";
import { assertTriggerFactory, type TriggerFactory } from "../../src/ports/trigger-factory";

function engine(options: { triggerFactory?: TriggerFactory } = {}) { return new Engine({ clock: createManualClock(), interpolator: createFakeInterpolator(), scheduler: createFakeScheduler(), ...options }); }

describe("trigger contract T1/T2/T3", () => {
  it("rejects a time trigger without a positive duration", () => { expect(() => engine().load({ schemaVersion: 5, motions: [{ id: "scene", trigger: { type: "time" }, tracks: [] }] })).toThrow(/trigger-time-duration/); });
  it("rejects unsupported time playback fields", () => {
    expect(validateMotionTrigger({ type: "time", duration: 1000, autoplay: false }, "trigger").map((d) => d.ruleId)).toEqual(["trigger-time-autoplay-unsupported"]);
    expect(validateMotionTrigger({ type: "time", duration: 1000, repeat: 0 }, "trigger").map((d) => d.ruleId)).toEqual(["trigger-time-repeat-unsupported"]);
    expect(validateMotionTrigger({ type: "time", duration: 1000, yoyo: true }, "trigger").map((d) => d.ruleId)).toEqual(["trigger-time-repeat-unsupported"]);
  });
  it("validates trigger rows", () => {
    for (const [trigger, ruleId] of [[{}, "trigger-shape"], [{ type: "unknown" }, "trigger-shape"], [{ type: "time", duration: 0 }, "trigger-time-duration"], [{ type: "scroll", source: "" }, "trigger-scroll-source"], [{ type: "scroll", source: 42 }, "trigger-scroll-source"]] as const) expect(validateMotionTrigger(trigger, "trigger").map((d) => d.ruleId)).toContain(ruleId);
    for (const trigger of [{ type: "time", duration: 1000 }, { type: "time", duration: 1000, autoplay: true }, { type: "manual" }, { type: "scroll" }, { type: "scroll", source: "hero" }]) expect(validateMotionTrigger(trigger, "trigger")).toEqual([]);
  });
  it("rejects malformed TriggerFactory values", () => { expect(() => assertTriggerFactory(null)).toThrow(/TriggerFactory/); expect(() => assertTriggerFactory({})).toThrow(/TriggerFactory/); expect(() => assertTriggerFactory({ create: 1 })).toThrow(/TriggerFactory/); });
  it("selects manual, time, and injected scroll drivers", () => {
    const scroll = { subscribe: () => () => undefined };
    const factory = createTriggerFactory({ scroll: () => scroll });
    const cases = [
      [factory, { type: "manual" }, true, false],
      [factory, { type: "time", duration: 1000 }, false, true],
      [factory, { type: "scroll", source: "hero" }, false, false],
    ] as const;
    for (const [selected, trigger, acceptsExternalSignal, fed] of cases) {
      const created = selected.create({ motionId: "scene", definition: { id: "scene", trigger, tracks: [] }, clock: createManualClock(), scheduler: createFakeScheduler() });
      expect(created.acceptsExternalSignal).toBe(acceptsExternalSignal);
      expect((created.onTick !== undefined)).toBe(fed);
      created.dispose();
    }
    expect(() => createDefaultTriggerFactory().create({ motionId: "scene", definition: { id: "scene", trigger: { type: "scroll", source: "hero" }, tracks: [] }, clock: createManualClock(), scheduler: createFakeScheduler() })).toThrow(/trigger-driver-unavailable/);
  });
});

describe("injected trigger factory", () => {
  it("is called for manual, time, and scroll Motions", () => {
    const calls: string[] = [];
    const factory: TriggerFactory = { create({ motionId, definition }) { calls.push(`${motionId}:${definition.trigger.type}`); const port = createFakeTriggerPort(); return { port, acceptsExternalSignal: true, dispose: port.dispose }; } };
    const handle = engine({ triggerFactory: factory }).load({ schemaVersion: 5, motions: [{ id: "manualMotion", trigger: { type: "manual" }, tracks: [] }, { id: "timeMotion", trigger: { type: "time", duration: 1000 }, tracks: [] }, { id: "scrollMotion", trigger: { type: "scroll" }, tracks: [] }] });
    expect(calls).toEqual(["manualMotion:manual", "timeMotion:time", "scrollMotion:scroll"]);
    handle.dispose();
  });
});
