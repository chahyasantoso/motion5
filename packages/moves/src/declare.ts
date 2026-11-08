import type { Pose2d } from "./pose";
import type { Anchor2d, Drawn, Point2d, Reveal } from "./shapes";
import type { Time } from "./time";
import { unreachable } from "./time";

/** One option of a move; an option with a `default` may be left out by the caller. */
export type OptionField =
  | {
      readonly kind: "number";
      readonly default?: number;
      readonly min?: number;
      readonly max?: number;
      readonly description: string;
    }
  | {
      readonly kind: "string";
      readonly default?: string;
      readonly enum?: readonly string[];
      readonly description: string;
    }
  | { readonly kind: "boolean"; readonly default?: boolean; readonly description: string };

export type OptionFields = Readonly<Record<string, OptionField>>;

/** The main output each kind of move publishes. */
export type OutputTypes = {
  readonly pose2d: Pose2d;
  readonly reveal: Reveal;
  readonly drawn: Drawn;
  readonly anchors2d: readonly Anchor2d[];
};

export type OutputKind = keyof OutputTypes;

/** The value each kind of input carries. */
export type InputTypes = { readonly points2d: readonly Point2d[] };

/** One input of a move: a value the caller passes, or the engine binds, beside the options. */
export type InputField = {
  readonly kind: keyof InputTypes;
  readonly min?: number;
  readonly description: string;
};

export type InputFields = Readonly<Record<string, InputField>>;

/** Inputs as a move runs on them. */
export type Inputs<Is extends InputFields> = {
  readonly [K in keyof Is]: InputTypes[Is[K]["kind"]];
};

/** The trailing arguments a caller passes: none for a move without inputs. */
export type InputArgs<Is extends InputFields> = keyof Is extends never ? [] : [inputs: Inputs<Is>];

/** Named secondary outputs: each a record of numbers, such as a hop's `contact`. */
export type ExtraFields = Readonly<Record<string, Readonly<Record<string, "number">>>>;

type ValueOf<F extends OptionField> = F extends { readonly kind: "number" }
  ? number
  : F extends { readonly kind: "string"; readonly enum: readonly (infer E)[] }
    ? E
    : F extends { readonly kind: "string" }
      ? string
      : boolean;

type Defaulted<Fs extends OptionFields> = {
  [K in keyof Fs]: Fs[K] extends { readonly default: unknown } ? K : never;
}[keyof Fs];

/** Options as a move runs on them: every default filled in. */
export type Options<Fs extends OptionFields> = { readonly [K in keyof Fs]: ValueOf<Fs[K]> };

/** Options as a caller passes them: defaulted ones may be left out. */
export type OptionsIn<Fs extends OptionFields> = {
  readonly [K in Exclude<keyof Fs, Defaulted<Fs>>]: ValueOf<Fs[K]>;
} & { readonly [K in Defaulted<Fs>]?: ValueOf<Fs[K]> };

type OutputOf<O extends OutputKind> = OutputTypes[O];

type Extras<E extends ExtraFields> = {
  readonly [K in keyof E]: { readonly [F in keyof E[K]]: number };
};

/** What a move returns: its main output, with any extras beside the main fields. */
export type MoveOutput<O extends OutputKind, E extends ExtraFields> = OutputOf<O> & Extras<E>;

/** A move's one declaration: the source of its types, validation, catalog entry and engine plugin. */
export interface MoveDeclaration<
  Fs extends OptionFields,
  Is extends InputFields,
  O extends OutputKind,
  E extends ExtraFields,
> {
  readonly id: string;
  readonly description: string;
  readonly options: Fs;
  readonly inputs: Is;
  readonly output: O;
  readonly extras: E;
  run(options: Options<Fs>, time: Time, inputs: Inputs<Is>): MoveOutput<O, E>;
}

/** A move: callable with a caller's options, and carrying the declaration it came from. */
export interface Move<
  Fs extends OptionFields,
  Is extends InputFields,
  O extends OutputKind,
  E extends ExtraFields,
