import { describe, expect, it } from "vitest";
import type { LiveValues, ProjectHandle } from "@motion5/core";
import { patchRender, unreachable } from "@motion5/core/plugin-api";
import type { Runner } from "../src/runner";
import { fixture as runnerFixture } from "./support/runner-fixture";
import { patchValues } from "./support/patch-values";

function fixture() {
  return runnerFixture(["a", "b"], { x: 0, y: 0 });
}
function readyValues(project: ProjectHandle, id = "a") {
  const decision = patchRender(project.get(`scene/${id}`));
  switch (decision.kind) {
    case "render":
      return patchValues(decision.patch);
    case "retain":
    case "gone":
      throw new Error("Expected a ready patch.");
    default:
      return unreachable(decision);
  }
}
const writer = (id: string, values: LiveValues): Runner => ({
  nodeId: `scene/${id}`,
  step: () => ({ kind: "write", values }),
});

describe("runner lifecycle adversarial contracts", () => {
  it("refuses disposal inside step before any cleanup batch and still isolates that runner", () => {
    const f = fixture();
    let stop = () => {};
    const disposed: string[] = [];
    stop = f.attach([
      {
        nodeId: "scene/a",
        step: () => {
          stop();
          throw new Error("unreachable");
        },
        dispose: () => {
          disposed.push("a");
        },
      },
      {
        ...writer("b", { x: 3, y: 0 }),
        dispose: () => {
          disposed.push("b");
        },
      },
    ]);
    f.clock.tick();
    expect(f.batches()).toBe(1);
    expect(f.failures.map((failure) => failure.kind)).toEqual(["step-threw"]);
    expect(disposed).toEqual(["a"]);
    expect(readyValues(f.project, "b").x).toBe(3);
    stop();
    expect(disposed).toEqual(["a", "b"]);
    expect(readyValues(f.project, "b").x).toBe(0);
    f.project.dispose();
  });

  it("refuses disposal inside failed-runner cleanup without skipping surviving writes", () => {
    const f = fixture();
    let stop = () => {};
    stop = f.attach([
      {
        nodeId: "scene/a",
        step: () => {
          throw new Error("step");
        },
        dispose: () => {
          stop();
        },
      },
      writer("b", { x: 5, y: 0 }),
    ]);
    f.clock.tick();
    expect(f.batches()).toBe(1);
    expect(f.failures.map((failure) => failure.kind)).toEqual(["step-threw", "dispose-threw"]);
    expect(readyValues(f.project, "b").x).toBe(5);
    stop();
    f.project.dispose();
  });

  it("refuses callback cleanup but permits the disposer after the tick error returns", () => {
    const f = fixture();
    let stop = () => {};
    stop = f.attach(
      [
        {
          nodeId: "scene/a",
          step: () => {
            throw 1;
          },
        },
        writer("b", { x: 8, y: 0 }),
      ],
      (failure) => {
        f.failures.push(failure);
        stop();
      },
    );
    expect(() => f.clock.tick()).toThrow("during clock dispatch");
    expect(f.batches()).toBe(1);
    expect(readyValues(f.project, "b").x).toBe(8);
    expect(stop).not.toThrow();
    expect(readyValues(f.project, "b").x).toBe(0);
    f.project.dispose();
  });

  it("refuses a write that omits a required field instead of merging it", () => {
    const f = fixture();
    let values: LiveValues = { x: 3, y: 4 };
    const stop = f.attach([{ nodeId: "scene/a", step: () => ({ kind: "write", values }) }]);
    f.clock.tick();
    expect(readyValues(f.project).y).toBe(4);

    // A write carries the whole value, so omitting an authored field is refused and releases the
    // overlay rather than leaving a half-merged pose.
    values = { x: 5 };
    f.clock.tick();
    expect(f.failures.map((failure) => failure.kind)).toEqual(["write-refused"]);
    expect([readyValues(f.project).x, readyValues(f.project).y]).toEqual([0, 0]);
    stop();
    f.project.dispose();
  });
});
