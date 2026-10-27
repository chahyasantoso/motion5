# Phase 5 Plan: Domain Plugins and Solver Graph

Prepared 2026-10-25 for `refactor/v5-identified-tables`. The implementer starts at Slice 0
and executes slices in order. Do not commit this plan.
Companion read-budget summary (new):
`motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan-summary.md`.

## Snapshot identity

- Input snapshot: `motion5-refactor-v5-identified-tables.zip`.
- No `.git` directory is present; commit hash and ref are unknown.
- Expected tip when this plan was requested: `8a475ce`. It cannot be verified from this archive.
- Sanity checks pass: `test/pending.json` has 79 entries: 73 phase 5, 4 phase 6, and 2 phase 7.
  Both required files exist: `packages/core/src/runtime/edit-plan-values.ts` and
  `packages/core/src/runtime/edit-batch.ts`.
- These checks identify the expected Phase 4-tip snapshot, but do not establish its commit.
  Treat the hashes below as the drift guard.
- If any sanity check or hash differs in the implementer's checkout, stop and report that this
  is not the Phase 4 tip. Do not adapt this plan to another snapshot.
- Hashes are the first 12 lowercase hex characters of SHA-256 computed with `node:crypto`.
  New paths are marked `[NEW]` and have no baseline hash.

### Drift guard: source and configuration

- `AGENTS.md` — `sha256:9b39914c4cc2`
- `docs/GUARDRAILS.md` — `sha256:46b8452818d8`
- `docs/ARCHITECTURE.md` — `sha256:f1c61cbe98cc`
- `package.json` — `sha256:31e9a00ef2ff`
- `motion5-implementation-plans/motion5-v5-refactor-guide-onefile.md` —
  `sha256:ca594accb8cd`
- `motion5-implementation-plans/phase4-api-decision.md` — `sha256:ee8a43c8b49e`
- `motion5-implementation-plans/phase7-ledger.md` — `sha256:77c4437dee37`
- `motion5-implementation-plans/ik-baseline-97a4593.json` — `sha256:bc4124d23fea`
- `test/pending.json` — `sha256:572d886a211f`
- `packages/core/src/runtime/edit-plan-values.ts` — `sha256:369292fb4d42`
- `packages/core/src/runtime/edit-batch.ts` — `sha256:33131632b962`
- `packages/core/src/runtime/value-track.ts` — `sha256:5b4c65984121`
- `packages/core/src/runtime/plugin-track.ts` — `sha256:305c09c43a9e`
- `apps/pose-gap-filler/src/rig/writer.ts` — `sha256:e70b36ea8d8c`
- `packages/three/src/skeleton-capture.ts` — `sha256:a1b861e90036`

### Drift guard: built-ins and helpers

- `packages/plugins/src/catalog.ts` — `sha256:3df50b4afda0`
- `packages/plugins/src/loader.ts` — `sha256:a8407f0a7ea0`
- `packages/plugins/src/runner.ts` — `sha256:12c4acbfbb7c`
- `packages/plugins/src/labels.ts` — `sha256:44dfea231ebd`
- `packages/plugins/src/pose-classify.ts` — `sha256:677c274b2d27`
- `packages/plugins/src/transform.ts` — `sha256:9ae21c808635`
- `packages/plugins/src/transform3d.ts` — `sha256:86f9027e3d95`
- `packages/plugins/src/fk.ts` — `sha256:412aa3779f72`
- `packages/plugins/src/fk3d.ts` — `sha256:45a110b7835e`
- `packages/plugins/src/rig.ts` — `sha256:4b150ddc0229`
- `packages/plugins/src/frame.ts` — `sha256:35ff4ef726fc`
- `packages/plugins/src/frame3d.ts` — `sha256:9a6b9e04d124`
- `packages/plugins/src/ik.ts` — `sha256:a7e078bee2b6`
- `packages/plugins/src/ik-analytic.ts` — `sha256:86c02ef7f5f9`
- `packages/plugins/src/ik-chain.ts` — `sha256:85754185bcb0`
- `packages/plugins/src/ik-constraint.ts` — `sha256:85c989c84bd0`
- `packages/plugins/src/ik-descent.ts` — `sha256:f720cd72fbe5`
- `packages/plugins/src/ik-goal-reading.ts` — `sha256:810dbc73096f`
- `packages/plugins/src/ik-goal.ts` — `sha256:70509a56012f`
- `packages/plugins/src/ik-member.ts` — `sha256:08419c054f81`
- `packages/plugins/src/ik-result.ts` — `sha256:92c3eeaf6555`
- `packages/plugins/src/ik-scale.ts` — `sha256:dd9579f1bac9`
- `packages/plugins/src/ik-solve.ts` — `sha256:66827495d30d`
- `packages/plugins/src/ik-topology.ts` — `sha256:1198e6306cbd`
- `packages/plugins/src/fabrik.ts` — `sha256:0088b582b08f`
- `packages/plugins/src/fabrik-cap.ts` — `sha256:8ba0b819763c`
- `packages/plugins/src/fabrik-seed.ts` — `sha256:cd8ec4a34721`
- `packages/plugins/src/fabrik-select.ts` — `sha256:3e1b39f66f50`
- `packages/plugins/src/ik3d.ts` — `sha256:e1d7dc819ad1`
- `packages/plugins/src/ik3d-analytic.ts` — `sha256:152b19a2d8f2`
- `packages/plugins/src/ik3d-chain.ts` — `sha256:18b5d6127182`
- `packages/plugins/src/ik3d-compromise.ts` — `sha256:5270590b7332`
- `packages/plugins/src/ik3d-constraint.ts` — `sha256:c88321fd49e3`
- `packages/plugins/src/ik3d-fabrik.ts` — `sha256:48e80bff55e3`
- `packages/plugins/src/ik3d-orient.ts` — `sha256:41e7270463dd`
- `packages/plugins/src/ik3d-result.ts` — `sha256:1121d6bddabc`
- `packages/plugins/src/ik3d-seed.ts` — `sha256:d47ba1a60b43`
- `packages/plugins/src/ik3d-serial-recovery.ts` — `sha256:d94cbb79b00f`
- `packages/plugins/src/ik3d-solve.ts` — `sha256:b8fc2d2f4688`

### Drift guard: phase 5 pending tests

- `apps/pose-gap-filler/test/avatar-viewport.test.ts` — `sha256:c9c4e732af7b`
- `apps/pose-gap-filler/test/avatar.test.ts` — `sha256:ab565ca3c581`
- `apps/pose-gap-filler/test/bend-boundaries.test.ts` — `sha256:7b9b08d3ae7e`
- `apps/pose-gap-filler/test/bend-fallback.test.ts` — `sha256:0af2093f5399`
- `apps/pose-gap-filler/test/chain-replay.test.ts` — `sha256:13c23c441c6d`
- `apps/pose-gap-filler/test/gltf-avatar-lifecycle.test.ts` — `sha256:f31d306dbaba`
- `apps/pose-gap-filler/test/inferred-bends.test.ts` — `sha256:f298b1aad0c7`
- `apps/pose-gap-filler/test/persistent-avatar.test.ts` — `sha256:265d49b8eea2`
- `apps/pose-gap-filler/test/phone-persistence.test.ts` — `sha256:02c37a48473d`
- `apps/pose-gap-filler/test/record.test.ts` — `sha256:13e484306678`
- `apps/pose-gap-filler/test/replay.test.ts` — `sha256:76b3cd09715c`
- `apps/pose-gap-filler/test/rig.test.ts` — `sha256:453237cfa0cc`
- `apps/pose-gap-filler/test/stabilizer.test.ts` — `sha256:cb2836b500b1`
- `apps/pose-gap-filler/test/world.test.ts` — `sha256:134afe258d49`
- `packages/core/test/contract/v5-validator.test.ts` — `sha256:f6509a859e35`
- `packages/core/test/integration/bare-authored-leaf.test.ts` — `sha256:a2e910a030da`
- `packages/core/test/integration/contract-baseline.pending.test.ts` — `sha256:0d707cb2c91c`
- `packages/core/test/integration/demo-runtime-authoring.test.ts` — `sha256:3c7ecf40aa9f`
- `packages/core/test/integration/ik-fabrik-chain.test.ts` — `sha256:9ea4d4c7fbcb`
- `packages/core/test/integration/ik-multi-goal.test.ts` — `sha256:a482a59719db`
- `packages/core/test/integration/ik-playground-motion-progress.test.ts` —
  `sha256:8769aa4821c8`
