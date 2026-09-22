import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import type { MotionDefinition, ProjectDefinition } from "../../src/contract/v5";
import { createDefaultTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { Motion } from "../../src/domain/motion";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock, type Clock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { code, declaration, member } from "../helpers/source-region";
import type {
  CreatedTrigger,
  TriggerFactory,
  TriggerFactoryContext,
} from "../../src/ports/trigger-factory";

/**
 * Issues #143 and #145. One defect in two places: a teardown that stops at its first failing step.
 *
 * `Engine.load()` creates a `ProjectRuntime` before it builds the authored Motions, and its outer
 * catch released Motions, triggers and Tracks but never the runtime, so a late build failure left
 * the project's only clock subscription alive behind a handle the caller never received. The
 * `destroyMotion` hook released the created trigger before it disposed the Motion and deleted the
 * map entry, so a host trigger teardown that threw skipped both of the steps that mattered.
 *
 * Both are cleanup ordering, and neither is observable through the public surface alone, which is
 * why the two probes below exist.
 */

const ENGINE_SOURCE = code(fileURLToPath(new URL("../../src/engine.ts", import.meta.url)));
const COMPOSITION_STATE = declaration(ENGINE_SOURCE, "type CompositionState", ";");
// The one owner of whether a composition may take a Motion, addressed by its own opening and
// its own column so that no claim about its arms can be satisfied by a neighbour of it.
const ADOPT_MOTION = member(ENGINE_SOURCE, "const adoptMotion = (", "    ");

const CREATE_FAILURE = "trigger factory refused to build this Motion.";

/** A slashed id reaches assertAuthoredMotionId, so the candidate graph rejects the addMotion. */
const REJECTED_MOTION: MotionDefinition = {
  id: "bad/id",
  trigger: { type: "time", duration: 1000 },
  tracks: [],
};

function manual(id: string): MotionDefinition {
  return { id, trigger: { type: "manual" }, tracks: [] };
}

/**
 * A Motion whose only Track observes a free track nobody authored.
 *
 * The one load refusal that lands after the Tracks compile and before any Motion or trigger
 * exists: `compileTrack` is happy with the entry and `GraphRuntime`'s constructor is not, so a
 * compiled Track is the whole of what the composition still holds at that instant. `D-6` and
 * `D-9` are the two halves of what happens next, so the project is declared once rather than
 * copied into the second of them.
 */
const MISSING_SOURCE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "arm", observes: [{ source: "~/missing" }] }],
    },
  ],
};

interface CountingClock extends Clock {
  tick(delta?: number): number;
  /** Subscriptions taken minus unsubscribes run, so a leak reads as a positive number. */
  readonly liveSubscriptions: number;
  readonly releases: number;
}

/**
 * `createManualClock` publishes no subscriber count, so the leak in #143 is invisible through the
 * port alone. Counting here rather than in `ports/clock.ts` keeps the shipped fake unchanged: the
 * count is this suite's observation surface, not a new part of the Clock contract.
 */
function countingClock(): CountingClock {
  const clock = createManualClock();
  let taken = 0;
  let released = 0;
  return {
    subscribe(listener) {
      const unsubscribe = clock.subscribe(listener);
      taken += 1;
      let done = false;
      return () => {
        // Idempotent, so a double unsubscribe cannot forge a balanced count and fake a green.
        if (done) return;
        done = true;
        released += 1;
        unsubscribe();
      };
    },
    tick: (delta = 0) => clock.tick(delta),
    get liveSubscriptions() {
      return taken - released;
    },
    get releases() {
      return released;
    },
  };
}

interface TriggerProbeOptions {
  readonly failCreateAt?: number;
  readonly failDisposeAt?: number;
}

interface TriggerProbe {
  readonly factory: TriggerFactory;
  /** The exact instance a hostile dispose throws, so cases assert identity, not a message. */
  readonly disposeFailure: Error;
  readonly created: number;
  readonly disposals: number;
}

/**
 * Wraps the real default factory so the drivers under test are the shipped ones, with exactly one
 * hostile edge per case. Every field is named rather than spread because `CreatedTrigger` is an
 * interface and a spread would silently drop a getter-backed port or clock binding, matching the
 * wrapper in `rollback-error-precedence.test.ts`.
 */
