import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { Object3D } from "three";
import { type Time } from "@gerak/moves";
import { manualDriver, type ManualDriver } from "@gerak/player";
import { usePlayer } from "@gerak/react";
import { useTarget3d } from "../src/react";

const scene = (time: Time) => ({
  box: { x: 10 * time.progress, y: 2 },
  props: [{ x: time.progress }, { x: 20 * time.progress, y: 5 }],
});

function stage(at?: number) {
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
    const ref =
      at === undefined
        ? useTarget3d(playing?.player, "box", { invalidate })
        : useTarget3d(playing?.player, "props", { invalidate, at });
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

  it("binds only the pose at the given index of a list target", async () => {
    const probe = stage(1);
    await probe.mount();
    await act(() => {
      probe.driver.seek(0.5);
    });
    expect(probe.object.position.x).toBeCloseTo(10, 9);
    expect(probe.object.position.y).toBe(5);
  });

  it("writes nothing when the index is past the end of the list", async () => {
    const probe = stage(7);
    probe.object.position.set(3, 3, 3);
    await probe.mount();
    await act(() => {
      probe.driver.seek(0.5);
    });
    expect(probe.object.position.toArray()).toEqual([3, 3, 3]);
  });

  it("throws on a negative or fractional index", async () => {
    await expect(stage(-1).mount()).rejects.toThrow(RangeError);
    await expect(stage(0.5).mount()).rejects.toThrow(RangeError);
  });
});
