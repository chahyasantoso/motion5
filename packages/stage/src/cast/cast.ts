import { unreachable, type Cubic2d, type Time } from "@gerak/core";
import type { CompiledBeats, CompiledStretch, Stretch } from "../beats/index";
import type { RestReader } from "../layout/index";
import type { MotionExpectation, ReviewMemberSpec } from "../review/index";
import { matchOutlines } from "./outlines";

/** Fixed cubic segments or a layout-dependent function reading `RestReader`. */
export type ActorPath = readonly Cubic2d[] | ((rest: RestReader) => readonly Cubic2d[]);

/** Closed union describing what an actor displays on stage. */
export type ActorContent =
  | { readonly kind: "empty" }
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "readout"; readonly format: (time: Time) => string }
  | { readonly kind: "stroke"; readonly path: ActorPath }
  | {
      readonly kind: "morph";
      readonly base: readonly Cubic2d[];
      readonly targets: readonly (readonly Cubic2d[])[];
    };

/** Actor content permitted inside `list` members (disallows dynamic time `readout`). */
export type ListActorContent = Exclude<ActorContent, { readonly kind: "readout" }>;

/** Point in frame px around which a member rotates and scales. */
export interface Pivot {
  readonly x: number;
  readonly y: number;
}

/** Authored modifier metadata attached to a member or list item. */
export interface MemberMeta<
  B extends string = string,
  E extends MotionExpectation = MotionExpectation,
> {
  readonly on?: readonly Stretch<B>[] | undefined;
  readonly watch?: boolean | undefined;
  readonly expectation?: E | undefined;
  readonly pivot?: Pivot | undefined;
}

/** An item-compatible actor (`"readout"` excluded at compile time). */
export interface ListActor<
  B extends string = string,
  E extends MotionExpectation = MotionExpectation,
> {
  readonly kind: "actor";
  readonly content: ListActorContent;
  readonly meta: MemberMeta<B, E>;
}

/** Closed discriminated union of cast members: `"actor"`, `"list"`, or `"group"`. */
export type Member<B extends string = string, E extends MotionExpectation = MotionExpectation> =
  | { readonly kind: "actor"; readonly content: ActorContent; readonly meta: MemberMeta<B, E> }
  | {
      readonly kind: "list";
      readonly items: readonly ListActor<B>[];
      readonly meta: MemberMeta<B, E>;
    }
  | {
      readonly kind: "group";
      readonly members: Readonly<Record<string, Member<B>>>;
      readonly meta: MemberMeta<B, E>;
    };

/** Fluent modifier API shared by actor, list, and group builders. */
export interface MemberModifiers<B extends string, Self> {
  on(...stretches: Stretch<B>[]): Self;
  watch(enabled?: boolean): Self;
  pivot(point: Pivot): Self;
  pivot(x: number, y: number): Self;
}

/** Fluent builder for item-compatible actors (`box`, `text`, `stroke`, `morph`). */
export interface ListActorBuilder<B extends string = string, E extends MotionExpectation = "settle">
  extends ListActor<B, E>,
    MemberModifiers<B, ListActorBuilder<B, E>> {
  static(): ListActorBuilder<B, "static">;
  ambient(): ListActorBuilder<B, "ambient">;
  settle(): ListActorBuilder<B, "settle">;
}

/** Fluent builder for top-level `readout` actors (excluded from lists). */
export interface ReadoutActorBuilder<
  B extends string = string,
  E extends MotionExpectation = "settle",
> extends MemberModifiers<B, ReadoutActorBuilder<B, E>> {
  readonly kind: "actor";
  readonly content: { readonly kind: "readout"; readonly format: (time: Time) => string };
  readonly meta: MemberMeta<B, E>;
  static(): ReadoutActorBuilder<B, "static">;
  ambient(): ReadoutActorBuilder<B, "ambient">;
  settle(): ReadoutActorBuilder<B, "settle">;
}

/** Fluent builder for `many`, `letters`, and `words` list members. */
export interface ListMemberBuilder<
  B extends string = string,
  E extends MotionExpectation = "settle",
> extends MemberModifiers<B, ListMemberBuilder<B, E>> {
  readonly kind: "list";
  readonly items: readonly ListActor<B>[];
  readonly meta: MemberMeta<B, E>;
  static(): ListMemberBuilder<B, "static">;
  ambient(): ListMemberBuilder<B, "ambient">;
  settle(): ListMemberBuilder<B, "settle">;
}

