import { describe, expect, it, vi } from "vitest";
import type { PluginDefinition } from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { record, track } from "../support/v5-builders";

const options = () => ({
  clock: createManualClock(),
  interpolator: createFakeInterpolator(),
  scheduler: createFakeScheduler(),
});

const projectWith = (values: unknown) => ({
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [track({ id: "arm", values: values as never })],
    },
  ],
});

const OPACITY: PluginDefinition = {
  id: "opacity",
  inputs: { values: { kind: "record", fields: { opacity: { kind: "number" } } } },
  outputs: { values: { kind: "record", fields: { opacity: { kind: "number" } } } },
  transform(input) {
    return { values: input.values };
  },
};

describe("Engine product-load validation (X-1 follow-up)", () => {
  it("rejects malformed authored stops before constructing a runtime", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator });
    const invalid = projectWith({ opacity: [{ p: Number.NaN, v: 1 }] });

    expect(() => engine.load(invalid as never)).toThrow(/cell-stops-invalid/);
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects malformed authored stops before any timeline is created", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator });
    const invalid = projectWith({
      opacity: [
        { p: 0.8, v: 0 },
        { p: 0.2, v: 1 },
      ],
    });

    expect(() => engine.load(invalid as never)).toThrow(/cell-stops-invalid/);
    expect(create).not.toHaveBeenCalled();
  });

  it("resolves authored plugin ownership during load, not on the first seek", () => {
    const plugins = new PluginCatalog();
    plugins.register(OPACITY);
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator, plugins });
    const undeclared = projectWith({ other: 1 });

    expect(() =>
      engine.load({
        ...undeclared,
        motions: [
          {
            id: "hero",
            trigger: { type: "manual" },
            tracks: [track({ id: "arm", plugin: OPACITY.id, values: record({ other: 1 }) })],
          },
        ],
      } as never),
    ).toThrow(/cell-form-invalid/);
    expect(create).not.toHaveBeenCalled();
  });

  it("accepts a valid project and creates its timelines during load", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator });

    const runtime = engine.load(
      projectWith({
        opacity: [
          { p: 0, v: 0 },
          { p: 1, v: 1 },
        ],
      }) as never,
    );
    expect(create).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });
});
