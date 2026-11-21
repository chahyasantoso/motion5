import {
  POSE_2D_NUMBERS,
  VALUE_FIELDS,
  arch,
  combine,
  combine3d,
  elapsedOf,
  lanes,
  loop,
  mix,
  motion,
  scroll,
  timeAt,
  unreachable,
  watchClock,
  watchedTime,
  withProgress,
  type Ease,
  type Events,
  type InWindow,
  type LaneOrigin,
  type Lanes,
  type Motion,
  type Pose2d,
  type Pose3d,
  type Signal,
  type Span,
  type Time,
  project3d,
  unproject3d,
} from "@gerak/core";
import { boxInViewport } from "../render/placement";
import {
  WINDOW_EVENTS,
  isInputBeat,
  measuredBy,
  type Beat,
  type ScrollBeat,
  type TriggerBeat,
} from "./beat";
import {
  castBuilder,
  type CastBuilder,
  type Expect,
  type Members,
  type Spec,
  type Stretch,
} from "./cast";
import type { Element, ObjectElement, ObjectView, SceneElement } from "./elements";
import type { Carry, CarryOptions, Rest, RestReader } from "./layout";
import type {
  LayoutsInput,
  Limits,
  ListPose,
  Drive,
  Moves,
  SceneContext,
  StageDefinition,
} from "./stage";
import { compileStage, type CompileResult, type Stage } from "../run/compile";

/** What a motion reads each frame, beside the time it plays in. */
export interface MotionContext {
  /** The scene's time, before the motion's `in` and `loop` remap it. */
  readonly time: Time;
  readonly events: Events;
  /** Which part of a list element this call poses, and how many parts there are. */
  readonly index?: number;
  readonly count?: number;
  /** Which wrapped visual line this part sits on; measured from layout on a page mount, 0 headless. */
  readonly line?: number;
  readonly rest: RestReader;
  readonly carry: Carry;
  /** The name of the element being posed. */
  readonly element: string;
  /** The span the motion plays over, when it has one. */
  readonly span: Span | undefined;
  /** The pose the motions on `element` give at this scene time; `at` reads another time or part. */
  read(element: Element | string, at?: ReadAt): Pose2d;
}

/** Where `read` looks: another time, or another part of a list. */
export interface ReadAt {
  readonly time?: Time;
  readonly index?: number;
  readonly count?: number;
}

/** A core `Motion`, or a plain function from time and context to a pose. */
export type SceneMotion = (time: Time, context: MotionContext) => Pose2d;

/** Wraps the signal of every motion above it in a `.modify` call. */
export type Principle = (signal: Signal<Pose2d>) => Signal<Pose2d>;

/** A motion on an object: a core `Motion` over `Pose3d`, or a plain function from time and context to one. */
export type SceneMotion3d = (time: Time, context: MotionContext) => Pose3d;

/** Wraps the 3D signal of every motion above it on an object in a `.modify` call. */
export type Principle3d = (signal: Signal<Pose3d>) => Signal<Pose3d>;

/** Options of `sceneBuilder`: what is true of the whole piece. */
export interface SceneBuilderOptions {
  /** Optional scene label shown in ownership diagnostics. */
  readonly name?: string | undefined;
  readonly cues?: Events | undefined;
  /** The piece's length in ms; defaults to the end of the last beat. */
  readonly length?: number | undefined;
  readonly layouts?: LayoutsInput | undefined;
  /** Boxes the headless tools read in place of measured ones, by element name. */
  readonly rest?: Rest | undefined;
}

/** A piece being written; `.element` selects what to give motions, and `compileScene` makes it playable. */
export interface SceneBuilder {
  readonly kind: "scene";
  element(element: ObjectElement): ObjectStep;
  element(element: Element): ElementStep;
  /** Merges `scene`'s elements, beats and motions into this one, on one clock; nothing is selected after. */
  include(scene: SceneBuilder): SceneBuilder;
}

/** A piece with one element selected; the order of `.motion` and `.modify` calls matters. */
export interface ElementStep extends SceneBuilder {
  /** Appends motions: layer motions add by each field's rule, a `take` motion replaces its fields. */
  motion(...motions: readonly SceneMotion[]): ElementStep;
  /** Wraps everything above it in the element's list in `principle`. */
  modify(principle: Principle): ElementStep;
  /** Shows the element only during these windows: a beat, or `[from, to]` for one stretch across beats. */
  show(...windows: readonly ShowWindow[]): ElementStep;
  /** Sets review limits of this element; each field once. */
  limits(limits: Limits): ElementStep;
}

/** A piece with an object selected: its motions and principles are 3D; the order of calls matters. */
export interface ObjectStep extends SceneBuilder {
  /** Appends motions: layer motions add by each field's rule, a `take` motion replaces its fields. */
  motion(...motions: readonly SceneMotion3d[]): ObjectStep;
  /** Appends motions, a `travel` onto a page slot among them. */
  motion(...motions: readonly (SceneMotion3d | TravelMotion)[]): ObjectStep;
  /** Wraps everything above it in the object's list in `principle`. */
  modify(principle: Principle3d): ObjectStep;
  /** Shows the object only during these windows: a beat, or `[from, to]` for one stretch across beats. */
  show(...windows: readonly ShowWindow[]): ObjectStep;
  /** Sets review limits of this object, in world units; each field once. */
  limits(limits: Limits): ObjectStep;
}

/** A beat; two beats, from the start of the first to the end of the second; from a beat's start on; or until a beat's end. */
export type ShowWindow =
  | Beat
  | readonly [from: Beat, to: Beat]
  | { readonly from: Beat }
  | { readonly until: Beat };

type MotionStep = {
  readonly kind: "motion";
  readonly run: SceneMotion;
  readonly span: Span | undefined;
  readonly window: InWindow | undefined;
  readonly joins: "layer" | "take";
  readonly loops: boolean;
  readonly reads: readonly string[];
  readonly travels: boolean;
};

type Motion3dStep = {
  readonly kind: "motion3d";
  readonly run: SceneMotion3d;
  readonly span: Span | undefined;
  readonly window: InWindow | undefined;
  readonly joins: "layer" | "take";
  readonly loops: boolean;
};

type Travel3dStep = {
  readonly kind: "travel3d";
  readonly run: TravelMotion;
  readonly view: ObjectView;
  readonly span: Span | undefined;
  readonly window: InWindow | undefined;
  readonly loops: boolean;
};

type Step =
  | MotionStep
  | { readonly kind: "modify"; readonly principle: Principle }
  | Motion3dStep
  | Travel3dStep
  | { readonly kind: "modify3d"; readonly principle: Principle3d };

interface Entry {
  readonly steps: readonly Step[];
  readonly show: readonly Stretch[];
  readonly limits: Limits;
}

interface SceneOwner {
  readonly label: string;
}

interface State {
  readonly owner: SceneOwner;
  readonly options: SceneBuilderOptions;
  readonly elements: ReadonlyMap<string, SceneElement>;
  readonly order: readonly string[];
  readonly entries: ReadonlyMap<string, Entry>;
  readonly beats: ReadonlyMap<string, Beat>;
  readonly inputBeats: ReadonlyMap<string, ScrollBeat | TriggerBeat>;
  readonly current: string | undefined;
}

const NO_ENTRY: Entry = Object.freeze({ steps: [], show: [], limits: {} });

let nextSceneId = 0;
const OWNERS = new WeakMap<SceneElement, SceneOwner>();
const READS = new WeakMap<object, readonly string[]>();
const TRAVEL_TARGETS = new WeakMap<object, readonly Element[]>();
const PART_LINES = new WeakMap<MotionContext, readonly number[]>();
const BELOW_POSE = new WeakMap<MotionContext, Pose2d>();
/** An object's travel: its view and the pose under it, and the world position the travel answers. */
const OBJECT_TRAVEL = new WeakMap<
  MotionContext,
  { readonly view: ObjectView; readonly below: Pose3d; out: Pose3d | undefined }
