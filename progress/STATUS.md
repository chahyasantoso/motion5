# Motion5 recovery status

This is the **single source of truth** for recovery progress. Update this file after every slice branch or PR changes state. `WAVE-PLAN.md` contains the detailed plan and acceptance guidance, but its prose is not authoritative for status.

Last reviewed: 2026-08-12

## Status vocabulary

- `Done` means merged into `rescue/restore-motionpath-parity` with the linked run URLs.
- `Done, gate open` means the slice is merged with its own evidence, but a shared wave gate still has none.
- `In progress` means a branch or PR exists and its evidence is incomplete or red.
- `Not started` means no branch work exists yet.

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
| D2  | Planted boundary self-test                      | In progress     |
| D3  | Acceptance evidence gates                       | In progress     |
| E1  | Required declaration build                      | Not started     |
| E2  | Real end-to-end product path                    | Not started     |
| E3  | Mutation baseline and ratchet                   | Not started     |

## Current next action

Dispatch the Recovery audit against `fix/D2-boundary-self-test` with base `2409672471cf673594c9970864dc8ff9a93184cd` and no exception, then merge [PR #57](https://github.com/chahyasantoso/motion5/pull/57). Slice CI is already green on the head commit; the audit is the only outstanding gate.

[PR #58](https://github.com/chahyasantoso/motion5/pull/58) already carries D3 work. It is parked until D2 merges, because D3 rebases onto the D2 rescue tip and its acceptance map must name the boundary self-test D2 finalizes.

Open shared gates that no merged slice closes: Wave A exit, acceptance mapping (D3), required declaration build (E1), end-to-end fixture (E2), and the mutation baseline (E3).

## Slices

### W0: Rescue loop and audit baseline

- Status: Done. Branch `rescue/restore-motionpath-parity`.
- Files: [WAVE-PLAN](../WAVE-PLAN.md), [audit workflow](../.github/workflows/recovery-audit.yml), [baseline record](W0-baseline.md).
- Evidence: five-job workflow live in [`0db6147`](https://github.com/chahyasantoso/motion5/commit/0db6147083dde1cd5808f6fcf22b69c0fd1060fa). Baseline [audit run #5](https://github.com/chahyasantoso/motion5/actions/runs/31481132895) and rescue [audit run #6](https://github.com/chahyasantoso/motion5/actions/runs/31481291665) both produced six artifacts. Red missing-gate jobs are expected baseline measurements, not silent green claims.

### A1: Final-value memo consistency

- Status: Done, gate open. Branch `fix/A1-final-value-memo`.
- Files: [publisher](../packages/core/src/runtime/graph-publisher.ts), [test](../packages/core/test/integration/publisher-output-merge-consistency.test.ts).
- Evidence: [`1d59c087`](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a), re-proved on rescue by the A3 green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471235572).

### A2: Preserve subscriber errors

- Status: Done, gate open. Branch `fix/A2-subscriber-errors`.
- Files: [registry](../packages/core/src/runtime/patch-registry.ts), [test](../packages/core/test/unit/runtime/patch-registry-subscriber-errors.test.ts).
- Evidence: [`1d59c087`](https://github.com/chahyasantoso/motion5/commit/1d59c087231c3c3f9c3cde6822d34835ee94705a), re-proved on rescue by the A3 green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471235572).

### A3: Guard subscriber-triggered reentrancy

- Status: Done, gate open. Branch `fix/A3-publisher-reentrancy`. [Slice log](A3.md).
- Files: [registry](../packages/core/src/runtime/patch-registry.ts), [publisher](../packages/core/src/runtime/graph-publisher.ts), [runtime](../packages/core/src/runtime/graph-runtime.ts), [test](../packages/core/test/unit/runtime/publisher-reentrancy.test.ts).
- Evidence: merged into rescue as [`bec08ded`](https://github.com/chahyasantoso/motion5/commit/bec08ded24da9b5febdca19be81be6edd84cea53); green [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471235572), red [CI](https://github.com/chahyasantoso/motion5/actions/runs/31471934722). The Wave A exit gate remains open.

### B1: Prepare-stage plugin contribution

- Status: Done. Branch `fix/B1-track-contribution`. [Slice log](B1.md).
- Files: [track](../packages/core/src/domain/track.ts), [plugins](../packages/core/src/domain/plugins.ts), [test](../packages/core/test/unit/domain/track-contribution.test.ts).
- Evidence: merged into rescue as [`74f885ca`](https://github.com/chahyasantoso/motion5/commit/74f885ca08f957bea1d552182fcdf33a2b62e70f) from [PR #47](https://github.com/chahyasantoso/motion5/pull/47); green slice [CI](https://github.com/chahyasantoso/motion5/actions/runs/31472986155); failing-first audit [#31483412238](https://github.com/chahyasantoso/motion5/actions/runs/31483412238) passed.

### B2: Real GSAP multi-stop compilation

- Status: Done. Branch `fix/B2-gsap-stop-compilation-clean`. [Slice log](B2.md).
- Files: [GSAP adapter](../packages/core/src/adapters/interpolator/gsap.ts), [multi-stop test](../packages/core/test/contract/gsap-multi-stop.test.ts).
- Evidence: merged into rescue as [`a69836a9`](https://github.com/chahyasantoso/motion5/commit/a69836a9ce823e7583699b46d7460e14301c5133) from [PR #51](https://github.com/chahyasantoso/motion5/pull/51); green slice [CI](https://github.com/chahyasantoso/motion5/actions/runs/31485624082); failing-first audit [#31486238764](https://github.com/chahyasantoso/motion5/actions/runs/31486238764) passed.

### C1: React store resubscription

- Status: Done. Branch `fix/C1-react-store-lifecycle`. [Slice log](C1.md).
- Files: [store](../packages/react/src/patch-store.ts), [lifecycle test](../packages/react/test/patch-store-lifecycle.test.ts).
- Evidence: merged into rescue as [`25cff099`](https://github.com/chahyasantoso/motion5/commit/25cff099a1b2f9a73e990651f73926f7d8b0c3fa) from [PR #52](https://github.com/chahyasantoso/motion5/pull/52); failing-first [audit run #13](https://github.com/chahyasantoso/motion5/actions/runs/31495880105) proved base `a69836a9` red and C1 `62eb3334` green.

### C2: React hook and public exports

- Status: Done, gate open. Branch `fix/C2-react-public-surface`. [Slice log](C2.md).
- Files: [React entry](../packages/react/src/index.ts), [public import test](../packages/react/test/public-package-surface.test.ts).
- Evidence: merged into rescue as [`5707bc7b`](https://github.com/chahyasantoso/motion5/commit/5707bc7be98ba5fa3e72f1c6c9f9980510714f36) from [PR #54](https://github.com/chahyasantoso/motion5/pull/54); recovery audit [#31507507062](https://github.com/chahyasantoso/motion5/actions/runs/31507507062) proved failing-first red/green and GSAP, DOM, React lifecycle, and boundaries green. Shared acceptance, mutation, end-to-end, and declaration gates remain open.

### C3: DOM metadata, serialization, and clear coverage

- Status: Done. Branch `fix/C3-dom-contract`. [Slice log](C3.md).
- Files: [DOM adapter](../packages/core/src/adapters/dom.ts), [test](../packages/core/test/integration/dom-patch-apply.test.ts).
- Evidence: merged into rescue as [`c1aeb6ce`](https://github.com/chahyasantoso/motion5/commit/c1aeb6ce77ba312fc4dbb952204889af56f09d8d) from [PR #55](https://github.com/chahyasantoso/motion5/pull/55); recovery audit [#31508945158](https://github.com/chahyasantoso/motion5/actions/runs/31508945158) passed the DOM contract, boundaries, React lifecycle, and GSAP contract.
- Failing-first disposition: coverage-only slice, merged under the documented audit exception because the adapter behavior predates the test. Serializer metadata and plugin-declared internal keys stay deferred; the plugin contract has no serializer field to test against.

### D1: Discover consumer packages

- Status: Done. Branch `fix/D1-boundary-discovery`. [Slice log](D1.md).
- Files: [scanner](../scripts/boundary-scan.mjs).
- Evidence: merged into rescue as [`24096724`](https://github.com/chahyasantoso/motion5/commit/2409672471cf673594c9970864dc8ff9a93184cd) from [PR #56](https://github.com/chahyasantoso/motion5/pull/56); recovery audit [#31511223275](https://github.com/chahyasantoso/motion5/actions/runs/31511223275) proved the planted unlisted-consumer test red on rescue and green on D1.

### D2: Planted boundary self-test

- Status: In progress. Branch `fix/D2-boundary-self-test`, [PR #57](https://github.com/chahyasantoso/motion5/pull/57). [Slice log](D2.md).
- Files: [scanner](../scripts/boundary-scan.mjs), [self-test](../packages/core/test/unit/scripts/boundary-scan.test.ts), [fixtures](../scripts/boundary-scan-fixtures.ts).
- Scanner gap closed: the parent scanned the five core layers plus a hardcoded `engine.ts`, so `packages/core/src/index.ts` was checked for export names only and `packages/core/src/internal.ts` was never read. Both public entries could import a renderer or carry banned vocabulary while the boundaries job stayed green.
- Evidence: slice [CI #31547163284](https://github.com/chahyasantoso/motion5/actions/runs/31547163284) is green on `quality`, `boundaries`, and `integration`. The earlier red run [#31512814867](https://github.com/chahyasantoso/motion5/actions/runs/31512814867) failed because the self-test asserted the banned fixture was clean, which is unrelated to the scanner.
- Blocking exit: a Recovery audit dispatch with base `2409672471cf673594c9970864dc8ff9a93184cd` and no exception. The failing-first leg must be red on the base with a behavioral assertion on `packages/core/src/internal.ts: renderer or engine import`, not an import-resolution error.

### D3: Acceptance evidence gates

- Status: In progress. Branch `fix/D3-evidence-gates`, [PR #58](https://github.com/chahyasantoso/motion5/pull/58).
- Files: planned `scripts/acceptance-scan.mjs`, `docs/acceptance-map.json`, and audit artifact durability.
- Evidence: none accepted yet. The failing-first half of this slice already moved into the W0 audit workflow. Parked until D2 merges so the acceptance map can name the finalized boundary self-test.

### E1: Required declaration build

- Status: Not started. Branch `fix/E1-required-build`.
- Files: [CI](../.github/workflows/ci.yml), package exports.
- Evidence: none yet.

### E2: Real end-to-end product path

- Status: Not started. Branch `fix/E2-end-to-end-proof`.
- Files: planned integration fixture.
- Evidence: none yet. Depends on A1, B1, B2, C3, and E1.

### E3: Mutation baseline and ratchet

- Status: Not started. Branch `fix/E3-mutation-gate`.
- Files: planned Stryker config and audit artifact.
- Evidence: no baseline yet. The audit correctly fails until the config exists; never invent the threshold.
