# packages/core/src/runtime/project-runtime.ts

The reasoning this file's private surface used to carry as docblocks, moved here rather than deleted. A source file that does not survive one read through the contents API cannot be safely edited by anchor, and this file is the primary edit target of the AI implementor workflow, so its size is a correctness property rather than a preference. `docs/AI-EDIT-WORKFLOW.md` owns the rule and `scripts/read-budget-scan.mjs` owns the budget.

### How to read this

Read this before the source rather than after it. It is the map: every private member with reasoning behind it has a section here, in the order the source declares it, so the member list arrives whole in one read even on a day the source does not.

One `##` heading per documented top-level declaration or class member, named exactly as the source declares it. A field inside a file-local type is documented under that type's heading. A member with nothing worth saying has no section here, and its absence means exactly that rather than that the docs are elsewhere again.

The exported surface keeps its docblocks in the source, because TypeScript carries those into `.d.ts` and into editor hover, so moving one would delete an API doc rather than relocate it. Comments that explain the statement on the next line also stay in the source, because no heading here owns one.

Nothing here duplicates an ADR. A statement a record owns is a pointer to that record, here exactly as it was in the source.

## TrackEntry

`overlay` is the animated half of the last live write, and nothing else. A private map entry, carried by no public surface, and why an override needs one is ADR-060's. See ADR-060.

## MotionEntry

One retained Motion, and the token every handle to it captures.

The token comes from the same `#nextToken` the track entries use, because the staleness machinery is per-entry rather than per-track-ness, which is ADR-061's. No reader trusts `definition.tracks`, because it is empty for a runtime add and authoritative for a loaded one: `#ownedBy` is the one owner of which tracks a motion has. See ADR-056 and ADR-061.

## SchemaEffect

One side effect a structural commit needs in place before the graph is asked to accept it.

`revert` is the inverse, and it is optional because a removal and a motion destroy reach the candidate graph with no hook applied yet. An effect counts as applied only once its `apply` returned, which is `#apply`'s own. See `U-7` and `RA-2`.

Every one of these inverses reaches the composition, which is why a teardown may not run between an `apply` and its `revert`. That is ADR-067's, and it is the reason `#teardown` is deferred rather than called where `dispose()` was.

## SchemaPlan

One structural transaction, as data, and now only the pair the graph is asked to accept.

`tracks` and `motions` are what the graph is asked to accept and, once it has, what the retained maps become, adopted from the same pair that built the snapshot so the committed graph and the maps cannot drift. Why an untouched entry is handed through by identity is ADR-058's, and `RA-7` compares them that way.

Each half is optional: a half this commit did not move is absent rather than handed back, and what pointer adoption buys and costs is ADR-064's third amendment. `#stageTracks` and `#stageMotions` are the only two things that make one, and therefore the only two allowed to fill this. `RA-92`.

What a plan no longer carries is a hook list: a commit's hooks are derived from what it commits, by `#derive`, and every entry point is a map builder that names no hook at all. Why a hook list assembled per op cannot compose two is ADR-064's, and `RA-65` is the first case that can tell the two apart. See ADR-064.

## SchemaCommit

What one accepted pair costs, and the only declaration in this file that names a hook.

`effects` are applied before the graph sees the candidate and reverted in **apply order** when it refuses, which is ADR-045's republish-before-restore rule rather than an incidental ordering. `settle` runs only after acceptance. See ADR-031 and ADR-045.

`settle` carries no inverse, and that absence is load-bearing rather than an omission: the graph has already accepted, so a settle step is not allowed to fail. `#apply` depends on that, which is why it never abandons the phase halfway. Nothing enforces it, and that is issue #306 rather than a property of this declaration.

`touched` names the nodes this transaction changed and is seeded into one flush once the commit settled. Empty is a real answer rather than a default, and why a commit that derives no node does not flush at all is ADR-064's amendment. Which nodes a removal names, and why a solver is the reader an edge test misses, is ADR-051's amendment. See `RA-98` and `RA-99`.

## OpenTransaction

The pending pair one open recipe is staging, and the whole of the transaction owner's state.

Mutable in exactly its two fields, and no op log beside them. Each half starts as the retained map by identity and is replaced by a copy on the first op that stages into it, which is `#stageTracks`'s own. See ADR-064 and `RA-93`.

## #tracks

The retained pair, and the two fields a commit adopts rather than rewrites. `#motions` is the same field for the other half and carries the same rule.

Not `readonly`, because a commit replaces the map object rather than rewriting its entries, which is ADR-064's third amendment. The map it adopts was made by `#stageTracks` or `#stageMotions` and nothing holds it afterwards. Every reader still goes through `#readTracks` and `#readMotions`, which answer a `ReadonlyMap`, and both in-place tiers still write through these by id. See `RA-92` and `RA-97`.

## #open

The open transaction, and the one piece of state `edit` adds to this class.

Present exactly while a recipe is running, and the same shape the retained maps are, read through the two accessors so no verb learns it is inside a recipe. See ADR-064.

