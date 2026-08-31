import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const files = {
  status: "docs/SESSION-STATUS.md",
  decisions: "docs/DECISIONS.md",
  api: "docs/guide/api-reference.md",
  runtime: "docs/guide/runtime-changes.md",
  errors: "docs/guide/errors-and-diagnostics.md",
  adr: "docs/ADR-065-authored-property-edit.md",
};

function read(path) {
  return readFileSync(path, "utf8");
}
function replaceOnce(text, before, after, label) {
  const count = text.split(before).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one match, found ${count}`);
  return text.replace(before, after);
}
function write(path, content) {
  writeFileSync(path, content);
}

let status = read(files.status);
status = replaceOnce(status,
  "- **Verified on:** `main` at `7e3c4ba`, the squash that landed slice D, with slices A1, A2, A3, B1, B2, C1, C2, C3 and D of [issue #223](https://github.com/chahyasantoso/motion5/issues/223) all landed, together with optimisations 7a and 7c. The sha names the last commit that changed `packages/` rather than the head of `main`, because a status file cannot cite the commit it is written in and a docs-only commit verifies no behaviour.",
  "- **Verified on:** PR #250 head `df355536`, with slices A1, A2, A3, B1, B2, C1, C2, C3, D and E of [issue #223](https://github.com/chahyasantoso/motion5/issues/223) landed. This docs-only follow-up verifies documentation consistency, not runtime behavior; the runtime evidence and CI remain on PR #250.",
  "status verification");
status = replaceOnce(status,
  "- **Open.** The runtime authoring surface, [issue #223](https://github.com/chahyasantoso/motion5/issues/223). The A slices are done, so are the publisher optimisations, B is landed in both halves, C is landed in all three of its slices, and so is D. **E is next, and it is tier 2:** `setKeyframe(plugin, key, value)` and `removeKeyframe(plugin, key)`, routed through the existing `#writeValues` for a key the group already authors and through a pure editor for a new leaf in a bound group, with `keyframe-group-unbound` keeping the unbound case where C1 put it.\n- **After it.** F deletes `ProjectDefinition.templates` and refuses it by name as `project-templates-unsupported`, and the `docs/AUTHORED-SCHEMA.md` promise goes with it.",
  "- **Open.** The runtime authoring surface, [issue #223](https://github.com/chahyasantoso/motion5/issues/223). Slices A1, A2, A3, B1, B2, C1, C2, C3, D and E are landed. **F is next:** delete `ProjectDefinition.templates`, refuse it by name as `project-templates-unsupported`, and remove the corresponding promise from `docs/AUTHORED-SCHEMA.md`.\n- **Docs follow-up landed.** This PR updates the status, decision index, Slice E ADR, API reference, runtime changes guide, and diagnostics guide so they describe the shipped E surface and its remaining F scope.",
  "status scope");
status = replaceOnce(status,
  "- **Debt this slice found and did not fix.** `docs/guide/errors-and-diagnostics.md` still has stale B1 wording for the renamed `definition` member and the old stale-handle list, and it does not enumerate C1 and C2's five new keyframe rule ids. `runtime-changes.md` also lacks the `MotionHandle` section and the `tryTrack`/`tryMotion` guidance. `api-reference.md` names the structural verbs, but the diagnostics and runtime guides need this follow-up so docs, public types and status move together. C3 added nothing to that list, because it changed no public surface and no rule id. D adds three things to it: `api-reference.md` names no `edit(recipe)` and no `SchemaTransaction`, and `errors-and-diagnostics.md` enumerates neither `schema-transaction-nested` nor `schema-transaction-immediate`.",
  "- **Previously tracked docs debt, now resolved here.** The guides now cover the renamed `definition` member, stale handles, C1 through E keyframe rules, MotionHandle and try-resolver guidance, and D's `edit(recipe)` and `SchemaTransaction` surface. F still needs the `ProjectDefinition.templates` removal and its authored-schema documentation change.",
  "status debt");
write(files.status, status);

