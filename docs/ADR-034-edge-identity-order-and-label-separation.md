# ADR-034: edge identity, edge ordering, and the edge label are three separate functions

**Status:** accepted  
**Date:** 2026-08-18  
**Closes:** deferred finding 8.2 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md`, filed as issue [#137](https://github.com/chahyasantoso/motion5/issues/137)

## Context

`edgeKey()` is the single canonical edge identity. Section 10 of the trigger-driver plan states the rule as "one edge identity: `edgeKey()`, nothing compares observations any other way", and `T0` made that true by deleting the competing `JSON.stringify` comparison in `ProjectRuntime`.

A single identity is only an identity if it is injective. It was not. `edgeKey` joined its fields with `|`, and `|` is legal in every field it separates: `assertAuthoredMotionId` reserves only `/` and `~`, `assertAuthoredTrackId` reserves only `/`, and a `target` is an arbitrary string. `canonicalizeProjection` had the same hole one level down, joining `pick` entries with `,` and `map` pairs with `,` and `=` while both keys and values are arbitrary non-empty strings. A value could therefore forge a field boundary.

The collision is reachable through `Engine.load()` with ids that all pass `validateV5`. Observer node `m/x` observing `m|y/z` and observer node `m/x|m` observing `y/z` are two different edges between four different nodes, and both encoded to `m/x|m|y/z|input||`. The loud symptom is the misleading one: `buildGraphIR` reads the two keys as equal, raises an error-severity `observation-duplicate`, and rejects a legal project by naming a duplicate edge the author never wrote twice. That is the same shape of failure that bug B1 produced through `addObserve`, which section 3.3 of the plan already treated as evidence that the identity function was the defect.

The silent symptoms are worse. `ObservationState.hasEdge`, `addEdge`, and `removeEdge` treat two colliding edges as one, `GraphBinding`'s delta map drops one of them from every diff, and `ProjectRuntime.#observationKey` can remove the wrong observation. A third, smaller case: an authored `target` of `""` encoded identically to an absent `target`, because both rendered as the empty string.

Behind all of it is one cause. The identity string had three jobs. It was the equality key, it was the sort key in `runtime/graph-publisher.ts`, and it was the human-readable label inside two diagnostic messages. Those three pull in opposite directions: equality wants an unambiguous encoding, ordering wants the field values in their authored form, and a reader wants neither.

## Decision

Split the three jobs into three functions in `graph/ir.ts`, and let each be the only owner of its job.

`edgeKey` is identity only. Every field is length-prefixed as `length:value`, which makes the encoding prefix-free and therefore injective: a separator that appears inside a value can no longer be read as a boundary, because the reader never looks for a separator. An absent `target` encodes as `-` rather than as an empty field, so an authored empty target is a different edge from no target at all. `canonicalizeProjection` uses the same prefixing for `pick` entries and for `map` keys and values.

An encoding chosen for injectivity has no meaningful order, so ordering stops being derived from it. `compareEdges` compares observer, source, role, target, then canonical projection, field by field, through `compareCodeUnits`. It is the only edge comparator in the codebase. `compareEdgeKeys` in `runtime/graph-publisher.ts` is deleted, and so is the private `compareEdges` that `graph/observation-state.ts` kept for its snapshots and adjacency reads; a second comparator could have silently disagreed with the publisher about which edge comes first. `firstPendingEdge` still takes its comparator by injection, so `graph/references.ts` keeps knowing nothing about encodings, but the only value ever passed is now the one owner.

Ordering matters more than diagnostics here, which is why it cannot be left to fall out of the key. The publisher's comparator picks the blocked upstream that gets named, feeds `firstPendingEdge`, orders input composition, and orders the output merge where the later write wins. It decides published values. Sorting by a length-prefixed encoding would have made merge precedence depend on how long an id is.

`compareEdges` separates an absent target from an authored empty one for the same reason `edgeKey` does. A comparator that returns `0` for two distinct edges leaves their relative order to `Array.prototype.sort` stability, which means authored order, which is exactly what canonical ordering exists to remove.

`describeEdge` owns the readable label and returns `observer <- source (role)`. It replaces the encoded key inside the `observation-duplicate` message, inside the input-collision message in `graph-publisher.ts`, and inside the two live-edge `TypeError` messages in `ObservationState`. A length-prefixed key in a message is unreadable, and a message is not evidence, so no test asserts one.

## Alternatives rejected

Escaping or restricting the separator character. Escaping trades one hole for an escaping bug and still leaves `canonicalizeProjection` to solve separately. Narrowing the authored id character set is a schema break that needs its own decision, and a correct encoding makes it unnecessary: `|` in an id is legal, and it should stay legal.

Sorting keys before hashing, or keeping one string for all three jobs. Section 3.5 of the trigger plan already rejected the general version of this for B1: a fix that addresses the shape of the reported case rather than the identity notion leaves the rest of the class live.

## Consequences

`edgeKey` output changes format. It is internal identity, never persisted, never part of a patch payload or a golden fixture, so there is no migration. `compareEdges` and `describeEdge` are new exports from `graph/ir.ts`. The public package surface is unchanged, so the boundary allowlist is untouched.

Snapshot and adjacency ordering in `ObservationState` now also breaks ties on the canonical projection, which its private comparator ignored. Two live edges that differ only by projection previously tied and fell back to insertion order.

Evidence ids gained the `E-` series, so `packages/core/test/unit/scripts/evidence-case-ids.test.ts` widened its title pattern to `C`, `E`, `R`, and `T`. A citation the gate cannot see is not enforced.

ADR-033 recorded this finding as still open, along with 8.3 and 8.4. It is not edited: this record closes 8.2, and 8.3 and 8.4 remain open exactly as ADR-033 describes them.

## Evidence

`packages/core/test/unit/graph/edge-key-separator.test.ts`:

- `E-1` a legal project whose ids contain `|` builds four nodes and reports no `observation-duplicate`.
- `E-2` a `pick` key containing `,` is not the same edge as two keys.
- `E-3` a `map` value containing `,` and `=` is not the same edge as two pairs.
- `E-5` a genuinely repeated edge still produces exactly one `observation-duplicate`, so injectivity was not bought by weakening the check that consumes it.
- `E-6` an authored empty target is not the same edge as an absent target.

`packages/core/test/unit/graph/edge-order.test.ts`:

- `E-4` `compareEdges` is a strict total order over a fixture containing `|`, `:`, `,`, `=`, and leading digits: irreflexive, antisymmetric, transitive, and never `0` for two distinct edges. The same case asserts `edgeKey` is injective over that fixture, so identity and order agree on distinctness without sharing an encoding.
- `E-7` sorting does not depend on the order the edges arrive in.

`packages/core/test/integration/flush-output-merge.test.ts` keeps deriving its expected output-merge winner from the comparator rather than hardcoding one, and now derives it from `compareEdges`.

Red before green is durable rather than described. `E-1`, `E-2`, `E-3`, and `E-6` fail on the unmodified parent `dba6cfd`, and `E-5` passes there, which is what proves the duplicate check was already green. The failing run is archived on `ci-logs`, cited from pull request [#140](https://github.com/chahyasantoso/motion5/pull/140).
