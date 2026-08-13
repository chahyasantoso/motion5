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
| P0-4 | DOM transform rendering and removal | Done, audited |
| X-1 | Flat projected input observations | Done, follow-up tracked |

## Current next action

**Validation follow-up:** move runtime composition/output-shape validation into the product-load path. This is separate from X-1 because source values are only observable after composition.

## Evidence

- P0-3 audit: [run #31662407749](https://github.com/chahyasantoso/motion5/actions/runs/31662407749), ref [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3), all six jobs passed.
- P0-3b audit: [run #31661988752](https://github.com/chahyasantoso/motion5/actions/runs/31661988752), ref [`d8aa0c66`](https://github.com/chahyasantoso/motion5/commit/d8aa0c66a9b7a3bfa2fbef4af0508d10feb44902c2), base [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4e`), all six jobs passed.
- P0-4: [PR #69](https://github.com/chahyasantoso/motion5/pull/69), red run [#31662690572](https://github.com/chahyasantoso/motion5/actions/runs/31662690572), green run [#31663009087](https://github.com/chahyasantoso/motion5/actions/runs/31663009087), merged at [`e83f0f2`](https://github.com/chahyasantoso/motion5/commit/e83f0f2236e0b84bd2012200592e81f787cabb32).
- X-1 test-first: [PR #70](https://github.com/chahyasantoso/motion5/pull/70), red run [#31663378125](https://github.com/chahyasantoso/motion5/actions/runs/31663378125) on test-only commit [`32d6e1f`](https://github.com/chahyasantoso/motion5/commit/32d6e1f98e876944d9c290843be3e3c0c955aeef085c2).
- X-1 final green CI: [run #31672259863](https://github.com/chahyasantoso/motion5/actions/runs/31672259863), with quality, integration, boundaries, benchmark, and formatting passing.

## Reopened gates

- E1: declaration build and public package boundaries are not fully proven by the current source-entry configuration or required-check path.
- C3: plugin metadata fields remain unread; the DOM writer portion is resolved by P0-4.

## Remaining work

- Implement the validation follow-up for runtime composition/output shape.
- Make acceptance prove mapped tests actually ran, require assertion-level failing-first evidence, and put build/end-to-end on the required CI path.
- Re-baseline mutation after the gates are honest, rerun rescue checks, then open the final rescue-to-main PR.
