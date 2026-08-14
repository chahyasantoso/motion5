import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { Patch } from "../../src/runtime/patch-registry";

function patch(
  revision: number,
  nodeId: string,
  values: Readonly<Record<string, unknown>>,
  status: Patch["status"] = "ready",
): Patch {
  return {
    nodeId,
    revision,
    values,
    sourceProgress: 0,
    sourceRevisions: {},
    status,
    diagnostics: [],
  };
}

describe("DOM patch adapter contract (C3)", () => {
  it("resolves each node, filters internal values, diffs writes, removes omitted keys, and clears cache", () => {
    const stage = { style: {} as Record<string, unknown> };
    const arm: DomTarget = { style: {} };
    const leg: DomTarget = { style: {} };
    const writes: Array<{ target: DomTarget; values: Readonly<Record<string, unknown>> }> = [];
    const adapter = createDomPatchAdapter(
      stage,
      undefined,
      (nodeId) => ({ "hero/arm": arm, "hero/leg": leg })[nodeId],
      (target, values) => writes.push({ target, values }),
    );

    const first = patch(1, "hero/arm", {
      opacity: 1,
      "--accent": "red",
      _internal: "hidden",
      offset: 12,
    });
    adapter.apply(first);
    expect(writes).toEqual([{ target: arm, values: { opacity: 1, "--accent": "red" } }]);
    expect(first.values).toEqual({
      opacity: 1,
      "--accent": "red",
      _internal: "hidden",
      offset: 12,
    });

    adapter.apply(patch(2, "hero/arm", { opacity: 1, "--accent": "red" }));
    expect(writes).toHaveLength(1);

    adapter.apply(patch(3, "hero/arm", { opacity: 0.5 }));
    expect(writes[1]).toEqual({ target: arm, values: { opacity: 0.5, "--accent": undefined } });

    adapter.apply(patch(4, "hero/leg", { opacity: 0.25 }));
    expect(writes[2]).toEqual({ target: leg, values: { opacity: 0.25 } });

    adapter.clear(arm);
    adapter.apply(patch(5, "hero/arm", { opacity: 0.5 }));
    expect(writes[3]).toEqual({ target: arm, values: { opacity: 0.5 } });
  });

  it("does not write blocked, error, or unresolved patches", () => {
    const stage = { style: {} as Record<string, unknown> };
    const writes: Array<Readonly<Record<string, unknown>>> = [];
    const adapter = createDomPatchAdapter(
      stage,
      undefined,
      () => stage,
      (_target, values) => writes.push(values),
    );

    adapter.apply(patch(1, "missing", { opacity: 1 }, "blocked"));
    adapter.apply(patch(2, "missing", { opacity: 1 }, "error"));
    expect(writes).toEqual([]);
  });
});
