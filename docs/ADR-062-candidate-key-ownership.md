# ADR-062: key ownership is answered over the candidate, and the resolve is validation rather than cost

- Status: accepted
- Date: 2026-08-31
- Slice: C1 of [issue #223](https://github.com/chahyasantoso/motion5/issues/223), the structural tier
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
  where the two goal verbs are, with its own case.

## Consequences

- A structural primitive is cheap to add: a pure editor plus a plan, with no validation of its own.
- A structural edit costs one candidate build, one edge delta, one recompile and one flush, and that
  price is now documented as correct rather than as pending optimisation.
- The guardrail this earns, recorded in `SESSION-STATUS.md`: an optimisation that removes a step is
  read for what that step also owned, because a recompile that looked like pure expense was the only
  place a validator saw the candidate.

Refs ADR-031, ADR-035, ADR-043, ADR-044, ADR-045, ADR-049, ADR-056, ADR-057, ADR-059, ADR-060,
ADR-061. Evidence `RA-39` through `RA-47` in
`packages/core/test/unit/runtime/plugin-require-edit.test.ts`.
