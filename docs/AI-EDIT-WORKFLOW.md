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

`dry_run` is optional and defaults to `false`. With `true`, the request is validated and nothing is written, which is the section below.

## The anchor rule

An anchor must match **exactly once** in the file. Zero matches and more than one match are both refusals, and the report tells you the count it actually found.

This is why the contract is anchors and not `git apply`. A patch is addressed by line number and surrounding context, neither of which you can verify without reading the whole file, and a diff that is off by one line fails as a unit with nothing useful to say about why. An anchor is addressed by content you copied out of the file you already read, and its failure mode is a number you can act on.

So read the region before you write the request, and quote enough of it to be unique. One short sentence that appears in three sections is a refusal you will have to pay another round trip to learn about.

A request is all or nothing. Every edit is validated against the file content as the earlier edits in the same request left it, and nothing is written unless all of them pass. A partially applied request is the one outcome this workflow will not produce.

## Checking an anchor without applying it

Setting `dry_run` to `true` runs the validation pass and stops one line above the write pass. Nothing is written, the formatter never runs, and the report tells you what a real run would have done.

It exists for one property, and it is the one the anchor rule already needs. An anchor must be unique in the file, and a file large enough to truncate on read cannot be checked for that: you verify uniqueness across the prefix you received and then assert it over bytes you never saw. The count reported here is taken against the file on disk, so a dry run answers the question your own read cannot. Spend the round trip on any request whose anchors came out of a read you are not certain was complete.

The report names the anchor count per file and the size each file would end up at, measured before the formatter. Those sizes are what let you check a change against the read budget below before you spend the write.

Everything else refuses exactly as it would on a real run: a path this workflow may not touch, two modes on one edit, a `create` over a file that exists, a `delete` of a file that is not there, a `message` that is not a single line. A clean dry run means the request is valid, not merely that its anchors are unique.

Two things about it are easy to get wrong. A dry run **consumes its request**, the same as an apply, because it succeeded and because a request left in the directory is what makes the next push refuse for holding two: re-upload it without the flag to apply it. And its commit carries `chore(ai-edit): dry run, nothing applied [skip ci]` rather than your `message`, because a commit named after a change it did not make is a lie in the log. The `AI-Edit-Request:` trailer still names the request that was consumed.

The `[skip ci]` on that subject is honest for the same reason the subject is fixed. The only path in a dry run's commit is the request it consumed, so the content diff is empty by construction, and every `CI` job would install a toolchain to re-verify a tree it has already verified. Because the subject is not yours, no request can put the directive on a commit that does change files. One consequence to know rather than discover: if a dry run is the last commit before a merge, the required contexts never report on that head and the pull request sits. `ci.yml` has `workflow_dispatch`, so dispatch `CI` by hand from the Actions tab.

One trap. A branch whose `scripts/apply-ai-edit.mjs` predates this flag ignores unknown request keys, so `dry_run` there is silently a real apply. Read the report and confirm it says dry run before you believe nothing was written.

## The read budget

This document owns the rule, `scripts/read-budget-scan.mjs` owns the numbers and the check, and the `read-budget` job in `CI` is what runs it. The amendment to ADR-008 in [DECISIONS.md](./DECISIONS.md) records why a gate of this shape is allowed at all.

**No file under `packages/core/src` may exceed 60,000 bytes, markdown included.** The rule that follows is the one that concerns you directly: a file that does not survive one contents read may not be edited by anchor. Not because the anchor is likely to be wrong, but because you cannot tell whether it is. A truncated read carries no error and no marker, so a prefix is handed to you as though it were the file, and the primitive has no offset and no line window that would let you ask for the rest. Code search does not close the gap either, because it answers against the indexed default branch rather than the branch you are editing, so it locates a symbol and cannot hand over a region.

That is the whole of the motivation, and it is a correctness property rather than a style rule. The measured case is `packages/core/src/runtime/project-runtime.ts` at 103,657 bytes, which truncated inside a docblock and took `#assertLive` with it, the private guard every public verb in that class calls first. An implementor could have rewritten a method by anchor without ever seeing it.

