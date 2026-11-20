import {
  POSE_2D_NUMBERS,
  VALUE_FIELDS,
  arch,
  combine,
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
  type Signal,
  type Span,
  type Time,
} from "@gerak/core";
import { boxInViewport } from "../render/placement";
import {
  isInputBeat,
  sectionsOfPoint,
  type Beat,
  type ScrollBeat,
  type SectionBinding,
  type TriggerBeat,
} from "./beat";
import {
  castBuilder,
  type ActorSpec,
  type CastBuilder,
  type Expect,
  type ItemContent,
  type Members,
  type Spec,
  type Stretch,
} from "./cast";
import type { Element } from "./elements";
import type { Carry, CarryOptions, Frame, Rest, RestReader } from "./layout";
import type {
  CompiledSection,
  DomSkinInput,
  LayoutsInput,
  Limits,
  ListPose,
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

/** Options of `sceneBuilder`: what is true of the whole piece. */
export interface SceneBuilderOptions {
  /** Optional scene label shown in ownership diagnostics. */
  readonly name?: string | undefined;
  readonly frame?: Frame | undefined;
  readonly cues?: Events | undefined;
  /** The piece's length in ms; defaults to the end of the last beat. */
  readonly length?: number | undefined;
  readonly layouts?: LayoutsInput | undefined;
  /** Boxes the headless tools read in place of measured ones, by element or section name. */
  readonly rest?: Rest | undefined;
}

/** A piece being written; `.element` selects what to give motions, and `compileScene` makes it playable. */
export interface SceneBuilder {
  readonly kind: "scene";
  element(element: Element): ElementStep;
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

/** A beat, or two beats: from the start of the first to the end of the second. */
export type ShowWindow = Beat | readonly [from: Beat, to: Beat];

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

type Step = MotionStep | { readonly kind: "modify"; readonly principle: Principle };

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
  readonly elements: ReadonlyMap<string, Element>;
  readonly order: readonly string[];
  readonly entries: ReadonlyMap<string, Entry>;
  readonly beats: ReadonlyMap<string, Beat>;
  readonly inputBeats: ReadonlyMap<string, ScrollBeat | TriggerBeat>;
  readonly sections: ReadonlyMap<string, SectionBinding>;
  readonly current: string | undefined;
}

const NO_ENTRY: Entry = Object.freeze({ steps: [], show: [], limits: {} });

let nextSceneId = 0;
const OWNERS = new WeakMap<Element, SceneOwner>();
const READS = new WeakMap<object, readonly string[]>();
const TRAVEL_TARGETS = new WeakMap<object, readonly Element[]>();
const PART_LINES = new WeakMap<MotionContext, readonly number[]>();
const BELOW_POSE = new WeakMap<MotionContext, Pose2d>();
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
    (kind === "box" ||
      kind === "shape" ||
      kind === "text" ||
      kind === "many" ||
      kind === "group") &&
    typeof name === "string" &&
    name !== "" &&
    typeof opts === "object" &&
    opts !== null
  );
}

/** Moves an element from its current pose into `options.to`'s measured box over its beat, evenly scaled unless
 * `fit: "fill"`; with no window on a live or untimed clock it sits there. */
