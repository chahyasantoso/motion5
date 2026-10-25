import { describe, expect, it } from "vitest";
import type { PluginDefinition } from "../../../src/contract/v5";
import { parseTrackDefinition } from "../../../src/contract/v5-parse";
import type { ParsedValues } from "../../../src/contract/v5-parse";
import type { Interpolator } from "../../../src/ports/interpolator";
import { replaceEvaluator } from "../../../src/runtime/evaluator-replacement";
import { PluginTrack } from "../../../src/runtime/plugin-track";
import { ValueTrack } from "../../../src/runtime/value-track";
import { createFakeInterpolator } from "../../../src/testing/fakes";

const PATH = "motions[0].tracks[0]";

function valuesOf(values: unknown): ParsedValues {
  const outcome = parseTrackDefinition({ id: "values", input: { values } }, PATH);
  if (outcome.kind !== "accepted") throw new Error(JSON.stringify(outcome.diagnostics));
  const parsed = outcome.value.input.values;
  if (parsed === undefined) throw new Error("The fixture authored no values.");
  return parsed;
}

const TEST_PLUGIN: PluginDefinition = {
  id: "test-plugin",
  inputs: {
    values: {
      kind: "table",
      schema: { row: { fields: { x: { kind: "number" } } } },
    },
  },
  outputs: {
    values: {
      kind: "table",
      schema: { row: { fields: { x: { kind: "number" } } } },
    },
  },
  transform(input) {
    return { values: input.values };
  },
};

interface TrackedTimeline {
  killed: boolean;
}

function createControllableInterpolator(): {
  readonly interpolator: Interpolator;
  setFailNext(fail: boolean): void;
  readonly timelines: readonly TrackedTimeline[];
} {
  const base = createFakeInterpolator();
  let failNext = false;
  const recorded: TrackedTimeline[] = [];

  const interpolator: Interpolator = {
    create(config) {
      if (failNext) {
        throw new Error("Simulated evaluator build failure");
      }
      const timeline = base.create(config);
      const record: TrackedTimeline = { killed: false };
      recorded.push(record);
      const originalKill = timeline.kill.bind(timeline);
      timeline.kill = () => {
        record.killed = true;
        originalKill();
      };
      return timeline;
    },
  };

  return {
    interpolator,
    setFailNext(fail: boolean) {
      failNext = fail;
    },
    get timelines(): readonly TrackedTimeline[] {
      return recorded;
    },
  };
}

describe("replaceEvaluator", () => {
  it("builds candidate first and leaves prior evaluator undisposed if build throws", () => {
    let disposed = false;
    let installed = false;
    const previous = {
      dispose() {
        disposed = true;
      },
    };

    expect(() =>
      replaceEvaluator(
        previous,
        () => {
          throw new Error("Build failed");
        },
        () => {
          installed = true;
        },
      ),
    ).toThrow("Build failed");

    expect(disposed).toBe(false);
    expect(installed).toBe(false);
  });

  it("installs candidate before disposing previous evaluator on success", () => {
    const callOrder: string[] = [];
    const previous = {
      dispose() {
        callOrder.push("previous.dispose");
      },
    };
    const next = {
      dispose() {
        callOrder.push("next.dispose");
      },
    };

    replaceEvaluator(
      previous,
      () => {
        callOrder.push("build");
        return next;
      },
      (installed) => {
        expect(installed).toBe(next);
        callOrder.push("install");
      },
    );

    expect(callOrder).toEqual(["build", "install", "previous.dispose"]);
  });
});

describe("ValueTrack replaceValues build transactionality", () => {
  it("preserves evaluator and continues evaluating old values when replacement build throws", () => {
    const controllable = createControllableInterpolator();
    const initialValues = valuesOf([
      {
        id: "row-1",
        cells: {
          x: [
            { p: 0, v: 10 },
            { p: 1, v: 20 },
          ],
        },
      },
    ]);
    const track = new ValueTrack({
      nodeId: "track-1",
      values: initialValues,
      interpolator: controllable.interpolator,
    });

    expect(track.outputs()).toEqual({
      values: [{ id: "row-1", cells: { x: 10 } }],
    });
    expect(controllable.timelines[0]?.killed).toBe(false);

    controllable.setFailNext(true);
    const replacementValues = valuesOf([
      {
        id: "row-1",
        cells: {
          x: [
            { p: 0, v: 100 },
            { p: 1, v: 200 },
          ],
        },
      },
    ]);

    expect(() => track.replaceValues(replacementValues)).toThrow(
      "Simulated evaluator build failure",
    );
    expect(controllable.timelines[0]?.killed).toBe(false);

    // Old values continue to evaluate cleanly across progress
    expect(track.outputs()).toEqual({
      values: [{ id: "row-1", cells: { x: 10 } }],
    });
    track.setProgress(0.5);
    expect(track.outputs()).toEqual({
      values: [{ id: "row-1", cells: { x: 15 } }],
    });
    track.setProgress(1);
    expect(track.outputs()).toEqual({
      values: [{ id: "row-1", cells: { x: 20 } }],
    });

    // Successful rebuild disposes the previous evaluator and applies new values
    controllable.setFailNext(false);
    track.replaceValues(replacementValues);
    expect(controllable.timelines[0]?.killed).toBe(true);
    expect(controllable.timelines[1]?.killed).toBe(false);
    expect(track.outputs()).toEqual({
      values: [{ id: "row-1", cells: { x: 200 } }],
    });

    track.dispose();
    expect(controllable.timelines[1]?.killed).toBe(true);
  });
});

describe("PluginTrack replaceValues build transactionality", () => {
  it("preserves evaluator and continues evaluating old values when replacement build throws", () => {
    const controllable = createControllableInterpolator();
    const initialValues = valuesOf([
      {
        id: "row-1",
        cells: {
          x: [
            { p: 0, v: 10 },
            { p: 1, v: 20 },
          ],
        },
      },
    ]);
    const track = new PluginTrack({
      nodeId: "plugin-track-1",
      plugin: TEST_PLUGIN,
      values: initialValues,
      interpolator: controllable.interpolator,
    });

    expect(track.compose({}).outputs).toEqual({
      values: [{ id: "row-1", cells: { x: 10 } }],
    });
    expect(controllable.timelines[0]?.killed).toBe(false);

    controllable.setFailNext(true);
    const replacementValues = valuesOf([
      {
        id: "row-1",
        cells: {
          x: [
            { p: 0, v: 100 },
            { p: 1, v: 200 },
          ],
        },
      },
    ]);

    expect(() => track.replaceValues(replacementValues)).toThrow(
      "Simulated evaluator build failure",
    );
    expect(controllable.timelines[0]?.killed).toBe(false);

    // Old values continue to evaluate cleanly in compose
    expect(track.compose({}).outputs).toEqual({
      values: [{ id: "row-1", cells: { x: 10 } }],
    });
    track.setProgress(0.5);
    expect(track.compose({}).outputs).toEqual({
      values: [{ id: "row-1", cells: { x: 15 } }],
    });

    // Successful rebuild disposes the previous evaluator and applies new values
    controllable.setFailNext(false);
    track.replaceValues(replacementValues);
    expect(controllable.timelines[0]?.killed).toBe(true);
    expect(controllable.timelines[1]?.killed).toBe(false);
    expect(track.compose({}).outputs).toEqual({
      values: [{ id: "row-1", cells: { x: 150 } }],
    });

    track.dispose();
    expect(controllable.timelines[1]?.killed).toBe(true);
  });
});
