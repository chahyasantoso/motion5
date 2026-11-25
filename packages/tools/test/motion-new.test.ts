import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { format, resolveConfig } from "prettier";
import { afterEach, describe, expect, it } from "vitest";
import { pathToFileURL } from "node:url";
import {
  NEW_USAGE,
  parseNewArgs,
  readSceneModule,
  sampleScene,
  scaffold,
} from "@gerak/tools/scene";
import { reviewSceneModule } from "../src/scene/review";
import { parseLiveArgs, startLiveServer } from "../src/page/live";
import { parseRenderArgs, renderPage } from "../src/page/render";
import { callerPiecesRoot } from "../src/page/root";
import { guard } from "../src/pages/live/guard";

const PIECES_ROOT = callerPiecesRoot();

const roots: string[] = [];
function root(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-new-"));
  roots.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of roots.splice(0)) rmSync(dir, { recursive: true, force: true });
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

  it("writes a scene that imports no move", () => {
    const dir = root();
    scaffold("rope-word", dir);
    scaffold("rope-box", dir, { three: true });
    for (const file of ["rope-word/src/rope-word.ts", "rope-box/src/rope-box-scene.ts"])
      expect(readFileSync(join(dir, file), "utf8")).not.toMatch(/drop|lift2d/);
  });

  it("with --three mounts with @gerak/dom and @gerak/three and points each file at the next", () => {
    const dir = root();
    scaffold("rope-word", dir, { three: true });
    const html = readFileSync(join(dir, "rope-word/rope-word.html"), "utf8");
    expect(html).toContain("/rope-word/src/rope-word-main.ts");
    expect(html).toContain('data-cast="label"');
    const main = readFileSync(join(dir, "rope-word/src/rope-word-main.ts"), "utf8");
    expect(main).toContain('import { mount } from "@gerak/dom";');
    expect(main).toContain('import { createStage3d } from "@gerak/three";');
    expect(main).toContain('import piece, { lens, size } from "./rope-word-scene";');
    expect(main).not.toMatch(/react/i);
    const sceneSource = readFileSync(join(dir, "rope-word/src/rope-word-scene.ts"), "utf8");
    expect(sceneSource).not.toContain("clockDriver");
    expect(sceneSource).not.toContain("export const clock");
  });

  it("writes files that are already formatted", async () => {
    const dir = root();
    scaffold("rope-word", dir);
    for (const file of STAGE_FILES) {
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

  it("no longer takes --move, and its usage line names no move command", () => {
    for (const argv of [
      ["--move", "rope-in"],
      ["--move", "rope-in", "--in", "rope"],
    ]) {
      expect(parseNewArgs(argv)).toEqual({ kind: "usage", message: NEW_USAGE });
    }
    expect(NEW_USAGE).not.toContain("new-move");
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

  it("writes Three.js files that are already formatted", async () => {
    const dir = appRoot();
    scaffold("rope-word", dir, { three: true });
    for (const file of FILES) {
      const source = readFileSync(join(dir, file), "utf8");
      const config = await resolveConfig(join(process.cwd(), "apps/pieces", file));
      expect(await format(source, { ...config, filepath: file }), file).toBe(source);
    }
  });

  it("parses live args and validates scene existence", () => {
    expect(parseLiveArgs(["saved"])).toEqual({
      kind: "ok",
      scene: "saved",
      root: PIECES_ROOT,
      port: 5173,
    });

    const dir = root();
    mkdirSync(join(dir, "custom/src"), { recursive: true });
    writeFileSync(join(dir, "custom/src/custom-scene.ts"), "export const scene = () => ({});");
    expect(parseLiveArgs(["custom", "--root", dir, "--port", "4321"])).toEqual({
      kind: "ok",
      scene: "custom",
      root: dir,
      port: 4321,
    });

    expect(parseLiveArgs(["timing", "--bogus"]).kind).toBe("usage");
    expect(parseLiveArgs(["Timing"]).kind).toBe("usage");
    expect(parseLiveArgs(["missing-scene"]).kind).toBe("usage");

    for (const brief of ["one", "two"]) {
      mkdirSync(join(dir, `${brief}/src`), { recursive: true });
      writeFileSync(join(dir, `${brief}/src/twice.ts`), "export const scene = () => ({});");
    }
    const twice = parseLiveArgs(["twice", "--root", dir]);
    expect(twice.kind).toBe("usage");
    expect(twice.kind === "usage" ? twice.message : "").toContain("one and two");
  });

  it("starts a live server and reuses an already running server", async () => {
    const first = await startLiveServer({ scene: "timing", root: PIECES_ROOT, port: 0 });
    try {
      expect(first.reused).toBe(false);
      expect(first.url).toContain("live.html?scene=timing");
      const port = Number(new URL(first.url).port);
      expect(port).toBeGreaterThan(0);

      const second = await startLiveServer({ scene: "timing", root: PIECES_ROOT, port });
      expect(second.reused).toBe(true);
      expect(second.url).toBe(first.url);
    } finally {
      await first.close();
    }
  });

  it("samples the first frame of every worked example under guard", async () => {
    const examples = ["timing", "card", "pile", "character3d", "overlay3d"] as const;
    for (const name of examples) {
      const scenePath = join(process.cwd(), "apps/pieces", name, "src", `${name}-scene.ts`);
      const imported = await import(pathToFileURL(scenePath).href);
      const module = readSceneModule(imported);
      if ("reason" in module) throw new Error(`${name}: ${module.reason}`);
      const errors: string[] = [];
      const guarded = guard(module.scene, (err) => errors.push(err));
      const [first] = sampleScene({ ...module, scene: guarded }, { kind: "time", ms: [0] });
      expect(first).toBeDefined();
      expect(errors).toEqual([]);
    }
  });

  it("resolves newly scaffolded DOM and Three.js scenes via parseLiveArgs", () => {
    const domDir = root();
    const domResult = scaffold("scaffold-dom", domDir);
    if (domResult.kind !== "written") throw new Error(JSON.stringify(domResult));
    expect(parseLiveArgs(["scaffold-dom", "--root", domDir])).toEqual({
      kind: "ok",
      scene: "scaffold-dom",
      root: domDir,
      port: 5173,
    });

    const threeDir = appRoot();
    const threeResult = scaffold("scaffold-three", threeDir, { three: true });
    if (threeResult.kind !== "written") throw new Error(JSON.stringify(threeResult));
    expect(parseLiveArgs(["scaffold-three", "--root", threeDir])).toEqual({
      kind: "ok",
      scene: "scaffold-three",
      root: threeDir,
      port: 5173,
    });
  });

  it("renders a newly scaffolded --three page without --to or --size, using its scene length and frame", async () => {
    const dir = appRoot();
    writeFileSync(join(dir, "vite.config.ts"), 'export { default } from "../../vite.config";\n');
    const result = scaffold("render-three", dir, { three: true });
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    const out = join(dir, "out.mp4");
    const parsed = parseRenderArgs([
      "render-three/render-three.html",
      "--root",
      dir,
      "--fps",
      "25",
      "--out",
      out,
    ]);
    if (parsed.kind !== "ok") throw new Error(parsed.message);
    const rendered = await renderPage(parsed);
    expect(rendered.kind).toBe("rendered");
    if (rendered.kind !== "rendered") return;
    expect(rendered.to).toBe(800);
    expect(rendered.width).toBe(1280);
    expect(rendered.height).toBe(720);
    expect(rendered.pageErrors).toEqual([]);
  }, 60000);
});
