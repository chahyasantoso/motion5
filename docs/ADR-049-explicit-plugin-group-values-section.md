# ADR-049: a plugin group has two reserved sections, and `values` is one of them

**Status:** accepted  
**Date:** 2026-08-22  
**Closes:** issue [#177](https://github.com/chahyasantoso/motion5/issues/177)

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

This record amends ADR-041 and ADR-044 by replacing the group's authored shape. Neither is edited: each records the decision correct when made, this record supersedes ADR-044's "a `values` wrapper beside `requires`" rejection.

**Amended by [ADR-121](./ADR-121-grouped-only-keyframes.md), 2026-09-26.** The two reserved sections
remain the group grammar, but a plugin-named group is now mandatory at the authored top level. Flat
property -- including retired wrapper form shown in this historical record -- not authored spelling; leaf
belongs under owning group's `values`.

## Context

ADR-044 reserved `requires` inside plugin-named group, left animated properties at group top level. Rejected `values` wrapper for one reason, stated in its own alternatives section:

> `isKeyframeGroup` structural and registry-free by design → group whose sole leaf is named `values` indistinguishable from wrapper; optional wrapper leaves two legal group shapes forever.

Both halves true; both stop being true once `values` reserved by name. Ambiguity not property of wrapper but of leaving one spelling authorable in two roles. `requires` had exactly same problem, solved same way, same module, three ADRs earlier.

Leaving leaves at top level gave group mixing two domains: authored properties plugin consumes, graph bindings plugin owns. Also left group detection a heuristic. `isKeyframeGroup` asked whether every value was object -- a guess: typo'd property with no `stops` read as group; diagnostic then named group rather than mistake.

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

Group has exactly two possible members; nesting stays one level inside `values`. Six things follow -- why one decision, not six.

**Group detection becomes exact.** `isKeyframeGroup` now "an object with no `stops` array that names at least one reserved section". No registry, no guess. `some`, not `every` → group carrying unknown sibling still read as group, reported as unknown section instead of misdiagnosed.

**An unknown section is diagnosable.** Any key inside group neither `values` nor `requires` is `keyframes-unknown-section`; message names both legal sections from `PLUGIN_GROUP_SECTIONS`, not hardcoded string.

**The old heuristic gets an honest job.** Body survives as `looksLikeLegacyGroup`, no longer detection: exists so document written against pre-ADR-049 shape refused as `keyframes-missing-values-section`, not as property with no stops array.

**The type says what a group is.** `AuthoredPluginGroup` stops being `Readonly<Record<string, AuthoredPluginMember>>`, becomes two optional named members. `AuthoredPluginMember` deleted with escape hatch it served.

**"`values` is the only compiled value domain" becomes structural.** `flattenAuthoredKeyframes` reads `values` section and nothing else → `requires` skip it needed deleted, not maintained. `requires` no longer sibling of leaves; nothing to skip.

**The wrapper is required, in v5, now.** Not optional, no migration window, no schema v6. Scope item 8 of issue gives reason: two authoring shapes create two validation paths, two documentation paths, which TR-A-08 bans and rule 6 of ADR-033 forbids. Old form refused with dedicated rule id, never normalized.

Cost: no author may animate flat property named `values`; no plugin may claim that key at group level. Both exactly `requires` precedent; reservation on section _position_: leaf named `values` inside section is ordinary property, which `Y-8` pins.

### Ownership

No function moves layers. Section names, group detection, legacy-form predicate, two section readers stay in `contract/keyframe-shape`. Authored legality stays in `contract/validate-v5`. Flattening stays in `domain/keyframe-groups`, still one normalization owner. Which plugin owns leaf, whether it declares bound slot stay in `domain/plugins`, no logic change. Source resolution, duplicate edges, self-reference, cycles stay in `graph/ir.ts`, diff **empty**.

`usesThreeD` one place where doing nothing would be silent regression. It iterated group's own entries -- after this change, section names -- so 3D content inside group would stop being detected, `perspective-usage` would stop firing: lost warning, not rejected project, exact regression comment above that function already records happening once. Reads `readPluginValues` now; `Y-9` pins it.

### New and retired rule ids

- `keyframes-reserved-section` widens from `requires` alone to both section names.
- `keyframes-missing-values-section` new: pre-ADR-049 leaf form, refused by name.
- `keyframes-unknown-section` new: anything else inside group.
- `keyframes-values-shape` new: section is not object.
- `keyframes-values-empty` new: section is empty object. Omitting it already how author writes no properties → empty one is field accepted then ignored. Identical reasoning to `keyframes-requires-empty`.
- Four `keyframes-requires-*` ids unchanged; `keyframes-duplicate-key` and `keyframes-reserved-separator` now fire on `values` leaves.

No `keyframes-group-empty` added; finding, not omission. Group of only unknown sections already rejected by unknown-section errors; `{ fk: {} }` names no section at all → not group: stays accepted no-op property `{ opacity: {} }` always was. `Y-6` guards it; easy to break by accident.

## Alternatives rejected

**An optional wrapper with a migration window.** Rejected on issue's reasoning plus TR-A-08. Two authoring shapes are two validation paths, two documentation paths; "temporary" not property schema can enforce.

**Normalize the legacy form silently.** Rejected by rule 6 of ADR-033 and same two-documentation-paths argument. Shape accepted is shape authored.

**Keep detection heuristic and infer the wrapper.** Rejected: undecidable without plugin registry contract layer must not hold -- issue's own opening premise. Alternative ADR-044 chose; reserving name removes premise rather than working around it.

**Defer to a schema v6.** Rejected. v5 not shipped, TR-D-01 accepts v5 only, both packages private at `0.0.0` → version bump buys compatibility promise nobody is owed.

**A second reserved name such as `config` instead.** Not applicable here; recorded because ADR-044 rejected it for `requires`: section named for what it is. `values` holds authored and interpolated values, nothing else.

## Consequences

Public surface changes in exactly one place. `TrackDefinition` exported; its `keyframes` type changes shape -- whole breaking change. `AuthoredPluginGroup`, `AuthoredPluginMember`, `AuthoredPluginRequires`, `PluginRequiresBinding` in neither `packages/core/src/index.ts` nor `allowedPublicExports` in `scripts/boundary-scan.mjs` → **no export map, entrypoint or boundary allow-list entry changes**. Finding, verified by green `boundaries` job and green `public-declaration-surface` gate, neither edited.

`docs/TRD.md` needs no edit either. TR-D-02, TR-D-05 as corrected by issue #182, TR-D-06 make no claim about group internals beyond `keyframes.<plugin>.requires.<slot>`, whose authored path unchanged. Also finding.

Group authoring nothing but bindings needs no migration. `remount`, `cross-motion`, `phase4-dynamic-lifecycle` author `{ rig: { requires: { ... } } }`, already canonical since `requires` already reserved. Their absent diff is `Y-11` stated as fact about repository.

Every diagnostic about grouped leaf now cites section: `keyframes.fk.values.length`. `FlattenedKeyframe.authoredPath` carries it; `prepareContributions` reports through it → contribution failure inside group reads same way.

Evidence ids gain `Y-` series; `evidence-case-ids.test.ts` widens title pattern to admit it. Citation gate cannot see is not enforced.

## Sizing

Slice cannot split into independently-green slices. Root `tsconfig.json` includes `packages/**/*.ts`, `demo/**/*`, `apps/**/*`; `npm run typecheck` runs `tsc --noEmit` across all: slice changing `AuthoredPluginGroup` without migrating `apps/react-demo` fails `typecheck`; migrating demo without type change fails too. Only separating seam is accepting both shapes for one pull request -- dual semantics this record refuses by name.

## Evidence

`packages/core/test/integration/plugin-group-values-section.test.ts`, plus migrated `F-`, `N-`, `Q-`, `U-` suites.

- `Y-1` group with both sections loads; `values` leaves compile to unprefixed keys; `requires` section compiles to nothing. Asserted as mid-progress value, not clean load.
- `Y-2` legacy leaf form is `keyframes-missing-values-section` at group path, **not** `stops-shape`. Half case is negative assertion.
- `Y-3` unknown sibling is `keyframes-unknown-section`, once; message names both legal sections.
- `Y-4` top-level `values` gets same rule id top-level `requires` already gets.
- `Y-5` `values` as array, string or number is `keyframes-values-shape`; as `{}` is `keyframes-values-empty`.
- `Y-6` `{ fk: {} }` still accepted no-op property, not group, not error.
- `Y-7` bad leaf inside section reports at `keyframes.fk.values.length`; `authoredPath` carries section.
- `Y-8` leaf named `values` inside section legal and resolvable. Reservation on section position.
- `Y-9` `rotationY` inside section still warns `perspective-usage`.
- `Y-10` one compiled key under two groups' sections is `keyframes-duplicate-key`, citing second authored path.
- `Y-11` bindings-only group still joins composer chain, receives scoped input. Guard, green on parent.
- `Y-12` `AuthoredPluginGroup` declares `values` and `requires`, nothing else; `AuthoredPluginMember` gone from declaring source.
- `Y-13` walker rig composes same world frame at p=0.5 through section: pelvis (100, 100), thigh 135.355, shin 173.992 and 145.708.

Red before green executed and archived, not described. `test(contract)` commit at base of pull request [#190](https://github.com/chahyasantoso/motion5/pull/190) carries `Y-` evidence alone against unmodified sources. Run [32572953699](https://github.com/chahyasantoso/motion5/actions/runs/32572953699), archived at `logs/32572953699/` on `ci-logs`, reports two failing jobs.

`quality` fails `typecheck`. `integration` reports `11 failed | 214 passed`. Eleven are assertion-level statement of defect: `Y-1`, `Y-13` fail with `stops-shape at ...keyframes.fk.values.stops`, old runtime reading section as property with no stops array; `Y-2`, `Y-3`, `Y-4` fail with `expected [] to ...` -- none of three new rule ids exists; `Y-5`, `Y-8`, `Y-9`, `Y-10` fail with `stops-shape` where new rule id belongs; `Y-7` reports `keyframes.fk.values.stops` where section-aware path belongs; `Y-12` fails on declaring source still containing `AuthoredPluginMember`.

`Y-6`, `Y-11` passed on that run, as guards must. `boundaries`, `build`, `end-to-end`, `performance` all green → red is assertion-level, not infrastructure-level -- distinction `docs/CI-WORKFLOW.md` requires of failing-first evidence.

Intermediate run [32573658619](https://github.com/chahyasantoso/motion5/actions/runs/32573658619), archived at `logs/32573658619/`, worth keeping as second finding: source landed, fixtures migrated, `U-1` and `U-2` failed because their deliberately unresolvable fixture now refused one layer earlier -- by contract, not resolver. Test naming its owner made that visible; test asserting only "this throws" would stay green while measuring different rule.
