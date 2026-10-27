# Phase 5 Plan — Addendum 1: Test Allocation by Plugin Dependency

Prepared 2026-10-25 for `refactor/v5-identified-tables`. Companion to
`motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan.md` (the "main plan").
Save as `motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan-addendum-1.md`.
Do not commit this addendum. The main plan's hash ledger is unchanged; do not edit the main plan.

## Precedence

This addendum overrides the main plan only for: (1) the "Pending entries" lists and exit criteria
of Slices 0-8, (2) the "Pending audit" counts, (3) the call-count test scope, and (4) the Slice 8
retarget grep. Everything else in the main plan, including D1-D10, slice order, standing rules,
and gates, stands. If this addendum and the main plan conflict on those four items, this one wins.
A2 (Step 0 gates) and A3 (legacy freeze, Slice 0b, D6 rewording, Slice 1-8 file and
registration rules) also override the main plan wherever they conflict with it.

## Finding

The main plan allocated pending tests to slices by count, not by what each test registers. The
catalog rejects the old `keys`/`stage`/`compose` shape, so any test that registers an unmigrated
built-in cannot pass. Most IK tests also register FK or rig, because IK output is only observable
through FK. A static import/reference scan (not a test run) shows that of the 46 tests assigned to
Slices 0-4, only `incremental-cache.test.ts` can pass in its assigned slice.

Examples: `recompile-predicate` registers transform, FK and rig; `ik-two-bone` registers transform,
FK and IK; `ik3d-tree` registers 3D transform, FK3D, IK3D and rig.

## Decision A1 — allocation rule — FINAL

Decision: a pending test is un-pended in slice `max(planned slice, dependency floor)`, where the
dependency floor is the slice that migrates the last built-in plugin the test registers.

Plugin floors: transform=1, transform3d=2, ik=3, ik3d=4, fk=5, fk3d=6, rig=7, classifier/labels=8.

Options considered:

- Reallocate by dependency (keep order): + honest exit criteria, keeps D4 (solver proofs before
  FK/rig); - big Slices 5 and 7, so early slices are gated by new tests instead of existing ones.
- Pull FK/rig forward: + existing tests gate IK slices; - breaks D4 and D5, so FK would be built
  against an unproven solver graph.
- Test-local stubs for unmigrated plugins: + early green tests; - second fixture path, and it
  proves the stub rather than the real graph.

Deciding criterion: the exit gate must test the real graph; D4 stays intact.

Wrong if: a test listed below passes earlier or fails later than its slice. Move it to the slice
where it truly passes. Never weaken, skip, or un-pend it early. Record the move in the PR body.

## Corrected allocation (supersedes main plan lists)

Total 73 Phase 5 entries, each exactly once. Phase 6 and Phase 7 entries stay untouched. Paths are
relative to the repo root; shortened prefixes are `core/test` = `packages/core/test`,
`plugins/test` = `packages/plugins/test`, `app/test` = `apps/pose-gap-filler/test`.

- Slices 0, 1, 2: none un-pended.
- Slice 3: 1 — `core/test/unit/graph/incremental-cache.test.ts`.
- Slice 4: 1 — `core/test/integration/ik-playground-motion-progress.test.ts`
  (provisional).
- Slice 5: 24 — list below.
- Slice 6: 3 — list below.
- Slice 7: 18 — list below.
- Slice 8: 12 — list below.
- Slice 9: 14 — unchanged from main plan Slice 9.

`ik-playground-motion-progress` showed only `ik3d` in the scan and probably needs more. If it
registers anything beyond IK3D, move it to the later slice it needs.

### Slice 5 (24)

