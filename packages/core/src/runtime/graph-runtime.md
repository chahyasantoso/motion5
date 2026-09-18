# packages/core/src/runtime/graph-runtime.ts

The private reasoning of `GraphRuntime`, one level-two heading per declaration the module keeps to itself, in declaration order. Read this before the source: it hands over the member list, so a source read that truncates after it is no longer silently dangerous.

What stays in the source is the surface a consumer reads and the sentence a statement needs. `GraphRuntimeOptions.interpolated` and the public verbs `flush`, `flushAtTick` and `dispose` keep their docblocks, because TypeScript carries them into the declaration file and into editor hover, so moving one would delete an API doc rather than relocate it. A comment explaining the next statement stays too, and a comment trailing a statement on the same line keeps its exemption. Provenance does not stay: a citation is member-level rationale, so every `ADR-nnn`, evidence case id, issue and pull request number this module reasons from is here rather than in a comment. docs/AI-EDIT-WORKFLOW.md owns that partition and scripts/read-budget-scan.mjs enforces it.

## #scheduler

Wrapped once in the constructor rather than guarded at every call site that reaches it. Issue #377, and see ADR-086.

## #publisherNodes

Cleared by `replaceGraph` for residency, not staleness, and the difference is worth stating because the line looks like the other one. Every closure a publisher node carries resolves the compiled map per call, so an entry that survives a rebuild is not stale; but this map is keyed by the graph node object and holds it strongly, so without the clear every node a rebuild replaced would be retained for the life of the runtime. A cache's residency is answered inside the layer that holds it, which is why it is one line in `replaceGraph` rather than an eviction hook every caller has to remember. See ADR-058.

## #pending

What a reentrant call deferred: its seeds and the frame number it carried, as one value.

A bare seed set held this until issue #380, so a deferred `flushAtTick` kept its work and lost the frame it was asked to reach. See ADR-084.

## #drainHandle

The scheduler's own handle on the drain this runtime booked, held as long as the booking is.

A booking is a claim about the scheduler, not about `#phase` alone, which is what issue #389 found: the handle was discarded, so a publication that consumed the drain left the job outstanding and the next deferral booked a second for one drain. See ADR-084 and ADR-038.

## #phase

This runtime's whole lifecycle, as one value.

`#disposed`, `#flushing` and `#scheduledDrain` held it until issue #376, and two of their eight combinations meant nothing. Every combination this one can hold is real, including a flushing runtime that already owes the scheduler a drain, which is what a reentrant deferral creates and what a `draining` phase beside `flushing` could not have expressed. `disposed` carries nothing, so a retired runtime cannot be mid-flush or hold a booking. See ADR-083.

Teardown is a phase of it rather than a flag beside it, so `dispose` can ask whether retiring has begun and `#report` can still ask whether it finished. Issue #408, and see ADR-090.

## #memo

The memoised publisher snapshot and the whole of the key it is answered by, as one value.

`#snapshot`, `#snapshotGraph` and `#snapshotMembers` held it until issue #376, with `-1` for cold, and `replaceGraph` cleared two of the three. A key that can be half-cleared is what this retires: the value and its key are assigned together or not at all. See ADR-058 and ADR-083.

`replaceGraph` clears it with `#publisherNodes`, and for the same reason rather than for correctness: it is keyed on the graph identity, so an entry from the replaced graph could never be read, but holding one would retain every node that clear exists to release. One assignment, and the key leaves with the value it belongs to: this used to clear two of the memo's three fields and leave the membership revision behind, which stayed harmless only because warmth also needed the value. See ADR-083.

## #trace

What this runtime knows about its own reporting, as one value, read by the boundary that owns the order its parts are filled in.

Two independent nullables held it, `#lastFlushError` and `#lastSinkError`, so reported and delivered, reported and refused, and never reported at all were facts a reader reconstructed by comparing two fields, and a delivery failure with no report behind it was writable. Retention was also an assignment from `reportDiagnostic`'s return value once, which put it after the handover, and issue #415 is what that cost: a sink that re-enters and causes a second report files the newer diagnostic from the nested call, and then the outer assignment overwrites it with the older one, so `lastFlushError` stopped naming the latest failure and lost precisely the newer one. The boundary retains before it hands over, and this is what it retains into. The ordering is not stated here because it is not this module's to state: report.ts owns the handover, so it owns the rule, and only the storage is here. See ADR-091.