export function travel(options: TravelOptions): Motion<Pose2d, MotionContext> {
  if (typeof options !== "object" || options === null || !isElement(options.to))
    throw new TypeError("travel: `to` must be a target element.");
  const { to, arc: bend = 0, fit = "contain" } = options;
  if (!Number.isFinite(bend))
    throw new RangeError(`travel: \`arc\` must be a finite number of px, not ${bend}.`);
  if (fit !== "contain" && fit !== "fill")
    throw new TypeError(`travel: \`fit\` must be "contain" or "fill", not ${String(fit)}.`);
  const base = motion((time, context?: MotionContext): Pose2d => {
    const here = need(context, "travel");
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
  return withMeta(base, [], [to]);
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

function traitsOf(run: SceneMotion): {
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

function describe(element: Element): string {
  return `"${element.name}" (${element.kind})`;
}

function validateRegistration(
  elements: ReadonlyMap<string, Element>,
  sections: ReadonlyMap<string, SectionBinding>,
  owner: SceneOwner,
  element: Element,
  staged: Map<string, Element>,
): void {
  const held = elements.get(element.name) ?? staged.get(element.name);
  if (held !== undefined && held !== element)
    throw new TypeError(
      `sceneBuilder: element ${describe(held)} is already in the piece; ${describe(element)} cannot take its name.`,
    );
  const existingOwner = OWNERS.get(element);
  if (existingOwner !== undefined && existingOwner !== owner)
    throw new TypeError(
      `sceneBuilder: element ${describe(element)} already belongs to "${existingOwner.label}" and cannot join "${owner.label}".`,
    );
  const sec = sections.get(element.name);
  if (sec !== undefined && element.options.node?.selector !== sec.selector)
    throw new TypeError(
      `sceneBuilder: element ${describe(element)} collides with section "${sec.name}" (${sec.selector}).`,
    );
  staged.set(element.name, element);
  if (element.kind === "group")
    for (const child of element.children)
      validateRegistration(elements, sections, owner, child, staged);
}

function register(
  elements: Map<string, Element>,
  sections: ReadonlyMap<string, SectionBinding>,
  owner: SceneOwner,
  element: Element,
): void {
  const staged = new Map<string, Element>();
  validateRegistration(elements, sections, owner, element, staged);
  for (const [name, entry] of staged) {
    elements.set(name, entry);
    OWNERS.set(entry, owner);
  }
}

function addSections(
  sections: Map<string, SectionBinding>,
  elements: ReadonlyMap<string, Element>,
  window: ScrollBeat | TriggerBeat,
): void {
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
  for (const point of points) {
    for (const sec of sectionsOfPoint(point)) {
      const prior = sections.get(sec.name);
      if (prior !== undefined && prior.selector !== sec.selector)
        throw new RangeError(
          `sceneBuilder: section "${sec.name}" uses selector "${prior.selector}" in one beat and "${sec.selector}" in another.`,
        );
      const colliding = elements.get(sec.name);
      if (colliding !== undefined && colliding.options.node?.selector !== sec.selector)
        throw new TypeError(
          `sceneBuilder: section "${sec.name}" (${sec.selector}) collides with element ${describe(colliding)}.`,
        );
      sections.set(sec.name, sec);
    }
  }
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
  const motions = entry.steps.filter((step): step is MotionStep => step.kind === "motion");
  if (entry.steps.length === 0) return "static";
  return motions.some((step) => step.loops) ? "ambient" : "settle";
}

function itemSpec(item: ItemContent, m: CastBuilder<string>): ActorSpec<string, ItemContent> {
  switch (item.kind) {
    case "box":
      return m.box();
    case "text":
      return m.text(item.value);
    case "stroke":
      return m.stroke(item.path);
    case "morph": {
      const [base, ...targets] = item.shapes;
      if (base === undefined) throw new TypeError("a morph needs a base outline.");
      return m.morph(base, targets);
    }
    default:
      return unreachable(item);
  }
}

function baseSpec(
  element: Element,
  m: CastBuilder<string>,
  children: (child: Element) => Spec,
): Spec {
  switch (element.kind) {
    case "box":
      return m.box();
    case "shape": {
      const { outline } = element;
      return outline.kind === "path"
        ? m.stroke(outline.path)
        : m.morph(outline.base, outline.targets);
    }
    case "text": {
      const { content, split } = element;
      if (typeof content === "function") return m.readout(content);
      if (split === undefined) return m.text(content);
      switch (split) {
        case "letters":
          return m.letters(content);
        case "words":
          return m.words(content);
        default:
          return unreachable(split);
      }
    }
    case "many":
      return m.many(element.items, (item) => itemSpec(item, m));
    case "group":
      return m.group(
        Object.fromEntries(element.children.map((child) => [child.name, children(child)])),
      );
    default:
      return unreachable(element);
  }
}

function listCount(element: Element): number | undefined {
  const spec = baseSpec(element, castBuilder<string>(), () => castBuilder<string>().box());
  switch (spec.kind) {
    case "list":
      return spec.items.length;
    case "actor":
    case "group":
      return undefined;
    default:
      return unreachable(spec);
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
  const specOf = (element: Element): Spec => {
    const entry = state.entries.get(element.name) ?? NO_ENTRY;
    const { pivot, watch, node } = element.options;
    let out = baseSpec(element, m, (child) => specOf(child));
    if (entry.show.length > 0) out = out.on(...entry.show);
    if (watch !== undefined) out = out.watch(watch);
    if (pivot !== undefined) out = out.pivot(pivot);
    if (node !== undefined) out = out.node(node);
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
  readonly count: number | undefined;
  readonly steps: readonly Step[];
}

interface Env {
  readonly plans: ReadonlyMap<string, Plan>;
  readonly rest: RestReader;
  readonly carry: Carry;
  readonly lines: Readonly<Record<string, readonly number[]>> | undefined;
  /** Poses `read` already computed this frame, by element, part and time. */
  readonly read: Map<string, { readonly events: Events; readonly pose: Pose2d }>;
  /** Filled as elements run: which can change with the clock alone. */
  readonly moves: Map<string, Moves> | undefined;
}

function note(moves: Map<string, Moves> | undefined, name: string, kind: Moves): void {
  if (moves === undefined) return;
  if (kind === "time" || !moves.has(name)) moves.set(name, kind);
}

/** How a motion step can change with no new input at `time`, or undefined when only input moves it. */
function movesOf(step: MotionStep, time: Time, context: unknown): Moves | undefined {
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

/** The context a motion sees: its time tells the clock watcher when read, and `carry` or another element
 * counts as `maybe`. */
function watched(context: MotionContext, seen: () => void): MotionContext {
  const time = watchedTime(context.time);
  return {
    time,
    events: context.events,
    rest: context.rest,
    get carry() {
      seen();
      return context.carry;
    },
    element: context.element,
    span: context.span,
    read: (target, at) => {
      seen();
      return context.read(target, at);
    },
    ...(context.index === undefined ? {} : { index: context.index }),
    ...(context.count === undefined ? {} : { count: context.count }),
    ...(context.line === undefined ? {} : { line: context.line }),
  };
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
          return principled(time, events);
        };
        break;
      }
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
            read: (target, at) => {
              const name = typeof target === "string" ? target : target.name;
              const read = env.plans.get(name);
              if (read === undefined)
                throw new RangeError(`read: "${name}" is not an element of the piece.`);
              const part = read.count === undefined ? undefined : (at?.index ?? 0);
              const parts = at?.count ?? read.count;
              const when = at?.time ?? time;
              const length = when.clock.kind === "timed" ? when.clock.length : "";
              const key = `${name}|${part}|${parts}|${when.clock.kind}|${elapsedOf(when.clock)}|${length}|${when.progress}`;
              const known = env.read.get(key);
              if (known !== undefined && known.events === events) return known.pose;
              const pose = stackOf(read, env, part, parts)(when, events);
              env.read.set(key, { events, pose });
              return pose;
            },
            ...(index === undefined ? {} : { index }),
            ...(count === undefined ? {} : { count }),
            ...(line === undefined ? {} : { line }),
          };
          const moves = env.moves;
          if (moves !== undefined) {
            const kind = movesOf(step, time, context);
            if (kind !== undefined) note(moves, plan.name, kind);
          }
          const used =
            moves === undefined || step.travels
              ? context
              : watched(context, () => note(moves, plan.name, "maybe"));
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

function definitionOf(state: State, skin: DomSkinInput | undefined): StageDefinition {
  const ends = [...state.beats.values()].map((beat) => beat.to);
  const durationMs = state.options.length ?? (ends.length > 0 ? Math.max(...ends) : undefined);
  let plans: ReadonlyMap<string, Plan> | undefined;
  const plansOf = (): ReadonlyMap<string, Plan> => {
    plans ??= new Map(
      [...state.elements.values()].map((element) => [
        element.name,
        {
          name: element.name,
          count: listCount(element),
          steps: (state.entries.get(element.name) ?? NO_ENTRY).steps,
        },
      ]),
    );
    return plans;
  };
  const isPage =
    state.sections.size > 0 ||
    [...state.elements.values()].some((element) => element.options.node !== undefined);
  const compiledSections: readonly CompiledSection[] = [...state.sections.values()].map(
    ({ name, selector }) => Object.freeze({ name, node: selector }),
  );
  let maxTriggerMs = 0;
  for (const inputBeat of state.inputBeats.values())
    if (inputBeat.kind === "trigger-beat" && inputBeat.ms > maxTriggerMs)
      maxTriggerMs = inputBeat.ms;
  const settleMs = maxTriggerMs > 0 ? Math.max(2000, maxTriggerMs + 200) : undefined;
  const { frame, cues, layouts, rest } = state.options;
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
        lines: context.lines,
        read: new Map(),
        moves: context.moves,
      };
      const out: Record<string, Pose2d | ListPose> = {};
      for (const plan of env.plans.values()) {
        if (plan.steps.length === 0) continue;
        if (context.only !== undefined && !context.only.has(plan.name)) continue;
        out[plan.name] =
          plan.count === undefined
            ? stackOf(plan, env, undefined, undefined)(context.time, context.events)
            : (index, count) => stackOf(plan, env, index, count)(context.time, context.events);
      }
      return out;
    },
    ...(durationMs === undefined ? {} : { durationMs }),
    ...(frame === undefined ? {} : { frame }),
    ...(skin === undefined ? {} : { skins: { dom: skin } }),
    ...(cues === undefined ? {} : { cues }),
    ...(layouts === undefined ? {} : { layouts }),
    ...(rest === undefined ? {} : { rest }),
    ...(isPage ? { isPage: true } : {}),
    ...(settleMs === undefined ? {} : { settleMs }),
    ...(compiledSections.length > 0 ? { sections: compiledSections } : {}),
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
    Reflect.get(value, "inputBeats") instanceof Map &&
    Reflect.get(value, "sections") instanceof Map
  );
}

function stateOf(value: object): State | undefined {
  const state: unknown = Reflect.get(value, SCENE);
  return isState(state) ? state : undefined;
}

function step(state: State): ElementStep {
  return kept(
    {
      kind: "scene",
      element: (element: Element) => select(state, element),
      motion: (...motions: readonly SceneMotion[]) => {
        const beats = new Map(state.beats);
        const inputBeats = new Map(state.inputBeats);
        const sections = new Map(state.sections);
        const travelTargets: Element[] = [];
        const added = motions.map((run): MotionStep => {
          const traits = traitsOf(run);
          const beat = beatOf(traits.span);
          if (beat !== undefined) withBeat(beats, inputBeats, beat);
          if (isInputBeat(traits.window)) {
            withInputBeat(beats, inputBeats, traits.window);
            addSections(sections, state.elements, traits.window);
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
          validateRegistration(elements, sections, state.owner, target, newTargets);
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
          sections,
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
      show: (...windows: readonly ShowWindow[]) => {
        const beats = new Map(state.beats);
        const inputBeats = new Map(state.inputBeats);
        const stretches = windows.map((window): Stretch => {
          const [from, to] = "name" in window ? [window, window] : window;
          for (const end of [from, to]) {
            if (beatOf(end) === undefined)
              throw new TypeError("sceneBuilder: `.show` takes beats made by `beat`.");
            withBeat(beats, inputBeats, end);
          }
          return from === to ? from.name : [from.name, to.name];
        });
        const [, entry] = entryOf(state);
        return step({
          ...changed(state, { show: [...entry.show, ...stretches] }),
          beats,
          inputBeats,
        });
      },
      limits: (limits: Limits) => {
        const [name, entry] = entryOf(state);
        for (const field of ["jump", "turn", "ratio"] as const)
          if (limits[field] !== undefined && entry.limits[field] !== undefined)
            throw new TypeError(`sceneBuilder: "${name}" sets limit \`${field}\` twice.`);
        const merged = {
          ...entry.limits,
          ...Object.fromEntries(Object.entries(limits).filter(([, value]) => value !== undefined)),
        };
        return step(changed(state, { limits: merged }));
      },
    },
    state,
  );
}

function select(state: State, element: Element): ElementStep {
  const elements = new Map(state.elements);
  register(elements, state.sections, state.owner, element);
  const first = !state.order.includes(element.name);
  return step({
    ...state,
    elements,
    order: first ? [...state.order, element.name] : state.order,
    entries: state.entries.has(element.name)
      ? state.entries
      : new Map(state.entries).set(element.name, NO_ENTRY),
    current: element.name,
  });
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
    sections: new Map(),
    current: undefined,
  };
  return kept({ kind: "scene", element: (element: Element) => select(state, element) }, state);
}

/** Whether `value` is a piece written with `sceneBuilder`. */
export function isScene(value: unknown): value is SceneBuilder {
  return typeof value === "object" && value !== null && stateOf(value) !== undefined;
}

/** How a scene compiles: the DOM skin its renderer draws with, and a wrap around each frame's poses. */
export interface CompileSceneOptions {
  readonly skin?: DomSkinInput | undefined;
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
  const result = compileStage(definitionOf(state, options.skin));
  const { wrap } = options;
  if (!result.ok || wrap === undefined) return result;
  return { ok: true, stage: Object.freeze({ ...result.stage, scene: wrap(result.stage.scene) }) };
}