No longer cleared by `dispose()` on every path, and it does not need to be. `#commit` returns early whenever this is set, so it is always `undefined` inside `#apply`, which means a deferred teardown's window can only ever exist while no recipe is open. ADR-056's measured claim that a disposed runtime never has an open recipe therefore survives, and `#assertLive` and `#refuseReentrant` still cannot both have something to say about the recipe half. That construction also decides the whole of issue #310, which is the sharper thing to know about it: it is the reason the recipe condition cannot see a commit, so a second condition had to be asked somewhere, and `## #refuseReentrant` is where it is asked. See ADR-067 and ADR-070.

## #inFlight

How deeply this class is currently inside caller code it has to survive, and the one thing `dispose()` reads to decide whether it may release anything.

Named for what it counts rather than for the first thing that counted, which is the whole of the rename. A commit raises it, and so does every direct write, because what makes a release unsafe is that a seam is on the stack and not that a graph is being replaced. A live value write is not a commit and must never become one -- this document states that as a rule under `## #writeValues` -- so a field read by both cannot be called `#committing` without lying to one of its two readers. The depth stays a depth for the reason below, unchanged. See ADR-069.

A depth rather than a flag, and that is a correctness choice rather than defensiveness. A hook is caller code and can re-enter this class through a public entry point, so a flag cleared by the inner `finally` would release the graph and the composition while the outer boundary was still unwinding through them.

The bound is one again, by a different guard, and the state is still not narrowed to it. Three revisions of this paragraph read as one argument. While `#apply` was the only raiser, `#commit`'s refusal of a re-entrant commit made the depth provably zero or one. ADR-069 added four raisers and withdrew that bound, because `compileTrack` calling `setValues` reached `#writeValues` and raised this a second time inside the commit's own window. `#refuseReentrant` refuses exactly that call, and it is asked before `#boundary` is entered at every one of the four direct writes, so all five raisers now sit behind a guard that reads this field first and a depth of two is unreachable.

It stays a counter, and that is the decision rather than an oversight. The bound has been proved, withdrawn and re-proved across three slices without this field changing once, which is what a counter buys: a flag would have been right in the first slice, wrong in the second, right again in the third, and silently wrong for the whole of the middle. `docs/GUARDRAILS.md` carries the general rule and this field is what earned it. See ADR-069 and ADR-070.

Raised ahead of `#derive` rather than ahead of the effect loop, because `#needsTimelineBuild` asks `resolveKeyframes`, which is caller code too. See ADR-067 and ADR-069.

## #pendingTeardown

That a release was asked for and has not happened yet. Set only by `dispose()` and cleared only by `#teardown`, which is what makes the release exactly-once by construction rather than by two guards agreeing on a condition. See ADR-067.

## #readTracks

The retained tracks, or the pending ones while a recipe is open.

Every structural read in this class goes through this rather than reaching `#tracks` directly, which is the one accessor ADR-064 puts in front of the pair. The two in-place tiers keep reading the retained maps and refuse by name inside a recipe instead. See ADR-064.

## #readMotions

The same question about the other map, and the same reason.

## #stageTracks

The track map this commit will hand over, mutable, and copied once rather than once per op.

Outside a recipe it is a copy of the retained map, and a commit in flight is the one condition under which that copy would be wrong rather than merely fresh, because it would lack the change the commit is holding in a local; `#commit` refuses the re-entry that could ask for one, which is ADR-068's. Inside one it is the pair the recipe is staging, made once by the first op that stages anything and written into in place by every op after that, so n ops cost one copy. Why the copy outside a recipe is the floor rather than an expense to remove is ADR-064's third amendment.

Called after an entry point's last refusal and never before it, because a half that is still the retained map by identity is the whole answer to whether the recipe staged anything. That ordering rule is the same amendment's. See `RA-93` and `RA-95`.

## #stageMotions

The same question about the other map, and the same reason.

## #mountNode

Attaches one member, and the one owner of mounting.

Split from the public verb because a commit mounts too, for the reason ADR-064's amendment records. The public member owns the contract, this owns the attach. See `RA-80`.

That split stopped being a tidiness argument when the rung gained its second condition. `mount` now refuses from inside a commit, so a settle step calling the public verb would refuse the commit's own mount, and this member is the whole of what keeps the two apart. `## #refuseReentrant` states it as a rule rather than leaving it to this section. `RA-134` measures it from the direction that can fail: a hook's `mount` of the node this commit is adding is refused, and this member's mount of that same node is the one that happens. See ADR-070.

Reached from a settle step, which is why the teardown is deferred past that phase rather than into it: `GraphRuntime.attach` asserts liveness, so a release that ran when a settle hook disposed would make this throw on the next step with the commit already adopted and nothing left to unwind it. See ADR-067 and `RA-117`.

## #transaction

The narrowed surface one recipe is handed, and a projection rather than a second author.

Every member forwards to the member this class already has, so there is one owner of what an op costs. The narrowing is a statement about what a recipe is handed and never one about what it can reach, and every immediate verb refuses at itself instead, which is ADR-064's amendment. `addMotion` resolves the handle it returns through `motion`, because the id is what the entry point answers. See ADR-064.

## #readersOf

Which nodes read one node, and the one owner of that question.

