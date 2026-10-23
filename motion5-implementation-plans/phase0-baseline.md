# Phase 0: inventory and baseline

Captured 2026-10-23, Asia/Jakarta. This is a handover record for the v5 refactor, not a status claim.

## Environment and policy

- Repository: `C:\Data\dev\motion5\motion5`.
- Branch: `refactor/v5-identified-tables`.
- Baseline commit: `8f2d2d0d90562dcac18400af42b6b92405f6bcc4` ("test: increase Vitest testTimeout to 30000ms for CPU-heavy tests on Windows").
- Node `v24.21.0`, npm `11.6.2`. Workspace engine field requires Node `>=24`.
- Working tree before this record: no tracked changes; only untracked `motion5-implementation-plans/`.
- `npm ci` was not run. Existing `node_modules` was used and `package-lock.json` was not modified.
- Version policy: keep `motion5`, `@motion5/*`, `schemaVersion: 5`, `AUTHORED_SCHEMA_VERSION = 5`, private `0.0.0`.
- There are no external consumers. Breaking changes are acceptable; demos and first-party integrations are updated directly.
- No v6 naming, no dual v5 layouts, no legacy parser, converter, compatibility wrapper, or parallel engine.

## Baseline commands and results

Run against the baseline commit unless noted. Commands are listed with their decisive output.

- `npm run scan:raw-templates` - exit 0. `raw-template-scan: 0 files clean`.
- `npm run format:check` - exit 1. The only warning is the untracked guide
  `motion5-implementation-plans/motion5-v5-refactor-guide-onefile.md`. Re-run with an ignore path that
  excludes the plans folder: exit 0, "All matched files use Prettier code style". The tracked tree is
  clean; the failure is an untracked planning artifact, not a repository regression.
- `npm run typecheck` - exit 0, no output.
- `npm test` - exit 0. 341 test files passed, 2133 tests passed. Vitest duration 39.95s; tests 238.53s
  across workers.
- `npm run test:boundaries` - exit 0. Boundary scan passed; 39 tests passed.
- `npm run test:read-budget` - exit 0. Read budget scan passed; 22 tests passed.
- `npm run benchmark` - exit 0. 1000 nodes, 100 flushes, 100000 traversed nodes, 100000 published
  patches, 1000 retained nodes, dirty seed 500, dirty closure 500, dirty ratio 0.5,
  complexity `linear-dirty-closure`, `passed: true`. Budget version 2, status advisory.
- `npm run bench:ik` - exit 1, pre-existing tooling failure. Node 24.21 rejects a TypeScript parameter
  property in strip-only mode:
  `SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]: TypeScript parameter property is not supported in strip-only mode`
  at `packages/core/src/graph/builders/incremental.ts:23`. This failed before any refactor change and
  is not a Phase 0 regression. Treat as an environment/tooling blocker for the IK timing script only;
  the IK behaviour suites pass inside `npm test`.
- Demo builds: `@motion5/react-demo`, `@motion5/ik-playground`, `@motion5/pose-gap-filler` - all exit 0.
  The two larger apps emit only the existing Vite chunk-size warning (over 500 kB).

Notes:

- `performance/budgets.json` declares `expiresOn: 2026-08-17`, which is before the capture date. The
  benchmark reports `status: advisory` and still passes. Use the numbers as a baseline, not as a
  current gate.
- The benchmark run regenerated `performance/benchmark-report.json` as an untracked file; it was
  removed after capture. The same numbers are recorded above.
- No pre-existing behavioural test failures were found. The only red baseline is `bench:ik` and the
  untracked-guide formatting warning.

## Workspace inventory

- `packages/core` - engine, contract, graph, runtime, adapters, public entries.
- `packages/plugins` - built-in transforms, FK, IK, rig, classification, loader, runner.
- `packages/react` - `usePatch`, DOM patch bindings, derived DOM patches.
- `packages/three` - skeleton capture/driver, generated skeleton tracks, frame helpers.
- `apps/react-demo` - scroll-driven full-body rig.
- `apps/ik-playground` - 2D and 3D solver playground plus `SolverPanel`.
- `apps/pose-gap-filler` - live/synthetic pose pipeline, rig writer, avatar views.
- `performance/` - graph benchmark, budgets, mutation baseline.
- `scripts/` - boundary, read-budget, raw-template, acceptance, migration, benchmark scripts.

## Authored contract as it exists

`packages/core/src/contract/v5.ts`:

