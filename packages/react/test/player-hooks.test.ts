import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import type { RenderTarget } from "@motion5/dom";
import { drop, type Time } from "@motion5/moves";
import { manualDriver, type ManualDriver } from "@motion5/player";
import {
  PlayerHostProvider,
  driverKeeper,
  usePlayer,
  useTarget,
  useValue,
  type DriverKeeper,
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
  const first = (time: Time) => ({ box: { x: time.progress * 100 } });
  const second = (time: Time) => ({ box: { x: time.progress * 200 } });

  function hosted(keeper: DriverKeeper, guard?: PlayerHost["guard"]) {
    let seen: Playing<{ box: { x: number } }, ManualDriver> | undefined;
    const driver = manualDriver({ durationMs: 1000 });
    let disposed = 0;
    const own = (): ManualDriver & { dispose(): void } => ({
      ...driver,
      dispose: () => {
        disposed += 1;
      },
    });
    const Probe: FC<{ scene: typeof first }> = ({ scene }) => {
      seen = usePlayer(scene, own);
      return null;
    };
    const host: PlayerHost = { createDriver: keeper.createDriver, ...(guard ? { guard } : {}) };
    const tree = (scene: typeof first) =>
      createElement(PlayerHostProvider, { value: host }, createElement(Probe, { scene }));
    return {
      tree,
      driver,
      get playing() {
        return seen;
      },
      get disposed() {
        return disposed;
      },
    };
  }

  it("keeps the host's driver and its time when the component leaves and returns, and never disposes it", async () => {
    const probe = hosted(driverKeeper());
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(probe.tree(first));
    });
    const kept = probe.playing?.driver;
    await act(() => probe.playing?.driver.seekMs(400));
    await act(() => renderer?.unmount());
    await act(() => {
      renderer = create(probe.tree(first));
    });
    expect(probe.playing?.driver).toBe(kept);
    expect(probe.playing?.player.time.progress).toBeCloseTo(0.4);
    expect(probe.disposed).toBe(0);
  });

  it("swaps a changed scene in place, keeping the player and the time", async () => {
    const probe = hosted(driverKeeper());
    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(probe.tree(first));
    });
    const player = probe.playing?.player;
    await act(() => probe.playing?.driver.seekMs(500));
    await act(() => renderer?.update(probe.tree(second)));
    expect(probe.playing?.player).toBe(player);
    expect(probe.playing?.player.values.box.x).toBeCloseTo(100);
  });

  it("wraps each scene in the host's guard", async () => {
    let wrapped = 0;
    const probe = hosted(driverKeeper(), (scene) => {
      wrapped += 1;
      return scene;
    });
    await act(() => {
      create(probe.tree(first));
    });
    expect(wrapped).toBe(1);
  });
});
