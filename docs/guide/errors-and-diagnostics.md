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
- `plugin-unknown-key`, when no registered plugin claims an authored keyframe key. This is the error you hit first if you forget to register a plugin.
- `plugin-contribution-unsupported-entry`, for the legacy `use` field, which is not part of schema v5.
- `keyframes-reserved-separator`, when a flat keyframe name, a plugin-named group, or a leaf name contains `:`. The colon is reserved for the namespaced-keyframe rule, so it is never legal in ordinary authored key names.

Malformed or duplicate ids, reserved namespace characters, malformed edges, unknown sources, duplicate edges, self-reference, and cycles are all errors too. Track ids may not contain `/`, and motion ids may not contain `/` or equal `~`, because those characters carry the qualified namespace. Keyframe names may not contain `:` for the same reason: it is reserved for namespaced internal keys.

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

## When several things fail at once

Teardown never stops halfway. Disposal runs every step, collects what failed, and reports once: a single failure is rethrown verbatim, and two or more arrive as one `AggregateError`. The same collect-then-report-once shape applies to clock consumer fanout and to patch listeners, so one badly behaved subscriber cannot silently stop the ones behind it.

The rule to remember when you see an `AggregateError`: the first entry in `errors` is the failure that actually caused the operation to be refused. The rest is cleanup noise attached to it.

When one of these reaches a diagnostic rather than your call site, the message is flattened rather than summarized. You get the boundary's own message followed by every cause it collected, joined by `; `, so nothing is hidden behind a value the diagnostic could not carry.
