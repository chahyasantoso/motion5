# packages/core/src/runtime/project-runtime.ts

Private ownership and ordering for ProjectRuntime. Exported API documentation remains in the source; comments explaining individual statements remain beside them. Each level-two heading names a source declaration, in declaration order. Undocumented members carry no additional rule. This is a complete, condensed replacement of the previous mirror, not an appended history. The read-budget contract belongs to docs/AI-EDIT-WORKFLOW.md and its scanner.

## TrackEntry

The retained track, adopting owner, optional motion owner, lifetime token, animated overlay, and conservative live-write marker. The overlay records the last animated live write; it is not authored state. A live write can survive a refused escalation because the writer has no inverse. Only a successful fresh compilation removes its effect, so structural derivation must build when retained.liveWrite is true even if compiled inputs compare equal. Candidate validation is never short-circuited by that marker. See ADR-060, ADR-062 and ADR-066.

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

The pending pair while one recipe executes. Both halves start by identity as the retained pair and are copied on their first staged write, after the entry point's last refusal. There is no operation log or dirty flag. A recipe that throws adopts nothing, and handles it created become stale. Reads within it see the pending pair. See ADR-064.

## #tracks

The retained pair; #motions follows the same rule. Maps are mutable fields because an accepted transaction replaces each map object. Structural reads use #readTracks/#readMotions; immediate edits write retained entries only outside an open recipe and inside their own boundary. A builder must not keep a map after handing it over. See ADR-064 and ADR-069.

## #open

Present only while recipe code is running. edit clears it in finally before committing or propagating an exception. A recipe may dispose the project; edit rechecks liveness after the callback and returns the recipe's answer without committing anything. During a commit this field is necessarily absent, so it cannot detect reentrant commits. #inFlight supplies that separate condition. See ADR-064, ADR-068 and ADR-070.

## #inFlight

Depth of boundaries whose work still needs the live graph/composition. Structural commits and immediate edits share it: naming it only for commits would hide the direct-write disposal hazard. A boundary raises it before derivation because plugin resolution is injected code too. Public mutation/publication paths refuse while it is raised; reads remain available and disposal is deferred.

Keep the counter even though current guards bound it to one. That bound has changed as new callback paths were introduced; a boolean would silently release resources too early if nesting ever became reachable. The depth, decrement and teardown drain have one owner, #boundary. See ADR-067 through ADR-070.

## #pendingTeardown

Disposal was requested but resource release is still owed. dispose marks the runtime dead immediately; only #teardown clears this pending state. The outermost boundary drains it once after all inverses and accepted completion steps finish. Deferred cleanup reports diagnostics rather than replacing the operation's outcome. See ADR-067 and issue #312.

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

Mount itself seeds no publication. Loaded projects publish on their first real operation/tick, not on mount. An eager seed was measured and rejected because deduplication consumes the next seek's publication rather than adding an independent one. See ADR-066, RA-100 and RA-101.

## #transaction

A frozen projection of existing runtime verbs, not another implementation. addMotion resolves the ordinary handle after staging the addition. Narrowing is not a security or mutation fence: recipes can close over the project handle, so immediate verbs enforce their own refusal regardless of how reached. See ADR-064.

## #readersOf

Reads GraphIR.dependants and returns a deduplicated, frozen list in first-occurrence order. Never rederive readers from edges: solver membership is a dependency without the corresponding observation edge. Both dependantsOf and removal publication use this one reader. See ADR-051, RA-86, RA-87, RA-98 and RA-99.

## #ownedBy

Filters the explicitly supplied track map for a motion's children in committed map order. Destruction counts, MotionHandle.trackIds and MotionHandle.definition use the same owner. A plan builder and a public read may need different maps, so the map is an argument rather than hidden state. The snapshot uses an equivalent single bucket pass to avoid repeated filtering. See ADR-061 and ADR-064.

## #entryOf

Resolves an id this project must have, or reports an unknown graph node. Unlike #liveEntry it does not answer whether a previously issued handle still names the same lifetime.

## #liveOf

