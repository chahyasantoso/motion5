import {
  NO_EVENTS,
  mergeEvents,
  span,
  type Cubic2d,
  type Events,
  type Span,
  type Time,
  unreachable,
} from "@gerak/core";
import {
  castBuilder,
  type Content,
  type Expect,
  type ItemContent,
  type Members,
  type Stretch,
} from "../author/cast";
import { NO_REST, restReader, type Rest, type RestReader } from "../author/layout";
import type { LayoutsInput, Limits, SceneContext, StageDefinition } from "../author/stage";
import type { StageError } from "./errors";
import { matchOutlines } from "./outlines";
import { visibility, windowOf, type Window } from "./timeline";

/** One compiled member; `Stage.members` lists them parents first. List items are named `<list>.<index>`. */
export type Member = {
  readonly name: string;
  /** Index of the enclosing group in `Stage.members`, or -1 at the top. */
  readonly parent: number;
  readonly expect: Expect;
  readonly watch: boolean;
  /** Selector of the DOM nodes this member binds to: `[data-cast="<name>"]`; an object has none. */
  readonly node?: string | undefined;
  /** Ms the member shows, its own or its group's; absent means always. */
  readonly on?: readonly Window[] | undefined;
} & (
  | { readonly kind: "object" }
  | { readonly kind: "actor"; readonly content: Content }
  | {
      readonly kind: "list";
      readonly items: readonly ItemContent[];
      readonly split?: "letters" | "words" | undefined;
    }
  | { readonly kind: "group" }
);

/** A stage's layouts; a piece with none has one named `main`. */
export interface StageLayouts {
  readonly names: readonly [string, ...string[]];
  /** The layout showing after `events`; throws on an answer not in `names`. */
  pick(events: Events): string;
  /** Each layout's rest boxes as given in the piece, zero boxes when not given. */
  readonly readers: Readonly<Record<string, RestReader>>;
}

/** A checked piece, the one contract renderers and tools read. */
export interface Stage {
  readonly kind: "stage";
  readonly durationMs: number;
  readonly beats: Readonly<Record<string, Span>>;
  readonly members: readonly Member[];
  readonly layouts: StageLayouts;
  readonly cues: Events;
  readonly limits: Readonly<Record<string, Limits>>;
  /** Minimum settle window in ms after input events on a page mount, when triggered beats need longer. */
  readonly settleMs?: number | undefined;
  readonly scene: (context: SceneContext) => unknown;
  /** Which members show at `ms`, by name; one shared record per stretch of time. */
  readonly visibleAt: (ms: number) => Readonly<Record<string, boolean>>;
  /** Equal for two stages that mount on the same elements: duration, names, kinds, nesting, watch, texts. */
  readonly signature: string;
}

/** A compiled stage or every reason it is not one. */
export type CompileResult =
  | { readonly ok: true; readonly stage: Stage }
  | { readonly ok: false; readonly errors: readonly StageError[] };

const CUBIC_KEYS = ["x0", "y0", "x1", "y1", "x2", "y2", "x3", "y3"] as const;

/** Whether `value` is an object and not an array. */
export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isCubics(value: unknown): value is readonly Cubic2d[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (cubic: unknown) =>
        isPlainRecord(cubic) &&
        typeof cubic["id"] === "string" &&
        CUBIC_KEYS.every((key) => finite(cubic[key])),
    )
  );
}

function frozenCubics(cubics: readonly Cubic2d[]): readonly Cubic2d[] {
  return Object.freeze(cubics.map((cubic) => Object.freeze({ ...cubic })));
}

function isRest(rest: Rest): boolean {
  return Object.values(rest).every(
    (box) => finite(box.x) && finite(box.y) && finite(box.width) && finite(box.height),
  );
}

interface Beats {
  readonly beats: Readonly<Record<string, Span>>;
  readonly durationMs: number;
}

