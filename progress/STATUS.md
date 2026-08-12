# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-12

## Board

| ID  | Slice                                           | Status                        |
| --- | ----------------------------------------------- | ----------------------------- |
| W0  | Rescue loop and audit baseline                  | Done                          |
| A1  | Final-value memo consistency                    | Done, gate open               |
| A2  | Preserve subscriber errors                      | Done, gate open               |
| A3  | Guard subscriber-triggered reentrancy           | Done, gate open               |
| B1  | Prepare-stage plugin contribution               | Done                          |
| B2  | Real GSAP multi-stop compilation                | Done                          |
| C1  | React store resubscription                      | Done                          |
| C2  | React hook and public exports                   | Done, gate open               |
| C3  | DOM metadata, serialization, and clear coverage | Done                          |
| D1  | Discover consumer packages                      | Done                          |
| D2  | Planted boundary self-test                      | Done                          |
| D3  | Acceptance evidence gates                       | Done                          |
| E1  | Required declaration build                      | Done                          |
| E2  | Real end-to-end product path                    | Audited green, ready to merge |
| E3  | Mutation baseline and ratchet                   | Next                          |

## Current next action

Merge E2 from [PR #62](https://github.com/chahyasantoso/motion5/pull/62) at [`30c7be24`](https://github.com/chahyasantoso/motion5/commit/30c7be24953f44ee31eec5fb732a6dfe4511f537). Every gate E2 owns is green on that ref and its failing-first verdict is a genuine pass with no exception.

After the merge, E3 is the last slice. It owns `stryker.config.json`, the mutation run over `packages/core/src/runtime` and `packages/core/src/adapters`, and the recorded baseline the audit's mutation job currently fails for lacking. That job is the only red gate left in the audit, and it is red by design until E3 lands.

Wave A's shared exit gate closes with E3, because the audit only reports fully green once the mutation baseline exists.

## Recent evidence

- D2 audit: [run #31548349508](https://github.com/chahyasantoso/motion5/actions/runs/31548349508), failing-first passed.
- D3 merge: [`83eb44d2`](https://github.com/chahyasantoso/motion5/commit/83eb44d2da7e118e284d96c890f82cd90c84f960); audit [run #31570343311](https://github.com/chahyasantoso/motion5/actions/runs/31570343311), acceptance and failing-first passed.
- E1 merge: [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068); audit [run #31571222958](https://github.com/chahyasantoso/motion5/actions/runs/31571222958), declaration build, acceptance, and documented failing-first exception passed.
- E2 audit: [run #31594467503](https://github.com/chahyasantoso/motion5/actions/runs/31594467503) on [`30c7be24`](https://github.com/chahyasantoso/motion5/commit/30c7be24953f44ee31eec5fb732a6dfe4511f537), base [`fb38313e`](https://github.com/chahyasantoso/motion5/commit/fb38313e76c411dee6ce25b8fee5c3aa307fe068), no exception requested. Contract **pass**, acceptance **pass**, failing-first **pass**, declaration build **pass**, mutation **fail** (E3 owns it).
- E2 failing-first detail: base red on both `gsap-multi-stop.test.ts` (37.5 where linear authored interpolation requires 25) and `end-to-end.test.ts` (`patch.values.opacity` undefined); ref green on all three tests.
- E2 CI: [run #31594035066](https://github.com/chahyasantoso/motion5/actions/runs/31594035066), quality, integration, boundaries, and performance all pass. This is the first run where quality cleared format check and actually executed typecheck and the full `npm test`.
- B2 corrected during E2: authored segments compile with `ease: "none"` unless a stop authors an ease ([`698e4193`](https://github.com/chahyasantoso/motion5/commit/698e41935de5b748f7c65fb911750615ae922bfb)), and the eased expectation now matches GSAP's real curve ([`4b04eee1`](https://github.com/chahyasantoso/motion5/commit/4b04eee1d35fc46e3fcb1acce8976fd8fe1507cc)). GSAP's `power2` is cubic, so `power2.in` at progress 0.5 yields 0.125.

## Remaining work

- E2: merge PR #62.
- E3: mutation baseline and ratchet, the last red audit gate.
- Wave A shared exit gate, which closes with E3.
