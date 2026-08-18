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

## The write-enabled repair

The `format` job in the same workflow runs `prettier --write` and pushes a `chore: apply prettier` child commit to the pull request branch. It is constrained on purpose:

- pull requests only, and only when the head repository is this repository;
- after `quality`, `integration`, `boundaries`, `build`, and `end-to-end` are all green, so nothing mechanical lands on top of a red behavioral run;
- it needs `PERSONAL_ACCESS_TOKEN`. Without it the job prints the diff and fails rather than pushing with `GITHUB_TOKEN`, because a push made with that token triggers no new workflow run and would leave the new head with no checks attached.

Review that commit as mechanical-only and let it merge with your pull request. If it ever contains something that is not formatting, treat that as a bug in the formatter or in the source, never as a shortcut for a behavior change.

## Manual runs

`.github/workflows/format-manual.yml` is dispatched against a branch and takes a `mode`:

- `direct-commit` commits the reformat straight to the branch;
- `pull-request` opens a formatting-only pull request from `chore/format-<run-id>`;
- `report` prints the diff and fails, changing nothing.

`.github/workflows/format.yml` is the older manual fallback. It formats a named branch and needs `PERSONAL_ACCESS_TOKEN` to push. Prefer `format-manual.yml`.

## Configuration

The configuration is `.prettierrc.json`: 100-column lines, double quotes, trailing commas everywhere, and `proseWrap: preserve`. `.prettierignore` covers `node_modules`, `dist`, `coverage`, and `package-lock.json`.

Changing any of those, or the pinned Prettier version, is its own pull request. Apply the resulting reformat separately or in the same mechanical-only pull request, never alongside behavior.

## Two traps worth knowing

Prettier formats fenced code blocks inside Markdown for languages it understands, so a `ts`, `js`, or `json` sample in a document is held to the same 100-column, double-quote, trailing-comma rules as source. A sample that does not parse fails `format:check`.

Hand-padded Markdown tables are the repeated cause of `format:check` failures on `docs/SESSION-STATUS.md`. That file states things in prose for exactly this reason.
