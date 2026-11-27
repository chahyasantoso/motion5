import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { callerPiecesRoot, withPage } from "@gerak/tools/page";

const PIECES_ROOT = callerPiecesRoot();
const PIECES_SOURCE = { kind: "serve", root: PIECES_ROOT } as const;
const PREFIX = "dom-listeners-scratch-";
const STEP_TIMEOUT_MS = 5000;
let copies = 0;

const FORBIDDEN_EXACT = new Set([
  "pointerenter",
  "pointerleave",
  "pointerover",
  "pointerout",
  "pointerdown",
  "pointerup",
  "pointermove",
  "click",
  "focus",
  "focusin",
  "focusout",
  "blur",
]);

function isForbiddenType(type: string): boolean {
  return (
    FORBIDDEN_EXACT.has(type) ||
    type.startsWith("mouse") ||
    type.startsWith("touch") ||
    type.startsWith("key")
  );
}

function removeLeftovers(): void {
  for (const folder of readdirSync(PIECES_ROOT)) {
    if (folder.startsWith(PREFIX)) {
      rmSync(join(PIECES_ROOT, folder), { recursive: true, force: true });
    }
  }
}

function writeScratchPage(): { readonly name: string; readonly html: string } {
  copies += 1;
  const name = `${PREFIX}${copies}`;
  const dir = join(PIECES_ROOT, name);
  const srcDir = join(dir, "src");
  mkdirSync(srcDir, { recursive: true });
  writeFileSync(
    join(dir, `${name}.html`),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>dom listeners browser test</title>
    <style>
      body { margin: 0; height: 2000px; font: 20px/1.4 sans-serif; }
      #card { width: 120px; height: 60px; margin: 24px; background: #225; }
      #label { margin: 24px; width: 160px; }
      #badge-wrap { margin: 24px; }
    </style>
  </head>
  <body>
    <div id="card" data-cast="card" tabindex="0"></div>
    <p id="label" data-cast="label">Motion label</p>
    <svg id="badge-wrap" width="60" height="60">
      <path id="badge" data-cast="badge" d="M 30 10 A 20 20 0 1 0 30 50 A 20 20 0 1 0 30 10 Z" />
    </svg>
    <script type="module" src="/${name}/src/main.ts"></script>
  </body>
</html>
`,
    "utf8",
  );
  writeFileSync(
    join(srcDir, "main.ts"),
    `import { pointer, rectPath, scroll } from "@gerak/core";
import { mount } from "@gerak/dom";
import { bind, box, scene, shape, text } from "@gerak/stage";

interface RecordedAdd {
  readonly target: EventTarget;
  readonly type: string;
  readonly listener: EventListenerOrEventListenerObject;
  readonly passive: boolean;
}

const added: RecordedAdd[] = [];
const active: RecordedAdd[] = [];
const originalAdd = EventTarget.prototype.addEventListener;
const originalRemove = EventTarget.prototype.removeEventListener;

function isPassive(options: boolean | AddEventListenerOptions | undefined): boolean {
  return typeof options === "object" && options !== null && options.passive === true;
}

EventTarget.prototype.addEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject | null,
  options?: boolean | AddEventListenerOptions,
): void {
  if (listener !== null) {
    const entry: RecordedAdd = { target: this, type, listener, passive: isPassive(options) };
    added.push(entry);
    active.push(entry);
  }
  originalAdd.call(this, type, listener, options);
};

EventTarget.prototype.removeEventListener = function (
  type: string,
  listener: EventListenerOrEventListenerObject | null,
  options?: boolean | EventListenerOptions,
): void {
  if (listener !== null) {
    const index = active.findIndex(
      (entry) => entry.target === this && entry.type === type && entry.listener === listener,
    );
    if (index !== -1) active.splice(index, 1);
  }
  originalRemove.call(this, type, listener, options);
};

const card = box("card").moves(bind({ x: (t, e) => pointer.x(t, e) * 100 }));
const label = text("label").moves(bind({ y: (t, e) => scroll.y(t, e) }));
const badge = shape("badge", rectPath({ x: 10, y: 10, width: 40, height: 40 }));
const piece = scene(card, label, badge);

const mounted = mount(piece, { clock: "live" });
Reflect.set(window, "__mounted", mounted);
Reflect.set(window, "__listenerProbe", {
  snapshotAdded: () => added.map((entry) => ({ type: entry.type, passive: entry.passive })),
  remainingTypes: () => active.map((entry) => entry.type),
});
`,
    "utf8",
  );
  return { name, html: `${name}/${name}.html` };
}

beforeAll(removeLeftovers);
afterAll(removeLeftovers);

describe("mount DOM listeners in the browser", () => {
  it("attaches only a passive scroll listener and no interaction listeners, and removes all on dispose", async () => {
    const scratch = writeScratchPage();
    const { value, pageErrors } = await withPage(
      {
        page: scratch.html,
        width: 800,
        height: 600,
        source: PIECES_SOURCE,
        clock: "real",
      },
      async (session) => {
        const { page } = session;
        page.setDefaultTimeout(STEP_TIMEOUT_MS);

        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() =>
                requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
              );
            }),
        );

        for (const selector of ["#card", "#label", "#badge"]) {
          const boxRect = await page.locator(selector).boundingBox();
          if (boxRect !== null) {
            await page.mouse.move(boxRect.x + boxRect.width / 2, boxRect.y + boxRect.height / 2);
          }
        }
        await page.locator("#card").click();
        await page.locator("#card").focus();

        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );

        const beforeDispose = await page.evaluate(() => {
          const probe = Reflect.get(window, "__listenerProbe");
          const snapshotAdded =
            typeof probe === "object" && probe !== null
              ? Reflect.get(probe, "snapshotAdded")
              : undefined;
          if (typeof snapshotAdded !== "function") return [];
          const result: unknown = Reflect.apply(snapshotAdded, undefined, []);
          return Array.isArray(result)
            ? result.map((item) => ({
                type: String(Reflect.get(item, "type")),
                passive: Reflect.get(item, "passive") === true,
              }))
            : [];
        });

        const afterDispose = await page.evaluate(() => {
          const mounted = Reflect.get(window, "__mounted");
          const dispose =
            typeof mounted === "object" && mounted !== null
              ? Reflect.get(mounted, "dispose")
              : undefined;
          if (typeof dispose === "function") {
            Reflect.apply(dispose, mounted, []);
          }
          const probe = Reflect.get(window, "__listenerProbe");
          const remainingTypes =
            typeof probe === "object" && probe !== null
              ? Reflect.get(probe, "remainingTypes")
              : undefined;
          if (typeof remainingTypes !== "function") return ["missing-probe"];
          const result: unknown = Reflect.apply(remainingTypes, undefined, []);
          return Array.isArray(result) ? result.map(String) : ["invalid-probe"];
        });

        return { beforeDispose, afterDispose };
      },
    );

    expect(pageErrors).toEqual([]);

    const scrollListeners = value.beforeDispose.filter((entry) => entry.type === "scroll");
    expect(scrollListeners).toHaveLength(1);
    expect(scrollListeners[0]?.passive).toBe(true);

    const forbidden = value.beforeDispose.filter((entry) => isForbiddenType(entry.type));
    expect(forbidden.map((entry) => entry.type)).toEqual([]);

    expect(value.afterDispose).toEqual([]);
  }, 30000);
});
