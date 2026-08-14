# Motion5 recovery handoff

This file is the restart point for any human or AI session. Read it before changing runtime code.

## Mission

Restore motion5 by adapting the working behavior of the oracle repository, `chahyasantoso/motionpath`, while preserving motion5's graph ownership and TypeScript boundaries. Do not treat a green test suite as proof unless the test exercises the real behavior at the boundary.

## Single source of truth

The live checklist is [`progress/STATUS.md`](progress/STATUS.md). It owns every slice's status, branch, related files, commit links, evidence links, and next action. `WAVE-PLAN.md` is the detailed plan, `progress/<slice>.md` files are optional evidence logs, and neither is a second status system.

## Current baseline

- Repository: `chahyasantoso/motion5`
- Oracle: `chahyasantoso/motionpath`
- Current rescue branch: `rescue/restore-motionpath-parity`
- No active slice branch after PR 95 merged
- Archive branch for failed CI and recovery-audit logs: `ci-logs`
- Latest recovery audit: [31765798822](https://github.com/chahyasantoso/motion5/actions/runs/31765798822)
- Latest rescue merge: [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b)

## Rules

Freeze feature work on `main`. Create one short-lived fix branch from the latest rescue tip for each slice. Merge each slice back into rescue only after failing-first evidence, implementation, and CI evidence exist. Merge rescue into `main` once all wave gates pass.

At session start: read this file and [`progress/STATUS.md`](progress/STATUS.md), inspect current branches and CI artifacts, then pick one slice. At session end: update the status table with the commit and evidence links. Never mark a slice done from code inspection or generic green tests.

## Implementor workflow

The implementor works through GitHub MCP, so it cannot assume a persistent local checkout. Use repository workflows as the enforcement layer:

1. Push the test-only failing-first commit.
2. Wait for the red CI run and record the assertion-level failures.
3. Push the smallest implementation commit.
4. Wait for the green required checks on the exact head SHA.
5. If formatting drift is found, treat the formatter child commit as behavior-neutral but record its SHA.
6. Run the manual recovery audit against the final head when the audit is part of the slice exit.
7. Record source run URLs and durable logs from `ci-logs/logs/<run-id>/` when needed.

## Manual audit reality

`.github/workflows/recovery-audit.yml` is implemented and dispatched through `workflow_dispatch`. Audit [31765798822](https://github.com/chahyasantoso/motion5/actions/runs/31765798822) passed all five jobs against `a920613bfd4fa0cc8c38154b1ad84ba416bc791d`. The final formatter child `d4428d10368554e8a53e7b38eaf2a1a1b246435d` passed the required PR matrix, and PR 95 merged into rescue as `e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b`.

Manual audit measures expensive evidence; it does not replace required PR checks. After recovery, format, typecheck, contract tests, boundaries, build, and end-to-end checks must block merges. Mutation testing may remain manual or nightly, but its report is never ignored.

## Next decision

Motion and trigger lifecycle APIs remain an explicit design decision. Either wire them through the existing `ProjectRuntime.seek` and scheduler path without adding a clock, or remove the dead APIs and update the brief. Do not claim parity while leaving both half-wired.
