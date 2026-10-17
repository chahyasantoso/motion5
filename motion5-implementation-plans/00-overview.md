# Motion5: consolidated skeldata implementation plan

Status: proposed implementation contract; no runtime implementation or repository test run is claimed.
Date: 2026-10-16. Scope: breaking v5 replacement, 2D skeletons, generic injectable FK/IK caches.

## 1. How to use this pack

This pack contains this overview, 41 numbered implementation slices A1–F6, the shared reference `42-cache-contract.md`, and `CACHE-REVISION.md`. The cache contract is an appendix to read early, **not** a later implementation slice. Start a session with the repository, this file, ONE slice, and any shared reference it explicitly requires. Do not load historical proposals or every prior slice. Read `AGENTS.md`, scoped sources and prerequisite evidence in the actual checkout; expand reads along relevant imports or failing tests.

Paste: “Implement only the attached slice under 00-overview.md and its referenced shared contracts. Verify prerequisites in this checkout, inspect scoped sources, write focused tests, implement, and report actual commands/results and remaining blockers. Do not implement future slices or invent compatibility.”

Default execution remains filename order 01–41. Dependencies mean implemented behavior/artifacts, not that a plan file exists; report missing prerequisites instead of guessing interfaces. Parallel work requires fixed shared interfaces. Finish sessions with changed paths, decisions, tests, evidence SHA and next unresolved issue. Keep a small `docs/skeldata/STATUS.md` index; full evidence belongs in normal PR/run records. Existing status is not proof by itself.

All slices begin unimplemented. Completion requires actual positive, negative, type and failure evidence as applicable. A coordinated feature branch can be temporarily incomplete; never weaken protected-branch gates or add a compatibility layer to manufacture intermediate green states.

## 2. Precedence and deliberate reconciliations

This overview is the normative hybrid, extended by the shared cache contract. It is not a request to implement all historical alternatives.

- Keep skeldata's chain/join topology, precommit derivation, anchored first point, rotations/poses maps, per-point FK reuse, atomic editing, explicit adapters, clean break and 2D-first scope.
- Import PlanX's singleton-map arrays, an authored ID for EVERY entry, independent collect/fold operations, delta folds and separate frame-root plugin.
- Remove singleton-versus-collectable entry modes and un-ID'd transform/IK/FK exceptions. Repetition is legal for all admitted definitions.
- Root lives on the skeleton source. IK/FK have NO independent base slots; animated root changes reach both from that ordinary source.
- Do not import alternative rig/members/pose transport, virtual solver root, qualified public point IDs, tree plugin, root slots on joins, 3D bridge/port, converter, stage/priority ordering, replacement-state folds or a collect/fold/both mode tag.
- Keep schemaVersion 5 but one new dialect only: no old-object normalizer, flat `{plugin,id}` entries, aliases, dual runtime, legacy flags or required old-path parity. Reject retired syntax clearly. Source control is rollback.
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

Reserve slash and colon in entry/plugin/leaf codec components and retain stricter existing identifier rules. Use safe Maps/null-prototype records/own-data-property writes for permitted IDs such as __proto__. Centralize collision-free private tuple encoding. Handles capture runtime/entry generation, never position or ID alone. Cache slots are local to generation-owned private tables, not another public/global identifier space.

## 4. Generic collect/fold and evaluator contract

A definition declares collect, fold or both, never neither. Remove top-level compose/outputs/stage/priority. Retain relevant leaf claims, serializers, requirements, entry-local contribution hooks and validated derivation/state capabilities. Audit old inputs metadata before removing it.

