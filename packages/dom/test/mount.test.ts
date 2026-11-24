import {
  INPUT_EVENTS,
  aim,
  motion,
  pointer,
  scroll,
  shared,
  springTo,
  state,
  toCubics,
  transition,
  viewSize3d,
  type Lens3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import {
  beat,
  bind,
  box,
  carry,
  compileScene,
  frameVisible,
  listPose3d,
  object,
  pose3dOf,
  sceneBuilder,
  scrollPoint,
  shape,
  stagger,
  text,
  travel,
  type MotionContext,
} from "@gerak/stage";
import { describe, expect, it } from "vitest";
import {
  BINDER_CASTS,
  mount,
  MOUNTS,
  ready,
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

  it("binds box(parts: true) to matched elements even with 1 item having children, while keeping text(split) and explicit nodes distinct", () => {
    const singleCard = new FakeNode("singleCard");
    singleCard.setAttribute("data-cast", "cards");
    const h3 = new FakeNode("h3");
    const p = new FakeNode("p");
    singleCard.children.push(h3, p);

    const headline = new FakeNode("headline");
    const word0 = new FakeNode("word0");
    const word1 = new FakeNode("word1");
    headline.children.push(word0, word1);

    const plain = new FakeNode("plain");
    plain.textContent = "One two";

    const root = new FakeRoot([singleCard, headline, plain]);
    const scene = sceneBuilder({ length: 500 })
      .element(box("cards", { parts: true }))
      .motion((_t, ctx) => ({ x: 10 + (ctx?.index ?? 0) * 5, y: ctx?.count ?? 0 }))
      .element(text("headline", { split: "words" }))
      .motion((_t, ctx) => ({ x: 20 + (ctx?.index ?? 0) * 10 }))
      .element(text("plain", { split: "words" }))
      .motion((_t, ctx) => ({ y: 30 + (ctx?.index ?? 0) * 10 }));

    const mounted = mount(scene, { root, frames: fakeFrames(), clock: "live", now: () => 0 });
    expect(singleCard.style.transform).toBe("translate3d(10px, 1px, 0px)");
    expect(h3.style.transform).toBe("");
    expect(p.style.transform).toBe("");
    expect(mounted.measure().rest["cards.0"]).toBeDefined();
    expect(mounted.measure().rest["cards"]).toBeDefined();
    expect(word0.style.transform).toBe("translate3d(20px, 0px, 0px)");
    expect(word1.style.transform).toBe("translate3d(30px, 0px, 0px)");
    expect(headline.style.transform).toBe("");
    expect(plain.children).toHaveLength(2);
    expect(plain.children[0]?.style.transform).toBe("translate3d(0px, 30px, 0px)");
    mounted.dispose();
    expect(plain.textContent).toBe("One two");

    const explicitCard = new FakeNode("explicitCard");
    explicitCard.children.push(new FakeNode("nestedA"), new FakeNode("nestedB"));
    const explicitWord = new FakeNode("explicitWord");
    explicitWord.children.push(new FakeNode("nestedSpan"));
    const explicitScene = sceneBuilder({ length: 500 })
      .element(box("cards", { parts: true }))
      .motion((_t, ctx) => ({ x: 5, y: ctx?.count ?? 0 }))
      .element(text("headline", { split: "words" }))
      .motion((_t, ctx) => ({ x: 7, y: ctx?.count ?? 0 }));
    const explicitMounted = mount(explicitScene, {
      root: new FakeRoot([]),
      frames: fakeFrames(),
      clock: "live",
      now: () => 0,
      nodes: { cards: [explicitCard], headline: [explicitWord] },
    });
    expect(explicitCard.style.transform).toBe("translate3d(5px, 1px, 0px)");
    expect(explicitCard.children[0]?.style.transform).toBe("");
    expect(explicitWord.style.transform).toBe("translate3d(7px, 1px, 0px)");
    expect(explicitWord.children[0]?.style.transform).toBe("");
    explicitMounted.dispose();
  });

  it("refuses a non-parts box matching multiple DOM nodes and records Binder.casts before mount errors", () => {
    const a = new FakeNode("cardA");
    a.setAttribute("data-cast", "cards");
    const b = new FakeNode("cardB");
    b.setAttribute("data-cast", "cards");
    expect(() =>
      mount(sceneBuilder({ length: 500 }).element(box("cards")), {
        root: new FakeRoot([a, b]),
        frames: fakeFrames(),
        clock: "live",
        now: () => 0,
      }),
    ).toThrow(/"cards".*parts: true/);

    const jarBinder: Binder = {
      claims: (name) => name === "jar",
      casts: () => ({ jar: "single", cookies: "list" }),
      start: () => () => undefined,
    };
    expect(() =>
      mount(sceneBuilder({ length: 500 }).element(box("missingDom")), {
        root: new FakeRoot([]),
        frames: fakeFrames(),
        clock: "live",
        now: () => 0,
        binders: [jarBinder],
      }),
    ).toThrow(/missingDom/);
    const recorded: unknown = Reflect.get(globalThis, BINDER_CASTS);
    expect(Array.isArray(recorded) && recorded.length > 0).toBe(true);
    const merged: Record<string, string> = {};
    if (Array.isArray(recorded)) {
      for (const entry of recorded) {
        const readFn: unknown = Reflect.get(Object(entry), "read");
        if (typeof readFn === "function") Object.assign(merged, Reflect.apply(readFn, entry, []));
      }
      recorded.length = 0;
    }
    expect(merged).toEqual({ jar: "single", cookies: "list" });

    const single = new FakeNode("cardA");
    const mounted = mount(sceneBuilder({ length: 500 }).element(box("cardA")), {
      root: new FakeRoot([single]),
      frames: fakeFrames(),
      clock: "live",
      now: () => 0,
      binders: [jarBinder],
    });
    expect(Reflect.get(globalThis, BINDER_CASTS)).toHaveLength(1);
    mounted.dispose();
    expect(Reflect.get(globalThis, BINDER_CASTS)).toHaveLength(0);
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

describe("compositor remeasure stability and ResizeObserver coalescing", () => {
  class FakeTimeline {}
  class FakeScrollTimeline extends FakeTimeline {}
  class FakeAnimation {
    effect: object | null = {};
    readonly timeline: unknown;
    currentTime: number | null = 0;
    playState: AnimationPlayState = "paused";
    playbackRate = 1;
    cancelled = 0;
    constructor(timeline: unknown) {
      this.timeline = timeline;
    }
    play(): void {
      this.playState = "running";
    }
    pause(): void {
      this.playState = "paused";
    }
    cancel(): void {
      this.cancelled += 1;
    }
  }
  class FakeDomNode extends FakeNode {
    scrollHeight = 2000;
    clientHeight = 500;
    animateCalls = 0;
    measureCalls = 0;
    lastAnimation: FakeAnimation | undefined;
    readonly docTimeline: FakeTimeline;
    constructor(id: string, docTimeline: FakeTimeline, classes: readonly string[] = []) {
      super(id, classes);
      this.docTimeline = docTimeline;
    }
    getBoundingClientRect() {
      this.measureCalls += 1;
      return {
        left: this.offsetLeft,
        top: this.offsetTop,
        width: this.offsetWidth,
        height: this.offsetHeight,
      };
    }
    animate(_keyframes: unknown, options: { readonly timeline?: unknown }): FakeAnimation {
      this.animateCalls += 1;
      const anim = new FakeAnimation(options.timeline ?? this.docTimeline);
      this.lastAnimation = anim;
      return anim;
    }
  }

  async function withDomGlobals<T>(
    run: (triggerResize: () => void, setPinTop: (px: number) => void) => T | Promise<T>,
  ): Promise<T> {
    const prevElement = Reflect.get(globalThis, "Element");
    const prevTimeline = Reflect.get(globalThis, "AnimationTimeline");
    const prevScrollTimeline = Reflect.get(globalThis, "ScrollTimeline");
    const prevObserver = Reflect.get(globalThis, "ResizeObserver");
    const prevComputed = Reflect.get(globalThis, "getComputedStyle");
    let pinTop = 0;
    const callbacks: (() => void)[] = [];
    class FakeResizeObserver {
      private readonly cb: () => void;
      constructor(cb: () => void) {
        this.cb = cb;
        callbacks.push(cb);
      }
      observe(): void {}
      disconnect(): void {
        const index = callbacks.indexOf(this.cb);
        if (index >= 0) callbacks.splice(index, 1);
      }
    }
    Reflect.set(globalThis, "Element", FakeDomNode);
    Reflect.set(globalThis, "AnimationTimeline", FakeTimeline);
    Reflect.set(globalThis, "ScrollTimeline", FakeScrollTimeline);
    Reflect.set(globalThis, "ResizeObserver", FakeResizeObserver);
    Reflect.set(globalThis, "getComputedStyle", (el: unknown) => {
      if (el instanceof FakeDomNode && el.id === "stickyBox") {
        return { position: "sticky", top: `${pinTop}px`, marginBottom: "0px" };
      }
      return { position: "static", paddingBottom: "0px", borderBottomWidth: "0px" };
    });
    try {
      return await run(
        () => {
          for (const cb of [...callbacks]) cb();
        },
        (px: number) => {
          pinTop = px;
        },
      );
    } finally {
      if (prevElement === undefined) Reflect.deleteProperty(globalThis, "Element");
      else Reflect.set(globalThis, "Element", prevElement);
      if (prevTimeline === undefined) Reflect.deleteProperty(globalThis, "AnimationTimeline");
      else Reflect.set(globalThis, "AnimationTimeline", prevTimeline);
      if (prevScrollTimeline === undefined) Reflect.deleteProperty(globalThis, "ScrollTimeline");
      else Reflect.set(globalThis, "ScrollTimeline", prevScrollTimeline);
      if (prevObserver === undefined) Reflect.deleteProperty(globalThis, "ResizeObserver");
      else Reflect.set(globalThis, "ResizeObserver", prevObserver);
      if (prevComputed === undefined) Reflect.deleteProperty(globalThis, "getComputedStyle");
      else Reflect.set(globalThis, "getComputedStyle", prevComputed);
    }
  }

  function makeDomHarness(docTimeline: FakeTimeline, nodes: readonly FakeDomNode[], scrollY = 0) {
    const docEl = new FakeDomNode("html", docTimeline);
    const view = {
      scrollY,
      innerWidth: 1000,
      innerHeight: 500,
      addEventListener(): void {},
      removeEventListener(): void {},
    };
    const doc = {
      documentElement: docEl,
      defaultView: view,
      timeline: docTimeline,
      createElement: (tag: string) => new FakeDomNode(`created-${tag}`, docTimeline),
    };
    const root: PageRoot = {
      ownerDocument: doc,
      defaultView: view,
      documentElement: docEl,
      querySelector: (selector: string) => nodes.find((n) => n.matches(selector)) ?? null,
      querySelectorAll: (selector: string) => nodes.filter((n) => n.matches(selector)),
    };
    return { docEl, view, root };
  }

  it("skips compositor rebuilds on non-dependency resize, rebuilds on dep/maxScroll/lines/replace, and coalesces ResizeObserver", async () => {
    await withDomGlobals(async (triggerResize) => {
      const docTimeline = new FakeTimeline();
      const widget = new FakeDomNode("widget", docTimeline);
      const sec = new FakeDomNode("sec", docTimeline);
      sec.offsetTop = 200;
      sec.offsetHeight = 600;
      const bar = new FakeDomNode("bar", docTimeline);
      const cards = new FakeDomNode("cards", docTimeline);
      cards.textContent = "alpha beta";
      const word0 = new FakeDomNode("w0", docTimeline);
      const word1 = new FakeDomNode("w1", docTimeline);
      word0.offsetTop = 0;
      word1.offsetTop = 0;
      cards.children.push(word0, word1);

      const { docEl, view, root } = makeDomHarness(docTimeline, [widget, sec, bar, cards]);
      const frames = fakeFrames();
      const slide = motion((t): Pose2d => ({ x: 100 * t.progress }));
      const makeScene = (scale: number) => {
        const secBox = box("sec");
        const scrollBeat = beat("scroll", { scroll: [secBox.top, secBox.end] });
        return sceneBuilder({ length: 1000 })
          .element(box("widget"))
          .motion(bind({ y: () => 0 }))
          .element(box("bar"))
          .motion(motion((t): Pose2d => ({ x: 100 * scale * t.progress })).in(scrollBeat))
          .element(text("cards", { split: "words" }))
          .motion(slide.in(scrollBeat));
      };

      const mounted = mount(makeScene(1), {
        root,
        scrollTarget: view,
        frames,
        clock: "live",
        now: () => 0,
      });

      const barAnim1 = bar.lastAnimation;
      expect(bar.animateCalls).toBe(1);
      expect(cards.animateCalls).toBe(0);
      expect(word0.animateCalls).toBe(1);
      expect(barAnim1?.cancelled).toBe(0);

      // Burst of ResizeObserver callbacks on non-dependency widget coalesces to 1 measure and 0 handoff rebuilds.
      const measuresBeforeBurst = widget.measureCalls;
      widget.offsetWidth = 220;
      triggerResize();
      triggerResize();
      triggerResize();
      expect(widget.measureCalls).toBe(measuresBeforeBurst);
      await Promise.resolve();
      expect(widget.measureCalls).toBe(measuresBeforeBurst + 1);
      expect(bar.animateCalls).toBe(1);
      expect(barAnim1?.cancelled).toBe(0);
      expect(bar.lastAnimation).toBe(barAnim1);

      // Resizing a dependency box (`sec`) triggers a rebuild.
      sec.offsetHeight = 800;
      mounted.remeasure();
      expect(bar.animateCalls).toBe(2);
      expect(barAnim1?.cancelled).toBe(1);

      // Changing `maxScroll` triggers a rebuild.
      const barAnim2 = bar.lastAnimation;
      docEl.scrollHeight = 2500;
      mounted.remeasure();
      expect(bar.animateCalls).toBe(3);
      expect(barAnim2?.cancelled).toBe(1);

      // Changing split `lines` triggers a rebuild.
      const barAnim3 = bar.lastAnimation;
      word1.offsetTop = 30;
      mounted.remeasure();
      expect(bar.animateCalls).toBe(4);
      expect(barAnim3?.cancelled).toBe(1);

      // Calling `replace()` forces a rebuild even when rest boxes, lines, and maxScroll are unchanged.
      const barAnim4 = bar.lastAnimation;
      mounted.replace(makeScene(2));
      expect(bar.animateCalls).toBe(5);
      expect(barAnim4?.cancelled).toBe(1);

      // Pending ResizeObserver work cancels cleanly on dispose.
      const measuresBeforeDispose = widget.measureCalls;
      triggerResize();
      mounted.dispose();
      await Promise.resolve();
      expect(widget.measureCalls).toBe(measuresBeforeDispose);
      expect(frames.queued).toBe(0);
    });
  });

  it("detects sticky placement changes in sameRest and handedDeps even when box dimensions are unchanged", async () => {
    await withDomGlobals((_triggerResize, setPinTop) => {
      const docTimeline = new FakeTimeline();
      const parent = new FakeDomNode("stickyParent", docTimeline);
      parent.offsetTop = 100;
      parent.offsetHeight = 900;
      const sticky = new FakeDomNode("stickyBox", docTimeline);
      sticky.offsetTop = 100;
      sticky.offsetHeight = 200;
      sticky.parentElement = parent;
      const target = new FakeDomNode("target", docTimeline);
      const { view, root } = makeDomHarness(docTimeline, [sticky, target]);
      const frames = fakeFrames();
      let ms = 0;

      const scene = sceneBuilder({ length: 1000 })
        .element(box("stickyBox"))
        .motion(carry({ ms: 200 }))
        .element(box("target"))
        .motion(
          motion(
            (
              t,
              context?: { readonly rest: { get(name: string): { readonly y: number } } },
            ): Pose2d => ({
              x: 50 * t.progress + (context?.rest.get("stickyBox").y ?? 0) * 0,
            }),
          ).in(beat("s", { scroll: [scrollPoint(0), scrollPoint(500)] })),
        );

      const mounted = mount(scene, {
        root,
        scrollTarget: view,
        frames,
        clock: "live",
        settleMs: 50,
        now: () => ms,
      });

      frames.tick(0);
      frames.tick(16);
      const animBefore = target.lastAnimation;
      expect(mounted.measure().rest["stickyBox"]?.placement).toEqual({
        kind: "sticky",
        minY: 100,
        maxY: 800,
        pinY: 100,
      });

      ms = 100;
      setPinTop(40);
      mounted.remeasure();
      expect(mounted.measure().rest["stickyBox"]?.placement).toEqual({
        kind: "sticky",
        minY: 60,
        maxY: 760,
        pinY: 140,
      });
      // `sameBox`/`sameRest` must see the placement delta: both `activeUntil` and `handOff()` react.
      frames.tick(116);
      expect(frames.queued).toBeGreaterThan(0);
      expect(target.animateCalls).toBe(2);
      expect(animBefore?.cancelled).toBe(1);
      mounted.dispose();
    });
  });

  it("detaches and restores document-timeline trigger animations across non-dependency remeasure", async () => {
    await withDomGlobals(() => {
      const docTimeline = new FakeTimeline();
      const observedEffects: (object | null | undefined)[] = [];
      class RecordingNode extends FakeDomNode {
        override getBoundingClientRect() {
          observedEffects.push(panel.lastAnimation?.effect);
          return super.getBoundingClientRect();
        }
      }
      const widget = new FakeDomNode("widget", docTimeline);
      const panel = new RecordingNode("panel", docTimeline);
      const { view, root } = makeDomHarness(docTimeline, [widget, panel]);
      const frames = fakeFrames();
      let ms = 0;

      const reveal = beat("reveal", 600, { when: scrollPoint(200).reached, back: "stay" });
      const scene = sceneBuilder({ length: 1000 })
        .element(box("widget"))
        .motion(bind({ y: () => 0 }))
        .element(box("panel"))
        .motion(motion((t): Pose2d => ({ opacity: t.progress })).in(reveal));

      const mounted = mount(scene, {
        root,
        scrollTarget: view,
        frames,
        clock: "live",
        now: () => ms,
      });

      const anim = panel.lastAnimation;
      expect(panel.animateCalls).toBe(1);
      expect(anim?.playState).toBe("paused");
      expect(anim?.effect).not.toBeNull();

      ms = 16;
      view.scrollY = 300;
      frames.tick(16);
      expect(anim?.playState).toBe("running");

      ms = 250;
      if (anim !== undefined) anim.currentTime = 234;
      observedEffects.length = 0;
      widget.offsetWidth = 240;
      mounted.remeasure();

      expect(observedEffects).toContain(null);
      expect(panel.animateCalls).toBe(1);
      expect(panel.lastAnimation).toBe(anim);
      expect(anim?.cancelled).toBe(0);
      expect(anim?.effect).not.toBeNull();
      expect(anim?.currentTime).toBe(234);
      expect(anim?.playState).toBe("running");

      mounted.dispose();
    });
  });

  it("calls Binder.resize before measuring, stores Binder.measure in Measurement.objects, and sets __motionReady via ready()", async () => {
    const prevReady: unknown = Reflect.get(globalThis, "__motionReady");
    try {
      const resolved = ready(Promise.resolve("done"));
      expect(Reflect.get(globalThis, "__motionReady")).toBe(resolved);
      await expect(resolved).resolves.toBeUndefined();

      const rejected = ready(Promise.reject(new Error("boom")));
      await expect(rejected).rejects.toThrow("boom");
    } finally {
      if (prevReady === undefined) Reflect.deleteProperty(globalThis, "__motionReady");
      else Reflect.set(globalThis, "__motionReady", prevReady);
    }

    await withDomGlobals(() => {
      const docTimeline = new FakeTimeline();
      const eventsOrder: string[] = [];
      class OrderedNode extends FakeDomNode {
        override getBoundingClientRect() {
          eventsOrder.push(`dom:${this.id}`);
          return super.getBoundingClientRect();
        }
      }
      const canvasNode = new OrderedNode("gl", docTimeline);
      canvasNode.offsetWidth = 800;
      canvasNode.offsetHeight = 600;
      const slotNode = new OrderedNode("slot", docTimeline);
      slotNode.offsetWidth = 200;
      slotNode.offsetHeight = 200;
      const { view, root } = makeDomHarness(docTimeline, [canvasNode, slotNode]);
      const frames = fakeFrames();

      const lens: Lens3d = {
        x: 0,
        y: 0,
        z: 5,
        ...aim({ x: 0, y: 0, z: 5 }, { x: 0, y: 0, z: 0 }),
        fov: 40,
      };
      const objCanvas = box("gl");
      const objSlot = box("slot");
      const scene = sceneBuilder({ length: 1000 })
        .element(object("can", { view: { canvas: objCanvas, lens } }))
        .motion(travel({ to: objSlot, fit: "contain" }))
        .element(object("prop"))
        .motion(motion((): Pose3d => ({ y: 0 })));

      let seenCanNames: readonly string[] | undefined;
      let seenPropNames: readonly string[] | undefined;
      const canBinder: Binder = {
        claims: (name) => name === "can",
        start: () => () => undefined,
        resize: () => {
          eventsOrder.push("binder:resize");
        },
        measure: (names) => {
          seenCanNames = names;
          eventsOrder.push("binder:measure");
          return { can: { width: 1.5, height: 3, depth: 1.5 } };
        },
      };
      const propBinder: Binder = {
        claims: (name) => name === "prop",
        start: () => () => undefined,
        measure: (names) => {
          seenPropNames = names;
          return { prop: { width: 1, height: 1, depth: 1 } };
        },
      };

      const mounted = mount(scene, {
        root,
        scrollTarget: view,
        frames,
        clock: "timed",
        binders: [canBinder, propBinder],
      });

      expect(seenCanNames).toEqual(["can"]);
      expect(seenPropNames).toEqual(["prop"]);
      expect(mounted.measure().objects).toEqual({
        can: { width: 1.5, height: 3, depth: 1.5 },
        prop: { width: 1, height: 1, depth: 1 },
      });
      // `binder.resize` must run before DOM `getBoundingClientRect()` on initial mount.
      expect(eventsOrder.indexOf("binder:resize")).toBeLessThan(eventsOrder.indexOf("dom:gl"));

      eventsOrder.length = 0;
      mounted.remeasure();
      // `binder.resize` must also run before DOM `getBoundingClientRect()` on `remeasure()`.
      expect(eventsOrder.indexOf("binder:resize")).toBeGreaterThanOrEqual(0);
      expect(eventsOrder.indexOf("binder:resize")).toBeLessThan(eventsOrder.indexOf("dom:gl"));
      expect(eventsOrder).toContain("binder:measure");
      // Scene frame computes exact uniform `fit: "contain"` scale from measured 3D bounds and `viewSize3d`.
      const expectedScale = (200 * viewSize3d(lens, { width: 800, height: 600 }, 5).unitsPerPx) / 3;
      expect(pose3dOf(mounted.player.values["can"])?.scale).toBeCloseTo(expectedScale, 6);

      mounted.dispose();
    });
  });

  it("keeps updating every reader of a shared transition past settleMs until settled without further input", () => {
    const first = new FakeNode("first");
    const second = new FakeNode("second");
    const root = new FakeRoot([first, second]);
    let ms = 0;
    const frames = fakeFrames();
    const view = {
      scrollY: 0,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };

    const flag = state(false, (cur, ev) => (ev.name === "go" ? true : cur));
    const trans = shared(transition(flag, { ms: 300 }));
    const fadeMotion = motion((_t: Time, ctx?: MotionContext): Pose2d => {
      if (!ctx) return { opacity: 0 };
      const v = trans(ctx.time, ctx.events);
      return { opacity: v.current ? v.progress : 0 };
    });

    const scene = sceneBuilder()
      .element(box("first"))
      .motion(fadeMotion)
      .element(box("second"))
      .motion(fadeMotion);

    const mounted = mount(scene, {
      root,
      scrollTarget: view,
      frames,
      clock: "live",
      settleMs: 100,
      now: () => ms,
    });

    frames.tick(0);
    ms = 10;
    mounted.send("go", 1);
    frames.tick(10);
    expect(Number(first.style.opacity)).toBeCloseTo(0, 6);
    expect(Number(second.style.opacity)).toBeCloseTo(0, 6);

    // Step past settleMs (10 + 100 = 110) with no new inputs; both readers must advance together.
    ms = 160;
    frames.tick(160);
    expect(Number(first.style.opacity)).toBeCloseTo(0.5, 6);
    expect(Number(second.style.opacity)).toBeCloseTo(0.5, 6);
    expect(frames.queued).toBeGreaterThan(0);

    // Past 300 ms transition end (10 + 300 = 310), both settle to 1 and scheduling stops.
    ms = 320;
    frames.tick(320);
    expect(Number(first.style.opacity)).toBeCloseTo(1, 6);
    expect(Number(second.style.opacity)).toBeCloseTo(1, 6);
    ms = 340;
    frames.tick(340);
    expect(frames.queued).toBe(0);

    mounted.dispose();
  });

  it("hides DOM and Three.js scroll-show elements outside scroll windows without breaking sibling compositor handoff", async () => {
    await withDomGlobals(() => {
      const docTimeline = new FakeTimeline();
      const gated = new FakeDomNode("gated", docTimeline);
      const handed = new FakeDomNode("handed", docTimeline);
      const { view, root } = makeDomHarness(docTimeline, [gated, handed]);
      const frames = fakeFrames();
      let ms = 0;

      let orbVisible = true;
      const orbBinder: Binder = {
        claims: (name) => name === "orb",
        start: (player) =>
          player.subscribe("orb", () => {
            orbVisible = frameVisible(player.values)?.["orb"] ?? true;
          }),
      };

      const scrollRange = beat("scrollRange", { scroll: [scrollPoint(0), scrollPoint(800)] });
      const scene = sceneBuilder({ length: 1000 })
        .element(box("gated"))
        .motion(motion((t): Pose2d => ({ x: 50 * t.progress })).in(scrollRange))
        .show([scrollPoint(100), scrollPoint(300)])
        .element(box("handed"))
        .motion(motion((t): Pose2d => ({ x: 80 * t.progress })).in(scrollRange))
        .element(object("orb"))
        .motion(motion((t): Pose3d => ({ y: 1 + t.progress })))
        .show([scrollPoint(100), scrollPoint(300)]);

      const mounted = mount(scene, {
        root,
        scrollTarget: view,
        frames,
        clock: "live",
        now: () => ms,
        binders: [orbBinder],
      });

      // Scroll-show disqualifies `gated` from compositor handoff while unaffected `handed` hands off.
      expect(gated.animateCalls).toBe(0);
      expect(handed.animateCalls).toBe(1);
      expect(gated.style.visibility).toBe("hidden");
      expect(orbVisible).toBe(false);

      ms = 100;
      view.scrollY = 200;
      frames.tick(100);
      expect(gated.style.visibility).toBe("");
      expect(orbVisible).toBe(true);

      // Even past settle/intro, an engine-driven scroll change updates visibility cleanly.
      ms = 2500;
      view.scrollY = 350;
      frames.tick(2500);
      expect(gated.style.visibility).toBe("hidden");
      expect(orbVisible).toBe(false);

      mounted.dispose();
    });
  });

  it("merges Binder.counts for 3D list objects, passes checks: true, and saves counts in Measurement", async () => {
    await withDomGlobals(() => {
      const docTimeline = new FakeTimeline();
      const label = new FakeDomNode("label", docTimeline);
      const { view, root } = makeDomHarness(docTimeline, [label]);
      const frames = fakeFrames();

      const partPoses: (readonly (Pose3d | undefined)[])[] = [];
      let latestVisible = true;
      const crumbsBinder: Binder = {
        claims: (name) => name === "crumbs",
        counts: () => ({ crumbs: 3 }),
        start: (player) =>
          player.subscribe("crumbs", (value) => {
            latestVisible = frameVisible(player.values)?.["crumbs"] ?? true;
            partPoses.push([0, 1, 2].map((i) => listPose3d(value, i, 3)));
          }),
      };

      const spin = beat("spin", 1000);
      const scene = sceneBuilder({ length: 1000 })
        .element(box("label"))
        .element(object("crumbs", { parts: true }))
        .motion(
          stagger(
            motion((t): Pose3d => ({ z: 2 * t.progress })),
            { spread: 1 },
          ).in(spin),
        )
        .show([scrollPoint(50), scrollPoint(500)]);

      const mounted = mount(scene, {
        root,
        scrollTarget: view,
        frames,
        clock: "timed",
        checks: true,
        binders: [crumbsBinder],
      });

      expect(isClock(mounted.driver)).toBe(true);
      if (isClock(mounted.driver)) mounted.driver.seek(0.5);
      expect(latestVisible).toBe(false);
      expect(partPoses.at(-1)?.map((p) => p?.z)).toEqual([2, 1, 0]);
      expect(mounted.measure().counts).toEqual({ crumbs: 3 });

      mounted.dispose();

      // Also verify live mount drives bindEach and updates scroll visibility on live scroll events.
      const livePoses: (readonly (Pose3d | undefined)[])[] = [];
      let liveVisible = true;
      const liveBinder: Binder = {
        claims: (name) => name === "crumbs",
        counts: () => ({ crumbs: 3 }),
        start: (player) =>
          player.subscribe("crumbs", (value) => {
            liveVisible = frameVisible(player.values)?.["crumbs"] ?? true;
            livePoses.push([0, 1, 2].map((i) => listPose3d(value, i, 3)));
          }),
      };
      const liveScene = sceneBuilder({ length: 1000 })
        .element(box("label"))
        .element(object("crumbs", { parts: true }))
        .motion(
          stagger(
            motion((t): Pose3d => ({ z: 2 * t.progress })),
            { spread: 1 },
          ).in(spin),
        )
        .show([scrollPoint(50), scrollPoint(500)]);

      const liveMounted = mount(liveScene, {
        root,
        scrollTarget: view,
        frames,
        clock: "live",
        checks: true,
        binders: [liveBinder],
      });
      expect(liveVisible).toBe(false);
      view.scrollY = 200;
      frames.tick(500);
      expect(liveVisible).toBe(true);
      expect(livePoses.at(-1)?.every((p) => p !== undefined)).toBe(true);
      liveMounted.dispose();
    });
  });
});
