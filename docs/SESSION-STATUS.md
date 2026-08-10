# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p2-07-boundary-scan-ci-gate`
**Phase:** 2, graph kernel
**Next action:** Re-run the P2-07 quality matrix after the CI fixes, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 qualified identities, P2-02/P2-03 immutable IR with candidate validation, P2-04 canonical ordering with cycle detection, P2-05 stable live state plus deterministic graph collation, and P2-06 transactional GraphBinding are merged on `main`. P2-07 boundary scripts and the required CI gate are on this branch. Runtime, adapters, React, and benchmarks do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, one node model for motion and free tracks, reference normalization, deterministic edge validation, and pre-mount rejection.
- Canonical topological order and minimal-path cycle diagnostics, both iterative.
- Stable in-place ObservationState with canonical indexes and a reversible undo journal.
- Transactional GraphBinding with candidate isolation, journaled deltas, atomic graph commit, and rollback evidence.

## P2-07 changes on this branch

- `scripts/boundary-scan.mjs`: scans existing contract, domain, graph, and runtime layers safely, rejecting bare or relative renderer/engine imports and banned compatibility vocabulary, then checks the public entrypoint against an allow list.
- `scripts/boundary-scan-fixtures.ts`: typed planted violations, so the quality job typechecks the fixture import without an ambient declaration gap.
- `packages/core/test/unit/scripts/boundary-scan.test.ts`: planted violations prove the mechanical rules can fail, including bare `react` and `gsap` package imports; a clean fixture proves the baseline passes.
- `.github/workflows/ci.yml`: adds a required `boundaries (node 24)` job running the scan and planted fixtures.
- `package.json`: adds `npm run test:boundaries`.

## Immediate queue

1. Re-run the P2-07 quality matrix and review the implementation pull request.
2. Merge P2-07 only with green required checks.
3. Continue to P3-01 PatchRegistry and runtime publication.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

The repository follows the implementation plan through P2-07. P2-02/P2-03 remain intentionally combined in `graph/ir.ts`. P2-06 uses a candidate `ProjectDefinition` replacement API rather than exposing separate add/remove commands before the runtime membership model exists. P2-07 makes the core import and public-export boundaries mechanical and gives the new CI job planted-violation evidence; it does not claim that runtime or adapters exist.

The first P2-07 run exposed two integration gaps, both fixed: the TypeScript test import now resolves to a typed `.ts` fixture instead of an untyped `.mjs` module, and the scanner treats not-yet-created layers as empty rather than failing with ENOENT. The next run exposed a third gap in the shared fixture: `importsRenderer` detected relative renderer paths but not bare `react` package imports. The current run exposed the same matcher gap for the bare `gsap` engine fixture; both are now covered by the shared scanner and planted test.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
