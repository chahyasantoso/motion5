import { describe, expect, it } from "vitest";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import type { Diagnostic, MotionDefinition } from "../../src/contract/v5";
import {
  resolveTriggerDefinition,
  validateMotionTrigger,
  validateV5,
} from "../../src/contract/validate-v5";
import { Motion } from "../../src/domain/motion";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

const LOOPING: MotionDefinition["trigger"] = { type: "time", duration: 100, repeat: 1, yoyo: true };
const TWICE: MotionDefinition["trigger"] = { type: "time", duration: 100, repeat: 1 };
const FOREVER: MotionDefinition["trigger"] = { type: "time", duration: 100, repeat: -1 };
const ONCE: MotionDefinition["trigger"] = { type: "time", duration: 100 };

function ramp(id: string) {
  return {
    id,
    keyframes: {
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 100 },
      ],
    },
  };
}

function ruleIds(diagnostics: readonly Diagnostic[]): readonly string[] {
  return diagnostics.map((entry) => entry.ruleId);
}

function loopRules(trigger: unknown): readonly string[] {
  return ruleIds(validateMotionTrigger(trigger, "motions.a.trigger"));
}

interface Loaded {
  readonly clock: ReturnType<typeof createManualClock>;
  readonly scheduler: ReturnType<typeof createFakeScheduler>;
  readonly handle: ProjectHandle;
  values(nodeId: string): unknown;
  advance(delta: number): void;
}

function load(motions: readonly MotionDefinition[]): Loaded {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load({
    schemaVersion: 5,
    motions,
  });
  return {
    clock,
    scheduler,
    handle,
    values: (nodeId) => handle.get(nodeId)?.values,
    advance(delta) {
      clock.tick(delta);
      scheduler.flush();
    },
  };
}

