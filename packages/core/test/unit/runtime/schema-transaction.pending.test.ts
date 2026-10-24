import { UNJUDGED_CAPABILITIES } from "../../../src/ports/plugin-capabilities";
import { describe, expect, it } from "vitest";
import type { MotionDefinition, ProjectDefinition } from "../../../src/contract/v5";
import { IncrementalGraphBuilder } from "../../../src/graph/builders/incremental";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";

const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
const FOOT_ID = "hero/foot";
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: MOTION_ID,
      trigger: { type: "manual" },
      tracks: [
        { id: "arm" },
        {
          id: "leg",
          plugin: "demo",
          input: { values: {}, requires: { base: ARM_ID } },
        },
      ],
    },
  ],
};
const compose = (node: { id: string }) => () => ({
  outputs: { values: { [node.id]: 1 } },
  sourceProgress: 0,
  sourceRevisions: {},
});

function editing(runtime: ProjectRuntime): ProjectRuntime {
  expect(typeof runtime.edit).toBe("function");
  return runtime;
}

interface Rig {
  readonly runtime: ProjectRuntime;
  readonly journal: readonly string[];
  readonly builds: number;
  readonly sequence: number;
  readonly graph: object;
}

function rig(): Rig {
  const entries: string[] = [];
  const record = (line: string): void => {
    entries.push(line);
  };
  const inner = new IncrementalGraphBuilder(UNJUDGED_CAPABILITIES);
  let builds = 0;
  const staged = (nodeId: string): StagedTrack => ({
    commit: () => record(`stage-commit ${nodeId}`),
    rollback: () => record(`stage-rollback ${nodeId}`),
  });
  const options: ProjectRuntimeOptions = {
    clock: createManualClock(),
    compose,
    graphBuilder: {
      build: (project) => {
        builds += 1;
        return inner.build(project);
      },
    },
    compileTrack: (track, nodeId) => record(`compile ${String(nodeId)} ${String(track.duration)}`),
    disposeTrack: (nodeId) => record(`dispose ${nodeId}`),
    stageTrack: (track, nodeId) => {
      record(`stage ${nodeId} ${String(track.duration)}`);
      return staged(nodeId);
    },
    addMotionTrack: (_motionId, trackId, duration) =>
      record(`motion-add ${trackId} ${String(duration)}`),
    replaceMotionTrack: (_motionId, trackId, duration) =>
      record(`motion-replace ${trackId} ${String(duration)}`),
    removeMotionTrack: (_motionId, trackId) => record(`motion-remove ${trackId}`),
    createMotion: (definition) => record(`motion-create ${definition.id}`),
    destroyMotion: (motionId) => record(`motion-destroy ${motionId}`),
    setMotionStagger: (motionId, stagger) =>
      record(`motion-stagger ${motionId} ${String(stagger)}`),
  };
  const runtime = new ProjectRuntime(PROJECT, options);
  return {
    runtime,
    get journal() {
      return [...entries];
    },
    get builds() {
      return builds;
    },
    get sequence() {
      return runtime.graph.sequence;
    },
    get graph() {
      return runtime.graph.graph;
    },
  };
}

describe("one recipe is one transaction", () => {
  it("RA-66 returns the recipe's answer and commits nothing when nothing changed", () => {
    const test = rig();
    test.runtime.track(LEG_ID).input.requires.set("base", ARM_ID);
    const graph = test.graph;
    const builds = test.builds;
    const sequence = test.sequence;
    const journal = test.journal;

    const answer = editing(test.runtime).edit((tx) => {
      // Both no-ops on this tier's idempotence rule: a redundant add and an absent remove.
      tx.track(LEG_ID).input.requires.set("base", ARM_ID);
      tx.track(LEG_ID).input.requires.remove("foot");
      return tx.tryTrack(HAND_ID);
    });

    // The recipe's value is the caller's, which is what makes `edit` usable for a lookup that
    // happens to make no change.
    expect(answer).toBeUndefined();
    // A recipe that staged nothing must not spend a candidate build or a frame's worth of flush
    // machinery saying so, on exactly the rule `RA-10` states for a commit that derives no node.
    expect(test.builds).toBe(builds);
    expect(test.sequence).toBe(sequence);
    expect(test.graph).toBe(graph);
    expect(test.journal).toEqual(journal);

    test.runtime.dispose();
  });
});
