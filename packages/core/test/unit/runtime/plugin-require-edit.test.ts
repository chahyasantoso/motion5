import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type StagedTrack } from "../../../src/runtime/project-runtime";

/**
 * Slice C1 of issue #223, the first structural-tier primitive, on top of B1 and B2.
 *
 * One invariant: one edge on an already-bound plugin is editable without naming that plugin's other
 * slots or its values, and it costs exactly what a replacement costs, because it is one. This is the
 * opposite claim to B2's. Tier 0 asserted that `replaceGraph` is never reached; every case here
 * asserts it is reached exactly once, and that is the honest price rather than a missing
 * optimisation: a binding adds, removes or redirects a `GraphEdge`, and there is no cheaper path for
 * that category, which is the boundary `overrideValues` and `setValues` were forbidden to cross.
 *
 * What this slice is not is `setKeyframeGroup`. Originating a binding on a node whose keyframes
 * author no group at all is that primitive's job, and `RA-43` is the case that keeps the two from
 * collapsing into one name whose cost and refusal set depend on context invisible at the call site,
 * which is the shape this project has refused to build three times already: rest-pose-via-`rotation`,
 * the reserved `targets` string, and the `setTrack` upsert the two probes replaced.
 *
 * `RA-39` through `RA-45` are driven through a bare `ProjectRuntime` with no `PluginRegistry`,
 * because what they pin is the authored record and the edges derived from it, and both belong to the
 * layer that owns the retained definitions. Whether a plugin declares the slot at all is
 * `PluginRegistry.resolveForKeyframes`, reached at recompile, and a registry in those cases would
 * make them a second owner of that question. See ADR-044 and ADR-057.
 *
 * `RA-46` is the one case that wants one, for exactly that reason read the other way round: the
 * refusal for an undeclared slot has to arrive from the registry through the seam a commit already
 * reaches, and nowhere else. It is what makes the recompile this tier pays the validation rather
 * than an expense, so no primitive here asks permission for its own edit. See ADR-062.
 *
 * `setRequire` and `removeRequire` are declared through a local seam and cast, because a file naming
 * a member before the source exists fails `typecheck` and stops `quality` before a single test runs,
 * which is a broken file rather than evidence. `StaleSeam`, `ComposeSeam`, the `LV-` locals, 7a's
 * `ReverseTopology` and B2's `TierZeroEdits` are the precedent, and the declaration below is deleted
 * by the commit that lands the source.
 *
 * Staleness is deliberately not asserted here. `SH-1` derives the track handle's whole refusing
 * surface from the handle's own keys and holds it against one argument record, so both members are
 * covered there by being added to that record, and a copy of the stale contract in this file would be
 * a second owner of it. See ADR-056 and ADR-061.
 */
const MOTION = "hero";
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";
const GHOST = "hero/ghost";
/**
 * The one track that authors a plugin group, and it authors both binding shapes.
 *
 * A scalar slot and a dict-valued slot together, because an entry of a dict is addressed by the key
 * it was authored under rather than by a formatted slot name, and a projection or an edit that
 * dropped `memberKey` would read two entries of one slot as one binding with no way to tell them
 * apart. See ADR-057.
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
 * The plugin `fk` names, declaring exactly the two slots `LEG_TRACK` binds and no third.
 *
 * `base` takes one source, `members` takes a dict, and `tip` is declared nowhere, which is the whole
 * of what `RA-46` measures. `length` is claimed so the values half of the group resolves clean and
 * the only diagnostic a candidate can carry is the one about the binding.
 */
const FK_PLUGIN: PluginDefinition = {
  name: "fk",
  keys: ["length"],
  requirements: { base: {}, members: { dict: true } },
  compose: () => ({}),
};

/**
 * The two verbs this slice adds. Deleted by the commit that declares them on `TrackHandle`.
 *
 * The node id is the handle's identity rather than a parameter, which is the addressing rule ADR-056
 * collapsed a second refusal into and ADR-061 stated on the base. `memberKey` is optional because a
 * scalar slot has none, and it is a field rather than a spelling inside `slot` because that is what
 * ADR-057 decided when it deleted the goal-addressing grammar: the slot stays exactly as the author
 * wrote it, and the one thing distinguishing two entries of it is data.
 */
interface RequireEdits {
  setRequire(plugin: string, slot: string, source: string, memberKey?: string): void;
  removeRequire(plugin: string, slot: string, memberKey?: string): void;
}
type EditableTrack = TrackHandle & RequireEdits;

