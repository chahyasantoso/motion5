# packages/core/src/engine.ts

## CompositionState

The outer composition has one owner for its six mutable maps and its runtime boundary. `building`
means the composition owns cleanup because no runtime has been handed to the caller; `ready` means
the `ProjectRuntime` owns cleanup and reaches the composition through its host port; `disposed` is a
terminal no-op. The `cleanupOwner` tag is the answer used by failed-load rollback, rather than an
inference from whether an unrelated runtime variable happens to be undefined. A runtime constructor
that fails may already have called the composition hook, so the hook transitions to `disposed`
before it releases anything; the outer catch then has no second owner to invoke. The state is
private to `Engine` because it describes composition-root assembly, not a contract, domain, graph,
runtime, or port concern.

## MotionBuild

What `buildMotion` has built so far, and the reason it is a tag rather than two correlated locals.

The retired spelling was `let motion!: Motion` beside `let constructed = false`: a definite-assignment assertion and a boolean, hand-maintained, on the most failure-sensitive path in the engine. Two locals encoding one decision means a reader has to cross-check them to know whether the instance in scope exists, and the compiler checks neither, so the rollback obligation lived in a comment. The union states it instead. `trigger-created` is the state a failure between trigger creation and construction leaves behind, and `motion-created` is the only state that owns an instance nothing else can reach, so it is the only arm that owes `dispose()`. A third state added later fails `typecheck` at the catch and at the invalidate closure rather than inheriting whichever arm was written last.

Both members carry the trigger, because the trigger exists in both and releaseMotion's half of the teardown is owed in both. Carrying it on the union rather than reading the outer local is what lets one `switch` answer the whole cleanup question.

## runAllAndReportOnce

Runs every step, then reports once.

Teardown has no partial success worth keeping. A step that throws leaves the steps behind it unrun, and those are the ones that dispose the Motion, drop the map entry, and release the compiled Track, so stopping early converts one host failure into a leak. Every step is therefore attempted and the failures are collected. Issues #143 and #145.

A lone failure is rethrown verbatim rather than wrapped. `report.ts`'s `afterCleanup` attaches whatever a release hook threw to its own `AggregateError`, and callers assert on that value's identity and message, so renaming a single host failure here would break the precedence contract this is meant to support. That precedence used to be spelled twice, once here as a local `afterCleanup` beside a local `describeError` and once in the runtime as `rejectAfterRollback`, differing in one word of prose. It is one owner now, read with a closed `CleanupPhase`, and this file imports it rather than restating it. See ADR-035 and ADR-096.

## registry

Named once, because two things ask it now: the load-time compile below, and the seam that hands `ProjectRuntime` the registry's answer about a candidate. One reference, so the compile and the predicate cannot end up asking different registries. See ADR-062.

## compileTrack

One owner for resolve, prepare, compile, and construct. Both entry points below reached the same four steps in their own copy, which is how the authored keyframes could be flattened for plugin resolution on one path and reach the interpolator still grouped on the other.

## releaseMotion

Drops both registrations before disposing, so a created trigger has exactly one owner even when a host `dispose` throws: the entry is already gone, so no later teardown can reach it a second time and no caller can reach a released driver by id. Issue #145.

## disposeComposition

Hoisted out of the runtime options because the failed-load path needs it too. It is the composition
state's building/ready cleanup hook: the hook marks the state disposed first, then snapshots and
clears the owned maps before releasing triggers, Motions, and Tracks, so a constructor failure or a
repeated runtime disposal cannot release anything twice. Marking first is the order that makes it
re-entrant, and it is the order the code takes. A ready runtime reaches this same hook through its
host port; a building composition reaches it directly. Issue #143.

## bindClock

One owner of the registration, because the trigger swap below has to make exactly the decision the build made, and two copies of an exhaustive switch is how they end up disagreeing about a binding kind. Total and exhaustive, with no `??` fallback, so a push-driven trigger cannot silently inherit `motion.onTick`, and no Motion can ever hold both a driver and its own clock advance. Exhaustive is the compiler's claim rather than this paragraph's, since the switch ends at `unreachable`: a fourth binding kind fails `typecheck` here instead of registering no consumer at all, which is the outcome "no `??` fallback" was written to forbid and the one a `switch` without a `default` arm quietly produced. An injected factory is the reason that mattered, because `TriggerFactory` is a seam and a host can hand back a kind this build was never compiled against. The capability projection beside the union reads it through the same sink, so an arriving kind is refused at whichever of the two reads it first rather than absorbed by either. See ADR-092 and ADR-099.

## adoptMotion

Builds a Motion and decides whether this composition may take it, which is one question with one owner.

Both adoption sites read `motions.set(id, buildMotion(...))` before this existed, and an argument is evaluated before the call that receives it. So the map write happened after everything the build reached, including any host callback `Motion.play()` entered, and neither site said what kept that safe. What kept it safe was `ProjectRuntime` deferring its release past the commit boundary it was called inside, which is ADR-067's decision and a policy this file neither owns nor names. A composition whose safety is held by another module's unwind order is the same shape as a reader asserting a narrowing the union already proves: correct today, and correct for a reason nothing at the site states. See ADR-067.

The state answers it instead. `building` and `ready` adopt, and `disposed` releases what the build created through `releaseMotion` and the instance's own `dispose`, rather than writing it into maps `disposeComposition` has already snapshotted and cleared. That last case is the one worth naming: an entry written after the clear is reachable by id and absent from the teardown snapshot, so it is the one Motion a one-pass disposal can never reach, and ADR-032's exactly-once becomes exactly zero. The release also drops the clock consumer `bindClock` registered after `play()` returned, which is the second write the same shape exposes.

Read after the build rather than before, because before answers a question that has not happened yet: construction is where a host callback reenters, so liveness at entry says nothing about liveness at adoption. The refusal outranks what its release reports, which is `buildMotion`'s own cleanup shape applied one level out, and it is a refusal rather than a silent release because a caller told its Motion was created would hold an id this composition does not have. See ADR-090 and ADR-092.

No behavioural case covers the `disposed` arm, and that is measured rather than omitted. Issue #469 recorded this as a live defect reachable from a trigger port that disposes the handle from inside `Motion.play()`; it is not, because `dispose()` from inside the `createMotion` hook sets the phase retiring and leaves the release to the boundary's unwind, and the load-time loop hands a host no reference to the runtime it is building. `RA-153` is the fixture that proves the deferral. So the arm is unreachable by construction while ADR-067 holds, exactly as the publisher's `input-requirement` guard is, and `D-8` pins the owner and the exhaustive read rather than claiming an arm it cannot enter. A later slice that moves ADR-067's deferral finds a reader here that already owes it a decision.

## compose

The only seam between the publisher's edge resolution and `Track.compose`, and it forwards one argument because there is only one to forward. The flat input bag that used to travel beside the scoped requirement inputs is gone with the channel that filled it, so this seam can no longer undo the namespace separation the publisher established: there is no parameter here to merge an upstream value into. See ADR-044 and ADR-047.
