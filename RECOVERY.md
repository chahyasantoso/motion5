# Motion5 recovery handoff

This file is the restart point for any human or AI session. Read it before changing runtime code.

## Mission

Restore motion5 by adapting the working behavior of `chahyasantoso/motionpath` while preserving motion5's graph ownership and TypeScript boundaries. Do not treat a green test suite as proof unless the test exercises the real behavior at the boundary.

## Single source of truth

The live checklist is [`progress/STATUS.md`](progress/STATUS.md). `WAVE-PLAN.md` is the detailed plan, `progress/<slice>.md` files are optional evidence logs, and neither is a second status system.

## Current baseline

- Repository: `chahyasantoso/motion5`
- Current rescue branch: `rescue/restore-motionpath-parity`
- Active slice: `fix/motion-trigger-lifecycle`
- Archive branch for failed CI and recovery-audit logs: `ci-logs`
- Previous rescue merge: [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b)

## M1 decision

Motion and trigger lifecycle are wired through one Motion owner, the injected scheduler, `ProjectRuntime.seek`, and the existing project clock. Engine-created Motion disables its private clock subscription, so ProjectRuntime remains the only clock owner. `ProjectHandle.signal()` is the public trigger seam.

## Implementor workflow

Push failing-first tests, verify assertion-level red, implement the smallest owner change, run exact-head CI, dispatch Recovery audit, and record the final SHA and evidence in `progress/STATUS.md`. Never mark a slice done from code inspection or generic green tests.

## M1 final gate

Run Recovery audit with `ref=<final M1 SHA>`, `base=e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b`, blank exception. Merge PR 96 into rescue only after exact-head CI and the audit are green, then open rescue → main after branch-protection verification.
