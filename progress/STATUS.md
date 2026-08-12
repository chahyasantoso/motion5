# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-12

## Board

| ID   | Slice                                           | Status          |
| ---- | ----------------------------------------------- | --------------- |
| W0   | Rescue loop and audit baseline                  | Done            |
| A1   | Final-value memo consistency                    | Done, gate open |
| A2   | Preserve subscriber errors                      | Done, gate open |
| A3   | Guard subscriber-triggered reentrancy           | Done, gate open |
| B1   | Prepare-stage plugin contribution               | Done            |
| B2   | Real GSAP multi-stop compilation                | Done            |
| C1   | React store resubscription                      | Done            |
| C2   | React hook and public exports                   | Done, gate open |
| C3   | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1   | Discover consumer packages                      | Done            |
| D2   | Planted boundary self-test                      | Done            |
| D3   | Acceptance evidence gates                       | Done            |
| E1   | Required declaration build                      | Done, gate open |
| E2   | Real end-to-end product path                    | Done            |
| E3   | Mutation baseline and ratchet                   | Done            |
| P0-1 | Clock and batch identity                        | Done            |
| P0-2 | GSAP clock ownership                            | Done            |
| P0-3 | Absolute multi-property stop compilation        | In progress     |
| P0-4 | DOM transform rendering and removal             | Not started     |

## Current next action

**P0-3 is active on `fix/P0-3-absolute-multi-property-stops`.** The implementation is in place, but the first CI run exposed a bug in the deterministic timeline test model, not a product assertion failure. The test model is repaired without weakening the assertion; rerun CI on the repaired head before dispatching the recovery audit.

## P0 progress

- **P0-1 complete:** merged via [PR #65](https://github.com/chahyasantoso/motion5/pull/65), merge commit [`5a215ce`](https://github.com/chahyasantoso/motion5/commit/5a215cecb20269187589c6350f5e7af470f72643). Clock frame identity is separate from batch identity, seek no longer consumes a clock tick, clock-driven flush failures are contained, and browser frame rescheduling survives listener errors. Recovery audit [run #31613418248](https://github.com/chahyasantoso/motion5/actions/runs/31613418248) passed all five jobs against base [`c7aae62a`](https://github.com/chahyasantoso/motion5/commit/c7aae62a94897aa84a652cd13f42fb4fddfd67b5).
- **P0-2 complete:** merged via [PR #66](https://github.com/chahyasantoso/motion5/pull/66), merge commit [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3a). The GSAP adapter creates paused timelines and the contract test observes the adapter's own `timeline({ paused: true })` call. Recovery audit [run #31616138632](https://github.com/chahyasantoso/motion5/actions/runs/31616138632) passed all five jobs against base [`5a215ce`](https://github.com/chahyasantoso/motion5/commit/5a215cecb20269187589c6350f5e7af470f72643).
- **P0-3 active:** PR [#67](https://github.com/chahyasantoso/motion5/pull/67), implementation [`1d838acd`](https://github.com/chahyasantoso/motion5/commit/1d838acd92cde5b76b0a90f9997ac9765084dc05), test-model repair [`92f9f8b2`](https://github.com/chahyasantoso/motion5/commit/92f9f8b2a14f099ca258a2b573d34d4fba64f262), progress note [`P0-3.md`](P0-3.md). CI [run #31616782139](https://github.com/chahyasantoso/motion5/actions/runs/31616782139) is red only because the fake timeline let a later chained tween overwrite a completed value at `p=0.25`; the product implementation was not weakened. The repaired fake selects the active per-property segment and uses the prior endpoint as its start value.

## Reopened gates

- **E1** is complete against evidence that cannot fail. Both packages declare their public entry as TypeScript source (`"types": "./src/index.ts"`), so the audit's declaration-build job verifies that a source file exists and emits into a throwaway directory nothing imports. `ci.yml` also contains no build job and no dedicated end-to-end job, so E1's exit criterion is not on the required-check path. See G-1, G-2, and G-7 in the review.
- **C3** is proven only by an injected recording writer that asserts the call rather than the render, and the shipped default writer cannot render transforms (P0-4). The slice's `internalKeys` and output-serializer metadata are declared on `PluginDefinition` and read nowhere (X-2).

## Recent evidence

- P0-3 CI red diagnosis: [run #31616782139](https://github.com/chahyasantoso/motion5/actions/runs/31616782139), quality failed at `gsap-absolute-stops.test.ts:81` with expected `{ x: 25, y: 25 }` but received `{ x: 25, y: 20 }`; integration, boundaries, and performance passed. The repair is [`92f9f8b2`](https://github.com/chahyasantoso/motion5/commit/92f9f8b2a14f099ca258a2b573d34d4fba64f262).
- P0-3 progress note: [`progress/P0-3.md`](P0-3.md), commit [`4b9eca64`](https://github.com/chahyasantoso/motion5/commit/4b9eca64e97a7ee18b269fa3d770ed75703080f3).
- Post-E3 code review: [`docs/CODE-REVIEW-POST-E3.md`](../docs/CODE-REVIEW-POST-E3.md), commit [`515354bb`](https://github.com/chahyasantoso/motion5/commit/515354bbf11a338ca50dde3e400a532b2ab5b049). Four blocking defects, eight high-severity findings, seven governance-gate gaps, three unported oracle behaviors. Source-traced, not executed.
- E2 merged via clean replay PR [#63](https://github.com/chahyasantoso/motion5/pull/63), merge commit [`4b4abdd1`](https://github.com/chahyasantoso/motion5/commit/4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de).
- E2 audit: [run #31594467503](https://github.com/chahyasantoso/motion5/actions/runs/31594467503), contract, acceptance, failing-first, and build green; mutation assigned to E3.
- E3 CI: [run #31605613193](https://github.com/chahyasantoso/motion5/actions/runs/31605613193), quality, integration, boundaries, and performance passed.
- E3 audit: [run #31605795601](https://github.com/chahyasantoso/motion5/actions/runs/31605795601), all five jobs passed with native Stryker score 65.43% total and 68.79% covered.
- E3 mutation baseline: 333 Killed, 152 Survived, 25 NoCoverage, 2 Timeout across 512 mutants. The enforced native-score ratchet is 65.42%, one hundredth below the rounded 65.43 display to avoid a floating-point boundary failure. The review notes that the 152 survivors and 25 uncovered mutants in runtime and adapters are where the four blocking defects live, so this baseline records their absence of coverage rather than their absence.

## Remaining work

- Finish P0-3: rerun CI on the repaired test model, then run the recovery audit with the final head and base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3a).
- Fix P0-4 and land the flat projected-input change (X-1) that unblocks the registry churn finding.
- Repair the gates that cannot currently fail: acceptance must prove tests ran, failing-first must require an assertion-level failure, the mutation job must actually print the score it enforces, and `ci.yml` must require build and end-to-end.
- Re-dispatch the recovery audit and re-baseline mutation once the gates are honest.
- Rerun rescue checks.
- Open the final rescue-to-main PR.
