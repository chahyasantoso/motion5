import { describe, expect, it } from "vitest";
import {
  createManualClock,
  Engine,
  PluginCatalog,
  type LivePatch,
  type Patch,
  type PatchListener,
  type ProjectHandle,
} from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { onLabelChange, readLabel } from "../src/labels";

function ready(value: unknown): LivePatch {
  return {
    nodeId: "~/tag",
    revision: 1,
    status: "ready",
    outputs: { values: { mode: value as any } },
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

function tagProject() {
  const plugins = new PluginCatalog();
  plugins.register({
    id: "tag",
    inputs: { values: { kind: "record", fields: { mode: { kind: "string" } } } },
    outputs: { values: { kind: "record", fields: { mode: { kind: "string" } } } },
    transform: ({ values }) => ({ values }),
  });
  const project = new Engine({
    plugins,
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({
    schemaVersion: 5,
    motions: [
      {
        id: "scene",
        trigger: { type: "manual" },
        tracks: [{ id: "tag", plugin: "tag", input: { values: { mode: "idle" } } }],
      },
    ],
  });
  project.mount("scene/tag");
  project.seek("scene/tag", 0);
  return project;
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
    const input = source(ready("idle"));
    const project = {
      ...input.project,
      edit(_transaction?: any) {
        throw new Error("schema-commit-reentrant: structural edit during publication");
      },
    };
    let refusal: unknown;
    const dispose = onLabelChange(project, "~/tag", "mode", () => {
      try {
        project.edit((transaction: any) => transaction.addTrack({ id: "other" }));
      } catch (error) {
        refusal = error;
      }
    });
    input.send(ready("walk"));
    expect(String(refusal)).toContain("schema-commit-reentrant:");
    dispose();
  });

  it("N6 a graph delete fires (undefined, previous) once and unsubscribes", () => {
    const project = tagProject();
    project.track("scene/tag").input.values.set({ mode: "walk" });
    const events: unknown[] = [];
    onLabelChange(project, "scene/tag", "mode", (next, previous) => events.push([next, previous]));
    project.edit((transaction) => transaction.track("scene/tag").remove());
    project.edit((transaction) => transaction.addTrack({ id: "tag" }, { motionId: "scene" }));
    expect(events).toEqual([[undefined, "walk"]]);
    project.dispose();
  });

  it("N6b unmount is silent", () => {
    const project = tagProject();
    const events: unknown[] = [];
    const dispose = onLabelChange(project, "scene/tag", "mode", (next) => events.push(next));
    project.unmount("scene/tag");
    expect(events).toEqual([]);
    dispose();
    project.dispose();
  });

  it("N10 destruction with no delivered label fires nothing", () => {
    const input = source({ nodeId: "~/tag", revision: 1, status: "blocked", diagnostics: [] });
    const events: unknown[] = [];
    onLabelChange(input.project, "~/tag", "mode", (next, previous) =>
      events.push([next, previous]),
    );
    input.send({ nodeId: "~/tag", revision: 2, status: "destroyed" });
    expect(events).toEqual([]);
    expect(input.count()).toBe(0);
  });
});