- Stateless collect declares an output and run callback returning exactly one renderer-neutral record, not an array/wrapper. Core rejects an own id, stamps id = entryId, and appends in participating-entry order.
- Stateless fold declares outputs and a run callback receiving local evaluation plus preceding fold state. It returns a top-level DELTA. Own keys must be declared; safe-merge them. Omission preserves prior fields, nested objects replace as a whole, and no deletion value exists. Undefined/null/non-finite unsupported values refuse publication.
- Factory-backed definitions declare the same finite operation claims, with the factory as their sole execution owner; do not require duplicate stateless run callbacks. B2/B7 type and validate exactly one execution strategy. This distinction is not a collect/fold/both mode.
- Collect+collect sharing an output appends. Fold+fold sharing an output applies authored-order per-field last-write-wins. Any collect/fold overlap refuses before evaluation, including absent optional outputs. Shared names route data; they do not prove payload compatibility.
- Each entry gets immutable local values, scoped inputs and context with node/entry/compiler instance/progress. Collect runs before fold when both exist. Fold sees preceding FOLD state only, never collections or its own collect result. Collect sees neither fold state nor collections. Contributions affect their own entry only.
- Start collections/fold state empty per evaluation. Publish one combined frozen result only after all operations and validation succeed. Do not blanket-copy local authored leaves into outputs. No implicit same-track solve/collection/sibling handoff; completed records travel through cross-track requirements.

Stateless callbacks remain pure. B7 adds an optional typed per-instance evaluator factory receiving explicit evaluator services, including the injected generic cache provider. Prepare one immutable local context from committed private state; collect reads that context, fold reads the same context plus prior fold state, and one final opaque state proposal is accepted. Prepare cannot read fold/collection state. No hidden collect-to-fold callback history or second invocation of stateless callbacks.

Committed state is per runtime/track/entry generation, never on a shared definition. Cache snapshots are immutable proposed state: pure lookup, copy-on-write remember, bounded storage. Core accepts ready output and all private-state proposals only at A6's existing transaction boundary; failure discards proposals. No arbitrary commit callbacks, rollback mutation lists, global maps, service locator or automatic memoization of callbacks/fold deltas.

One track timeline/graph vertex remains. Entry-local private interpolation addresses cover static/animated leaves, contributions, stops, percent maps and overlays. Requiredness/cardinality come from declarations, never slot spelling. Graph edges retain destination entry/slot/dict key even when adjacency deduplicates sources.

## 5. Skeleton and root contract

Built-in roles:

- point collects points: current local numeric data only; no requirements/world solve/frame math.
- join collects links: required scalar chain, optional scalar parent. Dynamic items carry current chain points and optional compiled attachTo; core stamps link ID.
- root folds root: required scalar frame supplying a validated 2D frame; no point-array conversion. Its delta is `{root: frame}`. At most one root entry on a built-in source, refused during derivation even with distinct IDs.
- ik folds rotations and optional inspection: required skeleton and nonempty targets dict; options stay local unless declared outputs. It consumes the injected cache for complete solves.
- fk folds poses: required skeleton and optional scalar solver; never reads same-track fold rotations. It consumes the same cache port for per-point composition.

A chain source has one or more point entries and at most one root. A joined source has one or more joins and at most one root. Other mixed tracks are generically legal but do not automatically become skeleton capabilities.

Root is the external FRAME, distinct from the topology root point/link. It may occur anywhere in the source array. Consumers read it from the source's completed staged record, not intermediate fold state; absence means origin. The first JOIN is the topology root, ignoring root-plugin position. Exactly one join lacks parent; other parents name a chain used by an earlier join. Chains are nonempty; sources cannot repeat; point IDs cannot overlap; child first points attach to parent-chain tips. No mid-chain attachments or nested joined sources as chains.

An imported chain must have NO root entry, even one currently at origin. Refuse rooted imports structurally rather than dropping/doubling root. Rooted chains may be consumed directly by IK/FK. To import one, remove root or author a separate local chain. The joined source's root is the sole external frame. Root binding changes are structural; numeric root animation is not topology.

Example wiring (source strings are free-track references):