/** Fluent builder for `group` container members holding nested child members. */
export interface GroupMemberBuilder<
  B extends string = string,
  E extends MotionExpectation = "settle",
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
> extends MemberModifiers<B, GroupMemberBuilder<B, E, C>> {
  readonly kind: "group";
  readonly members: C;
  readonly meta: MemberMeta<B, E>;
  static(): GroupMemberBuilder<B, "static", C>;
  ambient(): GroupMemberBuilder<B, "ambient", C>;
  settle(): GroupMemberBuilder<B, "settle", C>;
}

/** Builder factory passed to `cast: (m) => ({ ... })` inside `defineStage`. */
export interface CastBuilder<B extends string = string> {
  box(): ListActorBuilder<B>;
  text(value: string): ListActorBuilder<B>;
  readout(format: (time: Time) => string): ReadoutActorBuilder<B>;
  stroke(path: ActorPath): ListActorBuilder<B>;
  morph(base: readonly Cubic2d[], targets: readonly (readonly Cubic2d[])[]): ListActorBuilder<B>;
  many(count: number): ListMemberBuilder<B>;
  many<T>(
    items: readonly T[],
    make: (item: T, index: number) => ListActor<B>,
  ): ListMemberBuilder<B>;
  letters(text: string): ListMemberBuilder<B>;
  words(text: string): ListMemberBuilder<B>;
  group<C extends Readonly<Record<string, Member<B>>>>(
    members: C,
  ): GroupMemberBuilder<B, "settle", C>;
}

/** Runtime actor content after compile-time morph matching. */
export type CompiledContent =
  | { readonly kind: "empty" }
  | { readonly kind: "text"; readonly value: string }
  | { readonly kind: "readout"; readonly format: (time: Time) => string }
  | { readonly kind: "stroke"; readonly path: ActorPath }
  | {
      readonly kind: "morph";
      readonly base: readonly Cubic2d[];
      readonly targets: readonly (readonly Cubic2d[])[];
      readonly matched: readonly (readonly Cubic2d[])[];
    };

/** Compiled member node in the runtime cast tree. */
export type CompiledMember =
  | {
      readonly kind: "actor";
      readonly name: string;
      readonly content: CompiledContent;
      readonly watch: boolean;
      readonly on?: readonly CompiledStretch[] | undefined;
      readonly pivot?: Pivot | undefined;
    }
  | {
      readonly kind: "list";
      readonly name: string;
      readonly items: readonly CompiledListItem[];
      readonly watch: boolean;
      readonly on?: readonly CompiledStretch[] | undefined;
      readonly pivot?: Pivot | undefined;
    }
  | {
      readonly kind: "group";
      readonly name: string;
      readonly members: Readonly<Record<string, CompiledMember>>;
      readonly watch: boolean;
      readonly on?: readonly CompiledStretch[] | undefined;
      readonly pivot?: Pivot | undefined;
    };

/** Compiled item inside a `list` member. */
export interface CompiledListItem {
  readonly kind: "item";
  readonly name: string;
  readonly list: string;
  readonly index: number;
  readonly content: Exclude<CompiledContent, { readonly kind: "readout" }>;
  readonly watch: boolean;
  readonly on?: readonly CompiledStretch[] | undefined;
  readonly pivot?: Pivot | undefined;
}

/** Flat entry describing any member, list, group, or item for fast frame evaluation. */
export interface MemberEntry {
  readonly name: string;
  readonly kind: "actor" | "list" | "group" | "item";
  readonly groups: readonly string[];
  readonly list?: string | undefined;
  readonly index?: number | undefined;
  readonly on?: readonly CompiledStretch[] | undefined;
  readonly watch: boolean;
  readonly pivot?: Pivot | undefined;
  readonly content?: CompiledContent | undefined;
  readonly itemCount?: number | undefined;
}

/** Pure runtime cast representation held on `CompiledStage.members`, free of review metadata. */
export interface CompiledMembers {
  readonly tree: Readonly<Record<string, CompiledMember>>;
  readonly entries: readonly MemberEntry[];
  readonly byName: ReadonlyMap<string, MemberEntry>;
  readonly topLevel: readonly MemberEntry[];
  readonly morphs: readonly (MemberEntry & {
    readonly content: Extract<CompiledContent, { readonly kind: "morph" }>;
  })[];
  readonly readouts: readonly (MemberEntry & {
    readonly content: Extract<CompiledContent, { readonly kind: "readout" }>;
  })[];
}

