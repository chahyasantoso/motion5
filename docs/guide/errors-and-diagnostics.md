# Errors and diagnostics

motion5 distinguishes three things that other runtimes tend to blend: input that is invalid, a node that cannot currently produce a value, and a caller that broke a contract. Each has its own channel.

## Invalid input throws at the boundary

`Engine.load()` and `addMotion` validate before they build. Errors reject the candidate project before it can replace anything, and the throw is a `TypeError` whose message is the collected diagnostics:

```ts
try {
  handle = engine.load(project);
} catch (error) {
  // "trigger-time-duration at motions.hero.trigger: ..."
  console.error(error instanceof Error ? error.message : error);
}
```

A diagnostic is structured, and the shape is stable. It is one interface, and what each rule fixes about itself lives in one record rather than in the shape:

```ts
interface Diagnostic {
  readonly ruleId: RuleId;
  readonly path: string;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly ids: readonly string[];
}
```

Reading one is simpler than it was: `path`, `message`, `severity` and `ids` are all on it, with no variant to narrow first. Three things are worth knowing if you write one down.

`ruleId` is a closed union rather than a `string`, so comparing it against a rule this project does not have stops compiling instead of quietly never matching, and constructing a `Diagnostic` of your own with a rule id you invented is refused.

`severity` comes from the rule and from nothing else. It used to default to `"error"` at the constructor, so a warning rule reported by a caller that passed nothing became an error diagnostic and nothing noticed; the rule answers now, and the parameter is deleted, so there is no argument position in which any caller can name one. Read `severity` off the diagnostic.

Whether a rule names `ids` is fixed by the rule too, but it is enforced where a diagnostic is built rather than by the field. A producer takes the payload its rule owns as its argument list, so a rule that names none cannot be handed one and a rule that always names them cannot omit them. The field itself is required. Every diagnostic is built through the project's one constructor and carries it, frozen and empty for a rule that names none, so `ids` and `ids ?? []` read the same thing and the fallback can go. Two rules may name one event and differ on nothing but this: a reentrant flush that deferred seeds reports `reentrant-flush-deferred` and names them, and one that deferred only the frame it carried reports `reentrant-flush-deferred-frame` and names nothing, because a frame is not a node.

The three variants that used to express that ownership, `IdlessDiagnostic`, `IdentifiedDiagnostic` and `OptionalIdsDiagnostic`, are removed. A consumer that extended one extends `Diagnostic`. See ADR-097.

Call `validateV5(project)` yourself if you want the diagnostics without the throw. It returns an `Outcome`, so it is either `{ kind: "accepted", value, diagnostics }` or `{ kind: "refused", diagnostics }`, and a value never arrives beside an error. It is the same validator the engine uses, schema shape and graph topology both, so there is no second opinion to keep in sync.

Warnings load and stay readable. Missing `perspective` alongside 3D content, and an unused free track, are warnings. No flag promotes a warning to an error.

## Rule ids worth knowing