>();
const MOTION_BODY = Symbol.for("@gerak/core/motion-body");

interface MotionBody {
  readonly fn: (time: Time, context?: MotionContext) => Pose2d;
  readonly ease: Ease | undefined;
  readonly period: number | undefined;
}

function isMotionBody(value: unknown): value is MotionBody {
  if (typeof value !== "object" || value === null) return false;
  const fn: unknown = Reflect.get(value, "fn");
  const ease: unknown = Reflect.get(value, "ease");
  const period: unknown = Reflect.get(value, "period");
  return (
    typeof fn === "function" &&
    (ease === undefined || typeof ease === "function") &&
    (period === undefined || typeof period === "number")
  );
}

function motionBodyOf(run: Motion<Pose2d, MotionContext>): MotionBody | undefined {
  const body: unknown = Reflect.get(run, MOTION_BODY);
  return isMotionBody(body) ? body : undefined;
}

function need(context: MotionContext | undefined, who: string): MotionContext {
  if (context === undefined)
    throw new TypeError(`${who}: a scene motion needs the scene's context.`);
  return context;
}

function withMeta(
  base: Motion<Pose2d, MotionContext>,
  reads: readonly string[],
  targets: readonly Element[],
): Motion<Pose2d, MotionContext> {
  const wrapped = Object.assign((time: Time, context?: MotionContext) => base(time, context), {
    span: base.span,
    window: base.window,
    period: base.period,
    joins: base.joins,
    isAmbient: base.isAmbient,
    in: (window: InWindow, ease?: Ease) => withMeta(base.in(window, ease), reads, targets),
    loop: (ms: number) => withMeta(base.loop(ms), reads, targets),
    take: () => withMeta(base.take(), reads, targets),
    ambient: () => withMeta(base.ambient(), reads, targets),
  });
  const body: unknown = Reflect.get(base, MOTION_BODY);
  if (body !== undefined) Object.defineProperty(wrapped, MOTION_BODY, { value: body });
  Object.freeze(wrapped);
  if (reads.length > 0) READS.set(wrapped, reads);
  if (targets.length > 0) TRAVEL_TARGETS.set(wrapped, targets);
  return wrapped;
}

/** The fields `bind` sets: any numeric field of a pose. */
export type BoundFields = { readonly [K in (typeof POSE_2D_NUMBERS)[number]]?: Signal<number> };

/** A motion setting each field from its signal at the scene's time. */
export function bind(fields: BoundFields): Motion<Pose2d, MotionContext> {
  return motion((_time, context?: MotionContext) => {
    const { time, events } = need(context, "bind");
    const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
    for (const key of POSE_2D_NUMBERS) {
      const signal = fields[key];
      if (signal !== undefined) out[key] = signal(time, events);
    }
    return out;
  });
}

/** The fields `bindEach` sets: each maps a part's index to its signal. */
export type BoundEachFields = {
  readonly [K in (typeof POSE_2D_NUMBERS)[number]]?: (index: number) => Signal<number>;
};

/** A motion setting each field of each part of a list element from that part's signal at the scene's time. */
export function bindEach(fields: BoundEachFields): Motion<Pose2d, MotionContext> {
  return motion((_time, context?: MotionContext) => {
    const { time, events, index } = need(context, "bindEach");
    if (index === undefined)
      throw new TypeError("bindEach: this element has no parts; use `bind` instead.");
    const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
    for (const key of POSE_2D_NUMBERS) {
      const signal = fields[key];
      if (signal !== undefined) out[key] = signal(index)(time, events);
    }
    return out;
  });
}

/** Which part of a staggered list starts first. */
export type StaggerFrom = Exclude<LaneOrigin, { readonly seed: number }>;

/** Whether `stagger` orders lanes by part index or by measured visual line. */
export type StaggerBy = "index" | "line";

/** Settings of `stagger`: `spread` is the gap between starts in lane lengths, `from` is origin, `by` is order. */
export interface StaggerOptions {
  readonly spread: number;
  readonly from?: StaggerFrom | undefined;
  readonly by?: StaggerBy | undefined;
}

function orderLines(values: readonly number[], from: StaggerFrom): readonly number[] {
  switch (from) {
    case "start":
      return values;
    case "end":
      return values.map((line) => -line);
    case "center":
    case "edges": {
      const distinct = [...new Set(values)].sort((a, b) => a - b);
      const mid = (distinct.length - 1) / 2;
      return values.map((line) => {
        const dist = Math.abs(distinct.indexOf(line) - mid);
        return from === "center" ? dist : -dist;
      });
    }
    default:
      return unreachable(from);
  }
}

function isMotion(
  value:
    | Motion<Pose2d, MotionContext>
    | ((index: number, count: number) => Motion<Pose2d, MotionContext>),
): value is Motion<Pose2d, MotionContext> {
  return "joins" in value;
}

/** Plays `inner` on each part of a list element in its own lane; without parts it plays as it is.
 * A function builds each part's motion from `(index, count)`; its traits come from `(0, 1)`. */
export function stagger(
  inner: Motion<Pose2d, MotionContext>,
  options: StaggerOptions,
): Motion<Pose2d, MotionContext>;
export function stagger(
  inner: (index: number, count: number) => Motion<Pose2d, MotionContext>,
  options: StaggerOptions,
): Motion<Pose2d, MotionContext>;
export function stagger(
  inner:
    | Motion<Pose2d, MotionContext>
    | ((index: number, count: number) => Motion<Pose2d, MotionContext>),
  options: StaggerOptions,
): Motion<Pose2d, MotionContext> {
  const build = isMotion(inner) ? () => inner : inner;
  const first = build(0, 1);
  const { span, window } = first;
  const outer = span ?? window;
  const by = options.by ?? "index";
  const from = options.from ?? "start";
  const parts = new Map<string, Motion<Pose2d, MotionContext>>();
  const partOf = (index: number, count: number): Motion<Pose2d, MotionContext> => {
    const key = `${index}/${count}`;
    const held = parts.get(key) ?? build(index, count);
    parts.set(key, held);
    return held;
  };
  const byIndex = new Map<number, Lanes>();
  const byLine = new Map<string, Lanes>();
  const byLineList = new WeakMap<readonly number[], Lanes>();
  const byFlatLine = new Map<string, Lanes>();
  const lanesOf = (count: number, context: MotionContext): Lanes => {
    switch (by) {
      case "index": {
        const held =
          byIndex.get(count) ?? lanes(Array<number>(count).fill(1), options.spread, { from });
        byIndex.set(count, held);
        return held;
      }
      case "line": {
        const raw = PART_LINES.get(context);
        const known = raw === undefined ? undefined : byLineList.get(raw);
        if (known !== undefined && raw?.length === count) return known;
        if (raw === undefined || raw.length !== count) {
          const flat = `${count}@${context.line ?? 0}`;
          const held = byFlatLine.get(flat);
          if (held !== undefined) return held;
        }
        const lines =
          raw !== undefined && raw.length === count
            ? raw
            : Array<number>(count).fill(context.line ?? 0);
        const key = `${count}:${lines.join(",")}`;
        const built =
          byLine.get(key) ??
          lanes(Array<number>(count).fill(1), options.spread, { by: orderLines(lines, from) });
        if (!byLine.has(key)) {
          if (byLine.size >= 16) byLine.clear();
          byLine.set(key, built);
        }
        if (raw === lines) byLineList.set(raw, built);
        else byFlatLine.set(`${count}@${context.line ?? 0}`, built);
        return built;
      }
      default:
        return unreachable(by);
    }
  };
  const place = (time: Time, own: Span | undefined): Time =>
    own === undefined ? time : timeAt(time, own.at(time.progress));
  const runBody = (
    part: Motion<Pose2d, MotionContext>,
    time: Time,
    context: MotionContext,
  ): Pose2d => {
    const body = motionBodyOf(part);
    if (body === undefined) return part(time, context);
    const cycled = body.period === undefined ? time : loop(body.period).of(time);
    const eased =
      body.ease === undefined ? cycled : withProgress(cycled, body.ease(cycled.progress));
    return body.fn(eased, context);
  };
  const play = motion((time, context?: MotionContext) => {
    const here = need(context, "stagger");
    const { index, count } = here;
    if (index === undefined || count === undefined) {
      if (span === undefined && window !== undefined) return runBody(first, time, here);
      return first(place(time, span), here);
    }
    const part = partOf(index, count);
    const laned = lanesOf(count, here).of(time, index);
    if (part.span === undefined && part.window !== undefined) return runBody(part, laned, here);
    return part(place(laned, part.span), here);
  });
  const timed = outer === undefined ? play : play.in(outer);
  const taken = first.joins === "take" ? timed.take() : timed;
  const marked = first.isAmbient || first.period !== undefined ? taken.ambient() : taken;
  const reads = READS.get(first) ?? [];
  const targets = TRAVEL_TARGETS.get(first) ?? [];
  return reads.length === 0 && targets.length === 0 ? marked : withMeta(marked, reads, targets);
}

