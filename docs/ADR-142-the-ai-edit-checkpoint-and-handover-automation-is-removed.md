# ADR-142: The AI edit, checkpoint and handover automation is removed

**Status:** Accepted, 2026-10-23

## Context

Repository accumulated automation tooling for AI edits, checkpoint transport, handover bundles:

- Shell hooks, `zip`/`unzip`, symlinks, shebang stubs need POSIX environments, fail on Windows.
- 267 tests across 15 files in `packages/core/test/unit/scripts/` test automation machinery, not runtime behavior.
- Workflows `.github/workflows/ai-checkpoint.yml`, `ai-edit.yml`, `archive-ci-logs.yml` add maintenance overhead.
- Going forward, development uses plain Git branches + standard pull requests.

## Decision

Remove all AI edit, checkpoint, handover automation tooling:

1. Delete automation scripts under `scripts/` (`apply-ai-edit.mjs`, `automation-*.mjs`, `checkpoint-*.mjs`, `handover*.mjs`).
2. Delete corresponding tests + fixtures in `packages/core/test/unit/scripts/`.
3. Delete `.ai/` edit store, `.github/workflows/` automation workflows, handover docs.
4. Replace automation instructions in `AGENTS.md` + docs with plain Git and pull request workflow.
5. Mark ADRs 100, 101, 102, 104, 112, and 119 as superseded.

## Alternatives rejected

- Supporting cross-platform scripts on Windows: spends maintenance budget on tooling plain Git replaces.
- Retaining tests with conditional skips: leaves dead code + slow test suites in repository.

## Consequences

- 267 automation tests removed. Total repository test count reduced accordingly.
- Test suite + development workflow run cross-platform without POSIX toolchain prerequisites.
- Plain Git branches + PRs targeting `main` remain single contribution path.
