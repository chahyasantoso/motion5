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
6. **Status:** the rewrite of `SESSION-STATUS.md` this slice owes. Replace the entry your slice makes stale rather than adding one beside it, and keep your narrative and your run ids in this body, where they already belong.

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

## Temporary workflow edits

An implementor may create a temporary GitHub Actions workflow on a trusted branch when the repository already provides a write credential for that purpose, such as a configured repository secret or PAT-backed automation. This is an escape hatch for mechanical work or scripts the implementor cannot run locally, not a standing permission to execute arbitrary code.

Use it for a narrow, reviewable job such as correcting documentation, running Prettier, or applying a custom migration script. The workflow must:

- run only from an explicit same-repository branch or manual dispatch, never from untrusted fork pull-request code;
- grant the smallest required permission, normally `contents: write`, and read the credential from the repository secret or configured automation rather than hard-coding it;
- make the edit deterministic, limit the files it can change, and fail if the expected input is not found;
- commit with a clear message, push only the intended branch, and never print the credential or include it in an artifact;
- remove itself in the same commit after the edit, then leave the resulting diff for review.

A PAT does not make every workflow safe. Treat a temporary workflow as code with repository-write power: review the YAML and script before it runs, keep the token scope narrow, and do not use this path for secrets from forks or for behavior changes that should be implemented and tested normally.

Example for a docs correction, Prettier repair, or a custom script:

```yaml
name: Temporary repository edit

on:
  workflow_dispatch:
    inputs:
      branch:
        required: true
        type: string

permissions:
  contents: write

jobs:
  edit:
    if: github.event.inputs.branch == github.ref_name
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.ref_name }}
          token: ${{ secrets.REPO_WRITE_PAT }}
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci
      - name: Apply the bounded edit
        shell: bash
        run: |
          python3 scripts/update-docs.py
          npm run format
      - name: Commit and push, then remove this workflow
        shell: bash
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
          git add docs/ scripts/ .github/workflows/temporary-repository-edit.yml
          git rm .github/workflows/temporary-repository-edit.yml
          git diff --cached --quiet || git commit -m "docs: apply bounded repository edit"
          git push origin "HEAD:${GITHUB_REF_NAME}"
```

Replace `scripts/update-docs.py` with the narrowly scoped script the PR needs, or replace that step with `npx prettier --write <explicit paths>` for a format repair. The workflow itself is temporary: it is removed before the push, and the PR must review the generated commit and its exact file list.

## CI logs

Failed `CI` and `Recovery audit` runs are archived by `.github/workflows/archive-ci-logs.yml` on the separate `ci-logs` branch at `logs/<run-id>/`. The archive contains `README.md`, `run.json`, and `failed-jobs.log`. Link the original Actions run in the PR/status note; consult the archive for durable diagnostics. Never treat `ci-logs` as a development branch.

Archiving is deliberately not branch-filtered. `workflow_run` filters on the head branch when a filter is declared, and for a pull-request-triggered run that head branch is the PR head ref, so the earlier list skipped archival for every `feat/**`, `phase*/**`, `chore/**` and `docs/**` pull request. The filter was removed rather than extended, because an archive that only covers some branches is not an archive. A `feat/**` head ref therefore needs nothing dispatched by hand, and `workflow_dispatch` with a run id stays available for a run the `if:` gate skipped. Because `workflow_run` workflows are read from the default branch, a change to that gate only takes effect once it lands on `main`.

## Evidence case ids

Test cases that a plan, ADR, or PR body cites by id use a single flat series per plan, for example `C-1` upward. An id names exactly one test in the whole suite; never restart the series per file or per tier. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` enforces this, because an ambiguous citation is worse than no citation.

The whole suite is the tree `vitest` walks, both packages included, and that gate also refuses a series-shaped title its alternation does not match, so a series joins the pattern when it is opened rather than when somebody remembers. Two id spaces reach the head of a title without declaring a case and are not gated as series: a plan slice id, which carries a digit in its prefix, such as `T4-3`; and an architecture invariant `I-n` from [ARCHITECTURE.md](./ARCHITECTURE.md), which several cases may cite for one invariant. See issue #289.

## Status discipline

There is one status file. Do not create parallel handoff notes or completion matrices. Update status in the PR that changes the project state.

That update is a rewrite, not an append. `docs/SESSION-STATUS.md` states current state only and carries four sections: **Now**, **Next in line**, **Open, and not scheduled**, and **Where the rest of it lives**. Your entry replaces the entry it makes stale. `packages/core/test/unit/scripts/session-status-shape.test.ts` holds the file to that section list and to a byte ceiling, so a returning log fails `CI` on its heading before it fails on its size.

Three things do not go in it, because each already has an owner. Your slice's narrative and its red and green run ids belong in this pull request body and in the ADR that decided the slice. A standing rule you earned belongs in [GUARDRAILS.md](./GUARDRAILS.md). A fact about what an edit costs a caller belongs in [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md). The status file reached 99,180 bytes by taking all three, one slice at a time, while its own first sentence called it deliberately small, which is the whole of why the gate exists. See issue #284.
