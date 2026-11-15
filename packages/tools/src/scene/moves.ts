import { type Descriptors } from "@gerak/moves";
import {
  CUSTOM_FIELD,
  MOVE_ROLES,
  atProgress,
  valueField,
  type MoveRole,
  type OptionField,
  type Time,
  type ValueField,
} from "@gerak/moves";
import { DEFAULT_LIMITS } from "../page/check";
import { unreachable } from "../page/unreachable";
import { SCENE_LIMITS } from "./limits";

/** What the gate reads of a move: its declaration's fields; the gate calls it as the function it is. */
export interface CheckedMove {
  readonly id: string;
  readonly role: MoveRole;
  readonly description: string;
  readonly options: Readonly<Record<string, OptionField>>;
  readonly example: { readonly options: object; readonly input?: unknown };
  moments(options: never): Readonly<Record<string, number | readonly number[]>>;
}

/** One thing wrong with a move, as the gate found it. */
export type MoveFinding =
  | { readonly kind: "bad-id"; readonly id: string }
  | { readonly kind: "no-description"; readonly option?: string }
  | { readonly kind: "throws"; readonly options: string; readonly message: string }
  | {
      readonly kind: "not-finite";
      readonly options: string;
      readonly field: string;
      readonly progress: number;
    }
  | {
      readonly kind: "not-at-rest";
      readonly options: string;
      readonly field: string;
      readonly progress: 0 | 1;
      readonly value: number;
      readonly rest: number;
    }
  | { readonly kind: "not-shown"; readonly options: string; readonly field: string }
  | {
      readonly kind: "jump";
      readonly options: string;
      readonly field: string;
      readonly progress: number;
      readonly from: number;
      readonly to: number;
    }
  | { readonly kind: "moment-out-of-range"; readonly name: string; readonly value: number };

const ID = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;
/** Samples per run: one every 16 ms of a second. */
const STEPS = 62;
/** A step between two samples this share of a field's whole travel is a jump. */
const JUMP_SHARE = 0.35;
const REST_SLACK = 1e-6;

/** The table row a dotted path ends on: a custom number under `custom`, else the row its last name has. */
function fieldAt(path: string): ValueField | undefined {
  const names = path.split(".");
  if (names.at(-2) === "custom") return CUSTOM_FIELD;
  return valueField(names.at(-1) ?? "");
}

/** Where a field rests, when its row gives it a rest. */
function restOf(field: string): number | undefined {
  return fieldAt(field)?.rest;
}

function isSmoothField(field: string): boolean {
  return fieldAt(field)?.smooth === true;
}

/** Every number in a move's answer, by its dotted path; an answer that is a list numbers its rows. */
function numbers(value: unknown, path = "", into = new Map<string, number>()): Map<string, number> {
  if (typeof value === "number") into.set(path, value);
  else if (typeof value === "object" && value !== null)
    for (const [key, child] of Object.entries(value))
      numbers(child, path === "" ? key : `${path}.${key}`, into);
  return into;
}

/** The example's options, then the example with each ranged number at its least and its greatest. */
function optionSets(move: CheckedMove): readonly object[] {
  const sets: object[] = [move.example.options];
  for (const [name, field] of Object.entries(move.options)) {
    if (field.kind !== "number") continue;
    for (const bound of [field.min, field.max])
      if (bound !== undefined) sets.push({ ...move.example.options, [name]: bound });
  }
  return sets;
}

/** Where a role must hold its rest: at the start, at the end, at both, or nowhere. */
function restAt(role: MoveRole): readonly (0 | 1)[] {
  switch (role) {
    case "enter":
    case "travel":
      return [1];
    case "exit":
      return [0];
    case "emphasis":
      return [0, 1];
    case "reveal":
    case "follow":
    case "modifier":
      return [];
    default:
      return unreachable(role);
  }
}

function isCallable(value: unknown): value is (...args: readonly unknown[]) => unknown {
  return typeof value === "function";
}

function run(move: CheckedMove, options: object, progress: number): unknown {
  if (!isCallable(move)) throw new TypeError(`${move.id} is not a function.`);
  const time: Time = atProgress(progress);
  return move.example.input === undefined
    ? move(options, time)
    : move(options, time, move.example.input);
}

