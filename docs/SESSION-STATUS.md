# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-23, Asia/Jakarta.
- **Read against:** `main` at `83b41a6c`; [#476](https://github.com/chahyasantoso/motion5/pull/476) is merged, so a checkpoint is sealed by its manifest.

## Now

- **[#469](https://github.com/chahyasantoso/motion5/issues/469)'s last three items are in review, re-cut onto `main` after #476 and superseding #475, and the one that was a real slice moved the outcome algebra out of `domain/`:** ADR-103, renumbered because #476 took 102, answers the question ADR-099 deferred. `Outcome` read no Track, Motion, plugin or value snapshot, and its only project-specific tokens were the `E = Diagnostic` default and the `contract/v5` import serving it, so it was never domain knowledge; `contract/` is refused on ADR-099's own ground that a language-level primitive is not a contract this project offers. It lives at `packages/core/src/lang/outcome.ts` with no default, `E` named at all eleven type spellings. That deleted the only two `contract -> domain` imports in a tree with 244 cross-directory declarations, so `boundary-scan.mjs` now refuses any relative `domain/` import from `contract/` and `ports/` through `importsDomainLayer`, and `importsDomainSink` keeps the narrow retired-path question for `adapters/` alone, where three domain imports are still legal; both read canonical specifiers, so a doubled separator or an interior `./` or `..` no longer steps around the anchor. The two loose `toThrow(/stage/)` matchers #472's quality pass accepted on the promise that both would be tightened together are now one helper asserting constructor and exact message, and every coercing arrival's message spells a real member, which is the proof the refusal is by identity rather than by text. The other two items are split out rather than carried: [#474](https://github.com/chahyasantoso/motion5/issues/474) owns the three adapter imports of `domain/` and [#473](https://github.com/chahyasantoso/motion5/issues/473) owns `exactOptionalPropertyTypes`, which is an error inventory no environment without `tsc` at the pinned 5.8.3 can take. No `vitest` or `tsc` run is claimed; the four scanners pass, the retained Prettier 3.6.2 checks every touched path, and the boundary, ADR-integrity and status-shape cases were executed under a shim.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) remains next:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and [#462](https://github.com/chahyasantoso/motion5/pull/462)'s union work has since added `patch-render.ts` and `lang/exhaustive.ts` to the set a baseline would have to cover, with `outcome.ts` now at `lang/outcome.ts`. No Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- [Issue #411](https://github.com/chahyasantoso/motion5/issues/411) stays open on a recorded refusal rather than a fix: a drain replays at the frame it deferred, so the assertion it recommends cannot distinguish the two implementations it is about. `deferred-frame-loss.test.ts` says what each of its cases actually pins, and #417's unreached-frame case is the witness it asked for.
- [Issue #349](https://github.com/chahyasantoso/motion5/issues/349) holds the 2D IK/FK contract study that precedes any separate 3D plugin.
- Packaging follows the current work. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
