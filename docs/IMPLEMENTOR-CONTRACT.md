# Implementor contract

**This is the only normative document for anyone implementing on this repository.**

If you are a new implementor: read this file, then stop. Do not read the other twenty documents in `docs/` before you have picked a slice. They are history, contracts, and post-mortems. They are useful evidence and they are not instructions. Reading them first is how every previous implementor lost the plot.

The rule is deliberate. There are 21 files in `docs/`, a 30-finding code review, and 200+ archived CI runs. Nobody holds that in their head. An implementor who tries will hold a random 10% of it, and the 10% they hold will be whichever document they read last. That is the actual root cause of the drift on this branch, and no amount of writing more documents fixes it. Fewer normative documents fixes it.

---

## 1. The story, in full, in one page

There are two repositories.

**`motionpath`** is the behavioral oracle, pinned at branch `v5-pr-15-observation-graph`, commit `c629e9b`. It animates correctly. Its architecture is not good enough to keep: Track owns graph traversal, the publisher is ad hoc, and there are no package boundaries. **Its behavior is the specification.** When motion5 and the oracle disagree about what should appear on screen, the oracle is right by definition.

**`motion5`** is the architecture. Graph IR, qualified ids, transactional `GraphBinding`, canonical ordering, one `ProjectRuntime`, immutable patches, failure containment, renderer separation, one clock owner. **Its boundaries are the specification.** When the oracle's implementation would violate a motion5 boundary, motion5 is right by definition.

The rescue exists because motion5 was built to Phase 4 with the architecture correct and the *value pipeline* hollow. Tracks produced empty values. The renderer wrote nothing. The gates went green anyway.

**Therefore every slice on this branch is the same shape:** take one behavior that the oracle demonstrably has, and install it inside a motion5 boundary that already exists, without copying an oracle file and without moving a motion5 owner.

That sentence is the whole job. If a change you are about to make is not that shape, you are off the path.

### The failure mode this branch keeps reproducing

From the post-E3 review, and it is worth quoting because it has now happened four more times since it was written:

> Every P0 here shares a single failure mode: **the tests construct the seam they are supposed to be testing.** The GSAP fixture builds its own paused timeline. The DOM test injects its own writer. The acceptance scan checks its own file list. The failing-first gate trusts its own exit code.

The implementor version of the same disease: **the failing test becomes the specification.** CI goes red, the implementor reads the assertion, and writes the smallest code that satisfies that assertion. That code is correct with respect to the test and wrong with respect to the oracle, because the test was written by someone who was also reading the assertion rather than the oracle.

PR #83 is the current example. Three consecutive comments on it are CI post-mortems. Each one correctly diagnoses the previous run and proposes a fix aimed at the previous run. None of them went back to `BuildTrackTween.js`. If any of them had, they would have found that the invariant being tested cannot exist in motion5's current compiler at all.

### How to not do that

Before writing a line, answer four questions in the PR body. If you cannot answer all four, you have not understood the slice yet and writing code will produce a symptom fix.

1. **Which oracle file demonstrates this behavior, and what does it actually do?** Quote it. Not paraphrase, quote.
2. **Which motion5 object owns the state transition?** Exactly one. Name it.
3. **What is structurally impossible after this change that is possible before it?** If the answer is "a diagnostic gets emitted," that is a weak answer. Prefer "this state cannot be constructed."
4. **What did you delete?** Every slice deletes something: a placeholder, a duplicate owner, a dead field, a stale claim. A slice that only adds is usually a slice that layered a fix over a defect instead of removing it.

---

## 2. Invariant ledger

This table is the state of the rescue. **It is the only place that state lives.** `docs/SESSION-STATUS.md` claims to be that place and is stale: it was captured 2026-08-11, says Wave C is open on C1 at PR #52, and the branch is now past PR #83. Do not trust it. Delete or archive it in the first slice that touches docs.

Status values: `open` (nothing landed), `partial` (landed but the invariant is not fully true), `landed` (invariant true and proven at the real edge), `landed, gate open` (invariant true, but the gate that proves it is weak).

Evidence column cites the test that must fail if the invariant breaks. Statuses marked *inferred* were read from test filenames in archived CI run `31689382153` and have not been verified line by line. Verify before relying on one.

