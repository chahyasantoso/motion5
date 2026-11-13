import { afterEach, describe, expect, it, vi } from "vitest";
import { follow, toCubics, trace, type Events, type Pose2d, type Time } from "@gerak/moves";
import {
  actor,
  group,
  letters,
  many,
  NO_LAYOUTS,
  restOf,
  story,
  type Layouts,
  type Rest,
  type StageModule,
} from "@gerak/stage";
import {
  mountStage,
  pathData,
  type FrameSource,
  type StageElement,
  type StageEvent,
  type StageFonts,
  type StageStyle,
  type StageValues,
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
  createElement(tag: "div" | "style"): FakeElement;
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
    if (siblings !== undefined) siblings.splice(siblings.indexOf(this), 1);
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

const beats = story(1000, { intro: [0, 200], word: [300, 600], late: [800, 1000] });

interface Seen {
  time?: Time;
  events?: Events;
  rest?: Rest;
}

function stageModule(seen: Seen): StageModule<"intro" | "word" | "late", StageValues> {
  return {
    beats,
    cast: {
      camera: group({ dot: actor(), word: letters("HI", { on: ["word", "late"] }) }),
      card: actor({ watch: true }),
    },
    skins: { dom: { css: `[data-cast="dot"] { width: 10px }` } },
    scene: (time, events, rest) => {
      seen.time = time;
      seen.events = events;
      seen.rest = rest;
      const camera: Pose2d = { y: 40 };
      return { camera, word: [{ x: 1 }, { x: 2 }] };
    },
  };
}

function mounted(seen: Seen = {}, fonts?: StageFonts, module?: StageModule<"all", StageValues>) {
  const container = new FakeElement("div");
  if (fonts !== undefined) container.ownerDocument.fonts = fonts;
  const options = { frames: frames() };
  const stage =
    module === undefined
      ? mountStage(container, stageModule(seen), options)
      : mountStage(container, module, options);
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

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("mountStage", () => {
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

  it("shows a member on two beats, hides it in the gap, and holds a stretch ending the story", () => {
    const { root, at } = mounted();
    expect(root.find("word").style.visibility).toBe("hidden");
    at(400);
    expect(root.find("word").style.visibility).toBe("");
    expect(root.find("word.0").style.visibility).toBe("");
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
    const whole = story(1000, { all: [0, 1000] });
    const module: StageModule<"all", StageValues> = {
      beats: whole,
      cast: {
        trail: actor({ path: line }),
        marks: many([line, line], (each) => actor({ path: each })),
        card: actor({ watch: true }),
      },
      skins: { dom: { css: `[data-path="trail"] { stroke: red }` } },
      scene: (time) => ({
        trail: { x: 5, opacity: 0.5, ...trace({}, whole.all.of(time)) },
        marks: [{ drawn: 0.25 }, { y: 3 }],
      }),
    };
    const { root, at } = mounted({}, undefined, module);
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
      `:where([data-cast="trail"]) { position: absolute; left: 10px; top: 20px; width: 100px; height: 40px; }`,
    );
    expect(style).toContain(`:where([data-cast="marks.1"]) { position: absolute; left: 10px;`);
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
    const module: StageModule<"all", StageValues> = {
      beats: story(3000, { all: [0, 3000] }),
      cast: { timecode: actor({ text: seconds }), dot: actor() },
      skins: {},
      scene: (time) => ({ dot: { x: time.progress } }),
    };
    const container = new FakeElement("div");
    const stage = mountStage(container, module, { frames: frames() });
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

  it("hands the scene a rest box for every name the cast makes", () => {
    const seen: Seen = {};
    mounted(seen);
    expect(Object.keys(seen.rest ?? {}).sort()).toEqual(
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
    mountStage(host, stageModule(seen), { frames: frames() });
    expect(seen.rest?.camera).toEqual({ x: 200, y: 100, width: 200, height: 100 });
    // The camera's 3 by 2 px border sits between its box and the dot's offsets.
    expect(seen.rest?.dot).toEqual({ x: 133, y: 87, width: 40, height: 30 });
  });

  it("writes a group's value on the group's element and a list item by item", () => {
    const { root } = mounted();
    expect(root.find("camera").style.transform).toBe("translate3d(0px, 40px, 0px)");
    expect(root.find("dot").style.transform).toBeUndefined();
    expect(root.find("word.1").style.transform).toBe("translate3d(2px, 0px, 0px)");
  });

  it("swaps in a new scene on the same elements, and tells of each run's driver", () => {
    const drivers: unknown[] = [];
    const container = new FakeElement("div");
    const stage = mountStage(container, stageModule({}), {
      frames: frames(),
      onDriver: (driver) => drivers.push(driver),
    });
    const root = container.children[0]?.shadowRoot;
    const element = root?.find("camera");
    stage.replace({ ...stageModule({}), scene: () => ({ camera: { y: 99 } }) });
    expect(root?.find("camera")).toBe(element);
    expect(element?.style.transform).toBe("translate3d(0px, 99px, 0px)");
    stage.replay();
    expect(drivers).toEqual([drivers[0], stage.driver]);
    expect(drivers).toHaveLength(2);
  });

  it("brings a hover on a watched member to the scene under its name", () => {
    const seen: Seen = {};
    const { root, at } = mounted(seen);
    root.find("card").fire("pointerenter");
    at(10);
    expect(seen.events?.map((event) => [event.name, event.target])).toEqual([["enter", "card"]]);
  });

  it("takes a sample past the story's end into the scene's next frame, and hands back its log", () => {
    const module: StageModule<"all", StageValues> = {
      beats: story(1000, { all: [0, 1000] }),
      cast: { beak: actor() },
      skins: {},
      scene: (time, events) => ({
        beak: { scaleY: follow({ start: 0, on: { mouthOpen: "value" } })(time, events) },
      }),
    };
    let queued: ((at: number) => void)[] = [];
    const run = (ms: number) => {
      const due = queued;
      queued = [];
      for (const frame of due) frame(ms);
    };
    const container = new FakeElement("div");
    const stage = mountStage(container, module, {
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
    const { root } = mounted(seen);
    const before = seen.rest;
    root.find("dot").offsetWidth = 64;
    resized?.();
    expect(seen.rest).not.toBe(before);
    expect(seen.rest?.dot?.width).toBe(64);
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
    expect(seen.rest?.dot?.width).toBe(80);
    stage.dispose();
    expect(listeners.size).toBe(0);
  });

  describe("a path drawn from where things rest", () => {
    type Size = [number, number, number, number];
    const level = (from: number, to: number, y: number) =>
      toCubics([
        { id: "a", x: from, y, inX: 0, inY: 0, outX: 0, outY: 0 },
        { id: "b", x: to, y, inX: 0, inY: 0, outX: 0, outY: 0 },
      ]);

    /** A stage whose members take the offsets and sizes in `sizes` by name, with a resize to call. */
    function laidOut(module: StageModule<"all", StageValues>, sizes: Record<string, Size>) {
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
      mountStage(host, module, { frames: frames() });
      const root = host.children[0]?.shadowRoot;
      if (root === undefined) throw new Error("No shadow root.");
      const style = () => root.children.find((child) => child.tagName === "style")?.textContent;
      return { root, style, resize: () => resized?.() };
    }

    function underlined(seen: Seen, path: (rest: Rest) => ReturnType<typeof level>) {
      const module: StageModule<"all", StageValues> = {
        beats: story(1000, { all: [0, 1000] }),
        cast: { line: group({ word: actor({ text: "HI" }), under: actor({ path }) }) },
        skins: {},
        scene: (_time, _events, rest) => {
          seen.rest = rest;
          return {};
        },
      };
      return laidOut(module, { line: [100, 200, 600, 100], word: [50, 10, 200, 80] });
    }

    it("sits under a measured word, in the word's group, after layout and after a resize", () => {
      const seen: Seen = {};
      const handed: Rest[] = [];
      const { root, style, resize } = underlined(seen, (rest) => {
        handed.push(rest);
        const word = restOf(rest, "word");
        return level(
          word.x - word.width / 2,
          word.x + word.width / 2,
          word.y + word.height / 2 + 4,
        );
      });
      expect(seen.rest?.word).toEqual({ x: 250, y: 250, width: 200, height: 80 });
      expect(seen.rest?.under).toEqual({ x: 250, y: 294, width: 200, height: 1 });
      expect(style()).toContain(
        `:where([data-cast="under"]) { position: absolute; left: 50px; top: 93.5px; width: 200px; height: 1px; }`,
      );
      const svg = root.find("under").children[0];
      expect(svg?.attributes.get("viewBox")).toBe("150 293.5 200 1");
      expect(svg?.children[0]?.attributes.get("d")).toBe(pathData(level(150, 350, 294)));
      expect(handed.every((rest) => !Object.hasOwn(rest, "under"))).toBe(true);
      root.find("word").offsetWidth = 300;
      resize();
      expect(seen.rest?.under).toEqual({ x: 300, y: 294, width: 300, height: 1 });
      expect(style()).toContain(`left: 50px; top: 93.5px; width: 300px; height: 1px; }`);
      expect(svg?.children[0]?.attributes.get("d")).toBe(pathData(level(150, 450, 294)));
    });

    it("draws a path reading another stroke after that stroke, from its end", () => {
      const module: StageModule<"all", StageValues> = {
        beats: story(1000, { all: [0, 1000] }),
        cast: {
          line: group({
            link: actor({
              path: (rest) => {
                const under = restOf(rest, "under");
                const word = restOf(rest, "word");
                return level(under.x + under.width / 2, word.x, word.y);
              },
            }),
            word: actor({ text: "HI" }),
            under: actor({
              path: (rest) => {
                const word = restOf(rest, "word");
                return level(word.x - word.width / 2, word.x + word.width / 2, word.y + 44);
              },
            }),
          }),
        },
        skins: {},
        scene: () => ({}),
      };
      const { root } = laidOut(module, { line: [100, 200, 600, 100], word: [50, 10, 200, 80] });
      const d = root.find("link").children[0]?.children[0]?.attributes.get("d");
      expect(d).toBe(pathData(level(350, 250, 250)));
    });

    it("reports two paths that read each other, naming both, and draws neither", () => {
      const reported: unknown[] = [];
      vi.stubGlobal("reportError", (error: unknown) => reported.push(error));
      const module: StageModule<"all", StageValues> = {
        beats: story(1000, { all: [0, 1000] }),
        cast: {
          a: actor({ path: (rest) => level(0, restOf(rest, "b").width + 1, 0) }),
          b: actor({ path: (rest) => level(0, restOf(rest, "a").width + 1, 0) }),
        },
        skins: {},
        scene: () => ({}),
      };
      const { root, style } = laidOut(module, {});
      expect(reported.map(String)).toEqual([
        'Error: mountStage: paths "a" and "b" read each other.',
      ]);
      expect(root.find("a").children[0]?.children[0]?.attributes.has("d")).toBe(false);
      expect(style()).toContain(`:where([data-cast="b"]) { position: absolute; }`);
    });

    it("reports a path function that throws and keeps its last good path", () => {
      const reported: unknown[] = [];
      vi.stubGlobal("reportError", (error: unknown) => reported.push(error));
      let broken = false;
      const seen: Seen = {};
      const { root, resize } = underlined(seen, (rest) => {
        if (broken) throw new Error("no word");
        const word = restOf(rest, "word");
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
      expect(seen.rest?.under?.width).toBe(200);
    });
  });

  describe("named layouts", () => {
    interface Laid {
      rest?: Rest;
      layouts?: Layouts;
      layoutAtWrite?: string | undefined;
    }

    /** A stage whose `card` rests at 100 px under `list` and 700 px under `detail`; the fake does no
     * layout, so `card` reads its offset from the frame's `data-layout`. */
    function layered(seen: Laid, extra: Partial<StageModule<"all", StageValues>> = {}) {
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
      const module: StageModule<"all", StageValues> = {
        beats: story(1000, { all: [0, 1000] }),
        cast: { card: actor({ watch: true }), dot: actor() },
        skins: {
          dom: {
            css: `[data-layout="list"] [data-cast="card"] { left: 0 } [data-layout="detail"] [data-cast="card"] { left: 600px }`,
          },
        },
        layouts: ["list", "detail"],
        layout: (events) => (events.some((event) => event.name === "click") ? "detail" : "list"),
        scene: (_time, _events, rest, layouts) => {
          seen.rest = rest;
          seen.layouts = layouts;
          return { card: { x: 1 } };
        },
        ...extra,
      };
      const stage = mountStage(host, module, { frames: frames() });
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
      const { frame } = layered(seen);
      expect(seen.layouts?.list?.card).toEqual({ x: 200, y: 50, width: 200, height: 100 });
      expect(seen.layouts?.detail?.card).toEqual({ x: 800, y: 50, width: 200, height: 100 });
      expect(seen.rest).toBe(seen.layouts?.list);
      expect(frame.attributes.get("data-layout")).toBe("list");
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

    it("plays the module's own cues, so a scripted click changes the layout at its time", () => {
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
      const under = (rest: Rest) => {
        const card = restOf(rest, "card");
        return toCubics([
          { id: "a", x: card.x - 50, y: 120, inX: 0, inY: 0, outX: 0, outY: 0 },
          { id: "b", x: card.x + 50, y: 120, inX: 0, inY: 0, outX: 0, outY: 0 },
        ]);
      };
      const { root, at } = layered(seen, {
        cast: { card: actor({ watch: true }), line: actor({ path: under }) },
      });
      const style = root.children.find((child) => child.tagName === "style")?.textContent ?? "";
      expect(style).toContain(
        `:where([data-layout="list"] [data-cast="line"]) { position: absolute; left: 150px;`,
      );
      expect(style).toContain(
        `:where([data-layout="detail"] [data-cast="line"]) { position: absolute; left: 750px;`,
      );
      const path = root.find("line").children[0]?.children[0];
      expect(path?.attributes.get("d")).toBe(pathData(under(seen.layouts?.list ?? {})));
      at(200);
      root.find("card").fire("click", { target: root.find("card") });
      at(400);
      expect(path?.attributes.get("d")).toBe(pathData(under(seen.layouts?.detail ?? {})));
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

    it("measures again when a swapped module changes its layouts", () => {
      const seen: Laid = {};
      const { stage } = layered(seen);
      stage.replace({
        beats: story(1000, { all: [0, 1000] }),
        cast: { card: actor({ watch: true }), dot: actor() },
        skins: {},
        layouts: ["list", "detail", "wide"],
        scene: (_time, _events, rest, layouts) => {
          seen.rest = rest;
          seen.layouts = layouts;
          return {};
        },
      });
      expect(Object.keys(seen.layouts ?? {})).toEqual(["list", "detail", "wide"]);
      expect(seen.layouts?.wide?.card).toEqual({ x: 200, y: 50, width: 200, height: 100 });
    });

    it("measures a swapped module without layouts with no layout left on the frame", () => {
      const seen: Laid = {};
      const { stage, root, frame, at } = layered(seen);
      at(200);
      root.find("card").fire("click", { target: root.find("card") });
      at(400);
      expect(frame.attributes.get("data-layout")).toBe("detail");
      stage.replace({
        beats: story(1000, { all: [0, 1000] }),
        cast: { card: actor({ watch: true }), dot: actor() },
        skins: {},
        scene: (_time, _events, rest, layouts) => {
          seen.rest = rest;
          seen.layouts = layouts;
          return {};
        },
      });
      expect(frame.attributes.has("data-layout")).toBe(false);
      expect(seen.rest?.card?.x).toBe(200);
    });

    it("turns a member about its pivot, from where its box rests in each layout", () => {
      const seen: Laid = {};
      const { root } = layered(seen, {
        cast: { card: actor({ watch: true, pivot: { x: 150, y: 60 } }), dot: actor() },
      });
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
      const { frame } = layered(seen, {
        skins: { dom: { css: "", defs: '<radialGradient id="belly"></radialGradient>' } },
      });
      const defs = frame.children.filter((child) => child.innerHTML !== undefined);
      expect(defs).toHaveLength(1);
      expect(defs[0]?.innerHTML).toBe('<defs><radialGradient id="belly"></radialGradient></defs>');
      expect(defs[0]?.attributes.get("aria-hidden")).toBe("true");
    });

    it("leaves a module without layouts unlabelled, handing the scene no layouts", () => {
      let handed: Layouts | undefined;
      const module: StageModule<"all", StageValues> = {
        beats: story(1000, { all: [0, 1000] }),
        cast: { dot: actor() },
        skins: {},
        scene: (_time, _events, _rest, layouts) => {
          handed = layouts;
          return {};
        },
      };
      const { root } = mounted({}, undefined, module);
      const frame = root.children.find((child) => child.tagName === "div");
      expect(frame?.attributes.has("data-layout")).toBe(false);
      expect(handed).toBe(NO_LAYOUTS);
    });
  });

  it("removes everything it added when disposed", () => {
    const { container, root, stage } = mounted();
    stage.dispose();
    expect(container.children).toEqual([]);
    expect(root.find("card").listeners.get("pointerenter")?.size ?? 0).toBe(0);
  });
});
