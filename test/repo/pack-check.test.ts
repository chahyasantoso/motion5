import { describe, expect, it } from "vitest";
import {
  allSpecifiers,
  firstErrorLine,
  formatResult,
  missingExportFiles,
  peerVersions,
  typeCheckFiles,
} from "../../scripts/pack-check.mjs";

const manifest = {
  name: "@gerak/fixture",
  version: "0.1.0",
  exports: {
    ".": { types: "./dist/index.d.ts", default: "./dist/index.js" },
    "./react": { types: "./dist/react.d.ts", default: "./dist/react.js" },
  },
};

describe("pack check", () => {
  it("lists every export specifier of the installable packages", () => {
    const specifiers = allSpecifiers();
    expect(specifiers).toContain("@gerak/rig");
    expect(specifiers).toContain("@gerak/three");
    expect(specifiers).toContain("@gerak/three/react");
    expect(new Set(specifiers).size).toBe(specifiers.length);
  });

  it("lists specifiers from the given manifests", () => {
    expect(allSpecifiers(["fixture"], () => manifest)).toEqual([
      "@gerak/fixture",
      "@gerak/fixture/react",
    ]);
  });

  it("prints one PASS or FAIL line per specifier", () => {
    expect(formatResult("@gerak/rig")).toBe("PASS @gerak/rig");
    expect(formatResult("@gerak/rig", "ReferenceError: window is not defined")).toBe(
      "FAIL @gerak/rig: ReferenceError: window is not defined",
    );
  });

  it("reads the first error line out of a Node stack", () => {
    const stderr =
      "\nfile:///x/index.js:1\nthrow 1\n\nReferenceError: window is not defined\n  at x";
    expect(firstErrorLine(stderr)).toBe("ReferenceError: window is not defined");
    expect(firstErrorLine("")).toBe("no output");
  });

  it("fails a missing export file by its specifier", () => {
    const present = new Set(["./dist/index.js", "./dist/index.d.ts", "./dist/react.d.ts"]);
    expect(missingExportFiles(manifest, (file) => present.has(file))).toEqual([
      { specifier: "@gerak/fixture/react", error: "missing file ./dist/react.js" },
    ]);
  });

  it("pins the peers to the versions the lockfile installed", () => {
    const lock = {
      packages: {
        "node_modules/react": { version: "19.2.8" },
        "node_modules/react-dom": { version: "19.2.9" },
        "node_modules/three": { version: "0.186.1" },
        "node_modules/typescript": { version: "5.8.3" },
        "node_modules/@types/react": { version: "19.2.2" },
        "node_modules/@types/three": { version: "0.186.0" },
      },
    };
    expect(peerVersions(lock)).toEqual([
      "react@19.2.8",
      "react-dom@19.2.9",
      "three@0.186.1",
      "typescript@5.8.3",
      "@types/react@19.2.2",
      "@types/three@0.186.0",
    ]);
    expect(() => peerVersions({ packages: {} })).toThrow("react");
  });

  it("writes a strict consumer that imports every export under node resolution", () => {
    const files = typeCheckFiles(["@gerak/moves", "@gerak/three/react"]);
    expect(files["consumer.ts"]).toContain('import * as m1 from "@gerak/three/react";');
    const config: unknown = JSON.parse(files["tsconfig.json"] ?? "");
    expect(config).toMatchObject({
      compilerOptions: { strict: true, skipLibCheck: false, moduleResolution: "nodenext" },
    });
  });
});
