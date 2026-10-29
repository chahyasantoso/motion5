# Phase 5 Slices 4 and 5: Aggregate 2D and 3D FK

**Status:** Step-by-step implementation plan for Slice 4 (aggregate 2D FK) and Slice 5 (aggregate
3D FK) of section 9 of [phase5-completion-plan.md](phase5-completion-plan.md). That document remains
the execution authority for the whole phase; this one is the worked contract for the two FK slices
and decides every architectural and implementation question the implementer would otherwise have to
decide.

**Prepared:** 2026-10-29, Asia/Jakarta.

**Branch:** `refactor/v5-identified-tables`.

**Base:** commit `53cd96e1` (HEAD of `refactor/v5-identified-tables` after Slice 2 and Slice 3
landed). The tree starts clean.

**Prerequisites:** Slices 0, 1, 2, and 3 landed. `readAggregateTopology` and the shared value specs
exist in `packages/plugins/src/aggregate-topology.ts`. Aggregate IK is operational in `ik.ts` and
`ik3d.ts`.

## 1. What is already true

Slice 1 landed `readAggregateTopology` and the shared 2D/3D value specs in
`packages/plugins/src/aggregate-topology.ts`. Slice 2 migrated 2D IK (`ik.ts`) to aggregate tables.
Slice 3 migrated 3D IK (`ik3d.ts`) to aggregate tables. Both IK plugins read single-source `chain`,
`goals`, and `base` slots, use `EXTERNAL_BASE = ""` for root members, and publish identified tables.

The v5 `fk` and `fk3d` plugins still declare the pre-redesign per-member contract:

- `fk` declares `requires: { member, base, solver }`, consumes a single member record, scans a table
  of base rows for `parentId`, scans a table of solver rows for `memberId`, and emits a single-row
  table: `{ values: [{ id: memberId, cells: world }] }` (`packages/plugins/src/fk.ts`).
- `fk3d` declares `requires: { member, base, solver }` with 3D record and table specs, and likewise
  emits a single-row table (`packages/plugins/src/fk3d.ts`).

In the pre-redesign architecture, the runtime instantiated one FK graph node per body member,
required synthetic root rows in table inputs, and relied on downstream rig plugins
(`apps/pose-gap-filler/src/rig/rig.ts`) to assemble individual member poses into a pose map.

Slice 4 and Slice 5 replace that single-member transport with the aggregate contract of completion
plan sections 4.3 and 4.4:

- The aggregate FK plugin takes one body table (`chain`), one solved table (`solved`), and one root
  record (`base`).
- It evaluates the entire body hierarchy in canonical root-first topological order
  (`readAggregateTopology`), guaranteeing that parent world frames are computed before their
  children.
- It indexes solved rows by member id into a `Map<string, AggregateRow>` for O(1) lookup.
- It resolves solved rows through an explicit closed discriminated union (`found` | `missing`),
  refusing missing rows with `TypeError`.
- It blends authored rest rotation/orientation with solved rotation/orientation using each member's
  clamped weight via existing single-owner mathematics (`lerpAngle` in 2D, `blendOrientation3d` in
  3D).
- It applies pivot offsets and segment extents using shared geometric operations (`composeWorld` in
  2D, `composeWorld3d` in 3D).
- It publishes one complete world-frame pose table as `values`, conforming to `POSE_2D_SPEC` (2D) and
  `POSE_3D_SPEC` (3D).

### Blast radius verification

The blast radius for Slices 4 and 5 across the repository:

- The only active unit tests that call the v5 `fk` and `fk3d` plugins are
  `packages/plugins/test/unit/fk-v5.test.ts` and `packages/plugins/test/unit/fk3d-v5.test.ts`. Both
  are replaced in these slices by comprehensive aggregate integration suites
  (`packages/plugins/test/integration/fk-aggregate.test.ts` and
  `packages/plugins/test/integration/fk3d-aggregate.test.ts`).
- `packages/plugins/test/unit/identified-catalog.test.ts` pins the catalog key list, which these
  slices do not change (`fk` and `fk3d` retain their exact plugin IDs).
- Frame and math helpers in `packages/plugins/src/frame.ts` and `packages/plugins/src/frame3d.ts` are
  already green, unit-tested, and remain completely untouched.
- `apps/pose-gap-filler/src/rig/rig.ts` authors grouped rigs against v5 plugins; all tests loading
  that rig are already pending in `test/pending.json`. Slice 7 owns the app migration; Slices 4 and 5
  do not touch application code.
- Pending ledger: `test/pending.json` currently has 79 entries (73 Phase 5, 4 Phase 6, 2 Phase 7).
  Neither Slice 4 nor Slice 5 removes any pending entries.

## 2. Rules of engagement for the working tree

The working tree starts clean on branch `refactor/v5-identified-tables` at base commit `53cd96e1`.
Every slice must adhere to strict working tree guardrails:

- Never run `git add -A`, `git add .`, `git stash`, `git checkout --`, `git restore`, or
  `git clean`. Stage only the exact files each slice modifies or creates.
- Never run `npm run format` (which invokes repository-wide `prettier . --write`). Format only the
  slice's own files: `npx prettier --write <file>...`.
- Author no markdown tables anywhere. Prettier rewrites markdown table alignment to widths that
  cannot be predicted, causing fatal drift in `npm run format:check`. Use bulleted lists, definition
  lists, indented blocks, or fenced code blocks.
- Slice 4 rewrites `packages/plugins/src/fk.ts` and deletes
  `packages/plugins/test/unit/fk-v5.test.ts`; Slice 5 rewrites `packages/plugins/src/fk3d.ts` and
  deletes `packages/plugins/test/unit/fk3d-v5.test.ts`. Replacing them is the sanctioned
  architectural transition.
- Untracked `motion5-implementation-plans/v5.1-validation-contract-plan.md` and modified `AGENTS.md`
  must remain untouched.
- Start each slice from a verified clean tree. If any unexpected dirty file appears, stop and
  report immediately.

## 3. Locked architectural decisions

Each decision below is locked for Slices 4 and 5. Deviations must be recorded in the pull request
body with explicit justification.

### D1 — Slot shape and derived schema constants

`fk` declares single-source slots `chain`, `solved`, and `base`:

- `chain`: `{ outputs: { values: BODY_2D_SLOT } }`
- `solved`: `{ outputs: { values: SOLVED_2D_SLOT } }`
- `base`: `{ outputs: { values: ROOT_2D_SPEC } }`
- Output: `values: POSE_2D_SPEC`

`fk3d` declares single-source slots `chain`, `solved`, and `base`:

- `chain`: `{ outputs: { values: BODY_3D_SLOT } }`
- `solved`: `{ outputs: { values: SOLVED_3D_SLOT } }`
- `base`: `{ outputs: { values: ROOT_3D_SPEC } }`
- Output: `values: POSE_3D_SPEC`

No slot uses `binding: "map"`. Core plugin admission (`rejectStatic` in
`packages/core/src/domain/plugin-catalog.ts`) strictly forbids `static: true` in dependency slot
output specs. Slices 4 and 5 export `SOLVED_2D_SLOT = slotSpec(SOLVED_2D_SPEC)` and `SOLVED_3D_SLOT =
slotSpec(SOLVED_3D_SPEC)` from `packages/plugins/src/aggregate-topology.ts`. This mirrors the pattern
established by `BODY_2D_SLOT` and `BODY_3D_SLOT` in Slice 2.

