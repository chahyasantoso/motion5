import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { clockDriver, type RenderTarget } from "@motion5/dom";
import { drop, type Time } from "@motion5/moves";
import { manualDriver, type ManualDriver } from "@motion5/player";
import {
  PlayerHostProvider,
  driverKeeper,
  usePlayer,
  useTarget,
  useValue,
  type PlayerHost,
  type Playing,
} from "@motion5/react";

const scene = (time: Time) => ({
  box: drop({ distance: 100 }, time),
  phase: { landed: time.progress >= 0.75 ? 1 : 0 },
});

function stage() {
  const driver = manualDriver();
  const createDriver = (): ManualDriver => driver;
  const element: RenderTarget = { style: {} };
  let playing: Playing<ReturnType<typeof scene>, ManualDriver> | undefined;
  let renders = 0;
  let landed: number | undefined;
  const Probe: FC = () => {
    renders += 1;
    playing = usePlayer(scene, createDriver);
    const ref = useTarget(playing?.player, "box");
    landed = useValue(playing?.player, "phase", (phase) => phase.landed);
    return createElement("div", { ref });
  };
  return {
    driver,
    element,
    async mount() {
      let renderer: ReturnType<typeof create> | undefined;
      await act(() => {
        // The element stands in for the DOM node React hands the ref.
        renderer = create(createElement(Probe), { createNodeMock: () => element });
      });
      if (renderer === undefined) throw new Error("Nothing rendered.");
      return renderer;
    },
    get playing() {
      return playing;
    },
    get renders() {
      return renders;
    },
    get landed() {
      return landed;
    },
  };
}

describe("player hooks", () => {
  it("write each step to the element without rendering the component again", async () => {
    const probe = stage();
    await probe.mount();
    const settled = probe.renders;
    await act(() => {
      probe.driver.seek(0.5);
    });
    expect(probe.element.style.transform).toContain("translate3d(0px, -");
    await act(() => {
      probe.driver.seek(0.6);
    });
    expect(probe.renders).toBe(settled);
  });

  it("render again only when a selected value changes", async () => {
    const probe = stage();
    await probe.mount();
    expect(probe.landed).toBe(0);
    await act(() => {
      probe.driver.seek(0.8);
    });
    expect(probe.landed).toBe(1);
  });

  it("release the player and its driver when the component leaves", async () => {
    const probe = stage();
    const renderer = await probe.mount();
    const player = probe.playing?.player;
    await act(() => {
      renderer.unmount();
    });
    const before = JSON.stringify(probe.element.style);
    probe.driver.seek(1);
    expect(JSON.stringify(probe.element.style)).toBe(before);
    expect(player).toBeDefined();
  });
});

describe("useWatch", () => {
  it("logs the events of the element its ref lands on, and stops when the component leaves", async () => {
    const { eventDriver } = await import("@motion5/dom");
    const { useWatch } = await import("@motion5/react");
    const driver = eventDriver({
      clock: () => 0,
      frames: { requestFrame: () => 1, cancelFrame: () => undefined },
    });
    const listeners = new Map<string, () => void>();
    const node = {
      addEventListener: (type: string, listener: () => void) => listeners.set(type, listener),
      removeEventListener: (type: string) => listeners.delete(type),
    };
    const Card: FC = () => createElement("div", { ref: useWatch(driver, "card") });
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Card), { createNodeMock: () => node });
    });
    listeners.get("pointerenter")?.();
    expect(driver.events?.()).toEqual([{ name: "enter", at: 0, target: "card" }]);
    await act(() => renderer?.unmount());
    expect(listeners.size).toBe(0);
  });
});

