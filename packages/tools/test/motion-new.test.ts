import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { format, resolveConfig } from "prettier";
import { afterEach, describe, expect, it } from "vitest";
import { pathToFileURL } from "node:url";
import { readSceneModule, sampleScene, scaffold } from "@gerak/tools/scene";
import { reviewSceneModule } from "../src/scene/review";
import { withPage } from "../src/page/page";
import { removeTemp } from "../../../test/support/temp";

const roots: string[] = [];
function root(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-new-"));
  roots.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of roots.splice(0)) removeTemp(dir);
});

function appRoot(): string {
  const parent = join(process.cwd(), "apps/pieces/.scaffold");
  mkdirSync(parent, { recursive: true });
  const dir = mkdtempSync(join(parent, "three-"));
  roots.push(dir, parent);
  return dir;
}

const STAGE_FILES = [
  "rope-word/rope-word.html",
  "rope-word/src/rope-word.ts",
  "rope-word/src/rope-word-main.ts",
];
const FILES = [
  "rope-word/rope-word.html",
  "rope-word/src/rope-word-main.ts",
  "rope-word/src/rope-word-scene.ts",
];

describe("gerak new", () => {
  it("writes a page, a scene builder of one beat and one static actor, and the main that mounts it, with no review finding", async () => {
    const dir = root();
    const result = scaffold("rope-word", dir);
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual(STAGE_FILES.map((file) => join(dir, file)));
    const written = readFileSync(join(dir, "rope-word/src/rope-word.ts"), "utf8");
    expect(written).toContain("scene(");
    expect(written).not.toContain("defineStage");
    const imported = await import(pathToFileURL(join(dir, "rope-word/src/rope-word.ts")).href);
    const module = readSceneModule(imported);
    if ("reason" in module) throw new Error(module.reason);
    expect(module.beats?.map(({ name }) => name)).toEqual(["show"]);
    expect(module.stage?.members.map(({ name, kind }) => [name, kind])).toEqual([
      ["title", "actor"],
    ]);
    expect(written).not.toContain("skin");
    const page = readFileSync(join(dir, "rope-word/rope-word.html"), "utf8");
    expect(page).toContain('<div id="frame">');
    expect(page).toContain('data-cast="title"');
    expect(page).toContain('src="/rope-word/src/rope-word-main.ts"');
    const main = readFileSync(join(dir, "rope-word/src/rope-word-main.ts"), "utf8");
    expect(main).toContain('import scene from "./rope-word";');
    expect(main).toContain('{ clock: "timed", frame: "fit", root }');
    expect(module.stage?.members.map(({ expect: kind }) => kind)).toEqual(["static"]);
    const samples = sampleScene(module, { kind: "time", ms: [0, 200, 800] });
    expect(samples.map((sample) => sample.targets)).toEqual(Array(3).fill({}));
    expect(
      reviewSceneModule(module, { hold: 500, jump: 150, turn: 150, ratio: 1.5 }).findings,
    ).toEqual([]);
  });

  it("writes files that are already formatted", async () => {
    const dir = root();
    scaffold("rope-word", dir);
    scaffold("rope-box", dir, { three: true });
    const files = [
      ...STAGE_FILES,
      ...FILES.map((file) => file.replaceAll("rope-word", "rope-box")),
    ];
    for (const file of files) {
      const source = readFileSync(join(dir, file), "utf8");
      const config = await resolveConfig(join(process.cwd(), "apps/pieces", file));
      expect(await format(source, { ...config, filepath: file }), file).toBe(source);
    }
  });

  it("refuses a name whose files exist, and writes nothing", () => {
    const dir = root();
    mkdirSync(join(dir, "rope-word/src"), { recursive: true });
    writeFileSync(join(dir, "rope-word/src/rope-word.ts"), "keep");
    expect(scaffold("rope-word", dir)).toMatchObject({ kind: "refused" });
    expect(readFileSync(join(dir, "rope-word/src/rope-word.ts"), "utf8")).toBe("keep");
    expect(existsSync(join(dir, "rope-word/rope-word.html"))).toBe(false);
  });

  it("with --in writes the piece into that brief's folder", () => {
    const dir = root();
    const piece = scaffold("rope-word", dir, { brief: "ropes" });
    if (piece.kind !== "written") throw new Error(piece.message);
    expect(piece.files).toEqual(
      ["ropes/rope-word.html", "ropes/src/rope-word.ts", "ropes/src/rope-word-main.ts"].map(
        (file) => join(dir, file),
      ),
    );
    const three = scaffold("rope-box", dir, { three: true, brief: "ropes" });
    if (three.kind !== "written") throw new Error(three.message);
    expect(three.files).toEqual([
      join(dir, "ropes/rope-box.html"),
      join(dir, "ropes/src/rope-box-main.ts"),
      join(dir, "ropes/src/rope-box-scene.ts"),
    ]);
    expect(readFileSync(join(dir, "ropes/rope-box.html"), "utf8")).toContain(
      "/ropes/src/rope-box-main.ts",
    );
    expect(scaffold("rope-x", dir, { brief: "src" }).kind).toBe("refused");
  });

  it("refuses a name that already exists in any brief, and writes nothing", () => {
    const dir = root();
    scaffold("rope-word", dir, { brief: "ropes" });
    const again = scaffold("rope-word", dir, { brief: "other" });
    expect(again).toMatchObject({ kind: "refused" });
    expect(again.kind === "refused" ? again.message : "").toContain(
      join(dir, "ropes/src/rope-word.ts"),
    );
    expect(existsSync(join(dir, "other"))).toBe(false);
    scaffold("rope-box", dir, { three: true, brief: "ropes" });
    expect(scaffold("rope-box", dir, { brief: "other" }).kind).toBe("refused");
  });

  it.each(["", "Rope", "rope_word", "-rope", "../rope", "rope/word"])(
    "refuses the name %j",
    (name) => {
      expect(scaffold(name, root()).kind).toBe("refused");
    },
  );

  it("with --three writes a builder piece with an object, whose page binds it and whose files typecheck", async () => {
    const dir = appRoot();
    const result = scaffold("rope-word", dir, { three: true });
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual(FILES.map((file) => join(dir, file)));
    const main = readFileSync(join(dir, "rope-word/src/rope-word-main.ts"), "utf8");
    expect(main).toContain("createStage3d(canvas, lens, { fallbackSize: size })");
    expect(main).toContain('clock: "timed"');
    expect(main).toContain('frame: "fit"');
    expect(main).toContain("binders: [stage3d.binder]");
    const loaded: unknown = await import(
      pathToFileURL(join(dir, "rope-word/src/rope-word-scene.ts")).href
    );
    const module = readSceneModule(loaded);
    if ("reason" in module) throw new Error(module.reason);
    const samples = sampleScene(module, { kind: "time", ms: [0, 200, 800] });
    expect(Reflect.get(Object(loaded), "size")).toEqual({ width: 1280, height: 720 });
    expect(Reflect.get(Object(Reflect.get(Object(loaded), "lens")), "fov")).toBe(50);
    expect(samples.map((sample) => sample.targets)).toEqual(
      Array(3).fill({ box: {}, label: { x: 640, y: 360, opacity: 1 } }),
    );
    const config = ts.readConfigFile(join(process.cwd(), "tsconfig.json"), ts.sys.readFile);
    const options = ts.parseJsonConfigFileContent(config.config, ts.sys, process.cwd()).options;
    const program = ts.createProgram(
      result.files.filter((file) => file.endsWith(".ts") || file.endsWith(".tsx")),
      options,
    );
    const messages = ts
      .getPreEmitDiagnostics(program)
      .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, " "));
    expect(messages).toEqual([]);
  }, 60000);

  it("samples the first frame of every worked example", async () => {
    const examples = ["timing", "card", "pile", "character3d", "overlay3d"] as const;
    for (const name of examples) {
      const scenePath = join(process.cwd(), "apps/pieces", name, "src", `${name}-scene.ts`);
      const imported = await import(pathToFileURL(scenePath).href);
      const module = readSceneModule(imported);
      if ("reason" in module) throw new Error(`${name}: ${module.reason}`);
      const [first] = sampleScene(module, { kind: "time", ms: [0] });
      expect(first).toBeDefined();
    }
  });

  it("registers a timed mount on a newly scaffolded --three page with its scene length and frame", async () => {
    const dir = appRoot();
    writeFileSync(join(dir, "vite.config.ts"), 'export { default } from "../../vite.config";\n');
    const result = scaffold("render-three", dir, { three: true });
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    const { value, pageErrors } = await withPage(
      {
        source: { kind: "serve", root: dir },
        page: "render-three/render-three.html",
        width: 1280,
        height: 720,
      },
      async ({ page, advanceTo }) => {
        await advanceTo(0);
        return page.evaluate(() => {
          const listed: unknown = Reflect.get(globalThis, Symbol.for("@gerak/dom/mounts"));
          return Array.isArray(listed)
            ? listed.map((mounted: unknown) => {
                const durationMs: unknown = Reflect.get(Object(mounted), "durationMs");
                const measure: unknown = Reflect.get(Object(mounted), "measure");
                const measured: unknown =
                  typeof measure === "function" ? Reflect.apply(measure, mounted, []) : undefined;
                const frame: unknown = measured
                  ? Reflect.get(Object(measured), "frame")
                  : undefined;
                return { durationMs, frame };
              })
            : [];
        });
      },
    );
    expect(value).toEqual([{ durationMs: 800, frame: { width: 1280, height: 720 } }]);
    expect(pageErrors).toEqual([]);
  }, 60000);
});
