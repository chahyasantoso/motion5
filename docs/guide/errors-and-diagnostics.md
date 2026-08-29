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

A diagnostic is structured, and the shape is stable:

```ts
interface Diagnostic {
  readonly ruleId: string;
  readonly path: string;
  readonly message: string;
  readonly severity: "error" | "warning";
  readonly ids?: readonly string[];
}
```

Call `validateV5(project)` yourself if you want the diagnostics without the throw. It returns `{ valid, value, diagnostics }`, and it is the same validator the engine uses, so there is no second opinion to keep in sync.

Warnings load and stay readable. Missing `perspective` alongside 3D content, and an unused free track, are warnings. No flag promotes a warning to an error.

## Rule ids worth knowing

- `trigger-shape`, for a non-object trigger or a type outside `scroll`, `time`, and `manual`.
- `trigger-time-duration`, for a `time` duration that is absent, non-numeric, non-finite, or not greater than zero.
- `trigger-time-autoplay-unsupported`, for a playback field that would otherwise validate and then be ignored.
- `trigger-time-repeat-shape`, `trigger-time-yoyo-shape`, and `trigger-time-yoyo-requires-repeat`, for the loop fields: a `repeat` that is not an integer of `-1` or above, a `yoyo` that is not a boolean, and a `yoyo` with no repeat to reverse.
- `trigger-scroll-source`, for a `source` that is present but not a non-empty string.
- `trigger-driver-unavailable`, at `load()` or `addMotion`, when a declared `scroll` trigger resolves no source. This one is a construction failure, not a validation failure.
- `plugin-unknown-key`, when no registered plugin claims an authored keyframe key. This is the error you hit first if you forget to register a plugin. For a plugin-named group it also covers a group that names no registered plugin, and a leaf the named plugin does not claim.
- `plugin-ambiguous-key`, when a flat keyframe key is claimed by more than one registered plugin. The message names every claimant in sorted order; author the key inside the group of the plugin you meant. Registering both `transformPlugin` and `fkPlugin` is the case you will meet, because both claim `rotation`. See ADR-043.
- `plugin-contribution-unsupported-entry`, for the legacy `use` field, which is not part of schema v5.
- `observation-target-unsupported`, for a `target` on an `observes` entry. The field is removed rather than kept and ignored: it never decided which values arrived or under which keys. See ADR-046.
- `observation-role-unsupported`, for a `role` on an `observes` entry, at either value. Every edge an `observes` entry declares is an output edge, so `"output"` is refused for the same reason `"input"` is: writing the only legal value would be a field accepted and then ignored. See ADR-047.
- `observation-projection-unsupported`, for a `projection` on an `observes` entry. Renaming an upstream key existed to keep it from colliding inside a flat input bag, and an output edge merges the source's whole patch rather than renaming anything.

  For all three: bind the dependency under the plugin group's `requires` section when it feeds your track's composition, which is the only way a value enters composition at all. An upstream value arrives scoped to the plugin and slot that asked for it, so it can never replace an authored value of yours.

- `keyframes-reserved-separator`, when a flat keyframe name, a group name, or a leaf name contains `:`. The colon marks a plugin's private internal keys, so it is never legal in an authored name.
- `keyframes-duplicate-key`, when one compiled key is authored twice: a group leaf colliding with another group's leaf, or with a flat key. The path names the second spelling and the message names the first.

### The two forms of a leaf

A property is an array of stops, or a static scalar. There is no wrapper around either, and these three rule ids are the whole surface of that rule. See ADR-050.

- `property-stops-wrapper`, for the retired `{ stops: [...] }` object. Refused by name rather than folded into a generic shape error, and never normalized: two authoring shapes would be two validation paths and two documentation paths. Drop the wrapper and keep the array; nothing else changes.
- `stops-shape`, when a leaf is neither an array of stops nor a static number, string, or boolean. `null`, `undefined`, a non-finite number, and a function all land here. An object does not, and that is deliberate: a key holding a record of leaves is the pre-ADR-049 group shape whatever the key is called, so `x: { hold: 1 }` is reported as `keyframes-missing-values-section` and keeps the more specific id. What ADR-050 closes is that no object is ever a static value; which refusal names it belongs to ADR-049. The id itself predates the bare form and keeps its name, because the animated form still is stops.
- `plugin-contribution-static-unsupported`, when a static leaf is authored on a key owned by a prepare-stage plugin with a `contribute` hook. Such a hook derives a contribution from stops, and a static leaf has none; calling it with an empty list would be a field accepted and then ignored.

