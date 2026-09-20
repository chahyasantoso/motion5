import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { liveOrAbsent, usePatch } from "@motion5/react";
import type { LivePatch, Patch, PatchListener, PatchSource } from "@motion5/react";

const NODE_ID = "hero/arm";

interface FakeSource extends PatchSource {
  publish(patch: Patch): void;
}

/**
 * A consumer-shaped patch source. The point of this file is that a consumer can satisfy the
 * hook's contract with nothing but the published `@motion5/react` entry: no core package
 * import, no `@motion5/core/internal`, and no relative reach into packages/core/src.
 *
 * That claim now covers the narrowed `get` too, which is the case this file earns by existing: the
 * store holds `LivePatch`, `publish` accepts every variant the wire carries, and `liveOrAbsent` is
 * the one thing standing between them. All three names come from the entry. A narrowing that could
 * only be satisfied by importing core internals would have failed here rather than in review.
 */
function createFakeSource(): FakeSource {
  const listeners = new Map<string, Set<PatchListener>>();
  const latest = new Map<string, LivePatch>();
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
      const live = liveOrAbsent(patch);
      if (live === undefined) latest.delete(patch.nodeId);
      else latest.set(patch.nodeId, live);
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
      // The hook applies no filtering, which is what this case records, so a patch owning no pose
      // contributes the same `undefined` an absent one does. The first render has no patch at all.
      // See ADR-098.
      seen.push(
        patch?.status === "ready" ? (patch.values.opacity as number | undefined) : undefined,
      );
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
