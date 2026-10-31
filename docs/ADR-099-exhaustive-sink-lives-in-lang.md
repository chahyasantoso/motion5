# ADR-099: The exhaustive sink lives in the layer-free language module

**Status:** Accepted, 2026-09-21

## Context

ADR-092 placed `unreachable` in `packages/core/src/domain/exhaustive.ts`, rejected `lang/` because
`scripts/boundary-scan.mjs` did not name new directory → "unscanned rather than safe". Objection correct when
written. Also conditional on scanner's layer list, not property of `lang/` — condition one slice can remove not
reason to keep paying.

Census re-measured not carried forward, #462's body count gone stale. Sink has **thirty-three** value importers under
`packages/core/src`, **eleven** under `packages/core/test` — forty-four total, body said fourteen.

Recorded debt named one violation, `ports/trigger-factory.ts`. Measured set **seven** source files across **three**
layers ARCHITECTURE section 2 says may not depend on domain: `contract/authored-leaf.ts`,
`contract/keyframe-shape.ts`, `contract/patch-render.ts`, `contract/validate-v5.ts`, `ports/trigger-factory.ts`,
`adapters/trigger-factory/loop-cycle.ts`, `adapters/trigger-factory/time-driver.ts`. Contract cases sharpest: two other
files same layer, `contract/rule-id.ts`, `contract/rule.ts`, each carry "`domain/exhaustive` is deliberately not
imported, because the contract layer does not read the domain layer for a totality it can state in the type." Four
files in layer did exactly that. Both comments corrected this slice: conclusion each draws still right, reason each
gave not.

Placement also bought second owner. `packages/react/src/patch-store.ts` declared private
`unhandledLifecycle(value: never): never` with sink's body byte for byte; reason on record: sink lived in private core
layer → importing from another package traded missing invariant for layer violation. Two answers to "which variant was
not decided" = defect project says it cares about most, old placement produced it.

## Decision

Sink moves to `packages/core/src/lang/exhaustive.ts`, mirrored test to
`packages/core/test/unit/lang/exhaustive.test.ts` — test still beside subject as own doc comment claims. `lang/`
dependency-free, holds nothing about this project, named in `scripts/boundary-scan.mjs` as scanned core directory in
same change creating it. ARCHITECTURE section 2 states exception in sentence reader derives rule from, section 12 lists
directory.

Scanner gains one rule: `contract/`, `ports/`, `adapters/` module importing retired `domain/exhaustive` path =
violation. Adapters scanned first time as consequence, external-engine imports exempt from renderer/engine rule — two
of seven violators adapter files, rule unable to see them not rule.

Private React sink deleted. `unreachable` exposed on unadvertised `@motion5/core/internal` entry beside `liveOrAbsent`
— precedent exactly this: partition whose narrowing outside module owes shipped with function discharging it. Public
`@motion5/core` entry, package export map, boundary allow-list unchanged.

Supersedes one paragraph of ADR-092: why sink lives in `domain/`, why `lang/` rejected. Nothing else superseded —
including decision that read of closed union names every variant and ends at shared `never` sink, semantics, rejected
alternatives, phase table, tag ownership, consequences, evidence. Sink's name, signature, message text, throw
byte-identical after move.

## What this does not fix, measured rather than assumed

New gate narrower than inward-dependency sentence it serves, gap stated not left for reader. **Historical at
acceptance; superseded by [ADR-103](./ADR-103-the-outcome-algebra-lives-in-lang.md) and
[ADR-105](./ADR-105-adapters-do-not-depend-on-domain.md), 2026-09-23.** Three adapter imports named below gone: GSAP
consumes contract compiler, renderer metadata lives in ports. Broad `importsDomainLayer` gate now covers adapters;
`importsDomainSink` deleted. Narrower measured gate, exception reasoning, surviving-import counts below explain original
decision not current code.

