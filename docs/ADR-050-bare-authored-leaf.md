# ADR-050: an authored leaf is the stops themselves, or a static value

**Status:** accepted  
**Date:** 2026-08-23  
**Closes:** issue [#192](https://github.com/chahyasantoso/motion5/issues/192)

This record amends ADR-049 by replacing the shape of a leaf, not the shape of a group. ADR-049 is not edited: its two reserved sections, its exact group detection, and its refusal of the pre-ADR-049 form all survive unchanged. What changes is what may appear _inside_ `values`, and what may appear as a flat authored property.

## Context

`AuthoredProperty` was `{ readonly stops: readonly AuthoredStop[] }` and had never carried anything else. The wrapper object existed purely to hold one array, with no sibling field it was ever needed to protect.

The cost was visible in the shipped walker demo rather than hypothetically:

```text
length: { stops: [ { p: 0, v: 62 }, { p: 1, v: 62 } ] }
```

Two identical stops, authored specifically to express a value that never changes. That is a bone length pretending to be an animation, and it was authored thirteen times.

There were two separable problems in that line. The wrapper is the syntactic one. The interesting one is that a genuinely static leaf entered the percent map, took a tween var, and contributed to `gsap.to()`, all to hold still, which contradicts the merge pipeline's own stated goal of one tween per element regardless of property count.

## Decision

**A leaf is a bare array of stops, or a bare static value.** The `{ stops: [...] }` wrapper is retired, not kept as an accepted alias.

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

Five things follow, and they are why this is one decision rather than five.

**The static domain is closed to a finite number, string, or boolean, and that is forced rather than chosen.** Scope item 1 of the issue asked whether to leave it open to any JSON value. It cannot be left open. Refusing `{ stops: [...] }` by name requires that an object at a leaf position mean exactly one thing: a mistake. If an object were a legal static value then the retired wrapper would be a legal static value, and the refusal would have nothing to fire on. `null` and `undefined` are excluded because omitting the key already spells absence, and a non-finite number is excluded for the same reason `AuthoredStop.p` requires one.

**`ease` becomes unrepresentable on a static value by shape.** A scalar has no slot to write one into, so "a static value with a meaningless `ease`" is not a thing a validator has to catch. This is the same category of fix as the `yoyo`-without-`repeat` refusal, one step earlier: the shape, not the rule.

**A static leaf bypasses compilation rather than normalizing into it.** This is the central decision the issue asked for and deliberately left open, and the answer is bypass. A static leaf contributes no percent-map entry, no `CompiledProperty`, no tween var, and no `gsap.to()` call, and it can never trigger `plugin-contribution-ease-collision`. It contributes exactly one `initial` entry.

`initial` is its whole publication path, and that is what makes the bypass free rather than a special case: both GSAP interpolators already seed their proxy with `{ ...compiled.initial }` and expose that proxy as `state`, so a value that lands there and nowhere else is published at every progress at no cost. Neither adapter changes, and no injected `Interpolator` has to learn that static leaves exist. The decision is expressed on the compiler's output, so every implementation of the port inherits it.

Normalizing to an equivalent two-stop pair was the alternative. It would be the same runtime cost the wrapper already had, with nicer syntax, and the issue is right that the syntax alone would not be worth doing.

**One owner reads a leaf's shape.** `contract/authored-leaf.ts` exports `readAuthoredLeaf`, which classifies a leaf as `animated`, `static`, `empty`, `wrapper`, or `invalid`, and `readCompilableStops`, which answers the separate question of which stops survive to compilation. The two are separate functions because validation needs every stop the author typed in order to report a bad position at all, while the compiler needs only the ones that survive.

### Six read sites, not five

The issue's appendix names five, in four files, and all five are correct. There is a sixth, and it is the one that would have made the migration fail for a reason nobody could see.

**`src/testing/fakes.ts`, `readStops`.** `createFakeInterpolator` carried its own copy of the same check and built its published `state` only from what it found. It is not in the grep the appendix used because it tested `"stops" in property` rather than reading the property. Left alone, every migrated integration fixture would have published `undefined` for a static leaf while the validator and the compiler were both correct, and the failure would have read as a composition bug.

That site was already wrong before this issue touched anything, which is `LF-3`: the compiler filters a stop whose position does not parse, and the fake kept it and published a key the real pipeline never produces. Two copies of one predicate, already disagreeing.

### `looksLikeLegacyGroup` is rewritten, not trimmed

Appendix item 3 says the `Array.isArray(value.stops)` clause in `looksLikeLegacyGroup` is now dead and should be deleted. Half right, and the other half is a silent regression.

That predicate's real test is `names.every((name) => isObject(value[name]))`. A legacy group written against the new leaf forms has **arrays and scalars** for members, both of which `isObject` excludes by definition. Deleting only the dead clause would have made `{ fk: { length: [ { p: 0, v: 62 } ] } }` stop being recognised as the pre-ADR-049 form and be reported as a property of an unknown shape instead, which is exactly the misdiagnosis ADR-049 introduced the predicate to prevent.

So membership becomes "every member reads as a leaf" rather than "every member is an object", and the predicate gains an explicit `wrapper` bail, because the retired wrapper is an object whose one member is an array and would otherwise read as a one-leaf legacy group. The bail makes the two refusals independent of each other rather than dependent on the caller's branch order.

Appendix item 2 is correct as written. `isKeyframeGroup`'s clause is genuinely inert once the wrapper is gone: both canonical forms fail its `isObject` test before the section check runs, and the wrapper names no reserved section. It is deleted rather than left reading as load-bearing, and `LF-11` pins the behavior it used to guard.

### Rule ids

- `property-stops-wrapper` is new: the retired form, refused by name at the property's own path. Distinct rule id rather than folded into a generic shape error, on the naming precedent `keyframes-missing-values-section` and `observation-role-unsupported` set.
- `plugin-contribution-static-unsupported` is new: a static leaf on a prepare-stage contributor's key.
- `stops-shape` **keeps its id**, and that is a decision rather than an oversight. The animated form still _is_ stops, so "this is not a legal authored property" remains exactly what the rule says. Renaming it would churn the `plugin-contribution-stops-shape` alias in `domain/plugins.ts` and every citation of it across the contract suite for no semantic gain. Its message and its cited path are corrected instead.
- Every path a leaf diagnostic cites is now a path the author wrote. `stops-shape` used to append `.stops` to it, and a stop position reported at `keyframes.x.stops[0].p`; both named a member that no longer exists anywhere in a v5 document, so they are now `keyframes.x` and `keyframes.x[0].p`.

### The prepare-stage contribution path

`PluginContributor` is `(key, stops, track)`, and a static leaf has none. Consolidating the registry's read site therefore raises a question the issue does not ask: what does a `contribute` hook receive for `length: 62`?

Not an empty stop list. That is a field accepted and then ignored, which rule 6 of ADR-033 forbids, and it would read as a hook that ran and declined. A static leaf never enters compilation, so there is no percent grid for a contribution to land on, and it is refused as `plugin-contribution-static-unsupported`. The hook signature is unchanged, so this costs no churn across the contribution suite, and its blast radius today is zero because no static leaf existed before this record. A real prepare-stage use for a static value is a designed extension with its own issue rather than a hole left here.

### Ownership

Not one function moves layers, and the layering ADR-049 established is unchanged. Leaf shape is `contract/authored-leaf`. Authored legality is `contract/validate-v5`. Section names, group detection, and the legacy predicate stay in `contract/keyframe-shape`. Compilation, and therefore the static bypass, is `domain/keyframe-compiler`. Which plugin owns a leaf stays in `domain/plugins`. Topology stays in `graph/ir.ts`, whose diff is **empty** again.

Two things need no change, stated so they are not mistaken for omissions. `readPluginValues` and `flattenAuthoredKeyframes` are unaffected, because flattening is key routing and never inspects a leaf's contents: a leaf under a section reaches the compiler through the same path a flat one does and inherits both forms for free, which is scope item 8 answered. And `usesThreeD` keeps firing `perspective-usage`, because `isThreeDProperty` tests for a non-null value and both new forms are non-null.

## Alternatives rejected

**Keep the wrapper as an accepted alias.** Rejected on ADR-049's own reasoning and TR-A-08: two authoring shapes are two validation paths and two documentation paths.

**Normalize a static value into a two-stop pair.** Rejected as the central decision above. It is the same cost with better syntax, and the cost is the point.

**Leave the static domain open to any JSON value.** Rejected because it is incompatible with refusing the wrapper by name. An open domain makes `{ stops: [...] }` a legal static value.

**Rename `stops-shape`.** Rejected. The rule still says what it said, and the rename would churn one alias and every citation to express a distinction that does not exist.

**A static leaf as `{ value: 62 }`.** Rejected for the reason the wrapper is retired: a one-member object holding one scalar is the same mistake one level down.

## Consequences

The public surface changes in exactly one place. `AuthoredProperty` becomes `readonly AuthoredStop[] | AuthoredStaticValue`; that is the whole breaking change. `AuthoredStaticValue` is declared in `contract/v5.ts` and deliberately **not** re-exported from `packages/core/src/index.ts`, so no export map entry and no `allowedPublicExports` entry changes, and a consumer that needs to name a leaf names the union it already had. Verified by a green `boundaries` job and an unmodified `public-declaration-surface` gate.

`docs/TRD.md` needs no edit. No TR-D claim reaches inside a leaf.

## Sizing

This slice cannot be split into independently-green slices, for the reason ADR-049's own sizing section records: the root `tsconfig.json` includes `packages/**/*.ts` and `apps/**/*`, so a slice that changes `AuthoredProperty` without migrating the fixtures fails `typecheck`, and a slice that migrates the fixtures first has nothing to migrate to. The only seam between them is accepting both shapes for one pull request, which is what this record refuses.

What does split cleanly is the reader. `contract/authored-leaf.ts` landed first, as a pure refactor with all six sites routed through it and the wrapper still the only accepted form, in pull request [#193](https://github.com/chahyasantoso/motion5/pull/193). That slice changes no diagnostic, is seven semantic files, and reduces this one to a single function body plus a mechanical migration. It is also what makes this one reviewable: after it, "did the shape change correctly" is a question about one file.

This pull request is still over the twenty-file target, and the overrun is entirely the migration commit. The semantic surface outside it is nine files.

## Evidence

`packages/core/test/integration/bare-authored-leaf.test.ts`, plus the migrated suites.

- `LF-5` a bare array validates clean and interpolates to a mid-progress value.
- `LF-6` a bare static value loads, publishes, and holds at every progress, for a number, a string, and a boolean.
- `LF-7` a static leaf produces no `CompiledProperty` and no percent-map entry, and exactly one `initial` entry. The central decision, stated as an assertion.
- `LF-8` a static leaf contributes no `gsap.to()` call, observed through a recording double at the injected port rather than through a spy on the compiler, and is still published from the seeded proxy.
- `LF-9` the wrapper is `property-stops-wrapper`, is **not** `stops-shape`, and does not reach the compiler as a two-stop hold. The negative half is the case.
- `LF-10` `null`, `undefined`, `NaN`, `Infinity`, a function, and a non-wrapper object are each `stops-shape`, cited at the property the author wrote.
- `LF-11` a bare array, a number, a string, and a boolean are never read as a plugin group, and a `values` section holding both forms still is one. A guard, green on the parent.
- `LF-12` a legacy group written on either new leaf form is still `keyframes-missing-values-section`. The regression a dead-clause deletion would have caused.
- `LF-13` both forms are legal inside a `values` section, with the section-aware authored path, and a wrapper inside one is refused there too.
- `LF-14` a static leaf on a prepare-stage contributor's key is `plugin-contribution-static-unsupported`, and an animated leaf on the same key still runs the hook.
- `LF-15` `AuthoredProperty` is the union and `AuthoredStaticValue` is declared. Red in `typecheck` for the two type constants.
- `LF-16` no `.ts` file under `packages/` or `apps/` still authors the retired form. Migration completeness as a gate rather than a promise in a review.

`LF-16` scans code and deliberately not `docs/`. A document that refuses the retired form has to be able to name it, so scanning prose for the thing it documents would make the gate unsatisfiable. The `oracle/` tree is excluded for a different reason: it is the reference implementation, it sits outside the root `tsconfig` include, and nothing in it is ours to migrate.

Red before green is executed and archived rather than described. The `test(contract)` commit at the base of pull request [#194](https://github.com/chahyasantoso/motion5/pull/194) carries the `LF-5` through `LF-16` evidence alone, against the sources slice A left. Run [32607226240](https://github.com/chahyasantoso/motion5/actions/runs/32607226240), archived at `logs/32607226240/` on `ci-logs`, reports two failing jobs.

`quality` fails `typecheck` on two errors, which are `LF-15`: `Module '"../../src/contract/v5"' has no exported member 'AuthoredStaticValue'`, and `Type 'true' is not assignable to type 'false'`. `integration` reports `11 failed | 230 passed`.

The eleven are the assertion-level statement of the defect. `LF-5`, `LF-6`, and `LF-13` fail with `expected [ 'stops-shape' ] to deeply equal []`, which is the old runtime refusing both canonical forms. `LF-7` fails with `expected [] to deeply equal [ 'x' ]` and `LF-8` with `expected false to be true`, because on the parent nothing compiles at all rather than a static leaf compiling too much. `LF-9` and `LF-14` fail with `expected [] to deep equally contain ObjectContaining{…}`, because neither new rule id exists. `LF-10` fails on `expected 'keyframes.x.stops' to be 'keyframes.x'`, the path that cited a member no document has. `LF-12` fails with `expected [ 'stops-shape' ] to deeply equal [ 'keyframes-missing-values-section' ]`, which is the `looksLikeLegacyGroup` regression caught before it was written. `LF-16` enumerates the fifty-seven files that still author the retired form.

`LF-11` passed on that run, as a guard must. `boundaries`, `build`, `end-to-end`, and `performance` were all green, so the red is assertion-level rather than infrastructure-level, which is the distinction `docs/CI-WORKFLOW.md` requires of failing-first evidence.

The evidence series is `LF-`, and `evidence-case-ids.test.ts` widens its title pattern to admit the first two-letter prefix. That widening is forced rather than chosen: every single letter is already claimed, or excluded by that file's own rule against a letter a plan uses unhyphenated (`A3` and `A5` in the runtime mutation model, `X3` in the recovery audit), or unusable in a citation beside a digit (`I` and `O`). The `P-` paragraph in that file sets the policy the widening follows. `Y-` owns what a plugin group may contain; `LF-` owns what a leaf may be.