- `trigger-shape`, for a non-object trigger or a type outside `scroll`, `time`, and `manual`.
- `trigger-time-duration`, for a `time` duration that is absent, non-numeric, non-finite, or not greater than zero.
- `trigger-time-autoplay-unsupported`, for a playback field that would otherwise validate and then be ignored.
- `trigger-time-repeat-shape`, `trigger-time-yoyo-shape`, and `trigger-time-yoyo-requires-repeat`, for the loop fields: a `repeat` that is not an integer of `-1` or above, a `yoyo` that is not a boolean, and a `yoyo` with no repeat to reverse.
- `trigger-scroll-source`, for a `source` that is present but not a non-empty string.
- `trigger-driver-unavailable`, at `load()` or `addMotion`, when a declared `scroll` trigger resolves no source. This one is a construction failure, not a validation failure.
- `plugin-unknown-key`, when no registered plugin claims an authored keyframe key. This is the error you hit first if you forget to register a plugin. For a plugin-named group it also covers a group that names no registered plugin, and a leaf the named plugin does not claim.
- `keyframes-ungrouped-key`, when a top-level authored keyframe entry is not a plugin-named group. Bare stop arrays, static values, the retired wrapper, empty objects, and other objects that are not a named group are refused; put the leaf under the owning plugin group's `values` section.
- `plugin-unknown-requirement`, when a group binds a slot the named plugin does not declare. The path is the binding you wrote, including the key when you bound a dict entry.
- `plugin-contribution-unsupported-entry`, for the legacy `use` field, which is not part of schema v5.
- `project-templates-unsupported`, for a top-level `templates` field. It promised reusable keyframe bundles and nothing ever read one, so it is removed and then refused rather than left declared and carried through every rebuild untouched. Author the keyframes on the tracks that use them. The rule reads the key rather than the value at it, so `templates: undefined` is refused too: spreading an older document does not smuggle the field back in.
- `keyframe-group-unbound`, when a live binding or property edit names a plugin group this node does not author. `setRequire`, `removeRequire`, `setKeyframe` and `removeKeyframe` all edit a group that is already there, and for the property pair that precondition is also what keeps the edit cheap: a bound group's plugin is already in the chain, so a leaf cannot move it. Use `setKeyframeGroup` to originate the whole group instead of creating a partial binding.
- `keyframe-require-shape`, when a live binding edit crosses a slot's authored scalar or dict shape. Use `replace()` for a shape change rather than silently dropping an edge or a dict entry.
- `keyframe-goal-slot-reserved`, when `setRequire` or `removeRequire` addresses a solver's goals slot by name. Use `setGoal` or `removeGoal` with the member id.
- `keyframe-group-shape`, when `setKeyframeGroup` receives an object naming neither `values` nor `requires`. Remove the entry to author nothing; do not commit a husk.
- `observation-target-unsupported`, for a `target` on an `observes` entry. The field is removed rather than kept and ignored: it never decided which values arrived or under which keys. See ADR-046.
- `observation-role-unsupported`, for a `role` on an `observes` entry, at either value. Every edge an `observes` entry declares is an output edge, so `"output"` is refused for the same reason `"input"` is: writing the only legal value would be a field accepted and then ignored. See ADR-047.
- `observation-projection-unsupported`, for a `projection` on an `observes` entry. Renaming an upstream key existed to keep it from colliding inside a flat input bag, and an output edge merges the source's whole patch rather than renaming anything.

  For all three: bind the dependency under the plugin group's `requires` section when it feeds your track's composition, which is the only way a value enters composition at all. An upstream value arrives scoped to the plugin and slot that asked for it, so it can never replace an authored value of yours.

- `keyframes-reserved-separator`, when an authored keyframe name, group name, or leaf name contains `:`. The colon marks a plugin's private internal keys, so it is never legal in an authored name.
- `keyframes-duplicate-key`, when one compiled key is authored twice by leaves in different plugin groups. The path names the second spelling and the message names the first.

### The two forms of a leaf

A leaf inside a plugin group's `values` section is an array of stops, or a static scalar. There is no wrapper around either, and these three rule ids are the whole surface of that rule. A top-level leaf is refused by `keyframes-ungrouped-key`. See ADR-050 and ADR-121.

- `property-stops-wrapper`, for the retired `{ stops: [...] }` object. Refused by name rather than folded into a generic shape error, and never normalized: two authoring shapes would be two validation paths and two documentation paths. Drop the wrapper and keep the array; nothing else changes.
- `stops-shape`, when a leaf inside `values` is neither an array of stops nor a static number, string, or boolean. `null`, `undefined`, a non-finite number, a function, and any object other than `{}` and the retired wrapper land here, so `fk.values.length: { hold: 1 }` is a `stops-shape` error: no object is ever a static value (ADR-050). The same object one level up is a different mistake. At the top level of `keyframes` an entry is never a leaf, so `{ fk: { length: 62 } }`, whose members all read as leaves, is the pre-ADR-049 form and is reported as `keyframes-missing-values-section`, and every other ungrouped entry is `keyframes-ungrouped-key` (ADR-121). The id itself predates the bare form and keeps its name, because the animated form still is stops.
- `plugin-contribution-static-unsupported`, when a static leaf is authored on a key owned by a prepare-stage plugin with a `contribute` hook. Such a hook derives a contribution from stops, and a static leaf has none; calling it with an empty list would be a field accepted and then ignored.

