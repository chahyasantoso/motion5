import { describe, expect, it, vi } from "vitest";
import { fileURLToPath } from "node:url";
import type { AuthoredStop, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { StaleTrackHandleError, type TrackHandle } from "../../../src/contract/track-handle";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { code, member } from "../../helpers/source-region";

/**
 * Issue #218, part B of #212, extended by issue #231. The two runtime entry points, neither of which
 * may validate a whole definition for a static write, stage a Track for one, or ever rebuild the
 * graph.
 *
 * Driven through `Engine` rather than through a bare `ProjectRuntime`, because the claim under test
 * is that the retained definition and the live composition cannot disagree, and only the loaded
 * composition owns the second half of that.
 *
 * The interpolator here is the fake, which declares no `patchKeys` and therefore declines every
 * animated write. That makes this the file that owns the escalation. The patching backend's end to
 * end behavior is `live-value-animated.test.ts`.
 *
 * `LV-11` retires here, both halves, because finding 11 of issue #231 deletes the reason it
 * asserted: an animated key is no longer refused on either entry point.
 */
const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const ARM = "hero/arm";
const LEG = "hero/leg";
const AUTHORED_ROTATION = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 90 },
]);
/** Twice the authored sweep, so the published value at half progress moves from 45 to 90. */
const FASTER = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 180 },
]);
const ARM_TRACK: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: {
    transform: {
      values: {
        x: 200,
        y: 300,
        rotation: AUTHORED_ROTATION,
      },
    },
  },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        ARM_TRACK,
        {
          id: "leg",
          keyframes: { transform: { values: { x: 10 } } },
          observes: [{ source: ARM }],
        },
      ],
    },
  ],
};

function load(): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  handle.mount(ARM);
  handle.mount(LEG);
  return handle;
}
/**
 * The `ProjectRuntime` behind a loaded handle.
 *
 * `Engine` already hangs it off the handle as a non-enumerable `_runtime`. These cases spy on the
 * graph rather than on a hook, because "does not rebuild the graph" is a claim about the owner of
 * the graph and not about who called whom.
 */
function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as unknown as { _runtime: ProjectRuntime })._runtime;
}
function values(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}
/** The authored group as retained, which is what `handle.definition` answers with. */
function retained(handle: TrackHandle): unknown {
  return handle.definition.keyframes?.transform;
}

