# Pull request workflow

Pull requests are the unit of architectural change. A PR is not complete because the code works locally; it is complete when ownership, evidence, API, docs, and deletion are all clear.

## Branches

Use `feat/`, `fix/`, `test/`, `docs/`, `perf/`, or `chore/`. Include the plan id when applicable, for example `feat/p0-05-schema-migration-tests`. Do not create long-lived integration branches.

## Commits

Use imperative conventional commits with a module scope:

```text
feat(graph): add transactional edge replacement
test(migration): cover v4 free-track conversion
docs(architecture): define blocked downstream publication
chore: apply prettier
```

Formatting never shares a behavior commit.

## Pull request body

Every PR states:

1. **Invariant:** what is now guaranteed.
2. **Evidence:** the named test or CI job that proves it.
3. **Ownership:** which object gained or lost responsibility, and why no second owner exists.
4. **Public surface:** changed exports, schema, or types.
5. **Deletions:** compatibility code, tests, docs, or flags removed.
6. **Status:** update to `SESSION-STATUS.md`.

## Sizing and review

Target fewer than twenty semantic files and one meaningful invariant. More than twenty-five commits or a second revert means recut the slice. Review first for duplicate ownership, then test validity, flags/aliases/facades, API exports, hidden behavior in formatting, and documentation drift.

**Semantic files** means every distinct file in the pull request diff, counted once, excluding lockfiles, generated build output, and files touched only by a formatting commit. In practice it is the changed-file count GitHub reports, minus those exclusions. State the number once, in the PR body. A plan, amendment, or status doc that maintains its own count will disagree with it eventually, and a reader cannot tell which one is measuring the ceiling.

## Merge and revert

Squash merge into protected `main` only when required checks are green. Never skip or weaken a test to merge. Revert quickly when a slice breaks ownership or evidence; after a second revert, redesign the slice.

## Formatting and CI

The `quality` job runs a read-only `npm run format:check`, and drift fails it. Nothing in `CI` repairs that drift. The write-enabled repair is `.github/workflows/format.yml`, named **Format manually**, and its only trigger is `workflow_dispatch` with a `branch` input: dispatch it against your branch and it pushes one `chore: apply prettier` commit, or reports that the branch is already formatted.

Earlier revisions of this document promised a repair job that ran automatically once behavioral checks were green and pushed a child commit to your pull request. There is no such job and there never was one on this trigger, so waiting for it is how a red `format:check` sits unfixed. Dispatch the workflow instead.

A fork pull request is not reachable by that workflow either, because its input is a branch in this repository. Format in the fork and push from there.

If you cannot run `npx` or `prettier` at all, which is a normal condition rather than a broken setup, those two are your whole toolkit: `format:check` in `CI` is how you learn the output is unformatted, and **Format manually** is how you repair it. Both cost a round trip through Actions, so write prettier-safe output rather than relying on the repair. `proseWrap` is `preserve`, so keep a paragraph on one line or break it yourself at or under 100 columns; match the surrounding TypeScript rather than guessing at its style; and author no markdown tables, because prettier rewrites their alignment and a table is the one construct you cannot get right by eye. `docs/CI-WORKFLOW.md` owns the whole rule, including which code fences prettier formats.

Formatting never shares a behavior commit, on either path.

## CI logs

Failed `CI` and `Recovery audit` runs are archived by `.github/workflows/archive-ci-logs.yml` on the separate `ci-logs` branch at `logs/<run-id>/`. The archive contains `README.md`, `run.json`, and `failed-jobs.log`. Link the original Actions run in the PR/status note; consult the archive for durable diagnostics. Never treat `ci-logs` as a development branch.

Archiving is deliberately not branch-filtered. `workflow_run` filters on the head branch when a filter is declared, and for a pull-request-triggered run that head branch is the PR head ref, so the earlier list skipped archival for every `feat/**`, `phase*/**`, `chore/**` and `docs/**` pull request. The filter was removed rather than extended, because an archive that only covers some branches is not an archive. A `feat/**` head ref therefore needs nothing dispatched by hand, and `workflow_dispatch` with a run id stays available for a run the `if:` gate skipped. Because `workflow_run` workflows are read from the default branch, a change to that gate only takes effect once it lands on `main`.

## Evidence case ids

Test cases that a plan, ADR, or PR body cites by id use a single flat series per plan, for example `C-1` upward. An id names exactly one test in the whole suite; never restart the series per file or per tier. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` enforces this, because an ambiguous citation is worse than no citation.

## Status discipline

There is one status file. Do not create parallel handoff notes or completion matrices. Update status in the PR that changes the project state.
