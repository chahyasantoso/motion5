import type { Diagnostic } from "./v5";
import type { AuthoredEntryId, PluginName } from "./address";
import type { CapabilityMap } from "./capability";

export interface StructuralDescriptor<T = unknown> {
  readonly capability: string;
  readonly source: string;
  readonly payload: T;
}

/** Normalized binding visible to structural derivation inventory. */
export interface DerivationBinding {
  readonly kind: "single" | "dict";
  readonly qualifiedSource: string;
  readonly destinationTrack?: string;
  readonly entryId: AuthoredEntryId;
  readonly slot: string;
  readonly memberKey?: string;
  readonly authoredPath: string;
  readonly tupleKey: string;
}

/** Structural declaration inventory of one entry on a track. */
export interface DerivationEntryInventoryItem {
  readonly entryId: AuthoredEntryId;
  readonly plugin: PluginName;
  readonly order: number;
  readonly valueKeys: readonly string[];
  readonly bindings: readonly DerivationBinding[];
  readonly collect?: true;
  readonly fold?: { readonly outputs: readonly string[] };
}

/** Track-local structural declaration inventory for composition checks. */
export interface DerivationTrackInventory {
  readonly trackId?: string;
  readonly entries: readonly DerivationEntryInventoryItem[];
  readonly entriesById: ReadonlyMap<string, DerivationEntryInventoryItem>;
  readonly declaredSources: ReadonlySet<string>;
}

export type DeriveResultOf<M> =
  | {
      readonly [K in keyof M]: {
        readonly status: "derived";
        readonly capability: K;
        readonly payload: M[K];
      };
    }[keyof M]
  | { readonly status: "refused"; readonly diagnostics: readonly [Diagnostic, ...Diagnostic[]] }
  | { readonly status: "none" };

export interface RequirementContextOf<M> {
  readonly trackId: string;
  readonly entries: readonly DerivationEntryInventoryItem[];
  read<K extends keyof M>(capability: K, source: string): M[K];
}

export interface DeriveContextOf<M> extends RequirementContextOf<M> {
  readonly inventory: DerivationTrackInventory;
}

export type DeriveResult = DeriveResultOf<CapabilityMap>;

export function derived<K extends keyof CapabilityMap>(
  capability: K,
  payload: CapabilityMap[K],
): DeriveResult {
  // Generic key to mapped union cannot distribute without cast.
  return Object.freeze({ status: "derived", capability, payload }) as DeriveResult;
}

export function refused(diagnostics: readonly [Diagnostic, ...Diagnostic[]]): DeriveResult {
  return Object.freeze({ status: "refused", diagnostics });
}

export const none: DeriveResult = Object.freeze({ status: "none" });
export type RequirementContext = RequirementContextOf<CapabilityMap>;
export type DeriveContext = DeriveContextOf<CapabilityMap>;
export type ErasedDeriveResult = DeriveResultOf<Record<string, unknown>>;

export class CapabilityReadError extends Error {
  readonly ruleId = "derivation-undeclared-source";

  constructor(
    readonly trackId: string,
    readonly source: string,
    readonly capability: string,
  ) {
    super(
      `Track "${trackId}" read capability "${capability}" from "${source}" without a slot declaring it.`,
    );
    this.name = "CapabilityReadError";
  }
}
