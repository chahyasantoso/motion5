# Motion5 recovery status

This is the single source of truth for recovery progress. `WAVE-PLAN.md` contains the detailed plan; this file records live status and evidence.

Last reviewed: 2026-08-13

## Board

| ID    | Slice                                           | Status          |
| ----- | ----------------------------------------------- | --------------- |
| W0    | Rescue loop and audit baseline                  | Done            |
| A1    | Final-value memo consistency                    | Done, gate open |
| A2    | Preserve subscriber errors                      | Done, gate open |
| A3    | Guard subscriber-triggered reentrancy           | Done, gate open |
| B1    | Prepare-stage plugin contribution               | Done            |
| B2    | Real GSAP multi-stop compilation                | Done            |
| C1    | React store resubscription                      | Done            |
| C2    | React hook and public exports                   | Done, gate open |
| C3    | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1    | Discover consumer packages                      | Done            |
| D2    | Planted boundary self-test                      | Done            |
| D3    | Acceptance evidence gates                       | In progress, bundled in #81 |
| E1    | Required declaration build                      | In progress, bundled in #81 |
| E2    | Real end-to-end product path                    | Done            |
| E3    | Mutation baseline and ratchet                   | In progress, bundled in #81 |
| P0-1  | Clock and batch identity                        | Done            |
| P0-2  | GSAP clock ownership                            | Done            |
| P0-3  | Absolute multi-property stop compilation        | Done, audited   |
| P0-3b | Authored-duration pinning                       | Done, audited   |
| P0-4  | DOM transform rendering and removal             | Done, audited   |
| X-1   | Flat projected input observations               | Done, merged    |
| P1-5  | Structural registry change detection            | Done, merged    |
| P1-6  | Listener snapshots before notification          | Done, merged    |
| P1-10 | Product-load authored validation                | Done, merged    |
| P1-11 | Runtime composition/output-shape diagnostics    | Done, merged    |
| P1-7  | Scheduler-driven deferred drain                 | Done, merged    |
| P1-8  | One reentrancy policy, one flush entry point    | Done, merged    |
| P1-9  | Narrow public project handle                    | Done, merged    |
| P1-12 | One observation-validation owner                | Done, merged    |

## Current next action

**Unified governance pass, PR #81:** repair G-1, G-3, G-4, G-5, G-6, and G-7 together. This is deliberately one implementation and one evidence chain: build declarations and a consumer smoke test, make acceptance consume executed passing-test evidence, harden failing-first against infrastructure reds, make mutation scoring and ratcheting real, and put build plus end-to-end on the required CI path.

## Evidence

- P1-10: [PR #76](https://github.com/chahyasantoso/motion5/pull/76), green [#31675927357](https://github.com/chahyasantoso/motion5/actions/runs/31675927357), merged [`f296594`](https://github.com/chahyasantoso/motion5/commit/f29659487ac325ab72dfc7ff111c1049f0cd610a).
- P1-11: [PR #77](https://github.com/chahyasantoso/motion5/pull/77), green [#31676660768](https://github.com/chahyasantoso/motion5/actions/runs/31676660768), merged.
- P1-7/P1-8: [PR #78](https://github.com/chahyasantoso/motion5/pull/78), green [#31681320093](https://github.com/chahyasantoso/motion5/actions/runs/31681320093), merged [`c1e68d6`](https://github.com/chahyasantoso/motion5/commit/c1e68d6b67b12103b249af3adb570cd0a870eb6c).
- P1-9: [PR #79](https://github.com/chahyasantoso/motion5/pull/79), green [#31681653183](https://github.com/chahyasantoso/motion5/actions/runs/31681653183), merged [`5571da9`](https://github.com/chahyasantoso/motion5/commit/5571da91f3e38c85f3c596ec9240e8412f1cfa47).
- P1-12: [PR #80](https://github.com/chahyasantoso/motion5/pull/80), green [#31684300411](https://github.com/chahyasantoso/motion5/actions/runs/31684300411), merged [`ccae2a9`](https://github.com/chahyasantoso/motion5/commit/ccae2a91a97b9ab766b03fe89ebb5da8faf97f93).
- Unified governance red leg: [PR #81](https://github.com/chahyasantoso/motion5/pull/81), test-only [`011c204`](https://github.com/chahyasantoso/motion5/commit/011c20487839de20cfcc0b3c416eb1b89269e2d0).

## Reopened gates

- C3/X-2: plugin metadata fields remain declared but unread; DOM transform rendering is covered by P0-4.
- G-1/G-3/G-4/G-5/G-6/G-7: bundled in PR #81.

## Remaining work

- Finish the unified governance pass in PR #81.
- X-2/X-3: thread or remove plugin metadata and document/restore the `contribute()` contract.
- P2 cleanup: dead `sourceRevisions`, publisher snapshot consistency, O(dirty) per-frame allocation, single freeze per compose, last-known-good values on error patches, Track resurrection after disposal, and the dead `Motion`/`createTrigger` pair.
- Rerun the rescue audit, then open rescue → main.
