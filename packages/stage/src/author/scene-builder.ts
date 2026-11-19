import {
  POSE_2D_NUMBERS,
  VALUE_FIELDS,
  combine,
  elapsedOf,
  motion,
  timeAt,
  unreachable,
  type Events,
  type Motion,
  type Pose2d,
  type Signal,
  type Span,
  type Time,
} from "@gerak/core";
import type { Beat } from "./beat";
import {
  castBuilder,
  type ActorSpec,
  type CastBuilder,
  type Expect,
  type ItemContent,
  type Members,
  type Spec,
} from "./cast";
import type { Element } from "./elements";
import type { Carry, CarryOptions, Frame, RestReader } from "./layout";
import type {
  DomSkinInput,
  LayoutsInput,
  Limits,
  ListPose,
  SceneContext,
  StageDefinition,
} from "./stage";

/** What a motion reads each frame, beside the time it plays in. */
export interface MotionContext {
  /** The scene's time, before the motion's `in` and `loop` remap it. */
  readonly time: Time;
  readonly events: Events;
  /** Which part of a list element this call poses, and how many parts there are. */
  readonly index?: number;
  readonly count?: number;
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
  readonly skins?: { readonly dom?: DomSkinInput | undefined } | undefined;
  readonly frame?: Frame | undefined;
  readonly cues?: Events | undefined;
  /** The piece's length in ms; defaults to the end of the last beat. */
  readonly length?: number | undefined;
  readonly layouts?: LayoutsInput | undefined;
}

/** A piece being written: itself a `StageDefinition`, and `.element` selects what to give motions. */
export interface SceneBuilder extends StageDefinition {
  element(element: Element): ElementStep;
}

/** A piece with one element selected; the order of `.motion` and `.modify` calls matters. */
export interface ElementStep extends SceneBuilder {
  /** Appends motions: layer motions add by each field's rule, a `take` motion replaces its fields. */
  motion(...motions: readonly SceneMotion[]): ElementStep;
  /** Wraps everything above it in the element's list in `principle`. */
  modify(principle: Principle): ElementStep;
  /** Shows the element only during these beats. */
  show(...beats: readonly Beat[]): ElementStep;
  /** Called, sets review limits of this element, a field once; read, holds each element's limits by name. */
  readonly limits: ((limits: Limits) => ElementStep) & Readonly<Record<string, Limits>>;
}

type MotionStep = {
  readonly kind: "motion";
  readonly run: SceneMotion;
  readonly span: Span | undefined;
  readonly joins: "layer" | "take";
  readonly loops: boolean;
  readonly reads: readonly string[];
};

type Step = MotionStep | { readonly kind: "modify"; readonly principle: Principle };

interface Entry {
  readonly steps: readonly Step[];
  readonly show: readonly Beat[];
  readonly limits: Limits;
}

interface State {
  readonly options: SceneBuilderOptions;
  readonly elements: ReadonlyMap<string, Element>;
  readonly order: readonly string[];
  readonly entries: ReadonlyMap<string, Entry>;
  readonly beats: ReadonlyMap<string, Beat>;
  readonly current: string | undefined;
}

const NO_ENTRY: Entry = Object.freeze({ steps: [], show: [], limits: {} });

const READS = new WeakMap<object, readonly string[]>();

function need(context: MotionContext | undefined, who: string): MotionContext {
  if (context === undefined)
    throw new TypeError(`${who}: a scene motion needs the scene's context.`);
  return context;
}