describe("time loop semantics", () => {
  it("L-11 accepts the loop fields and names each loop rule by id", () => {
    const repeatShape = ["trigger-time-repeat-shape"];
    expect(loopRules({ type: "time", duration: 100 })).toEqual([]);
    expect(loopRules({ type: "time", duration: 100, repeat: 0 })).toEqual([]);
    expect(loopRules({ type: "time", duration: 100, repeat: -1, yoyo: true })).toEqual([]);
    expect(loopRules({ type: "time", duration: 100, repeat: 3, yoyo: false })).toEqual([]);
    expect(loopRules({ type: "time", duration: 100, repeat: 1.5 })).toEqual(repeatShape);
    expect(loopRules({ type: "time", duration: 100, repeat: -2 })).toEqual(repeatShape);
    expect(loopRules({ type: "time", duration: 100, repeat: "2" })).toEqual(repeatShape);
    const yoyoShape = ["trigger-time-yoyo-shape"];
    expect(loopRules({ type: "time", duration: 100, repeat: 2, yoyo: 1 })).toEqual(yoyoShape);
  });

  it("L-12 refuses a yoyo with no cycle to reverse, at either spelling", () => {
    // Presence rather than value: neither true nor false does anything without a repeat, and a
    // field accepted and then ignored is exactly what ADR-033 forbids.
    const required = ["trigger-time-yoyo-requires-repeat"];
    expect(loopRules({ type: "time", duration: 100, yoyo: true })).toEqual(required);
    expect(loopRules({ type: "time", duration: 100, yoyo: false })).toEqual(required);
    expect(loopRules({ type: "time", duration: 100, repeat: 0, yoyo: true })).toEqual(required);
  });

  it("L-13 no longer rejects repeat and yoyo as unsupported", () => {
    // Asserted by absence, because that diagnostic was the entire reason a looping project could
    // not load. Leaving it anywhere would make the authored schema document a lie.
    const result = validateV5({
      schemaVersion: 5,
      motions: [{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] }],
    });
    expect(result.valid).toBe(true);
    expect(ruleIds(result.diagnostics)).not.toContain("trigger-time-repeat-unsupported");
  });

  it("L-14 yoyos an authored Motion through the runtime and stops at the start", () => {
    const { handle, scheduler, values, advance } = load([
      { id: "loop", trigger: LOOPING, tracks: [ramp("arm")] },
    ]);
    handle.mount("loop/arm");
    advance(50);
    expect(values("loop/arm")).toEqual({ x: 50 });
    advance(50);
    expect(values("loop/arm")).toEqual({ x: 100 });
    advance(50);
    expect(values("loop/arm")).toEqual({ x: 50 });
    advance(50);
    expect(values("loop/arm")).toEqual({ x: 0 });
    // Latched: the fifth tick reaches a finished loop, so nothing is queued and nothing moves.
    advance(50);
    expect(scheduler.pending).toHaveLength(0);
    expect(values("loop/arm")).toEqual({ x: 0 });
    handle.dispose();
  });

  it("L-15 gives a runtime-created looping Motion the identical sequence", () => {
    const authored = load([{ id: "loop", trigger: LOOPING, tracks: [ramp("arm")] }]);
    authored.handle.mount("loop/arm");
    const runtime = load([]);
    runtime.handle.addMotion({ id: "loop", trigger: LOOPING, tracks: [] });
    runtime.handle.addTrack(ramp("arm"), { motionId: "loop" });
    authored.scheduler.flush();
    runtime.scheduler.flush();
    const seen: unknown[] = [];
    for (const delta of [50, 50, 50, 50]) {
      authored.advance(delta);
      runtime.advance(delta);
      // The whole sequence, not the end state: a loop running at twice the rate also ends at 0.
      expect(runtime.values("loop/arm")).toEqual(authored.values("loop/arm"));
      seen.push(authored.values("loop/arm"));
    }
    expect(seen).toEqual([{ x: 50 }, { x: 100 }, { x: 50 }, { x: 0 }]);
    authored.handle.dispose();
    runtime.handle.dispose();
  });

  it("L-16 applies stagger inside each cycle and carries nothing across one", () => {
    const staggered: MotionDefinition = {
      id: "loop",
      trigger: TWICE,
      stagger: 0.5,
      tracks: [ramp("lead"), ramp("trail")],
    };
    const { handle, values, advance } = load([staggered]);
    handle.mount("loop/lead");
    handle.mount("loop/trail");
    const pair = () => [values("loop/lead"), values("loop/trail")];
    advance(25);
    expect(pair()).toEqual([{ x: 25 }, { x: 0 }]);
    advance(50);
    expect(pair()).toEqual([{ x: 75 }, { x: 25 }]);
    advance(25);
    expect(pair()).toEqual([{ x: 100 }, { x: 50 }]);
    // The second cycle reproduces the first exactly. Stagger is a phase offset inside a pass, so
    // no cycle hands anything to the next one.
    advance(25);
    expect(pair()).toEqual([{ x: 25 }, { x: 0 }]);
    advance(50);
    expect(pair()).toEqual([{ x: 75 }, { x: 25 }]);
    handle.dispose();
  });

  it("L-17 keeps one project clock subscription for looping Motions", () => {
    let subscriptions = 0;
    const base = createManualClock();
    const clock = {
      subscribe(listener: Parameters<typeof base.subscribe>[0]) {
        subscriptions += 1;
        return base.subscribe(listener);
      },
    };
    const scheduler = createFakeScheduler();
    const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load({
      schemaVersion: 5,
      motions: [
        { id: "a", trigger: FOREVER, tracks: [ramp("arm")] },
        { id: "b", trigger: LOOPING, tracks: [] },
      ],
    });
    handle.mount("a/arm");
    expect(subscriptions).toBe(1);
    base.tick(50);
    scheduler.flush();
    expect(handle.get("a/arm")?.values).toEqual({ x: 50 });
    handle.dispose();
    base.dispose();
  });

  it("L-18 keeps publishing an infinite loop where a single pass latches", () => {
    const forever = load([{ id: "loop", trigger: FOREVER, tracks: [ramp("arm")] }]);
    forever.handle.mount("loop/arm");
    const once = load([{ id: "loop", trigger: ONCE, tracks: [ramp("arm")] }]);
    once.handle.mount("loop/arm");
    for (const delta of [25, 25, 25, 25, 25]) {
      forever.advance(delta);
      once.advance(delta);
    }
    expect(once.values("loop/arm")).toEqual({ x: 100 });
    expect(once.scheduler.pending).toHaveLength(0);
    expect(forever.values("loop/arm")).toEqual({ x: 25 });
    forever.handle.dispose();
    once.handle.dispose();
  });

  it("L-19 lets the next loop emission overwrite a leaf seek", () => {
    // ADR-021 is unchanged by looping: seek is leaf scrubbing and the driver still owns the node.
    const { handle, values, advance } = load([
      { id: "loop", trigger: FOREVER, tracks: [ramp("arm")] },
    ]);
    handle.mount("loop/arm");
    advance(25);
    expect(values("loop/arm")).toEqual({ x: 25 });
    handle.seek("loop/arm", 0.9);
    expect(values("loop/arm")).toEqual({ x: 90 });
    advance(25);
    expect(values("loop/arm")).toEqual({ x: 50 });
    handle.dispose();
  });

  it("L-20 releases a destroyed loop without disturbing the other one", () => {
    const { clock, handle, values, advance } = load([
      { id: "kept", trigger: FOREVER, tracks: [ramp("arm")] },
      { id: "gone", trigger: FOREVER, tracks: [ramp("arm")] },
    ]);
    handle.mount("kept/arm");
    handle.mount("gone/arm");
    advance(25);
    expect(values("gone/arm")).toEqual({ x: 25 });
    // A Motion is destroyed empty: ProjectRuntime refuses one that still owns tracks, and that
    // rule predates looping. Removing the track first keeps this case about the released driver.
    handle.track("gone/arm").remove();
    handle.destroyMotion("gone");
    // The surviving loop keeps its own phase. A released driver still in the fanout would either
    // throw into it or advance this node a second time per tick.
    advance(25);
    expect(values("kept/arm")).toEqual({ x: 50 });
    advance(50);
    expect(values("kept/arm")).toEqual({ x: 100 });
    expect(() => clock.tick(25)).not.toThrow();
    handle.dispose();
  });

  it("L-21 keeps loop time running while its Motion is paused", () => {
    // Playback has no public pause, so this is asserted at the owner that has one. The loop cycle
    // deliberately has no pause of its own: a driver that asked whether its Motion was playing
    // would be a second owner of playback. See ADR-040.
    const scheduler = createFakeScheduler();
    const created = createTriggerFactory().create({
      motionId: "loop",
      definition: { id: "loop", trigger: { type: "manual" }, tracks: [] },
      trigger: resolveTriggerDefinition(FOREVER, "motions.loop.trigger"),
      clock: createManualClock(),
      scheduler,
    });
    const motion = new Motion({
      clock: createManualClock(),
      scheduler,
      tracks: [],
      resolveTrack: () => undefined,
      trigger: created.port,
      listenToClock: false,
      acceptsExternalSignal: created.acceptsExternalSignal,
    });
    const binding = created.clockBinding;
    if (binding.kind !== "driver") throw new Error("A time trigger must bind as a clock driver.");
    let elapsed = 0;
    let tick = 0;
    const drive = (delta: number) => {
      tick += 1;
      elapsed += delta;
      binding.onTick({ tick, time: elapsed, delta });
      scheduler.flush();
    };

    motion.play();
    drive(25);
    expect(motion.position).toBe(0.25);
    motion.pause();
    drive(50);
    expect(motion.position).toBe(0.25);
    // Resuming lands on wall-clock loop time rather than where the Motion stopped. A loop that
    // had paused with it would read 0.5 here.
    motion.play();
    drive(25);
    expect(motion.position).toBe(1);
    motion.dispose();
    created.dispose();
  });
});
