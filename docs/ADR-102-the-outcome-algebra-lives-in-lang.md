# ADR-102: The outcome algebra lives in the layer-free language module and names its error type

**Status:** Accepted, 2026-09-22

## Context

[ADR-099](./ADR-099-exhaustive-sink-lives-in-lang.md) moved the exhaustive sink to `lang/` and deferred exactly one question, in the paragraph it labelled the interesting one: was the outcome algebra ever domain knowledge at all, or does it belong in `contract/` beside the diagnostic it carries? It refused to answer inside a relocation slice and said the pair needed its own measurement and its own record. This is that record, and issue [#469](https://github.com/chahyasantoso/motion5/issues/469) is where the question was parked.

Everything below was measured against `main` at `88a7c5be`, by walking every relative import under `packages/core/src` and grouping it by layer pair, and by reading every `Outcome<...>` spelling and every constructor call in the tree. Predicates were executed rather than read; the four scanners were run.

**What the module actually knew.** `packages/core/src/domain/outcome.ts` was 73 lines and read no Track, no Motion, no plugin and no value snapshot, which is what ARCHITECTURE section 12 says `domain/` holds. Its only project-specific tokens were the `E = Diagnostic` default on line 13 and the `import type { Diagnostic } from "../contract/v5"` on line 1 that served it. Delete those two and nothing remaining in the file names this project: a discriminated sum, a non-empty tuple predicate, a throwing boundary and an exhaustive reader.

**The cycle, and its exact size.** There are 244 cross-directory relative import declarations under `packages/core/src`. Exactly **two** of them are `contract -> domain`: `contract/migrate-v4-to-v5.ts` line 2 and `contract/validate-v5.ts` line 12, and both import the outcome constructors and nothing else. So ARCHITECTURE section 2's "Contract has no dependencies on another core layer" had exactly one counterexample in the tree, this module was it, and it was a counterexample in both directions at once: `domain/outcome.ts` imported `Diagnostic` from `contract/v5` while those two imported the constructors back. A default is what manufactured a cycle between the innermost layer and the one above it.

**What the default was worth.** Eleven `Outcome<...>` type spellings existed. Ten passed one type argument and took the default; one, `MigrationResult`, passed `MigrationDiagnostic` explicitly. Of fifteen constructor calls, eleven already named `E` and four inferred it from their arguments, so no call site depended on the default for inference and only two, both in the moved case, depended on it to compile at all. The default was already the minority spelling where values are built and the majority only where types are aliased, and every one of those aliases has a name of its own.

**The answer is neither `domain/` nor `contract/`.** Not domain, by the first measurement. Not contract either, on ADR-099's own rejection of `contract/` for the sink, which applies here word for word: `contract/` owns the authored schema and the public types, and a language-level primitive is not a contract this project offers anyone. `ValidationResult`, `TrackValidationResult` and `MigrationResult` are the contracts. They are declared in `contract/` and in the composition root, and they stay exactly where they are.

## Decision

The algebra moves to `packages/core/src/lang/outcome.ts`, and its mirrored case moves to `packages/core/test/unit/lang/outcome.test.ts`, so the case still sits beside its subject. Every exported name, every signature, every property name, the thrown `TypeError` and its message bytes are identical after the move. `lang/` is dependency-free and is already named in `scripts/boundary-scan.mjs` as a scanned core directory, so the objection ADR-092 raised against a new directory does not apply a second time.

`Outcome<T, E>` carries **no default**, and that absence is the decision rather than a side effect of it. `E` is named at all eleven type spellings, which is twelve characters each and the whole of the cost. The `diagnostics` property keeps its name: it is the shape `validateV5` already returns to a caller, `docs/guide/errors-and-diagnostics.md` documents it as `{ kind: "accepted", value, diagnostics }`, and renaming it would be a public surface change wearing a refactor's clothes.

`runtime/results.ts` gains `import type { Diagnostic } from "../contract/v5"` so `expectValid` can name the error type it reads. That is `runtime -> contract`, which ARCHITECTURE permits and which the file's own layer already does thirty-eight other times.

The gate widens, and it widens to the sentence it serves rather than to one path. `importsDomainLayer` refuses any relative `domain/` import from `contract/` and from `ports/`, both of which are provably empty the moment this lands. `importsDomainSink` keeps the narrow retired-path question for `adapters/` alone, and both predicates read one extractor, `importSpecifiers`, so the normalisation and the three blind spots have one owner instead of two. `contract/` and `ports/` no longer carry the sink rule, because a retired-sink import is a `domain/` import and two spellings of one question is the duplication this project files against itself.

The broad rule stops at two layers on purpose. Three adapter imports of `domain/` are legal today, so applying it to `adapters/` would introduce the gate red, and ADR-099 already recorded why that earns an exemption list instead of a fix.

## What this does not fix, measured rather than assumed

**Three inward imports into domain survive, down from ADR-099's five.** `adapters/interpolator/gsap.ts` line 3 reaches `domain/keyframe-compiler` for a value, and `adapters/dom.ts` line 3 plus `adapters/index.ts` line 8 reach `domain/plugins` type-only. The value import is a real slice and not a path rewrite: `engine.ts` line 21 imports `compilePercentKeyframes` too, so there are two callers in two layers and the question is which of them owns calling it. The two type-only imports are `RenderMetadata`, which `internal.ts` re-exports twice, so moving the declaration moves what the unadvertised internal entry offers. [Issue #474](https://github.com/chahyasantoso/motion5/issues/474) owns both, and names the one-line gate change that becomes available when they are gone.

**`exactOptionalPropertyTypes` is still off.** #469 named it and this slice does not take it. The flag's entire effect is a set of new `tsc` diagnostics, so the slice *is* the error inventory, and that inventory has to be taken at the pinned 5.8.3 rather than at the 5.6.3 available here. [Issue #473](https://github.com/chahyasantoso/motion5/issues/473) owns it and states the single next action rather than an estimate of its size.

**`ports -> graph` survives as one type-only import.** `ports/graph-builder.ts` line 2 reaches `GraphBuildResult`, which contradicts "Ports are depended upon, never depending". It is not on #469's list and it is not this slice's. It is named here because the inventory that found it is in this record, and a measurement nobody wrote down is a measurement that gets taken again.

**The gate still cannot see three spellings.** A configured alias, a computed specifier, and a block comment interposed between the keyword and its specifier. That limit moved from `importsDomainSink`'s doc comment to `importSpecifiers`, because it is a property of the extraction rather than of either question, and it is stated at the one place a future implementor reads.

## Alternatives rejected

**Put the algebra in `contract/`.** The destination ADR-099 named as the plausible one, and the shortest relative paths. Rejected on ADR-099's own ground, and then on one of its own: `graph/` and `runtime/` would depend on `contract/` for a value they use purely as a language primitive, and `MigrationResult`'s `E` would point at a sibling inside its own layer while `ValidationResult`'s pointed at the same file from outside it. That is the two-owners smell with shorter paths, not an answer to it.

**Keep it in `domain/` and correct ARCHITECTURE instead.** Rejected. It makes the cycle permanent and writes a single-file exception into the sentence four other layers are held to. ADR-099 rejected the same shape for the sink and nothing about the reasoning has changed.

**Move the module and keep the `E = Diagnostic` default.** The cheapest version of this slice, and the one worth rejecting out loud: the default *is* the dependency. A `lang/` module importing `contract/v5` to supply a default is not dependency-free, and the gate this slice adds would refuse it one layer over. Keeping it would have bought ten shorter type spellings at the cost of the invariant the move exists for.

**Recover the brevity with `type DiagnosticOutcome<T> = Outcome<T, Diagnostic>` in `contract/`.** Rejected. It is a second name for one type, and every site it would serve already has a name: `ValidationResult`, `TrackValidationResult`, `ResolvedEdge`, `GraphOrderResult`. An alias between a type and its own alias is an owner nobody asked for.

**Widen the gate to `adapters/` as well.** Rejected, and measured first: red on three files. Recorded as #474 rather than as an exemption list here.

## Consequences

`contract -> domain` is zero. ARCHITECTURE section 2's claim about the contract layer is now enforced by a gate rather than asserted by a sentence, and the same rule covers `ports/`, which was already clean and had nothing keeping it that way.

A reader of `ValidationResult` sees which error type it carries at its own declaration instead of one file away, and `Outcome<T, undefined>` is now something a caller writes deliberately rather than something the default hides.

Ten type spellings are twelve characters longer. That is the price of the invariant and it is stated rather than absorbed.

`lang/` holds two modules and is still dependency-free: `lang/outcome.ts` imports `./exhaustive` and nothing else, which the moved case asserts by reading the module's own specifiers.

A `contract/` or `ports/` module reaching any `domain/` module now fails `boundary-scan`, where before only the exact retired sink path did. `W-8` measures both rules and the asymmetry between them.

The `stryker.config.json` mutate list never named `domain/outcome.ts` and does not name the new path either. [Issue #419](https://github.com/chahyasantoso/motion5/issues/419) still owns that baseline and no threshold moves here.

## Evidence

`packages/core/test/unit/lang/outcome.test.ts` gains one case: `export type Outcome<T, E> =` is present, `E = Diagnostic` is absent, and no `../contract/` or `../domain/` specifier appears in the module. It is read through `code()`, so a comment cannot satisfy it, and its `member()` read of `readOutcome` still ends at `unreachable(outcome)`. Red on `main`, where the declaration carries the default and line 1 carries the import. The seven pre-existing cases move unchanged except for naming `Diagnostic` where they previously took it from the default.

`packages/core/test/unit/scripts/boundary-scan.test.ts` carries three things. `W-8` is rewritten to plant one file per layer with *different* imports: `contract/` and `ports/` reach ordinary domain modules and are refused for reaching `domain/` at all, `adapters/` reaches the retired sink and is refused by name, and the expected list is still exactly three. One file per layer, because `walk` does not sort and two files in one layer would make the assertion depend on `readdir` order. A sibling case plants an adapter reaching `domain/keyframe-compiler` and asserts a clean scan, which is the half of the asymmetry that explains why the broad rule stops where it does. A direct predicate case drives both predicates over thirteen specifiers covering `lang/`, `contract/`, a longer sibling name, a package specifier, a computed specifier, both path separators and the three suffixes.

Both planted scans were **executed** against the shipped scanner in a throwaway tree, not merely written. `W-8` returned `contract/leak.ts: inward domain import`, `ports/leak.ts: inward domain import`, `adapters/leak.ts: retired domain sink import`, in that order. The adapter case returned the empty array. The thirteen-specifier case was executed against the shipped predicates with zero divergences from what it asserts.

`node scripts/boundary-scan.mjs`, `node scripts/read-budget-scan.mjs`, `node scripts/acceptance-scan.mjs` and `node scripts/raw-template-scan.mjs` were run on the exact tree this slice produces and all four pass. No added line in any `.ts`, `.mjs` or `.md` file exceeds 100 columns, measured over added lines. No new evidence-case id is introduced, so the id series and `docs/acceptance-map.json` are untouched.

Not claimed, and required CI is the authority for all of it: no `npm`, no `vitest`, no `prettier` and no `tsc` run of any kind backs a statement here. None is installable in the preparing environment and no network was available, so `format:check`, `typecheck` and every "red on `main`" claim above are claims about what a checked-in case asserts rather than observed failures, except where a predicate was executed and its output quoted. The relocation's type correctness in particular rests on reading every use site rather than on a compiler: the four inferred constructor calls were left inferred precisely because removing a default cannot change inference that already succeeds.
