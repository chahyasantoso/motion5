# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p2-04-cycle-detection-and-order`
**Phase:** 2, graph kernel
**Next action:** Run the P2-04 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Intended implementation workflow

Every implementation slice follows this path: create `feat/...` from `main`, implement one contract slice, commit it on the feature branch, open a PR into `main`, let CI run, review the diff and named tests, fix failures on the same branch, then merge only with green required checks. Direct commits to `main` are reserved for bootstrap or explicitly approved mechanical changes such as manual formatting.

## Current state

P0-01 through P0-06 and P1-01 through P1-06 are merged on `main`. P2-01 qualified identities are merged on `main`. P2-02 and P2-03 are merged on `main` as a single `graph/ir.ts` owner covering immutable IR, one node model, reference normalization, and deterministic candidate validation. P2-04 canonical ordering and cycle detection is on this branch. P2-05 live state, P2-06 transactions, P2-07 boundary scripts, runtime, adapters, React, and benchmarks do not exist yet.

## Landed on main

- Phase 0 contract, migration, golden, and CI evidence.
- Complete Phase 1 leaf domain: immutable values, plugin registry, Track, lifecycle, Motion, and trigger delegates.
- Qualified motion and free-track runtime identities with round-trip parsing.
- Immutable graph IR, one node model for motion and free tracks, reference normalization, deterministic edge validation, duplicate/self/unknown-source diagnostics, and pre-mount rejection.

## P2-04 changes on this branch

- `packages/core/src/graph/order.ts`: iterative Kahn linearization with a ready set sorted by qualified id then authored index, plus breadth-first minimal cycle reporting.
- `packages/core/src/graph/ir.ts`: the frozen IR now carries `order`, and a cyclic candidate is rejected before mount with a `graph-cycle` diagnostic naming the participating ids.
- `packages/core/test/unit/graph/order.test.ts`: diamonds, disconnected components, input-order independence, self cycles, multi-node cycles, and stable diagnostic output.

## Immediate queue

1. Run the P2-04 quality matrix and review the implementation PR.
2. Merge P2-04 only with green required checks.
3. Continue with P2-05 stable `ObservationState`, then P2-06 transactional `GraphBinding`.
4. Keep `SESSION-STATUS.md` current after every merged slice.

## Audit snapshot

The repository follows the implementation plan through P2-04, with one deliberate deviation already visible: P2-02 and P2-03 landed as one `graph/ir.ts` rather than the planned `normalize.ts` plus `validate.ts` split, because IR construction and candidate validation share one normalized fixture set. P2-04 keeps ordering in its own owner so the publisher can depend on it without depending on construction. No live mutable state, transaction behavior, or publication exists yet.

One known follow-up: diagnostic sorting in `graph/ir.ts` still uses `localeCompare`, which is locale-sensitive and therefore in tension with TR-C-04. It should move to a plain code-unit comparison in the slice that next touches diagnostics.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