| ID | Invariant | Owner | Status | Evidence |
| --- | --- | --- | --- | --- |
| P0-1 | A `seek()` before any tick cannot kill the clock. Tick identity and batch identity are separate counters. `#onTick` never throws. | `GraphRuntime`, `browser-clock` | landed *(inferred)* | `test/unit/runtime/clock-tick-identity.test.ts` |
| P0-2 | The adapter's own timeline is paused. Fixtures pass real `gsap`. | `adapters/interpolator/gsap.ts` | landed *(inferred)* | `test/contract/gsap-paused-timeline.test.ts` |
| P0-3 | Per-property stop timing is absolute and independent across properties. | `adapters/interpolator/gsap.ts` | **partial, verified** | `gsap-absolute-stops`, `gsap-multi-stop`, `gsap-authored-duration` |
| P0-4 | The DOM writer renders transforms and removes omitted keys, proven against a real element. | DOM consumer package | landed *(inferred)* | `test/integration/dom-transform-removal.test.ts` |
| P1-5 | Registry change detection is structural, so unchanged nested values do not republish. | `PatchRegistry` | landed *(inferred)* | `patch-registry-structural-change.test.ts` |
| P1-6 | Both listener collections are snapshotted before notification. | `PatchRegistry` | landed *(inferred)* | `patch-registry-listener-snapshot.test.ts` |
| P1-7 | Deferred seeds drain with zero clock ticks, via the scheduler. | `GraphRuntime` | landed *(inferred)* | `scheduler-reentrancy.test.ts` |
| P1-8 | One reentrancy policy, one flush entry point. | `GraphRuntime` | landed *(inferred)* | `publisher-reentrancy.test.ts` |
| P1-9 | `Engine.load()` returns a narrow handle; graph internals unreachable from the emitted `.d.ts` closure. | `Engine` | landed *(inferred)* | `project-handle-surface`, `public-declaration-surface` |
| P1-10 | Authored stops are validated on the product path; `Engine.load` rejects. | `Engine`, `validate-v5` | landed *(inferred)* | `engine-load-validation.test.ts` |
| P1-11 | Self-reference compares qualified ids. | `graph/ir.ts` | landed *(inferred)* | `ir-validation`, `observation-state` |
| P1-12 | One validation owner; one spelling of edge identity; one cycle algorithm. | `graph/ir.ts` | landed *(inferred)* | `contract/validation-owner.test.ts` |
| X-1 | Inputs project flat into the source record. Nested input values are a compile-time diagnostic. | `GraphPublisher`, edges | landed *(inferred)* | `publisher-flat-inputs`, `observation-projection-validation` |
| X-2 | Plugin `internalKeys` and serializers reach the DOM adapter, or the fields do not exist. | `PluginRegistry`, `dom.ts` | landed *(inferred)* | `integration/dom-plugin-metadata.test.ts` |
| **X-3** | **Contribution is per authored key, collisions are diagnosed, nothing silently last-write-wins.** | **`PluginRegistry`** | **open, red** | `plugin-contribution-contract`, `track-contribution` |
| G-1 | Packages emit real declarations to `dist`; a consumer smoke test imports the built entry from outside the workspace. | `tsconfig.build.json`, CI | open | none |
| G-2 | Declaration emit excludes tests and does not leak path aliases. | root tsconfig | open | none |
| G-3 | The acceptance gate proves mapped tests *ran and passed*, not that files exist. | `acceptance-scan.mjs` | landed *(inferred)* | `unit/scripts/acceptance-scan.test.ts` |
| G-4 | Failing-first requires an assertion-level failure in a file whose imports resolved. | `.github/workflows` | landed *(inferred)* | `unit/scripts/governance-gates.test.ts` |
| G-5 | The mutation gate reports one defined score and fails on it. | `mutation-summary.mjs` | landed *(inferred)* | `unit/scripts/mutation-config.test.ts` |
| G-6 | Per-directory mutation thresholds with a committed baseline; file-level regression fails. | Stryker config | open | none |
| G-7 | Build and end-to-end are required checks on the merge path. | `ci.yml` | landed *(inferred)* | `build`, `end-to-end` jobs present in run `31689382153` |
| P2-* | See the P2 section of the post-E3 review. Dead `sourceRevisions`, per-frame O(graph) allocation, repeated deep freezes, value loss on error patches, dead `Motion`/`createTrigger`. | various | open | `motion.test.ts`, `triggers.test.ts` exist but the code is unwired |

