import { describe, expect, it } from "vitest";
import {
  Engine,
  PluginRegistry,
  type LivePatch,
  type Patch,
  type PatchListener,
  type ProjectHandle,
} from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
function manualClock() {
  const listeners = new Set<() => void>();
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    tick() {
      for (const listener of [...listeners]) listener();
    },
  };
}

// Red-only seam: absence must fail an assertion, not module resolution.
interface LabelSeam {
  readLabel(
    values: Readonly<Record<string, unknown>>,
    key: string,
  ): string | number | boolean | undefined;
  onLabelChange(
    project: Pick<ProjectHandle, "get" | "subscribeNode">,
    nodeId: string,
    key: string,
    listener: (
      next: string | number | boolean | undefined,
      previous: string | number | boolean | undefined,
    ) => void,
  ): () => void;
}
const labels = (await import(new URL("../src/labels.ts", import.meta.url).href).catch(
  () => ({}),
)) as LabelSeam;
const readLabel: LabelSeam["readLabel"] = (...args) => {
  expect(typeof labels.readLabel).toBe("function");
  return labels.readLabel(...args);
};
const onLabelChange: LabelSeam["onLabelChange"] = (...args) => {
  expect(typeof labels.onLabelChange).toBe("function");
  return labels.onLabelChange(...args);
};

function ready(value: unknown): LivePatch {
  return {
    nodeId: "~/tag",
    revision: 1,
    status: "ready",
    values: { mode: value },
    sourceProgress: 0,
    sourceRevisions: {},
    diagnostics: [],
  };
}
function source(initial?: LivePatch) {
  let current = initial;
  const listeners = new Set<PatchListener>();
  let releases = 0;
  const project: Pick<ProjectHandle, "get" | "subscribeNode"> = {
    get: () => current,
    subscribeNode: (_id, listener) => {
      listeners.add(listener);
      return () => {
        releases += 1;
        listeners.delete(listener);
      };
    },
  };
  return {
    project,
    count: () => listeners.size,
    releases: () => releases,
    send(patch: Patch) {
      current = patch.status === "destroyed" ? undefined : patch;
      for (const listener of [...listeners]) listener(patch);
    },
  };
}

describe("label edges over published state", () => {
  it("N4 reads only finite label leaves, including false, zero and empty string", () => {
    for (const value of ["idle", "", false, true, 0, -3]) {
      expect(readLabel({ mode: value }, "mode")).toBe(value);
    }
    for (const value of [undefined, null, NaN, Infinity, {}, [], () => 0]) {
      expect(readLabel({ mode: value }, "mode")).toBeUndefined();
    }
    expect(readLabel({}, "mode")).toBeUndefined();
  });

  it("N5 skips the initial call, emits only changes and retains the last delivered baseline", () => {
    const input = source(ready("idle"));
    const events: unknown[] = [];
    const dispose = onLabelChange(input.project, "~/tag", "mode", (next, previous) =>
      events.push([next, previous]),
    );
    expect(events).toEqual([]);
    input.send(ready("idle"));
    input.send(ready(false));
    input.send(ready(false));
    input.send(ready(0));
    input.send(ready(undefined));
    input.send(ready(undefined));
    expect(events).toEqual([
      [false, "idle"],
      [0, false],
      [undefined, 0],
    ]);
    dispose();
  });

  it("N7 releases once on repeated disposal and receives nothing afterwards", () => {
    const input = source(ready("idle"));
    const events: unknown[] = [];
    const dispose = onLabelChange(input.project, "~/tag", "mode", (next) => events.push(next));
    dispose();
    dispose();
    input.send(ready("walk"));
    expect(input.releases()).toBe(1);
    expect(input.count()).toBe(0);
    expect(events).toEqual([]);
  });

  it("N8 blocked and error then ready with the same label emit nothing", () => {
    const input = source(ready("idle"));
    const events: unknown[] = [];
    const dispose = onLabelChange(input.project, "~/tag", "mode", (next, previous) =>
      events.push([next, previous]),
    );
    input.send({ nodeId: "~/tag", revision: 2, status: "blocked", diagnostics: [] });
    input.send(ready("idle"));
    input.send({ nodeId: "~/tag", revision: 3, status: "error", diagnostics: [] });
    input.send(ready("idle"));
    expect(events).toEqual([]);
    input.send(ready("walk"));
    expect(events).toEqual([["walk", "idle"]]);
    dispose();
  });

  it("terminal delivery releases even when the listener throws", () => {
    const input = source(ready("idle"));
    const failure = new Error("listener failed");
    const dispose = onLabelChange(input.project, "~/tag", "mode", () => {
      throw failure;
    });
    expect(() => input.send({ nodeId: "~/tag", revision: 2, status: "destroyed" })).toThrow(
      failure,
    );
    expect(input.count()).toBe(0);
    dispose();
    expect(input.releases()).toBe(1);
  });

  it("an absent or initially retained patch establishes no initial label", () => {
    for (const initial of [
      undefined,
      { nodeId: "~/tag", revision: 1, status: "blocked", diagnostics: [] } as const,
    ]) {
      const input = source(initial);
      const events: unknown[] = [];
      const dispose = onLabelChange(input.project, "~/tag", "mode", (next, previous) =>
        events.push([next, previous]),
      );
      input.send(ready("idle"));
      expect(events).toEqual([["idle", undefined]]);
      dispose();
    }
  });

  it("N9 refuses synchronous structural writes from a listener", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "tag",
      keys: ["mode"],
      compose: (values) => values,
    });
    const project = new Engine({
      plugins: registry,
      clock: manualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load({
      schemaVersion: 5,
      motions: [
        {
          id: "scene",
          trigger: { type: "manual" },
          tracks: [{ id: "tag", keyframes: { tag: { values: { mode: "idle" } } } }],
        },
      ],
    });
    project.mount("scene/tag");
    let refusal: unknown;
    const dispose = onLabelChange(project, "scene/tag", "mode", () => {
      try {
        project.edit((transaction) => transaction.addTrack({ id: "other" }));
      } catch (error) {
        refusal = error;
      }
    });
    project.track("scene/tag").setValues({ mode: "walk" });
    expect(String(refusal)).toContain("schema-commit-reentrant:");
    const patch = project.get("scene/tag");
    if (patch?.status !== "ready") throw new Error(`Unexpected ${patch?.status}.`);
    expect(patch.values.mode).toBe("walk");
    dispose();
    project.dispose();
  });
});
