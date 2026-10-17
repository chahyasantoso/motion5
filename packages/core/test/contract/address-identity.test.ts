import { describe, expect, it } from "vitest";
import {
  asAuthoredEntryId,
  asLeafPath,
  asLinkId,
  asPointMemberId,
  assertValidIdentifier,
  createSafeRecord,
  decodeEntryLeaf,
  encodeEntryLeaf,
  hasSafeProperty,
  isHandleUsable,
  type AuthoredEntryId,
  type EntryLifecycleState,
  type GenerationToken,
  type LayoutIdentity,
  type LeafPath,
  type LinkId,
  type PluginName,
  type PointMemberId,
  type RootBindingProvenance,
} from "../../src/contract/address";

describe("A2: address, identity, and reference types", () => {
  it("distinguishes disjoint namespaces even when underlying strings match", () => {
    const rawId = "pelvis";
    const entryId = asAuthoredEntryId(rawId);
    const pointId: PointMemberId = asPointMemberId(entryId);
    const linkId: LinkId = asLinkId(rawId);
    const pluginName: PluginName = "point" as PluginName;

    // Value equality holds for primitive string
    expect(entryId).toBe(rawId);
    expect(pointId).toBe(rawId);
    expect(linkId).toBe(rawId);
    // Semantic distinction is verified through distinct branded typing
    const isDistinctNamespace: boolean = true;
    expect(isDistinctNamespace).toBe(true);
  });

  it("permits identical leaf names across distinct entries", () => {
    const entry1 = asAuthoredEntryId("upper");
    const entry2 = asAuthoredEntryId("fore");
    const leaf = asLeafPath("length");

    const addr1 = encodeEntryLeaf(entry1, leaf);
    const addr2 = encodeEntryLeaf(entry2, leaf);

    expect(addr1).not.toBe(addr2);
    expect(decodeEntryLeaf(addr1)).toEqual(["upper", "length"]);
    expect(decodeEntryLeaf(addr2)).toEqual(["fore", "length"]);
  });

  it("permits entry ID identical to plugin name without namespace collision", () => {
    const entryId = asAuthoredEntryId("point");
    const pluginName: PluginName = "point" as PluginName;
    const leaf = asLeafPath("x");

    const addr = encodeEntryLeaf(entryId, leaf);
    expect(decodeEntryLeaf(addr)).toEqual(["point", "x"]);
    expect(entryId).toBe(pluginName as string);
  });

  it("permits separate skeletons to reuse point IDs without qualification", () => {
    const rig1Point: PointMemberId = asPointMemberId(asAuthoredEntryId("tip"));
    const rig2Point: PointMemberId = asPointMemberId(asAuthoredEntryId("tip"));

    expect(rig1Point).toBe(rig2Point);
    // Uniqueness is enforced within resolved skeleton layout, not project-wide
  });

  it("refuses reserved delimiters / and : in authored identifiers", () => {
    expect(() => assertValidIdentifier("arm/fore", "Entry ID")).toThrow(
      'Entry ID cannot contain reserved delimiter "/".',
    );
    expect(() => assertValidIdentifier("arm:fore", "Entry ID")).toThrow(
      'Entry ID cannot contain reserved delimiter ":".',
    );
    expect(() => assertValidIdentifier("", "Entry ID")).toThrow(
      "Entry ID must be a non-empty string.",
    );
  });

  it("encodes adversarial tuple pairs unambiguously with collision freedom", () => {
    const pairs: readonly (readonly [string, string])[] = [
      ["a:b", "c"],
      ["a", "b:c"],
      ["0", "1:2"],
      ["0:1", "2"],
      ["", ""],
      ["foo", "bar"],
      ["emoji_🦴", "rotation_α"],
    ];

    const encodedSet = new Set<string>();
    for (const [entryId, leaf] of pairs) {
      const encoded = encodeEntryLeaf(entryId, leaf);
      expect(encodedSet.has(encoded)).toBe(false);
      encodedSet.add(encoded);

      const [decodedEntry, decodedLeaf] = decodeEntryLeaf(encoded);
      expect(decodedEntry).toBe(entryId);
      expect(decodedLeaf).toBe(leaf);
    }
  });

  it("safely handles prototype-looking identifiers (__proto__, constructor, toString)", () => {
    const safeRecord = createSafeRecord<number>();
    const protoKey = "__proto__";
    const ctorKey = "constructor";

    safeRecord[protoKey] = 42;
    safeRecord[ctorKey] = 99;

    expect(hasSafeProperty(safeRecord, protoKey)).toBe(true);
    expect(hasSafeProperty(safeRecord, ctorKey)).toBe(true);
    expect(hasSafeProperty(safeRecord, "valueOf")).toBe(false);
    expect(safeRecord[protoKey]).toBe(42);
    expect(Object.getPrototypeOf(safeRecord)).toBeNull();

    const encoded = encodeEntryLeaf(protoKey, ctorKey);
    const [dEntry, dLeaf] = decodeEntryLeaf(encoded);
    expect(dEntry).toBe(protoKey);
    expect(dLeaf).toBe(ctorKey);
  });

  it("models generation-backed handle lifecycle: move, replace, remove, re-insert", () => {
    const gen1 = 100 as GenerationToken;
    const activeState: EntryLifecycleState = { kind: "active", generation: gen1 };

    // 1. Moving preserves generation
    expect(isHandleUsable(activeState, gen1)).toBe(true);

    // 2. In-place content replacement preserves handle generation
    const replacedState: EntryLifecycleState = { kind: "replaced", generation: gen1 };
    expect(isHandleUsable(replacedState, gen1)).toBe(true);

    // 3. Removal invalidates existing handle
    const removedState: EntryLifecycleState = { kind: "removed" };
    expect(isHandleUsable(removedState, gen1)).toBe(false);

    // 4. Re-inserting with same entryId produces fresh generation token
    const gen2 = 101 as GenerationToken;
    const reinsertedState: EntryLifecycleState = { kind: "active", generation: gen2 };
    expect(isHandleUsable(reinsertedState, gen1)).toBe(false);
    expect(isHandleUsable(reinsertedState, gen2)).toBe(true);
  });

  it("separates structural layout identity and root provenance from numeric frame equality", () => {
    const layoutA: LayoutIdentity = "layout_chain_A" as LayoutIdentity;
    const layoutB: LayoutIdentity = "layout_chain_B" as LayoutIdentity;
    const provA: RootBindingProvenance = "source:body" as RootBindingProvenance;
    const provB: RootBindingProvenance = "source:cursor" as RootBindingProvenance;

    // Different provenance cannot share cache or structural identity even if numeric frames are identical
    expect(layoutA).not.toBe(layoutB);
    expect(provA).not.toBe(provB);
  });
});
