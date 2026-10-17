import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import { compileTrackExecutionPlan } from "../../src/domain/execution-plan";
import {
  createTrackLeafCodec,
  decodePropertyKey,
  encodePropertyKey,
  type TrackLeafCodec,
} from "../../src/contract/leaf-codec";
import type { PluginDefinition } from "../../src/domain/plugins";

describe("Slice B3: Private entry/leaf codec and reverse index", () => {
  describe("Codec round-trip, injectivity, and adversarial pairs", () => {
    it("round-trips standard, equal, and prototype-looking identifiers", () => {
      const cases: readonly [compilerKey: string, leaf: string][] = [
        ["upper#1", "rotation"],
        ["fore#2", "rotation"],
        ["point#1", "point"], // equal entry and leaf names
        ["__proto__#1", "x"], // prototype-looking entry
        ["entry#1", "__proto__"], // prototype-looking leaf
        ["constructor#1", "toString"],
        ["arm#1", "length_2D"],
        ["bone#1", "alpha_🦴"], // unicode emoji
        ["0#1", "0"],
        ["", ""],
      ];

      const encodedSet = new Set<string>();

      for (const [cKey, leaf] of cases) {
        const encoded = encodePropertyKey(cKey, leaf);
        expect(encodedSet.has(encoded)).toBe(false);
        encodedSet.add(encoded);

        const [decodedKey, decodedLeaf] = decodePropertyKey(encoded);
        expect(decodedKey).toBe(cKey);
        expect(decodedLeaf).toBe(leaf);
      }
    });

    it("maintains injectivity across adversarial tuple pairs containing colons and numbers", () => {
      const pairs: readonly [string, string][] = [
        ["a:b", "c"],
        ["a", "b:c"],
        ["10", "20:30"],
        ["10:20", "30"],
        ["foo", "bar"],
        ["foo:bar", ""],
        ["", "foo:bar"],
      ];

      const encoded = pairs.map(([a, b]) => encodePropertyKey(a, b));
      const uniqueEncoded = new Set(encoded);
      expect(uniqueEncoded.size).toBe(pairs.length);

      for (let i = 0; i < pairs.length; i++) {
        const [origA, origB] = pairs[i]!;
        const [decA, decB] = decodePropertyKey(encoded[i]!);
        expect(decA).toBe(origA);
        expect(decB).toBe(origB);
      }
    });

    it("throws on malformed encoded property keys", () => {
      expect(() => decodePropertyKey("invalid")).toThrow(/Malformed encoded entry-leaf address/);
      expect(() => decodePropertyKey("-1:foo:bar")).toThrow(/Malformed length prefix/);
      expect(() => decodePropertyKey("5:abc:xyz")).toThrow(/Length mismatch/);
    });
  });

  describe("Address index, routing, and local bag decoding", () => {
    const pointPlugin: PluginDefinition = {
      name: "point",
      keys: ["rotation", "x", "y"],
      collect: { output: "points", run: () => ({}) },
    };

    const contribPlugin: PluginDefinition = {
      name: "contribPlugin",
      stage: "prepare",
      keys: ["base", "derivedOffset"],
      collect: { output: "pts", run: () => ({}) },
      contribute: (key, stops) => {
        if (key === "base" && stops.length > 0) {
          return {
            keyframes: {
              derivedOffset: 5,
            },
          };
        }
        return undefined;
      },
    };

    it("routes two independent same-named leaves without aliasing", () => {
      const registry = new PluginRegistry();
      registry.register(pointPlugin);

      const plan = compileTrackExecutionPlan({
        trackId: "armTrack",
        keyframes: [
          { upper: { plugin: "point", values: { rotation: 10, x: 5 } } },
          { fore: { plugin: "point", values: { rotation: 20, x: 15 } } },
        ],
        registry,
      });

      const codec = createTrackLeafCodec(plan);

      const upperRotKey = codec.encode(plan.entries[0]!.compilerKey, "rotation");
      const foreRotKey = codec.encode(plan.entries[1]!.compilerKey, "rotation");

      expect(upperRotKey).not.toBe(foreRotKey);
      expect(codec.hasProperty(upperRotKey)).toBe(true);
      expect(codec.hasProperty(foreRotKey)).toBe(true);

      const upperAddress = codec.getAddress(upperRotKey);
      expect(upperAddress?.entryId).toBe("upper");
      expect(upperAddress?.leaf).toBe("rotation");

      // Simulated timeline evaluated state
      const timelineState = {
        [upperRotKey]: 45,
        [foreRotKey]: 90,
      };

      const upperBag = codec.decodeEntryBag(timelineState, "upper");
      const foreBag = codec.decodeEntryBag(timelineState, "fore");

      expect(upperBag.rotation).toBe(45);
      expect(upperBag.x).toBe(5); // from static store
      expect(foreBag.rotation).toBe(90);
      expect(foreBag.x).toBe(15); // from static store

      // Assert no opaque keys escape into the public entry bags
      expect(Object.keys(upperBag)).toEqual(["x", "rotation"].sort());
      expect(Object.keys(foreBag)).toEqual(["x", "rotation"].sort());
      for (const k of Object.keys(upperBag)) {
        expect(k).not.toContain(":");
      }
    });

    it("preserves static zero versus missing property", () => {
      const registry = new PluginRegistry();
      registry.register(pointPlugin);

      const plan = compileTrackExecutionPlan({
        keyframes: [
          { hasZero: { plugin: "point", values: { x: 0 } } },
          { lacksProperty: { plugin: "point", values: { y: 10 } } },
        ],
        registry,
      });

      const codec = createTrackLeafCodec(plan);
      const staticValues = codec.getStaticValues();

      const hasZeroXKey = codec.encode(plan.entries[0]!.compilerKey, "x");
      expect(staticValues[hasZeroXKey]).toBe(0);

      const bagHasZero = codec.decodeEntryBag({}, "hasZero");
      const bagLacks = codec.decodeEntryBag({}, "lacksProperty");

      expect(bagHasZero.x).toBe(0);
      expect(Object.hasOwn(bagHasZero, "x")).toBe(true);

      expect(Object.hasOwn(bagLacks, "x")).toBe(false);
      expect(bagLacks.x).toBeUndefined();
      expect(bagLacks.y).toBe(10);
    });

    it("compiles percent maps for animated leaves through the same codec", () => {
      const registry = new PluginRegistry();
      registry.register(pointPlugin);

      const plan = compileTrackExecutionPlan({
        keyframes: [
          {
            joint: {
              plugin: "point",
              values: {
                rotation: [
                  { p: 0, v: 0 },
                  { p: 0.5, v: 45 },
                  { p: 1, v: 90 },
                ],
              },
            },
          },
        ],
        registry,
      });

      const codec = createTrackLeafCodec(plan);
      const compiled = codec.compileTimelineKeyframes();

      expect(compiled.diagnostics).toEqual([]);
      expect(compiled.properties).toHaveLength(1);

      const rotPropKey = codec.encode(plan.entries[0]!.compilerKey, "rotation");
      expect(compiled.properties[0]?.key).toBe(rotPropKey);
      expect(compiled.initial[rotPropKey]).toBe(0);
      expect(compiled.map["0%"]?.[rotPropKey]).toBe(0);
      expect(compiled.map["50%"]?.[rotPropKey]).toBe(45);
      expect(compiled.map["100%"]?.[rotPropKey]).toBe(90);
    });

    it("routes contributed leaves through the same codec and address index", () => {
      const registry = new PluginRegistry();
      registry.register(contribPlugin);

      const plan = compileTrackExecutionPlan({
        keyframes: [
          {
            cNode: {
              plugin: "contribPlugin",
              values: {
                base: [
                  { p: 0, v: 1 },
                  { p: 1, v: 2 },
                ],
              },
            },
          },
        ],
        registry,
      });

      const codec = createTrackLeafCodec(plan);
      const derivedKey = codec.encode(plan.entries[0]!.compilerKey, "derivedOffset");

      expect(codec.hasProperty(derivedKey)).toBe(true);
      const addr = codec.getAddress(derivedKey);
      expect(addr?.isContributed).toBe(true);
      expect(addr?.isStatic).toBe(true);

      const bag = codec.decodeEntryBag({}, "cNode");
      expect(bag.derivedOffset).toBe(5);
    });

    it("encodes live overlays into flat interpolator keys", () => {
      const registry = new PluginRegistry();
      registry.register(pointPlugin);

      const plan = compileTrackExecutionPlan({
        keyframes: [
          { upper: { plugin: "point", values: { rotation: 0 } } },
          { fore: { plugin: "point", values: { rotation: 0 } } },
        ],
        registry,
      });

      const codec = createTrackLeafCodec(plan);
      const overlay = codec.encodeOverlay({
        upper: { rotation: 120 },
        fore: { rotation: 60 },
      });

      const upperRotKey = codec.encode(plan.entries[0]!.compilerKey, "rotation");
      const foreRotKey = codec.encode(plan.entries[1]!.compilerKey, "rotation");

      expect(overlay[upperRotKey]).toBe(120);
      expect(overlay[foreRotKey]).toBe(60);
    });

    it("replaces codec and reverse index atomically on recompilation after reorder or removal", () => {
      const registry = new PluginRegistry();
      registry.register(pointPlugin);

      // Generation 1: upper, fore
      const planGen1 = compileTrackExecutionPlan({
        generation: 1,
        keyframes: [
          { upper: { plugin: "point", values: { rotation: 10 } } },
          { fore: { plugin: "point", values: { rotation: 20 } } },
        ],
        registry,
      });
      const codecGen1: TrackLeafCodec = createTrackLeafCodec(planGen1);

      // Generation 2: remove upper, add hand
      const planGen2 = compileTrackExecutionPlan({
        generation: 2,
        keyframes: [
          { fore: { plugin: "point", values: { rotation: 20 } } },
          { hand: { plugin: "point", values: { rotation: 30 } } },
        ],
        registry,
      });
      const codecGen2: TrackLeafCodec = createTrackLeafCodec(planGen2);

      expect(codecGen1.generation).toBe(1);
      expect(codecGen2.generation).toBe(2);

      const upperKeyGen1 = codecGen1.encode(planGen1.entries[0]!.compilerKey, "rotation");
      expect(codecGen1.hasProperty(upperKeyGen1)).toBe(true);
      // Removed entry upper does not exist in Gen 2 codec
      expect(codecGen2.hasProperty(upperKeyGen1)).toBe(false);

      const handKeyGen2 = codecGen2.encode(planGen2.entries[1]!.compilerKey, "rotation");
      expect(codecGen2.hasProperty(handKeyGen2)).toBe(true);
      expect(codecGen1.hasProperty(handKeyGen2)).toBe(false);

      // Decoded state from Gen 2 contains only fore and hand
      const stateGen2 = { [handKeyGen2]: 35 };
      const bagsGen2 = codecGen2.decodeEvaluatedState(stateGen2);
      expect(bagsGen2.has("upper")).toBe(false);
      expect(bagsGen2.get("hand")?.rotation).toBe(35);
      expect(bagsGen2.get("fore")?.rotation).toBe(20);
    });
  });
});
