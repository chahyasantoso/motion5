# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `fix/r1-publisher-input-resolution`
**Phase:** 4, remediation wave 1
**Next action:** Review and merge R1 only when the partial-seed publication and empty-batch guard tests are green; then proceed to R2 output-edge merge, R3 Track input recomputation, and R4 membership gating.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, and collapsed P4-01/P4-02 adapters are merged on `main`. The R1 remediation branch fixes partial-seed input resolution and makes patch-batch lifecycle explicit. The collapsed React consumer boundary remains unmerged and still requires the package boundary work described in `docs/PHASE-4-IMPLEMENTATION-REVIEW.md`. P4-05 build integration does not exist yet.

## R1 changes

- `packages/core/src/runtime/graph-publisher.ts`: input edges use same-flush composition when available and the registry's last published patch otherwise.
- `packages/core/src/runtime/patch-registry.ts`: explicit open-batch state rejects double-open and close-without-open, including empty batches.
- `packages/core/test/integration/partial-seed-inputs.test.ts`: proves an unseeded input source retains its last published value.
- `packages/core/test/unit/runtime/patch-registry.test.ts`: proves empty-batch lifecycle guards.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