function poseDelta(before: Pose2d, now: Pose2d): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = {};
  for (const key of POSE_2D_NUMBERS) {
    const was = before[key];
    const is = now[key];
    if (was === undefined && is === undefined) continue;
    const { combines } = VALUE_FIELDS[key];
    switch (combines) {
      case "add":
        out[key] = (is ?? 0) - (was ?? 0);
        break;
      case "multiply":
        out[key] = (is ?? 1) / (was === undefined || was === 0 ? 1 : was);
        break;
      case "replace":
        if (is !== undefined) out[key] = is;
        break;
      default:
        return unreachable(combines);
    }
  }
  const custom: Record<string, number> = {};
  for (const [name, value] of Object.entries(now.custom ?? {}))
    custom[name] = value - (before.custom?.[name] ?? 0);
  if (Object.keys(custom).length > 0) out.custom = custom;
  return out;
}

/** A motion giving the change in `element`'s pose since the start of its own clock span; it reads `element`. */
export function stayWith(element: Element): Motion<Pose2d, MotionContext> {
  const base = motion((time, context?: MotionContext) => {
    const here = need(context, "stayWith");
    const start = here.span?.from ?? 0;
    const now = start + (elapsedOf(time.clock) ?? 0);
    return poseDelta(
      here.read(element, { time: timeAt(here.time, start), ...indexOf(here) }),
      here.read(element, { time: timeAt(here.time, now), ...indexOf(here) }),
    );
  });
  return withMeta(base, [element.name], []);
}

/** Options of `travel`: target slot element, optional perpendicular arc bend in px, and how it fits the slot. */
export interface TravelOptions {
  readonly to: Element;
  /** Perpendicular bow at mid-travel in px, 0 at both ends (default 0). */
  readonly arc?: number | undefined;
  /** `"contain"` (default) scales evenly to fit inside the slot, centred; `"fill"` stretches to its box. */
  readonly fit?: "contain" | "fill" | undefined;
}

function isElement(value: unknown): value is Element {
  if (typeof value !== "object" || value === null) return false;
  const kind: unknown = Reflect.get(value, "kind");
  const name: unknown = Reflect.get(value, "name");
  const opts: unknown = Reflect.get(value, "options");
  return (
    (kind === "box" || kind === "shape" || kind === "text" || kind === "group") &&
    typeof name === "string" &&
    name !== "" &&
    typeof opts === "object" &&
    opts !== null
  );
}

/** What `travel` returns: a motion on an element, which an object with a view also takes. */
export interface TravelMotion extends Motion<Pose2d, MotionContext> {
  readonly travel: TravelOptions;
  in(window: InWindow, ease?: Ease): TravelMotion;
  loop(ms: number): TravelMotion;
  take(): TravelMotion;
  ambient(): TravelMotion;
}

function travelMotion(base: Motion<Pose2d, MotionContext>, options: TravelOptions): TravelMotion {
  const wrapped: TravelMotion = Object.assign(
    (time: Time, context?: MotionContext) => base(time, context),
    {
      span: base.span,
      window: base.window,
      period: base.period,
      joins: base.joins,
      isAmbient: base.isAmbient,
      travel: options,
      in: (window: InWindow, ease?: Ease) => travelMotion(base.in(window, ease), options),
      loop: (ms: number) => travelMotion(base.loop(ms), options),
      take: () => travelMotion(base.take(), options),
      ambient: () => travelMotion(base.ambient(), options),
    },
  );
  const body: unknown = Reflect.get(base, MOTION_BODY);
  if (body !== undefined) Object.defineProperty(wrapped, MOTION_BODY, { value: body });
  Object.freeze(wrapped);
  TRAVEL_TARGETS.set(wrapped, [options.to]);
  return wrapped;
}

/** An object's travel at progress `p`: toward the slot's centre on the canvas at its starting depth;
 * undefined while a box is unmeasured or the start is behind the lens. */
function travelled3d(
  view: ObjectView,
  below: Pose3d,
  here: MotionContext,
  to: Element,
  p: number,
): Pose3d | undefined {
  if (p === 0 || !here.rest.has(to.name) || !here.rest.has(view.canvas.name)) return undefined;
  const scrollY = scroll.y(here.time, here.events);
  const slot = boxInViewport(here.rest.get(to.name), scrollY);
  const canvas = boxInViewport(here.rest.get(view.canvas.name), scrollY);
  if (!(canvas.width > 0 && canvas.height > 0)) return undefined;
  const size = { width: canvas.width, height: canvas.height };
  const point = {
    x: slot.x - (canvas.x - canvas.width / 2),
    y: slot.y - (canvas.y - canvas.height / 2),
  };
  const start = { x: below.x ?? 0, y: below.y ?? 0, z: below.z ?? 0 };
  const seen = project3d(start, view.lens, size);
  if (!seen.visible) return undefined;
  const end = unproject3d(point, view.lens, size, seen.depth);
  if (p === 1) return end;
  return { x: mix(start.x, end.x, p), y: mix(start.y, end.y, p), z: mix(start.z, end.z, p) };
}

/** Moves an element from its current pose into `options.to`'s measured box over its beat, evenly scaled unless
 * `fit: "fill"`; with no window on a live or untimed clock it sits there. */
export function travel(options: TravelOptions): TravelMotion {
  if (typeof options !== "object" || options === null || !isElement(options.to))
    throw new TypeError("travel: `to` must be a target element.");
  const { to, arc: bend = 0, fit = "contain" } = options;
  if (!Number.isFinite(bend))
    throw new RangeError(`travel: \`arc\` must be a finite number of px, not ${bend}.`);
  if (fit !== "contain" && fit !== "fill")
    throw new TypeError(`travel: \`fit\` must be "contain" or "fill", not ${String(fit)}.`);
  const base = motion((time, context?: MotionContext): Pose2d => {
    const here = need(context, "travel");
    const object = OBJECT_TRAVEL.get(here);
    if (object !== undefined) {
      object.out = travelled3d(object.view, object.below, here, to, time.progress);
      return {};
    }
    const prev = BELOW_POSE.get(here);
    const p = time.progress;
    if (p === 0) return {};
    const ownName = here.index === undefined ? here.element : `${here.element}.${here.index}`;
    if (!here.rest.has(ownName) || !here.rest.has(to.name)) return {};
    const scrollY = scroll.y(here.time, here.events);
    const own = boxInViewport(here.rest.get(ownName), scrollY);
    const target = boxInViewport(here.rest.get(to.name), scrollY);
    const fromX = prev?.x ?? 0;
    const fromY = prev?.y ?? 0;
    const toX = target.x - own.x;
    const toY = target.y - own.y;
    let x = p === 1 ? toX : mix(fromX, toX, p);
    let y = p === 1 ? toY : mix(fromY, toY, p);
    if (bend !== 0 && p !== 1) {
      const dx = toX - fromX;
      const dy = toY - fromY;
      const length = Math.hypot(dx, dy);
      if (length > 0) {
        const push = bend * arch(p);
        x -= (dy / length) * push;
        y += (dx / length) * push;
      }
    }
    if (!(own.width > 0 && own.height > 0 && target.width > 0 && target.height > 0)) {
      return { x, y };
    }
    const across = target.width / own.width;
    const down = target.height / own.height;
    let toScaleX: number;
    let toScaleY: number;
    switch (fit) {
      case "contain":
        toScaleX = Math.min(across, down);
        toScaleY = toScaleX;
        break;
      case "fill":
        toScaleX = across;
        toScaleY = down;
        break;
      default:
        return unreachable(fit);
    }
    const uniform = prev?.scale ?? 1;
    const fromScaleX = uniform * (prev?.scaleX ?? 1);
    const fromScaleY = uniform * (prev?.scaleY ?? 1);
    return {
      x,
      y,
      scaleX: p === 1 ? toScaleX : mix(fromScaleX, toScaleX, p),
      scaleY: p === 1 ? toScaleY : mix(fromScaleY, toScaleY, p),
    };
  });
  return travelMotion(base, Object.freeze({ to, arc: bend, fit }));
}

