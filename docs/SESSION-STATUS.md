# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces it and the byte ceiling.

- **Captured:** 2026-09-11, Asia/Jakarta.
- **Inspected main:** `07bfdf72efddc1812637a7622a0cd229e3140d70`, after the adapter-owned write state [#360](https://github.com/chahyasantoso/motion5/pull/360). Exact CI and operation evidence belong to their PRs.
- **Phase:** live editing of a loaded project. Shared scroll-source lifecycle and walking bootstrap fixes [#353](https://github.com/chahyasantoso/motion5/pull/353) are merged. The IK rest-to-reach implementation in [#351](https://github.com/chahyasantoso/motion5/pull/351) integrates that shared fix, retains both producer test sets, and uses authored FK weights with staged domain intent. Exact-head CI and merge evidence belong to the PRs. Temporary browser workflows are retired; additional manual/target-drag checks are owner-waived, not passed, as recorded in [SCROLL-BROWSER-SMOKE.md](./SCROLL-BROWSER-SMOKE.md). [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md) owns caller cost; [GUARDRAILS.md](./GUARDRAILS.md) owns standing constraints.

## Now

- **React DOM binding landed:** [#358](https://github.com/chahyasantoso/motion5/pull/358) and [#360](https://github.com/chahyasantoso/motion5/pull/360) are merged: `useDomPatch` binds one node to one DOM or SVG target through `createDomPatchAdapter`, `ProjectHandle.renderMetadata` answers the serializer channel a renderer needs, the three one-to-one `<g transform>` consumers are migrated, and the adapter owns its composed transform state and the newest revision it accepted per target and node. The choke point is deliberately partial: derived geometry, projections, and diagnostics stay on `usePatch`. See ADR-073 and ADR-074.
- **Runtime consistency landed:** [#343](https://github.com/chahyasantoso/motion5/pull/343) is merged: accepted trigger/stagger edits retain the installed definition before completion, and same-ID lifetime recreation is refused atomically. Its generic-arrow rewrite avoids the formatting symptom but does not repair the AI-edit formatter.
- **Just landed and exercised:** cleanup reporting [#336](https://github.com/chahyasantoso/motion5/pull/336) and maintenance inventory [#337](https://github.com/chahyasantoso/motion5/pull/337) are merged. With the reviewed runner activated, [#338](https://github.com/chahyasantoso/motion5/pull/338) verified live preview/validation, preserved cleanup summaries, unchanged targets, and exact-head CI; its intentional stale request also exposed missing preparation-failure diagnostics. Inventory completion does not activate maintenance or retire workflows.

## Next in line

- **Unmerged derived DOM binding:** [#361](https://github.com/chahyasantoso/motion5/pull/361) closes [#359](https://github.com/chahyasantoso/motion5/issues/359) by adding `useDerivedDomPatch`, an `applyValues` entry and an attribute channel on the DOM adapter, and a view-box transform pin, then migrating every derived-geometry and projection consumer in both demos, so only the diagnostic panels render on a tick. Review, exact-head CI, and merge remain gates; no landed fix is claimed.
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
