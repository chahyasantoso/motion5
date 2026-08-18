# ADR-032: a runtime Motion is built before it is committed

**Status:** accepted  
**Date:** 2026-08-18  
**Slice:** `T4` of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` section 7, as detailed by the T4/T5 trigger parity plan and amended by `docs/IMPLEMENTATION-PLAN-t4-t5-trigger-parity-corrections.md`

## Context

`ProjectRuntime.addMotion` validated the trigger, rejected non-empty tracks, rejected a duplicate id, then replaced the graph and committed the definition to `#motions` **before** calling the `createMotion` hook. The hook is what actually builds the Motion, and it can fail: `createTriggerFactory` throws `trigger-driver-unavailable` when a `scroll` trigger has no registered source, and it throws from `create` before anything is registered.

So the one reachable creation failure published a motion id for a Motion that does not exist. `ProjectRuntime` held the definition and a replaced graph while `Engine`'s `motions` map held nothing.

The ghost was not the worst part. A later `addTrack(track, { motionId: ghost })` passed the `#motions.has` check, compiled a `Track`, replaced the graph, committed the entry to `#tracks`, and only then threw `Unknown motion "<id>".` from the `addMotionTrack` hook, before `mount` ran. The result was a committed, compiled, unmounted Track plus a live graph node owned by nothing, and the message blamed the follow-up call rather than the creation that failed one call earlier. `destroyMotion(ghost)` cleared it, silently, so nothing surfaced the original cause.

`ADR-028` made `addMotion` reject an **invalid** definition with the same diagnostics as `load()`. It did not make it reject an **unbuildable** one.

## Decision

`addMotion` mutates in this order:

1. validate the trigger through `validateMotionTrigger`
2. reject non-empty `tracks`
3. reject a duplicate id
4. call the `createMotion` hook
5. call `replaceGraph` inside a `try`, and on failure call the `destroyMotion` hook and rethrow the original error
6. commit the definition to `#motions`

Nothing is committed until it can be built. This mirrors `#addTrack`, which already compiles a Track first and disposes it when the candidate graph rejects; the precedent is in the same file rather than a new rollback shape.

The rollback reuses the existing `destroyMotion` hook. That hook is already the exact rollback set: it releases the clock consumer, disposes the created trigger, disposes the Motion, and drops the map entry. It is a no-op for an absent id. No second rollback owner is introduced, and `engine.ts` is unchanged.

A rejected `addMotion` leaves nothing behind, and "nothing" is enumerated: no entry in `ProjectRuntime`'s motion map, no graph node, no clock consumer, no undisposed trigger, no compiled `Track`, and `instanceCount` unchanged.

`destroyMotion` is untouched. Its ordering was already correct and is now covered by a test rather than changed.

## Relationship to other decisions

`ADR-028` is neither superseded nor edited. Validation rejects a bad definition; this ordering rejects an unbuildable one. Both now fail before any commit, and they compose: the trigger diagnostics still run first, so an invalid definition never reaches the factory.

`ADR-030` supplies the reachable trigger for this path. `trigger-driver-unavailable` is the only failure that originates inside `createMotion` rather than before it, which is why the regression case uses a `scroll` definition with no registered resolver.

`ADR-031` is preserved. `Motion` still resolves compiled Tracks by id, `MotionTrackEntry` stays `{ id, duration? }`, and nothing here captures a `Track`. `packages/core/src/domain/motion.ts` is not touched, so the `C-3` source guard stays green without being edited.

There is still exactly one Motion construction path. Runtime Motions go through the same `buildMotion` closure, the same `resolveTriggerDefinition` narrowing, the same `triggerFactory`, and the same exhaustive `ClockBinding` switch. No trigger kind is read outside the factory.

## Consequences

A driver that cannot be created now fails at the call that asked for it, with the rule id and the motion id in the message, instead of one call later from the wrong layer.

`addMotion` can now run a driver's construction side effects and then undo them. That is why disposal is asserted as exactly once rather than at least once: `CreatedTrigger.dispose` is contractually idempotent, but idempotence is the safety net, not the expected behavior, and a count of two would mean the release path stopped being single-owner.

The `motion-id` graph rejection reachable through `addMotion` is now a rollback path rather than a pre-commit reject. The error the caller sees is unchanged.

## Evidence

`packages/core/test/integration/t4-runtime-motion-parity.test.ts`.

- `T-3` is the ghost regression. It fails on the parent because the committed definition makes `handle.track("late/arm")` return a live handle and `destroyMotion("late")` report `still has 1 track(s)`.
- `T-6` is the rollback regression. It fails on the parent because the factory is never asked to create the Motion, so the creation counter reads zero and there is nothing to dispose.
- `T-1` proves parity by comparing whole emitted progress sequences between a runtime-created and a load-time authored `time` Motion, not a final value, because a double advance still lands on `1`.
- `T-2`, `T-4`, `T-5`, and `T-7` are behavior-preservation guards and pass on the parent.

The case ids belong to the `T-` series, separate from the `T4-n` locked decision ids, per the corrections doc. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` enforces that each names exactly one test in the suite.
