# D2 — Implement point, join, root, and frame producers

Status: not implemented. Depends on: B6, C2, C3, C4, D1.

## Start here

Read `00-overview.md`, chain/join/root descriptor contracts, `packages/plugins/src/catalog.ts`, `packages/plugins/src/loader.ts`, `packages/plugins/src/transform.ts`, and `packages/plugins/src/frame.ts`. New point/join/root modules belong in the plugin package.

## Outcome and work

Point's `collect` returns the current local numeric datum WITHOUT id; records publish under the reserved `collect` output and core stamps the outer entry ID. A minimal `point` (`collect` plus `derive` producing `chain`) and `root` already exist and are registered in `catalog.ts` since C2; this slice completes their production contract rather than adding them. It reads no dependencies, solver/goals/base/world frames. Preserve normalized dynamic leaves and metadata consistent with D1/A3.

Join's `collect` publishes link records under the reserved `collect` output; it has a required `chain` and optional `parent` scalar slot, both declaring `capability: "chain"`. Use each entry's own current bound chain and compiled attachTo locator. Return its dynamic link WITHOUT id; core owns stamping/order. Reuse validated source arrays by reference when safe. Do not discover parents, flatten/rebuild layouts, or perform world composition during collect.

Root declares fold output `root` and an optional `frame` slot with no capability (`requirements: { frame: {} }`, D7). Return only `{root: readFrame(input)}`; the frame is a runtime value validated by `readFrame`, not a structural capability. Root position never matters because downstream consumers use completed source output. Duplicate root entries (`root.derive`) and rooted imported chains (`join.validate`) are derivation refusals, not runtime coordinate-based precedence. Bound blocked/error frame sources propagate, not origin fallback; absent root entry means origin policy.

Adapt transform to a fold emitting only its own authored x/y/rotation keys; unrelated preceding fields survive via delta merge. Implement it through one shared frame-fold helper (for example `defineFrameFold({ name, keys })`) that returns the plugin's own authored frame keys as the delta. G1 builds `transform3d` from the same helper with the 3D key list; do not write a second fold body. Repeated transforms are ordered field replacement, not transform multiplication. Expose a compatible frame value contract (read by `readFrame`) with documented missing-field defaults. Register/export point/join/root and update loader demand discovery; no aliases or legacy operation wrapper.

## Evidence and finish

Run real publisher tests for interpolated point leaves, distinct repeated joins/inputs, dependency-only entries, root in each array position, origin omission, moved/rotated frame updates, malformed frame/ID spoof refusal, blocked root dependency, and no per-tick derivation. Check transform partial publication and repeated per-field delta behavior. Delete transform's C7 `legacy-compose` parity test once the fold replaces it.

Done when final producers satisfy their declared capabilities through the generic runtime, with topology/math/render ownership still separate. Record commands/results and actual catalog/public API changes. Next: D3.
