# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-22, Asia/Jakarta.
- **Read against:** `main` at `2f553d68`; [#471](https://github.com/chahyasantoso/motion5/pull/471) is merged.

## Now

- **#469's `PluginDefinition.stage` item is in review as checkpoint `cp006`:** `PluginStage` closes the stage vocabulary to `"prepare" | "compose"`, `VALID_STAGES` becomes a record keyed by that union so a third member owes an entry beside an arm rather than only a set element, and `stageRank` reads both members through a `switch` ending at `unreachable(stage)` instead of testing one member and ranking every other value last. The type is exported from the package entrypoint and allow-listed in `boundary-scan.mjs`, and `plugins.test.ts` pins the declaration, the narrowed field and both arms off the source the way `bind-clock-exhaustive` reads its own. The registration guard still refuses an unknown stage at run time, so the refusal set does not move: `Object.hasOwn` and the retired `Set` answer identically for every input, including `toString` and `__proto__`. The four scanners pass on the working tree; no `npm`, `vitest` or `prettier` run is claimed and required CI on the published head is the authority. What is left of [#469](https://github.com/chahyasantoso/motion5/issues/469) after this is the inward `domain/outcome` imports ADR-099 owns, `exactOptionalPropertyTypes`, and the archived references ADR-093 leaves alone.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) remains next:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and [#462](https://github.com/chahyasantoso/motion5/pull/462)'s union work has since added `outcome.ts`, `patch-render.ts` and `lang/exhaustive.ts` to the set a baseline would have to cover. No Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

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
