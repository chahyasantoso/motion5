# Phase 5 Slices 2 and 3: Aggregate 2D and 3D IK

**Status:** Step-by-step implementation plan for Slice 2 and Slice 3 of section 9 of
[phase5-completion-plan.md](phase5-completion-plan.md). That document remains the execution
authority for the whole phase; this one is the worked contract for the two IK slices and decides
every question the implementer would otherwise have to decide.

**Prepared:** 2026-10-27, Asia/Jakarta.

**Branch:** `refactor/v5-identified-tables`.

**Base:** commit `482d5ef3` (Slice 0 inventory and Slice 1 topology reader), plus the Slice I/J
checkpoint commit `9706ecab`, which preserved that inventory's classified working tree as found.
The tree starts clean.

## 1. What is already true

Slice 1 landed `readAggregateTopology` and the shared 2D/3D value specs in
`packages/plugins/src/aggregate-topology.ts`, tested by
`packages/plugins/test/unit/aggregate-topology.test.ts`. The reader validates one body table:
duplicate ids, unknown, self and cyclic parents, unreachable rows, canonical root-first order,
leaf and parent indexes.

The v5 `ik` and `ik3d` plugins still declare the pre-redesign contract: a `members` map slot, a
`goals` map slot, and a `root` slot that takes a table with a synthetic root row
(`packages/plugins/src/ik.ts`, `packages/plugins/src/ik3d.ts`). Slice 2 and Slice 3 replace that
transport with the aggregate contract of plan section 4.1 and 4.2.

The verified blast radius, checked file by file against `test/pending.json`:

- The only active (non-pending) tests that exercise the v5 `ik` and `ik3d` plugins at all are
  `packages/plugins/test/integration/ik-explicit-graph.test.ts` and
  `packages/plugins/test/integration/ik3d-explicit-graph.test.ts`. Both are named tests of these
  slices and are rewritten by them.
- Every active solver unit test (`fabrik-*`, `ik-solve`, `ik-chain-shape`, `ik-constraint`,
  `ik-descent`, `ik-result`, `pivot-offset-solve`, `limited-fabrik`, `ik3d-*`) calls the solver
  modules directly, not the plugin transport, and stays green without one byte of change.
- Every active engine-level test that mentions IK uses the legacy plugins under
  `packages/plugins/src/legacy/`, which these slices do not touch.
- `packages/plugins/test/unit/fk-solved-weight.test.ts`, `fk-v5.test.ts` and `fk3d-v5.test.ts`
  consume literal solver tables, not `ik` output, and the solved-row shape does not change.
- The app (`apps/pose-gap-filler/src/rig/rig.ts`) authors the grouped shape against the v5
  plugins, but every test that loads that rig is pending, and the authored project JSON is not
  type-checked against plugin slots. Nothing that runs in the gates loads the app rig. See
  decision D8 for the consequence and its recording.

## 2. Rules of engagement for the working tree

The Slice I/J work that Slice 0 inventoried is preserved at commit `9706ecab`; the tree starts
clean, and every slice keeps it that way:

- Never run `git add -A`, `git add .`, `git stash`, `git checkout --`, `git restore`, or
  `git clean`. Stage only the files each slice names.
- Never run `npm run format` (it is `prettier . --write` and formats the whole repository).
  Format only the slice's own files: `npx prettier --write <file>...`.
- Slice 2 rewrites `packages/plugins/src/ik.ts` and deletes
  `packages/plugins/test/integration/ik-explicit-graph.test.ts`; slice 3 does the same for the
  `ik3d` pair. Both pairs carry the superseded member-graph edits preserved at `9706ecab`.
  Overwriting them is the sanctioned replacement, not a discard: history keeps the withdrawn
  design, which is the record this repository wants.
- Start each slice from a clean tree. If anything is dirty besides the slice's own work, stop and
  report rather than working around it.

## 3. Locked design decisions

Each decision below is made. A deviation is an allocation correction that must be recorded in the
pull request body with its reason, not a silent choice.

