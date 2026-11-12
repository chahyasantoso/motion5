import { afterEach, describe, expect, it, vi } from "vitest";
import type { Events, Pose2d, Time } from "@gerak/moves";
import { actor, group, letters, story, type Rest, type StageModule } from "@gerak/stage";
import {
  mountStage,
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
  fonts?: StageFonts;
}

class FakeElement implements StageElement<FakeElement> {
  readonly style: FakeStyle & StageStyle = new FakeStyle();
  readonly attributes = new Map<string, string>();
  readonly children: FakeElement[] = [];
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  parent: FakeElement | undefined;
  shadowRoot: FakeElement | undefined;
  textContent: string | null = null;
  tabIndex = -1;
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 0;
  offsetHeight = 0;
  clientWidth = 0;
  clientHeight = 0;
  readonly ownerDocument: FakeDocument;

  constructor(
    readonly tagName: string,
    document?: FakeDocument,
  ) {
    this.ownerDocument = document ?? {
      createElement: (tag) => new FakeElement(tag, this.ownerDocument),
    };
  }
  attachShadow(): FakeElement {
    const root = new FakeElement("#shadow", this.ownerDocument);
    this.shadowRoot = root;
    return root;
  }
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
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
export function acceptsPageElements(element: HTMLElement): StageElement<HTMLElement> {
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

function mounted(seen: Seen = {}, fonts?: StageFonts) {
  let ms = 0;
  const container = new FakeElement("div");
  if (fonts !== undefined) container.ownerDocument.fonts = fonts;
  const stage = mountStage(container, stageModule(seen), { frames: frames(), clock: () => ms });
  const root = container.children[0]?.shadowRoot;
  if (root === undefined) throw new Error("No shadow root.");
  return {
    container,
    root,
    stage,
    at(next: number) {
      ms = next;
      stage.player.refresh();
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
    container.append(host);
    mountStage(host, stageModule(seen), { frames: frames(), clock: () => 0 });
    expect(seen.rest?.camera).toEqual({ x: 200, y: 100, width: 200, height: 100 });
    expect(seen.rest?.dot).toEqual({ x: 130, y: 85, width: 40, height: 30 });
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
      clock: () => 0,
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

  it("removes everything it added when disposed", () => {
    const { container, root, stage } = mounted();
    stage.dispose();
    expect(container.children).toEqual([]);
    expect(root.find("card").listeners.get("pointerenter")?.size ?? 0).toBe(0);
  });
});
