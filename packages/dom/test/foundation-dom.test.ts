import {
  INPUT_EVENTS,
  baselineOf,
  createStore,
  liveAt,
  motion,
  pointer,
  scroll,
  snapshot,
  springTo,
  state,
  toCubics,
  withStore,
  type MotionEvent,
  type Pose2d,
  type Time,
} from "@gerak/core";
import {
  beat,
  box,
  carry,
  compileScene,
  formatStageError,
  restReader,
  scene,
  scrollPoint,
  shape,
  type Scene,
  type Stage,
} from "@gerak/stage";
import { placementOf } from "@gerak/stage/render";
import {
  BINDER_CASTS,
  eventDriver,
  mount,
  type Binder,
  type FrameSource,
  type PageElement,
  type PageRoot,
  type PageScrollTarget,
  type PageStyle,
  type StageEvent,
} from "@gerak/dom";
import { afterEach, describe, expect, it } from "vitest";
import { scrollTracks, triggerTracks } from "../src/compositor";

function compiled(piece: Scene): Stage {
  const result = compileScene(piece);
  if (!result.ok) throw new Error(result.errors.map(formatStageError).join("\n"));
  return result.stage;
}

class FakeNode implements PageElement {
  readonly style: PageStyle = {};
  readonly attributes = new Map<string, string>();
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  textContent: string | null = null;
  children: FakeNode[] = [];
  childNodes: FakeNode[] = [];
  parentElement: unknown = undefined;
  ownerDocument: unknown = undefined;
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 100;
  offsetHeight = 40;
  ownerSVGElement: unknown = undefined;
  private rectOverride:
    | (() => {
        readonly left: number;
        readonly top: number;
        readonly right?: number;
        readonly bottom?: number;
        readonly width: number;
        readonly height: number;
      })
    | undefined;

  constructor(castName?: string) {
    if (castName !== undefined) this.attributes.set("data-cast", castName);
  }

  setRect(
    getter: () => {
      readonly left: number;
      readonly top: number;
      readonly right?: number;
      readonly bottom?: number;
      readonly width: number;
      readonly height: number;
    },
  ): void {
    this.rectOverride = getter;
  }

  getBoundingClientRect() {
    if (this.rectOverride !== undefined) return this.rectOverride();
    return {
      left: this.offsetLeft,
      top: this.offsetTop,
      right: this.offsetLeft + this.offsetWidth,
      bottom: this.offsetTop + this.offsetHeight,
      width: this.offsetWidth,
      height: this.offsetHeight,
    };
  }

  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }

  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }

  getAttribute(name: string): string | null {
    return this.attributes.get(name) ?? null;
  }

  addEventListener(type: string, listener: (event: StageEvent) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string, event: StageEvent = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }
}

class FakeRoot implements PageRoot {
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  readonly defaultView: FakeScrollTarget | undefined;

  constructor(
    readonly nodes: readonly FakeNode[],
    view?: FakeScrollTarget,
  ) {
    this.defaultView = view;
    for (const node of nodes) node.ownerDocument = this;
  }

  querySelector(selector: string): unknown {
    return this.querySelectorAll(selector)[0];
  }

  querySelectorAll(selector: string): readonly FakeNode[] {
    const match = /^\[data-cast="([^"]+)"\]$/.exec(selector);
    if (match === null) return [];
    const name = match[1];
    return this.nodes.filter((node) => node.getAttribute("data-cast") === name);
  }

  addEventListener(type: string, listener: (event: StageEvent) => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fire(type: string, event: StageEvent = {}): void {
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
  }

  listenerCount(type: string): number {
    return this.listeners.get(type)?.size ?? 0;
  }
}

class FakeScrollTarget implements PageScrollTarget {
  scrollY = 0;
  scrollX = 0;
  innerWidth = 1000;
  innerHeight = 800;
  readonly listeners = new Map<string, Set<() => void>>();

  addEventListener(type: string, listener: () => void): void {
    const set = this.listeners.get(type) ?? new Set();
    set.add(listener);
    this.listeners.set(type, set);
  }

  removeEventListener(type: string, listener: () => void): void {
    this.listeners.get(type)?.delete(listener);
  }

  fireScroll(): void {
    for (const listener of [...(this.listeners.get("scroll") ?? [])]) listener();
  }
}

