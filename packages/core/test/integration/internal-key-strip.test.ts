import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

function ramp() {
  return [
    { p: 0, v: 0 },
    { p: 1, v: 1 },
  ];
}

function load(plugins: PluginRegistry) {
  return new Engine({
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
        tracks: [{ id: "arm", keyframes: { x: ramp() } }],
      },
    ],
  });
}

describe("internal keys are stripped once, before publication", () => {
  it("H-1 keeps a namespaced derived key out of every published surface", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "fk",
      keys: ["x"],
      compose: (values) => ({ ...values, "fk:phase": 42 }),
    });
    const handle = load(plugins);
    handle.mount("hero/arm");
    const published: Array<Readonly<Record<string, unknown>>> = [];
    handle.subscribeNode("hero/arm", (patch) => published.push(patch.values));

    const batch = handle.seek("hero/arm", 1);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");

    // The batch, the retained patch, and the subscriber all see the same filtered surface. No
    // declaration of any kind was needed for `fk:phase` to stay private.
    expect(patch?.values).toEqual({ x: 1 });
    expect(handle.get("hero/arm")?.values).toEqual({ x: 1 });
    expect(published).toEqual([{ x: 1 }]);
    handle.dispose();
  });

  it("H-2 keeps a declared unprefixed internal key out of the patch", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "path",
      keys: ["x"],
      internalKeys: ["scratch"],
      compose: (values) => ({ ...values, scratch: "private", rendered: true }),
    });
    const handle = load(plugins);
    handle.mount("hero/arm");

    handle.seek("hero/arm", 1);

    // An unprefixed private key still needs the declaration, and the declaration is still honored.
    // A renderer that never reads `internalKeys`, which is both of them today, cannot leak it.
    expect(handle.get("hero/arm")?.values).toEqual({ x: 1, rendered: true });
    handle.dispose();
  });

  it("H-3 still rejects an underscore key returned from compose", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "leaky",
      keys: ["x"],
      compose: (values) => ({ ...values, _private: "hidden" }),
    });
    const handle = load(plugins);
    handle.mount("hero/arm");

    const batch = handle.seek("hero/arm", 1);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");

    // Green on the parent by design, and not claimed as red. The underscore has two meanings at
    // two boundaries: interpolator scratch stripped before the chain, and a plugin invention
    // rejected after it. Hiding it here instead would turn a loud error into a silent success.
    expect(patch?.status).toBe("error");
    expect(patch?.diagnostics[0]?.ruleId).toBe("composition-output-shape");
    handle.dispose();
  });
});