The generic comparison of a handle's captured token against the readable entry. A disposed runtime answers absent immediately, even while deferred teardown has not cleared maps. This is a nonthrowing probe so live getters remain safe. Reads and writes apply their different failure precedence above this layer. See ADR-056, ADR-061 and ADR-067.

## #entryIfLive

The track probe through #liveOf. A pending handle is live during its recipe and stale after abort because its token was never adopted. A motion has the analogous probe. See ADR-056 and ADR-064.

## #liveEntry

The throwing track-read resolver. Absence or a changed token produces StaleTrackHandleError, including on a disposed runtime. Writes use #writableEntry to ask runtime liveness first; adding that check here would change the read/probe contract. See ADR-056.

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

## #refuseReentrant

The shared rung for immediate mutation/publication: first refuse an open recipe with schema-transaction-immediate naming the verb, then an in-flight boundary with schema-commit-reentrant. The first condition concerns caller-authored recipes; the second concerns callbacks an owning operation invoked. They currently cannot both be true, but the precedence remains explicit.

The guard stays outside #boundary and before argument-dependent entry resolution, so an operation cannot refuse itself or falsely report an unknown node that its owning commit is still adding. Structural writes have their own shared rung in #commit; no entry path is common to both verb families. Both rungs use the same refusal function. See ADR-064, ADR-068 and ADR-070.

Owning work never goes through guarded public verbs. Settlement mounts via #mountNode; structural and stagger publication use #flush; value publication uses #invalidateOne. Ordinary Engine driver callbacks still reach public invalidate. Only the owning stagger re-seed receives its explicit no-op callback and is followed by runtime-owned publication. A global bypass or lowered guard would admit actual caller reentrancy and is not equivalent. Issue #341.

The duplicate guard on the setKeyframe-to-writeValues path is intentional: both public-capability entries need the rung, and two side-effect-free reads are cheaper and safer than an unchecked variant of the write mechanism. #recompileKeyframes is a tail whose callers already checked. See ADR-070.

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

Always resolves and validates the candidate before deciding whether compilation is skippable. Compares complete compiled inputs through sameCompiledTrackInput, resolving the retained definition rather than caching registry-dependent data. The candidate resolve cannot be skipped even when liveWrite already forces a build: doing so would remove a validator. Asked once per final replacement, not once per recipe operation. This injected callback runs within the boundary and before effects. See ADR-062, ADR-064 and ADR-066.

## #replaceTrack

Validates the complete replacement and requires the same qualified id. Preserves the entry token, resets overlay/live-write declarations, and stages the definition. Derivation still observes the retained live-write marker and pays the build necessary to remove its compiled effects. Hooks and inverse order are not authored here. See ADR-064 and ADR-066.

## #commit

The only path by which structural work either waits in a recipe or applies. An open recipe has already written its pending pair, so this returns without effects. Otherwise an in-flight boundary refuses before #apply. A recipe started by a hook can stage normally but is refused when it attempts to commit; this keeps one owner for structural reentrancy.

Do not merge reentrant operations into #open. The owning commit keeps its pair in a local, has already derived/applied work against it, and cannot honor the meaning of an open recipe. Reentry could overwrite accepted definitions or leave compiled/mounted resources with no retained owner. Both effect and settlement phases refuse; a second phase flag would make the contract hook-dependent. Teardown drainage does not belong here because the early return would skip it for recipes. See ADR-064, ADR-067 and ADR-068.

## #boundary

One owner of raising depth, decrementing in finally, and draining pending teardown at depth zero. Wraps the whole structural application and every immediate write that must survive injected code. It does not turn direct writes into graph commits. Resource release is delayed until no inverse or completion still needs the composition. Deferred teardown diagnostics cannot replace the outcome being unwound. See ADR-067 and ADR-069.

Sharing this depth intentionally makes a structural write from a direct-write hook reentrant too: otherwise the direct writer could overwrite that structural change with its previously resolved entry. Immediate mutation/publication paths read the same depth through #refuseReentrant. See ADR-068 through ADR-070.

