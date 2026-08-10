# CI workflow

CI is an executable version of the project’s evidence model. It checks pull requests and pushes to `main`; it never rewrites contributor branches. Formatting is checked automatically and fixed only through the manually dispatched formatter.

## Global rules

- Node 24 and a pinned lockfile.
- `npm ci`, not an unconstrained install.
- Read-only repository permissions for CI.
- Concurrency cancellation per branch or pull request.
- Same required matrix on pull requests and protected branch pushes.
- Benchmark output and failure diagnostics are uploaded as artifacts.
- No job exists merely to look complete; every job has a local command and a real assertion.

## Live jobs

**quality:** format check, TypeScript check, and unit tests. Required.

**integration:** deterministic graph/runtime integration tests. Required.

**boundaries:** rejects renderer imports in core, banned compatibility symbols, and forbidden public exports. Required.

**performance:** runs the deterministic benchmark against versioned advisory budgets and uploads the report. Advisory until `2026-08-17`; it must be promoted or deleted by then.

## Planned jobs

**build:** builds packages and runs public import smoke tests. Added by P4-05.

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

P0-02 made installs reproducible. P0-05 added the required integration job. P2-07 added boundaries. P3-07 adds performance as advisory calibration. P4-05 adds build. P6-02 adds package consumer verification. Until a job’s owning phase lands, this document describes the target, not a live check.

## Required versus advisory

Required jobs block merges. Performance is advisory only while its baseline is calibrated, but it must run on every pull request, upload its report, name its expiry in session status, and be promoted or deleted by that date. “Continue on error forever” is not a policy.
