# packages/core/src/engine.ts

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

Hoisted out of the runtime options because the failed-load path needs it too: when `load()` throws before the runtime exists, there is no `runtime.dispose()` to route through. Emptying the maps before disposing anything also makes this idempotent, which it must be, because `ProjectRuntime`'s constructor already calls it when `GraphRuntime` throws. Issue #143.

## bindClock

One owner of the registration, because the trigger swap below has to make exactly the decision the build made, and two copies of an exhaustive switch is how they end up disagreeing about a binding kind. Total and exhaustive, with no `??` fallback, so a push-driven trigger cannot silently inherit `motion.onTick`, and no Motion can ever hold both a driver and its own clock advance.

## compose

The only seam between the publisher's edge resolution and `Track.compose`, and it forwards one argument because there is only one to forward. The flat input bag that used to travel beside the scoped requirement inputs is gone with the channel that filled it, so this seam can no longer undo the namespace separation the publisher established: there is no parameter here to merge an upstream value into. See ADR-044 and ADR-047.
