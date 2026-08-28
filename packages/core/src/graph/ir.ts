import type {
  Diagnostic,
  ObservationDefinition,
  PluginRequiresBinding,
  ProjectDefinition,
  TrackDefinition,
} from "../contract/v5";
import { readPluginBindings } from "../contract/keyframe-shape";
import { readGoalSlot } from "../contract/solver-slots";
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
  /**
   * The node whose frame this member reaches toward, present only on a chain leaf the author gave a
   * goal.
   *
   * Qualified here, in the one layer that knows the member set, so the publisher joins a node id it
   * can read straight off the registry rather than an authored key it would have to qualify a second
   * time against an owner it does not hold. A solver that authored the bare `target` slot carries no
   * goal on any member, which is what keeps that spelling working with no migration. See issue #195.
   */
  readonly goal?: string;
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

/**
 * Whether the group that binds `solver` authors a `rotation` of its own.
 *
 * Read inside that group rather than across every group and the flat top level. The solved rotation
 * replaces the authored one inside the plugin that reads `rotations` back, which is the plugin that
 * bound the slot, so a `rotation` under any other group is that plugin's own live input and
 * refusing it would be this rule answering for a plugin it knows nothing about. The diagnostics
 * guide already states the rule this way; the narrowing is the code catching up to its own
 * documentation.
 *
 * Two shapes it deliberately no longer reports, because each already has a more specific owner. A
 * `rotation` directly under the plugin name is the pre-ADR-049 group form, refused as
 * `keyframes-missing-values-section`. And a flat `rotation` names no group at all: attributing a
 * flat key to a plugin is the registry's question, and this layer holds no registry by design, so a
 * member authoring one meets `plugin-ambiguous-key` in any registry with two claimants and
 * `plugin-unknown-key` in one with none. See ADR-043, ADR-044, ADR-049, and ADR-051.
 */
function authorsSolvedRotation(keyframes: unknown, binders: readonly string[]): boolean {
  if (!isRecord(keyframes)) return false;
  for (const binder of binders) {
    const group = keyframes[binder];
    if (!isRecord(group)) continue;
    const values = group.values;
    if (isRecord(values) && values.rotation !== undefined) return true;
  }
  return false;
}

/** The node this one hangs from through its `base` slot, or `undefined` when it binds none. */
function baseOf(node: GraphNode): string | undefined {
  const edge = node.edges.find((e) => e.role === "input" && e.requirement?.slot === "base");
  return edge?.sourceId;
}

/**
 * The owner a node's authored sources were qualified against, recovered from its own qualified id.
 *
 * `collectTrack` qualifies against the motion id, or `~` for a free track, and both spellings put
 * that owner before the first `/` of the node id. Recovering it here is what lets a goal key be
 * qualified in the one layer that knows the member set, without adding a field to `GraphNode` that
 * two owners would then have to keep in step with the id it is derived from. An authored goal key
 * therefore qualifies exactly as an authored `base` source does, including a free-track solver
 * having to spell its members out, which is a requirement its own bindings already carry.
 */
function ownerOf(node: GraphNode): string {
  return node.id.slice(0, node.id.indexOf("/"));
}

interface MemberChain {
  readonly node: GraphNode;
  readonly base: string;
  readonly depth: number;
}

/** One authored goal of a solver: the key as written, and the node it names as a source. */
interface AuthoredGoal {
  readonly slot: string;
  readonly authored: string;
  readonly sourceId: string;
}

/**
 * The goals one solver authored, in derived slot order.
 *
 * Sorted by the derived slot rather than by `compareEdges`, whose first key is the source id: two
 * goals pointing at one node would otherwise be ordered by nothing, and the authored key is what a
 * duplicate diagnostic has to list. Order is a pure function of authored ids either way.
 */
function authoredGoalsOf(solver: GraphNode): readonly AuthoredGoal[] {
  const goals: AuthoredGoal[] = [];
  for (const edge of solver.edges) {
    if (edge.role !== "input" || edge.requirement === undefined) continue;
    const authored = readGoalSlot(edge.requirement.slot);
    if (authored === undefined) continue;
    goals.push({ slot: edge.requirement.slot, authored, sourceId: edge.sourceId });
  }
  return goals.sort((a, b) => compareCodeUnits(a.slot, b.slot));
}

