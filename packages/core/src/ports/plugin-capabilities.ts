import type { SolverChainShape } from "../contract/solver-shape";

// F2 deletes this port with the legacy compose channel and its solver-chain declarations.
export type PluginCapability = Readonly<{
  chain: SolverChainShape;
  pole: boolean;
  joint: boolean;
}>;

/** The graph's narrow view of declarations (ADR-136); undefined means not judged here. */
export interface PluginCapabilities {
  /** F2 deletes this legacy solver-capability lookup with the compose channel. */
  capabilityOf(plugin: string): PluginCapability | undefined;
  /** Sorted, frozen, rebuilt only when a new tree member is admitted. F2 deletes it. */
  dedicatedMembers(): readonly string[];
  /**
   * True only for a registered definition admitted on the new path; unknown or unjudged plugins are
   * not exempt, so the graph keeps classifying them exactly as before. F2 deletes it.
   */
  isNewPath(plugin: string): boolean;
}

const NONE: readonly string[] = Object.freeze([]);
export const UNJUDGED_CAPABILITIES: PluginCapabilities = Object.freeze({
  capabilityOf: () => undefined,
  dedicatedMembers: () => NONE,
  isNewPath: () => false,
});
