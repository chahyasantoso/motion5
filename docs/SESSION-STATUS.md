# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p3-05-project-runtime`
**Phase:** 3, runtime and publication
**Next action:** Run the P3-05 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 through P2-07 are merged on `main`. P3-01 PatchRegistry, collapsed P3-02/P3-03 GraphPublisher plus failure containment, and P3-04 GraphRuntime are merged on `main`. P3-05 ProjectRuntime is on this branch. P3-06 Engine, P3-07 benchmarks, adapters, React, and packaging do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, canonical topological order, minimal-path cycle diagnostics, and deterministic candidate validation.
- Stable in-place ObservationState with canonical indexes and a reversible undo journal.
- Transactional GraphBinding with candidate isolation, journaled deltas, atomic graph commit, and rollback evidence.
- Mechanical core boundary scan with planted-violation fixtures and a required CI gate.
- Immutable revisioned PatchRegistry, one-way GraphPublisher, and project-wide GraphRuntime.

## P3-05 changes on this branch

- `packages/core/src/runtime/project-runtime.ts`: the only mount path and project lifetime owner; it constructs exactly one GraphRuntime after graph validation, owns mounted instance membership, and tears down owner-first.
- `packages/core/test/integration/project-runtime.test.ts`: single-mount-path, invalid-candidate isolation, duplicate mount, and repeated-dispose retention evidence.

The current constructor is intentionally load-only. Candidate replacement and richer diagnostic inspection belong to later membership and diagnostics slices; this PR does not invent a second load or mutation owner.

## Immediate queue

1. Run the P3-05 quality matrix and review the implementation PR.
2. Merge P3-05 only with green required checks.
3. Continue with collapsed P3-06/P3-07 Engine plus benchmarks.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

Phase 3 remains five PRs: P3-01 registry, P3-02/P3-03 publisher plus failure semantics, P3-04 GraphRuntime, P3-05 ProjectRuntime, and P3-06/P3-07 Engine plus benchmarks. ProjectRuntime owns lifetime and the only mount path, while GraphRuntime remains the project-wide graph owner. No Engine, real adapter, React, or benchmark gate exists yet.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
