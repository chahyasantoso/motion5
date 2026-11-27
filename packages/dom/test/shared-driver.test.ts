import { inputs, scroll, value, type Signal } from "@gerak/core";
import { mount } from "@gerak/dom";
import { manualDriver } from "@gerak/player";
import { bind, box, scene } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { FakeNode, FakeRoot, FakeScrollTarget, fakeFrames } from "./fake-page";

const onlyB = inputs({ values: { "only-b": {} } });

describe("mounts sharing one handed driver", () => {
  it("redraws the second mount for a set only it reads after the first live mount has settled", () => {
    let ms = 0;
    const frames = fakeFrames();
    const view = new FakeScrollTarget();
    const mountedA = mount(scene(box("a").moves(bind({ y: scroll.y }))), {
      root: new FakeRoot([new FakeNode("a")], view),
      clock: "live",
      settleMs: 100,
      now: () => ms,
      frames,
    });
    const mountedB = mount(scene(box("b").moves(bind({ x: value(onlyB, "only-b") }))), {
      root: new FakeRoot([new FakeNode("b")], view),
      clock: { kind: "driver", driver: mountedA.driver },
    });

    ms = 500;
    frames.tick(ms);

    ms = 1000;
    mountedB.set(onlyB, "only-b", 77);
    frames.tick(ms);
    expect(mountedB.player.values["b"]).toEqual({ x: 77 });

    mountedB.dispose();
    mountedA.dispose();
  });

  it("steps each mount once per driver step on a handed manual driver when scroll changed", () => {
    const view = new FakeScrollTarget();
    const driver = manualDriver({ durationMs: 1000 });
    const counted =
      (onStep: () => void): Signal<number> =>
      (time, input) => {
        onStep();
        return scroll.y(time, input);
      };
    let stepsA = 0;
    let stepsB = 0;
    const mountedA = mount(scene(box("lid").moves(bind({ y: counted(() => (stepsA += 1)) }))), {
      root: new FakeRoot([new FakeNode("lid")], view),
      clock: { kind: "driver", driver },
    });
    const mountedB = mount(scene(box("lid").moves(bind({ y: counted(() => (stepsB += 1)) }))), {
      root: new FakeRoot([new FakeNode("lid")], view),
      clock: { kind: "driver", driver },
    });

    const beforeA = stepsA;
    const beforeB = stepsB;
    view.scrollY = 150;
    driver.seekMs(100);
    expect(stepsA - beforeA).toBe(1);
    expect(stepsB - beforeB).toBe(1);
    expect(mountedA.player.values["lid"]).toEqual({ y: 150 });
    expect(mountedB.player.values["lid"]).toEqual({ y: 150 });

    mountedB.dispose();
    mountedA.dispose();
  });
});
