# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-16, Asia/Jakarta.
- **Inspected main:** `9299912524dd170ea245decfd7d2bafff84a046f`, after [#398](https://github.com/chahyasantoso/motion5/pull/398). Exact CI and operation evidence belong to their PRs.

## Now

- **The runtime publication seam is the live area, and the first quality pass over it is fully landed:** [#375](https://github.com/chahyasantoso/motion5/pull/375), [#386](https://github.com/chahyasantoso/motion5/pull/386), [#390](https://github.com/chahyasantoso/motion5/pull/390) and [#398](https://github.com/chahyasantoso/motion5/pull/398) are merged and this slice closes [#379](https://github.com/chahyasantoso/motion5/issues/379), [#381](https://github.com/chahyasantoso/motion5/issues/381) and [#385](https://github.com/chahyasantoso/motion5/issues/385), which is that pass end to end: `flush(seeds)` cannot reach the clock's frame number and `flushAtTick(seeds, tick)` owns that transition, `GraphRuntime` holds its lifecycle and its snapshot memo as one branded value each, a deferred publication carries its whole payload and cancels the job it consumed, the `Scheduler` port states and enforces that a job defers, the publication boundary covers snapshot derivation, and the evidence over all of it now reads behaviour rather than file shape. ADR-082 through ADR-087. A second pass over the same seam has since filed more findings, and **Next in line** owns those rather than this entry. Slice narrative, exact-head CI and measured byte sizes belong to those PRs.

## Next in line

- **The second quality pass over the same seam is open and unimplemented:** [#392](https://github.com/chahyasantoso/motion5/issues/392) stores a frame a reentrant `flushAtTick([], tick)` can never replay, because `isPending` reads only the seed set; [#393](https://github.com/chahyasantoso/motion5/issues/393) can report a scheduler failure after disposal has made the runtime terminal; [#394](https://github.com/chahyasantoso/motion5/issues/394) leaves a stale drain handle when a port runs its job inline, which [#398](https://github.com/chahyasantoso/motion5/pull/398) bounds without clearing; [#395](https://github.com/chahyasantoso/motion5/issues/395) owes the frame regression a publisher failure's deliberate loss should pin; [#396](https://github.com/chahyasantoso/motion5/issues/396) exposes a mutable `Set` through a `ReadonlySet` cast on the shared `NOTHING_PENDING`. [#391](https://github.com/chahyasantoso/motion5/issues/391) is the snapshot-failure loss #398 fixed and is open only because it was filed after that request was submitted; confirm and close it rather than implementing it. `graph-runtime.ts` also stands at 29,698 bytes, 302 under the 30,000 that obliges `x.ts` beside `x.md`, so whichever of these lands first owes `graph-runtime.md` in the same request, per [AI-EDIT-WORKFLOW.md](./AI-EDIT-WORKFLOW.md). No implementation is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