- `TrackDefinition` has `id`, optional `duration`, optional grouped `keyframes`, optional `observes`.
- `keyframes` is `Record<string, AuthoredPluginGroup>`.
- `AuthoredPluginGroup` has `values` (properties) and optional `requires` (source bindings), including
  dict-valued slots.
- `AuthoredProperty` is a stop array or a static number/string/boolean.
- `ObservationDefinition` is an output-only edge with `source`; `target`, `role` and `projection` are
  removed and refused.
- `ReadyPatch.values` is a flat record. `BlockedPatch`, `ErrorPatch` and `DestroyedPatch` carry no
  pose (ADR-098). The registry retains a last-ready patch and batches node publications.

`packages/core/src/contract/validate-v5.ts` validates the grouped authoring shape, row-less values,
plugin groups, observes and solver-specific constraints. It is 26.2 kB and has a sibling `.md`.

`packages/core/src/contract/keyframe-shape.ts` owns group detection and binding reading. It flattens
groups into unprefixed leaves before compilation and derives one edge per binding, including one per
dict key.

`packages/core/src/contract/keyframe-compiler.ts` compiles flat properties into a percent-key map,
initial values and compiled properties. Its leaf logic is reusable; its grouped input and flat output
identity are not the new contract.

## Ownership map for the refactor

Core contract and validation:

- `contract/v5.ts` (20.3 kB) - authored types and patch types. New authored/evaluated/published types
  land here or in a value-spec module; watch the 30 kB sibling-doc threshold.
- `contract/validate-v5.ts` (26.2 kB, has `.md`) - shape validation, refusals.
- `contract/authored-leaf.ts` (8.5 kB) - leaf partition, stop eligibility, live-write channel.
- `contract/keyframe-shape.ts` (12.2 kB) - group and binding reading; replace with track input reading.
- `contract/keyframe-compiler.ts` (3.8 kB) - leaf compilation; reuse leaf logic, change envelope.
- `contract/track-handle.ts` (16.9 kB), `contract/value-transaction.ts`, `contract/schema-transaction.ts`
  - authoring and live-write verbs; replace group/property verbs with row, cell, field and input verbs.
- `contract/rule-id.ts` (13.4 kB), `contract/rule.ts` (13.1 kB) - closed rule union and ownership;
  add new rule ids and remove old machinery ids as the old paths go.
- `contract/solver-shape.ts`, `contract/solver-slots.ts`, `contract/solver-constraints.ts`,
  `graph/solver-constraints.ts` - solver-specific declarations; redesign explicitly, keep numerical
  algorithms.

Domain:

- `domain/keyframe-groups.ts` (4.2 kB) - flattens groups; remove the flattening.
- `domain/authoring/keyframes.ts` (18.5 kB), `domain/authoring/recompile.ts` (4.8 kB) - grouped and
  property edits; replace with table/record input edits.
- `domain/plugins.ts` (28.9 kB, has `.md`) - multi-plugin registry, claims, keys, staged contributions,
  output names. Replace with explicit single plugin selection, input specs and `ValueSpec` outputs.
  Already close to the 30 kB sibling-doc threshold.
- `domain/plugin-admission.ts` (7.5 kB) - admission, stage/priority, claims, capabilities. Mostly old
  machinery; retain atomic registration and untrusted-input checks where they still apply.
- `domain/track.ts` (21.9 kB) - interpolates a flat record, runs a plugin chain, applies live masks.
  Replace with table-or-record evaluation and at most one transform.
- `domain/values.ts` (3.7 kB) - renderer-neutral immutable values, finiteness and freezing. Reuse;
  narrow the authored cell boundary to scalars.
- `domain/motion.ts` (17.0 kB) - scheduling, trigger and track lifecycle. Reuse after checking
  assumptions.

Graph:

- `graph/ir.ts` (48.9 kB, has `.md`) - nodes, input/output edges, solver member derivation, topological
  order, dependants. Largest core source; port ordinary edges first, redesign solver wiring. Any new
  logic here must not push it past 60 kB.
- `graph/binding.ts`, `graph/references.ts`, `graph/order.ts`, `graph/ids.ts`, `graph/builders/*` -
  named-slot edges and slot compatibility replace requirement edges; reuse ordering and ids.

Runtime and publication:

- `runtime/graph-runtime.ts` (18.7 kB, has `.md`), `runtime/graph-runtime-state.ts` (25.4 kB),
  `runtime/graph-publisher.ts` (22.1 kB) - composition, candidate results, readiness, same-batch reads,
  publication. Change ready payload from `values` to `outputs`.
