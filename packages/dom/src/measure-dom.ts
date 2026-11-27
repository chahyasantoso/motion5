import { unreachable } from "@gerak/core";
import {
  formatStageError,
  restReader,
  type Box,
  type ObjectBounds3d,
  type Rest,
  type RestReader,
  type Stage,
} from "@gerak/stage";
import {
  drawStrokes,
  placementOf,
  restOfBounds,
  strokeBox,
  withPlacement,
  type BoxPlacement,
} from "@gerak/stage/render";
import {
  fittedSizeOf,
  isDomElement,
  isObjectRecord,
  isPageElement,
  parentNodeOf,
  type Binder,
  type BoundTarget,
  type MeasuredBox,
  type Measurement,
  type PageDocument,
  type PageElement,
  type RawRect,
} from "./host";
import { pathData, type RenderStyle } from "./render";

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

function readBoundingRect(value: unknown): RawRect | undefined {
  if (!isObjectRecord(value)) return undefined;
  const fn: unknown = Reflect.get(value, "getBoundingClientRect");
  if (typeof fn !== "function") return undefined;
  const rect: unknown = Reflect.apply(fn, value, []);
  if (!isObjectRecord(rect)) return undefined;
  const left: unknown = Reflect.get(rect, "left");
  const top: unknown = Reflect.get(rect, "top");
  const width: unknown = Reflect.get(rect, "width");
  const height: unknown = Reflect.get(rect, "height");
  const bottom: unknown = Reflect.get(rect, "bottom");
  if (typeof left !== "number" || typeof top !== "number") return undefined;
  const w = typeof width === "number" ? width : 0;
  const h = typeof height === "number" ? height : 0;
  return {
    left,
    top,
    bottom: typeof bottom === "number" ? bottom : top + h,
    width: w,
    height: h,
  };
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
  readonly element: Element & { readonly style: RenderStyle & PageElement["style"] };
  readonly topPin: number | undefined;
  readonly marginBottom: number;
}

interface StickySnapshot {
  readonly topPin: number | undefined;
  readonly marginBottom: number;
  readonly stickyRect: RawRect;
  readonly containerRect?: RawRect;
  readonly containerStyle?: CSSStyleDeclaration;
}

function styleableDomElement(
  value: unknown,
): (Element & { readonly style: PageElement["style"] }) | undefined {
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
  stickyState: StickySnapshot | undefined,
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

function samePlacement(a: BoxPlacement, b: BoxPlacement): boolean {
  switch (a.kind) {
    case "flow":
    case "fixed":
      return b.kind === a.kind;
    case "sticky":
      return b.kind === "sticky" && a.minY === b.minY && a.maxY === b.maxY && a.pinY === b.pinY;
    default:
      return unreachable(a);
  }
}

export function sameBox(left: Box | undefined, right: Box | undefined): boolean {
  if (left === undefined || right === undefined) return left === right;
  return (
    left.x === right.x &&
    left.y === right.y &&
    left.width === right.width &&
    left.height === right.height &&
    samePlacement(placementOf(left), placementOf(right))
  );
}

export function sameLines(
  a: Readonly<Record<string, readonly number[]>>,
  b: Readonly<Record<string, readonly number[]>>,
): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => {
    const left = a[key];
    const right = b[key];
    return (
      left !== undefined &&
      right !== undefined &&
      left.length === right.length &&
      left.every((line, index) => line === right[index])
    );
  });
}

export function sameRest(a: Rest, b: Rest): boolean {
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every((key) => sameBox(a[key], b[key]));
}

/** Draws shape paths, writes their SVG `d`, and resolves viewport-aware placed rest boxes. */
function drawPaths(
  stage: Stage,
  targets: readonly BoundTarget[],
  boxes: Record<string, Box>,
  ancestors: ReadonlyMap<
    PageElement,
    { readonly isFixed: boolean; readonly sticky?: StickyAncestor }
  >,
  snapshotSticky: (ancestor: StickyAncestor | undefined) => StickySnapshot | undefined,
  scrollX: number,
  scrollY: number,
): void {
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
    const bounds = strokeBox(cubics);
    const restBox = restOfBounds(bounds);
    const prev = boxes[member.name];
    const svgRect = readBoundingRect(node.ownerSVGElement);
    if (svgRect !== undefined) {
      const left = svgRect.left + restBox.x - restBox.width / 2;
      const top = svgRect.top + restBox.y - restBox.height / 2;
      const info = ancestors.get(node) ?? { isFixed: false };
      boxes[member.name] = boxForNode(
        {
          left,
          top,
          bottom: top + restBox.height,
          width: restBox.width,
          height: restBox.height,
        },
        scrollX,
        scrollY,
        snapshotSticky(info.sticky),
        info.isFixed,
      );
    } else {
      boxes[member.name] = prev === undefined ? restBox : withPlacement(restBox, placementOf(prev));
    }
  }
}

export interface MeasureLayoutInput {
  readonly stage: Stage;
  readonly targets: readonly BoundTarget[];
  readonly allNodes: readonly PageElement[];
  readonly doc: PageDocument | undefined;
  readonly fitted: HTMLElement | undefined;
  readonly animations: Iterable<readonly Animation[]>;
  readonly binders: readonly Binder[];
  readonly objectListSet: ReadonlySet<string>;
  readonly readScrollX: () => number;
  readonly readScrollY: () => number;
  readonly scaleFrame: () => void;
  readonly readObjectCounts: () => Readonly<Record<string, number>>;
  readonly boundCounts: Readonly<Record<string, number>>;
}

