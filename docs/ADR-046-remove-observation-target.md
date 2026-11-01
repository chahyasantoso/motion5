# ADR-046: `ObservationDefinition.target` is removed, and an authored one is refused

**Status:** accepted  
**Date:** 2026-08-21  
**Closes:** issue [#175](https://github.com/chahyasantoso/motion5/issues/175), and the deferral recorded in the alternatives section of ADR-044

## Context

`target`: runtime-validated field, carried in edge identity, carried in edge ordering, read by no consumer.

All four held at once:

1. `resolveObservationEdge` validated it, refused it on output role as `observation-output-target`.
2. `edgeKey` encoded absent target as `-`, authored one as length-prefixed field → two input edges to one source separated only by target name were two distinct edges.
3. `compareEdges` ordered by `targetOrder`, existing only to separate absent target from authored empty one.
4. `ObservationState.normalizeEdge` copied it into live state → live inspection carried it.

Nothing composed with it. `GraphPublisher` builds node's input bag from two things: `projection`, renaming source's keys; `edge.requirement`, scoping plugin-owned dependency by plugin and slot. No third branch. Author writing `target: "parentWorld"` got valid project whose edge was distinct from one without field, composed values byte-identical. Rule 6 of ADR-033 forbids exactly that: field accepted then ignored.

Name predates two mechanisms that took its job. ADR-034 replaced `(source, role, target)` identity with injective encoding over observer, source, role, canonical projection; ADR-044 gave plugin-owned dependency its own scope, made `requires` the way to express one. TR-D-05 of `docs/TRD.md` still describes edge as `(source, role, target)`, still requires non-empty target for input edge -- false before this change; needs own docs slice, not edited here.

ADR-044 called field dead surface, deferred it: removal is second invariant, own blast radius across identity, ordering, `ObservationState`, dozen fixtures; slice already at sizing ceiling.

## Decision

Remove field; refuse authored one.

`ObservationDefinition.target` and `GraphEdge.target` deleted. `targetOrder` deleted. `edgeKey` and `compareEdges` lose target field; `ObservationState.normalizeEdge` stops copying one. Authored `target` → `observation-target-unsupported`, replacing `observation-output-target`.

Four deliberate points.

**Refused, not merely undeclared.** Type deletion stops TypeScript author, does nothing to JavaScript author: field silently ignored -- accepted-and-ignored shape ADR-033 forbids, reached by deletion not design. Worse than ignored: target split one edge into two → project binding two targets to one source loaded before, now fails `observation-duplicate`, naming duplicate edge author never wrote, citing nothing explanatory. Legacy `use` already refused, not dropped, as `plugin-contribution-unsupported-entry`; same rule, same kind of removal.

**One rule both roles.** `observation-output-target` role-specific because input target once believed to name destination key. Nothing read it on either role → refusal on one role implies field means something on other. One rule id, both roles.

**Same owner, no new one.** `resolveObservationEdge` in `graph/ir.ts` already owns every authored-observation shape rule: `observation-role`, `observation-source`, `observation-input-projection`. Target guard replaces one owner guard in place. No new module, registry, injected collaborator: guard needs one field of one authored object; seam here a dependency invented to look decoupled. Message is module constant → string one owner.

**Two issue items had nothing to remove.** Incremental graph builder cache key `(owner, ownerId, trackId)` never carried target; duplicate check calls `edgeKey` → inherits change, no edit. `describeEdge` never carried one either: label `observer <- source (role)` since ADR-034, plus requirement scope since ADR-044. Both named: "nothing there" is finding, not omission.

## Alternatives rejected

**Give the field a consumer instead of removing it,** making an input target the key the upstream record lands under. Third answer to "where does an upstream value land", beside `projection`, renaming keys, and `requires`, scoping by plugin and slot. Two owners of that question already model's maximum; each exists because other cannot do its job.

**Keep it in identity only,** author-facing way to declare two edges to one source. Distinguishing field no consumer can read is two edges with no observable difference. Where two dependencies on one source meant, `requires` already expresses and separates them: `base` and `destination` bound to one node is `Q-10`.

**Delete type member, ignore authored value.** Covered above: silent -- specifically silent in case that used to work.

## Consequences

`edgeKey` output changes format again. Internal identity, never persisted, never in patch payload or golden fixture → no migration.

ADR-034's `E-6`, pinning authored empty target as different edge from absent one, retired with field it described. `E-4`'s fixture loses three target rows, keeps ten pairwise-distinct edges → identity and ordering still proven to agree on distinctness. ADR-034 not edited: records decision correct when made; this record supersedes its target clauses.

Ordering has one fewer tie-break. Two edges differing only by projection still separate; only by requirement, still separate.

Public surface loses one optional member of one already-exported interface. No export list, entrypoint, boundary allow-list entry changes.

Evidence ids gain `V-` series; `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widens title pattern to admit it. Citation gate cannot see is not enforced.

## Evidence

`packages/core/test/unit/graph/observation-target-removal.test.ts`:

- `V-1` neither `ObservationDefinition` nor `GraphEdge` declares a target.
- `V-2` authored target on input observation refused as `observation-target-unsupported`, at authored path, no edge produced.
- `V-3` same rule id refuses it on output role → `observation-output-target` gone, not renamed.
- `V-4` project whose two input edges to one source differ only by target refused by name -- not accepted as two edges, not reported duplicate.
- `V-5` live state treats edge object still carrying a target as edge without one: `hasEdge` finds it, `addEdge` refuses it as already live, snapshot does not carry field.
- `V-6` projected input observation still resolves to one edge, same identity, same ordering position. Passes on parent by design, not claimed red: guard that generic primitive survives removal.

`packages/core/test/integration/observation-identity.test.ts`:

- `V-7` `TrackHandle.addObserve` refuses an authored target on either role, adds no live edge.

Red before green executed and archived, not described. `test(graph)` commit at base of pull request [#179](https://github.com/chahyasantoso/motion5/pull/179) carries evidence alone, against unmodified sources. Run [32491256526](https://github.com/chahyasantoso/motion5/actions/runs/32491256526), archived at `logs/32491256526/` on `ci-logs`, reports two failures. `quality` fails `typecheck` with `TS2322: Type 'true' is not assignable to type 'false'` twice, lines 17 and 18 of new file, two constants asserting members absent. `integration` reports `1 failed | 209 passed`, failure `V-7`: `expected [Function] to throw an error` -- defect itself, `addObserve` accepting field, doing nothing with it.

`V-2` through `V-6` unit cases red run could not reach: `quality` runs `typecheck` before `npm test` → red typecheck stops job before unit tier. Not claimed archived red; two failures above are.

**Green:** run [32491803628](https://github.com/chahyasantoso/motion5/actions/runs/32491803628), all six behavioral jobs green plus write-enabled Prettier job; no drift to repair.
