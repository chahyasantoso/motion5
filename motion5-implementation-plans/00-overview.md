# Motion5: consolidated skeldata implementation plan

Status: living implementation contract. Phases A–B and slices C1–C2 are implemented on branch `feat/plugin-structural-api`, including the plugin structural API follow-up (ADR-142); C3–G8 and F1–F6 remain planned. Per-slice evidence lives in each slice status line and `docs/skeldata/STATUS.md`.
Date: 2026-10-16, reconciled with the code on 2026-10-20. Scope: breaking v5 replacement, 2D and 3D skeletons, generic injectable FK/IK caches. Revised on 2026-10-20 for the refine review (legacy bridge, entry keys, disposal) and a 3D migration phase G.

## 1. How to use this pack

This pack contains this overview, 49 numbered implementation slices (A1–G8, then F1–F6), the shared reference `cache-contract.md`, and `CACHE-REVISION.md`. The cache contract is an appendix to read early, **not** a later implementation slice. Plugin structural API decisions D1–D8 are recorded in `motion5-plugin-api-decisions.md` and `../docs/ADR-142-plugin-structural-api.md`; where older slice wording disagrees with them or with the code, the decisions and the code win. Start a session with the repository, this file, ONE slice, and any shared reference it explicitly requires. Do not load historical proposals or every prior slice. Read `AGENTS.md`, scoped sources and prerequisite evidence in the actual checkout; expand reads along relevant imports or failing tests.

Paste: “Implement only the attached slice under 00-overview.md and its referenced shared contracts. Verify prerequisites in this checkout, inspect scoped sources, write focused tests, implement, and report actual commands/results and remaining blockers. Do not implement future slices or invent compatibility.”

Default execution is filename order 01–49: phase G (files 36–43) runs after E and before F (files 44–49), because F's caller rewrite, deletion and release gate assume every plugin, adapter and app has migrated. Dependencies mean implemented behavior/artifacts, not that a plan file exists; report missing prerequisites instead of guessing interfaces. Parallel work requires fixed shared interfaces. Finish sessions with changed paths, decisions, tests, evidence SHA and next unresolved issue. Keep a small `docs/skeldata/STATUS.md` index; full evidence belongs in normal PR/run records. Existing status is not proof by itself.

Slices start unimplemented and each carries a status line; an implemented status names its evidence suites. Completion requires actual positive, negative, type and failure evidence as applicable. A coordinated feature branch can be temporarily incomplete; never weaken protected-branch gates or add a compatibility layer to manufacture intermediate green states.

## 2. Precedence and deliberate reconciliations

This overview is the normative hybrid, extended by the shared cache contract. It is not a request to implement all historical alternatives.

- Keep skeldata's chain/join topology, precommit derivation, anchored first point, rotations/poses maps, per-point FK reuse, atomic editing, explicit adapters and clean break. 2D lands first (C–E); phase G migrates the 3D plugins, Three adapter, generated skeletons and apps onto the same contract before F.
- Import PlanX's singleton-map arrays, an authored ID for EVERY entry, independent collect/fold operations, delta folds and separate frame-root plugin.
- Remove singleton-versus-collectable entry modes and un-ID'd transform/IK/FK exceptions. Repetition is legal for all admitted definitions.
- Root lives on the skeleton source. IK/FK have NO independent base slots; animated root changes reach both from that ordinary source.
- Do not import alternative rig/members/pose transport, virtual solver root, qualified public point IDs, tree plugin, root slots on joins, 3D bridge/port, converter, stage/priority ordering, replacement-state folds or a collect/fold/both mode tag.
- 3D is migrated, not retired or deferred, and gets no bridge or converter. Shared factories parameterized by a skeleton-space spec build a per-space plugin family: `point`/`root`/`join` (capabilities `chain`/`joined`) and `point3d`/`root3d`/`join3d` (`chain3d`/`joined3d`). Distinct capability names make core's presence check refuse cross-space wiring. Numeric math stays per dimension; traversal, cache and topology helpers are generic (D1, ADR-143).
- Keep schemaVersion 5 but one new dialect only: no old-object normalizer, flat `{plugin,id}` entries, aliases, dual runtime, legacy flags or required old-path parity. Reject retired syntax clearly. Source control is rollback. One exception, deleted by F2: from C7 the runner executes not-yet-migrated compose plugins through a temporary `legacy-compose` execution strategy with per-plugin parity tests, and C6 quarantines the legacy kinematic channel (members injection, `solverChain`, `solves`, kinematic slot names and constants) behind one `isLegacyComposeDefinition` predicate (ADR-143).
- Cache support is generic and injected, not an FK-only state convention: one cache port/provider contract, one existing acceptance boundary, plugin-owned effective keys. FK per-point reuse and IK whole-solve memoization are consumers, not core classifications. No-cache is a supported provider, not a legacy code path.

