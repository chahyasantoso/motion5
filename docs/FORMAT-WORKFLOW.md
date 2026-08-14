# Formatting and CI evidence workflow

This repository has two formatting paths. The normal PR check is read-only; the repair bot is allowed to create a separate formatting PR. Neither path silently rewrites an implementation branch.

## What runs on a pull request

`.github/workflows/format.yml` checks the exact pull request head with `npm run format:check`. It does not run `prettier --write`, commit, or push. This matters because pushes made with `GITHUB_TOKEN` do not trigger another workflow run, which can otherwise leave a newly formatted head with no checks attached.

`.github/workflows/format-repair.yml` runs on same-repository pull requests through `pull_request_target`. It checks out the exact head SHA, installs with lifecycle scripts disabled, runs `npm run format`, and stops if there is no drift. If formatting changes are needed, it force-rebuilds a bot-owned branch named `chore/format-pr-<number>` and opens or updates a formatting-only PR targeting the **source implementation branch**.

Fork pull requests are excluded from the repair bot because it has write permission. Their read-only format check still runs.

## What the implementor does

The implementor should treat formatting as part of the implementation workflow:

1. Make the smallest behavior change and add failing-first evidence.
2. Push the test-only commit and record the red assertion-level CI run.
3. Push the implementation and wait for the required checks.
4. If the format check fails, wait for the bot's formatting-only PR, review it as mechanical-only, and merge it into the source implementation branch.
5. Wait for the source PR checks to rerun on the updated head. Do not merge the behavior PR until format, quality, integration, and boundaries are green.
6. Record the red run, green run, formatter repair PR if one existed, and final head in `progress/STATUS.md` and the slice note.

The repair PR is **not auto-merged**. Manual merge keeps formatting changes visible and prevents a bot from changing implementation code without review. If a formatter PR contains behavior changes, close it and fix the formatter or source manually; never merge it as a behavior shortcut.

## CI log archive

`.github/workflows/archive-ci-logs.yml` listens for completed `CI` and `Recovery audit` workflows. Failed runs are archived on the separate `ci-logs` branch under `logs/<run-id>/`:

- `README.md`: workflow, conclusion, source run URL, and capture time;
- `run.json`: machine-readable run metadata;
- `run.log`: combined run output;
- `jobs.json`: job metadata.

The archive branch is evidence storage, not a source branch. Do not develop from it, merge it, or treat an archived log as a fresh CI result. Use the source run URL in the PR or status note, then use `ci-logs` when the GitHub UI does not expose enough failure detail.

A zero-check head can mean the formatter bot moved a branch with `GITHUB_TOKEN` in historical runs. For current workflow behavior, a branch head must be checked by the read-only format job; if it has no checks, verify the workflow event and commit SHA before calling it green.
