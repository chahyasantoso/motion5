# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces it and the byte ceiling.

- **Captured:** 2026-09-07, Asia/Jakarta.
- **Inspected main:** `34da0d33309f2cb3d599b5d0aca32413e76d4a07`, after runtime consistency [#343](https://github.com/chahyasantoso/motion5/pull/343). Exact CI and operation evidence belong to their PRs.
- **Phase:** live editing of a loaded project. Infrastructure work below does not add runtime behavior. [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) owns caller cost; [GUARDRAILS.md](./GUARDRAILS.md) owns standing constraints.

## Now

- **Runtime consistency landed:** [#343](https://github.com/chahyasantoso/motion5/pull/343) is merged: accepted trigger/stagger edits retain the installed definition before completion, and same-ID lifetime recreation is refused atomically. Its generic-arrow rewrite avoids the formatting symptom but does not repair the AI-edit formatter.
- **Just landed and exercised:** cleanup reporting [#336](https://github.com/chahyasantoso/motion5/pull/336) and maintenance inventory [#337](https://github.com/chahyasantoso/motion5/pull/337) are merged. With the reviewed runner activated, [#338](https://github.com/chahyasantoso/motion5/pull/338) verified live preview/validation, preserved cleanup summaries, unchanged targets, and exact-head CI; its intentional stale request also exposed missing preparation-failure diagnostics. Inventory completion does not activate maintenance or retire workflows.
- **Landed before it:** slices 1 through 3 via [#332](https://github.com/chahyasantoso/motion5/pull/332): snapshot protections, isolated preparation, trusted outcomes, and one full-suite execution with preserved CI evidence. Runtime behavior is unchanged by these infrastructure slices.

## Next in line

- **IK playground rest-pose refactor:** [#351](https://github.com/chahyasantoso/motion5/pull/351) addresses [#350](https://github.com/chahyasantoso/motion5/issues/350) through the existing GSAP scroll source, trigger factory and Motion progress, with authored per-member FK weight stops and separate pending intent. Adapter startup/refresh/lifetime handling and regression coverage are under review; exact-head CI and real-browser interaction verification remain gates. No merge or plugin API change is claimed.

- **Unmerged formatter parity:** [#345](https://github.com/chahyasantoso/motion5/pull/345) addresses [#344](https://github.com/chahyasantoso/motion5/issues/344) by preserving filepath context in AI-edit formatting and validation, with real CLI regressions for `.ts` and `.tsx`. Review, merge, a reviewed runner-pin update and live parity exercises remain gates; no activated correction is claimed.
- **Unmerged reporting completion:** [#339](https://github.com/chahyasantoso/motion5/pull/339) consolidates failed-preparation diagnostics, retry/recovery retention, legacy evidence completion, and useful error excerpts. Its regression and exact-SHA CI evidence belong to the PR. Review, a single runner-pin rollout, and live failure/correction/replay verification remain gates; no deployed diagnostics fix is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
