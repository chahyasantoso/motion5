# Session status

Current state only, and deliberately small. This file says where the work is, what the next implementor picks up, and which rules the pipeline enforces. Per-slice reasoning lives in the ADR that decided the slice, in the pull request that landed it, and in `packages/core/test/unit/scripts/evidence-case-ids.test.ts`, which is the one owner of what every evidence-case-id series covers. Revisions of this file before 2026-08-30 carry the full narrative and are reachable through git history; it is not reproduced here, because a status file that grows with every slice stops being read, which makes it worse than a short one that is.

- **Captured:** 2026-08-30, Asia/Jakarta.
- **Branch verified:** `feat/lv-live-value-updates`, based on `main` at `d618402`.
- **Phase:** live editing of a loaded project. The runtime mutation model, trigger drivers, compiled Track ownership, edge identity and ordering, teardown ownership, single-track mutation atomicity, declared package entrypoints, clock tick error attribution, time loop semantics, plugin-named keyframe groups with per-plugin key ownership, plugin-owned input requirements, transactional Track replacement, the single composition input channel, the bare authored leaf, the analytic and iterative solvers with goal addressing and per-member weight, and the uniform stale-handle refusal are all shipped. See `docs/DECISIONS.md` and ADR-028 through ADR-059.

This document reports implementation reality. A plan or an audit describes intent unless this file says it landed.

## Where the work is

