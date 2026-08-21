# ADR-046: `ObservationDefinition.target` is removed, and an authored one is refused

**Status:** accepted  
**Date:** 2026-08-21  
**Closes:** issue [#175](https://github.com/chahyasantoso/motion5/issues/175), and the deferral recorded in the alternatives section of ADR-044

## Context

`target` was a field the runtime validated, carried in edge identity, and carried in edge ordering, and that no consumer ever read.

All four of those statements were true at once:

1. `resolveObservationEdge` validated it, and refused it on the output role as `observation-output-target`.
2. `edgeKey` encoded an absent target as `-` and an authored one as a length-prefixed field, so two input edges to one source separated only by a target name were two distinct edges.
3. `compareEdges` ordered by `targetOrder`, which exists only to separate an absent target from an authored empty one.
4. `ObservationState.normalizeEdge` copied it into live state, so live inspection carried it too.

And nothing composed with it. `GraphPublisher` builds a node's input bag from two things: `projection`, which renames the source's keys, and `edge.requirement`, which scopes a plugin-owned dependency by plugin and slot. There is no third branch. An author who wrote `target: "parentWorld"` got a valid project whose edge was distinct from one without the field, and whose composed values were byte-identical to it. Rule 6 of ADR-033 forbids exactly that: a field accepted and then ignored.

The name predates the two mechanisms that took its job. ADR-034 replaced `(source, role, target)` identity with an injective encoding over observer, source, role, and canonical projection; ADR-044 gave a plugin-owned dependency its own scope and made `requires` the way to express one. TR-D-05 of `docs/TRD.md` still describes an edge as `(source, role, target)` and still requires a non-empty target for an input edge, which was already false before this change; that requirement needs its own docs slice and is not edited here.

ADR-044 identified the field as dead surface and deferred it, because removing it is a second invariant with its own blast radius across identity, ordering, `ObservationState`, and a dozen fixtures, and that slice was already at the sizing ceiling.

## Decision

Remove the field, and refuse an authored one.

`ObservationDefinition.target` and `GraphEdge.target` are deleted. `targetOrder` is deleted. `edgeKey` and `compareEdges` lose their target field, and `ObservationState.normalizeEdge` stops copying one. An authored `target` is reported as `observation-target-unsupported`, which replaces `observation-output-target`.

Four things about that shape are deliberate.

**Refused, not merely undeclared.** Deleting the field from the type stops a TypeScript author from writing it and does nothing at all to a JavaScript author, who would get the field silently ignored: the accepted-and-ignored shape ADR-033 forbids, arrived at by deletion instead of by design. It would also be worse than ignored. A target used to split one edge into two, so a project that bound two targets to one source loaded before this change and would now fail with `observation-duplicate`, naming a duplicate edge the author never wrote and citing nothing that would explain it. The legacy `use` field is already refused rather than dropped, as `plugin-contribution-unsupported-entry`; this is the same rule applied to the same kind of removal.

**One rule for both roles.** `observation-output-target` was role-specific because an input target was once believed to name a destination key. Nothing read it on either role, so a refusal that fires on one role implies the field means something on the other. One rule id, both roles.

**The same owner, and no new one.** `resolveObservationEdge` in `graph/ir.ts` already owns every authored-observation shape rule: `observation-role`, `observation-source`, `observation-input-projection`. The target guard replaces one of that owner's guards in place. No new module, no registry, no injected collaborator: the guard needs one field of one authored object, so a seam here would be a dependency invented to look decoupled. The message is a module constant, so the string has one owner too.

**Two items on the issue's list had nothing to remove.** The incremental graph builder's cache key is `(owner, ownerId, trackId)` and never carried a target; its duplicate check calls `edgeKey`, so it inherits the change with no edit. `describeEdge` never carried a target either: its label has been `observer <- source (role)` since ADR-034, plus the requirement scope since ADR-044. Both are named here because "there was nothing there" is a finding, not an omission.

## Alternatives rejected

**Give the field a consumer instead of removing it,** by making an input target the key the upstream record lands under. That is a third answer to "where does an upstream value land", beside `projection`, which renames keys, and `requires`, which scopes them by plugin and slot. Two owners of that question is already the maximum the model tolerates, and each of the two exists because the other cannot do its job.

**Keep it in identity only,** as an author-facing way to declare two edges to one source. A distinguishing field no consumer can read is a way to author two edges with no observable difference between them. Where two dependencies on one source are genuinely meant, `requires` already expresses it and already separates the edges: `base` and `destination` bound to one node is `Q-10`.

**Delete the type member and ignore an authored value.** Covered above: silent, and specifically silent in the case that used to work.

## Consequences

`edgeKey` output changes format again. It is internal identity, never persisted, never part of a patch payload or a golden fixture, so there is no migration.

ADR-034's `E-6`, which pinned an authored empty target as a different edge from an absent one, is retired with the field it described. `E-4`'s fixture loses its three target rows and keeps ten pairwise-distinct edges, so identity and ordering are still proven to agree on distinctness. ADR-034 itself is not edited: it records the decision that was correct when it was made, and this record supersedes the target clauses of it.

Ordering has one fewer tie-break. Two edges that differ only by projection still separate, and two that differ only by requirement still separate.

The public surface loses one optional member of one already-exported interface. No export list, no entrypoint, and no boundary allow-list entry changes.

Evidence ids gain the `V-` series, and `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widens its title pattern to admit it. A citation the gate cannot see is not enforced.

## Evidence

`packages/core/test/unit/graph/observation-target-removal.test.ts`:

- `V-1` neither `ObservationDefinition` nor `GraphEdge` declares a target.
- `V-2` an authored target on an input observation is refused as `observation-target-unsupported`, at the authored path, with no edge produced.
- `V-3` the same rule id refuses it on the output role, so `observation-output-target` is gone rather than renamed.
- `V-4` a project whose two input edges to one source differ only by target is refused by name, rather than accepted as two edges or reported as a duplicate.
- `V-5` live state treats an edge object that still carries a target as the edge without one: `hasEdge` finds it, `addEdge` refuses it as already live, and the snapshot does not carry the field.
- `V-6` a projected input observation still resolves to one edge with the same identity and the same ordering position. It passes on the parent by design and is not claimed as red: it is the guard that the generic primitive survives the removal.

`packages/core/test/integration/observation-identity.test.ts`:

- `V-7` `TrackHandle.addObserve` refuses an authored target on either role, and adds no live edge.

Red before green is executed and archived rather than described. The `test(graph)` commit at the base of pull request [#179](https://github.com/chahyasantoso/motion5/pull/179) carries the evidence alone, against unmodified sources. Run [32491256526](https://github.com/chahyasantoso/motion5/actions/runs/32491256526), archived at `logs/32491256526/` on `ci-logs`, reports two failures. `quality` fails `typecheck` with `TS2322: Type 'true' is not assignable to type 'false'` twice, naming lines 17 and 18 of the new file, which are the two constants that assert the members are absent. `integration` reports `1 failed | 209 passed`, the failure being `V-7`: `expected [Function] to throw an error`, which is the defect itself, an `addObserve` that accepted the field and did nothing with it.

`V-2` through `V-6` are unit cases and the red run could not reach them: the `quality` job runs `typecheck` before `npm test`, so a red typecheck stops the job before the unit tier executes. They are not claimed as archived red, and the two failures above are.

**Green:** run [32491803628](https://github.com/chahyasantoso/motion5/actions/runs/32491803628), all six behavioral jobs green plus the write-enabled Prettier job, which found no drift to repair.
