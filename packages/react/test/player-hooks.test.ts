import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import type { RenderTarget } from "@motion5/dom";
import { drop, type Time } from "@motion5/moves";
import { manualDriver, type ManualDriver } from "@motion5/player";
import { usePlayer, useTarget, useValue, type Playing } from "@motion5/react";

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