A static leaf is worth understanding rather than just spelling. It never enters the interpolator, so it takes no percent-map entry and no tween, and it cannot collide with a sibling's `ease` because it has nowhere to carry one. `length: 62` is not shorthand for two identical stops; it is a different and cheaper thing.

The stop rules themselves are unchanged: `stop-position` for a non-finite `p`, `stop-position-range` outside `[0, 1]`, `stop-position-order` for a non-monotonic sequence, `stop-position-duplicate` for a repeated position, and `stop-missing-start` and `stop-missing-end` as warnings.

### The two sections of a plugin group

A plugin-named group has exactly two members, `values` and `requires`, and both names are reserved. These five rule ids are the whole surface of that rule. See ADR-049.

- `keyframes-missing-values-section`, when a group authors its properties directly under the plugin name instead of under `values`. This is the pre-ADR-049 shape, and it is refused by name rather than normalized: two authoring shapes would be two validation paths and two documentation paths. Wrap the leaves; nothing else changes. It also covers an object written where a leaf belongs, such as `x: { hold: 1 }`, because that is the same shape as a group whose leaves sit directly under the plugin name and no reader can tell the two apart.
- `keyframes-unknown-section`, for any key inside a group that is neither `values` nor `requires`. The message names both legal sections. A typo'd section is reported as one rather than misread as a property with no stops.
- `keyframes-values-shape`, when `values` is present but not an object.
- `keyframes-values-empty`, when `values` is an empty object. Omitting the section is already how you author no properties, so an empty one would be a field accepted and then ignored.
- `keyframes-reserved-section`, for a top-level `values` or a top-level `requires`. A section name at the top level addresses no plugin, so nothing written there could have an owner.

Two shapes deliberately stay legal. A group may author `requires` with no `values`, which is how a plugin joins composition to receive an upstream value without animating anything of its own. And a leaf named `values` _inside_ the section is an ordinary property, because the reservation is on section position rather than on the string everywhere.

Malformed or duplicate ids, reserved namespace characters, malformed edges, unknown sources, duplicate edges, self-reference, and cycles are all errors too. Track ids may not contain `/`, and motion ids may not contain `/` or equal `~`, because those characters carry the qualified namespace.

### The one binding whose value is not a source id

Every slot inside `requires` names one source id, with exactly one exception. `targets` holds a record instead: the goal each chain member of a solver reaches toward, keyed by that member's own id. It is the only reserved slot name in the section, and these four rule ids are the whole surface of its shape. See ADR-052.

- `keyframes-targets-shape`, when `targets` is present but is not an object mapping member ids to source ids. An array lands here too. `keyframes-requires-source` cannot answer for this slot, because it refuses a record outright, which is what made the dict unauthorable before the goal grammar existed.
- `keyframes-targets-empty`, when `targets` is an empty object. Omitting the slot is already how a solver authors no goals through the dict.
- `keyframes-targets-member`, when a member key is empty, or contains `:`, `[`, or `]`. Each goal expands into its own binding at a derived slot identity of `targets[<memberId>]`, so a bracket in an authored name could forge that identity. Same reservation argument as the colon.
- `keyframes-targets-source`, when the goal a member is mapped to is not a non-empty source id.

These four are shape only, and deliberately not membership. Whether a key names a real member of that solver's chain is derived from `solver` edges during graph construction, which is the only owner that knows the member set.

### Inverse Kinematics and solver rules

Solvers (`ikPlugin`) and solved bones (`fkPlugin`) enforce topological and keyframe constraints at load time before execution begins. See ADR-051, ADR-052, ADR-053, ADR-054, and ADR-055.

