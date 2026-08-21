import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type StagedTrack } from "../../../src/runtime/project-runtime";

/**
 * Issue #176, the seam half.
 *
 * `ProjectRuntime` sequences a mutation; the owner of the compiled map publishes and releases
 * compiled Tracks. `stageTrack` is the seam between them. It publishes the replacement
 * immediately, because `compose` and `Motion` both resolve by id against the live map (ADR-031),
 * and it holds whatever that write displaced until the runtime says every step that can fail has
 * succeeded.
 *
 * The seam is injected here rather than driven through `Engine`, so what these cases pin is the
 * transaction the runtime runs and its order, not the Tracks one composition happens to build.
 * `replace-track-transactionality.test.ts` covers the same invariant from the public surface.
 * See ADR-045.
 */

const NODE_ID = "hero/arm";
const BASE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};
/** Rejected by the candidate graph rather than by authored validation, so the rollback runs. */
const REJECTED_REPLACEMENT: TrackDefinition = {
  id: "arm",
  observes: [{ source: "~/missing", role: "input", projection: { map: { x: "parentX" } } }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

interface JournalFailures {
  readonly rollback?: Error;
  readonly motion?: Error;
}
interface Journal {
  readonly entries: readonly string[];
  readonly stageTrack: (track: TrackDefinition, nodeId: string) => StagedTrack;
  readonly replaceMotionTrack: (motionId: string, trackId: string, duration?: number) => void;
}
/**
 * One ordered journal for both hooks, because the order is the invariant.
 *
 * A rollback that restored the Motion entry before it republished the displaced Track would have
 * re-seeded the instance it is about to discard, and two separate counters could not tell the
 * difference. Only the first Motion call fails, so a restoring call inside a rollback stays
 * observable.
 */
function journal(failures: JournalFailures = {}): Journal {
  const entries: string[] = [];
  let motionCalls = 0;
  const record = (line: string): void => {
    entries.push(line);
  };
  return {
    get entries() {
      return [...entries];
    },
    stageTrack: (_track, nodeId) => {
      record(`stage ${nodeId}`);
      return {
        commit: () => record(`commit ${nodeId}`),
        rollback: () => {
          record(`rollback ${nodeId}`);
          if (failures.rollback) throw failures.rollback;
        },
      };
    },
    replaceMotionTrack: (_motionId, trackId, duration) => {
      motionCalls += 1;
      record(`motion ${trackId} ${String(duration)}`);
      if (failures.motion && motionCalls === 1) throw failures.motion;
    },
  };
}
function runtimeWith(hooks: Journal): ProjectRuntime {
  return new ProjectRuntime(BASE_PROJECT, {
    clock: createManualClock(),
    compose,
    stageTrack: hooks.stageTrack,
    replaceMotionTrack: hooks.replaceMotionTrack,
  });
}
/** Returns the thrown value, because each case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("a Track replacement is staged once and committed once", () => {
  it("U-5 commits the staging only after the Motion entry and the graph accepted it", () => {
    const hooks = journal();
    const runtime = runtimeWith(hooks);

    runtime.track(NODE_ID).replace({ id: "arm", duration: 250 });

    expect(hooks.entries).toEqual(["stage hero/arm", "motion hero/arm 250", "commit hero/arm"]);
    expect(runtime.track(NODE_ID).track).toEqual({ id: "arm", duration: 250 });

    runtime.dispose();
  });

  it("U-6 rolls the staging back and restores the Motion entry when the graph rejects", () => {
    const hooks = journal();
    const runtime = runtimeWith(hooks);

    const thrown = thrownBy(() => runtime.track(NODE_ID).replace(REJECTED_REPLACEMENT));

    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    expect(hooks.entries).toEqual([
      "stage hero/arm",
      "motion hero/arm undefined",
      "rollback hero/arm",
      "motion hero/arm undefined",
    ]);
    expect(runtime.track(NODE_ID).track).toEqual({ id: "arm" });

    runtime.dispose();
  });

  it("U-7 commits nothing when the Motion refuses the replacement", () => {
    const refusal = new Error("Motion refused the replacement.");
    const hooks = journal({ motion: refusal });
    const runtime = runtimeWith(hooks);

    const thrown = thrownBy(() => runtime.track(NODE_ID).replace({ id: "arm", duration: 250 }));

    expect(thrown).toBe(refusal);
    // The Motion refuses before it writes anything (ADR-031), so it is not restored a second time.
    const expected = ["stage hero/arm", "motion hero/arm 250", "rollback hero/arm"];
    expect(hooks.entries).toEqual(expected);
    expect(runtime.track(NODE_ID).track).toEqual({ id: "arm" });

    runtime.dispose();
  });

  it("U-8 reports the graph rejection first when the staging rollback throws", () => {
    const failure = new Error("staged Track dispose failed");
    const hooks = journal({ rollback: failure });
    const runtime = runtimeWith(hooks);

    const thrown = thrownBy(() => runtime.track(NODE_ID).replace(REJECTED_REPLACEMENT));

    // The same precedence rule as `P-1` and `P-2`, at the call site that now owns a rollback set.
    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    const errors = (thrown as AggregateError).errors as readonly unknown[];
    expect(errors[0]).toBeInstanceOf(TypeError);
    expect(errors[1]).toBe(failure);

    runtime.dispose();
  });
});
