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

## SchemaPlan

One structural transaction, as data, and now only the pair the graph is asked to accept.

`tracks` and `motions` are what the graph is asked to accept and, once it has, what the retained maps become, adopted from the same pair that built the snapshot so the committed graph and the maps cannot drift. Why an untouched entry is handed through by identity is ADR-058's, and `RA-7` compares them that way.

Each half is optional: a half this commit did not move is absent rather than handed back, and what pointer adoption buys and costs is ADR-064's third amendment. `#stageTracks` and `#stageMotions` are the only two things that make one, and therefore the only two allowed to fill this. `RA-92`.

What a plan no longer carries is a hook list: a commit's hooks are derived from what it commits, by `#derive`, and every entry point is a map builder that names no hook at all. Why a hook list assembled per op cannot compose two is ADR-064's, and `RA-65` is the first case that can tell the two apart. See ADR-064.

## SchemaCommit

What one accepted pair costs, and the only declaration in this file that names a hook.

`effects` are applied before the graph sees the candidate and reverted in **apply order** when it refuses, which is ADR-045's republish-before-restore rule rather than an incidental ordering. `settle` runs only after acceptance. See ADR-031 and ADR-045.

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

## #readTracks

The retained tracks, or the pending ones while a recipe is open.

Every structural read in this class goes through this rather than reaching `#tracks` directly, which is the one accessor ADR-064 puts in front of the pair. The two in-place tiers keep reading the retained maps and refuse by name inside a recipe instead. See ADR-064.

## #readMotions

The same question about the other map, and the same reason.

## #stageTracks

The track map this commit will hand over, mutable, and copied once rather than once per op.

Outside a recipe it is a copy of the retained map. Inside one it is the pair the recipe is staging, made once by the first op that stages anything and written into in place by every op after that, so n ops cost one copy. Why the copy outside a recipe is the floor rather than an expense to remove is ADR-064's third amendment.

Called after an entry point's last refusal and never before it, because a half that is still the retained map by identity is the whole answer to whether the recipe staged anything. That ordering rule is the same amendment's. See `RA-93` and `RA-95`.

## #stageMotions

The same question about the other map, and the same reason.

## #mountNode

Attaches one member, and the one owner of mounting.

Split from the public verb because a commit mounts too, for the reason ADR-064's amendment records. The public member owns the contract, this owns the attach. See `RA-80`.

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

## #entryIfLive

The probe every `live` getter reads, so `TrackHandle.live` and every throwing member answer the same question about the same handle.

One comparison with two readers rather than a copy per member, which is ADR-056's. Asked of the pending pair while a recipe is open, so a handle issued inside one is live for the rest of it and never live after an abort. See ADR-056 and ADR-064.

## #liveEntry

The resolver every handle member and every private mutation path goes through, so the contract is uniform by construction rather than by four call sites agreeing. See ADR-056.

## #liveId

This handle's motion id, once the handle is known to be live. Reading the id and refusing a stale handle are the same call, so there is no order for a member to get wrong.

## #motionDefinition

The Motion definition as it currently stands, tracks included, projected through `#ownedBy` rather than answered from the entry, for the reason ADR-061 records. See ADR-061.

## #removeMotion

Destroys a Motion that owns no tracks, from the id or from a live handle.

The refusal counts through `#ownedBy`, so it names the list `MotionHandle.trackIds` shows, and inside a recipe it counts what that recipe staged: a Motion whose last track the same recipe removed is destroyable in it.

## #refuseInsideRecipe

Refuses `verb` while a recipe is open, named at the verb rather than at the tier so the message tells a caller which call to move out. See ADR-064.

## #setTrigger

Installs a Motion's trigger, and reaches no node and no edge doing it.

Tier 0, which is a claim about the mechanism rather than about the cost: `trigger` appears in no `GraphNode`, so `#commit` is the wrong path rather than an expensive one, and `RA-33` measures that as a `replaceGraph` call count. It is refused inside a recipe because an edit that reaches the driver layer immediately cannot be undone by one that throws. See `RA-68`.

The order is the whole contract, and ADR-061's amendment owns why: the recipe refusal, then staleness, then `validateMotionTrigger`, which is the owner `addMotion` already asks, then the redundant edit, then the seam, whose failure is reported verbatim, and the retained definition last, once nothing that can refuse is left. See ADR-035 and ADR-061.

## #setStagger

Moves a Motion's stagger, which no driver reads.

The same tier and the same order as the trigger above, with one difference: there is no contract rule to ask, because the seam is where that refusal already lives and a copy here would be a second owner of it. The seam is therefore asked before the retained definition moves, which is what keeps a refused edit from being recorded as one.

An unchanged value asks the seam nothing, and a cleared one leaves no key behind. See ADR-061.

## #motionHandle

Every member resolves the entry before it reads an argument, which makes staleness the first answer rather than a second one. `tryTrack` refuses here as well, for the reason ADR-061 records: whether this handle is the live one at all is a different question from an id it cannot find.

