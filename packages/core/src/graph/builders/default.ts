import { buildGraphIR } from "../ir";
import type { GraphBuilder } from "../../ports/graph-builder";
import type { PluginCapabilities } from "../../ports/plugin-capabilities";
import type { CommittedContract } from "../committed-contract";

export function createDefaultGraphBuilder(capabilities: PluginCapabilities): GraphBuilder {
  return {
    build: (project, carried?: ReadonlyMap<string, CommittedContract>) =>
      buildGraphIR(project, capabilities, carried),
  };
}
