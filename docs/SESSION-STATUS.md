# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-20, Asia/Jakarta.
- **Read against:** `51f23c142e642b6e7ec067a17cbe71759fa06c5a`, the head of [#460](https://github.com/chahyasantoso/motion5/pull/460) that all seven required jobs passed, which is the state this file describes rather than the squash it lands as; that commit belongs to its own pull request, with the exact CI and operation evidence. See ADR-095.

## Now

- **A patch a reader can still ask for is a live one, and it is merged:** [#460](https://github.com/chahyasantoso/motion5/pull/460) squashed onto `main` the second follow-up [#453](https://github.com/chahyasantoso/motion5/pull/453) left owed, after [#459](https://github.com/chahyasantoso/motion5/pull/459). `PatchRegistry.get`, `ProjectHandle.get`, `PatchSource.get`, `PatchStore.getSnapshot` and `usePatch` answer `LivePatch | undefined` rather than `Patch | undefined`, so the invariant is stated at every member that answers current state instead of at two of five. `evict` drops a node's entry before `#notifyTerminal` delivers its terminal patch, which is what makes that sound: a subscriber hears a node's last publication exactly once and a reader of current state is never handed it. One owner of the read-side partition, `liveOrAbsent` in `runtime/patch-registry.ts`, is an exhaustive switch beside the eviction order that guarantees it, and it replaced the ternary `patch-store.ts` used to spell; it is exported on `@motion5/core/internal` and `@motion5/react`, because narrowing an implementor's obligation without shipping the function that discharges it duplicates the partition once per source. `LivePatch` joins the `@motion5/core` and `@motion5/react` entries and the boundary allow-list, and the four variants stay off both. Three React test fakes retained a destroyed patch their own `get` could answer and now drop the entry as the registry does, which was a green suite over a contract defect rather than a retyping. Green at all seven required jobs on the head it merged from. Still owed from the union, unchanged: forwarding the retained pose onto `PatchSource`, requiring a reason on a refusal input, and the `contract/v5` version bump ADR-098 deferred. The exact commits and runs stay in the owning pull requests rather than here.

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