- `packages/core/test/integration/ik-playground-scroll-rest.test.ts` —
  `sha256:da3910e64de4`
- `packages/core/test/integration/ik-two-bone.test.ts` — `sha256:3a6df98176d5`
- `packages/core/test/integration/ik3d-playground.test.ts` — `sha256:e5c21d8b7cf1`
- `packages/core/test/integration/ik3d-two-bone.test.ts` — `sha256:987c1c0e568b`
- `packages/core/test/integration/internal-key-strip.test.ts` — `sha256:6cfd1731bdb3`
- `packages/core/test/integration/keyframe-groups.test.ts` — `sha256:dd1bc4bf57c4`
- `packages/core/test/integration/plugin-group-values-section.test.ts` — `sha256:3dae78bb19a2`
- `packages/core/test/integration/react-demo-rig.test.ts` — `sha256:52b8a1b210bf`
- `packages/core/test/integration/solver-member-cache.test.ts` — `sha256:7f507958bf16`
- `packages/core/test/unit/domain/dict-valued-requirements.test.ts` — `sha256:7b3ee8650d8d`
- `packages/core/test/unit/domain/plugin-3d-ownership.test.ts` — `sha256:04e6ce370c82`
- `packages/core/test/unit/domain/plugin-capabilities.test.ts` — `sha256:e607e96a90f1`
- `packages/core/test/unit/graph/arity-lift.test.ts` — `sha256:ce8886c60c4d`
- `packages/core/test/unit/graph/graph-dependants.test.ts` — `sha256:de18802e30cd`
- `packages/core/test/unit/graph/ik3d-goal-weights-load.test.ts` — `sha256:563f56960f2c`
- `packages/core/test/unit/graph/ik3d-joint-load.test.ts` — `sha256:fae2e0dfde35`
- `packages/core/test/unit/graph/ik3d-tree-load.test.ts` — `sha256:f4890eeb4176`
- `packages/core/test/unit/graph/incremental-cache.test.ts` — `sha256:2df183964d6e`
- `packages/core/test/unit/graph/resolve-solvers.test.ts` — `sha256:d8a35c126a18`
- `packages/core/test/unit/graph/solved-pivot-offset.test.ts` — `sha256:17727a249cc9`
- `packages/core/test/unit/graph/solved-rotation-weight.test.ts` — `sha256:1f629f702c4e`
- `packages/core/test/unit/graph/solver-constraints.test.ts` — `sha256:a73b3275b16e`
- `packages/core/test/unit/graph/solver-goal-required.test.ts` — `sha256:82207fac769a`
- `packages/core/test/unit/graph/solver-goals.test.ts` — `sha256:aac124617b77`
- `packages/core/test/unit/plugins/fk3d-rest-weight.test.ts` — `sha256:a820bb29b649`
- `packages/core/test/unit/plugins/ik-goal-influence.test.ts` — `sha256:89f4f2ac777b`
- `packages/core/test/unit/plugins/ik-inspection.test.ts` — `sha256:5544d08bec2b`
- `packages/core/test/unit/plugins/ik3d-inspection.test.ts` — `sha256:9056114a88a3`
- `packages/core/test/unit/plugins/ik3d-pole.test.ts` — `sha256:6973784a9a1b`
- `packages/core/test/unit/runtime/commit-write-cost.test.ts` — `sha256:d95d62b45b54`
- `packages/core/test/unit/runtime/declined-build-write-drop.test.ts` —
  `sha256:b7daaa9fe2b9`
- `packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts` —
  `sha256:3fa5fd45252e`
- `packages/core/test/unit/runtime/publisher-solver-members.test.ts` —
  `sha256:e851084fe4b8`
- `packages/core/test/unit/runtime/recompile-predicate.test.ts` — `sha256:5c422e7cce2a`
- `packages/core/test/unit/runtime/removal-flush-seed.pending.test.ts` —
  `sha256:0b1f720f4ffc`
- `packages/plugins/test/integration/ik-envelope.test.ts` — `sha256:584921b88258`
- `packages/plugins/test/integration/ik-guide-examples.test.ts` —
  `sha256:619ca76aac6c`
- `packages/plugins/test/integration/ik-stability.test.ts` — `sha256:5069392f07f6`
- `packages/plugins/test/integration/ik3d-guide-examples.test.ts` —
  `sha256:d2d97508ca9a`
- `packages/plugins/test/integration/ik3d-joint.test.ts` — `sha256:bae6d1be0bd9`
- `packages/plugins/test/integration/ik3d-orient.test.ts` — `sha256:e9fb5a1852df`
- `packages/plugins/test/integration/ik3d-tree.test.ts` — `sha256:4bf2159e5826`
- `packages/plugins/test/integration/live-edit-ensure.test.ts` — `sha256:f2ffdef55c0d`
- `packages/plugins/test/integration/live-value-composition.test.ts` —
  `sha256:aba95a6f7f10`
- `packages/plugins/test/integration/mutation-transactionality.test.ts` —
  `sha256:fa05e5024270`
- `packages/plugins/test/integration/per-plugin-key-ownership.test.ts` —
  `sha256:f8f639087d20`
- `packages/plugins/test/integration/plugin-owned-requirements.test.ts` —
  `sha256:7361d659ae77`
- `packages/plugins/test/integration/single-input-channel.test.ts` — `sha256:14d799a331f7`
- `packages/plugins/test/labels.test.ts` — `sha256:3d46430c454f`
- `packages/plugins/test/pose-classify.test.ts` — `sha256:1bfaf4e5b74e`
- `packages/plugins/test/rig.test.ts` — `sha256:54dacc62b4bc`
- `packages/plugins/test/unit/loader.test.ts` — `sha256:ace4daa279e3`

## Source inventory

### Registration and current grouped contract

`packages/plugins/src/catalog.ts` loads definitions lazily in this order: transform, FK, IK,
transform3d, FK3D, IK3D, rig. `packages/plugins/src/loader.ts` loads approved definitions and
registers the batch. Helpers do not register themselves.

- `transform.ts` declares `keys` and `compose`; it has no explicit `stage` or `outputs` fields.
- `transform3d.ts` likewise declares `keys` and `compose` only.
- `fk.ts` declares `keys`, `stage: "compose"`, `outputs`, and `compose`.
- `fk3d.ts` declares `keys`, `stage: "compose"`, `outputs`, and `compose`.
- `ik.ts` declares `keys`, `stage: "compose"`, `outputs` (`rotations` and inspection), and
  `compose`; its compose function reads the private publisher `inputs.members` path.
- `ik3d.ts` declares `keys`, `stage: "compose"`, `outputs` (`rotations3d` and inspection),
  and `compose`; it also reads private publisher members.
- `rig.ts` declares `keys: []`, `stage: "compose"`, `outputs: ["pose", "controls"]`, and
  `compose`; it consumes keyed object dictionaries and returns records.

All seven use the old grouped `PluginDefinition`/compose execution surface. The `inputs` argument
is grouped context, not a declared named-slot `requires` map. Phase 5 migrates one boundary at a
time to named input/output schemas and a synchronous `transform({ values, requires })`. The old
catalog and loader remain for unmigrated consumers; they are not a second runtime.

### Built-ins and helper ownership

- `transform.ts` and `transform3d.ts` own their plugin logic. `frame.ts` and `frame3d.ts` own
  renderer-neutral frame shapes and math shared with FK/rig.