### P0-3 is the row that matters right now

It is marked `partial` and that is not a guess. Read `packages/core/src/adapters/interpolator/gsap.ts` on the current head:

```ts
for (const segment of compiled.segments) {
  timeline.to(
    proxy,
    { [segment.key]: segment.value, duration: segment.duration * duration, ease: segment.ease ?? "none" },
    segment.start * duration,
  );
}
```

The absolute-position half of P0-3 is fixed: `start` is now `previous.p` rather than an accumulated ordinal, and `pinAuthoredEnd` handles the short-tail rescale. Good.

The shared-compilation half is not. The oracle builds **one percent-keyed map across all properties** and emits **one tween**:

```js
gsap.to(proxy, { keyframes: sharedKeyframes, ...sharedTweenVars, duration, paused: true })
```

motion5 emits one tween per property per segment. Every property carries its own ease on its own tween. That difference is invisible for correctness of position, which is why the current tests pass, and it is decisive for X-3, which is why X-3 is stuck.

---

## 3. Why X-3 cannot land on the current compiler

This is the answer to "the solution treats symptoms." It does, and here is the mechanism.

In the oracle, `contribute()` **is** the compiler. Each plugin translates its own authored key's stops into percent entries in a map that every plugin shares:

```js
contribute(key, stops) {
  const percentPatch = {};
  stops.forEach((stop) => {
    const pctKey = toPercentKey(stop.p);
    percentPatch[pctKey] = { [key]: stop.v };
    if (stop.ease) percentPatch[pctKey].ease = stop.ease;
  });
  return { percentPatch, tweenVars: {} };
}
```

The shared map is the point. In GSAP's percent-keyframe form, `ease` is a property **of the percent entry**, not of the property being animated. So if `x` writes `"50%": { x: 10, ease: "power1.out" }` and `y` writes `"50%": { y: 20, ease: "power2.out" }`, they are fighting over one slot and one of them loses silently. That is a real bug that can really happen, and it is why `BuildTrackTween` raises:

```js
if (existing?.ease !== undefined && incoming?.ease !== undefined && existing.ease !== incoming.ease)
  throw new Error(`Ease collision on track "${trackId}" at percent "${percentKey}".`);
```

In motion5's segment-per-property compiler there is no shared slot. Each property's ease rides on its own `timeline.to()` call. **Cross-property ease collision is not a bug that can occur.** Identically, `tweenVars` exist in the oracle because there is exactly one `gsap.to(proxy, vars)` call for them to land in. motion5 has N calls and no vars object; `createGsapInterpolator` never reads a `tweenVars` field and there is nowhere for it to go.

So the failing assertion in `plugin-contribution-contract.test.ts` asks the registry to diagnose a condition the runtime cannot produce. Any code that makes it green is, by construction, code that fires on a synthetic condition. That is the symptom fix, and it is unavoidable while the compiler stays as it is. The test is not wrong about the oracle. It is wrong about the order of work.

**The post-E3 review already sequenced this correctly.** P0-3 is item 3 in its recommended order. X-3 is downstream. The branch tried to take X-3 first because X-3 looked smaller.

---

## 4. The corrected sequence

Six slices. Each is independently mergeable. Each shrinks the next. Do not reorder them; the ordering is the whole point.

### Slice 1: revert the reformat on PR #83

`domain/plugins.ts` and `domain/track.ts` were collapsed to one statement per line. The diff reads as 131 additions and 323 deletions on files that were mostly just squashed. Nothing semantic is reviewable in it, and three registration guards were deleted inside it without anyone noticing.

Restore the original formatting. Keep only the semantic change. This is not style pedantry: an unreviewable diff is how the next four defects get in.

### Slice 2: restore the deleted registration guards

Gone from `assertMetadata` when it was inlined, with no replacement and no failing test:

```ts
if (plugin.keys !== undefined && !Array.isArray(plugin.keys)) throw ...
if (plugin.claimsKey !== undefined && typeof plugin.claimsKey !== "function") throw ...
if (plugin.priority !== undefined && !Number.isFinite(plugin.priority)) throw ...
```

`priority: NaN` currently poisons the sort comparator and makes resolution order non-deterministic, which silently breaks the one ordering guarantee the registry exists to provide.

