# Phase 4 implementation review and remediation plan

**Reviewed:** 2026-08-10, Asia/Jakarta
**Commit:** `b7b4108`
**Scope:** full tree. `packages/core/src` (contract, domain, graph, runtime, ports, adapters, engine), `packages/react`, `scripts/`, `.github/workflows`, and every document in `docs/`. [motionpath](https://github.com/chahyasantoso/motionpath) was read as the behavioral oracle per ADR-001.
**Method:** source read against the normative claims in [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md), [SESSION-STATUS.md](./SESSION-STATUS.md), and [PHASE-3-IMPLEMENTATION-REVIEW.md](./PHASE-3-IMPLEMENTATION-REVIEW.md). No test run is claimed by this document.
**Conclusion:** the graph kernel is sound and should not be touched. The publication path is not. Four defects produce wrong values or silently drop authored behavior, the composition root is still a placeholder past the slice that owed its replacement, and two mechanical gates report green over the things they were written to catch. Phase 4 must not close on the current tree.

## 1. Verdict

Phase 2 delivered what it promised. Phase 3 and Phase 4 did not, and the gap is invisible because the evidence that would expose it was never written.

Severity is assigned by observable consequence, not by size of diff.

- **Critical, wrong values published:** F-1 input resolution, F-2 output edges.
- **Critical, no real runtime:** F-3 placeholder compose resolver.
- **High, invariant unenforced:** F-4 Track dirty check, F-6 package boundary, F-7 boundary scan coverage, F-8 boundary scan self-test.
- **High, adapter cannot do its job:** F-9 DOM adapter.
- **Medium:** F-5 membership, F-10 batch guard, F-11 documentation drift.

The common root cause is worth naming once, because it explains all eleven findings and no individual fix addresses it: **every slice from P3-02 onward was accepted on evidence it named rather than evidence it shipped.** The plan lists `flush-diamond.test.ts`, `flush-reentrancy.test.ts`, `failure-closure.test.ts`, `single-owner.test.ts`, `tick-monotonic.test.ts`, `project-lifecycle.test.ts`, and `dom-patch-apply.test.ts` as the exit conditions for P3-02 through P4-02. None of those files exist. The suite is green because it tests the parts that were built, and the parts that were not built have no failing test to announce them. Section 5 fixes the defects; section 7 proposes the process change that stops the next batch.

## 2. Disposition of the external review

An external review of this tree raised two findings. Both are real. Both are understated, and each rests on one incorrect supporting claim that should not be carried forward into the fix.

**Its finding 1, the `core/src` reach-through: confirmed, understated twice.**

It is correct that `packages/react/src/patch-store.ts` imports `../../core/src/runtime/patch-registry`, that `Patch`, `PatchListener`, and `PatchRegistry` are absent from `packages/core/src/index.ts`, and that `scripts/boundary-scan.mjs` never inspects consumers, so the `boundaries` job passes over it.

It is wrong that the mirrored rule "isn't written down." P4-03's exit condition in the implementation plan reads: *"`@motion5/core` imports only the public core surface."* This is not an unstated principle. It is the named, binary exit gate of the slice currently in review, and it is unmet.

It is also wrong about the fix. Exporting three types from `index.ts` does not resolve this, because `@motion5/core` is not a resolvable specifier at all. `packages/core/package.json` does not exist, the root manifest declares no `workspaces` field, and the `packages/core/src/internal.ts` entrypoint promised in P0-03 was never created. The relative path is not a shortcut a developer took past a working boundary. It is the only import that currently resolves. See F-6.

**Its finding 2, the DOM adapter: confirmed, with the wrong reasoning.**

It is correct that `test/integration/dom-patch-apply.test.ts` does not exist, that the only coverage is one assertion in `test/contract/adapters.test.ts`, and that no ADR or status line defers CSS mapping.

It is wrong that motionpath's `domRenderer` "handled transform composition and filter serialization" at write time. It did not. It delegates all value interpretation to `gsap.set(target, dirty)`. Copying a transform composer from a predecessor that never had one would be inventing work. What motionpath actually owns, and motion5 does not, is listed in F-9, and the most important item is target resolution, which the external review did not mention.

**What the external review missed:** F-1 through F-5, F-7, F-8, F-10, and F-11. Its two "smaller notes, not blocking" are both symptoms of F-1 and are reclassified accordingly. Its bottom line, "ship-quality core," is not supportable.

## 3. What is solid and must not be reopened

This is not filler. Several findings below are one file away from code that is genuinely good, and a remediation PR that widens into this material should be recut.

- `graph/order.ts`. Iterative Kahn traversal, a ready set kept sorted by qualified id then authored index, breadth-first shortest-cycle reporting, and cycle rotation to a canonical start. Order is a pure function of authored input. I-12 is honestly satisfied.
- `graph/observation-state.ts`. The undo journal, the in-place mutation discipline, the `#replaying` guard that keeps rollback from journaling its own inverse, and the deliberate absence of a rebuild-from-snapshot seam. I-1 and ADR-006 are honestly satisfied.
- `graph/binding.ts`. Candidate built and validated before live state is touched, delta applied in reversible order, snapshot swapped last, single rollback path on any failure. I-2 is honestly satisfied.
- `graph/ir.ts`. One spelling of edge identity in `edgeKey`, diagnostics sorted by rule then path, error severity blocking the build while warnings pass. I-15 is honestly satisfied.
- `runtime/patch-registry.ts`. Cycle-safe deep freeze, revision advance suppressed by structural equality, listener sets snapshotted before notification so unsubscribe during a tick is safe. I-7 and I-8 are honestly satisfied, with the narrow exception in F-10.
- `domain/lifecycle.ts` and the disposal guards throughout. Idempotent and owner-first, as specified.

The ownership model is the thing this project got right, and every finding below is repairable without reopening it.

## 4. Findings

Each finding states the evidence, the consequence, the proposed fix, and the remediation PR that owns it.

### F-1 Critical: input edges resolve to `undefined` outside the dirty closure

**Where:** `packages/core/src/runtime/graph-publisher.ts`, in `flush`.

**Evidence:** inputs are read only from the per-flush memo.

```ts
if (edge.role === "input") inputs[edge.target ?? ""] = memo.get(edge.sourceId)?.values;
```

`memo` is created empty at the top of each flush and is populated only by nodes that pass the `affected.has(id)` filter. A node inside the dirty closure whose upstream is outside it therefore composes against `undefined` for that input.

**Consequence:** any node with two upstreams where only one was seeded publishes wrong values. This is not a latent risk. It is the normal case the moment seeds are narrower than the whole graph, which is the entire purpose of the dirty-closure optimization. A full-graph seed masks it completely, which is why the current suite does not see it.

**Oracle:** motionpath's `usecases/GraphPublisher.js` composed **every** node in canonical order into a `composed` map and then published only the dirty subset. motion5 correctly narrowed *publication* to the dirty closure but also narrowed *input availability*, which was not the same decision. The predecessor was right here.

**Fix:** the registry already holds the last published value for every node. Fall back to it.

```ts
const cached = memo.get(edge.sourceId)?.values;
inputs[edge.target ?? ""] = cached ?? this.#registry.get(edge.sourceId)?.values;
```

A node that has never published resolves to `undefined`, which is correct and distinguishable. Note that this requires `PatchRegistry.get` to remain reachable from the publisher, which it already is.

**Reclassification:** the external review's note that `memo.get(id) ?? node.compose(inputs)` "can never hit" is correct but is not cosmetic. It is the artifact of a memo being asked to serve as an upstream value cache when its lifetime is a single flush. Once F-1 lands, delete the dead `??` rather than leaving it.

**Owned by:** R1.

### F-2 Critical: output-role edges are validated, ordered, and then ignored

**Where:** `packages/core/src/runtime/graph-publisher.ts`.

**Evidence:** the traversal branches on `edge.role === "input"` and has no `"output"` branch anywhere.

**Consequence:** P3-02 specifies that "input-role edges contribute to the source object before local composition and output-role edges merge over the resulting patch after it." `graph/ir.ts` builds output edges, validates that they carry no target, and includes them in ordering and in the live edge set. Publication then drops them silently. Half of the authored observation contract is unimplemented, and because output is the default role when `observes[].role` is omitted, this is the path most authored projects will take.

**Fix:** after a successful `node.compose(inputs)`, merge each output-source's current values over the composed values, in canonical edge order, then publish the merged result. Resolve each output source the same way F-1 resolves inputs, memo first and registry second. motionpath's `usecases/mergePatches.js` is the behavioral reference for one-level-deep object merge semantics; do not copy the file, and note that motion5 patches are frozen, so the merge must build a new object rather than mutate.

**Ordering note:** merge order must be canonical, not authored, or two runs of the same project can disagree when a node has two output sources that write the same key. Sort by `edgeKey`.

**Owned by:** R2.

### F-3 Critical: the composition root still publishes a placeholder

**Where:** `packages/core/src/engine.ts`.

**Evidence:**

```ts
compose: (node) => () => ({
  values: { nodeId: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
}),
```

**Consequence:** `Engine.load` never constructs a `Track`, never consults the validated `Interpolator` port, never resolves plugins, and never advances `sourceProgress`. The three `assert*` port calls in the constructor validate capabilities that the returned runtime then does not use. Every published patch in the system is the node's own id echoed back.

This is the finding that most distorts the project's apparent state. The graph, the transaction, the registry, and the ordering are all real, and they are all currently carrying a constant.

**Process note:** this is not a new discovery. [PHASE-3-IMPLEMENTATION-REVIEW.md](./PHASE-3-IMPLEMENTATION-REVIEW.md) finding 3 records it and dispositions it as **"Deferred deliberately to P4-01,"** with the explicit statement that "P4-01 owns replacement of the placeholder compose resolver through the Interpolator port." [SESSION-STATUS.md](./SESSION-STATUS.md) now reports collapsed P4-01/P4-02 as merged on `main`. P4-01 shipped `adapters/interpolator/gsap.ts` and merged without discharging the obligation the review assigned to it. A deferral that survives the slice it was deferred to is no longer a deferral.

**Fix:** `Engine.load` resolves a real compose function per node: construct one `Track` per `GraphNode` from `node.track`, pass the injected `Interpolator` and the resolved plugin list, and return a closure that calls `Track.compose(inputs)` and maps `TrackSnapshot` onto `PublisherComposition`, with `sourceProgress` taken from the snapshot and `sourceRevisions` from the upstream patches actually consumed. Track lifetime belongs to `ProjectRuntime`, not to the closure, so disposal has one owner.

**Owned by:** R5. Sequenced after R1 and R2 deliberately: wiring real composition into a publisher that drops inputs and ignores output edges would produce failures that are hard to attribute.

### F-4 High: a clean Track returns a stale snapshot when its inputs change

**Where:** `packages/core/src/domain/track.ts`, in `compose`.

**Evidence:**

```ts
if (!this.#dirty && this.#lastSnapshot) return this.#lastSnapshot;
```

`#dirty` is set only by `setProgress`. The `inputs` argument is not part of the check.

**Consequence:** a track whose own progress did not move but whose upstream input did returns the previous snapshot. This is precisely the shape of the FK-plugin case from motionpath: a node that never moves its own playhead but whose composed value depends entirely on a parent that did.

The external review guessed this "might never fire in practice today." That is correct only because F-1 and F-3 mean no real input value ever reaches `compose`. It becomes a live defect the moment R1 and R5 land, which is why it is sequenced with them rather than after them.

**Fix:** include the inputs in the cache key. Retain the last `inputs` reference alongside `#lastSnapshot` and short-circuit only when `!this.#dirty` **and** the incoming `inputs` are structurally equal to the retained ones. `domain/values.ts` already owns structural equality per P1-01; use it rather than adding a second comparison. Reference equality alone is not sufficient, because the publisher builds a fresh `inputs` object every flush.

**Owned by:** R3.

### F-5 Medium: membership does not gate anything

**Where:** `packages/core/src/runtime/graph-runtime.ts`.

**Evidence:** the constructor seeds membership with the entire graph.

```ts
this.#members = new Set(this.#binding.graph.nodes.map(({ id }) => id));
```

**Consequence:** `attach` is a no-op for every authored node, so `ProjectRuntime.mount` grants nothing. `flush` and `#onTick` both default their seeds to `[...this.#members]`, so every node in the project publishes on every tick whether or not anything mounted it. `detach` removes an entry that will never be re-added by `attach` in any observable way, and unmount-driven blocking behavior cannot be expressed.

This silently pre-breaks P5-04, whose whole invariant is that unmounting an upstream blocks its downstream closure rather than publishing stale values. It cannot block what it cannot exclude.

**Fix:** initialize `#members` empty. `attach` adds after the existing node-exists check, `detach` removes. Keep the `readonly` field initializer and drop the constructor reassignment, which currently also shadows the field initializer for no reason.

**Owned by:** R4.

### F-6 High: `@motion5/core` is not a package, so the boundary cannot be imported through

**Where:** repository layout.

**Evidence:** `packages/core/package.json` does not exist. The root `package.json` declares no `workspaces`. `packages/core/src/internal.ts`, named in P0-03's changes list, does not exist. `packages/react/package.json` exists and declares `exports` but no dependency on core. The root `tsconfig.json` resolves the whole tree with a single `include` of `packages/**/*.ts` and `moduleResolution: "Bundler"`, which is why the relative import typechecks cleanly today.

**Consequence:** the P4-03 leak is not a developer shortcut. It is the only import that resolves. Any fix applied to `patch-store.ts` alone reintroduces the same import the next time a consumer needs a runtime type, and P4-05's build job cannot be written at all against a package that has no manifest.

**Fix:** one packaging slice. Add `packages/core/package.json` with a `.` export to `src/index.ts` and an `./internal` export to a new `src/internal.ts`. Add `workspaces` to the root manifest. Add `@motion5/core` as a workspace dependency of `@motion5/react`. Put `Patch`, `PatchListener`, and the narrow read/subscribe surface the store actually needs on `./internal`, not on `.`.

**Design call, and it matters:** do **not** export the `PatchRegistry` class. `createPatchStore` needs `get(nodeId)` and `subscribeNode(nodeId, listener)` and nothing else. Export a `PatchSource` interface carrying exactly those two members and type the parameter as that. Exporting the class hands consumers `beginBatch`, `publish`, and `closeBatch`, which would let a consumer author patches, and that is a second publication owner. P6-01 already names `PatchRegistry` as permanently non-public; honor that now rather than exporting it and clawing it back later.

The allow-list in `scripts/boundary-scan.mjs` gains only what lands on the public entrypoint. Symbols on `./internal` carry no stability promise per P0-03 and belong on a separate list.

**Owned by:** R6.

### F-7 High: the boundary scan never looks at consumers, `ports/`, or `engine.ts`

**Where:** `scripts/boundary-scan.mjs`.

**Evidence:** `const layers = ["contract", "domain", "graph", "runtime"];`, walked only under `packages/core/src`.

**Consequence:** three gaps, and the third is the embarrassing one.

- Consumer packages are never scanned, so no consumer reaching into `core/src` internals can ever be caught. This is the mechanical reason F-6's leak passes CI.
- `packages/core/src/ports` and `packages/core/src/engine.ts` are inside core and are not scanned. A renderer import in the composition root is currently undetected.
- motionpath's `architecture-boundary.test.js`, the predecessor gate this was meant to improve on, walked **all** of `packages/core/src` recursively. The successor's guardrail is strictly narrower in coverage than the one it replaced.

**Fix:** add `ports` and `engine.ts` to the core scan. Add a second scan pass over `packages/*/src` excluding core that fails on any import matching `../../core/src` or `packages/core/src`, with the message naming the public entrypoint to use instead. Keep the two passes separate: core has an outbound rule, consumers have an inbound rule, and collapsing them into one regex is how this gets mis-scoped again.

**Owned by:** R7.

### F-8 High: the boundary scan's planted-violation test does not test the boundary scan

**Where:** `packages/core/test/unit/scripts/boundary-scan.test.ts`.

**Evidence:** the test file re-declares `importsBoundary`, `importsRenderer`, and `bannedSymbol` as local copies of the regexes and asserts against those. It imports only the fixtures from `scripts/boundary-scan-fixtures`. It never imports, executes, or otherwise observes `scripts/boundary-scan.mjs`.

**Consequence:** the planted-violation suite proves that a copy of the predicates, living in the test file, behaves correctly. Edit or weaken a regex in the real script and every test still passes. The fourth case is worse than the other three: it does not even use the script's `extractExportNames`, it inlines a different and simpler regex and asserts on that.

This is the exact failure mode the plan's own risk register names, "a scanner that is green because its glob is wrong," and it is the failure mode ADR-008 made planted fixtures mandatory to prevent. The mitigation was implemented in a way that cannot detect the risk it was written for.

**Fix:** `boundary-scan.mjs` exports `importsBoundary`, `importsRenderer`, `bannedSymbol`, `extractExportNames`, and a `scan()` that returns the violations array instead of only printing. The script keeps a thin `main` that calls `scan()`, prints, and sets the exit code. The test imports those symbols from the script and deletes its local copies. Add one case that runs the real `scan()` against a planted temporary tree and asserts a non-empty violations array, so glob scope is covered and not just predicate text.

**Owned by:** R7, alongside F-7. Same file, same invariant, one PR.

### F-9 High: the DOM adapter cannot address a target and does not write style

**Where:** `packages/core/src/adapters/dom.ts`.

**Evidence:**

```ts
apply(patch) {
  if (patch.status !== "ready") return;
  Object.assign(stage, patch.values);
}
```

**Consequence, in priority order:**

- **No target resolution.** `createDomPatchAdapter(stage)` closes over one object and applies every patch it receives to it, ignoring `patch.nodeId`. motionpath's signature was `domRenderer(target, patch)`, resolving a target per node. A multi-node project cannot be rendered by this adapter at any level of CSS sophistication. This is the blocking gap, and the external review did not raise it.
- **No style write.** `Object.assign(el, { opacity: 1 })` sets an ad hoc JS property on the element and does nothing visually.
- **No internal-key filtering.** motionpath stripped `_`-prefixed keys, the framework `offset` key, and plugin-declared internal keys before writing. motion5 has `domain/plugins.ts` but the adapter consults nothing.
- **No output serialization.** motionpath ran plugin-declared serializers over object-valued keys before writing.
- **No last-applied diffing and no key removal.** motionpath held a `WeakMap` of the last applied values per target, wrote only changed keys, and emitted `undefined` for keys that disappeared between patches. Without removal semantics a property that stops being published stays stuck at its last value.
- **No teardown.** motionpath exposed `clearRendererTarget(target)`. motion5 has no way to release a target.

What motionpath did **not** do, contrary to the external review: compose transforms or serialize filters by hand. It passed the diffed patch to `gsap.set` and let the engine interpret it. Do not build a transform composer.

**Fix, and an explicit scope decision is required first.** Two defensible answers:

1. **Ship the adapter.** `apply(patch)` resolves a target from `patch.nodeId` through an injected resolver, filters internal keys, diffs against a per-target last-applied map, and hands the dirty subset to an injected writer. The writer is a port, so core stays engine-free and the GSAP-backed writer lives beside the GSAP interpolator. This is the honest completion of P4-02.
2. **Declare it a stub.** Write an ADR saying CSS mapping and target resolution are deferred to a named slice, add the line to SESSION-STATUS, and rename the export so nobody reads `createDomPatchAdapter` as renderer-ready.

**Recommendation: option 1.** Option 2 leaves P4-05's end-to-end fixture with nothing to drive, and "authored project through real interpolation and a real clock into applied output" is the point of the gate. Either way the currently-missing `test/integration/dom-patch-apply.test.ts` gets written, because the plan already names it as P4-02's evidence.

**Owned by:** R8.

### F-10 Medium: an empty batch is not detected as an open batch

**Where:** `packages/core/src/runtime/patch-registry.ts`, in `beginBatch`.

**Evidence:** `if (this.#batch.length > 0) throw new Error("A patch batch is already open.");`

**Consequence:** the open/closed state is inferred from whether anything was published rather than tracked. A second `beginBatch` after a batch that published nothing, which is the common case once revision suppression is doing its job, silently overwrites `#batchTick` and `#batchSeeds` instead of throwing. The guard is weakest exactly when suppression is working best.

**Fix:** an explicit `#open` boolean set in `beginBatch` and cleared in `closeBatch`. Have `closeBatch` throw when no batch is open, which the current implementation also does not do.

**Owned by:** R1, as a small correctness fix in the same publication path.

### F-11 Medium: documents claim states that do not exist

**Where:** `README.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/SESSION-STATUS.md`.

**Evidence:**

- `README.md` states "**Status:** Phase 0, documentation and toolchain baseline. The runtime is not implemented yet" on a tree that is through Phase 3 and into Phase 4.
- `README.md` states "The lockfile and `npm ci` gate land in P0-02. Until then, CI intentionally uses a temporary install fallback." P0-02 is merged, `package-lock.json` is committed, and all four CI jobs run `npm ci`.
- Named evidence files that do not exist: `test/integration/flush-diamond.test.ts`, `test/unit/runtime/publisher-has-no-mutation.test.ts`, `test/integration/flush-reentrancy.test.ts`, `test/integration/failure-closure.test.ts`, `test/integration/single-owner.test.ts`, `test/integration/tick-monotonic.test.ts`, `test/integration/project-lifecycle.test.ts`, `test/integration/dom-patch-apply.test.ts`.
- Named modules that do not exist: `core/errors/`, `graph/normalize.ts`, `graph/validate.ts`, `core/src/internal.ts`, `core/domain/triggers/` as a directory. Graph validation is real but lives inline in `ir.ts`, which is a defensible collapse that the plan should record rather than contradict.
- P3-02 requires that "a flush triggered during a flush returns immediately rather than queueing." There is no reentrancy guard in `GraphPublisher.flush`. I-6 is claimed and unenforced.
- The advisory-budget expiry recorded in the Phase 3 review is **2026-08-17**, one week out. P6-04 makes an expired advisory budget a merge blocker.

**Consequence:** the plan's traceability is the project's main quality instrument, and it currently reads as satisfied where it is not. The README understating progress is harmless to code and corrosive to review, because a reader who trusts it will not look for F-1 through F-3.

**Fix:** one truth pass. Correct the README status and the install-fallback paragraph. For each named-but-absent evidence file, either write it or strike it and record what actually covers the requirement. For each named-but-absent module, either create it or update the plan to name the module that took the responsibility. Add the reentrancy guard or drop the claim.

**Owned by:** R9, and partly discharged by R1 through R8, each of which writes the evidence file its own requirement already names.

## 5. Remediation plan

Nine pull requests in three waves. The slicing follows the existing delivery rules in section 2 of the implementation plan: one PR establishes one meaningful invariant, under twenty semantic files, and a PR that cannot name the single object owning its state transition is not ready.

Waves are dependency tiers, not calendar milestones. Within a wave, PRs are listed in merge order.

### Wave 1: make publication correct

Nothing else is worth doing first. Wiring real composition into a publisher that drops inputs would produce failures that are hard to attribute to a cause.

#### R1 `fix/r1-publisher-input-resolution`

- **Invariant:** a node composes against the current published values of all its input sources, whether or not those sources were seeded in this flush.
- **Owner:** `GraphPublisher` gains upstream-value resolution as an explicit responsibility, memo first and registry second. `PatchRegistry` gains explicit batch-open state.
- **Changes:** `runtime/graph-publisher.ts`, `runtime/patch-registry.ts`.
- **API delta:** none. Both objects are internal.
- **Evidence:** `test/integration/partial-seed-inputs.test.ts` builds a diamond, seeds one branch only, and asserts the unseeded upstream's last published values reach the join node. `test/unit/runtime/patch-registry.test.ts` gains a case for double `beginBatch` after an empty batch and for `closeBatch` with no batch open.
- **Exit:** the partial-seed test fails on `main` and passes here.
- **Fixes:** F-1, F-10. **Depends:** nothing. **Blocks:** R2, R3, R5.
- **Risk and rollback:** low. Single revert restores the memo-only read.

#### R2 `feat/r2-output-edge-merge`

- **Invariant:** output-role observation edges merge over a composed patch in canonical edge order before publication.
- **Owner:** `GraphPublisher`. No new object.
- **Changes:** `runtime/graph-publisher.ts`.
- **API delta:** none.
- **Evidence:** `test/integration/flush-output-merge.test.ts` covers a single output source, two output sources writing disjoint keys, two writing the same key with a canonical-order winner, and an output source that has never published.
- **Exit:** I-3 stays true, the publisher still exposes no topology mutation, and the same-key case is deterministic across shuffled authored order.
- **Fixes:** F-2. **Depends:** R1, same file and same resolution helper. **Blocks:** R5.
- **Risk and rollback:** merge-order ambiguity on same-key writes. Mitigation: canonical `edgeKey` sort, asserted directly by the third test case.

#### R3 `fix/r3-track-input-recompute`

- **Invariant:** a track recomposes when its inputs change, even on a tick where its own progress did not.
- **Owner:** `Track` keeps its dirty check and widens the cache key to include inputs.
- **Changes:** `domain/track.ts`, and `domain/values.ts` only if the structural equality helper needs exposing within the package.
- **API delta:** none.
- **Evidence:** `test/unit/domain/track-input-recompute.test.ts` proves a clean track with changed inputs recomposes, a clean track with structurally equal inputs does not, and the interpolator is still not consulted more than once per progress change, which is P1-03's existing guarantee.
- **Exit:** the P1-03 leaf-shape test still passes unchanged.
- **Fixes:** F-4. **Depends:** R1. **Blocks:** R5.
- **Risk and rollback:** a structural comparison on every compose is a hot-path cost. Mitigation: reference-equality fast path first, and record the delta in the P3-07 benchmark rather than guessing.

#### R4 `fix/r4-membership-gates-seeds`

- **Invariant:** only attached nodes are seeded by a default flush.
- **Owner:** `GraphRuntime` membership.
- **Changes:** `runtime/graph-runtime.ts`.
- **API delta:** none.
- **Evidence:** `test/integration/single-owner.test.ts`, which P3-04 already names and which does not exist, written now to cover one clock subscription across several mounts, plus the new assertion that an unmounted node does not publish on tick.
- **Exit:** P3-04's named evidence exists and is green.
- **Fixes:** F-5. **Depends:** R1. **Blocks:** R5, and unblocks P5-04 later.
- **Risk and rollback:** existing tests may implicitly rely on everything publishing by default. That is the defect, not a regression; fix the tests to mount explicitly.

### Wave 2: make the runtime real and close the boundary

#### R5 `feat/r5-engine-compose-resolver`

- **Invariant:** `Engine.load` composes through real `Track` instances and the injected `Interpolator` port.
- **Owner:** `Engine` resolves composition; `ProjectRuntime` owns track lifetime and disposal. No third owner.
- **Changes:** `engine.ts`, `runtime/project-runtime.ts`, `domain/track.ts` only if the snapshot-to-composition mapping needs a named helper.
- **API delta:** none required. Resist exporting `Track` from the public entrypoint; it is not on the P0-03 allow list and P6-01 does not plan to add it.
- **Evidence:** rewrite `test/integration/engine-headless.test.ts` to drive a two-motion project with a free track through fake ports and assert real interpolated values and advancing `sourceProgress`, not echoed node ids. Add `test/integration/project-lifecycle.test.ts`, which P3-05 names and which does not exist, covering repeated load, mount, unmount, and dispose with flat retention.
- **Exit:** no published patch contains `{ nodeId }` as its whole value payload. The P3 review's deferral is discharged and struck from that document in this PR.
- **Fixes:** F-3. **Depends:** R1, R2, R3, R4. **Blocks:** R8, P4-05.
- **Risk and rollback:** this is the largest slice in the plan and the one most likely to need recutting. If it exceeds twenty semantic files, split into R5a track construction and lifetime, R5b compose wiring and `sourceRevisions`. Do not split it by "types first," which would claim an invariant it does not establish.

#### R6 `chore/r6-core-package-boundary`

- **Invariant:** `@motion5/core` and `@motion5/core/internal` are resolvable specifiers, and `@motion5/react` imports through them only.
- **Owner:** the repository layout, plus `core/src/internal.ts` as the single unstable-surface entrypoint.
- **Changes:** new `packages/core/package.json`, new `packages/core/src/internal.ts`, root `package.json` `workspaces`, `packages/react/package.json` dependency, `packages/react/src/patch-store.ts` import rewrite, `tsconfig.json` paths if bundler resolution needs help before a build step exists.
- **API delta:** `./internal` exports `Patch`, `PatchListener`, and a new `PatchSource` interface with `get` and `subscribeNode` only. The public `.` entrypoint is unchanged, so the existing allow list is untouched. `PatchRegistry` is deliberately not exported; see F-6.
- **Evidence:** `npm run typecheck` resolves with zero relative cross-package imports, and `test/unit/scripts/boundary-scan.test.ts` gains a planted consumer-leak fixture that fails.
- **Exit:** P4-03's stated exit condition, "`@motion5/core` imports only the public core surface," is met for the first time.
- **Fixes:** F-6. **Depends:** nothing technically, but land after R5 so the internal surface is designed against a runtime that actually publishes values. **Blocks:** R7, P4-05.
- **Risk and rollback:** `moduleResolution: "Bundler"` with no build step may not resolve workspace `exports` under `tsc --noEmit`. Mitigation: verify locally before opening; fall back to `paths` mappings and record that as the reason, since P4-05 will replace it with a real build anyway.

#### R7 `fix/r7-boundary-scan-coverage-and-self-test`

- **Invariant:** the boundary gate scans consumers and the whole of core, and its planted-violation suite exercises the shipped script rather than a copy of it.
- **Owner:** `scripts/boundary-scan.mjs` becomes an importable module with a thin CLI wrapper.
- **Changes:** `scripts/boundary-scan.mjs`, `scripts/boundary-scan-fixtures.js`, `packages/core/test/unit/scripts/boundary-scan.test.ts`.
- **API delta:** none public. The script exports its predicates and a `scan()` returning violations.
- **Evidence:** the test imports every predicate from the script and holds no local copies. One new case runs the real `scan()` over a planted temporary tree containing a consumer reaching into `core/src` and asserts a non-empty result, which covers glob scope and not just regex text.
- **Exit:** deleting a rule from the script turns the suite red. Verify this by hand before merging; it is the entire point of the slice.
- **Fixes:** F-7, F-8. **Depends:** R6, so the consumer rule has a legal alternative to point at. **Blocks:** nothing.
- **Risk and rollback:** widening the scan to `ports/` and `engine.ts` may surface pre-existing violations. If it does, that is a finding and gets its own PR rather than a widened allow list.

### Wave 3: adapters and truth

#### R8 `feat/r8-dom-adapter-target-resolution`

- **Invariant:** the DOM adapter resolves a target per patch, writes only changed keys, and never mutates a patch it receives.
- **Owner:** `adapters/dom.ts`, plus a new writer port so core stays engine-free.
- **Changes:** `adapters/dom.ts`, new `ports/writer.ts`, a GSAP-backed writer beside `adapters/interpolator/gsap.ts`, `test/contract/adapters.test.ts`.
- **API delta:** the writer port joins the injected-capability set. Whether it is asserted at the `Engine` constructor like the other three is a real decision; if yes, it needs an `assertWriter` for symmetry with P0-04.
- **Evidence:** `test/integration/dom-patch-apply.test.ts`, which P4-02 already names and which does not exist. Cover per-node target resolution, internal-key filtering, dirty-key diffing, key removal emitting `undefined`, blocked and error patches applying nothing, patch immutability after apply, and target release on teardown.
- **Exit:** P4-02's named evidence exists, and no DOM or engine import appears outside `adapters/`, confirmed by the now-wider R7 scan.
- **Fixes:** F-9. **Depends:** R5, R7. **Blocks:** P4-05.
- **Risk and rollback:** scope creep into a transform composer. Mitigation: the writer port hands values to the engine exactly as motionpath did; if a PR in this slice starts serializing transforms by hand, it has gone wrong.

#### R9 `docs/r9-status-and-plan-truth-pass`

- **Invariant:** no document claims a gate, module, or behavior that does not exist.
- **Owner:** `README.md`, `docs/IMPLEMENTATION-PLAN.md`, `docs/SESSION-STATUS.md`, `docs/PHASE-3-IMPLEMENTATION-REVIEW.md`.
- **Changes:** documentation only. No source, no tests.
- **API delta:** none.
- **Evidence:** none claimed. This slice asserts no runtime invariant and must not pretend to, per the same rule P0-06 applied to itself.
- **Exit:** every evidence filename in the plan resolves to a file that exists, or has been struck with a note naming what covers the requirement instead. The README status paragraph and the install-fallback paragraph are correct. The `graph/normalize.ts` and `graph/validate.ts` collapse into `ir.ts` is recorded. The reentrancy guard is either implemented in an earlier PR or its claim is withdrawn. The advisory-budget expiry of 2026-08-17 is restated with a decision.
- **Fixes:** F-11. **Depends:** R1 through R8, since each writes the evidence file its own requirement names. **Blocks:** nothing.
- **Risk and rollback:** none. Documentation only, per the formatting-separate-from-behavior rule.

### Sequencing

```text
Wave 1        R1 --> R2 --> R5
               |      |      ^
               +----> R3 ----+
               |             |
               +----> R4 ----+

Wave 2        R5 --> R6 --> R7
                      |      |
Wave 3                +--> R8 <--+
                             |
                             v
                            R9
```

R1 is the only PR with no dependency and should open first. R2, R3, and R4 are independent of each other and may be reviewed in parallel, but R2 touches the same file as R1 and should merge after it to avoid a conflict that hides a semantic change. R5 is the integration point and the largest risk. R6 and R7 are a pair; do not merge R6 without R7 following, or the leak closes without a gate to keep it closed.

### The in-flight P4-03/P4-04 branch

`feat/p4-03-04-react-consumer-boundary` currently fails its own stated exit condition, because `patch-store.ts` imports `core/src` internals. Three options:

1. **Hold it, land R6 first, rebase.** Cleanest. The branch's exit gate is met on merge and the diff stays honest.
2. **Fold R6 into it.** Defensible, since the branch introduced the leak, but it makes a consumer-boundary slice also a packaging slice, which is two invariants in one PR and violates the delivery rules.
3. **Merge as-is with the leak documented.** Do not. This is the shortcut that becomes expensive once a second package depends on it, which is the one thing the external review and this document agree on completely.

**Recommendation: option 1.**

## 6. Pull request body template

Every remediation PR uses the existing six-part body from [PR-WORKFLOW.md](./PR-WORKFLOW.md), with one addition. Reference the finding id so the review trail survives.

```text
## Invariant
What is now guaranteed, in one checkable sentence.

## Findings addressed
F-n from docs/PHASE-4-IMPLEMENTATION-REVIEW.md.

## Evidence
The named test that fails without this change, and the CI job that runs it.

## Ownership
Which object gained or lost responsibility, and why no second owner exists.

## Public surface
Changed exports, schema, or types. State "none" explicitly.

## Deletions
Code, tests, docs, or flags removed.

## Status
The SESSION-STATUS.md update in this same change.
```

Commit scopes follow the existing convention: `fix(runtime):`, `feat(adapters):`, `chore(build):`, `docs(status):`. Formatting never shares a behavior commit.

## 7. Process finding

The eleven findings share one cause, and fixing them without fixing it means writing this document again at Phase 5.

The plan's own rule is unambiguous: *"A slice with no failing-first test is not a slice."* Every slice from P3-02 to P4-02 named its evidence file in the plan and merged without it. The evidence names were treated as a description of intent rather than as a merge condition, and because the named files never existed, nothing in CI noticed. The suite is green over the code that was written, and silent over the code that was not.

This is cheap to close mechanically, and it is the highest-leverage change in this document.

**Proposal, to land with R9 or as its own chore slice:** a script that parses every `**Evidence:**` line in `IMPLEMENTATION-PLAN.md`, extracts the referenced test paths, and fails when a slice marked done names a file that does not exist. Run it in the `quality` job. It is roughly the same shape as `boundary-scan.mjs` and inherits the same rule from ADR-008: it needs its own planted-violation fixture, and per F-8, that fixture must exercise the shipped script.

The project already decided that import rules should be mechanical instead of cultural. Evidence rules deserve the same treatment.

## 8. Decision required

Three calls are needed before Wave 1 opens, and none should be settled in a PR comment.

1. **F-9 scope.** Ship the DOM adapter in R8, or declare it a stub with an ADR and a named slice. Recommendation: ship it, because P4-05's end-to-end gate has nothing to drive otherwise.
2. **F-6 surface.** Confirm that `PatchRegistry` stays unexported and consumers receive a two-member `PatchSource` instead. Recommendation: confirm, because exporting the class creates a second publication owner and P6-01 already bans it from the public surface.
3. **Phase 4 status.** Phase 4 cannot be declared complete on this tree. Either Wave 1 and Wave 2 land inside Phase 4 and the phase closes honestly, or Phase 4 closes now with F-1 through F-5 recorded as known defects carried into Phase 5. Recommendation: the former, because F-5 pre-breaks P5-04 and the debt compounds against the exact slice that comes next.
