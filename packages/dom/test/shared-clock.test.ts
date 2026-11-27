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
    expect(frames.pending).toBeLessThanOrEqual(1);
    frames.tick(ms);
    expect(mountedA.player.values["slot-0"]).toEqual({ x: 42 });
    expect(mountedB.player.values["slot-0"]).toEqual({ x: 42 });

    ms = 200;
    mountedA.set(jar, "jar-sealed", 1);
    expect(frames.pending).toBeLessThanOrEqual(1);
    frames.tick(ms);
    expect(mountedA.player.values["lid"]).toMatchObject({ rotation: 90 });
    expect(mountedB.player.values["lid"]).toMatchObject({ rotation: 90 });

    ms = 300;
    view.scrollY = 120;
    view.fireScroll();
    expect(frames.pending).toBeLessThanOrEqual(1);
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
    expect(frames.pending).toBeLessThanOrEqual(1);
    frames.tick(ms);
    expect(mountedB.player.values["slot-1"]).toEqual({ x: 99 });

    mountedB.dispose();
    clock.dispose();
  });
});
