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
- `track-legacy-field`, for `keyframes` or `observes` on a track. Both retired members are refused
  by name so an old document fails to load rather than loading with the member ignored.
- `plugin-unknown`, when a track names an id the catalog did not admit.
- `slot-unknown`, `slot-required-missing`, `slot-incompatible` and `slot-unproven`, for a dependency
  binding to an undeclared slot, a missing required slot, a producer whose output contract contradicts
  the slot, and a producer contract that cannot prove the slot. A binding to a source no node carries
  is `edge-unknown-source`.
- `values-shape-invalid`, when authored values are neither an array of rows nor a plain record, when a
  table row is malformed, or when an authored value edit changes the table or record shape the track
  committed to.
- `row-id-invalid` and `row-id-duplicate`, for an empty or repeated row envelope id. Duplicate
  identity invalidates the table even when the row a caller selects appears first.
- `cell-form-invalid`, `cell-kind-conflict`, `cell-stops-invalid` and `static-field-stops`, for a cell
  or field that does not match its declared shape.
- `cell-address-unknown`, when `input.values.setField` addresses a row the track does not author.
- `live-values-invalid`, when `writeValues` is given a value that does not satisfy the committed
  contract. The previous overlay stands when a write is refused.
- `project-templates-unsupported`, for a top-level `templates` field. Author values on the tracks that
  use them. The rule reads the key rather than the value, so `templates: undefined` is refused too.
- `id-shape`, `id-qualified-separator` and `id-reserved-namespace`, for malformed motion and track
  ids. Motion ids may not contain `/` or equal `~`; track ids may not contain `/`.

Malformed or duplicate ids, reserved namespace characters, malformed edges, unknown sources, duplicate edges, self-reference, and cycles are all errors too. Track ids may not contain `/`, and motion ids may not contain `/` or equal `~`, because those characters carry the qualified namespace.

### Slots whose value is a dict of sources

Most slots inside `requires` name one source id. A slot may take a map instead: one source id per
key you name. Which of the two a slot takes is declared by the plugin's `DependencySpec.binding`, and
the parser refuses a mismatch by name rather than deriving a mode from the slot.

- `plugin-requirement-dict-unsupported` refuses a map at a single-source slot.
- `plugin-requirement-dict-required` refuses one source at a map-valued slot.
- `requirement-source` refuses a binding whose source cannot be qualified or whose shape is not a
  source id or a map of source ids.

Whether a member key names a real member of a solver chain is a graph question, not a binding-shape
question; graph construction owns it.

### Inverse Kinematics and solver rules

Solvers (`ikPlugin`) and solved bones (`fkPlugin`) enforce topological and keyframe constraints at load time before execution begins. See ADR-051, ADR-052, ADR-053, ADR-054, and ADR-055.

- `ik-solver-no-root`, when a solver node does not bind the `root` requirement slot. The root frame is the static or parent anchor from which the chain hangs.
- `ik-solver-no-members`, when a solver node declares a `root` slot but no downstream bones bind `solver` to it. The solver would compute in a vacuum without controlling any joints.
- `ik-solver-no-goal`, when a solver has a root and members and binds neither the bare `target` slot nor a goal through `targets`. A solve with nothing to reach for has no answer, and this is refused at load rather than left to the composition, which used to throw on it every tick and block every member of the chain behind an `error`.
- `ik-solver-unreachable-root`, when tracing a member bone's `base` parent walk upward fails to terminate at the solver's bound `root`. The member chain must form a contiguous ancestor hierarchy rooted at `root`.
- `ik-mode-ambiguous`, when a single node binds `solver` alongside `root` or a goal, or binds `root` under multiple plugins. A track is either a solver or a member, never both. It reads the goal classification rather than the literal slot name `target`, because a member binding `solver` beside a goal dict of its own would otherwise load clean with one real input edge per goal and have every one of them ignored.
- `ik-solved-rotation-dead`, when a body row on a chain bound to a solver authors `rotation` and no `weight` beside it. With no weight there is no runtime state in which the authored rotation is read, so it is dead input and refused. Either drop it, or author the `weight` that gives it something to mean. The public 3D member is read the same way for each of its orientation keys: an `fk3d` body row on a solved chain that authors any of `rotation`, `rotationX` or `rotationY` with no `weight` beside it is refused by this rule when its chain takes the closed form (a parent and its one child), because that solve replaces each of them at the default weight. Under every other `ik3d` chain the 3D FABRIK tree solve reads the rest orientation as the frame each member's roll swings from, so there it is live input and loads. See ADR-116 and ADR-122.
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

3D goal orientation ([ADR-124](../ADR-124-3d-goal-influence-and-end-effector-orientation.md)) adds
two more, stated with the influence rules over one table so the placement and the classification
read alike:

