import {
  NO_EVENTS,
  elapsedOf,
  unreachable,
  type Cubic2d,
  type Events,
  type Time,
} from "@gerak/core";
import { presentAt } from "../beats/index";
import { blendShapes, type CompiledMembers } from "../cast/index";
import {
  sceneRunnerOf,
  type CompiledStage,
  type PoseFor,
  type PoseMode,
  type StageError,
} from "../compile/index";
import {
  NO_LAYOUT_READERS,
  NO_REST_READER,
  createCarry,
  restReader,
  type LayoutSpec,
  type RestReader,
} from "../layout/index";

/** Shape mismatch error variant returned by `validateSceneOutput` and `evaluateFrame`. */
export type ShapeMismatchError = Extract<StageError, { readonly kind: "shape_mismatch" }>;

/** Inputs to `evaluateFrame`: current `time`, accumulated `events`, and optional measured `boxes`. */
export interface FrameInput<L extends string = string> {
  readonly time: Time;
  readonly events?: Events | undefined;
  readonly boxes?: RestReader | Readonly<Record<L, RestReader>> | undefined;
}

/** Evaluated frame output ready for renderers and headless review. */
export type FrameEvaluation<P extends PoseMode = "2d"> =
  | {
      readonly ok: true;
      readonly layout: string | undefined;
      readonly visibility: Readonly<Record<string, boolean>>;
      readonly poses: Readonly<Record<string, PoseFor<P> | readonly PoseFor<P>[]>>;
      readonly readouts: Readonly<Record<string, string>>;
      readonly readoutErrors: readonly { readonly member: string; readonly error: unknown }[];
      readonly morphs: Readonly<Record<string, readonly Cubic2d[]>>;
      readonly extraTargets: readonly string[];
    }
  | {
      readonly ok: false;
      readonly errors: readonly ShapeMismatchError[];
    };

function isPoseObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Single-owner shape check enforcing actor/group objects and exact-length list arrays. */
export function validateSceneOutput(
  members: CompiledMembers,
  output: unknown,
): { readonly ok: true } | { readonly ok: false; readonly errors: readonly ShapeMismatchError[] } {
  if (!isPoseObject(output)) {
    return {
      ok: false,
      errors: Object.freeze([
        {
          kind: "shape_mismatch",
          member: "<scene>",
          reason: "scene must return an object mapping member names to poses.",
        },
      ]),
    };
  }

  const errors: ShapeMismatchError[] = [];
  for (const member of members.topLevel) {
    if (!Object.hasOwn(output, member.name)) continue;
    const value: unknown = Reflect.get(output, member.name);
    if (value === undefined) continue;
    switch (member.kind) {
      case "actor":
      case "group":
        if (Array.isArray(value))
          errors.push({
            kind: "shape_mismatch",
            member: member.name,
            reason: "expected a pose object, got an array.",
          });
        else if (!isPoseObject(value))
          errors.push({
            kind: "shape_mismatch",
            member: member.name,
            reason: `expected a pose object, got ${typeof value}.`,
          });
        break;
      case "list": {
        const expected = member.itemCount ?? 0;
        if (!Array.isArray(value))
          errors.push({
            kind: "shape_mismatch",
            member: member.name,
            reason: `expected an array of ${expected} poses, got ${typeof value}.`,
          });
        else if (value.length !== expected)
          errors.push({
            kind: "shape_mismatch",
            member: member.name,
            reason: `expected ${expected} poses, got ${value.length}.`,
          });
        else {
          const badIndex = value.findIndex((item) => !isPoseObject(item));
          if (badIndex >= 0)
            errors.push({
              kind: "shape_mismatch",
              member: `${member.name}.${badIndex}`,
              reason: "list item must be a pose object.",
            });
        }
        break;
      }
      case "item":
        break;
      default:
        return unreachable(member.kind);
    }
  }
  return errors.length === 0 ? { ok: true } : { ok: false, errors: Object.freeze(errors) };
}

function isRestReader(value: unknown): value is RestReader {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "get") === "function" &&
    typeof Reflect.get(value, "has") === "function" &&
    typeof Reflect.get(value, "keys") === "function"
  );
}

