import type { Cubic2d } from "@gerak/moves";
import { unreachable } from "./unreachable";

/** A stretch of the story: one beat, or a pair from the first beat's start to the second's end. */
export type Stretch = string | readonly [string, string];

/** What a member does beside being moved: when it is shown, whether its pointer events reach the scene. */
export interface Behaviour {
  /** Shown while any stretch runs, hidden otherwise; without it a member takes its group's, and with
   * none at all it is always shown. */
  readonly on?: readonly Stretch[];
  /** Its hover, press and click reach the scene's events under its name. */
  readonly watch?: boolean;
  /** The scene never moves it; the review does not report it as unused. */
  readonly still?: boolean;
}

/** One thing on stage; the scene answers one value for it, and a renderer's skin decides what it looks like. */
export interface Actor extends Behaviour {
  readonly kind: "actor";
  /** What it says, on any renderer. */
  readonly text?: string;
  /** The stroke it is, as joined cubic segments made by `toCubics`; its length is what `drawn` reads. */
  readonly path?: readonly Cubic2d[];
}

/** A list of things; the scene answers one value per item. To move the whole list, put it in a `group`. */
export interface Many extends Behaviour {
  readonly kind: "many";
  readonly items: readonly Actor[];
}

/** Members moved together: the group's value applies to them, and each member's is relative to it. */
export interface Group extends Behaviour {
  readonly kind: "group";
  readonly members: Cast;
}

/** A cast member: what the scene's motion depends on, and nothing of how it looks. */
export type Member = Actor | Many | Group;

/** Who is on stage, by name; every key is unique across the whole cast, groups included. */
export type Cast = Readonly<Record<string, Member>>;

/** One thing on stage, saying `text` or drawing the stroke `path` when given one. */
export function actor(
  options: Behaviour & { readonly text?: string; readonly path?: readonly Cubic2d[] } = {},
): Actor {
  const path = options.path;
  return Object.freeze({
    ...options,
    ...(path === undefined
      ? {}
      : { path: Object.freeze(path.map((cubic) => Object.freeze({ ...cubic }))) }),
    kind: "actor",
  });
}

/** `count` things, or one per entry of `list` made by `make`; the scene answers one value per item. */
export function many(count: number, options?: Behaviour): Many;
export function many<T>(
  list: readonly T[],
  make: (entry: T, index: number) => Actor,
  options?: Behaviour,
): Many;
export function many<T>(
  source: number | readonly T[],
  second?: Behaviour | ((entry: T, index: number) => Actor),
  third?: Behaviour,
): Many {
  const make = typeof second === "function" ? second : undefined;
  const options = (typeof second === "function" ? third : second) ?? {};
  if (typeof source === "number") {
    if (!(Number.isInteger(source) && source >= 0))
      throw new RangeError(`many: count must be a whole number of at least 0, not ${source}.`);
    return Object.freeze({
      ...options,
      kind: "many",
      items: Object.freeze(Array.from({ length: source }, () => actor())),
    });
  }
  if (make === undefined)
    throw new TypeError("many: a list needs a function that makes each item.");
  return Object.freeze({ ...options, kind: "many", items: Object.freeze(source.map(make)) });
}

/** Members moved together; their keys join the cast's, so each must be unique across it. */
export function group(members: Cast, options: Behaviour = {}): Group {
  return Object.freeze({ ...options, kind: "group", members: Object.freeze({ ...members }) });
}

/** A word or line split into its letters, one text actor each, in order; a letter is a grapheme,
 * so an accented letter or an emoji is one. */
export function letters(text: string, options?: Behaviour): Many {
  const graphemes = [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)];
  return many(graphemes, ({ segment }) => actor({ text: segment }), options);
}

/** A line split into its words at spaces, one text actor each, in order. */
export function words(text: string, options?: Behaviour): Many {
  return many(
    text.split(" ").filter((word) => word !== ""),
    (word) => actor({ text: word }),
    options,
  );
}

/** One name the cast makes: a member's key, or a key and an index for an item of `many`. */
export interface CastName {
  readonly name: string;
  readonly kind: Member["kind"] | "item";
  /** The groups it sits in, outermost first. */
  readonly groups: readonly string[];
  /** The stretches it is shown in, each from a beat's start to a beat's end; absent, always shown. */
  readonly on?: readonly (readonly [string, string])[];
  readonly watch: boolean;
  readonly still: boolean;
  readonly text?: string;
  readonly path?: readonly Cubic2d[];
}

/** A member's own `on` as from-to pairs, or its group's when it states none; refuses an unknown beat. */
function onOf(
  name: string,
  own: readonly Stretch[] | undefined,
  inherited: CastName["on"],
  beats: readonly string[] | undefined,
): CastName["on"] {
  if (own === undefined) return inherited;
  if (own.length === 0)
    throw new RangeError(`cast: "${name}" has an empty \`on\`; leave it out to always show it.`);
  const pairs = own.map((entry): readonly [string, string] =>
    typeof entry === "string" ? [entry, entry] : [entry[0], entry[1]],
  );
  for (const beat of pairs.flat())
    if (beats !== undefined && !beats.includes(beat))
      throw new RangeError(`cast: "${name}" names the beat "${beat}", which the story lacks.`);
  return pairs;
}

/** Every name the cast makes, in order, with presence taken from the nearest group that states it. */
export function castNames(cast: Cast, beats?: readonly string[]): readonly CastName[] {
  const names: CastName[] = [];
  const seen = new Set<string>();
  const visit = (
    members: Cast,
    groups: readonly string[],
    inherited: Pick<CastName, "on" | "watch" | "still">,
  ): void => {
    for (const [key, member] of Object.entries(members)) {
      if (key.includes("."))
        throw new RangeError(`cast: the name "${key}" holds a dot, which only an item's name has.`);
      if (seen.has(key)) throw new RangeError(`cast: the name "${key}" is used twice.`);
      seen.add(key);
      const on = onOf(key, member.on, inherited.on, beats);
      const base = {
        name: key,
        groups,
        ...(on === undefined ? {} : { on }),
        watch: member.watch ?? inherited.watch,
        still: member.still ?? inherited.still,
      };
      switch (member.kind) {
        case "actor":
          names.push({
            ...base,
            kind: "actor",
            ...(member.text === undefined ? {} : { text: member.text }),
            ...(member.path === undefined ? {} : { path: member.path }),
          });
          break;
        case "many":
          names.push({ ...base, kind: "many" });
          member.items.forEach((item, index) => {
            const name = `${key}.${index}`;
            const itemOn = onOf(name, item.on, on, beats);
            names.push({
              name,
              groups,
              ...(itemOn === undefined ? {} : { on: itemOn }),
              kind: "item",
              watch: item.watch ?? base.watch,
              still: item.still ?? base.still,
              ...(item.text === undefined ? {} : { text: item.text }),
              ...(item.path === undefined ? {} : { path: item.path }),
            });
          });
          break;
        case "group":
          names.push({ ...base, kind: "group" });
          visit(member.members, [...groups, key], base);
          break;
        default:
          unreachable(member);
      }
    }
  };
  visit(cast, [], { watch: false, still: false });
  return names;
}
