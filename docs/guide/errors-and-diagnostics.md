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
- `stops-shape`, when a leaf is neither an array of stops nor a static number, string, or boolean. `null`, `undefined`, a non-finite number, and any other object all land here. The id predates the bare form and keeps its name, because the animated form still is stops.
- `plugin-contribution-static-unsupported`, when a static leaf is authored on a key owned by a prepare-stage plugin with a `contribute` hook. Such a hook derives a contribution from stops, and a static leaf has none; calling it with an empty list would be a field accepted and then ignored.

A static leaf is worth understanding rather than just spelling. It never enters the interpolator, so it takes no percent-map entry and no tween, and it cannot collide with a sibling's `ease` because it has nowhere to carry one. `length: 62` is not shorthand for two identical stops; it is a different and cheaper thing.

The stop rules themselves are unchanged: `stop-position` for a non-finite `p`, `stop-position-range` outside `[0, 1]`, `stop-position-order` for a non-monotonic sequence, `stop-position-duplicate` for a repeated position, and `stop-missing-start` and `stop-missing-end` as warnings.

### The two sections of a plugin group

A plugin-named group has exactly two members, `values` and `requires`, and both names are reserved. These five rule ids are the whole surface of that rule. See ADR-049.

- `keyframes-missing-values-section`, when a group authors its properties directly under the plugin name instead of under `values`. This is the pre-ADR-049 shape, and it is refused by name rather than normalized: two authoring shapes would be two validation paths and two documentation paths. Wrap the leaves; nothing else changes.
- `keyframes-unknown-section`, for any key inside a group that is neither `values` nor `requires`. The message names both legal sections. A typo'd section is reported as one rather than misread as a property with no stops.
- `keyframes-values-shape`, when `values` is present but not an object.
- `keyframes-values-empty`, when `values` is an empty object. Omitting the section is already how you author no properties, so an empty one would be a field accepted and then ignored.
- `keyframes-reserved-section`, for a top-level `values` or a top-level `requires`. A section name at the top level addresses no plugin, so nothing written there could have an owner.

Two shapes deliberately stay legal. A group may author `requires` with no `values`, which is how a plugin joins composition to receive an upstream value without animating anything of its own. And a leaf named `values` _inside_ the section is an ordinary property, because the reservation is on section position rather than on the string everywhere.

Malformed or duplicate ids, reserved namespace characters, malformed edges, unknown sources, duplicate edges, self-reference, and cycles are all errors too. Track ids may not contain `/`, and motion ids may not contain `/` or equal `~`, because those characters carry the qualified namespace.

A diagnostic about a grouped keyframe cites the path you typed, `keyframes.fk.values.length`, not the flattened key the compiler works with. A diagnostic about a stop cites its index on the property, `keyframes.x[0].p`. Every path a leaf diagnostic carries is a path you wrote. See ADR-041, ADR-049, and ADR-050.

## A frame has two failure owners

Every tick does two things: it advances the clock consumers, which is where playback progress and every trigger driver live, and then it flushes the graph. These are separate error boundaries with separate rule ids, so a diagnostic tells you which one failed:

- `clock-consumer-failure`, when advancing this frame's consumers threw. The message names the tick and carries every original cause, including each one collected by the fanout when several consumers fail together.
- `flush-failure`, when the graph flush for that frame threw, or when a scheduled follow-up flush did.

A driver bug is never reported as `flush-failure`, and the graph still flushes on a frame whose consumers failed, so one broken driver does not cost every other node its frame. A frame where both fail reports both, in the order they happened. `path` is the tick the failure happened on. See ADR-039.

## Runtime trouble arrives on the patch

A node that exists but cannot produce a value publishes with status `blocked` or `error` and keeps its last known values, with the reason inline in `patch.diagnostics`. There is no separate diagnostics stream to subscribe to, by design. Batch-level diagnostics are on the `PatchBatch` that a flush produces.

That means a rendering consumer should branch on `patch.status` rather than assume every patch is renderable, and an inspector can read `patch.diagnostics` without any extra wiring.

## Contract violations throw at the call site

These are your bugs, and they are loud on purpose rather than clamped or deferred:

- progress outside `[0, 1]` through a trigger port throws `RangeError: Progress must be between 0 and 1.`
- non-finite progress throws `TypeError: Motion progress must be finite.`
- `signal()` on a driver-backed motion throws, because that motion already has a source of progress.
- an unknown motion id on `signal` or `destroyMotion` throws `TypeError`.
- destroying a motion that still owns tracks throws `TypeError`. Remove its tracks first; a motion is destroyed empty.
- a disposed clock or trigger port throws when subscribed to.
- registering a plugin whose `keys`, `inputs`, or `outputs` contain `:` throws `TypeError`. That separator belongs to the internal-key rule.
- registering two plugins that declare the same `input` throws `TypeError`. Two plugins claiming the same `key` does not: that is legal, and a group names the owner.

## When several things fail at once

Teardown never stops halfway. Disposal runs every step, collects what failed, and reports once: a single failure is rethrown verbatim, and two or more arrive as one `AggregateError`. The same collect-then-report-once shape applies to clock consumer fanout and to patch listeners, so one badly behaved subscriber cannot silently stop the ones behind it.

The rule to remember when you see an `AggregateError`: the first entry in `errors` is the failure that actually caused the operation to be refused. The rest is cleanup noise attached to it.

When one of these reaches a diagnostic rather than your call site, the message is flattened rather than summarized. You get the boundary's own message followed by every cause it collected, joined by `; `, so nothing is hidden behind a value the diagnostic could not carry.
