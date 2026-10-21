# E7 — Integrate retained consumers and full lifecycle

Status: not implemented. Depends on: D7, E2, E3, E4, E5, E6.

## Start here

Read `00-overview.md`, A5's consumer inventory, entry/adapter public APIs, `packages/react`, `packages/three/src/skeleton-tracks.ts`, `packages/three/src/skeleton-driver.ts`, and only apps/helpers found by actual import tracing. Do not assume Three skeleton paths survive scope changes.

## Outcome and work

Update React selection to explicit `poses[id]` or the accepted projection helper. Integrate retained generic Three/frame/driver surfaces only if they are independent of retired fk3d/ik3d skeleton membership. Preserve existing pose aggregation/classification contracts as separate products; do not reinterpret rest skeleton data as a captured world pose.

Remove/defer incompatible exported 3D skeleton generators/features and update affected callers under the 2D-first release decision. No retained helper may emit old object-form keyframes, embedded-id entries, old base/root/target wiring, per-bone solver channels, or flat singleton writes. Do not create a graph track per point solely to adapt a renderer.

Build one realistic public API scenario: load a rooted torso/two-arms rig; animate root/goals; render; value-edit a point; atomically change a leaf/goal or join binding; reject an invalid final batch; rebind a target without numerical pose change; remove a member/track; dispose. Use actual producers, solve, cached FK, transaction and adapter code—not only synthetic poses.

## Evidence and finish

Run focused consumer typechecks/tests and the full lifecycle scenario. Assert correct geometry/dirty writes, one accepted structural transition, no observations/binding/cache changes on refusal, replacement initialization, stale-handle refusal, no nested raw writes, no writes after disposal, and released subscriptions/references. Browser/GLB smoke checks apply only to supported retained surfaces; report unavailable coverage explicitly.

Done when a user-facing new-format rig works through its entire lifecycle and retained integrations no longer force old core machinery. Phase E gate covers values, atomic edits, adapters, ownership and disposal together. Record actual paths, commands/results, removed/deferred consumer features, and pending F sweep. Next: F1.
