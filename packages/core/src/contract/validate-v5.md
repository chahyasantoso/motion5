# packages/core/src/contract/validate-v5.ts

## STOPS_REQUIRED

The shape error for a leaf that is neither canonical form.

The rule id stays `stops-shape` through ADR-050. The animated form still _is_ stops, so "this is not a legal authored property" remains exactly what the rule says, and renaming it would churn the derived `plugin-contribution-stops-shape` spelling that `contract/rule-id.ts` now owns and every citation of it across the contract suite for no semantic gain. The message and the cited path are corrected instead.

## WRAPPER_RETIRED

The retired form, refused by name so the diagnostic names the migration and not a shape.

## TEMPLATES_UNSUPPORTED

The removed top-level field, refused by name so the diagnostic names the removal and not a shape.

`templates` promised reusable keyframe bundles and had no reader anywhere: the declaration and two lines of `docs/AUTHORED-SCHEMA.md` were the whole feature, while the runtime's project snapshot carried the field through every graph rebuild untouched. A field with no consumer is removed and then refused, never left declared or silently ignored.

## SECTION_NAMES

`'requires' or 'values'`, so the unknown-section message never hardcodes the legal set twice.

## GROUPS_ALLOWED

Whether a scope authors plugin-named groups, which is the second and last thing a scope decides.

A record keyed by `KeyframeRuleScope` rather than a `scope === "authored"` test, for the reason `SCOPED_RULE_ID` in `contract/rule-id.ts` is one: a third scope then has to answer both questions where they are asked, instead of silently inheriting whichever answer was written first. The two questions stay separate maps because they belong to different owners. Which id a rule reports under is a fact about rule ids, so the id module owns it; whether a group is authorable is a fact about this validator.

A contributed property is one flat output, so the contribution scope answers `false` and keeps the pre-group strictness: an object of objects contributed as a property stays a `stops-shape` error rather than being read as a group, and both section names stay ordinary keys. This replaces the `allowGroups` option, which every caller that set it set together with the prefix and the alias map. See ADR-097.

## validateProperty

The authoring-shape gate for one leaf.

What shape a leaf has is `readAuthoredLeaf`, not a record test and an array test written here. Five other sites used to ask that question independently and two of them already disagreed, so this reads the answer instead of recomputing it.

A static value carries no stops to validate and no slot for an `ease`, so knowing the shape is the whole of validating it. The empty record stays the accepted no-op property it has always been, which is a kind of its own rather than a shape refused by accident. See issue #192.

Every path cited here is a path the author actually wrote. The shape error used to append `.stops` to it, which named a member that no longer exists anywhere in a v5 document.

## validateRequirementDict

A dict-valued requirement slot: one source id per key the author names.

Rules of its own rather than an exception inside the slot loop, because `keyframes-requires-source` answers only for a source id. Left to that rule a dict is refused outright, which is what made the shape unauthorable before the goals slot was special-cased. Deleting that rule instead would make a malformed dict derive no binding at all: no edge, no ordering, no pending classification, and a solver that reaches for nothing with no diagnostic.

Keyed on the value's shape rather than on the slot's name, which is the whole of what generalizes here. Keyed on the name, a second plugin declaring a dict-accepting slot is refused one layer before its own declaration can be read, so `PluginRequirement.dict` would be unreachable for every slot but one and the capability would still be `ik`'s alone. See ADR-057.

Shape only, and deliberately not membership. Whether a key names a real member of a solver's chain is derived from `solver` edges in `resolveSolvers`, the only owner that knows the member set; asking it here would need a graph this layer must not hold. Whether the slot was allowed to carry a dict at all is `PluginRegistry`'s question, for the same reason in the other direction.

The brackets stay refused, with a corrected rationale rather than a corrected rule. They were refused because an authored key containing one could forge the derived `targets[<memberId>]` slot identity, and that identity no longer exists. What is left is that a dict key is an authored name, authored names reserve `:` for internal keys, and this slice's accepted-behavior line is that no rig gains an authored spelling it did not have. Widening the legal key set is a separate decision, and no rig is asking for it.

## validateRequires

The registry-independent half of binding validation.

Shape only: an object mapping non-empty slot names to non-empty source ids, or to a dict of them. Whether the group names a registered plugin, whether that plugin declares the slot, and whether it declared that the slot accepts a dict all belong to `PluginRegistry.resolveForKeyframes`; whether the source resolves to a node, and whether the derived edge is acyclic, belongs to graph construction. Three owners, because a single one would have to hold a plugin registry inside the contract layer to answer all three.

An empty section is refused rather than ignored. Omitting `requires` is already the way to bind nothing, so an empty one is a field accepted and then ignored, which ADR-033 forbids. See ADR-044.

## validateValues

The values section: every property the named plugin claims, and the only compiled value domain.

A leaf is held to exactly the rules a flat property is held to, and claims its compiled key through the same `claim`, so a leaf colliding with a flat key or with another group's leaf is still one `keyframes-duplicate-key` reported by one owner.

An empty section is refused rather than ignored. Omitting `values` is already the way to author no properties, so an empty one is a field accepted and then ignored, which rule 6 of ADR-033 forbids. Identical reasoning to `keyframes-requires-empty` above. See ADR-049.

## usesThreeD

Compares leaf names, not flat record keys. A `rotationY` authored inside a group is the same 3D content as a flat one, and reading only the top level made `perspective-usage` stop firing for it: a silently lost warning rather than a rejected project. The leaves now live under `values`, so this asks `readPluginValues` for them rather than iterating the group's own entries, which would only ever see the section name and reintroduce that exact regression. See ADR-049.

Both leaf forms ADR-050 introduces are non-null, so a 3D key authored as a bare array or as a bare static value still fires `perspective-usage`. `Y-9` and `LF-13` cover the section case.

## validateSchemaV5

Owns authored schema shape and schema diagnostics, and nothing else. Graph construction owns
reference resolution, duplicate edges, cycles, solver resolution, and graph diagnostics, so this
module imports no graph implementation and recombines no graph diagnostics. The composed public
entry point is `packages/core/src/validate-v5.ts`, which runs this validator and then the graph
builder in that order; see its sister document for the folding rule and for why the composition
lives outside the contract layer. Returning `Outcome<ProjectDefinition, Diagnostic>` is what
makes an accepted null project and a refusal without a reason both unrepresentable. The error
type is named rather than defaulted, because ADR-102 moved the algebra to `lang/` and left it
with no knowledge of this layer's diagnostic.
