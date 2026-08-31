import { describe, expect, it, vi } from "vitest";
import type {
  AuthoredPluginGroup,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

/**
 * Slice C2 of issue #223, the rest of the structural tier, on top of C1.
 *
 * One invariant: a whole plugin group, and one entry of a solver's goals slot, are editable in place
 * on a loaded project, and each costs exactly what a replacement costs, because each is one. C1
 * refused to originate a group and named this slice in the refusal; these are the verbs that name is
 * for.
 *
 * The claim about price is the same one C1 made and it is asserted the same way: every committing
 * case here reaches `replaceGraph` exactly once, and every refused one reaches it not at all. There
 * is no fast lane missing, because originating a group derives every edge its `requires` section
 * names and removing one drops every edge it derived, which is the boundary the value tier is
 * forbidden to cross.
 *
 * `setKeyframeGroup` is an upsert, and it is the one honest `set` verb in this surface. That is not a
 * relaxation of the rule that killed `setMotion` and `setTrack`: those were single names over two
 * operations with two refusal sets, because `addTrack` assigns a node id and mounts while `replace`
 * refuses a definition whose id would move the node. A group carries no id, no token and no mount, so
 * originating one and replacing one are the same operation, at the same price, with the same
 * refusals, and `RA-49` is the case that says so by measuring both against one rebuild.
 *
 * What the two goal verbs buy is one owner for one slot. `RA-55` is the other half of that: a
 * `setRequire` addressed at the goals slot by name is refused, in both spellings and in both verbs,
 * because one of them writes a scalar the loader refuses and the other writes the right shape through
 * the wrong verb. See ADR-057 and ADR-063.
 *
 * Every case is driven through a bare `ProjectRuntime` with no `PluginRegistry`, for the reason C1's
 * file gives: what they pin is the authored record and the edges derived from it, both of which
 * belong to the layer that owns the retained definitions. Whether a plugin exists, claims a leaf of
 * the group's `values`, or declares a bound slot is `PluginRegistry.resolveForKeyframes`, reached at
 * the recompile a commit already pays, and `RA-46` is where that seam is measured. No primitive here
 * asks permission for its own edit; `RA-56` is the case that shows what judges one instead.
 *
 * The failing-first run declared all four verbs through a local `GroupEdits` seam and cast, because a
 * file naming a member before the source exists fails `typecheck` and stops `quality` before a single
 * test runs. `SH-1`'s argument record named them in the same commit, one level up, which is that
 * gate working rather than being weakened. See ADR-056 and ADR-061.
 */
const MOTION = "hero";
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";
const RIG = "hero/rig";
const SPINE = "hero/spine";
/**
 * The group `LEG_TRACK` authors, held as its own frozen value.
 *
 * Named rather than inlined because `RA-53` hands this exact object back to `setKeyframeGroup`, and
 * identity is how the pure layer answers whether an edit changed anything. A caller that rebuilt the
 * record it already had is asking for the edit to run, which is the safe direction and the same
 * reading `sameTrigger` takes of an extension key holding an object.
 */
const FK_GROUP: AuthoredPluginGroup = Object.freeze({
  values: { length: 10 },
  requires: { base: ARM, members: { left: HAND } },
});
const LEG_TRACK: TrackDefinition = { id: "leg", keyframes: { fk: FK_GROUP } };
/** Authors one ordinary property, so a plugin name and a keyframe name collide on purpose. */
const HAND_TRACK: TrackDefinition = { id: "hand", keyframes: { rotation: 90 } };
/**
 * A group that authors nothing but goals, which is what makes two of these cases possible.
 *
 * It binds no `root` and no `solver`, so `resolveSolvers` classifies it as no solver at all and runs
 * none of the six IK rules over it. That is deliberate: what these cases are about is the authored
 * record and the edges one goal derives, and a rig that also had to be a valid chain would be pinning
 * `resolveSolvers` here instead. It is also the group whose last binding leaves nothing behind, which
 * `RA-54` measures.
 */
const RIG_TRACK: TrackDefinition = {
  id: "rig",
  keyframes: { ik: { requires: { targets: { wrist: HAND } } } },
};
/** Binds the bare goal slot, which is the degenerate spelling a goals dict conflicts with. */
const SPINE_TRACK: TrackDefinition = {
  id: "spine",
  keyframes: { ik: { requires: { target: ARM } } },
};
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: MOTION,
      trigger: { type: "manual" },
      tracks: [{ id: "arm" }, HAND_TRACK, LEG_TRACK, RIG_TRACK, SPINE_TRACK],
    },
  ],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
