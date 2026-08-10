# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p1-01-immutable-value-snapshots`
**Phase:** 1, leaf domain
**Next action:** Run the P1-01 value tests and open the implementation pull request only after the quality matrix is green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-05 are merged on `main`. P0-06 is merged on `main` as documentation only: the detailed implementation plan, normative TRD, lineage documentation, resolved decisions ADR-014 through ADR-017, and unconditional v1 deep-freezing ADR-018.

P1-01 is in progress on this branch. It adds the first domain primitive: renderer-neutral immutable values, deep freezing, cycle rejection, and structural equality. No Track, Motion, graph, runtime, adapter, React, benchmark, or boundary implementation exists yet.

## Landed on main

- Reproducible Node 24 install with committed lockfile and `npm ci` quality gate.
- Typed schema v5 contract and validator with deterministic diagnostics.
- Injectable Clock, Interpolator, and Scheduler ports plus deterministic fakes.
- Stable JSON-safe golden serializer and parser.
- Fresh v5 fixtures for minimal projects, perspective warnings, free tracks, cycles, and migration.
- Integration tests covering deterministic serialization, warning/error semantics, free-track acceptance, cycle rejection, and migration immutability.
- Required GitHub Actions integration job using the committed lockfile.
- Detailed implementation plan, TRD, motionpath lineage, and locked architecture decisions.

## P1-01 changes on this branch

- `packages/core/src/domain/values.ts`: `ImmutableValue`, `freezeValue`, and `equalValues`.
- `packages/core/test/unit/domain/values.test.ts`: deep immutability, cycle safety, unsupported values, equality, and shared-reference coverage.

## Immediate queue

1. Run the P1-01 quality matrix and review the implementation PR.
2. Merge P1-01 only with green required checks.
3. Continue with P1-02 plugin registry, then P1-03 Track leaf.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

The repository now follows the implementation plan through P0-06: all Phase 0 slices are merged, and P1-01 is the first Phase 1 runtime slice. The plan's P0-05 status wording should be corrected from “In review” to “Done, merged” in the next documentation maintenance commit; it does not change runtime behavior or the current slice ordering.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, exports, and tests move with the code they describe.
