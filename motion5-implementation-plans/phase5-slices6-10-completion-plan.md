# Phase 5 Slices 6 Through 10: Complete Aggregate Pipeline and Rig Retirement

**Status:** Step-by-step master implementation plan for Slices 6, 7, 8, 9, and 10 of section 9 of
[phase5-completion-plan.md](phase5-completion-plan.md). That document remains the execution
authority for the whole phase; this one is the worked master contract for the remaining five slices
and decides every architectural, algorithmic, and verification question the implementer would
otherwise have to decide.

**Prepared:** 2026-10-29, Asia/Jakarta.

**Branch:** `refactor/v5-identified-tables`.

**Base:** commit `e31e029e` (HEAD of `refactor/v5-identified-tables` after Slice 4 and Slice 5
landed). The tree starts clean.

**Prerequisites:** Slices 0, 1, 2, 3, 4, and 5 landed. The aggregate topology reader, shared value
specs, aggregate 2D/3D IK (`ik`, `ik3d`), and aggregate 2D/3D FK (`fk`, `fk3d`) are fully landed and
operational in `packages/plugins/src/`.

## 1. What is already true

Slices 0 through 5 successfully landed the core aggregate kinematic transformations:

- Slice 0 froze and classified the working tree state, preserving untracked planning records.
- Slice 1 landed `readAggregateTopology` and the shared value specs (`BODY_2D_SPEC`, `BODY_3D_SPEC`,
  `GOALS_2D_SPEC`, `GOALS_3D_SPEC`, `ROOT_2D_SPEC`, `ROOT_3D_SPEC`, `SOLVED_2D_SPEC`,
  `SOLVED_3D_SPEC`, `POSE_2D_SPEC`, `POSE_3D_SPEC`, and their derived `*_SLOT` constants) in
  `packages/plugins/src/aggregate-topology.ts`.
- Slice 2 migrated 2D IK (`ik.ts`) to consume single-source `chain`, `goals`, and `base` slots,
  publishing identified solved tables.
- Slice 3 migrated 3D IK (`ik3d.ts`) to consume single-source `chain`, `goals`, `base`, and optional
  `pole` slots, preserving joint limits, orientation constraints, and tree recovery.
- Slice 4 migrated 2D FK (`fk.ts`) to consume single-source `chain`, `solved`, and `base` slots,
  evaluating canonical topology in O(N) linear time and publishing complete pose tables as `values`.
- Slice 5 migrated 3D FK (`fk3d.ts`) to consume single-source `chain`, `solved`, and `base` slots,
  preserving 3D orientation blending, pivot offsets, and segment extents, publishing complete 3D
  pose tables as `values`.

However, the surrounding core graph, publisher machinery, and downstream consumers still reflect the
pre-redesign architecture:

- In `packages/core/src/graph/ir.ts` and `packages/core/src/runtime/graph-publisher.ts`, the runtime
  retains obsolete grouped solver fan-in machinery (`GraphNode.solves`, `resolveSolvers`,
  `MemberState`, `SolverMember`, solver-scope diagnostics, member interpolation, and solver
  constraints).
- In `apps/pose-gap-filler/src/rig/`, the application authors 28 fragmented member tracks across four
  limbs instead of 5 aggregate tracks per space, and reads tips through per-member FK node patches.
  All 14 test suites in `apps/pose-gap-filler/test/` are marked pending in `test/pending.json`.
- In `packages/three/src/skeleton-tracks.ts`, skeleton generation authors individual per-bone FK
  tracks and a `rig` plugin track. `skeleton-driver.ts` imports `readRigValues` and exports
  `rigFrameSource`.
- In `packages/plugins/src/pose-classify.ts`, the classifier requires a `rig` slot outputting a `pose`
  record map rather than binding directly to the FK pose track's `values` output.
- In `packages/plugins/`, the v5 identified `rig` plugin (`packages/plugins/src/rig.ts`), legacy grouped
  `rig` plugin (`packages/plugins/src/legacy/rig.ts`), and `rig-values` helper module remain
  registered in catalogs and exposed in package exports.

Slices 6 through 10 execute the sequential retirement of this legacy machinery and close out Phase 5:

- Slice 6 purges hidden solver fan-in from `packages/core/src/graph` and `packages/core/src/runtime`.
- Slice 7 migrates `apps/pose-gap-filler` to 5 aggregate tracks and whole-table batch writes,
  retiring 14 pending test suites.
- Slice 8 migrates `packages/three` to aggregate 3D tracks and `tableFrameSource`.
- Slice 9 binds `pose-classify` directly to FK pose tables and migrates remaining consumers,
  retiring 24 pending test suites.
- Slice 10 deletes all rig plugins and decoders, adds rigorous deletion tests, retires the final 35
  Phase 5 pending suites, updates documentation, and satisfies the Phase 5 completion gate.

### Blast radius verification

- Baseline pending ledger in `test/pending.json`: exactly 79 entries (73 Phase 5, 4 Phase 6, 2 Phase
  7).
- Active test suite: 286 test files, 1,836+ tests, all passing cleanly.
- `packages/plugins/src/frame.ts`, `frame3d.ts`, `ik-solve.ts`, `ik3d-solve.ts`, and `fabrik.ts`
  are complete and remain untouched.
- `packages/core/src/graph/ir.ts` is 45,094 bytes. Its size will decrease in Slice 6. Sister document
  `ir.md` must be updated in tandem to maintain exact member declaration order per read-budget
  rules.

## 2. Rules of engagement for the working tree

The working tree starts clean on branch `refactor/v5-identified-tables` at base commit `e31e029e`.
Every slice must adhere to strict working tree guardrails:

- Never run `git add -A`, `git add .`, `git stash`, `git checkout --`, `git restore`, or `git clean`.
  Stage only the exact files each slice modifies, adds, or deletes.
- Never run repository-wide `npm run format` (which invokes `prettier . --write`). Format only the
  slice's own files: `npx prettier --write <file>...`.
- Author no markdown tables anywhere. Prettier rewrites markdown table alignment to widths that
  cannot be predicted, causing fatal drift in `npm run format:check`. Use bulleted lists, definition
  lists, indented blocks, or fenced code blocks (`text`, `ts`, `json`).
- Untracked `motion5-implementation-plans/v5.1-validation-contract-plan.md` and modified `AGENTS.md`
  must remain completely untouched.
- Start each slice from a verified clean tree. If any unexpected dirty file appears, stop and report
  immediately.
- Slices must be executed in exact sequential order: Slice 6 -> Slice 7 -> Slice 8 -> Slice 9 ->
  Slice 10. Each slice is an atomic vertical commit that leaves the repository green.

## 3. Locked architectural decisions

### D1 — Explicit acyclic graph dependencies only (Slice 6)

The dependency graph carries only explicit track dependencies declared in `node.edges`. A solver
(`ik`, `ik3d`) or forward kinematics (`fk`, `fk3d`) node reads only explicit sources bound to its
declared slots (`chain`, `goals`, `base`, `solved`). No hidden member state is derived or collected.

- `GraphNode.solves` is deleted from `interface GraphNode`.
- `resolveSolvers` and its member-node fan-in helper functions are deleted from
  `packages/core/src/graph/ir.ts`.
- `deriveDependants` in `ir.ts` maps reverse topology purely from explicit edges:
  `collected.get(edge.sourceId)?.push(node.id)`. The `node.solves` traversal loop is deleted.
- Obsolete grouped solver graph constraints (`packages/core/src/graph/solver-constraints.ts`) are
  deleted.
- ADR citation: ADR-092, ADR-138 supersession.

### D2 — Pure identified publisher composition (Slice 6)

In `packages/core/src/runtime/graph-publisher.ts`:

- Interfaces `MemberState` and `SolverMember` are deleted.
- Property `interpolated?: () => MemberState` is deleted from `PublisherNode`.
- In `GraphPublisher.#collectInputs`, the `if (node.solves && node.solves.length > 0)` fan-in block is
  completely removed.
- Identified plugins (`node.composeIdentified !== undefined`) are evaluated purely through
  `#collectIdentifiedInputs`, returning `{ inputs: Object.freeze({}), identified: identified.requires, sourceRevisions }`.
- Error diagnostics for `solver-scope` and `member-interpolation` are purged.
- Each aggregate node is composed at most once per engine flush.

### D3 — Pose-gap-filler 5-track aggregate architecture (Slice 7)

`apps/pose-gap-filler/src/rig` collapses 28 separate limb member tracks into exactly 5 aggregate
tracks per space (`imageRigProject` and `worldRigProject`):

- `root` (track id `"root"`): single record track with `ROOT_2D_SPEC` (or `ROOT_3D_SPEC` in 3D).
- `body` (track id `"body"`): table track with `BODY_2D_SLOT` (or `BODY_3D_SLOT` in 3D). Contains 8
  rows (2 rows per limb for `left-arm`, `right-arm`, `left-leg`, `right-leg`). Upper bones attach to
  external base (`parentId` omitted) with pivot offsets; lower bones attach to upper bones (`parentId:
${limb}-upper`).
- `goals` (track id `"goals"`): table track with `GOALS_2D_SLOT` (or `GOALS_3D_SLOT` in 3D). Contains
  4 rows (1 row per limb leaf targeting `${limb}-lower`).
- `solve` (track id `"solve"`): plugin track `ik` (or `ik3d`), requires `{ chain: "body", goals: "goals", base: "root" }`.
- `pose` (track id `"pose"`): plugin track `fk` (or `fk3d`), requires `{ chain: "body", solved: "solve", base: "root" }`.

### D4 — Whole-table batch writes in pose-gap-filler (Slice 7)

`apps/pose-gap-filler/src/rig/writer.ts` stages writes as complete table replacements using
`input.values.set(...)`:

- Body and goal updates are assembled into 8-row and 4-row arrays and written once per frame.
- Per-cell mutations and per-member track updates are prohibited.
- If a limb is skipped (lost landmark or unmeasured length), the writer retains that limb's previous
  valid row in `body` and `goals`, ensuring all 4 leaves remain addressed and preventing
  `goal-leaf-unaddressed` errors.

### D5 — Solved limb row selection by member ID (Slice 7)

`apps/pose-gap-filler/src/rig/rig.ts` replaces `publishedTip` with `readSolvedLimb`:

