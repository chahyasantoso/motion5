import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";
import { PACKAGES } from "../../scripts/reference.mjs";
import { withExtensions } from "../../scripts/build.mjs";
import { INSTALLABLE_PACKAGES, readManifest } from "../../scripts/installable-packages.mjs";
import { removeTemp } from "../support/temp";

const packagesRoot = fileURLToPath(new URL("../../packages/", import.meta.url));

const SHIPPED: Readonly<Record<string, readonly string[]>> = {
  tools: ["dist", "bin", "skill", "docs", "LICENSE"],
  studio: ["dist", "bin", "docs", "LICENSE"],
};

/** Packages whose generated reference ships in `docs`. */
const WITH_DOCS = new Set(PACKAGES.map(({ dir }) => dir));

describe("installable manifests", () => {
  it("names every public package under packages/ once, the tools then the studio last", () => {
    const publics = readdirSync(packagesRoot)
      .filter((directory) => readManifest(directory).private !== true)
      .sort();
    expect([...INSTALLABLE_PACKAGES].sort()).toEqual(publics);
    expect(INSTALLABLE_PACKAGES.slice(-2)).toEqual(["tools", "studio"]);
  });

  describe.each(INSTALLABLE_PACKAGES)("%s", (directory) => {
    const manifest = readManifest(directory);

    it("is a public 0.1.0 package that ships dist", () => {
      expect(manifest.version).toBe("0.1.0");
      expect(manifest.private).toBeUndefined();
      expect(manifest.license).toBe("MIT");
      expect(manifest.files).toEqual(
        SHIPPED[directory] ??
          (WITH_DOCS.has(directory) ? ["dist", "docs", "LICENSE"] : ["dist", "LICENSE"]),
      );
      for (const [name, range] of Object.entries(manifest.dependencies ?? {})) {
        if (name.startsWith("@gerak/")) expect(range).toBe("0.1.0");
      }
    });

    it("exports emitted files that have a source module and a declaration", () => {
      const entries = Object.entries(manifest.exports);
      expect(entries.length).toBeGreaterThan(0);
      for (const [, target] of entries) {
        const emitted = /^\.\/dist\/(.+)\.js$/.exec(target.default);
        expect(emitted, target.default).not.toBeNull();
        const module = emitted?.[1] ?? "";
        expect(target.types).toBe(`./dist/${module}.d.ts`);
        expect(existsSync(`${packagesRoot}${directory}/src/${module}.ts`), module).toBe(true);
      }
      expect(manifest.types).toBe(manifest.exports["."]?.types);
    });
  });

  it("orders every package after the internal packages it depends on", () => {
    INSTALLABLE_PACKAGES.forEach((directory, index) => {
      for (const name of Object.keys(readManifest(directory).dependencies ?? {})) {
        if (!name.startsWith("@gerak/")) continue;
        expect(INSTALLABLE_PACKAGES.indexOf(name.slice(7))).toBeLessThan(index);
      }
    });
  });
});

describe("withExtensions", () => {
  const folder = mkdtempSync(join(tmpdir(), "gerak-build-"));
  const inner = join(folder, "sub");
  mkdirSync(inner);
  writeFileSync(join(folder, "ease.js"), "");
  writeFileSync(join(folder, "index.js"), "");
  writeFileSync(join(inner, "index.js"), "");
  afterAll(() => removeTemp(folder));

  it("names the emitted file or the folder index of every real module specifier", () => {
    const text = [
      'export { a } from "./ease";',
      'import { b } from "./sub";',
      'export * from "./ease";',
      'await import("./ease");',
      'type T = import("./ease").T;',
    ].join("\n");
    expect(withExtensions(text, folder, undefined, "x.d.ts")).toBe(
      [
        'export { a } from "./ease.js";',
        'import { b } from "./sub/index.js";',
        'export * from "./ease.js";',
        'await import("./ease.js");',
        'type T = import("./ease.js").T;',
      ].join("\n"),
    );
    expect(withExtensions('import { c } from "..";', inner)).toBe(
      'import { c } from "../index.js";',
    );
  });

  it("leaves strings, templates, comments, packages and named extensions alone", () => {
    const text = [
      'import "@gerak/moves";',
      'import x from "./x.js";',
      '// reads from "./ease"',
      "const said = 'text from \"./ease\" ok';",
      'const line = `import y from "./ease"`;',
    ].join("\n");
    expect(withExtensions(text, folder)).toBe(text);
  });

  it("refuses a relative specifier that names no emitted module", () => {
    expect(() => withExtensions('import z from "./nothing";', folder)).toThrow(/"\.\/nothing"/);
  });
});
