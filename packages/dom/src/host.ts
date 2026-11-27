import { unreachable, type MotionEvent, type Pose2d } from "@gerak/core";
import type { Driver, Player } from "@gerak/player";
import {
  compileScene,
  formatStageError,
  isScene,
  isStage,
  type Box,
  type Member,
  type ObjectBounds3d,
  type Rest,
  type RestReader,
  type Scene,
  type Stage,
  type TriggerBeat,
} from "@gerak/stage";
import type { BoxPlacement } from "@gerak/stage/render";
import type { PointerLike } from "./events";
import type { FrameSource } from "./frames";
import type { RenderStyle } from "./render";

/** What a mount reads of a page event: a key, where it landed, and the element it landed on. */
export interface StageEvent extends PointerLike {
  readonly key?: string;
  readonly target?: unknown;
}

/** The document's font loading, which tells a mount when text may have changed size. */
export interface StageFonts {
  readonly ready: Promise<unknown>;
  addEventListener(type: "loadingdone", listener: () => void): void;
  removeEventListener(type: "loadingdone", listener: () => void): void;
}

/** A frame's targets as the scene returned them: a pose per actor or object, a function per list. */
export type StageValues = Readonly<Record<string, unknown>>;

/** What `mount` and `<Stage>` take: a compiled stage, or what `scene` returns. */
export type StageInput = Stage | Scene;

/** The style properties written or cleared while measuring and animating an existing page node. */
export interface PageStyle extends RenderStyle {
  display?: string;
  position?: string;
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  whiteSpace?: string;
}

/** Minimal contract of a page DOM node animated by `mount`, real element or test double. */
export interface PageElement {
  readonly style: PageStyle;
  textContent: string | null;
  readonly children?: ArrayLike<unknown>;
  readonly childNodes?: ArrayLike<unknown>;
  readonly parentElement?: unknown;
  readonly ownerDocument?: unknown;
  readonly offsetLeft?: number;
  readonly offsetTop?: number;
  readonly offsetWidth?: number;
  readonly offsetHeight?: number;
  getBoundingClientRect?(): {
    readonly left: number;
    readonly top: number;
    readonly right?: number;
    readonly bottom?: number;
    readonly width: number;
    readonly height: number;
  };
  setAttribute?(name: string, value: string): void;
  removeAttribute?(name: string): void;
  getTotalLength?(): number;
  append?(...nodes: unknown[]): void;
  replaceChildren?(...nodes: unknown[]): void;
  addEventListener(type: string, listener: (event: StageEvent) => void): void;
  removeEventListener(type: string, listener: (event: StageEvent) => void): void;
  readonly ownerSVGElement?: unknown;
}

/** Container queried by `mount` to bind the cast and listen for viewport pointer motion. */
export interface PageRoot {
  querySelector(selector: string): unknown;
  querySelectorAll(selector: string): ArrayLike<unknown>;
  readonly ownerDocument?: unknown;
  readonly defaultView?: unknown;
  readonly fonts?: StageFonts;
  readonly documentElement?: unknown;
  readonly body?: unknown;
  addEventListener?(
    type: string,
    listener: (event: StageEvent) => void,
    options?: { readonly passive?: boolean },
  ): void;
  removeEventListener?(type: string, listener: (event: StageEvent) => void): void;
}

/** What a page mount reads vertical and horizontal scroll offsets from. */
export interface PageScrollTarget {
  readonly scrollY?: number;
  readonly scrollX?: number;
  readonly scrollTop?: number;
  readonly scrollLeft?: number;
  readonly innerWidth?: number;
  readonly innerHeight?: number;
  addEventListener(
    type: string,
    listener: () => void,
    options?: { readonly passive?: boolean },
  ): void;
  removeEventListener(type: string, listener: () => void): void;
}

/** What a mount's time is: `"live"`, `"timed"`, or an explicit `{ kind: "driver", driver }`. */
export type MountClock = "live" | "timed" | { readonly kind: "driver"; readonly driver: Driver };

/** Where a mount draws: `"page"` in place, or `"fit"` scaling `root` to its parent or viewport. */
export type MountFrame = "page" | "fit";

