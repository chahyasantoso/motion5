import { describe, expect, it } from "vitest";
import { definePart, type PartContract } from "@gerak/moves";
import { checkParts, type MovePart } from "@gerak/tools/scene";

function findings(
  group: MovePart["group"],
  contract: PartContract | undefined,
  fn: (...args: never[]) => unknown,
): readonly string[] {
  const value = contract === undefined ? fn : definePart(contract, fn);
  const parts: readonly MovePart[] = [
    { name: "scratch", group, call: "scratch()", use: "A scratch part." },
  ];
  return checkParts(parts, { scratch: value });
}

describe("checkParts over the real package", () => {
  it("finds nothing: every exported part has a contract of its folder's kind that its samples keep", () => {
    expect(checkParts()).toEqual([]);
  });
});

describe("checkParts refuses a part that breaks its kind's rule", () => {
  it("an envelope that dips below 0", () => {
    const dip = (progress: number): number => 0.5 - progress;
    const out = findings(
      "envelope",
      { kind: "envelope", samples: [{ run: dip, at0: 0.5, at1: -0.5 }] },
      dip,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("an envelope whose ends are not the ones it states", () => {
    const flat = (): number => 1;
    const out = findings(
      "envelope",
      { kind: "envelope", samples: [{ run: flat, at0: 0, at1: 1 }] },
      flat,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("an ease that ends at 0.9", () => {
    const short = (progress: number): number => progress * 0.9;
    const out = findings("ease", { kind: "ease", samples: [{ run: short }] }, short);
    expect(out.join("\n")).toMatch(/scratch.*sample 0.*0\.9/);
  });

  it("an oscillation past its bound", () => {
    const loud = (progress: number): number => 2 * Math.sin(progress * 6);
    const out = findings(
      "oscillation",
      { kind: "oscillation", samples: [{ run: loud, bound: 1 }] },
      loud,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a path off its end", () => {
    const off = (progress: number): Record<string, number> => ({ x: progress * 9 });
    const out = findings(
      "path",
      { kind: "path", samples: [{ run: off, from: { x: 0 }, to: { x: 10 } }] },
      off,
    );
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a blend that is not b at share 1", () => {
    const stuck = (_share: number): number => 0;
    const out = findings("blend", { kind: "blend", samples: [{ run: stuck, a: 0, b: 5 }] }, stuck);
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a blend of angles is held modulo 360 only when the sample says so", () => {
    const turn = (share: number): number => 10 + 700 * share;
    const plain = findings(
      "blend",
      { kind: "blend", samples: [{ run: turn, a: 10, b: 350 }] },
      turn,
    );
    const angle = findings(
      "blend",
      { kind: "blend", samples: [{ run: turn, a: 10, b: 350, angle: true }] },
      turn,
    );
    expect(plain).not.toEqual([]);
    expect(angle).toEqual([]);
  });

  it("a coupling that is not at rest at an amount of 0", () => {
    const tilted = (): unknown => ({ pose: { scaleX: 1.2 } });
    const out = findings("coupling", { kind: "coupling", samples: [{ run: tilted }] }, tilted);
    expect(out.join("\n")).toMatch(/scratch.*sample 0.*scaleX/);
  });

  it("a dynamics answer that drifts from rest", () => {
    const drift = (seconds: number): { offset: number; speed: number } => ({
      offset: 0.1 * seconds,
      speed: 0,
    });
    const out = findings("dynamics", { kind: "dynamics", samples: [{ run: drift }] }, drift);
    expect(out.join("\n")).toMatch(/scratch.*sample 0/);
  });

  it("a part that keeps its rule is not refused", () => {
    const ramp = (progress: number): number => progress;
    expect(findings("ease", { kind: "ease", samples: [{ run: ramp }] }, ramp)).toEqual([]);
  });
});

describe("checkParts refuses a part without a proper contract", () => {
  it("a part with no contract, naming it", () => {
    const out = findings("time", undefined, () => 0);
    expect(out.join("\n")).toMatch(/scratch.*no contract/);
  });

  it("a part declared with a kind that is not its folder", () => {
    const out = findings("time", { kind: "utility" }, () => 0);
    expect(out.join("\n")).toMatch(/scratch.*utility.*time/);
  });
});
