# ADR-064: One recipe is one transaction, and a commit derives its hooks from what it commits

**Status:** Accepted, 2026-08-31. Slice D of [issue #223](https://github.com/chahyasantoso/motion5/issues/223).

## Context

The issue names a verb the project has no vocabulary for: build a project's structure up incrementally from nothing, driven by runtime code, with each step individually correct and the whole thing committed once. Every structural entry point costs a whole transaction today, so `n` authored ops across `m` tracks cost `n` candidate builds, `n` `GraphBinding.replace` calls, `n` `ObservationState.commit` calls and `n` flushes, and there is no way to abort a half-built structure at all.

The plan named slice D as `edit(recipe)` on top of A1's plan-as-data, with abort semantics free because only `#commit` registers a handle's token. That half is exactly right. What reading it found is that A1's five plan builders each assemble their own hook list, and those lists do not compose.

The case is the plan's own worked example. A recipe that adds a track and then edits it accumulates an `addMotionTrack` in the settle steps, from the add, and a `replaceMotionTrack` in the effects, from the edit. Effects run before the graph is asked and settle steps run after it accepted, so the Motion would be asked to replace a track it has not been told about yet. Add-then-remove is the same shape one level worse: a mount settles for a node the committed graph does not contain.

## Decision

A commit's hooks are derived from what it commits rather than accumulated per op. `SchemaPlan` narrows to the two maps the graph is asked to accept, and one derivation reads the retained pair against the committed pair and answers with the effects, the settle steps and the seeds. Every entry point becomes a map builder; none of them names a hook.

`ProjectRuntime` is the one transaction owner and gains one piece of state: the open transaction, which is a pending pair of maps. While it is open, every structural read resolves against that pair through one accessor rather than against the retained one, so a two-step edit sees its own first step and a handle issued inside the recipe answers `live` truthfully on both sides of an abort. `#commit` merges into the open transaction when one is open and applies when none is; nothing else about it changes, so `replaceGraph` and `rejectAfterRollback` keep the one call site each A1 gave them and every hook now has one too.

`SchemaTransaction` is declared in `contract/`, for the ADR-056 reason the declaration-surface gate enforces, and it is a projection of the runtime's own structural members rather than a second authoring implementation. What it buys is the narrowing that a recipe is for: `mount`, `seek`, `subscribe` and `dispose` are not reachable through it, because none of them is a structural change and none of them can be undone by a recipe that throws. `ProjectHandle` gains `edit`, and the entry exports the type, on the parameter half of the declaration-surface rule: a member the entry exposes is unusable if its argument type cannot be imported.

Two refusals travel with it, both `TypeError`.

`schema-transaction-nested` refuses a recipe opened inside a recipe. Joining the open one silently would mean the inner `edit` returns before anything it asked for has committed, so a helper's cost and its guarantees would depend on whether something above it had opened a transaction. That is the invisible-context shape that cut `setMotion`, cut `setTrack` and kept `setKeyframe` separate from `setKeyframeGroup`.

`schema-transaction-immediate` refuses a tier 0 or a tier 2 edit from inside a recipe, by verb name. Neither is a structural commit: tier 0 reaches the layer that owns the created trigger and the clock consumer, and tier 2 ends at its own `invalidate`. Both therefore apply immediately and would survive an abort.

A recipe that staged nothing commits nothing, answered by identity on the pair rather than by a dirty flag: an op that was a no-op hands the map it was given straight back, so the pair a recipe ends on is the pair it opened with.

## Alternatives rejected

**Shipping the derivation as its own equivalence slice.** The guardrail says a refactor which only exists to unblock a later slice ships alone with its own equivalence evidence, and this one does not, for a measurement rather than a preference: before a recipe exists, every commit carries exactly one change, so a derived hook list and a per-entry-point one are indistinguishable through the public surface. A slice shipped alone would have had no evidence of its own to write, only "the suite is still green", and a green case is only evidence of what it would fail without. `RA-65` is the first case in the project's history that can tell the two apart, and it cannot exist without `edit`.

**Deferring tier 0 and tier 2 into the settle steps instead of refusing them.** Read and refused, because a settle step cannot refuse: it would move `setTrigger`'s failure to after the graph committed and after the retained definition moved, which is the opposite of the contract `RA-35` pins. One condition has one failure contract, so the verb is refused by name inside a recipe rather than given a second, weaker one outside it.

**Queueing the ops and replaying them at commit.** An op log is a second representation of the same answer, and every entry point already builds a whole candidate pair from what it reads. Merging is therefore adopting, which is why the open transaction holds a pair rather than a list, and why there is no compensation path to keep in agreement with the forward one.

**Narrowing `SchemaTransaction` by splitting `TrackHandle`.** The handles a recipe is handed are the ordinary ones, and their tier 0 and tier 2 members refuse by name while a recipe is open. `TrackHandle` is one interface across both tiers, and splitting it is a change of its own with its own break; what a caller may reach is stated by the transaction interface and what it may reach through a handle is refused at the verb.

## Consequences

`n` authored ops across `m` tracks cost one candidate build, one `GraphBinding.replace`, one `ObservationState.commit`, one side-effect ordering with one rollback, and one flush. A throw inside the recipe commits nothing, reaches no hook, and issues no live handle, and it travels verbatim.

The recompile predicate ADR-062 added is asked from the derivation rather than from `#replaceTrack`, which moves it from once per op to once per committed replacement. For every caller outside a recipe that is exactly where it was: before any effect is applied and before anything retained has moved, so a candidate the registry refuses still costs no teardown and reads the same message. Inside a recipe the refusal arrives at the commit rather than at the op.

An add followed by a remove inside one recipe now costs nothing at all, because the node is absent from both pairs and the derivation has nothing to say about it. That is a capability rather than an optimisation: it is the case a per-entry-point hook list could not express without mounting a node the committed graph does not contain.

The public surface grows by one member and one type and nothing else moves: no handle grows a member, no existing verb changes shape, and `SchemaPlan` is module-private both before and after.

## Evidence

`RA-62` through `RA-68` in `packages/core/test/unit/runtime/schema-transaction.test.ts`, pushed before the source, so the two runs are cited by id rather than shared with it.

- `RA-62` five ops over three tracks and one motion cost one build and one flush, and all five land.
- `RA-63` a throw commits nothing: no hook, no build, no flush, the same `GraphIR` by identity, the untouched definition by identity, and the handle issued inside the recipe answers `live` false.
- `RA-64` a read inside the recipe resolves against the staged plan, so a two-step edit sees its own first step.
- `RA-65` a track added and then edited in one recipe is compiled once with the definition the recipe ends on and registered with its Motion once, with no `replaceMotionTrack` and no staging at all. This is the derivation case.
- `RA-66` a recipe whose ops are all no-ops returns the recipe's answer and commits nothing.
- `RA-67` a nested recipe is refused by name and the surface is usable afterwards.
- `RA-68` a tier 0 and a tier 2 edit are refused by name from inside a recipe, with the accepting direction asserted in the same rig.

Every case failed on an assertion in the red run rather than on a call that could not run: `editing()` asserts the seam is a function before it is used, on the precedent `RA-16` and `RA-27` set. Seven cases and seven expected assertion failures, which is what a capability slice should turn red. The red run archived at `logs/33393621794/` on `ci-logs` reports exactly that: `typecheck` and `format:check` passed first, then 7 failed and 845 passed, with the other five checks green. The red and green run ids live in the pull request body.

`RA-1` through `RA-7` in `structural-commit-path.test.ts` are the equivalence evidence for the derivation, green on both sides of it, and `U-5` through `U-8` in `track-staging.test.ts` are the equivalence evidence for the replacement ordering it now derives. Neither file is restated here.

## Follow-up

`docs/guide/api-reference.md` names no `edit(recipe)` and no `SchemaTransaction`, and `docs/guide/errors-and-diagnostics.md` enumerates neither `schema-transaction-nested` nor `schema-transaction-immediate`. Both join the guide debt `docs/SESSION-STATUS.md` already tracks.

## Amendment, 2026-09-02: the narrowing was never the enforcement

One sentence of the decision above is wrong about the run, and it is the one saying that `mount`, `seek`, `subscribe` and `dispose` "are not reachable through it". They are not members of `SchemaTransaction`, which is all a narrowing can say. A recipe closes over the `ProjectHandle` its caller called `edit` on, so the same caller reaches every one of them from inside the recipe, and `#refuseInsideRecipe` was asked by tier 0 and tier 2 alone.

`seek`, `mount`, `unmount`, `invalidate` and `signal` all publish or mount immediately and survive an abort, which is the shape `schema-transaction-immediate` exists for, so all five refuse by name now. The refusal, the rule id and the mechanism are unchanged. What changes is who asks.

Deferring them was refused a second time, on a reason the original decision did not need. `mount` answers with the instance, `seek` and `invalidate` answer with the `PatchBatch` the caller reads, and `signal` refuses an unknown motion id, so a deferred call would have to answer with a batch describing a publication that has not happened, which is one boolean meaning two incompatible things one level up. `unmount` is the single member of the five that could be deferred honestly, and deferring one of five is the two-failure-contracts defect this amendment closes.

Two consequences. `#mountNode` becomes the one owner of attaching a member, because the settle step mounted through the public verb and stayed outside its guard only by the ordering of the `finally` in `edit`, and an internal caller kept out of a public refusal by the ordering of a `finally` in another method is not a thing to leave standing. And `signal` moves onto `ProjectRuntimeOptions.signalMotion`, beside `replaceMotionTrigger` and `setMotionStagger`, because it lived in a closure over the engine's Motion map where the owner of this rule cannot be asked; the unknown-motion refusal stays in that layer verbatim, and `createHandle` loses the parameter that carried it.

`subscribe`, `get`, `adopt`, `destroyAdopted` and `dispose` stay reachable, each for its own reason. A listener is the caller's own object and taken inside a recipe it receives the commit's flush. A read of the last published patch is truthful while a recipe is open, because nothing has published. The two structural verbs compose into the one commit exactly as `addTrack` does, which is what shows the narrowing was documentation rather than a fence. Teardown has to be reachable from a `catch`. And a host clock ticked from inside a recipe still publishes, which is out of reach rather than allowed: this slice refuses what the handle can reach.

Evidence `RA-79` through `RA-85` in `packages/core/test/unit/runtime/immediate-verb-refusal.test.ts`, with the accepting direction asserted in the same rig for every refusal.