- `ik-solver-no-root`, when a solver node does not bind the `root` requirement slot. The root frame is the static or parent anchor from which the chain hangs.
- `ik-solver-no-members`, when a solver node declares a `root` slot but no downstream bones bind `solver` to it. The solver would compute in a vacuum without controlling any joints.
- `ik-solver-no-goal`, when a solver has a root and members and binds neither the bare `target` slot nor a goal through `targets`. A solve with nothing to reach for has no answer, and this is refused at load rather than left to the composition, which used to throw on it every tick and block every member of the chain behind an `error`.
- `ik-solver-unreachable-root`, when tracing a member bone's `base` parent walk upward fails to terminate at the solver's bound `root`. The member chain must form a contiguous ancestor hierarchy rooted at `root`.
- `ik-mode-ambiguous`, when a single node binds `solver` alongside `root` or a goal, or binds `root` under multiple plugins. A track is either a solver or a member, never both. It reads the goal grammar rather than the literal slot name `target`, because a member binding `solver` beside a goal dict of its own would otherwise load clean with one real input edge per goal and have every one of them ignored.
- `ik-solved-rotation-dead`, when a bone that binds `keyframes.fk.requires.solver` authors `values.rotation` and no `values.weight` beside it. With no weight there is no runtime state in which the authored rotation is read, so it is dead input and refused. Either drop it, or author the `weight` that gives it something to mean.
- `ik-weight-without-solver`, when a node that bound a `solver` slot under one plugin authors `values.weight` under another. It is the mirror of the rule above: the solve cannot reach a key outside the group that asked for it, so `fk` short-circuits to the authored rotation, never reads that weight, and the key is silently inert. Both rules read the group that bound the slot and no other, which is why binding `solver` under `spring` and authoring `weight` under `fk` is refused rather than passed.

Both of those rules speak only about a node that bound a solver somewhere, and that is a boundary rather than a gap. A `weight` on a bone that bound no solver at all is inert too, and nothing refuses it: `weight` is claimed by `fkPlugin` and may be claimed by any other plugin under ADR-043, and the load-time rule holds no plugin registry, so on a node with no solve in reach it cannot tell a blend weight from another plugin's own live input and does not guess. It is the same boundary that keeps a member's flat `rotation` out of `ik-solved-rotation-dead`.

The `weight` those two rules police is the blend between a bone's authored rest pose and its solver's output, per member rather than per solver, so a chain can stagger its reach. It defaults to `1`, which is the unconditional override every rig had before the key existed, `0` is exactly the authored rotation with the solve discarded, and anything between takes the shorter of the two arcs between them. Values outside `[0, 1]`, from an overshoot-easing curve for instance, are clamped rather than extrapolated, and a non-finite weight reads as `1`, identically to omitting the key. See ADR-055.

Goal addressing has six rules of its own, and they are answered during graph construction rather than by the contract layer, because membership is derived from `solver` edges and the contract layer holds no graph:

- `ik-goal-unknown-member`, when a key inside `targets` qualifies to no member of that solver's chain.
- `ik-goal-not-leaf`, when a goal is authored on a member that another member hangs from. A goal is what a chain tip reaches for; an interior joint has no separate destination.
- `ik-leaf-without-goal`, when the dict was used at all and a leaf it never named is left with nothing to reach for. It does not fire for a solver that bound the bare `target` slot, which has no goal to be missing, and it never fires beside `ik-solver-no-goal`, which answers for a solver that addressed nothing at all.
- `ik-goal-duplicate`, when two authored keys qualify to one member id. The dict itself cannot repeat a key, so this is always two spellings of one id, such as `forearm` and `walker/forearm`.
- `ik-goal-conflict`, when one solver authors both `target` and `targets`. Both spellings are supported and neither is deprecated, but a solver picks one.
- `ik-target-not-single-leaf`, when a solver binds the bare `target` slot over a chain with more than one leaf. `target` names no member, so it can only address a leaf while there is one leaf to address; over two it has no answer, and the diagnostic names both so the choice is yours to make. A linear chain has one leaf however long it is, so the bare slot keeps working past two bones. Address goals by member id instead.

There is no rule about chain length. A solver's derived member count is free, and the solve dispatches on it: two members and one goal take the analytic closed form, and everything else takes the iterative one. `ik-solver-unsupported-arity` refused every derived member count other than two and is deleted rather than widened, because a rule that refuses a shape the runtime solves is worse than no rule.

There is no rule about a solved bone's pivot offset either, for the same reason. A solved member may author `x` and `y` exactly as any other bone does, and `ik-solved-pivot-unsupported` is deleted. `fk` still owns applying the offset, in its parent's rotated space; `ik` accounts for it in the geometry it solves, so the rotations it publishes are the ones that put the composed tip on the goal. Both solves share one convention: the analytic path folds the two offsets into a fixed base point and a rigid link with a twist, and the iterative one solves pivot positions and averages a shared sub-base's tip rather than its children's twists. An offset that shortens a chain's reach past its goal is an unreachable target, which extends the chain toward it and has never been a diagnostic. See ADR-054.

