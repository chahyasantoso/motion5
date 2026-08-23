import { describe, expect, it, vi } from "vitest";
import type { AuthoredStop } from "../../../src/contract/v5";
import type { ImmutableRecord } from "../../../src/domain/values";
import { PluginRegistry } from "../../../src/domain/plugins";
const stops = (value: number): { readonly stops: readonly AuthoredStop[] } => [
  { p: 0, v: value },
  { p: 1, v: value + 1 },
];
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
    const authored = { fk: { values: { boneLength: stops(1) } } };
    const resolved = registry.resolveForKeyframes(authored, "track.keyframes");
    // Real stops, per leaf. A group handed to the hook whole reads as an empty stop list, so the
    // hook would be called with nothing to contribute from.
    expect(calls).toEqual([["boneLength", stops(1).stops]]);
    expect(resolved.diagnostics[0]?.ruleId).toBe("plugin-contribution-failure");
    expect(resolved.diagnostics[0]?.path).toBe("track.keyframes.fk.values.boneLength");
  });
  it("N-6 runs the contribution hook of the plugin that owns the entry", () => {
    const shared = new PluginRegistry();
    const sharedHook = vi.fn(() => ({ tweenVars: { ease: "none" } }));
    shared.register({
      name: "fk",
      keys: ["rotation"],
      stage: "prepare",
      contribute: sharedHook,
      compose,
    });
    shared.register({ name: "transform", keys: ["rotation"], compose });
    // `transform` owns the leaf its own group named and has no hook, so nothing is contributed.
    // Resolving the hook through a global key map instead runs `fk`'s, which is the wrong plugin
    // for this entry however the two agreed under one owner per key. See ADR-043.
    const values = { rotation: stops(1) };
    const grouped = shared.resolveForKeyframes({ transform: { values } });
    expect(grouped.diagnostics).toEqual([]);
    expect(sharedHook).not.toHaveBeenCalled();
    expect(grouped.preparation.tweenVars).toEqual({});

    const orphan = new PluginRegistry();
    const orphanHook = vi.fn(() => ({ tweenVars: { ease: "none" } }));
    orphan.register({
      name: "fk",
      keys: ["length"],
      stage: "prepare",
      contribute: orphanHook,
      compose,
    });
    // The group named no registered plugin, so the entry has no owner at all and there is no hook
    // to run. Preparation must not contribute on behalf of a rejected entry.
    const rejected = orphan.resolveForKeyframes({ mystery: { values: { length: stops(1) } } });
    expect(rejected.diagnostics.map(({ ruleId }) => ruleId)).toEqual(["plugin-unknown-key"]);
    expect(orphanHook).not.toHaveBeenCalled();
    expect(rejected.preparation.tweenVars).toEqual({});
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
          derived: [
            { p: 0.8, v: 1 },
            { p: 0.2, v: 2 },
          ],
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