- Fetches the single pose patch: `const patch = project.get(poseNodeId(POSE_TRACK_ID));`.
- Retrieves the published `values` table.
- Indexes or filters rows by `row.id === upperMemberId(limb)` and `row.id === lowerMemberId(limb)`.
- Returns `{ middle: [upperRow.cells.x, upperRow.cells.y], tip: [lowerRow.cells.x, lowerRow.cells.y] }`.
- Selection by array index, first row, or separate member track is prohibited.

### D6 — Three.js aggregate tracks (Slice 8)

`packages/three/src/skeleton-tracks.ts` emits exactly four aggregate tracks per skeleton binding:

- Root track (`${idPrefix}-root`): authored record track conforming to `ROOT_3D_SPEC`.
- Body track (`${idPrefix}-body`): authored table track conforming to `BODY_3D_SPEC` containing one
  row per captured bone in canonical root-first order with rest transforms and parent relationships.
- Solved track (`${idPrefix}-solved`): authored table track conforming to `SOLVED_3D_SPEC` with zero
  rotations.
- Pose track (`${idPrefix}-pose`): plugin track `fk3d`, requiring `{ chain: `${idPrefix}-body`, solved: `${idPrefix}-solved`, base: `${idPrefix}-root` }`.
- Emitting `${idPrefix}-rig` or any track with `plugin: "rig"` is strictly prohibited.

### D7 — Three.js `tableFrameSource` (Slice 8)

`packages/three/src/skeleton-driver.ts`:

- Deletes `import { readRigValues }` and deletes `rigFrameSource`.
- Introduces `tableFrameSource(poseTable: unknown): FrameSource`.
- If `!Array.isArray(poseTable)`, returns `() => undefined`.
- Builds an internal `Map<string, Readonly<Record<string, unknown>>>` mapping `row.id -> row.cells`.
- Returns `(source: string) => rowsById.get(source)`.
- When a bone's drive source is missing from the table, `createSkeletonDriver` records `{ kind: "held",
reason: "source-missing" }`.
- Preserves existing parent-space compensation, basis drives, aim drives, rest resets, finiteness,
  and inverse-bind matrix protection bit for bit.

### D8 — Table output neutrality in generic adapters (Slice 8 & 9)

`createObject3dPatchAdapter` in `packages/three/src/index.ts` and `useDerivedDomPatch` in
`packages/react` remain neutral to table outputs:

- Tables have no flat frame keys; table-to-scene binding belongs at the application/driver boundary
  (`tableFrameSource`).
- When encountering table values, generic adapters safely ignore them (`if (!isFlatRecord(values)) return;`).

### D9 — `pose-classify` binds directly to FK pose table (Slice 9)

In `packages/plugins/src/pose-classify.ts`:

- Replaces requirement `requires: { rig: { outputs: { pose: POSE } } }` with `requires: { pose: { outputs: { values: POSE_3D_SPEC } } }` (or `POSE_3D_SLOT`).
- Validates the incoming table: `tableOutput(requires.pose, "pose")`.
- Maps rows by `row.id`: `const poseById = new Map(rows.map(row => [row.id, row]))`.
- Template bones match row `id`s directly. Missing template bones return `Infinity` distance, yielding
  `unknownLabel` with 0 confidence.
- Output remains the flat record `{ values: { label: string, confidence: number } }`.

### D10 — Label change notification preservation (Slice 9)

`packages/plugins/src/labels.ts` (`readLabel` and `onLabelChange`) continues to subscribe to the
classifier's flat `values` output record without modification. Classifier integration tests verify
that changing bone rotations propagates through FK to classifier and fires `onLabelChange`.

### D11 — Complete rig plugin and decoder deletion (Slice 10)

Slice 10 completely deletes:

- `packages/plugins/src/rig.ts` (v5 identified rig plugin)
- `packages/plugins/src/legacy/rig.ts` (legacy grouped rig plugin)
- `packages/plugins/src/legacy/rig-values.ts` (legacy rig decoders)
- `packages/plugins/test/unit/rig-v5.test.ts`
- `packages/plugins/test/rig.test.ts`

### D12 — Clean package manifests and catalogs (Slice 10)

- In `packages/plugins/package.json`: deletes export subpaths `"./rig"` and `"./internal/legacy/rig"`.
- In `packages/plugins/src/identified-catalog.ts`: deletes `"rig"`. Surviving catalog contains exactly
  six plugins: `transform`, `transform3d`, `ik`, `ik3d`, `fk`, `fk3d`.
- In `packages/plugins/src/catalog.ts`: deletes `"rig"` from `builtinCatalog`.

### D13 — Property-in-object deletion assertions (Slice 10)

Per `docs/GUARDRAILS.md`, tests verifying deletions:

- Use `"name" in object === false` and `expect(map.has("name")).toBe(false)` so they compile cleanly
  on both sides of the transition.
- Assert that surviving members (`"./fk"`, `"fk"`, `"transform"`) ARE present on the exact same
  receiver to prove the assertion does not pass vacuously against a mistyped receiver.

### D14 — Pending ledger drawdown discipline (Slices 6 to 10)

`test/pending.json` contains 79 entries at HEAD `e31e029e`:

- Slice 6: 0 entries removed (79 remain; 73 Phase 5, 4 Phase 6, 2 Phase 7).
- Slice 7: 14 entries removed (all `apps/pose-gap-filler` suites) (65 remain; 59 Phase 5, 4 Phase 6,
  2 Phase 7).
- Slice 8: 0 entries removed (Three.js pending suites are Phase 6) (65 remain).
- Slice 9: 24 entries removed (classifier, labels, react-demo-rig, 7 core playgrounds, 14 plugin
  integrations) (41 remain; 35 Phase 5, 4 Phase 6, 2 Phase 7).
- Slice 10: 35 entries removed (34 remaining core graph/runtime suites + 1 legacy rig test deleted)
  (6 remain; 0 Phase 5, 4 Phase 6, 2 Phase 7).
- Under no circumstances may Phase 6 (4 entries) or Phase 7 (2 entries) be removed, renamed, or
  modified.

### D15 — Evidence case-ID series progression

Test series prefixes registered in `packages/core/test/unit/scripts/evidence-case-ids.test.ts`:

- Slice 6: `AM-` (`AM-1` through `AM-10`) — Aggregate graph and publisher cleanup.
- Slice 7: `AN-` (`AN-1` through `AN-10`) — Pose-gap-filler aggregate migration.
- Slice 8: `AO-` (`AO-1` through `AO-10`) — Three.js aggregate migration.
- Slice 9: `AP-` (`AP-1` through `AP-10`) — Classifier and remaining consumers.
- Slice 10: `AQ-` (`AQ-1` through `AQ-12`) — Rig retirement and Phase 5 closeout.

### D16 — Documentation and ADR supersession (Slice 10)

- Add supersession marker to `docs/ADR-138-rig-aggregation-and-pose-classification.md`:
  `**Superseded:** Retained for historical record. Grouped rig aggregation and rig-based pose classification were superseded by the aggregate kinematic architecture of Phase 5 (FK publishes whole pose tables; classifier binds directly to FK pose table).`
- Update `docs/guide/api-reference.md` to remove `@motion5/plugins/rig` and update
  `@motion5/plugins/pose-classify`.
- Rewrite `docs/SESSION-STATUS.md` to reflect landed Phase 5 aggregate kinematics.

### D17 — Strict status shape and byte limit compliance

`docs/SESSION-STATUS.md` strictly adheres to ADR-085:

- Exactly four sections: Header, `## Now`, `## Next in line`, `## Open, and not scheduled`, `## Where the rest of it lives`.
- Exactly one bullet in `## Now` and one bullet in `## Next in line`.
- No bullet label may state a phase name.
- File size stays well under the 8,000-byte ceiling.
- Status is replaced, never accumulated.

### D18 — Deterministic verification without wall-clock timers

All call-count, lifecycle, and transaction tests wrap execution with deterministic mock counters or
step-by-step engine flushes, never relying on wall-clock timeouts or sleep.

## 4. Exact slot shapes, schemas & contracts across Slices 6-10

### 4.1 Explicit graph and runtime IR contracts (Slice 6)

In `packages/core/src/graph/ir.ts`:

- `interface GraphNode`:
  - `readonly id: string;`
  - `readonly plugin: string;`
  - `readonly edges: readonly GraphEdge[];`
  - Property `solves` is deleted.
- Reverse dependants map:
  - `readonly dependants: ReadonlyMap<string, readonly string[]>;`
  - Derived purely from `node.edges` (`edge.sourceId -> node.id`).

In `packages/core/src/runtime/graph-publisher.ts`:

- `interface PublisherNode`:
  - `readonly id: string;`
  - `readonly edges: readonly GraphEdge[];`
  - `readonly composeIdentified?: (context: IdentifiedCompositionContext) => PublisherOutcome;`
  - Property `interpolated` is deleted.

### 4.2 Pose-gap-filler 5-track aggregate schemas (Slice 7)

#### Root track (`root`):

- Kind: Single record track.
- 2D Value spec: `ROOT_2D_SPEC` (`{ x: number, y: number, rotation: number }`).
- 3D Value spec: `ROOT_3D_SPEC` (`{ x: number, y: number, z: number, rotation: number, rotationX: number, rotationY: number }`).

#### Body table track (`body`):

- Kind: Table track (`BODY_2D_SLOT` or `BODY_3D_SLOT`).
- Row count: 8 rows (2 per limb: `${limb}-upper` and `${limb}-lower`).
- Upper bone row:
  - `id`: `${limb}-upper`
  - `cells`: `{ length: number, rotation: number, weight: 1, x: number, y: number, ...(z in 3D) }` (`parentId` omitted; attaches to external base).
- Lower bone row:
  - `id`: `${limb}-lower`
  - `cells`: `{ parentId: `${limb}-upper`, length: number, rotation: 0, weight: 1, x: 0, y: 0, ...(z in 3D) }`.

#### Goals table track (`goals`):

- Kind: Table track (`GOALS_2D_SLOT` or `GOALS_3D_SLOT`).
- Row count: 4 rows (1 per limb leaf: `${limb}-goal`).
- Row schema:
  - `id`: `${limb}-goal`
  - `cells`: `{ memberId: `${limb}-lower`, x: number, y: number, ...(z in 3D) }`.

#### Solver track (`solve`):

