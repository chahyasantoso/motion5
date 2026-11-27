import { StrictMode, createElement, useRef } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { motion, type Pose2d } from "@gerak/core";
import { box, scene } from "@gerak/stage";
import {
  type Binder,
  type FrameSource,
  type PageElement,
  type PageRoot,
  type PageScrollTarget,
  type PageStyle,
} from "@gerak/dom";
import { manualDriver } from "@gerak/player";
import { Stage, useMount, type MountOptionComparators, type StageMountOptions } from "../src/stage";

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

function slid(distance: number, length = 1000) {
  return scene({ length }, box("card").moves(motion((): Pose2d => ({ x: distance }))));
}

describe("<Stage />", () => {
  it("mounts a scene over its children and swaps a same-signature scene in place via replace", async () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    const drivers: unknown[] = [];
    const options = {
      clock: "timed",
      frames: NO_FRAMES,
      onDriver: (driver: unknown) => drivers.push(driver),
    } as const;

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Stage, { scene: slid(10), options }), {
        createNodeMock: () => root,
      });
    });
    expect(card.style.transform).toBe("translate3d(10px, 0px, 0px)");
    expect(drivers).toHaveLength(1);

    await act(() => {
      renderer?.update(createElement(Stage, { scene: slid(75), options }));
    });
    expect(card.style.transform).toBe("translate3d(75px, 0px, 0px)");
    expect(drivers).toHaveLength(1);

    await act(() => {
      renderer?.unmount();
    });
    expect(card.style.transform).toBe("");
  });

  it("remounts when the cast or length changes, and restores the nodes on unmount", async () => {
    const card = new FakeNode("card");
    const extra = new FakeNode("extra");
    const root = new FakeRoot([card, extra]);
    const drivers: unknown[] = [];
    const options = {
      clock: "timed",
      frames: NO_FRAMES,
      onDriver: (driver: unknown) => drivers.push(driver),
    } as const;
    const longer = scene(
      { length: 2000 },
      box("card"),
      box("extra", { parts: true }).moves(motion((): Pose2d => ({ x: 20 }))),
    );

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Stage, { scene: slid(5), options }), {
        createNodeMock: () => root,
      });
    });
    expect(drivers).toHaveLength(1);

    await act(() => {
      renderer?.update(createElement(Stage, { scene: longer, options }));
    });
    expect(drivers).toHaveLength(2);
    expect(extra.style.transform).toBe("translate3d(20px, 0px, 0px)");

    await act(() => {
      renderer?.unmount();
    });
    expect(extra.style.transform).toBe("");
  });

  it("remounts when any compared mount option changes, and keeps the mount when unchanged", async () => {
    const cardA = new FakeNode("card");
    const cardB = new FakeNode("card");
    const root = new FakeRoot([cardA]);
    const framesA: FrameSource = { requestFrame: () => 1, cancelFrame: () => undefined };
    const framesB: FrameSource = { requestFrame: () => 2, cancelFrame: () => undefined };
    const scrollA: PageScrollTarget = {
      scrollY: 0,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    const scrollB: PageScrollTarget = {
      scrollY: 10,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    const nowA = () => 0;
    const nowB = () => 100;
    const viewportA = () => ({ width: 800, height: 600 });
    const viewportB = () => ({ width: 1024, height: 768 });
    const binderA: Binder = { claims: () => false, start: () => () => undefined };
    const binderB: Binder = { claims: () => false, start: () => () => undefined };
    const driverA = manualDriver({ durationMs: 1000 });
    const driverB = manualDriver({ durationMs: 1000 });
    const s = slid(10);
    let mounts = 0;

    const base: StageMountOptions = {
      clock: { kind: "driver", driver: driverA },
      scrollTarget: scrollA,
      frames: framesA,
      settleMs: 1000,
      now: nowA,
      viewport: viewportA,
      checks: false,
      nodes: { card: cardA },
      binders: [binderA],
      onDriver: () => {
        mounts += 1;
      },
    };

    const Probe = ({ options }: { readonly options: StageMountOptions }) => {
      const ref = useRef<PageRoot | null>(root);
      useMount(ref, s, options);
      return null;
    };

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Probe, { options: base }));
    });
    expect(mounts).toBe(1);

    // Fresh object/array literals with identical entries must not remount.
    await act(() => {
      renderer?.update(
        createElement(Probe, {
          options: {
            ...base,
            clock: { kind: "driver", driver: driverA },
            nodes: { card: cardA },
            binders: [binderA],
            onDriver: () => {
              mounts += 1;
            },
          },
        }),
      );
    });
    expect(mounts).toBe(1);

    const variants: readonly StageMountOptions[] = [
      { ...base, clock: { kind: "driver", driver: driverB } },
      { ...base, clock: "timed" },
      { ...base, frame: "page" },
      { ...base, scrollTarget: scrollB },
      { ...base, frames: framesB },
      { ...base, settleMs: 2000 },
      { ...base, now: nowB },
      { ...base, viewport: viewportB },
      { ...base, checks: true },
      { ...base, nodes: { card: cardB } },
      { ...base, binders: [binderB] },
    ];
    let expected = 1;
    for (const next of variants) {
      expected += 1;
      await act(() => {
        renderer?.update(createElement(Probe, { options: next }));
      });
      expect(mounts).toBe(expected);
      await act(() => {
        renderer?.update(createElement(Probe, { options: base }));
      });
      expected += 1;
      expect(mounts).toBe(expected);
    }

    await act(() => renderer?.unmount());
  });

  it("does not let a thrown-away StrictMode render change what the committed render compares against", async () => {
    const card = new FakeNode("card");
    const root = new FakeRoot([card]);
    const s = slid(10);
    let mounts = 0;
    let injected = false;

    const Probe = ({ tick }: { readonly tick: number }) => {
      const ref = useRef<PageRoot | null>(root);
      // Inject a different settleMs only on the first (discarded) StrictMode pass for tick > 0.
      let settleMs = 1000;
      if (tick > 0 && !injected) {
        injected = true;
        settleMs = 9999;
      }
      useMount(ref, s, {
        clock: "timed",
        frames: NO_FRAMES,
        settleMs,
        onDriver: () => {
          mounts += 1;
        },
      });
      return null;
    };

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(StrictMode, null, createElement(Probe, { tick: 0 })));
    });
    const afterInitial = mounts;
    expect(afterInitial).toBeGreaterThanOrEqual(1);

    await act(() => {
      renderer?.update(createElement(StrictMode, null, createElement(Probe, { tick: 1 })));
    });
    expect(mounts).toBe(afterInitial);

    await act(() => renderer?.unmount());
  });

  it("requires a comparator for every key of StageMountOptions", () => {
    // @ts-expect-error Missing `clock` comparator must fail typecheck.
    const missingClock: MountOptionComparators = {
      frame: Object.is,
      scrollTarget: Object.is,
      frames: Object.is,
      settleMs: Object.is,
      now: Object.is,
      viewport: Object.is,
      onDriver: () => true,
      checks: Object.is,
      nodes: Object.is,
      binders: Object.is,
    };
    expect(missingClock).toBeDefined();
  });
});
