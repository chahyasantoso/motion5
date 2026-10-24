import { afterEach, describe, expect, it, vi } from "vitest";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { RefusalError } from "../../src/runtime/refusal";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import type { Edit } from "../../src/runtime/edit-types";
import { project, record, track } from "../support/v5-builders";

/**
 * The value tier's runtime path: one target read, one delta, and one batch entry.
 *
 * `idle` unrelated tracks sit beside the target. Counting what one edit allocates at two project
 * sizes is deterministic where a timing threshold is not: a path that walks or copies the project
 * allocates more at 201 tracks than at 1, and one that does not allocates the same.
 */

function load(idle: number): { handle: ProjectHandle; runtime: ProjectRuntime } {
  const tracks = [
    track({ id: "target", values: record({ x: 1 }) }),
    track({ id: "other", values: record({ x: 1 }) }),
  ];
  for (let index = 0; index < idle; index += 1)
    tracks.push(track({ id: `idle${index}`, values: record({ x: 1 }) }));
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(project(tracks));
  for (const id of ["demo/target", "demo/other"]) {
    handle.mount(id);
    handle.seek(id, 0);
  }
  return { handle, runtime: runtimeOf(handle) };
}

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

function setX(nodeId: string, x: number): Edit {
  return { kind: "set-field", nodeId, address: { field: "x" }, cell: x };
}

afterEach(() => vi.restoreAllMocks());

describe("a value edit costs the same at any project size", () => {
  const verbs: readonly (readonly [string, (handle: ProjectHandle) => void])[] = [
    ["writeValues", (handle) => handle.track("demo/target").writeValues({ x: 5 })],
    ["values.set", (handle) => handle.track("demo/target").input.values.set({ x: 5 })],
    ["setField", (handle) => handle.track("demo/target").input.values.setField({ field: "x" }, 5)],
    [
      "releaseValues with an overlay",
      (handle) => {
        handle.track("demo/target").writeValues({ x: 7 });
        handle.track("demo/target").releaseValues();
      },
    ],
    ["releaseValues without one", (handle) => handle.track("demo/target").releaseValues()],
  ];

  function allocations(idle: number, run: (handle: ProjectHandle) => void): readonly number[] {
    const { handle } = load(idle);
    const sets = vi.spyOn(Map.prototype, "set");
    const freezes = vi.spyOn(Object, "freeze");
    run(handle);
    const counted = [sets.mock.calls.length, freezes.mock.calls.length];
    sets.mockRestore();
    freezes.mockRestore();
    handle.dispose();
    return counted;
  }

  it.each(verbs)("%s allocates the same with 1 and 201 unrelated tracks", (_name, run) => {
    expect(allocations(201, run)).toEqual(allocations(1, run));
  });
});

describe("the internal batch apply", () => {
  it("answers the empty batch for an empty list and publishes nothing", () => {
    const { handle, runtime } = load(0);
    const flush = vi.spyOn(runtime.graph, "flush");
    const batch = runtime.apply([]);
    expect(batch.patches).toEqual([]);
    expect(flush).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("publishes once for two valid edits on two nodes", () => {
    const { handle, runtime } = load(0);
    const flush = vi.spyOn(runtime.graph, "flush");
    runtime.apply([setX("demo/target", 4), setX("demo/other", 6)]);
    expect(flush).toHaveBeenCalledTimes(1);
    expect(handle.track("demo/target").definition.input?.values).toEqual({ x: 4 });
    expect(handle.track("demo/other").definition.input?.values).toEqual({ x: 6 });
    handle.dispose();
  });

  it("commits nothing and reports index 1 when the second edit is refused", () => {
    const { handle, runtime } = load(0);
    const flush = vi.spyOn(runtime.graph, "flush");
    let caught: unknown;
    try {
      runtime.apply([
        setX("demo/target", 4),
        { kind: "set-field", nodeId: "demo/other", address: { field: "nope" }, cell: 1 },
      ]);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(RefusalError);
    expect((caught as RefusalError).editIndex).toBe(1);
    expect(flush).not.toHaveBeenCalled();
    expect(handle.track("demo/target").definition.input?.values).toEqual({ x: 1 });
    handle.dispose();
  });

  it("lets a later edit see an earlier edit's change to the same node", () => {
    const { handle, runtime } = load(0);
    runtime.apply([setX("demo/target", 2), setX("demo/target", 3)]);
    expect(handle.track("demo/target").definition.input?.values).toEqual({ x: 3 });
    handle.dispose();
  });

  it("keeps a live overlay across an authored edit and clears it on release", () => {
    const { handle, runtime } = load(0);
    runtime.apply([{ kind: "write-live", nodeId: "demo/target", value: { x: 9 } }]);
    runtime.apply([setX("demo/target", 2)]);
    expect(handle.track("demo/target").definition.input?.values).toEqual({ x: 2 });
    runtime.apply([{ kind: "release-live", nodeId: "demo/target" }]);
    handle.dispose();
  });

  it("refuses a list that mixes structural and value edits and changes nothing", () => {
    const { handle, runtime } = load(0);
    const flush = vi.spyOn(runtime.graph, "flush");
    expect(() =>
      runtime.apply([setX("demo/target", 4), { kind: "remove-track", nodeId: "demo/other" }]),
    ).toThrow("cannot mix structural and value edits");
    expect(flush).not.toHaveBeenCalled();
    expect(handle.track("demo/target").definition.input?.values).toEqual({ x: 1 });
    handle.dispose();
  });
});