function triggerProbe(options: TriggerProbeOptions = {}): TriggerProbe {
  const base = createDefaultTriggerFactory();
  const disposeFailure = new Error("host trigger teardown failed");
  let created = 0;
  let disposals = 0;
  const factory: TriggerFactory = {
    create(context: TriggerFactoryContext): CreatedTrigger {
      created += 1;
      if (created === options.failCreateAt) throw new Error(CREATE_FAILURE);
      const inner = base.create(context);
      return {
        port: inner.port,
        clockBinding: inner.clockBinding,
        dispose() {
          disposals += 1;
          inner.dispose();
          // Only the nominated call throws. A host unsubscribe that fails is not retried, and a
          // factory that failed forever would make the disposal at the end of a case a second
          // hostile host, which is not what is under test.
          if (disposals === options.failDisposeAt) throw disposeFailure;
        },
      };
    },
  };
  return {
    factory,
    disposeFailure,
    get created() {
      return created;
    },
    get disposals() {
      return disposals;
    },
  };
}

interface MotionProbe {
  /** Every Motion that reached play(), in creation order. */
  readonly built: readonly Motion[];
  disposals(motion: Motion): number;
  restore(): void;
}

/**
 * Patches the prototype for the same reason case C-21 does: Engine builds its Motions inside a
 * closure and publishes neither the instance nor a dispose counter, so a Motion stranded by a
 * half-run teardown is unreachable from the public surface. That unreachability is the defect, not
 * an accident of the test. Every case restores in a finally.
 */
function probeMotions(): MotionProbe {
  const realPlay = Motion.prototype.play;
  const realDispose = Motion.prototype.dispose;
  const built: Motion[] = [];
  const disposals = new Map<Motion, number>();
  Motion.prototype.play = function play(this: Motion) {
    if (!built.includes(this)) built.push(this);
    realPlay.call(this);
  };
  Motion.prototype.dispose = function dispose(this: Motion) {
    disposals.set(this, (disposals.get(this) ?? 0) + 1);
    realDispose.call(this);
  };
  return {
    built,
    disposals: (motion) => disposals.get(motion) ?? 0,
    restore() {
      Motion.prototype.play = realPlay;
      Motion.prototype.dispose = realDispose;
    },
  };
}

function load(clock: Clock, factory: TriggerFactory, project: ProjectDefinition): ProjectHandle {
  return new Engine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    triggerFactory: factory,
  }).load(project);
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

