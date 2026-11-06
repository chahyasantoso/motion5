import type { AdmittedPlugin, Model } from "../contract/v5";

/** The graph's view of plugin declarations: admission, definition, model and two id lists. */
export interface PluginCapabilities {
  isPluginAdmitted(plugin: string): boolean;
  pluginDefinition(plugin: string): AdmittedPlugin | undefined;
  model(id: string): Model<unknown, unknown> | undefined;
  pluginIds(): readonly string[];
  modelIds(): readonly string[];
}
