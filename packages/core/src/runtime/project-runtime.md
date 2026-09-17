# packages/core/src/runtime/project-runtime.ts

Private ownership and ordering for ProjectRuntime. Exported API documentation remains in the source; a comment explaining the statement beside it remains too, and a comment that cites a decision, an evidence id or an issue number belongs here rather than there. Each level-two heading names a source declaration, in declaration order. Undocumented members carry no additional rule. This is a complete, condensed replacement of the previous mirror, not an appended history. The read-budget contract belongs to docs/AI-EDIT-WORKFLOW.md and its scanner.

## TrackEntry

The retained track, optional motion owner, lifetime token, animated overlay, and conservative live-write marker, recorded from the write being asked for rather than from what the backend answered, so nothing can under-report. The overlay records the last animated live write; it is not authored state. A live write can survive a refused escalation because the writer has no inverse. Only a successful fresh compilation removes its effect, so structural derivation must build when retained.liveWrite is true even if compiled inputs compare equal. Candidate validation is never short-circuited by that marker. See ADR-060, ADR-062 and ADR-066.

## MotionEntry

A retained definition and a lifetime token, allocated by the same counter as tracks. Definition.tracks is not authoritative after runtime additions: #ownedBy projects current children for handles and destruction checks. A new token under the same id is a new entity, not a replacement of the same one. See ADR-056, ADR-061 and issue #342.

## SchemaEffect

A side effect required before the candidate graph can be accepted. Its optional revert is recorded only after apply returns successfully. A throwing supplier owns cleanup for any work performed before its return. Reverts run in apply order, so a displaced compiled Track is restored before Motion resolves it. A removal has no pre-acceptance effect. Teardown cannot release composition while these inverses remain owed. See ADR-031, ADR-035, ADR-045 and ADR-067.

## SchemaPlan

Only the candidate track/motion maps, with an untouched half omitted. Entry points build maps, never hook lists. The same pair constructs the graph snapshot and becomes the retained pair, preventing divergence. Untouched entries retain identity for incremental caches. Only #stageTracks and #stageMotions produce writable maps; adoption is a pointer move, not a per-entry copy. See ADR-058 and ADR-064.

## SchemaCommit

The derived effects, post-acceptance settlement steps, and publication seeds. Effects have inverses; settlement does not. Settlement failure cannot justify rollback of an accepted graph or compiled resource. All independent settlement steps and then publication are attempted, with one report. A lone thrown value retains identity, including undefined and host aggregates; multiple failures retain occurrence order without flattening. Granularity is deliberate: grouping several fallible releases in one callback would let the first skip the rest. See ADR-071.

Seeds name changed nodes and the readers of removed nodes. The publisher walks dependants, so replacements need only their own node. Motion-only changes derive no graph node. An empty seed list causes no invalidate at all, because even an empty batch costs publication machinery and advances sequence. See ADR-051 and ADR-064.

## OpenTransaction

The pending pair while one recipe executes, carried by the phase's editing variants rather than by a field beside them. Both halves start by identity as the retained pair and are copied on their first staged write, after the entry point's last refusal. There is no operation log or dirty flag. A recipe that throws adopts nothing, and handles it created become stale. Reads within it see the pending pair. See ADR-064.

## #tracks

The retained pair; #motions follows the same rule. Maps are mutable fields because an accepted transaction replaces each map object. Structural reads use #readTracks/#readMotions; immediate edits write retained entries only outside an open recipe and inside their own boundary. A builder must not keep a map after handing it over. See ADR-064 and ADR-069.

## #phase

The whole lifecycle as one value, over three axes: which scope is open, how deep the commit is, and whether teardown has begun. It replaces #open, #valueSeeds, #disposed, #inFlight and #pendingTeardown, so a runtime that is idle and owes a teardown, or that holds a staged document with no recipe open, is unrepresentable rather than kept unreached by guards spread across this class. project-phase.ts owns what a legal phase is and mints every one of them; this field holds the current one and nothing else, and every read of it here goes through that module rather than through a comparison spelled again. See ADR-064, ADR-067, ADR-083 and ADR-092.

