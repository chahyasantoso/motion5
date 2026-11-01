# ADR-063: a whole plugin group is one edit, and one solver goal has one verb

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

- Status: accepted
- Date: 2026-08-31
- Slice: C2 of [issue #223](https://github.com/chahyasantoso/motion5/issues/223), rest of structural tier
- Supersedes nothing. Closes two questions [ADR-062](./ADR-062-candidate-key-ownership.md) deferred to "where the two goal verbs are", corrects one shape C1 could leave behind.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Runtime group edits no longer need entry-shape refusal: schema refuses authored top-level properties as `keyframes-ungrouped-key`; `replace()` remains whole-definition operation for crossing authored shape.

## The question

C1 shipped one binding edit on plugin group node already authors, refused everything else by name: `keyframe-group-unbound` says node authors no group for that plugin, names `setKeyframeGroup` as primitive that would originate one. Primitive did not exist. Three questions arrived with it.

Whether originating group may share name with replacing one, given `setMotion` and `setTrack` both cut for single names over two operations. Where solver's goals slot reserved, which ADR-062 deferred rather than rejected. And whether authored edit may leave shape legal only because nothing refuses it.

## Decision

Four members on `TrackHandle`, all structural, all returning `void`.

- `setKeyframeGroup(plugin, group)` writes whole plugin binding, values and `requires` together, whether or not one was there.
- `removeKeyframeGroup(plugin)` drops group and every edge its `requires` derived, in one commit.
- `setGoal(plugin, memberId, source)` and `removeGoal(plugin, memberId)` edit one entry of solver's goals slot, addressed by member id it is authored under.

`setRequire` and `removeRequire` refuse that slot by name as `keyframe-goal-slot-reserved`.

## The upsert is honest here, and that is not a relaxation

`setKeyframeGroup` means both create and replace; rule that killed other two `set` verbs unchanged, not bent. `addTrack` assigns node id, mounts node; `replace` refuses definition whose id would move it. Two operations, two refusal sets → one name over them would have cost and refusal set depending on branch caller cannot see.

Group carries no id, no token, no mount. Originating one and replacing one are same edit, same price, same refusals; nothing about result depends on what was there before. `RA-49` says so by measuring both against one rebuild.

Wholesale, not merged, same reason. Merge reintroduces invisible context: group caller hands over is group node authors afterwards; bindings it no longer names gone with ones it never had.

Both sections travel together: plugin binding holding only half its data may be transiently invalid — whole reason this is separate primitive from `setRequire`, not branch inside it.

## Removal is not the inverse of `removeRequire`

`removeKeyframeGroup` takes values with bindings: what is removed is group, not section of it. Group whose values kept beside no bindings would be different authored thing from one caller asked to drop. One commit, however many edges that section named.

## The goals slot has one verb, and the reservation lives at the verb

`readPluginBindings` expands goals slot into one derived binding per authored member, so both spellings `setRequire` could reach it with are wrong in way this layer can see. Without member key it writes scalar there, loader refuses as `keyframes-targets-shape` → candidate record no author could have written. With one it writes right shape through wrong verb → one question two mechanisms, which project deletes rather than documents as discouraged.

Reservation scoped to slot, not plugin owning it: about what slot holds. Every other slot of same group stays reachable through `setRequire`. `RA-55` asserts all four spellings, then accepting direction in same rig: primitive refusing everything is green against refusal alone.

Also sits inside edit, not ahead of it. Question is about slot of group this node authors, so group must exist for question to be about anything: `setRequire` at that slot on node authoring no such group is `keyframe-group-unbound`, naming verb that would originate one.

Two goal verbs add no editor. They are C1's `setRequire` and `removeRequire` with slot fixed rather than named — whole of what they buy — so `PLUGIN_GOALS_SLOT` gains one reader, no second copy of dict rule.

## One rule at four levels: the thing that emptied is removed

Dict losing last entry loses slot. Section losing last slot removed, not left empty. Group naming no section loses its entry. Record holding nothing loses `keyframes` key.

Third level **correction to C1**, found by this slice, not planned. On group authoring no `values`, `withRequires` removing last binding produced `{ ik: {} }`. No reader reads that as group: `isKeyframeGroup` answers `false`, `readPluginBindings` derives nothing, `validateKeyframes` accepts it as empty property it looks like. Field accepted then ignored, authored by edit, not person. `removeGroup` now one owner of dropping entry, reached by pure layer itself; `#writeKeyframes` one owner of level above, shared by all six verbs in tier. `RA-54` pins group level, `RA-50` record level, `RA-52` refuses same shape when caller hands it over.

## What this slice does not decide

No registry question asked by any primitive here, none missing. Whether plugin exists, claims leaf of group's `values`, or declares bound slot all arrive from `PluginRegistry` at recompile commit already pays. ADR-062 unchanged, now exercised by four more verbs; `RA-56` shows what judges an edit instead: `setGoal` on solver already binding bare `target` slot builds candidate `resolveSolvers` refuses as `ik-goal-conflict`, transaction A1 unified rolls it back.

V3/V4 recompile predicate and `resolveKeyframes` seam **not here**. ADR-062 places predicate in "the first slice that needs the registry's answer as data rather than as a refusal, which is C2 at the earliest"; "at the earliest" doing work: optimisation with no behavioural change, wants own equivalence evidence on both sides, guardrail that cut B in two applies unchanged. Shipping it inside four new verbs puts one invariant and one refactor in one diff. It is C3.

## Three new rule ids

Each is primitive's own: no other layer sees question it answers.

- `keyframe-goal-slot-reserved`, on `setRequire` and `removeRequire` at goals slot. Names `setGoal`: refusal saying only no leaves caller guessing which verb wanted.
- `keyframe-entry-shape`, when node authors that name as ordinary property. Entry-level twin of `keyframe-require-shape`, for reason ADR-057 refused dict/scalar mismatch in both directions: plugin name and keyframe name share one namespace, both shapes legal there, nothing below this layer can tell writing group over property drops every stop author wrote, or removing one deletes property caller never named. Crossing entry's shape is `replace()`, where whole definition validated. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** `keyframe-entry-shape` deleted: node can no longer author plugin name as ordinary property — schema refuses every ungrouped entry as `keyframes-ungrouped-key` — so refusal unreachable. Two of three rule ids remain.
- `keyframe-group-shape`, when group handed over names no reserved section. Authoring nothing for plugin spelled by removing entry; `removeKeyframeGroup` verb for that.

## Public surface

Four members on exported `TrackHandle`, no new exports.

`AuthoredPluginGroup` deliberately not added to package entry, on precedent `index.ts` records for `AuthoredValues`: `public-export-surface` allow-listed, widening it decision of own, caller writes argument as object literal without naming type. `AuthoredProperty` exported already — only leaf caller has to spell.

## Alternatives considered

- **Merge group rather than replace it.** Rejected. Result would depend on what node authored before — invisible context making upsert dishonest — and no verb left for dropping binding while keeping values.
- **Let `setRequire` originate group when none exists.** Rejected in C1, again here. One name whose cost and refusal set depend on whether group already existed; binding written alone into fresh group is group holding half its data.
- **Refuse goals slot inside pure editor.** Rejected. Layer handed slot name with no opinion which verb named it; `setGoal` one of its callers. Reservation belongs where caller chose slot.
- **Ship recompile predicate with these four verbs.** Rejected. One invariant per slice; optimisation with no behavioural change needs own equivalence evidence.
- **Let `removeKeyframeGroup` leave emptied group behind.** Rejected. Husk correction above deletes; `RA-52` refuses it from caller for same reason.

## Consequences

- Originating plugin binding on loaded project costs one candidate build, one edge delta, one recompile, one flush — same as replacement, because it is one.
- Solver's goals editable one member at a time; two entries of one slot stay two edges.
- No authored record an edit produces carries section, slot or entry surviving only because nothing refuses it.
- Structural tier capability-complete; C3 optimisation slice, not new verb.

Refs ADR-031, ADR-035, ADR-041, ADR-044, ADR-045, ADR-049, ADR-051, ADR-052, ADR-057, ADR-058,
ADR-061, ADR-062. Evidence `RA-48` through `RA-56` in
`packages/core/test/unit/runtime/plugin-group-edit.test.ts`.
