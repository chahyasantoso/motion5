# ADR-070: one rung for a callback's reentrancy, and a publication is not reachable while a commit is in flight

**Status:** Accepted, 2026-09-05. [Issue #310](https://github.com/chahyasantoso/motion5/issues/310).

## Context

ADR-068 filed this case as alternative it deliberately did not take. Its **Widening this to the paths that never reach `#commit`** section names issue #310 in one sentence -- hook's flush publishes against graph commit replaces, `samePatch` then drops commit's own publication rather than adding -- and says mechanism should widen by wrapping second boundary, not copying condition into four members. ADR-069 did that wrapping for disposal. This is publication; needs no new mechanism: state it reads shipped with ADR-067, refusal with ADR-068.

`#refuseInsideRecipe` read one field:

```text
#refuseInsideRecipe(verb) {
  if (this.#open !== undefined) immediateInTransaction(verb);
}
```

`#open` is `undefined` by construction throughout `#apply`: `edit` clears it in own `finally` before `#commit`. `project-runtime.md` calls construction load-bearing, not incidental: bounds deferred teardown's window to commit with no recipe open; ADR-064's amendment of 2026-09-04 makes `dispose` reachable from inside recipe at all. Defect downstream of two accepted decisions, not oversight in either.

Ten call sites read rung: `mount`, `unmount`, `signal`, `seek`, `invalidate`, `#writeValues` for both verbs, `#setKeyframe`, `#removeKeyframe`, `#setTrigger`, `#setStagger`. Five end at `#graph.invalidate(...)`; those five are issue's subject.

Hook is caller code. `compileTrack` hook calling `runtime.seek(nodeId, 0.5)` or `runtime.invalidate([nodeId])` opened batch whose seeds resolved against graph commit had not replaced, values from compiled map commit had already written into. Three things followed; third is defect, not surprise.

**The batch disagreed with the graph it was derived from.** Replacement's staged Track exists, `staged.commit()` not run -- settle step -- so seek resolves against Track commit displaces, publishes values at progress caller asked for. Added node compiled by effect absent from candidate graph → seed naming it names node publisher cannot walk.

**The sequence moved.** `RA-11` pins one flush per structural commit, from outside. Nothing pinned it from inside → subscriber counting batches saw one commit publish twice, one of two describing graph that never committed.

**And `PatchRegistry.publish` drops a candidate through `samePatch`, so a publication placed in front of the commit's own flush takes that flush rather than adding to it.** Measured, not theorised. Run 33712936651 turned 21 cases red on exactly this mechanism when part 6 of re-review prescribed flush seed at mount; ADR-066 records it as why mount publishes nothing. Hook publishing mid-commit reproduces it from other side; commit's own `invalidate` pays: caller of `addTrack` gets graph that changed and `touched` list that published nothing.

Same window, second consequence, different shape: `mount` and `unmount` from hook attach or detach against pre-commit graph → either reaches graph commit has not replaced.

Issue predicted `mount` of node commit adds leaves settle step's own `#mountNode` to throw `Node "..." is already mounted.` inside one phase with no error boundary. Red run says otherwise; run is finding. `RA-134` measured `Unknown graph node "hero/hand".` instead: public verb reaches `#mountNode` → `GraphRuntime.attach`; candidate graph lacks that node yet → graph layer refuses before instance registers, settle step's own mount never reached. Prediction one layer too high, one phase too late.

Correcting it strengthens record. Caller read `Unknown graph node` for node it had just been handed compiled Track for: layer that noticed reporting in place of owner that decided -- shape issue #288 corrected for recipe, issue #303 for commit, issue #305 for direct write, arriving fourth time. Rung makes answer `schema-commit-reentrant`. Issue #306 keeps whole job: `#mountNode` still reaches ids `GraphRuntime.attach` refuses for reasons no reentrancy guard can see; `addMotionTrack`, `disposeTrack`, `staged.commit()` still caller code in phase with no revert list.

## Decision

**A publication is not reachable while a commit is in flight, and "a recipe is open" and "a commit is in flight" stop being two guards.** One rung answers both, at ten call sites already asking one of them; refusal `schema-commit-reentrant`: ADR-068's existing name, rule id, message -- condition identical, remedy identical.

Whole change: one added line in one renamed member:

```text
#refuseReentrant(verb) {
  if (this.#open !== undefined) immediateInTransaction(verb);
  if (this.#inFlight > 0) commitInFlight();
}
```

**A publication is refused rather than corrected or deferred.** Every alternative requires this layer to name pair commit holds; nothing outside `#apply` can -- that member holds it in local. "Publish against right graph" not implementable from `seek`. "Publish later": deferred batch whose seeds resolved against graph that never committed, answered to caller already returned, in phase that cannot refuse. "Publish anyway": `samePatch` theft measured above. Refusal only answer needing no second commit protocol inside first, which ADR-068 already refused for structural half.

**It keeps ADR-068's name rather than taking one of its own, and this is the clause most worth arguing.** Condition not merely similar to that record's: same field, same value, same remedy sentence -- ask again once this one returned. `commitInFlight`'s docblock already gives reason per-verb spelling refused there: caller wrote no transaction, wrote hook a commit called → message names condition, stack names verb. Reasoning unchanged because verb answers `PatchBatch` not `void`; return type differs in what verb would have answered, and it answers nothing now. Keeping string also means no existing case anchored on `schema-commit-reentrant` moves -- difference between this slice and one inventing `schema-publish-reentrant`, then owing every reader boundary between two rules with one condition.

**The order between the two conditions is a contract, written down although nothing can observe it.** Recipe first. Recipe is caller-written, movable → refusal names verb; commit in flight is caller-unwritten → refusal names condition. Both cannot hold: `edit` clears `#open` before commit. Order nothing measures is order later slice picks by accident → stated, not left to cheaper field read.

**The rung's condition set grows and its call site set does not.** No verb joins ten, none leaves. Makes this one rung, not widening: `mount`, `unmount` covered free -- issue's named second consequence -- five publishing verbs by same line.

**One rule comes with it, because the refusal is only correct while it holds: a commit's own work uses the private twin, never the public verb.** Settle phase calls `#mountNode`, not `mount`. `#apply`'s own flush calls `this.#graph.invalidate(commit.touched)`, not `invalidate`. Both in-place write paths end at `#invalidateOne`, not `invalidate`. `#derive` calls no public verb, including from `#needsTimelineBuild`. Each already deliberate; stops being tidiness argument: makes commit's own mount and flush legal while hook's refused. Written into `project-runtime.md` beside rung, not left as property future reader re-derives.

**What this slice does not claim.** Refusal removes _competing_ publication. Does not make commit's own flush survive settle step that throws -- issue #306's. So this record guarantees nothing publishes between `replaceGraph` and commit's flush; #306 guarantees flush happens at all; neither true without other. `RA-135` asserts half this record owns, in form true after #306 lands.

## Alternatives rejected

**A second guard beside the first, at ten call sites.** `#refuseInsideRecipe(verb)` plus sibling `#refuseInsideCommit()` next to it. Ten pairs adjacent calls, one ordering repeated ten times, eleventh verb getting one of two. Copy-per-call-site shape issue #298 deleted seventeen of; rung makes ordering unrepeatable.

**A new refusal name, `schema-publish-reentrant`.** One condition, two rules, boundary that must be documented and will be got wrong. The Decision above.

**A third member both rungs call, so the condition has one reader.** `#commit` reads field for structural verbs, rung for immediate ones; reader will want to collapse that. Already collapsed as far as possible: no member on both paths → no single rung fifteen verbs pass through; third member reading field and throwing would be `commitInFlight` with different name. Two rungs, two verb families, one condition, one refusal function is floor, not duplication.

**Allowing the publication and guaranteeing the commit's flush publishes after it.** Cannot be honoured. `samePatch` drops later candidate when indistinguishable → "commit still publishes" means defeating dedupe (ADR-066 decided) or publishing values derived from graph that never committed.

**Deferring a hook's publication into the settle phase.** Batch whose seeds resolved against pre-commit graph, published after post-commit graph exists, answered to caller already returned. Also puts refusable operation in phase that cannot refuse -- `immediateInTransaction`'s docblock refuses for `setTrigger`; ADR-064 refused for all five verbs it moved onto rung.

**Changing `PatchRegistry`.** Dedupe correct, not thing to change. ADR-066 decided publication nobody can distinguish from last one is dropped; this record about who may make one. Nothing in `patch-registry.ts` or `graph-publisher.ts` moves.

**Moving `replaceGraph` earlier.** Ordering load-bearing for ADR-031, ADR-035, ADR-045; `#apply` its one owner. Answers by making pre-commit window smaller, not closed -- smaller version of same defect.

**Making the settle step's mount idempotent.** Hides one symptom behind change to what mounting means. `Node "x" is already mounted.` exists because double mount is caller bug.

**Refusing at the seam rather than at the verb.** Seam is host implementation of injected port → host whose `compileTrack` seeks is substitutable implementation, not broken one. Answer may not depend on which seam or what it published → refusal at verb. `RA-135` fails if it moves.

**Narrowing `#inFlight` now that the bound is one again.** The Consequences below.

## Consequences

No public surface moves. No export, type, signature, message or `ruleId` changes; no new function joins `schema-refusals.ts` -- extension point used, not widened. One rename private. `ProjectRuntimeOptions` untouched: seam not asked to declare it publishes.

One `ruleId` reaches caller on paths that could not refuse at all before. `seek`, `invalidate`, `setValues`, `overrideValues`, `setKeyframe`, `removeKeyframe`, `setTrigger`, `setStagger`, `mount`, `unmount` called from inside commit hook, or inside `writeValues`, `stageTrack`, `replaceMotionTrigger`, `setMotionStagger` seam, all read `schema-commit-reentrant`. Host wanting one queues it, asks once call it is inside returned -- same answer ADR-068 gave structural half, no API of its own.

Caller may now rely on one thing it could not: structural commit publishes exactly once, with seeds `#derive` chose; nothing placed in front takes it.

**`#inFlight`'s bound of zero or one is restored, by a different guard, and the state is not narrowed to it.** ADR-068 proved bound from `#commit`'s refusal. ADR-069 withdrew it: `compileTrack` calling `setValues` reached `#writeValues`, raised depth second time. Rung refuses exactly that call, asked before `#boundary` entered at all four direct writes → every raiser behind guard reading field first; depth two unreachable again. Field stays counter. Bound proved, withdrawn, re-proved across three slices, state unchanged -- same argument ADR-068 made for refusing to narrow it, arriving second time: flag right, then wrong, then right, silently wrong whole middle. GUARDRAILS.md carries general rule.

**A hook that reads is legal, and that is stated rather than implied.** `handle.definition`, `dependantsOf`, `instanceCount`, `tryTrack`, `tryMotion` answer from retained pair, one commit behind while commit in flight. Staleness documented consequence of pair held in local, not defect, written in `project-runtime.md`'s `## #adoptMaps`.

**Two issues are left open and named rather than absorbed.** Issue #306 still owns throwing settle step: `#mountNode` can also throw on id `GraphRuntime.attach` refuses; `addMotionTrack`, `disposeTrack`, `staged.commit()` caller code with no reentrancy in sight. Slice removes one reachable cause, none of others. Issue #309's four in-place write paths land on rung → what remains distinctly its own is order between refusal and entry resolution: write refused for node commit already compiled must read `schema-commit-reentrant`, not false `Unknown graph node "x"`.

## Clean architecture, DRY and SOLID

**Single responsibility.** `#refuseReentrant` owns whether verb may run now, `#boundary` depth, `#apply` commit order, `#invalidateOne` and `#apply`'s flush publication. Four questions, four owners; rung answers one question, not two: "is caller code mid-edit" has two spellings, not two subjects.

**DRY, and the duplication that was about to happen.** Tempting shape: two adjacent guards at ten call sites. Rung makes ordering unrepeatable; DRY win kept where real: one condition, one state, one spelling, one refusal function.

**Open for extension.** Nothing added to refusal module, nothing removed. Extension point used, not widened.

**Substitution.** Seams are host implementations of injected ports → answer may not depend on which seam it was → refusal at verb.

**Interface segregation.** Nothing asked of port. `ProjectRuntimeOptions` untouched.

**Dependency inversion.** Refusal made by layer owning commit's publication order. Before, consequence delivered by `PatchRegistry`'s dedupe -- correct policy in layer owning deduplication, not commit lifecycle -- same layering complaint ADR-067 made, ADR-069 made one tier down.

## Evidence

`RA-131` through `RA-135`. `structural-commit-flush.test.ts` owns seed-and-flush contract, `RA-8` through `RA-13` → count and each batch's contents belong there; ordering belongs beside journal in `structural-commit-path.test.ts`. Pushed ahead of source → red run its own, citable by id.

- `RA-131`, `structural-commit-flush.test.ts`. `compileTrack` hook calling `runtime.invalidate([anExistingNode])` once. One flush per structural commit, pinned from inside; commit's own flush carries node it added. Same rig also carries accepting direction: same verb on same node from outside commit two lines earlier not refused.
- `RA-132`, same file. `runtime.seek` on node being replaced, from `stageTrack` hook → staged Track uncommitted when seek resolves. Sharpest single measurement in issue, position rather than value: journal shows `setProgress` reaching displaced Track between stage and its commit; after slice nothing between them.
- `RA-133`, same file. Hook seeding node commit is _adding_ → names node candidate graph lacks. Refused by same one condition, which does not read seed; commit's own flush still publishes that node → fix costs no `RA-9` publication.
- `RA-134`, `structural-commit-path.test.ts`. `runtime.mount(addedNodeId)` from `compileTrack` hook, issue's fifth reproduction shape. Mount refused, `instanceCount` what commit alone made it, settle phase runs clean. Red on `Unknown graph node "hero/hand".` rather than `already mounted` issue predicted -- Context's correction. Cross-referenced to #306, not claimed to close it.
- `RA-135`, same file, accepting direction and invariant. Hook that reads -- `handle.definition`, `dependantsOf`, `instanceCount`, `tryTrack` -- untouched: none is publication or edit; one commit publishes exactly once with seeds `#derive` chose. Written to stay true after #306 makes flush unconditional: asserts exactly one batch carrying `touched`, not that batch happened.

Four of five red, measured not predicted: run 33966081848 reports 4 failed, 960 passed, `typecheck` and `format:check` green ahead → every failure assertion that disagreed, not file that would not compile. Run 33966337062 green on all seven required checks.

`RA-131`, `RA-133` fail on `intrusion accepted` where refusal belongs. `RA-132` fails on extra journal line `progress hero/arm 0.5`, exactly between `stage hero/arm` and `stage-commit hero/arm` -- issue's sharpest claim confirmed at predicted position: seek reached Track commit was displacing before staged one committed. `RA-134` fails on `reentry Unknown graph node "hero/hand".`, Context's correction.

`RA-135` green on both sides deliberately; file says so, per guardrail against padding red count by asserting less in case that could not fail.

## References

ADR-064 for recipe refusal and rung this renames, plus amendment of 2026-09-02 for five verbs it put there. ADR-066 for why publication in front of deduplicating publisher takes next one. ADR-067 for commit lifecycle and depth. ADR-068 for refusal this reuses, bound it withdrew. ADR-069 for direct-write boundary that made four more raisers. Issues #298, #303, #305, #306, #307, #309, #310.

## Amendment, 2026-09-05: the rung out-ranks the resolution, so a refused write reads the condition rather than a false absence

Consequences above name what issue #309 had left once rung shipped: four in-place write paths land here → what remains distinctly its own is order between refusal and entry resolution. That order decided here, not in record of its own: splitting one rule across two documents makes next reader ask which governs `#setKeyframe`. Nothing about condition, name, `ruleId` or message changes. [Issue #309](https://github.com/chahyasantoso/motion5/issues/309).

**The two tiers had opposite orders, and one of them was already right.** `#setTrigger`, `#setStagger` ask rung then resolve -- ADR-061's order; `RA-36` pins it. `#writeValues` took resolved `TrackEntry`; argument expression evaluated before member that would refuse it → rung inside asked second at all four call sites; order a property of how each nested two expressions, not something anything owned. `#setKeyframe`, `#removeKeyframe` same shape one line apart.

**What that cost is a false diagnosis rather than a lost write, and saying so is half of this amendment.** Rung already refuses all four paths → from inside commit no seam reached, no retained entry moves: issue #309's three consequences -- retained definition composition moved past, cleared overlay over still-patched timeline, deleted `liveWrite` -- unreachable rather than repaired, strongest form answer can take: no partial state left for later slice to reconcile, no compensation path to keep correct. What caller read was still wrong. Write aimed at node in-flight commit is compiling resolved against retained pair, which does not carry it, answered `Unknown graph node "x"`. False: node exists, compiled by effect already run, in map caller cannot see. Write through handle whose token retired answered staleness, true of handle, not reason call may not run. False absence sends caller hunting bug in id it passed; unordered pair of true answers sends it nowhere. So refusal precedes resolution.

**The decision: a refusal meant to out-rank a resolution takes that resolution as a thunk.** `#writeValues` takes `() => TrackEntry`, calls it inside its boundary, after rung. Two resolutions stay different -- whole point of thunk over shared resolver: handle resolves by id and token through `#writableEntry`, refuses stale handle; public verb resolves by id through `#entryOf`, refuses unknown one. Neither rung moves; `project-runtime.md`'s rule that `#writable` rungs are not in handle factory untouched: factory still names `#writableEntry`, only lazily.

**`#setKeyframe` and `#removeKeyframe` cannot take one, so the refusal moves instead.** Both need `entry.track.keyframes` through `#boundGroup` before either of two paths describable → thunk would defer read they immediately must perform. Rung moves above resolve, same call one line up rather than second call; no condition copied anywhere.

**The rung is asked twice on the `#setKeyframe` path, and that is the cheaper guarantee.** Pair of field reads, no side effect on either branch; nothing between two asks can change either field → second cannot answer differently. Alternative: `#writeValues` variant skipping rung for internal caller -- one member, two contracts, no refusal at all for first caller to pick wrong one. Neither call dead; `project-runtime.md` says so under `## #refuseReentrant` so later reader does not delete one. `#recompileKeyframes` asks no rung and does not start: both callers just did; it is tail, not entry point.

**The invariant this buys `#adoptMaps`, written down where the assignment is.** Member replaces retained pair unconditionally; safe only because nothing can have written that pair since `#derive` read it. Every in-place write refused while depth up → four members reaching `#tracks.set` and `#motions.set` outside commit unreachable from inside one. Claim lived nowhere before this amendment; `project-runtime.md`'s `## #adoptMaps` now its home, one place everyone editing commit path reads.

**Making `#adoptMaps` merge rather than assign was the most tempting alternative, and it is wrong in a way worth recording.** Merge would preserve `overlay` and `liveWrite` from retained pair while definition they describe is commit's → `liveWrite: true` would claim write against Track built from definition that never took it. Over-reporting, opposite of conservative direction ADR-066 chose for that field; also cannot preserve rewrite `setValues` made to retained definition -- consequence ADR-060 cares about most. Also makes what `handle.definition` says depend on whether commit is on stack.

**Consequences.** No public surface moves. One signature change on `#private` member; no export, type, schema, message or `ruleId` changes. Three paths that answered false `ruleId` from inside commit now answer `schema-commit-reentrant`: live write aimed at node commit is adding, both live-write entry points reached through retired handle. [GUARDRAILS.md](./GUARDRAILS.md) carries general rule; [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md)'s seam bullet carries caller-facing half.

**Evidence.** `RA-136` through `RA-139` in `structural-commit-path.test.ts`. `RA-138` only red one, reported not engineered: rung already refuses all four paths → `RA-136` and `RA-137` green on both sides; file says so, per guardrail against padding red count by asserting less in cases that could not fail. They add first measurement of refusal on write path issue #309 owns, not publishing verbs this record covered; they assert seam never called, answering all three of that issue's consequences at once. `RA-139` accepting direction, both thunks resolving, not merely deferring.

One of four red, measured not predicted: run [33968574989](https://github.com/chahyasantoso/motion5/actions/runs/33968574989), archived at `logs/33968574989/` on `ci-logs`, reports 1 failed, 967 passed across 186 files, `typecheck` and `format:check` green ahead → failure is assertion that disagreed, not file that would not compile. `RA-138` fails on all three shapes in one diff: `adding Unknown graph node "hero/hand".`, false absence this amendment exists for, and `stale Track "hero/arm" is no longer live.` twice, once through handle's live-write member, once through `#setKeyframe` one line earlier. `RA-136`, `RA-137`, `RA-139` green in same run -- measurement behind paragraph above, not claim about it. Run [33968799301](https://github.com/chahyasantoso/motion5/actions/runs/33968799301) green on all seven required checks.

**What this leaves open.** Issue #313: seam on those same four paths that fails rather than disposing or being adopted over. Neither boundary nor rung can see it: `#writeValues`' escalation and `#recompileKeyframes`' `staged.commit()` both run after retained entry moved, on paths that never reach `#apply`. That slice reorders tails this one changes signature of → lands after it.
