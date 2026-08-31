# ADR-062: key ownership is answered over the candidate, and the resolve is validation rather than cost

- Status: accepted
- Date: 2026-08-31
- Slice: C1 of [issue #223](https://github.com/chahyasantoso/motion5/issues/223), the structural tier, amended by C3 with the predicate it deferred
- Supersedes nothing. Amends no earlier record. Closes the open question ADR-059's Correction #3 left reopenable and that `SESSION-STATUS.md` carried into slice C.

## The question

A structural authoring primitive rewrites an authored keyframes record. Something has to answer
whether the record it produces is one this project would have accepted had an author written it and
loaded it fresh. The plan named two candidates and the issue flagged the choice as open:

- the track's authored history, which is what ADR-059's `setValues` slice chose for its own narrower
  question;
- the plugin's declared shape, reached by exporting `claims()`, which Correction #3 of that same ADR
  closed against for reasons that do not apply here.

## Decision

Neither. No primitive asks permission for its own edit.

A primitive builds a candidate authored record purely, in `domain/authoring/keyframes.ts`, and the
owners that already judge a whole authored record judge that candidate: `PluginRegistry` for whether
the named plugin exists and declares the slot, `finalizeGraph` for whether every derived edge
resolves to a node and the topology stays acyclic. No per-primitive ownership check exists, so none
can disagree with the loader.

Two consequences follow, and the second is the one worth writing down.

1. The refusal a caller sees for an undeclared slot is the registry's own, with the registry's rule
   id and the diagnostics path the author actually wrote. `RA-46` pins that.
2. **The recompile a structural edit pays is the validation, not an expense.** So the V3/V4 recompile
   predicate does not skip it.

## Why the two candidates lose

The authored history cannot admit a genuinely new key by construction. It is the flattened record, in
which a grouped leaf and a flat key are indistinguishable, so it cannot answer a group-scoped
question at all, and `withAuthoredValues` skips a key with no flattened entry rather than inventing
one. Asking history whether a new thing is allowed is asking the wrong tense.

Exporting `claims()` is worse than Correction #3 said, and for a reason only visible now that a
structural primitive is concrete. The contract a consumer needs is `#claimantsOf`'s
exact-beats-predicate precedence rather than `claims` itself, so exporting the predicate exports the
half that cannot answer, and hands every consumer a second owner that is silently weaker than the
first. That is one question with two mechanisms, the weak one kept and documented as discouraged,
which this project deletes rather than documents.

## The finding that decides the sequencing

`engine.ts`'s `compileTrack` opens with `const existing = tracks.get(nodeId); if (existing) return
existing;`. A live entry is reused, deliberately, and the registry is never asked. The one path that
does ask it for an already-live node is `stageTrackDefinition`, which deletes the entry first
precisely so the compile runs, and restores it when preparation rejects.

So `stageTrack` is the only place the registry ever sees the candidate record of an already-compiled
node.

Read the V3/V4 predicate against that and it inverts for this tier's first slice. `setRequire` and
`removeRequire` operate on an already-bound plugin by precondition, which is exactly what `RA-43`
refuses to relax, so by V4 read forward that plugin is already in `ResolvedPlugins.plugins` and the
chain provably never moves. The predicate therefore answers "skip" for every C1 edit without
exception, and C1 with the predicate would never resolve and never validate anything. What would
ship is a slot no plugin declares, carrying a real `GraphEdge` derived by `readPluginBindings` into a
consumer that does not exist, feeding nothing and reporting nothing, refused by name only when
someone reloads the document that same record now fails to load. A rig that holds a broken pose
silently is the one failure mode this project refuses at load time by name.

## The predicate, restated so it stays safe

A recompile is two things wearing one name. The resolve is validation and preparation, it is pure and
cheap, and it is never skipped. The timeline build -- `compilePercentKeyframes` plus a fresh `Track`
through the interpolator -- is the actual expense, and it is skippable when `ResolvedPlugins.plugins`
is unchanged across the candidate, which is what V3 and V4 together prove.

So the optimisation is: resolve the candidate, compare the plugin list, skip the build. Not: skip the
recompile. A skipped resolve also skips whatever `preparation.keyframes` a new binding implies, which
is a second reason the resolve is not the half to drop.

That optimisation belongs to the first slice that needs the registry's answer as data rather than as
a refusal, which is C2 at the earliest and not this one. When it lands, the seam is N4's signature
verbatim, because the second parameter is a diagnostics path and not a node id:

```text
ProjectRuntimeOptions.resolveKeyframes?:
  (keyframes, path, track: TrackConfigView) => ResolvedPlugins
```

wired in `engine.ts` from the registry it already holds, beside `compileTrack` and `stageTrack`, with
`path` spelled exactly as `compileTrack` spells it. With no registry injected there is nothing to
resolve against and nothing to refuse, which is the posture `compileTrack` already takes when
`#plugins` is undefined, and it is what keeps C1's registry-free rig honest. Optional hook, total
answer when present.

One thing to resist while wiring it: do not thread the resolved answer through the `stageTrack` hook
to avoid resolving twice on the non-skipped path. Widening a hook signature for an unmeasured saving
on the cheapest step is the wrong trade, and `SchemaPlan` carrying a `ResolvedPlugins` is a change
worth making only once a measurement asks for it.

## Amendment: what slice C3 shipped

C3 is where the deferred optimisation landed, and it is recorded here rather than in a second ADR
because the decision is this record's own: the seam is the signature above, the resolve is still
validation, and the timeline build is still the only thing skipped. One thing needed correcting and
two needed stating.

**The correction. The plugin list is not the predicate.** It is one of the things a compiled `Track`
is built from rather than all of them. A `Track` is constructed from an interpolation config, which
is the whole track definition with its flattened `values` section spliced in and the prepared
contribution merged over that, plus the resolved plugins. `replace()` and `addObserve` both reach the
same transaction as the six authored verbs, with a changed value, a changed duration or a changed
observation and an untouched chain, so a plugin-list comparison alone would have declined a build all
three require and left a node composing a value nobody authored. The predicate therefore compares the
whole compiled input: the definition outside its authored record, the flattened record itself, the
plugin chain by content and in order, the prepared contribution, and the declared internal keys.
`outputSerializers` is not compared, because it is derived from the chain and a record of functions
can only ever compare as changed.

That comparison is one pure function with one owner, `domain/authoring/recompile.ts`. It is
conservative in one direction only: anything it cannot prove unchanged reads as changed, so a
contributed tween var holding something structural equality cannot walk costs a build rather than
risking a skip. `RA-61` is the case that goes red against the predicate read literally, and it is the
sixth entry in this project's "a plan's prescription is a measurement, not a premise" list.

**The retained record is resolved, not kept.** The comparison needs the answer for the record the
live `Track` was built from as well as for the candidate. Retaining that chain beside the compiled
map was considered and refused: it is a cache whose key is the registry's own contents, and it would
have to be written, dropped and restored by four call sites staying in step, which is the residency
rule this project already answers inside the layer that holds the thing. So `#needsTimelineBuild`
resolves both records and reads only the answer, and "resolve the candidate once" stays literally
true: the candidate is resolved exactly once, by the layer that decides, and never again by a build
that does not happen. A resolve is the pure and cheap half of the compile this declines to pay.

**The refusal moved earlier, and the message did not.** The candidate is resolved before any effect
is applied, so a candidate the registry rejects is refused before a `Track` is staged rather than
during the staging, on both the skipped and the built path. Same owner, same rule id, same authored
path, same rendering: `U-1` still reads `plugin-unknown-key at ...` and the live compiled `Track` is
still the one that survives. What changes is that a refused candidate now costs no staging at all,
which is the property `RA-45` and `RA-46` already asked of this tier.

What did not change is worth stating too, because the temptation is to read an optimisation as a
discount on the tier: a binding edit still builds one candidate graph, still pays one edge delta,
still commits through the one `#commit`, and still seeds one flush. There is no fast lane for an
edge, and this slice never claimed one. Evidence `RA-57` through `RA-61` in
`packages/core/test/unit/runtime/recompile-predicate.test.ts`.

## What stays separate

`keyframe-group-unbound` is not the registry's question and must not be folded into it. "This node
authors no group for this plugin" is answered from the retained record on this node, before any
candidate exists, and it is the boundary that keeps `setRequire` and `setKeyframeGroup` from
collapsing into one verb whose cost and refusal set depend on whether the group already existed.
Folding it into `plugin-unknown-key` would move it to the wrong owner and lose the sentence that
names the other primitive.

`keyframe-require-shape` is also this layer's own, for the reason ADR-057 refused a dict/scalar
mismatch in both directions: a scalar written over a dict-valued slot drops every entry the author
wrote, a member key named at a scalar slot names an entry that slot cannot hold, and nothing below
this layer can catch either, because the parser holds no registry and both shapes are legal at any
slot name. Crossing a slot's shape is a `replace()`, where a whole definition is validated.

## Alternatives considered

- **Ask the registry inside each primitive, before the commit.** Rejected. It is a second owner of
  ownership by construction, it needs the registry at a layer that deliberately does not hold one,
  and it can disagree with the loader in exactly the case nobody tests: a record that a primitive
  accepted and `Engine.load` refuses.
- **Skip the recompile and add a per-primitive slot check to compensate.** Rejected, and it is the
  trap. It trades one owner for two and buys nothing measurable, because the resolve is the cheap
  half of what it skips.
- **Refuse the goals slot by name here.** Deferred, not rejected. `setGoal` and `removeGoal` are a
  later slice, and until they exist a `setRequire` at a solver's goals slot can write a shape
  `ik-goal-conflict` refuses at load. Nothing in `RA-39` through `RA-47` pins it, so it is decided
  where the two goal verbs are, with its own case. Landed in C2 as `keyframe-goal-slot-reserved`.
- **Decide the skip inside `stageTrackDefinition`, where the build is.** Considered by C3 and
  rejected. The compiled-map owner would then need the retained input for every live node, which is
  the refused cache above, and the same seam is shared by the tier 2 escalation path, where a
  declined animated write has to reach a fresh `Track` for reasons that have nothing to do with
  topology. One seam, two tiers, one predicate between them is how a value-tier revert would have
  started depending on a structural-tier optimisation.

## Consequences

- A structural primitive is cheap to add: a pure editor plus a plan, with no validation of its own.
- A structural edit costs one candidate build, one edge delta and one flush, plus the resolve, and
  that price is now documented as correct rather than as pending optimisation.
- The guardrail this earns, recorded in `SESSION-STATUS.md`: an optimisation that removes a step is
  read for what that step also owned, because a recompile that looked like pure expense was the only
  place a validator saw the candidate.

Refs ADR-031, ADR-035, ADR-043, ADR-044, ADR-045, ADR-049, ADR-056, ADR-057, ADR-059, ADR-060,
ADR-061, ADR-063. Evidence `RA-39` through `RA-47` in
`packages/core/test/unit/runtime/plugin-require-edit.test.ts`, and `RA-57` through `RA-61` in
`packages/core/test/unit/runtime/recompile-predicate.test.ts`.