/** Structured cast compilation failures produced before `compileStage` maps them to `StageError`. */
export type CastCompileError =
  | { readonly kind: "duplicate_member"; readonly name: string }
  | { readonly kind: "reserved_dot_in_name"; readonly name: string }
  | { readonly kind: "empty_on_stretches"; readonly member: string }
  | { readonly kind: "unknown_beat"; readonly member: string; readonly beat: string }
  | {
      readonly kind: "reversed_stretch";
      readonly member: string;
      readonly from: string;
      readonly to: string;
    }
  | { readonly kind: "morph_mismatch"; readonly member: string; readonly reason: string }
  | { readonly kind: "invalid_definition"; readonly field: "cast"; readonly reason: string };

const CUBIC_KEYS = ["x0", "y0", "x1", "y1", "x2", "y2", "x3", "y3"] as const;

/** Whether `value` is a non-empty list of valid `Cubic2d` segments. */
export function isCubics(value: unknown): value is readonly Cubic2d[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (cubic: unknown) =>
        typeof cubic === "object" &&
        cubic !== null &&
        typeof Reflect.get(cubic, "id") === "string" &&
        CUBIC_KEYS.every((key) => Number.isFinite(Reflect.get(cubic, key))),
    )
  );
}

function freezeCubics(cubics: readonly Cubic2d[]): readonly Cubic2d[] {
  return Object.freeze(cubics.map((cubic) => Object.freeze({ ...cubic })));
}

function makePivot(first: Pivot | number, second?: number): Pivot {
  if (typeof first === "number") return Object.freeze({ x: first, y: second ?? 0 });
  return Object.freeze({ x: first.x, y: first.y });
}

function makeListActor<B extends string, E extends MotionExpectation>(
  content: ListActorContent,
  meta: MemberMeta<B, E>,
): ListActorBuilder<B, E> {
  const withMeta = <NextE extends MotionExpectation>(
    next: MemberMeta<B, NextE>,
  ): ListActorBuilder<B, NextE> => makeListActor(content, Object.freeze(next));
  return Object.freeze({
    kind: "actor" as const,
    content,
    meta,
    on: (...stretches: Stretch<B>[]) => withMeta({ ...meta, on: Object.freeze([...stretches]) }),
    watch: (enabled = true) => withMeta({ ...meta, watch: enabled }),
    pivot: (first: Pivot | number, second?: number) =>
      withMeta({ ...meta, pivot: makePivot(first, second) }),
    static: () => withMeta<"static">({ ...meta, expectation: "static" }),
    ambient: () => withMeta<"ambient">({ ...meta, expectation: "ambient" }),
    settle: () => withMeta<"settle">({ ...meta, expectation: "settle" }),
  });
}

function makeReadoutActor<B extends string, E extends MotionExpectation>(
  content: { readonly kind: "readout"; readonly format: (time: Time) => string },
  meta: MemberMeta<B, E>,
): ReadoutActorBuilder<B, E> {
  const withMeta = <NextE extends MotionExpectation>(
    next: MemberMeta<B, NextE>,
  ): ReadoutActorBuilder<B, NextE> => makeReadoutActor(content, Object.freeze(next));
  return Object.freeze({
    kind: "actor" as const,
    content,
    meta,
    on: (...stretches: Stretch<B>[]) => withMeta({ ...meta, on: Object.freeze([...stretches]) }),
    watch: (enabled = true) => withMeta({ ...meta, watch: enabled }),
    pivot: (first: Pivot | number, second?: number) =>
      withMeta({ ...meta, pivot: makePivot(first, second) }),
    static: () => withMeta<"static">({ ...meta, expectation: "static" }),
    ambient: () => withMeta<"ambient">({ ...meta, expectation: "ambient" }),
    settle: () => withMeta<"settle">({ ...meta, expectation: "settle" }),
  });
}