## #apply

Resolve omitted map halves to the retained maps, enter the boundary, derive effects, assert liveness, apply effects, replace the graph, adopt the pair, settle, and publish. The boundary starts before derivation because resolution is injected code. Disposal during derivation refuses before any effect. Each successful effect is recorded before liveness is rechecked, so disposal after an effect enters ordinary rollback against still-live resources.

On pre-acceptance failure, run only recorded inverses in apply order and report through rejectAfterRollback. Once replaceGraph succeeds, adoption and accepted completion have no inverse. Settlement attempts every independent step and finally #flush inside the same collector, not a throwing finally that could erase an earlier failure. Hooks can dispose during settlement; later steps still run against the deferred live graph, while publication skips the now-dead project. Guarantee attempts, not recovery inside an arbitrary failing host. See ADR-031, ADR-035, ADR-045, ADR-067 and ADR-071.

edit rechecks disposal after its recipe, and all other entry paths establish liveness before reaching this member. #commit is its sole caller. The boundary owns the final drain; this method does not duplicate it. See ADR-064 and ADR-069.

## #flush

One internal publication attempt for a supplied seed list. Skips a disposed runtime or empty list, otherwise invalidates the graph and records returned diagnostics. It has no error boundary: its owning completion collector preserves any synchronous exception with preceding failures. Unlike #invalidateOne it returns no batch and skips disposal instead of asserting. Structural commits and accepted stagger changes share this mechanism, not their topology semantics. See ADR-064, ADR-069 and ADR-071.

## #assertSameLifetimes

One generic preflight for both maps. An id present in retained and candidate maps must carry the same token. A different token denotes recreation, which is refused as schema-transaction-recreated before any resolver, effect or graph work. Refusal preserves old handles, drivers, compiled tracks, residency and subscriptions; candidate handles become stale. Previously absent entries added and removed in one recipe are absent from both pairs and remain effect-free. Same-token replacement and separately committed remove/add remain supported. Issue #342.

Full reversible motion recreation would require staged ownership and defined track residency/order semantics. Rejecting the unsupported composite operation is safer than treating it as a no-op, destroying resources before acceptance, or inventing an incomplete rollback.

## #derive

Both lifetime preflights run before injected code. Then derive final-pair effects, not an accumulated operation log. New motions are built before track compilation so a recipe can add both. Removed tracks settle native residency deletion/graph eviction, compiled disposal, then Motion deregistration as independently collected steps. Removed motions settle after their children. New tracks compile before graph acceptance, then register and mount after it. Replacements stage compilation when required, republish the Motion track before graph acceptance, and finalize staged resources afterwards.

Reverts run in apply order: restore the compiled map before restoring Motion metadata, because Motion resolves compiled Tracks by id. A stage is finalized after adoption even when old resource cleanup throws. A skipped compilation leaves no stage to finalize. Candidate validation remains unconditional; retained live writes additionally force a build. Add-then-edit collapses to one final add, while add-then-remove of a new entity schedules no hooks. See ADR-031, ADR-045, ADR-062, ADR-064 and ADR-066.

Removal seeds readers from the old graph, including solver dependants, not merely explicit edge readers. Eviction failure cannot skip compiled disposal, nor can a disposal failure skip deregistration or later motion destruction. The derivation owns callback granularity; the shared collector owns completion. See ADR-051 and ADR-071.

## #adoptMaps

Adopts the accepted maps by pointer. No per-entry rewrite, merge or second snapshot derivation. Immediate edits are refused throughout the boundary, so no live-write overlay or authored update can race this assignment. Merging would falsely associate an old live-write marker with a newly compiled definition. A pre-acceptance disposal refusal never reaches adoption. See ADR-064, ADR-067 and ADR-070.

## #writeValues

One mechanism for setValues and overrideValues; rebase decides whether the authored definition moves. Resolve the entry lazily after reentrancy refusal, preserving the correct diagnosis for a node an owning commit is still adding. Split static and animated values, validate animated candidates, call the writer, stage a replacement if it declines patching, adopt retained state, then #completeWrite. No graph replacement on either path. See ADR-059, ADR-060 and ADR-070.

