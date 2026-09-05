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

## Amendment, 2026-09-03: a commit that derives no node does not flush

The decision above ends a commit at one flush seeded with what it committed, and it leaves one property of that flush unrecorded: an empty seed set is not a cheap flush, so `#apply` returns without asking `invalidate` at all when the derivation named no node. Recorded here as the promotion half of the read-budget audit in #267, because the reasoning lived in one docblock above `#apply` and nowhere else, and the audit that shrinks that file would otherwise have removed the only record of it along with the comment that held it.

An empty `invalidate` is not a no-op and it is not cheap. It opens a batch, notifies every batch subscriber, moves the sequence, and drains whatever seeds a deferred flush had been carrying, so a subscriber is handed a frame that published nothing and a deferred flush loses the seeds it was holding to a batch with nothing in it. A commit that derives no node has nothing to publish and must not spend a frame's worth of machinery saying so.

Empty is a real answer here rather than a default, which is why the guard belongs to the commit path rather than to the seam it calls. A Motion add and a Motion destroy derive no node and no edge at all: a runtime Motion may only be created empty and may only be destroyed empty, so the pair the graph accepted moved while nothing in it publishes. A removal is the other shape, and it seeds every node that was reading the removed one, which is empty for most removals; naming nothing is a different claim from having nothing to name. See `RA-98` and `RA-99` for that second half.

The behaviour is unchanged and has been pinned by `RA-10` since A1. What this amendment adds is the why, so the docblock above `#apply` collapses to a pointer like every other one in that file and loses nothing.

## Amendment, 2026-09-03: what a commit costs in front of the graph

The second promotion of the read-budget audit in #267, on the same rule the amendment above was written under: the reasoning lived only in docblocks inside `packages/core/src/runtime/project-runtime.ts`, so the audit that shrinks that file would otherwise have removed the only record of it. The behaviour is unchanged and is pinned by `RA-89` through `RA-97`.

Nothing a structural commit costs is priced per motion, per op or per access. Three properties say what that means, and each of them is an ownership statement rather than a measurement.

**The committed pair is walked once.** The snapshot the graph is handed is built from one walk, bucketed by the owner each entry already names, with the free tracks falling out of the same pass rather than out of a second one. A bucket fills in map order, so each motion's list is the list a per-motion filter produced, and a motion that owns nothing answers with an empty list rather than with no key, because that is the document a loader accepts and what a runtime-added Motion starts as. What it replaced asked `#ownedBy` once per motion, and that member materialises the whole track map, so placing V definitions cost `O(M x V)` in time and M arrays of length V in allocation. Every structural commit paid it, in front of a candidate build the incremental builder cache-hits for every untouched node, which is what kept it invisible: the measured wins that came before it were all about the tick, and this is the authoring side.

That is not a second derivation of the fact the reverse-topology unification collapsed, which is the objection worth answering rather than waving at. Which motion owns a track is a stored field on the entry rather than a derivation, so neither spelling derives anything and both read that field in the same map order. `#ownedBy` stays the owner of the single-motion question, asked by the destroy refusal's count and by both `MotionHandle` members, and `RA-91` asserts the two agree against all three of its remaining readers.

**The pair is adopted by pointer.** Adoption used to read both retained maps out, clear them, and `set` every entry back, so a commit that moved one entry paid `O(V)` map writes and paid them for the half of the schema that did not move at all: a one-track edit on a rig of 600 tracks rewrote 600 track entries and every motion beside them. The read-out existed for a real hazard, because a plan builder hands its own live map straight through for an untouched half and clearing the source mid-iteration would have emptied it. Adopting the object answers that hazard by construction instead: an untouched half is the map the class is already holding, so its assignment is a no-op, and a half that moved is a map one of the two staging accessors made for this commit and nothing else holds.

What that costs is the ownership change, and it is why the retained pair is no longer `readonly`: a plan builder may not keep what it handed over, and `#stageTracks` and `#stageMotions` are the only two things allowed to make one. Each half of a `SchemaPlan` is therefore optional, and a half a commit did not move is absent rather than handed back, so an absent half resolves to the map the class already holds and the adoption assigns it back to itself. `RA-92` and `RA-97` pin it, and every untouched entry's definition is handed through by identity, which is ADR-058's cache-hit rule enforced rather than amended.