The main output is named `values` (never aliased as `pose`). `pose` is the semantic track id and the
classifier's dependency slot name, not an output alias.

### D2 — External base frame as single record

The root frame is delivered as a single record via `requires.base` (`ROOT_2D_SPEC` in 2D,
`ROOT_3D_SPEC` in 3D), not a table containing a synthetic root row.

- Root members (rows where `parentId` is absent or undefined in `topology.parentById`) attach directly
  to this base frame.
- The base frame is decoded using `readFrame(recordOutput(requires.base, "base"))` in 2D and
  `readFrame3d(recordOutput(requires.base, "base"))` in 3D.
- Synthetic root rows (such as rows with `id: "root"`) are unrepresentable and obsolete.

### D3 — Canonical root-first hierarchy traversal

Unlike IK which walks solver chains toward leaves, Forward Kinematics composes world frames down the
entire tree from roots to leaves:

- `readAggregateTopology((requires.chain as Outputs).values)` guarantees `topology.rows` are sorted
  in canonical root-first order (root depth followed by code-unit row id).
- Because parents always precede children in `topology.rows`, iterating `topology.rows` in an ordinary
  loop guarantees that when evaluating any child member, its parent's world frame has already been
  computed and stored in the accumulator map (`worldFrames.get(parentId)!`).
- This eliminates the need for recursive tree walkers or multi-pass graph evaluation. A single linear
  traversal of `topology.rows` evaluates the complete hierarchy in O(N) time.

### D4 — Solved-row lookup with closed discriminated union

To evaluate solved orientations without linear table scanning, `transform` builds an index map
`solvedById = new Map<string, AggregateRow>()` from `requires.solved`.

- Lookup uses a closed discriminated union:
  `type SolvedRowLookup = { readonly kind: "found"; readonly row: AggregateRow } | { readonly kind: "missing"; readonly memberId: string };`
- The lookup helper evaluates:
  `const row = solvedById.get(memberId);`
  `return row === undefined ? { kind: "missing", memberId } : { kind: "found", row };`
- Exhaustive verification uses `switch (lookup.kind)` with `default: return unreachable(lookup);`.
- If missing, throws `TypeError('Solver row missing for member "${lookup.memberId}".')` in 2D, or
  `TypeError('FK3d solver row missing for member "${lookup.memberId}".')` in 3D.
- FK never falls back to row index, first row, track label, or graph track id.

### D5 — Finite angle and orientation verification

When a solved row is found, its angle/Euler components are verified for finiteness:

- In 2D: `rotation` must be a finite number. If missing or non-finite, throws:
  `TypeError('FK solver row for member "${lookup.row.id}" has no finite rotation.')`.
- In 3D: `rotation`, `rotationX`, and `rotationY` must all be finite numbers. If any is missing or
  non-finite, throws:
  `TypeError('FK3d solver row for member "${lookup.row.id}" has no finite orientation.')`.

### D6 — Weight blending and short-arc interpolation

Authored rest rotation/orientation blends with solved rotation/orientation using the member's
authored weight:

- Weight is extracted and clamped to `[0, 1]`:
  `weight = clamp(readNumber(row.cells.weight, 1), 0, 1);`
- In 2D: `lerpAngle(authoredRotation, solvedRotation, weight)` in `frame.ts` blends angles along the
  shortest arc with wrap-around tie-break.
- In 3D: `blendOrientation3d(authoredEuler, solvedEuler, weight)` in `frame3d.ts` performs spherical
  linear interpolation (`slerpQuaternion`) on unit quaternions, decomposing back to canonical Euler
  angles in `(-180, 180]`.
- Weight 0 composes purely authored rest; weight 1 composes purely solved; intermediate weights take
  the shortest arc.

### D7 — Pivot offsets and segment extent conventions

Pivot offsets and segment lengths follow the established single-owner conventions:

- In 2D:
  `pivot = composeWorld(parentFrame, { ...readPivotOffset(row.cells), rotation: blendedRotation });`
  `world = composeWorld(pivot, { x: segmentExtent(readNumber(row.cells.length)), y: 0, rotation: 0 });`
- In 3D:
  `pivot = composeWorld3d(parentFrame, { ...readPivotOffset3d(row.cells), ...blendedEuler });`
  `world = composeWorld3d(pivot, { ...ZERO_EULER, x: segmentExtent(readNumber(row.cells.length)), y: 0, z: 0 });`
- `segmentExtent(length)` clamps negative lengths to 0, ensuring non-negative bone extent along the
  local +x axis.

### D8 — Output identity and canonical ordering

Output rows maintain strict identity and canonical ordering:

- Each output row `id` equals the body member `id`.
- Output rows are emitted in the exact canonical root-first order of `topology.rows`.
- In 2D, output cells contain `{ x: number, y: number, rotation: number }`.
- In 3D, output cells contain `{ x: number, y: number, z: number, rotation: number, rotationX: number, rotationY: number }`.
- No extra cells (such as `weight`, `length`, or `parentId`) leak into published pose rows.

### D9 — Frozen golden parity and numerical equivalence

Transport tests assert literal values captured from the baseline single-bone fixtures in
`fk-v5.test.ts` and `fk3d-v5.test.ts` using `toEqual`:

- 2D golden: `{ x: 7.968532584238182, y: 17.714102933906517, rotation: 80 }`
- 3D golden: `{ x: 9.287460761129946, y: 17.265102688966714, z: 9.105276509871992, rotation: 76.6409268083287, rotationX: 3.6976383936866863, rotationY: -24.542497688027357 }`
- Multi-bone tree hierarchies are pinned with exact frozen literals.
- Assertions never loosen to `toBeCloseTo`.

### D10 — Deterministic single whole-table call counts

In the pre-redesign architecture, an N-member rig executed N individual FK transforms (one per bone
track). In the aggregate architecture:

- A body table of N members executes in exactly 1 transform call.
- In Engine, a single value transaction modifying body rows (`handle.values(...)`) triggers exactly 1
  FK composition and publishes exactly 1 pose patch.
- Deterministic verification wraps the composition logic via a module mock counter, never using
  wall-clock timing.

### D11 — Pending ledger invariance at 79 entries

The pending ledger `test/pending.json` remains completely untouched:

- Total pending entries: exactly 79 (73 Phase 5, 4 Phase 6, 2 Phase 7).
- All 73 Phase 5 pending tests exercise retired grouped keyframes, legacy plugin paths, or the
  unmigrated app rig. Slices 6-10 own removing them when their exact consumer tests are migrated.
- Neither Slice 4 nor Slice 5 removes any entries.

### D12 — Evidence case-ID series: `AK-` and `AL-`

New test cases must declare registered series prefixes:

- Slice 4 introduces `AK-` (Aggregate 2D FK, `AK-1` through `AK-12`).
- Slice 5 introduces `AL-` (Aggregate 3D FK, `AL-1` through `AL-12`).
- Both prefixes are added to `CASE_TITLE` in
  `packages/core/test/unit/scripts/evidence-case-ids.test.ts` in their respective slices.