A static-only write needs neither validation nor staging. If an animated key is involved now or was involved in the previous overlay, wholesale replacement may need to clear old compiled effects. Read returned progress before staging, since a result getter can throw too. Once a writer succeeds it has no inverse: mark retained.liveWrite conservatively before a fallible escalation. A refused stage preserves the old definition/overlay but does not pretend the successful mask vanished. Accepted finalization failure never restores stale definitions over an installed replacement. See ADR-066 and issue #313.

The whole operation is inside #boundary, including injected calls and publication. Disposal is reported by the shared direct-write flush and resource release waits until completion ends. The handle factory owns no sequencing.

## #completeWrite

After adoption, attempt staged finalization, optional re-seek to captured progress, and #invalidateOne through runSettleSteps. A static/no-escalation path uses the existing flush directly. Success returns the actual batch; failure preserves ordered thrown values and does not invent rollback. Engine stages by installing a replacement and marks its stage settled before disposing the old Track, so a throwing commit may already be irreversible. Guarantee attempts and publish actual progress if a host re-seek fails, never an invented old value. See issue #313, LV-19 through LV-21, and PK-20 through PK-22.

## #boundGroup

The shared precondition for editing a property or binding inside an authored plugin group. Reads through readBoundGroup and refuses keyframe-group-unbound when absent; it does not duplicate group/property shape logic. Returns the keyframes record and bound group together. Originating a group belongs to structural setKeyframeGroup. See ADR-062, ADR-063 and ADR-065.

## #invalidateOne

The value tier's single-node flush and disposal report. Assert runtime liveness before invalidating; a disposed project must not publish, advance sequence or drain pending seeds, and an empty batch would falsely claim publication. Records returned diagnostics and returns the actual batch. Both value-write paths use this owner rather than inline copies or public invalidate. See ADR-064, ADR-069 and ADR-070.

## #recompileKeyframes

For authored leaves that cannot be expressed as a live mask: edit the pure record, validate it and resolve plugins, ask the writer, stage a replacement, adopt the accepted definition with overlay/liveWrite cleared, then #completeWrite. Capture prior progress so the new compiled Track resumes at that playhead. The boundary includes resolution and all injected work. A successful writer is conservatively recorded before a refused stage; an accepted stage is never rolled back because finalization cleanup threw. No topology operation is involved. See ADR-065, ADR-066, ADR-069 and issue #313.

## #setKeyframe

An existing property uses the live-write path; a new property uses the authored editor and recompilation path. The group must already exist. Determine existence through readPluginValues, not a private copy of group layout. Reentrancy is checked before resolving the entry. removeKeyframe uses the same ordering; its no-op retains the established direct-flush behavior. See ADR-065, ADR-070 and issue #255.

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

## #teardown

Release resources exactly once after marking the runtime dead. Capture whether the release is deferred, clear the pending flag, attempt each mounted-node detach separately, clear native instances and retained maps/open transaction state, then dispose graph and composition as separate steps. Independent failure never skips later release attempts. Retry is not safe for an arbitrary host that may have partially released; the guarantee is exactly-once attempts. See ADR-067 and issue #312.

The shared collector preserves failure identity and occurrence order. Every failure is recorded in bounded diagnostics as project-release-failed at dispose. Nested aggregate causes appear in diagnostic messages without flattening the actual thrown objects; cycles and hostile stringification cannot escape teardown. Direct disposal reports failures through the shared reporter. Deferred disposal records them without throwing over the original operation, its rollback error or its successful return. This preserves Engine failed-load cleanup attachment and the observable contracts exercised by RA-140 through RA-144.

No release runs while an inverse or accepted completion still needs the graph/composition. Once the outermost boundary drains it, both retained maps are cleared after every possible direct-write adoption, so no disposed entry can be written back after cleanup. Handle.live reads the disposal flag during the earlier deferred window rather than inferring it from map emptiness. See ADR-056, ADR-067 and ADR-069.