function makeListMember<B extends string, E extends MotionExpectation>(
  items: readonly ListActor<B>[],
  meta: MemberMeta<B, E>,
): ListMemberBuilder<B, E> {
  const withMeta = <NextE extends MotionExpectation>(
    next: MemberMeta<B, NextE>,
  ): ListMemberBuilder<B, NextE> => makeListMember(items, Object.freeze(next));
  return Object.freeze({
    kind: "list" as const,
    items,
    meta,
    on: (...stretches: Stretch<B>[]) => withMeta({ ...meta, on: Object.freeze([...stretches]) }),
    watch: (enabled = true) => withMeta({ ...meta, watch: enabled }),
    pivot: (first: Pivot | number, second?: number) =>
      withMeta({ ...meta, pivot: makePivot(first, second) }),
    static: () => withMeta<"static">({ ...meta, expectation: "static" }),
    ambient: () => withMeta<"ambient">({ ...meta, expectation: "ambient" }),
    settle: () => withMeta<"settle">({ ...meta, expectation: "settle" }),
  });
}

function makeGroupMember<
  B extends string,
  E extends MotionExpectation,
  C extends Readonly<Record<string, Member<B>>>,
>(members: C, meta: MemberMeta<B, E>): GroupMemberBuilder<B, E, C> {
  const withMeta = <NextE extends MotionExpectation>(
    next: MemberMeta<B, NextE>,
  ): GroupMemberBuilder<B, NextE, C> => makeGroupMember(members, Object.freeze(next));
  return Object.freeze({
    kind: "group" as const,
    members,
    meta,
    on: (...stretches: Stretch<B>[]) => withMeta({ ...meta, on: Object.freeze([...stretches]) }),
    watch: (enabled = true) => withMeta({ ...meta, watch: enabled }),
    pivot: (first: Pivot | number, second?: number) =>
      withMeta({ ...meta, pivot: makePivot(first, second) }),
    static: () => withMeta<"static">({ ...meta, expectation: "static" }),
    ambient: () => withMeta<"ambient">({ ...meta, expectation: "ambient" }),
    settle: () => withMeta<"settle">({ ...meta, expectation: "settle" }),
  });
}

