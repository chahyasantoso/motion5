import { describe, expect, it } from "vitest";
import type { MotionDefinition, ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { createDefaultTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type {
  CreatedTrigger,
  TriggerFactory,
  TriggerFactoryContext,
} from "../../src/ports/trigger-factory";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

/**
 * Issue #133. Both mutating entry points in `ProjectRuntime` roll back by calling a hook that
 * reaches application code, and both called it outside the `try`. A host whose teardown throws
 * therefore replaced the rejection with its own unrelated failure, and the caller never learned
 * why the operation was refused.
 *
 * The rollback hooks are the observation surface, not the graph. `T-6` in
 * `t4-runtime-motion-parity.test.ts` already asserts that the rejection propagates unchanged, but
 * it holds there only because that suite's fake does not throw on dispose, so the invariant it
 * claims was never enforced by the code.
 */

const BASE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};

/** Rejected by the candidate graph rather than by authored validation, so the rollback runs. */
const REJECTED_TRACK: TrackDefinition = {
  id: "child",
  observes: [{ source: "~/missing" }],
};

/** A slashed id reaches assertAuthoredMotionId, the same graph rejection `T-6` uses. */
const REJECTED_MOTION: MotionDefinition = {
  id: "bad/id",
  trigger: { type: "time", duration: 1000 },
  tracks: [],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

function load(motions: readonly MotionDefinition[], factory?: TriggerFactory): ProjectHandle {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    ...(factory === undefined ? {} : { triggerFactory: factory }),
  }).load({ schemaVersion: 5, motions });
}

/** Returns the thrown value instead of a matcher, because each case asserts on several facets. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

interface HostileFactory {
  readonly factory: TriggerFactory;
  /** The exact instance the host throws, so the assertion is identity rather than a message. */
  readonly failure: Error;
  readonly disposals: number;
}

/**
 * The real default factory with one hostile edge: the first `dispose` throws, after tearing the
 * inner trigger down. That is the reachable shape from the issue. `releaseMotion` disposes a
 * `CreatedTrigger` whose `dispose` closes over an application-owned unsubscribe, and no scroll
 * resolver is needed to reproduce it, because a rollback does not care which driver it releases.
 *
 * Only the first call throws. A host unsubscribe that fails is not usually retried, and a factory
 * that failed forever would make the project teardown at the end of the case a second hostile
 * host, which is not what is under test. The count is asserted so "rolled back once" is proved
 * rather than assumed: a rollback that never ran would also leave the rejection in front.
 */
function hostileFactory(): HostileFactory {
  const base = createDefaultTriggerFactory();
  const failure = new Error("host unsubscribe failed");
  let disposals = 0;
  const factory: TriggerFactory = {
    create(context: TriggerFactoryContext): CreatedTrigger {
      const inner = base.create(context);
      // Every field named rather than spread, matching the T4 wrapper: `CreatedTrigger` is an
      // interface, so a spread would silently drop a getter-backed port or clock binding.
      return {
        port: inner.port,
        acceptsExternalSignal: inner.acceptsExternalSignal,
        clockBinding: inner.clockBinding,
        dispose() {
          disposals += 1;
          inner.dispose();
          if (disposals === 1) throw failure;
        },
      };
    },
  };
  return {
    factory,
    failure,
    get disposals() {
      return disposals;
    },
  };
}

describe("a rollback failure never outranks the rejection that triggered it", () => {
  it("P-1 reports the graph rejection first when the addMotion rollback throws", () => {
    const triggers = hostileFactory();
    const handle = load([], triggers.factory);

    const thrown = thrownBy(() => handle.addMotion(REJECTED_MOTION));

    // Red before the fix: the rollback ran outside the try, so this message was
    // "host unsubscribe failed" and the reason for the refusal was gone.
    expect((thrown as Error).message).toMatch(/^motion-id at motions\[0\]\.id:/);
    expect(thrown).toBeInstanceOf(AggregateError);
    const errors = (thrown as AggregateError).errors as readonly unknown[];
    expect(errors[0]).toBeInstanceOf(TypeError);
    // Identity, not a message match. The host's failure is attached, not re-described.
    expect(errors[1]).toBe(triggers.failure);
    expect(triggers.disposals).toBe(1);
    // Nothing was committed, so the id is still unknown to every public entry point.
    expect(() => handle.destroyMotion("bad/id")).toThrow('Unknown motion "bad/id".');

    handle.dispose();
  });

  it("P-2 reports the graph rejection first when the addTrack rollback throws", () => {
    const failure = new Error("compiled Track dispose failed");
    let disposals = 0;
    const runtime = new ProjectRuntime(BASE_PROJECT, {
      clock: createManualClock(),
      compose,
      compileTrack: () => undefined,
      disposeTrack: () => {
        disposals += 1;
        throw failure;
      },
    });

    const thrown = thrownBy(() => runtime.addTrack(REJECTED_TRACK));

    // Red before the fix, for the same reason, at the older of the two call sites. `#addTrack` is
    // frozen by the plan, which is why this was filed rather than folded into T4.
    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    expect(thrown).toBeInstanceOf(AggregateError);
    const errors = (thrown as AggregateError).errors as readonly unknown[];
    expect(errors[0]).toBeInstanceOf(TypeError);
    expect(errors[1]).toBe(failure);
    expect(disposals).toBe(1);
    expect(() => runtime.track("~/child")).toThrow('Unknown graph node "~/child".');

    runtime.dispose();
  });

  it("P-3 rethrows the rejection itself, unwrapped, when the rollback succeeds", () => {
    // Not red, and not claimed as red. It exists so the fix cannot become "wrap every rejection":
    // an AggregateError on the ordinary path would change the error every existing caller sees,
    // including `T-6`'s anchored match and the two retryable-rejection cases in
    // `mutation-transactionality.test.ts`.
    const handle = load([]);

    const fromMotion = thrownBy(() => handle.addMotion(REJECTED_MOTION));

    expect(fromMotion).toBeInstanceOf(TypeError);
    expect(fromMotion).not.toBeInstanceOf(AggregateError);
    expect((fromMotion as Error).message).toMatch(/^motion-id at motions\[0\]\.id:/);
    handle.dispose();

    let disposals = 0;
    const runtime = new ProjectRuntime(BASE_PROJECT, {
      clock: createManualClock(),
      compose,
      compileTrack: () => undefined,
      disposeTrack: () => {
        disposals += 1;
      },
    });

    const fromTrack = thrownBy(() => runtime.addTrack(REJECTED_TRACK));

    expect(fromTrack).toBeInstanceOf(TypeError);
    expect(fromTrack).not.toBeInstanceOf(AggregateError);
    expect((fromTrack as Error).message).toMatch(/^observation-unknown-source at /);
    // The rollback still ran. Precedence is not bought by skipping it.
    expect(disposals).toBe(1);

    runtime.dispose();
  });
});
