import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { usePatch } from "@motion5/react";
import type { Patch, PatchListener, PatchSource } from "@motion5/react";

const NODE_ID = "hero/arm";

interface FakeSource extends PatchSource {
  publish(patch: Patch): void;
}

/**
 * A consumer-shaped patch source. The point of this file is that a consumer can satisfy the
 * hook's contract with nothing but the published `@motion5/react` entry: no core package
 * import, no `@motion5/core/internal`, and no relative reach into packages/core/src.
 */
function createFakeSource(): FakeSource {
  const listeners = new Map<string, Set<PatchListener>>();
  const latest = new Map<string, Patch>();
  return {
    get(nodeId) {
      return latest.get(nodeId);
    },
    subscribeNode(nodeId, listener) {
      const existing = listeners.get(nodeId) ?? new Set<PatchListener>();
      existing.add(listener);
      listeners.set(nodeId, existing);
      return () => {
        existing.delete(listener);
      };
    },
    publish(patch) {
      latest.set(patch.nodeId, patch);
      for (const listener of [...(listeners.get(patch.nodeId) ?? [])]) listener(patch);
    },
  };
}

function patchAt(revision: number, opacity: number): Patch {
  return {
    nodeId: NODE_ID,
    revision,
    values: { opacity },
    sourceProgress: 0,
    sourceRevisions: {},
    status: "ready",
    diagnostics: [],
  };
}

describe("React public package surface (C2)", () => {
  it("renders and updates through the package entry alone", () => {
    const source = createFakeSource();
    const seen: Array<number | undefined> = [];

    function Consumer(): null {
      const patch = usePatch(source, NODE_ID);
      seen.push(patch?.values.opacity as number | undefined);
      return null;
    }

    let renderer: { unmount(): void } | undefined;
    act(() => {
      renderer = create(createElement(Consumer, null));
    });
    expect(seen).toEqual([undefined]);

    act(() => {
      source.publish(patchAt(1, 1));
    });
    expect(seen).toEqual([undefined, 1]);

    act(() => {
      source.publish(patchAt(2, 0.5));
    });
    expect(seen).toEqual([undefined, 1, 0.5]);

    renderer?.unmount();
  });
});
