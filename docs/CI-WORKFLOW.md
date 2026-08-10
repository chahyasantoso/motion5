# CI workflow

CI is an executable version of the project’s evidence model. It checks pull requests and pushes to `main`; it never rewrites contributor branches. Formatting is checked automatically and fixed only through the manually dispatched formatter.

**Current status:** Phase 4 is reopened. The live jobs prove structural checks and graph behavior, but they do not prove the missing authored animation value pipeline. Do not treat a green current matrix as Phase 4 completion.

## Global rules

- Node 24 and a pinned lockfile.
- `npm ci`, not an unconstrained install.
- Read-only repository permissions for CI.
- Concurrency cancellation per branch or pull request.
- Same required matrix on pull requests and protected branch pushes.
- Benchmark output and failure diagnostics are uploaded as artifacts.
- No job exists merely to look complete; every job has a local command and a real assertion.
- A passing test that asserts empty values or zero progress is not evidence of real interpolation.

## Live jobs

**quality:** format check, TypeScript check, and unit tests. Required.

**integration:** deterministic graph/runtime integration tests. Required, but currently limited by the implemented runtime surface.

**boundaries:** rejects renderer imports in core, banned compatibility symbols, and forbidden public exports. Required. The planted consumer self-test still needs the recovery-plan repair.

**performance:** runs the deterministic structural benchmark against versioned advisory budgets and uploads the report. Advisory until **2026-08-17**. The budget decision must be revisited after Phase 0R/1R restores real value composition; do not promote an empty-pipeline baseline blindly.

## Planned jobs

**build:** builds packages and runs public import smoke tests. Added by P4-05 after Phase 0R/1R recovery and consumer-surface work.

**package:** packs the repository, installs the tarball into a clean consumer, and imports only documented exports. Added by P6-02.

## Command contract

```json
{
  "check": "npm run format:check && npm run typecheck && npm test",
  "test:migration": "vitest run packages/core/test/migration",
  "test:contract": "vitest run packages/core/test/contract",
  "test:ports": "vitest run packages/core/test/contract/ports.test.ts",
  "test:integration": "vitest run packages/core/test/integration",
  "test:boundaries": "node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts",
  "benchmark": "node performance/graph-benchmark.mjs",
  "build": "npm run build",
  "pack:check": "npm pack --dry-run"
}
```

Every CI step maps to an npm script reproducible locally. If it cannot, add the script before adding the job.

## Rollout schedule

P0-02 made installs reproducible. P0-05 added the required integration job. P2-07 added boundaries. P3-07 adds performance as advisory calibration. Phase 4 is currently reopened for Phase 0R/1R value-pipeline recovery. P4-05 adds build only after the end-to-end fixture and public runtime surface are real. P6-02 adds package consumer verification.

Until a job’s owning phase lands, this document describes the target, not a live check.

## Required versus advisory

Required jobs block merges. Performance is advisory only while its baseline is calibrated, but it must run on every pull request, upload its report, name its expiry in session status, and be promoted or deleted by that date. “Continue on error forever” is not a policy.