function indexOf(context: MotionContext): { readonly index?: number } {
  return context.index === undefined ? {} : { index: context.index };
}

/** A motion giving the element's move from its box in the last layout to its box in the next.
 * A part of a list uses its box named `<element>.<index>`. */
export function carry(options: CarryOptions): Motion<Pose2d, MotionContext> {
  return motion((_time, context?: MotionContext) => {
    const here = need(context, "carry");
    const member = here.index === undefined ? here.element : `${here.element}.${here.index}`;
    return here.carry(member, options);
  });
}

function isWindow(value: unknown): value is InWindow {
  return (
    typeof value === "object" && value !== null && typeof Reflect.get(value, "of") === "function"
  );
}

function traitsOf(run: SceneMotion | SceneMotion3d | TravelMotion): {
  span: Span | undefined;
  window: InWindow | undefined;
  joins: "layer" | "take";
  loops: boolean;
} {
  const rawSpan: unknown = Reflect.get(run, "span");
  const rawWindow: unknown = Reflect.get(run, "window");
  const joins: unknown = Reflect.get(run, "joins");
  const period: unknown = Reflect.get(run, "period");
  const span = isSpan(rawSpan) ? rawSpan : undefined;
  const window = isWindow(rawWindow) ? rawWindow : span;
  return {
    span,
    window,
    joins: joins === "take" ? "take" : "layer",
    loops: typeof period === "number" || Reflect.get(run, "isAmbient") === true,
  };
}

function isSpan(value: unknown): value is Span {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof Reflect.get(value, "from") === "number" &&
    typeof Reflect.get(value, "to") === "number"
  );
}

function beatOf(value: unknown): Beat | undefined {
  if (!isSpan(value)) return undefined;
  const name: unknown = Reflect.get(value, "name");
  return typeof name === "string" ? { ...value, name } : undefined;
}

function describe(element: SceneElement): string {
  return `"${element.name}" (${element.kind})`;
}

/** The owner each included scene's owner was merged into. */
const INCLUDED_IN = new WeakMap<SceneOwner, SceneOwner>();

/** Whether `owner` is `held` or took it in, directly or through scenes it included. */
function owns(owner: SceneOwner, held: SceneOwner): boolean {
  for (let at: SceneOwner | undefined = held; at !== undefined; at = INCLUDED_IN.get(at))
    if (at === owner) return true;
  return false;
}

const SCENE_OPTIONS = ["cues", "length", "layouts", "rest"] as const;

/** `.include` for a state: merges another scene's state into it. */
function includeOf(state: State): SceneBuilder["include"] {
  return (scene) => {
    const other = isScene(scene) ? stateOf(scene) : undefined;
    if (other === undefined)
      throw new TypeError("sceneBuilder: `.include` takes what `sceneBuilder` returns.");
    const named = `scene "${other.owner.label}"`;
    if (owns(state.owner, other.owner))
      throw new TypeError(`sceneBuilder: ${named} is already in "${state.owner.label}".`);
    const merged = INCLUDED_IN.get(other.owner);
    if (merged !== undefined)
      throw new TypeError(`sceneBuilder: ${named} is already included in "${merged.label}".`);
    for (const option of SCENE_OPTIONS)
      if (other.options[option] !== undefined)
        throw new TypeError(
          `sceneBuilder: ${named} sets \`${option}\`; only the scene that is mounted sets it.`,
        );
    const elements = new Map(state.elements);
    for (const [name, element] of other.elements) {
      const held = elements.get(name);
      if (held !== undefined && held !== element)
        throw new TypeError(
          `sceneBuilder: ${describe(element)} of ${named} takes the name of ${describe(held)}.`,
        );
      elements.set(name, element);
    }
    const beats = new Map(state.beats);
    const inputBeats = new Map(state.inputBeats);
    for (const beat of other.beats.values()) withBeat(beats, inputBeats, beat);
    for (const beat of other.inputBeats.values()) withInputBeat(beats, inputBeats, beat);
    const next: State = {
      ...state,
      elements,
      order: [...state.order, ...other.order.filter((name) => !state.order.includes(name))],
      entries: new Map([...state.entries, ...other.entries]),
      beats,
      inputBeats,
      current: undefined,
    };
    const loop = loopOf(next.entries);
    if (loop !== undefined)
      throw new RangeError(`sceneBuilder: elements read each other in a loop: ${loop.join(", ")}.`);
    INCLUDED_IN.set(other.owner, state.owner);
    return kept({ kind: "scene", element: elementOf(next), include: includeOf(next) }, next);
  };
}

function validateRegistration(
  elements: ReadonlyMap<string, SceneElement>,
  owner: SceneOwner,
  element: SceneElement,
  staged: Map<string, SceneElement>,
): void {
  const held = elements.get(element.name) ?? staged.get(element.name);
  if (held !== undefined && held !== element)
    throw new TypeError(
      `sceneBuilder: element ${describe(held)} is already in the piece; ${describe(element)} cannot take its name.`,
    );
  const existingOwner = OWNERS.get(element);
  if (existingOwner !== undefined && !owns(owner, existingOwner))
    throw new TypeError(
      `sceneBuilder: element ${describe(element)} already belongs to "${existingOwner.label}" and cannot join "${owner.label}".`,
    );
  staged.set(element.name, element);
  if (element.kind === "group")
    for (const child of element.children) validateRegistration(elements, owner, child, staged);
}

function register(
  elements: Map<string, SceneElement>,
  owner: SceneOwner,
  element: SceneElement,
): void {
  const staged = new Map<string, SceneElement>();
  validateRegistration(elements, owner, element, staged);
  for (const [name, entry] of staged) {
    elements.set(name, entry);
    OWNERS.set(entry, owner);
  }
}

/** The elements whose edges a scroll or trigger beat reads; using one adds it to the piece. */
function edgeElementsOf(window: ScrollBeat | TriggerBeat): readonly Element[] {
  let points;
  switch (window.kind) {
    case "scroll-beat":
      points = [window.from, window.to];
      break;
    case "trigger-beat":
      points = [window.when.point];
      break;
    default:
      return unreachable(window);
  }
  return points.map(measuredBy).filter(isElement);
}

