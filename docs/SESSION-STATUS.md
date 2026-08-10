# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p3-06-07-engine-and-benchmarks`
**Phase:** 3, runtime and publication
**Next action:** Run the collapsed P3-06/P3-07 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 through P2-07 are merged on `main`. P3-01 through P3-05 are merged on `main`. The collapsed P3-06/P3-07 Engine plus deterministic benchmark slice is on this branch. Phase 4 adapters, React, and packaging do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, canonical topological order, minimal-path cycle diagnostics, and deterministic candidate validation.
- Stable in-place ObservationState with canonical indexes and a reversible undo journal.
- Transactional GraphBinding with candidate isolation, journaled deltas, atomic graph commit, and rollback evidence.
- Mechanical core boundary scan with planted-violation fixtures and a required CI gate.
- Immutable revisioned PatchRegistry, one-way GraphPublisher with failure containment, project-wide GraphRuntime, and ProjectRuntime.

## Collapsed P3-06/P3-07 changes on this branch

- `packages/core/src/engine.ts`: composition root that validates Clock, Interpolator, and Scheduler ports and constructs ProjectRuntime without doing graph work.
- `packages/core/test/integration/engine-headless.test.ts`: headless Engine loading with fake ports and invalid-port rejection.
- `performance/budgets.json`, `performance/graph-benchmark.mjs`, and `package.json`: versioned advisory budgets, deterministic benchmark report generation, and local `npm run benchmark` reproduction.

The benchmark is intentionally a deterministic calibration artifact in this slice, not a wall-clock performance claim. Its expiry is recorded as 2026-08-17, before hardening must either enforce or delete it.

## Immediate queue

1. Run the collapsed P3-06/P3-07 quality matrix and review the implementation pull request.
2. Merge only with green required checks.
3. Continue with Phase 4 adapters, starting with P4-01 GSAP interpolator.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

Phase 3 is now five PRs: P3-01 registry, P3-02/P3-03 publisher plus failure semantics, P3-04 GraphRuntime, P3-05 ProjectRuntime, and P3-06/P3-07 Engine plus benchmarks. The Engine currently injects and validates all three ports but uses a renderer-neutral placeholder compose resolver; real interpolation wiring belongs to P4-01. The benchmark emits deterministic structural evidence and explicitly does not pretend to measure wall-clock throughput yet.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
