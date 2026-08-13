# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

## Board

| ID    | Slice                                           | Status                                    |
| ----- | ----------------------------------------------- | ----------------------------------------- |
| W0    | Rescue loop and audit baseline                  | Done                                      |
| A1    | Final-value memo consistency                    | Done, gate open                           |
| A2    | Preserve subscriber errors                      | Done, gate open                           |
| A3    | Guard subscriber-triggered reentrancy           | Done, gate open                           |
| B1    | Prepare-stage plugin contribution               | Done                                      |
| B2    | Real GSAP multi-stop compilation                | Done                                      |
| C1    | React store resubscription                      | Done                                      |
| C2    | React hook and public exports                   | Done, gate open                           |
| C3    | DOM metadata, serialization, and clear coverage | Done, gate open                           |
| D1    | Discover consumer packages                      | Done                                      |
| D2    | Planted boundary self-test                      | Done                                      |
| D3    | Acceptance evidence gates                       | Done                                      |
| E1    | Required declaration build                      | Done, gate open                           |
| E2    | Real end-to-end product path                    | Done                                      |
| E3    | Mutation baseline and ratchet                   | Done                                      |
| P0-1  | Clock and batch identity                        | Done                                      |
| P0-2  | GSAP clock ownership                            | Done                                      |
| P0-3  | Absolute multi-property stop compilation        | Done, audited                             |
| P0-3b | Authored-duration pinning                       | Done, audited                             |
| P0-4  | DOM transform rendering and removal             | Done, audited                             |
| X-1   | Flat projected input observations               | Implementation complete, CI rerun pending |

## Current next action

**X-1:** rerun the required CI checks on the repaired head, then close the slice with the final green run recorded in `progress/X1.md`.

## Evidence

- P0-3 audit: [run #31662407749](https://github.com/chahyasantoso/motion5/actions/runs/31662407749), ref [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3), all six jobs passed.
- P0-3b audit: [run #31661988752](https://github.com/chahyasantoso/motion5/actions/runs/31661988752), ref [`d8aa0c66`](https://github.com/chahyasantoso/motion5/commit/d8aa0c66a9b7a3bfa2fbef4af0508d10feb44902), base [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), all six jobs passed.
- P0-4: [PR #69](https://github.com/chahyasantoso/motion5/pull/69), red run [#31662690572](https://github.com/chahyasantoso/motion5/actions/runs/31662690572), green run [#31663009087](https://github.com/chahyasantoso/motion5/actions/runs/31663009087), merged at [`e83f0f2`](https://github.com/chahyasantoso/motion5/commit/e83f0f2236e0b84bd2012200592e81f787cabb32).
- X-1 test-first: [PR #70](https://github.com/chahyasantoso/motion5/pull/70), red run [#31663378125](https://github.com/chahyasantoso/motion5/actions/runs/31663378125) on test-only commit [`32d6e1f`](https://github.com/chahyasantoso/motion5/commit/32d6e1f98e876944d9c290843580ff4ff0e7dbcc), implementation and projection tests are on the PR head.
- X-1 final-head repair: type narrowing and boundary vocabulary fixes are in commits [`5841301`](https://github.com/chahyasantoso/motion5/commit/58413016ca66fe3ba9092c419225965c9ecc1335) and [`a2ec249`](https://github.com/chahyasantoso/motion5/commit/a2ec24950ba555707dd1b802f7f3b5d0541c3411); CI rerun pending.

## Reopened gates

- E1: declaration build and public package boundaries are not fully proven by the current source-entry configuration or required-check path.
- C3: plugin metadata fields remain unread; the DOM writer portion is resolved by P0-4.

## Remaining work

- Close X-1 with a clean final-head CI run.
- Make acceptance prove mapped tests actually ran, require assertion-level failing-first evidence, and put build/end-to-end on the required CI path.
- Re-baseline mutation after the gates are honest, rerun rescue checks, then open the final rescue-to-main PR.
