import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../src/engine";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

/**
 * Issue #223, slice A3.
 *
 * The publisher caches one node per graph node, and the closure that node carries for a solver
 * member captured its compiled `Track` at cache time, unlike the `compose` closure two lines above
 * it in `engine.ts`, which resolves the compiled map per call. `replaceGraph` clearing the whole
 * cache hid that capture behind topology: every structural path rebuilds the graph, so a captured
 * Track was only ever displaced together with the node holding it.
 *
 * One path does not. A live value write whose backend declines `patchKeys` escalates to `stageTrack`
 * plus one re-seek, and topology did not move, so nothing rebuilds the graph and nothing clears the
 * cache. The captured Track is the disposed one from that commit on, and `interpolated()` on a
 * disposed Track throws, so the solver failed composition and its whole chain blocked while every
 * ordinary node published from the replacement, because `compose` had resolved the map per call all
 * along.
 *
 * ADR-051's worked rig, so the numbers are the ones `IK-1`, `IK-13` and `LV-2` already pin: root at
 * `200,300`, goal at `320,340`, lengths `80` and `60`, solving to `40.168` and `-51.318`. The one
 * departure is that `upper-arm` authors its `length` as a flat two-stop animation rather than as a
 * static, because only an animated key reaches the overlay at all, and a flat one leaves every
 * number above exactly where it was.
 *
 * The interpolator is the fake, which declares no `patchKeys` and therefore declines every animated
 * write by design. That is what makes the escalation the ordinary path here rather than a fault
 * injection.
 */
const SHOULDER = "walker/shoulder";
const TARGET = "walker/hand-target";
const SOLVER = "walker/arm-solve";
const UPPER = "walker/upper-arm";
const FOREARM = "walker/forearm";
/** Outside the rig, and the twin of every solver-member case below. See `RA-17`. */
const HUD = "~/hud";
const NODES = [SHOULDER, TARGET, SOLVER, UPPER, FOREARM, HUD] as const;
/** Flat two-stop leaves: animated, so a live write reaches the overlay, and constant in progress. */
const LENGTH_80 = Object.freeze([
  { p: 0, v: 80 },
  { p: 1, v: 80 },
]);
const LENGTH_100 = Object.freeze([
  { p: 0, v: 100 },
  { p: 1, v: 100 },
]);
const LENGTH_120 = Object.freeze([
  { p: 0, v: 120 },
  { p: 1, v: 120 },
]);
const HUD_X = Object.freeze([
  { p: 0, v: 5 },
  { p: 1, v: 5 },
]);
const HUD_X_LIVE = Object.freeze([
  { p: 0, v: 9 },
  { p: 1, v: 9 },
]);
const UPPER_ARM: TrackDefinition = {
  id: "upper-arm",
  keyframes: {
    fk: { values: { length: LENGTH_80 }, requires: { base: "shoulder", solver: "arm-solve" } },
  },
};
/** The same node with a longer bone, for the structural path `RA-15` pins. */
const LONGER_UPPER_ARM: TrackDefinition = {
  id: "upper-arm",
  keyframes: {
    fk: { values: { length: LENGTH_120 }, requires: { base: "shoulder", solver: "arm-solve" } },
  },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "walker",
      trigger: { type: "manual" },
      tracks: [
        { id: "shoulder", keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } } },
        {
          id: "hand-target",
          keyframes: { transform: { values: { x: 320, y: 340, rotation: 0 } } },
        },
        {
          id: "arm-solve",
          keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
        },
        UPPER_ARM,
        {
          id: "forearm",
          keyframes: {
            fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
          },
        },
      ],
    },
  ],
  freeTracks: [{ id: "hud", keyframes: { transform: { values: { x: HUD_X } } } }],
};

function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  for (const id of NODES) handle.mount(id);
  handle.seek(SHOULDER, 0);
  return handle;
}
function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as unknown as { _runtime: ProjectRuntime })._runtime;
}
function values(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}
function solved(handle: ProjectHandle): Readonly<Record<string, number>> {
  return values(handle, SOLVER).rotations as Readonly<Record<string, number>>;
}

describe("a solver member is read from the compiled map rather than from a captured Track", () => {
  it("RA-14 reads the recompiled Track when a declining backend escalated a live write", () => {
    const handle = load();
    const runtime = runtimeOf(handle);
    const diagnosed = runtime.diagnostics.entries.length;
    expect(solved(handle)[UPPER]).toBeCloseTo(40.168, 3);

    // No `patchKeys`, so this escalates: `stageTrack` compiles a replacement, `commit()` disposes
    // the displaced Track, and the graph is untouched because topology did not move. The cached
    // publisher node for this member therefore survives, which is the whole of the exposure.
    handle.track(UPPER).overrideValues({ length: LENGTH_100 });

    // Status first, deliberately. A captured Track is the disposed one from the commit on and
    // `interpolated()` refuses on a disposed Track, so the solver fails composition and every member
    // of its chain blocks; reading `rotations` before asserting this would crash the case instead of
    // failing it, and a crash is a broken file rather than evidence.
    expect(handle.get(SOLVER)?.status).toBe("ready");
    expect(handle.get(UPPER)?.status).toBe("ready");
    expect(runtime.diagnostics.entries).toHaveLength(diagnosed);

    // Recomputed rather than merely different: the tip is on the goal with the longer bone, which is
    // the oracle `LV-2` uses for the mask that reaches this same read.
    expect(solved(handle)[UPPER]).not.toBeCloseTo(40.168, 3);
    expect(values(handle, FOREARM).x).toBeCloseTo(320, 1);
    expect(values(handle, FOREARM).y).toBeCloseTo(340, 1);

    handle.dispose();
  });

  it("RA-15 reads the recompiled Track when a replacement rebuilt the graph", () => {
    const handle = load();
    expect(solved(handle)[UPPER]).toBeCloseTo(40.168, 3);

    handle.track(UPPER).replace(LONGER_UPPER_ARM);

    // Green before this slice and green after it, and that is the point: a replacement derives a new
    // graph node, so the publisher builds a new node for it whether the cache was cleared or not.
    // What this pins is that the structural path did not start depending on the clear once the
    // staleness the clear looked like it was for stopped existing.
    expect(handle.get(SOLVER)?.status).toBe("ready");
    expect(solved(handle)[UPPER]).not.toBeCloseTo(40.168, 3);
    expect(values(handle, FOREARM).x).toBeCloseTo(320, 1);
    expect(values(handle, FOREARM).y).toBeCloseTo(340, 1);

    handle.dispose();
  });

  it("RA-16 exposes no publisher cache clear, because nothing could ever call it", () => {
    const handle = load();

    // `clearPublisherCache()` was the escape hatch for exactly the staleness this slice deleted, and
    // it had zero callers repo-wide for as long as it existed. A field with no consumer is removed
    // rather than left declared, and a second mechanism for one question is deleted rather than
    // documented as discouraged.
    expect("clearPublisherCache" in runtimeOf(handle).graph).toBe(false);

    handle.dispose();
  });

  it("RA-17 escalates a live write on an ordinary node, which never needed this fix", () => {
    const handle = load();
    handle.seek(HUD, 0);
    expect(values(handle, HUD).x).toBe(5);

    handle.track(HUD).overrideValues({ x: HUD_X_LIVE });

    // Green on both sides, and it is why the defect was invisible for as long as it was: ordinary
    // composition already resolved the compiled map per call, so the surface every node publishes
    // through survived the escalation that broke the one only a solver member reads.
    expect(values(handle, HUD).x).toBe(9);

    handle.dispose();
  });
});
