import type {
  Diagnostic,
  InputProjection,
  ObservationDefinition,
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

/**
 * The plugin and slot a derived input edge fills.
 *
 * Present only on an edge the graph derived from `keyframes.<plugin>.requires`. A generic `observes`
 * edge has none, which is how the publisher knows to merge one and to scope the other.
 */
export interface EdgeRequirement {
  readonly plugin: string;
  readonly slot: string;
}
export interface GraphEdge {
  readonly observerId: string;
  readonly sourceId: string;
  readonly role: "input" | "output";
  readonly projection?: InputProjection;
  readonly requirement?: EdgeRequirement;
}
export interface GraphNode {
  readonly id: string;
  readonly owner: "motion" | "free";
  readonly authoredIndex: number;
  readonly track: TrackDefinition;
  readonly edges: readonly GraphEdge[];
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
/**
 * One encoded field of an edge identity, prefixed with its own length.
 *
 * The id guards reserve only `/` and `~`, and a projection key, a projection output name, a plugin
 * name, and a requirement slot are every one of them an arbitrary non-empty string, so `|`, `:`,
 * `,` and `=` are all authorable: a plain separator can be forged from inside a field value.
 * A length prefix makes the encoding prefix-free, which is what makes `edgeKey` injective
 * rather than merely usually-distinct.
 */
function field(value: string): string {
  return `${value.length}:${value}`;
}
/**
 * The identity form of a requirement, `"-"` for an absent one.
 *
 * A requirement belongs in identity because two slots of one plugin may intentionally bind the same
 * source: an IK plugin binding `base` and `destination` to one node is two dependencies, not a
 * duplicate edge. It also separates a derived edge from a generic `observes` edge to the same
 * source, which the publisher composes differently. See ADR-044.
 */
function requirementIdentity(edge: GraphEdge): string {
  const requirement = edge.requirement;
  if (requirement === undefined) return "-";
  return `${field(requirement.plugin)}${field(requirement.slot)}`;
}
/**
 * The ordering form of a requirement's plugin. `"-"` sorts before `":"`, so an absent requirement
 * orders before every present one, including a plugin named with the empty string, and the
 * comparator separates exactly the edges the identity encoding separates.
 */
function requirementOrder(edge: GraphEdge): string {
  return edge.requirement === undefined ? "-" : `:${edge.requirement.plugin}`;
}
export function canonicalizeProjection(projection: InputProjection): string {
  if (projection.pick !== undefined) {
    const pickKeys = [...projection.pick].sort(compareCodeUnits);
    return `pick:${pickKeys.map(field).join("")}`;
  }
  const map = projection.map ?? {};
  const mapKeys = Object.keys(map).sort(compareCodeUnits);
  return `map:${mapKeys.map((key) => `${field(key)}${field(map[key]!)}`).join("")}`;
}
/**
 * Edge identity, and nothing else: two keys are equal exactly when the edges are one edge.
 *
 * Ordering belongs to `compareEdges` and the readable label to `describeEdge`. One string
 * cannot own all three jobs, because injectivity wants length prefixes while the other two
 * want the field values themselves.
 */
export function edgeKey(edge: GraphEdge): string {
  const projection = edge.projection ? canonicalizeProjection(edge.projection) : "";
  return [
    field(edge.observerId),
    field(edge.sourceId),
    field(edge.role),
    field(projection),
    field(requirementIdentity(edge)),
  ].join("");
}
/**
 * The single ordering owner for observation edges.
 *
 * Field by field, never derived from `edgeKey`. This comparator decides published values in
 * `runtime/graph-publisher.ts`: it picks the blocked upstream that gets named, it feeds
 * `firstPendingEdge`, and it sets output merge precedence, where the later write wins.
 * Sorting by an encoded identity would make that precedence depend on how long an id is.
 */
export function compareEdges(a: GraphEdge, b: GraphEdge): number {
  return (
    compareCodeUnits(a.observerId, b.observerId) ||
    compareCodeUnits(a.sourceId, b.sourceId) ||
    compareCodeUnits(a.role, b.role) ||
    compareCodeUnits(
      a.projection ? canonicalizeProjection(a.projection) : "",
      b.projection ? canonicalizeProjection(b.projection) : "",
    ) ||
    compareCodeUnits(requirementOrder(a), requirementOrder(b)) ||
    compareCodeUnits(a.requirement?.slot ?? "", b.requirement?.slot ?? "")
  );
}
/** The readable edge label for diagnostics and error text. Never an identity, never a key. */
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
function validateProjection(
  projection: unknown,
  path: string,
  diagnostics: Diagnostic[],
): InputProjection | undefined {
  if (projection === undefined) return undefined;
  if (!isRecord(projection)) {
    diagnostics.push(
      diag("observation-input-projection", path, "Input projection must be an object."),
    );
    return undefined;
  }
  const hasPick = projection.pick !== undefined;
  const hasMap = projection.map !== undefined;
  if (hasPick === hasMap) {
    diagnostics.push(
      diag(
        "observation-input-projection",
        path,
        "Input projection must define exactly one of pick or map.",
      ),
    );
    return undefined;
  }
  if (hasPick) {
    if (
      !Array.isArray(projection.pick) ||
      projection.pick.length === 0 ||
      projection.pick.some((key) => typeof key !== "string" || key.length === 0)
    ) {
      diagnostics.push(
        diag(
          "observation-input-projection",
          path,
          "Input projection pick must be a non-empty list of non-empty keys.",
        ),
      );
      return undefined;
    }
    if (new Set(projection.pick).size !== projection.pick.length) {
      diagnostics.push(
        diag("observation-input-projection", path, "Input projection pick keys must be unique."),
      );
      return undefined;
    }
    return Object.freeze({ pick: Object.freeze([...projection.pick]) });
  }
  if (
    !isRecord(projection.map) ||
    Object.keys(projection.map).length === 0 ||
    Object.entries(projection.map).some(
      ([source, target]) =>
        source.length === 0 || typeof target !== "string" || target.length === 0,
    )
  ) {
    diagnostics.push(
      diag(
        "observation-input-projection",
        path,
        "Input projection map must map non-empty source keys to non-empty output keys.",
      ),
    );
    return undefined;
  }
  const map: Record<string, string> = {};
  for (const [source, target] of Object.entries(projection.map)) map[source] = target as string;
  if (new Set(Object.values(map)).size !== Object.values(map).length) {
    diagnostics.push(
      diag(
        "observation-input-projection",
        path,
        "Input projection map output keys must be unique.",
      ),
    );
    return undefined;
  }
  return Object.freeze({ map: Object.freeze(map) });
}
export interface ResolvedObservation {
  readonly edge?: GraphEdge;
  readonly diagnostics: readonly Diagnostic[];
}
const TARGET_UNSUPPORTED =
  "Observation target is not supported; rename input keys with a projection, or bind a plugin requirement under keyframes.<plugin>.requires.";
/**
 * The authored `target` field, which `ObservationDefinition` no longer declares.
 *
 * Read through the record view rather than through a member access, because the point of the guard
 * below is to refuse a key the type has already removed. Removing it from the type alone would
 * leave it accepted and then ignored, which rule 6 of ADR-033 forbids, and here that would be
 * worse than ignored: a target used to split one edge into two, so a project that bound two
 * targets to one source would stop loading and report `observation-duplicate`, naming a duplicate
 * edge the author never wrote. The legacy `use` field is refused the same way. See ADR-046.
 */
function readRemovedTarget(observation: ObservationDefinition): unknown {
  return isRecord(observation) ? observation.target : undefined;
}
export function resolveObservationEdge(
  observation: ObservationDefinition,
  observerNodeId: string,
  ownerId: string,
  path: string,
): ResolvedObservation {
  const diagnostics: Diagnostic[] = [];
  const role = observation.role ?? "output";
  if (role !== "input" && role !== "output") {
    diagnostics.push(diag("observation-role", path, "Observation role must be input or output."));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  if (typeof observation.source !== "string" || observation.source.length === 0) {
    diagnostics.push(diag("observation-source", path, "Observation source must be non-empty."));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  // One rule for both roles. `observation-output-target` was role-specific because an input target
  // was once believed to name a destination key; nothing ever read it on either role.
  if (readRemovedTarget(observation) !== undefined) {
    diagnostics.push(diag("observation-target-unsupported", path, TARGET_UNSUPPORTED));
    return { diagnostics: Object.freeze(diagnostics) };
  }
  const projection =
    role === "input" ? validateProjection(observation.projection, path, diagnostics) : undefined;
  if (diagnostics.length > 0) return { diagnostics: Object.freeze(diagnostics) };
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
  const edge: GraphEdge = Object.freeze({
    observerId: observerNodeId,
    sourceId,
    role,
    ...(projection === undefined ? {} : { projection }),
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
    let boundSourceId: string;
    try {
      boundSourceId = qualifySource(binding.source, ownerId);
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      diagnostics.push(diag("requirement-source", bindingPath, message, [binding.source]));
      continue;
    }
    const bindingEdge: GraphEdge = Object.freeze({
      observerId: id,
      sourceId: boundSourceId,
      role: "input",
      requirement: Object.freeze({ plugin: binding.plugin, slot: binding.slot }),
    });
    edges.push(bindingEdge);
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
  diagnostics.sort(compareDiagnostics);
  if (diagnostics.some(({ severity }) => severity === "error"))
    return { diagnostics: Object.freeze(diagnostics) };
  const ordering = orderGraph(nodes);
  if (ordering.order === undefined)
    return {
      diagnostics: Object.freeze(
        [...diagnostics, ...ordering.diagnostics].sort(compareDiagnostics),
      ),
    };
  const nodeById: Record<string, GraphNode> = {};
  for (const node of nodes) nodeById[node.id] = node;
  return {
    graph: freeze({
      nodes: freeze(nodes),
      nodeById: freeze(nodeById),
      order: ordering.order,
      diagnostics: freeze(diagnostics),
    }),
    diagnostics: freeze(diagnostics),
  };
}