/** Settings of `mount`: clock, frame, root, scroll/frame/time hooks, binders, and settleMs. */
export interface MountOptions {
  readonly clock: MountClock;
  /** Defaults to `"page"`. */
  readonly frame?: MountFrame;
  /** Document or container holding the cast; defaults to `document`, and `"fit"` needs an element. */
  readonly root?: PageRoot;
  readonly scrollTarget?: PageScrollTarget;
  readonly frames?: FrameSource;
  readonly settleMs?: number;
  /** The live clock's time source in ms; defaults to `performance.now`. */
  readonly now?: () => number;
  readonly viewport?: () => { readonly width: number; readonly height: number };
  /** Told of the driver once, at mount; a timed mount's is a `ClockDriver`. */
  readonly onDriver?: (driver: Driver) => void;
  /** Checks every frame's targets with `check` and throws on a mistake; for authoring pages. */
  readonly checks?: boolean;
  /** Nodes by element name, over the nodes its markup tags `data-cast` with that name. */
  readonly nodes?: Readonly<Record<string, PageElement | readonly PageElement[]>>;
  /** What draws the scene's object elements, such as `threeBinder`; each object needs exactly one. */
  readonly binders?: readonly Binder[];
}

/** Whether a bound cast target is a single element/object or a multi-part list. */
export type BinderCastKind = "single" | "list";

/** Global registry where mounts publish binder-discovered cast names even if scene validation fails. */
export const BINDER_CASTS = Symbol.for("@gerak/dom/binder-casts");

/** What draws a scene's object elements beside the mount: claims, start, resize, counts, measure, casts. */
export interface Binder {
  /** Whether it draws the object element `name`. */
  claims(name: string): boolean;
  /** Writes what it claims from `player` on every step; returns the stop. */
  start(player: Player<StageValues>, stage: Stage): () => void;
  /** Resizes the binder's surface before layout and 3D bounds are measured. */
  readonly resize?: () => void;
  /** Reports part counts per bound 3D list object (`Object3D[]` overrides or `Group.children`). */
  readonly counts?: (names?: readonly string[]) => Readonly<Record<string, number>>;
  /** Measures rest bounds `{ width, height, depth }` for the named bound 3D objects. */
  readonly measure?: (
    names?: readonly string[],
    lists?: ReadonlySet<string>,
  ) => Readonly<Record<string, ObjectBounds3d>>;
  /** Declares known 3D cast names and whether each is a single element or a multi-part list. */
  readonly casts?: () => Readonly<Record<string, BinderCastKind>>;
}

/** A rest box as a measure holds it: its centre and size in px, and how the page places it. */
export interface MeasuredBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly placement: BoxPlacement;
}

/** What a mount measured, as plain data: frame, rest boxes, split lines, parents, 3D sizes and 3D counts. */
export interface Measurement {
  /** A fitted root's size, or the viewport's on a page. */
  readonly frame: { readonly width: number; readonly height: number };
  readonly rest: Readonly<Record<string, MeasuredBox>>;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  /** The nearest cast element holding each one, by name; an element with none is absent. */
  readonly parents: Readonly<Record<string, string>>;
  readonly objects?: Readonly<Record<string, ObjectBounds3d>>;
  readonly counts?: Readonly<Record<string, number>>;
}

/** Where every live mount on a page is listed, for the page tools that read what it measured. */
export const MOUNTS = Symbol.for("@gerak/dom/mounts");

/** A playing mount: its player, driver, measured rests and text lines, input logger, and cleanup. */
export interface Mounted {
  readonly player: Player<StageValues>;
  readonly driver: Driver;
  /** The scene's length in ms when the clock is timed; undefined on a live clock, which has no end. */
  readonly durationMs: number | undefined;
  /** Measured rest boxes by element name. */
  readonly rest: Rest;
  /** Visual line indices per split text element, updated on resize without changing part count. */
  readonly lines: Readonly<Record<string, readonly number[]>>;
  remeasure(): void;
  /** What it measured last, as plain data a cache can hold. */
  measure(): Measurement;
  /** Swaps in a scene with the same cast and length, keeping time. */
  replace(next: StageInput): void;
  /** Logs a named numeric sample at the clock's ms and wakes the settle window. */
  send(name: string, value: number, target?: string): void;
  /** Events recorded on this mount, oldest first. */
  events(): readonly MotionEvent[];
  /** Resolves once every bound media node has `seeking === false` and `readyState >= 2`. */
  settled(): Promise<void>;
  /** Bound media elements with clip duration in ms and show window bounds in ms. */
  media(): readonly {
    readonly name: string;
    readonly clipMs: number | undefined;
    readonly from: number;
    readonly to: number;
  }[];
  dispose(): void;
}