```text
body: transform entry -> {x,y,rotation}
torsoPts: point entries pelvis,chest -> points
leftPts: point entries lUpper,lFore -> points
rightPts: point entries rUpper,rFore -> points
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

Plugins derive immutable parent-first layouts, ID lookup, parents/children/leaves, source locators, layout identity and root-binding provenance once per structural candidate. A narrow generic hook reads validated own-track declarations and descriptors of explicitly bound sources in existing graph order. Track-local operation inventory supports plugin-owned checks; no sibling runtime output or registry iteration dependency. Core transports opaque descriptors/capabilities without interpreting skeletons or slot names. Lookalike arrays are not valid sources without capabilities. readSkeleton binds current data to descriptors without topology rediscovery and refuses both/neither points/links, stale source identity and corrupt IDs/payloads.

IK anchors the first point's TIP from the external root and authored values; it does not solve/target that point. Require a non-root point and exactly one goal per non-root leaf; refuse unknown/root/non-leaf goals. Root-only FK is valid, root-only IK is not. Reuse existing deterministic math/convergence/inspection policies. Built-in IK/FK bind the same canonical skeleton/layout/root provenance, not merely equal numbers. Custom solves declare matching provenance; valid partial maps may omit members, but foreign/non-finite rotations refuse.

2D units are degrees, screen +x right/+y down, clockwise positive. Offsets/rotation/length default zero; missing frame fields use shared reader defaults, absent whole root is origin, extent is nonnegative, weight defaults one and clamps [0,1]. Missing solved angle uses authored rotation. Preserve shortest-arc blending, exact endpoint numbers and deterministic half-turn tie. Apply pivot in parent frame, then extension along local +x. A3 pins limit/influence policies, tolerances, supported finite domain and overflow refusal from source. Normalize only as specified; never invent topology. Exact numeric/key/frame comparison uses Object.is, preserving +0/-0 distinction and JavaScript arithmetic results; no epsilon/rounding skips or non-finite stored results.

FK returns poses mapping point IDs to TIP frames `{x,y,rotation}`. Retain a simple uncached new-contract oracle and independent geometry regressions. Through the injected provider, memoize each point's effective parent frame, normalized pivot/extent/blended angle under the evaluator's structural generation. Reuse exact unchanged tips and retain an old frame when recomposition is exactly equal. Stage cache snapshots with poses. Initial cost is O(N) checks + O(K) math, not O(K) overall.

IK builds one canonical immutable request from actual normalized solver inputs, including anchored root, ordered members/links/constraints/influences/goals and consumed options/seeds. Use the same request for key equality and math, with source/layout/solver identity in the generation contract. Memoize the **whole validated SolveResult**, including quality/residual data; project inspection after lookup. No per-member independence assumption, previous-result warm start, failed-result memo, or reuse of an entire previous fold delta. Complete key and inspection requirements are in the cache contract and D4.

Provider selection belongs to application/runtime construction, not authoring. Default bounded immutable, disabled and conforming alternative providers must preserve accepted meaning. The port is generic; a non-kinematic plugin must prove it. Keep keys/validation in adapters, storage in providers, mathematics cache-free and atomic acceptance in core. Cold-reset structural/rebound generations; no cache migration. Measure key construction/equality, copies, validation/publication, IK and rendering, not only saved trigonometry.

## 7. Editing, rendering and failure

Entry handles edit leaves, requirements and replacements. Track insert/move/remove address entries; generation-backed handles refuse after remove/reinsert. Moves preserve identity/overlays, but rebuilt execution/layout can start evaluator state cold. All public value batches are entry-nested, e.g. `setValues({fore:{length:22},frame:{x:10}})`; no singleton shortcut or exposed codec. Live writes/batches use the same value transaction owner. IDs/order/plugins/bindings/dict member keys are structural, never scalar leaves.

Apply whole structural recipes privately; compile/derive/evaluate/validate the complete final candidate, then accept once. Invalid intermediate states are allowed; invalid final states are not. Precommit failures preserve authoring, values, outputs, handles, bindings, subscriptions and every committed plugin/cache state. Failed proposals cannot mutate entries or eviction order. Dispose candidate resources; retire active resources only after success. Provider exceptions are preparation/evaluation failures, not silent misses. Postcommit subscriber/adapter exceptions are delivery errors, not fictitious external rollback.

Adapters explicitly bind track/member/target and fan poses out through existing filter/diff/writer code. Never auto-render nested points/links/root/poses/rotations/inspection. Reject competing transform ownership initially. Revisions are per binding, not globally comparable; initialize newly bound targets even for unchanged pose. Cleanup releases only owned fields/resources, not user elements or replacement-owned fields. React selects explicit poses; no per-point selector graph required.

## 8. Scope, verification and execution index

Retire/defer old fk3d/ik3d skeleton APIs/generators; retain independent 3D transforms/drivers and existing pose aggregation only where compatible. Audit apps/exports before deletion. No legacy 3D bridge. Existing rig pose aggregation is distinct from this skeleton model.

Evidence groups: repeated-entry/provider isolation; valid topology; independent geometry/solve guarantees; cached/disabled/history equivalence for FK AND IK; atomic edits/failure injection; renderer ownership/rebinding; generic non-kinematic clients and no core kinematics. Tests target the new contract, not retired patch parity. Benchmarks use 20/200-point chains/trees for cold/idle/local/goal/root/full-animation/structural cases with provider variants.

Execution index (01–41 remains the run order):

- A: [A1](01-A1-contract.md), [A2](02-A2-identity.md), [A3](03-A3-numerics.md), [A4](04-A4-fixtures.md), [A5](05-A5-deletions.md), [A6](06-A6-lifecycle.md).
- B: [B1](07-B1-authoring.md), [B2](08-B2-execution-plan.md), [B3](09-B3-leaf-codec.md), [B4](10-B4-preparation.md), [B5](11-B5-requirements.md), [B6](12-B6-operations.md), [B7](13-B7-staged-state.md), [B8](14-B8-value-writes.md).
- C: [C1](15-C1-derivation.md), [C2](16-C2-chain-layout.md), [C3](17-C3-joined-layout.md), [C4](18-C4-solve-bindings.md), [C5](19-C5-dynamic-reader.md), [C6](20-C6-generic-core.md), [C7](21-C7-candidate-acceptance.md).
- D: [D1](22-D1-frame-math.md), [D2](23-D2-producers-root.md), [D3](24-D3-reference-fk.md), [D4](25-D4-ik-adapter.md), [D5](26-D5-cached-fk.md), [D6](27-D6-cache-lifecycle.md), [D7](28-D7-pipeline.md).
- E: [E1](29-E1-entry-handles.md), [E2](30-E2-atomic-batches.md), [E3](31-E3-live-updates.md), [E4](32-E4-pose-bindings.md), [E5](33-E5-dirty-revisions.md), [E6](34-E6-binding-lifecycle.md), [E7](35-E7-consumers.md).
- F: [F1](36-F1-callers.md), [F2](37-F2-remove-retired.md), [F3](38-F3-documentation.md), [F4](39-F4-performance.md), [F5](40-F5-adversarial.md), [F6](41-F6-release-gate.md).
- Shared cache reference: [cache contract](42-cache-contract.md); [revision guide](CACHE-REVISION.md). Read these before the dependent slices, not after F6.

Phase gates are cumulative: A fixes contracts; B proves generic entry/state/cache isolation and DI; C protects precommit structure; D proves solve/pose math and both caches; E proves edit/render lifecycle; F removes leftovers and verifies the exact candidate. A phase gate is not an overall speed claim.

## 9. Source receipt and evidence limits

Historical inputs were the skeldata 41-slice backbone/clean-break/background plans and selected PlanX operation/ordered-refactor refinements, not its tree supplement. They are not required session inputs.

For this revision, `motion5-main.zip` was inspected. ZIP comment: c14ec4251a5006bbfc7786c75393caeb194a9331; this is not an independently checked Git checkout. Its SHA-256 is b541c39a42a02f2e33eb19f0d1c6c726200b525a26463addb4e5634e468b18bc, matching the original pack's historical source receipt. Input `motion5-skeldata-planx-implementation-plans.zip` SHA-256: 20bcc920e655af42539c7f1d3368643d3ab094f344b3f58349c8b0317e05bc68. Paths are snapshot starting points, not guaranteed future paths or a complete patch map. New docs/skeldata files remain proposed artifacts.

The snapshot requires Node >=24; npm run check invokes raw-template scan, format check, typecheck, then npm test (vitest run). Discover other actual checkout build/boundary/app gates. No dependency installation, runtime implementation, repository tests, benchmarks, browser/GLB checks or release is claimed by this planning revision. Final reports must distinguish code written, checks executed/passed, performance measured and merged/released. Plan-pack archive validation is not runtime verification.
