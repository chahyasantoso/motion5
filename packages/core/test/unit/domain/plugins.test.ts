import { describe, expect, it, vi } from "vitest";
import { fileURLToPath } from "node:url";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";
import type { Diagnostic } from "../../../src/contract/v5";
import { validateKeyframes } from "../../../src/contract/validate-v5";
import { code, member } from "../../helpers/source-region";

const PLUGINS = code(fileURLToPath(new URL("../../../src/domain/plugins.ts", import.meta.url)));

describe("plugin registry", () => {
  const plugin = (name: string, extra: Record<string, unknown> = {}) => ({
    name,
    compose: (values: Readonly<ImmutableRecord>, _progress: number): ImmutableRecord => values,
    ...extra,
  });

  // One spelling of "this stage is refused", asserting the constructor and the exact message. The
  // quality pass on #472 filed `toThrow(/stage/)` at the coercion case and accepted it only because
  // the bad-stage case beside it had always used the same loose matcher, on the record that whoever
  // touched either would tighten both together. This is that. A regular expression over the word
  // `stage` is satisfied by five other guards in `register` and by any unrelated error carrying the
  // word, so it could not tell "refused for its stage" from "refused before the stage was read".
  // Registering twice is safe: the guard throws ahead of both the duplicate check and the insert,
  // so the second call reaches the same arm rather than "already registered".
  const refusesStage = (stage: unknown, message: string): void => {
    const registry = new PluginRegistry();
    const register = (): void => {
      registry.register(plugin("staged", { stage }));
    };
    expect(register).toThrow(TypeError);
    expect(register).toThrow(new TypeError(message));
  };

  it("resolves authored keys in deterministic order", () => {
    const registry = new PluginRegistry();
    const first = plugin("first", { keys: ["a"] });
    const second = plugin("second", { keys: ["b"] });
    registry.register(first);
    registry.register(second);
    const resolved = registry.resolveForKeyframes({
      first: { values: { a: {} } },
      second: { values: { b: {} } },
    });
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
      {
        opacity: { values: { opacity: {} } },
        transform: { values: { x: {} } },
        mystery: { values: { mystery: {} } },
      },
      "track.keyframes",
    );
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["opacity", "transform"]);
    expect(resolved.diagnostics).toEqual([
      {
        ruleId: "plugin-unknown-key",
        path: "track.keyframes.mystery",
        message: 'No registered plugin is named "mystery".',
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
      registry
        .resolveForKeyframes({
          late: { values: { x: {} } },
          early: { values: { y: {} } },
          same: { values: { z: {} } },
        })
        .plugins.map(({ name }) => name),
    ).toEqual(["early", "same", "late"]);
  });

  it("retains and invokes the compile-time contribution hook", () => {
    const registry = new PluginRegistry();
    const contribute = vi.fn(() => undefined);
    registry.register(plugin("first", { keys: ["x"], stage: "prepare", contribute }));
    const resolved = registry.resolveForKeyframes({ first: { values: { x: [] } } });
    expect(resolved.plugins[0]?.contribute).toBe(contribute);
    expect(contribute).toHaveBeenCalledOnce();
  });

  it("rejects duplicate output ownership deterministically", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("first", { keys: ["x"], outputs: ["transform"] }));
    registry.register(plugin("second", { keys: ["y"], outputs: ["transform"] }));
    expect(
      registry.resolveForKeyframes({ first: { values: { x: {} } }, second: { values: { y: {} } } })
        .diagnostics,
    ).toEqual([
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
    // A shared key is a legal registry: which plugin owns an authored leaf is answered by the group
    // the leaf sits in, never by registration order. See ADR-043 and ADR-121.
    expect(registry.size).toBe(2);
  });

  it("N-2 refuses a shared key authored ungrouped instead of picking a winner", () => {
    const registry = new PluginRegistry();
    registry.register(plugin("transform", { keys: ["x", "y", "rotation"] }));
    registry.register(plugin("fk", { keys: ["length", "rotation"] }));
    const diagnostics: Diagnostic[] = [];
    validateKeyframes({ rotation: {} }, "track.keyframes", diagnostics);
    // The authored-shape rule runs before ownership, so claimant order is irrelevant and no
    // ambiguity-specific rule is needed anymore.
    expect(registry.size).toBe(2);
    expect(diagnostics).toEqual([
      {
        ruleId: "keyframes-ungrouped-key",
        path: "track.keyframes.rotation",
        message:
          "Keyframe 'rotation' must be a plugin-named group; author the property as { <plugin>: { values: { ... } } }.",
        severity: "error",
        ids: [],
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
    // Green on the parent by design, and not claimed as red. The named group is the owner whatever
    // else is registered, so an app with no second claimant for `rotation` reads the same leaf.
    const resolved = registry.resolveForKeyframes(
      { transform: { values: { rotation: {} } } },
      "track.keyframes",
    );
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
    const resolved = registry.resolveForKeyframes(
      { exact: { values: { x: {} } } },
      "track.keyframes",
    );
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

  // The group names the owner (ADR-121), so a predicate that claims every key is never consulted
  // for a leaf authored under another plugin's group, and neither is its contribution hook.
  it("lets the group name the owner even when a predicate also claims the key", () => {
    const registry = new PluginRegistry();
    const predicate = vi.fn(() => true);
    const exact = vi.fn(() => undefined);
    registry.register(
      plugin("predicate", { claimsKey: predicate, stage: "prepare", contribute: predicate }),
    );
    registry.register(plugin("exact", { keys: ["x"], stage: "prepare", contribute: exact }));
    registry.resolveForKeyframes({ exact: { values: { x: [] } } });
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
    refusesStage("typo", 'Unknown plugin stage "typo".');
  });

  it("declares one closed stage vocabulary and reads it exhaustively", () => {
    // A literal union leaves no run-time witness, so the guarantee is read off the source the way
    // `bind-clock-exhaustive` reads its own. Red before issue #469's slice, where `stage` was
    // `string` and `stageRank` tested one member and ranked everything else last, so a third stage
    // took the compose rank without any reader owing it a decision. The registration guard above
    // still refuses an unknown stage, because that is the arrival a caller can reach from
    // JavaScript. See ADR-092 and ADR-097.
    expect(PLUGINS).toContain('export type PluginStage = "prepare" | "compose";');
    expect(PLUGINS).toContain("readonly stage?: PluginStage;");
    expect(PLUGINS).not.toContain("readonly stage?: string;");
    const rank = member(PLUGINS, "function stageRank(stage: PluginStage): number {", "");
    expect(rank).toContain('case "prepare":');
    expect(rank).toContain('case "compose":');
    expect(rank).toContain("unreachable(stage)");
  });

  it("refuses a stage that only coerces to a member, the way the retired set did", () => {
    // `Object.hasOwn` coerces its key, so each of these registered as a member and then reached
    // `stageRank`, which owes no arm to a value the union cannot hold: the refusal arrived as
    // `Unhandled variant` at the next compose instead of at the registration that caused it. Only
    // JavaScript can make these arrivals, which is why the run-time read is the one that owes them.
    // Every expected message spells a real member, because the guard interpolates the value it
    // refused and all three of these coerce to one. That is the proof the refusal is by identity
    // rather than by the text: a guard that read the spelling would have accepted all three.
    refusesStage(["prepare"], 'Unknown plugin stage "prepare".');
    refusesStage(new String("compose"), 'Unknown plugin stage "compose".');
    refusesStage({ toString: () => "prepare" }, 'Unknown plugin stage "prepare".');
  });

  it("detaches resolved plugins from later registry mutation", () => {
    const registry = new PluginRegistry();
    const original = plugin("stable", { keys: ["stable"] });
    registry.register(original);
    const resolved = registry.resolveForKeyframes({ stable: { values: { stable: {} } } });
    expect(Object.isFrozen(resolved)).toBe(true);
    expect(Object.isFrozen(resolved.plugins)).toBe(true);
    expect(Object.isFrozen(resolved.plugins[0])).toBe(true);
    expect(resolved.plugins[0]?.compose).toBe(original.compose);
  });
});
