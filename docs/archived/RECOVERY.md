# Motion5 recovery handoff

This file is the restart point for any human or AI session. Read it before changing runtime code.

## Mission

Restore motion5 by adapting the working behavior of `chahyasantoso/motionpath` while preserving motion5's graph ownership and TypeScript boundaries.

## Current baseline

- Repository: `chahyasantoso/motion5`
- Current rescue branch: `rescue/restore-motionpath-parity`
- Archive branch: `ci-logs`
- PR 95 merge: [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b)
- PR 96 merge: [`1a26bfe`](https://github.com/chahyasantoso/motion5/commit/1a26bfe50899d8cb3bd7d0bde87d3def2033692d)

## M1 decision and evidence

Motion and trigger lifecycle are wired through one Motion owner, the injected Scheduler, `ProjectRuntime.seek`, and the existing project clock. `ProjectHandle.signal()` is the public trigger seam. Engine-created Motion does not subscribe to the Clock, so ProjectRuntime remains the sole clock owner.

Recovery audit [31767593680](https://github.com/chahyasantoso/motion5/actions/runs/31767593680) passed against [`c26a807`](https://github.com/chahyasantoso/motion5/commit/c26a807c8fe74dc6fc79ee4ef92907c6364c408b), with base [`e53265b`](https://github.com/chahyasantoso/motion5/commit/e53265b97be1c1f1bb766c78abf7bc4f1e1ce44b) and blank exception. Only Node 20 action deprecation warnings remain.

## Next action

No runtime/evidence blocker remains from `CODE-REVIEW-POST-E3.md`. Verify branch protection and open the final rescue → main PR. Track Node 20 action modernization separately.
