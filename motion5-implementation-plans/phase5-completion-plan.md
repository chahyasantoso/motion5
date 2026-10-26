# Phase 5 Plan: Aggregate Tables for Kinematics

**Status:** Accepted redesign; execution authority for the remainder of Phase 5.

**Prepared:** 2026-10-26, Asia/Jakarta.

**Branch:** `refactor/v5-identified-tables`.

This document supersedes the previous contents of `phase5-completion-plan.md` and the earlier
identified-plugin plans that it superseded. The earlier plans remain available in Git history and
are not execution authority. This document describes the accepted target and the implementation
work required to reach it. It does not claim that any slice has landed. Current state remains in
`docs/SESSION-STATUS.md` and in verified commits.

## 1. Decision

Phase 5 will use aggregate identified tables for the kinematic pipeline. A body is one table, goals
are one table, a solver is one plugin node, and FK is one plugin node that publishes one complete
pose table. The graph carries dependencies between aggregate tracks. It does not manufacture one
graph node per body member and it does not deliver hidden member state to a solver.

The final dataflow is:

```text
root record ───────────────┐
body/rest/config table ────┼──> ik or ik3d ──> solved rotation table
goals table ───────────────┘                         │
                                                    v
root record ───────────────────┐             fk or fk3d
body/rest/config table ────────┼────────────────> pose table
solved rotation table ─────────┘                         │
                                                        v
                                             classifier and renderers
```

The `rig` aggregation plugin is not part of the target architecture. FK already owns pose
composition, and the goals table already owns control data. The v5 rig plugin, its catalog entry,
its record-map output contract, and its consumers will be removed. A legacy grouped rig path may
remain only while an explicitly classified legacy test still needs it; it is not a v5 fallback.

The redesign keeps schema version 5, the table-or-record value model, named plugin dependencies,
frozen named outputs, and the existing numerical solver algorithms. It changes the ownership and
transport boundary around those algorithms.

## 2. Why the redesign is necessary

The previous Phase 5 plan migrated individual member tracks first and then used explicit maps to
assemble solver inputs. That preserves identified rows, but it leaves the graph and publisher
responsible for a solver-specific fan-in:

- `GraphNode.solves` derives members that are not authored dependencies of the solver node;
- the publisher reads member interpolation state through a hidden path;
- FK composes one graph node per member;
- a rig node aggregates those FK outputs again;
- consumers need a second selection layer to recover pose identity.

That is two representations of the same body. It also makes a table authored by the caller less
useful than the graph shape that happens to have been built from it.

The aggregate design gives every owner one question:

- the authored table owns body rows and their topology;
- the graph owns only explicit track dependencies;
- IK owns topology validation and solving over one table;
- FK owns world-frame composition over one table;
- a pose table owns the output identity consumed by applications;
- adapters select rows by row id and never rebuild the pose.

## 3. Authored contract

### 3.1 Project shape

The project remains a schema-version-5 project with motions and tracks. The accepted example is:

```text
{
  schemaVersion: 5,
  motions: [{
    id: "demo",
    trigger: { type: "manual" },
    tracks: [
      { id: "root", input: { values: { x: 0, y: 0, rotation: 0 } } },
      {
        id: "body",
        input: {
          schema: {
            kind: "table",
            schema: {
              row: {
                fields: {
                  parentId: { kind: "string", optional: true, static: true },
                  length: { kind: "number" },
                  rotation: { kind: "number" },
                  weight: { kind: "number", optional: true },
                  x: { kind: "number", optional: true },
                  y: { kind: "number", optional: true },
                  minRotation: { kind: "number", optional: true },
                  maxRotation: { kind: "number", optional: true }
                }
              }
            }
          },
          values: [
            { id: "trunk", cells: { length: 20, rotation: 0, weight: 1 } },
            { id: "left-upper", cells: { parentId: "trunk", length: 10, rotation: 0, weight: 1 } },
            { id: "left-lower", cells: { parentId: "left-upper", length: 10, rotation: 0, weight: 1 } }
          ]
        }
      },
      {
        id: "goals",
        input: {
          schema: {
            kind: "table",
            schema: {
              row: {
                fields: {
                  memberId: { kind: "string", static: true },
                  x: { kind: "number" },
                  y: { kind: "number" },
                  influence: { kind: "number", optional: true }
                }
              }
            }
          },
          values: [
            { id: "left-hand", cells: { memberId: "left-lower", x: 12, y: 8 } }
          ]
        }
      },
      {
        id: "solve",
        plugin: "ik",
        input: {
          values: { flip: false },
          requires: { chain: "body", goals: "goals", base: "root" }
        }
      },
      {
        id: "pose",
        plugin: "fk",
        input: {
          requires: { chain: "body", solved: "solve", base: "root" }
        }
      },
      {
        id: "classify",
        plugin: "pose-classify",
        input: { requires: { pose: "pose" } }
      }
    ]
  }]
}
```

