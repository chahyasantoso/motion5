# Phase 3 implementation review

**Reviewed:** 2026-08-10, Asia/Jakarta  
**Scope:** merged P3-01 through P3-07, current CI workflow, job contracts, and the Phase 4 execution plan.  
**Conclusion:** Phase 3 is structurally coherent and the ownership model is intact, but the implementation job is not yet an honest end-to-end gate. Phase 4 should start only after the findings below are tracked explicitly.

## Findings

### 1. High: the benchmark is not a performance gate yet

`performance/graph-benchmark.mjs` emits a deterministic structural report and `performance/budgets.json` defines budgets, but the script does not build a synthetic graph, run flushes, measure retention, compare measurements to budgets, or fail on a deliberately quadratic change. There is also no `performance` job in `.github/workflows/ci.yml`.

This is honest calibration evidence, not benchmark enforcement. It satisfies the shape of P3-07 but not the Phase 3 exit claim that budgets are measured. Keep the advisory expiry at **2026-08-17**. Before that date, either replace the placeholder with executable deterministic measurements and add the advisory job, or delete the benchmark and its documentation together.

### 2. High: the CI workflow is behind the live job contract

`docs/CI-WORKFLOW.md` says `boundaries` is planned, although `.github/workflows/ci.yml` now runs it as a required job. The command contract lists `boundary`, but the repository exposes `test:boundaries`; it also lists `api:check` and `build`, neither of which exists yet. The document needs a truth pass before Phase 4 adds more jobs.

### 3. High: the Engine validates ports but does not wire them

`packages/core/src/engine.ts` accepts `Clock`, `Interpolator`, and `Scheduler`, validates them, and then creates a placeholder compose resolver that never uses the interpolator or scheduler. The tests prove headless loading and invalid-port rejection, not actual composition-root wiring.

That is acceptable for a narrow P3 composition-root slice, but it must not be reported as complete adapter integration. P4-01 must replace the placeholder with the real interpolator boundary without adding engine-specific branches to core.

### 4. Medium: the current CI matrix does not run benchmarks or build checks

The live workflow has `quality`, `integration`, and `boundaries`. It has no `performance` or `build` job, and no artifact upload for benchmark output or failure diagnostics despite the CI contract requiring artifacts. This is not a Phase 4 blocker by itself, but it becomes one before P4-05 claims a complete build gate.

### 5. Medium: some Phase 3 evidence is narrower than the normative contract

The merged tests cover the intended ownership seams, but the current implementation still has known scope boundaries: publisher retry metadata and aggregate error reporting are not implemented, GraphRuntime uses an injected placeholder compose resolver, and ProjectRuntime is constructor/load-only rather than an active-project replacement owner. These are correctly deferred, but the docs must keep calling them out as deferred rather than implying the full TRD runtime is shipped.

## What is solid

- One owner each for live state, topology mutation, publication, patch identity, project runtime, and clock subscription.
- Candidate validation precedes live-state mutation, and rollback preserves state identity.
- Canonical graph order and cycle diagnostics are iterative and deterministic.
- Patch values, patches, batches, and diagnostics cross the consumer boundary frozen.
- Boundary enforcement is live, required, locally reproducible, and backed by planted violations.
- Phase 3 was sensibly collapsed into five PRs without merging unrelated ownership responsibilities.

## Recommended action before Phase 4

Do not reopen or expand Phase 3 ownership. Create a small follow-up to correct `CI-WORKFLOW.md` and either make the benchmark job real or explicitly mark the benchmark as calibration-only with the expiry intact. Then proceed with P4-01, while treating the Engine's compose resolver as a deliberate seam to replace.

## Phase 4 collapse options

Phase 4 has five planned slices. Collapse only where the evidence and owner stay coherent:

1. **P4-01 + P4-02: recommended.** GSAP proves the Interpolator port; browser clock and DOM adapter prove the renderer boundary. They are both adapter-layer work, and their shared acceptance is the unchanged port harness plus immutable patch application. Keep the browser clock and DOM adapter in the same PR so real ticking and real rendering are tested together, but keep GSAP internals in its own subdirectory and test section.
2. **P4-03 + P4-04: recommended.** React project/playback hooks and the immutable external-store patch subscription are one consumer boundary. The hook lifecycle and concurrency tests should land together; splitting them would make the first React PR prove only half a usable contract.
3. **P4-05: keep separate.** The end-to-end fixture and required build job should remain the Phase 4 integration gate. It is the point where the previous adapter and React slices are consumed as packed, buildable artifacts, so folding it into either consumer PR would hide packaging failures.

That reduces Phase 4 from five PRs to **three**: adapters (`P4-01/P4-02`), React consumer boundary (`P4-03/P4-04`), and end-to-end build gate (`P4-05`). Do not collapse P4-02 with React: renderer application and framework subscription have different owners and different failure modes.

## Decision

Start Phase 4 after this review is recorded, but keep the benchmark expiry and CI-contract drift visible. The first Phase 4 slice should be the combined adapter PR, with the fake-port contract harness as the non-negotiable acceptance test.
