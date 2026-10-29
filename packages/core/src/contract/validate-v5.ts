// Docs: ./validate-v5.md
import {
  AUTHORED_SCHEMA_VERSION,
  type Diagnostic,
  type ProjectDefinition,
  type TrackDefinition,
  type TriggerDefinition,
} from "./v5";
import { SUPPORTED_TRIGGER_TYPES } from "./v5";
import { unreachable } from "../lang/exhaustive";
import { acceptedOutcome, refusedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { describeDiagnostics, diagnostic } from "./diagnostics";
import { defineOwnValue } from "../lang/own-property";
import { deriveSourceContract } from "./v5-infer";
import { parseTrackDefinition, type ParseContext } from "./v5-parse";

const TEMPLATES_UNSUPPORTED =
  "Project templates are not supported; author keyframes on the tracks that use them.";
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function validateId(
  value: unknown,
  path: string,
  label: string,
  reservedTilde = false,
): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (typeof value !== "string" || !value.length) {
    diagnostics.push(diagnostic("id-shape", path, `${label} id must be a non-empty string.`));
    return diagnostics;
  }
  if (value.includes("/"))
    diagnostics.push(
      diagnostic("id-qualified-separator", path, `${label} id '${value}' must not contain '/'.`),
    );
  if (reservedTilde && value === "~")
    diagnostics.push(
      diagnostic("id-reserved-namespace", path, "The motion id '~' is reserved for free tracks."),
    );
  return diagnostics;
}
export function validateMotionTrigger(trigger: unknown, path: string): Diagnostic[] {
  if (!isObject(trigger))
    return [
      diagnostic(
        "trigger-shape",
        path,
        "Trigger must be an object with type scroll, time, or manual.",
      ),
    ];
  const type = trigger.type;
  if (!SUPPORTED_TRIGGER_TYPES.includes(type as (typeof SUPPORTED_TRIGGER_TYPES)[number]))
    return [
      diagnostic(
        "trigger-shape",
        path,
        "Trigger must be an object with type scroll, time, or manual.",
      ),
    ];
  const diagnostics: Diagnostic[] = [];
  if (type === "time") {
    if (
      typeof trigger.duration !== "number" ||
      !Number.isFinite(trigger.duration) ||
      trigger.duration <= 0
    )
      diagnostics.push(
        diagnostic(
          "trigger-time-duration",
          `${path}.duration`,
          "Time trigger duration must be a finite number greater than zero.",
        ),
      );
    if (trigger.autoplay !== undefined && trigger.autoplay !== true)
      diagnostics.push(
        diagnostic(
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
        diagnostic(
          "trigger-time-repeat-shape",
          `${path}.repeat`,
          "Time trigger repeat must be an integer, -1 for infinite or 0 and above.",
        ),
      );
    if (trigger.yoyo !== undefined && typeof trigger.yoyo !== "boolean")
      diagnostics.push(
        diagnostic(
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
        diagnostic(
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
      diagnostic(
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
// One track, read by the identified-table parser. See validate-v5.md.
function readTrack(
  track: unknown,
  path: string,
  context: ParseContext,
  seenIds: Set<string>,
  diagnostics: Diagnostic[],
): void {
  const parsed = parseTrackDefinition(track, path, context);
  diagnostics.push(...parsed.diagnostics);
  switch (parsed.kind) {
    case "refused":
      return;
    case "accepted": {
      if (parsed.value.plugin === undefined) {
        const inferred = deriveSourceContract(
          parsed.value.input.values,
          parsed.value.input.schema,
          `${path}.input.values`,
          "declared",
        );
        diagnostics.push(...inferred.diagnostics);
      }
      const { id } = parsed.value;
      if (seenIds.has(id))
        diagnostics.push(
          diagnostic("track-duplicate-id", `${path}.id`, `Track id '${id}' is duplicated.`, [id]),
        );
      seenIds.add(id);
      return;
    }
    default:
      return unreachable(parsed);
  }
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
  for (const [key, child] of Object.entries(value)) defineOwnValue(result, key, clone(child, seen));
  return result;
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}
export type TrackValidationResult = Outcome<TrackDefinition, Diagnostic>;
/**
 * One authored track, refused or accepted frozen.
 *
 * The accepted value is the authored document rather than the parser's normalized cells: the
 * runtime retains what the author wrote, and evaluation reads the parsed form from the compiler.
 */
export function validateTrackDefinition(
  track: unknown,
  path: string,
  context: ParseContext = {},
): TrackValidationResult {
  const parsed = parseTrackDefinition(track, path, context);
  switch (parsed.kind) {
    case "refused":
      return refusedOutcomeFrom(parsed.diagnostics);
    case "accepted": {
      const diagnostics: Diagnostic[] = [...parsed.diagnostics];
      if (parsed.value.plugin === undefined) {
        const inferred = deriveSourceContract(
          parsed.value.input.values,
          parsed.value.input.schema,
          `${path}.input.values`,
          "declared",
        );
        diagnostics.push(...inferred.diagnostics);
      }
      const frozen = Object.freeze(diagnostics);
      if (frozen.some(({ severity }) => severity === "error")) return refusedOutcomeFrom(frozen);
      return acceptedOutcome(deepFreeze(clone(track) as TrackDefinition), frozen);
    }
    default:
      return unreachable(parsed);
  }
}
export function validateSchemaV5(
  input: unknown,
  context: ParseContext = {},
): Outcome<ProjectDefinition, Diagnostic> {
  const diagnostics: Diagnostic[] = [];
  if (!isObject(input))
    return refusedOutcome([diagnostic("project-shape", "$", "Project must be an object.")]);
  if (input.schemaVersion !== AUTHORED_SCHEMA_VERSION)
    diagnostics.push(
      diagnostic(
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
      diagnostic("project-id", "projectId", "projectId must be a non-empty string when present."),
    );
  // The removed field, read by the key rather than by the value at it. That is the same reading the
  // retired track `use` field gets a few functions up, and for the same reason: authoring the key
  // is the mistake, so `templates: undefined` is refused too rather than being a spelling that
  // slips a removed field back in through a spread of an older document.
  if ("templates" in input)
    diagnostics.push(
      diagnostic("project-templates-unsupported", "templates", TEMPLATES_UNSUPPORTED),
    );
  if (!Array.isArray(input.motions))
    diagnostics.push(diagnostic("motions-shape", "motions", "motions must be an array."));
  if (input.freeTracks !== undefined && !Array.isArray(input.freeTracks))
    diagnostics.push(diagnostic("free-tracks-shape", "freeTracks", "freeTracks must be an array."));
  const motions = Array.isArray(input.motions) ? input.motions : [];
  const freeTracks = Array.isArray(input.freeTracks) ? input.freeTracks : [];
  const motionIds = new Set<string>();
  const freeIds = new Set<string>();
  for (const [index, rawMotion] of motions.entries()) {
    const path = `motions[${index}]`;
    if (!isObject(rawMotion)) {
      diagnostics.push(diagnostic("motion-shape", path, "Motion must be an object."));
      continue;
    }
    diagnostics.push(...validateId(rawMotion.id, `${path}.id`, "Motion", true));
    const id = typeof rawMotion.id === "string" ? rawMotion.id : "";
    if (id) {
      if (motionIds.has(id))
        diagnostics.push(
          diagnostic("motion-duplicate-id", `${path}.id`, `Motion id '${id}' is duplicated.`, [id]),
        );
      motionIds.add(id);
    }
    diagnostics.push(...validateMotionTrigger(rawMotion.trigger, `${path}.trigger`));
    if (!Array.isArray(rawMotion.tracks)) {
      diagnostics.push(
        diagnostic("motion-tracks-shape", `${path}.tracks`, "Motion tracks must be an array."),
      );
      continue;
    }
    const localIds = new Set<string>();
    for (const [trackIndex, rawTrack] of rawMotion.tracks.entries())
      readTrack(rawTrack, `${path}.tracks[${trackIndex}]`, context, localIds, diagnostics);
  }
  for (const [index, rawTrack] of freeTracks.entries())
    readTrack(rawTrack, `freeTracks[${index}]`, context, freeIds, diagnostics);
  const perspective = input.perspective;
  if (
    perspective !== undefined &&
    (typeof perspective !== "number" || !Number.isFinite(perspective) || perspective <= 0)
  )
    diagnostics.push(
      diagnostic(
        "perspective-shape",
        "perspective",
        "Perspective must be a finite number greater than zero.",
      ),
    );
  if (diagnostics.some(({ severity }) => severity === "error"))
    return refusedOutcomeFrom<ProjectDefinition, Diagnostic>(Object.freeze(diagnostics));
  return acceptedOutcome(deepFreeze(clone(input) as ProjectDefinition), Object.freeze(diagnostics));
}
