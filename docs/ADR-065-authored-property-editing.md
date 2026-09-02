# ADR-065: One authored property, two paths, and the kind refusal that stays

**Status:** Accepted, 2026-09-02

**Context.** Slice E of [issue #223](https://github.com/chahyasantoso/motion5/issues/223) is the value tier narrowed to one property. Before it, the tier could replace a record of values on a node ([ADR-059](./ADR-059-live-value-overlay.md), [ADR-060](./ADR-060-animated-live-values.md)) and the structural tier could write or drop a whole plugin group ([ADR-063](./ADR-063-whole-group-and-goal-authoring.md)), and nothing addressed one leaf of one group. Two questions were open. The plan left the first: `setKeyframe` rewrites the authored record, so unlike `setValues` it could have compiled a static key into an animated one instead of refusing the crossing. The second was whether a key the group does not author yet is reachable at all, because `withAuthoredValues` skips a key with no flattened entry rather than inventing one, deliberately, and a mask therefore cannot express a new leaf.

**Decision.** One verb per direction, `setKeyframe(plugin, key, value)` and `removeKeyframe(plugin, key)`, both in the value tier, both returning the `PatchBatch` of one invalidate, and neither reaching `replaceGraph` on any path.

Which of two paths a call takes is decided by whether the group already authors the key, and it is visible at the call site rather than hidden in the name. A key the group authors is `setValues({ [key]: value })` with the group named: the key is in the compiled record, so the write is a mask, or for an animated key a per-key rebuild of the still-live timeline, and the retained definition moves with it. A key the group does not author yet is definition-shaped input: the authored record is edited by a pure editor in `domain/authoring/keyframes.ts`, the candidate is validated and resolved, and the node is recompiled in place and re-seeked to the progress the displaced Track owned.

The kind crossing stays refused, and that is the decision the plan left open. A leaf whose incoming kind differs from the authored one is `LiveValueKeyError` with `reason: "kind"`, refused by `Track` before anything mutates, exactly as it is through `setValues`. Which kind of leaf a key is authored as is a whole-definition question, and `replace()` is where a whole definition is validated.

`keyframe-key-animated` is not added. [Issue #231](https://github.com/chahyasantoso/motion5/issues/231) deleted `"animated"` from the refusal union because an interpolator with no per-key write escalates to a recompile rather than refusing, so no code path could produce it.

A plugin this node authors no group for stays `setKeyframeGroup`'s job, refused here as `keyframe-group-unbound`. That precondition is not only honesty about which tier a caller is in: it is what buys the cheap tier. A bound group's plugin is already in `ResolvedPlugins.plugins`, because a group may author nothing but bindings and the registry pushes the named plugin into the chain either way, so adding a leaf to a bound group provably cannot add a composer or move one.

**Alternatives rejected.** Compiling the kind crossing rather than refusing it. It reads as the more capable answer and it is the less honest one: it would let one key hold two authored shapes depending on which verb last touched it, and it would put a second owner of leaf kind beside the one `Track` already has. A refusal a caller can act on is worth more than a conversion nobody asked for.

Letting `setKeyframe` originate a group when the plugin is unbound. That is the collapse issue #223 refused by name: one verb whose cost and refusal set depend on context invisible at the call site. It would also cost the tier its proof, because an unbound plugin is exactly the case where a leaf does change the chain.

A per-verb ownership check over the key. [ADR-062](./ADR-062-candidate-key-ownership.md) already settled that a primitive builds a candidate and the owners that judge a whole authored record judge it, so `plugin-unknown-key` for a leaf the named group claims nothing about arrives from `PluginRegistry` at the resolve, with the registry's own rule id and the path the author wrote.

Masking a new leaf instead of compiling it. `withAuthoredValues` skipping an unflattened key is the rule that keeps the runtime from inventing authored data, and reaching around it here would make the mask the author of a property no document contains.

**Consequences.** A new leaf costs a validate, a resolve, a timeline build and a re-seek. That is more than a mask and far less than a graph rebuild, and the cost is visible in the plural: the path a call takes is decided by the record, so a caller that wants the cheap one writes a key the group already authors. Dropping the re-seek is the named mutation target, because a freshly compiled Track sits at zero and would publish the whole node at the start of its own timeline.

Removing a group's last leaf removes the values section, and a group left naming no section loses its entry, so the plugin leaves the chain with it. That is one rule at four levels rather than a special case here, and what the record says afterwards is what an author writing the same document would have written.

Reversing the kind decision, in either direction, needs an amendment to this record rather than a change in `ProjectRuntime`.

**Evidence.** `RA-69` through `RA-76` in `packages/core/test/unit/runtime/keyframe-property-edit.test.ts`, with `SH-1` red beside them because `MEMBER_ARGUMENTS` named both verbs ahead of the source. `RA-74` asserts the kind refusal in both directions with the animated write beside it, because a refusal in one direction is not a rule. `RA-71` and `RA-70` are oracles rather than counters: the same leaf and the same sweep authored into the document and loaded fresh, at the same progress, because a call count cannot see a stale timeline. The red and green run ids live in [pull request #250](https://github.com/chahyasantoso/motion5/pull/250).

Refs #223, #231. ADR-049, ADR-050, ADR-056, ADR-059, ADR-060, ADR-062, ADR-063, ADR-064.
