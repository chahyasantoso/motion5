# C3 — Derive joined topology once per structural revision

Status: not implemented. Depends on: C1, C2, B5.

## Start here

Read `00-overview.md`, chain descriptors from C2, the C1 derivation API, and `packages/plugins/src` topology helpers reached from `ik-topology.ts`. Use the plugins package as sole assembly owner; core supplies validated source bindings.

## Outcome and work

Derive a built-in joined source from one/more join entries plus optional single root entry. Each join binds one required scalar chain source and optional scalar parent chain source. All input chains must be nonempty CHAIN capabilities, not joined sources, and must have NO root entry—even bound origin roots. Reject rooted imports rather than discarding transforms.

Exactly one join has no parent and it must be the first JOIN entry, ignoring root-plugin position. Every other parent must match a chain used by an earlier join. A chain source appears only once. Point IDs cannot overlap across chains. A link's outer entry ID is separate from its point IDs and parent source identity.

Attach the first point of each child chain to its parent's final point. Build a resolved parent-first point layout, source locators, safe index, child adjacency, unique topology root, and leaves. Prove reachability and exactly one parent for each non-root point. Keep authored participating chain/point order; references/indices avoid repeated point-data copies.

Carry only the joined source's external-root binding/provenance. Root may occur anywhere, but duplicate semantic root entries refuse. Re-derive on structural bindings/order changes; never rebuild during join collect or readSkeleton ticks. No nested tree imports, qualified member manufacture, mid-chain attachment, or instancing.

## Evidence and finish

Run canonical torso/two-arms topology tests plus each minimal refusal: no/multiple/root-not-first topology links; missing/forward parent; duplicate chain; empty/rooted/non-chain source; cross-chain duplicate member; duplicate frame root; root at arbitrary positions accepted. Numeric source updates preserve structural identity in the same runtime.

Done when C4/C5 can consume one resolved tree without separate per-tick chain-versus-join parent algorithms. Record actual source paths, tests/results, and deterministic public/layout ordering. Next: C4.