- `runtime/patch-registry.ts` (22.3 kB) - ready/blocked/error/destroyed patches, batching, retention.
  Keep status separation and batching; change the ready payload.
- `runtime/project-runtime.ts` (46.8 kB, has `.md`), `project-phase.ts` (27.8 kB), `commit-plan.ts`,
  `run-plan.ts` - transactional replacement, rollback, lifecycle. Reuse with input-shape changes.
- `runtime/authored-values.ts` (11.7 kB), `value-state.ts`, `authoring-edit.ts` - authored versus live
  distinction, group/property edits, flat live writes. Replace with shape-matched whole-value writes.
- `runtime/results.ts`, `report.ts`, `refusal.ts`, `publisher-outcome.ts`, `project-handles.ts`,
  `project-ports.ts` - outcome plumbing. Reuse where the payload shape permits.

Public surface:

- `engine.ts` (33.7 kB, has `.md`), `index.ts`, `plugin-api.ts`, `internal.ts`, `testing/fakes.ts` -
  coherent exports; remove grouped, composer, stage and contribution types.

Plugins (`packages/plugins/src`):

- `loader.ts` - demand is discovered from grouped keyframe names today; discover it from `track.plugin`.
- `catalog.ts` - seven built-ins: `transform`, `fk`, `ik`, `transform3d`, `fk3d`, `ik3d`, `rig`.
- `transform.ts`, `transform3d.ts` - identity transforms; no declared outputs today.
- `fk.ts`, `fk3d.ts` - compose records, read `rotations`/`rotations3d` by node id, publish flat keys.
- `ik.ts`, `ik3d.ts`, `ik-result.ts`, `ik-*`, `ik3d-*`, `fabrik*.ts` - solvers publish `rotations` or
  `rotations3d` records keyed by node id, plus opt-in `inspection`. Keep the algorithms; change the
  transport to member rows and an `inspect` record.
- `rig.ts` - publishes `pose` and `controls` dictionaries keyed by member. Becomes tables with one row
  per member.
- `pose-classify.ts` - factory plugin, publishes `label` and `confidence`; absent from the built-in
  catalog by design.
- `runner.ts` - stateful work outside the graph; writes flat `LiveValues` overlays through
  `overrideValues`. Make writes shape-aware.

Integrations:

- `packages/core/src/adapters/dom.ts` - writes `ready.values` as a flat record, with dirty diffing and
  omitted-key removal.
- `packages/react/src/*` - `usePatch` returns a live patch; `useDomPatch` and `useDerivedDomPatch`
  read `ready.values`; no row or named-output selection exists.
- `packages/three/src/*` - reads rig `pose`/`controls` dictionaries and `ready.values`; generated
  skeleton tracks author grouped `keyframes` in `skeleton-tracks.ts`.

Demos, tests, performance:

- `apps/react-demo/src/full-body-project.ts` authors the full-body rig, 13 grouped blocks.
- `apps/ik-playground/src/ik-playground-project.ts` and `ik3d-playground-project.ts` author 2D and 3D
  solver graphs; `SolverPanel` reads record-shaped solver output.
- `apps/pose-gap-filler/src/rig/rig.ts` authors 2D and 3D rigs; `rig/writer.ts` performs live writes
  through `ValueTransaction`.
- `packages/three/src/skeleton-tracks.ts` generates tracks for captured skeletons.
- Tests, benchmark scripts and fixtures are covered below.

## Old-model coupling measured

- 31 source files under `packages/*/src` or `apps/*/src` contain `keyframes` (24 core, 1 plugins,
  1 three, 5 app). 20 of them author the literal `keyframes:` field.
- 124 test files author literal `keyframes:`. The repository has 341 test files.
- 176 test files reference `compose`, `PluginDefinition` or `requires`.
- 29 test files exercise live writes (`overrideValues`, `setValues`, `writeValues` or
  `ValueTransaction`).
- 25 source files and 45 test files reference `rotations`; 12 source files and 17 test files reference
  `inspection`.
- Production plugin hooks: zero plugins use `contribute` (7 test files do), zero use `claimsKey`, zero
  declare `stage: "prepare"`, and no plugin declares `priority`. `stage: "compose"` appears on six
  plugins, which is the default. The stage, priority, claim and contribution machinery is effectively
  test-only.
- No demo authors `observes`. The only authored `observes` fixtures left are in
  `packages/core/test/fixtures/v5-contract.ts`; runtime support lives in `graph/ir.ts`,
  `validate-v5.ts` and `runtime/authoring-edit.ts`.