The example is illustrative. The implementation must preserve the existing parser's refusal rules,
static-cell rules, stop evaluation, and whole-value editing semantics.

### 3.2 Identity rules

Row identity is the only domain identity:

- `body` row `id` is the member id;
- `goals` row `id` is the goal id;
- solver output row `id` is the body member id;
- FK pose output row `id` is the body member id;
- a binding label is never promoted to a member, goal, control, or pose id.

The `memberId` field is removed from body rows because it duplicates `row.id`. The `goalId` field is
removed from goal rows because it duplicates `row.id`. A goal retains `memberId` because it is a
relationship to a body row rather than identity for the goal itself.

An implementation must not silently accept conflicting duplicate identity fields during migration.
The old fields are either removed from the schema and refused by the appropriate legacy-field rule,
or, if a focused compatibility refusal is needed, receive a named diagnostic before any plugin
executes. No normalization copies one identity spelling into another.

### 3.3 Body topology

The body table contains rest and solver configuration. `parentId` is absent for a member attached
directly to the external base frame. When present, it must name another row in the same body table.
The literal id of the base track is not a body parent and is not written into `parentId`.

The topology reader owns these semantic checks:

- duplicate row ids are refused by the table value contract;
- a parent that names no body row is refused;
- a self-parent is refused;
- a parent cycle is refused;
- every body row is reachable from the external base through parent links;
- the canonical root-first order is deterministic and independent of authored array order;
- body rows retain their ids and cells when transformed into solver or FK inputs.

The canonical order is root depth followed by code-unit row-id order. Authored row order is not
domain identity and must not affect numerical results. Output tables use this canonical order.

### 3.4 Goals

Each goal row names one body member through `memberId`. The existing solver mathematics supports one
goal per target member, so the aggregate contract preserves that rule:

- a goal for an unknown member is refused;
- a goal for a non-leaf member is refused;
- two goal rows targeting one member are refused;
- every body leaf must have one goal when the solver is used;
- a solver with no goals is refused;
- goal row ids remain distinct even when two goals target different members.

2D goals carry `x`, `y`, and optional `influence`. 3D goals additionally carry `z`, optional Euler
orientation, and the existing orientation/influence fields. Existing constraint semantics are
preserved; they are not moved into a generic untyped goal bag.

### 3.5 Root and base

The root is a single record dependency, not a table containing a synthetic root row. A 2D root
contains `x`, `y`, and `rotation`. A 3D root contains `x`, `y`, `z`, `rotation`, `rotationX`, and
`rotationY`.

The root record is the known base frame from which the body topology starts. No FK output is bound
back as the base, and IK never consumes FK output. This keeps the dependency graph acyclic and makes
the distinction between rest/configuration, solved rotations, and world pose explicit.

## 4. Plugin contracts

The named dependency slot is part of the plugin contract. The source track id is an authoring
reference; the source's main output remains named `values`.

### 4.1 `ik`

```text
inputs.values:
  record { flip?: boolean, inspect?: boolean static }

inputs.requires:
  chain: single source, values = 2D body table
  goals: single source, values = 2D goal table
  base: single source, values = 2D root record

outputs:
  values: 2D solved-member table
  inspect?: flat inspection record
```

The transform reads the complete evaluated body table and goal table once, validates topology, builds
the existing `SolveMember` values, calls the existing `solveChain`, and emits one identified row for
each body member. The output row contains `rotation` and the existing optional `residual` and
`atBound` fields.

The solver does not read the graph, publisher, track registry, FK output, or hidden member state.
The `inspect` output remains absent unless the local static opt-in is true.

