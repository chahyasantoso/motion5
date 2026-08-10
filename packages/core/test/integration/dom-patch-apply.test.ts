import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { Patch } from "../../src/runtime/patch-registry";

const patch = (nodeId: string, values: Record<string, unknown>): Patch => ({
  nodeId,
  revision: 1,
  values,
  sourceProgress: 0,
  sourceRevisions: {},
  status: "ready",
  diagnostics: [],
});

describe("DOM patch adapter", () => {
  it("resolves each node, writes changed values, filters internal keys, and never mutates patches", () => {
    const first: DomTarget = { style: { opacity: undefined } };
    const second: DomTarget = { style: { opacity: undefined } };
    const targets = new Map([
      ["hero/arm", first],
      ["hero/label", second],
    ]);
    const writes: Array<[DomTarget, Readonly<Record<string, unknown>>]> = [];
    const adapter = createDomPatchAdapter(
      first,
      undefined,
      (nodeId) => targets.get(nodeId),
      (target, values) => {
        writes.push([target, values]);
        for (const [key, value] of Object.entries(values)) target.style[key] = value;
      },
    );
    const input = patch("hero/arm", { opacity: 1, _internal: true, offset: 10 });
    adapter.apply(input);
    expect(first.style.opacity).toBe(1);
    adapter.apply(input);
    adapter.apply(patch("hero/arm", {}));
    adapter.apply(patch("hero/label", { opacity: 0.5 }));
    expect(first.style.opacity).toBeUndefined();
    expect(second.style.opacity).toBe(0.5);
    expect(writes).toHaveLength(3);
    expect(writes[0]?.[0]).toBe(first);
    expect(writes[0]?.[1]).toEqual({ opacity: 1 });
    expect(writes[1]?.[1]).toEqual({ opacity: undefined });
    expect(writes[2]?.[0]).toBe(second);
    expect(input.values).toEqual({ opacity: 1, _internal: true, offset: 10 });
  });
});