export interface PageDocument {
  createElement(tag: string): unknown;
  createTextNode?(text: string): unknown;
  readonly fonts?: StageFonts;
  readonly defaultView?: unknown;
  readonly documentElement?: unknown;
  addEventListener?(
    type: string,
    listener: (event: StageEvent) => void,
    options?: { readonly passive?: boolean },
  ): void;
  removeEventListener?(type: string, listener: (event: StageEvent) => void): void;
}

export type DrawnMember = Exclude<Member, { readonly kind: "object" }>;

export interface BoundTarget {
  member: DrawnMember;
  readonly node: PageElement;
  readonly host?: PageElement | undefined;
  readonly items: readonly PageElement[];
  readonly restore?: (() => void) | undefined;
}

export interface MediaState {
  readonly node: HTMLMediaElement;
  previousTarget: number | undefined;
  previousNow: number | undefined;
  pendingSeek: number | undefined;
}

export interface TriggerRun {
  readonly beat: TriggerBeat;
  readonly animations: readonly Animation[];
  heading: -1 | 0 | 1 | undefined;
}

export interface RawRect {
  readonly left: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

export const CLOCK_FRAMES_OFF = Symbol.for("@gerak/dom/clock-frames-off");
export const COMPOSITOR_OFF = Symbol.for("@gerak/dom/compositor-off");
export const TRIGGER_SLACK_MS = 34;

interface BinderCastEntry {
  readonly read: () => Readonly<Record<string, BinderCastKind>>;
}

const ROOT_BINDER_CASTS = new WeakMap<object, BinderCastEntry>();
const NO_ROOT_KEY = {};

/** Registers binder cast metadata scoped to `rawRoot`, replacing any stale entry for the same root. */
export function registerBinderCasts(
  rawRoot: unknown,
  binders: readonly Binder[],
): (() => void) | undefined {
  const withCasts = binders.filter(
    (binder): binder is Binder & { readonly casts: NonNullable<Binder["casts"]> } =>
      binder.casts !== undefined,
  );
  if (withCasts.length === 0) return undefined;
  const entry: BinderCastEntry = {
    read: () => {
      const out: Record<string, BinderCastKind> = {};
      for (const binder of withCasts) Object.assign(out, binder.casts());
      return Object.freeze(out);
    },
  };
  const key = isObjectRecord(rawRoot) ? rawRoot : NO_ROOT_KEY;
  const existing: unknown = Reflect.get(globalThis, BINDER_CASTS);
  const entries: unknown[] = Array.isArray(existing) ? existing : [];
  Reflect.set(globalThis, BINDER_CASTS, entries);
  const prior = ROOT_BINDER_CASTS.get(key);
  const priorIndex = prior === undefined ? -1 : entries.indexOf(prior);
  if (priorIndex >= 0) entries[priorIndex] = entry;
  else entries.push(entry);
  ROOT_BINDER_CASTS.set(key, entry);
  return () => {
    const listed: unknown = Reflect.get(globalThis, BINDER_CASTS);
    if (Array.isArray(listed)) {
      const index = listed.indexOf(entry);
      if (index >= 0) listed.splice(index, 1);
    }
    if (ROOT_BINDER_CASTS.get(key) === entry) ROOT_BINDER_CASTS.delete(key);
  };
}

export function isObjectRecord(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export function isPageElement(value: unknown): value is PageElement {
  if (!isObjectRecord(value)) return false;
  const style: unknown = Reflect.get(value, "style");
  return (
    isObjectRecord(style) &&
    "textContent" in value &&
    typeof Reflect.get(value, "addEventListener") === "function" &&
    typeof Reflect.get(value, "removeEventListener") === "function"
  );
}

export function isPageRoot(value: unknown): value is PageRoot {
  return (
    isObjectRecord(value) &&
    typeof Reflect.get(value, "querySelector") === "function" &&
    typeof Reflect.get(value, "querySelectorAll") === "function"
  );
}

export function isPageDocument(value: unknown): value is PageDocument {
  return isObjectRecord(value) && typeof Reflect.get(value, "createElement") === "function";
}

export function isScrollTarget(value: unknown): value is PageScrollTarget {
  return (
    isObjectRecord(value) &&
    typeof Reflect.get(value, "addEventListener") === "function" &&
    typeof Reflect.get(value, "removeEventListener") === "function"
  );
}

export function isDomElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

export function isMediaElement(value: unknown): value is HTMLMediaElement {
  return typeof HTMLMediaElement !== "undefined" && value instanceof HTMLMediaElement;
}

export function needElement(value: unknown, memberName: string, selector: string): PageElement {
  if (isPageElement(value)) return value;
  throw new Error(`mount: "${memberName}" (${selector}) matched no styleable page element.`);
}

export function childElementsOf(node: PageElement): readonly PageElement[] {
  const raw = node.children;
  if (raw === undefined) return [];
  const out: PageElement[] = [];
  for (const child of Array.from(raw)) if (isPageElement(child)) out.push(child);
  return out;
}

export function documentOf(node: PageElement, root: PageRoot): PageDocument | undefined {
  if (isPageDocument(node.ownerDocument)) return node.ownerDocument;
  if (isPageDocument(root.ownerDocument)) return root.ownerDocument;
  if (isPageDocument(root)) return root;
  return undefined;
}

export function parentNodeOf(node: unknown): unknown {
  if (!isObjectRecord(node)) return undefined;
  const parent: unknown = Reflect.get(node, "parentElement");
  return isObjectRecord(parent) ? parent : undefined;
}

/** Ensures every object member of `stage` has exactly one binder claiming it. */
export function checkBinders(stage: Stage, binders: readonly Binder[]): void {
  const wrong: string[] = [];
  for (const member of stage.members) {
    if (member.kind !== "object") continue;
    const count = binders.filter((binder) => binder.claims(member.name)).length;
    if (count === 0) wrong.push(`no binder draws the object "${member.name}"`);
    else if (count > 1) wrong.push(`${count} binders draw the object "${member.name}"`);
  }
  if (wrong.length > 0)
    throw new Error(`mount: ${wrong.join("; ")}; each object needs one binder in \`binders\`.`);
}

/** Compiles `input` when needed and confirms every DOM element has a binding selector or node. */
export function resolvePageStage(input: StageInput): Stage {
  let stage: Stage;
  if (isStage(input)) stage = input;
  else if (isScene(input)) {
    const compiled = compileScene(input);
    if (!compiled.ok)
      throw new Error(`mount: invalid scene:\n${compiled.errors.map(formatStageError).join("\n")}`);
    stage = compiled.stage;
  } else throw new Error("mount: expected a stage or what `scene` returns.");

  const missing = stage.members
    .filter((member) => member.node === undefined && member.kind !== "object")
    .map((member) => `"${member.name}"`);
  if (missing.length > 0)
    throw new TypeError(
      `mount: every DOM element needs a selector or node (missing ${missing.join(", ")}).`,
    );
  return stage;
}

/** Returns passive pointermove attach/detach hooks on `doc` or `root`. */
export function eventTargetOf(
  root: PageRoot,
  doc: PageDocument | undefined,
): {
  add(listener: (event: StageEvent) => void): void;
  remove(listener: (event: StageEvent) => void): void;
} {
  if (doc?.addEventListener !== undefined && doc.removeEventListener !== undefined) {
    const addFn = doc.addEventListener;
    const removeFn = doc.removeEventListener;
    return {
      add: (listener) => Reflect.apply(addFn, doc, ["pointermove", listener, { passive: true }]),
      remove: (listener) => Reflect.apply(removeFn, doc, ["pointermove", listener]),
    };
  }
  if (root.addEventListener !== undefined && root.removeEventListener !== undefined) {
    const addFn = root.addEventListener;
    const removeFn = root.removeEventListener;
    return {
      add: (listener) => Reflect.apply(addFn, root, ["pointermove", listener, { passive: true }]),
      remove: (listener) => Reflect.apply(removeFn, root, ["pointermove", listener]),
    };
  }
  return { add: () => undefined, remove: () => undefined };
}

export function viewOfRoot(
  root: PageRoot,
  doc: PageDocument | undefined,
): PageScrollTarget | undefined {
  const globalView = isScrollTarget(globalThis.window) ? globalThis.window : undefined;
  if (isScrollTarget(root.defaultView)) return root.defaultView;
  if (isScrollTarget(doc?.defaultView)) return doc.defaultView;
  return globalView;
}

export function scrollTargetFor(
  options: MountOptions,
  view: PageScrollTarget | undefined,
): PageScrollTarget | undefined {
  return options.scrollTarget ?? view;
}

export function readScrollYOf(scrollTarget: PageScrollTarget | undefined, root: PageRoot): number {
  const raw =
    scrollTarget?.scrollY ??
    scrollTarget?.scrollTop ??
    (isObjectRecord(root.documentElement)
      ? Reflect.get(root.documentElement, "scrollTop")
      : undefined) ??
    0;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
}

export function readScrollXOf(scrollTarget: PageScrollTarget | undefined, root: PageRoot): number {
  const raw =
    scrollTarget?.scrollX ??
    scrollTarget?.scrollLeft ??
    (isObjectRecord(root.documentElement)
      ? Reflect.get(root.documentElement, "scrollLeft")
      : undefined) ??
    0;
  return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
}

export function readViewportOf(
  options: MountOptions,
  view: PageScrollTarget | undefined,
  scrollTarget: PageScrollTarget | undefined,
  root: PageRoot,
): { readonly width: number; readonly height: number } {
  if (options.viewport !== undefined) return options.viewport();
  const w = view?.innerWidth ?? scrollTarget?.innerWidth;
  const h = view?.innerHeight ?? scrollTarget?.innerHeight;
  if (typeof w === "number" && w > 0 && typeof h === "number" && h > 0) {
    return { width: w, height: h };
  }
  if (isObjectRecord(root.documentElement)) {
    const cw: unknown = Reflect.get(root.documentElement, "clientWidth");
    const ch: unknown = Reflect.get(root.documentElement, "clientHeight");
    if (typeof cw === "number" && cw > 0 && typeof ch === "number" && ch > 0) {
      return { width: cw, height: ch };
    }
  }
  return { width: 1280, height: 720 };
}

export function readMaxScrollOf(doc: PageDocument | undefined): number {
  const source = doc?.documentElement;
  return isDomElement(source) ? source.scrollHeight - source.clientHeight : 0;
}

export function fittedSizeOf(root: HTMLElement): {
  readonly width: number;
  readonly height: number;
} {
  const size = { width: root.offsetWidth, height: root.offsetHeight };
  if (!(size.width > 0 && size.height > 0))
    throw new Error('mount: a root with `frame: "fit"` needs a width and height in its CSS.');
  return size;
}

export function scaleFittedRoot(
  fitted: HTMLElement | undefined,
  viewport: () => { readonly width: number; readonly height: number },
): void {
  if (fitted === undefined) return;
  const frame = fittedSizeOf(fitted);
  const parent = fitted.parentElement;
  const owner = fitted.ownerDocument;
  const box =
    parent !== null &&
    parent !== owner.body &&
    parent !== owner.documentElement &&
    parent.clientWidth > 0 &&
    parent.clientHeight > 0
      ? { width: parent.clientWidth, height: parent.clientHeight }
      : viewport();
  const scale = Math.min(box.width / frame.width, box.height / frame.height);
  fitted.style.transform = Number.isFinite(scale) && scale !== 1 ? `scale(${scale})` : "";
}

/** Exhaustive guard re-exported for sibling DOM modules. */
export { unreachable };
export type { BoxPlacement, Pose2d, RestReader };