### 4.2 `ik3d`

`ik3d` has the same aggregate dependency shape:

```text
inputs.requires:
  chain: single source, values = 3D body table
  goals: single source, values = 3D goal table
  base: single source, values = 3D root record
  pole?: single source, values = 3D point/frame record
```

It preserves the existing 3D joint, pole, orientation, influence, pivot, serial-recovery, and
inspection behavior. It emits one identified row per body member with the existing Euler and
diagnostic fields.

### 4.3 `fk`

```text
inputs.values:
  record with no required local fields

inputs.requires:
  chain: single source, values = 2D body table
  solved: single source, values = 2D solved-member table
  base: single source, values = 2D root record

outputs:
  values: 2D pose table
```

`fk` reads the complete body table and solved table once. It builds an id-indexed solved-row lookup,
walks the canonical body topology, blends authored rest rotation with solved rotation using each
member's weight, applies the shared pivot convention, and emits one world-frame row per member.

The main output remains `values`. `pose` is the semantic track id and the classifier's dependency
slot name, not a second output alias. This follows the v5 rule that a plugin with one main result
publishes that result as `values`.

A missing solved row is an error. FK must not select by source binding label, row position, first
row, or graph track id.

### 4.4 `fk3d`

`fk3d` has the same `chain`, `solved`, and `base` single-source slots with 3D schemas. It preserves
the existing orientation blending, pivot offset, segment extent, and world-frame conventions. It
emits one 3D pose row per body member, keyed by the same member id as the body and solved rows.

### 4.5 `pose-classify`

The classifier changes its dependency from a rig output to the FK track's main output:

```text
requires:
  pose: single source, values = pose table

outputs:
  values: { label: string, confidence: number }
```

It selects rows by `row.id`, converts only template-referenced rows, and keeps its current flat
result and tie behavior. It does not know whether the pose table came from 2D FK, 3D FK, or a
different declared producer with the same frame contract.

## 5. Core graph and runtime changes

### 5.1 Explicit graph only

The graph's dependency edges are sufficient for the new pipeline:

- `solve` reads `body`, `goals`, and `root`;
- `pose` reads `body`, `solve`, and `root`;
- `classify` reads `pose`.

The graph must not derive a solver's members from other nodes. After all aggregate plugin consumers
are migrated and the old tests have moved, remove:

- `GraphNode.solves`;
- `resolveSolvers` and its member-node fan-in;
- publisher `MemberState` and `SolverMember` collection;
- publisher solver-scope and hidden member interpolation paths;
- reverse-topology additions that exist only for hidden solver reads;
- grouped solver graph constraints that inspect member plugin bindings.

The remaining graph still owns explicit source qualification, slot admission, output compatibility,
cycle detection, canonical track ordering, and reverse dependants for authored edges.

### 5.2 Contracts and table compatibility

`CommittedContract` remains the source of structural truth for a track. Its output contracts now
describe aggregate table outputs directly. Slot checking continues to verify table kind and row
field compatibility without trying to prove parent relationships or goal leafhood.

The table validator owns envelope shape and row-id uniqueness. The plugin-side topology reader owns
relationships. Neither layer may duplicate the other's checks.

### 5.3 Publisher behavior

No new publisher special case is allowed. The identified path already collects full named outputs
for explicit edges. Aggregate plugins use that path without a solver branch. A body-table edit marks
both `ik` and `fk` dirty through ordinary explicit edges, and a solved-table edit marks FK dirty.

The publisher must continue to:

- compose each aggregate node at most once per flush;
- publish frozen table rows and records;
- retain output names without merging tables;
- report blocked and error states through the existing patch union;
- carry source revisions for every explicit source read;
- avoid reading graph state from a plugin.

## 6. Shared plugin-side helpers

The first redesign slice creates one small topology module only if both IK and FK need the exact
same contract. It owns no graph references and imports no core graph module.

The helper should expose a narrow result containing:

- canonical body rows;
- an id-to-row lookup;
- parent/child relationships;
- leaf ids;
- the external-base members;
- a deterministic topological order.

It should use a closed lookup result for row selection:

```text
found(row)
missing(id)
```

Readers must exhaustively handle both arms. Do not create a generic table framework or a broad schema
conversion layer. 2D and 3D readers may share topology traversal while retaining separate field
decoders when their semantic contracts differ.