function withBeat(
  beats: Map<string, Beat>,
  inputBeats: Map<string, ScrollBeat | TriggerBeat>,
  beat: Beat,
): void {
  if (inputBeats.has(beat.name))
    throw new RangeError(
      `sceneBuilder: beat "${beat.name}" cannot be both a clock beat and a scroll or trigger beat.`,
    );
  const held = beats.get(beat.name);
  if (held !== undefined && (held.from !== beat.from || held.to !== beat.to))
    throw new RangeError(
      `sceneBuilder: beat "${beat.name}" is ${held.from}-${held.to} ms in one place and ${beat.from}-${beat.to} ms in another.`,
    );
  beats.set(beat.name, beat);
}

function withInputBeat(
  beats: Map<string, Beat>,
  inputBeats: Map<string, ScrollBeat | TriggerBeat>,
  beat: ScrollBeat | TriggerBeat,
): void {
  if (beats.has(beat.name))
    throw new RangeError(
      `sceneBuilder: beat "${beat.name}" cannot be both a clock beat and a scroll or trigger beat.`,
    );
  const held = inputBeats.get(beat.name);
  if (held !== undefined && held !== beat)
    throw new RangeError(
      `sceneBuilder: beat "${beat.name}" is already defined by another scroll or trigger beat.`,
    );
  inputBeats.set(beat.name, beat);
}

function reachable(graph: ReadonlyMap<string, ReadonlySet<string>>, from: string): Set<string> {
  const seen = new Set<string>();
  const pending = [...(graph.get(from) ?? [])];
  for (let next = pending.pop(); next !== undefined; next = pending.pop()) {
    if (seen.has(next)) continue;
    seen.add(next);
    pending.push(...(graph.get(next) ?? []));
  }
  return seen;
}

function loopOf(entries: ReadonlyMap<string, Entry>): readonly string[] | undefined {
  const graph = new Map<string, ReadonlySet<string>>();
  for (const [name, entry] of entries) {
    const reads = new Set<string>();
    for (const step of entry.steps)
      if (step.kind === "motion") for (const read of step.reads) reads.add(read);
    graph.set(name, reads);
  }
  for (const start of graph.keys()) {
    if (!reachable(graph, start).has(start)) continue;
    return [...graph.keys()].filter(
      (name) =>
        name === start || (reachable(graph, start).has(name) && reachable(graph, name).has(start)),
    );
  }
  return undefined;
}

function expectOf(entry: Entry): Expect {
  if (entry.steps.length === 0) return "static";
  const loops = entry.steps.some(
    (step) => (step.kind === "motion" || step.kind === "motion3d") && step.loops,
  );
  return loops ? "ambient" : "settle";
}

function baseSpec(
  element: SceneElement,
  m: CastBuilder<string>,
  children: (child: Element) => Spec,
): Spec {
  switch (element.kind) {
    case "object":
      return m.object();
    case "box":
      return element.parts === true ? m.many() : m.box();
    case "shape": {
      const { outline } = element;
      return outline.kind === "path"
        ? m.stroke(outline.path)
        : m.morph(outline.base, outline.targets);
    }
    case "text": {
      const { content, split } = element;
      if (typeof content === "function") return m.readout(content);
      if (split === undefined) return m.text();
      switch (split) {
        case "letters":
          return m.letters();
        case "words":
          return m.words();
        default:
          return unreachable(split);
      }
    }
    case "group":
      return m.group(
        Object.fromEntries(element.children.map((child) => [child.name, children(child)])),
      );
    default:
      return unreachable(element);
  }
}

function hasParts(element: SceneElement): boolean {
  switch (element.kind) {
    case "box":
      return element.parts === true;
    case "text":
      return element.split !== undefined;
    case "shape":
    case "group":
    case "object":
      return false;
    default:
      return unreachable(element);
  }
}

function castOf(state: State, m: CastBuilder<string>): Members {
  for (const entry of state.entries.values())
    for (const step of entry.steps)
      if (step.kind === "motion")
        for (const read of step.reads)
          if (!state.elements.has(read))
            throw new TypeError(
              `sceneBuilder: a motion reads "${read}", which is not an element of the piece.`,
            );
  const nested = new Set<string>();
  for (const element of state.elements.values())
    if (element.kind === "group") for (const child of element.children) nested.add(child.name);
  const specOf = (element: SceneElement): Spec => {
    const entry = state.entries.get(element.name) ?? NO_ENTRY;
    const { watch } = element.kind === "object" ? {} : element.options;
    let out = baseSpec(element, m, (child) => specOf(child));
    if (entry.show.length > 0) out = out.showing(entry.show);
    if (watch !== undefined) out = out.watch(watch);
    const expect = expectOf(entry);
    switch (expect) {
      case "static":
        return out.static();
      case "ambient":
        return out.ambient();
      case "settle":
        return out.settle();
      default:
        return unreachable(expect);
    }
  };
  const members: Record<string, Spec> = {};
  for (const name of state.order) {
    const element = state.elements.get(name);
    if (element !== undefined && !nested.has(name)) members[name] = specOf(element);
  }
  return members;
}

interface Plan {
  readonly name: string;
  readonly parts: boolean;
  readonly object: boolean;
  readonly steps: readonly Step[];
}

interface Env {
  readonly plans: ReadonlyMap<string, Plan>;
  readonly rest: RestReader;
  readonly carry: Carry;
  readonly counts: Readonly<Record<string, number>> | undefined;
  readonly lines: Readonly<Record<string, readonly number[]>> | undefined;
  /** Poses `read` already computed this frame, by element, part and time. */
  readonly read: Map<string, { readonly events: Events; readonly pose: Pose2d }>;
  /** Filled as elements run: which can change with the clock alone. */
  readonly moves: Map<string, Moves> | undefined;
  /** Filled as elements run: what drives each. */
  readonly drives: Map<string, Drive> | undefined;
}

const MORE: Drive = Object.freeze({ kind: "more" });

/** One drive for two: equal ones stay, and any two that differ are `more`. */
function joinDrive(held: Drive, next: Drive): Drive {
  switch (held.kind) {
    case "more":
      return held;
    case "scroll":
      if (next.kind !== "scroll") return MORE;
      if (next.beats.every((beat) => held.beats.includes(beat))) return held;
      return { kind: "scroll", beats: [...held.beats, ...next.beats] };
    case "trigger":
      return next.kind === "trigger" && next.beat === held.beat ? held : MORE;
    default:
      return unreachable(held);
  }
}

function noteDrive(map: Map<string, Drive> | undefined, name: string, drive: Drive): void {
  if (map === undefined) return;
  const held = map.get(name);
  map.set(name, held === undefined ? drive : joinDrive(held, drive));
}

/** What a step's window drives it by: a scroll beat without `smooth`, a trigger beat, or more. */
function driveOf(step: {
  readonly loops: boolean;
  readonly travels: boolean;
  readonly window: InWindow | undefined;
}): Drive {
  const window = step.window;
  if (step.loops || step.travels || !isInputBeat(window)) return MORE;
  switch (window.kind) {
    case "scroll-beat":
      return window.smooth ? MORE : { kind: "scroll", beats: [window] };
    case "trigger-beat":
      return { kind: "trigger", beat: window };
    default:
      return unreachable(window);
  }
}

function note(moves: Map<string, Moves> | undefined, name: string, kind: Moves): void {
  if (moves === undefined) return;
  if (kind === "time" || !moves.has(name)) moves.set(name, kind);
}

/** How a motion step can change with no new input at `time`, or undefined when only input moves it. */
function movesOf(
  step: { readonly loops: boolean; readonly window: InWindow | undefined },
  time: Time,
  context: unknown,
): Moves | undefined {
  if (step.loops) return "time";
  const window = step.window;
  if (window === undefined) return undefined;
  if (isSpan(window)) {
    const now = elapsedOf(time.clock);
    return now !== undefined && now < window.to ? "time" : undefined;
  }
  if (typeof window.moving === "function") return window.moving(time, context) ? "time" : undefined;
  return "maybe";
}

/** The context a motion sees: its time tells the clock watcher, `carry` counts as `maybe`, reading
 * an element moves this one with it, and `other` hears a read of events, `carry` or `read`. */