/**
 * The four verbs this slice adds, declared locally so the red run reports absent members rather than
 * failing to compile. Deleted by the commit that lands the source. C1's `RequireEdits`, B2's
 * `TierZeroEdits` and 7a's `ReverseTopology` are the precedent.
 */
interface GroupEdits {
  setKeyframeGroup(plugin: string, group: AuthoredPluginGroup): void;
  removeKeyframeGroup(plugin: string): void;
  setGoal(plugin: string, memberId: string, source: string): void;
  removeGoal(plugin: string, memberId: string): void;
}

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
 * All four verbs, asked for by name before any case calls one.
 *
 * `Object.keys` rather than a type, for the reason `RA-27` reads a spelling that way and C1's
 * `declaring` asked for the two binding verbs: the question is whether the handle declares the member
 * at all, and asking it as an assertion is what keeps a red run reporting an absent verb rather than
 * a `TypeError` from calling `undefined`. It stays after the source lands, because the frozen handle
 * is built by hand and a member deleted from it would otherwise fail every case at once with no name
 * attached.
 */
function declaring(project: ProjectRuntime, nodeId: string): TrackHandle & GroupEdits {
  const handle = project.track(nodeId);
  const keys = Object.keys(handle);
  expect(keys).toContain("setKeyframeGroup");
  expect(keys).toContain("removeKeyframeGroup");
  expect(keys).toContain("setGoal");
  expect(keys).toContain("removeGoal");
  return handle as TrackHandle & GroupEdits;
}
/** The authored entry a group verb writes, read back without a second opinion about its shape. */
function authoredEntry(handle: TrackHandle, plugin: string): unknown {
  return handle.definition.keyframes?.[plugin];
}