function reading(
  base: Motion<Pose2d, MotionContext>,
  reads: readonly string[],
): Motion<Pose2d, MotionContext> {
  const wrapped = Object.freeze(
    Object.assign((time: Time, context?: MotionContext) => base(time, context), {
      span: base.span,
      period: base.period,
      joins: base.joins,
      in: (span: Span) => reading(base.in(span), reads),
      loop: (ms: number) => reading(base.loop(ms), reads),
      take: () => reading(base.take(), reads),
    }),
  );
  READS.set(wrapped, reads);
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

function travel(before: Pose2d, now: Pose2d): Pose2d {
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

/** A motion giving the change in `element`'s pose since the start of its own span; it reads `element`. */
export function stayWith(element: Element): Motion<Pose2d, MotionContext> {
  const base = motion((time, context?: MotionContext) => {
    const here = need(context, "stayWith");
    const start = here.span?.from ?? 0;
    const now = start + (elapsedOf(time.clock) ?? 0);
    return travel(
      here.read(element, { time: timeAt(here.time, start), ...indexOf(here) }),
      here.read(element, { time: timeAt(here.time, now), ...indexOf(here) }),
    );
  });
  return reading(base, [element.name]);
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

function traitsOf(run: SceneMotion): {
  span: Span | undefined;
  joins: "layer" | "take";
  loops: boolean;
} {
  const span: unknown = Reflect.get(run, "span");
  const joins: unknown = Reflect.get(run, "joins");
  const period: unknown = Reflect.get(run, "period");
  return {
    span: isSpan(span) ? span : undefined,
    joins: joins === "take" ? "take" : "layer",
    loops: typeof period === "number",
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

function register(elements: Map<string, Element>, element: Element): void {
  const held = elements.get(element.name);
  if (held !== undefined && held !== element)
    throw new TypeError(
      `sceneBuilder: element ${describe(held)} is already in the piece; ${describe(element)} cannot take its name.`,
    );
  elements.set(element.name, element);
  if (element.kind === "group") for (const child of element.children) register(elements, child);
}

function withBeat(beats: Map<string, Beat>, beat: Beat): void {
  const held = beats.get(beat.name);
  if (held !== undefined && (held.from !== beat.from || held.to !== beat.to))
    throw new RangeError(
      `sceneBuilder: beat "${beat.name}" is ${held.from}-${held.to} ms in one place and ${beat.from}-${beat.to} ms in another.`,
    );
  beats.set(beat.name, beat);
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
    const { pivot, watch } = element.options;
    let out = baseSpec(element, m, (child) => specOf(child));
    if (entry.show.length > 0) out = out.on(...entry.show.map((beat) => beat.name));
    if (watch !== undefined) out = out.watch(watch);
    if (pivot !== undefined) out = out.pivot(pivot);
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
      case "modify":
        stack = step.principle(below);
        break;
      case "motion":
        stack = (time, events) => {
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
              return stackOf(
                read,
                env,
                read.count === undefined ? undefined : (at?.index ?? 0),
                at?.count ?? read.count,
              )(at?.time ?? time, events);
            },
            ...(index === undefined ? {} : { index }),
            ...(count === undefined ? {} : { count }),
          };
          const pose = step.run(time, context);
          switch (step.joins) {
            case "layer":
              return combine([below(time, events), pose]);
            case "take":
              return (elapsedOf(time.clock) ?? 0) >= (step.span?.from ?? 0)
                ? replacing(below(time, events), pose)
                : below(time, events);
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

function holdsLimits<T extends object>(
  value: T,
  record: Readonly<Record<string, Limits>>,
): value is T & Readonly<Record<string, Limits>> {
  return Object.entries(record).every(([name, own]) => Reflect.get(value, name) === own);
}

function limitsMember(state: State, set: (limits: Limits) => ElementStep): ElementStep["limits"] {
  const record = limitsOf(state);
  const member = (limits: Limits): ElementStep => set(limits);
  for (const [name, own] of Object.entries(record))
    Object.defineProperty(member, name, { value: own, enumerable: true });
  if (!holdsLimits(member, record)) throw new TypeError("sceneBuilder: limits were not kept.");
  return member;
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
          count: listCount(element),
          steps: (state.entries.get(element.name) ?? NO_ENTRY).steps,
        },
      ]),
    );
    return plans;
  };
  const { skins, frame, cues, layouts } = state.options;
  return {
    kind: "stage-definition",
    beats: Object.fromEntries([...state.beats].map(([name, beat]) => [name, [beat.from, beat.to]])),
    limits: limitsOf(state),
    cast: (m) => castOf(state, m),
    scene: (context: SceneContext) => {
      const env: Env = { plans: plansOf(), rest: context.rest, carry: context.carry };
      const out: Record<string, Pose2d | ListPose> = {};
      for (const plan of env.plans.values()) {
        if (plan.steps.length === 0) continue;
        out[plan.name] =
          plan.count === undefined
            ? stackOf(plan, env, undefined, undefined)(context.time, context.events)
            : (index, count) => stackOf(plan, env, index, count)(context.time, context.events);
      }
      return out;
    },
    ...(durationMs === undefined ? {} : { durationMs }),
    ...(frame === undefined ? {} : { frame }),
    ...(skins === undefined ? {} : { skins }),
    ...(cues === undefined ? {} : { cues }),
    ...(layouts === undefined ? {} : { layouts }),
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

function step(state: State): ElementStep {
  return Object.freeze({
    ...definitionOf(state),
    element: (element: Element) => select(state, element),
    motion: (...motions: readonly SceneMotion[]) => {
      const beats = new Map(state.beats);
      const added = motions.map((run): MotionStep => {
        const traits = traitsOf(run);
        const beat = beatOf(traits.span);
        if (beat !== undefined) withBeat(beats, beat);
        return { kind: "motion", run, ...traits, reads: READS.get(run) ?? [] };
      });
      const [, entry] = entryOf(state);
      const next = { ...changed(state, { steps: [...entry.steps, ...added] }), beats };
      const loop = loopOf(next.entries);
      if (loop !== undefined)
        throw new RangeError(
          `sceneBuilder: elements read each other in a loop: ${loop.join(", ")}.`,
        );
      return step(next);
    },
    modify: (principle: Principle) => {
      const [, entry] = entryOf(state);
      return step(changed(state, { steps: [...entry.steps, { kind: "modify", principle }] }));
    },
    show: (...shown: readonly Beat[]) => {
      const beats = new Map(state.beats);
      for (const beat of shown) {
        if (beatOf(beat) === undefined)
          throw new TypeError("sceneBuilder: `.show` takes beats made by `beat`.");
        withBeat(beats, beat);
      }
      const [, entry] = entryOf(state);
      return step({ ...changed(state, { show: [...entry.show, ...shown] }), beats });
    },
    limits: limitsMember(state, (limits: Limits) => {
      const [name, entry] = entryOf(state);
      for (const field of ["jump", "turn", "ratio"] as const)
        if (limits[field] !== undefined && entry.limits[field] !== undefined)
          throw new TypeError(`sceneBuilder: "${name}" sets limit \`${field}\` twice.`);
      const merged = {
        ...entry.limits,
        ...Object.fromEntries(Object.entries(limits).filter(([, value]) => value !== undefined)),
      };
      return step(changed(state, { limits: merged }));
    }),
  });
}

function select(state: State, element: Element): ElementStep {
  const elements = new Map(state.elements);
  register(elements, element);
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

/** Starts a piece; the chain's value is a `StageDefinition`, so every tool, page and renderer reads it. */
export function sceneBuilder(options: SceneBuilderOptions = {}): SceneBuilder {
  const state: State = {
    options,
    elements: new Map(),
    order: [],
    entries: new Map(),
    beats: new Map(),
    current: undefined,
  };
  return Object.freeze({
    ...definitionOf(state),
    element: (element: Element) => select(state, element),
  });
}
