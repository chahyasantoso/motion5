import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { motion, type Pose2d } from "@gerak/core";
import { box, many, sceneBuilder } from "@gerak/stage";
import { type FrameSource, type PageElement, type PageRoot, type PageStyle } from "@gerak/dom";
import { Stage } from "@gerak/react";

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
  return sceneBuilder({ length })
    .element(box("card"))
    .motion(motion((): Pose2d => ({ x: distance })));
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
    const longer = sceneBuilder({ length: 2000 })
      .element(box("card"))
      .element(many("extra", 1))
      .motion(motion((): Pose2d => ({ x: 20 })));

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
});
