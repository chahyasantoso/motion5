# ADR-061: One handle base, one spelling for the definition, and one stale error family

**Status:** Accepted, 2026-08-31. Amended 2026-08-31 to record tier 0.

**Context.** `TrackHandle` was only capability handle in package. [ADR-056](./ADR-056-uniform-stale-track-handle.md)
gave it one failure contract, one non-throwing probe — contract stated on interface that happened to need it first.
Motion had no handle at all: `addMotion` returned `{ id }`, `destroyMotion` took id → every question about live Motion
addressed by id against map, `Unknown motion "x"` only refusal.

Adding second handle beside first copies three things rather than sharing. Asymmetry making handle usable — `live`
never throwing while every other member refuses once captured token stale — written on `TrackHandle`, would be written
again on `MotionHandle`. Refusal sentence had one author, would have two. Read-back member spelled `track` on one
handle, `motion` on other = one fact under two names: `SolverMember` drift type system cannot see, one level up.

**Decision.** One base. `Handle<T>` carries `id`, `live`, `definition`; asymmetry documented there not per implementor:
`live` never throws — either side of any invalidation, on disposed project — `definition` and every other member throw
named refusal once captured token not current. Both handles extend it → consumer can write generic over either.

One error family. Abstract `StaleHandleError extends TypeError` owns sentence both refusals read, takes noun as only
per-subclass argument. `StaleTrackHandleError`, `StaleMotionHandleError` siblings under it, each keeping own `ruleId`
(`stale-track-handle`, `stale-motion-handle`) and own id field (`nodeId`, `motionId`) — qualified graph node id and
motion id two facts not one fact two names. Inserting base under shipped class = narrowing → every existing
`instanceof TypeError` and `instanceof StaleTrackHandleError` catch keeps matching, `StaleTrackHandleError`'s message
byte-identical to what getter already threw. Liskov argument for `TypeError` root is ADR-056's, unchanged.

One spelling. `TrackHandle.track` renamed `Handle.definition`, no alias survives. Break on shipped, exported,
documented member — taken not aliased: keeping both spellings path guardrails refuse, second name drift this record
exists to prevent.

Ownership does not move. `ProjectRuntime` holds every token, builds every handle, stays only thing throwing. Motion
entries gain token from same `#nextToken` track entries use — staleness machinery per-entry not per-track-ness — one
generic `#liveOf` compares captured against live for both maps. `SH-7` measures as number: module holds exactly one
token comparison → second handle family cost second probe name not second comparison.

**Alternatives rejected.** Keeping `track` beside `definition` = alias, ADR-003's reasoning reaches member as much as
flag: second name permanent moment caller depends. Declaring asymmetry twice, once per handle = shape two private
`readNumber` copies had before `plugins/frame.ts`. `motion` getter on `MotionHandle` mirroring `track` = first sketch in
issue #223, two-names-per-handle drift itself. Second token mechanism for motions unnecessary: existing one never about
track-ness. Structural typing with no shared base leaves `StaleHandleError` nothing to parent of, caller wanting to
catch staleness from any handle nothing to name.

**Consequences.** Every reader of `handle.track` moves same push, compiler finds them. Seven call sites across two test
files missed first attempt, reported four assertion failures plus seven `TS2339`s. Rename unfinished, not design wrong —
rule earned, stated in `SESSION-STATUS.md`: rename with no alias finished at every reader before push landing it,
`typecheck` gate proving it.

`adopt` keeps returning `{ id, track }`. Not handle, its `track` field value not live read, renaming = second break with
no evidence in this slice.

`MotionHandle.definition` projects tracks motion currently owns through same `#ownedBy` `#snapshot` and destroy refusal
read, not from retained entry. Entry runtime `addMotion` accepts carries empty `tracks` list by construction → answering
from it reports no tracks for motion owning three, count in destroy refusal could disagree with list `trackIds` shows.

Stale handle refuses `tryTrack` too, plan left implicit. Probe never throws about id it cannot find, but whether handle is
live one at all different question — answered before any id read.

`addMotion` still returns `{ id }` not `MotionHandle`. Changing create verb's return = second break no evidence here,
`motion(id)` reaches same handle.

**Amendment, 2026-08-31: tier 0 lands here, as B2.** `MotionHandle` gains `setTrigger`, `setStagger`. Amend this record
rather than opening one: it recorded base, left this half open by name, one decision trail worth more than second file
agreeing with first.

One invariant not two slices. `Motion` holds `#stagger` own state, no driver reads → both verbs one edit, one refusal set,
one pair seams. Neither field appears in `collectTrack`, `readPluginBindings`, `GraphNode`, re-verified against
`e7a6d3f` → `#commit` wrong mechanism here not expensive one: no candidate graph for it to accept. `RA-33` measures as
`replaceGraph` call count not timing.

