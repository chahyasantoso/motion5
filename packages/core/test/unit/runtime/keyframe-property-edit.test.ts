import { describe, expect, it, vi } from "vitest";
import type { AuthoredStop, ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { PluginRegistry } from "../../../src/domain/plugins";
import { LiveValueKeyError } from "../../../src/domain/track";
import { Engine, type ProjectHandle } from "../../../src/engine";
import { transformPlugin } from "../../../src/plugins/transform";
import { createManualClock } from "../../../src/ports/clock";
import type { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";

/**
 * Slice E of issue #223, the value tier narrowed to one property, on top of C and D.
 *
 * One invariant: a single property inside a plugin group this node already authors is writable and
 * removable at the value tier's price, and the case that is not the value tier stays a different
 * verb. Nothing here rebuilds the graph, on any accepting path and on any refusing one, because a
 * leaf carries no edge: the plugin it belongs to is in the chain already, by the precondition
 * `keyframe-group-unbound` defends, so a leaf can neither add a composer nor move one.
 *
 * It is smaller than the plan claimed, and issue #231 is why. `Track` already refuses an unknown
 * key, a leaf-kind change and a prepared key per key, before anything mutates, so for a key the
 * group already authors `setKeyframe(plugin, key, value)` is `setValues({ [key]: value })` with the
 * group named, and a second ownership check here would be a second owner for a question that has
 * one. `keyframe-key-animated` does not exist and must not be added: #231 deleted `"animated"` from
 * that refusal union, because an interpolator with no per-key write escalates rather than refuses.
 * `RA-70` is the case that says so, through the declining backend.
 *
 * What the kind refusal is not is lifted. A key whose incoming leaf is a different kind from the
 * authored one stays refused here even though this verb rewrites the authored record and could
 * therefore have compiled the crossing: two authored shapes for one key is a whole-definition
 * question and `replace()` is where a whole definition is validated. `RA-74` owns that, and it is
 * the one decision this slice took that the plan left open.
 *
 * The one genuinely new capability is introducing a key the group does not author yet, which
 * `withAuthoredValues` cannot do by design: a key with no flattened entry is skipped rather than
 * invented. That leaf is definition-shaped input, so it is validated, resolved and compiled rather
 * than masked, and `RA-71` proves the compile with the only honest oracle for one: the same document
 * with the same leaf authored, loaded fresh. `RA-76` is the other half of it, and it is the reason
 * the resolve is not skippable here either.
 *
 * Driven through `Engine` rather than through a bare `ProjectRuntime`, for the reason
 * `live-value-updates.test.ts` gives: the claim is that the retained definition and the live
 * composition cannot disagree, and only the loaded composition owns the second half of that. The
 * interpolator is the fake, which declares no `patchKeys`, so this file also owns what an animated
 * property edit costs on a backend that declines.
 *
 * The failing-first run declared both verbs through a local `PropertyEdits` seam and casts, because
 * a file naming a member before the source exists fails `typecheck` and stops `quality` before a
 * single test runs. `SH-1`'s argument record named them in the same commit, one level up, which is
 * that gate working rather than being weakened. C1's `RequireEdits`, C2's `GroupEdits` and C3's
 * `ResolveSeam` are the precedent. The seam is deleted now that the source has landed, so every
 * case below binds to the shipped `TrackHandle` rather than to a local restatement of it: an
 * intersection of two declarations of one method is an overload set, so a drift between the two
 * would have been absorbed rather than reported. See ADR-056, ADR-060 and ADR-062.
 */
const ARM = "hero/arm";
const LEG = "hero/leg";
/** The authored sweep, so the published value at half progress is 45. */
const AUTHORED_ROTATION: readonly AuthoredStop[] = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 90 },
]);
/** Twice that sweep, so the published value at half progress moves from 45 to 90. */
const FASTER: readonly AuthoredStop[] = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 180 },
]);
/**
 * The bone under test: one static leaf and one animated leaf, and no `y`.
 *
 * `transform` claims exactly `x`, `y` and `rotation`, so leaving `y` unauthored is what makes a
 * genuinely new leaf reachable at all, and `length` is a name it claims under no spelling, which is
 * what `RA-76` needs. Both facts belong to the plugin rather than to this file.
 */