**A recipe copies each half once, after the last refusal.** A half starts as the retained map by identity and is replaced by a copy on the first op that stages into it, so n ops cost one copy rather than n, and a recipe that staged nothing is still answered by identity on the pair rather than by a dirty flag, which is the property the decision above already relies on. The copy is therefore taken after an entry point's last refusal and never before it: a copy made for an op that then refused would leave the recipe holding a pair that differs from the retained one while holding exactly the same entries, and `edit` would spend a candidate build and a flush committing it. `RA-95` is that case, in both directions.

Outside a recipe the copy is the floor rather than an expense to remove, because the derivation compares the committed pair against the retained one, so the pair the graph is asked about cannot be the pair the class is still holding.

## Amendment, 2026-09-04: a precondition asserted before a callback is not a precondition on what follows it

`edit` asserts liveness on entry, hands control to the recipe, and then writes. The amendment of 2026-09-02 above is what makes those three facts a defect rather than a sequence: it lists `dispose` among the members that stay reachable from inside a recipe, on the reason that teardown has to be reachable from a `catch`. So the liveness `edit` asserted is stale by the time it decides to apply, and it is stale because this record said it may be. Issue #288.

A recipe that disposes without staging anything was already correct, and for the reason the third amendment above gives rather than by luck. `dispose()` calls `this.#tracks.clear()`, which mutates the map in place rather than replacing it, so `open.tracks === this.#tracks` still holds and the pair is answered by identity exactly as intended. Emptying the retained maps is not what makes the comparison differ, which is the one step of the original report that was wrong.

Stage-then-dispose is the case, and what it cost is worse than a wrong error message. `#stageTracks()` replaces the open half with a copy on the first op that stages into it, so the comparison differs, and `#derive` then reads that copy against a retained map `dispose` has just emptied: every entry in the project reads as newly added rather than the one the recipe staged. One `addTrack` inside the recipe bought a `compileTrack` for every track in the project, an `addMotionTrack` and a mount settle step for each of them, and a seed for each. All of those effects applied, `replaceGraph` then reached `GraphRuntime`'s own liveness check and threw, and `rejectAfterRollback` reverted in apply order with a `disposeTrack` for every track and rethrew. So the caller lost the recipe's answer to `Error: GraphRuntime is disposed.`, which names the layer that noticed rather than the recipe that decided, and a composition that had just been disposed was handed a compile and a dispose for every track it owned on the way out. The settle steps never ran, so nothing mounted against the dead graph, which is the one thing that did not go wrong.

**The invariant.** `#apply` never starts against a runtime its caller disposed, and a recipe that disposed the runtime returns its own answer.

**The re-ask belongs to `edit`, and it answers.** After the recipe returned and before the write, because that is the only point at which the question is being asked about the state the write will run against. It answers rather than refuses, which is the split this class already draws between a probe and a resolver, `#entryIfLive` beside `#liveEntry`: one question, once answered and once refused, with the caller choosing which it needs. Dropping the staged pair is honest rather than lossy, because a disposed runtime has cleared its retained pair and disposed its graph, so there is nothing left for that pair to be committed to.

**`edit` routes through `#commit` rather than calling `#apply` directly**, and that is the second half of the same slice rather than tidying beside it. The `#commit` section of `packages/core/src/runtime/project-runtime.md` calls it the one path by which a structural change reaches the graph, or the open transaction, and that claim was false while `edit` had a path of its own. At `edit`'s call site `#open` is already `undefined`, because the `finally` cleared it before the comparison, so `#commit` is behaviourally identical there and its guard answers `none open, apply` for the right reason rather than being inapplicable to the caller. What it buys is that the decision to apply has one place, and therefore that the liveness answer has exactly one reader. `#apply` gains what `replaceGraph`, `rejectAfterRollback` and every hook already had: one call site.

**Stated on starting rather than on running, and that is a scope rather than a hedge.** A host hook applied inside `#apply` is caller code too: `compileTrack`, `stageTrack` and `createMotion` all run between the derivation and `replaceGraph`, and one that disposed the runtime mid-commit would still reach the graph on a dead runtime. Nothing in this slice changes that and no case here asserts about it. It is the same shape one indirection out, a precondition asked before a hook and trusted after it, and it is named here so the invariant above is not read as covering it.

**Refusing `dispose` inside a recipe was rejected.** It is the cheapest change available, through the existing `#refuseInsideRecipe`, and it contradicts the amendment of 2026-09-02 directly. It also breaks the exact path that amendment was made for: a recipe that catches its own error and tears the project down would get a `TypeError` in place of its answer, and the error it was handling would be lost behind a refusal about the teardown. `dispose` has the shape the immediate-verb rule describes and is exempt for a stated reason, which is why that amendment names it explicitly rather than by omission. `RA-110` is the case that refuses this alternative, and that is its whole job.

