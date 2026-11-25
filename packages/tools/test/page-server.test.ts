import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { searchForWorkspaceRoot } from "vite";
import { describe, expect, it } from "vitest";
import { pageServerConfig } from "../src/page/server";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));

describe("pageServerConfig", async () => {
  it("adds the live plugin, excludes tools from dep pre-bundling, and includes every dependency a page loads", async () => {
    const config = await pageServerConfig(REPO);
    expect(config.plugins.map((plugin) => plugin.name)).toEqual(["motion-live"]);
    expect(config.optimizeDeps.exclude).toEqual(["@gerak/tools", "@gerak/tools/pages"]);
    expect(config.optimizeDeps.include).toEqual([
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "three",
    ]);
  });

  it("leaves three out of a folder that cannot resolve it", async () => {
    const root = mkdtempSync(join(tmpdir(), "gerak-no-three-"));
    try {
      expect((await pageServerConfig(root)).optimizeDeps.include).not.toContain("three");
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("keeps Vite's workspace root readable beside the pieces folder and the tools", async () => {
    const root = join(REPO, "apps", "pieces");
    const allow = (await pageServerConfig(root)).server.fs.allow;
    expect(allow).toContain(searchForWorkspaceRoot(root));
    expect(allow).toContain(root);
    expect(allow.map((folder) => resolve(folder))).toContain(resolve(REPO, "packages", "tools"));
  });
});
