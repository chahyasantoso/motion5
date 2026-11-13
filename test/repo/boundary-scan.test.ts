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
  appImportsAppFixture,
  appImportsPackagePathFixture,
  cleanFixture,
  dynamicUndeclaredFixture,
  importMentionFixture,
  packageImportsAppFixture,
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
  const tree = await mkdtemp(join(tmpdir(), "gerak-boundary-"));
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
    const violation = "apps/demo/src/main.ts: undeclared workspace subpath @gerak/rig/fabrik";
    expect(declared).toContain(violation);
    expect(undeclared).not.toContain(violation);
    const bare = await mkdtemp(join(tmpdir(), "gerak-no-manifest-"));
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
          'import { a } from "./sibling";\nimport { fk } from "@gerak/rig";\nexport const b = [a, fk];',
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
          'import { applyPose } from "@gerak/dom";\nexport const m = applyPose;',
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
          name: "@gerak/geometry",
          gerak: { layer: "pure" },
          exports: { ".": "./src/index.ts" },
        }),
        "packages/geometry/src/index.ts":
          'import { applyPose } from "@gerak/dom";\nexport const u = applyPose;',
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
        "packages/tools/package.json": JSON.stringify({ name: "@gerak/tools", exports: {} }),
        "packages/tools/src/page/frames.ts":
          'import { join } from "node:path";\nimport { chromium } from "playwright-core";\nimport { a } from "./page";\nexport const f = [join, chromium, a];',
        "packages/tools/src/page/page.ts":
          'import { createServer } from "vite";\nexport const a = createServer;',
        "packages/tools/src/page/sample.ts":
          'import { hop } from "@gerak/moves";\nexport const e = hop;',
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
      "@gerak/rig/fabrik",
    ]);
    for (const fixture of [
      rigEntrypointFixture,
      '// see "@gerak/rig/fabrik" for the solve\nexport const kept = 1;',
    ])
      expect(undeclaredWorkspaceSubpaths(fixture, subpaths)).toEqual([]);

    const consumer = `${rigEntrypointFixture}\n${undeclaredSubpathFixture}`;
    const withManifest = await withTree({ "packages/three/src/index.ts": consumer }, (tree) =>
      scan(tree),
    );
    expect(withManifest).toEqual([
      "packages/three/src/index.ts: undeclared workspace subpath @gerak/rig/fabrik",
    ]);
    // With no manifest nothing is declared, so the same consumer fails closed on both.
    const bare = await mkdtemp(join(tmpdir(), "gerak-no-rig-"));
    try {
      await writeFile(join(bare, "package.json"), PACKAGES_ONLY);
      await mkdir(join(bare, "packages/three/src"), { recursive: true });
      await writeFile(join(bare, "packages/three/src/index.ts"), `${consumer}\n`);
      expect(await scan(bare)).toEqual([
        "packages/three/src/index.ts: undeclared workspace subpath @gerak/rig",
        "packages/three/src/index.ts: undeclared workspace subpath @gerak/rig/fabrik",
      ]);
    } finally {
      await rm(bare, { recursive: true, force: true });
    }
  });

  it("reads a specifier from code, dynamic imports included, and not from prose", async () => {
    const subpaths = await declared;
    expect(undeclaredWorkspaceSubpaths(dynamicUndeclaredFixture, subpaths)).toEqual([
      "@gerak/rig/fabrik",
    ]);
    expect(undeclaredWorkspaceSubpaths(importMentionFixture, subpaths)).toEqual([]);
    expect(
      undeclaredWorkspaceSubpaths(
        '/* from "@gerak/rig/fabrik" */ import { a } from "@gerak/rig/fabrik";',
        subpaths,
      ),
    ).toEqual(["@gerak/rig/fabrik"]);
    expect(withoutComments('// from "@gerak/rig/fabrik"\nexport const x = 1;')).not.toContain(
      "fabrik",
    );
  });
});

describe("boundary scan: app boundary", () => {
  const appManifest = (name: string) => JSON.stringify({ name, exports: {} });
  const apps = {
    "apps/demo/package.json": appManifest("@gerak/demo"),
    "apps/other/package.json": appManifest("@gerak/other"),
  };

  it("refuses a package importing an app, by path or by name", async () => {
    const violations = await withTree(
      {
        ...apps,
        "packages/moves/src/path.ts": packageImportsAppFixture,
        "packages/moves/src/name.ts": 'import { a } from "@gerak/demo";',
      },
      (tree) => scan(tree),
      WORKSPACES,
    );
    expect(violations).toContain(
      "packages/moves/src/path.ts: package imports an app ../../../apps/demo/src/main",
    );
    expect(violations).toContain("packages/moves/src/name.ts: package imports an app @gerak/demo");
  });

  it("refuses an app importing a package by path, and allows a declared export", async () => {
    const violations = await withTree(
      {
        ...apps,
        "apps/demo/src/path.ts": appImportsPackagePathFixture,
        "apps/demo/src/declared.ts": 'import { fk } from "@gerak/rig";\nexport const k = fk;',
      },
      (tree) => scan(tree),
      WORKSPACES,
    );
    expect(violations).toEqual([
      "apps/demo/src/path.ts: app imports a package by path ../../../packages/moves/src/pose",
    ]);
  });

  it("holds an app's tests and configs beside src to the app boundary, and leaves out node_modules", async () => {
    const violations = await withTree(
      {
        ...apps,
        "apps/demo/test/path.test.ts": appImportsPackagePathFixture,
        "apps/demo/vite.config.ts": "import { pose } from '../../packages/moves/src/pose';",
        "apps/demo/node_modules/x/index.ts": appImportsPackagePathFixture,
      },
      (tree) => scan(tree),
      WORKSPACES,
    );
    expect([...violations].sort()).toEqual([
      "apps/demo/test/path.test.ts: app imports a package by path ../../../packages/moves/src/pose",
      "apps/demo/vite.config.ts: app imports a package by path ../../packages/moves/src/pose",
    ]);
  });

  it("refuses an app importing another app", async () => {
    const violations = await withTree(
      {
        ...apps,
        "apps/demo/src/path.ts": appImportsAppFixture,
        "apps/demo/src/own.ts": 'import { a } from "./path";\nexport const b = a;',
      },
      (tree) => scan(tree),
      WORKSPACES,
    );
    expect(violations).toContain(
      "apps/demo/src/path.ts: app imports another app ../../other/src/main",
    );
  });
});