function compileBeats(
  given: Readonly<Record<string, readonly [number, number]>>,
  givenDuration: number | undefined,
  errors: StageError[],
): Beats | undefined {
  const fail = (field: string, reason: string): undefined => {
    errors.push({ kind: "invalid", field, reason });
    return undefined;
  };
  const pairs = Object.entries(given);
  const bad = pairs.find(
    ([, [from, to]]) => !(finite(from) && finite(to) && 0 <= from && from < to),
  );
  if (bad !== undefined)
    return fail("beats", `beat "${bad[0]}" must be [from, to] ms with 0 <= from < to.`);
  if (givenDuration !== undefined && !(finite(givenDuration) && givenDuration > 0))
    return fail("durationMs", "`durationMs` must be above 0.");
  const computedDuration = pairs.reduce((most, [, [, to]]) => Math.max(most, to), 0);
  // A piece with only scroll and trigger beats has no clock beat to end it.
  const durationMs = givenDuration ?? (computedDuration === 0 ? 1000 : computedDuration);
  if (!(durationMs > 0))
    return fail("beats", "the last beat must end above 0 ms, or give `durationMs`.");
  const late = pairs.find(([, [, to]]) => to > durationMs);
  if (late !== undefined)
    return fail(
      "beats",
      `beat "${late[0]}" ends at ${late[1][1]} ms, past durationMs ${durationMs} ms.`,
    );
  const beats: Record<string, Span> = {};
  for (const [name, [from, to]] of pairs) beats[name] = span(from, to);
  return { beats: Object.freeze(beats), durationMs };
}

interface Inherited {
  readonly parent: number;
  readonly on: readonly Window[] | undefined;
  readonly watch: boolean;
  readonly expect: Expect;
}

function windowsOf(
  name: string,
  stretches: readonly Stretch[],
  beats: Beats,
  errors: StageError[],
): readonly Window[] | undefined {
  if (stretches.length === 0) {
    errors.push({
      kind: "invalid",
      field: "cast",
      reason: `"${name}": \`.on()\` needs at least one beat.`,
    });
    return undefined;
  }
  const windows: Window[] = [];
  const known = (beat: string): Span | undefined => {
    const found = beats.beats[beat];
    if (found === undefined) errors.push({ kind: "unknown_beat", member: name, beat });
    return found;
  };
  for (const stretch of stretches) {
    switch (stretch.kind) {
      case "beats": {
        const start = known(stretch.from);
        const end = stretch.to === stretch.from ? start : known(stretch.to);
        if (start === undefined || end === undefined) continue;
        if (end.to <= start.from) {
          errors.push({
            kind: "reversed_stretch",
            member: name,
            from: stretch.from,
            to: stretch.to,
          });
          continue;
        }
        windows.push(windowOf(start.from, end.to, beats.durationMs));
        break;
      }
      case "from": {
        const start = known(stretch.from);
        if (start !== undefined) windows.push(windowOf(start.from, Infinity, beats.durationMs));
        break;
      }
      case "until": {
        const end = known(stretch.until);
        if (end !== undefined) windows.push(windowOf(0, end.to, beats.durationMs));
        break;
      }
      default:
        return unreachable(stretch);
    }
  }
  return Object.freeze(windows);
}

function contentOf(name: string, content: Content, errors: StageError[]): Content | undefined {
  switch (content.kind) {
    case "box":
    case "text":
    case "stroke":
    case "morph":
      return itemOf(name, content, errors);
    case "readout": {
      const { format } = content;
      const checked = (time: Time): string => {
        const answer: unknown = Reflect.apply(format, undefined, [time]);
        if (typeof answer !== "string")
          throw new TypeError(`The text of "${name}" answered ${typeof answer}, not a string.`);
        return answer;
      };
      return Object.freeze({ kind: "readout", format: checked });
    }
    default:
      return unreachable(content);
  }
}

