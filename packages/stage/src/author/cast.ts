import type { Cubic2d, Time } from "@gerak/core";
import type { ScrollPoint } from "./beat";
import type { RestReader } from "./layout";

/** What review expects of a member: it moves and settles, it keeps moving, or the scene never poses it. */
export type Expect = "settle" | "ambient" | "static";

/** A stroke's outline: fixed cubics, or cubics drawn from the rest boxes of other members. */
export type Path = readonly Cubic2d[] | ((rest: RestReader) => readonly Cubic2d[]);

/** What an actor shows; `morph` holds its base outline first, then each target outline. */
export type Content =
  | { readonly kind: "box" }
  | { readonly kind: "text" }
  | { readonly kind: "readout"; readonly format: (time: Time) => string }
  | { readonly kind: "stroke"; readonly path: Path }
  | { readonly kind: "morph"; readonly shapes: readonly (readonly Cubic2d[])[] };

/** When a member shows, as `.on` takes it: one beat, or every beat from the first to the second. */
export type OnStretch<B extends string = string> = B | readonly [B, B];

/** When a member shows: from one beat's start to another's end, from a beat's start on, or until a beat's end. */
export type Stretch<B extends string = string> =
  | { readonly kind: "beats"; readonly from: B; readonly to: B }
  | { readonly kind: "from"; readonly from: B }
  | { readonly kind: "until"; readonly until: B };

/** A stretch from what `.on` takes. */
export function stretchOf<B extends string>(on: OnStretch<B>): Stretch<B> {
  const [from, to] = typeof on === "string" ? [on, on] : on;
  return Object.freeze({ kind: "beats", from, to });
}

/** When a member shows in scroll px: bounded `[from, to)`, `{ from }`, or `{ until }`. */
export type ScrollWindow =
  | { readonly kind: "range"; readonly from: ScrollPoint; readonly to: ScrollPoint }
  | { readonly kind: "from"; readonly from: ScrollPoint }
  | { readonly kind: "until"; readonly until: ScrollPoint };

/** A member's modifiers as written. */
export interface Meta<B extends string = string> {
  readonly on?: readonly Stretch<B>[] | undefined;
  readonly onScroll?: readonly ScrollWindow[] | undefined;
  readonly watch?: boolean | undefined;
  readonly expect?: Expect | undefined;
}

/** Modifiers every member takes; each returns a new member. */
export interface Modifiers<B extends string, S> {
  /** Shows the member only during these stretches. */
  on(...stretches: OnStretch<B>[]): S;
  /** Shows the member only during these stretches, as compiled. */
  showing(stretches: readonly Stretch<B>[]): S;
  /** Shows the member only during these scroll windows. */
  showingScroll(windows: readonly ScrollWindow[]): S;
  /** Streams pointer events on the member into `scene({ events })`. */
  watch(enabled?: boolean): S;
  /** The scene never poses it. */
  static(): S;
  /** It keeps moving, like snow; a list's items inherit it. */
  ambient(): S;
  settle(): S;
}

/** One element on the stage. */
export interface ActorSpec<B extends string = string, C extends Content = Content>
  extends Modifiers<B, ActorSpec<B, C>> {
  readonly kind: "actor";
  readonly content: C;
  readonly media?: true | undefined;
  readonly meta: Meta<B>;
}

/** A row of items posed by index; the scene gives it `(index, count) => pose`. */
export interface ListSpec<B extends string = string> extends Modifiers<B, ListSpec<B>> {
  readonly kind: "list";
  readonly split?: "letters" | "words" | undefined;
  readonly meta: Meta<B>;
}

/** A Three.js object or object list: the scene gives it a `Pose3d` or `(index, count) => Pose3d`. */
export interface ObjectSpec<B extends string = string> extends Modifiers<B, ObjectSpec<B>> {
  readonly kind: "object";
  readonly parts?: boolean | undefined;
  readonly meta: Meta<B>;
}

/** Any member as written. */
export type Spec<B extends string = string> = ActorSpec<B> | ListSpec<B> | ObjectSpec<B>;

/** Members by name. */
export type Members<B extends string = string> = Readonly<Record<string, Spec<B>>>;

/** The builders `cast: (m) => ({ ... })` receives. */
export interface CastBuilder<B extends string = string> {
  box(options?: { readonly media?: boolean | undefined }): ActorSpec<B>;
  text(): ActorSpec<B>;
  /** Text the stage writes each frame from time. */
  readout(format: (time: Time) => string): ActorSpec<B, Extract<Content, { kind: "readout" }>>;
  stroke(path: Path): ActorSpec<B>;
  /** An outline the pose's `shape` blends: 0 is `base`, 1 is `targets[0]`, 1.5 is halfway to `targets[1]`. */
  morph(base: readonly Cubic2d[], targets: readonly (readonly Cubic2d[])[]): ActorSpec<B>;
  many(): ListSpec<B>;
  letters(): ListSpec<B>;
  words(): ListSpec<B>;
  object(): ObjectSpec<B>;
  objects(): ObjectSpec<B>;
}

function modifiers<B extends string, S>(
  meta: Meta<B>,
  rebuild: (meta: Meta<B>) => S,
): Modifiers<B, S> {
  const next = (change: Meta<B>): S => rebuild(Object.freeze({ ...meta, ...change }));
  return {
    on: (...stretches) => next({ on: Object.freeze(stretches.map(stretchOf)) }),
    showing: (stretches) => next({ on: Object.freeze([...stretches]) }),
    showingScroll: (windows) => next({ onScroll: Object.freeze([...windows]) }),
    watch: (enabled = true) => next({ watch: enabled }),
    static: () => next({ expect: "static" }),
    ambient: () => next({ expect: "ambient" }),
    settle: () => next({ expect: "settle" }),
  };
}

function actor<B extends string, C extends Content>(
  content: C,
  meta: Meta<B> = {},
  media?: true,
): ActorSpec<B, C> {
  return Object.freeze({
    kind: "actor",
    content,
    ...(media === true ? { media: true } : {}),
    meta,
    ...modifiers(meta, (next) => actor<B, C>(content, next, media)),
  });
}

function list<B extends string>(meta: Meta<B> = {}, split?: "letters" | "words"): ListSpec<B> {
  return Object.freeze({
    kind: "list",
    ...(split === undefined ? {} : { split }),
    meta,
    ...modifiers(meta, (next) => list<B>(next, split)),
  });
}

function objectSpec<B extends string>(meta: Meta<B> = {}, parts?: boolean): ObjectSpec<B> {
  return Object.freeze({
    kind: "object",
    ...(parts === true ? { parts: true } : {}),
    meta,
    ...modifiers(meta, (next) => objectSpec<B>(next, parts)),
  });
}

/** The cast builders; part counts and text come from the markup. */
export function castBuilder<B extends string>(): CastBuilder<B> {
  return {
    box: (options) => actor({ kind: "box" }, {}, options?.media === true ? true : undefined),
    text: () => actor({ kind: "text" }),
    readout: (format) => actor({ kind: "readout", format }),
    stroke: (path) => actor({ kind: "stroke", path }),
    morph: (base, targets) => actor({ kind: "morph", shapes: Object.freeze([base, ...targets]) }),
    many: () => list(),
    letters: () => list({}, "letters"),
    words: () => list({}, "words"),
    object: () => objectSpec(),
    objects: () => objectSpec({}, true),
  };
}
