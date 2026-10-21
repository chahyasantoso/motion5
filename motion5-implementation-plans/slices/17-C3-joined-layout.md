# C3 — Derive joined topology once per structural revision

Status: not implemented. Depends on: C1, C2, B5.

## Start here

Read `00-overview.md`, chain descriptors from C2, the C1 derivation API, and `packages/plugins/src` topology helpers reached from `ik-topology.ts`. Use the plugins package as sole assembly owner; core supplies validated source bindings.

## Outcome and work

Derive a built-in joined source from one/more join entries plus optional single root entry. Each join binds one required scalar chain source and optional scalar parent chain source. All input chains must be nonempty CHAIN capabilities, not joined sources, and must have NO root entry—even bound origin roots. Reject rooted imports rather than discarding transforms.

Exactly one join has no parent and it must be the first JOIN entry, ignoring root-plugin position. Every other parent must match a chain used by an earlier join. A chain source appears only once. Point IDs cannot overlap across chains. A link's outer entry ID is separate from its point IDs and parent source identity.

Attach the first point of each child chain to its parent's final point. Build a resolved parent-first point layout, source locators, safe index, child adjacency, unique topology root, and leaves. Prove reachability and exactly one parent for each non-root point. Keep authored participating chain/point order; references/indices avoid repeated point-data copies.

Ownership under the plugin structural API (ADR-142 D3, D5, D6, D8):

- Each join's `chain` and `parent` slots declare `capability: "chain"`, so a bound source without `chain` (an empty or root-only track, a joined source, a generic track) is refused by the core presence check with `derivation-missing-capability` before any join hook runs.
- `join.validate` owns the remaining requirement-payload refusals, chiefly a rooted imported chain read through `ctx.read("chain", source).rootPolicy` under rule id `skeleton-imported-chain-has-root`, which this slice adds to `packages/core/src/contract/rule-id.ts` and the rule registry in `packages/core/src/contract/rule.ts`.
- Core groups entries by plugin (`groupEntriesByPlugin` in `packages/core/src/domain/structural-derivation.ts`), so `join.validate` and `join.derive` run once per track over all of that track's join entries, not once per entry. Write them as whole-track functions.
- `join.derive` owns joined topology and reads the joined track's own root through `readRootPolicy`, returning `none` for a refused policy so the duplicate-root diagnostic from `root.derive` appears once.
- A track that mixes join entries with point entries, or with any entry that is neither join nor root, is not a joined source: `join.derive` returns `none`, exactly as `chain-layout.ts` already does for a mixed chain track. Consumers bound to it then report `derivation-missing-capability`. This is a tested rule, not an accident of iteration order.
- Keep the space-specific names (point and root plugin names, the `chain`/`joined` capability names and the record reader) in one spec object, for example `SKELETON_2D`, passed to the topology helpers, and fold C2's hard-coded names into it. G2 then adds a 3D spec without forking topology code. Numeric reading stays outside the spec.
- The plugins package augments `CapabilityMap` with `joined`; `join` declares the link-record
  `collect` seam. C3's `LocalEvaluation` exposes no bindings or source IDs, so D2 populates dynamic
  link records.

Carry only the joined source's external-root binding/provenance. Root may occur anywhere, but duplicate root entries refuse through `root.derive`. Re-derive on structural bindings/order changes; never rebuild during join collect or readSkeleton ticks. No nested tree imports, qualified member manufacture, mid-chain attachment, or instancing.

## Evidence and finish

Run canonical torso/two-arms topology tests plus each minimal refusal: no/multiple/root-not-first topology links; missing/forward parent; duplicate chain; empty/rooted/non-chain source; cross-chain duplicate member; duplicate frame root; a join track that also holds a point entry or an unrelated entry derives nothing; root at arbitrary positions accepted. Add a `skeleton-imported-chain-has-root` case to `packages/core/test/contract/rule-registry.test.ts`. Numeric source updates preserve structural identity in the same runtime.

Done when C4/C5 can consume one resolved tree without separate per-tick chain-versus-join parent algorithms, and the rule id exists in `rule-id.ts`, the registry and its test. Record actual source paths, tests/results, and deterministic public/layout ordering. Next: C4.
