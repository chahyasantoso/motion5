import { describe, expect, it, vi } from "vitest";
import type { MotionDefinition, ProjectDefinition } from "../../../src/contract/v5";
import type { MotionHandle } from "../../../src/contract/motion-handle";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type ProjectRuntimeOptions } from "../../../src/runtime/project-runtime";

/**
 * Slice B2 of issue #223, on top of B1.
 *
 * One invariant: a Motion's trigger and stagger are editable in place, and that edit is tier 0. It
 * touches no node and no edge, because neither field appears in `collectTrack`,
 * `readPluginBindings` or `GraphNode`, so it reaches the layer that owns the created trigger and
 * the clock consumer through a seam of its own rather than through a graph commit. It also commits
 * nothing when it is refused, and it tears down none of the tracks the motion owns, which is the
 * whole reason the plan cut `setMotion` rather than shipping it: an upsert taking a whole
 * `MotionDefinition` has to do something with a required `tracks` array, and every one of the three
 * things it could do is wrong.
 *
 * The failing-first run named `setTrigger`, `setStagger` and both runtime options through local
 * seam interfaces and casts, because a file naming them before the source exists fails `typecheck`
 * and stops `quality` before a single test runs, which is a broken file rather than evidence. All
 * of them are deleted here, by the commit that landed the source, so the shipped cases name the
 * members directly and the journal's hooks are derived from `ProjectRuntimeOptions`: a hook whose
 * shape drifts from the option it stands in for now fails `typecheck` rather than a case.
 *
 * Every case asks the handle for both members by name before it calls either, so a red run reports
 * an absent verb as an assertion rather than as a call on `undefined`. That is the shape `RA-29`
 * through `RA-32` used for the same reason.
 *
 * Staleness is deliberately not re-asserted here. `RA-32` derives the motion handle's whole
 * refusing surface from the handle's own keys and holds it against one argument record, so these
 * two verbs are covered there by being added to that record, and a copy of the stale contract in
 * this file would be a second owner of it. See ADR-056 and ADR-061.
 */
const MOTION = "hero";
const ARM = "hero/arm";
const LEG = "hero/leg";
/** Authored by the project below, so it is also the redundant edit `RA-38` asks for. */
const MANUAL: MotionDefinition["trigger"] = { type: "manual" };
/**
 * A driver-backed replacement, deliberately a different clock relationship rather than a different
 * field on the same type. `manual` binds the Motion to the clock and `time` binds a driver to it,
 * so an implementation that swapped the definition without re-registering the consumer is
 * expressible and is what the journal below detects.
 */
const TIMED: MotionDefinition["trigger"] = { type: "time", duration: 1000 };
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: MOTION, trigger: MANUAL, tracks: [{ id: "arm" }, { id: "leg" }] }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

/**
 * The two seams this slice adds, taken from the options they stand in for rather than restated.
 *
 * A journal typed against its own copy of the hook shape would keep compiling after the option it
 * fakes had changed, which is the one thing a seam this file drives must not be able to do.
 */
type MotionTriggerHook = NonNullable<ProjectRuntimeOptions["replaceMotionTrigger"]>;
type MotionStaggerHook = NonNullable<ProjectRuntimeOptions["setMotionStagger"]>;

interface JournalFailures {
  readonly trigger?: Error;
}
interface Journal {
  readonly entries: readonly string[];
  readonly replaceMotionTrigger: MotionTriggerHook;
  readonly setMotionStagger: MotionStaggerHook;
}
/**
 * One ordered journal for both hooks, because which one was asked is half of what these cases
 * claim.
 *
 * A stagger edit that went through the trigger hook would dispose and recreate a driver for a field
 * no driver reads, and two separate counters could not tell that from a correct edit. The trigger
 * entry records the type it was handed rather than a call count, so an implementation that asked
 * the layer to install the definition it already had is visible as well.
 */
