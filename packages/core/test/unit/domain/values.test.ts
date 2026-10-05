import { describe, expect, it } from "vitest";
import { equalValues, freezeValue } from "../../../src/domain/values";
import type { ImmutableValue } from "../../../src/domain/values";
import { Track } from "../../../src/domain/track";
import { createFakeInterpolator } from "../../../src/testing/fakes";
import { GraphPublisher, type PublisherNode } from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import { createPlugin, resolvePlugins } from "../../helpers/resolved-plugins";

// N3: null must not be a leaf of the declared immutable domain.
// @ts-expect-error null is not an immutable value
const nullLeaf: ImmutableValue = null;
void nullLeaf;

describe("immutable value snapshots", () => {
  it("N1 refuses nested null while accepting every label leaf", () => {
    expect(() => freezeValue({ a: null } as never)).toThrow(/Unsupported immutable value/);
    expect(freezeValue({ a: "idle", b: true, c: 0 })).toEqual({ a: "idle", b: true, c: 0 });
  });

  it("N2 Track and graph publication refuse null composition by the same rule", () => {
    const track = new Track({
      nodeId: "~/tag",
      interpolator: createFakeInterpolator(),
      plugins: resolvePlugins(
        // Runtime plugins can violate their declaration; the publisher must still refuse.
        // @ts-expect-error deliberately invalid composition output
        createPlugin("tag", () => ({ label: null })),
      ),
    });
    try {
      expect(() => track.compose()).toThrow(/not renderer-neutral/);
      const registry = new PatchRegistry();
      const publisher = new GraphPublisher(registry);
      for (const compose of [
        () => {
          const result = track.compose();
          return { values: result.values, sourceProgress: 0, sourceRevisions: {} };
        },
        () => ({ values: { label: null }, sourceProgress: 0, sourceRevisions: {} }),
      ]) {
        const node: PublisherNode = {
          id: "~/tag",
          owner: "free",
          authoredIndex: 0,
          track: { id: "tag" },
          edges: [],
          compose,
        };
        const batch = publisher.flush(
          {
            nodes: [node],
            nodeById: { "~/tag": node },
            dependants: { "~/tag": [] },
            order: ["~/tag"],
            diagnostics: [],
          },
          ["~/tag"],
          1,
        );
        const patch = batch.patches[0];
        if (patch?.status !== "error") throw new Error(`Expected error, got ${patch?.status}.`);
        expect(patch.diagnostics[0]?.ruleId).toBe("composition-output-shape");
      }
    } finally {
      track.dispose();
    }
  });

  it("deeply freezes nested records and arrays", () => {
    const value = freezeValue({ transform: { x: 10 }, opacity: [0, 1] });

    expect(Object.isFrozen(value)).toBe(true);
    expect(Object.isFrozen(value.transform)).toBe(true);
    expect(Object.isFrozen(value.opacity)).toBe(true);
    expect(() => {
      "use strict";
      (value.transform as { x: number }).x = 20;
    }).toThrow(TypeError);
  });

  it("is idempotent for an already frozen value", () => {
    const value = freezeValue({ x: 1 });
    expect(freezeValue(value)).toBe(value);
  });

  it("rejects cycles without recursing forever", () => {
    const value: { self?: unknown } = {};
    value.self = value;
    expect(() => freezeValue(value as never)).toThrow(/cycles/);
  });

  it("rejects unsupported mutable values and non-finite numbers", () => {
    expect(() => freezeValue(new Date() as never)).toThrow(/Unsupported/);
    expect(() => freezeValue({ value: Number.NaN } as never)).toThrow(/finite/);
  });

  it("compares records independent of key insertion order", () => {
    expect(equalValues({ b: 2, a: 1 }, { a: 1, b: 2 })).toBe(true);
    expect(equalValues({ a: -0 }, { a: 0 })).toBe(false);
    expect(equalValues({ a: Number.NaN }, { a: Number.NaN })).toBe(true);
    expect(equalValues([1, 2], [2, 1])).toBe(false);
  });

  it("does not confuse repeated references with cycles", () => {
    const shared = { x: 1 };
    expect(equalValues({ a: shared, b: shared }, { a: { x: 1 }, b: { x: 1 } })).toBe(true);
  });
});
