import { describe, expect, it } from "vitest";
import { fileURLToPath } from "node:url";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { unreachable } from "../../../src/domain/exhaustive";
import type { LiveWrite } from "../../../src/runtime/results";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";
import { liveWrite, writtenProgress } from "../../../src/runtime/results";
import { callSites, code } from "../../helpers/source-region";

/**
 * Issue #443, phase A: the live-write seam's answer, decoded once by the module that owns it.
 *
 * `LiveValueWriter` answers `LiveWriteResult | undefined`, which is three outcomes wearing an
 * optional over a boolean, and the two members that read it disagreed about which half of that one
 * record is safe to look at. `#writeValues` asked `written !== undefined && !written.patched` and
 * read the progress only on the declining branch. `#recompileKeyframes` read `written?.progress` on
 * every branch and never asked about `patched` at all. `results.ts` has owned the decode since step
 * 2 and nothing called it, so the encoding had two readers and no owner.
 *
 * Reading one record whole widens two reads, and both are declared rather than discovered. A patched
 * answer's progress is now read where `#writeValues` skipped it, and `#recompileKeyframes` now reads
 * a `patched` it never read. Every writer in this repository answers both as ordinary data
 * properties, the production `Track.writeValues` included, so neither widening reaches a shipped
 * case: the first two cases below are hosts built to be reached by it, and both are red on the
 * shipped runtime.
 *
 * What does not move is the conservative marking ADR-066 and issue #313 put there. The decode is
 * inside the try that performs the escalation rather than beside the seam call, because the write
 * has already landed by the time the record describing it can refuse to be read, so a record that
 * throws on either half still leaves the state the seam left recorded on the way out.
 */
const ARM = "hero/arm";
const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const RESULTS_SOURCE = fileURLToPath(new URL("../../../src/runtime/results.ts", import.meta.url));
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
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [ARM_TRACK] }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
/** What each rig records, so a stage and a re-seek are read as order rather than as counts. */
interface Journal {
  readonly staged: string[];
  readonly progressed: (readonly [string, number])[];
}
/** One project over one seam, so each case differs in the answer that seam gives and nothing else. */
function rig(writeValues: ProjectRuntimeOptions["writeValues"]): {
  readonly runtime: ProjectRuntime;
  readonly journal: Journal;
} {
  const journal: Journal = { staged: [], progressed: [] };
  const runtime = new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose,
    writeValues,
    setProgress: (nodeId, progress) => {
      journal.progressed.push([nodeId, progress]);
    },
    stageTrack: (_track, nodeId): StagedTrack => {
      journal.staged.push(nodeId);
      return { commit: () => undefined, rollback: () => undefined };
    },
  });
  runtime.mount(ARM);
  return { runtime, journal };
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

