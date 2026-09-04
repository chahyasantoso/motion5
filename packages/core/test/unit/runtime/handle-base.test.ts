import { describe, expect, it } from "vitest";
import type {
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { readPluginBindings } from "../../../src/contract/keyframe-shape";
import { StaleHandleError } from "../../../src/contract/handle";
import { StaleMotionHandleError, type MotionHandle } from "../../../src/contract/motion-handle";
import { StaleTrackHandleError } from "../../../src/contract/track-handle";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Slice B1 of issue #223, on top of A1 through A3, 7a and 7c.
 *
 * One invariant: every handle this runtime issues has one shape and one failure family. `Handle<T>`
 * carries `id`, `live` and `definition`; `live` never throws, on either side of any invalidation and
 * on a disposed project, and every other member refuses with a named error under one abstract
 * `StaleHandleError`. `TrackHandle.track` becomes `definition` with no second spelling left behind,
 * which is the break this slice takes rather than aliases.
 *
 * B's tier 0 verbs, `setTrigger` and `setStagger`, are not implemented by this slice. They are a
 * live driver edit needing a seam of their own into the layer that owns the created trigger, and the
 * plan's own guardrail is that a change existing to unblock a later one still ships alone, so they
 * ship as B2. What they own behaviourally is `RA-33` through `RA-38` in `motion-driver-edit.test.ts`;
 * what this file owns about them is only that they refuse when the handle is stale, which is the
 * argument record below rather than a case of their own.
 *
 * Nothing B1 shipped mutates anything the runtime could not already mutate: the motion handle's
 * `destroy` reaches the same `destroyMotion` a caller reaches today, through the same commit path.
 *
 * The failing-first run named every one of these members through local seam interfaces and casts,
 * because a file naming `Handle`, `MotionHandle`, `tryTrack` or `requires` before the source exists
 * fails `typecheck` and stops `quality` before a single test runs, which is a broken file rather than
 * evidence. All of them are deleted here, by the commit that landed the source, so the shipped cases
 * name the types directly. `StaleSeam`, `ComposeSeam`, the `LV-` locals and 7a's `ReverseTopology`
 * are the precedent. See ADR-056.
 */
const MOTION = "hero";
const LEG = "hero/leg";
const ARM = "hero/arm";
const HAND = "hero/hand";
const EXTRA = "extra";
/**
 * The one track that authors bindings, and it authors both shapes of one.
 *
 * A scalar slot and a dict-valued slot together, because `requires` is a projection of what
 * `readPluginBindings` already answers and a projection that dropped `memberKey` would report two
 * entries of one slot as one pair with no way to tell them apart. See ADR-057.
 */
const LEG_TRACK: TrackDefinition = {
  id: "leg",
  keyframes: {
    fk: {
      values: { length: 10 },
      requires: { base: ARM, members: { left: HAND } },
    },
  },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: MOTION,
      trigger: { type: "manual" },
      tracks: [{ id: "arm" }, { id: "hand" }, LEG_TRACK],
    },
  ],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

/**
 * The arguments each refusing member of the motion handle needs, keyed by member name.
 *
 * The declared half of `RA-32`'s coverage check, exactly as `MEMBER_ARGUMENTS` is for `SH-1`. The
 * resolver refuses before it reads an argument, so the keys carry the claim and the values only have
 * to be well-typed.
 *
 * `setTrigger` and `setStagger` are declared here by B2's evidence commit, before the source that
 * adds them. That is this gate working rather than being weakened: the surface below is derived from
 * the handle's own keys, so a member declared here and missing from the handle fails the case, and a
 * member added to the handle with no entry here fails it too. `SH-1` went red exactly this way when
 * `MEMBER_ARGUMENTS` named `overrideValues` and `setValues` ahead of ADR-059's source.
 */
const MOTION_MEMBER_ARGUMENTS: Readonly<Record<string, readonly unknown[]>> = {
  definition: [],
  trackIds: [],
  addTrack: [{ id: "tail" } satisfies TrackDefinition],
  track: ["tail"],
  tryTrack: ["tail"],
  setTrigger: [{ type: "manual" } satisfies MotionDefinition["trigger"]],
  setStagger: [0.25],
  destroy: [],
};
/** The two members that answer on a stale handle rather than refusing. */
const NON_REFUSING = ["id", "live"] as const;
/**
 * The motion handle's writing members, which are the ones a disposed runtime outranks.
 *
 * A partition of `MOTION_MEMBER_ARGUMENTS` rather than a second list, for the reason `WRITERS` in
 * `stale-track-handle.test.ts` gives: `RA-111` asserts that this and the readers below cover that
 * record's keys exactly, so a member added later has to be classified rather than escaping the
 * invariant by omission. See ADR-056's amendment.
 */
