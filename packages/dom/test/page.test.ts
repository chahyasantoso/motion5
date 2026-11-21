import {
  INPUT_EVENTS,
  motion,
  pointer,
  scroll,
  springTo,
  type Pose2d,
  type Pose3d,
} from "@gerak/core";
import {
  beat,
  bind,
  box,
  compileScene,
  el,
  many,
  object,
  sceneBuilder,
  scrollPoint,
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
    expect(card.style.transform).toBe("");
    frames.tick(100);
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

  it("mounts a page scene with an object, binds no node for it, and plays its 3D pose", () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    let ms = 0;
    const frames = fakeFrames();
    const spin = beat("spin", 1000);
    const scene = sceneBuilder()
      .element(object("drink"))
      .motion(motion((t): Pose3d => ({ rotationY: 90 * t.progress })).in(spin))
      .element(box("card", { node: el("#card") }))
      .motion(motion((t): Pose2d => ({ x: 80 * t.progress })).in(spin));
    const seen: unknown[] = [];
    const mounted = mountPage(scene, { root, frames, clock: () => ms });
    mounted.player.subscribe("drink", (value) => seen.push(value));
    ms = 500;
    frames.tick(500);
    expect(root.createdCount).toBe(0);
    expect(card.style.transform).toBe("translate3d(40px, 0px, 0px)");
    expect(seen.at(-1)).toEqual({ rotationY: 45 });
    expect(Object.keys(mounted.rest)).toEqual(["card"]);
    mounted.dispose();
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
    const frames = fakeFrames();
    const mounted = mountPage(
      sceneBuilder()
        .element(box("meter", { node: el("#meter") }))
        .motion(bind({ x: (t, e) => scroll.y(t, e) }))
        .element(
          text("clock", (t) => `${Math.round(t.clock.kind === "live" ? t.clock.elapsed : 0)}ms`, {
            node: el("#clock"),
          }),
        ),
      { root, frames, clock: () => ms },
    );
    ms = 250;
    mounted.send(INPUT_EVENTS.scroll, 75);
    frames.tick(250);
    expect(meter.style.transform).toBe("translate3d(75px, 0px, 0px)");
    expect(clockOut.textContent).toBe("250ms");
    mounted.dispose();
  });

  it("renders once per frame however many inputs arrive in it", () => {
    const meter = new FakeNode("meter");
    const root = new FakeRoot([meter]);
    const frames = fakeFrames();
    let runs = 0;
    let ms = 0;
    const mounted = mountPage(
      sceneBuilder()
        .element(box("meter", { node: el("#meter") }))
        .motion(
          bind({
            x: (t, e) => {
              runs += 1;
              return scroll.y(t, e) + pointer.x(t, e);
            },
          }),
        ),
      { root, frames, clock: () => ms, viewport: () => ({ width: 100, height: 100 }) },
    );
    const before = runs;
    ms = 16;
    mounted.send(INPUT_EVENTS.scroll, 10);
    mounted.send(INPUT_EVENTS.scroll, 20);
    root.fire("pointermove", { clientX: 50, clientY: 50 });
    expect(runs).toBe(before);
    frames.tick(16);
    expect(runs).toBe(before + 1);
    expect(meter.style.transform).toBe("translate3d(20.5px, 0px, 0px)");
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

  it("measures elements read for their edges into rest, updates on remeasure, and refuses missing nodes", () => {
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

    const hero = box("hero", { node: el("#hero") });
    const story = box("story", { node: el("#story") });
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
    const missingSec = box("absent", { node: el("#absent") });
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

describe("mountPage frames for a cause", () => {
  const OFF = Symbol.for("@gerak/dom/clock-frames-off");

  type Run = {
    readonly styles: string[];
    readonly stillRuns: number;
    readonly queuedAtEnd: number;
  };

  function play(off: boolean): Run {
    Reflect.set(globalThis, OFF, off);
    try {
      const names = [
        "intro",
        "scrolled",
        "smoothed",
        "revealed",
        "stayed",
        "replayed",
        "clocked",
        "pointed",
        "sprung",
        "still",
      ];
      const nodes = names.map((name) => new FakeNode(name));
      const parts = [0, 1, 2].map((index) => new FakeNode(`part${index}`, ["part"]));
      nodes.forEach((node, index) => {
        node.offsetTop = index * 300;
      });
      const root = new FakeRoot([...nodes, ...parts]);
      const frames = fakeFrames();
      let ms = 0;
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
      };
      let stillRuns = 0;
      const sprung = springTo(pointer.x, (x) => x, { stiffness: 60, damping: 10 });
      const slide = motion((t): Pose2d => ({ x: 100 * t.progress }));
      const counted = motion((t): Pose2d => {
        stillRuns += 1;
        return { y: 50 * t.progress };
      });
      const range = beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] });
      const smooth = beat("smooth", { scroll: [scrollPoint(0), scrollPoint(400)], smooth: true });
      const scene = sceneBuilder()
        .element(box("intro", { node: el("#intro") }))
        .motion(slide.in(beat("introBeat", 300)))
        .element(box("scrolled", { node: el("#scrolled") }))
        .motion(slide.in(range))
        .element(box("smoothed", { node: el("#smoothed") }))
        .motion(slide.in(smooth))
        .element(box("revealed", { node: el("#revealed") }))
        .motion(slide.in(beat("rev", 500, { when: scrollPoint(200).reached, back: "reverse" })))
        .element(box("stayed", { node: el("#stayed") }))
        .motion(slide.in(beat("sta", 400, { when: scrollPoint(150).reached, back: "stay" })))
        .element(box("replayed", { node: el("#replayed") }))
        .motion(slide.in(beat("rep", 300, { when: scrollPoint(250).reached, back: "replay" })))
        .element(box("clocked", { node: el("#clocked") }))
        .motion(
          motion(
            (_t, context?: { readonly time: { readonly clock: { readonly kind: string } } }) => ({
              rotation:
                context?.time.clock.kind === "live"
                  ? Number(Reflect.get(context.time.clock, "elapsed")) / 100
                  : 0,
            }),
          ).in(range),
        )
        .element(box("pointed", { node: el("#pointed") }))
        .motion(bind({ x: (t, e) => pointer.x(t, e) * 100 }))
        .element(box("sprung", { node: el("#sprung") }))
        .motion(bind({ x: (t, e) => sprung(t, e) * 100 }))
        .element(box("still", { node: el("#still") }))
        .motion(counted.in(beat("stillBeat", 100)))
        .element(many("parts", 3, { node: el(".part") }))
        .motion(
          slide.in(beat("partBeat", 400, { when: scrollPoint(300).reached, back: "reverse" })),
        );
      const mounted = mountPage(scene, {
        root,
        scrollTarget,
        frames,
        clock: () => ms,
        viewport: () => ({ width: 1000, height: 500 }),
      });
      const styles: string[] = [];
      const scrollAt = new Map([
        [496, 120],
        [512, 260],
        [528, 340],
        [896, 380],
        [1504, 90],
        [1520, 10],
        [2608, 330],
      ]);
      const after = stillRuns;
      for (ms = 16; ms <= 6000; ms += 16) {
        const y = scrollAt.get(ms);
        if (y !== undefined) {
          scrollY = y;
          for (const listener of [...scrollTarget.listeners]) listener();
        }
        if (ms === 1200 || ms === 3008) root.fire("pointermove", { clientX: ms / 4, clientY: 100 });
        if (frames.queued > 0) frames.tick(ms);
        styles.push(
          [...nodes, ...parts]
            .map((node) => `${node.style.transform}|${node.style.opacity}`)
            .join(";"),
        );
      }
      const run = { styles, stillRuns: stillRuns - after, queuedAtEnd: frames.queued };
      mounted.dispose();
      return run;
    } finally {
      Reflect.deleteProperty(globalThis, OFF);
    }
  }

  it("writes every node the same as running the whole scene on every frame", () => {
    const whole = play(true);
    const caused = play(false);
    expect(caused.styles).toEqual(whole.styles);
  });

  it("runs a finished element only on input frames, and asks for no frame once nothing moves", () => {
    const whole = play(true);
    const caused = play(false);
    expect(caused.stillRuns).toBeLessThan(whole.stillRuns / 4);
    expect(caused.queuedAtEnd).toBe(0);
  });
});

