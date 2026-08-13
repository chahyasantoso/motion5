# Motion5 recovery handoff

This file is the restart point for any human or AI session. Read it before changing runtime code.

## Mission

Restore motion5 by adapting the working behavior of the oracle repository, `chahyasantoso/motionpath`, while preserving motion5's graph ownership and TypeScript boundaries. Do not treat a green test suite as proof unless the test exercises the real behavior at the boundary.

## Single source of truth

The live checklist is [`progress/STATUS.md`](progress/STATUS.md). It owns every slice's status, branch, related files, commit links, evidence links, and next action. Read it first and update it first. `WAVE-PLAN.md` is the detailed plan, `progress/<slice>.md` files are optional evidence logs, and neither is a second status system.

## Current baseline

- Repository: `chahyasantoso/motion5`
- Oracle: `chahyasantoso/motionpath`
- Current rescue branch: `rescue/restore-motionpath-parity`
- Archive branch for failed CI and recovery-audit logs: `ci-logs`

## Rules

Freeze feature work on `main`. Create one short-lived fix branch from the latest rescue tip for each slice. Merge each slice back into rescue only after failing-first evidence, implementation, and CI evidence exist. Merge rescue into `main` once all wave gates pass.

At session start: read this file and [`progress/STATUS.md`](progress/STATUS.md), inspect current branches and CI artifacts, then pick one slice. At session end: update the status table with the commit and evidence links. Never mark a slice done from code inspection or generic green tests.

## Implementor workflow

The implementor works through GitHub MCP, so it cannot assume a persistent local checkout. Use the repository workflows as the enforcement layer:

1. Push the test-only failing-first commit.
2. Wait for the red CI run and record the assertion-level failures.
3. Push the smallest implementation commit.
4. Wait for the green required checks on the exact head SHA.
5. If formatting drift is found, a separate bot PR named `chore/format-pr-<number>` may be opened against the implementation branch. Review and merge it manually; it is never auto-merged and never writes to the implementation branch.
6. Wait for the source PR checks to rerun after the formatter PR merge.
7. Record source run URLs and, when needed, durable logs from `ci-logs/logs/<run-id>/`.

Normal CI has read-only permissions. The repair bot is the only workflow with write permissions, and only for its own formatting branch and PR. Fork PRs are excluded from repair automation.

## Manual audit reality

There is currently **no** `.github/workflows/recovery-audit.yml`. It is a planned Wave 0 task, not an existing command. When implemented, it must accept a ref via `workflow_dispatch`, run real contract tests, mutation testing, acceptance mapping, failing-first replay, declaration build, public-import smoke tests, boundary checks, and the end-to-end fixture, then upload durable artifacts. Run it on frozen main first and record the result in the W0 row of [`progress/STATUS.md`](progress/STATUS.md).

Manual audit measures expensive evidence; it does not replace required PR checks. After recovery, format, typecheck, real contract tests, boundaries, build, and end-to-end checks must block merges. Mutation testing may remain manual or nightly.
