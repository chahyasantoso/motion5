import { describe, expect, it } from "vitest";
import { cssVariables, isTokenName } from "../src/dom";

describe("@gerak/stage/dom", () => {
  it("validates custom property token names", () => {
    expect(isTokenName("--ink")).toBe(true);
    expect(isTokenName("--accent_2-bright")).toBe(true);
    expect(isTokenName("--")).toBe(false);
    expect(isTokenName("-ink")).toBe(false);
    expect(isTokenName("ink")).toBe(false);
    expect(isTokenName("--bad name")).toBe(false);
  });

  it("formats ordered :host CSS custom property declarations and rejects injection chars", () => {
    expect(cssVariables({})).toBe("");
    expect(cssVariables({ "--ink": "#111", "--gap": "8px" })).toBe(
      ":host { --ink: #111; --gap: 8px; }",
    );
    expect(() => cssVariables({ ink: "#111" })).toThrow(Error);
    expect(() => cssVariables({ "--ink": "red; color: blue" })).toThrow(Error);
    expect(() => cssVariables({ "--ink": "x { color: red }" })).toThrow(Error);
  });
});