> extends MoveDeclaration<Fs, Is, O, E> {
  (options: OptionsIn<Fs>, time: Time, ...inputs: InputArgs<Is>): MoveOutput<O, E>;
  /** Validates a record against the options and fills defaults; keys it does not declare are ignored. */
  read(value: unknown): Options<Fs>;
  /** Validates a record against the inputs. */
  readInputs(value: unknown): Inputs<Is>;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readField(id: string, name: string, field: OptionField, value: unknown): unknown {
  const fail = (rule: string) => new RangeError(`${id}: option "${name}" ${rule}.`);
  if (value === undefined) {
    if (field.default === undefined) throw fail("is required");
    return field.default;
  }
  switch (field.kind) {
    case "number":
      if (typeof value !== "number" || !Number.isFinite(value)) throw fail("must be a number");
      if (field.min !== undefined && value < field.min) throw fail(`must be at least ${field.min}`);
      if (field.max !== undefined && value > field.max) throw fail(`must be at most ${field.max}`);
      return value;
    case "string":
      if (typeof value !== "string") throw fail("must be a string");
      if (field.enum !== undefined && !field.enum.includes(value))
        throw fail(`must be one of ${field.enum.join(", ")}`);
      return value;
    case "boolean":
      if (typeof value !== "boolean") throw fail("must be a boolean");
      return value;
    default:
      return unreachable(field);
  }
}

function holds(field: OptionField, value: unknown): boolean {
  switch (field.kind) {
    case "number":
      return typeof value === "number";
    case "string":
      return typeof value === "string" && (field.enum === undefined || field.enum.includes(value));
    case "boolean":
      return typeof value === "boolean";
    default:
      return unreachable(field);
  }
}

function conforms<Fs extends OptionFields>(
  fields: Fs,
  value: Readonly<Record<string, unknown>>,
): value is Options<Fs> {
  return Object.entries(fields).every(([name, field]) => holds(field, value[name]));
}

function readOptions<Fs extends OptionFields>(id: string, fields: Fs, value: unknown): Options<Fs> {
  if (!isRecord(value)) throw new TypeError(`${id}: options must be a record.`);
  const read: Record<string, unknown> = {};
  for (const [name, field] of Object.entries(fields))
    read[name] = readField(id, name, field, value[name]);
  const frozen = Object.freeze(read);
  if (!conforms(fields, frozen)) throw new TypeError(`${id}: options did not read whole.`);
  return frozen;
}

function isPoint(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.x === "number" &&
    typeof value.y === "number"
  );
}

function holdsInput(field: InputField, value: unknown): boolean {
  switch (field.kind) {
    case "points2d":
      return Array.isArray(value) && value.every(isPoint);
    default:
      return unreachable(field.kind);
  }
}

function inputsConform<Is extends InputFields>(
  fields: Is,
  value: Readonly<Record<string, unknown>>,
): value is Inputs<Is> {
  return Object.entries(fields).every(([name, field]) => holdsInput(field, value[name]));
}

function readInputs<Is extends InputFields>(id: string, fields: Is, value: unknown): Inputs<Is> {
  const given = isRecord(value) ? value : {};
  for (const [name, field] of Object.entries(fields)) {
    const rows = given[name];
    if (!Array.isArray(rows)) throw new TypeError(`${id}: input "${name}" is required.`);
    if (field.min !== undefined && rows.length < field.min)
      throw new RangeError(`${id}: input "${name}" needs at least ${field.min} rows.`);
  }
  if (!inputsConform(fields, given)) throw new TypeError(`${id}: inputs do not match their kinds.`);
  return given;
}

/** Makes a move from its declaration. */
export function defineMove<
  const Fs extends OptionFields,
  const Is extends InputFields,
  const O extends OutputKind,
  const E extends ExtraFields,
>(declaration: MoveDeclaration<Fs, Is, O, E>): Move<Fs, Is, O, E> {
  const read = (value: unknown) => readOptions(declaration.id, declaration.options, value);
  const readGiven = (value: unknown) => readInputs(declaration.id, declaration.inputs, value);
  const call = (options: OptionsIn<Fs>, time: Time, ...rest: readonly unknown[]) =>
    declaration.run(read(options), time, readGiven(rest[0]));
  return Object.assign(call, {
    id: declaration.id,
    description: declaration.description,
    options: declaration.options,
    inputs: declaration.inputs,
    output: declaration.output,
    extras: declaration.extras,
    run: declaration.run,
    read,
    readInputs: readGiven,
  });
}
