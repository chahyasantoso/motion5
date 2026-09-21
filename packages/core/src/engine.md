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

## describeError

Local on purpose. `ProjectRuntime` formats its own errors for its own layer, and promoting a shared formatter into the contract module would widen the package's declaration surface, which a governance gate scans, for two call sites.

## runAllAndReportOnce

Runs every step, then reports once.

Teardown has no partial success worth keeping. A step that throws leaves the steps behind it unrun, and those are the ones that dispose the Motion, drop the map entry, and release the compiled Track, so stopping early converts one host failure into a leak. Every step is therefore attempted and the failures are collected. Issues #143 and #145.

A lone failure is rethrown verbatim rather than wrapped. `ProjectRuntime.rejectAfterRollback` attaches whatever a rollback hook threw to its own `AggregateError`, and callers assert on that value's identity and message, so renaming a single host failure here would break the precedence contract this is meant to support. See ADR-035.

## afterCleanup

Returns the error to throw for `failure`, after running `cleanup`.

A cleanup failure is attached, never substituted. The reason an operation was refused outranks anything its teardown reports, because the caller can act on the first and not on the second. Same rule and same shape as `ProjectRuntime.rejectAfterRollback`, applied at the owner that created the things being released. Returns rather than throws so control flow at each call site is a plain `throw`, with no reliance on never-returning call analysis.

## registry

Named once, because two things ask it now: the load-time compile below, and the seam that hands `ProjectRuntime` the registry's answer about a candidate. One reference, so the compile and the predicate cannot end up asking different registries. See ADR-062.

## compileTrack

One owner for resolve, prepare, compile, and construct. Both entry points below reached the same four steps in their own copy, which is how the authored keyframes could be flattened for plugin resolution on one path and reach the interpolator still grouped on the other.

## releaseMotion

Drops both registrations before disposing, so a created trigger has exactly one owner even when a host `dispose` throws: the entry is already gone, so no later teardown can reach it a second time and no caller can reach a released driver by id. Issue #145.

## disposeComposition

Hoisted out of the runtime options because the failed-load path needs it too. It is the composition
state's building/ready cleanup hook: the hook snapshots and clears the owned maps before releasing
triggers, Motions, and Tracks, then marks the state disposed, so a constructor failure or a repeated
runtime disposal cannot release anything twice. A ready runtime reaches this same hook through its
host port; a building composition reaches it directly. Issue #143.

## bindClock

One owner of the registration, because the trigger swap below has to make exactly the decision the build made, and two copies of an exhaustive switch is how they end up disagreeing about a binding kind. Total and exhaustive, with no `??` fallback, so a push-driven trigger cannot silently inherit `motion.onTick`, and no Motion can ever hold both a driver and its own clock advance.

## compose

The only seam between the publisher's edge resolution and `Track.compose`, and it forwards one argument because there is only one to forward. The flat input bag that used to travel beside the scoped requirement inputs is gone with the channel that filled it, so this seam can no longer undo the namespace separation the publisher established: there is no parameter here to merge an upstream value into. See ADR-044 and ADR-047.
