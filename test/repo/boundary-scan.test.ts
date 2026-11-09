import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  scan,
  undeclaredWorkspaceSubpaths,
  walk,
  withoutComments,
} from "../../scripts/boundary-scan.mjs";
import {
  cleanFixture,
  dynamicUndeclaredFixture,
  importMentionFixture,
  rigEntrypointFixture,
  undeclaredSubpathFixture,
} from "../../scripts/boundary-scan-fixtures";

const root = fileURLToPath(new URL("../..", import.meta.url));
const WORKSPACES = JSON.stringify({ workspaces: ["packages/*", "apps/*"] });
const PACKAGES_ONLY = JSON.stringify({ workspaces: ["packages/*"] });

async function manifestOf(name: string): Promise<string> {
  return readFile(join(root, "packages", name, "package.json"), "utf8");
}

async function withTree<T>(
  files: Readonly<Record<string, string>>,
  use: (tree: string) => Promise<T>,
  manifest: string = PACKAGES_ONLY,
): Promise<T> {
  const tree = await mkdtemp(join(tmpdir(), "motion5-boundary-"));
  try {
    await writeFile(join(tree, "package.json"), manifest);
    for (const name of ["rig", "moves", "dom"]) {
      await mkdir(join(tree, "packages", name), { recursive: true });
      await writeFile(join(tree, "packages", name, "package.json"), await manifestOf(name));
    }
    for (const [path, source] of Object.entries(files)) {
      await mkdir(join(tree, path, ".."), { recursive: true });
      await writeFile(join(tree, path), `${source}\n`);
    }
    return await use(tree);
  } finally {
    await rm(tree, { recursive: true, force: true });
  }
}

describe("boundary scan", () => {
  it("executes the shipped scanner against the current tree", async () => {
    expect(await scan()).toEqual([]);
  });

  it("walks a tree for source files and passes a clean one", async () => {
    const violations = await withTree(
      { "packages/three/src/index.ts": cleanFixture },
      async (tree) => {
        expect(await walk(join(tree, "packages/three/src"))).toHaveLength(1);
        return scan(tree);
      },
    );
    expect(violations).toEqual([]);
  });

  it("takes the workspace roots from the root manifest", async () => {
    const files = { "apps/demo/src/main.ts": undeclaredSubpathFixture };
    const declared = await withTree(files, (tree) => scan(tree), WORKSPACES);
    const undeclared = await withTree(files, (tree) => scan(tree), PACKAGES_ONLY);
    const violation = "apps/demo/src/main.ts: undeclared workspace subpath @motion5/rig/fabrik";
    expect(declared).toContain(violation);
    expect(undeclared).not.toContain(violation);
    const bare = await mkdtemp(join(tmpdir(), "motion5-no-manifest-"));
    try {
      await expect(scan(bare)).rejects.toThrow(/package\.json/);
    } finally {
      await rm(bare, { recursive: true, force: true });
    }
  });
});

