# ADR-034: edge identity, edge ordering, and the edge label are three separate functions

**Status:** accepted  
**Date:** 2026-08-18  
**Closes:** deferred finding 8.2 of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md`, filed as issue [#137](https://github.com/chahyasantoso/motion5/issues/137)

## Context

`edgeKey()` is the single canonical edge identity. Trigger-driver plan section 10 states the rule as
"one edge identity: `edgeKey()`, nothing compares observations any other way"; `T0` made that true by
deleting the competing `JSON.stringify` comparison in `ProjectRuntime`.

A single identity counts only if injective. It was not. `edgeKey` joined fields with `|`, and `|` is
legal in every field it separates: `assertAuthoredMotionId` reserves only `/` and `~`,
`assertAuthoredTrackId` reserves only `/`, a `target` is an arbitrary string. `canonicalizeProjection`
had the same hole one level down, joining `pick` entries with `,` and `map` pairs with `,` and `=` while
keys and values are arbitrary non-empty strings. A value could forge a field boundary.

Collision is reachable through `Engine.load()` with ids that all pass `validateV5`. Observer node `m/x`
observing `m|y/z` and observer node `m/x|m` observing `y/z`: two different edges between four different
nodes, both encoded to `m/x|m|y/z|input||`. Loud symptom is the misleading one: `buildGraphIR` reads the
two keys as equal, raises error-severity `observation-duplicate`, rejects a legal project by naming a
duplicate edge the author never wrote twice. Same failure shape bug B1 produced through `addObserve`,
which plan section 3.3 already treated as evidence the identity function was the defect.

Silent symptoms worse. `ObservationState.hasEdge`, `addEdge`, `removeEdge` treat two colliding edges as
one, `GraphBinding`'s delta map drops one from every diff, `ProjectRuntime.#observationKey` can remove
the wrong observation. Third, smaller case: authored `target` of `""` encoded identically to an absent
`target`, both rendering as the empty string.

One cause behind all of it: the identity string had three jobs — equality key, sort key in
`runtime/graph-publisher.ts`, human-readable label inside two diagnostic messages. The jobs pull
opposite ways: equality wants an unambiguous encoding, ordering wants field values in authored form, a
reader wants neither.

## Decision

Split the three jobs into three functions in `graph/ir.ts`; each the only owner of its job.

`edgeKey` is identity only. Every field is length-prefixed as `length:value` → encoding prefix-free,
therefore injective: a separator inside a value can no longer read as a boundary, because the reader
never looks for a separator. An absent `target` encodes as `-` rather than an empty field → an authored
empty target is a different edge from no target at all. `canonicalizeProjection` uses the same prefixing
for `pick` entries and for `map` keys and values.

An encoding chosen for injectivity has no meaningful order → ordering stops being derived from it.
`compareEdges` compares observer, source, role, target, then canonical projection, field by field,
through `compareCodeUnits`. It is the only edge comparator in the codebase. `compareEdgeKeys` in
`runtime/graph-publisher.ts` is deleted, and so is the private `compareEdges` that
`graph/observation-state.ts` kept for its snapshots and adjacency reads — a second comparator could have
silently disagreed with the publisher about which edge comes first. `firstPendingEdge` still takes its
comparator by injection, so `graph/references.ts` keeps knowing nothing about encodings, but the only
value ever passed is now the one owner.

Ordering matters more than diagnostics here, so it cannot be left to fall out of the key. The publisher's
comparator picks the blocked upstream that gets named, feeds `firstPendingEdge`, orders input
composition, orders the output merge where the later write wins. It decides published values. Sorting by
a length-prefixed encoding would have made merge precedence depend on how long an id is.

`compareEdges` separates an absent target from an authored empty one for the same reason `edgeKey` does.
A comparator returning `0` for two distinct edges leaves their relative order to
`Array.prototype.sort` stability = authored order, exactly what canonical ordering exists to remove.

`describeEdge` owns the readable label, returns `observer <- source (role)`. It replaces the encoded key
inside the `observation-duplicate` message, inside the input-collision message in `graph-publisher.ts`,
inside the two live-edge `TypeError` messages in `ObservationState`. A length-prefixed key in a message is
unreadable, and a message is not evidence → no test asserts one.

## Alternatives rejected

Escaping or restricting the separator character. Escaping trades one hole for an escaping bug and still
leaves `canonicalizeProjection` to solve separately. Narrowing the authored id character set is a schema
break needing its own decision, and a correct encoding makes it unnecessary: `|` in an id is legal, and
it should stay legal.

Sorting keys before hashing, or keeping one string for all three jobs. Plan section 3.5 already rejected
the general version for B1: a fix addressing the shape of the reported case rather than the identity
notion leaves the rest of the class live.

## Consequences

`edgeKey` output changes format. It is internal identity, never persisted, never part of a patch payload
or a golden fixture → no migration. `compareEdges` and `describeEdge` are new exports from
`graph/ir.ts`. Public package surface unchanged → boundary allowlist untouched.

Snapshot and adjacency ordering in `ObservationState` now also breaks ties on the canonical projection,
which its private comparator ignored. Two live edges differing only by projection previously tied and
fell back to insertion order.

Evidence ids gained the `E-` series → `packages/core/test/unit/scripts/evidence-case-ids.test.ts`
widened its title pattern to `C`, `E`, `R`, `T`. A citation the gate cannot see is not enforced.

ADR-033 recorded this finding as still open, with 8.3 and 8.4. It is not edited: this record closes 8.2,
and 8.3 and 8.4 remain open exactly as ADR-033 describes them.

## Evidence

`packages/core/test/unit/graph/edge-key-separator.test.ts`:

- `E-1` a legal project whose ids contain `|` builds four nodes, reports no `observation-duplicate`.
- `E-2` a `pick` key containing `,` is not the same edge as two keys.
- `E-3` a `map` value containing `,` and `=` is not the same edge as two pairs.
- `E-5` a genuinely repeated edge still produces exactly one `observation-duplicate` → injectivity not
  bought by weakening the check that consumes it.
- `E-6` an authored empty target is not the same edge as an absent target.

`packages/core/test/unit/graph/edge-order.test.ts`:

- `E-4` `compareEdges` is a strict total order over a fixture containing `|`, `:`, `,`, `=` and leading
  digits: irreflexive, antisymmetric, transitive, never `0` for two distinct edges. Same case asserts
  `edgeKey` is injective over that fixture → identity and order agree on distinctness without sharing an
  encoding.
- `E-7` sorting does not depend on the order the edges arrive in.

`packages/core/test/integration/flush-output-merge.test.ts` keeps deriving its expected output-merge
winner from the comparator rather than hardcoding one, now from `compareEdges`.

Red before green is executed and archived, not described. Pull request
[#139](https://github.com/chahyasantoso/motion5/pull/139) applies the separator suite alone to the
unmodified parent `dba6cfd`. Run
[32129021992](https://github.com/chahyasantoso/motion5/actions/runs/32129021992), archived at
`logs/32129021992/` on `ci-logs`, reports `4 failed | 447 passed`, the four being exactly `E-1`, `E-2`,
`E-3`, `E-6`. The archived log carries the collision itself:
`Duplicate observation edge "m/x|m|y/z|input||"`. `E-5` passes on that parent, which proves the duplicate
check was green before the encoding changed.