- `fk.ts` and `fk3d.ts` own forward-kinematic composition. They must consume declared rest,
  parent-frame, and solver dependencies; they must not query publishers or inspect graph state.
- `ik.ts` owns the 2D plugin boundary. Reuse `ik-analytic.ts`, `ik-chain.ts`, `ik-constraint.ts`,
  `ik-descent.ts`, `ik-goal-reading.ts`, `ik-goal.ts`, `ik-member.ts`, `ik-result.ts`,
  `ik-scale.ts`, `ik-solve.ts`, `ik-topology.ts`, `fabrik.ts`, `fabrik-cap.ts`, `fabrik-seed.ts`,
  and `fabrik-select.ts`.
- `ik3d.ts` owns the 3D plugin boundary. Reuse `ik3d-analytic.ts`, `ik3d-chain.ts`,
  `ik3d-compromise.ts`, `ik3d-constraint.ts`, `ik3d-fabrik.ts`, `ik3d-orient.ts`,
  `ik3d-result.ts`, `ik3d-seed.ts`, `ik3d-serial-recovery.ts`, and `ik3d-solve.ts`.
- `rig.ts` owns `pose` and `controls` aggregation. `labels.ts` owns label reading;
  `pose-classify.ts` owns classifier math and its factory. `runner.ts` owns runner steps, not domain
  data shapes.

## FINAL decisions

Every record is final. Do not reopen these choices during implementation. A `wrong if` line is a
stop/report condition, not permission to silently choose a different design.

### D1. Solver and rig row identity — FINAL

Decision: use the unqualified canonical domain `memberId` as each solver row's `id` and each rig
pose row's `id`. Use `controlId` as each controls row's `id`. Map labels and graph track IDs are
binding/graph metadata, not row identity.

Options considered:

- Qualified graph node ID: + globally unique; - changes when a track moves or is renamed.
- Map member key: + immediately available; - loses identity when a map is rebuilt or re-keyed.
- Canonical domain member key: + stable across graph placement and explicit joins; - must be
  unique in the solver/rig domain.

Deciding criterion: identity must survive graph reorganization and joins must be explicit.
Validate duplicate or absent domain IDs; never silently pick one.

Wrong if: the source proves one solver must distinguish two entities with one `memberId`. Stop and
report rather than qualifying that row with a graph ID.

### D2. FK output shape — FINAL

Decision: FK emits a one-row `values` table keyed by `memberId`, not a keyed record or unidentified
frame record. The row's flat `cells` contain the world-frame scalars declared by the shared frame
schema. This gives FK, solver selection, and rig one row-ID convention.

Options considered:

- Record keyed by member ID: + compact; - record keys are not the v5 table row envelope.
- Bare record: + simple for one frame; - no identity for explicit dependency selection.
- One-row table: + explicit row envelope and identity; - adds one row wrapper per FK track.

Deciding criterion: preserve row identity through declared dependencies and map aggregation
without using track IDs.

Wrong if: the v5 slot validator forbids a one-row table for FK. Step 0 checks the slot schema and
stops if it does.

### D3. Inspect opt-in — FINAL

Decision: `inspect` is absent by default. Emit it only when local static
`inputs.values.inspect === true`. It is a flat record with `kind`, `residual`, and `iterations`; it
never contains graph objects or echoed authored keys.

Options considered:

- Always emit: + simpler callers; - pays cost and exposes diagnostics when not requested.
- Static opt-in: + explicit and cacheable; - requires an input field and optional output schema.
- Arbitrary caller-selected diagnostics: + flexible; - unbounded and unstable output.

Deciding criterion: the opt-in belongs in the declared contract and the diagnostic set is closed.

Wrong if: source shows a consumer requires inspect without an authored opt-in. Stop and report;
do not silently make diagnostics always-on.

### D4. Migration order — FINAL

Decision: migrate one plugin at a time in vertical slices. Complete 2D and 3D solver proofs before
FK/FK3D/rig migration. Each plugin entrypoint owns its boundary; pure helpers keep their current
algorithm ownership.

Options considered:

- Whole-family rewrite: + uniform cutover; - broad diff mixes ownership and hides regressions.
- Plugin-by-plugin: + narrow review and reversible slice; - repeats small integration work.
- Shared API first: + fewer edits; - leaves hidden publisher reads and ambiguous rows.

Deciding criterion: correctness and reviewability precede DRY; share only after a second real
consumer exists.

Wrong if: loader or graph code requires an atomic cross-plugin migration for correctness. Report
that concrete dependency before editing; do not widen the slice silently.

### D5. Dependency graph — FINAL

Decision: make dependencies explicit. A member rest/config record owns authored length, rest
orientation, weight, limits, and explicit `parentId` topology. Solver reads declared rest-member,
root, and goal slots; FK reads rest, parent frame, and solver slots; rig reads bone/control maps.
Solver never consumes posed FK output. Binding keys never become row IDs.

Options considered:

- Hidden publisher/member read: + less binding setup; - invisible edges and cycles.
- One opaque input bag: + short schema; - no per-slot compatibility checks.
- Named typed slots: + explicit graph and slot validation; - more declared bindings.

Deciding criterion: graph correctness, cycle visibility, and §14.4's separation of rest, solver,
FK/world-frame, and rig responsibilities.

Wrong if: the live schema cannot express the declared map/single slot shapes in the guide. Stop and
report a source/guide contradiction before changing the API.

### D6. Grouped registry retirement — FINAL

Decision: keep the current catalog/loader for unmigrated consumers. Migrated plugins leave the old
`keys`/`stage`/`compose` contract; do not add a bridge or fallback. Remove old grouped machinery
only in Phase 7 after a repository-wide zero-consumer proof.

Options considered:

- Delete now: + no legacy surface; - breaks remaining registered plugins.
- Dual-run old and new: + gradual; - creates two engines and ambiguous output ownership.
- Retire in Phase 7: + one contract per migrated boundary; - old helpers remain temporarily.

Deciding criterion: migrate consumers without breaking ones that remain on the old registry.

Wrong if: source inventory proves no old consumer remains. Recheck the Phase 7 ledger and stop
before adding a compatibility bridge.

### D7. Classifier output and closed unions — FINAL

Decision: the classifier publishes one flat `values` record `{ label, confidence }`. Preserve the
existing closed `SolveQuality` variants and exhaustively switch with `unreachable()`. Use a local
discriminated `MemberRowLookup` union for `found | missing`; reject duplicate IDs before lookup.

Options considered:

- Top-level `label` and `confidence` outputs: + minimal edit; - misses single-result convention.
- One `values` record: + matches the guide; - requires label-reader migration.
- Generic result envelope for every plugin: + one abstraction; - over-generalizes unrelated shapes.

Deciding criterion: use a flat record for one result and unions only for genuinely closed outcomes.

Wrong if: the current output validator rejects record-valued classifier `values`. Step 0 verifies
that contract; stop on a real mismatch.

### D8. Retargeting scope — FINAL; least sure

Decision: do not invent a general retarget algorithm without an existing consumer and fixture.
`UNVERIFIED`: the guide names retargeting in Phase 5, but the source inventory found no registered
domain retarget plugin or concrete consumer. Slice 8 Step 0 verifies this. If it finds one, stop
and report the guide/source mismatch; do not improvise an algorithm.

Options considered:

- Add a generic retargeter now: + appears to satisfy the guide noun; - no bounded semantics,
  consumer, or golden fixture is established.
- Treat capture/frame conversion as retargeting: + reuses behavior; - equivalence is not
  established by source.
- Do not create absent behavior: + honors correctness/YAGNI; - may leave a guide target unresolved
  until the source contract is clarified.

Deciding criterion: preserve or migrate concrete behavior; do not create a new solver feature
without a source contract.

Wrong if: a concrete retarget implementation or caller is found. That is a stop/report condition.

### D9. Over-engineering boundary — FINAL

