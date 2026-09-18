import { describe, expect, it } from "vitest";
import type { MotionDefinition, TrackDefinition } from "../../../src/contract/v5";
import { AUTHORED } from "../../../src/runtime/value-state";
import { planCommit, type CommitDocument, type CommitPlan } from "../../../src/runtime/commit-plan";
import { runPlan, type PlanPorts, type PlanStaged } from "../../../src/runtime/run-plan";

/**
 * Issue #443, phase A step 6: what the one impure walk does when a step refuses.
 *
 * `commit-plan.test.ts` covers the pure half, and the behaviour of a whole commit is already pinned
 * through a real `ProjectRuntime` by `structural-commit-path.test.ts` and its siblings. What neither
 * can reach is the failure ordering this module owns, because reaching it through the runtime means
 * arranging for an injected hook to throw at exactly one of seven positions. So these cases drive
 * `runPlan` directly against one total set of ports over one ordered journal, and every claim is
 * that journal: what ran, in what order, and what did not run at all.
 *
 * The three orderings under test are the ones a comment cannot enforce. An effect is recorded before
 * liveness is re-asked, so a disposal arriving mid-flight rolls that effect back rather than leaking
 * it. Inverses run in apply order. Acceptance is the seam, so nothing before it survives a failure
 * and nothing after it is rolled back. See ADR-035, ADR-045, ADR-067 and ADR-071.
 */

const ARM: TrackDefinition = { id: "arm" };
const ARM_LONGER: TrackDefinition = { id: "arm", duration: 500 };
const HAND: TrackDefinition = { id: "hand", duration: 250 };
const HERO: MotionDefinition = { id: "hero", trigger: { type: "manual" }, tracks: [] };
const ARM_NODE = "hero/arm";
const HAND_NODE = "hero/hand";

const entry = (track: TrackDefinition, motionId?: string) => ({
  track,
  motionId,
  valueState: AUTHORED,
});

const doc = (
  tracks: readonly [string, ReturnType<typeof entry>][],
  motions: readonly [string, { definition: MotionDefinition }][] = [],
): CommitDocument => ({ tracks: new Map(tracks), motions: new Map(motions) });

interface Rig {
  readonly ports: PlanPorts;
  readonly journal: readonly string[];
}

/**
 * One total set of ports over one ordered journal.
 *
 * Every port records itself, so a case reads one list instead of sixteen spies. A port named in
 * `failing` throws after recording rather than before, because a step that threw still happened and
 * a journal that hid it would make the rollback claims unreadable.
 */
function rig(failing: readonly string[] = []): Rig {
  const journal: string[] = [];
  const record = (line: string): void => {
    journal.push(line);
    if (failing.includes(line)) throw new Error(`refused ${line}`);
  };
  const handleFor = (nodeId: string): PlanStaged => ({
    commit: () => record(`stage-commit ${nodeId}`),
    rollback: () => record(`stage-rollback ${nodeId}`),
  });
  const ports: PlanPorts = {
    createMotion: (definition) => record(`create-motion ${definition.id}`),
    destroyMotion: (motionId) => record(`destroy-motion ${motionId}`),
    compileTrack: (_track, nodeId) => record(`compile ${nodeId}`),
    disposeTrack: (nodeId) => record(`dispose ${nodeId}`),
    stageTrack: (_track, nodeId) => {
      record(`stage ${nodeId}`);
      return handleFor(nodeId);
    },
    commitStaged: (staged, nodeId) => {
      record(`commit-staged ${nodeId}`);
      staged?.commit();
    },
    rollbackStaged: (staged, nodeId) => {
      record(`rollback-staged ${nodeId}`);
      staged?.rollback();
    },
    replaceMotionTrack: (motionId, nodeId, duration) =>
      record(`retarget ${motionId} ${nodeId} ${String(duration)}`),
    evictNode: (nodeId) => record(`evict ${nodeId}`),
    mountNode: (nodeId) => record(`mount ${nodeId}`),
    addMotionTrack: (motionId, nodeId) => record(`motion-add ${motionId} ${nodeId}`),
    removeMotionTrack: (motionId, nodeId) => record(`motion-remove ${motionId} ${nodeId}`),
    assertLive: () => record("assert-live"),
    accept: () => record("accept"),
    adopt: () => record("adopt"),
    publish: (seeds) => record(`publish ${seeds.join(",")}`),
  };
  return {
    ports,
    get journal() {
      return [...journal];
    },
  };
}

/** Returns the thrown value, because each failure case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

/** Adding one owned track: one reversible effect, then three settlements. */
function addingPlan(): CommitPlan {
  return planCommit(
    doc([[ARM_NODE, entry(ARM, "hero")]], [["hero", { definition: HERO }]]),
    doc(
      [
        [ARM_NODE, entry(ARM, "hero")],
        [HAND_NODE, entry(HAND, "hero")],
      ],
      [["hero", { definition: HERO }]],
    ),
    { needsBuild: new Set(), readers: new Map() },
  );
}

