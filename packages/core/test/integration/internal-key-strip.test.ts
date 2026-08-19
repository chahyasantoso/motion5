import { describe, expect, it } from "vitest";
import type { ImmutableRecord } from "../../src/domain/values";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

describe("namespaced internal keys", () => {
  it("H-1 strips underscore and colon keys after the plugin compose chain", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "private",
      keys: ["x"],
      compose: (values: Readonly<ImmutableRecord>) => ({
        ...values,
        x: 10,
        y: 20,
        "fk:phase": 42,
        _private: "hidden",
      }),
    });
    const runtime = new Engine({
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

    runtime.mount("hero/arm");
    const batch = runtime.seek("hero/arm", 0);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
    expect(patch?.values).toEqual({ x: 10, y: 20 });
    expect(patch?.values).not.toHaveProperty("fk:phase");
    expect(patch?.values).not.toHaveProperty("_private");
    runtime.dispose();
  });

  it("H-2 hides a private namespaced derived key from both get and subscribe", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "private",
      keys: ["x"],
      compose: (values: Readonly<ImmutableRecord>) => ({
        ...values,
        x: 10,
        "fk:phase": 42,
      }),
    });
    const runtime = new Engine({
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

    runtime.mount("hero/arm");
    const published: unknown[] = [];
    runtime.subscribeNode("hero/arm", (patch) => published.push(patch.values));
    runtime.seek("hero/arm", 0);
    expect(runtime.get("hero/arm")?.values).toEqual({ x: 10 });
    expect(published[0]).toEqual({ x: 10 });
    runtime.dispose();
  });
});
