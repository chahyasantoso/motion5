import {
  AUTHORED_SCHEMA_VERSION,
  DIAGNOSTIC_SEVERITIES,
  SUPPORTED_TRIGGER_TYPES,
  type Diagnostic,
  type ProjectDefinition,
  type TrackDefinition,
} from "./v5";

const OBSERVATION_ROLES = ["input", "output"] as const;

export interface ValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly value: ProjectDefinition | null;
}

function issue(
  ruleId: string,
  path: string,
  message: string,
  severity: Diagnostic["severity"] = "error",
  ids: readonly string[] = [],
): Diagnostic {
  return Object.freeze({
    ruleId,
    path,
    message,
    severity,
    ...(ids.length > 0 ? { ids: Object.freeze([...ids]) } : {}),
  });
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateId(value: unknown, path: string, label: string, reservedTilde = false): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push(issue("id-shape", path, `${label} id must be a non-empty string.`));
    return diagnostics;
  }
  if (value.includes("/")) {
    diagnostics.push(issue("id-qualified-separator", path, `${label} id '${value}' must not contain '/'.`));
  }
  if (reservedTilde && value === "~") {
    diagnostics.push(issue("id-reserved-namespace", path, "The motion id '~' is reserved for free tracks."));
  }
  return diagnostics;
}

function usesThreeD(track: Record<string, unknown>): boolean {
  const keyframes = isObject(track.keyframes) ? track.keyframes : null;
  if (!keyframes) return false;
  if (["z", "rotationX", "rotationY"].some((key) => keyframes[key] !== undefined && keyframes[key] !== null)) return true;
  const path = isObject(keyframes.path) ? keyframes.path : null;
  const points = path?.points;
  return Array.isArray(points) && points.some((point) => isObject(point) && typeof point.z === "number" && point.z !== 0);
}

function validateTrackShape(track: unknown, path: string, seenIds: Set<string>, diagnostics: Diagnostic[]): track is TrackDefinition {
  if (!isObject(track)) {
    diagnostics.push(issue("track-shape", path, "Track must be an object."));
    return false;
  }
  const id = track.id;
  diagnostics.push(...validateId(id, `${path}.id`, "Track"));
  if (typeof id === "string" && id.length > 0) {
    if (seenIds.has(id)) diagnostics.push(issue("track-duplicate-id", `${path}.id`, `Track id '${id}' is duplicated.`, "error", [id]));
    seenIds.add(id);
  }
  if (track.observes !== undefined && !Array.isArray(track.observes)) {
    diagnostics.push(issue("observes-shape", `${path}.observes`, "Track observes must be an array."));
  }
  return true;
}

function validatePerspective(project: Record<string, unknown>, allTracks: readonly Record<string, unknown>[], diagnostics: Diagnostic[]): void {
  const perspective = project.perspective;
  if (perspective !== undefined && (typeof perspective !== "number" || !Number.isFinite(perspective) || perspective <= 0)) {
    diagnostics.push(issue("perspective-shape", "perspective", "Perspective must be a finite number greater than zero."));
  }
  if (perspective !== undefined) return;
  for (const track of allTracks) {
    if (!usesThreeD(track)) continue;
    diagnostics.push(issue("perspective-usage", "perspective", "3D keyframes require a project perspective.", "warning", [String(track.id ?? "") ]));
  }
}

function validateObservations(
  track: Record<string, unknown>,
  path: string,
  localIds: Set<string>,
  freeIds: Set<string>,
  motionIds: Set<string>,
  edges: Array<{ source: string; target: string; path: string }>,
  diagnostics: Diagnostic[],
): void {
  if (!Array.isArray(track.observes)) return;
  const seen = new Set<string>();
  for (const [index, raw] of track.observes.entries()) {
    const edgePath = `${path}.observes[${index}]`;
    if (!isObject(raw)) {
      diagnostics.push(issue("observation-shape", edgePath, "Observation must be an object."));
      continue;
    }
    const source = raw.source;
    const role = raw.role ?? "output";
    const target = raw.target;
    if (typeof source !== "string" || source.length === 0) {
      diagnostics.push(issue("observation-source", `${edgePath}.source`, "Observation source must be a non-empty string."));
      continue;
    }
    if (!OBSERVATION_ROLES.includes(role as (typeof OBSERVATION_ROLES)[number])) {
      diagnostics.push(issue("observation-role", `${edgePath}.role`, "Observation role must be 'input' or 'output'."));
    }
    if (role === "input" && (typeof target !== "string" || target.length === 0)) {
      diagnostics.push(issue("observation-input-target", `${edgePath}.target`, "Input observations require a non-empty target."));
    }
    if (role === "output" && target !== undefined) {
      diagnostics.push(issue("observation-output-target", `${edgePath}.target`, "Output observations must not define target."));
    }
    const sourceKey = source.startsWith("~/") || source.includes("/") ? source : source;
    const sourceKnown = localIds.has(source) || freeIds.has(source) || motionIds.has(source.split("/")[0] ?? "") || sourceKey.startsWith("~/");
    if (!sourceKnown) {
      diagnostics.push(issue("observation-unknown-source", `${edgePath}.source`, `Unknown observation source '${source}'.`, "error", [source]));
    }
    const targetKey = role === "input" ? String(target) : "";
    const edgeKey = `${source}|${role}|${targetKey}`;
    if (seen.has(edgeKey)) diagnostics.push(issue("observation-duplicate-edge", edgePath, `Duplicate observation edge '${edgeKey}'.`, "error", [source]));
    seen.add(edgeKey);
    const targetId = typeof track.id === "string" ? track.id : "";
    if (source === targetId || source === `${targetId}`) {
      diagnostics.push(issue("observation-self-reference", `${edgePath}.source`, `Track '${targetId}' cannot observe itself.`, "error", [targetId]));
    }
    if (sourceKnown && targetId) edges.push({ source, target: targetId, path: edgePath });
  }
}

