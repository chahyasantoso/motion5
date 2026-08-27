import type {
  Diagnostic,
  ObservationDefinition,
  PluginRequiresBinding,
  ProjectDefinition,
  TrackDefinition,
} from "../contract/v5";
import { readPluginBindings } from "../contract/keyframe-shape";
import { compareCodeUnits } from "./compare";
import {
  assertAuthoredMotionId,
  assertAuthoredTrackId,
  qualifyFreeTrack,
  qualifyMotionTrack,
} from "./ids";
import { orderGraph } from "./order";

export interface EdgeRequirement {
  readonly plugin: string;
  readonly slot: string;
}
/**
 * One edge of the observation graph.
 *
 * `role` names the composition phase rather than an authored field: inputs are collected before
 * `node.compose`, outputs are merged after it. It is not derivable-and-redundant even though every
 * input edge now carries a `requirement`, because a conditional inside the single ordering owner is
 * worse than a field two resolvers set with one literal each. `J-5` pins the equivalence over a
 * whole built graph, so the two cannot disagree. See ADR-047.
 */
export interface GraphEdge {
  readonly observerId: string;
  readonly sourceId: string;
  readonly role: "input" | "output";
  readonly requirement?: EdgeRequirement;
}
export interface SolveMember {
  readonly id: string;
  readonly base: string;
}

export interface GraphNode {
  readonly id: string;
  readonly owner: "motion" | "free";
  readonly authoredIndex: number;
  readonly track: TrackDefinition;
  readonly edges: readonly GraphEdge[];
  readonly solves?: readonly SolveMember[];
}
export interface GraphIR {
  readonly nodes: readonly GraphNode[];
  readonly nodeById: Readonly<Record<string, GraphNode>>;
  readonly order: readonly string[];
  readonly diagnostics: readonly Diagnostic[];
}
export interface GraphBuildResult {
  readonly graph?: GraphIR;
  readonly diagnostics: readonly Diagnostic[];
}

function field(value: string): string {
  return `${value.length}:${value}`;
}

function requirementIdentity(edge: GraphEdge): string {
  const requirement = edge.requirement;
  if (requirement === undefined) return "-";
  return `${field(requirement.plugin)}${field(requirement.slot)}`;
}

function requirementOrder(edge: GraphEdge): string {
  return edge.requirement === undefined ? "-" : `:${edge.requirement.plugin}`;
}

/**
 * The injective identity encoding for an edge.
 *
 * Every part is length-prefixed, so no authored string can forge a field boundary. The requirement
 * plugin and slot are the only authored string pair left inside it, now that the canonical
 * projection is gone with the primitive it encoded. See ADR-034, ADR-046, and ADR-047.
 */
export function edgeKey(edge: GraphEdge): string {
  return [
    field(edge.observerId),
    field(edge.sourceId),
    field(edge.role),
    field(requirementIdentity(edge)),
  ].join("");
}

export function compareEdges(a: GraphEdge, b: GraphEdge): number {
  return (
    compareCodeUnits(a.observerId, b.observerId) ||
    compareCodeUnits(a.sourceId, b.sourceId) ||
    compareCodeUnits(a.role, b.role) ||
    compareCodeUnits(requirementOrder(a), requirementOrder(b)) ||
    compareCodeUnits(a.requirement?.slot ?? "", b.requirement?.slot ?? "")
  );
}

export function describeEdge(edge: GraphEdge): string {
  const requirement = edge.requirement;
  const scope = requirement === undefined ? "" : ` [${requirement.plugin}.${requirement.slot}]`;
  return `${edge.observerId} <- ${edge.sourceId} (${edge.role})${scope}`;
}

function freeze<T>(value: T): T {
  return Object.freeze(value);
}

export function diag(
  ruleId: string,
  path: string,
  message: string,
  ids?: readonly string[],
): Diagnostic {
  return { ruleId, path, message, severity: "error", ...(ids ? { ids } : {}) };
}

export function compareDiagnostics(a: Diagnostic, b: Diagnostic): number {
  return compareCodeUnits(a.ruleId, b.ruleId) || compareCodeUnits(a.path, b.path);
}

