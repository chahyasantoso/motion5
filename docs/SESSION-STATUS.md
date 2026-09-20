# Session status

Current project state only. Replace stale entries rather than append history. The four sections below are the complete shape, **Now** and **Next in line** carry exactly one bullet each, and no bullet states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces all three and the byte ceiling.

- **Captured:** 2026-09-20, Asia/Jakarta.
- **Read against:** the head of the pull request named below that all seven required jobs passed, which is the state this file describes rather than the squash it lands as; that commit belongs to its own pull request, with the exact CI and operation evidence. See ADR-095.

## Now

- **A closed union read outside `runtime/` ends at the same sink:** the first phase of [#451](https://github.com/chahyasantoso/motion5/issues/451)'s resurveyed plan, and the first two `unreachable` call sites outside `runtime/` since ADR-092 wrote the rule. `ObservationState.rollback` reads the undo journal as a `switch` over all four verbs ending at `unreachable`, replacing an `if`/`else if` chain whose bare `else` meant `remove-edge`, so an edge-carrying verb added later would have deleted a live edge during the one operation in that class that must not invent a mutation. `bindClock` in `engine.ts` gains the `default` arm that `engine.md` and ADR-032 already described it as having; before it, a `ClockBinding` kind arriving across the `TriggerFactory` seam registered no consumer and the Motion advanced on nothing. The second is behavioural evidence and the first is a source guard on the one reader, because the journal is a private union read by a private method and a mirror of it in the suite would be a second owner. Adoption elsewhere is unchanged and still owed: 14 importers of `unreachable`, all in `runtime/`, and #451 phases 2 through 9 own the rest, starting with the eleven one-sided `AuthoredLeaf` reads. The exact commits and runs stay in the owning pull request rather than here.

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
