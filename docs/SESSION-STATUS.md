# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-16, Asia/Jakarta.
- **Inspected main:** `9299912524dd170ea245decfd7d2bafff84a046f`, after [#398](https://github.com/chahyasantoso/motion5/pull/398). Exact CI and operation evidence belong to their PRs.

## Now

- **The runtime publication seam is the live area, and every quality-pass finding over it is now decided:** [#375](https://github.com/chahyasantoso/motion5/pull/375), [#386](https://github.com/chahyasantoso/motion5/pull/386), [#390](https://github.com/chahyasantoso/motion5/pull/390) and [#398](https://github.com/chahyasantoso/motion5/pull/398) are merged and this slice closes the remainder, [#379](https://github.com/chahyasantoso/motion5/issues/379), [#381](https://github.com/chahyasantoso/motion5/issues/381) and [#385](https://github.com/chahyasantoso/motion5/issues/385): `flush(seeds)` cannot reach the clock's frame number and `flushAtTick(seeds, tick)` owns that transition, `GraphRuntime` holds its lifecycle and its snapshot memo as one branded value each, a deferred publication carries its whole payload and cancels the job it consumed, the `Scheduler` port states and enforces that a job defers, the publication boundary covers snapshot derivation, and the evidence over all of it now reads behaviour rather than file shape. ADR-082 through ADR-087. Slice narrative, exact-head CI and measured byte sizes belong to those PRs.

## Next in line

- **`graph-runtime.ts` owes a sister document before it grows again:** it stands at 29,698 bytes, 302 under the 30,000 that obliges `x.ts` beside `x.md`, and ADR-084 and ADR-086 spent the margin #376 measured. The next change to that file owes the split or the sister document in the same request, per [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md), which is a slice of its own rather than something to discover at a failed gate. No implementation is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
