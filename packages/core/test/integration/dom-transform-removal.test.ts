import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "@motion5/dom/engine";
import type { FlatRecord } from "../../src/contract/v5";
import type { Patch } from "../../src/runtime/patch-registry";

function patch(revision: number, values: FlatRecord): Patch {
  return {
    nodeId: "hero/arm",
    revision,
    outputs: { values },
    sourceProgress: 0,
    sourceRevisions: {},
    status: "ready",
    diagnostics: [],
  };
}

describe("DOM transform and removal contract (P0-4)", () => {
  it("writes motion transform keys into style.transform", () => {
    const style: Record<string, unknown> = {};
    const target = { style };
    const adapter = createDomPatchAdapter(target);

    adapter.apply(patch(1, { x: 10, y: 20, rotation: 30, scale: 2 }));

    expect(style.transform).toBe("translate3d(10px, 20px, 0px) rotate(30deg) scale(2)");
    expect(target).not.toHaveProperty("x");
    expect(target).not.toHaveProperty("rotation");
  });

  it("composes scaleX and scaleY after scale, and writes no attribute for them", () => {
    const style: Record<string, unknown> = {};
    const attributes: string[] = [];
    const target = { style, setAttribute: (key: string) => void attributes.push(key) };
    const adapter = createDomPatchAdapter(target);

    adapter.apply(patch(1, { y: 5, scale: 2, scaleX: 1.2, scaleY: 0.8 }));

    expect(style.transform).toBe("translate3d(0px, 5px, 0px) scale(2) scaleX(1.2) scaleY(0.8)");
    expect(attributes).toEqual([]);
  });

  it("drops scaleX from the transform when a later patch omits it", () => {
    const style: Record<string, unknown> = {};
    const adapter = createDomPatchAdapter({ style });

    adapter.apply(patch(1, { scaleX: 1.2, scaleY: 0.8 }));
    adapter.apply(patch(2, { scaleY: 0.8 }));

    expect(style.transform).toBe("scaleY(0.8)");
  });

  it("removes omitted CSS properties instead of assigning undefined", () => {
    const removed: string[] = [];
    const style: Record<string, unknown> & { removeProperty: (key: string) => void } = {
      opacity: "1",
      removeProperty(key) {
        removed.push(key);
        delete this[key];
      },
    };
    const target = { style };
    const adapter = createDomPatchAdapter(target);

    adapter.apply(patch(1, { opacity: 1 }));
    adapter.apply(patch(2, {}));

    expect(removed).toEqual(["opacity"]);
    expect(style.opacity).toBeUndefined();
  });
});
