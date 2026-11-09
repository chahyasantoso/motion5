import { createElement } from "react";
import { act, create } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectHandle } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { builtinModels } from "@motion5/plugins/models";
import { wipePlugin } from "@motion5/plugins/motion/wipe";
import { mergeRefs } from "@motion5/react";
import { useAnchor, type AnchorRefs } from "@motion5/react/engine";

class Box {
  constructor(
    readonly offsetLeft: number,
    readonly offsetTop: number,
    readonly offsetWidth: number,
    readonly offsetHeight: number,
    readonly offsetParent: Box | null,
  ) {}
}

function project(): ProjectHandle {
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: new PluginCatalog({ models: builtinModels, plugins: [wipePlugin] }),
  }).load({
    schemaVersion: 5,
    motions: [
      {
        id: "cover",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "wipe",
            output: { plugin: "wipe" },
            input: { param: { radius: 100, x: 0, y: 0 } },
          },
        ],
      },
    ],
  });
  handle.mount("cover/wipe");
  return handle;
}

describe("useAnchor", () => {
  beforeEach(() => {
    vi.stubGlobal("window", {
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("writes the element's layout centre, measured from the other element's corner", () => {
    const handle = project();
    const page = new Box(0, 0, 1280, 720, null);
    const stage = new Box(100, 50, 1280, 720, page);
    const word = new Box(0, 300, 1280, 200, stage);
    const dot = new Box(950, 95, 40, 40, word);
    let refs: AnchorRefs | undefined;
    const Probe = () => {
      refs = useAnchor(handle, "cover/wipe", { x: "x", y: "y" });
      return null;
    };
    act(() => {
      create(createElement(Probe));
    });
    act(() => {
      refs?.to(stage);
      refs?.from(dot);
    });
    expect(handle.track("cover/wipe").definition.input?.param).toMatchObject({ x: 970, y: 415 });
  });

  it("lets several ref callbacks bind one element", () => {
    const seen: string[] = [];
    const merged = mergeRefs<string>(
      (value) => void seen.push(`a:${value}`),
      (value) => void seen.push(`b:${value}`),
    );
    merged("el");
    expect(seen).toEqual(["a:el", "b:el"]);
  });
});
