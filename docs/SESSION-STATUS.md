# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/r8-dom-adapter-target-resolution`
**Phase:** 4, remediation wave 3
**Next action:** Review and merge R8 only when target-aware DOM application tests are green; then perform R9 documentation truth pass.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, and R1 through R7 are merged on `main`. The React consumer boundary is merged through the package and internal entrypoint fixes. P4-05 build integration does not exist yet.

## R8 changes

- `packages/core/src/adapters/dom.ts`: resolves a target per node, applies only changed renderable keys, emits removals, ignores blocked/error patches, and never mutates patches.
- `packages/core/test/integration/dom-patch-apply.test.ts`: covers target resolution, diffing, internal-key filtering, removal, and patch immutability.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