Read from `GraphIR.dependants`, never rederived, so it names both kinds of reader: the observer of an edge, and a solver that reads this node as a chain member. Why an edge walk misses the second, why two consumers share one mechanism, and why `#derive` calls neither `dependantsOf` nor a parameter of its own are all ADR-051's amendment.

Deduplicated and frozen here, so the public member has nothing left to do, and first occurrence wins, which is the committed node order. See `RA-86`, `RA-87` and `RA-99`.

## #ownedBy

Every readable track a motion owns, in commit order, and the one owner of that question.

Three readers ask it: the count in the destroy refusal, and both `MotionHandle.definition` and `MotionHandle.trackIds`. Each carried its own filter before, which is how a motion could report `tracks: []` while owning three, and ADR-061 records why they share this one. The committed snapshot was the fourth and is not, for ADR-064's third amendment's reason.

It takes the map explicitly because a plan builder asks about the tracks it is about to commit while a handle asks about the readable ones, and reading `#tracks` here would make that difference invisible at the call site. See ADR-061.

## #entryOf

The entry for a node id, or the refusal for an id this project never had. Separate from `#liveEntry`, which answers about a captured token rather than about an id, and both are one lookup with one message rather than a copy per caller.

## #liveOf

The one place in this file that compares a captured token against the live one, generic over the entry rather than over the map it came from because the comparison is the same question about either. The two probes below it are two names for two maps rather than two copies of the rule, which `SH-7` measures as a count. See ADR-056 and ADR-061.

A disposed runtime has no live entry, and that is decided here rather than left to the fact that `#teardown` empties both maps. Those two used to be simultaneous, which is why ADR-064's amendment of 2026-09-04 could state the mechanism as "staleness answered only because `dispose` empties the retained maps and the token lookup misses". The teardown is deferrable past a commit now, so they are not: a settle-phase hook runs after `dispose()` returned and before anything is cleared, and a handle answering `live` in that window would be reporting a project whose disposal the caller has already been told happened.

Not a throw, which is the whole reason the term belongs here rather than one rung up. `live` reads this and may never throw, so ADR-056's refusal of `#assertLive` inside the reading ladder is untouched: a read still refuses under the stale family and a write still reports the disposal, because `#writableEntry` and `#writableMotion` ask liveness before they resolve. See ADR-067 and `RA-116`.

## #entryIfLive

The probe every `live` getter reads, so `TrackHandle.live` and every throwing member answer the same question about the same handle.

One comparison with two readers rather than a copy per member, which is ADR-056's. Asked of the pending pair while a recipe is open, so a handle issued inside one is live for the rest of it and never live after an abort. See ADR-056 and ADR-064.

## #liveEntry

The resolver every reading member of a track handle goes through, so the contract is uniform by construction rather than by four call sites agreeing. It was every private mutation path's resolver too, until a disposed runtime was found reported as a stale handle on seventeen of the eighteen members that write. That order is `#writableEntry`'s below: this member still owns the staleness and no longer owns which of the two questions is answered first. See ADR-056 and its amendment of 2026-09-04.

## #liveId

This handle's motion id, once the handle is known to be live. Reading the id and refusing a stale handle are the same call, so there is no order for a member to get wrong.

## #liveChildNode

The node id one child track name resolves to on a Motion handle, and the one owner of the order between three refusals.

Three things can be wrong about `handle.track("leg")` at once, and only one of them is reported: the Motion this handle captured may be gone, the child name may be ill-formed, and the child may not exist. The captured Motion is resolved first, so a disposed runtime answers `StaleMotionHandleError` before `qualifyMotionTrack` reads the name and before `track` or `tryTrack` looks it up, which makes that `TypeError` reachable only on a live handle. Which of the three a caller is told is ADR-056's second amendment, and a read reports the staleness rather than the disposal.

A rung rather than an expression at each call site. The two callbacks that need it wrote the resolve, the qualification and the delegate as one nested expression, twice, so their order was a fact about argument evaluation rather than a decision anything owned: a slice rewriting one of them changed half the contract while the half it did not touch stayed green. This resolves into a local instead, so the ordering is a statement here and both callbacks are one call each. `RA-113` measures that as a count.

Not a disposal check, and it may not become one. `live` reads `#motionIfLive` through this same ladder and may never throw, so the guard belongs on the writing rungs below rather than in any resolver a probe shares. See ADR-056's amendment of 2026-09-04 and its second amendment.

## #writableEntry

The resolver every writing member of a track handle goes through, and the one owner of the order between two answers to one condition.

A disposed runtime and a stale handle can both be true of one call, and `dispose` empties the retained maps, so the token lookup misses and staleness answers first unless something asks about the runtime before the lookup. Which of the two the caller is told is ADR-056's, and that record decided the runtime's lifecycle outranks one handle's. This is where the ordering lives, so it is asked once rather than at each writing member, and the deletion that proves it is `#removeTrack`'s own guard. See ADR-056's amendment of 2026-09-04 and `SH-8`.

Beside `#liveEntry` rather than inside it, because a read is answered the other way round and deliberately: `definition` and `requires` still refuse under `StaleHandleError`, which is the family that record asked a caller to catch, and asking liveness in the shared resolver would push a bare `Error` past every one of those narrowings. So the ladder now has three rungs with three readerships: the probe `live` reads, the resolver a read goes through, and this.

