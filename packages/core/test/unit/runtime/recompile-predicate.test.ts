import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { fkPlugin } from "../../../src/plugins/fk";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import {
  ProjectRuntime,
  type ProjectRuntimeOptions,
  type StagedTrack,
} from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

/**
 * Slice C3 of issue #223, the recompile predicate, on top of C1 and C2.
 *
 * One invariant: a structural edit that provably cannot move what a compiled `Track` is built from
 * pays the resolve and not the timeline build, and publishes exactly what a fresh load publishes
 * either way.
 *
 * The predicate is not "skip `stageTrack`". ADR-062 settled that, and it is the whole reason this is
 * a separate slice rather than a line inside C1: a recompile is two things wearing one name, and the
 * resolve is the only place a `PluginRegistry` ever sees an already-compiled node's candidate,
 * because `compileTrack` reuses a live entry and returns early. So the resolve is validation and is
 * never skipped, and `compilePercentKeyframes` plus a fresh `Track` through the interpolator is the
 * expense that is. `RA-60` is the case that goes green if someone optimises the resolve away
 * instead, and the rig is built so that nothing else would catch it: the staging seam below refuses
 * nothing at all, so a candidate naming a slot no plugin declares reaches a committed graph unless
 * the resolve refused it first.
 *
 * `RA-61` is the case the plan's own wording would have failed. The predicate was named as
 * `ResolvedPlugins.plugins` alone, and a plugin list is one of the things a compiled `Track` is
 * built from rather than all of them: `replace()` and `addObserve` reach the same path with a
 * changed value, a changed duration or a changed observation and an untouched chain, so a
 * plugin-list comparison alone would skip a build those three require.
 *
 * Four cases are driven through a bare `ProjectRuntime` whose seams are journals, because what they
 * pin is how many times each seam was asked. `RA-59` is driven through a real `Engine` with the two
 * shipped plugins, because the only honest oracle for "the skip is not a stale composer" is the
 * document authored with the same binding and loaded fresh.
 *
 * The failing-first run declared the seam locally and cast, because a file naming an option before
 * the source exists fails `typecheck` and stops `quality` before a single test runs. That
 * declaration is deleted here, by the commit that landed the source, so the rig takes its parameter
 * types from the real option instead of restating them.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";
/**
 * The one track that authors a plugin group, with both binding shapes, exactly as `RA-39` writes it.
 *
 * Deliberately the same rig C1 used, so what this file adds is the counting rather than a second
 * authored shape to keep in agreement with the first.
 */
const LEG_TRACK: TrackDefinition = {
  id: "leg",
  keyframes: {
    fk: { values: { length: 10 }, requires: { base: ARM, members: { left: HAND } } },
  },
};
/** The same node with a longer bone: a changed value, an untouched chain. See `RA-61`. */
const LONGER_LEG: TrackDefinition = {
  id: "leg",
  keyframes: {
    fk: { values: { length: 20 }, requires: { base: ARM, members: { left: HAND } } },
  },
};
/** The same values and the same chain, with a duration the percent map compiles against. */
const TIMED_LEG: TrackDefinition = { ...LONGER_LEG, duration: 2 };
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
/**
 * The plugin `fk` names here, declaring exactly the two slots `LEG_TRACK` binds and no third.
 *
 * `tip` is declared nowhere, which is what `RA-60` measures, and `length` is claimed so the values
 * half of the group resolves clean and the only diagnostic a candidate can carry is the one about
 * the binding.
 */
const FK_PLUGIN: PluginDefinition = {
  name: "fk",
  keys: ["length"],
  requirements: { base: {}, members: { dict: true } },
  compose: () => ({}),
};
/**
 * A plugin that claims no key at all, so the only way it can enter a chain is through a binding.
 *
 * V4's mechanism as a rig rather than as an argument: a group may author nothing but bindings, so
 * originating one puts a composer in the chain that was not there before and dropping it takes one
 * out. That is the one thing in this tier the predicate must never call unchanged, and `RA-58` is
 * where both directions are counted.
 */
const SHADE_PLUGIN: PluginDefinition = {
  name: "shade",
  requirements: { source: {} },
  compose: () => ({}),
};