## #removeTrack

Drops one node from the pair, and names no hook. The eviction, the dispose and the Motion deregistration are one settle step `#derive` owns, derived from the id being absent from the committed pair. See ADR-064.

## #resolve

The registry's answer about one authored record, or nothing when no registry was injected.

The diagnostics path is spelled exactly as `compileTrack` spells it, because the seam's second parameter is a path rather than a node id. See ADR-062.

## #needsTimelineBuild

Whether a replacement has to build a new timeline, and the one place a candidate is resolved.

The resolve is validation and is never skipped, and only the timeline build is skippable, which is ADR-062's amendment: a predicate that skipped the resolve would delete a validator rather than a cost. So the candidate is resolved here, refused here, and only then read as data. The retained record is resolved beside it rather than kept anywhere, on the same record's reason.

Asked from `#derive` rather than from `#replaceTrack`, which moves it from once per op to once per committed replacement and leaves it exactly where it was for every caller outside a recipe. What the answer is compared with is `sameCompiledTrackInput`'s question rather than this one's. See ADR-062 and ADR-064.

## #replaceTrack

Replaces one node's definition in the pair, preserving its node id and its token.

A map builder: the staging, the Motion republish and their reverts are `#derive`'s answer, derived from the retained definition and the committed one. See `RA-65` and ADR-064.

## #commit

The one path by which a structural change reaches the graph, or the open transaction.

While a recipe is open there is nothing to do here: every entry point already wrote into the open pair. With none open the pair is applied immediately, and `edit` arrives here too, after its `finally` cleared the transaction and after the liveness re-ask that member owns. The sentence above was aspirational while `edit` called `#apply` directly, because there were two paths: the decision to apply now has one place, and therefore the liveness answer has exactly one reader. The guard is statically known at that call site rather than inapplicable to it, and it answers `none open, apply` for the right reason. See ADR-064 and its amendment of 2026-09-04.

## #apply

Applies one accepted pair: derive, apply the effects, ask the graph, settle, and flush once.

The one owner of an ordering three records make load-bearing: ADR-031 for the compiled map, ADR-035 for rollback precedence, ADR-045 for republish-before-restore. `replaceGraph` and `rejectAfterRollback` have one call site each, and so does every hook.

The derivation runs before the try, so a candidate refused inside it costs no teardown at all. The effects are applied inside it, so a hook that throws is rolled back exactly as a refused candidate is, and each is recorded only after its `apply` returned.

One flush ends it, seeded with `touched`, and it runs after the settle steps rather than before them, because a new node is mounted by one of those steps. `replaceGraph` seeds nothing itself, which is why `addObserve` on a manual clock with no tick used to be invisible forever. `RA-8`.

An empty `touched` returns without calling `invalidate`, for the reason ADR-064's amendment records. See `RA-10`.

One call site of its own now, `#commit`, so this member has what `replaceGraph`, `rejectAfterRollback` and every hook already had. It never starts against a runtime its caller disposed, and the re-ask that guarantees that belongs to `edit` rather than here: a guard here could only ever fire for the one caller that can reach it while disposed, placed where all six pass, and it could not answer, which is the whole point. A hook applied inside the try is caller code too and could still dispose mid-commit, which is named and out of scope rather than covered. See ADR-064's amendment of 2026-09-04 and `RA-109`.

## #derive

What one accepted pair costs, read against the retained pair.

A hook list assembled by the entry point is correct for one change and cannot compose two, which is the correction ADR-064 records and `RA-65` is the first case to tell apart.

Four categories, each of them the hook set its own entry point used to name, unchanged: a created Motion built before the graph is asked and destroyed if it refuses (ADR-032), a removed track settling its eviction, dispose and deregistration as one step, a destroyed Motion settling after that with nothing to revert, and an added or replaced track compiling before the graph is asked and registering with its Motion after it accepted (ADR-031), with the staging build skipped when the compiled input provably did not move (ADR-062).

Motions are created before any track compiles, because one commit may add a Motion and a track to it. Effects are reverted in apply order, so a replacement's staging rollback still runs before its Motion entry is restored. See ADR-045 and ADR-064.

## #adoptMaps

Adopts the accepted pair, which is a pointer move rather than a rewrite.

A named member rather than two lines inside `#apply`, because the ownership change is the thing worth stating where the assignment is: the retained fields are not `readonly` and a plan builder may not keep what it handed over. What the rewrite this replaced cost, and which hazard the read-out existed for, are ADR-064's third amendment. See `RA-92` and `RA-97`.

## #writeValues

The one live-value write path.

`rebase` is the only difference between the two entry points, which is ADR-060's decision: an override leaves the retained definition alone and a `setValues` rewrites it, and at the compiled Track it is one boolean. Everything else is shared, so the two cannot answer differently, invalidate twice, or record in two places, and the same boolean names the verb in the recipe refusal.