## #writableMotion

The same question about the other map, and the same reason.

Two members rather than one, for the reason `#liveEntry` and `#liveMotion` are already two: two maps and two refusals. `#assertLive` is therefore named twice in this file, which is the floor rather than a copy left to remove.

## #writableId

This handle's motion id, once the runtime is known to be live and the handle known to be current. The writing twin of `#liveId`, and it delegates to `#writableMotion` rather than asking `#assertLive` again, so the rung above stays the only place the order is stated.

## #motionDefinition

The Motion definition as it currently stands, tracks included, projected through `#ownedBy` rather than answered from the entry, for the reason ADR-061 records. See ADR-061.

## #removeMotion

Destroys a Motion that owns no tracks, from the id or from a live handle.

The refusal counts through `#ownedBy`, so it names the list `MotionHandle.trackIds` shows, and inside a recipe it counts what that recipe staged: a Motion whose last track the same recipe removed is destroyable in it.

## #refuseReentrant

The one rung for a verb that may not run from inside a callback this class is in the middle of.

Two conditions, one question. A recipe is open when a caller's own recipe callback is on the stack; a commit is in flight when a seam this class called is. Both are "caller code is running inside an edit that has not finished", both are answered by one field read, and both are asked at the same ten verbs, so they are one rung rather than two. A second guard beside the first would be the same condition list copied at ten call sites, with an ordering repeated ten times and the eleventh verb getting one of the two, which is the shape issue #298 deleted seventeen of. See ADR-070.

Ordered recipe-first, and the order is a contract rather than an accident. A recipe is something the caller wrote and can move, so its refusal names the verb and tells it which of the two to move out. A commit in flight is something the caller did not write -- it wrote a hook, which a commit called -- so its refusal names the condition and lets the stack name the verb. The two cannot both be true, because `edit` clears `#open` in its own `finally` before it commits, which this document states under `## #open`. So nothing observes the order today, and it is written down anyway: two conditions that cannot both be true are two conditions the next slice picks between by accident. See ADR-064 and ADR-068 for the two refusals it hands out.

Ten call sites and no more, which is the check a later member repeats rather than assumes: **a commit's own work uses the private twin, never the public verb.** The settle phase calls `#mountNode` and not `mount`, `#apply`'s own flush calls `this.#graph.invalidate(commit.touched)` and not `invalidate`, and both in-place write paths end at `#invalidateOne` and not at `invalidate`. That is what keeps a commit's own mount and a commit's own flush legal while a hook's are refused, and it is why this rung's condition set grows by exactly the callback-reachable paths and by nothing else.

Asked outside `#boundary` at all four direct writes, and that ordering is what keeps a write from refusing itself: the rung is asked before the depth is raised, and the tail of the write asks no rung at all. A refused call is not inside a callback and has nothing to survive, which is the same reason `#writeValues` puts its refusal outside the boundary. See ADR-069 and ADR-070.

## #setTrigger

Installs a Motion's trigger, and reaches no node and no edge doing it.

Tier 0, which is a claim about the mechanism rather than about the cost: `trigger` appears in no `GraphNode`, so `#commit` is the wrong path rather than an expensive one, and `RA-33` measures that as a `replaceGraph` call count. It is refused inside a recipe because an edit that reaches the driver layer immediately cannot be undone by one that throws. See `RA-68`.

The order is the whole contract, and ADR-061's amendment owns why: the recipe refusal, then the runtime's liveness and this handle's staleness together, then `validateMotionTrigger`, which is the owner `addMotion` already asks, then the redundant edit, then the seam, whose failure is reported verbatim, and the retained definition last, once nothing that can refuse is left. Liveness joined that sequence at the staleness step rather than as a step of its own, and no case can place it anywhere else: `dispose` clears `#open`, so the recipe refusal and the disposal never both have something to say. See ADR-035, ADR-056's amendment of 2026-09-04 and ADR-061.

The seam is caller code, so a hook called from here may dispose this runtime, and the retained definition moves after it. This member runs inside `#boundary` for that reason, so the release is deferred past the whole write and the entry it wrote is cleared by the teardown that follows rather than surviving it. The report is the last statement rather than a guard between the seam and the write, on the same reason the write completes: a refusal in the middle would leave the driver layer holding a trigger no retained definition names, and this tier has no flush to carry the answer, so `#assertLive` is asked here and answers the string tier 2's `#invalidateOne` answers. See ADR-069.

## #setStagger

Moves a Motion's stagger, which no driver reads.

The same tier and the same order as the trigger above, with one difference: there is no contract rule to ask, because the seam is where that refusal already lives and a copy here would be a second owner of it. The seam is therefore asked before the retained definition moves, which is what keeps a refused edit from being recorded as one.

An unchanged value asks the seam nothing, and a cleared one leaves no key behind. See ADR-061. A seam that disposes is answered the same way the trigger above answers it, through the same boundary and the same last statement, which is the whole of why one condition does not get a second contract on this tier. See ADR-069.

## #motionHandle