The open scope carries what belongs to it, so nothing is nullable and no reader asks twice. A recipe's pending pair rides the editing variants, and edit closes it in finally before committing and before propagating an exception; during a commit no recipe is open, which is why a reentrant commit is refused by the depth and never by the scope. A value batch's seeds ride the batching variants as an ordered list, because their order and their repeats reach GraphRuntime.flush exactly as they were pushed and a set would silently dedupe; values reads them once and closes the batch in finally, so a recipe that threw leaves no batch open and the next call is an ordinary one rather than a reentrancy refusal against a batch nothing closed. A recipe opened inside a batch is still admitted and still refused at its own commit as value-batch-structural, which is a state the two scopes co-occupy on the ordinary path rather than an edge case. See ADR-064 and ADR-078.

The depth is a count rather than a boolean, kept for the reason the counter was kept: today's guards bound it to one, that bound has moved as new callback paths arrived, and a boolean would release resources early the day nesting became reachable. #boundary is its one owner, and it is floored at zero so an unpaired boundary cannot admit everything it should refuse. Retirement is monotone and the terminal variant carries nothing, so dispose marks the runtime refused on the line it was called on, the outermost boundary drains the release once teardownOwed answers true, and the clears #teardown used to write by hand are what a terminal phase already says. Whether that release was deferred is not a field either: only dispose and that boundary can ask, and they tell by which one of them is asking. See ADR-067 through ADR-070 and issue #312.

## #readTracks

Answers the transaction's pending tracks when a recipe is open, otherwise the retained tracks, as a read-only map. Every structural reader uses this accessor. Immediate edits refuse inside recipes and deliberately operate on retained entries. See ADR-064.

## #readMotions

The same read rule for motions.

## #stageTracks

Creates a copy outside recipes. Inside a recipe it copies on the first write only, then returns the pending mutable map. Called after all entry refusals, so a refused/no-op operation cannot manufacture a changed-map identity and an unnecessary commit. A commit's own local pair cannot accept another staged write; #commit refuses that reentry. See ADR-064 and ADR-068.

## #stageMotions

The same copy-on-first-write rule for motions.

## #mountNode

The single actual mount operation: graph attachment plus native instance registration. Public mount applies its guards and delegates; accepted settlement calls this private member directly. Calling the guarded public verb would reject the owning commit's own work. Disposal remains deferred through settlement, so a later mount still reaches a live graph even when an earlier hook requested disposal. See ADR-064, ADR-067 and ADR-070.

Mount itself seeds no publication. Loaded projects publish on their first real operation/tick, not on mount. An eager seed was measured and rejected because deduplication consumes the next seek's publication rather than adding an independent one, so the following seek would publish nothing and hand its caller an empty batch. T-1 owns the asymmetry between a commit-mounted node and a caller-mounted one as real rather than pending, and trigger-time owns that a time Motion does not emit before its first tick while a mount precedes every tick. Run 33712936651 is the 21 cases that refused the seed, RA-8 among them. See ADR-066, RA-100 and RA-101.

## #transaction

A frozen projection of existing runtime verbs, not another implementation. addMotion resolves the ordinary handle after staging the addition. Narrowing is not a security or mutation fence: recipes can close over the project handle, so immediate verbs enforce their own refusal regardless of how reached. See ADR-064.

## #readersOf

Reads GraphIR.dependants and returns a deduplicated, frozen list in first-occurrence order. Never rederive readers from edges: solver membership is a dependency without the corresponding observation edge. Both dependantsOf and removal publication use this one reader. See ADR-051, RA-86, RA-87, RA-98 and RA-99.

## #ownedBy

Filters the explicitly supplied track map for one owner's children in committed map order. An undefined motion id asks for the tracks no Motion owns, which is the same partition read from the other side rather than a second filter, so freeTrackIds and MotionHandle.trackIds cannot disagree about which half a track is in or about the order it arrives in. Destruction counts, MotionHandle.trackIds and MotionHandle.definition use the same owner. A plan builder and a public read may need different maps, so the map is an argument rather than hidden state. The snapshot uses an equivalent single bucket pass to avoid repeated filtering. See ADR-061, ADR-064 and issue #362.

## #entryOf

Resolves an id this project must have, or refuses it as the unknown-node of `refusal.ts`, so the one sentence a missing id renders has one owner. Unlike #liveEntry it does not answer whether a previously issued handle still names the same lifetime.

