import { describe, expect, it } from "vitest";

import { parseGolden, serializeGolden } from "../../src/contract/golden";
import { freeTrackProject } from "../fixtures/v5-contract";

describe("golden fixture round trips", () => {
  it("round trips JSON-safe fixture data with stable ordering", () => {
    const serialized = serializeGolden(freeTrackProject);
    expect(serializeGolden(parseGolden(serialized))).toBe(serialized);
  });
});
