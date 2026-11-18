import {
  NO_EVENTS,
  isMotionEvent,
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
  type Pivot,
} from "../author/cast";
import {
  NO_REST,
  restReader,
  type Box,
  type Frame,
  type Rest,
  type RestReader,
} from "../author/layout";
import type { Limits, SceneContext } from "../author/stage";
import type { StageError } from "./errors";
import { matchOutlines } from "./outlines";
import { visibility, type Window } from "./timeline";

interface MemberBase {
  readonly name: string;
  /** Index of the enclosing group in `Stage.members`, or -1 at the top. */
  readonly parent: number;
  readonly expect: Expect;
  readonly watch: boolean;
  readonly pivot?: Pivot | undefined;
  /** Ms the member shows, its own or its group's; absent means always. */
  readonly on?: readonly Window[] | undefined;
}

/** One compiled member; `Stage.members` lists them parents first. List items are named `<list>.<index>`. */
export type Member =
  | (MemberBase & { readonly kind: "actor"; readonly content: Content })
  | (MemberBase & { readonly kind: "list"; readonly items: readonly ItemContent[] })
  | (MemberBase & { readonly kind: "group" });

/** The DOM skin, inline or as file URLs. */
export type DomSkin =
  | { readonly kind: "inline"; readonly css: string; readonly defs?: string | undefined }
  | { readonly kind: "url"; readonly css: URL; readonly defs?: URL | undefined };

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
  readonly frame: Frame;
  readonly beats: Readonly<Record<string, Span>>;
  readonly members: readonly Member[];
  readonly layouts: StageLayouts;
  readonly skins: { readonly dom?: DomSkin | undefined };
  readonly cues: Events;
  readonly limits: Readonly<Record<string, Limits>>;
  readonly style?: string | undefined;
  readonly design?: unknown;
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

/** The frame of a piece that gives none. */
export const DEFAULT_FRAME: Frame = Object.freeze({ width: 1280, height: 720 });

const CUBIC_KEYS = ["x0", "y0", "x1", "y1", "x2", "y2", "x3", "y3"] as const;