/** What each seam was asked, in call order, so a resolve can be told from a timeline build. */
interface Journal {
  readonly resolved: Readonly<Record<string, unknown>>[];
  readonly built: string[];
}
/**
 * A runtime whose resolve seam is a real `PluginRegistry` and whose staging seam refuses nothing.
 *
 * The staging seam is the lie detector. `engine.ts`'s own `stageTrackDefinition` would refuse a
 * candidate the registry rejects, so a rig that copied it could not tell a refusal that arrived from
 * the resolve from one that arrived from the build. This one builds nothing and refuses nothing, so
 * every refusal below is the resolve's, and a deleted resolve is a committed graph rather than a
 * greener test.
 */
function runtime(seams: Journal): ProjectRuntime {
  const registry = new PluginRegistry();
  registry.register(FK_PLUGIN);
  registry.register(SHADE_PLUGIN);
  const options: ProjectRuntimeOptions = {
    clock: createManualClock(),
    compose,
    resolveKeyframes: (keyframes, path, track) => {
      seams.resolved.push(keyframes);
      return registry.resolveForKeyframes(keyframes, path, track);
    },
    stageTrack: (_track, nodeId): StagedTrack => {
      seams.built.push(nodeId);
      return { commit: () => undefined, rollback: () => undefined };
    },
  };
  return new ProjectRuntime(PROJECT, options);
}
function journal(): Journal {
  return { resolved: [], built: [] };
}
/** The keys of the dict-valued `members` slot of one authored record the resolve seam was handed. */
function askedMembers(record: Readonly<Record<string, unknown>>): readonly string[] {
  const group = record.fk as { requires?: { members?: Record<string, string> } } | undefined;
  return Object.keys(group?.requires?.members ?? {});
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

const HIP = "rig/hip";
const SHIN = "rig/shin";
const HIP_TRACK: TrackDefinition = {
  id: "hip",
  keyframes: { transform: { values: { x: 100, y: 200, rotation: 0 } } },
};
/** The bone before the edit: `fk` is already in the chain through `length`, and nothing is bound. */
const UNBOUND_SHIN: TrackDefinition = {
  id: "shin",
  keyframes: { fk: { values: { length: 40 } } },
};
/** The same bone with the binding the edit adds, authored rather than edited in. */
const BOUND_SHIN: TrackDefinition = {
  id: "shin",
  keyframes: { fk: { values: { length: 40 }, requires: { base: "hip" } } },
};
/** The same binding with a longer bone, which is the direction the predicate must not skip. */
const LONGER_SHIN: TrackDefinition = {
  id: "shin",
  keyframes: { fk: { values: { length: 90 }, requires: { base: "hip" } } },
};
function rig(shin: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "rig", trigger: { type: "manual" }, tracks: [HIP_TRACK, shin] }],
  };
}
function load(shin: TrackDefinition): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(rig(shin));
  handle.mount(HIP);
  handle.mount(SHIN);
  handle.seek(HIP, 0);
  handle.seek(SHIN, 0);
  return handle;
}
function published(handle: ProjectHandle, nodeId: string): unknown {
  const patch = handle.get(nodeId);
  expect(patch?.status).toBe("ready");
  return patch?.values;
}

