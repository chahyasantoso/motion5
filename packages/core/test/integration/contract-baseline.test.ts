import { describe, expect, it } from "vitest";

import { migrateV4ToV5 } from "../../src/contract/migrate-v4-to-v5";
import { serializeGolden } from "../../src/contract/golden";
import { validateV5 } from "../../src/contract/validate-v5";
import {
  cyclicProject,
  freeTrackProject,
  minimalV5Project,
  perspectiveWarningProject,
} from "../fixtures/v5-contract";

describe("P0-05 v5 contract integration", () => {
  it("serializes the minimal project deterministically", () => {
    const first = serializeGolden(minimalV5Project);
    const second = serializeGolden({ freeTracks: [], motions: [], schemaVersion: 5 });
    expect(first).toBe(second);
    expect(first).toContain('"schemaVersion": 5');
  });

  it("accepts a project with a shared free track", () => {
    const result = validateV5(freeTrackProject);
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toEqual([]);
  });

  it("preserves warnings without rejecting the project", () => {
    const result = validateV5(perspectiveWarningProject);
    expect(result.valid).toBe(true);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "perspective-usage", severity: "warning" }),
    );
  });

  it("rejects cycles before runtime mounting", () => {
    const result = validateV5(cyclicProject);
    expect(result.valid).toBe(false);
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "graph-cycle", severity: "error" }),
    );
  });

  it("migrates a v4 document without changing its source", () => {
    const source = { schemaVersion: 4, tracks: [{ id: "cursor" }], motions: [] };
    const before = serializeGolden(source);
    const result = migrateV4ToV5(source);
    expect(result.diagnostics).toEqual([]);
    expect(result.migrated?.schemaVersion).toBe(5);
    expect(serializeGolden(source)).toBe(before);
  });
});
