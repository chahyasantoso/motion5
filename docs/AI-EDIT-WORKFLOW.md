# AI edit workflow

This document is the contract for **AI edit**, `.github/workflows/ai-edit.yml`. It exists for one reader: an implementor working through the GitHub API with no local checkout, no `node_modules`, and no way to run `prettier` or the suite.

That implementor has two standing problems. Rewriting a large file through the contents API is slow enough to fail part-way through a session, and output has to be prettier-safe by hand because the formatter is unreachable. Both are solved the same way: write something small that describes the change, and let a runner do the parts that need a machine.

## The shape of it

Drop one JSON file at `.ai/edits/<name>.json` on your working branch. The push is the trigger, because dispatching a workflow is not something every API-only implementor can do, while writing one small file always is. The workflow then applies the edits, runs the pinned Prettier on the files it touched, commits with `PERSONAL_ACCESS_TOKEN`, removes the request it consumed, and comments the outcome back.

The size of the file you are editing stops mattering, because you never write it back. You write the anchor and the replacement.

One request at a time. The workflow applies the single `.json` file it finds in `.ai/edits/`, and a directory holding two of them is refused rather than one being chosen for you. The directory is what it reads, never the file list on the push event: a commit created through the Git data API carries empty `added` and `modified` lists, so a workflow selecting from those would be a silent no-op for the one reader it is written for.

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

A request carries at most **50 edits**, and a fifty-first is a refusal naming the count it found. That is a ceiling on one request rather than on one slice: a larger batch splits into two requests applied one after the other, and the second is written once the commit that consumed the first has removed it. The batch-first rule below is unchanged by that, because two requests for one slice is still nothing like one request per edit.

## The anchor rule

An anchor must match **exactly once** in the file. Zero matches and more than one match are both refusals, and the report tells you the count it actually found.

This is why the contract is anchors and not `git apply`. A patch is addressed by line number and surrounding context, neither of which you can verify without reading the whole file, and a diff that is off by one line fails as a unit with nothing useful to say about why. An anchor is addressed by content you copied out of the file you already read, and its failure mode is a number you can act on.

So read the region before you write the request, and quote enough of it to be unique. One short sentence that appears in three sections is a refusal you will have to pay another round trip to learn about.

A request is all or nothing. Every edit is validated against the file content as the earlier edits in the same request left it, and nothing is written unless all of them pass. A partially applied request is the one outcome this workflow will not produce.

## Reading the region, and the asymmetry this contract has

The rule above says read the region before you write the anchor, and it does not say how a region is read, because there is no way to read one. A contents read is whole-file or prefix: no offset, no line window, and no second call that returns the part the first one dropped. A file past the response cap arrives truncated, and its tail is not late, it is unreachable.

That is the asymmetry, and it is the whole of why this section exists. The write side is size-independent by construction, because you never write the file back. The read side is size-bound with no lever except the size of the file itself, which is the one variable in the loop that anybody controls.

Code search is a locator rather than a reader, and it does not close the gap. It will tell you a symbol exists and print a few lines around it, and it will not hand you the region: it caps fragments per file and answers against the indexed default branch, so on the working branch you are editing it is stale or blind.

The consequence for the anchor rule is exact. An anchor must match exactly once **in the file**, and a truncated read cannot establish that. It can only establish uniqueness across the prefix that arrived. An anchor unique in the prefix and repeated in the invisible tail comes back as the two-match refusal, which fails safe and costs one round trip. An anchor that genuinely is unique applies cleanly, all-or-nothing, exactly as designed, while the reasoning behind the edit was checked against a prefix. The write pass validates the anchor against the whole file, and nothing validates the edit against the part you never read, so every safety property here stays intact while checking a different thing.

**A file that does not survive one read may not be edited by anchor. Split it first.** `npm run test:read-budget` is how you find out which side of that line a file is on, and `scripts/read-budget-scan.mjs` carries the measured numbers, the budget they justify, and every file still over it.

## The sister doc

A source file over 30,000 bytes keeps its private reasoning in a sibling document rather than in docblocks. `packages/core/src/runtime/project-runtime.ts` implies `packages/core/src/runtime/project-runtime.md`, by swapping one extension, so a reader holding a source path already holds the document path. No index, no registry, no naming decision per file.