A static leaf is worth understanding rather than just spelling. It never enters the interpolator, so it takes no percent-map entry and no tween, and it cannot collide with a sibling's `ease` because it has nowhere to carry one. `fk.values.length: 62` is not shorthand for two identical stops; it is a different and cheaper thing.

The stop rules themselves are unchanged: `stop-position` for a non-finite `p`, `stop-position-range` outside `[0, 1]`, `stop-position-order` for a non-monotonic sequence, `stop-position-duplicate` for a repeated position, and `stop-missing-start` and `stop-missing-end` as warnings.

Those same stop rules answer for a live write that names an animated key, because an authored stop list is definition-shaped input wherever it arrives from. A malformed one is refused by the validator a whole definition goes through, before anything mutates, and the throw is the usual `TypeError` carrying the diagnostics. A static-only live write never reaches it. See ADR-060.

### The two sections of a plugin group

A plugin-named group has exactly two members, `values` and `requires`, and both names are reserved. These five rule ids are the whole surface of that rule. See ADR-049.

- `keyframes-missing-values-section`, when a group authors its properties directly under the plugin name instead of under `values`, as in the pre-ADR-049 form `{ fk: { length: 62 } }`. It is refused by name rather than normalized: two authoring shapes would be two validation paths and two documentation paths. Put the leaves under `values`; nothing else changes. A top-level object whose members do not all read as leaves names neither a section nor a leaf set, and is `keyframes-ungrouped-key` instead.
- `keyframes-unknown-section`, for any key inside a group that is neither `values` nor `requires`. The message names both legal sections. A typo'd section is reported as one rather than misread as a property with no stops.
- `keyframes-values-shape`, when `values` is present but not an object.
- `keyframes-values-empty`, when `values` is an empty object. Omitting the section is already how you author no properties, so an empty one would be a field accepted and then ignored.
- `keyframes-reserved-section`, for a top-level `values` or a top-level `requires`. A section name at the top level addresses no plugin, so nothing written there could have an owner.

Two shapes deliberately stay legal. A group may author `requires` with no `values`, which is how a plugin joins composition to receive an upstream value without animating anything of its own. And a leaf named `values` _inside_ the section is an ordinary property, because the reservation is on section position rather than on the string everywhere.

Malformed or duplicate ids, reserved namespace characters, malformed edges, unknown sources, duplicate edges, self-reference, and cycles are all errors too. Track ids may not contain `/`, and motion ids may not contain `/` or equal `~`, because those characters carry the qualified namespace.

### Slots whose value is a dict of sources

Most slots inside `requires` name one source id. A slot may take a dict instead: one source id per key you name, which is how a solver addresses one goal per chain leaf under `targets`, keyed by each leaf's own member id. Which of the two a slot takes is declared by the plugin that owns it, and is never derived from the slot's name, so any plugin may declare one. See ADR-052 and ADR-057.

Shape first, with no plugin registry in reach:

- `keyframes-targets-shape`, when `targets` is present but is not an object mapping member ids to source ids. An array lands here too. This is the one rule still keyed on a slot name, because only the name can answer it: this slot carries a solver's goal dict, so a scalar at it is malformed rather than the ordinary scalar binding it would be anywhere else.
- `keyframes-requires-dict-empty`, when a dict-valued slot is an empty object. Omitting the slot is already how you bind nothing through it.
- `keyframes-requires-dict-key`, when a key is empty, or contains `:`, `[`, or `]`. A dict key is an authored name, and authored names reserve the colon for internal keys. The brackets go with it because they were refused before and no authored spelling gains legality in a change that moves none.
- `keyframes-requires-dict-source`, when the source a key is mapped to is not a non-empty source id.

Then the declaration, which only the plugin registry can answer, and which answers in both directions:

- `plugin-requirement-dict-unsupported`, when you author a dict at a slot that takes one source. The parser expands a dict under any slot, because it holds no registry and a slot name proves nothing either way, so this is the rule that keeps a dict at `fk`'s `root` from being accepted and then ignored.
- `plugin-requirement-dict-required`, when you author one source at a slot that takes a dict. Its mirror: a plugin reading that slot as a keyed record would otherwise be handed one node's values under the slot itself, with nothing to say you meant something else.

