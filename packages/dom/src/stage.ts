import {
  unreachable,
  type Cubic2d,
  type Events,
  type Pose2d,
  type Signal,
  type Time,
} from "@gerak/core";
import { play, type Player } from "@gerak/player";
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
  ZERO_BOX,
  type Box,
  type Content,
  type DomSkin,
  type DomSkinInput,
  type Frame,
  type FrameOutput,
  type Member,
  type Path,
  type Pivot,
  type Rest,
  type RestReader,
  type SceneBuilder,
  type Stage,
} from "@gerak/stage";
import { drawStrokes, morphAt, restOfBounds, strokeBox } from "@gerak/stage/render";
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
    createElement(tag: "div" | "style"): E;
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

/** A frame's targets as the scene returned them: a pose per actor or group, a function per list. */
export type StageValues = Readonly<Record<string, unknown>>;

/** What `mountStage` and `<Stage>` take: a compiled stage, or what `sceneBuilder` returns. */
export type StageInput = Stage | SceneBuilder;

/** Settings of `mountStage`: the frames its clock runs on, and whether each frame's shapes are checked. */
export interface StageOptions {
  readonly frames?: FrameSource;
  /** Told of the driver each time a run starts, the first and every replay. */
  readonly onDriver?: (driver: ClockDriver) => void;
  /** Checks every frame's targets with `check` and throws on a mistake; for authoring pages. */
  readonly checks?: boolean;
  /** How the DOM draws a scene given as `sceneBuilder` returns it; a compiled stage carries its own. */
  readonly skin?: DomSkinInput;
}