- Plugin: `"ik"` (2D) or `"ik3d"` (3D).
- Requires: `{ chain: "body", goals: "goals", base: "root", ...(pole in 3D) }`.
- Outputs: `values: SOLVED_2D_SPEC` (or `SOLVED_3D_SPEC`).

#### Pose track (`pose`):

- Plugin: `"fk"` (2D) or `"fk3d"` (3D).
- Requires: `{ chain: "body", solved: "solve", base: "root" }`.
- Outputs: `values: POSE_2D_SPEC` (or `POSE_3D_SPEC`) with 8 rows.

### 4.3 Three.js aggregate tracks & `tableFrameSource` contract (Slice 8)

#### Tracks generated by `skeletonTracks(binding, { idPrefix })`:

- `${idPrefix}-root`: authored record track with `ROOT_3D_SPEC`.
- `${idPrefix}-body`: authored table track with `BODY_3D_SPEC`. For each captured bone:
  - `id`: `bone.key ?? `bone-${bone.index}``
  - `cells`: `{ parentId?: string, length: 0, weight: 1, x, y, z, rotation, rotationX, rotationY }`.
- `${idPrefix}-solved`: authored table track with `SOLVED_3D_SPEC` (`{ rotation: 0, rotationX: 0, rotationY: 0 }`).
- `${idPrefix}-pose`: plugin track `fk3d`, requiring `{ chain, solved, base }`.

#### `tableFrameSource` contract:

```ts
export function tableFrameSource(poseTable: unknown): FrameSource;
```

- Accepts: `poseTable: unknown` (the `values` output of ready FK3D pose patch).
- Returns: `FrameSource = (source: string) => Readonly<Record<string, unknown>> | undefined`.
- Indexing: `Map<string, Readonly<Record<string, unknown>>>` keyed by `row.id`.
- Refusal: if `!Array.isArray(poseTable)`, returns `() => undefined`.
- Missing row: returns `undefined` -> skeleton driver records `{ kind: "held", reason: "source-missing" }`.

### 4.4 `pose-classify` and labels contract (Slice 9)

In `packages/plugins/src/pose-classify.ts`:

- Inputs:
  - `values`: `{ kind: "record", fields: {} }`
  - `requires`:
    - `pose`: `{ outputs: { values: POSE_3D_SPEC } }` (single source slot)
- Outputs:
  - `values`: `{ kind: "record", fields: { label: { kind: "string" }, confidence: { kind: "number" } } }`
- Transform:
  - Accepts table from `requires.pose.values`.
  - Maps rows: `poseById = new Map(rows.map(row => [row.id, row]))`.
  - For each template bone key, looks up `poseById.get(key)`.
  - Emits `{ values: { label, confidence } }`.

### 4.5 Package exports and identified catalog contract (Slice 10)

- Surviving identified catalog:
  - `"transform"`
  - `"transform3d"`
  - `"ik"`
  - `"ik3d"`
  - `"fk"`
  - `"fk3d"`
- `"rig"` is absent from `identifiedCatalog`, `builtinCatalog`, and `package.json` `exports`.

## 5. Mathematical operations & aggregate dataflow architecture

### 5.1 Explicit acyclic pipeline dataflow

The aggregate architecture forms a clean, unidirectional directed acyclic graph:

```text
[ Root Record Track ("root") ] ──┬──────────────────────┬──────────────────────┐
                                 │                      │                      │
[ Body Table Track ("body") ] ───┼──────────┬───────────┼──────────┐           │
                                 │ base     │ chain     │ base     │ chain     │
[ Goals Table Track ("goals") ] ─┼── goals  │           │          │           │
                                 ▼          │           │          │           │
                     [ IK Solver ("solve") ]│           │          │           │
                                 │          │           │          │           │
                                 │ solved   │           │          │           │
                                 ▼          ▼           │          │           │
                          [ FK Pose ("pose") ]          │          │           │
                                 │                      │          │           │
                                 ├──────────────────────┼──────────┘           │
                                 │ pose                 │                      │
                                 ▼                      ▼                      ▼
                       [ Classifier ("classify") ] [ Three.js Driver ] [ App Renderers ]
```

Every dependency edge is explicit. No hidden member state, solver fan-in, or reverse inspection
occurs.

### 5.2 Whole-table batching mathematics in pose-gap-filler

In `apps/pose-gap-filler/src/rig/writer.ts`:

- The writer computes measured limb lengths:
  `upperLength = distance2d(shoulder, elbow);`
  `lowerLength = distance2d(elbow, wrist);`
- Emits 8 body rows with calculated lengths and root pivot offsets.
- Emits 4 goal rows with target landmark positions `[targetX, targetY]`.
- Batch update invokes:
  `transaction.track(BODY_TRACK_ID).input.values.set(bodyRows);`
  `transaction.track(GOALS_TRACK_ID).input.values.set(goalRows);`
- If landmark visibility is lost, previous valid row is retained, maintaining continuity.

### 5.3 Three.js bone matrix decomposition and frame composition

In `packages/three/src/skeleton-tracks.ts`:

- Rest matrix for bone `i` relative to parent: `localMatrix = parentInverse * worldMatrix`.
- Decomposed to frame via `frameFromMatrix(localMatrix)`.
- Position `x, y, z` and Euler angles `rotation, rotationX, rotationY` populated into body row cells.
- FK3D recomposes world matrices along the hierarchy:
  `worldMatrix = parentWorldMatrix * localTransformMatrix`.
- `tableFrameSource` feeds world transforms back into `createSkeletonDriver`.

### 5.4 Classifier geodesic distance calculation

In `packages/plugins/src/pose-classify.ts`:

- For each template candidate:
  `distance = sum_{bone in template} geodesicDistance(templateBoneRotation, poseBoneRotation);`
- If any template bone is missing from the pose table:
  `distance = Infinity;`
- Minimum distance candidate selected. If `minDistance <= maxDistance`, label is assigned with
  `confidence = 1 - minDistance / maxDistance`. Otherwise `unknownLabel` with confidence `0`.

## 6. Row selection algorithms & closed discriminated unions

### 6.1 `lookupPoseRow` closed discriminated union

All table consumers select rows using an explicit closed discriminated union:

```ts
type PoseRowLookup<T> =
  | { readonly kind: "found"; readonly row: T }
  | { readonly kind: "missing"; readonly id: string };

function lookupPoseRow<T extends { readonly id: string }>(
  rowsById: ReadonlyMap<string, T>,
  id: string,
): PoseRowLookup<T> {
  const row = rowsById.get(id);
  return row === undefined ? { kind: "missing", id } : { kind: "found", row };
}
```

Exhaustive verification:

```ts
switch (lookup.kind) {
  case "found":
    return processRow(lookup.row);
  case "missing":
    handleMissingRow(lookup.id);
    break;
  default:
    return unreachable(lookup);
}
```

### 6.2 Three.js `tableFrameSource` row lookup

```ts
export function tableFrameSource(poseTable: unknown): FrameSource {
  if (!Array.isArray(poseTable)) return () => undefined;
  const rowsById = new Map<string, Readonly<Record<string, unknown>>>();
  for (const row of poseTable) {
    if (
      row &&
      typeof row === "object" &&
      typeof (row as { id?: unknown }).id === "string" &&
      (row as { cells?: unknown }).cells &&
      typeof (row as { cells?: unknown }).cells === "object"
    ) {
      rowsById.set(
        (row as { id: string }).id,
        (row as { cells: Readonly<Record<string, unknown>> }).cells,
      );
    }
  }
  return (source: string) => rowsById.get(source);
}
```

When `read(drive.source)` returns `undefined`, `skeleton-driver.ts` records:
`{ kind: "held", reason: "source-missing" }`.

### 6.3 Pose-gap-filler `readSolvedLimb` row selection

```ts
export function readSolvedLimb(
  project: ProjectHandle,
  limb: LimbId,
  keys: readonly string[] = ["x", "y"],
): SolvedLimb {
  const patch = project.get(poseNodeId(POSE_TRACK_ID));
  if (!patch || patch.status !== "ready" || !Array.isArray(patch.values)) {
    return { middle: undefined, tip: undefined };
  }
  const rowsById = new Map<string, AggregateRow>();
  for (const row of patch.values) {
    if (row && typeof row === "object" && typeof row.id === "string") {
      rowsById.set(row.id, row as AggregateRow);
    }
  }
  const upperLookup = lookupPoseRow(rowsById, upperMemberId(limb));
  const lowerLookup = lookupPoseRow(rowsById, lowerMemberId(limb));
  if (upperLookup.kind === "missing" || lowerLookup.kind === "missing") {
    return { middle: undefined, tip: undefined };
  }
  return {
    middle: [
      readNumber(upperLookup.row.cells[keys[0]]),
      readNumber(upperLookup.row.cells[keys[1]]),
    ],
    tip: [readNumber(lowerLookup.row.cells[keys[0]]), readNumber(lowerLookup.row.cells[keys[1]])],
  };
}
```

## 7. Concrete worked examples & dataflow traces

### 7.1 Multi-track engine execution trace

Consider a project with `root`, `body`, `goals`, `solve` (`ik`), `pose` (`fk`), and `classify`
(`pose-classify`):

1. Engine initialization:
   - Graph compiler builds `GraphIR`. Verified order: `root`, `body`, `goals`, `solve`, `pose`, `classify`.
   - `deriveDependants`:
     - `root` -> `["demo/solve", "demo/pose"]`
     - `body` -> `["demo/solve", "demo/pose"]`
     - `goals` -> `["demo/solve"]`
     - `solve` -> `["demo/pose"]`
     - `pose` -> `["demo/classify"]`
2. First flush (`engine.flush()`):
   - `root`, `body`, `goals` evaluate authored input values.
   - `solve` composed via `composeIdentified`: reads `body`, `goals`, `root`. Emits solved table.
   - `pose` composed via `composeIdentified`: reads `body`, `solve`, `root`. Emits pose table.
   - `classify` composed via `composeIdentified`: reads `pose`. Emits `{ label: "standing", confidence: 0.98 }`.
   - Result: Exactly 1 invocation per node in topological order.
3. Live edit:
   - Caller updates a cell in `goals`: `handle.track("demo/goals").input.values.set(...)`.
   - Engine flush marks `solve` dirty.
   - `solve` re-evaluates -> revision advances -> marks `pose` dirty.
   - `pose` re-evaluates -> revision advances -> marks `classify` dirty.
   - `classify` re-evaluates.
   - Unrelated tracks (`root`, `body`) remain untouched.