**Read the document first and the source second.** The document is the map: it hands over the member list in one call, which is what makes a source read that truncates afterwards recoverable rather than silently dangerous. The lookup is unconditional and absence is an answer: derive the path, look, and if there is no document then the source carries its own docs.

What moves is every docblock on a private member and on a file-local type. What stays is the docblock on anything **exported**, because TypeScript carries those into the declaration file and into editor hover, so moving one deletes an API doc rather than relocating it; a long one leaves its summary line behind and moves only the argument. What also stays is a comment explaining the statement on the next line, which is not a docblock and which no heading owns.

An ADR still owns anything an ADR owns. The precedence is ADR first, sister doc second, comment last: a statement a record owns collapses to `See ADR-064.` and that pointer lives in the document now. A document never restates an ADR's content, because that is the second copy this convention exists to avoid.

The mirror is mechanical, so a script can check it. One `##` heading per documented declaration, named exactly as the source declares it, in **source declaration order**; a preamble uses `###` and claims nothing. The source names its document on line one as `// Docs: ./<name>.md`, and the document names the source in its `H1`. No code blocks reproducing an implementation, because a document that quotes a body is a copy with a staleness window.

Both halves are budgeted. `scripts/read-budget-scan.mjs` holds `READ_BUDGET_BYTES` and scans markdown under `packages/core/src` for exactly that reason: a pair whose document loses its tail is the original bug with an extra file in it. It also refuses a mirrored source that still carries a private docblock, which is the check that makes the move total rather than partial. What it deliberately does not check is whether the prose is still true, and that is the residual risk of the convention rather than something it claims away.

One warning about writing the move. Create the document complete in the first request and delete the docblocks in later ones, so the transient state across a slice is duplication rather than absence. Two copies for three commits is a non-event; zero copies for one commit is how reasoning dies.

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

A refusal fails the run, so nothing is committed and your request file stays exactly where you put it. Correct that same path and push it again. An applied request is removed by the commit that consumed it, which is how you tell the two outcomes apart from the tree alone.

The commit is made with `PERSONAL_ACCESS_TOKEN` rather than `GITHUB_TOKEN` for the reason [FORMATTING.md](./FORMATTING.md) already gives: a push made with `GITHUB_TOKEN` triggers no new workflow run, so the new head would carry no checks. Verify your change through the `CI` run on that commit.

## Testing the workflow

Exercised on the pull request that introduced it, with every report in that thread. A valid request applied its edits, formatted the touched files, committed with the repository PAT, removed the request, and commented back. Four refusals ran in the same pass, each one leaving the target file untouched and committing nothing: an anchor matching zero times, an anchor matching twice, a path under `.github/workflows/`, and a request whose second edit could not apply while its first could. That last one is the all-or-nothing rule, and it is the case to re-run by hand if you ever change the write pass.

One refusal mode is invisible in a comment and has to be read in the job list: a request the workflow never saw. Any change to how the request is chosen needs a live run from an API-made commit, because that is the push shape that broke it once already.

## Two traps

The commit that consumes a request is itself a push to `.ai/edits/**`, because it removes the file. The job is skipped when the head commit was authored by `github-actions[bot]` and carries the `AI-Edit-Request:` trailer that the consuming commit is written with, so the workflow does not eat its own tail. The author is half of that gate on purpose: prose quoting the trailer cannot silence a real request. A push that leaves the directory empty exits cleanly and says nothing, which is also what editing `.ai/edits/README.md` does. Keep both if you touch the trigger.

`.ai/` is in `.prettierignore`. Without that, a hand-written request file is unformatted JSON that fails `format:check` on your pull request before it is ever applied.

## Standing infrastructure, not a temporary workflow

[PR-WORKFLOW.md](./PR-WORKFLOW.md) allows a temporary workflow that removes itself after a one-off mechanical job, and that is the right pattern for a migration script that runs once. This is not that. The painpoint recurs every session, so creating and deleting the same workflow each time would need identical write power while adding two commits of churn per edit. It is reviewed once, permanently, and constrained in writing here instead.

Everything else in that section still applies: narrow permissions, same-repository branches only, never fork pull requests, deterministic, a bounded file list, and a credential that is never printed. A personal access token does not make a workflow safe. The YAML and `scripts/apply-ai-edit.mjs` are code with repository-write power, and they are reviewed as such.
