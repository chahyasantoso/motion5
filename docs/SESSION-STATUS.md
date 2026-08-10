# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/r5-engine-compose-resolver`
**Phase:** 4, remediation wave 2
**Next action:** Review and merge R5 only when real Track composition and lifecycle tests are green; then proceed to R6 core package boundary.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, and R1 through R4 are merged on `main`. The collapsed React consumer boundary remains unmerged and still requires the package boundary work described in `docs/PHASE-4-IMPLEMENTATION-REVIEW.md`. P4-05 build integration does not exist yet.

## R5 changes

- `packages/core/src/engine.ts`: creates one Track per graph node and maps Track snapshots to publisher compositions.
- `packages/core/src/runtime/project-runtime.ts`: owns composition disposal through the project lifetime.
- `packages/core/test/integration/engine-headless.test.ts`: proves Engine no longer publishes the placeholder node-id payload.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