### D13 — Status wording and shape rules

`docs/SESSION-STATUS.md` strictly adheres to ADR-085:

- Exactly four sections: Header claims, `## Now`, `## Next in line`, `## Open, and not scheduled`,
  `## Where the rest of it lives`.
- Exactly one bullet in `## Now` and one bullet in `## Next in line`.
- No bullet label may state a phase (enforced by `session-status-shape.test.ts`).
- Status is replaced, never accumulated.

## 4. Exact slot shapes, schemas & types

### 4.1 2D FK slot and schema specifications

In `packages/plugins/src/fk.ts`:

- Local values:
  `inputs.values: { kind: "record", fields: {} }`

- Dependency slots:
  - `chain`: `{ outputs: { values: BODY_2D_SLOT } }`
    - Spec kind: `"table"`
    - Row fields: `parentId` (string, optional), `length` (number), `rotation` (number), `weight`
      (number, optional), `x` (number, optional), `y` (number, optional), `minRotation` (number,
      optional), `maxRotation` (number, optional).
  - `solved`: `{ outputs: { values: SOLVED_2D_SLOT } }`
    - Spec kind: `"table"`
    - Row fields: `rotation` (number), `residual` (number, optional), `atBound` (boolean, optional).
  - `base`: `{ outputs: { values: ROOT_2D_SPEC } }`
    - Spec kind: `"record"`
    - Fields: `x` (number), `y` (number), `rotation` (number).

- Outputs:
  - `values: POSE_2D_SPEC`
    - Spec kind: `"table"`
    - Row fields: `x` (number), `y` (number), `rotation` (number).

### 4.2 3D FK slot and schema specifications

In `packages/plugins/src/fk3d.ts`:

- Local values:
  `inputs.values: { kind: "record", fields: {} }`

- Dependency slots:
  - `chain`: `{ outputs: { values: BODY_3D_SLOT } }`
    - Spec kind: `"table"`
    - Row fields: `parentId` (string, optional), `length` (number), `rotation` (number, optional),
      `rotationX` (number, optional), `rotationY` (number, optional), `weight` (number, optional),
      `x` (number, optional), `y` (number, optional), `z` (number, optional), `orient` (number,
      optional), `joint` (string, optional), `axisX/Y/Z` (number, optional), `min/maxRotation`
      (number, optional), `min/maxTwist` (number, optional), `maxSwing` (number, optional).
  - `solved`: `{ outputs: { values: SOLVED_3D_SLOT } }`
    - Spec kind: `"table"`
    - Row fields: `rotation` (number), `rotationX` (number), `rotationY` (number), `residual` (number,
      optional), `atBound` (boolean, optional).
  - `base`: `{ outputs: { values: ROOT_3D_SPEC } }`
    - Spec kind: `"record"`
    - Fields: `x` (number), `y` (number), `z` (number), `rotation` (number), `rotationX` (number),
      `rotationY` (number).

- Outputs:
  - `values: POSE_3D_SPEC`
    - Spec kind: `"table"`
    - Row fields: `x` (number), `y` (number), `z` (number), `rotation` (number), `rotationX`
      (number), `rotationY` (number).

### 4.3 Slot spec derivation in `aggregate-topology.ts`

`SOLVED_2D_SLOT` and `SOLVED_3D_SLOT` are derived using `slotSpec` to strip any `static` fields
consistently:

```ts
export const SOLVED_2D_SLOT = slotSpec(SOLVED_2D_SPEC);
export const SOLVED_3D_SLOT = slotSpec(SOLVED_3D_SPEC);
```

## 5. Mathematical operations & composition mechanics

### 5.1 2D forward kinematics mathematics (`frame.ts`)

- **Rotation blending:**
  `lerpAngle(from: number, to: number, weight: number): number`
  - Normalizes both angles into `(-180, 180]`.
  - Determines delta: `((to - from + 540) % 360) - 180`.
  - Half-turn tie-break (+180 vs -180) chooses positive turn.
  - Returns exact endpoints: `weight <= 0 ? from : weight >= 1 ? to : from + delta * weight`.

- **Pivot offset extraction:**
  `readPivotOffset(cells: AggregateCells): PivotOffset`
  - Extracts `{ x: readNumber(cells.x), y: readNumber(cells.y) }`.
  - Defaults absent keys to 0.

- **World frame composition:**
  `composeWorld(parent: WorldFrame, local: WorldFrame): WorldFrame`
  - Rotates local offset vector `(local.x, local.y)` by parent rotation:
    `rad = (parent.rotation * Math.PI) / 180`
    `cos = Math.cos(rad); sin = Math.sin(rad)`
    `x = parent.x + local.x * cos - local.y * sin`
    `y = parent.y + local.x * sin + local.y * cos`
  - Adds rotations: `rotation = parent.rotation + local.rotation`.

- **Segment extent:**
  `segmentExtent(length: number): number`
  - Clamps: `length < 0 ? 0 : length`. Preserves non-negative length along local +x axis.

### 5.2 3D forward kinematics mathematics (`frame3d.ts`)

- **Orientation blending:**
  `blendOrientation3d(rest: Euler3d, solved: Euler3d, weight: number): Euler3d`
  - If `weight <= 0`, returns `rest`.
  - If `weight >= 1`, returns `solved`.
  - Converts Euler triples to unit quaternions via `quaternionFromEuler3d(euler)`.
  - Evaluates spherical linear interpolation via `slerpQuaternion(qFrom, qTo, weight)`.
  - Converts result quaternion to rotation matrix via `matrixFromQuaternion(q)`.
  - Decomposes matrix to canonical Euler angles via `eulerFromMatrix3d(matrix)`.

- **3D pivot offset extraction:**
  `readPivotOffset3d(cells: AggregateCells): PivotOffset3d`
  - Extracts `{ x: readNumber(cells.x), y: readNumber(cells.y), z: readNumber(cells.z) }`.
  - Defaults absent keys to 0.

- **3D world frame composition:**
  `composeWorld3d(parent: WorldFrame3d, local: WorldFrame3d): WorldFrame3d`
  - Constructs 3x3 rotation matrices for parent and local frames via `matrixFromEuler3d`.
  - Transforms local offset vector: `offset = multiplyVector3(parentMatrix, [local.x, local.y, local.z])`.
  - Multiplies orientation matrices: `combinedMatrix = multiplyMatrix3(parentMatrix, localMatrix)`.
  - Decomposes combined orientation matrix into canonical Euler angles: `euler = eulerFromMatrix3d(combinedMatrix)`.
  - Returns `{ x: parent.x + offset[0], y: parent.y + offset[1], z: parent.z + offset[2], ...euler }`.

- **Segment extent along local +x:**
  Local extension is `{ ...ZERO_EULER, x: segmentExtent(readNumber(length)), y: 0, z: 0 }`.

## 6. Traversal algorithm & solved-row lookup

### 6.1 Traversal sequence

1. Read inputs:
   - `topology = readAggregateTopology((requires.chain as Outputs).values);`
   - `baseFrame = readFrame(recordOutput(requires.base as Outputs, "base"));` (or `readFrame3d`)
   - `solvedRows = tableOutput(requires.solved as Outputs, "solved");`