/** Whether `value` is an object and not an array. */
export function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/** Whether `value` is at least one cubic with an id and finite points. */
export function isCubics(value: unknown): value is readonly Cubic2d[] {
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

/** `cubics` copied and frozen. */
export function frozenCubics(cubics: readonly Cubic2d[]): readonly Cubic2d[] {
  return Object.freeze(cubics.map((cubic) => Object.freeze({ ...cubic })));
}

function isBox(value: unknown): value is Box {
  return (
    isPlainRecord(value) &&
    finite(value["x"]) &&
    finite(value["y"]) &&
    finite(value["width"]) &&
    finite(value["height"])
  );
}

function isRest(value: unknown): value is Rest {
  return isPlainRecord(value) && Object.values(value).every(isBox);
}

interface Beats {
  readonly beats: Readonly<Record<string, Span>>;
  readonly durationMs: number;
}

function compileBeats(raw: unknown, rawDuration: unknown, errors: StageError[]): Beats | undefined {
  const fail = (field: string, reason: string): undefined => {
    errors.push({ kind: "invalid", field, reason });
    return undefined;
  };
  if (!isPlainRecord(raw)) return fail("beats", "`beats` must be an object of `[from, to]` ms.");
  const pairs: (readonly [string, number, number])[] = [];
  for (const [name, pair] of Object.entries(raw)) {
    const from: unknown = Array.isArray(pair) ? pair[0] : undefined;
    const to: unknown = Array.isArray(pair) ? pair[1] : undefined;
    if (
      !Array.isArray(pair) ||
      pair.length !== 2 ||
      !finite(from) ||
      !finite(to) ||
      from < 0 ||
      to < from
    )
      return fail("beats", `beat "${name}" must be [from, to] ms with 0 <= from <= to.`);
    pairs.push([name, from, to]);
  }
  const last = pairs.reduce((most, [, , to]) => Math.max(most, to), 0);
  if (rawDuration !== undefined && !(finite(rawDuration) && rawDuration > 0))
    return fail("durationMs", "`durationMs` must be above 0.");
  const durationMs = finite(rawDuration) ? rawDuration : last;
  if (!(durationMs > 0))
    return fail("beats", "the last beat must end above 0 ms, or give `durationMs`.");
  const late = pairs.find(([, , to]) => to > durationMs);
  if (late !== undefined)
    return fail(
      "beats",
      `beat "${late[0]}" ends at ${late[2]} ms, past durationMs ${durationMs} ms.`,
    );
  const beats: Record<string, Span> = {};
  for (const [name, from, to] of pairs) beats[name] = span(from, to);
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
  raw: unknown,
  beats: Beats,
  errors: StageError[],
): readonly Window[] | undefined {
  if (!Array.isArray(raw) || raw.length === 0) {
    errors.push({
      kind: "invalid",
      field: "cast",
      reason: `"${name}": \`.on()\` needs at least one beat.`,
    });
    return undefined;
  }
  const windows: Window[] = [];
  for (const stretch of raw) {
    const [first, last]: readonly unknown[] =
      typeof stretch === "string" ? [stretch, stretch] : Array.isArray(stretch) ? stretch : [];
    if (typeof first !== "string" || typeof last !== "string") {
      errors.push({
        kind: "invalid",
        field: "cast",
        reason: `"${name}": a stretch is a beat or [from, to] beats.`,
      });
      continue;
    }
    const start = beats.beats[first];
    const end = beats.beats[last];
    if (start === undefined) errors.push({ kind: "unknown_beat", member: name, beat: first });
    if (end === undefined && last !== first)
      errors.push({ kind: "unknown_beat", member: name, beat: last });
    if (start === undefined || end === undefined) continue;
    if (end.to < start.from) {
      errors.push({ kind: "reversed_stretch", member: name, from: first, to: last });
      continue;
    }
    windows.push(Object.freeze([start.from, end.to >= beats.durationMs ? Infinity : end.to]));
  }
  return Object.freeze(windows);
}

function contentOf(name: string, raw: unknown, errors: StageError[]): Content | undefined {
  const fail = (reason: string): undefined => {
    errors.push({ kind: "invalid", field: "cast", reason: `"${name}": ${reason}` });
    return undefined;
  };
  if (!isPlainRecord(raw)) return fail("make members with the cast builders.");
  const kind = raw["kind"];
  switch (kind) {
    case "box":
      return Object.freeze({ kind: "box" });
    case "text": {
      const value = raw["value"];
      return typeof value === "string"
        ? Object.freeze({ kind: "text", value })
        : fail("text needs a string.");
    }
    case "readout": {
      const format = raw["format"];
      if (typeof format !== "function") return fail("a readout needs a function of time.");
      const checked = (time: Time): string => {
        const answer: unknown = Reflect.apply(format, undefined, [time]);
        if (typeof answer !== "string")
          throw new TypeError(`The text of "${name}" answered ${typeof answer}, not a string.`);
        return answer;
      };
      return Object.freeze({ kind: "readout", format: checked });
    }
    case "stroke": {
      const path = raw["path"];
      if (typeof path === "function") {
        const checked = (rest: RestReader): readonly Cubic2d[] => {
          const answer: unknown = Reflect.apply(path, undefined, [rest]);
          if (!isCubics(answer))
            throw new TypeError(`path "${name}" must answer cubics made by \`toCubics\`.`);
          return frozenCubics(answer);
        };
        return Object.freeze({ kind: "stroke", path: checked });
      }
      return isCubics(path)
        ? Object.freeze({ kind: "stroke", path: frozenCubics(path) })
        : fail("a stroke needs cubics or a function of rest.");
    }
    case "morph": {
      const shapes = raw["shapes"];
      if (!Array.isArray(shapes) || shapes.length < 2 || !shapes.every(isCubics)) {
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
      return fail(`unknown content ${String(kind)}.`);
  }
}

function itemOf(name: string, raw: unknown, errors: StageError[]): ItemContent | undefined {
  const content = contentOf(name, raw, errors);
  if (content === undefined) return undefined;
  if (content.kind === "readout") {
    errors.push({
      kind: "invalid",
      field: "cast",
      reason: `"${name}": a readout inside a list; a readout is a top-level actor.`,
    });
    return undefined;
  }
  return content;
}

function compileCast(raw: unknown, beats: Beats, errors: StageError[]): readonly Member[] {
  const members: Member[] = [];
  const seen = new Set<string>();
  const visit = (record: Record<string, unknown>, from: Inherited): void => {
    for (const [name, spec] of Object.entries(record)) {
      if (name.includes(".")) errors.push({ kind: "reserved_dot", name });
      if (seen.has(name)) errors.push({ kind: "duplicate_member", name });
      seen.add(name);
      if (!isPlainRecord(spec) || !isPlainRecord(spec["meta"])) {
        errors.push({
          kind: "invalid",
          field: "cast",
          reason: `"${name}": make members with the cast builders.`,
        });
        continue;
      }
      const meta = spec["meta"];
      const on = meta["on"] === undefined ? from.on : windowsOf(name, meta["on"], beats, errors);
      const rawExpect = meta["expect"];
      const expect =
        rawExpect === "settle" || rawExpect === "ambient" || rawExpect === "static"
          ? rawExpect
          : from.expect;
      if (rawExpect !== undefined && expect !== rawExpect)
        errors.push({
          kind: "invalid",
          field: "cast",
          reason: `"${name}": expect is settle, ambient or static.`,
        });
      const rawPivot = meta["pivot"];
      const pivot =
        isPlainRecord(rawPivot) && finite(rawPivot["x"]) && finite(rawPivot["y"])
          ? Object.freeze({ x: rawPivot["x"], y: rawPivot["y"] })
          : undefined;
      if (rawPivot !== undefined && pivot === undefined)
        errors.push({
          kind: "invalid",
          field: "cast",
          reason: `"${name}": a pivot needs finite x and y.`,
        });
      const base = {
        name,
        parent: from.parent,
        expect,
        watch: typeof meta["watch"] === "boolean" ? meta["watch"] : from.watch,
        ...(pivot === undefined ? {} : { pivot }),
        ...(on === undefined ? {} : { on }),
      };
      const kind = spec["kind"];
      switch (kind) {
        case "actor": {
          const content = contentOf(name, spec["content"], errors);
          if (content !== undefined)
            members.push(Object.freeze({ ...base, kind: "actor", content }));
          break;
        }
        case "list": {
          const raws = spec["items"];
          if (!Array.isArray(raws)) {
            errors.push({
              kind: "invalid",
              field: "cast",
              reason: `"${name}": a list needs items.`,
            });
            break;
          }
          const items = raws.flatMap(
            (item, index) => itemOf(`${name}.${index}`, item, errors) ?? [],
          );
          members.push(Object.freeze({ ...base, kind: "list", items: Object.freeze(items) }));
          break;
        }
        case "group": {
          const children = spec["members"];
          if (!isPlainRecord(children)) {
            errors.push({
              kind: "invalid",
              field: "cast",
              reason: `"${name}": a group needs members.`,
            });
            break;
          }
          members.push(Object.freeze({ ...base, kind: "group" }));
          visit(children, {
            parent: members.length - 1,
            on,
            watch: base.watch,
            expect: expect === "ambient" ? "ambient" : "settle",
          });
          break;
        }
        default:
          errors.push({
            kind: "invalid",
            field: "cast",
            reason: `"${name}": make members with the cast builders.`,
          });
      }
    }
  };
  if (!isPlainRecord(raw))
    errors.push({
      kind: "invalid",
      field: "cast",
      reason: "`cast` must return an object of members.",
    });
  else visit(raw, { parent: -1, on: undefined, watch: false, expect: "settle" });
  return Object.freeze(members);
}

function compileLayouts(rawLayouts: unknown, rawRest: unknown, errors: StageError[]): StageLayouts {
  const fail = (reason: string): StageLayouts => {
    errors.push({ kind: "invalid", field: "layouts", reason });
    return single(NO_REST);
  };
  const single = (rest: RestReader): StageLayouts =>
    Object.freeze({
      names: Object.freeze(["main"] as const),
      pick: () => "main",
      readers: Object.freeze({ main: rest }),
    });
  if (rawLayouts === undefined) {
    if (rawRest === undefined) return single(NO_REST);
    return isRest(rawRest)
      ? single(restReader(rawRest))
      : fail("`rest` must map member names to { x, y, width, height }.");
  }
  if (rawRest !== undefined) return fail("give `layouts.rests`, not `rest`, with named layouts.");
  if (!isPlainRecord(rawLayouts)) return fail("`layouts` must be { names, pick?, rests? }.");
  const rawNames = rawLayouts["names"];
  if (
    !Array.isArray(rawNames) ||
    !rawNames.every((name): name is string => typeof name === "string" && name !== "")
  )
    return fail("`layouts.names` must list layout names.");
  const [first, ...others] = rawNames;
  if (first === undefined) return fail("`layouts.names` must list at least one layout.");
  if (new Set(rawNames).size !== rawNames.length)
    return fail("`layouts.names` names a layout twice.");
  const rawPick = rawLayouts["pick"];
  if (rawPick !== undefined && typeof rawPick !== "function")
    return fail("`layouts.pick` must be a function of events.");
  const pick = (events: Events): string => {
    if (typeof rawPick !== "function") return first;
    const answer: unknown = Reflect.apply(rawPick, undefined, [events]);
    if (typeof answer === "string" && rawNames.includes(answer)) return answer;
    throw new RangeError(
      `layouts.pick answered ${JSON.stringify(answer)}, not one of ${rawNames.join(", ")}.`,
    );
  };
  try {
    pick(NO_EVENTS);
  } catch (thrown) {
    return fail(
      `\`pick\` with no events: ${thrown instanceof Error ? thrown.message : String(thrown)}`,
    );
  }
  const rawRests = rawLayouts["rests"];
  if (rawRests !== undefined && !(isPlainRecord(rawRests) && Object.values(rawRests).every(isRest)))
    return fail("`layouts.rests` must map layout names to rests.");
  const readers: Record<string, RestReader> = {};
  for (const name of rawNames) {
    const rest = isPlainRecord(rawRests) ? rawRests[name] : undefined;
    if (rawRests !== undefined && !isRest(rest))
      return fail(`\`layouts.rests\` has no rest for "${name}".`);
    readers[name] = isRest(rest) ? restReader(rest) : NO_REST;
  }
  return Object.freeze({
    names: Object.freeze([first, ...others] as const),
    pick,
    readers: Object.freeze(readers),
  });
}

function compileSkin(raw: unknown, errors: StageError[]): DomSkin | undefined {
  const fail = (reason: string): undefined => {
    errors.push({ kind: "invalid", field: "skins", reason });
    return undefined;
  };
  if (raw === undefined) return undefined;
  if (!isPlainRecord(raw)) return fail("`skins` must be { dom?: { css, defs? } }.");
  const dom = raw["dom"];
  if (dom === undefined) return undefined;
  if (!isPlainRecord(dom)) return fail("`skins.dom` must be { css, defs? }.");
  const css = dom["css"];
  const defs = dom["defs"];
  if (css instanceof URL) {
    if (defs !== undefined && !(defs instanceof URL))
      return fail("`skins.dom.defs` must be a URL when `css` is.");
    return Object.freeze({ kind: "url", css, ...(defs === undefined ? {} : { defs }) });
  }
  if (typeof css !== "string") return fail("`skins.dom.css` must be a string or a URL.");
  if (defs !== undefined && typeof defs !== "string")
    return fail("`skins.dom.defs` must be a string when `css` is.");
  return Object.freeze({ kind: "inline", css, ...(defs === undefined ? {} : { defs }) });
}

function compileLimits(raw: unknown, errors: StageError[]): Readonly<Record<string, Limits>> {
  if (raw === undefined) return Object.freeze({});
  const limits: Record<string, Limits> = {};
  const valid =
    isPlainRecord(raw) &&
    Object.entries(raw).every(([target, entry]) => {
      if (!isPlainRecord(entry)) return false;
      const own: { jump?: number; turn?: number; ratio?: number } = {};
      for (const [field, limit] of Object.entries(entry)) {
        if (!finite(limit) || limit < 0) return false;
        if (field === "jump" || field === "turn" || field === "ratio") own[field] = limit;
        else return false;
      }
      limits[target] = Object.freeze(own);
      return true;
    });
  if (!valid)
    errors.push({
      kind: "invalid",
      field: "limits",
      reason: "`limits` maps targets to { jump?, turn?, ratio? }, each >= 0.",
    });
  return Object.freeze(limits);
}

function signatureOf(durationMs: number, members: readonly Member[]): string {
  const contentKey = (content: Content): string =>
    content.kind === "text" ? `text:${content.value}` : content.kind;
  return JSON.stringify([
    durationMs,
    members.map((member) => {
      const own = [member.name, member.kind, member.parent, member.watch];
      switch (member.kind) {
        case "actor":
          return [...own, contentKey(member.content)];
        case "list":
          return [...own, member.items.map(contentKey)];
        case "group":
          return own;
        default:
          return unreachable(member);
      }
    }),
  ]);
}

/** Checks a piece and compiles it into a `Stage`, or lists every reason it cannot. */
export function compileStage(definition: unknown): CompileResult {
  if (!isPlainRecord(definition))
    return {
      ok: false,
      errors: [
        { kind: "invalid", field: "stage", reason: "a stage is what `defineStage` returns." },
      ],
    };
  const errors: StageError[] = [];
  const scene = definition["scene"];
  if (typeof scene !== "function")
    errors.push({ kind: "invalid", field: "scene", reason: "`scene` must be a function." });
  const beats = compileBeats(definition["beats"], definition["durationMs"], errors);

  const rawFrame = definition["frame"];
  let frame = DEFAULT_FRAME;
  if (rawFrame !== undefined) {
    if (
      isPlainRecord(rawFrame) &&
      finite(rawFrame["width"]) &&
      finite(rawFrame["height"]) &&
      rawFrame["width"] > 0 &&
      rawFrame["height"] > 0
    )
      frame = Object.freeze({ width: rawFrame["width"], height: rawFrame["height"] });
    else
      errors.push({
        kind: "invalid",
        field: "frame",
        reason: "`frame` needs a width and height above 0.",
      });
  }

  const castFn = definition["cast"];
  let members: readonly Member[] = [];
  if (typeof castFn !== "function")
    errors.push({ kind: "invalid", field: "cast", reason: "`cast` must be `(m) => ({ ... })`." });
  else if (beats !== undefined) {
    try {
      members = compileCast(Reflect.apply(castFn, undefined, [castBuilder()]), beats, errors);
    } catch (thrown) {
      errors.push({
        kind: "invalid",
        field: "cast",
        reason: thrown instanceof Error ? thrown.message : String(thrown),
      });
    }
  }

  const layouts = compileLayouts(definition["layouts"], definition["rest"], errors);
  const dom = compileSkin(definition["skins"], errors);
  const rawCues = definition["cues"];
  let cues = NO_EVENTS;
  if (rawCues !== undefined) {
    if (Array.isArray(rawCues) && rawCues.every(isMotionEvent)) cues = mergeEvents(rawCues);
    else
      errors.push({
        kind: "invalid",
        field: "cues",
        reason: "`cues` must be a list of { name, at, target? } events.",
      });
  }
  const style = definition["style"];
  if (style !== undefined && typeof style !== "string")
    errors.push({ kind: "invalid", field: "style", reason: "`style` names a style card." });
  const limits = compileLimits(definition["limits"], errors);

  if (errors.length > 0 || beats === undefined || typeof scene !== "function")
    return { ok: false, errors: Object.freeze(errors) };
  const design: unknown = definition["design"];
  const stage: Stage = Object.freeze({
    kind: "stage",
    durationMs: beats.durationMs,
    frame,
    beats: beats.beats,
    members,
    layouts,
    skins: Object.freeze(dom === undefined ? {} : { dom }),
    cues,
    limits,
    ...(typeof style === "string" ? { style } : {}),
    ...(design === undefined ? {} : { design }),
    scene: (context: SceneContext): unknown => Reflect.apply(scene, undefined, [context]),
    visibleAt: visibility(members),
    signature: signatureOf(beats.durationMs, members),
  });
  return { ok: true, stage };
}

/** Whether `value` is a stage `compileStage` returned. */
export function isStage(value: unknown): value is Stage {
  return isPlainRecord(value) && value["kind"] === "stage";
}
