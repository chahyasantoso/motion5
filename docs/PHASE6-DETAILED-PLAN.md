# Phase 6 detailed implementation plan

**Status:** Execution intent. No Phase 6 slice is complete until its failing-first evidence, implementation, full required matrix, and `docs/SESSION-STATUS.md` all agree.

**Base:** `phase6/hardening-base`, cut from the merged `phase5/membership-base` at [`5299e3a`](https://github.com/chahyasantoso/motion5/commit/5299e3aa18493dafac185607530627467c7a085d).

**Goal:** ship a packed, documented, budget-enforced v1 with no transitional code left behind. The original sequencing comes from [`docs/IMPLEMENTATION-PLAN.md`](./IMPLEMENTATION-PLAN.md), section 10. The vendored `oracle/motionpath-v5` remains read-only behavioral evidence only. Its value-pipeline behavior is not a reason to copy architecture into Phase 6.

## Delivery guardrails

- One PR establishes one meaningful invariant.
- Every slice starts with a failing-first test on its exact parent tip.
- Every new state transition names one owner; no flags, aliases, facades, or duplicate channels.
- Touch only the slice allow-list. If the owner is missing, stop and open a scope-gap comment instead of patching around it.
- Do not copy oracle source, tests, fixtures, or architecture. Use it only to validate shipped behavior.
- Do not edit workflows or lockfiles as part of behavior work. Formatting remains a separate gate.
- Update status and session docs only after the final head is green.

## P6-01: API surface and declarations

**Intent:** the public surface becomes a machine-enforced allow list.

**Owner:** `scripts/api-surface-check.mjs` plus `packages/core/src/index.ts`.

**Allowed changes:**

- `scripts/api-surface-check.mjs` (new)
- `scripts/api-surface-report.json` (new committed report)
- `packages/core/test/unit/scripts/api-surface-check.test.ts` (new)
- `packages/core/src/index.ts` only if the report exposes an accidental export
- `package.json` only if wiring the checker is necessary and stays slice-local

**Behavior:** generate declarations from the public entrypoint, traverse the emitted declaration closure, compare exported symbol names against the committed report, reject any extra or missing export, reject reachable internal `runtime/`, `graph/`, or `domain/` implementation modules, and fail on a planted extra export. The `@motion5/core/internal` entrypoint remains explicitly outside the public report and carries no stability promise.

**Evidence:** the test runs the checker against the real entrypoint and a temporary planted declaration/export fixture. It must fail before the checker/report exist.

**Checklist:**

- [ ] Red test is committed first and fails for the missing checker/report, not an unrelated error.
- [ ] Report records value exports and type exports separately, sorted and deterministic.
- [ ] Checker validates generated declarations rather than source-only grep.
- [ ] Extra export, missing export, and reachable forbidden implementation path all fail.
- [ ] `@motion5/core/internal` is not treated as public API.
- [ ] No graph/runtime internals leak through `index.ts` declarations.
- [ ] Full suite, boundaries, build, and exact-head CI green.
- [ ] Status docs updated after green.

**Exit:** committed API report is enforced by a machine check and the planted-extra-export test is red without the checker.

## P6-02: packed package consumer

**Intent:** documented imports work from packed artifacts, not source paths.

**Owner:** package CI job and consumer fixtures.

**Allowed changes:** package workflow/job, package fixture projects, package metadata, and focused tests. No core behavior changes.

**Behavior:** pack every published package, install tarballs into clean ESM and TypeScript consumers, verify documented imports, verify React separately, and assert deep wildcard imports fail.

**Checklist:** red consumer fixture first, exact tarball install, ESM plus TypeScript checks, negative deep-import case, required `package` job, no source-relative imports.

**Exit:** package job is required and green.

## P6-03: public documentation

**Intent:** docs describe shipped implementation, not stale intent.

**Owner:** `docs/` and `README.md`.

**Allowed changes:** docs and doc tests only.

**Behavior:** remove stale phase claims, reconcile architecture/TRD/schema/API docs with shipped behavior, align documentation map, and supersede contradictory decisions instead of leaving conflicts.

**Checklist:** grep stale claims, validate links/map, document public API from P6-01 report, review oracle references as read-only evidence, update session status only after the doc review is complete.

**Exit:** no document claims an unshipped gate or behavior.

## P6-04: enforce benchmark budgets

**Intent:** advisory performance budgets become required or are deleted.

**Owner:** performance job and committed budget files.

**Allowed changes:** performance budgets, benchmark harness, CI job, focused tests.

**Behavior:** remove advisory continuation, fail on deliberate regression, resolve the deep-freeze decision with benchmark evidence, and record the final decision.

**Checklist:** red regression test, required job, no `continue-on-error`, fixed synthetic graphs, no wall-clock correctness dependence, decision record updated.

**Exit:** performance is a required gate with committed budgets and no expired advisory exception.

## P6-05: delete transitional code and documents

**Intent:** remove everything that existed only to get here.

**Owner:** release PR owner.

**Allowed changes:** migration-only helpers, temporary fixtures, calibration scaffolding, and documents that describe deleted code.

**Behavior:** delete transitional code and its orphan docs in one change, then rerun the full matrix.

**Checklist:** deletion inventory, grep for orphan symbols/docs, full required matrix green, no migration-only code remains.

**Exit:** v1 release criteria are binary and clean.

## Phase 6 exit gate

The committed API allow list is enforced, packed consumers pass, docs match implementation, performance budgets are required, transitional code is gone, and the full exact-head matrix is green. Only then open the v1 release PR.

## Oracle use

`oracle/motionpath-v5/README.md` identifies the behavioral snapshot for value compilation, plugins, graph ownership, and DOM output. Phase 6 does not reimplement those behaviors. When API, packaging, documentation, or budget decisions touch those behaviors, compare observable contracts against the oracle without importing or copying its files.