## 3. One authored shape and identity model

```json
{
  "id": "arm",
  "keyframes": [
    { "upper": { "plugin": "point", "values": { "length": 20 } } },
    { "fore": { "plugin": "point", "values": { "length": 10 } } }
  ]
}
```

Each array item has exactly one own string key: its nonempty, track-unique entryId. The inner record has plugin, optional values and optional requires; no inner id/kind/operations/ordering field or authored cache configuration. Omitted/empty values are legal for dependency-only operations. Empty/omitted track keyframes are generic empty tracks, not skeleton sources. Reject sparse arrays, multi-key maps, unknown sections/plugins/leaves/slots, invalid bindings and duplicate IDs. Separate shape validation from admission/resolution; retain supported static/scalar and stop-array leaf syntax.

The array is a list of instances, not chronological samples. Animation stops live inside leaves; entries do not appear/disappear as time changes. Reordering is structural and changes chain order. Plugin replacement is structural and revalidates content. Remove/reinsert creates a new generation.

Keep plugin name, authored entry ID, compiler entry key, runtime generation, member ID, leaf path, output port, source node and render target distinct. Point member ID equals its outer entry ID; a join ID identifies a link, not a point/source. Point IDs are unique across a resolved skeleton; link IDs use a separate namespace. Separate rigs may reuse point IDs; no chain instancing/automatic qualification.

Reserve slash and colon in entry/plugin/leaf codec components and retain stricter existing identifier rules. Use safe Maps/null-prototype records/own-data-property writes for permitted IDs such as **proto**. Centralize collision-free private tuple encoding. Handles capture runtime/entry generation, never position or ID alone. Cache slots are local to generation-owned private tables, not another public/global identifier space.

## 4. Generic collect/fold and stateful plugin contract

A definition declares collect, fold or both, never neither. Remove top-level compose/outputs/stage/priority (still present as legacy fields until F2). Retain relevant leaf key ownership, serializers, requirements, entry-local contribution hooks, the `validate`/`derive` structural hooks and the stateful `init`/`prepare` pair. Audit old inputs metadata before removing it.

- `collect` is a function returning exactly one renderer-neutral record, not an array/wrapper. It declares no output label: records publish under the reserved `collect` output (`COLLECT_OUTPUT`). Core rejects an own id, stamps id = entryId, and appends in participating-entry order.
- Stateless fold declares outputs and a run callback receiving local evaluation plus preceding fold state. It returns a top-level DELTA. Own keys must be declared; safe-merge them. Omission preserves prior fields, nested objects replace as a whole, and no deletion value exists. Undefined/null/non-finite unsupported values refuse publication.
- A definition is stateful when it declares `init` and `prepare`; otherwise it is stateless. There is no evaluator factory and there are no operation claims: `collect` and `fold.run` are always functions on the definition. `PluginDefinition` is the `StatelessPluginDefinition | StatefulPluginDefinition` union, and the compiled `ExecutionStrategy` is the `stateless | stateful` union consumed by an exhaustive switch (from C7 until F2 it has a temporary third kind, `legacy-compose`, so one runner serves every definition). This distinction is not a collect/fold/both mode.
- All collect records on a track append to `collect` in entry order. Fold+fold sharing an output applies authored-order per-field last-write-wins. A fold may not claim `collect`; admission refuses a fold output with that name. Shared names route data; they do not prove payload compatibility.
- Each entry gets immutable local values, scoped inputs and context with node/entry/compiler instance/progress. Collect runs before fold when both exist. Fold sees preceding FOLD state only, never collections or its own collect result. Collect sees neither fold state nor collections. Contributions affect their own entry only.
- Start collections/fold state empty per evaluation. Publish one combined frozen result only after all operations and validation succeed. Do not blanket-copy local authored leaves into outputs. No implicit same-track solve/collection/sibling handoff; completed records travel through cross-track requirements.

