# ADR-133: `plugin-api` is the plugin package contract

**Status:** Accepted, 2026-10-04

## Context

Plugin implementations currently live under `packages/core/src/plugins` and import core's domain,
contract and language modules directly. That makes the implementation layer depend on private source
paths and leaves package extraction without one declared contract. The implementation files also need
solver vocabulary and the repository's single exhaustive `unreachable` function, so moving those
owners or copying them would create a second answer to the same questions.

## Decision

`@motion5/core/plugin-api` is the one declared entrypoint for plugin implementations. It is a
re-export-only module. It exposes the plugin definition protocol, immutable value types, render
serializer type, solver vocabulary used by plugin implementations, `POLE_SLOT`, and the shared
`unreachable` function. The owners remain in `domain`, `ports`, `contract` and `lang`; the entrypoint
only assembles their public surface.

Every extracted plugin file imports core-owned symbols through `@motion5/core/plugin-api` and may
import sibling implementation modules. The package permits only the declared core root and plugin
authoring contract, not internal, adapters or test support. The boundary scanner reads the exports
of every workspace package once and rejects undeclared package subpaths. Relative plugin imports
must remain inside the implementation directory, including nested files, dynamic imports and
re-exports.

The entrypoint is declared in `packages/core/package.json` and has a source alias in `vite.config.ts`
so the workspace resolves the same contract that the published package declares. Its declaration
closure must not reach `runtime` or `graph`, and the declaration-surface test verifies that property.

The first change is additive. The extraction change moves every implementation unchanged except
import specifiers into `@motion5/plugins`, with six definition subpaths and the complete `frame3d`
utility module. Core removes its old plugin exports and the internal frame-reader export; no
implementation remains in core. Registry and graph protocols remain core-owned.

## Alternatives rejected

- Plugins importing `@motion5/core/internal`: that entrypoint is intentionally not the authoring
  contract.
- Moving solver vocabulary into the plugin package: graph code also reads the protocol, so that
  would give the vocabulary two owners.
- Copying `unreachable` into plugin files: a closed union would then have multiple sinks and could
  silently drift.
- Adding an eager barrel: it would make the contract load implementation code and would weaken the
  package boundary this phase establishes.

## Consequences

Plugin authors have one stable core entrypoint to target, and the extraction phase can replace the
relative path with the package subpath without changing plugin semantics. The extraction branch does not claim that lazy loading has landed. Each module has an explicit
export and no eager root barrel. Plugin builds resolve only built core declarations. Development
aliases for every app and the test runner are generated from one manifest-reading helper, with
exact matching so nested or undeclared subpaths cannot pass through a prefix alias.

## Evidence

The phase branch adds declaration-closure coverage for `plugin-api`, boundary pass/refusal cases,
and a core package declaration build. The supplied offline baseline has 36 pre-existing repository
typecheck diagnostics, boundary and read-budget scans pass, and the full core suite is blocked by one
missing sandbox dependency (`react-test-renderer`) rather than by this change. CI on the eventual pull
request is the authoritative Node 24 evidence.
