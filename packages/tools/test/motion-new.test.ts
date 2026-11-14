import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ts from "typescript";
import { format, resolveConfig } from "prettier";
import { afterEach, describe, expect, it } from "vitest";
import { pathToFileURL } from "node:url";
import {
  NEW_USAGE,
  parseCatalogArgs,
  parseNewArgs,
  readSceneModule,
  runCatalog,
  sampleScene,
  scaffold,
  scaffoldMove,
} from "@gerak/tools/scene";
import { DEFAULT_ROOT, parseLiveArgs, startLiveServer } from "../src/page/live";
import { guard } from "../../../apps/pieces/src/live/guard";

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

const STAGE_FILES = ["rope-word/src/rope-word.ts"];
const FILES = [
  "rope-word/rope-word.html",
  "rope-word/src/rope-word-main.tsx",
  "rope-word/src/rope-word.tsx",
  "rope-word/src/rope-word-scene.ts",
];

describe("motion:new", () => {
  it("writes one stage module of one beat and one actor, and it samples to rest", async () => {
    const dir = root();
    const result = scaffold("rope-word", dir);
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual(STAGE_FILES.map((file) => join(dir, file)));
    const imported = await import(pathToFileURL(join(dir, "rope-word/src/rope-word.ts")).href);
    const module = readSceneModule(imported);
    if ("reason" in module) throw new Error(module.reason);
    expect(module.beats?.map(({ name }) => name)).toEqual(["show"]);
    expect(module.cast?.map(({ name, kind }) => [name, kind])).toEqual([["title", "actor"]]);
    expect(imported.skins).toEqual({ dom: { css: "" } });
    const samples = sampleScene(module, { kind: "time", ms: [0, 200, 800] });
    expect(samples.map((sample) => sample.targets)).toEqual(Array(3).fill({ title: {} }));
  });

  it("writes a scene that imports no move", () => {
    const dir = root();
    scaffold("rope-word", dir);
    scaffold("rope-box", dir, { three: true });
    for (const file of ["rope-word/src/rope-word.ts", "rope-box/src/rope-box-scene.ts"])
      expect(readFileSync(join(dir, file), "utf8")).not.toMatch(/drop|lift2d/);
  });

  it("writes a move the catalog finds and the gate refuses until it is filled in", async () => {
    const dir = appRoot();
    const result = scaffoldMove("rope-in", dir, "rope");
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual([join(dir, "rope/src/moves/rope-in.ts")]);
    const catalog = (argv: readonly string[]) => {
      const args = parseCatalogArgs(argv);
      if (args.kind !== "ok") throw new Error(args.message);
      return runCatalog(args, dir);
    };
    const listed = await catalog([]);
    expect(listed.lines.map((line) => line.split(" ")[0])).toContain("rope-in");
    const checked = await catalog(["--check"]);
    expect(checked.code).toBe(1);
    expect(checked.lines).toContain("rope-in: the move has no description.");
    expect(checked.lines.some((line) => line.includes('"x" is 1 at progress 1'))).toBe(true);
    const source = readFileSync(join(dir, "rope/src/moves/rope-in.ts"), "utf8");
    const config = await resolveConfig(
      join(process.cwd(), "apps/pieces/rope/src/moves/rope-in.ts"),
    );
    expect(await format(source, { ...config, filepath: "rope-in.ts" })).toBe(source);
  });

  it("refuses a move id that is not kebab-case or whose file exists", () => {
    const dir = root();
    for (const id of ["", "Rope", "rope_in", "../rope"])
      expect(scaffoldMove(id, dir, "rope").kind).toBe("refused");
    expect(scaffoldMove("rope-in", dir, "rope").kind).toBe("written");
    expect(scaffoldMove("new", dir, "rope").kind).toBe("written");
    expect(readFileSync(join(dir, "rope/src/moves/new.ts"), "utf8")).toContain(
      "export const newMove =",
    );
    writeFileSync(join(dir, "rope/src/moves/keep.ts"), "keep");
    expect(scaffoldMove("rope-in", dir, "rope").kind).toBe("refused");
    expect(scaffoldMove("keep", dir, "rope").kind).toBe("refused");
    expect(readFileSync(join(dir, "rope/src/moves/keep.ts"), "utf8")).toBe("keep");
  });

  it("with --three names the component after the page and points each file at the next", () => {
    const dir = root();
    scaffold("rope-word", dir, { three: true });
    expect(readFileSync(join(dir, "rope-word/rope-word.html"), "utf8")).toContain(
      "/src/rope-word-main.tsx",
    );
    expect(readFileSync(join(dir, "rope-word/src/rope-word-main.tsx"), "utf8")).toContain(
      'import { RopeWord } from "./rope-word";',
    );
    expect(readFileSync(join(dir, "rope-word/src/rope-word.tsx"), "utf8")).toContain(
      'import { clock, lens, scene, stage } from "./rope-word-scene";',
    );
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

  it("refuses --move without --in and prints the usage line", () => {
    for (const argv of [["--move", "rope-in"], ["--move"], ["--move", "rope-in", "--three"]]) {
      expect(parseNewArgs(argv)).toEqual({ kind: "usage", message: NEW_USAGE });
    }
    expect(parseNewArgs(["--move", "rope-in", "--in", "rope"])).toEqual({
      kind: "move",
      id: "rope-in",
      brief: "rope",
      root: undefined,
    });
    expect(NEW_USAGE).toContain("motion:new --move <id> --in <brief>");
  });

  it("with --in writes the piece and its move into that brief's folder", () => {
    const dir = root();
    const piece = scaffold("rope-word", dir, { brief: "ropes" });
    if (piece.kind !== "written") throw new Error(piece.message);
    expect(piece.files).toEqual([join(dir, "ropes/src/rope-word.ts")]);
    const three = scaffold("rope-box", dir, { three: true, brief: "ropes" });
    if (three.kind !== "written") throw new Error(three.message);
    expect(three.files).toEqual([
      join(dir, "ropes/rope-box.html"),
      join(dir, "ropes/src/rope-box-main.tsx"),
      join(dir, "ropes/src/rope-box.tsx"),
      join(dir, "ropes/src/rope-box-scene.ts"),
    ]);
    expect(readFileSync(join(dir, "ropes/rope-box.html"), "utf8")).toContain(
      "/ropes/src/rope-box-main.tsx",
    );
    const move = scaffoldMove("rope-in", dir, "ropes");
    if (move.kind !== "written") throw new Error(move.message);
    expect(move.files).toEqual([join(dir, "ropes/src/moves/rope-in.ts")]);
    expect(scaffold("rope-x", dir, { brief: "src" }).kind).toBe("refused");
    expect(scaffoldMove("rope-y", dir, "Ropes").kind).toBe("refused");
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

  it("with --three writes a Three.js page whose scene samples and whose files typecheck", async () => {
    const dir = appRoot();
    const result = scaffold("rope-word", dir, { three: true });
    if (result.kind !== "written") throw new Error(JSON.stringify(result));
    expect(result.files).toEqual(FILES.map((file) => join(dir, file)));
    const component = readFileSync(join(dir, "rope-word/src/rope-word.tsx"), "utf8");
    expect(component).toContain('from "@gerak/three/react"');
    expect(component).toContain("preserveDrawingBuffer: true");
    const loaded: unknown = await import(
      pathToFileURL(join(dir, "rope-word/src/rope-word-scene.ts")).href
    );
    const module = readSceneModule(loaded);
    if ("reason" in module) throw new Error(module.reason);
    const samples = sampleScene(module, { kind: "time", ms: [0, 200, 800] });
    expect(Reflect.get(Object(loaded), "stage")).toEqual({ width: 1280, height: 720 });
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
      root: DEFAULT_ROOT,
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
  });

  it("starts a live server and reuses an already running server", async () => {
    const first = await startLiveServer({ scene: "timing", root: DEFAULT_ROOT, port: 0 });
    try {
      expect(first.reused).toBe(false);
      expect(first.url).toContain("live.html?scene=timing");
      const port = Number(new URL(first.url).port);
      expect(port).toBeGreaterThan(0);

      const second = await startLiveServer({ scene: "timing", root: DEFAULT_ROOT, port });
      expect(second.reused).toBe(true);
      expect(second.url).toBe(first.url);
    } finally {
      await first.close();
    }
  });

  it("samples the first frame of every worked example under guard", async () => {
    const examples = [
      "timing",
      "catch",
      "splash",
      "card",
      "pile",
      "principles",
      "principles3d",
      "character3d",
      "overlay3d",
    ] as const;
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
});
