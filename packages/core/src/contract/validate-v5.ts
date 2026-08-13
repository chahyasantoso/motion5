import {
  AUTHORED_SCHEMA_VERSION,
  type Diagnostic,
  type ProjectDefinition,
  type TrackDefinition,
} from "./v5";
import { SUPPORTED_TRIGGER_TYPES } from "./v5";
import { buildGraphIR } from "../graph/ir";

export interface ValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly value: ProjectDefinition | null;
}

type RawObject = Record<string, unknown>;

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
      diagnostics.push(issue("stops-shape", `${propertyPath}.stops`, "Authored properties require a stops array."));
      continue;
    }
    if (Object.keys(rawProperty).length === 0) continue;
    if (!Array.isArray(rawProperty.stops)) {
      diagnostics.push(issue("stops-shape", `${propertyPath}.stops`, "Authored properties require a stops array."));
      continue;
    }
    let previous: number | undefined;
    const positions = new Set<number>();
    for (const [index, rawStop] of rawProperty.stops.entries()) {
      const stopPath = `${propertyPath}.stops[${index}]`;
      if (!isObject(rawStop) || typeof rawStop.p !== "number" || !Number.isFinite(rawStop.p)) {
        diagnostics.push(issue("stop-position", `${stopPath}.p`, "Stop p must be a finite number."));
        continue;
      }
      const position = rawStop.p;
      if (position < 0 || position > 1)
        diagnostics.push(issue("stop-position-range", `${stopPath}.p`, "Stop p must be between 0 and 1."));
      if (previous !== undefined && position < previous)
        diagnostics.push(issue("stop-position-order", `${stopPath}.p`, "Stop positions must be monotonic."));
      if (positions.has(position))
        diagnostics.push(issue("stop-position-duplicate", `${stopPath}.p`, "Stop positions must be unique."));
      positions.add(position);
      previous = position;
    }
    if (positions.size > 0 && !positions.has(0))
      diagnostics.push(issue("stop-missing-start", propertyPath, "Stop sequence does not define p=0.", "warning"));
    if (positions.size > 0 && !positions.has(1))
      diagnostics.push(issue("stop-missing-end", propertyPath, "Stop sequence does not define p=1.", "warning"));
  }
}

function validateId(value: unknown, path: string, label: string, reservedTilde = false): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (typeof value !== "string" || value.length === 0) {
    diagnostics.push(issue("id-shape", path, `${label} id must be a non-empty string.`));
    return diagnostics;
  }
  if (value.includes("/"))
    diagnostics.push(issue("id-qualified-separator", path, `${label} id '${value}' must not contain '/'.`));
  if (reservedTilde && value === "~")
    diagnostics.push(issue("id-reserved-namespace", path, "The motion id '~' is reserved for free tracks."));
  return diagnostics;
}

function usesThreeD(track: RawObject): boolean {
  const keyframes = isObject(track.keyframes) ? track.keyframes : null;
  if (!keyframes) return false;
  if (["z", "rotationX", "rotationY"].some((key) => keyframes[key] !== undefined && keyframes[key] !== null)) return true;
  const path = isObject(keyframes.path) ? keyframes.path : null;
  return Array.isArray(path?.points) && path.points.some((point) => isObject(point) && typeof point.z === "number" && point.z !== 0);
}

function validateTrackShape(track: unknown, path: string, seenIds: Set<string>, diagnostics: Diagnostic[]): track is TrackDefinition {
  if (!isObject(track)) {
    diagnostics.push(issue("track-shape", path, "Track must be an object."));
    return false;
  }
  diagnostics.push(...validateId(track.id, `${path}.id`, "Track"));
  validateKeyframes(track.keyframes, `${path}.keyframes`, diagnostics);
  if (typeof track.id === "string" && track.id.length > 0) {
    if (seenIds.has(track.id)) diagnostics.push(issue("track-duplicate-id", `${path}.id`, `Track id '${track.id}' is duplicated.`, "error", [track.id]));
    seenIds.add(track.id);
  }
  if (track.observes !== undefined && !Array.isArray(track.observes))
    diagnostics.push(issue("observes-shape", `${path}.observes`, "Track observes must be an array."));
  return true;
}

