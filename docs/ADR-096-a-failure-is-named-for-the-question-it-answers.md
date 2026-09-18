# ADR-096: A failure is named for the question it answers, and the newest one is the one kept

**Status:** Accepted, 2026-09-18

## Context

Three findings about failure values: two from [#436](https://github.com/chahyasantoso/motion5/issues/436), and the one phase B of [#443](https://github.com/chahyasantoso/motion5/issues/443) owed as [#446](https://github.com/chahyasantoso/motion5/issues/446).

`packages/core/src/runtime/report.ts` read one `describeError` and declared another. `schema-refusals.ts` exports one that renders a thrown value as its own message; `report.ts` declared one that flattens an `AggregateError` into its causes, recursively, so a boundary's context string does not replace every cause it collected. Two functions with one name answered two questions about one subject, one import apart, and nothing said which caller wanted which. ADR-094 refused harmonising them, correctly, because every message in that slice was byte-identical to the message it replaced, and recorded that the question owed its own issue.

`undeliverable` overwrote the trace's handover failure unconditionally. A sink that re-enters the runtime, causes a nested report whose own handover fails, and then throws itself retains the nested failure first and the outer one second, so `lastSinkError` named an older report's handover while `lastFlushError` named the newer report. That is #415's ordering defect reproduced in the slot #410 created, one field along, and no case reached it: one covers a reentrant sink that accepts the nested report, another a non-reentrant sink that throws, and none a sink that does both.

`deferredScheduler` threw whichever error left last. A port that runs the callback inline, swallows `INLINE_JOB_MESSAGE` and then throws its own error left through the outer `catch` with the port's error, while every other interleaving left with the refusal. No case named either value, so what `schedule` owes its caller on that path was undecided, and a later slice tidying that `catch` would have moved it with nothing going red.

## Decision

**A name states which question it answers.** `report.ts` declares `describeWithCauses`, and its leaf case delegates to the imported `describeError`, which stays this folder's renderer of one thrown value's own message and gains a docblock saying exactly that. One expression renders a message, the qualified name belongs to the behaviour that adds something, and neither caller has to know which of two answers it got. The alias `describeThrownValue` is deleted with the ambiguity it was papering over.

No message moves, and the list of diagnostics whose bytes change is empty. That is checked rather than claimed: the leaf branch of `describeWithCauses` is the body of `describeError`, so every rendered string is the string it was, and the equivalence is a case rather than a sentence.

**An aggregate's boundary context stays in the rendered string.** #154 answered this for the clock consumer fanout and nothing has re-asked it since: the context names which boundary collected the causes, and a cause list with no boundary in front of it is the attribution loss the flattening exists to prevent. It is dropped only when it is empty, as before.

**`error.cause` is not rendered.** Refused deliberately. It would move every diagnostic message whose error carries a cause, which is exactly the change this decision exists not to make by accident, and a cause is for whoever reads the error rather than for a consumer branching on a rule id.

**The trace's handover failure names the newest report it retains.** `undeliverable` replaces the retained failure when the report whose handover failed is still the newest report the trace holds, and answers the trace unchanged when it is not. The retained report is the ordering token, so no counter is introduced: a nested failure belongs to a newer report by construction, and an outer handover unwinding behind it is older news about an older report. `lastSinkError` therefore means what its name says, and the pair of answers describes one report rather than two. ADR-091's retention ordering is unchanged and is what makes this decidable at all.

**One condition answers with one identity at the scheduler port.** A port that ran the callback inline is answered with the refusal whatever it throws afterwards, and its own error travels as that refusal's `cause`. The contract violation is the fact that outlives the call, because the latch refuses every later `schedule` on it, and a caller that anchors on the refusal should not have to anchor on it conditionally. Nothing is dropped, which is what separates this from the alternative #436 refused: replacing every inner scheduler error with the refusal would discard an error the port supplied on the path where that error is the only thing that went wrong.

The refusal is a value rather than a flag beside one. `inlineRefusal` is the `TypeError` this call's own callback threw, and it answers both whether the callback ran inline and what it threw, so the two cannot disagree; it replaces the per-call `ranInline` flag ADR-089's amendment named. What leaves through `schedule` is the same object the callback threw rather than a second one saying the same sentence.

## Alternatives rejected

**Renaming `describeError` as well, so both names are qualified.** Read and refused. It is the general case and it has four call sites, so the rename would widen this slice by a 76,092-byte test file edited by anchor to qualify a name that is already the plain one. The defect was that neither name stated its question; one qualified name and one docblock answer it.

**One owner with both behaviours.** Refused for the reason ADR-094 gave, which still holds: `project-runtime.ts` wants the leaf and reads an aggregate itself, so a single flattening owner would move a message it renders.

**Renaming `lastSinkError` to say outermost.** Refused. The name and #415's own reasoning both imply latest, and the outermost handover is the one fact in the pair a reader cannot line up with anything else the trace says.

**A generation counter or ordering token on the trace.** Refused as a second ordering mechanism beside the retained report, which already orders these two events. The finding offered it as one option of two.

**A second hook, or routing the sink failure back through `onFlushError`.** Refused, as ADR-091 already refused both. This decision does not reopen that.

**Aggregating the refusal and the port's error at the scheduler.** Refused. `schedule` throws a `TypeError` on every refusal path and a caller reading `instanceof` should not lose that because a port failed twice, and `cause` carries the second fact without inventing a failure shape at this port.

## Consequences

No public surface, no rule id and no diagnostic message moves. `GraphRuntime` reads `describeWithCauses` at five call sites and `report.ts` reads `describeError` at two. `scheduler-failure` reports the refusal on the swallow-then-throw path, which is the message it already reported on the swallow path, so the two interleavings read alike for a consumer.

`lastSinkError` can now decline to record a failure that happened, and that is the trade rather than a side effect: an outer handover failure is dropped when a newer report's handover already failed. The slot holds one failure, the name says which one, and the alternative is a slot that contradicts `lastFlushError`.

## Evidence

In `packages/core/test/unit/runtime/report.test.ts`: a reentrant sink whose nested report also fails, asserting that the nested failure survives and that its message names the nested report, beside the non-reentrant control and a direct `undeliverable` case asserting the trace is answered unchanged. Red before this change. Beside them the equivalence cases for the rename, including one aggregate rendered by both owners so the two questions are visibly different, the empty-aggregate case pinning the boundary context alone, and a cause that neither renders.

In `packages/core/test/contract/scheduler-deferral.test.ts`: a port-level case driving inline invocation, a swallowed refusal and then a distinct later throw, asserting the thrown identity, the carried `cause`, the inert callback and the latch; and a runtime-level case asserting that `scheduler-failure` reports the refusal rather than the port's message, that the deferral claims no scheduled drain, and that the seeds stay pending and publish on the next flush. Both red before this change.
