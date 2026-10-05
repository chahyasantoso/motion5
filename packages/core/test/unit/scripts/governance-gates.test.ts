import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const root = fileURLToPath(new URL("../../../../../", import.meta.url));

async function text(path: string): Promise<string> {
  return readFile(join(root, path), "utf8");
}

describe("recovery governance gates (G-1/G-3/G-4/G-5/G-7)", () => {
  it("resolves the public testing entrypoint to source from the plugin test home", () => {
    const configFile = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile);
    expect(configFile.error).toBeUndefined();
    const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, root);
    expect(config.errors).toEqual([]);
    const resolution = ts.resolveModuleName(
      "@motion5/core/testing",
      join(root, "packages/plugins/test/integration/ik-envelope.test.ts"),
      config.options,
      ts.sys,
    );
    // Vitest aliases do not affect tsc. Require source even when dist happens to exist.
    expect(resolution.resolvedModule?.resolvedFileName).toBe(
      join(root, "packages/core/src/testing/fakes.ts"),
    );
  });

  it("builds publishable package declarations instead of declaring source as the package", async () => {
    const packageJson = JSON.parse(await text("packages/core/package.json")) as {
      types?: string;
      exports?: { "."?: { types?: string; default?: string } };
    };
    const entry = packageJson.exports?.["."];
    expect(packageJson.types).toBe("./dist/index.d.ts");
    expect(entry?.types).toBe("./dist/index.d.ts");
    expect(entry?.default).toBe("./dist/index.js");
    await expect(text("packages/core/tsconfig.build.json")).resolves.toContain(
      '"emitDeclarationOnly": false',
    );
  });

  it("requires acceptance to prove mapped tests passed in the executed report", async () => {
    const source = await text("scripts/acceptance-scan.mjs");
    expect(source).toContain("testResults");
    expect(source).toContain("passed");
    expect(source).toContain("skipped");
    expect(source).toContain("testFile");
  });

  it("requires failing-first to distinguish assertion red from infrastructure red", async () => {
    const source = await text(".github/workflows/recovery-audit.yml");
    expect(source).toContain("--reporter=json");
    expect(source).toContain("assertion-level");
    expect(source).toContain("import-resolution");
    expect(source).toContain("set -euo pipefail");
  });

  it("reports mutation score with one denominator and enforces a threshold", async () => {
    const source = await text("scripts/mutation-summary.mjs");
    expect(source).toContain('mutant.status !== "NoCoverage"');
    expect(source).toContain("threshold");
    expect(source).toContain("process.exitCode");
    expect(source).not.toContain("thresholds&&r.thresholds.high?'reported':'reported'");
  });

  it("puts build and end-to-end on the required CI path", async () => {
    const source = await text(".github/workflows/ci.yml");
    expect(source).toContain("build:");
    const coreBuild = source.indexOf("npx tsc -p packages/core/tsconfig.build.json");
    const pluginsBuild = source.indexOf("npx tsc -p packages/plugins/tsconfig.build.json");
    expect(coreBuild).toBeGreaterThanOrEqual(0);
    expect(pluginsBuild).toBeGreaterThan(coreBuild);
    expect(source).toContain("test -f packages/plugins/dist/fk.js");
    expect(source).toContain("test -f packages/plugins/dist/fk.d.ts");
    expect(source).toContain("end-to-end:");
    expect(source).not.toContain("continue-on-error: true");
  });
});
