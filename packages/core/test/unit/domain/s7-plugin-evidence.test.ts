import { describe, expect, it, vi } from "vitest";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";

const compose = (values: Readonly<ImmutableRecord>): ImmutableRecord => values;

function contributor(name: string, output: string, ease = "none") {
  return {
    name,
    keys: [output],
    stage: "prepare" as const,
    contribute: vi.fn(() => ({ tweenVars: { ease } })),
    compose,
  };
}

describe("S7 plugin evidence", () => {
  it("invokes each owned contributor exactly once and permits identical tween vars", () => {
    const registry = new PluginRegistry();
    const first = contributor("first", "x");
    const second = contributor("second", "y");
    registry.register(first);
    registry.register(second);

    const resolved = registry.resolveForKeyframes({ x: [], y: [] });

    expect(first.contribute).toHaveBeenCalledOnce();
    expect(second.contribute).toHaveBeenCalledOnce();
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.preparation.tweenVars).toEqual({ ease: "none" });
  });

  it("keeps preparation and diagnostics deterministic across registration order", () => {
    const resolve = (reverse: boolean) => {
      const registry = new PluginRegistry();
      const plugins = [contributor("first", "x"), contributor("second", "y")];
      for (const plugin of reverse ? plugins.reverse() : plugins) registry.register(plugin);
      return registry.resolveForKeyframes({ x: [], y: [] });
    };

    const forward = resolve(false);
    const reverse = resolve(true);
    expect(forward.preparation).toEqual(reverse.preparation);
    expect(forward.diagnostics).toEqual(reverse.diagnostics);
  });

  it("sorts duplicate output diagnostic ids", () => {
    const registry = new PluginRegistry();
    registry.register({ name: "zeta", keys: ["x"], outputs: ["transform"], compose });
    registry.register({ name: "alpha", keys: ["y"], outputs: ["transform"], compose });

    expect(registry.resolveForKeyframes({ x: {}, y: {} }).diagnostics[0]?.ids).toEqual([
      "alpha",
      "transform",
      "zeta",
    ]);
  });
});
