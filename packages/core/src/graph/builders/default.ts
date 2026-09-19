import { buildGraphIR } from "../ir";
import type { GraphBuilder } from "../../ports/graph-builder";

export const defaultGraphBuilder: GraphBuilder = {
  build: buildGraphIR,
};