const ARM_TRACK: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: { transform: { values: { x: 200, rotation: AUTHORED_ROTATION } } },
};
/** The same document with the new leaf authored rather than added. `RA-71`'s oracle. */
const WITH_Y: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: { transform: { values: { x: 200, y: 300, rotation: AUTHORED_ROTATION } } },
};
/** The same document with the faster sweep authored rather than written. `RA-70`'s oracle. */
const WITH_FASTER: TrackDefinition = {
  id: "arm",
  duration: 400,
  keyframes: { transform: { values: { x: 200, rotation: FASTER } } },
};
/**
 * Authors one ordinary property and observes the bone.
 *
 * The property is deliberate: a plugin name and a keyframe name share one namespace, so `rotation`
 * here is a name this node authors that is not a group, which is one of the two spellings `RA-73`
 * refuses. The observation is what proves a property edit publishes to a dependent without the edge
 * being rebuilt.
 */
const LEG_TRACK: TrackDefinition = {
  id: "leg",
  keyframes: { rotation: 90 },
  observes: [{ source: ARM }],
};
function project(arm: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [arm, LEG_TRACK] }],
  };
}
function load(arm: TrackDefinition = ARM_TRACK): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project(arm));
  handle.mount(ARM);
  handle.mount(LEG);
  // Half progress, because every claim in this file is about a playhead that survives the edit. A
  // recompiled Track starts at zero, so a case run at zero would be green against a dropped
  // re-seek.
  handle.seek(ARM, 0.5);
  return handle;
}
/**
 * The `ProjectRuntime` behind a loaded handle, which `Engine` hangs off it as `_runtime`.
 *
 * Spied on rather than a hook, because "does not rebuild the graph" is a claim about the owner of
 * the graph and not about who called whom.
 */
function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as unknown as { _runtime: ProjectRuntime })._runtime;
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
 * `Object.keys` rather than a type, for the reason C2's `declaring` gives: the question is whether
 * the handle declares the member at all, and asking it as an assertion is what keeps a red run
 * reporting an absent verb rather than a `TypeError` from calling `undefined`. It stays after the
 * source lands, because the frozen handle is built by hand and a member deleted from it would
 * otherwise fail every case at once with no name attached.
 */
function declaring(handle: ProjectHandle, nodeId: string): TrackHandle {
  const track = handle.track(nodeId);
  const keys = Object.keys(track);
  expect(keys).toContain("setKeyframe");
  expect(keys).toContain("removeKeyframe");
  return track;
}
function values(handle: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = handle.get(id);
  expect(patch).toBeDefined();
  return patch?.values ?? {};
}
/** The authored group as retained, which is what `handle.definition` answers with. */
function retained(track: TrackHandle): unknown {
  return track.definition.keyframes?.transform;
}

