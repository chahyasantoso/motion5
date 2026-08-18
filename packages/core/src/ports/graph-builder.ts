import type { ProjectDefinition } from "../contract/v5";
import type { GraphBuildResult } from "../graph/ir";

export interface GraphBuilder {
  build(project: ProjectDefinition): GraphBuildResult;
}