- **Just landed.** Live value updates without a graph replacement, [issue #218](https://github.com/chahyasantoso/motion5/issues/218), in [PR #228](https://github.com/chahyasantoso/motion5/pull/228), with [ADR-059](./ADR-059-live-value-overlay.md) and cases `LV-1` through `LV-14`. `Track` holds one immutable `#values` overlay, applied inside `interpolated()` after renderer-neutral filtering and before any plugin runs, which is the one read ordinary composition, `composeFrom`, and the publisher's `MemberState` all go through. `ProjectRuntime.overrideValues` masks the live Track and `setValues` masks it and rewrites the retained `TrackDefinition`; both go through one private write path and end at one `invalidate`.
- Two decisions inside that slice are worth carrying forward rather than rediscovering. There is one `ProjectRuntimeOptions` hook and not two, because `Track` holds a single mask and a second hook could only point at the same method. And the mask is derived from the retained definition rather than accumulated across calls, so an override cannot outlive the value it masked and `overrideValues({})` is a clear back to authored truth rather than a hole.
- **Next.** Per-key tween replacement on a live timeline, [issue #222](https://github.com/chahyasantoso/motion5/issues/222), with the verified plan and its nine findings in [this comment](https://github.com/chahyasantoso/motion5/issues/222#issuecomment-5466218271). Evidence series is `PK-`. The invariant is that one animated key's tweens are replaced on the still-live timeline and every reader of `state` sees only the new stops, or the call refuses and changes nothing. Read findings 1, 2 and 3 first: they are blocking, and they say the proposal's own recompile snippet reports success after killing every tween the key had, that `timeline.to()` returns the timeline rather than a tween so there are no per-key handles to retain, and that the diagnostics guard it reaches for cannot fire on a single-key compile.
- **Open, and not folded into either slice.** `IncrementalGraphBuilder.#trackCache` is keyed `owner/ownerId/trackId` and is deleted in exactly one place, when `collectTrack` complained. Neither `disposeTrack` nor `destroyAdopted` nor `disposeComposition` touches it, so a destroyed node's `GraphNode` is retained for the lifetime of the builder. It is a pre-existing leak, it needs its own issue, and it is the reason not to build a second node-id-keyed cache anywhere until eviction has an owner. [Issue #176](https://github.com/chahyasantoso/motion5/issues/176) separately tracks transactional `replaceTrack` ordering after a failed recompile.

## What a live edit costs today

- `replace(next)` is for topology. It validates a whole `TrackDefinition`, stages a replacement Track, rebuilds the graph, and rolls back transactionally when refused.
- `overrideValues(values)` is a read-time mask and leaves the retained definition alone. `setValues(values)` masks and rewrites the retained definition, so `handle.track` and the live composition cannot disagree. Both refuse no definition, stage no Track, rebuild no graph, and return the `PatchBatch` of their one `invalidate`.
- A mask is replaced wholesale rather than accumulated. An empty record is the clear, and a real `replace()` drops it by construction, because that compiles a fresh Track.
- An animated key is refused by name rather than frozen at the value passed. `LiveValueKeyError`, rule id `live-value-key`, with two reasons and no third: `unknown` for a key the track does not author, and `animated` for a key the interpolator drives. Lifting the second is what issue #222 is for, and lifting it is not part of that slice either.
- `seek(nodeId, progress)` is leaf-level scrubbing. On a driver-backed Motion the next driver emission overwrites a seeked value.
- Owner-based `adopt` and `destroyAdopted` remain available for compatibility. New consumer code uses `addTrack` and `TrackHandle`.

## Working constraints

- `format:check` runs before `npm test` inside `quality`, so a formatting slip means the suite never ran and the run proves nothing. Prettier is configured `printWidth: 100`, `singleQuote: false`, `trailingComma: "all"`, `proseWrap: "preserve"`.
- No Markdown tables in new prose, in test comments, or in an ADR. Anything that wants to be a table becomes a bullet list or prose. Prettier formats fenced `ts` blocks too, so pseudo-code goes in a `text` block.
- Formatting never shares a commit with behavior.
- Six checks gate a merge: `quality`, `integration`, `boundaries`, `build`, `end-to-end`, and the advisory `performance`. Squash merge once they are green.
- A failed or timed-out `CI` or `Recovery audit` run archives to the `ci-logs` branch at `logs/<run-id>/`, with `README.md`, `run.json` and `failed-jobs.log`. Cite the Actions URL as primary and read the archive for durable failing-first evidence. `archive-ci-logs.yml` is deliberately not branch-filtered, so a `feat/**` head ref needs nothing dispatched by hand; manual `workflow_dispatch` with a `run_id` stays available for a run the `if:` gate skipped.
- A test file naming a member that does not exist yet fails `typecheck` and stops `quality` before `npm test`. Declare the not-yet-existing seam locally in the red file and cast, then delete that declaration in the commit that lands the source. `StaleSeam`, `ComposeSeam` and the `LV-` locals are the precedent.

## Guardrails

- One owner per state transition, and one owner per normalization.
- One question, one mechanism. Where two mechanisms answer one question, the weaker one is deleted rather than documented as discouraged.
- One condition has one failure contract. Where half a surface refuses loudly and half returns silently, the silence is deleted and a non-throwing probe is added for the callers whose second call is expected rather than mistaken. A nullable return is the same silence with a value nobody checks.
- No compatibility flags, facades, placeholder tests, renderer imports, or core GSAP imports.
- Every behavioral slice starts with failing-first evidence, and failing-first means failing assertions. A run that failed `typecheck` or `format:check` ran no test at all, so it is a broken file rather than evidence.
- A green case is only evidence of what it would fail without. A test whose assertions survive the fix being reverted, or its twenty inputs collapsing to one, is rewritten rather than counted.
- Docs, public types, tests, and status move together. A cited evidence case id names exactly one test in the suite.
- A public error type is declared where the package entry may name it. A caller cannot `instanceof` a type it cannot name, and the declaration-surface gate refuses a `runtime/` or `graph/` module in the entry's declaration closure, so a shared no-behavior layer is where such a type lives while ownership stays put.
- An authored section is reserved by name rather than inferred from shape. A wrapper that exists only to hold one value is deleted, and the thing it held becomes the value.
- A field with no consumer is removed and then refused, never left declared or silently ignored.
- A rule answers for the scope that owns the thing it refuses. A rule that reserves an authored key across the whole registry is the same defect wearing the opposite shape.
- A misconfiguration with no symptom is refused by name at load time. A rig that holds a broken pose silently is worse than one that fails to load.
- A cache is keyed on everything its answer depends on. Where widening a key would reproduce another owner's key, the cache is deleted instead.
- A helper that already exists and already does the arithmetic is called, not copied.
- A gate reads code, never prose. A scan for a retired form is narrowed to what that form can be written in; product text is not reworded to satisfy an assertion.
- A refactor that only exists to unblock a later slice still ships alone, with its own equivalence evidence.
- A default that exists to keep every prior rig byte-identical is proved by the prior rigs, not by a new test.
- An audit's claim about callers is a measurement, not a premise.

## Evidence anchors

- Live value overlay red run: [33310177625](https://github.com/chahyasantoso/motion5/actions/runs/33310177625), archived at `logs/33310177625/` on `ci-logs`. `typecheck` and `format:check` passed first, then 14 failed and 752 passed. Every `LV-` case failed except `LV-12`, which asserts the `Interpolator` port grew no member and is green on purpose, and `SH-1` failed with them because `MEMBER_ARGUMENTS` declared two members the handle did not have yet. Green run: [33311740234](https://github.com/chahyasantoso/motion5/actions/runs/33311740234) on `b0b8080`, all six checks.
- Every earlier slice's red and green run ids live in the pull request that landed it. They were duplicated here for two dozen slices, which is what made this file unreadable; the pull request is the owner.
