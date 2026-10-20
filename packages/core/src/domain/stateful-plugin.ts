import type { PluginDefinition, StatefulPluginDefinition } from "./plugins";

export function defineStatefulPlugin<S, P>(
  definition: StatefulPluginDefinition<S, P>,
): PluginDefinition {
  // one cast: S and P are erased at the registry boundary; typed callbacks stay typed for authors
  return Object.freeze(definition) as unknown as PluginDefinition;
}
