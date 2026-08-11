import {
  AUTHORED_SCHEMA_VERSION,
  type Diagnostic,
  type ProjectDefinition,
  type TrackDefinition,
} from "./v5";
import { SUPPORTED_TRIGGER_TYPES } from "./v5";

const OBSERVATION_ROLES = ["input", "output"] as const;

export interface ValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly value: ProjectDefinition | null;
}

type RawObject = Record<string, unknown>;
type Edge = { source: string; target: string; path: string };

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
function isObject(value: unknown): value is RawObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function validateKeyframes(keyframes: unknown, path: string, diagnostics: Diagnostic[]): void {
  if (keyframes === undefined) return;
  if (!isObject(keyframes)) {
    diagnostics.push(issue("keyframes-shape", path, "Track keyframes must be an object."));
    return;
  }
  for (const [key, rawProperty] of Object.entries(keyframes)) {
    const propertyPath = `${path}.${key}`;
    if (!isObject(rawProperty)) {
      diagnostics.push(
        issue("stops-shape", `${propertyPath}.stops`, "Authored properties require a stops array."),
      );
      continue;
    }
    if (Object.keys(rawProperty).length === 0) continue;
    if (!Array.isArray(rawProperty.stops)) {
      diagnostics.push(
        issue("stops-shape", `${propertyPath}.stops`, "Authored properties require a stops array."),
      );
      continue;
    }
    let previous: number | undefined;
    const positions = new Set<number>();
    for (const [index, rawStop] of rawProperty.stops.entries()) {
      const stopPath = `${propertyPath}.stops[${index}]`;
      if (!isObject(rawStop) || typeof rawStop.p !== "number" || !Number.isFinite(rawStop.p)) {
        diagnostics.push(
          issue("stop-position", `${stopPath}.p`, "Stop p must be a finite number."),
        );
        continue;
      }
      const position = rawStop.p;
      if (position < 0 || position > 1)
        diagnostics.push(
          issue("stop-position-range", `${stopPath}.p`, "Stop p must be between 0 and 1."),
        );
      if (previous !== undefined && position < previous)
        diagnostics.push(
          issue("stop-position-order", `${stopPath}.p`, "Stop positions must be monotonic."),
        );
      if (positions.has(position))
        diagnostics.push(
          issue("stop-position-duplicate", `${stopPath}.p`, "Stop positions must be unique."),
        );
      positions.add(position);
      previous = position;
    }
    if (positions.size > 0 && !positions.has(0))
      diagnostics.push(
        issue("stop-missing-start", propertyPath, "Stop sequence does not define p=0.", "warning"),
      );
    if (positions.size > 0 && !positions.has(1))
      diagnostics.push(
        issue("stop-missing-end", propertyPath, "Stop sequence does not define p=1.", "warning"),
      );
  }
}

