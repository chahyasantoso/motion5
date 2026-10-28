# Phase 5 Slices 2 and 3: Aggregate 2D and 3D IK

**Status:** Step-by-step implementation plan for Slice 2 and Slice 3 of section 9 of
[phase5-completion-plan.md](phase5-completion-plan.md). That document remains the execution
authority for the whole phase; this one is the worked contract for the two IK slices and decides
every question the implementer would otherwise have to decide.

**Prepared:** 2026-10-27, Asia/Jakarta. **Revised:** 2026-10-28, after both slices were executed end
to end in a scratch copy of `189ec53`. Section 12 lists every correction that execution forced.

**Branch:** `refactor/v5-identified-tables`.

**Base:** commit `189ec53` (the plan-record commit), on top of the Slice 0 and Slice 1 commit
`482d5ef` and the Slice I/J checkpoint `9706eca`, which preserved that inventory's classified working
tree as found. The tree starts clean.

**Prerequisite that ships with this revision:** `packages/plugins/test/fixtures/ik-aggregate-goldens.json`
(decision D11). Commit it together with this document, before Slice 2 starts. It cannot be created
afterwards, because it records the output of plugins that Slice 2 replaces.

## 1. What is already true

Slice 1 landed `readAggregateTopology` and the shared 2D/3D value specs in
`packages/plugins/src/aggregate-topology.ts`, tested by
`packages/plugins/test/unit/aggregate-topology.test.ts`. The reader validates one body table:
duplicate ids, unknown, self and cyclic parents, unreachable rows, canonical root-first order,
leaf and parent indexes.

The v5 `ik` and `ik3d` plugins still declare the pre-redesign contract: a `members` map slot, a
`goals` map slot, and a `root` slot that takes a table with a synthetic root row
(`packages/plugins/src/ik.ts`, `packages/plugins/src/ik3d.ts`). Slice 2 and Slice 3 replace that
transport with the aggregate contract of completion plan sections 4.1 and 4.2.

The blast radius was verified by applying both slices in a scratch copy and running the whole suite
(286 files, 1836 tests, all green), not only by reading `test/pending.json`:

- The only active tests that call the v5 `ik` and `ik3d` plugins are
  `packages/plugins/test/integration/ik-explicit-graph.test.ts` and
  `packages/plugins/test/integration/ik3d-explicit-graph.test.ts`. Both are rewritten by these
  slices. Every other file that mentions `ikPlugin` or `ik3dPlugin` is pending, imports the legacy
  plugins under `packages/plugins/src/legacy/` under that alias, or only names the symbol (the
  catalog loader, a comment or message, a boundary-scan fixture string, and `scripts/bench-ik.mjs`,
  see section 8).
- Every active solver unit test calls the solver modules directly, not the plugin transport, and
  stays green without one byte of change.
- `packages/plugins/test/unit/identified-catalog.test.ts` pins the catalog key list, which these
  slices do not change.
- The app (`apps/pose-gap-filler/src/rig/rig.ts`) authors the grouped shape against the v5 plugins,
  but every test that loads that rig is pending and the authored JSON is not type-checked against
  plugin slots. See D8.

## 2. Rules of engagement for the working tree

The Slice I/J work that Slice 0 inventoried is preserved at commit `9706eca`; the tree starts
clean, and every slice keeps it that way:

- Never run `git add -A`, `git add .`, `git stash`, `git checkout --`, `git restore`, or
  `git clean`. Stage only the files each slice names.
- Never run `npm run format` (it is `prettier . --write` and formats the whole repository).
  Format only the slice's own files: `npx prettier --write <file>...`.
- Slice 2 rewrites `packages/plugins/src/ik.ts` and deletes
  `packages/plugins/test/integration/ik-explicit-graph.test.ts`; slice 3 does the same for the
  `ik3d` pair. Overwriting them is the sanctioned replacement, not a discard: history keeps the
  withdrawn design, which is the record this repository wants.
- Start each slice from a clean tree. If anything is dirty besides the slice's own work, stop and
  report rather than working around it.

## 3. Locked design decisions

Each decision below is made. A deviation is an allocation correction that must be recorded in the
pull request body with its reason, not a silent choice.

**D1 — Slot shape.** `ik` declares exactly `chain`, `goals` and `base`, each a required
single-binding slot: `chain` reads `values` as `BODY_2D_SLOT`, `goals` as `GOALS_2D_SLOT`, `base`
as `ROOT_2D_SPEC` (a record, not a table). `ik3d` declares `chain`, `goals`, `base` as
`BODY_3D_SLOT`, `GOALS_3D_SLOT`, `ROOT_3D_SPEC` plus an optional `pole` slot reading the existing
`FRAME` record spec. No slot uses `binding: "map"`. Local `values` and both outputs (`values`,
optional `inspect`) are unchanged from the current plugins.

The `*_SLOT` constants are the Slice 1 `*_SPEC` values with `static` removed, derived by one
exported `slotSpec` in `aggregate-topology.ts` (section 5.2). Do not edit the Slice 1 specs and do
not hand-copy a field list into a plugin.