describe("one authored property, inside a group this node already authors", () => {
  it("RA-69 writes a key the group authors as a live value, and never asks the graph", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    const batch = arm.setKeyframe("transform", "x", 260);

    // Case A is `setValues` with the group named and nothing else. The key is already in the compiled
    // record, so the write is a mask and the retained definition moves with it, which is what keeps
    // `definition` and the composition unable to disagree.
    expect(retained(arm)).toEqual({ values: { x: 260, rotation: AUTHORED_ROTATION } });
    expect(values(handle, ARM)).toEqual({ x: 260, rotation: 45 });
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(replaceGraph).not.toHaveBeenCalled();
    // The return type carries the tier: the value tier answers with the batch of its one invalidate,
    // where every structural verb answers `void` because it replaced the graph.
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith([ARM]);
    expect(batch).toBe(invalidate.mock.results[0]?.value);
    // The dependent is reached by the same flush, so a property edit publishes downstream without an
    // edge being rebuilt for it.
    expect(batch.patches.map((patch) => patch.nodeId)).toContain(LEG);

    handle.dispose();
  });

  it("RA-70 writes an animated key through the same verb, at the same progress", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    arm.setKeyframe("transform", "rotation", FASTER);

    // One API for both kinds, which is what #231 bought and what this verb inherits rather than
    // redecides. This interpolator declares no per-key write, so the write escalates to a recompile
    // and re-seek, and the values it publishes are the ones the patching backend publishes.
    expect(retained(arm)).toEqual({ values: { x: 200, rotation: FASTER } });
    expect(values(handle, ARM)).toEqual({ x: 200, rotation: 90 });
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);
    expect(replaceGraph).not.toHaveBeenCalled();

    // The oracle, because a call count cannot see a stale timeline: the same sweep authored rather
    // than written, loaded fresh, at the same progress.
    const authored = load(WITH_FASTER);
    expect(values(handle, ARM)).toEqual(values(authored, ARM));

    handle.dispose();
    authored.dispose();
  });

  it("RA-71 introduces a leaf the group does not author yet, and compiles it in place", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const before = values(handle, ARM);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    arm.setKeyframe("transform", "y", 300);

    // The one genuinely new capability in this slice. A mask cannot express it, because the key is
    // absent from the compiled record and `Track` refuses what it does not author, so the authored
    // record is edited and the node recompiled from it.
    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: AUTHORED_ROTATION } });
    // Still the value tier: a leaf carries no edge, and the plugin it belongs to is in the chain
    // already by the precondition `RA-73` defends, so nothing about topology moved.
    expect(replaceGraph).not.toHaveBeenCalled();
    // The playhead survives, which is this path's own mutation target: a freshly compiled Track sits
    // at zero, so a dropped re-seek publishes the whole node at the start of its own timeline.
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);

    // The only honest oracle for a compile: the same leaf authored rather than added, loaded fresh.
    // Not green against an edit that published nothing new either, which is the other half.
    const authored = load(WITH_Y);
    expect(values(handle, ARM)).toEqual(values(authored, ARM));
    expect(values(handle, ARM)).not.toEqual(before);

    handle.dispose();
    authored.dispose();
  });

  it("RA-72 removes a leaf, and leaves behind no shape nothing refuses", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");
    const retainedBefore = arm.definition;

    arm.removeKeyframe("transform", "y");

    // A key the group does not author is a no-op, on the idempotence rule every primitive in both
    // tiers follows: nothing is validated, nothing is recompiled, and the retained definition is the
    // same object afterwards.
    expect(arm.definition).toBe(retainedBefore);

    arm.removeKeyframe("transform", "x");

    expect(retained(arm)).toEqual({ values: { rotation: AUTHORED_ROTATION } });
    expect(values(handle, ARM)).toEqual({ rotation: 45 });
    expect(handle.get(ARM)?.sourceProgress).toBe(0.5);

    arm.removeKeyframe("transform", "rotation");

    // One rule at four levels, and the last removal walks all of them: the section that loses its
    // last leaf goes, the group that names no section goes, and the record that holds no key loses
    // the `keyframes` key entirely. An edit may not leave behind a shape that is legal only because
    // nothing refuses it. See ADR-063.
    expect(arm.definition.keyframes).toBeUndefined();
    expect("keyframes" in arm.definition).toBe(false);
    expect(values(handle, ARM)).toEqual({});
    expect(replaceGraph).not.toHaveBeenCalled();

    handle.dispose();
  });

  it("RA-73 refuses a plugin this node authors no group for, and originates nothing", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const before = arm.definition;
    const published = values(handle, ARM);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    const thrown = thrownBy(() => arm.setKeyframe("fk", "length", 5));

    // The precondition, and it stays exactly where C1 put it. Originating a binding surface is
    // `setKeyframeGroup`'s job, because a group holding only half its data may be transiently
    // invalid; letting this verb fall through to it is the named mutation target, and it is also what
    // buys the cheap tier, because a bound group's plugin is already in the chain.
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toContain("keyframe-group-unbound");
    expect((thrown as Error).message).toContain("setKeyframeGroup");
    const removal = thrownBy(() => arm.removeKeyframe("fk", "length"));
    expect((removal as Error).message).toContain("keyframe-group-unbound");

    // A name this node authors as an ordinary property is not a binding surface either, which is the
    // same answer `readBoundGroup` gives a binding verb: an authored property is not a group.
    const leg = declaring(handle, LEG);
    const flat = thrownBy(() => leg.setKeyframe("rotation", "x", 1));
    expect((flat as Error).message).toContain("keyframe-group-unbound");

    expect(arm.definition).toBe(before);
    expect(values(handle, ARM)).toEqual(published);
    expect(invalidate).not.toHaveBeenCalled();
    expect(replaceGraph).not.toHaveBeenCalled();

    // The accepting direction in the same rig, so this case is not green against a verb that refuses
    // everything.
    arm.setKeyframe("transform", "x", 260);

    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(retained(arm)).toEqual({ values: { x: 260, rotation: AUTHORED_ROTATION } });

    handle.dispose();
  });

  it("RA-74 keeps the kind refusal in force, in both directions", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const before = arm.definition;
    const published = values(handle, ARM);
    const invalidate = vi.spyOn(runtimeOf(handle).graph, "invalidate");

    const staticAtAnimated = thrownBy(() => arm.setKeyframe("transform", "rotation", 5));
    const stopsAtStatic = thrownBy(() => arm.setKeyframe("transform", "x", FASTER));

    // The decision this slice took that the plan left open. This verb rewrites the authored record,
    // so it could have compiled the crossing rather than refusing it, and it does not: which kind of
    // leaf a key is authored as is a whole-definition question, and `replace()` is where a whole
    // definition is validated. Both directions, because a refusal in one is not a rule.
    for (const thrown of [staticAtAnimated, stopsAtStatic]) {
      expect(thrown).toBeInstanceOf(LiveValueKeyError);
      expect((thrown as LiveValueKeyError).reason).toBe("kind");
      expect((thrown as LiveValueKeyError).ruleId).toBe("live-value-key");
    }
    // One owner, and it is `Track`. A second check here would be a second owner for a question that
    // has one, which is why the refusal a caller reads is the one #231 already ships.
    expect((staticAtAnimated as LiveValueKeyError).key).toBe("rotation");
    expect((stopsAtStatic as LiveValueKeyError).key).toBe("x");
    expect(arm.definition).toBe(before);
    expect(values(handle, ARM)).toEqual(published);
    expect(invalidate).not.toHaveBeenCalled();

    // No `keyframe-key-animated` beside it, and that union member is gone rather than declared: an
    // animated key is written through the same verb, which is the accepting direction here.
    arm.setKeyframe("transform", "rotation", FASTER);

    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(values(handle, ARM)).toEqual({ x: 200, rotation: 90 });

    handle.dispose();
  });

  it("RA-75 refuses both verbs by name inside a recipe, and commits nothing", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const before = arm.definition;
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    const written = thrownBy(() =>
      handle.edit((tx) => tx.track(ARM).setKeyframe("transform", "x", 260)),
    );
    const removed = thrownBy(() =>
      handle.edit((tx) => tx.track(ARM).removeKeyframe("transform", "x")),
    );

    // Tier 2 ends at its own invalidate, so it publishes inside the recipe and would survive an
    // abort. Deferring it into the settle steps was refused for the reason D records: a settle step
    // cannot refuse, so one condition would end up with two failure contracts. Named at the verb, so
    // the message tells a caller which call to move out.
    for (const thrown of [written, removed]) {
      expect(thrown).toBeInstanceOf(TypeError);
      expect((thrown as Error).message).toContain("schema-transaction-immediate");
    }
    expect((written as Error).message).toContain("setKeyframe");
    expect((removed as Error).message).toContain("removeKeyframe");
    expect(arm.definition).toBe(before);
    expect(replaceGraph).not.toHaveBeenCalled();

    // The same verb outside a recipe, in the same rig, so the refusal is about where it was called
    // rather than about the verb.
    arm.setKeyframe("transform", "x", 260);

    expect(retained(arm)).toEqual({ values: { x: 260, rotation: AUTHORED_ROTATION } });

    handle.dispose();
  });

  it("RA-76 lets the registry refuse a new leaf it claims nothing about", () => {
    const handle = load();
    const arm = declaring(handle, ARM);
    const before = arm.definition;
    const published = values(handle, ARM);
    const replaceGraph = vi.spyOn(runtimeOf(handle).graph, "replaceGraph");

    const thrown = thrownBy(() => arm.setKeyframe("transform", "length", 5));

    // No primitive authorizes its own edit. A leaf the named group does not claim is
    // `plugin-unknown-key`, answered by the one owner of key ownership over the candidate record,
    // which is why this slice needs no ownership check of its own and exports no `claims()`. It is
    // also why the resolve is not the skippable half of a recompile: refused here, the leaf would
    // otherwise reach a compiled Track that nothing claims and a document that no longer loads.
    // See ADR-062.
    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toContain("plugin-unknown-key");
    expect((thrown as Error).message).toContain("length");
    // Refused before anything moved, which is what the ordering buys: the candidate is validated and
    // resolved before the retained definition, the compiled Track or the playhead is touched.
    expect(arm.definition).toBe(before);
    expect(values(handle, ARM)).toEqual(published);
    expect(replaceGraph).not.toHaveBeenCalled();

    // The accepting direction in the same rig: a leaf the group does not author yet, that the plugin
    // does claim, lands.
    arm.setKeyframe("transform", "y", 300);

    expect(retained(arm)).toEqual({ values: { x: 200, y: 300, rotation: AUTHORED_ROTATION } });

    handle.dispose();
  });
});
