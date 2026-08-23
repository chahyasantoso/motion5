import { describe, expect, it } from "vitest";
import type { Diagnostic } from "../../../src/contract/v5";
import { validateKeyframes } from "../../../src/contract/validate-v5";
import { flattenAuthoredKeyframes } from "../../../src/domain/keyframe-groups";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";

// Issue #173 and ADR-044. A plugin owns the input slots it understands, and the author binds them
// inside the plugin's own authored group rather than in a track-level `observes` entry with a
// projection map the author had to keep synchronized with the plugin by hand.
//
// The three validation owners are separated here on purpose: `validateKeyframes` owns the
// registry-independent shape of the bindings section, `PluginRegistry.resolveForKeyframes` owns
// whether a named plugin declares a bound slot, and topology is the graph layer's. A test that
// asserted all three through one entry point would not be able to tell which owner regressed.
//
// The bindings section sits beside the `values` section rather than beside the leaves, per ADR-049.
// Its own authored path is unchanged, which is why every rule id below is too.

function hold(value: number) {
  return value;
}

function ruleIds(keyframes: unknown): readonly string[] {
  const diagnostics: Diagnostic[] = [];
  validateKeyframes(keyframes, "keyframes", diagnostics);
  return diagnostics.map(({ ruleId }) => ruleId).sort();
}

const fkStub: PluginDefinition = {
  name: "fk",
  keys: ["length", "rotation"],
  requirements: { base: { description: "the parent this bone hangs from" } },
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values) => values,
};

function registry(...plugins: readonly PluginDefinition[]): PluginRegistry {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

describe("plugin-owned input requirements", () => {
  it("Q-1 refuses a requirement slot that reaches into the internal-key namespace", () => {
    // The colon is reserved in every plugin metadata name because a namespaced key is private and
    // never published. A slot spelled with one would name a scoped input nothing could deliver.
    const bad: PluginDefinition = { ...fkStub, requirements: { "fk:base": {} } };
    expect(() => registry(bad)).toThrow(/must not contain ':'/);
  });

  it("Q-2 reports a binding to a slot the named plugin never declared", () => {
    const resolved = registry(fkStub).resolveForKeyframes({
      fk: { values: { length: hold(50) }, requires: { destination: "walk/hand" } },
    });
    const unknown = resolved.diagnostics.find(
      ({ ruleId }) => ruleId === "plugin-unknown-requirement",
    );
    expect(unknown?.path).toBe("keyframes.fk.requires.destination");
    expect(unknown?.severity).toBe("error");
  });

  it("Q-3 resolves a declared binding and keeps the owning plugin in the chain", () => {
    // A group that authors nothing but bindings still names its plugin, so the plugin has to reach
    // the compose chain: otherwise a bound track would derive an edge and then compose nothing.
    const resolved = registry(fkStub).resolveForKeyframes({
      fk: { requires: { base: "walk/pelvis" } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.requirements).toEqual([{ plugin: "fk", slot: "base", source: "walk/pelvis" }]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["fk"]);
  });

  it("Q-4 keeps the bindings section out of the compiled keyframes", () => {
    // `requires` is metadata, not a property. Flattened as a leaf it would reach the percent map
    // and the interpolator as a property with no stops, and the track would hold still.
    const flattened = flattenAuthoredKeyframes({
      fk: { values: { length: hold(50) }, requires: { base: "walk/pelvis" } },
    });
    expect(Object.keys(flattened.keyframes)).toEqual(["length"]);
    expect(flattened.bindings).toEqual([
      { plugin: "fk", slot: "base", source: "walk/pelvis", authoredPath: "fk.requires.base" },
    ]);
  });

  it("Q-5 validates the bindings section without a plugin registry", () => {
    expect(ruleIds({ fk: { requires: [] } })).toEqual(["keyframes-requires-shape"]);
    expect(ruleIds({ fk: { requires: {} } })).toEqual(["keyframes-requires-empty"]);
    expect(ruleIds({ fk: { requires: { base: "" } } })).toEqual(["keyframes-requires-source"]);
    expect(ruleIds({ fk: { requires: { "x:y": "a" } } })).toEqual(["keyframes-requires-slot"]);
  });

  it("Q-6 refuses the bindings section authored as a keyframe of its own", () => {
    // A top-level `requires` names no plugin, so a binding there could never be owned by one.
    // Accepting it would be a second authored spelling with no destination.
    expect(ruleIds({ requires: { base: "a" } })).toEqual(["keyframes-reserved-section"]);
  });
});
