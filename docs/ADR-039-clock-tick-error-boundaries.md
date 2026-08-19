# ADR-039: a tick has two error boundaries, one for clock consumers and one for the graph flush

**Status:** accepted

**Date:** 2026-08-19

## Context

`GraphRuntime` takes the project's only clock subscription and does two unrelated things with every tick. It advances the clock consumers through `onClockTick`, which is where a Motion progress sweep and every trigger driver live, and then it flushes the graph.

Both ran inside one `try` with one `catch`, and that catch reported `flush-failure`. A driver that threw was therefore diagnosed as a graph flushing failure, on a tick where the flush had not been reached at all. The report also skipped the tick it was about: `#report` stamped `path` with `#lastTick`, which `flush` had not yet advanced, so a consumer failure on frame 4 was filed under frame 3.

The second half of the loss was in the message. `Engine`'s fanout collects per-consumer failures and reports them once, rethrowing a lone failure verbatim and wrapping two or more in an `AggregateError` whose message is only the context string, `Clock consumer fanout failed.` Printing `error.message` for that value named the boundary and dropped every cause it had just been careful to collect.

Issue #114 noted this under section 3.3 and was closed for the stale Track ownership it actually owned. Issue #154 is the remainder.

## Decision

A tick has two error boundaries, and they are independent in both directions.

**Two rule ids, one report path.** Consumer advancement reports `clock-consumer-failure`; the graph flush keeps `flush-failure`. Both go through the existing `#report` and the existing `onFlushError`, so there is no second diagnostics channel and no second place a tick failure is announced from. ADR-016 still holds: nothing new is subscribed to.

**One clock subscription, unchanged.** The split is two private methods behind the same `#onTick`, not a second `Clock.subscribe`. The fanout itself, and the rule that one throwing consumer does not stop the consumers behind it, stay with the single `onClockTick` owner in `Engine`.

**The flush runs even when a consumer threw.** This is the part that is a decision rather than a relabelling. A boundary that also cancelled the flush would not be a separate boundary: one Motion's driver would drop the frame for every node in the project, including nodes that have nothing to do with it. That is the fanout's own reasoning applied one step further out. The single exception is disposal from inside a consumer, which returns early, because there is no longer a runtime to flush and `flush` would only refuse with a failure the tick did not cause.

**Each boundary names its own tick.** Both boundaries pass the tick they are handling to `#report`, so `path` and the message agree. The default stays `#lastTick` for the scheduled drain and the clock regression report, which are about the last tick that completed rather than one in progress.

**`AggregateError` is flattened into the message.** `describe` walks `errors` and joins the causes after the aggregate's own message, recursively. A single consumer failure still reads as its own message, because the fanout rethrows a lone failure verbatim.

## Alternatives rejected

**A new rule id and nothing else.** It satisfies the sentence "a consumer failure is not labelled `flush-failure`" and leaves two defects standing: the flush is still cancelled by an unrelated consumer, and a multi-consumer failure still reports one context string with no causes. Renaming a wrong attribution is not attributing it correctly.

**A second clock subscription for consumers.** It gives each concern its own boundary for free, and it breaks the one thing this runtime guarantees about ticks: a single subscription per project, so consumer advancement and flushing cannot interleave with a third listener between them. Explicitly refused by the issue, and correctly.

**Reporting the consumer failure and rethrowing it to the clock.** A tick that throws to the frame source stops the loop for every subscriber behind it, which is what `createBrowserClock` already survives by rescheduling. Making the runtime rely on that is worse than diagnosing it: the caller of a frame callback has nothing useful to do with the failure.

**Attaching the causes with `cause` instead of flattening.** `Diagnostic` is a flat, frozen, serializable record read by inspectors and logs, and it has no slot for a nested error. A cause chain that only exists on a value nobody keeps is not evidence. Same reasoning as ADR-035's preference for first-class `errors` over a message suffix, in the other direction, because the transport here is a diagnostic rather than an error.

**Suppressing the flush diagnostic when a consumer already failed.** Tempting, since a flush that follows a failed progress sweep may fail for a related reason. It also hides real flush defects behind unrelated driver bugs, and it makes the number of diagnostics per tick depend on which boundary failed first.

## Consequences

A host that pattern-matches on `flush-failure` to detect graph trouble stops seeing driver bugs there, which is the point, and gains `clock-consumer-failure` to match on instead. Both are documented in the diagnostics guide.

A tick whose consumers failed now publishes a batch where it previously published nothing. The values are whatever progress was last committed, so a stalled driver reads as a held frame rather than a dropped one, and `graph.tick` no longer falls behind the clock every time a consumer throws.

A tick can now report two diagnostics instead of one. That is two failures, not one failure counted twice, and the order is the order they happened.

## Evidence

`packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts` cases `B-1` through `B-7`: the rule id and tick of a consumer failure, the flush still publishing on a tick whose consumer threw, every cause surviving a multi-consumer aggregate, a real flush failure keeping `flush-failure` with its seeds requeued, both boundaries reporting separately on one tick, one subscription and one report per failure, and frames continuing after a failed tick.

Failing-first is replayed by dispatching `Recovery audit` with `base` set to `main`, because the behavior and the tests land as separate commits on this branch.
