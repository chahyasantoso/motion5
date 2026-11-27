import { describe, expect, it } from "vitest";
import { inputs, motion, scroll, state, type Pose2d } from "@gerak/core";
import { clockDriver, liveClock, mount, type FrameSource } from "@gerak/dom";
import { liveClockControl } from "../src/live-clock";
import { bind, box, scene } from "@gerak/stage";
import { FakeNode, FakeRoot, FakeScrollTarget, fakeFrames } from "./fake-page";

function frames(): FrameSource & { run(): void; readonly waiting: number } {
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
    run() {
      const due = queued;
      queued = new Map();
      for (const listener of due.values()) listener(0);
    },
    get waiting() {
      return queued.size;
    },
  };
}

describe("liveClock", () => {
  it("runs from creation, records typed set/trigger inputs, and dedups unchanged values", () => {
    let ms = 1000;
    const source = frames();
    const clock = liveClock({ frames: source, now: () => ms, settleMs: 500 });
    expect(clock.now()).toEqual({ progress: 0, clock: { kind: "live", elapsed: 0 } });
    expect(source.waiting).toBe(0);

    const contract = inputs({ values: { level: {} }, triggers: { ping: { targets: ["card"] } } });
    ms = 1200;
    clock.set(contract, "level", 5);
    expect(source.waiting).toBe(1);
    clock.set(contract, "level", 5);
    ms = 1300;
    clock.trigger(contract, "ping", 1, "card");
    expect(clock.input()).toEqual([
      { kind: "value", name: "level", at: 200, value: 5 },
      { kind: "trigger", name: "ping", at: 300, value: 1, target: "card" },
    ]);
    clock.dispose();
    expect(source.waiting).toBe(0);
  });

  it("keeps asking for frames for settleMs after the latest input, stops, and wakes on later input", () => {
    let ms = 0;
    const source = frames();
    const clock = liveClock({ frames: source, now: () => ms, settleMs: 500 });
    const contract = inputs({ triggers: { go: {} } });
    let steps = 0;
    clock.subscribe(() => {
      steps += 1;
    });

    expect(source.waiting).toBe(0);
    clock.trigger(contract, "go");
    expect(steps).toBe(0);
    expect(source.waiting).toBe(1);

    ms = 400;
    source.run();
    expect(steps).toBe(1);
    expect(source.waiting).toBe(1);

    ms = 600;
    source.run();
    expect(steps).toBe(2);
    expect(source.waiting).toBe(0);

    ms = 1000;
    clock.trigger(contract, "go");
    expect(source.waiting).toBe(1);
    ms = 1100;
    source.run();
    expect(steps).toBe(3);
    expect(source.waiting).toBe(1);

    ms = 1600;
    source.run();
    expect(steps).toBe(4);
    expect(source.waiting).toBe(0);
    clock.dispose();
  });

  it("runs frames for introMs after start and sizes its log window to max(settleMs, 4000)", () => {
    let ms = 0;
    const source = frames();
    const clock = liveClock({ frames: source, now: () => ms, introMs: 800, settleMs: 6000 });
    expect(source.waiting).toBe(1);
    ms = 500;
    source.run();
    expect(source.waiting).toBe(1);
    ms = 900;
    source.run();
    expect(source.waiting).toBe(0);

    const contract = inputs({ values: { level: {} } });
    for (let t = 1000; t <= 20_000; t += 100) {
      ms = t;
      clock.set(contract, "level", t);
    }
    const kept = clock.input().map((entry) => entry.at);
    expect(kept[0]).toBeGreaterThanOrEqual(20_000 - 12_000);
    expect(kept.includes(14_000)).toBe(true);
    clock.dispose();
  });

  it("reads window scroll only while a mount on the clock reads scroll, and tags own scrollTarget with root", () => {
    let ms = 0;
    const f = fakeFrames();
    const view = new FakeScrollTarget();
    const ownTarget = new FakeScrollTarget();
    const clock = liveClock({ now: () => ms, frames: f });
    const ping = inputs({ values: { level: {} } });

    const noScrollPiece = scene(box("card").moves(bind({ x: (t, e) => (e.length > 0 ? 1 : 0) })));
    const scrollPiece = scene(box("scroller").moves(bind({ y: scroll.y })));

    const mountedA = mount(noScrollPiece, {
      root: new FakeRoot([new FakeNode("card")], view),
      clock: { kind: "driver", driver: clock },
    });

    ms = 50;
    view.scrollY = 80;
    clock.set(ping, "level", 1);
    view.scrollYReads = 0;
    f.tick(ms);
    expect(view.scrollYReads).toBe(0);

    const mountedB = mount(scrollPiece, {
      root: new FakeRoot([new FakeNode("scroller")], view),
      clock: { kind: "driver", driver: clock },
    });

    ms = 100;
    view.scrollY = 120;
    view.scrollYReads = 0;
    f.tick(ms);
    expect(view.scrollYReads).toBe(1);

    mountedB.dispose();
    ms = 150;
    view.scrollY = 160;
    view.scrollYReads = 0;
    f.tick(ms);
    expect(view.scrollYReads).toBe(0);
    mountedA.dispose();

    const ownRoot = Object.assign(new FakeRoot([new FakeNode("scroller")], view), {
      id: "panel-b",
    });
    const mountedOwn = mount(scrollPiece, {
      root: ownRoot,
      scrollTarget: ownTarget,
      clock: { kind: "driver", driver: clock },
    });
    ms = 200;
    ownTarget.scrollY = 45;
    ownTarget.fireScroll();
    f.tick(ms);
    expect(
      clock
        .input()
        .some(
          (entry) => entry.name === "scroll" && entry.target === "panel-b" && entry.value === 45,
        ),
    ).toBe(true);
    expect(
      clock
        .input()
        .some(
          (entry) => entry.name === "scroll" && entry.target === undefined && entry.value === 45,
        ),
    ).toBe(false);
    mountedOwn.dispose();
    clock.dispose();
  });

  it("keeps cursors isolated across mounts and steps once per frame on shared clockDriver", () => {
    let ms = 0;
    const f = fakeFrames();
    const view = new FakeScrollTarget();
    const clock = liveClock({ now: () => ms, frames: f });
    const counter = inputs({ triggers: { inc: {} } });
    const countState = state(0, (cur, entry) => (entry.name === "inc" ? cur + 1 : cur));

    const mountedA = mount(scene(box("a").moves(bind({ x: countState }))), {
      root: new FakeRoot([new FakeNode("a")], view),
      clock: { kind: "driver", driver: clock },
    });
    ms = 100;
    clock.trigger(counter, "inc");
    f.tick(ms);

    const mountedB = mount(scene(box("b").moves(bind({ x: countState }))), {
      root: new FakeRoot([new FakeNode("b")], view),
      clock: { kind: "driver", driver: clock },
    });
    expect(mountedA.player.values["a"]).toEqual({ x: 1 });
    expect(mountedB.player.values["b"]).toEqual({ x: 1 });

    ms = 200;
    clock.trigger(counter, "inc");
    f.tick(ms);
    expect(mountedA.player.values["a"]).toEqual({ x: 2 });
    expect(mountedB.player.values["b"]).toEqual({ x: 2 });
    mountedA.dispose();
    mountedB.dispose();
    clock.dispose();

    const timedFrames = fakeFrames();
    const timed = clockDriver({ duration: 1000, frames: timedFrames, reducedMotion: "play" });
    let stepsA = 0;
    let stepsB = 0;
    const timedA = mount(
      scene(
        { length: 1000 },
        box("a").moves(
          motion((t, ctx): Pose2d => {
            stepsA += 1;
            return { y: scroll.y(t, ctx?.events ?? []) };
          }),
        ),
      ),
      { root: new FakeRoot([new FakeNode("a")], view), clock: { kind: "driver", driver: timed } },
    );
    const timedB = mount(
      scene(
        { length: 1000 },
        box("b").moves(
          motion((t, ctx): Pose2d => {
            stepsB += 1;
            return { y: scroll.y(t, ctx?.events ?? []) };
          }),
        ),
      ),
      { root: new FakeRoot([new FakeNode("b")], view), clock: { kind: "driver", driver: timed } },
    );
    stepsA = 0;
    stepsB = 0;
    view.scrollY = 300;
    timedFrames.tick(100);
    expect(stepsA).toBe(1);
    expect(stepsB).toBe(1);
    timedA.dispose();
    timedB.dispose();
    timed.dispose();
  });

  it("treats control hooks as no-ops after dispose and refuses mount on a disposed clock", () => {
    const ms = 0;
    const f = fakeFrames();
    const view = new FakeScrollTarget();
    const clock = liveClock({ now: () => ms, frames: f });
    const ctrl = liveClockControl(clock);
    expect(ctrl).toBeDefined();
    if (ctrl === undefined) return;

    clock.dispose();

    let reads = 0;
    let ticks = 0;
    const stopParticipant = ctrl.addParticipant({
      beforeTick: () => {
        ticks += 1;
      },
      onTick: () => {
        ticks += 1;
      },
      needsFrame: () => true,
    });
    const stopScroll = ctrl.addScrollSource({
      key: view,
      target: undefined,
      read: () => {
        reads += 1;
        return 50;
      },
      readsScroll: () => true,
    });
    ctrl.seedScroll({
      key: view,
      target: undefined,
      read: () => {
        reads += 1;
        return 50;
      },
      readsScroll: () => true,
    });
    ctrl.syncScroll({
      key: view,
      target: undefined,
      read: () => {
        reads += 1;
        return 80;
      },
      readsScroll: () => true,
    });

    expect(reads).toBe(0);
    expect(ticks).toBe(0);
    expect(clock.input()).toEqual([]);
    expect(f.pending).toBe(0);
    stopParticipant();
    stopScroll();

    expect(() =>
      mount(scene(box("a").moves(bind({ y: scroll.y }))), {
        root: new FakeRoot([new FakeNode("a")], view),
        clock: { kind: "driver", driver: clock },
      }),
    ).toThrow(/disposed.*liveClock/i);
  });
});