function itemOf(name: string, content: ItemContent, errors: StageError[]): ItemContent | undefined {
  switch (content.kind) {
    case "box":
    case "text":
      return Object.freeze(content);
    case "stroke": {
      const { path } = content;
      if (typeof path === "function") {
        const checked = (rest: RestReader): readonly Cubic2d[] => {
          const answer: unknown = Reflect.apply(path, undefined, [rest]);
          if (!isCubics(answer))
            throw new TypeError(`path "${name}" must answer cubics made by \`toCubics\`.`);
          return frozenCubics(answer);
        };
        return Object.freeze({ kind: "stroke", path: checked });
      }
      if (isCubics(path)) return Object.freeze({ kind: "stroke", path: frozenCubics(path) });
      errors.push({
        kind: "invalid",
        field: "cast",
        reason: `"${name}": a stroke needs cubics or a function of rest.`,
      });
      return undefined;
    }
    case "morph": {
      const { shapes } = content;
      if (shapes.length < 2 || !shapes.every(isCubics)) {
        errors.push({
          kind: "morph_mismatch",
          member: name,
          reason: "a morph needs a base and at least one target, each cubics.",
        });
        return undefined;
      }
      const matched = matchOutlines(shapes);
      if ("reason" in matched) {
        errors.push({ kind: "morph_mismatch", member: name, reason: matched.reason });
        return undefined;
      }
      return Object.freeze({
        kind: "morph",
        shapes: Object.freeze(matched.matched.map(frozenCubics)),
      });
    }
    default:
      return unreachable(content);
  }
}

/** The selector of the nodes a DOM renderer binds to the element `name`. */
export function castSelector(name: string): string {
  return `[data-cast="${name.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"]`;
}

function compileCast(cast: Members, beats: Beats, errors: StageError[]): readonly Member[] {
  const members: Member[] = [];
  const seen = new Set<string>();
  const visit = (record: Members, from: Inherited): void => {
    for (const [name, spec] of Object.entries(record)) {
      if (name.includes(".")) errors.push({ kind: "reserved_dot", name });
      if (seen.has(name)) errors.push({ kind: "duplicate_member", name });
      seen.add(name);
      const on =
        spec.meta.on === undefined ? from.on : windowsOf(name, spec.meta.on, beats, errors);
      const expect = spec.meta.expect ?? from.expect;
      const node = spec.kind === "object" ? undefined : castSelector(name);
      const base = {
        name,
        parent: from.parent,
        expect,
        watch: spec.meta.watch ?? from.watch,
        ...(node === undefined ? {} : { node }),
        ...(on === undefined ? {} : { on }),
      };
      switch (spec.kind) {
        case "actor": {
          const content = contentOf(name, spec.content, errors);
          if (content !== undefined)
            members.push(Object.freeze({ ...base, kind: "actor", content }));
          break;
        }
        case "list": {
          const items = spec.items.flatMap(
            (item, index) => itemOf(`${name}.${index}`, item, errors) ?? [],
          );
          members.push(
            Object.freeze({
              ...base,
              kind: "list",
              items: Object.freeze(items),
              ...(spec.split === undefined ? {} : { split: spec.split }),
            }),
          );
          break;
        }
        case "object":
          members.push(Object.freeze({ ...base, kind: "object" }));
          break;
        case "group": {
          members.push(Object.freeze({ ...base, kind: "group" }));
          visit(spec.members, {
            parent: members.length - 1,
            on,
            watch: base.watch,
            expect: expect === "ambient" ? "ambient" : "settle",
          });
          break;
        }
        default:
          return unreachable(spec);
      }
    }
  };
  visit(cast, { parent: -1, on: undefined, watch: false, expect: "settle" });
  return Object.freeze(members);
}

function single(rest: RestReader): StageLayouts {
  return Object.freeze({
    names: Object.freeze(["main"] as const),
    pick: () => "main",
    readers: Object.freeze({ main: rest }),
  });
}

