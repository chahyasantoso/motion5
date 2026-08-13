# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

## Board

| ID    | Slice                                           | Status               |
| ----- | ----------------------------------------------- | -------------------- |
| W0    | Rescue loop and audit baseline                  | Done                 |
| A1    | Final-value memo consistency                    | Done, gate open      |
| A2    | Preserve subscriber errors                      | Done, gate open      |
| A3    | Guard subscriber-triggered reentrancy           | Done, gate open      |
| B1    | Prepare-stage plugin contribution               | Done                 |
| B2    | Real GSAP multi-stop compilation                | Done                 |
| C1    | React store resubscription                      | Done                 |
| C2    | React hook and public exports                   | Done, gate open      |
| C3    | DOM metadata, serialization, and clear coverage | Done, gate open      |
| D1    | Discover consumer packages                      | Done                 |
| D2    | Planted boundary self-test                      | Done                 |
| D3    | Acceptance evidence gates                       | Done                 |
| E1    | Required declaration build                      | Done, gate open      |
| E2    | Real end-to-end product path                    | Done                 |
| E3    | Mutation baseline and ratchet                   | Done                 |
| P0-1  | Clock and batch identity                        | Done                 |
| P0-2  | GSAP clock ownership                            | Done                 |
| P0-3  | Absolute multi-property stop compilation        | Done                 |
| P0-3b | Authored-duration pinning                       | Green, pending merge |
| P0-4  | DOM transform rendering and removal             | Not started          |

## Current next action

