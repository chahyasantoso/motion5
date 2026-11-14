import { describe, expect, it } from "vitest";
import { arch, attack, ballistic, decay, noise1d, radial, taper, wave } from "../src/index";

describe("wave", () => {
  it("crosses zero 2 * count - 1 times strictly inside", () => {
    for (const count of [1, 2, 3, 4]) {
      let crossings = 0;
      let last = Math.sign(wave(1 / 1000, count));
      for (let i = 2; i < 1000; i += 1) {
        const sign = Math.sign(wave(i / 1000, count));
        if (sign !== 0 && last !== 0 && sign !== last) crossings += 1;
        if (sign !== 0) last = sign;
      }
      expect(crossings).toBe(2 * count - 1);
    }
  });
  it("is 1 at progress 0 for phase 0.25", () => {
    expect(wave(0, 2, 0.25)).toBeCloseTo(1, 12);
  });
});

describe("envelopes", () => {
  it("match their closed forms", () => {
    for (const p of [0, 0.5, 1]) {
      expect(taper(p, 2)).toBeCloseTo((1 - p) ** 2, 12);
      expect(decay(p, 3)).toBeCloseTo(Math.exp(-3 * p), 12);
      expect(attack(p, 3)).toBeCloseTo(1 - Math.exp(-3 * p), 12);
      expect(arch(p)).toBeCloseTo(Math.sin(Math.PI * p), 12);
    }
  });
});

describe("ballistic", () => {
  const cases = [
    { dx: 80, dy: 0, apex: 50 },
    { dx: -40, dy: 120, apex: 30 },
    { dx: 10, dy: -90, apex: 0 },
    { dx: 0, dy: 60, apex: 0 },
  ];
  for (const options of cases) {
    it(`throws ${JSON.stringify(options)}`, () => {
      const { dx, dy, apex } = options;
      const ys = Array.from({ length: 61 }, (_, i) => ballistic(i / 60, options).y);
      const second = ys.slice(2).map((y, i) => y - 2 * (ys[i + 1] ?? 0) + (ys[i] ?? 0));
      for (const value of second) expect(value).toBeCloseTo(second[0] ?? 0, 9);
      let lowest = Infinity;
      for (let i = 0; i <= 100000; i += 1)
        lowest = Math.min(lowest, ballistic(i / 100000, options).y);
      expect(lowest).toBeCloseTo(Math.min(dy, 0) - apex, 6);
      expect(ballistic(0, options).x).toBeCloseTo(dx, 12);
      expect(ballistic(0, options).y).toBeCloseTo(dy, 12);
      expect(ballistic(1, options).x).toBeCloseTo(0, 12);
      expect(ballistic(1, options).y).toBeCloseTo(0, 12);
      expect(ballistic(0.25, options).x).toBeCloseTo(dx * 0.75, 12);
    });
  }
  it("refuses a negative apex", () => {
    expect(() => ballistic(0.5, { dx: 0, dy: 0, apex: -1 })).toThrow(RangeError);
    expect(() => ballistic(0.5, { dx: 0, dy: 0, apex: -1 })).toThrow(/ballistic/);
  });
});

describe("radial", () => {
  it("measures degrees clockwise from the right with y down", () => {
    expect(radial(0, 10).x).toBeCloseTo(10, 12);
    expect(radial(0, 10).y).toBeCloseTo(0, 12);
    expect(radial(90, 10).x).toBeCloseTo(0, 12);
    expect(radial(90, 10).y).toBeCloseTo(10, 12);
  });
});

describe("noise1d", () => {
  it("stays within -1 to 1, reaches most of it, and moves no faster than a smoothstep across the range", () => {
    const noise = noise1d(7);
    // A smoothstep's steepest slope is 1.5 times its rise, and a rise is at most 2, over `scale` ms.
    const steepest = (1.5 * 2 * 16) / 400;
    let reach = 0;
    for (let ms = 0; ms <= 60000; ms += 16) {
      expect(Math.abs(noise(ms))).toBeLessThanOrEqual(1);
      expect(Math.abs(noise(ms + 16) - noise(ms))).toBeLessThanOrEqual(steepest + 1e-12);
      reach = Math.max(reach, Math.abs(noise(ms)));
    }
    expect(reach).toBeGreaterThan(0.8);
  });
  it("is the same for one seed and differs for another", () => {
    const a = noise1d(1);
    const b = noise1d(1);
    const c = noise1d(2);
    let differs = false;
    for (let ms = 0; ms <= 3000; ms += 50) {
      expect(a(ms)).toBe(b(ms));
      if (a(ms) !== c(ms)) differs = true;
    }
    expect(differs).toBe(true);
  });
});
