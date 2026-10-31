# ADR-039: a tick has two error boundaries, one for clock consumers and one for the graph flush

**Status:** accepted

**Date:** 2026-08-19

## Context

`GraphRuntime` takes project's only clock subscription, does two unrelated things per tick: advances clock consumers through `onClockTick` (where Motion progress sweep and every trigger driver live), then flushes graph.

Both ran inside one `try` with one `catch`; catch reported `flush-failure`. Driver that threw therefore diagnosed as graph flushing failure, on tick where flush never reached. Report also skipped tick it was about: `#report` stamped `path` with `#lastTick`, which `flush` had not yet advanced → consumer failure on frame 4 filed under frame 3.

Second half of loss in message. `Engine`'s fanout collects per-consumer failures, reports once: lone failure rethrown verbatim, two or more wrapped in `AggregateError` whose message is only context string, `Clock consumer fanout failed.` Printing `error.message` for that value named boundary, dropped every cause it had just been careful to collect.

Issue #114 noted this under section 3.3, closed for stale Track ownership it actually owned. Issue #154 is remainder.

## Decision

A tick has two error boundaries, independent in both directions.

**Two rule ids, one report path.** Consumer advancement reports `clock-consumer-failure`; graph flush keeps `flush-failure`. Both go through existing `#report` and existing `onFlushError` → no second diagnostics channel, no second place a tick failure announced from. ADR-016 still holds: nothing new subscribed to.

**One clock subscription, unchanged.** Split is two private methods behind same `#onTick`, not second `Clock.subscribe`. Fanout itself, and rule that one throwing consumer does not stop consumers behind it, stay with single `onClockTick` owner in `Engine`.

**Flush runs even when consumer threw.** Part that is decision rather than relabelling. Boundary also cancelling flush would not be separate boundary: one Motion's driver would drop frame for every node in project, including nodes with nothing to do with it. Fanout's own reasoning one step further out. Single exception: disposal from inside consumer, which returns early — no longer a runtime to flush, `flush` would only refuse with failure tick did not cause.

**Each boundary names its own tick.** Both pass tick they handle to `#report`, so `path` and message agree. Default stays `#lastTick` for scheduled drain and clock regression report, about last tick completed rather than one in progress.

**`AggregateError` flattened into message.** `describe` walks `errors`, joins causes after aggregate's own message, recursively. Single consumer failure still reads as own message: fanout rethrows lone failure verbatim.

## Alternatives rejected

**New rule id and nothing else.** Satisfies "a consumer failure is not labelled `flush-failure`", leaves two defects: flush still cancelled by unrelated consumer; multi-consumer failure still reports one context string with no causes. Renaming wrong attribution is not attributing it correctly.

**Second clock subscription for consumers.** Gives each concern own boundary for free, breaks one thing runtime guarantees about ticks: single subscription per project, so consumer advancement and flushing cannot interleave with third listener between them. Explicitly refused by issue, correctly.

**Reporting consumer failure and rethrowing it to clock.** Tick throwing to frame source stops loop for every subscriber behind it, which `createBrowserClock` already survives by rescheduling. Making runtime rely on that worse than diagnosing it: caller of frame callback has nothing useful to do with failure.

**Attaching causes with `cause` instead of flattening.** `Diagnostic` flat, frozen, serializable record read by inspectors and logs, no slot for nested error. Cause chain existing only on value nobody keeps is not evidence. Same reasoning as ADR-035's preference for first-class `errors` over message suffix, other direction: transport here is diagnostic, not error.

**Suppressing flush diagnostic when consumer already failed.** Tempting: flush following failed progress sweep may fail for related reason. Also hides real flush defects behind unrelated driver bugs; makes number of diagnostics per tick depend on which boundary failed first.

## Consequences

Host pattern-matching `flush-failure` to detect graph trouble stops seeing driver bugs there — the point — gains `clock-consumer-failure` to match instead. Both documented in diagnostics guide.

Tick whose consumers failed now publishes a batch where it previously published nothing. Values whatever progress last committed, so stalled driver reads as held frame rather than dropped one; `graph.tick` no longer falls behind clock every time a consumer throws.

Tick can now report two diagnostics instead of one. Two failures, not one counted twice; order is order they happened.

## Evidence

`packages/core/test/unit/runtime/clock-consumer-error-boundary.test.ts` cases `B-1` through `B-7`: rule id and tick of consumer failure; flush still publishing on tick whose consumer threw; every cause surviving multi-consumer aggregate; real flush failure keeping `flush-failure` with seeds requeued; both boundaries reporting separately on one tick; one subscription and one report per failure; frames continuing after failed tick.

Failing-first replayed by dispatching `Recovery audit` with `base` set to `main`: behaviour and tests land as separate commits on this branch.
