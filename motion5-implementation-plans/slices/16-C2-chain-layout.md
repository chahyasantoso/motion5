# C2 — Derive chain layouts and root policy

Status: implemented on branch `feat/plugin-structural-api`, including root rules restored to `root` (ADR-142 D7, D8). Depends on: C1, B1, B2, A2.

Evidence: `packages/plugins/src/chain-layout.ts`, `packages/plugins/src/root-policy.ts`, `packages/plugins/src/point.ts`, `packages/plugins/src/root.ts`, `packages/plugins/test/unit/chain-layout-c2.test.ts`, `packages/plugins/test/unit/root-rules-f1.test.ts`, `packages/plugins/test/unit/root-duplicate-d8.test.ts`, `packages/plugins/test/unit/root-frame-d7.test.ts`.

## Start here

Read `00-overview.md`, C1's generic interfaces, `packages/plugins/src/catalog.ts`, `packages/plugins/src/frame.ts`, and the plugin package's existing topology/index helper boundaries. New chain/root descriptor modules should remain in `packages/plugins/src`, not core.

## Outcome and work

Implement plugin-owned chain capability derivation. A built-in chain source contains one or more point entries plus zero/one root entry. Point participating order, ignoring root placement, defines the chain; previous point is parent. Generic mixed tracks remain legal but are not silently skeleton sources. `point.derive` (`deriveChainLayout`) returns `none` for an empty track, a track with plugins other than point/root, a refused root policy, or a track with no point; a consumer whose slot requires `chain` is then refused by core with `derivation-missing-capability`.

Produce ordered point IDs, parent indices, child adjacency, root/leaf set, safe ID index, point-to-source/entry locators, layout identity, and root binding declaration/provenance. IDs come from outer entry keys. A one-point chain is valid FK data. There is no parent value leaf or virtual root member.

At most one root entry per track regardless of entry IDs. `root.derive` owns that refusal through `readRootPolicy` (rule `derivation-failure`: `Duplicate root entries on chain track "<id>". At most one root entry permitted.`) and otherwise returns `none`; chain layout returns `none` for a refused policy, so the error appears once. A root-only track is a legal generic track with no `chain`; there is no root-only error. `root.requirements` is `{ frame: {} }`: the `frame` slot is optional and declares no capability (D7), and the frame is a runtime value read by `readFrame` and later the C5 reader. `RootPolicy` is the `origin | unbound | bound` union: no root entry is `origin`, a root entry without a frame binding is `unbound`, and a bound frame carries provenance. Root entry may appear anywhere and does not alter point order. Distinguish `origin`, `unbound` and `bound` policies in `layoutIdentity` (via the root policy token) even when numbers match.

Topology identity survives ordinary numeric edits within active structure. Structural reorder/rebinding/replacement rederives descriptors and cold-resets plugin state. Do not use current arrays or interpolated values as a topology key. Expose enough root policy for C3 to reject rooted imported chains.

## Evidence and finish

Run pure derivation tests: one/many points; root at beginning/middle/end yields identical parents; duplicate root entries fail with exactly one diagnostic; a root-only/no-point source derives no `chain` and a chain consumer bound to it is refused with `derivation-missing-capability`; permitted special IDs safe; unknown mixed producer lacks capability; length/root-value changes do not derive; point reorder changes parents; root rebind updates provenance. No core knows built-in names.

Done when chain topology and external frame policy are known before activation without any runtime solve. Record actual new modules/capability fields, focused test commands/results, and public export choices. Next: C3.
