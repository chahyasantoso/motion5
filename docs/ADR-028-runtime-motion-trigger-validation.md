# ADR-028: Runtime-created Motions reuse authored trigger validation

**Status:** Accepted, 2026-08-17

## Context

`Engine.load()` already validates trigger definitions with `validateMotionTrigger()`. Runtime-created Motions enter through `ProjectRuntime.addMotion()`, which previously committed the new Motion to the graph and then let the trigger factory inspect it. A malformed time trigger such as `{ type: "time" }` therefore produced the driver's generic boundary error instead of the contract diagnostic `trigger-time-duration`, and could leave a partially committed runtime Motion behind.

## Decision

`ProjectRuntime.addMotion()` calls the shared `validateMotionTrigger()` before checking or mutating runtime graph state. Any error-severity diagnostic is formatted with the same diagnostic formatter used by load-time validation and thrown before the Motion definition is committed or the factory is called.

The trigger validator remains the single source of truth. Runtime mutation does not duplicate duration, autoplay, repeat/yoyo, or scroll-source rules.

## Consequences

Runtime-created Motions now fail with the same rule IDs as authored Motions. Invalid definitions are retryable because the Motion id and graph remain untouched. Valid definitions continue through the existing `createMotion` factory path.

The error path intentionally uses a runtime operation path such as `addMotion(scene).trigger`, while preserving the contract rule ID and message. This keeps diagnostics actionable without inventing an authored array index.

## Evidence

`packages/core/test/integration/runtime-motion-trigger-validation.test.ts` proves a missing time duration reports `trigger-time-duration` and that the same id can be added successfully immediately afterward. The first PR commit is intentionally red because the test runs against the old post-commit behavior; the following implementation commit turns it green.
