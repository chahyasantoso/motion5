# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-20, Asia/Jakarta.
- **Read against:** `d700dbf988611165eb9ef2709b73854a68baf83c`, the squash of [#453](https://github.com/chahyasantoso/motion5/pull/453) onto `main`, which is the state this file describes rather than the head this rewrite publishes on; that one belongs to its own pull request, with the exact CI and operation evidence. See ADR-095.

## Now

- **A patch carries only the payload its status owns, and it is merged:** [#450](https://github.com/chahyasantoso/motion5/issues/450) landed through [#453](https://github.com/chahyasantoso/motion5/pull/453) and is squashed onto `main`. `Patch` is a union discriminated by `status`: `ReadyPatch` owns `values`, `sourceProgress`, `sourceRevisions` and `diagnostics`, `BlockedPatch` and `ErrorPatch` own `diagnostics` alone, `DestroyedPatch` owns identity and status, and `PatchStatus` is read off the union rather than spelled beside it. `PublishInput` is discriminated the same way, so `destroyed` is no longer publishable from outside and a refusal carries no placeholder progress. The three asymmetric carry-forward expressions in `PatchRegistry.publish` and the four empty members in `#notifyTerminal` are deleted, `samePatch` is an equality per variant over `LivePatch`, and the pose a blocked node used to republish is the registry's retained answer through `lastReady(nodeId)`, which `runtime/publisher-outcome.ts` reads and no consumer surface forwards yet. One behaviour change beyond the deletion: a source that never published `ready` answers absent rather than an empty record, so its readers are classified pending and publish a blocked patch naming it. Green at all seven required jobs on the head it merged from. What it left owed is the live area now, and it is being taken one slice at a time: forwarding the retained pose onto `PatchSource`, narrowing `PatchRegistry.get` to `LivePatch`, requiring a reason on a refusal input, and the `contract/v5` version bump ADR-098 deferred. The exact commits and runs stay in the owning pull requests rather than here.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) is owed once the union's follow-ups clear:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and no Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

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
