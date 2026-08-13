# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

## Board

| ID    | Slice                                           | Status                               |
| ----- | ----------------------------------------------- | ------------------------------------ |
| W0    | Rescue loop and audit baseline                  | Done                                 |
| A1    | Final-value memo consistency                    | Done, gate open                      |
| A2    | Preserve subscriber errors                      | Done, gate open                      |
| A3    | Guard subscriber-triggered reentrancy           | Done, gate open                      |
| B1    | Prepare-stage plugin contribution               | Done                                 |
| B2    | Real GSAP multi-stop compilation                | Done                                 |
| C1    | React store resubscription                      | Done                                 |
| C2    | React hook and public exports                   | Done, gate open                      |
| C3    | DOM metadata, serialization, and clear coverage | Done, gate open                      |
| D1    | Discover consumer packages                      | Done                                 |
| D2    | Planted boundary self-test                      | Done                                 |
| D3    | Acceptance evidence gates                       | Done                                 |
| E1    | Required declaration build                      | Done, gate open                      |
| E2    | Real end-to-end product path                    | Done                                 |
| E3    | Mutation baseline and ratchet                   | Done                                 |
| P0-1  | Clock and batch identity                        | Done                                 |
| P0-2  | GSAP clock ownership                            | Done                                 |
| P0-3  | Absolute multi-property stop compilation        | Done, audited                        |
| P0-3b | Authored-duration pinning                       | Done, audited                        |
| P0-4  | DOM transform rendering and removal             | Done, audited                        |
| X-1   | Flat projected input observations               | Done, merged                         |
| P1-5  | Structural registry change detection            | Done, merged                         |
| P1-6  | Listener snapshots before notification          | Done, merged                         |
| P1-10 | Product-load authored validation                | Red leg captured, implementation pushed to #76 |

## Current next action

**P1-10:** finish the green validation run on [PR #76](https://github.com/chahyasantoso/motion5/pull/76), then open the separate runtime composition/output-shape diagnostics slice. Runtime source-shape remains a publication-time concern because composed values do not exist at load.

## Evidence

- P0-3 audit: [run #31662407749](https://github.com/chahyasantoso/motion5/actions/runs/31662407749), ref [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), base [`2f38b5b0`](https://github.com/chahyasantoso/motion5/commit/2f38b5b0f7e6994ba1fe4fb3eb13ab4813acfd3), all six jobs passed.
- P0-3b audit: [run #31661988752](https://github.com/chahyasantoso/motion5/actions/runs/31661988752), ref [`d8aa0c66`](https://github.com/chahyasantoso/motion5/commit/d8aa0c66a9b7a3bfa2fbef4af0508d10feb44902), base [`8e93de4e`](https://github.com/chahyasantoso/motion5/commit/8e93de4ea1a448aaaade35ce95e7c47d0cfbe9a3), all six jobs passed.
- P0-4: [PR #69](https://github.com/chahyasantoso/motion5/pull/69), red run [#31662690572](https://github.com/chahyasantoso/motion5/actions/runs/31662690572), green run [#31663009087](https://github.com/chahyasantoso/motion5/actions/runs/31663009087), merged at [`e83f0f2`](https://github.com/chahyasantoso/motion5/commit/e83f0f2236e0b84bd2012200592e81f787cabb32.
- X-1: [PR #70](https://github.com/chahyasantoso/motion5/pull/70), red leg on test-only commit [`32d6e1f`](https://github.com/chahyasantoso/motion5/commit/32d6e1f98e876944d9c290843be3e3c0c955aeef085c2), green run [#31672259863](https://github.com/chahyasantoso/motion5/actions/runs/31672259863), merged at [`e1f026b`](https://github.com/chahyasantoso/motion5/commit/e1f026b4460324ff144f6c6d664312cba2c95613). Load-validation follow-up is tracked in PR #76.
- P1-5 and P1-6: [PR #75](https://github.com/chahyasantoso/motion5/pull/75), red run [#31674529566](https://github.com/chahyasantoso/motion5/actions/runs/31674529566) on test-only commit [`1b6643f`](https://github.com/chahyasantoso/motion5/commit/1b6643fc102b3e712896299dd46df8301aa22f6c), green run [#31674734838](https://github.com/chahyasantoso/motion5/actions/runs/31674734838), merged at [`c2ad7e5`](https://github.com/chahyasantoso/motion5/commit/c2ad7e5bf8b3e4c137b8ae808f7231bdc55d5bc3).

## Reopened gates

- E1: declaration build and public package boundaries are not fully proven by the current source-entry configuration or required-check path.
- C3: plugin metadata fields remain unread; the DOM writer portion is resolved by P0-4.

## Remaining work

- Finish P1-10 load-time validation in PR #76.
- Open runtime source/composition output-shape diagnostics as a separate follow-up.
- Make acceptance prove mapped tests actually ran, require assertion-level failing-first evidence, and put build/end-to-end on the required CI path.
- Re-baseline mutation after the gates are honest, rerun rescue checks, then open the final rescue-to-main PR.
