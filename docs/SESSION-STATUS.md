# Session status

**Captured:** 2026-08-17, Asia/Jakarta  
**Branch:** `feat/adopt-motion-track`  
**Phase:** runtime mutation model remediation, W1 of five work packages. Phase 5 and Phase 6 remain as recorded below.  
**Next action:** land W1, then start W2 (transactional `adopt`/`destroyAdopted`).

This document reports current implementation reality. The detailed contract remains in `docs/PHASE5-DETAILED-PLAN.md`. The current effort is specified in `docs/IMPLEMENTATION-PLAN-runtime-mutation-model.md`, assessed in `docs/ASSESSMENT-AND-SOLUTION-runtime-mutation-model.md`.

## Runtime mutation model (current effort)

An editor use case (start from an empty project, add and remove motions, tracks, and observation edges at runtime) was pressure-tested against the existing mutation API. `docs/PROBLEM-STATEMENT-runtime-mutation-model.md` records the three problems found; the assessment verified them against the live code and found four more.

| Package | Scope | State |
| --- | --- | --- |
| W1 | Builder cache correctness (A3 cached failures, A5 owner-blind key) | in review, [#109](https://github.com/chahyasantoso/motion5/pull/109) |
| W2 | Transactional `adopt`/`destroyAdopted` (P1, A1) | not started |
| W3 | Freeze and validate adopted tracks (A2) | not started |
| W4 | Runtime `addMotion`/`destroyMotion` (P2) | not started |
| W5 | Unified store, capability handles, `replaceTrack` (P3) | not started |

W1 precedes W2 deliberately: W2 makes a rejected mutation retryable, and against the unfixed cache a retry could succeed with a silently dropped observation edge.

### Known defects, not yet fixed

- **P1** `destroyAdopted` runs five irreversible side effects before the only fallible step, so a rejected destroy leaves an un-destroyable, un-re-adoptable node stuck in `status:"error"` after its subscribers already received a terminal `"destroyed"` patch. W2.
- **A1** `adopt` has the same defect. A rejected adopt burns the track id for the runtime's lifetime and leaks the compiled `Track`. W2.
- **A2** Adopted tracks are never frozen and bypass `validateV5`, so the identity-keyed builder cache invariant is unenforced on exactly the objects an editor mutates. W3.
- **P2** No runtime-callable way to create or destroy a `Motion`; `#buildProjectSnapshot` reads the frozen `#project.motions`, so the `Unknown motion` guard is load-bearing rather than merely defensive. W4.

### Corrections to earlier claims

- `Engine.load()` never reads `MotionDefinition.trigger`. Every motion is constructed with `createManualTriggerPort()`, so `trigger.type` (`scroll`/`time`/`manual`) is inert in core and no scroll or time driver exists. A runtime `Motion` is worth creating for independent signaling, `stagger`, and its own `#position`, not for a trigger.
- `adopt()`'s pre-commit side effects are `compileTrack` and `#adopted.set`, not `mount()`, which runs after `replaceGraph`.

## W1 evidence

- Red: [`5c20bfc`](https://github.com/chahyasantoso/motion5/commit/5c20bfc50c82596f7b10cb52ec393f1936af288e), run [31986624467](https://github.com/chahyasantoso/motion5/actions/runs/31986624467). 4 failed, 349 passed; every failure assertion-level, none import-resolution or config. Archived at `logs/31986624467/` on `ci-logs`.
- First run to execute at all on a PR into `feat/adopt-motion-track`: the `pull_request` `branches:` filter matched the base branch, so PRs into integration branches were silently skipped. [#108](https://github.com/chahyasantoso/motion5/pull/108) merged with zero checks. Fixed in [`6727ee3`](https://github.com/chahyasantoso/motion5/commit/6727ee3f00fcfec8cf11884423ad616f23d9ca40).

## Verified recovered behavior

- Cross-motion references use one classifier in `core/graph/references.ts`.
- Known but unavailable sources publish blocked pending patches and recover without fabricated values.
- Runtime-adopted free tracks join the graph under `~/trackId` through the shared `qualifyFreeTrack` helper with owner-only destruction.
- Diagnostics use one bounded inspection buffer while patches and batch summaries remain the live delivery path.
- Unmounting evicts detached nodes' retained patches through the registry owner, preserves subscribers, reuses the existing pending/blocked path, and recovers on remount with newer revisions.
- Node destruction is represented on the observation wire as a terminal `"destroyed"` patch ([#108](https://github.com/chahyasantoso/motion5/pull/108)). Note that P1 can deliver it when the destroy ultimately fails.

## Phase 5 evidence

- P5-01 exact-head CI: [31777751696](https://github.com/chahyasantoso/motion5/actions/runs/31777751696).
- P5-02 exact-head CI: [31780297529](https://github.com/chahyasantoso/motion5/actions/runs/31780297529).
- P5-03 exact-head CI: [31780874122](https://github.com/chahyasantoso/motion5/actions/runs/31780874122).
- P5-04 behavior PR [#102](https://github.com/chahyasantoso/motion5/pull/102) merged at [`c52293f`](https://github.com/chahyasantoso/motion5/commit/c52293f9554a771a366dd76ccc3890ffa0db580a); lifecycle companion PR [#103](https://github.com/chahyasantoso/motion5/pull/103) merged at [`3b376ad`](https://github.com/chahyasantoso/motion5/commit/3b376ad59365aec0851f768207792929383a2ed7). Exact-head CI [31782076249](https://github.com/chahyasantoso/motion5/actions/runs/31782076249) passed quality, integration, boundaries, build, end-to-end, performance, and prettier.
- P5-04 red-first behavior test: [`a75da68`](https://github.com/chahyasantoso/motion5/commit/a75da68b358641bc45b3576a7212c0cdb550a641). Focused registry red test: [`942c2f8`](https://github.com/chahyasantoso/motion5/commit/942c2f80a67753f6259b12a664156a8ba039095c).

## Guardrails

- One owner per state transition.
- No graph rebuild or motionpath wholesale copy.
- No compatibility aliases, flags, facades, or placeholder tests.
- No renderer imports in core layers.
- Every recovery slice starts with a failing-first test on its parent commit.
- Docs, types, tests, and status move together.
- A required check that only runs for some base branches is not a gate. Do not filter `pull_request` by base.
