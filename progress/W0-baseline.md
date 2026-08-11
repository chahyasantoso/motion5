# W0: recovery audit baseline

- Status: Done
- Branch: `rescue/restore-motionpath-parity`
- Baseline commit: [`913e564a`](https://github.com/chahyasantoso/motion5/commit/913e564a806394c9f11307dfd2442a8f9ffa2620)
- Audit workflow implementation: [`0db6147`](https://github.com/chahyasantoso/motion5/commit/0db6147083dde1cd5808f6fcf22b69c0fd1060fa)
- Oracle repository and revision: `chahyasantoso/motionpath`, `1bc8d044347fa3b1732e6dad3bc8437ad23e2687`

## Dispatch evidence

The workflow was added to the default branch so GitHub Actions would expose it in the UI. The workflow definition was then selected from `rescue/restore-motionpath-parity`, while the `ref` input selected the code under audit.

- Baseline [audit run #5](https://github.com/chahyasantoso/motion5/actions/runs/31481132895)
- Rescue [audit run #6](https://github.com/chahyasantoso/motion5/actions/runs/31481291665)

Each run produced six artifacts: contract, mutation, acceptance, failing-first, build, and the assembled report. Both runs failed the missing-evidence jobs as designed. That is the expected W0 measurement, not a false green.

## Rescue contract result

The contract artifact for run #6 records commit `0db6147083dde1cd5808f6fcf22b69c0fd1060fa` and:

- GSAP contract: pass, 18 tests
- DOM contract: pass, 1 test
- React lifecycle: pass, 1 test
- Boundaries: pass, 6 tests
- End-to-end: missing, `packages/core/test/integration/end-to-end.test.ts`

The missing end-to-end fixture belongs to E2. Its absence does not invalidate the existing GSAP, DOM, React, or boundary evidence.

## Interpretation

W0 is closed: the audit is executable through manual dispatch, uploads durable artifacts, assembles a report, and fails when required evidence is absent. The baseline and rescue runs are linked above. The red jobs identify future work: acceptance mapping, mutation baseline, failing-first on a slice head, declaration build, and end-to-end proof.

## Next exact action

Dispatch the audit with `ref: 74f885ca` and `base: bec08ded` to prove B1 failing-first. Then start B2 from the latest rescue tip.
