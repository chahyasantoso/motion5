# Formatting workflow

Prettier is the only formatting authority. It is a mechanical tool, not a code-review topic.

## Local commands

```bash
npm run format        # write changes
npm run format:check  # verify without writing
```

Run the formatter before pushing when possible. The resulting formatting commit must not contain behavior, type, or documentation decisions.

## Automatic CI behavior

The `Format` workflow runs automatically when a pull request is opened, synchronized, or reopened. For pull requests whose source branch belongs to this repository, it runs `npm run format` and commits any changes back to the exact branch that triggered the pull request with `chore: apply prettier`.

Fork pull requests are deliberately excluded from write-back. Their token is not granted branch-write access, and the normal quality job's `format:check` remains the gate. This avoids executing untrusted fork code with a write-capable token.

The workflow can still be run manually for direct commits, separate formatting PRs, or reporting drift.

## Why automatic write-back is restricted

The old workflow was manual because automatic writes can rewrite a branch during rebase, contaminate review diffs, and require write permissions on untrusted pull requests and forks. The new policy accepts that tradeoff for same-repository branches because they are controlled by repository contributors; forks keep the safer check-only behavior.

## Configuration changes

Changing `.prettierrc.json`, `.prettierignore`, or the Prettier version is its own PR. Apply the resulting reformat separately or in the same mechanical-only PR, never alongside behavior.