### 7.2 Pose-gap-filler 4-limb batch update worked example

Camera detects new landmarks for left arm:

- Left shoulder: `(100, 150)`
- Left elbow: `(130, 190)` -> length = `sqrt(30^2 + 40^2) = 50`
- Left wrist: `(160, 230)` -> length = `sqrt(30^2 + 40^2) = 50`
- Left goal: `[160, 230]`

Writer updates tables:

- `bodyRows`:
  - `left-arm-upper`: `{ length: 50, x: 100, y: 150, rotation: 0, weight: 1 }`
  - `left-arm-lower`: `{ parentId: "left-arm-upper", length: 50, x: 0, y: 0, rotation: 0, weight: 1 }`
  - (right arm, left leg, right leg retain previous rows)
- `goalRows`:
  - `left-arm-goal`: `{ memberId: "left-arm-lower", x: 160, y: 230 }`
  - (other 3 limbs retain previous goal rows)
- Transaction commits both tables in a single batch.

### 7.3 Three.js skeleton driver frame update worked example

3-bone skeleton: `hip` -> `thigh` -> `shin`.

- Published FK3D pose table:
  - Row 0: `id: "hip"`, `cells: { x: 0, y: 10, z: 0, rotation: 0, rotationX: 0, rotationY: 0 }`
  - Row 1: `id: "thigh"`, `cells: { x: 0, y: 5, z: 0, rotation: 15, rotationX: 0, rotationY: 0 }`
  - Row 2: `id: "shin"`, `cells: { x: 0, y: 0, z: 0, rotation: -30, rotationX: 0, rotationY: 0 }`
- `tableFrameSource` maps `"hip"`, `"thigh"`, `"shin"`.
- Driver queries `"thigh"`: retrieves `{ x: 0, y: 5, z: 0, rotation: 15, rotationX: 0, rotationY: 0 }`.
- Applies parent-space compensation and sets Object3D transform.
- Driver queries `"unmapped-tail"`: returns `undefined`. Driver records `{ kind: "held", reason: "source-missing" }`.

## 8. Frozen golden values & test fixtures

### 8.1 Graph IR and dependency map golden fixture

```json
{
  "order": ["demo/root", "demo/body", "demo/goals", "demo/solve", "demo/pose", "demo/classify"],
  "dependants": {
    "demo/root": ["demo/solve", "demo/pose"],
    "demo/body": ["demo/solve", "demo/pose"],
    "demo/goals": ["demo/solve"],
    "demo/solve": ["demo/pose"],
    "demo/pose": ["demo/classify"]
  }
}
```

### 8.2 Pose-gap-filler 8-bone humanoid body and goals golden fixture

```json
{
  "body": [
    {
      "id": "left-arm-upper",
      "cells": { "length": 50, "rotation": 0, "weight": 1, "x": -20, "y": 40 }
    },
    {
      "id": "left-arm-lower",
      "cells": {
        "parentId": "left-arm-upper",
        "length": 45,
        "rotation": 0,
        "weight": 1,
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "right-arm-upper",
      "cells": { "length": 50, "rotation": 0, "weight": 1, "x": 20, "y": 40 }
    },
    {
      "id": "right-arm-lower",
      "cells": {
        "parentId": "right-arm-upper",
        "length": 45,
        "rotation": 0,
        "weight": 1,
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "left-leg-upper",
      "cells": { "length": 60, "rotation": 0, "weight": 1, "x": -15, "y": -10 }
    },
    {
      "id": "left-leg-lower",
      "cells": {
        "parentId": "left-leg-upper",
        "length": 55,
        "rotation": 0,
        "weight": 1,
        "x": 0,
        "y": 0
      }
    },
    {
      "id": "right-leg-upper",
      "cells": { "length": 60, "rotation": 0, "weight": 1, "x": 15, "y": -10 }
    },
    {
      "id": "right-leg-lower",
      "cells": {
        "parentId": "right-leg-upper",
        "length": 55,
        "rotation": 0,
        "weight": 1,
        "x": 0,
        "y": 0
      }
    }
  ],
  "goals": [
    { "id": "left-arm-goal", "cells": { "memberId": "left-arm-lower", "x": -45, "y": 10 } },
    { "id": "right-arm-goal", "cells": { "memberId": "right-arm-lower", "x": 45, "y": 10 } },
    { "id": "left-leg-goal", "cells": { "memberId": "left-leg-lower", "x": -15, "y": -120 } },
    { "id": "right-leg-goal", "cells": { "memberId": "right-leg-lower", "x": 15, "y": -120 } }
  ]
}
```

### 8.3 Three.js 3D skeleton pose table golden fixture

```json
{
  "pose": [
    {
      "id": "hip",
      "cells": { "x": 0, "y": 10, "z": 0, "rotation": 0, "rotationX": 0, "rotationY": 0 }
    },
    {
      "id": "spine",
      "cells": { "x": 0, "y": 25, "z": 0, "rotation": 5, "rotationX": 2, "rotationY": 0 }
    },
    {
      "id": "head",
      "cells": { "x": 0, "y": 40, "z": 0, "rotation": 10, "rotationX": 4, "rotationY": -2 }
    }
  ]
}
```

## 9. Slice 6 — Explicit aggregate graph and publisher cleanup

**Owner:** `packages/core/src/graph` and `packages/core/src/runtime`.

**Files this slice may change, and no others:**

```text
packages/core/src/graph/ir.ts
packages/core/src/graph/ir.md
packages/core/src/runtime/graph-publisher.ts
packages/core/src/runtime/graph-runtime.ts
packages/core/src/runtime/project-runtime.ts
packages/core/src/runtime/publisher-outcome.ts
packages/core/src/graph/solver-constraints.ts                      (deleted)
packages/core/test/integration/aggregate-graph-publisher.test.ts   (added)
packages/core/test/unit/scripts/evidence-case-ids.test.ts          (AM added to CASE_TITLE)
docs/SESSION-STATUS.md
```

### 9.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm clean working tree.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`,
   `npm run test:read-budget`.
2. **Write red tests first:**
   - Create `packages/core/test/integration/aggregate-graph-publisher.test.ts` declaring cases `AM-1`
     through `AM-10`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AM` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run packages/core/test/integration/aggregate-graph-publisher.test.ts`.
   - Record assertion-level failing-first failures against existing core runtime.
4. **Implement source changes:**
   - Delete `packages/core/src/graph/solver-constraints.ts`.
   - In `packages/core/src/graph/ir.ts`: remove `solves` from `GraphNode`, remove `resolveSolvers`,
     remove `solves` branch in `deriveDependants`, remove `resolveSolvers` call in `buildGraphIR`.
   - In `packages/core/src/graph/ir.md`: remove sections referencing `solves` and `resolveSolvers`,
     keeping member order synchronized.
   - In `packages/core/src/runtime/graph-publisher.ts`: remove `MemberState` and `SolverMember`,
     remove `interpolated` on `PublisherNode`, remove lines 407-446 solver fan-in in `#collectInputs`.
   - In `packages/core/src/runtime/graph-runtime.ts` and `project-runtime.ts`: clean up publisher node
     instantiation.
5. **Verify focused green:**
   - Run `npx vitest run packages/core/test/integration/aggregate-graph-publisher.test.ts`. All 10
     tests pass.
6. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm run test:read-budget`,
     `npm test`.
7. **Exit checks & mutation verification:**
   - Verify mutants M1 through M4 fail their respective tests.
8. **Commit and status rewrite:**
   - Commit with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 9.2 Test cases for Slice 6 (`packages/core/test/integration/aggregate-graph-publisher.test.ts`)

Series: `AM`

- `AM-1`: Explicit aggregate graph construction. A project with `root`, `body`, `goals`, `solve` (ik),
  and `pose` (fk) compiles to `GraphIR` with purely explicit edges and `solves === undefined`.
- `AM-2`: Clean reverse topology. `graph.dependants` maps `root` -> `["demo/solve", "demo/pose"]`,
  `body` -> `["demo/solve", "demo/pose"]`, `goals` -> `["demo/solve"]`, `solve` -> `["demo/pose"]`. No
  phantom member entries exist.
- `AM-3`: Acyclic topological ordering. Graph order guarantees `root` and `body` precede `solve`,
  `solve` precedes `pose`, and `pose` precedes downstream consumers.
- `AM-4`: Publisher composition via `composeIdentified`. During engine execution, `ik` and `fk` nodes
  are composed purely through `requires: ResolvedRequires` with frozen table/record outputs.
- `AM-5`: Single composition per flush. Modifying a cell in `body` triggers exactly one IK evaluation
  and exactly one FK evaluation in a single engine flush.
- `AM-6`: Source revision tracking. Modifying `goals` advances source revision for `solve` and
  subsequently `pose`, leaving unrelated tracks untouched.
- `AM-7`: Blocked state propagation. If `body` is blocked, both `solve` and `pose` transition to
  `blocked` status through ordinary explicit dependency propagation.
- `AM-8`: Error state propagation. If `solve` throws or fails validation, `pose` transitions to
  `blocked` status naming `solve` as the unready source.
- `AM-9`: Multi-branch tree acyclicity. A body table with four independent limbs attached to external
  base compiles cleanly without cyclic dependency diagnostics.
- `AM-10`: No hidden member interpolation reads. Verify by module mock that no `interpolated()` function
  is invoked during graph publication.

### 9.3 Commit message for Slice 6

```text
refactor(core): clean up explicit aggregate graph and publisher

Slice 6 purges the retired grouped solver fan-in machinery from core graph and
runtime. `GraphNode.solves`, `resolveSolvers`, publisher `MemberState`/`SolverMember`,
solver-scope diagnostics, member interpolation, and grouped solver constraints
are completely removed. Graph reverse dependants and publisher inputs are derived
purely from explicit authored edges.

Evidence: red run against old runtime, aggregate graph publisher 10 tests green,
full suite passed, typecheck, format:check, boundaries passed, read-budget passed.
Mutants M1 through M4 each failed the named test. No pending ledger entries removed.
```

### 9.4 Status rewrite for Slice 6

```text
## Now

- **Explicit aggregate graph and publisher:** `packages/core/src/graph` and `packages/core/src/runtime`
  compose aggregate plugins purely through explicit declared requirement edges, with no hidden
  solver fan-in or member interpolation. 73 Phase 5, 4 Phase 6 and 2 Phase 7 pending entries remain.

