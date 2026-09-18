# ADR-094: One closed value per runtime decision, and one owner for a report

**Status:** Accepted, 2026-09-18

## Context

[Issue #443](https://github.com/chahyasantoso/motion5/issues/443) is one instruction read over two folders: a decision this runtime makes is a value, and every read of one names every variant. Phase A took the project runtime in [#444](https://github.com/chahyasantoso/motion5/pull/444). Phase B, steps 9 through 13, takes the rest of `packages/core/src/runtime` in [#445](https://github.com/chahyasantoso/motion5/pull/445). This record is what that slice decided rather than what it changed; the slice narrative, the byte sizes and the runs belong to the pull request.

What the folder encoded instead of a value, in the four shapes it used. Parallel collections: `GraphPublisher.flush` answered what one flush decided about one node from three Sets and a Map, in a precedence written out by hand at the top of the loop as `failed.has(id) || blocked.has(id) || pending.has(id)`. Independent booleans: `PatchRegistry` held `#batchOpen`, `#notifying` and `#disposed`, about four of whose eight combinations mean anything, beside four fields that are meaningful only while a batch is open. Independent nullables: `GraphRuntime` held `#lastFlushError` and `#lastSinkError`, so reported and delivered, reported and refused, and never reported at all were facts a reader reconstructed by comparing two fields, and a delivery failure with no report behind it was writable. Error classes: classification was an `instanceof` chain over two publisher-local classes, and three of the seven failures a publication can raise had no name at all.

Each of those is the defect ADR-083 and ADR-092 already answered one module over, and the reason it earns a record rather than a diff is that all four were readable. Nothing was broken at the reviewed head. What each of them cost is the next variant: a fifth outcome is a fifth collection and a fourth term in a disjunction nobody re-reads, and [#408](https://github.com/chahyasantoso/motion5/issues/408) is the measured precedent, where adding one phase needed a guard hand-written at five sites with no gate naming any of them.

## Decision

**One closed value per decision, minted, and every read is a switch that ends at `unreachable`.** `publisher-outcome.ts` states `NodeOutcome`, `SourceValues` and `PublishFailure`. `publisher-reach.ts` states the two graph-shape walks that never belonged to the publisher. `registry-phase.ts` states `RegistryPhase`, with the tick, the seeds and both buffers riding its `collecting` variant. `publish-request.ts` states `PublishRequest`. `report.ts` states `StepPhase`, `BatchReason` and `ReportTrace`. The brand device is `graph-runtime-state.ts`'s and the sink is `domain/exhaustive.ts`'s, so this adds no second idiom and no second `never`.

**One owner for a report, and three modules become one.** `rollback.ts`, `diagnostic-report.ts` and `value-batch.ts` are deleted. `report.ts` owns what they held: `runSteps` over a `StepPhase` in place of two runners differing by a summary string, `batchFor` over a `BatchReason` in place of three builders of one four-field batch, and `ReportTrace` in place of two nullable slots. `collect` and `report` move to `domain/completion.ts`, because ordered attempts with preserved failures is a domain rule two tiers now share rather than the settlement path's private mechanism.

**Notification stays a field of every registry phase rather than a variant beside them, and that is the one distinction this record declines to close.** Delivering the terminal patch of an evicted node raises a notification out of band, from a graph mutation rather than from a flush, and it restores whatever it interrupted rather than assuming it interrupted nothing. So a notification inside an open batch is a state this registry already tolerates, and a `notifying` variant beside `collecting` would make that pair unrepresentable and lose the batch it was carrying. This is `DrainBooking`'s argument in ADR-084 applied one module over.

**One behaviour changes, and it is the only one.** `PatchRegistry.closeBatch` kept the first subscriber failure and discarded the rest. It now collects every failure and reports once, so a single failure is still rethrown by identity and two are one `AggregateError` in occurrence order under `Patch batch notification failed.` ADR-071 states that rule for every phase that has no inverse, and a notification is one: nothing there can be retried, and a failure no caller ever sees is a failure nobody fixes. Delivery reaches it through `domain/completion`'s collector rather than through a fourth hand-rolled copy of the same loop.

Everything else is an equivalence slice, and the boundary is stated rather than assumed: every message, rule id, diagnostic `path`, patch field and public answer is byte-identical, including the three publication failures that still publish as `composition-failure`. Naming those three is a change to published diagnostics, so it owes its own commit. What this slice buys is that they are named in the type, so that commit has one place to edit and a compiler that will not let it forget one.

## What this refines

Three accepted records name a mechanism that moved. Each carries a **Refined by ADR-094** marker on the paragraph that named it, rather than being rewritten, per the superseding convention in [PR-WORKFLOW.md](./PR-WORKFLOW.md). ADR-071's ownership paragraph named `rollback.ts` as the owner of the shared collect-and-report mechanism. ADR-079's small-decisions paragraph named both value-batch factories. ADR-091's decision one named `DiagnosticRetention`, and its consequences named `diagnostic-report.ts` as the owner of the handover and of `diagnostic-sink-failure`. In all three the decision stands and only its spelling or its module moved, which is why none of them is superseded and each keeps its original sentence in place.

## Alternatives rejected

**A `notifying` variant in `RegistryPhase`.** Refused above: it makes a reachable pair unrepresentable, and the reachable pair is the one an eviction produces.

**Giving the three `composition-failure` failures their own rule ids here.** Refused. A rule id is what a consumer branches on, so that is a published-diagnostics change and it does not belong in a slice whose whole claim is that nothing observable moved.

**Harmonising the two `describeError` owners.** `schema-refusals.ts` renders a thrown value and `report.ts` flattens an aggregate, and after this slice they sit one import apart in one file. Refused here, because every message in `report.ts` is byte-identical to the one it replaces and harmonising them would move one. It owes its own issue rather than a marker, and the import comment in `report.ts` says so at the place a reader meets both. **Superseded in part by [ADR-096](./ADR-096-a-failure-is-named-for-the-question-it-answers.md), 2026-09-18.** That issue is [#446](https://github.com/chahyasantoso/motion5/issues/446) and it is decided: `report.ts` declares `describeWithCauses`, `schema-refusals.ts` keeps `describeError` as the folder's renderer of one thrown value's own message, and the leaf case of the first delegates to the second. This paragraph's reason is satisfied rather than overridden, because no message moves.

**Making the publisher's two walks methods of `GraphPublisher`.** Refused. `reachable` and `closeUpstream` read no registry, no composer and no `this`; they are questions about graph shape, and keeping them structural in their parameters is what keeps `publisher-reach.ts` free of the class it was cut out of.

## Consequences

Three files are deleted and five are added, and no export of `packages/core` moves: every new module is internal to `runtime/`, so the emitted declaration closure is unchanged. `GraphPublisher.flush` becomes five named members. `PatchRegistry.beginBatch` opens a batch in one assignment, and `closeBatch` closes one in one assignment, where five fields were set and cleared by hand between them. `closeBatch` then makes a second phase assignment in its `finally`, and that one is not the batch: it lowers the notification the first assignment raised, which is a separate act precisely because notification is a field of every phase rather than a variant beside them. `dispose` stops emptying four fields by hand. `GraphRuntime.flush` and `flushAtTick` share one `#publish` while a frame stays impossible to select by omission, and `#deferIfFlushing`'s optional `tick` is gone.

`stryker.config.json` names `report.ts`, `registry-phase.ts` and `publish-request.ts`, and `diagnostic-report.ts` leaves that list with the module it named, because a path naming a file the tree no longer has generates no mutants and reports nothing about it. No Stryker run is claimed here or there, and the modules both halves of #443 created are otherwise still absent from that list, which belongs to [issue #419](https://github.com/chahyasantoso/motion5/issues/419).

`Diagnostics.record` is constant time. That is a performance claim rather than a closedness one, and it is in this slice because it is the same folder and the same read.

## Evidence

`diagnostics-ring.test.ts`, `registry-phase.test.ts`, `report.test.ts` and `publisher-outcome.test.ts` are new. Two cases are red before the change, and they are the two the retired shapes could not express: the eviction counter in the ring case, and the two-subscriber report in the registry case. Everything else is an equivalence or closedness case and says so in the file.

The ring case's counter is read from the spy inside its own guarded region and asserted after restoration, from a number. `mockRestore` resets a mock's call record as well as the prototype, so the assertion this record's slice first wrote, placed after the restore, read zero calls whatever the source did. That is the green case that is evidence of nothing `docs/GUARDRAILS.md` refuses, and it landed in the one case whose whole claim is that a step is gone, which is why the correction belongs to this slice rather than to a follow-up.

No local run is claimed: this is an API-only contribution with no checkout, so no `npm`, no `prettier` and no Vitest run happened on this side. Read the published commit and the required contexts on that exact SHA.
