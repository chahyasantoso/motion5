import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import { PluginRegistry } from "../../src/domain/plugins";

// The internal-key denylist used to be applied here. It is now applied once in `Track.compose`,
// before publication, so every renderer receives the same already-filtered values and the React
// path cannot leak what this adapter hid. `internal-key-strip.test.ts` owns that evidence; what
// belongs to this adapter is serializing plugin-owned outputs.
describe("DOM plugin metadata (X-2)", () => {
  it("serializes plugin-owned outputs before writing to the DOM", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "path",
      keys: ["path"],
      outputs: ["transform"],
      internalKeys: ["path"],
      outputSerializers: {
        transform: (value) => `translate(${String(value)}px)`,
      },
      compose: (values) => values,
    });
    const resolved = registry.resolveForKeyframes({ path: { values: { path: {} } } });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.internalKeys).toEqual(["path"]);
    expect(resolved.outputSerializers?.transform?.(10)).toBe("translate(10px)");
    const writes: Record<string, unknown>[] = [];
    const stage = { style: {} as Record<string, unknown> };
    const adapter = createDomPatchAdapter(
      stage,
      undefined,
      () => stage,
      (_target, values) => writes.push({ ...values }),
      resolved,
    );
    // The authored `path` value is already gone by the time a patch exists, so a renderer never
    // has to know it was internal.
    adapter.apply({
      nodeId: "hero/path",
      revision: 1,
      outputs: { values: { transform: 10 } },
      sourceProgress: 0,
      sourceRevisions: {},
      status: "ready",
      diagnostics: [],
    });
    expect(writes).toEqual([{ transform: "translate(10px)" }]);
  });
});
