# ADR-066: a load and a mount publish nothing, and a declined build still drops the live write

## Status

Accepted. Closes part 6 of the re-review of issue #223, which is the last part of that issue with
anything owed in it.

## Context

Part 6 sorts what issue #223 did not implement into what was closed by decision and what is
genuinely open. The first list is settled and nothing is owed for it: `setMotion` and `setTrack` cut,
`keyframe-key-animated` never added, 7b's second half refused inside A3, issue #222's stateful
interpolator refused, and `templates` deleted and refused. The second list has two entries, and both
of them turn out to be a claim nobody had measured.

Issue #176 is one of them, and it is closed. It was completed by PR #178 on 21 August, which landed
the staged replacement, so the compile-after-commit ordering it was opened for has been fixed for two
weeks while part 6 and `SESSION-STATUS.md` both went on calling it open and tracked. That is a debt
list read against itself rather than against the thing it cites.

### The deferral with no owner

A2 made every structural commit seed one flush, so a node added at runtime publishes at rest. A
loaded project publishes nothing until something ticks. Whether `Engine.load()` should seed a flush
too was recorded as unasked, and the reason given for not deciding was that load has no members yet
when it would seed. That reason is about ordering rather than about whether the answer should be yes,
which is what left it a deferral rather than a refusal. Part 6 asked for that sentence to become
either its own issue or an explicit refusal.

### The optimisation that removed a step which owned two things

C3 made the timeline build conditional: a structural edit whose whole compiled input provably did not
move pays the resolve and declines the build. Part 6 flags that this widened issue #176, because a
replacement now has two shapes and a failed recompile has two rollback paths.

Both shapes are correct as they stand. A declined build stages nothing, so it has nothing to roll
back, and the Motion republish reverts on its own exactly as it did before. Measured rather than
argued, and nothing is owed for it.

What is not correct is a different invariant the build also owned. A fresh `Track` is constructed from
a definition, so it carries no mask and no patched timeline, and before C3 every structural edit
dropped a live value write by construction. That is what `SESSION-STATUS.md` states as a plain fact: a
write is replaced wholesale, and every structural edit drops it because they route through
`#replaceTrack`. After C3 the four binding verbs are exactly the edits whose compiled input provably
did not move, so they decline the build, keep the old `Track`, and keep its write, while
`#replaceTrack` writes a retained entry recording no overlay at all.

The static case is a divergence between the authored record and the live composition that nobody asked
for. The animated case is the failure mode `TrackEntry.overlay` exists to prevent: the retained
overlay is what tells a later `overrideValues({})` that the animated path still has to run, so a
cleared overlay over a still-patched timeline is a freeze that cannot be reverted through the public
surface at all. A misconfiguration with no symptom is the thing this project refuses by name.

This is C1's guardrail failing on the slice that earned it. An optimisation that removes a step is
read for what that step also owned, and the step C3 removed owned two things rather than one.

## Decision

### Neither a load nor a mount seeds a flush, and this is the refusal rather than a deferral

`Engine.load()` seeds nothing, because there is no member to publish to and A2 already established
that an empty seed set is not a cheap flush: it opens a batch, notifies every batch subscriber, moves
the sequence and drains whatever a deferred flush had carried. A commit with nothing to publish does
not call `invalidate` at all, and load is that commit.

`mount` seeds nothing either, and this is the half this ADR first got wrong. It was drafted as a seed
at the mount, on the argument that a node mounted by a commit is seeded by `#apply` while a node
mounted by a caller is seeded by nobody, so the asymmetry was a defect and the member arriving at the
mount was where the seed belonged. That was implemented and measured, and the measurement refused it:
run 33712936651 turned 21 cases red across 12 files, and three of them are the reason.

`T-1` asserts that a loaded project publishes nothing before its driver has run, and
`SESSION-STATUS.md` records that asymmetry as real and owned. A seed at the mount contradicts an owned
decision rather than completing one.

`trigger-time.test.ts` owns "does not emit before the first tick", which is a promise about drivers
rather than about publication. A mount happens before any tick, so a time Motion publishing at its
mount emits a progress its driver never produced.

And the finding that settles it: a seed at the mount does not add a publication, it takes the next
one. `PatchRegistry.publish` drops a candidate through `samePatch`, so the `seek` that follows a mount
publishes nothing new and the batch its caller reads is empty. Eighteen of the 21 failures are that
shape, `RA-8` among them, which is A2's own evidence. A caller that mounts and then seeks would
silently lose the patch it used to be handed, which is the "published-early and published-twice look
the same" trap this project already has a guardrail for.

