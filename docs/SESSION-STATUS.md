# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p4-05-current-main-integration-build`
**Phase:** 4, P4-05 acceptance
**Next action:** Review and merge P4-05 only when the current-main end-to-end fixture and required build job are green; then proceed to React hook and packed-consumer acceptance work.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, and remediation R1 through R8 are merged on `main`. R9 documentation is merged. P4-05 is recreated here against current `main`; the stale pre-remediation PR was closed and is not being revived.

## P4-05 changes

- `packages/core/test/integration/end-to-end.test.ts`: drives the current GSAP-like interpolator, immutable patch, browser clock, and target-aware DOM adapter together.
- `scripts/build-check.mjs`: checks the current public core entrypoint.
- `package.json`: adds the local build command.
- `.github/workflows/ci.yml`: adds the required build job with locked install.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
