import { createElement } from "react";
import type { RefCallback } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { useDerivedDomPatch } from "@motion5/react";
import type { Patch, PatchDerivation, PatchListener, PatchSource } from "@motion5/react";

const PARENT = "walk/pelvis";
const CHILD = "walk/legL_thigh";

interface FakeSource extends PatchSource {
  listenerCount(): number;
  publish(patch: Patch): void;
}

// Two nodes in one store, counted across both: what a fan-in binding owes is one subscription per
// source and the release of every one of them.
function createFakeSource(...initial: readonly Patch[]): FakeSource {
  const listeners = new Map<string, Set<PatchListener>>();
  const latest = new Map<string, Patch>(initial.map((entry) => [entry.nodeId, entry] as const));
  return {
    get: (nodeId) => latest.get(nodeId),
    subscribeNode(nodeId, listener) {
      const existing = listeners.get(nodeId) ?? new Set<PatchListener>();
      existing.add(listener);
      listeners.set(nodeId, existing);
      return () => {
        existing.delete(listener);
      };
    },
    listenerCount: () => [...listeners.values()].reduce((total, set) => total + set.size, 0),
    publish(next) {
      latest.set(next.nodeId, next);
      for (const listener of [...(listeners.get(next.nodeId) ?? [])]) listener(next);
    },
  };
}

function patch(
  nodeId: string,
  revision: number,
  values: Readonly<Record<string, unknown>>,
  status: Patch["status"] = "ready",
): Patch {
  return {
    nodeId,
    revision,
    values,
    sourceProgress: 0,
    sourceRevisions: {},
    status,
    diagnostics: [],
  };
}

const endpoints: PatchDerivation = ([parent = {}, child = {}]) => ({
  x1: Number(parent.x ?? 0),
  y1: Number(parent.y ?? 0),
  x2: Number(child.x ?? 0),
  y2: Number(child.y ?? 0),
});

interface FakeStyle extends Record<string, unknown> {
  removeProperty(property: string): void;
}
interface FakeSvgTarget {
  style: FakeStyle;
  ownerSVGElement: null;
  attributes: Map<string, string>;
  setAttribute(name: string, value: string): void;
  removeAttribute(name: string): void;
}

/**
 * Geometry keys are readonly IDL attributes on a real element, so this double answers the attribute
 * channel and declares no `x1` property to assign. `removeProperty` empties rather than deletes,
 * like a real `CSSStyleDeclaration`, so hiding twice resolves to the style channel both times.
 */
function createSvgTarget(): FakeSvgTarget {
  const style: FakeStyle = {
    visibility: undefined,
    removeProperty(property) {
      this[property] = undefined;
    },
  };
  const attributes = new Map<string, string>();
  return {
    style,
    ownerSVGElement: null,
    attributes,
    setAttribute(name, value) {
      attributes.set(name, value);
    },
    removeAttribute(name) {
      attributes.delete(name);
    },
  };
}

function mount(
  source: PatchSource,
  target: FakeSvgTarget,
  nodeIds: readonly string[],
  derive: PatchDerivation = endpoints,
): { renders(): number; unmount(): void } {
  // The assertion the red run fails on. A case that throws "not a function" instead is a failure
  // without being failing-first evidence, and this stays afterwards as the entry's surface check.
  expect(typeof useDerivedDomPatch).toBe("function");
  let renders = 0;
  function Consumer(): ReturnType<typeof createElement> {
    renders += 1;
    // Typed as a real SVG element ref: a consumer binds `<line ref={bind}>` and casts nothing.
    const bind: RefCallback<SVGLineElement> = useDerivedDomPatch<SVGLineElement>(
      source,
      [...nodeIds],
      derive,
    );
    return createElement("line", { ref: bind });
  }
  let renderer: { unmount(): void } | undefined;
  act(() => {
    renderer = create(createElement(Consumer), { createNodeMock: () => target });
  });
  return {
    renders: () => renders,
    unmount: () => {
      renderer?.unmount();
    },
  };
}

