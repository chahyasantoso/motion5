# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `docs/r9-status-and-plan-truth-pass`
**Phase:** 4, remediation complete through R8; P4-05 acceptance pending
**Next action:** Recreate P4-05 from current `main`: end-to-end integration plus the required build job. Do not close Phase 4 until that gate is green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, and remediation R1 through R8 are merged on `main`. The React patch-store boundary is merged and now imports through `@motion5/core/internal`; the boundary scanner covers core and consumer packages. P4-05 does not exist on current `main` and must be recreated from this point.

## R9 changes

- `README.md`: no longer claims Phase 0 or an unimplemented runtime; records the shipped remediation and remaining acceptance work.
- `docs/SESSION-STATUS.md`: records current `main` and the next concrete P4-05 action.
- `docs/IMPLEMENTATION-PLAN.md`: remains the normative execution plan; named evidence paths are reconciled in the next update after P4-05 is recreated.

## Known deferred work

- P4-05: end-to-end integration and required build job.
- React hooks and packed consumer acceptance.
- Phase 5 cross-motion references, adopted free tracks, diagnostics buffer, and remount recovery.
- Phase 6 API report, package consumer, required performance budget, and transitional-code deletion.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
