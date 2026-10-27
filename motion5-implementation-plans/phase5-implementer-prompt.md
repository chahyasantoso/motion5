# Implementer prompt — Phase 5 (one slice per session)

Replace `{SLICE}` with the slice number (0, 0b, 1-9) and paste everything below into a fresh session
started in the repository root. Run exactly one slice per session, in this order: 0, 0b, 1, 2, ... 9. Slice 0 is already
committed in this repo; start at 0b.

---

You are a careful TypeScript engineer working in a local checkout of `motion5`, branch
`refactor/v5-identified-tables`. Your job is to implement ONE slice of a written plan: **Slice {SLICE}**.
Follow the plan literally. You are not the designer. Do not improvise, redesign, or widen scope.

## 1. Read these files first (in this order)

1. `motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan-summary.md`
2. `motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan-addendum-1.md`
3. `motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan.md`

If any of the three is missing, STOP and report. The Slice 0b spec, the D6 rewording and the "Rules for Slices 1-8 after A3" live in file 2
(Addendum A3); read all of A3. For file 3, read only: "Standing rules",
"Implementer protocol", "Per-slice gate protocol", "Shared domain types and graph contract", the
FINAL decisions, and the section for Slice {SLICE} (none exists for 0b; use A3). Do not read the whole file repeatedly.

Precedence: the addendum overrides the main plan for pending-test lists, Slice 0-4 exit criteria,
call-count scope, the Slice 8 retarget grep, Step 0 gates (A2), and the legacy freeze,
registration and file rules (A3). Everything else in the main plan stands.

## 2. Hard rules

- Do exactly Slice {SLICE}. Do not start another slice. Do not edit any file the slice does not
  name, except `test/pending.json` and the new test files the slice or addendum names.
- Never edit, commit, or stage the plan, addendum, or summary files. If the only gate failures are prettier warnings on those three files, STOP and ask the human to run `npx prettier --write` on them.
- Never edit anything under `packages/plugins/src/legacy/` after Slice 0b. Never edit `catalog.ts`
  or `loader.ts` after 0b (A3). Never mix v5 and grouped plugins in one engine or test.
- Never delete, skip, or weaken a test or assertion. Never relax the `1e-6` tolerance. Never
  un-pend a test before it passes. Never regenerate expected values from new code.
- No `any`, no unchecked casts, no type assertions to dodge a schema. Use inference, narrowing,
  and exhaustive `switch` with the existing `unreachable()` helper for closed unions.
- No compatibility alias, fallback, bridge, second registry, generic framework, or dual output.
- Reuse existing helpers. Add a helper only with a second real consumer or single-owner boundary.
- Plugin transforms are synchronous, deterministic, immutable, with no hidden graph reads.
- Use Read with offset/limit and `rg` for large files. Do not `cat` big files. Keep each new
  module small.
- Never run `npm run bench:ik`: known pre-existing failure (Addendum A2). In the Slice 0 report, say it was skipped for that reason.
- One commit for this slice, with the exact commit message from the plan. No amend.

## 3. Procedure

**Step A — preflight.**

- Run `node --version`; require 24 or later, else STOP.
- Run `git status --short` and `git rev-parse --short HEAD`. Expected HEAD is the Slice 0 commit for 0b, then each previous slice commit in order.
  For later slices HEAD should be your previous slice commit. Uncommitted changes other than the
  three plan files mean STOP and report.

**Step B — gates before editing.**

- Slice 0: run the full "Implementer protocol" from the main plan. Extract its hash-verification
  JavaScript block with a small Node script (not shell here-strings) into a temp file outside the
  repo, run it from the repo root, verify
  79/73/4/2 pending counts and both required core files, run the plan `prettier --check`, then run
  `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`, `npm run test:read-budget`,
  `npm test`, one at a time. Stop on any failure. Do NOT run `npm run bench:ik` (Addendum A2).
- Slice 0b: run `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`,
  `npm test`; record the passing test count. Then run the A3 Step 0 inventory and public-surface
  read, and follow the A3 STOP conditions. Implement exactly the A3 Slice 0b file list.
- Slices 1-9: run the "Per-slice gate protocol": confirm the previous commit's exit criteria, then
  `npm run format:check`, `npm run typecheck`, `npm run test:boundaries`. If a gate fails before
  you edit, STOP and report. After editing, also confirm the total passing test count did not drop and no test file was
  deleted.
- Slices 3 and 4 only, before any edit: run the existing pre-migration solver on the proof-test
  inputs and record rotation, residual, `atBound`, quality `kind`, iteration count as literal
  constants for the new proof test (addendum, "Golden values").
- Slices 5-9: confirm the Slice 3 and Slice 4 proof tests still pass.
- Slice 8 only: run the retarget grep restricted to `packages/plugins/src` and
  `apps/pose-gap-filler/src`. A registered domain retarget plugin or caller there means STOP.

**Step C — implement.** Follow the slice's Goal, Single owner, Files, Types, CORRECT/WRONG pair,
and Non-goals exactly. Run the slice's Grep checklist after editing; it must come back clean as
the plan describes.

**Step D — verify.**

- Run each test file listed for the slice with `npx vitest run <path>`. For Slices 0-4 the gate is
  the new test(s) named in the addendum, plus the tests the addendum lists for that slice (Slices
  0, 1, 2 list none).
- Then run `npm run typecheck`, `npm run format:check`, `npm run test:boundaries`, and, if a core
  source file changed, `npm run test:read-budget`.
- Then run `npm test`. No previously passing test may regress.
- If a listed test fails because it needs a plugin not yet migrated, do NOT work around it. Leave
  it pending, and report it as an allocation correction (addendum rule A1: move it to the later
  slice). Do not force it green.

**Step E — pending.json.** Edit `test/pending.json` with the Edit tool, removing only the entries
for tests that now pass in this slice, preserving existing formatting. Then verify with a
read-only Node check that the number of phase 5 entries dropped by exactly the number you
un-pended, and phase 6 (4) and phase 7 (2) entries are untouched. Run `npm run format:check`.

**Step F — commit.** `git add` only the files you changed (list them explicitly; never `git add .`
or `-A`). Commit with the plan's message for this slice. Confirm `git status --short` shows only the
three untracked plan files.

## 4. Stop and report (do not guess) if

- a hash, count, Node version, or pre-edit gate fails;
- the live source contradicts the plan or a FINAL decision's "Wrong if" condition appears;
- a slice needs an edit outside its named files, or loader/graph code needs an atomic
  cross-plugin migration;
- a numerical fixture differs by more than `1e-6` or an exact field differs;
- you would need to weaken or skip a test, or add a cast, alias, or fallback.

Report the exact command, the full error, the file, and what you expected. Do not commit partial
work in that case.

## 5. Final report (use exactly this shape, under 25 lines)

- Slice: {SLICE}; commit hash and message.
- Files changed (list).
- Tests un-pended (count and paths); tests left pending with reason (if any).
- Gate results: each command with pass/fail, and key numbers (tests passed, call counts).
- Deviations or allocation corrections (should normally be "none").
- Next slice to run: {SLICE}+1, and whether its Step 0 preconditions are met.
