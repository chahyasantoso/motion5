import { elapsedOf, type Events, type Pose2d, type Span, type Time } from "@gerak/moves";
import { play, type Driver, type Player, type Scene } from "@gerak/player";
import {
  castNames,
  DEFAULT_FRAME,
  type Box,
  type Cast,
  type CastName,
  type Frame,
  type Rest,
  type StageModule,
} from "@gerak/stage";
import { clockDriver, type FrameSource } from "./drivers";
import { eventDriver, type PointerLike } from "./events";
import { applyValue, type RenderStyle } from "./render";
import { unreachable } from "./unreachable";

/** The style properties the stage writes beside a value's; a page element's style has them all. */
export interface StageStyle extends RenderStyle {
  visibility?: string;
  display?: string;
  position?: string;
  overflow?: string;
  left?: string;
  top?: string;
  width?: string;
  height?: string;
  aspectRatio?: string;
}

/** What the stage reads of a page event: a key, where it landed, and the element it landed on. */
export interface StageEvent extends PointerLike {
  readonly key?: string;
  readonly target?: unknown;
}

/** An element the stage builds with and writes: a page element, or a stand-in in a test. */
export interface StageElement<E> {
  readonly style: StageStyle;
  textContent: string | null;
  tabIndex: number;
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly offsetWidth: number;
  readonly offsetHeight: number;
  readonly clientWidth: number;
  readonly clientHeight: number;
  readonly ownerDocument: { createElement(tag: "div" | "style"): E };
  attachShadow(init: { readonly mode: "open" }): { append(...nodes: E[]): void };
  setAttribute(name: string, value: string): void;
  append(...nodes: E[]): void;
  remove(): void;
  addEventListener(type: string, listener: (event: StageEvent) => void): void;
  removeEventListener(type: string, listener: (event: StageEvent) => void): void;
}

/** A scene's answer per member name: one value, or one per item of a `many`. */
export type StageValues = Readonly<Record<string, Pose2d | readonly Pose2d[] | undefined>>;

/** What a stage module exports, as the DOM stage reads it. */

/** Settings of `mountStage`: the frames and the ms clock its own drivers run on. */
export interface StageOptions {
  readonly frames?: FrameSource;
  readonly clock?: () => number;
  /** Told of the driver each time a run starts, the first and every replay. */
  readonly onDriver?: (driver: Driver) => void;
}

/** A playing stage: its player and driver, which a replay swaps for fresh ones. */
export interface MountedStage {
  readonly player: Player<StageValues>;
  readonly driver: Driver;
  replay(): void;
  /** Swaps in the scene of a module with the same cast, skin and story, keeping time. */
  replace(next: StageModule<string, StageValues>): void;
  dispose(): void;
}

// Every element is positioned, so each one's offsets are from its own parent's box.
const DEFAULT_SKIN = `
:where([data-stage="frame"]) {
  position: relative; display: flex; flex-wrap: wrap; align-items: center; justify-content: center;
  align-content: center; gap: 24px; overflow: hidden; font: 16px/1.2 system-ui, sans-serif;
}
:where([data-cast]) { position: relative; box-sizing: border-box; }
:where([data-kind="group"], [data-kind="many"]) {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 8px;
}
:where([data-skin="default"]) {
  display: flex; align-items: center; justify-content: center; min-width: 64px; min-height: 64px;
  padding: 4px; background: #ddd; color: #555; font-size: 12px;
}
:where([data-skin="default"]:not([data-text]))::before { content: attr(data-cast); }
:where([data-skin="default"][data-text]) {
  min-width: 0; min-height: 0; padding: 0; background: none; color: inherit; font-size: 48px;
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
): MountedStage;
export function mountStage<B extends string, E extends StageElement<E>>(
  container: E,
  module: StageModule<B, StageValues>,
  options?: StageOptions,
): MountedStage;
export function mountStage<B extends string, E extends StageElement<E>>(
  container: E,
  module: StageModule<B, StageValues>,
  options: StageOptions = {},
): MountedStage {
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
  style.textContent = `${DEFAULT_SKIN}\n${module.skins.dom?.css ?? ""}`;
  const frame = document.createElement("div");
  frame.setAttribute("data-stage", "frame");
  Object.assign(frame.style, {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: `${size.width}px`,
    height: `${size.height}px`,
    transformOrigin: "50% 50%",
  });
  root.append(style, frame);

  const placed = new Map<string, Placed<E>>();
  const leaf = (element: E, info: CastName, list?: string): void => {
    if (info.text !== undefined) {
      element.textContent = info.text;
      element.setAttribute("data-text", "");
    }
    if (!styled(info.name, list)) element.setAttribute("data-skin", "default");
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
    frame.style.transform = `translate(-50%, -50%) scale(${Number.isFinite(scale) ? scale : 1})`;
  };
  const measure = (): Rest => {
    const rest: Record<string, Box> = {};
    for (const [name, { element: own, parent }] of placed) {
      let left = own.offsetLeft;
      let top = own.offsetTop;
      for (let up = parent; up !== undefined; up = up.parent) {
        left += up.element.offsetLeft;
        top += up.element.offsetTop;
      }
      const width = own.offsetWidth;
      const height = own.offsetHeight;
      rest[name] = { x: left + width / 2, y: top + height / 2, width, height };
    }
    return Object.freeze(rest);
  };

  const spanOf = (beat: string | undefined): Span | undefined =>
    beat !== undefined && isBeat(beats.order, beat) ? beats[beat] : undefined;
  const present = (info: CastName, ms: number): boolean => {
    const enters = spanOf(info.enters);
    const leaves = spanOf(info.leaves);
    return (enters === undefined || ms >= enters.from) && (leaves === undefined || ms <= leaves.to);
  };
  const showAt = (time: Time): void => {
    const ms = elapsedOf(time.clock) ?? time.progress * beats.durationMs;
    for (const { info, element: own } of placed.values()) {
      if (info.enters === undefined && info.leaves === undefined) continue;
      own.style.visibility = present(info, ms) ? "" : "hidden";
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
        applyValue(target.element, value);
        break;
      case "many":
        if (!isList(value))
          throw new TypeError(
            `mountStage: "${target.info.name}" takes a list, one value per item.`,
          );
        target.items.forEach((item, index) => {
          const each = value[index];
          if (each !== undefined) applyValue(item, each);
        });
        break;
      case "item":
        break;
      default:
        unreachable(kind);
    }
  };

  const watched = [...placed.values()].filter(({ info }) => info.watch);
  const drive = (): { readonly driver: Driver; stop(): void } => {
    const timing = {
      ...(options.frames === undefined ? {} : { frames: options.frames }),
      ...(options.clock === undefined ? {} : { clock: options.clock }),
    };
    if (watched.length > 0) {
      const driver = eventDriver({ ...timing, introMs: beats.durationMs });
      for (const { info, element: own } of watched) driver.watch(info.name, own);
      return { driver, stop: () => driver.dispose() };
    }
    const driver = clockDriver({
      duration: beats.durationMs,
      ...(options.frames === undefined ? {} : { frames: options.frames }),
    });
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
  if (observer !== undefined && isElement(container)) observer.observe(container);

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
      observer?.disconnect();
      host.removeEventListener("keydown", onKey);
      frame.removeEventListener("click", onClick);
      run.stop();
      host.remove();
    },
  };
}
