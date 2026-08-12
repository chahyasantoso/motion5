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
| E2  | Real end-to-end product path                    | In progress     |
| E3  | Mutation baseline and ratchet                   | Not started     |

## Current next action

E2 is active on [PR #62](https://github.com/chahyasantoso/motion5/pull/62). It starts from the merged E1 rescue tip [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068), adds the real GSAP-to-patch-to-DOM fixture, and registers it in the acceptance map.

The fixture is already executable and green: CI [run #31591766536](https://github.com/chahyasantoso/motion5/actions/runs/31591766536) passed integration, boundaries, and performance. `npm run test:integration` covers `packages/core/test/integration`, so that pass includes `end-to-end.test.ts`.

That same run's quality job failed at its first step, `Format check`, on this file, which skipped typecheck and `npm test`. Neither has run since the B2 easing correction. This file is prettier-clean again, and identical on rescue and the E2 branch so the two sides stop conflicting.

Two manual dispatches close E2, in order:

1. CI on `fix/E2-end-to-end-proof-rescue` so quality reaches typecheck and the full `npm test` instead of being skipped.
2. Recovery audit with `ref` set to the E2 branch head and `base` set to `fb38313e76c411dee6ce25b8fee5c3aa307fe068`, with no failing-first exception. E2 ships a real behavioral test, so the base leg must go red on its own.

Expect contract, acceptance, failing-first, and declaration build green; mutation stays red and belongs to E3.

## Recent evidence

- D2 audit: [run #31548349508](https://github.com/chahyasantoso/motion5/actions/runs/31548349508), failing-first passed.
- D3 merge: [`83eb44d2`](https://github.com/chahyasantoso/motion5/commit/83eb44d2da7e118e284d96c890f82cd90c84f960); audit [run #31570343311](https://github.com/chahyasantoso/motion5/actions/runs/31570343311), acceptance and failing-first passed.
- E1 merge: [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068); audit [run #31571222958](https://github.com/chahyasantoso/motion5/actions/runs/31571222958), declaration build, acceptance, and documented failing-first exception passed. Contract remains open until E2; mutation remains E3.
- E2 acceptance test green: CI [run #31591766536](https://github.com/chahyasantoso/motion5/actions/runs/31591766536), integration job. Detailed log in [E2.md](./E2.md).
- B2 corrected during E2: authored segments compile with `ease: "none"` unless a stop authors an ease ([`698e4193`](https://github.com/chahyasantoso/motion5/commit/698e41935de5b748f7c65fb911750615ae922bfb)), and the eased expectation now matches GSAP's real curve ([`4b04eee1`](https://github.com/chahyasantoso/motion5/commit/4b04eee1d35fc46e3fcb1acce8976fd8fe1507cc)). GSAP's `power2` is cubic, so `power2.in` at progress 0.5 yields 0.125.

## Remaining work

- E2: rerun CI on the branch head, run the Recovery audit with base `fb38313e`, then merge the real end-to-end fixture.
- E3: establish and ratchet the mutation baseline, the last red audit gate.
- Wave A shared exit gate.
