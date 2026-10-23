import type { PluginDefinition } from "../contract/v5";
import type { SolverChainShape } from "../contract/solver-shape";

export type PluginCapability = Readonly<{
  chain: SolverChainShape;
  pole: boolean;
  joint: boolean;
}>;

/**
 * The graph's narrow view of plugin declarations (ADR-136).
 *
 * `capabilityOf` answers for the grouped solver family and stays `undefined` for a registry that
 * only admits identified-table plugins. The two optional members are the identified-table
 * extension: a catalog answers whether an id is admitted and, when it is, hands the graph the
 * definition whose slots and outputs it needs. Keeping them optional is what lets the retired
 * grouped registry keep implementing this port without pretending to know the new contract.
 */
export interface PluginCapabilities {
  capabilityOf(plugin: string): PluginCapability | undefined;
  /** Sorted, frozen, rebuilt only when a new tree member is admitted. */
  dedicatedMembers(): readonly string[];
  /** Whether an id names an admitted identified-table plugin. */
  isPluginAdmitted?(plugin: string): boolean;
  /** The admitted definition, or `undefined` when no identified-table plugin owns the id. */
  pluginDefinition?(plugin: string): PluginDefinition | undefined;
}

const NONE: readonly string[] = Object.freeze([]);
export const UNJUDGED_CAPABILITIES: PluginCapabilities = Object.freeze({
  capabilityOf: () => undefined,
  dedicatedMembers: () => NONE,
});
