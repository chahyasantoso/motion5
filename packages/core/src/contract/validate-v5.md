# packages/core/src/contract/validate-v5.ts

## TEMPLATES_UNSUPPORTED

The removed top-level field, refused by name so the diagnostic names the removal and not a shape.

`templates` promised reusable keyframe bundles and had no reader anywhere: the declaration and two lines of `docs/AUTHORED-SCHEMA.md` were the whole feature, while the runtime's project snapshot carried the field through every graph rebuild untouched. A field with no consumer is removed and then refused, never left declared or silently ignored.

## readTrack

One track, read by the identified-table parser rather than by the grouped-keyframe validator.

The parser owns the authored track shape, so this composes it rather than repeating its member checks. Two questions stay here because they are questions about a set of tracks rather than about one: a duplicated id, and a source contract inferred beside a declared one. The inference pass is skipped for a plugin track, whose input contract belongs to the plugin. See ADR-121.

## validateSchemaV5

Owns authored schema shape and schema diagnostics, and nothing else. Graph construction owns
reference resolution, duplicate edges, cycles, solver resolution, and graph diagnostics, so this
module imports no graph implementation and recombines no graph diagnostics. The composed public
entry point is `packages/core/src/validate-v5.ts`, which runs this validator and then the graph
builder in that order; see its sister document for the folding rule and for why the composition
lives outside the contract layer. Returning `Outcome<ProjectDefinition, Diagnostic>` is what
makes an accepted null project and a refusal without a reason both unrepresentable. The error
type is named rather than defaulted, because ADR-103 moved the algebra to `lang/` and left it
with no knowledge of this layer's diagnostic.
