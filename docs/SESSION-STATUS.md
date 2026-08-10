# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p0-04-ports-and-fakes`
**Phase:** 0, port baseline
**Next action:** Open and review the P0-04 pull request; merge only after CI is green and the port contract tests pass.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-04 adds injectable Clock, Interpolator, and Scheduler ports, deterministic fakes, and fresh contract tests. P0-03 is accepted on `main`. The runtime, graph, adapters, React package, benchmarks, and boundary scripts do not exist yet.

## Landed on this branch

- `Clock` interface with manual clock, monotonic tick/time events, unsubscribe, disposal, and delta validation.
- `Interpolator` interface with renderer-neutral timeline contract and fake implementation.
- `Scheduler` interface with cancellation and fake queued scheduler.
- Fresh contract tests for all three ports.
- Public assertion helpers and manual clock export.

## Not landed yet

- P0-04 is not on `main` until its PR is reviewed and merged.
- No graph kernel, runtime, publisher, adapters, React package, benchmarks, or boundary scanner.

## Immediate queue

1. Open/review the P0-04 PR and wait for CI.
2. Merge P0-04 after green checks.
3. Start P0-05 golden fixture serialization and integration CI.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, exports, and tests move with the code they describe.
