# ADR-062: key ownership is answered over the candidate, and the resolve is validation rather than cost

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

- Status: accepted
- Date: 2026-08-31
- Slice: C1 of [issue #223](https://github.com/chahyasantoso/motion5/issues/223), structural tier, amended by C3
  with predicate it deferred
- Supersedes nothing. Amends no earlier record. Closes open question ADR-059's Correction #3 left reopenable and
  `SESSION-STATUS.md` carried into slice C.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** `grouped leaf and a flat key are
indistinguishable` passage in **Why the two candidates lose** no longer describes authored input. Flattening still
loses group identity, but flat key no longer authored spelling; schema rejects as `keyframes-ungrouped-key` before
this layer.

## The question

Structural authoring primitive rewrites authored keyframes record. Something must answer whether record it produces
is one this project would have accepted had author written and loaded it fresh. Plan named two candidates, issue
flagged choice open:

- track's authored history — what ADR-059's `setValues` slice chose for own narrower question;
- plugin's declared shape, reached by exporting `claims()` — which Correction #3 of same ADR closed against, for
  reasons not applying here.

## Decision

Neither. No primitive asks permission for own edit.

Primitive builds candidate authored record purely in `domain/authoring/keyframes.ts`; owners already judging whole
authored record judge candidate: `PluginRegistry` for whether named plugin exists and declares slot, `finalizeGraph`
for whether every derived edge resolves to node and topology stays acyclic. No per-primitive ownership check exists →
none can disagree with loader.

Two consequences, second worth writing down.

1. Refusal caller sees for undeclared slot = registry's own, with registry's rule id and diagnostics path author
   actually wrote. `RA-46` pins.
2. **The recompile a structural edit pays is the validation, not an expense.** So V3/V4 recompile predicate does not
   skip it.

## Why the two candidates lose

Authored history cannot admit genuinely new key by construction. Flattened record, where grouped leaf and flat key
indistinguishable → cannot answer group-scoped question at all, `withAuthoredValues` skips key with no flattened
entry rather than inventing one. Asking history whether new thing allowed = asking wrong tense.

Exporting `claims()` worse than Correction #3 said, reason visible only now structural primitive concrete. Contract
consumer needs is `#claimantsOf`'s exact-beats-predicate precedence not `claims` itself → exporting predicate exports
half that cannot answer, hands every consumer second owner silently weaker than first. One question, two mechanisms,
weak one kept and documented discouraged = what this project deletes rather than documents.

## The finding that decides the sequencing

`engine.ts`'s `compileTrack` opens `const existing = tracks.get(nodeId); if (existing) return existing;`. Live entry
reused deliberately, registry never asked. One path that does ask for already-live node = `stageTrackDefinition`,
deletes entry first precisely so compile runs, restores when preparation rejects.

`stageTrack` therefore only place registry ever sees candidate record of already-compiled node.

Read V3/V4 predicate against that, it inverts for tier's first slice. `setRequire`, `removeRequire` operate on
already-bound plugin by precondition — exactly what `RA-43` refuses to relax → by V4 read forward that plugin already
in `ResolvedPlugins.plugins`, chain provably never moves. Predicate answers "skip" for every C1 edit without
exception → C1 with predicate would never resolve, never validate anything. What would ship: slot no plugin declares,
carrying real `GraphEdge` derived by `readPluginBindings` into consumer that does not exist, feeding nothing,
reporting nothing, refused by name only when someone reloads document that same record now fails to load. Rig holding
broken pose silently = one failure mode this project refuses at load time by name.

## The predicate, restated so it stays safe

Recompile = two things wearing one name. Resolve is validation and preparation, pure, cheap, never skipped. Timeline
build — `compilePercentKeyframes` plus fresh `Track` through interpolator — actual expense, skippable when
`ResolvedPlugins.plugins` unchanged across candidate, what V3 + V4 together prove.

Optimisation therefore: resolve candidate, compare plugin list, skip build. Not: skip recompile. Skipped resolve also
skips whatever `preparation.keyframes` new binding implies — second reason resolve not half to drop.

Optimisation belongs to first slice needing registry's answer as data not refusal — C2 at earliest, not this one.
When it lands, seam is N4's signature verbatim, second parameter diagnostics path not node id:

```text
ProjectRuntimeOptions.resolveKeyframes?:
  (keyframes, path, track: TrackConfigView) => ResolvedPlugins
```

wired in `engine.ts` from registry it already holds, beside `compileTrack`, `stageTrack`, `path` spelled exactly as
`compileTrack` spells it. No registry injected → nothing to resolve against, nothing to refuse — posture
`compileTrack` already takes when `#plugins` undefined, what keeps C1's registry-free rig honest. Optional hook, total
answer when present.

One thing to resist while wiring: do not thread resolved answer through `stageTrack` hook to avoid resolving twice on
non-skipped path. Widening hook signature for unmeasured saving on cheapest step = wrong trade, `SchemaPlan` carrying
`ResolvedPlugins` = change worth making only once measurement asks.

## Amendment: what slice C3 shipped

C3 = where deferred optimisation landed, recorded here not in second ADR because decision is this record's own: seam
is signature above, resolve still validation, timeline build still only thing skipped. One thing needed correcting, two
needed stating.

**Correction. Plugin list not the predicate.** One of things compiled `Track` built from, not all. `Track` constructed
from interpolation config = whole track definition with flattened `values` section spliced in, prepared contribution
merged over that, plus resolved plugins. `replace()` and `addObserve` both reach same transaction as six authored
verbs, with changed value, duration or observation, untouched chain → plugin-list comparison alone would decline build
all three require, leave node composing value nobody authored. Predicate therefore compares whole compiled input:
definition outside authored record, flattened record itself, plugin chain by content and order, prepared contribution,
declared internal keys. `outputSerializers` not compared — derived from chain, record of functions can only ever
compare as changed.

Comparison one pure function, one owner, `domain/authoring/recompile.ts`. Conservative one direction only: anything it
cannot prove unchanged reads as changed → contributed tween var holding something structural equality cannot walk
costs build rather than risking skip. `RA-61` case going red against predicate read literally — sixth entry in this
project's "a plan's prescription is a measurement, not a premise" list.

**Retained record resolved, not kept.** Comparison needs answer for record live `Track` built from as well as
candidate. Retaining chain beside compiled map considered, refused: cache whose key is registry's own contents, would
need writing, dropping, restoring by four call sites staying in step — residency rule this project already answers
inside layer holding thing. So `#needsTimelineBuild` resolves both records, reads only answer, "resolve candidate once"
stays literally true: candidate resolved exactly once, by layer that decides, never again by build that does not
happen. Resolve = pure and cheap half of compile this declines to pay.

**Refusal moved earlier, message did not.** Candidate resolved before any effect applied → candidate registry rejects
refused before `Track` staged rather than during staging, on both skipped and built path. Same owner, same rule id,
same authored path, same rendering: `U-1` still reads `plugin-unknown-key at ...`, live compiled `Track` still one that
survives. Changes: refused candidate now costs no staging at all — property `RA-45`, `RA-46` already asked of this tier.

What did not change worth stating, temptation reading optimisation as discount on tier: binding edit still builds one
candidate graph, still pays one edge delta, still commits through one `#commit`, still seeds one flush. No fast lane
for edge, slice never claimed one. Evidence `RA-57` through `RA-61` in
`packages/core/test/unit/runtime/recompile-predicate.test.ts`.

## What stays separate

`keyframe-group-unbound` not registry's question, must not fold into it. "This node authors no group for this plugin"
answered from retained record on this node, before any candidate exists — boundary keeping `setRequire` and
`setKeyframeGroup` from collapsing into one verb whose cost and refusal set depend on whether group already existed.
Folding into `plugin-unknown-key` moves to wrong owner, loses sentence naming other primitive.

`keyframe-require-shape` also this layer's own, reason ADR-057 refused dict/scalar mismatch both directions: scalar
written over dict-valued slot drops every entry author wrote, member key named at scalar slot names entry that slot
cannot hold, nothing below this layer catches either — parser holds no registry, both shapes legal at any slot name.
Crossing slot's shape = `replace()`, where whole definition validated.

## Alternatives considered

- **Ask registry inside each primitive, before commit.** Rejected: second owner of ownership by construction, needs
  registry at layer deliberately not holding one, can disagree with loader in exactly case nobody tests — record
  primitive accepted and `Engine.load` refuses.
- **Skip recompile, add per-primitive slot check to compensate.** Rejected, the trap. Trades one owner for two, buys
  nothing measurable — resolve cheap half of what it skips.
- **Refuse goals slot by name here.** Deferred not rejected. `setGoal`, `removeGoal` later slice; until they exist
  `setRequire` at solver's goals slot can write shape `ik-goal-conflict` refuses at load. Nothing in `RA-39` through
  `RA-47` pins → decided where two goal verbs are, own case. Landed in C2 as `keyframe-goal-slot-reserved`.
- **Decide skip inside `stageTrackDefinition`, where build is.** Considered by C3, rejected. Compiled-map owner would
  need retained input for every live node = refused cache above; same seam shared by tier 2 escalation path, where
  declined animated write must reach fresh `Track` for reasons unrelated to topology. One seam, two tiers, one
  predicate between them — how value-tier revert would have started depending on structural-tier optimisation.

## Consequences

- Structural primitive cheap to add: pure editor plus plan, no validation of own.
- Structural edit costs one candidate build, one edge delta, one flush, plus resolve — price now documented correct,
  not pending optimisation.
- Guardrail this earns, recorded in `SESSION-STATUS.md`: optimisation removing step read for what that step also
  owned, because recompile looking like pure expense was only place validator saw candidate.

Refs ADR-031, ADR-035, ADR-043, ADR-044, ADR-045, ADR-049, ADR-056, ADR-057, ADR-059, ADR-060, ADR-061, ADR-063.
Evidence `RA-39` through `RA-47` in `packages/core/test/unit/runtime/plugin-require-edit.test.ts`, `RA-57` through
`RA-61` in `packages/core/test/unit/runtime/recompile-predicate.test.ts`.
