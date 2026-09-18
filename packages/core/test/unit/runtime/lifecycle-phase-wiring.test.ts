import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../../src/contract/v5";
import { IncrementalGraphBuilder } from "../../../src/adapters/graph-builder/incremental";
import { createManualClock } from "../../../src/ports/clock";
import { code, member } from "../../helpers/source-region";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";

/**
 * Issue #443, phase A step 3c: the lifecycle wiring.
 *
 * Steps 1 through 3 stated the refusals, the three decoded results and the lifecycle as closed
 * unions, and step 3b made the first two load-bearing. This slice is the third: `#open`,
 * `#valueSeeds`, `#disposed`, `#inFlight` and `#pendingTeardown` become one `#phase`, the two guard
 * rungs and `#commit`'s three checks become one `admit`, and `#boundary` becomes `entering` and
 * `leaving` with `teardownOwed` answering the drain.
 *
 * The claim is that nothing observable moved, so the evidence has two halves that a source scan and
 * a behaviour rig cannot make on their own. `project-phase.test.ts` already proves `admit` agrees
 * with a transcription of the guards across the enumerated state space; what it cannot prove is that
 * the runtime asks it with the class each verb used to ask for, in the phase the runtime actually
 * reaches. So these cases drive a real `ProjectRuntime` into every scope the union can hold,
 * including the two the flat sketch in the issue could not state, and then read the source for the
 * five fields that are supposed to be gone.
 *
 * The clock is manual and never ticks: a publication that only happened because a frame arrived
 * would prove nothing about what a phase admitted.
 */

const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const MOTION_ID = "hero";
const ARM_ID = "hero/arm";
const LEG_ID = "hero/leg";
const HAND_ID = "hero/hand";
const FOOT_ID = "hero/foot";
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: MOTION_ID, trigger: { type: "manual" }, tracks: [{ id: "arm" }, { id: "leg" }] }],
};
/** One key per node, so a shared key cannot hide a missing publication behind an output merge. */
const compose = (node: { id: string }) => () => ({
  values: { [node.id]: 1 },
  sourceProgress: 0,
  sourceRevisions: {},
});

/** Returns the thrown value, because each case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

/** The message of a thrown error, asserted to be one before it is read. */
function messageOf(thrown: unknown): string {
  expect(thrown).toBeInstanceOf(Error);
  return (thrown as Error).message;
}

interface Rig {
  readonly runtime: ProjectRuntime;
  readonly journal: readonly string[];
  readonly releases: number;
  readonly sequence: number;
}

/**
 * One runtime, one ordered journal, and one count of composition releases.
 *
 * `onCompile` is the seam every reentrancy case needs: `compileTrack` is injected code called from
 * inside a commit's own boundary, so it is where a hook can ask this runtime for something while it
 * is one commit deep. Counting releases is what a case can check without asserting on the order of
 * private statements.
 */
function rig(onCompile: (nodeId: string) => void = () => undefined): Rig {
  const entries: string[] = [];
  const record = (line: string): void => {
    entries.push(line);
  };
  const inner = new IncrementalGraphBuilder();
  let releases = 0;
  const options = {
    clock: createManualClock(),
    compose,
    graphBuilder: { build: (project: ProjectDefinition) => inner.build(project) },
    compileTrack: (_track: { duration?: number }, nodeId?: string) => {
      record(`compile ${String(nodeId)}`);
      onCompile(String(nodeId));
    },
    disposeTrack: (nodeId: string) => record(`dispose ${nodeId}`),
    stageTrack: (_track: { duration?: number }, nodeId: string): StagedTrack => {
      record(`stage ${nodeId}`);
      return {
        commit: () => record(`stage-commit ${nodeId}`),
        rollback: () => record(`stage-rollback ${nodeId}`),
      };
    },
    setProgress: (nodeId: string, progress: number) => record(`seek ${nodeId} ${String(progress)}`),
    addMotionTrack: (_motionId: string, trackId: string) => record(`motion-add ${trackId}`),
    removeMotionTrack: (_motionId: string, trackId: string) => record(`motion-remove ${trackId}`),
    disposeComposition: () => {
      releases += 1;
      record("release");
    },
  } as ProjectRuntimeOptions;
  const runtime = new ProjectRuntime(PROJECT, options);
  return {
    runtime,
    get journal() {
      return [...entries];
    },
    get releases() {
      return releases;
    },
    get sequence() {
      return runtime.graph.sequence;
    },
  };
}