**Merge [#68](https://github.com/chahyasantoso/motion5/pull/68), then start P0-4.** P0-3b is green on [`6719d408`](https://github.com/chahyasantoso/motion5/commit/6719d408c705a26a2ca28bd88c6a91dccd85bd61) with a cited red leg on the fix-free tree. Two recovery audits are outstanding, for P0-3 and P0-3b; both are manual dispatches and neither has been run.

## P0 progress

- **P0-1 complete:** merged via [PR #65](https://github.com/chahyasantoso/motion5/pull/65), merge commit [`5a215ce`](https://github.com/chahyasantoso/motion5/commit/5a215cecb20269187589c6350f5e7af470f72643). Clock frame identity is separate from batch identity, seek no longer consumes a clock tick, clock-driven flush failures are contained, and browser frame rescheduling survives listener errors. Recovery audit [run #31613418248](https://github.com/chahyasantoso/motion5/actions/runs/31613418248) passed all five jobs against base [`c7aae62a`](https://github.com/chahyasantoso/motion5/commit/c7aae62a94897aa84a652cd13f42fb4fddfd67b5).
- **P0-2 complete:** merged via [PR #66](https://github.com/chahyasantoso/motion5/pull/66), merge commit [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3a). The GSAP adapter creates paused timelines and the contract test observes the adapter's own `timeline({ paused: true })` call. Recovery audit [run #31616138632](https://github.com/chahyasantoso/motion5/actions/runs/31616138632) passed all five jobs against base [`5a215ce`](https://github.com/chahyasantoso/motion5/commit/5a215cecb20269187589c6350f5e7af470f72643). **One piece of the review's P0-2 fix landed late:** `createRealGsapInterpolator` was still hand-rolling a paused timeline inside `end-to-end.test.ts` after this merge, and was removed on the P0-3 branch in [`6a0bdb7`](https://github.com/chahyasantoso/motion5/commit/6a0bdb7dcdad9a51792105c5546e21a845d4961d).
- **P0-3 complete:** merged via [PR #67](https://github.com/chahyasantoso/motion5/pull/67), merge commit [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), progress note [`P0-3.md`](P0-3.md). Stop positions compile as absolute normalized positions, one segment per authored interval placed at its own absolute start, using GSAP's position argument rather than the shared percent-keyframe map the review suggested. The real-GSAP test proves the two mechanisms are equivalent instead of asserting it. CI [run #31652628046](https://github.com/chahyasantoso/motion5/actions/runs/31652628046) green. **Recovery audit still outstanding** against base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3a).
- **P0-3b green, pending merge:** PR [#68](https://github.com/chahyasantoso/motion5/pull/68), progress note [`P0-3b.md`](P0-3b.md). A timeline's real duration is now pinned to the authored duration, so a last stop before `p = 1` no longer rescales every authored position or shortens the public `duration`. Red leg [run #31654119099](https://github.com/chahyasantoso/motion5/actions/runs/31654119099) on the fix-free tree, 5 assertion-level failures with the predicted values; green leg [run #31654633087](https://github.com/chahyasantoso/motion5/actions/runs/31654633087), all jobs green at 167 tests.

## Reopened gates

- **E1** is complete against evidence that cannot fail. Both packages declare their public entry as TypeScript source (`"types": "./src/index.ts"`), so the audit's declaration-build job verifies that a source file exists and emits into a throwaway directory nothing imports. `ci.yml` also contains no build job and no dedicated end-to-end job, so E1's exit criterion is not on the required-check path. See G-1, G-2, and G-7 in the review.
- **C3** is proven only by an injected recording writer that asserts the call rather than the render, and the shipped default writer cannot render transforms (P0-4). The slice's `internalKeys` and output-serializer metadata are declared on `PluginDefinition` and read nowhere (X-2).

## Recent evidence

- P0-3b red leg: [run #31654119099](https://github.com/chahyasantoso/motion5/actions/runs/31654119099), 5 failed and 162 passed, every failure inside `gsap-authored-duration.test.ts` and every one at assertion level, reporting `0.5` for `1`, `1` for `2`, `0.75` for `1`, `+0` for `3`, and a tween count of `1` for `2`.
- P0-3b green leg: [run #31654633087](https://github.com/chahyasantoso/motion5/actions/runs/31654633087), all jobs green, 167 tests passing.
- P0-3b test-oracle repair: [`6719d408`](https://github.com/chahyasantoso/motion5/commit/6719d408c705a26a2ca28bd88c6a91dccd85bd61). The implementation commit left one failure, `expected [ 'x', '_gsap' ] to deeply equal [ 'x' ]`, because GSAP stamps its own `_gsap` cache onto every animated target, with or without pinning. The oracle now compares the authored surface that `rendererNeutralState` publishes, on both the pinned and unpinned timelines, and names the anchor key directly. Strictly stronger than the assertion that failed.
- P0-3 green CI: [run #31652628046](https://github.com/chahyasantoso/motion5/actions/runs/31652628046) on [`6a0bdb7`](https://github.com/chahyasantoso/motion5/commit/6a0bdb7dcdad9a51792105c5546e21a845d4961d).
- Real-GSAP seam: [`packages/core/test/support/real-gsap.ts`](../packages/core/test/support/real-gsap.ts). One pass-through seam replaces two hand-rolled wrappers that each repaired the adapter's own defects: they hardcoded `{ paused: true }` (hiding P0-2) and dropped the tween position argument (hiding P0-3). The seam forwards config and positions verbatim and exposes real GSAP's `paused()`, `duration()`, and tween count.
- Post-E3 code review: [`docs/CODE-REVIEW-POST-E3.md`](../docs/CODE-REVIEW-POST-E3.md), commit [`515354bb`](https://github.com/chahyasantoso/motion5/commit/515354bbf11a338ca50dde3e400a532b2ab5b049). Four blocking defects, eight high-severity findings, seven governance-gate gaps, three unported oracle behaviors. Source-traced, not executed.
- E2 merged via clean replay PR [#63](https://github.com/chahyasantoso/motion5/pull/63), merge commit [`4b4abdd1`](https://github.com/chahyasantoso/motion5/commit/4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de).
- E3 audit: [run #31605795601](https://github.com/chahyasantoso/motion5/actions/runs/31605795601), all five jobs passed with native Stryker score 65.43% total and 68.79% covered.
- E3 mutation baseline: 333 Killed, 152 Survived, 25 NoCoverage, 2 Timeout across 512 mutants. The enforced native-score ratchet is 65.42%, one hundredth below the rounded 65.43 display to avoid a floating-point boundary failure. The review notes that the 152 survivors and 25 uncovered mutants in runtime and adapters are where the four blocking defects live, so this baseline records their absence of coverage rather than their absence.

## Remaining work

- Dispatch the outstanding recovery audits: P0-3 against base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3a), P0-3b against base [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3). CI green is not the same evidence as the audit's failing-first leg.
- Fix P0-4 and land the flat projected-input change (X-1) that unblocks the registry churn finding.
- P1-10: `readStops` still silently filters malformed stops instead of diagnosing them, so out-of-range positions still animate something arbitrary.
- Repair the gates that cannot currently fail: acceptance must prove tests ran, failing-first must require an assertion-level failure, the mutation job must actually print the score it enforces, and `ci.yml` must require build and end-to-end.
- Re-dispatch the recovery audit and re-baseline mutation once the gates are honest.
- Rerun rescue checks.
- Open the final rescue-to-main PR.