The numerical helpers remain the owners of numerical behavior:

- `frame.ts` owns 2D frame and pivot conventions;
- `frame3d.ts` owns 3D frame and orientation conventions;
- `ik-*` solver modules own solve strategies and quality;
- FK boundaries own table transport and world-frame composition.

## 7. Consumer migration

### 7.1 Pose-gap-filler

Replace separate member-source, FK-member, rig, and classifier assumptions with aggregate tracks:

- one root record track per space;
- one body table track per space;
- one goals table track per space;
- one IK or IK3D track;
- one FK or FK3D pose track;
- optional classifier track bound directly to pose.

The writer updates the root, goals, body table, and solver configuration through the existing value
batch. Each changed aggregate table is written once with `input.values.set(...)`. It must not issue
one edit per cell or rebuild a map of member tracks.

The writer's state machine and frozen bend policy remain application-owned. Only the transport shape
changes. Existing lifecycle, persistence, replay, failure, and whole-value batching assertions must
remain meaningful.

### 7.2 Three.js

`skeletonTracks` emits aggregate 3D tracks and no rig track. The body table contains one row per
captured bone with the captured parent relationship and rest data. The pose track is FK3D output.

The skeleton driver reads pose rows by bone key or explicit row id. It must not import
`readRigValues`, consume a record-map pose, or infer identity from array position. The row selector
returns a missing-source outcome when the requested pose row is absent.

The existing parent-space, basis, aim, reset, finiteness, and inverse-bind behavior is unchanged.

### 7.3 React, DOM, and other consumers

Consumers that need a single frame select a named row from a ready pose table. Consumers that need the
whole pose retain the table. No adapter may collapse a table by choosing row zero.

The generic DOM and Three patch adapters must remain neutral to table output. A table-aware consumer
belongs at the application or adapter boundary that owns the target-to-row mapping, not in core's
publisher.

### 7.4 Labels and classification

The label reader continues to read the classifier's flat `outputs.values` record. It must not know
about pose rows. Classifier tests must prove that renaming binding labels does not change row lookup,
and that missing template rows produce the existing unknown classification rather than a guessed row.

## 8. Surface and deletion policy

The public v5 plugin set after this redesign is:

- `transform`;
- `transform3d`;
- `ik`;
- `ik3d`;
- `fk`;
- `fk3d`;
- `pose-classify` as an application-created definition, not a zero-configuration built-in.

`rig` is removed from the identified catalog and from the public plugin subpath list. There is no
public alias to an old rig implementation.

Once all repository consumers are aggregate-table consumers, delete the v5 and legacy rig modules,
`rig-values`, the rig package-surface fixtures, and record-map reader tests. Delete old graph solver
fan-in only after the explicit aggregate graph and all its tests are green.

Do not delete historical ADRs or plans. Add supersession markers to ADR-138 and any grouped solver
decision whose current claim is contradicted by the landed aggregate architecture. The new ADR owns
the reasoning; historical records retain their original text.

## 9. Implementation slices

Each slice is one vertical change with one owner, failing-first evidence, focused tests, and a clean
commit. A slice may touch its named tests, `test/pending.json` only after those tests pass, and the
documentation record required by that slice. It must not rewrite unrelated formatting.

### Slice 0 — freeze and reconcile the accepted redesign

**Owner:** Phase 5 migration boundary.

Before editing behavior, record the current head, current uncommitted paths, pending counts, and
baseline gates. Preserve the four historical untracked planning files and all user work. Do not reset
or discard the current Slice I/J changes.

Classify each current change as one of:

- reusable aggregate preparation;
- member-graph implementation that must be replaced;
- consumer migration that can be retained after its source shape changes;
- test evidence that must be rewritten for aggregate rows.

No pending entry is removed in this slice. The exit artifact is an inventory in the implementation
commit or pull request, not a new status ledger.

### Slice 1 — topology and aggregate contract proof

**Owner:** plugin-side topology reader and focused contract tests.

Add the smallest shared topology reader required by both dimensions. Add tests for duplicate ids,
unknown parents, cycles, unreachable rows, multiple base children, canonical ordering, leaves, and
row-id preservation. Add 2D and 3D table schemas for body, goals, root, solved rows, and pose rows.