/** Creates the `CastBuilder` passed into `defineStage`'s `cast(m)` callback. */
export function createCastBuilder<B extends string>(): CastBuilder<B> {
  const box = (): ListActorBuilder<B> => makeListActor({ kind: "empty" }, {});
  const text = (value: string): ListActorBuilder<B> => makeListActor({ kind: "text", value }, {});
  const readout = (format: (time: Time) => string): ReadoutActorBuilder<B> =>
    makeReadoutActor({ kind: "readout", format }, {});
  const stroke = (path: ActorPath): ListActorBuilder<B> =>
    makeListActor(
      { kind: "stroke", path: typeof path === "function" ? path : freezeCubics(path) },
      {},
    );
  const morph = (
    base: readonly Cubic2d[],
    targets: readonly (readonly Cubic2d[])[],
  ): ListActorBuilder<B> =>
    makeListActor(
      {
        kind: "morph",
        base: freezeCubics(base),
        targets: Object.freeze(targets.map(freezeCubics)),
      },
      {},
    );
  function many<T>(
    source: number | readonly T[],
    make?: (item: T, index: number) => ListActor<B>,
  ): ListMemberBuilder<B> {
    if (typeof source === "number") {
      if (!(Number.isInteger(source) && source >= 0))
        throw new RangeError(`many: count must be a whole number >= 0, not ${source}.`);
      return makeListMember(Object.freeze(Array.from({ length: source }, () => box())), {});
    }
    if (make === undefined)
      throw new TypeError("many: a list needs a builder callback for each item.");
    return makeListMember(Object.freeze(source.map(make)), {});
  }
  const letters = (value: string): ListMemberBuilder<B> => {
    const graphemes = [
      ...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(value),
    ];
    return makeListMember(Object.freeze(graphemes.map(({ segment }) => text(segment))), {});
  };
  const words = (value: string): ListMemberBuilder<B> =>
    makeListMember(
      Object.freeze(
        value
          .split(" ")
          .filter((word) => word !== "")
          .map((word) => text(word)),
      ),
      {},
    );
  const group = <C extends Readonly<Record<string, Member<B>>>>(
    members: C,
  ): GroupMemberBuilder<B, "settle", C> => makeGroupMember(Object.freeze({ ...members }), {});

  return { box, text, readout, stroke, morph, many, letters, words, group };
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateMeta(
  name: string,
  rawMeta: unknown,
  beats: CompiledBeats,
  inheritedOn: readonly CompiledStretch[] | undefined,
  inheritedWatch: boolean,
  inheritedExpectation: MotionExpectation,
  errors: CastCompileError[],
): {
  readonly on?: readonly CompiledStretch[] | undefined;
  readonly watch: boolean;
  readonly expectation: MotionExpectation;
  readonly pivot?: Pivot | undefined;
} {
  if (!isPlainRecord(rawMeta)) {
    errors.push({
      kind: "invalid_definition",
      field: "cast",
      reason: `member "${name}" has malformed meta.`,
    });
    return { on: inheritedOn, watch: inheritedWatch, expectation: inheritedExpectation };
  }

  let on = inheritedOn;
  const rawOn = rawMeta["on"];
  if (rawOn !== undefined) {
    if (!Array.isArray(rawOn)) {
      errors.push({
        kind: "invalid_definition",
        field: "cast",
        reason: `member "${name}" has non-array \`on\`.`,
      });
    } else if (rawOn.length === 0) {
      errors.push({ kind: "empty_on_stretches", member: name });
    } else {
      const pairs: CompiledStretch[] = [];
      let valid = true;
      for (const entry of rawOn) {
        let from: string | undefined;
        let to: string | undefined;
        if (typeof entry === "string") {
          from = entry;
          to = entry;
        } else if (
          Array.isArray(entry) &&
          entry.length === 2 &&
          typeof entry[0] === "string" &&
          typeof entry[1] === "string"
        ) {
          from = entry[0];
          to = entry[1];
        } else {
          valid = false;
          errors.push({
            kind: "invalid_definition",
            field: "cast",
            reason: `member "${name}" has malformed stretch in \`on\`.`,
          });
          continue;
        }
        const fromSpan = beats.order.includes(from) ? beats[from] : undefined;
        const toSpan = beats.order.includes(to) ? beats[to] : undefined;
        if (fromSpan === undefined) {
          valid = false;
          errors.push({ kind: "unknown_beat", member: name, beat: from });
        }
        if (to !== from && toSpan === undefined) {
          valid = false;
          errors.push({ kind: "unknown_beat", member: name, beat: to });
        }
        if (fromSpan !== undefined && toSpan !== undefined && toSpan.to < fromSpan.from) {
          valid = false;
          errors.push({ kind: "reversed_stretch", member: name, from, to });
        }
        pairs.push(Object.freeze([from, to]));
      }
      if (valid) on = Object.freeze(pairs);
    }
  }

  const rawWatch = rawMeta["watch"];
  if (rawWatch !== undefined && typeof rawWatch !== "boolean")
    errors.push({
      kind: "invalid_definition",
      field: "cast",
      reason: `member "${name}" \`watch\` must be a boolean.`,
    });
  const watch = typeof rawWatch === "boolean" ? rawWatch : inheritedWatch;

  const rawExpectation = rawMeta["expectation"];
  let expectation: MotionExpectation = inheritedExpectation;
  if (rawExpectation !== undefined) {
    if (rawExpectation === "settle" || rawExpectation === "ambient" || rawExpectation === "static")
      expectation = rawExpectation;
    else
      errors.push({
        kind: "invalid_definition",
        field: "cast",
        reason: `member "${name}" has invalid expectation ${String(rawExpectation)}.`,
      });
  }

  const rawPivot = rawMeta["pivot"];
  let pivot: Pivot | undefined;
  if (rawPivot !== undefined) {
    const px = isPlainRecord(rawPivot) ? rawPivot["x"] : undefined;
    const py = isPlainRecord(rawPivot) ? rawPivot["y"] : undefined;
    if (
      typeof px === "number" &&
      typeof py === "number" &&
      Number.isFinite(px) &&
      Number.isFinite(py)
    )
      pivot = Object.freeze({ x: px, y: py });
    else
      errors.push({
        kind: "invalid_definition",
        field: "cast",
        reason: `member "${name}" \`pivot\` must have finite x and y.`,
      });
  }

  return {
    ...(on === undefined ? {} : { on }),
    watch,
    expectation,
    ...(pivot === undefined ? {} : { pivot }),
  };
}

function compileContent(
  name: string,
  rawContent: unknown,
  allowReadout: boolean,
  errors: CastCompileError[],
): CompiledContent | undefined {
  if (!isPlainRecord(rawContent)) {
    errors.push({
      kind: "invalid_definition",
      field: "cast",
      reason: `actor "${name}" has malformed content.`,
    });
    return undefined;
  }
  const kind = rawContent["kind"];
  switch (kind) {
    case "empty":
      return Object.freeze({ kind: "empty" });
    case "text": {
      const value = rawContent["value"];
      if (typeof value !== "string") {
        errors.push({
          kind: "invalid_definition",
          field: "cast",
          reason: `text actor "${name}" needs a string value.`,
        });
        return undefined;
      }
      return Object.freeze({ kind: "text", value });
    }
    case "readout": {
      if (!allowReadout) {
        errors.push({
          kind: "invalid_definition",
          field: "cast",
          reason: `"${name}" uses a readout inside a list; readouts must be top-level actors.`,
        });
        return undefined;
      }
      const format = rawContent["format"];
      if (typeof format !== "function") {
        errors.push({
          kind: "invalid_definition",
          field: "cast",
          reason: `readout "${name}" needs a formatter function.`,
        });
        return undefined;
      }
      const safeFormat = (time: Time): string => {
        const answer: unknown = Reflect.apply(format, undefined, [time]);
        if (typeof answer !== "string")
          throw new TypeError(`The text of "${name}" answered ${typeof answer}, not a string.`);
        return answer;
      };
      return Object.freeze({ kind: "readout", format: safeFormat });
    }
    case "stroke": {
      const path = rawContent["path"];
      if (typeof path === "function") {
        const typedPath = (rest: RestReader): readonly Cubic2d[] => {
          const out: unknown = Reflect.apply(path, undefined, [rest]);
          if (!isCubics(out))
            throw new TypeError(
              "A path function must answer cubics made by `toCubics`, at least one.",
            );
          return freezeCubics(out);
        };
        return Object.freeze({ kind: "stroke", path: typedPath });
      }
      if (!isCubics(path)) {
        errors.push({
          kind: "invalid_definition",
          field: "cast",
          reason: `stroke "${name}" needs non-empty cubics or a path function.`,
        });
        return undefined;
      }
      return Object.freeze({ kind: "stroke", path: freezeCubics(path) });
    }
    case "morph": {
      const base = rawContent["base"];
      const targets = rawContent["targets"];
      if (!isCubics(base)) {
        errors.push({
          kind: "morph_mismatch",
          member: name,
          reason: "morph base outline must be non-empty valid cubics.",
        });
        return undefined;
      }
      if (!Array.isArray(targets) || targets.length === 0 || !targets.every(isCubics)) {
        errors.push({
          kind: "morph_mismatch",
          member: name,
          reason: "morph targets must be a non-empty list of cubic outlines.",
        });
        return undefined;
      }
      const matchedOutcome = matchOutlines([base, ...targets]);
      if ("reason" in matchedOutcome) {
        errors.push({ kind: "morph_mismatch", member: name, reason: matchedOutcome.reason });
        return undefined;
      }
      return Object.freeze({
        kind: "morph",
        base: freezeCubics(base),
        targets: Object.freeze(targets.map(freezeCubics)),
        matched: Object.freeze(matchedOutcome.matched.map(freezeCubics)),
      });
    }
    default:
      errors.push({
        kind: "invalid_definition",
        field: "cast",
        reason: `actor "${name}" has unknown content kind ${String(kind)}.`,
      });
      return undefined;
  }
}

function isMorphContent(
  content: CompiledContent | undefined,
): content is Extract<CompiledContent, { readonly kind: "morph" }> {
  return content?.kind === "morph";
}

function isReadoutContent(
  content: CompiledContent | undefined,
): content is Extract<CompiledContent, { readonly kind: "readout" }> {
  return content?.kind === "readout";
}

/** Validates and compiles a cast definition against compiled beats into runtime + review specs. */
export function compileCast(
  castInput: unknown,
  beats: CompiledBeats,
):
  | {
      readonly ok: true;
      readonly members: CompiledMembers;
      readonly reviewMembers: readonly ReviewMemberSpec[];
    }
  | { readonly ok: false; readonly errors: readonly CastCompileError[] } {
  if (!isPlainRecord(castInput))
    return {
      ok: false,
      errors: [
        {
          kind: "invalid_definition",
          field: "cast",
          reason: "`cast` must return an object of members.",
        },
      ],
    };

  const errors: CastCompileError[] = [];
  const seen = new Set<string>();
  const entries: MemberEntry[] = [];
  const reviewMembers: ReviewMemberSpec[] = [];

  const visit = (
    record: Record<string, unknown>,
    groups: readonly string[],
    inheritedOn: readonly CompiledStretch[] | undefined,
    inheritedWatch: boolean,
    inheritedExpectation: MotionExpectation,
  ): Readonly<Record<string, CompiledMember>> => {
    const tree: Record<string, CompiledMember> = {};
    for (const [key, rawMember] of Object.entries(record)) {
      if (key.includes(".")) errors.push({ kind: "reserved_dot_in_name", name: key });
      if (seen.has(key)) errors.push({ kind: "duplicate_member", name: key });
      seen.add(key);

      if (!isPlainRecord(rawMember)) {
        errors.push({
          kind: "invalid_definition",
          field: "cast",
          reason: `member "${key}" must be created with cast builders.`,
        });
        continue;
      }

      const meta = validateMeta(
        key,
        rawMember["meta"],
        beats,
        inheritedOn,
        inheritedWatch,
        inheritedExpectation,
        errors,
      );
      const kind = rawMember["kind"];
      switch (kind) {
        case "actor": {
          const content = compileContent(key, rawMember["content"], true, errors);
          if (content === undefined) continue;
          const compiled: CompiledMember = Object.freeze({
            kind: "actor",
            name: key,
            content,
            watch: meta.watch,
            ...(meta.on === undefined ? {} : { on: meta.on }),
            ...(meta.pivot === undefined ? {} : { pivot: meta.pivot }),
          });
          tree[key] = compiled;
          entries.push(
            Object.freeze({
              name: key,
              kind: "actor",
              groups,
              watch: meta.watch,
              content,
              ...(meta.on === undefined ? {} : { on: meta.on }),
              ...(meta.pivot === undefined ? {} : { pivot: meta.pivot }),
            }),
          );
          reviewMembers.push(
            Object.freeze({
              name: key,
              kind: "actor",
              groups,
              watch: meta.watch,
              expectation: meta.expectation,
              hasMorph: content.kind === "morph",
              hasPath: content.kind === "stroke" || content.kind === "morph",
              ...(meta.on === undefined ? {} : { on: meta.on }),
            }),
          );
          break;
        }
        case "list": {
          const rawItems = rawMember["items"];
          if (!Array.isArray(rawItems)) {
            errors.push({
              kind: "invalid_definition",
              field: "cast",
              reason: `list "${key}" has malformed items.`,
            });
            continue;
          }
          const compiledItems: CompiledListItem[] = [];
          const listEntry: MemberEntry = Object.freeze({
            name: key,
            kind: "list",
            groups,
            watch: meta.watch,
            itemCount: rawItems.length,
            ...(meta.on === undefined ? {} : { on: meta.on }),
            ...(meta.pivot === undefined ? {} : { pivot: meta.pivot }),
          });
          entries.push(listEntry);
          reviewMembers.push(
            Object.freeze({
              name: key,
              kind: "list",
              groups,
              watch: meta.watch,
              expectation: meta.expectation,
              hasMorph: false,
              hasPath: false,
              ...(meta.on === undefined ? {} : { on: meta.on }),
            }),
          );
          rawItems.forEach((rawItem, index) => {
            const itemName = `${key}.${index}`;
            if (!isPlainRecord(rawItem) || rawItem["kind"] !== "actor") {
              errors.push({
                kind: "invalid_definition",
                field: "cast",
                reason: `item "${itemName}" must be an actor.`,
              });
              return;
            }
            const itemMeta = validateMeta(
              itemName,
              rawItem["meta"],
              beats,
              meta.on,
              meta.watch,
              meta.expectation,
              errors,
            );
            const content = compileContent(itemName, rawItem["content"], false, errors);
            if (content === undefined || content.kind === "readout") return;
            const compiledItem: CompiledListItem = Object.freeze({
              kind: "item",
              name: itemName,
              list: key,
              index,
              content,
              watch: itemMeta.watch,
              ...(itemMeta.on === undefined ? {} : { on: itemMeta.on }),
              ...(itemMeta.pivot === undefined ? {} : { pivot: itemMeta.pivot }),
            });
            compiledItems.push(compiledItem);
            entries.push(
              Object.freeze({
                name: itemName,
                kind: "item",
                groups,
                list: key,
                index,
                watch: itemMeta.watch,
                content,
                ...(itemMeta.on === undefined ? {} : { on: itemMeta.on }),
                ...(itemMeta.pivot === undefined ? {} : { pivot: itemMeta.pivot }),
              }),
            );
            reviewMembers.push(
              Object.freeze({
                name: itemName,
                kind: "item",
                groups,
                watch: itemMeta.watch,
                expectation: itemMeta.expectation,
                hasMorph: content.kind === "morph",
                hasPath: content.kind === "stroke" || content.kind === "morph",
                ...(itemMeta.on === undefined ? {} : { on: itemMeta.on }),
              }),
            );
          });
          tree[key] = Object.freeze({
            kind: "list",
            name: key,
            items: Object.freeze(compiledItems),
            watch: meta.watch,
            ...(meta.on === undefined ? {} : { on: meta.on }),
            ...(meta.pivot === undefined ? {} : { pivot: meta.pivot }),
          });
          break;
        }
        case "group": {
          const rawChildren = rawMember["members"];
          if (!isPlainRecord(rawChildren)) {
            errors.push({
              kind: "invalid_definition",
              field: "cast",
              reason: `group "${key}" has malformed members.`,
            });
            continue;
          }
          const groupEntryIndex = entries.length;
          const groupReviewIndex = reviewMembers.length;
          // Static on a group locks the container only; ambient propagates to children.
          const childExpectation: MotionExpectation =
            meta.expectation === "ambient" ? "ambient" : "settle";
          const children = visit(
            rawChildren,
            Object.freeze([...groups, key]),
            meta.on,
            meta.watch,
            childExpectation,
          );
          const compiledGroup: CompiledMember = Object.freeze({
            kind: "group",
            name: key,
            members: children,
            watch: meta.watch,
            ...(meta.on === undefined ? {} : { on: meta.on }),
            ...(meta.pivot === undefined ? {} : { pivot: meta.pivot }),
          });
          tree[key] = compiledGroup;
          entries.splice(
            groupEntryIndex,
            0,
            Object.freeze({
              name: key,
              kind: "group",
              groups,
              watch: meta.watch,
              ...(meta.on === undefined ? {} : { on: meta.on }),
              ...(meta.pivot === undefined ? {} : { pivot: meta.pivot }),
            }),
          );
          reviewMembers.splice(
            groupReviewIndex,
            0,
            Object.freeze({
              name: key,
              kind: "group",
              groups,
              watch: meta.watch,
              expectation: meta.expectation,
              hasMorph: false,
              hasPath: false,
              ...(meta.on === undefined ? {} : { on: meta.on }),
            }),
          );
          break;
        }
        default:
          errors.push({
            kind: "invalid_definition",
            field: "cast",
            reason: `member "${key}" has unknown kind ${String(kind)}.`,
          });
      }
    }
    return Object.freeze(tree);
  };

  const tree = visit(castInput, Object.freeze([]), undefined, false, "settle");
  if (errors.length > 0) return { ok: false, errors: Object.freeze(errors) };

  const frozenEntries = Object.freeze(entries);
  const byName = new Map(frozenEntries.map((entry) => [entry.name, entry] as const));
  const topLevel = Object.freeze(frozenEntries.filter((entry) => entry.kind !== "item"));
  const morphs = Object.freeze(
    frozenEntries.filter(
      (
        entry,
      ): entry is MemberEntry & {
        readonly content: Extract<CompiledContent, { readonly kind: "morph" }>;
      } => isMorphContent(entry.content),
    ),
  );
  const readouts = Object.freeze(
    frozenEntries.filter(
      (
        entry,
      ): entry is MemberEntry & {
        readonly content: Extract<CompiledContent, { readonly kind: "readout" }>;
      } => isReadoutContent(entry.content),
    ),
  );

  return {
    ok: true,
    members: Object.freeze({ tree, entries: frozenEntries, byName, topLevel, morphs, readouts }),
    reviewMembers: Object.freeze(reviewMembers),
  };
}

function sameStringList(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

/** Whether two compiled casts keep the same DOM/renderer tree structure, names, groups, and text. */
export function sameCast(a: CompiledMembers, b: CompiledMembers): boolean {
  if (a.entries.length !== b.entries.length) return false;
  return a.entries.every((ae, index) => {
    const be = b.entries[index];
    if (be === undefined) return false;
    if (
      ae.name !== be.name ||
      ae.kind !== be.kind ||
      ae.watch !== be.watch ||
      ae.itemCount !== be.itemCount ||
      ae.list !== be.list ||
      ae.index !== be.index ||
      !sameStringList(ae.groups, be.groups) ||
      ae.content?.kind !== be.content?.kind
    ) {
      return false;
    }
    if (ae.content?.kind === "text" && be.content?.kind === "text") {
      return ae.content.value === be.content.value;
    }
    return true;
  });
}
