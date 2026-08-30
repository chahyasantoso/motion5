import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { LiveValues } from "../../../src/contract/track-handle";
import type { PluginComposer } from "../../../src/domain/plugins";
import { LiveValueKeyError, Track } from "../../../src/domain/track";
import { createPlugin, resolveAuthored } from "../../helpers/resolved-plugins";

/**
 * Issue #218, part B of #212, extended by issue #231.
 *
 * This file owns the overlay itself: one layer inside `Track`, one classification pass, and no
 * registry. The two runtime entry points are `unit/runtime/live-value-updates.test.ts` and
 * `unit/runtime/live-value-animated.test.ts`, the timeline adapter's own contract is
 * `contract/gsap-patch-keys.test.ts`, and the two surfaces one call has to reach are
 * `integration/live-value-composition.test.ts`.
 *
 * `LV-12` retires here, by name. It asserted that the `Interpolator` port grew no per-key member,
 * and `PK-18` replaces it with the inverse gate. See ADR-059 and ADR-060.
 */
const PORT_SOURCE = fileURLToPath(new URL("../../../src/ports/interpolator.ts", import.meta.url));
const TRACK_SOURCE = fileURLToPath(new URL("../../../src/domain/track.ts", import.meta.url));
/** Two static leaves this suite may mask, and one animated leaf it may only patch. */
const AUTHORED = Object.freeze({
  length: 60,
  width: 20,
  rotation: [
    { p: 0, v: 10 },
    { p: 1, v: 30 },
  ],
});
/** A legal animated overlay entry for `rotation`, which this file's timeline always declines. */
const STOPS = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 90 },
]);

/** Keeps every key it is handed, so a masked value is visible in the published record. */
const identity: PluginComposer = (values) => ({ ...values });

