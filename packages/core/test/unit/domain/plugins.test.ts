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

  it("resolves authored keys and reports unsupported keys", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("opacity", { keys: ["opacity"] }));
    registry.register(plugin("transform", { claimsKey: (key: string) => key === "x" }));
    const resolved = registry.resolveForKeyframes(
      { opacity: {}, x: {}, mystery: {} },
      "track.keyframes",
    );
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["opacity", "transform"]);
    expect(resolved.diagnostics).toEqual([
      {
        ruleId: "plugin-unknown-key",
        path: "track.keyframes.mystery",
        message: 'No registered plugin claims authored key "mystery".',
        severity: "error",
        ids: ["mystery"],
      },
    ]);
  });

  it("orders authored-key plugins by stage, priority, then registration order", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("late", { keys: ["x"], stage: "compose", priority: 20 }));
    registry.register(plugin("early", { keys: ["y"], stage: "prepare", priority: 99 }));
    registry.register(plugin("same", { keys: ["z"], stage: "compose", priority: 10 }));
    expect(
      registry.resolveForKeyframes({ x: {}, y: {}, z: {} }).plugins.map(({ name }) => name),
    ).toEqual(["early", "same", "late"]);
  });

  it("retains and invokes the compile-time contribution hook", () => {
    const registry = new PluginRegistry();
    const contribute = vi.fn(() => undefined);
    registry.register(plugin("first", { keys: ["x"], stage: "prepare", contribute }));
    const resolved = registry.resolveForKeyframes({ x: { stops: [] } });
    expect(resolved.plugins[0]?.contribute).toBe(contribute);
    expect(contribute).toHaveBeenCalledOnce();
  });

  it("rejects duplicate output ownership deterministically", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("first", { keys: ["x"], outputs: ["transform"] }));
    registry.register(plugin("second", { keys: ["y"], outputs: ["transform"] }));
    const resolved = registry.resolveForKeyframes({ x: {}, y: {} });
    expect(resolved.diagnostics).toEqual([
      {
        ruleId: "plugin-duplicate-output",
        path: "keyframes.transform",
        message: 'Plugins "first" and "second" both claim output "transform".',
        severity: "error",
        ids: ["first", "second", "transform"],
      },
    ]);
  });

  it("rejects duplicate registration instead of overwriting", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform"));
    expect(() => registry.register(plugin("transform"))).toThrow(/already registered/);
    expect(registry.size).toBe(1);
  });

  it("rejects duplicate exact key ownership at registration", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("first", { keys: ["x"] }));
    expect(() => registry.register(plugin("second", { keys: ["x"] }))).toThrow(
      /plugin-key-collision/,
    );
    expect(registry.size).toBe(1);
  });

  it("lets exact ownership beat a predicate fallback", () => {
    const registry = new PluginRegistry();
    const predicate = vi.fn(() => true);
    const exact = vi.fn(() => undefined);
    registry.register(plugin("predicate", { claimsKey: predicate, stage: "prepare", contribute: predicate }));
    registry.register(plugin("exact", { keys: ["x"], stage: "prepare", contribute: exact }));
    registry.resolveForKeyframes({ x: { stops: [] } });
    expect(exact).toHaveBeenCalledOnce();
    expect(predicate).not.toHaveBeenCalled();
  });

  it("rejects a contributor without prepare stage", () => {
    const registry = new PluginRegistry();
    expect(() => registry.register(plugin("unstaged", { keys: ["x"], contribute: () => undefined }))).toThrow(
      /requires stage "prepare"/,
    );
  });

  it("rejects fractional priorities", () => {
    const registry = new PluginRegistry();
    expect(() => registry.register(plugin("fractional", { priority: 1.5 }))).toThrow(
      /finite integer/,
    );
  });

  it("rejects duplicate input ownership at registration", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("first", { inputs: ["source"] }));
    expect(() => registry.register(plugin("second", { inputs: ["source"] }))).toThrow(
      /plugin-input-collision/,
    );
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

  it("rejects malformed registrations", () => {
    const registry = new PluginRegistry();
    expect(() => registry.register({ name: "", compose: plugin("x").compose })).toThrow(
      /non-empty/,
    );
    expect(() => registry.register({ name: "x", compose: undefined as never })).toThrow(/function/);
    expect(() => registry.register(plugin("bad-keys", { keys: "x" }))).toThrow(/keys/);
    expect(() => registry.register(plugin("bad-claim", { claimsKey: 1 }))).toThrow(/claimsKey/);
    expect(() => registry.register(plugin("bad-priority", { priority: Number.NaN }))).toThrow(
      /priority/,
    );
    expect(() => registry.register(plugin("bad-stage", { stage: "typo" }))).toThrow(/stage/);
  });
});
