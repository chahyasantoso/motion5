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
| X-1 | Flat projected input observations | Done, merged |
| P1-5 | Structural registry change detection | Done, merged |
| P1-6 | Listener snapshots before notification | Done, merged |
| P1-10 | Product-load authored validation | Done, merged |
| P1-11 | Runtime composition/output-shape diagnostics | Green, pending merge of #77 |

## Current next action

**P1-7/P1-8:** make deferred reentrant seeds scheduler-driven with zero clock ticks, then collapse the runtime and publisher reentrancy policies behind one flush entry point. After that, address P1-9 and the honest build/acceptance/failing-first/mutation gates.

## Evidence

- X-1: [PR #70](https://github.com/chahyasantoso/motion5/pull/70), red [`32d6e1f`](https://github.com/chahyasantoso/motion5/commit/32d6e1f98e876944d9c290843be3e3c0c955aeef085c2), green [#31672259863](https://github.com/chahyasantoso/motion5/actions/runs/31672259863), merged [`e1f026b`](https://github.com/chahyasantoso/motion5/commit/e1f026b4460324ff144f6c6d664312cba2c95613).
- P1-5/P1-6: [PR #75](https://github.com/chahyasantoso/motion5/pull/75), red [#31674529566](https://github.com/chahyasantoso/motion5/actions/runs/31674529566), green [#31674734838](https://github.com/chahyasantoso/motion5/actions/runs/31674734838), merged [`c2ad7e5`](https://github.com/chahyasantoso/motion5/commit/c2ad7e5bf8b3e4c137b8ae808f7231bdc55d5bc3).
- P1-10: [PR #76](https://github.com/chahyasantoso/motion5/pull/76), red [#31675622427](https://github.com/chahyasantoso/motion5/actions/runs/31675622427), green [#31675927357](https://github.com/chahyasantoso/motion5/actions/runs/31675927357), merged [`f296594`](https://github.com/chahyasantoso/motion5/commit/f29659487ac325ab72dfc7ff111c1049f0cd610a).
- P1-11: [PR #77](https://github.com/chahyasantoso/motion5/pull/77), red [#31676209101](https://github.com/chahyasantoso/motion5/actions/runs/31676209101), final green [#31676660768](https://github.com/chahyasantoso/motion5/actions/runs/31676660768). Details in `progress/P1-11.md`.

## Reopened gates

- E1: declaration build and public package boundaries are not fully proven by the required-check path.
- C3/X-2: plugin metadata fields remain declared but unread; DOM transform rendering is covered by P0-4.
- D3/G-3: acceptance mapping still checks file existence rather than executed passing tests.
- G-4: failing-first still needs assertion-level failure validation.
- G-5/G-6: mutation score reporting and local ratchet are not trustworthy.
- G-7: build and dedicated end-to-end jobs are not on the required CI path.

## Remaining work

- Merge PR #77 after its green checks.
- P1-7/P1-8: scheduler-driven reentrant drain and one flush/reentrancy policy.
- P1-9: narrow public project handle and declaration-closure boundary scan.
- P1-12: unify validation ownership and brand/deep-freeze accepted projects.
- X-2/X-3: thread or remove plugin metadata and document/restore the contribute contract.
- Repair G-3/G-4/G-5/G-6/G-7, re-baseline mutation, rerun the rescue audit, then open rescue → main.
