# ADR-143: Identified plugins cut over at their existing public paths

**Completed 2026-10-29:** the temporary internal legacy paths and the grouped registry are deleted; the public paths carry only identified definitions. See [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md).

**Status:** Accepted, 2026-10-25

## Context

The Phase 5 solver redesign must replace grouped plugin definitions with identified-table definitions,
but the package already declares `@motion5/plugins/transform`, `fk`, `ik`, `transform3d`, `fk3d`,
`ik3d`, and `rig`. Applications, tests and the Three package import those paths directly, and the
public-subpaths test treats the manifest as the package contract.

The earlier migration plan moved every grouped implementation to `legacy/` before creating any v5
replacement. That would have left a declared public path missing or required a re-export, fallback or
dual contract. A missing entry breaks an installed package; a fallback gives one public name two
meanings; and a bridge hides whether a caller is testing the old or new registry.

## Decision

Each plugin keeps its existing public package path and is cut over there in one vertical slice. The
slice moves the grouped implementation to `packages/plugins/src/legacy/<name>.ts`, exposes it during
the transition through the explicit repository-only path `@motion5/plugins/internal/legacy/<name>`,
installs the identified-table implementation at `@motion5/plugins/<name>`, and registers only the v5
definition in `identified-catalog.ts`.

The grouped `PluginRegistry` and loader may consume only the internal legacy definitions. The v5
`PluginCatalog` and identified catalog may consume only identified definitions. No Engine instance,
catalog, loader or test mixes the contracts. The internal paths are enumerated in the package export
map and are not documented consumer API; Phase 7 removes them after a repository-wide zero-consumer
proof.

The identified catalog is a source-controlled map of descriptors. It starts empty so no unmigrated
grouped definition is accidentally registered as v5. Each later slice adds exactly the plugin it
migrates. Catalog and loader failures remain closed discriminated unions with exhaustive readers.

## Alternatives rejected

- Moving all grouped files before any v5 replacement: breaks the already-declared public package
  surface during the migration and violates vertical ownership.
- Re-exporting a grouped definition from a public path: creates a compatibility bridge and makes the
  public path's contract depend on migration order.
- Registering grouped and identified definitions in one catalog: gives one registry two incompatible
  contracts and makes output ownership ambiguous.
- Renaming the public paths: breaks first-party consumers for no architectural benefit and creates a
  second package vocabulary.
- Adding a wildcard internal export: silently publishes future implementation files and bypasses the
  repository's explicit-entrypoint rule.

## Consequences

Every intermediate cutover keeps the public path present and gives legacy callers an explicit path
until their plugin is migrated. A package-surface test can distinguish public definitions from
repository-only legacy entries. The cost is temporary internal export-map entries and two catalogs;
that cost is bounded and is deleted with the grouped engine in Phase 7 rather than hidden behind an
alias.

The public plugin module for a migrated name exports exactly one identified definition. A caller can
therefore determine which contract it uses from its import path and registry type, while the package
manifest remains the single owner of resolution.