**A source over 30,000 bytes keeps its private reasoning in a sibling document, `x.ts` beside `x.md`.** The trigger is half the budget, which is headroom rather than a second measurement: a file at the trigger can double its prose before it reaches the budget, and one over the budget has nowhere to put it. The path is derived by swapping one extension, so a reader holding a source path already holds the document path, with no index and no naming decision per file. Read the document before the source rather than after it: it hands over the member list in declaration order, which is what makes a source read that truncates later merely inconvenient instead of dangerous.

Four conventions make the pair checkable, and the scan fails a violation of any of them. The source names its document, as a `// Docs: ./x.md` line. Every level-two heading in the document names something the source declares. Those headings are in declaration order. And the mirrored source carries no private docblock at all, which is the one-directional half that makes the move total: with no second place for the reasoning to sit, there is nothing for the document to drift against.

What stays in the source is as deliberate as what leaves it. A docblock on the exported surface stays, because TypeScript carries it into the declaration file and into editor hover, so moving one deletes an API doc rather than relocating it. A comment explaining the statement on the next line stays too. Only the private surface moves: `#` members, file-local types, and a `function` or `const` the module does not export, including one a single function owns as a closure.

Be clear about what the gate proves, because it is less than it looks. It proves the source is empty, not that the document is complete. Completeness needs a judgement about which member deserves prose and is not decidable by a scan, while a mirrored source carrying no private docblock is total and mechanical. A heading whose prose quietly stopped being true is the residual risk, and it is written down here rather than claimed away.

A file over budget today gets a waiver with a ceiling rather than a bare path, so it may shrink and may not grow, and the slice that splits it lowers the number in the same commit. A source that owes a document and does not have one yet gets an entry in the pending list, and that list has teeth in the other direction: an entry the tree no longer needs is itself a violation, so a file that gained its document, shrank under the trigger, or stopped existing fails the scan by carrying a stale entry. Neither list carries a removal date. A date does not shrink a file, it fails the build on a morning nobody picked, and it is satisfied by editing the date. Both lists are empty right now, which means the next file to cross a line gets an entry rather than a new mechanism, and raising the budget to make a file fit is not one of your options.

## What this asks of you, given that you cannot run it

You cannot run `npm run test:read-budget`, and you cannot detect the condition it measures, which is the reason the numbers are written into prose here and in [AGENTS.md](../AGENTS.md) instead of living only in the script. The gate runs where there is a checkout. Acting on the rule before it fires is your half.

Three things follow, and all of them are cheap. Check the size of a file before you anchor into it, because a read that arrived at or near the budget is a read you should not trust for uniqueness. Keep the split or the sister doc in the same request as the slice that pushes a file past a line, rather than leaving a follow-up nobody scheduled. And when a document and its source both change, remember the scan reads markdown under the scanned root too: a pair whose document loses its tail is the original bug with an extra file in it.

A member moving to a new file takes its section into that file's sister document. That is the same rule one indirection out, and it is the one a mechanical extraction breaks most often, because a docblock is part of the thing it sits above: a request that moves a member either moves the prose with it or leaves the member where it is.

## What it will not do

It refuses any path under `.git/`, `node_modules/`, `.ai/`, and `.github/workflows/`. A workflow with repository-write power that can rewrite workflows is a different and much larger permission, so an edit to CI is a normal pull request reviewed by a human.

Before committing, it compares the staged file list against the paths your request named, plus the request file itself, and fails if anything else appears. Least privilege applies to the file list, not only to the token.

It never runs the suite or `npm ci`. It installs the pinned Prettier and nothing else. `CI` already owns correctness on the resulting commit, and re-running it here would double the cost for no new information.

## The cost, and how to keep it down

One Actions run per request, one to two minutes of wall clock, plus however long you spend polling for the comment. That is the price of every round trip, and it is the reason the protocol is batch-first.

Put every edit for a slice in one request. One request per edit is what turns a bounded ninety seconds into an afternoon, and it is entirely avoidable.

