import { describe, expect, it } from "vitest";
import { diagnostic } from "../../../src/contract/diagnostics";
import { PatchRegistry, type Patch, type PublishInput } from "../../../src/runtime/patch-registry";

/**
 * Slice 1 of #450 decides where the last good pose lives once a patch carries only the payload its
 * status owns, and the answer is the registry rather than a field on a patch that is about something
 * else. ADR-098 left that question open; these cases are what closes it.
 *
 * The round that landed these cases declared the member on an intersection and read it off a cast, so
 * `tsc` stayed clean and every case below ran. What they then were is worth stating exactly, because
 * an independent pass caught this sentence overclaiming: each threw `TypeError: registry.lastReady is
 * not a function` at the call rather than reaching a failed expectation. That is a red test file and
 * not a red compile, which is the distinction `docs/GUARDRAILS.md` draws, and it is also not the
 * failed-assertion shape that document names, so it is recorded as what it was rather than
 * relabelled. The member exists now, so the cast is deleted and every case reads it off the class.
 */
function open(): PatchRegistry {
  return new PatchRegistry();
}

function publish(registry: PatchRegistry, tick: number, input: PublishInput): Patch | undefined {
  registry.beginBatch(tick, [input.nodeId]);
  const patch = registry.publish(input);
  registry.closeBatch();
  return patch;
}

const BLOCKED = [
  diagnostic("blocked-upstream", "hero/arm", "Upstream is blocked.", ["hero/shoulder"]),
];

// Named for what an errored publication really reports: `runtime/graph-publisher.ts` hands the
// registry one `composition-failure` per failed publication, pathed by the node and naming it.
const FAILED = [diagnostic("composition-failure", "hero/arm", "Composition failed.", ["hero/arm"])];

describe("the registry owns the last ready patch", () => {
  it("answers the last ready patch while the node is blocked", () => {
    const registry = open();
    const ready = publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0.5,
      status: "ready",
    });
    const blocked = publish(registry, 2, {
      nodeId: "hero/arm",
      status: "blocked",
      diagnostics: BLOCKED,
    });

    expect(blocked?.status).toBe("blocked");
    expect(registry.get("hero/arm")).toBe(blocked);
    // The pose survives the block as the registry's own retained answer rather than as a payload on
    // a patch whose status says the node is not ready.
    expect(registry.lastReady("hero/arm")).toBe(ready);
    expect(registry.lastReady("hero/arm")?.values).toEqual({ x: 1 });
    expect(registry.lastReady("hero/arm")?.sourceProgress).toBe(0.5);
  });

  it("answers nothing for a node that has never been ready", () => {
    const registry = open();
    const blocked = publish(registry, 1, {
      nodeId: "hero/arm",
      status: "blocked",
      diagnostics: BLOCKED,
    });

    expect(blocked?.status).toBe("blocked");
    expect(registry.lastReady("hero/arm")).toBeUndefined();
  });

  it("replaces what it retains only when a later ready publication is accepted", () => {
    const registry = open();
    publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    const second = publish(registry, 2, {
      nodeId: "hero/arm",
      values: { x: 2 },
      sourceProgress: 0,
      status: "ready",
    });
    // A suppressed republication is not a publication, so it cannot move what is retained.
    const suppressed = publish(registry, 3, {
      nodeId: "hero/arm",
      values: { x: 2 },
      sourceProgress: 0,
      status: "ready",
    });

    expect(suppressed).toBeUndefined();
    expect(registry.lastReady("hero/arm")).toBe(second);
  });

  it("drops what it retains on unmount, so a remount reads nothing stale", () => {
    const registry = open();
    publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });

    registry.remove("hero/arm");

    expect(registry.get("hero/arm")).toBeUndefined();
    expect(registry.lastReady("hero/arm")).toBeUndefined();
  });

  it("drops what it retains on eviction, because a destroyed node has no last pose", () => {
    const registry = open();
    publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });

    registry.evict("hero/arm");

    expect(registry.lastReady("hero/arm")).toBeUndefined();
  });

  it("answers nothing once the registry is disposed", () => {
    const registry = open();
    publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });

    registry.dispose();

    expect(registry.lastReady("hero/arm")).toBeUndefined();
  });

  it("keeps what it retains when the node errors, because an error owns no pose either", () => {
    const registry = open();
    const ready = publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    const errored = publish(registry, 2, {
      nodeId: "hero/arm",
      status: "error",
      diagnostics: FAILED,
    });

    expect(errored?.status).toBe("error");
    // Two conditions, one answer, and the arm is written rather than inherited: `blocked` above and
    // `error` here both leave the retained pose alone, and neither reaches it through the other.
    expect(registry.lastReady("hero/arm")).toBe(ready);
  });

  // Re-read rather than adjusted, which is what this case was landed for. While the carry-forward
  // existed it asserted that a blocked publication still republished the last pose, and it was
  // labelled green on both sides for exactly this moment. ADR-098 has deleted that carry-forward,
  // so the same rig asserts where the pose went instead of asserting that it stayed.
  it("moves the pose off the blocked publication and onto the retained ready patch", () => {
    const registry = open();
    const ready = publish(registry, 1, {
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0.5,
      status: "ready",
    });
    const blocked = publish(registry, 2, {
      nodeId: "hero/arm",
      status: "blocked",
      diagnostics: BLOCKED,
    });

    if (blocked?.status !== "blocked")
      throw new Error(`hero/arm is ${blocked?.status ?? "absent"}, not blocked.`);
    expect("values" in blocked).toBe(false);
    expect("sourceProgress" in blocked).toBe(false);
    expect(blocked.diagnostics).toHaveLength(1);
    // The pose is not lost, and this says so rather than leaving it to the refusals above: all
    // three members one composition measured together are answered together, off one identity.
    expect(registry.lastReady("hero/arm")).toBe(ready);
    expect(registry.lastReady("hero/arm")?.values).toEqual({ x: 1 });
    expect(registry.lastReady("hero/arm")?.sourceProgress).toBe(0.5);
  });
});