While here, close the stage vocabulary. The oracle validates `base | filter | media | transform | override | default` at registration. motion5's `stageRank` buckets every unrecognized stage at `2`, so a typo silently reorders composition. Either validate against a closed set or delete `stage` and keep `priority` as the only ordering axis. Do not leave a field that accepts anything and means something.

### Slice 3: single key ownership at registration

The oracle keeps `exact: Map<key, plugin>` and throws `Plugin key collision for "x"` when a second plugin claims a key. motion5 lets every matching plugin into `plugins[]` and only diagnoses *output* collisions, which is precisely why "who contributes for key `x`" needed a collision rule at all.

Build the index at registration. Predicates via `claimsKey` resolve only when no exact owner exists, in registration order. Then `ownerOf(key)` is total and single-valued, and last-write-wins becomes impossible by construction rather than by diagnostic. **This deletes a rule instead of adding one.** That is the shape you want.

### Slice 4: P0-3, percent-keyframe compilation

The real one. Port the oracle's compilation strategy in shape, not in code:

- build one percent-keyed map across all properties, `{ "0%": {...}, "25%": {...}, "100%": {...} }`;
- emit a single `timeline.to(proxy, { keyframes: map, ...tweenVars, duration, paused: true })`;
- seed the proxy from the `"0%"` entry, skipping `ease`;
- port the ease-collision rejection as a motion5 diagnostic, not a thrown `Error`;
- keep `pinAuthoredEnd`'s intent: verify whether a single percent-keyframe tween still needs it, since GSAP derives duration from the vars rather than from child scheduling. It probably becomes unnecessary. Deleting it is a win; keeping it without checking is not.

Contract test: two properties on different grids, asserted at `p = 0, 0.2, 0.25, 0.5, 1`, against real `gsap`. This is the test the B2 slice should have had.

After this slice, ease collisions and `tweenVars` are real. X-3's rules acquire a consumer.

### Slice 5: X-3, done properly

Only now. The contract, explicit, no shape sniffing:

```ts
export type PluginContributor = (
  key: string,
  stops: readonly AuthoredStop[],
  track: TrackConfigView,          // frozen { id, duration? }, never the live definition
) => Contribution | undefined;

export interface Contribution {
  readonly keyframes?: Readonly<Record<string, AuthoredProperty>>;
  readonly tweenVars?: Readonly<Record<string, unknown>>;
}

export interface ResolvedPlugins {
  // ...
  readonly preparation: PreparedContribution;   // NOT optional
}
```

Per-key input, so contributions are independent and registration order affects diagnostics only, never values. The current implementation feeds each contributor the accumulated map (`{ ...authored, ...keyframes }`), which leaks order into output. The oracle does not do this.

`preparation` non-optional, because an optional field with a `return config` fallback is a silent-skip path: anyone constructing a `Track` directly, or resolving through `PluginRegistry.resolve()` for the `use:` path, currently gets zero contribution and zero diagnostic.

Five further rules, each fixing a defect that is live on the PR head today:

1. **No shape sniffing.** `normalizeContribution` currently discriminates on key presence, so a contributor returning `{ x: {...}, tweenVars: {...} }` takes the explicit branch, finds no `.keyframes`, and **loses `x` with no diagnostic.** That is the actual cause of the first CI failure, and it is worse than the bug the PR set out to fix: silent loss instead of silent overwrite.
2. **`tweenVars` gets its own namespace.** `preparedConfig` currently spreads them into the config root, which is the `TrackDefinition` (`engine.ts` passes `interpolationConfig: definition`). A plugin contributing `tweenVars: { duration: 2 }` silently overwrites the authored track duration. The oracle spreads tween vars *before* `duration` so authored wins. Reserve `keyframes`, `duration`, `paused`, `id`, `use`, `observes` and diagnose attempts to set them.
3. **Agreement is legal.** The oracle rejects only on *conflict*: `if (key in shared && shared[key] !== incoming[key]) throw`. The current code rejects any second write, so two plugins both contributing `ease: "none"` is a load-time error on a valid project.
4. **Reject, do not accept-and-warn.** `validateStops` pushes range, order, and duplicate diagnostics and then returns `true`, so a malformed contributed property is installed anyway. Only shape failure rejects. Authored stops are not handled this way.
5. **Delegate stop validation.** The PR's `validateStops` is the *third* implementation of authored-stop rules, after `contract/validate-v5.ts#validateKeyframes` and `gsap.ts#readStops`. That is P1-12 recurring inside the PR whose purpose is removing duplicate ownership. Call the existing validator with a path prefix and a contributed rule-id namespace. Write zero new stop-shape logic.