function watched(
  context: MotionContext,
  seen: () => void,
  readOf: (target: string) => void,
  other: () => void,
): MotionContext {
  const time = watchedTime(context.time);
  const seenBy: MotionContext = {
    time,
    get events() {
      other();
      return context.events;
    },
    rest: context.rest,
    get carry() {
      seen();
      other();
      return context.carry;
    },
    element: context.element,
    span: context.span,
    read: (target, at) => {
      const pose = context.read(target, at);
      readOf(typeof target === "string" ? target : target.name);
      other();
      return pose;
    },
    ...(context.index === undefined ? {} : { index: context.index }),
    ...(context.count === undefined ? {} : { count: context.count }),
    ...(context.line === undefined ? {} : { line: context.line }),
  };
  Object.defineProperty(seenBy, WINDOW_EVENTS, { value: context.events });
  return seenBy;
}

function replacing(below: Pose2d, pose: Pose2d): Pose2d {
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = { ...below };
  for (const key of POSE_2D_NUMBERS) {
    const value = pose[key];
    if (value !== undefined) out[key] = value;
  }
  if (pose.anchor !== undefined) out.anchor = pose.anchor;
  if (pose.custom !== undefined) out.custom = { ...below.custom, ...pose.custom };
  return out;
}

function joinTravel(below: Pose2d, pose: Pose2d): Pose2d {
  const moves = pose.x !== undefined || pose.y !== undefined;
  const sizes = pose.scaleX !== undefined || pose.scaleY !== undefined;
  if (!moves && !sizes) return below;
  const out: { -readonly [K in keyof Pose2d]: Pose2d[K] } = { ...below };
  if (pose.x !== undefined) out.x = pose.x;
  if (pose.y !== undefined) out.y = pose.y;
  if (sizes) {
    delete out.scale;
    delete out.scaleX;
    delete out.scaleY;
    if (pose.scaleX !== undefined && pose.scaleX !== 1) out.scaleX = pose.scaleX;
    if (pose.scaleY !== undefined && pose.scaleY !== 1) out.scaleY = pose.scaleY;
  }
  return out;
}

/** What `context.read` answers: another element's pose at this or another time or part, computed once a frame. */
function readerOf(env: Env, time: Time, events: Events): MotionContext["read"] {
  return (target, at) => {
    const name = typeof target === "string" ? target : target.name;
    const read = env.plans.get(name);
    if (read === undefined) throw new RangeError(`read: "${name}" is not an element of the piece.`);
    if (read.object) throw new RangeError(`read: "${name}" is an object; its pose is 3D.`);
    const part = read.parts ? (at?.index ?? 0) : undefined;
    const parts = read.parts ? (at?.count ?? env.counts?.[name] ?? 1) : undefined;
    const when = at?.time ?? time;
    const length = when.clock.kind === "timed" ? when.clock.length : "";
    const key = `${name}|${part}|${parts}|${when.clock.kind}|${elapsedOf(when.clock)}|${length}|${when.progress}`;
    const known = env.read.get(key);
    if (known !== undefined && known.events === events) return known.pose;
    const pose = stackOf(read, env, part, parts)(when, events);
    env.read.set(key, { events, pose });
    return pose;
  };
}

function replacing3d(below: Pose3d, pose: Pose3d): Pose3d {
  const out: { -readonly [K in keyof Pose3d]: Pose3d[K] } = { ...below };
  for (const [key, value] of Object.entries(pose))
    if (value !== undefined && key !== "custom") Reflect.set(out, key, value);
  if (pose.custom !== undefined) out.custom = { ...below.custom, ...pose.custom };
  return out;
}

/** An object's motions as one 3D signal: the same notes, windows and joins as an element's, over `Pose3d`. */
function stack3dOf(plan: Plan, env: Env): Signal<Pose3d> {
  let stack: Signal<Pose3d> = () => ({});
  for (const step of plan.steps) {
    const below = stack;
    switch (step.kind) {
      case "motion":
      case "modify":
        throw new TypeError(`sceneBuilder: "${plan.name}" is an object and takes only 3D motions.`);
      case "modify3d": {
        const principled = step.principle(below);
        stack = (time, events) => {
          note(env.moves, plan.name, "maybe");
          noteDrive(env.drives, plan.name, MORE);
          return principled(time, events);
        };
        break;
      }
      case "travel3d":
        stack = (time, events) => {
          const context: MotionContext = {
            time,
            events,
            rest: env.rest,
            carry: env.carry,
            element: plan.name,
            span: step.span,
            read: readerOf(env, time, events),
          };
          const moves = env.moves;
          if (moves !== undefined) {
            const kind = movesOf(step, time, context);
            if (kind !== undefined) note(moves, plan.name, kind);
          }
          noteDrive(env.drives, plan.name, MORE);
          const prev = below(time, events);
          // On a live or untimed clock a travel with no window sits on its slot, as an element's does.
          const ran =
            step.window === undefined && time.clock.kind !== "timed" ? withProgress(time, 1) : time;
          const holder: { view: ObjectView; below: Pose3d; out: Pose3d | undefined } = {
            view: step.view,
            below: prev,
            out: undefined,
          };
          OBJECT_TRAVEL.set(context, holder);
          step.run(ran, context);
          const out = holder.out;
          return out === undefined ? prev : { ...prev, ...out };
        };
        break;
      case "motion3d":
        stack = (time, events) => {
          const context: MotionContext = {
            time,
            events,
            rest: env.rest,
            carry: env.carry,
            element: plan.name,
            span: step.span,
            read: readerOf(env, time, events),
          };
          const moves = env.moves;
          const drives = env.drives;
          if (moves !== undefined) {
            const kind = movesOf(step, time, context);
            if (kind !== undefined) note(moves, plan.name, kind);
          }
          noteDrive(drives, plan.name, driveOf({ ...step, travels: false }));
          const used =
            moves === undefined && drives === undefined
              ? context
              : watched(
                  context,
                  () => note(moves, plan.name, "maybe"),
                  (target) =>
                    note(moves, plan.name, moves?.get(target) === "time" ? "time" : "maybe"),
                  () => noteDrive(drives, plan.name, MORE),
                );
          const prev = below(time, events);
          const pose =
            moves === undefined
              ? step.run(time, used)
              : watchClock(
                  (use) => note(moves, plan.name, use),
                  () => step.run(step.window === undefined ? watchedTime(time) : time, used),
                );
          switch (step.joins) {
            case "layer":
              return combine3d([prev, pose]);
            case "take": {
              const active =
                step.window !== undefined &&
                "active" in step.window &&
                typeof step.window.active === "function"
                  ? step.window.active(time, used)
                  : (elapsedOf(time.clock) ?? 0) >= (step.span?.from ?? 0);
              return active ? replacing3d(prev, pose) : prev;
            }
            default:
              return unreachable(step.joins);
          }
        };
        break;
      default:
        unreachable(step);
    }
  }
  return stack;
}