function clone(value: unknown, seen = new WeakMap<object, unknown>()): unknown {
  if (value === null || typeof value !== "object") return value;
  const existing = seen.get(value);
  if (existing !== undefined) return existing;
  if (Array.isArray(value)) {
    const result: unknown[] = [];
    seen.set(value, result);
    for (const item of value) result.push(clone(item, seen));
    return result;
  }
  const result: Record<string, unknown> = {};
  seen.set(value, result);
  for (const [key, child] of Object.entries(value)) result[key] = clone(child, seen);
  return result;
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

export function validateV5(input: unknown): ValidationResult {
  const diagnostics: Diagnostic[] = [];
  if (!isObject(input))
    return { valid: false, diagnostics: [issue("project-shape", "$", "Project must be an object.")], value: null };

  if (input.schemaVersion !== AUTHORED_SCHEMA_VERSION)
    diagnostics.push(issue("schema-version", "schemaVersion", `Expected schemaVersion ${AUTHORED_SCHEMA_VERSION}.`));
  if (input.projectId !== undefined && (typeof input.projectId !== "string" || input.projectId.length === 0))
    diagnostics.push(issue("project-id", "projectId", "projectId must be a non-empty string when present."));
  if (!Array.isArray(input.motions)) diagnostics.push(issue("motions-shape", "motions", "motions must be an array."));
  if (input.freeTracks !== undefined && !Array.isArray(input.freeTracks))
    diagnostics.push(issue("free-tracks-shape", "freeTracks", "freeTracks must be an array."));

  const motions = Array.isArray(input.motions) ? input.motions : [];
  const freeTracks = Array.isArray(input.freeTracks) ? input.freeTracks : [];
  const motionIds = new Set<string>();
  const freeIds = new Set<string>();
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
      if (motionIds.has(id)) diagnostics.push(issue("motion-duplicate-id", `${path}.id`, `Motion id '${id}' is duplicated.`, "error", [id]));
      motionIds.add(id);
    }
    if (!isObject(rawMotion.trigger) || !SUPPORTED_TRIGGER_TYPES.includes(rawMotion.trigger.type as (typeof SUPPORTED_TRIGGER_TYPES)[number]))
      diagnostics.push(issue("trigger-shape", `${path}.trigger`, "Trigger must be an object with type scroll, time, or manual."));
    if (!Array.isArray(rawMotion.tracks)) {
      diagnostics.push(issue("motion-tracks-shape", `${path}.tracks`, "Motion tracks must be an array."));
      continue;
    }
    const localIds = new Set<string>();
    for (const [trackIndex, rawTrack] of rawMotion.tracks.entries()) {
      const trackPath = `${path}.tracks[${trackIndex}]`;
      if (!validateTrackShape(rawTrack, trackPath, localIds, diagnostics)) continue;
      allTracks.push(rawTrack as RawObject);
    }
  }

  for (const [index, rawTrack] of freeTracks.entries()) {
    const path = `freeTracks[${index}]`;
    const localIds = freeIds;
    if (!validateTrackShape(rawTrack, path, localIds, diagnostics)) continue;
    allTracks.push(rawTrack as RawObject);
  }

  const perspective = input.perspective;
  if (perspective !== undefined && (typeof perspective !== "number" || !Number.isFinite(perspective) || perspective <= 0))
    diagnostics.push(issue("perspective-shape", "perspective", "Perspective must be a finite number greater than zero."));
  if (perspective === undefined)
    for (const track of allTracks)
      if (usesThreeD(track)) diagnostics.push(issue("perspective-usage", "perspective", "3D keyframes require a project perspective.", "warning", [String(track.id ?? "")]));

  const hasErrors = diagnostics.some(({ severity }) => severity === "error");
  if (!hasErrors) {
    const graph = buildGraphIR(input as unknown as ProjectDefinition);
    diagnostics.push(...graph.diagnostics);
  }
  const valid = !diagnostics.some(({ severity }) => severity === "error");
  const accepted = valid ? deepFreeze(clone(input) as ProjectDefinition) : null;
  return { valid, diagnostics: Object.freeze(diagnostics), value: accepted };
}