describe("useDerivedDomPatch", () => {
  it("writes geometry derived from every source, on mount and on later batches, with no React render", () => {
    const source = createFakeSource(
      patch(PARENT, 1, { x: 10, y: 20 }),
      patch(CHILD, 1, { x: 30, y: 40 }),
    );
    const target = createSvgTarget();
    const mounted = mount(source, target, [PARENT, CHILD]);

    expect(Object.fromEntries(target.attributes)).toEqual({
      x1: "10",
      y1: "20",
      x2: "30",
      y2: "40",
    });
    expect(mounted.renders()).toBe(1);

    act(() => {
      source.publish(patch(CHILD, 2, { x: 33, y: 44 }));
    });
    expect(target.attributes.get("x2")).toBe("33");
    expect(target.attributes.get("y2")).toBe("44");
    expect(mounted.renders()).toBe(1);

    expect(source.listenerCount()).toBe(2);
    act(() => {
      mounted.unmount();
    });
    expect(source.listenerCount()).toBe(0);
  });

  it("hides the target while any source is not live, and derives again when every one is", () => {
    const source = createFakeSource(
      patch(PARENT, 1, { x: 10, y: 20 }),
      patch(CHILD, 1, { x: 30, y: 40 }),
    );
    const target = createSvgTarget();
    const mounted = mount(source, target, [PARENT, CHILD]);
    expect(target.attributes.size).toBe(4);

    act(() => {
      source.publish(patch(CHILD, 2, { x: 99, y: 99 }, "blocked"));
    });
    expect(target.style.visibility).toBe("hidden");
    expect(target.attributes.size).toBe(0);

    act(() => {
      source.publish(patch(CHILD, 3, { x: 35, y: 45 }));
    });
    expect(target.style.visibility).toBeUndefined();
    expect(target.attributes.get("x2")).toBe("35");

    // Twice, because a hide that only works on a target which was never shown works once.
    act(() => {
      source.publish(patch(CHILD, 4, { x: 35, y: 45 }, "destroyed"));
    });
    expect(target.style.visibility).toBe("hidden");
    expect(mounted.renders()).toBe(1);

    act(() => {
      mounted.unmount();
    });
  });

  it("composes a derived pose through the adapter and pivots at the element's own origin", () => {
    const source = createFakeSource(patch(PARENT, 1, { x: 10, y: 20, rotation: 30 }));
    const target = createSvgTarget();
    const visor: PatchDerivation = ([head = {}]) => ({
      x: Number(head.x ?? 0),
      y: Number(head.y ?? 0) + 8,
      rotation: Number(head.rotation ?? 0) + 90,
    });
    const mounted = mount(source, target, [PARENT], visor);

    expect(target.style.transform).toBe("translate3d(10px, 28px, 0px) rotate(120deg)");
    expect(target.style.transformBox).toBe("view-box");
    expect(target.style.transformOrigin).toBe("0px 0px");
    // A pose is not geometry: nothing reached the attribute channel.
    expect(target.attributes.size).toBe(0);

    act(() => {
      mounted.unmount();
    });
  });

  it("keeps one subscription per source across a render that passes a fresh id array", () => {
    const source = createFakeSource(patch(PARENT, 1, { x: 1, y: 2 }));
    let subscribes = 0;
    const counted: PatchSource = {
      get: (nodeId) => source.get(nodeId),
      subscribeNode(nodeId, listener) {
        subscribes += 1;
        return source.subscribeNode(nodeId, listener);
      },
    };
    const target = createSvgTarget();
    expect(typeof useDerivedDomPatch).toBe("function");
    function Consumer(): ReturnType<typeof createElement> {
      const bind = useDerivedDomPatch<SVGLineElement>(counted, [PARENT], endpoints);
      return createElement("line", { ref: bind });
    }
    let renderer:
      | { unmount(): void; update(element: ReturnType<typeof createElement>): void }
      | undefined;
    act(() => {
      renderer = create(createElement(Consumer), { createNodeMock: () => target });
    });
    act(() => {
      renderer?.update(createElement(Consumer));
    });

    expect(subscribes).toBe(1);
    expect(source.listenerCount()).toBe(1);
    act(() => {
      renderer?.unmount();
    });
    expect(source.listenerCount()).toBe(0);
  });
});
