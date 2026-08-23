/**
 * Planted-violation fixtures for the inbound traceability gate, one per failure class the scanner
 * owns. TR-T-05 requires a mechanical gate to prove it can fail, and a document gate is cheap to
 * plant: the fixtures are a miniature doc set with three requirements, and each violation is a
 * single targeted edit of the clean version so the test names exactly what it broke.
 */

export const cleanPrdFixture = `# fixture prd

## 6. Functional requirements

- **FR-1:** the first product requirement.
- **FR-2:** the second product requirement.
`;

export const cleanArchitectureFixture = `# fixture architecture

## 4. Invariants

- **I-1** the first invariant.
- **I-2** the second invariant.
`;

export const cleanDecisionsFixture = `# fixture decisions

## ADR-001: the first decision

**Status:** Accepted

## ADR-002: the second decision

**Status:** Accepted
`;

export const cleanTrdFixture = `# fixture trd

## 3. System context and constraints

- **TR-C-01 First.** A binding requirement. Implements FR-1.
- **TR-C-02 Second.** Another binding requirement. Implements I-1.

## 4. Architecture and boundary requirements

- **TR-A-01 Third.** A third binding requirement. Implements ADR-001.

## 16. Traceability

### Inbound traceability: technical requirements to owners

Every binding requirement in sections 3 through 15 appears below at least once.

- TR-C-01: FR-1, ADR-001.
- TR-C-02: I-1, I-2.
- TR-A-01: ADR-001, FR-2.

### Delivery slices

The slice that satisfies each requirement is named in the implementation plan.
`;

export const cleanAuditFixture = `# fixture audit

This audit records the inbound owners of every binding requirement.

## System context and constraints

- TR-C-01: FR-1, ADR-001.
- TR-C-02: I-1, I-2.

## Architecture and boundaries

- TR-A-01: ADR-001, FR-2.

## Audit findings

Nothing needed deletion.
`;

const FIRST_ROW = "- TR-C-01: FR-1, ADR-001.";
const SECOND_ROW = "- TR-C-02: I-1, I-2.";
const THIRD_ROW = "- TR-A-01: ADR-001, FR-2.";
const HEADING = "### Inbound traceability: technical requirements to owners";

/** Multi-row edits are named so no fixture declaration approaches the print width. */
const ORDERED = `${FIRST_ROW}\n${SECOND_ROW}`;
const SWAPPED = `${SECOND_ROW}\n${FIRST_ROW}`;
const TWICE = `${SECOND_ROW}\n${SECOND_ROW}`;
const ORPHANED = `${THIRD_ROW}\n- TR-G-01: FR-1.`;
const DROPPED = `${THIRD_ROW}\n`;

function withRow(from: string, to: string): string {
  return cleanTrdFixture.replace(from, to);
}

function withAuditRow(from: string, to: string): string {
  return cleanAuditFixture.replace(from, to);
}

/** A row that names another technical requirement as its owner: the issue #186 violation. */
export const requirementOwnerFixture = withRow(FIRST_ROW, "- TR-C-01: FR-1, TR-A-01.");

/** A row that abbreviates its owners as a range instead of naming each one. */
export const rangeOwnerFixture = withRow(SECOND_ROW, "- TR-C-02: I-1 through I-2.");

/** A row pointing at an owner that no product, architecture, or decision document defines. */
export const unknownOwnerFixture = withRow(FIRST_ROW, "- TR-C-01: FR-1, FR-9.");

/** A row naming the same owner twice, which hides how many owners a requirement really has. */
export const duplicateOwnerFixture = withRow(FIRST_ROW, "- TR-C-01: FR-1, FR-1.");

/** A row with a colon and nothing behind it, which is an ownerless requirement in disguise. */
export const ownerlessRowFixture = withRow(FIRST_ROW, "- TR-C-01: .");

/** A row missing its terminating period, which makes the last owner unparseable. */
export const unterminatedRowFixture = withRow(FIRST_ROW, "- TR-C-01: FR-1, ADR-001");

/** A binding requirement with no inbound row at all: ownerless, which is what #186 forbids. */
export const missingRowFixture = withRow(DROPPED, "");

/** A row for a requirement that no section declares, which is residue from a deleted rule. */
export const orphanRowFixture = withRow(THIRD_ROW, ORPHANED);

/** The same requirement traced twice, so one row can be corrected while the other rots. */
export const duplicateRowFixture = withRow(SECOND_ROW, TWICE);

/** Rows that no longer follow the order the requirements are declared in. */
export const outOfOrderFixture = withRow(ORDERED, SWAPPED);

/** A TRD that lost its inbound section entirely, which must throw rather than scan nothing. */
export const missingSectionFixture = withRow(HEADING, "### Something else entirely");

/** The audit artifact and the normative matrix disagreeing about who owns a requirement. */
export const auditDriftFixture = withAuditRow(SECOND_ROW, "- TR-C-02: I-1.");

/** A requirement traced in the TRD but absent from the audit artifact. */
export const auditMissingRowFixture = withAuditRow(DROPPED, "");

/** A requirement audited but never traced in the normative matrix. */
export const auditExtraRowFixture = withAuditRow(THIRD_ROW, ORPHANED);