- `core/test/contract/v5-validator.test.ts`
- `core/test/integration/bare-authored-leaf.test.ts`
- `core/test/integration/ik-multi-goal.test.ts`
- `core/test/integration/ik-two-bone.test.ts`
- `core/test/integration/internal-key-strip.test.ts`
- `core/test/integration/keyframe-groups.test.ts`
- `core/test/integration/plugin-group-values-section.test.ts`
- `core/test/integration/solver-member-cache.test.ts`
- `core/test/unit/graph/solved-pivot-offset.test.ts`
- `core/test/unit/graph/solved-rotation-weight.test.ts`
- `core/test/unit/graph/solver-goal-required.test.ts`
- `core/test/unit/plugins/ik-inspection.test.ts`
- `core/test/unit/runtime/commit-write-cost.test.ts`
- `core/test/unit/runtime/declined-build-write-drop.test.ts`
- `core/test/unit/runtime/publisher-solver-members.test.ts`
- `plugins/test/integration/ik-envelope.test.ts`
- `plugins/test/integration/ik-guide-examples.test.ts`
- `plugins/test/integration/live-edit-ensure.test.ts`
- `plugins/test/integration/live-value-composition.test.ts`
- `plugins/test/integration/mutation-transactionality.test.ts`
- `plugins/test/integration/per-plugin-key-ownership.test.ts`
- `plugins/test/integration/plugin-owned-requirements.test.ts`
- `plugins/test/integration/single-input-channel.test.ts`
- `plugins/test/unit/loader.test.ts`

### Slice 6 (3)

- `core/test/integration/ik3d-playground.test.ts`
- `core/test/unit/domain/plugin-capabilities.test.ts`
- `plugins/test/integration/ik3d-guide-examples.test.ts`

### Slice 7 (18)

- `app/test/rig.test.ts`
- `core/test/integration/contract-baseline.pending.test.ts`
- `core/test/integration/ik-fabrik-chain.test.ts`
- `core/test/integration/ik-playground-scroll-rest.test.ts`
- `core/test/integration/ik3d-two-bone.test.ts`
- `core/test/integration/react-demo-rig.test.ts`
- `core/test/unit/domain/plugin-3d-ownership.test.ts`
- `core/test/unit/graph/ik3d-goal-weights-load.test.ts`
- `core/test/unit/graph/ik3d-tree-load.test.ts`
- `core/test/unit/plugins/fk3d-rest-weight.test.ts`
- `core/test/unit/plugins/ik-goal-influence.test.ts`
- `core/test/unit/plugins/ik3d-inspection.test.ts`
- `core/test/unit/plugins/ik3d-pole.test.ts`
- `core/test/unit/runtime/recompile-predicate.test.ts`
- `plugins/test/integration/ik3d-joint.test.ts`
- `plugins/test/integration/ik3d-orient.test.ts`
- `plugins/test/integration/ik3d-tree.test.ts`
- `plugins/test/rig.test.ts`

### Slice 8 (12)

- `core/test/unit/domain/dict-valued-requirements.test.ts`
- `core/test/unit/graph/arity-lift.test.ts`
- `core/test/unit/graph/graph-dependants.test.ts`
- `core/test/unit/graph/ik3d-joint-load.test.ts`
- `core/test/unit/graph/resolve-solvers.test.ts`
- `core/test/unit/graph/solver-constraints.test.ts`
- `core/test/unit/graph/solver-goals.test.ts`
- `core/test/unit/runtime/dependants-of-reverse-topology.test.ts`
- `core/test/unit/runtime/removal-flush-seed.pending.test.ts`
- `plugins/test/integration/ik-stability.test.ts`
- `plugins/test/labels.test.ts`
- `plugins/test/pose-classify.test.ts`

Moves relative to the main plan, for audit: `v5-validator`, `bare-authored-leaf`,
`internal-key-strip`, `keyframe-groups`, `plugin-group-values-section`, `loader` and six
`plugins/test/integration` tests moved from Slice 1 to 5 (`contract-baseline` to 7);
`commit-write-cost` moved from Slice 0 to 5 and `recompile-predicate` from 0 to 7; the two Slice 2
tests moved to 6 and 7; Slice 3 and 4 tests moved to 5, 6, 7 or 8 per the lists above;
`ik-stability`, `solver-constraints`, `solver-goals` and `ik3d-joint-load` moved to 8 because they
register the classifier/labels. The Slice 5 `declined-build-write-drop` is unchanged.

