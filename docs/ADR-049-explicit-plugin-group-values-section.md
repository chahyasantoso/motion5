# ADR-049: a plugin group has two reserved sections, and `values` is one of them

**Status:** accepted  
**Date:** 2026-08-22  
**Closes:** issue [#177](https://github.com/chahyasantoso/motion5/issues/177)

This record amends ADR-041 and ADR-044 by replacing the group's authored shape. Neither is edited: each records the decision that was correct when it was made, and this record supersedes ADR-044's "a `values` wrapper beside `requires`" rejection.

## Context

ADR-044 reserved `requires` inside a plugin-named group and left the animated properties at the group top level. It rejected a `values` wrapper for one reason, stated in its own alternatives section:

> `isKeyframeGroup` is structural and registry-free by design, so a group whose sole leaf is named `values` is indistinguishable from a wrapper, and making the wrapper optional would leave two legal group shapes forever.

Both halves of that are true, and both stop being true the moment `values` is reserved by name. The ambiguity is not a property of the wrapper; it is a property of leaving one spelling authorable in two roles. `requires` had exactly the same problem and it was solved the same way, in the same module, three ADRs earlier.

The result of leaving the leaves at the top level was a group that mixed two domains: authored properties the plugin consumes, and graph bindings the plugin owns. It also left group detection a heuristic. `isKeyframeGroup` asked whether every value was an object, which is a guess: a typo'd property with no `stops` read as a group, and the diagnostic then named the group rather than the mistake.

## Decision

**`values` is a reserved section name, exactly like `requires`.** One rule, one module, one reason.

```text
keyframes: {
  opacity: { stops: [ ... ] },
  fk: {
    values: {
      length: { stops: [ ... ] },
      rotation: { stops: [ ... ] },
    },
    requires: { base: "walk/pelvis" },
  },
}
```

A group has exactly two possible members and nesting stays one level inside `values`. Six things follow, and they are why this is one decision rather than six.

**Group detection becomes exact.** `isKeyframeGroup` is now "an object with no `stops` array that names at least one reserved section". No registry, no guess. `some` rather than `every`, so a group carrying an unknown sibling is still read as a group and reported as an unknown section instead of being misdiagnosed.

**An unknown section is diagnosable.** Any key inside a group that is neither `values` nor `requires` is `keyframes-unknown-section`, and the message names both legal sections from `PLUGIN_GROUP_SECTIONS` rather than from a hardcoded string.

**The old heuristic gets an honest job.** Its body survives as `looksLikeLegacyGroup`, and it is no longer detection: it exists so a document written against the pre-ADR-049 shape is refused as `keyframes-missing-values-section` rather than as a property with no stops array.

**The type says what a group is.** `AuthoredPluginGroup` stops being `Readonly<Record<string, AuthoredPluginMember>>` and becomes two optional named members. `AuthoredPluginMember` is deleted with the escape hatch it served.

**"`values` is the only compiled value domain" becomes structural.** `flattenAuthoredKeyframes` reads the `values` section and nothing else, so the `requires` skip it used to need is deleted rather than maintained. `requires` is not a sibling of the leaves any more; there is nothing to skip.

**The wrapper is required, in v5, now.** Not optional, no migration window, no schema v6. Scope item 8 of the issue supplies the reason itself: two authoring shapes create two validation paths and two documentation paths, which TR-A-08 bans and rule 6 of ADR-033 forbids. The old form is refused with a dedicated rule id, never normalized.

The cost is that no author may animate a flat property named `values` and no plugin may claim that key at group level. Both are the existing `requires` precedent exactly, and the reservation is on section *position*: a leaf named `values` inside the section is an ordinary property, which `Y-8` pins.

### Ownership

Not one function moves layers. Section names, group detection, the legacy-form predicate, and the two section readers stay in `contract/keyframe-shape`. Authored legality stays in `contract/validate-v5`. Flattening stays in `domain/keyframe-groups`, still the one normalization owner. Which plugin owns a leaf and whether it declares a bound slot stay in `domain/plugins`, with no logic change. Source resolution, duplicate edges, self-reference, and cycles stay in `graph/ir.ts`, whose diff is **empty**.

`usesThreeD` is the one place where doing nothing would have been a silent regression. It iterated a group's own entries, which after this change are section names, so 3D content inside a group would have stopped being detected and `perspective-usage` would have stopped firing: a lost warning rather than a rejected project, and the exact regression the comment above that function already records having happened once. It reads `readPluginValues` now, and `Y-9` pins it.

### New and retired rule ids

- `keyframes-reserved-section` widens from `requires` alone to both section names.
- `keyframes-missing-values-section` is new: the pre-ADR-049 leaf form, refused by name.
- `keyframes-unknown-section` is new: anything else inside a group.
- `keyframes-values-shape` is new: the section is not an object.
- `keyframes-values-empty` is new: the section is an empty object. Omitting it is already how an author writes no properties, so an empty one is a field accepted and then ignored. Identical reasoning to `keyframes-requires-empty`.
- The four `keyframes-requires-*` ids are unchanged, and `keyframes-duplicate-key` and `keyframes-reserved-separator` now fire on `values` leaves.

No `keyframes-group-empty` is added, and that is a finding rather than an omission. A group of only unknown sections is already rejected by the unknown-section errors, and `{ fk: {} }` names no section at all, so it is not a group: it stays the accepted no-op property that `{ opacity: {} }` always was. `Y-6` guards it, because it is easy to break by accident.

## Alternatives rejected

**An optional wrapper with a migration window.** Rejected on the issue's own reasoning, plus TR-A-08. Two authoring shapes are two validation paths and two documentation paths, and "temporary" is not a property a schema can enforce.

**Normalize the legacy form silently.** Rejected by rule 6 of ADR-033 and by the same two-documentation-paths argument. A shape that is accepted is a shape that is authored.

**Keep detection heuristic and infer the wrapper.** Rejected because it is undecidable without a plugin registry the contract layer must not hold, which is the issue's own opening premise. This is the alternative ADR-044 chose, and reserving the name is what removes the premise rather than working around it.

**Defer to a schema v6.** Rejected. v5 is not shipped, TR-D-01 accepts v5 only, and both packages are private at `0.0.0`, so a version bump would buy a compatibility promise nobody is owed.

**A second reserved name such as `config` instead.** Not applicable here, and recorded because ADR-044 rejected it for `requires`: a section is named for what it is. `values` holds authored and interpolated values, and nothing else.

## Consequences

The public surface changes in exactly one place. `TrackDefinition` is exported and its `keyframes` type changes shape; that is the whole breaking change. `AuthoredPluginGroup`, `AuthoredPluginMember`, `AuthoredPluginRequires`, and `PluginRequiresBinding` are in neither `packages/core/src/index.ts` nor `allowedPublicExports` in `scripts/boundary-scan.mjs`, so **no export map, entrypoint, or boundary allow-list entry changes**. That is a finding, verified by a green `boundaries` job and a green `public-declaration-surface` gate, neither of which needed an edit.

`docs/TRD.md` needs no edit either. TR-D-02, TR-D-05 as corrected by issue #182, and TR-D-06 make no claim about a group's internals beyond `keyframes.<plugin>.requires.<slot>`, whose authored path is unchanged. Also a finding.

A group that authored nothing but bindings needs no migration at all. `remount`, `cross-motion`, and `phase4-dynamic-lifecycle` author `{ rig: { requires: { ... } } }`, which was already canonical because `requires` was already a reserved section. Their absent diff is `Y-11` stated as a fact about the repository.

Every diagnostic about a grouped leaf now cites the section: `keyframes.fk.values.length`. `FlattenedKeyframe.authoredPath` carries it, and `prepareContributions` reports through it, so a contribution failure inside a group reads the same way.

Evidence ids gain the `Y-` series, and `evidence-case-ids.test.ts` widens its title pattern to admit it. A citation the gate cannot see is not enforced.

## Sizing

This slice cannot be split into independently-green slices. The root `tsconfig.json` includes `packages/**/*.ts`, `demo/**/*`, and `apps/**/*`, and `npm run typecheck` runs `tsc --noEmit` across all of it, so a slice that changes `AuthoredPluginGroup` without migrating `apps/react-demo` fails `typecheck`, and a slice that migrates the demo without changing the type fails it too. The only seam that would separate them is accepting both shapes for one pull request, which is the dual semantics this record refuses by name.

## Evidence

`packages/core/test/integration/plugin-group-values-section.test.ts`, plus the migrated `F-`, `N-`, `Q-`, and `U-` suites.

- `Y-1` a group with both sections loads, its `values` leaves compile to unprefixed keys, and its `requires` section compiles to nothing. Asserted as a mid-progress value, not a clean load.
- `Y-2` the legacy leaf form is `keyframes-missing-values-section` at the group path, and **not** `stops-shape`. Half the case is the negative assertion.
- `Y-3` an unknown sibling is `keyframes-unknown-section`, once, and the message names both legal sections.
- `Y-4` a top-level `values` gets the same rule id a top-level `requires` already gets.
- `Y-5` `values` as an array, a string, or a number is `keyframes-values-shape`; as `{}` it is `keyframes-values-empty`.
- `Y-6` `{ fk: {} }` is still an accepted no-op property, not a group and not an error.
- `Y-7` a bad leaf inside the section reports at `keyframes.fk.values.length`, and `authoredPath` carries the section.
- `Y-8` a leaf named `values` inside the section is legal and resolvable. The reservation is on section position.
- `Y-9` `rotationY` inside the section still warns `perspective-usage`.
- `Y-10` one compiled key under two groups' sections is `keyframes-duplicate-key`, citing the second authored path.
- `Y-11` a bindings-only group still joins the composer chain and receives its scoped input. A guard, green on the parent.
- `Y-12` `AuthoredPluginGroup` declares `values` and `requires` and nothing else, and `AuthoredPluginMember` is gone from the declaring source.
- `Y-13` the walker rig composes the same world frame at p=0.5 through the section: pelvis at (100, 100), thigh at 135.355, shin at 173.992 and 145.708.

Red before green is executed and archived rather than described. The `test(contract)` commit at the base of pull request [#190](https://github.com/chahyasantoso/motion5/pull/190) carries the `Y-` evidence alone, against unmodified sources. Run [32572953699](https://github.com/chahyasantoso/motion5/actions/runs/32572953699), archived at `logs/32572953699/` on `ci-logs`, reports two failing jobs.

`quality` fails `typecheck`. `integration` reports `11 failed | 214 passed`. The eleven are the assertion-level statement of the defect: `Y-1` and `Y-13` fail with `stops-shape at ...keyframes.fk.values.stops`, which is the old runtime reading the section as a property with no stops array; `Y-2`, `Y-3`, and `Y-4` fail with `expected [] to ...`, because none of the three new rule ids exist; `Y-5`, `Y-8`, `Y-9`, and `Y-10` fail with `stops-shape` arriving where the new rule id belongs; `Y-7` reports `keyframes.fk.values.stops` where the section-aware path belongs; and `Y-12` fails on the declaring source still containing `AuthoredPluginMember`.

`Y-6` and `Y-11` passed on that run, as guards must. `boundaries`, `build`, `end-to-end`, and `performance` were all green, so the red is assertion-level rather than infrastructure-level, which is the distinction `docs/CI-WORKFLOW.md` requires of failing-first evidence.

The intermediate run [32573658619](https://github.com/chahyasantoso/motion5/actions/runs/32573658619), archived at `logs/32573658619/`, is worth keeping as a second finding: with the source landed and the fixtures migrated, `U-1` and `U-2` failed because their deliberately unresolvable fixture was now refused one layer earlier, by the contract rather than by the resolver. A test that names its owner is what made that visible; a test that only asserted "this throws" would have stayed green while measuring a different rule.
