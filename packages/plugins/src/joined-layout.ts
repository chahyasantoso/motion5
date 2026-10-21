import type {
  AuthoredEntryId,
  DerivationTrackInventory,
  DeriveContext,
  DeriveResult,
  Diagnostic,
  LayoutIdentity,
  PointMemberId,
  RequirementContext,
} from "@motion5/core/plugin-api";
import { createSafeRecord, derived, diagnostic, none, refused } from "@motion5/core/plugin-api";
import type { ChainPayload, PointLocator } from "./chain-layout";
import { joinedLayoutIdentity } from "./layout-identity";
import { readRootPolicy, rootPolicyToken, type RootPolicy } from "./root-policy";
import { SKELETON_2D, type SkeletonSpaceSpec } from "./skeleton-space";

export interface JoinedLink {
  readonly entryId: AuthoredEntryId;
  readonly chainSource: string;
  readonly parentSource?: string;
  /** The imported chain's points, in that chain's order: this link's segment of `orderedPointIds`. */
  readonly pointIds: readonly PointMemberId[];
  /** The parent chain's final point this link's first point attaches to; absent on the root link. */
  readonly attachTo?: PointMemberId;
}

export interface JoinedPayload {
  readonly orderedPointIds: readonly PointMemberId[];
  readonly parentIndices: readonly number[];
  readonly childAdjacency: readonly (readonly number[])[];
  readonly rootId: PointMemberId;
  readonly leafIds: readonly PointMemberId[];
  readonly pointIndexById: Readonly<Record<string, number>>;
  readonly locators: readonly PointLocator[];
  readonly layoutIdentity: LayoutIdentity;
  readonly rootPolicy: RootPolicy;
  readonly links: readonly JoinedLink[];
}

declare module "@motion5/core/plugin-api" {
  interface CapabilityMap {
    joined: JoinedPayload;
  }
}

function isJoinedTrack(inventory: DerivationTrackInventory, spec: SkeletonSpaceSpec): boolean {
  if (inventory.entries.length === 0) return false;
  return inventory.entries.every(
    (entry) => entry.plugin === spec.joinPlugin || entry.plugin === spec.rootPlugin,
  );
}

export function validateJoinedRequirements(
  context: RequirementContext,
  spec: SkeletonSpaceSpec = SKELETON_2D,
): readonly Diagnostic[] {
  if (!isJoinedTrack(context.inventory, spec)) return Object.freeze([]);

  const diagnostics: Diagnostic[] = [];
  const trackId = context.trackId ?? context.inventory.trackId ?? "track";

  for (const item of context.entries) {
    for (const slot of ["chain", "parent"] as const) {
      const binding = item.bindings.find((candidate) => candidate.slot === slot);
      if (binding === undefined) continue;
      const source = binding.qualifiedSource;
      try {
        const payload = context.read(spec.chainCapability, source) as ChainPayload;
        if (payload?.rootPolicy?.hasRootEntry === true) {
          const role = slot === "chain" ? "" : " as parent";
          diagnostics.push(
            diagnostic(
              "skeleton-imported-chain-has-root",
              `${trackId}.${item.entryId}.${slot}`,
              `Imported chain "${source}"${role} on join entry "${item.entryId}" has a root entry. Imported chains in a joined track must not have root entries.`,
              [trackId, item.entryId, source],
            ),
          );
        }
      } catch {
        // Core capability presence check reports missing capabilities before validation.
      }
    }
  }

  return Object.freeze(diagnostics);
}