Five inward imports into domain survive this slice, named in full — none named by survey, #451's plan, #462's
follow-up list. Three value imports, same violation sink was: `contract/migrate-v4-to-v5.ts`,
`contract/validate-v5.ts` import `acceptedOutcome`, `refusedOutcome` from `domain/outcome`;
`adapters/interpolator/gsap.ts` imports `compilePercentKeyframes` from `domain/keyframe-compiler`. Two type-only, erase
at build: `adapters/dom.ts` imports `RenderMetadata` from `domain/plugins`, `adapters/index.ts` re-exports it. Predicate
over every `domain/` import from those three layers red on tree it was added to; gate introduced red = gate getting
exemption list instead of fix. Rule refuses exact regression move exists to prevent, no more — predicate's own doc
comment says so where future implementor reads. **Refined by
[ADR-103](./ADR-103-the-outcome-algebra-lives-in-lang.md), 2026-09-22.** Three survive not five: `domain/outcome` pair
below gone — algebra moved to `lang/`, default making it reach `contract/` deleted with it. Three adapter imports this
paragraph names unchanged, owned by [issue #474](https://github.com/chahyasantoso/motion5/issues/474). Reasoning stands
in full, including why gate introduced red earns exemption list: ADR-103 widened to `contract/` and `ports/` only once
both provably empty, left `adapters/` on this narrower one for exactly reason stated here.

`domain/outcome` pair interesting one, real slice not tidy-up: `Outcome<T, E = Diagnostic>` defaults error type to
contract type → question whether outcome algebra ever domain knowledge, or belongs in `contract/` beside diagnostic it
carries. Phases 4a, 4b of #451 created both imports, neither asked. Move not path rewrite either: `Outcome` declared
shape of public `ValidationResult`, `MigrationResult`. Needs own measurement, own record, not relocation slice.
**Answered by [ADR-103](./ADR-103-the-outcome-algebra-lives-in-lang.md), 2026-09-22.** Measurement says neither: module
read no Track, Motion, plugin, value snapshot, only project-specific tokens default + import serving it → algebra never
domain knowledge; `contract/` refused on this record's own ground — language-level primitive not a contract project
offers anyone. Lives in `lang/` with no default, `ValidationResult`/`MigrationResult` stay declared where they were,
deferral recorded here correct rather than superseded.

## Alternatives rejected

**Keep sink in `domain/`, correct ARCHITECTURE instead.** Cheapest, drafted: state exception, delete contradiction,
leave file. Rejected: makes duplicate in `packages/react` permanent. Exception second package cannot use = exception
costing second owner, no ARCHITECTURE wording pays back.

**Private copy in `ports/` or React.** Rejected same ground, more sharply: #462's own follow-up text called it "worse: a
second owner of the sink."

**Add `lang/` without touching scanner.** Rejected: ADR-092's objection correct while directory unscanned. This slice
removes condition rather than disagreeing with reasoning — only honest way reopening recorded decision.

**Sink in `contract/`.** `contract/` innermost layer, every layer already reaches it → shorter relative paths. Rejected:
`contract/` owns authored schema and public types, language-level primitive not contract project offers anyone. Also
leaves `ports/` depending on `contract/` for value not type — same violation, different destination.

**Widen gate to every `domain/` import.** Rejected, measured first: fails on five current files. Recorded above as own
slice rather than exemption list here.

## Consequences

All forty-four importers use new path. Contract, ports, adapters no longer reach into domain for helper; two contract
comments denying it now true of own layer.

`packages/react` has no `never` sink of own. `unhandledLifecycle` gone, both lifecycle switches in `patch-store.ts` end at
shared owner, widened-union probe in `patch-store-lifecycle.test.ts` still fails `typecheck` against sink not local copy.

Internal entry gains one repository-only export. No public export, export-map entry, allow-list entry moves.

Adapters now scanned → banned-compatibility-symbol rule reaches them first time. Green today; future adapter carrying
one of those names fails where previously would not.

Historical records keep old path where describing placement existing when written. ADR-093 governs, archived
implementation plans under `docs/archived/` left as authored. Three live records carrying old path corrected later, in
#470: ADR-092 took supersede annotation this record already claimed existed, plus two real module paths; ADR-094,
ADR-098 one path correction each. Distinction ADR-093 draws: archived record immutable, live one corrected where it
states something false about today's tree. This record stays superseding pointer for placement paragraph, ADR-092's
decision text annotated not rewritten.

## Evidence

`packages/core/test/unit/scripts/boundary-scan.test.ts` carries `W-8`: planted tree with one `contract/`, one `ports/`,
one `adapters/` module importing `../domain/exhaustive` yields exactly three violations from shipped scanner. Case gated
by existing `W-` series alternation in `packages/core/test/unit/scripts/evidence-case-ids.test.ts`, owning
entrypoint-tier and scanner-surface cases. Case beside it runs shipped scanner against real tree, expects no violations —
proves `lang/` path passes; fixture cannot prove that about directory it invents.

`node scripts/boundary-scan.mjs`, `node scripts/read-budget-scan.mjs`, `node scripts/acceptance-scan.mjs` run on exact
tree this slice produces, all three pass. Typecheck run with TypeScript 5.6.3 against repository pinned at 5.8.3 — one
gate forty-four-file path rewrite most needs — introduced no error beyond fixed environmental baseline measured on
pre-change tree.

Not claimed: no Vitest run, no Prettier run. Neither exists in preparing environment, no network to install →
`format:check` and every assertion above about what case does at run time = claims about what checked-in case asserts,
verified by required CI on published commit rather than locally.