## #liveOf

Runtime liveness and nothing else. A disposed runtime answers a stale resolution immediately, even while deferred teardown has not cleared maps, and the token comparison itself belongs to `resolveToken` in `results.ts`, which is why this member answers one `Resolved<E>` rather than an entry or its absence: a reader states which of the two it wants instead of restating the comparison. It still throws nothing, so live getters remain safe. Reads and writes apply their different failure precedence above this layer. See ADR-056, ADR-061 and ADR-067.

## #entryIfLive

The track resolution through #liveOf, read as a discriminant by `isLive` and as an entry by `expectLive`. A pending handle is live during its recipe and stale after abort because its token was never adopted. A motion has the analogous probe. See ADR-056 and ADR-064.

## #liveEntry

The throwing track-read resolver, which is `expectLive` over that resolution rather than a second comparison of its own. Absence or a changed token still produces StaleTrackHandleError, including on a disposed runtime, because the refusal names the target and the contract layer keeps the sentence. Writes use #writableEntry to ask runtime liveness first; adding that check here would change the read/probe contract. See ADR-056.

## #liveId

Resolves a live MotionHandle and returns its motion id. This makes the liveness ordering explicit before child qualification.

## #liveChildNode

Resolves the captured motion first, then qualifies the child name. A stale parent therefore outranks an invalid child name or a child the project never had. Both track and tryTrack on a MotionHandle use this rung, so qualification cannot drift between them. Reads retain the stale-error family, not the runtime-disposed error. See ADR-056, RA-112 and RA-113.

## #writableEntry

The track-write resolver: runtime liveness first, then captured-token liveness. A disposed project is reported as ProjectRuntime is disposed., not a stale handle suggesting the caller can re-resolve a usable project. Every writing member shares this rung rather than copying guards into each operation. See ADR-056 and issue #298.

## #writableMotion

The corresponding motion-write resolver, with the same ordering but the motion-specific stale error.

## #writableId

Returns the id through #writableMotion without adding another liveness check.

## #motionDefinition

Projects a frozen current definition, including children from #ownedBy rather than the entry's potentially empty load/add-time tracks array. See ADR-061.

## #removeMotion

Requires that the readable motion own no tracks, then removes it from a staged map. Within a recipe, removing its last child first makes destruction legal. No resource hook runs here; #derive owns the final candidate's work. See ADR-064.

## #admit

The one place a verb's admission is asked, and the one place this class reads its phase in order to refuse. It replaces the two-rung ladder every immediate and value verb climbed, #refuseImmediateReentrant and #refuseReentrant, together with the three conditions #commit spelled for itself. Which rule a verb wants is now a VerbClass it names, and admit in project-phase.ts owns the precedence between them, so a verb that asks for the wrong rule fails to compile instead of passing the wrong guard. The two-tier design is not what changed and issue #443 is explicit that it must not: what changed is that tier membership is a type rather than a comment, and that the precedence is one total function rather than an order convention held at every entry point. See ADR-064, ADR-070 and ADR-078.

Which liveness a verb wants travels with it, because both orders this class uses are load-bearing. mount, unmount, signal, values, invalidate and seek assert liveness before the reentrancy rule, so a retired project refuses them for the disposal. #setTrigger, #setStagger, #setKeyframe, #removeKeyframe and the writers a handle reaches ask the rule first and reach liveness only when #writableEntry or #writableMotion resolves the captured token, so a retired project mid-commit refuses them for the commit instead. Normalising either order would move a message this slice may not move, so asserted and resolved are stated per verb rather than inferred from the tier. See ADR-056 and issue #298.

A read asks READ and nothing else, because a read publishes nothing and mounts nothing and can therefore only be refused by disposal. A structural verb keeps #assertLive on entry instead, because its admission is the commit's and is asked at the one member all of them reach: #commit is also the only caller that can be answered join rather than allow, which is how a commit inside an open recipe waits for the recipe instead of applying beside it. The duplicate admission on the setKeyframe-to-writeValues path stays intentional for the reason the duplicate guard was: both public-capability entries need the rule, and two side-effect-free phase reads are cheaper and safer than an unchecked variant of the write mechanism. See ADR-064 and ADR-070.