describe("a page host", () => {
  type Frame = { box: { x: number } };
  const first = (time: Time): Frame => ({ box: { x: time.progress * 100 } });
  const second = (time: Time): Frame => ({ box: { x: time.progress * 200 } });

  /** A scene file as a hot update sees it: every export a fresh identity, with the clock's length as written. */
  function sceneFile(scene: (time: Time) => Frame, durationMs: number, cue = 300) {
    return {
      scene,
      clock: () => manualDriver({ durationMs }),
      cues: [{ name: "hit", at: cue }],
    };
  }

  function hosted(guard?: PlayerHost["guard"]) {
    const keeper = driverKeeper();
    let seen: Playing<Frame, ManualDriver> | undefined;
    const Probe: FC<{ file: ReturnType<typeof sceneFile> }> = ({ file }) => {
      seen = usePlayer(file.scene, file.clock, file.cues);
      return null;
    };
    const host: PlayerHost = { createDriver: keeper.createDriver, ...(guard ? { guard } : {}) };
    const tree = (file: ReturnType<typeof sceneFile>) =>
      createElement(PlayerHostProvider, { value: host }, createElement(Probe, { file }));
    return {
      keeper,
      tree,
      get playing() {
        return seen;
      },
    };
  }

  it("keeps the driver and its time when the component leaves and returns", async () => {
    const probe = hosted();
    const file = sceneFile(first, 1000);
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(probe.tree(file));
    });
    const kept = probe.playing?.driver;
    await act(() => probe.playing?.driver.seekMs(400));
    await act(() => renderer?.unmount());
    await act(() => {
      renderer = create(probe.tree(sceneFile(first, 1000)));
    });
    expect(probe.playing?.driver).toBe(kept);
    expect(probe.playing?.player.time.progress).toBeCloseTo(0.4);
  });

  it("swaps a saved file in place: the same player, driver and time, with the new scene and cues", async () => {
    const probe = hosted();
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(probe.tree(sceneFile(first, 1000)));
    });
    const before = probe.playing;
    const heard: number[] = [];
    before?.player.on("hit", (event) => heard.push(event.at));
    await act(() => before?.driver.seekMs(500));
    await act(() => renderer?.update(probe.tree(sceneFile(second, 1000, 700))));
    expect(probe.playing).toBe(before);
    expect(probe.playing?.player.values.box.x).toBeCloseTo(100);
    await act(() => before?.driver.seekMs(800));
    expect(heard).toEqual([300, 700]);
  });

  it("gives a changed clock a fresh driver at the same ms", async () => {
    const probe = hosted();
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(probe.tree(sceneFile(first, 1000)));
    });
    const old = probe.playing;
    await act(() => old?.driver.seekMs(500));
    await act(() => renderer?.update(probe.tree(sceneFile(first, 2000))));
    expect(probe.playing?.driver).not.toBe(old?.driver);
    expect(probe.keeper.current()).toBe(probe.playing?.driver);
    expect(probe.playing?.driver.now().clock).toEqual({
      kind: "timed",
      elapsed: 500,
      length: 2000,
    });
    expect(probe.playing?.player.values.box.x).toBeCloseTo(25);
  });

  it("gives a clock of another kind a driver of that kind, at the same time, and disposes the old", async () => {
    const keeper = driverKeeper();
    let disposed = 0;
    const manual = keeper.createDriver(() => ({
      ...manualDriver({ durationMs: 1000 }),
      dispose: () => {
        disposed += 1;
      },
    }));
    manual.seekMs(250);
    const clocked = keeper.createDriver(() =>
      clockDriver({ duration: 1000, autoplay: false, frames: NO_FRAMES, reducedMotion: "play" }),
    );
    expect(clocked).not.toBe(manual);
    expect(typeof clocked.replay).toBe("function");
    expect(clocked.now().progress).toBeCloseTo(0.25);
    expect(disposed).toBe(1);
  });

  it("keeps a playing clock playing and a stopped one stopped across a changed clock", () => {
    const keeper = driverKeeper();
    const clock = (duration: number) => () => clockDriver({ duration, frames: NO_FRAMES });
    const first = keeper.createDriver(clock(1000));
    expect(first.playing()).toBe(true);
    const second = keeper.createDriver(clock(2000));
    expect(second).not.toBe(first);
    expect(second.playing()).toBe(true);
    second.seek(0.25);
    const third = keeper.createDriver(clock(3000));
    expect(third.playing()).toBe(false);
    expect(third.now().clock).toEqual({ kind: "timed", elapsed: 500, length: 3000 });
  });

  it("wraps the first scene and every swapped one in the host's guard", async () => {
    const wrapped: unknown[] = [];
    const probe = hosted((scene) => {
      wrapped.push(scene);
      return scene;
    });
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(probe.tree(sceneFile(first, 1000)));
    });
    await act(() => renderer?.update(probe.tree(sceneFile(second, 1000))));
    expect(wrapped).toEqual([first, second]);
  });

  it("still disposes a driver the component made itself when there is no host", async () => {
    let disposed = 0;
    const own = (): ManualDriver & { dispose(): void } => ({
      ...manualDriver(),
      dispose: () => {
        disposed += 1;
      },
    });
    const Bare: FC = () => {
      usePlayer(first, own);
      return null;
    };
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Bare));
    });
    await act(() => renderer?.unmount());
    expect(disposed).toBe(1);
  });
});

const NO_FRAMES = { requestFrame: () => 1, cancelFrame: () => undefined };
