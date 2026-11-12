import { unreachable } from "./unreachable";

/** When a member is on stage, by the names of the story's beats; a member without them takes its group's. */
export interface Presence {
  /** The beat it is shown from; before it, the stage hides it. */
  readonly enters?: string;
  /** The beat it is shown until; after it ends, the stage hides it. */
  readonly leaves?: string;
}

/** What a member does beside being moved: when it is shown, whether its pointer events reach the scene. */
export interface Behaviour extends Presence {
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

/** One thing on stage, saying `text` when it has one. */
export function actor(options: Behaviour & { readonly text?: string } = {}): Actor {
  return Object.freeze({ ...options, kind: "actor" });
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

/** A word or line split into its letters, one text actor each, in order. */
export function letters(text: string, options?: Behaviour): Many {
  return many([...text], (letter) => actor({ text: letter }), options);
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
  readonly enters?: string;
  readonly leaves?: string;
  readonly watch: boolean;
  readonly still: boolean;
  readonly text?: string;
}

function presenceOf(own: Presence, inherited: Presence): Presence {
  const enters = own.enters ?? inherited.enters;
  const leaves = own.leaves ?? inherited.leaves;
  return {
    ...(enters === undefined ? {} : { enters }),
    ...(leaves === undefined ? {} : { leaves }),
  };
}

/** Every name the cast makes, in order, with presence taken from the nearest group that states it. */
export function castNames(cast: Cast, beats?: readonly string[]): readonly CastName[] {
  const names: CastName[] = [];
  const seen = new Set<string>();
  const visit = (members: Cast, groups: readonly string[], inherited: Behaviour): void => {
    for (const [key, member] of Object.entries(members)) {
      if (seen.has(key)) throw new RangeError(`cast: the name "${key}" is used twice.`);
      seen.add(key);
      const presence = presenceOf(member, inherited);
      for (const beat of [presence.enters, presence.leaves])
        if (beat !== undefined && beats !== undefined && !beats.includes(beat))
          throw new RangeError(`cast: "${key}" names the beat "${beat}", which the story lacks.`);
      const base = {
        name: key,
        groups,
        ...presence,
        watch: member.watch ?? inherited.watch ?? false,
        still: member.still ?? inherited.still ?? false,
      };
      switch (member.kind) {
        case "actor":
          names.push({
            ...base,
            kind: "actor",
            ...(member.text === undefined ? {} : { text: member.text }),
          });
          break;
        case "many":
          names.push({ ...base, kind: "many" });
          member.items.forEach((item, index) => {
            const own = presenceOf(item, presence);
            names.push({
              ...base,
              ...own,
              name: `${key}.${index}`,
              kind: "item",
              watch: item.watch ?? base.watch,
              still: item.still ?? base.still,
              ...(item.text === undefined ? {} : { text: item.text }),
            });
          });
          break;
        case "group":
          names.push({ ...base, kind: "group" });
          visit(member.members, [...groups, key], {
            ...presence,
            watch: base.watch,
            still: base.still,
          });
          break;
        default:
          unreachable(member);
      }
    }
  };
  visit(cast, [], {});
  return names;
}
