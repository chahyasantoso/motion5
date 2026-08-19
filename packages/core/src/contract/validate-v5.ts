import {
  AUTHORED_SCHEMA_VERSION,
  type Diagnostic,
  type ProjectDefinition,
  type TrackDefinition,
  type TriggerDefinition,
} from "./v5";
import { SUPPORTED_TRIGGER_TYPES } from "./v5";
import { describeDiagnostics, diagnostic as issue } from "./diagnostics";
import { buildGraphIR } from "../graph/ir";

export interface ValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly value: ProjectDefinition | null;
}
export interface KeyframeValidationOptions {
  readonly ruleIdPrefix?: string;
  readonly ruleIdAliases?: Readonly<Record<string, string>>;
  /**
   * Plugin-named groups are an authoring form. A contributed property is a single flat output, so
   * the contribution path passes `false` and keeps the pre-group strictness: an object of objects
   * contributed as a property stays a `stops-shape` error instead of being read as a group.
   */
  readonly allowGroups?: boolean;
}
const STOPS_REQUIRED = "Authored properties require a stops array.";
const THREE_D_KEYS = ["z", "rotationX", "rotationY"];
type RawObject = Record<string, unknown>;
function isObject(value: unknown): value is RawObject {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
/**
 * Whether an authored keyframe entry is a plugin-named group rather than a property.
 *
 * The test is structural because the contract layer has no plugin registry and must not gain one:
 * a group is a non-empty object with no `stops` array whose every value is an object. Whether the
 * group name addresses a registered plugin, and whether that plugin claims each leaf, is ownership
 * rather than schema shape, and `plugin-unknown-key` owns it at resolve time. See ADR-041.
 */
export function isKeyframeGroup(value: unknown): value is RawObject {
  if (!isObject(value) || Array.isArray(value.stops)) return false;
  const leaves = Object.values(value);
  return leaves.length > 0 && leaves.every((leaf) => isObject(leaf));
}
export function validateKeyframes(
  keyframes: unknown,
  path: string,
  diagnostics: Diagnostic[],
  options: KeyframeValidationOptions = {},
): void {
  const prefix = options.ruleIdPrefix ?? "";
  const aliases = options.ruleIdAliases ?? {};
  const allowGroups = options.allowGroups ?? true;
  const add = (
    ruleId: string,
    rulePath: string,
    message: string,
    severity: Diagnostic["severity"] = "error",
  ) =>
    diagnostics.push(issue(`${prefix}${aliases[ruleId] ?? ruleId}`, rulePath, message, severity));
  if (keyframes === undefined) return;
  if (!isObject(keyframes)) {
    add("keyframes-shape", path, "Track keyframes must be an object.");
    return;
  }
  // The colon is reserved rather than conventional. `Track` treats a colon key as a plugin's
  // private namespace and never publishes it, so an authored key spelled with one would be
  // animated and then hidden, and `{ "fk:length": ... }` would become a second spelling of the
  // flattened `{ fk: { length: ... } }`. That is the dual namespace grouping exists to remove.
  const checkName = (name: string, namePath: string): void => {
    if (!name.includes(":")) return;
    const detail = "must not contain ':', which is reserved for internal keys";
    add("keyframes-reserved-separator", namePath, `Keyframe name '${name}' ${detail}.`);
  };
  // Every authored spelling of one compiled key. A group leaf that collides with another group's
  // leaf or with a flat key is rejected here, which is why `flattenAuthoredKeyframes` may resolve
  // ties by sorted order instead of reporting the same rule a second time from the domain layer.
  const owners = new Map<string, string>();
  const claim = (key: string, keyPath: string): void => {
    const owner = owners.get(key);
    if (owner === undefined) {
      owners.set(key, keyPath);
      return;
    }
    const detail = `is already authored at '${owner}'`;
    add("keyframes-duplicate-key", keyPath, `Keyframe key '${key}' ${detail}.`);
  };
  const validateStops = (stops: readonly unknown[], propertyPath: string): void => {
    let previous: number | undefined;
    const positions = new Set<number>();
    for (const [index, rawStop] of stops.entries()) {
      const stopPath = `${propertyPath}.stops[${index}]`;
      if (!isObject(rawStop) || typeof rawStop.p !== "number" || !Number.isFinite(rawStop.p)) {
        add("stop-position", `${stopPath}.p`, "Stop p must be a finite number.");
        continue;
      }
      const position = rawStop.p;
      if (position < 0 || position > 1)
        add("stop-position-range", `${stopPath}.p`, "Stop p must be between 0 and 1.");
      if (previous !== undefined && position < previous)
        add("stop-position-order", `${stopPath}.p`, "Stop positions must be monotonic.");
      if (positions.has(position))
        add("stop-position-duplicate", `${stopPath}.p`, "Stop positions must be unique.");
      positions.add(position);
      previous = position;
    }
    if (positions.size > 0 && !positions.has(0))
      add("stop-missing-start", propertyPath, "Stop sequence does not define p=0.", "warning");
    if (positions.size > 0 && !positions.has(1))
      add("stop-missing-end", propertyPath, "Stop sequence does not define p=1.", "warning");
  };
  const validateProperty = (property: unknown, propertyPath: string): void => {
    if (!isObject(property)) {
      add("stops-shape", `${propertyPath}.stops`, STOPS_REQUIRED);
      return;
    }
    if (Object.keys(property).length === 0) return;
    if (!Array.isArray(property.stops)) {
      add("stops-shape", `${propertyPath}.stops`, STOPS_REQUIRED);
      return;
    }
    validateStops(property.stops, propertyPath);
  };
  for (const [key, rawProperty] of Object.entries(keyframes)) {
    const propertyPath = `${path}.${key}`;
    checkName(key, propertyPath);
    if (!allowGroups || !isKeyframeGroup(rawProperty)) {
      claim(key, propertyPath);
      validateProperty(rawProperty, propertyPath);
      continue;
    }
    // One level, not arbitrary depth. A group holds properties, and a property holds stops, so
    // there is no third level for an author to reach for.
    for (const [leaf, leafProperty] of Object.entries(rawProperty)) {
      const leafPath = `${propertyPath}.${leaf}`;
      checkName(leaf, leafPath);
      claim(leaf, leafPath);
      validateProperty(leafProperty, leafPath);
    }
  }
}
function validateId(
  value: unknown,
  path: string,
  label: string,
  reservedTilde = false,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (typeof value !== "string" || !value.length) {
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
export function validateMotionTrigger(trigger: unknown, path: string): Diagnostic[] {
  if (!isObject(trigger))
    return [
      issue("trigger-shape", path, "Trigger must be an object with type scroll, time, or manual."),
    ];
  const type = trigger.type;
  if (!SUPPORTED_TRIGGER_TYPES.includes(type as (typeof SUPPORTED_TRIGGER_TYPES)[number]))
    return [
      issue("trigger-shape", path, "Trigger must be an object with type scroll, time, or manual."),
    ];
  const diagnostics: Diagnostic[] = [];
  if (type === "time") {
    if (
      typeof trigger.duration !== "number" ||
      !Number.isFinite(trigger.duration) ||
      trigger.duration <= 0
    )
      diagnostics.push(
        issue(
          "trigger-time-duration",
          `${path}.duration`,
          "Time trigger duration must be a finite number greater than zero.",
        ),
      );
    if (trigger.autoplay !== undefined && trigger.autoplay !== true)
      diagnostics.push(
        issue(
          "trigger-time-autoplay-unsupported",
          `${path}.autoplay`,
          "Time trigger autoplay must be true when present; paused behavior is not supported.",
        ),
      );
    // `repeat` counts the passes after the initial one, so 0 is a single pass and -1 is infinite.
    // The blanket rejection this replaced existed only because loop semantics were undesigned;
    // ADR-040 designs them, so the fields are now honored rather than refused.
    const repeatValue = typeof trigger.repeat === "number" ? trigger.repeat : undefined;
    const repeatValid =
      repeatValue !== undefined && Number.isInteger(repeatValue) && repeatValue >= -1;
    if (trigger.repeat !== undefined && !repeatValid)
      diagnostics.push(
        issue(
          "trigger-time-repeat-shape",
          `${path}.repeat`,
          "Time trigger repeat must be an integer, -1 for infinite or 0 and above.",
        ),
      );
    if (trigger.yoyo !== undefined && typeof trigger.yoyo !== "boolean")
      diagnostics.push(
        issue(
          "trigger-time-yoyo-shape",
          `${path}.yoyo`,
          "Time trigger yoyo must be a boolean when present.",
        ),
      );
    // A yoyo with nothing to reverse would be a field accepted and then ignored, which rule 6 of
    // ADR-033 forbids. `false` is refused for the same reason `true` is: neither has any effect
    // without a repeat, so the rule is about presence rather than value.
    if (trigger.yoyo !== undefined && !(repeatValid && repeatValue !== 0))
      diagnostics.push(
        issue(
          "trigger-time-yoyo-requires-repeat",
          `${path}.yoyo`,
          "Time trigger yoyo requires repeat to be -1 or greater than zero.",
        ),
      );
  }
  if (
    type === "scroll" &&
    trigger.source !== undefined &&
    (typeof trigger.source !== "string" || trigger.source.length === 0)
  )
    diagnostics.push(
      issue(
        "trigger-scroll-source",
        `${path}.source`,
        "Scroll trigger source must be a non-empty string when present.",
      ),
    );
  return diagnostics;
}
/**
 * The one narrowing boundary for authored triggers.
 *
 * `MotionDefinition.trigger` is deliberately structurally open (plan section 5.1) so authored
 * extension keys survive validation. The cost is that `trigger.source` and `trigger.duration` are
 * `unknown` to every consumer, which previously pushed each `TriggerFactory` into re-deriving the
 * discriminated union with its own `typeof` guards and sentinels.
 *
 * By the time any factory runs the trigger is already proven valid, so the narrowing belongs here.
 * This function holds the only cast from authored input to `TriggerDefinition`, and that cast is
 * justified by the `validateMotionTrigger` call immediately above it.
 */
export function resolveTriggerDefinition(trigger: unknown, path: string): TriggerDefinition {
  const diagnostics = validateMotionTrigger(trigger, path);
  if (diagnostics.length > 0) throw new TypeError(describeDiagnostics(diagnostics));
  return trigger as TriggerDefinition;
}
function hasThreeDPath(property: RawObject): boolean {
  if (!Array.isArray(property.points)) return false;
  return property.points.some(
    (point) => isObject(point) && typeof point.z === "number" && point.z !== 0,
  );
}
function isThreeDProperty(key: string, property: unknown): boolean {
  if (THREE_D_KEYS.includes(key)) return property !== undefined && property !== null;
  return key === "path" && isObject(property) && hasThreeDPath(property);
}
// Compares leaf names, not flat record keys. A `rotationY` authored inside a group is the same 3D
// content as a flat one, and reading only the top level made `perspective-usage` stop firing for
// it: a silently lost warning rather than a rejected project.
function usesThreeD(track: RawObject): boolean {
  const keyframes = isObject(track.keyframes) ? track.keyframes : null;
  if (!keyframes) return false;
  for (const [key, property] of Object.entries(keyframes)) {
    if (isThreeDProperty(key, property)) return true;
    if (!isKeyframeGroup(property)) continue;
    for (const [leaf, leafProperty] of Object.entries(property)) {
      if (isThreeDProperty(leaf, leafProperty)) return true;
    }
  }
  return false;
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
  if ("use" in track)
    diagnostics.push(
      issue(
        "plugin-contribution-unsupported-entry",
        `${path}.use`,
        "Track use is not supported; resolve plugins from authored keyframes.",
        "error",
        [String(track.use)],
      ),
    );
  validateKeyframes(track.keyframes, `${path}.keyframes`, diagnostics);
  if (typeof track.id === "string" && track.id.length) {
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
export interface TrackValidationResult {
  readonly valid: boolean;
  readonly diagnostics: readonly Diagnostic[];
  readonly value: TrackDefinition | null;
}
export function validateTrackDefinition(track: unknown, path: string): TrackValidationResult {
  const diagnostics: Diagnostic[] = [];
  const validShape = validateTrackShape(track, path, new Set<string>(), diagnostics);
  const valid = validShape && !diagnostics.some(({ severity }) => severity === "error");
  return {
    valid,
    diagnostics: Object.freeze(diagnostics),
    value: valid ? deepFreeze(clone(track) as TrackDefinition) : null,
  };
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
    (typeof input.projectId !== "string" || !input.projectId.length)
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
    diagnostics.push(...validateMotionTrigger(rawMotion.trigger, `${path}.trigger`));
    if (!Array.isArray(rawMotion.tracks)) {
      diagnostics.push(
        issue("motion-tracks-shape", `${path}.tracks`, "Motion tracks must be an array."),
      );
      continue;
    }
    const localIds = new Set<string>();
    for (const [trackIndex, rawTrack] of rawMotion.tracks.entries()) {
      const trackPath = `${path}.tracks[${trackIndex}]`;
      if (validateTrackShape(rawTrack, trackPath, localIds, diagnostics))
        allTracks.push(rawTrack as unknown as RawObject);
    }
  }
  for (const [index, rawTrack] of freeTracks.entries()) {
    const path = `freeTracks[${index}]`;
    if (validateTrackShape(rawTrack, path, freeIds, diagnostics))
      allTracks.push(rawTrack as unknown as RawObject);
  }
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
  if (!diagnostics.some(({ severity }) => severity === "error"))
    diagnostics.push(...buildGraphIR(input as unknown as ProjectDefinition).diagnostics);
  const valid = !diagnostics.some(({ severity }) => severity === "error");
  return {
    valid,
    diagnostics: Object.freeze(diagnostics),
    value: valid ? deepFreeze(clone(input) as ProjectDefinition) : null,
  };
}
