# ADR-098: A patch carries only the payload its status owns

- Status: accepted as a decision, with slice 1 landed and the rest still intent. The retention question this record deliberately left open is answered in the Decision below; every other slice is intent until it merges, on documentation rule 2 of [README.md](./README.md).
- Date: 2026-09-18
- Issue: [#450](https://github.com/chahyasantoso/motion5/issues/450), deferred from [#443](https://github.com/chahyasantoso/motion5/issues/443) section 2.3.

## Context

`Patch` in `packages/core/src/contract/v5.ts` declares seven required fields for four statuses. A `blocked` patch carries `values`, `sourceProgress` and `sourceRevisions` that mean nothing, and a `ready` patch carries a `diagnostics` array that is empty by construction. The status is the discriminant of a union that was written as a product, which is the shape ADR-094 closed everywhere else in `runtime/` and left standing on the observation wire.

What that costs is not decoration. `PatchRegistry.publish` decides by hand which fields survive, and reading it at `1cf86fbb3f9c5fb8b8c9619e8daef570f73f1a64` found the carry-forward to be asymmetric in a way nothing states and nothing tests:

```text
readyValues    = input.values ?? previous?.values ?? {}
readyProgress  = input.values === undefined && input.status !== 'ready'
                   ? previous?.sourceProgress ?? input.sourceProgress
                   : input.sourceProgress
readyRevisions = input.values === undefined && input.status !== 'ready'
                   ? previous?.sourceRevisions ?? input.sourceRevisions ?? {}
                   : input.sourceRevisions ?? {}
```

`values` carries forward from the previous patch whenever the caller omits it, at every status. `sourceProgress` and `sourceRevisions` carry forward only when the caller omits values and the status is not ready. So a `blocked` patch published without values does not merely hold stale values as a formality: it republishes the last good pose, the last progress and the last source revisions, and a subscriber reading `patch.values` on a blocked patch is reading a real answer that the wire has been giving it for as long as the field existed.

That makes the issue's acceptance claim wrong. It says the change is no semantic change, only type refinement. Deleting `values` from the blocked variant changes what a blocked node publishes, and any consumer rendering the last good pose while a node is blocked loses it. This record exists mostly to say that out loud before a slice ships on the issue's premise.

Two more readers depend on the product shape. `samePatch` compares all five payload fields unconditionally and is what suppresses a republication, so it decides revision numbers: once a blocked patch stops carrying values, two consecutive blocked patches that differed only in their carried-forward values become equal, the second is suppressed, and the revision sequence a subscriber observes moves. That is observable through `revision` alone. And `#notifyTerminal` builds the terminal patch with `values: {}`, `sourceProgress: 0`, `sourceRevisions: {}` and `diagnostics: []`, every one of which the destroyed variant deletes.

## Decision

`Patch` becomes a union discriminated by `status`, with `nodeId` and `revision` common and each variant owning only its own payload: `ready` owns `values`, `sourceProgress` and `sourceRevisions`; `blocked` and `error` own `diagnostics`; `destroyed` owns nothing. `PatchStatus` stays exported and stays the discriminant.

`blocked` and `error` are two variants rather than one parameterised by a flag, even though their payloads match today, because they are two conditions and this project does not merge two conditions into one variant with a field. A reader that genuinely treats them alike writes two arms that return the same thing, which is a decision on the record rather than an absence.

`PublishInput` is discriminated the same way in the same slice. Eliminating the carry-forward without closing the input just moves the hand-written decision from the registry into every caller of it, which is the second-owner shape the guardrails refuse.

Every read of the union names every variant and ends at the shared `never` sink `domain/exhaustive` already owns, on ADR-092. That reaches `samePatch`, which becomes an equality per variant rather than one comparison of five fields, and it reaches the React store and the DOM binding, which must narrow to `ready` before reading `values`.

The carried-forward pose is not silently deleted. A consumer that needs the last good pose while a node is blocked asks the registry for the last `ready` patch, because retention is the registry's question and not a field on a patch that is about something else. That resolves to a retained ready patch rather than an accepted loss, and slice 1 is where it landed: `PatchRegistry` keeps the last accepted `ready` patch per node beside the current one and answers it through `lastReady(nodeId)`, so a consumer that renders the last good pose while a node is blocked keeps reading a real answer once the blocked variant stops owning `values`. Accepting the loss was refused because the behaviour is load-bearing rather than incidental: the carry-forward in `publish` has republished the last pose, the last progress and the last source revisions on every blocked patch for as long as those fields existed, and a consumer cannot be asked to rebuild from a wire that stopped carrying it. Retention belongs to the registry for the same reason a payload belongs to a status, which is one owner per question. What `lastReady` answers is the frozen patch that was published rather than a copy, so identity still tells a reader whether anything moved; a republication the registry suppressed is not a publication and does not move it; and unmount, eviction and disposal drop it, because a node with no retained patch has no last pose either. Slice 1 moves nothing on the observation wire, and `patch-last-ready.test.ts` carries one case that says so and is green on both sides deliberately, so the later slice that deletes the carry-forward re-reads that case rather than adjusting it to stay green.

## Alternatives considered

Keeping the fields optional and documenting which status means which. Rejected: that is the current state with prose added, and a field a reader ignores is the thing the guardrails remove and then refuse.

One variant for `blocked` and `error` with a flag distinguishing them. Rejected: a field carrying which of two conditions applies is a discriminant spelled worse, and it gives a reader no exhaustiveness at all.

Keeping `values` on the blocked variant so the change really is type-only. Rejected as the thing worth deciding rather than avoiding: it keeps a field whose meaning depends on a status it is not attached to, and it leaves the carry-forward in `publish` that the issue exists to delete.

A version bump of `contract/v5` in the same slice. Rejected for sequencing rather than on merit: the compatibility question is real and it is decided once the shape is agreed, not while it is being proposed.

## Consequences

This is the largest blast radius in the [#443](https://github.com/chahyasantoso/motion5/issues/443) proposal and it is a public surface change. `Patch`, `PatchStatus`, `PatchBatch` and `PatchListener` are re-exported through `runtime/patch-registry.ts`, and the exact package entry surface is verified in the owning pull request rather than asserted here. An external consumer reading `patch.values` without narrowing stops compiling, which is the point, and a consumer relying on a blocked patch carrying the last pose changes behaviour, which is not.

Revision numbering can move for non-ready patches, for the deduplication reason above. Any case asserting an exact revision after a block is evidence about the old carry-forward and is re-read rather than adjusted to pass.

`PatchBatch.diagnostics` is untouched. Batch diagnostics are the flush's own and are not a patch payload.

## Follow-up

The work is cut so no slice exceeds the sizing rule in [PR-WORKFLOW.md](./PR-WORKFLOW.md). The first slice decided the retention question with a failing-first case and has landed, which is what makes every later slice mechanical, and the next one owes the complete reader census before any type moves. Then the contract union and `PublishInput`, then `publish`, `samePatch` and `#notifyTerminal` in the registry, then the publisher and the runtime, then the React store and the DOM binding, then the suite. The owning pull request carries the plan, the measured semantic file count, and the exact tested SHA.
