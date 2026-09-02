# Formatting

Prettier is the only formatting authority. It is a mechanical tool, not a code-review topic, and formatting never shares a commit with behavior.

This is the only formatting document. It replaces the former `docs/FORMAT-WORKFLOW.md`, which described a `format-repair.yml` workflow that does not exist and archive files (`run.log`, `jobs.json`) that were never written.

## Local commands

```bash
npm run format        # write changes
npm run format:check  # verify without writing
```

Run the formatter before pushing. Everything below exists for when you forget.

## The read-only gate

`npm run format:check` runs inside the `quality` job in `.github/workflows/ci.yml`, before the tests. It is required, it never writes, and it fails the job on drift. This is deliberately the first thing formatting does: a repair that ran earlier could hide a real failure under a cosmetic commit.

This gate is the only formatting protection a fork pull request gets. Fix drift locally and push through your fork.

## Nothing in CI repairs drift

`.github/workflows/ci.yml` holds six jobs (`quality`, `integration`, `boundaries`, `build`, `end-to-end`, `performance`), all of them on read-only repository permissions, and none of them writes to a branch. There is no `format` job in that workflow, no `chore: apply prettier` child commit pushed to your pull request, and nothing that runs once the behavioral checks are green.

Earlier revisions of this document described exactly that job, down to the conditions it was constrained by. It never existed on that trigger. Waiting for it is how a red `format:check` sits unfixed, which is the same failure mode this document was written to clean up. Repair is manual, and it is the workflow below.

## The manual repair

`.github/workflows/format.yml` is named **Format manually**. Its only trigger is `workflow_dispatch` and it takes one input, `branch`, defaulting to `main`. It checks that branch out with `PERSONAL_ACCESS_TOKEN`, runs `npm run format`, and pushes one `chore: apply prettier` commit when anything changed. When nothing did, it reports `Already formatted.` and exits successfully.

There is no `mode` input, and there is no `format-manual.yml`. An earlier revision of this document named that file and its `direct-commit`, `pull-request`, and `report` modes, and told you to prefer it. It is not in `.github/workflows`. `format.yml` is the whole of the write-enabled path.

Three consequences follow from it being dispatch-only. It runs on no pull request event, so a green `CI` run repairs nothing. It is gated on no other job, so it can be dispatched against a branch whose tests are red. And because its input is a branch in this repository, a fork pull request head is not reachable by it at all: format in the fork and push from there.

The `main` default is for repairing the protected branch, which should never be routine, because `format:check` already gates every pull request that lands there.

When the repair does run, review its commit as mechanical-only and let it merge with your pull request. If it ever contains something that is not formatting, treat that as a bug in the formatter or in the source, never as a shortcut for a behavior change.

## When you cannot run prettier at all

No working `npx`, no installed `node_modules`, or no network to install them is a normal condition here rather than a broken setup. `format:check` in `CI` is how you find out your output is unformatted, and **Format manually** is how you repair it.

Both cost a round trip through Actions, so the cheaper discipline is writing output prettier would not change. Keep a paragraph on one line or break it yourself at or under 100 columns, match the surrounding TypeScript rather than guessing at its style, and author no markdown tables. [CI-WORKFLOW.md](./CI-WORKFLOW.md) owns the whole rule, including which code fences prettier formats.

An implementor working through the GitHub API with no checkout at all has a third option: the **AI edit** workflow runs the pinned Prettier on the files a request touched, so that output does not have to be prettier-safe by hand. [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md) is its contract. It is not a general repair path and it does not replace either of the two above.

## Configuration

The configuration is `.prettierrc.json`: 100-column lines, double quotes, trailing commas everywhere, and `proseWrap: preserve`. `.prettierignore` covers `node_modules`, `dist`, `coverage`, `package-lock.json`, and `.ai`.

Changing any of those, or the pinned Prettier version, is its own pull request. Apply the resulting reformat separately or in the same mechanical-only pull request, never alongside behavior.

## Two traps worth knowing

Prettier formats fenced code blocks inside Markdown for languages it understands, so a `ts`, `js`, or `json` sample in a document is held to the same 100-column, double-quote, trailing-comma rules as source. A sample that does not parse fails `format:check`.

Hand-padded Markdown tables are the repeated cause of `format:check` failures on `docs/SESSION-STATUS.md`. That file states things in prose for exactly this reason.
