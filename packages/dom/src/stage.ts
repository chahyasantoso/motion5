import {
  POSE_2D_FIELDS,
  elapsedOf,
  type Cubic2d,
  type Events,
  type Pose2d,
  type Span,
  type Time,
} from "@gerak/moves";
import { play, type Driver, type Player, type Scene } from "@gerak/player";
import {
  castNames,
  DEFAULT_FRAME,
  pathOf,
  type ActorPath,
  type Box,
  type Cast,
  type CastName,
  type Frame,
  type Rest,
  type StageModule,
} from "@gerak/stage";
import { clockDriver, type ClockDriver } from "./drivers";
import type { PointerLike } from "./events";
import type { FrameSource } from "./frames";
import { applyValue, pathData, splitStroke, type RenderStyle } from "./render";
import { unreachable } from "./unreachable";

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
  getTotalLength?(): number;
}

/** An element the stage builds with and writes: a page element, or a stand-in in a test; `S` is
 * the SVG element it draws a stroke member's path with. */
export interface StageElement<E, S extends StageStroke<S> = StageStroke<never>> {
  readonly style: StageStyle;
  textContent: string | null;
  tabIndex: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  readonly offsetHeight: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly ownerDocument: {
    createElement(tag: "div" | "style"): E;
    createElementNS(namespace: typeof SVG, name: "svg" | "path"): S;
    readonly fonts?: StageFonts;
  };
  attachShadow(init: { readonly mode: "open" }): { append(...nodes: E[]): void };
  setAttribute(name: string, value: string): void;
  append(...nodes: (E | S)[]): void;
  remove(): void;
  addEventListener(type: string, listener: (event: StageEvent) => void): void;
  removeEventListener(type: string, listener: (event: StageEvent) => void): void;
}

/** A scene's answer per member name: one value, or one per item of a `many`. */
export type StageValues = Readonly<Record<string, Pose2d | readonly Pose2d[] | undefined>>;

function isPose(value: unknown): value is Pose2d {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const custom: unknown = Reflect.get(value, "custom");
  return (
    POSE_2D_FIELDS.every((field) => {
      const given: unknown = Reflect.get(value, field);
      return given === undefined || typeof given === (field === "anchor" ? "string" : "number");
    }) &&
    (custom === undefined ||
      (typeof custom === "object" &&
        custom !== null &&
        Object.values(custom).every((entry) => typeof entry === "number")))
  );
}

function isStageValues(values: object): values is StageValues {
  return Object.values(values).every(
    (value) =>
      value === undefined || isPose(value) || (Array.isArray(value) && value.every(isPose)),
  );
}

/** A stage module whose scene answers any object, checked on every frame to be stage values. */
export function stageModuleOf<B extends string>(
  module: StageModule<B>,
): StageModule<B, StageValues> {
  return {
    ...module,
    scene: (time, events, rest) => {
      const values = module.scene(time, events, rest);
      if (!isStageValues(values))
        throw new TypeError("The scene answered a value that is not a pose or a list of poses.");
      return values;
    },
  };
}

/** Settings of `mountStage`: the frames its clock runs on. */
export interface StageOptions {
  readonly frames?: FrameSource;
  /** Told of the driver each time a run starts, the first and every replay. */
  readonly onDriver?: (driver: ClockDriver) => void;
}

