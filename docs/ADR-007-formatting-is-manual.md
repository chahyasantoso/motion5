# ADR-007: Formatting is manual

**Status:** Superseded by [ADR-019](./ADR-019-automatic-prettier-write-back.md), 2026-08-10

**Context.** Automatic formatting first rejected: can rewrite branches during rebases, contaminate review diffs, need write permissions on untrusted pull requests.

**Decision.** Manual-only policy superseded for same-repository pull requests. Formatter runs automatically on pull request open, synchronize and reopen events; commits mechanical changes back to exact source branch. Fork pull requests remain check-only: source code untrusted, token cannot safely receive branch-write access.

**Consequences.** Same-repository contributors get automatic formatting; fork contributors retain safer format-check gate. Workflow must use concurrency cancellation and mechanical-only commit message. Reverting policy requires restoring manual-only behavior in workflow and docs.