`keyframes-targets-empty`, `keyframes-targets-member` and `keyframes-targets-source` were the earlier names of the three dict shape rules, from when a dict was one reserved slot's private shape. They are renamed rather than kept, because a diagnostic has to name what you wrote and `keyframes-targets-member` firing at `spring.requires.tensions.seg-a` names something else.

The shape rules are shape only, and deliberately not membership. Whether a key names a real member of that solver's chain is derived from `solver` edges during graph construction, which is the only owner that knows the member set.

### Inverse Kinematics and solver rules

Solvers (`ikPlugin`) and solved bones (`fkPlugin`) enforce topological and keyframe constraints at load time before execution begins. See ADR-051, ADR-052, ADR-053, ADR-054, and ADR-055.

- `ik-solver-no-root`, when a solver node does not bind the `root` requirement slot. The root frame is the static or parent anchor from which the chain hangs.
- `ik-solver-no-members`, when a solver node declares a `root` slot but no downstream bones bind `solver` to it. The solver would compute in a vacuum without controlling any joints.
- `ik-solver-no-goal`, when a solver has a root and members and binds neither the bare `target` slot nor a goal through `targets`. A solve with nothing to reach for has no answer, and this is refused at load rather than left to the composition, which used to throw on it every tick and block every member of the chain behind an `error`.
- `ik-solver-unreachable-root`, when tracing a member bone's `base` parent walk upward fails to terminate at the solver's bound `root`. The member chain must form a contiguous ancestor hierarchy rooted at `root`.
- `ik-mode-ambiguous`, when a single node binds `solver` alongside `root` or a goal, or binds `root` under multiple plugins. A track is either a solver or a member, never both. It reads the goal classification rather than the literal slot name `target`, because a member binding `solver` beside a goal dict of its own would otherwise load clean with one real input edge per goal and have every one of them ignored.
- `ik-solved-rotation-dead`, when a bone that binds `keyframes.fk.requires.solver` authors `values.rotation` and no `values.weight` beside it. With no weight there is no runtime state in which the authored rotation is read, so it is dead input and refused. Either drop it, or author the `weight` that gives it something to mean. The internal 3D member is read the same way for each of its orientation keys: an `fk3d` group that binds `solver` and authors any of `rotation`, `rotationX` or `rotationY` with no `weight` beside it is refused by this rule, because the solve replaces each of them at the default weight. See ADR-116.
- `ik-weight-without-solver`, when a node that bound a `solver` slot under one plugin authors `values.weight` under another. It is the mirror of the rule above: the solve cannot reach a key outside the group that asked for it, so `fk` short-circuits to the authored rotation, never reads that weight, and the key is silently inert. Both rules read the group that bound the slot and no other, which is why binding `solver` under `spring` and authoring `weight` under `fk` is refused rather than passed.

Both of those rules speak only about a node that bound a solver somewhere, and that is a boundary rather than a gap. A `weight` on a bone that bound no solver at all is inert too, and nothing refuses it: `weight` is claimed by `fkPlugin` and may be claimed by any other plugin under ADR-043, and the load-time rule holds no plugin registry, so on a node with no solve in reach it cannot tell a blend weight from another plugin's own live input and does not guess. It is the same boundary that keeps a member's `rotation` in an unrelated plugin group out of `ik-solved-rotation-dead`.

The `weight` those two rules police is the blend between a bone's authored rest pose and its solver's output, per member rather than per solver, so a chain can stagger its reach. It defaults to `1`, which is the unconditional override every rig had before the key existed, `0` is exactly the authored rotation with the solve discarded, and anything between takes the shorter of the two arcs between them. Values outside `[0, 1]`, from an overshoot-easing curve for instance, are clamped rather than extrapolated, and a non-finite weight reads as `1`, identically to omitting the key. See ADR-055.

Goal influence ([ADR-110](../ADR-110-goal-influence-and-conflict-policy.md)) adds two load rules:

- `ik-influence-malformed`, when a member's `influence` under the group that bound its `solver`
  is not one static finite number greater than `0`. Author a positive finite static number; animated,
  zero, negative, non-finite, and malformed values are refused.
