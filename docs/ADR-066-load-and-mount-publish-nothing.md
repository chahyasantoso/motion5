# ADR-066: a load and a mount publish nothing, and a declined build still drops the live write

## Status

Accepted. Closes part 6 of re-review of issue #223 — last part of that issue with anything owed.

## Context

Part 6 sorts what issue #223 did not implement into closed-by-decision vs genuinely open. First list settled, nothing
owed: `setMotion`/`setTrack` cut, `keyframe-key-animated` never added, 7b's second half refused inside A3, issue #222's
stateful interpolator refused, `templates` deleted and refused. Second list two entries, both turn out claim nobody
measured.

Issue #176 one of them, closed. Completed by PR #178 on 21 August, landed staged replacement → compile-after-commit
ordering it opened for fixed two weeks while part 6 and `SESSION-STATUS.md` went on calling it open and tracked. Debt
list read against itself rather than against thing it cites.

### The deferral with no owner

A2 made every structural commit seed one flush → node added at runtime publishes at rest. Loaded project publishes
nothing until something ticks. Whether `Engine.load()` should seed flush recorded unasked; reason given for not deciding:
load has no members yet when it would seed. Reason about ordering, not about whether answer should be yes — what left it
deferral not refusal. Part 6 asked sentence become own issue or explicit refusal.

### The optimisation that removed a step which owned two things

C3 made timeline build conditional: structural edit whose whole compiled input provably did not move pays resolve,
declines build. Part 6 flags this widened issue #176 — replacement now two shapes, failed recompile two rollback paths.

Both shapes correct as stand. Declined build stages nothing → nothing to roll back, Motion republish reverts on own
exactly as before. Measured not argued, nothing owed.

Not correct = different invariant build also owned. Fresh `Track` constructed from definition → carries no mask, no
patched timeline, before C3 every structural edit dropped live value write by construction. `SESSION-STATUS.md` states
as plain fact: write replaced wholesale, every structural edit drops it routing through `#replaceTrack`. After C3 four
binding verbs exactly edits whose compiled input provably did not move → decline build, keep old `Track`, keep its write,
while `#replaceTrack` writes retained entry recording no overlay at all.

Static case = divergence between authored record and live composition nobody asked for. Animated case = failure mode
`TrackEntry.overlay` exists to prevent: retained overlay what tells later `overrideValues({})` animated path still has to
run → cleared overlay over still-patched timeline freeze not revertible through public surface at all. Misconfiguration
with no symptom = thing this project refuses by name.

C1's guardrail failing on slice that earned it. Optimisation removing step read for what step also owned; step C3
removed owned two things not one.

## Decision

### Neither a load nor a mount seeds a flush, and this is the refusal rather than a deferral

`Engine.load()` seeds nothing: no member to publish to, A2 already established empty seed set not cheap flush — opens
batch, notifies every batch subscriber, moves sequence, drains whatever deferred flush carried. Commit with nothing to
publish does not call `invalidate` at all; load is that commit.

`mount` seeds nothing too — half this ADR first got wrong. Drafted as seed at mount, argument: node mounted by commit
seeded by `#apply`, node mounted by caller seeded by nobody → asymmetry defect, arriving member where seed belonged.
Implemented, measured; measurement refused: run 33712936651 turned 21 cases red across 12 files, three are reason.

`T-1` asserts loaded project publishes nothing before driver has run; `SESSION-STATUS.md` records asymmetry real and
owned. Seed at mount contradicts owned decision rather than completing one.

`trigger-time.test.ts` owns "does not emit before the first tick" — promise about drivers not publication. Mount happens
before any tick → time Motion publishing at mount emits progress its driver never produced.

Finding settling it: seed at mount does not add publication, takes next one. `PatchRegistry.publish` drops candidate
through `samePatch` → `seek` following a mount publishes nothing new, batch caller reads empty. Eighteen of 21 failures
that shape, `RA-8` among them — A2's own evidence. Caller mounting then seeking silently loses patch it used to be handed
= "published-early and published-twice look the same" trap project already has guardrail for.

