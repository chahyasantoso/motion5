# ADR-032: a runtime Motion is built before it is committed

**Status:** accepted  
**Date:** 2026-08-18  
**Slice:** `T4` of `docs/IMPLEMENTATION-PLAN-trigger-drivers.md` section 7, as detailed by the T4/T5 trigger parity plan and amended by `docs/IMPLEMENTATION-PLAN-t4-t5-trigger-parity-corrections.md`

## Context

`ProjectRuntime.addMotion` validated trigger, rejected non-empty tracks, rejected duplicate id, then replaced graph and committed definition to `#motions` **before** calling `createMotion` hook. Hook actually builds Motion, and can fail: `createTriggerFactory` throws `trigger-driver-unavailable` when `scroll` trigger has no registered source, and throws from `create` before anything registered.

So one reachable creation failure published motion id for Motion that does not exist. `ProjectRuntime` held definition and replaced graph while `Engine`'s `motions` map held nothing.

Ghost not worst part. Later `addTrack(track, { motionId: ghost })` passed `#motions.has` check, compiled `Track`, replaced graph, committed entry to `#tracks`, only then threw `Unknown motion "<id>".` from `addMotionTrack` hook, before `mount` ran. Result: committed, compiled, unmounted Track plus live graph node owned by nothing, and message blamed follow-up call rather than creation that failed one call earlier. `destroyMotion(ghost)` cleared it silently → nothing surfaced original cause.

`ADR-028` made `addMotion` reject **invalid** definition with same diagnostics as `load()`. It did not make it reject **unbuildable** one.

## Decision

`addMotion` mutates in this order:

1. validate trigger through `validateMotionTrigger`
2. reject non-empty `tracks`
3. reject duplicate id
4. call `createMotion` hook
5. call `replaceGraph` inside `try`; on failure call `destroyMotion` hook and rethrow original error
6. commit definition to `#motions`

Nothing committed until it can be built. Mirrors `#addTrack`, which already compiles Track first and disposes it when candidate graph rejects; precedent in same file rather than new rollback shape.

Rollback reuses existing `destroyMotion` hook, already exact rollback set: releases clock consumer, disposes created trigger, disposes Motion, drops map entry. No-op for absent id. No second rollback owner introduced; `engine.ts` unchanged.

Rejected `addMotion` leaves nothing behind, and "nothing" enumerated: no entry in `ProjectRuntime`'s motion map, no graph node, no clock consumer, no undisposed trigger, no compiled `Track`, `instanceCount` unchanged.

Two items in that list vacuous at point of rejection; saying so is difference between enumeration and claim. Runtime Motion must start with empty `tracks` → contributes no graph node, compiles no `Track` of its own; "no graph node" and "no compiled Track" only become load-bearing for follow-up `addTrack` a surviving ghost id would have accepted. That follow-up is what case `T-3` exercises, and why node count alone is not evidence there.

`destroyMotion` untouched. Its ordering already correct, now covered by test rather than changed.

## Relationship to other decisions

`ADR-028` neither superseded nor edited. Validation rejects bad definition; this ordering rejects unbuildable one. Both now fail before any commit, and compose: trigger diagnostics still run first, so invalid definition never reaches factory.

`ADR-030` supplies reachable trigger for this path. `trigger-driver-unavailable` only failure originating inside `createMotion` rather than before it, which is why regression case uses `scroll` definition with no registered resolver.

`ADR-031` preserved. `Motion` still resolves compiled Tracks by id, `MotionTrackEntry` stays `{ id, duration? }`, nothing here captures `Track`. `packages/core/src/domain/motion.ts` not touched → `C-3` source guard stays green without being edited.

Still exactly one Motion construction path. Runtime Motions go through same `buildMotion` closure, same `resolveTriggerDefinition` narrowing, same `triggerFactory`, same exhaustive `TriggerBinding` switch. No authored trigger kind read outside factory, and `Engine` reads factory-returned `TriggerBinding` only through `acceptsExternalSignal` and `bindClock`.

## Consequences

Driver that cannot be created now fails at call that asked for it, with rule id and motion id in message, instead of one call later from wrong layer.

`addMotion` can now run driver's construction side effects and then undo them. Why disposal asserted exactly once rather than at least once: `CreatedTrigger.dispose` contractually idempotent, but idempotence is safety net, not expected behavior; count of two would mean release path stopped being single-owner.

`motion-id` graph rejection reachable through `addMotion` now rollback path rather than pre-commit reject. Error caller sees unchanged.

Rollback call itself outside `try` → `destroyMotion` hook that throws would replace original rejection. `#addTrack` same shape, so ordering does not introduce hazard, but makes it reachable second way. Tracked as issue [#133](https://github.com/chahyasantoso/motion5/issues/133) rather than folded in, because fix belongs to both call sites at once.

## Evidence

`packages/core/test/integration/t4-runtime-motion-parity.test.ts`.

Red on parent, executed rather than derived. Suite applied alone to unmodified parent `a57634f` on branch `test/t4-red-evidence`, PR [#132](https://github.com/chahyasantoso/motion5/pull/132), CI run [32096251602](https://github.com/chahyasantoso/motion5/actions/runs/32096251602), archived at `logs/32096251602/` on `ci-logs`. Test blob there byte-identical to one this slice ships. Result: `2 failed | 442 passed`, and two are exactly `T-3` and `T-6`.

- `T-3` ghost regression. On parent fails at `expect(() => handle.track("late/arm")).toThrow(...)` with `expected [Function] to throw an error`, because committed definition let follow-up `addTrack` compile and commit Track → node resolves to live handle instead of being unknown.
- `T-6` rollback regression. On parent fails at `expect(counting.created).toEqual(["bad/id"])` with `expected [] to deeply equal [ 'bad/id' ]`, because graph replaced before factory ever asked to create Motion → nothing built, nothing needed disposing.
- `T-1` proves parity by comparing whole emitted progress sequences between runtime-created and load-time authored `time` Motion, not final value, because double advance still lands on `1`.
- `T-2`, `T-4`, `T-5`, `T-7` behavior-preservation guards, confirmed green on parent by same run.

Case ids belong to `T-` series, separate from `T4-n` locked decision ids, per corrections doc. `packages/core/test/unit/scripts/evidence-case-ids.test.ts` enforces each names exactly one test in suite.
