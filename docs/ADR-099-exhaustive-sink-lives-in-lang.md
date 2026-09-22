# ADR-099: The exhaustive sink lives in the layer-free language module

**Status:** Accepted, 2026-09-21

## Context

ADR-092 placed `unreachable` in `packages/core/src/domain/exhaustive.ts` and rejected `lang/` because `scripts/boundary-scan.mjs` did not name a new directory, so one would be "unscanned rather than safe". That objection was correct when it was written. It was also conditional on the scanner's layer list rather than on any property of `lang/`, and a condition a single slice can remove is not a reason to keep paying for it.

The census was re-measured rather than carried forward, because the count in #462's body had gone stale. The sink has **thirty-three** value importers under `packages/core/src` and **eleven** under `packages/core/test`, forty-four in total, where the body said fourteen.

The recorded debt named one violation, in `ports/trigger-factory.ts`. The measured set is **seven** source files across **three** layers that ARCHITECTURE section 2 says may not depend on domain: `contract/authored-leaf.ts`, `contract/keyframe-shape.ts`, `contract/patch-render.ts`, `contract/validate-v5.ts`, `ports/trigger-factory.ts`, `adapters/trigger-factory/loop-cycle.ts`, and `adapters/trigger-factory/time-driver.ts`. The contract cases are the sharpest, because two other files in that same layer, `contract/rule-id.ts` and `contract/rule.ts`, each carry the sentence "`domain/exhaustive` is deliberately not imported, because the contract layer does not read the domain layer for a totality it can state in the type." Four files in the layer did exactly that. Both comments are corrected in this slice: the conclusion each of them draws is still right, and the reason each gave for it was not.

The placement also bought a second owner. `packages/react/src/patch-store.ts` declared a private `unhandledLifecycle(value: never): never` with the sink's body byte for byte, and the reason is on the record: the sink lived in a private core layer, so importing it from another package would have traded a missing invariant for a layer violation. Two answers to "which variant was not decided" is the defect this project says it cares about most, and the old placement is what produced it.

## Decision

The sink moves to `packages/core/src/lang/exhaustive.ts`, and its mirrored test moves to `packages/core/test/unit/lang/exhaustive.test.ts`, so the test still sits beside its subject as its own doc comment claims. `lang/` is dependency-free, holds nothing about this project, and is named in `scripts/boundary-scan.mjs` as a scanned core directory in the same change that creates it. ARCHITECTURE section 2 states the exception in the sentence a reader derives the rule from, and section 12 lists the directory.

The scanner gains one rule: a `contract/`, `ports/`, or `adapters/` module that imports the retired `domain/exhaustive` path is a violation. Adapters are scanned for the first time as a consequence, with their external-engine imports exempt from the renderer and engine rule, because two of the seven violators are adapter files and a rule that cannot see them is not a rule.

The private React sink is deleted. `unreachable` is exposed on the unadvertised `@motion5/core/internal` entry beside `liveOrAbsent`, which is the precedent for exactly this: a partition whose narrowing an outside module owes is shipped with the function that discharges it. The public `@motion5/core` entry, the package export map, and the boundary allow-list are unchanged.

This supersedes one paragraph of ADR-092: the one explaining why the sink lives in `domain/` and why `lang/` was rejected. Nothing else of ADR-092 is superseded, including its decision that a read of a closed union names every variant and ends at a shared `never` sink, its semantics, its rejected alternatives, its phase table, its tag ownership, its consequences, and its evidence. The sink's name, signature, message text, and throw are byte-identical after the move.

## What this does not fix, measured rather than assumed

The new gate is narrower than the inward-dependency sentence it serves, and the gap is stated here rather than left for a reader to discover.

Five inward imports into domain survive this slice, named here in full because none of them was named by the survey, by #451's plan, or by #462's follow-up list. Three are value imports and are the same violation the sink was: `contract/migrate-v4-to-v5.ts` and `contract/validate-v5.ts` import `acceptedOutcome` and `refusedOutcome` from `domain/outcome`, and `adapters/interpolator/gsap.ts` imports `compilePercentKeyframes` from `domain/keyframe-compiler`. Two are type-only and erase at build: `adapters/dom.ts` imports `RenderMetadata` from `domain/plugins` and `adapters/index.ts` re-exports it. A predicate over every `domain/` import from those three layers would therefore have been red on the tree it was added to, and a gate introduced red is a gate that gets an exemption list instead of a fix. So the rule refuses the exact regression this move exists to prevent and no more, and the predicate's own doc comment says so at the place a future implementor will read it. **Refined by [ADR-102](./ADR-102-the-outcome-algebra-lives-in-lang.md), 2026-09-22.** Three survive, not five: the `domain/outcome` pair below is gone, because the algebra moved to `lang/` and the default that made it reach `contract/` was deleted with it. The three adapter imports this paragraph names are unchanged and are owned by [issue #474](https://github.com/chahyasantoso/motion5/issues/474). The reasoning stands in full, including why a gate introduced red earns an exemption list: ADR-102 widened the rule to `contract/` and `ports/` only once both were provably empty, and left `adapters/` on this narrower one for exactly the reason stated here.

