# A2 — Freeze entry identity, addresses, and ownership

Status: implemented on branch `feat/plugin-structural-api`. Depends on: A1.

Evidence: `packages/core/src/contract/address.ts`, `packages/core/test/contract/address-identity.test.ts`.

## Start here

Read `00-overview.md`, repository contribution rules, A1's contract/status artifacts, and `packages/core/src/domain/keyframe-groups.ts`, `packages/core/src/graph/ir.ts`, `packages/core/src/runtime/authored-values.ts`, `packages/core/src/contract/track-handle.ts`. Inspect existing tuple identity and handle helpers before proposing new ones.

## Outcome and work

Specify canonical reference types and one address-module owner. Distinguish qualified track ID, authored entry ID, plugin name, compiler key, generation, leaf path, output, point member, link, and adapter target. Every outer map key is an authored instance ID, including transform/root/IK/FK. A point's ID becomes its member ID; a join ID names only a link. Point IDs are globally unique within one resolved skeleton, not the whole project. No public qualification helper is needed.

Define `(entryId, leaf)` public addressing and collision-free internal encoding/reverse lookup. Reserve `/` and `:` in encoded authored components and retain existing stricter name rules. Safe handling of permitted prototype-looking names is mandatory, not a separate namespace workaround. With all value writes entry-nested, do NOT reserve singleton leaf names against entry IDs; there is no flat singleton namespace.

Array position affects execution/topology but is never retained identity. Moving preserves generation/overlays; removal invalidates handles and overlays; reusing an ID creates a fresh generation. Replacement semantics must be explicit: preserve logical handle generation for same-entry content replacement, invalidate plugin state/cache resources, revalidate plugin/content; remove+insert is new identity.

Define source/layout identity and root-binding provenance separately from numeric frame equality. Rebinding the same-looking root remains structural. Internal identity never leaks to authored values, public poses, or render writes.

## Evidence and finish

Write identity examples/type-level checks for two identical leaf names, plugin name equal to entry ID, point ID equal to a link ID, two rigs sharing point IDs, reserved delimiters, and adversarial tuple pairs. Include move/remove/reinsert handle behavior and safe `__proto__` records. Later runtime tests may initially be pending; label them.

Done when compiler, editing, state, requirements, and adapters can consume the same references without parsing guessed strings. Record actual paths/decisions/evidence, not invented test results. Next: A3.
