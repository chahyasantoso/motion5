# Phase 3 implementation review

**Reviewed:** 2026-08-10, Asia/Jakarta  
**Updated:** 2026-08-11, Asia/Jakarta  
**Scope:** merged P3-01 through P3-07, remediation R1-R8, current CI workflow, Phase 4 work, and the motionpath v4/v5 behavioral oracle.  
**Conclusion:** the Phase 3 graph and publication infrastructure is structurally coherent, but the original review overstated the runtime result. Phase 3's graph kernel is retained; the composition/value-pipeline claim is superseded by the consolidated audit and recovery plan.

## Findings and disposition

### 1. High: benchmark was not a performance gate

**Addressed structurally.** `performance/graph-benchmark.mjs` builds a fixed 1,000-node chain, runs deterministic dirty-closure flushes, counts traversed nodes, published patches, and retained nodes, compares measurements against versioned budgets, and exits non-zero on a budget breach or unexpected complexity. The `performance` job runs on every pull request, remains advisory through **2026-08-17**, and uploads its report.

This is not a wall-clock benchmark by design. It is deterministic structural evidence for complexity and retention. Its advisory status must be revisited after the value pipeline is restored, because the current runtime does not yet measure real authored interpolation.

### 2. High: CI workflow had drift from its job contract

**Partially superseded.** The CI documentation reflects the live `quality`, `integration`, `boundaries`, and advisory `performance` jobs. Planned `build` and `package` jobs remain future work. Phase 4 is now reopened, so P4-05 is not merely a pending final gate: it is blocked on the recovery work described in `docs/PHASE-3-4-RECOVERY-PLAN.md`.

### 3. High: Engine validated ports but did not wire them

**Not discharged by the original Phase 4 remediation.** R5 replaced the old `{ nodeId }` placeholder with Track construction, but the resulting Track has no interpolated state to read. The `InterpolationTimeline` port exposes duration, progress, and kill only; authored keyframes are not compiled into a proxy-backed timeline, and plugins are not resolved from authored keys. The headless test asserting `{}` and `sourceProgress: 0` is not valid acceptance evidence for real composition.

The motionpath v4/v5 oracle establishes the intended model: compile authored stops into an adapter-owned proxy/timeline, advance it through the existing progress path, read the proxy in Track composition, and then apply plugin/input/output semantics. This obligation is reopened as Phase 0R/1R recovery work, not treated as complete P4-01 wiring.

### 4. Medium: CI did not run benchmarks or upload artifacts

**Addressed for the current structural benchmark.** The advisory performance job runs the benchmark and uploads the report and failure diagnostics when available. The build job remains correctly deferred until the value pipeline and consumer surface are real.

### 5. Medium: Phase 3 evidence was narrower than the full normative contract

**Still open.** Several named evidence files are absent or assert placeholders rather than the intended invariant. The consolidated audit records the gaps. Recovery work must use failing-first tests that fail on the current tree and assert non-empty interpolated values, stable Track lifetime, real invalidation, and consumer behavior.

## What remains solid

- One owner each for live state, topology mutation, publication, patch identity, project runtime, and clock subscription.
- Candidate validation precedes live-state mutation, and rollback preserves state identity.
- Canonical graph order and cycle diagnostics are iterative and deterministic.
- Patch values, patches, batches, and diagnostics cross the consumer boundary frozen.
- Membership gating, package entrypoints, and target-aware DOM diffing are present.
- The graph kernel should not be rewritten while restoring the value/compiler pipeline.

## What the original review missed

The motionpath v4.3 graph audit was correct that the old graph layer was broken, but motionpath's value pipeline was working: `buildTrackTween()` compiled authored stops into a GSAP tween over a proxy, `Track` read that proxy, plugins composed renderer-neutral values, and the DOM adapter serialized and diffed them. motion5 ported the graph repair but dropped the proxy/compiler/plugin path. That is why the current graph can publish empty or input-only patches.

The motionpath v5 branch confirms the intended successor model: explicit `ObservationGraph`, `GraphBinding`, lifecycle invalidation, persistent publisher cache, and proxy-backed interpolation. It is a behavioral and architectural reference, not a source-copy target.

## Phase 4 status

Phase 4 is **reopened**, not complete. Do not close it on P4-05 documentation or a green structural benchmark. Recovery must first restore:

1. interpolator-owned state and typed authored stops;
2. plugin contribution, resolution, ordering, and composition;
3. one Track/timeline per runtime lifetime, not per flush;
4. progress-to-invalidation wiring;
5. final-value memo consistency and the remaining boundary/consumer gates;
6. the required build job and real end-to-end fixture.

## Decision

Keep motion5's graph ownership, transaction model, immutable patch boundary, and package separation. Restore motionpath's proven value/compiler/plugin behavior deliberately behind motion5's ports. The recovery plan and implementor brief are the current execution references:

- `docs/PHASE-3-4-CONSOLIDATED-AUDIT.md`
- `docs/PHASE-3-4-RECOVERY-PLAN.md`
- `docs/IMPLEMENTOR-BRIEF-MOTIONPATH-TO-MOTION5.md`

The original statement that Phase 3 was fully remediated and Phase 4 could proceed is superseded.
