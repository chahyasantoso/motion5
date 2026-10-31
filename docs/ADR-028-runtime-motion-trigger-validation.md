# ADR-028: Runtime-created Motions reuse authored trigger validation

**Status:** Accepted, 2026-08-17

## Context

`Engine.load()` already validates trigger definitions with `validateMotionTrigger()`. Runtime-created Motions enter through `ProjectRuntime.addMotion()`, which previously committed new Motion to graph, then let trigger factory inspect it. Malformed time trigger such as `{ type: "time" }` therefore produced driver's generic boundary error instead of contract diagnostic `trigger-time-duration`, and could leave partially committed runtime Motion behind.

## Decision

`ProjectRuntime.addMotion()` calls shared `validateMotionTrigger()` before checking or mutating runtime graph state. Any error-severity diagnostic formatted with same diagnostic formatter as load-time validation, thrown before Motion definition committed or factory called.

Trigger validator remains single source of truth. Runtime mutation duplicates no duration, autoplay, repeat/yoyo or scroll-source rule.

## Consequences

Runtime-created Motions fail with same rule IDs as authored Motions. Invalid definitions retryable: Motion id and graph untouched. Valid definitions continue through existing `createMotion` factory path.

Error path intentionally uses runtime operation path such as `addMotion(scene).trigger`, preserving contract rule ID and message. Keeps diagnostics actionable without inventing authored array index.

## Evidence

`packages/core/test/integration/runtime-motion-trigger-validation.test.ts` proves missing time duration reports `trigger-time-duration`, and same id added successfully immediately afterward. First PR commit intentionally red: test runs against old post-commit behavior; following implementation commit turns it green.
