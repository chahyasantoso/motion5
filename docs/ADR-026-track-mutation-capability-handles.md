# ADR-026: Track mutation uses capability handles and non-destructive replacement

**Status:** Accepted, 2026-08-17. Superseded in part by [ADR-056](./ADR-056-uniform-stale-track-handle.md), 2026-08-29.

**Context.** Caller-invented owner objects can be reused with the wrong id, and destroy/recreate emits terminal `destroyed` patches that React consumers interpret as permanent removal.

**Decision.** `TrackHandle` owns a private monotonic token. A stale handle cannot affect a later node that reuses the same id. `replace` preserves node identity and uses a normal ready patch path; renaming remains remove plus add.

**Superseded in part by [ADR-056](./ADR-056-uniform-stale-track-handle.md), 2026-08-29.** This record originally read “`remove` and `replace` are idempotent for stale handles and cannot affect a later node that reuses the same id.” The idempotence is withdrawn; the token and the ABA guarantee beside it are unchanged and are the half of this record ADR-056 builds on. A stale handle now refuses uniformly, from every member it has, with `StaleTrackHandleError`, and `readonly live: boolean` is the non-throwing probe that replaces the idempotence for a caller whose second call is expected rather than mistaken. Reverting the refusal would restore one condition with two public failure contracts, which is the defect ADR-056 exists to delete.

**Consequences.** Handles are the only capability for track mutation. Observation edges remain fields on the observer track and are edited through replacement helpers.