Stateless callbacks remain pure. A stateful plugin is authored with `defineStatefulPlugin<S, P>({ init(ctx, services), prepare(entry, state, services), dispose?(state), collect?(prepared, ctx), fold?: { outputs, run(prepared, prior, ctx) } })`. `EvaluatorServices` carries the injected generic cache provider. Per entry, core reads committed state or calls `init` once (undefined state is a TypeError), calls `prepare` once to get one immutable `prepared` value plus a state, runs `collect` on `prepared`, then `fold.run` on `prepared` plus prior fold state; fold may return `{ delta, state }`, and a returned state wins over prepare's. One final opaque state proposal per entry is staged. Prepare cannot read fold/collection state. No hidden collect-to-fold callback history or second invocation of callbacks.

Committed state is per runtime/track/entry generation, never on a shared definition, and is keyed by `CompilerEntryKey` only. `dispose` runs once per entry generation, not per state value: after a commit, dispose the last committed state of every key the accepted candidate did not continue; on abandonment, dispose only states `init` created in that candidate (C7, LIFECYCLE §4.3). Cache snapshots are immutable proposed state: pure lookup, copy-on-write remember, bounded storage. Core accepts ready output and all private-state proposals only at A6's existing transaction boundary; failure discards proposals. No arbitrary commit callbacks, rollback mutation lists, global maps, service locator or automatic memoization of callbacks/fold deltas.

One track timeline/graph vertex remains. Entry-local private interpolation addresses cover static/animated leaves, contributions, stops, percent maps and overlays. Requiredness/cardinality come from declarations, never slot spelling. Graph edges retain destination entry/slot/dict key even when adjacency deduplicates sources.

## 5. Skeleton and root contract

Built-in roles:

- point collects point records under `collect`: current local numeric data only; no requirements/world solve/frame math. Its `derive` produces the `chain` capability.
- join collects link records under `collect`: required scalar chain, optional scalar parent. Dynamic items carry current chain points and optional compiled attachTo; core stamps link ID.
- root folds root: optional scalar `frame` slot with no capability (D7); the frame is a runtime value read through `readFrame`, not a structural capability. No point-array conversion. Its delta is `{root: frame}`. At most one root entry per track; `root.derive` refuses duplicates during derivation (`derivation-failure`) even with distinct IDs.
- ik folds rotations and optional inspection: required skeleton and nonempty targets dict; options stay local unless declared outputs. It consumes the injected cache for complete solves.
- fk folds poses: required skeleton and optional scalar solver; never reads same-track fold rotations. It consumes the same cache port for per-point composition.
- The 3D family mirrors these roles: `point3d`, `root3d` and `join3d` built from the same factories with the `SKELETON_3D` spec; `fk3d` folds `poses` of 3D tip frames, `ik3d` folds `rotations3d` with a targets dict and an optional `pole` runtime frame. `rig` folds `poses` too, and one decoder reads poses from either (G1–G5). A track mixing 2D and 3D skeleton entries derives nothing; same-family duplicates across spaces are refused.

A chain source has one or more point entries and at most one root. A joined source has one or more joins and at most one root. A root-only track is a legal generic track with no `chain`; FK/IK bound to it are refused by core with `derivation-missing-capability`. Other mixed tracks are generically legal but do not automatically become skeleton capabilities.

