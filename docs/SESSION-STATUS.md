# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-16, Asia/Jakarta.
- **Inspected main:** `c7a5223252229244b08d3cf657991af8ef08a365`, after [#397](https://github.com/chahyasantoso/motion5/pull/397). Exact CI and operation evidence belong to their PRs.

## Now

- **The runtime publication seam is the live area, and the last of its defects are decided:** [#375](https://github.com/chahyasantoso/motion5/pull/375), [#386](https://github.com/chahyasantoso/motion5/pull/386) and [#390](https://github.com/chahyasantoso/motion5/pull/390) are merged, so `flush(seeds)` cannot reach the clock's frame number, `flushAtTick(seeds, tick)` owns that transition as a required parameter, `GraphRuntime` holds its lifecycle and its snapshot memo as one branded discriminated value each, and a deferred publication carries the frame it arrived with while a drain booking is cancelled by the publication that consumes it. This slice implements [#377](https://github.com/chahyasantoso/motion5/issues/377), [#378](https://github.com/chahyasantoso/motion5/issues/378) and [#383](https://github.com/chahyasantoso/motion5/issues/383) on top: the `Scheduler` port states that a job must not run before `schedule` returns and enforces it at that boundary, the publication boundary covers snapshot derivation so injected caller code cannot drop the drained seeds, and the deferral diagnostic names a publication rather than a retired verb and a scheduler that may not exist. ADR-082 through ADR-084 and ADR-086. Slice narrative, exact-head CI and measured byte sizes belong to those PRs.

## Next in line

- **The test-quality remainder over #375 is open and unimplemented:** [#379](https://github.com/chahyasantoso/motion5/issues/379) proves a behavioural publication-ownership claim with a whole-file string count, so it fails for legal changes and passes for the illegal one it was written to catch; [#381](https://github.com/chahyasantoso/motion5/issues/381) is twenty spies still named `invalidate` that now observe a scheduled drain as well as the write they are about, and assert a count rather than a call shape; [#385](https://github.com/chahyasantoso/motion5/issues/385) explains a disposal through a write path that has not existed for two ADRs. No implementation is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