Order is contract. Staleness first, through one resolver every handle member reads. Then trigger's own validity, asked of
`validateMotionTrigger` — owner `addMotion` already asks not copy → refusal costs no teardown at all: verb releasing live
driver then refusing replacement leaves Motion with none, no way back. Then redundant edit, asks seam nothing: installing
trigger Motion already has means disposing live driver, resubscribing host source caller cannot see and did not ask for.
Then seam itself, failure reported verbatim not wrapped — ADR-035's precedence rule at new call site. Retained definition
moves last, once nothing that can refuse left.

Idempotence has one owner: runtime. `Motion.setTrigger` carries no redundant-install guard of own — second owner of that
rule shape ADR-056 collapsed.

Swap in place not rebuilt instance. `#attachTrigger` already isolated, guarded; detach two lines `pause()` uses;
`TriggerPort` declares no `dispose` → host resource and ADR-035's throw risk one layer up, in whatever builds
`created.port`. Rebuilt `Motion` over same entries would satisfy `RA-37` too — compiled Tracks owned by `tracks` map,
`disposeTracks` already false — but loses playhead, re-runs `play()` = behaviour change not implementation detail. Port
and its `clockBinding` move together. `acceptsExternalSignal(clockBinding)` false exactly for driver-backed trigger → swap
cannot leave capability behind letting `signal()` scrub Motion whose driver owns time. Clock consumer registration made by
one function build and swap both call, not two copies of exhaustive switch that can disagree about binding kind.

Two hooks, `replaceMotionTrigger`, `setMotionStagger`, beside existing `addMotionTrack` / `replaceMotionTrack` /
`removeMotionTrack` family. Two not one: which one edit asks half of what edit claims — stagger routed through trigger hook
would dispose live driver, resubscribe host source for field no driver reads; one hook taking both fields could not tell
that from correct edit. Verbs not decoration either: trigger carries disposable resource behind it, stagger bare field →
one name over both hides real teardown behind name reading as plain write.

Stagger rule not copied into runtime. `validateV5` never had one, `Motion` refused non-finite or negative stagger since it
existed, construction and edit now ask that one function → seam where refusal already lives. Cleared stagger leaves no key
behind: authored field optional, Motion reporting `stagger: undefined` would answer shape no author can write. Re-layout
synchronous, matching `addTrack`, `replaceTrack` — already re-seed moment they land: one answer when layout-affecting
mutation becomes visible not two, deferred one silent no-op from caller's side until unrelated later event fired.

No new export, no new rule id. `stale-motion-handle` already covers both verbs through base — what B1 buying family paid
for — `RA-32` derives refusing surface from handle's own keys → both members covered moment they existed.

One residual, stated not hidden. Displaced created trigger released last → every step that can refuse has refused before
driver layer moved. Host `dispose` throwing after that point reported not swallowed: teardown failure at layer owning host
resource, swap it follows already landed while retained definition has not.

**Alternatives rejected in the amendment.** `setMotion(definition)` as upsert: takes whole `MotionDefinition`, must do
something with required `tracks` array — dropping live tracks, refusing, accepting-then-ignoring all wrong. One verb over
both fields: prices bare field at driver teardown. Record of own: two files for one decision trail, against half this
record left open by name. Rule id of own for stale tier 0 edit: base already answers, second id second thing caller branches
on for one condition.

**Evidence.** Cases `RA-27` through `RA-32` in `packages/core/test/unit/runtime/handle-base.test.ts`. Red run
[33359083134](https://github.com/chahyasantoso/motion5/actions/runs/33359083134), archived `logs/33359083134/` on
`ci-logs`: `typecheck`, `format:check` passed first, then 6 failed 810 passed, all six on assertions. Green run
[33361911006](https://github.com/chahyasantoso/motion5/actions/runs/33361911006) on `2bad344`, all six checks.

Third run between them, deliberately not cited as evidence.
[33360485220](https://github.com/chahyasantoso/motion5/actions/runs/33360485220), archived `logs/33360485220/` on `ci-logs`,
failed `typecheck` on seven unmigrated call sites → `npm test` never ran inside `quality`, four `integration` failures beside
it same single cause read through member that no longer existed. Per working constraint, run failing `typecheck` = broken
file not failing assertion.

**Evidence for the amendment.** Cases `RA-33` through `RA-38` in
`packages/core/test/unit/runtime/motion-driver-edit.test.ts`, `RA-32` beside them: its argument record named both members
ahead of source → coverage gate red in same run rather than weakened. Red run
[33363271700](https://github.com/chahyasantoso/motion5/actions/runs/33363271700), archived `logs/33363271700/` on `ci-logs`:
`typecheck`, `format:check` passed first, then 7 failed 815 passed, all seven on assertions, `integration`, `boundaries`,
`build`, `end-to-end`, `performance` green. Green run and head sha live in pull request body.