Decision: no generic plugin base, solver framework, schema converter, branded-string layer, second
registry, or all-purpose retarget module. Reuse existing frame and solver helpers. Use exhaustive
unions for closed result/lookup sets; do not wrap open numeric rows in artificial variants.

Options considered:

- Generalize all plugins: + fewer entrypoints; - couples unrelated shapes and ownership.
- Keep small per-plugin boundaries: + explicit and testable; - repeats a few object literals.
- Add generic row helpers now: + possible future reuse; - only one real consumer per operation.

Deciding criterion: correctness, clear ownership, then DRY/YAGNI.

Wrong if: a second real consumer already needs the exact helper contract. Reuse it rather than
cloning the helper.

### D10. Solver equivalence and performance — FINAL

Decision: numerical transport must match existing fixtures within absolute `1e-6` in existing
units; deterministic call counts gate performance at N=14 and N=200. Wall-clock is report-only.

Options considered:

- Bit-for-bit floats: + strict; - fragile if equivalent row ordering changes summation order.
- Absolute `1e-6`: + catches real transport/math changes while allowing roundoff; - requires units.
- Looser tolerance: + easy to satisfy; - can hide a regression.

Deciding criterion: transport changes only; preserve quality/IDs/booleans exactly and allow only
small numeric roundoff.

Wrong if: the existing solver is nondeterministic beyond this bound on unchanged fixtures. Stop
and report the observed fixture variance; do not raise the tolerance silently.

## Phase 4 decisions from Section E — FINAL; do not reopen

- Phase 4 medians are the v5 baseline: `values.set` table 34,739 ns and `writeValues` record
  7,282 ns. The comparison against old `setValues` is invalid because the old path was a no-op.
- Internal `edit-batch` refuses a list mixing structural and value edits, by name. It is internal
  only; there is no public `apply`.
- In a staged recipe, removing a chain parent before its dependants is refused with
  `edge-unknown-source`. Leaf-first removal is the supported order.
- `values(recipe)` is not a transaction. Writes accepted before a refused edit remain applied.
- Slice 0 builds the candidate evaluator before disposing the old evaluator in both
  `ValueTrack.replaceValues` and `PluginTrack.replaceValues`. A throwing build leaves the track
  usable; add a test that still evaluates its previous values.
- If Slice 9 touches the app rig writer, fold its per-field `setField` calls into one
  `values.set` per track. This slice does touch it, so this is mandatory.

## Standing rules

- Keep v5. No legacy parser, second engine, compatibility alias, silent fallback, or dual output.
- No `any`, unchecked casts, or type assertions used to evade a schema. Prefer inference,
  narrowings, and exhaustive switches with the existing `unreachable()` helper.
- Never delete a failing test, skip it, weaken an assertion, or un-pend it before it passes.
- DRY: reuse existing helpers before adding one. A helper needs a second real consumer or a clear
  single-owner boundary.
- DI through ports. Core never imports GSAP, React, or DOM APIs.
- One commit per slice. Do not amend or combine slices. Do not commit this plan.
- Read budget: 60 KB hard maximum; above 30 KB requires a sibling `.md` summary. Keep each new
  module small with one owner.
- Plugin transforms are synchronous, deterministic, immutable, renderer-neutral, and have no
  hidden graph reads. They return complete declared outputs, not an implicit merge.
- Map slot keys name bindings only. Use source row `id` or explicit `memberId` for identity.
- Optional absence is allowed only where declared. A bound unavailable source blocks its
  consumer. A failed node owns no outputs; same-batch dependants see fresh committed values.

## Implementer protocol and mandatory Slice 0 Step 0

The implementer, not the planner, runs commands. Save this plan and its companion summary at
`motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan.md` and
`motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan-summary.md`.
Before any edit:

1. Confirm Node is version 24 or later.
2. Recompute every hash row with `node:crypto`. Stop on any mismatch, missing path, duplicate,
   or total other than 127. Run from the repository root:

```js
const fs = require("node:fs");
const crypto = require("node:crypto");
const plan = fs.readFileSync(
  "motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan.md",
  "utf8",
);
const lines = plan.split(/\r?\n/);
const rows = [];
for (let index = 0; index < lines.length; index += 1) {
  const inline = /^- `([^`]+)` — `sha256:([a-f0-9]{12})`$/.exec(lines[index]);
  if (inline) {
    rows.push([inline[1], inline[2]]);
    continue;
  }
  const pathOnly = /^- `([^`]+)` —?$/.exec(lines[index]);
  const hashOnly = /^\s+`sha256:([a-f0-9]{12})`$/.exec(lines[index + 1] ?? "");
  if (pathOnly && hashOnly) {
    rows.push([pathOnly[1], hashOnly[1]]);
    index += 1;
  }
}
if (rows.length !== 127) throw new Error(`Expected 127 hashes, found ${rows.length}`);
if (new Set(rows.map(([path]) => path)).size !== 127) {
  throw new Error("Hash ledger contains duplicate paths");
}
for (const [path, expected] of rows) {
  const actual = crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
  if (actual.slice(0, 12) !== expected) {
    throw new Error(`${path}: expected ${expected}, got ${actual.slice(0, 12)}`);
  }
}
console.log(`Verified ${rows.length} source hashes`);
```

3. Re-run the sanity checks. Require 79 pending entries: 73 phase 5, 4 phase 6, 2 phase 7;
   require both `edit-plan-values.ts` and `edit-batch.ts`. If a check fails, stop and report this
   is not the Phase 4 tip.
4. Run the plan formatter check exactly:

```sh
npx prettier --check \
  motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan.md
```

5. On Node 24+, run these one at a time; stop if any fails. Paste each command and its full result
   into the pull request body:

```sh
npm run format:check
npm run typecheck
npm run test:boundaries
npm run test:read-budget
npm test
npm run bench:ik
```

Use committed `motion5-implementation-plans/ik-baseline-97a4593.json` as the performance
reference. The planner did not run the benchmark. Do not run another benchmark script or use wall
clock as a pass condition. `package.json` confirms `npm test` is `vitest run` and
`format:check` is check-only.

### Per-slice gate protocol

Before each later slice, confirm the preceding commit's exit criteria and run
`npm run format:check`, `npm run typecheck`, and `npm run test:boundaries`. If a core source file
changes, also run `npm run test:read-budget`. Stop before editing if any gate fails. After editing,
run the exact Vitest paths listed for that slice and rerun the relevant commands. Only then remove
the passing entries from `test/pending.json` and commit.

## Shared domain types and graph contract

Use the v5 `ValueSpec`/`DependencySpec` contract from the guide and Phase 4 APIs. Records are flat
scalar records; tables use `{ id, cells }` rows. No nested record/array cells. Graph binding keys
are not row identity.

- A no-plugin rest source has record `values` with `memberId`, `parentId` when applicable, and
  authored rest/config scalar fields. `memberId` is static for that local track. Topology is
  explicit as `parentId`, not inferred from array order or a hidden publisher list.
- Root is one declared record dependency. Goals are a declared map of records or a typed table;
  use explicit `goalId` and target `memberId`, x/y (and z in 3D), influence/weight, and existing
  constraint fields. Do not promote map keys to goal IDs.
- `ik` declares `members` as a map slot, `root` as a single slot, and `goals` as a map slot. Each
  dependency declares the exact `values` output and row/record fields it reads.
- `ik3d` declares equivalent slots plus named current pole/orientation/joint slots. Do not add an
  arbitrary input bag.
- FK declares single `rest`, `parent`, and `solver` slots. It finds its solver row by `memberId`;
  no hidden publisher read and no implicit first-row choice.
- `rig` declares `bones` and `controls` as map slots. Output IDs come from dependency `row.id`,
  never the map label.
- A plugin with one main result returns `values`; peer outputs are for distinct concepts such as
  rig `pose` and `controls`. Diagnostic `inspect` is optional and opt-in.

The 2D graph must be acyclic:

```text
rest/config member records + root + goals
                  |
                  v
              ik values rows
                  |
                  v
        FK world-frame value rows
                  |
                  v
           rig pose/controls
```

The 3D graph has the same separation with 3D frames and joint/pole/orientation inputs. FK output
must not feed the solver that produces FK's own rotation.

## Ordered slices

Every file marked `[NEW]` is new; every other path is confirmed in the snapshot and has a hash
above. Each slice's Step 0 is mandatory. Tests listed are the exact pending entries to un-pend,
once passing.

### Slice 0 — evaluator replacement safety and baseline

**Goal and invariant.** Build a replacement evaluator first. If construction throws, the existing
evaluator remains installed, undisposed, and still evaluates old values. A successful build
installs the candidate and only then disposes the prior evaluator. No other behavior changes.

**Single owner.** New helper `[NEW] packages/core/src/runtime/evaluator-replacement.ts` owns the
build/install/dispose order. `ValueTrack` and `PluginTrack` call it from their existing methods.

**Files.** Edit `packages/core/src/runtime/value-track.ts` and
`packages/core/src/runtime/plugin-track.ts`. Create the helper and
`[NEW] packages/core/test/unit/runtime/replace-values-build-transactionality.test.ts`. Update
`test/pending.json` only for the two passing entries below.

**Types.** `replaceEvaluator<E extends { dispose(): void }>(previous: E, build: () => E,
install: (next: E) => void): void`. `build()` runs before `install()` or `previous.dispose()`.
Keep both existing `ParsedValues | undefined` signatures unchanged.

**CORRECT**

```ts
const next = build();
install(next);
previous.dispose();
```

**WRONG**

```ts
previous.dispose();
install(build());
```

**Non-goals.** No transaction semantics, rollback of earlier writes, schema changes, overlay
changes, or internal `edit-batch` changes.

**Step 0 gate.** Run the full implementer protocol above: verify 127 hashes and snapshot checks,
run plan `npx prettier --check`, then run all six required commands on Node 24+. Stop on failure.

**Grep checklist.** Both track methods must route through the helper:

```sh
rg -n 'replaceValues|replaceEvaluator|createValueEvaluator|\.dispose\(\)' \
  packages/core/src/runtime/value-track.ts \
  packages/core/src/runtime/plugin-track.ts \
  packages/core/src/runtime/evaluator-replacement.ts
```

**Pending entries.** Un-pend only after passing:

- `packages/core/test/unit/runtime/commit-write-cost.test.ts`
- `packages/core/test/unit/runtime/recompile-predicate.test.ts`

**Post-edit gate.** Run `npx vitest run` on those two paths and the new regression test; run
`npm run typecheck`, `npm run format:check`, `npm run test:boundaries`, and
`npm run test:read-budget`.

**Commit.** `fix(core): preserve evaluator when replacement build fails`

**Exit criteria.** Tests cover both track classes, prove old values still evaluate after a throwing
build, and prove prior evaluator disposal follows successful build. Two pending tests pass and are
removed from pending. All post-edit gates pass. No other production behavior changes.

### Slice 1 — simple 2D transform plugin

**Goal and invariant.** Migrate only the 2D transform plugin to declared v5 inputs/outputs. Rows
preserve source IDs; authored values are not implicitly merged.

**Single owner.** `packages/plugins/src/transform.ts`.

**Files.** Edit that plugin and its tests below. Verify registration in
`packages/plugins/src/catalog.ts`; do not edit catalog/loader unless the registered name is wrong.
Update `test/pending.json` after tests pass.

**Types.** `inputs.values` is the existing flat numeric transform record. `inputs.requires.data`
declares source `values` as a point table. `outputs.values` declares the transformed point table.
Implement with `transform({ values, requires })`; retain existing numerical math.

**CORRECT**

```ts
return {
  values: requires.data.values.map((row) => ({
    id: row.id,
    cells: { x: row.cells.x + values.dx, y: row.cells.y + values.dy },
  })),
};
```

**WRONG**

```ts
return { ...values, ...requires.data, positions: {} };
```

**Non-goals.** Do not migrate 3D transform, FK, IK, labels, or registry. Do not keep a `compose`
fallback or return undeclared aliases.

**Step 0 gate.** Before editing, run the per-slice gate protocol; stop on failure. After editing,
run the 13 tests below and the same relevant commands.

**Grep checklist.** Old grouped fields must be absent and registration present once:

```sh
rg -n 'keys:|stage:|compose:|claimsKey|positions:' packages/plugins/src/transform.ts
rg -n 'transform' packages/plugins/src/catalog.ts
```

**Pending entries.** Un-pend after passing:

- `packages/core/test/contract/v5-validator.test.ts`
- `packages/core/test/integration/bare-authored-leaf.test.ts`
- `packages/core/test/integration/contract-baseline.pending.test.ts`
- `packages/core/test/integration/internal-key-strip.test.ts`
- `packages/core/test/integration/keyframe-groups.test.ts`
- `packages/core/test/integration/plugin-group-values-section.test.ts`
- `packages/plugins/test/integration/live-edit-ensure.test.ts`
- `packages/plugins/test/integration/live-value-composition.test.ts`
- `packages/plugins/test/integration/mutation-transactionality.test.ts`
- `packages/plugins/test/integration/per-plugin-key-ownership.test.ts`
- `packages/plugins/test/integration/plugin-owned-requirements.test.ts`
- `packages/plugins/test/integration/single-input-channel.test.ts`
- `packages/plugins/test/unit/loader.test.ts`

**Commit.** `refactor(plugins): migrate transform to identified values`

**Exit criteria.** Plugin selected once; input slots and full output schema are declared; row IDs
are preserved; 13 tests and global post-edit gates pass. No grouped fallback remains here.

### Slice 2 — simple 3D transform plugin

**Goal and invariant.** Migrate only `transform3d`; every row keeps its ID and every output cell is
declared by its 3D schema.

**Single owner.** `packages/plugins/src/transform3d.ts`.

**Files.** Edit that module and the two domain tests below. Verify registration in
`packages/plugins/src/catalog.ts`; update `test/pending.json` after tests pass.

**Types.** Flat local record fields use the existing 3D frame schema. Declare the `data`
dependency and output `values` schema. Use `transform({ values, requires })`; preserve frame math.

**CORRECT**

```ts
return {
  values: requires.data.values.map((row) => ({
    id: row.id,
    cells: {
      x: row.cells.x + values.dx,
      y: row.cells.y + values.dy,
      z: row.cells.z + values.dz,
    },
  })),
};
```

**WRONG**

```ts
return { rotations3d: Object.fromEntries(rows.map((row) => [row.trackId, row])) };
```

**Non-goals.** No FK3D migration, new 3D math, frame alias, or shared transform base class.

**Step 0 gate.** Before editing, run the per-slice gate protocol. After editing, run both tests
below and the same relevant commands.

**Grep checklist.** Old grouped fields and `rotations3d` alias must be absent:

```sh
rg -n 'keys:|stage:|compose:|rotations3d|trackId' \
  packages/plugins/src/transform3d.ts
rg -n 'transform3d' packages/plugins/src/catalog.ts
```

**Pending entries.** Un-pend after passing:

- `packages/core/test/unit/domain/plugin-3d-ownership.test.ts`
- `packages/core/test/unit/domain/plugin-capabilities.test.ts`

**Commit.** `refactor(plugins): migrate transform3d to identified values`

**Exit criteria.** Both tests pass; output rows retain IDs and only declared v5 outputs remain.
No 2D or FK behavior changes.

### Slice 3 — explicit 2D solver graph and IK proof

**Goal and invariant.** Replace IK's publisher-member read and output map with an explicit acyclic
graph. Prove the 2D half of §14.5 with real rest/config, root, goals, and solver fixtures. This is a
hard gate before any FK or rig migration.

**Single owner.** `packages/plugins/src/ik.ts` owns the plugin boundary. `ik-member.ts`,
`ik-goal-reading.ts`, and `ik-result.ts` own narrow adapters. Solver math stays in existing helpers.