Root is the external FRAME, distinct from the topology root point/link. It may occur anywhere in the source array. Consumers read it from the source's completed staged record, not intermediate fold state; absence means origin. The first JOIN is the topology root, ignoring root-plugin position. Exactly one join lacks parent; other parents name a chain used by an earlier join. Chains are nonempty; sources cannot repeat; point IDs cannot overlap; child first points attach to parent-chain tips. No mid-chain attachments or nested joined sources as chains.

An imported chain must have NO root entry, even one currently at origin. Refuse rooted imports structurally rather than dropping/doubling root. Rooted chains may be consumed directly by IK/FK. To import one, remove root or author a separate local chain. The joined source's root is the sole external frame. Root binding changes are structural; numeric root animation is not topology.

Example wiring (source strings are free-track references):

```text
body: transform entry -> {x,y,rotation}
torsoPts: point entries pelvis,chest -> collect
leftPts: point entries lUpper,lFore -> collect
rightPts: point entries rUpper,rFore -> collect
rig.keyframes = [
  {world: {plugin:"root", requires:{frame:"~/body"}}},
  {trunk: {plugin:"join", requires:{chain:"~/torsoPts"}}},
  {left: {plugin:"join", requires:{chain:"~/leftPts",parent:"~/torsoPts"}}},
  {right:{plugin:"join", requires:{chain:"~/rightPts",parent:"~/torsoPts"}}}
]
solve: {solve:{plugin:"ik", requires:{skeleton:"~/rig",
        targets:{lFore:"~/goalL",rFore:"~/goalR"}}}}
pose: {pose:{plugin:"fk", requires:{skeleton:"~/rig",solver:"~/solve"}}}
```

The final two lines are entry-map fragments for keyframes arrays, not full documents. Targets are ordinary frame producers. Bare motion-local references retain existing qualification rules, not free-track shorthand.

## 6. Derivation, math and generic memoization

Plugins derive immutable parent-first layouts, ID lookup, parents/children/leaves, source locators, layout identity and root-binding provenance once per structural candidate. A narrow generic hook reads validated own-track declarations and descriptors of explicitly bound sources in existing graph order. Track-local operation inventory supports plugin-owned checks; no sibling runtime output or registry iteration dependency. Core transports opaque descriptors/capabilities without interpreting skeletons or slot names. Lookalike arrays are not valid sources without capabilities. readSkeleton reads the source's `collect` records, interprets them through the bound capability (`chain` or `joined`), binds them to descriptors without topology rediscovery, and refuses stale source identity and corrupt IDs/payloads.

IK anchors the first point's TIP from the external root and authored values; it does not solve/target that point. Require a non-root point and exactly one goal per non-root leaf; refuse unknown/root/non-leaf goals. FK and IK both need a skeleton source with points; a root-only track has no skeleton capability, and a one-point chain has no IK solve member. Reuse existing deterministic math/convergence/inspection policies. Built-in IK/FK bind the same canonical skeleton/layout/root provenance, not merely equal numbers. Custom solves declare matching provenance; valid partial maps may omit members, but foreign/non-finite rotations refuse.

2D units are degrees, screen +x right/+y down, clockwise positive. Offsets/rotation/length default zero; missing frame fields use shared reader defaults, absent whole root is origin, extent is nonnegative, weight defaults one and clamps [0,1]. Missing solved angle uses authored rotation. Preserve shortest-arc blending, exact endpoint numbers and deterministic half-turn tie. Apply pivot in parent frame, then extension along local +x. A3 pins limit/influence policies, tolerances, supported finite domain and overflow refusal from source. Normalize only as specified; never invent topology. Exact numeric/key/frame comparison uses Object.is, preserving +0/-0 distinction and JavaScript arithmetic results; no epsilon/rounding skips or non-finite stored results.

FK returns poses mapping point IDs to TIP frames `{x,y,rotation}`. Retain a simple uncached new-contract oracle and independent geometry regressions. Through the injected provider, memoize each point's effective parent frame, normalized pivot/extent/blended angle under the stateful plugin state's structural generation. Reuse exact unchanged tips and retain an old frame when recomposition is exactly equal. Stage cache snapshots with poses. Initial cost is O(N) checks + O(K) math, not O(K) overall.

