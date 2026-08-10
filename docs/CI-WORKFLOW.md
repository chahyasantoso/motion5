# CI workflow

One authoritative workflow for pull requests and for `main`. No second workflow may mutate a contributor branch. Formatting fails with an actionable command instead of being silently fixed. See [FORMATTING.md](./FORMATTING.md).

## Rules

- Node 24, pinned lockfile, `npm ci` once the lockfile exists.
- Concurrency cancellation per branch and pull request.
- Read-only repository permissions in `ci.yml`. The only workflow with write permission is the manually dispatched formatter.
- The same matrix runs on pull requests and on pushes to protected branches.
- Benchmark output and failure diagnostics upload as artifacts.
- **No job exists unless it checks something real.** A green check that asserts nothing is worse than a missing check, because it is mistaken for evidence.

## Target job matrix

Jobs land with the phase that gives them something to verify. This is a schedule, not a claim about today.

- **quality** - format check, typecheck, unit tests, in one install. **Live now.**
- **integration** - graph transaction, lifecycle, port contract, and React integration suites. Lands in P0-05.
- **boundaries** - no animation engine, DOM, or React imports in core contract, domain, graph, or runtime. No banned symbols. No duplicate runtime owners. No forbidden public exports. Lands in P2-07.
- **performance** - deterministic graph and downstream benchmarks compared against `performance/budgets.json`, failing only on a defined threshold. Lands in P3-07.
- **build** - build core and React, then run export and import smoke tests. Lands in P4-05.
- **package** - `npm pack --dry-run`, install the tarball into a temporary consumer, import the documented public API. Lands in P6-02.

## Command contract

CI runs npm scripts, never inline shell logic that cannot be reproduced locally. Every job maps to something a contributor can run:

```json
{
  "check": "npm run format:check && npm run typecheck && npm test",
  "format:check": "prettier . --check",
  "typecheck": "tsc --noEmit -p tsconfig.json",
  "test": "vitest run",
  "test:integration": "vitest run --project integration",
  "boundary": "node scripts/boundary-scan.mjs",
  "api:check": "node scripts/api-surface-check.mjs",
  "benchmark": "node performance/graph-benchmark.mjs",
  "build": "npm run build",
  "pack:check": "npm pack --dry-run"
}
```

If a job needs a step that is not an npm script, add the script.

## Install strategy

Until P0-02 lands the lockfile, the install step falls back to `npm install` and dependency caching is disabled, because `actions/setup-node` caching requires a lockfile. P0-02 commits the lockfile, switches to `npm ci`, and turns caching on. This is the only place in CI where a conditional install is acceptable, and it is removed by that pull request.

## Why jobs are parallel but installs are shared

The reference project ran eight jobs that each reinstalled the whole dependency tree, and the format job checked two files. Parallelism is worth paying for; repeated cold installs are not. Once caching is on, jobs stay parallel and share one cache key derived from the lockfile.

## Advisory jobs

A job may be advisory only while its budget is being calibrated, it must say so in its name, and it must have a dated removal condition recorded in [SESSION-STATUS.md](./SESSION-STATUS.md). An advisory job that outlives its calibration is deleted, not tolerated.