2. Index solved rows:
   - `solvedById = new Map<string, AggregateRow>();`
   - For each row in `solvedRows`, map `row.id -> row`.
3. Canonical pose evaluation:
   - `worldFrames = new Map<string, WorldFrame>();`
   - Iterate over `topology.rows` (guaranteed canonical root-first order):
     - `lookup = lookupSolvedRow(solvedById, row.id);`
     - Extract solved rotation (or solved orientation in 3D), throwing `TypeError` if missing or
       non-finite.
     - Extract authored rest rotation (or rest Euler in 3D).
     - Extract and clamp weight: `weight = clamp(readNumber(row.cells.weight, 1), 0, 1);`.
     - Compute blended rotation: `rotation = lerpAngle(authored, solved, weight);` (or
       `blendOrientation3d`).
     - Resolve parent frame:
       `parentId = topology.parentById.get(row.id);`
       `parentFrame = parentId === undefined ? baseFrame : worldFrames.get(parentId)!;`
     - Compose pivot frame from parent frame, pivot offset, and blended rotation.
     - Compose world tip frame by extending pivot along local +x by `segmentExtent(length)`.
     - Record `worldFrames.set(row.id, world);`.
     - Emit `{ id: row.id, cells: world }`.
4. Return `{ values: outputRows }`.

## 7. Worked examples with exact concrete numbers

### 7.1 2D forward kinematics worked example

#### Baseline single-bone parity fixture

Inputs:

- Base frame (`requires.base`): `{ x: 5, y: 6, rotation: 30 }`
- Body table (`requires.chain`):
  `[{ id: "bone", cells: { length: 10, rotation: 20, weight: 0.5, x: 2, y: 1 } }]`
- Solved table (`requires.solved`):
  `[{ id: "bone", cells: { rotation: 80 } }]`

Step-by-step arithmetic:

1. `authored = 20`, `solved = 80`, `weight = 0.5`
2. `blendedRotation = lerpAngle(20, 80, 0.5) = 50`
3. Parent frame is base frame: `{ x: 5, y: 6, rotation: 30 }`
4. Pivot offset: `x: 2, y: 1`
   - Rotate `(2, 1)` by parent rotation 30 degrees:
     `cos(30°) = 0.8660254037844386`
     `sin(30°) = 0.5`
     `x_pivot = 5 + 2 * cos(30°) - 1 * sin(30°) = 5 + 1.7320508075688772 - 0.5 = 6.232050807568877`
     `y_pivot = 6 + 2 * sin(30°) + 1 * cos(30°) = 6 + 1.0 + 0.8660254037844386 = 7.8660254037844385`
     `pivotRotation = 30 + 50 = 80`
5. Segment extent: `length = 10`, local offset along local +x at pivot rotation 80 degrees:
   - `cos(80°) = 0.17364817766693033`
   - `sin(80°) = 0.984807753012208`
   - `x_world = 6.232050807568877 + 10 * cos(80°) = 6.232050807568877 + 1.7364817766693033 = 7.96853258423818`
   - `y_world = 7.8660254037844385 + 10 * sin(80°) = 7.8660254037844385 + 9.84807753012208 = 17.714102933906517`
   - `worldRotation = 80 + 0 = 80`

Published output row:

```ts
{
  id: "bone",
  cells: {
    x: 7.968532584238182,
    y: 17.714102933906517,
    rotation: 80,
  },
}
```

Matches `fk-v5.test.ts` bit for bit.

#### Multi-bone tree hierarchy fixture

Inputs:

- Base frame (`requires.base`): `{ x: 0, y: 0, rotation: 0 }`
- Body table (`requires.chain`):
  - `{ id: "upper", cells: { length: 50, rotation: 0, weight: 1 } }`
  - `{ id: "left", cells: { parentId: "upper", length: 35, rotation: 0, weight: 1 } }`
  - `{ id: "right", cells: { parentId: "upper", length: 30, rotation: 0, weight: 1 } }`
- Solved table (`requires.solved`):
  - `{ id: "upper", cells: { rotation: 40 } }`
  - `{ id: "left", cells: { rotation: -30 } }`
  - `{ id: "right", cells: { rotation: 60 } }`

Step-by-step arithmetic:

1. `upper` (root child):
   - Parent = base `{ x: 0, y: 0, rotation: 0 }`
   - `blendedRotation = 40`
   - Pivot = `{ x: 0, y: 0, rotation: 40 }`
   - Tip = `{ x: 50 * cos(40°), y: 50 * sin(40°), rotation: 40 }`
     `x = 38.3022221559489`
     `y = 32.139380484326965`
     `rotation = 40`
2. `left` (child of `upper`):
   - Parent = `upper` tip `{ x: 38.3022221559489, y: 32.139380484326965, rotation: 40 }`
   - `blendedRotation = -30`
   - Pivot rotation = `40 + (-30) = 10`
   - Tip = `{ x: 38.3022221559489 + 35 * cos(10°), y: 32.139380484326965 + 35 * sin(10°), rotation: 10 }`
     `x = 38.3022221559489 + 34.46827135542728 = 72.77049351137618`
     `y = 32.139380484326965 + 6.077686218342562 = 38.21706670266953`
     `rotation = 10`
3. `right` (child of `upper`):
   - Parent = `upper` tip `{ x: 38.3022221559489, y: 32.139380484326965, rotation: 40 }`
   - `blendedRotation = 60`
   - Pivot rotation = `40 + 60 = 100`
   - Tip = `{ x: 38.3022221559489 + 30 * cos(100°), y: 32.139380484326965 + 30 * sin(100°), rotation: 100 }`
     `x = 38.3022221559489 - 5.20944533000791 = 33.092776825941`
     `y = 32.139380484326965 + 29.54423259036624 = 61.6836130746932`
     `rotation = 100`

### 7.2 3D forward kinematics worked example

#### Baseline single-bone parity fixture

Inputs:

- Base frame (`requires.base`):
  `{ x: 5, y: 6, z: 7, rotation: 30, rotationX: 5, rotationY: -20 }`
- Body table (`requires.chain`):
  `[{ id: "bone", cells: { length: 10, rotation: 20, rotationX: -10, rotationY: 15, weight: 0.5, x: 2, y: 1, z: -3 } }]`
- Solved table (`requires.solved`):
  `[{ id: "bone", cells: { rotation: 80, rotationX: 25, rotationY: -40 } }]`

Step-by-step arithmetic:

1. `rest = { rotation: 20, rotationX: -10, rotationY: 15 }`
2. `solved = { rotation: 80, rotationX: 25, rotationY: -40 }`
3. `blendedEuler = blendOrientation3d(rest, solved, 0.5)`
   - Converts both to unit quaternions.
   - Slerps quaternion at t = 0.5 along shortest arc.
   - Converts resulting quaternion to matrix and decomposes back to Euler angles.
4. Pivot composition via `composeWorld3d`:
   - Translates by offset `(2, 1, -3)` in base's rotated frame.
   - Multiplies parent orientation matrix by local blended orientation matrix.
5. Extent composition:
   - Translates pivot by `(10, 0, 0)` in pivot's rotated frame.

