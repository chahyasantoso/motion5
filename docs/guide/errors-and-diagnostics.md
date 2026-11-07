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

Call `validateV5(project, catalog)` yourself if you want the diagnostics without the throw. It returns an `Outcome`, so it is either `{ kind: "accepted", value, diagnostics }` or `{ kind: "refused", diagnostics }`, and a value never arrives beside an error. It is the same validator the engine uses, schema shape and graph topology both, so there is no second opinion to keep in sync.

Warnings load and stay readable: a blocked source publishes `source-pending`, and deferred value batches report the ids they deferred. No flag promotes a warning to an error.

## Rule ids worth knowing

- `trigger-shape`, for a non-object trigger or a type outside `scroll`, `time`, and `manual`.
- `trigger-time-duration`, for a `time` duration that is absent, non-numeric, non-finite, or not greater than zero.
- `trigger-time-autoplay-unsupported`, for a playback field that would otherwise validate and then be ignored.
- `trigger-time-repeat-shape`, `trigger-time-yoyo-shape`, and `trigger-time-yoyo-requires-repeat`, for the loop fields: a `repeat` that is not an integer of `-1` or above, a `yoyo` that is not a boolean, and a `yoyo` with no repeat to reverse.
- `trigger-scroll-source`, for a `source` that is present but not a non-empty string.
- `ease-unknown`, for a stop ease GSAP cannot parse. The interpolator owns ease names, so this is raised by `load`, `addTrack` and authored value writes, not by `validateV5`. Its path names the authored cell, such as `m/t.input.values.x[1].ease`.
- `trigger-driver-unavailable`, at `load()` or `addMotion`, when a declared `scroll` trigger resolves no source. This one is a construction failure, not a validation failure.
- `track-legacy-field`, for `keyframes` or `observes` on a track. Both retired members are refused
  by name so an old document fails to load rather than loading with the member ignored.
- `plugin-unknown`, when a track names an id the catalog did not admit.
- `slot-unknown`, `slot-required-missing`, `slot-incompatible` and `slot-unproven`, for a dependency
  binding to an undeclared slot, a missing required slot, a producer whose output contract contradicts
  the slot, and a producer contract that cannot prove the slot. A binding to a source no node carries
  is `edge-unknown-source`.
- `values-not-allowed`, when a computed track authors `input.values` but its plugin declares no
  `inputs.values`.
- `values-shape-invalid`, when authored values are neither an array of rows nor a plain record, when a
  table row is malformed, or when an authored value edit changes the table or record shape the track
  committed to.
- `row-id-invalid` and `row-id-duplicate`, for an empty or repeated row envelope id. Duplicate
  identity invalidates the table even when the row a caller selects appears first.
- `cell-form-invalid`, `cell-kind-conflict`, `cell-stops-invalid` and `static-field-stops`, for a cell
  or field that does not match its declared shape.
- `cell-address-unknown`, when `input.values.setField` addresses a row the track does not author.
- `live-values-invalid`, when `writeValues` or `writeParam` is given a value that does not satisfy the
  committed contract. The previous overlay stands when a write is refused.
- `project-templates-unsupported`, for a top-level `templates` field. Author values on the tracks that
  use them. The rule reads the key rather than the value, so `templates: undefined` is refused too.
- `id-shape`, `id-qualified-separator` and `id-reserved-namespace`, for malformed motion and track
  ids. Motion ids may not contain `/` or equal `~`; track ids may not contain `/`.

Malformed or duplicate ids, reserved namespace characters, malformed edges, unknown sources, duplicate edges, self-reference, and cycles are all errors too. Track ids may not contain `/`, and motion ids may not contain `/` or equal `~`, because those characters carry the qualified namespace.

### Slots, models and sources

A slot is either a model slot or a shape slot. A model slot names one model; the source must
publish that model id, and the graph compares the source's committed output with the declaration.
A shape slot names output shapes and the graph compares the producer's declared fields. A slot may
take a map of member keys to source ids; a single-source slot refuses a map and a map slot refuses
one source.

- `slot-model-unsatisfied` refuses a source that publishes a different model.
- `slot-incompatible` refuses a shape slot whose producer contradicts a required field.
- `slot-unproven` refuses a shape slot whose producer cannot prove a required field.
- `slot-required-missing` refuses an unbound required slot; `slot-unknown` refuses a binding
  to a slot the plugin does not declare.
- `slot-binding-mode` refuses a single source where a map is declared, or the reverse.
- `plugin-input-invalid` refuses a bound output set that does not carry the required output.
- `model-value-invalid` refuses a source or computed value that fails its model spec or parse.

### Inverse Kinematics and solver rules

`ik`/`ik3d` declare `chain`, `goals` and `base` model slots, plus an optional `pole` shape
slot for 3D. `fk`/`fk3d` declare `chain`, an optional `solved` model slot and `base`. The
graph checks those declarations; there are no grouped solver keys.

