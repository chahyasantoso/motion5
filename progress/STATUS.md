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
| E3  | Mutation baseline and ratchet                   | Ready to merge  |

## Current next action

Merge E3 PR #64 into `rescue/restore-motionpath-parity`. The measured baseline is 333 Killed, 152 Survived, 25 NoCoverage, and 2 Timeout across 512 mutants, for an exact **68.377823%** mutation score and a **68.38%** ratchet using `Killed / (Killed + Survived + Timeout)`. The threshold draft was corrected before merge.

Wave A's shared exit gate closes after E3 merges and rescue reruns its full required checks.

## Recent evidence

- E2 merged via clean replay PR [#63](https://github.com/chahyasantoso/motion5/pull/63), merge commit [`4b4abdd1`](https://github.com/chahyasantoso/motion5/commit/4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de).
- E2 audit: [run #31594467503](https://github.com/chahyasantoso/motion5/actions/runs/31594467503), contract, acceptance, failing-first, and build green; mutation assigned to E3.
- E3 CI: [run #31602675963](https://github.com/chahyasantoso/motion5/actions/runs/31602675963), quality, integration, boundaries, and performance passed.
- E3 audit: [run #31602953122](https://github.com/chahyasantoso/motion5/actions/runs/31602953122), all five jobs passed; raw mutation artifact supplied by the audit run.

## Remaining work

- E3: merge PR #64.
- Wave A shared exit gate, then rerun rescue checks and open the final rescue-to-main PR.
