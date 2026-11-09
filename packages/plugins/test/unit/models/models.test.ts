import { describe, expect, it } from "vitest";
import * as Models from "../../../src/models/index";

describe("first-party models", () => {
  it("exports every first-party model with id equal to its export name", () => {
    for (const [exportName, model] of Object.entries(Models)) {
      if (!("id" in model)) continue;
      expect(model.id).toBe(exportName);
    }
  });
});
