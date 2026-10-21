# E7 — Integrate retained consumers and full lifecycle

Status: not implemented. Depends on: D7, E2, E3, E4, E5, E6.

## Start here

Read `00-overview.md`, A5's consumer inventory, entry/adapter public APIs, `packages/react`, and only helpers found by actual import tracing. The Three skeleton surfaces (`skeleton-tracks.ts`, `skeleton-driver.ts`, the Three adapter) are migrated by G6/G7 and the apps by G8; this slice does not touch them.

## Outcome and work

Update React selection to explicit `poses[id]` or the accepted projection helper. Preserve existing pose aggregation/classification contracts as separate products until G5 migrates them; do not reinterpret rest skeleton data as a captured world pose.

Do not delete or defer 3D skeleton generators or plugins here: they stay on the quarantined legacy channel until G3–G7 migrate them. No 2D helper touched here may emit old object-form keyframes, embedded-id entries, old base/root/target wiring, per-bone solver channels, or flat singleton writes. Do not create a graph track per point solely to adapt a renderer.

Build one realistic public API scenario: load a rooted torso/two-arms rig; animate root/goals; render; value-edit a point; atomically change a leaf/goal or join binding; reject an invalid final batch; rebind a target without numerical pose change; remove a member/track; dispose. Use actual producers, solve, cached FK, transaction and adapter code—not only synthetic poses.

## Evidence and finish

Run focused consumer typechecks/tests and the full lifecycle scenario. Assert correct geometry/dirty writes, one accepted structural transition, no observations/binding/cache changes on refusal, replacement initialization, stale-handle refusal, no nested raw writes, no writes after disposal, and released subscriptions/references. Browser/GLB smoke checks apply only to supported retained surfaces; report unavailable coverage explicitly.

Done when a user-facing new-format rig works through its entire lifecycle and retained integrations no longer force old core machinery. Phase E gate covers values, atomic edits, adapters, ownership and disposal together. Record actual paths, commands/results, removed/deferred consumer features, and the pending G and F work. Next: G1.
