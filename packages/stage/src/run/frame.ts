import {
  NO_INPUT,
  elapsedOf,
  scroll,
  unreachable,
  type Input,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import type { ScrollWindow } from "../author/cast";
import { NO_REST, type RestAt, type RestReader } from "../author/layout";
import type { Drive, InputNeed, Moves } from "../author/stage";
import { carryFor } from "./carry";
import { isPlainRecord, type Member, type Stage } from "./compile";
import type { StageError } from "./errors";

/** One frame's inputs: the time, events, measured rest boxes, and re-measure history. */
export interface FrameInput {
  readonly time: Time;
  readonly events?: Input | undefined;
  readonly rest?: RestReader | undefined;
  /** Each measurement in time order, so `carry` can move a member after a re-measure. */
  readonly measures?: readonly RestAt[] | undefined;
  /** Part count per list element, from the mount's binding or the cache's `<name>.<index>` boxes. */
  readonly counts?: Readonly<Record<string, number>> | undefined;
  /** Visual line index per item of a split text list, measured from layout on a page mount. */
  readonly lines?: Readonly<Record<string, readonly number[]>> | undefined;
  /** Only these elements run; the rest are left out of `targets`. */
  readonly only?: ReadonlySet<string> | undefined;
  /** Filled as elements run, list parts included: which can change with the clock alone. */
  readonly moves?: Map<string, Moves> | undefined;
  /** Filled as elements run, list parts included: what drives each besides its windows' time and boxes. */
  readonly drives?: Map<string, Drive> | undefined;
  /** Filled as elements run, list parts included: which dynamic input channels each read. */
  readonly inputs?: Map<string, InputNeed> | undefined;
}

/** One frame: who shows, and the scene's output as returned. */
export interface FrameOutput {
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

function isPose3d(value: unknown): value is Pose3d {
  return isPlainRecord(value);
}

/** The 3D pose an object's target holds, or undefined when it holds none. */
export function pose3dOf(value: unknown): Pose3d | undefined {
  return isPose3d(value) ? value : undefined;
}

/** Item `index` of `count` from a list's target, or undefined when the scene gave none. */
export function listPose(value: unknown, index: number, count: number): Pose2d | undefined {
  return typeof value === "function"
    ? poseOf(Reflect.apply(value, undefined, [index, count]))
    : undefined;
}

/** Item `index` of `count` from a 3D list's target, or undefined when the scene gave none. */
export function listPose3d(value: unknown, index: number, count: number): Pose3d | undefined {
  return typeof value === "function"
    ? pose3dOf(Reflect.apply(value, undefined, [index, count]))
    : undefined;
}

function indexedMax(keys: readonly string[], prefix: string, initial: number): number {
  let count = initial;
  for (const key of keys) {
    if (!key.startsWith(prefix)) continue;
    const index = Number(key.slice(prefix.length));
    if (Number.isInteger(index) && index >= 0 && index + 1 > count) count = index + 1;
  }
  return count;
}

/** Each list member's part count (2D list or 3D object parts) from `rest` or `lines` when unboxed. */
export function partCounts(
  stage: Stage,
  rest: RestReader,
  lines?: Readonly<Record<string, readonly number[]>>,
): Readonly<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const member of stage.members) {
    switch (member.kind) {
      case "list": {
        const count = indexedMax(rest.keys(), `${member.name}.`, lines?.[member.name]?.length ?? 0);
        if (count > 0) counts[member.name] = count;
        break;
      }
      case "object": {
        if (member.parts !== true) break;
        const count = indexedMax(rest.objectKeys(), `${member.name}.`, 0);
        if (count > 0) counts[member.name] = count;
        break;
      }
      case "actor":
        break;
      default:
        return unreachable(member);
    }
  }
  return Object.freeze(counts);
}

const FRAME_VISIBLE = Symbol.for("@gerak/stage/frame-visible");

function isVisibleRecord(value: unknown): value is Readonly<Record<string, boolean>> {
  if (!isPlainRecord(value)) return false;
  for (const shown of Object.values(value)) if (typeof shown !== "boolean") return false;
  return true;
}

/** Attaches `visible` metadata to `targets` under a non-enumerable symbol. */
export function withFrameVisible(
  targets: Readonly<Record<string, unknown>>,
  visible: Readonly<Record<string, boolean>>,
): Readonly<Record<string, unknown>> {
  return Object.defineProperty(targets, FRAME_VISIBLE, { value: visible, configurable: true });
}

