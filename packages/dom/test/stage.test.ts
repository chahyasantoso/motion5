import { afterEach, describe, expect, it, vi } from "vitest";
import { toCubics, type Events, type Pose2d, type Time } from "@gerak/core";
import { follow, trace } from "@gerak/moves";
import { formatStageError, type RestReader, type Stage } from "@gerak/stage";
// The renderer is tested on compiled stages, built with the stage package's own compiler input.
import { compileStage } from "../../stage/src/run/compile";
import { defineStage, type StageDefinition } from "../../stage/src/author/stage";
import type { Members } from "../../stage/src/author/cast";
import { blendShapes, matchOutlines } from "@gerak/stage/render";
import {
  mountStage,
  pathData,
  type FrameSource,
  type StageInput,
  type StageElement,
  type StageEvent,
  type StageFonts,
  type StageStyle,
} from "@gerak/dom";

class FakeStyle implements StageStyle {
  readonly custom = new Map<string, string>();
  setProperty(name: string, value: string): void {
    this.custom.set(name, value);
  }
  removeProperty(name: string): void {
    this.custom.delete(name);
  }
}

interface FakeDocument {
  createElement(tag: "div" | "style" | "link"): FakeElement;
  createElementNS(namespace: string, name: "svg" | "path"): FakeElement;
  fonts?: StageFonts;
}

class FakeElement implements StageElement<FakeElement, FakeElement> {
  readonly style: FakeStyle & StageStyle = new FakeStyle();
  readonly attributes = new Map<string, string>();
  readonly children: FakeElement[] = [];
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  parent: FakeElement | undefined;
  shadowRoot: FakeElement | undefined;
  textContent: string | null = null;
  innerHTML?: string;
  tabIndex = -1;
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 0;
  offsetHeight = 0;
  clientWidth = 0;
  clientLeft = 0;
  clientTop = 0;
  clientHeight = 0;
  readonly ownerDocument: FakeDocument;

  constructor(
    readonly tagName: string,
    document?: FakeDocument,
  ) {
    this.ownerDocument = document ?? {
      createElement: (tag) => new FakeElement(tag, this.ownerDocument),
      createElementNS: (_namespace, name) => new FakeElement(name, this.ownerDocument),
    };
  }
  /** A path's length, as a page `path` measures it; 100 for any fake path. */
  getTotalLength(): number {
    return this.tagName === "path" ? 100 : 0;
  }
  attachShadow(): FakeElement {
    const root = new FakeElement("#shadow", this.ownerDocument);
    this.shadowRoot = root;
    return root;
  }
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
  append(...nodes: FakeElement[]): void {
    for (const node of nodes) {
      node.parent = this;
      this.children.push(node);
    }
  }
  remove(): void {
    const siblings = this.parent?.children;
    if (siblings !== undefined) {
      const idx = siblings.indexOf(this);
      if (idx >= 0) siblings.splice(idx, 1);
    }
    this.parent = undefined;
  }
  addEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener));
  }
  removeEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }
  fire(type: string, event: StageEvent = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }
  /** Every element below this one, through a shadow root, in document order. */
  all(): FakeElement[] {
    const below = [...this.children, ...(this.shadowRoot === undefined ? [] : [this.shadowRoot])];
    return below.flatMap((child) => [child, ...child.all()]);
  }
  find(name: string): FakeElement {
    const found = this.all().find((element) => element.attributes.get("data-cast") === name);
    if (found === undefined) throw new Error(`No element named ${name}.`);
    return found;
  }
}

function frames(): FrameSource {
  return { requestFrame: () => 1, cancelFrame: () => undefined };
}

/** Any page element is a stage element. */
export function acceptsPageElements(element: HTMLElement): StageElement<HTMLElement, SVGElement> {
  return element;
}

const beats = { intro: [0, 200], word: [300, 600], late: [800, 1000] } as const;

interface Seen {
  time?: Time;
  events?: Events;
  rest?: RestReader;
}

function makeStage(seen: Seen) {
  return defineStage({
    beats,
    cast: (m) => ({
      camera: m.group({
        dot: m.box(),
        word: m.letters("HI").on("word", "late"),
      }),
      card: m.box().watch(),
    }),
    skins: { dom: { css: `[data-cast="dot"] { width: 10px }` } },
    scene: ({ time, events, rest }) => {
      seen.time = time;
      seen.events = events;
      seen.rest = rest;
      const camera: Pose2d = { y: 40 };
      return { camera, word: (i) => ({ x: i + 1 }) };
    },
  });
}

function mounted(seen: Seen = {}, fonts?: StageFonts, customStage?: Stage) {
  const container = new FakeElement("div");
  if (fonts !== undefined) container.ownerDocument.fonts = fonts;
  const options = { frames: frames() };
  const stage =
    customStage === undefined
      ? mountStage(container, staged(makeStage(seen)), options)
      : mountStage(container, customStage, options);
  const root = container.children[0]?.shadowRoot;
  if (root === undefined) throw new Error("No shadow root.");
  return {
    container,
    root,
    stage,
    at(next: number) {
      stage.driver.seek(next / 1000);
    },
  };
}

function mustCompile<B extends string, M extends Members<B>, L extends string>(
  def: StageDefinition<B, M, L>,
): Stage {
  const result = compileStage(def);
  if (!result.ok) throw new Error("Expected stage to compile.");
  return result.stage;
}

