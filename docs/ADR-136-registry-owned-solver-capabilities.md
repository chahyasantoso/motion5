# ADR-136: Solver declarations are registry-owned capabilities

**Status:** Accepted for the prepared implementation, 2026-10-05; not a merge or CI claim.

## Context

Core held three first-party name tables for chain shape, pole slots and joint vocabulary.
Graph rules could therefore disagree with an admitted third-party definition. ADR-044 deliberately
keeps the graph independent of the registry; importing definitions into graph would undo that
boundary rather than solve the duplication. ADR-114 and ADR-123 stated the old tables.

## Decision

`PluginCapabilities` is the graph's one declaration port. `capabilityOf(name)` answers a frozen
`PluginCapability` containing a `SolverChainShape`, pole and joint facts. An unknown plugin answers
`undefined`, which means unjudged, not a guessed `any`. `PluginRegistry` implements the port.

`PluginDefinition.solverChain` is optional: omission on an admitted definition means `any`.
Admission accepts `any` or `tree` with a non-empty, colon-free member name distinct from the solver.
It snapshots and freezes the shape without freezing the caller's object. Runtime unknown kinds
throw `TypeError`; closed, validated unions are read exhaustively through `unreachable`.
Pole derives from the requirements record and joint from an explicit key or one predicate query
for `JOINT_KEY`. Compose and contribution hooks never run during admission. A thrown predicate
refuses the whole batch, including its staged capabilities and dedication.

Dedication is registry-wide by decision. Every admitted tree dedicates its member plugin, including
an unused third-party solver. A private Set owns uniqueness; the port returns a sorted frozen array,
rebuilt only when a new dedicated member is admitted. Freezing a Set would still permit `.add`,
so it cannot be the public immutable snapshot. `any` chains exclude these members; `tree` chains
admit only their own member plugin. The existing refusal wording is retained exactly.

`buildGraphIR`, graph finalization, solver resolution and both graph builders take the port
explicitly. `validateV5` is the only public validation default, using `UNJUDGED_CAPABILITIES`.
The runtime's registry-free fallback passes that value explicitly. Without declarations the
`ik-chain-unsupported`, `ik-pole-*`, `ik-limit-*`, `ik-joint-*`, goal-weight and
`ik-solved-rotation-dead` families are unjudged. Schema and general topology are unchanged.
Engine passes the registry it already holds by reference into validation and incremental builds,
so later atomic loader additions reach both subsequent loads and live edit recompiles.

Core deletes the chain, pole and joint plugin-name tables and their lookup functions. The shape
algebra and constraint vocabulary stay core-owned. Plugin authors and validation callers can name
`SolverChainShape`, `PluginCapability` and `PluginCapabilities` from declared entrypoints.
The boundary scanner refuses graph or contract imports of `domain/plugins`; source governance
rejects first-party plugin-name literals. Public plugin declarations still reach no runtime or graph.

## Verified plan corrections

The inherited checkpoint's chain fixture authored `transform.values: {}`, which schema validation
refuses before solver checks. It now authors a valid zero-position root. The corrected fixture is
also run against the pre-implementation checkpoint; its six cases fail on assertions there.

Step 7.4's unbound goal-weight predicate was inverted relative to the verified source and its prose.
Unknown declarations and known non-joint unbound groups are skipped; a known joint group's orphan
weight is refused as before. Using `joint !== false` there would silently accept the known joint
footgun while refusing unrelated known groups. Existing behavior assertions remain unchanged.
Tests exercising flattened foreign spellings explicitly admit their fake definitions rather than
silently guessing capabilities for unknown names.

## Alternatives rejected

- Keep static tables: first-party and third-party definitions would have different owners.
- Import the registry into graph: violates ADR-044 and widens a narrow read into an implementation
  dependency.
- Move rules into registry resolution: duplicates graph's ownership of derived chains and depth.
- Declare pole or joint fields: duplicates requirements and key claims.
- Project-local dedication: a plugin pair's validity would depend on which other members happen
  to be authored in that project.
- Freeze a Set: mutator methods remain usable; a frozen array is a real immutable snapshot.

## Consequences

Standalone validation no longer pretends to judge declarations it does not have. Callers wanting
those checks pass a registry. Explicit test registries preserve the old diagnostic contracts while
new tests cover third-party declarations, atomic refusal, snapshots and late registration.
Prepared local evidence and review live in the handover; Node 24 CI remains required before merge.
