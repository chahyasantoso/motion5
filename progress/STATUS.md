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
| E3  | Mutation baseline and ratchet                   | In progress     |

## Current next action

E3 is active on `fix/E3-mutation-gate`. Run Bootstrap lockfile for that branch first, then focused CI, then Recovery audit with base `4b4abdd1` and no failing-first exception.

## Evidence

- E2 merged via clean replay PR [#63](https://github.com/chahyasantoso/motion5/pull/63), merge commit [`4b4abdd1`](https://github.com/chahyasantoso/motion5/commit/4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de).
- E2 audit: [run #31594467503](https://github.com/chahyasantoso/motion5/actions/runs/31594467503), contract, acceptance, failing-first, and build green; mutation assigned to E3.

## Remaining work

- E3: bootstrap the lockfile, establish the mutation baseline, and set the ratchet from measured evidence.
- Wave A shared exit gate.
