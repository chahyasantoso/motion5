import { createElement } from "react";
import type { RefCallback } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { liveOrAbsent, useDomPatch } from "@motion5/react";
import type {
  LivePatch,
  Patch,
  PatchListener,
  PatchSource,
  RenderMetadata,
  RenderMetadataSource,
} from "@motion5/react";

const NODE_ID = "hero/arm";

interface FakeSource extends PatchSource, RenderMetadataSource {
  listenerCount(): number;
  publish(patch: Patch): void;
}

// The hook's contract is satisfiable from the published entry alone, metadata included: a source
// that cannot answer `renderMetadata` does not typecheck, which is the whole point of requiring it.
//
// One slot, holding the live union, so the collapse is the whole of what `publish` does with a
// terminal patch: `get` answers what a reader may still ask for, and a delivered `destroyed` leaves
// nothing to ask about. `liveOrAbsent` comes from the entry for the same reason every other name
// here does, which is that an implementor of `PatchSource` must be able to satisfy it without
// reaching past the published surface.
function createFakeSource(initial?: LivePatch, metadata?: RenderMetadata): FakeSource {
  const listeners = new Set<PatchListener>();
  let latest: LivePatch | undefined = initial;
  return {
    get: () => latest,
    subscribeNode(nodeId, listener) {
      if (nodeId !== NODE_ID) throw new Error(`Unexpected node "${nodeId}".`);
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    renderMetadata: () => metadata,
    listenerCount: () => listeners.size,
    publish(next) {
      latest = liveOrAbsent(next);
      for (const listener of [...listeners]) listener(next);
    },
  };
}

function patch(
  revision: number,
  values: Readonly<Record<string, unknown>>,
  status: LivePatch["status"] = "ready",
): LivePatch {
  return {
    nodeId: NODE_ID,
    revision,
    values,
    sourceProgress: 0,
    sourceRevisions: {},
    status,
    diagnostics: [],
  };
}

/**
 * The terminal patch, minted with the members `DestroyedPatch` actually owns.
 *
 * Identity and status and nothing else, which is what `#notifyTerminal` publishes since ADR-098. The
 * helper above builds a pose and a destroyed node has none, so it cannot answer this case: sending
 * `destroyed` through it published a payload the real wire has never carried, and the adapter's
 * status gate is the only reason nothing noticed.
 */
function destroyed(revision: number): Patch {
  return { nodeId: NODE_ID, revision, status: "destroyed" };
}

interface FakeStyle extends Record<string, unknown> {
  removeProperty(property: string): void;
}
interface FakeSvgTarget {
  style: FakeStyle;
  ownerSVGElement: null;
  pose?: unknown;
}

function createSvgTarget(): FakeSvgTarget {
  const style: FakeStyle = {
    opacity: undefined,
    removeProperty(property) {
      delete this[property];
    },
  };
  return { style, ownerSVGElement: null };
}

function mount(source: FakeSource, target: FakeSvgTarget): { unmount(): void } {
  function Consumer(): ReturnType<typeof createElement> {
    // Typed as a real SVG element ref: a consumer binds `<g ref={bind}>` with no cast of its own.
    const bind: RefCallback<SVGGElement> = useDomPatch<SVGGElement>(source, NODE_ID);
    return createElement("g", { ref: bind });
  }
  let renderer: { unmount(): void } | undefined;
  act(() => {
    renderer = create(createElement(Consumer), { createNodeMock: () => target });
  });
  return renderer!;
}

describe("useDomPatch", () => {
  it("applies the retained patch, later batches, and omitted-key removal without a React render", () => {
    const source = createFakeSource(patch(1, { x: 4, y: 8, opacity: 0.5 }));
    const target = createSvgTarget();
    const renderer = mount(source, target);

    expect(target.style.transform).toBe("translate3d(4px, 8px, 0px)");
    expect(target.style.opacity).toBe(0.5);

    // Transform growth: a key no consumer spells reaches the target through the adapter alone.
    act(() => {
      source.publish(patch(2, { x: 4, y: 8, opacity: 0.5, scale: 2 }));
    });
    expect(target.style.transform).toBe("translate3d(4px, 8px, 0px) scale(2)");

    act(() => {
      source.publish(patch(3, { x: 12, y: 16 }));
    });
    expect(target.style.transform).toBe("translate3d(12px, 16px, 0px)");
    expect(target.style.opacity).toBeUndefined();

    expect(source.listenerCount()).toBe(1);
    act(() => {
      renderer.unmount();
    });
    expect(source.listenerCount()).toBe(0);
  });

  it("serializes plugin output, pins the SVG reference box, and holds the last pose when not ready", () => {
    const metadata: RenderMetadata = {
      outputSerializers: {
        pose: (value) => `${String((value as { w: number }).w)}px`,
      },
    };
    const source = createFakeSource(patch(1, { x: 1, y: 2, pose: { w: 3 } }), metadata);
    const target = createSvgTarget();
    const renderer = mount(source, target);

    // Without the metadata channel this composite is suppressed unrendered, which is the divergence
    // a React-only DOM configuration used to ship.
    expect(target.pose).toBe("3px");
    expect(target.style.transformBox).toBe("view-box");
    expect(target.style.transformOrigin).toBe("0px 0px");

    // The three publications a ready patch is held against, minted per variant rather than by
    // varying one status on one payload: the terminal one owns no pose, so it cannot be the same
    // object with a different word in it.
    for (const notReady of [
      patch(2, { x: 99, y: 99 }, "blocked"),
      patch(2, { x: 99, y: 99 }, "error"),
      destroyed(2),
    ])
      act(() => {
        source.publish(notReady);
      });
    expect(target.style.transform).toBe("translate3d(1px, 2px, 0px)");

    act(() => {
      renderer.unmount();
    });
    expect(source.listenerCount()).toBe(0);
  });
});
