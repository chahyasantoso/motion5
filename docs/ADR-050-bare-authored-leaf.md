# ADR-050: an authored leaf is the stops themselves, or a static value

**Status:** accepted  
**Date:** 2026-08-23  
**Closes:** issue [#192](https://github.com/chahyasantoso/motion5/issues/192)

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Bare arrays and static
values remain the two leaf forms, but only inside a plugin group's `values`; top-level bare leaf
now refused as `keyframes-ungrouped-key`.

Amends ADR-049: leaf shape replaced, group shape untouched. ADR-049 unedited — two reserved sections, exact group detection, refusal of pre-ADR-049 form all survive. Change: what may appear _inside_ `values`, and as flat authored property. **Superseded in part by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Bare leaf no longer flat authored property; only inside group's `values`. Top-level `opacity` below → `keyframes-ungrouped-key` (grouped: `style.values.opacity`); `fk.values` leaves beside it stay valid.

## Context

`AuthoredProperty` was `{ readonly stops: readonly AuthoredStop[] }`, never anything else. Wrapper held one array, protected no sibling field.

Cost visible in shipped walker demo, not hypothetical:

```text
length: { stops: [ { p: 0, v: 62 }, { p: 1, v: 62 } ] }
```

Two identical stops, authored to express a value that never changes. Bone length pretending to be animation, authored thirteen times.

Two separable problems. Wrapper syntactic. Interesting one: genuinely static leaf entered percent map, took tween var, contributed to `gsap.to()`, all to hold still — contradicting merge pipeline's goal of one tween per element regardless of property count.

## Decision

**A leaf is a bare array of stops, or a bare static value.** `{ stops: [...] }` wrapper retired, not kept as accepted alias.

```text
keyframes: {
  opacity: [ { p: 0, v: 0 }, { p: 1, v: 1 } ],
  fk: {
    values: {
      length: 62,
      rotation: [ { p: 0, v: -87 }, { p: 1, v: -87 } ],
    },
    requires: { base: "walk/pelvis" },
  },
}
```

Five things follow — why one decision, not five.

**Static domain closed to finite number, string, boolean — forced, not chosen.** Scope item 1 asked whether to open it to any JSON value. Cannot. Refusing `{ stops: [...] }` by name requires an object at leaf position to mean exactly one thing: a mistake. If object were legal static value, retired wrapper would be one, refusal would fire on nothing. `null`/`undefined` excluded — omitting key spells absence. Non-finite number excluded — same reason `AuthoredStop.p` requires one.

**`ease` unrepresentable on static value by shape.** Scalar has no slot for one → "static value with meaningless `ease`" nothing a validator must catch. Same category as `yoyo`-without-`repeat` refusal, one step earlier: shape, not rule.

**Static leaf bypasses compilation rather than normalizing into it.** Central decision issue left open; answer bypass. No percent-map entry, no `CompiledProperty`, no tween var, no `gsap.to()` call, never `plugin-contribution-ease-collision`. Exactly one `initial` entry.

`initial` is its whole publication path — why bypass free, not special: both GSAP interpolators seed their proxy with `{ ...compiled.initial }` and expose it as `state` → value landing there and nowhere else publishes at every progress at no cost. Neither adapter changes; no injected `Interpolator` must learn static leaves exist. Decision lives on compiler output → every port implementation inherits it.

Alternative: normalize to equivalent two-stop pair — same runtime cost wrapper had, nicer syntax; issue right that syntax alone would not be worth doing.

**One owner reads leaf shape.** `contract/authored-leaf.ts` exports `readAuthoredLeaf` (classifies `animated`, `static`, `empty`, `wrapper`, `invalid`) and `readCompilableStops` (which stops survive to compilation). Separate: validation needs every authored stop to report bad position at all; compiler needs only survivors.

### Six read sites, not five

Appendix names five, in four files, all correct. Sixth would have failed migration for reason nobody could see.

**`src/testing/fakes.ts`, `readStops`.** `createFakeInterpolator` carried own copy of check, built published `state` only from what it found. Absent from appendix's grep — tested `"stops" in property`, never read property. Left alone, every migrated integration fixture would publish `undefined` for static leaf while validator and compiler correct; failure reads as composition bug.

Already wrong before this issue touched anything — `LF-3`: compiler filters stop whose position does not parse; fake kept it, published key real pipeline never produces. Two copies of one predicate, already disagreeing.

### `looksLikeLegacyGroup` is rewritten, not trimmed

Appendix item 3: `Array.isArray(value.stops)` clause in `looksLikeLegacyGroup` dead, delete it. Half right; other half silent regression.

Predicate's real test: `names.every((name) => isObject(value[name]))`. Legacy group written against new leaf forms has **arrays and scalars** for members, both excluded by `isObject` by definition. Deleting only dead clause → `{ fk: { length: [ { p: 0, v: 62 } ] } }` no longer recognised as pre-ADR-049 form, reported as unknown-shape property — exactly misdiagnosis ADR-049 introduced predicate to prevent.

Membership becomes "every member reads as a leaf", not "every member is an object", plus explicit `wrapper` bail: retired wrapper is an object whose one member is an array, otherwise read as one-leaf legacy group. Bail makes the two refusals independent of caller branch order.

Appendix item 2 correct. `isKeyframeGroup`'s clause inert once wrapper gone: both canonical forms fail its `isObject` test before section check; wrapper names no reserved section. Deleted rather than left reading as load-bearing; `LF-11` pins guarded behavior.

### Rule ids

- `property-stops-wrapper` new: retired form, refused by name at property's own path. Distinct id, not generic shape error, on `keyframes-missing-values-section` / `observation-role-unsupported` naming precedent.
- `plugin-contribution-static-unsupported` new: static leaf on prepare-stage contributor's key.
- `stops-shape` **keeps its id**, deliberately. Animated form still _is_ stops → "not a legal authored property" still exactly what rule says. Renaming churns `plugin-contribution-stops-shape` alias in `domain/plugins.ts` and every contract-suite citation for no semantic gain. Message and cited path corrected instead.
- Every path a leaf diagnostic cites is now one author wrote. `stops-shape` used to append `.stops`; stop position reported at `keyframes.x.stops[0].p` — both named member existing nowhere in v5 document. Now `keyframes.x` and `keyframes.x[0].p`. **Refined by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** Leaves grouped → paths now `keyframes.<plugin>.values.x` and `keyframes.<plugin>.values.x[0].p`.

### The prepare-stage contribution path

`PluginContributor` is `(key, stops, track)`; static leaf has none. Consolidating registry's read site raises question issue does not ask: what does `contribute` receive for `length: 62`?

Not empty stop list — field accepted then ignored, which rule 6 of ADR-033 forbids, reading as hook that ran and declined. Static leaf never enters compilation → no percent grid for contribution to land on; refused as `plugin-contribution-static-unsupported`. Hook signature unchanged → no churn across contribution suite; blast radius zero today, no static leaf existed before this record. Real prepare-stage use for static value is designed extension with own issue, not hole left here.

### Ownership

No function moves layers; ADR-049's layering unchanged. Leaf shape: `contract/authored-leaf`. Authored legality: `contract/validate-v5`. Section names, group detection, legacy predicate: `contract/keyframe-shape`. Compilation, with static bypass: `domain/keyframe-compiler`. Plugin ownership: `domain/plugins`. Topology: `graph/ir.ts`, diff **empty** again. **Refined by [ADR-105](./ADR-105-adapters-do-not-depend-on-domain.md), 2026-09-23.** Compilation, with static bypass, now in `contract/keyframe-compiler.ts` beside leaf-shape owner; `domain/keyframe-compiler.ts` gone. Reasoning unchanged; only module moved.

Two things need no change, stated so not mistaken for omissions. `readPluginValues` and `flattenAuthoredKeyframes` unaffected: flattening is key routing, never inspects leaf contents → leaf under a section reaches compiler by same path flat one does, inherits both forms for free — scope item 8 answered. `usesThreeD` keeps firing `perspective-usage`: `isThreeDProperty` tests non-null, both new forms non-null.

## Alternatives rejected

**Wrapper as accepted alias.** Rejected on ADR-049's reasoning and TR-A-08: two authoring shapes = two validation paths, two documentation paths.

**Normalize static value into two-stop pair.** Rejected as central decision: same cost, better syntax, cost is the point.

**Static domain open to any JSON value.** Rejected: incompatible with refusing wrapper by name — open domain makes `{ stops: [...] }` legal.

**Rename `stops-shape`.** Rejected: rule says what it said; rename churns one alias and every citation for distinction that does not exist.

**Static leaf as `{ value: 62 }`.** Rejected for wrapper's reason: one-member object holding one scalar is same mistake one level down.

## Consequences

Public surface changes in exactly one place: `AuthoredProperty` becomes `readonly AuthoredStop[] | AuthoredStaticValue` — whole breaking change. `AuthoredStaticValue` declared in `contract/v5.ts`, deliberately **not** re-exported from `packages/core/src/index.ts` → no export map entry, no `allowedPublicExports` entry changes; consumer naming leaf names union it already had. Verified by green `boundaries` and unmodified `public-declaration-surface` gate.

`docs/TRD.md` needs no edit. No TR-D claim reaches inside a leaf.

## Sizing

No independently-green split, for reason ADR-049's sizing section records: root `tsconfig.json` includes `packages/**/*.ts` and `apps/**/*` → changing `AuthoredProperty` without migrating fixtures fails `typecheck`; migrating fixtures first has nothing to migrate to. Only seam is accepting both shapes for one pull request, which this record refuses.

Reader splits cleanly. `contract/authored-leaf.ts` landed first — pure refactor routing all six sites through it, wrapper still only accepted form — in pull request [#193](https://github.com/chahyasantoso/motion5/pull/193). Slice changes no diagnostic, is seven semantic files, reduces this one to single function body plus mechanical migration. Makes this reviewable: after it, "did shape change correctly" is one-file question.

Still over twenty-file target; overrun entirely migration commit. Semantic surface outside it: nine files.

## Evidence

`packages/core/test/integration/bare-authored-leaf.test.ts`, plus migrated suites.

- `LF-5` bare array validates clean, interpolates to mid-progress value.
- `LF-6` bare static value loads, publishes, holds at every progress — number, string, boolean.
- `LF-7` static leaf: no `CompiledProperty`, no percent-map entry, exactly one `initial` entry. Central decision as assertion.
- `LF-8` static leaf: no `gsap.to()` call — recording double at injected port, not compiler spy — still published from seeded proxy.
- `LF-9` wrapper is `property-stops-wrapper`, **not** `stops-shape`, never reaches compiler as two-stop hold. Negative half is the case.
- `LF-10` `null`, `undefined`, `NaN`, `Infinity`, function, non-wrapper object: each `stops-shape`, cited at authored property.
- `LF-11` bare array, number, string, boolean never read as plugin group; `values` section holding both forms still one. Guard, green on parent.
- `LF-12` legacy group on either new leaf form still `keyframes-missing-values-section`. Regression a dead-clause deletion would have caused.
- `LF-13` both forms legal inside `values`, with section-aware authored path; wrapper inside one refused there too.
- `LF-14` static leaf on prepare-stage contributor's key → `plugin-contribution-static-unsupported`; animated leaf on same key still runs hook.
- `LF-15` `AuthoredProperty` is the union, `AuthoredStaticValue` declared. Red in `typecheck` for the two type constants.
- `LF-16` no `.ts` under `packages/` or `apps/` authors retired form. Migration completeness as gate, not review promise.

`LF-16` scans code, deliberately not `docs/`: document refusing retired form must name it → scanning prose for documented thing would make gate unsatisfiable. `oracle/` excluded — reference implementation, outside root `tsconfig` include, nothing ours to migrate.

Red before green executed and archived, not described. `test(contract)` commit at base of pull request [#194](https://github.com/chahyasantoso/motion5/pull/194) carries `LF-5`–`LF-16` evidence alone, against sources slice A left. Run [32607226240](https://github.com/chahyasantoso/motion5/actions/runs/32607226240), archived at `logs/32607226240/` on `ci-logs`, reports two failing jobs.

`quality` fails `typecheck` on two errors, `LF-15`: `Module '"../../src/contract/v5"' has no exported member 'AuthoredStaticValue'`, and `Type 'true' is not assignable to type 'false'`. `integration` reports `11 failed | 230 passed`.

Eleven are the assertion-level statement of the defect. `LF-5`, `LF-6`, `LF-13` fail with `expected [ 'stops-shape' ] to deeply equal []` — old runtime refusing both canonical forms. `LF-7` fails `expected [] to deeply equal [ 'x' ]`, `LF-8` `expected false to be true` — on parent nothing compiles at all, rather than static leaf compiling too much. `LF-9`, `LF-14` fail `expected [] to deep equally contain ObjectContaining{…}` — neither new rule id exists. `LF-10` fails `expected 'keyframes.x.stops' to be 'keyframes.x'` — path citing member no document has. `LF-12` fails `expected [ 'stops-shape' ] to deeply equal [ 'keyframes-missing-values-section' ]` — the `looksLikeLegacyGroup` regression caught before it was written. `LF-16` enumerates fifty-seven files still authoring retired form.

`LF-11` passed, as a guard must. `boundaries`, `build`, `end-to-end`, `performance` all green → red is assertion-level, not infrastructure-level — distinction `docs/CI-WORKFLOW.md` requires of failing-first evidence.

Evidence series `LF-`; `evidence-case-ids.test.ts` widens its title pattern to admit first two-letter prefix. Forced, not chosen: every single letter claimed, excluded by that file's rule against a letter a plan uses unhyphenated (`A3`, `A5` in runtime mutation model; `X3` in recovery audit), or unusable beside digit (`I`, `O`). `P-` paragraph sets policy the widening follows. `Y-` owns what plugin group may contain; `LF-` owns what leaf may be.