The trace carries a handover failure across the next report a host accepts, which is why it has a fourth variant rather than the three issue #443 sketched. That answer exists because containing a throwing sink is not the same as erasing it, issue #410, and a trace naming the last report alone would erase it one report later. It is never delivered: the only sink available is the one that has just thrown, so a report about it would be a loop rather than a report, and a distinct hook was refused for the same reason, since a hook is a second sink and therefore a second thing that can throw.

## #retain

How the one trace slot is advanced, which is the whole of what the reporting boundary asks of this runtime.

A function rather than the two-slot record it replaces, and an updater rather than a setter, so the read, the decision and the write happen inside the boundary that owns their order. A sink reporting again from inside a delivery is what makes that difference observable, and it is the finding issue #415 is about.

## #publish

The mechanics both public verbs share: answer a reentrant call, record the frame the request carries if it carries one, publish its seeds.

`flush` and `flushAtTick` duplicated this around one difference. Splitting them was right and stays split, because a frame is consumed by one of the two only and issue #374 is what one verb with an optional frame cost. What a request retires is the duplication rather than the split: a frame is still impossible to select by omission, since it is a variant of the request rather than a missing argument. See ADR-082.

Liveness is not asked here and neither is tick validity. Each public verb asserts liveness on entry, and the verb that has a frame validates it before this is reached, so a frame this runtime could never reach is refused rather than queued.

## #advanceFrame

Records the frame a request carries, and records nothing for the request that carries none.

The one place the two requests are told apart, and it ends at a `never` sink, so a third kind of publication would owe a decision here instead of silently reaching the frame-free arm. `#advanceTick` remains the one write to `#lastTick`.

## #deferIfFlushing

Answers the deferred batch for a flush requested inside one, or `undefined` when none is open.

The one owner of the reentrancy answer, for both public verbs. Queueing the seeds and scheduling the drain is the answer rather than a step before it, which is why this hands back the batch and not a boolean: two callers that had to ask and then act could act differently.

The request carries whatever frame there is to carry, so the optional `tick` parameter is gone. Optional meant that one of two callers has no frame rather than that a caller may leave it out, which is a distinction a parameter cannot state and a variant can. The deferred payload still has one owner rather than a seed set here and a frame number beside it. Issue #380, and see ADR-088.

The batch itself is `batchFor`'s, in report.ts, which is now the one builder of the four-field shape three modules used to build. Which of two futures the work has is still a question only `#scheduleDrain` can answer, so it is still asked here rather than there. Issue #383.

## #advanceTick

Records `tick` as the frame number this runtime has reached, having re-asked that it may.

The one write to `#lastTick`. Validity is `#assertTick`'s question, so a rejected tick leaves the runtime on the frame it was already on.

## #assertTick

Refuses a frame number this runtime cannot reach, and answers nothing when it can.

The one owner of tick validity, asked twice on purpose: once by `flushAtTick` before it decides whether to defer, so an impossible frame is refused rather than queued, and once by the one write above, which cannot be reached without it. Issue #380.

## #flushSeeds

Publishes for `seeds` plus whatever a deferred drain left pending, and answers that batch.

The publication mechanics both public verbs share, and nothing else: no liveness answer, no reentrancy answer and no clock transition, because each of those has an owner above. Its one precondition is asserted rather than stated, because an assertion is not a second owner of a decision, it is the check that the decision held: it must not be called in the `flushing` phase, which `#deferIfFlushing` answers for both callers. Any failure between taking the pending payload and publishing re-queues the seeds this call was carrying and rethrows, so the work is deferred rather than dropped. Issue #378 is that the boundary used to begin after the snapshot was derived, and derivation runs injected caller code.

