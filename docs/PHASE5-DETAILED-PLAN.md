# Phase 5 detailed implementation plan (restart)

**Status:** Replaces the in-flight attempt on PR [#98](https://github.com/chahyasantoso/motion5/pull/98), which was closed without merge. See "Why the previous attempt was closed" below before writing any code.
**Scope:** All four Phase 5 slices from [`docs/IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md) section 9: P5-01 cross-motion references, P5-02 adopted free tracks, P5-03 unified inline diagnostics, P5-04 unmount/remount recovery.
**Audience:** An implementor (human or AI) picking up Phase 5 fresh. This document is more prescriptive than `IMPLEMENTATION-PLAN.md`; where the two disagree on file ownership or process, this document wins for Phase 5 only.
**Base branch:** `phase5/membership-base`. One PR per slice, in order. Do not start P5-02 until P5-01 is merged, and so on.

## Why the previous attempt was closed

PR #98 tried to solve P5-01 but drifted from the plan in ways that compounded rather than one clean invariant:

1. **Wrong owner.** The plan assigns P5-01 to a new module, `core/graph/references.ts`, with resolution happening _at load_ ("a reference either resolves to a member or is recorded as a pending reference... there is no third state"). PR #98 never created that module. Instead it made `GraphPublisher` catch a thrown composition error at _runtime_ and branch on `error.ruleId === "observation-missing-upstream"` to decide pending vs. real failure. That's reactive string-matching bolted onto the publisher, not load-time resolution owned by a dedicated object.
2. **No single owner for pending state.** The PR's own checklist demanded "define the single owner for pending reference state and membership transitions." Nothing in the diff created one; the `pending` set lives as a local variable inside one `flush()` call and disappears afterward.
3. **Cascading, undiagnosed side effects.** Because the real fix belonged in a load-time resolver and wasn't there, the author had to chase symptoms in `GraphRuntime`'s per-flush publisher-node cache. That produced two separate revert-and-patch cycles on the same root cause (stale cache keyed by node object identity). The plan's own sizing rule says to recut after a second revert on a slice; this crossed that line while still failing to land a clean fix.
4. **Scope creep unrelated to the invariant.** The PR also deleted `.github/workflows/format-repair.yml`, edited `ci.yml` branch triggers, and reformatted unrelated code in `graph-runtime.ts` (collapsing multi-line getters to single lines). None of that is P5-01's invariant. The plan is explicit: "one pull request establishes one meaningful invariant" and "formatting is separate."
5. **Removed a cache with system-wide effects, undocumented.** The fix deleted `GraphRuntime`'s per-node publisher memoization entirely, meaning every flush now rebuilds every node wrapper regardless of dirtiness. That's a runtime-wide behavior and performance change with no benchmark evidence and no test naming it, well outside what P5-01 requires.

None of this means cross-motion references are a bad idea, it means this particular implementation path needs to restart from the correct owner and a tighter diff. The checklists below are written to prevent each of these five failure modes recurring.

## Standing guardrails for every slice in this phase

Follow these on every PR in Phase 5, no exceptions:

- Touch only the files listed under "Allowed changes" for that slice. If you discover you need another file, stop and say so instead of editing it silently.
- Never edit `.github/workflows/*`, `package-lock.json`, or run a formatter as part of a behavior diff. Formatting and CI plumbing are separate PRs.
- If you find a pre-existing bug outside your slice's owner (e.g., a stale cache, a leak, a mis-typed fixture), do not patch it inline. Note it in the PR description as a follow-up and leave it alone, unless it makes your failing-first test impossible to write, in which case fix only the minimal blocking part and call it out explicitly as a named, separate commit.
- If you find yourself reverting and re-patching the same root cause a second time, stop. Close the branch, re-read the owner assignment below, and recut instead of continuing to chase symptoms.
- Every new piece of state needs a named, single owning object. State that must survive across flushes (anything about membership or pending status) must live on a long-lived object, never a local variable inside a method that runs once per flush.
- Write the failing test first, from the exact scenario in "Evidence," before touching implementation files. Confirm it fails for the _right_ reason (paste the assertion failure in the PR).

---

## P5-01: Cross-motion references

**Intent:** A track in one motion may observe a track in another. Resolution happens once, at load, through qualified ids. There are exactly three outcomes for a reference: resolved (source is a known member), pending (source id is valid and known but not currently mounted), or a load-time error (source id does not exist at all). Mount order never changes the final result.

**Owner:** `core/graph/references.ts` (new file). This is the single place that classifies a cross-motion observation edge as resolved, pending, or invalid. `GraphBinding` calls into it during the transaction (build candidate → normalize → validate). `GraphPublisher` and `GraphRuntime` must not independently infer pending-vs-error state from a caught runtime exception or a string-matched rule id. Membership changes (attach/detach) call into the same module to re-evaluate any reference that depended on the node being attached or detached.

**Allowed changes:**

- `packages/core/src/graph/references.ts` (new)
- `packages/core/src/graph/validate.ts` (wire in reference classification, do not duplicate it)
- `packages/core/src/graph/binding.ts` (call the resolver during commit; on attach/detach, re-resolve affected references)
- `packages/core/src/runtime/graph-publisher.ts` (consume the precomputed pending/resolved state; no new exception-based branching)
- `packages/core/test/integration/cross-motion.test.ts` (new)
- `packages/core/test/unit/graph/references.test.ts` (new)

**Checklist:**

- [ ] Write `test/unit/graph/references.test.ts` first: a reference to a known member resolves; a reference to a valid-but-unmounted id is pending with a deterministic diagnostic; a reference to an id that never exists in the project is a load-time error; re-attaching the source flips pending to resolved without changing the observer's identity.
- [ ] Write `test/integration/cross-motion.test.ts`: mount observer before source (pending, then recovers), mount source before observer (same final output and revision), unknown source rejected at construction, published values for a pending node are never fabricated, resolution does not depend on mount order.
- [ ] Confirm both tests fail on the current `phase5/membership-base` tip for the right reason (paste the failing assertion in the PR).
- [ ] Implement `core/graph/references.ts` as the single classifier. It takes the graph IR and current membership and returns, per cross-motion edge: `resolved`, `pending`, or `invalid` (with a diagnostic naming the rule id, e.g. `observation-unknown-source` for invalid, `observation-pending-source` for pending).
- [ ] Wire `GraphBinding` to call the classifier during its transaction. Invalid references fail validation at load (same path as any other `validate.ts` error, sorted by rule id then path per existing convention). Pending references are recorded on the graph state, not thrown as exceptions.
- [ ] Update `GraphPublisher` to read pending status from the graph state (via the node/edge data already resolved), not by catching an exception. A pending node publishes `blocked` with the diagnostic carried over from the classifier, exactly once per relevant flush, no fabricated values.
- [ ] Wire attach/detach in `GraphBinding`/`GraphRuntime` to re-run classification for references that depend on the changed id, so recovery on remount is driven by the same single owner, not a second code path.
- [ ] Confirm no capability flag, alias, or second node model was introduced anywhere in the diff.
- [ ] Do not touch CI workflow files, `package-lock.json`, or reformat any file you are not otherwise editing for behavior.
- [ ] Keep the diff under 20 semantic files. If GraphRuntime's publisher-node caching turns out to need a change to support this, that is worth flagging explicitly in the PR description as its own commit with its own test, not a silent side fix.
- [ ] Run the full test suite (not just the new tests) and confirm nothing else regressed.
- [ ] Update `progress/STATUS.md` and `docs/SESSION-STATUS.md` only after everything above is green.

**Exit:** `I-14` (no capability flags) has a named test. No PR touches files outside the allow list above. Reference classification is provably load-time and single-owner (a unit test on `references.ts` alone, independent of the publisher, proves this).

**Depends:** P4-05, P2-01. **Blocks:** P5-02.

---

## P5-02: Adopted free tracks

**Intent:** A free track created at runtime joins the project graph as an ordinary node, distinguished from an authored node only by who owns its teardown.

**Owner:** `core/runtime/project-runtime.ts` membership path (adoption call, ownership bookkeeping). Reuses the qualified-id scheme from P2-01 (`~/trackId`) and the classifier from P5-01 for any reference resolution, does not invent a parallel one.

**Allowed changes:**

- `packages/core/src/runtime/project-runtime.ts`
- `packages/core/test/integration/adoption.test.ts` (new)

**Checklist:**

- [ ] Write `test/integration/adoption.test.ts` first: adopting a free track at runtime gives it a `~/trackId` identity; adopting a duplicate id is an error, not a silent replace; the adopted track publishes through the same path as any other free track; detaching an adopted track removes it from membership without destroying it; only the actual owner (the thing that adopted it) can destroy it, a borrower can only detach.
- [ ] Confirm the test fails for the right reason on the merged P5-01 tip.
- [ ] Implement adoption in `project-runtime.ts` only. Do not add a second qualification function, reuse P2-01's.
- [ ] Prove ownership is decided once, at adoption time, and never changes during teardown (name this explicitly in a test, not just prose).
- [ ] Keep this diff scoped to membership bookkeeping. No renderer, DOM, or graph-topology changes belong here.
- [ ] Run the full suite, update status docs only after green.

**Exit:** Free tracks and adopted tracks share one code path (no `if (adopted)` branch duplicating free-track logic elsewhere).

**Depends:** P5-01. **Blocks:** P5-03.

---

## P5-03: Unified inline diagnostics

**Intent:** One diagnostic surface for load-time and runtime problems, delivered inline on patches and batch summaries, bounded so it cannot leak memory.

**Owner:** `core/runtime/diagnostics.ts` (new file, the bounded ring buffer). Existing diagnostic emission points (validate.ts, references.ts, graph-publisher.ts) all feed this one buffer; none of them get their own parallel stream.

**Allowed changes:**

- `packages/core/src/runtime/diagnostics.ts` (new)
- `packages/core/src/runtime/project-runtime.ts` (wire the buffer in)
- `packages/core/test/integration/diagnostics.test.ts` (new)

**Checklist:**

- [ ] Write `test/integration/diagnostics.test.ts` first: buffer bounds at a fixed size and reports a drop count once exceeded; patch-level diagnostics still surface on the affected patch; batch summary carries the aggregate; load-time and runtime diagnostics share one `Diagnostic` shape (no new shape introduced); no second delivery channel (emitter, event, or separate subscription) exists anywhere in the public surface.
- [ ] Confirm the test fails for the right reason on the merged P5-02 tip.
- [ ] Implement the ring buffer as the single owner. It is inspection state only, never a second way to be notified of a diagnostic.
- [ ] Grep the diff (and ideally add to the boundary scan) to confirm no second diagnostics channel was added.
- [ ] Run the full suite, update status docs only after green.

**Exit:** No second diagnostic shape and no second diagnostic channel exists anywhere in the codebase.

**Depends:** P5-02. **Blocks:** P5-04.

---

## P5-04: Unmount and remount recovery

**Intent:** A downstream node survives an upstream disappearing, and recovers cleanly when it returns, with zero residual subscriptions after repeated cycles.

**Owner:** `core/runtime/project-runtime.ts` and `core/graph/binding.ts`, reusing the P5-01 reference classifier for pending/resolved transitions. No new resolution logic here, this slice is about lifecycle correctness and leak-freedom on top of P5-01's classifier.

**Allowed changes:**

- `packages/core/src/runtime/project-runtime.ts`
- `packages/core/src/graph/binding.ts`
- `packages/core/test/integration/remount.test.ts` (new)

**Checklist:**

- [ ] Write `test/integration/remount.test.ts` first: unmounting an upstream node blocks its downstream closure (reusing the pending/blocked path from P5-01, not a new status); remounting resolves the reference and republishes with a strictly newer revision; run many unmount/remount cycles and assert flat subscription/patch retention (no growth).
- [ ] Confirm the test fails for the right reason on the merged P5-03 tip.
- [ ] Implement using the existing owner-first teardown primitive from P1-04. Do not add a second dispose-guard pattern.
- [ ] Verify with a retention assertion across at least 50 cycles, not just one unmount/remount pair.
- [ ] Run the full suite, update status docs only after green.

**Exit:** Membership churn is leak-free and observable, proven by the retention test above.

**Depends:** P5-03. **Blocks:** P6-01.

---

## Phase 5 exit gate (unchanged from `IMPLEMENTATION-PLAN.md`)

Authored, cross-motion, and adopted nodes share one graph path without flags. Ownership and detach-versus-destroy behavior are tested. Churn leaks nothing. Re-run the full exact-head CI matrix before opening Phase 6.