function createTrack(compose: PluginComposer = identity, prepared: readonly string[] = []) {
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
  const resolved = resolveAuthored(AUTHORED, createPlugin("fk", compose));
  const entries = prepared.map((key) => [key, AUTHORED.rotation] as const);
  const preparation = Object.freeze({
    keyframes: Object.freeze(Object.fromEntries(entries)),
    tweenVars: Object.freeze({}),
  });
  return new Track({
    interpolator: { create: () => timeline },
    plugins: { ...resolved, preparation },
    nodeId: "~/live",
  });
}
/** The static half of a live write, which is the only half this file's timeline can honor. */
function mask(track: Track, values: LiveValues): void {
  track.writeValues(values, undefined, false);
}
/** The thrown value for one refused key, because each case asserts on more than one facet of it. */
function refusalFor(key: string): LiveValueKeyError {
  const track = createTrack();
  try {
    mask(track, { [key]: 1 });
  } catch (error) {
    if (error instanceof LiveValueKeyError) return error;
    throw error;
  }
  throw new Error(`Expected "${key}" to be refused.`);
}
/** The same, for a key named in the animated half rather than in the mask. */
function overlayRefusalFor(key: string, prepared: readonly string[] = []): LiveValueKeyError {
  const track = createTrack(identity, prepared);
  try {
    track.writeValues({}, { [key]: STOPS }, false);
  } catch (error) {
    if (error instanceof LiveValueKeyError) return error;
    throw error;
  }
  throw new Error(`Expected overlay key "${key}" to be refused.`);
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

    mask(track, { length: 100 });

    // The mask, the untouched sibling, and the animated key the timeline still owns.
    expect(track.interpolated()).toEqual({ length: 100, width: 20, rotation: 20 });
    expect(track.compose().values).toEqual({ length: 100, width: 20, rotation: 20 });
    track.setProgress(1);
    expect(track.interpolated()).toEqual({ length: 100, width: 20, rotation: 30 });
  });

  it("LV-6 is sticky, is replaced wholesale, and an empty record is the clear", () => {
    const track = createTrack();
    mask(track, { length: 100 });
    track.setProgress(0.5);
    // Sticky across a progress write and across any number of reads.
    expect(track.interpolated().length).toBe(100);
    expect(track.compose().values.length).toBe(100);

    // Wholesale rather than accumulated: the previous key is gone, not merged with.
    mask(track, { width: 5 });
    expect(track.interpolated()).toEqual({ length: 60, width: 5, rotation: 20 });

    // The clear, as contract rather than as an accident of the merge. One question, one mechanism:
    // an empty record is no mask, so no `clearOverrides()` and no null overload exists.
    mask(track, {});
    expect(track.interpolated()).toEqual({ length: 60, width: 20, rotation: 20 });
  });

  it("LV-7 refuses four keys for one reason each, with no mutation and no publish", () => {
    // One table, because all four resolve through `authoredKeyframes` plus `readAuthoredLeaf`:
    // three are absent from the authored record and the fourth is animated, so a scalar for it is
    // a leaf kind change rather than a mask. A colon is reserved in every authored name and an
    // underscore is interpolator scratch, so neither can be present.
    expect(refusalFor("z").reason).toBe("unknown");
    expect(refusalFor("fk:derived").reason).toBe("unknown");
    expect(refusalFor("_scratch").reason).toBe("unknown");
    expect(refusalFor("rotation").reason).toBe("kind");

    const refused = refusalFor("rotation");
    expect(refused).toBeInstanceOf(TypeError);
    expect(refused.ruleId).toBe("live-value-key");
    expect(LiveValueKeyError.ruleId).toBe("live-value-key");
    expect(refused.key).toBe("rotation");
    expect(refused.nodeId).toBe("~/live");

    const track = createTrack();
    const before = track.compose().values;
    expect(() => mask(track, { length: 100, rotation: 1 })).toThrow(LiveValueKeyError);
    // Nothing, not even the accepted key in the same call: that is what no mutation means.
    expect(track.compose().values).toEqual(before);
    expect(track.interpolated().length).toBe(60);
  });

  it("PK-15 refuses the animated half by name, classifying every key before it writes", () => {
    // A stop list for a static key is the mirror of `LV-7`'s last row, and both are one reason.
    expect(overlayRefusalFor("length").reason).toBe("kind");
    expect(overlayRefusalFor("z").reason).toBe("unknown");
    expect(overlayRefusalFor("fk:derived").reason).toBe("unknown");
    // A plugin-prepared key is compiled from the plugin's value, and an overlay sits over the base,
    // so patching one would invert that precedence rather than write through it.
    expect(overlayRefusalFor("rotation", ["rotation"]).reason).toBe("prepared");
    expect(overlayRefusalFor("rotation").reason).toBe("kind");

    const track = createTrack();
    track.setProgress(0.5);
    const before = track.compose().values;
    // One legal static key and one refused animated key in the same call, and the legal one is not
    // written either: both halves are classified before anything is assigned.
    const write = () => track.writeValues({ length: 100 }, { length: STOPS }, false);
    expect(write).toThrow(LiveValueKeyError);
    expect(track.compose().values).toEqual(before);
    expect(track.interpolated().length).toBe(60);
  });

  it("PK-16 reports a decline rather than a refusal when the backend has no capability", () => {
    const track = createTrack();
    track.setProgress(0.5);

    // This file's timeline declares no `patchKeys`, so the honest answer is escalate. The static
    // half is still applied, and the progress the caller needs in order to re-seek is reported.
    const written = track.writeValues({ length: 100 }, { rotation: STOPS }, false);

    expect(written).toEqual({ patched: false, progress: 0.5 });
    expect(track.interpolated().length).toBe(100);
    // A static-only write is not a decline, because nothing was asked of the interpolator.
    expect(track.writeValues({ length: 70 }, undefined, false).patched).toBe(true);
  });

  it("PK-18 declares the port capability and no longer declares the animated reason", () => {
    const timeline = region(code(PORT_SOURCE), "export interface InterpolationTimeline {", "}");
    const declared = [...timeline.matchAll(/^ {2}(?:readonly )?([A-Za-z]\w*)/gm)].map(
      (match) => match[1],
    );

    // The inverse of the gate this replaces. `LV-12` asserted the member's absence, so the series
    // that owns whether the thing exists retires the case that pinned its absence.
    expect([...new Set(declared)].sort()).toEqual([
      "duration",
      "kill",
      "patchKeys",
      "progress",
      "state",
    ]);
    expect(timeline).toMatch(/patchKeys\?\(/);

    // The retired reason cannot come back as a silent branch.
    const refusal = region(code(TRACK_SOURCE), "export type LiveValueRefusal", ";");
    expect(refusal).toContain('"unknown" | "kind" | "prepared"');
    expect(refusal).not.toMatch(/"animated"/);
  });

  it("LV-14 kills the mutant that drops the overlay from `interpolated()`", () => {
    const track = createTrack();
    const before = track.compose().values;

    mask(track, { length: 100 });

    // A `#dirty` mutation is not evidence: `#memoized` compares the retained seed to the incoming
    // one, and a changed overlay is a changed seed whether or not a flag was set. What is
    // load-bearing is that the overlay is inside `interpolated()` at all, because that is the one
    // read the publisher's `MemberState` and every composition share.
    expect(track.interpolated()).not.toEqual(before);
    expect(track.compose().values).not.toEqual(before);
    expect(region(code(TRACK_SOURCE), "interpolated(): ImmutableRecord {", "compose(")).toContain(
      "this.#values",
    );
  });
});
