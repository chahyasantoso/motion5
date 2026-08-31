import type {
  Diagnostic,
  ObservationDefinition,
  PluginRequiresBinding,
  ProjectDefinition,
  TrackDefinition,
} from "../contract/v5";
import { readPluginBindings, readPluginValues } from "../contract/keyframe-shape";
import { PLUGIN_GOALS_SLOT } from "../contract/solver-slots";
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
  /**
   * The key this binding was authored under inside a dict-valued slot, absent for a scalar slot.
   *
   * Part of edge identity rather than a label. Two entries of one slot are two dependencies, and the
   * slot alone cannot tell them apart once the key stopped being formatted into it, so an edge per
   * entry survives only because this field is length-prefixed into `requirementIdentity` alongside
   * the plugin and the slot. See ADR-057.
   */
  readonly memberKey?: string;
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
  /**
   * Reverse topology: for every node id, the ids that read it.
   *
   * Derived here rather than by every consumer, because it is a pure function of the node set and
   * this file already walks every edge of every node twice over. `GraphPublisher` recomputed it on
   * every tick, over a graph that changes at most once between ticks, which made steady-state
   * ticking O(V+E) in graph shape for a graph whose shape had not moved.
   *
   * Total, so a node nothing reads carries an empty list rather than no entry: a missing key and an
   * empty one are the same answer to a consumer that spells `?? []`, and only one of them makes the
   * map's own shape depend on the rig. Not recoverable from `edges` alone either, which is the whole
   * reason it lives beside them: a solver reads its members through `solves` and no edge points that
   * way, so a reverse walk built from edges would miss every member of every chain.
   */
  readonly dependents: Readonly<Record<string, readonly string[]>>;
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
  const member = field(requirement.memberKey ?? "");
  return `${field(requirement.plugin)}${field(requirement.slot)}${member}`;
}

function requirementOrder(edge: GraphEdge): string {
  return edge.requirement === undefined ? "-" : `:${edge.requirement.plugin}`;
}

/**
 * The injective identity encoding for an edge.
 *
 * Every part is length-prefixed, so no authored string can forge a field boundary. The requirement
 * plugin, slot and member key are the only authored strings left inside it, now that the canonical
 * projection is gone with the primitive it encoded.
 *
 * The member key is prefixed like the others rather than joined into the slot, and that is what
 * keeps two entries of one dict-valued slot distinct. They were distinguished by the encoded slot
 * while a goal's identity was `targets[<memberId>]`; with the slot carrying the authored name, two
 * goals reaching for one node encode identically without this field and `finalizeGraph` reports
 * `observation-duplicate` on a rig that loads clean. `DV-4` pins it. See ADR-034, ADR-046, ADR-047,
 * and ADR-057.
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
    compareCodeUnits(a.requirement?.slot ?? "", b.requirement?.slot ?? "") ||
    compareCodeUnits(a.requirement?.memberKey ?? "", b.requirement?.memberKey ?? "")
  );
}

export function describeEdge(edge: GraphEdge): string {
  const requirement = edge.requirement;
  const member = requirement?.memberKey === undefined ? "" : `.${requirement.memberKey}`;
  const scope =
    requirement === undefined ? "" : ` [${requirement.plugin}.${requirement.slot}${member}]`;
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
  // The member key is copied when the binding carries one and omitted when it does not, rather than
  // written as an explicit `undefined`. An absent field and a field holding `undefined` encode the
  // same identity, but only the first says "this slot takes one source" to a reader of the IR.
  const requirement: EdgeRequirement = Object.freeze({
    plugin: binding.plugin,
    slot: binding.slot,
    ...(binding.memberKey === undefined ? {} : { memberKey: binding.memberKey }),
  });
  const edge: GraphEdge = Object.freeze({
    observerId: observerNodeId,
    sourceId,
    role: "input",
    requirement,
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
 * The plugin-named groups whose `values` section authors `key`, sorted by name.
 *
 * One walker, and the two rules that read it are set operations against the groups that bound a
 * `solver` slot. It used to answer a single question, "what did the binder groups author for this
 * key", which is one of the two predicates that question splits into the moment a second rule needs
 * its complement: the dead rotation asks whether a binder group authored `rotation` and no `weight`,
 * and the inert weight asks whether a solver-bound node authored `weight` in a group that bound
 * none. Two near-identical group walkers is how those two drift apart, and this read has drifted
 * once already, when it was wider than the rule that used it. See ADR-055.
 *
 * Presence, never value. Whether an authored `weight` is provably always `1` is a leaf-shape and
 * value-semantics question, `contract/authored-leaf` already owns leaf shape, and hand-walking a
 * `stops` array here would make this layer a second owner of it: the same break issue #192 closed
 * once. This layer answers which group authored a key, and nothing about what it authored.
 *
 * Two shapes it deliberately does not report, because each already has a more specific owner. A
 * value directly under the plugin name is the pre-ADR-049 group form, refused as
 * `keyframes-missing-values-section`. And a flat key names no group at all: attributing one to a
 * plugin is the registry's question, and this layer holds no registry by design, so a member
 * authoring one meets `plugin-ambiguous-key` in any registry with two claimants and
 * `plugin-unknown-key` in one with none.
 *
 * Sorted, so a diagnostic that lists the groups it fired on never depends on authoring order.
 * `readPluginValues` stays the only answer to what a group's `values` section is.
 * See ADR-043, ADR-044, ADR-049, ADR-051, ADR-053, ADR-054, and ADR-055.
 */
