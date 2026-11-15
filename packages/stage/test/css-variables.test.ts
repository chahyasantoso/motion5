import { describe, expect, it } from "vitest";
import { actor, cssVariables, readStageModule, story } from "@gerak/stage";

describe("cssVariables", () => {
  it("writes a :host rule in the tokens' order", () => {
    expect(cssVariables({ "--a": "1", "--b": "red" })).toBe(":host { --a: 1; --b: red; }");
    expect(cssVariables({})).toBe("");
  });
  it("refuses a name without dashes and a value that breaks the rule", () => {
    expect(() => cssVariables({ x: "1" })).toThrow(/"x"/);
    expect(() => cssVariables({ "--a": "1; color: red" })).toThrow(/--a/);
  });
});

describe("a module's style", () => {
  const base = {
    beats: story(1000, { go: [0, 1000] }),
    cast: { a: actor({}) },
    skins: { dom: { css: "" } },
    scene: () => ({}),
  };
  it("carries a style name and refuses a number", () => {
    const read = readStageModule({ ...base, style: "reel" });
    expect("reason" in read ? read.reason : read.style).toBe("reel");
    const bad = readStageModule({ ...base, style: 3 });
    expect("reason" in bad ? bad.reason : "").toMatch(/style/);
  });
});
