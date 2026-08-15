import { buildGraphIR } from "../../graph/ir";
import type { GraphBuilder } from "../../ports/graph-builder";

export const defaultGraphBuilder: GraphBuilder = {
  build: buildGraphIR,
};