/** Replacing one owned track: it stages and retargets, so it has two effects to restore. */
function replacingPlan(): CommitPlan {
  return planCommit(
    doc([[ARM_NODE, entry(ARM, "hero")]], [["hero", { definition: HERO }]]),
    doc([[ARM_NODE, entry(ARM_LONGER, "hero")]], [["hero", { definition: HERO }]]),
    { needsBuild: new Set([ARM_NODE]), readers: new Map() },
  );
}

describe("the commit walk", () => {
  it("applies, re-asks liveness after each effect, accepts, adopts, then settles", () => {
    const test = rig();

    runPlan(replacingPlan(), test.ports);

    expect(test.journal).toEqual([
      `stage ${ARM_NODE}`,
      "assert-live",
      `retarget hero ${ARM_NODE} 500`,
      "assert-live",
      "accept",
      "adopt",
      `commit-staged ${ARM_NODE}`,
      `stage-commit ${ARM_NODE}`,
      `publish ${ARM_NODE}`,
    ]);
  });

  it("records an effect before liveness is re-asked, so a disposal rolls that effect back", () => {
    const test = rig(["assert-live"]);

    const thrown = thrownBy(() => runPlan(replacingPlan(), test.ports));

    // The stage had already been taken when liveness refused, and the whole point of recording it
    // before asking is that the refusal releases it instead of leaving it installed.
    expect((thrown as Error).message).toBe("refused assert-live");
    expect(test.journal).toEqual([
      `stage ${ARM_NODE}`,
      "assert-live",
      `rollback-staged ${ARM_NODE}`,
      `stage-rollback ${ARM_NODE}`,
    ]);
  });

  it("leaves an effect that refused out of the rollback, since it never completed", () => {
    const test = rig([`retarget hero ${ARM_NODE} 500`]);

    thrownBy(() => runPlan(replacingPlan(), test.ports));

    expect(test.journal).toEqual([
      `stage ${ARM_NODE}`,
      "assert-live",
      `retarget hero ${ARM_NODE} 500`,
      `rollback-staged ${ARM_NODE}`,
      `stage-rollback ${ARM_NODE}`,
    ]);
  });

  it("restores every applied effect in apply order when acceptance refuses, and never adopts", () => {
    const test = rig(["accept"]);

    thrownBy(() => runPlan(replacingPlan(), test.ports));

    // Apply order, not reverse order: the stage is released before the Motion child is retargeted
    // back, because Motion resolves compiled Tracks by id. The retarget's inverse carries the
    // duration the definition had, which is why it can be answered at all once the pair has moved.
    expect(test.journal).toEqual([
      `stage ${ARM_NODE}`,
      "assert-live",
      `retarget hero ${ARM_NODE} 500`,
      "assert-live",
      "accept",
      `rollback-staged ${ARM_NODE}`,
      `stage-rollback ${ARM_NODE}`,
      `retarget hero ${ARM_NODE} undefined`,
    ]);
    expect(test.journal).not.toContain("adopt");
  });

  it("carries the rejection first when the rollback fails on its own", () => {
    const test = rig(["accept", `retarget hero ${ARM_NODE} undefined`]);

    const thrown = thrownBy(() => runPlan(replacingPlan(), test.ports));

    // Suppress and attach, never suppress and drop: a host whose teardown throws cannot replace the
    // diagnosis with its own unrelated failure.
    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as AggregateError).errors).toHaveLength(2);
    expect((thrown as Error).message).toContain("refused accept");
    expect((thrown as Error).message).toContain("Rollback failed");
    expect(test.journal).not.toContain("adopt");
  });

  it("attempts every settlement past a failure and still publishes last", () => {
    const test = rig([`motion-add hero ${HAND_NODE}`]);

    const thrown = thrownBy(() => runPlan(addingPlan(), test.ports));

    // An accepted graph cannot be rolled back, so a failing settlement cannot skip the ones after
    // it, and publication is one of those rather than a phase beside them.
    expect(test.journal).toEqual([
      `compile ${HAND_NODE}`,
      "assert-live",
      "accept",
      "adopt",
      `motion-add hero ${HAND_NODE}`,
      `mount ${HAND_NODE}`,
      `publish ${HAND_NODE}`,
    ]);
    // One failure keeps its identity rather than arriving wrapped in a summary.
    expect((thrown as Error).message).toBe(`refused motion-add hero ${HAND_NODE}`);
  });

  it("is handed a plan nothing can edit after it was derived", () => {
    const plan = replacingPlan();

    expect(Object.isFrozen(plan)).toBe(true);
    expect(Object.isFrozen(plan.effects)).toBe(true);
    expect(Object.isFrozen(plan.settle)).toBe(true);
    expect(plan.effects.every((effect) => Object.isFrozen(effect))).toBe(true);
    expect(plan.settle.every((settlement) => Object.isFrozen(settlement))).toBe(true);
  });
});
