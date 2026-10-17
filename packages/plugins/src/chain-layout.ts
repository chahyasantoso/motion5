import type {
  AuthoredEntryId,
  DerivationContext,
  DerivationHookResult,
  DerivationTrackInventory,
  LayoutIdentity,
  PointMemberId,
  RootBindingProvenance,
  StructuralDescriptor,
} from "@motion5/core/plugin-api";
import {
  asAuthoredEntryId,
  asLayoutIdentity,
  asPointMemberId,
  asRootBindingProvenance,
  createSafeRecord,
  diagnostic,
  encodeBindingTuple,
} from "@motion5/core/plugin-api";

export interface PointLocator {
  readonly pointId: PointMemberId;
  readonly index: number;
  readonly sourceTrack: string;
  readonly entryId: AuthoredEntryId;
  readonly authoredPath: string;
}

export type ChainRootPolicy =
  | {
      readonly kind: "origin";
      readonly hasRootEntry: false;
    }
  | {
      readonly kind: "unbound";
      readonly hasRootEntry: true;
      readonly entryId: AuthoredEntryId;
      readonly authoredPath: string;
    }
  | {
      readonly kind: "bound";
      readonly hasRootEntry: true;
      readonly source: string;
      readonly slot: string;
      readonly provenance: RootBindingProvenance;
      readonly entryId: AuthoredEntryId;
      readonly authoredPath: string;
    };

export interface ChainDescriptorPayload {
  readonly orderedPointIds: readonly PointMemberId[];
  readonly parentIndices: readonly number[];
  readonly childAdjacency: readonly (readonly number[])[];
  readonly rootId: PointMemberId;
  readonly leafIds: readonly PointMemberId[];
  readonly pointIndexById: Readonly<Record<string, number>>;
  readonly locators: readonly PointLocator[];
  readonly layoutIdentity: LayoutIdentity;
  readonly rootPolicy: ChainRootPolicy;
}

export interface ChainDescriptor extends StructuralDescriptor<ChainDescriptorPayload> {
  readonly capability: "chain";
}

export function deriveChainLayout(
  inventory: DerivationTrackInventory,
  context?: DerivationContext,
): DerivationHookResult {
  const trackId = inventory.trackId ?? context?.trackId ?? "track";
  if (inventory.entries.length === 0) return undefined;

  for (const entry of inventory.entries) {
    if (entry.plugin !== "point" && entry.plugin !== "root") {
      return undefined;
    }
  }

  const rootEntries = inventory.entries.filter((e) => e.plugin === "root");
  if (rootEntries.length > 1) {
    return {
      diagnostics: [
        diagnostic(
          "derivation-failure",
          `${trackId}.${rootEntries[1]!.entryId}`,
          `Duplicate root entries on chain track "${trackId}". At most one root entry permitted.`,
          [trackId, rootEntries[1]!.entryId],
        ),
      ],
    };
  }

  const pointEntries = inventory.entries.filter((e) => e.plugin === "point");
  if (pointEntries.length === 0) {
    if (rootEntries.length > 0) {
      return {
        diagnostics: [
          diagnostic(
            "derivation-failure",
            `${trackId}.${rootEntries[0]!.entryId}`,
            `Root-only track "${trackId}" is invalid: chain source requires at least one point entry.`,
            [trackId, rootEntries[0]!.entryId],
          ),
        ],
      };
    }
    return undefined;
  }

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

  let rootPolicy: ChainRootPolicy;
  if (rootEntries.length === 0) {
    rootPolicy = Object.freeze({ kind: "origin", hasRootEntry: false } as const);
  } else {
    const rootEntry = rootEntries[0]!;
    const frameBinding = rootEntry.bindings.find((b) => b.slot === "frame");
    if (frameBinding !== undefined) {
      const provenance = asRootBindingProvenance(
        encodeBindingTuple(frameBinding.qualifiedSource, rootEntry.entryId, "frame"),
      );
      rootPolicy = Object.freeze({
        kind: "bound",
        hasRootEntry: true,
        source: frameBinding.qualifiedSource,
        slot: "frame",
        provenance,
        entryId: rootEntry.entryId,
        authoredPath: frameBinding.authoredPath,
      } as const);
    } else {
      rootPolicy = Object.freeze({
        kind: "unbound",
        hasRootEntry: true,
        entryId: rootEntry.entryId,
        authoredPath: `${trackId}.${rootEntry.entryId}`,
      } as const);
    }
  }

  const pointTopologyToken = orderedPointIds.join(">");
  const rootToken =
    rootPolicy.kind === "bound"
      ? `bound(${rootPolicy.provenance})`
      : rootPolicy.kind === "unbound"
        ? `unbound(${rootPolicy.entryId})`
        : "origin";
  const layoutIdentity = asLayoutIdentity(`chain(${trackId}:[${pointTopologyToken}]:${rootToken})`);

  const payload: ChainDescriptorPayload = Object.freeze({
    orderedPointIds: Object.freeze(orderedPointIds),
    parentIndices: Object.freeze(parentIndices),
    childAdjacency: Object.freeze(childAdjacency.map((c) => Object.freeze(c))),
    rootId: orderedPointIds[0]!,
    leafIds: Object.freeze([orderedPointIds[orderedPointIds.length - 1]!]),
    pointIndexById: Object.freeze(pointIndexById),
    locators: Object.freeze(locators),
    layoutIdentity,
    rootPolicy,
  });

  return Object.freeze({
    capability: "chain",
    source: trackId,
    payload,
  });
}