**Files.** Edit `ik.ts`, `ik-member.ts`, `ik-goal-reading.ts`, and `ik-result.ts` only for explicit
inputs/output projection. Reuse `ik-chain.ts`, `ik-solve.ts`, `ik-topology.ts`, and analytic/FABRIK
helpers without changing math. Edit the 16 tests below and `test/pending.json`. Create
`[NEW] packages/plugins/test/integration/solver-call-counts.test.ts` for N=14 and N=200.

**Types.** Flat rest member record: `memberId`, `parentId` when applicable, `length`,
`restRotation`, `weight`, and existing scalar constraints. Root is a single flat record. Each goal
record carries `goalId`, target `memberId`, x/y, influence/weight, and existing constraints.
Declare `requires.members` map, `requires.root` single, `requires.goals` map. Ignore binding labels
when constructing row IDs. `outputs.values` is a table with `id = memberId`, `rotation`, optional
leaf `residual`, and optional `atBound`. Optional `outputs.inspect` is returned only for local
static `inspect === true`.

```ts
type MemberRowLookup<Row> =
  | { readonly kind: "found"; readonly row: Row }
  | { readonly kind: "missing"; readonly memberId: string };
```

Keep the existing closed `SolveQuality` variants and switch exhaustively with `unreachable()`.

**CORRECT**

```ts
const values = members.map((member) => ({
  id: member.memberId,
  cells: { rotation: solveMember(member), residual: memberResidual(member) },
}));
return inspectRequested ? { values, inspect } : { values };
```

**WRONG**

```ts
return { rotations: Object.fromEntries(members.map((m) => [m.trackId, solveMember(m)])) };
```

**Non-goals.** No solver math rewrite, cache redesign, graph engine change, hidden `inputs.members`,
implicit output merge, `rotations` map, qualified row IDs, or FK/rig migration.

**Step 0 gate.** Before editing, run the per-slice gate protocol. After editing, run all 16 tests
below, the new call-count test, and relevant commands. Stop before Slices 5-7 if any §14.5 2D item
fails.

**Grep checklist.** No publisher-member read or old output path in the migrated boundary:

```sh
rg -n 'inputs\.members|publisher|rotations|compose:|stage:|keys:' \
  packages/plugins/src/ik.ts packages/plugins/src/ik-member.ts \
  packages/plugins/src/ik-goal-reading.ts packages/plugins/src/ik-result.ts
```

**Pending entries.** Un-pend after passing:

- `packages/core/test/integration/ik-fabrik-chain.test.ts`
- `packages/core/test/integration/ik-multi-goal.test.ts`
- `packages/core/test/integration/ik-playground-motion-progress.test.ts`
- `packages/core/test/integration/ik-playground-scroll-rest.test.ts`
- `packages/core/test/integration/ik-two-bone.test.ts`
- `packages/core/test/integration/solver-member-cache.test.ts`
- `packages/core/test/unit/graph/incremental-cache.test.ts`
- `packages/core/test/unit/graph/solver-constraints.test.ts`
- `packages/core/test/unit/graph/solver-goal-required.test.ts`
- `packages/core/test/unit/graph/solver-goals.test.ts`
- `packages/core/test/unit/plugins/ik-goal-influence.test.ts`
- `packages/core/test/unit/plugins/ik-inspection.test.ts`
- `packages/core/test/unit/runtime/publisher-solver-members.test.ts`
- `packages/plugins/test/integration/ik-envelope.test.ts`
- `packages/plugins/test/integration/ik-guide-examples.test.ts`
- `packages/plugins/test/integration/ik-stability.test.ts`

**Commit.** `refactor(plugins): move 2d ik to explicit solver graph`

**Exit criteria and §14.5 2D proof.** Test separate rest/config records, explicit parent topology,
root, and at least two keyed goals. Changing rest changes solver output; no rest input comes from
FK. IK has no incoming cycle, publisher read, or hidden member list. Rows join by `memberId`;
changing binding labels does not change IDs. Existing constraints, influence, two-bone, FABRIK, and
fixtures pass the numeric tolerance below. The N=14 and N=200 call-count test passes. Rig migration
stays blocked until Slice 4's 3D proof also passes.

### Slice 4 — explicit 3D IK graph

**Goal and invariant.** Migrate `ik3d` to declared member, root, goal, pole/orientation, and joint
inputs. Preserve current math while publishing identity-bearing rows and opt-in inspection.

**Single owner.** `packages/plugins/src/ik3d.ts` owns the boundary;
`ik3d-result.ts` owns projection.
Existing 3D helpers retain their individual algorithms.

**Files.** Edit `ik3d.ts`, `ik3d-result.ts`, and only the helper adapter that directly owns a
changed input shape. Do not change solver math. Edit the 13 tests below and update
`test/pending.json`. Extend call-count test to both dimensions at N=14 and N=200.

**Types.** Declare `requires.members` map, `requires.root` single, `requires.goals` map, plus named
current pole/orientation/joint slots. Output `values` is a table with `id = memberId`, `rotation`,
`rotationX`, `rotationY`, and current optional leaf residual/bound fields. `inspect` is an optional
flat record gated by local static `inspect === true`. Preserve existing quality discriminants and
use exhaustive `unreachable()` switches.

**CORRECT**

```ts
return {
  values: members.map((member) => ({
    id: member.memberId,
    cells: project3d(member),
  })),
};
```

**WRONG**

```ts
return { rotations3d: Object.fromEntries(members.map((m) => [m.memberId, m])) };
```

**Non-goals.** No new 3D solver, rig output change, guessed orientation conversion, map-key
identity, hidden publisher read, or tolerance relaxation.

**Step 0 gate.** Before editing, run the per-slice gate protocol. After editing, run all 13 tests
below, the N=14/N=200 count test, and relevant commands. Do not start FK/rig until both solver
proofs pass.

**Grep checklist.** No private member read, old output alias, or grouped hook remains:

```sh
rg -n 'inputs\.members|publisher|rotations3d|compose:|stage:|keys:' \
  packages/plugins/src/ik3d.ts packages/plugins/src/ik3d-result.ts
```

**Pending entries.** Un-pend after passing:

- `packages/core/test/integration/ik3d-playground.test.ts`
- `packages/core/test/integration/ik3d-two-bone.test.ts`
- `packages/core/test/unit/graph/ik3d-goal-weights-load.test.ts`
- `packages/core/test/unit/graph/ik3d-joint-load.test.ts`
- `packages/core/test/unit/graph/ik3d-tree-load.test.ts`
- `packages/core/test/unit/graph/solved-pivot-offset.test.ts`
- `packages/core/test/unit/graph/solved-rotation-weight.test.ts`
- `packages/core/test/unit/plugins/ik3d-inspection.test.ts`
- `packages/core/test/unit/plugins/ik3d-pole.test.ts`
- `packages/plugins/test/integration/ik3d-guide-examples.test.ts`
- `packages/plugins/test/integration/ik3d-joint.test.ts`
- `packages/plugins/test/integration/ik3d-orient.test.ts`
- `packages/plugins/test/integration/ik3d-tree.test.ts`

**Commit.** `refactor(plugins): move 3d ik to explicit solver graph`

**Exit criteria and §14.5 3D proof.** Include rest/member, root, multiple keyed goals, pole/
orientation, and joint constraints. Assert pivot offsets, rotation weights/orientation, and rows by
ID. Rest remains an independent source. Fixtures pass the numeric tolerance below. N=14/N=200
counts pass with one solver evaluation per flush.

### Slice 5 — 2D FK output rows

**Goal and invariant.** FK selects exactly one solver row by `memberId` and emits one world-frame
row with that same ID. Missing row is a node error, never a first-row fallback.

**Single owner.** `packages/plugins/src/fk.ts`.

**Files.** Edit `fk.ts` and the listed test; reuse `frame.ts` unchanged unless the current flat
frame schema omits a scalar already produced by existing code. Update
`test/pending.json` after passing.

