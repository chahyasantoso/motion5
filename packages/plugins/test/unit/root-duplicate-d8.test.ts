import { describe, expect, it } from "vitest";
import { PluginRegistry } from "@motion5/core";
import { deriveStructuralDescriptors } from "../../../core/src/domain/structural-derivation";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";

describe("D8: duplicate root entry reports exactly one diagnostic", () => {
  it("reports exactly one diagnostic when track has two root entries and one point entry", () => {
    const registry = new PluginRegistry();
    registry.registerAll([pointPlugin, rootPlugin]);

    const armPlan = registry.compileExecutionPlan(
      [
        { r1: { plugin: "root" } },
        { p0: { plugin: "point", values: { length: 10, x: 0, y: 0 } } },
        { r2: { plugin: "root" } },
      ],
      { trackId: "arm" },
    );

    const plans = new Map([["arm", armPlan]]);

    const outcome = deriveStructuralDescriptors({
      order: ["arm"],
      plans,
    });

    expect(outcome.kind).toBe("refused");
    const duplicateRootDiags = outcome.diagnostics.filter((d) =>
      /Duplicate root entries/i.test(d.message),
    );
    expect(duplicateRootDiags).toHaveLength(1);
  });
});
