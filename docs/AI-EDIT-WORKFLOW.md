# AI edit workflow

This document is the contract for **AI edit**, `.github/workflows/ai-edit.yml`. It exists for one reader: an implementor working through the GitHub API with no local checkout, no `node_modules`, and no way to run `prettier` or the suite.

That implementor has two standing problems. Rewriting a large file through the contents API is slow enough to fail part-way through a session, and output has to be prettier-safe by hand because the formatter is unreachable. Both are solved the same way: write something small that describes the change, and let a runner do the parts that need a machine.

## The shape of it

Drop one JSON file at `.ai/edits/<name>.json` on your working branch. The push is the trigger, because dispatching a workflow is not something every API-only implementor can do, while writing one small file always is. The workflow then applies the edits, runs the pinned Prettier on the files it touched, commits with `PERSONAL_ACCESS_TOKEN`, removes the request it consumed, and comments the outcome back.

The size of the file you are editing stops mattering, because you never write it back. You write the anchor and the replacement.

One request per push. The workflow reads the request from the paths your commit added or modified rather than from whatever the directory holds, so a push carrying two requests is refused instead of one of them being chosen for you.

## The request file

```json
{
  "message": "docs(architecture): name the single owner of track disposal",
  "target": 250,
  "edits": [
    {
      "path": "docs/ARCHITECTURE.md",
      "find": "Disposal is shared between the engine and the runtime.",
      "replace": "Disposal has one owner, and it is the engine."
    },
    { "path": "docs/NOTES.md", "create": "# Notes\n\nFirst line.\n" },
    { "path": "docs/STALE.md", "delete": true }
  ]
}
```

`message` is used verbatim as the commit subject, so it obeys the conventional-commit rule in [PR-WORKFLOW.md](./PR-WORKFLOW.md). It must be a single line.

`target` is the issue or pull request number to comment on. Omit it and the workflow falls back to the open pull request for your branch. With neither, the report only reaches the job summary, which you cannot read, so name it.

Each entry in `edits` names a `path` and exactly one of three modes: `find` with `replace` to rewrite an anchor, `create` with the full content of a new file, or `delete` set to `true`. Naming two modes is refused rather than guessed at.

## The anchor rule

An anchor must match **exactly once** in the file. Zero matches and more than one match are both refusals, and the report tells you the count it actually found.

This is why the contract is anchors and not `git apply`. A patch is addressed by line number and surrounding context, neither of which you can verify without reading the whole file, and a diff that is off by one line fails as a unit with nothing useful to say about why. An anchor is addressed by content you copied out of the file you already read, and its failure mode is a number you can act on.

So read the region before you write the request, and quote enough of it to be unique. One short sentence that appears in three sections is a refusal you will have to pay another round trip to learn about.

A request is all or nothing. Every edit is validated against the file content as the earlier edits in the same request left it, and nothing is written unless all of them pass. A partially applied request is the one outcome this workflow will not produce.

## What it will not do

It refuses any path under `.git/`, `node_modules/`, `.ai/`, and `.github/workflows/`. A workflow with repository-write power that can rewrite workflows is a different and much larger permission, so an edit to CI is a normal pull request reviewed by a human.

Before committing, it compares the staged file list against the paths your request named, plus the request file itself, and fails if anything else appears. Least privilege applies to the file list, not only to the token.

It never runs the suite or `npm ci`. It installs the pinned Prettier and nothing else. `CI` already owns correctness on the resulting commit, and re-running it here would double the cost for no new information.

## The cost, and how to keep it down

One Actions run per request, one to two minutes of wall clock, plus however long you spend polling for the comment. That is the price of every round trip, and it is the reason the protocol is batch-first.

Put every edit for a slice in one request. One request per edit is what turns a bounded ninety seconds into an afternoon, and it is entirely avoidable.

Read the file before you write the anchor. A refused request costs exactly as much as an applied one.

## Reading the result

The comment names the files written, the state each one was left in, and the exact reason for any refusal. It is the only channel an API-only implementor can actually read: a job summary and an uploaded artifact are both invisible to you, so a workflow that reported only there would leave you guessing whether your own edit landed.

A refusal fails the run, so nothing is committed and your request file stays exactly where you put it. Fix that same path and push it again. An applied request is removed by the commit that consumed it, which is how you tell the two outcomes apart from the tree alone.

The commit is made with `PERSONAL_ACCESS_TOKEN` rather than `GITHUB_TOKEN` for the reason [FORMATTING.md](./FORMATTING.md) already gives: a push made with `GITHUB_TOKEN` triggers no new workflow run, so the new head would carry no checks. Verify your change through the `CI` run on that commit.

## Testing the workflow

Exercised on the pull request that introduced it, with every report in that thread. A valid request applied its edit, formatted the touched file, committed with the repository PAT, removed the request, and commented back. Four refusals ran in the same pass, each one leaving the target file untouched and committing nothing: an anchor matching zero times, an anchor matching twice, a path under `.github/workflows/`, and a request whose second edit could not apply while its first could. That last one is the all-or-nothing rule, and it is the case to re-run by hand if you ever change the write pass.

## Two traps

The commit that consumes a request is itself a push to `.ai/edits/**`, because it removes the file. Two guards keep the workflow from eating its own tail. The job is skipped when the head commit was authored by `github-actions[bot]` and carries the `AI-Edit-Request:` trailer that the consuming commit is written with, and the request is read from what the pushed commit added or modified, so a commit that only removes one names nothing. The author is part of the first guard on purpose: prose quoting the trailer cannot silence a real request. A push naming no request exits cleanly rather than failing, which is also what editing `.ai/edits/README.md` does. Keep all of that if you touch the trigger.

`.ai/` is in `.prettierignore`. Without that, a hand-written request file is unformatted JSON that fails `format:check` on your pull request before it is ever applied.

## Standing infrastructure, not a temporary workflow

[PR-WORKFLOW.md](./PR-WORKFLOW.md) allows a temporary workflow that removes itself after a one-off mechanical job, and that is the right pattern for a migration script that runs once. This is not that. The painpoint recurs every session, so creating and deleting the same workflow each time would need identical write power while adding two commits of churn per edit. It is reviewed once, permanently, and constrained in writing here instead.

Everything else in that section still applies: narrow permissions, same-repository branches only, never fork pull requests, deterministic, a bounded file list, and a credential that is never printed. A personal access token does not make a workflow safe. The YAML and `scripts/apply-ai-edit.mjs` are code with repository-write power, and they are reviewed as such.