// A bound may be abrupt by design, so a smooth path is asked of the example and not of the bounds.
function checkRun(move: CheckedMove, options: object, smooth: boolean): readonly MoveFinding[] {
  const label = JSON.stringify(options);
  const samples: Map<string, number>[] = [];
  try {
    for (let step = 0; step <= STEPS; step += 1)
      samples.push(numbers(run(move, options, step / STEPS)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return [{ kind: "throws", options: label, message }];
  }
  const findings: MoveFinding[] = [];
  // A pose that leaves a field out rests on it, so a sample without one is read at its rest.
  const fields = new Set(samples.flatMap((sample) => [...sample.keys()]));
  const filled = (sample: Map<string, number> | undefined): Map<string, number> =>
    new Map([...fields].map((field) => [field, sample?.get(field) ?? restOf(field) ?? Number.NaN]));
  const first = filled(samples[0]);
  const last = filled(samples[STEPS]);
  for (const field of fields) {
    const values = samples.map((sample) => sample.get(field) ?? restOf(field) ?? Number.NaN);
    const broken = values.findIndex((value) => !Number.isFinite(value));
    if (broken >= 0) {
      findings.push({ kind: "not-finite", options: label, field, progress: broken / STEPS });
      continue;
    }
    const greatest = Math.max(...values);
    const travel = greatest - Math.min(...values);
    const jumpAt =
      smooth && isSmoothField(field) && travel > REST_SLACK
        ? values.findIndex(
            (to, step) => step > 0 && Math.abs(to - (values[step - 1] ?? to)) > travel * JUMP_SHARE,
          )
        : -1;
    if (jumpAt > 0)
      findings.push({
        kind: "jump",
        options: label,
        field,
        progress: jumpAt / STEPS,
        from: values[jumpAt - 1] ?? 0,
        to: values[jumpAt] ?? 0,
      });
    const shown = fieldAt(field)?.shows === true;
    if (move.role === "reveal" && shown && (values[STEPS] ?? 0) < greatest - REST_SLACK)
      findings.push({ kind: "not-shown", options: label, field });
  }
  for (const progress of restAt(move.role)) {
    const sample = progress === 0 ? first : last;
    for (const [field, value] of sample) {
      const rest = restOf(field);
      if (rest !== undefined && Math.abs(value - rest) > REST_SLACK)
        findings.push({ kind: "not-at-rest", options: label, field, progress, value, rest });
    }
  }
  return findings;
}

/** Everything the gate finds wrong with a move; an empty list passes. */
export function checkMove(move: CheckedMove): readonly MoveFinding[] {
  const findings: MoveFinding[] = [];
  if (!ID.test(move.id)) findings.push({ kind: "bad-id", id: move.id });
  if (move.description.trim().length === 0) findings.push({ kind: "no-description" });
  for (const [option, field] of Object.entries(move.options))
    if (field.description.trim().length === 0) findings.push({ kind: "no-description", option });
  for (const [index, options] of optionSets(move).entries())
    findings.push(...checkRun(move, options, index === 0));
  try {
    const moments: unknown = Reflect.apply(move.moments, move, [move.example.options]);
    for (const [name, at] of Object.entries(Object(moments)))
      for (const value of Array.isArray(at) ? at : [at])
        if (typeof value !== "number" || !(value >= 0 && value <= 1))
          findings.push({ kind: "moment-out-of-range", name, value: Number(value) });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    findings.push({ kind: "throws", options: "moments", message });
  }
  return findings;
}

const round = (value: number): number => Math.round(value * 1000) / 1000;

/** One line a person or an agent can act on. */
export function describeFinding(id: string, finding: MoveFinding): string {
  switch (finding.kind) {
    case "bad-id":
      return `${finding.id}: the id must be lower kebab-case, like "slide" or "rope-word".`;
    case "no-description":
      return finding.option === undefined
        ? `${id}: the move has no description.`
        : `${id}: option "${finding.option}" has no description.`;
    case "throws":
      return `${id}: threw with ${finding.options}: ${finding.message}`;
    case "not-finite":
      return `${id}: "${finding.field}" is not a number at progress ${round(finding.progress)} with ${finding.options}.`;
    case "not-at-rest":
      return `${id}: "${finding.field}" is ${round(finding.value)} at progress ${finding.progress}, and its role holds rest (${finding.rest}) there, with ${finding.options}.`;
    case "not-shown":
      return `${id}: "${finding.field}" ends below its greatest value, and a reveal ends fully shown, with ${finding.options}.`;
    case "jump":
      return `${id}: "${finding.field}" jumps from ${round(finding.from)} to ${round(finding.to)} at progress ${round(finding.progress)} with ${finding.options}.`;
    case "moment-out-of-range":
      return `${id}: moment "${finding.name}" is ${finding.value}, outside 0 to 1.`;
    default:
      return unreachable(finding);
  }
}

/** What sampling a move says of the fields it moves. */
export interface MoveDescriptors {
  /** Every field the example or an option bound moves, in the order the example's pose gives them. */
  readonly fields: readonly string[];
  /** The field whose offset is greatest against the limit its row is judged by. */
  readonly primary: string | undefined;
  /** The descriptors of the primary field at the example. */
  readonly descriptors: Descriptors | undefined;
  /** The shape of every moved field at the example, by field name. */
  readonly shapes: Readonly<Record<string, Descriptors>>;
  /** The same for each option set the gate samples, the example's first. */
  readonly shapesAt: readonly {
    readonly options: Readonly<Record<string, unknown>>;
    readonly shapes: Readonly<Record<string, Descriptors>>;
  }[];
}

const SETTLED_SHARE = 0.02;
const TIE = 1 - 1e-9;

const signOf = (value: number): number => (Math.abs(value) <= REST_SLACK ? 0 : Math.sign(value));

function crossingsOf(offsets: readonly number[]): number {
  let crossings = 0;
  let last = 0;
  for (const offset of offsets) {
    const sign = signOf(offset);
    if (sign === 0) continue;
    if (last !== 0 && sign !== last) crossings += 1;
    last = sign;
  }
  return crossings;
}

/** The index from which the offsets stay within a small share of their greatest of `end`. */
function stayingFrom(offsets: readonly number[], end: number, greatest: number): number {
  let from = offsets.length - 1;
  while (from > 0 && Math.abs((offsets[from - 1] ?? 0) - end) <= greatest * SETTLED_SHARE)
    from -= 1;
  return from;
}

/** The descriptors of one field's offsets from rest, sampled evenly over progress 0 to 1. */
export function describeOffsets(offsets: readonly number[]): Descriptors {
  const last = offsets.length - 1;
  const start = offsets[0] ?? 0;
  const end = offsets[last] ?? 0;
  const travelling = Math.abs(start) > REST_SLACK || Math.abs(end) > REST_SLACK;
  const steps = offsets.slice(1).map((offset, i) => Math.abs(offset - (offsets[i] ?? 0)));
  const greatestStep = Math.max(0, ...steps);
  const tied = steps.flatMap((step, i) => (step >= greatestStep * TIE ? [i] : []));
  const peak =
    greatestStep <= REST_SLACK || last <= 0
      ? 0
      : ((tied[0] ?? 0) + (tied.at(-1) ?? 0) + 1) / 2 / last;
  const greatest = Math.max(0, ...offsets.map(Math.abs));
  const crossings = crossingsOf(offsets);
  if (!travelling) {
    const top = offsets.findIndex((offset) => Math.abs(offset) >= greatest * TIE);
    const settled = stayingFrom(offsets, end, greatest);
    return {
      travelling,
      peak,
      overshoot: 0,
      rings: crossings,
      windup: 0,
      settle: greatest <= REST_SLACK || last <= 0 ? 0 : Math.max(0, settled - top) / last,
    };
  }
  const aim = Math.abs(start) > REST_SLACK ? 0 : end;
  const far = start - aim;
  const toward = -Math.sign(far);
  let beyond = 0;
  let pulled = 0;
  let heading = false;
  for (const offset of offsets) {
    beyond = Math.max(beyond, toward * (offset - aim));
    const gained = toward * (offset - start);
    if (gained > REST_SLACK) heading = true;
    if (!heading) pulled = Math.max(pulled, -gained);
  }
  const arrived = offsets.findIndex(
    (offset) => Math.abs(offset - aim) <= REST_SLACK || signOf(offset - aim) === signOf(-far),
  );
  const settled = stayingFrom(offsets, end, greatest);
  return {
    travelling,
    peak,
    overshoot: beyond / Math.abs(far),
    rings: Math.max(0, crossings - 1),
    windup: pulled / Math.abs(far),
    settle: Math.max(0, settled - (arrived < 0 ? last : arrived)) / last,
  };
}

const LIMIT_OF = {
  position: DEFAULT_LIMITS.jump,
  turn: SCENE_LIMITS.turn,
  ratio: SCENE_LIMITS.ratio,
};

/** A field's name as a move lists it: its row's name, or `custom.<name>` for a number a piece names. */
function nameOf(path: string): string {
  const names = path.split(".");
  const last = names.at(-1) ?? path;
  return names.at(-2) === "custom" ? `custom.${last}` : last;
}

/** Each moved field's offsets from rest over one run; a pose that leaves a field out rests on it. */
function offsetsOf(move: CheckedMove, options: object): ReadonlyMap<string, readonly number[]> {
  const samples: Map<string, number>[] = [];
  try {
    for (let step = 0; step <= STEPS; step += 1)
      samples.push(numbers(run(move, options, step / STEPS)));
  } catch {
    return new Map();
  }
  const paths = new Set(samples.flatMap((sample) => [...sample.keys()]));
  const found = new Map<string, readonly number[]>();
  for (const path of paths) {
    const rest = restOf(path);
    if (rest === undefined) continue;
    const offsets = samples.map((sample) => (sample.get(path) ?? rest) - rest);
    if (offsets.every(Number.isFinite) && offsets.some((offset) => Math.abs(offset) > REST_SLACK))
      found.set(path, offsets);
  }
  return found;
}

function shapesOf(
  found: ReadonlyMap<string, readonly number[]>,
): Readonly<Record<string, Descriptors>> {
  return Object.fromEntries(
    [...found].map(([path, offsets]) => [nameOf(path), describeOffsets(offsets)]),
  );
}

/** The fields a move moves, how each moves and which moves most, sampled as the gate samples it. */
export function descriptorsOf(move: CheckedMove): MoveDescriptors {
  const sets = optionSets(move);
  const sampled = sets.map((set) => offsetsOf(move, set));
  const [example = new Map<string, readonly number[]>(), ...bounds] = sampled;
  const names = [...example.keys(), ...bounds.flatMap((found) => [...found.keys()])].map(nameOf);
  let primary: { readonly path: string; readonly share: number } | undefined;
  for (const [path, offsets] of example) {
    const share =
      Math.max(...offsets.map(Math.abs)) / LIMIT_OF[fieldAt(path)?.judged ?? "position"];
    if (primary === undefined || share > primary.share) primary = { path, share };
  }
  const offsets = primary === undefined ? undefined : example.get(primary.path);
  return {
    fields: [...new Set(names)],
    primary: primary === undefined ? undefined : nameOf(primary.path),
    descriptors: offsets === undefined ? undefined : describeOffsets(offsets),
    shapes: shapesOf(example),
    shapesAt: sets.map((options, index) => ({
      options: Object.fromEntries(Object.entries(options)),
      shapes: shapesOf(sampled[index] ?? new Map()),
    })),
  };
}

/** Whether a value is a move the gate can read. */
export function isMove(value: unknown): value is CheckedMove {
  if (typeof value !== "function") return false;
  const role: unknown = Reflect.get(value, "role");
  const example: unknown = Reflect.get(value, "example");
  return (
    typeof Reflect.get(value, "id") === "string" &&
    typeof Reflect.get(value, "description") === "string" &&
    typeof Reflect.get(value, "moments") === "function" &&
    typeof Reflect.get(value, "options") === "object" &&
    typeof example === "object" &&
    example !== null &&
    MOVE_ROLES.some((known) => known === role)
  );
}
