import { describe, expect, it, vi } from "vitest";
import type {
  DerivationBinding,
  DerivationEntryInventoryItem,
  DerivationTrackInventory,
  DeriveContext,
  DeriveResult,
} from "@motion5/core/plugin-api";
import { diagnostic } from "@motion5/core/plugin-api";
import { asAuthoredEntryId, asPluginName, encodeBindingTuple } from "@motion5/core/plugin-api";
import type { ChainPayload, PointLocator } from "../../src/chain-layout";
import type { JoinedPayload } from "../../src/joined-layout";
import {
  readDynamicSkeleton,
  type DynamicSkeletonRead,
  type DynamicSkeletonView,
  type SkeletonRootRead,
} from "../../src/dynamic-skeleton";
import type { SkeletonFound } from "../../src/solve-contract";

const topology = vi.hoisted(() => ({
  deriveChainLayout: vi.fn(),
  deriveJoinedLayout: vi.fn(),
}));

vi.mock("../../src/chain-layout", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/chain-layout")>();
  topology.deriveChainLayout.mockImplementation(actual.deriveChainLayout);
  return { ...actual, deriveChainLayout: topology.deriveChainLayout };
});

vi.mock("../../src/joined-layout", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/joined-layout")>();
  topology.deriveJoinedLayout.mockImplementation(actual.deriveJoinedLayout);
  return { ...actual, deriveJoinedLayout: topology.deriveJoinedLayout };
});

const { deriveChainLayout } = await import("../../src/chain-layout");
const { deriveJoinedLayout } = await import("../../src/joined-layout");

