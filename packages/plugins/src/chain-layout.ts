import type {
  AuthoredEntryId,
  DerivationTrackInventory,
  DeriveResult,
  LayoutIdentity,
  PointMemberId,
} from "@motion5/core/plugin-api";
import {
  asAuthoredEntryId,
  asPointMemberId,
  createSafeRecord,
  derived,
  none,
} from "@motion5/core/plugin-api";
import { chainLayoutIdentity } from "./layout-identity";
import { readRootPolicy, rootPolicyToken, type RootPolicy } from "./root-policy";
import { SKELETON_2D, type SkeletonSpaceSpec } from "./skeleton-space";

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

export function deriveChainLayout(
  inventory: DerivationTrackInventory,
  spec: SkeletonSpaceSpec = SKELETON_2D,
): DeriveResult {
  const trackId = inventory.trackId ?? "track";
  if (inventory.entries.length === 0) return none;
  for (const entry of inventory.entries) {
    if (entry.plugin !== spec.pointPlugin && entry.plugin !== spec.rootPlugin) return none;
  }
  const root = readRootPolicy(inventory, spec.rootPlugin);
  if (root.status === "refused") return none; // root reports duplicate roots, so chain layout stays silent here.
  const pointEntries = inventory.entries.filter((e) => e.plugin === spec.pointPlugin);
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

  const rootToken = rootPolicyToken(root.policy);
  const layoutIdentity = chainLayoutIdentity(trackId, orderedPointIds, rootToken);

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

  return derived(spec.chainCapability, payload);
}