The red tests must fail against a reader that uses array order or silently accepts a broken parent.
The reader must remain independent of the graph and runtime packages.

### Slice 2 — aggregate 2D IK

**Owner:** `packages/plugins/src/ik.ts` and the aggregate IK tests.

Change IK from map dependencies to `chain`, `goals`, and `base` single dependencies. Remove
`memberId` reads from body rows and `goalId` reads from goal cells. Adapt the complete table into the
existing `SolveMember` model and preserve literal solver golden values within the established
absolute `1e-6` transport tolerance.

Prove body-row reorder invariance, renamed source track ids, multiple branch goals, goal validation,
rest edits, animated values, optional inspection, and one solver invocation per composition.

### Slice 3 — aggregate 3D IK

**Owner:** `packages/plugins/src/ik3d.ts` and the aggregate 3D IK tests.

Repeat Slice 2 for 3D. Preserve pole, joint, orientation, influence, pivot, serial recovery, quality,
inspection, and Euler output behavior. Prove that FK output is not required by the solver and that
body row identity survives every strategy.

### Slice 4 — aggregate 2D FK

**Owner:** `packages/plugins/src/fk.ts`.

Change FK to consume one body table, one solved table, and one root record. Compose the whole pose in
canonical topology order and emit one `values` table. Prove missing solved-row refusal, parent lookup,
weight blending, pivot offsets, body reorder invariance, and exact row identity.

This slice removes the need for one FK node per body member in new projects but does not yet delete
the old graph solver fan-in if legacy tests still exercise it.

### Slice 5 — aggregate 3D FK

**Owner:** `packages/plugins/src/fk3d.ts`.

Repeat Slice 4 for 3D. Preserve orientation blending, frame composition, pivot offsets, segment
extent, and finite output behavior. Add deterministic whole-table call-count coverage.

### Slice 6 — explicit aggregate graph and publisher cleanup

**Owner:** `packages/core/src/graph` and `packages/core/src/runtime`.

Port the graph fixtures to explicit aggregate dependencies and prove the graph shown in this plan is
acyclic. Once no migrated test requires hidden solver members, remove `GraphNode.solves`,
`resolveSolvers`, publisher member fan-in, and the associated reverse-topology special case.

The publisher must compose aggregate plugins only through explicit `ResolvedRequires`. Existing
blocked, pending, error, revision, source-revision, and one-composition-per-flush behavior must stay
green.

### Slice 7 — pose-gap-filler aggregate migration

**Owner:** `apps/pose-gap-filler/src/rig`.

Replace member-source and rig aggregation tracks with root, body, goals, solver, and pose tracks.
Update image and world writers to perform whole-table writes in one value batch. Port pose, avatar,
GLTF, replay, inferred-bends, lifecycle, and cleanup tests to row selection by member id.

No record-map shim, rig plugin, guessed row order, or per-field write remains.

### Slice 8 — Three.js aggregate migration

**Owner:** `packages/three`.

Update skeleton track generation, skeleton loading, frame-source selection, and tests to consume one
FK3D pose table. Remove `readRigValues` and all rig-track assumptions. Preserve parent-space and
bone-drive behavior through row-id selection.

### Slice 9 — classifier and remaining consumers

**Owner:** `packages/plugins/src/pose-classify.ts`, labels, React, and remaining app readers.

Bind classification directly to the FK pose track's `values` output. Prove named-output narrowing,
row-id selection, unknown-pose behavior, flat `{ label, confidence }` publication, and label-change
lifecycle behavior.

### Slice 10 — rig retirement and Phase 5 closeout

**Owner:** package surface, catalogs, deletion tests, and documentation.

Remove the identified rig plugin, public rig subpath, legacy rig path when its last consumer is gone,
record-map helpers, hidden solver machinery, and obsolete grouped expectations. Port or classify all
remaining Phase 5 pending suites. Preserve Phase 6 and Phase 7 pending entries exactly.

Update the authored schema, architecture, plugin guide, README examples, relevant ADR supersession
markers, and `docs/SESSION-STATUS.md`. The status rewrite happens only after the landed code and
verification satisfy the closeout gate.

## 10. Test and evidence allocation