function makeInventory(
  trackId: string,
  entries: readonly {
    readonly entryId: string;
    readonly plugin: string;
    readonly bindings?: readonly { readonly slot: string; readonly source: string }[];
  }[],
): DerivationTrackInventory {
  const items: DerivationEntryInventoryItem[] = [];
  const entriesById = new Map<string, DerivationEntryInventoryItem>();
  const declaredSources = new Set<string>();

  for (let index = 0; index < entries.length; index++) {
    const raw = entries[index]!;
    const entryId = asAuthoredEntryId(raw.entryId);
    const bindings: DerivationBinding[] = (raw.bindings ?? []).map((binding) => {
      declaredSources.add(binding.source);
      return {
        kind: "single" as const,
        qualifiedSource: binding.source,
        entryId,
        slot: binding.slot,
        authoredPath: `${trackId}.${entryId}.${binding.slot}`,
        tupleKey: encodeBindingTuple(binding.source, entryId, binding.slot),
      };
    });
    const item: DerivationEntryInventoryItem = {
      entryId,
      plugin: asPluginName(raw.plugin),
      order: index,
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

function makeChain(
  trackId: string,
  pointIds: readonly string[],
  rootKind?: "bound" | "unbound",
): ChainPayload {
  const entries: {
    entryId: string;
    plugin: string;
    bindings?: readonly { slot: string; source: string }[];
  }[] = [];
  if (rootKind === "bound") {
    entries.push({
      entryId: "root0",
      plugin: "root",
      bindings: [{ slot: "frame", source: "frame_src" }],
    });
  } else if (rootKind === "unbound") {
    entries.push({ entryId: "root0", plugin: "root" });
  }
  for (const pointId of pointIds) entries.push({ entryId: pointId, plugin: "point" });
  const result = deriveChainLayout(makeInventory(trackId, entries));
  if (result.status !== "derived" || result.capability !== "chain") {
    throw new Error(`expected chain layout, got ${result.status}`);
  }
  return result.payload;
}

function makeJoined(
  trackId: string,
  chains: readonly { readonly name: string; readonly pointIds: readonly string[] }[],
  links: readonly {
    readonly entryId: string;
    readonly chain: string;
    readonly parent?: string;
  }[],
  rootKind?: "bound" | "unbound",
): JoinedPayload {
  const chainPayloads = new Map<string, ChainPayload>(
    chains.map((chain) => [chain.name, makeChain(chain.name, chain.pointIds)]),
  );
  const entries: {
    entryId: string;
    plugin: string;
    bindings?: readonly { slot: string; source: string }[];
  }[] = [];
  if (rootKind === "bound") {
    entries.push({
      entryId: "root0",
      plugin: "root",
      bindings: [{ slot: "frame", source: "frame_src" }],
    });
  } else if (rootKind === "unbound") {
    entries.push({ entryId: "root0", plugin: "root" });
  }
  for (const link of links) {
    const bindings: { slot: string; source: string }[] = [{ slot: "chain", source: link.chain }];
    if (link.parent !== undefined) bindings.push({ slot: "parent", source: link.parent });
    entries.push({ entryId: link.entryId, plugin: "join", bindings });
  }

  const inventory = makeInventory(trackId, entries);
  const context: DeriveContext = {
    trackId,
    entries: inventory.entries,
    inventory,
    read: ((capability: string, source: string) => {
      if (capability !== "chain") throw new Error(`unexpected capability ${capability}`);
      const payload = chainPayloads.get(source);
      if (payload === undefined) throw new Error(`unknown chain source ${source}`);
      return payload;
    }) as DeriveContext["read"],
    readAny: (() => {
      throw new Error("unexpected readAny");
    }) as DeriveContext["readAny"],
  };
  const result = deriveJoinedLayout(context);
  if (result.status !== "derived" || result.capability !== "joined") {
    throw new Error(`expected joined layout, got ${result.status}`);
  }
  return result.payload;
}

const ABSENT_ROOT: SkeletonRootRead = Object.freeze({ status: "absent" });
const ORIGIN = Object.freeze({ x: 0, y: 0, rotation: 0 });

function readyRoot(value: unknown): SkeletonRootRead {
  return Object.freeze({ status: "ready", value });
}

function point(id: string, values: Readonly<Record<string, unknown>> = {}) {
  return Object.freeze({ id, ...values });
}

function chainCollect(...records: readonly Readonly<Record<string, unknown>>[]) {
  return Object.freeze(records);
}

function link(id: string, points: readonly Readonly<Record<string, unknown>>[], attachTo?: string) {
  return Object.freeze({
    id,
    points: Object.freeze(points),
    ...(attachTo !== undefined ? { attachTo } : {}),
  });
}

function joinedCollect(...links: readonly Readonly<Record<string, unknown>>[]) {
  return Object.freeze(links);
}

function chainFound(payload: ChainPayload): SkeletonFound {
  return { capability: "chain", payload };
}

function joinedFound(payload: JoinedPayload): SkeletonFound {
  return { capability: "joined", payload };
}

function readyView<F>(result: DynamicSkeletonRead<F>): DynamicSkeletonView<F> {
  if (result.status !== "ready") {
    const detail = result.status === "refused" ? result.diagnostics.map((d) => d.message) : [];
    throw new Error(
      `expected ready, got ${result.status}${detail.length > 0 ? `: ${detail.join("; ")}` : ""}`,
    );
  }
  return result.view;
}

function refusalMessages(result: DynamicSkeletonRead): readonly string[] {
  if (result.status !== "refused") throw new Error(`expected refusal, got ${result.status}`);
  return result.diagnostics.map((entry) => entry.message);
}

function locatorsOf(layout: ChainPayload | JoinedPayload): readonly PointLocator[] {
  return layout.locators;
}

describe("Slice C5: dynamic skeleton reader", () => {
  it("binds current chain values to the compiled layout by reference", () => {
    const payload = makeChain("arm", ["p0", "p1", "p2"]);
    const first = chainCollect(
      point("p0", { length: 10, x: 1, y: 2 }),
      point("p1", { length: 20, x: 3, y: 4 }),
      point("p2", { length: 30 }),
    );
    const before = readyView(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect: first,
        root: ABSENT_ROOT,
      }),
    );
    expect(before.capability).toBe("chain");
    expect(before.layout).toBe(payload);
    expect(before.points).toBe(first);
    expect(before.root).toEqual(ORIGIN);
    expect(locatorsOf(before.layout).map((locator) => locator.authoredPath)).toEqual([
      "arm.p0",
      "arm.p1",
      "arm.p2",
    ]);

    const second = chainCollect(
      point("p0", { length: 11, x: 9, y: -1 }),
      point("p1", { length: 21, x: 8, y: -2 }),
      point("p2", { length: 31 }),
    );
    const after = readyView(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect: second,
        root: ABSENT_ROOT,
      }),
    );
    expect(after.layout).toBe(before.layout);
    expect(after.layout.layoutIdentity).toBe(before.layout.layoutIdentity);
    expect(after.points).toBe(second);
    expect(after.points[0]).toBe(second[0]);
    expect(after.points[0]?.["length"]).toBe(11);
  });

  it("binds joined link records parent-first and preserves nested point references", () => {
    const payload = makeJoined(
      "skeleton",
      [
        { name: "torso", pointIds: ["t0", "t1"] },
        { name: "arm_l", pointIds: ["l0", "l1"] },
        { name: "arm_r", pointIds: ["r0", "r1"] },
      ],
      [
        { entryId: "j_torso", chain: "torso" },
        { entryId: "j_arm_l", chain: "arm_l", parent: "torso" },
        { entryId: "j_arm_r", chain: "arm_r", parent: "torso" },
      ],
    );
    const t0 = point("t0", { length: 10, x: 0, y: 0 });
    const t1 = point("t1", { length: 20, x: 1, y: 0 });
    const l0 = point("l0", { length: 15, x: 2, y: 0 });
    const l1 = point("l1", { length: 25, x: 3, y: 0 });
    const r0 = point("r0", { length: 16, x: 4, y: 0 });
    const r1 = point("r1", { length: 26, x: 5, y: 0 });
    const collect = joinedCollect(
      link("j_torso", [t0, t1]),
      link("j_arm_l", [l0, l1], "t1"),
      link("j_arm_r", [r0, r1], "t1"),
    );

    const view = readyView(
      readDynamicSkeleton({
        trackId: "skeleton",
        found: joinedFound(payload),
        collect,
        root: ABSENT_ROOT,
      }),
    );
    expect(view.capability).toBe("joined");
    expect(view.layout).toBe(payload);
    expect(view.points.map((record) => record.id)).toEqual(["t0", "t1", "l0", "l1", "r0", "r1"]);
    expect(view.points[0]).toBe(t0);
    expect(view.points[1]).toBe(t1);
    expect(view.points[2]).toBe(l0);
    expect(view.points[5]).toBe(r1);
    expect(view.root).toEqual(ORIGIN);
  });

  it("refuses records that do not match the bound source capability", () => {
    const chain = makeChain("arm", ["p0", "p1"]);
    const chainAsLinks = joinedCollect(
      link("p0", [point("p0", { length: 1 })]),
      link("p1", [point("p1", { length: 2 })]),
    );
    const chainMismatch = readDynamicSkeleton({
      trackId: "arm",
      found: chainFound(chain),
      collect: chainAsLinks,
      root: ABSENT_ROOT,
    });
    expect(refusalMessages(chainMismatch).join(" ")).toMatch(/unexpected member "points"/);

    const joined = makeJoined(
      "skeleton",
      [{ name: "arm", pointIds: ["p0", "p1"] }],
      [{ entryId: "j0", chain: "arm" }],
    );
    const joinedAsPoints = chainCollect(point("j0", { length: 1 }));
    const joinedMismatch = readDynamicSkeleton({
      trackId: "skeleton",
      found: joinedFound(joined),
      collect: joinedAsPoints,
      root: ABSENT_ROOT,
    });
    expect(refusalMessages(joinedMismatch).join(" ")).toMatch(/no point records/);
  });

  it("refuses missing, extra, reordered, duplicate and foreign chain records", () => {
    const payload = makeChain("arm", ["p0", "p1", "p2"]);
    const base = readDynamicSkeleton({
      trackId: "arm",
      found: chainFound(payload),
      collect: chainCollect(
        point("p0", { length: 1 }),
        point("p1", { length: 2 }),
        point("p2", { length: 3 }),
      ),
      root: ABSENT_ROOT,
    });
    expect(base.status).toBe("ready");

    const cases: readonly unknown[] = [
      chainCollect(point("p0", { length: 1 }), point("p1", { length: 2 })),
      chainCollect(
        point("p0", { length: 1 }),
        point("p1", { length: 2 }),
        point("p2", { length: 3 }),
        point("p3", { length: 4 }),
      ),
      chainCollect(
        point("p0", { length: 1 }),
        point("p2", { length: 3 }),
        point("p1", { length: 2 }),
      ),
      chainCollect(
        point("p0", { length: 1 }),
        point("p0", { length: 2 }),
        point("p2", { length: 3 }),
      ),
      chainCollect(
        point("q0", { length: 1 }),
        point("q1", { length: 2 }),
        point("q2", { length: 3 }),
      ),
    ];
    for (const collect of cases) {
      const result = readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: ABSENT_ROOT,
      });
      expect(result.status, JSON.stringify(collect)).toBe("refused");
    }
  });

  it("refuses malformed joined link records and attachments", () => {
    const payload = makeJoined(
      "skeleton",
      [
        { name: "torso", pointIds: ["t0", "t1"] },
        { name: "arm", pointIds: ["a0", "a1"] },
      ],
      [
        { entryId: "j_torso", chain: "torso" },
        { entryId: "j_arm", chain: "arm", parent: "torso" },
      ],
    );
    const t0 = point("t0", { length: 1 });
    const t1 = point("t1", { length: 2 });
    const a0 = point("a0", { length: 3 });
    const a1 = point("a1", { length: 4 });
    const valid = joinedCollect(link("j_torso", [t0, t1]), link("j_arm", [a0, a1], "t1"));
    expect(
      readDynamicSkeleton({
        trackId: "skeleton",
        found: joinedFound(payload),
        collect: valid,
        root: ABSENT_ROOT,
      }).status,
    ).toBe("ready");

    const cases: readonly unknown[] = [
      joinedCollect(link("j_torso", [t0, t1])),
      joinedCollect(
        link("j_torso", [t0, t1]),
        link("j_arm", [a0, a1], "t1"),
        link("j_extra", [point("x0", { length: 5 })], "t1"),
      ),
      joinedCollect(link("j_arm", [a0, a1], "t1"), link("j_torso", [t0, t1])),
      joinedCollect(link("j_torso", [t0]), link("j_arm", [a0, a1], "t1")),
      joinedCollect(link("j_torso", [t0, t1]), link("j_arm", [a1, a0], "t1")),
      joinedCollect(link("j_torso", [t0, t1]), link("j_arm", [a0, a0], "t1")),
      joinedCollect(link("j_torso", [t0, t1]), link("j_arm", [a0, a1], "t0")),
      joinedCollect(link("j_torso", [t0, t1]), link("j_arm", [a0, a1])),
      joinedCollect(link("j_torso", [t0, t1], "t0"), link("j_arm", [a0, a1], "t1")),
      joinedCollect(
        Object.freeze({ id: "j_torso", points: Object.freeze([t0, t1]), extra: true }),
        link("j_arm", [a0, a1], "t1"),
      ),
    ];
    for (const collect of cases) {
      const result = readDynamicSkeleton({
        trackId: "skeleton",
        found: joinedFound(payload),
        collect,
        root: ABSENT_ROOT,
      });
      expect(result.status, JSON.stringify(collect)).toBe("refused");
    }
  });

  it("propagates blocked and error bound roots and never defaults a missing bound root", () => {
    const payload = makeChain("arm", ["p0"], "bound");
    const collect = chainCollect(point("p0", { length: 1 }));
    const error = diagnostic("composition-failure", "frame_src", "frame source failed", [
      "frame_src",
    ]);

    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: ABSENT_ROOT,
      }),
    ).toEqual({ status: "blocked", source: "frame_src" });

    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: { status: "blocked", source: "frame_src" },
      }),
    ).toEqual({ status: "blocked", source: "frame_src" });

    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: { status: "error", source: "frame_src", diagnostic: error },
      }),
    ).toEqual({ status: "error", source: "frame_src", diagnostic: error });

    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: { status: "blocked", source: "other_source" },
      }).status,
    ).toBe("refused");

    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: readyRoot({ x: 0, y: 0, rotation: 0 }),
      }).status,
    ).toBe("ready");
  });

  it("defaults origin only when no root entry exists", () => {
    const originPayload = makeChain("arm", ["p0"]);
    const collect = chainCollect(point("p0", { length: 1 }));
    const unexpected = readDynamicSkeleton({
      trackId: "arm",
      found: chainFound(originPayload),
      collect,
      root: readyRoot({ x: 10, y: 20, rotation: 30 }),
    });
    expect(refusalMessages(unexpected).join(" ")).toMatch(/no root entry/);

    const unboundPayload = makeChain("spine", ["p0"], "unbound");
    const unboundAbsent = readDynamicSkeleton({
      trackId: "spine",
      found: chainFound(unboundPayload),
      collect,
      root: ABSENT_ROOT,
    });
    expect(unboundAbsent.status).toBe("refused");

    const unboundReady = readyView(
      readDynamicSkeleton({
        trackId: "spine",
        found: chainFound(unboundPayload),
        collect,
        root: readyRoot({ x: 1, y: 2, rotation: 3 }),
      }),
    );
    expect(unboundReady.root).toEqual({ x: 1, y: 2, rotation: 3 });
  });

  it("refuses malformed and non-finite root frames instead of zeroing them", () => {
    const payload = makeChain("arm", ["p0"], "bound");
    const collect = chainCollect(point("p0", { length: 1 }));
    const cases: readonly unknown[] = [
      null,
      [],
      "frame",
      { x: Number.NaN },
      { y: Number.POSITIVE_INFINITY },
      { rotation: "spin" },
      { rotation: undefined },
    ];
    for (const value of cases) {
      const result = readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: readyRoot(value),
      });
      expect(result.status, JSON.stringify(value)).toBe("refused");
    }

    const partial = readyView(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(payload),
        collect,
        root: readyRoot({ x: 4 }),
      }),
    );
    expect(partial.root).toEqual({ x: 4, y: 0, rotation: 0 });
  });

  it("refuses non-finite point values instead of turning them into plausible zeroes", () => {
    const chain = makeChain("arm", ["p0", "p1"]);
    const cases: readonly (readonly Readonly<Record<string, unknown>>[])[] = [
      [point("p0", { length: Number.NaN }), point("p1", { length: 1 })],
      [point("p0", { x: Number.POSITIVE_INFINITY }), point("p1", { length: 1 })],
      [point("p0", { y: "up" }), point("p1", { length: 1 })],
      [point("p0", { length: undefined }), point("p1", { length: 1 })],
    ];
    for (const records of cases) {
      const result = readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(chain),
        collect: chainCollect(...records),
        root: ABSENT_ROOT,
      });
      expect(result.status, JSON.stringify(records)).toBe("refused");
    }

    const joined = makeJoined(
      "skeleton",
      [
        { name: "torso", pointIds: ["t0"] },
        { name: "arm", pointIds: ["a0"] },
      ],
      [
        { entryId: "j_torso", chain: "torso" },
        { entryId: "j_arm", chain: "arm", parent: "torso" },
      ],
    );
    const joinedBad = readDynamicSkeleton({
      trackId: "skeleton",
      found: joinedFound(joined),
      collect: joinedCollect(
        link("j_torso", [point("t0", { length: 1 })]),
        link("j_arm", [point("a0", { length: Number.NaN })], "t0"),
      ),
      root: ABSENT_ROOT,
    });
    expect(joinedBad.status).toBe("refused");
  });

  it("refuses third-party capability payloads that are internally inconsistent", () => {
    const payload = makeChain("arm", ["p0", "p1", "p2"]);
    const collect = chainCollect(
      point("p0", { length: 1 }),
      point("p1", { length: 2 }),
      point("p2", { length: 3 }),
    );

    const duplicateIds = {
      ...payload,
      orderedPointIds: ["p0", "p0", "p2"],
      pointIndexById: { p0: 0, p2: 2 },
      locators: payload.locators.map((locator, index) => ({
        ...locator,
        pointId: index === 1 ? "p0" : locator.pointId,
      })),
    };
    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(duplicateIds as unknown as ChainPayload),
        collect,
        root: ABSENT_ROOT,
      }).status,
    ).toBe("refused");

    const branching = {
      ...payload,
      parentIndices: [-1, 0, 0],
      childAdjacency: [[1, 2], [], []],
      leafIds: ["p1", "p2"],
    };
    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(branching as unknown as ChainPayload),
        collect,
        root: ABSENT_ROOT,
      }).status,
    ).toBe("refused");

    const staleLocator = {
      ...payload,
      locators: payload.locators.map((locator, index) =>
        index === 1 ? { ...locator, pointId: "other" } : locator,
      ),
    };
    expect(
      readDynamicSkeleton({
        trackId: "arm",
        found: chainFound(staleLocator as unknown as ChainPayload),
        collect,
        root: ABSENT_ROOT,
      }).status,
    ).toBe("refused");

    const joined = makeJoined(
      "skeleton",
      [
        { name: "torso", pointIds: ["t0", "t1"] },
        { name: "arm", pointIds: ["a0"] },
      ],
      [
        { entryId: "j_torso", chain: "torso" },
        { entryId: "j_arm", chain: "arm", parent: "torso" },
      ],
    );
    const wrongSegment = {
      ...joined,
      links: [
        { ...joined.links[0]!, pointIds: ["t0"] },
        { ...joined.links[1]!, pointIds: ["t1", "a0"] },
      ],
    };
    expect(
      readDynamicSkeleton({
        trackId: "skeleton",
        found: joinedFound(wrongSegment as unknown as JoinedPayload),
        collect: joinedCollect(
          link("j_torso", [point("t0", { length: 1 }), point("t1", { length: 2 })]),
          link("j_arm", [point("a0", { length: 3 })], "t1"),
        ),
        root: ABSENT_ROOT,
      }).status,
    ).toBe("refused");

    const badRootPolicy = {
      ...joined,
      rootPolicy: { kind: "mystery", hasRootEntry: true },
    };
    expect(
      readDynamicSkeleton({
        trackId: "skeleton",
        found: joinedFound(badRootPolicy as unknown as JoinedPayload),
        collect: joinedCollect(
          link("j_torso", [point("t0", { length: 1 }), point("t1", { length: 2 })]),
          link("j_arm", [point("a0", { length: 3 })], "t1"),
        ),
        root: ABSENT_ROOT,
      }).status,
    ).toBe("refused");
  });

  it("does not call topology construction while reading current data", () => {
    const payload = makeJoined(
      "skeleton",
      [{ name: "arm", pointIds: ["p0", "p1"] }],
      [{ entryId: "j0", chain: "arm" }],
    );
    const collect = joinedCollect(
      link("j0", [point("p0", { length: 1 }), point("p1", { length: 2 })]),
    );
    topology.deriveChainLayout.mockClear();
    topology.deriveJoinedLayout.mockClear();

    const view = readyView(
      readDynamicSkeleton({
        trackId: "skeleton",
        found: joinedFound(payload),
        collect,
        root: ABSENT_ROOT,
      }),
    );
    expect(view.layout).toBe(payload);
    expect(topology.deriveChainLayout).not.toHaveBeenCalled();
    expect(topology.deriveJoinedLayout).not.toHaveBeenCalled();
  });

  it("types the view as a capability-keyed chain-or-joined union", () => {
    const found: SkeletonFound = chainFound(makeChain("arm", ["p0"]));
    const view = readyView(
      readDynamicSkeleton({
        trackId: "arm",
        found,
        collect: chainCollect(point("p0", { length: 1 })),
        root: ABSENT_ROOT,
      }),
    );
    if (view.capability === "chain") {
      expect(view.layout.orderedPointIds).toEqual(["p0"]);
    } else {
      expect(view.layout.links.length).toBeGreaterThan(0);
    }
    expect(view.points).toHaveLength(1);
  });
});
