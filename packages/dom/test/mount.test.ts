import {
  INPUT_EVENTS,
  motion,
  pointer,
  scroll,
  springTo,
  toCubics,
  type Pose2d,
  type Pose3d,
} from "@gerak/core";
import {
  beat,
  bind,
  box,
  carry,
  compileScene,
  object,
  sceneBuilder,
  scrollPoint,
  shape,
  text,
} from "@gerak/stage";
import { describe, expect, it } from "vitest";
import {
  mount,
  MOUNTS,
  type Binder,
  type ClockDriver,
  type FrameSource,
  type PageElement,
  type PageRoot,
  type PageStyle,
} from "../src";
import type { Driver } from "@gerak/player";

function isClock(driver: Driver): driver is ClockDriver {
  return "seek" in driver && typeof driver.seek === "function";
}

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
  parentElement: FakeNode | undefined = undefined;

  constructor(
    readonly id: string,
    readonly classes: readonly string[] = [],
  ) {}

  matches(selector: string): boolean {
    const cast = /^\[data-cast="(.*)"\]$/.exec(selector);
    if (cast !== null) return (this.attributes.get("data-cast") ?? this.id) === cast[1];
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

describe("mount", () => {
  it("writes poses onto existing nodes via applyValue and creates no frames or elements", () => {
    const card = new FakeNode("card");
    card.offsetLeft = 20;
    card.offsetTop = 50;
    card.offsetWidth = 120;
    card.offsetHeight = 60;
    const title = new FakeNode("title");
    title.textContent = "Existing Site Title";
    const items = [new FakeNode("i1", ["item"]), new FakeNode("i2", ["item"])];
    for (const item of items) item.setAttribute("data-cast", "items");
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
      .element(box("card", { watch: true }))
      .motion(motion((t): Pose2d => ({ x: 80 * t.progress })).in(sb))
      .element(text("title"))
      .motion(bind({ y: (t, e) => pointer.y(t, e) * 10 }))
      .element(box("items", { parts: true }))
      .motion((_t, ctx) => ({ x: (ctx.index ?? 0) * 15 }));

    const mounted = mount(scene, {
      root,
      scrollTarget,
      frames,
      clock: "live",
      now: () => ms,
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

  it("hands an object to the binder that claims it, binds no node for it, and stops the binder on dispose", () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    let ms = 0;
    const frames = fakeFrames();
    const spin = beat("spin", 1000);
    const scene = sceneBuilder()
      .element(object("drink"))
      .motion(motion((t): Pose3d => ({ rotationY: 90 * t.progress })).in(spin))
      .element(box("card"))
      .motion(motion((t): Pose2d => ({ x: 80 * t.progress })).in(spin));
    const seen: unknown[] = [];
    let stopped = 0;
    const drinks: Binder = {
      claims: (name) => name === "drink",
      start: (player) => {
        const off = player.subscribe("drink", (value) => seen.push(value));
        return () => {
          off();
          stopped += 1;
        };
      },
    };
    const mounted = mount(scene, { root, frames, clock: "live", now: () => ms, binders: [drinks] });
    ms = 500;
    frames.tick(500);
    expect(root.createdCount).toBe(0);
    expect(card.style.transform).toBe("translate3d(40px, 0px, 0px)");
    expect(seen.at(-1)).toEqual({ rotationY: 45 });
    expect(Object.keys(mounted.rest)).toEqual(["card"]);
    mounted.dispose();
    expect(stopped).toBe(1);
  });

  it("binds an element to the nodes `nodes` gives for its name, over its data-cast match", () => {
    const tagged = new FakeNode("card");
    const chosen = new FakeNode("elsewhere");
    const parts = [new FakeNode("p0"), new FakeNode("p1")];
    const root = new FakeRoot([tagged, chosen, ...parts]);
    const frames = fakeFrames();
    const scene = sceneBuilder({ length: 500 })
      .element(box("card"))
      .motion(() => ({ x: 7 }))
      .element(box("dots", { parts: true }))
      .motion((_t, ctx) => ({ y: ctx.index ?? 0 }));
    const mounted = mount(scene, {
      root,
      frames,
      clock: "live",
      now: () => 0,
      nodes: { card: chosen, dots: parts },
    });
    frames.tick(0);
    expect(chosen.style.transform).toBe("translate3d(7px, 0px, 0px)");
    expect(tagged.style.transform).toBe("");
    expect(parts[1]?.style.transform).toBe("translate3d(0px, 1px, 0px)");
    mounted.dispose();
  });

  it("refuses an object no binder claims, and one two binders claim, naming it", () => {
    const root = new FakeRoot([]);
    const scene = sceneBuilder({ length: 500 }).element(object("drink"));
    const claiming: Binder = { claims: () => true, start: () => () => undefined };
    expect(() => mount(scene, { root, clock: "live" })).toThrow(
      /no binder draws the object "drink"/,
    );
    expect(() => mount(scene, { root, clock: "live", binders: [claiming, claiming] })).toThrow(
      /2 binders draw the object "drink"/,
    );
  });

  it("runs a timed clock over the scene's length that seeks, and hands the tools a ClockDriver", () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    const frames = fakeFrames();
    const spin = beat("spin", 1000);
    const scene = sceneBuilder()
      .element(box("card"))
      .motion(motion((t): Pose2d => ({ x: 80 * t.progress })).in(spin));
    let handed: Driver | undefined;
    const mounted = mount(scene, { root, frames, clock: "timed", onDriver: (d) => (handed = d) });
    expect(handed).toBe(mounted.driver);
    const clock = mounted.driver;
    if (!isClock(clock)) throw new Error("expected a ClockDriver");
    frames.tick(0);
    frames.tick(500);
    expect(card.style.transform).toBe("translate3d(40px, 0px, 0px)");
    expect(mounted.driver.now().clock).toEqual({ kind: "timed", elapsed: 500, length: 1000 });
    clock.seek(1);
    expect(card.style.transform).toBe("translate3d(80px, 0px, 0px)");
    frames.tick(900);
    expect(mounted.driver.now().progress).toBe(1);
    mounted.dispose();
  });

  it("writes a shape's path on its bound node from the measured boxes, and rests it at the path's bounds", () => {
    const from = new FakeNode("from");
    from.offsetLeft = 0;
    from.offsetTop = 0;
    const line = new FakeNode("line");
    const root = new FakeRoot([from, line]);
    const scene = sceneBuilder({ length: 500 })
      .element(box("from"))
      .element(
        shape("line", (rest) => {
          const at = rest.get("from");
          const still = { inX: 0, inY: 0, outX: 0, outY: 0 };
          return toCubics([
            { id: "a", x: at.x, y: at.y, ...still },
            { id: "b", x: 200, y: 20, ...still },
          ]);
        }),
      );
    const mounted = mount(scene, { root, frames: fakeFrames(), clock: "live", now: () => 0 });
    expect(line.attributes.get("d")).toBe("M 50 20 C 50 20, 200 20, 200 20");
    expect(mounted.rest["line"]).toEqual({ x: 125, y: 20, width: 150, height: 1 });
    mounted.dispose();
  });

  it("swaps in a scene with the same cast and length, keeping time, and refuses another", () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    let ms = 0;
    const frames = fakeFrames();
    const spin = beat("spin", 1000);
    const moving = (distance: number) =>
      sceneBuilder()
        .element(box("card"))
        .motion(motion((t): Pose2d => ({ x: distance * t.progress })).in(spin));
    const mounted = mount(moving(80), { root, frames, clock: "live", now: () => ms });
    ms = 500;
    frames.tick(500);
    expect(card.style.transform).toBe("translate3d(40px, 0px, 0px)");
    mounted.replace(moving(200));
    expect(card.style.transform).toBe("translate3d(100px, 0px, 0px)");
    expect(() =>
      mounted.replace(sceneBuilder().element(box("card")).element(box("other"))),
    ).toThrow(/different cast/);
    mounted.dispose();
  });

  it("measures its cast as plain data, each element's parent named, and lists itself while it plays", () => {
    const card = new FakeNode("card");
    card.offsetLeft = 20;
    card.offsetTop = 50;
    card.offsetWidth = 120;
    card.offsetHeight = 60;
    const title = new FakeNode("title");
    title.parentElement = card;
    const items = [new FakeNode("i1"), new FakeNode("i2")];
    for (const item of items) {
      item.setAttribute("data-cast", "items");
      item.parentElement = card;
    }
    const root = new FakeRoot([card, title, ...items]);
    const scene = sceneBuilder({ length: 500 })
      .element(box("card"))
      .element(box("title"))
      .element(box("items", { parts: true }));
    const mounted = mount(scene, {
      root,
      frames: fakeFrames(),
      clock: "live",
      now: () => 0,
      viewport: () => ({ width: 800, height: 600 }),
    });
    const measured = mounted.measure();
    expect(measured.frame).toEqual({ width: 800, height: 600 });
    expect(measured.rest["card"]).toEqual({
      x: 80,
      y: 80,
      width: 120,
      height: 60,
      placement: { kind: "flow" },
    });
    expect(measured.parents).toEqual({ title: "card", "items.0": "card", "items.1": "card" });
    expect(JSON.parse(JSON.stringify(measured))).toEqual(measured);
    expect(Reflect.get(globalThis, MOUNTS)).toContain(mounted);
    mounted.dispose();
    expect(Reflect.get(globalThis, MOUNTS)).not.toContain(mounted);
  });

  it("refuses a scene missing nodes or a missing selector", () => {
    const root = new FakeRoot([new FakeNode("card")]);
    expect(() =>
      mount(sceneBuilder({ length: 500 }).element(box("plain")), { clock: "live", root }),
    ).toThrow(/"plain"/);
    expect(() => mount(sceneBuilder().element(box("missing")), { clock: "live", root })).toThrow(
      /"missing".*data-cast="missing"/,
    );
  });

  it("supports send on the shared live clock and respects readouts without clobbering plain text", () => {
    const meter = new FakeNode("meter");
    const clockOut = new FakeNode("clock");
    const root = new FakeRoot([meter, clockOut]);
    let ms = 0;
    const frames = fakeFrames();
    const mounted = mount(
      sceneBuilder()
        .element(box("meter"))
        .motion(bind({ x: (t, e) => scroll.y(t, e) }))
        .element(
          text(
            "clock",
            (t) => `${Math.round(t.clock.kind === "live" ? t.clock.elapsed : 0)}ms`,
            {},
          ),
        ),
      { root, frames, clock: "live", now: () => ms },
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
    const mounted = mount(
      sceneBuilder()
        .element(box("meter"))
        .motion(
          bind({
            x: (t, e) => {
              runs += 1;
              return scroll.y(t, e) + pointer.x(t, e);
            },
          }),
        ),
      { root, frames, clock: "live", now: () => ms, viewport: () => ({ width: 100, height: 100 }) },
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
    const mounted = mount(
      sceneBuilder({ length: 1000 })
        .element(text("headline", { split: "words" }))
        .motion((_t, ctx) => ({ x: (ctx.index ?? 0) * 10 })),
      { root, frames: fakeFrames(), clock: "live", now: () => 0 },
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
    const mounted = mount(
      sceneBuilder({ length: 500 })
        .element(text("solo", { split: "words" }))
        .motion(() => ({ x: 5 })),
      { root, frames: fakeFrames(), clock: "live", now: () => 0 },
    );
    expect(root.createdCount).toBe(1);
    expect(solo.children).toHaveLength(1);
    expect(solo.children[0]?.style.transform).toBe("translate3d(5px, 0px, 0px)");
    expect(solo.style.transform).toBe("");
    mounted.dispose();
    expect(solo.textContent).toBe("HELLO");

    const rollbackRoot = new FakeRoot([new FakeNode("solo")]);
    expect(() =>
      mount(
        sceneBuilder({ length: 500 })
          .element(text("solo", { split: "words" }))
          .element(box("missing")),
        { root: rollbackRoot, frames: fakeFrames(), clock: "live", now: () => 0 },
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

    const hero = box("hero");
    const story = box("story");
    const sb = beat("go", { scroll: [hero.top, story.top] });

    const mounted = mount(
      sceneBuilder()
        .element(box("card"))
        .motion(motion((t) => ({ x: 100 * t.progress })).in(sb)),
      { root, frames: fakeFrames(), clock: "live", now: () => 0 },
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
    const missingSec = box("absent");
    const missingBeat = beat("miss", { scroll: [missingSec.top, missingSec.end] });
    expect(() =>
      mount(
        sceneBuilder()
          .element(text("solo", { split: "words" }))
          .motion(motion((t) => ({ x: 10 * t.progress })).in(missingBeat)),
        { root: new FakeRoot([failSolo]), frames: fakeFrames(), clock: "live", now: () => 0 },
      ),
    ).toThrow(/"absent".*data-cast="absent"/);
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
    const mounted = mount(
      sceneBuilder()
        .element(box("card"))
        .motion(
          motion((t) => {
            sceneCalls += 1;
            return { x: 100 * t.progress };
          }).in(sb),
        ),
      { root, scrollTarget, frames: fakeFrames(), clock: "live", now: () => 0 },
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

  it("carries an element from its old rest box to its new one across remeasure", () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    let ms = 0;
    const frames = fakeFrames();
    const scene = sceneBuilder({ length: 1000 })
      .element(box("card"))
      .motion(carry({ ms: 200 }));
    const mounted = mount(scene, { root, frames, clock: "live", now: () => ms });
    frames.tick(0);
    expect(card.style.transform).toBe("");

    ms = 100;
    card.offsetLeft = 200;
    card.offsetTop = 40;
    card.offsetWidth = 200;
    card.offsetHeight = 80;
    mounted.remeasure();
    expect(card.style.transform).toBe("translate3d(-250px, -60px, 0px) scaleX(0.5) scaleY(0.5)");

    ms = 200;
    frames.tick(200);
    expect(card.style.transform).toBe("translate3d(-125px, -30px, 0px) scaleX(0.75) scaleY(0.75)");

    ms = 300;
    frames.tick(300);
    expect(card.style.transform).toBe("");
    mounted.dispose();
  });
});

describe("mount frames for a cause", () => {
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
      for (const part of parts) part.setAttribute("data-cast", "parts");
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
        .element(box("intro"))
        .motion(slide.in(beat("introBeat", 300)))
        .element(box("scrolled"))
        .motion(slide.in(range))
        .element(box("smoothed"))
        .motion(slide.in(smooth))
        .element(box("revealed"))
        .motion(slide.in(beat("rev", 500, { when: scrollPoint(200).reached, back: "reverse" })))
        .element(box("stayed"))
        .motion(slide.in(beat("sta", 400, { when: scrollPoint(150).reached, back: "stay" })))
        .element(box("replayed"))
        .motion(slide.in(beat("rep", 300, { when: scrollPoint(250).reached, back: "replay" })))
        .element(box("clocked"))
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
        .element(box("pointed"))
        .motion(bind({ x: (t, e) => pointer.x(t, e) * 100 }))
        .element(box("sprung"))
        .motion(bind({ x: (t, e) => sprung(t, e) * 100 }))
        .element(box("still"))
        .motion(counted.in(beat("stillBeat", 100)))
        .element(box("parts", { parts: true }))
        .motion(
          slide.in(beat("partBeat", 400, { when: scrollPoint(300).reached, back: "reverse" })),
        );
      const mounted = mount(scene, {
        root,
        scrollTarget,
        frames,
        clock: "live",
        now: () => ms,
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

describe("mount frames for a cause, reading another element", () => {
  const OFF = Symbol.for("@gerak/dom/clock-frames-off");

  function play(off: boolean): string[] {
    Reflect.set(globalThis, OFF, off);
    try {
      const leaderNode = new FakeNode("leader");
      const followerNode = new FakeNode("follower");
      const root = new FakeRoot([leaderNode, followerNode]);
      const frames = fakeFrames();
      let ms = 0;
      const leader = box("leader");
      const scene = sceneBuilder()
        .element(leader)
        .motion(motion((t): Pose2d => ({ x: 100 * t.progress })).loop(700))
        .element(box("follower"))
        .motion(
          motion((_t, context?: { read(target: typeof leader): Pose2d }) => ({
            y: context?.read(leader).x ?? 0,
          })).in(beat("range", { scroll: [scrollPoint(0), scrollPoint(400)] })),
        );
      const mounted = mount(scene, { root, frames, clock: "live", now: () => ms });
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
