// @ts-nocheck
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { scan } from "../../scripts/boundary-scan.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));
const PACKAGES_ONLY = JSON.stringify({ workspaces: ["packages/*"] });

async function manifestOf(name: string): Promise<string> {
  return readFile(join(root, "packages", name, "package.json"), "utf8");
}

async function withDomTree<T>(
  files: Readonly<Record<string, string>>,
  use: (tree: string) => Promise<T>,
): Promise<T> {
  const tree = await mkdtemp(join(tmpdir(), "gerak-adapter-boundary-"));
  try {
    await writeFile(join(tree, "package.json"), PACKAGES_ONLY);
    await mkdir(join(tree, "packages", "dom"), { recursive: true });
    await writeFile(join(tree, "packages", "dom", "package.json"), await manifestOf("dom"));
    for (const [path, source] of Object.entries(files)) {
      await mkdir(join(tree, path, ".."), { recursive: true });
      await writeFile(join(tree, path), `${source}\n`);
    }
    return await use(tree);
  } finally {
    await rm(tree, { recursive: true, force: true });
  }
}

describe("boundary scan: dom adapter boundary", () => {
  it("reports motion files in packages/dom/src that import from packages/dom/src/adapter/", async () => {
    const violations = await withDomTree(
      {
        "packages/dom/src/adapter/listen.ts": "export const listen = () => () => undefined;",
        "packages/dom/src/adapter/index.ts": 'export { listen } from "./listen";',
        "packages/dom/src/scheduler.ts":
          'import { listen } from "./adapter/listen";\nexport const s = listen;',
        "packages/dom/src/mount.ts":
          'import { listen } from "./adapter";\nexport const m = listen;',
      },
      (tree) => scan(tree),
    );

    const schedulerReports = violations.filter((v: string) =>
      v.startsWith("packages/dom/src/scheduler.ts:"),
    );
    const mountReports = violations.filter((v: string) =>
      v.startsWith("packages/dom/src/mount.ts:"),
    );

    expect(
      schedulerReports.length,
      "adapter boundary rule missing or did not report packages/dom/src/scheduler.ts importing ./adapter/listen",
    ).toBeGreaterThan(0);
    expect(
      mountReports.length,
      "adapter boundary rule missing or did not report packages/dom/src/mount.ts importing ./adapter",
    ).toBeGreaterThan(0);
  });

  it("exempts packages/dom/src/index.ts and files inside packages/dom/src/adapter/", async () => {
    const violations = await withDomTree(
      {
        "packages/dom/src/adapter/listen.ts": "export const listen = () => () => undefined;",
        "packages/dom/src/adapter/pointer.ts":
          'import { listen } from "./listen";\nexport const p = listen;',
        "packages/dom/src/index.ts": 'export { listen } from "./adapter/listen";',
      },
      (tree) => scan(tree),
    );

    expect(violations).toEqual([]);
  });

  it("passes on the real repository tree", async () => {
    expect(await scan()).toEqual([]);
  });
});