function validateId(
  value: unknown,
  path: string,
  label: string,
  reservedTilde = false,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push(issue("id-shape", path, `${label} id must be a non-empty string.`));
    return diagnostics;
  }
  if (value.includes("/"))
    diagnostics.push(
      issue("id-qualified-separator", path, `${label} id '${value}' must not contain '/'.`),
    );
  if (reservedTilde && value === "~")
    diagnostics.push(
      issue("id-reserved-namespace", path, "The motion id '~' is reserved for free tracks."),
    );
  return diagnostics;
}
function usesThreeD(track: RawObject): boolean {
  const keyframes = isObject(track.keyframes) ? track.keyframes : null;
  if (!keyframes) return false;
  if (
    ["z", "rotationX", "rotationY"].some(
      (key) => keyframes[key] !== undefined && keyframes[key] !== null,
    )
  )
    return true;
  const path = isObject(keyframes.path) ? keyframes.path : null;
  return (
    Array.isArray(path?.points) &&
    path.points.some((point) => isObject(point) && typeof point.z === "number" && point.z !== 0)
  );
}
function validateTrackShape(
  track: unknown,
  path: string,
  seenIds: Set<string>,
  diagnostics: Diagnostic[],
): track is TrackDefinition {
  if (!isObject(track)) {
    diagnostics.push(issue("track-shape", path, "Track must be an object."));
    return false;
  }
  diagnostics.push(...validateId(track.id, `${path}.id`, "Track"));
  validateKeyframes(track.keyframes, `${path}.keyframes`, diagnostics);
  if (typeof track.id === "string" && track.id.length > 0) {
    if (seenIds.has(track.id))
      diagnostics.push(
        issue(
          "track-duplicate-id",
          `${path}.id`,
          `Track id '${track.id}' is duplicated.`,
          "error",
          [track.id],
        ),
      );
    seenIds.add(track.id);
  }
  if (track.observes !== undefined && !Array.isArray(track.observes))
    diagnostics.push(
      issue("observes-shape", `${path}.observes`, "Track observes must be an array."),
    );
  return true;
}
function addObservationDiagnostics(
  track: RawObject,
  path: string,
  ownerId: string,
  localIds: ReadonlySet<string>,
  freeIds: ReadonlySet<string>,
  qualifiedIds: ReadonlySet<string>,
  edges: Edge[],
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
      diagnostics.push(
        issue(
          "observation-source",
          `${edgePath}.source`,
          "Observation source must be a non-empty string.",
        ),
      );
      continue;
    }
    if (!OBSERVATION_ROLES.includes(role as (typeof OBSERVATION_ROLES)[number]))
      diagnostics.push(
        issue(
          "observation-role",
          `${edgePath}.role`,
          "Observation role must be 'input' or 'output'.",
        ),
      );
    if (role === "input" && (typeof target !== "string" || target.length === 0))
      diagnostics.push(
        issue(
          "observation-input-target",
          `${edgePath}.target`,
          "Input observations require a non-empty target.",
        ),
      );
    if (role === "output" && target !== undefined)
      diagnostics.push(
        issue(
          "observation-output-target",
          `${edgePath}.target`,
          "Output observations must not define target.",
        ),
      );
    const qualifiedSource =
      source.startsWith("~/") || source.includes("/")
        ? source
        : localIds.has(source)
          ? `${ownerId}/${source}`
          : source;
    const sourceKnown = qualifiedIds.has(qualifiedSource) || freeIds.has(source);
    if (!sourceKnown)
      diagnostics.push(
        issue(
          "observation-unknown-source",
          `${edgePath}.source`,
          `Unknown observation source '${source}'.`,
          "error",
          [source],
        ),
      );
    const edgeKey = `${qualifiedSource}|${role}|${role === "input" ? String(target) : ""}`;
    if (seen.has(edgeKey))
      diagnostics.push(
        issue(
          "observation-duplicate-edge",
          edgePath,
          `Duplicate observation edge '${edgeKey}'.`,
          "error",
          [source],
        ),
      );
    seen.add(edgeKey);
    if (
      source === ownerId ||
      qualifiedSource === `${ownerId}/${ownerId}` ||
      qualifiedSource === ownerId
    )
      diagnostics.push(
        issue(
          "observation-self-reference",
          `${edgePath}.source`,
          `Track '${ownerId}' cannot observe itself.`,
          "error",
          [ownerId],
        ),
      );
    if (sourceKnown && typeof track.id === "string")
      edges.push({ source: qualifiedSource, target: `${ownerId}/${track.id}`, path: edgePath });
  }
}
function hasCycle(nodes: ReadonlySet<string>, edges: Edge[]): boolean {
  const outgoing = new Map<string, string[]>();
  for (const node of nodes) outgoing.set(node, []);
  for (const edge of edges)
    if (outgoing.has(edge.source) && outgoing.has(edge.target))
      outgoing.get(edge.source)?.push(edge.target);
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
  if (!isObject(input))
    return {
      valid: false,
      diagnostics: [issue("project-shape", "$", "Project must be an object.")],
      value: null,
    };
  if (input.schemaVersion !== AUTHORED_SCHEMA_VERSION)
    diagnostics.push(
      issue(
        "schema-version",
        "schemaVersion",
        `Expected schemaVersion ${AUTHORED_SCHEMA_VERSION}.`,
      ),
    );
  if (
    input.projectId !== undefined &&
    (typeof input.projectId !== "string" || input.projectId.length === 0)
  )
    diagnostics.push(
      issue("project-id", "projectId", "projectId must be a non-empty string when present."),
    );
  if (!Array.isArray(input.motions))
    diagnostics.push(issue("motions-shape", "motions", "motions must be an array."));
  if (input.freeTracks !== undefined && !Array.isArray(input.freeTracks))
    diagnostics.push(issue("free-tracks-shape", "freeTracks", "freeTracks must be an array."));
  const motions = Array.isArray(input.motions) ? input.motions : [];
  const freeTracks = Array.isArray(input.freeTracks) ? input.freeTracks : [];
  const motionIds = new Set<string>();
  const freeIds = new Set<string>();
  const qualifiedIds = new Set<string>();
  const nodes = new Set<string>();
  const motionRecords: Array<{
    raw: RawObject;
    path: string;
    id: string;
    tracks: RawObject[];
    localIds: Set<string>;
  }> = [];
  const freeRecords: Array<{ raw: RawObject; path: string; id: string }> = [];
  const allTracks: RawObject[] = [];
  for (const [index, rawMotion] of motions.entries()) {
    const path = `motions[${index}]`;
    if (!isObject(rawMotion)) {
      diagnostics.push(issue("motion-shape", path, "Motion must be an object."));
      continue;
    }
    diagnostics.push(...validateId(rawMotion.id, `${path}.id`, "Motion", true));
    const id = typeof rawMotion.id === "string" ? rawMotion.id : "";
    if (id) {
      if (motionIds.has(id))
        diagnostics.push(
          issue("motion-duplicate-id", `${path}.id`, `Motion id '${id}' is duplicated.`, "error", [
            id,
          ]),
        );
      motionIds.add(id);
    }
    if (
      !isObject(rawMotion.trigger) ||
      !SUPPORTED_TRIGGER_TYPES.includes(
        rawMotion.trigger.type as (typeof SUPPORTED_TRIGGER_TYPES)[number],
      )
    )
      diagnostics.push(
        issue(
          "trigger-shape",
          `${path}.trigger`,
          "Trigger must be an object with type scroll, time, or manual.",
        ),
      );
    if (!Array.isArray(rawMotion.tracks)) {
      diagnostics.push(
        issue("motion-tracks-shape", `${path}.tracks`, "Motion tracks must be an array."),
      );
      continue;
    }
    const localIds = new Set<string>();
    const tracks: RawObject[] = [];
    for (const [trackIndex, rawTrack] of rawMotion.tracks.entries()) {
      const trackPath = `${path}.tracks[${trackIndex}]`;
      if (!validateTrackShape(rawTrack, trackPath, localIds, diagnostics)) continue;
      const track = rawTrack as unknown as RawObject;
      tracks.push(track);
      allTracks.push(track);
      if (id && typeof track.id === "string" && track.id.length > 0) {
        const qualified = `${id}/${track.id}`;
        qualifiedIds.add(qualified);
        nodes.add(qualified);
      }
    }
    motionRecords.push({ raw: rawMotion, path, id, tracks, localIds });
  }
  for (const [index, rawTrack] of freeTracks.entries()) {
    const path = `freeTracks[${index}]`;
    if (!validateTrackShape(rawTrack, path, freeIds, diagnostics)) continue;
    const track = rawTrack as unknown as RawObject;
    const id = typeof track.id === "string" ? track.id : "";
    if (id) {
      freeIds.add(id);
      qualifiedIds.add(`~/${id}`);
      nodes.add(`~/${id}`);
    }
    allTracks.push(track);
    freeRecords.push({ raw: track, path, id });
  }
  const edges: Edge[] = [];
  for (const record of motionRecords)
    for (const track of record.tracks)
      addObservationDiagnostics(
        track,
        `${record.path}.tracks[${record.tracks.indexOf(track)}]`,
        record.id,
        record.localIds,
        freeIds,
        qualifiedIds,
        edges,
        diagnostics,
      );
  for (const record of freeRecords)
    addObservationDiagnostics(
      record.raw,
      record.path,
      "~",
      new Set(),
      freeIds,
      qualifiedIds,
      edges,
      diagnostics,
    );
  const perspective = input.perspective;
  if (
    perspective !== undefined &&
    (typeof perspective !== "number" || !Number.isFinite(perspective) || perspective <= 0)
  )
    diagnostics.push(
      issue(
        "perspective-shape",
        "perspective",
        "Perspective must be a finite number greater than zero.",
      ),
    );
  if (perspective === undefined)
    for (const track of allTracks)
      if (usesThreeD(track))
        diagnostics.push(
          issue(
            "perspective-usage",
            "perspective",
            "3D keyframes require a project perspective.",
            "warning",
            [String(track.id ?? "")],
          ),
        );
  if (hasCycle(nodes, edges))
    diagnostics.push(issue("observation-cycle", "motions", "Observation graph contains a cycle."));
  const valid = !diagnostics.some(({ severity }) => severity === "error");
  return {
    valid,
    diagnostics: Object.freeze(diagnostics),
    value: valid ? (input as unknown as ProjectDefinition) : null,
  };
}
