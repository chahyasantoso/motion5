import {
  elapsedOf,
  inputs,
  pageInputs,
  scroll,
  state,
  triggers,
  value,
  type Signal,
} from "@gerak/core";
import { mount } from "@gerak/dom";
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

function isPoseX(value: unknown, expectedX: number): boolean {
  return typeof value === "object" && value !== null && Reflect.get(value, "x") === expectedX;
}

describe("live session soak", () => {
  it("keeps retained input and rule calls per frame bounded across 3 simulated hours at 60 Hz", () => {
    const view = new FakeScrollTarget();
    const root = new FakeRoot(
      [
        ...SLOTS.map((slot) => new FakeNode(slot)),
        new FakeNode("lid"),
        new FakeNode("add"),
        new FakeNode("fold"),
      ],
      view,
    );
    const frames = fakeFrames();
    let ms = 0;
    let ruleCalls = 0;

    const sealed = value(jar, "jar-sealed");
    const adds = triggers(jar, "jar-add");
    const lidRotation: Signal<number> = (time, input) => sealed(time, input) * 90;
    const addScale: Signal<number> = (time, input) => {
      const now = elapsedOf(time.clock);
      if (now === undefined) return 1;
      return adds(time, input).some((entry) => now - entry.at < 600) ? 2 : 1;
    };
    const fold = state(0, (current, entry) => {
      ruleCalls += 1;
      return entry.name === "jar-add" ? current + 1 : current;
    });

    const piece = scene(
      ...SLOTS.map((slot) => box(slot).moves(bind({ x: value(jar, "jar-slot", slot) }))),
      box("lid").moves(bind({ rotation: lidRotation, y: scroll.y })),
      box("add").moves(bind({ scale: addScale })),
      box("fold").moves(bind({ x: fold })),
    );

    const mounted = mount(piece, {
      root,
      frames,
      clock: "live",
      now: () => ms,
    });

    const cookies: number[] = [];
    let nextCookie = 1;
    let direction: 1 | -1 = 1;

    const totalFrames = 3 * 60 * 60 * 60;
    const windowMs = 4000;
    // 60 pointer-x + 60 scroll + 1 trigger + 1 slot set per second, plus at most 10 latest entries.
    const ratePerSec = 122;
    const maxAllowedRetained = (windowMs / 1000) * ratePerSec + 10;

    let maxRetained = 0;
    let prevRetained = mounted.driver.input().length;
    let periodStartFrame = 0;
    let periodStartCalls = ruleCalls;
    let dropCount = 0;

    for (let frame = 1; frame <= totalFrames; frame += 1) {
      ms = Math.round((frame * 1000) / 60);
      mounted.set(pageInputs, "pointer-x", (frame % 100) / 100);
      view.scrollY = frame;

      if (frame % 60 === 0) {
        if (direction === 1 && cookies.length === SLOTS.length) direction = -1;
        else if (direction === -1 && cookies.length === 0) direction = 1;

        if (direction === 1) {
          const idx = cookies.length;
          const cookie = nextCookie;
          nextCookie += 1;
          cookies.push(cookie);
          mounted.trigger(jar, "jar-add");
          const slot = SLOTS[idx];
          if (slot !== undefined) mounted.set(jar, "jar-slot", cookie, slot);
        } else {
          cookies.pop();
          const idx = cookies.length;
          mounted.trigger(jar, "jar-remove");
          const slot = SLOTS[idx];
          if (slot !== undefined) mounted.set(jar, "jar-slot", 0, slot);
        }
      }

      frames.tick(ms);

      const retained = mounted.driver.input().length;
      if (retained > maxRetained) maxRetained = retained;
      if (retained > maxAllowedRetained) {
        expect(retained).toBeLessThanOrEqual(maxAllowedRetained);
      }

      if (retained < prevRetained) {
        const framesInPeriod = frame - periodStartFrame;
        const callsInPeriod = ruleCalls - periodStartCalls;
        const avgCallsPerFrame = callsInPeriod / framesInPeriod;
        expect(avgCallsPerFrame).toBeLessThanOrEqual(retained);
        dropCount += 1;
        periodStartFrame = frame;
        periodStartCalls = ruleCalls;
      }
      prevRetained = retained;

      if (frame % 60 === 0) {
        for (let i = 0; i < SLOTS.length; i += 1) {
          const slot = SLOTS[i];
          if (slot === undefined) continue;
          const expected = { x: cookies[i] ?? 0 };
          const actual = mounted.player.values[slot];
          if (!isPoseX(actual, expected.x) || frame === totalFrames) {
            expect(actual).toEqual(expected);
          }
        }
      }
    }

    expect(maxRetained).toBeLessThanOrEqual(maxAllowedRetained);
    expect(dropCount).toBeGreaterThan(0);

    mounted.dispose();
  });
});