- `ik-influence-without-goal`, when an influence is under a group that did not bind `solver`, or a
  placed influence is on a member that no resolved goal addresses. Put it on the addressed chain
  leaf and under the group that binds the member's solver. A node with no solver is not narrowed by
  this rule, and an undecided goal shape is not reported twice; placement is checked before value
  classification.

A valid influence is a goal's pull when a branching solve compromises over a shared member. The
branch pull is the mean influence of its addressed leaves, and `conflicted` quality names a
remaining miss whose last inward-pass branch spread exceeds tolerance. Opted-in inspection has nine
quality kinds and the fixed shape `{ kind, residual, iterations, atBound, residuals }`; `residuals`
reports one frozen world-unit miss per addressed leaf. See ADR-110.

Constrained solving ([ADR-108](../ADR-108-constrained-2d-solving.md)) adds six load rules for
joint limits and the bend hint:

- `ik-limit-malformed`, when `minRotation` or `maxRotation` under the solver-owning group is not a
  finite static number in `[-180, 180]`. Animated limits are not supported; author a static bound.
  A keyframed bound is refused because the solve reads the resolved value as one static key.
- `ik-limit-empty`, when the resolved minimum is greater than the resolved maximum. Omit either bound
  to use `-180` or `180` respectively.
- `ik-limit-without-solver`, when a member authors a rotation limit under a group that does not bind
  `solver` there. Limit keys are solver vocabulary, so `spring.values.minRotation` beside
  `fk.requires.solver` is refused rather than silently constraining the solve. Put the limit in the
  group whose solver controls that member.
- `ik-bend-malformed`, when a solver's `bend` value under the group that bound its `root` is not
  the static string `"positive"` or `"negative"`.
- `ik-bend-conflicts-flip`, when one solver authors both `bend` and the legacy `flip` spelling under
  the group that bound its `root`. Use `bend` alone; `"positive"` is `flip: true` and bends the
  elbow toward increasing rotation, and `"negative"` is `flip: false`.
- `ik-solver-key-misgrouped`, when a solver node authors `bend`, `flip` or `inspect` under a group
  that did not bind its `root`. The solve reads the flattened values, so `spring.values.bend` beside
  `ik.requires.root` would steer the solve from a group that does not own it. Author the key under the
  group that bound `root`. On a node that bound no `root` these keys are not solver vocabulary, so
  another plugin's own `bend` or `flip` there is neither read nor refused.

An out-of-range solved angle is not an error: the solve moves it to the bound nearer on the circle,
so `[90, 170]` answers `-170` with `170`, and a miss caused by a bound is reported as `limited` quality.

Opt-in solve inspection ([ADR-109](../ADR-109-opt-in-solve-inspection.md)) adds one load rule, and
`ik-solver-key-misgrouped` above covers `inspect` exactly as it covers `bend` and `flip`:

- `ik-inspect-malformed`, when a solver's `inspect` under the group that bound its `root` is not a
  static boolean. Use `ik.values.inspect: true` to request the solver's fixed-shape `inspection`
  output, or `false` to opt out. A keyframed switch is refused because an output that appears
  mid-timeline would make the patch shape unstable. Inspection is data, not a warning.
  The internal `ik3d` prototype reads the same switch under the same two rules and publishes the
  same record ([ADR-120](../ADR-120-3d-opt-in-inspection.md)).

Goal addressing has six rules of its own, and they are answered during graph construction rather than by the contract layer, because membership is derived from `solver` edges and the contract layer holds no graph:

- `ik-goal-unknown-member`, when a key inside `targets` qualifies to no member of that solver's chain.
- `ik-goal-not-leaf`, when a goal is authored on a member that another member hangs from. A goal is what a chain tip reaches for; an interior joint has no separate destination.
- `ik-leaf-without-goal`, when the dict was used at all and a leaf it never named is left with nothing to reach for. It does not fire for a solver that bound the bare `target` slot, which has no goal to be missing, and it never fires beside `ik-solver-no-goal`, which answers for a solver that addressed nothing at all.
- `ik-goal-duplicate`, when two authored keys qualify to one member id. The dict itself cannot repeat a key, so this is always two spellings of one id, such as `forearm` and `walker/forearm`.
- `ik-goal-conflict`, when one solver authors both `target` and `targets`. Both spellings are supported and neither is deprecated, but a solver picks one.
- `ik-target-not-single-leaf`, when a solver binds the bare `target` slot over a chain with more than one leaf. `target` names no member, so it can only address a leaf while there is one leaf to address; over two it has no answer, and the diagnostic names both so the choice is yours to make. A linear chain has one leaf however long it is, so the bare slot keeps working past two bones. Address goals by member id instead.

