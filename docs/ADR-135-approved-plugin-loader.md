# ADR-135: approved plugin catalog and lazy loader

## Status

Accepted for issue #534 phase 5; exact-head Node 24 CI still required before merge.

## Context

After plugin implementations moved to `@motion5/plugins`, consumers still eagerly imported definitions, registered full set even when project used only one plugin. Resolving names from authored strings with `import(name)` would turn project data into executable module paths, make bundling and review opaque, defeat explicit public package surface. Registration now atomic through `PluginRegistry.registerAll`, so loader can prepare complete missing set before one commit.

## Decision

`@motion5/plugins/loader` snapshots explicit `Map<string, PluginDescriptor>` at construction. First-party `builtinCatalog` separate `@motion5/plugins/catalog` entry, literal dynamic imports only, historic order `transform`, `fk`, `ik`, `transform3d`, `fk3d`, `ik3d`. Factories and application-specific plugins stay with caller, which composes new catalog map.

`ensure(registry, demand)` validates supplied project or tracks, discovers only top-level `keyframes` group names, plans dependency closure before importing anything, loads only names missing from that registry. Demanded group registry already holds but catalog does not list is satisfied, not refused: invariant about what ensure registers; plugin host registered directly needs no registration. Dependencies explicit descriptor metadata, used for plugins such as prepare-stage contributors with no authored group. Roots visited lexically for stable failure selection; successful registration follows catalog insertion order.

Imports cached as in-flight and successful definition promises across calls and registries. Failed load or identity check evicted so caller may retry. After all imports settle, ensure rechecks registry, calls `registerAll` synchronously once; takes no lock. Concurrent ensure on one registry therefore commits once; concurrent ensures on separate registries share module loading but each fills own registry. Refused batch leaves registry unchanged.

Failures returned through discriminated union: invalid demand, unknown plugin, dependency cycle, import failure, identity mismatch, registry refusal. `describeLoadFailure` and `ensuredOrThrow` provide exhaustive human-readable boundary; wording names import or registry cause; `ensuredOrThrow` keeps it as `Error.cause`. Track refusal is core validator's outcome, never second severity rule. Commit names are catalog keys; loaded definition's `name` read once, at identity check. Catalog shape errors programmer errors, throw at loader construction.

Native dynamic imports cannot be aborted. Caller no longer needing result ignores it; late commit safe because definitions immutable; final registry recheck makes operation idempotent. Synchronous edits do not trigger imports: callers ensure edited tracks first.

## Rejected

- `import(projectString)`: authored input never selects arbitrary executable module paths.
- Loader in core: core must not own plugin implementations or their catalog.
- Per-application duplicate catalogs: drift; applications extend shared catalog only when adding genuinely app-owned descriptor.
- Promise-chain lock: imports happen before short synchronous commit; `registerAll` already provides atomicity.
- Refusing registered root outside catalog: fails project `Engine.load` accepts, forcing hosts to list every directly registered plugin twice.
- Loader-owned registry: `Engine` keeps supplied registry by reference, so ensure must fill that same instance.

## Consequences

Package manifest sole public-subpath list; development aliases generated from it. Catalog's boundary gate permits exactly one static edge, `import type { ... } from "./loader"`, refuses any value import, re-export or side-effect import of relative module. Lazy chunks bundler detail, not acceptance contract. See getting-started guide and loader's focused tests.
