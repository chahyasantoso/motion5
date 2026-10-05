import type { SolverChainShape } from "../contract/solver-shape";

export type PluginCapability = Readonly<{
  chain: SolverChainShape;
  pole: boolean;
  joint: boolean;
}>;

/** The graph's narrow view of declarations (ADR-136); undefined means not judged here. */
export interface PluginCapabilities {
  capabilityOf(plugin: string): PluginCapability | undefined;
  /** Sorted, frozen, rebuilt only when a new tree member is admitted. */
  dedicatedMembers(): readonly string[];
}

const NONE: readonly string[] = Object.freeze([]);
export const UNJUDGED_CAPABILITIES: PluginCapabilities = Object.freeze({
  capabilityOf: () => undefined,
  dedicatedMembers: () => NONE,
});
