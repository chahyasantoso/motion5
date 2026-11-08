import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { format, resolveConfig } from "prettier";
import { afterEach, describe, expect, it } from "vitest";
import { validateV5 } from "@motion5/core";
import { loadBuiltinCatalog } from "../src/engine/catalog";
import { scaffold } from "../src/engine/new";
import { sampleProject } from "../src/engine/sample";

const roots: string[] = [];
function root(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-new-"));
  roots.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const FILES = [
  "rope-word.html",
  "src/rope-word-main.tsx",
  "src/rope-word.tsx",
  "src/rope-word.json",
];

describe("motion:new", () => {
  it("writes a page, entry, component and project that validates and samples", async () => {
    const dir = root();
    const result = scaffold("rope-word", dir);
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual(FILES.map((file) => join(dir, file)));
    const project = JSON.parse(readFileSync(join(dir, "src/rope-word.json"), "utf8"));
    const catalog = await loadBuiltinCatalog();
    expect(validateV5(project, catalog).kind).toBe("accepted");
    expect(sampleProject(project, catalog, { kind: "time", ms: [0, 1000] }).kind).toBe("accepted");
  });

  it("names the component after the page and points each file at the next", () => {
    const dir = root();
    scaffold("rope-word", dir);
    expect(readFileSync(join(dir, "rope-word.html"), "utf8")).toContain("/src/rope-word-main.tsx");
    expect(readFileSync(join(dir, "src/rope-word-main.tsx"), "utf8")).toContain(
      'import { RopeWord } from "./rope-word";',
    );
    expect(readFileSync(join(dir, "src/rope-word.tsx"), "utf8")).toContain(
      'import project from "./rope-word.json";',
    );
  });

  it("writes files that are already formatted", async () => {
    const dir = root();
    scaffold("rope-word", dir);
    for (const file of FILES) {
      const source = readFileSync(join(dir, file), "utf8");
      const config = await resolveConfig(join(process.cwd(), "apps/react-demo", file));
      expect(await format(source, { ...config, filepath: file }), file).toBe(source);
    }
  });

  it("refuses a name whose files exist, and writes nothing", () => {
    const dir = root();
    writeFileSync(join(dir, "rope-word.html"), "keep");
    expect(scaffold("rope-word", dir)).toMatchObject({ kind: "refused" });
    expect(readFileSync(join(dir, "rope-word.html"), "utf8")).toBe("keep");
    expect(existsSync(join(dir, "src/rope-word.tsx"))).toBe(false);
  });

  it.each(["", "Rope", "rope_word", "-rope", "../rope", "rope/word"])(
    "refuses the name %j",
    (name) => {
      expect(scaffold(name, root()).kind).toBe("refused");
    },
  );
});