function fakeFrames(): FrameSource & { tick(time: number): void; readonly pending: number } {
  let queued = new Map<number, (time: number) => void>();
  let next = 1;
  return {
    requestFrame(listener) {
      queued.set(next, listener);
      return next++;
    },
    cancelFrame(handle) {
      queued.delete(handle);
    },
    tick(time: number) {
      const due = [...queued.values()];
      queued = new Map();
      for (const listener of due) listener(time);
    },
    get pending() {
      return queued.size;
    },
  };
}

describe("Slice 4 foundation: @gerak/dom retention, coalescing, routing, SVG placement, binder casts, probe isolation", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, BINDER_CASTS);
  });

  it("uses bounded live retention by default on live mounts while streaming all events and preserving baselines", () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    const scrollTarget = new FakeScrollTarget();
    const frames = fakeFrames();
    let ms = 0;
    const streamed: MotionEvent[] = [];

    const piece = scene(
      { length: 1000 },
      box("card").moves(motion((t, ctx): Pose2d => ({ x: scroll.y(t, ctx?.events ?? []) }))),
    );
    const mounted = mount(piece, {
      root,
      scrollTarget,
      frames,
      clock: "live",
      settleMs: 500,
      now: () => ms,
      onEvent: (event) => streamed.push(event),
    });

    scrollTarget.scrollY = 240;
    ms = 50;
    scrollTarget.fireScroll();
    frames.tick(50);

    for (let i = 1; i <= 10_500; i += 1) {
      ms = 100 + i;
      mounted.send("tick-ping", i, "card");
    }
    frames.tick(ms);

    expect(streamed.length).toBeGreaterThanOrEqual(10_501);
    expect(mounted.events().length).toBeLessThanOrEqual(4100);
    expect(baselineOf(mounted.events())?.get(INPUT_EVENTS.scroll)).toBe(240);
    expect(card.style.transform).toBe("translate3d(240px, 0px, 0px)");

    mounted.dispose();
  });

  it("retains full history on timed mounts and when retention is all", () => {
    const a = new FakeNode("card");
    const rootA = new FakeRoot([a]);
    const framesA = fakeFrames();
    let msA = 0;
    const piece = scene({ length: 1000 }, box("card"));

    const timedMount = mount(piece, {
      root: rootA,
      frames: framesA,
      clock: "timed",
      now: () => msA,
    });
    for (let i = 0; i < 5000; i += 1) {
      msA += 1;
      timedMount.send("step", i, "card");
    }
    expect(timedMount.events().length).toBe(5000);
    timedMount.dispose();

    const b = new FakeNode("card");
    const rootB = new FakeRoot([b]);
    let msB = 0;
    const allMount = mount(piece, {
      root: rootB,
      frames: fakeFrames(),
      clock: "live",
      retention: { kind: "all" },
      now: () => msB,
    });
    for (let i = 0; i < 5000; i += 1) {
      msB += 10;
      allMount.send("step", i, "card");
    }
    expect(allMount.events().length).toBe(5000);
    allMount.dispose();
  });

  it("bounds layout remeasure history across remeasure() on live mounts while retaining recent carry and all under retention all", () => {
    const liveCard = new FakeNode("card");
    const liveRoot = new FakeRoot([liveCard]);
    const liveFrames = fakeFrames();
    let ms = 0;
    const piece = scene({ length: 1000 }, box("card").moves(carry({ ms: 25_000, mode: "keep" })));

    const liveMounted = mount(piece, {
      root: liveRoot,
      frames: liveFrames,
      clock: "live",
      settleMs: 500,
      now: () => ms,
    });

    for (let i = 1; i <= 500; i += 1) {
      ms = i * 40;
      liveCard.offsetLeft = i === 500 ? 500 : i;
      liveMounted.remeasure();
    }
    // Wait out intermediate jumps before window (0..16000); at t = 20000 with last change at 20000,
    // carry looks from 19960..20000; a fresh jump from compacted baseline settles cleanly.
    liveFrames.tick(ms);
    expect(liveCard.style.transform).not.toBe("");

    // Advance past windowMs (4000ms) with a single jump at t = 0 retained only in "all" mode:
    const box1 = new FakeNode("card");
    const root1 = new FakeRoot([box1]);
    const frames1 = fakeFrames();
    let t1 = 0;
    const bounded = mount(piece, {
      root: root1,
      frames: frames1,
      clock: "live",
      settleMs: 500,
      now: () => t1,
    });
    t1 = 100;
    box1.offsetLeft = 200;
    bounded.remeasure();
    t1 = 10_000;
    box1.offsetLeft = 200;
    bounded.remeasure();
    // Advance ms with another change, forcing compaction before t = 6000
    t1 = 10_100;
    box1.offsetLeft = 300;
    bounded.remeasure();
    // At t = 15_000, all measurements before 11_000 (the 0 -> 200 -> 300 jumps) compacted down to baseline 300.
    t1 = 15_000;
    box1.offsetLeft = 300;
    bounded.remeasure();
    frames1.tick(15_000);

    const box2 = new FakeNode("card");
    const root2 = new FakeRoot([box2]);
    const frames2 = fakeFrames();
    let t2 = 0;
    const retainedAll = mount(piece, {
      root: root2,
      frames: frames2,
      clock: "live",
      settleMs: 500,
      retention: { kind: "all" },
      now: () => t2,
    });
    t2 = 100;
    box2.offsetLeft = 200;
    retainedAll.remeasure();
    t2 = 10_100;
    box2.offsetLeft = 300;
    retainedAll.remeasure();
    t2 = 15_000;
    frames2.tick(15_000);

    // Bounded live forgot the intermediate jump at t = 100/10100 outside its 4000ms live window -> settled (0px);
    // retention: "all" with ms = 25000 still interpolates from the historical jump -> negative x offset toward earlier rest.
    expect(box1.style.transform).toBe("");
    expect(box2.style.transform).not.toBe("");

    liveMounted.dispose();
    bounded.dispose();
    retainedAll.dispose();
  });

  it("coalesces burst scroll and pointermove events to at most one sample per rAF tick", () => {
    const tracker = new FakeNode("tracker");
    const scrollTarget = new FakeScrollTarget();
    const root = new FakeRoot([tracker], scrollTarget);
    const frames = fakeFrames();
    let ms = 0;
    let sceneRuns = 0;
    const streamed: MotionEvent[] = [];

    const piece = scene(
      { length: 1000 },
      box("tracker").moves(
        motion((t, ctx): Pose2d => {
          sceneRuns += 1;
          const events = ctx?.events ?? [];
          return { x: pointer.x(t, events) * 100, y: scroll.y(t, events) };
        }),
      ),
    );
    const mounted = mount(piece, {
      root,
      scrollTarget,
      frames,
      clock: "live",
      now: () => ms,
      onEvent: (event) => streamed.push(event),
    });

    expect(sceneRuns).toBe(1);
    streamed.length = 0;

    for (let i = 1; i <= 20; i += 1) {
      ms = i;
      scrollTarget.scrollY = i * 15;
      scrollTarget.fireScroll();
      root.fire("pointermove", { clientX: i * 40, clientY: 120 });
    }

    expect(sceneRuns).toBe(1);
    expect(streamed.length).toBe(0);

    frames.tick(ms);
    expect(sceneRuns).toBe(2);
    expect(streamed.filter((event) => event.name === INPUT_EVENTS.scroll)).toEqual([
      { name: INPUT_EVENTS.scroll, at: 20, value: 300 },
    ]);
    expect(streamed.filter((event) => event.name === INPUT_EVENTS.pointerX)).toEqual([
      { name: INPUT_EVENTS.pointerX, at: 20, value: 0.8 },
    ]);
    expect(streamed.filter((event) => event.name === INPUT_EVENTS.pointerY)).toEqual([
      { name: INPUT_EVENTS.pointerY, at: 20, value: 0.15 },
    ]);
    expect(tracker.style.transform).toBe("translate3d(80px, 300px, 0px)");

    mounted.dispose();
  });

  it("attaches pointermove listener lazily only when the scene reads pointer", () => {
    const a = new FakeNode("card");
    const rootScroll = new FakeRoot([a]);
    const scrollOnly = scene(
      { length: 1000 },
      box("card").moves(motion((t, ctx): Pose2d => ({ y: scroll.y(t, ctx?.events ?? []) }))),
    );
    const mScroll = mount(scrollOnly, {
      root: rootScroll,
      frames: fakeFrames(),
      clock: "live",
      now: () => 0,
    });
    expect(rootScroll.listenerCount("pointermove")).toBe(0);

    const b = new FakeNode("card");
    const rootPointer = new FakeRoot([b]);
    const pointerPiece = scene(
      { length: 1000 },
      box("card").moves(motion((t, ctx): Pose2d => ({ x: pointer.x(t, ctx?.events ?? []) }))),
    );
    const mPointer = mount(pointerPiece, {
      root: rootPointer,
      frames: fakeFrames(),
      clock: "live",
      now: () => 0,
    });
    expect(rootPointer.listenerCount("pointermove")).toBe(1);

    mPointer.replace(scrollOnly);
    expect(rootPointer.listenerCount("pointermove")).toBe(0);

    mPointer.replace(pointerPiece);
    expect(rootPointer.listenerCount("pointermove")).toBe(1);

    mPointer.dispose();
    expect(rootPointer.listenerCount("pointermove")).toBe(0);
    mScroll.dispose();
  });

  it("routes scroll, pointer, and discrete event ticks only to elements reading that channel", () => {
    const sNode = new FakeNode("scroller");
    const pNode = new FakeNode("tracker");
    const eNode = new FakeNode("reactor");
    const scrollTarget = new FakeScrollTarget();
    const root = new FakeRoot([sNode, pNode, eNode], scrollTarget);
    const frames = fakeFrames();
    let ms = 0;

    let sRuns = 0;
    let pRuns = 0;
    let eRuns = 0;

    const piece = scene(
      { length: 1000 },
      box("scroller").moves(
        motion((t, ctx): Pose2d => {
          sRuns += 1;
          return { y: scroll.y(t, ctx?.events ?? []) };
        }),
      ),
      box("tracker").moves(
        motion((t, ctx): Pose2d => {
          pRuns += 1;
          return { x: pointer.x(t, ctx?.events ?? []) * 100 };
        }),
      ),
      box("reactor").moves(
        motion((_t, ctx): Pose2d => {
          eRuns += 1;
          const ping = (ctx?.events ?? []).findLast((ev) => ev.name === "ping");
          return { opacity: ping === undefined ? 1 : 0.5 };
        }),
      ),
    );

    const mounted = mount(piece, {
      root,
      scrollTarget,
      frames,
      clock: "live",
      now: () => ms,
    });

    expect([sRuns, pRuns, eRuns]).toEqual([1, 1, 1]);

    ms = 16;
    scrollTarget.scrollY = 120;
    scrollTarget.fireScroll();
    frames.tick(16);
    expect([sRuns, pRuns, eRuns]).toEqual([2, 1, 1]);

    ms = 32;
    root.fire("pointermove", { clientX: 500, clientY: 100 });
    frames.tick(32);
    expect([sRuns, pRuns, eRuns]).toEqual([2, 2, 1]);

    ms = 48;
    mounted.send("ping", 1, "reactor");
    frames.tick(48);
    expect([sRuns, pRuns, eRuns]).toEqual([2, 2, 2]);

    mounted.dispose();
  });

  it("preserves BoxPlacement and offsets drawPaths rest boxes by ownerSVGElement bounding rect", () => {
    const prevElement = Reflect.get(globalThis, "Element");
    const prevComputed = Reflect.get(globalThis, "getComputedStyle");
    Reflect.set(globalThis, "Element", FakeNode);
    Reflect.set(globalThis, "getComputedStyle", () => ({
      position: "fixed",
      top: "auto",
      marginBottom: "0px",
      paddingBottom: "0px",
      borderBottomWidth: "0px",
    }));
    try {
      const svg = new FakeNode();
      svg.setRect(() => ({ left: 40, top: 30, right: 240, bottom: 130, width: 200, height: 100 }));
      const ribbon = new FakeNode("ribbon");
      ribbon.ownerSVGElement = svg;
      ribbon.style.position = "fixed";
      const scrollTarget = new FakeScrollTarget();
      scrollTarget.scrollY = 120;
      const root = new FakeRoot([ribbon], scrollTarget);

      const piece = scene(
        { length: 500 },
        shape("ribbon", () => {
          const still = { inX: 0, inY: 0, outX: 0, outY: 0 };
          return toCubics([
            { id: "a", x: 0, y: 0, ...still },
            { id: "b", x: 100, y: 20, ...still },
          ]);
        }),
      );

      const mounted = mount(piece, {
        root,
        scrollTarget,
        frames: fakeFrames(),
        clock: "live",
        now: () => 0,
      });

      const box = mounted.rest["ribbon"];
      expect(box).toEqual({
        x: 90,
        y: 40,
        width: 100,
        height: 20,
        placement: { kind: "fixed" },
      });
      expect(placementOf(box!)).toEqual({ kind: "fixed" });
      mounted.dispose();
    } finally {
      if (prevElement === undefined) Reflect.deleteProperty(globalThis, "Element");
      else Reflect.set(globalThis, "Element", prevElement);
      if (prevComputed === undefined) Reflect.deleteProperty(globalThis, "getComputedStyle");
      else Reflect.set(globalThis, "getComputedStyle", prevComputed);
    }
  });

  it("deduplicates BINDER_CASTS per root across failing and succeeding mounts", () => {
    const missingScene = scene({ length: 500 }, box("missing"));
    const okScene = scene({ length: 500 }, box("hero"));

    const rootA = new FakeRoot([new FakeNode("hero")]);
    const rootB = new FakeRoot([new FakeNode("hero")]);

    const binderA1: Binder = {
      claims: () => false,
      start: () => () => undefined,
      casts: () => ({ cubeA: "single" }),
    };
    const binderA2: Binder = {
      claims: () => false,
      start: () => () => undefined,
      casts: () => ({ cubeA: "list" }),
    };
    const binderB: Binder = {
      claims: () => false,
      start: () => () => undefined,
      casts: () => ({ cubeB: "single" }),
    };

    expect(() =>
      mount(missingScene, {
        root: rootA,
        frames: fakeFrames(),
        clock: "live",
        binders: [binderA1],
      }),
    ).toThrow();
    expect(() =>
      mount(missingScene, {
        root: rootA,
        frames: fakeFrames(),
        clock: "live",
        binders: [binderA2],
      }),
    ).toThrow();

    const afterTwiceA: unknown = Reflect.get(globalThis, BINDER_CASTS);
    expect(Array.isArray(afterTwiceA)).toBe(true);
    if (Array.isArray(afterTwiceA)) expect(afterTwiceA).toHaveLength(1);

    expect(() =>
      mount(missingScene, { root: rootB, frames: fakeFrames(), clock: "live", binders: [binderB] }),
    ).toThrow();
    const afterB: unknown = Reflect.get(globalThis, BINDER_CASTS);
    expect(Array.isArray(afterB)).toBe(true);
    if (Array.isArray(afterB)) expect(afterB).toHaveLength(2);

    const mountedA = mount(okScene, {
      root: rootA,
      frames: fakeFrames(),
      clock: "live",
      binders: [binderA2],
    });
    const afterOkA: unknown = Reflect.get(globalThis, BINDER_CASTS);
    expect(Array.isArray(afterOkA)).toBe(true);
    if (Array.isArray(afterOkA)) expect(afterOkA).toHaveLength(2);

    mountedA.dispose();
    const afterDisposeA: unknown = Reflect.get(globalThis, BINDER_CASTS);
    expect(Array.isArray(afterDisposeA)).toBe(true);
    if (Array.isArray(afterDisposeA)) expect(afterDisposeA).toHaveLength(1);
  });

  it("isolates scrollTracks and triggerTracks sampling under withProbeStore", () => {
    const follower = state<number>(10, (current, ev) =>
      typeof ev.value === "number" ? ev.value : current,
    );
    const sprung = springTo(follower, (v) => v);
    const range = beat("range", { scroll: [scrollPoint(100), scrollPoint(500)] });
    const trig = beat("trig", 300, { when: scrollPoint(250).reached, back: "stay" });
    const piece = compiled(
      scene(
        { length: 1000 },
        box("scrolled").moves(motion((t): Pose2d => ({ y: t.progress * 100 })).in(range)),
        box("triggered").moves(motion((t): Pose2d => ({ x: t.progress * 50 })).in(trig)),
        box("stateful").moves(
          motion((t, ctx): Pose2d => {
            const events = ctx?.events ?? [];
            const x = sprung(t, events);
            const s = follower(t, events);
            return { x: x + s };
          }),
        ),
      ),
    );

    const callerStore = createStore();
    withStore(callerStore, () => {
      const seed = [{ name: "go", at: 0, value: 10 }];
      sprung(liveAt(0), seed);
      follower(liveAt(0), seed);
    });
    const before = snapshot(callerStore);

    const input = {
      counts: {},
      lines: {},
      rest: restReader(),
      names: new Set(["scrolled", "triggered", "stateful"]),
    };
    withStore(callerStore, () => {
      scrollTracks(piece, input, 1000);
      triggerTracks(piece, input);
    });

    expect(snapshot(callerStore)).toEqual(before);
  });

  it("supports retention compaction and onEvent streaming in eventDriver", () => {
    let ms = 0;
    const frames = fakeFrames();
    const streamed: MotionEvent[] = [];
    const driver = eventDriver({
      frames,
      clock: () => ms,
      settleMs: 200,
      retention: { kind: "live", windowMs: 1000 },
      onEvent: (event) => streamed.push(event),
    });

    for (let i = 1; i <= 3000; i += 1) {
      ms = i;
      driver.emit("tap", "card");
    }

    expect(streamed).toHaveLength(3000);
    expect((driver.events?.() ?? []).length).toBeLessThanOrEqual(1050);
    driver.dispose();
  });

  it("tracks lazy 2D list part inputs for pointermove attachment and per-channel routing", () => {
    const part0 = new FakeNode("items");
    const part1 = new FakeNode("items");
    const scrollTarget = new FakeScrollTarget();
    const root = new FakeRoot([part0, part1], scrollTarget);
    const frames = fakeFrames();
    let ms = 0;

    const piece = scene(
      { length: 1000 },
      box("items", { parts: true }).moves(
        motion((t, ctx): Pose2d => {
          const ev = ctx?.events ?? [];
          return { x: pointer.x(t, ev) * 100 + (ctx?.index ?? 0) * 10, y: scroll.y(t, ev) };
        }),
      ),
    );
    const mounted = mount(piece, { root, scrollTarget, frames, clock: "live", now: () => ms });
    expect(root.listenerCount("pointermove")).toBe(1);

    ms = 50;
    scrollTarget.scrollY = 45;
    scrollTarget.fireScroll();
    frames.tick(ms);
    expect(part0.style.transform).toBe("translate3d(50px, 45px, 0px)");

    ms = 80;
    root.fire("pointermove", { clientX: 800, clientY: 100 });
    frames.tick(ms);
    expect(part0.style.transform).toBe("translate3d(80px, 45px, 0px)");
    expect(part1.style.transform).toBe("translate3d(90px, 45px, 0px)");

    mounted.dispose();
  });

  it("wires window retention into Player and skips redundant rAF scheduling after tick flush", () => {
    const card = new FakeNode("card");
    const scrollTarget = new FakeScrollTarget();
    const root = new FakeRoot([card], scrollTarget);
    const frames = fakeFrames();
    let ms = 0;

    const piece = scene(
      { length: 1000 },
      box("card").moves(motion((t, ctx): Pose2d => ({ y: scroll.y(t, ctx?.events ?? []) }))),
    );
    const mounted = mount(piece, {
      root,
      scrollTarget,
      frames,
      clock: "live",
      settleMs: 100,
      retention: { kind: "window", windowMs: 600, maxCheckpoints: 3 },
      now: () => ms,
    });

    // Advance past introMs cleanly so frame loop rests unless an external input schedules it.
    ms = 1200;
    frames.tick(ms);
    expect(frames.pending).toBe(0);

    // Send event between cp@0 and later cp@1000 / cp@1700, ensuring Player owns window compaction.
    ms = 1000;
    mounted.send("mark", 1, "card");
    frames.tick(1000);
    ms = 1050;
    mounted.send("between", 2, "card");
    ms = 1700;
    frames.tick(1700);
    // Player checkpoint anchor at 1700 with floor=1100 is cp@1000, so event@1050 must still be retained.
    expect(mounted.events().some((ev) => ev.name === "between" && ev.at === 1050)).toBe(true);

    // Flushing a scroll sample in tick() when already settled should not schedule an extra empty rAF.
    ms = 3000;
    scrollTarget.scrollY = 200;
    scrollTarget.fireScroll();
    expect(frames.pending).toBe(1);
    frames.tick(3000);
    expect(frames.pending).toBe(0);

    mounted.dispose();
  });
});
