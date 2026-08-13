# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

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
| C3 | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1 | Discover consumer packages | Done |
| D2 | Planted boundary self-test | Done |
| D3 | Acceptance evidence gates | Done |
| E1 | Required declaration build | Done, gate open |
| E2 | Real end-to-end product path | Done |
| E3 | Mutation baseline and ratchet | Done |
| P0-1 | Clock and batch identity | Done |
| P0-2 | GSAP clock ownership | Done |
| P0-3 | Absolute multi-property stop compilation | Done, audited |
| P0-3b | Authored-duration pinning | Done, audited |
| P0-4 | DOM transform rendering and removal | In progress |

## Current next action

**P0-4:** prove the shipped DOM adapter writes transforms and removes omitted CSS properties, then fix the default writer at the DOM boundary. After that, land flat projected inputs (X-1) and repair the remaining governance gates.

## Evidence

- P0-3 audit: [run #31662407749](https://github.com/chahyasantoso/motion5/actions/runs/31662407749), ref [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3), all six jobs passed.
- P0-3b audit: [run #31661988752](https://github.com/chahyasantoso/motion5/actions/runs/31661988752), ref [`d8aa0c66`](https://github.com/chahyasantoso/motion5/commit/d8aa0c66a9b7a3bfa2fbef4af0508d10feb44902), base [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), all six jobs passed.

## Reopened gates

- E1: declaration build and public package boundaries are not fully proven by the current source-entry configuration or required-check path.
- C3: the default DOM writer cannot render transforms, and plugin metadata fields remain unread.

## Remaining work

- Finish P0-4 with failing-first red and green evidence.
- Land flat projected inputs (X-1).
- Make acceptance prove mapped tests actually ran, require assertion-level failing-first evidence, and put build/end-to-end on the required CI path.
- Re-baseline mutation after the gates are honest, rerun rescue checks, then open the final rescue-to-main PR.
