# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-17, Asia/Jakarta.
- **Inspected main:** `dbd733b94a79816642bae9258abd5ea78d68d2ff`, after [#434](https://github.com/chahyasantoso/motion5/pull/434). Exact CI and operation evidence belong to their PRs.

## Now

- **The second quality pass over the runtime publication seam is landed whole, and this slice is its last finding and this rewrite:** every batch of [#426](https://github.com/chahyasantoso/motion5/issues/426) is on `main` -- per-call scheduler in-flight state ([#427](https://github.com/chahyasantoso/motion5/pull/427)), disposal as a phase rather than a flag ([#428](https://github.com/chahyasantoso/motion5/pull/428)), `graph-runtime.md` owning that source's private reasoning ([#429](https://github.com/chahyasantoso/motion5/pull/429)), the payload pair saying which frame a failed publication carries ([#430](https://github.com/chahyasantoso/motion5/pull/430)), retention split from delivery so a terminal runtime withholds rather than discards ([#431](https://github.com/chahyasantoso/motion5/pull/431)), the status gate stating its grammar and claiming only cardinality ([#432](https://github.com/chahyasantoso/motion5/pull/432)), no live prose claiming every drain publishes through `flush([])` ([#433](https://github.com/chahyasantoso/motion5/pull/433)), and the mutate list naming the modules that own the invariants ([#434](https://github.com/chahyasantoso/motion5/pull/434)); and this slice closes [#424](https://github.com/chahyasantoso/motion5/issues/424), the one finding no batch owned, by stating in `publication-spy.ts` that the call tuple is the contract and pinning that boundary with three compile-time cases rather than restoring the runtime guard #404 deleted. ADR-087 through ADR-091. Slice narrative, exact-head CI and byte sizes belong to the PRs.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) is owed and nothing else is queued:** the `mutate` list now names `graph-runtime-state.ts`, `diagnostic-report.ts` and `ports/scheduler.ts`, and no Stryker run is reported before or after that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- [Issue #411](https://github.com/chahyasantoso/motion5/issues/411) stays open on a recorded refusal rather than a fix: a drain replays at the frame it deferred, so the assertion it recommends cannot distinguish the two implementations it is about. `deferred-frame-loss.test.ts` says what each of its cases actually pins, and #417's unreached-frame case is the witness it asked for.
- [Issue #349](https://github.com/chahyasantoso/motion5/issues/349) holds the 2D IK/FK contract study that precedes any separate 3D plugin.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
