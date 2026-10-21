# C2 — Derive chain layouts and root policy

Status: not implemented. Depends on: C1, B1, B2, A2.

## Start here

Read `00-overview.md`, C1's generic interfaces, `packages/plugins/src/catalog.ts`, `packages/plugins/src/frame.ts`, and the plugin package's existing topology/index helper boundaries. New chain/root descriptor modules should remain in `packages/plugins/src`, not core.

## Outcome and work

Implement plugin-owned chain capability derivation. A built-in chain source contains one or more point entries plus zero/one root entry. Point participating order, ignoring root placement, defines the chain; previous point is parent. Generic mixed tracks remain legal but are not silently skeleton sources. Reject empty chains and invalid entry composition when a skeleton capability is required.

Produce ordered point IDs, parent indices, child adjacency, root/leaf set, safe ID index, point-to-source/entry locators, layout identity, and root binding declaration/provenance. IDs come from outer entry keys. A one-point chain is valid FK data. There is no parent value leaf or virtual root member.

Validate at most one root semantic provider regardless of entry IDs. Root's required frame binding/capability is plugin-owned metadata; runtime frame data arrives later. No root means origin policy. Root entry may appear anywhere and does not alter point order. Distinguish unbound-origin policy from explicitly bound root provenance even when numbers match.

Topology identity survives ordinary numeric edits within active structure. Structural reorder/rebinding/replacement rederives descriptors and cold-resets evaluators. Do not use current arrays or interpolated values as a topology key. Expose enough root policy for C3 to reject rooted imported chains.

## Evidence and finish

Run pure derivation tests: one/many points; root at beginning/middle/end yields identical parents; duplicate root entries fail; root-only/no-point source invalid; permitted special IDs safe; unknown mixed producer lacks capability; length/root-value changes do not derive; point reorder changes parents; root rebind updates provenance. No core knows built-in names.

Done when chain topology and external frame policy are known before activation without any runtime solve. Record actual new modules/capability fields, focused test commands/results, and public export choices. Next: C3.
