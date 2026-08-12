# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-12

## Board

| ID  | Slice                                           | Status          |
| --- | ----------------------------------------------- | --------------- |
| W0  | Rescue loop and audit baseline                  | Done            |
| A1  | Final-value memo consistency                    | Done, gate open |
| A2  | Preserve subscriber errors                      | Done, gate open |
| A3  | Guard subscriber-triggered reentrancy           | Done, gate open |
| B1  | Prepare-stage plugin contribution               | Done            |
| B2  | Real GSAP multi-stop compilation                | Done            |
| C1  | React store resubscription                      | Done            |
| C2  | React hook and public exports                   | Done, gate open |
| C3  | DOM metadata, serialization, and clear coverage | Done            |
| D1  | Discover consumer packages                      | Done            |
| D2  | Planted boundary self-test                      | Done            |
| D3  | Acceptance evidence gates                       | Done            |
| E1  | Required declaration build                      | Done            |
| E2  | Real end-to-end product path                    | Done            |
| E3  | Mutation baseline and ratchet                   | Done            |

## Current next action

Wave A is complete. Rerun the full required checks on `rescue/restore-motionpath-parity`, then open the final rescue-to-main PR. The E3 merge commit is [`d66e316e`](https://github.com/chahyasantoso/motion5/commit/d66e316e9408447b8262dbe3cc2f7bfbc4742cbf).

## Recent evidence

- E2 merged via clean replay PR [#63](https://github.com/chahyasantoso/motion5/pull/63), merge commit [`4b4abdd1`](https://github.com/chahyasantoso/motion5/commit/4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de).
- E2 audit: [run #31594467503](https://github.com/chahyasantoso/motion5/actions/runs/31594467503), contract, acceptance, failing-first, and build green; mutation assigned to E3.
- E3 CI: [run #31605613193](https://github.com/chahyasantoso/motion5/actions/runs/31605613193), quality, integration, boundaries, and performance passed.
- E3 audit: [run #31605795601](https://github.com/chahyasantoso/motion5/actions/runs/31605795601), all five jobs passed with native Stryker score 65.43% total and 68.79% covered.
- E3 mutation baseline: 333 Killed, 152 Survived, 25 NoCoverage, 2 Timeout across 512 mutants. The enforced native-score ratchet is 65.42%, one hundredth below the rounded 65.43 display to avoid a floating-point boundary failure.

## Remaining work

- Rerun rescue checks.
- Open the final rescue-to-main PR.
