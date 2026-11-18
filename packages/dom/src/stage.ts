import {
  NO_EVENTS,
  unreachable,
  type Cubic2d,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/core";
import { play, type Player, type Scene } from "@gerak/player";
import {
  compileStage,
  evaluateFrame,
  formatStageError,
  isCompiledStage,
  isStage2d,
  isStageDefinition,
  resolveStaticStrokes,
  restOfBounds,
  restReader,
  sameCast,
  strokeBox,
  DEFAULT_FRAME,
  NO_LAYOUTS,
  NO_LAYOUT_READERS,
  NO_REST,
  ZERO_BOX,
  type ActorPath,
  type Box,
  type CompiledContent,
  type CompiledMember,
  type CompiledMembers,
  type CompiledStage,
  type DomSkinCss,
  type Frame,
  type FrameEvaluation,
  type Layouts,
  type Member,
  type MemberEntry,
  type Pivot,
  type PoseMode,
  type Rest,
  type RestReader,
  type StageDefinition,
} from "@gerak/stage";
import { clockDriver, type ClockDriver } from "./drivers";
import type { PointerLike } from "./events";
import type { FrameSource } from "./frames";
import { partPaints } from "./paints";
import { applyValue, pathData, splitStroke, type RenderStyle } from "./render";

/** The style properties the stage writes beside a value's; a page element's style has them all. */
export interface StageStyle extends RenderStyle {
  visibility?: string;
  display?: string;
  position?: string;
  overflow?: string;
  left?: string;
  top?: string;
  marginLeft?: string;
  marginTop?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
}

/** What the stage reads of a page event: a key, where it landed, and the element it landed on. */
export interface StageEvent extends PointerLike {
  readonly key?: string;
  readonly target?: unknown;
}

/** The document's font loading, which tells the stage when text may have changed size. */
export interface StageFonts {
  readonly ready: Promise<unknown>;
  addEventListener(type: "loadingdone", listener: () => void): void;
  removeEventListener(type: "loadingdone", listener: () => void): void;
}

const SVG = "http://www.w3.org/2000/svg";

/** An SVG element the stage draws a stroke with: a page `svg` or `path`, or a stand-in in a test. */
export interface StageStroke<S> {
  readonly style: RenderStyle;
  setAttribute(name: string, value: string): void;
  append(...nodes: S[]): void;
  remove?(): void;
  getTotalLength?(): number;
  /** Markup inside it; the stage writes a skin's `defs` this way. */
  innerHTML?: string;
}

/** Minimal container contract accepted by `mountStage`: a page `Element` or test stand-in. */
export interface StageHost<E, S extends StageStroke<S> = StageStroke<never>> {
  readonly ownerDocument: {
    createElement(tag: "div" | "style" | "link"): E;
    createElementNS(namespace: typeof SVG, name: "svg" | "path"): S;
    readonly fonts?: StageFonts;
  };
  append(...nodes: (E | S)[]): void;
}

/** An element the stage builds with and writes: a page element, or a stand-in in a test; `S` is
 * the SVG element it draws a stroke member's path with. */
export interface StageElement<E, S extends StageStroke<S> = StageStroke<never>>
  extends StageHost<E, S> {
  readonly style: StageStyle;
  textContent: string | null;
  tabIndex: number;
  readonly offsetLeft: number;
  /** Its left and top border widths: offsets inside it start past them. */
  readonly clientLeft: number;
  readonly clientTop: number;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  readonly offsetHeight: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
  attachShadow(init: { readonly mode: "open" }): { append(...nodes: E[]): void };
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
  remove(): void;
  addEventListener(type: string, listener: (event: StageEvent) => void): void;
  removeEventListener(type: string, listener: (event: StageEvent) => void): void;
}

/** A scene's answer per member name: one value, or one per item of a `many`. */
export type StageValues = Readonly<Record<string, Pose2d | readonly Pose2d[] | undefined>>;

/** Settings of `mountStage`: the frames its clock runs on. */
export interface StageOptions {
  readonly frames?: FrameSource;
  /** Told of the driver each time a run starts, the first and every replay. */
  readonly onDriver?: (driver: ClockDriver) => void;
}

/** A playing stage: its player, driver, measured boxes, skin readiness, and lifecycle controls. */
export interface MountedStage {
  readonly player: Player<StageValues>;
  readonly driver: ClockDriver;
  readonly rest: Rest;
  readonly layouts: Layouts;
  readonly ready: Promise<void>;
  replay(): void;
  /** Swaps in a compatible stage (same cast and duration), keeping time. */
  replace<
    P extends PoseMode = "2d",
    B extends string = string,
    C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
    L extends string = never,
  >(
    next: CompiledStage<P> | StageDefinition<P, B, C, L>,
  ): void;
  /** Logs a sample of a live number at the clock's ms; the clock runs on past the end until settled. */
  send(name: string, value: number, target?: string): void;
  /** Everything logged so far, oldest first: hovers and samples. */
  events(): Events;
  dispose(): void;
}

// Every element is positioned, so each one's offsets are from its own parent's box.
const DEFAULT_SKIN = `
:where([data-stage="frame"]) {
  position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  align-content: center; gap: 24px; overflow: hidden; font: 16px/1.2 system-ui, sans-serif;
}
:where([data-cast]) { position: relative; box-sizing: border-box; }
:where([data-text]) { white-space: pre; }
:where([data-stroke]) > svg { display: block; width: 100%; height: 100%; overflow: visible; }
:where([data-path]) { fill: none; stroke: currentColor; stroke-width: 2; }
:where([data-kind="group"], [data-kind="many"]) {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px;
}
:where([data-skin="default"]) {
  display: flex; align-items: center; justify-content: center; min-width: 64px; min-height: 64px;
  padding: 4px; background: #ddd; color: #555; font-size: 12px;
}
:where([data-skin="default"]:not([data-text]))::before { content: attr(data-cast); }
:where([data-skin="default"][data-text]) {
  min-width: 0; min-height: 0; padding: 0; background: none; color: inherit; font-size: inherit;
  white-space: pre;
}
`;

const NAMED = /data-cast\s*(\^?)=\s*["']([^"']*)["']/g;

/** Whether the skin names a member in a `data-cast` selector: its own name, its list's, or a prefix of it. */
function namedBy(css: string): (name: string, list?: string) => boolean {
  const exact = new Set<string>();
  const prefixes: string[] = [];
  for (const [, prefix, value] of css.matchAll(NAMED)) {
    if (value === undefined) continue;
    if (prefix === "^") prefixes.push(value);
    else exact.add(value);
  }
  return (name, list) =>
    exact.has(name) ||
    (list !== undefined && exact.has(list)) ||
    prefixes.some((start) => name.startsWith(start));
}

/** A stroke member placed at `box` in its parent's space, at no specificity so a skin overrides it. */
function strokePlace(name: string, box: Box | undefined, layout?: string): string {
  const at =
    box === undefined
      ? ""
      : ` left: ${box.x}px; top: ${box.y}px; width: ${box.width}px; height: ${box.height}px;`;
  const under = layout === undefined ? "" : `[data-layout=${JSON.stringify(layout)}] `;
  return `:where(${under}[data-cast=${JSON.stringify(name)}]) { position: absolute;${at} }`;
}

/** A member's transform origin at its pivot, from where its box rests. */
function pivotPlace(name: string, box: Box, pivot: Pivot, layout?: string): string {
  const left = pivot.x - (box.x - box.width / 2);
  const top = pivot.y - (box.y - box.height / 2);
  const under = layout === undefined ? "" : `[data-layout=${JSON.stringify(layout)}] `;
  return `:where(${under}[data-cast=${JSON.stringify(name)}]) { transform-origin: ${left}px ${top}px; }`;
}

/** The key a stroke keeps its drawing under on a stage with no layouts. */
const UNLAID = "";

interface Stroke<S> {
  readonly svg: S;
  readonly path: S;
  source: ActorPath;
  readonly isMorph: boolean;
  readonly cubics: Map<string, readonly Cubic2d[]>;
  painted: readonly Cubic2d[] | undefined;
  hasPartDefs: boolean;
}

interface Measured {
  readonly rest: Rest;
  readonly layouts: Layouts;
  readonly restReader: RestReader;
  readonly layoutReaders: Readonly<Record<string, RestReader>>;
}

interface Placed<E> {
  entry: MemberEntry;
  readonly element: E;
  readonly parent: Placed<E> | undefined;
  readonly items: readonly E[];
}

function sameNames(next: readonly string[], last: readonly string[]): boolean {
  return next.length === last.length && next.every((name, index) => name === last[index]);
}

function sameFrame(a: Frame, b: Frame): boolean {
  return a.width === b.width && a.height === b.height;
}

function sameDomSkin(a: DomSkinCss | undefined, b: DomSkinCss | undefined): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined || a.kind !== b.kind) return false;
  switch (a.kind) {
    case "inline":
      return b.kind === "inline" && a.css === b.css && a.defs === b.defs;
    case "url":
      return b.kind === "url" && a.css.href === b.css.href && a.defs?.href === b.defs?.href;
    default:
      return unreachable(a);
  }
}

