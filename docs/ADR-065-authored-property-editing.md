# ADR-065: One authored property, two paths, and the kind refusal that stays

**Status:** Accepted, 2026-09-02

**Context.** Slice E of [issue #223](https://github.com/chahyasantoso/motion5/issues/223) narrows value tier to one property. Before it, tier could replace record of values on node ([ADR-059](./ADR-059-live-value-overlay.md), [ADR-060](./ADR-060-animated-live-values.md)), structural tier could write or drop whole plugin group ([ADR-063](./ADR-063-whole-group-and-goal-authoring.md)); nothing addressed one leaf of one group. Two questions open. Plan left first: `setKeyframe` rewrites authored record, so unlike `setValues` it could have compiled static key into animated one instead of refusing crossing. Second: whether key group does not author yet reachable at all — `withAuthoredValues` skips key with no flattened entry rather than inventing one, deliberately, so mask cannot express new leaf.

**Decision.** One verb per direction, `setKeyframe(plugin, key, value)` and `removeKeyframe(plugin, key)`, both value tier, both returning `PatchBatch` of one invalidate, neither reaching `replaceGraph` on any path.

Which of two paths a call takes decided by whether group already authors key; visible at call site, not hidden in name. Key group authors → `setValues({ [key]: value })` with group named: key in compiled record, so write is mask, or for animated key per-key rebuild of still-live timeline; retained definition moves with it. Key group does not author yet → definition-shaped input: authored record edited by pure editor in `domain/authoring/keyframes.ts`, candidate validated and resolved, node recompiled in place, re-seeked to progress displaced Track owned.

Kind crossing stays refused — decision plan left open. Leaf whose incoming kind differs from authored one is `LiveValueKeyError` with `reason: "kind"`, refused by `Track` before anything mutates, exactly as through `setValues`. Which kind of leaf key authored as is whole-definition question; `replace()` is where whole definition validated.

`keyframe-key-animated` not added. [Issue #231](https://github.com/chahyasantoso/motion5/issues/231) deleted `"animated"` from refusal union: interpolator with no per-key write escalates to recompile rather than refusing, so no code path could produce it.

Plugin this node authors no group for stays `setKeyframeGroup`'s job, refused here as `keyframe-group-unbound`. Precondition not only honesty about which tier caller is in: it buys cheap tier. Bound group's plugin already in `ResolvedPlugins.plugins`: group may author nothing but bindings, registry pushes named plugin into chain either way, so adding leaf to bound group provably cannot add composer or move one.

**Alternatives rejected.** Compiling kind crossing rather than refusing it. Reads as more capable answer, less honest: lets one key hold two authored shapes depending on which verb last touched it; puts second owner of leaf kind beside one `Track` already has. Refusal caller can act on worth more than conversion nobody asked for.

Letting `setKeyframe` originate group when plugin unbound. Collapse issue #223 refused by name: one verb whose cost and refusal set depend on context invisible at call site. Also costs tier its proof: unbound plugin exactly case where leaf does change chain.

Per-verb ownership check over key. [ADR-062](./ADR-062-candidate-key-ownership.md) already settled primitive builds candidate; owners judging whole authored record judge it, so `plugin-unknown-key` for leaf named group claims nothing about arrives from `PluginRegistry` at resolve, with registry's own rule id and path author wrote.

Masking new leaf instead of compiling it. `withAuthoredValues` skipping unflattened key is rule keeping runtime from inventing authored data; reaching around it would make mask author of property no document contains.

**Consequences.** New leaf costs validate, resolve, timeline build, re-seek. More than mask, far less than graph rebuild; cost visible in plural — path a call takes decided by record, so caller wanting cheap one writes key group already authors. Dropping re-seek named mutation target: freshly compiled Track sits at zero, would publish whole node at start of own timeline.

Removing group's last leaf removes values section; group left naming no section loses entry, so plugin leaves chain with it. One rule at four levels, not special case here; record says afterwards what author writing same document would have written.

Reversing kind decision, either direction, needs amendment to this record, not change in `ProjectRuntime`.

**Evidence.** `RA-69` through `RA-76` in `packages/core/test/unit/runtime/keyframe-property-edit.test.ts`, `SH-1` red beside them because `MEMBER_ARGUMENTS` named both verbs ahead of source. `RA-74` asserts kind refusal both directions with animated write beside it: refusal in one direction is not rule. `RA-71` and `RA-70` oracles, not counters: same leaf and same sweep authored into document and loaded fresh, at same progress, because call count cannot see stale timeline. Red and green run ids live in [pull request #250](https://github.com/chahyasantoso/motion5/pull/250).

Refs #223, #231. ADR-049, ADR-050, ADR-056, ADR-059, ADR-060, ADR-062, ADR-063, ADR-064.
