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

## Merge and revert

Squash merge into protected `main` only when required checks are green. Never skip or weaken a test to merge. Revert quickly when a slice breaks ownership or evidence; after a second revert, redesign the slice.

## Formatting repair PRs

The read-only format check is the merge gate. If `.github/workflows/format-repair.yml` finds drift on a same-repository implementation PR, it opens or updates `chore/format-pr-<number>` targeting that implementation branch. Review the diff as mechanical-only, merge it manually into the implementation branch, and wait for the original PR checks to rerun. The bot does not auto-merge and never pushes to the implementation branch.

For fork PRs, format repair is manual because the bot intentionally has no write access. Run `npm run format` in a trusted checkout, commit the formatting separately, and push through the normal fork workflow.

## CI logs

Failed `CI` and `Recovery audit` runs are archived by `.github/workflows/archive-ci-logs.yml` on the separate `ci-logs` branch at `logs/<run-id>/`. The archive contains `README.md`, `run.json`, `run.log`, and `jobs.json`. Link the original Actions run in the PR/status note; consult the archive for durable diagnostics. Never treat `ci-logs` as a development branch.

## Status discipline

There is one status file. Do not create parallel handoff notes or completion matrices. Update status in the PR that changes the project state.
