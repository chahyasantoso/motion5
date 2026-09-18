import { PLUGIN_GOALS_SLOT } from "../contract/solver-slots";
import type { AuthoredPluginGroup, ObservationDefinition, TrackDefinition } from "../contract/v5";
import {
  readBoundGroup,
  readsAsProperty,
  removeGroup,
  removeRequire,
  setGroup,
  setRequire,
  type AuthoredKeyframes,
  type BoundGroup,
} from "../domain/authoring/keyframes";
import { unreachable } from "../domain/exhaustive";
import { observationEdgeKey } from "../graph/ir";
import { EMPTY_KEYFRAMES, withKeyframes } from "./authored-values";
import { propertyEntry, reservedGoalSlot, unboundGroup } from "./schema-refusals";
/**
 * Every authored edit a TrackHandle can ask for, as data, and the one function that applies one.
 *
 * Ten private members of `project-runtime.ts` were one operation written nine times. `#editRequire`
 * and `#editGroup` were two shared orderings, each a closure; `#setRequire`, `#removeRequire`,
 * `#setGoal`, `#removeGoal`, `#setKeyframeGroup` and `#removeKeyframeGroup` were six wrappers whose
 * whole body was naming one pure primitive inside one of those closures; `#writeKeyframes` was the
 * retained-record write both orderings ended at; and `#replaceWithObservation` was a ninth ordering
 * whose `add: boolean` decided which of two opposite edits it was performing.
 *
 * So which edit was asked becomes a value. This union names the eight, `applyEdit` is one total
 * switch over them answering the candidate definition, and the runtime keeps one member: the
 * writable resolver, this call, and a replacement. A ninth edit fails `typecheck` here rather than
 * falling into whichever arm was written last, and a boolean no longer stands for a discriminant.
 *
 * Unbranded, and deliberately so. This is `RefusalShape`'s role rather than `ValueState`'s: every
 * one of these is written as a fresh object literal at the one call site that asks, consumed on the
 * same statement and never retained, so the excess-property check reads every literal and a mint
 * would cost eight constructors to delete eight wrappers. `refusal.ts` draws the line the same way.
 *
 * Nothing here decides whether an edit is allowed to happen to a project. Liveness, admission,
 * commit ordering and publication stay with the runtime, and the registry and the candidate graph
 * still judge the whole candidate at derivation. What is this layer's own is only what no other
 * layer can see: whether the group an edit addresses exists on this node, whether the name it
 * addresses is authored as an ordinary property instead, and which verb owns the slot it names.
 *
 * Issue #443, phase A step 5. See ADR-045, ADR-057, ADR-062, ADR-063, ADR-064 and ADR-065.
 */
interface BindSlotShape {
  readonly kind: "bind-slot";
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  readonly memberKey: string | undefined;
}

interface UnbindSlotShape {
  readonly kind: "unbind-slot";
  readonly plugin: string;
  readonly slot: string;
  readonly memberKey: string | undefined;
}

interface BindGoalShape {
  readonly kind: "bind-goal";
  readonly plugin: string;
  readonly memberId: string;
  readonly source: string;
}

interface UnbindGoalShape {
  readonly kind: "unbind-goal";
  readonly plugin: string;
  readonly memberId: string;
}

interface SetGroupShape {
  readonly kind: "set-group";
  readonly plugin: string;
  readonly group: AuthoredPluginGroup;
}

interface RemoveGroupShape {
  readonly kind: "remove-group";
  readonly plugin: string;
}

interface AddObserveShape {
  readonly kind: "add-observe";
  readonly observation: ObservationDefinition;
}

interface RemoveObserveShape {
  readonly kind: "remove-observe";
  readonly observation: ObservationDefinition;
}

/**
 * One authored edit, at the three levels this tier has and no fourth.
 *
 * A binding edit moves one slot of a group the record already holds, a goal edit moves one entry of
 * the reserved slot that holds a solver's goals, a group edit originates, replaces or drops a whole
 * entry, and an observation edit moves one edge. The goal pair is separate from the slot pair
 * rather than a flag on it, because a goal edit names no slot at all: which of the two may address
 * the reserved slot is the reservation, so two variants are what delete the check that
 * a shared variant would have to carry. See ADR-057 and ADR-063.
 */
