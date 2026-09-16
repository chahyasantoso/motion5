# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-16, Asia/Jakarta.
- **Inspected main:** `d7d68f26b358b8343a69db55c283f6f3774b71a6`, after [#390](https://github.com/chahyasantoso/motion5/pull/390). Exact CI and operation evidence belong to their PRs.

## Now

- **The runtime publication seam is the live area, and its three slices have landed:** [#375](https://github.com/chahyasantoso/motion5/pull/375), [#386](https://github.com/chahyasantoso/motion5/pull/386) and [#390](https://github.com/chahyasantoso/motion5/pull/390) are merged, so `flush(seeds)` cannot reach the clock's frame number, `flushAtTick(seeds, tick)` owns that transition as a required parameter, `GraphRuntime` holds its lifecycle and its snapshot memo as one branded discriminated value each, and a deferred publication carries the frame it arrived with while a drain booking is cancelled by the publication that consumes it. ADR-082, ADR-083 and ADR-084. Slice narrative, exact-head CI and measured byte sizes belong to those three PRs.

## Next in line

- **The quality-pass remainder over #375 and #386 is open and unimplemented:** [#377](https://github.com/chahyasantoso/motion5/issues/377) and [#378](https://github.com/chahyasantoso/motion5/issues/378) are runtime defects, a `Scheduler` port that never says a job runs later and a `#flushSeeds` that loses drained seeds when snapshot derivation throws; [#383](https://github.com/chahyasantoso/motion5/issues/383) is a diagnostic naming a scheduler it may not have and an operation this tier retired; [#379](https://github.com/chahyasantoso/motion5/issues/379), [#381](https://github.com/chahyasantoso/motion5/issues/381) and [#385](https://github.com/chahyasantoso/motion5/issues/385) are test-quality findings over a lexical ownership proof, twenty retargeted publication spies and a stale explanatory comment. No implementation is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
