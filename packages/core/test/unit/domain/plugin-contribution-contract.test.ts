import { describe, expect, it, vi } from "vitest";
import type { AuthoredStop } from "../../../src/contract/v5";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";
const stops = (value: number): { readonly stops: readonly AuthoredStop[] } => ({
  stops: [
    { p: 0, v: value },
    { p: 1, v: value + 1 },
  ],
});
const compose = (values: Readonly<ImmutableRecord>): ImmutableRecord => values;
describe("plugin contribution contract (X-3)", () => {
  it("passes the authored key, stops, and frozen track view to the contributor", () => {
    const calls: unknown[] = [];
    const registry = new PluginRegistry();
    registry.register({
      name: "base",
      keys: ["x"],
      stage: "prepare",
      contribute: (key, authoredStops, track) => {
        calls.push([key, authoredStops, track, Object.isFrozen(track)]);
        return undefined;
      },
      compose,
    });
    registry.resolveForKeyframes({ x: stops(1) }, "track.keyframes", {
      id: "hero/arm",
      duration: 2,
    });
    expect(calls).toEqual([
      [
        "x",
        [
          { p: 0, v: 1 },
          { p: 1, v: 2 },
        ],
        { id: "hero/arm", duration: 2 },
        true,
      ],
    ]);
  });
  it("F-9 contributes per grouped leaf and reports the authored path", () => {
    const calls: unknown[] = [];
    const registry = new PluginRegistry();
    registry.register({
      name: "fk",
      keys: ["boneLength"],
      stage: "prepare",
      contribute: (key, authoredStops) => {
        calls.push([key, authoredStops]);
        throw new Error("contribution refused");
      },
      compose,
    });
    const authored = { fk: { boneLength: stops(1) } };
    const resolved = registry.resolveForKeyframes(authored, "track.keyframes");
    // Real stops, per leaf. A group handed to the hook whole reads as an empty stop list, so the
    // hook would be called with nothing to contribute from.
    expect(calls).toEqual([["boneLength", stops(1).stops]]);
    expect(resolved.diagnostics[0]?.ruleId).toBe("plugin-contribution-failure");
    expect(resolved.diagnostics[0]?.path).toBe("track.keyframes.fk.boneLength");
  });
  it("preserves both keyframes and tweenVars from one explicit contribution", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "derived",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ keyframes: { derived: stops(4) }, tweenVars: { overwrite: "auto" } }),
      compose,
    });
    registry.register({ name: "derived-owner", keys: ["derived"], compose });
    const resolved = registry.resolveForKeyframes({ x: stops(1) });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.preparation.keyframes).toEqual({ derived: stops(4) });
    expect(resolved.preparation.tweenVars).toEqual({ overwrite: "auto" });
  });
  it("runs exactly one predicate owner instead of allowing last-write-wins", () => {
    const registry = new PluginRegistry();
    const first = vi.fn(() => ({
      keyframes: { derived: stops(1) },
      tweenVars: { overwrite: "auto" },
    }));
    const second = vi.fn(() => ({
      keyframes: { derived: stops(2) },
      tweenVars: { overwrite: "all" },
    }));
    registry.register({
      name: "first",
      claimsKey: (key) => key === "x",
      stage: "prepare",
      contribute: first,
      compose,
    });
    registry.register({
      name: "second",
      claimsKey: (key) => key === "x",
      stage: "prepare",
      contribute: second,
      compose,
    });
    registry.register({ name: "derived-owner", keys: ["derived"], compose });
    const resolved = registry.resolveForKeyframes({ x: stops(1) });
    expect(resolved.diagnostics).toEqual([]);
    expect(first).toHaveBeenCalledOnce();
    expect(second).not.toHaveBeenCalled();
    expect(resolved.preparation).toEqual({
      keyframes: { derived: stops(1) },
      tweenVars: { overwrite: "auto" },
    });
  });
  it("rejects malformed contributed stops instead of installing them", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "bad",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({
        keyframes: {
          derived: {
            stops: [
              { p: 0.8, v: 1 },
              { p: 0.2, v: 2 },
            ],
          },
        },
      }),
      compose,
    });
    registry.register({ name: "derived-owner", keys: ["derived"], compose });
    const resolved = registry.resolveForKeyframes({ x: stops(1) });
    expect(resolved.diagnostics.map(({ ruleId }) => ruleId)).toContain(
      "plugin-contribution-stop-order",
    );
    expect(resolved.preparation.keyframes).toEqual({});
  });
});
