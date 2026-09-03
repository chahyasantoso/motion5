import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";

/**
 * Issue #223, part 6 of the re-review: what C3's declined build also owned.
 *
 * Issue #176 is the item part 6 names as tracked, and it is closed: PR #178 landed the staged
 * replacement, so the compile-after-commit ordering it was opened for has been fixed since August.
 * What is not closed is the widening the re-review flagged beside it. C3 made the timeline build
 * conditional, so a replacement has two shapes now, and the rollback path is correct in both: a
 * declined build stages nothing, so it has nothing to roll back, and the Motion republish reverts
 * exactly as it did before. That much is measured, and nothing is owed for it.
 *
 * What the build also owned is dropping a live value write, and nothing else did. A fresh `Track`
 * is built from a definition and carries no mask and no patched timeline, so before C3 every
 * structural edit dropped an override by construction. That is what `SESSION-STATUS.md` states as
 * a plain fact: a write is replaced wholesale, and every structural edit drops it because they
 * route through `#replaceTrack`. After C3 the four binding verbs are exactly the edits whose
 * compiled input provably did not move, so they decline the build, keep the old `Track`, and keep
 * its write, while the retained entry records no overlay at all.
 *
 * The authored record and the live composition then disagree with nobody having asked for it, and
 * an animated write is worse than a static one: the retained overlay is what tells a later
 * `overrideValues({})` that the animated path still has to run, so a cleared overlay over a
 * still-patched timeline is a freeze that cannot be reverted through the public surface at all.
 *
 * That is this project's own guardrail failing on the slice that earned it. C1 established that an
 * optimisation which removes a step is read for what that step also owned, and the step C3 removed
 * owned two things.
 *
 * So the resolve stays validation and is never skipped, and the build additionally runs when a live
 * write is in force. The order is the whole correctness of it and `RA-105` is why: a predicate that
 * short-circuited on the retained write before asking the resolve would skip the validation, which
 * is the exact defect C1 refused to ship.
 *
 * `RA-57` through `RA-61` own that a binding edit skips the build and that anything outside a
 * plugin's bindings does not, and `RA-59` is the oracle proving a skipped build publishes what a
 * fresh load publishes. None of that moves: every case here is about a node that carries a live
 * write, which no case in that file does.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";
/** The same authored bone C1 and C3 use, so this file adds counting rather than a new shape. */
const LEG_TRACK: TrackDefinition = {
  id: "leg",
  keyframes: {
    fk: { values: { length: 10 }, requires: { base: ARM, members: { left: HAND } } },
  },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
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
/** Declares the two slots the bone binds and no third, so `tip` is the registry's own refusal. */
const FK_PLUGIN: PluginDefinition = {
  name: "fk",
  keys: ["length"],
  requirements: { base: {}, members: { dict: true } },
  compose: () => ({}),
};

/** What each seam was asked, so a resolve can be told from a timeline build. */
interface Journal {
  readonly resolved: string[];
  readonly built: string[];
  readonly written: string[];
}
function journal(): Journal {
  return { resolved: [], built: [], written: [] };
}
/**
 * A runtime whose resolve seam is a real registry and whose staging seam refuses nothing.
 *
 * The same lie detector C3's rig is built on, for the same reason: a staging seam that refused
 * anything would make it impossible to tell a refusal that arrived from the resolve from one that
 * arrived from the build, and `RA-105` is a case about exactly that difference.
 *
 * The write seam answers `undefined`, which is a write that reached no compiled `Track`. That is
 * the conservative direction on purpose: whether a write is in force is recorded by the fact that
 * one was asked for rather than by what a backend answered, so a rig with no compiled Track behind
 * it pays one build it does not strictly need and no rig can under-report.
 */
function runtime(seams: Journal): ProjectRuntime {
  const registry = new PluginRegistry();
  registry.register(FK_PLUGIN);
  const options: ProjectRuntimeOptions = {
    clock: createManualClock(),
    compose,
    resolveKeyframes: (keyframes, path, track) => {
      seams.resolved.push(path);
      return registry.resolveForKeyframes(keyframes, path, track);
    },
    stageTrack: (_track, nodeId): StagedTrack => {
      seams.built.push(nodeId);
      return { commit: () => undefined, rollback: () => undefined };
    },
    writeValues: (nodeId) => {
      seams.written.push(nodeId);
      return undefined;
    },
  };
  return new ProjectRuntime(PROJECT, options);
}
/** Returns the thrown value, because the refusal case asserts on more than one facet of it. */
function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("a declined build still drops the live write the build used to drop", () => {
  it("RA-103 builds a binding edit on a node carrying a live write", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);

    handle.overrideValues({ length: 90 });
    expect(seams.written).toEqual([LEG]);
    expect(seams.built).toEqual([]);

    handle.setRequire("fk", "members", ARM, "right");

    // The build runs, so the live write is dropped exactly as it was before the predicate existed.
    // A binding edit still changes no compiled property, which is why this is not a retreat from
    // C3: the build is paid for what it also owned rather than for what the predicate measures.
    expect(seams.built).toEqual([LEG]);
    // And the edit still landed, so this is not green against a verb that refused instead.
    expect(handle.requires.filter(({ slot }) => slot === "members")).toEqual([
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
      { plugin: "fk", slot: "members", source: ARM, memberKey: "right" },
    ]);

    handle.setRequire("fk", "members", HAND, "third");

    // Once, not on every later edit. The write was dropped by the build above, so the node no
    // longer carries one and the next binding edit is back to C3's price. A fix that simply
    // always built would be green on the assertion above and red here.
    expect(seams.built).toEqual([LEG]);

    project.dispose();
  });

  it("RA-104 leaves a binding edit on a node with no live write unbuilt", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setRequire("fk", "members", ARM, "right");

    // C3, unmoved, and this is the control that stops the fix above from being "always build". It
    // is green before this slice and after it, which is what makes it the equivalence half
    // rather than a case that could fail.
    expect(seams.built).toEqual([]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    project.dispose();
  });

  it("RA-105 asks the resolve before it reads the retained write", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.overrideValues({ length: 90 });

    const thrown = thrownBy(() => handle.setRequire("fk", "tip", HAND));

    // The named mutation target of this slice, and the one C1 already paid for once. A predicate
    // written as `retained.liveWrite || needsBuild` short-circuits, so the resolve never runs, and
    // the resolve is the only place a registry sees an already-compiled node's candidate. This rig
    // has no other layer that could refuse: the staging seam accepts everything. So an undeclared
    // slot would reach a committed graph carrying a real edge into a consumer that does not exist.
    expect((thrown as Error).message).toContain("plugin-unknown-requirement");
    expect((thrown as Error).message).toContain(`${LEG}.keyframes.fk.requires.tip`);
    expect(seams.resolved.length).toBeGreaterThan(0);
    // A refused primitive mutates nothing, live write in force or not.
    expect(handle.definition).toBe(retained);
    expect(seams.built).toEqual([]);
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });
});
