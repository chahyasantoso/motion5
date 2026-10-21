import type {
  AuthoredEntryId,
  Diagnostic,
  DerivationTrackInventory,
  RootBindingProvenance,
} from "@motion5/core/plugin-api";
import {
  asRootBindingProvenance,
  diagnostic,
  encodeBindingTuple,
  unreachable,
} from "@motion5/core/plugin-api";

export type RootPolicy =
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

export type RootPolicyResult =
  | { readonly status: "ok"; readonly policy: RootPolicy }
  | { readonly status: "refused"; readonly diagnostics: readonly [Diagnostic, ...Diagnostic[]] };

const ORIGIN_POLICY: RootPolicy = Object.freeze({
  kind: "origin",
  hasRootEntry: false,
} as const);

export function readRootPolicy(
  inventory: DerivationTrackInventory,
  rootPlugin: string,
): RootPolicyResult {
  const trackId = inventory.trackId ?? "track";
  const rootEntries = inventory.entries.filter((entry) => entry.plugin === rootPlugin);
  if (rootEntries.length > 1) {
    const secondRoot = rootEntries[1]!;
    return {
      status: "refused",
      diagnostics: [
        diagnostic(
          "derivation-failure",
          `${trackId}.${secondRoot.entryId}`,
          `Duplicate root entries on track "${trackId}". At most one root entry permitted.`,
          [trackId, secondRoot.entryId],
        ),
      ],
    };
  }
  if (rootEntries.length === 0) {
    return { status: "ok", policy: ORIGIN_POLICY };
  }
  const rootEntry = rootEntries[0]!;
  const frameBinding = rootEntry.bindings.find((binding) => binding.slot === "frame");
  if (frameBinding !== undefined) {
    const provenance = asRootBindingProvenance(
      encodeBindingTuple(frameBinding.qualifiedSource, rootEntry.entryId, "frame"),
    );
    const policy: RootPolicy = Object.freeze({
      kind: "bound",
      hasRootEntry: true,
      source: frameBinding.qualifiedSource,
      slot: "frame",
      provenance,
      entryId: rootEntry.entryId,
      authoredPath: frameBinding.authoredPath,
    } as const);
    return { status: "ok", policy };
  }
  const policy: RootPolicy = Object.freeze({
    kind: "unbound",
    hasRootEntry: true,
    entryId: rootEntry.entryId,
    authoredPath: `${trackId}.${rootEntry.entryId}`,
  } as const);
  return { status: "ok", policy };
}

export function rootPolicyToken(policy: RootPolicy): string {
  switch (policy.kind) {
    case "origin":
      return "origin";
    case "unbound":
      return `unbound(${policy.entryId})`;
    case "bound":
      return `bound(${policy.provenance})`;
    default:
      return unreachable(policy);
  }
}
