# ADR-035: a rollback never outranks the rejection that triggered it

**Status:** accepted  
**Date:** 2026-08-18  
**Issue:** [#133](https://github.com/chahyasantoso/motion5/issues/133)

## Context

`ProjectRuntime` has two mutating entry points that commit only after the candidate graph accepts them, and both undo their own preparation when it does not.

`addMotion`, added by `T4` under ADR-032:

```ts
this.#createMotion?.(accepted);
try {
  this.#graph.replaceGraph(this.#snapshot(this.#tracks, next));
} catch (error) {
  this.#destroyMotion?.(accepted.id);
  throw error;
}
```

And `#addTrack`, which predates it and supplied the shape:

```ts
this.#compileTrack?.(accepted, id);
try {
  this.#graph.replaceGraph(this.#snapshot(next, this.#motions));
} catch (error) {
  this.#disposeTrack?.(id);
  throw error;
}
```

In both, the rollback call is outside the `try`. If it throws, its error replaces the original one and the caller never learns why the operation was rejected.

That is reachable rather than theoretical, because both hooks end in application code. `Engine`'s `destroyMotion` hook calls `releaseMotion`, which calls `createdTriggers.get(motionId)?.dispose()`, and a driver's `dispose` is supplied through the injected factory: `createTriggerFactory({ scroll })` returns `dispose: () => port.dispose()` over a `ScrollSource` the application owns. A host whose unsubscribe throws turns a `motion-id` graph rejection into that host's unrelated failure. `disposeTrack` is the same story one layer down.

ADR-032 recorded the hazard when it made the second call site reachable, and it was filed rather than folded in because the fix belongs to both call sites at once and `#addTrack` is frozen by the trigger plan.

The invariant was also being claimed already. Case `T-6` of `packages/core/test/integration/t4-runtime-motion-parity.test.ts` asserts that the rejection propagates unchanged:

```ts
expect(() => handle.addMotion(rejected)).toThrow(/^motion-id at motions\[0\]\.id:/);
```

That assertion held only because the fake in that suite does not throw on dispose. The invariant it claims was not enforced by the code.

## Decision

Suppress and attach, never suppress and drop. One module-level owner in `project-runtime.ts`, `rejectAfterRollback(rejection, rollback)`, is used by both call sites:

1. Run the rollback inside a `try`.
2. If it succeeds, rethrow the rejection itself, untouched.
3. If it fails, throw one `AggregateError` whose `message` opens with the rejection's message verbatim and whose `errors` are `[rejection, rollbackFailure]`, in the order they happened.

`AggregateError` is the in-repo precedent rather than a new shape: `Engine`'s `onClockTick` already collects consumer failures and reports them as one. The rejection keeps the message because it is the diagnosis, the answer to "why was I refused"; the rollback failure is a second, subordinate fact and stays first-class in `errors` rather than being logged, dropped, or folded into prose.

The rejection is not mutated. Assigning `cause` on a caught error was the other option the issue offered, and it is rejected here: the rejection is constructed by the graph layer, which does not own this failure and should not appear to. `errors` also keeps both facts symmetrical and machine-readable, which a message suffix alone would not.

No rollback set changes hands. `destroyMotion` and `disposeTrack` keep exactly the jobs they had, and `engine.ts` is untouched. This decision is about who reports a failure, not about who undoes what.

## Consequences

On the ordinary path nothing changes. The rollback succeeds, the original error instance is rethrown, and every existing message and error type contract holds, including `T-6`'s anchored match and the retryable-rejection cases in `mutation-transactionality.test.ts`. That is asserted rather than assumed, by case `P-3`.

On the failing path the thrown value's type changes from whatever the host threw to `AggregateError`. Nothing could depend on the old behavior in a useful way, because the old behavior was to report the wrong error, and no test covered it. A caller matching on the message keeps working, because the message still opens with the rejection.

A rollback that never ran would also leave the rejection in front, so "rolled back once" is asserted separately from "rejection first". Precedence must not be bought by skipping the undo.

One adjacent hole is recorded and deliberately not fixed here. When a trigger's `dispose` throws, `Engine`'s `destroyMotion` hook stops before `motion.dispose()` and before dropping the map entry, so the hook's own rollback is partial even though `ProjectRuntime` commits nothing. The owner is that hook's internal ordering in `engine.ts`, a different object from this decision, and folding it in would widen a diff whose whole point is one shape at two call sites.

## Evidence

`packages/core/test/integration/rollback-error-precedence.test.ts`, cases `P-1` through `P-3`.

Red on the parent, executed rather than derived, and the run is the pull request's own first head rather than a throwaway branch. Run [32142133852](https://github.com/chahyasantoso/motion5/actions/runs/32142133852), archived at `logs/32142133852/` on `ci-logs`, applies the suite alone to the unmodified parent `6598d37` and reports `2 failed | 461 passed`.

- `P-1` is the `addMotion` regression. On the parent it fails with `expected 'host unsubscribe failed' to match /^motion-id at motions\[0\]\.id:/`: the injected factory's `dispose` threw during the rollback, and the caller was told about the host's unsubscribe instead of the rejected id.
- `P-2` is the `#addTrack` regression, driven through `ProjectRuntime` with a `disposeTrack` that throws. On the parent it fails with `expected 'compiled Track dispose failed' to match /^observation-unknown-source at /`.
- `P-3` is the ordinary path, and is not claimed as red. It exists so the fix cannot become "wrap every rejection".

The same job proves the red is assertion-level rather than infrastructure: `typecheck` and `format:check` passed before `npm test` failed, and the other 461 cases are green on that parent.

`P-` is a new citation series. The gate in `packages/core/test/unit/scripts/evidence-case-ids.test.ts` was widened by exactly one prefix to admit it, and nothing was reserved for a series that does not exist yet: both letters reserved in advance there were later claimed by the issues they were reserved against, so reserving has twice failed to prevent a widening.

## Amendment, 2026-09-22: the owner this record names has moved, and one expression decides both phases

`rejectAfterRollback` is no longer declared in `project-runtime.ts`. `rollback.ts` held it when issue #443 split that module up, and deleting `rollback.ts` moved it to `runtime/report.ts`, which is where the ownership sentence under **Decision** should now be read: one module-level owner in `runtime/report.ts`, used by both call sites. Nothing above it changed hands. The rollback set, the `errors` order, the verbatim message and the refusal to assign `cause` are all unchanged, and `P-1` through `P-3` still measure them from where they always did.

Issue #469 then generalised the policy rather than copying it a third time. `engine.ts` had declared its own `afterCleanup` one import away, differing from `rejectAfterRollback` in one word of prose, so the precedence this record decided had two spellings and no call site said which of them it wanted. There is one now: `afterCleanup(failure, phase, cleanup)` in `runtime/report.ts`, where `phase` is a closed `CleanupPhase` of `"cleanup"` and `"rollback"` read by a total `switch`, so the summary a caller reports under is a value rather than prose it hands in, and a third phase fails `typecheck` at that switch instead of inheriting whichever arm was written last. `rejectAfterRollback` keeps its name, its signature and its `never`, and is now `throw afterCleanup(rejection, "rollback", rollback)`. Both messages are byte-identical to what each function built before. ADR-092 owns the exhaustive read, and ADR-096 owns the `describeError` that the same slice stopped declaring twice.

The adjacent hole **Consequences** recorded is closed, and a third caller has joined the two this record named. Issue #145 fixed `Engine`'s `destroyMotion` hook stopping before `motion.dispose()` when a trigger's `dispose` threw, in that hook's own ordering. What #469 fixed is this precedence at `ProjectRuntime`'s constructor, which released the composition it had been handed and then rethrew whatever came back, so a `GraphRuntime` construction failure was replaced by a host's release failure and the diagnosis was lost. It reaches this policy now. `D-9` in `packages/core/test/integration/engine-teardown-ownership.test.ts` is the case, and `D-6` asserts the unwrapped `TypeError` beside it so that the aggregation stays conditional rather than becoming "wrap every failure", which is the same bound `P-3` holds for the rollback path.
