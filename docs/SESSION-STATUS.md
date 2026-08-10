# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `chore/r6-core-package-boundary`
**Phase:** 4, remediation wave 2
**Next action:** Review and merge R6 only when package specifier resolution and consumer-boundary tests are green; then proceed to R7 boundary-scan coverage and self-test.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, P3-01 through P3-07 plus remediation, collapsed P4-01/P4-02 adapters, and R1 through R5 are merged on `main`. The collapsed React consumer boundary remains unmerged and now has a resolvable core package plus a deliberately narrow internal `PatchSource` surface. P4-05 build integration does not exist yet.

## R6 changes

- `packages/core/package.json`: adds `@motion5/core` package exports for public and internal entrypoints.
- `packages/core/src/internal.ts`: exposes only immutable patch types and the read/subscribe `PatchSource` port; `PatchRegistry` remains private.
- `packages/react/package.json`: declares the workspace dependency.
- `packages/react/src/patch-store.ts`: consumes `@motion5/core/internal`, not `core/src` internals.
- Root `package.json` and `tsconfig.json`: establish workspace and typecheck resolution.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
