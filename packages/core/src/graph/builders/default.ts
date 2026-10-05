import { buildGraphIR } from "../ir";
import type { GraphBuilder } from "../../ports/graph-builder";
import type { PluginCapabilities } from "../../ports/plugin-capabilities";

export function createDefaultGraphBuilder(capabilities: PluginCapabilities): GraphBuilder {
  return { build: (project) => buildGraphIR(project, capabilities) };
}
