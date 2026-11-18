import { describe, expect, it } from "vitest";
import { compileSkins } from "../src";

describe("skins compilation", () => {
  it("normalizes inline and url DOM skins and preserves extra renderer skins", () => {
    expect(compileSkins(undefined)).toEqual({ ok: true, skins: {} });

    const inlineDefault = compileSkins({ dom: { css: ".a { color: red; }", defs: "<defs/>" } });
    expect(inlineDefault).toEqual({
      ok: true,
      skins: { dom: { kind: "inline", css: ".a { color: red; }", defs: "<defs/>" } },
    });

    const cssUrl = new URL("https://example.com/a.css");
    const defsUrl = new URL("https://example.com/a.svg");
    const urlDefault = compileSkins({
      dom: { css: cssUrl, defs: defsUrl },
      canvas: { theme: "dark" },
    });
    expect(urlDefault).toEqual({
      ok: true,
      skins: {
        dom: { kind: "url", css: cssUrl, defs: defsUrl },
        canvas: { theme: "dark" },
      },
    });
  });

  it("rejects mismatched css/defs types and unknown skin kinds", () => {
    const url = new URL("https://example.com/a.css");
    expect(compileSkins({ dom: { css: url, defs: "<defs/>" } }).ok).toBe(false);
    expect(compileSkins({ dom: { kind: "url", css: ".a {}" } }).ok).toBe(false);
    expect(compileSkins({ dom: { kind: "external", css: ".a {}" } }).ok).toBe(false);
    expect(compileSkins("not-an-object").ok).toBe(false);
  });
});
