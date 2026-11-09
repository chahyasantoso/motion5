import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  applySourceEdit,
  canAttachLiveEndpoints,
  motionLivePlugin,
  resolveSceneFile,
  scanNumericLiterals,
  type MotionLiveRequest,
  type MotionLiveResponse,
} from "../src/vite";

const tempDirs: string[] = [];
function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-vite-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("scanNumericLiterals", () => {
  it("scans numbers inside a move call and attaches call and property names", () => {
    const source = `
      import { drop } from "@motion5/moves";
      const pose = drop({ distance: 700, squash: 0.18 }, time);
    `;
    const spans = scanNumericLiterals(source);
    expect(spans).toHaveLength(2);
    expect(spans[0]).toEqual({
      start: source.indexOf("700"),
      end: source.indexOf("700") + 3,
      text: "700",
      value: 700,
      call: "drop",
      property: "distance",
    });
    expect(spans[1]).toEqual({
      start: source.indexOf("0.18"),
      end: source.indexOf("0.18") + 4,
      text: "0.18",
      value: 0.18,
      call: "drop",
      property: "squash",
    });
  });

  it("handles negative numbers and numbers outside move calls", () => {
    const source = `
      const count = 42;
      const pose = drop({ distance: -1300 }, time);
    `;
    const spans = scanNumericLiterals(source);
    expect(spans).toHaveLength(2);
    expect(spans[0]).toEqual({
      start: source.indexOf("42"),
      end: source.indexOf("42") + 2,
      text: "42",
      value: 42,
    });
    expect(spans[1]).toEqual({
      start: source.indexOf("-1300"),
      end: source.indexOf("-1300") + 5,
      text: "-1300",
      value: -1300,
      call: "drop",
      property: "distance",
    });
  });
});

describe("resolveSceneFile", () => {
  it("resolves files staying inside apps and refuses files escaping apps", () => {
    const repo = makeTempDir();
    const appsDir = join(repo, "apps");
    const demoDir = join(appsDir, "react-demo");
    const srcDir = join(demoDir, "src");
    mkdirSync(srcDir, { recursive: true });

    const okResult = resolveSceneFile("src/timing-scene.ts", demoDir, repo);
    expect(okResult.kind).toBe("ok");
    if (okResult.kind === "ok") {
      expect(okResult.path).toBe(resolve(demoDir, "src/timing-scene.ts"));
    }

    const outsideResult = resolveSceneFile("../../packages/moves/src/drop.ts", demoDir, repo);
    expect(outsideResult.kind).toBe("refused");

    const rootOutsideResult = resolveSceneFile("/tmp/outside.ts", demoDir, repo);
    expect(rootOutsideResult.kind).toBe("refused");

    const nonTsResult = resolveSceneFile("src/timing-scene.json", demoDir, repo);
    expect(nonTsResult.kind).toBe("refused");
  });
});

describe("applySourceEdit", () => {
  it("applies edits when old text matches and refuses when stale", () => {
    const dir = makeTempDir();
    const file = join(dir, "scene.ts");
    const initial = "const x = 700;";
    writeFileSync(file, initial, "utf8");

    const staleResult = applySourceEdit(file, {
      start: 10,
      end: 13,
      oldText: "800",
      newText: "900",
    });
    expect(staleResult.kind).toBe("stale");
    expect(readFileSync(file, "utf8")).toBe(initial);

    const writtenResult = applySourceEdit(file, {
      start: 10,
      end: 13,
      oldText: "700",
      newText: "760",
    });
    expect(writtenResult.kind).toBe("written");
    expect(readFileSync(file, "utf8")).toBe("const x = 760;");
    expect(writtenResult.literals).toHaveLength(1);
    expect(writtenResult.literals[0]?.value).toBe(760);
  });
});

