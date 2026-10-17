import type { Diagnostic } from "./v5";
import type { AuthoredEntryId, PluginName } from "./address";

/**
 * An immutable descriptor emitted by generic structural derivation.
 *
 * Core transports its payload opaquely without interpreting domain concepts like
 * skeletons, joints, or constraints.
 */
export interface StructuralDescriptor<T = unknown> {
  readonly capability: string;
  readonly source: string;
  readonly payload: T;
  readonly diagnostics?: readonly Diagnostic[];
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
  readonly collect?: { readonly output: string };
  readonly fold?: { readonly outputs: readonly string[] };
}

/** Track-local structural declaration inventory for composition checks. */
export interface DerivationTrackInventory {
  readonly trackId?: string;
  readonly entries: readonly DerivationEntryInventoryItem[];
  readonly entriesById: ReadonlyMap<string, DerivationEntryInventoryItem>;
  readonly declaredSources: ReadonlySet<string>;
}

/** Read-only context handed to a plugin's derivation hook. */
export interface DerivationContext {
  readonly trackId?: string;
  readonly participatingEntries: readonly DerivationEntryInventoryItem[];
  readonly inventory: DerivationTrackInventory;
  readDescriptor(sourceId: string, capability?: string): StructuralDescriptor;
  tryReadDescriptor(sourceId: string, capability?: string): StructuralDescriptor | undefined;
}

export type DerivationHookResult =
  | readonly StructuralDescriptor[]
  | StructuralDescriptor
  | {
      readonly descriptors?: readonly StructuralDescriptor[];
      readonly diagnostics?: readonly Diagnostic[];
    }
  | undefined;

/** A structural collection hook called once per candidate structural revision. */
export type PluginDerivationHook = (context: DerivationContext) => DerivationHookResult;

export class DerivationUndeclaredSourceError extends Error {
  readonly ruleId = "derivation-undeclared-source";
  constructor(
    readonly sourceId: string,
    readonly trackId?: string,
  ) {
    super(
      `Plugin on track "${trackId ?? "unknown"}" attempted to read undeclared source "${sourceId}".`,
    );
    this.name = "DerivationUndeclaredSourceError";
  }
}