**Guarding inside `#apply` was rejected for ownership.** Its five other callers cannot reach it while disposed. `addMotion` and `#addTrack` ask `#assertLive` themselves, and `#removeTrack`, `#removeMotion` and `#replaceTrack` are reached through resolvers that ask it before they resolve, `#writableEntry` and `#writableMotion`. On the day this amendment was written the last three asked nothing of the kind: they were reached from `MotionHandle.destroy`, `TrackHandle.replace`, `#writeKeyframes` and `#replaceWithObservation`, which resolved through `#liveMotion` and `#liveEntry` and answered staleness, and staleness answered only because `dispose` empties the retained maps and the token lookup misses. Stating that rather than rounding it to liveness is what made it citable, because it is the same fact that turns this defect from a wrong message into a compile for every track in the project, and because it was a second defect: one condition with two public failure contracts, which is issue #298 and ADR-056's amendment of 2026-09-04. Either way a guard in the shared write path could only ever have fired for the one caller that could reach it, placed where all six pass, and a guard like that hides a real defect on the day it fires for a different reason. It can now fire for none of them. It also cannot answer at all: `#apply` returns `void`, and the answer is the whole point.

**Evidence.** `RA-109` and `RA-110` in `packages/core/test/unit/runtime/schema-transaction.test.ts`, which owns `RA-62` through `RA-68` and therefore owns `edit`. Pushed ahead of the source, so the red run is its own and can be cited by id.

- `RA-109` a recipe that adds a track and then disposes returns the recipe's own answer, throws nothing, reaches no hook at all, and leaves the runtime disposed. Red before the source, on the graph layer's error arriving in place of the answer and on a journal naming every track in the project twice.
- `RA-110` a recipe that disposes without staging anything is not refused and commits nothing. Green before the source and green after it, and it is a lie detector for the rejected refusal rather than evidence of the fix. It is also green for two different reasons across the slice, identity on the pair before and this amendment's re-ask after, and the file says so, because only one of those two is a fact about the pair.

One red case, which is what a slice carrying one new invariant should turn red. The other invariant it states was already true, and a red count padded by asserting less in the case that could not fail is the failure mode the guardrail refuses.

**Consequences.** No public surface moves: no export, type, schema or handle member changes, and `edit` keeps its signature and its return contract. What changes is which value it returns in the one case that previously threw from two layers down. `docs/GUARDRAILS.md` gains the general rule, because a rule this slice earned goes there rather than in the status file, and `docs/LIVE-EDIT-COST.md` gains what a caller may now rely on when a recipe tears the project down.

## Amendment, 2026-09-05: the rung this record names no longer exists under that name, and it asks two conditions

`#refuseInsideRecipe` is renamed `#refuseReentrant` by [ADR-070](./ADR-070-one-reentrancy-rung.md) and asks a second condition after the one this record owns. Nothing about this record's refusal moves: `schema-transaction-immediate` keeps its name, its `ruleId`, its message and its verb argument, it is asked first, and `RA-79` through `RA-85` are untouched. The rename is private and the widening is a second refusal beside this one rather than a change to it.

Two things this record decided become load-bearing somewhere else, and they are named here so a reader of the amendments above is not surprised by either. `dispose` staying reachable from inside a recipe is why `edit` clears `#open` in its own `finally` before it commits, and that construction is precisely why the recipe condition cannot see a commit at all -- so this record's own exemption is the reason ADR-070 had to exist. And the five verbs the amendment of 2026-09-02 moved onto this rung, `seek`, `mount`, `unmount`, `invalidate` and `signal`, are five of the ten that ADR-070's second condition reaches: the same list arriving at the same rung for the second time, which is the whole of why one rung was the right shape rather than a sibling guard beside it.

This amendment is about the rung and nothing else. A citation elsewhere in the tree reading "ADR-064's amendment of 2026-09-05" for the deferred teardown, a release that is allowed to be late, or a handle answering stale before the retained maps are cleared means [ADR-067](./ADR-067-commit-lifecycle-and-deferred-teardown.md), which is the record that decided all three and carries that date. Those citations are noted rather than rewritten: the record they belong to is not this one's to correct, and the drift predates the slice that noticed it.
