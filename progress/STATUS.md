# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-12

## Board

| ID  | Slice                                           | Status                       |
| --- | ----------------------------------------------- | ---------------------------- |
| W0  | Rescue loop and audit baseline                  | Done                         |
| A1  | Final-value memo consistency                    | Done, gate open              |
| A2  | Preserve subscriber errors                      | Done, gate open              |
| A3  | Guard subscriber-triggered reentrancy           | Done, gate open              |
| B1  | Prepare-stage plugin contribution               | Done                         |
| B2  | Real GSAP multi-stop compilation                | Done                         |
| C1  | React store resubscription                      | Done                         |
| C2  | React hook and public exports                   | Done, gate open              |
| C3  | DOM metadata, serialization, and clear coverage | Done                         |
| D1  | Discover consumer packages                      | Done                         |
| D2  | Planted boundary self-test                      | Done                         |
| D3  | Acceptance evidence gates                       | In progress, rebase required |
| E1  | Required declaration build                      | Not started                  |
| E2  | Real end-to-end product path                    | Not started                  |
| E3  | Mutation baseline and ratchet                   | Not started                  |

## Current next action

D2 is merged into rescue as [`64178c0d`](https://github.com/chahyasantoso/motion5/commit/64178c0d0c751ca12f277f93c0ac7ed198722d05). Its failing-first audit [run #31548349508](https://github.com/chahyasantoso/motion5/actions/runs/31548349508) passed with no exception. The overall audit stayed red only on shared missing-evidence gates, so do not rerun it.

D3 is next on [PR #58](https://github.com/chahyasantoso/motion5/pull/58), but GitHub could not automatically update its branch after D2 because the old D3 head conflicts with the new rescue tip. Resolve the conflict by rebasing `fix/D3-evidence-gates` onto `rescue/restore-motionpath-parity`, keep the D3 acceptance scanner/map and the merged D2 boundary self-test, then rerun focused CI before the D3 audit.

## Evidence by slice

### W0

- Workflow: [`0db6147`](https://github.com/chahyasantoso/motion5/commit/0db6147083dde1cd5808f6fcf22b69c0fd1060fa)
- Baseline audit: [run #31481132895](https://github.com/chahyasantoso/motion5/actions/runs/31481132895)
- Rescue audit: [run #31481291665](https://github.com/chahyasantoso/motion5/actions/runs/31481291665)

### Wave A

- A1/A2 implementation: [`1d59c087`](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a)
- A3 merge: [`bec08ded`](https://github.com/chahyasantoso/motion5/commit/bec08ded24da9b5febdca19be81be6edd84cea53)
- A3 green CI: [run #31471235572](https://github.com/chahyasantoso/motion5/actions/runs/31471235572)
- Wave A exit gate remains open.

### Wave B

- B1 merge: [`74f885ca`](https://github.com/chahyasantoso/motion5/commit/74f885ca08f957bea1d552182fcdf33a2b62e70f)
- B1 failing-first audit: [run #31483412238](https://github.com/chahyasantoso/motion5/actions/runs/31483412238)
- B2 merge: [`a69836a9`](https://github.com/chahyasantoso/motion5/commit/a69836a9ce823e7583699b46d7460e14301c5133)
- B2 failing-first audit: [run #31486238764](https://github.com/chahyasantoso/motion5/actions/runs/31486238764)

### Wave C

- C1 merge: [`25cff099`](https://github.com/chahyasantoso/motion5/commit/25cff099a1cf32f9c3cde6822d34835ee94705a)
- C1 failing-first audit: [run #31495880105](https://github.com/chahyasantoso/motion5/actions/runs/31495880105)
- C2 merge: [`5707bc7b`](https://github.com/chahyasantoso/motion5/commit/5707bc7be98ba5fa3e72f1c6c9f9980510714f36)
- C2 audit: [run #31507507062](https://github.com/chahyasantoso/motion5/actions/runs/31507507062)
- C3 merge: [`c1aeb6ce`](https://github.com/chahyasantoso/motion5/commit/c1aeb6ce77ba312fc4dbb952204889af56f09d8d)
- C3 audit: [run #31508945158](https://github.com/chahyasantoso/motion5/actions/runs/31508945158)

### Wave D

- D1 merge: [`24096724`](https://github.com/chahyasantoso/motion5/commit/2409672471cf673594c9970864dc8ff9a93184cd)
- D1 failing-first audit: [run #31511223275](https://github.com/chahyasantoso/motion5/actions/runs/31511223275)
- D2 merge: [`64178c0d`](https://github.com/chahyasantoso/motion5/commit/64178c0d0c751ca12f277f93c0ac7ed198722d05)
- D2 branch head: [`aecc6fed`](https://github.com/chahyasantoso/motion5/commit/aecc6fed2c1d38f9d459f0a20eaef8a0fe70d967)
- D2 audit: [run #31548349508](https://github.com/chahyasantoso/motion5/actions/runs/31548349508)
- D2 base: [`24096724`](https://github.com/chahyasantoso/motion5/commit/2409672471cf673594c9970864dc8ff9a93184cd)
- D2 failing-first: pass, base red and audited ref green, no exception.
- D2 overall red gates: contract surfaces, acceptance mapping, declaration build, and mutation baseline. These remain owned by later slices.

### Remaining work

- D3: rebase [PR #58](https://github.com/chahyasantoso/motion5/pull/58), rerun focused CI, then run its Recovery audit.
- E1: required declaration build.
- E2: real end-to-end fixture.
- E3: mutation baseline and ratchet.
- Wave A shared exit gate.
