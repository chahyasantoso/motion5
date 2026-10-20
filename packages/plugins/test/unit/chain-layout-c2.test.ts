import { describe, expect, it } from "vitest";
import { Engine, PluginRegistry, createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import {
  asAuthoredEntryId,
  asPluginName,
  encodeBindingTuple,
  none,
  type DerivationEntryInventoryItem,
  type DerivationTrackInventory,
  type DerivationBinding,
  type DeriveContext,
  type DeriveResult,
} from "@motion5/core/plugin-api";
import { deriveChainLayout, type ChainPayload } from "../../src/chain-layout";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";

function chainOf(result: DeriveResult): ChainPayload {
  if (result.status !== "derived" || result.capability !== "chain") {
    throw new Error(`expected a derived chain, got ${result.status}`);
  }
  return result.payload;
}

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
    const payload = chainOf(result);

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
    const payload = chainOf(deriveChainLayout(inventory));

    expect(payload.orderedPointIds).toEqual(["hip", "knee", "ankle"]);
    expect(payload.parentIndices).toEqual([-1, 0, 1]);
    expect(payload.childAdjacency).toEqual([[1], [2], []]);
    expect(payload.rootId).toBe("hip");
    expect(payload.leafIds).toEqual(["ankle"]);
    expect(payload.pointIndexById["hip"]).toBe(0);
    expect(payload.pointIndexById["knee"]).toBe(1);
    expect(payload.pointIndexById["ankle"]).toBe(2);
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

    const payloadFirst = chainOf(deriveChainLayout(invRootFirst));
    const payloadMiddle = chainOf(deriveChainLayout(invRootMiddle));
    const payloadLast = chainOf(deriveChainLayout(invRootLast));

    expect(payloadFirst.orderedPointIds).toEqual(["p0", "p1", "p2"]);
    expect(payloadMiddle.orderedPointIds).toEqual(["p0", "p1", "p2"]);
    expect(payloadLast.orderedPointIds).toEqual(["p0", "p1", "p2"]);

    expect(payloadFirst.parentIndices).toEqual([-1, 0, 1]);
    expect(payloadMiddle.parentIndices).toEqual([-1, 0, 1]);
    expect(payloadLast.parentIndices).toEqual([-1, 0, 1]);

    expect(payloadFirst.layoutIdentity).toBe(payloadMiddle.layoutIdentity);
    expect(payloadMiddle.layoutIdentity).toBe(payloadLast.layoutIdentity);
  });

  it("fails derivation when duplicate root entries are present", () => {
    const inventory = makeInventory("track", [
      { entryId: "r1", plugin: "root" },
      { entryId: "p0", plugin: "point" },
      { entryId: "r2", plugin: "root" },
    ]);
    const context: DeriveContext = {
      trackId: inventory.trackId ?? "track",
      entries: inventory.entries,
      inventory,
      read: () => {
        throw new Error("unexpected read");
      },
    };
    const result = rootPlugin.derive!(context);

    expect(result.status).toBe("refused");
    if (result.status === "refused") {
      expect(result.diagnostics[0]?.ruleId).toBe("derivation-failure");
      expect(result.diagnostics[0]?.message).toMatch(/Duplicate root entries/);
    }
  });

  it("returns none for root-only tracks without points", () => {
    const inventory = makeInventory("track", [{ entryId: "r0", plugin: "root" }]);
    expect(deriveChainLayout(inventory)).toEqual(none);
  });

  it("returns none when two roots plus one point are present", () => {
    const inventory = makeInventory("track", [
      { entryId: "r1", plugin: "root" },
      { entryId: "p0", plugin: "point" },
      { entryId: "r2", plugin: "root" },
    ]);
    expect(deriveChainLayout(inventory)).toEqual(none);
  });

  it("returns none for empty inventory or generic mixed tracks", () => {
    const emptyInv = makeInventory("empty", []);
    expect(deriveChainLayout(emptyInv)).toEqual(none);

    const mixedInv = makeInventory("mixed", [
      { entryId: "p0", plugin: "point" },
      { entryId: "t0", plugin: "transform" },
    ]);
    expect(deriveChainLayout(mixedInv)).toEqual(none);
  });

  it("safely handles permitted special IDs without prototype collisions", () => {
    const inventory = makeInventory("special", [
      { entryId: "__proto__", plugin: "point" },
      { entryId: "constructor", plugin: "point" },
      { entryId: "toString", plugin: "point" },
    ]);
    const payload = chainOf(deriveChainLayout(inventory));

    expect(payload.orderedPointIds).toEqual(["__proto__", "constructor", "toString"]);
    expect(payload.pointIndexById["__proto__"]).toBe(0);
    expect(payload.pointIndexById["constructor"]).toBe(1);
    expect(payload.pointIndexById["toString"]).toBe(2);
    expect(Object.getPrototypeOf(payload.pointIndexById)).toBeNull();
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

    const payloadOrigin = chainOf(deriveChainLayout(originInv));
    const payloadUnbound = chainOf(deriveChainLayout(unboundInv));
    const payloadBound1 = chainOf(deriveChainLayout(boundInv1));
    const payloadBound2 = chainOf(deriveChainLayout(boundInv2));

    expect(payloadOrigin.rootPolicy.kind).toBe("origin");
    expect(payloadUnbound.rootPolicy.kind).toBe("unbound");
    expect(payloadBound1.rootPolicy.kind).toBe("bound");
    expect(payloadBound2.rootPolicy.kind).toBe("bound");

    expect(payloadOrigin.layoutIdentity).not.toBe(payloadUnbound.layoutIdentity);
    expect(payloadUnbound.layoutIdentity).not.toBe(payloadBound1.layoutIdentity);
    expect(payloadBound1.layoutIdentity).not.toBe(payloadBound2.layoutIdentity);
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

    const payloadA = chainOf(deriveChainLayout(invA));
    const payloadB = chainOf(deriveChainLayout(invB));

    expect(payloadA.orderedPointIds).toEqual(["p0", "p1", "p2"]);
    expect(payloadB.orderedPointIds).toEqual(["p1", "p0", "p2"]);

    expect(payloadA.parentIndices).toEqual([-1, 0, 1]);
    expect(payloadB.parentIndices).toEqual([-1, 0, 1]);

    expect(payloadA.pointIndexById["p0"]).toBe(0);
    expect(payloadB.pointIndexById["p0"]).toBe(1);

    expect(payloadA.layoutIdentity).not.toBe(payloadB.layoutIdentity);
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
    const chainDesc = descriptors[0]!;
    expect(chainDesc.capability).toBe("chain");
    expect(chainDesc.source).toBe("m0/arm");
    const payload = chainDesc.payload as ChainPayload;
    expect(payload.orderedPointIds).toEqual(["p0", "p1"]);
    expect(payload.parentIndices).toEqual([-1, 0]);
    expect(payload.rootPolicy).toEqual({ kind: "origin", hasRootEntry: false });
  });
});