export type AuthoringEdit =
  | BindSlotShape
  | UnbindSlotShape
  | BindGoalShape
  | UnbindGoalShape
  | SetGroupShape
  | RemoveGroupShape
  | AddObserveShape
  | RemoveObserveShape;

/** The node an edit is addressed at: its id, its Motion owner, and its retained definition. */
export interface EditTarget {
  readonly nodeId: string;
  readonly motionId: string | undefined;
  readonly track: TrackDefinition;
}

/** One authored record and the group inside it an edit was proved to be able to address. */
export interface GroupTarget {
  readonly keyframes: AuthoredKeyframes;
  readonly bound: BoundGroup;
}

/**
 * The owner an unowned track's edge identity is keyed under.
 *
 * A free track has no Motion and `observationEdgeKey` takes one, so this is what the runtime
 * spelled inline at both of its observation call sites. Named once here because it is part of edge
 * identity rather than of either edit, and a second spelling would make one edit and its inverse
 * compare unequal.
 */
const NO_MOTION_OWNER = "~";

/**
 * The group `plugin` authors on this node, or the refusal that it authors none.
 *
 * The shared precondition for editing a property or a binding inside an authored group, and the one
 * owner of it: `#setKeyframe` and `#removeKeyframe` ask it for the property level and the four
 * binding arms below ask it for theirs, so a second reader of the same question cannot disagree
 * about what a group is. It reads through `readBoundGroup` and duplicates no shape
 * logic of its own, and it refuses `keyframe-group-unbound` rather than creating anything, because
 * originating a group is `setKeyframeGroup`'s job: a group holding only half its data may be
 * transiently invalid, and one verb whose cost and refusal set depend on whether the group already
 * existed is the shape this project has declined three times. See ADR-062, ADR-063 and ADR-065.
 */
export function boundGroup(nodeId: string, track: TrackDefinition, plugin: string): GroupTarget {
  const keyframes = track.keyframes;
  const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
  if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);
  return { keyframes, bound };
}

/**
 * The group a slot edit may address, which is the group above plus the one slot it may not name.
 *
 * Both halves in one member, in this order, because the order is a contract: a plugin this node
 * authors no group for is refused for the group even when the slot it named is the reserved one, so
 * a caller is never told about a slot on a node that has no such group at all. Spelled at the two
 * arms that name a slot rather than at the four that reach `boundGroup`, so the reservation cannot
 * reach the two verbs that own the reserved slot. See ADR-057, ADR-063 and issue #309.
 */
function slotGroup(target: EditTarget, plugin: string, slot: string): GroupTarget {
  const resolved = boundGroup(target.nodeId, target.track, plugin);
  if (slot === PLUGIN_GOALS_SLOT) reservedGoalSlot(resolved.bound.plugin, slot);
  return resolved;
}

/**
 * The record a group edit works from, and the one name it may not address.
 *
 * An absent record reads as the one frozen empty one, which is what lets an originating edit run on
 * a track that authors nothing without a branch and lets a removal answer by identity on one. The
 * refusal is the entry-level twin of `keyframe-require-shape`: a plugin name and a keyframe name
 * share one namespace, both shapes are legal there, and writing a group over a property drops every
 * stop the author wrote. See ADR-063.
 */
function groupRecord(target: EditTarget, plugin: string): AuthoredKeyframes {
  const keyframes = target.track.keyframes ?? EMPTY_KEYFRAMES;
  if (readsAsProperty(keyframes, plugin)) propertyEntry(target.nodeId, plugin);
  return keyframes;
}

/**
 * The definition an authored record edit answers: the retained one when the record did not move.
 *
 * The no-op is answered by identity rather than by a second predicate, because the pure editors
 * state idempotence that way and a `===` cannot drift from what the editor actually did. Answering
 * the retained definition is what makes a redundant edit commit nothing at all, which is what lets
 * a recipe of nothing but no-ops end without a candidate build. See ADR-063 and `RA-66`.
 */
