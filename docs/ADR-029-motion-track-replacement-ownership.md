# ADR-029: Motion-owned Track replacement preserves ownership identity

**Status:** Accepted, 2026-08-17

## Context

A Motion stores compiled Track references for scheduling and stagger calculations. `ProjectRuntime` also owns the graph/compiler Track instance for the same node id. Replacing a motion-owned track used to dispose and recompile only the runtime copy, leaving Motion pointed at the disposed object. The next scheduled Motion update could throw `Track is disposed`, skip siblings, and suppress invalidation.

## Decision

Replacement keeps the node id and swaps the compiled Track in place inside Motion at the original array index. The runtime performs the graph replacement, recompiles the node, then calls the owning Motion's `replaceTrack` hook with the new compiled Track and duration. Motion immediately seeds the replacement with its current effective progress, using the existing index and stagger calculation.

The remove-then-add shortcut is rejected because it moves the replacement to the end of Motion's track array and changes stagger timing. Track lookup by id is a larger follow-up because it changes Motion's constructor and all direct Motion tests; this ADR records the small Option A fix that is appropriate for the current architecture.

`addObserve` and `removeObserve` remain replacement operations on the observer Track, so they use the same ownership hook and cannot leave Motion holding a disposed compiled Track.

## Failure ordering

Graph validation happens before the runtime commits the replacement. Once the candidate graph is accepted, the old compiled Track is disposed, the new one is compiled, and Motion receives the replacement at the same index. The replacement is not a new node, so subscribers do not receive a terminal `destroyed` patch.

## Evidence

`packages/core/test/integration/issue-114-motion-track-regressions.test.ts` covers direct replacement, current-progress preservation, stagger index preservation, sibling continuity, and observation mutation. The regression suite is intentionally red against the pre-fix implementation and green with the in-place `Motion.replaceTrack` hook.