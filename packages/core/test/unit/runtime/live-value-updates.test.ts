import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type {
  AuthoredStaticValue,
  PatchBatch,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { StaleTrackHandleError, type TrackHandle } from "../../../src/contract/track-handle";
import { PluginRegistry } from "../../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

/**
 * Issue #218, part B of #212. The two runtime entry points: a read-time mask and an authored
 * replacement, neither of which may validate a whole definition, stage a Track, or rebuild the
 * graph.
 *
 * Driven through `Engine` rather than through a bare `ProjectRuntime`, because the claim under test
 * is that the retained definition and the live composition cannot disagree, and only the loaded
 * composition owns the second half of that.
 */
const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const RULE_ID = "live-value-key";
const ARM = "hero/arm";
const LEG = "hero/leg";
const ARM_TRACK: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: {
    transform: {
      values: {
        x: 200,
        y: 300,
        rotation: [
          { p: 0, v: 0 },
          { p: 1, v: 90 },
        ],
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

/**
 * The seam this file's failing-first run declares, deleted by the commit that lands the source.
 * The reason is `typecheck`, exactly as in the domain suite beside it.
 */
interface LiveHandle {
  overrideValues(next: Readonly<Record<string, AuthoredStaticValue>>): PatchBatch;
  setValues(next: Readonly<Record<string, AuthoredStaticValue>>): PatchBatch;
}
function liveTrack(handle: ProjectHandle, id: string): TrackHandle & LiveHandle {
  return handle.track(id) as TrackHandle & LiveHandle;
}

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
function code(path: string): string {
  return readFileSync(path, "utf8")
    .split("\n")
    .filter((line) => !/^(?:\/\/|\/\*|\*)/.test(line.trim()))
    .join("\n");
}
function region(source: string, from: string, until: string): string {
  const start = source.indexOf(from);
  expect(start).toBeGreaterThan(-1);
  const end = source.indexOf(until, start + from.length);
  expect(end).toBeGreaterThan(start);
  return source.slice(start, end);
}
function values(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}
/** The authored group as retained, which is what `handle.track` answers with. */
function retained(handle: TrackHandle): unknown {
  return handle.track.keyframes?.transform;
}

describe("live values reach the graph without replacing it", () => {
  it("LV-4 never reaches replace(), and a real replace() drops the mask", () => {
    const handle = load();
    const track = liveTrack(handle, ARM);
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
    const track = liveTrack(handle, ARM);
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    const batch = track.overrideValues({ x: 260 });

    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith([ARM]);
    expect(batch).toBe(invalidate.mock.results[0]?.value);
    expect(batch.seeds).toEqual([ARM]);

    // One invalidate owner and one diagnostics channel, which is a claim about the code and is
    // asserted as one: a healthy flush has nothing to record.
    const write = region(code(RUNTIME_SOURCE), "#writeValues(", "#replaceWithObservation(");
    expect(write).toContain("this.#graph.invalidate([nodeId])");
    expect(write).toContain("this.#diagnostics.recordAll(batch.diagnostics)");
    handle.dispose();
  });

  it("LV-8 rewrites the retained definition and keeps topology and progress", () => {
    const handle = load();
    const track = liveTrack(handle, ARM);
    handle.seek(ARM, 0.5);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    track.setValues({ x: 260 });

    // `handle.track` reads the retained definition, so this is the assertion that separates a
    // `setValues` from an override, and the mutant that updates only the mask dies here.
    expect(retained(track)).toEqual({
      values: {
        x: 260,
        y: 300,
        rotation: [
          { p: 0, v: 0 },
          { p: 1, v: 90 },
        ],
      },
    });
    expect(track.track.id).toBe("arm");
    expect(track.track.duration).toBe(400);
    // Progress survives because nothing recompiled: the interpolator still holds 0.5.
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 45 });
    expect(replaceGraph).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("LV-9 merges partially and preserves the observation the track declared", () => {
    const handle = load();
    const arm = liveTrack(handle, ARM);
    const leg = liveTrack(handle, LEG);
    handle.seek(ARM, 0.5);

    arm.setValues({ x: 260 });
    leg.setValues({ x: 40 });

    // Omitted keys are unchanged in the definition and in the composition, not defaulted away.
    expect(retained(arm)).toEqual({
      values: {
        x: 260,
        y: 300,
        rotation: [
          { p: 0, v: 0 },
          { p: 1, v: 90 },
        ],
      },
    });
    expect(values(handle, ARM)).toEqual({ x: 260, y: 300, rotation: 45 });
    expect(retained(leg)).toEqual({ values: { x: 40 } });
    expect(leg.track.observes).toEqual([{ source: ARM }]);
    expect(handle.dependantsOf(ARM)).toEqual([LEG]);
    handle.dispose();
  });

  it("LV-10 invalidates the dependent, asserted on its patch rather than on a flag", () => {
    const handle = load();
    const arm = liveTrack(handle, ARM);
    handle.seek(ARM, 0.5);

    const batch = arm.setValues({ x: 260 });

    expect(batch.patches.map((patch) => patch.nodeId)).toContain(LEG);
    expect(batch.patches.length).toBeGreaterThan(1);
    handle.dispose();
  });

  it("LV-11 refuses an animated key by name and commits nothing", () => {
    const handle = load();
    const arm = liveTrack(handle, ARM);
    handle.seek(ARM, 0.5);
    const before = arm.track;
    const published = values(handle, ARM);
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    // Refused until the port grows a per-key capability, which `LV-12` pins as not having happened.
    // A partial implementation that froze an authored animation is the failure this slice avoids.
    const refusals = [
      () => arm.setValues({ rotation: 45 }),
      () => arm.overrideValues({ rotation: 45 }),
    ];
    for (const refuse of refusals) {
      let thrown: unknown;
      expect(() => {
        try {
          refuse();
        } catch (error) {
          thrown = error;
          throw error;
        }
      }).toThrow(TypeError);
      expect((thrown as { ruleId?: string }).ruleId).toBe(RULE_ID);
    }

    expect(arm.track).toBe(before);
    expect(values(handle, ARM)).toEqual(published);
    expect(invalidate).not.toHaveBeenCalled();
    handle.dispose();
  });

  it("LV-13 refuses both new members on a stale handle", () => {
    const handle = load();
    const leg = liveTrack(handle, LEG);
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
