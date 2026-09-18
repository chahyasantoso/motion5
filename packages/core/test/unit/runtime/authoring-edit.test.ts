import { describe, expect, it, vi } from "vitest";
import { fileURLToPath } from "node:url";
import { PLUGIN_GOALS_SLOT } from "../../../src/contract/solver-slots";
import type {
  AuthoredPluginGroup,
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { requireViews } from "../../../src/runtime/authored-values";
import {
  applyEdit,
  type AuthoringEdit,
  type EditTarget,
} from "../../../src/runtime/authoring-edit";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";
import { RefusalError } from "../../../src/runtime/refusal";
import { code, member } from "../../helpers/source-region";

/**
 * Issue #443, phase A step 5: the ten wrappers one authored edit went through, as one union.
 *
 * This slice claims equivalence, so it ships no red behaviour case and says so rather than padding
 * one. What pins the behaviour is `plugin-require-edit.test.ts`, `plugin-group-edit.test.ts`,
 * `keyframe-property-edit.test.ts` and `schema-transaction.test.ts`, all green unedited on both
 * sides. What those cannot see is the part this slice is about: that the three orderings and
 * the `add: boolean` are one total switch with one owner each for the group precondition, the
 * reserved slot and the no-op, and that the runtime reaches it rather than keeping a copy.
 *
 * So the four cases below are the half that can only be green afterwards: the arms answered by
 * identity, the precedence between the two refusals a slot edit can reach, the same union driven
 * through a real `ProjectRuntime` handle, and the spellings the runtime no longer holds.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";
const LEG = "hero/leg";
const RUNTIME_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-runtime.ts", import.meta.url),
);
const EDIT_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/authoring-edit.ts", import.meta.url),
);
const HANDLES_SOURCE = fileURLToPath(
  new URL("../../../src/runtime/project-handles.ts", import.meta.url),
);
const OBSERVATION: ObservationDefinition = { source: ARM };
/** One group authoring a leaf and one ordinary binding, so every binding arm has a target. */
const FK_GROUP: AuthoredPluginGroup = { values: { length: 10 }, requires: { base: ARM } };
/**
 * The retained definition every pure case edits, with a group and a name authored as a property.
 *
 * Never loaded: these cases drive the module, so it only has to be a record an author could write.
 */
const LEG_TRACK: TrackDefinition = { id: "leg", keyframes: { fk: FK_GROUP, x: 200 } };
const TARGET: EditTarget = { nodeId: LEG, motionId: "hero", track: LEG_TRACK };
/** The same shapes as a real document, with no binding at all, so no case depends on an edge. */
const LOADED_LEG: TrackDefinition = {
  id: "leg",
  keyframes: { fk: { values: { length: 10 } }, x: 200 },
};
const OBSERVE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [{ id: "arm" }, { id: "hand" }, LOADED_LEG],
    },
  ],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
/** The refused kind as the payload `refusal.ts` owns, rather than as a prefix inside prose. */
function refusalKind(operation: () => unknown): string {
  try {
    operation();
  } catch (error) {
    if (error instanceof RefusalError) return error.refusal.kind;
    throw error;
  }
  throw new Error("Expected the operation to refuse.");
}

