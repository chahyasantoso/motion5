import { act, create } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { PatchRegistry } from "../../core/src/runtime/patch-registry";
import { PluginRegistry } from "../../core/src/domain/plugins";
import { Engine } from "../../core/src/engine";
import { createManualClock } from "../../core/src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../core/src/ports/fakes";
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

  it("H-4 hands a consumer the same stripped values the publisher retained", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "fk",
      keys: ["x"],
      compose: (values) => ({ ...values, "fk:phase": 42 }),
    });
    const engine = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "arm",
              keyframes: {
                x: {
                  stops: [
                    { p: 0, v: 0 },
                    { p: 1, v: 1 },
                  ],
                },
              },
            },
          ],
        },
      ],
    });
    engine.mount("hero/arm");

    // This is the path the demo renders through, and it applies no filtering of its own: the store
    // memoizes the patch and the hook returns it whole.
    const values: Array<Readonly<Record<string, unknown>> | undefined> = [];
    function Consumer(): null {
      values.push(usePatch(engine, "hero/arm")?.values);
      return null;
    }

    let renderer: { toJSON(): unknown; unmount(): void };
    act(() => {
      renderer = create(createElement(Consumer, null));
    });
    act(() => {
      engine.seek("hero/arm", 1);
    });

    expect(values).toEqual([undefined, { x: 1 }]);
    renderer!.unmount();
    engine.dispose();
  });
});