**D1 — Slot shape.** `ik` declares exactly `chain`, `goals` and `base`, each a required
single-binding slot: `chain` reads `values` as `BODY_2D_SPEC`, `goals` as `GOALS_2D_SPEC`, `base`
as `ROOT_2D_SPEC` (a record, not a table). `ik3d` declares `chain`, `goals`, `base` with the 3D
specs plus an optional `pole` slot reading the existing `FRAME` record spec. No slot uses
`binding: "map"`. Local `values` and both outputs (`values`, optional `inspect`) are unchanged
from the current plugins.

_Why:_ plan sections 4.1 and 4.2 state this contract, and Slice 1 landed the specs it names. The
old `members`, old `goals` map, and old `root` table are refused by name at load with zero new
code, through the identified-plugin admission rules in
`packages/core/src/graph/dependency-check.ts`: an authored `members` slot is `slot-unknown`, a
dict under `goals` is `slot-binding-mode`, a `memberId` cell in a body row is `cell-form-invalid`
(declared schemas are closed), and a synthetic root row is unrepresentable because `ROOT_*_SPEC`
is a record. All four are load-blocking errors. Do not add any compatibility spelling, alias, or
bridge.

**D2 — The external base is the empty string.** `SolveMember.base` and `ChainMember3d.base` stay
`string`. A member whose `parentId` is absent gets `base: EXTERNAL_BASE` where
`EXTERNAL_BASE = ""`, exported from `aggregate-topology.ts`. Do not change `SolveMember`,
`ChainMember3d`, or any solver module.

_Why:_ every solver walk already treats a base naming no member as the external root:
`canonicalChain` walks `while (byId.has(current.base))`, `fabrik` guards with `isMember(base)`,
`branchPulls` stops when `byId.get(base)` is missing, `ik3d-fabrik` stops on `undefined`, and
`ik3d-orient`'s `worldOf` answers the root matrix for an unknown id. The empty string is the one
id `readAggregateTopology` already refuses as a body row id (kind `row-id`), so no authored row
can ever collide with it — which the old authored `parentId: "root"` spelling could not promise.
Changing the `base` type to optional instead would ripple through every strategy file and its
green tests for a transport-only question, which is the wider slice the plan did not order.

**D3 — One shared goal join.** `aggregate-topology.ts` gains one exported function,
`readGoalTargets(topology, value)`, which reads the goals table and returns a
member-id-to-row map, refusing by kind: `goal-table-shape`, `goal-row-shape`, `goal-row-id`,
`goal-empty`, `goal-member-unknown`, `goal-member-not-leaf`, `goal-member-duplicate`,
`goal-leaf-unaddressed`. These kinds extend the landed closed `AggregateTopologyErrorKind` union.
Both `ik.ts` and `ik3d.ts` call it; neither re-states any of its rules.

_Why:_ plan section 3.4 states the five goal rules once for both dimensions, and section 6 allows
shared traversal with separate field decoders. Two private copies of the same refusals would be
two owners of one question. The join returns rows, not decoded frames, because the 2D and 3D
decoders differ (`readFrame` versus `readFrame3d`) and decoding stays in each plugin.

**D4 — Field decode ownership.** 2D members decode `length` through `readNumber`, `pivot` through
`readPivotOffset`, the joint limit through `readJointLimit`, the goal frame through `readFrame`,
and the goal influence through `readInfluence(goal.cells)`. 3D members add `offset` through
`readPivotOffset3d`, `rest` through `readEuler3d`, `orient` through `readOrient(row.cells)`, the
3D limit through `readJointLimit3d` with the `constrains` presence test, and the goal through
`readFrame3d`. `base` comes from `topology.parentById.get(row.id)`, never from raw cells, so the
validated parent view is the only thing the adapter reads.

_Why:_ these are the existing single owners of each decode (ADR-106, ADR-117, ADR-124), and
`parentById` is already validated and correctly typed where raw cells are only
`AggregateScalar`. Influence now lives only on the goal row (GOALS specs) and orient only on the
body row (BODY_3D_SPEC): the grouped model's member-side `influence` spelling is withdrawn with
the grouped model, and the closed body schema refuses it by name.

**D5 — Output identity and order.** Output rows are one row per body member, `id` is the member
id, cells are `rotation` (plus `rotationX`/`rotationY` in 3D) and the existing optional
`residual`/`atBound`, in the canonical root-first order of `topology.rows`. `outputRows` in both
plugins stays byte-identical; the adapter builds the member array in canonical order, so the
output order follows.