- `ik-orient-malformed`, when an `fk3d` member's `orient` under the group that bound its `solver`
  is not one static finite number from `0` to `1`. Animated, negative, above `1`, non-finite and
  non-numeric values are refused.
- `ik-orient-without-goal`, when an `orient` is under a group that did not bind `solver`, or a
  placed orient is on a member that no resolved goal addresses. Put it on the addressed chain leaf
  under `fk3d`, the group that binds the member's solver.

Under `fk3d` both goal weights speak on a bone that bound no solver at all, because the 3D member
vocabulary is the contract's own: an `fk3d` `influence` or `orient` there is refused as
`ik-influence-without-goal` or `ik-orient-without-goal`, "which did not bind its solver". Under any
other group the no-solver narrowing above is unchanged, so no 2D rig moves.

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
- `slot-unknown`, when a solver track binds a slot its plugin does not declare, including `bend`, `flip` or `inspect` misgrouped as a requirement
  that did not bind its `root`. The solve reads the flattened values, so `spring.values.bend` beside
  `ik.requires.root` would steer the solve from a group that does not own it. Author the key under the
  group that bound `root`. On a node that bound no `root` these keys are not solver vocabulary, so
  another plugin's own `bend` or `flip` there is neither read nor refused.

An out-of-range solved angle is not an error: the solve moves it to the bound nearer on the circle,
so `[90, 170]` answers `-170` with `170`, and a miss caused by a bound is reported as `limited` quality.

Opt-in solve inspection ([ADR-109](../ADR-109-opt-in-solve-inspection.md)) adds one load rule, and
`slot-unknown` above covers `inspect` exactly as it covers `bend` and `flip`:

- `ik-inspect-malformed`, when a solver's `inspect` under the group that bound its `root` is not a
  static boolean. Use `values: { inspect: true }` on the `ik` track to request the solver's fixed-shape `inspect`
  output, or `false` to opt out. A keyframed switch is refused because an output that appears
  mid-timeline would make the patch shape unstable. Inspection is data, not a warning.
  The public `ik3d` solver reads the same switch under the same two rules and publishes the
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
refuses the rest at load. That is one rule, and only the public `ik3d` solver declares a
narrower shape:

- `ik-chain-unsupported`, when a solver's plugin declares a narrower chain than the graph derived
  for it. The public `ik3d` solver declares a chain of `fk3d` members only, of any count and any
  branching: two members on one path take the closed form and every other chain takes 3D FABRIK, so
  what is refused at load is a mixed-dimension rig, a member bound through `fk` or any plugin other
  than `fk3d`, which would otherwise compose identity on every tick. `fk3d` is dedicated to that
  shape, so the 2D `ik` solver, which takes a chain of any count and branching, reports the rule
  only for an `fk3d` member bound to it. See ADR-114 and ADR-122.

The public `ik3d` solver also declares an optional `pole` slot, and two rules answer where it
was bound and whether it can bend anything:

- `ik-pole-without-chain`, when a node binds `pole` under a plugin that declares the slot, today
  `ik3d` alone, in a group that bound no `root` on the same node. The solve that reads a pole is
  the group that bound the chain's `root`, so the usual mistake, an `ik3d` group on the elbow
  member holding only the pole, bends nothing and is refused at load rather than throwing from
  that group on every tick. A pole under a plugin that declares no pole slot, `fk3d` or the 2D
  `ik`, is `plugin-unknown-requirement` from the registry instead, never both. See ADR-118.
- `ik-pole-without-bend`, when a pole is bound where it belongs but the chain has no interior
  joint for it to bend: every member hangs straight from the root, a single member or a fan of
  them. Each such member is one segment pointing at its goal, so the pole would change nothing.
  Drop the pole, or add the member it was meant to bend. See ADR-122.

The public `ik3d` solver reads a 3D joint limit from each `fk3d` member's `joint`
([ADR-123](../ADR-123-3d-joint-limits.md)). Every angle bound reuses `ik-limit-malformed` and
`ik-limit-empty` above, `maxSwing` (in `[0, 180]`) and the twist range included, and a joint key
anywhere on a 3D member other than the `fk3d` group that bound its solver is
`ik-limit-without-solver`. Two rules are the joint's own:

- `ik-joint-malformed`, when `joint` is not one static `"free"`, `"hinge"`, `"cone"` or
  `"swing-twist"`, a hinge axis component is not a static finite number, an authored axis has no
  direction, or a `"cone"` or `"swing-twist"` has no `maxSwing`. The kind is never guessed.
