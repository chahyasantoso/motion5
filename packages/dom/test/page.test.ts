import { INPUT_EVENTS, motion, pointer, scroll, type Pose2d } from "@gerak/core";
import {
  beat,
  bind,
  box,
  compileScene,
  el,
  many,
  sceneBuilder,
  scrollPoint,
  section,
  text,
} from "@gerak/stage";
import { describe, expect, it } from "vitest";
import {
  mountPage,
  type FrameSource,
  type PageElement,
  type PageRoot,
  type PageStyle,
} from "../src";

class FakeStyle implements PageStyle {
  transform = "";
  opacity = "";
  zIndex = "";
  transformOrigin = "";
  transformBox = "";
  filter = "";
  clipPath = "";
  strokeDasharray = "";
  strokeDashoffset = "";
  visibility = "";
  display = "";
  whiteSpace = "";
  position = "";
  readonly custom = new Map<string, string>();
  setProperty(name: string, value: string): void {
    this.custom.set(name, value);
  }
  removeProperty(name: string): void {
    this.custom.delete(name);
  }
}

class FakeNode implements PageElement {
  readonly style = new FakeStyle();
  readonly attributes = new Map<string, string>();
  readonly listeners = new Map<string, Set<(event: never) => void>>();
  readonly children: FakeNode[] = [];
  textContent: string | null = "";
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 100;
  offsetHeight = 40;

  constructor(
    readonly id: string,
    readonly classes: readonly string[] = [],
  ) {}

  matches(selector: string): boolean {
    if (selector.startsWith("#")) return this.id === selector.slice(1);
    if (selector.startsWith(".")) return this.classes.includes(selector.slice(1));
    return false;
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  append(...nodes: unknown[]): void {
    for (const node of nodes) if (node instanceof FakeNode) this.children.push(node);
  }

  addEventListener(type: string, listener: (event: never) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: never) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string, payload: Record<string, unknown> = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) {
      Reflect.apply(listener, undefined, [payload]);
    }
  }
}

class FakeRoot implements PageRoot {
  readonly listeners = new Map<string, Set<(event: never) => void>>();
  createdCount = 0;
  readonly ownerDocument = {
    createElement: (tag: string): PageElement => {
      this.createdCount += 1;
      return new FakeNode(`created-${tag}-${this.createdCount}`);
    },
  };

  constructor(readonly nodes: readonly FakeNode[]) {}

  querySelector(selector: string): PageElement | null {
    return this.nodes.find((node) => node.matches(selector)) ?? null;
  }

  querySelectorAll(selector: string): readonly PageElement[] {
    return this.nodes.filter((node) => node.matches(selector));
  }

  addEventListener(type: string, listener: (event: never) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: never) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string, payload: Record<string, unknown> = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) {
      Reflect.apply(listener, undefined, [payload]);
    }
  }
}

function fakeFrames(): FrameSource & { readonly queued: number; tick(ms: number): void } {
  let next = 1;
  const callbacks = new Map<number, (time: number) => void>();
  return {
    get queued() {
      return callbacks.size;
    },
    requestFrame(listener) {
      const id = next;
      next += 1;
      callbacks.set(id, listener);
      return id;
    },
    cancelFrame(handle) {
      callbacks.delete(handle);
    },
    tick(ms) {
      const batch = [...callbacks.entries()];
      callbacks.clear();
      for (const [, listener] of batch) listener(ms);
    },
  };
}