_Why:_ plan sections 3.2 and 3.3. The member array order is also what `solveChain` sees, and the
solver is already order-deterministic by canonical sort, so feeding it the canonical order
changes no digit.

**D6 — Golden values are frozen, not regenerated.** The rewritten transport tests assert the
literal values the current test files already pin. The adapter feeds the solver the same numbers
the grouped adapter did (same lengths, same pivots, same goal frames, same influence), and the
external-base spelling change of D2 is invisible to every strategy walk, so the outputs must stay
bit-identical and the assertions stay `toEqual`. If an exact assertion fails, the adapter changed
the numbers: find the divergence. Do not loosen to `toBeCloseTo`, and do not capture fresh
expected values from the migrated code.

_Why:_ plan section 10: expected values are captured from the frozen pre-redesign solver, never
generated by the migrated code, and quality kind, iteration count, bound flags, row ids and
output names remain exact. Its absolute `1e-6` transport tolerance is the ceiling for a proven
transport artifact, not a license: identical inputs produce identical doubles, so a failing
`toEqual` is a divergence to explain before any tolerance is invoked.

**D7 — The pending ledger does not shrink in these slices.** Remove no entry from
`test/pending.json` and edit no pending test file. Every Phase 5 entry's exact test still
exercises the grouped member-graph or the legacy path; none of them passes "under the aggregate
architecture" as its exact test, and a similarly named new test passing is explicitly not a
removal reason (plan section 10). The ledger's own guard fails if it grows, so leave the file
untouched.

**D8 — The app consequence is recorded, not fixed.** From slice 2 until slice 7, the app's
grouped project (`apps/pose-gap-filler/src/rig/rig.ts`) no longer loads at runtime: its `members`
slot is refused as `slot-unknown`. No gate covers that load (every such test is
pending, section 1), typecheck stays green, and slice 7 owns the migration. Record the
consequence in the pull request body and in the `docs/SESSION-STATUS.md` rewrite. Do not touch
the app.

