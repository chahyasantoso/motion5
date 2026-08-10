# Session status

**Captured:** 2026-08-10, Asia/Jakarta
**Branch:** `feat/p4-01-02-adapters`
**Phase:** 4, adapters
**Next action:** Run the collapsed P4-01/P4-02 quality matrix, review the implementation pull request, and merge only when the required checks are green.

This is the only document that reports current implementation reality. Everything else is a contract, plan, or decision record unless it says otherwise.

## Current state

P0-01 through P0-06, P1-01 through P1-06, P2-01 through P2-07, and P3-01 through P3-07 plus the Phase 3 remediation review are merged on `main`. The collapsed P4-01/P4-02 adapter slice is on this branch. React and packaging do not exist yet.

## P4-01/P4-02 changes on this branch

- GSAP-compatible `Interpolator` adapter behind an injected engine boundary; the engine object never enters a patch or snapshot.
- Browser clock adapter behind an injected frame source, with one subscription stream and idempotent disposal.
- DOM patch adapter that applies perspective once and ignores blocked/error patches.
- Contract-style adapter tests for timeline control, frame ticking, disposal, immutable patch consumption, and perspective behavior.

## Deferred by design

The adapter is engine-compatible and injected rather than importing GSAP directly, preserving core's zero-runtime-dependency and boundary rules. A package-level GSAP wiring choice belongs to packaging/build work once the published package shape exists.

## Guardrails

- One owner per state transition.
- No compatibility aliases, flags, facades, or copied predecessor tests.
- No renderer imports in core layers; adapters own external capability boundaries.
- No claim that a CI gate is live until its job runs.
- Formatting remains separate from behavior.
- Docs, types, and tests move together.
