# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-16, Asia/Jakarta.
- **Inspected main:** `ab9d3df56c60570c6629f60d6a4bc08360171327`, after [#399](https://github.com/chahyasantoso/motion5/pull/399). Exact CI and operation evidence belong to their PRs.

## Now

- **The runtime publication seam is the live area, and the second quality pass over it is landing on one base:** the first pass is merged whole ([#375](https://github.com/chahyasantoso/motion5/pull/375), [#386](https://github.com/chahyasantoso/motion5/pull/386), [#390](https://github.com/chahyasantoso/motion5/pull/390), [#398](https://github.com/chahyasantoso/motion5/pull/398), [#399](https://github.com/chahyasantoso/motion5/pull/399)), and this slice is the base of the second: the deferred payload is one closed branded union instead of an interface whose two halves could disagree, so nothing pending carries no collection to share, a deferral that carries only a frame is work a drain replays, a publication retains a frame it cannot reach, and a failed one re-queues onto a live runtime only; and building a diagnostic and handing it to the host has one owner with one boundary, so a host that throws cannot reroute a runtime failure and a retired runtime reports nothing new. Closes [#392](https://github.com/chahyasantoso/motion5/issues/392), [#393](https://github.com/chahyasantoso/motion5/issues/393), [#396](https://github.com/chahyasantoso/motion5/issues/396), [#400](https://github.com/chahyasantoso/motion5/issues/400) and [#401](https://github.com/chahyasantoso/motion5/issues/401); [#391](https://github.com/chahyasantoso/motion5/issues/391) was confirmed already fixed by #398 and closed rather than implemented. ADR-088. Slice narrative, exact-head CI and measured byte sizes belong to the PRs.

## Next in line

- **The rest of the second pass is stacked on that base and unmerged:** [#402](https://github.com/chahyasantoso/motion5/issues/402) and [#394](https://github.com/chahyasantoso/motion5/issues/394) make `deferredScheduler` fail closed for a job it has already refused, so a port that swallows the refusal cannot be answered with a handle and a callback it retained cannot drain later; [#395](https://github.com/chahyasantoso/motion5/issues/395) pins the frame a publisher failure deliberately does not carry; [#404](https://github.com/chahyasantoso/motion5/issues/404) narrows the publication spy to what a seed list can prove and types it to the member it watches; [#403](https://github.com/chahyasantoso/motion5/issues/403) makes this file's own gate total and reads the phase label rather than one spelling of it. `graph-runtime.ts` stays under the 30,000 bytes that oblige `x.ts` beside `x.md` and the base slice moves it further under, so none of these owes `graph-runtime.md`, per [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md). No implementation is claimed for any of them.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