Those six answer about the member a key names. Whether the slot was allowed to carry keys at all is a separate question with a separate owner, in the dict section above, and the two never report together: a solver whose `targets` binding was refused by the registry derives no goal for these rules to resolve.

The 2D `ik` solver has no rule about chain length. Its derived member count is free, and the solve dispatches on it: two members and one goal take the analytic closed form, and everything else takes the iterative one. `ik-solver-unsupported-arity` refused every derived member count other than two and is deleted rather than widened, because a rule that refuses a shape the runtime solves is worse than no rule.

A solver whose plugin cannot solve every derived shape declares the one it can, and the graph
refuses the rest at load. That is one rule, and only the internal `ik3d` prototype declares a
narrower shape:

- `ik-chain-unsupported`, when a solver's plugin declares a narrower chain than the graph derived
  for it. The internal phase 8 `ik3d` solver declares exactly two `fk3d` members on one path from
  its root, so a one-member, three-member, branched or mixed-dimension `ik3d` rig is refused at load
  rather than erroring its solver, or composing identity, on every tick. `fk3d` is dedicated to that
  shape, so the 2D `ik` solver, which takes a chain of any count and branching, reports the rule
  only for an `fk3d` member bound to it. See ADR-114.

The internal `ik3d` prototype also declares an optional `pole` slot, and one rule answers where it
was bound:

- `ik-pole-without-chain`, when a node binds `pole` under a plugin that declares the slot, today
  `ik3d` alone, in a group that bound no `root` on the same node. The solve that reads a pole is
  the group that bound the chain's `root`, so the usual mistake, an `ik3d` group on the elbow
  member holding only the pole, bends nothing and is refused at load rather than throwing from
  that group on every tick. A pole under a plugin that declares no pole slot, `fk3d` or the 2D
  `ik`, is `plugin-unknown-requirement` from the registry instead, never both. See ADR-118.

The 2D `ik` solver has no rule about a solved bone's pivot offset either, for the same reason. A solved member may author `x` and `y` exactly as any other bone does, and `ik-solved-pivot-unsupported` is deleted. `fk` still owns applying the offset, in its parent's rotated space; `ik` accounts for it in the geometry it solves, so the rotations it publishes are the ones that put the composed tip on the goal. Both solves share one convention: the analytic path folds the two offsets into a fixed base point and a rigid link with a twist, and the iterative one solves pivot positions and averages a shared sub-base's tip rather than its children's twists. An offset that shortens a chain's reach past its goal is an unreachable target, which extends the chain toward it and has never been a diagnostic. See ADR-054.

A diagnostic about a grouped keyframe cites the path you typed, `keyframes.fk.values.length`, not the flattened key the compiler works with. A diagnostic about a stop cites its index on the property, `keyframes.transform.values.x[0].p`. A diagnostic about a dict entry cites the key you typed, `keyframes.ik.requires.targets.forearm`, and there is no derived slot spelling for it to cite instead: the key is carried beside the slot as data rather than formatted into it. Every path a leaf diagnostic carries is a path you wrote. See ADR-041, ADR-049, ADR-050, ADR-051, ADR-052, and ADR-057.

## A frame has two failure owners

Every tick does two things: it advances the clock consumers, which is where playback progress and every trigger driver live, and then it flushes the graph. These are separate error boundaries with separate rule ids, so a diagnostic tells you which one failed:

- `clock-consumer-failure`, when advancing this frame's consumers threw. The message names the tick and carries every original cause, including each one collected by the fanout when several consumers fail together.
- `flush-failure`, when the graph flush for that frame threw, or when a scheduled follow-up flush did.

