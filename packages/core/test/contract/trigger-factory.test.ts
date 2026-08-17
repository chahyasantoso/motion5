import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { validateMotionTrigger } from "../../src/contract/validate-v5";
import { createDefaultTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import { assertTriggerFactory } from "../../src/ports/trigger-factory";

describe("trigger contract T1", () => {
  it("rejects a time trigger without a positive duration", () => {
    expect(() =>
      new Engine({
        clock: createManualClock(),
        interpolator: createFakeInterpolator(),
        scheduler: createFakeScheduler(),
      }).load({
        schemaVersion: 5,
        motions: [{ id: "scene", trigger: { type: "time" }, tracks: [] }],
      }),
    ).toThrow(/trigger-time-duration/);
  });

  it("rejects each unsupported time playback field with its exact rule", () => {
    expect(validateMotionTrigger({ type: "time", duration: 1000, autoplay: false }, "trigger").map((d) => d.ruleId)).toEqual(["trigger-time-autoplay-unsupported"]);
    expect(validateMotionTrigger({ type: "time", duration: 1000, repeat: 0 }, "trigger").map((d) => d.ruleId)).toEqual(["trigger-time-repeat-unsupported"]);
    expect(validateMotionTrigger({ type: "time", duration: 1000, yoyo: true }, "trigger").map((d) => d.ruleId)).toEqual(["trigger-time-repeat-unsupported"]);
  });

  it("validates every trigger row from the contract", () => {
    const invalid = [
      [{}, "trigger-shape"],
      [{ type: "unknown" }, "trigger-shape"],
      [{ type: "time", duration: 0 }, "trigger-time-duration"],
      [{ type: "scroll", source: "" }, "trigger-scroll-source"],
      [{ type: "scroll", source: 42 }, "trigger-scroll-source"],
    ] as const;
    for (const [trigger, ruleId] of invalid)
      expect(validateMotionTrigger(trigger, "trigger").map((d) => d.ruleId)).toContain(ruleId);
    for (const trigger of [
      { type: "time", duration: 1000 },
      { type: "time", duration: 1000, autoplay: true },
      { type: "manual" },
      { type: "scroll" },
      { type: "scroll", source: "hero" },
    ]) expect(validateMotionTrigger(trigger, "trigger")).toEqual([]);
  });

  it("rejects malformed TriggerFactory values", () => {
    expect(() => assertTriggerFactory(null)).toThrow(/TriggerFactory/);
    expect(() => assertTriggerFactory({})).toThrow(/TriggerFactory/);
    expect(() => assertTriggerFactory({ create: 1 })).toThrow(/TriggerFactory/);
  });

  it("provides the compatibility factory without changing T1 behavior", () => {
    const factory = createDefaultTriggerFactory();
    for (const type of ["manual", "time", "scroll"] as const) {
      const created = factory.create({
        motionId: "scene",
        definition: { id: "scene", trigger: type === "time" ? { type, duration: 1000 } : { type }, tracks: [] },
        clock: createManualClock(),
        scheduler: createFakeScheduler(),
      });
      expect(created.acceptsExternalSignal).toBe(true);
      expect(created.onTick).toBeUndefined();
      created.dispose();
    }
  });
});
