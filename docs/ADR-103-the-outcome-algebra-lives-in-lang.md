# ADR-103: The outcome algebra lives in the layer-free language module and names its error type

**Status:** Accepted, 2026-09-22. Numbered 103 on 2026-09-23: it was written as ADR-102 while [#476](https://github.com/chahyasantoso/motion5/pull/476) landed [ADR-102](./ADR-102-a-request-is-sealed-by-its-manifest.md) on `main`, and one number names one record.

## Context

[ADR-099](./ADR-099-exhaustive-sink-lives-in-lang.md) moved exhaustive sink to `lang/`, deferred exactly one
question in paragraph it labelled interesting: was outcome algebra ever domain knowledge, or belongs it in
`contract/` beside diagnostic it carries? It refused to answer inside a relocation slice, said pair needed
own measurement and own record. This is that record; issue
[#469](https://github.com/chahyasantoso/motion5/issues/469) is where question was parked.

Everything below measured against `main` at `88a7c5be`, recounted same results on tree re-cut onto `main` at
`83b41a6c` — walking every relative import under `packages/core/src`, grouping by layer pair, reading every
`Outcome<...>` spelling and constructor call in tree. Predicates executed not read; four scanners run.

**What module actually knew.** `packages/core/src/domain/outcome.ts` was 73 lines, read no Track, no Motion,
no plugin, no value snapshot — what ARCHITECTURE section 12 says `domain/` holds. Only project-specific
tokens: `E = Diagnostic` default on line 13, `import type { Diagnostic } from "../contract/v5"` on line 1
serving it. Delete both → nothing remaining names this project: discriminated sum, non-empty tuple
predicate, throwing boundary, exhaustive reader.

**Cycle, and exact size.** 244 cross-directory relative import declarations under `packages/core/src`.
Exactly **two** are `contract -> domain`: `contract/migrate-v4-to-v5.ts` line 2, `contract/validate-v5.ts`
line 12, both importing outcome constructors only. So ARCHITECTURE section 2's "Contract has no dependencies
on another core layer" had exactly one counterexample in tree, this module, and counterexample in both
directions at once: `domain/outcome.ts` imported `Diagnostic` from `contract/v5` while those two imported
constructors back. A default manufactured a cycle between innermost layer and one above it.

**What default was worth.** Eleven `Outcome<...>` type spellings: ten passed one type argument, took default;
one, `MigrationResult`, passed `MigrationDiagnostic` explicitly. Of fifteen constructor calls, eleven already
named `E`, four inferred from arguments → no call site depended on default for inference, only two (both in
moved case) depended on it to compile. Default already minority spelling where values built, majority only
where types aliased — and every alias has name of its own.

**Answer is neither `domain/` nor `contract/`.** Not domain, by first measurement. Not contract either, on
ADR-099's own rejection of `contract/` for sink, applying here word for word: `contract/` owns authored schema
and public types, language-level primitive is not a contract this project offers anyone. `ValidationResult`,
`TrackValidationResult`, `MigrationResult` are contracts. Declared in `contract/` and composition root, stay
exactly where they are.

## Decision

Algebra moves to `packages/core/src/lang/outcome.ts`, mirrored case to
`packages/core/test/unit/lang/outcome.test.ts` so case still sits beside subject. Every exported name, every
property name, thrown `TypeError` and its message bytes identical after move. Signatures change one way only,
next paragraph is whole of it: `E` loses default. Saying "every signature is identical" beside a paragraph
deleting a defaulted type parameter is contradiction an independent pass caught in first cut of this record;
corrected here not softened, because default is the decision. `lang/` is dependency-free and already named in
`scripts/boundary-scan.mjs` as scanned core directory, so ADR-092's objection against new directory does not
apply a second time.

`Outcome<T, E>` carries **no default**, and absence is decision not side effect. `E` named at all eleven type
spellings — twelve characters each, whole cost. `diagnostics` keeps name: shape `validateV5` already returns
to caller, `docs/guide/errors-and-diagnostics.md` documents `{ kind: "accepted", value, diagnostics }`,
renaming = public surface change wearing refactor's clothes.

`runtime/results.ts` gains `import type { Diagnostic } from "../contract/v5"` so `expectValid` names error
type it reads. That is `runtime -> contract`, ARCHITECTURE permits, and file's own layer already does it
thirty-nine other times — counted as `from "../contract/` declarations under `runtime/` on `main` at
`83b41a6c`.

Gate widens, to sentence it serves not one path. `importsDomainLayer` refuses any relative `domain/` import
from `contract/` and `ports/`, both provably empty moment this lands. `importsDomainSink` keeps narrow
retired-path question for `adapters/` alone, both predicates read one extractor `importSpecifiers` →
normalisation, comment erasure, remaining limits have one owner not two. `contract/` and `ports/` no longer
carry sink rule: retired-sink import IS a `domain/` import, two spellings of one question = duplication this
project files against itself.

Broad rule stops at two layers on purpose. Three adapter imports of `domain/` legal today, applying to
`adapters/` would introduce gate red, ADR-099 recorded why that earns exemption list instead of fix. **Superseded
by [ADR-105](./ADR-105-adapters-do-not-depend-on-domain.md), 2026-09-23:** compiler moved into
authored contract, renderer metadata moved to ports, broad gate now covers adapters. All references here to
`importsDomainSink`, the three legal adapter imports, old W-8 adapter expectation are historical descriptions
of this record at acceptance, not current tree.

## What this does not fix, measured rather than assumed

**Historical measurement at ADR-103 acceptance, superseded by
[ADR-105](./ADR-105-adapters-do-not-depend-on-domain.md), 2026-09-23: no adapter inward-domain imports
remain.** Three inward imports into domain survived here, down from ADR-099's five.
`adapters/interpolator/gsap.ts` line 3 reaches `domain/keyframe-compiler` for value; `adapters/dom.ts` line 3
plus `adapters/index.ts` line 8 reach `domain/plugins` type-only. Value import real slice not path rewrite:
`engine.ts` line 21 imports `compilePercentKeyframes` too → two callers in two layers, question is which owns
calling it. Two type-only imports are `RenderMetadata`, which `internal.ts` re-exports twice → moving
declaration moves what unadvertised internal entry offers.
[Issue #474](https://github.com/chahyasantoso/motion5/issues/474) owns both, names one-line gate change
available when gone.

**Historical at ADR-103 acceptance; PR #480 now enables `exactOptionalPropertyTypes` and repairs measured
sites.** #469 named it, this slice does not take it. Flag's entire effect = new `tsc` diagnostics, so slice
_is_ error inventory, and inventory must be taken at pinned 5.8.3 not 5.6.3 available here.
[Issue #473](https://github.com/chahyasantoso/motion5/issues/473) owns it, states single next action rather
than size estimate.

**`ports -> graph` survives as one type-only import.** `ports/graph-builder.ts` line 2 reaches
`GraphBuildResult`, contradicting "Ports are depended upon, never depending". Not on #469's list, not this
slice's. Named here because inventory that found it is in this record — measurement nobody wrote down gets
taken again.

**Gate read prose as code; repaired not recorded.** First cut of slice extracted specifiers from raw source,
`moduleSpecifier` accepts any `from`, `import`, `require` a quotation mark follows → comment naming module path
read as import. Executed against shipped scan: `contract/` module whose only mention of layer was line comment
`used to read from "../domain/outcome"` returned one `inward domain import` with no import in file; `ports/`
module with same shape in doc comment returned one too. This repository quotes module paths in prose
constantly, including two paragraphs above → gate would have gone red on documentation edit and been deleted
for it. Defect in gate a slice adds is that slice's defect, not follow-up, so `importSpecifiers` now reads code
through `withoutComments` and both predicates inherit it. Repair narrows where prose concerned, widens in one
place: comment interposed between `import` and specifier now seen — first cut listed as blind spot, never one
for static import since caught by its `from`. Independent pass then found one other place a comment opener
lives in code: regular-expression literal. Executed against shipped scan, `const p = /[/*]/;` followed by
`import("../domain/x")` read as clean file — `/*` inside character class opened block comment swallowing
import. `withoutComments` now reads regular-expression literal whole, deciding literal from division by
previous token as lexer does, replacing with empty string → specifier-shaped pattern such as
`/from "../domain/x"/` no longer read as import. Approximation errs one named direction: literal directly after
`)` of `if (…)` head reads as division.

**Anchor admitted two spellings stepping around it.** Measured with predicates executed: `./../domain/track`
and bare `../domain` returned `false` while `../domain/track` returned `true`. Neither a spelling formatter
produces — reason worth refusing rather than recording: anchor a reviewer-invisible character defeats reports
clean boundary it does not have. Both refused now, anchor stays at front → `../domain-helpers`, `../domainfoo`
still clean. Independent pass found same sentence true of three more, executed against shipped predicates:
`.././domain/x`, `..//domain/x`, `../lang/../domain/x` all read clean while resolving to `../domain/x`.
Widening pattern once per spelling = chase this record argues against, so `importSpecifiers` now canonicalises
every specifier with `posix.normalize` after mapping backslashes, both anchors test spelling module resolution
reaches. Folds leading `./` too → anchors no longer spell it, exact other direction:
`../domain/../lang/outcome` normalises to `../lang/outcome`, stays clean because never reaches layer.

**Three spellings stay invisible, all three concrete.** Configured alias and computed specifier past reach of
any pattern over source text. Template-literal delimiter is not past it → the one later slice can close
without first deciding what unresolvable specifier means: delimiter class admits apostrophe, quotation mark,
nothing else. None appears under `packages/core/src` today, measured over this scanner's own walk, so gate not
red; template form named here not widened here because widening refusal set past measured defect is not what
placement record does.

**One file kind read without its grammar.** `withoutComments` knows string, template, comment delimiters,
nothing of JSX, while scanner walks `.tsx`. `/*` in JSX element text opens comment swallowing rest of file,
`//` there hides rest of line → import after either reads absent. No `.tsx` file under `packages/` today →
gap latent, named in extractor's own doc comment not closed here: repair is JSX lexer or refusal of `.tsx` in
layers these gates read, either a decision about what scanner accepts, not correction of what it reads.

**One spelling still read too eagerly.** Specifier-shaped phrase inside string literal, e.g.
`"read from '../domain/track'"`, still false positive: comments erased, literals not, because literal is where
specifier lives. Prose lives in comments in this tree, no such string exists. Narrowing wants keyword's own
statement not tighter delimiter class — own slice.

## Alternatives rejected

**Put algebra in `contract/`.** Destination ADR-099 named plausible, shortest relative paths. Rejected on
ADR-099's own ground, then one of its own: `graph/` and `runtime/` would depend on `contract/` for value used
purely as language primitive, `MigrationResult`'s `E` would point at sibling inside own layer while
`ValidationResult`'s pointed at same file from outside it. Two-owners smell with shorter paths, not answer.

**Keep in `domain/`, correct ARCHITECTURE instead.** Rejected. Makes cycle permanent, writes single-file
exception into sentence four other layers held to. ADR-099 rejected same shape for sink, nothing in reasoning
changed.

**Move module, keep `E = Diagnostic` default.** Cheapest version of slice, worth rejecting out loud: default
_is_ the dependency. `lang/` module importing `contract/v5` to supply default not dependency-free, gate this
slice adds would refuse one layer over. Keeping bought ten shorter type spellings at cost of invariant move
exists for.

**Recover brevity with `type DiagnosticOutcome<T> = Outcome<T, Diagnostic>` in `contract/`.** Rejected. Second
name for one type, every site it would serve already has name: `ValidationResult`, `TrackValidationResult`,
`ResolvedEdge`, `GraphOrderResult`. Alias between type and its own alias = owner nobody asked for.

**Widen gate to `adapters/` too.** Rejected in this slice, measured first: red on three files. Recorded as
#474 rather than exemption list here; ADR-105 later removed three imports, widened gate.

## Consequences

`contract -> domain` zero. ARCHITECTURE section 2's contract-layer claim now enforced by gate not asserted by
sentence; same rule covers `ports/`, already clean with nothing keeping it that way.

Reader of `ValidationResult` sees error type it carries at own declaration instead of one file away;
`Outcome<T, undefined>` now something caller writes deliberately, not something default hides.

Ten type spellings twelve characters longer. Price of invariant, stated not absorbed.

`lang/` holds two modules, still dependency-free: `lang/outcome.ts` imports `./exhaustive` and nothing else —
moved case asserts by reading module's own specifiers.

`contract/` or `ports/` module reaching any `domain/` module now fails `boundary-scan`, where before only exact
retired sink path did. At this record's acceptance `W-8` measured both rules and their asymmetry; ADR-105
replaced adapter half with broad rule.

`stryker.config.json` mutate list never named `domain/outcome.ts`, does not name new path either.
[Issue #419](https://github.com/chahyasantoso/motion5/issues/419) still owns that baseline, no threshold moves
here.

## Evidence

`packages/core/test/unit/lang/outcome.test.ts` gains one case: `export type Outcome<T, E> =` present,
`E = Diagnostic` absent, no `../contract/` or `../domain/` specifier in module. Read through `code()` → comment
cannot satisfy it; `member()` read of `readOutcome` still ends at `unreachable(outcome)`. Red on `main`, where
declaration carries default and line 1 carries import. Seven pre-existing cases move unchanged except naming
`Diagnostic` where previously taken from default.

**Historical evidence for this record before ADR-105; adapter expectations superseded.**
`packages/core/test/unit/scripts/boundary-scan.test.ts` then carried three things. `W-8` rewritten to plant one
file per layer with _different_ imports: `contract/` and `ports/` reach ordinary domain modules, refused for
reaching `domain/` at all; `adapters/` reaches retired sink, refused by name; expected list still exactly three.
One file per layer because `walk` does not sort — two files in one layer would make assertion depend on
`readdir` order. Sibling case plants adapter reaching `domain/keyframe-compiler`, asserts clean scan — half of
asymmetry explaining why broad rule stops where it does. Direct predicate case drives both predicates over
thirteen specifiers covering `lang/`, `contract/`, longer sibling name, package specifier, computed specifier,
both path separators, three suffixes. Two further cases own repair above: one that prose in line comment, doc
comment, trailing comment after regular-expression literal, comment interposed into statement is read as
statement means it; one that every anchor-stepping spelling, including doubled separator, interior `./`,
interior `..`, is refused while longer sibling directory and path leaving `domain/` again stay clean. Removing
canonicalisation turns that case red and only that case — executed, not argued. Second planted scan carries
same prose case through shipped scanner not predicate, because scan is what CI runs; red before extraction read
code, where that one file alone turned gate red.

Cases in `boundary-scan.test.ts` were **executed**, all twenty-six — stronger claim than any checkpoint on
issue #469 made, direct answer to lesson #472 recorded (no scanner here runs a test). So twenty-five in
`session-status-shape.test.ts`, making **Read against** line and byte ceiling in rewritten status measured
statement not replayed. Executed again on reconciled tree cut from `main` at `83b41a6c`, with
`adr-integrity.test.ts` (proves one number per record after renumbering) and `checkpoint-policy.test.ts`.
Environment named because it bounds claim: Node 22 with `--experimental-strip-types`, hand-written `describe`,
`it`, `expect` shim, not `vitest` → matcher this suite uses that shim implements differently would not be
caught. `outcome.test.ts`, `plugins.test.ts` could not execute: `test/helpers/source-region.ts` imports
TypeScript compiler, no package installable here; assertions replayed by hand against real modules, including
`member`'s indent argument — read that silently refused region in `cp006`. Planted scans **executed** against
ADR-103 scanner in throwaway tree, not merely written; ADR-105 changes adapter expectations below. `W-8`
returned `contract/leak.ts: inward domain import`, `ports/leak.ts: inward domain import`,
`adapters/leak.ts: retired domain sink import`, in that order. Adapter case returned empty array.
Thirteen-specifier case executed against shipped predicates, zero divergences from what it asserts.

`node scripts/boundary-scan.mjs`, `node scripts/read-budget-scan.mjs`, `node scripts/acceptance-scan.mjs`,
`node scripts/raw-template-scan.mjs` run on exact tree this slice produces, all four pass. No added line in
any `.ts` or `.mjs` file exceeds 100 columns, measured over added lines. Markdown not held to that number, and
this record was wrong to claim it was: `proseWrap` is `preserve`, `docs/FORMATTING.md` asks for paragraph on
one line or hand wrap under 100 columns → prose here one line per paragraph like every record beside it. No new
evidence-case id introduced, so id series and `docs/acceptance-map.json` untouched.

Not claimed, required CI authority for all of it: no `npm`, `vitest`, `tsc` run backs statement here, shim runs
named are not `vitest` runs. `prettier --check` run with retained 3.6.2 under `.tools/prettier` over every path
this slice touches — formatter CI pins, but not CI's `format:check`. None of rest installable in preparing
environment, no network, so `typecheck` and every "red on `main`" claim above are claims about what
checked-in case asserts rather than observed failures, except where predicate executed and output quoted.
Relocation's type correctness rests on reading every use site not a compiler: four inferred constructor calls
left inferred precisely because removing default cannot change inference that already succeeds.