Every member resolves the entry before it reads an argument, which makes staleness the first answer rather than a second one. `tryTrack` refuses here as well, for the reason ADR-061 records: whether this handle is the live one at all is a different question from an id it cannot find.

The factory decides nothing, which was `#handle`'s rule and is this one's too. `definition` and `trackIds` delegate to `#liveMotion` and `#liveId`, the two child lookups delegate to `#liveChildNode`, and every writing member delegates to a `#writable` rung, so no member here states an order and there is nowhere for one to grow back into. `RA-112` owns what the four reading members answer and `RA-113` owns that each answers it from one rung.

## #removeTrack

Drops one node from the pair, and names no hook. The eviction, the dispose and the Motion deregistration are one settle step `#derive` owns, derived from the id being absent from the committed pair. See ADR-064.

Its own `#assertLive` is deleted rather than kept beside `#writableEntry`'s. This was the one writing member that already reported a disposal instead of a staleness, which is why ADR-056's Consequences could name it as where that rule shows, and one owner of the rule is the whole of what its amendment buys. See ADR-056's amendment of 2026-09-04.

## #resolve

The registry's answer about one authored record, or nothing when no registry was injected.

The diagnostics path is spelled exactly as `compileTrack` spells it, because the seam's second parameter is a path rather than a node id. See ADR-062.

## #needsTimelineBuild

Whether a replacement has to build a new timeline, and the one place a candidate is resolved.

The resolve is validation and is never skipped, and only the timeline build is skippable, which is ADR-062's amendment: a predicate that skipped the resolve would delete a validator rather than a cost. So the candidate is resolved here, refused here, and only then read as data. The retained record is resolved beside it rather than kept anywhere, on the same record's reason.

Asked from `#derive` rather than from `#replaceTrack`, which moves it from once per op to once per committed replacement and leaves it exactly where it was for every caller outside a recipe. What the answer is compared with is `sameCompiledTrackInput`'s question rather than this one's. See ADR-062 and ADR-064.

The resolve is a seam, so this member is the first caller code a commit reaches and it runs before any effect. That is why the boundary is entered ahead of `#derive` rather than ahead of the effect loop. See ADR-067.

## #replaceTrack

Replaces one node's definition in the pair, preserving its node id and its token.

A map builder: the staging, the Motion republish and their reverts are `#derive`'s answer, derived from the retained definition and the committed one. See `RA-65` and ADR-064.

## #commit

The one path by which a structural change reaches the graph, or the open transaction.

While a recipe is open there is nothing to do here: every entry point already wrote into the open pair. With none open the pair is applied immediately, and `edit` arrives here too, after its `finally` cleared the transaction and after the liveness re-ask that member owns. The sentence above was aspirational while `edit` called `#apply` directly, because there were two paths: the decision to apply now has one place, and therefore the liveness answer has exactly one reader. The guard is statically known at that call site rather than inapplicable to it, and it answers `none open, apply` for the right reason. See ADR-064 and its amendment of 2026-09-04.

It is not where a deferred teardown is drained, and it may not become that. This member returns early while a recipe is open, so a release drained here would never run for the `edit` path and would run at the wrong depth for a nested commit. The boundary belongs to the member below, which is the one that has the `try`. See ADR-067.

It also answers whether it may be entered while a commit is already in flight, and the answer is no. A hook is caller code, so a structural entry point called from one re-enters this member, and it used to find no open transaction and apply immediately: nested inside the outer `#apply`, staged from a retained pair that does not carry the outer commit's change, and adopted over by whichever of the two finished last. A lost update, with a compiled, registered and mounted node that no map and no graph node refers to. The refusal is here rather than at the six entry points, because one condition has one owner and this is the one place all of them reach, and here rather than in `#apply`, which runs one commit and should not have to know whether it is the outer one.

Refused rather than merged, and the merge is the direction issue #307 asked to be measured first because it is the DRY one. It cannot be built. This member's callee holds the pair it is committing in a local rather than in a field, so there is nothing for a reader to resolve against, and `#open` means a recipe may stage into this pair, which a commit that has already applied effects derived from a comparison of two pairs cannot honour. Reusing that field would give one accessor two incompatible meanings depending on which member set it, which is the invisible-context shape ADR-064 cut two verbs for.

Read after the recipe check and never before it. A recipe opened from inside a hook stages into its own pair as usual and is refused once, when it tries to apply, which keeps one owner of this refusal rather than a second copy in `edit`. Both phases refuse, and the message names neither: a settle-phase re-entry would stage from the adopted pair and lose nothing, and it is refused because the settle steps still queued were derived against the pair it would replace, in the one phase with no revert list. See ADR-068 and `RA-118` through `RA-122`.

It is not the only rung that reads that field, and the pair is a floor rather than a duplication. This member is the one place every structural verb reaches and `#refuseReentrant` is the one place every immediate verb reaches, and no member sits on both paths, so there is no single rung all fifteen pass through. Two rungs, two verb families, one condition, and one refusal function: `commitInFlight` is the third member a reader would be tempted to add, and it already exists. See ADR-070.

## #boundary

Runs one body inside the window during which a release is owed rather than taken, and the one owner of the depth, the decrement and the drain.