A diagnostic about a grouped keyframe cites the path you typed, `keyframes.fk.values.length`, not the flattened key the compiler works with. A diagnostic about a stop cites its index on the property, `keyframes.x[0].p`. A diagnostic about a goal cites the member key you typed, `keyframes.ik.requires.targets.forearm`, rather than the slot identity it derives. Every path a leaf diagnostic carries is a path you wrote. See ADR-041, ADR-049, ADR-050, ADR-051, and ADR-052.

## A frame has two failure owners

Every tick does two things: it advances the clock consumers, which is where playback progress and every trigger driver live, and then it flushes the graph. These are separate error boundaries with separate rule ids, so a diagnostic tells you which one failed:

- `clock-consumer-failure`, when advancing this frame's consumers threw. The message names the tick and carries every original cause, including each one collected by the fanout when several consumers fail together.
- `flush-failure`, when the graph flush for that frame threw, or when a scheduled follow-up flush did.

A driver bug is never reported as `flush-failure`, and the graph still flushes on a frame whose consumers failed, so one broken driver does not cost every other node its frame. A frame where both fail reports both, in the order they happened. `path` is the tick the failure happened on. See ADR-039.

## Runtime trouble arrives on the patch

A node that exists but cannot produce a value publishes with status `blocked` or `error` and keeps its last known values, with the reason inline in `patch.diagnostics`. There is no separate diagnostics stream to subscribe to, by design. Batch-level diagnostics are on the `PatchBatch` that a flush produces.

That means a rendering consumer should branch on `patch.status` rather than assume every patch is renderable, and an inspector can read `patch.diagnostics` without any extra wiring.

A solve that does not reach its goal is not one of these. An iterative solve converges to within a tolerance, and an unreachable goal leaves the chain fully extended toward it, so both publish ordinary `ready` patches carrying only `rotations`. No convergence record reaches a patch, deliberately: roughly four percent of ordinary reachable chains do not reach tolerance before the iteration cap, so a per-tick diagnostic would fire on rigs nobody would call broken. See ADR-052.

A solver that cannot solve at all is not one of these either, and that is the point of the load-time rules above. Every shape that would make a composition throw is refused before the graph is built, so `composition-failure` on a solver node means a bug in the plugin or the publisher rather than a rig you can fix by editing it. See ADR-053.

## Contract violations throw at the call site

These are your bugs, and they are loud on purpose rather than clamped or deferred:

- progress outside `[0, 1]` through a trigger port throws `RangeError: Progress must be between 0 and 1.`
- non-finite progress throws `TypeError: Motion progress must be finite.`
- `signal()` on a driver-backed motion throws, because that motion already has a source of progress.
- an unknown motion id on `signal` or `destroyMotion` throws `TypeError`.
- destroying a motion that still owns tracks throws `TypeError`. Remove its tracks first; a motion is destroyed empty.
- a disposed clock or trigger port throws when subscribed to.
- registering a plugin whose `keys`, `inputs`, or `outputs` contain `:` throws `TypeError`. That separator belongs to the internal-key rule.
- registering a plugin that declares `targets`, or a requirement slot matching the derived goal spelling, throws `TypeError`. Those names belong to the goal grammar, and a plugin reaches a goal through its slot-claim predicate instead.
- registering two plugins that declare the same `input` throws `TypeError`. Two plugins claiming the same `key` does not: that is legal, and a group names the owner.

## When several things fail at once

Teardown never stops halfway. Disposal runs every step, collects what failed, and reports once: a single failure is rethrown verbatim, and two or more arrive as one `AggregateError`. The same collect-then-report-once shape applies to clock consumer fanout and to patch listeners, so one badly behaved subscriber cannot silently stop the ones behind it.

The rule to remember when you see an `AggregateError`: the first entry in `errors` is the failure that actually caused the operation to be refused. The rest is cleanup noise attached to it.

When one of these reaches a diagnostic rather than your call site, the message is flattened rather than summarized. You get the boundary's own message followed by every cause it collected, joined by `; `, so nothing is hidden behind a value the diagnostic could not carry.
