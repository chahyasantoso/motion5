# ADR-139: Stateful work is driven by runners

**Status:** Accepted, 2026-10-05

## Context

Plugin composition repeats on seek, replacement and rollback. Hidden temporal state → those operations
depend on execution history (ADR-045, ADR-064 and ADR-111). A simulation, temporal filter or inference
model has a lifecycle pure graph composition cannot own.

## Decision

`@motion5/plugins/runner` owns `attachRunners`, `Runner`, `RunnerStep`, `RunnerFailure`,
`AttachRunnersOptions`, `LatestSlot`, `createLatestSlot` and `describeRunnerFailure`. Application
attaches runners after engine construction using same clock. Core owns no runner lifecycle.

Attachment snapshots runner array and node ids, rejects duplicate or absent owners before subscribing,
subscribes once. Each runner owns one node's overlay exclusively within its attachment; application must
not assign that node to another attachment. Synchronous `step` returns `hold`, `write` or `release`, read
by exhaustive switch. All steps read published engine state before any queued runner writes land; must
not synchronously write to project.

One `project.values` recipe applies all queued commands per tick. Only `overrideValues` writes:
`release` clears overlay, preserving authored definition. Keys must already be authored with same static
leaf kind (ADR-060). Identical writes still republish and recompute downstream; choosing `hold` is
runner's responsibility. Both shipped clocks dispatch listener snapshot in subscription order: engine
composition precedes runners, new listeners wait one tick.

Live set owns detachment; retirement queue owns once-only disposal after batch closes. Throwing step
queues release. Missing nodes and refused writes detach only their runner while other commands continue.
Refused write attempts empty release in same recipe; recovery failure reported too, without retrying a
failed empty release.

Anything escaping `values()` is `project-unavailable`: stop, unsubscribe, retire every live runner,
attempt every disposer, report once. Any failure of batch call stops attachment, transient or not; no
safe signal separates a disposed project from a passing refusal → never retries. Its later disposer is a
no-op. Ordinary disposal unsubscribes, releases every remaining node still present in one batch and
attempts every disposer even if releasing batch throws. Reversed project cleanup therefore rethrows that
error once at call site after consistent cleanup; next disposer call silent.

Failures reported after publication and cleanup in collection order. Every queued `onFailure` attempted;
first thrown value escapes only after all reports. Thrown `undefined` keeps identity. A disposal batch
error takes precedence over later callback errors after all attempts. `describeRunnerFailure`
exhaustively owns wording, including disposal and project-level failures.

Recursive clock dispatch and disposal during a running tick refused before changing attachment state. A
disposer called from `step`, runner cleanup or `onFailure` would otherwise create a second batch during
the tick or resurrect writes after stopping. Invoke lifecycle disposal after dispatch returns; an
already stopped attachment still has a silent disposer. Follows core's synchronous reentrancy discipline
rather than silently deferring cleanup to another frame.

`LatestSlot<T>` retains only latest offered result; `take` consumes once. `undefined` is empty answer →
`T extends {} | null` keeps it out of offerable values. Async producers offer completed work, then
synchronous steps consume on a later tick. Small frame-local models can remain pure plugin factories;
large or temporal models use this application-owned boundary.

## Alternatives rejected

- Stateful composition makes seek and rollback depend on hidden history.
- Runner `setValues` changes authored definition instead of a revertible overlay.
- Engine-owned loop gives core ownership of application simulations and inference resources.
- React hook as owner couples reusable runners to one UI framework.
- One batch per runner publishes intermediate state and duplicates downstream work.
- Aborting cleanup or reports on first throw skips independent work, loses later failures.

## Consequences

No engine API or authored schema changes. Runner export = support module, not catalog definition. A
stopped attachment performs no further clock work.

## Evidence

`runner.test.ts` covers R1 to R12 and R14 to R16; `runner-clock.test.ts` covers R13 on both shipped
clocks. Red-only local seam yielded 15 assertion failures and two passing cases, deleted in the
implementation. Supplemental pinned compiler, shim and handover transport evidence retained outside the
repository. Does not replace required Node 24 Vitest CI; Actions evidence remains a publication
prerequisite.