describe("mountPage", () => {
  it("writes poses onto existing nodes via applyValue and creates no frames or elements", () => {
    const card = new FakeNode("card");
    card.offsetLeft = 20;
    card.offsetTop = 50;
    card.offsetWidth = 120;
    card.offsetHeight = 60;
    const title = new FakeNode("title");
    title.textContent = "Existing Site Title";
    const items = [new FakeNode("i1", ["item"]), new FakeNode("i2", ["item"])];
    const root = new FakeRoot([card, title, ...items]);

    let ms = 0;
    const frames = fakeFrames();
    let scrollY = 0;
    const scrollTarget = {
      listeners: new Set<() => void>(),
      get scrollY() {
        return scrollY;
      },
      addEventListener(_type: string, listener: () => void) {
        this.listeners.add(listener);
      },
      removeEventListener(_type: string, listener: () => void) {
        this.listeners.delete(listener);
      },
      fire() {
        for (const listener of [...this.listeners]) listener();
      },
    };

    const sb = beat("go", { scroll: [scrollPoint(0), scrollPoint(400)] });
    const scene = sceneBuilder()
      .element(box("card", { node: el("#card"), watch: true }))
      .motion(motion((t): Pose2d => ({ x: 80 * t.progress })).in(sb))
      .element(text("title", "", { node: el("#title") }))
      .motion(bind({ y: (t, e) => pointer.y(t, e) * 10 }))
      .element(many("items", 2, { node: el(".item") }))
      .motion((_t, ctx) => ({ x: (ctx.index ?? 0) * 15 }));

    const mounted = mountPage(scene, {
      root,
      scrollTarget,
      frames,
      clock: () => ms,
      viewport: () => ({ width: 1000, height: 500 }),
    });

    expect(root.createdCount).toBe(0);
    expect(title.textContent).toBe("Existing Site Title");
    expect(mounted.rest["card"]).toEqual({ x: 80, y: 80, width: 120, height: 60 });
    expect(items[0]?.style.transform).toBe("");
    expect(items[1]?.style.transform).toBe("translate3d(15px, 0px, 0px)");

    ms = 100;
    scrollY = 200;
    scrollTarget.fire();
    expect(card.style.transform).toBe("translate3d(40px, 0px, 0px)");

    ms = 150;
    root.fire("pointermove", { clientX: 250, clientY: 250 });
    ms = 200;
    card.fire("pointerenter", { clientX: 40, clientY: 60 });

    const eventNames = mounted.events().map((event) => event.name);
    expect(eventNames).toContain(INPUT_EVENTS.scroll);
    expect(eventNames).toContain(INPUT_EVENTS.pointerX);
    expect(eventNames).toContain(INPUT_EVENTS.pointerY);
    expect(eventNames).toContain("enter");

    mounted.dispose();
    expect(card.style.transform).toBe("");
    expect(items[1]?.style.transform).toBe("");
    expect(frames.queued).toBe(0);
  });

  it("refuses a scene missing nodes, a compiled skin, or a missing selector", () => {
    const root = new FakeRoot([new FakeNode("card")]);
    expect(() => mountPage(sceneBuilder({ length: 500 }).element(box("plain")), { root })).toThrow(
      /"plain"/,
    );
    const skinned = compileScene(sceneBuilder({ length: 500 }).element(box("card")), {
      skin: { css: "#card { width: 10px; }" },
    });
    if (!skinned.ok) throw new Error("expected skinned stage to compile");
    expect(() => mountPage(skinned.stage, { root })).toThrow(/skin/i);
    expect(() =>
      mountPage(sceneBuilder().element(box("missing", { node: el("#missing") })), { root }),
    ).toThrow(/"missing".*#missing/);
  });

  it("supports send on the shared live clock and respects readouts without clobbering plain text", () => {
    const meter = new FakeNode("meter");
    const clockOut = new FakeNode("clock");
    const root = new FakeRoot([meter, clockOut]);
    let ms = 0;
    const mounted = mountPage(
      sceneBuilder()
        .element(box("meter", { node: el("#meter") }))
        .motion(bind({ x: (t, e) => scroll.y(t, e) }))
        .element(
          text("clock", (t) => `${Math.round(t.clock.kind === "live" ? t.clock.elapsed : 0)}ms`, {
            node: el("#clock"),
          }),
        ),
      { root, frames: fakeFrames(), clock: () => ms },
    );
    ms = 250;
    mounted.send(INPUT_EVENTS.scroll, 75);
    expect(meter.style.transform).toBe("translate3d(75px, 0px, 0px)");
    expect(clockOut.textContent).toBe("250ms");
    mounted.dispose();
  });

  it("wraps split text into word spans for line measurement and restores original text on dispose", () => {
    const headline = new FakeNode("headline");
    headline.textContent = "One two";
    const root = new FakeRoot([headline]);
    const mounted = mountPage(
      sceneBuilder({ length: 1000 })
        .element(text("headline", "One two", { split: "words", node: el("#headline") }))
        .motion((_t, ctx) => ({ x: (ctx.index ?? 0) * 10 })),
      { root, frames: fakeFrames(), clock: () => 0 },
    );
    expect(root.createdCount).toBe(2);
    expect(headline.children).toHaveLength(2);
    expect(mounted.lines["headline"]).toEqual([0, 0]);
    expect(headline.children[1]?.style.transform).toBe("translate3d(10px, 0px, 0px)");
    mounted.dispose();
    expect(headline.textContent).toBe("One two");
  });

  it("wraps a single-word split text into one span and restores prior split DOM on failed mount", () => {
    const solo = new FakeNode("solo");
    solo.textContent = "HELLO";
    const root = new FakeRoot([solo]);
    const mounted = mountPage(
      sceneBuilder({ length: 500 })
        .element(text("solo", "HELLO", { split: "words", node: el("#solo") }))
        .motion(() => ({ x: 5 })),
      { root, frames: fakeFrames(), clock: () => 0 },
    );
    expect(root.createdCount).toBe(1);
    expect(solo.children).toHaveLength(1);
    expect(solo.children[0]?.style.transform).toBe("translate3d(5px, 0px, 0px)");
    expect(solo.style.transform).toBe("");
    mounted.dispose();
    expect(solo.textContent).toBe("HELLO");

    const rollbackRoot = new FakeRoot([new FakeNode("solo")]);
    expect(() =>
      mountPage(
        sceneBuilder({ length: 500 })
          .element(text("solo", "HELLO", { split: "words", node: el("#solo") }))
          .element(box("missing", { node: el("#missing") })),
        { root: rollbackRoot, frames: fakeFrames(), clock: () => 0 },
      ),
    ).toThrow(/"missing"/);
    expect(rollbackRoot.nodes[0]?.textContent).toBe("");
  });

  it("measures stage sections into rest, updates on remeasure, and refuses missing section nodes", () => {
    const heroNode = new FakeNode("hero");
    heroNode.offsetLeft = 0;
    heroNode.offsetTop = 0;
    heroNode.offsetWidth = 1000;
    heroNode.offsetHeight = 600;
    const storyNode = new FakeNode("story");
    storyNode.offsetLeft = 0;
    storyNode.offsetTop = 600;
    storyNode.offsetWidth = 1000;
    storyNode.offsetHeight = 1400;
    const cardNode = new FakeNode("card");
    const root = new FakeRoot([heroNode, storyNode, cardNode]);

    const hero = section("hero", el("#hero"));
    const story = section("story", el("#story"));
    const sb = beat("go", { scroll: [hero.top, story.top] });

    const mounted = mountPage(
      sceneBuilder()
        .element(box("card", { node: el("#card") }))
        .motion(motion((t) => ({ x: 100 * t.progress })).in(sb)),
      { root, frames: fakeFrames(), clock: () => 0 },
    );

    expect(mounted.rest["hero"]).toEqual({ x: 500, y: 300, width: 1000, height: 600 });
    expect(mounted.rest["story"]).toEqual({ x: 500, y: 1300, width: 1000, height: 1400 });

    heroNode.offsetHeight = 800;
    storyNode.offsetTop = 800;
    mounted.remeasure();
    expect(mounted.rest["hero"]).toEqual({ x: 500, y: 400, width: 1000, height: 800 });
    expect(mounted.rest["story"]).toEqual({ x: 500, y: 1500, width: 1000, height: 1400 });

    mounted.dispose();
    expect(heroNode.style.transform).toBe("");

    const failSolo = new FakeNode("solo");
    const missingSec = section("absent", el("#absent"));
    const missingBeat = beat("miss", { scroll: [missingSec.top, missingSec.end] });
    expect(() =>
      mountPage(
        sceneBuilder()
          .element(text("solo", "HELLO", { split: "words", node: el("#solo") }))
          .motion(motion((t) => ({ x: 10 * t.progress })).in(missingBeat)),
        { root: new FakeRoot([failSolo]), frames: fakeFrames(), clock: () => 0 },
      ),
    ).toThrow(/"absent".*#absent/);
    expect(failSolo.textContent).toBe("");
  });

  it("syncs changed scrollY inside remeasure without duplicating updates", () => {
    const cardNode = new FakeNode("card");
    const root = new FakeRoot([cardNode]);
    let scrollY = 0;
    const listeners = new Set<() => void>();
    const scrollTarget = {
      get scrollY() {
        return scrollY;
      },
      addEventListener(_type: string, listener: () => void) {
        listeners.add(listener);
      },
      removeEventListener(_type: string, listener: () => void) {
        listeners.delete(listener);
      },
    };
    const sb = beat("go", { scroll: [scrollPoint(0), scrollPoint(200)] });
    let sceneCalls = 0;
    const mounted = mountPage(
      sceneBuilder()
        .element(box("card", { node: el("#card") }))
        .motion(
          motion((t) => {
            sceneCalls += 1;
            return { x: 100 * t.progress };
          }).in(sb),
        ),
      { root, scrollTarget, frames: fakeFrames(), clock: () => 0 },
    );

    expect(cardNode.style.transform).toBe("");
    const callsBefore = sceneCalls;
    scrollY = 100;
    mounted.remeasure();
    expect(sceneCalls).toBe(callsBefore + 1);
    expect(cardNode.style.transform).toBe("translate3d(50px, 0px, 0px)");
    expect(mounted.events().some((e) => e.name === "scroll" && e.value === 100)).toBe(true);
    mounted.dispose();
  });
});