Every seam this class calls is caller code, so every one of them may call `dispose()`. Releasing from inside that call hands whatever is still unwinding -- a rollback list, an escalation, a staged Track waiting to be committed -- a disposed graph and a released composition. So the release is deferred to the outermost boundary and taken exactly once, there.

One member rather than the same three statements at five call sites. The drain is an ordering, and an ordering enforced at n call sites is enforced at the first of them; four more copies of `#apply`'s `finally` is the shape issue #298 deleted seventeen of. `#apply` wraps its whole body in it, and so do all four direct writes, at the outermost of the two so nothing double-raises: `#setKeyframe` reaches either `#writeValues` or `#recompileKeyframes` and never both, no direct write calls another, and none of them reaches `#commit`.

Sharing one counter with the commit boundary widens `schema-commit-reentrant`, and that widening is owned rather than discovered. A structural verb called from inside a `writeValues`, `stageTrack`, `replaceMotionTrigger` or `setMotionStagger` seam is refused now, where it used to apply, and it is ADR-068's lost update one indirection out: `#writeValues` resolves its entry from the retained pair, calls the seam, and writes that entry back, so a commit made from inside the seam has its change to that node overwritten by the `set` that follows. `RA-125` pins it. A second depth field so the two conditions stayed separate was refused: two pieces of state for one condition, and two owners of when a release may happen. See ADR-069.

It widens the refusal a second time now, in the other direction, and that widening is `#refuseReentrant`'s rather than this member's. A publishing verb called from inside any of these five windows reads the same `schema-commit-reentrant`, so the depth this member raises for a direct write is what makes a `seek` from inside a `writeValues` seam refuse as well as one from inside a commit hook. One counter, one condition, two rungs that read it -- `#commit` and `#refuseReentrant` -- and one refusal function they both hand out. See ADR-070.

## #apply

Applies one accepted pair: derive, apply the effects, ask the graph, settle, and flush once.

The one owner of an ordering three records make load-bearing: ADR-031 for the compiled map, ADR-035 for rollback precedence, ADR-045 for republish-before-restore. `replaceGraph` and `rejectAfterRollback` have one call site each, and so does every hook.

The derivation runs before the try, so a candidate refused inside it costs no teardown at all. The effects are applied inside it, so a hook that throws is rolled back exactly as a refused candidate is, and each is recorded only after its `apply` returned.

One flush ends it, seeded with `touched`, and it runs after the settle steps rather than before them, because a new node is mounted by one of those steps. `replaceGraph` seeds nothing itself, which is why `addObserve` on a manual clock with no tick used to be invisible forever. `RA-8`.

An empty `touched` returns without calling `invalidate`, for the reason ADR-064's amendment records. See `RA-10`.

One call site of its own now, `#commit`, so this member has what `replaceGraph`, `rejectAfterRollback` and every hook already had. It never starts against a runtime its caller disposed, and the re-ask that guarantees that belongs to `edit` rather than here. A guard on entry could fire for no caller at all: `addMotion` and `#addTrack` ask `#assertLive` themselves, `#removeTrack`, `#removeMotion` and `#replaceTrack` are reached through resolvers that ask it before they resolve, and `edit` re-asks after its recipe returned. See ADR-064's amendment of 2026-09-04 and `RA-109`.

And it is the owner of the commit boundary, which is what makes a runtime one of its own hooks disposed survivable rather than merely named. Every hook it reaches is caller code, so the liveness whichever entry point got here asserted is stale from the first one onward, and this member re-asks rather than trusting it. `#assertLive` is asked in three places and the count is the design. After `#derive`, because `#needsTimelineBuild` asks a seam and nothing has been applied yet, so that refusal costs no rollback. After every `effect.apply()`, which is issue #288's rule one indirection out, landing in the existing `catch` so the existing rollback list and precedence do the work unchanged. And before the flush, where it skips rather than refuses.

The settle loop is deliberately unguarded, and that asymmetry is the decision rather than an omission. A settle step has no `revert` because it is not allowed to fail, so abandoning the phase halfway would leave a staged Track neither committed nor rolled back and a Motion registered against a node that never mounted. The teardown is deferred past the whole phase instead, so `#mountNode`, `evictNode` and both Motion hooks still reach a live graph, and the release that follows cleans up what they produced. The flush is the one thing skipped, on the same reason an empty seed set is: a batch nobody can read still moves the sequence and drains a deferred flush's seeds.

The `finally` drains the release, once, at depth zero. That is why `dispose()` may be called from inside any hook here without the rollback being handed a graph and a composition that no longer exist, and it is what makes `Error: GraphRuntime is disposed.` unreachable through a commit. See ADR-067, `RA-114`, `RA-115` and `RA-117`.

The depth is no longer this member's to own. `#boundary` holds the raise, the decrement and the drain, and this member wraps its whole body in one call, which keeps the raise ahead of `#derive` and costs one closure per commit. The pair it holds in a local still cannot be adopted over by a second commit running inside it, because `#commit` refuses that re-entry. What used to be reachable was a direct write inside one of these hooks, raising the depth to two; the rung refuses it now, so the depth is one again and this member did not change to make that true. One consequence to know rather than discover: the two early returns in the flush phase return from the closure rather than from this member, which is identical in effect while this member answers `void`. See ADR-068 and ADR-069.