describe("boundary scan: pure packages", () => {
  it("lets a pure package import its own files and any other pure package", async () => {
    const violations = await withTree(
      {
        "packages/moves/src/inside.ts":
          'import { a } from "./sibling";\nimport { fk } from "@motion5/rig";\nexport const b = [a, fk];',
        "packages/moves/src/sibling.ts": "export const a = 1;",
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([]);
  });

  it("refuses a pure package reaching a library, a non-pure package or a path outside it", async () => {
    const violations = await withTree(
      {
        "packages/moves/src/lib.ts": 'import gsap from "gsap";\nexport const g = gsap;',
        "packages/moves/src/outside.ts":
          'import { x } from "../../dom/src/x";\nexport const y = x;',
        "packages/moves/src/dom.ts":
          'import { applyPose } from "@motion5/dom";\nexport const m = applyPose;',
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/moves/src/dom.ts: pure package import outside the pure layer",
      "packages/moves/src/lib.ts: pure package import outside the pure layer",
      "packages/moves/src/outside.ts: pure package import outside the pure layer",
    ]);
  });

  it("holds any package that declares the pure layer to it, whatever its name", async () => {
    const violations = await withTree(
      {
        "packages/geometry/package.json": JSON.stringify({
          name: "@motion5/geometry",
          motion5: { layer: "pure" },
          exports: { ".": "./src/index.ts" },
        }),
        "packages/geometry/src/index.ts":
          'import { applyPose } from "@motion5/dom";\nexport const u = applyPose;',
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/geometry/src/index.ts: pure package import outside the pure layer",
    ]);
  });
});

describe("boundary scan: page tools", () => {
  it("keeps page tools to node, playwright-core and vite", async () => {
    const violations = await withTree(
      {
        "packages/tools/package.json": JSON.stringify({ name: "@motion5/tools", exports: {} }),
        "packages/tools/src/page/frames.ts":
          'import { join } from "node:path";\nimport { chromium } from "playwright-core";\nimport { a } from "./page";\nexport const f = [join, chromium, a];',
        "packages/tools/src/page/page.ts":
          'import { createServer } from "vite";\nexport const a = createServer;',
        "packages/tools/src/page/sample.ts":
          'import { hop } from "@motion5/moves";\nexport const e = hop;',
        "packages/tools/src/page/reach.ts":
          'import { s } from "../scene/scene";\nexport const r = s;',
      },
      (tree) => scan(tree),
    );
    expect(violations).toEqual([
      "packages/tools/src/page/reach.ts: page tool import outside node, playwright-core and vite",
      "packages/tools/src/page/sample.ts: page tool import outside node, playwright-core and vite",
    ]);
  });
});

describe("boundary scan: declared subpaths", () => {
  const declared = manifestOf("rig").then(
    (text) =>
      new Map<string, ReadonlySet<string>>([
        [
          (JSON.parse(text) as { name: string }).name,
          new Set(Object.keys((JSON.parse(text) as { exports: object }).exports)),
        ],
      ]),
  );

  it("refuses an undeclared subpath of any workspace package", async () => {
    const subpaths = await declared;
    expect(undeclaredWorkspaceSubpaths(undeclaredSubpathFixture, subpaths)).toEqual([
      "@motion5/rig/fabrik",
    ]);
    for (const fixture of [
      rigEntrypointFixture,
      '// see "@motion5/rig/fabrik" for the solve\nexport const kept = 1;',
    ])
      expect(undeclaredWorkspaceSubpaths(fixture, subpaths)).toEqual([]);

    const consumer = `${rigEntrypointFixture}\n${undeclaredSubpathFixture}`;
    const withManifest = await withTree({ "packages/three/src/index.ts": consumer }, (tree) =>
      scan(tree),
    );
    expect(withManifest).toEqual([
      "packages/three/src/index.ts: undeclared workspace subpath @motion5/rig/fabrik",
    ]);
    // With no manifest nothing is declared, so the same consumer fails closed on both.
    const bare = await mkdtemp(join(tmpdir(), "motion5-no-rig-"));
    try {
      await writeFile(join(bare, "package.json"), PACKAGES_ONLY);
      await mkdir(join(bare, "packages/three/src"), { recursive: true });
      await writeFile(join(bare, "packages/three/src/index.ts"), `${consumer}\n`);
      expect(await scan(bare)).toEqual([
        "packages/three/src/index.ts: undeclared workspace subpath @motion5/rig",
        "packages/three/src/index.ts: undeclared workspace subpath @motion5/rig/fabrik",
      ]);
    } finally {
      await rm(bare, { recursive: true, force: true });
    }
  });

  it("reads a specifier from code, dynamic imports included, and not from prose", async () => {
    const subpaths = await declared;
    expect(undeclaredWorkspaceSubpaths(dynamicUndeclaredFixture, subpaths)).toEqual([
      "@motion5/rig/fabrik",
    ]);
    expect(undeclaredWorkspaceSubpaths(importMentionFixture, subpaths)).toEqual([]);
    expect(
      undeclaredWorkspaceSubpaths(
        '/* from "@motion5/rig/fabrik" */ import { a } from "@motion5/rig/fabrik";',
        subpaths,
      ),
    ).toEqual(["@motion5/rig/fabrik"]);
    expect(withoutComments('// from "@motion5/rig/fabrik"\nexport const x = 1;')).not.toContain(
      "fabrik",
    );
  });
});