**D9 — No new discriminated union is introduced.** The closed unions these slices read
(`JointLimit`, `JointLimit3d`, `AggregateTopologyErrorKind`, `SolveQuality`) are each read
through their existing single owner (`readJointLimit`'s callers, `constrains`, `inspectSolve`),
and the new goal refusals extend the landed closed error-kind union rather than adding stringly
diagnostics. Do not build a found/missing row union for the goal lookup: `readGoalTargets`
guarantees every leaf is addressed, so a missing arm would be validation for a state that cannot
occur. The first genuinely beneficial lookup union arrives in slice 4 (FK's solved-row
selection), where missing is reachable.

**D10 — The graph needs nothing from these slices.** An aggregate IK project loads today: the
v5 `PluginCatalog.capabilityOf` answers `undefined`, so every grouped-solver rule
(`ik-solver-no-root`, `ik-solver-no-members`, the pole and weight rules) stays silent; and
`resolveSolvers` classifies a solver by a `root` edge, which an aggregate node does not have, so
it is skipped without a diagnostic. Engine-level evidence is therefore in scope for both slices
without touching `packages/core`. Deleting the fan-in machinery is slice 6.

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

function input(values: { flip?: boolean; inspect?: boolean } = { inspect: true }) {
  return {
    values,
    requires: {
      chain: { values: BODY },
      goals: { values: GOALS },
      base: { values: { x: 0, y: 0, rotation: 0 } },
    },
  };
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
rest blend is FK's question, ADR-055). Both differences are inert to the solver.

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

function input(
  values: { inspect?: boolean } = { inspect: true },
  pole: { readonly values: Record<string, number> } = {
    values: { x: 0, y: 0, z: 100, rotation: 0, rotationX: 0, rotationY: 0 },
  },
) {
  return {
    values,
    requires: {
      chain: { values: BODY },
      goals: { values: GOALS },
      base: {
        values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 },
      },
      pole,
    },
  };
}
```

`ik3dPlugin.transform(input(), { nodeId: "rig/solve", progress: 0 })` must return, byte for byte:

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
        rotationY: 79.42085584563047,
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
`rest`.

### 4.3 The engine project

Both slices prove one aggregate project end to end. The 2D shape (the 3D slice mirrors it with
`ik3d`, 3D specs and a pole track):

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
```

Table sources declare the shared schemas so static-cell rules apply (`parentId`, `memberId` and
`influence` are static) and unknown cells such as `memberId` on a body row are refused as
`cell-form-invalid`. The `base` record needs no schema: an authored record proves its fields
required, which satisfies `ROOT_2D_SPEC` in the slot check.

### 4.4 The capture rule for any additional numerical fixture

If a case needs a number the current tests do not already pin (slice 3's constrained and
influence cases assert shapes and differences, not new doubles, so this should not trigger):
capture the expectation from the current, unmodified plugin before the rewrite, by running the
fixture's grouped twin once and freezing the printed values. Never capture from the migrated
code.

## 5. Slice 2 — aggregate 2D IK

**Owner:** `packages/plugins/src/ik.ts` and the aggregate 2D IK tests.

**Files this slice may change, and no others:**

```text
packages/plugins/src/aggregate-topology.ts
packages/plugins/src/ik.ts
packages/plugins/test/unit/aggregate-topology.test.ts
packages/plugins/test/integration/ik-explicit-graph.test.ts   (deleted)
packages/plugins/test/integration/ik-aggregate.test.ts        (added)
docs/SESSION-STATUS.md
```

### 5.1 Step order

1. Run the previous slice's exit checks at the current head and record them:
   `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`. Record `git rev-parse
HEAD` and `git status --short`.
2. Write `packages/plugins/test/integration/ik-aggregate.test.ts` first, with the cases in 5.4,
   against the contract in D1 and the goldens in 4.1. Model its structure on the current
   `ik-explicit-graph.test.ts` (direct `ikPlugin.transform` calls, a `PluginCatalog` registration
   check).
3. Run it: `npx vitest run packages/plugins/test/integration/ik-aggregate.test.ts`. Every case
   fails against the old plugin (the transform throws `IK requires a map output at members`, and
   the contract assertions fail on the missing `chain` slot). Save that output verbatim: it is
   the failing-first behavior evidence for the pull request. A typecheck failure alone is not
   evidence.
4. Implement: the `aggregate-topology.ts` additions in 5.2, then the `ik.ts` rewrite in 5.3.
5. Add the goal-join unit cases to
   `packages/plugins/test/unit/aggregate-topology.test.ts` (5.4).
6. Run the focused files until green:
   `npx vitest run packages/plugins/test/unit/aggregate-topology.test.ts
packages/plugins/test/integration/ik-aggregate.test.ts`.
7. Format the slice's files: `npx prettier --write` on exactly the four paths that still exist
   (the deleted test file excepted). Then run the full gates in section 8.
8. Commit, then write the pull request body and the status rewrite (5.5), then the checkpoint
   comment (section 9).

### 5.2 `aggregate-topology.ts` additions

Append to `AggregateTopologyErrorKind` the eight kinds in D3, and export the external-base marker
beside the interface it documents:

```ts
/**
 * The node a member hangs from when its `parentId` is absent: the external base frame.
 *
 * The empty string is the one id this module refuses as a body row id, so no authored row can
 * collide with it, and every solver walk already treats a base naming no member as the external
 * root, exactly as the pre-aggregate authored `parentId: "root"` spelling did.
 */
export const EXTERNAL_BASE = "";
```

Then the goal join (module-private row reader, then the exported function):

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

Duplicate goal row ids are not re-checked here: row-id uniqueness is the authored table
validator's question (plan section 5.2), and two rows with the same id targeting different
members are two legal goals. A local row reader rather than a parameterized `readRow` keeps the
landed body error vocabulary byte-identical; the two readers' closed kind sets are different
unions, and threading kinds through one reader would couple them for fifteen saved lines.

### 5.3 The `ik.ts` rewrite

Keep from the current file, unchanged: the `INSPECT` spec, `flatRecord`, `recordOutput`,
`outputRows`, and the transform's local-values and inspection handling. Delete: the `MEMBER`,
`ROOT`, `GOAL`, `SOLVED_ROW` local specs, `recordsOutput`, `rootOutput`, `stringField`,
`optionalStringField`, `memberRows`, `rootFrame`, and the map-output types. The new body:

```ts
import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  BODY_2D_SPEC,
  EXTERNAL_BASE,
  GOALS_2D_SPEC,
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
      chain: { outputs: { values: BODY_2D_SPEC } },
      goals: { outputs: { values: GOALS_2D_SPEC } },
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
targets")` reusing the file's `body` and `errorOf` helpers:

- GT-1 a leaf-addressed goals table returns a member-id-to-row map preserving ids and cells.
- GT-2 a non-array is refused as `goal-table-shape`.
- GT-3 an empty goals table is refused as `goal-empty` with the leaf ids.
- GT-4 a row without id/cells is `goal-row-shape`; an empty id is `goal-row-id`.
- GT-5 a goal for an unknown member is `goal-member-unknown` with both ids.
- GT-6 a goal for a non-leaf member is `goal-member-not-leaf`.
- GT-7 two goal rows targeting one member are `goal-member-duplicate`.
- GT-8 an unaddressed leaf is `goal-leaf-unaddressed` naming the first such leaf in canonical
  order.

`packages/plugins/test/integration/ik-aggregate.test.ts`:

- AI-1 contract: `requires` has exactly the keys `chain`, `goals`, `base`; no slot declares
  `binding` (so `requires.goals`'s binding is absent, not `"map"`); `outputs.values` is the
  solved table spec and `inspect` is optional. Also `expect(requires.members).toBeUndefined()`.
- AI-2 golden: the 4.1 fixture returns the frozen rows and inspect record with `toEqual`.
- AI-3 reorder invariance: the same body rows in reverse authored order return an identical
  result object.
- AI-4 goal validation through the transform: for each malformed goals table of GT-2 through
  GT-8, `transform` throws and the thrown `AggregateTopologyError.kind` matches. Build each by
  mutating the 4.1 fixture's `GOALS`.
- AI-5 rest edit at the transform: a body row with `length: 45` on `upper` produces different
  rows than the golden.
- AI-6 inspection and flip: without `inspect` the result has no `inspect` key; a two-bone
  fixture (two rows, goal on the leaf) with the goal in reach and off the straight line, so the
  two elbow branches differ, publishes different leaf rotations for `flip: true` versus
  `flip: false`, both finite.
- AI-7 engine golden path: the 4.3 project loads, `handle.get("demo/solve")` is ready, and its
  `outputs.values` rows have ids exactly `["trunk", "left-upper", "left-lower"]` with finite
  rotations.
- AI-8 renamed sources: the same project with track ids `skeleton`, `targets`, `origin` (and a
  different motion id) publishes the same `outputs.values` rows.
- AI-9 animated values: a second project whose goal row authors `x` as
  `[{ p: 0, v: 12 }, { p: 1, v: 30 }]`; `handle.seek("demo/goals", 0)` then `1` publish
  different `left-lower` rotations, and the progress-1 answer equals the static `x: 30`
  project's answer.
- AI-10 one composition per flush: subscribe to `demo/solve`, count ready patches, then run one
  value batch `handle.values((tx) => { tx.track("demo/body").input.values.setField({ row:
"trunk", field: "length" }, 25); })`; exactly one new ready patch arrives, its revision is the
  previous plus one, and its `left-lower` rotation differs from before.
- AI-11 the old shape is refused by name: a project whose solve track authors
  `requires: { members: { upper: "body" }, root: "root", goals: { left: "goals" } }` fails
  `load` with `slot-unknown`; one whose `goals` slot is a dict fails with
  `slot-binding-mode`; a body row with a `memberId` cell fails with
  `cell-form-invalid`.

### 5.5 Commit, pull request, status

Commit message:

```text
refactor(plugins): migrate 2d ik to aggregate tables

Slice 2 replaces the member-map transport with the aggregate contract: `ik` reads one body
table through `chain`, one goals table through `goals`, and one base record through `base`,
validates goals through the shared `readGoalTargets` join, and publishes the same solved rows
byte for byte. The external base is the empty string, the one id the topology reader refuses
as a row id, so no authored row can collide with it.

Evidence: <red run against the old plugin>, aggregate IK <N> tests, goal join <M> tests, full
suite <files>/<tests>, typecheck, format:check, boundaries passed. The app's grouped rig no
longer loads until slice 7; every test that loads it is pending. No pending entries removed.
```

The pull request body states: the exact head; the invariant (one body table in, one solved table
out, row identity preserved, no hidden member state); the single owner; the red evidence with the
command and observed failures; every gate command and result; the frozen goldens with their
provenance (the previous `ik-explicit-graph.test.ts`); the decisions D1 through D8 by name with
one line each; what was withdrawn (map slots, member-side `influence`, the `goalId` field, the
synthetic root row) and why; changed and deleted paths; and the D8 app consequence.

Rewrite `docs/SESSION-STATUS.md` (replace, never append). The **Now** bullet after this slice:

```text
- **Phase 5's 2D IK is aggregate:** `ik` reads one body table, one goals table and one base
  record through single-source slots, validates goals through the shared aggregate join, and
  publishes byte-identical solved rows. Grouped authoring is refused by name at load, so the
  app's grouped rig no longer loads until its slice migrates it. No pending entries were
  removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.
```

The **Next in line** bullet:

```text
- **Aggregate 3D IK:** the same chain, goals and base contract for `ik3d`, preserving pole,
  joint, orientation, influence and inspection behavior.
```

Keep the other two sections as they are unless this slice made one stale.

## 6. Slice 3 — aggregate 3D IK

**Owner:** `packages/plugins/src/ik3d.ts` and the aggregate 3D IK tests.

Start only after slice 2 is committed and green. Its files, and no others:

```text
packages/plugins/src/ik3d.ts
packages/plugins/test/integration/ik3d-explicit-graph.test.ts   (deleted)
packages/plugins/test/integration/ik3d-aggregate.test.ts        (added)
docs/SESSION-STATUS.md
```

`aggregate-topology.ts` is not in this slice's file list: slice 2 landed the shared join, and a
gap discovered here is an allocation correction to record and fix in its own right, not a silent
edit.

### 6.1 Step order

1. Re-run slice 2's exit checks and record head and status.
2. Write `ik3d-aggregate.test.ts` first (cases in 6.3), run it against the unmodified `ik3d`, and
   save the red output.
3. Rewrite `ik3d.ts` (6.2).
4. Green the focused file, format the slice's three paths, run the full gates (section 8).
5. Commit, pull request body, status rewrite, checkpoint.

### 6.2 The `ik3d.ts` rewrite

Same shape as slice 2. Keep: `INSPECT`, `flatRecord`, `recordOutput`, `outputRows`, and the
`FRAME` pole spec. Delete: the local `MEMBER`, `ROOT`, `GOAL`, `SOLVED_ROW` specs, `recordsOutput`,
`rootOutput`, `stringField`, `optionalStringField`, `memberRows`, `rootFrame`, and the map types.

```ts
import type { IdentifiedPluginDefinition, Outputs, ValueSpec } from "@motion5/core/plugin-api";
import {
  BODY_3D_SPEC,
  EXTERNAL_BASE,
  GOALS_3D_SPEC,
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

export const ik3dPlugin: IdentifiedPluginDefinition = {
  id: "ik3d",
  inputs: {
    values: {
      kind: "record",
      fields: { inspect: { kind: "boolean", optional: true, static: true } },
    },
    requires: {
      chain: { outputs: { values: BODY_3D_SPEC } },
      goals: { outputs: { values: GOALS_3D_SPEC } },
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

`packages/plugins/test/integration/ik3d-aggregate.test.ts`:

- AI3-1 contract: `requires` has exactly the keys `chain`, `goals`, `base`, `pole`; `pole` is
  optional; no map binding; `outputs.values` is the 3D solved spec. This is the proof that FK
  output is not required by the solver: the key list is exhaustive.
- AI3-2 golden: the 4.2 fixture returns the frozen rows and inspect record with `toEqual`.
- AI3-3 reorder invariance: body rows in reverse authored order, identical result.
- AI3-4 goal validation: the same GT mutations through the 3D transform, kinds asserted.
- AI3-5 pole: the golden (bound pole) versus the same input with `requires.pole` omitted: both
  publish three finite rows, and the optional slot's absence is not an error.
- AI3-6 joint: a two-bone fixture whose `upper` row authors
  `joint: "hinge", axisZ: 1, minRotation: 0, maxRotation: 0` and whose leaf goal sits off the
  straight reach (`x: 80, y: 40, z: 30`, lengths 50 and 35): with `inspect: true` the inspect
  kind is `limited`, the `upper` output row carries `atBound: true`, and inspect `atBound` is
  true. The pinned-at-zero joint cannot reach an off-axis goal, so the bound is engaged by
  construction. If the run reports a different quality kind, report it; do not weaken the
  assertion to make it pass.
- AI3-7 influence: the 4.2 fixture with `influence: 2` added to the `goal-left` row publishes
  different `left`/`right` rotations than without it, both finite.
- AI3-8 orientation: covered by the golden (the goals carry orientation fields and `left`
  carries `orient: 0.5`); assert additionally that removing `orient` from the `left` row changes
  the `left` row's Euler cells.
- AI3-9 identity across strategies: for the two-bone, tree (the 4.2 fixture) and constrained
  (AI3-6) fixtures, the output row ids equal the body row ids exactly, in canonical order.
- AI3-10 engine: a 3D aggregate project (mirroring 4.3 with `ik3d`, the 3D schemas, a base record
  with six fields and a schema-less pole record track) loads and publishes a ready solved table;
  the same project with renamed track ids publishes identical rows; an animated goal `x` seeked
  from 0 to 1 publishes different rotations; one `setField` batch on the body table produces
  exactly one new ready patch on the solve node; a solve track authored with the old `members`
  slot fails `load` with `slot-unknown`.

Serial recovery, quality, pivot offsets and every strategy's numerics are preserved because the
dispatcher and strategies are untouched; they stay pinned by the active `ik3d-*` unit suites, and
the constrained case above proves the constrained arm still answers through the aggregate shape.
That is the evidence allocation plan section 10 makes for this slice: golden, constraints, pole
and orientation.

### 6.4 Commit, pull request, status

Commit message:

```text
refactor(plugins): migrate 3d ik to aggregate tables

Slice 3 repeats the aggregate contract for `ik3d`: one body table, one goals table, one base
record and an optional pole record through single-source slots, the shared goal join, and the
same Euler rows byte for byte. Pole, joint, orientation, influence and inspection behavior are
preserved; no solver module changed.

Evidence: <red run against the old plugin>, aggregate 3D IK <N> tests, full suite
<files>/<tests>, typecheck, format:check, boundaries passed. No pending entries removed.
```

The pull request body follows slice 2's outline, adding the AI3-6 outcome and any allocation
correction.

`docs/SESSION-STATUS.md` after this slice — **Now**:

```text
- **Phase 5's 2D and 3D IK are aggregate:** both solvers read one body table, one goals table
  and one base record through single-source slots, share the topology reader and goal join, and
  publish byte-identical solved rows. Grouped authoring is refused by name at load, so the
  app's grouped rig no longer loads until its slice migrates it. No pending entries were
  removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.
```

**Next in line**:

```text
- **Aggregate 2D FK:** compose one whole pose table from the body and solved tables and the
  base record.
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
- Nothing in `packages/core`, `packages/three`, `packages/react`, or `apps/`.
- The landed Slice 1 spec values (`BODY_*_SPEC`, `GOALS_*_SPEC`, `ROOT_*_SPEC`, `SOLVED_*_SPEC`,
  `POSE_*_SPEC`) are imported, never edited.
- `test/pending.json` and every pending test file.
- Nothing outside each slice's file list, including the other planning documents in
  `motion5-implementation-plans/`.
- Output names stay `values` and `inspect`; the main output stays `values`.
- No map bindings, no compatibility alias for `members`/`root`/`goals`, no bridge, no fallback.
- No comments restating what code says; the two WHY comments (external base, and any equally
  non-obvious one you earn) are the only ones these slices should need.
- No markdown tables in anything you write; prettier is pinned, `printWidth` 100, double quotes,
  trailing commas, and prose stays on lines you broke yourself at or under 100 columns.

## 8. Verification protocol

Before each slice, run the previous slice's exit checks. During each slice, run the focused
vitest files first. After the focused files are green, run one at a time and record every result:

```text
npm run format:check
npm run typecheck
npm run test:boundaries
npm test
```

`npm run test:read-budget` is required only when a `packages/core/src` file changes; neither
slice changes one, and the full suite runs the scanner's own unit tests regardless. No core file
is touched, so the 60,000-byte and 30,000-byte budgets are not in play; `aggregate-topology.ts`
grows to roughly 17,000 bytes and `ik.ts` and `ik3d.ts` shrink.

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
