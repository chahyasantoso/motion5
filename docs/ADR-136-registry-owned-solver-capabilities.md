# ADR-136: Solver declarations are registry-owned capabilities

**Status:** Accepted for the prepared implementation, 2026-10-05; not a merge or CI claim.

**Superseded by [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md), 2026-10-29.** Identified tables and records with an explicit `PluginCatalog` are the one supported contract; the grouped machinery this record describes is deleted.

## Context

Core held three first-party name tables: chain shape, pole slots, joint vocabulary. Graph rules could disagree with admitted third-party definition. ADR-044 deliberately keeps graph independent of registry; importing definitions into graph undoes that boundary, does not solve duplication. ADR-114 and ADR-123 stated old tables.

## Decision

`PluginCapabilities` is graph's one declaration port. `capabilityOf(name)` answers frozen `PluginCapability` containing `SolverChainShape`, pole and joint facts. Unknown plugin answers `undefined` = unjudged, not guessed `any`. `PluginRegistry` implements port.

`PluginDefinition.solverChain` optional: omission on admitted definition means `any`. Admission accepts `any` or `tree` with non-empty, colon-free member name distinct from solver. Snapshots and freezes shape without freezing caller's object. Runtime unknown kinds throw `TypeError`; closed, validated unions read exhaustively through `unreachable`. Pole derives from requirements record; joint from explicit key or one predicate query for `JOINT_KEY`. Compose and contribution hooks never run during admission. Thrown predicate refuses whole batch, including staged capabilities and dedication.

Dedication registry-wide by decision. Every admitted tree dedicates its member plugin, including unused third-party solver. Private Set owns uniqueness; port returns sorted frozen array, rebuilt only when new dedicated member admitted. Freezing a Set still permits `.add` → cannot be public immutable snapshot. `any` chains exclude these members; `tree` chains admit only own member plugin. Existing refusal wording retained exactly.

`buildGraphIR`, graph finalization, solver resolution and both graph builders take port explicitly. `validateV5` only public validation default, using `UNJUDGED_CAPABILITIES`; runtime's registry-free fallback passes that value explicitly. Without declarations, `ik-chain-unsupported`, `ik-pole-*`, `ik-limit-*`, `ik-joint-*`, goal-weight and `ik-solved-rotation-dead` families unjudged. Schema and general topology unchanged. Engine passes registry it already holds by reference into validation and incremental builds → later atomic loader additions reach both subsequent loads and live edit recompiles.

Core deletes chain, pole and joint plugin-name tables and lookup functions. Shape algebra and constraint vocabulary stay core-owned. Plugin authors and validation callers can name `SolverChainShape`, `PluginCapability` and `PluginCapabilities` from declared entrypoints. Boundary scanner refuses graph or contract imports of `domain/plugins`; source governance rejects first-party plugin-name literals. Public plugin declarations still reach no runtime or graph.

## Verified plan corrections

Inherited checkpoint's chain fixture authored `transform.values: {}`, which schema validation refuses before solver checks. Now authors valid zero-position root. Corrected fixture also run against pre-implementation checkpoint; its six cases fail on assertions there.

Step 7.4's unbound goal-weight predicate inverted relative to verified source and prose. Unknown declarations and known non-joint unbound groups skipped; known joint group's orphan weight refused as before. `joint !== false` there would silently accept known joint footgun while refusing unrelated known groups. Existing behavior assertions unchanged. Tests exercising flattened foreign spellings explicitly admit fake definitions rather than silently guessing capabilities for unknown names.

## Alternatives rejected

- Keep static tables: first-party and third-party definitions get different owners.
- Import registry into graph: violates ADR-044, widens narrow read into implementation dependency.
- Move rules into registry resolution: duplicates graph ownership of derived chains and depth.
- Declare pole or joint fields: duplicates requirements and key claims.
- Project-local dedication: plugin pair's validity would depend on which other members authored in that project.
- Freeze a Set: mutator methods remain usable; frozen array is real immutable snapshot.

## Consequences

Standalone validation no longer pretends to judge declarations it lacks. Callers wanting those checks pass registry. Explicit test registries preserve old diagnostic contracts; new tests cover third-party declarations, atomic refusal, snapshots, late registration. Prepared local evidence and review live in handover; Node 24 CI still required before merge.
