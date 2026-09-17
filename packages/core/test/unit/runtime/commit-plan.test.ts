import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type { MotionDefinition, TrackDefinition } from "../../../src/contract/v5";
import { code } from "../../helpers/source-region";
import { AUTHORED } from "../../../src/runtime/value-state";
import { invert, planCommit, type CommitDocument } from "../../../src/runtime/commit-plan";
const A: TrackDefinition = { id: "arm" },
  H: TrackDefinition = { id: "hand", duration: 250 },
  M: MotionDefinition = { id: "hero", trigger: { type: "manual" }, tracks: [] };
const ent = (track: TrackDefinition, motionId?: string) => ({
  track,
  motionId,
  valueState: AUTHORED,
});
const doc = (
  tracks: readonly [string, ReturnType<typeof ent>][],
  motions: readonly [string, { definition: MotionDefinition; token: number }][] = [],
): CommitDocument => ({ tracks: new Map(tracks), motions: new Map(motions) });
const P = fileURLToPath(new URL("../../../src/runtime/commit-plan.ts", import.meta.url)),
  R = fileURLToPath(new URL("../../../src/runtime/run-plan.ts", import.meta.url));
describe("commit plan", () => {
  it("add data", () => {
    const b = doc([["hero/arm", ent(A, "hero")]], [["hero", { definition: M }]]),
      a = doc(
        [
          ["hero/arm", ent(A, "hero")],
          ["hero/hand", ent(H, "hero")],
        ],
        [["hero", { definition: M }]],
      ),
      p = planCommit(b, a, { needsBuild: new Set(), readers: new Map() });
    expect(p.effects).toEqual([{ kind: "compile-track", nodeId: "hero/hand", track: H }]);
    expect(p.settle).toEqual([
      { kind: "add-motion-track", motionId: "hero", nodeId: "hero/hand", duration: 250 },
      { kind: "mount-node", nodeId: "hero/hand" },
      { kind: "publish", seeds: ["hero/hand"] },
    ]);
  });
  it("exposes removal seeds and inverses", () => {
    const b = doc(
        [
          ["hero/arm", ent(A, "hero")],
          ["~/old", ent({ id: "old" })],
        ],
        [["hero", { definition: M }]],
      ),
      a = doc([], [["hero", { definition: M }]]),
      p = planCommit(b, a, {
        needsBuild: new Set(),
        readers: new Map([
          ["hero/arm", ["hero/r"]],
          ["~/old", ["hero/r"]],
        ]),
      });
    expect(p.settle).toEqual([
      { kind: "evict-node", nodeId: "hero/arm" },
      { kind: "dispose-track", nodeId: "hero/arm" },
      { kind: "remove-motion-track", motionId: "hero", nodeId: "hero/arm" },
      { kind: "evict-node", nodeId: "~/old" },
      { kind: "dispose-track", nodeId: "~/old" },
      { kind: "publish", seeds: ["hero/r", "hero/r"] },
    ]);
    const q = planCommit(
      doc([["hero/arm", ent(A, "hero")]], [["hero", { definition: M }]]),
      doc([["hero/arm", ent({ id: "arm", duration: 500 }, "hero")]], [["hero", { definition: M }]]),
      { needsBuild: new Set(["hero/arm"]), readers: new Map() },
    );
    expect(invert(q.effects[0]!)).toEqual({ kind: "rollback-stage", nodeId: "hero/arm" });
    expect(invert(q.effects[1]!)).toEqual({
      kind: "retarget-motion-track",
      motionId: "hero",
      nodeId: "hero/arm",
      duration: undefined,
      previousDuration: 500,
    });
  });
  it("checks brands and exhaustiveness", () => {
    const p = code(P),
      r = code(R);
    for (const k of [
      "create-motion",
      "destroy-motion",
      "compile-track",
      "dispose-track",
      "stage-track",
      "rollback-stage",
      "retarget-motion-track",
    ])
      expect(p).toContain(`case"${k}"`);
    for (const k of [
      "commit-staged",
      "dispose-track",
      "evict-node",
      "mount-node",
      "add-motion-track",
      "remove-motion-track",
      "destroy-motion",
      "publish",
    ])
      expect(r).toContain(`case"${k}"`);
    expect(p.match(/unreachable\(/g)).toHaveLength(1);
    expect(r.match(/unreachable\(/g)).toHaveLength(2);
  });
});
