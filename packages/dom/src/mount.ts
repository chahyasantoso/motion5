import {
  INPUT_EVENTS,
  clamp,
  liveAt,
  unreachable,
  type Events,
  type Pose2d,
  type Signal,
  type Time,
} from "@gerak/core";
import { play, type Driver, type Player } from "@gerak/player";
import {
  check,
  compileScene,
  formatStageError,
  frame as frameOf,
  isScene,
  isStage,
  listPose,
  poseOf,
  restReader,
  type Box,
  type Content,
  type FrameOutput,
  type Member,
  type Rest,
  type RestReader,
  type SceneBuilder,
  type Stage,
  type Moves,
  type TriggerBeat,
} from "@gerak/stage";
import {
  drawStrokes,
  morphAt,
  restOfBounds,
  strokeBox,
  placementOf,
  withPlacement,
  type BoxPlacement,
} from "@gerak/stage/render";
import {
  sampleNear,
  scrollTracks,
  trackKeyframes,
  triggerTracks,
  type Track,
  type TriggerTrack,
} from "./compositor";
import { clockDriver, type ClockDriver } from "./drivers";
import { eventRecorder, type EventSource } from "./events";
import { pageFrames, type FrameSource } from "./frames";
import { applyPath, applyValue, pathData, type RenderStyle } from "./render";
import type { PointerLike } from "./events";

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

/** A frame's targets as the scene returned them: a pose per actor or group, a function per list. */
export type StageValues = Readonly<Record<string, unknown>>;

/** What `mount` and `<Stage>` take: a compiled stage, or what `sceneBuilder` returns. */
export type StageInput = Stage | SceneBuilder;

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

/** What a mount's time is: `"live"` runs on from mount, read by scroll, pointer and triggers;
 * `"timed"` runs over the scene's length and seeks, for reels and capture. */
export type MountClock = "live" | "timed";

/** Where a mount draws: `"page"` in place, or `"fit"`, which takes `root`'s CSS size as the frame,
 * clips it and scales it about its top left to its parent's box, or else the viewport. */
export type MountFrame = "page" | "fit";

/** Settings of `mount`: its clock and frame, the root it binds in, and the hooks tests and tools use. */
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

/** What draws a scene's object elements beside the mount: which it claims, and how it starts on the player. */
export interface Binder {
  /** Whether it draws the object element `name`. */
  claims(name: string): boolean;
  /** Writes what it claims from `player` on every step; returns the stop. */
  start(player: Player<StageValues>, stage: Stage): () => void;
}

/** Names each object element of `stage` that no binder, or more than one, claims. */
function checkBinders(stage: Stage, binders: readonly Binder[]): void {
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

/** A rest box as a measure holds it: its centre and size in px, and how the page places it. */
export interface MeasuredBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly placement: BoxPlacement;
}

/** What a mount measured, as plain data: the frame, each rest box, each split's lines, each element's parent. */
export interface Measurement {
  /** A fitted root's size, or the viewport's on a page. */
  readonly frame: { readonly width: number; readonly height: number };
  readonly rest: Readonly<Record<string, MeasuredBox>>;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  /** The nearest cast element holding each one, by name; an element with none is absent. */
  readonly parents: Readonly<Record<string, string>>;
}

/** Where every live mount on a page is listed, for the page tools that read what it measured. */
export const MOUNTS = Symbol.for("@gerak/dom/mounts");

/** A playing mount: its player, driver, measured rests and text lines, input logger, and cleanup. */
export interface Mounted {
  readonly player: Player<StageValues>;
  readonly driver: Driver;
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
  /** Everything logged so far, oldest first: scroll, viewport pointer, watched pointer, and sent samples. */
  events(): Events;
  dispose(): void;
}

