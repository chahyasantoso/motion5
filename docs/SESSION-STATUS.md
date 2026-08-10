# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `fix/r4-membership-gates-seeds`
**Phase:** 4, remediation wave 1
**Next action:** Review and merge R4 only when membership gating tests are green; then proceed to R5 real Engine composition.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, R1, R2, and R3 are merged on `main`. The collapsed React consumer boundary remains unmerged and still requires the package boundary work described in `docs/PHASE-4-IMPLEMENTATION-REVIEW.md`. P4-05 build integration does not exist yet.

## R4 changes

- `packages/core/src/runtime/graph-runtime.ts`: membership starts empty; default clock and flush seeds are attached nodes only.
- `packages/core/test/integration/graph-runtime.test.ts`: existing runtime tests now attach nodes explicitly and verify detach/remount seed behavior.
- `packages/core/test/integration/membership-gating.test.ts`: proves empty membership and default-seed gating.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
