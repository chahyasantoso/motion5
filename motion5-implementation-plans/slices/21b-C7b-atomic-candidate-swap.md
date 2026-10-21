# C7b — Per-candidate atomic state swap

Status: not implemented. Depends on: C7.

## The defect (C7 review finding F3)

`Track.#composeWithOperations` runs evaluate-then-swap as one indivisible call. The graph
publisher iterates all tracks in a candidate group, calls `composeFrom` on each, and the swap
inside each call fires immediately. If the publisher then rejects the whole candidate group (e.g.
a downstream validation fails, or a subscriber throws), some tracks have already committed their
new `#committedStates` while others have not. The next evaluation of any already-committed track
starts from the new states rather than from the pre-candidate snapshot. The invariant that is
broken: **either all candidate evaluations commit, or none do**.

This is not a correctness defect in the normal publish path today, because the publisher does not
yet reject on post-evaluation errors in a way that leaves only some tracks committed. It becomes
correctness-critical once the publisher gains rejection (issue-space: blocked candidate groups,
failed fold subscribers). The slice fixes the ownership now, before the publisher grows that
ability, so the invariant never has a window.

## Root cause in the architecture

`Track` is both the evaluator and the committer of its own state. `#composeWithOperations`
(track.ts:498) evaluates and immediately writes `#committedStates` before returning the snapshot.
The caller (`composeFrom`) then forwards the snapshot to the publisher. The publisher's accept/
reject decision arrives after the write.

The fix is **not** to make `Track` know about the publisher's decision. That would give Track a
second owner (the publisher), violating single ownership. The fix is to split the two
responsibilities into two methods:

- `evaluate(seed, requirementInputs)` — pure: runs `executeTrackOperations`, returns a
  `TrackCandidate` (proposed output + proposed states). Does not write `#committedStates`.
- `commit(candidate)` — effectful: writes `#committedStates` from the accepted `TrackCandidate`,
  disposes retired states, updates the memo. No evaluation logic.

The **Engine** (or its graph publisher delegate) calls `evaluate` on all tracks in a candidate
group, hands the results to the publisher, and calls `commit` only on every track in the group
once the publisher accepts. If the publisher rejects, no `commit` is called and every track retains
its prior committed states.

## Owner

`Track` gains `evaluate` and `commit` as the two new public methods. The swap ownership stays with
`Track`; the caller orchestration moves to the Engine-level publisher path.

`TrackCandidate` is a new type exported from `track-operations.ts`, carrying:

```ts
export type TrackCandidate = {
  readonly kind: "candidate";
  readonly snapshot: TrackSnapshot;
  readonly proposedStates: ReadonlyMap<CompilerEntryKey, ProposedEntryState>;
};
```

Using `kind: "candidate"` as a discriminant means the type is not confused with a bare
`TrackSnapshot` at any call site, and an exhaustive switch on `kind` is available wherever the
caller needs to distinguish accepted from rejected candidates in a future extension.

## Changes

Files added or changed (targets, not guarantees; stay under the 60 kB read-budget ceiling):

- `packages/core/src/domain/track.ts` — split `#composeWithOperations` into `evaluate` and
  `commit`; `composeFrom` becomes a thin `evaluate`+`commit` wrapper to keep backward compat with
  existing test callers until the publisher path is wired. Then delete that wrapper once all callers
  are migrated.
- `packages/core/src/domain/track-operations.ts` — export `TrackCandidate` type.
- `packages/core/src/runtime/graph-publisher.ts` (or the motion/engine path that drives
  `composeFrom`) — replace the per-track `composeFrom` loop with `evaluate`, then publish
  accept/reject, then `commit` on the accepted set.
- `packages/core/test/contract/candidate-acceptance-c7.test.ts` — four new tests (see Evidence).

No new files unless `TrackCandidate` needs its own module (it fits in `track-operations.ts`).

## API delta

`TrackCandidate` is exported from `@motion5/core/internal` (same tier as
`ProposedEntryState`, `executeTrackOperations`). The two new `Track` methods are public but not
re-exported from the package entry — callers are the Engine-internal graph publisher path only.

## Behavior

