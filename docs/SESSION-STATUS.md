# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p1-04-lifecycle-primitives`
**Phase:** 1, leaf domain
**Next action:** Run the P1-04 quality matrix and open the implementation pull request only after it is green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-03 are merged on `main`. P1-04 is in progress on this branch. It adds the shared idempotent lifecycle primitive with owner-first teardown ordering and safe reentrancy; Motion, graph, runtime, adapters, React, benchmarks, and boundary scripts do not exist yet.

## Landed on main

- Reproducible Node 24 install with committed lockfile and `npm ci` quality gate.
- Typed schema v5 contract and validator with deterministic diagnostics.
- Injectable Clock, Interpolator, and Scheduler ports plus deterministic fakes.
- Stable JSON-safe golden serializer and parser.
- Fresh v5 fixtures for minimal projects, perspective warnings, free tracks, cycles, and migration.
- Integration tests covering deterministic serialization, warning/error semantics, free-track acceptance, cycle rejection, and migration immutability.
- Detailed implementation plan, TRD, motionpath lineage, and locked architecture decisions.
- Immutable renderer-neutral value primitives with deep freezing and structural equality.
- Deterministic plugin registry with duplicate registration protection and load diagnostics.
- Track leaf with local interpolation, plugin composition, immutable snapshots, and disposal.

## P1-04 changes on this branch

- `packages/core/src/domain/lifecycle.ts`: shared `Lifecycle` state machine for created, mounted, detached, and destroyed states.
- `packages/core/test/unit/domain/lifecycle.test.ts`: transition, owner-first guard-before-notify, idempotence, reentrancy, and destroy alias evidence.

## Immediate queue

1. Run the P1-04 quality matrix and review the implementation PR.
2. Merge P1-04 only with green required checks.
3. Continue with P1-05 Motion scheduling and children.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

The repository follows the implementation plan through P1-03. P1-04 is isolated to lifecycle state and callbacks; it introduces no graph, renderer, or runtime boundary crossing.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
