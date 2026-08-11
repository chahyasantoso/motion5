# Motion5 recovery handoff

This file is the restart point for any human or AI session. Read it before changing runtime code.

## Mission

Restore motion5 by adapting the working behavior of the oracle repository, `chahyasantoso/motionpath`, while preserving motion5's graph ownership and TypeScript boundaries. Do not treat a green test suite as proof unless the test exercises the real behavior at the boundary.

## Single source of truth

The live checklist is [`progress/STATUS.md`](progress/STATUS.md). It owns every slice's status, branch, related files, commit links, evidence links, and next action. Read it first and update it first. `WAVE-PLAN.md` is the detailed plan, `progress/<slice>.md` files are optional evidence logs, and neither is a second status system.

## Current baseline

- Repository: `chahyasantoso/motion5`
- Main baseline reviewed: commit `1d59c087231c3c3f9c3cde6822d34835ee94705a`
- Oracle: `chahyasantoso/motionpath`
- Oracle revision inspected for this handoff: `1bc8d044347fa3b1732e6dad3bc8437ad23e2687`
- Rescue branch to create locally: `rescue/restore-motionpath-parity`

## Rules

Freeze feature work on `main`. Create the rescue branch once, then one short-lived fix branch from the latest rescue tip for each slice. Merge each slice back into rescue only after failing-first evidence, implementation, and CI evidence exist. Merge rescue into `main` once, after all wave gates pass.

At session start: read this file and [`progress/STATUS.md`](progress/STATUS.md), inspect current branches and CI artifacts, then pick one slice. At session end: update the status table with the commit and evidence links. Never mark a slice done from code inspection or generic green tests.

## Baseline verdict

A1 and A2 are implemented on main but must be verified on rescue. Remaining gaps are GSAP final-stop compilation, unused plugin contribution, subscriber-triggered reentrancy, React resubscription/hooks/public exports, hardcoded and weak boundary scanning, missing required build, missing honest end-to-end proof, and missing mutation baseline.

DOM `clear()` matches the oracle's cache-teardown behavior; the real DOM gaps are plugin metadata filtering, output serialization, and explicit clear coverage.

## Manual audit reality

There is currently **no** `.github/workflows/recovery-audit.yml`. It is a planned Wave 0 task, not an existing command. When implemented, it must accept a ref via `workflow_dispatch`, run real contract tests, mutation testing, acceptance mapping, failing-first replay, declaration build, public-import smoke tests, boundary checks, and the end-to-end fixture, then upload durable artifacts. Run it on frozen main first and record the result in the W0 row of [`progress/STATUS.md`](progress/STATUS.md).

Manual audit measures expensive evidence; it does not replace required PR checks. After recovery, format, typecheck, real contract tests, boundaries, build, and end-to-end checks must block merges. Mutation testing may remain manual or nightly.
