# Formatting

Prettier is the only style authority. There is no debate surface: no per-file overrides, no style rules in review, no lint plugin that duplicates Prettier's opinions.

## Configuration

`.prettierrc.json` at the repository root, applied to everything not listed in `.prettierignore`. Changing the configuration is a standalone pull request that contains the configuration change and the resulting reformat, and nothing else.

## Local

```bash
npm run format        # write
npm run format:check  # verify
```

Run `npm run format` before pushing. Editor format-on-save with the Prettier extension is recommended and is equivalent.

## In CI

The `quality` job runs `format:check`. It fails with the exact command to fix it. It does not write to your branch.

## The manual workflow

`.github/workflows/format.yml` is dispatched by hand, never on push, never on pull request, never on a schedule.

Two modes:

- **pull-request** (default) - applies Prettier and opens a separate pull request titled `chore: apply prettier` against the ref you dispatched from. Nothing is pushed to your branch.
- **report** - applies Prettier, prints the diff, fails if there is drift, writes nothing anywhere.

To run it: Actions, then **Format (manual)**, then **Run workflow**, pick the branch and the mode.

Because the workflow commits with the default Actions token, checks do not run automatically on the pull request it opens. Push an empty commit, or close and reopen it, to trigger CI before merging.

## Why manual

An automatic formatter that pushes to contributor branches does three bad things. It rewrites history under someone who is mid-rebase. It mixes mechanical changes into behavior commits, which destroys the whitespace-insensitive diff that reviewers rely on to catch a real change hiding inside a reformat. And it needs write permission on every pull request run, including from forks, which is a permission this repository does not want to hold.

A manual dispatch keeps the convenience of a one-click reformat for the rare bulk case, such as a Prettier version bump, and keeps the everyday path boring: format locally, commit, done.

## Rule

Formatting never shares a commit with behavior. If a review comment is about whitespace, the answer is `npm run format`, not a discussion.
