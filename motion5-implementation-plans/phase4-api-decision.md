# Phase 4: edit API decision record

Captured 2026-10-24, Asia/Jakarta, on `refactor/v5-identified-tables` at `d8fea5f`
plus the S0 commit. This records the decisions Phase 4 implements; it is not a status claim.

## Public API

Reads stay `definition` and the `requires` view. `RequireView` loses `plugin`: a slot now belongs
to the track's one plugin, so the field named the same fact twice. The view is a projection of
`input.requires`, not a second binding record.

Structural tier, returns `void`, one transaction, rebuilds the node: `track.replace(next)`,
`track.remove()`, `track.input.replace(input)`, `track.input.requires.set(slot, source, memberKey?)`
and `track.input.requires.remove(slot, memberKey?)`. Replace keeps the same id; remove is refused
while a track has dependants; the requires pair keeps the live overlay.

Cheap tier, returns `PatchBatch`, never rebuilds the graph and never re-infers the committed
contract: `track.input.values.set(values)` (whole authored table or record, no merge, validated
against the committed `ValueSpec`), `track.input.values.setField(address, cell)` (one scalar or
stop list at `{ row?, field }`), `track.writeValues(value)` (whole evaluated local value as the live
overlay) and `track.releaseValues()` (drop the overlay).

There is no `setPlugin`, no hold verb, no row/field insertion or removal, no `track.live` namespace,
and no public `apply` or undo. `track.input` is a frozen, stateless view over the same handle and
token; every method refuses on a stale handle and builds exactly one `Edit`.

## Edit union and tiers

`Edit` is serializable plain data carrying a target node id: `replace-track`, `replace-input`,
`remove-track`, `bind`, `unbind`, `set-values`, `set-field`, `write-live`, `release-live`. Every
edit must survive `structuredClone` and a JSON round-trip. `tierOf` answers `structural` for the
first five and `cheap` for the last four; `clearsOverlay` answers true for `replace-track`,
`replace-input` and `remove-track` only. Both are exhaustive switches closed by `unreachable`.

`plan(state, edits)` is pure and exhaustive, and owns parse, structural re-inference, slot recheck
of affected consumer edges, plugin selection, shape and contract checks, and the cheap-tier
contract rule. `state` is a read-only view of the committed project or of the staged plan inside
`edit(recipe)`; `plan` never copies the project and never touches the engine, scheduler or
timeline. A cheap plan returns a delta, not a full next state; only structural plans may build a
candidate project. A boundary test keeps the plan module free of engine, scheduler, timeline and
runtime-commit imports.

`apply(edits)` is internal. It plans edit `k` against the candidate of edits `0..k-1`, rolls all
back on any refusal, and reports the failing edit index with its rule id and path. One flush and one
publication cover the list: any structural edit makes the whole list take the structural path,
otherwise it is one cheap invalidate. The batch is empty for an empty list. Typed helpers
`applyStructural` (returns `void`) and `applyCheap` (returns the batch) keep verbs cast-free.

## Recipes

`values(recipe)` and `edit(recipe)` keep their current semantics. Only verbs that map to an `Edit`
kind route through `plan`, and inside either recipe that plan sees the staged state. `edit(recipe)`
stages and commits once at the end; `values(recipe)` applies each cheap edit immediately with
publication deferred to the end. `seek`, `addTrack`, `addMotion`, `invalidate` and every
motion/project edit stay on their existing path. Reentrancy refusals and handle liveness do not
move. Per-write failure isolation inside `values(recipe)` stays, because `runner.ts` relies on it.
A refusal parity test compares a recipe verb with the same standalone verb. What `values(recipe)`
leaves applied when a later verb throws is observed and reported, not changed.

## Overlay lifetime

The overlay is the whole evaluated local value of a node, survives `set-values`, `set-field`,
`bind`, `unbind` and seeks, and is cleared only by `replace-track`, `replace-input`, `remove-track`,
`release-live` and destroy. A refused write leaves the previous overlay untouched. Writes never
re-infer: they validate against the committed contract (scalar kinds, required fields, no extras,
unique row ids, finite, no reserved names) and refuse as `live-values-invalid` with an
authored-style path. A write that later becomes invalid because a dependency changed is a normal
runtime node error, never silently dropped. `releaseValues` with no overlay is an empty batch.

