import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  canAttachLiveEndpoints,
  motionLivePlugin,
  type MotionLiveRequest,
  type MotionLiveResponse,
} from "../src/vite";
import { removeTemp } from "../../../test/support/temp";

const tempDirs: string[] = [];
function makeTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), "motion-vite-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    removeTemp(dir);
  }
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

  it("has no virtual module or load hook for moves", () => {
    const plugin = motionLivePlugin({ appRoot: "/project" });
    expect("resolveId" in plugin).toBe(false);
    expect("load" in plugin).toBe(false);
  });

  it("transforms scene imports by attaching HMR code", () => {
    const plugin = motionLivePlugin();
    const code = `import { TimingScene } from "./timing-scene";`;
    const transformed = plugin.transform(code, resolve("apps/pieces/timing/src/TimingBeat.tsx"));
    expect(transformed).not.toBeNull();
    if (transformed !== null) {
      expect(transformed.code).toContain('export * as __motionScene from "./timing-scene";');
      expect(transformed.code).toContain("import.meta.hot");
    }
  });

  it("hands a stage module's update to the page, and leaves other modules alone", () => {
    const plugin = motionLivePlugin();
    const stage = `export default scene({ length: 1000 }, box("a"));`;
    const id = resolve("apps/pieces/saved/src/saved.ts");
    expect(plugin.transform(stage, id)?.code).toContain("import.meta.hot.accept");
    expect(plugin.transform(`export const beats = 1;`, id)).toBeNull();
    expect(plugin.transform(stage, resolve("apps/pieces/saved/lib/saved.ts"))).toBeNull();
  });

  it("runs only on a dev server, and hands an update no page took back to Vite", () => {
    const plugin = motionLivePlugin();
    expect(plugin.apply).toBe("serve");
    const transformed = plugin.transform(
      `import { scene } from "./timing-scene";`,
      resolve("apps/pieces/timing/src/TimingBeat.tsx"),
    );
    expect(transformed?.code).toContain("cancelable: true");
    expect(transformed?.code).toContain(
      "if (window.dispatchEvent(hot)) import.meta.hot.invalidate();",
    );
  });

  it("serves no moves route and refuses another site under /__motion/", () => {
    const answer = (url: string, headers?: Record<string, string>) => {
      let handler:
        | ((req: MotionLiveRequest, res: MotionLiveResponse, next: () => void) => void)
        | undefined;
      motionLivePlugin({ appRoot: "/project" }).configureServer({
        config: { command: "serve", isProduction: false, root: "/project" },
        middlewares: {
          use(fn) {
            handler = fn;
          },
        },
      });
      const res: MotionLiveResponse = { statusCode: 0, setHeader() {}, end() {} };
      let passed = false;
      handler?.({ method: "GET", url, headers, on() {} }, res, () => {
        passed = true;
      });
      return { status: res.statusCode, passed };
    };

    expect(answer("/__motion/moves")).toEqual({ status: 0, passed: true });
    expect(answer("/__motion/moves", { "sec-fetch-site": "cross-site" }).status).toBe(403);
  });

  it("syncs <name>.cast.ts on html watcher events while keeping existing 3D objects", () => {
    const appRoot = makeTempDir();
    const pieceDir = join(appRoot, "card");
    mkdirSync(pieceDir, { recursive: true });
    const htmlPath = join(pieceDir, "card.html");
    const castPath = join(pieceDir, "card.cast.ts");
    const outsideDir = makeTempDir();
    const outsideHtml = join(outsideDir, "outside.html");
    writeFileSync(
      htmlPath,
      '<div data-cast="hero"></div><span data-cast="dots"></span><span data-cast="dots"></span>',
    );
    writeFileSync(outsideHtml, '<div data-cast="outside"></div>');
    writeFileSync(
      castPath,
      [
        'import { box, object } from "@gerak/stage";',
        "",
        "export const cast = {",
        '  hero: box("hero"),',
        '  jarRoot: object("jarRoot"),',
        "} as const;",
        "",
      ].join("\n"),
    );

    const listeners = new Map<string, (path: string) => void>();
    const plugin = motionLivePlugin({ appRoot });
    plugin.configureServer({
      config: { command: "serve", root: appRoot },
      watcher: {
        on(event, listener) {
          listeners.set(event, listener);
        },
        emit() {},
      },
      middlewares: { use() {} },
    });

    listeners.get("change")?.(htmlPath);
    const updated = readFileSync(castPath, "utf8");
    expect(updated).toContain('hero: box("hero")');
    expect(updated).toContain('dots: box("dots", { parts: true })');
    expect(updated).toContain('jarRoot: object("jarRoot")');

    // Ignores HTML outside appRoot and empty HTML without existing cast files.
    listeners.get("add")?.(outsideHtml);
    expect(() => readFileSync(join(outsideDir, "outside.cast.ts"), "utf8")).toThrow();
    const emptyHtml = join(pieceDir, "plain.html");
    writeFileSync(emptyHtml, "<div>Plain</div>");
    listeners.get("add")?.(emptyHtml);
    expect(() => readFileSync(join(pieceDir, "plain.cast.ts"), "utf8")).toThrow();
  });
});
