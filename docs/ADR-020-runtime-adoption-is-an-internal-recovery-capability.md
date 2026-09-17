# ADR-020: Runtime adoption is an internal recovery capability

**Status:** Superseded by [ADR-076](./ADR-076-one-mechanism-per-question.md), 2026-09-13.

**Decision.** Runtime adoption is internal to ProjectRuntime and safely compiled by Engine.

**Superseded by [ADR-076](./ADR-076-one-mechanism-per-question.md), 2026-09-13.** The capability this record kept internal was later reached through `ProjectHandle.adopt` and `destroyAdopted`, and `addTrack` plus `TrackHandle` then answered the same question with a live handle rather than a frozen record and a caller-invented owner object. The owner-based pair is deleted rather than kept as an older spelling. What survives of this record is the half ADR-025 and ADR-026 already own: a runtime-created track is an ordinary member of the one track store, compiled by Engine through the injected seam.
