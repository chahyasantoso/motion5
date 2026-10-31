# ADR-002: Authored schema v5 is the contract

**Amended 2026-10-29:** schema 5 carries one authored layout — identified tables or records under `input.values`, explicit `input.requires`. Grouped layout this record predates deleted. See [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md).

**Status:** Accepted, 2026-08-10

**Context.** Project initially considered keeping schema v4 while renaming top-level free-track field to `freeTracks`. That makes version claim dishonest: v4-shaped document rejected.

**Decision.** motion5 authored contract is `schemaVersion: 5`. Schema v4 not accepted as alias. Existing v4 documents go through explicit migration in [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md) before loading.

**Alternatives rejected.** Silent v4 acceptance creates two dialects. Automatic in-runtime migration gives loader two meanings for same input, hides migration work from callers.

**Consequences.** Migration visible one-time operation. Validators get one clear input contract, one set of diagnostics.
