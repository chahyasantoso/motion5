# ADR-011: Schema v5 and explicit v4 migration

**Status:** Accepted, 2026-08-10

**Decision.** Require `schemaVersion: 5`, `freeTracks`, and qualified free-track references. Reject v4 at the loader boundary with a migration diagnostic. Migration occurs outside the runtime and is tested as a pure transformation.
