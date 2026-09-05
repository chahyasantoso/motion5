# ADR-068: A commit in flight refuses a second one, and the boundary that owns the commit is what refuses it

**Status:** Accepted, 2026-09-05. [Issue #307](https://github.com/chahyasantoso/motion5/issues/307).

## Context

ADR-067 named this case twice while deciding something else. Its `#committing` paragraph chose a depth rather than a flag because a hook can re-enter `#apply` through a public entry point, and said in the same sentence that the reentrancy was a defect of its own and issue #307's rather than that record's. `project-runtime.md` said it from the other end: what `#commit` did not answer was whether it may be entered while a commit is already in flight.

This is that case, and it is a decision rather than a mechanism, because the state it needs shipped with ADR-067.

A composition hook is caller code. Every one of `compileTrack`, `createMotion`, `stageTrack`, `replaceMotionTrack` and `addMotionTrack` can call `runtime.addTrack(...)`, `runtime.addMotion(...)`, `destroyMotion`, `adopt`, `destroyAdopted`, a handle's `replace()` or `remove()`, or any of the six authored verbs that route through `#replaceTrack`. Every one of those reaches `#commit`.

Neither existing refusal sees it. `#refuseInsideRecipe` reads `#open`, and `#open` is `undefined` by construction inside `#apply` -- a fact ADR-067 states as load-bearing, because it is what bounds a deferred teardown's window to a commit with no recipe open. `nestedTransaction` reads the same field. So every structural entry point was fully open to a hook a commit was running, and the inner commit found no open transaction and applied immediately:

1. the outer `#apply` holds its candidate pair in a local, and `#tracks` is still the retained map;
2. the inner `#stageTracks()` sees `#open === undefined` and answers `new Map(this.#tracks)`, so the outer commit's staged entry is absent from it;
3. the inner `#derive` compares that against `#tracks`, applies its effects, and `replaceGraph` commits a snapshot carrying the inner change and not the outer one;
4. the inner `#adoptMaps` sets `#tracks` to that pair;
5. control returns to the outer loop, which finishes its effects and commits a snapshot built from its own local, carrying the outer change and not the inner one;
6. the outer `#adoptMaps` overwrites the inner pair.

A lost update. The inner add is gone from the retained pair and from the committed graph while the composition has already compiled it, registered it with its Motion and mounted it, so a compiled Track and a mounted instance exist that no map and no graph node refers to, and therefore nothing that will ever dispose them. The outer commit's `#derive` was stale by step 5 as well: its removal category and its `touched` seeds described a pair the inner commit had already replaced.

Reachable with no disposal involved, which is why it is a record of its own rather than a paragraph in ADR-067.

## Decision

**A structural entry point is not reachable while a commit is in flight. `#commit` refuses it, by name, once, and nothing else in the class learns about the condition.**

The whole of the behaviour is one line in the member issue #307 names as the owner:

```text
#commit(plan) {
  if (this.#open !== undefined) return;
  if (this.#committing > 0) commitInFlight();
  this.#apply(plan);
}
```

**The refusal is its own family, `schema-commit-reentrant`, and it names the condition rather than the verb.** ADR-064 names the verb in `schema-transaction-immediate` because the caller wrote both the `edit()` and the call and has to know which of the two to move. Here the caller wrote a hook and a commit called it: every structural verb is refused equally, the remedy is about the hook rather than about which verb it chose, and a per-verb spelling would cost a string literal at six call sites to tell a reader what the stack already says. One condition, one contract, one message.

**Refused rather than merged, and the merge is the direction the issue asked to be measured first.** It is the DRY one on its face: this project already has a representation for a pair being staged that reads must resolve against, `#readTracks` already resolves against it, and a commit in flight is that with one difference. The difference is the whole answer. `#apply` holds its pair in a **local**, not in a field, so there is nothing for a reader to resolve against without publishing that local into a second staging field with a second lifetime and a second owner of when it is cleared. And `#open` means a recipe may stage into this pair, which a commit cannot honour: a recipe can accept a second change because nothing has been applied yet, while a commit has already run `#derive` against a comparison of two pairs and has already applied effects derived from it. Accepting an inner change honestly would mean re-deriving the outer effect list, un-applying the part now wrong and re-asking the graph, which is a second commit protocol inside the first. So reusing that field would give one accessor two incompatible meanings depending on which member set it, which is the invisible-context shape ADR-064 cut `setMotion` and `setTrack` for. The DRY win is kept where it is real: one condition, one piece of state, one spelling, one call site.

**Read after the recipe check and never before it.** A recipe opened from inside a hook stages into its own pair exactly as it always did, and is refused once, at the moment it tries to apply. So `edit` gains no third entry check, `nestedTransaction` keeps its one meaning, and this refusal has one owner rather than two. Nothing that recipe staged is applied, because every immediate verb inside a recipe is already refused by name and every structural one only builds a map, so the throw drops a pair and nothing else.

**Both phases refuse, and the asymmetry with ADR-067 is deliberate.** That record guards the effect loop and never the settle loop, because a settle step has no revert. This one refuses from either. A settle-phase re-entry happens after `#adoptMaps`, so it would stage from a pair that does carry the outer change and would lose nothing, and it is refused anyway for two reasons. The settle steps still queued were derived against the pair the inner commit would replace, and they capture `staged` locals and node ids from that comparison, so an inner removal leaves the next `#mountNode` attaching a node the committed graph no longer has: a failure in the one phase with no revert list and, as of issue #306, no error boundary. And a refusal that had to name a phase would not be one condition. A commit being in flight is one field; a commit being in flight and not yet adopted is two, and it would make the contract depend on which hook the host happened to wire.

**What the caller reads is the hook's own choice, and both directions are pinned rather than decided here.** A hook that lets the refusal escape fails the effect it is part of, so it lands in `#apply`'s existing `catch`, the existing rollback runs in apply order, and `rejectAfterRollback` rethrows it untouched: ADR-035's precedence is unchanged, and the effect that threw is not reverted, because an effect counts as applied only once its call returned. A hook that catches it has reported the refusal to itself, and the outer commit completes whole. Neither is a new contract, because both are consequences of rules that already exist.

**`#committing` stays a depth.** After this slice it is provably zero or one, because the only path into `#apply` is `#commit` and `#commit` refuses the second entry. That bound belongs to the guard rather than to the field: a counter is correct at any depth, and a flag would be correct only while this guard holds, so narrowing the state to the weaker thing the fix makes sufficient is how a later hole becomes silent instead of loud. ADR-067 chose the depth against this issue by name; the choice is kept and its reason is updated. The bound itself did not survive the next slice, which is the amendment at the end of this record and the case for having refused to narrow the state.

**`GraphRuntime` and `PatchRegistry` stop being the layers that could notice.** That is ADR-067's sharpest claim asked of a second condition, and it is the property to check a future edit against: no layer below this one is consulted about whether a commit may start, and none of them can observe a nested one, because there is no longer such a thing.

## Alternatives rejected

**Making a commit look like an open transaction.** The Decision above. The direction the issue named as worth measuring first, refused on the measurement rather than on taste: the representation it would reuse carries an invariant a commit cannot honour, and the local it would have to publish is the thing that makes the invariant false.

**Reusing `schema-transaction-immediate`.** One message answering two conditions with two remedies, carrying a verb name that is the half which does not apply. ADR-064's rule that one condition has one failure contract cuts this both ways.

**A guard at each structural entry point.** Refused by the issue in writing and by the guardrails: an order enforced by convention at n call sites is enforced at the first of them only, and the n+1st, added later, is wrong by default. It is the defect issue #298 deleted seventeen copies of.

**A guard on `#apply`.** Refused by the issue, and correctly: that member runs one commit and should not have to know whether it is the outer one. Its `try` already owns an ordering three records make load-bearing, ADR-031, ADR-035 and ADR-045, and a second question there is a second subject.

**Refusing at `edit`'s entry as well.** A recipe opened inside a hook runs before it is refused, which reads like waste worth fixing. It is not: a second reader of this condition, to save a recipe that applies nothing, is two owners of one refusal, and the recipe's own side effects are its caller's rather than this member's.

**Narrowing `#committing` to a boolean.** The Decision above.

**Handing a hook a narrowed runtime instead.** A narrowed surface handed to a callback is not a fence: the callback closes over the thing it was narrowed from, which is exactly how `seek`, `mount`, `unmount`, `invalidate` and `signal` went on applying immediately inside a recipe while both in-place tiers refused. The guardrails own that one already.

**Widening this to the paths that never reach `#commit`.** Two were found while reading `#apply` for this and are filed rather than absorbed. [Issue #309](https://github.com/chahyasantoso/motion5/issues/309): an in-place write from a hook is discarded by `#adoptMaps` while the mask, the patched timeline and the seam call all stand, and `overlay` and `liveWrite` go with it. [Issue #310](https://github.com/chahyasantoso/motion5/issues/310): a flush from a hook publishes against the graph the commit is replacing, and `samePatch` then drops the commit's own publication rather than adding to it. Neither reaches `#commit`, so neither is covered by this guard and neither is a dependency of it. Both are this shape one indirection out, and the mechanism here is meant to be widened by wrapping a second boundary in it rather than by copying a condition into four members, which is what ADR-067 already said about widening.

## Consequences

No public surface moves: no export, type, schema, signature, message or `ruleId` changes, and `ProjectRuntimeOptions` gains nothing, because a hook is not asked to declare whether it re-enters. One new `ruleId` reaches a caller, `schema-commit-reentrant`, on a path that could not refuse at all before.

A caller may now rely on one thing it could not: a structural commit either lands whole or is rolled back whole, and no second commit can be nested inside one. A composition hook that structurally edits is told so at the call rather than having one of two changes silently discarded, and a compiled, registered and mounted node that nothing refers to is no longer reachable this way.

What a host that wants to edit from a hook does instead is queue the edit and make it once the commit returned, which `RA-122` is the accepting direction for. That is not a workaround this record owes an API for: a hook is called to put a resource in place for the commit that is running, and a structural edit from inside one is a second transaction wearing a callback.

`#committing` is read by two members now rather than one, and both read it for the same fact. Nothing else about ADR-067 moves, and its paragraph naming this issue is correct about the risk and now points at a closed decision. ADR-069 renames that field `#inFlight` and gives it five readers, which is the amendment below.

## Evidence

`RA-118` through `RA-122` in `packages/core/test/unit/runtime/structural-commit-path.test.ts`, which already owns `RA-1` through `RA-7` and `RA-114` through `RA-117`, already injects every hook a commit reaches, and already carries the one ordered journal this needs. Pushed ahead of the source, so the red run is its own and can be cited by id.

The rig gains one `reenter` config -- the hook it fires from, a closure making the call, and whether the hook swallows what comes back -- and `DisposingHook` becomes `CommitHook`, because two behaviours now name the same five hooks and a second list of them would be a second owner that can disagree about which phase a name belongs to. The re-entry fires once, which is the issue's own reproduction shape rather than a convenience: without it the pre-slice run recurses through the same hook until the stack goes, and a red run has to fail on an assertion that disagreed.

- `RA-118` the effect-phase refusal, from `compileTrack`, not swallowed. The outer verb's caller reads the message whole, the journal is the compile and the refusal and nothing else, the inner add reached no hook at all, neither node is in the graph or the retained pair, and nothing is mounted. It also pins that the compiled Track is not disposed, because the hook threw before its effect returned, so the absence is `RA-2`'s contract rather than a leak this slice introduced.
- `RA-119` the lost update from the side that used to lose it: the same re-entry, swallowed. The outer commit completes whole, the committed graph and the retained pair carry the outer node and not the inner one and agree by identity, one node is mounted, and the sequence moved exactly once. Before this slice the inner node is compiled and mounted with nothing referring to it, and the flush count is two.
- `RA-120` the version where the two commits disagree about one node rather than about a set, which is the issue's fifth reproduction shape: a `replace()` whose `replaceMotionTrack` hook removes the node being replaced. Same refusal, the staged replacement rolled back and never committed, the retained definition unmoved, and both pairs still agreeing.
- `RA-121` the settle phase, from `addMotionTrack`, swallowed. Same message, and the phase completes past the refusal rather than being abandoned at it, which is where the asymmetry with ADR-067's effect loop is measured.
- `RA-122` the accepting direction, in the same rig, green on both sides deliberately. Reads from inside a hook are not refused and answer from the retained pair, which is the fact the refusal rests on rather than a side effect of it, and the same call the four cases above are refused for applies once the commit has returned. It is the case a guard reading "this runtime has committed" fails, and the case a guard placed on the reading ladder fails.

Four of five red, reported rather than engineered. `RA-122` cannot fail before the slice and the file says so, which is the guardrail against padding a red count by asserting less in the case that could not fail.

## Amendment, 2026-09-05: the refusal fires for a condition this record did not name, and the depth's bound is withdrawn

[ADR-069](./ADR-069-direct-write-boundary.md) makes the four direct writes boundaries at the same in-flight depth, which reaches this record from two directions. Both are widenings rather than reversals: the Decision above is unchanged, and so is every case cited for it.

**`schema-commit-reentrant` now refuses a structural verb called from inside a `writeValues`, `stageTrack`, `replaceMotionTrigger` or `setMotionStagger` seam**, where before this record's guard could not see one, because those four paths never reach `#commit`. The **Widening this to the paths that never reach `#commit`** alternative above filed exactly that as issue #309's and issue #310's and predicted the mechanism would be widened by wrapping; it was, and one consequence is a refusal on a condition named nowhere in this record. It is the same lost update one indirection out: `#writeValues` resolves its entry from the retained pair, calls the seam, and writes that entry back, so a commit made from inside the seam has its change to that node overwritten by the `set` that follows. `RA-125` pins it, and it is the case a second, separate depth field would have failed.

**The bound of zero or one is withdrawn.** The Decision's `#committing` paragraph argues that the depth is provably zero or one because the only path into `#apply` is `#commit`. There are five raisers now, and a commit hook that calls a direct write is not refused by this guard: `compileTrack` calling `setValues` reaches `#writeValues`, which raises the depth a second time inside the commit's own window. A depth of two is reachable, deliberately, and the drain is correct at either because the state is a counter. That is the argument for having refused to narrow it, arriving one slice later than the refusal: a flag would have been correct only while a bound nobody re-checked still held. What the reachable path does to the flush it produces is issue #310's rather than this record's.

The field is spelled `#inFlight` from that slice onward, for the reason ADR-069 gives: a field read by a commit boundary and by four writes that must never become commits cannot be named after one of its readers. Every occurrence of `#committing` above is historical and names the same state.

## Amendment, 2026-09-05: the refusal reaches a second verb family, and the withdrawn bound is restored

[ADR-070](./ADR-070-one-reentrancy-rung.md) gives this record's refusal a second rung. `schema-commit-reentrant` now also refuses `seek`, `invalidate`, `overrideValues`, `setValues`, `setKeyframe`, `removeKeyframe`, `setTrigger`, `setStagger`, `mount` and `unmount` when one is called from inside a commit hook or from inside one of the four seams ADR-069 made boundaries. The name, the `ruleId` and the message are this record's, unchanged, and no case anchored on that string moves. A name of its own, `schema-publish-reentrant`, was refused for the reason the **Reusing `schema-transaction-immediate`** alternative above gives read in the other direction: one condition with two rules is a boundary somebody has to document and will get wrong, and a `PatchBatch` return type is a difference in what the verb would have answered rather than in the condition.

**The Decision's claim that `#commit` is the one place all of them reach is narrowed rather than corrected.** It is the one place every _structural_ verb reaches, which is what that sentence was about and is still exactly true. The ten verbs above reach no commit at all, so no member exists that all fifteen pass through, and the honest floor is two rungs reading one field and handing out one refusal. A third member both rungs called, so the condition had one reader, would read one field and throw: that member is `commitInFlight`, and it already exists.

**The bound of zero or one is restored, and the state is still not narrowed to it.** The amendment above withdrew it because `compileTrack` calling `setValues` reached `#writeValues` and raised the depth a second time inside the commit's own window. ADR-070's rung refuses that call, and it is asked before `#boundary` is entered at all four direct writes, so every raiser now sits behind a guard that reads the field first and a depth of two is unreachable. `#inFlight` stays a counter. The Decision's argument for refusing to narrow it has now been vindicated twice rather than once: the bound has been proved, withdrawn and re-proved across three slices with the state unchanged, and a flag would have been right, then wrong, then right again, silently wrong for the whole of the middle.

**And the alternative this record filed is closed.** **Widening this to the paths that never reach `#commit`** named issue #309 and issue #310, and predicted the mechanism would be widened by wrapping rather than by copying a condition into four members. Both halves happened, one slice each: ADR-069 wrapped the boundary, and ADR-070 widened the rung. Issue #309 is what is left, and it is now an ordering rather than a missing refusal.
