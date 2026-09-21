# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-21, Asia/Jakarta.
- **Read against:** `d4e1126a`, the reconciliation head of [#462](https://github.com/chahyasantoso/motion5/pull/462), with all seven required jobs passed on [run 35563776472](https://github.com/chahyasantoso/motion5/actions/runs/35563776472). This is the state this file describes: phase 1 is folded into #462, and [#461](https://github.com/chahyasantoso/motion5/pull/461) is closed as superseded rather than merged or reverted. The exact squash commit on `main` is not claimed here.

## Now

- **Reading a closed union is exhaustive in every layer, not only in `runtime/`:** [#451](https://github.com/chahyasantoso/motion5/issues/451) surveyed a codebase where `unreachable` was imported by twelve files and all twelve were in `runtime/`, so every other layer absorbed a new union variant into whichever branch was written last. [#462](https://github.com/chahyasantoso/motion5/pull/462) is the landing PR, reconciled at `d4e1126a` with all seven required jobs passed: it carries phases 2a through 9 as one branch, including `liveWriteChannel` and `authoredLeafPartition` over `AuthoredLeaf`, the `PatchRender` decision that replaced four spellings of one render policy, `Outcome<T, E>` replacing seven hand-correlated `{ optional value + diagnostics[] }` pairs including both public result shapes, `MotionBuild` deleting a definite-assignment assertion on the engine's most failure-sensitive path, ADR-033's external-signal capability derived from `TriggerBinding` rather than stated beside it, the Tier 3 batch across the runtime, the adapters and `packages/react`, and phase 1's `JournalEntry` rollback switch plus the `bindClock` exhaustive sink. The phase 1 work was forwarded from sibling [#461](https://github.com/chahyasantoso/motion5/pull/461), which is closed as superseded rather than merged or reverted, so the reconciled `bindClock` reader retains one exhaustive sink arm and the one relocated-sink import, with no branch race and no rebase owed. [#463](https://github.com/chahyasantoso/motion5/pull/463) and [#464](https://github.com/chahyasantoso/motion5/pull/464) were already closed as superseded by the same branch, and [#465](https://github.com/chahyasantoso/motion5/pull/465) is squashed into it, so #462 is the only pull request #451 still lands through. The remaining unstarted work is the `domain/outcome` dependency question and `PluginDefinition.stage` as a closed capability. The exact commits and runs stay in the owning pull requests rather than here.

## Next in line

- **The mutation baseline [#419](https://github.com/chahyasantoso/motion5/issues/419) is owed once the union work clears:** the `mutate` list names `graph-runtime-state.ts` and `ports/scheduler.ts` on `main`, [#445](https://github.com/chahyasantoso/motion5/pull/445) adds `report.ts`, `registry-phase.ts` and `publish-request.ts` while `diagnostic-report.ts` leaves the list with the module it named, the modules both halves of [#443](https://github.com/chahyasantoso/motion5/issues/443) created are otherwise still absent from it, and the union work above has since added `outcome.ts`, `patch-render.ts` and `lang/exhaustive.ts` to the set a baseline would have to cover. No Stryker run is reported before or after any of that widening, so `break` at 65.42 is an honestly stale number rather than a measured one. The next slice measures it and re-pins the thresholds in the pull request that measures them; [TESTING-STRATEGY.md](./TESTING-STRATEGY.md) owns that rule and says never to move a threshold to keep a run green. Not started, and no run is claimed.

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