interface PageDocument {
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

/** A member drawn by a page node: every kind but a Three.js object, which no page node draws. */
type DrawnMember = Exclude<Member, { readonly kind: "object" }>;

interface BoundTarget {
  member: DrawnMember;
  readonly node: PageElement;
  readonly items: readonly PageElement[];
  readonly restore?: (() => void) | undefined;
}

/** The animations one trigger beat steers, and which way they last ran. */
interface TriggerRun {
  readonly beat: TriggerBeat;
  readonly animations: readonly Animation[];
  heading: -1 | 0 | 1 | undefined;
}

interface RawRect {
  readonly left: number;
  readonly top: number;
  readonly bottom: number;
  readonly width: number;
  readonly height: number;
}

function isObjectRecord(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

function isPageElement(value: unknown): value is PageElement {
  if (!isObjectRecord(value)) return false;
  const style: unknown = Reflect.get(value, "style");
  return (
    isObjectRecord(style) &&
    "textContent" in value &&
    typeof Reflect.get(value, "addEventListener") === "function" &&
    typeof Reflect.get(value, "removeEventListener") === "function"
  );
}

function isPageRoot(value: unknown): value is PageRoot {
  return (
    isObjectRecord(value) &&
    typeof Reflect.get(value, "querySelector") === "function" &&
    typeof Reflect.get(value, "querySelectorAll") === "function"
  );
}

function isPageDocument(value: unknown): value is PageDocument {
  return isObjectRecord(value) && typeof Reflect.get(value, "createElement") === "function";
}

function isScrollTarget(value: unknown): value is PageScrollTarget {
  return (
    isObjectRecord(value) &&
    typeof Reflect.get(value, "addEventListener") === "function" &&
    typeof Reflect.get(value, "removeEventListener") === "function"
  );
}

function isDomElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

function needElement(value: unknown, memberName: string, selector: string): PageElement {
  if (isPageElement(value)) return value;
  throw new Error(`mount: "${memberName}" (${selector}) matched no styleable page element.`);
}

function childElementsOf(node: PageElement): readonly PageElement[] {
  const raw = node.children;
  if (raw === undefined) return [];
  const out: PageElement[] = [];
  for (const child of Array.from(raw)) if (isPageElement(child)) out.push(child);
  return out;
}

function documentOf(node: PageElement, root: PageRoot): PageDocument | undefined {
  if (isPageDocument(node.ownerDocument)) return node.ownerDocument;
  if (isPageDocument(root.ownerDocument)) return root.ownerDocument;
  if (isPageDocument(root)) return root;
  return undefined;
}

function eventTargetOf(
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

function resolvePageStage(input: StageInput): Stage {
  let stage: Stage;
  if (isStage(input)) stage = input;
  else if (isScene(input)) {
    const compiled = compileScene(input);
    if (!compiled.ok)
      throw new Error(`mount: invalid scene:\n${compiled.errors.map(formatStageError).join("\n")}`);
    stage = compiled.stage;
  } else throw new Error("mount: expected a stage or what `sceneBuilder` returns.");

  const missing = stage.members
    .filter((member) => member.node === undefined && member.kind !== "object")
    .map((member) => `"${member.name}"`);
  if (missing.length > 0)
    throw new TypeError(
      `mount: every element needs \`{ node: el(selector) }\` (missing ${missing.join(", ")}).`,
    );
  return stage;
}

function splitPieces(text: string, split: "letters" | "words"): readonly string[] {
  switch (split) {
    case "letters": {
      const segments = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text);
      return [...segments].map(({ segment }) => segment);
    }
    case "words":
      return text.split(/\s+/).filter((word) => word !== "");
    default:
      return unreachable(split);
  }
}

function wrapSplitText(
  container: PageElement,
  name: string,
  split: "letters" | "words",
  doc: PageDocument,
): { readonly items: readonly PageElement[]; readonly restore: () => void } {
  const hadNodes = container.childNodes !== undefined ? Array.from(container.childNodes) : [];
  const priorText = container.textContent;
  const pieces = splitPieces(priorText ?? "", split);
  const spans: PageElement[] = [];
  const children: unknown[] = [];
  pieces.forEach((piece, index) => {
    const span = needElement(doc.createElement("span"), `${name}.${index}`, "span");
    span.textContent = piece;
    span.style.display = "inline-block";
    if (split === "letters") span.style.whiteSpace = "pre";
    span.setAttribute?.("data-gerak-part", String(index));
    spans.push(span);
    children.push(span);
    if (split === "words" && index + 1 < pieces.length) {
      children.push(doc.createTextNode ? doc.createTextNode(" ") : " ");
    }
  });
  if (container.replaceChildren) container.replaceChildren(...children);
  else {
    container.textContent = null;
    container.append?.(...children);
  }
  const restore = (): void => {
    if (container.replaceChildren && hadNodes.length > 0) {
      container.replaceChildren(...hadNodes);
    } else {
      container.textContent = priorText;
    }
  };
  return { items: spans, restore };
}

function bindList(
  member: Extract<DrawnMember, { readonly kind: "list" }>,
  selector: string,
  rawMatches: readonly unknown[],
  root: PageRoot,
): BoundTarget {
  if (rawMatches.length === 0)
    throw new Error(`mount: "${member.name}" (${selector}) matched no node on the page.`);
  const matches = rawMatches.map((node, index) =>
    needElement(node, `${member.name}[${index}]`, selector),
  );
  const first = matches[0];
  if (first === undefined)
    throw new Error(`mount: "${member.name}" (${selector}) matched no node on the page.`);
  if (matches.length === 1) {
    const kids = childElementsOf(first);
    if (kids.length > 0) return { member, node: first, items: kids };
    const doc = documentOf(first, root);
    if (member.split !== undefined && doc !== undefined) {
      const wrapped = wrapSplitText(first, member.name, member.split, doc);
      return { member, node: first, items: wrapped.items, restore: wrapped.restore };
    }
  }
  return { member, node: first, items: matches };
}

function parentNodeOf(node: unknown): unknown {
  if (!isObjectRecord(node)) return undefined;
  const parent: unknown = Reflect.get(node, "parentElement");
  return isObjectRecord(parent) ? parent : undefined;
}

function rectOf(node: PageElement): RawRect {
  const measured = node.getBoundingClientRect?.();
  if (measured !== undefined) {
    return {
      left: measured.left,
      top: measured.top,
      bottom: measured.bottom ?? measured.top + measured.height,
      width: measured.width,
      height: measured.height,
    };
  }
  const left = node.offsetLeft ?? 0;
  const top = node.offsetTop ?? 0;
  const width = node.offsetWidth ?? 0;
  const height = node.offsetHeight ?? 0;
  return { left, top, bottom: top + height, width, height };
}

function cssPx(value: string | undefined): number | undefined {
  if (value === undefined || value === "" || value === "auto") return undefined;
  const trimmed = value.trim();
  if (trimmed !== "0" && !trimmed.endsWith("px")) return undefined;
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function computeLines(rects: readonly RawRect[]): readonly number[] {
  if (rects.length === 0) return [];
  const rows: { top: number; height: number; items: number[] }[] = [];
  rects.forEach((rect, index) => {
    const match = rows.find((row) => {
      const tolerance = Math.max(2, Math.min(rect.height, row.height) * 0.5);
      return Math.abs(rect.top - row.top) <= tolerance;
    });
    if (match !== undefined) match.items.push(index);
    else rows.push({ top: rect.top, height: rect.height, items: [index] });
  });
  rows.sort((a, b) => a.top - b.top);
  const lines = new Array<number>(rects.length).fill(0);
  rows.forEach((row, lineIndex) => {
    for (const itemIndex of row.items) lines[itemIndex] = lineIndex;
  });
  return Object.freeze(lines);
}

interface StickyAncestor {
  readonly element: Element & { readonly style: PageStyle };
  readonly topPin: number | undefined;
  readonly marginBottom: number;
}

function styleableDomElement(
  value: unknown,
): (Element & { readonly style: PageStyle }) | undefined {
  return isDomElement(value) && isPageElement(value) ? value : undefined;
}

function inspectAncestors(
  node: PageElement,
  stickyCache: Map<Element, StickyAncestor>,
): {
  readonly isFixed: boolean;
  readonly sticky?: StickyAncestor;
} {
  if (typeof globalThis.getComputedStyle !== "function") return { isFixed: false };
  let sticky: StickyAncestor | undefined;
  let current: unknown = node;
  while (isDomElement(current)) {
    const cached = stickyCache.get(current);
    if (cached !== undefined && sticky === undefined) {
      sticky = cached;
      current = current.parentElement;
      continue;
    }
    const computed = globalThis.getComputedStyle(current);
    if (computed.position === "fixed") return { isFixed: true };
    if (computed.position === "sticky" && sticky === undefined) {
      const styled = styleableDomElement(current);
      if (styled !== undefined) {
        const entry: StickyAncestor = {
          element: styled,
          topPin: cssPx(computed.top),
          marginBottom: cssPx(computed.marginBottom) ?? 0,
        };
        stickyCache.set(current, entry);
        sticky = entry;
      }
    }
    current = current.parentElement;
  }
  return sticky === undefined ? { isFixed: false } : { isFixed: false, sticky };
}

function boxForNode(
  rect: RawRect,
  scrollX: number,
  scrollY: number,
  stickyState:
    | {
        readonly topPin: number | undefined;
        readonly marginBottom: number;
        readonly stickyRect: RawRect;
        readonly containerRect?: RawRect;
        readonly containerStyle?: CSSStyleDeclaration;
      }
    | undefined,
  isFixed: boolean,
): Box {
  if (isFixed) {
    const box: Box = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    };
    return withPlacement(box, { kind: "fixed" });
  }
  const flowBox: Box = {
    x: rect.left + scrollX + rect.width / 2,
    y: rect.top + scrollY + rect.height / 2,
    width: rect.width,
    height: rect.height,
  };
  if (stickyState !== undefined && stickyState.topPin !== undefined) {
    const { topPin, marginBottom } = stickyState;
    const stickyFlowTop = stickyState.stickyRect.top + scrollY;
    const elFlowTop = rect.top + scrollY;
    const elInsideSticky = elFlowTop - stickyFlowTop;
    const paddingBottom = cssPx(stickyState.containerStyle?.paddingBottom) ?? 0;
    const borderBottom = cssPx(stickyState.containerStyle?.borderBottomWidth) ?? 0;
    const containerBottom =
      (stickyState.containerRect?.bottom ??
        stickyState.stickyRect.top + stickyState.stickyRect.height) + scrollY;
    const maxStickyTop =
      containerBottom - borderBottom - paddingBottom - marginBottom - stickyState.stickyRect.height;
    const minY = stickyFlowTop - topPin;
    const maxY = Math.max(minY, maxStickyTop - topPin);
    const pinY = topPin + elInsideSticky + rect.height / 2;
    const placement: BoxPlacement = { kind: "sticky", minY, maxY, pinY };
    return withPlacement(flowBox, placement);
  }
  return withPlacement(flowBox, { kind: "flow" });
}

// Tests set this to run the whole scene on every frame, to compare with frames run for a cause.
const CLOCK_FRAMES_OFF = Symbol.for("@gerak/dom/clock-frames-off");
// Tests set this to keep every element in the engine, to compare with what the browser plays.
const COMPOSITOR_OFF = Symbol.for("@gerak/dom/compositor-off");
// The page tools set this while they hold the clock; every element stays in the engine, so what they read
// is the pose `frame()` gives, with no browser frame to wait for.
const HELD_CLOCK = Symbol.for("@gerak/dom/held-clock");
const TRIGGER_SLACK_MS = 34;

/** Animates existing page DOM nodes driven by one live clock combining scroll, pointer, and triggers. */
/** Plays a scene over the cast its markup tags `data-cast`, on a live or timed clock, in place or fitted to its frame. */
export function mount(input: StageInput, options: MountOptions): Mounted {
  let stage = resolvePageStage(input);
  const binders = options.binders ?? [];
  checkBinders(stage, binders);
  const root = options.root ?? (isPageRoot(globalThis.document) ? globalThis.document : undefined);
  if (root === undefined || !isPageRoot(root))
    throw new Error("mount: no document or `options.root` to query.");

  const doc = isPageDocument(root)
    ? root
    : isPageDocument(root.ownerDocument)
      ? root.ownerDocument
      : undefined;
  const framing = options.frame ?? "page";
  let fitted: HTMLElement | undefined;
  switch (framing) {
    case "page":
      break;
    case "fit": {
      const element: unknown = root;
      if (typeof HTMLElement === "undefined" || !(element instanceof HTMLElement))
        throw new Error('mount: `frame: "fit"` needs `root` to be an element.');
      fitted = element;
      break;
    }
    default:
      return unreachable(framing);
  }
  const targets: BoundTarget[] = [];
  const byName = new Map<string, BoundTarget>();
  const allNodes: PageElement[] = [];

  try {
    for (const member of stage.members) {
      const given = options.nodes?.[member.name];
      const selector = given === undefined ? member.node : `nodes["${member.name}"]`;
      if (selector === undefined) continue;
      const found = (): readonly unknown[] => {
        if (given === undefined) return Array.from(root.querySelectorAll(selector));
        return isPageElement(given) ? [given] : given;
      };
      let bound: BoundTarget;
      switch (member.kind) {
        case "object":
          continue;
        case "actor":
        case "group": {
          const raw = found()[0];
          if (raw === undefined)
            throw new Error(`mount: "${member.name}" (${selector}) matched no node on the page.`);
          const node = needElement(raw, member.name, selector);
          bound = { member, node, items: [] };
          allNodes.push(node);
          break;
        }
        case "list":
          bound = bindList(member, selector, found(), root);
          allNodes.push(...bound.items);
          break;
        default:
          return unreachable(member);
      }
      targets.push(bound);
      byName.set(member.name, bound);
    }
  } catch (error) {
    for (const target of targets) target.restore?.();
    throw error;
  }

  const boundCounts: Record<string, number> = {};
  for (const target of targets)
    if (target.member.kind === "list") boundCounts[target.member.name] = target.items.length;
  const currentCounts: Readonly<Record<string, number>> = Object.freeze(boundCounts);

  const globalView: PageScrollTarget | undefined = isScrollTarget(globalThis.window)
    ? globalThis.window
    : undefined;
  const view: PageScrollTarget | undefined = isScrollTarget(root.defaultView)
    ? root.defaultView
    : isScrollTarget(doc?.defaultView)
      ? doc.defaultView
      : globalView;
  const scrollTarget = options.scrollTarget ?? view;

  const readScrollY = (): number => {
    const raw =
      scrollTarget?.scrollY ??
      scrollTarget?.scrollTop ??
      (isObjectRecord(root.documentElement)
        ? Reflect.get(root.documentElement, "scrollTop")
        : undefined) ??
      0;
    return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
  };
  const readScrollX = (): number => {
    const raw =
      scrollTarget?.scrollX ??
      scrollTarget?.scrollLeft ??
      (isObjectRecord(root.documentElement)
        ? Reflect.get(root.documentElement, "scrollLeft")
        : undefined) ??
      0;
    return typeof raw === "number" && Number.isFinite(raw) ? raw : 0;
  };
  const readViewport = (): { readonly width: number; readonly height: number } => {
    if (options.viewport !== undefined) return options.viewport();
    const w = view?.innerWidth ?? scrollTarget?.innerWidth;
    const h = view?.innerHeight ?? scrollTarget?.innerHeight;
    if (typeof w === "number" && w > 0 && typeof h === "number" && h > 0)
      return { width: w, height: h };
    if (isObjectRecord(root.documentElement)) {
      const cw: unknown = Reflect.get(root.documentElement, "clientWidth");
      const ch: unknown = Reflect.get(root.documentElement, "clientHeight");
      if (typeof cw === "number" && cw > 0 && typeof ch === "number" && ch > 0)
        return { width: cw, height: ch };
    }
    return { width: 1280, height: 720 };
  };

  // A fitted root's CSS size is the frame; it is clipped and scaled about its top left to fit its parent.
  const fittedSize = (root: HTMLElement): { readonly width: number; readonly height: number } => {
    const size = { width: root.offsetWidth, height: root.offsetHeight };
    if (!(size.width > 0 && size.height > 0))
      throw new Error('mount: a root with `frame: "fit"` needs a width and height in its CSS.');
    return size;
  };
  // The page tools find a fitted root by its `data-gerak-frame` attribute.
  if (fitted !== undefined) {
    fittedSize(fitted);
    Object.assign(fitted.style, { overflow: "hidden", transformOrigin: "0 0" });
    fitted.setAttribute("data-gerak-frame", "");
  }
  const scaleFrame = (): void => {
    if (fitted === undefined) return;
    const frame = fittedSize(fitted);
    const parent = fitted.parentElement;
    const box =
      parent !== null && parent.clientWidth > 0 && parent.clientHeight > 0
        ? { width: parent.clientWidth, height: parent.clientHeight }
        : readViewport();
    const scale = Math.min(box.width / frame.width, box.height / frame.height);
    fitted.style.transform = Number.isFinite(scale) && scale !== 1 ? `scale(${scale})` : "";
  };

  let currentRest: Rest = {};
  let currentReader: RestReader = restReader();
  let currentLines: Readonly<Record<string, readonly number[]>> = {};

  const measure = (): void => {
    const savedTransforms = new Map<PageElement, string | undefined>();
    const savedSticky = new Map<
      Element & { readonly style: PageStyle },
      {
        readonly position: string | undefined;
        readonly top: string | undefined;
        readonly right: string | undefined;
        readonly bottom: string | undefined;
        readonly left: string | undefined;
      }
    >();
    const stickyCache = new Map<Element, StickyAncestor>();
    const ancestors = new Map<
      PageElement,
      { readonly isFixed: boolean; readonly sticky?: StickyAncestor }
    >();

    // Inspect computed positions before mutating inline styles so sticky containers stay visible to siblings.
    // A fitted root's cast is measured in frame px, from the root's unscaled top left.
    const placeOf = (node: PageElement) =>
      fitted === undefined ? inspectAncestors(node, stickyCache) : { isFixed: false };
    for (const node of allNodes) {
      ancestors.set(node, placeOf(node));
    }
    for (const target of targets) {
      if (!ancestors.has(target.node)) {
        ancestors.set(target.node, placeOf(target.node));
      }
    }

    if (fitted !== undefined) fitted.style.transform = "";
    const origin = fitted?.getBoundingClientRect();
    const scrollX = origin === undefined ? readScrollX() : -origin.left;
    const scrollY = origin === undefined ? readScrollY() : -origin.top;
    const nextRest: Record<string, Box> = {};
    const nextLines: Record<string, readonly number[]> = {};

    const stickySnapshots = new Map<
      Element,
      {
        readonly topPin: number | undefined;
        readonly marginBottom: number;
        readonly stickyRect: RawRect;
        readonly containerRect?: RawRect;
        readonly containerStyle?: CSSStyleDeclaration;
      }
    >();
    const snapshotSticky = (ancestor: StickyAncestor | undefined) => {
      if (ancestor === undefined) return undefined;
      const held = stickySnapshots.get(ancestor.element);
      if (held !== undefined) return held;
      const stickyRect = rectOf(ancestor.element);
      const parentEl = styleableDomElement(ancestor.element.parentElement);
      const containerRect = parentEl === undefined ? undefined : rectOf(parentEl);
      const containerStyle =
        parentEl !== undefined && typeof globalThis.getComputedStyle === "function"
          ? globalThis.getComputedStyle(parentEl)
          : undefined;
      const snap = {
        topPin: ancestor.topPin,
        marginBottom: ancestor.marginBottom,
        stickyRect,
        ...(containerRect === undefined ? {} : { containerRect }),
        ...(containerStyle === undefined ? {} : { containerStyle }),
      };
      stickySnapshots.set(ancestor.element, snap);
      return snap;
    };

    try {
      for (const node of allNodes) {
        savedTransforms.set(node, node.style.transform);
        node.style.transform = "";
      }
      for (const { sticky } of ancestors.values()) {
        if (sticky !== undefined && !savedSticky.has(sticky.element)) {
          const { style } = sticky.element;
          savedSticky.set(sticky.element, {
            position: style.position,
            top: style.top,
            right: style.right,
            bottom: style.bottom,
            left: style.left,
          });
          style.position = "relative";
          style.top = "auto";
          style.right = "auto";
          style.bottom = "auto";
          style.left = "auto";
        }
      }

      for (const target of targets) {
        const { member } = target;
        switch (member.kind) {
          case "list": {
            const itemRects = target.items.map((item) => rectOf(item));
            target.items.forEach((item, index) => {
              const info = ancestors.get(item) ?? { isFixed: false };
              const rect = itemRects[index];
              if (rect === undefined) return;
              nextRest[`${member.name}.${index}`] = boxForNode(
                rect,
                scrollX,
                scrollY,
                snapshotSticky(info.sticky),
                info.isFixed,
              );
            });
            if (member.split !== undefined || target.items.length > 0) {
              nextLines[member.name] = computeLines(itemRects);
            }
            const containerRect = rectOf(target.node);
            const containerInfo = ancestors.get(target.node) ?? { isFixed: false };
            nextRest[member.name] = boxForNode(
              containerRect,
              scrollX,
              scrollY,
              snapshotSticky(containerInfo.sticky),
              containerInfo.isFixed,
            );
            break;
          }
          case "actor":
          case "group": {
            const info = ancestors.get(target.node) ?? { isFixed: false };
            nextRest[member.name] = boxForNode(
              rectOf(target.node),
              scrollX,
              scrollY,
              snapshotSticky(info.sticky),
              info.isFixed,
            );
            break;
          }
          default:
            return unreachable(member);
        }
      }
      drawPaths(nextRest);
    } finally {
      scaleFrame();
      for (const [el, prev] of savedSticky) {
        el.style.position = prev.position ?? "";
        el.style.top = prev.top ?? "";
        el.style.right = prev.right ?? "";
        el.style.bottom = prev.bottom ?? "";
        el.style.left = prev.left ?? "";
      }
      for (const [node, prev] of savedTransforms) node.style.transform = prev ?? "";
    }

    currentRest = Object.freeze(nextRest);
    currentReader = restReader(currentRest);
    currentLines = Object.freeze(nextLines);
  };

  // A shape's path is drawn from the measured boxes, written on its bound `<path>`, and rests at its bounds.
  function drawPaths(boxes: Record<string, Box>): void {
    const shapes = targets.filter(
      (target) => target.member.kind === "actor" && target.member.content.kind === "stroke",
    );
    if (shapes.length === 0) return;
    const drawn = drawStrokes(stage, restReader(boxes));
    if (!drawn.ok) throw new Error(`mount: ${formatStageError(drawn.error)}`);
    const [failure] = drawn.strokes.failures;
    if (failure !== undefined)
      throw new Error(`mount: the path of "${failure.name}" failed: ${String(failure.error)}`, {
        cause: failure.error,
      });
    for (const { member, node } of shapes) {
      const cubics = drawn.strokes.cubics.get(member.name);
      if (cubics === undefined) continue;
      node.setAttribute?.("d", pathData(cubics));
      boxes[member.name] = restOfBounds(strokeBox(cubics));
    }
  }

  measure();

  const frames = options.frames ?? pageFrames();
  const now = options.now ?? (() => globalThis.performance.now());
  const start = now();
  const elapsed = (): number => Math.max(0, now() - start);
  // A timed mount runs on a seekable clock over the scene's length, each frame the whole scene.
  let timed: ClockDriver | undefined;
  switch (options.clock) {
    case "live":
      break;
    case "timed":
      timed = clockDriver({ duration: stage.durationMs, frames });
      break;
    default:
      return unreachable(options.clock);
  }
  const settleMs = options.settleMs ?? stage.settleMs ?? 2000;
  const ambient = stage.members.some((member) => member.expect === "ambient");
  let introMs = 0;
  for (const b of Object.values(stage.beats)) introMs = Math.max(introMs, b.to);
  for (const cue of stage.cues) introMs = Math.max(introMs, cue.at + settleMs);

  let activeUntil = introMs;
  let frameHandle: number | undefined;
  let live = true;
  const listeners = new Set<() => void>();
  let lastScrollY = readScrollY();

  const notify = (): void => {
    for (const listener of [...listeners]) listener();
  };

  // An input logs and asks for a frame, which runs the whole scene once; with no input,
  // a frame runs only the elements that move with time alone.
  let fresh = true;
  // The last frame's reading of how elements move: what it ran, and what an earlier frame said of the rest.
  let earlierMoves: ReadonlyMap<string, Moves> = new Map();
  let frameMoves = new Map<string, Moves>();
  let frameOnly: ReadonlySet<string> | undefined;
  let runOnly: ReadonlySet<string> | undefined;
  // The elements the engine runs while the browser plays the rest; undefined when it plays none.
  let engineOnly: ReadonlySet<string> | undefined;
  let handed = new Map<string, Animation[]>();
  let triggerRuns: TriggerRun[] = [];
  // Set once the hand-off is defined below; a frame before then has no trigger to follow.
  let syncTriggers = (): void => undefined;
  const lastMoves = (): ReadonlyMap<string, Moves> => {
    if (frameOnly === undefined) return frameMoves;
    const merged = new Map(earlierMoves);
    for (const name of frameOnly) merged.delete(name);
    for (const [name, kind] of frameMoves) merged.set(name, kind);
    return merged;
  };
  const hasReadout = targets.some(
    (target) => target.member.kind === "actor" && target.member.content.kind === "readout",
  );
  const ambientNames = stage.members
    .filter((member) => member.expect === "ambient")
    .map((member) => member.name);
  const recorder = eventRecorder(elapsed, (at) => {
    activeUntil = Math.max(activeUntil, at + settleMs);
    fresh = true;
    schedule();
  });
  // What the next frame runs is decided when it is asked for, as the clock stands then.
  let wholeNext = true;
  let maybeNext = true;
  const movingNow = (withMaybe: boolean): Set<string> => {
    const names = new Set<string>(ambientNames);
    for (const [name, kind] of lastMoves())
      switch (kind) {
        case "time":
          names.add(name);
          break;
        case "maybe":
          if (withMaybe) names.add(name);
          break;
        default:
          unreachable(kind);
      }
    return names;
  };

  const syncScroll = (): boolean => {
    const nextY = readScrollY();
    if (nextY === lastScrollY) return false;
    lastScrollY = nextY;
    recorder.sample(INPUT_EVENTS.scroll, nextY);
    return true;
  };

  const tick = (): void => {
    frameHandle = undefined;
    if (!live) return;
    syncScroll();
    const whole =
      fresh || wholeNext || hasReadout || Reflect.get(globalThis, CLOCK_FRAMES_OFF) === true;
    fresh = false;
    if (whole) {
      syncTriggers();
      runOnly = undefined;
      notify();
    } else {
      const names = movingNow(maybeNext);
      if (names.size > 0) {
        runOnly = names;
        notify();
        runOnly = undefined;
      }
    }
    const now = elapsed();
    wholeNext = now < introMs;
    maybeNext = now < activeUntil;
    if (live && (ambient || wholeNext || movingNow(maybeNext).size > 0)) schedule();
  };

  function schedule(): void {
    if (live && timed === undefined && frameHandle === undefined)
      frameHandle = frames.requestFrame(tick);
  }

  if (lastScrollY !== 0) recorder.sample(INPUT_EVENTS.scroll, lastScrollY);

  const unwatch: (() => void)[] = [];
  const watchNode = (name: string, node: PageElement): (() => void) =>
    timed === undefined ? recorder.watch(name, node) : timed.watch(name, node);
  for (const target of targets) {
    const member = target.member;
    if (!member.watch) continue;
    switch (member.kind) {
      case "list":
        target.items.forEach((item, index) =>
          unwatch.push(watchNode(`${member.name}.${index}`, item)),
        );
        break;
      case "actor":
      case "group":
        unwatch.push(watchNode(member.name, target.node));
        break;
      default:
        return unreachable(member);
    }
  }

  const onScroll = (): void => {
    syncScroll();
  };
  if (timed === undefined) scrollTarget?.addEventListener("scroll", onScroll, { passive: true });

  const onPointerMove = (event: StageEvent): void => {
    if (event.clientX === undefined || event.clientY === undefined) return;
    const vp = readViewport();
    if (!(vp.width > 0 && vp.height > 0)) return;
    const x = clamp(event.clientX / vp.width, 0, 1);
    const y = clamp(event.clientY / vp.height, 0, 1);
    recorder.sample(INPUT_EVENTS.pointerX, x);
    recorder.sample(INPUT_EVENTS.pointerY, y);
  };
  const pointerTarget = eventTargetOf(root, doc);
  if (timed === undefined) pointerTarget.add(onPointerMove);

  const driver: Driver = timed ?? {
    now: (): Time => liveAt(elapsed()),
    events: (): Events => recorder.log,
    options,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };

  const hiddenByUs = new WeakSet<PageElement>();
  let lastFrame: FrameOutput | undefined;

  // Built again only when the page is measured again.
  let boxesFor: RestReader | undefined;
  let boxes: Readonly<Record<string, RestReader>> = {};
  const sceneSignal: Signal<StageValues> = (time, events) => {
    if (boxesFor !== currentReader) {
      boxesFor = currentReader;
      boxes = Object.fromEntries(stage.layouts.names.map((name) => [name, currentReader]));
    }
    const only = runOnly ?? engineOnly;
    const moves = new Map<string, Moves>();
    const ran = frameOf(stage, {
      time,
      events,
      boxes,
      counts: currentCounts,
      lines: currentLines,
      moves,
      ...(only === undefined ? {} : { only }),
    });
    earlierMoves = lastMoves();
    frameMoves = moves;
    frameOnly = only;
    const out =
      only === undefined || lastFrame === undefined
        ? ran
        : { ...ran, targets: { ...lastFrame.targets, ...ran.targets } };
    for (const target of targets) {
      const { member } = target;
      if (member.kind === "actor" && member.content.kind === "readout") {
        const text = member.content.format(time);
        if (target.node.textContent !== text) target.node.textContent = text;
      }
    }
    if (options.checks === true) {
      const errors = check(stage, out.targets, currentCounts);
      if (errors.length > 0)
        throw new TypeError(`mount: ${errors.map(formatStageError).join(" ")}`);
    }
    lastFrame = out;
    return out.targets;
  };

  const player = play<StageValues>(
    sceneSignal,
    driver,
    stage.cues.length === 0 ? {} : { cues: stage.cues },
  );
  options.onDriver?.(driver);
  let stops = binders.map((binder) => binder.start(player, stage));

  const applyVisibility = (node: PageElement, visible: boolean): void => {
    if (!visible) {
      node.style.visibility = "hidden";
      hiddenByUs.add(node);
    } else if (hiddenByUs.has(node)) {
      node.style.visibility = "";
      hiddenByUs.delete(node);
    }
  };

  const applyPose = (node: PageElement, content: Content | undefined, pose: Pose2d): void => {
    applyValue(node, pose);
    if (content?.kind === "morph") applyPath(node, morphAt(content, pose));
  };

  const bindTarget = (target: BoundTarget, value: unknown): void => {
    const member = target.member;
    const ran = runOnly ?? engineOnly;
    if (ran !== undefined && !ran.has(member.name)) {
      // Presence follows the clock, so it is applied on every frame, run or not.
      const shown = lastFrame?.visible[member.name] ?? true;
      if (member.kind === "list") for (const item of target.items) applyVisibility(item, shown);
      else applyVisibility(target.node, shown);
      return;
    }
    const visible = lastFrame?.visible[member.name] ?? true;
    switch (member.kind) {
      case "list": {
        const count = target.items.length;
        target.items.forEach((item, index) => {
          applyVisibility(item, visible);
          if (!visible || value === undefined) return;
          const pose = listPose(value, index, count);
          if (pose !== undefined) applyPose(item, undefined, pose);
        });
        break;
      }
      case "actor":
        applyVisibility(target.node, visible);
        if (!visible || value === undefined) return;
        {
          const pose = poseOf(value);
          if (pose !== undefined) applyPose(target.node, member.content, pose);
        }
        break;
      case "group":
        applyVisibility(target.node, visible);
        if (!visible || value === undefined) return;
        {
          const pose = poseOf(value);
          if (pose !== undefined) applyPose(target.node, undefined, pose);
        }
        break;
      default:
        return unreachable(member);
    }
  };

  for (const target of targets) {
    player.subscribe(target.member.name, (value) => bindTarget(target, value));
  }

  // Scroll-driven elements play on a scroll timeline, trigger-driven ones on the document timeline
  // steered by their beat; the engine runs the rest.
  const release = (): void => {
    for (const animations of handed.values())
      for (const animation of animations) animation.cancel();
    handed = new Map();
    triggerRuns = [];
    engineOnly = undefined;
  };
  syncTriggers = (): void => {
    if (triggerRuns.length === 0) return;
    const time = liveAt(elapsed());
    const context = { events: recorder.log, rest: currentReader };
    for (const run of triggerRuns) {
      const { beat } = run;
      const heading = beat.heading(time, context);
      const at = beat.of(time, undefined, context).progress * beat.ms;
      // A running animation is left alone while it is where the beat says, within two frames.
      const playing = run.animations[0]?.currentTime;
      const near = typeof playing === "number" && Math.abs(playing - at) <= TRIGGER_SLACK_MS;
      if (heading !== 0 && heading === run.heading && near) continue;
      run.heading = heading;
      for (const animation of run.animations) {
        animation.currentTime = at;
        if (heading === 0) animation.pause();
        else {
          animation.playbackRate = heading;
          animation.play();
        }
      }
    }
  };
  const nodesOf = (target: BoundTarget): readonly PageElement[] =>
    target.member.kind === "list" ? target.items : [target.node];
  const handOff = (): void => {
    release();
    if (timed !== undefined || fitted !== undefined) return;
    if (Reflect.get(globalThis, COMPOSITOR_OFF) === true) return;
    if (Reflect.get(globalThis, HELD_CLOCK) === true) return;
    const Timeline: unknown = Reflect.get(globalThis, "ScrollTimeline");
    const source = doc?.documentElement;
    if (typeof Timeline !== "function" || !isDomElement(source)) return;
    if (scrollTarget === undefined || scrollTarget !== doc?.defaultView) return;
    const maxScroll = source.scrollHeight - source.clientHeight;
    const names = new Set<string>();
    for (const target of targets) {
      const { member } = target;
      if (member.on !== undefined || member.expect === "ambient") continue;
      if (!nodesOf(target).every(isDomElement)) continue;
      switch (member.kind) {
        case "actor":
          if (member.content.kind === "readout" || member.content.kind === "morph") continue;
          break;
        case "list":
        case "group":
          break;
        default:
          unreachable(member);
      }
      names.add(member.name);
    }
    if (names.size === 0) return;
    const reader = currentReader;
    const input = {
      boxes: Object.fromEntries(stage.layouts.names.map((name) => [name, reader])),
      counts: currentCounts,
      lines: currentLines,
      rest: reader,
      names,
    };
    let scrolled: ReadonlyMap<string, Track> = new Map();
    let triggered: ReadonlyMap<string, TriggerTrack> = new Map();
    try {
      scrolled = maxScroll > 0 ? scrollTracks(stage, input, maxScroll) : new Map();
      const left = new Set([...names].filter((name) => !scrolled.has(name)));
      triggered = triggerTracks(stage, { ...input, names: left });
    } catch {
      // A motion that throws at a place the page has not reached stays the engine's to report.
      return;
    }
    const next = new Map<string, Animation[]>();
    const play = (
      name: string,
      track: Track,
      at: number,
      animate: (node: Element, keyframes: Keyframe[]) => Animation,
      length: number,
    ): Animation[] => {
      const target = byName.get(name);
      if (target === undefined) return [];
      const nodes = nodesOf(target);
      const animations: Animation[] = [];
      track.parts.forEach((samples, index) => {
        const node = nodes[index];
        if (node === undefined || !isDomElement(node)) return;
        const near = sampleNear(samples, at);
        if (near !== undefined)
          applyValue(node, {
            ...near.fields,
            ...(track.anchor === undefined ? {} : { anchor: track.anchor }),
          });
        const keyframes = trackKeyframes(samples, length);
        if (keyframes.length > 0) animations.push(animate(node, keyframes));
      });
      next.set(name, animations);
      return animations;
    };

    const timeline: unknown =
      scrolled.size > 0 ? Reflect.construct(Timeline, [{ source, axis: "block" }]) : undefined;
    if (timeline instanceof AnimationTimeline) {
      const y = readScrollY();
      for (const [name, track] of scrolled)
        play(
          name,
          track,
          y,
          (node, keyframes) => node.animate(keyframes, { timeline, fill: "both" }),
          maxScroll,
        );
    }
    const runs = new Map<TriggerBeat, TriggerRun>();
    for (const [name, track] of triggered) {
      const { beat } = track;
      const animations = play(
        name,
        track,
        0,
        (node, keyframes) => {
          const animation = node.animate(keyframes, {
            duration: beat.ms,
            fill: "both",
            easing: "linear",
          });
          animation.pause();
          return animation;
        },
        beat.ms,
      );
      const run = runs.get(beat) ?? { beat, animations: [], heading: undefined };
      runs.set(beat, { ...run, animations: [...run.animations, ...animations] });
    }
    triggerRuns = [...runs.values()];
    if (next.size === 0) return;
    handed = next;
    engineOnly = new Set(
      stage.members.map((member) => member.name).filter((name) => !handed.has(name)),
    );
    syncTriggers();
  };
  handOff();

  schedule();

  const remeasure = (): void => {
    if (!live) return;
    release();
    measure();
    handOff();
    syncScroll();
    player.refresh();
  };

  const onResize = (): void => remeasure();
  if (
    view !== undefined &&
    isObjectRecord(view) &&
    typeof Reflect.get(view, "addEventListener") === "function" &&
    typeof Reflect.get(view, "removeEventListener") === "function"
  ) {
    view.addEventListener("resize", onResize);
  }

  const fonts = root.fonts ?? doc?.fonts;
  const fontsLoaded = (): void => remeasure();
  fonts?.addEventListener("loadingdone", fontsLoaded);
  void fonts?.ready.then(fontsLoaded);

  const observer =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => remeasure()) : undefined;
  if (observer !== undefined) {
    if (isDomElement(root.documentElement)) observer.observe(root.documentElement);
    else if (isDomElement(root)) observer.observe(root);
    const holder = fitted?.parentElement;
    if (holder !== undefined && holder !== null) observer.observe(holder);
    for (const target of targets) {
      if (isDomElement(target.node)) observer.observe(target.node);
      for (const item of target.items) if (isDomElement(item)) observer.observe(item);
    }
  }

  const nameOfNode = new Map<unknown, string>();
  for (const target of targets) {
    target.items.forEach((item, index) => nameOfNode.set(item, `${target.member.name}.${index}`));
    if (!nameOfNode.has(target.node)) nameOfNode.set(target.node, target.member.name);
  }
  const parentOf = (node: unknown): string | undefined => {
    for (let up = parentNodeOf(node); up !== undefined; up = parentNodeOf(up)) {
      const name = nameOfNode.get(up);
      if (name !== undefined) return name;
    }
    return undefined;
  };
  const measurement = (): Measurement => {
    const rest: Record<string, MeasuredBox> = {};
    for (const [name, box] of Object.entries(currentRest))
      rest[name] = {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
        placement: placementOf(box),
      };
    const parents: Record<string, string> = {};
    for (const [node, name] of nameOfNode) {
      const parent = parentOf(node);
      if (parent !== undefined) parents[name] = parent;
    }
    const frame = fitted === undefined ? readViewport() : fittedSize(fitted);
    return { frame, rest, lines: currentLines, parents };
  };

  const listed: unknown = Reflect.get(globalThis, MOUNTS);
  const mounts: unknown[] = Array.isArray(listed) ? listed : [];
  Reflect.set(globalThis, MOUNTS, mounts);

  const mounted: Mounted = {
    player,
    driver,
    get rest() {
      return currentRest;
    },
    get lines() {
      return currentLines;
    },
    remeasure,
    measure: measurement,
    replace(next) {
      const nextStage = resolvePageStage(next);
      if (nextStage.signature !== stage.signature)
        throw new Error("mount.replace: the next scene has a different cast or length.");
      stage = nextStage;
      for (const target of targets) {
        const member = nextStage.members.find((each) => each.name === target.member.name);
        if (member !== undefined && member.kind === target.member.kind) target.member = member;
      }
      remeasure();
      for (const stop of stops) stop();
      player.replace(sceneSignal, nextStage.cues);
      stops = binders.map((binder) => binder.start(player, stage));
    },
    send(name, value, target) {
      if (!live) return;
      if (timed === undefined) recorder.sample(name, value, target);
      else timed.send(name, value, target);
    },
    events: () => (timed === undefined ? recorder.log : timed.events()),
    dispose() {
      if (!live) return;
      live = false;
      if (frameHandle !== undefined) frames.cancelFrame(frameHandle);
      frameHandle = undefined;
      scrollTarget?.removeEventListener("scroll", onScroll);
      pointerTarget.remove(onPointerMove);
      if (
        view !== undefined &&
        isObjectRecord(view) &&
        typeof Reflect.get(view, "removeEventListener") === "function"
      ) {
        view.removeEventListener("resize", onResize);
      }
      observer?.disconnect();
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      for (const stop of unwatch) stop();
      release();
      recorder.dispose();
      player.dispose();
      timed?.dispose();
      for (const stop of stops) stop();
      listeners.clear();
      for (const node of allNodes) {
        applyValue(node, {});
        if (hiddenByUs.has(node)) {
          node.style.visibility = "";
          hiddenByUs.delete(node);
        }
      }
      for (const target of targets) target.restore?.();
      fitted?.removeAttribute("data-gerak-frame");
      const at = mounts.indexOf(mounted);
      if (at >= 0) mounts.splice(at, 1);
    },
  };
  mounts.push(mounted);
  return mounted;
}