/** Compiles a definition as `mountStage` once did, throwing its errors the same way. */
function staged<B extends string, M extends Members<B>, L extends string>(
  def: StageDefinition<B, M, L>,
): Stage {
  const result = compileStage(def);
  if (result.ok) return result.stage;
  throw new Error(`mountStage: invalid stage:\n${result.errors.map(formatStageError).join("\n")}`);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("mountStage", () => {
  it("mounts both StageDefinition and pre-compiled CompiledStage", () => {
    const def = makeStage({});
    const compiled = compileStage(def);
    expect(compiled.ok).toBe(true);
    if (!compiled.ok) return;

    const containerA = new FakeElement("div");
    const mountedA = mountStage(containerA, staged(def), { frames: frames() });
    const containerB = new FakeElement("div");
    const mountedB = mountStage(containerB, compiled.stage, { frames: frames() });
    expect(mountedA.player.values.camera).toEqual({ y: 40 });
    expect(mountedB.player.values.camera).toEqual({ y: 40 });
  });

  it("rejects an invalid definition with its formatted errors", () => {
    const badDef = defineStage({
      beats: { whole: [0, 100] },
      cast: (m) => ({
        // @ts-expect-error unknown beat is intentionally invalid at runtime
        dot: m.box().on("missing"),
      }),
      scene: () => ({}),
    });
    expect(() => mountStage(new FakeElement("div"), staged(badDef), { frames: frames() })).toThrow(
      /"missing", which is not a beat/,
    );
  });

  it("builds the cast as nested elements named by the cast", () => {
    const { root } = mounted();
    const frame = root.children.find((child) => child.tagName === "div");
    const names = (element: FakeElement | undefined) =>
      element?.children.map((child) => child.attributes.get("data-cast"));
    expect(names(frame)).toEqual(["camera", "card"]);
    expect(names(root.find("camera"))).toEqual(["dot", "word"]);
    expect(names(root.find("word"))).toEqual(["word.0", "word.1"]);
    expect(root.find("word.1").textContent).toBe("I");
  });

  it("scopes the skin to the stage's own shadow root", () => {
    const { container, root } = mounted();
    const style = root.children.find((child) => child.tagName === "style");
    expect(style?.textContent).toContain(`[data-cast="dot"] { width: 10px }`);
    expect(container.children.every((child) => child.tagName !== "style")).toBe(true);
  });

  it("draws a member its skin does not name with the default skin", () => {
    const { root } = mounted();
    expect(root.find("dot").attributes.has("data-skin")).toBe(false);
    expect(root.find("card").attributes.get("data-skin")).toBe("default");
  });

  it("asks a hidden list for no item poses, and a shown one for each", () => {
    const asked: number[] = [];
    const def = defineStage({
      beats,
      cast: (m) => ({ word: m.letters("HI").on("word") }),
      scene: () => ({
        word: (i) => {
          asked.push(i);
          return { x: i };
        },
      }),
    });
    const { at } = mounted({}, undefined, mustCompile(def));
    asked.length = 0;
    at(700);
    expect(asked).toEqual([]);
    at(400);
    expect(asked).toEqual([0, 1]);
  });

  it("shows a member on two beats, hides it in the gap, and holds a stretch ending the story", () => {
    const { root, at } = mounted();
    expect(root.find("word").style.visibility).toBe("hidden");
    at(400);
    expect(root.find("word").style.visibility).toBe("");
    expect(root.find("word.0").style.visibility).not.toBe("hidden");
    at(700);
    expect(root.find("word").style.visibility).toBe("hidden");
    expect(root.find("card").style.visibility).not.toBe("hidden");
    at(900);
    expect(root.find("word").style.visibility).toBe("");
    at(1500);
    expect(root.find("word").style.visibility).toBe("");
  });

  it("draws a path member as an SVG stroke: transform on the member, dash on the path", () => {
    const line = toCubics([
      { id: "a", x: 10, y: 20, inX: 0, inY: 0, outX: 30, outY: 0 },
      { id: "b", x: 110, y: 60, inX: -30, inY: 0, outX: 0, outY: 0 },
    ]);
    const def = defineStage({
      beats: { all: [0, 1000] },
      cast: (m) => ({
        trail: m.stroke(line),
        marks: m.many([line, line], (each) => m.stroke(each)),
        card: m.box().watch(),
      }),
      skins: { dom: { css: `[data-path="trail"] { stroke: red }` } },
      scene: ({ time, beats: b }) => ({
        trail: { x: 5, opacity: 0.5, ...trace({})(b.all.of(time)) },
        marks: (i) => (i === 0 ? { drawn: 0.25 } : { y: 3 }),
      }),
    });
    const { root, at } = mounted({}, undefined, mustCompile(def));
    const trail = root.find("trail");
    const [svg] = trail.children;
    const path = svg?.children[0];
    expect(svg?.tagName).toBe("svg");
    expect(svg?.attributes.get("viewBox")).toBe("10 20 100 40");
    expect(path?.attributes.get("data-path")).toBe("trail");
    expect(path?.attributes.get("d")).toBe(pathData(line));
    expect(trail.attributes.has("data-skin")).toBe(false);
    const style = root.children.find((child) => child.tagName === "style")?.textContent ?? "";
    expect(style).toContain(
      `:where([data-layout="main"] [data-cast="trail"]) { position: absolute; left: 10px; top: 20px; width: 100px; height: 40px; }`,
    );
    expect(style).toContain(
      `:where([data-layout="main"] [data-cast="marks.1"]) { position: absolute; left: 10px;`,
    );
    at(500);
    expect(trail.style.transform).toBe("translate3d(5px, 0px, 0px)");
    expect(trail.style.opacity).toBe("0.5");
    expect(trail.style.strokeDasharray ?? "").toBe("");
    expect(path?.style.strokeDasharray).toBe("50 100");
    expect(path?.style.strokeDashoffset).toBe("0");
    expect(path?.style.transform).toBe("");
    const marks = [0, 1].map((index) => root.find(`marks.${index}`).children[0]?.children[0]);
    expect(marks[0]?.style.strokeDasharray).toBe("25 100");
    expect(marks[1]?.style.strokeDasharray ?? "").toBe("");
    expect(root.find("marks.1").style.transform).toBe("translate3d(0px, 3px, 0px)");
  });

  it("writes a readout's text from the time, only when it changed", () => {
    const seconds = (time: Time) => {
      const elapsed = time.clock.kind === "timed" ? time.clock.elapsed : 0;
      return `00:${String(Math.floor(elapsed / 1000)).padStart(2, "0")}`;
    };
    const def = defineStage({
      beats: { all: [0, 3000] },
      cast: (m) => ({ timecode: m.readout(seconds), dot: m.box() }),
      scene: ({ time }) => ({ dot: { x: time.progress } }),
    });
    const container = new FakeElement("div");
    const stage = mountStage(container, staged(def), { frames: frames() });
    const timecode = container.children[0]?.shadowRoot?.find("timecode");
    if (timecode === undefined) throw new Error("No timecode.");
    expect(timecode.textContent).toBe("00:00");
    expect(timecode.attributes.has("data-text")).toBe(true);
    let text = timecode.textContent;
    const writes: string[] = [];
    Object.defineProperty(timecode, "textContent", {
      get: () => text,
      set: (value: string) => {
        writes.push(value);
        text = value;
      },
    });
    const at = (ms: number) => stage.driver.seek(ms / 3000);
    at(1000);
    expect(timecode.textContent).toBe("00:01");
    at(1500);
    at(2000);
    expect(timecode.textContent).toBe("00:02");
    expect(writes).toEqual(["00:01", "00:02"]);
  });

  it("throws on a shape mistake when checks are on, and on a readout that throws", () => {
    const badShape = defineStage({
      beats: { all: [0, 1000] },
      cast: (m) => ({ card: m.box(), dots: m.many(2) }),
      // @ts-expect-error intentional shape mismatch at runtime
      scene: () => ({ card: [{ x: 1 }] }),
    });
    expect(() =>
      mountStage(new FakeElement("div"), staged(badShape), { frames: frames(), checks: true }),
    ).toThrow(/"card" needs a pose object, got an array/);

    const badReadout = defineStage({
      beats: { all: [0, 1000] },
      cast: (m) => ({
        counter: m.readout((time) => {
          if (time.progress > 0.5) throw new Error("readout failed");
          return "ok";
        }),
      }),
      scene: () => ({}),
    });
    const mountedReadout = mountStage(new FakeElement("div"), staged(badReadout), {
      frames: frames(),
    });
    expect(() => mountedReadout.driver.seek(0.8)).toThrow("readout failed");
  });

  it("hands the scene a rest box for every name the cast makes", () => {
    const seen: Seen = {};
    mounted(seen);
    expect([...(seen.rest?.keys() ?? [])].sort()).toEqual(
      ["camera", "card", "dot", "word", "word.0", "word.1"].sort(),
    );
  });

  it("measures inside the frame through the member's groups", () => {
    const seen: Seen = {};
    const container = new FakeElement("div");
    const sizes: Record<string, readonly [number, number, number, number]> = {
      camera: [100, 50, 200, 100],
      dot: [10, 20, 40, 30],
    };
    const document: FakeDocument = {
      createElementNS: (_namespace, name) => new FakeElement(name, document),
      createElement(tag) {
        const element = new FakeElement(tag, document);
        const setAttribute = element.setAttribute.bind(element);
        element.setAttribute = (name, value) => {
          setAttribute(name, value);
          const size = name === "data-cast" ? sizes[value] : undefined;
          if (size !== undefined)
            [element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight] =
              size;
          if (name === "data-cast" && value === "camera")
            [element.clientLeft, element.clientTop] = [3, 2];
        };
        return element;
      },
    };
    const host = new FakeElement("div", document);
    container.append(host);
    const stage = mountStage(host, staged(makeStage(seen)), { frames: frames() });
    expect(seen.rest?.get("camera")).toEqual({ x: 200, y: 100, width: 200, height: 100 });
    expect(stage.rest.camera).toEqual({ x: 200, y: 100, width: 200, height: 100 });
    // The camera's 3 by 2 px border sits between its box and the dot's offsets.
    expect(seen.rest?.get("dot")).toEqual({ x: 133, y: 87, width: 40, height: 30 });
  });

  it("writes a group's value on the group's element and a list item by item", () => {
    const { root, at } = mounted();
    expect(root.find("camera").style.transform).toBe("translate3d(0px, 40px, 0px)");
    expect(root.find("dot").style.transform).toBeUndefined();
    expect(root.find("word.1").style.transform).toBeUndefined();
    at(400);
    expect(root.find("word.1").style.transform).toBe("translate3d(2px, 0px, 0px)");
  });

  it("swaps in a new scene on the same elements, tells of each run's driver, and rejects incompatible replace", () => {
    const drivers: unknown[] = [];
    const container = new FakeElement("div");
    const stage = mountStage(container, staged(makeStage({})), {
      frames: frames(),
      onDriver: (driver) => drivers.push(driver),
    });
    const root = container.children[0]?.shadowRoot;
    const element = root?.find("camera");
    stage.replace(
      staged(
        defineStage({
          beats,
          cast: (m) => ({
            camera: m.group({
              dot: m.box(),
              word: m.letters("HI").on("word", "late"),
            }),
            card: m.box().watch(),
          }),
          skins: { dom: { css: `[data-cast="dot"] { width: 10px }` } },
          scene: () => ({ camera: { y: 99 } }),
        }),
      ),
    );
    expect(root?.find("camera")).toBe(element);
    expect(element?.style.transform).toBe("translate3d(0px, 99px, 0px)");
    stage.replay();
    expect(drivers).toEqual([drivers[0], stage.driver]);
    expect(drivers).toHaveLength(2);

    expect(() =>
      stage.replace(
        staged(
          defineStage({
            beats,
            cast: (m) => ({ other: m.box() }),
            scene: () => ({}),
          }),
        ),
      ),
    ).toThrow(/different cast or durationMs/);
  });

  it("brings a hover on a watched member to the scene under its name", () => {
    const seen: Seen = {};
    const { root, at } = mounted(seen);
    root.find("card").fire("pointerenter");
    at(10);
    expect(seen.events?.map((event) => [event.name, event.target])).toEqual([["enter", "card"]]);
  });

  it("takes a sample past the story's end into the scene's next frame, and hands back its log", () => {
    const def = defineStage({
      beats: { all: [0, 1000] },
      cast: (m) => ({ beak: m.box() }),
      scene: ({ time, events }) => ({
        beak: { scaleY: follow({ start: 0, on: { mouthOpen: "value" } })(time, events) },
      }),
    });
    let queued: ((at: number) => void)[] = [];
    const run = (ms: number) => {
      const due = queued;
      queued = [];
      for (const frame of due) frame(ms);
    };
    const container = new FakeElement("div");
    const stage = mountStage(container, staged(def), {
      frames: {
        requestFrame: (frame) => queued.push(frame),
        cancelFrame: () => undefined,
      },
    });
    const beak = container.children[0]?.shadowRoot?.find("beak");
    run(0);
    run(1200);
    expect(stage.driver.playing()).toBe(false);
    expect(beak?.style.transform).toBe("scaleY(0)");
    stage.send("mouthOpen", 1);
    expect(stage.events()).toEqual([{ name: "mouthOpen", at: 1000, value: 1 }]);
    run(1300);
    run(1500);
    expect(beak?.style.transform).not.toBe("scaleY(0)");
    stage.replay();
    expect(stage.events()).toEqual([]);
  });

  it("replays on R and on a click on the background, never on a watched member", () => {
    const seen: Seen = {};
    const { container, root, stage } = mounted(seen);
    const first = stage.driver;
    root.find("card").fire("click", { target: root.find("card") });
    expect(stage.driver).toBe(first);
    const frame = root.children.find((child) => child.tagName === "div");
    frame?.fire("click", { target: frame });
    const second = stage.driver;
    expect(second).not.toBe(first);
    container.children[0]?.fire("keydown", { key: "r" });
    expect(stage.driver).not.toBe(second);
  });

  it("measures again when its container resizes", () => {
    let resized: (() => void) | undefined;
    vi.stubGlobal("Element", FakeElement);
    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(listener: () => void) {
          resized = listener;
        }
        observe(): void {}
        disconnect(): void {}
      },
    );
    const seen: Seen = {};
    const { root, stage } = mounted(seen);
    const before = seen.rest;
    root.find("dot").offsetWidth = 64;
    resized?.();
    expect(seen.rest).not.toBe(before);
    expect(seen.rest?.get("dot").width).toBe(64);
    expect(stage.rest.dot?.width).toBe(64);
  });

  it("measures again when a web font lands, and not after it is disposed", async () => {
    vi.stubGlobal("Element", FakeElement);
    const listeners = new Set<() => void>();
    let ready: () => void = () => undefined;
    const fonts = {
      ready: new Promise<void>((resolve) => {
        ready = resolve;
      }),
      addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) => listeners.delete(listener),
    };
    const seen: Seen = {};
    const { root, stage } = mounted(seen, fonts);
    root.find("dot").offsetWidth = 80;
    ready();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(seen.rest?.get("dot").width).toBe(80);
    stage.dispose();
    expect(listeners.size).toBe(0);
  });

  describe("DOM skins inline and by URL", () => {
    it("resolves ready at once for an inline skin", async () => {
      const container = new FakeElement("div");
      const stage = mountStage(
        container,
        staged(
          defineStage({
            beats: { all: [0, 500] },
            cast: (m) => ({ card: m.box() }),
            skins: {
              dom: {
                css: `[data-cast="card"] { color: red; }`,
                defs: `<linearGradient id="g"></linearGradient>`,
              },
            },
            scene: () => ({}),
          }),
        ),
        { frames: frames() },
      );
      await stage.ready;
      const root = container.children[0]?.shadowRoot;
      const style = root?.children.find((c) => c.tagName === "style");
      expect(style?.textContent).toContain(`[data-cast="card"] { color: red; }`);
      expect(root?.find("card").attributes.has("data-skin")).toBe(false);
    });

    it("fetches a URL skin and applies it as an inline one: same markers, defs, then a measure", async () => {
      const bodies: Record<string, string> = {
        "https://example.com/skin.css": `[data-cast="card"] { color: red; }`,
        "https://example.com/defs.svg": '<linearGradient id="url-grad"></linearGradient>',
      };
      vi.stubGlobal("fetch", async (url: string) => ({
        ok: true,
        text: async () => bodies[url] ?? "",
      }));
      const container = new FakeElement("div");
      const seen: Seen = {};
      const stage = mountStage(
        container,
        staged(
          defineStage({
            beats: { all: [0, 500] },
            cast: (m) => ({ card: m.box(), plain: m.box() }),
            skins: {
              dom: {
                css: new URL("https://example.com/skin.css"),
                defs: new URL("https://example.com/defs.svg"),
              },
            },
            scene: ({ rest }) => {
              seen.rest = rest;
              return {};
            },
          }),
        ),
        { frames: frames() },
      );
      const root = container.children[0]?.shadowRoot;
      if (root === undefined) throw new Error("No shadow root.");
      expect(root.children.some((c) => c.tagName === "link")).toBe(false);
      root.find("card").offsetWidth = 320;
      await stage.ready;
      const style = root.children.find((c) => c.tagName === "style");
      expect(style?.textContent).toContain(`[data-cast="card"] { color: red; }`);
      expect(root.find("card").attributes.has("data-skin")).toBe(false);
      expect(root.find("plain").attributes.get("data-skin")).toBe("default");
      expect(seen.rest?.get("card").width).toBe(320);
      expect(stage.rest["card"]?.width).toBe(320);
      const frame = root.children.find((c) => c.tagName === "div");
      const defs = frame?.children.filter((c) => c.innerHTML !== undefined) ?? [];
      expect(defs.map((c) => c.innerHTML)).toEqual([
        '<defs><linearGradient id="url-grad"></linearGradient></defs>',
      ]);
    });

    it("settles ready and reports which file failed when a URL skin cannot load", async () => {
      const reported: unknown[] = [];
      vi.stubGlobal("reportError", (err: unknown) => reported.push(err));
      vi.stubGlobal("fetch", async () => ({ ok: false, status: 404, text: async () => "" }));
      const stage = mountStage(
        new FakeElement("div"),
        staged(
          defineStage({
            beats: { all: [0, 500] },
            cast: (m) => ({ card: m.box() }),
            skins: { dom: { css: new URL("https://example.com/missing.css") } },
            scene: () => ({}),
          }),
        ),
        { frames: frames() },
      );
      await stage.ready;
      expect(reported.map(String).join("\n")).toContain("missing.css");
    });

    it("ignores a URL skin that lands after replace swapped in another", async () => {
      const resolvers: ((res: { ok: boolean; text: () => Promise<string> }) => void)[] = [];
      vi.stubGlobal(
        "fetch",
        () =>
          new Promise((resolve) => {
            resolvers.push(resolve);
          }),
      );
      const container = new FakeElement("div");
      const makeUrlStage = (href: string) =>
        staged(
          defineStage({
            beats: { all: [0, 500] },
            cast: (m) => ({ card: m.box() }),
            skins: { dom: { css: new URL(href) } },
            scene: () => ({}),
          }),
        );
      const stage = mountStage(container, makeUrlStage("https://example.com/first.css"), {
        frames: frames(),
      });
      const firstReady = stage.ready;
      stage.replace(makeUrlStage("https://example.com/second.css"));
      const root = container.children[0]?.shadowRoot;
      if (root === undefined) throw new Error("No shadow root.");
      root.find("card").offsetWidth = 999;
      resolvers[0]?.({ ok: true, text: async () => `[data-cast="card"] { color: stale; }` });
      await firstReady;
      const style = () => root.children.find((c) => c.tagName === "style")?.textContent ?? "";
      expect(style()).not.toContain("stale");
      expect(stage.rest["card"]?.width).toBe(0);
      root.find("card").offsetWidth = 220;
      resolvers[1]?.({ ok: true, text: async () => `[data-cast="card"] { color: fresh; }` });
      await stage.ready;
      expect(style()).toContain("fresh");
      expect(stage.rest["card"]?.width).toBe(220);
    });
  });

  describe("a path drawn from where things rest", () => {
    type Size = [number, number, number, number];
    const level = (from: number, to: number, y: number) =>
      toCubics([
        { id: "a", x: from, y, inX: 0, inY: 0, outX: 0, outY: 0 },
        { id: "b", x: to, y, inX: 0, inY: 0, outX: 0, outY: 0 },
      ]);

    /** A stage whose members take the offsets and sizes in `sizes` by name, with a resize to call. */
    function laidOut(def: StageInput, sizes: Record<string, Size>) {
      let resized: (() => void) | undefined;
      vi.stubGlobal("Element", FakeElement);
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(listener: () => void) {
            resized = listener;
          }
          observe(): void {}
          disconnect(): void {}
        },
      );
      const document: FakeDocument = {
        createElementNS: (_namespace, name) => new FakeElement(name, document),
        createElement(tag) {
          const element = new FakeElement(tag, document);
          const setAttribute = element.setAttribute.bind(element);
          element.setAttribute = (name, value) => {
            setAttribute(name, value);
            const size = name === "data-cast" ? sizes[value] : undefined;
            if (size !== undefined)
              [element.offsetLeft, element.offsetTop, element.offsetWidth, element.offsetHeight] =
                size;
          };
          return element;
        },
      };
      const host = new FakeElement("div", document);
      new FakeElement("div").append(host);
      mountStage(host, def, { frames: frames() });
      const root = host.children[0]?.shadowRoot;
      if (root === undefined) throw new Error("No shadow root.");
      const style = () => root.children.find((child) => child.tagName === "style")?.textContent;
      return { root, style, resize: () => resized?.() };
    }

    function underlined(seen: Seen, path: (rest: RestReader) => ReturnType<typeof level>) {
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ line: m.group({ word: m.text("HI"), under: m.stroke(path) }) }),
        scene: ({ rest }) => {
          seen.rest = rest;
          return {};
        },
      });
      return laidOut(staged(def), { line: [100, 200, 600, 100], word: [50, 10, 200, 80] });
    }

    it("sits under a measured word, in the word's group, after layout and after a resize", () => {
      const seen: Seen = {};
      const handed: { readonly hasUnder: boolean }[] = [];
      const { root, style, resize } = underlined(seen, (rest) => {
        handed.push({ hasUnder: rest.has("under") });
        const word = rest.get("word");
        return level(
          word.x - word.width / 2,
          word.x + word.width / 2,
          word.y + word.height / 2 + 4,
        );
      });
      expect(seen.rest?.get("word")).toEqual({ x: 250, y: 250, width: 200, height: 80 });
      expect(seen.rest?.get("under")).toEqual({ x: 250, y: 294, width: 200, height: 1 });
      expect(style()).toContain(
        `:where([data-layout="main"] [data-cast="under"]) { position: absolute; left: 50px; top: 93.5px; width: 200px; height: 1px; }`,
      );
      const svg = root.find("under").children[0];
      expect(svg?.attributes.get("viewBox")).toBe("150 293.5 200 1");
      expect(svg?.children[0]?.attributes.get("d")).toBe(pathData(level(150, 350, 294)));
      expect(handed.every((entry) => !entry.hasUnder)).toBe(true);
      root.find("word").offsetWidth = 300;
      resize();
      expect(seen.rest?.get("under")).toEqual({ x: 300, y: 294, width: 300, height: 1 });
      expect(style()).toContain(`left: 50px; top: 93.5px; width: 300px; height: 1px; }`);
      expect(svg?.children[0]?.attributes.get("d")).toBe(pathData(level(150, 450, 294)));
    });

    it("draws a path reading another stroke after that stroke, from its end", () => {
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({
          line: m.group({
            link: m.stroke((rest) => {
              const under = rest.get("under");
              const word = rest.get("word");
              return level(under.x + under.width / 2, word.x, word.y);
            }),
            word: m.text("HI"),
            under: m.stroke((rest) => {
              const word = rest.get("word");
              return level(word.x - word.width / 2, word.x + word.width / 2, word.y + 44);
            }),
          }),
        }),
        scene: () => ({}),
      });
      const { root } = laidOut(staged(def), {
        line: [100, 200, 600, 100],
        word: [50, 10, 200, 80],
      });
      const d = root.find("link").children[0]?.children[0]?.attributes.get("d");
      expect(d).toBe(pathData(level(350, 250, 250)));
    });

    it("reports two paths that read each other, naming both, and draws neither", () => {
      const reported: unknown[] = [];
      vi.stubGlobal("reportError", (error: unknown) => reported.push(error));
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({
          a: m.stroke((rest) => level(0, rest.get("b").width + 1, 0)),
          b: m.stroke((rest) => level(0, rest.get("a").width + 1, 0)),
        }),
        scene: () => ({}),
      });
      const { root, style } = laidOut(staged(def), {});
      expect(reported.map(String)).toEqual([
        'Error: mountStage: paths "a" and "b" read each other.',
      ]);
      expect(root.find("a").children[0]?.children[0]?.attributes.has("d")).toBe(false);
      expect(style()).toContain(
        `:where([data-layout="main"] [data-cast="b"]) { position: absolute; }`,
      );
    });

    it("reports a path function that throws and keeps its last good path", () => {
      const reported: unknown[] = [];
      vi.stubGlobal("reportError", (error: unknown) => reported.push(error));
      let broken = false;
      const seen: Seen = {};
      const { root, resize } = underlined(seen, (rest) => {
        if (broken) throw new Error("no word");
        const word = rest.get("word");
        return level(word.x - word.width / 2, word.x + word.width / 2, word.y);
      });
      const path = root.find("under").children[0]?.children[0];
      const drawn = path?.attributes.get("d");
      broken = true;
      root.find("word").offsetWidth = 300;
      resize();
      expect(reported).toHaveLength(1);
      expect(String(reported[0])).toMatch(/"under".*no word/);
      expect(path?.attributes.get("d")).toBe(drawn);
      expect(seen.rest?.get("under").width).toBe(200);
    });
  });

  describe("named layouts", () => {
    interface Laid {
      rest?: RestReader;
      layouts?: Readonly<Record<string, RestReader>>;
      layoutAtWrite?: string | undefined;
    }

    /** A stage whose `card` rests at 100 px under `list` and 700 px under `detail`; the fake does no
     * layout, so `card` reads its offset from the frame's `data-layout`. */
    function layered(
      seen: Laid,
      options: {
        readonly cues?: Events;
        readonly defs?: string;
        readonly cardPivot?: { x: number; y: number };
        readonly extraLine?: (rest: RestReader) => ReturnType<typeof toCubics>;
        readonly customScene?: (ctx: {
          rest: RestReader;
          layouts: Readonly<Record<"list" | "detail", RestReader>>;
          carry: (member: string, opts: { ms: number }) => Pose2d;
        }) => { card?: Pose2d };
      } = {},
    ) {
      let resized: (() => void) | undefined;
      vi.stubGlobal("Element", FakeElement);
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(listener: () => void) {
            resized = listener;
          }
          observe(): void {}
          disconnect(): void {}
        },
      );
      const layoutSets: string[] = [];
      let frame: FakeElement | undefined;
      const document: FakeDocument = {
        createElementNS: (_namespace, name) => new FakeElement(name, document),
        createElement(tag) {
          const element = new FakeElement(tag, document);
          const setAttribute = element.setAttribute.bind(element);
          element.setAttribute = (name, value) => {
            setAttribute(name, value);
            if (name === "data-stage" && value === "frame") frame = element;
            if (name === "data-layout") layoutSets.push(value);
            if (name === "data-cast" && value === "card") {
              Object.defineProperty(element, "offsetLeft", {
                get: () => (frame?.attributes.get("data-layout") === "detail" ? 700 : 100),
              });
              [element.offsetWidth, element.offsetHeight] = [200, 100];
            }
          };
          return element;
        },
      };
      const host = new FakeElement("div", document);
      new FakeElement("div").append(host);
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => {
          const baseCard = m.box().watch();
          const card = options.cardPivot ? baseCard.pivot(options.cardPivot) : baseCard;
          return {
            card,
            ...(options.extraLine ? { line: m.stroke(options.extraLine) } : { dot: m.box() }),
          };
        },
        skins: {
          dom: {
            css: `[data-layout="list"] [data-cast="card"] { left: 0 } [data-layout="detail"] [data-cast="card"] { left: 600px }`,
            ...(options.defs === undefined ? {} : { defs: options.defs }),
          },
        },
        layouts: {
          names: ["list", "detail"],
          pick: (events) => (events.some((event) => event.name === "click") ? "detail" : "list"),
        },
        ...(options.cues === undefined ? {} : { cues: options.cues }),
        scene: ({ rest, layouts, carry }) => {
          seen.rest = rest;
          seen.layouts = layouts;
          if (options.customScene !== undefined) {
            return options.customScene({ rest, layouts, carry });
          }
          return { card: { x: 1 } };
        },
      });
      const stage = mountStage(host, staged(def), { frames: frames() });
      const root = host.children[0]?.shadowRoot;
      if (root === undefined || frame === undefined) throw new Error("No frame.");
      const card = root.find("card");
      const style = card.style;
      const shown = frame;
      Object.defineProperty(card, "style", {
        get: () => {
          seen.layoutAtWrite = shown.attributes.get("data-layout");
          return style;
        },
      });
      return {
        root,
        stage,
        frame,
        layoutSets,
        resize: () => resized?.(),
        at: (ms: number) => stage.driver.seek(ms / 1000),
      };
    }

    it("measures every layout and hands the scene the one in force beside all of them", () => {
      const seen: Laid = {};
      const { frame, stage } = layered(seen);
      expect(seen.layouts?.list?.get("card")).toEqual({ x: 200, y: 50, width: 200, height: 100 });
      expect(seen.layouts?.detail?.get("card")).toEqual({ x: 800, y: 50, width: 200, height: 100 });
      expect(stage.layouts.list?.card).toEqual({ x: 200, y: 50, width: 200, height: 100 });
      expect(stage.layouts.detail?.card).toEqual({ x: 800, y: 50, width: 200, height: 100 });
      expect(seen.rest).toBe(seen.layouts?.list);
      expect(frame.attributes.get("data-layout")).toBe("list");
    });

    it("carries a member smoothly across a multi-layout change", () => {
      const seen: Laid = {};
      const { root, at } = layered(seen, {
        cues: [{ name: "click", at: 200, target: "card" }],
        customScene: ({ carry }) => ({ card: carry("card", { ms: 200 }) }),
      });
      // At 300ms (halfway through 200ms carry from list x=200 to detail x=800): drawn x=500, own detail x=800 -> dx=-300
      at(300);
      expect(root.find("card").style.transform).toBe("translate3d(-300px, 0px, 0px)");
      at(450);
      expect(root.find("card").style.transform).toBe("");
    });

    it("follows the layout an event puts in force, before the frame's values are written, and back on a seek", () => {
      const seen: Laid = {};
      const { root, frame, at } = layered(seen);
      at(200);
      root.find("card").fire("click", { target: root.find("card") });
      at(400);
      expect(frame.attributes.get("data-layout")).toBe("detail");
      expect(seen.rest).toBe(seen.layouts?.detail);
      expect(seen.layoutAtWrite).toBe("detail");
      at(100);
      expect(frame.attributes.get("data-layout")).toBe("list");
      expect(seen.rest).toBe(seen.layouts?.list);
      expect(seen.layoutAtWrite).toBe("list");
    });

    it("plays the stage's own cues, so a scripted click changes the layout at its time", () => {
      const seen: Laid = {};
      const { frame, at } = layered(seen, { cues: [{ name: "click", at: 500, target: "card" }] });
      at(400);
      expect(frame.attributes.get("data-layout")).toBe("list");
      at(600);
      expect(frame.attributes.get("data-layout")).toBe("detail");
      expect(seen.rest).toBe(seen.layouts?.detail);
    });

    it("draws a stroke under every layout and shows the one in force", () => {
      const seen: Laid = {};
      const under = (rest: RestReader) => {
        const card = rest.get("card");
        return toCubics([
          { id: "a", x: card.x - 50, y: 120, inX: 0, inY: 0, outX: 0, outY: 0 },
          { id: "b", x: card.x + 50, y: 120, inX: 0, inY: 0, outX: 0, outY: 0 },
        ]);
      };
      const { root, at, stage } = layered(seen, { extraLine: under });
      const style = root.children.find((child) => child.tagName === "style")?.textContent ?? "";
      expect(style).toContain(
        `:where([data-layout="list"] [data-cast="line"]) { position: absolute; left: 150px;`,
      );
      expect(style).toContain(
        `:where([data-layout="detail"] [data-cast="line"]) { position: absolute; left: 750px;`,
      );
      const path = root.find("line").children[0]?.children[0];
      expect(path?.attributes.get("d")).toBe(
        pathData(
          toCubics([
            {
              id: "a",
              x: (stage.layouts.list?.card?.x ?? 0) - 50,
              y: 120,
              inX: 0,
              inY: 0,
              outX: 0,
              outY: 0,
            },
            {
              id: "b",
              x: (stage.layouts.list?.card?.x ?? 0) + 50,
              y: 120,
              inX: 0,
              inY: 0,
              outX: 0,
              outY: 0,
            },
          ]),
        ),
      );
      at(200);
      root.find("card").fire("click", { target: root.find("card") });
      at(400);
      expect(path?.attributes.get("d")).toBe(
        pathData(
          toCubics([
            {
              id: "a",
              x: (stage.layouts.detail?.card?.x ?? 0) - 50,
              y: 120,
              inX: 0,
              inY: 0,
              outX: 0,
              outY: 0,
            },
            {
              id: "b",
              x: (stage.layouts.detail?.card?.x ?? 0) + 50,
              y: 120,
              inX: 0,
              inY: 0,
              outX: 0,
              outY: 0,
            },
          ]),
        ),
      );
    });

    it("measures every layout once per resize and restores the one in force", () => {
      const seen: Laid = {};
      const { root, frame, layoutSets, resize, at } = layered(seen);
      at(200);
      root.find("card").fire("click", { target: root.find("card") });
      at(400);
      layoutSets.length = 0;
      resize();
      expect(layoutSets).toEqual(["list", "detail", "detail"]);
      expect(frame.attributes.get("data-layout")).toBe("detail");
    });

    it("measures again when a swapped stage changes its layouts", () => {
      const seen: Laid = {};
      const { stage } = layered(seen);
      stage.replace(
        staged(
          defineStage({
            beats: { all: [0, 1000] },
            cast: (m) => ({ card: m.box().watch(), dot: m.box() }),
            layouts: { names: ["list", "detail", "wide"] },
            scene: ({ rest, layouts }) => {
              seen.rest = rest;
              seen.layouts = layouts;
              return {};
            },
          }),
        ),
      );
      expect(Object.keys(seen.layouts ?? {})).toEqual(["list", "detail", "wide"]);
      expect(seen.layouts?.wide?.get("card")).toEqual({ x: 200, y: 50, width: 200, height: 100 });
      expect(stage.layouts.wide?.card).toEqual({ x: 200, y: 50, width: 200, height: 100 });
    });

    it("measures a swapped stage without layouts under its one layout, main", () => {
      const seen: Laid = {};
      const { stage, root, frame, at } = layered(seen);
      at(200);
      root.find("card").fire("click", { target: root.find("card") });
      at(400);
      expect(frame.attributes.get("data-layout")).toBe("detail");
      stage.replace(
        staged(
          defineStage({
            beats: { all: [0, 1000] },
            cast: (m) => ({ card: m.box().watch(), dot: m.box() }),
            scene: ({ rest, layouts }) => {
              seen.rest = rest;
              seen.layouts = layouts;
              return {};
            },
          }),
        ),
      );
      expect(frame.attributes.get("data-layout")).toBe("main");
      expect(seen.rest?.get("card").x).toBe(200);
      expect(stage.rest.card?.x).toBe(200);
    });

    it("turns a member about its pivot, from where its box rests in each layout", () => {
      const seen: Laid = {};
      const { root } = layered(seen, { cardPivot: { x: 150, y: 60 } });
      const css = root.children[0]?.textContent ?? "";
      expect(css).toContain(
        ':where([data-layout="list"] [data-cast="card"]) { transform-origin: 50px 60px; }',
      );
      expect(css).toContain(
        ':where([data-layout="detail"] [data-cast="card"]) { transform-origin: -550px 60px; }',
      );
      expect(css).not.toContain('[data-cast="dot"]) { transform-origin');
    });

    it("mounts a skin's defs once inside the frame, where a fill's url reaches them", () => {
      const seen: Laid = {};
      const { frame } = layered(seen, { defs: '<radialGradient id="belly"></radialGradient>' });
      const defs = frame.children.filter((child) => child.innerHTML !== undefined);
      expect(defs).toHaveLength(1);
      expect(defs[0]?.innerHTML).toBe('<defs><radialGradient id="belly"></radialGradient></defs>');
      expect(defs[0]?.attributes.get("aria-hidden")).toBe("true");
    });

    it("labels a stage without layouts main, handing the scene that one layout", () => {
      let handed: Readonly<Record<string, RestReader>> | undefined;
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ dot: m.box() }),
        scene: ({ layouts }) => {
          handed = layouts;
          return {};
        },
      });
      const { root } = mounted({}, undefined, mustCompile(def));
      const frame = root.children.find((child) => child.tagName === "div");
      expect(frame?.attributes.get("data-layout")).toBe("main");
      expect(Object.keys(handed ?? {})).toEqual(["main"]);
    });
  });

  describe("a path member that morphs, is thin, or paints", () => {
    const level = (from: number, to: number, y: number, rise = 0) =>
      toCubics([
        { id: "a", x: from, y, inX: 0, inY: 0, outX: 10, outY: 0 },
        { id: "b", x: to, y: y + rise, inX: -10, inY: 0, outX: 0, outY: 0 },
      ]);

    it("writes the blended outline when its shape changes, and nothing when it does not", () => {
      const open = level(0, 100, 20);
      const wide = level(0, 100, 20, 30);
      const matched = matchOutlines([open, wide]);
      if ("reason" in matched) throw new Error(matched.reason);
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ mouth: m.morph(open, [wide]) }),
        scene: ({ time, beats: b }) => ({
          mouth: { shape: Math.min(1, b.all.of(time).progress * 2) },
        }),
      });
      const { root, at } = mounted({}, undefined, mustCompile(def));
      const path = root.find("mouth").children[0]?.children[0];
      if (path === undefined) throw new Error("No path.");
      const written: string[] = [];
      const set = path.setAttribute.bind(path);
      path.setAttribute = (name, value) => {
        if (name === "d") written.push(value);
        set(name, value);
      };
      at(250);
      expect(written).toEqual([pathData(blendShapes(matched.matched, 0.5))]);
      expect(path.attributes.get("d")).toBe(pathData(blendShapes(matched.matched, 0.5)));
      at(250);
      expect(written).toHaveLength(1);
      at(900);
      expect(written).toHaveLength(2);
      expect(path.attributes.get("d")).toBe(pathData(wide));
      expect(root.find("mouth").children[0]?.attributes.get("viewBox")).toBe("0 19.5 100 1");
    });

    it("views a horizontal line as a 1 px strip centred on it, and grows a thinner one to 1 px", () => {
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({
          flat: m.stroke(level(10, 110, 50)),
          faint: m.stroke(level(10, 110, 50, 0.2)),
        }),
        scene: () => ({}),
      });
      const { root } = mounted({}, undefined, mustCompile(def));
      expect(root.find("flat").children[0]?.attributes.get("viewBox")).toBe("10 49.5 100 1");
      const faint = (root.find("faint").children[0]?.attributes.get("viewBox") ?? "").split(" ");
      expect(Number(faint[1])).toBeCloseTo(49.6, 9);
      expect(Number(faint[3])).toBe(1);
    });

    it("gives each part its own copy of a shared paint, and its rules the copy's id", () => {
      const defs =
        '<linearGradient id="g" xlink:href="#h"></linearGradient><linearGradient id="h"><stop data-id="s" offset="0"></stop></linearGradient><radialGradient id="other"></radialGradient>';
      const css =
        '[data-path="a"] { fill: url(#g); } [data-cast=\'b\'] { fill: url(#g); } .both, [data-path="a"] { stroke: url(#other); } /* [data-path="a"] { fill: url(#h); } */';
      const def = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({
          a: m.stroke(level(0, 10, 0)),
          b: m.stroke(level(0, 10, 5)),
        }),
        skins: { dom: { css, defs } },
        scene: () => ({}),
      });
      const { root } = mounted({}, undefined, mustCompile(def));
      const style = root.children.find((child) => child.tagName === "style")?.textContent ?? "";
      expect(style).toContain('[data-path="a"] { fill: url(#g--a); }');
      expect(style).toContain("[data-cast='b'] { fill: url(#g--b); }");
      expect(style).toContain('.both, [data-path="a"] { stroke: url(#other); }');
      expect(style).toContain('/* [data-path="a"] { fill: url(#h); } */');
      const copy = (name: string) => root.find(name).children[0]?.innerHTML ?? "";
      expect(copy("a")).toBe(
        '<defs><linearGradient id="g--a" xlink:href="#h--a"></linearGradient><linearGradient id="h--a"><stop data-id="s" offset="0"></stop></linearGradient></defs>',
      );
      expect(copy("b")).toContain('id="g--b"');
      expect(copy("b")).toContain('href="#h--b"');
      const shared = root.all().filter((element) => element.innerHTML?.includes('id="other"'));
      expect(shared).toHaveLength(1);
    });

    it("re-resolves and repaints an edited stroke path when replace preserves cast structure", () => {
      const defA = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ line: m.stroke(level(0, 40, 20)) }),
        scene: () => ({}),
      });
      const defB = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ line: m.stroke(level(0, 120, 60)) }),
        scene: () => ({}),
      });
      const { root, stage, at } = mounted({}, undefined, mustCompile(defA));
      at(0);
      expect(root.find("line").children[0]?.attributes.get("viewBox")).toBe("0 19.5 40 1");
      stage.replace(mustCompile(defB));
      at(0);
      expect(root.find("line").children[0]?.attributes.get("viewBox")).toBe("0 59.5 120 1");
    });

    it("refuses replace when a member is reparented out of a group", () => {
      const nested = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ panel: m.group({ dot: m.box() }) }),
        scene: () => ({}),
      });
      const flat = defineStage({
        beats: { all: [0, 1000] },
        cast: (m) => ({ panel: m.group({}), dot: m.box() }),
        scene: () => ({}),
      });
      const { stage } = mounted({}, undefined, mustCompile(nested));
      expect(() => stage.replace(mustCompile(flat))).toThrow(/different cast/);
    });
  });

  it("removes everything it added when disposed", () => {
    const { container, root, stage } = mounted();
    stage.dispose();
    expect(container.children).toEqual([]);
    expect(root.find("card").listeners.get("pointerenter")?.size ?? 0).toBe(0);
  });
});
