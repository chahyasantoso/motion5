# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p2-06-graph-binding-transactions`
**Phase:** 2, graph kernel
**Next action:** Run the P2-06 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 qualified identities, P2-02/P2-03 immutable IR with candidate validation, P2-04 canonical ordering with cycle detection, and P2-05 stable live state plus deterministic graph collation are merged on `main`. P2-06 transactional GraphBinding is on this branch. P2-07 boundary scripts, runtime, adapters, React, and benchmarks do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, one node model for motion and free tracks, reference normalization, deterministic edge validation, and pre-mount rejection.
- Canonical topological order and minimal-path cycle diagnostics, both iterative.
- Stable in-place ObservationState with canonical indexes and a reversible undo journal.

## P2-06 changes on this branch

- `packages/core/src/graph/binding.ts`: candidate-first GraphBinding transaction path. It validates before touching active state, applies a reversible state delta, calls the future publisher-scheduling stage, swaps the immutable graph only after all pre-commit stages succeed, and rethrows the original failure after rollback.
- `packages/core/test/integration/graph-rollback.test.ts`: I-2 evidence for valid replacement, invalid-candidate isolation, live-state failure, publisher-schedule failure, identity preservation, exact snapshot restoration, and released journals.

The scheduling and invalidation hooks are explicit test seams until their real owners exist in P3; no publisher or runtime is being faked here.

## Immediate queue

1. Run the P2-06 quality matrix and review the implementation PR.
2. Merge P2-06 only with green required checks.
3. Continue with P2-07 boundary scan and required CI gate.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

The repository follows the implementation plan through P2-06. P2-02/P2-03 remain intentionally combined in `graph/ir.ts`, and P2-06 uses a candidate `ProjectDefinition` replacement API rather than exposing separate add/remove commands before the runtime membership model exists. That keeps one transaction path and avoids a second mutation owner. The live-state delta still exercises node and edge add/remove operations, and P3 will attach the real schedule and invalidation owners through the existing stage boundary.

No boundary scanner, publication, renderer, React, or benchmark path exists yet. The P2-06 test harness is failure-injection evidence only, not a claim that publisher scheduling is live.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
