import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import { PluginRegistry } from "../../src/domain/plugins";

describe("DOM plugin metadata (X-2)", () => {
  it("uses resolved internal-key metadata instead of hardcoding underscore filtering", () => {
    const registry = new PluginRegistry();
    registry.register({ name: "motion", keys: ["x"], internalKeys: ["secret", "offset"], compose: (values) => values });
    const resolved = registry.resolveForKeyframes({ x: {} });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.internalKeys).toEqual(["offset", "secret"]);
    const writes: Record<string, unknown>[] = [];
    const stage = { style: {} as Record<string, unknown> };
    const adapter = createDomPatchAdapter(stage, undefined, () => stage, (_target, values) => writes.push({ ...values }), resolved);
    adapter.apply({ nodeId: "hero/arm", revision: 1, values: { x: 10, secret: "do-not-render", offset: 4 }, sourceProgress: 0, sourceRevisions: {}, status: "ready", diagnostics: [] });
    expect(writes).toEqual([{ x: 10 }]);
  });

  it("serializes plugin-owned outputs before writing to the DOM", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "path",
      keys: ["path"],
      outputs: ["transform"],
      outputSerializers: { transform: (value) => { const transform = value as { x: number; y: number }; return `translate(${transform.x}px, ${transform.y}px)`; } },
      compose: (values) => values,
    });
    const resolved = registry.resolveForKeyframes({ path: {} });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.outputSerializers?.transform?.({ x: 1, y: 2 })).toBe("translate(1px, 2px)");
    const writes: Record<string, unknown>[] = [];
    const stage = { style: {} as Record<string, unknown> };
    const adapter = createDomPatchAdapter(stage, undefined, () => stage, (_target, values) => writes.push({ ...values }), resolved);
    adapter.apply({ nodeId: "hero/path", revision: 1, values: { transform: { x: 10, y: 20 }, path: { points: [] } }, sourceProgress: 0, sourceRevisions: {}, status: "ready", diagnostics: [] });
    expect(writes).toEqual([{ transform: "translate(10px, 20px)" }]);
  });
});
