# ADR-068: A commit in flight refuses a second one, and the boundary that owns the commit is what refuses it

**Status:** Accepted, 2026-09-05. [Issue #307](https://github.com/chahyasantoso/motion5/issues/307).

## Context

ADR-067 named this case twice while deciding something else. Its `#committing` paragraph chose a depth
rather than a flag because a hook can re-enter `#apply` through a public entry point, and said in the
same sentence the reentrancy was a defect of its own and issue #307's, not that record's.
`project-runtime.md` said it from other end: `#commit` never answered whether it may be entered while a
commit is in flight.

This is that case, a decision not a mechanism, because state it needs shipped with ADR-067.

A composition hook is caller code. `compileTrack`, `createMotion`, `stageTrack`, `replaceMotionTrack`,
`addMotionTrack` can each call `runtime.addTrack(...)`, `runtime.addMotion(...)`, `destroyMotion`,
`adopt`, `destroyAdopted`, a handle's `replace()` or `remove()`, or any of six authored verbs routing
through `#replaceTrack`. All reach `#commit`.

Neither existing refusal sees it. `#refuseInsideRecipe` reads `#open`, and `#open` is `undefined` by
construction inside `#apply` — ADR-067 states that as load-bearing: it bounds a deferred teardown's
window to a commit with no recipe open. `nestedTransaction` reads same field. So every structural entry
point was fully open to a hook a commit was running, inner commit found no open transaction, applied
immediately:

1. outer `#apply` holds candidate pair in a local, `#tracks` still retained map;
2. inner `#stageTracks()` sees `#open === undefined`, answers `new Map(this.#tracks)` → outer commit's
   staged entry absent;
3. inner `#derive` compares that against `#tracks`, applies effects, `replaceGraph` commits a snapshot
   carrying inner change not outer;
4. inner `#adoptMaps` sets `#tracks` to that pair;
5. control returns to outer loop, finishes effects, commits snapshot built from own local — outer change
   yes, inner no;
6. outer `#adoptMaps` overwrites inner pair.

A lost update. Inner add gone from retained pair and committed graph while composition already compiled
it, registered it with its Motion, mounted it → compiled Track and mounted instance exist that no map and
no graph node refers to, so nothing will ever dispose them. Outer commit's `#derive` stale by step 5 as
well: removal category and `touched` seeds described a pair inner commit had already replaced.

Reachable with no disposal involved → record of its own, not a paragraph in ADR-067.

## Decision

**A structural entry point is not reachable while a commit is in flight. `#commit` refuses it, by name, once, and nothing else in the class learns about the condition.**

Whole behaviour = one line in the member issue #307 names as owner:

```text
#commit(plan) {
  if (this.#open !== undefined) return;
  if (this.#committing > 0) commitInFlight();
  this.#apply(plan);
}
```

**Refusal is its own family, `schema-commit-reentrant`, names condition not verb.** ADR-064 names verb in
`schema-transaction-immediate` because caller wrote both `edit()` and call and must know which to move.
Here caller wrote a hook and a commit called it: every structural verb refused equally, remedy is about
the hook not which verb it chose, and a per-verb spelling costs a string literal at six call sites to
tell a reader what stack already says. One condition, one contract, one message.

**Refused rather than merged — merge is direction issue asked measured first.** DRY one on its face:
project already represents a staged pair that reads resolve against, `#readTracks` already resolves
against it, commit in flight = that with one difference. Difference is whole answer. `#apply` holds pair
in a **local**, not a field → nothing for reader to resolve against without publishing that local into a
second staging field with second lifetime and second owner of when cleared. And `#open` means a recipe may
stage into this pair, which a commit cannot honour: a recipe can accept a second change because nothing
applied yet, while a commit already ran `#derive` against a comparison of two pairs and already applied
effects derived from it. Accepting inner change honestly = re-deriving outer effect list, un-applying part
now wrong, re-asking graph — a second commit protocol inside first. So reusing that field gives one
accessor two incompatible meanings depending which member set it: invisible-context shape ADR-064 cut
`setMotion` and `setTrack` for. DRY win kept where real: one condition, one piece of state, one spelling,
one call site.

**Read after recipe check, never before.** Recipe opened inside a hook stages into own pair exactly as
always, refused once at moment it tries to apply. So `edit` gains no third entry check, `nestedTransaction`
keeps one meaning, refusal has one owner not two. Nothing staged is applied: every immediate verb inside a
recipe is already refused by name, every structural one only builds a map → throw drops pair and nothing
else.

**Both phases refuse; asymmetry with ADR-067 deliberate.** That record guards effect loop, never settle
loop, because settle step has no revert. This refuses from either. Settle-phase re-entry happens after
`#adoptMaps`, so it would stage from a pair carrying outer change and lose nothing, refused anyway for two
reasons. Settle steps still queued were derived against pair inner commit would replace, and capture
`staged` locals and node ids from that comparison → inner removal leaves next `#mountNode` attaching node
committed graph no longer has: failure in one phase with no revert list and, as of issue #306, no error
boundary. And a refusal naming a phase would not be one condition: commit in flight = one field, commit in
flight and not yet adopted = two, making contract depend which hook host wired.

**What caller reads is hook's own choice; both directions pinned, not decided here.** Hook letting refusal
escape fails effect it is part of → lands in `#apply`'s existing `catch`, existing rollback runs in apply
order, `rejectAfterRollback` rethrows untouched: ADR-035 precedence unchanged, throwing effect not reverted
because effect counts as applied only once call returned. Hook catching it reported refusal to itself,
outer commit completes whole. Neither a new contract — both consequences of existing rules.

**`#committing` stays a depth.** After this slice provably zero or one: only path into `#apply` is `#commit`
and `#commit` refuses second entry. Bound belongs to guard not field: counter correct at any depth, flag
correct only while guard holds → narrowing state to weaker thing fix makes sufficient is how later hole
becomes silent instead of loud. ADR-067 chose depth against this issue by name; choice kept, reason
updated. Bound did not survive next slice — that is the amendment at end of this record, and the case for
having refused to narrow.

**`GraphRuntime` and `PatchRegistry` stop being layers that could notice.** ADR-067's sharpest claim asked
of a second condition, property to check future edits against: no layer below consulted about whether a
commit may start, none can observe a nested one, because no such thing exists anymore.

## Alternatives rejected

**Making a commit look like an open transaction.** The Decision above. Direction issue named worth
measuring first, refused on measurement not taste: representation it would reuse carries invariant a
commit cannot honour, and local it would publish is what makes invariant false.

**Reusing `schema-transaction-immediate`.** One message answering two conditions with two remedies,
carrying verb name that is half which does not apply. ADR-064's rule — one condition, one failure contract —
cuts this both ways.

**Guard at each structural entry point.** Refused by issue in writing and by guardrails: order enforced by
convention at n call sites is enforced at first only, n+1st added later wrong by default. Defect issue #298
deleted seventeen copies of.

**Guard on `#apply`.** Refused by issue, correctly: member runs one commit, should not know whether it is
outer one. Its `try` already owns ordering three records make load-bearing, ADR-031, ADR-035 and ADR-045 →
second question there = second subject.

**Refusing at `edit`'s entry as well.** Recipe opened inside hook runs before refused, reads like waste
worth fixing. Not: second reader of this condition, to save recipe that applies nothing, is two owners of
one refusal, and recipe's side effects are its caller's, not this member's.

**Narrowing `#committing` to boolean.** The Decision above.

**Handing hook a narrowed runtime instead.** Narrowed surface handed to callback is not fence: callback
closes over thing it was narrowed from — exactly how `seek`, `mount`, `unmount`, `invalidate`, `signal`
went on applying immediately inside a recipe while both in-place tiers refused. Guardrails own that one.

**Widening to paths that never reach `#commit`.** Two found reading `#apply` for this, filed not absorbed.
[Issue #309](https://github.com/chahyasantoso/motion5/issues/309): in-place write from a hook discarded by
`#adoptMaps` while mask, patched timeline and seam call all stand, `overlay` and `liveWrite` with it.
[Issue #310](https://github.com/chahyasantoso/motion5/issues/310): flush from a hook publishes against graph
commit is replacing, `samePatch` then drops commit's own publication rather than adding. Neither reaches
`#commit` → neither covered by this guard, neither a dependency of it. Both this shape one indirection out;
mechanism here meant to widen by wrapping a second boundary in it, not by copying condition into four
members — what ADR-067 already said about widening.

## Consequences

No public surface moves: no export, type, schema, signature, message or `ruleId` changes,
`ProjectRuntimeOptions` gains nothing — a hook is not asked to declare whether it re-enters. One new
`ruleId` reaches a caller, `schema-commit-reentrant`, on a path that could not refuse at all before.

Caller may now rely on one thing it could not: structural commit lands whole or rolls back whole, no second
commit nested inside one. Composition hook that structurally edits is told at the call instead of one of two
changes silently discarded, and compiled, registered, mounted node nothing refers to no longer reachable
this way.

Host wanting to edit from a hook instead queues edit, makes it once commit returned — `RA-122` is the
accepting direction for that. Not a workaround this record owes API for: hook is called to put resource in
place for commit running, structural edit from inside one = second transaction wearing a callback.

`#committing` read by two members now rather than one, both for same fact. Nothing else about ADR-067
moves; its paragraph naming this issue is correct about risk and now points at closed decision. ADR-069
renames field `#inFlight`, gives it five readers — amendment below.

## Evidence

`RA-118` through `RA-122` in `packages/core/test/unit/runtime/structural-commit-path.test.ts`, which
already owns `RA-1` through `RA-7` and `RA-114` through `RA-117`, already injects every hook a commit
reaches, already carries one ordered journal this needs. Pushed ahead of source → red run is own and
citable by id.

Rig gains one `reenter` config — hook it fires from, closure making call, whether hook swallows what comes
back — and `DisposingHook` becomes `CommitHook`, because two behaviours now name same five hooks and a
second list would be second owner disagreeing about which phase a name belongs to. Re-entry fires once:
issue's own reproduction shape, not convenience. Without it pre-slice run recurses through same hook until
stack goes, and red run must fail on an assertion that disagreed.

- `RA-118` effect-phase refusal, from `compileTrack`, not swallowed. Outer verb's caller reads message
  whole, journal is compile + refusal and nothing else, inner add reached no hook, neither node in graph or
  retained pair, nothing mounted. Also pins compiled Track not disposed: hook threw before its effect
  returned → absence is `RA-2`'s contract, not leak this slice introduced.
- `RA-119` lost update from side that used to lose it: same re-entry, swallowed. Outer commit completes
  whole, committed graph + retained pair carry outer node not inner and agree by identity, one node
  mounted, sequence moved exactly once. Before slice: inner node compiled and mounted with nothing
  referring to it, flush count two.
- `RA-120` version where two commits disagree about one node rather than a set — issue's fifth
  reproduction shape: a `replace()` whose `replaceMotionTrack` hook removes node being replaced. Same
  refusal, staged replacement rolled back and never committed, retained definition unmoved, both pairs
  still agreeing.
- `RA-121` settle phase, from `addMotionTrack`, swallowed. Same message, phase completes past refusal
  rather than abandoned at it — where asymmetry with ADR-067's effect loop is measured.
- `RA-122` accepting direction, same rig, green on both sides deliberately. Reads from inside hook not
  refused, answer from retained pair — fact refusal rests on, not side effect of it, and same call the four
  cases above are refused for applies once commit returned. Case a guard reading "this runtime has
  committed" fails, and case a guard placed on reading ladder fails.

Four of five red, reported not engineered. `RA-122` cannot fail before slice and file says so — guardrail
against padding red count by asserting less in case that could not fail.

## Amendment, 2026-09-05: the refusal fires for a condition this record did not name, and the depth's bound is withdrawn

[ADR-069](./ADR-069-direct-write-boundary.md) makes four direct writes boundaries at same in-flight depth,
reaching this record from two directions. Both widenings not reversals: Decision above unchanged, every
case cited for it unchanged.

**`schema-commit-reentrant` now refuses structural verb called from inside a `writeValues`, `stageTrack`,
`replaceMotionTrigger` or `setMotionStagger` seam**, where this record's guard could not see one — those
four paths never reach `#commit`. **Widening this to the paths that never reach `#commit`** alternative
above filed exactly that as issue #309's and issue #310's and predicted mechanism would widen by wrapping;
it did, and one consequence is refusal on condition named nowhere in this record. Same lost update one
indirection out: `#writeValues` resolves entry from retained pair, calls seam, writes entry back → commit
made from inside seam has its change to that node overwritten by following `set`. `RA-125` pins it, and it
is case a second, separate depth field would have failed.

**Bound of zero or one withdrawn.** Decision's `#committing` paragraph argues depth provably zero or one
because only path into `#apply` is `#commit`. Five raisers now, and commit hook calling direct write is not
refused by this guard: `compileTrack` calling `setValues` reaches `#writeValues`, raises depth second time
inside commit's own window. Depth of two reachable, deliberately; drain correct at either because state is
counter. That is argument for having refused to narrow it, arriving one slice later than refusal: flag
would have been correct only while bound nobody re-checked held. What reachable path does to flush it
produces is issue #310's, not this record's.

Field spelled `#inFlight` from that slice onward, reason ADR-069 gives: field read by a commit boundary and
by four writes that must never become commits cannot be named after one reader. Every occurrence of
`#committing` above is historical, names same state.

## Amendment, 2026-09-05: the refusal reaches a second verb family, and the withdrawn bound is restored

[ADR-070](./ADR-070-one-reentrancy-rung.md) gives this record's refusal a second rung.
`schema-commit-reentrant` now also refuses `seek`, `invalidate`, `overrideValues`, `setValues`,
`setKeyframe`, `removeKeyframe`, `setTrigger`, `setStagger`, `mount`, `unmount` called from inside a commit
hook or inside one of four seams ADR-069 made boundaries. Name, `ruleId`, message stay this record's,
unchanged; no case anchored on that string moves. Own name `schema-publish-reentrant` refused for reason
**Reusing `schema-transaction-immediate`** alternative above gives, read in other direction: one condition
with two rules is boundary somebody must document and will get wrong, and a `PatchBatch` return type is
difference in what verb would have answered, not in condition.

**Decision's claim that `#commit` is one place all of them reach is narrowed, not corrected.** It is one
place every _structural_ verb reaches — what that sentence was about, still exactly true. Ten verbs above
reach no commit at all, so no member all fifteen pass through; honest floor is two rungs reading one field,
handing out one refusal. Third member both rungs called, so condition had one reader, would read one field
and throw: that member is `commitInFlight`, already exists.

**Bound of zero or one restored, state still not narrowed to it.** Amendment above withdrew because
`compileTrack` calling `setValues` reached `#writeValues`, raised depth second time inside commit's window.
ADR-070's rung refuses that call, asked before `#boundary` entered at all four direct writes → every raiser
now behind guard reading field first, depth two unreachable. `#inFlight` stays counter. Decision's argument
for refusing to narrow now vindicated twice not once: bound proved, withdrawn, re-proved across three slices
with state unchanged; flag would have been right, then wrong, then right again — silently wrong whole middle.

**Alternative this record filed is closed.** **Widening this to the paths that never reach `#commit`** named
issue #309 and issue #310, predicted mechanism would widen by wrapping rather than copying condition into
four members. Both halves happened, one slice each: ADR-069 wrapped boundary, ADR-070 widened rung. Issue
#309 is what is left, now an ordering rather than a missing refusal.
