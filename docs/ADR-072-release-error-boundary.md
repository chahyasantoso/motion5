# ADR-072: Complete release and report failures by who asked

**Status:** Proposed in [PR #324](https://github.com/chahyasantoso/motion5/pull/324), 2026-09-06. [Issue #312](https://github.com/chahyasantoso/motion5/issues/312). Shipment is recorded only in SESSION-STATUS.md.

## Context

`ProjectRuntime.#teardown` stopped at the first throwing graph detach, graph disposal, or composition release. Because `dispose()` had already set its one-shot flag and cleared the pending marker, the remaining cleanup never ran and could not be retried. When the release was drained by `#boundary`, its failure replaced the commit or write outcome that was already being unwound.

## Decision

`#teardown` remains the release owner, but it constructs an ordered cleanup list and collects every failure with the shared collector from ADR-071. It keeps the existing order: detach every instance, clear runtime maps, dispose the graph, then dispose the composition. The release therefore cannot remain partial, and no retry flag or tri-state is needed.

Collected failures are recorded on the diagnostics surface as `project-release-failed`. A direct `dispose()` records first and then throws the original failure by identity, or an AggregateError in release order. A deferred boundary drain records and returns, preserving the body outcome because only the two call sites know whether somebody asked for release or an unrelated operation is unwinding.

This is not rollback. The graph and composition are being released, not restored, and failed cleanup is not retried. The collector guarantees attempts and ordered reporting, not successful arbitrary host code. No public type, port, package export, or lifecycle state changes.

## Ownership

`#teardown` constructs and answers cleanup failures. `#recordRelease` owns the diagnostic channel. `dispose()` owns direct-call throwing; `#boundary` owns deferred draining without replacing the body result. `rollback.ts` owns shared collection while preserving rollback and settlement reporters. No second release owner exists.

## Alternatives rejected

A try in `dispose()` would duplicate exactly-once ownership. Letting the boundary throw would replace an unrelated operation's outcome. Attaching to `rejectAfterRollback` fails when the operation succeeded and has no rejection. Recording without throwing on direct disposal would answer a failed release as success. Retrying would guard a partial state the collector makes unreachable.

## Evidence

Evidence preceded behavior. RA-140 through RA-144 in `structural-commit-path.test.ts` cover direct release, commit failure precedence, successful commit precedence, multiple detach failures, and the accepting direction. The existing RA-114 through RA-117 disposal cases remain intact. Final CI results belong in PR #324, not here.

## Scope

The new `project-release-failed` rule is additive to diagnostics only. Issue #313 remains separate because direct-write seams never reach `#apply`.
