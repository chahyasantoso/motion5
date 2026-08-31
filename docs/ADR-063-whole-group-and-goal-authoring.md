# ADR-063: a whole plugin group is one edit, and one solver goal has one verb

- Status: accepted
- Date: 2026-08-31
- Slice: C2 of [issue #223](https://github.com/chahyasantoso/motion5/issues/223), the rest of the
  structural tier
- Supersedes nothing. Closes the two questions [ADR-062](./ADR-062-candidate-key-ownership.md)
  deferred to "where the two goal verbs are", and corrects one shape C1 could leave behind.

## The question

C1 shipped one binding edit on a plugin group a node already authors, and refused everything else by
name: `keyframe-group-unbound` says this node authors no group for that plugin, and it names
`setKeyframeGroup` as the primitive that would originate one. That primitive did not exist. Three
questions arrived with it.

Whether originating a group may share a name with replacing one, given that `setMotion` and
`setTrack` were both cut for being single names over two operations. Where a solver's goals slot is
reserved, which ADR-062 deferred rather than rejected. And whether an authored edit may leave behind
a shape that is legal only because nothing refuses it.

## Decision

Four members on `TrackHandle`, all structural, all returning `void`.

- `setKeyframeGroup(plugin, group)` writes a whole plugin binding, values and `requires` together,
  whether or not one was there.
- `removeKeyframeGroup(plugin)` drops the group and every edge its `requires` derived, in one commit.
- `setGoal(plugin, memberId, source)` and `removeGoal(plugin, memberId)` edit one entry of a solver's
  goals slot, addressed by the member id it is authored under.

`setRequire` and `removeRequire` refuse that slot by name as `keyframe-goal-slot-reserved`.

## The upsert is honest here, and that is not a relaxation

`setKeyframeGroup` means both create and replace, and the rule that killed the other two `set` verbs
is unchanged rather than bent. `addTrack` assigns a node id and mounts the node; `replace` refuses a
definition whose id would move it. Those are two operations with two refusal sets, so one name over
them would have had a cost and a refusal set depending on a branch the caller cannot see.

A group carries no id, no token and no mount. Originating one and replacing one are the same edit, at
the same price, with the same refusals, and nothing about the result depends on what was there
before. `RA-49` says so by measuring both against one rebuild.

Wholesale rather than merged, for the same reason. A merge is what would reintroduce the invisible
context: the group the caller hands over is the group the node authors afterwards, and the bindings
it no longer names are gone with the ones it never had.

Both sections travel together because a plugin binding holding only half its data may be transiently
invalid, which is the whole reason this is a separate primitive from `setRequire` rather than a
branch inside it.

## Removal is not the inverse of `removeRequire`

`removeKeyframeGroup` takes the values with the bindings, because what is removed is the group rather
than a section of it. A group whose values were kept beside no bindings would be a different authored
thing from the one the caller asked to drop. One commit, however many edges that section named.

## The goals slot has one verb, and the reservation lives at the verb

`readPluginBindings` expands the goals slot into one derived binding per authored member, so both
spellings `setRequire` could reach it with are wrong in a way this layer can see. Without a member
key it writes a scalar there, which the loader refuses as `keyframes-targets-shape`, so the candidate
would be a record no author could have written. With one it writes the right shape through the wrong
verb, and then one question has two mechanisms, which this project deletes rather than documents as
discouraged.

The reservation is scoped to the slot rather than to the plugin that owns it, because it is about
what the slot holds: every other slot of that same group stays reachable through `setRequire`.
`RA-55` asserts all four spellings and then asserts the accepting direction in the same rig, because
a primitive that refuses everything is green against the refusal alone.

It also sits inside the edit rather than ahead of it. The question is about a slot of a group this
node authors, so the group has to exist for the question to be about anything: a `setRequire` at that
slot on a node authoring no such group is `keyframe-group-unbound`, which names the verb that would
originate one.

The two goal verbs add no editor. They are C1's `setRequire` and `removeRequire` with the slot fixed
rather than named, which is the whole of what they buy, so `PLUGIN_GOALS_SLOT` gains one reader and
no second copy of the dict rule.

## One rule at four levels: the thing that emptied is removed

A dict that loses its last entry loses its slot. A section that loses its last slot is removed rather
than left empty. A group that names no section at all loses its entry. A record that holds nothing
loses the `keyframes` key.

The third level is a **correction to C1**, found by this slice rather than planned. On a group that
authors no `values`, `withRequires` removing the last binding produced `{ ik: {} }`. No reader reads
that as a group: `isKeyframeGroup` answers `false`, `readPluginBindings` derives nothing from it, and
`validateKeyframes` accepts it as the empty property it looks like. That is a field accepted and then
ignored, authored by an edit rather than by a person. `removeGroup` is now the one owner of dropping
an entry, reached by the pure layer itself, and `#writeKeyframes` is the one owner of the level above
it, shared by all six verbs in this tier. `RA-54` pins the group level, `RA-50` pins the record
level, and `RA-52` refuses the same shape when a caller hands it over.

## What this slice does not decide

No registry question is asked by any primitive here, and none is missing. Whether the plugin exists,
claims a leaf of the group's `values`, or declares a bound slot all arrive from `PluginRegistry` at
the recompile the commit already pays. ADR-062 is unchanged and now exercised by four more verbs, and
`RA-56` is the case that shows what judges an edit instead: `setGoal` on a solver already binding the
bare `target` slot builds a candidate `resolveSolvers` refuses as `ik-goal-conflict`, and the
transaction A1 unified rolls it back.

The V3/V4 recompile predicate and the `resolveKeyframes` seam are **not here**. ADR-062 places the
predicate in "the first slice that needs the registry's answer as data rather than as a refusal,
which is C2 at the earliest", and "at the earliest" is doing work: it is an optimisation with no
behavioural change, it wants its own equivalence evidence on both sides of itself, and the guardrail
that cut B in two applies unchanged. Shipping it inside four new verbs would put one invariant and
one refactor in one diff. It is C3.

## Three new rule ids

Each is the primitive's own, because no other layer can see the question it answers.

- `keyframe-goal-slot-reserved`, on `setRequire` and `removeRequire` at the goals slot. It names
  `setGoal`, because a refusal that only says no leaves the caller guessing which verb it wanted.
- `keyframe-entry-shape`, when the node authors that name as an ordinary property. The entry-level
  twin of `keyframe-require-shape`, for the reason ADR-057 refused a dict/scalar mismatch in both
  directions: a plugin name and a keyframe name share one namespace, both shapes are legal there, and
  nothing below this layer can tell that writing a group over a property drops every stop the author
  wrote, or that removing one deletes a property the caller never named. Crossing an entry's shape is
  a `replace()`, where a whole definition is validated.
- `keyframe-group-shape`, when the group handed over names no reserved section. Authoring nothing for
  a plugin is spelled by removing the entry, and `removeKeyframeGroup` is the verb for that.

## Public surface

Four members on the exported `TrackHandle` interface, and no new exports.

`AuthoredPluginGroup` is deliberately not added to the package entry, on the precedent `index.ts`
already records for `AuthoredValues`: `public-export-surface` is allow-listed, widening it is a
decision of its own, and a caller writes the argument as an object literal without naming the type.
`AuthoredProperty` is exported already, which is the only leaf a caller has to spell.

## Alternatives considered

- **Merge the group rather than replace it.** Rejected. The result would depend on what the node
  authored before, which is the invisible context that makes an upsert dishonest, and there would be
  no verb left for dropping a binding while keeping the values.
- **Let `setRequire` originate a group when none exists.** Rejected in C1 and rejected again here. It
  is one name whose cost and refusal set depend on whether the group already existed, and a binding
  written alone into a fresh group is a group holding half its data.
- **Refuse the goals slot inside the pure editor.** Rejected. That layer is handed a slot name with
  no opinion about which verb named it, and `setGoal` is one of its callers. The reservation belongs
  where a caller chose a slot.
- **Ship the recompile predicate with these four verbs.** Rejected. One invariant per slice, and an
  optimisation with no behavioural change needs equivalence evidence of its own.
- **Let `removeKeyframeGroup` leave an emptied group behind.** Rejected. It is the husk the
  correction above deletes, and `RA-52` refuses it from a caller for the same reason.

## Consequences

- Originating a plugin binding on a loaded project costs one candidate build, one edge delta, one
  recompile and one flush, which is what a replacement costs, because it is one.
- A solver's goals are editable one member at a time, and two entries of one slot stay two edges.
- No authored record an edit produces carries a section, slot or entry that survives only because
  nothing refuses it.
- The structural tier is capability-complete, so C3 is an optimisation slice rather than a new verb.

Refs ADR-031, ADR-035, ADR-041, ADR-044, ADR-045, ADR-049, ADR-051, ADR-052, ADR-057, ADR-058,
ADR-061, ADR-062. Evidence `RA-48` through `RA-56` in
`packages/core/test/unit/runtime/plugin-group-edit.test.ts`.
