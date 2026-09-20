import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";
import { AUTHORED, buildOwed, isOverlaid, liveWritten } from "../../../src/runtime/value-state";
import { code } from "../../helpers/source-region";

/**
 * Issue #443, phase A step 4: the two fields one live write moved, as one closed union.
 *
 * `TrackEntry` carried an `overlay` record beside a `liveWrite` boolean, and only three of their
 * four combinations were reachable. The union states those three, so the fourth is unrepresentable
 * rather than merely unreached, and the emptiness test three members spelled for themselves has one
 * owner.
 *
 * Two of the cases below fail on the shipped runtime for a reason worth reading rather than
 * skipping. Recording the state on the way out of the fallible escalation, instead of insuring a
 * boolean with a second map write, is what makes a refused stage record the overlay the seam had
 * already applied. The shipped pair records the previous one, so an animated override whose
 * escalation was refused cannot be reverted through the public surface at all, which is the freeze
 * ADR-066 and issue #313 name and the one this slice removes.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";
const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const STATE_SOURCE = fileURLToPath(new URL("../../../src/runtime/value-state.ts", import.meta.url));
/** Twice the authored sweep, so an animated write here is a real one rather than a shape. */
const FASTER = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 180 },
]);
/** One group authoring a static key and an animated one, so both halves of a write are reachable. */
const ARM_TRACK: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: {
    fk: {
      values: {
        x: 200,
        rotation: [
          { p: 0, v: 0 },
          { p: 1, v: 90 },
        ],
      },
    },
  },
};
const MASK_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [ARM_TRACK] }],
};
/** The bone `declined-build-write-drop.test.ts` counts builds on, with the same two bindings. */
const LEG_TRACK: TrackDefinition = {
  id: "leg",
  keyframes: {
    fk: { values: { length: 10 }, requires: { base: ARM, members: { left: HAND } } },
  },
};
const BUILD_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "arm" }, { id: "hand" }, LEG_TRACK],
    },
  ],
};
/** Declares the two slots the bone binds, so a binding edit moves no compiled input. */
const FK_PLUGIN: PluginDefinition = {
  name: "fk",
  keys: ["length"],
  requirements: { base: {}, members: { dict: true } },
  compose: () => ({}),
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
/** Returns the thrown value, because each case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("the value state one live write leaves is a union rather than two fields", () => {
  it("mints one state per reachable combination and refuses the fourth by construction", () => {
    // Both spellings of no animated key are one state, which is what makes the classification one
    // owner rather than one emptiness test per caller.
    expect(liveWritten(undefined)).toBe(liveWritten({}));
    expect(buildOwed(AUTHORED)).toBe(false);
    expect(isOverlaid(AUTHORED)).toBe(false);
    expect(buildOwed(liveWritten({}))).toBe(true);
    expect(isOverlaid(liveWritten({}))).toBe(false);
    expect(buildOwed(liveWritten({ rotation: FASTER }))).toBe(true);
    expect(isOverlaid(liveWritten({ rotation: FASTER }))).toBe(true);
    // The fourth combination has no mint, and every state is frozen, so it cannot be assembled
    // after the fact either.
    expect(Object.isFrozen(AUTHORED)).toBe(true);
    expect(Object.isFrozen(liveWritten({ rotation: FASTER }))).toBe(true);
  });

  it("keeps an animated override revertible after its escalation was refused", () => {
    const overlays: (Readonly<Record<string, unknown>> | undefined)[] = [];
    const failure = new Error("stage refused");
    let refuseStage = true;
    const runtime = new ProjectRuntime(MASK_PROJECT, {
      clock: createManualClock(),
      compose,
      writeValues: (_nodeId, _values, overlay) => {
        overlays.push(overlay);
        return { patch: { kind: "recompile" }, progress: 0.5 };
      },
      stageTrack: (): StagedTrack => {
        if (refuseStage) throw failure;
        return { commit: () => undefined, rollback: () => undefined };
      },
    });
    runtime.mount(ARM);
    const arm = runtime.track(ARM);

    expect(thrownBy(() => arm.overrideValues({ rotation: FASTER }))).toBe(failure);
    refuseStage = false;
    arm.overrideValues({});

    // The revert reaches the writer as an empty overlay rather than as no overlay at all, which is
    // the difference between clearing a patched tween and leaving it standing for good. The shipped
    // entry keeps the overlay it had before the refused stage, so this second write asks for nothing
    // and the animated override becomes permanent.
    expect(overlays).toEqual([{ rotation: FASTER }, {}]);
    runtime.dispose();
  });

  it("records a write whose own answer refuses to be read", () => {
    const built: string[] = [];
    const failure = new Error("patched refused");
    const registry = new PluginRegistry();
    registry.register(FK_PLUGIN);
    let refuseAnswer = true;
    const options: ProjectRuntimeOptions = {
      clock: createManualClock(),
      compose,
      resolveKeyframes: registry.resolveForKeyframes.bind(registry),
      stageTrack: (_track, nodeId): StagedTrack => {
        built.push(nodeId);
        return { commit: () => undefined, rollback: () => undefined };
      },
      writeValues: () => ({
        get patch(): { kind: "patched" } {
          if (refuseAnswer) throw failure;
          return { kind: "patched" };
        },
        progress: 0.5,
      }),
    };
    const runtime = new ProjectRuntime(BUILD_PROJECT, options);
    const leg = runtime.track(LEG);

    expect(thrownBy(() => leg.overrideValues({ length: 90 }))).toBe(failure);
    refuseAnswer = false;
    leg.setRequire("fk", "base", HAND);

    // A binding edit moves no compiled input, so `RA-104` has it skip the build. It cannot skip this
    // one: the writer already applied a mask this rig has no inverse for, and the state saying so is
    // recorded on the way out even though the answer it was reading threw.
    expect(built).toEqual([LEG]);
    runtime.dispose();
  });

  it("leaves the emptiness test with one owner", () => {
    // A count over source text, so it fails for a legal change as well as for the one it is about,
    // and it cannot see a reader asking the same question through another spelling. The behavioural
    // half of the claim is the three cases above; this is the cheap backstop beside them, in the
    // shape `SH-7` already uses.
    expect(code(RUNTIME_SOURCE).split("Object.keys(")).toHaveLength(1);
    expect(code(STATE_SOURCE).split("Object.keys(")).toHaveLength(2);
  });
});
