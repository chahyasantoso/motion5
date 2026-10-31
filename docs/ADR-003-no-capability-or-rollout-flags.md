# ADR-003: No capability or rollout flags

**Status:** Accepted, 2026-08-10

**Context.** Flags such as publisher rendering, cross-motion, and free tracks keep dead and live behavior paths in one binary. They multiply test matrix and make default-green CI untrustworthy.

**Decision.** Features merge on, or do not merge. No shipped code branches on a capability or rollout flag for core behavior.

**Alternatives rejected.** A temporary flag almost always becomes permanent API: removal feels riskier once callers depend on it.

**Consequences.** Risk handled with small vertical pull requests, explicit adapters, fast reverts, not hidden runtime modes.
