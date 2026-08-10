# Architectural decision records

One entry per decision that would otherwise be relitigated. A reversal edits the original entry and adds a new entry.

## ADR-001 through ADR-010

The earlier records remain accepted. ADR-010 introduced `perspective`, `freeTracks`, and diagnostic severity as a candidate v4 dialect decision.

## ADR-011: Authored schema v5 and explicit v4 migration

**Status:** Accepted, 2026-08-10

**Context.** ADR-010 introduced a breaking rename from the reference dialect's top-level `tracks` to `freeTracks` while keeping `schemaVersion: 4`. That made v4 claim compatibility while rejecting a v4-shaped document, which is dishonest and makes migration discovery harder.

**Decision.** Bump the authored contract to `schemaVersion: 5`. Require `freeTracks` for project-level free tracks, qualify their references as `~/trackId`, and reject v4 input with a migration diagnostic. Do not accept a v4 alias or silently migrate inside the runtime. Keep `perspective` as optional, validated renderer metadata, with warning-level diagnostics for missing perspective on 3D content.

**Migration.** Follow [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md): change the version, rename only project-level `tracks`, qualify free-track references, add perspective where needed, and validate reserved ids.

**Consequences.** The contract is honest and machine-detectable. Existing authored projects need a one-time, explicit migration. The loader stays single-path and no longer needs compatibility flags or ambiguous top-level field handling.