## #derive

What one accepted pair costs, read against the retained pair.

A hook list assembled by the entry point is correct for one change and cannot compose two, which is the correction ADR-064 records and `RA-65` is the first case to tell apart.

Four categories, each of them the hook set its own entry point used to name, unchanged: a created Motion built before the graph is asked and destroyed if it refuses (ADR-032), a removed track settling its eviction, dispose and deregistration as one step, a destroyed Motion settling after that with nothing to revert, and an added or replaced track compiling before the graph is asked and registering with its Motion after it accepted (ADR-031), with the staging build skipped when the compiled input provably did not move (ADR-062).

Motions are created before any track compiles, because one commit may add a Motion and a track to it. Effects are reverted in apply order, so a replacement's staging rollback still runs before its Motion entry is restored. See ADR-045 and ADR-064.

## #adoptMaps

Adopts the accepted pair, which is a pointer move rather than a rewrite.

A named member rather than two lines inside `#apply`, because the ownership change is the thing worth stating where the assignment is: the retained fields are not `readonly` and a plan builder may not keep what it handed over. What the rewrite this replaced cost, and which hazard the read-out existed for, are ADR-064's third amendment. See `RA-92` and `RA-97`.

It is also the line a mid-commit disposal is never allowed to reach when the effect phase aborted, which is where `RA-114` measures that the pair was never partially adopted. See ADR-067.

## #writeValues

The one live-value write path.

`rebase` is the only difference between the two entry points, which is ADR-060's decision: an override leaves the retained definition alone and a `setValues` rewrites it, and at the compiled Track it is one boolean. Everything else is shared, so the two cannot answer differently, invalidate twice, or record in two places, and the same boolean names the verb in the recipe refusal.

Tier 2, and refused inside a recipe for the reason tier 0 is: it ends at its own `invalidate`, so it would survive an abort. See `RA-68` and ADR-064.

Order, and it is load-bearing. Validate the rewritten definition when an animated key is named, then write through the one hook, which is where every key is classified and refused, then rewrite the retained entry and its overlay, escalate if the hook declined, and end at one `invalidate`. Nothing can observe the gap, because no flush happens until that invalidate.

Not a `#commit` caller, and it must not become one: topology did not change, so there is no candidate graph to accept and nothing to roll back. A static-only write validates nothing and builds nothing. No `replaceGraph` on either path. See ADR-059 and ADR-060.

It is not a `#commit` caller and it is a boundary anyway, which is ADR-069's whole decision. The hook it writes through is caller code, so a disposal asked for from inside one used to leave the retained entry written back into a map the teardown had already cleared, with the graph layer reporting its own refusal to the caller afterwards. The body runs inside `#boundary` now, so the release is owed rather than taken, the phase completes against a live host, and the flush at the end is `#invalidateOne`'s rather than an inline copy of it -- which is what makes the skip and the report one statement owned in one place. The refusal stays outside the boundary, because a refused call is not inside a callback and has nothing to survive. See ADR-069.

## #boundGroup

The bound-group precondition every authored edit shares, and the one owner of it.

A plugin this node authors no group for is `keyframe-group-unbound`, which is `setKeyframeGroup`'s job in the structural tier and is what buys the cheap price in the value tier, for ADR-065's reason. A name this node authors as an ordinary property is not a group either, and that is `readBoundGroup`'s answer rather than a second shape check here.

It answers with the record beside the group, so no caller re-reads `entry.track.keyframes`. See ADR-062, ADR-063 and ADR-065.

## #invalidateOne

The value tier's one flush, and the one place a direct write reports a disposal.

The assert ahead of the call is the skip and the report in one statement: a disposed runtime never reaches `invalidate`, so nothing publishes -- a batch nobody can read still opens, notifies every subscriber, moves the sequence and drains whatever a deferred flush was holding -- and the caller is told by the owner that decided rather than by the graph that noticed. That a batch is never cheap is also why nothing may publish in front of a commit's own flush, which is `## #refuseReentrant`'s second condition read one tier down: this member is reached only through a verb that rung has already answered for. The write that got here has already completed its phase, on purpose. Both track paths end here rather than one of them ending at an inline copy, which is why the report has one owner. `LV-5` measures that as an absence at the caller and a presence here. See ADR-064's amendment of 2026-09-03 and ADR-069.

## #recompileKeyframes

Recompiles one edited authored record in place, preserving this node's playhead.

Validation and the registry resolve both run before the live Track is touched, and the staged replacement is re-seeked to the progress the displaced one owned, which is ADR-065's. No graph operation is involved because a leaf carries no edge. See ADR-065.

Two seams run before the retained entry moves, which made this the sharpest of the four direct writes: it both writes the map after caller code and builds a compiled Track after it. The whole body is inside `#boundary`, including the `#resolve` call, because `resolveKeyframes` is caller code too and can dispose from there -- ADR-067's own reason for raising ahead of `#derive`, read one tier down. So the stage, its commit and the re-seek all reach a live composition, and the release that follows cleans up what they produced instead of arriving between them. See ADR-069.

