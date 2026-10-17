import { describe, expect, it } from "vitest";
import { Engine, PluginRegistry, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import {
  asAuthoredEntryId,
  asPluginName,
  encodeBindingTuple,
  type DerivationEntryInventoryItem,
  type DerivationTrackInventory,
  type DerivationBinding,
} from "@motion5/core/plugin-api";
import {
  deriveChainLayout,
  type ChainDescriptor,
  type ChainDescriptorPayload,
} from "../../src/chain-layout";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";

function makeInventory(
  trackId: string,
  entries: readonly {
    readonly entryId: string;
    readonly plugin: string;
    readonly bindings?: readonly {
      readonly slot: string;
      readonly source: string;
    }[];
  }[],
): DerivationTrackInventory {
  const items: DerivationEntryInventoryItem[] = [];
  const entriesById = new Map<string, DerivationEntryInventoryItem>();
  const declaredSources = new Set<string>();

  for (let i = 0; i < entries.length; i++) {
    const raw = entries[i]!;
    const entryId = asAuthoredEntryId(raw.entryId);
    const plugin = asPluginName(raw.plugin);
    const bindings: DerivationBinding[] = (raw.bindings ?? []).map((b) => {
      declaredSources.add(b.source);
      return {
        kind: "single" as const,
        qualifiedSource: b.source,
        entryId,
        slot: b.slot,
        authoredPath: `${trackId}.${entryId}.${b.slot}`,
        tupleKey: encodeBindingTuple(b.source, entryId, b.slot),
      };
    });

    const item: DerivationEntryInventoryItem = {
      entryId,
      plugin,
      order: i,
      valueKeys: ["length", "x", "y"],
      bindings,
    };
    items.push(item);
    entriesById.set(entryId, item);
  }

  return Object.freeze({
    trackId,
    entries: Object.freeze(items),
    entriesById,
    declaredSources,
  });
}

describe("Slice C2: Chain Layout and Root Policy Derivation", () => {
  it("derives a valid 1-point chain (FK data) with origin root policy", () => {
    const inventory = makeInventory("arm", [{ entryId: "p0", plugin: "point" }]);
    const result = deriveChainLayout(inventory);

    expect(result).toBeDefined();
    expect("capability" in (result as ChainDescriptor)).toBe(true);

    const desc = result as ChainDescriptor;
    expect(desc.capability).toBe("chain");
    expect(desc.source).toBe("arm");

    const payload = desc.payload;
    expect(payload.orderedPointIds).toEqual(["p0"]);
    expect(payload.parentIndices).toEqual([-1]);
    expect(payload.childAdjacency).toEqual([[]]);
    expect(payload.rootId).toBe("p0");
    expect(payload.leafIds).toEqual(["p0"]);
    expect(payload.pointIndexById["p0"]).toBe(0);
    expect(payload.locators).toHaveLength(1);
    expect(payload.locators[0]).toEqual({
      pointId: "p0",
      index: 0,
      sourceTrack: "arm",
      entryId: "p0",
      authoredPath: "arm.p0",
    });
    expect(payload.rootPolicy).toEqual({
      kind: "origin",
      hasRootEntry: false,
    });
    expect(typeof payload.layoutIdentity).toBe("string");
  });

  it("derives multi-point chain with sequential parent indices and child adjacency", () => {
    const inventory = makeInventory("leg", [
      { entryId: "hip", plugin: "point" },
      { entryId: "knee", plugin: "point" },
      { entryId: "ankle", plugin: "point" },
    ]);
    const desc = deriveChainLayout(inventory) as ChainDescriptor;

    expect(desc.payload.orderedPointIds).toEqual(["hip", "knee", "ankle"]);
    expect(desc.payload.parentIndices).toEqual([-1, 0, 1]);
    expect(desc.payload.childAdjacency).toEqual([[1], [2], []]);
    expect(desc.payload.rootId).toBe("hip");
    expect(desc.payload.leafIds).toEqual(["ankle"]);
    expect(desc.payload.pointIndexById["hip"]).toBe(0);
    expect(desc.payload.pointIndexById["knee"]).toBe(1);
    expect(desc.payload.pointIndexById["ankle"]).toBe(2);
  });

  it("produces identical point order and parents regardless of root entry position", () => {
    const invRootFirst = makeInventory("spine", [
      { entryId: "r", plugin: "root" },
      { entryId: "p0", plugin: "point" },
      { entryId: "p1", plugin: "point" },
      { entryId: "p2", plugin: "point" },
    ]);
    const invRootMiddle = makeInventory("spine", [
      { entryId: "p0", plugin: "point" },
      { entryId: "r", plugin: "root" },
      { entryId: "p1", plugin: "point" },
      { entryId: "p2", plugin: "point" },
    ]);
    const invRootLast = makeInventory("spine", [
      { entryId: "p0", plugin: "point" },
      { entryId: "p1", plugin: "point" },
      { entryId: "p2", plugin: "point" },
      { entryId: "r", plugin: "root" },
    ]);

    const descFirst = deriveChainLayout(invRootFirst) as ChainDescriptor;
    const descMiddle = deriveChainLayout(invRootMiddle) as ChainDescriptor;
    const descLast = deriveChainLayout(invRootLast) as ChainDescriptor;

    expect(descFirst.payload.orderedPointIds).toEqual(["p0", "p1", "p2"]);
    expect(descMiddle.payload.orderedPointIds).toEqual(["p0", "p1", "p2"]);
    expect(descLast.payload.orderedPointIds).toEqual(["p0", "p1", "p2"]);

    expect(descFirst.payload.parentIndices).toEqual([-1, 0, 1]);
    expect(descMiddle.payload.parentIndices).toEqual([-1, 0, 1]);
    expect(descLast.payload.parentIndices).toEqual([-1, 0, 1]);

    expect(descFirst.payload.layoutIdentity).toBe(descMiddle.payload.layoutIdentity);
    expect(descMiddle.payload.layoutIdentity).toBe(descLast.payload.layoutIdentity);
  });

  it("fails derivation when duplicate root entries are present", () => {
    const inventory = makeInventory("track", [
      { entryId: "r1", plugin: "root" },
      { entryId: "p0", plugin: "point" },
      { entryId: "r2", plugin: "root" },
    ]);
    const result = deriveChainLayout(inventory);

    expect(result).toBeDefined();
    expect("diagnostics" in (result as object)).toBe(true);
    const diagResult = result as { diagnostics: readonly { ruleId: string; message: string }[] };
    expect(diagResult.diagnostics[0]?.ruleId).toBe("derivation-failure");
    expect(diagResult.diagnostics[0]?.message).toMatch(/Duplicate root entries/);
  });

  it("fails derivation for root-only tracks without points", () => {
    const inventory = makeInventory("track", [{ entryId: "r0", plugin: "root" }]);
    const result = deriveChainLayout(inventory);

    expect(result).toBeDefined();
    expect("diagnostics" in (result as object)).toBe(true);
    const diagResult = result as { diagnostics: readonly { ruleId: string; message: string }[] };
    expect(diagResult.diagnostics[0]?.ruleId).toBe("derivation-failure");
    expect(diagResult.diagnostics[0]?.message).toMatch(/Root-only track/);
  });

  it("returns undefined for empty inventory or generic mixed tracks", () => {
    const emptyInv = makeInventory("empty", []);
    expect(deriveChainLayout(emptyInv)).toBeUndefined();

    const mixedInv = makeInventory("mixed", [
      { entryId: "p0", plugin: "point" },
      { entryId: "t0", plugin: "transform" },
    ]);
    expect(deriveChainLayout(mixedInv)).toBeUndefined();
  });

  it("safely handles permitted special IDs without prototype collisions", () => {
    const inventory = makeInventory("special", [
      { entryId: "__proto__", plugin: "point" },
      { entryId: "constructor", plugin: "point" },
      { entryId: "toString", plugin: "point" },
    ]);
    const desc = deriveChainLayout(inventory) as ChainDescriptor;

    expect(desc.payload.orderedPointIds).toEqual(["__proto__", "constructor", "toString"]);
    expect(desc.payload.pointIndexById["__proto__"]).toBe(0);
    expect(desc.payload.pointIndexById["constructor"]).toBe(1);
    expect(desc.payload.pointIndexById["toString"]).toBe(2);
    expect(Object.getPrototypeOf(desc.payload.pointIndexById)).toBeNull();
  });

  it("distinguishes unbound root from origin and bound root provenance in layoutIdentity", () => {
    const originInv = makeInventory("arm", [{ entryId: "p0", plugin: "point" }]);
    const unboundInv = makeInventory("arm", [
      { entryId: "p0", plugin: "point" },
      { entryId: "r0", plugin: "root" },
    ]);
    const boundInv1 = makeInventory("arm", [
      { entryId: "p0", plugin: "point" },
      {
        entryId: "r0",
        plugin: "root",
        bindings: [{ slot: "frame", source: "body" }],
      },
    ]);
    const boundInv2 = makeInventory("arm", [
      { entryId: "p0", plugin: "point" },
      {
        entryId: "r0",
        plugin: "root",
        bindings: [{ slot: "frame", source: "pelvis" }],
      },
    ]);

    const descOrigin = deriveChainLayout(originInv) as ChainDescriptor;
    const descUnbound = deriveChainLayout(unboundInv) as ChainDescriptor;
    const descBound1 = deriveChainLayout(boundInv1) as ChainDescriptor;
    const descBound2 = deriveChainLayout(boundInv2) as ChainDescriptor;

    expect(descOrigin.payload.rootPolicy.kind).toBe("origin");
    expect(descUnbound.payload.rootPolicy.kind).toBe("unbound");
    expect(descBound1.payload.rootPolicy.kind).toBe("bound");
    expect(descBound2.payload.rootPolicy.kind).toBe("bound");

    expect(descOrigin.payload.layoutIdentity).not.toBe(descUnbound.payload.layoutIdentity);
    expect(descUnbound.payload.layoutIdentity).not.toBe(descBound1.payload.layoutIdentity);
    expect(descBound1.payload.layoutIdentity).not.toBe(descBound2.payload.layoutIdentity);
  });

  it("point reorder alters parent indices and layoutIdentity", () => {
    const invA = makeInventory("chain", [
      { entryId: "p0", plugin: "point" },
      { entryId: "p1", plugin: "point" },
      { entryId: "p2", plugin: "point" },
    ]);
    const invB = makeInventory("chain", [
      { entryId: "p1", plugin: "point" },
      { entryId: "p0", plugin: "point" },
      { entryId: "p2", plugin: "point" },
    ]);

    const descA = deriveChainLayout(invA) as ChainDescriptor;
    const descB = deriveChainLayout(invB) as ChainDescriptor;

    expect(descA.payload.orderedPointIds).toEqual(["p0", "p1", "p2"]);
    expect(descB.payload.orderedPointIds).toEqual(["p1", "p0", "p2"]);

    expect(descA.payload.parentIndices).toEqual([-1, 0, 1]);
    expect(descB.payload.parentIndices).toEqual([-1, 0, 1]);

    expect(descA.payload.pointIndexById["p0"]).toBe(0);
    expect(descB.payload.pointIndexById["p0"]).toBe(1);

    expect(descA.payload.layoutIdentity).not.toBe(descB.payload.layoutIdentity);
  });

  it("integrates end-to-end with Engine and track.descriptors()", () => {
    const registry = new PluginRegistry();
    registry.registerAll([pointPlugin, rootPlugin]);

    const project = new Engine({
      plugins: registry,
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "m0",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "arm",
              keyframes: [
                { p0: { plugin: "point", values: { length: 10 } } },
                { p1: { plugin: "point", values: { length: 15 } } },
              ],
            },
          ],
        },
      ],
    });

    const armTrack = project.track("m0/arm");
    const descriptors = armTrack.descriptors;

    expect(descriptors).toHaveLength(1);
    const chainDesc = descriptors[0] as ChainDescriptor;
    expect(chainDesc.capability).toBe("chain");
    expect(chainDesc.source).toBe("m0/arm");
    expect(chainDesc.payload.orderedPointIds).toEqual(["p0", "p1"]);
    expect(chainDesc.payload.parentIndices).toEqual([-1, 0]);
    expect(chainDesc.payload.rootPolicy).toEqual({ kind: "origin", hasRootEntry: false });
  });
});
