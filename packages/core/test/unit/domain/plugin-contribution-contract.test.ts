import { describe, expect, it } from "vitest";
import { PluginRegistry } from "../../../src/domain/plugins";

describe("plugin contribution contract (X-3)", () => {
  it("rejects contribution output that overwrites an authored key", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "base",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ x: { stops: [{ p: 0, v: 99 }, { p: 1, v: 100 }] } }),
      compose: (values) => values,
    });

    const resolved = registry.resolveForKeyframes({ x: {} });
    expect(resolved.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "plugin-contribution-output-collision" }),
    );
  });

  it("rejects two contributors that write the same contributed key", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "first",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ derived: { stops: [{ p: 0, v: 1 }, { p: 1, v: 2 }] } }),
      compose: (values) => values,
    });
    registry.register({
      name: "second",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({ derived: { stops: [{ p: 0, v: 3 }, { p: 1, v: 4 }] } }),
      compose: (values) => values,
    });

    const resolved = registry.resolveForKeyframes({ x: {} });
    expect(resolved.diagnostics).toContainEqual(
      expect.objectContaining({ ruleId: "plugin-contribution-key-collision" }),
    );
  });

  it("rejects ease and tween-variable collisions deterministically", () => {
    const registry = new PluginRegistry();
    registry.register({
      name: "first",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({
        x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 1, ease: "power1.out" }] },
        tweenVars: { ease: "power1.out", duration: 1 },
      }),
      compose: (values) => values,
    });
    registry.register({
      name: "second",
      keys: ["x"],
      stage: "prepare",
      contribute: () => ({
        x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 1, ease: "power2.out" }] },
        tweenVars: { ease: "power2.out", duration: 2 },
      }),
      compose: (values) => values,
    });

    const resolved = registry.resolveForKeyframes({ x: {} });
    expect(resolved.diagnostics).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: "plugin-contribution-ease-collision" }),
        expect.objectContaining({ ruleId: "plugin-contribution-tween-vars-collision" }),
      ]),
    );
  });
});