Published output row:

```ts
{
  id: "bone",
  cells: {
    x: 9.287460761129946,
    y: 17.265102688966714,
    z: 9.105276509871992,
    rotation: 76.6409268083287,
    rotationX: 3.6976383936866863,
    rotationY: -24.542497688027357,
  },
}
```

Matches `fk3d-v5.test.ts` bit for bit.

## 8. Frozen golden values

### 8.1 2D frozen goldens fixture

```ts
export const GOLDEN_2D_SINGLE = {
  values: [
    {
      id: "bone",
      cells: {
        x: 7.968532584238182,
        y: 17.714102933906517,
        rotation: 80,
      },
    },
  ],
};

export const GOLDEN_2D_TREE = {
  values: [
    {
      id: "upper",
      cells: {
        x: 38.3022221559489,
        y: 32.139380484326965,
        rotation: 40,
      },
    },
    {
      id: "left",
      cells: {
        x: 72.77049351137618,
        y: 38.21706670266953,
        rotation: 10,
      },
    },
    {
      id: "right",
      cells: {
        x: 33.092776825941,
        y: 61.6836130746932,
        rotation: 100,
      },
    },
  ],
};
```

### 8.2 3D frozen goldens fixture

```ts
export const GOLDEN_3D_SINGLE = {
  values: [
    {
      id: "bone",
      cells: {
        x: 9.287460761129946,
        y: 17.265102688966714,
        z: 9.105276509871992,
        rotation: 76.6409268083287,
        rotationX: 3.6976383936866863,
        rotationY: -24.542497688027357,
      },
    },
  ],
};
```

## 9. Slice 4 — aggregate 2D FK

**Owner:** `packages/plugins/src/fk.ts` and the aggregate 2D FK tests.

**Files this slice may change, and no others:**

```text
packages/plugins/src/aggregate-topology.ts
packages/plugins/src/fk.ts
packages/plugins/test/unit/fk-v5.test.ts                     (deleted)
packages/plugins/test/integration/fk-aggregate.test.ts       (added)
packages/core/test/unit/scripts/evidence-case-ids.test.ts   (AK added to CASE_TITLE)
docs/SESSION-STATUS.md
```

### 9.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm working tree is clean.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, and `npm run test:boundaries`.
   Record results.
2. **Write red tests first:**
   - Create `packages/plugins/test/integration/fk-aggregate.test.ts` declaring cases `AK-1` through
     `AK-12`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AK` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run packages/plugins/test/integration/fk-aggregate.test.ts`.
   - Assert all `AK-` cases fail against the old `fk.ts` plugin. Save failing output verbatim.
4. **Implement source changes:**
   - Export `SOLVED_2D_SLOT` and `SOLVED_3D_SLOT` from `packages/plugins/src/aggregate-topology.ts`.
   - Delete `packages/plugins/test/unit/fk-v5.test.ts`.
   - Rewrite `packages/plugins/src/fk.ts` to aggregate contract.
5. **Verify focused green:**
   - Run `npx vitest run packages/plugins/test/integration/fk-aggregate.test.ts`. Verify all 12 tests pass.
6. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm test`.
7. **Exit checks & mutation verification:**
   - Run grep checklist and mutation checks M1 through M7.
8. **Commit and status rewrite:**
   - Commit changes with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 9.2 `aggregate-topology.ts` additions

Insert after `GOALS_3D_SLOT`:

```ts
export const SOLVED_2D_SLOT = slotSpec(SOLVED_2D_SPEC);
export const SOLVED_3D_SLOT = slotSpec(SOLVED_3D_SPEC);
```

### 9.3 The `fk.ts` rewrite

Replace `packages/plugins/src/fk.ts` with:

```ts
import { unreachable } from "@motion5/core/plugin-api";
import type { IdentifiedPluginDefinition, Outputs } from "@motion5/core/plugin-api";
import {
  BODY_2D_SLOT,
  POSE_2D_SPEC,
  ROOT_2D_SPEC,
  SOLVED_2D_SLOT,
  readAggregateTopology,
  type AggregateRow,
} from "./aggregate-topology";
import {
  clamp,
  composeWorld,
  lerpAngle,
  readFrame,
  readNumber,
  readPivotOffset,
  segmentExtent,
  type WorldFrame,
} from "./frame";

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type TableOutput = {
  readonly values: readonly { readonly id: string; readonly cells: FlatRecord }[];
};

