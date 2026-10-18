import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "@motion5/core";
import { deriveStructuralDescriptors } from "../../../core/src/domain/structural-derivation";
import { pointPlugin } from "../../src/point";
import { rootPlugin } from "../../src/root";

describe("D7: root bound to frame source", () => {
  const frameSrcPlugin: PluginDefinition = {
    name: "frame-src",
    fold: {
      outputs: ["x"],
      run: () => ({ x: 0 }),
    },
  };

  it("accepts root bound to frame source and yields bound rootPolicy", () => {
    const registry = new PluginRegistry();
    registry.registerAll([frameSrcPlugin, pointPlugin, rootPlugin]);

    const bodyPlan = registry.compileExecutionPlan([{ b0: { plugin: "frame-src" } }], {
      trackId: "body",
    });
    const armPlan = registry.compileExecutionPlan(
      [
        { p0: { plugin: "point", values: { length: 10, x: 0, y: 0 } } },
        { r0: { plugin: "root", requires: { frame: "body" } } },
      ],
      { trackId: "arm" },
    );

    const plans = new Map([
      ["body", bodyPlan],
      ["arm", armPlan],
    ]);

    const outcome = deriveStructuralDescriptors({
      order: ["body", "arm"],
      plans,
    });

    expect(outcome.kind).toBe("accepted");
    const armDescs = outcome.descriptors.get("arm");
    expect(armDescs).toBeDefined();
    expect(armDescs).toHaveLength(1);
    const chainDesc = armDescs![0]!;
    expect(chainDesc.capability).toBe("chain");
    expect((chainDesc.payload as { rootPolicy: { kind: string } }).rootPolicy.kind).toBe("bound");
  });
});
