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
      import { drop } from "@gerak/moves";
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

  it("reads a separated number and a spaced minus as the compiler does", () => {
    const spans = scanNumericLiterals("const a = 12_000;\nconst b = - 5;");
    expect(spans.map((span) => [span.text, span.value])).toEqual([
      ["12_000", 12000],
      ["- 5", -5],
    ]);
    expect(JSON.parse(JSON.stringify(spans))).toEqual(spans);
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

  it("refuses a file inside the app that is not a scene file", () => {
    const repo = makeTempDir();
    const demoDir = join(repo, "apps", "react-demo");
    mkdirSync(join(demoDir, "src"), { recursive: true });

    expect(resolveSceneFile("vite.config.ts", demoDir, repo).kind).toBe("refused");
    expect(resolveSceneFile("src/TimingBeat.tsx", demoDir, repo).kind).toBe("refused");
    expect(resolveSceneFile("src/timing-main.tsx", demoDir, repo).kind).toBe("refused");
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
    if (writtenResult.kind !== "written") return;
    expect(writtenResult.literals).toHaveLength(1);
    expect(writtenResult.literals[0]?.value).toBe(760);
  });

  it("writes only a plain number, and only over a numeric literal", () => {
    const dir = makeTempDir();
    const file = join(dir, "scene.ts");
    const initial = "const x = 700;";
    writeFileSync(file, initial, "utf8");

    const code = applySourceEdit(file, {
      start: 10,
      end: 13,
      oldText: "700",
      newText: "700; steal()",
    });
    expect(code.kind).toBe("refused");

    const inserted = applySourceEdit(file, { start: 0, end: 0, oldText: "", newText: "1" });
    expect(inserted.kind).toBe("stale");

    const name = applySourceEdit(file, { start: 6, end: 7, oldText: "x", newText: "1" });
    expect(name.kind).toBe("stale");

    expect(readFileSync(file, "utf8")).toBe(initial);
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
    const transformed = plugin.transform(code, resolve("apps/pieces/src/TimingBeat.tsx"));
    expect(transformed).not.toBeNull();
    if (transformed !== null) {
      expect(transformed.code).toContain('export * as __motionScene from "./timing-scene";');
      expect(transformed.code).toContain("import.meta.hot");
    }
  });

  it("hands a stage module's update to the page, and leaves other modules alone", () => {
    const plugin = motionLivePlugin();
    const stage = `export const beats = story(1000, {});\nexport const cast = {};`;
    const id = resolve("apps/pieces/src/saved.ts");
    expect(plugin.transform(stage, id)?.code).toContain("import.meta.hot.accept");
    expect(plugin.transform(`export const beats = 1;`, id)).toBeNull();
    expect(plugin.transform(stage, resolve("apps/pieces/lib/saved.ts"))).toBeNull();
  });

  it("runs only on a dev server, and hands an update no page took back to Vite", () => {
    const plugin = motionLivePlugin();
    expect(plugin.apply).toBe("serve");
    const transformed = plugin.transform(
      `import { scene } from "./timing-scene";`,
      resolve("apps/pieces/src/TimingBeat.tsx"),
    );
    expect(transformed?.code).toContain("cancelable: true");
    expect(transformed?.code).toContain(
      "if (window.dispatchEvent(hot)) import.meta.hot.invalidate();",
    );
  });

  it("refuses a read or an edit from another site's page", () => {
    const repo = makeTempDir();
    const demoDir = join(repo, "apps", "react-demo");
    mkdirSync(join(demoDir, "src"), { recursive: true });
    const sceneFile = join(demoDir, "src", "timing-scene.ts");
    writeFileSync(sceneFile, "const x = 700;", "utf8");

    let handler:
      | ((req: MotionLiveRequest, res: MotionLiveResponse, next: () => void) => void)
      | undefined;
    motionLivePlugin({ appRoot: demoDir, repoRoot: repo }).configureServer({
      config: { command: "serve", isProduction: false, root: demoDir },
      middlewares: {
        use(fn) {
          handler = fn;
        },
      },
    });
    if (handler === undefined) throw new Error("no middleware");

    const statusFor = (req: MotionLiveRequest): number => {
      const res: MotionLiveResponse = { statusCode: 0, setHeader() {}, end() {} };
      let listened = false;
      handler?.(
        {
          ...req,
          on() {
            listened = true;
          },
        },
        res,
        () => {},
      );
      expect(listened).toBe(false);
      return res.statusCode;
    };
    const source = "/__motion/source?file=src/timing-scene.ts";

    expect(
      statusFor({
        method: "GET",
        url: source,
        headers: { "sec-fetch-site": "cross-site" },
        on() {},
      }),
    ).toBe(403);
    expect(
      statusFor({
        method: "POST",
        url: "/__motion/edit",
        headers: { "sec-fetch-site": "cross-site" },
        on() {},
      }),
    ).toBe(403);
    expect(
      statusFor({
        method: "POST",
        url: "/__motion/edit",
        headers: { origin: "http://elsewhere.example", host: "localhost:5173" },
        on() {},
      }),
    ).toBe(403);
    expect(
      statusFor({
        method: "GET",
        url: source,
        headers: { "sec-fetch-site": "same-origin" },
        on() {},
      }),
    ).toBe(200);
    expect(readFileSync(sceneFile, "utf8")).toBe("const x = 700;");
  });

  it("lists the app's move files, sorted, and refuses another site", () => {
    const demoDir = makeTempDir();
    const empty = makeTempDir();
    const movesDir = join(demoDir, "src", "moves");
    mkdirSync(movesDir, { recursive: true });
    for (const name of ["b.ts", "a.ts", "a.d.ts", "notes.md"]) {
      writeFileSync(join(movesDir, name), "", "utf8");
    }
    const answer = (
      root: string,
      headers?: Record<string, string>,
    ): { readonly status: number; readonly body: string } => {
      let handler:
        | ((req: MotionLiveRequest, res: MotionLiveResponse, next: () => void) => void)
        | undefined;
      motionLivePlugin({ appRoot: root }).configureServer({
        config: { command: "serve", isProduction: false, root },
        middlewares: {
          use(fn) {
            handler = fn;
          },
        },
      });
      let body = "";
      const res: MotionLiveResponse = {
        statusCode: 0,
        setHeader() {},
        end(chunk?: string) {
          if (typeof chunk === "string") body += chunk;
        },
      };
      handler?.({ method: "GET", url: "/__motion/moves", headers, on() {} }, res, () => {});
      return { status: res.statusCode, body };
    };

    const listed = answer(demoDir);
    expect(listed.status).toBe(200);
    expect(JSON.parse(listed.body)).toEqual({ files: ["/src/moves/a.ts", "/src/moves/b.ts"] });
    expect(JSON.parse(answer(empty).body)).toEqual({ files: [] });
    expect(answer(demoDir, { "sec-fetch-site": "cross-site" }).status).toBe(403);
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