describe("live values reach the graph without replacing it", () => {
  it("LV-4 never reaches replace(), and a real replace() drops the mask", () => {
    const handle = load();
    const track = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    track.overrideValues({ x: 260 });
    // A mask is replaced wholesale by the next write, whichever entry point makes it, so the
    // authored `x` is back and the authored `y` is the one this call moved.
    track.setValues({ y: 320 });

    expect(replaceGraph).not.toHaveBeenCalled();
    expect(values(handle, ARM)).toEqual({ x: 200, y: 320, rotation: 45 });

    // Stickiness ends at a real replacement by construction rather than through a clearing step:
    // `#replaceTrack` stages a freshly compiled Track and disposes the displaced one.
    track.replace(ARM_TRACK);
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    handle.seek(ARM, 0.5);
    expect(values(handle, ARM)).toEqual({ x: 200, y: 300, rotation: 45 });
    handle.dispose();
  });

  it("LV-5 invalidates exactly once and returns that batch", () => {
    const handle = load();
    const track = handle.track(ARM);
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    const batch = track.overrideValues({ x: 260 });

    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith([ARM]);
    expect(batch).toBe(invalidate.mock.results[0]?.value);
    expect(batch.seeds).toEqual([ARM]);

    // One invalidate owner and one diagnostics channel, which is a claim about the code and is
    // asserted as one: a healthy flush has nothing to record. Addressed by the member that owns the
    // claim rather than by the next member's name, and that is not a tidy-up: the retired bounds
    // read from the `#writeValues(` call inside `#handle`, which is declared earlier, to the
    // `#replaceWithObservation` declaration, so this one-owner claim was being measured over a
    // fifteen-member window containing `#apply` and `#invalidateOne`. See issue #314.
    const write = member(code(RUNTIME_SOURCE), "#writeValues(");
    expect(write).toContain("this.#graph.invalidate([nodeId])");
    expect(write).toContain("this.#diagnostics.recordAll(batch.diagnostics)");
    handle.dispose();
  });

  it("LV-8 rewrites the retained definition and keeps topology and progress", () => {
    const handle = load();
    const track = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    track.setValues({ x: 260 });

    // `handle.definition` reads the retained definition, so this is the assertion that separates a
    // `setValues` from an override, and the mutant that updates only the mask dies here.
    expect(retained(track)).toEqual({
      values: {
        x: 260,
        y: 300,
        rotation: AUTHORED_ROTATION,
      },
    });
    expect(track.definition.id).toBe("arm");
    expect(track.definition.duration).toBe(400);
    // Progress survives because nothing recompiled: the interpolator still holds 0.5.
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 45 });
    expect(replaceGraph).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("LV-9 merges partially and preserves the observation the track declared", () => {
    const handle = load();
    const arm = handle.track(ARM);
    const leg = handle.track(LEG);
    handle.seek(ARM, 0.5);

    arm.setValues({ x: 260 });
    leg.setValues({ x: 40 });

    // Omitted keys are unchanged in the definition and in the composition, not defaulted away.
    expect(retained(arm)).toEqual({
      values: {
        x: 260,
        y: 300,
        rotation: AUTHORED_ROTATION,
      },
    });
    expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 45 });
    expect(retained(leg)).toEqual({ values: { x: 40 } });
    expect(leg.definition.observes).toEqual([{ source: ARM }]);
    expect(handle.dependantsOf(ARM)).toEqual([LEG]);
    handle.dispose();
  });

  it("LV-10 invalidates the dependent, asserted on its patch rather than on a flag", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);

    const batch = arm.setValues({ x: 260 });

    expect(batch.patches.map((patch) => patch.nodeId)).toContain(LEG);
    expect(batch.patches.length).toBeGreaterThan(1);
    handle.dispose();
  });

  it("PK-16 escalates through one stageTrack when the backend declines", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    arm.setValues({ rotation: FASTER });

    // The declining backend and the patching one publish the same values at the same progress,
    // which is the substitutability claim, and neither of them rebuilds the graph.
    expect(values(handle, ARM)).toEqual({ x: 200, y: 300, rotation: 90 });
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: FASTER } });
    expect(replaceGraph).not.toHaveBeenCalled();
    handle.dispose();

    // The override half of the same escalation: the published value moves and the definition does
    // not, so the escalation compiles from a definition that is not the retained one.
    const second = load();
    const overridden = second.track(ARM);
    second.seek(ARM, 0.5);
    const graph = vi.spyOn(runtimeOf(second).graph, "replaceGraph");

    overridden.overrideValues({ rotation: FASTER });

    expect(values(second, ARM)).toEqual({ x: 200, y: 300, rotation: 90 });
    expect(retained(overridden)).toEqual({
      values: { x: 200, y: 300, rotation: AUTHORED_ROTATION },
    });
    expect(graph).not.toHaveBeenCalled();

    // And it is revertible, through the same call that made it.
    overridden.overrideValues({});
    expect(values(second, ARM)).toEqual({ x: 200, y: 300, rotation: 45 });
    second.dispose();
  });

  it("PK-17 refuses a malformed stop list before anything mutates, on both entry points", () => {
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);
    const before = arm.definition;
    const published = values(handle, ARM);
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");
    // Definition-shaped input, so `validateKeyframes` owns its shape and this is the one write that
    // has to reach it. A stop with no position is `stop-position`.
    const malformed = [{ v: 1 }] as unknown as readonly AuthoredStop[];

    expect(() => arm.setValues({ rotation: malformed })).toThrow(TypeError);
    expect(() => arm.overrideValues({ rotation: malformed })).toThrow(TypeError);

    expect(arm.definition).toBe(before);
    expect(values(handle, ARM)).toEqual(published);
    expect(invalidate).not.toHaveBeenCalled();

    // The static-only path is asserted not to reach the validator at all, which is what keeps its
    // cost exactly what it was.
    arm.setValues({ x: 260 });
    expect(invalidate).toHaveBeenCalledTimes(1);
    // Bounded by the member the claim is about rather than by a neighbour's name. See issue #314.
    const write = member(code(RUNTIME_SOURCE), "#writeValues(");
    expect(write).toContain("if (involved)");
    expect(write).toContain("validateTrackDefinition(rewritten");
    handle.dispose();
  });

  it("PK-19 pins the two mutants no other case can see", () => {
    // Each other guard is owned by the case named beside it: returning true on an empty rebuild is
    // `PK-4`, a dropped proxy re-seed is `PK-9`, killed siblings are `PK-3`, a padding tween inside
    // the retained map is `PK-8`, patching before every key is classified is `PK-15`, and a decline
    // read as a success is `PK-16`. The two below are this case's own.
    const handle = load();
    const arm = handle.track(ARM);
    handle.seek(ARM, 0.5);

    // Skipping the re-seek on escalation is the amendment's own defect, and it shows up as a
    // freshly compiled Track sitting at progress 0 while the runtime still reports 0.5.
    arm.setValues({ rotation: FASTER });
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(values(handle, ARM)).toEqual({ x: 200, y: 300, rotation: 90 });

    // An overlay left populated after a rebase would revert the sticky write on the next one, so a
    // static write following it would silently lose the animated key it never named.
    arm.setValues({ x: 260 });
    expect(retained(arm)).toEqual({ values: { x: 260, y: 300, rotation: FASTER } });
    expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 90 });
    handle.dispose();
  });

  it("LV-13 refuses both new members on a stale handle", () => {
    const handle = load();
    const leg = handle.track(LEG);
    leg.remove();

    expect(() => leg.overrideValues({ x: 40 })).toThrow(StaleTrackHandleError);
    expect(() => leg.setValues({ x: 40 })).toThrow(StaleTrackHandleError);
    expect(leg.live).toBe(false);
    // Uniformity itself is `SH-1`, which derives its surface from the handle's own keys and covers
    // both members the moment they exist. This adds the half that check cannot see: a refused write
    // leaves the graph alone.
    expect(handle.dependantsOf(ARM)).toEqual([]);
    handle.dispose();
  });
});