/** A playing stage: its player, driver, measured boxes, skin readiness, and lifecycle controls. */
export interface MountedStage {
  readonly player: Player<StageValues>;
  readonly driver: ClockDriver;
  /** Rest boxes of the layout showing. */
  readonly rest: Rest;
  /** Rest boxes of every layout, by name. */
  readonly layouts: Readonly<Record<string, Rest>>;
  /** Settles once the skin is applied and measured; a URL skin is fetched first. */
  readonly ready: Promise<void>;
  replay(): void;
  /** Swaps in a stage with the same signature, keeping time. */
  replace(next: StageInput): void;
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
function strokePlace(name: string, box: Box | undefined, layout: string): string {
  const at =
    box === undefined
      ? ""
      : ` left: ${box.x}px; top: ${box.y}px; width: ${box.width}px; height: ${box.height}px;`;
  return `:where([data-layout=${JSON.stringify(layout)}] [data-cast=${JSON.stringify(name)}]) { position: absolute;${at} }`;
}

/** A member's transform origin at its pivot, from where its box rests. */
function pivotPlace(name: string, box: Box, pivot: Pivot, layout: string): string {
  const left = pivot.x - (box.x - box.width / 2);
  const top = pivot.y - (box.y - box.height / 2);
  return `:where([data-layout=${JSON.stringify(layout)}] [data-cast=${JSON.stringify(name)}]) { transform-origin: ${left}px ${top}px; }`;
}

interface Stroke<S> {
  readonly svg: S;
  readonly path: S;
  source: Path;
  readonly isMorph: boolean;
  readonly cubics: Map<string, readonly Cubic2d[]>;
  painted: readonly Cubic2d[] | undefined;
  hasPartDefs: boolean;
}

interface Measured {
  readonly layouts: Readonly<Record<string, Rest>>;
  readonly readers: Readonly<Record<string, RestReader>>;
}

/** A member's element, or a list item's: `index` is the item's place in its list `member`. */
interface Placed<E> {
  readonly name: string;
  member: Member;
  readonly index: number | undefined;
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

function sameDomSkin(a: DomSkin | undefined, b: DomSkin | undefined): boolean {
  if (a === b) return true;
  if (a === undefined || b === undefined) return false;
  switch (a.kind) {
    case "inline":
      return b.kind === "inline" && a.css === b.css && a.defs === b.defs;
    case "url":
      return b.kind === "url" && a.css.href === b.css.href && a.defs?.href === b.defs?.href;
    default:
      return unreachable(a);
  }
}

function samePivots(a: readonly Member[], b: readonly Member[]): boolean {
  return a.every((member, index) => {
    const other = b[index];
    return member.pivot?.x === other?.pivot?.x && member.pivot?.y === other?.pivot?.y;
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

function isElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

function contentOf(placed: Placed<unknown>): Content | undefined {
  const { member, index } = placed;
  switch (member.kind) {
    case "actor":
      return member.content;
    case "list":
      return index === undefined ? undefined : member.items[index];
    case "group":
    case "object":
      return undefined;
    default:
      return unreachable(member);
  }
}

function sourceOf(content: Content | undefined): Path | undefined {
  if (content?.kind === "stroke") return content.path;
  if (content?.kind === "morph") return content.shapes[0];
  return undefined;
}

/** The stage a scene compiles to with `skin`, or the stage itself; throws naming every compile error. */
function resolveStage(input: StageInput, skin: DomSkinInput | undefined): Stage {
  if (isStage(input)) {
    if (skin !== undefined)
      throw new Error(
        "mountStage: a compiled stage carries its own skin; pass `skin` to compileScene.",
      );
    return input;
  }
  if (!isScene(input))
    throw new Error("mountStage: expected a stage or what `sceneBuilder` returns.");
  const compiled = compileScene(input, { skin });
  if (compiled.ok) return compiled.stage;
  throw new Error(
    `mountStage: invalid stage:\n${compiled.errors.map(formatStageError).join("\n")}`,
  );
}

/** Plays a stage in `host`; `R` or a click on the background replays it. */
export function mountStage(host: Element, stage: StageInput, options?: StageOptions): MountedStage;
export function mountStage<E extends StageElement<E, S>, S extends StageStroke<S>>(
  host: E & StageElement<E, S>,
  stage: StageInput,
  options?: StageOptions,
): MountedStage;
export function mountStage<E extends StageElement<E, S>, S extends StageStroke<S>>(
  host: Element | (E & StageElement<E, S>),
  stage: StageInput,
  options: StageOptions = {},
): MountedStage {
  if (isElement(host)) return mountInto<HTMLElement, SVGElement>(host, host, stage, options);
  return mountInto(host, host, stage, options);
}

function mountInto<E extends StageElement<E, S>, S extends StageStroke<S>>(
  container: StageHost<E, S>,
  rawContainer: unknown,
  stageInput: StageInput,
  options: StageOptions,
): MountedStage {
  let currentStage = resolveStage(stageInput, options?.skin);
  let size: Frame = currentStage.frame;
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
  const byIndex: Placed<E>[] = [];
  const strokes = new Map<E, Stroke<S>>();
  const strokeNames: string[] = [];
  const startTime: Time = {
    progress: 0,
    clock: { kind: "timed", elapsed: 0, length: currentStage.durationMs },
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

  const element = (name: string, kind: string): E => {
    const made = document.createElement("div");
    made.setAttribute("data-cast", name);
    made.setAttribute("data-kind", kind);
    return made;
  };

  const leaf = (own: E, name: string, content: Content): void => {
    switch (content.kind) {
      case "box":
        break;
      case "text":
        own.textContent = content.value;
        own.setAttribute("data-text", "");
        break;
      case "readout":
        try {
          own.textContent = content.format(startTime);
        } catch {
          // A failing readout throws again on the first frame, where the player reports it.
        }
        own.setAttribute("data-text", "");
        break;
      case "stroke":
      case "morph": {
        const svg = document.createElementNS(SVG, "svg");
        const path = document.createElementNS(SVG, "path");
        path.setAttribute("data-path", name);
        svg.append(path);
        own.append(svg);
        own.setAttribute("data-stroke", "");
        strokeNames.push(name);
        strokes.set(own, {
          svg,
          path,
          source: content.kind === "stroke" ? content.path : (content.shapes[0] ?? []),
          isMorph: content.kind === "morph",
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

  for (const member of currentStage.members) {
    const parent = byIndex[member.parent];
    if (member.kind === "object") {
      // A Three.js object has no DOM node; it keeps its place so parent indices still line up.
      byIndex.push({
        name: member.name,
        member,
        index: undefined,
        element: frame,
        parent,
        items: [],
      });
      continue;
    }
    const into = parent?.element ?? frame;
    const own = element(member.name, member.kind === "list" ? "many" : member.kind);
    into.append(own);
    switch (member.kind) {
      case "actor": {
        leaf(own, member.name, member.content);
        const self = {
          name: member.name,
          member,
          index: undefined,
          element: own,
          parent,
          items: [],
        };
        placed.set(member.name, self);
        byIndex.push(self);
        break;
      }
      case "list": {
        const items = member.items.map((_, index) => element(`${member.name}.${index}`, "item"));
        const self: Placed<E> = {
          name: member.name,
          member,
          index: undefined,
          element: own,
          parent,
          items,
        };
        placed.set(member.name, self);
        byIndex.push(self);
        member.items.forEach((content, index) => {
          const item = items[index];
          if (item === undefined) return;
          const name = `${member.name}.${index}`;
          leaf(item, name, content);
          own.append(item);
          placed.set(name, { name, member, index, element: item, parent: self, items: [] });
        });
        break;
      }
      case "group": {
        const self = {
          name: member.name,
          member,
          index: undefined,
          element: own,
          parent,
          items: [],
        };
        placed.set(member.name, self);
        byIndex.push(self);
        break;
      }
      default:
        unreachable(member);
    }
  }
  container.append(host);

  let activeSkinCss = "";
  let lastPlaces: readonly string[] = [];
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

  const markDefaultSkins = (styled: (name: string, list?: string) => boolean): void => {
    for (const target of placed.values()) {
      if (
        target.member.kind === "group" ||
        (target.member.kind === "list" && target.index === undefined)
      )
        continue;
      if (strokes.has(target.element)) continue;
      const list = target.index === undefined ? undefined : target.member.name;
      if (styled(target.name, list)) target.element.removeAttribute("data-skin");
      else target.element.setAttribute("data-skin", "default");
    }
  };

  const setPartDefs = (partDefsByName: ReadonlyMap<string, string>): void => {
    for (const [name, { element: own }] of placed) {
      const stroke = strokes.get(own);
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
  let mounted = false;
  let skinEpoch = 0;
  let activeAbort: AbortController | undefined;
  let currentReady: Promise<void> = Promise.resolve();

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

  let names: readonly string[] = currentStage.layouts.names;
  let shown: string = names[0] ?? "";
  frame.setAttribute("data-layout", shown);

  // Measures the stage under every layout in turn, then shows the layout in force again.
  const measure = (): Measured => {
    const ordered: string[] = [];
    const loops = new Set<string>();
    const laidOut = (layout: string): Rest => {
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
      const drawn = drawStrokes(currentStage, restReader(boxes));
      const owners = new Map<
        string,
        { readonly stroke: Stroke<S>; readonly parent: Placed<E> | undefined }
      >();
      for (const [name, { element: own, parent }] of placed) {
        const stroke = strokes.get(own);
        if (stroke !== undefined) owners.set(name, { stroke, parent });
      }
      if (!drawn.ok) loops.add(`mountStage: ${formatStageError(drawn.error)}`);
      else {
        for (const failure of drawn.strokes.failures)
          report(
            new Error(`The path of "${failure.name}" failed: ${String(failure.error)}`, {
              cause: failure.error,
            }),
          );
        for (const [name, cubics] of drawn.strokes.cubics)
          owners.get(name)?.stroke.cubics.set(layout, cubics);
      }
      for (const [name, { stroke, parent }] of owners) {
        const cubics = stroke.cubics.get(layout);
        if (cubics === undefined) {
          ordered.push(strokePlace(name, undefined, layout));
          boxes[name] = ZERO_BOX;
          continue;
        }
        const box = strokeBox(cubics);
        const home = parent === undefined ? undefined : boxes[parent.name];
        const left =
          home === undefined || parent === undefined
            ? 0
            : home.x - home.width / 2 + parent.element.clientLeft;
        const top =
          home === undefined || parent === undefined
            ? 0
            : home.y - home.height / 2 + parent.element.clientTop;
        ordered.push(strokePlace(name, { ...box, x: box.x - left, y: box.y - top }, layout));
        boxes[name] = restOfBounds(box);
      }
      for (const { name, member, index } of placed.values()) {
        const box = boxes[name];
        if (box !== undefined && index === undefined && member.pivot !== undefined)
          ordered.push(pivotPlace(name, box, member.pivot, layout));
      }
      return Object.freeze({ ...boxes });
    };

    const layouts: Record<string, Rest> = {};
    const readers: Record<string, RestReader> = {};
    if (!names.includes(shown)) shown = names[0] ?? "";
    try {
      for (const name of names) {
        frame.setAttribute("data-layout", name);
        const laid = laidOut(name);
        layouts[name] = laid;
        readers[name] = restReader(laid);
      }
    } finally {
      frame.setAttribute("data-layout", shown);
    }
    paint(shown);

    const looped = loops.size === 0 ? undefined : [...loops].join(" ");
    if (looped !== undefined && looped !== lastLoop) report(new Error(looped));
    lastLoop = looped;
    lastPlaces = ordered;
    const text = styleWith(ordered);
    if (style.textContent !== text) style.textContent = text;
    return { layouts: Object.freeze(layouts), readers: Object.freeze(readers) };
  };

  let measured: Measured;
  let lastFrame: FrameOutput | undefined;
  let readouts = new Map<string, string>();
  let run: { readonly driver: ClockDriver; readonly player: Player<StageValues>; stop(): void };

  const resized = (): void => {
    fit();
    measured = measure();
    run.player.refresh();
  };

  const useCss = (css: string, defs: string | undefined): void => {
    const parted = partPaints(css, defs, strokeNames);
    activeSkinCss = parted.css;
    markDefaultSkins(namedBy(css));
    setSharedDefs(defs);
    setPartDefs(parted.defs);
    style.textContent = styleWith(lastPlaces);
  };

  const fetchText = async (url: URL, signal: AbortSignal): Promise<string> => {
    if (typeof fetch !== "function") throw new Error(`cannot fetch "${url.href}" without fetch.`);
    const response = await fetch(url.href, { signal });
    if (!response.ok) throw new Error(`"${url.href}" answered HTTP ${response.status}.`);
    return response.text();
  };

  // A URL skin is fetched and then applied exactly as an inline one, so both style the same members.
  const applySkin = (skin: DomSkin | undefined): void => {
    skinEpoch += 1;
    activeAbort?.abort();
    activeAbort = undefined;
    const epoch = skinEpoch;
    const resolved: DomSkin = skin ?? { kind: "inline", css: "" };
    switch (resolved.kind) {
      case "inline":
        useCss(resolved.css, resolved.defs);
        currentReady = Promise.resolve();
        break;
      case "url": {
        useCss("", undefined);
        const controller = new AbortController();
        activeAbort = controller;
        const defs = resolved.defs;
        currentReady = Promise.all([
          fetchText(resolved.css, controller.signal),
          defs === undefined ? Promise.resolve(undefined) : fetchText(defs, controller.signal),
        ]).then(
          ([css, defsText]) => {
            if (!live || epoch !== skinEpoch) return;
            useCss(css, defsText);
            if (mounted) resized();
          },
          (error: unknown) => {
            if (!live || epoch !== skinEpoch) return;
            report(
              new Error(`mountStage: the skin failed to load: ${String(error)}`, { cause: error }),
            );
          },
        );
        break;
      }
      default:
        unreachable(resolved);
    }
  };

  applySkin(currentStage.skins.dom);

  const drive = (): { readonly driver: ClockDriver; stop(): void } => {
    const driver = clockDriver({
      duration: currentStage.durationMs,
      ...(options.frames === undefined ? {} : { frames: options.frames }),
    });
    for (const target of placed.values())
      if (target.member.watch) driver.watch(target.name, target.element);
    return { driver, stop: () => driver.dispose() };
  };

  fit();
  measured = measure();

  const sceneOf = (): Signal<StageValues> => (time, events) => {
    const out = frameOf(currentStage, { time, events, boxes: measured.readers });
    if (options.checks === true) {
      const errors = check(currentStage, out.targets);
      if (errors.length > 0)
        throw new TypeError(`mountStage: ${errors.map(formatStageError).join(" ")}`);
    }
    const nextReadouts = new Map<string, string>();
    for (const member of currentStage.members)
      if (member.kind === "actor" && member.content.kind === "readout")
        nextReadouts.set(member.name, member.content.format(time));
    readouts = nextReadouts;
    lastFrame = out;
    return out.targets;
  };

  // Styles the frame under the layout in force before a frame's values are written.
  const follow = (): void => {
    const inForce = lastFrame?.layout;
    if (inForce === undefined || inForce === shown) return;
    shown = inForce;
    frame.setAttribute("data-layout", shown);
    paint(shown);
  };

  const showAndRead = (): void => {
    const visible = lastFrame?.visible;
    if (visible === undefined) return;
    for (const target of byIndex) {
      // An object's place holds the frame; its presence is `bindScene3d`'s to write.
      if (target.member.kind === "object") continue;
      const on = visible[target.name] ?? true;
      if (!on || target.element.style.visibility === "hidden")
        target.element.style.visibility = on ? "" : "hidden";
    }
    for (const [name, text] of readouts) {
      const target = placed.get(name);
      if (target !== undefined && target.element.textContent !== text)
        target.element.textContent = text;
    }
  };

  const morph = (own: E, content: Content | undefined, pose: Pose2d): void => {
    if (content?.kind !== "morph") return;
    const drawing = strokes.get(own);
    const cubics = morphAt(content, pose);
    if (drawing !== undefined && !sameCubics(cubics, drawing.painted)) {
      drawing.path.setAttribute("d", pathData(cubics));
      drawing.painted = cubics;
    }
  };

  // A hidden member is not written: the scene is a function of time, so the frame that shows it writes it.
  const bind = (target: Placed<E>, value: unknown): void => {
    if (value === undefined || lastFrame?.visible[target.name] === false) return;
    const member = target.member;
    switch (member.kind) {
      case "actor":
      case "group": {
        const pose = poseOf(value);
        if (pose === undefined) return;
        write(target.element, pose);
        morph(target.element, contentOf(target), pose);
        break;
      }
      case "list": {
        const count = member.items.length;
        target.items.forEach((item, index) => {
          const pose = listPose(value, index, count);
          if (pose === undefined) return;
          write(item, pose);
          morph(item, member.items[index], pose);
        });
        break;
      }
      case "object":
        break;
      default:
        unreachable(member);
    }
  };

  const start = () => {
    const { driver, stop } = drive();
    const cues = currentStage.cues;
    const player = play<StageValues>(sceneOf(), driver, cues.length === 0 ? {} : { cues });
    options.onDriver?.(driver);
    const first = byIndex[0];
    if (first !== undefined) player.subscribe(first.name, follow);
    for (const target of byIndex) player.subscribe(target.name, (value) => bind(target, value));
    if (first !== undefined) player.subscribe(first.name, showAndRead);
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
  mounted = true;

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
      return measured.layouts[shown] ?? {};
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
      const nextStage = resolveStage(next, isStage(next) ? undefined : options?.skin);
      if (nextStage.signature !== currentStage.signature)
        throw new Error("mountStage.replace: the next stage has a different cast or durationMs.");
      const prevStage = currentStage;
      currentStage = nextStage;
      let strokesChanged = false;
      for (const target of placed.values()) {
        const index = byIndex.indexOf(
          target.index === undefined ? target : (target.parent ?? target),
        );
        const member = nextStage.members[index];
        if (member === undefined) continue;
        target.member = member;
        const stroke = strokes.get(target.element);
        const source = sourceOf(contentOf(target));
        const same =
          stroke !== undefined &&
          (stroke.source === source ||
            (typeof source === "object" &&
              typeof stroke.source === "object" &&
              sameCubics(source, stroke.source)));
        if (stroke !== undefined && source !== undefined && !same) {
          stroke.source = source;
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
      const layoutsChanged = !sameNames(nextStage.layouts.names, names);
      names = nextStage.layouts.names;
      if (
        skinChanged ||
        frameChanged ||
        layoutsChanged ||
        strokesChanged ||
        !samePivots(prevStage.members, nextStage.members)
      )
        measured = measure();
      run.player.replace(sceneOf(), nextStage.cues);
    },
    dispose() {
      live = false;
      skinEpoch += 1;
      activeAbort?.abort();
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      observer?.disconnect();
      host.removeEventListener("keydown", onKey);
      frame.removeEventListener("click", onClick);
      run.stop();
      host.remove();
    },
  };
}
