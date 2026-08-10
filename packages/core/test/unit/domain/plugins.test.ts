import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../../src/domain/plugins";

describe("plugin registry", () => {
  const plugin = (name: string) => ({
    name,
    compose: (values: Record<string, never>, _progress: number) => values,
  });

  it("registers plugins and resolves them in requested deterministic order", () => {
    const registry = new PluginRegistry();
    const first = plugin("first");
    const second = plugin("second");
    registry.register(first);
    registry.register(second);

    const resolved = registry.resolve(["second", "first"]);

    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["second", "first"]);
    expect(resolved.plugins[0]).not.toBe(second);
    expect(resolved.plugins[0]).toEqual(second);
  });

  it("rejects duplicate registration instead of overwriting", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform"));

    expect(() => registry.register(plugin("transform"))).toThrow(/already registered/);
    expect(registry.size).toBe(1);
  });

  it("reports unknown plugins as deterministic load diagnostics", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("known"));

    const resolved = registry.resolve(["missing", "known", "missing"], "track.use");

    expect(resolved.plugins.map(({ name }) => name)).toEqual(["known"]);
    expect(resolved.diagnostics).toEqual([
      {
        ruleId: "plugin-unknown",
        path: "track.use[0]",
        message: 'Plugin "missing" is not registered.',
        severity: "error",
        ids: ["missing"],
      },
      {
        ruleId: "plugin-duplicate-use",
        path: "track.use[2]",
        message: 'Plugin "missing" is requested more than once.',
        severity: "error",
        ids: ["missing"],
      },
    ]);
  });

  it("rejects malformed registrations", () => {
    const registry = new PluginRegistry();

    expect(() => registry.register({ name: "", compose: plugin("x").compose })).toThrow(
      /non-empty/,
    );
    expect(() => registry.register({ name: "x", compose: undefined as never })).toThrow(/function/);
  });

  it("detaches resolved plugins from later registry mutation", () => {
    const registry = new PluginRegistry();
    const original = plugin("stable");
    registry.register(original);
    const resolved = registry.resolve(["stable"]);

    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(resolved.plugins)).toBe(true);
    expect(Object.isFrozen(resolved.plugins[0])).toBe(true);
    expect(resolved.plugins[0]?.compose).toBe(original.compose);
  });
});
