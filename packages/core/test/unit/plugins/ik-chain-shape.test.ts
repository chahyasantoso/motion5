import { describe, expect, it } from "vitest";
import type { WorldFrame } from "../../../src/plugins/frame";
import { chainShape } from "../../../src/plugins/ik-solve";
import { readSolveMembers, type DeliveredMember } from "../../../src/plugins/ik-chain";

// Issue #349 phase 1: the dispatch union and the adapter that feeds it, owned by ADR-106.
//
// `chainShape` is the one place that decides which strategy answers a chain, so each variant is
// pinned by the exact objects it carries rather than by a solve that happens to land on the same
// numbers: a dispatcher that copied a member or re-read a goal would still solve correctly and would
// fail here. `FB-9` owns the byte identity of the two-bone route through `solveChain`.

const ROOT = "rig/root";
const GOAL: WorldFrame = { x: 120, y: 80, rotation: 0 };

function member(id: string, base: string, length: unknown, extra: Record<string, unknown> = {}) {
  return { id, base, values: { length, ...extra }, progress: 0 };
}

describe("chain shape and solve-member adaptation", () => {
  it("CS-1 two members and one goal select the closed-form shape", () => {
    const first = { id: "a", base: ROOT, length: 80 };
    const second = { id: "b", base: "a", length: 60, goal: GOAL };
    const shape = chainShape([first, second]);

    expect(shape.kind).toBe("two-bone");
    if (shape.kind !== "two-bone") throw new Error("expected two-bone shape");
    expect(shape.first).toBe(first);
    expect(shape.second).toBe(second);
    expect(shape.goal).toBe(GOAL);
  });

  it("CS-2 two members and two goals select the tree shape", () => {
    const first = { id: "a", base: ROOT, length: 80, goal: GOAL };
    const second = { id: "b", base: "a", length: 60, goal: { ...GOAL, x: 140 } };
    const members = [first, second];
    const shape = chainShape(members);

    expect(shape.kind).toBe("tree");
    if (shape.kind !== "tree") throw new Error("expected tree shape");
    expect(shape.members).toBe(members);
  });

  it("CS-3 three members and one goal select the tree shape", () => {
    const members = [
      { id: "a", base: ROOT, length: 80 },
      { id: "b", base: "a", length: 60 },
      { id: "c", base: "b", length: 40, goal: GOAL },
    ];
    const shape = chainShape(members);

    expect(shape.kind).toBe("tree");
    if (shape.kind !== "tree") throw new Error("expected tree shape");
    expect(shape.members).toBe(members);
  });

  it("CS-4 one member and one goal select the tree shape", () => {
    const members = [{ id: "only", base: ROOT, length: 50, goal: GOAL }];
    const shape = chainShape(members);

    expect(shape.kind).toBe("tree");
    if (shape.kind !== "tree") throw new Error("expected tree shape");
    expect(shape.members).toBe(members);
  });

  it("CS-5 a chain with no goal throws the existing diagnostic", () => {
    expect(() => chainShape([{ id: "a", base: ROOT, length: 80 }])).toThrow(
      "ikPlugin requires at least one goal; 1 members received none.",
    );
  });

  it("CS-6 readSolveMembers joins goals and reads length and pivot values", () => {
    const states: readonly DeliveredMember[] = [
      member("a", ROOT, Number.NaN, { x: 1.5, y: -2.5 }),
      member("b", "a", 60),
    ];
    const addressed = { x: 200, y: 100, rotation: 0 };
    const [first, second] = readSolveMembers(states, new Map([["b", addressed]]));

    expect(first).toEqual({ id: "a", base: ROOT, length: 0, pivot: { x: 1.5, y: -2.5 } });
    expect(second).toEqual({
      id: "b",
      base: "a",
      length: 60,
      pivot: { x: 0, y: 0 },
      goal: addressed,
    });
    expect(first).not.toHaveProperty("goal");
    expect("goal" in first!).toBe(false);
  });
});