describe("a structural edit pays the resolve and only the build it can prove it needs", () => {
  it("RA-57 skips the timeline build when the compiled input cannot have moved", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setRequire("fk", "members", ARM, "right");

    // Zero, and that is the whole slice. A binding edit changes no compiled property, because the
    // flattened record the interpolator and the percent map receive carries the `values` section and
    // nothing else, and the plugin it names is already in the chain by precondition.
    expect(seams.built).toEqual([]);
    // The candidate resolved exactly once. It is the only record naming the new entry, so counting
    // it separately is what keeps this from being green against a predicate that resolves in a loop.
    const candidates = seams.resolved.filter((record) => askedMembers(record).includes("right"));
    expect(candidates).toHaveLength(1);
    // Two in total: the candidate, and the retained record the comparison is against. The retained
    // one is resolved beside the candidate rather than kept, because a kept chain is a cache whose
    // key is the registry's own contents.
    expect(seams.resolved).toHaveLength(2);
    // Still exactly one rebuild. An edge is added, so there is no fast lane for the graph, and this
    // slice never claimed one: what it declines to pay is a second, unrelated cost on the far side
    // of that boundary.
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    expect(handle.requires.filter(({ slot }) => slot === "members")).toEqual([
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
      { plugin: "fk", slot: "members", source: ARM, memberKey: "right" },
    ]);

    project.dispose();
  });

  it("RA-58 builds when a plugin joins the chain, and again when one leaves it", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);

    handle.setKeyframeGroup("shade", { requires: { source: ARM } });

    // V4, measured rather than argued: a group that authors nothing but bindings puts its plugin in
    // the chain, so the composer list moved and the compiled Track has to move with it.
    expect(seams.built).toEqual([LEG]);

    handle.removeKeyframeGroup("shade");

    // The other direction, which is the named mutation target: a predicate answering "unchanged" for
    // a plugin that left the chain would leave a composer running that nothing authors any more.
    expect(seams.built).toEqual([LEG, LEG]);

    project.dispose();
  });

  it("RA-59 publishes what a fresh load publishes, whichever way the predicate answered", () => {
    const edited = load(UNBOUND_SHIN);
    const unbound = published(edited, SHIN);

    edited.track(SHIN).setRequire("fk", "base", "hip");

    // The oracle, and the only honest one for a skipped build: the same document with the same
    // binding authored, loaded fresh. A stale plugin chain, a stale flattened record or a stale
    // prepared contribution all show up here as a disagreement, and none of them shows up in a call
    // count.
    const authored = load(BOUND_SHIN);
    expect(published(edited, SHIN)).toEqual(published(authored, SHIN));
    // Not green against a skip that published nothing new. An unbound `fk` composes from the origin
    // and a bound one from its parent's frame, so the edit has to move the published values.
    expect(published(edited, SHIN)).not.toEqual(unbound);

    edited.track(SHIN).replace(LONGER_SHIN);

    // The build direction through the same rig, so the case cannot be green against a predicate that
    // never skips or one that always does.
    const longer = load(LONGER_SHIN);
    expect(published(edited, SHIN)).toEqual(published(longer, SHIN));

    edited.dispose();
    authored.dispose();
    longer.dispose();
  });

  it("RA-60 keeps the registry's refusal on the path that skips the build", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    const thrown = thrownBy(() => handle.setRequire("fk", "tip", HAND));

    // The resolve is the validation. The rule id and the authored path are both the registry's own,
    // reached through the same call `compileTrack` makes with the same diagnostics path, and this rig
    // has no other layer that could have refused: the staging seam accepts everything.
    expect((thrown as Error).message).toContain("plugin-unknown-requirement");
    expect((thrown as Error).message).toContain(`${LEG}.keyframes.fk.requires.tip`);
    expect(seams.built).toEqual([]);
    expect(replaceGraph).not.toHaveBeenCalled();
    expect(handle.definition).toBe(retained);

    handle.setRequire("fk", "base", HAND);

    // The accepting direction in the same rig, because a predicate that refused everything would be
    // green against the refusal alone. A declared slot resolves clean, skips the build, and commits.
    expect(seams.built).toEqual([]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    expect(handle.requires.filter(({ slot }) => slot === "base")).toEqual([
      { plugin: "fk", slot: "base", source: HAND },
    ]);

    project.dispose();
  });

  it("RA-61 builds when anything outside a plugin's bindings moved", () => {
    const seams = journal();
    const project = runtime(seams);
    const handle = project.track(LEG);

    // Three crossings, one argument, and the one the plan's own wording would have missed. A plugin
    // list is one of the things a compiled Track is built from rather than all of them: an authored
    // value, the duration the percent map compiles against, and a derived observation all reach this
    // path with the chain standing still, and a plugin-list comparison alone would skip every one of
    // them.
    handle.replace(LONGER_LEG);
    handle.replace(TIMED_LEG);
    handle.addObserve({ source: ARM });

    expect(seams.built).toEqual([LEG, LEG, LEG]);
    expect(handle.definition.duration).toBe(2);
    expect(handle.definition.observes).toEqual([{ source: ARM }]);

    project.dispose();
  });
});