IK builds one canonical immutable request from actual normalized solver inputs, including anchored root, ordered members/links/constraints/influences/goals and consumed options/seeds. Use the same request for key equality and math, with source/layout/solver identity in the generation contract. Memoize the **whole validated SolveResult**, including quality/residual data; project inspection after lookup. No per-member independence assumption, previous-result warm start, failed-result memo, or reuse of an entire previous fold delta. Complete key and inspection requirements are in the cache contract and D4.

Provider selection belongs to application/runtime construction, not authoring. Default bounded immutable, disabled and conforming alternative providers must preserve accepted meaning. The port is generic; a non-kinematic plugin must prove it. Keep keys/validation in adapters, storage in providers, mathematics cache-free and atomic acceptance in core. Cold-reset structural/rebound generations; no cache migration. Measure key construction/equality, copies, validation/publication, IK and rendering, not only saved trigonometry.

## 7. Editing, rendering and failure

Entry handles edit leaves, requirements and replacements. Track insert/move/remove address entries; generation-backed handles refuse after remove/reinsert. Moves preserve identity/overlays, but rebuilt execution/layout can start plugin state cold. All public value batches are entry-nested, e.g. `setValues({fore:{length:22},frame:{x:10}})`; no singleton shortcut or exposed codec. Live writes/batches use the same value transaction owner. IDs/order/plugins/bindings/dict member keys are structural, never scalar leaves.

Apply whole structural recipes privately; compile/derive/evaluate/validate the complete final candidate, then accept once. Invalid intermediate states are allowed; invalid final states are not. Precommit failures preserve authoring, values, outputs, handles, bindings, subscriptions and every committed plugin/cache state. Failed proposals cannot mutate entries or eviction order. Dispose candidate resources; retire active resources only after success. Provider exceptions are preparation/evaluation failures, not silent misses. Postcommit subscriber/adapter exceptions are delivery errors, not fictitious external rollback.

Adapters explicitly bind track/member/target and fan poses out through existing filter/diff/writer code. Never auto-render nested points/links/root/poses/rotations/inspection. Reject competing transform ownership initially. Revisions are per binding, not globally comparable; initialize newly bound targets even for unchanged pose. Cleanup releases only owned fields/resources, not user elements or replacement-owned fields. React selects explicit poses; no per-point selector graph required.

## 8. Scope, verification and execution index

Migrate, do not retire, the 3D surface: `transform3d` (G1), the 3D skeleton family (G2), `fk3d` (G3), `ik3d` (G4), `rig` and `pose-classify` on one `poses` contract (G5), Three pose-member bindings on the shared binding module (G6), `skeletonTracks` generating new-contract skeletons and `poseFrameSource` (G7), and the apps and playgrounds (G8). No 3D bridge, converter or deferred flag. F1 rewrites the remaining package callers and F2 deletes only what no migrated surface uses.

Evidence groups: repeated-entry/provider isolation; valid topology; independent geometry/solve guarantees; cached/disabled/history equivalence for FK AND IK; atomic edits/failure injection; renderer ownership/rebinding; generic non-kinematic clients and no core kinematics on the new path (the legacy channel stays quarantined until F2). Tests target the new contract, not retired patch parity; the only exception is C7's temporary `legacy-compose` parity tests, each deleted by the slice that migrates its plugin. Benchmarks use 20/200-point chains/trees for cold/idle/local/goal/root/full-animation/structural cases with provider variants.

Execution index (filename order 01–49 is the run order; G precedes F):

