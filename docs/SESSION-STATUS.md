# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces it and the byte ceiling.

- **Captured:** 2026-09-06, Asia/Jakarta.
- **Inspected main:** `aee1a712f054e4c53106567a2e3b6cf4e4f42f88`, after rollout [#332](https://github.com/chahyasantoso/motion5/pull/332). Exact CI and operation evidence belong to their PRs.
- **Phase:** live editing of a loaded project. Infrastructure work below does not add runtime behavior. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) owns caller cost; [GUARDRAILS.md](./GUARDRAILS.md) owns standing constraints.

## Now

- **Just landed:** issue #328 slices 1 through 3 were rolled into main through [#332](https://github.com/chahyasantoso/motion5/pull/332): snapshot preconditions, isolated candidate preparation, trusted publication/reporting, and one full-suite execution with preserved CI evidence contexts. Rollout and full activation verification are separate.
- **Landed before it:** source-evidence syntax correctness, issue #317, [#327](https://github.com/chahyasantoso/motion5/pull/327). Earlier direct-write and teardown changes remain in the runtime; their PRs own the exact guarantees.

## Next in line

- **Slice 4 is on its own unmerged PR:** [#333](https://github.com/chahyasantoso/motion5/pull/333), bounded formatted previews, allowlisted targeted validation, honest verification, and capability navigation. The existing apply route has produced a real request receipt and follow-on CI during this PR. New preview/validation activation still requires review, a reviewed runner-pin update, and live exercises. This file does not claim they are active.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and slice 5 maintenance inventory and retirement prerequisites. Dependency maintenance remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