Tier 2, and refused inside a recipe for the reason tier 0 is: it ends at its own `invalidate`, so it would survive an abort. See `RA-68` and ADR-064.

Order, and it is load-bearing. Validate the rewritten definition when an animated key is named, then write through the one hook, which is where every key is classified and refused, then rewrite the retained entry and its overlay, escalate if the hook declined, and end at one `invalidate`. Nothing can observe the gap, because no flush happens until that invalidate.

Not a `#commit` caller, and it must not become one: topology did not change, so there is no candidate graph to accept and nothing to roll back. A static-only write validates nothing and builds nothing. No `replaceGraph` on either path. See ADR-059 and ADR-060.

## #boundGroup

The bound-group precondition every authored edit shares, and the one owner of it.

A plugin this node authors no group for is `keyframe-group-unbound`, which is `setKeyframeGroup`'s job in the structural tier and is what buys the cheap price in the value tier, for ADR-065's reason. A name this node authors as an ordinary property is not a group either, and that is `readBoundGroup`'s answer rather than a second shape check here.

It answers with the record beside the group, so no caller re-reads `entry.track.keyframes`. See ADR-062, ADR-063 and ADR-065.

## #invalidateOne

One value-tier flush, shared by authored-property recompiles and no-ops.

## #recompileKeyframes

Recompiles one edited authored record in place, preserving this node's playhead.

Validation and the registry resolve both run before the live Track is touched, and the staged replacement is re-seeked to the progress the displaced one owned, which is ADR-065's. No graph operation is involved because a leaf carries no edge. See ADR-065.

## #setKeyframe

Edits one property of a plugin group this node already authors.

Two paths, chosen by whether the group already authors the key, which is ADR-065's: an existing leaf goes through the live-write owner, and a new or removed one cannot be expressed as a mask, so the authored candidate is validated, resolved and recompiled in place instead. The bound-group precondition keeps both in the value tier. See ADR-065.

## #editRequire

One binding edit on an already-bound plugin, and the one owner of the order all four binding verbs follow.

Staleness first, through the resolver every member of the handle reads. Then the unbound-group refusal, answered from the retained record on this node. Then the edit, where the one reservation this surface has is checked and the pure editor runs. Then the redundant edit, by identity, because the pure layer returns the record it was given when nothing changed. Then the commit. Why the reservation sits inside the edit rather than ahead of it is ADR-063's.

`#replaceTrack` rather than a plan of its own, for the reason `#replaceWithObservation` already routes there: a binding edit is a candidate the graph accepts or refuses, which is exactly the transaction `#commit` owns. So the price is one candidate build, one edge delta and one flush, and there is no fast lane missing, which is ADR-062's amendment. Inside a recipe it is structural, so it travels with the transaction. See ADR-045, ADR-062 and ADR-063.

## #setGoal

Binds one entry of a solver's goals slot, addressed by the member id it is authored under.

The same tier, the same owner of order and the same pure editor as `setRequire`, with the slot fixed rather than named, which is the whole of what the verb buys and is ADR-063's. No editor of its own, because a dict entry is a dict entry and `setRequire` already owns what one is.

Whether the member id names a leaf of this solver's chain is `resolveSolvers`' question, asked of the candidate graph rather than here, because a per-primitive copy is a second owner that can disagree with the loader. See ADR-057 and ADR-063.

## #editGroup

One whole-group edit, and the one owner of the order both group verbs follow.

Staleness first, through the resolver every member of the handle reads. Then the property-entry refusal, which is the only thing about a group edit no other layer can see, because a plugin name and a keyframe name share one namespace. Then the pure edit, which knows the group layout and refuses `keyframe-group-shape` rather than committing a husk. Then the redundant edit, by identity. Then the commit. Both refusals are ADR-063's.

An absent record reads as one frozen empty one, which lets `setKeyframeGroup` originate on a track that authors nothing with no branch here. No registry question is asked and none is missing: they all arrive at the resolve this commit pays. See ADR-062 and ADR-063.

## #writeKeyframes

Writes an edited authored record back onto `track` and commits it as a replacement.

The one owner of what an authored edit leaves behind, so the six verbs in this tier cannot disagree about it: a record that ends up holding nothing loses the key rather than being committed as an empty object, which is ADR-063's one rule at four levels. An edit may not leave behind a shape that is legal only because nothing refuses it. See ADR-063.

## #snapshot

The committed pair as one authored document, walked once.

One walk, bucketed by the owner each entry already names, with the free tracks falling out of the same pass. A bucket fills in map order, so each motion's list is the list a per-motion filter produced, and a motion that owns nothing answers with an empty list rather than with no key. What asking `#ownedBy` per motion used to cost, and why this is not a second derivation of the fact that member owns, are both ADR-064's third amendment. See `RA-89` and `RA-91`.

Every untouched entry's definition is handed through by identity, for ADR-058's reason. See `RA-90` and ADR-058.