## Replacement exit criteria for Slices 0-4

Existing tests cannot gate these slices, so each gate is a new test using only the plugin under
migration plus plain records. No new test may register an unmigrated built-in.

- **Slice 0.** Un-pends nothing. Exit: `replace-values-build-transactionality.test.ts` passes for
  both track classes; no existing test regresses. Remove both `commit-write-cost` and
  `recompile-predicate` from Slice 0's "Pending entries" and commit message scope.
- **Slice 1.** Un-pends nothing. Add
  `[NEW] packages/plugins/test/unit/transform-v5.test.ts`: registers only `transform`; asserts
  declared slots, row IDs preserved, no undeclared output keys. Exit: this test passes and the
  grep checklist is clean.
- **Slice 2.** Un-pends nothing. Add `[NEW] packages/plugins/test/unit/transform3d-v5.test.ts`
  with the same assertions for 3D. Exit: passes; grep checklist clean.
- **Slice 3.** Un-pends `incremental-cache` only. Add
  `[NEW] packages/plugins/test/integration/ik-explicit-graph.test.ts`: plain rest/config records,
  explicit `parentId`, one root, at least two keyed goals, no FK. Assert rows by `memberId`, rest
  change changes output, binding-label change does not change IDs, `inspect` absent unless
  `inspect === true`. Exit: this test, `incremental-cache`, and the Slice 3 call-count test pass.
- **Slice 4.** Same pattern:
  `[NEW] packages/plugins/test/integration/ik3d-explicit-graph.test.ts` (pole/orientation, joint
  constraints, pivot offsets, rotation weights, no FK3D). Exit: it, the provisional un-pend, and
  the Slice 4 call-count test pass. Both solver proofs still block Slice 5 (D4 unchanged).

### Golden values for the Slice 3/4 proof tests

Numeric gates cannot use existing fixtures before Slice 5. Therefore, in Step 0 of Slices 3 and 4,
before any edit, run the existing pre-migration solver on the proof-test inputs and record
rotation, residual, `atBound`, quality `kind` and iteration count as literal constants in the new
test. Never regenerate them from migrated code. Tolerance stays absolute `1e-6`; IDs, `kind`,
iteration count and booleans stay exact. The full existing-fixture 1e-6 gate now first runs in
Slice 5 (2D) and Slices 6-7 (3D). State this in each PR body.

## Call-count test scope (amends "Numerical and performance gates")

`solver-call-counts.test.ts` cannot assert FK or rig counts before those plugins migrate. Split:

- Slice 3 (2D) and Slice 4 (3D), N=14 and N=200, after one warm-up flush, change one root/goal:
  solver compose calls == 1; solver row lookups == N; rest-record recomputes == 0.
- Slice 5 adds: FK compose calls == N (2D). Slice 6 adds the same for 3D.
- Slice 7 adds: rig aggregation calls == 1.

Use test-only counters around existing pure functions. No production counters. Wall-clock stays
report-only.

## Slice 5 risk note

Slice 5 is the first point where existing 2D IK fixtures run end-to-end, so it is the first real
2D IK regression gate. Before editing, confirm Slice 3 and 4 proofs pass. If more than a few of
the 24 tests fail, fix the cause (usually FK row selection or a missed IK output field). Do not
change a solver tolerance or assertion, and do not split the commit; one commit per slice stands.

## Slice 8 retarget scope (amends D8 grep)

The repo-wide search found no domain retarget plugin or consumer, so D8's `UNVERIFIED` item
resolves as verified absence, to be re-confirmed in Slice 8 Step 0. These hits are expected and
are NOT a stop condition:

- the unrelated `retarget-motion-track` effect in `packages/core/src/runtime/commit-plan.ts`
  (a runtime motion-track effect, not a domain plugin);
- a comment mentioning retargeting in `packages/three/src/skeleton-capture.ts`.

A stop is only a registered domain plugin, or a caller outside those two sites, that computes
retargeted poses. Restrict the Slice 8 grep to `packages/plugins/src` and
`apps/pose-gap-filler/src` for that decision.

## Pending audit (replaces main plan's counts)

Slice counts: 0, 0, 0, 1, 1, 24, 3, 18, 12, 14 (sum 73). At each slice, after un-pending, run the
plain Node audit: every Phase 5 path appears in `test/pending.json` exactly until its slice, then
never again; Phase 6 (4) and Phase 7 (2) remain. At phase close, 73 removed, 6 remain.

## Static-scan caveat

The allocation comes from reading imports and references; no test was run, on Node 22 not 24.
Indirect dependencies could only raise a floor, never lower it. Step 0 of each slice should run its
listed tests first; a test already failing for an unrelated reason is a stop/report condition,
not an allocation change.

## Addendum A2 — Step 0 gate corrections from the first implementer run — FINAL

The first Slice 0 Step 0 run passed Node 24, tip `8a475ce`, 127/127 hashes, 79/73/4/2 pending
counts, `typecheck`, `test:boundaries`, `test:read-budget`, and `npm test` (276 files, 1779
tests). It stopped on three items. Corrections:

1. **Plan-document formatting.** `prettier --check` and `format:check` flagged the plan and this
   addendum (untracked docs). Before Slice 0, the human runs `npx prettier --write` on the plan,
   this addendum, and the summary, then reruns the hash verifier (must still print 127). The
   implementer never edits these docs. If the only gate failures are prettier warnings on them,
   it stops and asks the human.
2. **`npm run bench:ik` is removed from every required-command list** (Step 0 and the per-slice
   protocol; "six commands" becomes five). At tip `8a475ce` it throws `track-legacy-field`
   because `scripts/bench-ik.mjs` still feeds v4 grouped-keyframe fixtures to `Engine.load`. This
   predates Phase 5. Paste the failure into the Slice 0 PR body as a known baseline issue. The
   performance gate is deterministic call counts only; the committed `ik-baseline-97a4593.json`
   stays a static reference. Do not edit the bench script in Phase 5; porting it to v5 fixtures
   is a separate chore.
3. **Windows shell.** Extract the hash-verifier code block from the plan with Node (not
   PowerShell here-strings) into a temp file outside the repo, and run it from the repo root.

## Addendum A3 — Legacy freeze and Slice 0b — FINAL

Source of truth: the first Slice 1 attempt (stopped correctly) and a read-only code survey.

### Finding

`EngineOptions.plugins` is an exclusive union: `PluginRegistry` (legacy grouped mode) or
`PluginCatalog` (v5 mode). Legacy mode throws `plugin-unknown` on v5 tracks; v5 mode throws
`track-legacy-field` on grouped keyframes. No code or test hosts both. The passing suite and the
apps run in legacy mode with the grouped plugins. Editing a plugin in place therefore removes it
from legacy mode and breaks `rig.ts` (pose-gap-filler), `App.tsx` (react-demo),
`test/support/builtin-registry.ts`, `fk-pivot-offset.test.ts` and `public-subpaths.test.ts`.
That is D4's "atomic cross-plugin migration" condition. D6 as first written cannot hold.

### Decision A3 — freeze legacy copies, build v5 plugins beside them — FINAL

Decision: before any plugin is migrated, move every grouped plugin unchanged to
`packages/plugins/src/legacy/`. Each migrated v5 plugin is a new file at the original path. The
two contracts never share a file, a registry, or an engine. Phase 7 deletes `legacy/` whole.

Options considered:

- Freeze legacy copies (chosen): + every existing test stays green; no engine change; each slice
  stays reviewable; legacy copies become the numerical oracle; - temporary duplicate plugin
  wrappers (pure helpers stay shared, not copied).