Read the file before you write the anchor. A refused request costs exactly as much as an applied one.

A dry run is a second run rather than a free one. It is worth its round trip on anchors you could not fully verify, and a waste of one on a file you have whole in front of you.

## Reading the result

The comment names the files written, the state each one was left in, and the exact reason for any refusal. It is the only channel an API-only implementor can actually read: a job summary and an uploaded artifact are both invisible to you, so a workflow that reported only there would leave you guessing whether your own edit landed.

A refusal fails the run, so nothing is committed and your request file stays exactly where you put it. Correct that same path and push it again. An applied request is removed by the commit that consumed it, which is how you tell the two outcomes apart from the tree alone. A dry run is consumed the same way, so the tree does not distinguish it from an apply, and the report and the commit subject are what do.

The commit is made with `PERSONAL_ACCESS_TOKEN` rather than `GITHUB_TOKEN` for the reason [FORMATTING.md](./FORMATTING.md) already gives: a push made with `GITHUB_TOKEN` triggers no new workflow run, so the new head would carry no checks. Verify your change through the `CI` run on that commit.

## Testing the workflow

Exercised on the pull request that introduced it, with every report in that thread. A valid request applied its edits, formatted the touched files, committed with the repository PAT, removed the request, and commented back. Four refusals ran in the same pass, each one leaving the target file untouched and committing nothing: an anchor matching zero times, an anchor matching twice, a path under `.github/workflows/`, and a request whose second edit could not apply while its first could. That last one is the all-or-nothing rule, and it is the case to re-run by hand if you ever change the write pass.

`dry_run` was exercised the same way, on the pull request that introduced it: a dry run of that pull request's own documentation edits reported its anchor counts and its resulting sizes and wrote nothing, and the identical request without the flag then applied them.

The validation pass also has a unit test, the `AE-` cases in `packages/core/test/unit/scripts/apply-ai-edit.test.ts`. They run the shipped script as a subprocess against planted trees, which is how the workflow invokes it, and they assert what a live run can only demonstrate one outcome at a time: the anchor counts a dry run reports, the count named in each refusal, that a later edit is validated against what an earlier one staged, that a refusal leaves every file it named untouched, and that a dry run gets the fixed `[skip ci]` subject while a real run keeps your `message` verbatim. Run them with `npx vitest run packages/core/test/unit/scripts/apply-ai-edit.test.ts`. The live runs still carry what a subprocess cannot: the token, the formatter, the comment, and how the request is chosen.

One refusal mode is invisible in a comment and has to be read in the job list: a request the workflow never saw. Any change to how the request is chosen needs a live run from an API-made commit, because that is the push shape that broke it once already.

## Two traps

The commit that consumes a request is itself a push to `.ai/edits/**`, because it removes the file. The job is skipped when the head commit was authored by `github-actions[bot]` and carries the `AI-Edit-Request:` trailer that the consuming commit is written with, so the workflow does not eat its own tail. The author is half of that gate on purpose: prose quoting the trailer cannot silence a real request. A push that leaves the directory empty exits cleanly and says nothing, which is also what editing `.ai/edits/README.md` does. Keep both if you touch the trigger.

`.ai/` is in `.prettierignore`. Without that, a hand-written request file is unformatted JSON that fails `format:check` on your pull request before it is ever applied.

## Standing infrastructure, not a temporary workflow

[PR-WORKFLOW.md](./PR-WORKFLOW.md) allows a temporary workflow that removes itself after a one-off mechanical job, and that is the right pattern for a migration script that runs once. This is not that. The painpoint recurs every session, so creating and deleting the same workflow each time would need identical write power while adding two commits of churn per edit. It is reviewed once, permanently, and constrained in writing here instead.

Everything else in that section still applies: narrow permissions, same-repository branches only, never fork pull requests, deterministic, a bounded file list, and a credential that is never printed. A personal access token does not make a workflow safe. The YAML and `scripts/apply-ai-edit.mjs` are code with repository-write power, and they are reviewed as such.
