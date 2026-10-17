import { describe, expect, it } from "vitest";
import type { CacheProvider, CacheSnapshot, CacheSpec, CacheWrite } from "../../src/domain/cache";
import {
  createAggressiveEvictingCacheProvider,
  createBoundedCacheProvider,
  DEFAULT_CACHE_PROVIDER,
  NO_CACHE_PROVIDER,
} from "../../src/domain/cache-providers";

describe("Slice B7: Cache provider conformance suite", () => {
  it("B7-1: fresh state creates empty table where lookup misses", () => {
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 3 };
    const snapshot = DEFAULT_CACHE_PROVIDER.create(spec);

    const lookup = snapshot.lookup("slot1", "k1");
    expect(lookup.kind).toBe("miss");
  });

  it("B7-2: hit/miss including stored undefined value", () => {
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 3 };
    const snap1 = DEFAULT_CACHE_PROVIDER.create<string, unknown>(spec);

    const snap2 = snap1.remember([
      { slot: "normal", key: "k1", value: "val1" },
      { slot: "undef", key: "k2", value: undefined },
    ]);

    const hitNormal = snap2.lookup("normal", "k1");
    expect(hitNormal).toEqual({ kind: "hit", value: "val1" });

    const hitUndef = snap2.lookup("undef", "k2");
    expect(hitUndef.kind).toBe("hit");
    if (hitUndef.kind === "hit") {
      expect(hitUndef.value).toBeUndefined();
    }

    const missKey = snap2.lookup("normal", "other");
    expect(missKey.kind).toBe("miss");

    const missSlot = snap2.lookup("missing", "k1");
    expect(missSlot.kind).toBe("miss");
  });

  it("B7-3: exact signed-zero equality distinguishes +0 and -0", () => {
    const spec: CacheSpec<number> = { equals: (a, b) => Object.is(a, b), maxSlots: 2 };
    const snap1 = DEFAULT_CACHE_PROVIDER.create<number, string>(spec);

    const snap2 = snap1.remember([{ slot: "zero", key: +0, value: "positive-zero" }]);

    const hitPositive = snap2.lookup("zero", +0);
    expect(hitPositive).toEqual({ kind: "hit", value: "positive-zero" });

    const missNegative = snap2.lookup("zero", -0);
    expect(missNegative.kind).toBe("miss");
  });

  it("B7-4: validates finite positive integer capacity", () => {
    const invalidSlots = [0, -1, -5, NaN, Infinity, -Infinity, 1.5, "2" as any];
    for (const maxSlots of invalidSlots) {
      expect(() => DEFAULT_CACHE_PROVIDER.create({ equals: (a, b) => a === b, maxSlots })).toThrow(
        TypeError,
      );
    }

    expect(() => DEFAULT_CACHE_PROVIDER.create({ equals: null as any, maxSlots: 2 })).toThrow(
      TypeError,
    );
  });

  it("B7-5: slot replacement preserves insertion position and evicts oldest slot", () => {
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 2 };
    const snap1 = DEFAULT_CACHE_PROVIDER.create<string, number>(spec);

    // Insert slots "a" then "b"
    const snap2 = snap1.remember([
      { slot: "a", key: "ka", value: 1 },
      { slot: "b", key: "kb", value: 2 },
    ]);

    // Replace slot "a" in place: preserves "a" as oldest position
    const snap3 = snap2.remember([{ slot: "a", key: "ka", value: 10 }]);
    expect(snap3.lookup("a", "ka")).toEqual({ kind: "hit", value: 10 });
    expect(snap3.lookup("b", "kb")).toEqual({ kind: "hit", value: 2 });

    // Inserting new slot "c" should evict "a" (since "a" was the oldest inserted slot)
    const snap4 = snap3.remember([{ slot: "c", key: "kc", value: 3 }]);
    expect(snap4.lookup("a", "ka").kind).toBe("miss");
    expect(snap4.lookup("b", "kb")).toEqual({ kind: "hit", value: 2 });
    expect(snap4.lookup("c", "kc")).toEqual({ kind: "hit", value: 3 });
  });

  it("B7-6: ordered, duplicate, and empty write batches", () => {
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 2 };
    const snap1 = DEFAULT_CACHE_PROVIDER.create<string, string>(spec);

    // Empty batch preserves snapshot identity
    const emptySnap = snap1.remember([]);
    expect(emptySnap).toBe(snap1);

    // Later write to same slot in same batch wins
    const snap2 = snap1.remember([
      { slot: "item", key: "k1", value: "first" },
      { slot: "item", key: "k2", value: "second" },
    ]);
    expect(snap2.lookup("item", "k1").kind).toBe("miss");
    expect(snap2.lookup("item", "k2")).toEqual({ kind: "hit", value: "second" });
  });

  it("B7-7: batch atomicity and one-copy instrumentation", () => {
    let copyCount = 0;
    const provider = createBoundedCacheProvider({ onMapCopy: () => copyCount++ });
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 5 };
    const snap1 = provider.create<string, number>(spec);

    // Batch with multiple writes copies map exactly once
    const snap2 = snap1.remember([
      { slot: "s1", key: "k1", value: 1 },
      { slot: "s2", key: "k2", value: 2 },
      { slot: "s3", key: "k3", value: 3 },
    ]);
    expect(copyCount).toBe(1);
    expect(snap2.lookup("s1", "k1")).toEqual({ kind: "hit", value: 1 });
    expect(snap2.lookup("s2", "k2")).toEqual({ kind: "hit", value: 2 });
    expect(snap2.lookup("s3", "k3")).toEqual({ kind: "hit", value: 3 });

    // Invalid item in batch throws without modifying snapshot or copying map
    expect(() => snap2.remember([{ slot: 123 as any, key: "k", value: 4 }])).toThrow(TypeError);
    expect(copyCount).toBe(1);
    expect(snap2.lookup("s1", "k1")).toEqual({ kind: "hit", value: 1 });
  });

  it("B7-8: lookup purity and old snapshot stability", () => {
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 2 };
    const snap1 = DEFAULT_CACHE_PROVIDER.create<string, number>(spec);
    const snap2 = snap1.remember([{ slot: "s1", key: "k1", value: 100 }]);

    // Multiple lookups do not mutate anything
    expect(snap2.lookup("s1", "k1")).toEqual({ kind: "hit", value: 100 });
    expect(snap2.lookup("s1", "k1")).toEqual({ kind: "hit", value: 100 });
    expect(snap2.lookup("s2", "k2").kind).toBe("miss");

    // Writing snap3 does not mutate snap2 or snap1
    const snap3 = snap2.remember([{ slot: "s2", key: "k2", value: 200 }]);
    expect(snap1.lookup("s1", "k1").kind).toBe("miss");
    expect(snap2.lookup("s2", "k2").kind).toBe("miss");
    expect(snap3.lookup("s1", "k1")).toEqual({ kind: "hit", value: 100 });
    expect(snap3.lookup("s2", "k2")).toEqual({ kind: "hit", value: 200 });
  });

  it("B7-9: caller write array and object alias safety", () => {
    const spec: CacheSpec<{ id: number }> = {
      equals: (a, b) => a.id === b.id,
      maxSlots: 2,
    };
    const snap1 = DEFAULT_CACHE_PROVIDER.create<{ id: number }, { count: number }>(spec);

    const mutableKey = { id: 1 };
    const mutableValue = { count: 10 };
    const writes: CacheWrite<{ id: number }, { count: number }>[] = [
      { slot: "s", key: mutableKey, value: mutableValue },
    ];

    const snap2 = snap1.remember(writes);
    // Mutate caller write array
    writes.push({ slot: "s2", key: { id: 2 }, value: { count: 20 } });
    writes[0] = { slot: "mutated", key: { id: 99 }, value: { count: 99 } };

    expect(snap2.lookup("s", { id: 1 })).toEqual({ kind: "hit", value: mutableValue });
    expect(snap2.lookup("s2", { id: 2 }).kind).toBe("miss");
    expect(snap2.lookup("mutated", { id: 99 }).kind).toBe("miss");
  });

  it("B7-10: throwing equals propagates and does not silently convert to miss", () => {
    const throwingSpec: CacheSpec<string> = {
      equals: () => {
        throw new Error("Deliberate equality failure.");
      },
      maxSlots: 2,
    };
    const snap = DEFAULT_CACHE_PROVIDER.create<string, number>(throwingSpec);
    const snapWithEntry = snap.remember([{ slot: "s", key: "k", value: 1 }]);

    expect(() => snapWithEntry.lookup("s", "k")).toThrow("Deliberate equality failure.");
  });

  it("B7-11: candidate forks from same committed state remain isolated", () => {
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 3 };
    const committed = DEFAULT_CACHE_PROVIDER.create<string, string>(spec).remember([
      { slot: "base", key: "kb", value: "base-val" },
    ]);

    // Fork candidate A
    const candidateA = committed.remember([{ slot: "fork", key: "k", value: "branch-a" }]);
    // Fork candidate B
    const candidateB = committed.remember([{ slot: "fork", key: "k", value: "branch-b" }]);

    expect(candidateA.lookup("fork", "k")).toEqual({ kind: "hit", value: "branch-a" });
    expect(candidateB.lookup("fork", "k")).toEqual({ kind: "hit", value: "branch-b" });
    expect(committed.lookup("fork", "k").kind).toBe("miss");
  });

  it("B7-12: NO_CACHE_PROVIDER conforms to port, validates spec, and always misses", () => {
    expect(() => NO_CACHE_PROVIDER.create({ equals: (a, b) => a === b, maxSlots: 0 })).toThrow(
      TypeError,
    );

    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 2 };
    const snapshot = NO_CACHE_PROVIDER.create<string, number>(spec);

    const remembered = snapshot.remember([{ slot: "s", key: "k", value: 42 }]);
    expect(remembered.lookup("s", "k").kind).toBe("miss");
  });

  it("B7-13: evicting test provider conforms to port and aggressively evicts", () => {
    const evictingProvider = createAggressiveEvictingCacheProvider();
    const spec: CacheSpec<string> = { equals: (a, b) => a === b, maxSlots: 5 };
    const snap1 = evictingProvider.create<string, number>(spec);

    const snap2 = snap1.remember([
      { slot: "s1", key: "k1", value: 1 },
      { slot: "s2", key: "k2", value: 2 },
    ]);

    // Capacity capped to 1: only latest slot retained
    expect(snap2.lookup("s1", "k1").kind).toBe("miss");
    expect(snap2.lookup("s2", "k2")).toEqual({ kind: "hit", value: 2 });
  });
});