describe("Engine owns the teardown of everything a failed operation created", () => {
  it("D-1 releases the project clock subscription when a load fails late", () => {
    // Issue #143. The runtime is constructed before the authored Motions are built, and
    // `GraphRuntime` takes the project's only `Clock.subscribe` inside its own constructor. A
    // failure in a later `buildMotion` therefore left that subscription live, owned by a runtime
    // the caller never received and can never dispose through the public path.
    const clock = countingClock();
    const triggers = triggerProbe({ failCreateAt: 2 });
    // Two Motions, so the runtime exists by the time the refusal lands. A factory that refused the
    // first Motion would fail before the runtime existed, which is the other branch, D-6.
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [manual("first"), manual("second")],
    };

    expect(() => load(clock, triggers.factory, project)).toThrow(CREATE_FAILURE);

    // Red before the fix: 1. Nothing else subscribes, because Engine passes listenToClock: false
    // to every Motion and a time driver is fed rather than subscribed, so this counts the one
    // project-owned subscription and nothing else.
    expect(clock.liveSubscriptions).toBe(0);
    // The unsubscribe actually ran, rather than the subscription never having been taken.
    expect(clock.releases).toBe(1);
  });

  it("D-2 disposes each built Motion and trigger exactly once on a failed load", () => {
    // Not claimed red, and it is the guard that matters for this change: routing the failed path
    // through `runtime.dispose()` must not add a second owner beside the composition teardown that
    // call already performs. A 2 here would mean a failed load disposes everything twice.
    const clock = countingClock();
    const triggers = triggerProbe({ failCreateAt: 2 });
    const probe = probeMotions();
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [manual("first"), manual("second")],
    };
    try {
      expect(() => load(clock, triggers.factory, project)).toThrow(CREATE_FAILURE);

      // Only the first Motion was ever built; the second was refused inside the factory.
      expect(probe.built).toHaveLength(1);
      expect(probe.disposals(probe.built[0]!)).toBe(1);
      expect(probe.built[0]!.state).toBe("destroyed");
      expect(triggers.created).toBe(2);
      expect(triggers.disposals).toBe(1);
    } finally {
      probe.restore();
    }
  });

  it("D-3 keeps the load failure in front when the teardown throws too", () => {
    // Issue #143: cleanup must preserve the original load failure if teardown also fails. Same
    // precedence rule ProjectRuntime applies to a failed rollback, applied at the load owner. Red
    // before the fix, where the host's unsubscribe failure was the only thing the caller saw and
    // the reason the load was refused was gone.
    const clock = countingClock();
    const triggers = triggerProbe({ failCreateAt: 2, failDisposeAt: 1 });
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [manual("first"), manual("second")],
    };

    const thrown = thrownBy(() => load(clock, triggers.factory, project));

    expect(thrown).toBeInstanceOf(AggregateError);
    expect((thrown as Error).message).toContain(CREATE_FAILURE);
    const errors = (thrown as AggregateError).errors as readonly unknown[];
    // Order is the contract: the load failure first, the teardown failure attached behind it.
    expect((errors[0] as Error).message).toBe(CREATE_FAILURE);
    // Identity, not a message match. The host's failure is attached, not re-described.
    expect(errors[1]).toBe(triggers.disposeFailure);
    // Precedence is not bought by skipping the teardown: the subscription is still released.
    expect(clock.liveSubscriptions).toBe(0);
  });

  it("D-4 disposes the Motion even when the rolled back trigger throws", () => {
    // Issue #145. `ProjectRuntime.addMotion` rejects the candidate graph and rolls back through
    // Engine's `destroyMotion` hook, which released the created trigger first. A host teardown
    // that threw therefore stopped the hook before `motion.dispose()`, and ADR-032's exactly-once
    // disposal became exactly zero for a Motion that play() had already mounted.
    const clock = countingClock();
    const triggers = triggerProbe({ failDisposeAt: 1 });
    const probe = probeMotions();
    try {
      const handle = load(clock, triggers.factory, { schemaVersion: 5, motions: [] });

      const thrown = thrownBy(() => handle.addMotion(REJECTED_MOTION));

      // Issue #133's precedence still holds: the graph rejection leads and the host failure is
      // attached, so this fix cannot be mistaken for a regression of that one.
      expect((thrown as Error).message).toMatch(/^motion-id at motions\[0\]\.id:/);
      expect(thrown).toBeInstanceOf(AggregateError);
      const errors = (thrown as AggregateError).errors as readonly unknown[];
      expect(errors[0]).toBeInstanceOf(TypeError);
      // Identity survives the new collect-then-report step: a lone failure is rethrown verbatim.
      expect(errors[1]).toBe(triggers.disposeFailure);
      // Attempted exactly once, as the issue requires. Not retried, not skipped.
      expect(triggers.disposals).toBe(1);
      // Red before the fix: 0 disposals, with the Motion left mounted and playing.
      expect(probe.built).toHaveLength(1);
      expect(probe.disposals(probe.built[0]!)).toBe(1);
      expect(probe.built[0]!.state).toBe("destroyed");

      handle.dispose();
    } finally {
      probe.restore();
    }
  });

  it("D-5 drops the rolled back Motion from Engine's map exactly once", () => {
    // The other half of #145. `signal` resolves against Engine's own motions map, so it is the one
    // public probe of that map. Red before the fix, where the entry survived the failed rollback
    // and the stranded Motion still answered for the id.
    const clock = countingClock();
    const triggers = triggerProbe({ failDisposeAt: 1 });
    const probe = probeMotions();
    try {
      const handle = load(clock, triggers.factory, { schemaVersion: 5, motions: [] });

      expect(() => handle.addMotion(REJECTED_MOTION)).toThrow(AggregateError);

      // Before the fix this threw the driver-backed signal rejection instead, which is itself the
      // proof that the Motion was still reachable by id.
      expect(() => handle.signal("bad/id", { type: "time", progress: 0.5 })).toThrow(
        'Unknown motion "bad/id".',
      );
      expect(() => handle.destroyMotion("bad/id")).toThrow('Unknown motion "bad/id".');

      // Project disposal must not find a second copy of either. Exactly once means once in total,
      // across the rollback and the teardown that follows it.
      handle.dispose();

      expect(triggers.disposals).toBe(1);
      expect(probe.disposals(probe.built[0]!)).toBe(1);
      expect(clock.liveSubscriptions).toBe(0);
    } finally {
      probe.restore();
    }
  });

  it("D-7 names each composition phase and cleanup owner in one closed union", () => {
    // The old runtime-undefined probe answered the cleanup question from an unrelated variable.
    // This source claim is the lie detector: the state itself must name all phases and owners.
    expect(COMPOSITION_STATE).toContain('kind: "building"');
    expect(COMPOSITION_STATE).toContain('kind: "ready"');
    expect(COMPOSITION_STATE).toContain('kind: "disposed"');
    expect(COMPOSITION_STATE).toContain('cleanupOwner: "composition"');
    expect(COMPOSITION_STATE).toContain('cleanupOwner: "runtime"');
    expect(COMPOSITION_STATE).toContain('cleanupOwner: "none"');
    expect(ENGINE_SOURCE).toContain("switch (state.kind)");
    expect(ENGINE_SOURCE).toContain("switch (state.cleanupOwner)");
    expect(ENGINE_SOURCE).toContain("return unreachable(state)");
    expect(ENGINE_SOURCE).not.toContain("runtime === undefined");
  });

  it("D-8 routes both adoption sites through one owner that reads the composition state", () => {
    // Issue #469. `motions.set(id, buildMotion(...))` evaluates its argument before it reads
    // anything, so the `createMotion` hook and the load-time loop each wrote a Motion into maps
    // without asking whether the composition would still be there to own it, and what made that
    // safe was a deferral policy two modules away that neither site named. One owner reads the
    // state after the build instead. This is the probe of that, because `adoptMotion` is a closure
    // Engine never publishes, so a third adoption site written beside these two has no other
    // observation surface at all. `D-7`'s shape. Red on `main`, where there is no `adoptMotion`
    // and two bare sites.
    expect(ENGINE_SOURCE).toContain("createMotion: (definition) => adoptMotion(definition, []),");
    expect(ENGINE_SOURCE).toContain("adoptMotion(motionDefinition, entries);");
    // Whole-file negatives rather than region-scoped ones, because `code()` erases comments, so the
    // owner's own comment quoting the retired shape cannot satisfy them. That is what makes this
    // the claim that neither site writes it rather than the claim that one declaration does not.
    expect(ENGINE_SOURCE).not.toContain("motions.set(definition.id, buildMotion(");
    expect(ENGINE_SOURCE).not.toContain("motions.set(motionDefinition.id, buildMotion(");
    // The state is read exhaustively, so the disposed arm is a decision this owner owes rather than
    // a case a later reader may quietly omit. `engine.md` owns why that arm has no behavioural
    // case, and this is what stops it being deleted as dead instead.
    expect(ADOPT_MOTION).toContain('case "disposed":');
    expect(ADOPT_MOTION).toContain("unreachable(state)");
  });

  it("D-6 reports the graph rejection unwrapped when the runtime never existed", () => {
    // The other branch of the failed-load teardown, and the reason it is a branch: when
    // `GraphRuntime` throws, `ProjectRuntime`'s own constructor has already run the composition
    // teardown, so the load owner must not run it a second time. Not claimed red; it pins the
    // branch and proves the ordinary diagnosis is not buried in an AggregateError.
    const clock = countingClock();
    const triggers = triggerProbe();

    const thrown = thrownBy(() => load(clock, triggers.factory, MISSING_SOURCE_PROJECT));

    expect(thrown).toBeInstanceOf(TypeError);
    expect(thrown).not.toBeInstanceOf(AggregateError);
    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    // The refusal lands before the first Motion is built, so there was nothing to release but the
    // compiled Track, and no subscription was ever taken.
    expect(triggers.created).toBe(0);
    expect(clock.liveSubscriptions).toBe(0);
  });
});
