# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p2-05-stable-observation-state`
**Phase:** 2, graph kernel
**Next action:** Run the P2-05 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 qualified identities, P2-02/P2-03 immutable IR with candidate validation, and P2-04 canonical ordering with cycle detection are all merged on `main`. P2-05 stable live state is on this branch. P2-06 transactions, P2-07 boundary scripts, runtime, adapters, React, and benchmarks do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, one node model for motion and free tracks, reference normalization, deterministic edge validation, and pre-mount rejection.
- Canonical topological order and minimal-path cycle diagnostics, both iterative.

## P2-05 changes on this branch

- `packages/core/src/graph/observation-state.ts`: one long-lived live-state object holding live nodes, live edges, and both direction indexes, mutated in place with an undo journal that `rollback` replays in reverse and `commit` releases. No rebuild-from-snapshot method exists.
- `packages/core/src/graph/compare.ts`: the single deterministic string comparator for the graph layer.
- `packages/core/src/graph/ir.ts`: diagnostic ties now break by code unit instead of `localeCompare`, and edge identity has one exported spelling, `edgeKey`, shared with live state.
- `packages/core/src/graph/order.ts`: uses the shared comparator instead of a private copy.
- `packages/core/test/unit/graph/observation-state.test.ts` and one added case in `ir-validation.test.ts`.

## Immediate queue

1. Run the P2-05 quality matrix and review the implementation PR.
2. Merge P2-05 only with green required checks.
3. Continue with P2-06 transactional `GraphBinding`, landing the journal-driven failure-injection harness before the command surface.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

The repository follows the implementation plan through P2-05, with one deliberate deviation: P2-02 and P2-03 landed as one `graph/ir.ts` owner rather than the planned `normalize.ts` plus `validate.ts` split, because IR construction and candidate validation share one normalized fixture set. Ordering and live state each kept their own owner so the publisher and the binding can depend on them independently.

The locale-sensitive diagnostic sort recorded as a follow-up in the previous session is fixed in this slice. No transaction coordinator, publication, or renderer path exists yet, so nothing yet drives live state in production code; the P2-05 tests populate it the way `GraphBinding` will.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