## Next in line

- **Pose-gap-filler aggregate migration:** replace 28 member tracks with 5 aggregate tracks (`root`,
  `body`, `goals`, `solve`, `pose`) and whole-table batch writes.
```

## 10. Slice 7 — Pose-gap-filler aggregate migration

**Owner:** `apps/pose-gap-filler/src/rig`.

**Files this slice may change, and no others:**

```text
apps/pose-gap-filler/src/rig/tracks.ts
apps/pose-gap-filler/src/rig/rig.ts
apps/pose-gap-filler/src/rig/writer.ts
apps/pose-gap-filler/test/rig-aggregate.test.ts                     (added)
apps/pose-gap-filler/test/avatar-viewport.test.ts                   (un-pended)
apps/pose-gap-filler/test/avatar.test.ts                            (un-pended)
apps/pose-gap-filler/test/bend-boundaries.test.ts                  (un-pended)
apps/pose-gap-filler/test/bend-fallback.test.ts                    (un-pended)
apps/pose-gap-filler/test/chain-replay.test.ts                     (un-pended)
apps/pose-gap-filler/test/gltf-avatar-lifecycle.test.ts            (un-pended)
apps/pose-gap-filler/test/inferred-bends.test.ts                   (un-pended)
apps/pose-gap-filler/test/persistent-avatar.test.ts                 (un-pended)
apps/pose-gap-filler/test/phone-persistence.test.ts                (un-pended)
apps/pose-gap-filler/test/record.test.ts                           (un-pended)
apps/pose-gap-filler/test/replay.test.ts                           (un-pended)
apps/pose-gap-filler/test/rig.test.ts                              (un-pended)
apps/pose-gap-filler/test/stabilizer.test.ts                       (un-pended)
apps/pose-gap-filler/test/world.test.ts                            (un-pended)
test/pending.json                                                  (14 entries removed)
packages/core/test/unit/scripts/pending-ledger.test.ts             (PENDING_CEILING = 65)
packages/core/test/unit/scripts/evidence-case-ids.test.ts          (AN added to CASE_TITLE)
docs/SESSION-STATUS.md
```

### 10.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm clean working tree.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`.
2. **Write red tests first:**
   - Create `apps/pose-gap-filler/test/rig-aggregate.test.ts` declaring cases `AN-1` through `AN-10`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AN` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run apps/pose-gap-filler/test/rig.test.ts`. Fails against unmigrated 28-track
     rig.
4. **Implement source changes:**
   - In `apps/pose-gap-filler/src/rig/tracks.ts`: export aggregate track ID constants and member id
     helpers.
   - In `apps/pose-gap-filler/src/rig/rig.ts`: author 5 aggregate tracks for `imageRigProject` and
     `worldRigProject`; implement `readSolvedLimb` row selection by member ID.
   - In `apps/pose-gap-filler/src/rig/writer.ts`: implement whole-table batch writes via
     `input.values.set(bodyRows)` and `input.values.set(goalRows)`.
5. **Un-pend the 14 application test suites:**
   - Remove `// @ts-nocheck` line 1 from all 14 test files in `apps/pose-gap-filler/test/`.
   - Remove the 14 entries from `test/pending.json`.
   - Lower `PENDING_CEILING` in `packages/core/test/unit/scripts/pending-ledger.test.ts` from 79 to 65.
6. **Verify focused green & build:**
   - Run `npx vitest run apps/pose-gap-filler/test/`. All 14 suites + new `rig-aggregate.test.ts` pass.
   - Run `npm run build --workspace=@motion5/pose-gap-filler`.
7. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm test`.
8. **Commit and status rewrite:**
   - Commit with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 10.2 Test cases for Slice 7 (`apps/pose-gap-filler/test/rig-aggregate.test.ts`)

Series: `AN`

- `AN-1`: 5-track aggregate project mounting. `imageRigProject` and `worldRigProject` mount exactly
  five tracks: `root`, `body`, `goals`, `solve`, and `pose`.
- `AN-2`: 8-bone humanoid body table validation. Body table contains 8 rows; upper bones attach to
  external base; lower bones attach to upper bones with non-zero length.
- `AN-3`: 4-leaf goal addressing. Goal table addresses all 4 limb leaves; zero unaddressed leaves.
- `AN-4`: Whole-table batching call count. Camera landmark update commits both body and goals in a
  single transaction, triggering exactly one solver pass and one pose pass.
- `AN-5`: Id-based solved limb readout. `readSolvedLimb` resolves upper and lower joints by member id,
  returning correct middle and tip coordinates.
- `AN-6`: Skipped limb continuity. When landmark detection drops a limb, previous valid rows are
  retained, preventing unaddressed leaf errors.
- `AN-7`: World-space 3D rig execution. `worldRigProject` mounts aggregate 3D tracks, evaluates
  `ik3d` and `fk3d`, and outputs 3D world coordinates.
- `AN-8`: Avatar viewport synchronization. Rendered avatar limb meshes bind to solved pose table
  rows without record-map shims.
- `AN-9`: Persistent avatar lifecycle. Saving and restoring pose-gap-filler project state preserves
  aggregate table keyframe tracks.
- `AN-10`: Chain replay determinism. Replaying recorded landmark frames reproduces identical pose table
  outputs across repeated runs.

### 10.3 Commit message for Slice 7

```text
refactor(pose-gap-filler): migrate rig to 5 aggregate tracks

Slice 7 replaces pose-gap-filler's 28 individual member tracks with 5 explicit
aggregate tracks per space (`root`, `body`, `goals`, `solve`, `pose`). The writer
performs whole-table batch writes via `input.values.set(...)`, and limb pose
readouts select rows strictly by member ID. 14 pending test suites are un-pended
and verified passing.

Evidence: red run against old rig, 14 suites + aggregate rig 10 tests green, app build
passed, full suite passed, typecheck, format:check, boundaries passed. Mutants M5
through M8 each failed the named test. 14 Phase 5 pending ledger entries retired;
65 remain.
```

### 10.4 Status rewrite for Slice 7

```text
## Now

- **Pose-gap-filler reads aggregate tables:** `apps/pose-gap-filler/src/rig` authors 5 aggregate
  tracks per space, writes whole-table batches, and selects solved rows by member id. 14 pending
  suites retired; 59 Phase 5, 4 Phase 6 and 2 Phase 7 pending entries remain.

## Next in line

- **Three.js aggregate migration:** `packages/three` skeleton tracks emit aggregate 3D tracks and
  select pose rows by bone key without rig tracks or record-map shims.
```

## 11. Slice 8 — Three.js aggregate migration

**Owner:** `packages/three`.

**Files this slice may change, and no others:**

```text
packages/three/src/skeleton-tracks.ts
packages/three/src/skeleton-driver.ts
packages/three/src/skeleton.ts
packages/three/test/skeleton-aggregate.test.ts                     (added)
packages/core/test/unit/scripts/evidence-case-ids.test.ts          (AO added to CASE_TITLE)
docs/SESSION-STATUS.md
```

### 11.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm clean working tree.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`.
2. **Write red tests first:**
   - Create `packages/three/test/skeleton-aggregate.test.ts` declaring cases `AO-1` through `AO-10`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AO` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run packages/three/test/skeleton-aggregate.test.ts`. Fails against unmigrated
     `skeletonTracks` (which emits `-rig` track).
4. **Implement source changes:**
   - In `packages/three/src/skeleton-tracks.ts`: emit `${idPrefix}-root`, `${idPrefix}-body`,
     `${idPrefix}-solved`, `${idPrefix}-pose` (fk3d). Omit rig track completely.
   - In `packages/three/src/skeleton-driver.ts`: delete `readRigValues` import and `rigFrameSource`.
     Add `tableFrameSource(poseTable: unknown): FrameSource`.
   - In `packages/three/src/skeleton.ts`: export `tableFrameSource`, remove `rigFrameSource`.
5. **Verify focused green:**
   - Run `npx vitest run packages/three/test/`. All active tests and `skeleton-aggregate.test.ts` pass.
6. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm test`.
7. **Exit checks & mutation verification:**
   - Verify mutants M9 through M12 fail their respective tests.
8. **Commit and status rewrite:**
   - Commit with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 11.2 Test cases for Slice 8 (`packages/three/test/skeleton-aggregate.test.ts`)

Series: `AO`

- `AO-1`: Aggregate 3D skeleton track generation. `skeletonTracks` emits exactly four tracks:
  `${idPrefix}-root`, `${idPrefix}-body`, `${idPrefix}-solved`, `${idPrefix}-pose`. Zero rig tracks
  emitted.
- `AO-2`: Body table bone hierarchy. Body table contains all captured bones in canonical root-first
  order with correct `parentId` references and rest transforms.
- `AO-3`: `tableFrameSource` row lookup by bone key. `tableFrameSource` indexes FK3D pose table rows
  and retrieves cell transforms by bone key.
- `AO-4`: Missing row reporting. Querying an absent bone key returns `undefined`, and
  `createSkeletonDriver` records `{ kind: "held", reason: "source-missing" }`.
- `AO-5`: Non-table input safety. Passing non-array or malformed data to `tableFrameSource` returns a
  noop reader returning `undefined` without throwing.
- `AO-6`: Hierarchical world matrix propagation. Driving a Three.js skeleton through `tableFrameSource`
  updates Object3D world matrices matching expected transforms within 1e-6.
- `AO-7`: Unmapped intermediate bone handling. Unmapped bones in the hierarchy preserve parent
  transform propagation to children.
- `AO-8`: Basis drive compensation. Basis-driven bones correctly apply relative basis rotations over
  pose table inputs.
- `AO-9`: Aim drive constraint preservation. Aim-driven bones orient toward target positions
  computed from pose table frames.
- `AO-10`: End-to-end engine execution. Complete project with skeleton tracks mounts in `Engine`,
  evaluates `fk3d`, and drives a Three.js SkinnedMesh cleanly.

### 11.3 Commit message for Slice 8

```text
refactor(three): migrate skeleton tracks and driver to aggregate tables

Slice 8 updates `packages/three` to consume aggregate FK3D pose tables:
`skeletonTracks` emits 4 aggregate tracks (`root`, `body`, `solved`, `pose`) and
no rig track. `skeleton-driver.ts` removes `readRigValues` and introduces
`tableFrameSource`, selecting pose rows strictly by bone key. All existing
driver invariants (parent-space compensation, basis/aim drives, rest resets,
finiteness) are preserved.

