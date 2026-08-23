import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  parseRequirementIds,
  scanTraceability,
} from "../../../../../scripts/traceability-scan.mjs";
import {
  auditDriftFixture,
  auditExtraRowFixture,
  auditMissingRowFixture,
  cleanArchitectureFixture,
  cleanAuditFixture,
  cleanDecisionsFixture,
  cleanPrdFixture,
  cleanTrdFixture,
  duplicateOwnerFixture,
  duplicateRowFixture,
  missingRowFixture,
  missingSectionFixture,
  orphanRowFixture,
  outOfOrderFixture,
  ownerlessRowFixture,
  rangeOwnerFixture,
  requirementOwnerFixture,
  unknownOwnerFixture,
  unterminatedRowFixture,
} from "../../../../../scripts/traceability-scan-fixtures";

const root = fileURLToPath(new URL("../../../../..", import.meta.url));

interface PlantedDocs {
  trd?: string;
  audit?: string;
  prd?: string;
  architecture?: string;
  decisions?: string;
}

/**
 * Plants a miniature docs/ tree and runs the shipped scanner against it. Every assertion below
 * goes through scanTraceability rather than a predicate, because a gate that only proves its
 * helpers work is the kind of gate ADR-008 rejects.
 */
async function withPlantedDocs<T>(
  planted: PlantedDocs,
  use: (scanRoot: string) => Promise<T>,
): Promise<T> {
  const scanRoot = await mkdtemp(join(tmpdir(), "motion5-traceability-"));
  const docs = join(scanRoot, "docs");
  const planned: Array<[string, string]> = [
    ["TRD.md", planted.trd ?? cleanTrdFixture],
    ["TRD-TRACEABILITY-AUDIT.md", planted.audit ?? cleanAuditFixture],
    ["PRD.md", planted.prd ?? cleanPrdFixture],
    ["ARCHITECTURE.md", planted.architecture ?? cleanArchitectureFixture],
    ["DECISIONS.md", planted.decisions ?? cleanDecisionsFixture],
  ];
  await mkdir(docs, { recursive: true });
  for (const [name, content] of planned) {
    await writeFile(join(docs, name), content);
  }
  try {
    return await use(scanRoot);
  } finally {
    await rm(scanRoot, { recursive: true, force: true });
  }
}

async function scanPlanted(planted: PlantedDocs): Promise<string[]> {
  return withPlantedDocs(planted, (scanRoot) => scanTraceability(scanRoot));
}

describe("inbound traceability gate (issue #186)", () => {
  it("passes a clean planted doc set", async () => {
    expect(await scanPlanted({})).toEqual([]);
  });

  it("T-1: rejects a row that names another technical requirement as its owner", async () => {
    const failures = await scanPlanted({ trd: requirementOwnerFixture });
    expect(failures).toContain('TR-C-01: "TR-A-01" is not an FR, I, or ADR owner');
  });

  it("T-2: rejects owners abbreviated as a range", async () => {
    const failures = await scanPlanted({ trd: rangeOwnerFixture });
    expect(failures).toContain('TR-C-02: "I-1 through I-2" is not an FR, I, or ADR owner');
  });

  it("T-3: rejects an owner that no document defines", async () => {
    const failures = await scanPlanted({ trd: unknownOwnerFixture });
    expect(failures).toContain("TR-C-01: owner FR-9 does not exist");
  });

  it("T-4: rejects the same owner listed twice in one row", async () => {
    const failures = await scanPlanted({ trd: duplicateOwnerFixture });
    expect(failures).toContain("TR-C-01: owner FR-1 is listed twice");
  });

  it("T-5: rejects a row that names no owner", async () => {
    const failures = await scanPlanted({ trd: ownerlessRowFixture });
    expect(failures).toContain("TR-C-01: inbound row names no owner");
  });

  it("T-6: rejects a row with no terminating period", async () => {
    const failures = await scanPlanted({ trd: unterminatedRowFixture });
    expect(failures).toContain("TR-C-01: TRD.md row must end with a period");
  });

  it("T-7: reports a binding requirement with no inbound row", async () => {
    const failures = await scanPlanted({ trd: missingRowFixture });
    expect(failures).toContain("TR-A-01: no inbound row");
  });

  it("T-8: reports an inbound row for a requirement no section declares", async () => {
    const failures = await scanPlanted({ trd: orphanRowFixture });
    expect(failures).toContain("TR-G-01: inbound row for an unknown requirement");
  });

  it("T-9: reports the same requirement traced twice", async () => {
    const failures = await scanPlanted({ trd: duplicateRowFixture });
    expect(failures).toContain("TR-C-02: duplicate inbound row");
  });

  it("T-10: reports rows that drift out of requirement order", async () => {
    const failures = await scanPlanted({ trd: outOfOrderFixture });
    expect(failures).toContain("TRD.md: inbound rows are not in requirement order");
  });

  it("T-11: throws when the inbound section is gone rather than scanning nothing", async () => {
    await expect(scanPlanted({ trd: missingSectionFixture })).rejects.toThrow(
      /missing "### Inbound traceability/,
    );
  });

  it("T-12: reports the audit artifact and the matrix disagreeing about owners", async () => {
    const failures = await scanPlanted({ audit: auditDriftFixture });
    expect(failures).toContain('TR-C-02: audit says "I-1" and TRD.md says "I-1, I-2"');
  });

  it("T-13: reports a traced requirement that the audit artifact omits", async () => {
    const failures = await scanPlanted({ audit: auditMissingRowFixture });
    expect(failures).toContain("TR-A-01: missing from the audit artifact");
  });

  it("T-14: reports an audited requirement that the matrix never traces", async () => {
    const failures = await scanPlanted({ audit: auditExtraRowFixture });
    expect(failures).toContain("TR-G-01: audited but absent from TRD.md section 16");
  });

  it("T-15: reads unique, well-formed requirement ids from the shipped TRD", async () => {
    const trd = await readFile(join(root, "docs", "TRD.md"), "utf8");
    const ids = parseRequirementIds(trd);
    expect(ids.length).toBeGreaterThan(100);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.filter((id) => !/^TR-[A-Z]{1,2}-\d{2}$/.test(id))).toEqual([]);
  });
});
