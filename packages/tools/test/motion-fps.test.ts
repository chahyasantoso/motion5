import { describe, expect, it } from "vitest";
import { parseFpsArgs, summarize } from "../src/page/fps";
import { DEFAULT_SOURCE } from "../src/page/page";

describe("parseFpsArgs", () => {
  it("defaults to 10000 ms, 1280x720, hidden", () => {
    expect(parseFpsArgs(["a.html"])).toEqual({
      kind: "fps",
      page: "a.html",
      width: 1280,
      height: 720,
      source: DEFAULT_SOURCE,
      to: 10000,
      show: false,
    });
  });

  it("reads --to, --size and --show", () => {
    expect(parseFpsArgs(["a.html", "--to", "3000", "--size", "800x600", "--show"])).toMatchObject({
      kind: "fps",
      to: 3000,
      width: 800,
      height: 600,
      show: true,
    });
  });

  it("refuses a --to that is missing, zero or negative", () => {
    expect(parseFpsArgs(["a.html", "--to"]).kind).toBe("usage");
    for (const bad of ["0", "-5", "abc"])
      expect(parseFpsArgs(["a.html", "--to", bad]).kind).toBe("usage");
  });

  it("refuses an unknown flag", () => {
    expect(parseFpsArgs(["a.html", "--nope", "1"]).kind).toBe("usage");
  });
});

describe("summarize", () => {
  const every = (from: number, to: number, step: number): number[] => {
    const stamps: number[] = [];
    for (let at = from; at <= to; at += step) stamps.push(at);
    return stamps;
  };

  it("lowers the rate of the window a stall ends in", () => {
    const frames = [...every(0, 200, 16), ...every(700, 1000, 16)];
    const report = summarize({ frames, scene: [], write: [] }, "p.html", 1000, true, "gpu", []);
    expect(report.windows[0]?.fps).toBeGreaterThan(55);
    expect(report.windows[1]?.fps).toBeLessThan(30);
  });

  it("splits a scene measure that outruns its frame, so no part is negative", () => {
    const frames = [0, 16, 64, 80];
    const report = summarize(
      {
        frames,
        scene: [
          [0, 0],
          [20, 52],
        ],
        write: [],
      },
      "p.html",
      100,
      true,
      "gpu",
      [],
    );
    const slow = report.worst[0];
    expect(slow?.ms).toBe(48);
    expect(slow?.scene).toBe(44);
    expect(report.worst.every((frame) => frame.rest >= 0)).toBe(true);
  });
});