function stackOf(
  plan: Plan,
  env: Env,
  index: number | undefined,
  count: number | undefined,
): Signal<Pose2d> {
  let stack: Signal<Pose2d> = () => ({});
  for (const step of plan.steps) {
    const below = stack;
    switch (step.kind) {
      case "modify": {
        const principled = step.principle(below);
        stack = (time, events) => {
          note(env.moves, plan.name, "maybe");
          noteDrive(env.drives, plan.name, MORE);
          return principled(time, events);
        };
        break;
      }
      case "motion3d":
      case "travel3d":
      case "modify3d":
        throw new TypeError(
          `sceneBuilder: "${plan.name}" is not an object and takes no 3D motion.`,
        );
      case "motion":
        stack = (time, events) => {
          const partLines = index === undefined ? undefined : env.lines?.[plan.name];
          const line = index === undefined ? undefined : (partLines?.[index] ?? 0);
          const context: MotionContext = {
            time,
            events,
            rest: env.rest,
            carry: env.carry,
            element: plan.name,
            span: step.span,
            read: readerOf(env, time, events),
            ...(index === undefined ? {} : { index }),
            ...(count === undefined ? {} : { count }),
            ...(line === undefined ? {} : { line }),
          };
          const moves = env.moves;
          const drives = env.drives;
          if (moves !== undefined) {
            const kind = movesOf(step, time, context);
            if (kind !== undefined) note(moves, plan.name, kind);
          }
          noteDrive(drives, plan.name, driveOf(step));
          const used =
            (moves === undefined && drives === undefined) || step.travels
              ? context
              : watched(
                  context,
                  () => note(moves, plan.name, "maybe"),
                  (target) =>
                    note(moves, plan.name, moves?.get(target) === "time" ? "time" : "maybe"),
                  () => noteDrive(drives, plan.name, MORE),
                );
          if (partLines !== undefined) PART_LINES.set(used, partLines);
          const prev = below(time, events);
          if (step.travels) BELOW_POSE.set(used, prev);
          // On a live or untimed clock a travel with no window sits on its slot; a timed scene sweeps it.
          const ran =
            step.travels && step.window === undefined && time.clock.kind !== "timed"
              ? withProgress(time, 1)
              : time;
          const pose =
            moves === undefined
              ? step.run(ran, used)
              : watchClock(
                  (use) => note(moves, plan.name, use),
                  () =>
                    step.run(
                      step.window === undefined && !step.travels ? watchedTime(ran) : ran,
                      used,
                    ),
                );
          switch (step.joins) {
            case "layer":
              return step.travels ? joinTravel(prev, pose) : combine([prev, pose]);
            case "take": {
              const active =
                step.window !== undefined &&
                "active" in step.window &&
                typeof step.window.active === "function"
                  ? step.window.active(time, used)
                  : (elapsedOf(time.clock) ?? 0) >= (step.span?.from ?? 0);
              if (!active) return prev;
              return step.travels ? joinTravel(prev, pose) : replacing(prev, pose);
            }
            default:
              return unreachable(step.joins);
          }
        };
        break;
      default:
        return unreachable(step);
    }
  }
  return stack;
}

function limitsOf(state: State): Record<string, Limits> {
  const limits: Record<string, Limits> = {};
  for (const [name, entry] of state.entries)
    if (Object.keys(entry.limits).length > 0) limits[name] = entry.limits;
  return limits;
}

function definitionOf(state: State): StageDefinition {
  const ends = [...state.beats.values()].map((beat) => beat.to);
  const durationMs = state.options.length ?? (ends.length > 0 ? Math.max(...ends) : undefined);
  let plans: ReadonlyMap<string, Plan> | undefined;
  const plansOf = (): ReadonlyMap<string, Plan> => {
    plans ??= new Map(
      [...state.elements.values()].map((element) => [
        element.name,
        {
          name: element.name,
          parts: hasParts(element),
          object: element.kind === "object",
          steps: (state.entries.get(element.name) ?? NO_ENTRY).steps,
        },
      ]),
    );
    return plans;
  };
  let maxTriggerMs = 0;
  for (const inputBeat of state.inputBeats.values())
    if (inputBeat.kind === "trigger-beat" && inputBeat.ms > maxTriggerMs)
      maxTriggerMs = inputBeat.ms;
  const settleMs = maxTriggerMs > 0 ? Math.max(2000, maxTriggerMs + 200) : undefined;
  const { cues, layouts, rest } = state.options;
  return {
    kind: "stage-definition",
    beats: Object.fromEntries(
      [...state.beats]
        .sort(([, a], [, b]) => a.from - b.from)
        .map(([name, beat]) => [name, [beat.from, beat.to]]),
    ),
    limits: limitsOf(state),
    cast: (m) => castOf(state, m),
    scene: (context: SceneContext) => {
      const env: Env = {
        plans: plansOf(),
        rest: context.rest,
        carry: context.carry,
        counts: context.counts,
        lines: context.lines,
        read: new Map(),
        moves: context.moves,
        drives: context.drives,
      };
      const out: Record<string, Pose2d | Pose3d | ListPose> = {};
      for (const plan of env.plans.values()) {
        if (plan.steps.length === 0) continue;
        if (context.only !== undefined && !context.only.has(plan.name)) continue;
        out[plan.name] = plan.object
          ? stack3dOf(plan, env)(context.time, context.events)
          : !plan.parts
            ? stackOf(plan, env, undefined, undefined)(context.time, context.events)
            : (index, count) => stackOf(plan, env, index, count)(context.time, context.events);
      }
      return out;
    },
    ...(durationMs === undefined ? {} : { durationMs }),
    ...(cues === undefined ? {} : { cues }),
    ...(layouts === undefined ? {} : { layouts }),
    ...(rest === undefined ? {} : { rest }),
    ...(settleMs === undefined ? {} : { settleMs }),
  };
}

function entryOf(state: State): [string, Entry] {
  const { current } = state;
  const entry = current === undefined ? undefined : state.entries.get(current);
  if (current === undefined || entry === undefined)
    throw new TypeError("sceneBuilder: select an element with `.element` first.");
  return [current, entry];
}

function changed(state: State, change: Partial<Entry>): State {
  const [name, entry] = entryOf(state);
  return { ...state, entries: new Map(state.entries).set(name, { ...entry, ...change }) };
}

/** Where a scene keeps its state; a global symbol, so a second copy of this package reads it too. */
const SCENE = Symbol.for("@gerak/stage/scene");

function kept<T extends object>(value: T, state: State): T {
  Object.defineProperty(value, SCENE, { value: state });
  return Object.freeze(value);
}

function isState(value: unknown): value is State {
  return (
    typeof value === "object" &&
    value !== null &&
    Reflect.get(value, "elements") instanceof Map &&
    Reflect.get(value, "entries") instanceof Map &&
    Reflect.get(value, "beats") instanceof Map &&
    Reflect.get(value, "inputBeats") instanceof Map
  );
}

function stateOf(value: object): State | undefined {
  const state: unknown = Reflect.get(value, SCENE);
  return isState(state) ? state : undefined;
}

/** `.element` for a state: an object selects a 3D step, any other element a 2D one. */
function elementOf(state: State): SceneBuilder["element"] {
  function element(element: ObjectElement): ObjectStep;
  function element(element: Element): ElementStep;
  function element(element: SceneElement): ObjectStep | ElementStep {
    const next = select(state, element);
    return element.kind === "object" ? objectStep(next) : step(next);
  }
  return element;
}

function isPair(window: ShowWindow): window is readonly [from: Beat, to: Beat] {
  return Array.isArray(window);
}

/** The state after `.show(...windows)` on the selected element. */
function shown(state: State, windows: readonly ShowWindow[]): State {
  const beats = new Map(state.beats);
  const inputBeats = new Map(state.inputBeats);
  const used = (end: unknown): Beat => {
    const beat = beatOf(end);
    if (beat === undefined)
      throw new TypeError("sceneBuilder: `.show` takes beats made by `beat`.");
    withBeat(beats, inputBeats, beat);
    return beat;
  };
  const stretches = windows.map((window): Stretch => {
    if (isPair(window))
      return { kind: "beats", from: used(window[0]).name, to: used(window[1]).name };
    if ("name" in window) return { kind: "beats", from: used(window).name, to: window.name };
    if ("from" in window) return { kind: "from", from: used(window.from).name };
    return { kind: "until", until: used(window.until).name };
  });
  const [, entry] = entryOf(state);
  return { ...changed(state, { show: [...entry.show, ...stretches] }), beats, inputBeats };
}

