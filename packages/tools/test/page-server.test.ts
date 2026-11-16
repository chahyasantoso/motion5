import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { searchForWorkspaceRoot } from "vite";
import { describe, expect, it } from "vitest";
import { pageServerConfig } from "../src/page/server";

const REPO = fileURLToPath(new URL("../../../", import.meta.url));

describe("pageServerConfig", () => {
  it("adds the live plugin, excludes tools from dep pre-bundling, and includes React CJS peers", () => {
    const config = pageServerConfig(REPO);
    expect(config.plugins.map((plugin) => plugin.name)).toEqual(["motion-live"]);
    expect(config.optimizeDeps.exclude).toEqual(["@gerak/tools", "@gerak/tools/pages"]);
    expect(config.optimizeDeps.include).toEqual([
      "react",
      "react-dom",
      "react-dom/client",
      "react/jsx-runtime",
    ]);
  });

  it("keeps Vite's workspace root readable beside the pieces folder and the tools", () => {
    const root = join(REPO, "apps", "pieces");
    const allow = pageServerConfig(root).server.fs.allow;
    expect(allow).toContain(searchForWorkspaceRoot(root));
    expect(allow).toContain(root);
    expect(allow.map((folder) => resolve(folder))).toContain(resolve(REPO, "packages", "tools"));
  });
});
