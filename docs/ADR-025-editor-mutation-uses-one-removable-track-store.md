# ADR-025: Editor mutation uses one removable track store

**Status:** Accepted, 2026-08-17

**Context.** The editor must add, edit, and remove both initially authored tracks and runtime-created tracks. Keeping a permanent schema baseline beside a removable runtime overlay makes deletion semantics conditional and forces every edit to understand two owners.

**Decision.** After `Engine.load` validation, authored motion and free tracks are ingested into the same ProjectRuntime track store used by runtime additions. Ingestion preserves validated object identity and does not auto-mount nodes. This intentionally removes the old guarantee that schema-declared tracks are structurally permanent; editor deletion is now the uniform behavior.

**Alternatives rejected.** Keeping the two-tier store preserves permanence but makes the primary editor use case impossible without special-case APIs. Auto-mounting changes existing load semantics and is rejected.

**Consequences.** `snapshot`/export must be based on the live store in a follow-up or public runtime snapshot API. Fixed-schema consumers must treat loaded tracks as removable through the new capability surface.