/** The state after `.limits(limits)` on the selected element. */
function limited(state: State, limits: Limits): State {
  const [name, entry] = entryOf(state);
  for (const field of ["jump", "turn", "ratio"] as const)
    if (limits[field] !== undefined && entry.limits[field] !== undefined)
      throw new TypeError(`sceneBuilder: "${name}" sets limit \`${field}\` twice.`);
  const merged = {
    ...entry.limits,
    ...Object.fromEntries(Object.entries(limits).filter(([, value]) => value !== undefined)),
  };
  return changed(state, { limits: merged });
}

function objectStep(state: State): ObjectStep {
  return kept(
    {
      kind: "scene",
      element: elementOf(state),
      include: includeOf(state),
      motion: (...motions: readonly (SceneMotion3d | TravelMotion)[]) => {
        const beats = new Map(state.beats);
        const inputBeats = new Map(state.inputBeats);
        const [name, entry] = entryOf(state);
        const self = state.elements.get(name);
        const measured: Element[] = [];
        const added = motions.map((run): Motion3dStep | Travel3dStep => {
          if ((READS.get(run) ?? []).length > 0)
            throw new TypeError("sceneBuilder: `stayWith` is for elements, not objects.");
          const traits = traitsOf(run);
          const beat = beatOf(traits.span);
          if (beat !== undefined) withBeat(beats, inputBeats, beat);
          if (isInputBeat(traits.window)) {
            withInputBeat(beats, inputBeats, traits.window);
            for (const edge of edgeElementsOf(traits.window)) measured.push(edge);
          }
          if ("travel" in run) {
            const view = self?.kind === "object" ? self.view : undefined;
            if (view === undefined)
              throw new TypeError(
                `sceneBuilder: object "${name}" travels only with \`object(name, { view: { canvas, lens } })\`.`,
              );
            if ((run.travel.arc ?? 0) !== 0 || (run.travel.fit ?? "contain") !== "contain")
              throw new TypeError(
                `sceneBuilder: object "${name}" travels straight to the slot's centre; \`arc\` and \`fit\` are for elements.`,
              );
            if (traits.joins === "take")
              throw new TypeError(
                `sceneBuilder: object "${name}" travels as a layer; \`.take()\` is for its other motions.`,
              );
            measured.push(run.travel.to, view.canvas);
            return {
              kind: "travel3d",
              run,
              view,
              span: traits.span,
              window: traits.window,
              loops: traits.loops,
            };
          }
          return { kind: "motion3d", run, ...traits };
        });
        const elements = new Map(state.elements);
        const staged = new Map<string, SceneElement>();
        for (const target of measured) validateRegistration(elements, state.owner, target, staged);
        const base = changed(state, { steps: [...entry.steps, ...added] });
        const order = [...base.order];
        const entries = new Map(base.entries);
        for (const [added, element] of staged) {
          elements.set(added, element);
          OWNERS.set(element, state.owner);
          if (!order.includes(added)) order.push(added);
          if (!entries.has(added)) entries.set(added, NO_ENTRY);
        }
        return objectStep({ ...base, elements, order, entries, beats, inputBeats });
      },
      modify: (principle: Principle3d) => {
        const [, entry] = entryOf(state);
        return objectStep(
          changed(state, { steps: [...entry.steps, { kind: "modify3d", principle }] }),
        );
      },
      show: (...windows: readonly ShowWindow[]) => objectStep(shown(state, windows)),
      limits: (limits: Limits) => objectStep(limited(state, limits)),
    },
    state,
  );
}

function step(state: State): ElementStep {
  return kept(
    {
      kind: "scene",
      element: elementOf(state),
      include: includeOf(state),
      motion: (...motions: readonly SceneMotion[]) => {
        const beats = new Map(state.beats);
        const inputBeats = new Map(state.inputBeats);
        const travelTargets: Element[] = [];
        const added = motions.map((run): MotionStep => {
          const traits = traitsOf(run);
          const beat = beatOf(traits.span);
          if (beat !== undefined) withBeat(beats, inputBeats, beat);
          if (isInputBeat(traits.window)) {
            withInputBeat(beats, inputBeats, traits.window);
            for (const edge of edgeElementsOf(traits.window)) travelTargets.push(edge);
          }
          const reads = READS.get(run) ?? [];
          if (reads.length > 0 && traits.span === undefined && traits.window !== undefined)
            throw new TypeError(
              "stayWith: use a clock beat or no window; scroll and trigger beats have no start time in ms.",
            );
          const targets = TRAVEL_TARGETS.get(run) ?? [];
          for (const target of targets) travelTargets.push(target);
          return { kind: "motion", run, ...traits, reads, travels: targets.length > 0 };
        });
        const elements = new Map(state.elements);
        const newTargets = new Map<string, Element>();
        for (const target of travelTargets) {
          validateRegistration(elements, state.owner, target, newTargets);
        }
        const [, entry] = entryOf(state);
        const base = changed(state, { steps: [...entry.steps, ...added] });
        let order = base.order;
        let entries = base.entries;
        if (newTargets.size > 0) {
          const nextOrder = [...order];
          const nextEntries = new Map(entries);
          for (const [name, addedElement] of newTargets) {
            elements.set(name, addedElement);
            if (!nextOrder.includes(name)) nextOrder.push(name);
            if (!nextEntries.has(name)) nextEntries.set(name, NO_ENTRY);
          }
          order = nextOrder;
          entries = nextEntries;
        }
        const next = {
          ...base,
          elements,
          order,
          entries,
          beats,
          inputBeats,
        };
        const loop = loopOf(next.entries);
        if (loop !== undefined)
          throw new RangeError(
            `sceneBuilder: elements read each other in a loop: ${loop.join(", ")}.`,
          );
        for (const addedElement of newTargets.values()) OWNERS.set(addedElement, state.owner);
        return step(next);
      },
      modify: (principle: Principle) => {
        const [, entry] = entryOf(state);
        return step(changed(state, { steps: [...entry.steps, { kind: "modify", principle }] }));
      },
      show: (...windows: readonly ShowWindow[]) => step(shown(state, windows)),
      limits: (limits: Limits) => step(limited(state, limits)),
    },
    state,
  );
}

function select(state: State, element: SceneElement): State {
  const elements = new Map(state.elements);
  register(elements, state.owner, element);
  const first = !state.order.includes(element.name);
  return {
    ...state,
    elements,
    order: first ? [...state.order, element.name] : state.order,
    entries: state.entries.has(element.name)
      ? state.entries
      : new Map(state.entries).set(element.name, NO_ENTRY),
    current: element.name,
  };
}

/** Starts a piece; `compileScene` turns the chain's value into the stage the renderers play. */
export function sceneBuilder(options: SceneBuilderOptions = {}): SceneBuilder {
  nextSceneId += 1;
  const label =
    options.name !== undefined && options.name.trim() !== ""
      ? options.name
      : `scene ${nextSceneId}`;
  const state: State = {
    owner: Object.freeze({ label }),
    options,
    elements: new Map(),
    order: [],
    entries: new Map(),
    beats: new Map(),
    inputBeats: new Map(),
    current: undefined,
  };
  return kept({ kind: "scene", element: elementOf(state), include: includeOf(state) }, state);
}

/** Whether `value` is a piece written with `sceneBuilder`. */
export function isScene(value: unknown): value is SceneBuilder {
  return typeof value === "object" && value !== null && stateOf(value) !== undefined;
}

/** How a scene compiles: a wrap around each frame's poses. */
export interface CompileSceneOptions {
  readonly wrap?: ((run: Stage["scene"]) => Stage["scene"]) | undefined;
}

/** The stage a scene plays as, or every reason it cannot. */
export function compileScene(
  scene: SceneBuilder,
  options: CompileSceneOptions = {},
): CompileResult {
  const state = stateOf(scene);
  if (state === undefined)
    throw new TypeError("compileScene: expected what `sceneBuilder` returns.");
  const result = compileStage(definitionOf(state));
  const { wrap } = options;
  if (!result.ok || wrap === undefined) return result;
  return { ok: true, stage: Object.freeze({ ...result.stage, scene: wrap(result.stage.scene) }) };
}
