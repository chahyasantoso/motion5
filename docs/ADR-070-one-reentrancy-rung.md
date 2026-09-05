# ADR-070: one rung for a callback's reentrancy, and a publication is not reachable while a commit is in flight

**Status:** Accepted, 2026-09-05. [Issue #310](https://github.com/chahyasantoso/motion5/issues/310).

## Context

ADR-068 filed this case as an alternative it deliberately did not take. Its **Widening this to the paths that never reach `#commit`** section names issue #310 in one sentence -- a flush from a hook publishes against the graph the commit is replacing, and `samePatch` then drops the commit's own publication rather than adding to it -- and says the mechanism is meant to be widened by wrapping a second boundary in it rather than by copying a condition into four members. ADR-069 did that wrapping for the disposal half. This is the publication half, and it needs no new mechanism at all: the state it reads shipped with ADR-067 and the refusal it hands out shipped with ADR-068.

`#refuseInsideRecipe` read one field:

```text
#refuseInsideRecipe(verb) {
  if (this.#open !== undefined) immediateInTransaction(verb);
}
```

`#open` is `undefined` by construction throughout `#apply`, because `edit` clears it in its own `finally` before it calls `#commit`. `project-runtime.md` states that construction as load-bearing rather than incidental: it is what bounds a deferred teardown's window to a commit with no recipe open, and ADR-064's amendment of 2026-09-04 is what makes `dispose` reachable from inside a recipe in the first place. So this record's defect is downstream of two accepted decisions rather than of an oversight in either.

Ten call sites read that rung: `mount`, `unmount`, `signal`, `seek`, `invalidate`, `#writeValues` for both of its verbs, `#setKeyframe`, `#removeKeyframe`, `#setTrigger` and `#setStagger`. Five of them end at `#graph.invalidate(...)`, and those five are this issue's subject.

A hook is caller code. So a `compileTrack` hook calling `runtime.seek(nodeId, 0.5)` or `runtime.invalidate([nodeId])` opened a batch whose seeds were resolved against the graph the commit had not replaced yet, and whose values came from a compiled map the commit had already written into. Three things followed, and the third is a defect rather than a surprise.

**The batch disagreed with the graph it was derived from.** A replacement's staged Track exists and `staged.commit()` has not run, because that is a settle step, so a seek resolves against the Track the commit is displacing and publishes its values at the progress the caller asked for. An added node has been compiled by an effect and is absent from the candidate graph, so a seed naming it is a node the publisher cannot walk.

**The sequence moved.** `RA-11` pins one flush per structural commit, from outside. Nothing pinned it from inside, so a subscriber counting batches saw one commit publish twice, and one of the two described a graph that never committed.

**And `PatchRegistry.publish` drops a candidate through `samePatch`, so a publication placed in front of the commit's own flush takes that flush rather than adding to it.** That is measured rather than theorised. Run 33712936651 turned 21 cases red on exactly this mechanism when part 6 of the re-review prescribed a flush seed at the mount, and ADR-066 records it as the reason a mount publishes nothing. A hook publishing mid-commit reproduces it from the other side, and the commit's own `invalidate` is what pays: the caller of `addTrack` gets a graph that changed and a `touched` list that published nothing.

The same window had a second consequence with a different shape. `mount` and `unmount` from a hook attach or detach against the pre-commit graph, so either one reaches a graph the commit has not replaced.

The issue text predicted that a `mount` of the node the commit is adding leaves the settle step's own `#mountNode` to throw `Node "..." is already mounted.` inside the one phase with no error boundary. The red run says otherwise, and the run is the finding. `RA-134` measured `Unknown graph node "hero/hand".` instead: the public verb reaches `#mountNode`, which reaches `GraphRuntime.attach`, and the candidate graph does not carry that node yet, so the graph layer refuses before an instance is ever registered and the settle step's own mount is never reached. The prediction was one layer too high and one phase too late.

Correcting it makes the case for this record rather than weakening it. What a caller actually read was `Unknown graph node` for a node it had just been handed a compiled Track for, which is the layer that noticed reporting in place of the owner that decided: the shape issue #288 corrected for a recipe, issue #303 for a commit and issue #305 for a direct write, arriving here for a fourth time. The rung is what makes the answer `schema-commit-reentrant` instead. Issue #306 keeps its whole job either way, because `#mountNode` still reaches ids `GraphRuntime.attach` refuses for reasons no reentrancy guard can see, and `addMotionTrack`, `disposeTrack` and `staged.commit()` are still caller code in a phase with no revert list.

## Decision

**A publication is not reachable while a commit is in flight, and "a recipe is open" and "a commit is in flight" stop being two guards.** One rung answers both conditions, at the ten call sites that already ask one of them, and the refusal is `schema-commit-reentrant`: ADR-068's existing name, rule id and message, because the condition is identical and so is the remedy.

The whole behaviour change is one added line in one renamed member:

```text
#refuseReentrant(verb) {
  if (this.#open !== undefined) immediateInTransaction(verb);
  if (this.#inFlight > 0) commitInFlight();
}
```

**A publication is refused rather than corrected or deferred.** Every alternative requires this layer to name the pair the commit is holding, and nothing outside `#apply` can, because that member holds it in a local. "Publish against the right graph" is not implementable from `seek`. "Publish later" is a deferred batch whose seeds were resolved against a graph that never committed, answered to a caller that has already returned, in a phase that cannot refuse. "Publish anyway" is the `samePatch` theft measured above. A refusal is the only answer that does not require a second commit protocol inside the first, which is what ADR-068 already refused for the structural half.

**It keeps ADR-068's name rather than taking one of its own, and this is the clause most worth arguing.** The condition is not merely similar to that record's -- it is the same field with the same value, and the remedy is the same sentence: ask for it once this one has returned. `commitInFlight`'s own docblock already gives the reason a per-verb spelling was refused there: the caller wrote no transaction, it wrote a hook that a commit called, so the message names the condition and the stack names the verb. That reasoning does not change because the verb answers a `PatchBatch` instead of `void`; a return type is a difference in what the verb would have answered, and it answers nothing now. Keeping the string also means no existing case anchored on `schema-commit-reentrant` moves, which is the difference between this slice and one that invents `schema-publish-reentrant` and then owes every reader a boundary between two rules with one condition.

**The order between the two conditions is a contract, and it is written down although nothing can observe it.** Recipe first. A recipe is something the caller wrote and can move, so its refusal names the verb; a commit in flight is something the caller did not write, so its refusal names the condition. The two cannot both be true, because `edit` clears `#open` before it commits. An order nothing measures is exactly the order a later slice picks by accident, so it is stated rather than left to which field is cheaper to read.

**The rung's condition set grows and its call site set does not.** No verb joins the ten and none leaves. That is the property that makes this one rung rather than a widening: `mount` and `unmount` are covered for free, which is this issue's named second consequence, and the five publishing verbs are covered by the same line.

**One rule comes with it, because the refusal is only correct while it holds: a commit's own work uses the private twin, never the public verb.** The settle phase calls `#mountNode`, not `mount`. `#apply`'s own flush calls `this.#graph.invalidate(commit.touched)`, not `invalidate`. Both in-place write paths end at `#invalidateOne`, not at `invalidate`. And `#derive` calls no public verb, including from `#needsTimelineBuild`. That was already deliberate in each case, and it stops being a tidiness argument here: it is what makes a commit's own mount and a commit's own flush legal while a hook's are refused. It is written into `project-runtime.md` beside the rung rather than left as a property a future reader re-derives.

**What this slice does not claim.** A refusal removes the _competing_ publication. It does not make the commit's own flush survive a settle step that throws, which is issue #306's. So this record guarantees that nothing publishes between `replaceGraph` and the commit's flush, #306 guarantees the flush happens at all, and neither claim is true without the other. `RA-135` asserts the half this record owns in a form that stays true after #306 lands.

## Alternatives rejected

**A second guard beside the first, at ten call sites.** `#refuseInsideRecipe(verb)` plus a sibling `#refuseInsideCommit()` called next to it. Ten pairs of adjacent calls, one ordering repeated ten times, and the eleventh verb getting one of the two. It is the copy-per-call-site shape issue #298 deleted seventeen of, and the rung is what makes the ordering unrepeatable.

**A new refusal name, `schema-publish-reentrant`.** One condition, two rules, and a boundary between them that has to be documented and will be got wrong. The Decision above.

**A third member both rungs call, so the condition has one reader.** `#commit` reads the field for the structural verbs and the rung reads it for the immediate ones, and a reader will want to collapse that. It is already collapsed as far as it goes: no member sits on both paths, so there is no single rung fifteen verbs pass through, and a third member that read the field and threw would be `commitInFlight` with a different name. Two rungs, two verb families, one condition, one refusal function is the floor rather than a duplication.

**Allowing the publication and guaranteeing the commit's flush publishes after it.** Cannot be honoured. `samePatch` drops the later candidate when it is indistinguishable, so "the commit still publishes" would mean either defeating the dedupe, which ADR-066 decided, or publishing values derived from a graph that never committed.

**Deferring a hook's publication into the settle phase.** A batch whose seeds were resolved against the pre-commit graph, published after the post-commit graph exists, answered to a caller that has already returned. It also puts a refusable operation in a phase that cannot refuse, which `immediateInTransaction`'s own docblock refuses for `setTrigger` and ADR-064 refused for all five of the verbs it moved onto this rung.

**Changing `PatchRegistry`.** The dedupe is correct and is not the thing to change. ADR-066 decided that a publication nobody can distinguish from the last one is dropped, and this record is about who may make one. Nothing in `patch-registry.ts` or `graph-publisher.ts` moves.

**Moving `replaceGraph` earlier.** The ordering is load-bearing for ADR-031, ADR-035 and ADR-045, and `#apply` is its one owner. It would answer this by making the pre-commit window smaller rather than closed, which is a smaller version of the same defect.

**Making the settle step's mount idempotent.** It hides one symptom behind a change to what mounting means. `Node "x" is already mounted.` exists because a double mount is a caller bug.

**Refusing at the seam rather than at the verb.** A seam is a host implementation of an injected port, so a host whose `compileTrack` seeks is a substitutable implementation rather than a broken one. The answer may not depend on which seam it was or on what it published, which is why the refusal is at the verb. `RA-135` is the case that fails if it moves.

**Narrowing `#inFlight` now that the bound is one again.** The Consequences below.

## Consequences

No public surface moves. No export, type, signature, message or `ruleId` changes, and no new function joins `schema-refusals.ts`, which is the extension point being used rather than widened. The one rename is private. `ProjectRuntimeOptions` is untouched: a seam is not asked to declare that it publishes.

One `ruleId` reaches a caller on paths that could not refuse at all before. `seek`, `invalidate`, `setValues`, `overrideValues`, `setKeyframe`, `removeKeyframe`, `setTrigger`, `setStagger`, `mount` and `unmount` called from inside a commit hook or from inside a `writeValues`, `stageTrack`, `replaceMotionTrigger` or `setMotionStagger` seam all read `schema-commit-reentrant`. What a host that wants one of them does instead is queue it and ask once the call it is inside has returned, which is the same answer ADR-068 gave the structural half and needs no API of its own.

A caller may now rely on one thing it could not: a structural commit publishes exactly once, with the seeds `#derive` chose, and nothing can be placed in front of that publication to take it.

**`#inFlight`'s bound of zero or one is restored, by a different guard, and the state is not narrowed to it.** ADR-068 proved that bound from `#commit`'s refusal. ADR-069 withdrew it, because `compileTrack` calling `setValues` reached `#writeValues` and raised the depth a second time. This rung refuses exactly that call, and it is asked before `#boundary` is entered at all four direct writes, so every raiser now sits behind a guard that reads the field first and a depth of two is unreachable again. The field stays a counter. That bound has now been proved, withdrawn and re-proved across three slices with the state unchanged, which is the same argument ADR-068 made for refusing to narrow it, arriving for the second time: a flag would have been right, then wrong, then right again, and silently wrong for the whole of the middle. GUARDRAILS.md carries the general rule.

**A hook that reads is legal, and that is stated rather than implied.** `handle.definition`, `dependantsOf`, `instanceCount`, `tryTrack` and `tryMotion` all answer from the retained pair, which is one commit behind while a commit is in flight. That staleness is a documented consequence of the pair being held in a local rather than a defect, and `project-runtime.md`'s `## #adoptMaps` is where it is written down.

**Two issues are left open and named rather than absorbed.** Issue #306 still owns a throwing settle step, because `#mountNode` can also throw on an id `GraphRuntime.attach` refuses and because `addMotionTrack`, `disposeTrack` and `staged.commit()` are caller code with no reentrancy in sight; this slice removes one reachable cause and none of the others. Issue #309's four in-place write paths land on this rung, so what remains distinctly its own is the order between the refusal and the entry resolution: a write refused for a node the commit has already compiled must read `schema-commit-reentrant` and not a false `Unknown graph node "x"`.

## Clean architecture, DRY and SOLID

**Single responsibility.** `#refuseReentrant` owns whether a verb may run right now, `#boundary` owns the depth, `#apply` owns commit order, and `#invalidateOne` and `#apply`'s flush own publication. Four questions, four owners, and the rung answers one question rather than two: "is caller code mid-edit" has two spellings, not two subjects.

**DRY, and the duplication that was about to happen.** The tempting shape is two adjacent guards at ten call sites. The rung makes the ordering unrepeatable, and the DRY win is kept where it is real: one condition, one piece of state, one spelling, one refusal function.

**Open for extension.** Nothing is added to the refusal module and nothing is removed. The extension point is used rather than widened.

**Substitution.** The seams are host implementations of injected ports, so the answer may not depend on which seam it was, which is why the refusal is at the verb.

**Interface segregation.** Nothing is asked of a port. `ProjectRuntimeOptions` is untouched.

**Dependency inversion.** The refusal is made by the layer that owns the commit's publication order. Before it, the consequence was delivered by `PatchRegistry`'s dedupe -- a correct policy in a layer that owns deduplication and not commit lifecycle -- which is the same layering complaint ADR-067 made and ADR-069 made one tier down.

## Evidence

`RA-131` through `RA-135`. `structural-commit-flush.test.ts` owns the seed-and-flush contract, `RA-8` through `RA-13`, so the count and what each batch carried belong there; the ordering belongs beside the journal in `structural-commit-path.test.ts`. Pushed ahead of the source, so the red run is its own and can be cited by id.

- `RA-131`, `structural-commit-flush.test.ts`. A `compileTrack` hook that calls `runtime.invalidate([anExistingNode])` once. One flush per structural commit, pinned from inside, and the commit's own flush carries the node it added. It also carries its own accepting direction in the same rig: the same verb is called on the same node from outside the commit two lines earlier and is not refused.
- `RA-132`, same file. `runtime.seek` on the node being replaced, from a `stageTrack` hook, so the staged Track has not been committed when the seek resolves. This is the sharpest single measurement in the issue and it is a position rather than a value: the journal shows a `setProgress` reaching the displaced Track between the stage and its commit, and after the slice there is nothing between them.
- `RA-133`, same file. A hook that seeds the node the commit is _adding_, which names a node the candidate graph does not have. Refused by the same one condition, which does not read the seed, and the commit's own flush still publishes that node, so the fix does not cost `RA-9`'s publication.
- `RA-134`, `structural-commit-path.test.ts`. `runtime.mount(addedNodeId)` from a `compileTrack` hook, which is the issue's fifth reproduction shape. The mount is refused, `instanceCount` is what the commit alone made it, and the settle phase runs clean. Red on `Unknown graph node "hero/hand".` rather than on the `already mounted` the issue predicted, which is the correction in the Context above. Cross-referenced to #306 rather than claiming to close it.
- `RA-135`, same file, the accepting direction and the invariant. A hook that reads -- `handle.definition`, `dependantsOf`, `instanceCount`, `tryTrack` -- is untouched, because none of those is a publication or an edit, and one commit publishes exactly once with the seeds `#derive` chose. Written so it stays true after #306 makes the flush unconditional: it asserts exactly one batch carrying `touched`, not that a batch happened.

Four of five red, measured rather than predicted: run 33966081848 reports 4 failed and 960 passed, with `typecheck` and `format:check` green ahead of them, so every failure is an assertion that disagreed rather than a file that would not compile. Run 33966337062 is green on all seven required checks.

`RA-131` and `RA-133` fail on `intrusion accepted` where the refusal belongs. `RA-132` fails on the extra journal line `progress hero/arm 0.5`, sitting exactly between `stage hero/arm` and `stage-commit hero/arm`, which is this issue's sharpest claim confirmed at the position the case predicted: the seek reached the Track the commit was displacing, before the staged one was committed. `RA-134` fails on `reentry Unknown graph node "hero/hand".`, which is the Context's correction.

`RA-135` is green on both sides deliberately and the file says so, per the guardrail against padding a red count by asserting less in the case that could not fail.

## References

ADR-064 for the recipe refusal and the rung this renames, and its amendment of 2026-09-02 for the five verbs it put there. ADR-066 for why a publication in front of a deduplicating publisher takes the next one. ADR-067 for the commit lifecycle and the depth. ADR-068 for the refusal this reuses and the bound it withdrew. ADR-069 for the direct-write boundary that made four more raisers. Issues #298, #303, #305, #306, #307, #309 and #310.
