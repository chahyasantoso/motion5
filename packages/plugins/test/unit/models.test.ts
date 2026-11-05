import { describe, expect, it } from "vitest";
import * as Models from "../../src/models";

describe("first-party models", () => {
  it("exports every first-party model with id equal to its export name", () => {
    for (const [exportName, model] of Object.entries(Models)) {
      if (!("id" in model)) continue;
      expect(model.id).toBe(exportName);
    }
  });

  it("carries legacyTypeId on each model replacing a v5.1 data type", () => {
    expect(Models.Body2d.legacyTypeId).toBe("body2d");
    expect(Models.Goals2d.legacyTypeId).toBe("goals2d");
    expect(Models.Point2d.legacyTypeId).toBe("root2d");
    expect(Models.Solved2d.legacyTypeId).toBe("solved2d");

    expect(Models.Body3d.legacyTypeId).toBe("body3d");
    expect(Models.Goals3d.legacyTypeId).toBe("goals3d");
    expect(Models.Point3d.legacyTypeId).toBe("root3d");
    expect(Models.Solved3d.legacyTypeId).toBe("solved3d");

    expect(Models.Points2d.legacyTypeId).toBeUndefined();
    expect(Models.Points3d.legacyTypeId).toBeUndefined();
  });
});
