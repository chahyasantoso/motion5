# Formatting workflow

Prettier is the only formatting authority. It is a mechanical tool, not a code-review topic.

## Local commands

```bash
npm run format        # write changes
npm run format:check  # verify without writing
```

Run the formatter before pushing. The resulting formatting commit must not contain behavior, type, or documentation decisions.

## Automatic CI behavior

The quality job runs `npm run format:check`. It never writes to the branch. A failure tells the contributor to run `npm run format` locally.

## Manual workflow

`.github/workflows/format.yml` is manual dispatch only. It has two modes:

- **pull-request:** formats the selected ref, creates a branch, and opens `chore: apply prettier`.
- **report:** prints the diff and fails without pushing.

It must never run on push, pull request, or schedule. The workflow has write permission only because manual dispatch is an explicit operator action. Formatting PRs should be reopened or otherwise retriggered before merge if token-authored PR checks do not start automatically.

## Configuration changes

Changing `.prettierrc.json`, `.prettierignore`, or the Prettier version is its own PR. Apply the resulting reformat separately or in the same mechanical-only PR, never alongside behavior.

## Why not auto-push

Automatic writes can rewrite a branch during rebase, contaminate review diffs, and require write permissions on untrusted pull requests and forks. Manual formatting keeps convenience without making branch mutation part of normal CI.
