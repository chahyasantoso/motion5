import type {
  AuthoredEntryId,
  DerivationTrackInventory,
  DeriveResult,
  LayoutIdentity,
  PointMemberId,
} from "@motion5/core/plugin-api";
import {
  asAuthoredEntryId,
  asLayoutIdentity,
  asPointMemberId,
  createSafeRecord,
  derived,
  none,
} from "@motion5/core/plugin-api";
import { readRootPolicy, rootPolicyToken, type RootPolicy } from "./root-policy";

export interface PointLocator {
  readonly pointId: PointMemberId;
  readonly index: number;
  readonly sourceTrack: string;
  readonly entryId: AuthoredEntryId;
  readonly authoredPath: string;
}

export interface ChainPayload {
  readonly orderedPointIds: readonly PointMemberId[];
  readonly parentIndices: readonly number[];
  readonly childAdjacency: readonly (readonly number[])[];
  readonly rootId: PointMemberId;
  readonly leafIds: readonly PointMemberId[];
  readonly pointIndexById: Readonly<Record<string, number>>;
  readonly locators: readonly PointLocator[];
  readonly layoutIdentity: LayoutIdentity;
  readonly rootPolicy: RootPolicy;
}

declare module "@motion5/core/plugin-api" {
  interface CapabilityMap {
    chain: ChainPayload;
  }
}

export function deriveChainLayout(inventory: DerivationTrackInventory): DeriveResult {
  const trackId = inventory.trackId ?? "track";
  if (inventory.entries.length === 0) return none;
  for (const entry of inventory.entries) {
    if (entry.plugin !== "point" && entry.plugin !== "root") return none;
  }
  const root = readRootPolicy(inventory);
  if (root.status === "refused") return none; // root reports duplicate roots, so chain layout stays silent here.
  const pointEntries = inventory.entries.filter((e) => e.plugin === "point");
  if (pointEntries.length === 0) return none;

  const orderedPointIds: PointMemberId[] = [];
  const pointIndexById = createSafeRecord<number>();
  const parentIndices: number[] = [];
  const childAdjacency: number[][] = [];
  const locators: PointLocator[] = [];

  for (let i = 0; i < pointEntries.length; i++) {
    const entry = pointEntries[i]!;
    const pointId = asPointMemberId(asAuthoredEntryId(entry.entryId));
    orderedPointIds.push(pointId);
    pointIndexById[pointId] = i;
    parentIndices.push(i === 0 ? -1 : i - 1);
    childAdjacency.push(i < pointEntries.length - 1 ? [i + 1] : []);
    locators.push(
      Object.freeze({
        pointId,
        index: i,
        sourceTrack: trackId,
        entryId: entry.entryId,
        authoredPath: `${trackId}.${entry.entryId}`,
      }),
    );
  }

  const pointTopologyToken = orderedPointIds.join(">");
  const rootToken = rootPolicyToken(root.policy);
  const layoutIdentity = asLayoutIdentity(`chain(${trackId}:[${pointTopologyToken}]:${rootToken})`);

  const payload: ChainPayload = Object.freeze({
    orderedPointIds: Object.freeze(orderedPointIds),
    parentIndices: Object.freeze(parentIndices),
    childAdjacency: Object.freeze(childAdjacency.map((c) => Object.freeze(c))),
    rootId: orderedPointIds[0]!,
    leafIds: Object.freeze([orderedPointIds[orderedPointIds.length - 1]!]),
    pointIndexById: Object.freeze(pointIndexById),
    locators: Object.freeze(locators),
    layoutIdentity,
    rootPolicy: root.policy,
  });

  return derived("chain", payload);
}
