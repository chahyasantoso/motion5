import { describe, expect, it } from "vitest";
import type { LiveValues } from "@motion5/core";
import type { Runner } from "../src/runner";
import { fixture as runnerFixture } from "./support/runner-fixture";

function fixture() {
  return runnerFixture(["a", "b"], { x: 0, y: 0 });
}
const writer = (id: string, values: LiveValues): Runner => ({
  nodeId: `scene/${id}`,
  step: () => ({ kind: "write", values }),
});

describe("runner lifecycle adversarial contracts", () => {
  it("refuses nested runner dispatch and resets its guard after the outer tick", () => {
    const f = fixture();
    const stop = f.attach([
      {
        nodeId: "scene/a",
        step: () => {
          f.clock.tick();
          return { kind: "hold" };
        },
      },
      writer("b", { x: 4 }),
    ]);
    f.clock.tick();
    expect(f.batches()).toBe(1);
    expect(f.failures.map((failure) => failure.kind)).toEqual(["step-threw"]);
    expect(() => f.clock.tick()).not.toThrow();
    stop();
    f.project.dispose();
  });

  it("normal cleanup skips removed nodes without reporting a runner failure", () => {
    const f = fixture();
    let disposed = 0;
    const stop = f.attach([
      {
        ...writer("a", { x: 1 }),
        dispose: () => {
          disposed += 1;
        },
      },
    ]);
    f.project.edit((tx) => tx.track("scene/a").remove());
    stop();
    expect(f.failures).toEqual([]);
    expect(disposed).toBe(1);
    f.project.dispose();
  });

  it("reports failed recovery, every disposal error and project errors without losing callback attempts", () => {
    const f = fixture();
    const originalValues = f.port.values;
    const originalTryTrack = f.port.tryTrack;
    const refused = new Error("write");
    f.port.values = (recipe) =>
      originalValues((tx) =>
        recipe({
          ...tx,
          tryTrack: (id) => {
            const track = originalTryTrack(id);
            return track === undefined
              ? undefined
              : {
                  ...track,
                  overrideValues: () => {
                    throw refused;
                  },
                };
          },
        }),
      );
    const stop = f.attach([
      {
        ...writer("a", { x: 1 }),
        dispose: () => {
          throw "a";
        },
      },
      {
        ...writer("b", { x: 2 }),
        dispose: () => {
          throw "b";
        },
      },
    ]);
    f.clock.tick();
    expect(f.failures.map((failure) => failure.kind)).toEqual([
      "write-refused",
      "write-refused",
      "write-refused",
      "write-refused",
      "dispose-threw",
      "dispose-threw",
    ]);
    expect(f.batches()).toBe(1);
    stop();
    f.project.dispose();
  });

  it("unavailable stop attempts all disposals even when both disposers and reporters throw", () => {
    const f = fixture();
    const first = new Error("first report");
    const stop = f.attach(
      ["a", "b"].map((id) => ({
        ...writer(id, { x: 1 }),
        dispose: () => {
          throw id;
        },
      })),
      (failure) => {
        f.failures.push(failure);
        throw first;
      },
    );
    f.project.dispose();
    expect(() => f.clock.tick()).toThrow(first);
    expect(f.failures.map((failure) => failure.kind)).toEqual([
      "project-unavailable",
      "dispose-threw",
      "dispose-threw",
    ]);
    expect(stop).not.toThrow();
    expect(() => f.clock.tick()).not.toThrow();
  });
});
