# ADR-135: approved plugin catalog and lazy loader

## Status

Accepted for issue #534 phase 5; exact-head Node 24 CI remains required before merge.

## Context

After plugin implementations moved to `@motion5/plugins`, consumers still eagerly imported definitions
and registered the full set even when a project used only one plugin. Resolving names from authored
strings with `import(name)` would turn project data into executable module paths, make bundling and
review opaque, and defeat an explicit public package surface. Registration is now atomic through
`PluginRegistry.registerAll`, so a loader can prepare the complete missing set before one commit.

## Decision

`@motion5/plugins/loader` snapshots an explicit `Map<string, PluginDescriptor>` at construction.
The first-party `builtinCatalog` is a separate `@motion5/plugins/catalog` entry with literal dynamic
imports only, in the historic order `transform`, `fk`, `ik`, `transform3d`, `fk3d`, `ik3d`. Factories
and application-specific plugins stay with their caller, which composes a new catalog map.

`ensure(registry, demand)` validates the supplied project or tracks, discovers only top-level
`keyframes` group names, plans the dependency closure before importing anything, and loads only names
missing from that registry. A demanded group that the registry already holds but the catalog does
not list is satisfied, not refused: the invariant is about what ensure registers, and a plugin the
host registered directly needs no registration. Dependencies are explicit descriptor metadata, used for plugins such as
prepare-stage contributors that have no authored group. Roots are visited lexically for stable
failure selection; successful registration follows catalog insertion order.

Imports are cached as in-flight and successful definition promises across calls and registries. A
failed load or identity check is evicted so the caller may retry. After all imports settle, ensure
rechecks the registry and calls `registerAll` synchronously once; it takes no lock. A concurrent ensure
on one registry therefore commits once, while concurrent ensures on separate registries share module
loading but each fills its own registry. A refused batch leaves the registry unchanged.

Failures are returned through a discriminated union: invalid demand, unknown plugin, dependency cycle,
import failure, identity mismatch, or registry refusal. `describeLoadFailure` and
`ensuredOrThrow` provide an exhaustive human-readable boundary; the wording names the import or
registry cause, and `ensuredOrThrow` keeps it as `Error.cause`. Track refusal is the core validator's
outcome, never a second severity rule. Commit names are catalog keys; a loaded definition's `name` is
read once, at the identity check. Catalog shape errors are programmer
errors and throw at loader construction.

Native dynamic imports cannot be aborted. A caller that no longer needs the result ignores it; a late
commit is safe because definitions are immutable, and the final registry recheck makes the operation
idempotent. Synchronous edits do not trigger imports: callers ensure the edited tracks first.

## Rejected

- `import(projectString)`: authored input must never select arbitrary executable module paths.
- Loader in core: core should not own plugin implementations or their catalog.
- Per-application duplicate catalogs: they drift; applications extend the shared catalog only when
  adding a genuinely app-owned descriptor.
- Promise-chain lock: imports happen before a short synchronous commit, and `registerAll` already
  provides atomicity.
- Refusing a registered root outside the catalog: it would fail a project that `Engine.load`
  accepts, forcing hosts to list every directly registered plugin twice.
- A loader-owned registry: `Engine` keeps its supplied registry by reference, so ensure must fill
  that same instance.

## Consequences

The package manifest is the sole public-subpath list and development aliases are generated from it.
The catalog's boundary gate permits exactly one static edge, `import type { ... } from "./loader"`,
and refuses any value import, re-export or side-effect import of a relative module.
Lazy chunks are a bundler detail, not an acceptance contract. See the getting-started guide and the
loader's focused tests.
