import { describe, expect, it } from "vitest";

import { serializeGolden } from "../../src/contract/golden";
import { validateSchemaV5 } from "../../src/contract/validate-v5";
import { freeTrackProject, minimalV5Project } from "../fixtures/v5-contract";

describe("P0-05 v5 contract integration", () => {
  it("serializes the minimal project deterministically", () => {
    const first = serializeGolden(minimalV5Project);
    const second = serializeGolden({ freeTracks: [], motions: [], schemaVersion: 5 });
    expect(first).toBe(second);
    expect(first).toContain('"schemaVersion": 5');
  });

  it("accepts a project with a shared free track", () => {
    const result = validateSchemaV5(freeTrackProject);
    expect(result.kind).toBe("accepted");
    expect(result.diagnostics).toEqual([]);
  });
});