/** Reads the per-member visibility map attached to a frame's `targets`, or undefined when absent. */
export function frameVisible(targets: unknown): Readonly<Record<string, boolean>> | undefined {
  if (!isPlainRecord(targets)) return undefined;
  const visible: unknown = Reflect.get(targets, FRAME_VISIBLE);
  return isVisibleRecord(visible) ? visible : undefined;
}

function holdsScroll(window: ScrollWindow, y: number, rest: RestReader): boolean {
  switch (window.kind) {
    case "range":
      return y >= window.from.at(rest) && y < window.to.at(rest);
    case "from":
      return y >= window.from.at(rest);
    case "until":
      return y < window.until.at(rest);
    default:
      return unreachable(window);
  }
}

/** The ms into a media member's clip at scene ms `ms`: since its first window opened, never below 0. */
export function mediaMs(member: Member, ms: number): number {
  const on = member.on;
  if (on === undefined || on.length === 0) return Math.max(0, ms);
  let first = Infinity;
  for (const [from] of on) if (from < first) first = from;
  return Math.max(0, ms - first);
}

/** Runs the scene once; single owner of `visible` across clock stretches and scroll windows. */
export function frame(stage: Stage, input: FrameInput): FrameOutput {
  const events = input.events ?? NO_INPUT;
  const measures = input.measures ?? [];
  const rest = input.rest ?? measures.at(-1)?.rest ?? NO_REST;
  const time = input.time;
  const targets = stage.scene({
    time,
    beats: stage.beats,
    events,
    rest,
    carry: carryFor(rest, measures, events, time),
    ...(input.counts === undefined ? {} : { counts: input.counts }),
    ...(input.lines === undefined ? {} : { lines: input.lines }),
    ...(input.only === undefined ? {} : { only: input.only }),
    ...(input.moves === undefined ? {} : { moves: input.moves }),
    ...(input.drives === undefined ? {} : { drives: input.drives }),
    ...(input.inputs === undefined ? {} : { inputs: input.inputs }),
  });
  if (!isPlainRecord(targets))
    throw new TypeError("scene must return an object of member names to poses.");
  const ms = elapsedOf(time.clock) ?? time.progress * stage.durationMs;
  const clockVisible = stage.visibleAt(ms);
  let visible = clockVisible;
  if (stage.members.some((member) => member.onScroll !== undefined)) {
    const y = scroll.y(time, events);
    const merged: Record<string, boolean> = {};
    for (const member of stage.members) {
      const clockOk = clockVisible[member.name] ?? true;
      const scrollOk =
        member.onScroll === undefined ||
        member.onScroll.some((window) => holdsScroll(window, y, rest));
      merged[member.name] = clockOk && scrollOk;
    }
    visible = Object.freeze(merged);
  }
  return { visible, targets: withFrameVisible(targets, visible) };
}

/** Every shape mistake in a frame's targets: arrays or non-poses, lists not given as functions, unknown names. */
export function check(
  stage: Stage,
  targets: Readonly<Record<string, unknown>>,
  counts?: Readonly<Record<string, number>>,
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
        if (poseOf(value) === undefined)
          mismatch(`needs a pose object, got ${Array.isArray(value) ? "an array" : typeof value}.`);
        break;
      case "object":
        if (member.parts === true) {
          if (typeof value !== "function")
            mismatch(
              `is a list: give it \`(index, count) => pose\`, got ${Array.isArray(value) ? "an array" : typeof value}.`,
            );
          else {
            const count = counts?.[member.name] ?? 1;
            for (let index = 0; index < count; index += 1)
              if (listPose3d(value, index, count) === undefined) {
                mismatch(`answered no pose object for item ${index}.`);
                break;
              }
          }
        } else if (pose3dOf(value) === undefined)
          mismatch(`needs a pose object, got ${Array.isArray(value) ? "an array" : typeof value}.`);
        break;
      case "list":
        if (typeof value !== "function")
          mismatch(
            `is a list: give it \`(index, count) => pose\`, got ${Array.isArray(value) ? "an array" : typeof value}.`,
          );
        else {
          const count = counts?.[member.name] ?? 1;
          for (let index = 0; index < count; index += 1)
            if (listPose(value, index, count) === undefined) {
              mismatch(`answered no pose object for item ${index}.`);
              break;
            }
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
