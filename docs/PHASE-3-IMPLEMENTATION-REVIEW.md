# Phase 3 implementation review

**Reviewed:** 2026-08-10, Asia/Jakarta  
**Scope:** merged P3-01 through P3-07, current CI workflow, job contracts, and the Phase 4 execution plan.  
**Conclusion:** Phase 3 implementation is structurally coherent and the ownership model is intact. The review findings are now addressed in this PR; Phase 4 may start after this PR is green.

## Findings and disposition

### 1. High: benchmark was not a performance gate

**Addressed in this PR.** `performance/graph-benchmark.mjs` now builds a fixed 1,000-node chain, runs 100 deterministic dirty-closure flushes, counts traversed nodes, published patches, and retained nodes, compares those measurements against versioned budgets, and exits non-zero on a budget breach or unexpected complexity. The `performance` job runs on every pull request, remains advisory through **2026-08-17**, and uploads its report.

This is still not a wall-clock benchmark by design. It is deterministic structural evidence for complexity and retention, which is the correct gate until real runtime timing is introduced deliberately.

### 2. High: CI workflow had drift from its job contract

**Addressed in this PR.** `docs/CI-WORKFLOW.md` now reflects live `quality`, `integration`, `boundaries`, and advisory `performance` jobs. The command names match `package.json`, and planned `build`/`package` jobs are clearly marked as future slices.

### 3. High: Engine validated ports but did not wire them

**Deferred deliberately to P4-01.** The review identified a real architectural seam, but fixing it here would pull GSAP adapter behavior into the Phase 3 composition-root slice. Engine remains renderer-neutral and validates all three ports; P4-01 owns replacement of the placeholder compose resolver through the Interpolator port.

### 4. Medium: CI did not run benchmarks or upload artifacts

**Addressed in this PR.** The advisory performance job runs the benchmark and uploads both the report and failure diagnostics when available. The build job remains correctly deferred to P4-05.

### 5. Medium: Phase 3 evidence was narrower than the full normative contract

**Addressed as documentation truth.** Deferred behavior is now explicit: retry metadata and aggregate runtime error reporting are not claimed as shipped, the compose resolver is placeholder-level until P4-01, and ProjectRuntime is constructor/load-only until later membership work. No ownership was reopened or duplicated.

## What is solid

- One owner each for live state, topology mutation, publication, patch identity, project runtime, and clock subscription.
- Candidate validation precedes live-state mutation, and rollback preserves state identity.
- Canonical graph order and cycle diagnostics are iterative and deterministic.
- Patch values, patches, batches, and diagnostics cross the consumer boundary frozen.
- Boundary enforcement is live, required, locally reproducible, and backed by planted violations.
- Phase 3 was sensibly collapsed into five PRs without merging unrelated ownership responsibilities.

## Phase 4 collapse decision

Phase 4 reduces from five planned slices to **three PRs** without blurring ownership:

1. **P4-01/P4-02:** GSAP adapter, browser clock, and DOM adapter. Shared acceptance: unchanged port harness plus immutable patch application.
2. **P4-03/P4-04:** React hooks and immutable external-store subscription. Shared acceptance: lifecycle, strict-mode, server-safe, and concurrent snapshot tests.
3. **P4-05:** end-to-end fixtures and required build gate. Keep this separate as the packed/build acceptance boundary.

Do not collapse renderer application with React, and do not bury the build gate inside either consumer PR.

## Decision

This PR is the Phase 3 implementation review and remediation pass. Start Phase 4 only after it is green. The first Phase 4 slice is the combined adapter PR, with the unchanged fake-port contract harness as the non-negotiable acceptance test.
