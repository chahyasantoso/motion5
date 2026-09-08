# ADR-072: GSAP source snapshots and producer lifetime

## Status

Proposed in PR #353 for issue #352. This decision describes the contract, not merge or browser-acceptance status. Current project state belongs to SESSION-STATUS.md; exact revision evidence belongs to the PR.

## Context and owner

Real ScrollTrigger can invoke onUpdate synchronously during create. A listener installed before producer acquisition can therefore run before subscribe returns, before the trigger port is wired, or before application handles exist. Refresh may change measured progress without user intent, while holding an old consumer must not make a new consumer read an obsolete snapshot. Subscription identity and producer lifetime are separate concerns.

GSAP owns geometry and browser observation. createGsapScrollSource owns the producer generation, per-subscription initialization, refresh suppression and qualifying events. createScrollTriggerPort owns finite validation and normalization. Motion owns scheduled progress and publication. Applications own domain intent and resource composition. This preserves [ADR-030](./ADR-030-scroll-trigger-source-injection.md), [ADR-037](./ADR-037-trigger-progress-range-ownership.md), [ADR-038](./ADR-038-production-scheduler-semantics.md) and [ADR-066](./ADR-066-load-and-mount-publish-nothing.md).

## Event and timing contract

Each subscribe call creates an independently cancellable subscription, even when callbacks are identical. The first subscription acquires one producer. Creation callbacks do not publish. Acquisition eagerly reads scroll() and progress to expose structural producer failures synchronously; a successful subscription then queues a fresh measured snapshot, not a cached creation value. The microtask is source initialization, not a second animation clock or a replacement Motion scheduler.

A qualifying onUpdate is a GSAP progress-change callback with changed measured physical position outside refresh. It supersedes the pending initial snapshot of each notified subscription. ScrollTrigger can suppress onUpdate while clipped progress remains 0 or 1: physical movement outside the range is not promised as an event. Applications apply pending intent on the next qualifying update, not on every wheel or pointer movement. No raw scroll listener or duplicate range arithmetic is added to broaden this contract silently.

Refresh updates the position baseline without notifying existing subscriptions. A later subscription reads fresh progress, including when refresh occurs before its queued initial delivery. Existing consumers retain their last delivered state until a qualifying update. Load and mount remain non-publishing; initialization enters through the actual source, port and driver.

## Delivery, reentrancy and errors

Fan-out snapshots subscription identities and rechecks membership immediately before delivery. Removal by an earlier listener suppresses that delivery. Subscriptions added during fan-out wait for their own snapshot unless a subsequent qualifying event reaches them. A reentrant qualifying update supersedes the remainder of the older fan-out, preventing a listener from seeing newer progress followed by older progress.

Listener return is not a general acknowledgement, cross-listener transaction, or rollback boundary. A throwing listener is not replayed. Remaining live subscriptions are attempted, then a single thrown value retains its identity or multiple thrown values become one AggregateError in occurrence order without flattening host errors. Deferred failures surface from the source microtask; synchronous producer callback failures surface at that callback's caller.

Producer creation and measurement-read failures invalidate the generation and release any acquired instance. One failure is preserved; if cleanup also fails, the aggregate contains the original failure first. Retirement clears ownership before kill, so kill-time callbacks and callbacks retained across remount are inert. The last unsubscribe kills once, duplicate unsubscribe is harmless, and a failed generation permits a fresh acquisition.

## Public compatibility and deletions

GsapScrollTriggerInstanceLike requires readonly progress, scroll() and kill(). Real GSAP supplies all three; custom shims must provide live measurements and realistic callback semantics. No new export-map entry, runtime dependency, plugin key, authored schema, manual fallback or compatibility flag is introduced. The old unguarded callback-set fan-out is replaced rather than retained as an alternative.

## Consumer ordering and evidence

The walking application loads and mounts core nodes before subscribing its UI/threshold observer. The driver queues Motion progress; structural arm edits and the eventual scheduled pose are separate operations, not an atomic source/UI/publication transaction. The hysteresis remains insertion at progress at least 0.5 and removal below 0.45. Refresh alone must not cross those application thresholds. Cleanup attempts source observation removal, project disposal and clock disposal even if another release fails.

The lifecycle unit regressions cover cancellation, stale callbacks, refresh freshness, fan-out removal and initialization rollback. Producer seam tests cover duplicate callback identity, listener failure and reentrant delivery. trigger-scroll integration cases traverse Engine, the real trigger factory and port, controlled GSAP measurements and the scheduler without importing the IK feature. Controlled producers do not prove browser event semantics.

[The browser runbook](./SCROLL-BROWSER-SMOKE.md) separates actual browser observations from deterministic tests. Chromium evidence for the shared source and walking application does not certify PR #351, history restoration, other engines or manual interaction review.
