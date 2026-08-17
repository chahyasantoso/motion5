import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { validateMotionTrigger } from "../../src/contract/validate-v5";
import { createDefaultTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler, createFakeTriggerPort } from "../../src/ports/fakes";
import { assertTriggerFactory, type TriggerFactory } from "../../src/ports/trigger-factory";

// ...existing contract tests...

describe("injected trigger factory", () => {
  it("is called for manual, time, and scroll Motions", () => {
    const calls: string[] = [];
    const factory: TriggerFactory = {
      create({ motionId, definition }) {
        calls.push(`${motionId}:${definition.trigger.type}`);
        const port = createFakeTriggerPort();
        return { port, acceptsExternalSignal: true, dispose: port.dispose };
      },
    };
    const engine = new Engine({ clock: createManualClock(), interpolator: createFakeInterpolator(), scheduler: createFakeScheduler(), triggerFactory: factory });
    const handle = engine.load({ schemaVersion: 5, motions: [
      { id: "manualMotion", trigger: { type: "manual" }, tracks: [] },
      { id: "timeMotion", trigger: { type: "time", duration: 1000 }, tracks: [] },
      { id: "scrollMotion", trigger: { type: "scroll" }, tracks: [] },
    ] });
    expect(calls).toEqual(["manualMotion:manual", "timeMotion:time", "scrollMotion:scroll"]);
    handle.dispose();
  });
});