- Make `Engine` host both modes: + no duplicates; - reopens Phase 4 decisions marked "do not
  reopen"; large, untested core change.
- Atomic cutover of all plugins: + no duplicates; - breaks D4; one huge diff; solver graph
  unproven before FK and rig move.
- Delete or rewrite legacy tests as plugins migrate: - violates "never delete tests"; loses the
  regression net mid-migration.

Deciding criterion: no passing test is removed or weakened at any commit, and no engine redesign.

Wrong if: a legacy-mode consumer must run a v5 plugin in the same `Engine.load`. That is the real
mixed-mode need; stop and report it. Do not add a bridge.

### D6 reworded (replaces the main plan's D6 text)

Legacy grouped plugins are frozen copies under `packages/plugins/src/legacy/`. The existing
catalog, loader and `PluginRegistry` keep serving only those copies. Migrated plugins live at the
original paths with the v5 contract and register only in a separate identified catalog. No bridge,
fallback, alias, or dual output. Phase 7 deletes `legacy/`, the legacy catalog entries, and legacy
mode after a repository-wide zero-consumer proof.

### Slice 0b — freeze legacy plugins (mechanical; runs after Slice 0, before Slice 1)

**Goal and invariant.** Pure relocation. Behavior, output, and the test count (1779 passing) stay
identical. Un-pends nothing.

**Single owner.** `packages/plugins/src/legacy/`.

**Step 0 gate.** Slice 0 is committed. Run `npm run format:check`, `npm run typecheck`,
`npm run test:boundaries`, `npm test`; record the passing test count. Then inventory, read-only,
and paste results into the PR body:

```sh
git grep -n -E "from ['\"].*/(transform|transform3d|fk|fk3d|ik|ik3d|rig)['\"]" -- packages apps
git grep -n "builtinCatalog" -- packages apps
```

Also read `packages/plugins/package.json` `exports` and `packages/plugins/src/index.ts` and list
every public specifier that exposes a grouped plugin. STOP and report if a published subpath
exposes a plugin file directly, or if the catalog registers a grouped plugin outside the seven
(the classifier or labels, for example). Do not guess a public-API policy.

**Files.**

- `git mv` each of `transform.ts`, `transform3d.ts`, `fk.ts`, `fk3d.ts`, `ik.ts`, `ik3d.ts`,
  `rig.ts` from `packages/plugins/src/` to `packages/plugins/src/legacy/` (same filename).
- In each moved file, change only relative import paths (`./frame` becomes `../frame`) and rename
  the single exported plugin const to `legacy<Name>Plugin` (`legacyTransformPlugin`,
  `legacyTransform3dPlugin`, `legacyFkPlugin`, `legacyFk3dPlugin`, `legacyIkPlugin`,
  `legacyIk3dPlugin`, `legacyRigPlugin`). No logic edits.
- Update every importer the inventory lists (`catalog.ts`, `rig.ts`, `App.tsx`,
  `builtin-registry.ts`, `fk-pivot-offset.test.ts`, `public-subpaths.test.ts`, and any other hit)
  to the new path and name. The compiler is the completeness check.
- Do not create any v5 file in this slice. Pure helpers (`frame.ts`, `ik-*.ts`) do not move.

**Non-goals.** No new plugin, no catalog/loader logic change, no test edits beyond import path and
name, no behavior change, no engine change.

**CORRECT**

```ts
// legacy/transform.ts
export const legacyTransformPlugin: PluginDefinition = {
  name: "transform",
  keys: [
    /* unchanged */
  ],
  compose,
};
```

**WRONG**

```ts
// re-exporting under the old name, or an alias, so old imports keep compiling
export { legacyTransformPlugin as transformPlugin } from "./legacy/transform";
```

**Grep checklist.**

