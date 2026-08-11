import { describe, expect, it, vi } from "vitest";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";

describe("plugin registry", () => {
  const plugin = (name: string, extra: Record<string, unknown> = {}) => ({
    name,
    compose: (values: Readonly<ImmutableRecord>, _progress: number): ImmutableRecord => values,
    ...extra,
  });

  it("registers plugins and resolves them in requested deterministic order", () => {
    const registry = new PluginRegistry(); const first = plugin("first"); const second = plugin("second");
    registry.register(first); registry.register(second);
    const resolved = registry.resolve(["second", "first"]);
    expect(resolved.diagnostics).toEqual([]); expect(resolved.plugins.map(({ name }) => name)).toEqual(["second", "first"]);
    expect(resolved.plugins[0]).not.toBe(second); expect(resolved.plugins[0]).toEqual(second);
  });

  it("resolves authored keys and reports unsupported keys", () => {
    const registry = new PluginRegistry(); registry.register(plugin("opacity", { keys: ["opacity"] })); registry.register(plugin("transform", { claimsKey: (key: string) => key === "x" }));
    const resolved = registry.resolveForKeyframes({ opacity: {}, x: {}, mystery: {} }, "track.keyframes");
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["opacity", "transform"]);
    expect(resolved.diagnostics).toEqual([{ ruleId: "plugin-unknown-key", path: "track.keyframes.mystery", message: 'No registered plugin claims authored key "mystery".', severity: "error", ids: ["mystery"] }]);
  });

  it("orders authored-key plugins by stage, priority, then registration order", () => {
    const registry = new PluginRegistry(); registry.register(plugin("late", { keys: ["x"], stage: "compose", priority: 20 })); registry.register(plugin("early", { keys: ["y"], stage: "prepare", priority: 99 })); registry.register(plugin("same", { keys: ["z"], stage: "compose", priority: 10 }));
    expect(registry.resolveForKeyframes({ x: {}, y: {}, z: {} }).plugins.map(({ name }) => name)).toEqual(["early", "same", "late"]);
  });

  it("retains the compile-time contribution hook and rejects duplicate output ownership", () => {
    const registry = new PluginRegistry(); const contribute = vi.fn();
    registry.register(plugin("first", { keys: ["x"], outputs: ["transform"], contribute }));
    registry.register(plugin("second", { keys: ["y"], outputs: ["transform"] }));
    const resolved = registry.resolveForKeyframes({ x: {}, y: {} });
    expect(resolved.plugins[0]?.contribute).toBe(contribute);
    expect(resolved.diagnostics).toEqual([{ ruleId: "plugin-duplicate-output", path: "keyframes.transform", message: 'Plugins "first" and "second" both claim output "transform".', severity: "error", ids: ["first", "second", "transform"] }]);
  });

  it("rejects duplicate registration instead of overwriting", () => {
    const registry = new PluginRegistry(); registry.register(plugin("transform"));
    expect(() => registry.register(plugin("transform"))).toThrow(/already registered/); expect(registry.size).toBe(1);
  });

  it("reports unknown plugins as deterministic load diagnostics", () => {
    const registry = new PluginRegistry(); registry.register(plugin("known")); const resolved = registry.resolve(["missing", "known", "missing"], "track.use");
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["known"]);
    expect(resolved.diagnostics).toEqual([
      { ruleId: "plugin-unknown", path: "track.use[0]", message: 'Plugin "missing" is not registered.', severity: "error", ids: ["missing"] },
      { ruleId: "plugin-duplicate-use", path: "track.use[2]", message: 'Plugin "missing" is requested more than once.', severity: "error", ids: ["missing"] },
    ]);
  });

  it("rejects malformed registrations", () => {
    const registry = new PluginRegistry(); expect(() => registry.register({ name: "", compose: plugin("x").compose })).toThrow(/non-empty/); expect(() => registry.register({ name: "x", compose: undefined as never })).toThrow(/function/);
  });

  it("detaches resolved plugins from later registry mutation", () => {
    const registry = new PluginRegistry(); const original = plugin("stable"); registry.register(original); const resolved = registry.resolve(["stable"]);
    expect(Object.isFrozen(resolved)).toBe(true); expect(Object.isFrozen(resolved.plugins)).toBe(true); expect(Object.isFrozen(resolved.plugins[0])).toBe(true); expect(resolved.plugins[0]?.compose).toBe(original.compose);
  });
});