type SolvedRowLookup =
  | { readonly kind: "found"; readonly row: AggregateRow }
  | { readonly kind: "missing"; readonly memberId: string };

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`FK requires a record at ${path}.`);
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
    throw new TypeError(`FK requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function tableOutput(outputs: Outputs, path: string): TableOutput["values"] {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`FK requires a table output at ${path}.`);
  return values as TableOutput["values"];
}

function lookupSolvedRow(
  solvedById: ReadonlyMap<string, AggregateRow>,
  memberId: string,
): SolvedRowLookup {
  const row = solvedById.get(memberId);
  return row === undefined ? { kind: "missing", memberId } : { kind: "found", row };
}

function solveRotation(lookup: SolvedRowLookup): number {
  switch (lookup.kind) {
    case "found": {
      const rotation = lookup.row.cells.rotation;
      if (typeof rotation !== "number" || !Number.isFinite(rotation))
        throw new TypeError(`FK solver row for member "${lookup.row.id}" has no finite rotation.`);
      return rotation;
    }
    case "missing":
      throw new TypeError(`Solver row missing for member "${lookup.memberId}".`);
    default:
      return unreachable(lookup);
  }
}

export const fkPlugin: IdentifiedPluginDefinition = {
  id: "fk",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: { outputs: { values: BODY_2D_SLOT } },
      solved: { outputs: { values: SOLVED_2D_SLOT } },
      base: { outputs: { values: ROOT_2D_SPEC } },
    },
  },
  outputs: { values: POSE_2D_SPEC },
  transform({ requires }) {
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const baseFrame = readFrame(recordOutput(requires.base as Outputs, "base"));
    const solvedRows = tableOutput(requires.solved as Outputs, "solved");
    const solvedById = new Map<string, AggregateRow>();
    for (const row of solvedRows) {
      solvedById.set(row.id, row as AggregateRow);
    }
    const worldFrames = new Map<string, WorldFrame>();
    const rows = topology.rows.map((row) => {
      const solved = solveRotation(lookupSolvedRow(solvedById, row.id));
      const authored = readNumber(row.cells.rotation);
      const weight = clamp(readNumber(row.cells.weight, 1), 0, 1);
      const rotation = lerpAngle(authored, solved, weight);
      const parentId = topology.parentById.get(row.id);
      const parentFrame = parentId === undefined ? baseFrame : worldFrames.get(parentId)!;
      const pivot = composeWorld(parentFrame, {
        ...readPivotOffset(row.cells),
        rotation,
      });
      const world = composeWorld(pivot, {
        x: segmentExtent(readNumber(row.cells.length)),
        y: 0,
        rotation: 0,
      });
      worldFrames.set(row.id, world);
      return { id: row.id, cells: world };
    });
    return { values: rows };
  },
};
```

### 9.4 Test cases for Slice 4 (`packages/plugins/test/integration/fk-aggregate.test.ts`)

Series: `AK`

- `AK-1`: Contract declaration. `requires` has exactly keys `chain`, `solved`, `base` in that order;
  no slot has a map binding; output is exactly `values: POSE_2D_SPEC`. Legacy slots `member` and
  `solver` are undefined.
- `AK-2`: Single-bone golden parity. Baseline single-bone fixture from `fk-v5.test.ts` returns exact
  coordinates `{ x: 7.968532584238182, y: 17.714102933906517, rotation: 80 }` with `toEqual`.
- `AK-3`: Multi-bone tree composition. Tree hierarchy (`upper`, `left`, `right`) composes with child
  bones inheriting parent tip coordinates.
- `AK-4`: Missing solved-row refusal. A solved table omitting a body member throws
  `TypeError('Solver row missing for member "..."')`.
- `AK-5`: Non-finite rotation refusal. A solved row with `rotation: NaN` or `Infinity` throws
  `TypeError('FK solver row for member "..." has no finite rotation.')`.
- `AK-6`: Weight blending. Weight 0 produces authored rotation only; weight 1 produces solved
  rotation only; weight 0.5 produces short-arc blend.
- `AK-7`: Pivot offsets. Offsets on root and child members displace bone pivots correctly in rotated
  parent space.
- `AK-8`: Segment extent. Zero or negative bone lengths clamp to zero extent without throwing or
  producing NaN.
- `AK-9`: Body reorder invariance. Reversing authored body rows produces identical canonical pose
  rows.
- `AK-10`: Engine end-to-end integration. Complete project with `root`, `body`, `solve` (ik), and
  `pose` (fk) mounts, seeks, and publishes ready pose table with exact member ids.
- `AK-11`: Track renaming invariance. Renaming source track IDs (`origin`, `skeleton`, `solved`)
  produces identical pose rows.
- `AK-12`: Deterministic call-count. A value batch `handle.values(...)` causes exactly one FK
  composition pass and one published patch notification.

### 9.5 Commit message for Slice 4

```text
refactor(plugins): migrate 2d fk to aggregate tables

Slice 4 replaces the single-member FK node transport with the aggregate contract:
`fk` reads one body table through `chain`, one solved table through `solved`, and
one base record through `base`. It walks the canonical root-first topology, indexes
solved rows with a closed discriminated union, blends rotations via lerpAngle, and
publishes one complete world-frame pose table byte for byte.

Evidence: red run against old plugin, aggregate 2D FK 12 tests green, full suite
passed, typecheck, format:check, boundaries passed. Mutants M1 through M7 each
failed the named test. No pending ledger entries removed.
```

### 9.6 Status rewrite for Slice 4

Rewrite `docs/SESSION-STATUS.md` (replace stale entries; exactly one bullet in Now and Next in line,
no phase labels):

```text
## Now

- **2D FK reads aggregate tables:** `fk` takes one body table, one solved table and one base
  record through single-source slots, walks canonical topology, and publishes the whole pose table
  in one pass. Grouped authoring is refused by name at load. No pending ledger entries were removed;
  73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Aggregate 3D FK:** the same chain, solved and base contract for `fk3d`, preserving orientation
  blending, 3D pivot offsets, segment extent and Euler world-frame pose publishing.
```

## 10. Slice 5 — aggregate 3D FK

**Owner:** `packages/plugins/src/fk3d.ts` and the aggregate 3D FK tests.

Start only after Slice 4 is committed and green.

**Files this slice may change, and no others:**

```text
packages/plugins/src/fk3d.ts
packages/plugins/test/unit/fk3d-v5.test.ts                     (deleted)
packages/plugins/test/integration/fk3d-aggregate.test.ts       (added)
packages/core/test/unit/scripts/evidence-case-ids.test.ts     (AL added to CASE_TITLE)
docs/SESSION-STATUS.md
```

Note: `packages/plugins/src/aggregate-topology.ts` was already updated in Slice 4 to export
`SOLVED_3D_SLOT`, so it is not modified in Slice 5.

### 10.1 Step order

0. **Step 0 gate:** Run `git status --short`. Confirm clean working tree.
1. **Baseline checks:** Run `npm run format:check`, `npm run typecheck`, and `npm run test:boundaries`.
2. **Write red tests first:**
   - Create `packages/plugins/test/integration/fk3d-aggregate.test.ts` declaring cases `AL-1` through
     `AL-12`.
   - Update `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to add `AL` to `CASE_TITLE`.
3. **Capture failing-first evidence:**
   - Run `npx vitest run packages/plugins/test/integration/fk3d-aggregate.test.ts`.
   - Assert all `AL-` cases fail against the old `fk3d.ts` plugin. Save failing output verbatim.
4. **Implement source changes:**
   - Delete `packages/plugins/test/unit/fk3d-v5.test.ts`.
   - Rewrite `packages/plugins/src/fk3d.ts` to aggregate contract.
5. **Verify focused green:**
   - Run `npx vitest run packages/plugins/test/integration/fk3d-aggregate.test.ts`. Verify all 12 tests pass.
6. **Format and run full gate sequence:**
   - Run `npx prettier --write` on touched files.
   - Run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm test`.
7. **Exit checks & mutation verification:**
   - Run grep checklist and mutation checks M8 through M14.
8. **Commit and status rewrite:**
   - Commit changes with conventional message.
   - Rewrite `docs/SESSION-STATUS.md`.

### 10.2 The `fk3d.ts` rewrite

Replace `packages/plugins/src/fk3d.ts` with:

```ts
import { unreachable } from "@motion5/core/plugin-api";
import type { IdentifiedPluginDefinition, Outputs } from "@motion5/core/plugin-api";
import {
  BODY_3D_SLOT,
  POSE_3D_SPEC,
  ROOT_3D_SPEC,
  SOLVED_3D_SLOT,
  readAggregateTopology,
  type AggregateRow,
} from "./aggregate-topology";
import {
  blendOrientation3d,
  composeWorld3d,
  readEuler3d,
  readFrame3d,
  readPivotOffset3d,
  ZERO_EULER,
  type Euler3d,
  type WorldFrame3d,
} from "./frame3d";
import { clamp, readNumber, segmentExtent } from "./frame";

type FlatRecord = Readonly<Record<string, number | string | boolean>>;
type TableOutput = {
  readonly values: readonly { readonly id: string; readonly cells: FlatRecord }[];
};

type SolvedRowLookup3d =
  | { readonly kind: "found"; readonly row: AggregateRow }
  | { readonly kind: "missing"; readonly memberId: string };

function flatRecord(value: unknown, path: string): FlatRecord {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    throw new TypeError(`FK3d requires a record at ${path}.`);
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
    throw new TypeError(`FK3d requires a record output at ${path}.`);
  return flatRecord(values, `${path}.values`);
}

function tableOutput(outputs: Outputs, path: string): TableOutput["values"] {
  const values = outputs.values;
  if (!Array.isArray(values)) throw new TypeError(`FK3d requires a table output at ${path}.`);
  return values as TableOutput["values"];
}

function lookupSolvedRow3d(
  solvedById: ReadonlyMap<string, AggregateRow>,
  memberId: string,
): SolvedRowLookup3d {
  const row = solvedById.get(memberId);
  return row === undefined ? { kind: "missing", memberId } : { kind: "found", row };
}

function solvedOrientation(lookup: SolvedRowLookup3d): Euler3d {
  switch (lookup.kind) {
    case "found": {
      const rotation = lookup.row.cells.rotation;
      const rotationX = lookup.row.cells.rotationX;
      const rotationY = lookup.row.cells.rotationY;
      if (
        typeof rotation !== "number" ||
        !Number.isFinite(rotation) ||
        typeof rotationX !== "number" ||
        !Number.isFinite(rotationX) ||
        typeof rotationY !== "number" ||
        !Number.isFinite(rotationY)
      )
        throw new TypeError(
          `FK3d solver row for member "${lookup.row.id}" has no finite orientation.`,
        );
      return { rotation, rotationX, rotationY };
    }
    case "missing":
      throw new TypeError(`FK3d solver row missing for member "${lookup.memberId}".`);
    default:
      return unreachable(lookup);
  }
}

export const fk3dPlugin: IdentifiedPluginDefinition = {
  id: "fk3d",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: { outputs: { values: BODY_3D_SLOT } },
      solved: { outputs: { values: SOLVED_3D_SLOT } },
      base: { outputs: { values: ROOT_3D_SPEC } },
    },
  },
  outputs: { values: POSE_3D_SPEC },
  transform({ requires }) {
    const topology = readAggregateTopology((requires.chain as Outputs).values);
    const baseFrame = readFrame3d(recordOutput(requires.base as Outputs, "base"));
    const solvedRows = tableOutput(requires.solved as Outputs, "solved");
    const solvedById = new Map<string, AggregateRow>();
    for (const row of solvedRows) {
      solvedById.set(row.id, row as AggregateRow);
    }
    const worldFrames = new Map<string, WorldFrame3d>();
    const rows = topology.rows.map((row) => {
      const solved = solvedOrientation(lookupSolvedRow3d(solvedById, row.id));
      const rest = readEuler3d(row.cells);
      const weight = clamp(readNumber(row.cells.weight, 1), 0, 1);
      const local = blendOrientation3d(rest, solved, weight);
      const parentId = topology.parentById.get(row.id);
      const parentFrame = parentId === undefined ? baseFrame : worldFrames.get(parentId)!;
      const pivot = composeWorld3d(parentFrame, {
        ...readPivotOffset3d(row.cells),
        ...local,
      });
      const world = composeWorld3d(pivot, {
        ...ZERO_EULER,
        x: segmentExtent(readNumber(row.cells.length)),
        y: 0,
        z: 0,
      });
      worldFrames.set(row.id, world);
      return { id: row.id, cells: world };
    });
    return { values: rows };
  },
};
```

### 10.3 Test cases for Slice 5 (`packages/plugins/test/integration/fk3d-aggregate.test.ts`)

Series: `AL`

- `AL-1`: Contract declaration. `requires` has exactly keys `chain`, `solved`, `base`; no slot has a
  map binding; output is exactly `values: POSE_3D_SPEC`. Legacy slots are absent.
- `AL-2`: Single-bone golden parity. Baseline single-bone fixture from `fk3d-v5.test.ts` returns
  exact coordinates `{ x: 9.287460761129946, y: 17.265102688966714, z: 9.105276509871992, rotation:
76.6409268083287, rotationX: 3.6976383936866863, rotationY: -24.542497688027357 }` with `toEqual`.
- `AL-3`: Multi-bone 3D hierarchy. 3D tree composition where child bones inherit parent 3D
  orientations and tip positions.
- `AL-4`: Missing solved-row refusal. Missing member throws `TypeError('FK3d solver row missing for member "..."')`.
- `AL-5`: Non-finite orientation refusal. Non-finite Euler angles throw `TypeError('FK3d solver row for member "..." has no finite orientation.')`.
- `AL-6`: Orientation blending. Spherical quaternion slerp short-arc blend across weights 0, 0.5, 1.
- `AL-7`: 3D pivot offsets. Non-zero `x, y, z` offsets compose correctly through rotated parent frame.
- `AL-8`: Segment extent. Length extends along local +x axis, with negative lengths clamped to 0.
- `AL-9`: Body reorder invariance. Reverse authored body rows produce identical canonical output.
- `AL-10`: Engine end-to-end integration. Full 3D project (`root`, `body`, `solve` via ik3d, `pose`
  via fk3d) evaluates and publishes ready pose table with exact member ids.
- `AL-11`: Whole-table single composition pass. A 14-member body table evaluates in 1 composition pass
  (replacing the 14 separate passes of `fk3d-v5.test.ts`).
- `AL-12`: Deterministic call-count. A value batch `handle.values(...)` causes exactly 1 FK3D
  composition and 1 published patch notification.

### 10.4 Commit message for Slice 5

```text
refactor(plugins): migrate 3d fk to aggregate tables

Slice 5 repeats the aggregate contract for `fk3d`: one 3D body table through `chain`,
one 3D solved table through `solved`, and one 3D base record through `base`. It walks
canonical topology, indexes solved rows with a closed discriminated union, blends
orientations via blendOrientation3d, and publishes one complete 3D pose table byte
for byte.

Evidence: red run against old plugin, aggregate 3D FK 12 tests green, full suite
passed, typecheck, format:check, boundaries passed. Mutants M8 through M14 each
failed the named test. No pending ledger entries removed.
```

### 10.5 Status rewrite for Slice 5

Rewrite `docs/SESSION-STATUS.md` after Slice 5:

```text
## Now

- **2D and 3D FK read aggregate tables:** `fk` and `fk3d` take one body table, one solved table
  and one base record through single-source slots, walk canonical topology, and publish complete
  pose tables in one pass. Grouped authoring is refused by name at load. No pending ledger entries
  were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Explicit aggregate graph and publisher cleanup:** port graph fixtures to explicit aggregate
  dependencies and remove hidden solver member fan-in machinery.
```

## 11. Guardrails, ownership & invariants

### 11.1 Negative boundaries: what must not change

- No solver module modification: `frame.ts`, `frame3d.ts`, `ik-solve.ts`, `ik3d-solve.ts`, and all
  other solver modules remain untouched.
- No other plugin modification: `ik.ts`, `ik3d.ts`, `pose-classify.ts`, `rig.ts`, `transform.ts`, and
  legacy plugins remain untouched.
- No core modifications: nothing under `packages/core/src`, `packages/three`, `packages/react`, or
  `apps/` may be edited. The only core file touched is the test file
  `packages/core/test/unit/scripts/evidence-case-ids.test.ts` to register prefixes `AK` and `AL`.
- `test/pending.json` must remain completely untouched (79 entries).
- Output names remain `values`. Never introduce an alias named `pose`.
- No markdown tables in any authored documentation or code comments.

### 11.2 Correct versus wrong implementations

```ts
// CORRECT: Solved slot derived via slotSpec in aggregate-topology.ts
solved: { outputs: { values: SOLVED_2D_SLOT } }
// WRONG: Using un-derived spec that could fail slot validation
solved: { outputs: { values: SOLVED_2D_SPEC } }

// CORRECT: Root is a single record output from requires.base
const baseFrame = readFrame(recordOutput(requires.base as Outputs, "base"));
// WRONG: Looking for base in a table of base rows with synthetic root rows
const baseRows = tableOutput(requires.base as Outputs, "base");

// CORRECT: Missing solved row throws TypeError via closed union
case "missing":
  throw new TypeError(`Solver row missing for member "${lookup.memberId}".`);
// WRONG: Silently falling back to rest rotation or first row
case "missing":
  return authored;

// CORRECT: Traversal follows canonical topology rows order
const rows = topology.rows.map((row) => { ... });
// WRONG: Traversing raw input array which depends on authored order
const rows = (requires.chain as Outputs).values.map((row) => { ... });

// CORRECT: Parent frame retrieved from already-evaluated accumulator map
const parentFrame = parentId === undefined ? baseFrame : worldFrames.get(parentId)!;
// WRONG: Recursive parent evaluation or re-scanning output array
const parentFrame = findFrame(outputRows, parentId);
```

## 12. Verification protocol & commands

### 12.1 Execution sequence for each slice

Before starting each slice, run:

1. `npm run format:check`
2. `npm run typecheck`
3. `npm run test:boundaries`

During development:

1. Run focused tests: `npx vitest run packages/plugins/test/integration/fk-aggregate.test.ts` (or `fk3d`)
2. Green the implementation.
3. Format slice files: `npx prettier --write <touched-files>`

Full post-implementation verification gate (run one at a time, in this order):

1. `npm run format:check`
2. `npm run typecheck`
3. `npm run test:boundaries`
4. `npm test`

## 13. Exit checks & mutation matrix

### 13.1 Grep checklist

Every command below must print nothing:

```text
grep -n 'binding: "map"' packages/plugins/src/fk.ts packages/plugins/src/fk3d.ts
grep -nE "baseRow|lookupRow|stringField" packages/plugins/src/fk.ts packages/plugins/src/fk3d.ts
grep -nE "memberId|parentId" packages/plugins/src/fk.ts packages/plugins/src/fk3d.ts
git diff --stat 53cd96e1 -- packages/core/src packages/three packages/react apps test/pending.json
git diff --stat 53cd96e1 -- packages/plugins/src/frame.ts packages/plugins/src/frame3d.ts packages/plugins/src/ik.ts packages/plugins/src/ik3d.ts
```

### 13.2 Mutation test matrix

#### Slice 4 (2D FK) mutants:

- **M1:** `fk.ts` - `...readPivotOffset(row.cells)` -> `...ZERO_PIVOT_OFFSET`
  - Fails: `AK-2`, `AK-7`
- **M2:** `fk.ts` - `lerpAngle(authored, solved, weight)` -> `solved`
  - Fails: `AK-6`
- **M3:** `fk.ts` - `clamp(readNumber(row.cells.weight, 1), 0, 1)` -> `readNumber(row.cells.weight, 1)` (unclamped)
  - Fails: `AK-6`
- **M4:** `fk.ts` - `parentId === undefined ? baseFrame : worldFrames.get(parentId)!` -> `baseFrame`
  - Fails: `AK-3`, `AK-10`
- **M5:** `fk.ts` - `topology.rows.map(...)` -> `[...topology.rows].reverse().map(...)`
  - Fails: `AK-2`, `AK-3`, `AK-9`, `AK-10`
- **M6:** `fk.ts` - `case "missing": throw ...` -> `return 0` (silently ignores missing row)
  - Fails: `AK-4`
- **M7:** `fk.ts` - A second iteration pass or duplicate composition in `transform`
  - Fails: `AK-12`

#### Slice 5 (3D FK) mutants:

- **M8:** `fk3d.ts` - `...readPivotOffset3d(row.cells)` -> `...ZERO_PIVOT_OFFSET3D`
  - Fails: `AL-2`, `AL-7`
- **M9:** `fk3d.ts` - `blendOrientation3d(rest, solved, weight)` -> `solved`
  - Fails: `AL-6`
- **M10:** `fk3d.ts` - `readEuler3d(row.cells)` -> `ZERO_EULER`
  - Fails: `AL-6`
- **M11:** `fk3d.ts` - `parentId === undefined ? baseFrame : worldFrames.get(parentId)!` -> `baseFrame`
  - Fails: `AL-3`, `AL-10`
- **M12:** `fk3d.ts` - `topology.rows.map(...)` -> `[...topology.rows].reverse().map(...)`
  - Fails: `AL-2`, `AL-3`, `AL-9`, `AL-10`
- **M13:** `fk3d.ts` - `case "missing": throw ...` -> `return ZERO_EULER`
  - Fails: `AL-4`
- **M14:** `fk3d.ts` - A second iteration pass or duplicate composition in `transform`
  - Fails: `AL-12`

## 14. Conformance with the completion plan

Traceability mapping against Phase 5 completion plan requirements:

- **Section 4.3 (Aggregate 2D FK):**
  - Consumes `chain`, `solved`, and `base` single-source slots: D1, AK-1.
  - Builds id-indexed solved-row lookup: D4, Section 6.
  - Walks canonical body topology: D3, AK-3, AK-9.
  - Blends authored rest with solved rotation using clamped weight: D6, AK-6.
  - Applies shared pivot convention: D7, AK-7.
  - Emits one world-frame row per member in canonical order: D8, AK-2, AK-3.
  - Refuses missing solved rows: D4, AK-4.
  - Refuses non-finite rotations: D5, AK-5.
  - Output named `values`: D1, AK-1.

- **Section 4.4 (Aggregate 3D FK):**
  - Consumes 3D `chain`, `solved`, and `base` slots: D1, AL-1.
  - Preserves 3D orientation blending: D6, AL-6.
  - Preserves 3D pivot offsets: D7, AL-7.
  - Preserves segment extent along local +x: D7, AL-8.
  - Refuses missing solved rows: D4, AL-4.
  - Refuses non-finite orientations: D5, AL-5.
  - Output named `values: POSE_3D_SPEC`: D1, AL-1.
  - Whole-table call-count coverage: D10, AL-11, AL-12.

- **Section 9 (Slices 4 and 5 directives):**
  - Slice 4 owner: `packages/plugins/src/fk.ts`: Section 9.
  - Slice 5 owner: `packages/plugins/src/fk3d.ts`: Section 10.
  - Step-by-step implementation sequence with failing-first evidence: Sections 9.1 and 10.1.
  - Exact file modification bounds: Sections 9 and 10.

- **Section 10 (Test & evidence allocation):**
  - Assertion-level failing-first evidence: Sections 9.1 (step 3) and 10.1 (step 3).
  - Literal golden parity asserted with `toEqual`: D9, AK-2, AL-2, Section 8.
  - Pending ledger invariant at 79 entries: D11.
  - Deterministic call counts instead of wall-clock: D10, AK-12, AL-12.

- **Section 11 (Verification protocol):**
  - Verification sequence enforced: Section 12.
  - Mutation test matrix: Section 13.

## 15. Revision record

- **2026-10-29:** Initial plan authored for Slices 4 and 5 conforming to Phase 5 completion plan,
  precedent plan for Slices 2 and 3, and repository guardrails.