- `ik-joint-key-unused`, when a bound sits beside a kind that does not read it: `minRotation` with
  no `joint` (a 3D range is a hinge's, so declare `joint: "hinge"`), `maxSwing` on a hinge, an axis
  on a cone, a twist bound on a cone. Declare the joint that reads it or remove it.

A goal a limit holds off is `limited` quality with `atBound`, not an error, exactly as in 2D.

The 2D `ik` solver has no rule about a solved bone's pivot offset either, for the same reason. A solved member may author `x` and `y` exactly as any other bone does, and `ik-solved-pivot-unsupported` is deleted. `fk` still owns applying the offset, in its parent's rotated space; `ik` accounts for it in the geometry it solves, so the rotations it publishes are the ones that put the composed tip on the goal. Both solves share one convention: the analytic path folds the two offsets into a fixed base point and a rigid link with a twist, and the iterative one solves pivot positions and averages a shared sub-base's tip rather than its children's twists. An offset that shortens a chain's reach past its goal is an unreachable target, which extends the chain toward it and has never been a diagnostic. See ADR-054.

A diagnostic about an authored value cites the path you wrote, `motions[0].tracks[0].input.values`,
rather than a compiled slot id. A diagnostic about a cell cites the row envelope and field,
`...input.values[1].cells.rotation`. A dependency diagnostic cites the slot you bound,
`...input.requires.chain`, and a map entry keeps its authored key rather than formatting it into the
slot. See ADR-041, ADR-044 and ADR-057.

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
`values: { inspect: true }` on an `ik` track, which adds one `inspect` output
without emitting a per-tick diagnostic or warning. The `inspect` shape includes frozen per-leaf
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
- every member of a stale `TrackHandle` throws `StaleTrackHandleError`, which is exported from the package entry: the `definition` getter, `requires`, `input`, `remove()`, `replace()`, `writeValues()`, and `releaseValues()`. Four of them used to return silently, so one condition had two public failure contracts; the silence is withdrawn rather than documented. The error extends `TypeError` and keeps the message `Track "<id>" is no longer live.` verbatim, so an existing `instanceof TypeError` narrowing keeps matching, and it carries a stable `ruleId` of `stale-track-handle` beside the `nodeId` it refused, which is what to branch on instead of the message. `handle.live` is the non-throwing way to ask the same question, so cleanup whose second call is expected rather than mistaken guards instead of catching. On a disposed project `live` is `false` and `remove()` reports the disposal rather than the staleness, because the project's own lifecycle outranks one handle's. A handle survives its own `replace()`, because replacement preserves node identity and therefore the token. See ADR-056.
- a live value write refuses a value that does not match the committed contract as `live-values-invalid`, carrying the diagnostics that name every offending path. The shape is validated before anything is published, the previous overlay stands, and the authored definition never moves. A valid write recomposes the node and clears an error on the next flush.
- `handle.edit(recipe)` refuses two things by name, and both are about where a call was made. A recipe opened inside a recipe throws with `schema-transaction-nested`, because one transaction is the unit and nesting would give it two. A verb that applies immediately throws with `schema-transaction-immediate`, named at the verb so the message tells you which call to move out: `setTrigger` and `setStagger` on a `MotionHandle`, and `seek`, `writeValues`, `releaseValues`, `input.values.set` and `input.values.setField` on a `TrackHandle`. A settle step cannot refuse, so deferring one of those into the transaction would move its failure to after the graph had committed and the retained definition had moved, and one condition would end up with two failure contracts. A throw from inside the recipe commits nothing and leaves every handle it issued not live. See ADR-064.
- a disposed clock or trigger port throws when subscribed to.
- registering a plugin whose `keys`, `inputs`, or `outputs` contain `:` throws `TypeError`. That separator belongs to the internal-key rule, and a requirement slot is held to it too.
- registering two plugins that declare the same `input` throws `TypeError`. Two plugins claiming the same `key` does not: that is legal, and a group names the owner. Two plugins declaring the same requirement slot is legal as well, because a slot is addressed through its owning plugin's group and delivered scoped to it, so there is no namespace to share.

Declaring `targets`, or any other dict-valued slot, is ordinary rather than refused. It used to throw, because a goal reached its plugin through a slot-claim predicate and a declared slot would have been a second, unreachable spelling of the same binding. Declaring the slot with `dict: true` is now the only way the capability exists at all. See ADR-057.

## When several things fail at once

Teardown never stops halfway. Disposal runs every step, collects what failed, and reports once: a single failure is rethrown verbatim, and two or more arrive as one `AggregateError`. The same collect-then-report-once shape applies to clock consumer fanout and to patch listeners, so one badly behaved subscriber cannot silently stop the ones behind it.

The rule to remember when you see an `AggregateError`: the first entry in `errors` is the failure that actually caused the operation to be refused. The rest is cleanup noise attached to it.

When one of these reaches a diagnostic rather than your call site, the message is flattened rather than summarized. You get the boundary's own message followed by every cause it collected, joined by `; `, so nothing is hidden behind a value the diagnostic could not carry.