The admission stays outside #boundary and before argument-dependent entry resolution, so an operation cannot refuse itself or falsely report an unknown node its owning commit is still adding. Owning work never goes through a guarded public verb at all: settlement mounts via #mountNode, structural and stagger publication use #flush, and value publication uses #invalidateOne or #publishValue. Ordinary Engine driver callbacks still reach public invalidate, and a global bypass or a lowered rule would admit actual caller reentrancy instead. #assertLive keeps the other question it has always answered, which is a precondition a callback may have invalidated: #apply re-asks it between effects, and #publishSeeds, #invalidateOne and #completeMotionEdit each ask it for an answer of their own. See ADR-067, ADR-079 and issue #341.

## #setTrigger

Tier 0: trigger configuration lives in no GraphNode, so no structural commit or graph replacement is involved. Order: reentrancy refusal, runtime/handle liveness, validation through validateMotionTrigger, redundant-edit check, installation seam, retained-definition adoption, completion. A seam throwing before return refuses installation and owns its cleanup. A returned finalizer belongs to an installed driver; failed displaced subscription/resource release cannot restore a stale definition. Engine owns those resources; this runtime owns adoption. Issue #340 corrects ADR-061's former assumption that every seam failure preceded acceptance.

The boundary remains raised through completion. A disposing hook makes the project immediately dead but defers resource release until completion ends. #completeMotionEdit reports liveness after cleanup without undoing accepted state. Standalone Motion.setTrigger still performs acceptance and completion synchronously. See ADR-061 and ADR-069.

## #setStagger

Motion alone validates and accepts the schedule. Its seam returns re-seeding work so the retained definition is adopted before injected Track code runs. Engine supplies a no-op invalidation callback only for this re-seed; the runtime subsequently publishes the owned tracks once through #flush. No graph replacement, driver recreation or blanket guard bypass. Unchanged values call no seam; clearing removes the authored key. Issue #341.

A re-seeding failure leaves the accepted schedule/definition in place and publication is still attempted from actual Track state, without inventing successful host recovery. Disposal is deferred, reported with the existing runtime-liveness error, and skips publication. See ADR-061 and ADR-069.

## #completeMotionEdit

Accepted tier 0 completion through the shared settlement collector: finalization/re-seeding, liveness reporting, then the owned publication attempt. Trigger edits have no seeds. Stagger edits name the owned tracks. All steps are attempted; one failure retains identity, several retain occurrence order. The boundary stays raised throughout, including subscriber callbacks. No public invalidate is used for the operation's own publication.

## #motionHandle

A frozen capability factory that owns no sequencing or validation. Reads use the live-motion ladder; child resolution uses #liveChildNode; writes use writable resolvers and their existing operations. Every getter resolves current readable state rather than capturing a definition. See ADR-056 and ADR-061.

## #removeTrack

Validates writability, removes the entry from the staged map, and delegates commit. Residency eviction, compiled disposal and Motion deregistration are independent ordered settlement steps derived from the final pair. There is no duplicate assertLive beside #writableEntry. See ADR-064 and ADR-071.

## #resolve

Forwards the candidate authored keyframes to the injected registry resolver, or answers absent when no registry exists. Diagnostic paths match compilation: nodeId.keyframes. This layer gains no registry ownership or cache. See ADR-062.

## #needsTimelineBuild

Always resolves and validates the candidate before deciding whether compilation is skippable. Compares complete compiled inputs through sameCompiledTrackInput, resolving the retained definition rather than caching registry-dependent data. The candidate resolve cannot be skipped even when liveWrite already forces a build: doing so would remove a validator. Asked once per final replacement, not once per recipe operation. This injected callback runs within the boundary and before effects. Spelling the condition with the retained marker first would short-circuit the resolve, which deletes a validator rather than a cost. See RA-103, RA-105, ADR-062, ADR-064 and ADR-066.

## #replaceTrack

Validates the complete replacement and requires the same qualified id. Preserves the entry token, resets overlay/live-write declarations, and stages the definition. Derivation still observes the retained live-write marker and pays the build necessary to remove its compiled effects. Hooks and inverse order are not authored here. See ADR-064 and ADR-066.

## #commit

