# ADR-064: One recipe is one transaction, and a commit derives its hooks from what it commits

**Status:** Accepted, 2026-08-31. Slice D of [issue #223](https://github.com/chahyasantoso/motion5/issues/223).

## Context

Issue names verb, no vocabulary: build project structure incrementally from nothing, runtime-driven, each step correct alone, whole committed once. Every structural entry point costs whole transaction today: `n` authored ops across `m` tracks → `n` candidate builds, `n` `GraphBinding.replace`, `n` `ObservationState.commit`, `n` flushes; no abort for half-built structure.

Plan named slice D `edit(recipe)` atop A1 plan-as-data, abort semantics free: only `#commit` registers handle token. Half right. A1's five plan builders each assemble own hook list; lists do not compose.

Plan's worked example: recipe adds track, edits it → `addMotionTrack` in settle steps from add, `replaceMotionTrack` in effects from edit. Effects run before graph asked; settle steps after accepted → Motion asked to replace track never told. Add-then-remove worse: mount settles for node committed graph lacks.

## Decision

Commit hooks derived from what commit commits, not accumulated per op. `SchemaPlan` narrows to two maps graph asked to accept; one derivation reads retained pair vs committed pair → effects, settle steps, seeds. Every entry point map builder; none names hook.

`ProjectRuntime` one transaction owner, one added state: open transaction = pending pair of maps. While open, every structural read resolves against that pair through one accessor, not retained one → two-step edit sees own first step; handle issued inside recipe answers `live` truthfully both sides of abort. `#commit` merges into open transaction when one open, applies when none; nothing else changes: `replaceGraph` + `rejectAfterRollback` keep one call site each from A1, every hook now one too.

`SchemaTransaction` declared in `contract/`, ADR-056 reason declaration-surface gate enforces; projection of runtime structural members, not second authoring implementation. Buys narrowing recipe is for: `mount`, `seek`, `subscribe`, `dispose` unreachable through it — none structural, none undone by throwing recipe. `ProjectHandle` gains `edit`; entry exports type per parameter half of declaration-surface rule: exposed member unusable if argument type not importable.

Two refusals travel with it, both `TypeError`. `schema-transaction-nested` refuses recipe inside recipe: silent join → inner `edit` returns before anything asked committed, helper cost + guarantees depend on context above. Invisible-context shape that cut `setMotion`, cut `setTrack`, kept `setKeyframe` apart from `setKeyframeGroup`.

`schema-transaction-immediate` refuses tier 0 or tier 2 edit inside recipe, by verb name. Neither structural commit: tier 0 reaches layer owning created trigger + clock consumer; tier 2 ends at own `invalidate`. Both apply immediately, survive abort.

Recipe staging nothing commits nothing, answered by identity on pair, not dirty flag: no-op op returns map given → pair recipe ends on = pair it opened with.

## Alternatives rejected

**Shipping derivation as own equivalence slice.** Guardrail: refactor existing only to unblock later slice ships alone with own equivalence evidence. This one does not — measurement, not preference: before recipe exists every commit carries exactly one change → derived hook list + per-entry-point one indistinguishable through public surface. Alone, no evidence to write, only "the suite is still green"; green case only evidence of what it would fail without. `RA-65` first case in project history telling two apart, impossible without `edit`.

**Deferring tier 0 + tier 2 into settle steps, not refusing.** Read, refused: settle step cannot refuse → moves `setTrigger` failure to after graph committed + retained definition moved, opposite of contract `RA-35` pins. One condition, one failure contract: verb refused by name inside recipe, not weaker second contract outside.

**Queueing ops, replaying at commit.** Op log second representation of same answer; every entry point already builds whole candidate pair from reads. Merging = adopting: open transaction holds pair, not list; no compensation path to keep agreeing with forward one.

**Narrowing `SchemaTransaction` by splitting `TrackHandle`.** Handles recipe gets ordinary; tier 0 + tier 2 members refuse by name while recipe open. `TrackHandle` one interface across both tiers; splitting = change of own with own break. Transaction interface states what caller may reach; verb refuses what handle may reach.

## Consequences

`n` authored ops across `m` tracks → one candidate build, one `GraphBinding.replace`, one `ObservationState.commit`, one side-effect ordering with one rollback, one flush. Throw inside recipe commits nothing, reaches no hook, issues no live handle; travels verbatim.

Recompile predicate ADR-062 added asked from derivation, not `#replaceTrack` → once per op becomes once per committed replacement. Callers outside recipe: same place — before any effect applied, before anything retained moved → candidate registry refuses still costs no teardown, same message. Inside recipe refusal arrives at commit, not op.

Add then remove in one recipe costs nothing: node absent from both pairs, derivation silent. Capability, not optimisation: per-entry-point hook list could not express without mounting node committed graph lacks.

Public surface +1 member, +1 type; nothing else moves: no handle grows member, no verb changes shape, `SchemaPlan` module-private before + after.

## Evidence

`RA-62` through `RA-68` in `packages/core/test/unit/runtime/schema-transaction.test.ts`, pushed before source: two runs cited by id, not shared.

- `RA-62` five ops over three tracks, one motion: one build, one flush, all five land.
- `RA-63` throw commits nothing: no hook, no build, no flush, same `GraphIR` by identity, untouched definition by identity, handle inside recipe answers `live` false.
- `RA-64` read inside recipe resolves against staged plan: two-step edit sees own first step.
- `RA-65` track added then edited in one recipe compiled once with definition recipe ends on, registered with its Motion once, no `replaceMotionTrack`, no staging. Derivation case.
- `RA-66` recipe whose ops all no-ops returns recipe's answer, commits nothing.
- `RA-67` nested recipe refused by name, surface usable afterwards.
- `RA-68` tier 0 + tier 2 edit refused by name inside recipe, accepting direction asserted in same rig.

Every case failed on assertion in red run, not call that could not run: `editing()` asserts seam is function before use, precedent `RA-16`/`RA-27`. Seven cases, seven expected assertion failures — what capability slice should turn red. Red run `logs/33393621794/` on `ci-logs` reports exactly that: `typecheck` + `format:check` passed first, then 7 failed, 845 passed, other five checks green. Run ids in pull request body.

`RA-1` through `RA-7` in `structural-commit-path.test.ts`: equivalence evidence for derivation, green both sides. `U-5` through `U-8` in `track-staging.test.ts`: equivalence evidence for replacement ordering it now derives. Neither restated.

## Follow-up

`docs/guide/api-reference.md` names no `edit(recipe)`, no `SchemaTransaction`; `docs/guide/errors-and-diagnostics.md` enumerates neither `schema-transaction-nested` nor `schema-transaction-immediate`. Both join guide debt `docs/SESSION-STATUS.md` tracks.

## Amendment, 2026-09-02: the narrowing was never the enforcement

One decision sentence wrong about run: one saying `mount`, `seek`, `subscribe` + `dispose` "are not reachable through it". Not members of `SchemaTransaction` — all narrowing can say. Recipe closes over `ProjectHandle` caller called `edit` on: same caller reaches all from inside; `#refuseInsideRecipe` asked by tier 0 + tier 2 alone.

`seek`, `mount`, `unmount`, `invalidate` + `signal` all publish or mount immediately, survive abort — shape `schema-transaction-immediate` exists for — so all five refuse by name now. Refusal, rule id, mechanism unchanged; who asks changes.

Deferring them refused second time, reason original decision did not need. `mount` answers instance; `seek` + `invalidate` answer `PatchBatch` caller reads; `signal` refuses unknown motion id → deferred call answers batch describing publication not happened: one boolean, two incompatible meanings one level up. `unmount` only one of five deferrable honestly; deferring one of five = two-failure-contracts defect this amendment closes.

Two consequences. `#mountNode` one owner of attaching member: settle step mounted through public verb, stayed outside guard only by `finally` ordering in `edit`; internal caller kept out of public refusal by `finally` ordering in another method must not stand. `signal` moves to `ProjectRuntimeOptions.signalMotion`, beside `replaceMotionTrigger` + `setMotionStagger`: lived in closure over engine's Motion map where owner of rule cannot be asked. Unknown-motion refusal stays in that layer verbatim; `createHandle` loses parameter carrying it.

`subscribe`, `get`, `adopt`, `destroyAdopted` + `dispose` stay reachable, each own reason. Listener caller's own object; inside recipe receives commit's flush. Read of last published patch truthful while recipe open — nothing published. Two structural verbs compose into one commit as `addTrack` does: narrowing was documentation, not fence. Teardown must be reachable from `catch`. Host clock ticked inside recipe still publishes: out of reach, not allowed; slice refuses what handle can reach.

Evidence `RA-79` through `RA-85` in `packages/core/test/unit/runtime/immediate-verb-refusal.test.ts`, accepting direction asserted in same rig for every refusal.

## Amendment, 2026-09-03: a commit that derives no node does not flush

Decision above ends commit at one flush seeded with what it committed; one property unrecorded: empty seed set not cheap flush → `#apply` returns without asking `invalidate` when derivation names no node. Promotion half of read-budget audit #267: reasoning lived in one docblock above `#apply`, nowhere else; audit shrinking that file removes only record with comment holding it.

Empty `invalidate` not no-op, not cheap: opens batch, notifies every batch subscriber, moves sequence, drains seeds deferred flush carried → subscriber handed frame publishing nothing; deferred flush loses held seeds to empty batch. Commit deriving no node has nothing to publish → must not spend frame's machinery saying so.

Empty real answer, not default: guard belongs to commit path, not seam called. Motion add + Motion destroy derive no node, no edge: runtime Motion only created empty, only destroyed empty → pair graph accepted moved while nothing in it publishes. Removal other shape: seeds every node reading removed one, empty for most removals; naming nothing ≠ having nothing to name. `RA-98`, `RA-99` for second half.

Behaviour unchanged, pinned by `RA-10` since A1. Amendment adds why: docblock above `#apply` collapses to pointer like every other in file, loses nothing.

## Amendment, 2026-09-03: what a commit costs in front of the graph

Second promotion of read-budget audit #267, same rule: reasoning lived only in docblocks in `packages/core/src/runtime/project-runtime.ts`; audit shrinking that file removes only record. Behaviour unchanged, pinned by `RA-89` through `RA-97`.

No structural commit cost priced per motion, per op or per access. Three properties say what that means; each ownership statement, not measurement.

**The committed pair is walked once.** Snapshot graph handed built from one walk, bucketed by owner each entry names; free tracks fall out of same pass, not second. Bucket fills in map order → each motion's list = per-motion filter output; motion owning nothing answers empty list, not no key — document loader accepts, what runtime-added Motion starts as. Replaced version asked `#ownedBy` per motion; that member materialises whole track map → placing V definitions cost `O(M x V)` time, M arrays of length V allocation. Every structural commit paid it, before candidate build incremental builder cache-hits every untouched node — invisible: measured wins before all about tick; this authoring side.

Not second derivation of fact reverse-topology unification collapsed — objection worth answering, not waving at. Which motion owns track = stored field on entry, not derivation: neither spelling derives; both read field in same map order. `#ownedBy` stays owner of single-motion question, asked by destroy refusal's count + both `MotionHandle` members; `RA-91` asserts agreement against all three remaining readers.

**The pair is adopted by pointer.** Adoption read both retained maps out, cleared, `set` every entry back → commit moving one entry paid `O(V)` map writes for half of schema not moving: one-track edit on rig of 600 tracks rewrote 600 track entries + every motion beside. Read-out existed for real hazard: plan builder hands own live map through for untouched half; clearing source mid-iteration empties it. Adopting object answers by construction: untouched half = map class already holds, assignment no-op; moved half = map one of two staging accessors made for this commit, nothing else holds.

Cost = ownership change; why retained pair no longer `readonly`: plan builder may not keep what it handed over; `#stageTracks` + `#stageMotions` only two allowed to make one. Each `SchemaPlan` half optional; half commit did not move absent, not handed back → absent half resolves to map class holds, adoption assigns it back to itself. `RA-92`, `RA-97` pin it; every untouched entry's definition handed through by identity — ADR-058's cache-hit rule enforced, not amended.

**A recipe copies each half once, after the last refusal.** Half starts as retained map by identity, replaced by copy on first op staging into it → n ops one copy, not n; recipe staging nothing answered by identity on pair, not dirty flag — property decision above relies on. Copy taken after entry point's last refusal, never before: copy for op that then refused leaves recipe holding pair differing from retained one with exactly same entries; `edit` would spend candidate build + flush committing it. `RA-95` both directions.

Outside recipe copy = floor, not expense to remove: derivation compares committed pair vs retained, so pair graph asked about cannot be pair class holds.

## Amendment, 2026-09-04: a precondition asserted before a callback is not a precondition on what follows it

`edit` asserts liveness on entry, hands control to recipe, then writes. Amendment 2026-09-02 makes three facts defect, not sequence: lists `dispose` among members stay reachable inside recipe, reason teardown must be reachable from `catch`. Liveness `edit` asserted stale by apply time; stale because this record said so. Issue #288.

Recipe disposing without staging already correct, for reason third amendment gives, not by luck. `dispose()` calls `this.#tracks.clear()`: mutates map in place, not replacing → `open.tracks === this.#tracks` holds; pair answered by identity as intended. Emptying retained maps not what makes comparison differ — one step of original report wrong.

Stage-then-dispose the case; cost worse than wrong error. `#stageTracks()` replaces open half with copy on first staging op → comparison differs; `#derive` reads copy against retained map `dispose` just emptied: every entry in project reads newly added, not one recipe staged. One `addTrack` inside recipe bought `compileTrack` per track in project, `addMotionTrack` + mount settle step each, seed each. All effects applied; `replaceGraph` reached `GraphRuntime` liveness check, threw; `rejectAfterRollback` reverted in apply order with `disposeTrack` per track, rethrew. Caller lost recipe's answer to `Error: GraphRuntime is disposed.` — names layer noticing, not recipe deciding; composition just disposed handed compile + dispose per track it owned on way out. Settle steps never ran: nothing mounted against dead graph — one thing not wrong.

**The invariant.** `#apply` never starts against runtime caller disposed; recipe that disposed runtime returns own answer.

**The re-ask belongs to `edit`, and it answers.** After recipe returns, before write: only point question asked about state write runs against. Answers, not refuses — class split between probe and resolver, `#entryIfLive` beside `#liveEntry`: one question, once answered, once refused, caller chooses. Dropping staged pair honest, not lossy: disposed runtime cleared retained pair, disposed graph → nothing left to commit pair to.

**`edit` routes through `#commit` rather than calling `#apply` directly**, second half of same slice, not tidying beside. `#commit` section of `packages/core/src/runtime/project-runtime.md` calls it one path by which structural change reaches graph or open transaction; claim false while `edit` had own path. At `edit`'s call site `#open` already `undefined` — `finally` cleared before comparison — so `#commit` behaviourally identical; guard answers `none open, apply` for right reason, not inapplicable. Buys: decision to apply one place, liveness answer exactly one reader. `#apply` gains what `replaceGraph`, `rejectAfterRollback`, every hook had: one call site.

**Stated on starting rather than on running — scope, not hedge.** Host hook inside `#apply` caller code: `compileTrack`, `stageTrack`, `createMotion` run between derivation and `replaceGraph`; one disposing runtime mid-commit still reaches graph on dead runtime. Slice changes nothing there; no case asserts about it. Same shape one indirection out: precondition asked before hook, trusted after; named so invariant above not read as covering it.

**Refusing `dispose` inside a recipe was rejected.** Cheapest change, via existing `#refuseInsideRecipe`; contradicts 2026-09-02 amendment directly. Breaks exact path amendment made for: recipe catching own error, tearing project down gets `TypeError` for answer; error being handled lost behind teardown refusal. `dispose` has shape immediate-verb rule describes, exempt for stated reason; amendment names it explicitly, not by omission. `RA-110` refuses this alternative; its whole job.

**Guarding inside `#apply` was rejected for ownership.** Five other callers cannot reach it disposed. `addMotion` + `#addTrack` ask `#assertLive`; `#removeTrack`, `#removeMotion`, `#replaceTrack` reached through resolvers asking before resolving: `#writableEntry`, `#writableMotion`. When amendment written, last three asked nothing of kind: reached from `MotionHandle.destroy`, `TrackHandle.replace`, `#writeKeyframes`, `#replaceWithObservation`, resolved through `#liveMotion` + `#liveEntry`, answered staleness; staleness answered only because `dispose` empties retained maps, token lookup misses. Stating that, not rounding to liveness, made it citable: same fact turns defect from wrong message into compile per track in project; also second defect — one condition, two public failure contracts: issue #298, ADR-056's 2026-09-04 amendment. Either way guard in shared write path only fired for one caller reaching it, placed where all six pass; such guard hides real defect when it fires for different reason. Now fires for none. Cannot answer at all: `#apply` returns `void`; answer the whole point.

**Evidence.** `RA-109`, `RA-110` in `packages/core/test/unit/runtime/schema-transaction.test.ts`, owns `RA-62` through `RA-68`, therefore owns `edit`. Pushed ahead of source; red run own, citable by id.

- `RA-109` recipe adds track, disposes: returns own answer, throws nothing, reaches no hook, leaves runtime disposed. Red before source: graph layer's error arriving as answer; journal naming every track twice.
- `RA-110` recipe disposing without staging not refused, commits nothing. Green before + after; lie detector for rejected refusal, not evidence of fix. Green for two reasons across slice — identity on pair before, amendment's re-ask after; file says so: only one is fact about pair.

One red case — what slice carrying one new invariant should turn red. Other invariant already true; red count padded by asserting less in case that cannot fail = failure mode guardrail refuses.

**Consequences.** No public surface moves: no export, type, schema or handle member changes; `edit` keeps signature + return contract. Changes which value it returns in one case previously throwing from two layers down. `docs/GUARDRAILS.md` gains general rule — rule this slice earned goes there, not status file; `docs/LIVE-EDIT-COST.md` gains what caller may rely on when recipe tears project down.

## Amendment, 2026-09-05: the rung this record names no longer exists under that name, and it asks two conditions

`#refuseInsideRecipe` renamed `#refuseReentrant` by [ADR-070](./ADR-070-one-reentrancy-rung.md), asks second condition after this record's. This record's refusal unmoved: `schema-transaction-immediate` keeps name, `ruleId`, message, verb argument; asked first; `RA-79` through `RA-85` untouched. Rename private; widening second refusal beside, not change to.

Two decisions here load-bearing elsewhere; named so reader of amendments above not surprised. `dispose` reachable inside recipe = why `edit` clears `#open` in own `finally` before commit; that construction precisely why recipe condition cannot see commit — this record's exemption is reason ADR-070 had to exist. Five verbs 2026-09-02 amendment moved onto rung — `seek`, `mount`, `unmount`, `invalidate` + `signal` — five of ten ADR-070's second condition reaches: same list, same rung, second time; whole of why one rung right shape, not sibling guard.

Amendment about rung, nothing else. Citation elsewhere reading "ADR-064's amendment of 2026-09-05" for deferred teardown, late release, or handle answering stale before retained maps cleared means [ADR-067](./ADR-067-commit-lifecycle-and-deferred-teardown.md): record deciding all three, carries that date. Citations noted, not rewritten: record they belong to not this one's to correct; drift predates noticing slice.
