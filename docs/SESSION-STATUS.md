# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `docs/phase3-implementation-review`
**Phase:** 3 review and remediation
**Next action:** Run the Phase 3 remediation matrix, merge the review PR only when green, then start collapsed Phase 4 adapters.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, and P3-01 through P3-07 are merged on `main`. Phase 3 remediation is on this branch. Phase 4 adapters, React, and packaging do not exist yet.

## Remediation changes on this branch

- `performance/graph-benchmark.mjs`: executable deterministic chain traversal, publication, retention counts, budget comparison, and non-zero failure on breach.
- `.github/workflows/ci.yml`: live advisory performance job with benchmark and failure-diagnostic artifacts.
- `docs/CI-WORKFLOW.md`: corrected live/planned job and command documentation.
- `docs/PHASE-3-IMPLEMENTATION-REVIEW.md`: findings marked addressed or explicitly deferred, with the three-PR Phase 4 collapse decision.

## Deferred by design

Engine's placeholder compose resolver remains until P4-01 replaces it through the real Interpolator adapter. Retry metadata, aggregate runtime error reporting, active-project replacement, and real wall-clock performance timing remain later work; none are claimed as shipped.

## Phase 4 plan

Three PRs: P4-01/P4-02 adapters, P4-03/P4-04 React consumer boundary, and P4-05 end-to-end/build gate.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