That precondition is asked before anything moves, which is the whole of issue #382. A caller reaching it during a publication would otherwise take the pending payload, release the booking and move `#sequence` before failing deeper down under a lower-level message: mutated state, and the failure misattributed. Unreachable today, and one branch is what that costs.

The seeds are taken and a frame this verb cannot reach is not: `flush` cannot publish one, so the drain the `finally` books replays it. Issue #392, and see ADR-088.

Snapshot derivation sits inside the boundary, which is the whole of issue #378: deriving a snapshot builds publisher nodes on a cold memo, and building one calls the injected `compose` and `interpolated` suppliers, so caller code throws there. `#sequence` moves inside with it and nothing observable moves with that. `beginFlush` does not, because the reentrancy window has to stay exactly where it is.

The requeue in the `catch` carries no frame, because a frame the publication reached was consumed before the call. And it re-queues onto a live runtime only: derivation runs caller code, which may dispose this runtime before it throws. Issue #401, and ADR-088 owns the rest.

In the `finally`, `endFlush` is total and disposal is terminal, so a subscriber that disposed the runtime mid-flush leaves it disposed there rather than idle, and the booking after it is refused for the same reason. Both of those were hand-cleared boolean writes before ADR-083.

## #snapshotFor

The frozen snapshot every flush runs over, derived once and reused until something in it moved.

`nodes`, `nodeById` and `dependants` are all pure functions of the `GraphIR` identity. Publisher nodes are cached per graph node, `finalizeGraph` derives reverse topology once per graph, and every closure a publisher node carries resolves the compiled map when the publisher calls it, so an entry that survives a recompile is not stale. A second tick over a graph that did not move therefore has nothing left to compute, and steady-state ticking allocates nothing for graph shape. Optimisation 7c of issue #223.

Membership is the one part that moves without the graph moving, so it is keyed rather than aliased: the snapshot carries a copy of the member set and `#membersRevision` is what the memo is keyed on. Handing over the live set inside a frozen object would be a cache whose answer changes without its key changing, and it would let a memo keyed on the graph alone look correct.

Both halves of that key now travel with the snapshot as one value, so warmth is one question asked once rather than a three-part conjunction over fields that could be cleared apart. See ADR-058 and ADR-083.

## #publisherNode

One publisher node per graph node, composed once and reused for as long as the graph holds it.

`#compose` and the optional `#interpolated` are resolved here rather than per flush, and both of the closures they return read the compiled map when the publisher calls them, so nothing cached here can outlive a recompile. See ADR-031 and ADR-051.

## #addMember

The two ways membership moves, and the one owner of the revision the snapshot is keyed on.

Three call sites mutated the set directly before this, and a cache each of them has to remember to invalidate is the shape ADR-058 refuses, so they state the change and the revision follows from it. A no-op add or remove moves nothing: a key that moved when the answer did not would rebuild the snapshot for free. `#dropMember` is the other half and answers the same way.

## #scheduleDrain

Books one follow-up drain with the scheduler, or answers that there is nothing to book.

`bookingDrain` is the whole question, asked once. It hands back the phase that carries the booking, or `undefined` for the two cases that used to be two more terms in a conjunction: a disposed runtime has no follow-up to run, and a phase already carrying a booking would book a second job for one drain, which is the coalescing `scheduler-reentrancy` measures. A transition rather than a boolean, for the reason `#deferIfFlushing` hands back a batch: two callers that had to ask and then act could act differently. See ADR-083.

It answers whether the scheduler is now holding a job for this runtime, because the diagnostic a deferral hands back has to say so and this is the only member that knows. Issue #383.

The handle is that answer rather than a fourth branch: the port holds a job for this runtime exactly when it is set, so a booking already held answers true where `bookingDrain` declined, a disposed runtime answers false, and a `schedule` that threw answers false because the boundary below released it. Issue #383.

## #releaseBooking

Releases the drain booking and cancels the job it was a claim about.

The one owner of "this runtime no longer owes a follow-up", and the whole of issue #389: the booking was a claim about `#phase` while the handle `schedule` answered with was thrown away, so a publication that consumed the drain left the job outstanding and the next deferral booked a second for one drain.