Evidence: red run against old skeletonTracks, 10 aggregate Three tests green, full suite
passed, typecheck, format:check, boundaries passed. Mutants M9 through M12 each
failed the named test. Pending ledger unchanged at 65.
```

### 11.4 Status rewrite for Slice 8

```text
## Now

- **Three.js reads aggregate tables:** `packages/three` skeleton tracks emit aggregate 3D tracks and
  select pose rows by bone key via `tableFrameSource`. No rig tracks remain; 59 Phase 5, 4 Phase 6
  and 2 Phase 7 pending entries remain.

## Next in line

- **Classifier and remaining consumers:** bind `pose-classify` directly to FK pose table and migrate
  remaining playground and plugin consumers.
```

## 12. Slice 9 — Classifier and remaining consumers

**Owner:** `packages/plugins/src/pose-classify.ts`, labels, React, and remaining app readers.

**Files this slice may change, and no others:**

```text
packages/plugins/src/pose-classify.ts
packages/plugins/test/integration/pose-classify-aggregate.test.ts  (added)
packages/plugins/test/pose-classify.test.ts                        (un-pended, ported)
packages/plugins/test/labels.test.ts                               (un-pended, ported)
packages/core/test/integration/react-demo-rig.test.ts              (un-pended, ported)
packages/core/test/integration/ik-fabrik-chain.test.ts             (un-pended, ported)
packages/core/test/integration/ik-multi-goal.test.ts               (un-pended, ported)
packages/core/test/integration/ik-playground-motion-progress.test.ts (un-pended, ported)
packages/core/test/integration/ik-playground-scroll-rest.test.ts   (un-pended, ported)
packages/core/test/integration/ik-two-bone.test.ts                 (un-pended, ported)
packages/core/test/integration/ik3d-playground.test.ts             (un-pended, ported)
packages/core/test/integration/ik3d-two-bone.test.ts               (un-pended, ported)
packages/plugins/test/integration/ik-envelope.test.ts              (un-pended, ported)
packages/plugins/test/integration/ik-guide-examples.test.ts        (un-pended, ported)
packages/plugins/test/integration/ik-stability.test.ts             (un-pended, ported)
packages/plugins/test/integration/ik3d-guide-examples.test.ts      (un-pended, ported)
packages/plugins/test/integration/ik3d-joint.test.ts               (un-pended, ported)
packages/plugins/test/integration/ik3d-orient.test.ts              (un-pended, ported)
packages/plugins/test/integration/ik3d-tree.test.ts                (un-pended, ported)
packages/plugins/test/integration/live-edit-ensure.test.ts         (un-pended, ported)
packages/plugins/test/integration/live-value-composition.test.ts   (un-pended, ported)
packages/plugins/test/integration/mutation-transactionality.test.ts (un-pended, ported)
packages/plugins/test/integration/per-plugin-key-ownership.test.ts (un-pended, ported)
packages/plugins/test/integration/plugin-owned-requirements.test.ts (un-pended, ported)
packages/plugins/test/integration/single-input-channel.test.ts     (un-pended, ported)
packages/plugins/test/unit/loader.test.ts                          (un-pended, ported)
test/pending.json                                                  (24 entries removed)
packages/core/test/unit/scripts/pending-ledger.test.ts             (PENDING_CEILING = 41)
packages/core/test/unit/scripts/evidence-case-ids.test.ts          (AP added to CASE_TITLE)
docs/SESSION-STATUS.md
```

### 12.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm clean working tree.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`.
2. **Write red tests first:**
   - Create `packages/plugins/test/integration/pose-classify-aggregate.test.ts` declaring cases `AP-1`
     through `AP-10`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AP` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run packages/plugins/test/integration/pose-classify-aggregate.test.ts`. Fails
     against `pose-classify` requiring `rig` slot.
4. **Implement source changes:**
   - In `packages/plugins/src/pose-classify.ts`: change requirement from `rig` to `pose: { outputs: { values: POSE_3D_SPEC } }`.
   - Extract rows via `tableOutput(requires.pose, "pose")`, index by `row.id`, evaluate template
     distances, emit flat `{ values: { label, confidence } }`.
5. **Un-pend and port 24 consumer test suites:**
   - Remove `// @ts-nocheck` line 1 from all 24 files listed above.
   - Port their rig track definitions to aggregate FK pose tracks.
   - Remove the 24 entries from `test/pending.json`.
   - Lower `PENDING_CEILING` in `packages/core/test/unit/scripts/pending-ledger.test.ts` from 65 to 41.
6. **Verify focused green & build:**
   - Run `npx vitest run packages/plugins/test/` and `npx vitest run packages/core/test/integration/`.
   - Run `npm run build --workspace=@motion5/react-demo` and `npm run build --workspace=@motion5/ik-playground`.
7. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm test`.
8. **Commit and status rewrite:**
   - Commit with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 12.2 Test cases for Slice 9 (`packages/plugins/test/integration/pose-classify-aggregate.test.ts`)

Series: `AP`

- `AP-1`: Aggregate pose requirement declaration. `pose-classify` declares single-source slot `pose`
  outputting `values: POSE_3D_SPEC`. Legacy slot `rig` is undefined.
- `AP-2`: Flat output publication. Output is published under `values` as `{ label: string, confidence: number }`.
- `AP-3`: Id-based template bone lookup. Bone transforms are resolved strictly by matching `row.id`
  to template bone keys, independent of row array order.
- `AP-4`: Missing template bone handling. A pose table missing a required template bone results in
  infinite distance, yielding `unknownLabel` with 0 confidence.
- `AP-5`: Unreferenced bone invariance. Extra bones in the pose table do not affect classification.
- `AP-6`: Distance tie-break determinism. Equal minimum distance candidates break ties deterministically
  by template definition order.
- `AP-7`: Engine pipeline integration. `root` -> `body` + `solved` -> `pose` (fk) -> `classify`
  pipeline executes in Engine and publishes ready classification patch.
- `AP-8`: Label change notification delivery. Modifying bone rotations across a classification threshold
  triggers `onLabelChange` listener.
- `AP-9`: Single evaluation per flush. Updating pose table triggers exactly one classifier evaluation.
- `AP-10`: 2D and 3D pose table interoperability. `pose-classify` operates identically when consuming
  2D or 3D FK pose tables.

### 12.3 Commit message for Slice 9

```text
refactor(plugins): bind pose-classify directly to fk pose table

Slice 9 migrates `pose-classify` to consume the aggregate FK pose table directly
via `requires: { pose: { outputs: { values: POSE_3D_SPEC } } }`. Rows are selected
by `row.id`, and flat classification results `{ label, confidence }` are published
as `values`. 24 pending suites across plugins, playground, and react-demo are
ported and un-pended.

Evidence: red run against old classifier, 10 aggregate classifier tests green, 24 ported
suites green, playground and react-demo builds passed, full suite passed, typecheck,
format:check, boundaries passed. Mutants M13 through M16 each failed the named test.
24 Phase 5 pending entries retired; 41 remain.
```

### 12.4 Status rewrite for Slice 9

```text
## Now

- **Classifier reads aggregate pose tables:** `packages/plugins/src/pose-classify.ts` binds directly
  to FK pose tables, publishing flat label records. 24 pending suites retired; 35 Phase 5, 4 Phase 6
  and 2 Phase 7 pending entries remain.

## Next in line

- **Rig retirement and Phase 5 closeout:** delete v5 and legacy rig plugins, remove rig subpaths and
  catalogs, add deletion tests, and retire final Phase 5 pending suites.
```

## 13. Slice 10 — Rig retirement and Phase 5 closeout

**Owner:** package surface, catalogs, deletion tests, and documentation.

**Files this slice may change, and no others:**

```text
packages/plugins/package.json
packages/plugins/src/identified-catalog.ts
packages/plugins/src/catalog.ts
packages/plugins/src/rig.ts                                        (deleted)
packages/plugins/src/legacy/rig.ts                                 (deleted)
packages/plugins/src/legacy/rig-values.ts                          (deleted)
packages/plugins/test/unit/rig-v5.test.ts                          (deleted)
packages/plugins/test/rig.test.ts                                  (deleted)
packages/plugins/test/public-subpaths.test.ts
packages/plugins/test/unit/identified-catalog.test.ts
packages/plugins/test/integration/rig-retirement.test.ts           (added)
packages/core/test/unit/graph/arity-lift.test.ts                   (un-pended, ported)
packages/core/test/unit/graph/graph-dependants.test.ts             (un-pended, ported)
packages/core/test/unit/graph/ik3d-goal-weights-load.test.ts       (un-pended, ported)
packages/core/test/unit/graph/ik3d-joint-load.test.ts              (un-pended, ported)
packages/core/test/unit/graph/ik3d-tree-load.test.ts               (un-pended, ported)
packages/core/test/unit/graph/incremental-cache.test.ts            (un-pended, ported)
packages/core/test/unit/graph/resolve-solvers.test.ts              (un-pended, ported/deleted)
packages/core/test/unit/graph/solved-pivot-offset.test.ts          (un-pended, ported)
packages/core/test/unit/graph/solved-rotation-weight.test.ts       (un-pended, ported)
packages/core/test/unit/graph/solver-constraints.test.ts           (un-pended, ported/deleted)
packages/core/test/unit/graph/solver-goal-required.test.ts         (un-pended, ported)
packages/core/test/unit/graph/solver-goals.test.ts                 (un-pended, ported)
packages/core/test/unit/runtime/commit-write-cost.test.ts          (un-pended, ported)
packages/core/test/unit/runtime/declined-build-write-drop.test.ts  (un-pended, ported)
packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts (un-pended, ported)
packages/core/test/unit/runtime/publisher-solver-members.test.ts   (un-pended, ported)
packages/core/test/unit/runtime/recompile-predicate.test.ts        (un-pended, ported)
packages/core/test/unit/runtime/removal-flush-seed.pending.test.ts (un-pended, ported)
packages/core/test/contract/v5-validator.test.ts                   (un-pended, ported)
packages/core/test/unit/domain/dict-valued-requirements.test.ts    (un-pended, ported)
packages/core/test/unit/domain/plugin-3d-ownership.test.ts         (un-pended, ported)
packages/core/test/unit/domain/plugin-capabilities.test.ts         (un-pended, ported)
packages/core/test/unit/plugins/fk3d-rest-weight.test.ts           (un-pended, ported)
packages/core/test/unit/plugins/ik-goal-influence.test.ts          (un-pended, ported)
packages/core/test/integration/bare-authored-leaf.test.ts          (un-pended, ported)
packages/core/test/integration/contract-baseline.pending.test.ts   (un-pended, ported)
packages/core/test/integration/demo-runtime-authoring.test.ts      (un-pended, ported)
packages/core/test/integration/internal-key-strip.test.ts          (un-pended, ported)
packages/core/test/integration/keyframe-groups.test.ts             (un-pended, ported)
packages/core/test/integration/plugin-group-values-section.test.ts (un-pended, ported)
packages/core/test/integration/solver-member-cache.test.ts         (un-pended, ported)
packages/core/test/unit/plugins/ik-inspection.test.ts              (un-pended, ported)
packages/core/test/unit/plugins/ik3d-inspection.test.ts            (un-pended, ported)
packages/core/test/unit/plugins/ik3d-pole.test.ts                  (un-pended, ported)
test/pending.json                                                  (35 entries removed, exactly 6 remain)
packages/core/test/unit/scripts/pending-ledger.test.ts             (PENDING_CEILING = 6)
packages/core/test/unit/scripts/evidence-case-ids.test.ts          (AQ added to CASE_TITLE)
docs/ADR-138-rig-aggregation-and-pose-classification.md           (supersession notice)
docs/guide/api-reference.md                                        (remove rig, update classifier)
docs/SESSION-STATUS.md
```

### 13.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm clean working tree.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`.
2. **Write red deletion tests first:**
   - Create `packages/plugins/test/integration/rig-retirement.test.ts` declaring cases `AQ-1` through
     `AQ-12`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AQ` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run packages/plugins/test/integration/rig-retirement.test.ts`. Fails because `rig`
     is still exported and registered.