function samePivots(a: CompiledMembers, b: CompiledMembers): boolean {
  return a.entries.every((ae, index) => {
    const be = b.entries[index];
    return ae.pivot?.x === be?.pivot?.x && ae.pivot?.y === be?.pivot?.y;
  });
}

function sameCubics(next: readonly Cubic2d[], last: readonly Cubic2d[] | undefined): boolean {
  return (
    last !== undefined &&
    next.length === last.length &&
    next.every((cubic, index) => {
      const was = last[index];
      return (
        was !== undefined &&
        cubic.x0 === was.x0 &&
        cubic.y0 === was.y0 &&
        cubic.x1 === was.x1 &&
        cubic.y1 === was.y1 &&
        cubic.x2 === was.x2 &&
        cubic.y2 === was.y2 &&
        cubic.x3 === was.x3 &&
        cubic.y3 === was.y3
      );
    })
  );
}

/** Reports an error the way an uncaught one in a frame is, without stopping the caller. */
function report(error: unknown): void {
  if (typeof reportError === "function") reportError(error);
  else
    setTimeout(() => {
      throw error;
    }, 0);
}

function isList(value: Pose2d | readonly Pose2d[]): value is readonly Pose2d[] {
  return Array.isArray(value);
}

function isElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

function assert2dStage(stage: CompiledStage<PoseMode>): CompiledStage<"2d"> {
  switch (stage.pose) {
    case "2d":
      if (isStage2d(stage)) return stage;
      throw new Error("mountStage: expected a 2d stage.");
    case "3d":
      throw new Error('mountStage: "3d" stages are not supported by @gerak/dom.');
    default:
      return unreachable(stage.pose);
  }
}