function groupsAuthoring(keyframes: unknown, key: string): readonly string[] {
  if (!isRecord(keyframes)) return [];
  return Object.keys(keyframes)
    .filter((group) => readPluginValues(keyframes[group])[key] !== undefined)
    .sort(compareCodeUnits);
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

/** One authored goal of a solver: the member key as written, and the node it names as a source. */
interface AuthoredGoal {
  readonly authored: string;
  readonly sourceId: string;
}

/**
 * Every goal binding one node authored: the bare slot, and the dict entries in authored key order.
 *
 * One reader, because four rules and the derivation all ask the same question of the same edges.
 * `ik-mode-ambiguous` needs to know whether a node bound a goal at all, `ik-goal-conflict` needs
 * both spellings, `ik-solver-no-goal` needs neither of them, and the derivation needs every dict
 * entry with its authored key. Two of those used to read the literal `"target"` in one loop while
 * the grammar was read in another, which is how a member binding `solver` beside a goal dict loaded
 * clean with every one of its goals ignored.
 *
 * Gated on the base slot as well as on the field, and both halves are load-bearing. The field alone
 * would classify any dict-valued binding as a goal, so a spring's or a spline's tension dict would
 * have six IK rules run over it by a layer that holds no registry and cannot know better; the slot
 * alone is what `"target"` already was. That puts `targets` in the same set as the `root`, `solver`,
 * `base` and `target` literals this layer already hardcodes. `DV-8` pins it. See ADR-057.
 *
 * The dict is sorted by the authored key rather than by `compareEdges`, whose first key is the
 * source id: two goals pointing at one node would otherwise be ordered by nothing, and the authored
 * key is what a duplicate diagnostic has to list. That is the ordering the derived slot produced,
 * because the slot was this key under a fixed prefix. Order is a pure function of authored ids
 * either way.
 */
interface GoalBindings {
  readonly bare: boolean;
  readonly dict: readonly AuthoredGoal[];
}

function goalBindingsOf(node: GraphNode): GoalBindings {
  const dict: AuthoredGoal[] = [];
  let bare = false;
  for (const edge of node.edges) {
    if (edge.role !== "input" || edge.requirement === undefined) continue;
    const { slot, memberKey } = edge.requirement;
    if (slot === "target") {
      bare = true;
      continue;
    }
    if (slot === PLUGIN_GOALS_SLOT && memberKey !== undefined)
      dict.push({ authored: memberKey, sourceId: edge.sourceId });
  }
  dict.sort((a, b) => compareCodeUnits(a.authored, b.authored));
  return { bare, dict };
}

export function resolveSolvers(
  nodes: readonly GraphNode[],
  diagnostics: Diagnostic[],
): readonly GraphNode[] {
  // Diagnostic 3: ik-mode-ambiguous
  // Diagnostic 4: ik-solved-rotation-dead
  // Diagnostic 7: ik-goal-conflict
  // Diagnostic 15: ik-weight-without-solver
  for (const node of nodes) {
    let rootCount = 0;
    // The plugins under which this node bound a `solver` slot, which is what scopes the read of its
    // authored rotation: the solve replaces the rotation of the plugin that asked for it, so a
    // rotation under any other group is that plugin's own live input.
    const solverBinders: string[] = [];
    for (const edge of node.edges) {
      if (edge.role === "input" && edge.requirement) {
        const slot = edge.requirement.slot;
        if (slot === "root") rootCount++;
        if (slot === "solver") solverBinders.push(edge.requirement.plugin);
      }
    }
    const keyframes = node.track.keyframes;
    const rotationGroups = groupsAuthoring(keyframes, "rotation");
    const weightGroups = groupsAuthoring(keyframes, "weight");
    const authoredGoals = goalBindingsOf(node);
    const hasSolver = solverBinders.length > 0;
    // Read through the goal classification rather than off the literal `"target"`. A member binding
    // `solver` beside a goal dict would otherwise load clean, with one real input edge per goal, and
    // have every one of them ignored: a field accepted and then ignored, which is what ADR-033 rule
    // 6 forbids. See issue #195.
    const hasGoal = authoredGoals.bare || authoredGoals.dict.length > 0;
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
    if (authoredGoals.bare && authoredGoals.dict.length > 0) {
      diagnostics.push(
        diag(
          "ik-goal-conflict",
          node.id,
          `Solver "${node.id}" binds both "target" and the goals dict; goals are addressed one way or the other.`,
          [node.id],
        ),
      );
    }
    // Presence-only, two tiers. A binder group that authors `rotation` and no `weight` is the
    // pre-#211 shape and is refused byte-identically to before: with no weight in reach there is no
    // runtime state in which the authored value influences the output. A `weight` beside it, in any
    // form, passes.
    //
    // Not "present but provably always `1`". That reading needs leaf shape and value semantics,
    // which have an owner one layer down, and it would refuse "fully solved for now, I will animate
    // the weight next" while still passing a weight that arrives through an edge: a rule that
    // catches the careful author and misses the dynamic case is inverted. See ADR-055.
    const rotationIsDead = solverBinders.some(
      (binder) => rotationGroups.includes(binder) && !weightGroups.includes(binder),
    );
    if (rotationIsDead) {
      diagnostics.push(
        diag(
          "ik-solved-rotation-dead",
          node.id,
          `Member "${node.id}" bound to solver cannot author rotation with no weight to blend it by.`,
          [node.id],
        ),
      );
    }
    // The symmetric footgun, and it speaks only about a node that bound a solver somewhere.
    //
    // The group scope is what one half of that buys: a node can bind `solver` under one plugin and
    // author `weight` under another, and "does this node hold a solver anywhere" would pass that
    // shape, while `fk` short-circuits to the authored rotation and never reads a weight outside the
    // group that bound the slot, so that one is silently inert, which is what ADR-033 rule 6
    // forbids.
    //
    // The `hasSolver` guard is the other half, and it is the same narrowing `RS-9` already made on
    // the dead rotation. `weight` is claimed by `fkPlugin` and ADR-043 lets any other plugin claim
    // it too, and this pass holds no registry, so on a node with no solver binding at all it cannot
    // tell a blend weight from another plugin's own live input: `Q-10`'s `reach` claims `weight`,
    // binds no solver slot, and refusing that rig would be this rule answering for a plugin it
    // knows nothing about. An `fk` weight on a bone that bound no solver anywhere is inert too and
    // is not refused here; that is the stated cost of holding no registry, exactly as a flat
    // `rotation` is, and `WT-10` is what pins the composition making it harmless. See ADR-055.
    const inertWeight = weightGroups.filter((group) => !solverBinders.includes(group));
    if (hasSolver && inertWeight.length > 0) {
      diagnostics.push(
        diag(
          "ik-weight-without-solver",
          node.id,
          `Node "${node.id}" authors weight under ${inertWeight.join(", ")} without binding a solver there; there is no solved rotation to blend.`,
          [node.id],
        ),
      );
    }
    // No pivot rule sits beside the dead rotation any more. `ik-solved-pivot-unsupported` refused a
    // non-zero authored `x` or `y` on a solved member while neither solve accounted for one, so a
    // bone composed its pivot at that offset, extended by `length`, and missed its goal by exactly
    // that vector with a `ready` patch and no diagnostic. Both solves account for it now: the closed
    // form folds the two offsets into a fixed base point and a rigid link with a twist, and the
    // iterative one carries pivots beside tips. A rule that refuses a shape the runtime solves is
    // worse than no rule, so it is deleted rather than widened, and nothing replaces it: an offset
    // that shortens a chain's reach past its goal is an unreachable target, which was never a
    // diagnostic. `RS-11` and `RS-12` pin the acceptance. See ADR-053 and ADR-054.
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

    // Diagnostic 14: ik-solver-no-goal
    //
    // A solver with a root and members and nothing to reach for, refused here rather than at
    // composition. `solveChain` throws on an empty goal map, which was the documented contract and
    // the wrong owner for it: `ik-leaf-without-goal` is guarded by the dict having been used at all
    // and the bare slot is a separate read, so the one shape that bound neither loaded clean and
    // then errored its solver and blocked every member of it on every tick, for a shape the loader
    // can name. The throw stays as the invariant guard behind this rule, exactly as `readMembers`
    // guards `ik-solver-no-members`. See ADR-053.
    //
    // Reported without a `continue`, unlike the two refusals above: the chain is still derivable
    // here, and a broken one is worth naming in the same pass rather than one run later.
    const authoredGoals = goalBindingsOf(solver);
    if (!authoredGoals.bare && authoredGoals.dict.length === 0) {
      diagnostics.push(
        diag(
          "ik-solver-no-goal",
          solver.id,
          `Solver "${solver.id}" has no goal; bind "target", or address a goal per chain leaf under "targets".`,
          [solver.id],
        ),
      );
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
      if (authoredGoals.bare && leaves.length > 1) {
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
      for (const goal of authoredGoals.dict) {
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
      // authored one has no goal to be missing and no existing rig has to be re-authored. A solver
      // that addressed no goals at all is `ik-solver-no-goal` above, so the two never report
      // together and one absence is never two diagnostics.
      if (authoredGoals.dict.length > 0) {
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
 * Reverse topology for one node set: per node id, the ids that read it.
 *
 * Both kinds of reader, because both are real dependencies and only one of them is an edge. A node
 * reads every source it names an edge for, and a solver reads every member `resolveSolvers` derived
 * onto its `solves`, which no edge points at. A reverse walk over edges alone would therefore miss
 * every member of every chain, and a member's own value would stop marking its solver dirty.
 *
 * Nodes in the given order, each node's edges before its members, and an entry pushed only for a
 * source this node set contains: an edge naming an unknown source is `finalizeGraph`'s refusal, and
 * a direct publisher caller may hand over a partial node set. Duplicates are kept rather than
 * collapsed, because a consumer walking this guards on its own visited set, and collapsing them
 * would be a second decision inside a function whose only job is to state what the graph says.
 */
export function deriveDependents(
  nodes: readonly GraphNode[],
): Readonly<Record<string, readonly string[]>> {
  const collected = new Map<string, string[]>();
  for (const node of nodes) collected.set(node.id, []);
  for (const node of nodes) {
    for (const edge of node.edges) collected.get(edge.sourceId)?.push(node.id);
    if (node.solves) {
      for (const member of node.solves) collected.get(member.id)?.push(node.id);
    }
  }
  const dependents: Record<string, readonly string[]> = {};
  for (const [id, readers] of collected) dependents[id] = freeze(readers);
  return freeze(dependents);
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
  // Derived here, after `resolveSolvers` returned, because the solver fan-in is half the answer and
  // it does not exist until then. One owner, in the file that already owns `compareEdges` and
  // delegates to `orderGraph`, so every consumer reads reverse topology instead of walking for it.
  return {
    graph: freeze({
      nodes: freeze(resolvedNodes),
      nodeById: freeze(nodeById),
      dependents: deriveDependents(resolvedNodes),
      order: ordering.order,
      diagnostics: freeze(diagnostics),
    }),
    diagnostics: freeze(diagnostics),
  };
}
