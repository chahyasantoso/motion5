# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `fix/r3-track-input-recompute`
**Phase:** 4, remediation wave 1
**Next action:** Review and merge R3 only when input-aware Track recomputation is green; then proceed to R4 membership gating.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, R1, and R2 are merged on `main`. The collapsed React consumer boundary remains unmerged and still requires the package boundary work described in `docs/PHASE-4-IMPLEMENTATION-REVIEW.md`. P4-05 build integration does not exist yet.

## R3 changes

- `packages/core/src/domain/track.ts`: clean snapshots now cache their input record and recompose when inputs change structurally.
- `packages/core/test/unit/domain/track.test.ts`: proves unchanged inputs reuse the snapshot and changed inputs trigger recomposition.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