An authored edit under an active overlay updates the authored definition, pays exactly one
invalidate and publishes one batch whose patch reflects the overlay; the authored change has no
visible effect until release. This is documented and tested.

Errored node: `write-live` and `release-live` are allowed while status is `"error"`, and a valid
write or a release clears the error on the next flush. They are never refused for status.

Observed old behaviour, to be replaced: `overrideValues` on an errored node does not throw; it
recomposes, fails again, and returns a batch carrying the same error patch. `setValues` on an
errored node returned zero patches and changed the retained definition by injecting the retired
`keyframes: {}` member. The new overlay path bypasses interpolation and composition and therefore
can clear the error, which the old path could not.

## Committed contract

Each track entry stores its committed contract: for a plain track, `input.schema` when declared
else the inferred `ValueSpec`; for a plugin track, the plugin's `inputs.values` and `outputs`. Only
a structural plan computes it (replace-track, replace-input, and the requires part of bind/unbind).
Cheap edits carry it unchanged. `slot-check`, `dependency-check` and validation read the stored
contract and never re-derive from current authored values. This is the first S3 commit.

Cheap-tier contract rule: `set-values` and `set-field` validate against that stored `ValueSpec`
and never call `infer()`. Allowed: any row count including `[]` on an inferred table track, and any
values within the committed fields. Refused: a row missing a required field, an unknown field, a
changed scalar kind, a static-flag violation, or a table/record shape change. Each uses the
existing rule id for that violation and carries the replace hint
"use track.input.replace(...) or track.replace(...)". The only new rule id is
`cell-address-unknown`. Address-shape mismatches render as `values-shape-invalid` with, for a
record track given a row, `Track '<id>' has a record input; omit 'row'.`, and for a table track
given no row, `Track '<id>' has a table input; give 'row' (the row id).`

`values.set([])` on an inferred table source is accepted; an unrelated consumer bind afterwards is
accepted because the stored contract is still the one inferred at load. A later
`track.input.replace` re-infers and may then refuse a typed consumer as `slot-unproven`. A declared
schema never changes under `values.set`.

## Scope and consumers

Scope is track-scoped edits plus `remove-track` only. Motion and project edits, membership,
triggers, seek and invalidate keep their current path. Hold stays a runner step. A partial write is
a refused write: the whole list rolls back and nothing publishes, so a caller cannot leave half a
frame applied through this API.

Consumer inventory, from the tree at the decision commit:

- `setValues`: 12 production call sites. `apps/pose-gap-filler/src/rig/writer.ts` has 9,
  `apps/ik-playground/src/goal-control.ts` has 2, and `project-runtime.ts` projects it into
  `ValueTransaction`. 55 test call sites. Replaced by `input.values.set` or `setField`.
- `overrideValues`: 3 production call sites. `packages/plugins/src/runner.ts` has 2 (write and
  release), and `project-runtime.ts` projects it into `ValueTransaction`. 35 test call sites.
  Replaced by `writeValues` and `releaseValues`.
- `setKeyframe`: 3 production call sites. `rig/writer.ts` and `goal-control.ts` each have one
  (`ik.flip`), and `project-runtime.ts` projects one. 27 test call sites. Replaced by
  `setField({ field: "flip" }, value)`.
- `removeKeyframe`: 1 production forwarding site in `project-handles.ts`; 5 test call sites.
  Removed with its runtime method and rule id.
- `setKeyframeGroup` / `removeKeyframeGroup`: 0 production, 8 and 5 test call sites. Removed.
- `setGoal` / `removeGoal`: 0 production, 3 and 3 test call sites. Removed.
- `addObserve` / `removeObserve`: 0 production, 24 and 9 test call sites. Removed in S2.
- `setRequire` / `removeRequire`: 0 production, 28 and 9 test call sites. Removed; replaced by
  `input.requires.set/remove`.

The consumers' field acquisition was checked. `goal-control.ts` writes `{ x, y }` or `{ x, y, z }`
to transform records that also author `rotation`, and `rig/writer.ts` writes `{ length }` to FK
records that also author `rotation` and `weight`. Since `values.set` does not merge, S6 sends the
full record by reading `track.definition` and keeping the fields that did not change, or uses
`setField` for the one field that did. No caller needs a read the public surface does not have.

## S2 rule-id reconciliation

