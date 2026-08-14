# P2 runtime smell audit

Source: [`CODE-REVIEW-POST-E3.md`](./CODE-REVIEW-POST-E3.md), section **P2 · Code smells worth fixing while in here**. Sequencing follows [`PHASE-3-4-RECOVERY-PLAN.md`](./PHASE-3-4-RECOVERY-PLAN.md), Phase 2/3 hardening; slice rules follow [`IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md).

## Closed by PR 94

| Review smell | Evidence |
| --- | --- |
| Last-known-good values lost on error/blocked publication | `p2-runtime-smells.test.ts`, registry retention implementation |
| Dead source revision metadata | consumed upstream revisions asserted in `p2-runtime-smells.test.ts` |
| Stale publisher snapshot index | committed publisher-node cache rebuilds `nodeById` from the same nodes |
| Full compose closure rebuilt every flush | publisher nodes are cached per committed `GraphNode` identity |
| Missing upstream silently skipped | `observation-missing-upstream` regression |
| Blocked diagnostic depends on authored edge order | canonical `edgeKey` regression |
| Qualified IDs duplicated in engine | engine uses `qualifyMotionTrack` and `qualifyFreeTrack` |
| Track disposal can repeat or resurrect resources | terminal Track guard and exactly-once kill regression |
| Renderer host objects leak into composition | `Date` host-object regression at the Track boundary |
| Motion treats clock delta as normalized progress | authored-duration normalization regression |
| Motion pause/play leaks subscriptions | pause detaches and play resubscribes regression |
| Freeze repeated inside plugin loop | composition freezes once after the final plugin |

## Explicitly not claimed closed

- Per-file mutation score and baseline still require the governed Stryker run on the completed implementation head.
- Full graph allocation benchmarking beyond compose-node reuse remains performance evidence, not a correctness claim.
- `Motion` remains an internal domain primitive; ProjectRuntime is still the production lifecycle owner. Wiring Motion into ProjectRuntime is intentionally not claimed by this PR.

## Exit rule

PR 94 is complete only after the full required matrix is green, the governed mutation report prints a real score above its threshold, and every deferred item above has a linked follow-up decision rather than an implied closure.
