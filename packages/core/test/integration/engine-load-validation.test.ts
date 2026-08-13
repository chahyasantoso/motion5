import { describe, expect, it, vi } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

const options = () => ({
  clock: createManualClock(),
  interpolator: createFakeInterpolator(),
  scheduler: createFakeScheduler(),
});

const projectWith = (keyframes: unknown) => ({
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "arm", keyframes }],
    },
  ],
});

describe("Engine product-load validation (X-1 follow-up)", () => {
  it("rejects malformed authored stops before constructing a runtime", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator });
    const invalid = projectWith({ opacity: { stops: [{ p: Number.NaN, v: 1 }] } });

    expect(() => engine.load(invalid as never)).toThrow(/stop-position/);
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects malformed authored stops before any timeline is created", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator });
    const invalid = projectWith({
      opacity: {
        stops: [
          { p: 0.8, v: 0 },
          { p: 0.2, v: 1 },
        ],
      },
    });

    expect(() => engine.load(invalid as never)).toThrow(/stop-position-order/);
    expect(create).not.toHaveBeenCalled();
  });

  it("resolves authored plugin ownership during load, not on the first seek", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "opacity",
      keys: ["opacity"],
      compose: (values) => values,
    });
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator, plugins });

    expect(() => engine.load(projectWith({ unknown: { stops: [{ p: 0, v: 0 }] } }) as never)).toThrow(
      /plugin-unknown-key/,
    );
    expect(create).not.toHaveBeenCalled();
  });

  it("accepts a valid project and creates its timelines during load", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const engine = new Engine({ ...options(), interpolator });

    const runtime = engine.load(
      projectWith({ opacity: { stops: [{ p: 0, v: 0 }, { p: 1, v: 1 }] } }) as never,
    );
    expect(create).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });
});