function resolveStage<
  P extends PoseMode,
  B extends string,
  C extends Readonly<Record<string, Member<B>>>,
  L extends string,
>(input: CompiledStage<P> | StageDefinition<P, B, C, L>): CompiledStage<"2d"> {
  if (isStageDefinition(input)) {
    const compiled = compileStage(input);
    if (!compiled.ok) {
      const details = compiled.errors.map(formatStageError).join("\n");
      throw new Error(`mountStage: invalid stage definition:\n${details}`);
    }
    return assert2dStage(compiled.stage);
  }
  if (isCompiledStage(input)) return assert2dStage(input);
  throw new Error("mountStage: expected a CompiledStage or StageDefinition.");
}

function layoutNamesOf(stage: CompiledStage<"2d">): readonly string[] {
  switch (stage.layout.kind) {
    case "single":
      return [];
    case "multi":
      return stage.layout.names;
    default:
      return unreachable(stage.layout);
  }
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

/** Plays a compiled or defined stage in `host`; `R` or a click on the background replays it. */
export function mountStage<
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
>(
  host: Element,
  stage: CompiledStage<P> | StageDefinition<P, B, C, L>,
  options?: StageOptions,
): MountedStage;
export function mountStage<
  E extends StageElement<E, S>,
  S extends StageStroke<S>,
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
>(
  host: E & StageElement<E, S>,
  stage: CompiledStage<P> | StageDefinition<P, B, C, L>,
  options?: StageOptions,
): MountedStage;
export function mountStage<
  E extends StageElement<E, S>,
  S extends StageStroke<S>,
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
>(
  host: Element | (E & StageElement<E, S>),
  stage: CompiledStage<P> | StageDefinition<P, B, C, L>,
  options: StageOptions = {},
): MountedStage {
  if (isElement(host))
    return mountInto<HTMLElement, SVGElement, P, B, C, L>(host, host, stage, options);
  return mountInto(host, host, stage, options);
}

function mountInto<
  E extends StageElement<E, S>,
  S extends StageStroke<S>,
  P extends PoseMode = "2d",
  B extends string = string,
  C extends Readonly<Record<string, Member<B>>> = Readonly<Record<string, Member<B>>>,
  L extends string = never,
>(
  container: StageHost<E, S>,
  rawContainer: unknown,
  stageInput: CompiledStage<P> | StageDefinition<P, B, C, L>,
  options: StageOptions,
): MountedStage {
  let currentStage = resolveStage(stageInput);
  let size: Frame = currentStage.frame ?? DEFAULT_FRAME;
  const document = container.ownerDocument;

  const host = document.createElement("div");
  host.setAttribute("data-stage", "host");
  host.tabIndex = 0;
  Object.assign(host.style, {
    display: "block",
    position: "relative",
    overflow: "hidden",
    width: "100%",
    height: "100%",
  });
  const root = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  const frame = document.createElement("div");
  frame.setAttribute("data-stage", "frame");
  const applyFrameSize = (nextSize: Frame): void => {
    size = nextSize;
    Object.assign(frame.style, {
      position: "absolute",
      left: "50%",
      top: "50%",
      marginLeft: `${-size.width / 2}px`,
      marginTop: `${-size.height / 2}px`,
      width: `${size.width}px`,
      height: `${size.height}px`,
      transformOrigin: "50% 50%",
    });
  };
  applyFrameSize(size);
  root.append(style, frame);

  const placed = new Map<string, Placed<E>>();
  const strokes = new Map<E, Stroke<S>>();
  const strokeNames: string[] = [];
  const startTime: Time = {
    progress: 0,
    clock: { kind: "timed", elapsed: 0, length: currentStage.beats.durationMs },
  };
  let lastLoop: string | undefined;

  const write = (element: E, value: Pose2d): void => {
    const drawing = strokes.get(element);
    if (drawing === undefined) {
      applyValue(element, value);
      return;
    }
    const { stroke, body } = splitStroke(value);
    applyValue(element, body);
    applyValue(drawing.path, stroke);
  };

  // Shows every non-morph stroke as drawn in `layout`, writing a path only when its cubics changed.
  const paint = (layout: string): void => {
    for (const stroke of strokes.values()) {
      if (stroke.isMorph && stroke.painted !== undefined) continue;
      const cubics = stroke.cubics.get(layout);
      if (cubics === undefined || sameCubics(cubics, stroke.painted)) continue;
      const box = strokeBox(cubics);
      stroke.svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
      stroke.path.setAttribute("d", pathData(cubics));
      stroke.painted = cubics;
    }
  };

  const createMemberElement = (name: string, kind: string): E => {
    const made = document.createElement("div");
    made.setAttribute("data-cast", name);
    made.setAttribute("data-kind", kind);
    return made;
  };

  const leaf = (element: E, entry: MemberEntry, content: CompiledContent): void => {
    switch (content.kind) {
      case "empty":
        break;
      case "text":
        element.textContent = content.value;
        element.setAttribute("data-text", "");
        break;
      case "readout":
        try {
          element.textContent = content.format(startTime);
        } catch {
          // Readout failures are surfaced during frame evaluation.
        }
        element.setAttribute("data-text", "");
        break;
      case "stroke": {
        const svg = document.createElementNS(SVG, "svg");
        const path = document.createElementNS(SVG, "path");
        path.setAttribute("data-path", entry.name);
        svg.append(path);
        element.append(svg);
        element.setAttribute("data-stroke", "");
        strokeNames.push(entry.name);
        strokes.set(element, {
          svg,
          path,
          source: content.path,
          isMorph: false,
          cubics: new Map(),
          painted: undefined,
          hasPartDefs: false,
        });
        break;
      }
      case "morph": {
        const svg = document.createElementNS(SVG, "svg");
        const path = document.createElementNS(SVG, "path");
        path.setAttribute("data-path", entry.name);
        svg.append(path);
        element.append(svg);
        element.setAttribute("data-stroke", "");
        strokeNames.push(entry.name);
        strokes.set(element, {
          svg,
          path,
          source: content.matched[0] ?? content.base,
          isMorph: true,
          cubics: new Map(),
          painted: undefined,
          hasPartDefs: false,
        });
        break;
      }
      default:
        unreachable(content);
    }
  };

  const build = (
    members: Readonly<Record<string, CompiledMember>>,
    into: E,
    parent: Placed<E> | undefined,
  ): void => {
    for (const [name, member] of Object.entries(members)) {
      const entry = currentStage.members.byName.get(name);
      if (entry === undefined) throw new Error(`mountStage: "${name}" has no cast entry.`);
      const kindAttr = member.kind === "list" ? "many" : member.kind;
      const own = createMemberElement(name, kindAttr);
      into.append(own);
      switch (member.kind) {
        case "actor":
          leaf(own, entry, member.content);
          placed.set(name, { entry, element: own, parent, items: [] });
          break;
        case "list": {
          const items = member.items.map((_, index) =>
            createMemberElement(`${name}.${index}`, "item"),
          );
          const self: Placed<E> = { entry, element: own, parent, items };
          placed.set(name, self);
          member.items.forEach((itemMember, index) => {
            const itemElement = items[index];
            const itemEntry = currentStage.members.byName.get(itemMember.name);
            if (itemElement === undefined || itemEntry === undefined)
              throw new Error(`mountStage: "${itemMember.name}" is unnamed.`);
            leaf(itemElement, itemEntry, itemMember.content);
            own.append(itemElement);
            placed.set(itemMember.name, {
              entry: itemEntry,
              element: itemElement,
              parent: self,
              items: [],
            });
          });
          break;
        }
        case "group": {
          const self: Placed<E> = { entry, element: own, parent, items: [] };
          placed.set(name, self);
          build(member.members, own, self);
          break;
        }
        default:
          unreachable(member);
      }
    }
  };

  build(currentStage.members.tree, frame, undefined);
  container.append(host);

  let activeSkinCss = "";
  let lastPlaces: readonly string[] = strokeNames.map((name) => strokePlace(name, undefined));
  const styleWith = (places: readonly string[]): string =>
    `${DEFAULT_SKIN}\n${places.join("\n")}\n${activeSkinCss}`;

  let sharedDefsSvg: S | undefined;
  const setSharedDefs = (paints: string | undefined): void => {
    if (paints === undefined) {
      sharedDefsSvg?.remove?.();
      sharedDefsSvg = undefined;
      return;
    }
    if (sharedDefsSvg === undefined) {
      sharedDefsSvg = document.createElementNS(SVG, "svg");
      sharedDefsSvg.setAttribute("aria-hidden", "true");
      sharedDefsSvg.setAttribute(
        "style",
        "position: absolute; width: 0; height: 0; overflow: hidden;",
      );
      frame.append(sharedDefsSvg);
    }
    const trimmed = paints.trim();
    sharedDefsSvg.innerHTML = trimmed.startsWith("<defs") ? trimmed : `<defs>${paints}</defs>`;
  };

  const applyDefaultSkinMarkers = (
    styled: ((name: string, list?: string) => boolean) | undefined,
  ): void => {
    for (const { entry, element } of placed.values()) {
      if (entry.kind === "group" || entry.kind === "list") continue;
      if (strokes.has(element)) continue;
      if (styled !== undefined && !styled(entry.name, entry.list)) {
        element.setAttribute("data-skin", "default");
      } else {
        element.removeAttribute("data-skin");
      }
    }
  };

  const setPartDefs = (partDefsByName: ReadonlyMap<string, string>): void => {
    for (const [name, { element }] of placed) {
      const stroke = strokes.get(element);
      if (stroke === undefined) continue;
      const partDefs = partDefsByName.get(name);
      if (partDefs !== undefined) {
        stroke.path.remove?.();
        stroke.svg.innerHTML = `<defs>${partDefs}</defs>`;
        stroke.svg.append(stroke.path);
        stroke.hasPartDefs = true;
      } else if (stroke.hasPartDefs) {
        stroke.path.remove?.();
        stroke.svg.innerHTML = "";
        stroke.svg.append(stroke.path);
        stroke.hasPartDefs = false;
      }
    }
  };

  let live = true;
  let mountedReady = false;
  let skinEpoch = 0;
  let activeLinkCleanup: (() => void) | undefined;
  let activeAbort: AbortController | undefined;
  let settlePendingSkin: (() => void) | undefined;
  let currentReady: Promise<void> = Promise.resolve();

  const teardownSkinLoad = (): void => {
    skinEpoch += 1;
    settlePendingSkin?.();
    settlePendingSkin = undefined;
    activeAbort?.abort();
    activeAbort = undefined;
    activeLinkCleanup?.();
    activeLinkCleanup = undefined;
  };

  const fit = (): void => {
    if (host.clientHeight === 0 && host.clientWidth > 0) {
      host.style.height = "auto";
      host.style.aspectRatio = `${size.width} / ${size.height}`;
    }
    const width = host.clientWidth;
    const height = host.clientHeight;
    const scale = Math.min(
      width > 0 ? width / size.width : Infinity,
      height > 0 ? height / size.height : Infinity,
    );
    // At scale 1 the frame carries no transform, so its content is rasterised as a plain page would be.
    frame.style.transform = Number.isFinite(scale) && scale !== 1 ? `scale(${scale})` : "";
  };

  let names: readonly string[] = layoutNamesOf(currentStage);
  let shown: string | undefined = names[0];
  if (shown !== undefined) frame.setAttribute("data-layout", shown);

  // Measures the stage as laid out, or under every layout in turn, then shows the layout in force again.
  const measure = (): Measured => {
    const ordered: string[] = [];
    const loops = new Set<string>();
    const laidOut = (layout: string | undefined): Rest => {
      const boxes: Record<string, Box> = {};
      for (const [name, { element: own, parent }] of placed) {
        if (strokes.has(own)) continue;
        let left = own.offsetLeft;
        let top = own.offsetTop;
        for (let up = parent; up !== undefined; up = up.parent) {
          left += up.element.offsetLeft + up.element.clientLeft;
          top += up.element.offsetTop + up.element.clientTop;
        }
        const width = own.offsetWidth;
        const height = own.offsetHeight;
        boxes[name] = { x: left + width / 2, y: top + height / 2, width, height };
      }
      const key = layout ?? UNLAID;
      const resolution = resolveStaticStrokes(currentStage, restReader(boxes));
      const places = new Map<string, string>();
      const owners = new Map<
        string,
        { readonly stroke: Stroke<S>; readonly parent: Placed<E> | undefined }
      >();
      for (const [name, { element: own, parent }] of placed) {
        const stroke = strokes.get(own);
        if (stroke !== undefined) owners.set(name, { stroke, parent });
      }
      if (!resolution.ok) {
        loops.add(`mountStage: ${formatStageError(resolution.error)}`);
      } else {
        for (const failure of resolution.failures) {
          report(
            new Error(`The path of "${failure.name}" failed: ${String(failure.error)}`, {
              cause: failure.error,
            }),
          );
        }
        for (const [name, resolved] of resolution.strokes) {
          const owner = owners.get(name);
          if (owner !== undefined) owner.stroke.cubics.set(key, resolved.cubics);
        }
      }
      for (const [name, { stroke, parent }] of owners) {
        const cubics = stroke.cubics.get(key);
        if (cubics === undefined) {
          places.set(name, strokePlace(name, undefined, layout));
          boxes[name] = ZERO_BOX;
          continue;
        }
        const box = strokeBox(cubics);
        const home = parent === undefined ? undefined : boxes[parent.entry.name];
        const left =
          home === undefined || parent === undefined
            ? 0
            : home.x - home.width / 2 + parent.element.clientLeft;
        const top =
          home === undefined || parent === undefined
            ? 0
            : home.y - home.height / 2 + parent.element.clientTop;
        places.set(name, strokePlace(name, { ...box, x: box.x - left, y: box.y - top }, layout));
        boxes[name] = restOfBounds(box);
      }
      for (const name of owners.keys()) {
        const place = places.get(name);
        if (place !== undefined) ordered.push(place);
      }
      const rest: Record<string, Box> = {};
      for (const [name, { entry }] of placed) {
        const box = boxes[name];
        if (box === undefined) continue;
        rest[name] = box;
        if (entry.pivot !== undefined) ordered.push(pivotPlace(name, box, entry.pivot, layout));
      }
      return Object.freeze(rest);
    };

    let nextMeasured: Measured;
    if (names.length === 0) {
      if (shown !== undefined) frame.removeAttribute("data-layout");
      shown = undefined;
      const rest = laidOut(undefined);
      paint(UNLAID);
      nextMeasured = {
        rest,
        layouts: NO_LAYOUTS,
        restReader: restReader(rest),
        layoutReaders: NO_LAYOUT_READERS,
      };
    } else {
      const layouts: Record<string, Rest> = {};
      const readers: Record<string, RestReader> = {};
      if (shown === undefined || !names.includes(shown)) shown = names[0];
      try {
        for (const name of names) {
          frame.setAttribute("data-layout", name);
          const laid = laidOut(name);
          layouts[name] = laid;
          readers[name] = restReader(laid);
        }
      } finally {
        if (shown !== undefined) frame.setAttribute("data-layout", shown);
      }
      if (shown !== undefined) paint(shown);
      nextMeasured = {
        rest: NO_REST,
        layouts: Object.freeze(layouts),
        restReader: restReader(NO_REST),
        layoutReaders: Object.freeze(readers),
      };
    }

    const looped = loops.size === 0 ? undefined : [...loops].join(" ");
    if (looped !== undefined && looped !== lastLoop) report(new Error(looped));
    lastLoop = looped;
    lastPlaces = ordered;
    const text = styleWith(ordered);
    if (style.textContent !== text) style.textContent = text;
    return nextMeasured;
  };

  let measured: Measured;
  let lastEvaluation: Extract<FrameEvaluation<"2d">, { readonly ok: true }> | undefined;
  let run: { readonly driver: ClockDriver; readonly player: Player<StageValues>; stop(): void };

  const resized = (): void => {
    fit();
    measured = measure();
    run.player.refresh();
  };

  const applySkin = (skin: DomSkinCss | undefined): void => {
    teardownSkinLoad();
    const epoch = skinEpoch;
    const resolved: DomSkinCss = skin ?? { kind: "inline", css: "" };
    switch (resolved.kind) {
      case "inline": {
        const parted = partPaints(resolved.css, resolved.defs, strokeNames);
        activeSkinCss = parted.css;
        applyDefaultSkinMarkers(namedBy(resolved.css));
        setSharedDefs(resolved.defs);
        setPartDefs(parted.defs);
        style.textContent = styleWith(lastPlaces);
        currentReady = Promise.resolve();
        break;
      }
      case "url": {
        activeSkinCss = "";
        applyDefaultSkinMarkers(undefined);
        setSharedDefs(undefined);
        setPartDefs(new Map());
        style.textContent = styleWith(lastPlaces);

        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", resolved.css.href);
        root.append(link);

        const controller = new AbortController();
        activeAbort = controller;

        let resolveCss: () => void = () => undefined;
        const cssDone = new Promise<void>((resolve) => {
          resolveCss = resolve;
        });
        const cleanupLink = (): void => {
          link.removeEventListener("load", onLoad);
          link.removeEventListener("error", onError);
        };
        const onLoad = (): void => {
          cleanupLink();
          if (live && epoch === skinEpoch && mountedReady) resized();
          resolveCss();
        };
        const onError = (): void => {
          cleanupLink();
          if (live && epoch === skinEpoch) {
            report(new Error(`mountStage: failed to load stylesheet "${resolved.css.href}".`));
          }
          resolveCss();
        };
        link.addEventListener("load", onLoad);
        link.addEventListener("error", onError);
        activeLinkCleanup = () => {
          cleanupLink();
          link.remove();
        };

        const defsUrl = resolved.defs;
        const defsDone =
          defsUrl === undefined
            ? Promise.resolve()
            : typeof fetch !== "function"
              ? Promise.resolve().then(() => {
                  if (live && epoch === skinEpoch) {
                    report(
                      new Error(`mountStage: cannot fetch defs "${defsUrl.href}" without fetch.`),
                    );
                  }
                })
              : fetch(defsUrl.href, { signal: controller.signal })
                  .then(async (response) => {
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    const text = await response.text();
                    if (!live || epoch !== skinEpoch) return;
                    setSharedDefs(text);
                  })
                  .catch((error: unknown) => {
                    if (!live || epoch !== skinEpoch || isAbortError(error)) return;
                    report(
                      new Error(
                        `mountStage: failed to load defs "${defsUrl.href}": ${String(error)}`,
                        { cause: error },
                      ),
                    );
                  });

        currentReady = new Promise<void>((resolve) => {
          let settled = false;
          const finish = (): void => {
            if (settled) return;
            settled = true;
            if (settlePendingSkin === finish) settlePendingSkin = undefined;
            resolve();
          };
          settlePendingSkin = finish;
          void Promise.all([cssDone, defsDone]).then(finish);
        });
        break;
      }
      default:
        unreachable(resolved);
    }
  };

  applySkin(currentStage.skins.dom);

  const watched = [...placed.values()].filter(({ entry }) => entry.watch);
  const drive = (): { readonly driver: ClockDriver; stop(): void } => {
    const driver = clockDriver({
      duration: currentStage.beats.durationMs,
      ...(options.frames === undefined ? {} : { frames: options.frames }),
    });
    for (const { entry, element: own } of watched) driver.watch(entry.name, own);
    return { driver, stop: () => driver.dispose() };
  };

  fit();
  measured = measure();

  const sceneOf = (): Scene<StageValues> => (time, events) => {
    const boxes =
      currentStage.layout.kind === "multi" ? measured.layoutReaders : measured.restReader;
    const evaluated = evaluateFrame(currentStage, { time, events, boxes });
    if (!evaluated.ok) {
      const details = evaluated.errors.map(formatStageError).join(" ");
      throw new TypeError(`mountStage: ${details}`);
    }
    const [firstReadoutError] = evaluated.readoutErrors;
    if (firstReadoutError !== undefined) {
      const err = firstReadoutError.error;
      if (err instanceof TypeError) throw err;
      throw new TypeError(
        `mountStage: readout "${firstReadoutError.member}" failed: ${err instanceof Error ? err.message : String(err)}`,
        { cause: err },
      );
    }
    lastEvaluation = evaluated;
    return evaluated.poses;
  };

  // Styles the frame under the layout in force before a frame's values are written.
  const follow = (): void => {
    const inForce = lastEvaluation?.layout;
    if (inForce === shown) return;
    shown = inForce;
    if (shown === undefined) frame.removeAttribute("data-layout");
    else {
      frame.setAttribute("data-layout", shown);
      paint(shown);
    }
  };

  const applyEvaluation = (): void => {
    const evaluated = lastEvaluation;
    if (evaluated === undefined) return;
    for (const [name, visible] of Object.entries(evaluated.visibility)) {
      const target = placed.get(name);
      if (target === undefined) continue;
      if (!visible || target.element.style.visibility === "hidden") {
        target.element.style.visibility = visible ? "" : "hidden";
      }
    }
    for (const [name, text] of Object.entries(evaluated.readouts)) {
      const target = placed.get(name);
      if (target !== undefined && target.element.textContent !== text) {
        target.element.textContent = text;
      }
    }
    for (const [name, cubics] of Object.entries(evaluated.morphs)) {
      const target = placed.get(name);
      if (target === undefined) continue;
      const drawing = strokes.get(target.element);
      if (drawing !== undefined && !sameCubics(cubics, drawing.painted)) {
        drawing.path.setAttribute("d", pathData(cubics));
        drawing.painted = cubics;
      }
    }
  };

  const bind = (target: Placed<E>, value: Pose2d | readonly Pose2d[] | undefined): void => {
    if (value === undefined) return;
    const kind = target.entry.kind;
    switch (kind) {
      case "actor":
      case "group":
        if (isList(value))
          throw new TypeError(`mountStage: "${target.entry.name}" takes one value, not a list.`);
        write(target.element, value);
        break;
      case "list":
        if (!isList(value))
          throw new TypeError(
            `mountStage: "${target.entry.name}" takes a list, one value per item.`,
          );
        target.items.forEach((item, index) => {
          const each = value[index];
          if (each !== undefined) write(item, each);
        });
        break;
      case "item":
        break;
      default:
        unreachable(kind);
    }
  };

  const start = () => {
    const { driver, stop } = drive();
    const cues = currentStage.cues;
    const player = play<StageValues>(sceneOf(), driver, cues.length === 0 ? {} : { cues });
    options.onDriver?.(driver);
    const [first] = placed.keys();
    if (first !== undefined) player.subscribe(first, follow);
    for (const target of placed.values())
      if (target.entry.kind !== "item")
        player.subscribe(target.entry.name, (value) => bind(target, value));
    if (first !== undefined) player.subscribe(first, applyEvaluation);
    return {
      driver,
      player,
      stop() {
        player.dispose();
        stop();
      },
    };
  };

  run = start();
  mountedReady = true;

  const replay = (): void => {
    run.stop();
    run = start();
  };
  const onKey = (event: StageEvent): void => {
    if (event.key === "r" || event.key === "R") replay();
  };
  const onClick = (event: StageEvent): void => {
    if (event.target === frame) replay();
  };
  host.addEventListener("keydown", onKey);
  frame.addEventListener("click", onClick);

  const observer =
    isElement(rawContainer) && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resized)
      : undefined;
  if (observer !== undefined && isElement(rawContainer)) {
    observer.observe(rawContainer);
    for (const { element: own } of placed.values())
      if (isElement(own) && !strokes.has(own)) observer.observe(own);
  }

  // A web font that lands after mount changes text sizes, so the boxes are measured again.
  const fonts = document.fonts;
  const fontsLoaded = (): void => {
    if (live) resized();
  };
  fonts?.addEventListener("loadingdone", fontsLoaded);
  void fonts?.ready.then(fontsLoaded);

  return {
    get player() {
      return run.player;
    },
    get driver() {
      return run.driver;
    },
    get rest() {
      return measured.rest;
    },
    get layouts() {
      return measured.layouts;
    },
    get ready() {
      return currentReady;
    },
    replay,
    send(name, value, target) {
      run.driver.send(name, value, target);
    },
    events: () => [...run.driver.events()],
    replace(next) {
      const nextStage = resolveStage(next);
      if (
        nextStage.beats.durationMs !== currentStage.beats.durationMs ||
        !sameCast(currentStage.members, nextStage.members)
      ) {
        throw new Error(
          "mountStage.replace: cannot replace a stage with a different cast or durationMs.",
        );
      }
      const prevStage = currentStage;
      currentStage = nextStage;
      let strokesChanged = false;
      for (const [name, target] of placed) {
        const entry = nextStage.members.byName.get(name);
        if (entry === undefined) continue;
        target.entry = entry;
        const stroke = strokes.get(target.element);
        if (stroke === undefined || entry.content === undefined) continue;
        const nextSource =
          entry.content.kind === "stroke"
            ? entry.content.path
            : entry.content.kind === "morph"
              ? (entry.content.matched[0] ?? entry.content.base)
              : undefined;
        if (nextSource !== undefined && stroke.source !== nextSource) {
          stroke.source = nextSource;
          stroke.cubics.clear();
          stroke.painted = undefined;
          strokesChanged = true;
        }
      }

      const skinChanged = !sameDomSkin(prevStage.skins.dom, nextStage.skins.dom);
      if (skinChanged) applySkin(nextStage.skins.dom);

      const frameChanged = !sameFrame(prevStage.frame, nextStage.frame);
      if (frameChanged) {
        applyFrameSize(nextStage.frame);
        fit();
      }

      const nextNames = layoutNamesOf(nextStage);
      const layoutsChanged = !sameNames(nextNames, names);
      const pivotsChanged = !samePivots(prevStage.members, nextStage.members);
      names = nextNames;
      if (skinChanged || frameChanged || layoutsChanged || pivotsChanged || strokesChanged) {
        measured = measure();
      }
      run.player.replace(sceneOf(), nextStage.cues);
    },
    dispose() {
      live = false;
      teardownSkinLoad();
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      observer?.disconnect();
      host.removeEventListener("keydown", onKey);
      frame.removeEventListener("click", onClick);
      run.stop();
      host.remove();
    },
  };
}
