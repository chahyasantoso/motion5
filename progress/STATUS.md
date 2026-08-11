# Motion5 recovery status

This is the **single source of truth** for recovery progress. Update this file after every slice branch or PR changes state. `WAVE-PLAN.md` contains the detailed plan and acceptance guidance, but its prose is not authoritative for status.

Last reviewed: 2026-08-11

| ID | Slice | Status | Branch | Related files | Commit or evidence |
|---|---|---|---|---|---|
| W0 | Rescue loop and audit baseline | In progress | `rescue/restore-motionpath-parity` | [WAVE-PLAN](../WAVE-PLAN.md), [audit workflow](../.github/workflows/recovery-audit.yml), [baseline record](W0-baseline.md) | Workflow rebuilt to the five-job spec; the earlier single-job version measured only file existence. No dispatch run URL exists yet for either `main` or rescue, and no mutation status is recorded, so the exit gate is unmet. Prior evidence was two supplied ZIPs with reversed labels, not run links |
| A1 | Final-value memo consistency | Green, pending wave gate | `fix/A1-final-value-memo` | [publisher](../packages/core/src/runtime/graph-publisher.ts), [test](../packages/core/test/integration/publisher-output-merge-consistency.test.ts) | [1d59c087](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a); re-proved on the rescue tip by the A3 green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471235572) |
| A2 | Preserve subscriber errors | Green, pending wave gate | `fix/A2-subscriber-errors` | [registry](../packages/core/src/runtime/patch-registry.ts), [test](../packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts) | [1d59c087](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a); re-proved on the rescue tip by the A3 green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471235572) |
| A3 | Guard subscriber-triggered reentrancy | Green, pending wave gate | `fix/A3-publisher-reentrancy` | [registry](../packages/core/src/runtime/patch-registry.ts), [publisher](../packages/core/src/runtime/graph-publisher.ts), [runtime](../packages/core/src/runtime/graph-runtime.ts), [test](../packages/core/test/unit/runtime/publisher-reentrancy.test.ts), [slice log](A3.md) | merged into rescue as [`bec08ded`](https://github.com/chahyasantoso/motion5/commit/bec08ded24da9b5febdca19be81be6edd84cea53); green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471235572), red [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471934722). Slice evidence is complete; the Wave A gate stays open until the audit runs |
| B1 | Prepare-stage plugin contribution | Green, pending wave gate | `fix/B1-track-contribution` | [track](../packages/core/src/domain/track.ts), [plugins](../packages/core/src/domain/plugins.ts), [test](../packages/core/test/unit/domain/track-contribution.test.ts) | merged into rescue as [`74f885ca`](https://github.com/chahyasantoso/motion5/commit/74f885ca08f957bea1d552182fcdf33a2b62e70f); green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31472986155) on [`d5a84f90`](https://github.com/chahyasantoso/motion5/commit/d5a84f90b4f1f786a437f5a19f0fee733146090e); implementation [`fcafa2d`](https://github.com/chahyasantoso/motion5/commit/fcafa2d41fde3601757a9ff15fa5057ed0bd8534). Gap: red is asserted by construction, no red run was recorded; re-prove with the `failing-first` audit job |
| B2 | Real GSAP multi-stop compilation | Blocked | `fix/B2-gsap-stop-compilation` | [GSAP adapter](../packages/core/src/adapters/interpolator/gsap.ts), [tests](../packages/core/test/contract/adapters.test.ts) | Blocked on W0: B2's correctness claim rests on the real GSAP contract job, which does not have a run yet |
| C1 | React store resubscription | Not started | `fix/C1-react-store-lifecycle` | [store](../packages/react/src/patch-store.ts), [test](../packages/react/test/patch-store.test.ts) | No evidence yet |
| C2 | React hook and public exports | Not started | `fix/C2-react-public-surface` | Planned React index and hook | No evidence yet |
| C3 | DOM metadata, serialization, and clear coverage | Not started | `fix/C3-dom-contract` | [DOM adapter](../packages/core/src/adapters/dom.ts), [test](../packages/core/test/integration/dom-patch-apply.test.ts) | No evidence yet |
| D1 | Discover consumer packages | Not started | `fix/D1-boundary-discovery` | [scanner](../scripts/boundary-scan.mjs) | No evidence yet |
| D2 | Planted boundary self-test | Not started | `fix/D2-boundary-self-test` | [test](../packages/core/test/unit/scripts/boundary-scan.test.ts), [fixtures](../scripts/boundary-scan-fixtures.mjs) | No evidence yet |
| D3 | Acceptance evidence gates | Not started | `fix/D3-evidence-gates` | Planned acceptance checker and map | No evidence yet; the failing-first half moved into W0's audit workflow |
| E1 | Required declaration build | Not started | `fix/E1-required-build` | [CI](../.github/workflows/ci.yml), package exports | No evidence yet |
| E2 | Real end-to-end product path | Not started | `fix/E2-end-to-end-proof` | Planned integration fixture | No evidence yet |
| E3 | Mutation baseline and ratchet | Not started | `fix/E3-mutation-gate` | Planned Stryker config and audit artifact | No baseline yet |

## Status vocabulary

- **Not started**: no branch or implementation work.
- **In progress**: branch exists and work has begun.
- **Red test recorded**: failing-first evidence is saved.
- **Green, pending wave gate**: real acceptance test and cheap CI pass, but the wave gate is not complete.
- **Done**: slice dependencies and its wave exit gate are proven.
- **Blocked**: work cannot proceed; explain why in the row or linked slice log.

"Done on main, verify on rescue" is not in this vocabulary and is no longer used. A slice proved only on `main` is at best **Green, pending wave gate** once a rescue run covers it.

## Update protocol

1. Update this table first whenever work starts, a red run is recorded, a PR merges, or evidence changes.
2. Put commit, PR, workflow, and artifact links in the final column. There is no local checkout on this recovery, so a run URL is the evidence; a pasted artifact ZIP is not.
3. Use `progress/<slice>.md` only for detailed evidence: oracle files, dispatch inputs, run links, and known gaps. It is supporting evidence, never a competing status source.
4. Update `RECOVERY.md` only when the current handoff, baseline, or open-defect summary changes.
5. Update `WAVE-PLAN.md` only when the plan, dependencies, acceptance criteria, or exit gates change.

## Current next action

Finish W0. The audit workflow now implements `contract`, `mutation`, `acceptance`, `failing-first`, and `build`. Dispatch **Recovery audit** twice, once with `ref: main` and once with `ref: rescue/restore-motionpath-parity`, then record both run URLs and their job outcomes in the W0 row and in [`W0-baseline.md`](W0-baseline.md). Expect red jobs: they are the measurement, not a regression. Start B2 only after those two runs are linked.
