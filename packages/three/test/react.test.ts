import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { Object3D } from "three";
import { type Time } from "@motion5/moves";
import { manualDriver, type ManualDriver } from "@motion5/player";
import { usePlayer } from "@motion5/react";
import { useTarget3d } from "../src/react";

const scene = (time: Time) => ({ box: { x: 10 * time.progress, y: 2 } });

function stage() {
  const driver = manualDriver();
  const createDriver = (): ManualDriver => driver;
  const object = new Object3D();
  let renders = 0;
  let invalidations = 0;
  const invalidate = (): void => {
    invalidations += 1;
  };
  const Probe: FC = () => {
    renders += 1;
    const playing = usePlayer(scene, createDriver);
    const ref = useTarget3d(playing?.player, "box", { invalidate });
    return createElement("div", { ref });
  };
  return {
    driver,
    object,
    async mount() {
      let renderer: ReturnType<typeof create> | undefined;
      await act(() => {
        renderer = create(createElement(Probe), { createNodeMock: () => object });
      });
      if (renderer === undefined) throw new Error("Nothing rendered.");
      return renderer;
    },
    get renders() {
      return renders;
    },
    get invalidations() {
      return invalidations;
    },
  };
}

describe("useTarget3d", () => {
  it("writes each step with no render and invalidates once per write", async () => {
    const probe = stage();
    await probe.mount();
    const settled = probe.renders;
    const before = probe.invalidations;
    await act(() => {
      probe.driver.seek(0.5);
    });
    expect(probe.object.position.x).toBeCloseTo(5, 9);
    expect(probe.object.position.y).toBe(2);
    expect(probe.invalidations).toBe(before + 1);
    await act(() => {
      probe.driver.seek(0.8);
    });
    expect(probe.object.position.x).toBeCloseTo(8, 9);
    expect(probe.invalidations).toBe(before + 2);
    expect(probe.renders).toBe(settled);
  });

  it("keeps the position the object had when bound as its rest", async () => {
    const probe = stage();
    probe.object.position.set(0, -3, 1);
    await probe.mount();
    await act(() => {
      probe.driver.seek(0.5);
    });
    expect(probe.object.position.x).toBeCloseTo(5, 9);
    expect(probe.object.position.y).toBe(-1);
    expect(probe.object.position.z).toBe(1);
  });

  it("stops writing after unmount", async () => {
    const probe = stage();
    const renderer = await probe.mount();
    await act(() => {
      probe.driver.seek(0.5);
    });
    await act(() => {
      renderer.unmount();
    });
    const count = probe.invalidations;
    await act(() => {
      probe.driver.seek(0.9);
    });
    expect(probe.object.position.x).toBeCloseTo(5, 9);
    expect(probe.invalidations).toBe(count);
  });
});