The only path by which structural work either waits in a recipe or applies, and the one member the phase can answer join. An open recipe has already written its pending pair, so a join returns without effects. Otherwise an in-flight boundary refuses before #apply. A recipe started by a hook can stage normally but is refused when it attempts to commit; this keeps one owner for structural reentrancy. An open value batch refuses after that, as value-batch-structural, at this one member rather than at the six verbs that reach it: the two tiers do not nest in either direction, because a commit derives effects, replaces the graph and adopts a pair while a batch holds a seed list and nothing else. Placing the new condition after the in-flight one leaves every answer that existed before unchanged and adds only the case where a structural verb is reached from the recipe body itself. See ADR-078.

Do not merge reentrant operations into #open. The owning commit keeps its pair in a local, has already derived/applied work against it, and cannot honor the meaning of an open recipe. Reentry could overwrite accepted definitions or leave compiled/mounted resources with no retained owner. Both effect and settlement phases refuse; a second phase flag would make the contract hook-dependent. Teardown drainage does not belong here because the early return would skip it for recipes. See ADR-064, ADR-067 and ADR-068.

## #boundary

One owner of entering the phase one commit deeper, leaving it in finally, and draining the release the moment teardownOwed answers true. Wraps the whole structural application and every immediate write that must survive injected code. It does not turn direct writes into graph commits. Resource release is delayed until no inverse or completion still needs the composition. Deferred teardown diagnostics cannot replace the outcome being unwound. See ADR-067 and ADR-069.

Sharing this depth intentionally makes a structural write from a direct-write hook reentrant too: otherwise the direct writer could overwrite that structural change with its previously resolved entry. Immediate mutation/publication paths read the same depth through #refuseReentrant. See ADR-068 through ADR-070.

## #apply

Resolve omitted map halves to the retained maps, enter the boundary, derive effects, assert liveness, apply effects, replace the graph, adopt the pair, settle, and publish. The boundary starts before derivation because resolution is injected code. Disposal during derivation refuses before any effect. Each successful effect is recorded before liveness is rechecked, so disposal after an effect enters ordinary rollback against still-live resources.

On pre-acceptance failure, run only recorded inverses in apply order and report through rejectAfterRollback. Once replaceGraph succeeds, adoption and accepted completion have no inverse. Settlement attempts every independent step and finally #flush inside the same collector, not a throwing finally that could erase an earlier failure. Hooks can dispose during settlement; later steps still run against the deferred live graph, while publication skips the now-dead project. Guarantee attempts, not recovery inside an arbitrary failing host. See RA-114, ADR-031, ADR-035, ADR-045, ADR-067 and ADR-071.

edit rechecks disposal after its recipe, and all other entry paths establish liveness before reaching this member. #commit is its sole caller. The boundary owns the final drain; this method does not duplicate it. See ADR-064 and ADR-069.

## #flush

One internal publication attempt for a supplied seed list, and the owner of exactly one decision: a disposed runtime is skipped rather than reported. Unlike #invalidateOne it skips disposal instead of asserting, which is the split ADR-071 decided and this member keeps. Everything else it used to decide now belongs to #publishSeeds, which it delegates to. It answers nothing, and that is the point: it used to answer undefined for a disposed runtime and for an empty seed list alike, so its one caller that read the answer collapsed two conditions into one empty batch and was correct only because liveness was asserted immediately before it at every call site. Safe by statement ordering is not safe by construction, and a sentinel that carries two meanings is deleted rather than documented. It has no error boundary: its owning completion collector preserves any synchronous exception with preceding failures. Structural commits, accepted stagger changes and the value batch share this mechanism, not their topology semantics. See ADR-064, ADR-069, ADR-071, ADR-078 and ADR-079.

## #publishSeeds

The one owner of what an empty seed list means, and the member every seed list a caller supplies is published through. A list that names nothing is not a publication, because even an empty batch opens one, notifies every batch subscriber and advances sequence, so it answers the empty batch rather than making one. A list that names anything goes to #invalidateSeeds. Three callers and one rule: values publishes through it for a recipe that staged nothing, public invalidate publishes through it for a caller that named nothing, and #flush delegates to it after answering its own condition. Public invalidate reached #invalidateSeeds directly until issue #371, which is how the one verb a caller can hand an empty list paid a whole publication for one while the rule refusing that cost lived a single call away. Seeds are not deduplicated here; GraphRuntime.flush already does that and a second owner of it would be a second answer.