## #setKeyframe

Edits one property of a plugin group this node already authors.

Two paths, chosen by whether the group already authors the key, which is ADR-065's: an existing leaf goes through the live-write owner, and a new or removed one cannot be expressed as a mask, so the authored candidate is validated, resolved and recompiled in place instead. The bound-group precondition keeps both in the value tier. See ADR-065.

## #editRequire

One binding edit on an already-bound plugin, and the one owner of the order all four binding verbs follow.

The runtime's liveness first and this handle's staleness with it, through the resolver every writing member goes through. Then the unbound-group refusal, answered from the retained record on this node. Then the edit, where the one reservation this surface has is checked and the pure editor runs. Then the redundant edit, by identity, because the pure layer returns the record it was given when nothing changed. Then the commit. Why the reservation sits inside the edit rather than ahead of it is ADR-063's.

`#replaceTrack` rather than a plan of its own, for the reason `#replaceWithObservation` already routes there: a binding edit is a candidate the graph accepts or refuses, which is exactly the transaction `#commit` owns. So the price is one candidate build, one edge delta and one flush, and there is no fast lane missing, which is ADR-062's amendment. Inside a recipe it is structural, so it travels with the transaction. See ADR-045, ADR-062 and ADR-063.

## #setGoal

Binds one entry of a solver's goals slot, addressed by the member id it is authored under.

The same tier, the same owner of order and the same pure editor as `setRequire`, with the slot fixed rather than named, which is the whole of what the verb buys and is ADR-063's. No editor of its own, because a dict entry is a dict entry and `setRequire` already owns what one is.

Whether the member id names a leaf of this solver's chain is `resolveSolvers`' question, asked of the candidate graph rather than here, because a per-primitive copy is a second owner that can disagree with the loader. See ADR-057 and ADR-063.

## #editGroup

One whole-group edit, and the one owner of the order both group verbs follow.

The runtime's liveness first and this handle's staleness with it, through the resolver every writing member goes through. Then the property-entry refusal, which is the only thing about a group edit no other layer can see, because a plugin name and a keyframe name share one namespace. Then the pure edit, which knows the group layout and refuses `keyframe-group-shape` rather than committing a husk. Then the redundant edit, by identity. Then the commit. Both refusals are ADR-063's.

An absent record reads as one frozen empty one, which lets `setKeyframeGroup` originate on a track that authors nothing with no branch here. No registry question is asked and none is missing: they all arrive at the resolve this commit pays. See ADR-062 and ADR-063.

## #writeKeyframes

Writes an edited authored record back onto `track` and commits it as a replacement.

The one owner of what an authored edit leaves behind, so the six verbs in this tier cannot disagree about it: a record that ends up holding nothing loses the key rather than being committed as an empty object, which is ADR-063's one rule at four levels. An edit may not leave behind a shape that is legal only because nothing refuses it. See ADR-063.

## #snapshot

The committed pair as one authored document, walked once.

One walk, bucketed by the owner each entry already names, with the free tracks falling out of the same pass. A bucket fills in map order, so each motion's list is the list a per-motion filter produced, and a motion that owns nothing answers with an empty list rather than with no key. What asking `#ownedBy` per motion used to cost, and why this is not a second derivation of the fact that member owns, are both ADR-064's third amendment. See `RA-89` and `RA-91`.

Every untouched entry's definition is handed through by identity, for ADR-058's reason. See `RA-90` and ADR-058.

## #teardown

Releases everything this runtime holds, exactly once, and the half of `dispose()` that is allowed to be late.

A refusal and a release are two questions, and only the first may be answered inside a callback this class is still inside. `dispose()` owns the decision and sets the flag, so every member refuses and every handle answers stale from that line onward; this owns the release, and `#apply` may hold it back until the commit it is running has finished unwinding. Nothing about what it does changed when it was split out: the body is `dispose()`'s previous body, moved rather than rewritten.

Why it may not run where `dispose()` was called is the whole of ADR-067, and it is one measurement rather than a preference. Every `SchemaEffect.revert` reaches the composition, because they are the inverses of `compileTrack`, `createMotion` and `stageTrack`, so a release that ran inside a hook would leave the rollback handing a torn-down host the inverse of effects it can no longer apply, and every effect after the disposing one building against a host that will never be asked to release it again. The choice that forces is between double-freeing what the applied effects built and leaking it, and neither is a contract.

Exactly once, by construction rather than by two guards agreeing: `dispose()` returns early on its own flag, and this clears `#pendingTeardown` before it does anything, so neither path can reach it twice. `disposeComposition` is therefore called once, after the unwind rather than in the middle of it, which is what `RA-114` and `RA-117` both count.

It still detaches before it disposes the graph, and it still empties both retained maps, which is what `edit` cites when it drops a staged pair rather than committing it. That claim is now true of every path rather than of commits alone: the four direct writes outside `#commit` used to be able to write an entry back after this ran, and they run inside `#boundary` now, so this member is the last thing that touches either map on every path a seam can dispose from. See ADR-067 and ADR-069.