const adr = `# ADR-065: edit one authored property inside a bound plugin group

- Status: accepted
- Date: 2026-08-31
- Slice: E of [issue #223](https://github.com/chahyasantoso/motion5/issues/223)
- Builds on ADR-059, ADR-060, ADR-062 and ADR-063.

## Decision

`TrackHandle.setKeyframe(plugin, key, value)` and `removeKeyframe(plugin, key)` are value-tier edits for a plugin group the node already authors. Both return the `PatchBatch` from one invalidation and never call `replaceGraph`, because a leaf carries no edge and the plugin is already in the chain by the bound-group precondition.

An already-authored key delegates to the existing live-value path with the group named. This preserves the existing validation, animated-key escalation, overlay handling, retained-definition update, and progress behavior. A key not yet authored in that bound group is a definition-shaped edit: the pure authoring editor adds or removes the leaf, the candidate is validated and resolved, the live Track is recompiled in place, and its playhead is restored from the live-write progress.

The two verbs refuse `keyframe-group-unbound` when the node does not author the named group. They do not originate a group; `setKeyframeGroup` owns that structural operation. Existing leaf kind changes remain `live-value-key` refusals, and registry ownership remains the registry's question over the candidate, reported as `plugin-unknown-key` when appropriate. An absent key on removal is an identity no-op.

## Shape and cleanup

The values section is edited through the reserved `values` section. Removing its last leaf removes the section, removing the last section removes the group, and removing the last keyframe record removes `keyframes` from the track. No empty husk is retained.

The bound-group lookup is owned by `ProjectRuntime.#boundGroup`, shared by property and requirement edits. The authored-record-to-track rewrite is owned by `withKeyframes`, shared by structural authored edits and property recompiles. Neither property verb enters the structural transaction path.

## Evidence

`RA-69` through `RA-76` in `packages/core/test/unit/runtime/keyframe-property-edit.test.ts` cover authored and new leaves, animated writes, removal cleanup, unbound groups, kind refusals, recipe refusals, unknown plugin keys, dependent publication, progress preservation, and the no-`replaceGraph` invariant. `SH-1` covers the two public members on the stale-handle surface, and the final PR checks passed on Node 24.

## Follow-up

F remains: remove `ProjectDefinition.templates`, refuse it as `project-templates-unsupported`, and update `docs/AUTHORED-SCHEMA.md`.
`;
write(files.adr, adr);

let decisions = read(files.decisions);
decisions += `\n\n## ADR-065: Edit one authored property inside a bound plugin group\n\n**Status:** Accepted, 2026-08-31\n\n**Decision.** Slice E adds `TrackHandle.setKeyframe(plugin, key, value)` and `removeKeyframe(plugin, key)` as value-tier edits for a plugin group already authored by the node. Existing leaves use the live-value path; new leaves are edited, validated, resolved, recompiled in place, and re-seeked. Both return one invalidation batch and never rebuild the graph. The group must already exist, so `keyframe-group-unbound` keeps group origination with `setKeyframeGroup`.\n\n**Ownership.** `domain/authoring/keyframes.ts` owns the pure values-section edits and empty-shape cascade. `ProjectRuntime.#boundGroup` owns the shared bound-group precondition, and `withKeyframes` owns the shared authored-record-to-track rewrite. Registry ownership and leaf-kind validation remain with their existing owners.\n\n**Evidence.** `RA-69` through `RA-76` in `packages/core/test/unit/runtime/keyframe-property-edit.test.ts`, plus the stale-handle surface coverage in `SH-1`.\n\n**Follow-up.** F removes `ProjectDefinition.templates`, refuses it as `project-templates-unsupported`, and updates `docs/AUTHORED-SCHEMA.md`. See [ADR-065](./ADR-065-authored-property-edit.md).\n`;
write(files.decisions, decisions);