4. **Execute source deletions and catalog updates:**
   - Delete `packages/plugins/src/rig.ts`, `packages/plugins/src/legacy/rig.ts`,
     `packages/plugins/src/legacy/rig-values.ts`, `packages/plugins/test/unit/rig-v5.test.ts`,
     `packages/plugins/test/rig.test.ts`.
   - In `packages/plugins/package.json`: delete `"./rig"` and `"./internal/legacy/rig"` export subpaths.
   - In `packages/plugins/src/identified-catalog.ts`: delete `"rig"` descriptor.
   - In `packages/plugins/src/catalog.ts`: delete `"rig"` from `builtinCatalog`.
   - In `packages/plugins/test/public-subpaths.test.ts` and `identified-catalog.test.ts`: update
     assertions to pin the 6 surviving plugins and assert `rig` absence.
5. **Un-pend/port all remaining 35 Phase 5 suites:**
   - Port the 34 remaining core test files and remove `// @ts-nocheck`.
   - Remove all 35 Phase 5 entries from `test/pending.json`. Exactly 6 entries remain (4 Phase 6, 2
     Phase 7).
   - Lower `PENDING_CEILING` in `packages/core/test/unit/scripts/pending-ledger.test.ts` from 41 to 6.
6. **Update documentation:**
   - Add supersession header to `docs/ADR-138-rig-aggregation-and-pose-classification.md`.
   - Remove `@motion5/plugins/rig` and update `@motion5/plugins/pose-classify` in
     `docs/guide/api-reference.md`.
7. **Verify focused green & workspace builds:**
   - Run `npx vitest run packages/plugins/test/` and `npx vitest run packages/core/test/`.
   - Run `npm run build --workspace=@motion5/pose-gap-filler`, `npm run build --workspace=@motion5/ik-playground`,
     `npm run build --workspace=@motion5/react-demo`.
8. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm run test:read-budget`,
     `npm test`.
9. **Commit and status rewrite:**
   - Commit with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 13.2 Test cases for Slice 10 (`packages/plugins/test/integration/rig-retirement.test.ts`)

Series: `AQ`

- `AQ-1`: Public manifest export deletion. `packages/plugins/package.json` exports contain neither
  `"./rig"` nor `"./internal/legacy/rig"`. Surviving subpaths (`./fk`, `./ik`, `./transform`, etc.) are
  present.
- `AQ-2`: Identified catalog deletion. `identifiedCatalog.has("rig")` is false.
  `[...identifiedCatalog.keys()]` strictly equals `["transform", "transform3d", "ik", "ik3d", "fk",
"fk3d"]`.
- `AQ-3`: Builtin catalog deletion. `builtinCatalog.has("rig")` is false.
- `AQ-4`: Unknown plugin refusal. Attempting to mount a track with `plugin: "rig"` fails validation
  with an unknown-plugin diagnostic.
- `AQ-5`: No runtime rig symbols. Neither `@motion5/plugins` nor `@motion5/plugins/rig` exports
  `rigPlugin`, `legacyRigPlugin`, or `readRigValues`.
- `AQ-6`: GraphNode `solves` absence. `"solves" in ({} as GraphNode)` is rejected statically, and
  runtime compiled nodes have `node.solves === undefined`.
- `AQ-7`: Reverse topology cleanly explicit. No solver fan-in edges exist in compiled reverse topology.
- `AQ-8`: No hidden member reads during flush. Verified by spy that no member interpolation occurs.
- `AQ-9`: Pose-gap-filler rig retirement. `pose-gap-filler` loads and runs with zero references to rig
  plugins.
- `AQ-10`: Three.js rig retirement. `skeletonTracks` and `createSkeletonDriver` load and run with zero
  references to rig plugins.
- `AQ-11`: Pending ledger Phase 6 and 7 preservation. Exactly 6 entries remain in `test/pending.json`
  (4 Phase 6, 2 Phase 7). All 73 Phase 5 entries are retired.
- `AQ-12`: Phase 5 completion gate proof. All 14 gate conditions of section 12 of
  `phase5-completion-plan.md` are satisfied.

### 13.3 Commit message for Slice 10

```text
refactor(plugins): retire rig plugin and close out phase 5

Slice 10 completes Phase 5 by retiring the intermediate rig aggregation machinery:
- Deletes `rigPlugin`, `legacyRigPlugin`, and `readRigValues`.
- Removes `"./rig"` and `"./internal/legacy/rig"` from `packages/plugins/package.json`.
- Removes `"rig"` from `identifiedCatalog` and `builtinCatalog`.
- Adds rigorous property-in-object deletion verification tests.
- Retires the final 35 Phase 5 pending suites; exactly 6 entries remain in
  `test/pending.json` (4 Phase 6, 2 Phase 7).
- Updates ADR-138 with supersession notice and updates API documentation.

Evidence: deletion tests 12 green, all workspace builds passed, full test suite
passed, typecheck, format:check, boundaries passed, read-budget passed. Mutants
M17 through M20 each failed the named test. Phase 5 completion gate fulfilled.
```

### 13.4 Status rewrite for Slice 10

```text
## Now

- **Aggregate kinematics pipeline complete:** 2D/3D IK and FK consume identified tables and records
  through single-source slots; FK publishes complete pose tables; Three.js and pose-gap-filler select
  rows by id; rig plugins, `readRigValues` and hidden solver fan-in are deleted. All 73 Phase 5
  pending suites retired; 4 Phase 6 and 2 Phase 7 pending entries remain.

## Next in line

- **Phase 6 consumer migration:** migrate Three.js and React consumers to generated tracks and named
  outputs.
```

## 14. Guardrails, negative boundaries, invariants & mutation matrix

### 14.1 Negative boundaries: what must not change

- No modification to solver mathematics: `frame.ts`, `frame3d.ts`, `ik-solve.ts`, `ik3d-solve.ts`,
  and `fabrik.ts` must remain completely untouched.
- No modification to aggregate IK or FK plugins: `ik.ts`, `ik3d.ts`, `fk.ts`, and `fk3d.ts` must
  remain untouched throughout Slices 6-10.
- No modification to Phase 6 or Phase 7 pending entries: the 6 entries assigned to Phase 6 and 7 must
  remain in `test/pending.json` with exact paths and reasons.
- Output names remain `values`. Never introduce an output alias named `pose`.
- No table adaptation in generic core adapters: `createObject3dPatchAdapter` and `useDerivedDomPatch`
  remain neutral to table outputs.
- Author no markdown tables anywhere.

### 14.2 Correct versus wrong implementations

```ts
// CORRECT: Slice 6 - Reverse topology derived purely from explicit edges
for (const node of nodes) {
  for (const edge of node.edges) collected.get(edge.sourceId)?.push(node.id);
}
// WRONG: Retaining hidden solver fan-in loop
for (const member of node.solves) collected.get(member.id)?.push(node.id);

// CORRECT: Slice 7 - Whole-table batch writes in writer.ts
transaction.track(poseNodeId(BODY_TRACK_ID)).input.values.set(bodyRows);
transaction.track(poseNodeId(GOALS_TRACK_ID)).input.values.set(goalRows);
// WRONG: Updating individual cells or emitting per-member tracks
transaction.track(memberTrackId).cells.set({ x, y });

// CORRECT: Slice 7 & 8 - Selecting rows by member id from ready pose table
const row = rowsById.get(memberId);
// WRONG: Selecting by array index or first row
const row = poseTable[0];

// CORRECT: Slice 8 - tableFrameSource returns undefined for missing row
return (source: string) => rowsById.get(source);
// WRONG: Inventing a fallback zero frame
return (source: string) => rowsById.get(source) ?? ZERO_FRAME;

// CORRECT: Slice 9 - pose-classify requires FK pose table output
requires: {
  pose: {
    outputs: {
      values: POSE_3D_SPEC;
    }
  }
}
// WRONG: Retaining legacy rig requirement
requires: {
  rig: {
    outputs: {
      pose: POSE;
    }
  }
}

