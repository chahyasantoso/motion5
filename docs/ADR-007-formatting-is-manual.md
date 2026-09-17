# ADR-007: Formatting is manual

**Status:** Superseded by [ADR-019](./ADR-019-automatic-prettier-write-back.md), 2026-08-10

**Context.** Automatic formatting was initially rejected because it can rewrite branches during rebases, contaminate review diffs, and require write permissions on untrusted pull requests.

**Decision.** The original manual-only policy is superseded for same-repository pull requests. The formatter now runs automatically on pull request open, synchronize, and reopen events and commits mechanical changes back to the exact source branch. Fork pull requests remain check-only because their source code is untrusted and their token cannot safely receive branch-write access.

**Consequences.** Same-repository contributors get automatic formatting, while fork contributors retain the safer format-check gate. The workflow must use concurrency cancellation and a mechanical-only commit message. Reverting this policy requires restoring manual-only behavior in the workflow and docs.
