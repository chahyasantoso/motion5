import { describe, expect, it } from "vitest";
import { createTriggerFactory } from "../../../src/adapters/trigger-factory/default";
import type { MotionDefinition } from "../../../src/contract/v5";
import { resolveTriggerDefinition } from "../../../src/contract/validate-v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";

// Loop arithmetic is exercised through the trigger factory rather than by importing the loop module
// directly, and deliberately. Every case here has to be runnable against the parent commit so its
// red is assertion-level: on the parent, `resolveTriggerDefinition` rejects `repeat` and `yoyo`
// outright, which is a failing assertion about behavior. A case that imported a module the parent
// does not have would produce import-resolution red, which the failing-first job counts as no
// evidence at all. See docs/IMPLEMENTATION-PLAN-time-loop-semantics.md section 6.
type Authored = { type: "time"; duration: number; repeat?: number; yoyo?: boolean };
type Loop = Omit<Authored, "type" | "duration">;

// The factory never reads `definition.trigger`; the narrowed `trigger` below is the only supported
// way to read trigger fields, so this stays a minimal well-formed placeholder.
const DEFINITION: MotionDefinition = { id: "loop", trigger: { type: "manual" }, tracks: [] };

function time(duration: number, loop: Loop = {}): Authored {
  return { type: "time", duration, ...loop };
}

function repeated(count: number, delta: number): readonly number[] {
  return Array.from({ length: count }, () => delta);
}

/** Every progress value a time driver emitted for `deltas`, in order, one entry per tick. */
function emissions(authored: Authored, deltas: readonly number[]): readonly number[] {
  const created = createTriggerFactory().create({
    motionId: "loop",
    definition: DEFINITION,
    trigger: resolveTriggerDefinition(authored, "motions.loop.trigger"),
    clock: createManualClock(),
    scheduler: createFakeScheduler(),
  });
  const seen: number[] = [];
  created.port.subscribe((progress) => seen.push(progress));
  const binding = created.clockBinding;
  // Not a vacuous drive: a time trigger that stopped binding as a driver would report an empty
  // emission list, which reads exactly like a loop that latched.
  if (binding.kind !== "driver") throw new Error("A time trigger must bind as a clock driver.");
  let elapsed = 0;
  for (const [index, delta] of deltas.entries()) {
    elapsed += delta;
    binding.onTick({ tick: index + 1, time: elapsed, delta });
  }
  created.dispose();
  return seen;
}

describe("time loop cycle arithmetic", () => {
  it("L-1 keeps a trigger with no loop fields on one pass that latches at 1", () => {
    // Green on the parent by design. This is the byte-for-byte compatibility guard, not red
    // evidence: an existing single-pass time trigger must not notice that loops exist.
    expect(emissions(time(1000), [250, 750, 250])).toEqual([0.25, 1]);
  });

  it("L-2 treats repeat 0 as the default spelled out, value for value", () => {
    const deltas = [250, 750, 250];
    expect(emissions(time(1000, { repeat: 0 }), deltas)).toEqual(emissions(time(1000), deltas));
  });

  it("L-3 runs the initial pass plus repeat more, each ending at 1", () => {
    // Nine ticks, eight emissions: repeat 1 is two cycles of four ticks and the ninth arrives
    // after the latch. The initial pass is never one of the repeats.
    const seen = emissions(time(100, { repeat: 1 }), repeated(9, 25));
    expect(seen).toEqual([0.25, 0.5, 0.75, 1, 0.25, 0.5, 0.75, 1]);
  });

  it("L-4 reverses the odd cycle of a yoyo and finishes where it started", () => {
    const seen = emissions(time(100, { repeat: 1, yoyo: true }), repeated(5, 50));
    expect(seen).toEqual([0.5, 1, 0.5, 0]);
  });

  it("L-5 finishes a yoyo at the end when its last cycle runs forward", () => {
    const seen = emissions(time(100, { repeat: 2, yoyo: true }), repeated(4, 100));
    expect(seen).toEqual([1, 0, 1]);
  });

  it("L-6 reads a boundary tick as the end of the cycle it finished", () => {
    // The other convention, a floor index with a position in [0, 1), emits 0 here and never lets
    // a repeating animation reach its own end state on any pass but the last.
    expect(emissions(time(100, { repeat: -1 }), [100, 1])).toEqual([1, 0.01]);
  });

  it("L-7 never latches an infinite repeat and never repeats one endpoint", () => {
    const seen = emissions(time(100, { repeat: -1 }), repeated(9, 50));
    expect(seen).toEqual([0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5]);
  });

  it("L-8 emits once for a tick that crosses several cycles", () => {
    // Direction survives the overshoot because it is derived from the cycle index. A boolean that
    // flipped once per wrap would be a cycle behind from the first crossed cycle onward.
    const deltas = repeated(4, 250);
    const seen = emissions(time(100, { repeat: -1, yoyo: true }), deltas);
    expect(seen).toEqual([0.5, 1, 0.5, 0]);
    expect(seen).toHaveLength(deltas.length);
  });

  it("L-9 clamps a delta past the end to the finishing endpoint", () => {
    expect(emissions(time(100, { repeat: 1, yoyo: true }), [1000, 100])).toEqual([0]);
  });

  it("L-10 keeps an infinite loop advancing after an enormous delta", () => {
    // 1e18 clock units is past the float resolution of 50, so accumulating raw loop time would
    // make every later delta a no-op and freeze the loop on one value forever.
    expect(emissions(time(100, { repeat: -1 }), [1e18, 50, 50])).toEqual([0, 0.5, 1]);
  });
});