describe("mountPage frames for a cause, reading another element", () => {
  const OFF = Symbol.for("@gerak/dom/clock-frames-off");

  function play(off: boolean): string[] {
    Reflect.set(globalThis, OFF, off);
    try {
      const leaderNode = new FakeNode("leader");
      const followerNode = new FakeNode("follower");
      const root = new FakeRoot([leaderNode, followerNode]);
      const frames = fakeFrames();
      let ms = 0;
      const leader = box("leader", { node: el("#leader") });
      const scene = sceneBuilder()
        .element(leader)
        .motion(motion((t): Pose2d => ({ x: 100 * t.progress })).loop(700))
        .element(box("follower", { node: el("#follower") }))
        .motion(
          motion((_t, context?: { read(target: typeof leader): Pose2d }) => ({
            y: context?.read(leader).x ?? 0,
          })).in(beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] })),
        );
      const mounted = mountPage(scene, { root, frames, clock: () => ms });
      const styles: string[] = [];
      for (ms = 16; ms <= 6000; ms += 16) {
        if (frames.queued > 0) frames.tick(ms);
        styles.push(`${leaderNode.style.transform};${followerNode.style.transform}`);
      }
      mounted.dispose();
      return styles;
    } finally {
      Reflect.deleteProperty(globalThis, OFF);
    }
  }

  it("keeps an element that reads a moving element running with it", () => {
    expect(play(false)).toEqual(play(true));
  });
});