Also: contain contributor throws as diagnostics, sort iteration (`Object.keys(...).sort()`) and diagnostic `ids` so output is a pure function of ids, re-resolve contributed keys so a plugin cannot invent a key nobody composes, and bound the cascade to exactly one round with `plugin-contribution-cascade` for anything deeper. No fixpoint.

### Slice 6: migrate B1, declare the deletion

Moving contribution ownership to the registry deletes the B1 invariant, "Track merges contribution into interpolation config before timeline creation." B1 is acceptance-mapped. It was neither migrated nor declared, which is why `track-contribution.test.ts` is red: it is not a bug report, it is an orphaned contract.

Rewrite it against the new owner: the registry calls `contribute` exactly once per owned key, `Track` never calls it, the timeline receives merged keyframes. Update `docs/acceptance-map.json`. Record it under `### Deletions` in the PR body. Re-baseline mutation over `domain/plugins.ts`.

---

## 5. Slice rules

**Size a slice by owner, not by finding.** "One slice per review finding" is what produced symptom fixes, because a finding is a description of a symptom. A slice is: one object gains or loses responsibility for one state transition. If your slice touches two owners, it is two slices. If it touches one owner and three findings, it is one slice.

**Every PR body cites an invariant id from the ledger in section 2.** No id, no merge. If the work does not map to a row, add the row in the same PR and say why it was missing.

**Failing-first means assertion-level red on the parent commit.** Not an import error, not a type error, not a config error. Non-negotiable rule 5. The gate is currently weak enough to accept the wrong kind of red (G-4), so this is on you until G-4 lands.

**Push fixtures to the real edge.** Real `gsap`, real element, real `Engine.load`, real emitted `.d.ts`. If your test constructs the seam it is testing, it cannot fail on the bug you are fixing. Every collision rule in slice 5 must be provable as a load-time rejection on a real project definition, because `engine.ts` is what turns error diagnostics into a thrown load.

**Never reformat a file in a semantic PR.** See slice 1.

**Update this file in the same PR.** The ledger row moves to `landed` in the commit that makes it true, or it does not move. A separate docs PR is a docs PR that never happens.

### Disqualifiers

Stop and re-read section 1 if you catch yourself doing any of these.

- Adding a branch whose only purpose is satisfying an assertion, without an oracle behavior behind it.
- Adding an optional field so an existing caller keeps working. That is a compatibility alias; the guardrails forbid them, and it is how the silent-skip path in slice 5 got in.
- Adding a diagnostic where you could have made the state unconstructible.
- Reading the CI log before reading the oracle.
- Writing a fourth implementation of a rule that exists three times.
- Marking something Done against evidence that does not cover its exit criterion. E1 and C3 both did this.

---

## 6. Making this survive the next implementor swap

Documents do not enforce themselves. Three mechanical changes, in rough order of value:

1. **Demote the rest of `docs/`.** Move everything that is not this file, `ARCHITECTURE.md`, `AUTHORED-SCHEMA.md`, and the two oracle-facing contracts into `docs/history/`, and put a one-line non-normative banner at the top of each. Delete `SESSION-STATUS.md`; its job is section 2 of this file now. Twenty-one peer documents means there is no single source of truth, and an implementor will pick whichever one they opened first.
2. **Gate the invariant id.** A CI step that reads the PR body, extracts the cited row id, and fails when it is absent from this file or already marked `landed`. Ten lines of script. It makes "which invariant does this make true" a required field rather than a good intention.
3. **Gate the oracle citation on any PR touching `domain/` or `adapters/`.** Require a link to a `motionpath` file at the pinned commit. If a change to the value pipeline has no oracle behind it, it is either a symptom fix or a new invention, and both need to be argued explicitly rather than slipped in.

A fourth, cheaper than it sounds: **pin the oracle as a git submodule or a vendored read-only snapshot at `c629e9b`.** Right now the oracle lives behind eleven links in a required-reading list, which means in practice nobody opens it. If `oracle/` is a directory in the working tree, implementors grep it, and grepping it is the single behavior that would have prevented PR #83.