export interface MeasuredLayout {
  readonly rest: Rest;
  readonly objects: Readonly<Record<string, ObjectBounds3d>>;
  readonly reader: RestReader;
  readonly lines: Readonly<Record<string, readonly number[]>>;
  readonly objectCounts: Readonly<Record<string, number>>;
  readonly counts: Readonly<Record<string, number>>;
}

/** Measures rest boxes, line indices, SVG paths, and 3D bounds with transforms and animations cleared. */
export function measureLayout(input: MeasureLayoutInput): MeasuredLayout {
  const {
    stage,
    targets,
    allNodes,
    doc,
    fitted,
    animations,
    binders,
    objectListSet,
    readScrollX,
    readScrollY,
    scaleFrame,
    readObjectCounts,
    boundCounts,
  } = input;

  const savedTransforms = new Map<PageElement, string | undefined>();
  const savedAnimations: {
    readonly animation: Animation;
    readonly effect: AnimationEffect | null;
    readonly restoreTime: boolean;
    readonly currentTime: CSSNumberish | null;
    readonly playState: AnimationPlayState;
  }[] = [];
  const docTimeline: unknown =
    doc !== undefined
      ? Reflect.get(doc, "timeline")
      : typeof document !== "undefined"
        ? document.timeline
        : undefined;
  for (const list of animations) {
    for (const animation of list) {
      savedAnimations.push({
        animation,
        effect: animation.effect,
        restoreTime: docTimeline !== undefined && animation.timeline === docTimeline,
        currentTime: animation.currentTime,
        playState: animation.playState,
      });
      animation.effect = null;
    }
  }

  const savedSticky = new Map<
    Element & { readonly style: PageElement["style"] },
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
  const placeOf = (node: PageElement) =>
    fitted === undefined ? inspectAncestors(node, stickyCache) : { isFixed: false };
  for (const node of allNodes) ancestors.set(node, placeOf(node));
  for (const target of targets) {
    if (!ancestors.has(target.node)) ancestors.set(target.node, placeOf(target.node));
  }

  if (fitted !== undefined) fitted.style.transform = "";
  const origin = fitted?.getBoundingClientRect();
  const scrollX = origin === undefined ? readScrollX() : -origin.left;
  const scrollY = origin === undefined ? readScrollY() : -origin.top;
  const nextRest: Record<string, Box> = {};
  const nextLines: Record<string, readonly number[]> = {};

  const stickySnapshots = new Map<Element, StickySnapshot>();
  const snapshotSticky = (ancestor: StickyAncestor | undefined): StickySnapshot | undefined => {
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
    const snap: StickySnapshot = {
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
        case "actor": {
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
    drawPaths(stage, targets, nextRest, ancestors, snapshotSticky, scrollX, scrollY);
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
    for (const saved of savedAnimations) {
      saved.animation.effect = saved.effect;
      if (saved.restoreTime) {
        if (saved.currentTime !== null) saved.animation.currentTime = saved.currentTime;
        if (saved.playState === "running") saved.animation.play();
        else if (saved.playState === "paused") saved.animation.pause();
      }
    }
  }

  const objectNames = stage.members
    .filter((member) => member.kind === "object")
    .map((member) => member.name);
  const nextObjects: Record<string, ObjectBounds3d> = {};
  let nextObjectCounts: Readonly<Record<string, number>> = {};
  let nextCounts: Readonly<Record<string, number>> = boundCounts;
  if (objectNames.length > 0) {
    for (const binder of binders) {
      const claimed = objectNames.filter((name) => binder.claims(name));
      if (claimed.length === 0) continue;
      const measured = binder.measure?.(claimed, objectListSet);
      if (measured === undefined) continue;
      for (const [name, bounds] of Object.entries(measured)) nextObjects[name] = bounds;
    }
    nextObjectCounts = readObjectCounts();
    nextCounts = Object.freeze({ ...boundCounts, ...nextObjectCounts });
  }

  const rest = Object.freeze(nextRest);
  const objects = Object.freeze(nextObjects);
  return {
    rest,
    objects,
    reader: restReader(rest, objects),
    lines: Object.freeze(nextLines),
    objectCounts: nextObjectCounts,
    counts: nextCounts,
  };
}

/** Builds plain-data `Measurement` snapshot for tools and page caches. */
export function buildMeasurement(
  targets: readonly BoundTarget[],
  currentRest: Rest,
  currentLines: Readonly<Record<string, readonly number[]>>,
  currentObjects: Readonly<Record<string, ObjectBounds3d>>,
  currentObjectCounts: Readonly<Record<string, number>>,
  fitted: HTMLElement | undefined,
  readViewport: () => { readonly width: number; readonly height: number },
): Measurement {
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
  const rest: Record<string, MeasuredBox> = {};
  for (const [name, box] of Object.entries(currentRest)) {
    rest[name] = {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      placement: placementOf(box),
    };
  }
  const parents: Record<string, string> = {};
  for (const [node, name] of nameOfNode) {
    const parent = parentOf(node);
    if (parent !== undefined) parents[name] = parent;
  }
  const frame = fitted === undefined ? readViewport() : fittedSizeOf(fitted);
  return {
    frame,
    rest,
    lines: currentLines,
    parents,
    ...(Object.keys(currentObjects).length === 0 ? {} : { objects: currentObjects }),
    ...(Object.keys(currentObjectCounts).length === 0 ? {} : { counts: currentObjectCounts }),
  };
}
