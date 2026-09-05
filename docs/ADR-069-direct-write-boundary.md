# ADR-069: A direct write is a boundary too, and one in-flight depth answers for every callback this class is inside

**Status:** Accepted, 2026-09-05. [Issue #305](https://github.com/chahyasantoso/motion5/issues/305).

## Context

ADR-067 named this case in writing while deciding something else, under **Widening the deferral to the four direct-hook write paths in the same slice**, and split it out for two stated reasons: those paths answer with a `PatchBatch` a caller reads, so what they answer after a disposal is a decision that record did not need in order to be correct about a commit; and the mechanism was meant to be widened by wrapping a second boundary in it rather than by copying a guard into four members. ADR-068 said the same thing from the other end when it refused to widen its own refusal.

This is that case. `#writeValues`, `#recompileKeyframes`, `#setTrigger` and `#setStagger` each call an injected seam and then mutate the retained pair **in place**, and none of them reaches `#commit`, so ADR-067's boundary could not see any of them. Every one of those seams is caller code, so every one of them may call `dispose()`.

Read off `766580f`, the four paths are not one shape. They are two, and the difference is what makes uniformity the constraint rather than a preference.

**Tier 2 threw, and it threw from the wrong layer.** `#writeValues` ended at an inline `this.#graph.invalidate([nodeId])`. A seam that disposed had already run the whole of `#teardown` synchronously -- both maps cleared, every instance detached, `#graph.dispose()` returned, `disposeComposition()` returned -- so the `set` that follows re-added an entry to a map the teardown had just emptied, the escalation built a compiled Track against a released composition, and the `invalidate` reached `GraphRuntime`'s own liveness check and handed the caller `Error: GraphRuntime is disposed.` That is the defect issue #288 corrected for `edit` and ADR-067 corrected for a commit, surviving on the one family of paths neither reached. `#recompileKeyframes` is the same defect with the build one line earlier, so it stages before it writes the map and commits the staged Track after: it both writes a map after caller code and builds a resource after it, which makes it the sharpest of the four.

**Tier 0 was silent.** `#setTrigger` and `#setStagger` call their seam, write into `#motions`, and return `void`. There is no flush, so nothing noticed: a caller whose `replaceMotionTrigger` hook disposed the project read a successful `setTrigger()` and held a disposed runtime with a Motion entry in it.

So the answer to this issue's uniformity constraint was not hypothetical. **The two tiers already answered one condition with two contracts**: one reported the layer that noticed, the other reported nothing at all. That is the rule ADR-061's amendment and ADR-056's amendment both already hold `#setTrigger` to, and it was broken in the loudest available way.

Both halves were unrecoverable for one reason: `dispose()` returns early on `#disposed`, so nothing would ever clear that entry, and `disposeComposition()` had already been called, so nothing would ever release the Track the escalation or the recompile built after it. And it contradicted an invariant another member relies on in writing -- `edit`'s own justification for dropping a staged pair is that a disposed runtime has cleared its retained pair, and ADR-064's amendment of 2026-09-04 states it as a reason rather than an aspiration.

## Decision

**A direct write is a boundary too.** All four paths run at the same in-flight depth ADR-067's commit boundary uses, so a seam that disposes defers the release past the write rather than into it. The write completes its phase, skips its flush, and reports `ProjectRuntime is disposed.` The release runs once, at the boundary, after the write has finished.

Every clause is ADR-067's own asymmetry read one tier down, which is what widening by wrapping was asking for.

**It completes its phase**, for the settle loop's reason. These paths have no revert either. A guard between the seam and the `set` leaves the mask on the compiled Track, the timeline patched and the retained definition disagreeing with both; a guard after the `set` leaves `#recompileKeyframes`' staged Track neither committed nor rolled back. Abandoning halfway is a leak dressed as a refusal, and the deferral is what makes completing safe: the graph and the composition are still live, so the escalation's `stageTrack`, its `commit()` and `#setProgress` all reach a live host and the release that follows cleans up what they produced.

**It skips its flush**, for the reason ADR-064's amendment of 2026-09-03 already gives and `#apply` already obeys: a batch nobody can read still opens, notifies every subscriber, moves the sequence and drains whatever a deferred flush was holding.

**It reports the disposal**, because the flush is what tier 2 answers with. A skipped flush cannot be answered honestly with a `PatchBatch`, and fabricating an empty one claims a publication that did not happen and is indistinguishable from a real no-op. There is no third thing to hand back, so the write reports, which is also issue #298's contract: a write reports the disposal rather than the staleness.

**The same string on all four**, so the two tiers stop answering one condition two ways. `#assertLive()`, the member that already exists, so there is no second message and no second error type.

### Where the state goes, and what it is called now

No new state. `#pendingTeardown` and `#teardown` are untouched.

**The drain gets one owner instead of five.** `#apply`'s `finally` was the only place that decremented and drained, and four more copies of those three lines is the shape issue #298 deleted seventeen of. So the raise, the decrement and the drain move into one member and every boundary calls it:

```text
#boundary(body) {
  this.#inFlight++;
  try {
    return body();
  } finally {
    this.#inFlight--;
    if (this.#inFlight === 0 && this.#pendingTeardown) this.#teardown();
  }
}
```

`#apply` wraps its whole body in it, which keeps the raise ahead of `#derive` for the reason ADR-067 gives about `resolveKeyframes`, and costs one closure per commit. Each of the four write paths wraps its own body at the outermost of the two, so nothing double-raises within one call: `#setKeyframe` reaches either `#writeValues` or `#recompileKeyframes` and never both, no direct write calls another, and none of them reaches `#commit`. The refusal a path owns stays **outside** the boundary, because a refused call is not inside a callback and has nothing to survive.

**`#committing` is renamed `#inFlight`.** It has five readers after this slice and one of them would be lying about what it counts: a live value write is not a commit and must never become one, which `project-runtime.md` states as a rule under `## #writeValues`. The field's meaning was always "this class is inside a callback it has to survive", and the rename says so. The depth stays a depth for ADR-068's reason, and that reason is now the only one it has: the bound of one is retired below.

### Where the report goes

**Tier 2: `#invalidateOne` owns the skip and the report.** It is already the value-tier flush owner, already shared by the recompile paths, and the one place both track paths can end. `this.#assertLive()` as its first statement is the skip and the report in one statement: a disposed runtime never reaches `invalidate`, so nothing publishes and the caller is told by the owner that decided rather than the layer that noticed. This required `#writeValues` to stop calling `this.#graph.invalidate([nodeId])` inline and route through the member `#recompileKeyframes` already used, which is a deduplication issues #309 and #310 both want anyway.

**Tier 0 asks `#assertLive()` as its last statement, twice.** `#setTrigger` and `#setStagger` have no flush and no shared tail; their only common statement is a write into a different map through a different seam. Two occurrences of a one-line guard whose contract is stated in one place is the floor, which is the reason `project-runtime.md` already gives for `#assertLive` being named twice under `## #writableMotion`. A rung invented to hold nothing but that line would be indirection for its own sake and a third owner of an order two records already own.

### The widening, owned rather than discovered

Sharing the counter widens `schema-commit-reentrant`: a structural verb called from inside a `writeValues`, `stageTrack`, `replaceMotionTrigger` or `setMotionStagger` seam is refused now, where it used to apply.

That is correct and this record owns it. `#writeValues` resolves its entry from the retained pair, calls the seam, and writes that entry back, so a commit made from inside the seam has its change to that node silently overwritten by the `set` that follows. It is ADR-068's lost update one indirection out, on the same four members issue #309 owns from the other direction. `RA-125` pins it, and it is the case a second counter would fail.

**The depth is no longer bounded at one, and the old bound's argument is retired rather than left standing.** ADR-068 could say the depth was provably zero or one because `#apply` had one call site and that call site refused a second entry. There are five raisers now, and a commit hook that calls a direct write is not refused by that guard: `compileTrack` calling `setValues` reaches `#writeValues`, which raises the depth a second time inside the commit's own window. A depth of two is therefore reachable, and the counter is what makes the drain correct at either. What that reachable path does to the flush it produces is [issue #310](https://github.com/chahyasantoso/motion5/issues/310) rather than this record's, and it is named here because a bound stated in prose and no longer true is exactly where a later hole hides.

## Alternatives rejected

**A second depth field for writes.** Two pieces of state for one condition, and two owners of when a release may happen, which is ADR-067's own rejection of a dedicated commit-state guard object. The widening above is the price of one owner and it is a correctness win rather than a cost.

**A liveness re-ask after each seam call, in each of the four members.** Forbidden by the issue in writing, and it is issue #298's defect. It also gets the answer wrong: a refusal between the seam and the `set` abandons a phase that has no revert.

**Routing these paths through `#commit` to inherit its boundary.** Refused by `project-runtime.md` under `## #writeValues` and by ADR-059 and ADR-060: it prices a mask at a candidate graph and a rebuild. Not a `#commit` caller, and it must not become one.

**Skipping the retained write when disposed.** Harmless either way, because the teardown that follows clears both maps, and worse as a contract: it makes the retained definition disagree with a composition the seam already changed, for a runtime nobody can observe. Completing the phase is one rule for all four; skipping one statement of it is a special case.

**Answering an empty `PatchBatch`.** A publication that did not happen, reported as one, and indistinguishable from a real no-op flush. `RA-117`'s precedent does not apply: a stale handle is a lifecycle object that can answer for itself, and a batch is the answer to this call.

**Refusing `dispose()` from a seam.** ADR-064's amendment of 2026-09-04 and ADR-067 both already refused this for the commit path, and `RA-110` keeps it refused. Teardown has to be reachable from a `catch`.

**Reusing `#pendingTeardown` as the guard.** It is not a guard, it is a record that a release is owed. One writer, one reader, unchanged.

**Keeping the name `#committing`.** A field read by a commit boundary and by four writes that must never become commits, named after one of its readers. The rename is the cheap half of not lying in the source.

## Consequences

No public surface moves: no export, type, schema, signature, message or `ruleId` changes, and `ProjectRuntimeOptions` gains nothing, because a seam is not asked to declare whether it disposes -- a seam that answered wrongly would be trusted.

A caller may now rely on three things it could not. A seam may dispose from any of the four direct writes without leaving the runtime holding an entry the teardown already cleared, and without the resource that write built afterwards being unreachable by any later release. The error it reads names `ProjectRuntime` rather than `GraphRuntime`, so **`Error: GraphRuntime is disposed.` is unreachable through a direct write as well as through a commit** -- the one-line property a future edit can be checked against. And tier 0 stops answering silently: `setTrigger` and `setStagger` report the same string tier 2 reports.

One condition gains a refusal it did not have: a structural verb called from inside one of the four seams now reads `schema-commit-reentrant`, which is why ADR-068 gains an amendment rather than a pointer.

ADR-067 gains a one-line pointer and stays true of the slice that wrote it: it owns commit lifecycle against resource lifetime and named this split out by name, and nothing in it goes stale except the spelling of one field.

[GUARDRAILS.md](./GUARDRAILS.md) gains one rule, the general form of the argument above.

## Evidence

Cases in the tier that owns each path rather than one new file. `LV-14` was already declared in `packages/core/test/unit/domain/track-live-values.test.ts`, which the plan on the issue did not account for, so this slice takes **`LV-15`, `LV-16`, `LV-17`, `RA-123`, `RA-124` and `RA-125`** and leaves `RA-126` onward to issue #306. Red run 33960837701, green run 33961345868.

The three tier 2 cases share one bare-runtime rig in `live-value-updates.test.ts`, and that is a deviation from the issue's "cases in the tier that owns each path" taken deliberately: `Engine` wires its own `stageTrack`, so a disposing seam cannot be spied into the composition-backed rig and has to be injected at construction. Placing the recompile case in `keyframe-property-edit.test.ts` as the plan proposed would have meant a third copy of that rig in a third file. `disposeComposition` is the instrument, because `#teardown` calls it last, so its position in an ordered journal is the whole teardown's position.

- `LV-15` a `writeValues` seam that disposes. The message is `ProjectRuntime is disposed.` and not `GraphRuntime is disposed.`, `graph.invalidate` is never called so nothing published, the journal shows the write completing before the release, and a second explicit `dispose()` adds no second teardown.
- `LV-16` the escalation half, through the declining backend, so `stageTrack`, its `commit()` and `#setProgress` all run after the disposal. The leak measured as an ordering rather than as a counter: the release is last in the journal rather than second.
- `LV-17` `#recompileKeyframes` with a disposing `stageTrack`. Asserts `commit` before `release`; before the slice the release sits between the stage and the commit.
- `RA-123` and `RA-124` the two tier 0 seams, on the other map and a different order, and the half that was silent. Both assert the string tier 2 answers, which is where uniformity is measured rather than asserted twice.
- `RA-125` the widening. A seam that starts a structural commit instead of disposing reads `schema-commit-reentrant`.

Six of six red, and the assertions that are green on both sides are labelled in the files rather than counted: `LV-15`'s exactly-once release is true before and after, because `dispose()` was always one-shot.