A driver bug is never reported as `flush-failure`, and the graph still flushes on a frame whose consumers failed, so one broken driver does not cost every other node its frame. A frame where both fail reports both, in the order they happened. `path` is the tick the failure happened on. See ADR-039.

## Runtime trouble arrives on the patch

A node that exists but cannot produce a value publishes with status `blocked` or `error` carrying its refusal and nothing else, with the reason inline in `patch.diagnostics`. It does not keep its last known values: `values`, `sourceProgress` and `sourceRevisions` belong to `ready` alone since ADR-098, so a consumer that renders from `values` retains the last `ready` patch it received and renders from that. There is no separate diagnostics stream to subscribe to, by design. Batch-level diagnostics are on the `PatchBatch` that a flush produces.

That means a rendering consumer should branch on `patch.status` rather than assume every patch is renderable, and an inspector can read `patch.diagnostics` without any extra wiring.

A solve that does not reach its goal is not one of these. An iterative solve converges to within a
tolerance, and an unreachable goal leaves the chain fully extended toward it, so an unopted solver
publishes ordinary `ready` patches carrying only `rotations` in both cases. The solve result carries
one `SolveQuality` record for every strategy (ADR-107); an author may opt into it with
`ik.values.inspect: true`, which retains the authored `inspect` value and adds one `inspection` value
without emitting a per-tick diagnostic or warning. The inspection shape includes frozen per-leaf
`residuals`, and a multi-goal miss whose branch witness remains outside tolerance is `conflicted`,
not a claim that no pose exists. The visible tip gap caused by partial FK weight is composition-space
data owned by `fk`, not this solver-space record. See ADR-109 and ADR-110.