function hasCycle(nodes: Set<string>, edges: readonly { source: string; target: string }[]): boolean {
  const outgoing = new Map<string, string[]>();
  for (const node of nodes) outgoing.set(node, []);
  for (const edge of edges) {
    const source = edge.source;
    const target = edge.target;
    const sourceNode = source.startsWith("~/") || source.includes("/") ? source : source;
    if (outgoing.has(sourceNode) && outgoing.has(target)) outgoing.get(sourceNode)?.push(target);
  }
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (node: string): boolean => {
    if (visiting.has(node)) return true;
    if (visited.has(node)) return false;
    visiting.add(node);
    for (const next of outgoing.get(node) ?? []) if (visit(next)) return true;
    visiting.delete(node);
    visited.add(node);
    return false;
  };
  return [...nodes].some(visit);
}

export function validateV5(input: unknown): ValidationResult {
  const diagnostics: Diagnostic[] = [];
  if (!isObject(input)) {
    return { valid: false, diagnostics: [issue("project-shape", "$", "Project must be an object.")], value: null };
  }
  if (input.schemaVersion !== AUTHORED_SCHEMA_VERSION) {
    diagnostics.push(issue("schema-version", "schemaVersion", `Expected schemaVersion ${AUTHORED_SCHEMA_VERSION}.`));
  }
  if (input.projectId !== undefined && (typeof input.projectId !== "string" || input.projectId.length === 0)) {
    diagnostics.push(issue("project-id", "projectId", "projectId must be a non-empty string when present."));
  }
  if (!Array.isArray(input.motions)) diagnostics.push(issue("motions-shape", "motions", "motions must be an array."));
  if (input.freeTracks !== undefined && !Array.isArray(input.freeTracks)) diagnostics.push(issue("free-tracks-shape", "freeTracks", "freeTracks must be an array."));
  const motions = Array.isArray(input.motions) ? input.motions : [];
  const freeTracks = Array.isArray(input.freeTracks) ? input.freeTracks : [];
  const motionIds = new Set<string>();
  const allNodes = new Set<string>();
  const edges: Array<{ source: string; target: string; path: string }> = [];
  const allTracks: Record<string, unknown>[] = [];
  const freeIds = new Set<string>();
  for (const [index, rawMotion] of motions.entries()) {
    const path = `motions[${index}]`;
    if (!isObject(rawMotion)) { diagnostics.push(issue("motion-shape", path, "Motion must be an object.")); continue; }
    diagnostics.push(...validateId(rawMotion.id, `${path}.id`, "Motion", true));
    const motionId = rawMotion.id;
    if (typeof motionId === "string" && motionId.length > 0) {
      if (motionIds.has(motionId)) diagnostics.push(issue("motion-duplicate-id", `${path}.id`, `Motion id '${motionId}' is duplicated.`, "error", [motionId]));
      motionIds.add(motionId);
    }
    if (!isObject(rawMotion.trigger) || !SUPPORTED_TRIGGER_TYPES.includes(rawMotion.trigger.type as (typeof SUPPORTED_TRIGGER_TYPES)[number])) diagnostics.push(issue("trigger-shape", `${path}.trigger`, "Trigger must be an object with type scroll, time, or manual."));
    if (!Array.isArray(rawMotion.tracks)) { diagnostics.push(issue("motion-tracks-shape", `${path}.tracks`, "Motion tracks must be an array.")); continue; }
    const localIds = new Set<string>();
    for (const [trackIndex, rawTrack] of rawMotion.tracks.entries()) {
      const trackPath = `${path}.tracks[${trackIndex}]`;
      if (!validateTrackShape(rawTrack, trackPath, localIds, diagnostics)) continue;
      const track = rawTrack as Record<string, unknown>;
      const id = typeof track.id === "string" ? track.id : "";
      allTracks.push(track);
      if (typeof motionId === "string" && id) allNodes.add(`${motionId}/${id}`);
      validateObservations(track, trackPath, localIds, freeIds, motionIds, edges, diagnostics);
    }
  }
  for (const [index, rawTrack] of freeTracks.entries()) {
    const path = `freeTracks[${index}]`;
    if (!validateTrackShape(rawTrack, path, freeIds, diagnostics)) continue;
    const track = rawTrack as Record<string, unknown>;
    const id = typeof track.id === "string" ? track.id : "";
    allTracks.push(track);
    if (id) allNodes.add(`~/${id}`);
    validateObservations(track, path, new Set(), freeIds, motionIds, edges, diagnostics);
  }
  validatePerspective(input, allTracks, diagnostics);
  if (hasCycle(allNodes, edges)) diagnostics.push(issue("observation-cycle", "motions", "Observation graph contains a cycle."));
  const valid = !diagnostics.some(({ severity }) => severity === "error");
  return { valid, diagnostics: Object.freeze(diagnostics), value: valid ? (input as ProjectDefinition) : null };
}
