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
import { morphAt, withPlacement, type BoxPlacement } from "@gerak/stage/render";
import {
  sampleNear,
  scrollTracks,
  trackKeyframes,
  triggerTracks,
  type Track,
  type TriggerTrack,
} from "./compositor";
import { eventRecorder, type EventSource } from "./events";
import { pageFrames, type FrameSource } from "./frames";
import { applyPath, applyValue, type RenderStyle } from "./render";
import type { StageEvent, StageFonts, StageInput, StageValues } from "./stage";

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

/** Minimal contract of a page DOM node animated by `mountPage`, real element or test double. */
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

/** Container queried by `mountPage` to resolve selectors and listen for viewport pointer motion. */
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

/** Settings of `mountPage`: root to query, scroll target, frame source, clock, settle window, and driver hook. */
export interface PageOptions {
  /** Document or container holding the page's elements; defaults to `document`. */
  readonly root?: PageRoot;
  readonly scrollTarget?: PageScrollTarget;
  readonly frames?: FrameSource;
  readonly settleMs?: number;
  readonly clock?: () => number;
  readonly viewport?: () => { readonly width: number; readonly height: number };
  readonly onDriver?: (driver: Driver) => void;
}

/** A playing page mount: its player, driver, measured rests and text lines, input logger, and cleanup. */
export interface MountedPage {
  readonly player: Player<StageValues>;
  readonly driver: Driver;
  /** Measured rest boxes by element name. */
  readonly rest: Rest;
  /** Visual line indices per split text element, updated on resize without changing part count. */
  readonly lines: Readonly<Record<string, readonly number[]>>;
  remeasure(): void;
  /** Logs a named numeric sample on the live clock and wakes the settle window. */
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
  readonly member: DrawnMember;
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
  throw new Error(`mountPage: "${memberName}" (${selector}) matched no styleable page element.`);
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
      throw new Error(
        `mountPage: invalid scene:\n${compiled.errors.map(formatStageError).join("\n")}`,
      );
    stage = compiled.stage;
  } else throw new Error("mountPage: expected a stage or what `sceneBuilder` returns.");

  if (stage.skins.dom !== undefined)
    throw new Error("mountPage: a page scene takes no skin; style the page with CSS.");
  const missing = stage.members
    .filter((member) => member.node === undefined && member.kind !== "object")
    .map((member) => `"${member.name}"`);
  if (missing.length > 0)
    throw new TypeError(
      `mountPage: every element needs \`{ node: el(selector) }\` (missing ${missing.join(", ")}).`,
    );
  return stage;
}

