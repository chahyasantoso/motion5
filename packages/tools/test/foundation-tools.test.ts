import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  createStore,
  elapsedOf,
  inputs,
  liveAt,
  motion,
  springTo,
  state,
  withStore,
  type Pose2d,
} from "@gerak/core";
import { MOUNTS } from "@gerak/dom";
import { box, compileScene, formatStageError, scene } from "@gerak/stage";
import { afterEach, describe, expect, it } from "vitest";
import { DEFAULT_LIMITS } from "../src/page/check";
import { pageDigest } from "../src/page/measure-cache";
import { talkPage } from "../src/pages/talk-page";
import { SCENE_LIMITS } from "../src/scene/limits";
import { DEFAULT_BUDGET_MS, reviewSceneModule } from "../src/scene/review";
import { moduleFromStage, type SceneModule } from "../src/scene/scene";
import * as vitePlugin from "../src/vite/index";
import { removeTemp } from "../../../test/support/temp";

const dirs: string[] = [];

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  dirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of dirs.splice(0)) removeTemp(dir);
});

describe("Slice 5 foundation: extended pageDigest, talkPage, retired vite endpoints, 3-pass & probe review", () => {
  it("changes pageDigest when linked CSS, bootstrap script, local imports, or .glb/.gltf assets change, while excluding the pure scene file", () => {
    const dir = tempDir("digest-ext-");
    mkdirSync(join(dir, "styles"), { recursive: true });
    mkdirSync(join(dir, "src", "sub"), { recursive: true });
    mkdirSync(join(dir, "references"), { recursive: true });

    const page = join(dir, "card.html");
    const linkedCss = join(dir, "styles", "theme.css");
    const deepJs = join(dir, "src", "sub", "deep.js");
    const sceneTs = join(dir, "src", "card.ts");
    const mainTs = join(dir, "src", "card-main.ts");
    const glb = join(dir, "references", "bot.glb");

    writeFileSync(linkedCss, ".card { color: #111; }\n");
    writeFileSync(deepJs, "export const STEP = 1;\n");
    writeFileSync(sceneTs, "export const durationMs = 1000;\n");
    writeFileSync(
      mainTs,
      'import "./card";\nimport { STEP } from "./sub/deep";\nexport const modelUrl = new URL("../references/bot.glb", import.meta.url);\nexport const s = STEP;\n',
    );
    writeFileSync(glb, Buffer.from("glb-v1"));
    writeFileSync(
      page,
      `<!doctype html><html><head><link rel="stylesheet" href="./styles/theme.css"></head><body><div data-cast="card"></div><script type="module" src="./src/card-main.ts"></script></body></html>`,
    );

    const d0 = pageDigest(page);

    writeFileSync(sceneTs, "export const durationMs = 2000;\n");
    expect(pageDigest(page)).toBe(d0);

    writeFileSync(linkedCss, ".card { color: #222; }\n");
    const d1 = pageDigest(page);
    expect(d1).not.toBe(d0);

    writeFileSync(
      mainTs,
      'import "./card";\nimport { STEP } from "./sub/deep";\nexport const s = STEP + 1;\n',
    );
    const d2 = pageDigest(page);
    expect(d2).not.toBe(d1);

    // Restore reference to bot.glb cleanly and test transitive JS edit + deterministic GLB byte edit
    writeFileSync(
      mainTs,
      'import "./card";\nimport { STEP } from "./sub/deep";\nexport const modelUrl = new URL("../references/bot.glb", import.meta.url);\nexport const s = STEP;\n',
    );
    const d2b = pageDigest(page);
    writeFileSync(deepJs, "export const STEP = 2;\n");
    const d3 = pageDigest(page);
    expect(d3).not.toBe(d2b);

    writeFileSync(glb, Buffer.from("glb-v2"));
    const d4 = pageDigest(page);
    expect(d4).not.toBe(d3);
  });

  it("mounts talkPage on a live clock", async () => {
    const saved = {
      document: Reflect.get(globalThis, "document"),
      window: Reflect.get(globalThis, "window"),
      fetch: Reflect.get(globalThis, "fetch"),
      DOMParser: Reflect.get(globalThis, "DOMParser"),
      HTMLElement: Reflect.get(globalThis, "HTMLElement"),
      HTMLStyleElement: Reflect.get(globalThis, "HTMLStyleElement"),
      mounts: Reflect.get(globalThis, MOUNTS),
    };

    class StubElement {
      readonly style: Record<string, string> = {};
      textContent: string | null = "";
      hidden = false;
      offsetWidth = 800;
      offsetHeight = 600;
      clientWidth = 800;
      clientHeight = 600;
      children: StubElement[] = [];
      childNodes: StubElement[] = [];
      parentElement: StubElement | null = null;
      ownerDocument: unknown = undefined;
      private readonly listeners = new Map<string, Set<() => void>>();
      constructor(readonly attrs: Record<string, string> = {}) {}
      setAttribute(name: string, value: string): void {
        this.attrs[name] = value;
      }
      removeAttribute(name: string): void {
        delete this.attrs[name];
      }
      appendChild(): void {}
      querySelectorAll(selector: string): StubElement[] {
        const m = /^\[data-cast="([^"]+)"\]$/.exec(selector);
        if (m === null) return [];
        return this.children.filter((c) => c.attrs["data-cast"] === m[1]);
      }
      querySelector(): null {
        return null;
      }
      addEventListener(type: string, fn: () => void): void {
        const set = this.listeners.get(type) ?? new Set();
        set.add(fn);
        this.listeners.set(type, set);
      }
      removeEventListener(type: string, fn: () => void): void {
        this.listeners.get(type)?.delete(fn);
      }
      getBoundingClientRect() {
        return { left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 };
      }
    }
    class StubStyle extends StubElement {}

    const head = new StubElement();
    const body = new StubElement();
    const rootEl = new StubElement();
    const startBtn = new StubElement();
    const saveBtn = new StubElement();
    const statusEl = new StubElement();
    const frame = new StubElement();
    const headNode = new StubElement({ "data-cast": "head" });
    frame.children = [headNode];

    const doc = {
      head,
      body,
      documentElement: body,
      createElement: (tag: string) => (tag === "style" ? new StubStyle() : new StubElement()),
      getElementById: (id: string) =>
        ({ root: rootEl, start: startBtn, save: saveBtn, status: statusEl })[id] ?? null,
      querySelector: () => null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    };
    headNode.ownerDocument = doc;
    frame.ownerDocument = doc;

    Object.defineProperty(rootEl, "innerHTML", {
      set() {
        /* markup stub injects frame */
      },
    });
    Object.defineProperty(rootEl, "firstElementChild", {
      get: () => frame,
    });
    head.appendChild = () => undefined;

    class StubParser {
      parseFromString() {
        return {
          querySelectorAll: () => [],
          body: {
            querySelectorAll: () => [],
            innerHTML: '<div id="frame"><div data-cast="head"></div></div>',
          },
        };
      }
    }

    Reflect.set(globalThis, "HTMLElement", StubElement);
    Reflect.set(globalThis, "HTMLStyleElement", StubStyle);
    Reflect.set(globalThis, "DOMParser", StubParser);
    Reflect.set(globalThis, "document", doc);
    Reflect.set(globalThis, "window", {
      location: { search: "?piece=demo" },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    });
    Reflect.set(globalThis, "fetch", async () => ({
      ok: true,
      status: 200,
      text: async () =>
        '<html><body><div id="frame"><div data-cast="head"></div></div></body></html>',
    }));
    Reflect.deleteProperty(globalThis, MOUNTS);

    let perfMs = 0;
    const prevPerfNow = globalThis.performance.now.bind(globalThis.performance);
    globalThis.performance.now = () => perfMs;
    const prevRaf = Reflect.get(globalThis, "requestAnimationFrame");
    const prevCaf = Reflect.get(globalThis, "cancelAnimationFrame");
    Reflect.set(globalThis, "requestAnimationFrame", () => 1);
    Reflect.set(globalThis, "cancelAnimationFrame", () => undefined);

    const talkScene = scene({ length: 1000 }, box("head"));
    try {
      await talkPage({ "./demo/src/demo.ts": async () => ({ default: talkScene }) }, {});
      const listed: unknown = Reflect.get(globalThis, MOUNTS);
      expect(Array.isArray(listed) && listed.length > 0).toBe(true);
      const rawMount = Array.isArray(listed) ? listed[0] : undefined;
      expect(rawMount).toBeDefined();
      const durationMs: unknown = Reflect.get(Object(rawMount), "durationMs");
      const driverObj: unknown = Reflect.get(Object(rawMount), "driver");
      const nowFn: unknown = Reflect.get(Object(driverObj), "now");
      const nowTime = typeof nowFn === "function" ? Reflect.apply(nowFn, driverObj, []) : undefined;
      expect(durationMs).toBeUndefined();
      expect(Reflect.get(Object(Reflect.get(Object(nowTime), "clock")), "kind")).toBe("live");
      const setFn: unknown = Reflect.get(Object(rawMount), "set");
      const mouthContract = inputs({ values: { mouthOpen: {} } });
      if (typeof setFn === "function") {
        for (let i = 0; i < 6; i += 1) {
          perfMs = i * 2000;
          Reflect.apply(setFn, rawMount, [mouthContract, "mouthOpen", i * 0.1]);
        }
      }
      const inputFn: unknown = Reflect.get(Object(driverObj), "input");
      const evs = typeof inputFn === "function" ? Reflect.apply(inputFn, driverObj, []) : undefined;
      expect(Array.isArray(evs) ? evs.map((e) => Reflect.get(Object(e), "at")) : []).toEqual([
        6000, 8000, 10000,
      ]);
      const disposeFn: unknown = Reflect.get(Object(rawMount), "dispose");
      if (typeof disposeFn === "function") Reflect.apply(disposeFn, rawMount, []);
    } finally {
      globalThis.performance.now = prevPerfNow;
      if (prevRaf === undefined) Reflect.deleteProperty(globalThis, "requestAnimationFrame");
      else Reflect.set(globalThis, "requestAnimationFrame", prevRaf);
      if (prevCaf === undefined) Reflect.deleteProperty(globalThis, "cancelAnimationFrame");
      else Reflect.set(globalThis, "cancelAnimationFrame", prevCaf);
      for (const [k, v] of Object.entries(saved)) {
        if (k === "mounts") continue;
        if (v === undefined) Reflect.deleteProperty(globalThis, k);
        else Reflect.set(globalThis, k, v);
      }
      if (saved.mounts === undefined) Reflect.deleteProperty(globalThis, MOUNTS);
      else Reflect.set(globalThis, MOUNTS, saved.mounts);
    }
  });

  it("removes /__motion/source, /__motion/edit, and AST source edit helpers from @gerak/tools/vite", () => {
    expect("scanNumericLiterals" in vitePlugin).toBe(false);
    expect("resolveSceneFile" in vitePlugin).toBe(false);
    expect("applySourceEdit" in vitePlugin).toBe(false);

    let handler:
      | ((
          req: vitePlugin.MotionLiveRequest,
          res: vitePlugin.MotionLiveResponse,
          next: () => void,
        ) => void)
      | undefined;
    vitePlugin.motionLivePlugin({ appRoot: "/project" }).configureServer({
      config: { command: "serve", isProduction: false, root: "/project" },
      middlewares: {
        use(fn) {
          handler = fn;
        },
      },
    });
    expect(handler).toBeDefined();

    for (const req of [
      { method: "GET", url: "/__motion/source?file=src/a.ts", on() {} },
      { method: "POST", url: "/__motion/edit", on() {} },
    ]) {
      const res: vitePlugin.MotionLiveResponse = { statusCode: 0, setHeader() {}, end() {} };
      let passed = false;
      handler?.(req, res, () => {
        passed = true;
      });
      expect(passed).toBe(true);
      expect(res.statusCode).toBe(0);
    }
  });

  it("isolates movedUnderDriver probes on stage modules under withProbeStore", () => {
    const follower = state<number>(10, (current, ev) =>
      typeof ev.value === "number" ? ev.value : current,
    );
    const sprung = springTo(follower, (v) => v);
    const built = compileScene(
      scene(
        { length: 160 },
        box("idle", { watch: true }).moves(
          motion((t, ctx): Pose2d => {
            const events = ctx?.events ?? [];
            const val = sprung(t, events) + follower(t, events);
            return { x: val * 0 };
          }),
        ),
      ),
    );
    if (!built.ok) throw new Error(built.errors.map(formatStageError).join("\n"));
    const mod = moduleFromStage(built.stage);

    const callerStore = createStore();
    const controlStore = createStore();
    const seed = [{ kind: "value" as const, name: "go", at: 0, value: 50 }];
    withStore(callerStore, () => {
      sprung(liveAt(100), seed);
      follower(liveAt(100), seed);
    });
    withStore(controlStore, () => {
      sprung(liveAt(100), seed);
      follower(liveAt(100), seed);
    });

    const reviewed = withStore(callerStore, () =>
      reviewSceneModule(mod, {
        ...SCENE_LIMITS,
        jump: DEFAULT_LIMITS.jump,
        hold: DEFAULT_LIMITS.hold,
        budget: DEFAULT_BUDGET_MS,
      }),
    );
    expect(reviewed.kind).toBe("reviewed");
    expect(
      withStore(callerStore, () => ({
        sprung: sprung(liveAt(200), seed),
        follower: follower(liveAt(200), seed),
      })),
    ).toEqual(
      withStore(controlStore, () => ({
        sprung: sprung(liveAt(200), seed),
        follower: follower(liveAt(200), seed),
      })),
    );
  });

  it("isolates probes and consolidates passes in reviewSceneModule", () => {
    const follower = state<number>(10, (current, ev) =>
      typeof ev.value === "number" ? ev.value : current,
    );
    const sprung = springTo(follower, (v) => v);
    let evals = 0;

    const plainModule: SceneModule = {
      durationMs: 160, // 11 steps: [0, 16, ..., 160], soughtOrder: 3 steps [0, 64, 128]
      cues: [{ kind: "value", name: "tap", at: 40, value: 50 }],
      limits: {},
      scene: (time, events) => {
        evals += 1;
        const val = sprung(time, events) + follower(time, events);
        return { card: { x: 20 * time.progress + val * 0 } };
      },
    };

    const callerStore = createStore();
    const controlStore = createStore();
    const seed = [{ kind: "value" as const, name: "go", at: 0, value: 50 }];
    withStore(callerStore, () => {
      sprung(liveAt(100), seed);
      follower(liveAt(100), seed);
    });
    withStore(controlStore, () => {
      sprung(liveAt(100), seed);
      follower(liveAt(100), seed);
    });

    const reviewed = withStore(callerStore, () =>
      reviewSceneModule(plainModule, {
        ...SCENE_LIMITS,
        jump: DEFAULT_LIMITS.jump,
        hold: DEFAULT_LIMITS.hold,
        budget: DEFAULT_BUDGET_MS,
      }),
    );
    expect(reviewed.kind).toBe("reviewed");
    expect(
      withStore(callerStore, () => ({
        sprung: sprung(liveAt(200), seed),
        follower: follower(liveAt(200), seed),
      })),
    ).toEqual(
      withStore(controlStore, () => ({
        sprung: sprung(liveAt(200), seed),
        follower: follower(liveAt(200), seed),
      })),
    );
    // 6 passes used >= 50 evaluations (44 forward + 6 seek); 3 passes uses <= 28 evaluations.
    expect(evals).toBeLessThanOrEqual(28);
  });

  it("counts frame-0 evaluation cost against budget and tracks @import inside sibling css files", () => {
    const dir = tempDir("sibling-css-import-");
    mkdirSync(join(dir, "tokens"), { recursive: true });
    const page = join(dir, "demo.html");
    const siblingCss = join(dir, "demo.css");
    const importedCss = join(dir, "tokens", "colors.css");
    writeFileSync(importedCss, ":root { --bg: #000; }\n");
    writeFileSync(siblingCss, '@import "./tokens/colors.css";\nbody { background: var(--bg); }\n');
    writeFileSync(page, "<!doctype html><html><body></body></html>");

    const before = pageDigest(page);
    writeFileSync(importedCss, ":root { --bg: #fff; }\n");
    expect(pageDigest(page)).not.toBe(before);

    // Simulate an expensive frame-0 evaluation in a stage module while keeping subsequent steps fast.
    const built = compileScene(
      scene(
        { length: 64 },
        box("slow").moves(
          motion((t): Pose2d => {
            if ((elapsedOf(t.clock) ?? 0) === 0) {
              const until = performance.now() + 25;
              while (performance.now() < until) {
                /* spin only on frame 0 */
              }
            }
            return { x: 10 * t.progress };
          }),
        ),
      ),
    );
    if (!built.ok) throw new Error(built.errors.map(formatStageError).join("\n"));
    const reviewed = reviewSceneModule(moduleFromStage(built.stage), {
      ...SCENE_LIMITS,
      jump: DEFAULT_LIMITS.jump,
      hold: 0,
      budget: 5,
    });
    expect(reviewed.kind).toBe("reviewed");
    expect(reviewed.findings.some((f) => f.includes("budget") || f.includes("ms"))).toBe(true);
  });
});