- `Track.evaluate(seed, requirementInputs)` calls `executeTrackOperations` exactly as
  `#composeWithOperations` does today. Returns a `TrackCandidate`. Does not touch
  `#committedStates`, `#lastSnapshot`, `#lastSeed`, `#lastRequirementInputs`, or `#dirty`.
- `Track.commit(candidate)` writes `#committedStates`, updates the memo fields
  (`#lastSnapshot`, `#lastSeed`, `#lastRequirementInputs`), clears `#dirty`, and then calls
  `disposeRetiredStates`. Throws on disposal failure with the same postcommit-delivery-error
  semantics as today.
- `Track.composeFrom` keeps working: it calls `evaluate` then immediately `commit`, preserving
  every existing test contract. It is the migration shim; it is deleted from `Track` in the slice
  that wires the publisher path, once no caller remains.
- The Engine/publisher path evaluates all tracks in the candidate group via `evaluate`, forwards
  the resulting snapshots to the publisher, and calls `commit` on each track only after the
  publisher accepts. If the publisher rejects or throws, no `commit` is called and all tracks
  retain their prior committed states.
- `Track.dispose` behavior is unchanged; `#committedStates` is always the live committed map,
  whether it came from `commit` or from the old `composeFrom` shim.
- The memo (`#memoized`) is consulted in `evaluate` so a caller that evaluates the same seed
  twice does not run the operation executor twice.

## Invariants preserved

- Single owner: only `Track.commit` writes `#committedStates`. `evaluate` is read-only on state.
- Abandonment: `executeTrackOperations` disposes freshly initialized states on candidate failure
  (inside `abandon`). That path is unchanged; it fires inside `evaluate` before the candidate is
  returned to the caller.
- Disposal ordering: `disposeRetiredStates` fires in `commit`, after the swap, as today.
- Postcommit delivery error: a throwing `dispose` inside `commit` throws after the swap, never
  un-commits, exactly as today.

## Evidence (failing-first, in this order)

Write these tests in `candidate-acceptance-c7.test.ts` before touching `track.ts`:

**C7b-1 (failing first):** Two tracks are evaluated in one candidate group. The second track's
evaluation is forced to throw (inject a broken `prepare`). Assert the first track's
`#committedStates` is still the pre-candidate snapshot (no partial commit). Requires `evaluate`
to exist and the caller to not call `commit` when a group member throws.

**C7b-2:** A candidate group of two tracks is evaluated. The publisher is configured to reject
(return false / throw). Assert neither track's state advanced past its pre-evaluation committed
snapshot after the rejection.

**C7b-3:** A candidate group of two tracks is evaluated and the publisher accepts. Assert both
tracks' committed states reflect the accepted candidate, and `disposeRetiredStates` fired once per
track (not twice). This is the green path that was already implicitly tested; making it explicit
proves the two-phase split does not regress the normal path.

**C7b-4 (regression guard for disposal ordering):** A candidate is evaluated and committed. Then
a second candidate is evaluated for the same track with a different `init` generation (cold reset).
Assert the prior generation was disposed exactly once, in `commit`, after the swap.

## Exit

The failing-first tests turn green. Every C7 test (C7-1 through C7-17) stays green. Prettier and
tsc pass. The publisher path calls `evaluate` then `commit` rather than `composeFrom`; the
`composeFrom` shim either no longer has callers or is explicitly documented as a test-only
backwards-compat shim pending deletion.

## Depends / blocks

Depends on: C7 (done). Blocks: F2 (the `composeFrom` shim and legacy-compose channel are deleted
together; this slice marks `composeFrom` as shim-pending-deletion). Independent of D1 (frame
math).

## Risk and rollback

Risk: the publisher path is shared with the Motion tick loop. If `evaluate`/`commit` are threaded
through the wrong layer, the tick loop may call `commit` before the publisher's accept decision.
Mitigation: the slice adds an assertion inside `commit` that the candidate's `proposedStates` map
identity matches what `evaluate` returned (simple referential check), so a misthreaded call is
caught rather than silently wrong.

Rollback: revert the three changed files. No schema change, no new migration, no external API.
