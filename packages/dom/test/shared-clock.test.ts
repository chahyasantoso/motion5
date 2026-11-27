import { elapsedOf, inputs, scroll, triggers, value, type Signal } from "@gerak/core";
import { liveClock, mount } from "@gerak/dom";
import { bind, box, scene } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { FakeNode, FakeRoot, FakeScrollTarget, fakeFrames } from "./fake-page";

const SLOTS = ["slot-0", "slot-1", "slot-2", "slot-3", "slot-4", "slot-5"] as const;

const jar = inputs({
  values: {
    "jar-slot": { targets: SLOTS },
    "jar-sealed": {},
  },
  triggers: {
    "jar-add": {},
    "jar-remove": {},
  },
});

function makePiece() {
  const sealed = value(jar, "jar-sealed");
  const adds = triggers(jar, "jar-add");
  const lidRotation: Signal<number> = (time, input) => sealed(time, input) * 90;
  const addScale: Signal<number> = (time, input) => {
    const now = elapsedOf(time.clock);
    if (now === undefined) return 1;
    return adds(time, input).some((entry) => now - entry.at < 600) ? 2 : 1;
  };
  return scene(
    ...SLOTS.map((slot) => box(slot).moves(bind({ x: value(jar, "jar-slot", slot) }))),
    box("lid").moves(bind({ rotation: lidRotation, y: scroll.y })),
    box("add").moves(bind({ scale: addScale })),
  );
}

function makeRoot(view: FakeScrollTarget): FakeRoot {
  return new FakeRoot(
    [...SLOTS.map((slot) => new FakeNode(slot)), new FakeNode("lid"), new FakeNode("add")],
    view,
  );
}

describe("shared liveClock across mounts", () => {
  it("delivers sets on one tick, schedules one frame, reads scrollY once, and survives dispose", () => {
    let ms = 0;
    const frames = fakeFrames();
    const view = new FakeScrollTarget();
    const clock = liveClock({ now: () => ms, frames });

    const mountedA = mount(makePiece(), {
      root: makeRoot(view),
      clock: { kind: "driver", driver: clock },
    });
    const mountedB = mount(makePiece(), {
      root: makeRoot(view),
      clock: { kind: "driver", driver: clock },
    });

    ms = 100;
    clock.set(jar, "jar-slot", 42, "slot-0");
    expect(frames.pending).toBe(1);
    frames.tick(ms);
    expect(mountedA.player.values["slot-0"]).toEqual({ x: 42 });
    expect(mountedB.player.values["slot-0"]).toEqual({ x: 42 });

    ms = 200;
    mountedA.set(jar, "jar-sealed", 1);
    expect(frames.pending).toBe(1);
    frames.tick(ms);
    expect(mountedA.player.values["lid"]).toMatchObject({ rotation: 90 });
    expect(mountedB.player.values["lid"]).toMatchObject({ rotation: 90 });

    ms = 300;
    view.scrollY = 120;
    view.fireScroll();
    expect(frames.pending).toBe(1);
    view.scrollYReads = 0;
    frames.tick(ms);
    expect(view.scrollYReads).toBe(1);
    expect(mountedA.player.values["lid"]).toEqual({ rotation: 90, y: 120 });
    expect(mountedB.player.values["lid"]).toEqual({ rotation: 90, y: 120 });

    ms = 400;
    view.scrollY = 240;
    view.scrollYReads = 0;
    frames.tick(ms);
    expect(view.scrollYReads).toBe(1);
    expect(mountedA.player.values["lid"]).toEqual({ rotation: 90, y: 240 });
    expect(mountedB.player.values["lid"]).toEqual({ rotation: 90, y: 240 });

    mountedA.dispose();
    ms = 500;
    mountedB.set(jar, "jar-slot", 99, "slot-1");
    expect(frames.pending).toBe(1);
    frames.tick(ms);
    expect(mountedB.player.values["slot-1"]).toEqual({ x: 99 });

    mountedB.dispose();
    clock.dispose();
  });

  it("delivers a set read only by a second mount after the first mount has settled", () => {
    let ms = 0;
    const frames = fakeFrames();
    const view = new FakeScrollTarget();
    const clock = liveClock({ now: () => ms, frames, settleMs: 100 });
    const onlyB = inputs({ values: { "only-b": {} } });

    let runsA = 0;
    const pieceA = scene(
      box("a").moves(
        bind({
          y: (time, input) => {
            runsA += 1;
            return scroll.y(time, input);
          },
        }),
      ),
    );
    const pieceB = scene(box("b").moves(bind({ x: value(onlyB, "only-b") })));

    const mountedA = mount(pieceA, {
      root: new FakeRoot([new FakeNode("a")], view),
      clock: { kind: "driver", driver: clock },
    });
    const mountedB = mount(pieceB, {
      root: new FakeRoot([new FakeNode("b")], view),
      clock: { kind: "driver", driver: clock },
    });

    // Advance past settleMs so both mounts and the shared clock are idle.
    ms = 500;
    frames.tick(ms);
    expect(frames.pending).toBe(0);
    const runsABefore = runsA;

    ms = 1000;
    clock.set(onlyB, "only-b", 77);
    expect(frames.pending).toBe(1);
    frames.tick(ms);

    expect(runsA).toBe(runsABefore);
    expect(mountedB.player.values["b"]).toEqual({ x: 77 });

    mountedA.dispose();
    mountedB.dispose();
    clock.dispose();
  });

  it("steps each mount's player once per frame even when scroll and inputs change together", () => {
    let ms = 0;
    const frames = fakeFrames();
    const view = new FakeScrollTarget();
    const clock = liveClock({ now: () => ms, frames });

    let stepsA = 0;
    let stepsB = 0;
    const sealed = value(jar, "jar-sealed");
    const makeCountedPiece = (onStep: () => void) => {
      const counted: Signal<number> = (time, input) => {
        onStep();
        return scroll.y(time, input) + sealed(time, input) * 90;
      };
      return scene(box("lid").moves(bind({ y: counted })));
    };

    const mountedA = mount(
      makeCountedPiece(() => {
        stepsA += 1;
      }),
      {
        root: new FakeRoot([new FakeNode("lid")], view),
        clock: { kind: "driver", driver: clock },
      },
    );
    const mountedB = mount(
      makeCountedPiece(() => {
        stepsB += 1;
      }),
      {
        root: new FakeRoot([new FakeNode("lid")], view),
        clock: { kind: "driver", driver: clock },
      },
    );

    expect(stepsA).toBe(1);
    expect(stepsB).toBe(1);

    ms = 100;
    view.scrollY = 150;
    view.fireScroll();
    clock.set(jar, "jar-sealed", 1);
    frames.tick(ms);
    expect(stepsA).toBe(2);
    expect(stepsB).toBe(2);
    expect(mountedA.player.values["lid"]).toEqual({ y: 240 });
    expect(mountedB.player.values["lid"]).toEqual({ y: 240 });

    ms = 200;
    view.scrollY = 300;
    frames.tick(ms);
    expect(stepsA).toBe(3);
    expect(stepsB).toBe(3);
    expect(mountedA.player.values["lid"]).toEqual({ y: 390 });
    expect(mountedB.player.values["lid"]).toEqual({ y: 390 });

    mountedA.dispose();
    mountedB.dispose();
    clock.dispose();
  });
});
