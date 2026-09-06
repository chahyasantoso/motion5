# ADR-071: Attempt the accepted phase completely and preserve every post-commit failure

**Status:** Proposed in [PR #323](https://github.com/chahyasantoso/motion5/pull/323), 2026-09-06. [Issue #306](https://github.com/chahyasantoso/motion5/issues/306). Shipment is recorded only in SESSION-STATUS.md.

## Context

After graph acceptance and map adoption, ProjectRuntime ran bare settle callbacks. A throwing registration prevented mounting; a throwing staged commit prevented publication; a throwing disposal skipped Motion deregistration inside the same closure. The accepted graph and retained pair remained changed, with no inverse for the abandoned work. ADR-067 depended on this phase completing but deliberately left caller failure to issue #306.

The issue's implementation plan also claimed synchronous invalidation could not throw because GraphRuntime reports flush diagnostics. That claim is false on the merged tree: invalidate calls flush directly, snapshot construction calls injected resolvers, and PatchRegistry.closeBatch can rethrow a subscriber failure. Clock-driven and scheduled flushes have diagnostic-catching boundaries; this synchronous call does not. Putting publication in a bare finally would overwrite the original settlement error.

## Decision

After adoption, attempt each settle callback in order, then attempt one publication unless the runtime is disposed or the seed set is empty. Report only after those attempts. A single thrown value is rethrown by identity, including undefined or an AggregateError supplied by a host. Multiple failures are retained in an AggregateError in occurrence order, with the summary `Commit settlement failed.`. Host aggregates are not flattened or mutated.

ProjectRuntime.#apply constructs that order with `runSettleSteps([...commit.settle, () => this.#flush(commit.touched)])`. The final callback remains outside the derived settle data: #derive knows which host operations the pair costs, not when to publish. The collector can see publication failure without #apply growing another per-step catch or another exception sentinel.

The absence of an inverse is not an infallibility assertion. SchemaCommit.settle retains its callback-array shape; adding SchemaEffect.revert to an accepted phase would suggest rolling back something already committed. We neither roll it back nor retry failed host calls. An add that throws after acceptance does not return its handle; a still-live caller can inspect the committed node through runtime.track. The runtime guarantees attempts, not successful execution inside arbitrary caller code or recovery of resources a failing seam owns.

## Ownership and shared mechanism

`#derive` constructs steps. `#apply` owns acceptance, adoption and their ordering. `#flush` owns the existing empty-seed and disposal skips. `rollback.ts` owns the shared collect-and-report mechanism, with file-local collect and report functions and separately named rollback and settlement runners. No lifecycle state or injected port member is added. The new runner is internal, not added to a package entrypoint.

Rollback keeps its exact `Track replacement rollback failed.` summary and rejectAfterRollback keeps its original rejection precedence. Its inverses still run in apply order. Settlement shares the algorithm, not rollback semantics. This is DRY without giving one public caller a message parameter that selects which contract it is invoking.

The removal closure is split into residency cleanup, disposal and Motion deregistration in its existing order. Native instance deletion and graph eviction remain one residency step; disposal and deregistration are separate fallible seams. An eviction failure cannot skip either later seam, and a disposal failure cannot skip deregistration or later Motion destruction. The collector's guarantee is per callback, so separating those calls is required behavior, not cosmetic refactoring. Other callbacks already contain one call.

`#flush` and `#invalidateOne` stay separate: the former takes a seed list, skips disposal silently and returns void; the latter takes one node, reports disposal and returns a batch to a direct-write caller. Combining them would create a context-dependent contract rather than remove duplicate ownership.

## Disposal and scope

The whole accepted phase stays inside #boundary. A disposing hook may also throw; later settle steps still run against the live graph, publication skips, and the boundary drains the deferred release afterward. No new liveness guard is inserted between settle steps.

Issue #312 still owns a failure in that release: a throwing #teardown can replace the outcome selected here. This record does not claim end-to-end failure preservation through a separate broken release boundary. Issue #313 still owns failing seams on direct-write paths, which never reach #apply. Neither follow-up is absorbed into this slice.

## Alternatives rejected

Declaring caller hooks infallible enforces nothing. Stopping at the first exception abandons mounts and cleanup. Rolling back the accepted pair invents an inverse the commit protocol does not have. Catching inside each derived callback duplicates completion policy and still misses newly added callbacks.

A bare finally guarantees entry into publication but not preservation of the preceding error. Catching settlement as one aggregate and then wrapping it with a publication error would add an avoidable aggregate layer; a flat list of original per-callback failures preserves the real order while retaining any aggregate a host itself threw. Recording settlement failures only as diagnostics would answer success to a caller whose operation failed after acceptance.

## Evidence

The evidence was pushed before behavior. [Run 34014499081](https://github.com/chahyasantoso/motion5/actions/runs/34014499081) on `7494ee5` reached npm test after typecheck and format:check: 8 assertions failed and 970 tests passed across 186 files. All failures were in structural-commit-path.test.ts. The durable log is `logs/34014499081/failed-jobs.log` on ci-logs.

`RA-126` observes the missing mount and publication after registration failure. `RA-127` asks for two settlement failures followed by a real subscriber throw, preserving each by identity and retaining the host's nested aggregate. `RA-128` measures publication after a staged commit failure without reverting the accepted definition. `RA-129` loses deregistration and Motion destruction after disposal fails, and asserts no publication is invented for empty seeds. `RA-130` is the accepting direction, green before the change deliberately: exactly one batch, after registration and mounting.

The adjacent cases measure an injected snapshot resolver throw, a lone flush failure including undefined, the two real mounts that must precede deferred release, a diagnostic-bearing batch alongside a settlement failure, and undefined thrown by settlement followed by a later successful commit. The successful-path and lone-flush cases were green before the change; the other eight were red. No assertion is weakened for the implementation.

The existing effect rollback, reentrancy and disposal cases remain in the same rig. Final CI results belong to PR #323 rather than being predicted here.
