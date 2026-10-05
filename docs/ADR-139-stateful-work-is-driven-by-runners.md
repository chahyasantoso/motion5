# ADR-139: Stateful work is driven by runners

**Status:** Accepted, 2026-10-05

## Context

Plugin composition repeats on seek, replacement and rollback. Hidden temporal state would make
those operations depend on execution history (ADR-045, ADR-064 and ADR-111). A simulation,
temporal filter or inference model has a lifecycle that pure graph composition cannot own.

## Decision

`@motion5/plugins/runner` owns `attachRunners`, `Runner`, `RunnerStep`, `RunnerFailure`,
`AttachRunnersOptions`, `LatestSlot`, `createLatestSlot` and `describeRunnerFailure`. The application
attaches runners after engine construction using the same clock. Core owns no runner lifecycle.

Attachment snapshots the runner array and node ids, rejects duplicate or absent owners before
subscribing, and subscribes once. Each runner owns one node's overlay exclusively within its
attachment; the application must not assign that node to another attachment. Synchronous `step`
returns `hold`, `write` or `release`, read by an exhaustive switch. All steps read published engine
state before any queued runner writes land and must not synchronously write to the project.

One `project.values` recipe applies all queued commands per tick. Only `overrideValues` writes:
`release` clears the overlay, preserving the authored definition. Keys must already be authored
with the same static leaf kind (ADR-060). Identical writes still republish and recompute downstream;
choosing `hold` is the runner's responsibility. Both shipped clocks dispatch a listener snapshot
in subscription order: engine composition precedes runners, and new listeners wait one tick.

The live set owns detachment; a retirement queue owns once-only disposal after the batch closes.
A throwing step queues release. Missing nodes and refused writes detach only their runner while
other commands continue. A refused write attempts empty release in the same recipe; recovery
failure is reported too, without retrying a failed empty release.

Anything escaping `values()` is `project-unavailable`: stop, unsubscribe, retire every live runner,
attempt every disposer and report once. Its later disposer is a no-op. Ordinary disposal
unsubscribes, releases every remaining node still present in one batch and attempts every disposer
even if the releasing batch throws. Reversed project cleanup therefore rethrows that error once
at the call site after consistent cleanup; the next disposer call is silent.

Failures are reported after publication and cleanup in collection order. Every queued `onFailure`
is attempted; the first thrown value escapes only after all reports. Thrown `undefined` keeps its
identity. A disposal batch error takes precedence over later callback errors after all attempts.
`describeRunnerFailure` exhaustively owns wording, including disposal and project-level failures.

Recursive clock dispatch and disposal during a running tick are refused before changing attachment
state. A disposer called from `step`, runner cleanup or `onFailure` would otherwise create a
second batch during the tick or resurrect writes after stopping. Invoke lifecycle disposal after
dispatch returns; an already stopped attachment still has a silent disposer. This follows the
core's synchronous reentrancy discipline rather than silently deferring cleanup to another frame.

`LatestSlot<T>` retains only the latest offered result; `take` consumes it once. Async producers
offer completed work, then synchronous steps consume it on a later tick. Small frame-local models
can remain pure plugin factories; large or temporal models use this application-owned boundary.

## Alternatives rejected

- Stateful composition makes seek and rollback depend on hidden history.
- Runner `setValues` changes the authored definition instead of a revertible overlay.
- An engine-owned loop gives core ownership of application simulations and inference resources.
- A React hook as owner couples reusable runners to one UI framework.
- One batch per runner publishes intermediate state and duplicates downstream work.
- Aborting cleanup or reports on the first throw skips independent work and loses later failures.

## Consequences

No engine API or authored schema changes. The runner export is a support module, not a catalog
definition. A stopped attachment performs no further clock work.

## Evidence

`runner.test.ts` covers R1 to R12 and R14 to R16; `runner-clock.test.ts` covers R13 on both
shipped clocks. The red-only local seam yielded 15 assertion failures and two passing cases and
is deleted in the implementation. Supplemental pinned compiler, shim and handover transport
evidence is retained outside the repository. It does not replace required Node 24 Vitest CI;
Actions evidence remains a publication prerequisite.
