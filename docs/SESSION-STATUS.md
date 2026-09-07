# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces it and the byte ceiling.

- **Captured:** 2026-09-07, Asia/Jakarta.
- **Inspected main:** `d60892834fd8cfaab0974babbe5741949b50fa1f`, after slice 4 [#333](https://github.com/chahyasantoso/motion5/pull/333). Exact CI and operation evidence belong to their PRs.
- **Phase:** live editing of a loaded project. Infrastructure work below does not add runtime behavior. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) owns caller cost; [GUARDRAILS.md](./GUARDRAILS.md) owns standing constraints.

## Now

- **Just landed:** issue #328 slice 4, [#333](https://github.com/chahyasantoso/motion5/pull/333), adds bounded formatted preview and targeted validation. [#334](https://github.com/chahyasantoso/motion5/pull/334) records live preview/validation happy paths and successful follow-on CI, but also the cleanup summary overwrite tracked in [#335](https://github.com/chahyasantoso/motion5/issues/335). This does not complete the broader activation matrix.
- **Landed before it:** slices 1 through 3 via [#332](https://github.com/chahyasantoso/motion5/pull/332): snapshot protections, isolated preparation, trusted outcomes, and one full-suite execution with preserved CI evidence. Runtime behavior is unchanged by these infrastructure slices.

## Next in line

- **Cleanup-summary fix is unmerged:** [#336](https://github.com/chahyasantoso/motion5/pull/336) adds verified cleanup-only reporting and its regressions. Review, runner-pin rollout, and live replay remain separate gates; no deployed fix is claimed. Slice 5 follows as a separate maintenance inventory/documentation PR, not speculative workflow removal.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and slice 5 maintenance inventory and retirement prerequisites. Dependency maintenance remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