describe("the phase admits every verb the two guard rungs used to", () => {
  it("refuses a second recipe and a value verb inside one, with the sentences they already had", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    let nested: unknown;
    let staged: unknown;

    test.runtime.edit(() => {
      nested = thrownBy(() => test.runtime.edit(() => undefined));
      staged = thrownBy(() => test.runtime.seek(ARM_ID, 0.5));
    });

    expect(messageOf(nested)).toBe(
      "schema-transaction-nested: A recipe is already open. Finish it before opening another.",
    );
    expect(messageOf(staged)).toBe(
      'schema-transaction-immediate: "seek" applies immediately and cannot travel with a recipe. Call it outside edit().',
    );

    test.runtime.dispose();
  });

  it("admits a value verb inside a batch and refuses an immediate verb and a commit", () => {
    const test = rig();
    test.runtime.mount(ARM_ID);
    const sequence = test.sequence;
    const deferred: string[] = [];
    let mounted: unknown;
    let structural: unknown;

    const batch = test.runtime.values(() => {
      deferred.push(...test.runtime.seek(ARM_ID, 0.25).seeds);
      deferred.push(...test.runtime.seek(LEG_ID, 0.5).seeds);
      deferred.push(...test.runtime.seek(ARM_ID, 0.75).seeds);
      mounted = thrownBy(() => test.runtime.mount(LEG_ID));
      structural = thrownBy(() => test.runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID }));
    });

    // Every staged write answered its own seed, in the order it was asked and repeats included,
    // which is the list the phase carries rather than the set the sketch asked for.
    expect(deferred).toEqual([ARM_ID, LEG_ID, ARM_ID]);
    expect(messageOf(mounted)).toBe(
      'value-batch-immediate: "mount" publishes or mounts and cannot travel with a value batch. Call it outside values().',
    );
    expect(messageOf(structural)).toBe(
      "value-batch-structural: A value batch is open. Ask for it once values() has returned.",
    );
    // One publication for the three writes, and it named both nodes.
    expect(batch.seeds).toContain(ARM_ID);
    expect(batch.seeds).toContain(LEG_ID);
    expect(test.sequence).toBe(sequence + 1);
    expect(test.runtime.tryTrack(HAND_ID)).toBeUndefined();

    test.runtime.dispose();
  });

  it("admits a recipe opened inside a batch and refuses the commit it closes with", () => {
    const test = rig();
    let refused: unknown;

    const batch = test.runtime.values(() => {
      refused = thrownBy(() =>
        test.runtime.edit((tx) => {
          tx.addTrack({ id: "hand" }, { motionId: MOTION_ID });
        }),
      );
    });

    // The scope the flat six-variant sketch could not hold: a recipe and a batch open at once. The
    // recipe is admitted and stages normally, and the refusal arrives at its own commit.
    expect(messageOf(refused)).toBe(
      "value-batch-structural: A value batch is open. Ask for it once values() has returned.",
    );
    expect(test.runtime.tryTrack(HAND_ID)).toBeUndefined();
    // A batch that staged nothing publishes nothing and reports nothing.
    expect(batch.seeds).toEqual([]);
    expect(batch.diagnostics).toEqual([]);

    test.runtime.dispose();
  });

  it("refuses a commit reached from a hook for the depth the live phase carries", () => {
    const holder: { runtime?: ProjectRuntime } = {};
    let reentered: unknown;
    const test = rig((nodeId) => {
      if (nodeId !== HAND_ID) return;
      reentered = thrownBy(() => holder.runtime?.addTrack({ id: "foot" }, { motionId: MOTION_ID }));
    });
    holder.runtime = test.runtime;

    test.runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });

    // The depth is a field of a live phase rather than a phase beside it, so the scope is still
    // idle here and the commit is what refuses.
    expect(messageOf(reentered)).toBe(
      "schema-commit-reentrant: A structural commit is already in flight. Ask for it once this one has returned.",
    );
    expect(test.runtime.track(HAND_ID).live).toBe(true);
    expect(test.runtime.tryTrack(FOOT_ID)).toBeUndefined();

    test.runtime.dispose();
  });

  it("refuses from the line dispose was called on and releases once the boundary unwinds", () => {
    const holder: { runtime?: ProjectRuntime } = {};
    let refusedInside: unknown;
    const test = rig((nodeId) => {
      if (nodeId !== HAND_ID) return;
      holder.runtime?.dispose();
      refusedInside = thrownBy(() => holder.runtime?.seek(ARM_ID, 0.5));
    });
    holder.runtime = test.runtime;
    test.runtime.mount(ARM_ID);

    const thrown = thrownBy(() => test.runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID }));

    // Retiring, not retired: the scope and the depth are still the facts the refusals read, and the
    // release is owed until the commit that was in flight has unwound.
    expect(messageOf(refusedInside)).toBe("ProjectRuntime is disposed.");
    expect(messageOf(thrown)).toContain("disposed");
    expect(test.releases).toBe(1);
    expect(test.journal[test.journal.length - 1]).toBe("release");

    // Terminal, so a second call carries nothing to release rather than clearing a flag again.
    test.runtime.dispose();

    expect(test.releases).toBe(1);
  });
});