**Types.** Declare single slots for the member's rest record, parent frame, and solver table. Use a
local `MemberRowLookup` discriminated union, `found | missing`; duplicate IDs are rejected by
validation. Output `values` is a one-row table with `id = memberId` and flat 2D frame cells.

**CORRECT**

```ts
switch (lookup.kind) {
  case "found":
    return { values: [{ id: memberId, cells: toWorldFrame(lookup.row) }] };
  case "missing":
    throw new Error(`Solver row missing for ${lookup.memberId}`);
  default:
    return unreachable(lookup);
}
```

**WRONG**

```ts
const solved = Object.values(solver.values)[0];
return { values: [solved] };
```

**Non-goals.** FK is not an input to IK. Do not infer parent identity from binding label or array
order. Do not add a generic graph lookup service.

**Step 0 gate.** Rerun both solver proof gates and the per-slice gate protocol before editing.
After editing, run the listed test and relevant commands.

**Grep checklist.** No private reads or implicit first-row selection:

```sh
rg -n 'inputs\.members|publisher|Object\.values|compose:|stage:|keys:' \
  packages/plugins/src/fk.ts
```

**Pending entries.** Un-pend after passing:

- `packages/core/test/unit/runtime/declined-build-write-drop.test.ts`

**Commit.** `refactor(plugins): make fk consume identified solver rows`

**Exit criteria.** Present row joins by `memberId`, output contains exactly one same-ID row, and
the test passes for present and missing rows. Solver proof commits are ancestors.

### Slice 6 — 3D FK output rows

**Goal and invariant.** FK3D consumes explicit rest, parent-frame, and solver slots and emits one
3D world-frame row keyed by member ID.

**Single owner.** `packages/plugins/src/fk3d.ts`.

**Files.** Edit `fk3d.ts` and the listed test; reuse `frame3d.ts` unless its declared shape lacks an
existing output scalar. Update `test/pending.json` after the test passes.

**Types.** Same single-slot pattern as Slice 5, using current 3D frame fields. Output is a one-row
`values` table whose ID is `memberId`; preserve existing rest-weight semantics.

**CORRECT**

```ts
return {
  values: [
    {
      id: memberId,
      cells: { x, y, z, rotation, rotationX, rotationY },
    },
  ],
};
```

**WRONG**

```ts
return { values: { [trackId]: { x, y, z, rotationX, rotationY } } };
```

**Non-goals.** No orientation algorithm, ID conversion, record-keyed pose map, or IK3D math
changes.

**Step 0 gate.** Rerun both solver proofs and the per-slice gate protocol before editing. After
editing, run the one listed test and relevant commands.

**Grep checklist.** No private reads or old output maps:

```sh
rg -n 'inputs\.members|publisher|rotations3d|compose:|stage:|keys:' \
  packages/plugins/src/fk3d.ts
```

**Pending entries.** Un-pend after passing:

- `packages/core/test/unit/plugins/fk3d-rest-weight.test.ts`

**Commit.** `refactor(plugins): make fk3d consume identified solver rows`

**Exit criteria.** Rest weight, parent frame, and solver row produce the pre-migration frame within
tolerance. Output row ID is exact and the test passes.

### Slice 7 — rig pose and controls tables

**Goal and invariant.** Rig aggregates explicit bone-frame and control dependencies into named
`pose` and `controls` tables. Output IDs come from source rows, not map labels.

**Single owner.** `packages/plugins/src/rig.ts`.

**Files.** Edit `rig.ts` and the three rig tests below. Update `test/pending.json` after passing.
Do not edit catalog/loader.

**Types.** `requires.bones` and `requires.controls` are map slots. `outputs.pose` is a frame table
keyed by `memberId`; `outputs.controls` is a flat point table keyed by `controlId`. Rows use
`{ id, cells }`; values stay flat. Duplicate output IDs are rejected.

**CORRECT**

```ts
return {
  pose: boneRows.map((row) => ({ id: row.id, cells: row.cells })),
  controls: controlRows.map((row) => ({ id: row.id, cells: row.cells })),
};
```

**WRONG**

```ts
return { pose: Object.fromEntries(Object.entries(requires.bones)) };
```

**Non-goals.** No `Record<string, Frame>` output, nested dictionaries, map-label identity, per-bone
graph scans, or hidden input discovery.

**Step 0 gate.** Require both solver proofs and FK/FK3D gates to pass. Run per-slice gates before
editing. After editing, run all three tests below and relevant commands.

**Grep checklist.** Old grouped composer and record outputs are absent:

```sh
rg -n 'compose:|stage:|keys:|Object\.fromEntries|Record<string' \
  packages/plugins/src/rig.ts
```

**Pending entries.** Un-pend after passing:

- `apps/pose-gap-filler/test/rig.test.ts`
- `packages/core/test/integration/react-demo-rig.test.ts`
- `packages/plugins/test/rig.test.ts`

**Commit.** `refactor(plugins): publish rig pose and controls tables`

**Exit criteria.** Tests prove pose rows join by member ID, controls retain control IDs, duplicate
IDs refuse, and both outputs are named tables. No record map escapes the plugin.

### Slice 8 — keyed dependencies and classification

**Goal and invariant.** Migrate keyed dependency consumers to declared map slots and classifier to
one flat `values` record. Map keys remain binding labels. Verify the retargeting boundary before
claiming Phase 5 complete.

**Single owner.** `packages/plugins/src/pose-classify.ts` owns classifier behavior;
`packages/plugins/src/labels.ts` owns label reading.

**Files.** Edit those two modules and the eight tests below. Inspect but do not change the rig
contract. Update `test/pending.json` after passing. Do not add a retarget module without a verified
source consumer.

**Types.** Map dependencies declare `binding: "map"` and output schemas. Classifier declares a
single `requires.rig` slot reading the rig pose table. It returns
`{ values: { label, confidence } }` as a flat record. Label reader narrows
the declared output before reading `values.label`. Switch closed
outcomes exhaustively with `unreachable()`; do not cast.

**CORRECT**

```ts
const row = rows.find((candidate) => candidate.id === requestedMemberId);
return row === undefined
  ? { kind: "missing", memberId: requestedMemberId }
  : { kind: "found", row };
```

**WRONG**

```ts
const row = requires.bones[requestedMemberId];
return { values: { label, confidence }, id: requestedMemberId };
```

The wrong example treats a binding label as a row ID and adds an undeclared top-level field.

**Non-goals.** No generic retargeter, classifier math rewrite, new registry, dynamic dispatch, or
broad cache work. Retargeting remains `UNVERIFIED` as in D8.

**Step 0 gate.** Rerun solver, FK, and rig gates plus the per-slice gate protocol. Search source for
concrete retarget consumers using the grep below. If one exists, stop and report; do not guess.
After editing, run all eight tests below and relevant commands.

**Grep checklist.** Review map binding and identity uses. The expected retarget result is no
concrete plugin/caller; if found, stop:

```sh
rg -n 'requires\.|binding: "map"|Object\.keys|Object\.fromEntries|retarget' \
  packages/plugins/src/pose-classify.ts packages/plugins/src/labels.ts \
  packages/plugins/src/rig.ts packages/three/src/skeleton-capture.ts
```

`Object.keys` may remain for deterministic comparison, but never as the row-ID source.

**Pending entries.** Un-pend after passing:

- `packages/core/test/unit/domain/dict-valued-requirements.test.ts`
- `packages/core/test/unit/graph/arity-lift.test.ts`
- `packages/core/test/unit/graph/graph-dependants.test.ts`
- `packages/core/test/unit/graph/resolve-solvers.test.ts`
- `packages/core/test/unit/runtime/dependants-of-reverse-topology.test.ts`
- `packages/core/test/unit/runtime/removal-flush-seed.pending.test.ts`
- `packages/plugins/test/labels.test.ts`
- `packages/plugins/test/pose-classify.test.ts`