```sh
rg -n "from ['\"]\.\./?(transform|fk|ik|rig)['\"]" packages/plugins/src --glob '!legacy/**'
rg -n "transformPlugin|fkPlugin|ikPlugin|rigPlugin|transform3dPlugin|fk3dPlugin|ik3dPlugin" packages apps --glob '!legacy/**'
```

The second grep must show no reference to a bare old name outside `legacy/` (v5 names do not
exist yet). `git diff --cached -M --summary` must show the seven files as renames, and
`git diff --cached -M` for each must contain only import-path and export-name lines.

**Exit criteria.** Seven renames; no logic diff; all gates and `npm test` pass with the same test
count as Step 0; `test/pending.json` untouched.

**Commit.** `refactor(plugins): freeze grouped plugins under legacy`

### Rules for Slices 1-8 after A3 (override the main plan's per-slice file and grep text)

1. **File ownership.** The new v5 plugin is created at the original path
   (`packages/plugins/src/<name>.ts`), exporting the real name (`transformPlugin`, …). It declares
   only the v5 contract (`id`, `inputs`, `outputs`, `validate`, `transform`). Never edit
   `legacy/**` after Slice 0b, except to delete in Phase 7.
2. **Registration.** Slice 1 creates `packages/plugins/src/identified-catalog.ts`, a map from
   plugin name to `{ load }` typed against core's v5 plugin definition. Each later slice adds
   exactly its own plugin. The main plan's "verify registration in catalog.ts; do not edit
   catalog/loader" becomes: do not edit `catalog.ts`, `loader.ts` or `legacy/**`; register only in
   `identified-catalog.ts`. If the loader cannot consume that map, STOP and report; the allowed
   fix is a minimal v5 loader function, decided by the designer, not improvised.
3. **Legacy consumers untouched.** `rig.ts`, `App.tsx`, `builtin-registry.ts` and every legacy-mode
   test keep running on `legacy*Plugin` through Phase 5. No consumer is moved to v5 before the
   slice the plan assigns.
4. **Tests.** New v5 tests build a `PluginCatalog` and register only v5 plugins. They never mix
   with a `PluginRegistry`. Pending tests un-pend by Addendum A1 as before.
5. **Gate.** Every slice's post-edit gates now also require: no existing test deleted, skipped or
   edited except a pending entry removal, and the total passing count never drops.
6. **Grep checklists.** The checks that say "old grouped fields must be absent" apply to the new
   file only (`rg -n 'keys:|stage:|compose:|claimsKey|positions:' packages/plugins/src/<name>.ts`).
   The `rg 'name' catalog.ts` registration check becomes the same check on `identified-catalog.ts`.
7. **Oracle.** Slices 3 and 4 record golden values by running `legacyIkPlugin` / `legacyIk3dPlugin`
   (which stay untouched) on the proof inputs, before any edit. Slices 5-7 may add a differential
   assertion against the matching legacy plugin on existing fixtures, using the same 1e-6
   tolerance.
8. **Slice 8.** Step 0 lists every grouped plugin still registered after Slice 7. The labels or
   classifier migrate in Slice 8 under the same freeze rule: move to `legacy/` first as a
   mechanical commit step only if the Step 0 inventory shows legacy-mode consumers; otherwise
   STOP and report.

### Open risk for Slice 9

The apps (`pose-gap-filler`, `react-demo`) run in legacy mode today. The 14 Slice 9 tests need v5
mode. Slice 9 Step 0 must establish whether switching the app writer to v5 mode is in scope. If it
requires an app-wide engine switch beyond the writer, STOP and report; that is a new designer
decision, not a Slice 9 improvisation.

### Phase 7 additions

Delete `packages/plugins/src/legacy/`, the legacy `catalog.ts`/`loader.ts` entries, the
`PluginRegistry` path in `Engine`, and the legacy consumers, only after a repository-wide
zero-consumer proof (`rg "legacy[A-Z0-9][A-Za-z0-9]*Plugin"` returns nothing).
