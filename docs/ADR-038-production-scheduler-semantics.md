# ADR-038: the shipped Scheduler is microtask-paced behind an injected host

**Status:** accepted

**Date:** 2026-08-19

## Context

`Engine` validates three ports at construction and refuses to build without a `Scheduler`, but no implementation shipped from any declared entrypoint. The only bundled one was `createFakeScheduler` under `@motion5/core/ports/fakes`, which collects jobs and then waits for the caller to call `flush()`.

That left two dishonest things in the tree. The getting-started guide told every consumer to write the port themselves and called it about ten lines, which holds only until the second pass matters: applying progress can enqueue the graph flush that publishes it, so a naive one-shot drain publishes nothing and the guide had to ship a `while` loop to hide it. And `apps/react-demo` composed the test double in a production page and called `scheduler.flush()` by hand from inside its scroll subscriber, which is precisely the shape a reader would copy.

The decision issue #155 asked for is not "write a scheduler". It is which object owns pacing, and where an implementation is allowed to live.

## Decision

The shipped `Scheduler` is `createMicrotaskScheduler`, and it drains on an injected `SchedulerHost` whose default is a promise microtask.

**Microtask, not animation frame.** `Clock` already owns frame pacing through `createBrowserClock(frameSource)`, and a `TriggerPort` can emit outside any tick at all, which is exactly what `createScrollTriggerPort` does. A frame-paced scheduler would therefore give pacing two owners, and it would publish a value one frame after the tick that produced it. A microtask pass instead ends the turn that produced the work: inside the same frame, before paint, and after the emission that queued it.

**Host primitives are injected, never reached for.** The default host is `Promise.resolve().then(drain)`. `Promise` is an ECMAScript intrinsic rather than a host API, so core names no `queueMicrotask`, no `requestAnimationFrame` and no `globalThis`, and the same code runs in a browser, in Node and in a worker with no environment check. A host that wants a different queue injects one, exactly as the browser clock takes a `FrameSource`.

**Cancellation is read at execution time.** `Cancel` marks its own entry and the drain reads the mark as it reaches each job, rather than filtering the pass up front. A job may therefore cancel a job behind it in the same pass. Ordering inside a pass is scheduling order, and a stale handle is inert rather than an error.

**Reentrant scheduling lands in the next pass.** The drain clears its scheduled flag before it runs anything, so a job that schedules gets a fresh host enqueue instead of extending the pass it is inside. There is one host enqueue per pass, never one per job. `GraphRuntime.#scheduleDrain` already assumes that boundary, and `createFakeScheduler.flush()` already ends a pass the same way, so the deterministic double and the shipped implementation agree on where a pass stops.

**Every job in a pass runs, then one failure is reported.** A throwing job does not get to decide whether the jobs behind it happen at all. A lone failure is rethrown verbatim, several are wrapped in one `AggregateError`, and `onError` is the interception point. Without `onError` the failure leaves through the host's own channel, which for the default host means an unhandled rejection.

**No new declared subpath.** The factory is named from the root entry and from the `./adapters` barrel, the same shape `createDefaultTriggerFactory` already uses, so the `exports` map in `packages/core/package.json` is unchanged.

## Alternatives rejected

**An animation-frame scheduler.** It reads as the obvious choice for an animation runtime, and it is the wrong one here. Pacing would have two owners, a scroll emission would wait for a frame that the clock had already spent, and a value would publish one frame behind the tick that computed it. The port that decides _when_ to apply is not the port that decides _when time advances_.

**A bare `queueMicrotask` call with no injection.** One line shorter and it gives the same ordering, but it puts a host global inside core and makes the pass boundary untestable without fake timers. The `FrameSource` precedent exists for this reason.

**Promoting `createFakeScheduler` to the production entry.** It already ships, and its `flush()` is genuinely useful, but a scheduler whose pass only happens when the consumer remembers to ask is not a scheduler. Promoting it would also erase the line between a test double and runtime API, which is the line `@motion5/core/ports/fakes` exists to draw.

**A dedicated `./scheduler` subpath.** It reads well, and it widens the public surface for nothing: the factory is an optional implementation chosen at the composition root, which is what the adapters entry already means. ADR-036 prefers enumeration to convenience, and the cheapest enumeration here is none.

**Draining until the queue settles inside one pass.** A single pass that loops until empty would let a caller read a published value without waiting a turn, and it would also let one runaway job starve the frame. The two-pass shape is what keeps applying progress and the graph follow-up it queues observable as separate turns.

## Consequences

A consumer composes `createMicrotaskScheduler()` and stops owning a port they were never given the rules for. `createFakeScheduler` becomes reachable only from tests, and the guide can show a real pipeline.

The visible behavior change is error surfacing. A throwing job used to fail at the consumer's own `flush()` call site; it now leaves through the host, and with the default host that is an unhandled rejection. `onError` exists for anything that wants to route failures itself, and the API reference documents it rather than leaving it to be discovered.

Reading a published value now requires letting the queue run. In a browser that happens on its own before paint. In a test or a script it means awaiting a turn, which is why the guide shows a one-line helper rather than pretending the read is synchronous.

## Evidence

`packages/core/test/contract/microtask-scheduler.test.ts` cases `K-1` through `K-8` cover deferral, ordering inside and across passes, cancellation including a job cancelling its successor mid-pass, reentrancy with one enqueue per pass, the thrown-job policy in both its verbatim and aggregated forms, a throwing host, and microtask-before-macrotask ordering on the default host.

The host is injected in every case but `K-8`, so none of this evidence depends on timers.
