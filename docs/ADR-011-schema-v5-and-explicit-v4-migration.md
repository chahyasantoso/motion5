# ADR-011: Schema v5 and explicit v4 migration

**Amended 2026-10-29:** schema 5 carries one authored layout — identified tables or records under `input.values` and explicit `input.requires`. The grouped layout this record predates is deleted. See [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md).

**Status:** Accepted, 2026-08-10

**Decision.** Require `schemaVersion: 5`, `freeTracks`, and qualified free-track references. Reject v4 at the loader boundary with a migration diagnostic. Migration occurs outside the runtime and is tested as a pure transformation.
