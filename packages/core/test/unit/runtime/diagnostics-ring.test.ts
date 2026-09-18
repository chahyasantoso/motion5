import { describe, expect, it, vi } from "vitest";
import { fileURLToPath } from "node:url";
import type { Diagnostic } from "../../../src/contract/v5";
import { Diagnostics } from "../../../src/runtime/diagnostics";
import { code } from "../../helpers/source-region";

/**
 * Issue #443, phase B step 13: the one bounded diagnostic surface retains in a ring.
 *
 * `record` evicted with `Array.prototype.shift()`, which reindexes every entry still retained, so the
 * cheapest surface in the runtime folder cost O(n) per diagnostic once the buffer was full. A project
 * that keeps 500 entries and records one per frame paid 500 element moves per frame for a buffer
 * nothing subscribes to.
 *
 * What a caller observes is unchanged, so four of the five cases below are equivalence cases and are
 * green on both sides: order across two wraps, the capacity-one edge, and a snapshot no later record
 * can move. The case that fails without the change is the one counting the eviction call, because an
 * optimisation whose whole claim is that a step is gone is proved by counting that step rather than by
 * asserting the answer it did not change. `docs/GUARDRAILS.md` owns that rule.
 */
const DIAGNOSTICS_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/diagnostics.ts", import.meta.url),
);

/** One diagnostic per index, so a retained window reads as a list of paths. */
function entry(index: number): Diagnostic {
  const diagnostic: Diagnostic = Object.freeze({
    ruleId: "diagnostics-ring",
    path: String(index),
    message: `entry ${String(index)}`,
    severity: "error",
    ids: Object.freeze([String(index)]),
  });
  return diagnostic;
}

function retainedPaths(buffer: Diagnostics): readonly string[] {
  return buffer.snapshot().entries.map((diagnostic) => diagnostic.path);
}

describe("the diagnostics buffer retains in a ring", () => {
  it("answers the retained window oldest first across two wraps", () => {
    const buffer = new Diagnostics(3);
    for (let index = 1; index <= 5; index += 1) buffer.record(entry(index));

    expect(retainedPaths(buffer)).toEqual(["3", "4", "5"]);
    expect(buffer.snapshot().droppedCount).toBe(2);

    // The second wrap is where a window starting at a stale index answers in the wrong order, which
    // one wrap alone cannot tell apart from a correct one.
    for (let index = 6; index <= 10; index += 1) buffer.record(entry(index));

    expect(retainedPaths(buffer)).toEqual(["8", "9", "10"]);
    expect(buffer.snapshot().droppedCount).toBe(7);
  });

  it("retains the newest entry at capacity one, and counts every entry it let go", () => {
    const buffer = new Diagnostics(1);
    buffer.recordAll([entry(1), entry(2), entry(3)]);

    expect(retainedPaths(buffer)).toEqual(["3"]);
    expect(buffer.snapshot().droppedCount).toBe(2);
  });

  it("reindexes nothing it retains", () => {
    const buffer = new Diagnostics(4);
    const shift = vi.spyOn(Array.prototype, "shift");
    let evictions = -1;
    try {
      for (let index = 1; index <= 40; index += 1) buffer.record(entry(index));
      // Read inside the guarded region and asserted outside it. `mockRestore` resets the spy's
      // own call record as well as the prototype, so an assertion placed after it reads zero calls
      // whatever the source did, which is the green case that is evidence of nothing
      // `docs/GUARDRAILS.md` refuses, in the one case whose whole claim is that a step is gone.
      // A number rather than the spy carries the reading out, so no assertion and no failure
      // formatting runs while `Array.prototype` is still patched.
      evictions = shift.mock.calls.length;
    } finally {
      shift.mockRestore();
    }

    expect(evictions).toBe(0);
    // Asserted in the same case, so a buffer that stopped evicting at all cannot pass it.
    expect(retainedPaths(buffer)).toEqual(["37", "38", "39", "40"]);
  });

  it("hands out a snapshot no later record can move", () => {
    const buffer = new Diagnostics(2);
    buffer.record(entry(1));
    const before = buffer.snapshot();
    buffer.record(entry(2));
    buffer.record(entry(3));

    expect(before.entries.map((diagnostic) => diagnostic.path)).toEqual(["1"]);
    expect(before.droppedCount).toBe(0);
    expect(Object.isFrozen(before)).toBe(true);
    expect(Object.isFrozen(before.entries)).toBe(true);
    expect(retainedPaths(buffer)).toEqual(["2", "3"]);
  });

  it("names the retired eviction nowhere in the source", () => {
    // The cheap backstop beside the counter above: the counter is what catches a reintroduction
    // through another spelling, and this is what one through the same spelling costs.
    expect(code(DIAGNOSTICS_SOURCE).split(".shift()")).toHaveLength(1);
  });
});
