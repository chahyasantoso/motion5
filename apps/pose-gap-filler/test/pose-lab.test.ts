import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { bendLabel } from "../src/view/bend-label";
import { canvasPoint, canvasRadius } from "../src/view/dom";
import { code } from "../../../packages/core/test/helpers/source-region";

describe("lightweight pose lab UI contracts", () => {
  it("GF-199 distinguishes fallback solves from unpublished limbs without inventing evidence", () => {
    expect(bendLabel({ kind: "unavailable" }, true)).toBe("unavailable evidence (legacy fallback)");
    expect(bendLabel({ kind: "unavailable" }, false)).toBe("unavailable (not published)");
    expect(bendLabel({ kind: "observed", direction: [1, 0, 0] }, true)).toBe("observed");
    expect(bendLabel({ kind: "held", direction: [1, 0, 0], lastObservedTMs: 10 }, true)).toBe(
      "held (last observation 10 ms)",
    );
    for (const basis of ["coast", "prior"] as const)
      expect(
        bendLabel({ kind: "predicted", direction: [1, 0, 0], basis, lastObservedTMs: 20 }, true),
      ).toBe(`predicted (${basis}, last observation 20 ms)`);
  });
  it("GF-200 responsive canvas positions retain the fixed 640 by 480 coordinate contract", () => {
    for (const width of [280, 320, 480, 640]) {
      const canvas = {
        width: 640,
        height: 480,
        getBoundingClientRect: () => ({ left: 20, top: 40, width, height: width * 0.75 }),
      } as HTMLCanvasElement;
      const pointer = { clientX: 20 + width / 2, clientY: 40 + width * 0.375 } as PointerEvent;
      expect(canvasPoint(canvas, pointer)).toEqual([320, 240]);
      expect((canvasRadius(canvas, 24) * width) / 640).toBeCloseTo(24, 10);
    }
  });
  it("GF-201 every required live control appears exactly once after UI restructuring", () => {
    const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
    const sources = ["live/main.ts", "view/simulator-panel.ts"].map((file) =>
      code(new URL(`../src/${file}`, import.meta.url)),
    );
    const ids = new Set(
      sources.flatMap((source) =>
        [...source.matchAll(/["']#([a-z][\w-]*)["']/g)].map((m) => m[1]!),
      ),
    );
    for (const id of ids) expect([...html.matchAll(new RegExp(`id="${id}"`, "g"))].length).toBe(1);
    const all = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
    expect(new Set(all).size).toBe(all.length);
    expect(html).toContain('id="report" role="status"');
    expect(html).toContain('aria-describedby="pose-help"');
  });
  it("GF-202 all responsive stage layers share one proportional viewport", () => {
    const css = readFileSync(new URL("../src/view/pose-lab.css", import.meta.url), "utf8");
    expect(css).toContain("aspect-ratio: 4 / 3");
    expect(css).toContain("touch-action: none");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).not.toContain("@import");
    expect(
      canvasRadius(
        {
          width: 640,
          getBoundingClientRect: () => ({ width: 0 }),
        } as HTMLCanvasElement,
        24,
      ),
    ).toBe(24);
  });
});
