import type { ProjectDefinition } from "../contract/v5";
import type { GraphBuildResult } from "../graph/ir";
import type { CommittedContract } from "../graph/committed-contract";

export interface GraphBuilder {
  /**
   * Builds one graph, carrying the committed contracts a caller has already decided must survive.
   *
   * The map is keyed by node id and holds only contracts the caller is sure about; anything absent
   * is derived from the track. A builder that ignores it is correct for a load and wrong for a
   * rebuild after a cheap edit, which is why the runtime's builder takes it.
   */
  build(
    project: ProjectDefinition,
    carried?: ReadonlyMap<string, CommittedContract>,
  ): GraphBuildResult;
}
