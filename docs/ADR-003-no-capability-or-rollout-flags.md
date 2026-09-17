# ADR-003: No capability or rollout flags

**Status:** Accepted, 2026-08-10

**Context.** Flags such as publisher rendering, cross-motion, and free tracks keep dead and live behavior paths in the same binary. They multiply the test matrix and make default-green CI untrustworthy.

**Decision.** Features merge on, or they do not merge. No shipped code branches on a capability or rollout flag for core behavior.

**Alternatives rejected.** A temporary flag almost always becomes a permanent API because removing it feels riskier after callers depend on it.

**Consequences.** Risk is handled with small vertical pull requests, explicit adapters, and fast reverts rather than hidden runtime modes.