describe("a whole plugin group and one solver goal, at the price the structural tier costs", () => {
  it("RA-48 originates a group on a node that authored none, edges and values together", () => {
    const project = runtime();
    const handle = declaring(project, ARM);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setKeyframeGroup("fk", { values: { length: 5 }, requires: { base: HAND } });

    // Both sections in one commit, which is the whole reason this is a separate primitive from
    // `setRequire`: a plugin group holding only half its data may be transiently invalid, so the
    // values and the bindings arrive together or not at all.
    expect(authoredEntry(handle, "fk")).toEqual({
      values: { length: 5 },
      requires: { base: HAND },
    });
    expect(handle.requires).toEqual([{ plugin: "fk", slot: "base", source: HAND }]);
    // The edge the new binding derived is real, and it is derived by the same reader a loaded
    // document goes through rather than by anything this primitive knows.
    expect(project.dependantsOf(HAND)).toEqual([ARM, LEG, RIG]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    project.dispose();
  });

  it("RA-49 replaces a bound group wholesale, dropping the bindings it no longer names", () => {
    const project = runtime();
    const handle = declaring(project, LEG);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setKeyframeGroup("fk", { values: { length: 20 }, requires: { base: HAND } });

    // Wholesale rather than merged, and that is what makes the upsert honest: the group the caller
    // hands over is the group the node authors afterwards, so originating and replacing are one
    // operation at one price with one refusal set. A merge would make the result depend on what was
    // there before, which is the invisible context this surface refuses to carry.
    expect(authoredEntry(handle, "fk")).toEqual({
      values: { length: 20 },
      requires: { base: HAND },
    });
    expect(handle.requires).toEqual([{ plugin: "fk", slot: "base", source: HAND }]);
    expect(project.dependantsOf(ARM)).toEqual([SPINE]);
    expect(project.dependantsOf(HAND)).toEqual([LEG, RIG]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    project.dispose();
  });

  it("RA-50 removes a group and every edge it derived in one commit, leaving no empty record", () => {
    const project = runtime();
    const handle = declaring(project, LEG);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.removeKeyframeGroup("fk");

    // Two edges, one commit. This is not the inverse of `removeRequire`: the values go with the
    // bindings, because what is removed is the group rather than a section of it.
    expect(handle.requires).toEqual([]);
    expect(project.dependantsOf(ARM)).toEqual([SPINE]);
    expect(project.dependantsOf(HAND)).toEqual([RIG]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    // Absent rather than empty, on the rule the pure layer already follows one level down: omitting
    // `requires` is how a group binds nothing, so omitting `keyframes` is how a track authors
    // nothing, and an edit may not leave behind a shape that is legal only because nothing refuses
    // it.
    expect(handle.definition.keyframes).toBeUndefined();
    expect("keyframes" in handle.definition).toBe(false);

    project.dispose();
  });

  it("RA-51 refuses a name this node authors as a property, and originates nothing", () => {
    const project = runtime();
    const handle = declaring(project, HAND);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    const thrown = thrownBy(() => handle.setKeyframeGroup("rotation", { values: { length: 1 } }));

    // The entry-level twin of `keyframe-require-shape`, and the primitive's own for the same reason:
    // a plugin name and a keyframe name share one namespace, both shapes are legal there, and
    // nothing below this layer can tell that writing a group over an authored property drops every
    // stop the author wrote.
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toContain("keyframe-entry-shape");
    expect((thrown as Error).message).toContain("rotation");
    // Removal crosses the same shape in the other direction, so it refuses rather than deleting a
    // property the caller never named.
    const removal = thrownBy(() => handle.removeKeyframeGroup("rotation"));
    expect(removal).toBeInstanceOf(TypeError);
    expect((removal as Error).message).toContain("keyframe-entry-shape");
    expect(handle.definition).toBe(retained);
    expect(replaceGraph).not.toHaveBeenCalled();

    // The accepting direction, in the same rig, so this case is not green against a primitive that
    // refuses everything: a name the node authors nothing under originates cleanly beside the
    // property it did not touch.
    handle.setKeyframeGroup("fk", { values: { length: 3 } });

    expect(replaceGraph).toHaveBeenCalledTimes(1);
    expect(handle.definition.keyframes).toEqual({ rotation: 90, fk: { values: { length: 3 } } });

    project.dispose();
  });

  it("RA-52 refuses a group that names no reserved section rather than committing a husk", () => {
    const project = runtime();
    const handle = declaring(project, ARM);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    const thrown = thrownBy(() => handle.setKeyframeGroup("fk", {}));

    // `{}` names no section, so no reader reads it as a group at all: it is the accepted no-op
    // property it has always been. Committing one would author a husk under a plugin name that
    // `isKeyframeGroup` answers `false` for, which is a field accepted and then ignored.
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toContain("keyframe-group-shape");
    expect((thrown as Error).message).toContain("values");
    expect(handle.definition.keyframes).toBeUndefined();
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-53 commits nothing when a group edit changes nothing", () => {
    const project = runtime();
    const handle = declaring(project, LEG);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    // Idempotent in the `#replaceWithObservation` sense every primitive in this tier follows.
    // Load-bearing rather than tidy: either of these otherwise costs a full graph rebuild and a
    // recompiled Track for nothing the caller asked to change.
    handle.setKeyframeGroup("fk", FK_GROUP);
    handle.removeKeyframeGroup("ik");

    expect(handle.definition).toBe(retained);
    expect(replaceGraph).not.toHaveBeenCalled();

    // A node with no authored record at all answers the same way, rather than committing an empty
    // one on the way to removing nothing from it.
    const arm = declaring(project, ARM);
    arm.removeKeyframeGroup("fk");

    expect(arm.definition.keyframes).toBeUndefined();
    expect(replaceGraph).not.toHaveBeenCalled();

    project.dispose();
  });

  it("RA-54 addresses one goal by member id, and the last one leaves no husk behind", () => {
    const project = runtime();
    const handle = declaring(project, RIG);
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    handle.setGoal("ik", "elbow", ARM);

    // Two entries of one slot stay two edges, which is what `memberKey` bought and what a verb
    // addressing the slot as a whole would have collapsed.
    expect(authoredEntry(handle, "ik")).toEqual({
      requires: { targets: { elbow: ARM, wrist: HAND } },
    });
    expect(handle.requires).toEqual([
      { plugin: "ik", slot: "targets", source: ARM, memberKey: "elbow" },
      { plugin: "ik", slot: "targets", source: HAND, memberKey: "wrist" },
    ]);
    expect(project.dependantsOf(ARM)).toEqual([LEG, RIG, SPINE]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    // Both no-ops, on the same idempotence rule: a goal already reading that source, and a member
    // that carries none.
    handle.setGoal("ik", "wrist", HAND);
    handle.removeGoal("ik", "ankle");

    expect(replaceGraph).toHaveBeenCalledTimes(1);

    handle.removeGoal("ik", "elbow");
    handle.removeGoal("ik", "wrist");

    // The dict empties, so the slot goes; the section empties, so it goes; and the group named
    // nothing but that section, so the entry goes too and the record with it. Left in place it would
    // be an object naming no section under a plugin name, which is not a group to any reader and is
    // the husk `RA-52` refuses to accept from a caller.
    expect(handle.definition.keyframes).toBeUndefined();
    expect(handle.requires).toEqual([]);
    expect(project.dependantsOf(HAND)).toEqual([LEG]);
    expect(replaceGraph).toHaveBeenCalledTimes(3);

    project.dispose();
  });

  it("RA-55 reserves the goals slot by name in both binding verbs, and points at setGoal", () => {
    const project = runtime();
    const handle = declaring(project, RIG);
    const retained = handle.definition;
    const replaceGraph = vi.spyOn(project.graph, "replaceGraph");

    // Four spellings, one owner. Without a member key `setRequire` writes a scalar at this slot,
    // which `keyframes-targets-shape` refuses at load, so the candidate would be a record the loader
    // rejects; with one it writes the right shape through the wrong verb, and then one question has
    // two mechanisms. The weaker one is deleted rather than documented as discouraged.
    const reserved = [
      () => handle.setRequire("ik", "targets", ARM),
      () => handle.setRequire("ik", "targets", ARM, "elbow"),
      () => handle.removeRequire("ik", "targets"),
      () => handle.removeRequire("ik", "targets", "wrist"),
    ];
    for (const call of reserved) {
      const thrown = thrownBy(call);
      expect(thrown).toBeInstanceOf(TypeError);
      expect((thrown as Error).message).toContain("keyframe-goal-slot-reserved");
      // Names the verb that owns the slot, because a refusal that only says no leaves the caller to
      // guess which primitive it should have reached for.
      expect((thrown as Error).message).toContain("setGoal");
    }

    expect(handle.definition).toBe(retained);
    expect(replaceGraph).not.toHaveBeenCalled();

    // The accepting direction through the same verb, so the reservation is scoped to one slot rather
    // than to the plugin that happens to own it.
    handle.setRequire("ik", "chain", ARM);

    expect(replaceGraph).toHaveBeenCalledTimes(1);
    expect(handle.requires).toEqual([
      { plugin: "ik", slot: "chain", source: ARM },
      { plugin: "ik", slot: "targets", source: HAND, memberKey: "wrist" },
    ]);

    project.dispose();
  });

  it("RA-56 lets the graph refuse a candidate a goal edit produced, and rolls it back", () => {
    const project = runtime();
    const handle = declaring(project, SPINE);
    const retained = handle.definition;
    const nodes = project.graph.graph.nodes;

    const thrown = thrownBy(() => handle.setGoal("ik", "wrist", HAND));

    // No primitive asks permission for its own edit. Both goal spellings on one solver are two names
    // for one dependency, which is `resolveSolvers`' rule and nothing this layer holds an opinion
    // about, so the candidate is built and the owner that already judges a whole record refuses it,
    // with its own rule id, and the transaction A1 unified rolls the edit back.
    expect(thrown).toBeInstanceOf(Error);
    expect((thrown as Error).message).toContain("ik-goal-conflict");
    expect(handle.definition).toBe(retained);
    expect(project.graph.graph.nodes).toBe(nodes);
    expect(handle.requires).toEqual([{ plugin: "ik", slot: "target", source: ARM }]);
    expect(handle.live).toBe(true);

    project.dispose();
  });
});
