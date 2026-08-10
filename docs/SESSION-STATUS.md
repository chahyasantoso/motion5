# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p3-04-graph-runtime`
**Phase:** 3, runtime and publication
**Next action:** Run the P3-04 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 through P2-07 are merged on `main`. P3-01 PatchRegistry and collapsed P3-02/P3-03 GraphPublisher plus failure containment are merged on `main`. P3-04 GraphRuntime is on this branch. P3-05 ProjectRuntime, P3-06 Engine, P3-07 benchmarks, adapters, React, and packaging do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, canonical topological order, minimal-path cycle diagnostics, and deterministic candidate validation.
- Stable in-place ObservationState with canonical indexes and a reversible undo journal.
- Transactional GraphBinding with candidate isolation, journaled deltas, atomic graph commit, and rollback evidence.
- Mechanical core boundary scan with planted-violation fixtures and a required CI gate.
- Immutable revisioned PatchRegistry and one-way GraphPublisher with failure containment.

## P3-04 changes on this branch

- `packages/core/src/runtime/graph-runtime.ts`: one project-wide owner for GraphBinding, ObservationState, GraphPublisher, PatchRegistry, and exactly one injected Clock subscription; attachment membership drives seeds, and disposal releases the subscription.
- `packages/core/test/integration/graph-runtime.test.ts`: I-13 evidence for one subscription, stable owner identity, monotonic ticks across detach/reattach, attached-seed filtering, and disposal.

The compose resolver is injected at this internal boundary because Track-to-publisher composition wiring belongs to the later project/runtime composition work; no renderer or engine is introduced here.

## Immediate queue

1. Run the P3-04 quality matrix and review the implementation PR.
2. Merge P3-04 only with green required checks.
3. Continue with P3-05 ProjectRuntime.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

Phase 3 remains five PRs: P3-01 registry, P3-02/P3-03 publisher plus failure semantics, P3-04 GraphRuntime, P3-05 ProjectRuntime, and P3-06/P3-07 Engine plus benchmarks. GraphRuntime is project-wide and not Motion-owned; it keeps the clock subscription alive through detach/reattach and rejects non-monotonic explicit ticks.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