export function qualifySource(source: string, motionId: string): string {
  if (source.startsWith("~/")) return qualifyFreeTrack(source.slice(2)).value;
  if (source.includes("/"))
    return qualifyMotionTrack(
      source.slice(0, source.indexOf("/")),
      source.slice(source.indexOf("/") + 1),
    ).value;
  return qualifyMotionTrack(motionId, source).value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export interface ResolvedEdge {
  readonly edge?: GraphEdge;
  readonly diagnostics: readonly Diagnostic[];
}

const BIND_INSTEAD = "Bind the dependency under keyframes.<plugin>.requires instead.";
const TARGET_UNSUPPORTED = `Observation target is not supported; an observes entry declares an output edge and names no destination key. ${BIND_INSTEAD}`;
const ROLE_UNSUPPORTED = `Observation role is not supported; an observes entry declares an output edge only. ${BIND_INSTEAD}`;
const PROJECTION_UNSUPPORTED = `Observation projection is not supported; an output edge merges the source patch whole and renames nothing. ${BIND_INSTEAD}`;

/**
 * Reads a removed authored field through the record view.
 *
 * The member is gone from `ObservationDefinition`, so a TypeScript author cannot write it, and a
 * JavaScript author still can. Reading it structurally is what turns "undeclared" into "refused",
 * which is the difference between a removal and a field accepted and then ignored. See ADR-046.
 */
function readRemoved(observation: ObservationDefinition, name: string): unknown {
  return isRecord(observation) ? observation[name] : undefined;
}

export function resolveObservationEdge(
  observation: ObservationDefinition,
  observerNodeId: string,
  ownerId: string,
  path: string,
): ResolvedEdge {
  const diagnostics: Diagnostic[] = [];
  if (typeof observation.source !== "string" || observation.source.length === 0) {
    diagnostics.push(diag("observation-source", path, "Observation source must be non-empty."));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  // Three removed fields, one rule id each, because a diagnostic has to name what the author
  // actually wrote rather than the removal they share. The target guard stays first, so ADR-046's
  // `V-2` through `V-4` still report a target for a fixture that also carries a role.
  if (readRemoved(observation, "target") !== undefined) {
    diagnostics.push(diag("observation-target-unsupported", path, TARGET_UNSUPPORTED));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  if (readRemoved(observation, "role") !== undefined) {
    diagnostics.push(diag("observation-role-unsupported", path, ROLE_UNSUPPORTED));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  if (readRemoved(observation, "projection") !== undefined) {
    diagnostics.push(diag("observation-projection-unsupported", path, PROJECTION_UNSUPPORTED));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  let sourceId: string;
  try {
    sourceId = qualifySource(observation.source, ownerId);
  } catch (error) {
    diagnostics.push(
      diag("observation-source", path, String(error instanceof Error ? error.message : error), [
        observation.source,
      ]),
    );
    return { diagnostics: Object.freeze(diagnostics) };
  }
  // One literal, in one place. `role` is not read from authored input any more, so this resolver
  // and `resolveRequirementEdge` are the only two things that can set it, one value each.
  const edge: GraphEdge = Object.freeze({
    observerId: observerNodeId,
    sourceId,
    role: "output",
  });
  return { edge, diagnostics: Object.freeze([]) };
}

export function resolveRequirementEdge(
  binding: PluginRequiresBinding,
  observerNodeId: string,
  ownerId: string,
  path: string,
): ResolvedEdge {
  let sourceId: string;
  try {
    sourceId = qualifySource(binding.source, ownerId);
  } catch (error) {
    const message = String(error instanceof Error ? error.message : error);
    return {
      diagnostics: Object.freeze([diag("requirement-source", path, message, [binding.source])]),
    };
  }
  const edge: GraphEdge = Object.freeze({
    observerId: observerNodeId,
    sourceId,
    role: "input",
    requirement: Object.freeze({ plugin: binding.plugin, slot: binding.slot }),
  });
  return { edge, diagnostics: Object.freeze([]) };
}

export function observationEdgeKey(
  observation: ObservationDefinition,
  observerId: string,
  ownerId: string,
): string {
  const resolved = resolveObservationEdge(observation, observerId, ownerId, "observation");
  if (resolved.edge === undefined)
    throw new TypeError(
      resolved.diagnostics
        .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
        .join(" "),
    );
  return edgeKey(resolved.edge);
}

export function collectTrack(
  track: TrackDefinition,
  owner: "motion" | "free",
  ownerId: string,
  authoredIndex: number,
  diagnostics: Diagnostic[],
): GraphNode | undefined {
  try {
    assertAuthoredTrackId(track.id);
  } catch (error) {
    diagnostics.push(
      diag(
        "track-id",
        `${owner === "free" ? "freeTracks" : `motions[${authoredIndex}]`}.id`,
        String(error instanceof Error ? error.message : error),
      ),
    );
    return undefined;
  }
  const id =
    owner === "free"
      ? qualifyFreeTrack(track.id).value
      : qualifyMotionTrack(ownerId, track.id).value;
  const edges: GraphEdge[] = [];
  for (const [index, observation] of (track.observes ?? []).entries()) {
    const path = `${owner === "free" ? `freeTracks[${authoredIndex}]` : `motions[${authoredIndex}].tracks[${index}].observes`}`;
    const resolved = resolveObservationEdge(observation, id, ownerId, path);
    diagnostics.push(...resolved.diagnostics);
    if (resolved.edge !== undefined) edges.push(resolved.edge);
  }
  // Derived from the authored form, with no plugin registry in reach. Whether `fk` is registered
  // and declares `base` is `PluginRegistry.resolveForKeyframes`' question; whether the source is a
  // node, is not this node, and introduces no cycle is this layer's. That split is what lets
  // `validateV5` build the graph without holding a registry it must not have. See ADR-044.
  for (const binding of readPluginBindings(track.keyframes)) {
    const bindingPath = `${id}.keyframes.${binding.authoredPath}`;
    const resolved = resolveRequirementEdge(binding, id, ownerId, bindingPath);
    diagnostics.push(...resolved.diagnostics);
    if (resolved.edge !== undefined) edges.push(resolved.edge);
  }
  return Object.freeze({ id, owner, authoredIndex, track, edges: Object.freeze(edges) });
}

export function buildGraphIR(project: ProjectDefinition): GraphBuildResult {
  const diagnostics: Diagnostic[] = [];
  const nodes: GraphNode[] = [];
  const seen = new Set<string>();
  const motionIds = new Set<string>();
  for (const [motionIndex, motion] of project.motions.entries()) {
    try {
      assertAuthoredMotionId(motion.id);
    } catch (error) {
      diagnostics.push(
        diag(
          "motion-id",
          `motions[${motionIndex}].id`,
          String(error instanceof Error ? error.message : error),
        ),
      );
      continue;
    }
    if (motionIds.has(motion.id)) {
      diagnostics.push(
        diag(
          "motion-duplicate",
          `motions[${motionIndex}].id`,
          `Duplicate motion id "${motion.id}".`,
          [motion.id],
        ),
      );
      continue;
    }
    motionIds.add(motion.id);
    for (const [trackIndex, track] of motion.tracks.entries()) {
      const node = collectTrack(track, "motion", motion.id, trackIndex, diagnostics);
      if (node) {
        if (seen.has(node.id))
          diagnostics.push(
            diag(
              "node-duplicate",
              `motions[${motionIndex}].tracks[${trackIndex}].id`,
              `Duplicate node id "${node.id}".`,
              [node.id],
            ),
          );
        else {
          seen.add(node.id);
          nodes.push(node);
        }
      }
    }
  }
  for (const [trackIndex, track] of (project.freeTracks ?? []).entries()) {
    const node = collectTrack(track, "free", "~", trackIndex, diagnostics);
    if (node) {
      if (seen.has(node.id))
        diagnostics.push(
          diag(
            "node-duplicate",
            `freeTracks[${trackIndex}].id`,
            `Duplicate node id "${node.id}".`,
            [node.id],
          ),
        );
      else {
        seen.add(node.id);
        nodes.push(node);
      }
    }
  }
  return finalizeGraph(nodes, diagnostics);
}

function authorsRotation(keyframes: unknown): boolean {
  if (!isRecord(keyframes)) return false;
  if (keyframes.rotation !== undefined) return true;
  for (const key of Object.keys(keyframes)) {
    const group = keyframes[key];
    if (isRecord(group)) {
      if (group.rotation !== undefined) return true;
      const values = group.values;
      if (isRecord(values) && values.rotation !== undefined) return true;
    }
  }
  return false;
}

export function resolveSolvers(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
): readonly GraphNode[] {
  const nodeMap = new Map<string, GraphNode>();
  for (const node of nodes) nodeMap.set(node.id, node);

  // Diagnostic 3: ik-mode-ambiguous
  // Diagnostic 4: ik-solved-rotation-dead
  for (const node of nodes) {
    let rootCount = 0;
    let hasSolver = false;
    let hasTarget = false;
    for (const edge of node.edges) {
      if (edge.role === "input" && edge.requirement) {
        if (edge.requirement.slot === "root") rootCount++;
        if (edge.requirement.slot === "solver") hasSolver = true;
        if (edge.requirement.slot === "target") hasTarget = true;
      }
    }
    if ((hasSolver && (rootCount > 0 || hasTarget)) || rootCount > 1) {
      diagnostics.push(
        diag(
          "ik-mode-ambiguous",
          node.id,
          `Node "${node.id}" has ambiguous IK mode configuration.`,
          [node.id],
        ),
      );
    }
    if (hasSolver && authorsRotation(node.track.keyframes)) {
      diagnostics.push(
        diag(
          "ik-solved-rotation-dead",
          node.id,
          `Member "${node.id}" bound to solver cannot author rotation.`,
          [node.id],
        ),
      );
    }
  }

  const solvesMap = new Map<string, readonly SolveMember[]>();

  // Every node that at least one member points its `solver` slot at.
  //
  // A solver is classified by its `root` edge, so a node bound as one without holding a root is not
  // a solver at all and the derivation below skips it. Skipping it silently is the one IK
  // misconfiguration that had no symptom: no `solves` was derived, no `rotations` were published,
  // every member fell back to its own authored rotation, and the rig held a broken pose with no
  // error and no diagnostic. It is also the one shape `GraphPublisher` cannot read a member scope
  // off, so refusing it here is what keeps that throw unreachable rather than merely unreached.
  // Collected from the members rather than from the solver, because the absent edge is on the
  // solver and only a member can say the node was meant to be one. See ADR-051.
  const boundSolverIds = new Set<string>();
  for (const node of nodes) {
    for (const edge of node.edges) {
      if (edge.role === "input" && edge.requirement?.slot === "solver") {
        boundSolverIds.add(edge.sourceId);
      }
    }
  }

  // Resolve solvers
  for (const solver of nodes) {
    const rootEdge = solver.edges.find((e) => e.role === "input" && e.requirement?.slot === "root");
    // Diagnostic 1: ik-solver-no-root
    if (!rootEdge) {
      if (boundSolverIds.has(solver.id)) {
        diagnostics.push(
          diag(
            "ik-solver-no-root",
            solver.id,
            `Solver "${solver.id}" has no bound root requirement.`,
            [solver.id],
          ),
        );
      }
      continue;
    }
    const rootId = rootEdge.sourceId;

    const members = nodes.filter((n) =>
      n.edges.some(
        (e) => e.role === "input" && e.requirement?.slot === "solver" && e.sourceId === solver.id,
      ),
    );

    // Diagnostic 2: ik-solver-no-members
    if (members.length === 0) {
      diagnostics.push(
        diag(
          "ik-solver-no-members",
          solver.id,
          `Solver "${solver.id}" has no member nodes bound to it.`,
          [solver.id],
        ),
      );
      continue;
    }

    // Diagnostic 5: ik-solver-unsupported-arity
    if (members.length !== 2) {
      diagnostics.push(
        diag(
          "ik-solver-unsupported-arity",
          solver.id,
          `Solver "${solver.id}" has unsupported arity (${members.length}); only 2-bone solvers are supported.`,
          [solver.id],
        ),
      );
    }

    interface MemberWithDepth {
      readonly node: GraphNode;
      readonly base: string;
      readonly depth: number;
    }

    const membersWithDepth: MemberWithDepth[] = [];

    const memberIds = new Set(members.map((m) => m.id));

    for (const m of members) {
      const baseEdge = m.edges.find((e) => e.role === "input" && e.requirement?.slot === "base");
      if (!baseEdge) {
        diagnostics.push(
          diag(
            "ik-solver-unreachable-root",
            m.id,
            `Member "${m.id}" cannot reach solver root "${rootId}".`,
            [m.id, rootId],
          ),
        );
        continue;
      }
      const memberBase = baseEdge.sourceId;

      // If base is not another member of this solver and not rootId, this member's root link is broken
      if (memberBase !== rootId && !memberIds.has(memberBase)) {
        diagnostics.push(
          diag(
            "ik-solver-unreachable-root",
            m.id,
            `Member "${m.id}" cannot reach solver root "${rootId}".`,
            [m.id, rootId],
          ),
        );
      }

      let currId: string | undefined = memberBase;
      let depth = 1;
      const visited = new Set<string>();

      while (currId !== undefined) {
        if (currId === rootId) break;
        if (visited.has(currId)) break;
        visited.add(currId);
        const parentNode = nodeMap.get(currId);
        if (!parentNode) break;
        const pBaseEdge = parentNode.edges.find(
          (e) => e.role === "input" && e.requirement?.slot === "base",
        );
        currId = pBaseEdge?.sourceId;
        depth++;
      }

      membersWithDepth.push({
        node: m,
        base: memberBase,
        depth,
      });
    }

    membersWithDepth.sort(
      (a, b) =>
        a.depth - b.depth ||
        a.node.authoredIndex - b.node.authoredIndex ||
        compareCodeUnits(a.node.id, b.node.id),
    );

    solvesMap.set(
      solver.id,
      freeze(membersWithDepth.map((m) => freeze({ id: m.node.id, base: m.base }))),
    );
  }

  return freeze(
    nodes.map((node) => {
      const solves = solvesMap.get(node.id);
      return solves ? freeze({ ...node, solves }) : node;
    }),
  );
}

/**
 * Validates collected nodes and diagnostics, linearizes them, and freezes the result.
 *
 * The one owner of the graph-building tail, so `buildGraphIR` and the incremental builder cannot
 * drift about duplicate/unknown/self-reference edges, diagnostic ordering, cycle rejection, or the
 * frozen result shape. Any solver derivation (issue #195, slice C2) lands here and is therefore
 * reached by both load-time validation and the runtime through one call site.
 */
export function finalizeGraph(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
): GraphBuildResult {
  const known = new Set(nodes.map((node) => node.id));
  const edgeKeys = new Set<string>();
  for (const node of nodes)
    for (const edge of node.edges) {
      const key = edgeKey(edge);
      if (edgeKeys.has(key))
        diagnostics.push(
          diag(
            "observation-duplicate",
            edge.observerId,
            `Duplicate observation edge ${describeEdge(edge)}.`,
            [edge.observerId, edge.sourceId],
          ),
        );
      edgeKeys.add(key);
      if (!known.has(edge.sourceId))
        diagnostics.push(
          diag(
            "observation-unknown-source",
            edge.observerId,
            `Unknown observation source "${edge.sourceId}".`,
            [edge.sourceId],
          ),
        );
      if (edge.sourceId === edge.observerId)
        diagnostics.push(
          diag(
            "observation-self-reference",
            edge.observerId,
            "Observation cannot reference itself.",
            [edge.observerId],
          ),
        );
    }
  const resolvedNodes = resolveSolvers(nodes, diagnostics);
  diagnostics.sort(compareDiagnostics);
  if (diagnostics.some(({ severity }) => severity === "error"))
    return { diagnostics: Object.freeze(diagnostics) };
  const ordering = orderGraph(resolvedNodes);
  if (ordering.order === undefined)
    return {
      diagnostics: Object.freeze(
        [...diagnostics, ...ordering.diagnostics].sort(compareDiagnostics),
      ),
    };
  const nodeById: Record<string, GraphNode> = {};
  for (const node of resolvedNodes) nodeById[node.id] = node;
  return {
    graph: freeze({
      nodes: freeze(resolvedNodes),
      nodeById: freeze(nodeById),
      order: ordering.order,
      diagnostics: freeze(diagnostics),
    }),
    diagnostics: freeze(diagnostics),
  };
}
