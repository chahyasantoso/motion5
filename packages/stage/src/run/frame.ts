import {
  NO_EVENTS,
  elapsedOf,
  unreachable,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { NO_REST, type RestReader } from "../author/layout";
import type { Moves } from "../author/stage";
import { carryFor } from "./carry";
import { isPlainRecord, type Stage } from "./compile";
import type { StageError } from "./errors";

/** One frame's inputs; `boxes` holds each layout's measured rest, else the piece's own rests are read. */
export interface FrameInput {
  readonly time: Time;
  readonly events?: Events | undefined;
  readonly boxes?: Readonly<Record<string, RestReader>> | undefined;
  /** Visual line index per item of a split text list, measured from layout on a page mount. */
  readonly lines?: Readonly<Record<string, readonly number[]>> | undefined;
  /** Only these elements run; the rest are left out of `targets`. */
  readonly only?: ReadonlySet<string> | undefined;
  /** Filled as elements run, list parts included: which can change with the clock alone. */
  readonly moves?: Map<string, Moves> | undefined;
}

/** One frame: the layout showing, who shows, and the scene's output as returned. */
export interface FrameOutput {
  readonly layout: string;
  readonly visible: Readonly<Record<string, boolean>>;
  /** Unchecked; read it with `poseOf` and `listPose`, and pass it to `check` to find shape mistakes. */
  readonly targets: Readonly<Record<string, unknown>>;
}

// The scene's type checks each field; at run time a pose is any plain object.
function isPose(value: unknown): value is Pose2d {
  return isPlainRecord(value);
}

/** The pose a target holds, or undefined when it holds none. */
export function poseOf(value: unknown): Pose2d | undefined {
  return isPose(value) ? value : undefined;
}

/** Item `index` of `count` from a list's target, or undefined when the scene gave none. */
export function listPose(value: unknown, index: number, count: number): Pose2d | undefined {
  return typeof value === "function"
    ? poseOf(Reflect.apply(value, undefined, [index, count]))
    : undefined;
}

/** Runs the scene once; no checks, so it costs the scene and one visibility lookup. */
export function frame(stage: Stage, input: FrameInput): FrameOutput {
  const events = input.events ?? NO_EVENTS;
  const layouts = input.boxes ?? stage.layouts.readers;
  const layout = stage.layouts.pick(events);
  const rest = layouts[layout] ?? NO_REST;
  const time = input.time;
  const targets = stage.scene({
    time,
    beats: stage.beats,
    events,
    rest,
    layouts,
    carry: carryFor(stage.layouts.pick, layouts, rest, events, time),
    ...(input.lines === undefined ? {} : { lines: input.lines }),
    ...(input.only === undefined ? {} : { only: input.only }),
    ...(input.moves === undefined ? {} : { moves: input.moves }),
  });
  if (!isPlainRecord(targets))
    throw new TypeError("scene must return an object of member names to poses.");
  const ms = elapsedOf(time.clock) ?? time.progress * stage.durationMs;
  return { layout, visible: stage.visibleAt(ms), targets };
}

/** Every shape mistake in a frame's targets: arrays or non-poses, lists not given as functions, unknown names. */
export function check(
  stage: Stage,
  targets: Readonly<Record<string, unknown>>,
): readonly StageError[] {
  const errors: StageError[] = [];
  const named = new Set<string>();
  for (const member of stage.members) {
    named.add(member.name);
    const value = Object.hasOwn(targets, member.name) ? targets[member.name] : undefined;
    if (value === undefined) continue;
    const mismatch = (reason: string): void => {
      errors.push({ kind: "shape_mismatch", member: member.name, reason });
    };
    switch (member.kind) {
      case "actor":
      case "group":
        if (poseOf(value) === undefined)
          mismatch(`needs a pose object, got ${Array.isArray(value) ? "an array" : typeof value}.`);
        break;
      case "list":
        if (typeof value !== "function")
          mismatch(
            `is a list: give it \`(index, count) => pose\`, got ${Array.isArray(value) ? "an array" : typeof value}.`,
          );
        else
          for (let index = 0; index < member.items.length; index += 1)
            if (listPose(value, index, member.items.length) === undefined) {
              mismatch(`answered no pose object for item ${index}.`);
              break;
            }
        break;
      default:
        return unreachable(member);
    }
  }
  for (const name of Object.keys(targets))
    if (!named.has(name)) errors.push({ kind: "unknown_target", name });
  return errors;
}