let api = read(files.api);
api = replaceOnce(api,
  "A `TrackHandle` carries `id`, `live`, `definition`, `requires`, `remove()`, `replace(next)`, `addObserve(observation)`, `removeObserve(observation)`, `setRequire(plugin, slot, source, memberKey?)`, `removeRequire(plugin, slot, memberKey?)`, `setKeyframeGroup(plugin, group)`, `removeKeyframeGroup(plugin)`, `setGoal(plugin, memberId, source)`, `removeGoal(plugin, memberId)`, `overrideValues(next)`, and `setValues(next)`.",
  "A `TrackHandle` carries `id`, `live`, `definition`, `requires`, `remove()`, `replace(next)`, `addObserve(observation)`, `removeObserve(observation)`, `setRequire(plugin, slot, source, memberKey?)`, `removeRequire(plugin, slot, memberKey?)`, `setKeyframeGroup(plugin, group)`, `removeKeyframeGroup(plugin)`, `setGoal(plugin, memberId, source)`, `removeGoal(plugin, memberId)`, `setKeyframe(plugin, key, value)`, `removeKeyframe(plugin, key)`, `overrideValues(next)`, and `setValues(next)`.",
  "api handle surface");
api = replaceOnce(api,
  "The six authoring members above are the structural tier, and each returns `void` because the return type carries the tier:",
  "The six structural authoring members above return `void` because the return type carries the tier:",
  "api structural count");
api = replaceOnce(api,
  "The six structural authoring members above return `void` because the return type carries the tier:\n\n",
  "The six structural authoring members above return `void` because the return type carries the tier:\n\n`setKeyframe` and `removeKeyframe` are the value-tier property pair. The named plugin group must already be authored on the node. An existing key routes through the live-value writer; a new key edits the authored `values` section, validates and resolves the candidate, recompiles the Track in place, restores progress, and returns the resulting `PatchBatch`. Removing an absent key is a no-op. Both refuse `keyframe-group-unbound` before writing and never call `replaceGraph`.\n\n",
  "api property docs");
write(files.api, api);

let runtime = read(files.runtime);
runtime = replaceOnce(runtime,
  "`setKeyframeGroup` and `removeKeyframeGroup` are the whole-group pair.",
  "`setKeyframeGroup` and `removeKeyframeGroup` are the whole-group pair.",
  "runtime anchor");
runtime = replaceOnce(runtime,
  "`setGoal` and `removeGoal` edit one entry of a solver's goals slot, addressed by the member id it is authored under, so two entries of one slot stay two edges.",
  "`setKeyframe` and `removeKeyframe` are the property-level pair. The named plugin group must already exist on the node. An existing key uses the live-value path, while a new key is added to the authored `values` section, validated, resolved, recompiled in place, and re-seeked at the existing progress. Removing an absent key is a no-op; removing the last leaf removes the empty section, group, and record shape. Both return one `PatchBatch`, never rebuild the graph, and refuse `keyframe-group-unbound` before writing.\n\n`setGoal` and `removeGoal` edit one entry of a solver's goals slot, addressed by the member id it is authored under, so two entries of one slot stay two edges.",
  "runtime property pair");
write(files.runtime, runtime);

let errors = read(files.errors);
errors = replaceOnce(errors,
  "- `keyframe-group-shape`, when `setKeyframeGroup` receives an object naming neither `values` nor `requires`. Remove the entry to author nothing; do not commit a husk.\n",
  "- `keyframe-group-shape`, when `setKeyframeGroup` receives an object naming neither `values` nor `requires`. Remove the entry to author nothing; do not commit a husk.\n- `keyframe-group-unbound`, when `setKeyframe` or `removeKeyframe` names a plugin group the node does not author. Use `setKeyframeGroup` to originate the group; property edits never create a partial group.\n",
  "errors rule insertion");
errors = replaceOnce(errors,
  "`setKeyframeGroup()`, `removeKeyframeGroup()`, `setGoal()`, `removeGoal()`, `overrideValues()`, and `setValues()` all throw `StaleTrackHandleError`",
  "`setKeyframeGroup()`, `removeKeyframeGroup()`, `setGoal()`, `removeGoal()`, `setKeyframe()`, `removeKeyframe()`, `overrideValues()`, and `setValues()` all throw `StaleTrackHandleError`",
  "errors stale surface");
write(files.errors, errors);

execFileSync("npx", ["prettier", "--write", ...Object.values(files)], { stdio: "inherit" });
for (const path of Object.values(files)) {
  if (!read(path).endsWith("\n")) throw new Error(`${path}: missing final newline`);
}
console.log("Updated six docs files and formatted them with Prettier.");