It asserts runtime liveness itself rather than trusting its caller to have asked, which is what makes its answer unambiguous by construction: every batch it hands back is one it published or one that had nothing to publish, and a disposed project reaches neither. values asks liveness too, after its recipe and for a different reason, and both calls are load-bearing rather than one of them redundant: that one is the re-ask a callback invalidated, this one is the precondition of the answer, and two side-effect-free field reads cannot disagree. #flush answers its own condition before delegating, so its skip never reaches this assertion. See ADR-079, ADR-064 and ADR-071.

## #invalidateSeeds

The one place a seed list becomes a published, recorded batch: flush the graph, record the returned diagnostics, answer the batch. It reaches GraphRuntime.flush rather than GraphRuntime.invalidate since issue #374, which deleted the second name: that member was flush with the clock's tick parameter removed, and flush no longer has one, so the two spellings had become one operation under two names. Three members carried that pair as three copies, #flush, #invalidateOne and public invalidate, and the third had been left standing by reasoning inherited from the second rather than by evidence of its own.

Every caller keeps its own preconditions and its own failure contract, which is the merge ADR-071 refused and is not this one: #flush skips a disposed runtime, #invalidateOne reports one, public invalidate additionally refuses reentrancy, and #publishSeeds decides emptiness. What none of them owns any more is the publication mechanics. Public invalidate reaches this member through #publishSeeds rather than directly, so the empty list it may be handed costs the construction of a batch rather than the publication of one. ADR-079 read that cost as the reason the verb could not move; issue #371 read the same cost as the defect, and both readings agree on the half that survives: folding it into #flush is still refused, because #flush answers nothing and skips an empty list, so a fold would make a public verb's return optional and hand its callers a second failure contract rather than remove a duplicate. See ADR-079, ADR-080 and ADR-082.

## #assertSameLifetimes

One generic preflight for both maps. An id present in retained and candidate maps must carry the same token. A different token denotes recreation, which is refused as schema-transaction-recreated before any resolver, effect or graph work. Refusal preserves old handles, drivers, compiled tracks, residency and subscriptions; candidate handles become stale. Previously absent entries added and removed in one recipe are absent from both pairs and remain effect-free. Same-token replacement and separately committed remove/add remain supported. Issue #342.

Full reversible motion recreation would require staged ownership and defined track residency/order semantics. Rejecting the unsupported composite operation is safer than treating it as a no-op, destroying resources before acceptance, or inventing an incomplete rollback.

## #derive

Both lifetime preflights run before injected code. Then derive final-pair effects, not an accumulated operation log. New motions are built before track compilation so a recipe can add both. Removed tracks settle native residency deletion/graph eviction, compiled disposal, then Motion deregistration as independently collected steps. Removed motions settle after their children. New tracks compile before graph acceptance, then register and mount after it. Replacements stage compilation when required, republish the Motion track before graph acceptance, and finalize staged resources afterwards. A new node publishes, and one whose sources have not published yet lands on blocked with a pending diagnostic; addObserve and removeObserve route through the replacement path, which makes them publish too. See RA-9.

Reverts run in apply order: restore the compiled map before restoring Motion metadata, because Motion resolves compiled Tracks by id. A stage is finalized after adoption even when old resource cleanup throws. A skipped compilation leaves no stage to finalize. Candidate validation remains unconditional; retained live writes additionally force a build. Add-then-edit collapses to one final add, while add-then-remove of a new entity schedules no hooks. See ADR-031, ADR-045, ADR-062, ADR-064 and ADR-066.

Removal seeds readers from the old graph, including solver dependants, not merely explicit edge readers. Eviction failure cannot skip compiled disposal, nor can a disposal failure skip deregistration or later motion destruction. The derivation owns callback granularity; the shared collector owns completion. See ADR-051 and ADR-071.

## #adoptMaps

Adopts the accepted maps by pointer. No per-entry rewrite, merge or second snapshot derivation. Immediate edits are refused throughout the boundary, so no live-write overlay or authored update can race this assignment. Merging would falsely associate an old live-write marker with a newly compiled definition. A pre-acceptance disposal refusal never reaches adoption. See ADR-064, ADR-067 and ADR-070.

