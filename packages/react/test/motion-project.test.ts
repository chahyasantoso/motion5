import { createElement, useLayoutEffect } from "react";
import { act, create, type ReactTestRenderer } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PluginCatalog, type ProjectDefinition } from "@motion5/core";
import { Spec, defineModel } from "@motion5/core/plugin-api";
import { createFakeInterpolator } from "@motion5/core/testing";
import { useMotionProject, type MotionProjectState } from "@motion5/react";

const Value = defineModel({ id: "HookValue", spec: Spec.record({ x: Spec.number() }) });
const catalog = new PluginCatalog({ models: [Value] });
const interpolator = createFakeInterpolator();

const valid: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "m",
      trigger: { type: "time", duration: 100 },
      tracks: [{ id: "t", output: { model: "HookValue" }, input: { values: { x: 1 } } }],
    },
  ],
  freeTracks: [{ id: "f", output: { model: "HookValue" }, input: { values: { x: 2 } } }],
};

function mount(project: unknown) {
  const states: MotionProjectState[] = [];
  const Probe = () => {
    states.push(useMotionProject(project, catalog, interpolator));
    return null;
  };
  let renderer: ReactTestRenderer | undefined;
  act(() => {
    renderer = create(createElement(Probe));
  });
  return { states, unmount: () => act(() => renderer?.unmount()) };
}

function ready(state: MotionProjectState | undefined) {
  if (state?.kind !== "ready") throw new Error(`Expected ready, got ${state?.kind}.`);
  return state;
}

describe("useMotionProject", () => {
  beforeEach(() => {
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => undefined);
  });
  afterEach(() => vi.unstubAllGlobals());

  it("loads a valid project and mounts every motion and free track", () => {
    const { states } = mount(valid);
    const { handle } = ready(states.at(-1));
    expect([...handle.mountedNodeIds()].sort()).toEqual(["m/t", "~/f"].sort());
  });

  it("answers refused with diagnostics for an invalid project, and builds nothing", () => {
    const { states } = mount({ schemaVersion: 5, motions: [{ id: "m" }] });
    const last = states.at(-1);
    if (last?.kind !== "refused") throw new Error(`Expected refused, got ${last?.kind}.`);
    expect(last.diagnostics.length).toBeGreaterThan(0);
  });

  it("disposes the project on unmount", () => {
    const { states, unmount } = mount(valid);
    const { handle } = ready(states.at(-1));
    unmount();
    expect(() => handle.mount("m/t")).toThrow(/disposed/);
  });

  it("never hands a disposed project to a render that replays", () => {
    const used: string[] = [];
    let latest: MotionProjectState | undefined;
    const Page = () => {
      const state = useMotionProject(valid, catalog, interpolator);
      latest = state;
      // A child's ref or effect reads the handle after commit, as a page binding does.
      useLayoutEffect(() => {
        if (state.kind === "ready") used.push(state.handle.motionIds().join(","));
      });
      return null;
    };
    act(() => {
      create(createElement(Page));
    });
    const first = ready(latest);
    expect(() => act(() => first.replay())).not.toThrow();
    expect(ready(latest).handle).not.toBe(first.handle);
    expect(used.at(-1)).toBe("m");
  });

  it("replays with a new handle and disposes the old one", () => {
    const { states } = mount(valid);
    const first = ready(states.at(-1));
    act(() => first.replay());
    const second = ready(states.at(-1));
    expect(second.handle).not.toBe(first.handle);
    expect(() => first.handle.mount("m/t")).toThrow(/disposed/);
  });
});
