import type { AdmittedPlugin, Model } from "../contract/v5";
import type { ParseContext } from "../contract/v5-parse";

/** The graph's view of plugin declarations: admission, definition, model and two id lists. */
export interface PluginCapabilities {
  isPluginAdmitted(plugin: string): boolean;
  pluginDefinition(plugin: string): AdmittedPlugin | undefined;
  model(id: string): Model<unknown, unknown> | undefined;
  pluginIds(): readonly string[];
  modelIds(): readonly string[];
}

/** The parse context a graph view of plugin declarations answers, one per capabilities source. */
export function parseContextOf(capabilities: PluginCapabilities): ParseContext {
  return {
    isPluginRegistered: (pluginId) => capabilities.isPluginAdmitted(pluginId),
    pluginDefinition: (pluginId) => capabilities.pluginDefinition(pluginId),
    model: (modelId) => capabilities.model(modelId),
    modelIds: () => capabilities.modelIds(),
    pluginIds: () => capabilities.pluginIds(),
  };
}
