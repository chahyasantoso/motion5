# ADR-002: Authored schema v5 is the contract

**Amended 2026-10-29:** schema 5 carries one authored layout — identified tables or records under `input.values` and explicit `input.requires`. The grouped layout this record predates is deleted. See [ADR-144](./ADR-144-identified-tables-records-and-explicit-plugins.md).

**Status:** Accepted, 2026-08-10

**Context.** The project initially considered keeping schema v4 while renaming the top-level free-track field to `freeTracks`. That would make the version claim dishonest: a v4-shaped document would be rejected.

**Decision.** The motion5 authored contract is `schemaVersion: 5`. Schema v4 is not accepted as an alias. Existing v4 documents go through the explicit migration in [MIGRATION-V4-TO-V5.md](./MIGRATION-V4-TO-V5.md) before loading.

**Alternatives rejected.** Silent v4 acceptance creates two dialects. Automatic in-runtime migration gives the loader two meanings for the same input and hides migration work from callers.

**Consequences.** Migration is a visible one-time operation. Validators can have one clear input contract and one set of diagnostics.
