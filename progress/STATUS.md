# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-12

## Board

| ID  | Slice                                           | Status                     |
| --- | ----------------------------------------------- | -------------------------- |
| W0  | Rescue loop and audit baseline                  | Done                       |
| A1  | Final-value memo consistency                    | Done, gate open            |
| A2  | Preserve subscriber errors                      | Done, gate open            |
| A3  | Guard subscriber-triggered reentrancy           | Done, gate open            |
| B1  | Prepare-stage plugin contribution               | Done                       |
| B2  | Real GSAP multi-stop compilation                | Done, corrected during E2  |
| C1  | React store resubscription                      | Done                       |
| C2  | React hook and public exports                   | Done, gate open            |
| C3  | DOM metadata, serialization, and clear coverage | Done                       |
| D1  | Discover consumer packages                      | Done                       |
| D2  | Planted boundary self-test                      | Done                       |
| D3  | Acceptance evidence gates                       | Done                       |
| E1  | Required declaration build                      | Done                       |
| E2  | Real end-to-end product path                    | In progress, audit pending |
| E3  | Mutation baseline and ratchet                   | Not started                |

The board previously claimed D3 was mid-rebase and E1 had not started. Both were already merged into `rescue/restore-motionpath-parity`; this branch was cut before that update and carried the stale table forward. Corrected here against the merge commits recorded below.

## Current next action

E2's acceptance path is executable and green. CI [run #31591766536](https://github.com/chahyasantoso/motion5/actions/runs/31591766536) on [`70c37b9d`](https://github.com/chahyasantoso/motion5/commit/70c37b9d8cdd28f309ae49d7adcb17e0d2e9af48) passed integration, boundaries, and performance. `npm run test:integration` covers `packages/core/test/integration`, so that green includes `end-to-end.test.ts`.

That run's quality job failed at its first step, `Format check`, on `progress/STATUS.md`. Typecheck and `npm test` were therefore skipped and have never run against the B2 easing correction. Formatting is clean again at the branch tip.

Two manual dispatches close E2, in this order:

1. CI on `fix/E2-end-to-end-proof-rescue` so quality (format check, typecheck, full `npm test`) reports green on the tip rather than being skipped.
2. Recovery audit with `ref` set to the tip and `base` set to [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068), the merged E1 rescue tip, and **no** failing-first exception. E2 ships a real behavioral test, so the base leg must go red on its own.

Expected audit outcome: contract, acceptance, failing-first, and declaration build green; mutation still red and owned by E3. Wave A's shared exit gate stays open until then.

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
- B2 correction during E2: authored segments now compile with `ease: "none"` unless a stop authors an ease ([`698e4193`](https://github.com/chahyasantoso/motion5/commit/698e41935de5b748f7c65fb911750615ae922bfb)), and the eased expectation was corrected to GSAP's real curve ([`4b04eee1`](https://github.com/chahyasantoso/motion5/commit/4b04eee1d35fc46e3fcb1acce8976fd8fe1507cc)). GSAP's `power2` is cubic, not quadratic, so `power2.in` at progress 0.5 yields 0.125.

### Wave C

- C1 merge: [`25cff099`](https://github.com/chahyasantoso/motion5/commit/25cff099a1b2f9a73e990651f73926f7d8b0c3fa)
- C1 failing-first audit: [run #31495880105](https://github.com/chahyasantoso/motion5/actions/runs/31495880105)
- C2 merge: [`5707bc7b`](https://github.com/chahyasantoso/motion5/commit/5707bc7be98ba5fa3e72f1c6c9f9980510714f36)
- C2 audit: [run #31507507062](https://github.com/chahyasantoso/motion5/actions/runs/31507507062)
- C3 merge: [`c1aeb6ce`](https://github.com/chahyasantoso/motion5/commit/c1aeb6ce77ba312fc4dbb952204889af56f09d8d)
- C3 audit: [run #31508945158](https://github.com/chahyasantoso/motion5/actions/runs/31508945158)

### Wave D

- D1 merge: [`24096724`](https://github.com/chahyasantoso/motion5/commit/2409672471cf673594c9970864dc8ff9a93184cd)
- D1 failing-first audit: [run #31511223275](https://github.com/chahyasantoso/motion5/actions/runs/31511223275)
- D2 merge: [`64178c0d`](https://github.com/chahyasantoso/motion5/commit/64178c0d0c751ca12f277f93c0ac7ed198722d05)
- D2 audit: [run #31548349508](https://github.com/chahyasantoso/motion5/actions/runs/31548349508), failing-first pass with no exception
- D3 merge: [`83eb44d2`](https://github.com/chahyasantoso/motion5/commit/83eb44d2da7e118e284d96c890f82cd90c84f960)
- D3 audit: [run #31570343311](https://github.com/chahyasantoso/motion5/actions/runs/31570343311), acceptance mapping and failing-first green

### Wave E

- E1 merge: [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068)
- E1 audit: [run #31571222958](https://github.com/chahyasantoso/motion5/actions/runs/31571222958), declaration build and acceptance green with the documented failing-first exception
- E2 branch: `fix/E2-end-to-end-proof-rescue` on [PR #62](https://github.com/chahyasantoso/motion5/pull/62), detailed log in [E2.md](./E2.md)
- E2 acceptance test green: CI [run #31591766536](https://github.com/chahyasantoso/motion5/actions/runs/31591766536), integration job
- E2 audit: not dispatched yet
- E3: not started

### Remaining work

- E2: rerun CI on the tip, then run the Recovery audit with base `fb38313e` and no exception, then merge.
- E3: mutation baseline and ratchet, the last red audit gate.
- Wave A shared exit gate.