## #writeValues

One mechanism for setValues and overrideValues; rebase decides whether the authored definition moves. Resolve the entry lazily after reentrancy refusal, preserving the correct diagnosis for a node an owning commit is still adding. Split static and animated values, validate animated candidates, call the writer, stage a replacement if it declines patching, adopt retained state, then #completeWrite. No graph replacement on either path. See ADR-059, ADR-060 and ADR-070.

A static-only write needs neither validation nor staging. If an animated key is involved now or was involved in the previous overlay, wholesale replacement may need to clear old compiled effects. Read returned progress before staging, since a result getter can throw too. Once a writer succeeds it has no inverse: mark retained.liveWrite conservatively before a fallible escalation. A refused stage preserves the old definition/overlay but does not pretend the successful mask vanished. Accepted finalization failure never restores stale definitions over an installed replacement. See ADR-066 and issue #313.

The whole operation is inside #boundary, including injected calls and publication. Disposal is reported by the shared direct-write flush and resource release waits until completion ends. The handle factory owns no sequencing.

## #completeWrite

After adoption, attempt staged finalization, optional re-seek to captured progress, and #publishValue through runSettleSteps. A static/no-escalation path reaches #publishValue directly. Both endings therefore route through the one member that decides whether a value publication happens now or joins an open batch, so neither of them owns that condition. Success returns the actual batch; failure preserves ordered thrown values and does not invent rollback. Engine stages by installing a replacement and marks its stage settled before disposing the old Track, so a throwing commit may already be irreversible. Guarantee attempts and publish actual progress if a host re-seek fails, never an invented old value. See issue #313, LV-19 through LV-21, and PK-20 through PK-22.

## #boundGroup

The shared precondition for editing a property or binding inside an authored plugin group. Reads through readBoundGroup and refuses keyframe-group-unbound when absent; it does not duplicate group/property shape logic. Returns the keyframes record and bound group together. Originating a group belongs to structural setKeyframeGroup. See ADR-062, ADR-063 and ADR-065.

## #invalidateOne

The value tier's single-node flush and disposal report. Assert runtime liveness before invalidating; a disposed project must not publish, advance sequence or drain pending seeds, and an empty batch would falsely claim publication. Records returned diagnostics and returns the actual batch. Both value-write paths reach this owner rather than inline copies or public invalidate.

Still the only place a single-node value publication happens, still not the only ending a value write can have, and no longer a member that names the graph call: it asserts liveness and delegates the pair to #invalidateSeeds. ADR-078 kept the body on the measurement that two shipped cases read this declaration; remeasured, one does. PK-17 reads #writeValues, for its validation ordering rather than for any flush, so the cost of the move was one re-addressed case rather than two, and a third copy of the pair was found afterwards, which turns a tidy-up into an ownership defect. What the four records name is the assertion and the single-node answer, and both are unchanged. See ADR-064, ADR-069, ADR-070, ADR-078 and ADR-079.

## #publishValue

The one owner of whether a value write publishes now or joins an open batch. With no batch open it delegates to #invalidateOne and nothing about the single-node path moves. With one open it asserts runtime liveness, records the node as a seed, and answers the deferred batch: the node named, no patches, and one value-batch-deferred warning saying the publication was queued.

Its callers are both endings of #completeWrite, #removeKeyframe's no-op, and seek, which stops copying invalidate plus recordAll inline and routes through this owner instead, so adding the tier deleted a copy rather than adding one. Liveness is asserted on the staging path too, because a recipe may dispose the project and a seed pushed onto a dead runtime would be published by a batch that must not publish at all. See ADR-078.

## #recompileKeyframes

For authored leaves that cannot be expressed as a live mask: edit the pure record, validate it and resolve plugins, ask the writer, stage a replacement, adopt the accepted definition with overlay/liveWrite cleared, then #completeWrite. Capture prior progress so the new compiled Track resumes at that playhead. The boundary includes resolution and all injected work. A successful writer is conservatively recorded before a refused stage; an accepted stage is never rolled back because finalization cleanup threw. No topology operation is involved. See ADR-065, ADR-066, ADR-069 and issue #313.

## #setKeyframe