export function deriveJoinedLayout(
  context: DeriveContext,
  spec: SkeletonSpaceSpec = SKELETON_2D,
): DeriveResult {
  const inventory = context.inventory;
  const trackId = context.trackId ?? inventory.trackId ?? "track";

  if (!isJoinedTrack(inventory, spec)) return none;

  const root = readRootPolicy(inventory, spec.rootPlugin);
  if (root.status === "refused") {
    return none;
  }

  const joinEntries = inventory.entries.filter((e) => e.plugin === spec.joinPlugin);
  if (joinEntries.length === 0) {
    return none;
  }

  const firstEntry = joinEntries[0]!;
  const firstParentBinding = firstEntry.bindings.find((b) => b.slot === "parent");
  if (firstParentBinding !== undefined) {
    return refused([
      diagnostic(
        "derivation-failure",
        `${trackId}.${firstEntry.entryId}`,
        `First join entry "${firstEntry.entryId}" must not have a parent chain. The first join entry defines the topology root.`,
        [trackId, firstEntry.entryId],
      ),
    ]);
  }

  for (let i = 1; i < joinEntries.length; i++) {
    const entry = joinEntries[i]!;
    const parentBinding = entry.bindings.find((b) => b.slot === "parent");
    if (parentBinding === undefined) {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${entry.entryId}`,
          `Join entry "${entry.entryId}" must specify a parent chain. Only the first join entry may omit a parent chain.`,
          [trackId, entry.entryId],
        ),
      ]);
    }
  }

  const seenChainSources = new Set<string>();
  const chainPayloads = new Map<string, ChainPayload>();
  const links: JoinedLink[] = [];

  for (let i = 0; i < joinEntries.length; i++) {
    const entry = joinEntries[i]!;
    const chainBinding = entry.bindings.find((b) => b.slot === "chain");
    if (chainBinding === undefined) {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${entry.entryId}`,
          `Join entry "${entry.entryId}" must bind a "chain" source.`,
          [trackId, entry.entryId],
        ),
      ]);
    }
    const chainSource = chainBinding.qualifiedSource;
    if (seenChainSources.has(chainSource)) {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${entry.entryId}`,
          `Duplicate chain source "${chainSource}" on join entry "${entry.entryId}". A chain source may be joined only once.`,
          [trackId, entry.entryId, chainSource],
        ),
      ]);
    }

    const parentBinding = entry.bindings.find((b) => b.slot === "parent");
    const parentSource = parentBinding?.qualifiedSource;
    if (parentSource !== undefined && !seenChainSources.has(parentSource)) {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${entry.entryId}`,
          `Parent chain source "${parentSource}" on join entry "${entry.entryId}" must match a chain used by an earlier join.`,
          [trackId, entry.entryId, parentSource],
        ),
      ]);
    }

    let payload: ChainPayload;
    try {
      payload = context.read(spec.chainCapability, chainSource) as ChainPayload;
    } catch {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${entry.entryId}`,
          `Failed to read chain capability from source "${chainSource}".`,
          [trackId, entry.entryId, chainSource],
        ),
      ]);
    }

    if (payload.orderedPointIds.length === 0) {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${entry.entryId}`,
          `Imported chain "${chainSource}" on join entry "${entry.entryId}" has no points.`,
          [trackId, entry.entryId, chainSource],
        ),
      ]);
    }

    seenChainSources.add(chainSource);
    chainPayloads.set(chainSource, payload);
    links.push(
      Object.freeze({
        entryId: entry.entryId,
        chainSource,
        ...(parentSource !== undefined ? { parentSource } : {}),
        pointIds: Object.freeze([...payload.orderedPointIds]),
      }),
    );
  }

  const pointOwner = new Map<string, string>();
  for (const entry of joinEntries) {
    const chainBinding = entry.bindings.find((b) => b.slot === "chain")!;
    const chainSource = chainBinding.qualifiedSource;
    const payload = chainPayloads.get(chainSource)!;
    for (const pointId of payload.orderedPointIds) {
      const prior = pointOwner.get(pointId);
      if (prior !== undefined) {
        return refused([
          diagnostic(
            "derivation-failure",
            `${trackId}.${entry.entryId}`,
            `Duplicate point ID "${pointId}" in chain "${chainSource}" overlaps with chain "${prior}". Point IDs must be unique across all chains in a joined skeleton.`,
            [trackId, pointId, chainSource, prior],
          ),
        ]);
      }
      pointOwner.set(pointId, chainSource);
    }
  }

  const orderedPointIds: PointMemberId[] = [];
  const locators: PointLocator[] = [];
  const pointIndexById = createSafeRecord<number>();
  const chainStartIndices = new Map<string, number>();
  const chainEndIndices = new Map<string, number>();

  for (const link of links) {
    const payload = chainPayloads.get(link.chainSource)!;
    const start = orderedPointIds.length;
    chainStartIndices.set(link.chainSource, start);

    if (payload.locators.length !== payload.orderedPointIds.length) {
      return refused([
        diagnostic(
          "derivation-failure",
          `${trackId}.${link.entryId}`,
          `Imported chain "${link.chainSource}" on join entry "${link.entryId}" published ${payload.orderedPointIds.length} point(s) but ${payload.locators.length} locator(s).`,
          [trackId, link.entryId, link.chainSource],
        ),
      ]);
    }

    for (const [p, pointId] of payload.orderedPointIds.entries()) {
      const origLocator = payload.locators[p];
      if (origLocator === undefined) {
        return refused([
          diagnostic(
            "derivation-failure",
            `${trackId}.${link.entryId}`,
            `Imported chain "${link.chainSource}" on join entry "${link.entryId}" has no locator for point index ${p}.`,
            [trackId, link.entryId, link.chainSource],
          ),
        ]);
      }
      const globalIndex = orderedPointIds.length;
      orderedPointIds.push(pointId);
      pointIndexById[pointId] = globalIndex;
      locators.push(
        Object.freeze({
          pointId,
          index: globalIndex,
          sourceTrack: origLocator.sourceTrack,
          entryId: origLocator.entryId,
          authoredPath: origLocator.authoredPath,
        }),
      );
    }

    chainEndIndices.set(link.chainSource, orderedPointIds.length - 1);
  }

  const parentIndices: number[] = new Array(orderedPointIds.length);
  for (let i = 0; i < links.length; i++) {
    const link = links[i]!;
    const payload = chainPayloads.get(link.chainSource)!;
    const start = chainStartIndices.get(link.chainSource)!;

    if (link.parentSource === undefined) {
      parentIndices[start] = -1;
    } else {
      const parentFinalPointIndex = chainEndIndices.get(link.parentSource)!;
      parentIndices[start] = parentFinalPointIndex;
    }

    for (let p = 1; p < payload.orderedPointIds.length; p++) {
      parentIndices[start + p] = start + p - 1;
    }
  }

  const childAdjacency: number[][] = Array.from({ length: orderedPointIds.length }, () => []);
  for (let idx = 0; idx < orderedPointIds.length; idx++) {
    const p = parentIndices[idx]!;
    if (p >= 0) {
      childAdjacency[p]!.push(idx);
    }
  }

  const leafIds: PointMemberId[] = [];
  for (let idx = 0; idx < orderedPointIds.length; idx++) {
    if (childAdjacency[idx]!.length === 0) {
      leafIds.push(orderedPointIds[idx]!);
    }
  }

  const rootId = orderedPointIds[0]!;
  const resolvedLinks: readonly JoinedLink[] = Object.freeze(
    links.map((link) => {
      if (link.parentSource === undefined) return link;
      const parentFinalIndex = chainEndIndices.get(link.parentSource)!;
      return Object.freeze({ ...link, attachTo: orderedPointIds[parentFinalIndex]! });
    }),
  );
  const rootToken = rootPolicyToken(root.policy);
  const layoutIdentity = joinedLayoutIdentity(
    trackId,
    orderedPointIds,
    parentIndices,
    resolvedLinks,
    rootToken,
  );

  const payload: JoinedPayload = Object.freeze({
    orderedPointIds: Object.freeze(orderedPointIds),
    parentIndices: Object.freeze(parentIndices),
    childAdjacency: Object.freeze(childAdjacency.map((c) => Object.freeze(c))),
    rootId,
    leafIds: Object.freeze(leafIds),
    pointIndexById: Object.freeze(pointIndexById),
    locators: Object.freeze(locators),
    layoutIdentity,
    rootPolicy: root.policy,
    links: resolvedLinks,
  });

  return derived(spec.joinedCapability, payload);
}