/** A playing stage: its player and driver, which a replay swaps for fresh ones. */
export interface MountedStage<B extends string = string> {
  readonly player: Player<StageValues>;
  readonly driver: ClockDriver;
  replay(): void;
  /** Swaps in the scene of a module with the same cast, skin and story, keeping time. */
  replace(next: StageModule<B, StageValues>): void;
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

/** The box the control points of `cubics` span, never thinner than 1 so a straight line still shows. */
function boxOf(cubics: readonly Cubic2d[]): Box {
  const xs = cubics.flatMap((c) => [c.x0, c.x1, c.x2, c.x3]);
  const ys = cubics.flatMap((c) => [c.y0, c.y1, c.y2, c.y3]);
  const span = (values: readonly number[]): readonly [number, number] => {
    const low = values.reduce((least, value) => Math.min(least, value), Infinity);
    const high = values.reduce((most, value) => Math.max(most, value), -Infinity);
    const size = values.length === 0 ? 0 : high - low;
    const from = values.length === 0 ? 0 : low;
    return size > 0 ? [from, size] : [from - 0.5, 1];
  };
  const [x, width] = span(xs);
  const [y, height] = span(ys);
  return { x, y, width, height };
}

/** A stroke member placed at `box` in its parent's space, at no specificity so a skin overrides it;
 * with no box it is only taken out of the flow. */
function strokePlace(name: string, box: Box | undefined): string {
  const at =
    box === undefined
      ? ""
      : ` left: ${box.x}px; top: ${box.y}px; width: ${box.width}px; height: ${box.height}px;`;
  return `:where([data-cast=${JSON.stringify(name)}]) { position: absolute;${at} }`;
}

/** A stroke member's drawing: its svg and path, the path it is given, and its last good cubics. */
interface Stroke<S> {
  readonly svg: S;
  readonly path: S;
  readonly source: ActorPath;
  cubics: readonly Cubic2d[] | undefined;
}

/** Reports an error the way an uncaught one in a frame is, without stopping the caller. */
function report(error: unknown): void {
  if (typeof reportError === "function") reportError(error);
  else
    setTimeout(() => {
      throw error;
    }, 0);
}

interface Placed<E> {
  readonly info: CastName;
  readonly element: E;
  readonly parent: Placed<E> | undefined;
  readonly items: readonly E[];
}

function isList(value: Pose2d | readonly Pose2d[]): value is readonly Pose2d[] {
  return Array.isArray(value);
}

function isBeat<B extends string>(order: readonly B[], name: string): name is B {
  const names: readonly string[] = order;
  return names.includes(name);
}

function isElement(value: unknown): value is Element {
  return typeof Element !== "undefined" && value instanceof Element;
}

/** Plays a stage module in `container`: builds its cast, scopes its skin, fits its frame, measures
 * each rest box and binds the scene's values; `R` or a click on the background replays it. */
export function mountStage<B extends string>(
  container: HTMLElement,
  module: StageModule<B, StageValues>,
  options?: StageOptions,
): MountedStage<B>;
export function mountStage<
  B extends string,
  E extends StageElement<E, S>,
  S extends StageStroke<S>,
>(
  container: E & StageElement<E, S>,
  module: StageModule<B, StageValues>,
  options?: StageOptions,
): MountedStage<B>;
export function mountStage<
  B extends string,
  E extends StageElement<E, S>,
  S extends StageStroke<S>,
>(
  container: E & StageElement<E, S>,
  module: StageModule<B, StageValues>,
  options: StageOptions = {},
): MountedStage<B> {
  const { beats, cast } = module;
  const size = module.frame ?? DEFAULT_FRAME;
  const document = container.ownerDocument;
  const infos = new Map(castNames(cast, beats.order).map((info) => [info.name, info]));
  const styled = namedBy(module.skins.dom?.css ?? "");

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
  const styleWith = (places: readonly string[]): string =>
    `${DEFAULT_SKIN}\n${places.join("\n")}\n${module.skins.dom?.css ?? ""}`;
  style.textContent = styleWith(
    [...infos.values()].flatMap(({ name, path }) =>
      path === undefined ? [] : [strokePlace(name, undefined)],
    ),
  );
  const frame = document.createElement("div");
  frame.setAttribute("data-stage", "frame");
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
  root.append(style, frame);

  const placed = new Map<string, Placed<E>>();
  const strokes = new Map<E, Stroke<S>>();
  const leaf = (element: E, info: CastName, list?: string): void => {
    if (info.text !== undefined) {
      element.textContent = info.text;
      element.setAttribute("data-text", "");
    }
    if (info.path !== undefined) {
      const svg = document.createElementNS(SVG, "svg");
      const path = document.createElementNS(SVG, "path");
      path.setAttribute("data-path", info.name);
      svg.append(path);
      element.append(svg);
      element.setAttribute("data-stroke", "");
      strokes.set(element, { svg, path, source: info.path, cubics: undefined });
    } else if (!styled(info.name, list)) element.setAttribute("data-skin", "default");
  };
  const write = (element: E, value: Pose2d): void => {
    const path = strokes.get(element)?.path;
    if (path === undefined) {
      applyValue(element, value);
      return;
    }
    const { stroke, body } = splitStroke(value);
    applyValue(element, body);
    applyValue(path, stroke);
  };
  // Draws a stroke where things rest; a path function that throws is reported and its last good path kept.
  const draw = (name: string, stroke: Stroke<S>, laid: Rest): readonly Cubic2d[] | undefined => {
    let cubics = stroke.cubics;
    try {
      cubics = pathOf(stroke.source, laid);
    } catch (error) {
      report(new Error(`The path of "${name}" failed: ${String(error)}`, { cause: error }));
    }
    if (cubics === undefined || cubics === stroke.cubics) return cubics;
    const box = boxOf(cubics);
    stroke.svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
    stroke.path.setAttribute("d", pathData(cubics));
    stroke.cubics = cubics;
    return cubics;
  };
  const element = (name: string, kind: string): E => {
    const made = document.createElement("div");
    made.setAttribute("data-cast", name);
    made.setAttribute("data-kind", kind);
    return made;
  };
  const build = (members: Cast, into: E, parent: Placed<E> | undefined): void => {
    for (const [name, member] of Object.entries(members)) {
      const info = infos.get(name);
      if (info === undefined) throw new Error(`mountStage: "${name}" has no cast name.`);
      const own = element(name, member.kind);
      into.append(own);
      switch (member.kind) {
        case "actor":
          leaf(own, info);
          placed.set(name, { info, element: own, parent, items: [] });
          break;
        case "many": {
          const items = member.items.map((_, index) => element(`${name}.${index}`, "item"));
          const self: Placed<E> = { info, element: own, parent, items };
          placed.set(name, self);
          items.forEach((item, index) => {
            const itemInfo = infos.get(`${name}.${index}`);
            if (itemInfo === undefined)
              throw new Error(`mountStage: "${name}.${index}" is unnamed.`);
            leaf(item, itemInfo, name);
            own.append(item);
            placed.set(itemInfo.name, { info: itemInfo, element: item, parent: self, items: [] });
          });
          break;
        }
        case "group": {
          const self: Placed<E> = { info, element: own, parent, items: [] };
          placed.set(name, self);
          build(member.members, own, self);
          break;
        }
        default:
          unreachable(member);
      }
    }
  };
  build(cast, frame, undefined);
  container.append(host);

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
  // Strokes sit out of the flow, so every other member is measured first and each path drawn from that.
  const measure = (): Rest => {
    const boxes: Record<string, Box> = {};
    for (const [name, { element: own, parent }] of placed) {
      if (strokes.has(own)) continue;
      let left = own.offsetLeft;
      let top = own.offsetTop;
      for (let up = parent; up !== undefined; up = up.parent) {
        left += up.element.offsetLeft;
        top += up.element.offsetTop;
      }
      const width = own.offsetWidth;
      const height = own.offsetHeight;
      boxes[name] = { x: left + width / 2, y: top + height / 2, width, height };
    }
    const laid: Rest = Object.freeze({ ...boxes });
    const places: string[] = [];
    for (const [name, { element: own, parent }] of placed) {
      const stroke = strokes.get(own);
      if (stroke === undefined) continue;
      const cubics = draw(name, stroke, laid);
      if (cubics === undefined) {
        places.push(strokePlace(name, undefined));
        boxes[name] = { x: 0, y: 0, width: 0, height: 0 };
        continue;
      }
      const box = boxOf(cubics);
      const home = parent === undefined ? undefined : laid[parent.info.name];
      const left = home === undefined ? 0 : home.x - home.width / 2;
      const top = home === undefined ? 0 : home.y - home.height / 2;
      places.push(strokePlace(name, { ...box, x: box.x - left, y: box.y - top }));
      boxes[name] = { ...box, x: box.x + box.width / 2, y: box.y + box.height / 2 };
    }
    const text = styleWith(places);
    if (style.textContent !== text) style.textContent = text;
    const rest: Record<string, Box> = {};
    for (const name of placed.keys()) {
      const box = boxes[name];
      if (box !== undefined) rest[name] = box;
    }
    return Object.freeze(rest);
  };

  const spanOf = (beat: string): Span | undefined =>
    isBeat(beats.order, beat) ? beats[beat] : undefined;
  // A stretch that ends at the story's end holds through the last frame and past it.
  const present = (on: NonNullable<CastName["on"]>, ms: number): boolean =>
    on.some(([first, last]) => {
      const from = spanOf(first)?.from ?? 0;
      const to = spanOf(last)?.to ?? beats.durationMs;
      return ms >= from && (ms <= to || to >= beats.durationMs);
    });
  const showAt = (time: Time): void => {
    const ms = elapsedOf(time.clock) ?? time.progress * beats.durationMs;
    for (const { info, element: own } of placed.values()) {
      if (info.on === undefined) continue;
      own.style.visibility = present(info.on, ms) ? "" : "hidden";
    }
  };
  const bind = (target: Placed<E>, value: Pose2d | readonly Pose2d[] | undefined): void => {
    if (value === undefined) return;
    const kind = target.info.kind;
    switch (kind) {
      case "actor":
      case "group":
        if (isList(value))
          throw new TypeError(`mountStage: "${target.info.name}" takes one value, not a list.`);
        write(target.element, value);
        break;
      case "many":
        if (!isList(value))
          throw new TypeError(
            `mountStage: "${target.info.name}" takes a list, one value per item.`,
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

  const watched = [...placed.values()].filter(({ info }) => info.watch);
  const drive = (): { readonly driver: ClockDriver; stop(): void } => {
    const driver = clockDriver({
      duration: beats.durationMs,
      ...(options.frames === undefined ? {} : { frames: options.frames }),
    });
    for (const { info, element: own } of watched) driver.watch(info.name, own);
    return { driver, stop: () => driver.dispose() };
  };

  fit();
  let rest = measure();
  let scene = module.scene;
  const sceneOf = (): Scene<StageValues> => (time, events) => scene(time, events, rest);
  const start = () => {
    const { driver, stop } = drive();
    const player = play<StageValues>(sceneOf(), driver);
    options.onDriver?.(driver);
    for (const target of placed.values())
      if (target.info.kind !== "item")
        player.subscribe(target.info.name, (value) => bind(target, value));
    const [first] = placed.keys();
    if (first !== undefined) player.subscribe(first, () => showAt(player.time));
    return {
      driver,
      player,
      stop() {
        player.dispose();
        stop();
      },
    };
  };
  let run = start();

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
  const resized = (): void => {
    fit();
    rest = measure();
    run.player.refresh();
  };
  const observer =
    isElement(container) && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(resized)
      : undefined;
  if (observer !== undefined && isElement(container)) {
    observer.observe(container);
    for (const { element: own } of placed.values()) if (isElement(own)) observer.observe(own);
  }
  // A web font that lands after mount changes text sizes, so the boxes are measured again.
  let live = true;
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
    replay,
    replace(next) {
      scene = next.scene;
      run.player.replace(sceneOf());
    },
    dispose() {
      live = false;
      fonts?.removeEventListener("loadingdone", fontsLoaded);
      observer?.disconnect();
      host.removeEventListener("keydown", onKey);
      frame.removeEventListener("click", onClick);
      run.stop();
      host.remove();
    },
  };
}
