# Phase 5 Plan — Quick Summary

This companion satisfies the read-budget summary requirement. Read all three files:

1. `motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan.md` (main plan).
   Authoritative for files, type shapes, code pairs, commands, and exit criteria.
2. `motion5-implementation-plans/phase5-domain-plugins-solver-graph-plan-addendum-1.md`
   (Addendum 1). Overrides the main plan on: per-slice pending-test lists, Slice 0-4 exit
   criteria, call-count test scope, the Slice 8 retarget grep, and the pending-audit counts.
3. This summary.

If the main plan and Addendum 1 conflict on those items, on Step 0 gates (A2), or on the legacy freeze and registration rules (A3), Addendum 1 wins. Do not edit the main plan.

## Snapshot identity and stop rules

Input snapshot: branch `refactor/v5-identified-tables`; expected tip `8a475ce`. An independent
review of the branch matched the tip, all 127 SHA-256 prefixes, and the pending counts: 79
entries (73 phase 5, 4 phase 6, 2 phase 7). The implementer still re-verifies locally. The hash
ledger is the drift guard; any mismatch means stop and report.

Before editing, use Node 24 or later. Run the required commands in the main plan, except `npm run bench:ik` (known pre-existing
v4-fixture failure, Addendum A2), and paste each command and result into the PR body. If the snapshot checks fail or live source contradicts
the guide, stop and report. Do not commit the plan, the addendum, or this summary. Do not run the
solver benchmark as planner.

## Final decisions

- Solver and rig row IDs use canonical unqualified `memberId`; controls use `controlId`.
- FK emits a one-row `values` table. Rig emits `pose` and `controls` tables.
- IK/IK3D inspection is absent unless requested by static `inputs.values.inspect === true`.
- Migrate one plugin at a time. Prove the 2D and 3D solver graph before any FK or rig migration.
- Legacy grouped plugins are frozen under `packages/plugins/src/legacy/` (Slice 0b, A3) and keep
  serving legacy mode; v5 plugins are new files at the original paths, registered only in
  `identified-catalog.ts`. `Engine` runs one mode per instance. Delete `legacy/` in Phase 7 after
  zero-use proof.
- Classifier output is one flat `values` record. Closed unions switch exhaustively with
  `unreachable()`.
- Do not invent a generic solver framework or retarget algorithm without a source consumer and
  fixture.
- Tests are un-pended in the later of their planned slice and the slice that migrates the last
  built-in plugin they register (Addendum 1, A1).

## Execution order

1. Slice 0 (committed): build replacement evaluators before disposing old ones; failure leaves old
   values usable. Un-pends nothing.
2. Slice 0b (A3): mechanical `git mv` of the seven grouped plugins to `legacy/`, exports renamed
   `legacy<Name>Plugin`, importers updated. Un-pends nothing; test count unchanged.
3. Slices 1-2: add v5 2D and 3D transforms beside the frozen legacy copies. Each un-pends nothing; each gets one small new
   test registering only its own plugin.
4. Slices 3-4: explicit 2D IK proof, then 3D IK proof, each gated by a new plain-record proof test
   with golden values recorded from pre-migration code before editing. Both block all FK and rig
   migration until passing.
5. Slices 5-6: migrate FK and FK3D to explicit solver rows. Slice 5 is the first point where
   existing 2D IK fixtures run end to end. Legacy IK is the numerical oracle for Slices 3-4.
6. Slice 7: publish rig pose and controls tables.
7. Slice 8: migrate keyed dependencies and classifier; re-verify the retarget absence.
8. Slice 9: update the pose-gap-filler writer to one whole-value `values.set` per track.

All 73 phase 5 pending tests are allocated exactly once. Per-slice counts for Slices 0-9 are
0, 0, 0, 1, 1, 24, 3, 18, 12, 14. Addendum 1 lists every exact path. Phase 6 and phase 7 entries
stay untouched.

## Solver gates

Numerical solver fixtures must match pre-migration outputs within absolute `1e-6` in existing
units. IDs, quality kind, iteration count, boolean flags, and optional-field presence must match
exactly. Full existing-fixture comparison first runs in Slice 5 (2D) and Slices 6-7 (3D); the
Slice 3-4 proof tests use golden constants taken from pre-migration code.

Performance passes on deterministic call counts at N=14 and N=200, not wall-clock time. Solver
count 1, row lookups N and zero rest recomputes are asserted in Slices 3-4; FK calls N in Slices
5-6; rig aggregation 1 in Slice 7. Wall-clock is report-only; use the committed baseline JSON.

## Least-sure decision and UNVERIFIED item

Least sure: retargeting. A repository-wide search found no registered domain retarget plugin or
concrete consumer. The only hits are the unrelated `retarget-motion-track` effect in
`commit-plan.ts` and a comment in `skeleton-capture.ts`; those are expected and not a stop
condition. No general retarget feature is invented. Slice 8 Step 0 re-confirms the absence in
`packages/plugins/src` and `apps/pose-gap-filler/src`; if a concrete consumer exists there, stop
and report rather than guessing.

Every item marked `UNVERIFIED`:

- Whether the guide's Phase 5 retargeting target has a concrete implementation or consumer.
  Current evidence says absent; re-confirm in Slice 8 Step 0 and stop if found.
- Whether Slice 9 can run the apps in v5 mode without an app-wide engine switch (A3 open risk).
  Verify in Slice 9 Step 0; stop and report if it cannot.