The `domain/outcome` pair is the interesting one, and it is a real slice rather than a tidy-up: `Outcome<T, E = Diagnostic>` defaults its error type to a contract type, so the question is whether the outcome algebra was ever domain knowledge at all, or belongs in `contract/` beside the diagnostic it carries. Phases 4a and 4b of #451 created both imports and neither asked. Moving it is not a path rewrite either, because `Outcome` is the declared shape of the public `ValidationResult` and `MigrationResult`. It needs its own measurement and its own record, and it does not belong in a relocation slice. **Answered by [ADR-102](./ADR-102-the-outcome-algebra-lives-in-lang.md), 2026-09-22.** The measurement says neither: the module read no Track, Motion, plugin or value snapshot, and its only project-specific tokens were the default and the import serving it, so the algebra was never domain knowledge; and `contract/` is refused on this record's own ground, that a language-level primitive is not a contract this project offers anyone. It lives in `lang/` with no default, `ValidationResult` and `MigrationResult` stay declared where they were, and the deferral recorded in this paragraph was correct rather than superseded.

## Alternatives rejected

**Keep the sink in `domain/` and correct ARCHITECTURE instead.** The cheapest option, and it was drafted: state the exception, delete the contradiction, leave the file where it is. Rejected because it makes the duplicate in `packages/react` permanent. An exception that a second package cannot use is an exception that costs a second owner, and no wording in ARCHITECTURE pays that back.

**Keep a private copy in `ports/`, or in React.** Rejected on the same ground, and more sharply: #462's own follow-up text already called this "worse: a second owner of the sink."

**Add `lang/` without touching the scanner.** Rejected because ADR-092's objection is correct while the directory is unscanned. This slice removes the condition rather than disagreeing with the reasoning, which is the only honest way to reopen a recorded decision.

**Put the sink in `contract/`.** `contract/` is the innermost layer and every layer already reaches it, so the relative paths would have been shorter. Rejected because `contract/` owns the authored schema and the public types, and a language-level primitive is not a contract this project offers anyone. It would also have left `ports/` depending on `contract/` for a value rather than a type, which is the same violation with a different destination.

**Widen the gate to every `domain/` import.** Rejected, and measured first: it fails on five current files. Recorded above as its own slice rather than as an exemption list here.

## Consequences

All forty-four importers use the new path. Contract, ports, and adapters no longer reach into domain for this helper, and the two contract comments that denied doing so are now true of their own layer.

`packages/react` has no `never` sink of its own. `unhandledLifecycle` is gone, both lifecycle switches in `patch-store.ts` end at the shared owner, and the widened-union probe in `patch-store-lifecycle.test.ts` still fails `typecheck` against the sink rather than against a local copy of it.

The internal entry gains one repository-only export. No public export, export-map entry, or allow-list entry moves.

Adapters are now scanned, so the banned-compatibility-symbol rule reaches them for the first time. It is green today; a future adapter carrying one of those names fails where it previously would not have.

Historical records keep the old path where they describe the placement that existed when they were written. ADR-093 governs that, and the archived implementation plans under `docs/archived/` are left as authored. The three live records that carried the old path were corrected later, in #470: ADR-092 took the supersede annotation this record already claimed existed, plus its two real module paths, and ADR-094 and ADR-098 took one path correction each. The distinction is the one ADR-093 draws: an archived record is immutable and a live one is corrected where it states something false about today's tree. This record stays the superseding pointer for the placement paragraph, and ADR-092's decision text is annotated rather than rewritten.

## Evidence

`packages/core/test/unit/scripts/boundary-scan.test.ts` carries `W-8`: a planted tree with one `contract/`, one `ports/` and one `adapters/` module importing `../domain/exhaustive` yields exactly three violations from the shipped scanner. The case is gated by the existing `W-` series alternation in `packages/core/test/unit/scripts/evidence-case-ids.test.ts`, which owns entrypoint-tier and scanner-surface cases. The case beside it, which runs the shipped scanner against the real tree and expects no violations, is what proves the `lang/` path passes; a fixture cannot prove that about a directory it invents.

`node scripts/boundary-scan.mjs`, `node scripts/read-budget-scan.mjs` and `node scripts/acceptance-scan.mjs` were run on the exact tree this slice produces and all three pass. The typecheck was run with TypeScript 5.6.3 against a repository pinned at 5.8.3, which is the one gate a forty-four-file path rewrite most needs, and it introduced no error beyond a fixed environmental baseline measured on the pre-change tree.

Not claimed: no Vitest run and no Prettier run. Neither exists in the environment this was prepared in and no network was available to install them, so `format:check` and every assertion above about what a case does at run time are claims about what a checked-in case asserts, verified by required CI on the published commit rather than locally.
