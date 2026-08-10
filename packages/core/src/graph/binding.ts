import type { ProjectDefinition } from "../contract/v5";
import { buildGraphIR, edgeKey, type GraphIR } from "./ir";
import { ObservationState } from "./observation-state";

export interface GraphBindingHooks {
  /** Failure injection for the transaction stages, used by the rollback harness. */
  readonly afterStateApply?: () => void;
  readonly afterScheduleApply?: () => void;
}

export interface GraphBindingOptions {
  readonly state?: ObservationState;
  readonly hooks?: GraphBindingHooks;
}

function requireGraph(project: ProjectDefinition): GraphIR {
  const result = buildGraphIR(project);
  if (result.graph === undefined) {
    const first = result.diagnostics[0];
    throw new TypeError(
      first === undefined
        ? "Graph candidate is invalid."
        : `${first.ruleId} at ${first.path}: ${first.message}`,
    );
  }
  return result.graph;
}

function edgeMap(graph: GraphIR): Map<string, GraphIR["nodes"][number]["edges"][number]> {
  const result = new Map<string, GraphIR["nodes"][number]["edges"][number]>();
  for (const node of graph.nodes) for (const edge of node.edges) result.set(edgeKey(edge), edge);
  return result;
}

/**
 * The only coordinator for replacing a committed graph candidate.
 *
 * Candidates are normalized and validated before live state is touched. State changes are
 * then applied in a reversible order, publisher scheduling is represented by the hook until
 * its owner exists, and only after both succeed is the immutable graph snapshot swapped.
 * Every pre-commit failure rolls the same ObservationState back and rethrows the original
 * error. P2-06 owns this transaction path; P3 adds the real schedule and invalidation owners.
 */
export class GraphBinding {
  readonly #state: ObservationState;
  readonly #hooks: GraphBindingHooks;
  #graph: GraphIR;

  constructor(project: ProjectDefinition, options: GraphBindingOptions = {}) {
    this.#state = options.state ?? new ObservationState();
    this.#hooks = options.hooks ?? {};
    this.#graph = requireGraph(project);
    this.#populate(this.#graph);
    this.#state.commit();
  }

  get state(): ObservationState {
    return this.#state;
  }

  get graph(): GraphIR {
    return this.#graph;
  }

  /** Build, validate, apply, and atomically commit a candidate project. */
  replace(project: ProjectDefinition): void {
    const candidate = requireGraph(project);
    try {
      this.#applyDelta(this.#graph, candidate);
      this.#hooks.afterStateApply?.();
      this.#hooks.afterScheduleApply?.();
      this.#graph = candidate;
      this.#state.commit();
    } catch (error) {
      this.#state.rollback();
      throw error;
    }
  }

  #populate(graph: GraphIR): void {
    for (const id of graph.order) this.#state.addNode(id);
    for (const node of graph.nodes) for (const edge of node.edges) this.#state.addEdge(edge);
  }

  #applyDelta(previous: GraphIR, next: GraphIR): void {
    const previousEdges = edgeMap(previous);
    const nextEdges = edgeMap(next);
    const previousIds = new Set(previous.nodes.map(({ id }) => id));
    const nextIds = new Set(next.nodes.map(({ id }) => id));

    for (const key of previousEdges.keys())
      if (!nextEdges.has(key)) this.#state.removeEdge(previousEdges.get(key)!);
    for (const id of previousIds) if (!nextIds.has(id)) this.#state.removeNode(id);
    for (const id of nextIds) if (!previousIds.has(id)) this.#state.addNode(id);
    for (const [key, edge] of nextEdges) if (!previousEdges.has(key)) this.#state.addEdge(edge);
  }
}