function journal(failures: JournalFailures = {}): Journal {
  const entries: string[] = [];
  return {
    get entries() {
      return [...entries];
    },
    replaceMotionTrigger: (motionId, definition) => {
      entries.push(`trigger ${motionId} ${definition.trigger.type}`);
      if (failures.trigger) throw failures.trigger;
    },
    setMotionStagger: (motionId, stagger) => {
      entries.push(`stagger ${motionId} ${String(stagger)}`);
    },
  };
}
function runtimeWith(hooks: Journal): ProjectRuntime {
  return new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose,
    replaceMotionTrigger: hooks.replaceMotionTrigger,
    setMotionStagger: hooks.setMotionStagger,
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
/**
 * Both verbs, asked for by name before any case calls one.
 *
 * `Object.keys` rather than a type, for the reason `RA-27` reads a spelling that way: the question
 * is whether the handle declares the member at all, and asking it as an assertion is what keeps a
 * red run reporting an absent verb rather than a `TypeError` from calling `undefined`.
 */
function declaring(project: ProjectRuntime): MotionHandle {
  const handle = project.motion(MOTION);
  const keys = Object.keys(handle);
  expect(keys).toContain("setTrigger");
  expect(keys).toContain("setStagger");
  return handle;
}

describe("a Motion's driver is editable in place, and that edit reaches no graph", () => {
  it("RA-33 moves the retained trigger and asks the driver layer once, with no graph work", () => {
    const hooks = journal();
    const project = runtimeWith(hooks);
    const handle = declaring(project);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setTrigger(TIMED);

    expect(handle.definition.trigger).toEqual(TIMED);
    // Asked once, with the replacement rather than with what it already held.
    expect(hooks.entries).toEqual([`trigger ${MOTION} time`]);
    // The tier claim, as a call count rather than as a timing: neither field reaches a node or an
    // edge, so a commit is not merely cheap here, it is the wrong mechanism.
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-34 moves the retained stagger through its own seam and never touches the trigger", () => {
    const hooks = journal();
    const project = runtimeWith(hooks);
    const handle = declaring(project);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setStagger(0.25);
    expect(handle.definition.stagger).toBe(0.25);

    // Absent rather than explicitly undefined, because the authored field is optional and a Motion
    // that reported a stagger of `undefined` would answer a shape no author can write.
    handle.setStagger();
    expect(handle.definition.stagger).toBeUndefined();
    expect("stagger" in handle.definition).toBe(false);

    expect(hooks.entries).toEqual([`stagger ${MOTION} 0.25`, `stagger ${MOTION} undefined`]);
    // `Motion` holds `#stagger` as its own state and no driver reads it, so a stagger edit that
    // disposed and recreated the trigger would drop a live host subscription for nothing.
    expect(hooks.entries.some((entry) => entry.startsWith("trigger"))).toBe(false);
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-35 refuses an invalid trigger before it asks the driver layer anything", () => {
    const hooks = journal();
    const project = runtimeWith(hooks);
    const handle = declaring(project);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");
    const invalid = { type: "nope" } as unknown as MotionDefinition["trigger"];

    const thrown = thrownBy(() => handle.setTrigger(invalid));

    expect(thrown).toBeInstanceOf(TypeError);
    // Validated first, so the refusal costs no teardown at all. A verb that disposed the live
    // driver and then refused the replacement would leave the Motion with no driver and no way
    // back.
    expect(hooks.entries).toEqual([]);
    expect(handle.definition.trigger).toEqual(MANUAL);
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-36 reports the driver layer's own failure and moves nothing when it fails", () => {
    const failure = new Error("Host scroll source unsubscribe failed.");
    const hooks = journal({ trigger: failure });
    const project = runtimeWith(hooks);
    const handle = declaring(project);

    const thrown = thrownBy(() => handle.setTrigger(TIMED));

    // Verbatim rather than wrapped, which is the same precedence rule `U-7` pins one tier up: the
    // reason an edit was refused outranks anything its teardown reports. See ADR-035.
    expect(thrown).toBe(failure);
    expect(handle.definition.trigger).toEqual(MANUAL);

    project.dispose();
  });

  it("RA-37 tears down none of the tracks the motion owns", () => {
    const hooks = journal();
    const project = runtimeWith(hooks);
    const handle = declaring(project);
    const arm = project.track(ARM);
    const retained = arm.definition;
    const nodes = project.graph.graph.nodes;

    handle.setTrigger(TIMED);

    // The case that says why `setMotion` was cut rather than written. Destroy plus recreate is the
    // only way to change a trigger today, and it tears down every node under the motion, so a
    // handle that survives its own driver edit is the capability this slice adds.
    expect(arm.live).toBe(true);
    expect(arm.definition).toBe(retained);
    expect(project.graph.graph.nodes).toBe(nodes);
    expect(handle.trackIds).toEqual([ARM, LEG]);
    expect(handle.definition.tracks.map(({ id }) => id)).toEqual(["arm", "leg"]);

    project.dispose();
  });

  it("RA-38 asks the driver layer nothing when the edit changes nothing", () => {
    const hooks = journal();
    const project = runtimeWith(hooks);
    const handle = declaring(project);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    // Idempotent in the `#replaceWithObservation` sense the plan asks of every primitive: a
    // redundant set and an absent clear are both no-ops on a live handle. This one is load-bearing
    // rather than tidy, because installing a trigger the Motion already has means disposing a live
    // driver and resubscribing a host source, which a caller cannot see and did not ask for.
    handle.setTrigger(MANUAL);
    handle.setStagger();

    expect(hooks.entries).toEqual([]);
    expect(handle.definition.trigger).toEqual(MANUAL);
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });
});