describe("the live-write seam's three outcomes are decoded by one owner", () => {
  it("reads a patched answer's progress, and still records the write it refused to describe", () => {
    const overlays: (Readonly<Record<string, unknown>> | undefined)[] = [];
    const failure = new Error("progress refused");
    let refuseProgress = true;
    const { runtime, journal } = rig((_nodeId, _values, overlay) => {
      overlays.push(overlay);
      return {
        patch: { kind: "patched" },
        get progress(): number {
          if (refuseProgress) throw failure;
          return 0.5;
        },
      };
    });
    const arm = runtime.track(ARM);

    // Red on the shipped runtime, which succeeds here: a patched answer's progress was the one half
    // of one record this member never looked at, while the recompilation path read it on both live
    // outcomes. One decoder cannot hold both readings.
    expect(thrownBy(() => arm.overrideValues({ rotation: FASTER }))).toBe(failure);
    // The decode is inside the escalation's try, so the mark is unmoved and no stage was reached:
    // the seam had already applied the overlay before its own record refused to be read.
    expect(journal.staged).toEqual([]);
    refuseProgress = false;
    arm.overrideValues({});

    // Which is what keeps the override revertible. The second write reaches the writer as an empty
    // overlay rather than as no overlay at all, and that is the difference between clearing a
    // patched tween and leaving it standing for good.
    expect(overlays).toEqual([{ rotation: FASTER }, {}]);
    runtime.dispose();
  });

  it("reads the patched half on the recompilation path, which never asked for it before", () => {
    const failure = new Error("patched refused");
    let refusePatched = true;
    const { runtime, journal } = rig(() => ({
      get patch(): { kind: "patched" } {
        if (refusePatched) throw failure;
        return { kind: "patched" };
      },
      progress: 0.5,
    }));
    const arm = runtime.track(ARM);

    // A key the group does not author yet cannot be written as a live mask, so this is the
    // recompilation path. Red on the shipped runtime, which reads the progress and nothing else, so
    // a record whose patched half throws is one it never looks at.
    expect(thrownBy(() => arm.setKeyframe("fk", "twist", 5))).toBe(failure);
    // The refusal lands before the stage and before adoption, so the authored record is the one it
    // was, by identity.
    expect(journal.staged).toEqual([]);
    expect(arm.definition).toBe(ARM_TRACK);

    refusePatched = false;
    arm.setKeyframe("fk", "twist", 5);

    expect(arm.definition).not.toBe(ARM_TRACK);
    expect(journal.staged).toEqual([ARM]);
    // Both live outcomes carry the playhead, which is why the patched variant carries one at all:
    // this path rebuilds either way, and the fresh Track resumes where the seam said the node was.
    expect(journal.progressed).toEqual([[ARM, 0.5]]);
    runtime.dispose();
  });

  it("keeps all three outcomes doing exactly what the hand-decoded pair did", () => {
    // The equivalence half, green on both sides. A patched timeline owes no staged replacement and
    // no re-seek, and never did.
    const patched = rig(() => ({ patch: { kind: "patched" }, progress: 0.5 }));
    patched.runtime.track(ARM).overrideValues({ rotation: FASTER });
    expect(patched.journal.staged).toEqual([]);
    expect(patched.journal.progressed).toEqual([]);
    patched.runtime.dispose();

    // A decline owes both, at the playhead the seam reported and before the stage it pays for.
    const declined = rig(() => ({ patch: { kind: "recompile" }, progress: 0.25 }));
    declined.runtime.track(ARM).overrideValues({ rotation: FASTER });
    expect(declined.journal.staged).toEqual([ARM]);
    expect(declined.journal.progressed).toEqual([[ARM, 0.25]]);
    declined.runtime.dispose();

    // No hook at all was never a fourth outcome, only an absent one.
    const absent = rig(undefined);
    absent.runtime.track(ARM).overrideValues({ rotation: FASTER });
    expect(absent.journal.staged).toEqual([]);
    expect(absent.journal.progressed).toEqual([]);
    absent.runtime.dispose();
  });

  it("refuses a foreign port patch kind instead of treating it as a rebuild", () => {
    const foreign = {
      patch: { kind: "foreign" },
      progress: 0.25,
    } as unknown as Parameters<typeof liveWrite>[0];
    expect(() => liveWrite(foreign)).toThrow(TypeError);
    expect(() => liveWrite(foreign)).toThrow(/Unhandled variant/);
  });

  it("requires a reader to decide every live-write variant", () => {
    type Widened = LiveWrite | { readonly kind: "foreign"; readonly progress: number };
    const readWidened = (write: Widened): number => {
      switch (write.kind) {
        case "no-hook":
          return 0;
        case "patched":
        case "needs-rebuild":
          return write.progress;
        default:
          // @ts-expect-error a widened kind is not decided by this reader.
          return unreachable(write);
      }
    };

    expect(typeof readWidened).toBe("function");
  });

  it("answers both questions about every outcome, and mints each one frozen", () => {
    const noHook = liveWrite(undefined);
    const patched = liveWrite({ patch: { kind: "patched" }, progress: 0.5 });
    const declined = liveWrite({ patch: { kind: "recompile" }, progress: 0.25 });

    // An absent answer is one value rather than one per call, because it carries nothing to differ
    // in, which is the rule `stale()` in this module already follows.
    expect(liveWrite(undefined)).toBe(noHook);
    expect(writtenProgress(noHook)).toBeUndefined();
    expect(writtenProgress(patched)).toBe(0.5);
    expect(writtenProgress(declined)).toBe(0.25);
    // Two readers rather than one flag, because no hook and a patched timeline are the same answer
    // to the first question and different answers to the second.
    expect(Object.isFrozen(noHook)).toBe(true);
    expect(Object.isFrozen(patched)).toBe(true);
    expect(Object.isFrozen(declined)).toBe(true);
  });

  it("leaves the encoding with one decoder", () => {
    // Counts over source text, so they fail for a legal change as well as for the one they are
    // about, and they cannot see a reader asking the same question through another spelling. The
    // behavioural half is the four cases above; this is the cheap backstop beside them, in the
    // shape `SH-7` already uses and addressed through the pinned parser rather than by a regex.
    const runtime = code(RUNTIME_SOURCE);
    expect(callSites(runtime, "liveWrite")).toHaveLength(2);
    expect(runtime).toContain("switch (written.kind)");
    expect(runtime).toContain('case "needs-rebuild":');
    expect(callSites(runtime, "writtenProgress")).toHaveLength(2);
    // The patch decision that optional wraps is read by the decoder and by nothing else. Phase 7b
    // retired the boolean this pair used to name, so the subject is the union that replaced it: the
    // decoder asks the seam's discriminant once, and `.patch` subsumes `.patched`, so the runtime
    // naming either spelling still fails here.
    expect(runtime.split(".patch")).toHaveLength(1);
    expect(code(RESULTS_SOURCE).split("result.patch.kind")).toHaveLength(2);
  });
});
