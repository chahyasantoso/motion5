# ADR-097: A rule id is a closed union

- Status: accepted as a decision, implementation not landed. This record is intent until the slices below merge, on documentation rule 2 of [README.md](./README.md).
- Date: 2026-09-18
- Issue: [#449](https://github.com/chahyasantoso/motion5/issues/449), deferred from [#443](https://github.com/chahyasantoso/motion5/issues/443) section 2.5.

## Context

`Diagnostic.ruleId` is `string`, so the set of rule ids this project refuses by name is open. Nothing enumerates it, nothing can switch on it, and a reader asking which rules exist has to grep for a construction site. That is the open side ADR-092 describes one level out: a closed union read by predicates is closed on one side only, and here the union was never closed at all.

The inventory this record is built on was taken at `1cf86fbb3f9c5fb8b8c9619e8daef570f73f1a64` and it found more than the issue assumed. Three findings changed the decision.

There are 119 distinct ids actually assigned to `Diagnostic.ruleId`, not the handful the issue sketches. They are constructed in `packages/core/src/contract/validate-v5.ts`, `contract/migrate-v4-to-v5.ts`, `contract/diagnostics.ts`, `graph/ir.ts`, `graph/order.ts`, `graph/references.ts`, `domain/plugins.ts`, `domain/keyframe-compiler.ts`, `runtime/graph-publisher.ts`, `runtime/report.ts`, `runtime/graph-runtime.ts`, and `runtime/project-runtime.ts`. Six of them carry severity `warning` and the rest carry `error`.

The named failures in `runtime/refusal.ts` are a second population, and they are not rule ids. `describeRefusal` renders `schema-transaction-nested`, `schema-transaction-immediate`, `value-batch-immediate`, `schema-commit-reentrant`, `value-batch-structural`, `keyframe-group-unbound`, `keyframe-goal-slot-reserved` and `keyframe-entry-shape` as a prefix inside a thrown human message, and `project-runtime.ts` and `domain/plugins.ts` add `schema-transaction-recreated` and `plugin-input-collision` the same way. None of the ten is ever assigned to `Diagnostic.ruleId`, and the intersection of the two populations is empty. The issue names `keyframe-group-unbound` and `reserved-goal-slot` as rule ids carrying `ids`, which is the one factual error in it: those are refusal payload fields rendered into a sentence, and `refusal.ts` already holds them as a closed, minted, exhaustively read union. They need nothing from this record.

One construction site builds its id at run time, and it is the reason a literal scan cannot close this union by itself. `validate-v5.ts` pushes `issue(prefix + (aliases[ruleId] ?? ruleId), rulePath, message, severity)`, where the prefix and the alias map are data. That is what mints the whole `plugin-contribution-` family, including the four aliased stop rules. `graph-publisher.ts` picks between `observation-missing-upstream`, `observation-input-shape`, `observation-output-shape` and `composition-failure` through a branch on the error class, and `graph-runtime.ts` forwards a variable through `#report`. Those three are narrowable. The prefix one is not, unless the prefix becomes part of the type.

The `ids` field is worse than optional. Some rules carry a fixed pair, `graph-cycle` carries a whole cycle path, `ik-target-not-single-leaf` carries a solver id followed by every leaf, and several plugin rules carry an arity that depends on which branch refused. A tuple per rule is not available for most of them.

## Decision

Rule ids become one closed union, `RuleId`, owned by a new `packages/core/src/contract/rule-id.ts`, and `Diagnostic.ruleId` is typed by it.

The prefixed family is stated as a template literal type over the base family rather than enumerated twice, because the prefix is real and enumerating both halves would put one fact in two lists that a later slice keeps in step by hand. The shape is `plugin-contribution-` applied to the contribution rule names, with the four aliases named as their own members because an alias is a different id rather than a spelling of one.

`ids` is discriminated in three groups rather than per rule, because per rule is a lie for every variable-arity member. A rule that carries a fixed pair declares that pair. A rule that carries a list declares a non-empty `readonly string[]`. Every other rule declares `ids?: undefined`, so a diagnostic that carries ids the rule does not own fails `typecheck` rather than being ignored by a reader.

The generic constructors are narrowed at the same time. `contract/diagnostics.ts`, `graph/ir.ts` `diag`, `runtime/report.ts`, plugin `diagnostic` and `graph-runtime.ts` `#report` all take `string` today, and a closed union whose only producer accepts `string` is closed nowhere. Narrowing them is the slice, not a follow-up to it.

The ten refusal prefixes stay where they are. They are already a closed union in `refusal.ts`, read by two total switches, and pulling them into `RuleId` would give one namespace two owners and would make `describeRefusal` depend on the contract layer for a string it templates itself.

The enumeration gets a gate, on the rule the evidence-id gate earned in issue #283: where a gate reads a hand-maintained list of subjects, a case asserts that the list covers the subjects actually present. A scan that only reads literals would answer absent for the entire prefixed family, so the case asserts it found the prefix site too.

## Alternatives considered

A branded nominal type over `string`. Rejected: it closes assignment and not enumeration, so nothing can switch on it and the acceptance criterion asking for one type listing every id is unmet.

Enumerating the prefixed family as 18 more literals beside the base ones. Rejected on the DRY rule this project already applies to derived facts: the prefix is derived from the base name at run time, so deriving it in the type too is one owner, and two hand-maintained lists is the shape issue #283 refused.

A tuple per rule for `ids`, as the issue sketches. Rejected as unavailable: `graph-cycle` and `ik-target-not-single-leaf` have no fixed arity, and pinning a false one would either refuse a real diagnostic or force a cast at the site that builds it.

Splitting `Diagnostic` into one interface per severity. Rejected: severity is not the question any reader asks, and ADR-016 keeps runtime diagnostics inline on one channel.

## Consequences

Adding a rule breaks the build at `rule-id.ts`, which is where the id is named, rather than being inherited silently by every consumer that pattern-matches a string. That is the acceptance criterion the issue asks for.

This touches `contract/v5`, and `Diagnostic` is exported from the package entry, so a consumer that constructs a `Diagnostic` with its own rule id stops compiling. That is a public surface change and it is owed a version decision in the slice that lands it, not here.

The alias map in `validate-v5.ts` stops being free data and becomes a typed mapping. That is the cost of the prefix being in the type, and it is the only place it is paid.

## Follow-up

The work is cut into four slices so no one of them exceeds the sizing rule in [PR-WORKFLOW.md](./PR-WORKFLOW.md). First the enumeration and its coverage gate, with `Diagnostic.ruleId` still `string`, so the list is proved complete before anything depends on it. Then the generic constructors narrow to `RuleId`. Then `Diagnostic.ruleId` is typed and the prefix site becomes a typed mapping. Then `ids` is discriminated and the readers become total switches. The owning pull request carries the plan, the measured semantic file count, and the exact tested SHA.

The four documentation-only names the inventory found are a separate defect and not part of this record: `trigger-driver-unavailable` is documented in [AUTHORED-SCHEMA.md](./AUTHORED-SCHEMA.md) with no constructor in the tree, and `ik-solver-unsupported-arity`, `ik-solved-pivot-unsupported` and `keyframe-require-shape` are named by documents as deleted or historical. A closed union is where that drift becomes visible, so they are decided when the enumeration lands rather than carried into it.