**Commit.** `refactor(plugins): migrate keyed consumers and classifier outputs`

**Exit criteria.** Eight tests pass. Bindings resolve independently of row IDs; classifier output
is one flat record; label reader follows the declared output. Retarget status is recorded as
verified absence or the slice stops on a source consumer.

### Slice 9 — pose-gap-filler writer and demo outputs

**Goal and invariant.** The app writer consumes table rows by `memberId` and writes one complete
value per target track. This is the only Phase 5 app writer change.

**Single owner.** `apps/pose-gap-filler/src/rig/writer.ts`.

**Files.** Edit that writer and the 14 app/demo tests below. Update `test/pending.json` after all
pass. Do not edit view/rendering modules or add a second writer.

**Types.** Narrow plugin results to the declared table/record type before reading. Match pose rows
by `memberId`. Assemble a complete v5 record or table per target track, then call
`track.input.values.set(value)` exactly once for that track in the batch.

**CORRECT**

```ts
const next = { x: frame.x, y: frame.y, z: frame.z };
handle.track(nodeId).input.values.set(next);
```

**WRONG**

```ts
handle.track(nodeId).input.values.setField("x", frame.x);
handle.track(nodeId).input.values.setField("y", frame.y);
```

**Non-goals.** No per-field writes, guessed row order, React/DOM logic in core, plugin math
changes, new renderer interface, or weakened persistence/replay assertions.

**Step 0 gate.** Rerun all prior slice gates and the per-slice gate protocol. After editing, run the
14 tests below and relevant commands. Stop if the app only works with a record-map shim.

**Grep checklist.** Final writer has one whole-value set per changed track per tick and no
`setField` calls:

```sh
rg -n 'setField|values\.set|memberId|Object\.values' \
  apps/pose-gap-filler/src/rig/writer.ts
```

**Pending entries.** Un-pend after passing:

- `apps/pose-gap-filler/test/avatar-viewport.test.ts`
- `apps/pose-gap-filler/test/avatar.test.ts`
- `apps/pose-gap-filler/test/bend-boundaries.test.ts`
- `apps/pose-gap-filler/test/bend-fallback.test.ts`
- `apps/pose-gap-filler/test/chain-replay.test.ts`
- `apps/pose-gap-filler/test/gltf-avatar-lifecycle.test.ts`
- `apps/pose-gap-filler/test/inferred-bends.test.ts`
- `apps/pose-gap-filler/test/persistent-avatar.test.ts`
- `apps/pose-gap-filler/test/phone-persistence.test.ts`
- `apps/pose-gap-filler/test/record.test.ts`
- `apps/pose-gap-filler/test/replay.test.ts`
- `apps/pose-gap-filler/test/stabilizer.test.ts`
- `apps/pose-gap-filler/test/world.test.ts`
- `packages/core/test/integration/demo-runtime-authoring.test.ts`

**Commit.** `refactor(pose-gap-filler): write identified rig values in one batch`

**Exit criteria.** Fourteen tests pass. Writer selects by row ID and performs at most one whole
value set per changed target track per tick. No `setField`, compatibility map, or test suppression.

## Numerical and performance gates

Compare pre-migration fixtures to their existing expected values; do not regenerate expectations
from the new implementation. Numeric `rotation`, `rotationX`, `rotationY`, coordinates, and
residuals must be within absolute `1e-6` in existing units. Row IDs, quality `kind`, iteration
count, `atBound`, and optional-field presence are exact. Never relax existing assertions.

Use committed `motion5-implementation-plans/ik-baseline-97a4593.json`. The planner did not run
`npm run bench:ik`. Same-code wall-clock samples supplied by the user were 62,117, 31,937, and
34,739 ns; wall clock is report-only.

The new call-count test runs at N=14 and N=200. After one warm-up flush, change one cached
root/goal while rest records stay unchanged. Assert exactly:

- solver compose calls: 1;
- FK compose calls: N;
- solver row lookups: N;
- rig aggregation calls: 1;
- rest-record recomputes: 0.

Record elapsed time for context only. Do not gate on it or substitute a 2-track fixture. Use
test-only counters around existing pure functions; do not add production counters.

## Phase exit gate mapped to guide §19

1. **Simple plugins first.** Slices 1 and 2 migrate transform and transform3d independently.
2. **Prove explicit 2D and 3D solver decomposition before rigs.** Slices 3 and 4 build real
   declared graphs. Both §14.5 proofs are hard gates; no FK/FK3D/rig migration starts before both
   pass.
3. **IK/IK3D values rows and inspect record.** Slices 3 and 4 return `values` tables keyed by
   `memberId`; flat `inspect` is emitted only on explicit opt-in.
4. **Rig pose and controls tables.** Slice 7 emits named tables from explicit map dependencies.
5. **Keyed dependencies, retargeting, classification.** Slice 8 proves binding labels are not row
   IDs and migrates the classifier. Retargeting stays `UNVERIFIED`; stop if source exposes a
   concrete consumer. Do not invent an algorithm.
6. **Remaining demo outputs.** Slice 9 updates one writer to consume tables and batches whole
   values, then un-pends app/demo tests.

## Phase exit gate mapped to guide §20 solver and rig matrix

- **Schema and values:** only v5; no legacy parser, alias, row-map output, or second engine.
  Inference/static behavior follows the guide.
- **Plugin contracts:** selected plugin is explicit; every output is declared and complete; no
  hidden merge, publisher read, host object, promise, or input mutation.
- **Dependency graph:** named single/map slots, required slots bound, sources resolve, cycles fail,
  slot output schemas are compatible, map labels do not become row IDs.
- **Publication and failure:** same-batch downstream reads are fresh; a failed transform owns no
  outputs; independent branches continue; optional absence differs from bound unavailable source;
  failed replacement build leaves the prior evaluator usable.
- **Solver:** rest, topology, root, goals, solver, and FK are explicit; animated rest changes are
  observed; multi-goal/member joins are identity-safe; numerical fixtures pass; inspect is opt-in.
- **Rig:** FK/world-frame rows use member IDs; rig exposes `pose` and `controls` tables; IDs are
  unique; no graph read is hidden in an adapter.
- **Classification and demos:** classifier returns a flat `values` record; labels read the declared
  output; writer uses whole-value writes and preserves replay, persistence, and lifecycle tests.
- **Cache boundary:** preserve existing cache behavior and incremental tests. No Phase 8 cache
  optimization or invalidation model is introduced.
- **Phase close:** after Slice 9, all 73 Phase 5 entries are absent from `test/pending.json`; the
  four Phase 6 and two Phase 7 entries are untouched. Full required commands pass and the PR body
  has each Slice 0 command and result.

## Pending audit

A plain Node audit grouped all 79 entries: 73 phase 5 paths are assigned once, with no duplicates
or extras; the four phase 6 and two phase 7 paths remain untouched. Slice counts are
2, 13, 2, 16, 13, 1, 1, 3, 8, and 14.

## Final decision summary

- Row identity: canonical unqualified `memberId`; controls use `controlId`.
- FK output: one-row `values` table. Rig outputs `pose` and `controls` tables.
- Inspect: static opt-in, absent unless explicitly requested.
- Migration: per-plugin slices; 2D/3D proof before FK/rig migration.
- Registry: preserve for remaining consumers; retire only in Phase 7 after zero-use proof.
- Classifier: one flat `values` record; unions only for closed outcomes.
- Retargeting: no invented feature without a verified consumer and fixture.
- Solver gate: `1e-6` numeric tolerance plus deterministic call counts at 14 and 200 tracks.

Least-sure decision: retargeting is not implemented absent source evidence. Verify it in Slice 8
Step 0; any concrete source consumer is a stop/report condition.

Every item marked `UNVERIFIED`:

- Whether the guide's Phase 5 retargeting target corresponds to a concrete implementation or
  consumer in this snapshot. Slice 8 Step 0 must search; if found, stop and report.
