import { describe, expect, it } from "vitest";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";

const compose = (values: Readonly<ImmutableRecord>): ImmutableRecord => values;
const property = (value: number) => [
  { p: 0, v: value },
  { p: 1, v: value + 1 },
];

describe("S5 contribution completeness", () => {
  it("rejects a contributed key with no registered owner", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "base",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ keyframes: { derived: property(1) } }),
      compose,
    });

    const resolved = registry.resolveForKeyframes({ x: property(0) }, "track.keyframes");
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-unknown-key");
  });

  it("rejects a contributor attempting to overwrite a reserved tween var", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "base",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ tweenVars: { duration: 99 } }),
      compose,
    });

    const resolved = registry.resolveForKeyframes({ x: property(0) }, "track.keyframes");
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toContain(
      "plugin-contribution-reserved-tween-var",
    );
    expect(resolved.preparation.tweenVars).not.toHaveProperty("duration");
  });

  it("bounds a two-hop contribution chain instead of silently accepting it", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "base",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ keyframes: { derived: property(1) } }),
      compose,
    });
    registry.register({
      name: "derived-owner",
      keys: ["derived"],
      stage: "prepare",
      contribute: () => ({ keyframes: { second: property(2) } }),
      compose,
    });

    const resolved = registry.resolveForKeyframes({ x: property(0) }, "track.keyframes");
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toContain(
      "plugin-contribution-cascade",
    );
  });
});
