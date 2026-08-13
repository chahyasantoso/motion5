import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../../src/domain/plugins";

const stops = (value: number) => ({ stops: [{ p: 0, v: value }, { p: 1, v: value + 1 }] });
const compose = (values: Record<string, unknown>) => values;

describe("plugin contribution contract (X-3)", () => {
  it("passes the authored key, stops, and frozen track view to the contributor", () => {
    const calls: unknown[] = [];
    const registry = new PluginRegistry();
    registry.register({ name: "base", keys: ["x"], stage: "prepare", contribute: (key, authoredStops, track) => { calls.push([key, authoredStops, track, Object.isFrozen(track)]); return undefined; }, compose });
    registry.resolveForKeyframes({ x: stops(1) }, "track.keyframes", { id: "hero/arm", duration: 2 });
    expect(calls).toEqual([["x", [{ p: 0, v: 1 }, { p: 1, v: 2 }], { id: "hero/arm", duration: 2 }, true]]);
  });

  it("preserves both keyframes and tweenVars from one explicit contribution", () => {
    const registry = new PluginRegistry();
    registry.register({ name: "derived", keys: ["x"], stage: "prepare", contribute: () => ({ keyframes: { derived: stops(4) }, tweenVars: { overwrite: "auto" } }), compose });
    const resolved = registry.resolveForKeyframes({ x: stops(1) });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.preparation.keyframes).toEqual({ derived: stops(4) });
    expect(resolved.preparation.tweenVars).toEqual({ overwrite: "auto" });
  });

  it("rejects duplicate contributed outputs and conflicting tween vars", () => {
    const registry = new PluginRegistry();
    registry.register({ name: "first", keys: ["x"], stage: "prepare", contribute: () => ({ keyframes: { derived: stops(1) }, tweenVars: { overwrite: "auto" } }), compose });
    registry.register({ name: "second", keys: ["x"], stage: "prepare", contribute: () => ({ keyframes: { derived: stops(2) }, tweenVars: { overwrite: "all" } }), compose });
    const rules = registry.resolveForKeyframes({ x: stops(1) }).diagnostics.map(({ ruleId }) => ruleId);
    expect(rules).toEqual(expect.arrayContaining(["plugin-contribution-key-collision", "plugin-contribution-tween-vars-conflict"]));
  });

  it("rejects malformed contributed stops instead of installing them", () => {
    const registry = new PluginRegistry();
    registry.register({ name: "bad", keys: ["x"], stage: "prepare", contribute: () => ({ keyframes: { derived: { stops: [{ p: 0.8, v: 1 }, { p: 0.2, v: 2 }] } } }), compose });
    const resolved = registry.resolveForKeyframes({ x: stops(1) });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toContain("plugin-contribution-stop-order");
    expect(resolved.preparation.keyframes).toEqual({});
  });
});