const MOTION_WRITERS = ["addTrack", "setTrigger", "setStagger", "destroy"] as const;
/**
 * The members that refuse on a stale handle and keep refusing on a disposed one.
 *
 * `track` and `tryTrack` are here rather than above because they resolve a handle instead of writing
 * through one, which is the side of the line ADR-056's amendment leaves them on.
 */
const MOTION_READERS = ["definition", "trackIds", "track", "tryTrack"] as const;

function runtime(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
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
 * Reads a member through its own property descriptor, so a getter is touched as a read and a method
 * as a call. `typeof handle.definition` cannot be asked here: on a stale handle that read is itself
 * the refusal being measured.
 */
function touch(handle: MotionHandle, member: string): () => unknown {
  const descriptor = Object.getOwnPropertyDescriptor(handle, member);
  if (descriptor === undefined) throw new Error(`No handle member named "${member}".`);
  const read = descriptor.get;
  if (read !== undefined) return () => read.call(handle);
  const call = descriptor.value as (...rest: unknown[]) => unknown;
  const args = [...(MOTION_MEMBER_ARGUMENTS[member] ?? [])];
  return () => call.apply(handle, args);
}

describe("one handle base, one definition spelling, and one stale error family", () => {
  it("RA-27 answers `definition` on a track handle, and no `track` survives beside it", () => {
    const project = runtime();
    const handle = project.track(LEG);

    const keys = Object.keys(handle);
    expect(keys).toContain("definition");
    expect(keys).not.toContain("track");
    expect(handle.definition).toBe(LEG_TRACK);
    expect(handle.id).toBe(LEG);
    expect(handle.live).toBe(true);

    project.dispose();
  });

  it("RA-28 puts both refusals under one abstract base and moves neither message", () => {
    const base = Object.getPrototypeOf(StaleTrackHandleError) as { readonly name: string };
    expect(base.name).toBe("StaleHandleError");
    expect(Object.getPrototypeOf(base)).toBe(TypeError);
    expect(Object.getPrototypeOf(StaleMotionHandleError)).toBe(StaleHandleError);

    // The half that must not move. Inserting a base is a narrowing, so every existing catch on
    // `TypeError` and on this class keeps matching, and the message stays what the getter threw.
    const refusal = new StaleTrackHandleError(LEG);
    expect(refusal.message).toBe(`Track "${LEG}" is no longer live.`);
    expect(refusal.ruleId).toBe("stale-track-handle");
    expect(StaleTrackHandleError.ruleId).toBe("stale-track-handle");
    expect(refusal.name).toBe("StaleTrackHandleError");
    expect(refusal).toBeInstanceOf(TypeError);
    // The one name a caller reaches for when it does not care which handle went stale.
    expect(refusal).toBeInstanceOf(StaleHandleError);
    expect(new StaleMotionHandleError(EXTRA)).toBeInstanceOf(StaleHandleError);
  });

  it("RA-29 probes without throwing while the resolvers keep refusing by name", () => {
    const project = runtime();

    expect(project.tryTrack("hero/nope")).toBeUndefined();
    expect(project.tryMotion("villain")).toBeUndefined();
    expect(project.tryTrack(LEG)?.id).toBe(LEG);
    expect(project.tryMotion(MOTION)?.id).toBe(MOTION);

    // The probe and the resolver answer from one entry rather than from two lookups that could
    // disagree, which is the same relationship `live` already has to the refusing members.
    expect(project.tryTrack(LEG)?.definition).toBe(project.track(LEG).definition);

    expect(() => project.track("hero/nope")).toThrow('Unknown graph node "hero/nope".');
    expect(() => project.motion("villain")).toThrow('Unknown motion "villain".');

    project.dispose();
  });

  it("RA-30 keys a motion handle on its own token, and the id coming back does not revive it", () => {
    const project = runtime();

    project.addMotion({ id: EXTRA, trigger: { type: "manual" }, tracks: [] });
    const handle = project.motion(EXTRA);
    expect(handle.id).toBe(EXTRA);
    expect(handle.live).toBe(true);
    expect(handle.definition.trigger).toEqual({ type: "manual" });
    expect(handle.trackIds).toEqual([]);

    handle.destroy();
    expect(handle.live).toBe(false);

    const thrown = thrownBy(() => handle.definition);
    expect((thrown as StaleMotionHandleError).ruleId).toBe("stale-motion-handle");
    expect((thrown as Error).message).toBe(`Motion "${EXTRA}" is no longer live.`);
    expect((thrown as Error).name).toBe("StaleMotionHandleError");
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as StaleMotionHandleError).motionId).toBe(EXTRA);

    // Same guarantee `SH-4` pins for a track: the id returns under a fresh token and the handle that
    // captured the old one stays refused. Disposal is the other half of it, and `live` answers both
    // without throwing.
    project.addMotion({ id: EXTRA, trigger: { type: "manual" }, tracks: [] });
    expect(handle.live).toBe(false);
    const readded = project.motion(EXTRA);
    expect(readded.live).toBe(true);

    project.dispose();
    expect(readded.live).toBe(false);
  });

  it("RA-31 reports the bindings the one reader of the group shape derives, dict entries and all", () => {
    const project = runtime();
    const handle = project.track(LEG);
    expect(Object.keys(handle)).toContain("requires");

    expect(handle.requires).toEqual([
      { plugin: "fk", slot: "base", source: ARM },
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
    ]);

    // Not a shape any producer can make: it is the projection of `readPluginBindings`, which owns
    // reading the authored bindings, so a second derivation here would have to agree with it on
    // ordering and on the dict expansion as well as on the fields.
    const authored = readPluginBindings(LEG_TRACK.keyframes).map(
      ({ plugin, slot, source, memberKey }) => ({ plugin, slot, source, memberKey }),
    );
    expect(handle.requires.map((view) => ({ ...view }))).toEqual(authored);

    // The diagnostics path stays with the layer that cites it. A view carrying one would be a second
    // owner of where an author wrote something.
    const fields = [...new Set(handle.requires.flatMap((view) => Object.keys(view)).sort())];
    expect(fields).toEqual(["memberKey", "plugin", "slot", "source"]);

    // A track that authors no group answers with an empty list rather than with nothing, for the
    // reason 7a's reverse topology is total: a caller spelling `?? []` makes the shape depend on
    // the input.
    expect(project.track(ARM).requires).toEqual([]);

    project.dispose();
  });

  it("RA-32 refuses on every member of the motion handle, and answers `id` and `live`", () => {
    const project = runtime();

    project.addMotion({ id: EXTRA, trigger: { type: "manual" }, tracks: [] });
    const handle = project.motion(EXTRA);

    // Derived from the handle's own keys, never from the assertions below, so a member added later
    // with no entry in the argument record lands here first.
    const surface = Object.keys(handle).sort();
    const declared = [...NON_REFUSING, ...Object.keys(MOTION_MEMBER_ARGUMENTS)].sort();
    expect(surface).toEqual(declared);

    handle.destroy();

    // Collected rather than asserted one by one, so a red run names every member that escaped.
    // `tryTrack` refuses here as well: the probe answers about an id, and whether this handle is the
    // live one at all is a different question, answered before any id is read.
    const escaped = Object.keys(MOTION_MEMBER_ARGUMENTS).filter((member) => {
      try {
        touch(handle, member)();
        return true;
      } catch (error) {
        return !(error instanceof StaleMotionHandleError);
      }
    });
    expect(escaped).toEqual([]);
    expect(handle.id).toBe(EXTRA);
    expect(handle.live).toBe(false);

    project.dispose();
  });

  it("RA-111 reports the disposal rather than the staleness on every writing member", () => {
    const project = runtime();
    const handle = project.motion(MOTION);

    // Derived from the argument record rather than from the assertions below, so a member added to
    // the handle later fails here until it is classified as a writer or a reader.
    expect([...MOTION_WRITERS, ...MOTION_READERS].sort()).toEqual(
      Object.keys(MOTION_MEMBER_ARGUMENTS).sort(),
    );

    project.dispose();

    // Collected rather than asserted one by one, so a red run names every member that misreports.
    // All four do today: `dispose` empties the retained motions, so the token lookup misses and the
    // resolver answers staleness before anything asks whether the runtime is still there.
    const misreported = MOTION_WRITERS.filter((member) => {
      const thrown = thrownBy(touch(handle, member));
      return (
        thrown instanceof StaleMotionHandleError ||
        (thrown as Error).message !== "ProjectRuntime is disposed."
      );
    });
    expect(misreported).toEqual([]);

    // The read half is unchanged, stated rather than implied. `track` and `tryTrack` stay on this
    // side for the reason `RA-32` gives: whether this handle is the live one at all is asked before
    // any id is read, and resolving a handle is not writing through one.
    const escaped = MOTION_READERS.filter(
      (member) => !(thrownBy(touch(handle, member)) instanceof StaleMotionHandleError),
    );
    expect(escaped).toEqual([]);

    expect(handle.id).toBe(MOTION);
    expect(handle.live).toBe(false);
  });
});