Every behavior slice starts with assertion-level failing-first evidence. A typecheck or formatter
failure is not failing-first behavior evidence.

Required focused evidence includes:

- topology reader refusal and canonical-order tests;
- aggregate 2D IK golden and reorder-invariance tests;
- aggregate 3D IK golden, constraints, pole, and orientation tests;
- aggregate 2D and 3D FK row lookup and whole-pose tests;
- explicit graph acyclicity and no-hidden-member-read tests;
- publisher call-count and source-revision tests;
- pose-gap-filler whole-table batch tests;
- Three.js pose-row selection and lifecycle tests;
- classifier and label flat-record tests;
- deletion and public-surface tests proving no v5 rig path remains.

Numerical equivalence uses literal values captured from the frozen pre-redesign solver or existing
fixtures. The migrated code must not generate its own expected values. Numerical transport may differ
only within the existing absolute `1e-6` tolerance; quality kind, iteration count, bound flags, row
ids, and output names remain exact unless a focused design decision explicitly changes them.

The pending ledger remains authoritative. Remove an entry only after its exact test passes under the
aggregate architecture. Do not remove entries merely because a similarly named test passes through
the old grouped or member-graph path. Do not delete, skip, weaken, or rename a test to reduce the
ledger.

## 11. Verification protocol

Before each slice, run the previous slice's exit checks, then run these commands one at a time:

```text
npm run format:check
npm run typecheck
npm run test:boundaries
```

If a core source file changes, also run:

```text
npm run test:read-budget
```

After the focused tests pass, run:

```text
npm run typecheck
npm run format:check
npm run test:boundaries
npm run test:read-budget
npm test
```

Run the affected app builds after app or package-boundary slices. Do not use wall-clock performance
as a pass condition. Use deterministic solver and aggregate call counts. Do not run a benchmark
whose fixtures still author the retired grouped shape; record that limitation rather than converting
it into an exemption.

Every implementation commit and pull request records:

- the exact head tested;
- the invariant and failing-first case;
- the single owner;
- changed public paths and deleted paths;
- pending entries removed and entries deliberately retained;
- every command and result;
- numerical and call-count evidence;
- any allocation correction and why it was necessary.

An independent quality pass reads the whole diff without relying on the implementer's inventory. It
must report remaining bugs, fixed findings, and deliberate follow-ups in the pull request record.

## 12. Completion gate

Phase 5 is complete only when all of the following are true:

- body, goals, root, solved, and pose data use identified table or record contracts as defined here;
- 2D and 3D IK consume complete aggregate tables and no hidden member state;
- 2D and 3D FK consume complete aggregate tables and publish one complete pose table;
- the graph contains only explicit aggregate dependencies;
- `GraphNode.solves` and hidden solver fan-in are deleted;
- no v5 rig plugin, rig catalog entry, public rig subpath, or record-map pose consumer remains;
- every renderer and application consumer selects rows by id and never by first row or array position;
- classifier output is the flat `{ label, confidence }` record;
- pose-gap-filler performs whole-value aggregate writes inside its existing value batch;
- all Phase 5 pending entries are removed exactly once after passing;
- Phase 6 and Phase 7 pending entries remain unchanged;
- numerical equivalence, quality, identity, constraints, lifecycle, and call-count evidence passes;
- public declarations, package exports, catalogs, tests, and docs describe the same surface;
- formatting, typechecking, boundaries, read-budget, full tests, and affected builds pass;
- `docs/SESSION-STATUS.md` states only the verified landed state.

## 13. Explicit non-goals

- No schema version 6 or package rename.
- No v5 compatibility converter, shape autodetection, alias, fallback, bridge, or second engine.
- No generic plugin base, table conversion framework, or all-purpose row abstraction.
- No rewrite of solver mathematics without a failing equivalence case proving a transport defect.
- No implicit joins, broadcasts, first-row adaptation, map-label identity, or output merging.
- No general retargeting algorithm.
- No renderer import into core.
- No change to unrelated Phase 6 or Phase 7 behavior.
- No reset, discard, or broad formatting pass over existing user work.

The central acceptance criterion is simple: an author can change the body table, goals table, root
record, or solver values and the explicit aggregate graph publishes the corresponding solved or posed
table without a hidden graph-owned representation of the same body.
