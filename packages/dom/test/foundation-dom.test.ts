import {
  INPUT_EVENTS,
  createStore,
  liveAt,
  motion,
  pointer,
  scroll,
  springTo,
  state,
  toCubics,
  withStore,
  type Pose2d,
} from "@gerak/core";
import {
  beat,
  box,
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

describe("Slice 4 foundation: @gerak/dom coalescing, routing, SVG placement, binder casts, probe isolation", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, BINDER_CASTS);
  });

  it("coalesces burst scroll and pointermove events to at most one sample per rAF tick", () => {
    const tracker = new FakeNode("tracker");
    const scrollTarget = new FakeScrollTarget();
    const root = new FakeRoot([tracker], scrollTarget);
    const frames = fakeFrames();
    let ms = 0;
    let sceneRuns = 0;

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
    });

    expect(sceneRuns).toBe(1);

    for (let i = 1; i <= 20; i += 1) {
      ms = i;
      scrollTarget.scrollY = i * 15;
      scrollTarget.fireScroll();
      root.fire("pointermove", { clientX: i * 40, clientY: 120 });
    }

    expect(sceneRuns).toBe(1);

    frames.tick(ms);
    expect(sceneRuns).toBe(2);
    expect(mounted.events().filter((event) => event.name === INPUT_EVENTS.scroll)).toEqual([
      { kind: "value", name: INPUT_EVENTS.scroll, at: 20, value: 300 },
    ]);
    expect(mounted.events().filter((event) => event.name === INPUT_EVENTS.pointerX)).toEqual([
      { kind: "value", name: INPUT_EVENTS.pointerX, at: 20, value: 0.8 },
    ]);
    expect(mounted.events().filter((event) => event.name === INPUT_EVENTS.pointerY)).toEqual([
      { kind: "value", name: INPUT_EVENTS.pointerY, at: 20, value: 0.15 },
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
    const controlStore = createStore();
    const seed = [{ kind: "trigger", name: "go", at: 0, value: 50 }] as const;
    withStore(callerStore, () => {
      sprung(liveAt(100), seed);
      follower(liveAt(100), seed);
    });
    withStore(controlStore, () => {
      sprung(liveAt(100), seed);
      follower(liveAt(100), seed);
    });

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

    const afterCaller = withStore(callerStore, () => ({
      sprung: sprung(liveAt(200), seed),
      follower: follower(liveAt(200), seed),
    }));
    const afterControl = withStore(controlStore, () => ({
      sprung: sprung(liveAt(200), seed),
      follower: follower(liveAt(200), seed),
    }));
    expect(afterCaller).toEqual(afterControl);
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

  it("skips redundant rAF scheduling after tick flush", () => {
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
      now: () => ms,
    });

    // Advance past introMs cleanly so frame loop rests unless an external input schedules it.
    ms = 1200;
    frames.tick(ms);
    expect(frames.pending).toBe(0);

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