function wrapSplitText(
  container: PageElement,
  member: Extract<Member, { readonly kind: "list" }>,
  doc: PageDocument,
): { readonly items: readonly PageElement[]; readonly restore: () => void } {
  const hadNodes = container.childNodes !== undefined ? Array.from(container.childNodes) : [];
  const priorText = container.textContent;
  const spans: PageElement[] = [];
  const children: unknown[] = [];
  member.items.forEach((item, index) => {
    const span = needElement(doc.createElement("span"), `${member.name}.${index}`, "span");
    switch (item.kind) {
      case "text":
        span.textContent = item.value;
        break;
      case "box":
      case "stroke":
      case "morph":
        span.textContent = "";
        break;
      default:
        return unreachable(item);
    }
    span.style.display = "inline-block";
    if (member.split === "letters") span.style.whiteSpace = "pre";
    span.setAttribute?.("data-gerak-part", String(index));
    spans.push(span);
    children.push(span);
    if (member.split === "words" && index + 1 < member.items.length) {
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
  root: PageRoot,
): BoundTarget {
  const rawMatches = Array.from(root.querySelectorAll(selector));
  if (rawMatches.length === 0)
    throw new Error(`mountPage: "${member.name}" (${selector}) matched no node on the page.`);
  const matches = rawMatches.map((node, index) =>
    needElement(node, `${member.name}[${index}]`, selector),
  );
  const first = matches[0];
  if (first === undefined)
    throw new Error(`mountPage: "${member.name}" (${selector}) matched no node on the page.`);
  if (member.items.length === 0) return { member, node: first, items: [] };
  if (matches.length === 1) {
    const kids = childElementsOf(first);
    if (kids.length === member.items.length) return { member, node: first, items: kids };
    const doc = documentOf(first, root);
    if (kids.length === 0 && member.split !== undefined && doc !== undefined) {
      const wrapped = wrapSplitText(first, member, doc);
      return { member, node: first, items: wrapped.items, restore: wrapped.restore };
    }
    if (member.split === undefined && member.items.length === 1) {
      return { member, node: first, items: matches };
    }
    throw new Error(
      `mountPage: "${member.name}" (${selector}) matched 1 element with ${kids.length} children, expected ${member.items.length}.`,
    );
  }
  if (matches.length === member.items.length) return { member, node: first, items: matches };
  throw new Error(
    `mountPage: "${member.name}" (${selector}) matched ${matches.length} nodes, expected ${member.items.length}.`,
  );
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
export function mountPage(input: StageInput, options: PageOptions = {}): MountedPage {
  const stage = resolvePageStage(input);
  const root = options.root ?? (isPageRoot(globalThis.document) ? globalThis.document : undefined);
  if (root === undefined || !isPageRoot(root))
    throw new Error("mountPage: no document or `options.root` to query.");

  const doc = isPageDocument(root)
    ? root
    : isPageDocument(root.ownerDocument)
      ? root.ownerDocument
      : undefined;
  const targets: BoundTarget[] = [];
  const byName = new Map<string, BoundTarget>();
  const allNodes: PageElement[] = [];

  try {
    for (const member of stage.members) {
      const selector = member.node;
      if (selector === undefined) continue;
      let bound: BoundTarget;
      switch (member.kind) {
        case "object":
          continue;
        case "actor":
        case "group": {
          const raw = root.querySelector(selector);
          if (raw === null)
            throw new Error(
              `mountPage: "${member.name}" (${selector}) matched no node on the page.`,
            );
          const node = needElement(raw, member.name, selector);
          bound = { member, node, items: [] };
          allNodes.push(node);
          break;
        }
        case "list":
          bound = bindList(member, selector, root);
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
    for (const node of allNodes) {
      ancestors.set(node, inspectAncestors(node, stickyCache));
    }
    for (const target of targets) {
      if (!ancestors.has(target.node)) {
        ancestors.set(target.node, inspectAncestors(target.node, stickyCache));
      }
    }

    const scrollX = readScrollX();
    const scrollY = readScrollY();
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
    } finally {
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

  measure();

  const frames = options.frames ?? pageFrames();
  const clock = options.clock ?? (() => globalThis.performance.now());
  const start = clock();
  const elapsed = (): number => Math.max(0, clock() - start);
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
    if (live && frameHandle === undefined) frameHandle = frames.requestFrame(tick);
  }

  if (lastScrollY !== 0) recorder.sample(INPUT_EVENTS.scroll, lastScrollY);

  const unwatch: (() => void)[] = [];
  for (const target of targets) {
    const member = target.member;
    if (!member.watch) continue;
    switch (member.kind) {
      case "list":
        target.items.forEach((item, index) =>
          unwatch.push(recorder.watch(`${member.name}.${index}`, item)),
        );
        break;
      case "actor":
      case "group":
        unwatch.push(recorder.watch(member.name, target.node));
        break;
      default:
        return unreachable(member);
    }
  }

  const onScroll = (): void => {
    syncScroll();
  };
  scrollTarget?.addEventListener("scroll", onScroll, { passive: true });

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
  pointerTarget.add(onPointerMove);

  const driver: Driver = {
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
    lastFrame = out;
    return out.targets;
  };

  const player = play<StageValues>(
    sceneSignal,
    driver,
    stage.cues.length === 0 ? {} : { cues: stage.cues },
  );
  options.onDriver?.(driver);

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
        const count = member.items.length;
        target.items.forEach((item, index) => {
          applyVisibility(item, visible);
          if (!visible || value === undefined) return;
          const pose = listPose(value, index, count);
          if (pose !== undefined) applyPose(item, member.items[index], pose);
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
          if (member.items.some((item) => item.kind === "morph")) continue;
          break;
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
    for (const target of targets) {
      if (isDomElement(target.node)) observer.observe(target.node);
      for (const item of target.items) if (isDomElement(item)) observer.observe(item);
    }
  }

  return {
    player,
    driver,
    get rest() {
      return currentRest;
    },
    get lines() {
      return currentLines;
    },
    remeasure,
    send(name, value, target) {
      if (!live) return;
      recorder.sample(name, value, target);
    },
    events: () => recorder.log,
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
      listeners.clear();
      for (const node of allNodes) {
        applyValue(node, {});
        if (hiddenByUs.has(node)) {
          node.style.visibility = "";
          hiddenByUs.delete(node);
        }
      }
      for (const target of targets) target.restore?.();
    },
  };
}
