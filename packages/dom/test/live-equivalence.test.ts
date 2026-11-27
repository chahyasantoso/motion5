// @ts-nocheck
import { elapsedOf, inputs, triggers, value, type Signal } from "@gerak/core";
import { mount } from "@gerak/dom";
import { bind, box, scene } from "@gerak/stage";
import { describe, expect, it } from "vitest";
import { FakeNode, FakeRoot, fakeFrames } from "./fake-page";

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
    box("lid").moves(bind({ rotation: lidRotation })),
    box("add").moves(bind({ scale: addScale })),
  );
}

function makeRoot(): FakeRoot {
  return new FakeRoot([
    ...SLOTS.map((slot) => new FakeNode(slot)),
    new FakeNode("lid"),
    new FakeNode("add"),
  ]);
}

describe("live equivalence across replace and shared driver handoff", () => {
  it("keeps slot values, lid rotation, and settled trigger scale across replace and fresh mount", () => {
    const frames = fakeFrames();
    let ms = 0;
    const rootA = makeRoot();
    const mountedA = mount(makePiece(), {
      root: rootA,
      frames,
      clock: "live",
      now: () => ms,
    });

    const slotPairs: readonly (readonly [(typeof SLOTS)[number], number])[] = [
      ["slot-0", 10],
      ["slot-1", 20],
      ["slot-2", 30],
      ["slot-3", 40],
      ["slot-4", 50],
      ["slot-5", 60],
    ];
    for (const [slot, val] of slotPairs) {
      ms += 50;
      mountedA.set(jar, "jar-slot", val, slot);
      frames.tick(ms);
    }

    ms += 50;
    mountedA.set(jar, "jar-sealed", 1);
    frames.tick(ms);

    ms += 50;
    mountedA.trigger(jar, "jar-add");
    frames.tick(ms);

    const settleUntil = ms + 20_000;
    while (ms < settleUntil) {
      ms += 100;
      if (frames.pending > 0) frames.tick(ms);
    }

    mountedA.replace(makePiece());

    for (const [slot, val] of slotPairs) {
      expect(mountedA.player.values[slot]).toEqual({ x: val });
    }
    expect(mountedA.player.values["lid"]).toEqual({ rotation: 90 });
    expect(mountedA.player.values["add"]).toEqual({ scale: 1 });

    const beforeB = structuredClone(mountedA.player.values);
    const rootB = makeRoot();
    const mountedB = mount(makePiece(), {
      root: rootB,
      frames,
      clock: { kind: "driver", driver: mountedA.driver },
      now: () => ms,
    });

    expect(mountedA.player.values).toEqual(beforeB);
    expect(mountedB.player.values).toEqual(mountedA.player.values);

    mountedB.dispose();
    mountedA.dispose();
  });
});
