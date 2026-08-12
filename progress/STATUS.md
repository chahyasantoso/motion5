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
| C3  | DOM metadata, serialization, and clear coverage | Done, gate open |
| D1  | Discover consumer packages                      | Done            |
| D2  | Planted boundary self-test                      | Done            |
| D3  | Acceptance evidence gates                       | Done            |
| E1  | Required declaration build                      | Done, gate open |
| E2  | Real end-to-end product path                    | Done            |
| E3  | Mutation baseline and ratchet                   | Done            |

## Current next action

**Blocked on the post-E3 review.** The final rescue-to-main PR does not open until the four blocking defects in [`docs/CODE-REVIEW-POST-E3.md`](../docs/CODE-REVIEW-POST-E3.md) are fixed and their gates measure the property they claim to gate.

Blocking defects, in the order they should be fixed:

1. **P0-1** `ProjectRuntime.seek()` advances the same counter the clock checks, so the next real tick throws from inside the clock's listener loop and the RAF is never rescheduled. One seek kills every animation for the page's lifetime.
2. **P0-2** the GSAP adapter creates an unpaused timeline, adding a second ticker and letting proxy state drift behind `Track`'s dirty flag. Every existing GSAP test hand-rolls its own paused timeline, so the line is never executed.
3. **P0-3** stop compilation indexes segments by stop ordinal shared across properties, so per-property timing and easing are corrupted and stop positions are treated as deltas rather than absolute positions.
4. **P0-4** the default DOM writer assigns non-CSS keys (`x`, `y`, `rotation`, `scale`) as expando properties, so transforms never render, and omitted-key removal writes `undefined` into a `CSSStyleDeclaration`, which is a silent no-op.

The E3 merge commit is [`d66e316e`](https://github.com/chahyasantoso/motion5/commit/d66e316e9408447b8262dbe3cc2f7bfbc4742cbf).

## Reopened gates

- **E1** is complete against evidence that cannot fail. Both packages declare their public entry as TypeScript source (`"types": "./src/index.ts"`), so the audit's declaration-build job verifies that a source file exists and emits into a throwaway directory nothing imports. `ci.yml` also contains no build job and no dedicated end-to-end job, so E1's exit criterion is not on the required-check path. See G-1, G-2, and G-7 in the review.
- **C3** is proven only by an injected recording writer that asserts the call rather than the render, and the shipped default writer cannot render transforms (P0-4). The slice's `internalKeys` and output-serializer metadata are declared on `PluginDefinition` and read nowhere (X-2).

## Recent evidence

- Post-E3 code review: [`docs/CODE-REVIEW-POST-E3.md`](../docs/CODE-REVIEW-POST-E3.md), commit [`515354bb`](https://github.com/chahyasantoso/motion5/commit/515354bbf11a338ca50dde3e400a532b2ab5b049). Four blocking defects, eight high-severity findings, seven governance-gate gaps, three unported oracle behaviors. Source-traced, not executed.
- E2 merged via clean replay PR [#63](https://github.com/chahyasantoso/motion5/pull/63), merge commit [`4b4abdd1`](https://github.com/chahyasantoso/motion5/commit/4b4abdd1c3ddcb57bc1ce6c2444a54ce65bf38de).
- E2 audit: [run #31594467503](https://github.com/chahyasantoso/motion5/actions/runs/31594467503), contract, acceptance, failing-first, and build green; mutation assigned to E3.
- E3 CI: [run #31605613193](https://github.com/chahyasantoso/motion5/actions/runs/31605613193), quality, integration, boundaries, and performance passed.
- E3 audit: [run #31605795601](https://github.com/chahyasantoso/motion5/actions/runs/31605795601), all five jobs passed with native Stryker score 65.43% total and 68.79% covered.
- E3 mutation baseline: 333 Killed, 152 Survived, 25 NoCoverage, 2 Timeout across 512 mutants. The enforced native-score ratchet is 65.42%, one hundredth below the rounded 65.43 display to avoid a floating-point boundary failure. The review notes that the 152 survivors and 25 uncovered mutants in runtime and adapters are where the four blocking defects live, so this baseline records their absence of coverage rather than their absence.

## Remaining work

- Fix P0-1 through P0-4 and land the flat projected-input change (X-1) that unblocks the registry churn finding.
- Repair the gates that cannot currently fail: acceptance must prove tests ran, failing-first must require an assertion-level failure, the mutation job must actually print the score it enforces, and `ci.yml` must require build and end-to-end.
- Re-dispatch the recovery audit and re-baseline mutation once the gates are honest.
- Rerun rescue checks.
- Open the final rescue-to-main PR.
