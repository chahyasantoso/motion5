import { describe, expect, it, vi } from "vitest";
import type {
  PluginComposer,
  PluginDefinition,
  RequirementInputs,
} from "../../../src/domain/plugins";
import { Track, type TrackSnapshot } from "../../../src/domain/track";
import type { ImmutableRecord, ImmutableValue } from "../../../src/domain/values";
import { createPlugin, resolvePlugins } from "../../helpers/resolved-plugins";

/**
 * The two methods slice B of issue #195 adds, declared here so this file compiles against the
 * parent, where neither exists yet. Deleted by the commit that lands them.
 *
 * A red run has to fail its assertions rather than `typecheck`, because `quality` runs `typecheck`
 * before `npm test` and a job that stops there ran no test at all. Run 33025118261 is this
 * project's anchor for that being a real trap rather than a hypothetical one.
 */
interface ComposeSeam {
  interpolated(): ImmutableRecord;
  composeFrom(seed: ImmutableRecord, requirementInputs?: RequirementInputs): TrackSnapshot;
}

function readNumber(value: unknown): number {
  return typeof value === "number" ? value : 0;
}
function isRecordValue(value: ImmutableValue | undefined): value is ImmutableRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function slotNumber(slot: ImmutableValue | undefined, key: string): number {
  return isRecordValue(slot) ? readNumber(slot[key]) : 0;
}
/**
 * A bone: its parent's rotation from its declared slot, its own from its authored values.
 *
 * It replaces the record it is given rather than spreading it, exactly as `fkPlugin` does, so a
 * seed carrying a key this plugin does not answer for cannot reach publication by accident.
 */
const bone: PluginComposer = (values, progress, inputs) => ({
  length: readNumber(values.length),
  rotation: slotNumber(inputs.base, "rotation") + readNumber(values.rotation),
});
/** Keeps whatever the seed carried and derives one namespaced key of its own. */
const leaky: PluginComposer = (values) => ({ ...values, "fk:derived": 1 });
/** One bound slot, so a composition has an upstream value as well as an interpolated one. */
const BASE: RequirementInputs = Object.freeze({
  fk: Object.freeze({ base: Object.freeze({ rotation: 5 }) }),
});
/**
 * A timeline whose state is a function of progress, plus one interpolator scratch key.
 *
 * The `Track` leaf suite's double publishes an empty state, which cannot tell "read the timeline"
 * apart from "read the seed". This one can: at progress `p` a bone interpolates to
 * `rotation: 10 + 20 * p`, and composes to `15 + 20 * p` once `BASE` is bound.
 */
function createTrack(...plugins: readonly PluginDefinition[]) {
  const state: Record<string, unknown> = {};
  let current = 0;
  const update = () => {
    state.length = 60;
    state.rotation = 10 + 20 * current;
    state._scratch = "interpolator scratch";
  };
  update();
  const timeline = {
    duration: 1,
    state,
    progress: (value?: number) => {
      if (value === undefined) return current;
      current = value;
      update();
      return current;
    },
    kill: vi.fn(),
  };
  const track = new Track({
    interpolator: { create: () => timeline },
    plugins: resolvePlugins(...plugins),
  });
  // The whole of this file's compile-time debt against the parent. See `ComposeSeam`.
  return track as Track & ComposeSeam;
}
function createBoneTrack(compose: PluginComposer = bone) {
  return createTrack(createPlugin("fk", compose));
}

describe("Track composition split", () => {
  it("CF-1 composes from its own interpolated state, value for value", () => {
    // The equivalence this slice is for: `compose` is `composeFrom(interpolated())` and nothing
    // else, so no existing track composes differently for having been split.
    for (const progress of [0, 0.5, 1]) {
      const chained = createBoneTrack();
      const seeded = createBoneTrack();
      chained.setProgress(progress);
      seeded.setProgress(progress);
      expect(chained.compose(BASE).values).toEqual({ length: 60, rotation: 15 + 20 * progress });
      expect(seeded.composeFrom(seeded.interpolated(), BASE)).toEqual(chained.compose(BASE));
    }
  });
  it("CF-2 reads the interpolated state before any plugin runs", () => {
    const compose = vi.fn(bone);
    const track = createBoneTrack(compose);
    track.setProgress(0.5);
    // Renderer-neutral, so the interpolator's own `_scratch` is not in it, and pre-plugin, so the
    // authored `rotation` is still local rather than the world value `bone` returns.
    expect(track.interpolated()).toEqual({ length: 60, rotation: 20 });
    expect(compose).not.toHaveBeenCalled();
    // A read, not a composition: nothing is memoized and the track is still dirty.
    expect(track.dirty).toBe(true);
  });
  it("CF-3 runs the plugin chain over the seed it is handed", () => {
    const track = createBoneTrack();
    track.setProgress(0.5);
    const seeded = track.composeFrom({ ...track.interpolated(), rotation: 40 }, BASE);
    expect(seeded.values).toEqual({ length: 60, rotation: 45 });
    expect(seeded.progress).toBe(0.5);
    // The seed is not adopted as this track's state: its own timeline still answers for `compose`.
    expect(track.compose(BASE).values).toEqual({ length: 60, rotation: 25 });
  });
  it("CF-4 keys the memo on the seed as well as on the requirement inputs", () => {
    const compose = vi.fn(bone);
    const track = createBoneTrack(compose);
    const seed = track.interpolated();
    const first = track.composeFrom(seed, BASE);
    // Structural, because `compose` builds a fresh record every tick and a memo keyed on identity
    // would recompose on every one of them.
    expect(track.composeFrom({ ...seed }, BASE)).toBe(first);
    // A different seed is a different question, which the dirty flag alone cannot see.
    expect(track.composeFrom({ ...seed, rotation: 40 }, BASE)).not.toBe(first);
    expect(compose).toHaveBeenCalledTimes(2);
  });
  it("CF-5 refuses both halves of the split on a disposed track", () => {
    const track = createBoneTrack();
    const seed = track.interpolated();
    track.dispose();
    expect(() => track.interpolated()).toThrow(/disposed/);
    expect(() => track.composeFrom(seed)).toThrow(/disposed/);
  });
  it("CF-6 filters and freezes once, whatever the seed carried", () => {
    const track = createTrack(createPlugin("fk", leaky));
    const published = track.composeFrom({ length: 60, "fk:seeded": 7 });
    // ADR-042's single filter point survives the split. It is still the publication seam, and a
    // namespaced key is dropped there whether a plugin derived it or a seed carried it in.
    expect(published.values).toEqual({ length: 60 });
    expect(Object.isFrozen(published.values)).toBe(true);
  });
  it("CF-7 shares one memo between the two entry points", () => {
    const compose = vi.fn(bone);
    const track = createBoneTrack(compose);
    const seeded = track.composeFrom(track.interpolated(), BASE);
    // One memo, so `compose` answers from the seeded composition rather than keeping a second one.
    expect(track.compose(BASE)).toBe(seeded);
    expect(compose).toHaveBeenCalledTimes(1);
  });
});