_Why:_ the Slice 1 specs carry `static: true` on `parentId`, `memberId`, `influence` and the joint
keys, because producers author them and completion plan section 3.1 requires static-cell rules.
Core's plugin admission refuses `static` anywhere inside a dependency slot's output spec
(`rejectStatic` in `packages/core/src/domain/plugin-catalog.ts`, rule `spec-field-unknown`, "static
is local authored input only"). A plugin whose slot reads `BODY_2D_SPEC` therefore throws at
`registerAll`, before any test body runs. The slot check compares kinds and field presence, never
staticness, so a producer that authors the static spec binds to the static-free slot; AI-7 proves
it through the engine. A derived constant keeps one field list with one owner, and slices 4, 5 and 9
import the same `*_SLOT` constants.

The retired grouped shape is refused by name at load with no new code, through the
identified-plugin admission rules in `packages/core/src/graph/dependency-check.ts` and the value
parser: an authored `members` or `root` slot is `slot-unknown`, a dict under `goals` is
`slot-binding-mode`, and a `memberId` or `goalId` cell is `cell-form-invalid` because declared
schemas are closed. A synthetic root row is unrepresentable because `ROOT_*_SPEC` is a record.
AI-11 asserts all four diagnostics. Do not add any compatibility spelling, alias, or bridge.

**D2 — The external base is the empty string.** `SolveMember.base` and `ChainMember3d.base` stay
`string`. A member whose `parentId` is absent gets `base: EXTERNAL_BASE` where
`EXTERNAL_BASE = ""`, exported from `aggregate-topology.ts`. Do not change `SolveMember`,
`ChainMember3d`, or any solver module.

_Why:_ every solver walk already treats a base naming no member as the external root:
`canonicalChain` walks `while (byId.has(current.base))`, `fabrik` guards with `isMember(base)`,
`branchPulls` stops when `byId.get(base)` is missing, `ik3d-fabrik` stops on `undefined`, and
`ik3d-orient`'s `worldOf` answers the root matrix for an unknown id. The empty string is the one id
`readAggregateTopology` already refuses as a body row id (kind `row-id`), so no authored row can
collide with it. A fixed spelling such as `"root"` would break the moment an author names a member
`root`: that row would hang from itself. AI-13 and AJ-11 pin this by solving a chain whose members
are named `root` and `base` and comparing it with the same chain named `a` and `b`. Changing the
`base` type to optional instead would ripple through every strategy file and its green tests for a
transport-only question, which is the wider slice the plan did not order.

**D3 — One shared goal join.** `aggregate-topology.ts` gains one exported function,
`readGoalTargets(topology, value)`, which reads the goals table and returns a member-id-to-row map,
refusing by kind: `goal-table-shape`, `goal-row-shape`, `goal-row-id`, `goal-empty`,
`goal-member-unknown`, `goal-member-not-leaf`, `goal-member-duplicate`, `goal-leaf-unaddressed`.
These kinds extend the landed closed `AggregateTopologyErrorKind` union. Both `ik.ts` and `ik3d.ts`
call it; neither re-states any of its rules.

_Why:_ completion plan section 3.4 states the goal rules once for both dimensions, and section 6
allows shared traversal with separate field decoders. Two private copies of the same refusals would
be two owners of one question. The join returns rows, not decoded frames, because the 2D and 3D
decoders differ (`readFrame` versus `readFrame3d`) and decoding stays in each plugin.

**D4 — Field decode ownership.** 2D members decode `length` through `readNumber`, `pivot` through
`readPivotOffset`, the joint limit through `readJointLimit`, the goal frame through `readFrame`,
and the goal influence through `readInfluence(goal.cells)`. 3D members add `offset` through
`readPivotOffset3d`, `rest` through `readEuler3d`, `orient` through `readOrient(row.cells)`, the
3D limit through `readJointLimit3d` with the `constrains` presence test, and the goal through
`readFrame3d`. `base` comes from `topology.parentById.get(row.id)`, never from raw cells, so the
validated parent view is the only thing the adapter reads.

_Why:_ these are the existing single owners of each decode (ADR-106, ADR-117, ADR-124), and
`parentById` is already validated and correctly typed where raw cells are only `AggregateScalar`.
Influence now lives only on the goal row and orient only on the body row: the grouped model's
member-side `influence` spelling is withdrawn with the grouped model, and the closed body schema
refuses it by name.

**D5 — Output identity and order.** Output rows are one row per body member, `id` is the member
id, cells are `rotation` (plus `rotationX`/`rotationY` in 3D) and the existing optional
`residual`/`atBound`, in the canonical root-first order of `topology.rows`. `outputRows` in both
plugins stays byte-identical; the adapter builds the member array in canonical order, so the
output order follows.

_Why:_ completion plan sections 3.2 and 3.3. The member array order is also what `solveChain` sees,
and the solver is already order-deterministic by canonical sort, so feeding it the canonical order
changes no digit.

**D6 — Golden values are frozen, not regenerated.** The transport tests assert literal values
captured from the unmodified plugins, with `toEqual`. If an exact assertion fails, the adapter
changed the numbers: find the divergence. Do not loosen to `toBeCloseTo`, and do not capture fresh
expected values from the migrated code. When this document and the existing test files disagree on
a literal, the existing test file and the D11 fixture win; the first draft of this plan carried one
mistyped digit in the 3D golden (section 12).

_Why:_ completion plan section 10: expected values come from the frozen pre-redesign solver, never
from the migrated code, and quality kind, iteration count, bound flags, row ids and output names
remain exact. Its absolute `1e-6` transport tolerance is the ceiling for a proven transport
artifact, not a license: identical inputs produce identical doubles, so a failing `toEqual` is a
divergence to explain before any tolerance is invoked. The scratch execution compared 29 cases
between the old and new transports and every one was bit-identical.

**D7 — The pending ledger does not shrink in these slices.** Remove no entry from
`test/pending.json` and edit no pending test file. Every Phase 5 entry's exact test still
exercises the grouped member-graph or the legacy path; none of them passes "under the aggregate
architecture" as its exact test, and a similarly named new test passing is explicitly not a
removal reason (completion plan section 10). Leave the file untouched.

**D8 — The app consequence is recorded, not fixed.** From slice 2 until slice 7, the app's grouped
project (`apps/pose-gap-filler/src/rig/rig.ts`) no longer loads at runtime: its `members` slot is
refused as `slot-unknown`. No gate covers that load (every such test is pending), typecheck stays
green, and slice 7 owns the migration. Record the consequence in the pull request body and in the
`docs/SESSION-STATUS.md` rewrite. Do not touch the app.

**D9 — No new discriminated union is introduced.** The closed unions these slices read
(`JointLimit`, `JointLimit3d`, `AggregateTopologyErrorKind`, `SolveQuality`) are each read through
their existing single owner, and the new goal refusals extend the landed closed error-kind union
rather than adding stringly diagnostics. `slotSpec` switches over the two-arm `ValueSpec` union
without a default, so a third arm would fail typecheck. Do not build a found/missing row union for
the goal lookup: `readGoalTargets` guarantees every leaf is addressed, so a missing arm would be
validation for a state that cannot occur. The first genuinely beneficial lookup union arrives in
slice 4 (FK's solved-row selection), where missing is reachable.

**D10 — The graph needs nothing from these slices.** An aggregate IK project loads and publishes
today: the v5 `PluginCatalog.capabilityOf` answers `undefined`, so every grouped-solver rule stays
silent, and `resolveSolvers` classifies a solver by a `root` edge, which an aggregate node does not
have, so it is skipped without a diagnostic. This was run, not inferred: AI-7 through AI-10 and
AJ-12 load aggregate projects through the real `Engine` with no change under `packages/core/src`.
Deleting the fan-in machinery is slice 6.

**D11 — Captured twins fixture.** Completion plan section 10 requires numerical equivalence from
literal values captured from the frozen pre-redesign solver. The two inline goldens in section 4
pin one rig per dimension; they leave most of the new transport decoders unpinned (pivot, 2D joint
limit, 2D goal influence, 3D rest, hinge and swing-twist limits, serial recovery, base-level
branching, root offsets). A wrong cell name in any of those would pass every inline case.
`packages/plugins/test/fixtures/ik-aggregate-goldens.json` closes that gap: 29 cases (12 for `ik`,
17 for `ik3d`), each stored in aggregate form with the expected output captured by running its
grouped twin through the unmodified plugins at `189ec53`.

- sha256: `2f963ee4ebec8ec24ed57428b43be068a8a21b6e240b6dd4d3a298d434a319c2`.
- It is committed before slice 2 and never regenerated. Once `ik.ts` changes the old plugin is
  gone, so a regeneration could only capture the migrated code, which section 10 of the completion
  plan forbids.
- Tests read it with `readFileSync` and `new URL(..., import.meta.url)` (the exact line is in
  5.4), so no `resolveJsonModule` change is needed.
- A case added later is captured from a scratch checkout of `189ec53` and appended in its own
  commit.

**D12 — Evidence case-id series.** `AI` (2D transport), `AJ` (3D transport) and `GT` (goal join)
are new series. `AI-1` is series-shaped, so the gate
`packages/core/test/unit/scripts/evidence-case-ids.test.ts` ("names every series the tree declares,
or refuses the id it cannot match") fails the full suite until `CASE_TITLE` lists the prefix. The
scratch run failed with exactly the 20 ungated `AI-` and `GT-` ids. Widen the alternation in the
same commit as the red tests, as ADR-034, ADR-035 and ADR-046 did: slice 2 adds `AI` and `GT`,
slice 3 adds `AJ`, because nothing is reserved for a series that does not exist yet (ADR-035).
Insert each two-letter prefix beside the existing two-letter ones, before the single letters. This
is a test file, not core source, so the read budget does not apply, and it is the only
`packages/core` path either slice touches.

Alternative considered and rejected: titles without a series-shaped id. The gate then cannot see
the citation, and a citation the gate cannot see is not enforced (ADR-034). `AI3-n` is not an
option either: it is not series-shaped, so it would be silently ungated.

**D13 — Status wording.** `session-status-shape.test.ts` refuses a bullet whose label states a
phase, and its `PHASE_LABEL` pattern also matches `Phase 5's` because a non-word character may
follow the number. The first draft's bullets failed it. The bullets in 5.6 and 6.5 carry no phase
label; they may mention "Phase 5" later in the line, as the pending counts do. Refresh the
`Captured` and `Read against` lines too: they are claims, and the gate cannot check them.

## 4. Worked example and frozen goldens

### 4.1 The 2D golden fixture

This is the current `ik-explicit-graph.test.ts` rig re-expressed as aggregate tables. The members
are the same SolveMembers the grouped adapter built, so the frozen output is the same bytes.

```ts
const BODY = [
  { id: "upper", cells: { length: 50, rotation: 0 } },
  { id: "left", cells: { parentId: "upper", length: 35, rotation: 0 } },
  { id: "right", cells: { parentId: "upper", length: 30, rotation: 0 } },
];

const GOALS = [
  { id: "goal-left", cells: { memberId: "left", x: 60, y: 20 } },
  { id: "goal-right", cells: { memberId: "right", x: 20, y: 45 } },
];

function input(
  values: { flip?: boolean; inspect?: boolean } = { inspect: true },
  chain: unknown = BODY,
  goals: unknown = GOALS,
) {
  return {
    values,
    requires: {
      chain: { values: chain },
      goals: { values: goals },
      base: { values: { x: 0, y: 0, rotation: 0 } },
    },
  } as never;
}
```

`ikPlugin.transform(input(), { nodeId: "rig/solve", progress: 0 })` must return, byte for byte:

```ts
{
  values: [
    { id: "upper", cells: { rotation: 41.46385313134519 } },
    { id: "left", cells: { rotation: -71.65213085796591, residual: 8.933478708049105 } },
    { id: "right", cells: { rotation: 104.28922113217578, residual: 8.867337495171705 } },
  ],
  inspect: { kind: "conflicted", residual: 8.933478708049105, iterations: 15, atBound: false },
}
```

Notes for the equivalence: the old fixture authored `parentId: "root"` on `upper` and a synthetic
root row; the aggregate fixture omits `parentId` and the row is gone, and `base: ""` names no
member exactly as `"root"` named no member. The old member records carried no `rotation`; the 2D
body spec requires it, so the fixture authors `rotation: 0`, which the solve never reads (the
rest blend is FK's question, ADR-055). Both differences are inert to the solver; the scratch
execution reproduced these literals exactly.

### 4.2 The 3D golden fixture

The current `ik3d-explicit-graph.test.ts` rig as aggregate tables:

```ts
const BODY = [
  { id: "upper", cells: { length: 50 } },
  { id: "left", cells: { parentId: "upper", length: 35, orient: 0.5 } },
  { id: "right", cells: { parentId: "upper", length: 30 } },
];

const GOALS = [
  {
    id: "goal-left",
    cells: { memberId: "left", x: 60, y: 20, z: 15, rotation: 20, rotationX: 10, rotationY: -5 },
  },
  {
    id: "goal-right",
    cells: { memberId: "right", x: 20, y: 45, z: -10, rotation: -15, rotationX: 5, rotationY: 12 },
  },
];

const ROOT = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
const POLE = { x: 0, y: 0, z: 100, rotation: 0, rotationX: 0, rotationY: 0 };
```

`ik3dPlugin.transform` over those tables, with `inspect: true` and the pole bound, must return,
byte for byte (the `right` row's `rotationY` ends `...541563047`; the first draft of this plan
mistyped it):

```ts
{
  values: [
    {
      id: "upper",
      cells: { rotation: 47.94788147707375, rotationX: -9.188321161983323, rotationY: -20.485921095523413 },
    },
    {
      id: "left",
      cells: {
        rotation: -78.17064980808543,
        rotationX: -10.718483974408471,
        rotationY: 16.994835153116618,
        residual: 0.0007279889169279709,
      },
    },
    {
      id: "right",
      cells: {
        rotation: 44.659667843445554,
        rotationX: 37.67187209567497,
        rotationY: 79.42085541563047,
        residual: 0.0008097659902506232,
      },
    },
  ],
  inspect: {
    kind: "converged",
    residual: 0.0008097659902506232,
    iterations: 23,
    atBound: false,
  },
}
```

The old fixture authored `rotation: 0, rotationX: 0, rotationY: 0` on every member; the 3D body
spec makes them optional and `readEuler3d` reads absence as zero, so omitting them is the same
`rest`. A pole authored with only `x`, `y`, `z` is accepted by the optional `FRAME` slot and
solves identically to the six-field pole.

### 4.3 The engine project

Both slices prove one aggregate project end to end. The 2D shape (the 3D slice mirrors it with
`ik3d`, the 3D specs and a pole record track). Build it from one function taking the track ids, the
goal `x` and the motion id, so AI-8 and AI-9 reuse it:

```ts
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { ikPlugin } from "../../src/ik";
import { BODY_2D_SPEC, GOALS_2D_SPEC } from "../../src/aggregate-topology";

const project: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "aggregate-ik",
  motions: [
    {
      id: "demo",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", input: { values: { x: 0, y: 0, rotation: 0 } } },
        {
          id: "body",
          input: {
            schema: BODY_2D_SPEC,
            values: [
              { id: "trunk", cells: { length: 20, rotation: 0 } },
              { id: "left-upper", cells: { parentId: "trunk", length: 10, rotation: 0 } },
              { id: "left-lower", cells: { parentId: "left-upper", length: 10, rotation: 0 } },
            ],
          },
        },
        {
          id: "goals",
          input: {
            schema: GOALS_2D_SPEC,
            values: [{ id: "left-hand", cells: { memberId: "left-lower", x: 12, y: 8 } }],
          },
        },
        {
          id: "solve",
          plugin: "ik",
          input: {
            values: { flip: false },
            requires: { chain: "body", goals: "goals", base: "root" },
          },
        },
      ],
    },
  ],
};

const plugins = new PluginCatalog();
plugins.registerAll([ikPlugin]);
const handle = new Engine({
  clock: createManualClock(),
  interpolator: createFakeInterpolator(),
  scheduler: createFakeScheduler(),
  plugins,
}).load(project);
for (const id of ["demo/root", "demo/body", "demo/goals", "demo/solve"]) handle.mount(id);
handle.seek("demo/solve", 0);
```

Read the published table with `handle.get("demo/solve")`, require `status === "ready"`, and take
`outputs.values`. Mounting alone does not publish the solve node; the `seek` does. The project's
producers declare the static `BODY_2D_SPEC` and `GOALS_2D_SPEC`, which is what applies the
static-cell rules and refuses an unknown cell such as `memberId` on a body row as
`cell-form-invalid`. The `base` record needs no schema: an authored record proves its fields
required, which satisfies `ROOT_2D_SPEC` in the slot check.

### 4.4 Captured twins and the capture rule

The D11 fixture is read by AI-12 and AJ-10. Its shape is one object per plugin id:

```text
{ provenance, ik: { <case>: { input, expected } }, ik3d: { <case>: { input, expected } } }
```

`input` holds `body`, `goals`, `base` and optionally `pole` and `values`; `expected` is the whole
`transform` result. Any numerical case beyond the fixture is captured from a scratch checkout of
`189ec53` by running its grouped twin once and freezing the printed values. Never capture from the
migrated code.

## 5. Slice 2 — aggregate 2D IK

**Owner:** `packages/plugins/src/ik.ts` and the aggregate 2D IK tests.

**Files this slice may change, and no others:**

```text
packages/plugins/src/aggregate-topology.ts
packages/plugins/src/ik.ts
packages/plugins/test/unit/aggregate-topology.test.ts
packages/plugins/test/integration/ik-explicit-graph.test.ts   (deleted)
packages/plugins/test/integration/ik-aggregate.test.ts        (added)
packages/core/test/unit/scripts/evidence-case-ids.test.ts     (AI and GT added to CASE_TITLE)
docs/SESSION-STATUS.md
```

`packages/plugins/test/fixtures/ik-aggregate-goldens.json` already exists at the start of this slice
(D11); it is read, never edited.

### 5.1 Step order

0. Step 0 gate. Run, and stop if any result differs:

   ```text
   git status --short
   sha256sum packages/plugins/test/fixtures/ik-aggregate-goldens.json
   grep -c '"expected"' packages/plugins/test/fixtures/ik-aggregate-goldens.json
   ```

   The first prints nothing, the second prints the D11 sha256, the third prints `29`.

1. Run the previous slice's exit checks at the current head and record them, one at a time and in
   this order: `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`. Record
   `git rev-parse HEAD` and `git status --short`.
2. Write `packages/plugins/test/integration/ik-aggregate.test.ts` first, with the cases in 5.4,
   against the contract in D1, the goldens in 4.1 and the fixture. Add the GT cases to
   `packages/plugins/test/unit/aggregate-topology.test.ts` and add `AI` and `GT` to `CASE_TITLE`.
3. Run `npx vitest run packages/plugins/test/integration/ik-aggregate.test.ts
packages/plugins/test/unit/aggregate-topology.test.ts` against the old plugin. Every new case
   fails (13 `AI-` cases and 9 `GT-` cases; the six Slice 1 topology tests still pass). Save that
   output verbatim: it is the failing-first behavior evidence for the pull request. A typecheck
   failure alone is not evidence.
4. Implement the `aggregate-topology.ts` additions in 5.2, then the `ik.ts` rewrite in 5.3.
5. Run the focused files until green.
6. Format the slice's files: `npx prettier --write` on exactly the paths that still exist (the
   deleted test file excepted). Then run the full gates in section 8, in that order. `typecheck`
   covers test files: a bad cast inside a new test fails it, so do not skip it because the vitest
   run was green.
7. Run the exit checks in section 10 (the grep checklist and mutants M1 through M7).
8. Commit, then write the pull request body and the status rewrite (5.5 and 5.6), then the
   checkpoint comment (section 9).

### 5.2 `aggregate-topology.ts` additions

Three additions, all taken from code that ran green. First, extend the closed error-kind union:

```ts
  | "row-unreachable"
  | "goal-table-shape"
  | "goal-row-shape"
  | "goal-row-id"
  | "goal-empty"
  | "goal-member-unknown"
  | "goal-member-not-leaf"
  | "goal-member-duplicate"
  | "goal-leaf-unaddressed";
```

Second, insert the following directly after the `POSE_3D_SPEC` export and before
`compareCodeUnits`. It holds the slot-side specs (D1) and the external-base marker (D2):

```ts
type FieldMap = Extract<ValueSpec, { readonly kind: "record" }>["fields"];

function withoutStatic(fields: FieldMap): FieldMap {
  return Object.fromEntries(
    Object.entries(fields).map(([name, field]) => {
      const { static: _local, ...slotField } = field;
      return [name, slotField];
    }),
  );
}

/**
 * The slot-side reading of an authored spec: the same fields with the local-input-only `static`
 * flag removed. Core refuses `static` inside a dependency slot's output spec, and the slot check
 * compares kinds and field presence, never staticness, so one field list serves both sides.
 */
export function slotSpec(spec: ValueSpec): ValueSpec {
  switch (spec.kind) {
    case "table":
      return {
        ...spec,
        schema: {
          ...spec.schema,
          row: { ...spec.schema.row, fields: withoutStatic(spec.schema.row.fields) },
        },
      };
    case "record":
      return { ...spec, fields: withoutStatic(spec.fields) };
  }
}

export const BODY_2D_SLOT = slotSpec(BODY_2D_SPEC);
export const BODY_3D_SLOT = slotSpec(BODY_3D_SPEC);
export const GOALS_2D_SLOT = slotSpec(GOALS_2D_SPEC);
export const GOALS_3D_SLOT = slotSpec(GOALS_3D_SPEC);

/**
 * The node a member hangs from when its `parentId` is absent: the external base frame.
 *
 * The empty string is the one id this module refuses as a body row id, so no authored row can
 * collide with it, and every solver walk already treats a base naming no member as the external
 * root, exactly as the pre-aggregate authored `parentId: "root"` spelling did.
 */
export const EXTERNAL_BASE = "";
```

Third, append the goal join (D3) at the end of the file. The row reader is module-private and the
function is the only new join; the landed body error vocabulary is untouched, because the two
readers' closed kind sets are different unions and threading kinds through one reader would couple
them for fifteen saved lines. Duplicate goal row ids are not re-checked here: row-id uniqueness is
the authored table validator's question (completion plan section 5.2), and two rows with the same
id targeting different members are two legal goals.

```ts
function readGoalRow(value: unknown, index: number): AggregateRow {
  if (!isRecord(value) || typeof value.id !== "string" || !isRecord(value.cells))
    throw new AggregateTopologyError(
      "goal-row-shape",
      `Goal row at index ${index} must have id and cells.`,
    );
  if (value.id.length === 0)
    throw new AggregateTopologyError("goal-row-id", `Goal row at index ${index} has an empty id.`);
  const cells: Record<string, AggregateScalar> = {};
  for (const [name, cell] of Object.entries(value.cells)) {
    if (!isScalar(cell))
      throw new AggregateTopologyError(
        "goal-row-shape",
        `Goal row '${value.id}' has a non-scalar cell '${name}'.`,
        [value.id],
      );
    cells[name] = cell;
  }
  return { id: value.id, cells: Object.freeze(cells) };
}

export function readGoalTargets(
  topology: AggregateTopology,
  value: unknown,
): ReadonlyMap<string, AggregateRow> {
  if (!Array.isArray(value))
    throw new AggregateTopologyError("goal-table-shape", "Aggregate goal values must be a table.");
  const rows = value.map(readGoalRow);
  if (rows.length === 0)
    throw new AggregateTopologyError(
      "goal-empty",
      "Aggregate goal table has no rows; a solver with no goals is refused.",
      topology.leaves,
    );
  const leafSet = new Set(topology.leaves);
  const byMember = new Map<string, AggregateRow>();
  for (const row of rows) {
    const member = row.cells.memberId;
    if (typeof member !== "string" || member.length === 0)
      throw new AggregateTopologyError(
        "goal-row-shape",
        `Goal row '${row.id}' must name a non-empty memberId.`,
        [row.id],
      );
    if (!topology.byId.has(member))
      throw new AggregateTopologyError(
        "goal-member-unknown",
        `Goal row '${row.id}' targets unknown member '${member}'.`,
        [row.id, member],
      );
    if (!leafSet.has(member))
      throw new AggregateTopologyError(
        "goal-member-not-leaf",
        `Goal row '${row.id}' targets member '${member}', which is not a leaf.`,
        [row.id, member],
      );
    if (byMember.has(member))
      throw new AggregateTopologyError(
        "goal-member-duplicate",
        `Two goal rows target member '${member}'.`,
        [member],
      );
    byMember.set(member, row);
  }
  for (const leaf of topology.leaves)
    if (!byMember.has(leaf))
      throw new AggregateTopologyError(
        "goal-leaf-unaddressed",
        `Body leaf '${leaf}' has no goal.`,
        [leaf],
      );
  return byMember;
}
```

`aggregate-topology.ts` ends near 16,200 bytes, under the 30,000-byte sister-document threshold,
and it is not under `packages/core/src`.

### 5.3 The `ik.ts` rewrite

Replace the whole file. The helpers `INSPECT`, `flatRecord`, `recordOutput` and `outputRows` are
the current ones, unchanged; the local `MEMBER`, `ROOT`, `GOAL`, `SOLVED_ROW` specs, `recordsOutput`,
`rootOutput`, `stringField`, `optionalStringField`, `memberRows`, `rootFrame` and the map-output
types are gone.

```ts
import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  BODY_2D_SLOT,
  EXTERNAL_BASE,
  GOALS_2D_SLOT,
  ROOT_2D_SPEC,
  SOLVED_2D_SPEC,
  readAggregateTopology,
  readGoalTargets,
  type AggregateRow,
  type AggregateTopology,
} from "./aggregate-topology";
import { readFrame, readNumber, readPivotOffset } from "./frame";
import type { SolveMember } from "./ik-member";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { solveChain } from "./ik-solve";

const INSPECT: ValueSpec = {
  kind: "record",
  fields: {
    kind: { kind: "string" },
    residual: { kind: "number" },
    iterations: { kind: "number" },
    atBound: { kind: "boolean" },
  },
};

type FlatRecord = Readonly<Record<string, number | string | boolean>>;

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`IK requires a record at ${path}.`);
  return value as FlatRecord;
}

function recordOutput(outputs: Outputs, path: string): FlatRecord {
  const values = outputs.values;
  if (
    values === undefined ||
    Array.isArray(values) ||
    values === null ||
    typeof values !== "object"
  )
    throw new TypeError(`IK requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function solveMembers(
  topology: AggregateTopology,
  goals: ReadonlyMap<string, AggregateRow>,
): readonly SolveMember[] {
  return topology.rows.map((row): SolveMember => {
    const goal = goals.get(row.id);
    const limit = readJointLimit(row.cells);
    const influence = goal === undefined ? undefined : readInfluence(goal.cells);
    return {
      id: row.id,
      base: topology.parentById.get(row.id) ?? EXTERNAL_BASE,
      length: readNumber(row.cells.length),
      pivot: readPivotOffset(row.cells),
      ...(goal === undefined ? {} : { goal: readFrame(goal.cells) }),
      ...(limit.kind === "range" ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
    };
  });
}

function outputRows(result: ReturnType<typeof solveChain>, members: readonly SolveMember[]) {
  const atBound = result.quality.kind === "limited" ? new Set(result.quality.atBound) : undefined;
  return members.map((member) => ({
    id: member.id,
    cells: {
      rotation: result.rotations[member.id] ?? 0,
      ...(result.residuals[member.id] === undefined
        ? {}
        : { residual: result.residuals[member.id] }),
      ...(atBound?.has(member.id) === true ? { atBound: true } : {}),
    },
  }));
}

export const ikPlugin: IdentifiedPluginDefinition = {
  id: "ik",
  inputs: {
    values: {
      kind: "record",
      fields: {
        flip: { kind: "boolean", optional: true },
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: { outputs: { values: BODY_2D_SLOT } },
      goals: { outputs: { values: GOALS_2D_SLOT } },
      base: { outputs: { values: ROOT_2D_SPEC } },
    },
  },
  outputs: { values: SOLVED_2D_SPEC, inspect: { ...INSPECT, optional: true } },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const goals = readGoalTargets(topology, (requires.goals as Outputs).values);
    const members = solveMembers(topology, goals);
    const result = solveChain(
      readFrame(recordOutput(requires.base as Outputs, "base")),
      members,
      local.flip === true,
    );
    const inspection = inspectSolve(result);
    return {
      values: outputRows(result, members),
      ...(local.inspect === true
        ? {
            inspect: {
              kind: inspection.kind,
              residual: inspection.residual,
              iterations: inspection.iterations,
              atBound: inspection.atBound.length > 0,
            },
          }
        : {}),
    };
  },
};
```

The `limit.kind === "range"` narrowing reads the two-arm `JointLimit` union at its one reader;
`free` contributes nothing and no third arm exists to fall through (D9).

### 5.4 Test cases

`packages/plugins/test/unit/aggregate-topology.test.ts`, a new `describe("aggregate goal
targets")` reusing the file's `body` and `errorOf` helpers, and importing `readGoalTargets`,
`slotSpec`, `BODY_2D_SLOT`, `GOALS_2D_SLOT` and `EXTERNAL_BASE`:

- GT-1 a leaf-addressed goals table returns a member-id-to-row map preserving ids and cells.
- GT-2 a non-array is refused as `goal-table-shape`.
- GT-3 an empty goals table is refused as `goal-empty` with the leaf ids.
- GT-4 a row without id/cells is `goal-row-shape`; an empty id is `goal-row-id`.
- GT-5 a goal for an unknown member is `goal-member-unknown` with both ids.
- GT-6 a goal for a non-leaf member is `goal-member-not-leaf`.
- GT-7 two goal rows targeting one member are `goal-member-duplicate`.
- GT-8 an unaddressed leaf is `goal-leaf-unaddressed` naming the first such leaf in canonical
  order.
- GT-9 `slotSpec` removes `static` and nothing else: for the body and goals specs it keeps every
  field name and every other field fact, never carries `static`, returns the root record spec
  unchanged, and `EXTERNAL_BASE` is `""` and is refused as a body row id.

`packages/plugins/test/integration/ik-aggregate.test.ts`. Direct `transform` calls use the 4.1
helpers and the context `{ nodeId: "rig/solve", progress: 0 }`; engine cases use the 4.3 project
built by one function.

- AI-1 contract: `requires` has exactly the keys `chain`, `goals`, `base`, in that order; no slot
  declares `binding`; `requires.members` is undefined; the outputs are exactly `values` and
  `inspect`, and `inspect` is optional.
- AI-2 golden: the 4.1 fixture returns the frozen rows and inspect record with `toEqual`.
- AI-3 reorder invariance: the same body rows in reverse authored order return the golden.
- AI-4 goal validation through the transform: each malformed goals table of GT-2 through GT-8 makes
  `transform` throw an `AggregateTopologyError` whose `kind` matches. Build each by mutating the 4.1
  `GOALS`.
- AI-5 rest edit: `length: 45` on `upper` produces different rows than the golden.
- AI-6 inspection and flip: without `inspect` the result has no `inspect` key; a two-bone fixture
  with the goal in reach and off the straight line publishes different finite leaf rotations for
  `flip: true` versus `flip: false`.
- AI-7 engine golden path: the 4.3 project loads, `handle.get("demo/solve")` is ready, and its
  `outputs.values` ids are exactly `["trunk", "left-upper", "left-lower"]` with finite rotations.
- AI-8 renamed sources: the same project with track ids `origin`, `skeleton`, `targets` and a
  different motion id publishes identical `outputs.values`.
- AI-9 animated values: a project whose goal `x` is `[{ p: 0, v: 12 }, { p: 1, v: 30 }]`;
  `handle.seek("demo/goals", 0)` then `1` publish different rows, and the progress-1 answer equals
  the static `x: 30` project's answer.
- AI-10 one solver invocation and one publish per value batch. It counts real solver calls through
  a module mock that wraps `solveChain` and delegates to the original, and does not count patches
  alone. Place this at the top of the file, after the imports:

  ```ts
  const solver = vi.hoisted(() => ({ calls: 0 }));
  vi.mock("../../src/ik-solve", async (importOriginal) => {
    const original = await importOriginal<typeof import("../../src/ik-solve")>();
    return {
      ...original,
      solveChain: (...args: Parameters<typeof original.solveChain>) => {
        solver.calls += 1;
        return original.solveChain(...args);
      },
    };
  });
  ```

  and the case:

  ```ts
  it("AI-10 runs the solver once and publishes once per value batch", () => {
    const handle = open(project());
    const before = solved(handle);
    const revision = handle.get("demo/solve")!.revision;
    const calls = solver.calls;
    const seen: unknown[] = [];
    const off = handle.subscribeNode("demo/solve", (patch) => seen.push(patch));
    handle.values((tx) => {
      tx.track("demo/body").input.values.setField({ row: "trunk", field: "length" }, 25);
    });
    off();
    expect(solver.calls - calls).toBe(1);
    expect(seen).toHaveLength(1);
    expect(handle.get("demo/solve")!.revision).toBe(revision + 1);
    expect(solved(handle)).not.toEqual(before);
  });
  ```

- AI-11 the old shape is refused by name at load: a solve track authoring
  `requires: { members: { upper: "body" }, root: "root", goals: { left: "goals" } }` throws a
  message matching `/slot-unknown at demo\/solve/`; one whose `goals` slot is a dict matches
  `/slot-binding-mode at demo\/solve/`; a body row with a `memberId` cell matches
  `/cell-form-invalid .*memberId/`; a goal row with a `goalId` cell matches
  `/cell-form-invalid .*goalId/`. Each edits a `structuredClone` of the 4.3 project.
- AI-12 every captured twin of the D11 fixture reproduces bit for bit (D6, D11):

  ```ts
  it("AI-12 reproduces every case captured from the grouped plugin bit for bit", () => {
    expect(Object.keys(GOLDENS).length).toBeGreaterThanOrEqual(12);
    for (const [name, { input: twin, expected }] of Object.entries(GOLDENS)) {
      const result = ikPlugin.transform(
        {
          values: twin.values ?? { inspect: true },
          requires: {
            chain: { values: twin.body },
            goals: { values: twin.goals },
            base: { values: twin.base },
          },
        } as never,
        CTX,
      );
      expect({ name, result }).toEqual({ name, result: expected });
    }
  });
  ```

  with the fixture read once at the top of the file:

  ```ts
  const GOLDENS = JSON.parse(
    readFileSync(new URL("../fixtures/ik-aggregate-goldens.json", import.meta.url), "utf8"),
  ).ik as Record<string, { input: any; expected: unknown }>;
  ```

- AI-13 a member named `root` or `base` is an ordinary row (D2):

  ```ts
  it("AI-13 treats a member named root or base as an ordinary row", () => {
    const named = [
      { id: "root", cells: { length: 50, rotation: 0 } },
      { id: "base", cells: { parentId: "root", length: 35, rotation: 0 } },
    ];
    const plain = [
      { id: "a", cells: { length: 50, rotation: 0 } },
      { id: "b", cells: { parentId: "a", length: 35, rotation: 0 } },
    ];
    const goalFor = (member: string) => [{ id: "g", cells: { memberId: member, x: 60, y: 20 } }];
    const rotations = (chain: typeof named, goal: string) => {
      const rows = ikPlugin.transform(input(undefined, chain, goalFor(goal)), CTX)
        .values as unknown as readonly { cells: unknown }[];
      return rows.map((row) => row.cells);
    };
    expect(rotations(named, "base")).toEqual(rotations(plain, "b"));
  });
  ```

### 5.5 Commit

```text
refactor(plugins): migrate 2d ik to aggregate tables

Slice 2 replaces the member-map transport with the aggregate contract: `ik` reads one body
table through `chain`, one goals table through `goals`, and one base record through `base`,
validates goals through the shared `readGoalTargets` join, and publishes the same solved rows
byte for byte. The external base is the empty string, the one id the topology reader refuses
as a row id, so no authored row can collide with it. Slot specs are derived from the authored
specs with `static` removed, because core refuses `static` inside a slot.

Evidence: <red run against the old plugin>, aggregate IK <N> tests, goal join <M> tests, 12
captured twins from 189ec53, full suite <files>/<tests>, typecheck, format:check, boundaries
passed. Mutants M1 through M7 each failed the named test. The app's grouped rig no longer loads
until slice 7; every test that loads it is pending. No pending entries removed.
```

The pull request body states: the exact head; the invariant (one body table in, one solved table
out, row identity preserved, no hidden member state); the single owner; the red evidence with the
command and observed failures; every gate command and result; the frozen goldens with their
provenance (the previous `ik-explicit-graph.test.ts` and the D11 fixture); decisions D1 through D13
by name with one line each; what was withdrawn (map slots, member-side `influence`, the `goalId`
field, the synthetic root row) and why; changed and deleted paths, including the one
`CASE_TITLE` widening; the mutant results; the `bench:ik` limitation (section 8); and the D8 app
consequence.

### 5.6 Status rewrite

Rewrite `docs/SESSION-STATUS.md` (replace, never append). Update the `Captured` date and the `Read
against` line, then replace the single **Now** entry and the single **Next in line** entry. No
bullet label may state a phase (D13). The **Now** bullet after this slice:

```text
- **2D IK reads aggregate tables:** `ik` takes one body table, one goals table and one base
  record through single-source slots, validates goals through the shared aggregate join, and
  publishes the same solved rows byte for byte. Grouped authoring is refused by name at load, so
  the app's grouped rig no longer loads until its slice migrates it. No pending ledger entries
  were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.
```

The **Next in line** bullet:

```text
- **Aggregate 3D IK:** the same chain, goals and base contract for `ik3d`, preserving pole,
  joint, orientation, influence and inspection behavior.
```

Keep the other sections as they are unless this slice made one stale.

## 6. Slice 3 — aggregate 3D IK

**Owner:** `packages/plugins/src/ik3d.ts` and the aggregate 3D IK tests.

Start only after slice 2 is committed and green. Its files, and no others:

```text
packages/plugins/src/ik3d.ts
packages/plugins/test/integration/ik3d-explicit-graph.test.ts   (deleted)
packages/plugins/test/integration/ik3d-aggregate.test.ts        (added)
packages/core/test/unit/scripts/evidence-case-ids.test.ts       (AJ added to CASE_TITLE)
docs/SESSION-STATUS.md
```

`aggregate-topology.ts` is not in this slice's file list: slice 2 landed the shared join, the slot
constants and `EXTERNAL_BASE`, and a gap discovered here is an allocation correction to record and
fix in its own right, not a silent edit.

### 6.1 Step order

1. Re-run slice 2's exit checks and the Step 0 gate of 5.1, and record head and status.
2. Write `ik3d-aggregate.test.ts` first (cases in 6.3) and add `AJ` to `CASE_TITLE`. Run it against
   the unmodified `ik3d` and save the red output: all 12 `AJ-` cases fail.
3. Rewrite `ik3d.ts` (6.2).
4. Green the focused file, format the slice's paths, run the full gates (section 8), in order.
5. Run the exit checks in section 10 (the grep checklist and mutants M8 through M15).
6. Commit, pull request body, status rewrite, checkpoint.

### 6.2 The `ik3d.ts` rewrite

Replace the whole file. Kept unchanged from the current file: `INSPECT`, `flatRecord`,
`recordOutput`, `outputRows` and the `FRAME` pole spec. Gone: the local `MEMBER`, `ROOT`, `GOAL`,
`SOLVED_ROW` specs, `recordsOutput`, `rootOutput`, `stringField`, `optionalStringField`,
`memberRows`, `rootFrame` and the map types.

```ts
import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  BODY_3D_SLOT,
  EXTERNAL_BASE,
  GOALS_3D_SLOT,
  ROOT_3D_SPEC,
  SOLVED_3D_SPEC,
  readAggregateTopology,
  readGoalTargets,
  type AggregateRow,
  type AggregateTopology,
} from "./aggregate-topology";
import { readNumber } from "./frame";
import { readEuler3d, readFrame3d, readPivotOffset3d } from "./frame3d";
import type { Euler3d } from "./frame3d";
import { readInfluence } from "./ik-goal";
import { inspectSolve } from "./ik-result";
import { readPole3d } from "./ik3d-analytic";
import { constrains, readJointLimit3d } from "./ik3d-constraint";
import { readOrient } from "./ik3d-orient";
import type { ChainMember3d } from "./ik3d-chain";
import { solveChain3d } from "./ik3d-solve";

const FRAME: ValueSpec = {
  kind: "record",
  fields: {
    x: { kind: "number" },
    y: { kind: "number" },
    z: { kind: "number" },
    rotation: { kind: "number", optional: true },
    rotationX: { kind: "number", optional: true },
    rotationY: { kind: "number", optional: true },
  },
};

const INSPECT: ValueSpec = {
  kind: "record",
  fields: {
    kind: { kind: "string" },
    residual: { kind: "number" },
    iterations: { kind: "number" },
    atBound: { kind: "boolean" },
  },
};

type FlatRecord = Readonly<Record<string, number | string | boolean>>;

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`IK3d requires a record at ${path}.`);
  return value as FlatRecord;
}

function recordOutput(outputs: Outputs, path: string): FlatRecord {
  const values = outputs.values;
  if (
    values === undefined ||
    Array.isArray(values) ||
    values === null ||
    typeof values !== "object"
  )
    throw new TypeError(`IK3d requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function solveMembers3d(
  topology: AggregateTopology,
  goals: ReadonlyMap<string, AggregateRow>,
): readonly ChainMember3d[] {
  return topology.rows.map((row): ChainMember3d => {
    const goal = goals.get(row.id);
    const limit = readJointLimit3d(row.cells);
    const influence = goal === undefined ? undefined : readInfluence(goal.cells);
    const orient = readOrient(row.cells);
    return {
      id: row.id,
      base: topology.parentById.get(row.id) ?? EXTERNAL_BASE,
      length: readNumber(row.cells.length),
      offset: readPivotOffset3d(row.cells),
      rest: readEuler3d(row.cells),
      ...(constrains(limit) ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
      ...(orient === undefined ? {} : { orient }),
      ...(goal === undefined ? {} : { goal: readFrame3d(goal.cells) }),
    };
  });
}

function outputRows(result: ReturnType<typeof solveChain3d>, members: readonly ChainMember3d[]) {
  const atBound = result.quality.kind === "limited" ? new Set(result.quality.atBound) : undefined;
  return members.map((member) => {
    const euler: Euler3d = result.rotations3d[member.id] ?? {
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    };
    return {
      id: member.id,
      cells: {
        ...euler,
        ...(result.residuals[member.id] === undefined
          ? {}
          : { residual: result.residuals[member.id] }),
        ...(atBound?.has(member.id) === true ? { atBound: true } : {}),
      },
    };
  });
}

export const ik3dPlugin: IdentifiedPluginDefinition = {
  id: "ik3d",
  inputs: {
    values: {
      kind: "record",
      fields: {
        inspect: { kind: "boolean", optional: true, static: true },
      },
    },
    requires: {
      chain: { outputs: { values: BODY_3D_SLOT } },
      goals: { outputs: { values: GOALS_3D_SLOT } },
      base: { outputs: { values: ROOT_3D_SPEC } },
      pole: { optional: true, outputs: { values: FRAME } },
    },
  },
  outputs: { values: SOLVED_3D_SPEC, inspect: { ...INSPECT, optional: true } },
  transform({ values, requires }) {
    const local = flatRecord(values, "input.values");
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const goals = readGoalTargets(topology, (requires.goals as Outputs).values);
    const members = solveMembers3d(topology, goals);
    const pole = readPole3d(
      requires.pole === undefined ? undefined : recordOutput(requires.pole as Outputs, "pole"),
    );
    const result = solveChain3d(
      readFrame3d(recordOutput(requires.base as Outputs, "base")),
      members,
      pole,
    );
    const inspection = inspectSolve(result);
    return {
      values: outputRows(result, members),
      ...(local.inspect === true
        ? {
            inspect: {
              kind: inspection.kind,
              residual: inspection.residual,
              iterations: inspection.iterations,
              atBound: inspection.atBound.length > 0,
            },
          }
        : {}),
    };
  },
};
```

`outputRows` keeps its `Euler3d` import and body unchanged; members arrive in canonical order so
the emitted rows are too.

### 6.3 Test cases

`packages/plugins/test/integration/ik3d-aggregate.test.ts`, using the 4.2 fixture, the 3D mock
header below, and the same direct-transform helper shape as slice 2 (`inspect` defaults to true,
the pole defaults to the six-field `POLE`, and `pole: null` omits the slot):

```ts
const solver = vi.hoisted(() => ({ calls: 0 }));
vi.mock("../../src/ik3d-solve", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/ik3d-solve")>();
  return {
    ...original,
    solveChain3d: (...args: Parameters<typeof original.solveChain3d>) => {
      solver.calls += 1;
      return original.solveChain3d(...args);
    },
  };
});
```

- AJ-1 contract: `requires` has exactly the keys `chain`, `goals`, `base`, `pole`, in that order;
  `pole` is optional; no slot has a map binding; the outputs are exactly `values` and `inspect`.
  Because the key list is exhaustive, no slot can carry FK output.
- AJ-2 golden: the 4.2 fixture returns the frozen rows and inspect record with `toEqual`.
- AJ-3 reorder invariance: body rows in reverse authored order, identical rows.
- AJ-4 goal validation: the GT mutations through the 3D transform, kinds asserted.
- AJ-5 pole: with and without `requires.pole` the transform publishes three finite rows with ids
  `upper`, `left`, `right`; the optional slot's absence is not an error.
- AJ-6 joint: a two-bone fixture whose `upper` row authors
  `joint: "hinge", axisZ: 1, minRotation: 0, maxRotation: 0`, leaf `leaf` of length 35 under
  `upper` of length 50, and goal `x: 80, y: 40, z: 30`. With `inspect: true` the inspect kind is
  `limited` with `atBound: true`, and the `upper` row carries `atBound: true`. The scratch
  execution observed exactly that (residual about 23.3 after 2 iterations). If a run reports a
  different kind, report it; do not weaken the assertion.
- AJ-7 influence: the 4.2 fixture with `influence: 2` added to the `goal-left` row publishes
  different rows than without it, ids unchanged.
- AJ-8 orientation: removing `orient` from the `left` row changes the `left` row's Euler cells.
- AJ-9 identity across strategies: for the two-bone, tree (the 4.2 fixture) and constrained (AJ-6)
  fixtures, the output row ids equal the body row ids in canonical order.
- AJ-10 every captured twin of the D11 fixture reproduces bit for bit. It also reaches rest,
  pivot offsets, swing-twist, serial recovery, base-level branching and root offsets:

  ```ts
  it("AJ-10 reproduces every case captured from the grouped plugin bit for bit", () => {
    expect(Object.keys(GOLDENS).length).toBeGreaterThanOrEqual(17);
    for (const [name, { input: twin, expected }] of Object.entries(GOLDENS)) {
      const result = ik3dPlugin.transform(
        {
          values: twin.values ?? { inspect: true },
          requires: {
            chain: { values: twin.body },
            goals: { values: twin.goals },
            base: { values: twin.base },
            ...(twin.pole === undefined ? {} : { pole: { values: twin.pole } }),
          },
        } as never,
        CTX,
      );
      expect({ name, result }).toEqual({ name, result: expected });
    }
  });
  ```

  with the fixture read once at the top of the file from the `ik3d` key, as in 5.4.

- AJ-11 a member named `root` or `base` is an ordinary row (D2):

  ```ts
  it("AJ-11 treats a member named root or base as an ordinary row", () => {
    const named = [
      { id: "root", cells: { length: 50 } },
      { id: "base", cells: { parentId: "root", length: 35 } },
    ];
    const plain = [
      { id: "a", cells: { length: 50 } },
      { id: "b", cells: { parentId: "a", length: 35 } },
    ];
    const goalFor = (member: string) => [
      { id: "g", cells: { memberId: member, x: 60, y: 20, z: 15 } },
    ];
    const cells = (chain: typeof named, member: string) =>
      rowsOf(run({ chain, goals: goalFor(member), pole: null })).map((row) => row.cells);
    expect(cells(named, "base")).toEqual(cells(plain, "b"));
  });
  ```

- AJ-12 engine: a 3D aggregate project (4.3 with `ik3d`, the 3D specs, a six-field base record and
  a three-field pole record track, and no FK track at all, which is the direct proof that FK output
  is not required) loads and publishes a ready solved table with ids `upper` and `left`; the same
  project with renamed track ids and motion id publishes identical rows; an animated goal `z`
  seeked from 0 to 1 publishes different rows; one `setField` value batch on the body table makes
  exactly one real `solveChain3d` call (counted through the mock) and exactly one new patch on the
  solve node with revision plus one; a solve track authored with the old `members` slot fails
  `load` matching `/slot-unknown at demo\/solve/`.

Serial recovery, quality, pivot offsets and every strategy's numerics are preserved because the
dispatcher and strategies are untouched; AJ-10 pins the transport of each against literals from the
old plugin, and the active `ik3d-*` unit suites keep pinning the solver modules directly.

### 6.4 Commit

```text
refactor(plugins): migrate 3d ik to aggregate tables

Slice 3 repeats the aggregate contract for `ik3d`: one body table, one goals table, one base
record and an optional pole record through single-source slots, the shared goal join, and the
same Euler rows byte for byte. Pole, joint, orientation, influence and inspection behavior are
preserved; no solver module changed.

Evidence: <red run against the old plugin>, aggregate 3D IK <N> tests, 17 captured twins from
189ec53, full suite <files>/<tests>, typecheck, format:check, boundaries passed. Mutants M8
through M15 each failed the named test. No pending entries removed.
```

The pull request body follows slice 2's outline, adding the AJ-6 outcome and any allocation
correction.

### 6.5 Status rewrite

`docs/SESSION-STATUS.md` after this slice (replace, never append; refresh `Captured` and `Read
against`). **Now**:

```text
- **2D and 3D IK read aggregate tables:** `ik` and `ik3d` take one body table, one goals table
  and one base record through single-source slots, share the topology reader and goal join, and
  publish the same solved rows byte for byte. Grouped authoring is refused by name at load, so
  the app's grouped rig no longer loads until its slice migrates it. No pending ledger entries
  were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.
```

**Next in line**:

```text
- **Aggregate 2D FK:** compose one whole pose table from the body and solved tables and the base
  record.
```

## 7. Guardrails: what must not change

- No solver module: `fabrik.ts`, `fabrik-cap.ts`, `fabrik-seed.ts`, `fabrik-select.ts`,
  `ik-analytic.ts`, `ik-chain.ts`, `ik-constraint.ts`, `ik-descent.ts`, `ik-goal.ts`,
  `ik-member.ts`, `ik-result.ts`, `ik-scale.ts`, `ik-solve.ts`, `ik-topology.ts`,
  `ik3d-analytic.ts`, `ik3d-chain.ts`, `ik3d-compromise.ts`, `ik3d-constraint.ts`,
  `ik3d-fabrik.ts`, `ik3d-orient.ts`, `ik3d-result.ts`, `ik3d-seed.ts`,
  `ik3d-serial-recovery.ts`, `ik3d-solve.ts`, `frame.ts`, `frame3d.ts`.
- No other plugin: `fk.ts`, `fk3d.ts`, `pose-classify.ts`, `rig.ts`, `transform.ts`,
  `transform3d.ts`, `labels.ts`, `catalog.ts`, `identified-catalog.ts`, `loader.ts`, and
  everything under `legacy/`.
- Nothing in `packages/core/src`, `packages/three`, `packages/react`, or `apps/`. The one
  `packages/core` path either slice may touch is the test file
  `packages/core/test/unit/scripts/evidence-case-ids.test.ts`, and only to add the series prefixes
  of D12.
- The landed Slice 1 spec values (`BODY_*_SPEC`, `GOALS_*_SPEC`, `ROOT_*_SPEC`, `SOLVED_*_SPEC`,
  `POSE_*_SPEC`) are imported, never edited. The `*_SLOT` constants are derived from them, never
  hand-written.
- `test/pending.json`, every pending test file, and the D11 fixture.
- Nothing outside each slice's file list, including the other planning documents in
  `motion5-implementation-plans/`.
- Output names stay `values` and `inspect`; the main output stays `values`.
- No map bindings, no compatibility alias for `members`/`root`/`goals`, no bridge, no fallback.
- No comments restating what code says; the WHY comments on `EXTERNAL_BASE` and `slotSpec` are the
  only ones these slices should need.
- No markdown tables in anything you write; prettier is pinned, `printWidth` 100, double quotes,
  trailing commas, and prose stays on lines you broke yourself at or under 100 columns.

CORRECT and WRONG, for the four mistakes this design makes easiest:

```ts
// CORRECT: the slot reads the static-free derived spec.
chain: { outputs: { values: BODY_2D_SLOT } },
// WRONG: admission throws at registerAll, before any test runs.
chain: { outputs: { values: BODY_2D_SPEC } },

// CORRECT: a parentless member hangs from the external base.
base: topology.parentById.get(row.id) ?? EXTERNAL_BASE,
// WRONG: a member named "root" now hangs from itself.
base: topology.parentById.get(row.id) ?? "root",

// CORRECT: expected values are literals captured from the old plugin.
expect({ name, result }).toEqual({ name, result: expected });
// WRONG: loosened, or recomputed from the migrated code.
expect(result.values[0].cells.rotation).toBeCloseTo(41.46, 1);

// CORRECT: a status label with no phase in it.
// - **2D IK reads aggregate tables:** ...
// WRONG: refused by session-status-shape (the apostrophe still reads as a phase label).
// - **Phase 5's 2D IK is aggregate:** ...
```

## 8. Verification protocol

Before each slice, run the previous slice's exit checks and the Step 0 gate. During each slice, run
the focused vitest files first. After they are green, run these one at a time, in this order, and
record every result:

```text
npm run format:check
npm run typecheck
npm run test:boundaries
npm test
```

`npm run test:read-budget` is required only when a `packages/core/src` file changes; neither slice
changes one, so it is not a gate here. The scratch execution ran it anyway and it passed.
`aggregate-topology.ts` grows to about 16,200 bytes and `ik.ts` and `ik3d.ts` shrink.

`npm run bench:ik` is not run and is not a gate: `scripts/bench-ik.mjs` drives
`independentRigsProject` from `packages/plugins/test/support/ik-envelope.ts`, which authors the
retired grouped `keyframes` shape, and completion plan section 11 says to record that limitation
rather than convert it into an exemption. State it in the pull request body.

If a gate fails, fix the cause; never widen a slice, weaken an assertion, or reformat unrelated
code to make a gate pass.

## 9. Handoff and stopping point

Every slice ends with a checkpoint comment on its pull request (or, while pull requests are not
yet open, a checkpoint note in the commit body): the exact head read against, which slice and
step is in progress, what is published versus merely prepared, the exact commits and runs that
are evidence so far, what was decided and what was withdrawn, and the single next action.

After slice 3's gates pass and its commit lands, stop and report. Slices 4 and 5 (aggregate FK)
need a new instruction; do not start them, and do not open pull requests or push without being
asked. Landing both slices is this plan's deliverable, and the next move is the user's.

## 10. Exit checks

Run these after the gates are green and before the commit. They are the grep checklist and the
mutation test that the verification sequence calls for; a green suite alone does not prove the new
tests can fail.

Grep checklist. Every command below must print nothing (the diffs print nothing when empty):

```text
grep -n 'binding: "map"' packages/plugins/src/ik.ts packages/plugins/src/ik3d.ts
grep -nE "rootOutput|recordsOutput|stringField|optionalStringField|memberRows|rootFrame|MapOutput" packages/plugins/src/ik.ts packages/plugins/src/ik3d.ts
grep -nE "memberId|goalId" packages/plugins/src/ik.ts packages/plugins/src/ik3d.ts
git diff --stat 189ec53 -- packages/core/src packages/three packages/react apps test/pending.json
git diff --stat 189ec53 -- packages/plugins/src/fk.ts packages/plugins/src/fk3d.ts packages/plugins/src/rig.ts packages/plugins/src/pose-classify.ts packages/plugins/src/legacy
git diff --stat 189ec53 -- packages/plugins/src/ik-*.ts packages/plugins/src/ik3d-*.ts packages/plugins/src/fabrik*.ts packages/plugins/src/frame.ts packages/plugins/src/frame3d.ts
```

Also run `git status --short` and confirm it lists exactly the slice's files from 5 or 6, and
`grep -c "solveChain(" packages/plugins/src/ik.ts` (and `solveChain3d(` in `ik3d.ts`) prints `1`:
the import and the `ReturnType<typeof solveChain>` reference have no call parenthesis, so a `2` is
a second solver invocation.

Mutation checks. For each row below: save the file (`cp packages/plugins/src/ik.ts
<scratchpad>/ik.ts.good`), apply the one-line change with an editor, run the two aggregate IK test
files, confirm that exactly the named cases fail, then copy the saved file back. Never use `git
checkout`, `git restore` or `git stash` to revert (section 2). A mutant that survives means a
decoder or invariant has no test: stop and report instead of editing the mutant away.

```text
M1  ik.ts    pivot: readPivotOffset(row.cells)                    -> pivot: undefined
             fails: AI-12
M2  ik.ts    ...(limit.kind === "range" ? { limit } : {})         -> removed
             fails: AI-12
M3  ik.ts    influence read from goal.cells                       -> const influence = undefined as number | undefined
             fails: AI-12
M4  ik.ts    ?? EXTERNAL_BASE                                     -> ?? "root"
             fails: AI-13
M5  ik.ts    topology.rows.map(                                   -> [...topology.rows].reverse().map(
             fails: AI-2, AI-3, AI-7, AI-12
M6  ik.ts    local.flip === true                                  -> false
             fails: AI-6, AI-12
M7  ik.ts    a second solveChain(...) call before inspectSolve    -> added
             fails: AI-10
M8  ik3d.ts  offset: readPivotOffset3d(row.cells)                 -> offset: { x: 0, y: 0, z: 0 }
             fails: AJ-10
M9  ik3d.ts  rest: readEuler3d(row.cells)                         -> rest: { rotation: 0, rotationX: 0, rotationY: 0 }
             fails: AJ-10
M10 ik3d.ts  ...(orient === undefined ? {} : { orient })          -> removed
             fails: AJ-2, AJ-3, AJ-10
M11 ik3d.ts  ...(constrains(limit) ? { limit } : {})              -> removed
             fails: AJ-6, AJ-10
M12 ik3d.ts  influence read from goal.cells                       -> const influence = undefined as number | undefined
             fails: AJ-7, AJ-10
M13 ik3d.ts  requires.pole === undefined ? undefined              -> true ? undefined
             fails: AJ-2, AJ-3, AJ-10
M14 ik3d.ts  ?? EXTERNAL_BASE                                     -> ?? "root"
             fails: AJ-11
M15 ik3d.ts  a second solveChain3d(...) call before inspectSolve  -> added
             fails: AJ-12
```

Slice 2 runs M1 through M7, slice 3 runs M8 through M15. These sets were produced by running every
mutant against the code in sections 5.3 and 6.2.

## 11. Conformance with the completion plan

Each requirement of completion plan section 9 for these slices, and where this plan proves it.

Slice 2 (2D IK):

- "single dependencies `chain`, `goals`, `base`": D1, AI-1.
- "Remove `memberId` reads from body rows and `goalId` reads from goal cells": D1, D4, AI-11,
  grep checklist.
- "Adapt the complete table into the existing `SolveMember` model": 5.3.
- "preserve literal solver golden values": 4.1, AI-2, AI-12, D6, D11.
- "body-row reorder invariance": AI-3. "renamed source track ids": AI-8.
- "multiple branch goals": the 4.1 tree and the fixture's branch cases.
- "goal validation": GT-1 through GT-8, AI-4.
- "rest edits": AI-5. "animated values": AI-9. "optional inspection": AI-6.
- "one solver invocation per composition": AI-10 counts real solver calls (the first draft counted
  patches only), M7.

Slice 3 (3D IK):

- "Repeat Slice 2 for 3D": section 6.
- "Preserve pole, joint, orientation, influence, pivot, serial recovery, quality, inspection, and
  Euler output behavior": AJ-5 through AJ-8, AJ-10 for pivot, rest, swing-twist, serial recovery
  and quality kinds, and the untouched solver modules.
- "Prove that FK output is not required by the solver": AJ-1's exhaustive key list and AJ-12's
  project, which has no FK track.
- "body row identity survives every strategy": AJ-9 and AJ-10 (tree, two-bone, serial, hinge,
  swing-twist).

Completion plan section 10 and section 12:

- Literal values from the frozen solver, never from migrated code: D6, D11.
- Quality kind, iteration count, bound flags, row ids and output names exact: `toEqual` on whole
  results in AI-2, AI-12, AJ-2, AJ-10.
- The pending ledger is untouched: D7, grep checklist.
- "the graph contains only explicit aggregate dependencies": not yet claimed; slice 6 owns the
  deletion, and D10 only records that nothing in core blocks these slices.
- Deterministic call counts rather than wall-clock: AI-10, AJ-12.

## 12. Revision record

What executing both slices in a scratch copy of `189ec53` corrected in the first draft. Everything
here was observed, not inferred, except where a line says "by reading".

- Blocking: slots read `BODY_*_SPEC` and `GOALS_*_SPEC`, which carry `static`. Core's admission
  refuses `static` inside a slot output spec, so `registerAll` threw before any test ran. Fixed by
  D1 and `slotSpec`.
- Blocking at the full suite: the new `AI-` and `GT-` ids failed `evidence-case-ids.test.ts` (20
  ungated ids). Fixed by D12. `AI3-n` would have escaped the gate silently, by reading its
  patterns; renamed to the `AJ` series.
- Blocking at the full suite: the proposed status bullet, "Phase 5's 2D IK is aggregate", failed
  `session-status-shape.test.ts` ("states no phase"). Fixed by D13 and the new wording.
- The 3D golden carried one mistyped literal: `right` `rotationY` was `79.42085584563047`, the
  pinned value is `79.42085541563047`. Section 4.2 is corrected. Under D6 the typo would have
  failed a `toEqual` and invited loosening it.
- AI-10 asserted one patch and a revision bump, which proves one publish, not one solver
  invocation as completion plan section 9 requires. It now counts real solver calls (M7, M15).
- The first draft's inline cases leave pivot, 2D limit, 2D goal influence, 3D rest, pivot, swing
  twist, serial recovery and a member named `root` unpinned, by reading the case list. D11 adds 29
  captured twins; the old and new transports were bit-identical on all of them, so the adapter
  design stands unchanged. 15 mutants then each failed the intended test.
- Confirmed, no change: the blast radius (D10 and section 1), the empty-string external base
  including base-level branching, the refusal-by-name behavior of D1, the 4.1 golden, the
  `AI-9`-style animated project and `setField` batch behavior, and AJ-6's `limited` outcome.
- Added from the repository's own review format: the Step 0 gate, CORRECT and WRONG pairs, the grep
  checklist and the mutation list (section 10), and the conformance map (section 11).
- The base commit is now `189ec53`, the head that carries this plan and the earlier plan record.

Not exercised in the scratch run: the GitHub Actions workflows themselves (their local commands
were run instead), `npm run bench:ik` (section 8), and any browser build. The scratch used Node 22
while the repository declares Node 24 or later; every gate passed regardless.
