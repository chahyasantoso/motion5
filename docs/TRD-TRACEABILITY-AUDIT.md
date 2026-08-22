# TRD inbound traceability audit

This audit closes issue #186 against `docs/TRD.md` on 2026-08-22. Every binding requirement in sections 3 through 15 has at least one inbound trace to an accepted product requirement, architecture invariant, or decision record. No requirement was deleted, softened, or left aspirational.

The canonical requirement text remains in `docs/TRD.md`; this file is a reviewable audit record, not a second requirements source.

## System context and constraints

- TR-C-01: ADR-001, ADR-009.
- TR-C-02: ADR-001, I-11.
- TR-C-03: FR-18, FR-23, ADR-015, ADR-017.
- TR-C-04: I-12, FR-22.
- TR-C-05: ADR-009, FR-22.

## Architecture and boundaries

- TR-A-01: I-1, I-2, I-3, I-13, ADR-005, ADR-006.
- TR-A-02: I-11, ADR-004, ADR-005.
- TR-A-03: I-11, FR-18.
- TR-A-04: I-14, FR-19, ADR-003.
- TR-A-05: FR-4, ADR-012.
- TR-A-06: FR-25, ADR-017.
- TR-A-07: FR-14, I-7.
- TR-A-08: ADR-003, ADR-005, ADR-006, ADR-014.

## Authored data contract

- TR-D-01: FR-1, ADR-011.
- TR-D-02: FR-2.
- TR-D-03: FR-3, ADR-014.
- TR-D-04: FR-4, ADR-012.
- TR-D-05: FR-20, ADR-034, ADR-044, ADR-046, ADR-047.
- TR-D-06: FR-2, FR-20.
- TR-D-07: FR-5, ADR-011.
- TR-D-08: FR-5, ADR-011.
- TR-D-09: FR-5, ADR-011.
- TR-D-10: FR-5, ADR-011.
- TR-D-11: FR-3, ADR-014.

## Graph kernel

- TR-G-01: FR-3, ADR-014.
- TR-G-02: FR-3, ADR-014.
- TR-G-03: FR-6.
- TR-G-04: FR-9, ADR-013.
- TR-G-05: FR-20, I-15.
- TR-G-06: I-12, FR-6.
- TR-G-07: FR-20, I-15.
- TR-G-08: FR-8, I-1, ADR-006.
- TR-G-09: FR-7, ADR-005.
- TR-G-10: FR-7, I-2, ADR-005.
- TR-G-11: FR-7, I-2, ADR-005.
- TR-G-12: FR-8, I-1, ADR-006.
- TR-G-13: FR-19, I-14.

## Runtime and publication

- TR-R-01: FR-11.
- TR-R-02: FR-11, I-5.
- TR-R-03: FR-11, I-5.
- TR-R-04: I-3, ADR-005.
- TR-R-05: FR-14.
- TR-R-06: FR-14, I-7.
- TR-R-07: FR-13, I-8.
- TR-R-08: FR-13.
- TR-R-09: FR-14, I-6.
- TR-R-10: FR-12, I-9.
- TR-R-11: FR-10.
- TR-R-12: FR-10, I-13.
- TR-R-13: FR-19, FR-12.
- TR-R-14: FR-10.
- TR-R-15: FR-18, ADR-004.

## Domain model

- TR-M-01: FR-15, ADR-004.
- TR-M-02: FR-15, ADR-023.
- TR-M-03: FR-16, ADR-004.
- TR-M-04: FR-16, I-4.
- TR-M-05: FR-16, ADR-043.
- TR-M-06: FR-15, ADR-033.
- TR-M-07: FR-16, ADR-037.

## Ports and adapters

- TR-P-01: FR-17.
- TR-P-02: FR-17.
- TR-P-03: FR-17.
- TR-P-04: FR-17.
- TR-P-05: FR-17.
- TR-P-06: FR-17.
- TR-P-07: FR-18.
- TR-P-08: FR-4, ADR-012.
- TR-P-09: FR-23, ADR-015.

## Lifecycle and memory

- TR-L-01: I-10.
- TR-L-02: I-10.
- TR-L-03: I-10.
- TR-L-04: FR-19, ADR-013, ADR-020.
- TR-L-05: FR-19, ADR-013.
- TR-L-06: FR-22.
- TR-L-07: ADR-020, ADR-013.
- TR-L-08: FR-19, I-14.

## Diagnostics and errors

- TR-E-01: FR-20.
- TR-E-02: I-15, ADR-010.
- TR-E-03: FR-7, I-2.
- TR-E-04: FR-12.
- TR-E-05: FR-12, I-9.
- TR-E-06: FR-24, ADR-016.
- TR-E-07: FR-24, ADR-016.
- TR-E-08: FR-20.
- TR-E-09: FR-24, ADR-016.

## Public surface and packaging

- TR-S-01: FR-21.
- TR-S-02: FR-21.
- TR-S-03: FR-21, ADR-014.
- TR-S-04: FR-21, ADR-008.
- TR-S-05: FR-22.
- TR-S-06: FR-22.
- TR-S-07: FR-25, ADR-017.

## Performance

- TR-PF-01: FR-22.
- TR-PF-02: FR-22, ADR-008.
- TR-PF-03: FR-22.
- TR-PF-04: FR-22.
- TR-PF-05: FR-22, ADR-008.
- TR-PF-06: FR-22, ADR-008.

## Supply chain and toolchain

- TR-SC-01: FR-22, ADR-011.
- TR-SC-02: FR-22, ADR-001.
- TR-SC-03: ADR-007, ADR-019.
- TR-SC-04: ADR-019, ADR-005.

## Testability and CI

- TR-T-01: FR-17, I-11.
- TR-T-02: ADR-008, I-1, I-2, I-3, I-4, I-5, I-6, I-7, I-8, I-9, I-10, I-11, I-12, I-13, I-14, I-15.
- TR-T-03: ADR-008, I-12.
- TR-T-04: ADR-001.
- TR-T-05: ADR-008.
- TR-T-06: ADR-008.
- TR-T-07: ADR-008.
- TR-T-08: ADR-008, ADR-003.
- TR-T-09: ADR-008, ADR-003.
- TR-T-10: ADR-008.

## Audit findings

No new FR, invariant, or ADR was necessary. No requirement was deleted. The audit uses only FR, I, and ADR references as inbound owners, as required by issue #186. The normative matrix is in section 16 of `docs/TRD.md`; this file is a review artifact only.