/** The five fields the union replaces, spelled as this class read them. */
const RETIRED = [
  "this.#open",
  "this.#valueSeeds",
  "this.#disposed",
  "this.#inFlight",
  "this.#pendingTeardown",
  "#refuseImmediateReentrant",
  "#refuseReentrant",
];

describe("the runtime holds one phase and none of the fields it replaces", () => {
  it("declares the phase and reads no retired field anywhere in the file", () => {
    const source = code(RUNTIME_SOURCE);

    expect(source).toContain("#phase: ProjectPhase<OpenTransaction> = idle();");
    expect(RETIRED.filter((name) => source.includes(name))).toEqual([]);
    // One rung asks the phase for an admission, so no verb can ask it a second way.
    expect(source.split("admitOrRefuse(")).toHaveLength(2);
    expect(member(source, '#admit(verb: VerbClass): "allow" | "join" {')).toContain(
      "admitOrRefuse(this.#phase, verb)",
    );
  });

  it("moves the depth and the retirement only through the transitions that own them", () => {
    const source = code(RUNTIME_SOURCE);
    const boundary = member(source, "#boundary<T>(body: () => T): T {");
    const dispose = member(source, "dispose(): void {");

    expect(boundary).toContain("entering(this.#phase)");
    expect(boundary).toContain("leaving(this.#phase)");
    expect(boundary).toContain("teardownOwed(this.#phase)");
    expect(dispose).toContain("retiring(this.#phase)");
    expect(dispose).toContain("teardownOwed(this.#phase)");
    expect(member(source, "#teardown(deferred: boolean): void {")).toContain("retired()");
    expect(member(source, "#assertLive(): void {")).toContain("isRetiring(this.#phase)");
  });

  it("carries the open scope in the phase rather than in a field beside it", () => {
    const source = code(RUNTIME_SOURCE);

    expect(member(source, "#readTracks(): ReadonlyMap<string, TrackEntry> {")).toContain(
      "stagedIn(this.#phase)",
    );
    expect(member(source, "edit<T>(recipe: (transaction: SchemaTransaction) => T): T {")).toContain(
      "opening(this.#phase, open)",
    );
    expect(
      member(source, "values(recipe: (transaction: ValueTransaction) => void): PatchBatch {"),
    ).toContain("seedsIn(this.#phase)");
    expect(member(source, "#publishValue(nodeId: string): PatchBatch {")).toContain(
      "seeding(this.#phase, nodeId)",
    );
  });

  it("asks each verb for the admission class that verb used to ask its guard for", () => {
    const source = code(RUNTIME_SOURCE);
    const asked: readonly (readonly [string, string])[] = [
      [
        "mount(nodeId: string, instance: object = {}): object {",
        'immediateVerb("mount", "asserted")',
      ],
      ["unmount(nodeId: string): void {", 'immediateVerb("unmount", "asserted")'],
      [
        "values(recipe: (transaction: ValueTransaction) => void): PatchBatch {",
        'immediateVerb("values", "asserted")',
      ],
      ["seek(nodeId: string, progress: number) {", 'valueVerb("seek", "asserted")'],
      [
        '#setTrigger(id: string, token: number, trigger: MotionDefinition["trigger"]): void {',
        'immediateVerb("setTrigger", "resolved")',
      ],
      ["#setKeyframe(", 'valueVerb("setKeyframe", "resolved")'],
      ["track(nodeId: string): TrackHandle {", "this.#admit(READ)"],
      ["edit<T>(recipe: (transaction: SchemaTransaction) => T): T {", "this.#admit(OPEN_RECIPE)"],
      ["#commit(plan: StagedPair): void {", 'this.#admit(COMMIT) === "join"'],
    ];

    expect(asked.filter(([signature, call]) => !member(source, signature).includes(call))).toEqual(
      [],
    );
  });
});