describe("canAttachLiveEndpoints and motionLivePlugin", () => {
  it("allows only non-production serve commands", () => {
    expect(canAttachLiveEndpoints({ command: "serve" })).toBe(true);
    expect(canAttachLiveEndpoints({ command: "serve", isProduction: false })).toBe(true);
    expect(canAttachLiveEndpoints({ command: "serve", isProduction: true })).toBe(false);
    expect(canAttachLiveEndpoints({ command: "build", isProduction: true })).toBe(false);
    expect(canAttachLiveEndpoints({ command: "build", isProduction: false })).toBe(false);
  });

  it("refuses a production server on configureServer", () => {
    const plugin = motionLivePlugin();
    expect(() => {
      plugin.configureServer({ config: { command: "build", isProduction: true } });
    }).toThrow("motionLivePlugin refuses a production server.");

    expect(() => {
      plugin.configureServer({ config: { command: "serve", isProduction: true } });
    }).toThrow("motionLivePlugin refuses a production server.");
  });

  it("transforms scene imports by attaching HMR code", () => {
    const plugin = motionLivePlugin();
    const code = `import { TimingScene } from "./timing-scene";`;
    const transformed = plugin.transform(code, resolve("apps/react-demo/src/TimingBeat.tsx"));
    expect(transformed).not.toBeNull();
    if (transformed !== null) {
      expect(transformed.code).toContain('export * as __motionScene from "./timing-scene";');
      expect(transformed.code).toContain("import.meta.hot");
    }
  });

  it("serves GET /__motion/source and POST /__motion/edit via dev server middleware", async () => {
    const repo = makeTempDir();
    const appsDir = join(repo, "apps");
    const demoDir = join(appsDir, "react-demo");
    const srcDir = join(demoDir, "src");
    mkdirSync(srcDir, { recursive: true });
    const sceneFile = join(srcDir, "timing-scene.ts");
    writeFileSync(sceneFile, "const x = 700;", "utf8");

    let handler:
      | ((req: MotionLiveRequest, res: MotionLiveResponse, next: () => void) => void)
      | undefined;

    const plugin = motionLivePlugin({ appRoot: demoDir, repoRoot: repo });
    plugin.configureServer({
      config: { command: "serve", isProduction: false, root: demoDir },
      middlewares: {
        use(fn) {
          handler = fn;
        },
      },
    });

    expect(handler).toBeDefined();
    if (handler === undefined) return;

    // Test GET /__motion/source
    const getHeaders: Record<string, string> = {};
    let getBody = "";
    const getRes: MotionLiveResponse = {
      statusCode: 0,
      setHeader(name: string, value: string) {
        getHeaders[name] = value;
      },
      end(chunk?: string) {
        if (typeof chunk === "string") getBody += chunk;
      },
    };
    const getReq: MotionLiveRequest = {
      method: "GET",
      url: "/__motion/source?file=src/timing-scene.ts",
      on() {},
    };
    handler(getReq, getRes, () => {});
    expect(getRes.statusCode).toBe(200);
    const parsedSource: unknown = JSON.parse(getBody);
    expect(
      typeof parsedSource === "object" &&
        parsedSource !== null &&
        Reflect.get(parsedSource, "source") === "const x = 700;",
    ).toBe(true);

    // Test POST /__motion/edit
    let dataListener: ((chunk: Buffer | string) => void) | undefined;
    let endListener: (() => void) | undefined;

    const postReq: MotionLiveRequest = {
      method: "POST",
      url: "/__motion/edit",
      on(event: "data" | "end", fn: (chunk: Buffer | string) => void) {
        if (event === "data") {
          dataListener = fn;
        }
        if (event === "end") {
          endListener = () => fn("");
        }
      },
    };
    const postHeaders: Record<string, string> = {};
    let postBody = "";
    const postRes: MotionLiveResponse = {
      statusCode: 0,
      setHeader(name: string, value: string) {
        postHeaders[name] = value;
      },
      end(chunk?: string) {
        if (typeof chunk === "string") postBody += chunk;
      },
    };

    handler(postReq, postRes, () => {});
    if (dataListener !== undefined && endListener !== undefined) {
      dataListener(
        JSON.stringify({
          file: "src/timing-scene.ts",
          start: 10,
          end: 13,
          oldText: "700",
          newText: "760",
        }),
      );
      endListener();
    }
    expect(postRes.statusCode).toBe(200);
    const parsedEdit: unknown = JSON.parse(postBody);
    expect(
      typeof parsedEdit === "object" &&
        parsedEdit !== null &&
        Reflect.get(parsedEdit, "kind") === "written",
    ).toBe(true);
    expect(readFileSync(sceneFile, "utf8")).toBe("const x = 760;");
  });
});