A solver that cannot solve at all is not one of these either, and that is the point of the load-time rules above. Every shape that would make a composition throw is refused before the graph is built, so `composition-failure` on a solver node means a bug in the plugin or the publisher rather than a rig you can fix by editing it. See ADR-053. The same holds for the one refusal the solve itself makes about a goal, `Solver goal on member "<id>" has a NaN <axis> coordinate, which names no point or direction to solve toward.`: no rig can deliver it, because a goal field that is not a finite number is read as zero before the solve and no node may publish a non-finite value, so seeing it means a defect rather than an authoring mistake. An infinite goal coordinate is not refused; the solve reads it as a direction (ADR-111, #489).

## Contract violations throw at the call site

These are your bugs, and they are loud on purpose rather than clamped or deferred:

- progress outside `[0, 1]` through a trigger port throws `RangeError: Progress must be between 0 and 1.`
- non-finite progress throws `TypeError: Motion progress must be finite.`
- `signal()` on a driver-backed motion throws, because that motion already has a source of progress.
- an unknown motion id on `signal` or `destroyMotion` throws `TypeError`.
- destroying a motion that still owns tracks throws `TypeError`. Remove its tracks first; a motion is destroyed empty.
- every member of a stale `TrackHandle` throws `StaleTrackHandleError`, which is exported from the package entry: the `definition` getter, `requires`, `remove()`, `replace()`, `addObserve()`, `removeObserve()`, `setRequire()`, `removeRequire()`, `setKeyframeGroup()`, `removeKeyframeGroup()`, `setGoal()`, `removeGoal()`, `setKeyframe()`, `removeKeyframe()`, `overrideValues()`, and `setValues()`. Four of them used to return silently, so one condition had two public failure contracts; the silence is withdrawn rather than documented. The error extends `TypeError` and keeps the message `Track "<id>" is no longer live.` verbatim, so an existing `instanceof TypeError` narrowing keeps matching, and it carries a stable `ruleId` of `stale-track-handle` beside the `nodeId` it refused, which is what to branch on instead of the message. `handle.live` is the non-throwing way to ask the same question, so cleanup whose second call is expected rather than mistaken guards instead of catching. On a disposed project `live` is `false` and `remove()` reports the disposal rather than the staleness, because the project's own lifecycle outranks one handle's. A handle survives its own `replace()`, because replacement preserves node identity and therefore the token. See ADR-056.
- a live value write refuses one key at a time with `LiveValueKeyError`, exported from the package entry beside `StaleTrackHandleError` and for the same reason. It extends `TypeError`, carries a stable `ruleId` of `live-value-key`, and names the `nodeId`, the `key`, and one `reason`. There are three reasons and they are the whole set. `unknown` is a key the track does not author, which is one answer for four cases: an unknown name, a key another plugin owns, a namespaced `key:like:this`, and an interpolator scratch `_key`. Ownership is settled at resolve time and neither reserved spelling can be authored, so a key with an owner is present in the authored record by construction and the other three are simply absent from it. Through `setKeyframe` a key the named group does not author yet is not `unknown` at all: that verb edits the authored record first, so the leaf is judged by the plugin registry over the candidate and an unclaimed one arrives as `plugin-unknown-key` at the path you wrote.
- `kind` is a leaf shape change: a scalar written over an animated key, or a stop list written over a static one. A live write moves a value; it does not change what a leaf is. A scalar for an animated key would delete that key from the compiled properties and a stop list for a static one would add it, so both are recompiles of a different shape and belong to `replace()`. It holds through `setKeyframe` too, and there it is a decision rather than an inherited limit: that verb does rewrite the authored record, so it could have compiled the crossing, and two authored shapes for one key stays a whole-definition question with one owner. See ADR-065.
- `prepared` is a key a plugin already decided the value of, through its preparation stage. The plugin's keyframes are merged over the authored ones, while a live write sits over the compiled base, so writing one would invert that precedence and make the live timeline disagree with the next real recompile. The refusal names it rather than picking a winner.
- `animated` was the fourth reason and is gone. It meant "the interpolator drives this key", and both entry points now write one: a static key is masked, an animated key has its tweens replaced on the live timeline, and an interpolator with no per-key write escalates to a recompile rather than refusing. A caller branching on `error.reason` is affected, which is the one break in that change. See ADR-060.
- every key is checked before anything is written, on both entry points, so a call naming one legal key and one refused key leaves the retained definition, the mask, the timeline, and the published patch exactly as they were: nothing is mutated, nothing is published, and the graph is not invalidated. See ADR-059.
- `handle.edit(recipe)` refuses two things by name, and both are about where a call was made. A recipe opened inside a recipe throws with `schema-transaction-nested`, because one transaction is the unit and nesting would give it two. A verb that applies immediately throws with `schema-transaction-immediate`, named at the verb so the message tells you which call to move out: `setTrigger` and `setStagger` on a `MotionHandle`, and `overrideValues`, `setValues`, `setKeyframe` and `removeKeyframe` on a `TrackHandle`. A settle step cannot refuse, so deferring one of those into the transaction would move its failure to after the graph had committed and the retained definition had moved, and one condition would end up with two failure contracts. A throw from inside the recipe commits nothing and leaves every handle it issued not live. See ADR-064.
- a disposed clock or trigger port throws when subscribed to.
- registering a plugin whose `keys`, `inputs`, or `outputs` contain `:` throws `TypeError`. That separator belongs to the internal-key rule, and a requirement slot is held to it too.
- registering two plugins that declare the same `input` throws `TypeError`. Two plugins claiming the same `key` does not: that is legal, and a group names the owner. Two plugins declaring the same requirement slot is legal as well, because a slot is addressed through its owning plugin's group and delivered scoped to it, so there is no namespace to share.

Declaring `targets`, or any other dict-valued slot, is ordinary rather than refused. It used to throw, because a goal reached its plugin through a slot-claim predicate and a declared slot would have been a second, unreachable spelling of the same binding. Declaring the slot with `dict: true` is now the only way the capability exists at all. See ADR-057.

## When several things fail at once

Teardown never stops halfway. Disposal runs every step, collects what failed, and reports once: a single failure is rethrown verbatim, and two or more arrive as one `AggregateError`. The same collect-then-report-once shape applies to clock consumer fanout and to patch listeners, so one badly behaved subscriber cannot silently stop the ones behind it.

The rule to remember when you see an `AggregateError`: the first entry in `errors` is the failure that actually caused the operation to be refused. The rest is cleanup noise attached to it.

When one of these reaches a diagnostic rather than your call site, the message is flattened rather than summarized. You get the boundary's own message followed by every cause it collected, joined by `; `, so nothing is hidden behind a value the diagnostic could not carry.
