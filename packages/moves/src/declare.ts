import type { Time } from "./time";
import { unreachable } from "./unreachable";

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

/** A move's options by name, each an `OptionField` with its kind, range, default and description. */
export type OptionFields = Readonly<Record<string, OptionField>>;

const ROLES = {
  enter: true,
  exit: true,
  emphasis: true,
  travel: true,
  reveal: true,
  follow: true,
  modifier: true,
} as const;

/** What a move is for: `enter`, `travel` end at rest; `exit` starts at rest; `emphasis` both; `reveal`
 * ends shown; `follow`, `modifier` hold no rest. */
export type MoveRole = keyof typeof ROLES;

/** Every role, in the order a catalog lists them. */
export const MOVE_ROLES: readonly MoveRole[] = Object.freeze(
  Object.keys(ROLES).filter((key): key is MoveRole => key in ROLES),
);

/** Named times a move reaches, as shares of its progress, such as a hop's landings. */
export type Moments = Readonly<Record<string, number | readonly number[]>>;

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

/** The trailing argument a caller passes: none for a move whose `run` takes no input. */
export type InputArgs<I> = unknown extends I ? [] : [input: I];

/** A call the gate samples: `options` a caller would pass, and `input` when the move's `run` takes one. */
export interface MoveExample<Fs extends OptionFields, I> {
  readonly options: OptionsIn<Fs>;
  readonly input?: I;
}

/** A move's one declaration: the source of its types, option checks, moments and catalog entry. */
export interface MoveDeclaration<Fs extends OptionFields, I, R, M extends Moments = Moments> {
  readonly id: string;
  readonly role: MoveRole;
  readonly description: string;
  readonly options: Fs;
  /** A call the gate samples and the catalog shows; its options are checked when the move is defined. */
  readonly example: MoveExample<Fs, I>;
  /** The ids of the parts (`motion:moves -- --parts`) the move is built from; the gate refuses an unknown one. */
  readonly recipe?: readonly string[];
  run(options: Options<Fs>, time: Time, input: I): R;
  /** Where in its progress the move reaches each named moment, for these options. */
  moments(options: Options<Fs>): M;
}

/** A move: callable with a caller's options, and carrying what its declaration says of them. */
export interface Move<Fs extends OptionFields, I, R, M extends Moments = Moments> {
  (options: OptionsIn<Fs>, time: Time, ...input: InputArgs<I>): R;
  readonly id: string;
  readonly role: MoveRole;
  readonly description: string;
  readonly options: Fs;
  readonly example: MoveExample<Fs, I>;
  /** The part ids the move is built from, as its declaration named them. */
  readonly recipe?: readonly string[];
  /** Where in its progress the move reaches each named moment, as shares from 0 to 1. */
  moments(options: OptionsIn<Fs>): M;
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

/** Makes a move from its declaration. The call checks options (kind, `min`, `max`, `enum`) and fills
 * defaults; `run(options, time, input)` may take a third argument callers must then pass. */
export function defineMove<const Fs extends OptionFields, I, R, const M extends Moments>(
  declaration: MoveDeclaration<Fs, I, R, M>,
): Move<Fs, I, R, M>;
export function defineMove(
  declaration: MoveDeclaration<OptionFields, unknown, unknown, Moments>,
): Move<OptionFields, unknown, unknown, Moments> {
  const read = (value: unknown) => readOptions(declaration.id, declaration.options, value);
  const call = (options: OptionsIn<OptionFields>, time: Time, ...input: readonly unknown[]) =>
    declaration.run(read(options), time, input[0]);
  read(declaration.example.options);
  return Object.assign(call, {
    id: declaration.id,
    role: declaration.role,
    description: declaration.description,
    options: declaration.options,
    example: declaration.example,
    ...(declaration.recipe === undefined ? {} : { recipe: declaration.recipe }),
    moments: (options: OptionsIn<OptionFields>) => declaration.moments(read(options)),
  });
}
