import { gsap } from "gsap";
import { describe, expect, it } from "vitest";
import { createGsapInterpolator, createGsapOneTweenInterpolator } from "../../src/adapters";
import { defineModel, type ProjectDefinition, type TrackDefinition } from "../../src/contract/v5";
import { Spec } from "../../src/contract/spec-builder";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/testing/fakes";

const Out = defineModel({ id: "UnknownEaseOut", spec: Spec.record({ x: Spec.number() }) });

function track(ease: string, id = "t"): TrackDefinition {
  return {
    id,
    output: { model: "UnknownEaseOut" },
    input: { values: { x: stops(ease) } },
  };
}

function stops(ease: string) {
  return [
    { p: 0, v: 0 },
    { p: 1, v: 100, ease },
  ];
}

function project(ease: string): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "m", trigger: { type: "manual" }, tracks: [track(ease)] }],
  };
}

const engine = (interpolator = createGsapInterpolator(gsap)) =>
  new Engine({
    clock: createManualClock(),
    interpolator,
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({ models: [Out] }),
  });

describe("an unknown ease", () => {
  it("is refused by load, naming the rule and the ease", () => {
    expect(() => engine().load(project("nonsense.out"))).toThrow(/ease-unknown.*nonsense\.out/);
  });

  it("is refused by addTrack", () => {
    const handle = engine().load(project("power2.out"));
    expect(() => handle.addTrack(track("nonsense.out", "other"))).toThrow(/ease-unknown/);
  });

  it("is refused by an authored value write and leaves the last good value", () => {
    const handle = engine().load(project("power2.out"));
    handle.mount("m/t");
    expect(() => handle.track("m/t").input.values.set({ x: stops("nonsense.out") })).toThrow(
      /ease-unknown/,
    );
    const patch = handle.seek("m/t", 0.5).patches.find(({ nodeId }) => nodeId === "m/t");
    expect(patch?.status).toBe("ready");
  });

  it("is refused by the one-tween interpolator as well", () => {
    expect(() =>
      createGsapOneTweenInterpolator(gsap).create({
        duration: 1,
        keyframes: { x: stops("nonsense.out") },
      }),
    ).toThrow(/ease-unknown/);
  });

  it.each(["none", "power2.out", "bounce.out", "back.out(1.7)", "steps(5)", "expo.inOut"])(
    "accepts %s",
    (ease) => {
      expect(() => engine().load(project(ease))).not.toThrow();
    },
  );
});
