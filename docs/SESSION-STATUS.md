# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-19, Asia/Jakarta.
- **Read against:** `8bdfe5554ad623016564a6a68d9da9f13cbfb9cd`, which is the head this rewrite was verified at rather than the head it publishes on; that one belongs to its own pull request, with the exact CI and operation evidence. See ADR-095.

## Now

- **A rule owns its severity and its payload, and closing that is the live area:** [#449](https://github.com/chahyasantoso/motion5/issues/449) is open in review on [#456](https://github.com/chahyasantoso/motion5/pull/456), which supersedes slice 4 of [#452](https://github.com/chahyasantoso/motion5/pull/452) and depends on its slice 1. `contract/rule-id.ts` owns every id `Diagnostic.ruleId` can carry, derives the `plugin-contribution-` family through the one alias map rather than a second hand-maintained list, and `contract/rule-id.test.ts` scans `packages/core/src` and asserts the enumeration covers every id constructed there, including the module constants a literal argument scan cannot see. The six generic constructors take `RuleId` where they took `string`, `validateKeyframes` takes one `scope` where it took a prefix, an alias map and a group flag, and `Diagnostic.ruleId` is `RuleId`, which is the public surface change: a consumer constructing a `Diagnostic` with a rule id of its own invention stops compiling. `contract/rule.ts` owns what each rule is, checked total against that enumeration by `satisfies`, and `Diagnostic` is flat again: `severity` derives from the rule and `ids` is required and empty for a rule that names none, so `asDiagnostic`, `DiagnosticFields` and `contract/diagnostic-ids.ts` are deleted rather than re-justified. One constructor builds every diagnostic, every producer and every former raw literal forwards to it, and the `severity` parameter is deleted, so no call site can name one. Review and the records are what remain owed rather than code. Green at all seven jobs on the head named above; it is not merged, and the runs that measured it belong to that pull request.

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