function candidate(
  track: TrackDefinition,
  keyframes: AuthoredKeyframes,
  next: AuthoredKeyframes,
): TrackDefinition {
  if (next === keyframes) return track;
  return withKeyframes(track, next);
}

/** The list an observation edit works from, as a copy, since both arms move one entry of it. */
function observationsOf(track: TrackDefinition): ObservationDefinition[] {
  return [...(track.observes ?? [])];
}

/**
 * Where `observation` already sits in this list, by edge identity rather than by object identity.
 *
 * `observationEdgeKey` is the one owner of what identifies an edge, asked against this node's own
 * Motion owner, so a caller that rebuilt the record it already had is answered as the edit it is.
 * See `RA-66` and ADR-047.
 */
function observedAt(
  target: EditTarget,
  observations: readonly ObservationDefinition[],
  observation: ObservationDefinition,
): number {
  const owner = target.motionId ?? NO_MOTION_OWNER;
  const key = observationEdgeKey(observation, target.nodeId, owner);
  return observations.findIndex(
    (existing) => observationEdgeKey(existing, target.nodeId, owner) === key,
  );
}

/** `track` with the observation list an edit produced, which is never the retained one. */
function withObserves(
  track: TrackDefinition,
  observes: readonly ObservationDefinition[],
): TrackDefinition {
  return Object.freeze({ ...track, observes });
}

/**
 * The candidate definition one authored edit produces, or the retained one when it changes nothing.
 *
 * One total switch, so a variant added later owes a decision here rather than inheriting the last
 * arm, and it ends at `domain/exhaustive` like every other closed-union read in this folder. Every
 * arm is the same three steps: prove the edit may address what it names, hand the pure editor the
 * record or the list, and answer what came back. No arm reaches a hook, a graph, a registry or a
 * token, which is why this is a function beside the runtime rather than nine members inside it.
 */
export function applyEdit(target: EditTarget, edit: AuthoringEdit): TrackDefinition {
  const track = target.track;
  switch (edit.kind) {
    case "bind-slot": {
      const { keyframes, bound } = slotGroup(target, edit.plugin, edit.slot);
      const next = setRequire(keyframes, bound, edit.slot, edit.source, edit.memberKey);
      return candidate(track, keyframes, next);
    }
    case "unbind-slot": {
      const { keyframes, bound } = slotGroup(target, edit.plugin, edit.slot);
      const next = removeRequire(keyframes, bound, edit.slot, edit.memberKey);
      return candidate(track, keyframes, next);
    }
    case "bind-goal": {
      const { keyframes, bound } = boundGroup(target.nodeId, track, edit.plugin);
      const next = setRequire(keyframes, bound, PLUGIN_GOALS_SLOT, edit.source, edit.memberId);
      return candidate(track, keyframes, next);
    }
    case "unbind-goal": {
      const { keyframes, bound } = boundGroup(target.nodeId, track, edit.plugin);
      const next = removeRequire(keyframes, bound, PLUGIN_GOALS_SLOT, edit.memberId);
      return candidate(track, keyframes, next);
    }
    case "set-group": {
      const keyframes = groupRecord(target, edit.plugin);
      return candidate(track, keyframes, setGroup(keyframes, edit.plugin, edit.group));
    }
    case "remove-group": {
      const keyframes = groupRecord(target, edit.plugin);
      return candidate(track, keyframes, removeGroup(keyframes, edit.plugin));
    }
    case "add-observe": {
      const observations = observationsOf(track);
      if (observedAt(target, observations, edit.observation) >= 0) return track;
      observations.push(edit.observation);
      return withObserves(track, observations);
    }
    case "remove-observe": {
      const observations = observationsOf(track);
      const at = observedAt(target, observations, edit.observation);
      if (at < 0) return track;
      observations.splice(at, 1);
      return withObserves(track, observations);
    }
    default:
      return unreachable(edit);
  }
}