function resolveBoxes(
  layout: LayoutSpec<string>,
  boxes: RestReader | Readonly<Record<string, RestReader>> | undefined,
  events: Events,
): {
  readonly activeLayout: string | undefined;
  readonly rest: RestReader;
  readonly layouts: Readonly<Record<string, RestReader>>;
} {
  switch (layout.kind) {
    case "single": {
      const rest = isRestReader(boxes)
        ? boxes
        : layout.rest === undefined
          ? NO_REST_READER
          : restReader(layout.rest);
      return { activeLayout: undefined, rest, layouts: NO_LAYOUT_READERS };
    }
    case "multi": {
      const activeLayout = layout.pick(events);
      const readers: Record<string, RestReader> = {};
      if (isRestReader(boxes)) {
        for (const name of layout.names)
          readers[name] = name === activeLayout ? boxes : restReader(layout.rests?.[name]);
      } else {
        for (const name of layout.names) {
          const supplied = boxes?.[name];
          readers[name] =
            supplied !== undefined
              ? supplied
              : layout.rests?.[name] === undefined
                ? NO_REST_READER
                : restReader(layout.rests[name]);
        }
      }
      const frozen = Object.freeze(readers);
      return {
        activeLayout,
        rest: frozen[activeLayout] ?? NO_REST_READER,
        layouts: frozen,
      };
    }
    default:
      return unreachable(layout);
  }
}

function readShapeNumber(pose: unknown): number {
  if (!isPoseObject(pose)) return 0;
  const shape: unknown = Reflect.get(pose, "shape");
  return typeof shape === "number" ? shape : 0;
}

function isTypedPose<P extends PoseMode>(value: unknown): value is PoseFor<P> {
  return isPoseObject(value);
}

function isTypedPoseList<P extends PoseMode>(value: unknown): value is readonly PoseFor<P>[] {
  return Array.isArray(value) && value.every(isPoseObject);
}

/** Evaluates `stage` at `{ time, events, boxes }` with shape checks, readouts, visibility, and morphs. */
export function evaluateFrame<P extends PoseMode = "2d">(
  stage: CompiledStage<P>,
  input: FrameInput,
): FrameEvaluation<P> {
  const runner = sceneRunnerOf(stage);
  if (runner === undefined)
    throw new Error("evaluateFrame: stage was not compiled with compileStage.");

  const events = input.events ?? NO_EVENTS;
  const { activeLayout, rest, layouts } = resolveBoxes(stage.layout, input.boxes, events);
  const carry = createCarry(stage.layout, rest, layouts, events, input.time);
  const raw = runner({
    time: input.time,
    beats: stage.beats,
    events,
    rest,
    layouts,
    carry,
  });

  const checked = validateSceneOutput(stage.members, raw);
  if (!checked.ok) return checked;

  const poses: Record<string, PoseFor<P> | readonly PoseFor<P>[]> = {};
  const extraTargets: string[] = [];
  if (isPoseObject(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      if (value === undefined) continue;
      if (!stage.members.byName.has(key)) {
        extraTargets.push(key);
        continue;
      }
      if (isTypedPoseList<P>(value)) poses[key] = value;
      else if (isTypedPose<P>(value)) poses[key] = value;
    }
  }

  const ms = elapsedOf(input.time.clock) ?? input.time.progress * stage.beats.durationMs;
  const spanOf = (beat: string) =>
    stage.beats.order.includes(beat) ? stage.beats[beat] : undefined;
  const ownVisible = new Map<string, boolean>();
  for (const entry of stage.members.entries) {
    ownVisible.set(
      entry.name,
      entry.on === undefined ? true : presentAt(entry.on, spanOf, stage.beats.durationMs, ms),
    );
  }
  const visibility: Record<string, boolean> = {};
  for (const entry of stage.members.entries) {
    const shown =
      (ownVisible.get(entry.name) ?? true) &&
      (entry.list === undefined || (ownVisible.get(entry.list) ?? true)) &&
      entry.groups.every((group) => ownVisible.get(group) ?? true);
    visibility[entry.name] = shown;
  }

  const readouts: Record<string, string> = {};
  const readoutErrors: { readonly member: string; readonly error: unknown }[] = [];
  for (const entry of stage.members.readouts) {
    try {
      readouts[entry.name] = entry.content.format(input.time);
    } catch (error) {
      readoutErrors.push({ member: entry.name, error });
    }
  }

  const morphs: Record<string, readonly Cubic2d[]> = {};
  for (const entry of stage.members.morphs) {
    const targetPose =
      entry.list !== undefined && entry.index !== undefined
        ? (() => {
            const listPose = poses[entry.list];
            return Array.isArray(listPose) ? listPose[entry.index] : undefined;
          })()
        : poses[entry.name];
    const shape = readShapeNumber(targetPose);
    morphs[entry.name] =
      shape === 0
        ? (entry.content.matched[0] ?? entry.content.base)
        : blendShapes(entry.content.matched, shape);
  }

  return {
    ok: true,
    layout: activeLayout,
    visibility,
    poses,
    readouts,
    readoutErrors,
    morphs,
    extraTargets,
  };
}
