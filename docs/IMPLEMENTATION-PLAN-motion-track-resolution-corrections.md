# Corrections to `IMPLEMENTATION-PLAN-motion-track-resolution.md`

This amendment is part of the implementation plan and must be read together with `docs/IMPLEMENTATION-PLAN-motion-track-resolution.md`. Both were written before the slice was executed; these two items are the only places reality disagreed with the plan.

Section 1 is untouched. Every locked decision, C1 through C10, was implemented as written.

## Three test files construct Motion directly, not one

Section 2 fact 9 and section 3.5 treated `packages/core/test/unit/domain/motion.test.ts` as the only test that builds a `Motion` directly. It is not. These also do, at four call sites:

- `packages/core/test/integration/phase2-motion-scheduling.test.ts`, tests 3 and 4.
- `packages/core/test/integration/phase3-trigger-port.test.ts`, tests 2 and 5.

Section 4.4 therefore listed both files as "must stay byte-identical" and told the implementer to stop and escalate if either needed an edit. That instruction was based on a wrong inventory: neither file can compile once `resolveTrack` becomes required, so the frozen list was wrong rather than the change.

**Correction.** Remove those two files from the 4.4 frozen list. They receive the same mechanical treatment section 3.5 already sanctions for `motion.test.ts`: register the compiled `Track` in a `createFakeTrackRegistry`, pass `{ id }` and `{ id, duration }` entries, inject `resolveTrack`. Test names, assertions, and expected values are unchanged in all three files.

The rest of 4.4 stands, and it earns its keep: `issue-114-motion-track-regressions.test.ts` and `replace-motion-track.test.ts` are genuinely untouched, which is what keeps ADR-029 evidenced independently of this slice. The escalation rule in 4.4 was aimed at assertion edits, and no assertion was edited.

Semantic file count is 11, not the 9 predicted in sections 3 and 6.5. Still far under the twenty-file ceiling in `docs/PR-WORKFLOW.md`.

## The `tracks.get(` grep gate expects the wrong number

Section 6.3 says `engine.ts` should contain exactly four `tracks.get(` sites after the change, and names `compile`, the `setProgress` hook, `disposeTrack`, and the `resolveTrack` closure.

**Correction.** The correct count is **five**. The gate omitted the `compose` resolver, which reads `tracks.get(node.id)!.compose(...)` and is one of the reasons the compiled map was already the de facto source of truth. Five sites, all in `Engine`, all reading the map it owns. No other file in `packages/core/src` resolves a compiled Track for a `Motion`.

Every other gate in section 6 held as written.

## Note on section 6.2

The gate stands, but its premise expired: the `docs/SESSION-STATUS.md` formatting drift behind runs 32030244298 and 32027461324 was already repaired on the base branch, and `format:check` is green there. Keep running the formatter before pushing anyway, because this slice edits that file again.