- A: [A1](slices/01-A1-contract.md), [A2](slices/02-A2-identity.md), [A3](slices/03-A3-numerics.md), [A4](slices/04-A4-fixtures.md), [A5](slices/05-A5-deletions.md), [A6](slices/06-A6-lifecycle.md).
- B: [B1](slices/07-B1-authoring.md), [B2](slices/08-B2-execution-plan.md), [B3](slices/09-B3-leaf-codec.md), [B4](slices/10-B4-preparation.md), [B5](slices/11-B5-requirements.md), [B6](slices/12-B6-operations.md), [B7](slices/13-B7-staged-state.md), [B8](slices/14-B8-value-writes.md).
- C: [C1](slices/15-C1-derivation.md), [C2](slices/16-C2-chain-layout.md), [C3](slices/17-C3-joined-layout.md), [C4](slices/18-C4-solve-bindings.md), [C5](slices/19-C5-dynamic-reader.md), [C6](slices/20-C6-generic-core.md), [C7](slices/21-C7-candidate-acceptance.md).
- D: [D1](slices/22-D1-frame-math.md), [D2](slices/23-D2-producers-root.md), [D3](slices/24-D3-reference-fk.md), [D4](slices/25-D4-ik-adapter.md), [D5](slices/26-D5-cached-fk.md), [D6](slices/27-D6-cache-lifecycle.md), [D7](slices/28-D7-pipeline.md).
- E: [E1](slices/29-E1-entry-handles.md), [E2](slices/30-E2-atomic-batches.md), [E3](slices/31-E3-live-updates.md), [E4](slices/32-E4-pose-bindings.md), [E5](slices/33-E5-dirty-revisions.md), [E6](slices/34-E6-binding-lifecycle.md), [E7](slices/35-E7-consumers.md).
- G: [G1](slices/36-G1-transform3d.md), [G2](slices/37-G2-skeleton-space.md), [G3](slices/38-G3-fk3d.md), [G4](slices/39-G4-ik3d.md), [G5](slices/40-G5-rig-poses.md), [G6](slices/41-G6-three-bindings.md), [G7](slices/42-G7-skeleton-tracks.md), [G8](slices/43-G8-apps.md).
- F: [F1](slices/44-F1-callers.md), [F2](slices/45-F2-remove-retired.md), [F3](slices/46-F3-documentation.md), [F4](slices/47-F4-performance.md), [F5](slices/48-F5-adversarial.md), [F6](slices/49-F6-release-gate.md).
- Shared cache reference: [cache contract](cache-contract.md); [revision guide](CACHE-REVISION.md). Read these before the dependent slices, not after F6.

Phase gates are cumulative: A fixes contracts; B proves generic entry/state/cache isolation and DI; C protects precommit structure; D proves solve/pose math and both caches; E proves edit/render lifecycle; G proves the 3D family, Three bindings, generated skeletons and apps on the same contract; F removes leftovers, including `legacy-compose` and the quarantined channel, and verifies the exact candidate. A phase gate is not an overall speed claim.

## 9. Source receipt and evidence limits

The 2026-10-20 revision applied the `refine.txt` review (legacy-compose bridge, C6 quarantine, compiler-key state maps, per-generation disposal, join-track scoping, discriminated `readAny`, augmentable `EvaluatorServices`, rule-id registration) and added phase G; ADR-143 records it. No code or tests were run for it.

Historical inputs were the skeldata 41-slice backbone/clean-break/background plans and selected PlanX operation/ordered-refactor refinements, not its tree supplement. They are not required session inputs.

For this revision, `motion5-main.zip` was inspected. ZIP comment: c14ec4251a5006bbfc7786c75393caeb194a9331; this is not an independently checked Git checkout. Its SHA-256 is b541c39a42a02f2e33eb19f0d1c6c726200b525a26463addb4e5634e468b18bc, matching the original pack's historical source receipt. Input `motion5-skeldata-planx-implementation-plans.zip` SHA-256: 20bcc920e655af42539c7f1d3368643d3ab094f344b3f58349c8b0317e05bc68. Paths are snapshot starting points, not guaranteed future paths or a complete patch map. New docs/skeldata files remain proposed artifacts.

The snapshot requires Node >=24; npm run check invokes raw-template scan, format check, typecheck, then npm test (vitest run). Discover other actual checkout build/boundary/app gates. No dependency installation, repository tests, benchmarks, browser/GLB checks or release is claimed by this planning revision; implemented slices cite their own evidence. Final reports must distinguish code written, checks executed/passed, performance measured and merged/released. Plan-pack archive validation is not runtime verification.
