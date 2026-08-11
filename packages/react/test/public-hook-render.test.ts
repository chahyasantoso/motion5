import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { PatchRegistry } from "../../core/src/runtime/patch-registry";
import { usePatch } from "../src/index";

function publish(registry: PatchRegistry, tick: number, opacity: number): void {
  registry.beginBatch(tick, ["hero/arm"]);
  registry.publish({
    nodeId: "hero/arm",
    values: { opacity },
    sourceProgress: 0,
    status: "ready",
  });
  registry.closeBatch();
}

describe("React public hook render/update (C2)", () => {
  it("renders the current patch and updates after publication", () => {
    const registry = new PatchRegistry();
    const snapshots: Array<number | undefined> = [];
    function Consumer(): null {
      const patch = usePatch(registry, "hero/arm");
      snapshots.push(patch?.values.opacity as number | undefined);
      return null;
    }

    let renderer: { toJSON(): unknown; unmount(): void };
    act(() => {
      renderer = create(createElement(Consumer, null));
    });
    expect(snapshots).toEqual([undefined]);

    act(() => publish(registry, 1, 1));
    expect(snapshots).toEqual([undefined, 1]);

    act(() => publish(registry, 2, 0.5));
    expect(snapshots).toEqual([undefined, 1, 0.5]);
    renderer!.unmount();
  });
});