- `input.schema`, `ValueSpec`, named outputs, `track.plugin`, `inspect` and table rows do not exist in
  the snapshot.

## Test classification

First-pass heuristic, counted over 341 test files. Precedence: numerical/solver, then curated
old-machinery filenames, then literal `keyframes:`, then remainder. The full path list is in
`phase0-test-classification.txt`.

- Group 1, shape-independent behaviour: 140 files. Scheduler, triggers, publication ordering, blocked
  and error propagation, freezing, cycles, DOM adapter and patch mechanics, handles.
- Group 2, old shape carrying a rule still needed: 82 files. These author `keyframes:` but test rules
  the new contract keeps, so they are rewritten through the new builders rather than deleted.
- Group 3, old-machinery-primary: 19 files. Contribution, registration, plugin capabilities and
  requirements, group flattening, observes merging, staging, v4 migration, old group/property edits.
  Delete only together with the machinery, after any surviving rule is re-expressed.
- Group 4, numerical and solver fixtures: 100 files. `packages/plugins` solver suites, pose-gap-filler
  pipeline/numerical suites, skeleton and rig fixtures. Keep fixtures and assertions; change transport.

Counts by package: core 238, plugins 45, react 8, three 6, pose-gap-filler 44.

The classification is a starting inventory, not a final judgement. Group 3 in particular contains
files that also assert rules worth keeping; Phase 1 must confirm each deletion against the new
acceptance matrix.

## Fixtures and evidence material

- `packages/core/test/fixtures/v5-contract.ts` - golden v5 project fixtures, including grouped
  `keyframes` and `observes`.
- `packages/core/test/integration/golden-roundtrip.test.ts` - golden serialization/round-trip.
- `packages/plugins/test/support/ik-envelope.ts`, `ik3d-envelope.ts` - solver scenario rigs used by
  timing and envelope tests.
- `packages/plugins/test/support/fk3d-compose.ts`, `solve-quality.ts`, `runner-fixture.ts` - solver and
  runner fixtures.
- `apps/pose-gap-filler/test/phase5-fixtures.ts` - pose pipeline numerical fixture.
- `performance/graph-benchmark.mjs`, `performance/budgets.json`, `performance/mutation-baseline.json`,
  `scripts/bench-ik.mjs`, `scripts/bench-graph.mjs`, `scripts/bench-gsap.mjs`.
- Published timing prose: `docs/BENCH-IK.md`, `docs/BENCH-PHASE5.md`.

## Read-budget pressure

Ceiling: no file under `packages/core/src` over 60,000 bytes; a source over 30,000 bytes needs a
sibling `.md`. Current largest sources:

- `graph/ir.ts` 48,904 bytes, sibling `.md` present.
- `runtime/project-runtime.ts` 46,757 bytes, sibling `.md` present.
- `engine.ts` 33,710 bytes, sibling `.md` present.
- `domain/plugins.ts` 28,887 bytes, sibling `.md` present; just under the 30 kB threshold.
- `runtime/project-phase.ts` 27,816 bytes.
- `runtime/report.ts` 26,895 bytes.
- `contract/validate-v5.ts` 26,170 bytes, sibling `.md` present.
- `runtime/graph-runtime-state.ts` 25,368 bytes.
- `graph/solver-constraints.ts` 25,054 bytes.
- `runtime/patch-registry.ts` 22,288 bytes.
- `runtime/graph-publisher.ts` 22,088 bytes.
- `domain/track.ts` 21,939 bytes.
- `contract/v5.ts` 20,289 bytes.

Adding the new contract types to `v5.ts` or new edge logic to `graph/ir.ts` risks crossing a threshold.
Plan the split before the file grows, not after the gate fails.

## Phase 1 inputs settled by this inventory

- Build the test builders in one shared support module before touching engine code.
- Put the new authored/evaluated/published types and `ValueSpec` in one schema module with a clear
  owner; do not add them to the multi-plugin registry file.
- Define the refusal rules and rule ids now; old-shape, flat-row, structured-cell, `type`-alias and
  `values-shape-invalid` cases are part of the contract, not later cleanup.
- Keep the vertical slice as the first acceptance target: `points` table source to `translate` record
  input, with source ids preserved through publication.
- Record staged red tests explicitly; do not green them with stubs and do not call Phase 1 complete
  when the suite is green by construction.

## Exit

A compact impacted-module map, a test classification count, and baseline evidence exist. Pre-existing
failures are separated from regressions. No broad rewrite has started.