Mechanism had one more reachable cause than this record knew, one fewer now. ADR-070 refuses publication from inside
commit — same shape from other side: hook's `seek`/`invalidate` placed candidate in front of commit's own flush, took it →
`addTrack`'s caller read changed graph and `touched` list publishing nothing. Dedupe not what changed, not what should
have. Who allowed to make publication is — ADR-070's, not this record's.

First real operation on node carries its first patch; asymmetry between runtime add and load stays exactly where `T-1`
put it.

### The resolve is validation, the build is the expense, and the build also drops the write

Predicate keeps shape, gains one term. Resolve asked unconditionally — only place `PluginRegistry` ever sees
already-compiled node's candidate; build additionally runs when live write in force on retained entry.

Order whole correctness. Predicate written "a live write, or compiled input moved" short-circuits → resolve never runs;
skipping resolve deletes validator not cost: undeclared slot reaches committed graph carrying real edge into consumer that
does not exist, refused by name only when someone reloaded document that same record now fails to load. Exactly what C1
refused to ship, named mutation target of this slice.

Whether write in force recorded on retained entry by fact one asked for, not what backend answered. Write reaching no
compiled `Track` therefore costs one build not strictly needed — conservative direction predicate already commits to: what
it cannot prove unchanged reads as changed.

## Alternatives read and refused

**Seed at load with empty seed set.** Shape A2 already corrected inside own slice: plan called for one unconditional
`invalidate`, empty seed set turned out cost whole batch, plan corrected rather than followed into it. Seeding nothing to
nobody = frame's worth of machinery saying so.

**Seed at mount.** Drafted, implemented, measured, refused, three reasons above. Recorded not deleted: next reader has
same instinct, `samePatch` interaction not visible from call site.

**Seed at mount, rewrite 18 cases reading following batch.** Guardrail about moving read when slice moved point of
happening allows shape — but allows for read in wrong place, not contract in wrong direction. Two of 21 owned decisions,
one driver promise → rewrite 18 cases changed to accommodate behaviour nothing asked for.

**Re-clear live write on declined path instead of building.** Keeps C3's saving, needs runtime reaching into compiled
`Track` undoing mask + patched timeline without rebuilding = second mechanism for what build already does, owned by layer
not owning `Track`. One question, one mechanism.

**Widen `sameCompiledTrackInput` to take live write.** That module one owner of what compiled `Track` built from; live
write not one — applied to `Track` after built. Putting there makes comparator answer question about runtime state, the
one thing it deliberately has no access to.

**Leave static case, fix only animated.** Two failure contracts for one condition. Build dropped write, both halves
travelled with it; splitting leaves documented rule true of one half, false of other.

## Consequences

Nothing about publication at load or mount changes — the point: sentence saying question unanswered replaced by refusal
with three measured reasons and case failing if either half added back.

Binding edit on node carrying live value write pays timeline build once. Next binding edit does not — build dropped write
→ one build per write, not retreat from C3.

`TrackEntry` gains one private field. No public surface moves: no export, no signature, no new rule id — nothing here new
refusal.

## Evidence

`RA-100` through `RA-102` in `packages/core/test/unit/runtime/mount-flush-seed.test.ts`, `RA-103` through `RA-105` in
`packages/core/test/unit/runtime/declined-build-write-drop.test.ts`.

Three mount cases green against `main` by construction — decision refusal — what they would fail without measured not
asserted: run 33712639888 red run for `RA-100`, `RA-101`, `RA-103` as first written, run 33712936651 the 21-case
measurement refusing mount seed. `RA-101` fails if either half added back, fails on publication taken from next operation
not added.

`RA-104` equivalence half of write drop, holding binding edit on node with no live write at zero builds → fix cannot be
"always build". `RA-105` ordering guard, green both sides: resolve runs today, must keep running.

## References

ADR-045 transactional replacement, ADR-058 cache residency and derived facts, ADR-062 candidate key ownership and the
recompile predicate this amends, ADR-064 transaction model, ADR-065 authored property editing. Issues #176, #218, #222,
#223, #231.
