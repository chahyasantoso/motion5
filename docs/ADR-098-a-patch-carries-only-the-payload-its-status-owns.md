# ADR-098: A patch carries only the payload its status owns

- Status: accepted on both halves it was asked to decide, the union's shape and what happens to the carried-forward pose, and merged. [#453](https://github.com/chahyasantoso/motion5/pull/453) squashed the union and slice 1's retention answer onto `main` as `d700dbf988611165eb9ef2709b73854a68baf83c`, so this record describes shipped code rather than intent and documentation rule 2 of [README.md](./README.md) no longer holds it open. This line still names which half was decided when, because the first quality pass on the owning pull request found the earlier wording calling the whole record accepted while the Decision still deferred retention to a later slice.
- Date: 2026-09-18
- Issue: [#450](https://github.com/chahyasantoso/motion5/issues/450), deferred from [#443](https://github.com/chahyasantoso/motion5/issues/443) section 2.3.

## Context

`Patch` in `packages/core/src/contract/v5.ts` declares seven required fields for four statuses. `blocked` patch carries `values`, `sourceProgress`, `sourceRevisions` meaning nothing; `ready` patch carries `diagnostics` array its one caller always passes empty. Status is discriminant of union written as product — shape ADR-094 closed everywhere else in `runtime/`, left standing on observation wire.

Second clause narrower than shipped record; narrowing is correction, not decision moved. It said array empty **by construction**; nothing constructs it so: `ReadyPublishInput.diagnostics` optional, `candidateOf`'s ready arm reads `input.diagnostics ?? []` → non-empty array caller supplies on ready publication preserved onto patch, not dropped. True claim about one caller, not contract — why sentence names it: `GraphPublisher`'s ready publication passes `diagnostics: []`, so member empty in production while type permits otherwise. Distinction matters to reader deciding what to trust: stronger claim invites reading ready patch's diagnostics as dead weight; it is real member with one habitual caller. Corrected in place, not marked superseded: marker convention `docs/PR-WORKFLOW.md` owns covers decision that stopped being true; this was Context sentence overstating code from day written. Making original sentence true — array empty at `ready` — refusal this record does not introduce: would owe failing case of own; refusal record does owe is reason on refusal input, not absence at `ready`. Found by independent quality pass over finished change, not while writing this.

Cost not decoration. `PatchRegistry.publish` decides by hand which fields survive; reading it at `1cf86fbb3f9c5fb8b8c9619e8daef570f73f1a64` found carry-forward asymmetric in way nothing states, nothing tests:

```text
readyValues    = input.values ?? previous?.values ?? {}
readyProgress  = input.values === undefined && input.status !== 'ready'
                   ? previous?.sourceProgress ?? input.sourceProgress
                   : input.sourceProgress
readyRevisions = input.values === undefined && input.status !== 'ready'
                   ? previous?.sourceRevisions ?? input.sourceRevisions ?? {}
                   : input.sourceRevisions ?? {}
```

`values` carries forward from previous patch whenever caller omits it, every status. `sourceProgress` and `sourceRevisions` carry forward only when caller omits values and status not ready. So `blocked` patch published without values does not merely hold stale values as formality: republishes last good pose, last progress, last source revisions; subscriber reading `patch.values` on blocked patch reads real answer wire gave as long as field existed.

That makes issue's acceptance claim wrong: "no semantic change, only type refinement". Deleting `values` from blocked variant changes what blocked node publishes; consumer rendering last good pose while node blocked loses it. Record exists mostly to say that out loud before slice ships on issue's premise.

Two more readers depend on product shape. `samePatch` compares all five payload fields unconditionally, suppresses republication → decides revision numbers; deleting payload from non-ready variants shrinks what it compares there to status and diagnostics. Record claimed consequence for revision sequence, withdraws it. Independent pass: scenario as written unreachable — two consecutive blocked publications both omitting values carry same previous values by construction, already equal and suppressed; if intervening publication moved values, not consecutive. No concrete case where observed revision sequence moves found → none claimed; guess dressed as finding is what guardrails have a record corrected from run for. And `#notifyTerminal` builds terminal patch with `values: {}`, `sourceProgress: 0`, `sourceRevisions: {}` and `diagnostics: []`, every one destroyed variant deletes.

## Decision

`Patch` becomes union discriminated by `status`, `nodeId` and `revision` common, each variant owning only its payload: `ready` owns `values`, `sourceProgress` and `sourceRevisions`; `blocked` and `error` own `diagnostics`; `destroyed` owns nothing. `PatchStatus` stays exported, stays discriminant.

`blocked` and `error` two variants, not one parameterised by flag, even though payloads match today: two conditions, and project does not merge two conditions into one variant with field. Reader genuinely treating them alike writes two arms returning same thing — decision on record, not absence.

`PublishInput` discriminated same way in same slice. Eliminating carry-forward without closing input moves hand-written decision from registry into every caller — second-owner shape guardrails refuse. Mirrors read side without matching member for member: two interfaces, not four; one requiring `values` at `ready`, one covering `blocked` and `error` together — reader narrows on `status` to learn what it may read, caller already knows which refusal publishing. Asymmetry buys two refusals at no cost. `destroyed` stops being publishable from outside → `#notifyTerminal` only producer of terminal patch, not merely intended one; refusal carries no `sourceProgress`, which publisher had been passing as placeholder zero carry-forward then overwrote.

Every read accounts for every variant it can receive; branching read ends at shared `never` sink `packages/core/src/lang/exhaustive.ts` owns, on ADR-092. Reader whose callers cannot hand it every variant satisfies at declaration, not predicate: `LivePatch` is union minus terminal variant; typing parameter with it states once who may produce destroyed patch rather than spending narrowing at each reader that cannot receive one. Reaches `samePatch`, becomes equality per variant rather than one comparison of five fields; reaches React store and DOM binding, must narrow to `ready` before reading `values`.

Carried-forward pose not silently deleted. Consumer needing last good pose while node blocked asks registry for last `ready` patch: retention is registry's question, not field on patch about something else. Resolves to retained ready patch, not accepted loss; slice 1 where landed: `PatchRegistry` keeps last accepted `ready` patch per node beside current, answers through `lastReady(nodeId)`, so consumer rendering last good pose while node blocked keeps reading real answer once blocked variant stops owning `values`. Accepting loss refused: behaviour load-bearing, not incidental — carry-forward in `publish` republished last pose, last progress, last source revisions on every blocked patch as long as fields existed; consumer cannot be asked to rebuild from wire that stopped carrying it. Retention belongs to registry for same reason payload belongs to status: one owner per question. `lastReady` answers frozen patch published, not copy → identity still tells reader whether anything moved; republication registry suppressed is not publication, does not move it; unmount, eviction, disposal drop it, because node with no retained patch has no last pose either. Slice 1 moves nothing on observation wire; `patch-last-ready.test.ts` carries one case saying so, green both sides deliberately, so later slice deleting carry-forward re-reads that case rather than adjusting it to stay green.

## Alternatives considered

Keeping fields optional, documenting which status means which. Rejected: current state with prose added; field reader ignores is what guardrails remove then refuse.

One variant for `blocked` and `error` with flag distinguishing them. Rejected: field carrying which of two conditions applies is discriminant spelled worse, gives reader no exhaustiveness.

Keeping `values` on blocked variant so change really is type-only. Rejected as thing worth deciding rather than avoiding: keeps field whose meaning depends on status it is not attached to, leaves carry-forward in `publish` that issue exists to delete.

Version bump of `contract/v5` in same slice. Rejected for sequencing, not merit: compatibility question real, decided once shape agreed, not while proposed.

## Consequences

Largest blast radius in [#443](https://github.com/chahyasantoso/motion5/issues/443) proposal, public surface change. `Patch`, `PatchStatus`, `PatchBatch` and `PatchListener` re-exported through `runtime/patch-registry.ts`; exact package entry surface verified in owning pull request, not asserted here. External consumer reading `patch.values` without narrowing stops compiling — the point; consumer relying on blocked patch carrying last pose changes behaviour — not.

Revision numbering not claimed to move, on withdrawal above. Case asserting exact revision after block still re-read, not adjusted to pass: evidence about old carry-forward either way.

`PatchBatch.diagnostics` untouched. Batch diagnostics flush's own, not patch payload.

One behaviour change beyond deletion, found converting source, not predicted here. Source publishing only `blocked` or `error`, never `ready`, used to answer `{}` through carry-forward, which `hasValue` reads as published → readers composed against empty input record with no error and no diagnostic. Answers absent now → `firstPendingEdge` classifies those readers pending, they publish blocked patch naming source. Correct answer, not regression: empty record is not pose, `graph/references.ts` owns what pending means, misconfiguration with no symptom is what guardrails refuse.

Retained pose reachable inside runtime only. `lastReady` on `PatchRegistry`; `PatchSource` and `ProjectHandle` expose `get` and `subscribeNode`, so `runtime/publisher-outcome.ts` reads it, no consumer can. `adapters/dom.ts` and `useDomPatch` unaffected either way: both ignore non-ready patch, leave target at last pose written. Consumer rendering from `values` itself retains own last `ready` patch until forwarding registry's answer onto consumer surface decided; forwarding owed, not done, because widens public surface this work does not claim.

## Follow-up

First slice decided retention question with failing-first case, landed. Second complete reader census, corrected this section rather than following it: four slices planned after cannot each be green, because deleting member with no alias stops every unguarded reader compiling in same `typecheck` run → union and all readers one vertical slice, roughly sixty-file blast radius. Census is measurement saying so, lives on owning pull request, not restated here. What is left is that one slice; version bump deferred still owed, against entry surface census measured, not unknown one. Owning pull request carries plan, measured semantic file count, exact tested SHA.