- `ik-solver-no-goal` refuses a solve whose goal table has no rows.
- `ik-goal-unknown-member` refuses a goal that names a member the chain does not contain.
- `ik-goal-not-leaf` refuses a goal on a member that has children.
- `ik-leaf-without-goal` refuses a chain leaf with no goal row.
- `plugin-validation-failed` refuses a `prepare` refusal, keeping the plugin's own rule id and
  path; a prepare that refuses without an error diagnostic is a plugin bug.

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

A solver that cannot solve at all is not one of these either, and that is the point of the load-time rules above. Every shape that would make a composition throw is refused before the graph is built, so `composition-failure` on a solver node means a bug in the plugin or the publisher rather than a rig you can fix by editing it. See ADR-053. The same holds for the solver's NaN goal guard: an authored non-finite value is refused as `cell-form-invalid`, and a computed one as `output-invalid`, so the guard is a last resort rather than an authoring mistake.

## Contract violations throw at the call site

These are your bugs, and they are loud on purpose rather than clamped or deferred:

- progress outside `[0, 1]` through a trigger port throws `RangeError: Progress must be between 0 and 1.`
- non-finite progress throws `TypeError: Motion progress must be finite.`
- `signal()` on a driver-backed motion throws, because that motion already has a source of progress.
- an unknown motion id on `signal` or `destroyMotion` throws `TypeError`.
- destroying a motion that still owns tracks throws `TypeError`. Remove its tracks first; a motion is destroyed empty.
- every member of a stale `TrackHandle` throws `StaleTrackHandleError`, which is exported from the package entry: the `definition` getter, `requires`, `input`, `remove()`, `replace()`, `writeValues()`, `writeParam()`, `releaseValues()`, and `releaseParam()`. Four of them used to return silently, so one condition had two public failure contracts; the silence is withdrawn rather than documented. The error extends `TypeError` and keeps the message `Track "<id>" is no longer live.` verbatim, so an existing `instanceof TypeError` narrowing keeps matching, and it carries a stable `ruleId` of `stale-track-handle` beside the `nodeId` it refused, which is what to branch on instead of the message. `handle.live` is the non-throwing way to ask the same question, so cleanup whose second call is expected rather than mistaken guards instead of catching. On a disposed project `live` is `false` and `remove()` reports the disposal rather than the staleness, because the project's own lifecycle outranks one handle's. A handle survives its own `replace()`, because replacement preserves node identity and therefore the token. See ADR-056.
- a live value write refuses a value that does not match the committed contract as `live-values-invalid`, carrying the diagnostics that name every offending path. The shape is validated before anything is published, the previous overlay stands, and the authored definition never moves. A valid write recomposes the node and clears an error on the next flush.
- `handle.edit(recipe)` refuses two things by name, and both are about where a call was made. A recipe opened inside a recipe throws with `schema-transaction-nested`, because one transaction is the unit and nesting would give it two. A verb that applies immediately throws with `schema-transaction-immediate`, named at the verb so the message tells you which call to move out: `setTrigger` and `setStagger` on a `MotionHandle`, and `seek`, `writeValues`, `writeParam`, `releaseValues`, `releaseParam`, `input.values.set`, `input.values.setField`, `input.param.set` and `input.param.setField` on a `TrackHandle`. A settle step cannot refuse, so deferring one of those into the transaction would move its failure to after the graph had committed and the retained definition had moved, and one condition would end up with two failure contracts. A throw from inside the recipe commits nothing and leaves every handle it issued not live. See ADR-064.
- a disposed clock or trigger port throws when subscribed to.
- registering a plugin whose `keys`, `inputs`, or `outputs` contain `:` throws `TypeError`. That separator belongs to the internal-key rule, and a requirement slot is held to it too.
- registering two plugins that declare the same `input` throws `TypeError`. Two plugins claiming the same `key` does not: that is legal, and a group names the owner. Two plugins declaring the same requirement slot is legal as well, because a slot is addressed through its owning plugin's group and delivered scoped to it, so there is no namespace to share.

A shape slot may declare `binding: "map"`; the graph checks the authored binding mode and refuses a mismatch as `slot-binding-mode`. A map entry keeps its authored key. See ADR-057.

## When several things fail at once

Teardown never stops halfway. Disposal runs every step, collects what failed, and reports once: a single failure is rethrown verbatim, and two or more arrive as one `AggregateError`. The same collect-then-report-once shape applies to clock consumer fanout and to patch listeners, so one badly behaved subscriber cannot silently stop the ones behind it.

The rule to remember when you see an `AggregateError`: the first entry in `errors` is the failure that actually caused the operation to be refused. The rest is cleanup noise attached to it.

When one of these reaches a diagnostic rather than your call site, the message is flattened rather than summarized. You get the boundary's own message followed by every cause it collected, joined by `; `, so nothing is hidden behind a value the diagnostic could not carry.
