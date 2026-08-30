import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { PluginComposer } from "../../../src/domain/plugins";
import { LiveValueKeyError, Track } from "../../../src/domain/track";
import { createPlugin, resolveAuthored } from "../../helpers/resolved-plugins";

/**
 * Issue #218, part B of #212. One invariant: a live value change reaches composition, the
 * publisher's `MemberState`, and every dependent, without a `TrackDefinition` validation, a staged
 * Track, or a graph rebuild.
 *
 * This file owns the overlay itself: one layer inside `Track`, one refusal, and no registry. The
 * two runtime entry points are `unit/runtime/live-value-updates.test.ts` and the two surfaces one
 * call has to reach are `integration/live-value-composition.test.ts`.
 *
 * The failing-first run declared `overrideValues` in a local `LiveTrack` interface and cast to it,
 * because a test naming a method that does not exist fails `typecheck` and stops `quality` before
 * `npm test`. That declaration is deleted by the commit that landed the source, exactly as #217's
 * `StaleSeam` was. See ADR-059.
 */
const PORT_SOURCE = fileURLToPath(new URL("../../../src/ports/interpolator.ts", import.meta.url));
const TRACK_SOURCE = fileURLToPath(new URL("../../../src/domain/track.ts", import.meta.url));
/** Two static leaves this suite may mask, and one animated leaf it may not. */
const AUTHORED = Object.freeze({
  length: 60,
  width: 20,
  rotation: [
    { p: 0, v: 10 },
    { p: 1, v: 30 },
  ],
});

/** Keeps every key it is handed, so a masked value is visible in the published record. */
const identity: PluginComposer = (values) => ({ ...values });

function createTrack(compose: PluginComposer = identity) {
  const state: Record<string, unknown> = {};
  let current = 0;
  const update = () => {
    state.length = 60;
    state.width = 20;
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
  return new Track({
    interpolator: { create: () => timeline },
    plugins: resolveAuthored(AUTHORED, createPlugin("fk", compose)),
    nodeId: "~/live",
  });
}
/** The thrown value for one refused key, because each case asserts on more than one facet of it. */
function refusalFor(key: string): LiveValueKeyError {
  const track = createTrack();
  try {
    track.overrideValues({ [key]: 1 });
  } catch (error) {
    if (error instanceof LiveValueKeyError) return error;
    throw error;
  }
  throw new Error(`Expected "${key}" to be refused.`);
}
/** Strips whole-line comments before a source assertion. A gate reads code, never prose. */
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

describe("a live value masks the interpolated state, and nothing else", () => {
  it("LV-1 merges over the interpolated state and leaves the animating key alone", () => {
    const track = createTrack();
    track.setProgress(0.5);
    expect(track.interpolated()).toEqual({ length: 60, width: 20, rotation: 20 });

    track.overrideValues({ length: 100 });

    // The mask, the untouched sibling, and the animated key the timeline still owns.
    expect(track.interpolated()).toEqual({ length: 100, width: 20, rotation: 20 });
    expect(track.compose().values).toEqual({ length: 100, width: 20, rotation: 20 });
    track.setProgress(1);
    expect(track.interpolated()).toEqual({ length: 100, width: 20, rotation: 30 });
  });

  it("LV-6 is sticky, is replaced wholesale, and an empty record is the clear", () => {
    const track = createTrack();
    track.overrideValues({ length: 100 });
    track.setProgress(0.5);
    // Sticky across a progress write and across any number of reads.
    expect(track.interpolated().length).toBe(100);
    expect(track.compose().values.length).toBe(100);

    // Wholesale rather than accumulated: the previous key is gone, not merged with.
    track.overrideValues({ width: 5 });
    expect(track.interpolated()).toEqual({ length: 60, width: 5, rotation: 20 });

    // The clear, as contract rather than as an accident of the merge. One question, one mechanism:
    // an empty record is no mask, so no `clearOverrides()` and no null overload exists.
    track.overrideValues({});
    expect(track.interpolated()).toEqual({ length: 60, width: 20, rotation: 20 });
  });

  it("LV-7 refuses four keys for one reason each, with no mutation and no publish", () => {
    // One table, because all four resolve through `authoredKeyframes` plus `readAuthoredLeaf`:
    // three are absent from the authored record and the fourth is animated. A colon is reserved in
    // every authored name and an underscore is interpolator scratch, so neither can be present.
    expect(refusalFor("z").reason).toBe("unknown");
    expect(refusalFor("fk:derived").reason).toBe("unknown");
    expect(refusalFor("_scratch").reason).toBe("unknown");
    expect(refusalFor("rotation").reason).toBe("animated");

    const refused = refusalFor("rotation");
    expect(refused).toBeInstanceOf(TypeError);
    expect(refused.ruleId).toBe("live-value-key");
    expect(LiveValueKeyError.ruleId).toBe("live-value-key");
    expect(refused.key).toBe("rotation");
    expect(refused.nodeId).toBe("~/live");

    const track = createTrack();
    const before = track.compose().values;
    expect(() => track.overrideValues({ length: 100, rotation: 1 })).toThrow(LiveValueKeyError);
    // Nothing, not even the accepted key in the same call: that is what no mutation means.
    expect(track.compose().values).toEqual(before);
    expect(track.interpolated().length).toBe(60);
  });

  it("LV-12 leaves the Interpolator port without a per-key member", () => {
    const timeline = region(code(PORT_SOURCE), "export interface InterpolationTimeline {", "}");
    const declared = [...timeline.matchAll(/^ {2}(?:readonly )?([A-Za-z]\w*)/gm)].map(
      (match) => match[1],
    );

    // The refusal in `LV-11` is the contract, so it cannot be quietly replaced by a half-built
    // capability. A per-key write is a second slice with its own invariant, two GSAP backends, the
    // fake in `testing/`, and a contract tier.
    expect([...new Set(declared)].sort()).toEqual(["duration", "kill", "progress", "state"]);
    expect(timeline).not.toMatch(/patchKey|patchValue|setValue/);
  });

  it("LV-14 kills the mutant that drops the overlay from `interpolated()`", () => {
    const track = createTrack();
    const before = track.compose().values;

    track.overrideValues({ length: 100 });

    // A `#dirty` mutation is not evidence: `#memoized` compares the retained seed to the incoming
    // one, and a changed overlay is a changed seed whether or not a flag was set. What is
    // load-bearing is that the overlay is inside `interpolated()` at all, because that is the one
    // read the publisher's `MemberState` and every composition share. The other two mutants this
    // slice names -- skipping the invalidate, and updating the mask while leaving the retained
    // definition stale -- are killed by `LV-5` and `LV-8`.
    expect(track.interpolated()).not.toEqual(before);
    expect(track.compose().values).not.toEqual(before);
    expect(region(code(TRACK_SOURCE), "interpolated(): ImmutableRecord {", "compose(")).toContain(
      "this.#values",
    );
  });
});