export function resolveSolvers(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
): readonly GraphNode[] {
  // Diagnostic 3: ik-mode-ambiguous
  // Diagnostic 4: ik-solved-rotation-dead
  // Diagnostic 7: ik-goal-conflict
  for (const node of nodes) {
    let rootCount = 0;
    let bareTarget = false;
    let goalCount = 0;
    // The plugins under which this node bound a `solver` slot, which is what scopes the dead
    // rotation read: the solve replaces the rotation of the plugin that asked for it.
    const solverBinders: string[] = [];
    for (const edge of node.edges) {
      if (edge.role === "input" && edge.requirement) {
        const slot = edge.requirement.slot;
        if (slot === "root") rootCount++;
        if (slot === "solver") solverBinders.push(edge.requirement.plugin);
        if (slot === "target") bareTarget = true;
        if (readGoalSlot(slot) !== undefined) goalCount += 1;
      }
    }
    const hasSolver = solverBinders.length > 0;
    // Read through the grammar rather than off the literal `"target"`. A member binding `solver`
    // beside a goal dict would otherwise load clean, with one real input edge per goal, and have
    // every one of them ignored: a field accepted and then ignored, which is what ADR-033 rule 6
    // forbids. See issue #195.
    const hasGoal = bareTarget || goalCount > 0;
    if ((hasSolver && (rootCount > 0 || hasGoal)) || rootCount > 1) {
      diagnostics.push(
        diag(
          "ik-mode-ambiguous",
          node.id,
          `Node "${node.id}" has ambiguous IK mode configuration.`,
          [node.id],
        ),
      );
    }
    // Both spellings on one solver are two names for one dependency. The dict is the general case
    // and the bare slot is its degenerate one, so they are refused together rather than merged:
    // merging would make which goal a leaf reaches for a property of the reader.
    if (bareTarget && goalCount > 0) {
      diagnostics.push(
        diag(
          "ik-goal-conflict",
          node.id,
          `Solver "${node.id}" binds both "target" and the goals dict; goals are addressed one way or the other.`,
          [node.id],
        ),
      );
    }
    if (hasSolver && authorsSolvedRotation(node.track.keyframes, solverBinders)) {
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

    // Arity is not refused here any more. `ik-solver-unsupported-arity` reported every derived
    // member count other than two, which was honest while the closed form was the only solve a rig
    // could reach and false the moment `solveChain` dispatches on derived shape. A rule that
    // refuses a shape the code solves is worse than no rule, so it is deleted rather than widened.
    // What the cap was silently guaranteeing is refused by name below instead. See issue #195.

    // Diagnostic 6: ik-solver-unreachable-root
    //
    // One walk per member, confined to the member set. The `base` edge lookup that verified a
    // member and the `while` loop that measured its depth were two traversals of one chain, and the
    // second climbed through arbitrary nodes to count hops. Starting the walk at the member itself
    // makes its own `base` edge the first step, and the only map the walk steps through holds this
    // solver's members, so leaving that set is the break rather than something to check for after.
    //
    // A break is attributed to the member whose own `base` broke the chain rather than to the
    // member the walk started from, and it is keyed by id, so a chain of descendants over one bad
    // ancestor reports once rather than once per descendant. That is the attribution the two passes
    // produced, which is what makes this a refactor rather than a rule change: `RS-8` pins it over
    // the chain shapes both of them had to answer for. See ADR-051.
    const memberById = new Map(members.map((member) => [member.id, member] as const));
    const unreachable = new Map<string, Diagnostic>();
    const chains: MemberChain[] = [];

    for (const member of members) {
      let base = "";
      let depth = 0;
      let cursor: GraphNode | undefined = member;
      const walked = new Set<string>([member.id]);
      while (cursor !== undefined) {
        const next = baseOf(cursor);
        if (next === undefined || (next !== rootId && !memberById.has(next))) {
          unreachable.set(
            cursor.id,
            diag(
              "ik-solver-unreachable-root",
              cursor.id,
              `Member "${cursor.id}" cannot reach solver root "${rootId}".`,
              [cursor.id, rootId],
            ),
          );
          break;
        }
        depth += 1;
        if (depth === 1) base = next;
        // The root ends the walk. A member already walked ends it too, and the cycle that shape is
        // belongs to `orderGraph`, which refuses it over these same `base` edges.
        if (next === rootId || walked.has(next)) break;
        walked.add(next);
        cursor = memberById.get(next);
      }
      // A member holding no `base` edge of its own contributes no chain, which is what the two
      // passes did. Every break above is an error, so no `solves` derived beside one is reachable
      // through `finalizeGraph`.
      if (depth > 0) chains.push({ node: member, base, depth });
    }

    for (const entry of [...unreachable.values()].sort(compareDiagnostics)) {
      diagnostics.push(entry);
    }

    chains.sort(
      (a, b) =>
        a.depth - b.depth ||
        a.node.authoredIndex - b.node.authoredIndex ||
        compareCodeUnits(a.node.id, b.node.id),
    );

    // Diagnostics 8 through 11: ik-goal-unknown-member, ik-goal-duplicate, ik-goal-not-leaf and
    // ik-leaf-without-goal, plus ik-target-not-single-leaf.
    //
    // Here because this is the only owner that can answer any of them. The authored key is a member
    // id, so "does it name a member of this chain" and "is that member a leaf" are both questions
    // about the `solver` edges this loop has already collected. `contract/` holds no registry and a
    // plugin holds no graph, which is the same split ADR-044 draws for keys: the contract layer owns
    // the spelling, the registry owns whether the slot is declared, and this owns whether it
    // resolves. See issue #195.
    //
    // Skipped when a chain broke above, for the reason `finalizeGraph` bails before this whole
    // derivation runs: over a chain that was never valid, leafhood answers about a shape the author
    // did not author, and one cause would be reported twice.
    const goalByMember = new Map<string, string>();
    const authoredGoals = authoredGoalsOf(solver);
    if (unreachable.size === 0) {
      const ownerId = ownerOf(solver);
      const based = new Set(chains.map((entry) => entry.base));
      const leaves = chains
        .filter((entry) => !based.has(entry.node.id))
        .map((entry) => entry.node.id);
      const leafIds = new Set(leaves);
      // Diagnostic 12: ik-target-not-single-leaf
      //
      // The bare `target` slot names no member, so it addresses a chain leaf only while there is
      // exactly one leaf to address. The arity cap guaranteed that for free, and lifting the cap is
      // what makes the shape reachable, so it is refused by name here rather than left to the plugin
      // quietly choosing one of the leaves it was handed: a binding accepted and then applied to an
      // arbitrary member is the shape ADR-033 rule 6 forbids. The dict is the general spelling, and
      // a branching chain addresses its goals by member id.
      const bindsBareTarget = solver.edges.some(
        (edge) => edge.role === "input" && edge.requirement?.slot === "target",
      );
      if (bindsBareTarget && leaves.length > 1) {
        diagnostics.push(
          diag(
            "ik-target-not-single-leaf",
            solver.id,
            `Solver "${solver.id}" binds "target" over a chain with ${leaves.length} leaves; address goals by member id instead.`,
            [solver.id, ...leaves],
          ),
        );
      }
      // One entry per member a goal resolved to, carrying every authored key that named it. The dict
      // cannot repeat a key, so a duplicate is always two spellings of one id (`forearm` and
      // `walker/forearm`), which is the narrow rule qualification leaves behind.
      const authoredFor = new Map<string, string[]>();
      const sourceFor = new Map<string, string>();
      for (const goal of authoredGoals) {
        let memberId: string | undefined;
        try {
          memberId = qualifySource(goal.authored, ownerId);
        } catch {
          memberId = undefined;
        }
        if (memberId === undefined || !memberById.has(memberId)) {
          diagnostics.push(
            diag(
              "ik-goal-unknown-member",
              solver.id,
              `Goal "${goal.authored}" of solver "${solver.id}" names no member of its chain.`,
              [solver.id, goal.authored],
            ),
          );
          continue;
        }
        const spellings = authoredFor.get(memberId);
        if (spellings === undefined) authoredFor.set(memberId, [goal.authored]);
        else spellings.push(goal.authored);
        sourceFor.set(memberId, goal.sourceId);
      }
      for (const memberId of [...authoredFor.keys()].sort(compareCodeUnits)) {
        const spellings = authoredFor.get(memberId) ?? [];
        if (spellings.length > 1) {
          diagnostics.push(
            diag(
              "ik-goal-duplicate",
              solver.id,
              `Member "${memberId}" of solver "${solver.id}" is named by more than one goal: ${spellings.join(", ")}.`,
              [solver.id, memberId],
            ),
          );
          continue;
        }
        if (!leafIds.has(memberId)) {
          diagnostics.push(
            diag(
              "ik-goal-not-leaf",
              solver.id,
              `Member "${memberId}" of solver "${solver.id}" carries a goal but is not a chain leaf.`,
              [solver.id, memberId],
            ),
          );
          continue;
        }
        const sourceId = sourceFor.get(memberId);
        if (sourceId !== undefined) goalByMember.set(memberId, sourceId);
      }
      // A leaf with no goal is a refusal only once this solver addressed its goals by member id.
      // Bare `target` is kept and is exactly the degenerate case of the dict, so a solver that
      // authored one has no goal to be missing and no existing rig has to be re-authored.
      if (authoredGoals.length > 0) {
        for (const leaf of leaves) {
          if (authoredFor.has(leaf)) continue;
          diagnostics.push(
            diag(
              "ik-leaf-without-goal",
              solver.id,
              `Chain leaf "${leaf}" of solver "${solver.id}" has no goal.`,
              [solver.id, leaf],
            ),
          );
        }
      }
    }

    solvesMap.set(
      solver.id,
      freeze(
        chains.map((entry) => {
          const goal = goalByMember.get(entry.node.id);
          return freeze(
            goal === undefined
              ? { id: entry.node.id, base: entry.base }
              : { id: entry.node.id, base: entry.base, goal },
          );
        }),
      ),
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
  // The bail happens here rather than after the derivation. `resolveSolvers` walks `base` edges and
  // reads the nodes they name, so over a graph whose sources may not resolve it answers about a
  // chain that was never valid: an unknown `base` source yields `ik-solver-unreachable-root` beside
  // `observation-unknown-source`, naming a member for a typo one node up. One cause, one
  // diagnostic, and a derivation that only ever runs over resolved references. `RS-10` pins it.
  diagnostics.sort(compareDiagnostics);
  if (diagnostics.some(({ severity }) => severity === "error"))
    return { diagnostics: Object.freeze(diagnostics) };
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
