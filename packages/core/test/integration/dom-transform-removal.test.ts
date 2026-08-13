import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import type { Patch } from "../../src/runtime/patch-registry";

function patch(revision: number, values: Readonly<Record<string, unknown>>): Patch {
  return {
    nodeId: "hero/arm",
    revision,
    values,
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
