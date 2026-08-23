import { describe, expect, it } from "vitest";
import type { MotionDefinition, TrackDefinition } from "../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import {
  createTriggerFactory,
  type ScrollSourceResolver,
} from "../../src/adapters/trigger-factory/default";
import type {
  CreatedTrigger,
  TriggerFactory,
  TriggerFactoryContext,
} from "../../src/ports/trigger-factory";

type FakeScheduler = ReturnType<typeof createFakeScheduler>;
type ManualClock = ReturnType<typeof createManualClock>;

interface GraphIRLike {
  readonly nodes: readonly { readonly id: string }[];
}
interface GraphRuntimeLike {
  readonly graph: GraphIRLike;
}
interface DiagnosticsLike {
  readonly entries: readonly unknown[];
}
interface RuntimeInternals {
  readonly instanceCount: number;
  readonly graph: GraphRuntimeLike;
  readonly diagnostics: DiagnosticsLike;
}

/**
 * Engine attaches the runtime as a non-enumerable `_runtime`, which is how
 * `observation-identity.test.ts` already reads the graph sequence. Node count and instanceCount
 * have no public accessor, and T-3 and T-6 have to prove that nothing was committed, not merely
 * that a call threw. Asserting only the throw is what let the ghost in section 2 fact 5 survive.
 */
function internals(handle: ProjectHandle): RuntimeInternals {
  return (handle as unknown as { _runtime: RuntimeInternals })._runtime;
}

function nodeIds(handle: ProjectHandle): readonly string[] {
  return internals(handle).graph.graph.nodes.map((node) => node.id);
}

interface FakeScrollSource extends ScrollSource {
  emit(progress: number): void;
  readonly subscriptions: number;
  readonly unsubscribes: number;
}

function scrollSource(): FakeScrollSource {
  let listener: ((progress: number) => void) | undefined;
  let subscriptions = 0;
  let unsubscribes = 0;
  return {
    subscribe(fn) {
      subscriptions += 1;
      listener = fn;
      return () => {
        unsubscribes += 1;
        listener = undefined;
      };
    },
    emit(progress) {
      listener?.(progress);
    },
    get subscriptions() {
      return subscriptions;
    },
    get unsubscribes() {
      return unsubscribes;
    },
  };
}

interface CountingFactory {
  readonly factory: TriggerFactory;
  readonly created: readonly string[];
  disposals(motionId: string): number;
}

/**
 * Wraps the real factory instead of replacing it, because `createTimeDriver` returns a sealed
 * `CreatedTrigger` with no observable dispose counter. Counting the outer `dispose()` is the only
 * way to assert exactly once rather than at least once; the inner contract is idempotent, and
 * idempotence is the safety net, not the expected behavior.
 */
function countingFactory(scroll?: ScrollSourceResolver): CountingFactory {
  const base = createTriggerFactory(scroll === undefined ? {} : { scroll });
  const created: string[] = [];
  const disposals = new Map<string, number>();
  const factory: TriggerFactory = {
    create(context: TriggerFactoryContext): CreatedTrigger {
      // Recorded after base.create, so an unbuildable driver never counts as created. That
      // ordering is exactly what makes T-6 red on the parent: there, addMotion replaces the
      // graph before it ever asks the factory for a Motion, so this list stays empty.
      const inner = base.create(context);
      created.push(context.motionId);
      // Every field named rather than spread. `CreatedTrigger` is an interface, not a promise of a
      // plain object literal, so a factory that ever returns a class instance or a getter would
      // have its port and binding silently dropped by `...inner` and this wrapper would report a
      // driver that cannot drive. Naming them means the type checker catches the next added field.
      return {
        port: inner.port,
        acceptsExternalSignal: inner.acceptsExternalSignal,
        clockBinding: inner.clockBinding,
        dispose() {
          disposals.set(context.motionId, (disposals.get(context.motionId) ?? 0) + 1);
          inner.dispose();
        },
      };
    },
  };
  return { factory, created, disposals: (motionId) => disposals.get(motionId) ?? 0 };
}

function ramp(id: string): TrackDefinition {
  return {
    id,
    keyframes: {
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 100 },
      ],
    },
  };
}

function timeMotion(id: string, tracks: readonly TrackDefinition[] = []): MotionDefinition {
  return { id, trigger: { type: "time", duration: 1000 }, tracks };
}

interface Loaded {
  readonly clock: ManualClock;
  readonly scheduler: FakeScheduler;
  readonly handle: ProjectHandle;
}

function load(motions: readonly MotionDefinition[], factory?: TriggerFactory): Loaded {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
    ...(factory === undefined ? {} : { triggerFactory: factory }),
  }).load({ schemaVersion: 5, motions });
  return { clock, scheduler, handle };
}

/** Records published values, then clears the setup publications so only driver output remains. */
function record(handle: ProjectHandle, nodeId: string): readonly unknown[] {
  const seen: unknown[] = [];
  handle.subscribe(nodeId, (patch) => seen.push(patch.values));
  seen.length = 0;
  return seen;
}

