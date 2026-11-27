import { createElement, type FC, type RefObject } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { inputLog, inputs, motion, state, type Pose2d, type Time } from "@gerak/core";
import {
  liveClock,
  type FrameSource,
  type LiveClock,
  type PageElement,
  type PageRoot,
  type PageStyle,
} from "@gerak/dom";
import { manualDriver } from "@gerak/player";
import { box, scene } from "@gerak/stage";
import { Stage, useMount, usePlayer, useSignal } from "../src/index";

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
  setProperty(): void {}
  removeProperty(): void {}
}

class FakeNode implements PageElement {
  readonly style = new FakeStyle();
  textContent: string | null = "";
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 100;
  offsetHeight = 40;
  constructor(readonly cast: string) {}
  addEventListener(): void {}
  removeEventListener(): void {}
}

class FakeRoot implements PageRoot {
  constructor(readonly nodes: readonly FakeNode[]) {}
  querySelector(selector: string): PageElement | null {
    return this.nodes.find((node) => selector === `[data-cast="${node.cast}"]`) ?? null;
  }
  querySelectorAll(selector: string): readonly PageElement[] {
    return this.nodes.filter((node) => selector === `[data-cast="${node.cast}"]`);
  }
}

const NO_FRAMES: FrameSource = { requestFrame: () => 1, cancelFrame: () => undefined };

describe("Slice 3 foundation react contracts", () => {
  it("useSignal reads initial value synchronously on first render via useSyncExternalStore", async () => {
    const tapInputs = inputs({ triggers: { tap: {} } });
    const log = inputLog();
    const driver = { ...manualDriver({ durationMs: 1000 }), input: () => log.input };
    const createDriver = () => driver;
    const taps = state(10, (count, event) => (event.name === "tap" ? count + 1 : count));
    const basicScene = (time: Time) => ({ box: { x: time.progress * 10 } });

    const seen: (number | undefined)[] = [];
    const Probe: FC = () => {
      const playing = usePlayer(basicScene, createDriver);
      seen.push(useSignal(playing?.player, taps));
      return null;
    };

    await act(() => {
      create(createElement(Probe));
    });
    // First render has no player yet (undefined), second render (once player exists) gets 10 synchronously.
    expect(seen).toEqual([undefined, 10]);

    log.trigger(100, tapInputs, "tap");
    await act(() => driver.seekMs(200));
    expect(seen.at(-1)).toBe(11);
  });

  it("useMount mounts onto an existing ref with no wrapper div, swaps same signature, and only remounts when options change", async () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    let mounts = 0;

    const slid = (x: number, length = 1000) =>
      scene({ length }, box("card").moves(motion((): Pose2d => ({ x }))));

    const Probe: FC<{
      readonly x: number;
      readonly length?: number;
      readonly checks?: boolean;
    }> = ({ x, length = 1000, checks = false }) => {
      const ref: RefObject<FakeRoot | null> = { current: root };
      useMount(ref, slid(x, length), {
        clock: "timed",
        frames: NO_FRAMES,
        checks,
        onDriver: () => {
          mounts += 1;
        },
      });
      return createElement("section", null, "content");
    };

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Probe, { x: 10 }));
    });
    expect(mounts).toBe(1);
    expect(card.style.transform).toBe("translate3d(10px, 0px, 0px)");
    expect(renderer?.toJSON()).toEqual({ type: "section", props: {}, children: ["content"] });

    // Inline options literal with same field values + same signature scene -> replace without remount.
    await act(() => {
      renderer?.update(createElement(Probe, { x: 40 }));
    });
    expect(mounts).toBe(1);
    expect(card.style.transform).toBe("translate3d(40px, 0px, 0px)");

    // Option value actually changes -> must cleanly remount.
    await act(() => {
      renderer?.update(createElement(Probe, { x: 50, checks: true }));
    });
    expect(mounts).toBe(2);
    expect(card.style.transform).toBe("translate3d(50px, 0px, 0px)");

    await act(() => renderer?.unmount());
    expect(card.style.transform).toBe("");
  });

  it("<Stage> uses useMount and remounts when options change cleanly", async () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    let mounts = 0;
    const s = scene({ length: 1000 }, box("card").moves(motion((): Pose2d => ({ x: 15 }))));

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(
        createElement(Stage, {
          scene: s,
          options: { clock: "timed", frames: NO_FRAMES, onDriver: () => (mounts += 1) },
        }),
        { createNodeMock: () => root },
      );
    });
    expect(mounts).toBe(1);

    await act(() => {
      renderer?.update(
        createElement(Stage, {
          scene: s,
          options: {
            clock: "timed",
            frames: NO_FRAMES,
            settleMs: 3000,
            onDriver: () => (mounts += 1),
          },
        }),
      );
    });
    expect(mounts).toBe(2);
    await act(() => renderer?.unmount());
  });

  it("clears useSignal cache when player toggles to undefined and back without flashing stale values", async () => {
    const tapInputs = inputs({ triggers: { tap: {} } });
    const log = inputLog();
    const driver = { ...manualDriver({ durationMs: 1000 }), input: () => log.input };
    const taps = state(0, (count, event) => (event.name === "tap" ? count + 1 : count));
    const seen: (number | undefined)[] = [];
    const basicScene = (time: Time) => ({ x: time.progress * 10 });
    const createDriver = () => driver;
    const Probe: FC<{ readonly active: boolean }> = ({ active }) => {
      const playing = usePlayer(basicScene, createDriver);
      const val = useSignal(active ? playing?.player : undefined, taps);
      seen.push(val);
      return null;
    };

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Probe, { active: true }));
    });
    expect(seen.at(-1)).toBe(0);

    await act(() => {
      renderer?.update(createElement(Probe, { active: false }));
    });
    expect(seen.at(-1)).toBeUndefined();

    // Advance event log while detached, then re-attach same player.
    log.trigger(100, tapInputs, "tap");
    driver.seekMs(200);
    await act(() => renderer?.update(createElement(Probe, { active: true })));
    expect(seen.at(-1)).toBe(1);
    await act(() => renderer?.unmount());
  });

  it("useMount compares a handed liveClock by identity across re-renders", async () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    const clockA = liveClock({ frames: NO_FRAMES, now: () => 0 });
    const clockB = liveClock({ frames: NO_FRAMES, now: () => 0 });
    let mounts = 0;

    const slid = (x: number) => scene(box("card").moves(motion((): Pose2d => ({ x }))));
    const Probe: FC<{ readonly x: number; readonly clock: LiveClock }> = ({ x, clock }) => {
      const ref: RefObject<FakeRoot | null> = { current: root };
      useMount(ref, slid(x), {
        clock: { kind: "driver", driver: clock },
        onDriver: () => {
          mounts += 1;
        },
      });
      return null;
    };

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Probe, { x: 10, clock: clockA }));
    });
    expect(mounts).toBe(1);

    await act(() => {
      renderer?.update(createElement(Probe, { x: 30, clock: clockA }));
    });
    expect(mounts).toBe(1);
    expect(card.style.transform).toBe("translate3d(30px, 0px, 0px)");

    await act(() => {
      renderer?.update(createElement(Probe, { x: 30, clock: clockB }));
    });
    expect(mounts).toBe(2);

    await act(() => renderer?.unmount());
    clockA.dispose();
    clockB.dispose();
  });
});
