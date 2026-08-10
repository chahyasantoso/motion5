# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p0-05-golden-fixtures-and-integration`
**Phase:** 0, golden evidence baseline
**Next action:** Open and review the P0-05 pull request; merge only after quality and integration CI are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-05 adds deterministic golden serialization, fresh schema/migration integration fixtures, and a required integration CI job. P0-03 and P0-04 are merged on `main`. The runtime, graph, adapters, React package, benchmarks, and boundary scripts do not exist yet.

P0-06 is open on `docs/p0-06-trd-and-detailed-plan`. It is documentation only: a slice-level implementation plan and a normative technical requirements document. It asserts no runtime invariant and adds no executable evidence.

## Landed on this branch

- Stable JSON-safe golden serializer and parser.
- Fresh v5 fixtures for minimal projects, perspective warnings, free tracks, cycles, and migration.
- Integration tests covering deterministic serialization, warning/error semantics, free-track acceptance, cycle rejection, and migration immutability.
- Required GitHub Actions integration job using the committed lockfile.

## Not landed yet

- P0-05 is not on `main` until its PR is reviewed and merged.
- P0-06 is not on `main` until its PR is reviewed and merged.
- Full graph runtime and publication behavior remain unimplemented.

## Immediate queue

1. Open/review the P0-05 PR and wait for quality plus integration CI.
2. Merge P0-05 after green checks.
3. Review and merge the P0-06 documentation PR.
4. Start Phase 1 with P1-01 immutable value snapshots, then the P1-03 Track leaf.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, exports, and tests move with the code they describe.
