# ADR-097: A rule id is a closed union

- Status: accepted as a decision, enumeration implemented and not merged. This record is intent until the slices below merge, on documentation rule 2 of [README.md](./README.md). The inventory paragraphs below were corrected in place against a second measurement, after the first one was found wrong in five places; the corrections replace the claims rather than being appended beside them.
- Date: 2026-09-18
- Issue: [#449](https://github.com/chahyasantoso/motion5/issues/449), deferred from [#443](https://github.com/chahyasantoso/motion5/issues/443) section 2.5.

## Context

`Diagnostic.ruleId` is `string`, so the set of rule ids this project refuses by name is open. Nothing enumerates it, nothing can switch on it, and a reader asking which rules exist has to grep for a construction site. That is the open side ADR-092 describes one level out: a closed union read by predicates is closed on one side only, and here the union was never closed at all.

The inventory this record is built on was taken at `1cf86fbb3f9c5fb8b8c9619e8daef570f73f1a64` and it found more than the issue assumed. Three findings changed the decision.

There are 116 distinct ids actually assigned to `Diagnostic.ruleId`, not the handful the issue sketches, and they are constructed in fifteen modules rather than the twelve the first inventory named. Fourteen construct a diagnostic directly: `packages/core/src/contract/validate-v5.ts`, `contract/migrate-v4-to-v5.ts`, `graph/ir.ts`, `graph/order.ts`, `graph/references.ts`, `domain/plugins.ts`, `domain/keyframe-compiler.ts`, `domain/track.ts`, `adapters/graph-builder/incremental.ts`, `adapters/trigger-factory/default.ts`, `runtime/graph-publisher.ts`, `runtime/graph-runtime.ts`, `runtime/project-runtime.ts`, and `runtime/report.ts`. The fifteenth, `runtime/publisher-outcome.ts`, mints ids on the error classes `graph-publisher.ts` forwards. `contract/diagnostics.ts` was named in that list and belongs out of it: it declares the constructor and no id. Six base ids carry severity `warning` and the rest carry `error`; the prefixed spellings of `stop-missing-start` and `stop-missing-end` inherit it, so eight members of the union are warnings.

The named failures in `runtime/refusal.ts` are a second population, and they are not rule ids. `describeRefusal` renders `schema-transaction-nested`, `schema-transaction-immediate`, `value-batch-immediate`, `schema-commit-reentrant`, `value-batch-structural`, `keyframe-group-unbound`, `keyframe-goal-slot-reserved` and `keyframe-entry-shape` as a prefix inside a thrown human message, and `project-runtime.ts` and `domain/plugins.ts` add `schema-transaction-recreated` and `plugin-input-collision` the same way. None of the ten is ever assigned to `Diagnostic.ruleId`, and the intersection of the two populations is empty. The issue names `keyframe-group-unbound` and `reserved-goal-slot` as rule ids carrying `ids`, which is the one factual error in it: those are refusal payload fields rendered into a sentence, and `refusal.ts` already holds them as a closed, minted, exhaustively read union. They need nothing from this record.

One construction site builds its id at run time, and it is the reason a literal scan cannot close this union by itself. `validate-v5.ts` pushes `issue(prefix + (aliases[ruleId] ?? ruleId), rulePath, message, severity)`, where the prefix and the alias map are data. That is what mints the whole `plugin-contribution-` family, including the four aliased stop rules. `graph-publisher.ts` picks between `observation-missing-upstream`, `observation-input-shape`, `observation-output-shape`, `composition-failure` and `composition-output-shape` through a branch on the error class; the fifth is forwarded from `CompositionOutputError.ruleId` and the first inventory missed it. `graph-runtime.ts` forwards one of `clock-tick-regression`, `clock-consumer-failure`, `flush-failure` and `scheduler-failure` through `#report`. Those are narrowable. The prefix one is not, unless the prefix becomes part of the type, and the prefix reaches the site through `validateKeyframes` options declared `ruleIdPrefix?: string` and `ruleIdAliases?: Readonly<Record<string, string>>`. Nothing constrains either, so this union is closed by closing those two options and not by typing the field alone.

The `ids` field is worse than optional. Some rules carry a fixed pair, `graph-cycle` carries a whole cycle path, `ik-target-not-single-leaf` carries a solver id followed by every leaf, and several plugin rules carry an arity that depends on which branch refused. A tuple per rule is not available for most of them.

## Decision

Rule ids become one closed union, `RuleId`, owned by a new `packages/core/src/contract/rule-id.ts`, and `Diagnostic.ruleId` is typed by it.

The prefixed family is stated as a template literal type over the keyframe rule family rather than enumerated twice, because the prefix is real and enumerating both halves would put one fact in two lists that a later slice keeps in step by hand. The type applies the alias substitution rather than unioning an independently maintained alias list beside it, so `plugin-contribution-stop` is derived from `stop-position` and `plugin-contribution-stop-position` is unrepresentable, and the map stays the one owner of the aliasing. The family covers every keyframe rule name the prefix can be applied to rather than the subset the adapter reaches today, and that over-approximation is deliberate: the reachable subset was measured wrong twice, and `plugin-contribution-keyframes-reserved-separator` is constructed in the tree while being absent from both reachable lists. A family covering every name the prefix can carry can never fail to type a real diagnostic, where a hand-picked reachable subset fails the first time a different rule fires.

`ids` is discriminated in three groups rather than per rule, because per rule is a lie for every variable-arity member. A rule that carries a fixed pair declares that pair. A rule that carries a list declares a non-empty `readonly string[]`. Every other rule declares `ids?: undefined`, so a diagnostic that carries ids the rule does not own fails `typecheck` rather than being ignored by a reader.

The generic constructors are narrowed at the same time, and there are six rather than five. `contract/diagnostics.ts` `diagnostic`, `graph/ir.ts` `diag`, `runtime/report.ts` `frozenDiagnostic`, `domain/keyframe-compiler.ts` `diagnostic`, the plugin `diagnostic`, and `graph-runtime.ts` `#report` all take `string` today, and a closed union whose only producer accepts `string` is closed nowhere. `frozenDiagnostic` was attributed to `contract/diagnostics.ts` by the first inventory and it lives in `runtime/report.ts`, which declares `diagnostic` and not `frozenDiagnostic`. Narrowing them is the slice, not a follow-up to it.

The ten refusal prefixes stay where they are. They are already a closed union in `refusal.ts`, read by two total switches, and pulling them into `RuleId` would give one namespace two owners and would make `describeRefusal` depend on the contract layer for a string it templates itself.

The enumeration gets a gate, on the rule the evidence-id gate earned in issue #283: where a gate reads a hand-maintained list of subjects, a case asserts that the list covers the subjects actually present. A scan that only reads literals would answer absent for the entire prefixed family, so the case asserts it found the prefix site too. It asserts coverage and never a total: this inventory has been wrong twice, so a number in the gate would pin the error rather than catch it.

## Alternatives considered

A branded nominal type over `string`. Rejected: it closes assignment and not enumeration, so nothing can switch on it and the acceptance criterion asking for one type listing every id is unmet.

Enumerating the prefixed family as 22 more literals beside the base ones. Rejected on the DRY rule this project already applies to derived facts: the prefix is derived from the base name at run time, so deriving it in the type too is one owner, and two hand-maintained lists is the shape issue #283 refused.

A tuple per rule for `ids`, as the issue sketches. Rejected as unavailable: `graph-cycle` and `ik-target-not-single-leaf` have no fixed arity, and pinning a false one would either refuse a real diagnostic or force a cast at the site that builds it.

Splitting `Diagnostic` into one interface per severity. Rejected: severity is not the question any reader asks, and ADR-016 keeps runtime diagnostics inline on one channel.

## Consequences

Adding a rule breaks the build at `rule-id.ts`, which is where the id is named, rather than being inherited silently by every consumer that pattern-matches a string. That is the acceptance criterion the issue asks for.

This touches `contract/v5`, and `Diagnostic` is exported from the package entry, so a consumer that constructs a `Diagnostic` with its own rule id stops compiling. That is a public surface change and it is owed a version decision in the slice that lands it, not here.

The alias map in `validate-v5.ts` stops being free data and becomes a typed mapping. That is the cost of the prefix being in the type, and it is the only place it is paid.

## Follow-up

The work is cut into four slices so no one of them exceeds the sizing rule in [PR-WORKFLOW.md](./PR-WORKFLOW.md). First the enumeration and its coverage gate, with `Diagnostic.ruleId` still `string`, so the list is proved complete before anything depends on it. Then the generic constructors narrow to `RuleId`. Then `Diagnostic.ruleId` is typed and the prefix site becomes a typed mapping. Then `ids` is discriminated and the readers become total switches. The owning pull request carries the plan, the measured semantic file count, and the exact tested SHA.

Two of the four names the first inventory called documentation-only were misread, and the enumeration is where that became visible. `trigger-driver-unavailable` has a constructor in `adapters/trigger-factory/default.ts` and ADR-030 documents it as a load-time diagnostic, so it is an ordinary member of the union rather than drift, and finding it is what proved the coverage scan has to walk `adapters/`. `keyframe-require-shape` is rendered inside a thrown `TypeError` in `domain/authoring/keyframes.ts` and is never assigned to `Diagnostic.ruleId`, so it belongs to the message-prefix population rather than to this union. Only `ik-solver-unsupported-arity` and `ik-solved-pivot-unsupported` are prose about nothing, and the documents naming them are corrected by the slice that has a reader for the claim rather than by this record.
