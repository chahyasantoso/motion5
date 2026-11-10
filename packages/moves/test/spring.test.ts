import { describe, expect, it } from "vitest";
import { backEase, ease, spring, springEase } from "@gerak/moves";

const samples = Array.from({ length: 51 }, (_, i) => i / 50);

describe("spring", () => {
  it("rings under-damped, creeps critical and over-damped, and comes to rest", () => {
    const under = Array.from({ length: 200 }, (_, i) =>
      spring(-1, 0, i / 100, { stiffness: 170, damping: 8 }),
    );
    expect(Math.max(...under.map((s) => s.offset))).toBeGreaterThan(0.1);
    for (const damping of [2 * Math.sqrt(170), 60]) {
      const offsets = samples.map((u) => spring(-1, 0, u * 2, { stiffness: 170, damping }).offset);
      expect(Math.max(...offsets)).toBeLessThanOrEqual(0);
      expect(offsets.at(-1)).toBeCloseTo(0, 2);
    }
  });

  it("starts where it is told, at the speed it is told", () => {
    const start = spring(3, -5, 0, { stiffness: 100, damping: 10 });
    expect(start.offset).toBeCloseTo(3, 12);
    expect(start.speed).toBeCloseTo(-5, 12);
  });

  it("refuses a spring with no stiffness or a negative damping", () => {
    expect(() => spring(1, 0, 1, { stiffness: 0, damping: 1 })).toThrow(RangeError);
    expect(() => spring(1, 0, 1, { stiffness: 1, damping: -1 })).toThrow(RangeError);
  });
});

describe("springEase", () => {
  it("is exactly 0 at the start and 1 at the end", () => {
    for (const damping of [6, 14, 26, 60]) {
      const curve = springEase({ stiffness: 170, damping });
      expect(curve(0)).toBe(0);
      expect(curve(1)).toBe(1);
    }
  });

  it("overshoots only when under-damped, more as damping drops", () => {
    const peak = (damping: number) =>
      Math.max(...samples.map(springEase({ stiffness: 170, damping })));
    expect(peak(26)).toBeLessThanOrEqual(1);
    expect(peak(14)).toBeGreaterThan(1);
    expect(peak(6)).toBeGreaterThan(peak(14));
  });

  it("never turns back when over-damped", () => {
    const curve = springEase({ stiffness: 170, damping: 60 });
    const values = samples.map(curve);
    for (let i = 1; i < values.length; i += 1)
      expect(values[i]).toBeGreaterThanOrEqual(values[i - 1]!);
  });

  it("keeps its shape under extreme damping, where a subtraction would cancel to 0", () => {
    const heavy = springEase({ stiffness: 1, damping: 1e9 });
    expect(heavy(0.5)).toBeGreaterThan(0);
    expect(heavy(1)).toBe(1);
    const a = springEase({ stiffness: 100, damping: 1e8 })(0.5);
    const b = springEase({ stiffness: 100, damping: 1e9 })(0.5);
    expect(a).toBeCloseTo(b, 3);
  });

  it("refuses a spring that never settles", () => {
    expect(() => springEase({ stiffness: 170, damping: 0 })).toThrow(RangeError);
  });
});

describe("backEase", () => {
  const S = 1.70158;
  const oldIn = (u: number) => u * u * ((S + 1) * u - S);
  const oldOut = (u: number) => 1 - oldIn(1 - u);
  const oldInOut = (u: number) => (u < 0.5 ? oldIn(2 * u) / 2 : 1 - oldIn(2 - 2 * u) / 2);

  it("keeps the named back eases at their old values", () => {
    for (const u of samples) {
      expect(ease.backIn(u)).toBe(oldIn(u));
      expect(ease.backOut(u)).toBe(oldOut(u));
      expect(ease.backInOut(u)).toBe(oldInOut(u));
    }
  });

  it("dips further before it goes as the amount grows, and is the cubic at 0", () => {
    const dip = (amount: number) => Math.min(...samples.map(backEase({ amount, direction: "in" })));
    expect(dip(3)).toBeLessThan(dip(1));
    for (const u of samples)
      expect(backEase({ amount: 0, direction: "in" })(u)).toBeCloseTo(u ** 3, 12);
  });

  it("refuses a negative amount", () => {
    expect(() => backEase({ amount: -1, direction: "out" })).toThrow(RangeError);
  });
});
