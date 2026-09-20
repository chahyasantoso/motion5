# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-20, Asia/Jakarta.
- **Read against:** `ac6a771c62e7b253369abcf55a96fd958783e1cf`, which is the head this rewrite was verified at rather than the head it publishes on; that one belongs to its own pull request, with the exact CI and operation evidence. See ADR-095.

## Now

- **A patch carries only the payload its status owns, and the retention question is answered:** [#450](https://github.com/chahyasantoso/motion5/issues/450) is the live area on [#453](https://github.com/chahyasantoso/motion5/pull/453), and [#449](https://github.com/chahyasantoso/motion5/issues/449) is merged with [#452](https://github.com/chahyasantoso/motion5/pull/452), so `contract/rule-id.ts` owns every id `Diagnostic.ruleId` can carry, `contract/rule.ts` owns each rule's severity and whether it names ids, `Diagnostic` is one flat frozen interface whose `ids` is required and empty for a rule naming none, and one constructor builds every diagnostic with no argument position in which a call site could name a severity. On #450, slice 1 of ADR-098 has landed and it is the retention decision rather than a type change: `PatchRegistry` retains the last accepted `ready` patch per node and answers it through `lastReady(nodeId)`, so the last good pose is the registry's retained answer rather than a payload on a patch whose status says the node is not ready, and unmount, eviction and disposal drop it while a suppressed republication cannot move it. Nothing on the observation wire moved: `Patch`, `PublishInput`, `samePatch`, `#notifyTerminal` and the asymmetric carry-forward in `publish` are all unchanged, and one case is green on both sides deliberately to pin that. The next slice owes the complete reader census before any type moves. Red then green on the branch, with the exact commits and runs in that pull request rather than here.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) is owed and nothing else is queued:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and no Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

## Open, and not scheduled

- [Issue #328](https://github.com/chahyasantoso/motion5/issues/328) remains open for remaining activation/failure-recovery exercises, lifecycle limits, and maintenance usage/replacement validation before any separately confirmed retirement. Historical workflows and the manual formatting escape hatch are retained; dependency maintenance through the bounded API protocol remains disabled.
- [Issue #411](https://github.com/chahyasantoso/motion5/issues/411) stays open on a recorded refusal rather than a fix: a drain replays at the frame it deferred, so the assertion it recommends cannot distinguish the two implementations it is about. `deferred-frame-loss.test.ts` says what each of its cases actually pins, and #417's unreached-frame case is the witness it asked for.
- [Issue #349](https://github.com/chahyasantoso/motion5/issues/349) holds the 2D IK/FK contract study that precedes any separate 3D plugin.
- Phase 6 packaging follows the current phase. [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) owns scope; no implementation is claimed here.

## Where the rest of it lives

- Slice narrative, exact SHAs, CI links, and red/green evidence: the owning PR and ADR, not this file.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor and status discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation and activation contracts: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git at this path; do not duplicate it into another status database.