// CORRECT: Slice 10 - Deletion assertion compiling on both sides
expect(identifiedCatalog.has("rig")).toBe(false);
expect(identifiedCatalog.has("fk")).toBe(true);
// WRONG: Bare import of deleted module that fails to compile
import { rigPlugin } from "@motion5/plugins/rig";
```

### 14.3 Grep checklist for forbidden patterns

The following commands must exit with 0 matches across the repository upon completing Slice 10:

```text
git grep -n "resolveSolvers" packages/core/src/
git grep -n "solves\?:" packages/core/src/
git grep -n "MemberState" packages/core/src/runtime/
git grep -n "readRigValues" packages/ apps/
git grep -n 'plugin:\s*"rig"' packages/ apps/
git grep -n '"\./rig"' packages/plugins/package.json
git grep -n '"rig",' packages/plugins/src/identified-catalog.ts
```

### 14.4 Mutation test matrix across Slices 6-10

- **M1 (Slice 6):** In `ir.ts`, re-add a synthetic edge or fan-in for solver nodes.
  - Fails: `AM-1`, `AM-2`
- **M2 (Slice 6):** In `graph-publisher.ts`, invoke `compose` with merged inputs rather than `composeIdentified`.
  - Fails: `AM-4`
- **M3 (Slice 6):** In `ir.ts`, omit an explicit edge from reverse topology `deriveDependants`.
  - Fails: `AM-2`, `AM-6`
- **M4 (Slice 6):** In `graph-publisher.ts`, run multiple composition passes per flush for a single aggregate node.
  - Fails: `AM-5`
- **M5 (Slice 7):** In `writer.ts`, perform per-cell updates instead of whole-table `.set(...)`.
  - Fails: `AN-4`
- **M6 (Slice 7):** In `rig.ts`, lookup limb pose row by index `[0]` instead of `row.id === upperMemberId(limb)`.
  - Fails: `AN-3`, `AN-5`
- **M7 (Slice 7):** In `writer.ts`, emit empty goals table when a limb is skipped.
  - Fails: `AN-6`
- **M8 (Slice 7):** In `rig.ts`, fail to mount all five aggregate tracks on project load.
  - Fails: `AN-1`
- **M9 (Slice 8):** In `skeleton-tracks.ts`, emit a track with `plugin: "rig"`.
  - Fails: `AO-1`
- **M10 (Slice 8):** In `skeleton-driver.ts`, index pose rows by array position instead of `row.id`.
  - Fails: `AO-3`, `AO-6`
- **M11 (Slice 8):** In `tableFrameSource`, return a default flat frame when a row is missing instead of `undefined`.
  - Fails: `AO-4`
- **M12 (Slice 8):** In `skeleton-driver.ts`, omit parent transform propagation for unmapped intermediate bones.
  - Fails: `AO-7`
- **M13 (Slice 9):** In `pose-classify.ts`, require `rig` slot instead of `pose`.
  - Fails: `AP-1`
- **M14 (Slice 9):** In `pose-classify.ts`, lookup template rows by array index instead of `row.id`.
  - Fails: `AP-3`
- **M15 (Slice 9):** In `pose-classify.ts`, return a guessed label when a template bone is missing instead of `unknownLabel`.
  - Fails: `AP-4`
- **M16 (Slice 9):** In `pose-classify.ts`, publish output under key `pose` instead of `values`.
  - Fails: `AP-2`, `AP-7`
- **M17 (Slice 10):** In `packages/plugins/package.json`, retain `"./rig"` in exports.
  - Fails: `AQ-1`
- **M18 (Slice 10):** In `identified-catalog.ts`, retain `"rig"` entry.
  - Fails: `AQ-2`
- **M19 (Slice 10):** Allow project load with `plugin: "rig"`.
  - Fails: `AQ-4`
- **M20 (Slice 10):** Remove or alter any Phase 6 or Phase 7 pending entry.
  - Fails: `AQ-11`, `packages/core/test/unit/scripts/pending-ledger.test.ts`

## 15. Verification protocol, pending ledger accounting, Phase 5 completion gate & revision record

### 15.1 Verification protocol and command sequence

Every slice executes the complete verification gate in exact order before committing:

1. `npx prettier --write <touched-files>` (per-file prettier formatting).
2. `npm run format:check` (verify zero formatting drift across the repository).
3. `npm run typecheck` (verify full static typechecking across all packages and apps).
4. `npm run test:boundaries` (verify architecture boundaries and export conformance).
5. `npm run test:read-budget` (verify file size <= 60,000 bytes and sister document sync).
6. Focused Vitest execution for slice test files.
7. Full workspace test suite: `npm test` (all active test suites pass cleanly).
8. Affected application Vite builds:
   - Slice 7: `npm run build --workspace=@motion5/pose-gap-filler`
   - Slice 9: `npm run build --workspace=@motion5/ik-playground` and `npm run build --workspace=@motion5/react-demo`
   - Slice 10: All three application builds.

### 15.2 Pending ledger drawdown across Slices 6 to 10

The pending ledger in `test/pending.json` tracks tests blocked on unmigrated architecture. It draws
down monotonically:

- Baseline at commit `e31e029e`: 79 entries (73 Phase 5, 4 Phase 6, 2 Phase 7).
- After Slice 6: 79 entries (73 Phase 5, 4 Phase 6, 2 Phase 7). 0 retired.
- After Slice 7: 65 entries (59 Phase 5, 4 Phase 6, 2 Phase 7). 14 retired (`apps/pose-gap-filler/test/*`).
- After Slice 8: 65 entries (59 Phase 5, 4 Phase 6, 2 Phase 7). 0 retired.
- After Slice 9: 41 entries (35 Phase 5, 4 Phase 6, 2 Phase 7). 24 retired (classifier, labels, react-demo-rig, 7 core playgrounds, 14 plugin integrations).
- After Slice 10: Exactly 6 entries (0 Phase 5, 4 Phase 6, 2 Phase 7). 35 retired.

The 6 surviving entries guaranteed untouched throughout Phase 5:

- Phase 6 (4 entries):
  - `packages/core/test/integration/phase7-walker-demo.test.ts`
  - `packages/react/test/public-hook-render.test.ts`
  - `packages/three/test/object3d-adapter.test.ts`
  - `packages/three/test/skeleton-driver.test.ts`
- Phase 7 (2 entries):
  - `packages/core/test/integration/engine-x3-contribution.test.ts`
  - `packages/core/test/unit/graph/observation-state.test.ts`

### 15.3 Traceability mapping to Phase 5 completion plan requirements

- Section 4.5 (`pose-classify`): Bound to FK pose table `values` output, flat `{ label, confidence }`
  output, row selection by ID: D9, AP-1, AP-2, AP-3.
- Section 5.1 (Explicit graph only): Elimination of `GraphNode.solves`, `resolveSolvers`, member fan-in,
  and reverse topology special cases: D1, D2, AM-1, AM-2, AM-3.
- Section 5.3 (Publisher behavior): One composition per flush, identified composition context, source
  revisions: D2, AM-4, AM-5, AM-6.
- Section 7.1 (Pose-gap-filler): 5 aggregate tracks, whole-table batch writes, limb readout by member
  ID: D3, D4, D5, AN-1, AN-4, AN-5.
- Section 7.2 (Three.js): 4 aggregate tracks, `tableFrameSource`, elimination of rig track, preserved
  driver invariants: D6, D7, AO-1, AO-3, AO-6.
- Section 7.3 & 7.4 (Labels, React, consumers): Table neutrality, flat label output, label change
  delivery: D8, D10, AP-7, AP-8.
- Section 8 (Surface and deletion policy): Deletion of `rigPlugin`, `legacyRigPlugin`, `readRigValues`,
  clean package manifests, catalog updates: D11, D12, AQ-1, AQ-2, AQ-3.
- Section 9 (Slices 6 to 10 directives): Sequential vertical slices, failing-first evidence, registered
  series: Sections 9 through 13.
- Section 10 (Test and evidence allocation): Series `AM-`, `AN-`, `AO-`, `AP-`, `AQ-`, deterministic
  call counts: D15, D18, Sections 9.2, 10.2, 11.2, 12.2, 13.2.
- Section 11 (Verification protocol): Complete gate sequence and app builds: Section 15.1.
- Section 12 (Completion gate): Fulfilled upon completing Slice 10: Section 15.4.

### 15.4 Phase 5 14-point completion gate checklist

Phase 5 is complete upon Slice 10 exit when all 14 conditions are verified:

- [ ] 1. Identified Table Contracts: Body, goals, root, solved, and pose data use identified table or
     record contracts.
- [ ] 2. Aggregate IK: 2D and 3D IK consume complete aggregate tables and no hidden member state.
- [ ] 3. Aggregate FK: 2D and 3D FK consume complete aggregate tables and publish one complete pose table
     as `values`.
- [ ] 4. Explicit Graph: The graph contains only explicit aggregate dependencies.
- [ ] 5. Solver Fan-in Removed: `GraphNode.solves`, `resolveSolvers`, and hidden solver member fan-in
     machinery are completely deleted.
- [ ] 6. Rig Retired: No v5 rig plugin, rig catalog entry, public rig subpath, or record-map pose
     consumer remains.
- [ ] 7. Row Selection by ID: Every renderer and application consumer selects rows by id and never by
     first row or array position.
- [ ] 8. Classifier Output: Classifier output is the flat `{ label, confidence }` record bound directly
     to the FK pose track.
- [ ] 9. Pose-Gap-Filler Aggregate Writes: `pose-gap-filler` performs whole-value aggregate writes inside
     its existing value batch.
- [ ] 10. Phase 5 Pending Retired: All 73 Phase 5 pending entries are removed from `test/pending.json`
      exactly once after passing.
- [ ] 11. Phase 6/7 Untouched: Phase 6 (4 entries) and Phase 7 (2 entries) pending entries remain
      completely unchanged.
- [ ] 12. Equivalence & Call Counts: Numerical equivalence (within 1e-6 tolerance), quality, identity,
      constraints, lifecycle, and deterministic call-count evidence pass.
- [ ] 13. Public Surface Alignment: Public declarations, package exports, catalogs, tests, and
      documentation describe the exact same public surface.
- [ ] 14. Verification Gates & Status: `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`,
      `npm run test:read-budget`, `npm test`, and app builds pass cleanly, and `docs/SESSION-STATUS.md`
      states only the verified landed state.

### 15.5 Revision record

- **2026-10-29:** Initial master implementation plan authored for Slices 6 through 10 conforming to
  `phase5-completion-plan.md`, precedent plans `phase5-slice2-3-aggregate-ik-plan.md` and
  `phase5-slice4-5-aggregate-fk-plan.md`, and repository guardrails in `AGENTS.md` and
  `docs/GUARDRAILS.md`.
