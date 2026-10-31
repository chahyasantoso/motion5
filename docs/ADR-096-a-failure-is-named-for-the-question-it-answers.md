# ADR-096: A failure is named for the question it answers, and the newest one is the one kept

**Status:** Accepted, 2026-09-18

## Context

Three findings about failure values: two from [#436](https://github.com/chahyasantoso/motion5/issues/436), one phase B of [#443](https://github.com/chahyasantoso/motion5/issues/443) owed as [#446](https://github.com/chahyasantoso/motion5/issues/446).

`packages/core/src/runtime/report.ts` read one `describeError` and declared another. `schema-refusals.ts` exports one rendering a thrown value as its own message; `report.ts` declared one flattening an `AggregateError` into its causes, recursively, so a boundary's context string does not replace every cause it collected. Two functions, one name, two questions about one subject, one import apart; nothing said which caller wanted which. ADR-094 refused harmonising them, correctly — every message in that slice byte-identical to the message it replaced — and recorded that the question owed its own issue.

`undeliverable` overwrote the trace's handover failure unconditionally. A sink that re-enters the runtime, causes a nested report whose own handover fails, then throws itself retains the nested failure first, outer second → `lastSinkError` named an older report's handover while `lastFlushError` named the newer report. That is #415's ordering defect reproduced in the slot #410 created, one field along; no case reached it: one covers a reentrant sink accepting the nested report, another a non-reentrant sink that throws, none a sink that does both.

`deferredScheduler` threw whichever error left last. A port running the callback inline, swallowing `INLINE_JOB_MESSAGE`, then throwing its own error left through the outer `catch` with the port's error; every other interleaving left with the refusal. No case named either value → what `schedule` owes its caller on that path undecided; a later slice tidying that `catch` would have moved it with nothing red.

## Decision

**A name states which question it answers.** `report.ts` declares `describeWithCauses`; its leaf case delegates to the imported `describeError`, which stays this folder's renderer of one thrown value's own message and gains a docblock saying exactly that. One expression renders a message, the qualified name belongs to the behaviour adding something, neither caller knows which of two answers it got. Alias `describeThrownValue` deleted with the ambiguity it papered over.

No message moves; the list of diagnostics whose bytes change is empty. Checked, not claimed: the leaf branch of `describeWithCauses` is the body of `describeError` → every rendered string is the string it was; equivalence is a case, not a sentence.

**An aggregate's boundary context stays in the rendered string.** #154 answered this for the clock consumer fanout, nothing re-asked since: the context names which boundary collected the causes, and a cause list with no boundary in front of it is the attribution loss the flattening exists to prevent. Dropped only when empty, as before.

**`error.cause` is not rendered.** Refused deliberately. It would move every diagnostic message whose error carries a cause — exactly the change this decision exists not to make by accident — and a cause is for whoever reads the error, not for a consumer branching on a rule id.

**The trace's handover failure names the newest report it retains.** `undeliverable` replaces the retained failure when the report whose handover failed is still the newest report the trace holds; answers the trace unchanged otherwise. The retained report is the ordering token → no counter: a nested failure belongs to a newer report by construction, an outer handover unwinding behind it is older news about an older report. `lastSinkError` means what its name says; the pair of answers describes one report, not two. ADR-091's retention ordering unchanged; it makes this decidable at all.

**One condition answers with one identity at the scheduler port.** A port that ran the callback inline is answered with the refusal whatever it throws afterwards; its own error travels as that refusal's `cause`. The contract violation is the fact outliving the call, because the latch refuses every later `schedule` on it; a caller anchoring on the refusal should not anchor conditionally. Nothing dropped — separates this from the alternative #436 refused: replacing every inner scheduler error with the refusal would discard an error the port supplied on the path where that error is the only thing wrong.

The refusal is a value, not a flag beside one. `inlineRefusal` is the `TypeError` this call's own callback threw; it answers both whether the callback ran inline and what it threw → the two cannot disagree; replaces the per-call `ranInline` flag ADR-089's amendment named. What leaves through `schedule` is the same object the callback threw, not a second one saying the same sentence.

## Alternatives rejected

**Renaming `describeError` as well, so both names are qualified.** Read and refused. It is the general case, four call sites; the rename widens this slice by a 76,092-byte test file edited by anchor to qualify a name already the plain one. Defect: neither name stated its question; one qualified name and one docblock answer it.

**One owner with both behaviours.** Refused for ADR-094's reason, still holding: `project-runtime.ts` wants the leaf and reads an aggregate itself → a single flattening owner would move a message it renders.

**Folding `engine.ts`'s local leaf renderer into this owner.** Out of scope, named here rather than left for a third pass. `packages/core/src/engine.ts` declares a third copy of the same two-line body; `engine.md` records it deliberately local so a shared formatter is not promoted into the contract module for two call sites. That reason is about the declaration surface, not the question → survives this decision without being strengthened: the rule here is one owner per question inside the folder that asks it; `Engine` asking the same question one layer out is duplication with a recorded reason, not an unowned one. If reopened, honest move is importing this folder's renderer, not widening the package entry; `engine.md`'s sentence would then stop being true. Raised by the quality pass over this change.

**Renaming `lastSinkError` to say outermost.** Refused. Name and #415's own reasoning imply latest; the outermost handover is the one fact in the pair a reader cannot line up with anything else the trace says.

**A generation counter or ordering token on the trace.** Refused as a second ordering mechanism beside the retained report, which already orders these two events. The finding offered it as one option of two.

**A second hook, or routing the sink failure back through `onFlushError`.** Refused, as ADR-091 already refused both. This decision does not reopen that.

**Aggregating the refusal and the port's error at the scheduler.** Refused. `schedule` throws a `TypeError` on every refusal path; a caller reading `instanceof` should not lose that because a port failed twice; `cause` carries the second fact without inventing a failure shape at this port.

## Consequences

No public surface, rule id or diagnostic message moves. `GraphRuntime` reads `describeWithCauses` at five call sites; `report.ts` reads `describeError` at two. `scheduler-failure` reports the refusal on the swallow-then-throw path, the message already reported on the swallow path → both interleavings read alike for a consumer.

`lastSinkError` can now decline to record a failure that happened — the trade, not a side effect: an outer handover failure dropped when a newer report's handover already failed. The slot holds one failure, the name says which, the alternative is a slot contradicting `lastFlushError`.

## Evidence

In `packages/core/test/unit/runtime/report.test.ts`: a reentrant sink whose nested report also fails, asserting the nested failure survives and its message names the nested report, beside the non-reentrant control and a direct `undeliverable` case asserting the trace answered unchanged. Red before this change. Beside them, rename equivalence cases: one aggregate rendered by both owners so the two questions are visibly different, the empty-aggregate case pinning the boundary context alone, a cause neither renders. Neither red nor green before this change — saying so beats calling them equivalence witnesses on both sides: they name `describeWithCauses`, so on the old tree they do not compile at all. The no-message-moves claim rests on the leaf branch being the old body reached by delegation; the cases pin it on this tree by comparing both owners answer for answer. A case cannot witness a rename from the side of the tree where the name does not exist. Raised by the quality pass over this change.

In `packages/core/test/contract/scheduler-deferral.test.ts`: a port-level case driving inline invocation, a swallowed refusal, then a distinct later throw, asserting thrown identity, carried `cause`, inert callback and latch; a runtime-level case asserting `scheduler-failure` reports the refusal rather than the port's message, the deferral claims no scheduled drain, seeds stay pending and publish on next flush. Both red before this change.
