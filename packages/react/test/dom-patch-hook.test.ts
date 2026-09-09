import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { useDomPatch } from "@motion5/react";
import type { Patch, PatchListener, PatchSource } from "@motion5/react";

const NODE_ID = "hero/arm";
interface FakeSource extends PatchSource {
  listenerCount(): number;
  publish(patch: Patch): void;
}
function createFakeSource(initial?: Patch): FakeSource {
  const listeners = new Set<PatchListener>();
  let latest = initial;
  return {
    get: () => latest,
    subscribeNode(nodeId, listener) {
      if (nodeId !== NODE_ID) throw new Error(`Unexpected node ${nodeId}`);
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    listenerCount: () => listeners.size,
    publish(next) {
      latest = next;
      for (const listener of [...listeners]) listener(next);
    },
  };
}
function patch(
  revision: number,
  values: Readonly<Record<string, unknown>>,
  status: Patch["status"] = "ready",
): Patch {
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
describe("useDomPatch", () => {
  it("binds retained and future complete patches through the public package entry", () => {
    const source = createFakeSource(patch(1, { x: 4, y: 8, scale: 2, opacity: 0.5 }));
    const style: Record<string, unknown> & { removeProperty(property: string): void } = {
      opacity: undefined,
      removeProperty(property) {
        delete this[property];
      },
    };
    const target = { style };
    function Consumer() {
      return createElement("div", { ref: useDomPatch(source, NODE_ID) });
    }
    let renderer: { unmount(): void } | undefined;
    act(() => {
      renderer = create(createElement(Consumer), { createNodeMock: () => target });
    });
    expect(style).toMatchObject({ opacity: 0.5, transform: "translate3d(4px, 8px, 0px) scale(2)" });
    act(() => source.publish(patch(2, { x: 99, opacity: 1 }, "blocked")));
    expect(style).toMatchObject({ opacity: 0.5, transform: "translate3d(4px, 8px, 0px) scale(2)" });
    act(() => source.publish(patch(3, { x: 12, y: 16 })));
    expect(style.opacity).toBeUndefined();
    expect(style.transform).toBe("translate3d(12px, 16px, 0px)");
    expect(source.listenerCount()).toBe(1);
    act(() => renderer?.unmount());
    expect(source.listenerCount()).toBe(0);
  });
});
