import {
  NO_INPUT,
  mergeInput,
  span,
  type Cubic2d,
  type Input,
  type Span,
  type Time,
  unreachable,
} from "@gerak/core";
import type { Content, Expect, ScrollWindow, Stretch } from "../author/cast";
import type { RestReader } from "../author/layout";
import type { InputNeed, Limits, SceneContext, ShotSummary } from "../author/stage";
import type { StageError } from "./errors";
import { matchOutlines } from "./outlines";
import { visibility, windowOf, type Window } from "./timeline";

/** One compiled member; list items are named `<list>.<index>`. */
export type Member = {
  readonly name: string;
  readonly expect: Expect;
  readonly watch: boolean;
  /** Input streams statically known to affect this member's pose or visibility. */
  readonly inputs: InputNeed;
  /** Selector of the DOM nodes this member binds to: `[data-cast="<name>"]`; an object has none. */
  readonly node?: string | undefined;
  /** Ms the member shows; absent means always. */
  readonly on?: readonly Window[] | undefined;
  /** Scroll px ranges the member shows during; absent means always. */
  readonly onScroll?: readonly ScrollWindow[] | undefined;
} & (
  | { readonly kind: "object"; readonly parts?: boolean | undefined }
  | { readonly kind: "actor"; readonly content: Content; readonly media?: true | undefined }
  | {
      readonly kind: "list";
      readonly split?: "letters" | "words" | undefined;
    }
);

/** Unchecked member input handed by `compileScene` to the stage compiler. */
export type MemberInput = {
  readonly name: string;
  readonly expect: Expect;
  readonly watch: boolean;
  readonly inputs: InputNeed;
  readonly on?: readonly Stretch[] | undefined;
  readonly onScroll?: readonly ScrollWindow[] | undefined;
} & (
  | { readonly kind: "object"; readonly parts?: boolean | undefined }
  | { readonly kind: "actor"; readonly content: Content; readonly media?: true | undefined }
  | { readonly kind: "list"; readonly split?: "letters" | "words" | undefined }
);

/** Unchecked compiled-stage input built by `scene`. */
export interface StageInput {
  readonly beats: Readonly<Record<string, readonly [number, number]>>;
  readonly durationMs?: number | undefined;
  readonly members: readonly MemberInput[];
  readonly cues?: Input | undefined;
  readonly limits?: Readonly<Record<string, Limits>> | undefined;
  readonly settleMs?: number | undefined;
  readonly shots?: readonly ShotSummary[] | undefined;
  readonly scene: (context: SceneContext) => unknown;
}

/** A checked piece, the one contract renderers and tools read. */
export interface Stage {
  readonly kind: "stage";
  readonly durationMs: number;
  readonly beats: Readonly<Record<string, Span>>;
  readonly members: readonly Member[];
  readonly cues: Input;
  readonly limits: Readonly<Record<string, Limits>>;
  /** Minimum settle window in ms after input events on a page mount, when triggered beats need longer. */
  readonly settleMs?: number | undefined;
  /** The shots made with `shot`, in order, with their ms on this stage's clock. */
  readonly shots?: readonly ShotSummary[] | undefined;
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
      return Object.freeze(content);
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

function compileMembers(
  specs: readonly MemberInput[],
  beats: Beats,
  errors: StageError[],
): readonly Member[] {
  const members: Member[] = [];
  for (const spec of specs) {
    const { name } = spec;
    if (name.includes(".")) errors.push({ kind: "reserved_dot", name });
    const on = spec.on === undefined ? undefined : windowsOf(name, spec.on, beats, errors);
    const onScroll =
      spec.onScroll !== undefined && spec.onScroll.length > 0
        ? Object.freeze([...spec.onScroll])
        : undefined;
    const node = spec.kind === "object" ? undefined : castSelector(name);
    const base = {
      name,
      expect: spec.expect,
      watch: spec.watch,
      inputs: Object.freeze({ ...spec.inputs }),
      ...(node === undefined ? {} : { node }),
      ...(on === undefined ? {} : { on }),
      ...(onScroll === undefined ? {} : { onScroll }),
    };
    switch (spec.kind) {
      case "actor": {
        const content = contentOf(name, spec.content, errors);
        if (content !== undefined)
          members.push(
            Object.freeze({
              ...base,
              kind: "actor",
              content,
              ...(spec.media === true ? { media: true } : {}),
            }),
          );
        break;
      }
      case "list":
        members.push(
          Object.freeze({
            ...base,
            kind: "list",
            ...(spec.split === undefined ? {} : { split: spec.split }),
          }),
        );
        break;
      case "object":
        members.push(
          Object.freeze({
            ...base,
            kind: "object",
            ...(spec.parts === true ? { parts: true } : {}),
          }),
        );
        break;
      default:
        return unreachable(spec);
    }
  }
  return Object.freeze(members);
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
  const serializedMembers = members.map((member) => {
    const own = [
      member.name,
      member.kind,
      member.watch,
      ...(member.node === undefined ? [] : [member.node]),
    ];
    switch (member.kind) {
      case "actor":
        return member.media === true
          ? [...own, member.content.kind, "media"]
          : [...own, member.content.kind];
      case "list":
        return [...own, member.split ?? "parts"];
      case "object":
        return member.parts === true ? [...own, "parts"] : own;
      default:
        return unreachable(member);
    }
  });
  return JSON.stringify([durationMs, serializedMembers]);
}

/** Validates and compiles checked members, beats, limits, and scene callback into a `Stage`. */
export function compileDirectStage(input: StageInput): CompileResult {
  const errors: StageError[] = [];
  const beats = compileBeats(input.beats, input.durationMs, errors);
  const members = beats === undefined ? [] : compileMembers(input.members, beats, errors);
  const limits = compileLimits(input.limits ?? {}, errors);
  if (errors.length > 0 || beats === undefined) return { ok: false, errors: Object.freeze(errors) };
  const { cues, settleMs, shots, scene } = input;
  const stage: Stage = Object.freeze({
    kind: "stage",
    durationMs: beats.durationMs,
    beats: beats.beats,
    members,
    cues: cues === undefined ? NO_INPUT : mergeInput(cues),
    limits,
    ...(settleMs === undefined ? {} : { settleMs }),
    ...(shots === undefined || shots.length === 0 ? {} : { shots }),
    scene: (context: SceneContext): unknown => Reflect.apply(scene, undefined, [context]),
    visibleAt: visibility(members),
    signature: signatureOf(beats.durationMs, members),
  });
  return { ok: true, stage };
}

/** Whether `value` reads as a compiled stage: `kind` only, so a second copy of the package passes. */
export function isStage(value: unknown): value is Stage {
  return isPlainRecord(value) && value["kind"] === "stage";
}
