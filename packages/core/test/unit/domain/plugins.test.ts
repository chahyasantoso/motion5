import { describe, expect, it, vi } from "vitest";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";

describe("plugin registry", () => {
  const plugin = (name: string, extra: Record<string, unknown> = {}) => ({
    name,
    compose: (values: Readonly<ImmutableRecord>, _progress: number): ImmutableRecord => values,
    ...extra,
  });

  it("resolves authored keys in deterministic order", () => {
    const registry = new PluginRegistry();
    const first = plugin("first", { keys: ["a"] });
    const second = plugin("second", { keys: ["b"] });
    registry.register(first);
    registry.register(second);
    const resolved = registry.resolveForKeyframes({ a: {}, b: {} });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["first", "second"]);
    expect(resolved.plugins[0]).not.toBe(first);
    expect(resolved.plugins[0]).toEqual(first);
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
    expect(registry.resolveForKeyframes({ x: {}, y: {} }).diagnostics).toEqual([
      {
        ruleId: "plugin-duplicate-output",
        path: "keyframes.transform",
        message: 'Plugins "first" and "second" both claim output "transform".',
        severity: "error",
        ids: ["first", "second", "transform"].sort(),
      },
    ]);
  });

  it("N-1 registers two plugins that claim one key", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("first", { keys: ["x"] }));
    registry.register(plugin("second", { keys: ["x"] }));
    // `plugin-key-collision` is deleted. A shared key is a legal registry, because which plugin
    // owns an authored entry is a question about that entry rather than about registration order.
    // The registration guard could only ever answer it by refusing the second plugin outright,
    // which is why `fkPlugin` had to mangle its own key names. See ADR-043.
    expect(registry.size).toBe(2);
  });

  it("N-2 refuses a shared key authored flat instead of picking a winner", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform", { keys: ["x", "y", "rotation"] }));
    registry.register(plugin("fk", { keys: ["length", "rotation"] }));
    const message = [
      'Authored key "rotation" is claimed by plugins "fk" and "transform".',
      "Author it inside a plugin-named group to name one.",
    ].join(" ");
    const resolved = registry.resolveForKeyframes({ rotation: {} }, "track.keyframes");
    // No plugin is resolved and no value is compiled from an owner nobody named. The claimants are
    // sorted, so the message never depends on which one was registered first.
    expect(resolved.plugins).toEqual([]);
    expect(resolved.diagnostics).toEqual([
      {
        ruleId: "plugin-ambiguous-key",
        path: "track.keyframes.rotation",
        message,
        severity: "error",
        ids: ["fk", "rotation", "transform"],
      },
    ]);
  });

  it("N-3 lets a group name the owner of a key several plugins claim", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform", { keys: ["x", "y", "rotation"] }));
    registry.register(plugin("fk", { keys: ["length", "rotation"] }));
    const authored = { fk: { values: { length: {}, rotation: {} } } };
    const resolved = registry.resolveForKeyframes(authored, "track.keyframes");
    // The leaf is checked against `fk` alone, so `transform` never enters the chain even though it
    // claims `rotation` too, and the compiled record still carries the unprefixed leaf names.
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["fk"]);
    expect(resolved.authoredKeyframes).toEqual({ length: {}, rotation: {} });
  });

  it("N-4 leaves a single claimant unambiguous whatever else is registered", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform", { keys: ["x", "y", "rotation"] }));
    registry.register(plugin("opacity", { keys: ["opacity"] }));
    // Green on the parent by design, and not claimed as red. Ambiguity is a property of the
    // registry, not of the plugin catalog: an app that registers no second claimant for `rotation`
    // keeps authoring the flat spelling forever.
    const resolved = registry.resolveForKeyframes({ rotation: {} }, "track.keyframes");
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["transform"]);
  });

  it("N-5 keeps an exact claim ahead of a predicate that also claims the key", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("predicate", { claimsKey: () => true }));
    registry.register(plugin("exact", { keys: ["x"] }));
    // Green on the parent by design, and not claimed as red. A predicate is the fallback for keys
    // nobody named, so it is not a claimant that can make a named key ambiguous; treating it as
    // one would make every exactly-claimed key in a registry with a predicate unauthorable.
    const resolved = registry.resolveForKeyframes({ x: {} }, "track.keyframes");
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["exact"]);
  });

  it("F-6 rejects a colon in plugin keys, inputs, and outputs", () => {
    const registry = new PluginRegistry();
    expect(() => registry.register(plugin("k", { keys: ["fk:length"] }))).toThrow(/':'/);
    expect(() => registry.register(plugin("i", { inputs: ["parent:x"] }))).toThrow(/':'/);
    expect(() => registry.register(plugin("o", { outputs: ["fk:world"] }))).toThrow(/':'/);
    expect(registry.size).toBe(0);
  });

  it("F-7 resolves a grouped leaf against the plugin the group names", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("fk", { keys: ["boneLength", "boneRotation"] }));
    registry.register(plugin("transform", { keys: ["x", "y", "rotation"] }));
    const authored = {
      fk: { values: { boneLength: {}, boneRotation: {} } },
      transform: { values: { x: {} } },
    };
    const resolved = registry.resolveForKeyframes(authored, "track.keyframes");
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["fk", "transform"]);
    expect(resolved.authoredKeyframes).toEqual({ boneLength: {}, boneRotation: {}, x: {} });
  });

  it("F-8 reports an unknown group and an unclaimed leaf at authored paths", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("fk", { keys: ["boneLength"] }));
    const authored = {
      fk: { values: { boneWidth: {} } },
      mystery: { values: { boneLength: {} } },
    };
    const resolved = registry.resolveForKeyframes(authored, "track.keyframes");
    expect(resolved.plugins).toEqual([]);
    expect(resolved.diagnostics).toEqual([
      {
        ruleId: "plugin-unknown-key",
        path: "track.keyframes.fk.values.boneWidth",
        message: 'Plugin "fk" does not claim authored key "boneWidth".',
        severity: "error",
        ids: ["fk", "boneWidth"],
      },
      {
        ruleId: "plugin-unknown-key",
        path: "track.keyframes.mystery",
        message: 'No registered plugin is named "mystery".',
        severity: "error",
        ids: ["mystery"],
      },
    ]);
  });

  it("lets exact ownership beat a predicate fallback", () => {
    const registry = new PluginRegistry();
    const predicate = vi.fn(() => true);
    const exact = vi.fn(() => undefined);
    registry.register(
      plugin("predicate", { claimsKey: predicate, stage: "prepare", contribute: predicate }),
    );
    registry.register(plugin("exact", { keys: ["x"], stage: "prepare", contribute: exact }));
    registry.resolveForKeyframes({ x: { stops: [] } });
    expect(exact).toHaveBeenCalledOnce();
    expect(predicate).not.toHaveBeenCalled();
  });

  it("rejects a contributor without prepare stage", () => {
    const registry = new PluginRegistry();
    expect(() =>
      registry.register(plugin("unstaged", { keys: ["x"], contribute: () => undefined })),
    ).toThrow(/requires stage "prepare"/);
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

  it("rejects duplicate registration and malformed metadata", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform"));
    expect(() => registry.register(plugin("transform"))).toThrow(/already registered/);
    expect(() => registry.register(plugin("bad-keys", { keys: "x" }))).toThrow(/keys/);
    expect(() => registry.register(plugin("bad-claim", { claimsKey: 1 }))).toThrow(/claimsKey/);
    expect(() => registry.register(plugin("bad-priority", { priority: Number.NaN }))).toThrow(
      /priority/,
    );
    expect(() => registry.register(plugin("bad-stage", { stage: "typo" }))).toThrow(/stage/);
  });

  it("detaches resolved plugins from later registry mutation", () => {
    const registry = new PluginRegistry();
    const original = plugin("stable", { keys: ["stable"] });
    registry.register(original);
    const resolved = registry.resolveForKeyframes({ stable: {} });
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(resolved.plugins)).toBe(true);
    expect(Object.isFrozen(resolved.plugins[0])).toBe(true);
    expect(resolved.plugins[0]?.compose).toBe(original.compose);
  });
});
