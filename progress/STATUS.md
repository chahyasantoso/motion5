# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-12

## Board

| ID | Slice | Status |
| --- | --- | --- |
| W0 | Rescue loop and audit baseline | Done |
| A1 | Final-value memo consistency | Done, gate open |
| A2 | Preserve subscriber errors | Done, gate open |
| A3 | Guard subscriber-triggered reentrancy | Done, gate open |
| B1 | Prepare-stage plugin contribution | Done |
| B2 | Real GSAP multi-stop compilation | Done |
| C1 | React store resubscription | Done |
| C2 | React hook and public exports | Done, gate open |
| C3 | DOM metadata, serialization, and clear coverage | Done |
| D1 | Discover consumer packages | Done |
| D2 | Planted boundary self-test | Done |
| D3 | Acceptance evidence gates | Done |
| E1 | Required declaration build | Done |
| E2 | Real end-to-end product path | In progress |
| E3 | Mutation baseline and ratchet | Not started |

## Current next action

E2 is active on [PR #62](https://github.com/chahyasantoso/motion5/pull/62). It starts from merged E1 rescue tip [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068), adds the real GSAP-to-patch-to-DOM fixture, and registers it in the acceptance map. Run focused CI first, then Recovery audit with base `fb38313e76c411dee6ce25b8fee5c3aa307fe068` and no exception.

## Recent evidence

- D2 audit: [run #31548349508](https://github.com/chahyasantoso/motion5/actions/runs/31548349508), failing-first passed.
- D3 merge: [`83eb44d2`](https://github.com/chahyasantoso/motion5/commit/83eb44d2da7e118e284d96c890f82cd90c84f960); audit [run #31570343311](https://github.com/chahyasantoso/motion5/actions/runs/31570343311), acceptance and failing-first passed.
- E1 merge: [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068); audit [run #31571222958](https://github.com/chahyasantoso/motion5/actions/runs/31571222958), declaration build, acceptance, and documented failing-first exception passed. Contract remains open until E2; mutation remains E3.
- E2 branch head: [`d1083904`](https://github.com/chahyasantoso/motion5/commit/d1083904c42d66c8810496ab522cd142f086c072).

## Remaining work

- E2: merge the real end-to-end fixture after focused CI and audit pass.
- E3: establish and ratchet the mutation baseline.
- Wave A shared exit gate.