The phase is lowered before the port is touched, so a `cancel` that throws cannot leave this runtime believing it still owes a drain. Cancelling a job already running is the no-op the `Cancel` contract allows, which is what `#drainScheduled` does to the booking it consumes. See ADR-084 and ADR-038.

`dispose` calls it before the phase goes terminal, because a retired runtime should not leave the scheduler holding a job it will only refuse, and `unbookDrain` lowers the booking in place so a runtime that is retiring stays retiring. See ADR-084 and ADR-090.

## #drainScheduled

Runs the booked drain: releases the booking, then publishes whatever was deferred.

The order is the one the boolean pair had, and it is load-bearing in both directions. Releasing first is what lets the flush below book its own follow-up when a subscriber defers again; asking about disposal after is what keeps a job the scheduler accepted before `dispose` from publishing over a retired registry. A public verb rather than `#flushSeeds` for the reason ADR-082 gives: nothing guarantees a scheduler cannot run this while a flush is in flight, and the deferral fallback that protects it lives in the public verb, which is also what carries a still-pending frame forward into the next deferral. Which of the two verbs runs is decided by whether the deferral carried a frame, never by this member's convenience.

The replay goes through the verb that owns clock transitions, so the frame a reentrant call arrived with is recorded by the publication that finally runs. It cannot have been overtaken: the only writer of `#lastTick` is a publication that also takes this payload. Issue #380.

## #onTick

Two boundaries, one subscription. Advancing the clock consumers and flushing the graph fail for unrelated reasons, so they are reported under unrelated rule ids and neither can be diagnosed as the other. See ADR-039.

A tick can still arrive while teardown is running, because `unsubscribe` runs after the port is touched, so this reads `isRetiring` rather than `isDisposed`. Issue #408, and see ADR-090.

## #advanceConsumers

Advances the clock consumers for `event` inside their own error boundary.

The fanout stays with the single `onClockTick` owner, and so does the rule that one throwing consumer does not stop the consumers behind it. This boundary only decides how that owner's failure is labelled, which is why there is still exactly one clock subscription.

## #flushTick

Flushes the graph for `event` inside its own error boundary.

The flush runs whether or not a consumer threw. A boundary that also cancelled the flush would not be a separate boundary: one Motion's driver would drop the frame for every node in the project, which is the fanout rule applied one step further out. Disposal from inside a consumer is the one thing that does stop it, because there is no longer a runtime to flush and `flush` would only refuse with a failure this tick did not cause.

## #report

Records one diagnostic whatever the phase, and hands it to the host only while there is still a host to hand it to.

`tick` defaults to the last flushed tick, which is what a scheduled drain or a rejected clock regression is about. The two tick boundaries pass the tick they are handling instead: a consumer failure happens before `flush` advances `#lastTick`, so the default would file it under the previous frame and undo the attribution this exists for.

Building a diagnostic, retaining it and handing it to the host belong to report.ts, which owns that boundary for all five callers. ADR-088 owns the handover: issues #400 and #393.

Retention and delivery are two questions and the phase answers only the second, which is issue #409. One guard used to answer both by returning early, so a flush failure a scheduled drain discovered after caller code retired the runtime was not withheld from the host, it was discarded: `#lastFlushError` was never written either, so the evidence that the work failed was gone rather than unpublished. Recording what happened is observation rather than action, and a runtime that can no longer publish can still hold the reason it stopped. So the phase selects the sink, and a terminal runtime hands a host nothing while still answering whoever asks. Whether delivery after disposal is wanted is a separate question, and it is left undecided here rather than inherited from a guard that was answering something else. See ADR-091.

The selection itself is `reportSink`'s, in graph-runtime-state.ts, because it is a read of that union and the module that owns a union owns the switch over it. It answers on finished retirement rather than on retirement having begun, which is the distinction issue #408 turns on: a runtime discovering that its port refuses to cancel is still the object that knows that, so only a runtime that has finished retiring withholds. A ternary here read that discriminant from outside every switch that names the others, so a phase added later inherited delivery from whichever side of it that phase fell on. See ADR-090 and ADR-092.