function compileLayouts(
  layouts: LayoutsInput | undefined,
  rest: Rest | undefined,
  errors: StageError[],
): StageLayouts {
  const fail = (reason: string): StageLayouts => {
    errors.push({ kind: "invalid", field: "layouts", reason });
    return single(NO_REST);
  };
  if (layouts === undefined) {
    if (rest === undefined) return single(NO_REST);
    return isRest(rest) ? single(restReader(rest)) : fail("`rest` boxes need finite numbers.");
  }
  if (rest !== undefined) return fail("give `layouts.rests`, not `rest`, with named layouts.");
  const { names, rests } = layouts;
  if (names.includes("") || new Set(names).size !== names.length)
    return fail("`layouts.names` must name each layout once, none empty.");
  const pick = (events: Events): string => {
    if (layouts.pick === undefined) return names[0];
    const answer: unknown = layouts.pick(events);
    if (typeof answer === "string" && names.includes(answer)) return answer;
    throw new RangeError(
      `layouts.pick answered ${JSON.stringify(answer)}, not one of ${names.join(", ")}.`,
    );
  };
  try {
    pick(NO_EVENTS);
  } catch (thrown) {
    return fail(
      `\`pick\` with no events: ${thrown instanceof Error ? thrown.message : String(thrown)}`,
    );
  }
  const readers: Record<string, RestReader> = {};
  for (const name of names) {
    const own = rests?.[name];
    if (own !== undefined && !isRest(own))
      return fail(`\`layouts.rests\` boxes of "${name}" need finite numbers.`);
    readers[name] = own === undefined ? NO_REST : restReader(own);
  }
  return Object.freeze({ names, pick, readers: Object.freeze(readers) });
}

function compileLimits(
  limits: Readonly<Record<string, Limits>>,
  errors: StageError[],
): Readonly<Record<string, Limits>> {
  const valid = Object.values(limits).every((own) =>
    Object.values(own).every((limit) => limit === undefined || (finite(limit) && limit >= 0)),
  );
  if (!valid)
    errors.push({ kind: "invalid", field: "limits", reason: "each limit must be a number >= 0." });
  return Object.freeze({ ...limits });
}

function signatureOf(durationMs: number, members: readonly Member[]): string {
  const contentKey = (content: Content): string =>
    content.kind === "text" ? `text:${content.value}` : content.kind;
  const serializedMembers = members.map((member) => {
    const own = [
      member.name,
      member.kind,
      member.parent,
      member.watch,
      ...(member.node === undefined ? [] : [member.node]),
    ];
    switch (member.kind) {
      case "actor":
        return [...own, contentKey(member.content)];
      case "list":
        return [...own, member.items.map(contentKey)];
      case "group":
      case "object":
        return own;
      default:
        return unreachable(member);
    }
  });
  return JSON.stringify([durationMs, serializedMembers]);
}

/** Checks what types cannot in a piece and compiles it into a `Stage`, or lists every reason it cannot. */
export function compileStage<B extends string, M extends Members<B>, L extends string>(
  definition: StageDefinition<B, M, L>,
): CompileResult {
  const errors: StageError[] = [];
  const beats = compileBeats(definition.beats, definition.durationMs, errors);
  let members: readonly Member[] = [];
  if (beats !== undefined) {
    try {
      members = compileCast(definition.cast(castBuilder<B>()), beats, errors);
    } catch (thrown) {
      errors.push({
        kind: "invalid",
        field: "cast",
        reason: thrown instanceof Error ? thrown.message : String(thrown),
      });
    }
  }
  const layouts = compileLayouts(definition.layouts, definition.rest, errors);
  const limits = compileLimits(definition.limits ?? {}, errors);
  if (errors.length > 0 || beats === undefined) return { ok: false, errors: Object.freeze(errors) };
  const { cues, settleMs, scene } = definition;
  const stage: Stage = Object.freeze({
    kind: "stage",
    durationMs: beats.durationMs,
    beats: beats.beats,
    members,
    layouts,
    cues: cues === undefined ? NO_EVENTS : mergeEvents(cues),
    limits,
    ...(settleMs === undefined ? {} : { settleMs }),
    scene: (context: SceneContext): unknown => Reflect.apply(scene, undefined, [context]),
    visibleAt: visibility(members),
    signature: signatureOf(beats.durationMs, members),
  });
  return { ok: true, stage };
}

/** Whether `value` reads as a compiled stage: `kind` only, so a stage from a second copy of the package passes. */
export function isStage(value: unknown): value is Stage {
  return isPlainRecord(value) && value["kind"] === "stage";
}
