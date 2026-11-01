# ADR-067: A commit boundary owns the teardown a hook asked for, and the release is deferred while the decision is not

**Status:** Accepted, 2026-09-05. [Issue #303](https://github.com/chahyasantoso/motion5/issues/303).

## Context

ADR-064's 2026-09-04 amendment closed caller entering `#apply` on already-disposed runtime. Its **Stated on starting rather than on running** paragraph named case left open: host hook applied inside `#apply` is caller code too, and one that disposes runtime mid-commit still reaches graph on dead runtime. Stated explicitly, not by omission, so stated invariant not read as covering this.

This is that case. New record, not fifth amendment to that one: ADR-064 owns schema transaction and hooks a commit derives from what it commits; question here is commit lifecycle vs resource lifetime — when runtime may say it is dead, when it may let go of what it holds. None of ADR-064's four amendments asks that; paragraph above stays true of slice that wrote it, so nothing there goes stale.

Gap named, undescribed, not known wrong — what issue asked measured first. Two shapes, not one.

**Disposal from an effect, before `replaceGraph`.** `dispose()` set flag, detached every instance, cleared both retained maps, disposed graph, called `disposeComposition()` — all synchronously inside hook. Control returned to loop that knew nothing. Every remaining effect ran: `compileTrack`, `stageTrack` and `replaceMotionTrack` reached composition whose teardown already returned; what they built unreachable by any later release, since `dispose` one-shot. `replaceGraph` then hit `GraphRuntime`'s own liveness check, threw; `catch` reverted in apply order, handed same torn-down composition a `disposeTrack`, a `destroyMotion` and `staged.rollback()`; `Error: GraphRuntime is disposed.` reached caller. That last part: defect issue #288 corrected for a recipe, one indirection further in — names layer that noticed, not owner that decided. `#adoptMaps` never reached, the one thing that did not go wrong.

**Disposal from a settle step, after `replaceGraph`.** Not in issue's own description, strictly worse. `addMotionTrack`, `removeMotionTrack`, `disposeTrack` and `staged.commit()` all injected seams, all run outside the try, after `#adoptMaps`, after graph accepted. Next settle step `#mountNode` calls `GraphRuntime.attach`, which asserts liveness → `Error: GraphRuntime is disposed.` escaped `#apply` with commit already adopted, no rollback list at all: settle step has no revert by design.

So mid-commit disposal continued into `replaceGraph`, map adoption, settle steps, invalidation. Only `replaceGraph` happened to stop it, on behalf of layer that does not own this decision.

## Decision

`dispose()` never refused, never interrupts commit. Honoured immediately as an **answer**, deferred as a **release**: from line called, every public member refuses `ProjectRuntime is disposed.`, every handle answers stale; graph, retained pair, composition stay alive until in-flight commit finishes unwinding. Release runs exactly once, at boundary owning unwind, after rollback, after settle phase.

**A refusal and a release are two questions, and only the first may be answered inside a callback the owner is still inside.** Whole of it — argument, not preference, worth stating as one. Rollback owns composition resources release would otherwise double-free or leak. `disposeTrack`, `destroyMotion` and `staged.rollback()` are inverses of `compileTrack`, `createMotion` and `stageTrack`; every one reaches composition. Release running where `dispose()` called therefore guarantees unwind wrong one way or other, however `#apply` arranged internally: hands torn-down host inverse of effects it can no longer apply, or skips inverses and leaks everything those effects built. Choice between double-freeing and leaking is not a contract → release moves, decision does not.

**`dispose()` stops owning resource release, starts owning decision to release.** `#teardown()` is release: previous body of `dispose()` moved, not rewritten. `dispose()` sets flag, then either calls `#teardown()` or records boundary must. `#apply` only other member allowed to call it.

**Three pieces of private state, one reader each.** `#committing` — renamed `#inFlight` by ADR-069 once four direct writes began reading it — is depth, not flag: hook can re-enter `#apply` through public entry point, and flag cleared by inner `finally` would release while outer commit still unwinding; counter costs one character, declines defect this record is not about. That reentrancy separate defect, [issue #307](https://github.com/chahyasantoso/motion5/issues/307), not this record's to fix, but state it needs exists after this slice. `#pendingTeardown` set only by `dispose()`, cleared only by `#teardown()` — exactly-once true by construction, not by two guards agreeing. And `#teardown()` itself.

**The boundary is asked in exactly three places, and the count is the design.** Each own reason; none symmetry.

After `#derive`: `#needsTimelineBuild` calls `#resolve`, injected `resolveKeyframes` seam, so caller code runs before first effect applied. Nothing applied there → refusal with nothing to roll back; also why depth raised ahead of derivation, not ahead of loop.

After every `effect.apply()`: issue #288's rule one indirection out, not restated one noun wider — precondition asserted before callback is not precondition on what follows. Plain `#assertLive()`, existing member → no second message, no second error type; throw lands in existing `catch`, so existing rollback list and `rejectAfterRollback`'s existing precedence work unchanged.

Before `invalidate`, **nowhere inside settle loop**. Asymmetry deliberate; part most likely read as oversight. Settle step has no `revert` because not allowed to fail → abandoning phase halfway leaves staged Track neither committed nor rolled back, Motion registered against node never mounted, evicted node still in `#instances`: leak dressed as refusal. Release deferred → graph and composition still live there, so `#mountNode`, `evictNode`, `addMotionTrack` and `staged.commit()` all still work; phase completes; following release cleans what it produced. Flush one thing skipped, not completed, on reason ADR-064's 2026-09-03 amendment already gives for empty-seed guard sitting where it does: batch nobody can read still opens, notifies every subscriber, moves sequence, drains seeds deferred flush held.

**`GraphRuntime is disposed.` becomes unreachable through a commit.** Sharpest statement of what changed; property to check future edit against. `GraphRuntime` never called after its own `dispose()` from this path: release last thing, every graph call precedes it.

**`#liveOf` gains one term — second half of slice.** Deferral opens window: runtime disposed, retained maps still full, every settle-phase hook runs inside it → window observable. Until now "a disposed runtime's handles are all stale" held only because `dispose()` happened to call `.clear()`, fact ADR-064's 2026-09-04 amendment states about mechanism. So one member both handle ladders already share answers `undefined` for disposed runtime, by decision. Adds no throw anywhere → ADR-056's refusal of `#assertLive` inside reading ladder untouched: `live` still may never throw, just answers `false` for decided reason, not side-effectual one. `#writableEntry` and `#writableMotion` still ask `#assertLive` first → issue #298's contract that a write reports disposal, not staleness, unchanged.

**ADR-056 needs no amendment** — reading, not omission. Its second amendment's invariant: after `dispose()` every reading member of `MotionHandle` refuses with `StaleMotionHandleError` carrying captured motion id — exactly as true after this slice as before. Only mechanism behind it moves; mechanism never that record's claim.

**`dispose()` no longer clears `#open` on deferred path**, and does not need to. `#commit` returns early whenever `#open` set → `#open` always `undefined` inside `#apply`; window can only exist while no recipe open. ADR-056's measured claim that disposed runtime never has open recipe survives; `#assertLive` and `#refuseInsideRecipe` still cannot both have something to say. Stated here, not left to next reader to re-derive.

## Alternatives rejected

**Refusing `dispose()` during a commit.** Cheapest change available, wrong, for reason ADR-064's 2026-09-04 amendment already gave refusing same for a recipe: teardown must be reachable from `catch`; hook catching own failure and tearing project down would get refusal about teardown in place of error it handled. `RA-110` keeps that refused; this would contradict it one indirection out.

**Immediate release plus an aborted commit.** Shape that looks right, cannot be made right — argument in Decision above. Worth naming as refusal, not passing over, because design reader arrives at first: guard loop, roll back, report disposal. Every part in this decision except timing of release; timing only part deciding whether rollback correct.

**An `#assertLive()` in every effect and every hook callback.** Issue forbids; guardrails own why: order enforced by convention at n call sites enforced at first only; n+1st, added later, wrong by default. Also defect issue #298 deleted seventeen copies of.

**A dedicated commit-state guard object beside `ProjectRuntime`.** Issue leaves open if evidence shows `#apply` cannot own ordering. Evidence shows it can: state is depth and flag, both read by one member; only thing needing to know commit in flight is member running commit. Second object = second lifecycle owner for two-field question, which issue's own ownership constraints refuse.

**Guarding between settle steps, for symmetry with the effect loop.** Refused on leak; named as refusal, not omission: phases asymmetric — one has revert, other not; guard treating them alike = symmetry over correctness.

**Draining the deferred release at the end of `#commit`.** `#commit` returns early while recipe open → release drained there never runs for `edit` path, runs at wrong depth for nested commit. Boundary belongs to member with the `try`.

**Widening the deferral to the four direct-hook write paths in the same slice.** `#writeValues`, `#recompileKeyframes`, `#setTrigger` and `#setStagger` each call hook then mutate retained pair in place → disposing hook leaves disposed runtime holding entries. Same defect on one family of paths that never reaches `#commit`: [issue #305](https://github.com/chahyasantoso/motion5/issues/305), not this slice. Two reasons split. Those paths return `PatchBatch` caller reads → what they answer after disposal is decision this record need not make to be correct about a commit; and mechanism here meant widened by **wrapping** second boundary in it, not copying guard into four members — shape issue #298 deleted. Widening landed as [ADR-069](./ADR-069-direct-write-boundary.md), wrapping not copying; renamed field named below, changed nothing this record decided.

## Consequences

No public surface moves: no export, type, schema, signature, message or `ruleId` changes; `dispose()` keeps signature and one-shot contract. Changed: which error caller reads when commit's hook disposes; caller reads no error at all when settle step's hook does.

Caller may now rely on three things it could not before: composition hook may dispose runtime from inside commit without leaking what applied effects built, without host asked to release same resource twice; error reads `ProjectRuntime`, not `GraphRuntime`; `disposeComposition` called exactly once, after unwind, not mid-unwind.

Settle phase now depended on to complete — assumption promoted to requirement: nothing enforces settle step cannot fail; what throwing one leaves behind undecided. That is [issue #306](https://github.com/chahyasantoso/motion5/issues/306), filed not absorbed: record relies on it being contract, and reliance nothing measures is justification guardrails call load-bearing.

[GUARDRAILS.md](./GUARDRAILS.md) gains one rule, one only: general form of argument above. Re-ask in effect loop earns nothing — rule it applies already there from issue #288; restating one noun wider = drift with extra steps.

## Evidence

`RA-114` through `RA-117` in `packages/core/test/unit/runtime/structural-commit-path.test.ts`, which already owns `RA-1` through `RA-7`, already injects every hook a commit reaches, already carries one ordered journal this measurement needs. Pushed ahead of source → red run its own, citable by id.

Rig gains disposing-hook config, `replaceMotionTrack` line, optional `stageTrack` seam, `disposeComposition` line. Last is instrument, not convenience: rollback step reaching torn-down composition and one reaching live composition indistinguishable by any counter, differ by one journal line. Staging seam wired only when case asks: seven cases above written against rig without one.

- `RA-114` the effect-phase contract. Message `ProjectRuntime is disposed.`, not `AggregateError` — how it says rollback itself did not fail; journal reads compile, dispose, composition-dispose in that order; no settle-phase line at all, where non-adoption measured rather than in a second assertion; second explicit `dispose()` adds no second teardown.
- `RA-115` precedence when a hook disposes and then throws. Caller gets hook's own error by identity, not disposal; staged replacement rolled back, never committed; effect that threw not reverted — effect counts applied only once its call returned; rollback line still precedes teardown.
- `RA-116` the window is closed. Reads `live`, `definition`, `motion()` and `mount()` inside disposing hook, after `dispose()` returned. Green both sides for two different reasons, `RA-110`'s shape: before, maps already empty; after, `#liveOf` reads flag. Lie detector for deferral, not evidence of fix: case a deferral moving release without moving that answer fails.
- `RA-117` settle-phase contract and accepting direction. Nothing thrown; handle comes back; settle phase completed; flush skipped; node following settle step mounted detached by release. Written through outcome helper, not bare call, for reason `schema-transaction.test.ts` gives about `RA-109`: red run must fail on assertion that disagreed, not call that could not finish.

Three of four red, predicted and reported, not engineered. `RA-116` cannot fail before slice; file says so — guardrail against padding red count by asserting less in case that could not fail.