function runtime(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}
/** Every node id the staging seam accepted, in call order, so a refusal can be told from a commit. */
interface StageJournal {
  readonly staged: string[];
}
/**
 * A runtime whose staging seam resolves the candidate through a real `PluginRegistry`.
 *
 * The narrowest stand-in for `engine.ts`'s `stageTrackDefinition`, and it is a stand-in rather than
 * a second owner: the questions it asks are the registry's own, spelled through the same
 * `resolveForKeyframes` call with the same `${nodeId}.keyframes` diagnostics path that `compileTrack`
 * already uses, so what the case measures is where the answer comes from rather than what it says.
 *
 * The journal records only what the seam accepted. A refusal throws before pushing, which is what
 * lets `RA-46` assert that a refused candidate displaced no compiled Track rather than that it was
 * rolled back afterwards.
 */
function registryRuntime(journal: StageJournal): ProjectRuntime {
  const registry = new PluginRegistry();
  registry.register(FK_PLUGIN);
  return new ProjectRuntime(PROJECT, {
    clock: createManualClock(),
    compose,
    stageTrack: (track, nodeId): StagedTrack => {
      const resolved = registry.resolveForKeyframes(track.keyframes ?? {}, `${nodeId}.keyframes`, {
        id: nodeId,
        duration: track.duration,
      });
      const errors = resolved.diagnostics.filter(({ severity }) => severity === "error");
      if (errors.length > 0)
        throw new TypeError(
          errors.map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`).join(" "),
        );
      journal.staged.push(nodeId);
      return { commit: () => undefined, rollback: () => undefined };
    },
  });
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
 * Both verbs, asked for by name before any case calls one.
 *
 * `Object.keys` rather than a type, for the reason `RA-27` reads a spelling that way and `RA-33`
 * asked for tier 0's: the question is whether the handle declares the member at all, and asking it as
 * an assertion is what keeps a red run reporting an absent verb rather than a `TypeError` from
 * calling `undefined`.
 */
function declaring(project: ProjectRuntime, nodeId: string = LEG): EditableTrack {
  const handle = project.track(nodeId) as EditableTrack;
  const keys = Object.keys(handle);
  expect(keys).toContain("setRequire");
  expect(keys).toContain("removeRequire");
  return handle;
}
/** The authored bindings section of the one group `LEG_TRACK` writes. */
function authoredRequires(handle: TrackHandle): unknown {
  const group = handle.definition.keyframes?.fk as { requires?: unknown } | undefined;
  return group?.requires;
}
/** The authored values of that group, which no binding edit is allowed to touch. */
function authoredValues(handle: TrackHandle): unknown {
  const group = handle.definition.keyframes?.fk as { values?: unknown } | undefined;
  return group?.values;
}

describe("one edge on an already-bound plugin, at the price the structural tier costs", () => {
  it("RA-39 binds one new slot, rewrites only that section, and rebuilds once", () => {
    const project = runtime();
    const handle = declaring(project);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setRequire("fk", "tip", HAND);

    expect(authoredRequires(handle)).toEqual({
      base: ARM,
      members: { left: HAND },
      tip: HAND,
    });
    // The values half is what separates this from `setKeyframeGroup`: a binding edit names no
    // property, so the compiled value domain of the group is not allowed to move.
    expect(authoredValues(handle)).toEqual({ length: 10 });
    expect(handle.requires).toEqual([
      { plugin: "fk", slot: "base", source: ARM },
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
      { plugin: "fk", slot: "tip", source: HAND },
    ]);
    expect(project.dependantsOf(HAND)).toEqual([LEG]);
    // Exactly one, and that count is the whole tier claim. There is no fast lane for an edge, so a
    // rebuild is the honest price; two rebuilds would be a projection onto the wrong transaction.
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    project.dispose();
  });

  it("RA-40 redirects a bound slot rather than adding a second binding for it", () => {
    const project = runtime();
    const handle = declaring(project);

    handle.setRequire("fk", "base", HAND);

    // Redirected, so the old source keeps no dependant. An implementation that appended would leave
    // the node reading both, which no authored record can express and the slot cannot hold.
    expect(project.dependantsOf(ARM)).toEqual([]);
    expect(project.dependantsOf(HAND)).toEqual([LEG]);
    expect(handle.requires.filter(({ slot }) => slot === "base")).toEqual([
      { plugin: "fk", slot: "base", source: HAND },
    ]);

    project.dispose();
  });

  it("RA-41 removes the last slot without leaving an empty section behind", () => {
    const project = runtime();
    const handle = declaring(project);

    handle.removeRequire("fk", "members", "left");
    handle.removeRequire("fk", "base");

    // Absent rather than empty, and that is forced rather than tidy: omitting `requires` is already
    // the way to bind nothing, so `validateKeyframes` refuses an empty one as
    // `keyframes-requires-empty`, which would reject the very candidate this edit commits.
    expect(authoredRequires(handle)).toBeUndefined();
    expect("requires" in (handle.definition.keyframes?.fk as object)).toBe(false);
    expect(handle.requires).toEqual([]);
    expect(authoredValues(handle)).toEqual({ length: 10 });
    expect(project.dependantsOf(ARM)).toEqual([]);
    expect(project.dependantsOf(HAND)).toEqual([]);

    project.dispose();
  });

  it("RA-42 addresses one entry of a dict-valued slot by the key it was authored under", () => {
    const project = runtime();
    const handle = declaring(project);

    handle.setRequire("fk", "members", ARM, "right");

    // Two entries of one slot stay two edges, which is the whole of what `memberKey` bought.
    expect(authoredRequires(handle)).toEqual({
      base: ARM,
      members: { left: HAND, right: ARM },
    });
    expect(handle.requires.filter(({ slot }) => slot === "members")).toEqual([
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
      { plugin: "fk", slot: "members", source: ARM, memberKey: "right" },
    ]);

    handle.removeRequire("fk", "members", "left");

    // The slot stays a dict with one entry rather than collapsing to the scalar shape, because the
    // two are different authored things and only one of them is what the author wrote.
    expect(authoredRequires(handle)).toEqual({ base: ARM, members: { right: ARM } });
    expect(project.dependantsOf(HAND)).toEqual([]);

    project.dispose();
  });

  it("RA-43 refuses a plugin this node authors no group for, and originates nothing", () => {
    const project = runtime();
    const handle = declaring(project);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    const thrown = thrownBy(() => handle.setRequire("ik", "target", ARM));

    // The boundary that keeps the two primitives apart. Originating a binding is
    // `setKeyframeGroup`'s job, because a plugin group with only half its data may be transiently
    // invalid, and a `setRequire` that silently created one would be a single name whose cost and
    // refusal set depend on whether the group already existed.
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toContain("ik");
    expect(handle.definition).toBe(retained);
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-44 commits nothing when the edit changes nothing", () => {
    const project = runtime();
    const handle = declaring(project);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    // Idempotent in the `#replaceWithObservation` sense the plan asks of every primitive: binding a
    // slot to the source it already reads and removing one that is not bound are both no-ops on a
    // live handle. Load-bearing rather than tidy, because either one otherwise costs a full graph
    // rebuild and a recompiled Track for nothing the caller asked to change.
    handle.setRequire("fk", "base", ARM);
    handle.setRequire("fk", "members", HAND, "left");
    handle.removeRequire("fk", "tip");
    handle.removeRequire("fk", "members", "right");

    expect(handle.definition).toBe(retained);
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-45 leaves everything where it was when the candidate graph refuses", () => {
    const project = runtime();
    const handle = declaring(project);
    const retained = handle.definition;
    const nodes = project.graph.graph.nodes;

    const thrown = thrownBy(() => handle.setRequire("fk", "tip", GHOST));

    // The rollback the structural tier already owns, reached through this new call site rather than
    // copied beside it: the graph refuses a binding whose source resolves to no node, and the
    // retained definition is the one thing that must not have moved first.
    expect(thrown).toBeInstanceOf(Error);
    expect(handle.definition).toBe(retained);
    expect(project.graph.graph.nodes).toBe(nodes);
    expect(handle.requires).toEqual([
      { plugin: "fk", slot: "base", source: ARM },
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
    ]);
    expect(handle.live).toBe(true);

    project.dispose();
  });

  it("RA-46 lets the registry refuse a slot it never declared, at the seam a commit reaches", () => {
    const journal: StageJournal = { staged: [] };
    const project = registryRuntime(journal);
    const handle = declaring(project);
    const retained = handle.definition;
    const nodes = project.graph.graph.nodes;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    const thrown = thrownBy(() => handle.setRequire("fk", "tip", HAND));

    // No primitive asks permission for its own edit. It builds a candidate and the owners that
    // already judge a whole record judge this one, which is what makes a structural edit produce a
    // graph the loader would accept by construction rather than by a per-primitive check that can
    // disagree with it. The rule id and the authored path are both the registry's own.
    expect((thrown as Error).message).toContain("plugin-unknown-requirement");
    expect((thrown as Error).message).toContain(`${LEG}.keyframes.fk.requires.tip`);
    // Nothing staged rather than staged and rolled back, because the resolve is the first thing the
    // seam does: a refused candidate never displaced a compiled Track at all.
    expect(journal.staged).toEqual([]);
    expect(replaceGraph).not.toHaveBeenCalled();
    expect(handle.definition).toBe(retained);
    expect(project.graph.graph.nodes).toBe(nodes);

    // The other direction through the same seam, and it is what keeps this case from being green
    // against a primitive that refuses everything: a declared slot resolves clean, stages once, and
    // rebuilds once.
    handle.setRequire("fk", "members", ARM, "right");

    expect(journal.staged).toEqual([LEG]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    expect(handle.requires.filter(({ slot }) => slot === "members")).toEqual([
      { plugin: "fk", slot: "members", source: HAND, memberKey: "left" },
      { plugin: "fk", slot: "members", source: ARM, memberKey: "right" },
    ]);

    project.dispose();
  });
});