describe("every authored edit is one value applied by one total switch", () => {
  it("answers the retained definition by identity for every edit that changes nothing", () => {
    // Idempotence is the pure editors' own, stated by identity, so the runtime's no-op check is a
    // `===` against what came back rather than a predicate beside it.
    const unchanged: readonly AuthoringEdit[] = [
      { kind: "bind-slot", plugin: "fk", slot: "base", source: ARM, memberKey: undefined },
      { kind: "unbind-slot", plugin: "fk", slot: "spine", memberKey: undefined },
      { kind: "unbind-goal", plugin: "fk", memberId: "left" },
      { kind: "set-group", plugin: "fk", group: FK_GROUP },
      { kind: "remove-group", plugin: "ik" },
      { kind: "remove-observe", observation: OBSERVATION },
    ];
    for (const edit of unchanged) expect(applyEdit(TARGET, edit), edit.kind).toBe(LEG_TRACK);

    // The accepting direction in the same rig, so none of the above is green against an `applyEdit`
    // that answers the retained definition for everything it is handed.
    const rebound = applyEdit(TARGET, {
      kind: "bind-slot",
      plugin: "fk",
      slot: "base",
      source: HAND,
      memberKey: undefined,
    });
    expect(requireViews(rebound)).toEqual([{ plugin: "fk", slot: "base", source: HAND }]);
    expect(
      applyEdit(TARGET, { kind: "unbind-slot", plugin: "fk", slot: "base", memberKey: undefined }),
    ).not.toBe(LEG_TRACK);
    expect(applyEdit(TARGET, { kind: "remove-group", plugin: "fk" }).keyframes).toEqual({ x: 200 });
    expect(applyEdit(TARGET, { kind: "add-observe", observation: OBSERVATION }).observes).toEqual([
      OBSERVATION,
    ]);
  });

  it("orders the two refusals a slot edit can reach, and reserves the slot by verb", () => {
    // A plugin this node authors no group for is refused for the group even when the slot named is
    // the reserved one, so a caller is never told about a slot on a node that has no such group.
    expect(
      refusalKind(() =>
        applyEdit(TARGET, {
          kind: "bind-slot",
          plugin: "ik",
          slot: PLUGIN_GOALS_SLOT,
          source: ARM,
          memberKey: undefined,
        }),
      ),
    ).toBe("unbound-group");
    expect(
      refusalKind(() =>
        applyEdit(TARGET, {
          kind: "bind-slot",
          plugin: "fk",
          slot: PLUGIN_GOALS_SLOT,
          source: ARM,
          memberKey: "left",
        }),
      ),
    ).toBe("reserved-goal-slot");
    expect(
      refusalKind(() =>
        applyEdit(TARGET, {
          kind: "unbind-slot",
          plugin: "fk",
          slot: PLUGIN_GOALS_SLOT,
          memberKey: "left",
        }),
      ),
    ).toBe("reserved-goal-slot");

    // The same slot through the two verbs that own it, in the same rig, so the reservation is which
    // verb may name it rather than a refusal of the slot itself.
    const bound = applyEdit(TARGET, {
      kind: "bind-goal",
      plugin: "fk",
      memberId: "left",
      source: HAND,
    });
    expect(requireViews(bound)).toContainEqual({
      plugin: "fk",
      slot: PLUGIN_GOALS_SLOT,
      source: HAND,
      memberKey: "left",
    });
    const goalTarget: EditTarget = { ...TARGET, track: bound };
    expect(applyEdit(goalTarget, { kind: "unbind-goal", plugin: "fk", memberId: "left" })).not.toBe(
      bound,
    );

    // A name authored as an ordinary property is refused by both group arms, and folds into absence
    // for a binding arm, because `readBoundGroup` reads a property as no binding surface at all.
    expect(
      refusalKind(() => applyEdit(TARGET, { kind: "set-group", plugin: "x", group: FK_GROUP })),
    ).toBe("property-entry");
    expect(refusalKind(() => applyEdit(TARGET, { kind: "remove-group", plugin: "x" }))).toBe(
      "property-entry",
    );
    expect(
      refusalKind(() =>
        applyEdit(TARGET, {
          kind: "bind-slot",
          plugin: "x",
          slot: "base",
          source: ARM,
          memberKey: undefined,
        }),
      ),
    ).toBe("unbound-group");
  });

  it("is reached from the handle rather than adopted at the edge", () => {
    const runtime = new ProjectRuntime(OBSERVE_PROJECT, { clock: createManualClock(), compose });
    const replaceGraph = vi.spyOn(runtime.graph, "replaceGraph");
    const hand = runtime.track(HAND);
    const leg = runtime.track(LEG);

    hand.addObserve(OBSERVATION);
    expect(hand.definition.observes).toEqual([OBSERVATION]);
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    // Both no-op directions still commit nothing, which is what lets a recipe of nothing but no-ops
    // end without a candidate build. `RA-66` owns that claim; this is the same claim through the
    // union, so the wiring cannot answer it from a copy the runtime kept.
    hand.addObserve(OBSERVATION);
    hand.removeObserve({ source: LEG });
    expect(replaceGraph).toHaveBeenCalledTimes(1);

    // The three refusals a handle reaches, each still refused before anything is staged.
    expect(refusalKind(() => leg.setRequire("fk", PLUGIN_GOALS_SLOT, ARM))).toBe(
      "reserved-goal-slot",
    );
    expect(refusalKind(() => leg.setKeyframeGroup("x", FK_GROUP))).toBe("property-entry");
    expect(refusalKind(() => hand.setRequire("fk", "base", ARM))).toBe("unbound-group");
    expect(replaceGraph).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });

  it("leaves the ten wrappers and the shared reservation with no spelling in the runtime", () => {
    // A count over source text, so it fails for a legal change as well as for the one it is about,
    // in the shape `SH-7` already uses. The behavioural half is the three cases above.
    const runtime = code(RUNTIME_SOURCE);
    const retired = [
      "#replaceWithObservation(",
      "#editRequire(",
      "#setRequire(",
      "#removeRequire(",
      "#setGoal(",
      "#removeGoal(",
      "#editGroup(",
      "#setKeyframeGroup(",
      "#removeKeyframeGroup(",
      "#writeKeyframes(",
      "#boundGroup(",
    ];
    for (const spelling of retired) expect(runtime.split(spelling), spelling).toHaveLength(1);

    // The scan found what it is scanning, and what it scans moved. The eight verbs a handle projects
    // are declared in `project-handles.ts` since step 8, so this count follows them rather than
    // staying green over a spelling it no longer measures: one declaration and the one host member
    // that reaches it here, and the eight mints and their single delegate there. Eight call sites
    // fewer in the runtime is the deletion that slice made, not a weakening of this claim.
    expect(runtime.split("#authorEdit(")).toHaveLength(3);
    const handles = code(HANDLES_SOURCE);
    expect(handles.split("this.#author(")).toHaveLength(9);
    expect(handles.split("#author(edit: AuthoringEdit)")).toHaveLength(2);
    // One owner for the reserved slot, and it is not this file any more.
    expect(runtime.split("reservedGoalSlot(")).toHaveLength(1);
    expect(code(EDIT_SOURCE).split("reservedGoalSlot(")).toHaveLength(2);
    // Eight arms and one sink, so a ninth edit owes a decision rather than inheriting the last arm.
    expect(code(EDIT_SOURCE).split('case "')).toHaveLength(9);
    const authored = member(runtime, "#authorEdit(", "  ");
    expect(authored).toContain("applyEdit(");
    expect(authored.split("boolean")).toHaveLength(1);
  });
});
