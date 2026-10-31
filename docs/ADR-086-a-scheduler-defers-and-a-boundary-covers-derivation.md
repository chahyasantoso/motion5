# ADR-086: A Scheduler defers, a publication boundary covers derivation, and a diagnostic names what happened

**Status:** Accepted, 2026-09-16

**Context.** Three findings from quality pass over [#375](https://github.com/chahyasantoso/motion5/pull/375), read at `1af7580557b0ad65a44c4216a0fde7170f33e203`. One slice: one path read from three places — what happens to deferred work between publication taking it and publishing it. [Issue #377](https://github.com/chahyasantoso/motion5/issues/377) = port handing it back too early. [Issue #378](https://github.com/chahyasantoso/motion5/issues/378) = boundary not covering whole handover. [Issue #383](https://github.com/chahyasantoso/motion5/issues/383) = what runtime tells host it did with it. None introduced by #375; splitting `flush` from `flushAtTick`, giving publication mechanics one owner made all three legible.

**Decision one. The `Scheduler` port states that a job must not run before `schedule` returns, and one decorator enforces it.** Port declared `schedule(job, options?): Cancel`, said nothing about when job runs → scheduler running job inline satisfied contract, broke runtime: `#scheduleDrain` books from inside publication that deferred; job lowers booking as first act; `flush` from inside same publication defers, books again. Unbounded recursion → stack overflow, not slow drain. Booking obvious guard, cannot be: lowered before call it was passed to returned.

#377 offers two answers; takes first, issue's reason: runtime depends on deferral in more than one place → dependency belongs in port's own contract, not reentrancy latch caller maintains. ADR-038 already decided pass boundary for `createMicrotaskScheduler`: reentrant schedule lands next pass, one host enqueue per pass; says `GraphRuntime.#scheduleDrain` assumes that boundary. Missing: assumption recorded in ADR about one adapter, nowhere in interface future adapter reads.

**The enforcement is a decorator, not a branch in each consumer.** `deferredScheduler` wraps injected port once, in `GraphRuntime` constructor; runtime below written against deferring port. Rule re-asked every call site = as many owners as callers (ADR-076 defect); #377's second alternative — not lowering booking until drain published — exactly that shape: one member reentrancy-safe, contract unstated for next scheduling member.

**A violation refuses the job rather than running it, and leaves through `schedule`.** Running it = recursion; refusing = fix, not symptom. Refusal `TypeError` out of `schedule` → lands in boundary `#scheduleDrain` already has for refusing port: booking released, one `scheduler-failure` diagnostic, deferred seeds stay in `#pending` for next publication. Degradation not invented: exactly what runtime with no scheduler does; `publisher-reentrancy` already tests it → contract-breaking port falls back onto supported path, not new one.

Recursion bounded at one nested call. Wrapper refuses every later `schedule` after seeing job run inline → port swallowing first refusal cannot buy second inline pass; hostile port still ends runtime's turn.

**Why not `assertScheduler`.** Shape check; cannot see when job runs. Two answer different halves of same contract: one refuses object not a scheduler, other scheduler not deferring. `deferredScheduler` not exported from `packages/core/src/index.ts` → public surface unchanged; host composing own port reaches guard on handing port to runtime.

**Decision two. The publication boundary begins before derivation, because derivation runs caller code.** `#flushSeeds` took pending payload, cleared, released booking, then derived snapshot — all before `try` whose `catch` puts work back. `#snapshotFor` not bookkeeping: cold memo builds publisher nodes; `#publisherNode` calls constructor-supplied `#compose` + `#interpolated`. Injected caller code ran in one window where drained seeds existed nowhere; throwing supplier dropped them.

Fix = issue's first recommendation; both notes about what must not move honoured. `#sequence += 1` moves inside boundary; nothing observable with it. `beginFlush` not earlier: reentrancy window decided; widening lets subscriber-triggered call be deferred by publication not begun. `endFlush` total, terminal-safe → derivation failure leaves phase where it was, not walking idle runtime elsewhere.

Requeue carries no frame publication reached; half unchanged: `flushAtTick` records frame before `#flushSeeds` called → frame failing call already reached consumed by it; re-queuing claims frame twice. Frame publication never reached kept, not dropped: `retaining` leaves later deferred frame pending, `requeuing` preserves it → direct `flush` failing over frame it could not have published re-queues seeds beside that frame. Issue #417: sentence used to state only first half, reads as rule `retaining` breaks. See ADR-084 and ADR-088. Precondition assertion ADR-084 added stays outside boundary, deliberately: precondition failure must not re-queue; seeds it would restore belong to caller that should never have reached member.

**Why not a `#drainInto` owner.** #378 sketches one, pairing drain with restore. Real option; refused as machinery: pair already two statements in one member; boundary makes them pair. Named owner states same invariant less directly, adds member to file spending remaining read budget.

**Decision three. The deferral diagnostic names a publication, and says which future the work has.** Message said flush "was queued as one follow-up invalidation for the scheduler". `invalidate` operation ADR-082 retired from this tier → reader traced diagnostic to absent member; `invalidate` now belongs to `ProjectRuntime` one layer up. "for the scheduler" presumed one; runtime receiving this diagnostic most often in existing evidence is `publisher-reentrancy`'s, with no scheduler at all.

#383 asks two cases distinguished where they diverge; only `#scheduleDrain` knows → answers boolean, `deferredBatch` takes it. Answer `#drainHandle !== undefined`, not fourth branch: port holds job for runtime exactly when field set → booking already held answers true where `bookingDrain` declined for coalescing; disposed runtime, absent port answer false; `schedule` that threw answers false (boundary released handle). One field, read once, no new state.

Rule id `reentrant-flush-deferred` unmoved — always accurate — nor severity or path. Message change, declared: no rule id, diagnostic id or public surface retires.

**Failing-first evidence.** `packages/core/test/contract/scheduler-deferral.test.ts` new. Runtime case red before change by exhausting stack; pins bound, reported rule, refused work still published by next flush. Three unit cases: deferring port passing through with own handle; inline job refused without running; port swallowing refusal gets no second pass.

`packages/core/test/unit/runtime/publication-boundary.test.ts` new, evidence #378 asks: `compose` supplier throws once; asserts drained seeds still name themselves after throw, follow-up publishes both. Colds memo via `replaceGraph` first: warm memo never reaches supplier.

`packages/core/test/unit/runtime/deferred-flush-diagnostic.test.ts` new, reads both messages. No-scheduler case red before change for honest reason: message named scheduler runtime does not have. Third case: neither message names retired verb; rule id, severity, path unchanged both sides.

`scheduler-reentrancy` existing cases oracle for two things unmoved: one booking still one job; port throwing from `schedule` still retried by next deferral, still reported under `scheduler-failure`.

**Consequences.** No public surface: `deferredScheduler` + `INLINE_JOB_MESSAGE` added to `ports/scheduler.ts`, neither named by `packages/core/src/index.ts` → exports map, declaration closure unchanged. `#scheduleDrain` answers `boolean` where `void`; private. `deferredBatch` third parameter; module-local.

**Three behaviours move, all narrow.** Inline-running scheduler refused + reported, not recursing; no shipped adapter does. Snapshot-derivation failure re-queues drained seeds, not drops, rethrows exactly as before. Deferral diagnostic carries one of two new messages, not one wrong one. No batch, patch, sequence or frame number moves in any.

**Where the reasoning lives.** `graph-runtime.ts` grows from 27,585 bytes, stays under 30,000 obliging sister document; margin stated, not assumed: #376 asked for number, ADR-084 spent part. Reasoning that would push further lives here; that is this record's job.
