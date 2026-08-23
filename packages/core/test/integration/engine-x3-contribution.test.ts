import { describe, expect, it, vi } from "vitest";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import type { ImmutableRecord } from "../../src/domain/values";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
const projectWith = (keyframes: unknown, duration = 1) => ({
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm", duration, keyframes }] },
  ],
});
const options = () => ({
  clock: createManualClock(),
  interpolator: createFakeInterpolator(),
  scheduler: createFakeScheduler(),
});
const compose = (values: Readonly<ImmutableRecord>): ImmutableRecord => values;
const property = (value: number) => [
  { p: 0, v: value },
  { p: 1, v: value + 1 },
];
const registerDerivedOwner = (registry: PluginRegistry): void =>
  registry.register({ name: "derived", keys: ["derived"], compose });
describe("X-3 contribution through the product load path", () => {
  it("passes contribution context and creates the prepared timeline at load", () => {
    const registry = new PluginRegistry();
    const contribute = vi.fn(() => ({
      keyframes: { derived: property(4) },
      tweenVars: { overwrite: "auto" },
    }));
    registry.register({ name: "base", keys: ["x"], stage: "prepare", contribute, compose });
    registerDerivedOwner(registry);
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const runtime = new Engine({ ...options(), interpolator, plugins: registry }).load(
      projectWith({ x: property(1) }, 2) as never,
    );
    // The hook receives the authored leaf, and since ADR-050 the leaf is the stops array itself.
    expect(contribute).toHaveBeenCalledWith("x", property(1), {
      id: "hero/arm",
      duration: 2,
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        duration: 2,
        tweenVars: { overwrite: "auto" },
        keyframes: expect.objectContaining({ derived: property(4) }),
      }),
    );
    runtime.dispose();
  });
  it("selects one predicate contributor through Engine.load", () => {
    const registry = new PluginRegistry();
    const first = vi.fn(() => ({ keyframes: { derived: property(1) } }));
    const second = vi.fn(() => ({ keyframes: { derived: property(2) } }));
    registry.register({
      name: "first",
      claimsKey: (key) => key === "x",
      stage: "prepare",
      contribute: first,
      compose,
    });
    registry.register({
      name: "second",
      claimsKey: (key) => key === "x",
      stage: "prepare",
      contribute: second,
      compose,
    });
    registerDerivedOwner(registry);
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    const runtime = new Engine({ ...options(), interpolator, plugins: registry }).load(
      projectWith({ x: property(1) }) as never,
    );
    expect(first).toHaveBeenCalledOnce();
    expect(second).not.toHaveBeenCalled();
    expect(create).toHaveBeenCalled();
    runtime.dispose();
  });
  it("rejects malformed contributions during Engine.load", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "bad",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({
        keyframes: {
          derived: [
            { p: 0.8, v: 1 },
            { p: 0.2, v: 2 },
          ],
        },
      }),
      compose,
    });
    registerDerivedOwner(registry);
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    expect(() =>
      new Engine({ ...options(), interpolator, plugins: registry }).load(
        projectWith({ x: property(1) }) as never,
      ),
    ).toThrow(/plugin-contribution-stop-order/);
    expect(create).not.toHaveBeenCalled();
  });
  it("rejects authored ease collisions before any timeline is created", () => {
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    expect(() =>
      new Engine({ ...options(), interpolator }).load(
        projectWith({
          x: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power1.out" },
            { p: 1, v: 100 },
          ],
          y: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power2.out" },
            { p: 1, v: 100 },
          ],
        }) as never,
      ),
    ).toThrow(/plugin-contribution-ease-collision/);
    expect(create).not.toHaveBeenCalled();
  });
  it("merges contributed keyframes into compiler diagnostics before timeline creation", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "base",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({
        keyframes: {
          derived: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power2.out" },
            { p: 1, v: 100 },
          ],
        },
      }),
      compose,
    });
    registerDerivedOwner(registry);
    const interpolator = createFakeInterpolator();
    const create = vi.spyOn(interpolator, "create");
    expect(() =>
      new Engine({ ...options(), interpolator, plugins: registry }).load(
        projectWith({
          x: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50, ease: "power1.out" },
            { p: 1, v: 100 },
          ],
        }) as never,
      ),
    ).toThrow(/plugin-contribution-ease-collision/);
    expect(create).not.toHaveBeenCalled();
  });
});
