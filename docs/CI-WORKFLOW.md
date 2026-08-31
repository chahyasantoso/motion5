# CI workflow

CI is an executable version of the project's evidence model. It checks every pull request, plus pushes to `main` and the few long-running recovery branches named in its trigger; it never rewrites contributor branches. Formatting is checked inside the quality job as a read-only gate, so drift fails that job. Repair is a separate, manually dispatched workflow and never an automatic step of `CI`.

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

Six jobs, and they are the whole of `.github/workflows/ci.yml`. Each one checks out the pull request head sha, installs with `npm ci --ignore-scripts --no-audit --no-fund`, and holds read-only permissions. None of them writes to a branch.

**quality:** `npm run typecheck`, then `npm run format:check` as a read-only gate, then `npm test`. Required. Formatting is checked here and repaired nowhere in this workflow.

**integration:** deterministic graph/runtime integration tests. Required, but currently limited by the implemented runtime surface.

**boundaries:** rejects renderer imports in core, banned compatibility symbols, and forbidden public exports. Required. The planted consumer self-test still needs the recovery-plan repair.

**build:** compiles TypeScript and verifies public artifact files exist. Required.

**end-to-end:** runs the end-to-end integration fixture. Required.

**performance:** runs the deterministic structural benchmark against versioned advisory budgets and uploads the report. Advisory until **2026-08-17**. The budget decision must be revisited after Phase 0R/1R restores real value composition; do not promote an empty-pipeline baseline blindly.

## Formatting repair is manual, and it is a different workflow

`.github/workflows/format.yml` is named **Format manually** and its only trigger is `workflow_dispatch`. It takes a `branch` input, defaulting to `main`, checks that branch out with a personal access token, runs `npm run format`, and pushes one `chore: apply prettier` commit when anything changed. It reports `Already formatted.` and exits successfully when nothing did.

Three consequences follow from it being dispatch-only, and earlier revisions of this document asserted the opposite of all three. It does not run on any pull request event and is not sequenced after behavioral green, so a green `CI` run never repairs drift and there is no child commit to wait for. It is gated on no other job, so it can be dispatched against a branch whose tests are red. And because its input is a branch in this repository, a fork pull request head is not reachable by it at all; a fork contributor formats in the fork and pushes.

Dispatch it against your own branch. The `main` default is for repairing the protected branch, which should never be routine, because `format:check` already gates every pull request that lands there.

## When you cannot run prettier

An implementor with no working `npx`, no installed `node_modules`, or no network to install them cannot run `npm run format` or `prettier` at all. That is a normal condition here rather than a broken setup, and it has exactly two answers. The read-only `format:check` step in the `quality` job is how you find out whether what you wrote is formatted, and the **Format manually** workflow, dispatched against your branch, is how you repair it. There is no third answer, and in particular there is no automatic repair arriving later.

Both answers cost a round trip through Actions, so the cheaper discipline is writing output prettier would not change. Prettier is pinned at `3.6.2` and `.prettierrc.json` sets `printWidth` 100, double quotes, trailing commas everywhere, and `proseWrap: preserve`. Prose is therefore never rewrapped, which is what makes hand-authored markdown safe: keep a paragraph on one line, or break it yourself at or under 100 columns, and prettier leaves it where you put it. In TypeScript, match the surrounding file rather than guessing, which means two-space indent, double quotes, semicolons, a trailing comma on every multi-line list, and no line over 100 columns including comments.

Author no markdown tables. Prettier rewrites a table's pipe alignment and cell padding to its own widths, so a table is the one construct that is almost certain to be reformatted by the tool you cannot run, and the resulting drift is invisible to a reader while being fatal to `format:check`. Write the list or the short run of paragraphs the table was standing in for. This is a rule for authored documentation rather than a preference, and it is why no document under `docs/` has one.

An embedded code fence is formatted too. Prettier formats the contents of a fence whose language it recognises, `json` and `ts` included, so a hand-written block in one of those is held to exactly the standard a real file is. A fence tagged `text` is left alone, which is the escape hatch for a block that genuinely is not source.

## CI log archive

`.github/workflows/archive-ci-logs.yml` archives failed `CI` and `Recovery audit` runs on the separate `ci-logs` branch under `logs/<run-id>/`. Each run has `README.md`, `run.json`, and `failed-jobs.log`. Those three are the only files the workflow writes; earlier revisions of this document named `run.log` and `jobs.json`, which never existed.

Archiving is deliberately not branch-filtered. `workflow_run` filters on the head branch when a filter is declared, and for a pull-request-triggered run that head branch is the pull request head ref, so the earlier list of `main`, `rescue/**` and `fix/**` skipped archival for every `feat/**`, `phase*/**`, `chore/**` and `docs/**` pull request. The filter was removed rather than extended, because an archive that only covers some branches is not an archive. Earlier revisions of this document described that filter as a list to maintain, which is the stale claim `docs/PR-WORKFLOW.md` corrected first and this document was owed.

What limits the work is the `if:` gate rather than a branch list. Only a `failure` or `timed_out` conclusion is archived, because `CI` cancels stale runs on every push and a cancelled run has no failed job to capture, so archiving one committed an empty log under a misleading message. A run the gate skipped is still reachable through `workflow_dispatch` with a run id. Because `workflow_run` workflows are read from the default branch, a change to that gate only takes effect once it lands on `main`.

Every archive run commits to the same branch, so runs are serialized rather than raced and are never cancelled: a cancelled archive loses the only copy of a failed run's log. A push that lands beside a manual dispatch rebases and retries three times, then fails loudly rather than dropping the log.

Use the original Actions URL as the primary citation and the archive as durable failure evidence. Never treat `ci-logs` as a development branch.

## Planned jobs

**package:** packs the repository, installs the tarball into a clean consumer, and imports only documented exports. Added by P6-02.

## Command contract

```json
{
  "check": "npm run format:check && npm run typecheck && npm test",
  "format": "prettier . --write",
  "format:check": "prettier . --check",
  "typecheck": "tsc --noEmit -p tsconfig.json",
  "test": "vitest run",
  "test:integration": "vitest run packages/core/test/integration",
  "test:boundaries": "node scripts/boundary-scan.mjs && vitest run packages/core/test/unit/scripts/boundary-scan.test.ts",
  "benchmark": "node performance/graph-benchmark.mjs"
}
```

Copied from the root `package.json` rather than paraphrased, because a contract a reader cannot paste is not one. Every CI step maps to one of these. If a step cannot, add the script before adding the job.

## Rollout schedule

P0-02 made installs reproducible. P0-05 added the required integration job. P2-07 added boundaries. P3-07 adds performance as advisory calibration. Phase 4 is currently reopened for Phase 0R/1R value-pipeline recovery. P4-05 adds build and end-to-end after the fixture and public runtime surface are stable. P6-02 adds package consumer verification.

Until a job's owning phase lands, this document describes the target, not a live check.

## Required versus advisory

Required jobs block merges. Performance is advisory only while its baseline is calibrated, but it must run on every pull request, upload its report, name its expiry in session status, and be promoted or deleted by that date. "Continue on error forever" is not a policy.