Deleting the authored `observes` surface removed every rule id whose only producer was that field:
`observation-source`, `observation-source-shape`, `observation-pending-reference`,
`observation-duplicate`, `observation-self-reference`, `observation-unknown-source`,
`observation-target-unsupported`, `observation-role-unsupported`,
`observation-projection-unsupported`, `observation-input-shape`, `observation-output-shape`,
`observation-missing-upstream` and `observes-shape`. The diagnostics that survived because a
dependency edge can still raise them were renamed to role-neutral ids: `edge-duplicate`,
`edge-self-reference`, `edge-unknown-source`, `input-source-shape`, `output-source-shape`,
`upstream-missing`, and the reference warning `source-pending`. `requirement-source` keeps its name
and now covers only the identified-table binding walk.

Slot binding derivation moved from `graph/ir.ts` to `graph/dependency-edges.ts` in the same slice,
because `ir.ts` was 48,136 bytes at that point and the phase threshold was 45,000; it is 43,627 bytes
after the move, with behaviour unchanged.

Removed refusal kinds are `unbound-group`, `reserved-goal-slot` and the `live-value-key` rule, each
with the verb that raised it. The kinds kept are `stale-handle`, `unknown-node`, `commit-in-flight`,
`structural-in-batch`, `disposed`, `invalid-definition`, `nested-recipe`, `immediate-in-recipe` and
`immediate-in-batch`. Remaining references to the removed names are the old owners themselves
(`runtime/refusal.ts`, `runtime/authoring-edit.ts`, `domain/track.ts`, `domain/authoring/keyframes.ts`,
`contract/track-handle.ts`), their tests, and guide/ADR prose; S3 through S6 delete them with their
owners. No inventory item contradicted a brief decision.

## Benchmark baseline

`scripts/bench-edit-cost.mjs` drives the current public paths at this commit. Fixture: one manual
motion with a 20-row, 2-field inferred table track and a 2-field record track, both mounted. Each
cell is 100 calls per sample after a warm-up, median of 7 samples, same machine. Current run:

```text
{
  "node": "v24.21.0",
  "platform": "win32 x64",
  "cpu": "12th Gen Intel(R) Core(TM) i5-12500H",
  "callsPerSample": 100,
  "samplesPerCell": 7,
  "rows": 20,
  "cells": [
    {
      "label": "overrideValues/table",
      "nsPerCall": 49335,
      "samples": [51081, 52503, 49335, 40231, 50171, 46283, 31229]
    },
    {
      "label": "overrideValues/record",
      "nsPerCall": 5837,
      "samples": [5837, 7304, 5730, 6412, 7897, 5465, 4929]
    },
    {
      "label": "setValues/table",
      "nsPerCall": 33516,
      "samples": [33516, 32317, 33910, 30827, 35086, 35368, 30420]
    },
    {
      "label": "setValues/record",
      "nsPerCall": 5187,
      "samples": [4559, 7270, 5187, 5566, 7007, 4387, 4364]
    }
  ]
}
```

`npm run bench:edit-cost` runs it. It writes no report file and does not gate CI. S4 re-measures
`setValues` against `values.set`, and S5 re-measures `overrideValues` against
`writeValues`/`releaseValues`; a median more than 25 percent slower stops the slice and is reported
with options rather than accepted.

## S4 benchmark re-baseline

`values.set` measured on the same fixture, with the table fixtures built once so the cell measures
the runtime rather than the caller's row allocation: 62,117 ns per 20-row table write, 10,711 ns per
record write, 57,469 ns per addressed table cell, and 9,026 ns per addressed record field (median of
seven samples, 100 calls each).

Those are 85 to 100 percent above the S1 cells for `setValues` (33,516 ns table, 5,187 ns record),
and the comparison is the finding rather than the slice's cost. The S1 cell did not change any
compiled value on an identified-table track: `Engine` installs no `writeValues` port, so the old
path called the port's no-op default, and `withAuthoredValues` had no grouped-keyframes record to
move. It measured the booking overhead of a write that could not affect a published value. The S4
path parses and validates the authored snapshot, rebuilds the compiled evaluator and publishes, all
of which the old number excluded.

Decision, 2026-10-24: keep the measured real path and treat the S4 medians as the effective v5
baseline. The 25 percent gate against a no-op reference is recorded as inapplicable rather than
silently passed, and the absolute cost stays under 0.1 ms for the largest fixture. A later slice
that adds incremental slot updates can compare against these numbers.
