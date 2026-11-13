import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { withExtensions } from "../../scripts/build.mjs";
import { INSTALLABLE_PACKAGES, readManifest } from "../../scripts/installable-packages.mjs";

const packagesRoot = fileURLToPath(new URL("../../packages/", import.meta.url));

describe("installable manifests", () => {
  it("names the nine runtime packages", () => {
    expect(INSTALLABLE_PACKAGES).toHaveLength(9);
  });

  describe.each(INSTALLABLE_PACKAGES)("%s", (directory) => {
    const manifest = readManifest(directory);

    it("is a public 0.1.0 package that ships dist", () => {
      expect(manifest.version).toBe("0.1.0");
      expect(manifest.private).toBeUndefined();
      expect(manifest.license).toBe("MIT");
      expect(manifest.files).toEqual(["dist", "LICENSE"]);
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
  const exists = (path: string) => path.endsWith("ease.js");

  it("names the emitted file or the directory index of a relative import", () => {
    const text = 'export { a } from "./ease";\nimport { b } from "./sub";\nawait import("./ease");';
    expect(withExtensions(text, "/d", exists)).toBe(
      'export { a } from "./ease.js";\nimport { b } from "./sub/index.js";\nawait import("./ease.js");',
    );
  });

  it("leaves package specifiers and named extensions alone", () => {
    const text = 'import "@gerak/moves";\nimport x from "./x.js";';
    expect(withExtensions(text, "/d", exists)).toBe(text);
  });
});