An existing property uses the live-write path; a new property uses the authored editor and recompilation path. The group must already exist. Determine existence through readPluginValues, not a private copy of group layout. Reentrancy is checked before resolving the entry. removeKeyframe uses the same ordering; its no-op retains the established direct-flush behavior. See RA-106, ADR-065, ADR-070 and issue #255.

## #replaceWithObservation

Idempotent observation semantics rather than a stale guard, which the writable resolver already answered. Adding an observation the node already carries and removing one it does not are both no-ops that commit nothing, so neither flushes and neither stages inside a recipe, which is what lets a recipe of nothing but no-ops end without a candidate build. Edge identity comes from observationEdgeKey against the entry's own motion owner rather than from object identity. See RA-66 and ADR-064.

## #editRequire

Shared ordering for requirement/goal binding edits: writable entry, bound group, pure edit and primitive-specific reservation, redundant-edit identity check, then one structural replacement. The registry validates the whole candidate at derivation; the primitive does not authorize its own binding. Inside recipes these operations stage rather than publish. See ADR-045, ADR-062, ADR-063 and ADR-064.

## #setGoal

The requirement editor with the reserved goals slot fixed and a member key supplied. No second dict editor. Whether the member belongs to the solver chain is validated against the candidate graph by resolveSolvers, not by the primitive. The ordinary setRequire spelling of the reserved slot remains refused. See ADR-057 and ADR-063.

## #editGroup

Shared whole-group editor: writable entry, refuse a name currently authored as an ordinary property, pure edit, identity no-op check, structural replacement. Missing keyframes read as one frozen empty record. Originating and replacing a group are the same whole-group operation because the group carries no separate id, token or mount. Registry ownership is still checked during derivation. See ADR-062 and ADR-063.

## #writeKeyframes

Writes the authored record through withKeyframes, then delegates replacement. Empty containers are removed at their owning level: empty slot, section, group and final keyframes record leave no meaningless shell behind. Six structural authoring verbs share this retained-record write rather than restating it. See ADR-063.

## #snapshot

One pass over tracks builds free tracks and buckets motion-owned tracks, then one pass projects motions. Avoids repeated per-motion filtering without creating another persistent ownership cache. Entries preserve committed order and untouched definition identity, and the snapshot comes from the same pair adoption will retain. See ADR-058 and ADR-064.

## #valueTransaction

A frozen projection of existing runtime verbs, not another implementation, exactly as #transaction is. Narrowing is not a fence: a recipe closes over the project handle, so every verb enforces its own refusal regardless of how it was reached, and what may not run while a batch is open is answered at the verb rather than by the absence of a member here.

track and tryTrack hand back the ordinary TrackHandle, whose value members join the batch through #publishValue while its structural members refuse at #commit. No node-addressed setKeyframe is projected: that spelling would lose the lifetime token the handle captured, and it would be a second owner of a verb TrackHandle already owns. See ADR-056, ADR-064 and ADR-078.

## #teardown

Release resources exactly once after marking the runtime dead. Take the terminal phase first, which is what drops a recipe's pending pair and a value batch's seed list and what makes a second call a no-op, and take whether the release was deferred from the caller that knows, since only dispose and the draining boundary can ask. Then attempt each mounted-node detach separately, clear native instances and retained maps, and dispose graph and composition as separate steps. Independent failure never skips later release attempts. Retry is not safe for an arbitrary host that may have partially released; the guarantee is exactly-once attempts. See ADR-067 and issue #312.

The shared collector preserves failure identity and occurrence order. Every failure is recorded in bounded diagnostics as project-release-failed at dispose. Nested aggregate causes appear in diagnostic messages without flattening the actual thrown objects; cycles and hostile stringification cannot escape teardown. Direct disposal reports failures through the shared reporter. Deferred disposal records them without throwing over the original operation, its rollback error or its successful return. This preserves Engine failed-load cleanup attachment and the observable contracts exercised by RA-140 through RA-144.

No release runs while an inverse or accepted completion still needs the graph/composition. Once the outermost boundary drains it, both retained maps are cleared after every possible direct-write adoption, so no disposed entry can be written back after cleanup. Handle.live reads the phase during the earlier deferred window rather than inferring the disposal from map emptiness. See ADR-056, ADR-067 and ADR-069.
