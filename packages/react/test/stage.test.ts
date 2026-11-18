import { createElement, type FC } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { type FrameSource, type StageElement, type StageEvent, type StageStyle } from "@gerak/dom";
import { compileStage, defineStage } from "@gerak/stage";
import { Stage, type StageProps } from "@gerak/react";

class FakeStyle implements StageStyle {
  readonly custom = new Map<string, string>();
  setProperty(name: string, value: string): void {
    this.custom.set(name, value);
  }
  removeProperty(name: string): void {
    this.custom.delete(name);
  }
}

interface FakeDocument {
  createElement(tag: "div" | "style" | "link"): FakeElement;
  createElementNS(namespace: string, name: "svg" | "path"): FakeElement;
}

class FakeElement implements StageElement<FakeElement, FakeElement> {
  readonly style: FakeStyle & StageStyle = new FakeStyle();
  readonly attributes = new Map<string, string>();
  readonly children: FakeElement[] = [];
  readonly listeners = new Map<string, Set<(event: StageEvent) => void>>();
  parent: FakeElement | undefined;
  shadowRoot: FakeElement | undefined;
  textContent: string | null = null;
  innerHTML?: string;
  tabIndex = -1;
  offsetLeft = 0;
  offsetTop = 0;
  offsetWidth = 0;
  offsetHeight = 0;
  clientWidth = 0;
  clientLeft = 0;
  clientTop = 0;
  clientHeight = 0;
  readonly ownerDocument: FakeDocument;

  constructor(
    readonly tagName: string,
    document?: FakeDocument,
  ) {
    this.ownerDocument = document ?? {
      createElement: (tag) => new FakeElement(tag, this.ownerDocument),
      createElementNS: (_namespace, name) => new FakeElement(name, this.ownerDocument),
    };
  }
  attachShadow(): FakeElement {
    const root = new FakeElement("#shadow", this.ownerDocument);
    this.shadowRoot = root;
    return root;
  }
  setAttribute(name: string, value: string): void {
    this.attributes.set(name, value);
  }
  removeAttribute(name: string): void {
    this.attributes.delete(name);
  }
  append(...nodes: FakeElement[]): void {
    for (const node of nodes) {
      node.parent = this;
      this.children.push(node);
    }
  }
  remove(): void {
    const siblings = this.parent?.children;
    if (siblings !== undefined) {
      const idx = siblings.indexOf(this);
      if (idx >= 0) siblings.splice(idx, 1);
    }
    this.parent = undefined;
  }
  addEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.set(type, (this.listeners.get(type) ?? new Set()).add(listener));
  }
  removeEventListener(type: string, listener: (event: StageEvent) => void): void {
    this.listeners.get(type)?.delete(listener);
  }
  all(): FakeElement[] {
    const below = [...this.children, ...(this.shadowRoot === undefined ? [] : [this.shadowRoot])];
    return below.flatMap((child) => [child, ...child.all()]);
  }
  find(name: string): FakeElement {
    const found = this.all().find((element) => element.attributes.get("data-cast") === name);
    if (found === undefined) throw new Error(`No element named ${name}.`);
    return found;
  }
}

const NO_FRAMES: FrameSource = { requestFrame: () => 1, cancelFrame: () => undefined };

function renderStage(props: StageProps) {
  const Component: FC<StageProps> = Stage;
  return createElement(Component, props);
}

describe("<Stage />", () => {
  it("mounts a StageDefinition and swaps compatible updates in place via replace", async () => {
    const container = new FakeElement("div");
    const drivers: unknown[] = [];
    const options = { frames: NO_FRAMES, onDriver: (driver: unknown) => drivers.push(driver) };

    const stageOne = defineStage({
      beats: { intro: [0, 1000] },
      cast: (m) => ({ card: m.box() }),
      scene: () => ({ card: { x: 10 } }),
    });
    const stageTwo = defineStage({
      beats: { intro: [0, 1000] },
      cast: (m) => ({ card: m.box() }),
      scene: () => ({ card: { x: 75 } }),
    });

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(renderStage({ stage: stageOne, options }), {
        createNodeMock: () => container,
      });
    });

    const host = container.children[0];
    const card = host?.shadowRoot?.find("card");
    expect(card?.style.transform).toBe("translate3d(10px, 0px, 0px)");
    expect(drivers).toHaveLength(1);

    await act(() => {
      renderer?.update(renderStage({ stage: stageTwo, options }));
    });

    // Compatible stage updated via replace: same host/card nodes and same driver.
    expect(container.children[0]).toBe(host);
    expect(host?.shadowRoot?.find("card")).toBe(card);
    expect(card?.style.transform).toBe("translate3d(75px, 0px, 0px)");
    expect(drivers).toHaveLength(1);

    await act(() => {
      renderer?.unmount();
    });
    expect(container.children).toEqual([]);
  });

  it("mounts a CompiledStage and remounts when cast or durationMs changes, cleaning up on unmount", async () => {
    const container = new FakeElement("div");
    const drivers: unknown[] = [];
    const options = { frames: NO_FRAMES, onDriver: (driver: unknown) => drivers.push(driver) };

    const first = compileStage(
      defineStage({
        beats: { intro: [0, 1000] },
        cast: (m) => ({ card: m.box().watch() }),
        scene: () => ({ card: { y: 5 } }),
      }),
    );
    const second = defineStage({
      beats: { intro: [0, 2000] },
      cast: (m) => ({ card: m.box().watch(), extra: m.box() }),
      scene: () => ({ extra: { x: 20 } }),
    });
    if (!first.ok) throw new Error("Expected first stage to compile.");

    let renderer: ReturnType<typeof create> | undefined;
    await act(() => {
      renderer = create(createElement(Stage, { stage: first.stage, options }), {
        createNodeMock: () => container,
      });
    });

    const firstHost = container.children[0];
    const firstCard = firstHost?.shadowRoot?.find("card");
    expect(firstCard?.style.transform).toBe("translate3d(0px, 5px, 0px)");
    expect(drivers).toHaveLength(1);

    await act(() => {
      renderer?.update(renderStage({ stage: second, options }));
    });

    const secondHost = container.children[0];
    expect(secondHost).not.toBe(firstHost);
    expect(firstCard?.listeners.get("pointerenter")?.size ?? 0).toBe(0);
    expect(secondHost?.shadowRoot?.find("extra").style.transform).toBe(
      "translate3d(20px, 0px, 0px)",
    );
    expect(drivers).toHaveLength(2);

    await act(() => {
      renderer?.unmount();
    });
    expect(container.children).toEqual([]);
  });
});