/**
 * GraphRuntime flushes once before the scheduler applies driver progress, so an `x: 0`
 * publication rides along with each tick. `trigger-time.test.ts` filters the same way.
 */
function moved(seen: readonly unknown[]): readonly unknown[] {
  return seen.filter((values) => (values as { x?: unknown }).x !== 0);
}

describe("T4 runtime Motion parity and creation ordering", () => {
  it("T-1 emits one progress sequence for a runtime and an authored time Motion", () => {
    const authored = load([timeMotion("scene", [ramp("arm")])]);
    authored.handle.mount("scene/arm");

    const runtime = load([]);
    runtime.handle.addMotion(timeMotion("scene"));
    runtime.handle.addTrack(ramp("arm"), { motionId: "scene" });

    // addTrack mounts on its own; the authored path needs an explicit mount. Flush both before
    // recording so the comparison covers only what the driver produced afterwards.
    authored.scheduler.flush();
    runtime.scheduler.flush();
    const authoredSeen = record(authored.handle, "scene/arm");
    const runtimeSeen = record(runtime.handle, "scene/arm");

    for (const delta of [250, 250, 250, 250]) {
      authored.clock.tick(delta);
      authored.scheduler.flush();
      runtime.clock.tick(delta);
      runtime.scheduler.flush();
    }

    // Deep equality of the whole sequence, not the end state. A double advance still lands on 1
    // and would pass a final-value assertion; it cannot reproduce the intermediate steps.
    expect(runtimeSeen).toEqual(authoredSeen);
    expect(moved(authoredSeen)).toEqual([{ x: 25 }, { x: 50 }, { x: 75 }, { x: 100 }]);

    authored.handle.dispose();
    runtime.handle.dispose();
  });

  it("T-2 rejects an invalid runtime trigger without committing anything", () => {
    const { handle } = load([]);
    const before = nodeIds(handle);
    const missingDuration: MotionDefinition = {
      id: "scene",
      trigger: { type: "time" },
      tracks: [],
    };

    expect(() => handle.addMotion(missingDuration)).toThrow(/trigger-time-duration/);

    // runtime-motion-trigger-validation.test.ts already proves the rule fires and the id stays
    // free. This adds the half that suite does not cover: nothing was committed on the way out.
    // The node count is trivially unchanged for a trackless Motion, so the reuse of the id on the
    // last line is the assertion that actually discriminates a committed definition here.
    expect(nodeIds(handle)).toEqual(before);
    expect(internals(handle).instanceCount).toBe(0);
    expect(() => handle.addMotion(timeMotion("scene"))).not.toThrow();

    handle.dispose();
  });

  it("T-3 leaves nothing behind when the trigger driver cannot be built", () => {
    const { clock, scheduler, handle } = load([]);
    const before = nodeIds(handle);
    const diagnosticsBefore = internals(handle).diagnostics.entries.length;
    const late: MotionDefinition = {
      id: "late",
      trigger: { type: "scroll", source: "hero" },
      tracks: [],
    };

    // The default factory registers no scroll resolver, so this is the one reachable failure
    // that happens inside createMotion rather than before it. ADR-030 owns the rule id. One
    // attempt only: on the parent a second call reports "already exists" from the ghost.
    let thrown: unknown;
    try {
      handle.addMotion(late);
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toBeInstanceOf(TypeError);
    const message = thrown instanceof Error ? thrown.message : "";
    expect(message).toMatch(/^trigger-driver-unavailable at motions\.late\.trigger\.source:/);
    expect(message).toContain('Motion "late"');
    expect(message).toContain('source key "hero"');

    // The ghost, enumerated. Both trees throw the same message from addTrack, one layer apart:
    // on the parent from the addMotionTrack hook after #tracks and the graph were committed,
    // here from #addTrack's #motions check before anything happens. The message is therefore
    // not the evidence. The two assertions after it are, and both use the exact string, because
    // a loose pattern is how a message that moved layers passes for one that never fired.
    expect(() => handle.addTrack(ramp("arm"), { motionId: "late" })).toThrow(
      'Unknown motion "late".',
    );
    expect(() => handle.track("late/arm")).toThrow('Unknown graph node "late/arm".');
    expect(() => handle.destroyMotion("late")).toThrow('Unknown motion "late".');

    expect(nodeIds(handle)).toEqual(before);
    expect(internals(handle).instanceCount).toBe(0);

    clock.tick(16);
    scheduler.flush();
    expect(internals(handle).diagnostics.entries.length).toBe(diagnosticsBefore);

    handle.dispose();
  });

  it("T-4 disposes the driver exactly once when a runtime Motion is destroyed", () => {
    const hero = scrollSource();
    const counting = countingFactory(() => hero);
    const { clock, scheduler, handle } = load([], counting.factory);

    handle.addMotion({ id: "scene", trigger: { type: "scroll", source: "hero" }, tracks: [] });
    expect(hero.subscriptions).toBe(1);

    handle.destroyMotion("scene");

    // Exactly once, not at least once. releaseMotion deletes from createdTriggers so the later
    // disposeComposition loop cannot reach it again; a 2 here means that guarantee broke.
    expect(counting.disposals("scene")).toBe(1);
    expect(hero.unsubscribes).toBe(1);

    clock.tick(16);
    scheduler.flush();
    hero.emit(0.5);
    scheduler.flush();
    expect(counting.disposals("scene")).toBe(1);
    expect(hero.unsubscribes).toBe(1);

    handle.dispose();
  });

  it("T-5 leaves zero live driver subscriptions after the project is disposed", () => {
    const hero = scrollSource();
    const aside = scrollSource();
    const sources = new Map([
      ["hero", hero],
      ["aside", aside],
    ]);
    const counting = countingFactory(({ trigger }) => sources.get(trigger.source ?? ""));
    const authoredScroll: MotionDefinition = {
      id: "authored",
      trigger: { type: "scroll", source: "hero" },
      tracks: [],
    };
    const { clock, scheduler, handle } = load([authoredScroll], counting.factory);

    handle.addMotion({ id: "late", trigger: { type: "scroll", source: "aside" }, tracks: [] });
    handle.addMotion(timeMotion("timed"));
    expect(counting.created).toEqual(["authored", "late", "timed"]);

    handle.dispose();

    expect(hero.unsubscribes).toBe(1);
    expect(aside.unsubscribes).toBe(1);
    expect(counting.disposals("authored")).toBe(1);
    expect(counting.disposals("late")).toBe(1);
    expect(counting.disposals("timed")).toBe(1);

    // Nothing may still be listening. A post-dispose tick or emission that reached a driver
    // would surface here as a second dispose or a second unsubscribe.
    clock.tick(250);
    scheduler.flush();
    hero.emit(1);
    expect(counting.disposals("timed")).toBe(1);
    expect(hero.unsubscribes).toBe(1);
  });

  it("T-6 rolls the Motion back when the candidate graph rejects it", () => {
    const counting = countingFactory();
    const { clock, scheduler, handle } = load([], counting.factory);
    const before = nodeIds(handle);
    const rejected: MotionDefinition = {
      id: "bad/id",
      trigger: { type: "time", duration: 1000 },
      tracks: [],
    };

    // buildGraphIR runs assertAuthoredMotionId, so a slashed id is a real graph rejection with
    // no injected builder and no new Engine option. The original error must reach the caller
    // unchanged, not the rollback's own failure.
    expect(() => handle.addMotion(rejected)).toThrow(/^motion-id at motions\[0\]\.id:/);

    // The red half. On the parent the graph is replaced before createMotion runs, so the factory
    // is never asked and created is empty. Post-fix the Motion is built, then rolled back.
    expect(counting.created).toEqual(["bad/id"]);
    expect(counting.disposals("bad/id")).toBe(1);

    expect(nodeIds(handle)).toEqual(before);
    expect(internals(handle).instanceCount).toBe(0);

    // No orphaned clock consumer survived the rollback: a Motion added afterwards still advances
    // exactly one step per tick. A leaked consumer would double-advance or throw into the fanout.
    handle.addMotion(timeMotion("good"));
    handle.addTrack(ramp("arm"), { motionId: "good" });
    scheduler.flush();
    clock.tick(250);
    scheduler.flush();
    expect(handle.get("good/arm")?.values).toEqual({ x: 25 });
    clock.tick(250);
    scheduler.flush();
    expect(handle.get("good/arm")?.values).toEqual({ x: 50 });

    handle.dispose();
  });

  it("T-7 keeps one clock subscription when a Motion is created at runtime", () => {
    let subscriptions = 0;
    const base = createManualClock();
    const clock = {
      subscribe(listener: Parameters<typeof base.subscribe>[0]) {
        subscriptions += 1;
        return base.subscribe(listener);
      },
    };
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load({
      schemaVersion: 5,
      motions: [
        { id: "m1", trigger: { type: "manual" }, tracks: [] },
        { id: "m2", trigger: { type: "manual" }, tracks: [] },
        { id: "m3", trigger: { type: "manual" }, tracks: [] },
        { id: "m4", trigger: { type: "manual" }, tracks: [] },
      ],
    });

    handle.addMotion(timeMotion("timed"));
    handle.addTrack(ramp("arm"), { motionId: "timed" });

    // One subscription for the whole project, runtime Motions included. Non-negotiable 5 of the
    // trigger plan, asserted through the runtime path rather than the load path.
    expect(subscriptions).toBe(1);

    scheduler.flush();
    base.tick(250);
    scheduler.flush();
    expect(handle.get("timed/arm")?.values).toEqual({ x: 25 });

    handle.dispose();
    base.dispose();
  });
});
