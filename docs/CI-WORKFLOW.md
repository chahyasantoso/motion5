# CI workflow

CI is an executable version of the project’s evidence model. It checks pull requests and pushes to `main`; it never rewrites contributor branches. Formatting is checked automatically and fixed only through the manually dispatched formatter.

## Global rules

- Node 24 and a pinned lockfile.
- `npm ci`, not an unconstrained install.
- Read-only repository permissions for CI.
- Concurrency cancellation per branch or pull request.
- Same required matrix on pull requests and protected branch pushes.
- Artifacts for benchmark output and failure diagnostics.
- No job exists merely to look complete; every job has a local command and a real assertion.

## Live jobs

**quality:** format check, TypeScript check, unit tests, and migration tests. Required.

**integration:** deterministic golden serialization, schema/migration contract integration, free-track acceptance, warning/error semantics, and cycle rejection. Required from P0-05.

## Planned jobs

**boundaries:** rejects renderer imports in core, banned compatibility symbols, duplicate runtime owners, and forbidden public exports.

**performance:** runs deterministic graph and memory benchmarks against versioned budgets. Advisory only during calibration, with a removal date in status; required afterward.

**build:** builds packages and runs public import smoke tests.

**package:** packs the repository, installs the tarball into a clean consumer, and imports only documented exports.

## Command contract

```json
{
  "check": "npm run format:check && npm run typecheck && npm test",
  "test:migration": "vitest run packages/core/test/migration",
  "test:contract": "vitest run packages/core/test/contract",
  "test:ports": "vitest run packages/core/test/contract/ports.test.ts",
  "test:integration": "vitest run packages/core/test/integration",
  "boundary": "node scripts/boundary-scan.mjs",
  "api:check": "node scripts/api-surface-check.mjs",
  "benchmark": "node performance/graph-benchmark.mjs",
  "build": "npm run build",
  "pack:check": "npm pack --dry-run"
}
```

Every CI step must map to an npm script reproducible locally. If it cannot, add the script before adding the job.

## Rollout schedule

P0-02 made installs reproducible. P0-05 adds the required integration job. P2-07 adds boundaries. P3-07 adds performance. P4-05 adds build. P6-02 adds package consumer verification. Until a job’s owning phase lands, this document describes the target, not a live check.

## Required versus advisory

Required jobs block merges. A benchmark may be advisory only while its baseline is being calibrated, must name its expiry in status, and must be promoted or deleted by that date. “Continue on error forever” is not a policy.