That mechanism had one more reachable cause than this record knew about, and it has one fewer now.
ADR-070 refuses a publication from inside a commit, which is this shape arriving from the other side:
a hook's `seek` or `invalidate` placed a candidate in front of the commit's own flush and took it, so
`addTrack`'s caller read a graph that changed and a `touched` list that published nothing. The dedupe
is not what changed and is not what should have. Who is allowed to make a publication is, and that is
ADR-070's rather than this record's.

So the first real operation on a node is what carries its first patch, and the asymmetry between a
runtime add and a load stays exactly where `T-1` put it.

### The resolve is validation, the build is the expense, and the build also drops the write

The predicate keeps its shape and gains one term. The resolve is asked unconditionally, because it is
the only place a `PluginRegistry` ever sees an already-compiled node's candidate, and the build
additionally runs when a live write is in force on the retained entry.

The order is the whole correctness of it. A predicate written as "a live write, or the compiled input
moved" short-circuits, so the resolve never runs, and skipping the resolve deletes a validator rather
than a cost: an undeclared slot would reach a committed graph carrying a real edge into a consumer that
does not exist, refused by name only when someone reloaded the document that same record now fails to
load. That is exactly what C1 refused to ship and it is the named mutation target of this slice.

Whether a write is in force is recorded on the retained entry by the fact that one was asked for,
rather than by what the backend answered. A write that reached no compiled `Track` therefore costs one
build it does not strictly need, which is the conservative direction the predicate already commits to:
what it cannot prove unchanged reads as changed.

## Alternatives read and refused

**Seed at load with an empty seed set.** The shape A2 already corrected inside its own slice: the plan
called for one unconditional `invalidate`, an empty seed set turned out to cost a whole batch, and the
plan was corrected rather than followed into it. Seeding nothing to nobody is a frame's worth of
machinery spent saying so.

**Seed at the mount.** Drafted, implemented, measured and refused, for the three reasons above. It is
recorded here rather than deleted, because the next reader will have the same instinct and the
`samePatch` interaction is not visible from the call site.

**Seed at the mount and rewrite the 18 cases that read the following batch.** The guardrail about
moving a read when a slice moved the point at which something happens does allow that shape, but it
allows it for a read in the wrong place rather than for a contract in the wrong direction. Two of the
21 are owned decisions and one is a driver promise, so the rewrite would have been 18 cases changed to
accommodate a behaviour nothing asked for.

**Re-clear the live write on the declined path instead of building.** Keeps C3's saving and needs the
runtime to reach into the compiled `Track` and undo a mask and a patched timeline without rebuilding
it, which is a second mechanism for something the build already does, owned by the layer that does not
own the `Track`. One question, one mechanism.

**Widen `sameCompiledTrackInput` to take the live write.** That module is the one owner of what a
compiled `Track` is built from, and a live write is not one of those things: it is applied to a `Track`
after it is built. Putting it there would make the comparator answer a question about runtime state,
which is the one thing it deliberately has no access to.

**Leave the static case and fix only the animated one.** Two failure contracts for one condition. The
build is what dropped the write, both halves travelled with it, and splitting them would leave the
documented rule true of one half and false of the other.

## Consequences

Nothing about publication at load or at mount changes, which is the point: the sentence saying the
question was unanswered is replaced by a refusal with three measured reasons and a case that fails if
either half is added back.

A binding edit on a node carrying a live value write pays the timeline build once. The next binding
edit on that node does not, because the build dropped the write, so this is one build per write rather
than a retreat from C3.

`TrackEntry` gains one private field. No public surface moves: no export, no signature, and no new rule
id, because nothing here is a new refusal.

## Evidence

`RA-100` through `RA-102` in `packages/core/test/unit/runtime/mount-flush-seed.test.ts`, and `RA-103`
through `RA-105` in `packages/core/test/unit/runtime/declined-build-write-drop.test.ts`.

The three mount cases are green against `main` by construction, because the decision is a refusal, and
what they would fail without is measured rather than asserted: run 33712639888 is the red run for
`RA-100`, `RA-101` and `RA-103` as first written, and run 33712936651 is the 21-case measurement that
refused the mount seed. `RA-101` is the case that fails if either half is added back, and it fails on
the publication being taken from the next operation rather than on one being added.

`RA-104` is the equivalence half of the write drop, holding a binding edit on a node with no live write
at zero builds, so the fix cannot be "always build". `RA-105` is the ordering guard and is green on
both sides, because the resolve runs today and must keep running.

## References

ADR-045 for the transactional replacement, ADR-058 for cache residency and derived facts, ADR-062 for
candidate key ownership and the recompile predicate this amends, ADR-064 for the transaction model, and
ADR-065 for authored property editing. Issues #176, #218, #222, #223 and #231.
