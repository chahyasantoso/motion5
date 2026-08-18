# CI workflow

CI is an executable version of the project's evidence model. It checks pull requests and pushes to `main`; it never rewrites contributor branches. Formatting is checked early in the quality job as a read-only gate; if drift exists, the quality job fails. Same-repository formatting drift can be repaired through the separate write-enabled prettier job that runs after behavioral green.

## Global rules

- Node 24 and a pinned lockfile.
- `npm ci`, not an unconstrained install.
- Read-only repository permissions for normal CI.
- Concurrency cancellation per branch or pull request.
- Same required matrix on pull requests and protected branch pushes.
- Benchmark output and failure diagnostics are uploaded as artifacts.
- No job exists merely to look complete; every job has a local command and a real assertion.
- A passing test that asserts empty values or zero progress is not evidence of real interpolation.

## Live jobs

**quality:** format check (read-only with `npm run format:check`), TypeScript check, and unit tests. Required. This job must pass before any formatting repair is attempted, ensuring we never hide real issues under formatting cosmetics.

**format:** write-enabled prettier repair for same-repository PRs. Runs only after all behavioral checks (quality, integration, boundaries, build, end-to-end) are green. When drift is detected, pushes a child commit to the PR branch. Fork PRs are protected by the quality format check alone and cannot use the write-enabled repair.

**integration:** deterministic graph/runtime integration tests. Required, but currently limited by the implemented runtime surface.

**boundaries:** rejects renderer imports in core, banned compatibility symbols, and forbidden public exports. Required. The planted consumer self-test still needs the recovery-plan repair.

**build:** compiles TypeScript and verifies public artifact files exist. Required.

**end-to-end:** runs the end-to-end integration fixture. Required.

**performance:** runs the deterministic structural benchmark against versioned advisory budgets and uploads the report. Advisory until **2026-08-17**. The budget decision must be revisited after Phase 0R/1R restores real value composition; do not promote an empty-pipeline baseline blindly.

## CI log archive

`.github/workflows/archive-ci-logs.yml` archives failed `CI` and `Recovery audit` runs on the separate `ci-logs` branch under `logs/<run-id>/`. Each run has `README.md`, `run.json`, and `failed-jobs.log`. Those three are the only files the workflow writes; earlier revisions of this document named `run.log` and `jobs.json`, which never existed.

The `workflow_run` trigger filters on the **head** branch, so every branch prefix that can open a pull request has to be listed there or its failures are silently never archived. A `workflow_dispatch` with a run id is the manual escape hatch. Because `workflow_run` workflows are read from the default branch, changes to that filter only take effect once they land on `main`.

Use the original Actions URL as the primary citation and the archive as durable failure evidence.

The archiver filters by result (only failed runs), respects repository branch rules, and handles race conditions where the ci-logs branch receives concurrent pushes. If archiving fails, the error is captured in the run log for manual investigation.

## Planned jobs

**package:** packs the repository, installs the tarball into a clean consumer, and imports only documented exports. Added by P6-02.

## Command contract

```json
{
  "format:check": "prettier --check .",
  "format": "prettier --write .",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:integration": "vitest run packages/core/test/integration",
  "test:boundaries": "node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts",
  "benchmark": "node performance/graph-benchmark.mjs"
}
```

Every CI step maps to an npm script reproducible locally. If it cannot, add the script before adding the job.

## Rollout schedule

P0-02 made installs reproducible. P0-05 added the required integration job. P2-07 added boundaries. P3-07 adds performance as advisory calibration. Phase 4 is currently reopened for Phase 0R/1R value-pipeline recovery. P4-05 adds build and end-to-end after the fixture and public runtime surface are stable. P6-02 adds package consumer verification.

Until a job's owning phase lands, this document describes the target, not a live check.

## Required versus advisory

Required jobs block merges. Performance is advisory only while its baseline is calibrated, but it must run on every pull request, upload its report, name its expiry in session status, and be promoted or deleted by that date. "Continue on error forever" is not a policy.
