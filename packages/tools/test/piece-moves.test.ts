import { describe, expect, it } from "vitest";
import { atProgress } from "@gerak/moves";
import { checkMove } from "../src/scene/moves";
import { jolt } from "../../../apps/pieces/showreel/src/moves/jolt";
import { push } from "../../../apps/pieces/showreel/src/moves/push";

describe("the ranges a piece move declares", () => {
  it("jolt declares the cycles it can run and the gate probes both ends", () => {
    expect(jolt.options["count"]).toMatchObject({ min: 1, max: 6 });
    expect(checkMove(jolt)).toEqual([]);
    expect(() => jolt({ distance: 10, count: 0 }, atProgress(0.5))).toThrow(/count/);
    expect(() => jolt({ distance: 10, count: 7 }, atProgress(0.5))).toThrow(/count/);
  });

  it("push declares the sizes it can end at and the gate probes both ends", () => {
    expect(push.options["to"]).toMatchObject({ min: 0.1, max: 4 });
    expect(checkMove(push)).toEqual([]);
    expect(() => push({ to: 0, curve: "out" }, atProgress(0.5))).toThrow(/to/);
    expect(() => push({ to: 5, curve: "out" }, atProgress(0.5))).toThrow(/to/);
  });
});
