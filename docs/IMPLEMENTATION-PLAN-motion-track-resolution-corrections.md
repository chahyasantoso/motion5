# Corrections to `IMPLEMENTATION-PLAN-motion-track-resolution.md`

This amendment is part of the implementation plan and must be read together with `docs/IMPLEMENTATION-PLAN-motion-track-resolution.md`. Both were written before the slice was executed; the items below are the only places reality disagreed with the plan.

Section 1 stands with one amendment: C8's `disposeTracks` default is now `false`, recorded below. Every other locked decision, C1 through C7 and C9 through C10, was implemented as written.

## Five test files construct Motion directly, not one

Section 2 fact 9 and section 3.5 treated `packages/core/test/unit/domain/motion.test.ts` as the only test that builds a `Motion` directly. It is not. These do as well, at eight call sites between them:

- `packages/core/test/integration/phase2-motion-scheduling.test.ts`, tests 3 and 4.
- `packages/core/test/integration/phase3-trigger-port.test.ts`, tests 2 and 5.
- `packages/core/test/integration/motion-trigger-types.test.ts`, all three cases.
- `packages/core/test/integration/motion-trigger-lifecycle.test.ts`, its single case.

Section 4.4 listed `phase2-motion-scheduling.test.ts`, `phase3-trigger-port.test.ts`, and `motion-trigger-lifecycle.test.ts` as "must stay byte-identical", and told the implementer to stop and escalate if any of them needed an edit. That instruction rested on a wrong inventory: none of these files can compile once `resolveTrack` is required, so the frozen list was wrong rather than the change.

**Correction.** Remove those three files, plus `motion-trigger-types.test.ts`, from the 4.4 frozen list. Each receives the same mechanical treatment section 3.5 already sanctions for `motion.test.ts`. Test names, assertions, and expected values are unchanged in all five files.

Two construction styles are in play, and both are legitimate:

- Suites holding real `Track` instances register them in a `createFakeTrackRegistry` and pass `resolveTrack: registry.resolveTrack`.
- Suites holding `vi.fn()` track doubles pass `resolveTrack: () => current as never` directly. Standing up a registry for a single double would be ceremony, and the `as never` cast was already there before this slice.

**Do not hand-inventory the call sites.** `npm run typecheck` enumerates every one of them exactly, because dropping `track` from `MotionTrackEntry` makes each site a `TS2353`. Run it first and work the list.

The rest of 4.4 stands, and it earns its keep: `issue-114-motion-track-regressions.test.ts` and `replace-motion-track.test.ts` are genuinely untouched and green, which is what keeps ADR-029 evidenced independently of this slice.

The slice is larger than sections 3 and 6.5 predicted, but the count belongs in the pull request body, not here. `docs/PR-WORKFLOW.md` defines what a semantic file is and says to state the number once; earlier revisions of this document carried a second count that disagreed with the PR's, which is exactly the failure that rule now prevents.

## C8 amended: `disposeTracks` defaults to `false`

C8 said the flag stays with a `true` default, and section 5 listed flipping it under forbidden. The implementation shipped `options.disposeTracks ?? false`. This section is the maintainer decision to **keep** `false` and amend C8, rather than revert. C8 was not implemented as written, and no other sentence in this document should be read as claiming otherwise.

Option C invalidates the premise C8 rested on. `disposeTracks: true` means a `Motion` disposes compiled Tracks it reached through the resolver, and under option C the resolver's caller owns those Tracks. A borrower that kills a lender's instance is precisely the two-owner arrangement this slice exists to delete, so disposing nothing is the default that agrees with the invariant, and the flag becomes an explicit opt-in for the callers that genuinely delegate lifetime.

The amended text of C8 reads:

> **C8. `disposeTracks` stays as an option, default `false`.** A `Motion` never disposes a Track it merely resolved. Set it `true` only when the resolver's caller delegates Track lifetime to that `Motion`, which is what directly constructed Motions in the unit suite do. `Engine` continues to pass `false` explicitly. Do not remove the flag.

Consequences, recorded rather than absorbed:

- **Production blast radius is zero.** `Engine` passes `disposeTracks: false` explicitly, and `Motion` and `MotionOptions` are package-private with `packages/core/src/index.ts` untouched, so nothing outside this package can observe the default.
- **Suites that own their Tracks now opt in explicitly.** `motion.test.ts`'s helper takes a third `disposeTracks` parameter and its owner-first disposal test passes `true`; `motion-trigger-lifecycle.test.ts` and `motion-trigger-types.test.ts` pass `disposeTracks: true` alongside their resolver injection. Those three additions are behavior opt-ins, **not** the mechanical constructor updates licensed above, and they are listed here for exactly that reason. No test name, assertion, or expected value changed in any of them.
- **A fourth new test file exists.** `packages/core/test/unit/domain/motion-dispose-ownership.test.ts` is beyond section 3.6's two-file list. Its three cases are numbered C-14 through C-16 in the shared evidence series.
- **ADR-031 carries the rationale** under `Disposal ownership`, and names the same three cases as its evidence.

## Evidence case ids are one flat series

The unit additions in `motion-track-resolution.test.ts` originally restarted at `C-9`, which already named an integration case in `option-c-track-resolution.test.ts`. They are renumbered **C-17 through C-20**, leaving one unambiguous series: C-1 to C-8 and C-17 to C-20 in the unit resolution suite, C-9 to C-13 in the integration suite, C-14 to C-16 in the disposal ownership suite. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` now enforces it, and `docs/PR-WORKFLOW.md` records the convention.

Related, and worth stating so the next reader does not read it as drift: `addTrack` and `replaceTrack` resolve the compiled Track **before** they mutate, where section 3.1's sketch resolved at the tail. That is deliberate. A rejected mutation is then atomic instead of leaving a ghost id that poisons the next progress sweep, and C-17 through C-20 prove it. `ProjectRuntime.#addTrack` calls `compileTrack` before `addMotionTrack`, so nothing regresses.

## The `tracks.get(` grep gate expects the wrong number

Section 6.3 says `engine.ts` should contain exactly four `tracks.get(` sites after the change, and names `compile`, the `setProgress` hook, `disposeTrack`, and the `resolveTrack` closure.

**Correction.** The correct count is **five**. The gate omitted the `compose` resolver, which reads `tracks.get(node.id)!.compose(...)` and is one of the reasons the compiled map was already the de facto source of truth. Five sites, all in `Engine`, all reading the map it owns. No other file in `packages/core/src` resolves a compiled Track for a `Motion`.

Every other gate in section 6 held as written.

## Note on section 6.2

The gate stands, but its premise expired: the `docs/SESSION-STATUS.md` formatting drift behind runs 32030244298 and 32027461324 was already repaired on the base branch, and `format:check` is green there. Keep running the formatter before pushing anyway, because this slice edits that file again.
